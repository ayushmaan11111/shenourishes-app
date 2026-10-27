/**
 * Phase 2 Supplement Calculation & Formula Engine Data Types
 * Supports editable formulas, versioning, body composition math, client-specific overrides, and testing.
 */

export interface FormulaCondition {
  field: 'activityIntensity' | 'dietType' | 'trainingGoal' | 'bodyFatPercent' | 'weightKg';
  operator: '===' | '>' | '<' | '>=' | '<=' | 'includes';
  value: string | number;
  multiplier?: number;
  fixedAddition?: number;
}

export interface FormulaVersionRecord {
  version: number;
  modifiedAt: number;
  modifiedBy: string;
  expression: string;
  variables: Record<string, number>;
  notes?: string;
}

export interface SupplementFormula {
  id: string;
  supplementId: string;
  supplementName: string;
  version: number;
  versionHistory?: FormulaVersionRecord[];
  category: string;
  targetUnit: string; // 'mg', 'g', 'mcg', 'CFU', 'scoops'
  formulaExpression: string; // e.g. "bodyWeight * multiplier" or "fatFreeMass * intensityFactor"
  variables: Record<string, number>; // e.g. { multiplier: 0.05, baseDose: 3 }
  conditions?: FormulaCondition[];
  minLimit: number;
  maxLimit: number;
  standardDosageDisplay: string;
  frequency: string;
  timing: string;
  duration: string;
  notes?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  modifiedBy: string;
}

export interface BodyCompositionProteinFormula {
  id: string;
  name: string;
  version: number;
  bodyFatPercentageDefault: number; // e.g. 22%
  intensityMultipliers: {
    sedentaryLowIntensity: number; // 1.5 g/kg FFM
    moderateIntensityMuscleGain: number; // 2.0 g/kg FFM
    highIntensityTraining: number; // 2.5 g/kg FFM
  };
  minProteinPerKg: number;
  maxProteinPerKg: number;
  updatedAt: number;
}

export interface ClientSupplementPlanItem {
  supplementId: string;
  supplementName: string;
  formulaId: string;
  formulaVersion: number;
  calculatedAmount: number;
  unit: string;
  adminOverrideAmount?: number; // Nutritionist manual override
  finalAmount: number; // adminOverrideAmount !== undefined ? adminOverrideAmount : calculatedAmount
  frequency: string;
  timing: string;
  duration: string;
  notes?: string;
  isOverrideActive: boolean;
  warningFlag?: string; // e.g. "Review Required: Exceeds safe limit"
  updatedAt: number;
}

export interface ClientBodyCompositionResult {
  bodyWeightKg: number;
  bodyFatPercent: number;
  fatMassKg: number;
  fatFreeMassKg: number;
  intensityLevel: string;
  intensityMultiplier: number;
  proteinRequirementGramsPerDay: number;
}

export interface ClientSupplementPlan {
  clientId: string;
  clientName: string;
  items: ClientSupplementPlanItem[];
  bodyComposition?: ClientBodyCompositionResult;
  status: 'published' | 'draft';
  publishedAt: number;
  updatedByAdminName?: string;
}
