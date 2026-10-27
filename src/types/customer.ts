export type Gender = 'Female' | 'Male' | 'Other' | 'Prefer not to say';
export type HeightUnit = 'cm' | 'ft/in';
export type WeightUnit = 'kg' | 'lbs';
export type WaistUnit = 'cm' | 'inches';

export type PrimaryGoal = string;

export type GoalTimeline =
  | 'Less than 1 month'
  | '1 – 3 months'
  | '3 – 6 months'
  | '6 – 12 months'
  | 'More than 1 year';

export type GoalImportance = 'Low' | 'Moderate' | 'High' | 'Very High';

export type FitnessChallenge =
  | 'Motivation & Support'
  | 'Discipline & Habits'
  | 'Training'
  | 'Nutrition'
  | 'Work / Travel'
  | 'Other';

export type NutritionistSupport =
  | 'Personalized Diet Plan'
  | 'Meal Planning Guidance'
  | 'Nutritional Education'
  | 'Weight Management Support'
  | 'Habit Building'
  | 'Accountability & Follow-ups'
  | 'Lifestyle & Wellness Advice'
  | 'Supplement Guidance'
  | 'Other';

export type SleepDuration =
  | 'Less than 4 hours'
  | '4 – 6 hours'
  | '6 – 8 hours'
  | '8 – 10 hours'
  | '10 – 12 hours'
  | 'More than 12 hours';

export type SleepQuality = 'Poor' | 'Average' | 'Good' | 'Excellent';
export type StressLevel = 'Low' | 'Moderate' | 'High' | 'Extremely High';

export type AnxietyLevel =
  | 'Very Low'
  | 'Mild'
  | 'Moderate'
  | 'High';

export type DailySittingDuration =
  | 'Less than 2 hours'
  | '2 – 4 hours'
  | '4 – 6 hours'
  | '6 – 8 hours'
  | 'More than 8 hours';

export type DigestiveIssue =
  | 'Bloating'
  | 'Constipation'
  | 'Acidity'
  | 'Diarrhea'
  | 'Gas'
  | 'None'
  | 'Other';

export type ProgramSupport =
  | 'Customized Diet Plan'
  | 'Workout Plan'
  | 'Weight Management'
  | 'Habit Building'
  | 'Accountability'
  | 'Education / Guidance'
  | 'Regular Follow-ups'
  | 'Motivation'
  | 'Other';

export type PreferredContactMethod = 'WhatsApp' | 'Call' | 'Email' | 'Other';

export type DietType = 'VEGETARIAN' | 'EGGETARIAN' | 'NON-VEGETARIAN' | 'VEGAN' | 'OTHER';

export type DailyWaterIntake = 'LESS THAN 1 L' | '1 – 2 L' | '2 – 3 L' | 'MORE THAN 3 L';

export type DailyMeals = '1 MEAL' | '2 MEALS' | '3 MEALS' | '4 MEALS' | '5+ MEALS';

export type EatingOutFrequency =
  | 'NEVER'
  | '1 – 2 TIMES PER WEEK'
  | '3 – 4 TIMES PER WEEK'
  | '5+ TIMES PER WEEK';

export type SmokingStatus = 'NEVER' | 'IN THE PAST' | 'CURRENTLY';
export type AlcoholStatus = 'NEVER' | 'IN THE PAST' | 'CURRENTLY';

export type AlcoholDrinksPerWeek =
  | '1 – 2 DRINKS'
  | '3 – 5 DRINKS'
  | '6 – 10 DRINKS'
  | 'MORE THAN 10 DRINKS';

export type PreferredExerciseType =
  | 'None / Sedentary'
  | 'Strength Training'
  | 'Weight Training'
  | 'Cardio'
  | 'Yoga'
  | 'Pilates'
  | 'Jogging / Running'
  | 'Sports'
  | 'Other';

export type ActivityLevel =
  | 'Sedentary'
  | 'Beginner at Gym'
  | 'Active at Gym'
  | "Extremely Active Player's"
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Extremely Active';

export type WorkoutIntensity = 'Low' | 'Moderate' | 'High';

export type WorkoutDuration =
  | 'Less than 30 min'
  | '30 – 45 min'
  | '45 – 60 min'
  | '60 – 90 min'
  | 'More than 90 min';

export type RealisticExerciseDays =
  | '2 Days'
  | '3 Days'
  | '4 Days'
  | '5 Days'
  | '6 Days'
  | '7 Days';

export type CommitmentLevel =
  | '100% Committed'
  | 'Highly Committed'
  | 'Moderately Committed'
  | 'Need More Motivation';

export interface PersonalDetails {
  fullName: string;
  date: string;
  age: number | null;
  gender: Gender;
  mobileNumber: string;
  emailAddress: string;
  address: string;
  height: number | null;
  heightUnit: HeightUnit;
  weight: number | null;
  weightUnit: WeightUnit;
  bodyFatPercentage?: number | null;
  fatMassKg?: number | null;
  fatFreeMassKg?: number | null;
  bmr?: number | null;
  waistCircumference: {
    atNaval: number | null;
    aboveNaval: number | null;
    belowNaval: number | null;
    waistUnit?: WaistUnit;
  };
}

export interface LifestyleHealth {
  wakeUpTime?: string;
  sleepTime?: string;
  sleepDuration: SleepDuration | '';
  sleepHoursPerNight?: number | string;
  sleepQuality: SleepQuality | '';
  stressLevel: StressLevel | '';
  anxietyLevel: AnxietyLevel | '';
  caffeinatedBeveragesPerDay?: number;
  dailySittingDuration: DailySittingDuration | '';
  digestiveIssues: DigestiveIssue[];
  hasMusclePain?: boolean;
  musclePainArea?: string;
  openToMagnesium?: boolean;
  otherDigestiveIssue?: string;
  otherLifestyleFactors?: string;
}

export interface SupportExpectations {
  programSupport: ProgramSupport[];
  otherProgramSupport?: string;
  preferredContactMethod: PreferredContactMethod | '';
  otherContactMethod?: string;
}

export interface DietaryNutrition {
  dietType: DietType | '';
  otherDietType?: string;
  previousFoodOrientation?: string;
  newFoodOrientation?: string;
  preferredProteins?: string[];
  mealsCount?: 3 | 4 | 5 | number;
  selectedFoodCategories?: string[];
  selectedSpecificFoods?: string[];
  dietArchetype?: 'Pollo-Pescatarian Whey' | 'Pescatarian Whey' | 'Lacto-Ovo-Veg Whey' | 'Lacto-Vegetarian' | 'Vegan Protein' | string;
  hasFoodAllergies: boolean;
  foodAllergiesOrIntolerances?: string;
  dailyWaterIntake: DailyWaterIntake | '';
  dailyMeals: DailyMeals | '';
  preferredMealTimings?: Record<string, string>;
  eatingOutFrequency: EatingOutFrequency | '';
  smokingStatus: SmokingStatus | '';
  smokingQuantityPerDay?: string;
  alcoholStatus: AlcoholStatus | '';
  alcoholDrinksPerWeek?: AlcoholDrinksPerWeek | '';
}

export interface PhysicalActivity {
  weeklyExerciseDuration?: string;
  preferredExerciseTypes: PreferredExerciseType[];
  currentActivityLevel: ActivityLevel | '';
  calculatedIntensity?: number; // 1.5, 2.0, 2.5
  activityTrait?: string; // "Low at energy", "Muscle gain", "Extra kick"
  usualWorkoutIntensity: WorkoutIntensity | '';
  usualWorkoutDuration: WorkoutDuration | '';
  realisticExerciseDaysPerWeek: RealisticExerciseDays | '';
}

export interface Commitment {
  commitmentLevel: CommitmentLevel | '';
  agreesToFollowPlan: boolean;
}

export interface PlanSelection {
  planId: string;
  planName: string;
  duration: string;
  tagline: string;
  features: string[];
  isPopular?: boolean;
}

export type BloodTestStatus =
  | 'Yes, I have recent reports (Last 3–6 months)'
  | 'Yes, but older than 6 months'
  | 'No, but willing to take a test'
  | 'Not at this time';

export interface BloodTestAssessment {
  reportStatus: BloodTestStatus | '';
  biomarkersChecked: string[];
  knownAbnormalitiesNotes?: string;
  hasDoctorPrescriptionOrUploadedNotes?: string;
}

import type { CustomGoalItem, GeneratedRecommendation } from './recommendations';

export interface GoalAssessment {
  primaryGoals: string[];
  otherGoal?: string;
  customGoals?: CustomGoalItem[];
  generatedRecommendations?: GeneratedRecommendation[];
  goalTimeline: GoalTimeline | '';
  goalImportance: GoalImportance | '';
  biggestFitnessChallenges: FitnessChallenge[];
  otherFitnessChallenge?: string;
  nutritionistSupportExpectations: NutritionistSupport[];
  otherNutritionistSupport?: string;
}

export interface CustomerMetadata {
  createdAt: number | object;
  updatedAt: number | object;
  onboardingCompleted: boolean;
  currentOnboardingStep: number;
  appVersion: string;
}

import type { DailyNutritionTargets } from './nutrition';

export type UserRole = 'client' | 'nutritionist' | 'admin';

export interface CustomerRecord {
  uid: string;
  role?: UserRole;
  metadata: CustomerMetadata;
  personalDetails: PersonalDetails;
  lifestyleHealth: LifestyleHealth;
  supportExpectations: SupportExpectations;
  dietaryNutrition: DietaryNutrition;
  physicalActivity: PhysicalActivity;
  commitment: Commitment;
  planSelection?: PlanSelection;
  bloodTest?: BloodTestAssessment;
  welcomeGift?: {
    giftId: string;
    giftTitle?: string;
    selectedAt?: number;
  };
  goalAssessment: GoalAssessment;
  
  // Recommendations & Plans
  selectedGoals?: string[];
  customGoals?: CustomGoalItem[];
  systemRecommendations?: GeneratedRecommendation[];
  adminApprovedRecommendations?: GeneratedRecommendation[];
  finalPlan?: GeneratedRecommendation[];
  
  // Phase 2 Extensions
  assignedNutritionistId?: string;
  activeDietPlanId?: string;
  activeWorkoutPlanId?: string;
  dailyTargets?: DailyNutritionTargets;
  adherenceSummary?: {
    last7DaysDietAdherence: number;
    last7DaysWorkoutAdherence: number;
    lastLogDate?: string;
    totalActiveStreakDays?: number;
  };
}

export type OnboardingStepKey =
  | 'personalDetails'
  | 'lifestyleHealth'
  | 'supportExpectations'
  | 'dietaryNutrition'
  | 'physicalActivity'
  | 'commitment'
  | 'planSelection'
  | 'bloodTest'
  | 'welcomeGift'
  | 'goalAssessment';
