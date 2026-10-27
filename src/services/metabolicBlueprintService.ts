import { ref, get, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { 
  publishClientDietChart, 
  calculateChartTotals 
} from './clinicalDietTemplates';
import { resolveCustomizedDietChart } from './customizedMealPlans';
import type { ClinicalDietChart } from '../types/clinicalChart';

export interface MetabolicBlueprintData {
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  lbmMethod: string;
  bodyFatPercentage: number;
  leanBodyMassKg: number;
  weightKg?: number;
  heightCm?: number;
  age?: number;
  intensity?: number;
  proteinRequirementGrams: number;
  fatRequirementGrams: number;
  dietBase: 'Veg' | 'Non-Veg';
  selectedProteinFoods: string[];
  autoClassifiedDiet: string;
  prescribedProtocol: 'Fat + Protein Diet' | 'Low-Carb Diet';
  selectedLowGiCarbs: string[];
  updatedAt: number;
}

const STORAGE_PREFIX = 'she_nourishes_metabolic_blueprint_';

/**
 * Retrieves the client's saved metabolic blueprint and auto-classified diet from Firebase Realtime Database
 * with instant fallback to local cache.
 */
export async function getMetabolicBlueprint(clientId: string): Promise<MetabolicBlueprintData | null> {
  // 1. Try Firebase Realtime Database first if configured
  if (isFirebaseConfigured && database && clientId) {
    try {
      const snapshot = await get(ref(database, `customers/${clientId}/metabolicBlueprint`));
      if (snapshot.exists()) {
        const val = snapshot.val() as MetabolicBlueprintData;
        try {
          localStorage.setItem(STORAGE_PREFIX + clientId, JSON.stringify(val));
        } catch (_) {}
        return val;
      }
      const altSnap = await get(ref(database, `clients/${clientId}/metabolicBlueprint`));
      if (altSnap.exists()) {
        const val = altSnap.val() as MetabolicBlueprintData;
        try {
          localStorage.setItem(STORAGE_PREFIX + clientId, JSON.stringify(val));
        } catch (_) {}
        return val;
      }
    } catch (e) {
      console.warn('Firebase RTDB getMetabolicBlueprint read error:', e);
    }
  }

  // 2. Fallback to LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + clientId);
    if (raw) {
      return JSON.parse(raw) as MetabolicBlueprintData;
    }
  } catch (e) {
    console.warn('LocalStorage getMetabolicBlueprint read error:', e);
  }

  return null;
}

/**
 * Saves the client's metabolic blueprint and automatically generates & publishes
 * the personalized Clinical Food Diet Planner for the client.
 */
export async function saveMetabolicBlueprint(
  data: MetabolicBlueprintData,
  clientEmail?: string,
  clientName?: string
): Promise<{ blueprint: MetabolicBlueprintData; chart: ClinicalDietChart }> {
  const payload: MetabolicBlueprintData = {
    ...data,
    updatedAt: Date.now(),
  };

  // 1. Save to LocalStorage
  try {
    localStorage.setItem(STORAGE_PREFIX + data.clientId, JSON.stringify(payload));
  } catch (e) {
    console.warn('LocalStorage saveMetabolicBlueprint write error:', e);
  }

  // 2. Save to Firebase Realtime Database
  if (isFirebaseConfigured && database && data.clientId) {
    try {
      await Promise.all([
        set(ref(database, `customers/${data.clientId}/metabolicBlueprint`), payload),
        set(ref(database, `clients/${data.clientId}/metabolicBlueprint`), payload),
        set(ref(database, `metabolicBlueprints/${data.clientId}`), payload),
      ]);
    } catch (e) {
      console.warn('Firebase RTDB saveMetabolicBlueprint write error:', e);
    }
  }

  // 3. Automatically generate & publish the client's tailored food diet plan
  const chart = generateAndPublishDietPlanFromBlueprint(payload, clientEmail, clientName);

  return { blueprint: payload, chart };
}

/**
 * Generates and publishes the Clinical Diet Chart matching the client's
 * auto-classified diet, selected protein foods, selected low-GI carbs,
 * and calculated protein & fat targets.
 */
export function generateAndPublishDietPlanFromBlueprint(
  data: MetabolicBlueprintData,
  clientEmail?: string,
  clientName?: string
): ClinicalDietChart {
  const clientId = data.clientId || 'default';

  // 1. Resolve the base customized diet plan using the auto-classified diet and protein foods
  const baseChart = resolveCustomizedDietChart(
    4, // 4-meal clinical standard
    [...data.selectedProteinFoods, data.autoClassifiedDiet],
    clientId
  );

  // 2. Customise the carbohydrate foods in Meal 2 (Lunch) and/or Meal 3/4 (Dinner/Snack)
  // using the client's selected low-GI carbs (e.g. Brown rice, Whole-wheat chapati, Millet roti)
  const chosenStarch = data.selectedLowGiCarbs.length > 0
    ? data.selectedLowGiCarbs[0]
    : 'Brown rice';

  const secondaryStarch = data.selectedLowGiCarbs.length > 1
    ? data.selectedLowGiCarbs[1]
    : 'Whole-wheat chapati';

  const customizedMeals = baseChart.meals.map((meal) => {
    // If lunch meal (Meal 2)
    if (meal.mealNumber === 2) {
      const updatedFoods = meal.foods.map((food) => {
        if (food.foodName.toLowerCase().includes('rice') || food.foodName.toLowerCase().includes('roti') || food.foodName.toLowerCase().includes('chapati')) {
          return {
            ...food,
            foodName: `${chosenStarch} (Planned Low-GI Carb)`,
            quantity: '30-40g Cooked Portion',
            carbsGrams: 20,
            calories: 110,
          };
        }
        return food;
      });
      return { ...meal, foods: updatedFoods };
    }

    // If dinner meal (Meal 4)
    if (meal.mealNumber === 4) {
      const updatedFoods = meal.foods.map((food) => {
        if (food.foodName.toLowerCase().includes('rice') || food.foodName.toLowerCase().includes('roti') || food.foodName.toLowerCase().includes('chapati')) {
          if (data.prescribedProtocol === 'Fat + Protein Diet') {
            // No high-GI starches at dinner on Fat + Protein Diet
            return {
              ...food,
              foodName: 'Mixed Cruciferous Greens (Broccoli, Cauliflower) in Desi Ghee',
              quantity: '1 Cup (150g)',
              proteinGrams: 3,
              fatGrams: 7,
              carbsGrams: 5,
              calories: 95,
            };
          } else {
            return {
              ...food,
              foodName: `${secondaryStarch} (Planned Low-GI)`,
              quantity: '1 Small Piece (35g)',
              carbsGrams: 15,
              calories: 85,
            };
          }
        }
        return food;
      });
      return { ...meal, foods: updatedFoods };
    }

    return meal;
  });

  // Calculate target calories
  const carbCalories = data.prescribedProtocol === 'Low-Carb Diet' ? 105 * 4 : 25 * 4;
  const targetCalories = (data.proteinRequirementGrams * 4) + (data.fatRequirementGrams * 9) + carbCalories;

  const finalChart: ClinicalDietChart = {
    ...baseChart,
    id: `chart_${clientId}_${Date.now()}`,
    clientId,
    title: data.prescribedProtocol === 'Low-Carb Diet'
      ? 'LOW CARB (80–120G): MEAL PLANNING'
      : 'FAT + PROTEIN DIET (WITH INCIDENTAL CARBOHYDRATES)',
    dietTypeTag: `( ${data.autoClassifiedDiet.toUpperCase()} • ${data.prescribedProtocol.toUpperCase()} )`,
    totalDailyCalorieTarget: targetCalories,
    recommendedCalorieTarget: targetCalories,
    meals: customizedMeals,
    status: 'published',
    publishedAt: Date.now(),
    updatedByAdminName: 'Auto-Calibrated by Metabolic Engine',
    generalNotes: [
      `Auto-Classified Diet: ${data.autoClassifiedDiet}`,
      `Prescribed Protocol: ${data.prescribedProtocol}`,
      `Lean Body Mass (LBM): ${data.leanBodyMassKg} kg (Calculated via ${data.lbmMethod.toUpperCase()})`,
      `Daily Protein Target: ${data.proteinRequirementGrams}g • Daily Fat Target: ${data.fatRequirementGrams}g`,
      `Approved Low-GI Carb Staples: ${data.selectedLowGiCarbs.join(', ') || 'Brown rice, Millet roti'}`,
      `Active Protein Sources: ${data.selectedProteinFoods.join(', ')}`,
    ],
  };

  const totals = calculateChartTotals(finalChart);
  finalChart.totalMealPlanCalorie = totals.totalCalories;

  // Publish to LocalStorage and Firebase RTDB
  publishClientDietChart(finalChart, clientEmail || 'client@domain.com', clientName || 'Patient');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('diet_chart_updated', { detail: { clientId } }));
    window.dispatchEvent(new CustomEvent('metabolic_blueprint_updated', { detail: { clientId } }));
  }

  return finalChart;
}
