import type {
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

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidMobile(phone: string): boolean {
  // Allow international formatting, +, digits, spaces, hyphens, min 7 digits
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?[0-9]{7,15}$/.test(cleaned);
}

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
} {
  if (!password) return { score: 0, label: 'Weak', color: '#D9D8CC' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#E06D53' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#D9A74A' };
  if (score === 3) return { score: 3, label: 'Good', color: '#8A9568' };
  return { score: 4, label: 'Strong', color: '#66734A' };
}

export function validateStep1(details: PersonalDetails): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!details.fullName?.trim()) {
    errors.fullName = 'Full Name is required';
  }

  if (details.age === null || details.age === undefined || isNaN(details.age) || details.age < 10 || details.age > 120) {
    errors.age = 'Please enter a realistic age (10–120)';
  }

  if (!details.mobileNumber?.trim() || !isValidMobile(details.mobileNumber)) {
    errors.mobileNumber = 'Please enter a valid mobile number';
  }

  if (!details.emailAddress?.trim() || !isValidEmail(details.emailAddress)) {
    errors.emailAddress = 'Please enter a valid email address';
  }

  if (details.height === null || details.height === undefined || isNaN(details.height) || details.height <= 0 || details.height > 300) {
    errors.height = 'Please enter a valid height';
  }

  if (details.weight === null || details.weight === undefined || isNaN(details.weight) || details.weight <= 0 || details.weight > 400) {
    errors.weight = 'Please enter a valid weight';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepLifestyle(lifestyle: LifestyleHealth): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!lifestyle.sleepDuration) {
    errors.sleepDuration = 'Please select your average sleep duration';
  }

  if (!lifestyle.sleepQuality) {
    errors.sleepQuality = 'Please select your sleep quality';
  }

  if (!lifestyle.stressLevel) {
    errors.stressLevel = 'Please select your stress level';
  }

  if (!lifestyle.anxietyLevel) {
    errors.anxietyLevel = 'Please select your general anxiety level';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepSupport(support: SupportExpectations): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!support.programSupport || support.programSupport.length === 0) {
    errors.programSupport = 'Please select at least one support expectation';
  }

  if (!support.preferredContactMethod) {
    errors.preferredContactMethod = 'Please choose your preferred contact method';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepDiet(diet: DietaryNutrition): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!diet.dietType) {
    errors.dietType = 'Please select your dietary preference';
  }

  if (diet.dietType === 'OTHER' && !diet.otherDietType?.trim()) {
    errors.otherDietType = 'Please specify your dietary preference';
  }

  if (!diet.dailyWaterIntake) {
    errors.dailyWaterIntake = 'Please select your daily water intake';
  }

  if (!diet.dailyMeals) {
    errors.dailyMeals = 'Please select how many meals you eat daily';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepActivity(activity: PhysicalActivity): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!activity.currentActivityLevel) {
    errors.currentActivityLevel = 'Please select your current activity level';
  }

  if (!activity.realisticExerciseDaysPerWeek) {
    errors.realisticExerciseDaysPerWeek = 'Please select how many days you can realistically exercise';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepCommitment(commitment: Commitment): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!commitment.commitmentLevel) {
    errors.commitmentLevel = 'Please select your commitment level';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepPlanSelection(plan?: PlanSelection): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!plan || !plan.planId) {
    errors.planSelection = 'Please select a wellness plan';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepBloodTest(bloodTest?: BloodTestAssessment): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!bloodTest || !bloodTest.reportStatus) {
    errors.reportStatus = 'Please select whether you have recent blood reports';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStepGoals(goals: GoalAssessment): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!goals.primaryGoals || goals.primaryGoals.length === 0) {
    errors.primaryGoals = 'Please select at least one primary goal';
  }

  if (goals.primaryGoals?.includes('Other') && !goals.otherGoal?.trim()) {
    errors.otherGoal = 'Please specify your other goal';
  }

  if (!goals.goalTimeline) {
    errors.goalTimeline = 'Please select your target timeline';
  }

  if (!goals.goalImportance) {
    errors.goalImportance = 'Please select how important this goal is to you';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Aliases for backward compatibility
export const validateStep2 = validateStepGoals;
export const validateStep3 = validateStepLifestyle;
export const validateStep4 = validateStepSupport;
export const validateStep5 = validateStepDiet;
export const validateStep6 = validateStepActivity;
export const validateStep7 = validateStepCommitment;
