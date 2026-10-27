/**
 * Progress, Measurements, Weight History, and Photo Metadata for She Nourishes (Phase 2)
 */

export interface BodyMeasurements {
  chestCm?: number;
  waistAtNavelCm?: number;
  waistAboveNavelCm?: number;
  waistBelowNavelCm?: number;
  hipsCm?: number;
  thighRightCm?: number;
  thighLeftCm?: number;
  armRightCm?: number;
  armLeftCm?: number;
}

export interface ProgressPhotoMeta {
  frontPhotoUrl?: string;
  sidePhotoUrl?: string;
  backPhotoUrl?: string;
  isPrivateToAdmin: boolean;
}

export interface ProgressEntry {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercentage?: number;
  measurements?: BodyMeasurements;
  photos?: ProgressPhotoMeta;
  energyLevelRating?: number; // 1 to 5
  sleepQualityRating?: number; // 1 to 5
  digestionComfortRating?: number; // 1 to 5
  clientNotes?: string;
  adminFeedbackNotes?: string;
  loggedAt: number;
}

export interface ClientAdherenceTrend {
  clientId: string;
  periodStartDate: string;
  periodEndDate: string;
  averageCaloriesConsumed: number;
  averageCalorieTarget: number;
  calorieAdherencePercentage: number;
  averageProteinGramsConsumed: number;
  proteinTargetGrams: number;
  proteinAdherencePercentage: number;
  totalWorkoutsScheduled: number;
  totalWorkoutsCompleted: number;
  workoutAdherencePercentage: number;
  daysLoggedCount: number; // out of 7 or 30
  overallScore: number; // 0 to 100
}
