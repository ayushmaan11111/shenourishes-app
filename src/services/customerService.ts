import { 
  ref, 
  get, 
  set, 
  update, 
  serverTimestamp,
  type DatabaseReference
} from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import type { 
  CustomerRecord, 
  OnboardingStepKey,
  PersonalDetails,
  GoalAssessment,
  LifestyleHealth,
  SupportExpectations,
  DietaryNutrition,
  PhysicalActivity,
  Commitment,
  PlanSelection,
  BloodTestAssessment,
} from '../types/customer';

const LOCAL_STORAGE_KEY_PREFIX = 'she_nourishes_cust_';

/**
 * Initializes a new blank customer structure with sensible default fields.
 */
export function createDefaultCustomerRecord(uid: string, fullName = '', email = '', mobile = ''): CustomerRecord {
  const today = new Date().toISOString().split('T')[0];

  return {
    uid,
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      onboardingCompleted: false,
      currentOnboardingStep: 1,
      appVersion: '1.0.0',
    },
    personalDetails: {
      fullName,
      date: today,
      age: null,
      gender: 'Female',
      mobileNumber: mobile,
      emailAddress: email,
      address: '',
      height: null,
      heightUnit: 'cm',
      weight: null,
      weightUnit: 'kg',
      waistCircumference: {
        atNaval: null,
        aboveNaval: null,
        belowNaval: null,
        waistUnit: 'cm',
      },
    },
    lifestyleHealth: {
      sleepDuration: '',
      sleepQuality: '',
      stressLevel: '',
      anxietyLevel: '',
      dailySittingDuration: '',
      digestiveIssues: [],
      otherDigestiveIssue: '',
      otherLifestyleFactors: '',
    },
    supportExpectations: {
      programSupport: [],
      otherProgramSupport: '',
      preferredContactMethod: 'WhatsApp',
      otherContactMethod: '',
    },
    dietaryNutrition: {
      dietType: '',
      otherDietType: '',
      hasFoodAllergies: false,
      foodAllergiesOrIntolerances: '',
      dailyWaterIntake: '',
      dailyMeals: '',
      eatingOutFrequency: '',
      smokingStatus: 'NEVER',
      smokingQuantityPerDay: '',
      alcoholStatus: 'NEVER',
      alcoholDrinksPerWeek: '',
    },
    physicalActivity: {
      preferredExerciseTypes: [],
      currentActivityLevel: 'Sedentary',
      calculatedIntensity: 1.5,
      activityTrait: 'Low at energy',
      usualWorkoutIntensity: '',
      usualWorkoutDuration: '',
      realisticExerciseDaysPerWeek: '',
    },
    commitment: {
      commitmentLevel: '',
      agreesToFollowPlan: true,
    },
    planSelection: {
      planId: 'plan_3m_transform',
      planName: '3-Month Comprehensive Transformation',
      duration: '3 Months (12 Weeks)',
      tagline: 'Our most popular plan for sustainable fat loss and metabolic healing',
      features: [
        'Full Body Recomposition & Hormonal Balance',
        'Weekly Diet Fine-Tuning & Metric Calibration',
        'Dedicated Senior Clinical Nutritionist',
        'Advanced Supplement Stack Formulation',
      ],
      isPopular: true,
    },
    bloodTest: {
      reportStatus: '',
      biomarkersChecked: [],
      knownAbnormalitiesNotes: '',
    },
    goalAssessment: {
      primaryGoals: [],
      otherGoal: '',
      goalTimeline: '',
      goalImportance: '',
      biggestFitnessChallenges: [],
      otherFitnessChallenge: '',
      nutritionistSupportExpectations: [],
      otherNutritionistSupport: '',
    },
  };
}

/**
 * Fetch a customer record by their Firebase Authentication UID.
 */
export async function getCustomerRecord(uid: string): Promise<CustomerRecord | null> {
  if (!uid) return null;

  // 1. Try Firebase Realtime Database if configured
  if (isFirebaseConfigured && database) {
    try {
      const customerRef: DatabaseReference = ref(database, `customers/${uid}`);
      const snapshot = await get(customerRef);
      if (snapshot.exists()) {
        const data = snapshot.val() as CustomerRecord;
        // Keep local cache up to date
        saveToLocalStorage(uid, data);
        return data;
      }
    } catch (error) {
      console.warn('Realtime database fetch failed, checking local backup:', error);
    }
  }

  // 2. Fallback to LocalStorage
  return getFromLocalStorage(uid);
}

/**
 * Recursively cleans undefined properties from an object/array,
 * ensuring Firebase Realtime Database never throws "first argument contains undefined".
 */
export function cleanUndefinedForFirebase<T>(val: T): T {
  if (val === undefined) {
    return null as unknown as T;
  }
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map((item) => cleanUndefinedForFirebase(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(val)) {
    if (value !== undefined) {
      result[key] = cleanUndefinedForFirebase(value);
    }
  }
  return result as T;
}

/**
 * Creates or initializes the initial customer record upon signup.
 */
export async function initializeCustomerRecord(
  uid: string,
  fullName: string,
  email: string,
  mobile: string
): Promise<CustomerRecord> {
  const existing = await getCustomerRecord(uid);
  if (existing) {
    return existing;
  }

  const newRecord = createDefaultCustomerRecord(uid, fullName, email, mobile);
  saveToLocalStorage(uid, newRecord);

  if (isFirebaseConfigured && database && uid) {
    try {
      const customerRef = ref(database, `customers/${uid}`);
      const cleaned = cleanUndefinedForFirebase({
        ...newRecord,
        metadata: {
          ...newRecord.metadata,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      });

      await Promise.race([
        set(customerRef, cleaned),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud sync timeout')), 3500)),
      ]);
    } catch (error) {
      console.warn('Firebase RTDB initializeCustomerRecord warning (saved locally):', error);
    }
  }

  return newRecord;
}

/**
 * Progressively save data for a specific onboarding step.
 */
export async function saveStepData<T extends 
  PersonalDetails | 
  GoalAssessment | 
  LifestyleHealth | 
  SupportExpectations | 
  DietaryNutrition | 
  PhysicalActivity | 
  Commitment | 
  PlanSelection |
  BloodTestAssessment |
  { giftId: string; giftTitle?: string; selectedAt?: number }
>(
  uid: string,
  stepKey: OnboardingStepKey,
  stepData: T,
  stepNumber: number,
  isComplete = false
): Promise<CustomerRecord> {
  // Load current record
  let record = await getCustomerRecord(uid);
  if (!record) {
    record = createDefaultCustomerRecord(uid);
  }

  // Merge the step data into the full record
  const updatedRecord: CustomerRecord = {
    ...record,
    [stepKey]: stepData,
    metadata: {
      ...record.metadata,
      currentOnboardingStep: stepNumber,
      onboardingCompleted: isComplete ? true : record.metadata.onboardingCompleted,
      updatedAt: Date.now(),
    },
  };

  // 1. ALWAYS persist locally first so progress is never lost
  saveToLocalStorage(uid, updatedRecord);

  // 2. Sync with Firebase Realtime Database
  if (isFirebaseConfigured && database && uid) {
    try {
      const updates: Record<string, unknown> = {};
      updates[`customers/${uid}/${stepKey}`] = cleanUndefinedForFirebase(stepData);
      updates[`customers/${uid}/metadata/currentOnboardingStep`] = stepNumber;
      updates[`customers/${uid}/metadata/updatedAt`] = serverTimestamp();
      if (isComplete) {
        updates[`customers/${uid}/metadata/onboardingCompleted`] = true;
      }

      await Promise.race([
        update(ref(database), updates),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud sync timeout')), 3500)),
      ]);
    } catch (error) {
      console.warn(`Firebase RTDB saveStepData warning for ${stepKey} (saved locally):`, error);
      // DO NOT throw error: local persistence already succeeded
    }
  }

  return updatedRecord;
}

/**
 * Saves or updates the entire customer record (e.g. from Profile review / edit assessment / onboarding completion).
 */
export async function saveFullCustomerRecord(customer: CustomerRecord): Promise<CustomerRecord> {
  const { uid } = customer;
  const updated: CustomerRecord = {
    ...customer,
    metadata: {
      ...customer.metadata,
      updatedAt: Date.now(),
    },
  };

  // 1. ALWAYS persist locally first so completion and data are guaranteed
  saveToLocalStorage(uid, updated);

  // 2. Sync with Firebase Realtime Database with undefined cleaning and timeout race
  if (isFirebaseConfigured && database && uid) {
    try {
      const customerRef = ref(database, `customers/${uid}`);
      const cleaned = cleanUndefinedForFirebase({
        ...updated,
        metadata: {
          ...updated.metadata,
          updatedAt: serverTimestamp(),
        },
      });

      await Promise.race([
        set(customerRef, cleaned),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud sync timeout')), 4000)),
      ]);
    } catch (error) {
      console.warn('Firebase RTDB saveFullCustomerRecord warning (saved locally):', error);
      // DO NOT throw error: local persistence is complete and user must transition smoothly to the app
    }
  }

  return updated;
}

// LocalStorage helpers
function saveToLocalStorage(uid: string, record: CustomerRecord): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${uid}`, JSON.stringify(record));
    
    // If onboarding is completed on record, immediately store the completion key
    if (record.metadata?.onboardingCompleted) {
      localStorage.setItem(`she_nourishes_onboarding_completed_${uid}`, 'true');
    }

    // Also track in registry of all client UIDs
    const registryKey = 'she_nourishes_client_registry';
    const rawRegistry = localStorage.getItem(registryKey);
    const registry: string[] = rawRegistry ? JSON.parse(rawRegistry) : [];
    if (!registry.includes(uid)) {
      registry.push(uid);
      localStorage.setItem(registryKey, JSON.stringify(registry));
    }
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

function getFromLocalStorage(uid: string): CustomerRecord | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${uid}`);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerRecord;
  } catch (e) {
    console.warn('LocalStorage read error:', e);
    return null;
  }
}

// Sample clinical demo clients for immediate admin review & prescription testing
export const INITIAL_CLINICAL_CLIENTS: CustomerRecord[] = [
  {
    ...createDefaultCustomerRecord('cust_priya_sharma', 'Priya Sharma', 'priya.sharma@example.com', '+91 98765 43210'),
    personalDetails: {
      fullName: 'Priya Sharma',
      date: '2026-08-15',
      age: 29,
      gender: 'Female',
      mobileNumber: '+91 98765 43210',
      emailAddress: 'priya.sharma@example.com',
      address: 'Bandra West, Mumbai',
      height: 165,
      heightUnit: 'cm',
      weight: 64.5,
      weightUnit: 'kg',
      waistCircumference: { atNaval: 76, aboveNaval: 72, belowNaval: 80, waistUnit: 'cm' },
    },
    goalAssessment: {
      primaryGoals: ['Bone Health Support', 'Better Sleep', 'Muscle Gain'],
      otherGoal: '',
      goalTimeline: '1 – 3 months',
      goalImportance: 'High',
      biggestFitnessChallenges: ['Nutrition', 'Work / Travel'],
      otherFitnessChallenge: '',
      nutritionistSupportExpectations: ['Personalized Diet Plan', 'Supplement Guidance'],
      otherNutritionistSupport: '',
    },
    physicalActivity: {
      preferredExerciseTypes: ['Strength Training', 'Pilates'],
      currentActivityLevel: 'Moderately Active',
      calculatedIntensity: 2.0,
      activityTrait: 'Muscles gain',
      usualWorkoutIntensity: 'Moderate',
      usualWorkoutDuration: '45 – 60 min',
      realisticExerciseDaysPerWeek: '4 Days',
    },
    dietaryNutrition: {
      dietType: 'VEGETARIAN',
      otherDietType: '',
      hasFoodAllergies: false,
      foodAllergiesOrIntolerances: 'None',
      dailyWaterIntake: '2 – 3 L',
      dailyMeals: '4 MEALS',
      eatingOutFrequency: '1 – 2 TIMES PER WEEK',
      smokingStatus: 'NEVER',
      smokingQuantityPerDay: '',
      alcoholStatus: 'NEVER',
      alcoholDrinksPerWeek: '',
    },
    metadata: {
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now(),
      onboardingCompleted: true,
      currentOnboardingStep: 11,
      appVersion: '1.0.0',
    },
  },
  {
    ...createDefaultCustomerRecord('cust_ananya_roy', 'Ananya Roy', 'ananya.roy@example.com', '+91 98112 34567'),
    personalDetails: {
      fullName: 'Ananya Roy',
      date: '2026-08-18',
      age: 34,
      gender: 'Female',
      mobileNumber: '+91 98112 34567',
      emailAddress: 'ananya.roy@example.com',
      address: 'Indiranagar, Bengaluru',
      height: 158,
      heightUnit: 'cm',
      weight: 71.0,
      weightUnit: 'kg',
      waistCircumference: { atNaval: 84, aboveNaval: 80, belowNaval: 88, waistUnit: 'cm' },
    },
    goalAssessment: {
      primaryGoals: ['Low Energy', 'Experience of Constipation and Flatulence', 'Fat Loss'],
      otherGoal: '',
      goalTimeline: '3 – 6 months',
      goalImportance: 'Very High',
      biggestFitnessChallenges: ['Nutrition', 'Discipline & Habits'],
      otherFitnessChallenge: '',
      nutritionistSupportExpectations: ['Personalized Diet Plan', 'Habit Building'],
      otherNutritionistSupport: '',
    },
    physicalActivity: {
      preferredExerciseTypes: ['Yoga', 'None / Sedentary'],
      currentActivityLevel: 'Sedentary',
      calculatedIntensity: 1.5,
      activityTrait: 'Low at energy',
      usualWorkoutIntensity: 'Low',
      usualWorkoutDuration: '30 – 45 min',
      realisticExerciseDaysPerWeek: '3 Days',
    },
    dietaryNutrition: {
      dietType: 'NON-VEGETARIAN',
      otherDietType: '',
      hasFoodAllergies: false,
      foodAllergiesOrIntolerances: 'Mild lactose sensitivity',
      dailyWaterIntake: '1 – 2 L',
      dailyMeals: '2 MEALS',
      eatingOutFrequency: '3 – 4 TIMES PER WEEK',
      smokingStatus: 'NEVER',
      smokingQuantityPerDay: '',
      alcoholStatus: 'CURRENTLY',
      alcoholDrinksPerWeek: '1 – 2 DRINKS',
    },
    metadata: {
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now(),
      onboardingCompleted: true,
      currentOnboardingStep: 11,
      appVersion: '1.0.0',
    },
  },
];

/**
 * Fetches all registered clients from database & local cache for the Admin Panel Client Selector.
 */
export async function getAllCustomerRecords(): Promise<CustomerRecord[]> {
  const clientsMap = new Map<string, CustomerRecord>();

  // 1. Seed demo clients if not present
  for (const client of INITIAL_CLINICAL_CLIENTS) {
    clientsMap.set(client.uid, client);
    if (!getFromLocalStorage(client.uid)) {
      saveToLocalStorage(client.uid, client);
    }
  }

  // 2. Fetch from Firebase Realtime Database if active
  if (isFirebaseConfigured && database) {
    try {
      const customersRef = ref(database, 'customers');
      const snapshot = await get(customersRef);
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, CustomerRecord>;
        Object.values(data).forEach((rec) => {
          if (rec && rec.uid) {
            clientsMap.set(rec.uid, rec);
            saveToLocalStorage(rec.uid, rec);
          }
        });
      }
    } catch (e) {
      console.warn('Realtime DB fetch all customers error:', e);
    }
  }

  // 3. Check local registry
  try {
    const registryKey = 'she_nourishes_client_registry';
    const rawRegistry = localStorage.getItem(registryKey);
    const registry: string[] = rawRegistry ? JSON.parse(rawRegistry) : [];
    for (const uid of registry) {
      const rec = getFromLocalStorage(uid);
      if (rec) {
        clientsMap.set(uid, rec);
      }
    }
  } catch (e) {
    console.warn('Local registry error:', e);
  }

  return Array.from(clientsMap.values());
}
