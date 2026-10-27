/**
 * Lifestyle Supplement Assessment Types & Schemas
 * Based on the 8 clinical infographic charts in the sugg folder:
 * - Sedentary 1.5 (Images 1 & 2)
 * - Beginner 1.5 (Images 3 & 4)
 * - Moderate 2.0 (Images 5 & 6)
 * - Extremely High 2.5 (Images 7 & 8)
 */

export type LifestyleIntensityTier = 
  | 'Sedentary 1.5' 
  | 'Beginner 1.5' 
  | 'Moderate 2.0' 
  | 'Extremely High 2.5';

export type AnxietyLevelType = 'Low' | 'Moderate' | 'High' | 'Very High';

export interface LifestyleAssessmentAnswers {
  intensityTier: LifestyleIntensityTier;
  
  // Q1: Anxiety
  anxietyLevel: AnxietyLevelType;
  
  // Q2: Daily Caffeine
  caffeinatedBeveragesPerDay: number; // 1, 2, 3, 4, 5+
  
  // Q3 / Energy / Strength
  feelsLowOnEnergy?: boolean;
  openToErgogenicEnergy?: boolean; // L-Carnitine / Acetyl-L-Carnitine 3g
  workoutTime?: 'Morning' | 'Evening'; // Morning (empty stomach) vs Evening (post-workout)
  
  // Moderate / High 2.5 Ergogenic Strength
  wantsIncreaseStrengthOrHeavyWeights?: boolean; // Creatine Monohydrate 5g
  openToCreatine?: boolean;
  
  // Q4: Gut Health
  hasConstipationOrFlatulence?: boolean;
  openToGutSupport?: boolean; // Probiotic 2g/day
  
  // Q5: Bone Health / Calcium
  openToBoneHealth?: boolean; // Calcium Citrate Malate 500mg + K2 MK-7 200mcg + Doctor D3
  doctorPrescribedVitaminD?: string; // e.g. "As prescribed by doctor after test"
  
  // Vascularity & Heavy Lift Burning
  feelsBurningOrWantsVascularity?: boolean; // L-Citrulline 3g
  openToCitrulline?: boolean;
  
  // Running & Muscle Fatigue
  goesRunning?: boolean;
  runningTime?: 'Morning' | 'Evening';
  feelsRunningFatigue?: boolean;
  openToBetaAlanine?: boolean; // Beta-Alanine 3g
  
  // Immunity & Antioxidants
  poorImmunityOrOftenSick?: boolean;
  smokes?: boolean;
  drinksAlcohol?: boolean;
  openToAntioxidantSupport?: boolean; // ALA 600mg + CoQ10 400mg + Vit C 1000mg + Vit E 600IU
  
  // Joint Pain & Anti-inflammatory
  hasJointPain?: boolean;
  wantsLongTermJointHealth?: boolean;
  openToOmega3?: boolean; // Omega-3 EPA+DHA 900mg
  
  // Muscle Pain & Sleep (Magnesium)
  hasMusclePain?: boolean;
  hasSleepDifficulties?: boolean;
  sleepHoursPerNight?: number | string;
  openToMagnesium?: boolean; // Magnesium Glycinate 200mg
  
  // Caffeine Anhydrous
  wantsWorkoutKick?: boolean;
  openToCaffeineAnhydrous?: boolean; // 200mg (1-3 servings)
  
  // Coach Notes
  coachNotes?: string;
  assessedAt?: number;
  assessedBy?: string;
}

export interface EvaluatedSupplementRecommendation {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  category: 'Ergogenic' | 'Gut Health' | 'Bone Health' | 'Antioxidant' | 'Anti-inflammatory' | 'Muscle & Sleep' | 'Pre-Workout Kick';
  status: 'Recommended' | 'Contraindicated' | 'Doctor-Directed' | 'Separate Counselling';
  clinicalPurpose: string;
  instructions: string;
  icon?: string;
}

export interface LifestyleSupplementEvaluationResult {
  intensityTier: LifestyleIntensityTier;
  recommendations: EvaluatedSupplementRecommendation[];
  timingSummary: {
    postBreakfast?: string[];
    morningEmptyStomach?: string[];
    postLunch?: string[];
    postWorkout?: string[];
    postDinner?: string[];
    bedtime?: string[];
    separateCounselling?: string[];
  };
  caffeineWarning?: string;
  vitaminDNotice: string;
  combinationNotes: string[];
}
