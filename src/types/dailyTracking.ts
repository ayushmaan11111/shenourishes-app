/**
 * Daily Activity, Water, Exercise & Food Intake Tracking Types
 */

export interface ExerciseLogItem {
  id: string;
  exerciseName: string;
  durationMinutes: number;
  timeOfDay: string; // e.g. '07:30 AM' or 'Morning'
  intensity: 'Low' | 'Moderate' | 'High' | 'High Intensity';
  caloriesBurned?: number;
  loggedAt: number;
}

export interface FoodLogItem {
  id: string;
  foodName: string;
  mealType: 'Breakfast' | 'Mid-Morning' | 'Lunch' | 'Evening' | 'Dinner' | 'Snack';
  quantity?: string;
  calories?: number;
  proteinGrams?: number;
  notes?: string;
  loggedAt: number;
}

export interface ClientDailyLog {
  clientId: string;
  date: string; // 'YYYY-MM-DD'
  waterIntakeMl: number;
  waterGoalMl: number;
  exercises: ExerciseLogItem[];
  foodLogs: FoodLogItem[];
  followedMealNumbers?: number[];
  updatedAt: number;
}
