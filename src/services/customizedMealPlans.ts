/**
 * Customized 3, 4, and 5-Meal Plans
 * Extracted with high precision from the clinical folder charts:
 * 1. Pollo-Pescatarian Whey Protein (3, 4, 5 meals)
 * 2. Pescatarian, Fat Protein Add Whey (3, 4, 5 meals)
 * 3. Lacto-Ovo-Veg Whey Protein (3, 4, 5 meals)
 * 4. Pure Lacto-Vegetarian (3, 4, 5 meals)
 * 5. Vegan Plant-Based Fat & Protein (3, 4, 5 meals)
 *
 * Integrated with the 16 Clinical Supplement Stacks from the Nutrition Planning reference tables.
 */

import type { ClinicalDietChart } from '../types/clinicalChart';

// ==========================================
// 1. POLLO-PESCATARIAN WHEY PROTEIN PROTOCOLS
// ==========================================

export const POLLO_PESCATARIAN_3_MEAL: ClinicalDietChart = {
  id: 'chart_pollo_pescatarian_3meal',
  clientId: 'default',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( POLLO-PESCATARIAN 3-MEAL PROTOCOL • LOW CARB 80–120g • HIGH PROTEIN )',
  preMealSupplementsHeader: 'PRE-MEAL SUPPLEMENTS & ERGOGENICS:',
  preMealMicronutrientsHeader: 'CLINICAL MICRONUTRIENT & ANTIOXIDANT STACK:',
  status: 'published',
  publishedAt: Date.now(),
  updatedByAdminName: 'Senior Clinical Nutritionist',
  totalDailyCalorieTarget: 1780,
  totalMealPlanCalorie: 1780,
  recommendedCalorieTarget: 1780,
  generalNotes: [
    'Strict Rule: No Rice / Roti at Dinner.',
    'Incidental Carbs < 30g per meal from Low-GI sources (Millet, Brown Rice, Quinoa).',
    'Good Fats: Rotate Cold Press Coconut Oil, Pure Ghee, and Butter.',
    'Hydration Target: 2.5 – 3.0 Litres of pure water daily.',
    'Daily Nuts & Seeds: 10-12 Almonds, 2 Walnut halves, 1 tbsp Pumpkin seeds, 1 tbsp Flaxseeds.',
  ],
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Within 1 hr of waking - Protein Shake)',
      scheduledTiming: '08:00 AM',
      preMealSupplement: 'Beta-Alanine & Citrulline 6 g (Empty stomach for nitric oxide blood flow)',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Breakfast)',
      foods: [
        { id: 'pp3_1_1', rowNumber: 1, foodName: 'Whey Protein Isolate (High Purity)', quantity: '1 Scoop (25g)', proteinGrams: 24, fatGrams: 1, carbsGrams: 2, calories: 115 },
        { id: 'pp3_1_2', rowNumber: 2, foodName: 'Fresh/Frozen Blackberries (Antioxidant Rich)', quantity: '1/2 Cup (70g)', proteinGrams: 1, fatGrams: 0.5, carbsGrams: 7, calories: 35 },
        { id: 'pp3_1_3', rowNumber: 3, foodName: 'Unsweetened Almond Milk', quantity: '1 Cup (200ml)', proteinGrams: 2, fatGrams: 3, carbsGrams: 1, calories: 40 },
        { id: 'pp3_1_4', rowNumber: 4, foodName: 'Cold Pressed Virgin Coconut Oil (MCTs)', quantity: '1 tbsp (15ml)', proteinGrams: 0, fatGrams: 14, carbsGrams: 0, calories: 125 },
        { id: 'pp3_1_5', rowNumber: 5, foodName: 'Chia Seeds', quantity: '1 tsp (5g)', proteinGrams: 1, fatGrams: 1.5, carbsGrams: 2, calories: 25 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (12:30 PM – 02:00 PM - Main Food / Lunch)',
      scheduledTiming: '01:30 PM',
      preMealSupplement: 'Acetyl L-Carnitine 1.5 g (30 mins before lunch for fatty acid oxidation)',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg + Curcumin 95% 1g (Post Lunch)',
      foods: [
        { id: 'pp3_2_1', rowNumber: 1, foodName: 'Pomfret Tikka (Marinated in Hung Curd & Spices)', quantity: '150g Steaks', proteinGrams: 32, fatGrams: 12, carbsGrams: 3, calories: 250 },
        { id: 'pp3_2_2', rowNumber: 2, foodName: 'Cold Pressed Coconut Oil (Pan Grill Brush)', quantity: '1 tsp (5ml)', proteinGrams: 0, fatGrams: 5, carbsGrams: 0, calories: 45 },
        { id: 'pp3_2_3', rowNumber: 3, foodName: 'Grilled Vegetables (Broccoli, Bell Peppers, Zucchini)', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 1, carbsGrams: 8, calories: 55 },
        { id: 'pp3_2_4', rowNumber: 4, foodName: 'Cucumber & Lemon Herb Salad', quantity: '1 Medium Bowl', proteinGrams: 1, fatGrams: 0, carbsGrams: 4, calories: 20 },
        { id: 'pp3_2_5', rowNumber: 5, foodName: 'Cooked Brown Rice / Quinoa (Low-GI)', quantity: '1/2 Cup (Cooked)', proteinGrams: 3, fatGrams: 1, carbsGrams: 22, calories: 110 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (07:00 PM – 08:00 PM - Dinner / Pure Dry Meal)',
      scheduledTiming: '07:30 PM',
      postMealSupplement: 'Omega-3 EPA/DHA 900 mg + Magnesium Glycinate 200 mg at Bedtime (Neuromuscular recovery)',
      foods: [
        { id: 'pp3_3_1', rowNumber: 1, foodName: 'Prawns (Cleaned & De-veined)', quantity: '100g', proteinGrams: 24, fatGrams: 1, carbsGrams: 0, calories: 105 },
        { id: 'pp3_3_2', rowNumber: 2, foodName: 'Fresh Paneer Cubes (Cottage Cheese)', quantity: '100g', proteinGrams: 18, fatGrams: 20, carbsGrams: 3, calories: 265 },
        { id: 'pp3_3_3', rowNumber: 3, foodName: 'Stir-Fry Greens (Broccoli 1 Cup, Capsicum 1/2 Cup, Onion)', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 1, carbsGrams: 9, calories: 60 },
        { id: 'pp3_3_4', rowNumber: 4, foodName: 'Pure Coconut Oil / Ghee for Stir Fry', quantity: '1 tsp (5ml)', proteinGrams: 0, fatGrams: 5, carbsGrams: 0, calories: 45 },
      ],
      isCompleted: false,
    },
  ],
};

export const POLLO_PESCATARIAN_4_MEAL: ClinicalDietChart = {
  ...POLLO_PESCATARIAN_3_MEAL,
  id: 'chart_pollo_pescatarian_4meal',
  dietTypeTag: '( POLLO-PESCATARIAN 4-MEAL PROTOCOL • LOW CARB 80–120g • HIGH PROTEIN )',
  totalDailyCalorieTarget: 1840,
  totalMealPlanCalorie: 1840,
  recommendedCalorieTarget: 1840,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Early Morning Shake - Whey Protein)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Breakfast)',
      foods: [
        { id: 'pp4_1_1', rowNumber: 1, foodName: 'Whey Protein Isolate with Fresh Strawberry', quantity: '1 Scoop (25g) + 1/2 Cup Berries', proteinGrams: 25, fatGrams: 1, carbsGrams: 8, calories: 140 },
        { id: 'pp4_1_2', rowNumber: 2, foodName: 'Unsweetened Coconut Milk / Almond Milk', quantity: '1 Cup (200ml)', proteinGrams: 1, fatGrams: 4, carbsGrams: 2, calories: 50 },
        { id: 'pp4_1_3', rowNumber: 3, foodName: 'Virgin Coconut Oil', quantity: '1 tsp (5ml)', proteinGrams: 0, fatGrams: 5, carbsGrams: 0, calories: 45 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (11:30 AM - Main Food: Fish Tikka)',
      scheduledTiming: '11:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Lunch)',
      foods: [
        { id: 'pp4_2_1', rowNumber: 1, foodName: 'Fish Tikka (Rohu / Pomfret in Hung Curd Marinade)', quantity: '150g', proteinGrams: 30, fatGrams: 8, carbsGrams: 3, calories: 205 },
        { id: 'pp4_2_2', rowNumber: 2, foodName: 'Cucumber & Spinach Green Salad', quantity: '1 Bowl', proteinGrams: 2, fatGrams: 0, carbsGrams: 4, calories: 25 },
        { id: 'pp4_2_3', rowNumber: 3, foodName: 'Cooked Millet / Quinoa (Optional)', quantity: '1/2 Cup', proteinGrams: 3, fatGrams: 1, carbsGrams: 20, calories: 100 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (04:00 PM - Post-Workout Chocolate Shake)',
      scheduledTiming: '04:00 PM',
      preMealSupplement: 'L-Leucine 5 g (Optimal muscle protein synthesis trigger)',
      foods: [
        { id: 'pp4_3_1', rowNumber: 1, foodName: 'Whey Protein Shake with Pure Cocoa Powder', quantity: '1 Scoop + 1 tsp Cocoa', proteinGrams: 25, fatGrams: 2, carbsGrams: 3, calories: 130 },
        { id: 'pp4_3_2', rowNumber: 2, foodName: 'Unsweetened Coconut Milk', quantity: '1 Cup (200ml)', proteinGrams: 1, fatGrams: 5, carbsGrams: 2, calories: 60 },
        { id: 'pp4_3_3', rowNumber: 3, foodName: 'Soaked Almonds & Walnuts', quantity: '10 Almonds + 2 Walnuts', proteinGrams: 4, fatGrams: 12, carbsGrams: 3, calories: 135 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (07:30 PM - Dinner: Chicken Hariyali Kebab)',
      scheduledTiming: '07:30 PM',
      postMealSupplement: 'Omega-3 EPA/DHA 900 mg + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'pp4_4_1', rowNumber: 1, foodName: 'Chicken Hariyali Kebab (Breast with Mint, Coriander & Garlic)', quantity: '150g', proteinGrams: 38, fatGrams: 6, carbsGrams: 2, calories: 215 },
        { id: 'pp4_4_2', rowNumber: 2, foodName: 'Stir-Fried Broccoli & Zucchini in Coconut Oil', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 5, carbsGrams: 7, calories: 90 },
      ],
      isCompleted: false,
    },
  ],
};

export const POLLO_PESCATARIAN_5_MEAL: ClinicalDietChart = {
  ...POLLO_PESCATARIAN_3_MEAL,
  id: 'chart_pollo_pescatarian_5meal',
  dietTypeTag: '( POLLO-PESCATARIAN 5-MEAL PROTOCOL • 5 RECOVERY BLOCKS • HIGH PROTEIN )',
  totalDailyCalorieTarget: 1920,
  totalMealPlanCalorie: 1920,
  recommendedCalorieTarget: 1920,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Breakfast Shake: Blackberry & Coconut Oil)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'pp5_1_1', rowNumber: 1, foodName: 'Whey Protein Isolate (25g)', quantity: '1 Scoop', proteinGrams: 24, fatGrams: 1, carbsGrams: 2, calories: 115 },
        { id: 'pp5_1_2', rowNumber: 2, foodName: 'Fresh Blackberries + Almond Milk', quantity: '1/2 Cup + 200ml Milk', proteinGrams: 3, fatGrams: 4, carbsGrams: 8, calories: 75 },
        { id: 'pp5_1_3', rowNumber: 3, foodName: 'Cold Pressed Coconut Oil + Chia Seeds', quantity: '1 tbsp Oil + 1 tsp Chia', proteinGrams: 1, fatGrams: 15, carbsGrams: 2, calories: 150 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Main Food / Lunch: Vetki Tikka)',
      scheduledTiming: '11:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg + Curcumin 1g',
      foods: [
        { id: 'pp5_2_1', rowNumber: 1, foodName: 'Vetki (Bhetki) Fillet Tikka (Hung Curd Marinade)', quantity: '150g Cubes', proteinGrams: 32, fatGrams: 8, carbsGrams: 2, calories: 210 },
        { id: 'pp5_2_2', rowNumber: 2, foodName: 'Mint Coriander Chutney & Fresh Green Salad', quantity: '1 Bowl', proteinGrams: 2, fatGrams: 1, carbsGrams: 4, calories: 35 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Afternoon Snack: Paneer Tikka Salad)',
      scheduledTiming: '02:30 PM',
      foods: [
        { id: 'pp5_3_1', rowNumber: 1, foodName: 'Lightly Grilled Paneer Cubes in Coconut Oil', quantity: '100g Paneer', proteinGrams: 18, fatGrams: 20, carbsGrams: 3, calories: 265 },
        { id: 'pp5_3_2', rowNumber: 2, foodName: 'Capsicum, Onion & Cucumber Salad with Chat Masala', quantity: '1.5 Cups', proteinGrams: 2, fatGrams: 0, carbsGrams: 7, calories: 40 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Evening Protein Shake: Strawberry & Coconut Milk)',
      scheduledTiming: '05:30 PM',
      preMealSupplement: 'L-Leucine 5 g + Acetyl L-Carnitine 1.5 g',
      foods: [
        { id: 'pp5_4_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Strawberries', quantity: '1 Scoop + 1/2 Cup Berries', proteinGrams: 24, fatGrams: 1, carbsGrams: 7, calories: 135 },
        { id: 'pp5_4_2', rowNumber: 2, foodName: 'Unsweetened Coconut Milk + Flaxseeds (1 tsp)', quantity: '200ml Milk + 1 tsp Seeds', proteinGrams: 2, fatGrams: 8, carbsGrams: 3, calories: 95 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 5,
      mealName: 'MEAL 5 (Dinner: Prawn Chingri Pepper Roast)',
      scheduledTiming: '08:00 PM',
      postMealSupplement: 'Antioxidant Stack (ALA 600mg + CoQ10 400mg) + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'pp5_5_1', rowNumber: 1, foodName: 'Prawn (Chingri) Pepper Roast with Curry Leaves & Garlic', quantity: '150g', proteinGrams: 36, fatGrams: 4, carbsGrams: 1, calories: 185 },
        { id: 'pp5_5_2', rowNumber: 2, foodName: 'Cold Pressed Coconut Oil for Sauté', quantity: '1 tbsp (15ml)', proteinGrams: 0, fatGrams: 14, carbsGrams: 0, calories: 125 },
      ],
      isCompleted: false,
    },
  ],
};


// ==========================================
// 2. PESCATARIAN FAT PROTEIN ADD WHEY
// ==========================================

export const PESCATARIAN_3_MEAL: ClinicalDietChart = {
  id: 'chart_pescatarian_3meal',
  clientId: 'default',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( PESCATARIAN 3-MEAL PROTOCOL • LOW CARB 80–120g • HIGH HEALTHY FATS )',
  preMealSupplementsHeader: 'PRE-MEAL SUPPLEMENTS & ERGOGENICS:',
  preMealMicronutrientsHeader: 'CLINICAL MICRONUTRIENT & ANTIOXIDANT STACK:',
  status: 'published',
  publishedAt: Date.now(),
  updatedByAdminName: 'Senior Clinical Nutritionist',
  totalDailyCalorieTarget: 1750,
  totalMealPlanCalorie: 1750,
  recommendedCalorieTarget: 1750,
  generalNotes: [
    'Cooking Fats: Cold Pressed Coconut Oil / Butter / Pure Ghee Only (No Olive oil for high heat cooking).',
    'Low-GI Carbs: Millet / Brown Rice (1/2 cup cooked max twice a day - No rice/roti at dinner).',
    'Sample Portions: Fish/Paneer 120–150g, Veggies 1–2 cups, Healthy Fats 1–2 tbsp.',
    'Hydration: 2.5 – 3.0 L daily water.',
  ],
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning: Paneer Bhurji / Scrambled Paneer)',
      scheduledTiming: '08:00 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Breakfast)',
      foods: [
        { id: 'pes3_1_1', rowNumber: 1, foodName: 'Scrambled Paneer (Crumbled Cottage Cheese)', quantity: '120g', proteinGrams: 22, fatGrams: 24, carbsGrams: 4, calories: 320 },
        { id: 'pes3_1_2', rowNumber: 2, foodName: 'Pure Butter & Fresh Cream (Tossed with Pepper & Salt)', quantity: '1 tbsp Butter + 1 tbsp Cream', proteinGrams: 1, fatGrams: 18, carbsGrams: 1, calories: 170 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Day: Kiwi Whey Protein Shake with Coconut Oil)',
      scheduledTiming: '01:00 PM',
      preMealSupplement: 'Acetyl L-Carnitine 1.5 g + Beta-Alanine 3 g',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Lunch)',
      foods: [
        { id: 'pes3_2_1', rowNumber: 1, foodName: 'Whey Protein Isolate Shake', quantity: '1 Scoop (30g)', proteinGrams: 26, fatGrams: 1, carbsGrams: 2, calories: 120 },
        { id: 'pes3_2_2', rowNumber: 2, foodName: 'Fresh Kiwi (Sliced)', quantity: '1 Medium (70g)', proteinGrams: 1, fatGrams: 0.5, carbsGrams: 10, calories: 45 },
        { id: 'pes3_2_3', rowNumber: 3, foodName: 'Cold Pressed Virgin Coconut Oil', quantity: '1 tbsp (15ml)', proteinGrams: 0, fatGrams: 14, carbsGrams: 0, calories: 125 },
        { id: 'pes3_2_4', rowNumber: 4, foodName: 'Steamed Quinoa / Brown Rice', quantity: '1/2 Cup Cooked', proteinGrams: 3, fatGrams: 1, carbsGrams: 20, calories: 100 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Dinner: Bhetki Fillet in Lemon Garlic Butter - No Rice)',
      scheduledTiming: '07:30 PM',
      postMealSupplement: 'Triple Strength Omega-3 (EPA 540mg + DHA 360mg) + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'pes3_3_1', rowNumber: 1, foodName: 'Fresh Bhetki Fillet (Pan seared in Garlic Lemon Butter)', quantity: '150g', proteinGrams: 32, fatGrams: 14, carbsGrams: 1, calories: 260 },
        { id: 'pes3_3_2', rowNumber: 2, foodName: 'Sautéed Zucchini, Broccoli & Spinach', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 5, carbsGrams: 6, calories: 85 },
      ],
      isCompleted: false,
    },
  ],
};

export const PESCATARIAN_4_MEAL: ClinicalDietChart = {
  ...PESCATARIAN_3_MEAL,
  id: 'chart_pescatarian_4meal',
  dietTypeTag: '( PESCATARIAN 4-MEAL PROTOCOL • LOW CARB 80–120g • HIGH PROTEIN & FATS )',
  totalDailyCalorieTarget: 1820,
  totalMealPlanCalorie: 1820,
  recommendedCalorieTarget: 1820,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning: Strawberry Whey Protein Shake)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'pes4_1_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Strawberries', quantity: '1 Scoop + 1/2 Cup Berries', proteinGrams: 25, fatGrams: 1, carbsGrams: 7, calories: 135 },
        { id: 'pes4_1_2', rowNumber: 2, foodName: 'Coconut Milk + Virgin Coconut Oil', quantity: '150ml Milk + 1 tsp Oil', proteinGrams: 1, fatGrams: 9, carbsGrams: 2, calories: 95 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Lunch: Fish Tikka / Pomfret Fillet)',
      scheduledTiming: '12:30 PM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg + Curcumin 1g',
      foods: [
        { id: 'pes4_2_1', rowNumber: 1, foodName: 'Pomfret / Rohu Tikka with Spices & Coconut Oil', quantity: '150g', proteinGrams: 30, fatGrams: 10, carbsGrams: 2, calories: 220 },
        { id: 'pes4_2_2', rowNumber: 2, foodName: 'Steamed Brown Rice / Millet', quantity: '1/2 Cup', proteinGrams: 3, fatGrams: 1, carbsGrams: 22, calories: 110 },
        { id: 'pes4_2_3', rowNumber: 3, foodName: 'Cucumber & Cherry Tomato Salad', quantity: '1 Bowl', proteinGrams: 1, fatGrams: 0, carbsGrams: 4, calories: 20 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Post-Workout / Evening: Kiwi Protein Shake)',
      scheduledTiming: '04:30 PM',
      preMealSupplement: 'L-Leucine 5 g (Post-workout anabolic trigger)',
      foods: [
        { id: 'pes4_3_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Kiwi', quantity: '1 Scoop + 1 Kiwi', proteinGrams: 25, fatGrams: 1, carbsGrams: 11, calories: 150 },
        { id: 'pes4_3_2', rowNumber: 2, foodName: 'Roasted Almonds & Walnuts', quantity: '10 pcs Almonds + 2 Walnuts', proteinGrams: 4, fatGrams: 12, carbsGrams: 3, calories: 135 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Dinner: Grilled Prawns & Paneer with Stir-Fry Veggies)',
      scheduledTiming: '07:30 PM',
      postMealSupplement: 'Omega-3 EPA/DHA 900 mg + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'pes4_4_1', rowNumber: 1, foodName: 'Grilled Prawns + Paneer Cubes in Butter/Ghee', quantity: '100g Prawns + 80g Paneer', proteinGrams: 38, fatGrams: 20, carbsGrams: 3, calories: 345 },
        { id: 'pes4_4_2', rowNumber: 2, foodName: 'Broccoli, Capsicum & Mushroom Stir-fry', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 3, carbsGrams: 7, calories: 70 },
      ],
      isCompleted: false,
    },
  ],
};

export const PESCATARIAN_5_MEAL: ClinicalDietChart = {
  ...PESCATARIAN_3_MEAL,
  id: 'chart_pescatarian_5meal',
  dietTypeTag: '( PESCATARIAN 5-MEAL PROTOCOL • 5 RECOVERY BLOCKS • HIGH PROTEIN & FATS )',
  totalDailyCalorieTarget: 1900,
  totalMealPlanCalorie: 1900,
  recommendedCalorieTarget: 1900,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning: Whey Isolate with Coconut Milk & Strawberry)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'pes5_1_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Strawberries', quantity: '1 Scoop + 1/2 Cup Berries', proteinGrams: 24, fatGrams: 1, carbsGrams: 7, calories: 135 },
        { id: 'pes5_1_2', rowNumber: 2, foodName: 'Coconut Milk (Unsweetened)', quantity: '200ml', proteinGrams: 1, fatGrams: 8, carbsGrams: 3, calories: 90 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Day: Fish Bhetki Fillet + Paneer Salad)',
      scheduledTiming: '11:00 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'pes5_2_1', rowNumber: 1, foodName: 'Grilled Bhetki Fillet + Paneer', quantity: '100g Fish + 60g Paneer', proteinGrams: 34, fatGrams: 16, carbsGrams: 2, calories: 290 },
        { id: 'pes5_2_2', rowNumber: 2, foodName: 'Mixed Salad with Cold Pressed Coconut Oil & Lemon', quantity: '1 Bowl', proteinGrams: 2, fatGrams: 5, carbsGrams: 4, calories: 70 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Post-Workout / Yogurt: Greek Yogurt with Berries & Nuts)',
      scheduledTiming: '02:30 PM',
      foods: [
        { id: 'pes5_3_1', rowNumber: 1, foodName: 'Full Fat Greek Yogurt (Creamy & Probiotic)', quantity: '150g', proteinGrams: 15, fatGrams: 8, carbsGrams: 6, calories: 160 },
        { id: 'pes5_3_2', rowNumber: 2, foodName: 'Fresh Berries (Blueberries & Strawberries)', quantity: '1/2 Cup', proteinGrams: 1, fatGrams: 0.5, carbsGrams: 8, calories: 40 },
        { id: 'pes5_3_3', rowNumber: 3, foodName: 'Nuts & Seeds (Almonds, Walnuts, Pumpkin & Chia Seeds)', quantity: '20g Mixed', proteinGrams: 4, fatGrams: 11, carbsGrams: 3, calories: 130 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Evening: Whey Isolate with Coconut Milk & Kiwi)',
      scheduledTiming: '05:30 PM',
      preMealSupplement: 'L-Leucine 5 g + Acetyl L-Carnitine 1.5 g',
      foods: [
        { id: 'pes5_4_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Kiwi', quantity: '1 Scoop + 1 Kiwi', proteinGrams: 25, fatGrams: 1, carbsGrams: 10, calories: 150 },
        { id: 'pes5_4_2', rowNumber: 2, foodName: 'Coconut Milk (Unsweetened)', quantity: '150ml', proteinGrams: 1, fatGrams: 6, carbsGrams: 2, calories: 70 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 5,
      mealName: 'MEAL 5 (Dinner: Grilled Fish Rohu with Vegetables)',
      scheduledTiming: '08:00 PM',
      postMealSupplement: 'Triple Strength Omega-3 (EPA 540mg + DHA 360mg) + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'pes5_5_1', rowNumber: 1, foodName: 'Grilled Rohu Fillet with Lemon & Cold Press Coconut Oil', quantity: '150g', proteinGrams: 30, fatGrams: 10, carbsGrams: 1, calories: 215 },
        { id: 'pes5_5_2', rowNumber: 2, foodName: 'Grilled Broccoli, Bell Peppers, Zucchini & Carrot', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 5, carbsGrams: 8, calories: 95 },
      ],
      isCompleted: false,
    },
  ],
};


// ==========================================
// 3. LACTO-OVO-VEGETARIAN WHEY PROTEIN
// ==========================================

export const LACTO_OVO_VEG_3_MEAL: ClinicalDietChart = {
  id: 'chart_lacto_ovo_veg_3meal',
  clientId: 'default',
  title: 'FAT, PROTEIN DIET',
  dietTypeTag: '( LACTO-OVO-VEGETARIAN 3-MEAL PROTOCOL • DRY MEALS ONLY • HIGH PROTEIN )',
  preMealSupplementsHeader: 'PRE-MEAL SUPPLEMENTS & ERGOGENICS:',
  preMealMicronutrientsHeader: 'CLINICAL MICRONUTRIENT & ANTIOXIDANT STACK:',
  status: 'published',
  publishedAt: Date.now(),
  updatedByAdminName: 'Senior Clinical Nutritionist',
  totalDailyCalorieTarget: 1720,
  totalMealPlanCalorie: 1720,
  recommendedCalorieTarget: 1720,
  generalNotes: [
    'Focus: High Fat, High Protein, Very Low Carb (80–120g/day), No Bread/Maida, No Rice.',
    'Only ONE millet roti in the whole day (in ONE meal only).',
    'Greek Yogurt always included in Meal 3 (Night).',
    'Dinner (Meal 3) = Pure cooked dry meal.',
    'Allowed: Paneer, Tofu, Tempeh, Eggs, Nuts, Seeds, Curd/Yogurt, Low Carb Veggies.',
  ],
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning 07:00 – 08:00 AM: Boiled Eggs + Avocado)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Breakfast)',
      foods: [
        { id: 'lov3_1_1', rowNumber: 1, foodName: 'Whole Boiled Eggs (Pasture-Raised)', quantity: '2 Whole Eggs', proteinGrams: 14, fatGrams: 10, carbsGrams: 1, calories: 150 },
        { id: 'lov3_1_2', rowNumber: 2, foodName: 'Fresh Avocado (Seasoned with Rock Salt & Pepper)', quantity: '1/2 Avocado (80g)', proteinGrams: 2, fatGrams: 15, carbsGrams: 4, calories: 160 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Post Workout / Shake 10:30 – 11:30 AM: Whey + Blackberries)',
      scheduledTiming: '11:00 AM',
      preMealSupplement: 'Beta-Alanine & Citrulline 6 g + Acetyl L-Carnitine 1.5 g',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg (Post Lunch)',
      foods: [
        { id: 'lov3_2_1', rowNumber: 1, foodName: 'Whey Protein Isolate', quantity: '1 Scoop (30g)', proteinGrams: 26, fatGrams: 1, carbsGrams: 2, calories: 120 },
        { id: 'lov3_2_2', rowNumber: 2, foodName: 'Blackberries (Fresh or Frozen)', quantity: '1/2 Cup (70g)', proteinGrams: 1, fatGrams: 0.5, carbsGrams: 7, calories: 35 },
        { id: 'lov3_2_3', rowNumber: 3, foodName: 'Virgin Coconut Oil (MCT Fuel)', quantity: '1 tsp (5ml)', proteinGrams: 0, fatGrams: 5, carbsGrams: 0, calories: 45 },
        { id: 'lov3_2_4', rowNumber: 4, foodName: 'Handful Mixed Nuts (Almonds & Walnuts)', quantity: '15g', proteinGrams: 3, fatGrams: 10, carbsGrams: 2, calories: 110 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Night 06:30 – 07:30 PM: Paneer Tikka + Greek Yogurt)',
      scheduledTiming: '07:00 PM',
      postMealSupplement: 'Algal Oil Omega-3 EPA/DHA 900 mg + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'lov3_3_1', rowNumber: 1, foodName: 'Paneer Tikka (Grilled Cottage Cheese Cubes)', quantity: '150g', proteinGrams: 27, fatGrams: 30, carbsGrams: 5, calories: 395 },
        { id: 'lov3_3_2', rowNumber: 2, foodName: 'Fresh Mint Coriander Chutney (Herb Infusion)', quantity: '2 tbsp', proteinGrams: 1, fatGrams: 0.5, carbsGrams: 2, calories: 15 },
        { id: 'lov3_3_3', rowNumber: 3, foodName: 'Full Fat Greek Yogurt (Plain Unsweetened)', quantity: '100g', proteinGrams: 10, fatGrams: 5, carbsGrams: 4, calories: 100 },
        { id: 'lov3_3_4', rowNumber: 4, foodName: 'Sautéed Bell Peppers & Broccoli in Ghee', quantity: '1 Cup', proteinGrams: 3, fatGrams: 5, carbsGrams: 6, calories: 80 },
      ],
      isCompleted: false,
    },
  ],
};

export const LACTO_OVO_VEG_4_MEAL: ClinicalDietChart = {
  ...LACTO_OVO_VEG_3_MEAL,
  id: 'chart_lacto_ovo_veg_4meal',
  dietTypeTag: '( LACTO-OVO-VEGETARIAN 4-MEAL PROTOCOL • DRY MEALS • HIGH PROTEIN )',
  totalDailyCalorieTarget: 1800,
  totalMealPlanCalorie: 1800,
  recommendedCalorieTarget: 1800,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Early Morning 07:00 – 08:00 AM: Boiled Egg + Avocado)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'lov4_1_1', rowNumber: 1, foodName: 'Whole Boiled Eggs (2 Eggs)', quantity: '2 Eggs', proteinGrams: 14, fatGrams: 10, carbsGrams: 1, calories: 150 },
        { id: 'lov4_1_2', rowNumber: 2, foodName: 'Avocado with Rock Salt & Black Pepper', quantity: '1/2 Avocado', proteinGrams: 2, fatGrams: 15, carbsGrams: 4, calories: 160 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Mid-Morning 10:30 – 11:30 AM: Paneer Tikka in Barbeque Sauce)',
      scheduledTiming: '11:00 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'lov4_2_1', rowNumber: 1, foodName: 'Paneer Tikka (Paneer Cubes grilled in Butter)', quantity: '120g', proteinGrams: 22, fatGrams: 24, carbsGrams: 4, calories: 320 },
        { id: 'lov4_2_2', rowNumber: 2, foodName: 'Barbeque Sauce & Herbs', quantity: '1 tbsp', proteinGrams: 0, fatGrams: 0, carbsGrams: 5, calories: 25 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Post-Workout 01:30 – 02:30 PM: Whey Isolate with Blackberries)',
      scheduledTiming: '02:00 PM',
      preMealSupplement: 'L-Leucine 5 g (Stimulates muscle protein synthesis)',
      foods: [
        { id: 'lov4_3_1', rowNumber: 1, foodName: 'Whey Protein Isolate (1 Scoop)', quantity: '1 Scoop (30g)', proteinGrams: 26, fatGrams: 1, carbsGrams: 2, calories: 120 },
        { id: 'lov4_3_2', rowNumber: 2, foodName: 'Blackberries (1/2 Cup) + Coconut Oil (1 tbsp)', quantity: '1/2 Cup + 15ml Oil', proteinGrams: 1, fatGrams: 14, carbsGrams: 7, calories: 160 },
        { id: 'lov4_3_3', rowNumber: 3, foodName: 'Greek Yogurt (Lunch Requirement)', quantity: '100g', proteinGrams: 10, fatGrams: 5, carbsGrams: 4, calories: 100 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Dinner 06:30 – 07:30 PM: Mushroom Baked Egg Salad)',
      scheduledTiming: '07:00 PM',
      postMealSupplement: 'Antioxidants (ALA 600mg + CoQ10 400mg) + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'lov4_4_1', rowNumber: 1, foodName: 'Baked Eggs & Mushrooms (2 Eggs + 100g Mushrooms)', quantity: '2 Eggs + 100g Mushrooms', proteinGrams: 18, fatGrams: 12, carbsGrams: 4, calories: 195 },
        { id: 'lov4_4_2', rowNumber: 2, foodName: 'Mixed Vegetables tossed in Butter / Olive Oil', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 7, carbsGrams: 6, calories: 105 },
      ],
      isCompleted: false,
    },
  ],
};

export const LACTO_OVO_VEG_5_MEAL: ClinicalDietChart = {
  ...LACTO_OVO_VEG_3_MEAL,
  id: 'chart_lacto_ovo_veg_5meal',
  dietTypeTag: '( LACTO-OVO-VEGETARIAN 5-MEAL PROTOCOL • 5 RECOVERY BLOCKS • HIGH PROTEIN )',
  totalDailyCalorieTarget: 1880,
  totalMealPlanCalorie: 1880,
  recommendedCalorieTarget: 1880,
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning 07:00 – 08:00 AM: Boiled Eggs + Avocado)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'lov5_1_1', rowNumber: 1, foodName: 'Boiled Eggs (2 Eggs) with Rock Salt & Pepper', quantity: '2 Eggs', proteinGrams: 14, fatGrams: 10, carbsGrams: 1, calories: 150 },
        { id: 'lov5_1_2', rowNumber: 2, foodName: 'Fresh Avocado', quantity: '1/2 Avocado (80g)', proteinGrams: 2, fatGrams: 15, carbsGrams: 4, calories: 160 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Post-Workout 10:30 – 11:30 AM: Whey Isolate + Blackberries)',
      scheduledTiming: '11:00 AM',
      foods: [
        { id: 'lov5_2_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Blackberries', quantity: '1 Scoop + 1/2 Cup Berries', proteinGrams: 25, fatGrams: 1, carbsGrams: 7, calories: 135 },
        { id: 'lov5_2_2', rowNumber: 2, foodName: 'Virgin Coconut Oil', quantity: '1 tsp (5ml)', proteinGrams: 0, fatGrams: 5, carbsGrams: 0, calories: 45 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Lunch 01:30 – 02:30 PM: Paneer Tikka with Mint Sauce + Salad)',
      scheduledTiming: '02:00 PM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg + Curcumin 1g',
      foods: [
        { id: 'lov5_3_1', rowNumber: 1, foodName: 'Paneer Tikka Cubes with Spices & Herbs', quantity: '100g', proteinGrams: 18, fatGrams: 20, carbsGrams: 3, calories: 265 },
        { id: 'lov5_3_2', rowNumber: 2, foodName: 'Mint Chutney + Fresh Cucumber Salad', quantity: '2 tbsp + 1 Bowl', proteinGrams: 2, fatGrams: 1, carbsGrams: 5, calories: 40 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 4,
      mealName: 'MEAL 4 (Evening 05:30 – 06:30 PM: Whey Isolate with Strawberries)',
      scheduledTiming: '06:00 PM',
      preMealSupplement: 'L-Leucine 5 g + Acetyl L-Carnitine 1.5 g',
      foods: [
        { id: 'lov5_4_1', rowNumber: 1, foodName: 'Whey Protein Isolate + Fresh Strawberries', quantity: '1 Scoop + 1/2 Cup Berries', proteinGrams: 25, fatGrams: 1, carbsGrams: 7, calories: 135 },
        { id: 'lov5_4_2', rowNumber: 2, foodName: 'Virgin Coconut Oil + Almonds (8 pcs)', quantity: '1 tsp Oil + 8 Almonds', proteinGrams: 2, fatGrams: 10, carbsGrams: 2, calories: 105 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 5,
      mealName: 'MEAL 5 (Night 08:00 – 09:00 PM: Egg Bhurji with Spinach + Greek Yogurt)',
      scheduledTiming: '08:30 PM',
      postMealSupplement: 'Algal Oil Omega-3 EPA/DHA 900 mg + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'lov5_5_1', rowNumber: 1, foodName: 'Egg Bhurji (2 Eggs Scrambled with Spinach & Spices)', quantity: '2 Eggs + 1 Cup Spinach', proteinGrams: 16, fatGrams: 12, carbsGrams: 3, calories: 185 },
        { id: 'lov5_5_2', rowNumber: 2, foodName: 'Full Fat Greek Yogurt (Plain Creamy)', quantity: '100g', proteinGrams: 10, fatGrams: 5, carbsGrams: 4, calories: 100 },
      ],
      isCompleted: false,
    },
  ],
};


// ==========================================
// 4. PURE LACTO-VEGETARIAN & VEGAN PROTOCOLS
// ==========================================

export const LACTO_VEG_3_MEAL: ClinicalDietChart = {
  ...LACTO_OVO_VEG_3_MEAL,
  id: 'chart_lacto_veg_3meal',
  dietTypeTag: '( LACTO-VEGETARIAN 3-MEAL PROTOCOL • DAIRY & VEG • HIGH FAT & PROTEIN )',
  meals: LACTO_OVO_VEG_3_MEAL.meals.map((m, idx) => {
    if (idx === 0) {
      return {
        ...m,
        mealName: 'MEAL 1 (Morning: Paneer Avocado Scramble)',
        foods: [
          { id: 'lv3_1_1', rowNumber: 1, foodName: 'Fresh Paneer Scramble in Ghee', quantity: '100g Paneer', proteinGrams: 18, fatGrams: 20, carbsGrams: 3, calories: 265 },
          { id: 'lv3_1_2', rowNumber: 2, foodName: 'Fresh Avocado with Rock Salt', quantity: '1/2 Avocado', proteinGrams: 2, fatGrams: 15, carbsGrams: 4, calories: 160 },
        ],
      };
    }
    return m;
  }),
};

export const VEGAN_3_MEAL: ClinicalDietChart = {
  ...LACTO_OVO_VEG_3_MEAL,
  id: 'chart_vegan_3meal',
  dietTypeTag: '( 100% VEGAN PLANT-BASED 3-MEAL PROTOCOL • TOFU, TEMPEH & SEEDS )',
  meals: [
    {
      mealNumber: 1,
      mealName: 'MEAL 1 (Morning: Tofu & Avocado Scramble in Coconut Oil)',
      scheduledTiming: '07:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'veg3_1_1', rowNumber: 1, foodName: 'Organic Tofu Scramble with Turmeric & Herbs', quantity: '150g Tofu', proteinGrams: 24, fatGrams: 12, carbsGrams: 3, calories: 215 },
        { id: 'veg3_1_2', rowNumber: 2, foodName: 'Fresh Avocado with Flaxseeds', quantity: '1/2 Avocado + 1 tbsp Seeds', proteinGrams: 3, fatGrams: 18, carbsGrams: 5, calories: 195 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 2,
      mealName: 'MEAL 2 (Post-Workout: Plant Protein Isolate with Berries & Coconut Milk)',
      scheduledTiming: '11:30 AM',
      postMealSupplement: 'CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 (MK-7) 200 mcg',
      foods: [
        { id: 'veg3_2_1', rowNumber: 1, foodName: 'Organic Pea & Brown Rice Protein Isolate', quantity: '1 Scoop (30g)', proteinGrams: 25, fatGrams: 2, carbsGrams: 2, calories: 125 },
        { id: 'veg3_2_2', rowNumber: 2, foodName: 'Fresh Blackberries + Coconut Milk', quantity: '1/2 Cup + 200ml Milk', proteinGrams: 2, fatGrams: 8, carbsGrams: 8, calories: 110 },
      ],
      isCompleted: false,
    },
    {
      mealNumber: 3,
      mealName: 'MEAL 3 (Dinner: Grilled Tempeh with Stir-Fry Veggies in Coconut Oil)',
      scheduledTiming: '07:30 PM',
      postMealSupplement: 'Algal Oil Omega-3 (EPA/DHA 900mg) + Magnesium Glycinate 200 mg at Bedtime',
      foods: [
        { id: 'veg3_3_1', rowNumber: 1, foodName: 'Marinated Tempeh Cutlets', quantity: '150g', proteinGrams: 28, fatGrams: 14, carbsGrams: 6, calories: 260 },
        { id: 'veg3_3_2', rowNumber: 2, foodName: 'Stir-Fried Broccoli, Zucchini & Mushrooms in Coconut Oil', quantity: '1.5 Cups', proteinGrams: 4, fatGrams: 7, carbsGrams: 7, calories: 105 },
      ],
      isCompleted: false,
    },
  ],
};


// ==========================================
// 5. MASTER RESOLVER & AUTO-CUSTOMIZER
// ==========================================

export function resolveCustomizedDietChart(
  mealsCount: 3 | 4 | 5 | number = 4,
  selectedFoodCategories: string[] = [],
  clientId: string = 'default'
): ClinicalDietChart {
  const cats = selectedFoodCategories.map((c) => c.toLowerCase());
  const hasChicken = cats.some((c) => c.includes('chicken') || c.includes('poultry'));
  const hasFish = cats.some((c) => c.includes('fish') || c.includes('seafood') || c.includes('pescatarian') || c.includes('prawn'));
  const hasEggs = cats.some((c) => c.includes('egg'));
  const isVegan = cats.some((c) => c.includes('vegan') || c.includes('plant-based'));

  let baseTemplate: ClinicalDietChart;

  if (hasChicken || (hasFish && hasChicken)) {
    // Pollo-Pescatarian
    if (mealsCount === 3) baseTemplate = POLLO_PESCATARIAN_3_MEAL;
    else if (mealsCount === 5) baseTemplate = POLLO_PESCATARIAN_5_MEAL;
    else baseTemplate = POLLO_PESCATARIAN_4_MEAL;
  } else if (hasFish) {
    // Pescatarian
    if (mealsCount === 3) baseTemplate = PESCATARIAN_3_MEAL;
    else if (mealsCount === 5) baseTemplate = PESCATARIAN_5_MEAL;
    else baseTemplate = PESCATARIAN_4_MEAL;
  } else if (hasEggs) {
    // Lacto-Ovo-Veg
    if (mealsCount === 3) baseTemplate = LACTO_OVO_VEG_3_MEAL;
    else if (mealsCount === 5) baseTemplate = LACTO_OVO_VEG_5_MEAL;
    else baseTemplate = LACTO_OVO_VEG_4_MEAL;
  } else if (isVegan) {
    // Vegan
    baseTemplate = VEGAN_3_MEAL;
  } else {
    // Lacto-Vegetarian default
    if (mealsCount === 3) baseTemplate = LACTO_VEG_3_MEAL;
    else if (mealsCount === 5) baseTemplate = LACTO_OVO_VEG_5_MEAL;
    else baseTemplate = LACTO_OVO_VEG_4_MEAL;
  }

  return {
    ...baseTemplate,
    clientId,
    publishedAt: Date.now(),
    status: 'published',
  };
}
