/**
 * Clinical Diet Chart Service & Pre-built Templates
 * Extracted directly from the /Sedentary clinical image specifications.
 */

import type { ClinicalDietChart, ClinicalFoodRow } from '../types/clinicalChart';

export function calculateMealTotals(foods: ClinicalFoodRow[]): {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
} {
  return foods.reduce(
    (acc, f) => ({
      calories: acc.calories + (f.calories || (f.proteinGrams * 4 + f.fatGrams * 9 + f.carbsGrams * 4)),
      protein: acc.protein + (f.proteinGrams || 0),
      fat: acc.fat + (f.fatGrams || 0),
      carbs: acc.carbs + (f.carbsGrams || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function calculateChartTotals(chart: ClinicalDietChart): {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
} {
  return chart.meals.reduce(
    (acc, m) => {
      const mt = calculateMealTotals(m.foods);
      return {
        totalCalories: acc.totalCalories + mt.calories,
        totalProtein: acc.totalProtein + mt.protein,
        totalFat: acc.totalFat + mt.fat,
        totalCarbs: acc.totalCarbs + mt.carbs,
      };
    },
    { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 }
  );
}

// Default Clinical Template 1: Bone Health Support (Image 11)
export const TEMPLATE_BONE_HEALTH: ClinicalDietChart = {
  id: 'chart_bone_health_default',
  clientId: 'default',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( ADDED OF LACTO-OVO-POLLO-VEG )',
  preMealSupplementsHeader: 'PRE MEAL SUPPLEMENTS:',
  preMealMicronutrientsHeader: 'PRE MEAL MICRONUTRIENTS SUPPORT:',
  status: 'published',
  publishedAt: Date.now(),
  updatedByAdminName: 'Senior Clinical Nutritionist',
  totalDailyCalorieTarget: 1750,
  totalMealPlanCalorie: 1750,
  recommendedCalorieTarget: 1750,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Breakfast)',
      scheduledTiming: '08:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 MK7 + VITAMIN D3 (As per doctor recommended)',
      foods: [
        { id: 'f1_1', rowNumber: 1, foodName: 'Rolled Oats with Almond Milk & Chia Seeds', quantity: '50g Oats + 15g Chia', proteinGrams: 14, fatGrams: 10, carbsGrams: 38, calories: 300 },
        { id: 'f1_2', rowNumber: 2, foodName: 'Boiled Egg Whites / Low Fat Paneer', quantity: '3 Whites / 60g Paneer', proteinGrams: 16, fatGrams: 3, carbsGrams: 2, calories: 100 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Morning / Pre-Lunch)',
      scheduledTiming: '11:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 MK7 + VITAMIN D3 (As per doctor recommended)',
      foods: [
        { id: 'f2_1', rowNumber: 1, foodName: 'Fresh Apple with Soaked Almonds', quantity: '1 Medium Apple + 10 Almonds', proteinGrams: 4, fatGrams: 7, carbsGrams: 22, calories: 170 },
        { id: 'f2_2', rowNumber: 2, foodName: 'Whey Protein Isolate Shake', quantity: '1 Scoop (30g)', proteinGrams: 26, fatGrams: 1, carbsGrams: 2, calories: 120 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Lunch)',
      scheduledTiming: '01:45 PM',
      foods: [
        { id: 'f3_1', rowNumber: 1, foodName: 'Whole Wheat Phulka (Roti)', quantity: '2 Medium Rotis (80g)', proteinGrams: 7, fatGrams: 3, carbsGrams: 44, calories: 230 },
        { id: 'f3_2', rowNumber: 2, foodName: 'Yellow Moong Dal (Light Tadka)', quantity: '1.5 Katori (225g)', proteinGrams: 16, fatGrams: 4, carbsGrams: 32, calories: 230 },
        { id: 'f3_3', rowNumber: 3, foodName: 'Grilled Chicken Breast / Tofu Sauté', quantity: '120g', proteinGrams: 32, fatGrams: 5, carbsGrams: 1, calories: 180 },
        { id: 'f3_4', rowNumber: 4, foodName: 'Cucumber & Spinach Salad with Lemon', quantity: '1 Bowl', proteinGrams: 2, fatGrams: 0, carbsGrams: 6, calories: 35 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Dinner / Evening)',
      scheduledTiming: '07:45 PM',
      foods: [
        { id: 'f4_1', rowNumber: 1, foodName: 'Steamed Brown Rice / Quinoa', quantity: '1 Katori (150g)', proteinGrams: 4, fatGrams: 1, carbsGrams: 34, calories: 165 },
        { id: 'f4_2', rowNumber: 2, foodName: 'Boiled Chickpeas (Chana) with Greens', quantity: '1 Katori (150g)', proteinGrams: 13, fatGrams: 4, carbsGrams: 41, calories: 245 },
        { id: 'f4_3', rowNumber: 3, foodName: 'Fresh Plain Curd / Greek Yogurt', quantity: '100g', proteinGrams: 6, fatGrams: 3, carbsGrams: 4, calories: 68 },
      ],
      isCompleted: false,
    },
  ],
};

// Template 2: Better Sleep & Muscle Recovery (Image 9 & 10)
export const TEMPLATE_BETTER_SLEEP_MAGNESIUM: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_better_sleep_magnesium',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( METABOLIC SLEEP & RECOVERY PROTOCOL )',
  meals: TEMPLATE_BONE_HEALTH.meals.map((m, idx) => {
    if (idx === 3) {
      return {
        ...m,
        postMealSupplement: 'MAGNESIUM GLYCINATE 100–200 mg (30-45 mins before sleep)',
      };
    }
    return { ...m, postMealSupplement: undefined };
  }),
};

// Template 3: Acetyl L-Carnitine Energy Boost (Image 1)
export const TEMPLATE_CARNITINE: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_carnitine_metabolic',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( ADDED OF LACTO-OVO-POLLO-VEG )',
  meals: TEMPLATE_BONE_HEALTH.meals.map((m, idx) => {
    if (idx === 0 || idx === 1) {
      return {
        ...m,
        preMealSupplement: 'Acetyl L-Carnitine 2 g (Take 20 mins pre-meal)',
        postMealSupplement: undefined,
      };
    }
    return { ...m, postMealSupplement: undefined };
  }),
};

// Template 4: Probiotics & Gut Motility (Image 3)
export const TEMPLATE_PROBIOTICS: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_probiotics_gut',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( GASTROINTESTINAL & GUT MOTILITY PROTOCOL )',
  meals: TEMPLATE_BONE_HEALTH.meals.map((m, idx) => {
    if (idx === 2 || idx === 3) {
      return {
        ...m,
        preMealSupplement: '30 minutes before – Take 2 gram Probiotic (Best Brand: VSL#3)',
        postMealSupplement: undefined,
      };
    }
    return { ...m, postMealSupplement: undefined };
  }),
};

// Template 5: Immunity & Antioxidant Defense (Image 4)
export const TEMPLATE_IMMUNITY: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_immunity_antioxidant',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( CELLULAR IMMUNITY & DEFENSE PROTOCOL )',
  meals: TEMPLATE_BONE_HEALTH.meals.map((m, idx) => {
    if (idx === 2) {
      return {
        ...m,
        postMealSupplement: 'Alpha Lipoic Acid (ALA) 600 mg + CoQ10 400 mg + Vitamin C 1000 mg + Vitamin E 600 IU',
      };
    }
    return { ...m, postMealSupplement: undefined };
  }),
};

// Template 6: Meal Replacer Protocol (Image 5)
export const TEMPLATE_MEAL_REPLACER: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_meal_replacer',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( MEAL REPLACER ACCELERATED PROTOCOL )',
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning Shake)',
      scheduledTiming: '08:30 AM',
      foods: [
        { id: 'mr1', rowNumber: 1, foodName: 'Whey Protein Isolate + Coconut Oil', quantity: '1 Scoop (30g) + 1 tbsp Virgin Coconut Oil', proteinGrams: 26, fatGrams: 14, carbsGrams: 2, calories: 240 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Day Replacer)',
      scheduledTiming: '12:00 PM',
      foods: [
        { id: 'mr2', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Cream + Coconut Oil', quantity: '1 Scoop + 1 tbsp Cream + 1 tsp Coconut Oil', proteinGrams: 26, fatGrams: 18, carbsGrams: 3, calories: 280 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Afternoon Shake)',
      scheduledTiming: '04:00 PM',
      foods: [
        { id: 'mr3', rowNumber: 1, foodName: 'Whey Protein Isolate + Coconut Oil + Berries', quantity: '1 Scoop + 1 tbsp Coconut Oil + 50g Berries', proteinGrams: 26, fatGrams: 14, carbsGrams: 8, calories: 260 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Evening Replacer)',
      scheduledTiming: '08:00 PM',
      foods: [
        { id: 'mr4', rowNumber: 1, foodName: 'Whey Protein Isolate + Coconut Oil + Dry Fruits', quantity: '1 Scoop + 1 tbsp Coconut Oil + 15g Almonds/Walnuts', proteinGrams: 29, fatGrams: 22, carbsGrams: 6, calories: 330 },
      ],
      isCompleted: false,
    },
  ],
};

// Template 7: Joint Pain (Image 7)
export const TEMPLATE_JOINT_PAIN: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_joint_pain_omega3',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( ANTI-INFLAMMATORY JOINT CARE PROTOCOL )',
  meals: TEMPLATE_BONE_HEALTH.meals.map((m, idx) => {
    if (idx === 3) {
      return {
        ...m,
        postMealSupplement: 'OMEGA-3, EPA and DHA 900 mg (Take with dinner)',
      };
    }
    return { ...m, postMealSupplement: undefined };
  }),
};

// Template 8: Muscle Gain (Fat & Protein Diet Strategy - Sedentary)
export const TEMPLATE_MUSCLE_GAIN: ClinicalDietChart = {
  ...TEMPLATE_BONE_HEALTH,
  id: 'chart_muscle_gain_fat_protein',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( LEAN MUSCLE HYPERTROPHY & RECOVERY PROTOCOL )',
  meals: TEMPLATE_BONE_HEALTH.meals.map((m, idx) => {
    if (idx === 0) {
      return {
        ...m,
        postMealSupplement: 'L-LEUCINE 3 g / WHEY PROTEIN ISOLATE (Optimal Muscle Protein Synthesis)',
      };
    }
    return m;
  }),
};

// ============================================================================
// MODERATE ACTIVITY CLINICAL PROTOCOLS (Extracted from /Moderate image folder)
// ============================================================================

// Moderate Base Template: High Protein, Moderate Fat Diet
export const TEMPLATE_MOD_BASE: ClinicalDietChart = {
  id: 'chart_mod_base',
  clientId: 'default',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( ADDED OF LACTO-OVO-POLLO-VEG )',
  preMealSupplementsHeader: 'PRE MEAL SUPPLEMENTS:',
  preMealMicronutrientsHeader: 'PRE MEAL MICRONUTRIENTS SUPPORT:',
  status: 'published',
  publishedAt: Date.now(),
  updatedByAdminName: 'Senior Clinical Nutritionist',
  totalDailyCalorieTarget: 1950,
  totalMealPlanCalorie: 1950,
  recommendedCalorieTarget: 1950,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Breakfast)',
      scheduledTiming: '08:00 AM',
      foods: [
        { id: 'mf1_1', rowNumber: 1, foodName: 'Oatmeal with Almond Milk & Chia Seeds', quantity: '60g Oats + 15g Chia', proteinGrams: 16, fatGrams: 10, carbsGrams: 44, calories: 340 },
        { id: 'mf1_2', rowNumber: 2, foodName: 'Boiled Eggs / Paneer Slices', quantity: '3 Eggs / 80g Paneer', proteinGrams: 20, fatGrams: 14, carbsGrams: 3, calories: 220 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Morning / Pre-Workout)',
      scheduledTiming: '11:30 AM',
      foods: [
        { id: 'mf2_1', rowNumber: 1, foodName: 'Fresh Fruit (Apple / Berries) + Almonds', quantity: '1 Fruit + 12 Almonds', proteinGrams: 5, fatGrams: 9, carbsGrams: 24, calories: 195 },
        { id: 'mf2_2', rowNumber: 2, foodName: 'Whey Protein Isolate Shake in Water', quantity: '1 Scoop (30g)', proteinGrams: 26, fatGrams: 1, carbsGrams: 2, calories: 120 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Lunch / Post-Workout)',
      scheduledTiming: '02:00 PM',
      foods: [
        { id: 'mf3_1', rowNumber: 1, foodName: 'Brown Rice / Multigrain Phulka', quantity: '150g Rice / 2 Rotis', proteinGrams: 8, fatGrams: 3, carbsGrams: 42, calories: 230 },
        { id: 'mf3_2', rowNumber: 2, foodName: 'Grilled Chicken Breast / Tofu Tikka', quantity: '150g', proteinGrams: 40, fatGrams: 6, carbsGrams: 2, calories: 230 },
        { id: 'mf3_3', rowNumber: 3, foodName: 'Dal Tadka (Moong / Masoor)', quantity: '1 Bowl (200g)', proteinGrams: 14, fatGrams: 5, carbsGrams: 28, calories: 210 },
        { id: 'mf3_4', rowNumber: 4, foodName: 'Cruciferous Green Salad with Olive Oil & Lemon', quantity: '1 Large Bowl', proteinGrams: 3, fatGrams: 4, carbsGrams: 8, calories: 80 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Dinner / Recovery)',
      scheduledTiming: '08:00 PM',
      foods: [
        { id: 'mf4_1', rowNumber: 1, foodName: 'Grilled Fish Fillet (Bhetki / Rohu) or Paneer Bhurji', quantity: '160g Fish / 120g Paneer', proteinGrams: 34, fatGrams: 12, carbsGrams: 4, calories: 260 },
        { id: 'mf4_2', rowNumber: 2, foodName: 'Sautéed Vegetables in Ghee (Broccoli, Peppers, Spinach)', quantity: '150g', proteinGrams: 5, fatGrams: 6, carbsGrams: 12, calories: 120 },
        { id: 'mf4_3', rowNumber: 3, foodName: 'Greek Yogurt / Set Curd with Flaxseeds', quantity: '120g', proteinGrams: 10, fatGrams: 5, carbsGrams: 6, calories: 110 },
      ],
      isCompleted: false,
    },
  ],
};

// Moderate Template 1: Muscle Gain Will Be Fat Protein Diet (Image 1)
export const TEMPLATE_MOD_MUSCLE_GAIN: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_muscle_gain',
  title: 'MUSCLE GAIN WILL BE FAT PROTEIN DIET',
  dietTypeTag: '( ADDED OF LACTO-OVO-POLLO-VEG )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 3) {
      return {
        ...m,
        postMealSupplement: 'EPA and DHA 900 mg (Take with dinner)',
      };
    }
    return m;
  }),
};

// Moderate Template 2: Power and Strength Performance (Image 2)
export const TEMPLATE_MOD_POWER_STRENGTH: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_power_strength',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( POWER & STRENGTH PERFORMANCE PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 2) {
      return {
        ...m,
        postMealSupplement: 'POST - WORKOUT: Immediately After Workout – Take 5 gram Creatine Monohydrate',
      };
    }
    return m;
  }),
};

// Moderate Template 3: Vascularity & Muscle Pump (Image 3)
export const TEMPLATE_MOD_VASCULARITY: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_vascularity',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( VASCULARITY, PERFORMANCE & MUSCLE PUMP PROTOCOL )',
  preMealSupplementsHeader: 'PRE - WORKOUT SUPPLEMENT: Caffeine Anhydrous (Caffeine Monohydrate) | DOSE: 1 to 3 Servings of 200 mg',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 2) {
      return {
        ...m,
        postMealSupplement: 'POST - WORKOUT: L-Citrulline (Citrulline Malate) – 3 gram',
      };
    }
    return m;
  }),
};

// Moderate Template 4: Improve Endurance & Delay Fatigue (Image 4)
export const TEMPLATE_MOD_ENDURANCE: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_endurance',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( ENDURANCE & FATIGUE BUFFERING PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 2) {
      return {
        ...m,
        postMealSupplement: 'POST - WORKOUT: Beta-Alanine – Take 2 gram Immediately After Workout',
      };
    }
    return m;
  }),
};

// Moderate Template 5: Busy Schedule Life Meal Replacer (Image 5 & Image 9)
export const TEMPLATE_MOD_MEAL_REPLACER: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_meal_replacer',
  title: 'BUSY SCHEDULE LIFE MEAL REPLACER',
  dietTypeTag: '( 5 WHEY ISOLATE REPLACER PROTOCOL )',
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning Replacer)',
      scheduledTiming: '08:00 AM',
      foods: [
        { id: 'mmr1', rowNumber: 1, foodName: 'Whey Protein Isolate + Virgin Coconut Oil', quantity: '1 Scoop (30g) + 1 tbsp Coconut Oil', proteinGrams: 26, fatGrams: 14, carbsGrams: 2, calories: 240 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Day Replacer)',
      scheduledTiming: '11:30 AM',
      foods: [
        { id: 'mmr2', rowNumber: 1, foodName: 'Whey Protein Isolate with Coconut Oil Cream', quantity: '1 Scoop + 1 tbsp Cream + 1 tsp Coconut Oil', proteinGrams: 26, fatGrams: 18, carbsGrams: 3, calories: 280 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Afternoon Replacer)',
      scheduledTiming: '03:30 PM',
      foods: [
        { id: 'mmr3', rowNumber: 1, foodName: 'Whey Protein Isolate with Blackberries & Strawberries', quantity: '1 Scoop + 80g Fresh Berries', proteinGrams: 26, fatGrams: 2, carbsGrams: 10, calories: 160 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Evening Replacer + Omega-3)',
      scheduledTiming: '07:30 PM',
      postMealSupplement: 'EPA and DHA 900 mg (Take with Meal 4)',
      foods: [
        { id: 'mmr4', rowNumber: 1, foodName: 'Whey Protein Isolate with Dry Foods (Almonds, Chia Seeds, Rolled Oats)', quantity: '1 Scoop + 20g Nuts + 10g Seeds', proteinGrams: 32, fatGrams: 18, carbsGrams: 14, calories: 350 },
      ],
      isCompleted: false,
    },
  ],
};

// Moderate Template 6: Bone Health Support (Image 7)
export const TEMPLATE_MOD_BONE_HEALTH: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_bone_health',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( BONE HEALTH & SKELETAL REPAIR PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 0 || idx === 1) {
      return {
        ...m,
        postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 MK7 + VITAMIN D3 (As per doctor recommended)',
      };
    }
    return m;
  }),
};

// Moderate Template 7: Poor Immunity (Image 8)
export const TEMPLATE_MOD_POOR_IMMUNITY: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_poor_immunity',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( CELLULAR DEFENSE & ANTIOXIDANT PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 2) {
      return {
        ...m,
        postMealSupplement: 'Alpha Lipoic Acid (ALA) 600 mg + CoQ10 400 mg + Vitamin C 1000 mg + Vitamin E 600 IU',
      };
    }
    return m;
  }),
};

// Moderate Template 8: Better Sleep & Recovery (Image 11)
export const TEMPLATE_MOD_BETTER_SLEEP: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_better_sleep',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( METABOLIC SLEEP & RECOVERY PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 3) {
      return {
        ...m,
        postMealSupplement: 'MAGNESIUM GLYCINATE 100–200 mg (Take 30-45 mins before sleep)',
      };
    }
    return m;
  }),
};

// Moderate Template 9: Frequently Muscle Cramps & Probiotics (Image 12)
export const TEMPLATE_MOD_MUSCLE_CRAMPS_PROBIOTICS: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_muscle_cramps_probiotics',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( GUT MOTILITY & PROBIOTICS PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 2 || idx === 3) {
      return {
        ...m,
        preMealSupplement: '30 minutes before – Take 2 gram Probiotic (Best Brand: VSL#3)',
      };
    }
    return m;
  }),
};

// Moderate Template 10: Joint Pain (Image 10)
export const TEMPLATE_MOD_JOINT_PAIN: ClinicalDietChart = {
  ...TEMPLATE_MOD_BASE,
  id: 'chart_mod_joint_pain',
  title: 'HIGH PROTEIN, MODERATE FAT DIET',
  dietTypeTag: '( ANTI-INFLAMMATORY JOINT CARE PROTOCOL )',
  meals: TEMPLATE_MOD_BASE.meals.map((m, idx) => {
    if (idx === 3) {
      return {
        ...m,
        postMealSupplement: 'MAGNESIUM GLYCINATE 100–200 mg + EPA and DHA 900 mg (Take with dinner)',
      };
    }
    return m;
  }),
};

import {
  POLLO_PESCATARIAN_3_MEAL,
  POLLO_PESCATARIAN_4_MEAL,
  POLLO_PESCATARIAN_5_MEAL,
  PESCATARIAN_3_MEAL,
  PESCATARIAN_4_MEAL,
  PESCATARIAN_5_MEAL,
  LACTO_OVO_VEG_3_MEAL,
  LACTO_OVO_VEG_4_MEAL,
  LACTO_OVO_VEG_5_MEAL,
  LACTO_VEG_3_MEAL,
  VEGAN_3_MEAL,
  resolveCustomizedDietChart,
} from './customizedMealPlans';

import { sendDietChartPublishedEmail } from './resendEmailService';

export {
  POLLO_PESCATARIAN_3_MEAL,
  POLLO_PESCATARIAN_4_MEAL,
  POLLO_PESCATARIAN_5_MEAL,
  PESCATARIAN_3_MEAL,
  PESCATARIAN_4_MEAL,
  PESCATARIAN_5_MEAL,
  LACTO_OVO_VEG_3_MEAL,
  LACTO_OVO_VEG_4_MEAL,
  LACTO_OVO_VEG_5_MEAL,
  LACTO_VEG_3_MEAL,
  VEGAN_3_MEAL,
  resolveCustomizedDietChart,
};

export const CLINICAL_TEMPLATES_CATALOG = [
  // ==================== MODERATE ACTIVITY PROTOCOLS ====================
  { id: 'mod_muscle_gain', name: '🏃 [MODERATE] Muscle Gain (Fat Protein Diet + Omega-3)', chart: TEMPLATE_MOD_MUSCLE_GAIN },
  { id: 'mod_power_strength', name: '🏃 [MODERATE] Power & Strength (Creatine Monohydrate 5g)', chart: TEMPLATE_MOD_POWER_STRENGTH },
  { id: 'mod_vascularity', name: '🏃 [MODERATE] Vascularity & Pump (Caffeine 200mg + L-Citrulline 3g)', chart: TEMPLATE_MOD_VASCULARITY },
  { id: 'mod_endurance', name: '🏃 [MODERATE] Endurance & Delay Fatigue (Beta-Alanine 2g)', chart: TEMPLATE_MOD_ENDURANCE },
  { id: 'mod_meal_replacer', name: '🏃 [MODERATE] Busy Schedule Meal Replacer (5 Shakes + Omega-3)', chart: TEMPLATE_MOD_MEAL_REPLACER },
  { id: 'mod_bone_health', name: '🏃 [MODERATE] Bone Health Support (CCM 500mg + K2 + D3)', chart: TEMPLATE_MOD_BONE_HEALTH },
  { id: 'mod_poor_immunity', name: '🏃 [MODERATE] Poor Immunity (ALA 600mg + CoQ10 400mg + Vit C/E)', chart: TEMPLATE_MOD_POOR_IMMUNITY },
  { id: 'mod_better_sleep', name: '🏃 [MODERATE] Better Sleep (Magnesium Glycinate 100-200mg)', chart: TEMPLATE_MOD_BETTER_SLEEP },
  { id: 'mod_muscle_cramps', name: '🏃 [MODERATE] Muscle Cramps & Gut (VSL#3 Probiotic 2g)', chart: TEMPLATE_MOD_MUSCLE_CRAMPS_PROBIOTICS },
  { id: 'mod_joint_pain', name: '🏃 [MODERATE] Joint Pain & Mobility (Magnesium + EPA/DHA 900mg)', chart: TEMPLATE_MOD_JOINT_PAIN },

  // ==================== SEDENTARY CLINICAL PROTOCOLS ====================
  { id: 'muscle_gain', name: '🛋️ [SEDENTARY] Muscle Gain (FAT, PROTEIN DIET)', chart: TEMPLATE_MUSCLE_GAIN },
  { id: 'bone_health', name: '🦴 [SEDENTARY] Bone Health Support (CCM + K2 MK-7 + D3)', chart: TEMPLATE_BONE_HEALTH },
  { id: 'sleep_cramps', name: '🌙 [SEDENTARY] Better Sleep & Muscle Cramps (Magnesium Glycinate)', chart: TEMPLATE_BETTER_SLEEP_MAGNESIUM },
  { id: 'carnitine', name: '⚡ [SEDENTARY] Energy Focus & Metabolic Drive (Acetyl L-Carnitine)', chart: TEMPLATE_CARNITINE },
  { id: 'probiotics', name: '🦠 [SEDENTARY] Gut Motility & Flatulence (Probiotics Protocol)', chart: TEMPLATE_PROBIOTICS },
  { id: 'immunity', name: '🛡️ [SEDENTARY] Immunity & Antioxidant Defense (ALA + CoQ10 + Vit C + Vit E)', chart: TEMPLATE_IMMUNITY },
  { id: 'joint_pain', name: '🩺 [SEDENTARY] Joint Pain & Anti-Inflammatory (Omega-3 EPA/DHA)', chart: TEMPLATE_JOINT_PAIN },
  { id: 'meal_replacer', name: '🥤 [SEDENTARY] Meal Replacer Liquid Macro Protocol', chart: TEMPLATE_MEAL_REPLACER },

  // ==================== CUSTOMIZED 3, 4, 5 MEAL PLANS ====================
  { id: 'pollo_pesc_3meal', name: '🍗🐟 Pollo-Pescatarian Whey (3 Meals)', chart: POLLO_PESCATARIAN_3_MEAL },
  { id: 'pollo_pesc_4meal', name: '🍗🐟 Pollo-Pescatarian Whey (4 Meals)', chart: POLLO_PESCATARIAN_4_MEAL },
  { id: 'pollo_pesc_5meal', name: '🍗🐟 Pollo-Pescatarian Whey (5 Meals)', chart: POLLO_PESCATARIAN_5_MEAL },
  { id: 'pesc_3meal', name: '🐟 Pescatarian Whey + Fat & Protein (3 Meals)', chart: PESCATARIAN_3_MEAL },
  { id: 'pesc_4meal', name: '🐟 Pescatarian Whey + Fat & Protein (4 Meals)', chart: PESCATARIAN_4_MEAL },
  { id: 'pesc_5meal', name: '🐟 Pescatarian Whey + Fat & Protein (5 Meals)', chart: PESCATARIAN_5_MEAL },
  { id: 'lacto_ovo_3meal', name: '🥚🧀 Lacto-Ovo-Veg Whey (3 Meals)', chart: LACTO_OVO_VEG_3_MEAL },
  { id: 'lacto_ovo_4meal', name: '🥚🧀 Lacto-Ovo-Veg Whey (4 Meals)', chart: LACTO_OVO_VEG_4_MEAL },
  { id: 'lacto_ovo_5meal', name: '🥚🧀 Lacto-Ovo-Veg Whey (5 Meals)', chart: LACTO_OVO_VEG_5_MEAL },
  { id: 'lacto_veg_3meal', name: '🧀 Lacto-Vegetarian (3 Meals)', chart: LACTO_VEG_3_MEAL },
  { id: 'vegan_3meal', name: '🌱 100% Vegan Plant-Based (3 Meals)', chart: VEGAN_3_MEAL },
];

import { ref, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';

const STORAGE_KEY_DIET_PREFIX = 'she_nourishes_clinical_chart_';

/**
 * Retrieves the client's active published diet chart.
 */
export function getClientActiveDietChart(clientId: string): ClinicalDietChart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DIET_PREFIX + clientId);
    if (raw) {
      return JSON.parse(raw) as ClinicalDietChart;
    }
  } catch (e) {
    console.warn('Error reading client diet chart:', e);
  }
  return { ...POLLO_PESCATARIAN_4_MEAL, clientId };
}

/**
 * Saves and publishes a clinical diet chart for a client to Firebase Realtime Database & local cache.
 * Dispatches automated update emails to both Client and Admin.
 */
export function publishClientDietChart(chart: ClinicalDietChart, clientEmail?: string, clientName?: string): void {
  try {
    const totals = calculateChartTotals(chart);
    const updated: ClinicalDietChart = {
      ...chart,
      totalMealPlanCalorie: totals.totalCalories,
      publishedAt: Date.now(),
      status: 'published',
    };

    // Save to local cache
    localStorage.setItem(STORAGE_KEY_DIET_PREFIX + (chart.clientId || 'default'), JSON.stringify(updated));

    // Send email notifications to client and admin
    sendDietChartPublishedEmail(
      clientEmail || 'client@domain.com',
      clientName || 'Patient',
      updated
    ).catch((err) => {
      console.warn('Error sending diet chart published email:', err);
    });

    // Save to Firebase Realtime DB
    if (isFirebaseConfigured && database && chart.clientId) {
      const chartRef = ref(database, `clients/${chart.clientId}/activeDietChart`);
      set(chartRef, updated).catch((err) => {
        console.warn('Could not sync diet chart to Firebase RTDB:', err);
      });
      set(ref(database, `customers/${chart.clientId}/dietChart`), updated).catch((err) => {
        console.warn('Firebase RTDB customer diet chart write warning:', err);
      });
      set(ref(database, `dietCharts/${chart.clientId}`), updated).catch((err) => {
        console.warn('Firebase RTDB global diet chart write warning:', err);
      });
    }
  } catch (e) {
    console.error('Error saving clinical diet chart:', e);
  }
}

/**
 * Client action: Marks a meal as completed / followed.
 */
export function toggleMealFollowed(clientId: string, mealNumber: number): ClinicalDietChart {
  const chart = getClientActiveDietChart(clientId);
  const updatedMeals = chart.meals.map((m) => {
    if (m.mealNumber === mealNumber) {
      const nextCompleted = !m.isCompleted;
      return {
        ...m,
        isCompleted: nextCompleted,
        completedAt: nextCompleted ? Date.now() : undefined,
      };
    }
    return m;
  });

  const updatedChart = { ...chart, meals: updatedMeals };
  publishClientDietChart(updatedChart);
  return updatedChart;
}
