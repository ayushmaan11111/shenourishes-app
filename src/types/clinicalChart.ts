/**
 * Clinical Diet Chart Data Models (Phase 2 Clinical System)
 * Faithfully matches the exact clinical sheet structure from /Sedentary media templates.
 */

export interface ClinicalFoodRow {
  id: string;
  rowNumber: number;
  foodName: string;
  quantity: string;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
  calories: number;
}

export interface ClinicalMealBlock {
  mealNumber: number;
  mealName: string; // e.g. "MEAL 1", "MEAL 2", "MEAL 3", "MEAL 4"
  scheduledTiming?: string; // e.g. "08:00 AM"
  preMealSupplement?: string; // e.g. "Acetyl L-Carnitine 2 g" or "30 minutes before – Take 2 gram Probiotic (Best Brand: VSL#3)"
  postMealSupplement?: string; // e.g. "CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 MK7 + VITAMIN D3"
  foods: ClinicalFoodRow[];
  isCompleted?: boolean;
  completedAt?: number;
}

export interface ClinicalDietChart {
  id: string;
  clientId: string;
  title: string; // e.g. "HIGH PROTEIN, MODERATE FAT DIET"
  dietTypeTag: string; // e.g. "( ADDED OF LACTO-OVO-POLLO-VEG )" or "( VEGETARIAN )"
  preMealSupplementsHeader?: string;
  preMealMicronutrientsHeader?: string;
  meals: ClinicalMealBlock[];
  totalDailyCalorieTarget: number;
  totalMealPlanCalorie: number;
  recommendedCalorieTarget: number;
  status: 'published' | 'draft';
  publishedAt: number;
  updatedByAdminName?: string;
  generalNotes?: string[];
}
