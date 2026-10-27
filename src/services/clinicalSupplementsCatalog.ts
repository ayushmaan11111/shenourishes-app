/**
 * Clinical Supplement Stacks Catalog (Extracted exactly from Nutrition Planning PDFs)
 * Source: School of Fitness Sciences - Suggested Supplemented Stack
 */

export interface ClinicalSupplementItem {
  id: string;
  srNo: number;
  category: 'Bone Health' | 'Antioxidants' | 'Insulin Mimicker' | 'Anti-Inflammatory' | 'Amino Acids' | 'Ergogenic Aids';
  name: string;
  dosageAndTime: string;
  bestBioavailableForm: string;
  clinicalPurpose: string;
  timingCategory: 'Post Breakfast' | 'Post Lunch' | 'Post Workout' | 'Bedtime' | 'Before Meals / Workout' | 'Empty Stomach' | 'Anytime';
}

export const CLINICAL_SUPPLEMENTS_CATALOG: ClinicalSupplementItem[] = [
  // --- Category 1: Bone Health ---
  {
    id: 'supp_calcium',
    srNo: 1,
    category: 'Bone Health',
    name: 'Calcium',
    dosageAndTime: '1000 mg of Elemental Calcium/day. Divided into two dosages: a) 500 mg Post Breakfast, b) 500 mg Post Lunch',
    bestBioavailableForm: 'Calcium Citrate Malate (CCM)',
    clinicalPurpose: 'Bone mineral density, muscle contraction & skeletal structural support.',
    timingCategory: 'Post Breakfast',
  },
  {
    id: 'supp_vit_d3',
    srNo: 2,
    category: 'Bone Health',
    name: 'Vitamin D3',
    dosageAndTime: 'Supplementation as per Doctor’s advice (Typically 2000–5000 IU/day or 60k IU weekly)',
    bestBioavailableForm: 'Cholecalciferol (Oil-based softgel)',
    clinicalPurpose: 'Calcium absorption, immune function & endocrine hormone synthesis.',
    timingCategory: 'Post Breakfast',
  },
  {
    id: 'supp_vit_k2',
    srNo: 3,
    category: 'Bone Health',
    name: 'Vitamin K2',
    dosageAndTime: '400 mcg/day. Divided into two dosages: a) 200 mcg Post Breakfast, b) 200 mcg Post Lunch',
    bestBioavailableForm: 'Menaquinone-7 (MK-7)',
    clinicalPurpose: 'Directs calcium into bones and teeth, preventing arterial calcification.',
    timingCategory: 'Post Breakfast',
  },
  {
    id: 'supp_calcium_stack',
    srNo: 4,
    category: 'Bone Health',
    name: 'Calcium Stack (CCM + Vit K2-MK7)',
    dosageAndTime: '500 mg Elemental Calcium (CCM) + 200 mcg Vit. K2-MK7 twice a day: a) Post Breakfast, b) Post Lunch',
    bestBioavailableForm: 'Calcium Citrate Malate + MK-7',
    clinicalPurpose: 'Synergistic bone remodeling and vascular arterial protection.',
    timingCategory: 'Post Breakfast',
  },
  {
    id: 'supp_magnesium',
    srNo: 5,
    category: 'Bone Health',
    name: 'Magnesium',
    dosageAndTime: '100–200 mg Elemental Magnesium/day. Taken at Bedtime',
    bestBioavailableForm: 'Magnesium Citrate / Magnesium Glycinate',
    clinicalPurpose: 'Neuromuscular relaxation, sleep quality & cramp prevention.',
    timingCategory: 'Bedtime',
  },

  // --- Category 2: Antioxidants ---
  {
    id: 'supp_ala_antioxidant',
    srNo: 6,
    category: 'Antioxidants',
    name: 'Alpha Lipoic Acid (ALA)',
    dosageAndTime: '300–600 mg/day; as an Antioxidant taken Post-workout or at Bedtime',
    bestBioavailableForm: 'R-ALA / Alpha Lipoic Acid',
    clinicalPurpose: 'Universal antioxidant neutralizing reactive oxygen species in water & lipid phases.',
    timingCategory: 'Post Workout',
  },
  {
    id: 'supp_coq10',
    srNo: 7,
    category: 'Antioxidants',
    name: 'CoQ10 (Coenzyme Q10)',
    dosageAndTime: '200–400 mg/day; as an Antioxidant taken Post-workout or at Bedtime',
    bestBioavailableForm: 'Ubiquinone / Ubiquinol',
    clinicalPurpose: 'Mitochondrial cellular bioenergetics (ATP synthesis) and cardiovascular protection.',
    timingCategory: 'Post Workout',
  },
  {
    id: 'supp_vit_c',
    srNo: 8,
    category: 'Antioxidants',
    name: 'Vitamin C (Ascorbic Acid)',
    dosageAndTime: '2–4 g/day; divided into 2 to 4 one-g doses through the day. Can be given Post-Workout or Bedtime',
    bestBioavailableForm: 'Ascorbic Acid with Citrus Bioflavonoids & Rose Hips',
    clinicalPurpose: 'Collagen synthesis, immune defense, and lipid peroxidation inhibition.',
    timingCategory: 'Post Workout',
  },
  {
    id: 'supp_vit_e',
    srNo: 9,
    category: 'Antioxidants',
    name: 'Vitamin E',
    dosageAndTime: '600–800 IU/day; taken as a single dose Post-Workout or Bedtime',
    bestBioavailableForm: 'D-Alpha Tocopherol',
    clinicalPurpose: 'Protects cell membranes from oxidative stress and enhances skin barrier recovery.',
    timingCategory: 'Bedtime',
  },
  {
    id: 'supp_antioxidant_stack',
    srNo: 10,
    category: 'Antioxidants',
    name: 'Antioxidant Stack (ALA + CoQ10 + Vit C + Vit E)',
    dosageAndTime: 'ALA 600mg + CoQ10 400mg + Vitamin C 1000mg + Vitamin E 600 IU; taken Post-Workout or at Bedtime',
    bestBioavailableForm: 'R-ALA + Ubiquinone + Ascorbic Acid + D-Alpha Tocopherol',
    clinicalPurpose: 'Comprehensive multi-tier cellular defense against systemic oxidative damage.',
    timingCategory: 'Bedtime',
  },

  // --- Category 3: Insulin Mimicker ---
  {
    id: 'supp_ala_insulin',
    srNo: 11,
    category: 'Insulin Mimicker',
    name: 'Alpha Lipoic Acid (ALA) - Insulin Mimicker',
    dosageAndTime: '600–1200 mg/day as an Insulin Mimicker (Divided before carbohydrate meals)',
    bestBioavailableForm: 'Alpha Lipoic Acid',
    clinicalPurpose: 'Enhances GLUT4 glucose transporter translocation, improving insulin sensitivity.',
    timingCategory: 'Before Meals / Workout',
  },

  // --- Category 4: Anti-Inflammatory ---
  {
    id: 'supp_omega3',
    srNo: 12,
    category: 'Anti-Inflammatory',
    name: 'Fish Oil / Algal Oil Omega-3 Fatty Acids',
    dosageAndTime: 'Regular Strength: 1g fish oil yields 180mg EPA + 120mg DHA (Total 300mg). Triple Strength: ~900mg/day EPA + DHA. Time: Anytime of day',
    bestBioavailableForm: 'EPA + DHA (Molecularly distilled / Algal oil for vegetarians)',
    clinicalPurpose: 'Suppresses inflammatory cytokines (IL-6, TNF-a), supports lipid profile & joints.',
    timingCategory: 'Anytime',
  },
  {
    id: 'supp_curcumin',
    srNo: 13,
    category: 'Anti-Inflammatory',
    name: 'Curcumin (Turmeric Extract)',
    dosageAndTime: '1 to 3 g/day post meals, post workout, and bedtime (Supplements with 95% curcuminoids suggested)',
    bestBioavailableForm: 'Curcumin 95% Curcuminoids (with Piperine / BioPerine)',
    clinicalPurpose: 'Potent COX-2 inhibition, reducing systemic inflammation and joint soreness.',
    timingCategory: 'Post Lunch',
  },

  // --- Category 5: Amino Acids ---
  {
    id: 'supp_leucine',
    srNo: 14,
    category: 'Amino Acids',
    name: 'L-Leucine',
    dosageAndTime: '5–20 g/day; 5 g per dose with meals (Promotes mTOR muscle protein synthesis)',
    bestBioavailableForm: 'L-Leucine (Free-form fermented)',
    clinicalPurpose: 'Activates mTOR signaling pathway for lean muscle hypertrophy and prevents catabolism.',
    timingCategory: 'Post Workout',
  },
  {
    id: 'supp_carnitine',
    srNo: 15,
    category: 'Amino Acids',
    name: 'L-Carnitine / Acetyl L-Carnitine',
    dosageAndTime: '3g–6g/day; 1000–2000 mg per dose, 2–3 times a day. Before meals &/or before Workouts',
    bestBioavailableForm: 'Acetyl L-Carnitine or L-Carnitine L-Tartrate',
    clinicalPurpose: 'Transports long-chain fatty acids into mitochondria for beta-oxidation & clean energy.',
    timingCategory: 'Before Meals / Workout',
  },

  // --- Category 6: Ergogenic Aids ---
  {
    id: 'supp_beta_alanine_citrulline',
    srNo: 16,
    category: 'Ergogenic Aids',
    name: 'Beta-Alanine & Citrulline Stack',
    dosageAndTime: '6 g/day of each on empty stomach in 2–3 divided doses: a) First thing in the morning, b) 30 mins before Lunch or Dinner, c) Post-Workout',
    bestBioavailableForm: 'L-Citrulline / Citrulline Malate + Beta-Alanine',
    clinicalPurpose: 'Nitric oxide vasodilation, blood flow delivery & muscle carnosine buffering against fatigue.',
    timingCategory: 'Empty Stomach',
  },
];
