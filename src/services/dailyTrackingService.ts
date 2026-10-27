/**
 * Daily Activity, Water, Exercise, and Food Intake Service
 * Saves real client activity logs directly to Firebase Realtime Database.
 */

import { ref, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import type { ClientDailyLog, ExerciseLogItem, FoodLogItem } from '../types/dailyTracking';

const STORAGE_PREFIX = 'she_nourishes_daily_log_';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDefaultDailyLog(clientId: string, date = getTodayDateString()): ClientDailyLog {
  return {
    clientId,
    date,
    waterIntakeMl: 0,
    waterGoalMl: 2500,
    exercises: [],
    foodLogs: [],
    followedMealNumbers: [],
    updatedAt: Date.now(),
  };
}

/**
 * Retrieves the daily log for a client on a given date from cache and Firebase.
 */
export function getDailyLog(clientId: string, date = getTodayDateString()): ClientDailyLog {
  const key = `${STORAGE_PREFIX}${clientId}_${date}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as ClientDailyLog;
    }
  } catch (e) {
    console.warn('Error reading daily log from localStorage:', e);
  }
  return getDefaultDailyLog(clientId, date);
}

/**
 * Saves and syncs daily log to Firebase Realtime Database and localStorage.
 */
export function saveDailyLog(log: ClientDailyLog): void {
  const key = `${STORAGE_PREFIX}${log.clientId}_${log.date}`;
  try {
    const updated = { ...log, updatedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(updated));

    // Live Firebase Realtime Database sync
    if (isFirebaseConfigured && database && log.clientId) {
      set(ref(database, `customers/${log.clientId}/dailyLogs/${log.date}`), updated).catch((err) => {
        console.warn('Firebase RTDB daily log customer write error:', err);
      });
      set(ref(database, `dailyLogs/${log.clientId}/${log.date}`), updated).catch((err) => {
        console.warn('Firebase RTDB daily log global write error:', err);
      });
    }
  } catch (e) {
    console.error('Error saving daily log:', e);
  }
}

/**
 * Quick-add or set water intake in ml.
 */
export function addWaterIntake(clientId: string, amountMl: number, date = getTodayDateString()): ClientDailyLog {
  const current = getDailyLog(clientId, date);
  const nextWater = Math.max(0, current.waterIntakeMl + amountMl);
  const updated: ClientDailyLog = {
    ...current,
    waterIntakeMl: nextWater,
  };
  saveDailyLog(updated);
  return updated;
}

/**
 * Log an exercise session with exercise name, duration, time, and intensity.
 */
export function addExerciseLog(
  clientId: string,
  exercise: Omit<ExerciseLogItem, 'id' | 'loggedAt'>,
  date = getTodayDateString()
): ClientDailyLog {
  const current = getDailyLog(clientId, date);
  const newItem: ExerciseLogItem = {
    ...exercise,
    id: 'ex_' + Math.random().toString(36).substring(2, 9),
    loggedAt: Date.now(),
  };

  const updated: ClientDailyLog = {
    ...current,
    exercises: [...current.exercises, newItem],
  };
  saveDailyLog(updated);
  return updated;
}

/**
 * Remove an exercise session.
 */
export function removeExerciseLog(clientId: string, exerciseId: string, date = getTodayDateString()): ClientDailyLog {
  const current = getDailyLog(clientId, date);
  const updated: ClientDailyLog = {
    ...current,
    exercises: current.exercises.filter((e) => e.id !== exerciseId),
  };
  saveDailyLog(updated);
  return updated;
}

/**
 * Log a food item or extra meal.
 */
export function addFoodLog(
  clientId: string,
  food: Omit<FoodLogItem, 'id' | 'loggedAt'>,
  date = getTodayDateString()
): ClientDailyLog {
  const current = getDailyLog(clientId, date);
  const newItem: FoodLogItem = {
    ...food,
    id: 'food_' + Math.random().toString(36).substring(2, 9),
    loggedAt: Date.now(),
  };

  const updated: ClientDailyLog = {
    ...current,
    foodLogs: [...current.foodLogs, newItem],
  };
  saveDailyLog(updated);
  return updated;
}

/**
 * Remove a logged food item.
 */
export function removeFoodLog(clientId: string, foodLogId: string, date = getTodayDateString()): ClientDailyLog {
  const current = getDailyLog(clientId, date);
  const updated: ClientDailyLog = {
    ...current,
    foodLogs: current.foodLogs.filter((f) => f.id !== foodLogId),
  };
  saveDailyLog(updated);
  return updated;
}
