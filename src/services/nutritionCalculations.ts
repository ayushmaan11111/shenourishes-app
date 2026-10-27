/**
 * Deterministic Nutrition & Macro Calculation Engine for She Nourishes (Phase 2)
 * 
 * Strict Architectural Rule:
 * All nutritional figures are calculated deterministically from verified 100g food baselines.
 * AI suggestions and LLMs consume these calculated figures and NEVER hallucinate numbers.
 */

import type { FoodItem, MacroNutrients, MealFoodItem, DietPlan, DailyNutritionTargets } from '../types/nutrition';
import type { CustomerRecord } from '../types/customer';

/**
 * Calculates exact macronutrients for any gram weight based on a 100g food baseline.
 */
export function calculateFoodItemMacros(food: FoodItem, grams: number): MacroNutrients {
  if (!grams || grams <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  }

  const factor = grams / 100.0;
  return {
    calories: Math.round(food.per100g.calories * factor),
    protein: Number((food.per100g.protein * factor).toFixed(1)),
    carbs: Number((food.per100g.carbs * factor).toFixed(1)),
    fat: Number((food.per100g.fat * factor).toFixed(1)),
    fiber: Number((food.per100g.fiber * factor).toFixed(1)),
  };
}

/**
 * Aggregates all foods within a single meal.
 */
export function calculateMealTotalMacros(foods: MealFoodItem[]): MacroNutrients {
  return foods.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.macros?.calories || 0),
      protein: Number((acc.protein + (item.macros?.protein || 0)).toFixed(1)),
      carbs: Number((acc.carbs + (item.macros?.carbs || 0)).toFixed(1)),
      fat: Number((acc.fat + (item.macros?.fat || 0)).toFixed(1)),
      fiber: Number((acc.fiber + (item.macros?.fiber || 0)).toFixed(1)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * Calculates cumulative daily totals across all prescribed meals in a diet plan.
 */
export function calculateDietPlanTotalMacros(plan: DietPlan): MacroNutrients {
  return plan.meals.reduce(
    (acc, meal) => {
      const mealMacros = calculateMealTotalMacros(meal.foods);
      return {
        calories: acc.calories + mealMacros.calories,
        protein: Number((acc.protein + mealMacros.protein).toFixed(1)),
        carbs: Number((acc.carbs + mealMacros.carbs).toFixed(1)),
        fat: Number((acc.fat + mealMacros.fat).toFixed(1)),
        fiber: Number((acc.fiber + mealMacros.fiber).toFixed(1)),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * Computes baseline clinical targets using Mifflin-St Jeor equation and activity intensity factor.
 * Used as a starting recommendation which the nutritionist can override.
 */
export function calculateClientBaselines(client: CustomerRecord): DailyNutritionTargets {
  const weightKg = client.personalDetails.weight || 60;
  const heightCm = client.personalDetails.height || 162;
  const age = client.personalDetails.age || 28;
  const gender = client.personalDetails.gender || 'Female';

  // 1. Calculate Basal Metabolic Rate (BMR) via Mifflin-St Jeor
  let bmr: number;
  if (gender === 'Male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    // Default female
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // 2. Activity Multiplier
  const activityLevel = client.physicalActivity?.currentActivityLevel || 'Sedentary';
  let activityMultiplier = 1.2;
  if (activityLevel === 'Beginner at Gym' || activityLevel === 'Lightly Active') {
    activityMultiplier = 1.375;
  } else if (activityLevel === 'Active at Gym' || activityLevel === 'Moderately Active') {
    activityMultiplier = 1.55;
  } else if (activityLevel === "Extremely Active Player's" || activityLevel === 'Extremely Active') {
    activityMultiplier = 1.725;
  }

  const tdee = Math.round(bmr * activityMultiplier);

  // 3. Goal Calorie Adjustment
  const primaryGoals = client.goalAssessment?.primaryGoals || [];
  let calorieAdjustment = 0;
  let proteinMultiplier = 1.6; // grams per kg bodyweight

  const isFatLoss = primaryGoals.some((g) => g.toUpperCase().includes('FAT LOSS') || g.toUpperCase().includes('WEIGHT LOSS'));
  const isMuscleGain = primaryGoals.some((g) => g.toUpperCase().includes('MUSCLE GAIN') || g.toUpperCase().includes('STRENGTH'));

  if (isFatLoss) {
    calorieAdjustment = -400; // Moderate, sustainable deficit
    proteinMultiplier = 1.8;  // High protein for muscle preservation
  } else if (isMuscleGain) {
    calorieAdjustment = 250;  // Lean surplus
    proteinMultiplier = 2.0;  // Muscle hypertrophy support
  } else {
    // Metabolic balance / wellness
    calorieAdjustment = 0;
    proteinMultiplier = 1.5;
  }

  const targetCalories = Math.max(1200, Math.round(tdee + calorieAdjustment));
  const proteinGrams = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;

  // Fats at ~25% of total caloric intake (minimum 40g for hormone synthesis)
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.max(40, Math.round(fatCalories / 9));

  // Carbohydrates make up the remaining balance
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatGrams * 9));
  const carbsGrams = Math.round(remainingCalories / 4);

  // Fiber target (~14g per 1000 kcal)
  const fiberGrams = Math.round((targetCalories / 1000) * 14);

  // Water target (35ml per kg bodyweight, minimum 2500ml)
  const waterMl = Math.max(2500, Math.round(weightKg * 38));

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams,
    waterMl,
    isCustomAdminOverride: false,
    calculatedBaselines: {
      bmr: Math.round(bmr),
      tdee,
      targetDeficitSurplus: calorieAdjustment,
      activityIntensityFactor: activityMultiplier,
    },
  };
}
