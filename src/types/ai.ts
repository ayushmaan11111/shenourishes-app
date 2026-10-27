/**
 * AI Services, Vision Scanner, Intelligence Assistant, and Analytics Contracts for She Nourishes (Phase 2)
 */

import type { FoodItem, MacroNutrients } from './nutrition';

export interface DetectedFoodCandidate {
  rawDetectedName: string; // e.g. "Paneer Tikka"
  matchedFoodItem?: FoodItem;
  matchedFoodId?: string;
  estimatedGrams: number;
  confidenceScore: number; // 0.0 to 1.0
  isCustomConfirmed: boolean;
}

export interface FoodScanVisionResult {
  scanId: string;
  imageUrl?: string;
  detectedFoods: DetectedFoodCandidate[];
  totalEstimatedMacros: MacroNutrients;
  summaryExplanation: string;
  requiresUserConfirmation: boolean;
  createdAt: number;
}

export interface NaturalLanguageFoodParseResult {
  rawInputText: string;
  parsedItems: {
    foodName: string;
    matchedFoodId?: string;
    quantity: number;
    unit: string;
    calculatedGrams: number;
    macros: MacroNutrients;
  }[];
  totalMacros: MacroNutrients;
}

export interface ClientAIContext {
  clientId: string;
  fullName: string;
  age: number | null;
  gender: string;
  currentWeightKg: number | null;
  activityLevel: string;
  calculatedIntensity: number;
  dietaryPreference: string;
  allergies?: string;
  anxietyLevel?: string;
  
  // Clinical prescription (Highest Priority)
  activePlanTitle?: string;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  targetWaterMl: number;
  
  // Today's actuals
  todayCaloriesConsumed: number;
  todayProteinConsumed: number;
  todayCarbsConsumed: number;
  todayFatConsumed: number;
  todayWaterConsumedMl: number;
  todayRemainingCalories: number;
  todayRemainingProtein: number;
  
  // Schedule & workouts
  scheduledWorkoutToday?: string;
  isWorkoutCompletedToday: boolean;
  activeSupplements: { name: string; timing: string; dosage: string }[];
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  suggestedActionType?: 'log_food' | 'view_diet_plan' | 'hydrate' | 'view_workout';
  suggestedFoodsPayload?: {
    foodId: string;
    foodName: string;
    quantityGrams: number;
    macros: MacroNutrients;
  }[];
  timestamp: number;
}

export type AnomalyAlertType =
  | 'severe_protein_deficit'
  | 'missed_food_logs_streak'
  | 'consecutive_calorie_overage'
  | 'skipped_workouts'
  | 'low_hydration_streak';

export interface AdherenceAnomalyAlert {
  id: string;
  clientId: string;
  clientName: string;
  alertType: AnomalyAlertType;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendedAdminAction: string;
  triggeredDate: string;
  isResolved: boolean;
  resolvedAt?: number;
}

export interface AIMealSuggestion {
  title: string;
  foodItems: {
    foodId: string;
    foodName: string;
    servingDisplay: string;
    quantityGrams: number;
    macros: MacroNutrients;
  }[];
  totalMacros: MacroNutrients;
  rationale: string; // e.g. "Fits perfectly within your remaining 420 kcal and 28g protein budget for dinner"
}
