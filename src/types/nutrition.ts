/**
 * Core Nutrition, Food Database, and Diet Planning Types for She Nourishes (Phase 2)
 */

export interface MacroNutrients {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber: number;   // in grams
}

export interface Micronutrients {
  sugarGrams?: number;
  sodiumMg?: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminDMcg?: number;
  vitaminB12Mcg?: number;
  magnesiumMg?: number;
  zincMg?: number;
}

export type FoodCategory =
  | 'Grains & Cereals'
  | 'Lentils & Pulses (Dals)'
  | 'Dairy & Paneer'
  | 'Vegetables & Greens'
  | 'Fruits'
  | 'Nuts & Seeds'
  | 'Poultry & Seafood'
  | 'Eggs'
  | 'Fats & Healthy Oils'
  | 'Proteins & Supplements'
  | 'Beverages'
  | 'Snacks & Others';

export type ServingUnit =
  | 'g'
  | 'ml'
  | 'piece'
  | 'cup'
  | 'katori'
  | 'tbsp'
  | 'tsp'
  | 'roti'
  | 'slice'
  | 'scoop';

export type DietaryTag =
  | 'Veg'
  | 'Non-Veg'
  | 'Vegan'
  | 'Eggetarian'
  | 'Gluten-Free'
  | 'Dairy-Free'
  | 'High-Protein'
  | 'Low-GI'
  | 'Keto-Friendly';

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: FoodCategory;
  standardServingUnit: ServingUnit;
  standardServingWeightGrams: number; // e.g. 1 medium roti = 40g, 1 scoop = 30g, 1 katori dal = 150g
  per100g: MacroNutrients;
  microsPer100g?: Micronutrients;
  dietaryTags: DietaryTag[];
  isVerifiedClinical: boolean;
  source: 'She Nourishes Clinical DB' | 'USDA' | 'Custom User Food';
  createdAt?: number;
}

export interface DailyNutritionTargets {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterMl: number;
  isCustomAdminOverride: boolean;
  overriddenByAdminId?: string;
  calculatedBaselines?: {
    bmr: number;
    tdee: number;
    targetDeficitSurplus: number;
    activityIntensityFactor: number;
  };
}

export interface MealFoodAlternative {
  foodId: string;
  foodName: string;
  quantityGrams: number;
  servingDisplay: string; // e.g. "150g (1 medium bowl)"
  macros: MacroNutrients;
  reason?: string; // e.g. "Vegetarian swap"
}

export interface MealFoodItem {
  foodId: string;
  foodName: string;
  quantityGrams: number;
  servingDisplay: string; // e.g. "60g (1.5 scoop)" or "2 rotis (80g)"
  macros: MacroNutrients;
  isOptional?: boolean;
  notes?: string; // e.g. "Soak overnight before cooking"
  alternatives?: MealFoodAlternative[];
}

export interface ClientMealSupplement {
  supplementId: string;
  name: string;
  dosage: string; // e.g. "5g" or "1 capsule"
  timingNote?: string; // e.g. "Take immediately after breakfast"
}

export interface DietPlanMeal {
  id: string;
  mealNumber: number;
  name: string; // e.g. "Pre-Workout Boost", "Breakfast", "Mid-Morning", "Lunch", "Evening Snack", "Dinner"
  preferredTiming: string; // e.g. "08:00 AM"
  targetMacros?: MacroNutrients;
  foods: MealFoodItem[];
  supplements: ClientMealSupplement[];
  clinicalNotes?: string;
}

export interface DietPlan {
  id: string;
  clientId: string;
  planTitle: string; // e.g. "PCOS & Metabolic Fat Loss - Phase 2"
  versionNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  status: 'active' | 'archived' | 'draft';
  dailyTargets: DailyNutritionTargets;
  meals: DietPlanMeal[];
  generalGuidelines: string[];
  createdByAdminId: string;
  createdByAdminName?: string;
  createdAt: number;
  updatedAt: number;
}
