/**
 * Workout, Exercise Database, and Routine Tracking Types for She Nourishes (Phase 2)
 */

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs (Quads / Hamstrings / Glutes)'
  | 'Core & Abs'
  | 'Cardio & Conditioning'
  | 'Full Body Mobility';

export type EquipmentType =
  | 'Bodyweight / Mat'
  | 'Dumbbells'
  | 'Barbell'
  | 'Resistance Bands'
  | 'Cable Machine'
  | 'Gym Machinery'
  | 'Cardio Equipment (Treadmill, Cycle)';

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType;
  instructions: string[];
  tips?: string[];
  videoThumbnailUrl?: string;
  defaultRestSeconds: number; // e.g. 60
}

export interface PrescribedExerciseSet {
  setNumber: number;
  targetReps: number | string; // e.g. 12 or "10-12"
  targetWeightKg?: number;
  targetRPE?: number; // Rate of Perceived Exertion (1-10)
  restSeconds?: number;
}

export interface PrescribedExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: PrescribedExerciseSet[];
  notes?: string; // e.g. "Slow eccentric tempo 3-1-1"
  alternatives?: string[]; // alternative exercise IDs or names
}

export interface WorkoutDayRoutine {
  dayIndex: number; // 0 = Sunday, 1 = Monday ... or 1 = Day 1
  dayName: string;  // e.g. "Monday - Lower Body & Glutes"
  focusArea: string;
  isRestDay: boolean;
  exercises: PrescribedExercise[];
  estimatedDurationMinutes: number;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  planTitle: string; // e.g. "Strength & Tone 4-Day Split"
  daysPerWeek: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'archived' | 'draft';
  routines: WorkoutDayRoutine[];
  createdByAdminId: string;
  createdAt: number;
  updatedAt: number;
}

export interface CompletedExerciseSet {
  setNumber: number;
  repsDone: number;
  weightKgDone: number;
  isWarmup?: boolean;
}

export interface CompletedExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedExerciseSet[];
}

export interface WorkoutLog {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  workoutPlanId?: string;
  routineTitle: string;
  completedExercises: CompletedExerciseLog[];
  durationMinutes: number;
  perceivedExertion: number; // 1 to 10 scale
  notes?: string;
  loggedAt: number;
}
