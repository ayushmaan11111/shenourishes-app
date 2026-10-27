/**
 * Dynamic Goal & Recommendation Engine Types for She Nourishes
 */

export type RecommendationType =
  | 'SUPPLEMENT'
  | 'FOOD'
  | 'DIET STRATEGY'
  | 'NUTRITION STRATEGY'
  | 'LIFESTYLE'
  | 'HYDRATION'
  | 'OTHER';

export interface CustomGoalItem {
  id: string;
  name: string;
  description: string;
  additionalDetails?: string;
  createdAt: number;
}

export interface GoalDefinition {
  id: string;
  name: string;
  description: string;
  category: 'HIGH INTENSITY / PERFORMANCE' | 'MODERATE ACTIVITY / PERFORMANCE' | 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE' | 'GENERAL WELLNESS' | 'CLINICAL NUTRITION';
  icon?: string;
  iconType?: 'vector' | 'svg_custom';
  iconSvg?: string;
  priority: number;
  isActive: boolean;
  recommendedSupplements?: string[];
  recommendedNutritionStrategies?: string[];
  recommendedLifestyleStrategies?: string[];
  notes?: string;
}

export interface SupplementEntity {
  id: string;
  name: string;
  category: string; // e.g. "Bone Health", "Performance", "Recovery", "Sleep & Stress"
  description: string;
  icon?: string;
  iconType?: 'vector' | 'svg_custom';
  iconSvg?: string;
  image?: string;
  active: boolean;
  standardDosage?: string;
  timing?: string;
  adminNotes?: string;
  contraindicationNotes?: string;
}

export interface RecommendationRule {
  id: string;
  goalIdOrName: string;
  categoryContext?: 'HIGH INTENSITY / PERFORMANCE' | 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE' | 'ALL';
  conditionDietPreference?: 'VEGETARIAN' | 'NON-VEGETARIAN' | 'ANY';
  recommendationName: string;
  recommendationType: RecommendationType;
  category: string;
  description: string;
  dosageOrProtocol?: string;
  timing?: string;
  priorityOrder?: number;
  notes?: string;
}

export interface GeneratedRecommendation {
  id: string;
  name: string;
  type: RecommendationType;
  category: string;
  description: string;
  triggeredByGoals: string[]; // e.g. ["Better Sleep", "Reduce Muscle Cramps"]
  dosageOrProtocol?: string;
  timing?: string;
  notes?: string;
  isAdminApproved?: boolean;
}
