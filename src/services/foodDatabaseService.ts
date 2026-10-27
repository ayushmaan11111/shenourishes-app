/**
 * Clinical Food Database Service for She Nourishes (Phase 2)
 * Pre-populated with verified 100g baselines for everyday staples.
 */

import type { FoodItem, FoodCategory } from '../types/nutrition';

export const INITIAL_CLINICAL_FOOD_DATABASE: FoodItem[] = [
  // --- GRAINS & CEREALS ---
  {
    id: 'food_oats_rolled',
    name: 'Rolled Oats (Raw)',
    hindiName: 'Jowar / Oats',
    category: 'Grains & Cereals',
    standardServingUnit: 'g',
    standardServingWeightGrams: 50,
    per100g: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6 },
    microsPer100g: { magnesiumMg: 177, ironMg: 4.7, potassiumMg: 429 },
    dietaryTags: ['Veg', 'Vegan', 'High-Protein', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_wheat_roti',
    name: 'Whole Wheat Roti (Chapati)',
    hindiName: 'Gehun ki Roti',
    category: 'Grains & Cereals',
    standardServingUnit: 'roti',
    standardServingWeightGrams: 40,
    per100g: { calories: 297, protein: 9.6, carbs: 56.4, fat: 3.7, fiber: 9.8 },
    microsPer100g: { ironMg: 3.9, calciumMg: 34 },
    dietaryTags: ['Veg', 'Vegan', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_rice_white_cooked',
    name: 'White Basmati Rice (Cooked)',
    hindiName: 'Chawal',
    category: 'Grains & Cereals',
    standardServingUnit: 'katori',
    standardServingWeightGrams: 150,
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_rice_brown_cooked',
    name: 'Brown Rice (Cooked)',
    hindiName: 'Brown Chawal',
    category: 'Grains & Cereals',
    standardServingUnit: 'katori',
    standardServingWeightGrams: 150,
    per100g: { calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9, fiber: 1.8 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_quinoa_cooked',
    name: 'Quinoa (Cooked)',
    category: 'Grains & Cereals',
    standardServingUnit: 'cup',
    standardServingWeightGrams: 185,
    per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },

  // --- LENTILS & PULSES (DALS) ---
  {
    id: 'food_dal_moong_cooked',
    name: 'Yellow Moong Dal (Cooked, Light Tadka)',
    hindiName: 'Moong Dal',
    category: 'Lentils & Pulses (Dals)',
    standardServingUnit: 'katori',
    standardServingWeightGrams: 150,
    per100g: { calories: 105, protein: 7.2, carbs: 14.5, fat: 2.1, fiber: 4.0 },
    microsPer100g: { potassiumMg: 280, ironMg: 1.8 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_chana_boiled',
    name: 'Boiled Chickpeas (Kabuli Chana)',
    hindiName: 'Chana',
    category: 'Lentils & Pulses (Dals)',
    standardServingUnit: 'katori',
    standardServingWeightGrams: 150,
    per100g: { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'High-Protein', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_rajma_cooked',
    name: 'Rajma (Kidney Beans, Cooked)',
    hindiName: 'Rajma',
    category: 'Lentils & Pulses (Dals)',
    standardServingUnit: 'katori',
    standardServingWeightGrams: 150,
    per100g: { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },

  // --- DAIRY & PANEER ---
  {
    id: 'food_paneer_regular',
    name: 'Paneer (Cottage Cheese, Full Cream)',
    hindiName: 'Paneer',
    category: 'Dairy & Paneer',
    standardServingUnit: 'g',
    standardServingWeightGrams: 100,
    per100g: { calories: 296, protein: 18.3, carbs: 4.5, fat: 22.5, fiber: 0 },
    microsPer100g: { calciumMg: 480, sodiumMg: 22 },
    dietaryTags: ['Veg', 'Gluten-Free', 'High-Protein', 'Keto-Friendly'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_paneer_low_fat',
    name: 'Low-Fat Paneer',
    hindiName: 'Low Fat Paneer',
    category: 'Dairy & Paneer',
    standardServingUnit: 'g',
    standardServingWeightGrams: 100,
    per100g: { calories: 165, protein: 25.0, carbs: 3.5, fat: 5.5, fiber: 0 },
    microsPer100g: { calciumMg: 620 },
    dietaryTags: ['Veg', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_curd_dahi',
    name: 'Greek Yogurt / Plain Dahi (Curd)',
    hindiName: 'Dahi',
    category: 'Dairy & Paneer',
    standardServingUnit: 'katori',
    standardServingWeightGrams: 150,
    per100g: { calories: 65, protein: 5.5, carbs: 4.2, fat: 3.0, fiber: 0 },
    microsPer100g: { calciumMg: 150 },
    dietaryTags: ['Veg', 'Gluten-Free'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_tofu_firm',
    name: 'Tofu (Soya Paneer, Firm)',
    category: 'Proteins & Supplements',
    standardServingUnit: 'g',
    standardServingWeightGrams: 100,
    per100g: { calories: 83, protein: 10.0, carbs: 1.9, fat: 5.3, fiber: 1.0 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },

  // --- EGGS & POULTRY ---
  {
    id: 'food_egg_whole',
    name: 'Whole Egg (Boiled / Poached)',
    hindiName: 'Anda',
    category: 'Eggs',
    standardServingUnit: 'piece',
    standardServingWeightGrams: 50, // 1 large egg
    per100g: { calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0, fiber: 0 },
    microsPer100g: { vitaminB12Mcg: 1.1, ironMg: 1.8, sodiumMg: 124 },
    dietaryTags: ['Eggetarian', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Keto-Friendly'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_egg_white',
    name: 'Egg White (Boiled)',
    hindiName: 'Ande ki Safedi',
    category: 'Eggs',
    standardServingUnit: 'piece',
    standardServingWeightGrams: 33, // 1 egg white
    per100g: { calories: 52, protein: 11.0, carbs: 0.7, fat: 0.2, fiber: 0 },
    dietaryTags: ['Eggetarian', 'Gluten-Free', 'Dairy-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_chicken_breast_raw',
    name: 'Chicken Breast (Boneless, Skinless)',
    hindiName: 'Chicken Breast',
    category: 'Poultry & Seafood',
    standardServingUnit: 'g',
    standardServingWeightGrams: 150,
    per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0 },
    dietaryTags: ['Non-Veg', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Keto-Friendly'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },

  // --- PROTEINS & SUPPLEMENTS ---
  {
    id: 'food_whey_isolate',
    name: 'Whey Protein Isolate (Unflavored / Vanilla)',
    category: 'Proteins & Supplements',
    standardServingUnit: 'scoop',
    standardServingWeightGrams: 30,
    per100g: { calories: 370, protein: 88.0, carbs: 2.0, fat: 1.0, fiber: 0 },
    dietaryTags: ['Veg', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_soya_chunks',
    name: 'Soya Chunks (Raw)',
    hindiName: 'Nutrela / Soya Badi',
    category: 'Proteins & Supplements',
    standardServingUnit: 'g',
    standardServingWeightGrams: 40,
    per100g: { calories: 345, protein: 52.0, carbs: 33.0, fat: 0.5, fiber: 13.0 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },

  // --- NUTS & SEEDS & HEALTHY FATS ---
  {
    id: 'food_almonds',
    name: 'Raw Almonds (Badam)',
    hindiName: 'Badam',
    category: 'Nuts & Seeds',
    standardServingUnit: 'piece',
    standardServingWeightGrams: 1.2, // ~10 almonds = 12g
    per100g: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'Keto-Friendly'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_chia_seeds',
    name: 'Chia Seeds (Raw)',
    category: 'Nuts & Seeds',
    standardServingUnit: 'tbsp',
    standardServingWeightGrams: 15,
    per100g: { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'High-Protein'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_desi_ghee',
    name: 'Desi Cow Ghee (Clarified Butter)',
    hindiName: 'Shuddh Desi Ghee',
    category: 'Fats & Healthy Oils',
    standardServingUnit: 'tsp',
    standardServingWeightGrams: 5,
    per100g: { calories: 900, protein: 0, carbs: 0, fat: 100.0, fiber: 0 },
    dietaryTags: ['Veg', 'Gluten-Free', 'Keto-Friendly'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },

  // --- FRUITS & VEGETABLES ---
  {
    id: 'food_banana_raw',
    name: 'Banana (Medium)',
    hindiName: 'Kela',
    category: 'Fruits',
    standardServingUnit: 'piece',
    standardServingWeightGrams: 118,
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
    microsPer100g: { potassiumMg: 358 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_apple_raw',
    name: 'Apple (with skin)',
    hindiName: 'Seb',
    category: 'Fruits',
    standardServingUnit: 'piece',
    standardServingWeightGrams: 150,
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_spinach_palak',
    name: 'Fresh Spinach (Palak)',
    hindiName: 'Palak',
    category: 'Vegetables & Greens',
    standardServingUnit: 'cup',
    standardServingWeightGrams: 100,
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    microsPer100g: { ironMg: 2.7, calciumMg: 99 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
  {
    id: 'food_cucumber_kheera',
    name: 'Cucumber (Kheera / Salad)',
    hindiName: 'Kheera',
    category: 'Vegetables & Greens',
    standardServingUnit: 'piece',
    standardServingWeightGrams: 150,
    per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
    dietaryTags: ['Veg', 'Vegan', 'Gluten-Free', 'Low-GI'],
    isVerifiedClinical: true,
    source: 'She Nourishes Clinical DB',
  },
];

const LOCAL_FOODS_KEY = 'she_nourishes_foods_cache';

/**
 * Retrieves all food items (combines clinical catalog with user-defined customs).
 */
export function getAllFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_FOODS_KEY);
    if (!raw) return INITIAL_CLINICAL_FOOD_DATABASE;
    const customs = JSON.parse(raw) as FoodItem[];
    return [...INITIAL_CLINICAL_FOOD_DATABASE, ...customs];
  } catch {
    return INITIAL_CLINICAL_FOOD_DATABASE;
  }
}

/**
 * Searches food items by text query and optional category filter.
 */
export function searchFoodDatabase(query: string, category?: FoodCategory): FoodItem[] {
  const all = getAllFoods();
  const cleanQ = query.trim().toLowerCase();

  return all.filter((food) => {
    const matchesCategory = !category || food.category === category;
    if (!matchesCategory) return false;

    if (!cleanQ) return true;

    const nameMatch = food.name.toLowerCase().includes(cleanQ);
    const hindiMatch = food.hindiName?.toLowerCase().includes(cleanQ);
    const tagMatch = food.dietaryTags.some((t) => t.toLowerCase().includes(cleanQ));
    return nameMatch || hindiMatch || tagMatch;
  });
}

/**
 * Retrieves a single food item by its ID.
 */
export function getFoodById(id: string): FoodItem | undefined {
  const all = getAllFoods();
  return all.find((f) => f.id === id);
}

/**
 * Saves a new custom food item to the local database store.
 */
export function addCustomFoodItem(food: Omit<FoodItem, 'id' | 'isVerifiedClinical' | 'source'>): FoodItem {
  const newFood: FoodItem = {
    ...food,
    id: 'custom_food_' + Math.random().toString(36).substring(2, 9),
    isVerifiedClinical: false,
    source: 'Custom User Food',
    createdAt: Date.now(),
  };

  try {
    const raw = localStorage.getItem(LOCAL_FOODS_KEY);
    const customs = raw ? JSON.parse(raw) : [];
    customs.push(newFood);
    localStorage.setItem(LOCAL_FOODS_KEY, JSON.stringify(customs));
  } catch (e) {
    console.warn('Failed saving custom food:', e);
  }

  return newFood;
}
