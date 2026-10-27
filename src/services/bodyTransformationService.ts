/**
 * She Nourishes — Body Fat & Body Transformation Data Service
 * 
 * Provides:
 * 1. Male & Female Body Fat Starting Points, Fat Mass, Calories in Fat Mass (9 kcal/g)
 * 2. Estimated Duration to Reach Next Body Fat Level on Fat-Protein Low-Carb Diet
 * 3. 3-Month, 6-Month, 9-Month, and 12-Month Transformation Timelines
 * 4. Client Body Transformation Record (Starting Biometrics, Months 3/6/9/12 Assessments, Final Review)
 * 5. Persistence across LocalStorage and Firebase Realtime Database
 */

import { database, isFirebaseConfigured } from './firebase';
import { ref, get, set } from 'firebase/database';

export interface BodyFatLevelData {
  bodyFatPercent: number; // e.g. 40, 35, 30, 25, 20, 15, 10, 8
  fatMassKg: number;      // based on reference weight (70kg male / 60kg female)
  caloriesInFatMass: number; // Fat mass in grams * 9 kcal
  daysToNextLevel?: string;   // e.g. "56 – 84 days"
  monthsToNextLevel?: string; // e.g. "2 – 3 months"
  ratePerMonth?: string;      // e.g. "~0.5% to 0.7% body fat per month"
  nextLevel?: number;
}

export interface TransformationTimelineRow {
  startingBodyFat: string;
  after3Months: string;
  after6Months: string;
  after9Months: string;
  after12Months: string;
}

// 1. Male Body Fat Reference Data (Based on 70 kg male)
export const MALE_BODY_FAT_REFERENCE: BodyFatLevelData[] = [
  { bodyFatPercent: 40, fatMassKg: 28.0, caloriesInFatMass: 252000, daysToNextLevel: '56 – 84 days', monthsToNextLevel: '2 – 3 months', ratePerMonth: '~0.5% to 0.7% / mo', nextLevel: 35 },
  { bodyFatPercent: 35, fatMassKg: 24.5, caloriesInFatMass: 220500, daysToNextLevel: '56 – 84 days', monthsToNextLevel: '2 – 3 months', ratePerMonth: '~0.5% to 0.7% / mo', nextLevel: 30 },
  { bodyFatPercent: 30, fatMassKg: 21.0, caloriesInFatMass: 189000, daysToNextLevel: '70 – 105 days', monthsToNextLevel: '2.5 – 3.5 months', ratePerMonth: '~0.4% to 0.6% / mo', nextLevel: 25 },
  { bodyFatPercent: 25, fatMassKg: 17.5, caloriesInFatMass: 157500, daysToNextLevel: '84 – 126 days', monthsToNextLevel: '3 – 4.5 months', ratePerMonth: '~0.4% to 0.6% / mo', nextLevel: 20 },
  { bodyFatPercent: 20, fatMassKg: 14.0, caloriesInFatMass: 126000, daysToNextLevel: '98 – 154 days', monthsToNextLevel: '3.5 – 5 months', ratePerMonth: '~0.3% to 0.5% / mo', nextLevel: 15 },
  { bodyFatPercent: 15, fatMassKg: 10.5, caloriesInFatMass: 94500, daysToNextLevel: '112 – 168 days', monthsToNextLevel: '4 – 5.5 months', ratePerMonth: '~0.3% to 0.4% / mo', nextLevel: 10 },
  { bodyFatPercent: 10, fatMassKg: 7.0, caloriesInFatMass: 63000, daysToNextLevel: '98 – 154 days', monthsToNextLevel: '3.5 – 5 months', ratePerMonth: '~0.2% to 0.4% / mo', nextLevel: 8 },
  { bodyFatPercent: 8, fatMassKg: 5.6, caloriesInFatMass: 50400, daysToNextLevel: 'Maintain / Build', monthsToNextLevel: 'Maintain', ratePerMonth: 'Muscle focus' },
];

export const MALE_TIMELINE_TABLE: TransformationTimelineRow[] = [
  { startingBodyFat: '8%', after3Months: 'Maintain or assess muscle gain', after6Months: 'Build muscle', after9Months: 'Build muscle', after12Months: 'Build muscle' },
  { startingBodyFat: '10%', after3Months: 'Maintain or assess muscle gain', after6Months: 'Build muscle', after9Months: 'Build muscle', after12Months: 'Build muscle' },
  { startingBodyFat: '15%', after3Months: '12 – 14%', after6Months: '10 – 13%', after9Months: '10 – 13%', after12Months: 'Maintain or build muscle' },
  { startingBodyFat: '20%', after3Months: '17 – 19%', after6Months: '14 – 17%', after9Months: '12 – 16%', after12Months: '10 – 15%' },
  { startingBodyFat: '25%', after3Months: '21 – 24%', after6Months: '18 – 22%', after9Months: '15 – 20%', after12Months: '12 – 18%' },
  { startingBodyFat: '30%', after3Months: '26 – 29%', after6Months: '22 – 26%', after9Months: '18 – 24%', after12Months: '15 – 22%' },
  { startingBodyFat: '35%', after3Months: '31 – 34%', after6Months: '27 – 31%', after9Months: '23 – 28%', after12Months: '19 – 26%' },
  { startingBodyFat: '40%', after3Months: '36 – 39%', after6Months: '32 – 36%', after9Months: '27 – 33%', after12Months: '23 – 30%' },
];

// 2. Female Body Fat Reference Data (Based on 60 kg female — slower fat metabolism)
export const FEMALE_BODY_FAT_REFERENCE: BodyFatLevelData[] = [
  { bodyFatPercent: 45, fatMassKg: 27.0, caloriesInFatMass: 243000, daysToNextLevel: '70 – 105 days', monthsToNextLevel: '2.5 – 3.5 months', ratePerMonth: '~0.5% to 0.7% / mo', nextLevel: 40 },
  { bodyFatPercent: 40, fatMassKg: 24.0, caloriesInFatMass: 216000, daysToNextLevel: '70 – 105 days', monthsToNextLevel: '2.5 – 3.5 months', ratePerMonth: '~0.5% to 0.7% / mo', nextLevel: 35 },
  { bodyFatPercent: 35, fatMassKg: 21.0, caloriesInFatMass: 189000, daysToNextLevel: '70 – 105 days', monthsToNextLevel: '2.5 – 3.5 months', ratePerMonth: '~0.5% to 0.7% / mo', nextLevel: 30 },
  { bodyFatPercent: 30, fatMassKg: 18.0, caloriesInFatMass: 162000, daysToNextLevel: '84 – 126 days', monthsToNextLevel: '3 – 4.5 months', ratePerMonth: '~0.4% to 0.6% / mo', nextLevel: 25 },
  { bodyFatPercent: 25, fatMassKg: 15.0, caloriesInFatMass: 135000, daysToNextLevel: '98 – 154 days', monthsToNextLevel: '3.5 – 5 months', ratePerMonth: '~0.4% to 0.6% / mo', nextLevel: 20 },
  { bodyFatPercent: 20, fatMassKg: 12.0, caloriesInFatMass: 108000, daysToNextLevel: '112 – 168 days', monthsToNextLevel: '4 – 5.5 months', ratePerMonth: '~0.3% to 0.5% / mo', nextLevel: 15 },
  { bodyFatPercent: 15, fatMassKg: 9.0, caloriesInFatMass: 81000, daysToNextLevel: '140 – 210 days', monthsToNextLevel: '5 – 7 months', ratePerMonth: '~0.2% to 0.4% / mo', nextLevel: 10 },
  { bodyFatPercent: 10, fatMassKg: 6.0, caloriesInFatMass: 54000, daysToNextLevel: '98 – 154 days', monthsToNextLevel: '3.5 – 5 months', ratePerMonth: '~0.2% to 0.4% / mo', nextLevel: 8 },
  { bodyFatPercent: 8, fatMassKg: 4.8, caloriesInFatMass: 43200, daysToNextLevel: 'Maintain / Lean', monthsToNextLevel: 'Maintain', ratePerMonth: 'Athletic/Essential' },
];

export const FEMALE_TIMELINE_TABLE: TransformationTimelineRow[] = [
  { startingBodyFat: '12%', after3Months: 'Maintain / Muscle tone', after6Months: 'Build lean shape', after9Months: 'Maintain hormone health', after12Months: 'Optimal lean muscle' },
  { startingBodyFat: '15%', after3Months: '13 – 14%', after6Months: '12 – 13%', after9Months: 'Maintain or shape', after12Months: 'Maintain or shape' },
  { startingBodyFat: '20%', after3Months: '18 – 19%', after6Months: '16 – 18%', after9Months: '14 – 16%', after12Months: '13 – 15%' },
  { startingBodyFat: '25%', after3Months: '22 – 24%', after6Months: '20 – 22%', after9Months: '17 – 20%', after12Months: '15 – 18%' },
  { startingBodyFat: '30%', after3Months: '27 – 29%', after6Months: '24 – 27%', after9Months: '21 – 25%', after12Months: '18 – 23%' },
  { startingBodyFat: '35%', after3Months: '32 – 34%', after6Months: '29 – 32%', after9Months: '25 – 30%', after12Months: '22 – 28%' },
  { startingBodyFat: '40%', after3Months: '37 – 39%', after6Months: '34 – 37%', after9Months: '30 – 35%', after12Months: '26 – 32%' },
  { startingBodyFat: '45%', after3Months: '41 – 43%', after6Months: '38 – 41%', after9Months: '34 – 39%', after12Months: '30 – 36%' },
];

// 3. Client Body Transformation Record Interface
export interface TransformationAssessmentQuarter {
  bodyWeightKg: number;
  bodyFatPercentage: number;
  fatMassKg: number;
  fatFreeMassKg: number;
  waistCircumferenceCm: number;
  strengthProgress: string; // e.g. "Squats +15kg, Push-ups +8 reps"
  nutritionAdherence: string; // e.g. "88% compliance"
  trainingAdherence: string;  // e.g. "4.2 days/week"
  notes?: string;
}

export interface ClientBodyTransformationRecord {
  clientId: string;
  clientName: string;
  sex: 'Female' | 'Male';
  age: number;
  heightCm: number;
  startingBodyWeightKg: number;
  startingBodyFatPercentage: number;
  startingFatMassKg: number;
  startingFatFreeMassKg: number;
  primaryGoal: string;
  dailyCalorieTargetKcal: number;
  dailyProteinTargetGrams: number;
  dailyCarbTargetGrams: number;
  dailyFatTargetGrams: number;
  resistanceTrainingFrequency: string; // e.g. "4 days/week"
  cardioFrequency: string;             // e.g. "3 days/week"
  
  // Quarterly Assessments
  month3?: TransformationAssessmentQuarter;
  month6?: TransformationAssessmentQuarter;
  month9?: TransformationAssessmentQuarter;
  month12?: TransformationAssessmentQuarter;

  // Final Transformation Review
  finalReview?: {
    totalBodyWeightChangeKg: number;
    totalFatMassChangeKg: number;
    totalFatFreeMassChangeKg: number;
    changeInBodyFatPercentage: number;
    strengthImprovementSummary: string;
    nextRecommendedPhase: string; // e.g. "Metabolic Maintenance & Hypertrophy"
  };
  
  updatedAt: number;
}

const STORAGE_TRANSFORMATION_PREFIX = 'she_nourishes_transformation_record_';

export function createDefaultTransformationRecord(
  clientId: string,
  clientName: string,
  sex: 'Female' | 'Male' = 'Female',
  weight: number = 65,
  bodyFatPct: number = 28
): ClientBodyTransformationRecord {
  const fatMass = parseFloat(((weight * bodyFatPct) / 100).toFixed(1));
  const fatFreeMass = parseFloat((weight - fatMass).toFixed(1));

  return {
    clientId,
    clientName,
    sex,
    age: 29,
    heightCm: 165,
    startingBodyWeightKg: weight,
    startingBodyFatPercentage: bodyFatPct,
    startingFatMassKg: fatMass,
    startingFatFreeMassKg: fatFreeMass,
    primaryGoal: 'Sustainable Fat Loss & Hormonal Optimization',
    dailyCalorieTargetKcal: sex === 'Female' ? 1550 : 2000,
    dailyProteinTargetGrams: sex === 'Female' ? 110 : 140,
    dailyCarbTargetGrams: 100, // 80 - 120g
    dailyFatTargetGrams: sex === 'Female' ? 80 : 105,
    resistanceTrainingFrequency: '4 Days / Week',
    cardioFrequency: '3 Days / Week',
    updatedAt: Date.now(),
  };
}

export async function getClientTransformationRecord(
  clientId: string,
  clientName: string = 'Client',
  sex: 'Female' | 'Male' = 'Female',
  weight: number = 65,
  bodyFatPct: number = 28
): Promise<ClientBodyTransformationRecord> {
  // Check Firebase
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/bodyTransformation`));
      if (snap.exists()) {
        return snap.val() as ClientBodyTransformationRecord;
      }
    } catch (e) {
      console.warn('Firebase getTransformationRecord fallback:', e);
    }
  }

  // Check LocalStorage
  try {
    const raw = localStorage.getItem(`${STORAGE_TRANSFORMATION_PREFIX}${clientId}`);
    if (raw) {
      return JSON.parse(raw) as ClientBodyTransformationRecord;
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }

  const def = createDefaultTransformationRecord(clientId, clientName, sex, weight, bodyFatPct);
  await saveClientTransformationRecord(def);
  return def;
}

export async function saveClientTransformationRecord(
  record: ClientBodyTransformationRecord
): Promise<void> {
  record.updatedAt = Date.now();

  try {
    localStorage.setItem(`${STORAGE_TRANSFORMATION_PREFIX}${record.clientId}`, JSON.stringify(record));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${record.clientId}/bodyTransformation`), record);
    } catch (e) {
      console.warn('Firebase saveTransformationRecord error:', e);
    }
  }

  window.dispatchEvent(new CustomEvent('body_transformation_updated', { detail: record }));
}
