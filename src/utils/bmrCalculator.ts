/**
 * BMR (Basal Metabolic Rate) & Body Composition Calculation Engine
 * Implements Mifflin-St Jeor equation and real-time Fat-Free Mass (FFM) math.
 */

import type { Gender } from '../types/customer';

export interface BmrCalculationResult {
  bmr: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  bodyFatPercent?: number;
  fatMassKg?: number;
  fatFreeMassKg?: number;
  sedentaryCalories: number;
  maintenanceCalories: number;
  recommendedProteinGrams: number;
}

/**
 * Calculates BMR using the Mifflin-St Jeor Equation:
 * Men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */
export function calculateMifflinStJeorBmr(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: Gender = 'Female',
  bodyFatPercent = 24,
  activityLevel = 'Sedentary'
): BmrCalculationResult {
  const safeWeight = Math.max(30, weightKg || 60);
  const safeHeight = Math.max(100, heightCm || 160);
  const safeAge = Math.max(15, ageYears || 28);
  const safeBodyFat = Math.min(60, Math.max(5, bodyFatPercent || 24));

  // Base Mifflin-St Jeor equation
  let bmr = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge;
  if (gender === 'Male') {
    bmr += 5;
  } else {
    // Default female equation
    bmr -= 161;
  }

  const roundedBmr = Math.round(bmr);

  // Body Composition Math
  const fatMassKg = Math.round(((safeWeight * safeBodyFat) / 100) * 10) / 10;
  const fatFreeMassKg = Math.round((safeWeight - fatMassKg) * 10) / 10;

  // Activity multipliers
  let activityMultiplier = 1.2; // Sedentary
  let proteinFactor = 1.5; // Sedentary

  if (activityLevel === 'Active at Gym' || activityLevel === "Extremely Active Player's" || activityLevel === 'Extremely Active') {
    activityMultiplier = 1.725;
    proteinFactor = 2.5;
  } else if (activityLevel === 'Moderately Active' || activityLevel === 'Moderate') {
    activityMultiplier = 1.55;
    proteinFactor = 2.0;
  } else if (activityLevel === 'Lightly Active') {
    activityMultiplier = 1.375;
    proteinFactor = 1.5;
  }

  const maintenanceCalories = Math.round(roundedBmr * activityMultiplier);
  const sedentaryCalories = Math.round(roundedBmr * 1.2);
  const recommendedProteinGrams = Math.round(fatFreeMassKg * proteinFactor);

  return {
    bmr: roundedBmr,
    gender,
    weightKg: safeWeight,
    heightCm: safeHeight,
    ageYears: safeAge,
    bodyFatPercent: safeBodyFat,
    fatMassKg,
    fatFreeMassKg,
    sedentaryCalories,
    maintenanceCalories,
    recommendedProteinGrams,
  };
}
