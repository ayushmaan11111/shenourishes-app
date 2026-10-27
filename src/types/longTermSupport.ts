/**
 * Long-Term Support Program Types & Interfaces
 * Covers the 10-step comprehensive transformation program:
 * 1. Package Selection & Admin Payment Link
 * 2. Clickable Agreement & Start Notification Email
 * 3. PAR-Q Health Safety Form
 * 4. Multi-Month Blood Test Schedule
 * 5. Gift Hampers / Starter Kit
 * 6. Goals & Supplement Openness (Yes/No toggle)
 * 7. Previous Eating Habits & Lipogenesis Education
 * 8. Biometrics (Round Scroll Weight Scale, Intensity, Fat %, Macro Formula, 3/4/5 Meals)
 * 9. Dietary Orientation (Veg, Non-Veg, Vegan, Pescatarian)
 * 10. Interactive Recipe & Cooking Fat Customizer
 */

export interface LongTermSupportPackage {
  id: string;
  name: string;
  durationMonths: number; // 1, 2, 3, 6, 9, 12
  priceInr: number;
  originalPriceInr: number;
  features: string[];
  followUpDays: string;
  bloodTestsIncluded: string[];
  personalizedServices: string[];
  welcomeGifts: string[];
  posterImageUrl?: string;
  paymentLink?: string; // Custom private link sent by Admin
  paymentStatus: 'Pending Admin Link' | 'Payment Link Sent' | 'Paid & Active';
  paymentLinkSentAt?: number;
  paidAt?: number;
}

export interface LongTermSupportAgreement {
  isAccepted: boolean;
  acceptedAt?: number;
  clientSignatureName: string;
  startDate: string;
  endDate: string;
  confirmationEmailSent: boolean;
}

export interface ParQQuestionItem {
  id: number;
  section: 'SECTION A: MEDICAL HISTORY' | 'SECTION B: PHYSICAL ACTIVITY READINESS';
  question: string;
  hasDetailsInput?: boolean;
  detailsPrompt?: string;
}

export interface LongTermParQ {
  answers: Record<number, 'YES' | 'NO'>;
  q22PrescriptionDetails?: string;
  q23SupplementDetails?: string;
  clientAffirmationAccepted: boolean;
  clientSignatureName: string;
  nutritionistName?: string;
  signedAt?: number;
  isCleared: boolean;
  // Legacy compatibility helpers
  hasHeartCondition?: boolean;
  hasChestPainWithActivity?: boolean;
  hasChestPainWithoutActivity?: boolean;
  hasDizziness?: boolean;
  hasBoneJointProblem?: boolean;
  hasHighBpOrMeds?: boolean;
  hasOtherMedicalReason?: boolean;
  chronicConditions?: string[];
  otherNotes?: string;
}

export interface LongTermBloodTestState {
  baselineDate: string;
  midTermDate: string;
  finalDate: string;
  biomarkers: string[];
  diagnosticType: 'Home Sample Collection' | 'Lab Visit';
  labReportsCount: number;
}

export interface LongTermGiftSelection {
  selectedGiftId: string;
  giftTitle: string;
  selectedAt: number;
}

export interface LongTermGoalsAndSupplements {
  selectedGoals: string[]; // ['Energy Focus', 'Fat Loss', 'Muscle Gain', 'Endurance', 'Better Sleep', 'Gut Health', etc.]
  openToSupplements: boolean; // CRITICAL: Yes / No
  supplementNotes?: string;
}

export interface LongTermEatingHabits {
  breakfastDescription: string;
  lunchDescription: string;
  snackDescription: string;
  dinnerDescription: string;
  selectedBreakfastFoods: string[];
  selectedLunchFoods: string[];
  selectedSnackFoods: string[];
  selectedDinnerFoods: string[];
  hasHighCarbHabits: boolean;
  viewedLipogenesisEducation: boolean;
}

export interface LongTermBiometrics {
  currentWeightKg: number; // Circular scroll scale
  targetWeightKg: number;
  fatPercentage: number;
  intensityLevel: 'Sedentary' | 'Moderately Active' | 'Active at Gym' | 'Extremely Active';
  mealsCount: 3 | 4 | 5;
  // Calculated values
  leanBodyMassKg: number;
  proteinGramsTarget: number;
  fatGramsTarget: number;
  carbsGramsTarget: number;
  dailyCalorieTarget: number;
}

export interface LongTermDietaryOrientation {
  dietType: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | 'Pescatarian';
}

export interface LongTermSelectedRecipe {
  id: string;
  title: string;
  category: 'Paneer' | 'Chicken' | 'Fish' | 'Eggs' | 'Whey' | 'Vegan';
  cookingFat: string;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
  calories: number;
  instructions?: string;
}

export interface LongTermRecipePreferences {
  cookingFats: string[]; // ['Extra Virgin Coconut Oil', 'Pure Desi A2 Ghee', 'Grass-fed Butter', 'Cold-Pressed Olive Oil', 'Almond Butter']
  proteinSources: string[]; // ['Whey Protein Isolate', 'Paneer', 'Tofu', 'Whole Eggs', 'Grilled Chicken', 'Fish Fillet', 'Greek Yogurt', 'Sprouts']
  carbSources: string[]; // ['Rolled Oats', 'Chia Seeds', 'Cruciferous Greens', 'Berries', 'Brown Rice', 'Multigrain Phulka']
  selectedRecipeIds: string[];
  selectedRecipes?: LongTermSelectedRecipe[];
}

export interface LongTermSupportSessionRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  clientAge?: number;
  clientOccupation?: string;
  currentStep: number; // 1 to 10
  isCompleted: boolean;
  // Admin Plan Assignment Controls
  isPlanAssignedByAdmin?: boolean;
  assignedPlanId?: string;
  assignedPlanName?: string;
  assignedPlanPrice?: number;
  adminAssignedAt?: number;
  adminRecommendationNote?: string;
  package: LongTermSupportPackage;
  agreement: LongTermSupportAgreement;
  parq: LongTermParQ;
  bloodTest: LongTermBloodTestState;
  gift: LongTermGiftSelection;
  goalsAndSupplements: LongTermGoalsAndSupplements;
  eatingHabits: LongTermEatingHabits;
  biometrics: LongTermBiometrics;
  dietaryOrientation: LongTermDietaryOrientation;
  recipePreferences: LongTermRecipePreferences;
  createdAt: number;
  updatedAt: number;
}

export interface LeadRegistrationRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  age?: number;
  occupation?: string;
  interest: 'Muscle Gain' | 'Weight Loss' | 'Fat Loss' | string;
  registrationDate: string;
  followUpReminder: string;
  status: 'New Lead' | 'Follow-up Pending' | 'Contacted' | 'Interested' | 'Not Interested';
  actionPlan: {
    counsellingPackage: boolean;
    longTermPackage: boolean;
    state: 'Sold' | 'On Process';
  };
  assignedPackageId?: string;
  notes?: string;
}

export interface LongTermReminderRecord {
  id: string;
  clientId?: string;
  name: string;
  phone: string;
  age?: number;
  occupation?: string;
  packageTaken: string;
  packageDurationMonths: number;
  serviceStartDate: string;
  serviceEndDate: string;
  status: 'Active' | 'Completed';
  daysLeftOrOverdue: string;
  reminderDate: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  messageOfferToSend: string;
  reminderSent: 'Yes' | 'Scheduled';
  clientResponse: 'Interested' | 'Replied' | 'Not Interested' | 'Pending';
  nextFollowUp: string;
  notes: string;
}

// Client Progress Photo Model
export interface ClientProgressPhotoItem {
  id: string;
  date: string;
  photoType: 'Front' | 'Side' | 'Back' | 'Scanner / Other';
  imageUrl: string;
  weightKg?: number;
  notes?: string;
  uploadedBy: 'Admin' | 'Client';
  uploadedAt: number;
}

// Workout Intensity & Start Date Configuration
export type WorkoutIntensityTier = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ClientWorkoutIntensityConfig {
  clientId: string;
  clientName: string;
  intensityLevel: WorkoutIntensityTier;
  intensityMultiplier: 1.5 | 2.0 | 2.5;
  dailyMinutesTarget: number; // 30, 45, 60
  threeMonthMinuteGoal: number; // 1800, 2700, 3000
  planStartDate: string;
  testBufferDays: number; // +2 or +3 days for tests before workout starts
  activeWorkoutStartDate: string;
  assignedAt: number;
  assignedBy: string;
  notes?: string;
}

// Exercise Logging with Bulky Weights and Color Bands
export type ResistanceBandColor = 'Yellow' | 'Green' | 'Red' | 'Blue' | 'Black';

export interface WorkoutExerciseLogItem {
  id: string;
  exerciseName: string;
  category: 'Bulky Weights / Dumbbells' | 'Resistance Color Band' | 'Bodyweight' | 'Cardio';
  weightKg?: number;
  bandColor?: ResistanceBandColor;
  sets: number;
  reps: number;
  durationMinutes: number;
  completedAt: number;
  notes?: string;
}

