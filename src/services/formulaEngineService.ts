/**
 * Supplement Calculation & Formula Engine Service
 * Implements the exact body composition formulas, supplement equations, versioning, and client override system.
 * Persists live data directly to Firebase Realtime Database.
 */

import { ref, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import type {
  SupplementFormula,
  BodyCompositionProteinFormula,
  ClientSupplementPlan,
  ClientSupplementPlanItem,
  ClientBodyCompositionResult,
} from '../types/formulaEngine';
import type { CustomerRecord } from '../types/customer';

// --- 1. DEFAULT BODY COMPOSITION & PROTEIN FORMULA ---
export const DEFAULT_BODY_COMPOSITION_FORMULA: BodyCompositionProteinFormula = {
  id: 'formula_body_composition_protein_v1',
  name: 'Body Composition → Protein Requirement Engine',
  version: 1,
  bodyFatPercentageDefault: 24, // Clinical baseline for standard evaluation
  intensityMultipliers: {
    sedentaryLowIntensity: 1.5, // Sedentary / Low Intensity: FFM * 1.5
    moderateIntensityMuscleGain: 2.0, // Moderate Intensity / Muscle Gain: FFM * 2.0
    highIntensityTraining: 2.5, // High Intensity Training: FFM * 2.5
  },
  minProteinPerKg: 1.2,
  maxProteinPerKg: 3.2,
  updatedAt: Date.now(),
};

// --- 2. DEFAULT EDITABLE SUPPLEMENT FORMULAS DATABASE ---
export const DEFAULT_SUPPLEMENT_FORMULAS: SupplementFormula[] = [
  {
    id: 'form_creatine_mono',
    supplementId: 'supp_creatine_monohydrate',
    supplementName: 'Creatine Monohydrate',
    version: 1,
    category: 'Power & Strength',
    targetUnit: 'g',
    formulaExpression: 'Math.min(5, Math.max(3, Math.round((bodyWeight * multiplier) * 10) / 10))',
    variables: { multiplier: 0.05 },
    minLimit: 3,
    maxLimit: 10,
    standardDosageDisplay: '3g – 5g daily',
    frequency: 'Once Daily',
    timing: 'Post-Workout or Morning with water/carbs',
    duration: 'Ongoing Daily',
    notes: 'Replenishes cellular phosphocreatine (ATP) for explosive strength and lean muscle mass.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_caffeine_anhydrous',
    supplementId: 'supp_caffeine_anhydrous',
    supplementName: 'Caffeine Anhydrous',
    version: 1,
    category: 'Performance & Alertness',
    targetUnit: 'mg',
    formulaExpression: 'Math.min(250, Math.max(100, Math.round(bodyWeight * multiplier)))',
    variables: { multiplier: 2.0 },
    minLimit: 50,
    maxLimit: 300,
    standardDosageDisplay: '100mg – 200mg',
    frequency: 'Training Days Only',
    timing: '20–30 mins Pre-Workout',
    duration: 'Pre-workout as needed',
    notes: 'Central nervous system stimulant for alertness, reaction speed and training drive.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_beta_alanine',
    supplementId: 'supp_beta_alanine',
    supplementName: 'Beta-Alanine',
    version: 1,
    category: 'Endurance & Lactic Buffer',
    targetUnit: 'g',
    formulaExpression: 'Math.min(6.4, Math.max(3.2, Math.round((fatFreeMass * multiplier) * 10) / 10))',
    variables: { multiplier: 0.065 },
    minLimit: 2.0,
    maxLimit: 6.4,
    standardDosageDisplay: '3.2g – 6.4g daily',
    frequency: 'Daily (Split into 2 doses if tingling occurs)',
    timing: 'Pre-Workout / Morning & Evening',
    duration: '8–12 Weeks Cycle',
    notes: 'Elevates muscle carnosine to buffer intramuscular acidity and delay high-rep fatigue.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_l_citrulline',
    supplementId: 'supp_l_citrulline',
    supplementName: 'L-Citrulline / Citrulline Malate',
    version: 1,
    category: 'Vascularity & Nitric Oxide',
    targetUnit: 'g',
    formulaExpression: '6.0',
    variables: { baseDose: 6.0 },
    minLimit: 4.0,
    maxLimit: 10.0,
    standardDosageDisplay: '6g – 8g',
    frequency: 'Training Days Only',
    timing: '30 mins Pre-Workout',
    duration: 'Pre-workout as needed',
    notes: 'Stimulates nitric oxide synthesis, vasodilation, blood flow and muscle pump.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_l_leucine',
    supplementId: 'supp_leucine',
    supplementName: 'L-Leucine',
    version: 1,
    category: 'Anabolic Muscle Trigger',
    targetUnit: 'g',
    formulaExpression: '3.5',
    variables: { baseDose: 3.5 },
    minLimit: 2.0,
    maxLimit: 6.0,
    standardDosageDisplay: '3g – 5g',
    frequency: '1–2 times daily',
    timing: 'With lower-protein meals or Pre/Post workout',
    duration: 'Ongoing',
    notes: 'Potent amino acid trigger that activates mTOR kinase pathway for muscle protein synthesis.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_calcium_citrate_malate',
    supplementId: 'supp_calcium_citrate_malate',
    supplementName: 'Calcium Citrate Malate',
    version: 1,
    category: 'Bone Health',
    targetUnit: 'mg',
    formulaExpression: 'Math.min(1000, Math.max(500, Math.round(baseDailyTarget)))',
    variables: { baseDailyTarget: 500 },
    minLimit: 250,
    maxLimit: 1200,
    standardDosageDisplay: '500mg – 1000mg elemental calcium',
    frequency: '1–2 times daily',
    timing: 'With Meals (Breakfast & Dinner)',
    duration: 'Ongoing Protocol',
    notes: 'Superior bioavailability calcium chelate for bone mineral density and joint architecture.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_vitamin_k2_mk7',
    supplementId: 'supp_vitamin_k2_mk7',
    supplementName: 'Vitamin K2 MK-7',
    version: 1,
    category: 'Bone / Cardiovascular Support',
    targetUnit: 'mcg',
    formulaExpression: 'Math.min(100, Math.max(55, Math.round(dailyDoseMicrograms)))',
    variables: { dailyDoseMicrograms: 55 },
    minLimit: 45,
    maxLimit: 200,
    standardDosageDisplay: '55mcg – 100mcg',
    frequency: 'Once Daily',
    timing: 'With Breakfast / Fat-containing meal',
    duration: 'Ongoing Protocol',
    notes: 'Activates osteocalcin to direct calcium directly into bone matrix rather than arteries.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_magnesium_glycinate',
    supplementId: 'supp_magnesium_glycinate',
    supplementName: 'Magnesium Glycinate',
    version: 1,
    category: 'Sleep & Muscle Relaxation',
    targetUnit: 'mg',
    formulaExpression: 'Math.min(400, Math.max(200, Math.round(elementalDose)))',
    variables: { elementalDose: 250 },
    minLimit: 100,
    maxLimit: 500,
    standardDosageDisplay: '200mg – 400mg elemental magnesium',
    frequency: 'Once Daily',
    timing: '30–60 mins Before Bed',
    duration: 'Nightly',
    notes: 'Chelated magnesium for neuromuscular relaxation, cramp prevention and deep delta sleep.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_omega3',
    supplementId: 'supp_omega3_epa_dha',
    supplementName: 'Omega-3 Fatty Acids (EPA & DHA)',
    version: 1,
    category: 'Joint & Cardiovascular Health',
    targetUnit: 'mg',
    formulaExpression: 'Math.min(2000, Math.max(1000, Math.round(targetEpaDha)))',
    variables: { targetEpaDha: 1000 },
    minLimit: 500,
    maxLimit: 3000,
    standardDosageDisplay: '1000mg – 2000mg combined EPA/DHA',
    frequency: 'Once Daily',
    timing: 'With Lunch or Dinner',
    duration: 'Ongoing',
    notes: 'Essential fatty acids for joint lubrication, synovial integrity and anti-inflammatory balance.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_probiotics',
    supplementId: 'supp_probiotics',
    supplementName: 'Multi-Strain Probiotics',
    version: 1,
    category: 'Gut Microbiome Health',
    targetUnit: 'Billion CFU',
    formulaExpression: '20',
    variables: { targetCfu: 20 },
    minLimit: 5,
    maxLimit: 50,
    standardDosageDisplay: '10 – 30 Billion CFU (2g)',
    frequency: 'Once Daily',
    timing: 'Morning on empty stomach or before bed',
    duration: '4–8 Weeks Protocol',
    notes: 'Live clinical strains to support gut motility, relieve constipation and balance microflora.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_carnitine',
    supplementId: 'supp_l_carnitine',
    supplementName: 'L-Carnitine / Acetyl L-Carnitine',
    version: 1,
    category: 'Metabolic & Fatty Acid Transport',
    targetUnit: 'mg',
    formulaExpression: 'Math.min(2000, Math.max(1000, Math.round(bodyWeight * multiplier)))',
    variables: { multiplier: 20 },
    minLimit: 500,
    maxLimit: 3000,
    standardDosageDisplay: '1000mg – 2000mg',
    frequency: '1–2 times daily',
    timing: '20 mins Pre-Meal or Pre-Activity',
    duration: 'Ongoing',
    notes: 'Mitochondrial transporter facilitating fatty acid oxidation and cellular energy output.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
  {
    id: 'form_antioxidant_complex',
    supplementId: 'supp_antioxidant_complex',
    supplementName: 'Antioxidant Defense (ALA + CoQ10 + Vit C + Vit E)',
    version: 1,
    category: 'Cellular Immunity & Defense',
    targetUnit: 'serving',
    formulaExpression: '1',
    variables: { servingSize: 1 },
    minLimit: 1,
    maxLimit: 2,
    standardDosageDisplay: 'ALA 600mg + CoQ10 400mg + Vit C 1000mg + Vit E 600IU',
    frequency: 'Once Daily',
    timing: 'With Morning / Afternoon meal',
    duration: 'Ongoing Protocol',
    notes: 'Synergistic cellular defense neutralizing reactive oxygen species and oxidative stress.',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modifiedBy: 'Clinical Nutrition System',
  },
];

const STORAGE_KEY_FORMULAS = 'she_nourishes_supplement_formulas_v2';
const STORAGE_KEY_BODY_COMP_FORMULA = 'she_nourishes_body_comp_formula_v2';
const STORAGE_KEY_CLIENT_SUPPLEMENT_PLAN = 'she_nourishes_client_supplement_plan_';

// --- 3. STORAGE GETTERS & SETTERS (WITH REALTIME FIREBASE SYNC) ---

export function getBodyCompositionFormula(): BodyCompositionProteinFormula {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BODY_COMP_FORMULA);
    if (raw) return JSON.parse(raw) as BodyCompositionProteinFormula;
  } catch (e) {
    console.warn('Error reading body composition formula:', e);
  }
  return DEFAULT_BODY_COMPOSITION_FORMULA;
}

export function saveBodyCompositionFormula(formula: BodyCompositionProteinFormula): void {
  try {
    const updated = { ...formula, version: formula.version + 1, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY_BODY_COMP_FORMULA, JSON.stringify(updated));

    // Live Firebase sync
    if (isFirebaseConfigured && database) {
      set(ref(database, 'config/bodyCompositionFormula'), updated).catch((err) => {
        console.warn('Firebase RTDB formula save warning:', err);
      });
    }
  } catch (e) {
    console.error('Error saving body composition formula:', e);
  }
}

export function getAllSupplementFormulas(): SupplementFormula[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FORMULAS);
    if (raw) return JSON.parse(raw) as SupplementFormula[];
  } catch (e) {
    console.warn('Error reading supplement formulas:', e);
  }
  return DEFAULT_SUPPLEMENT_FORMULAS;
}

export function saveSupplementFormula(formula: SupplementFormula, modifiedBy = 'Admin Nutritionist'): SupplementFormula {
  const current = getAllSupplementFormulas();
  const existingIdx = current.findIndex((f) => f.id === formula.id);

  const historyRecord = {
    version: formula.version,
    modifiedAt: Date.now(),
    modifiedBy,
    expression: formula.formulaExpression,
    variables: { ...formula.variables },
    notes: formula.notes,
  };

  const updated: SupplementFormula = {
    ...formula,
    version: formula.version + 1,
    versionHistory: [...(formula.versionHistory || []), historyRecord],
    updatedAt: Date.now(),
    modifiedBy,
  };

  if (existingIdx >= 0) {
    current[existingIdx] = updated;
  } else {
    current.push(updated);
  }

  localStorage.setItem(STORAGE_KEY_FORMULAS, JSON.stringify(current));

  // Live Firebase sync
  if (isFirebaseConfigured && database) {
    set(ref(database, `config/supplementFormulas/${formula.id}`), updated).catch((err) => {
      console.warn('Firebase RTDB supplement formula save warning:', err);
    });
  }

  return updated;
}

// --- 4. MATHEMATICAL CALCULATION ENGINE ---

export function calculateBodyCompositionAndProtein(
  bodyWeightKg: number,
  bodyFatPercent?: number,
  intensityLevel = 'Sedentary'
): ClientBodyCompositionResult {
  const formulaConfig = getBodyCompositionFormula();
  const safeWeight = Math.max(30, bodyWeightKg || 65);
  const safeFatPercent = Math.min(60, Math.max(8, bodyFatPercent ?? formulaConfig.bodyFatPercentageDefault));

  // 1. Fat Mass (kg)
  const fatMassKg = Math.round(((safeWeight * safeFatPercent) / 100) * 10) / 10;

  // 2. Fat-Free Mass (kg)
  const fatFreeMassKg = Math.round((safeWeight - fatMassKg) * 10) / 10;

  // 3. Intensity Multiplier resolution
  let multiplier = formulaConfig.intensityMultipliers.sedentaryLowIntensity; // Default 1.5
  if (
    intensityLevel === 'Active at Gym' ||
    intensityLevel === "Extremely Active Player's" ||
    intensityLevel === 'Extremely Active'
  ) {
    multiplier = formulaConfig.intensityMultipliers.highIntensityTraining; // 2.5
  } else if (intensityLevel === 'Moderately Active' || intensityLevel === 'Moderate') {
    multiplier = formulaConfig.intensityMultipliers.moderateIntensityMuscleGain; // 2.0
  }

  // 3. Protein Requirement (g/day)
  const rawProtein = fatFreeMassKg * multiplier;
  const proteinRequirementGramsPerDay = Math.round(rawProtein);

  return {
    bodyWeightKg: safeWeight,
    bodyFatPercent: safeFatPercent,
    fatMassKg,
    fatFreeMassKg,
    intensityLevel,
    intensityMultiplier: multiplier,
    proteinRequirementGramsPerDay,
  };
}

export function evaluateSupplementFormula(
  formula: SupplementFormula,
  inputs: {
    bodyWeight: number;
    fatFreeMass: number;
    bodyFatPercent?: number;
    intensityLevel?: string;
    proteinRequirement?: number;
  }
): { calculatedAmount: number; warningFlag?: string; unit: string } {
  try {
    const { bodyWeight, fatFreeMass, bodyFatPercent = 22, proteinRequirement = 120 } = inputs;
    const vars = formula.variables || {};

    const context = {
      bodyWeight: Math.max(1, bodyWeight),
      fatFreeMass: Math.max(1, fatFreeMass),
      bodyFatPercent,
      proteinRequirement,
      Math,
      ...vars,
    };

    const argNames = Object.keys(context);
    const argValues = Object.values(context);
    const func = new Function(...argNames, `return (${formula.formulaExpression});`);
    const rawResult = func(...argValues);

    let calculatedAmount = typeof rawResult === 'number' && !isNaN(rawResult) ? rawResult : formula.minLimit;
    let warningFlag: string | undefined = undefined;

    if (calculatedAmount < formula.minLimit) {
      warningFlag = `Value below standard minimum (${formula.minLimit} ${formula.targetUnit}). Clamped to minimum.`;
      calculatedAmount = formula.minLimit;
    } else if (calculatedAmount > formula.maxLimit) {
      warningFlag = `Review Required: Exceeds safe maximum limit (${formula.maxLimit} ${formula.targetUnit}).`;
      calculatedAmount = formula.maxLimit;
    }

    calculatedAmount = formula.targetUnit === 'g' || formula.targetUnit === 'serving'
      ? Math.round(calculatedAmount * 10) / 10
      : Math.round(calculatedAmount);

    return { calculatedAmount, warningFlag, unit: formula.targetUnit };
  } catch (error) {
    console.warn(`Formula execution error for ${formula.supplementName}:`, error);
    return {
      calculatedAmount: formula.minLimit,
      warningFlag: 'Syntax Error in formula expression. Clamped to minimum.',
      unit: formula.targetUnit,
    };
  }
}

// --- 5. CLIENT SUPPLEMENT PLAN PERSISTENCE (FIREBASE REALTIME DB) ---

export function getClientSupplementPlan(clientId: string, customerRecord?: CustomerRecord | null): ClientSupplementPlan {
  const storageKey = STORAGE_KEY_CLIENT_SUPPLEMENT_PLAN + clientId;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw) as ClientSupplementPlan;
    }
  } catch (e) {
    console.warn('Error reading client supplement plan:', e);
  }

  // Generate fresh plan from client's biometric inputs & goals
  const rawWeight = customerRecord?.personalDetails?.weight;
  const weightKg = typeof rawWeight === 'number' ? rawWeight : parseFloat(String(rawWeight || '68')) || 68;
  const intensityLevel = customerRecord?.physicalActivity?.currentActivityLevel || 'Sedentary';
  
  const bodyComp = calculateBodyCompositionAndProtein(weightKg, 24, intensityLevel);
  const allFormulas = getAllSupplementFormulas().filter((f) => f.isActive);

  const selectedGoals = customerRecord?.goalAssessment?.primaryGoals || ['Bone Health Support', 'Better Sleep'];
  const hasLeucine = selectedGoals.some((g) => g.toLowerCase().includes('leucine') || g.toLowerCase().includes('muscle gain'));

  const items: ClientSupplementPlanItem[] = allFormulas.map((form) => {
    if (hasLeucine && form.supplementName.toLowerCase().includes('whey')) {
      // Leucine precedence
    }

    const { calculatedAmount, warningFlag, unit } = evaluateSupplementFormula(form, {
      bodyWeight: bodyComp.bodyWeightKg,
      fatFreeMass: bodyComp.fatFreeMassKg,
      bodyFatPercent: bodyComp.bodyFatPercent,
      intensityLevel: bodyComp.intensityLevel,
      proteinRequirement: bodyComp.proteinRequirementGramsPerDay,
    });

    return {
      supplementId: form.supplementId,
      supplementName: form.supplementName,
      formulaId: form.id,
      formulaVersion: form.version,
      calculatedAmount,
      unit,
      adminOverrideAmount: undefined,
      finalAmount: calculatedAmount,
      frequency: form.frequency,
      timing: form.timing,
      duration: form.duration,
      notes: form.notes,
      isOverrideActive: false,
      warningFlag,
      updatedAt: Date.now(),
    };
  });

  const plan: ClientSupplementPlan = {
    clientId,
    clientName: customerRecord?.personalDetails?.fullName || 'Client',
    items,
    bodyComposition: bodyComp,
    status: 'published',
    publishedAt: Date.now(),
    updatedByAdminName: 'Clinical Nutrition Desk',
  };

  saveClientSupplementPlan(plan);
  return plan;
}

export function saveClientSupplementPlan(plan: ClientSupplementPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY_CLIENT_SUPPLEMENT_PLAN + plan.clientId, JSON.stringify(plan));
    localStorage.setItem(STORAGE_KEY_CLIENT_SUPPLEMENT_PLAN + 'default', JSON.stringify(plan));

    // Live Firebase Realtime Database persistence
    if (isFirebaseConfigured && database && plan.clientId) {
      set(ref(database, `customers/${plan.clientId}/supplementPlan`), plan).catch((err) => {
        console.warn('Firebase RTDB customer supplement plan write warning:', err);
      });
      set(ref(database, `supplementPlans/${plan.clientId}`), plan).catch((err) => {
        console.warn('Firebase RTDB global supplement plan write warning:', err);
      });
    }
  } catch (e) {
    console.error('Error saving client supplement plan:', e);
  }
}

export function updateClientSupplementOverride(
  clientId: string,
  supplementId: string,
  overrideAmount: number,
  notes?: string
): ClientSupplementPlan {
  const plan = getClientSupplementPlan(clientId);
  const updatedItems = plan.items.map((item) => {
    if (item.supplementId === supplementId) {
      return {
        ...item,
        adminOverrideAmount: overrideAmount,
        finalAmount: overrideAmount,
        isOverrideActive: true,
        notes: notes ?? item.notes,
        updatedAt: Date.now(),
      };
    }
    return item;
  });

  const updatedPlan: ClientSupplementPlan = { ...plan, items: updatedItems, publishedAt: Date.now() };
  saveClientSupplementPlan(updatedPlan);
  return updatedPlan;
}

export function resetClientSupplementOverride(clientId: string, supplementId: string): ClientSupplementPlan {
  const plan = getClientSupplementPlan(clientId);
  const updatedItems = plan.items.map((item) => {
    if (item.supplementId === supplementId) {
      return {
        ...item,
        adminOverrideAmount: undefined,
        finalAmount: item.calculatedAmount,
        isOverrideActive: false,
        updatedAt: Date.now(),
      };
    }
    return item;
  });

  const updatedPlan: ClientSupplementPlan = { ...plan, items: updatedItems, publishedAt: Date.now() };
  saveClientSupplementPlan(updatedPlan);
  return updatedPlan;
}
