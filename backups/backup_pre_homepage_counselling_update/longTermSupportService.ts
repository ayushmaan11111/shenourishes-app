/**
 * Long-Term Support Program Service
 * Manages database persistence, Realtime Sync, default state generation,
 * and automated triggers for the 10-step Long-Term Transformation Program.
 */

import { ref, set, get } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { sendLongTermProgramStartedEmail } from './resendEmailService';
import type { LongTermSupportSessionRecord, LongTermSupportPackage } from '../types/longTermSupport';

const STORAGE_KEY_PREFIX = 'she_nourishes_long_term_record_';

export const DEFAULT_PACKAGES: LongTermSupportPackage[] = [
  {
    id: 'pkg_1month',
    name: '1 Month Intensive Transformation Package',
    durationMonths: 1,
    priceInr: 25000,
    originalPriceInr: 29999,
    followUpDays: '6 Follow-Up Sessions',
    bloodTestsIncluded: [
      '1 Blood Sugar Fasting Test',
      '1 Vitamin D 25 Hydroxyl (Vitamin D) Test',
      '1 Vitamin B12 Test',
      '1 Lipoprotein Test',
    ],
    personalizedServices: [
      '1 Personalized Training Session',
      '1 Personalized Exercise Chart',
    ],
    welcomeGifts: [
      '1 Training Bag',
    ],
    posterImageUrl: '/images/packages/1-month.png',
    features: [
      '6 Follow-up sessions',
      '4 Blood Diagnostics (Sugar, Vit D, Vit B12, Lipoprotein)',
      '1 Personalized Training & Exercise Chart',
      'Welcome Gift: 1 Training Bag',
    ],
    paymentStatus: 'Pending Admin Link' as const,
  },
  {
    id: 'pkg_2months',
    name: '2 Month Consistency & Growth Package',
    durationMonths: 2,
    priceInr: 35599,
    originalPriceInr: 42999,
    followUpDays: '16 Days Follow-Up Sessions',
    bloodTestsIncluded: [
      '2 Blood Sugar Fasting Tests',
      '2 Vitamin D 25 Hydroxyl (Vitamin D) Tests',
      '1 Vitamin B12 Test',
      '1 Lipoprotein Test',
    ],
    personalizedServices: [
      '1 Personalized Training',
      '1 Personalized Exercise Chart',
      'Customized Workouts & Priority Scheduling',
    ],
    welcomeGifts: [
      '1 Training Bag',
      '1 Aquasoft Bottle',
      '1 Towel',
      '1 Snacks Box',
    ],
    posterImageUrl: '/images/packages/2-month.png',
    features: [
      '16 Days Follow-up sessions',
      '6 Blood Diagnostics (2 Fasting Sugar, 2 Vit D, Vit B12, Lipoprotein)',
      'Customized Workouts & Bi-weekly adjustments',
      'Welcome Kit: Bag, Aquasoft Bottle, Towel, Snacks Box',
    ],
    paymentStatus: 'Pending Admin Link' as const,
  },
  {
    id: 'pkg_3months',
    name: '3 Month Vitality & Metabolic Reset Package',
    durationMonths: 3,
    priceInr: 51199,
    originalPriceInr: 59999,
    followUpDays: '21 Days Follow-Up',
    bloodTestsIncluded: [
      '3 Sugar Fasting Tests',
      '3 Vitamin B12 Tests',
      '3 D25 Hydroxyl Tests',
      '1 Lipoprotein Test',
    ],
    personalizedServices: [
      '1 Exercise Chart (Provided Manually)',
      'Continuous WhatsApp Accountability',
    ],
    welcomeGifts: [
      '1 Training Bag',
      '1 Shaker',
      '1 Aquasoft Bottle',
      '1 Towel',
      '1 Snacks Box',
      '1 PUMA T-Shirt',
    ],
    posterImageUrl: '/images/packages/3-month.png',
    features: [
      '21 Days Follow-up',
      'Blood Tests: 3 Sugar Fasting, 3 Vitamin B12, 3 D25 Hydroxyl & 1 Lipoprotein',
      '1 Exercise Chart (Provided manually after 3 months)',
      'Welcome Gifts: Bag, Shaker, Aquasoft, Towel, Snacks Box, PUMA T-Shirt',
    ],
    paymentStatus: 'Pending Admin Link' as const,
  },
  {
    id: 'pkg_6months',
    name: '6 Month Body Recomposition & Cellular Healing Package',
    durationMonths: 6,
    priceInr: 91999,
    originalPriceInr: 109999,
    followUpDays: '41 Days Follow-Up Sessions',
    bloodTestsIncluded: [
      '3 Sugar Fasting Tests',
      '3 Vitamin B12 Tests',
      '3 Vitamin D25 Hydroxyl Tests',
      '2 Lipoprotein Cholesterol Tests',
    ],
    personalizedServices: [
      '1 Personalized Diet Plan',
      '1 Personalized Exercise Chart',
      'Weekly Adjustments & Clinical Physician Reviews',
    ],
    welcomeGifts: [
      '1 Training Bag',
      '1 Aquasoft Shaker',
      '1 Towel',
      '1 Snacks Box',
      '1 Keychain',
      '1 Massager',
    ],
    posterImageUrl: '/images/packages/6-month.png',
    features: [
      '41 Days Follow-up sessions',
      '11 Clinical Diagnostic Biomarker Tests',
      'Personalized Diet Plan + Exercise Chart',
      'Premium Kit: Bag, Aquasoft Shaker, Towel, Snacks Box, Keychain, Massager',
    ],
    paymentStatus: 'Pending Admin Link' as const,
  },
  {
    id: 'pkg_9months',
    name: '9 Month Deep Cellular Optimization Package',
    durationMonths: 9,
    priceInr: 131999,
    originalPriceInr: 149999,
    followUpDays: '65 Days Follow-Up Sessions',
    bloodTestsIncluded: [
      '3 Sugar Fasting Tests',
      '3 Vitamin B12 Tests',
      '3 Vitamin D3 Hydroxyl Tests',
      '2 Lipoprotein Tests',
    ],
    personalizedServices: [
      '1 Personalized Exercise Chart',
      'Dynamic Macro Cycling & Muscle Hypertrophy Protocol',
    ],
    welcomeGifts: [
      '1 Training Bag (Skechers)',
      '1 Aquasoft Shaker',
      '1 Towel',
      '1 Snacks Box',
      '1 PUMA T-Shirt',
      '1 BMR Machine',
    ],
    posterImageUrl: '/images/packages/9-month.png',
    features: [
      '65 Days Follow-up sessions',
      '11 Biomarker Diagnostics & Clinical Monitoring',
      'Personalized Exercise Chart & Macro Protocol',
      'VIP Gifts: Skechers Bag, Aquasoft, Towel, Snacks Box, PUMA T-Shirt, BMR Machine',
    ],
    paymentStatus: 'Pending Admin Link' as const,
  },
  {
    id: 'pkg_12months',
    name: '1 Year Complete Longevity & Transformation Package',
    durationMonths: 12,
    priceInr: 171999,
    originalPriceInr: 199999,
    followUpDays: '104 Days Follow-Up Sessions',
    bloodTestsIncluded: [
      '4 Sugar Fasting Tests',
      '4 Vitamin D25 Hydroxyl Tests',
      '4 Vitamin B12 Tests',
      '2 Lipoprotein Cholesterol Tests',
    ],
    personalizedServices: [
      '1 Personalized Exercise Plan Chart',
      'Tailored Diet & Full Season Metabolic Protocols',
    ],
    welcomeGifts: [
      '1 Training Bag',
      '1 Aquasoft Shaker',
      '1 Towel',
      '1 Snacks Box',
      '1 Air Pot',
    ],
    posterImageUrl: '/images/packages/12-month.png',
    features: [
      '104 Days Follow-up sessions (Full Year Transformation)',
      '14 Diagnostic Biomarker Panels',
      'Personalized Exercise Plan Chart & Priority Consultation',
      'VIP Welcome Kit: Training Bag, Aquasoft Shaker, Towel, Snacks Box, Air Pot',
    ],
    paymentStatus: 'Pending Admin Link' as const,
  },
];

export function createDefaultLongTermRecord(clientId: string, clientName = 'Valued Member', clientEmail = '', clientMobile = ''): LongTermSupportSessionRecord {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDateObj = new Date(today);
  endDateObj.setMonth(endDateObj.getMonth() + 3);
  const endDate = endDateObj.toISOString().split('T')[0];

  const baselineMonthDate = startDate;
  const midMonthDateObj = new Date(today);
  midMonthDateObj.setMonth(midMonthDateObj.getMonth() + 3);
  const midMonthDate = midMonthDateObj.toISOString().split('T')[0];
  const finalMonthDateObj = new Date(today);
  finalMonthDateObj.setMonth(finalMonthDateObj.getMonth() + 6);
  const finalMonthDate = finalMonthDateObj.toISOString().split('T')[0];

  // Default answers for 23 PAR-Q questions (all defaulted to 'NO')
  const defaultParqAnswers: Record<number, 'YES' | 'NO'> = {};
  for (let i = 1; i <= 23; i++) {
    defaultParqAnswers[i] = 'NO';
  }

  return {
    id: `lts_${clientId}_${Date.now()}`,
    clientId,
    clientName,
    clientEmail,
    clientMobile,
    currentStep: 1,
    isCompleted: false,
    package: {
      ...DEFAULT_PACKAGES[2], // 3-month default
      paymentLink: '',
      paymentStatus: 'Pending Admin Link',
    },
    agreement: {
      isAccepted: false,
      clientSignatureName: clientName,
      startDate,
      endDate,
      confirmationEmailSent: false,
    },
    parq: {
      answers: defaultParqAnswers,
      q22PrescriptionDetails: '',
      q23SupplementDetails: '',
      clientAffirmationAccepted: true,
      clientSignatureName: clientName,
      nutritionistName: 'Sneha Dey',
      isCleared: true,
      hasHeartCondition: false,
      hasChestPainWithActivity: false,
      hasChestPainWithoutActivity: false,
      hasDizziness: false,
      hasBoneJointProblem: false,
      hasHighBpOrMeds: false,
      hasOtherMedicalReason: false,
      chronicConditions: ['None'],
    },
    bloodTest: {
      baselineDate: baselineMonthDate,
      midTermDate: midMonthDate,
      finalDate: finalMonthDate,
      biomarkers: [
        'Blood sugar fasting test',
        'Vitamin D3 test',
        'Vitamin B12 test',
        'Lipoprotein cholesterol test',
        'Thyroid Stimulating Hormone (TSH)',
      ],
      diagnosticType: 'Home Sample Collection',
      labReportsCount: 1,
    },
    gift: {
      selectedGiftId: 'gift_shaker_scale',
      giftTitle: 'Clinical Shaker Bottle + Precision Portion Scale',
      selectedAt: Date.now(),
    },
    goalsAndSupplements: {
      selectedGoals: ['Fat Loss', 'Energy Focus', 'Better Sleep'],
      openToSupplements: true, // Default Yes
    },
    eatingHabits: {
      breakfastDescription: 'Poha / Paratha / Tea with biscuits',
      lunchDescription: 'Rice with dal, roti and sabzi',
      snackDescription: 'Samosa / Namkeen / Tea',
      dinnerDescription: 'Roti with curry / Rice late night',
      selectedBreakfastFoods: ['Poha (1 bowl)', 'Aloo Paratha (1 paratha)'],
      selectedLunchFoods: ['Dal Tadka + Jeera Rice', 'Matar Paneer + Roti (2)'],
      selectedSnackFoods: ['Samosa (2 pcs)', 'Makhana (Roasted) (1 cup)'],
      selectedDinnerFoods: ['Paneer Bhurji + Roti', 'Mix Veg + Roti'],
      hasHighCarbHabits: true,
      viewedLipogenesisEducation: true,
    },
    biometrics: {
      currentWeightKg: 65,
      targetWeightKg: 58,
      fatPercentage: 28,
      intensityLevel: 'Moderately Active',
      mealsCount: 4,
      leanBodyMassKg: 46.8,
      proteinGramsTarget: 94,
      fatGramsTarget: 56,
      carbsGramsTarget: 145,
      dailyCalorieTarget: 1460,
    },
    dietaryOrientation: {
      dietType: 'Non-Vegetarian',
    },
    recipePreferences: {
      cookingFats: ['Extra Virgin Coconut Oil', 'Pure Desi A2 Ghee'],
      proteinSources: ['Whey Protein Isolate', 'Paneer', 'Whole Eggs', 'Grilled Chicken'],
      carbSources: ['Rolled Oats', 'Chia Seeds', 'Cruciferous Greens', 'Berries'],
      selectedRecipeIds: ['rec_chicken_garlic', 'rec_paneer_bhurji_ghee', 'rec_whey_coconut_shake'],
      selectedRecipes: [
        {
          id: 'rec_paneer_bhurji_ghee',
          title: 'Scrambled Paneer Bhurji in Pure Vedic A2 Ghee',
          category: 'Paneer',
          cookingFat: 'Pure Desi A2 Ghee',
          proteinGrams: 28,
          fatGrams: 22,
          carbsGrams: 4,
          calories: 330,
        },
        {
          id: 'rec_chicken_garlic',
          title: 'Garlic Herb Chicken Breast in Cold-Pressed Coconut Oil',
          category: 'Chicken',
          cookingFat: 'Extra Virgin Coconut Oil',
          proteinGrams: 36,
          fatGrams: 14,
          carbsGrams: 2,
          calories: 280,
        },
        {
          id: 'rec_whey_coconut_shake',
          title: 'Whey Protein Isolate with Cold-Pressed Coconut Oil & Sliced Kiwi',
          category: 'Whey',
          cookingFat: 'Extra Virgin Coconut Oil',
          proteinGrams: 27,
          fatGrams: 14,
          carbsGrams: 10,
          calories: 275,
        }
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Loads a client's Long-Term Support session record from local cache or Firebase RTDB.
 */
export async function getLongTermSupportRecord(clientId: string): Promise<LongTermSupportSessionRecord> {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_PREFIX + clientId);
    if (cached) {
      return JSON.parse(cached) as LongTermSupportSessionRecord;
    }
  } catch (e) {
    console.warn('Error reading local Long-Term support record:', e);
  }

  // Live Firebase lookup
  if (isFirebaseConfigured && database && clientId) {
    try {
      const snapshot = await get(ref(database, `longTermSupport/${clientId}`));
      if (snapshot.exists()) {
        const val = snapshot.val() as LongTermSupportSessionRecord;
        localStorage.setItem(STORAGE_KEY_PREFIX + clientId, JSON.stringify(val));
        return val;
      }
    } catch (err) {
      console.warn('Firebase RTDB long-term record read error:', err);
    }
  }

  return createDefaultLongTermRecord(clientId);
}

/**
 * Saves and synchronizes the Long-Term Support record to Firebase Realtime Database & local cache.
 */
export async function saveLongTermSupportRecord(record: LongTermSupportSessionRecord): Promise<LongTermSupportSessionRecord> {
  const updated: LongTermSupportSessionRecord = {
    ...record,
    updatedAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + record.clientId, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error writing local Long-Term record:', e);
  }

  if (isFirebaseConfigured && database && record.clientId) {
    try {
      await set(ref(database, `longTermSupport/${record.clientId}`), updated);
    } catch (err) {
      console.warn('Firebase RTDB long-term record write error:', err);
    }
  }

  // Automated Android & iOS Plan Lifecycle Notifications Schedule
  if (record.package) {
    try {
      const { generatePlanNotificationSchedule, schedulePlanLocalNotifications, syncPlanNotificationsToFirebase } = await import('./planNotificationService');
      const schedule = generatePlanNotificationSchedule(
        record.package.id,
        record.package.name,
        record.package.durationMonths || 1,
        record.agreement?.startDate ? new Date(record.agreement.startDate).getTime() : Date.now(),
        record.clientName
      );
      schedulePlanLocalNotifications(schedule).catch((e) => console.warn('Native notification schedule error:', e));
      syncPlanNotificationsToFirebase(record.clientId, record.package.id, schedule).catch((e) => console.warn('Firebase notification sync error:', e));
    } catch (e) {
      // Safe fallback
    }
  }

  return updated;
}

/**
 * Triggers the agreement signing action and sends automated confirmation emails.
 */
export async function signLongTermSupportAgreement(
  record: LongTermSupportSessionRecord,
  signatureName: string
): Promise<LongTermSupportSessionRecord> {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDateObj = new Date(today);
  endDateObj.setMonth(endDateObj.getMonth() + (record.package.durationMonths || 3));
  const endDate = endDateObj.toISOString().split('T')[0];

  const updated: LongTermSupportSessionRecord = {
    ...record,
    agreement: {
      isAccepted: true,
      acceptedAt: Date.now(),
      clientSignatureName: signatureName || record.clientName,
      startDate,
      endDate,
      confirmationEmailSent: true,
    },
    updatedAt: Date.now(),
  };

  await saveLongTermSupportRecord(updated);

  // Dispatch Resend confirmation email
  sendLongTermProgramStartedEmail({
    clientEmail: updated.clientEmail,
    clientName: updated.clientName,
    packageName: updated.package.name,
    durationMonths: updated.package.durationMonths,
    startDate,
    endDate,
    goals: updated.goalsAndSupplements.selectedGoals,
    openToSupplements: updated.goalsAndSupplements.openToSupplements,
    dietType: updated.dietaryOrientation.dietType,
    mealsCount: updated.biometrics.mealsCount,
  }).catch((err) => {
    console.warn('Could not dispatch Long-Term confirmation email:', err);
  });

  return updated;
}
