/**
 * Comprehensive Indian Food, Macronutrient & Calorie Catalog
 * Extracted directly from the verified 180+ Indian Veg & Non-Veg Nutritional Media
 * Formula Used: Total Energy (kcal) = (Carbs × 4) + (Protein × 4) + (Fat × 9)
 */

export interface IndianFoodItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  dietType: 'Veg' | 'Non-Veg';
  servingSize: string;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  calories: number;
  proteinType?: 'First Class (Complete)' | 'Second Class (Plant-Based)';
  highlights?: string;
}

export const INDIAN_FOOD_CATALOG: IndianFoodItem[] = [
  // ==========================================
  // 1. 30 INDIAN VEG BREAKFAST OPTIONS
  // ==========================================
  { id: 'veg_bf_1', name: 'Poha', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 45, proteinGrams: 8, fatGrams: 12, calories: 320 },
  { id: 'veg_bf_2', name: 'Upma', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 36, proteinGrams: 7, fatGrams: 10, calories: 262 },
  { id: 'veg_bf_3', name: 'Idli + Sambar', category: 'Breakfast', dietType: 'Veg', servingSize: '2 idli + 1 bowl sambar', carbsGrams: 41, proteinGrams: 11, fatGrams: 2, calories: 226 },
  { id: 'veg_bf_4', name: 'Dosa', category: 'Breakfast', dietType: 'Veg', servingSize: '1 dosa', carbsGrams: 42, proteinGrams: 9, fatGrams: 10, calories: 294 },
  { id: 'veg_bf_5', name: 'Masala Dosa', category: 'Breakfast', dietType: 'Veg', servingSize: '1 dosa', carbsGrams: 50, proteinGrams: 8, fatGrams: 14, calories: 358 },
  { id: 'veg_bf_6', name: 'Rava Dosa', category: 'Breakfast', dietType: 'Veg', servingSize: '1 dosa', carbsGrams: 43, proteinGrams: 7, fatGrams: 10, calories: 290 },
  { id: 'veg_bf_7', name: 'Uttapam', category: 'Breakfast', dietType: 'Veg', servingSize: '1 medium', carbsGrams: 38, proteinGrams: 8, fatGrams: 6, calories: 238 },
  { id: 'veg_bf_8', name: 'Pongal', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 40, proteinGrams: 8, fatGrams: 8, calories: 264 },
  { id: 'veg_bf_9', name: 'Medu Vada', category: 'Breakfast', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 30, proteinGrams: 10, fatGrams: 13, calories: 277 },
  { id: 'veg_bf_10', name: 'Pesarattu', category: 'Breakfast', dietType: 'Veg', servingSize: '1 dosa', carbsGrams: 31, proteinGrams: 13, fatGrams: 5, calories: 221 },
  { id: 'veg_bf_11', name: 'Idiyappam', category: 'Breakfast', dietType: 'Veg', servingSize: '2 nests', carbsGrams: 34, proteinGrams: 4, fatGrams: 2, calories: 170 },
  { id: 'veg_bf_12', name: 'Appam', category: 'Breakfast', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 30, proteinGrams: 6, fatGrams: 4, calories: 180 },
  { id: 'veg_bf_13', name: 'Chole Kulche', category: 'Breakfast', dietType: 'Veg', servingSize: '1 kulcha + 1/2 cup chole', carbsGrams: 58, proteinGrams: 13, fatGrams: 16, calories: 428 },
  { id: 'veg_bf_14', name: 'Aloo Paratha', category: 'Breakfast', dietType: 'Veg', servingSize: '1 paratha', carbsGrams: 46, proteinGrams: 9, fatGrams: 14, calories: 346 },
  { id: 'veg_bf_15', name: 'Paneer Paratha', category: 'Breakfast', dietType: 'Veg', servingSize: '1 paratha', carbsGrams: 42, proteinGrams: 14, fatGrams: 15, calories: 359 },
  { id: 'veg_bf_16', name: 'Besan Cheela', category: 'Breakfast', dietType: 'Veg', servingSize: '2 cheela', carbsGrams: 35, proteinGrams: 11, fatGrams: 6, calories: 238 },
  { id: 'veg_bf_17', name: 'Moong Dal Cheela', category: 'Breakfast', dietType: 'Veg', servingSize: '2 cheela', carbsGrams: 28, proteinGrams: 13, fatGrams: 5, calories: 209 },
  { id: 'veg_bf_18', name: 'Veg Sandwich', category: 'Breakfast', dietType: 'Veg', servingSize: '1 sandwich', carbsGrams: 39, proteinGrams: 9, fatGrams: 6, calories: 246 },
  { id: 'veg_bf_19', name: 'Dhokla', category: 'Breakfast', dietType: 'Veg', servingSize: '3 pcs', carbsGrams: 30, proteinGrams: 6, fatGrams: 8, calories: 216 },
  { id: 'veg_bf_20', name: 'Khandvi', category: 'Breakfast', dietType: 'Veg', servingSize: '5 pcs', carbsGrams: 28, proteinGrams: 5, fatGrams: 5, calories: 177 },
  { id: 'veg_bf_21', name: 'Handvo', category: 'Breakfast', dietType: 'Veg', servingSize: '1 slice', carbsGrams: 37, proteinGrams: 10, fatGrams: 11, calories: 287 },
  { id: 'veg_bf_22', name: 'Sabudana Khichdi', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 45, proteinGrams: 4, fatGrams: 12, calories: 304 },
  { id: 'veg_bf_23', name: 'Thalipeeth', category: 'Breakfast', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 40, proteinGrams: 9, fatGrams: 7, calories: 259 },
  { id: 'veg_bf_24', name: 'Misal Pav', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl + 1 pav', carbsGrams: 36, proteinGrams: 13, fatGrams: 10, calories: 286 },
  { id: 'veg_bf_25', name: 'Ragi Dosa', category: 'Breakfast', dietType: 'Veg', servingSize: '1 dosa', carbsGrams: 36, proteinGrams: 7, fatGrams: 6, calories: 226 },
  { id: 'veg_bf_26', name: 'Oats Upma', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 38, proteinGrams: 9, fatGrams: 8, calories: 260 },
  { id: 'veg_bf_27', name: 'Tofu Bhurji', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 15, proteinGrams: 12, fatGrams: 6, calories: 162 },
  { id: 'veg_bf_28', name: 'Poha with Sprouts', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 41, proteinGrams: 11, fatGrams: 7, calories: 271 },
  { id: 'veg_bf_29', name: 'Methi Thepla', category: 'Breakfast', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 36, proteinGrams: 7, fatGrams: 8, calories: 244 },
  { id: 'veg_bf_30', name: 'Fruit & Nut Bowl', category: 'Breakfast', dietType: 'Veg', servingSize: '1 bowl', carbsGrams: 26, proteinGrams: 5, fatGrams: 8, calories: 196 },

  // ==========================================
  // 2. 30 INDIAN NON-VEG BREAKFAST OPTIONS
  // ==========================================
  { id: 'nv_bf_1', name: 'Anda Bhurji + Pav', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 eggs + 1 pav', carbsGrams: 32, proteinGrams: 18, fatGrams: 22, calories: 398 },
  { id: 'nv_bf_2', name: 'Masala Omelette + Toast', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 eggs + 2 toast', carbsGrams: 28, proteinGrams: 20, fatGrams: 18, calories: 354 },
  { id: 'nv_bf_3', name: 'Boiled Eggs (2) + Fruit', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 eggs + 1 fruit', carbsGrams: 15, proteinGrams: 13, fatGrams: 10, calories: 202 },
  { id: 'nv_bf_4', name: 'Egg White Omelette + Millet Toast', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '3 whites + 1 toast', carbsGrams: 20, proteinGrams: 22, fatGrams: 8, calories: 240 },
  { id: 'nv_bf_5', name: 'Chicken Keema + Paratha', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '100g keema + 1 paratha', carbsGrams: 36, proteinGrams: 22, fatGrams: 24, calories: 448 },
  { id: 'nv_bf_6', name: 'Egg Bhurji + Roti', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 eggs + 2 roti', carbsGrams: 28, proteinGrams: 18, fatGrams: 16, calories: 328 },
  { id: 'nv_bf_7', name: 'Chicken Sausage + Scrambled Eggs', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 sausage + 2 eggs', carbsGrams: 18, proteinGrams: 20, fatGrams: 20, calories: 332 },
  { id: 'nv_bf_8', name: 'Egg & Chicken Roll', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 roll', carbsGrams: 30, proteinGrams: 22, fatGrams: 16, calories: 352 },
  { id: 'nv_bf_9', name: 'Fish Poha', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 40, proteinGrams: 20, fatGrams: 12, calories: 348 },
  { id: 'nv_bf_10', name: 'Anda Paratha', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 paratha', carbsGrams: 36, proteinGrams: 18, fatGrams: 20, calories: 396 },
  { id: 'nv_bf_11', name: 'Prawn Upma', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 34, proteinGrams: 22, fatGrams: 14, calories: 350 },
  { id: 'nv_bf_12', name: 'Egg Podi Idli', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 idlis + 1 egg', carbsGrams: 32, proteinGrams: 16, fatGrams: 10, calories: 282 },
  { id: 'nv_bf_13', name: 'Chicken Kheema Pav', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl + 1 pav', carbsGrams: 34, proteinGrams: 20, fatGrams: 24, calories: 432 },
  { id: 'nv_bf_14', name: 'Mutton Keema + Roti', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl + 2 roti', carbsGrams: 28, proteinGrams: 22, fatGrams: 22, calories: 398 },
  { id: 'nv_bf_15', name: 'Egg Dosa', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 dosa', carbsGrams: 34, proteinGrams: 18, fatGrams: 14, calories: 334 },
  { id: 'nv_bf_16', name: 'Chicken Salami + Bread', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '3 slices + 2 bread', carbsGrams: 24, proteinGrams: 18, fatGrams: 16, calories: 312 },
  { id: 'nv_bf_17', name: 'Egg Muffins', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 pcs', carbsGrams: 12, proteinGrams: 16, fatGrams: 12, calories: 220 },
  { id: 'nv_bf_18', name: 'Fish Cutlet + Chutney', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 cutlets', carbsGrams: 24, proteinGrams: 18, fatGrams: 16, calories: 312 },
  { id: 'nv_bf_19', name: 'Egg & Cheese Sandwich', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 sandwich', carbsGrams: 28, proteinGrams: 18, fatGrams: 18, calories: 346 },
  { id: 'nv_bf_20', name: 'Prawn Thalipeeth', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 pc', carbsGrams: 30, proteinGrams: 20, fatGrams: 14, calories: 306 },
  { id: 'nv_bf_21', name: 'Anda Maggi', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 36, proteinGrams: 18, fatGrams: 14, calories: 342 },
  { id: 'nv_bf_22', name: 'Chicken Oats Porridge', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 28, proteinGrams: 20, fatGrams: 12, calories: 300 },
  { id: 'nv_bf_23', name: 'Egg & Veg Paratha', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 paratha', carbsGrams: 34, proteinGrams: 18, fatGrams: 16, calories: 352 },
  { id: 'nv_bf_24', name: 'Tuna Sandwich', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 sandwich', carbsGrams: 28, proteinGrams: 20, fatGrams: 14, calories: 318 },
  { id: 'nv_bf_25', name: 'Boiled Eggs with Peanut Chutney', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 eggs + 2 tbsp chutney', carbsGrams: 10, proteinGrams: 13, fatGrams: 10, calories: 182 },
  { id: 'nv_bf_26', name: 'Chicken Dalia', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 30, proteinGrams: 20, fatGrams: 12, calories: 308 },
  { id: 'nv_bf_27', name: 'Egg Hakka Noodles', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 42, proteinGrams: 18, fatGrams: 16, calories: 384 },
  { id: 'nv_bf_28', name: 'Egg Puffs', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '2 pcs', carbsGrams: 24, proteinGrams: 16, fatGrams: 20, calories: 340 },
  { id: 'nv_bf_29', name: 'Mutton Paya Soup + Bread', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl + 1 slice', carbsGrams: 18, proteinGrams: 20, fatGrams: 14, calories: 278 },
  { id: 'nv_bf_30', name: 'Egg Biryani (Small Bowl)', category: 'Breakfast', dietType: 'Non-Veg', servingSize: '1 bowl', carbsGrams: 44, proteinGrams: 16, fatGrams: 14, calories: 366 },

  // ==========================================
  // 3. 30 INDIAN LUNCH OPTIONS (VEG & NON-VEG)
  // ==========================================
  { id: 'lunch_1', name: 'Dal Tadka + Jeera Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl dal + 1 cup rice', carbsGrams: 74, proteinGrams: 18, fatGrams: 12, calories: 476 },
  { id: 'lunch_2', name: 'Rajma + Brown Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl rajma + 1 cup rice', carbsGrams: 76, proteinGrams: 18, fatGrams: 12, calories: 484 },
  { id: 'lunch_3', name: 'Chole + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl chole + 1 cup rice', carbsGrams: 72, proteinGrams: 16, fatGrams: 10, calories: 442 },
  { id: 'lunch_4', name: 'Palak Paneer + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 62, proteinGrams: 20, fatGrams: 16, calories: 472 },
  { id: 'lunch_5', name: 'Kadhi + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl kadhi + 1 cup rice', carbsGrams: 68, proteinGrams: 14, fatGrams: 12, calories: 436 },
  { id: 'lunch_6', name: 'Veg Pulao + Raita', category: 'Lunch', dietType: 'Veg', servingSize: '1 plate pulao + 1/2 cup raita', carbsGrams: 80, proteinGrams: 14, fatGrams: 10, calories: 466 },
  { id: 'lunch_7', name: 'Sambar + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl sambar + 1 cup rice', carbsGrams: 70, proteinGrams: 12, fatGrams: 8, calories: 400 },
  { id: 'lunch_8', name: 'Mix Veg + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl sabzi + 2 rotis', carbsGrams: 56, proteinGrams: 10, fatGrams: 8, calories: 336 },
  { id: 'lunch_9', name: 'Matar Paneer + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 64, proteinGrams: 18, fatGrams: 14, calories: 454 },
  { id: 'lunch_10', name: 'Masoor Dal + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl dal + 1 cup rice', carbsGrams: 66, proteinGrams: 18, fatGrams: 10, calories: 426 },
  { id: 'lunch_11', name: 'Baingan Bharta + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 52, proteinGrams: 10, fatGrams: 12, calories: 356 },
  { id: 'lunch_12', name: 'Aloo Gobi + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 54, proteinGrams: 10, fatGrams: 10, calories: 346 },
  { id: 'lunch_13', name: 'Chicken Curry + Rice', category: 'Lunch', dietType: 'Non-Veg', servingSize: '150g chicken + 1 cup rice', carbsGrams: 70, proteinGrams: 28, fatGrams: 16, calories: 536 },
  { id: 'lunch_14', name: 'Egg Curry + Roti (2)', category: 'Lunch', dietType: 'Non-Veg', servingSize: '2 eggs + 2 rotis', carbsGrams: 50, proteinGrams: 20, fatGrams: 14, calories: 406 },
  { id: 'lunch_15', name: 'Vegetable Biryani + Raita', category: 'Lunch', dietType: 'Veg', servingSize: '1 plate + raita', carbsGrams: 84, proteinGrams: 16, fatGrams: 12, calories: 508 },
  { id: 'lunch_16', name: 'Moong Dal + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl dal + 1 cup rice', carbsGrams: 64, proteinGrams: 16, fatGrams: 8, calories: 392 },
  { id: 'lunch_17', name: 'Fish Curry + Rice', category: 'Lunch', dietType: 'Non-Veg', servingSize: '150g fish + 1 cup rice', carbsGrams: 68, proteinGrams: 24, fatGrams: 14, calories: 494 },
  { id: 'lunch_18', name: 'Stuffed Paratha + Curd', category: 'Lunch', dietType: 'Veg', servingSize: '1 paratha + 1/2 cup curd', carbsGrams: 64, proteinGrams: 14, fatGrams: 16, calories: 456 },
  { id: 'lunch_19', name: 'Bharwa Karela + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 50, proteinGrams: 10, fatGrams: 12, calories: 348 },
  { id: 'lunch_20', name: 'Soyabean Curry + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 1 cup rice', carbsGrams: 68, proteinGrams: 20, fatGrams: 10, calories: 442 },
  { id: 'lunch_21', name: 'Prawn Curry + Rice', category: 'Lunch', dietType: 'Non-Veg', servingSize: '150g prawns + 1 cup rice', carbsGrams: 66, proteinGrams: 28, fatGrams: 14, calories: 502 },
  { id: 'lunch_22', name: 'Dal Makhani + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl dal + 1 cup rice', carbsGrams: 72, proteinGrams: 16, fatGrams: 16, calories: 496 },
  { id: 'lunch_23', name: 'Gatte ki Sabzi + Roti (2)', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 58, proteinGrams: 14, fatGrams: 12, calories: 396 },
  { id: 'lunch_24', name: 'Mutton Curry + Rice', category: 'Lunch', dietType: 'Non-Veg', servingSize: '150g mutton + 1 cup rice', carbsGrams: 70, proteinGrams: 30, fatGrams: 18, calories: 562 },
  { id: 'lunch_25', name: 'Palak Dal + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl dal + 1 cup rice', carbsGrams: 64, proteinGrams: 16, fatGrams: 10, calories: 410 },
  { id: 'lunch_26', name: 'Chana Dal + Rice', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl dal + 1 cup rice', carbsGrams: 66, proteinGrams: 18, fatGrams: 10, calories: 426 },
  { id: 'lunch_27', name: 'Dhokla + Kadhi', category: 'Lunch', dietType: 'Veg', servingSize: '3 pcs + 1 bowl kadhi', carbsGrams: 56, proteinGrams: 12, fatGrams: 10, calories: 362 },
  { id: 'lunch_28', name: 'Chicken Biryani + Raita', category: 'Lunch', dietType: 'Non-Veg', servingSize: '1 plate + raita', carbsGrams: 84, proteinGrams: 26, fatGrams: 14, calories: 566 },
  { id: 'lunch_29', name: 'Vegetable Khichdi + Curd', category: 'Lunch', dietType: 'Veg', servingSize: '1 bowl + 1/2 cup curd', carbsGrams: 64, proteinGrams: 12, fatGrams: 8, calories: 376 },
  { id: 'lunch_30', name: 'Egg Biryani + Raita', category: 'Lunch', dietType: 'Non-Veg', servingSize: '1 plate + raita', carbsGrams: 76, proteinGrams: 20, fatGrams: 12, calories: 492 },

  // ==========================================
  // 4. 30 INDIAN SNACKS OPTIONS
  // ==========================================
  { id: 'snack_1', name: 'Samosa', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 40, proteinGrams: 6, fatGrams: 16, calories: 310 },
  { id: 'snack_2', name: 'Kachori', category: 'Snacks', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 45, proteinGrams: 8, fatGrams: 20, calories: 370 },
  { id: 'snack_3', name: 'Aloo Tikki', category: 'Snacks', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 30, proteinGrams: 4, fatGrams: 10, calories: 220 },
  { id: 'snack_4', name: 'Poha (Snack Cup)', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 36, proteinGrams: 6, fatGrams: 10, calories: 250 },
  { id: 'snack_5', name: 'Dhokla', category: 'Snacks', dietType: 'Veg', servingSize: '4 pcs', carbsGrams: 28, proteinGrams: 6, fatGrams: 6, calories: 180 },
  { id: 'snack_6', name: 'Veg Cutlet', category: 'Snacks', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 28, proteinGrams: 6, fatGrams: 8, calories: 190 },
  { id: 'snack_7', name: 'Paneer Pakora', category: 'Snacks', dietType: 'Veg', servingSize: '4 pcs', carbsGrams: 18, proteinGrams: 8, fatGrams: 12, calories: 200 },
  { id: 'snack_8', name: 'Moong Dal Chilla', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 24, proteinGrams: 8, fatGrams: 6, calories: 180 },
  { id: 'snack_9', name: 'Makhana (Roasted)', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 20, proteinGrams: 4, fatGrams: 6, calories: 150 },
  { id: 'snack_10', name: 'Masala Corn', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 28, proteinGrams: 6, fatGrams: 6, calories: 190 },
  { id: 'snack_11', name: 'Sprouts Bhel', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 24, proteinGrams: 8, fatGrams: 4, calories: 160 },
  { id: 'snack_12', name: 'Sabudana Vada', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 30, proteinGrams: 4, fatGrams: 10, calories: 220 },
  { id: 'snack_13', name: 'Dahi Vada', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 22, proteinGrams: 6, fatGrams: 8, calories: 180 },
  { id: 'snack_14', name: 'Bhel Puri', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 32, proteinGrams: 5, fatGrams: 6, calories: 210 },
  { id: 'snack_15', name: 'Pani Puri', category: 'Snacks', dietType: 'Veg', servingSize: '6 pcs', carbsGrams: 32, proteinGrams: 4, fatGrams: 4, calories: 180 },
  { id: 'snack_16', name: 'Ragda Pattice', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 36, proteinGrams: 6, fatGrams: 8, calories: 250 },
  { id: 'snack_17', name: 'Mini Uttapam', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 24, proteinGrams: 6, fatGrams: 6, calories: 170 },
  { id: 'snack_18', name: 'Corn Chaat', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 26, proteinGrams: 5, fatGrams: 5, calories: 190 },
  { id: 'snack_19', name: 'Vegetable Dosa', category: 'Snacks', dietType: 'Veg', servingSize: '1 pc', carbsGrams: 30, proteinGrams: 6, fatGrams: 6, calories: 210 },
  { id: 'snack_20', name: 'Medu Vada (Snack)', category: 'Snacks', dietType: 'Veg', servingSize: '2 pcs', carbsGrams: 22, proteinGrams: 6, fatGrams: 8, calories: 180 },
  { id: 'snack_21', name: 'Onion Pakora', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 22, proteinGrams: 4, fatGrams: 10, calories: 200 },
  { id: 'snack_22', name: 'Palak Pakora', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 20, proteinGrams: 4, fatGrams: 10, calories: 190 },
  { id: 'snack_23', name: 'Cheese Corn Balls', category: 'Snacks', dietType: 'Veg', servingSize: '4 pcs', carbsGrams: 20, proteinGrams: 6, fatGrams: 10, calories: 200 },
  { id: 'snack_24', name: 'Masala Peanut', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 10, proteinGrams: 10, fatGrams: 12, calories: 190 },
  { id: 'snack_25', name: 'Roasted Chana', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 28, proteinGrams: 12, fatGrams: 6, calories: 200 },
  { id: 'snack_26', name: 'Muthiya (Steamed)', category: 'Snacks', dietType: 'Veg', servingSize: '4 pcs', carbsGrams: 24, proteinGrams: 6, fatGrams: 4, calories: 150 },
  { id: 'snack_27', name: 'Khaman', category: 'Snacks', dietType: 'Veg', servingSize: '1 cup', carbsGrams: 24, proteinGrams: 6, fatGrams: 5, calories: 160 },
  { id: 'snack_28', name: 'Sattu Drink', category: 'Snacks', dietType: 'Veg', servingSize: '1 glass', carbsGrams: 20, proteinGrams: 6, fatGrams: 4, calories: 140 },
  { id: 'snack_29', name: 'Chicken Burger', category: 'Snacks', dietType: 'Non-Veg', servingSize: '1 pc', carbsGrams: 40, proteinGrams: 18, fatGrams: 16, calories: 410 },
  { id: 'snack_30', name: 'Chicken Burger Samosa', category: 'Snacks', dietType: 'Non-Veg', servingSize: '2 pcs', carbsGrams: 38, proteinGrams: 16, fatGrams: 16, calories: 420 },

  // ==========================================
  // 5. 30 INDIAN DINNER OPTIONS (VEG & NON-VEG)
  // ==========================================
  { id: 'din_1', name: 'Palak Paneer + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 40, proteinGrams: 16, fatGrams: 14, calories: 350 },
  { id: 'din_2', name: 'Mix Veg + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 42, proteinGrams: 10, fatGrams: 12, calories: 316 },
  { id: 'din_3', name: 'Dal Tadka + Jeera Rice', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 1 cup rice', carbsGrams: 58, proteinGrams: 16, fatGrams: 10, calories: 386 },
  { id: 'din_4', name: 'Paneer Bhurji + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '100g paneer + 2 rotis', carbsGrams: 28, proteinGrams: 18, fatGrams: 14, calories: 310 },
  { id: 'din_5', name: 'Kadhi + Rice', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 1 cup rice', carbsGrams: 52, proteinGrams: 12, fatGrams: 10, calories: 346 },
  { id: 'din_6', name: 'Chana Masala + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 48, proteinGrams: 14, fatGrams: 12, calories: 356 },
  { id: 'din_7', name: 'Baingan Bharta + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 38, proteinGrams: 8, fatGrams: 10, calories: 274 },
  { id: 'din_8', name: 'Lauki Chana Dal + Rice', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 1 cup rice', carbsGrams: 54, proteinGrams: 14, fatGrams: 8, calories: 344 },
  { id: 'din_9', name: 'Moong Dal + Rice', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 1 cup rice', carbsGrams: 50, proteinGrams: 16, fatGrams: 6, calories: 318 },
  { id: 'din_10', name: 'Veg Pulao + Raita', category: 'Dinner', dietType: 'Veg', servingSize: '1 plate + raita', carbsGrams: 64, proteinGrams: 10, fatGrams: 10, calories: 386 },
  { id: 'din_11', name: 'Matar Paneer + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 32, proteinGrams: 16, fatGrams: 14, calories: 318 },
  { id: 'din_12', name: 'Veg Kofta Curry + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 38, proteinGrams: 12, fatGrams: 12, calories: 308 },
  { id: 'din_13', name: 'Tofu Stir Fry + Brown Rice', category: 'Dinner', dietType: 'Veg', servingSize: '100g tofu + 1 cup rice', carbsGrams: 46, proteinGrams: 16, fatGrams: 8, calories: 320 },
  { id: 'din_14', name: 'Mushroom Masala + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 rotis', carbsGrams: 26, proteinGrams: 10, fatGrams: 10, calories: 234 },
  { id: 'din_15', name: 'Stuffed Capsicum + Roti', category: 'Dinner', dietType: 'Veg', servingSize: '2 capsicums + 2 rotis', carbsGrams: 30, proteinGrams: 10, fatGrams: 8, calories: 232 },
  { id: 'din_16', name: 'Masoor Dal + Rice', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 1 cup rice', carbsGrams: 48, proteinGrams: 15, fatGrams: 6, calories: 306 },
  { id: 'din_17', name: 'Vegetable Stew + Appam', category: 'Dinner', dietType: 'Veg', servingSize: '1 bowl + 2 appams', carbsGrams: 42, proteinGrams: 10, fatGrams: 8, calories: 280 },
  { id: 'din_18', name: 'Dhokla + Green Chutney (Light)', category: 'Dinner', dietType: 'Veg', servingSize: '4 pcs', carbsGrams: 30, proteinGrams: 8, fatGrams: 6, calories: 206 },
  { id: 'din_19', name: 'Chicken Curry + Rice', category: 'Dinner', dietType: 'Non-Veg', servingSize: '150g chicken + 1 cup rice', carbsGrams: 92, proteinGrams: 28, fatGrams: 18, calories: 642 },
  { id: 'din_20', name: 'Chicken Biryani + Raita', category: 'Dinner', dietType: 'Non-Veg', servingSize: '1 plate + raita', carbsGrams: 110, proteinGrams: 28, fatGrams: 18, calories: 714 },
  { id: 'din_21', name: 'Egg Curry + Rice', category: 'Dinner', dietType: 'Non-Veg', servingSize: '2 eggs + 1 cup rice', carbsGrams: 90, proteinGrams: 22, fatGrams: 16, calories: 592 },
  { id: 'din_22', name: 'Mutton Curry + Rice', category: 'Dinner', dietType: 'Non-Veg', servingSize: '150g mutton + 1 cup rice', carbsGrams: 92, proteinGrams: 30, fatGrams: 20, calories: 668 },
  { id: 'din_23', name: 'Fish Curry + Rice', category: 'Dinner', dietType: 'Non-Veg', servingSize: '150g fish + 1 cup rice', carbsGrams: 90, proteinGrams: 24, fatGrams: 14, calories: 582 },
  { id: 'din_24', name: 'Prawn Curry + Rice', category: 'Dinner', dietType: 'Non-Veg', servingSize: '150g prawns + 1 cup rice', carbsGrams: 90, proteinGrams: 24, fatGrams: 16, calories: 600 },
  { id: 'din_25', name: 'Chicken Handi + Naan', category: 'Dinner', dietType: 'Non-Veg', servingSize: '150g chicken + 1 naan', carbsGrams: 88, proteinGrams: 26, fatGrams: 18, calories: 618 },
  { id: 'din_26', name: 'Keema Peas + Roti (2)', category: 'Dinner', dietType: 'Non-Veg', servingSize: '100g keema + 2 rotis', carbsGrams: 80, proteinGrams: 24, fatGrams: 16, calories: 560 },
  { id: 'din_27', name: 'Egg Bhurji + Paratha (2)', category: 'Dinner', dietType: 'Non-Veg', servingSize: '2 eggs + 2 parathas', carbsGrams: 78, proteinGrams: 22, fatGrams: 16, calories: 544 },
  { id: 'din_28', name: 'Tandoori Chicken + Naan', category: 'Dinner', dietType: 'Non-Veg', servingSize: '200g chicken + 1 naan', carbsGrams: 86, proteinGrams: 28, fatGrams: 14, calories: 582 },
  { id: 'din_29', name: 'Chicken Korma + Rice', category: 'Dinner', dietType: 'Non-Veg', servingSize: '150g chicken + 1 cup rice', carbsGrams: 92, proteinGrams: 26, fatGrams: 18, calories: 634 },
  { id: 'din_30', name: 'Fish Biryani + Raita', category: 'Dinner', dietType: 'Non-Veg', servingSize: '1 plate + raita', carbsGrams: 108, proteinGrams: 24, fatGrams: 16, calories: 672 },
];

/**
 * Filter Indian foods by search query, meal category, and diet preference.
 */
export function searchIndianFoods(options: {
  query?: string;
  category?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  dietType?: 'Veg' | 'Non-Veg';
}): IndianFoodItem[] {
  return INDIAN_FOOD_CATALOG.filter((item) => {
    if (options.category && item.category !== options.category) return false;
    if (options.dietType && item.dietType !== options.dietType) return false;
    if (options.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      return item.name.toLowerCase().includes(q) || item.servingSize.toLowerCase().includes(q);
    }
    return true;
  });
}
