/**
 * Food Logging, Water Tracking, and Daily Intake Summaries for She Nourishes (Phase 2)
 */

import type { MacroNutrients } from './nutrition';

export type MealCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'pre_workout'
  | 'post_workout';

export type LogSource =
  | 'manual_search'
  | 'diet_plan_check'
  | 'ai_vision_scanner'
  | 'ai_voice'
  | 'quick_calories';

export interface LoggedFoodEntry {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  mealCategory: MealCategory;
  foodId: string;
  foodName: string;
  quantityGrams: number;
  servingDisplay: string; // e.g. "1.5 katori (225g)"
  macros: MacroNutrients;
  logSource: LogSource;
  confidenceScore?: number; // e.g. 0.94 if recognized by AI vision
  photoUrl?: string; // photo if captured by scanner
  loggedAt: number; // timestamp
}

export interface WaterLogEntry {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  amountMl: number; // e.g. 250, 500
  loggedAt: number;
}

export interface MealSlotStatus {
  mealNumber: number;
  mealName: string;
  scheduledTime: string;
  isCompleted: boolean;
  completedAt?: number;
  loggedCalories: number;
  targetCalories: number;
}

export interface DailyTrackingSummary {
  clientId: string;
  date: string; // YYYY-MM-DD
  totalCalories: number;
  targetCalories: number;
  totalProtein: number;
  targetProtein: number;
  totalCarbs: number;
  targetCarbs: number;
  totalFat: number;
  targetFat: number;
  totalFiber: number;
  targetFiber: number;
  totalWaterMl: number;
  targetWaterMl: number;
  meals: MealSlotStatus[];
  dietAdherencePercentage: number; // 0 to 100
  workoutCompleted: boolean;
  updatedAt: number;
}
