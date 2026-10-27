import { database, isFirebaseConfigured } from './firebase';
import { ref, get, set } from 'firebase/database';
import type {
  LifestyleIntensityTier,
  LifestyleAssessmentAnswers,
  EvaluatedSupplementRecommendation,
  LifestyleSupplementEvaluationResult,
} from '../types/lifestyleSupplement';
import { saveClientSupplementPlan, getClientSupplementPlan } from './formulaEngineService';
import type { ClientSupplementPlanItem } from '../types/formulaEngine';

const STORAGE_KEY_PREFIX = 'she_nourishes_lifestyle_supplements_';

/**
 * Evaluates lifestyle supplement recommendations based on the 8 clinical flowcharts:
 * - Sedentary 1.5
 * - Beginner 1.5
 * - Moderate 2.0
 * - Extremely High 2.5
 */
export function evaluateLifestyleSupplements(
  answers: LifestyleAssessmentAnswers
): LifestyleSupplementEvaluationResult {
  const { intensityTier, anxietyLevel, caffeinatedBeveragesPerDay } = answers;
  const recs: EvaluatedSupplementRecommendation[] = [];
  const combinationNotes: string[] = [];

  const postBreakfast: string[] = [];
  const morningEmptyStomach: string[] = [];
  const postLunch: string[] = [];
  const postWorkout: string[] = [];
  const postDinner: string[] = [];
  const bedtime: string[] = [];
  const separateCounselling: string[] = [];

  // --- 1. CAFFEINE & ANXIETY ASSESSMENT ---
  const isHighAnxiety = anxietyLevel === 'High' || anxietyLevel === 'Very High';
  const isHighCaffeine =
    intensityTier === 'Sedentary 1.5' || intensityTier === 'Beginner 1.5'
      ? caffeinatedBeveragesPerDay >= 2
      : caffeinatedBeveragesPerDay >= 3;

  let caffeineWarning: string | undefined = undefined;
  if (isHighAnxiety || isHighCaffeine) {
    caffeineWarning = `High caffeine exposure (${caffeinatedBeveragesPerDay} beverages/day) or ${anxietyLevel.toLowerCase()} anxiety level detected. Caffeine anhydrous is strictly contraindicated. Encourage reduction to manage anxiety and sleep quality.`;
  }

  // Caffeine Anhydrous (Optional kick for low anxiety + low caffeine)
  if (answers.wantsWorkoutKick && answers.openToCaffeineAnhydrous) {
    if (isHighAnxiety || isHighCaffeine) {
      recs.push({
        id: 'caffeine-contraindicated',
        name: 'Caffeine Anhydrous',
        dosage: '0 mg (Withheld)',
        timing: 'Do Not Take',
        category: 'Pre-Workout Kick',
        status: 'Contraindicated',
        clinicalPurpose: 'Avoided due to elevated anxiety or existing caffeine intake (>= 2-3 drinks/day).',
        instructions: 'Focus on caffeine reduction to support nervous system and sleep quality.',
        icon: '☕',
      });
    } else {
      recs.push({
        id: 'caffeine-anhydrous',
        name: 'Caffeine Anhydrous',
        dosage: '200 mg (1 serving)',
        timing: 'Pre-Workout (30 mins before session)',
        category: 'Pre-Workout Kick',
        status: 'Recommended',
        clinicalPurpose: 'Central nervous system stimulant for acute training kick and alertness.',
        instructions: 'Take 200 mg 30 minutes before high-intensity workouts. Avoid late evening use.',
        icon: '⚡',
      });
    }
  }

  // --- 2. BONE HEALTH & VITAMIN D (DOCTOR-DIRECTED) ---
  if (answers.openToBoneHealth) {
    if (intensityTier === 'Moderate 2.0' || intensityTier === 'Extremely High 2.5') {
      recs.push({
        id: 'calcium-k2-moderate',
        name: 'Calcium Citrate Malate + Vitamin K2 MK-7',
        dosage: 'Calcium 500 mg + K2 200 mcg',
        timing: 'Split: Post-Breakfast & Post-Lunch',
        category: 'Bone Health',
        status: 'Recommended',
        clinicalPurpose: 'Supports bone mineral density and proper calcium deposition in bone matrix.',
        instructions: 'Take 500 mg Calcium + 200 mcg K2 after breakfast and another after lunch.',
        icon: '🦴',
      });
      postBreakfast.push('Calcium Citrate Malate (500 mg) + Vitamin K2 MK-7 (200 mcg)');
      postLunch.push('Calcium Citrate Malate (500 mg) + Vitamin K2 MK-7 (200 mcg)');
    } else {
      recs.push({
        id: 'calcium-k2-beginner',
        name: 'Calcium Citrate Malate + Vitamin K2 MK-7',
        dosage: 'Calcium 500 mg + K2 200 mcg',
        timing: 'Calcium: Post-Lunch • K2: Post-Breakfast & Post-Lunch',
        category: 'Bone Health',
        status: 'Recommended',
        clinicalPurpose: 'Promotes optimal bone mineralization without vascular calcification.',
        instructions: 'Take Calcium 500 mg post-lunch; Vitamin K2 MK-7 200 mcg post-breakfast & post-lunch.',
        icon: '🦴',
      });
      postBreakfast.push('Vitamin K2 MK-7 (200 mcg)');
      postLunch.push('Calcium Citrate Malate (500 mg) + Vitamin K2 MK-7 (200 mcg)');
    }

    recs.push({
      id: 'vitamin-d3-doctor',
      name: 'Vitamin D3 (Doctor-Guided Protocol)',
      dosage: answers.doctorPrescribedVitaminD || 'As prescribed by treating doctor after blood test',
      timing: 'As directed with fat-containing meal (Breakfast/Lunch)',
      category: 'Bone Health',
      status: 'Doctor-Directed',
      clinicalPurpose: 'Essential for calcium absorption and immune regulation.',
      instructions: 'IMPORTANT: Exact Vitamin D3 dose must be prescribed by a physician based on blood test results. Do not self-prescribe.',
      icon: '☀️',
    });
  }

  // --- 3. ERGOGENIC ENERGY (L-Carnitine / Creatine) ---
  if (intensityTier === 'Sedentary 1.5') {
    if (answers.feelsLowOnEnergy && answers.openToErgogenicEnergy) {
      recs.push({
        id: 'acetyl-l-carnitine-sedentary',
        name: 'L-Carnitine / Acetyl-L-Carnitine',
        dosage: '3 g/day',
        timing: 'Morning (Empty Stomach)',
        category: 'Ergogenic',
        status: 'Separate Counselling',
        clinicalPurpose: 'Cellular mitochondrial fatty acid shuttle for daily energy support.',
        instructions: 'Note: Kept as a separate counselling discussion rather than placed in the main diet chart.',
        icon: '⚡',
      });
      separateCounselling.push('Acetyl-L-Carnitine 3 g/day (Separate counselling discussion)');
    }
  } else if (intensityTier === 'Beginner 1.5') {
    if (answers.feelsLowOnEnergy && answers.openToErgogenicEnergy) {
      const time = answers.workoutTime || 'Morning';
      const timingStr = time === 'Morning' ? 'Morning on empty stomach' : 'Evening post-workout';
      recs.push({
        id: 'acetyl-l-carnitine-beginner',
        name: 'Acetyl-L-Carnitine',
        dosage: '3 g/day (Minimum dose)',
        timing: timingStr,
        category: 'Ergogenic',
        status: 'Recommended',
        clinicalPurpose: 'Enhances energy metabolism and fatty-acid oxidation during workouts.',
        instructions: time === 'Morning'
          ? 'Take 3 g Acetyl-L-Carnitine on empty stomach before your morning walk/yoga.'
          : 'Take 3 g Acetyl-L-Carnitine post-workout after your evening exercise.',
        icon: '⚡',
      });
      if (time === 'Morning') {
        morningEmptyStomach.push('Acetyl-L-Carnitine (3 g) — Empty stomach');
      } else {
        postWorkout.push('Acetyl-L-Carnitine (3 g) — Post-workout');
      }
    }
  } else {
    // Moderate 2.0 & Extremely High 2.5: Creatine Monohydrate
    if (answers.wantsIncreaseStrengthOrHeavyWeights && answers.openToCreatine) {
      recs.push({
        id: 'creatine-monohydrate',
        name: 'Creatine Monohydrate (Micronized)',
        dosage: '5 g/day',
        timing: 'Post-Workout (Morning or Evening)',
        category: 'Ergogenic',
        status: 'Recommended',
        clinicalPurpose: 'Phosphocreatine resynthesis for strength, explosive power, and heavy lifts.',
        instructions: 'Take 5 g post-workout mixed with water, electrolyte shake, or whey protein.',
        icon: '🏋️‍♂️',
      });
      postWorkout.push('Creatine Monohydrate (5 g) — Post-workout');
    }
  }

  // --- 4. ERGOGENIC AIDS: L-CITRULLINE & BETA-ALANINE ---
  const wantsCitrulline = answers.feelsBurningOrWantsVascularity && answers.openToCitrulline;
  const wantsBetaAlanine = answers.goesRunning && answers.feelsRunningFatigue && answers.openToBetaAlanine;

  if (wantsCitrulline && wantsBetaAlanine) {
    // Combination Rule: Take together post-workout!
    recs.push({
      id: 'citrulline-beta-alanine-combo',
      name: 'L-Citrulline (3 g) + Beta-Alanine (3 g)',
      dosage: '3 g L-Citrulline + 3 g Beta-Alanine',
      timing: 'Together Post-Workout',
      category: 'Ergogenic',
      status: 'Recommended',
      clinicalPurpose: 'Nitric oxide vascularity, carnosine buffer, and lactic acid reduction.',
      instructions: 'COMBINATION RULE: Take both L-Citrulline and Beta-Alanine together post-workout. No need to administer separately.',
      icon: '🔥',
    });
    postWorkout.push('L-Citrulline (3 g) + Beta-Alanine (3 g) — Combined Post-workout');
    combinationNotes.push('Beta-Alanine + L-Citrulline are combined together post-workout for maximum endurance and pump synergy.');
  } else {
    if (wantsCitrulline) {
      recs.push({
        id: 'l-citrulline-solo',
        name: 'L-Citrulline (Fermented)',
        dosage: '3 g/day',
        timing: 'Post-Workout (Morning or Evening)',
        category: 'Ergogenic',
        status: 'Recommended',
        clinicalPurpose: 'Reduces heavy training muscle burning and enhances vascularity/visible veins.',
        instructions: 'Take 3 g post-workout after your lifting or strength session.',
        icon: '💪',
      });
      postWorkout.push('L-Citrulline (3 g) — Post-workout');
    }

    if (wantsBetaAlanine) {
      const runTime = answers.runningTime || 'Morning';
      const timingStr = runTime === 'Morning' ? 'Morning on empty stomach' : 'Evening post-running';
      recs.push({
        id: 'beta-alanine-solo',
        name: 'Beta-Alanine',
        dosage: '3 g/day',
        timing: timingStr,
        category: 'Ergogenic',
        status: 'Recommended',
        clinicalPurpose: 'Buffers muscular acidosis and delays fatigue during endurance runs.',
        instructions: runTime === 'Morning'
          ? 'Take 3 g Beta-Alanine on empty stomach before morning running.'
          : 'Take 3 g Beta-Alanine post-running / post-workout in the evening.',
        icon: '🏃‍♂️',
      });
      if (runTime === 'Morning') {
        morningEmptyStomach.push('Beta-Alanine (3 g) — Morning empty stomach');
      } else {
        postWorkout.push('Beta-Alanine (3 g) — Evening post-run');
      }
    }
  }

  // --- 5. GUT HEALTH / PROBIOTICS (Sedentary & Beginner) ---
  if (answers.hasConstipationOrFlatulence && answers.openToGutSupport) {
    recs.push({
      id: 'probiotic-gut',
      name: 'Multi-Strain Probiotic Complex',
      dosage: '2 g/day (or equivalent CFU)',
      timing: '30 mins before lunch & 30 mins before later meal/snack',
      category: 'Gut Health',
      status: 'Recommended',
      clinicalPurpose: 'Relieves constipation, bloating, flatulence, and restores digestive microbiome.',
      instructions: 'Take 1 g 30 minutes before lunch, and 1 g 30 minutes before your afternoon snack or dinner.',
      icon: '🦠',
    });
    postLunch.push('Probiotic 2 g/day (Split: 30m before lunch & 30m before dinner)');
  }

  // --- 6. IMMUNITY & ANTIOXIDANT SUPPORT ---
  const wantsAntioxidants =
    answers.poorImmunityOrOftenSick &&
    (answers.smokes || answers.drinksAlcohol || answers.openToAntioxidantSupport);

  // --- 7. JOINT PAIN & ANTI-INFLAMMATORY (Omega-3) ---
  const wantsOmega3 = (answers.hasJointPain || answers.wantsLongTermJointHealth) && answers.openToOmega3;

  // --- COMBINATION TIMING: Antioxidants vs Omega-3 ---
  if (wantsAntioxidants && wantsOmega3) {
    // Both active: MUST BE SEPARATE!
    recs.push({
      id: 'antioxidant-combo-split',
      name: 'Antioxidant Complex (ALA + CoQ10 + Vit C + Vit E)',
      dosage: 'ALA 600 mg + CoQ10 400 mg + Vitamin C 1,000 mg + Vitamin E 600 IU',
      timing: 'Post-Lunch (Separated from Omega-3)',
      category: 'Antioxidant',
      status: 'Recommended',
      clinicalPurpose: 'Cellular protection, mitochondrial support, and oxidative stress reduction.',
      instructions: 'TIMING RULE: Take immediately after lunch. Kept separate from evening anti-inflammatory Omega-3.',
      icon: '🛡️',
    });
    postLunch.push('Antioxidant Complex (ALA 600mg + CoQ10 400mg + Vit C 1000mg + Vit E 600IU) — Post-Lunch');

    recs.push({
      id: 'omega-3-combo-split',
      name: 'Omega-3 Fish Oil (High EPA + DHA)',
      dosage: 'EPA + DHA 900 mg',
      timing: 'Post-Dinner / Bedtime',
      category: 'Anti-inflammatory',
      status: 'Recommended',
      clinicalPurpose: 'Systemic joint anti-inflammatory, cardiovascular support, and recovery.',
      instructions: 'TIMING RULE: Take post-dinner / bedtime. Kept at a separate time from afternoon antioxidant support.',
      icon: '🐟',
    });
    postDinner.push('Omega-3 EPA+DHA (900 mg) — Post-Dinner / Bedtime');

    combinationNotes.push(
      'Antioxidants (ALA + CoQ10 + Vit C + Vit E) are taken Post-Lunch, while Anti-inflammatory (Omega-3) is taken Post-Dinner to ensure separate absorption windows.'
    );
  } else {
    if (wantsAntioxidants) {
      recs.push({
        id: 'antioxidant-solo',
        name: 'Antioxidant Complex (ALA + CoQ10 + Vit C + Vit E)',
        dosage: 'ALA 600 mg + CoQ10 400 mg + Vitamin C 1,000 mg + Vitamin E 600 IU',
        timing: 'Post-Dinner / Lunch',
        category: 'Antioxidant',
        status: 'Recommended',
        clinicalPurpose: 'Combats oxidative stress from smoking, alcohol, or frequent illness.',
        instructions: 'Take with a meal containing dietary fats for maximum CoQ10 and Vitamin E bioavailability.',
        icon: '🛡️',
      });
      postDinner.push('Antioxidant Complex (ALA 600mg + CoQ10 400mg + Vit C 1000mg + Vit E 600IU)');
    }

    if (wantsOmega3) {
      recs.push({
        id: 'omega-3-solo',
        name: 'Omega-3 Fish Oil (High EPA + DHA)',
        dosage: 'EPA + DHA 900 mg',
        timing: 'Post-Dinner / Bedtime',
        category: 'Anti-inflammatory',
        status: 'Recommended',
        clinicalPurpose: 'Reduces joint inflammation, lubricates synovial membranes, and accelerates recovery.',
        instructions: 'Take 900 mg active EPA + DHA after dinner or with bedtime water.',
        icon: '🐟',
      });
      postDinner.push('Omega-3 EPA+DHA (900 mg) — Post-Dinner / Bedtime');
    }
  }

  // --- 8. MUSCLE PAIN & SLEEP SUPPORT (MAGNESIUM) ---
  if ((answers.hasMusclePain || answers.hasSleepDifficulties) && answers.openToMagnesium) {
    recs.push({
      id: 'magnesium-glycinate',
      name: 'Magnesium Glycinate (Chelated)',
      dosage: '200 mg elemental magnesium',
      timing: 'Night / Post-Dinner / 30 mins before Bedtime',
      category: 'Muscle & Sleep',
      status: 'Recommended',
      clinicalPurpose: 'Relieves muscle cramps/pain, facilitates neuromuscular relaxation, and improves deep sleep architecture.',
      instructions: 'Take 200 mg at night after dinner. Non-laxative chelated form for superior neuromuscular absorption.',
      icon: '🌙',
    });
    bedtime.push('Magnesium Glycinate (200 mg) — Night / 30m Before Bed');
    combinationNotes.push(
      'Magnesium Glycinate (200 mg) is scheduled at bedtime for optimal muscle relaxation, soreness relief, and deeper sleep quality.'
    );
  }

  return {
    intensityTier,
    recommendations: recs,
    timingSummary: {
      postBreakfast: postBreakfast.length ? postBreakfast : undefined,
      morningEmptyStomach: morningEmptyStomach.length ? morningEmptyStomach : undefined,
      postLunch: postLunch.length ? postLunch : undefined,
      postWorkout: postWorkout.length ? postWorkout : undefined,
      postDinner: postDinner.length ? postDinner : undefined,
      bedtime: bedtime.length ? bedtime : undefined,
      separateCounselling: separateCounselling.length ? separateCounselling : undefined,
    },
    caffeineWarning,
    vitaminDNotice: 'Vitamin D3 must be determined by a doctor based on blood test results. Do not self-prescribe.',
    combinationNotes,
  };
}

/**
 * Saves client assessment and updates the active client supplement plan.
 */
export async function saveLifestyleAssessment(
  clientId: string,
  answers: LifestyleAssessmentAnswers,
  clientName: string = 'Client'
): Promise<LifestyleSupplementEvaluationResult> {
  const result = evaluateLifestyleSupplements(answers);

  // 1. LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + clientId, JSON.stringify(answers));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'result_' + clientId, JSON.stringify(result));
  } catch (e) {
    console.warn('LocalStorage save failed for lifestyle supplements:', e);
  }

  // 2. Firebase RTDB
  if (isFirebaseConfigured && database && clientId) {
    try {
      const sanitizedAnswers = JSON.parse(JSON.stringify(answers));
      const sanitizedResult = JSON.parse(JSON.stringify(result));
      await Promise.all([
        set(ref(database, `customers/${clientId}/lifestyleSupplementAssessment`), sanitizedAnswers),
        set(ref(database, `customers/${clientId}/lifestyleSupplementResult`), sanitizedResult),
        set(ref(database, `clients/${clientId}/lifestyleSupplementAssessment`), sanitizedAnswers),
      ]);
    } catch (e) {
      console.warn('Firebase RTDB save failed for lifestyle supplements:', e);
    }
  }

  // 3. Sync into formulaEngineService ClientSupplementPlan
  try {
    const existingPlan = getClientSupplementPlan(clientId);
    const convertedItems: ClientSupplementPlanItem[] = result.recommendations
      .filter((r) => r.status === 'Recommended' || r.status === 'Doctor-Directed')
      .map((r, idx) => ({
        supplementId: `supp_${idx + 1}_${r.id}`,
        supplementName: r.name,
        formulaId: `formula_${r.id}`,
        formulaVersion: 1,
        calculatedAmount: 1,
        unit: r.dosage,
        finalAmount: 1,
        frequency: 'Daily',
        timing: r.timing,
        duration: '12 Weeks',
        notes: `${r.clinicalPurpose}. ${r.instructions}`,
        isOverrideActive: false,
        updatedAt: Date.now(),
      }));

    if (convertedItems.length > 0) {
      saveClientSupplementPlan({
        ...existingPlan,
        clientId,
        clientName,
        items: convertedItems,
        updatedByAdminName: `Sneha Dey (${result.intensityTier})`,
        publishedAt: Date.now(),
        status: 'published',
      });
    }
  } catch (err) {
    console.warn('Sync to formulaEngineService failed:', err);
  }

  // Dispatch live update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lifestyle_supplements_updated', { detail: { clientId, result } }));
    window.dispatchEvent(new CustomEvent('supplement_plan_updated', { detail: { clientId } }));
  }

  return result;
}

/**
 * Loads client lifestyle assessment answers.
 */
export async function getLifestyleAssessment(
  clientId: string,
  defaultIntensity: LifestyleIntensityTier = 'Sedentary 1.5'
): Promise<LifestyleAssessmentAnswers> {
  // 1. Try Firebase RTDB
  if (isFirebaseConfigured && database && clientId) {
    try {
      const snapshot = await get(ref(database, `customers/${clientId}/lifestyleSupplementAssessment`));
      if (snapshot.exists()) {
        return snapshot.val() as LifestyleAssessmentAnswers;
      }
    } catch (e) {
      console.warn('Firebase get failed for lifestyle supplements:', e);
    }
  }

  // 2. LocalStorage Fallback
  try {
    const local = localStorage.getItem(STORAGE_KEY_PREFIX + clientId);
    if (local) {
      return JSON.parse(local) as LifestyleAssessmentAnswers;
    }
  } catch (e) {
    console.warn('LocalStorage read failed for lifestyle supplements:', e);
  }

  // 3. Default baseline
  return {
    intensityTier: defaultIntensity,
    anxietyLevel: 'Low',
    caffeinatedBeveragesPerDay: 1,
    feelsLowOnEnergy: true,
    openToErgogenicEnergy: true,
    hasConstipationOrFlatulence: false,
    openToBoneHealth: true,
    hasJointPain: false,
    hasMusclePain: false,
    openToMagnesium: true,
  };
}
