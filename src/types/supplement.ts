/**
 * Supplements, Clinical Protocols, and Schedule Types for She Nourishes (Phase 2)
 */

export type SupplementCategory =
  | 'Essential Vitamins & Minerals'
  | 'Hormonal & Thyroid Support'
  | 'Gut Health & Probiotics'
  | 'Muscle Recovery & Performance'
  | 'Joint, Bone & Collagen Support'
  | 'Sleep & Stress Relief'
  | 'Metabolic & Blood Sugar Stability';

export type SupplementTiming =
  | 'With Breakfast'
  | 'Mid-Morning'
  | 'Pre-Workout'
  | 'Post-Workout'
  | 'With Lunch'
  | 'Evening'
  | 'With Dinner'
  | 'Before Bed';

export interface SupplementItem {
  id: string;
  name: string;
  category: SupplementCategory;
  standardDosage: string; // e.g. "5000 IU", "500mg", "1 scoop (30g)"
  unit: string; // e.g. "capsule", "tablet", "powder / grams", "drops"
  preferredTiming: SupplementTiming;
  clinicalPurpose: string; // e.g. "Supports bone density and calcium absorption"
  recommendedBrandOrForm?: string; // e.g. "Vitamin D3 + K2 (MK-7)"
  contraindications?: string[];
}

export interface ClientAssignedSupplement {
  id: string;
  clientId: string;
  supplementId: string;
  name: string;
  dosage: string;
  timing: SupplementTiming;
  purpose: string;
  prescribedByAdminId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
}
