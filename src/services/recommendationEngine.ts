/**
 * Dynamic Goal & Recommendation Engine for She Nourishes
 * 
 * Strict Architectural Rule:
 * Recommendations are derived dynamically from database-configured rules.
 * Duplicates are merged, and recommendations support multiple types (SUPPLEMENT, DIET STRATEGY, etc.).
 * Custom goals are flagged for Admin Review.
 */

import type {
  GoalDefinition,
  SupplementEntity,
  RecommendationRule,
  GeneratedRecommendation,
  CustomGoalItem,
} from '../types/recommendations';

// --- 1. DEFAULT PRECONFIGURED GOALS DATABASE ---
export const DEFAULT_GOALS_DATABASE: GoalDefinition[] = [
  // Moderate Activity Goals (Extracted from /Moderate 13 Goals To Achieve Card)
  {
    id: 'goal_mod_energy_focus',
    name: 'Energy Focus, Attentiveness, Extra Kick for Workout',
    description: 'Improve focus, mental clarity and get an extra kick to power through your workouts.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_energy_focus_kick',
    iconType: 'vector',
    priority: 1,
    isActive: true,
  },
  {
    id: 'goal_mod_power_strength',
    name: 'Power and Strength Performance',
    description: 'Increase strength, power and performance to achieve your fitness goals.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_muscle_gain',
    iconType: 'vector',
    priority: 2,
    isActive: true,
  },
  {
    id: 'goal_mod_vascularity',
    name: 'Vascularity, Improve Performance, Muscle Cramp, Muscle Pump',
    description: 'Enhance vascularity, improve performance, reduce muscle cramps and achieve better muscle pump.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_vascularity_pump',
    iconType: 'vector',
    priority: 3,
    isActive: true,
  },
  {
    id: 'goal_mod_endurance',
    name: 'Improve Endurance, Delay Fatigue',
    description: 'Enhance endurance and delay fatigue for longer and more effective workouts.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_endurance_delay_fatigue',
    iconType: 'vector',
    priority: 4,
    isActive: true,
  },
  {
    id: 'goal_mod_meal_replacer',
    name: 'Meal Replacer (Busy Schedule)',
    description: 'Use a convenient, balanced meal replacer to support your nutrition and goals.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_meal_replacer',
    iconType: 'vector',
    priority: 5,
    isActive: true,
  },
  {
    id: 'goal_mod_insufficient_protein',
    name: 'Insufficient Protein Intake',
    description: 'Improve protein intake to support muscle growth, recovery and overall health.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_insufficient_protein',
    iconType: 'vector',
    priority: 6,
    isActive: true,
  },
  {
    id: 'goal_mod_fat_loss',
    name: 'Fat Loss (Moderate Output)',
    description: 'Reduce body fat and achieve a lean, healthy body composition.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_fat_loss',
    iconType: 'vector',
    priority: 7,
    isActive: true,
  },
  {
    id: 'goal_mod_poor_immunity',
    name: 'Poor Immunity',
    description: 'Strengthen immunity and stay healthy, resistant to common illnesses.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_poor_immunity',
    iconType: 'vector',
    priority: 8,
    isActive: true,
  },
  {
    id: 'goal_mod_busy_lifestyle',
    name: 'Busy Lifestyle, Skips Meals Often',
    description: 'Build better eating habits and maintain consistency despite a busy schedule.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_busy_lifestyle_meal_skips',
    iconType: 'vector',
    priority: 9,
    isActive: true,
  },
  {
    id: 'goal_mod_joint_pain',
    name: 'Joint Pain',
    description: 'Reduce joint pain and improve mobility for a pain-free active life.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_joint_pain',
    iconType: 'vector',
    priority: 10,
    isActive: true,
  },
  {
    id: 'goal_mod_better_sleep',
    name: 'Better Sleep',
    description: 'Improve sleep quality and wake up refreshed and active.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_better_sleep',
    iconType: 'vector',
    priority: 11,
    isActive: true,
  },
  {
    id: 'goal_mod_muscle_cramps',
    name: 'Frequency of Muscle Cramps',
    description: 'Reduce the frequency of muscle cramps and support faster recovery.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_reduce_muscle_cramps',
    iconType: 'vector',
    priority: 12,
    isActive: true,
  },
  {
    id: 'goal_mod_constipation_gut',
    name: 'Constipation, Health Gut',
    description: 'Improve digestion, relieve constipation and build a healthier gut.',
    category: 'MODERATE ACTIVITY / PERFORMANCE',
    icon: 'icon_constipation_flatulence',
    iconType: 'vector',
    priority: 13,
    isActive: true,
  },

  // Beginner — Sedentary & Lightly Active Goals
  {
    id: 'goal_low_energy',
    name: 'Low Energy',
    description: 'Feel more energized throughout the day and overcome chronic daytime fatigue.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_low_energy',
    iconType: 'vector',
    priority: 10,
    isActive: true,
  },
  {
    id: 'goal_fat_loss',
    name: 'Fat Loss',
    description: 'Reduce visceral and subcutaneous body fat and achieve a lean composition.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_fat_loss',
    iconType: 'vector',
    priority: 11,
    isActive: true,
  },
  {
    id: 'goal_constipation_flatulence',
    name: 'Experience of Constipation and Flatulence',
    description: 'Improve digestive motility, relieve bloating, gas and gut discomfort.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_constipation_flatulence',
    iconType: 'vector',
    priority: 12,
    isActive: true,
  },
  {
    id: 'goal_poor_immunity',
    name: 'Poor Immunity',
    description: 'Strengthen cellular immune defense and resistance against seasonal illnesses.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_poor_immunity',
    iconType: 'vector',
    priority: 13,
    isActive: true,
  },
  {
    id: 'goal_busy_lifestyle_meal_skips',
    name: 'Busy Lifestyle / Skips Meals Often',
    description: 'Build structured eating habits and maintain steady energy despite a hectic routine.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_busy_lifestyle_meal_skips',
    iconType: 'vector',
    priority: 14,
    isActive: true,
  },
  {
    id: 'goal_joint_pain',
    name: 'Joint Pain',
    description: 'Reduce joint inflammation, stiffness and support comfortable mobility.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_joint_pain',
    iconType: 'vector',
    priority: 15,
    isActive: true,
  },
  {
    id: 'goal_improve_stamina',
    name: 'Improve Stamina',
    description: 'Increase day-to-day stamina and physical resilience.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_improve_stamina',
    iconType: 'vector',
    priority: 16,
    isActive: true,
  },
  {
    id: 'goal_heal_metabolically',
    name: 'Heal Metabolically',
    description: 'Restore insulin sensitivity, metabolic balance and natural hormonal rhythm.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_heal_metabolically',
    iconType: 'vector',
    priority: 17,
    isActive: true,
  },
  {
    id: 'goal_better_sleep',
    name: 'Better Sleep',
    description: 'Improve sleep architecture, fall asleep faster and wake up refreshed.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_better_sleep',
    iconType: 'vector',
    priority: 18,
    isActive: true,
  },
  {
    id: 'goal_reduce_muscle_cramps',
    name: 'Reduce Muscle Cramps',
    description: 'Prevent involuntary muscle spasms and enhance cellular hydration.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_reduce_muscle_cramps',
    iconType: 'vector',
    priority: 19,
    isActive: true,
  },
  {
    id: 'goal_poor_hydration',
    name: 'Poor Hydration',
    description: 'Improve daily fluid balance and optimal electrolyte distribution.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_poor_hydration',
    iconType: 'vector',
    priority: 20,
    isActive: true,
  },
  {
    id: 'goal_struggles_with_focus',
    name: 'Struggles With Focus in the Gym',
    description: 'Overcome mental distraction and build unwavering workout consistency.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_struggles_with_focus',
    iconType: 'vector',
    priority: 21,
    isActive: true,
  },
  {
    id: 'goal_no_clear_plan',
    name: 'No Clear Plan or Direction',
    description: 'Gain structured roadmap, progressive targets and expert nutritionist guidance.',
    category: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    icon: 'icon_no_clear_plan',
    iconType: 'vector',
    priority: 22,
    isActive: true,
  },
];

// --- 2. DEFAULT SUPPLEMENTS DATABASE ---
export const DEFAULT_SUPPLEMENTS_DATABASE: SupplementEntity[] = [
  {
    id: 'supp_calcium_citrate_malate',
    name: 'Calcium Citrate Malate',
    category: 'Bone Health',
    description: 'High-bioavailability calcium support option for optimal skeletal density and joint integrity.',
    icon: 'supp_calcium_citrate_malate',
    iconType: 'vector',
    active: true,
    standardDosage: '500mg – 1000mg',
    timing: 'With Meals',
    adminNotes: 'Superior absorption compared to calcium carbonate; does not require high stomach acid.',
  },
  {
    id: 'supp_vitamin_k2_mk7',
    name: 'Vitamin K2 MK-7',
    category: 'Bone / Cardiovascular Support',
    description: 'Vitamin K2 MK-7 support to direct calcium into bones and teeth rather than arterial walls.',
    icon: 'supp_vitamin_k2_mk7',
    iconType: 'vector',
    active: true,
    standardDosage: '55mcg – 100mcg',
    timing: 'With Breakfast / Fat-containing meal',
    adminNotes: 'Synergistic cofactor when prescribed alongside Calcium and Vitamin D3.',
  },
  {
    id: 'supp_caffeine_anhydrous',
    name: 'Caffeine Anhydrous',
    category: 'Performance & Alertness',
    description: 'Potent central nervous system stimulant for energy kick, focus and workout drive.',
    icon: 'supp_caffeine_anhydrous',
    iconType: 'vector',
    active: true,
    standardDosage: '100mg – 200mg',
    timing: '20–30 mins Pre-Workout',
  },
  {
    id: 'supp_creatine_monohydrate',
    name: 'Creatine Monohydrate',
    category: 'Power & Strength',
    description: 'Replenishes cellular ATP stores for increased strength, power output and lean muscle mass.',
    icon: 'supp_creatine_monohydrate',
    iconType: 'vector',
    active: true,
    standardDosage: '3g – 5g daily',
    timing: 'Post-Workout or Morning with water/carbs',
  },
  {
    id: 'supp_l_citrulline',
    name: 'L-Citrulline / Citrulline Malate',
    category: 'Vascularity & Nitric Oxide',
    description: 'Potent nitric oxide booster enhancing vasodilation, blood flow, muscle pump and waste removal.',
    icon: 'supp_l_citrulline',
    iconType: 'vector',
    active: true,
    standardDosage: '6g – 8g',
    timing: '30 mins Pre-Workout',
  },
  {
    id: 'supp_beta_alanine',
    name: 'Beta-Alanine',
    category: 'Endurance & Lactic Buffer',
    description: 'Synthesizes muscle carnosine to buffer intramuscular acidity and delay fatigue during intense sets.',
    icon: 'supp_beta_alanine',
    iconType: 'vector',
    active: true,
    standardDosage: '3.2g – 6.4g daily',
    timing: 'Pre-Workout / Split daily doses',
  },
  {
    id: 'supp_whey_isolate',
    name: 'Whey Protein Isolate',
    category: 'Protein & Recovery',
    description: 'Ultra-pure, fast-digesting protein providing essential EAAs and BCAAs for muscle protein synthesis.',
    icon: 'supp_whey_isolate',
    iconType: 'vector',
    active: true,
    standardDosage: '1 – 2 Scoops (25g – 50g protein)',
    timing: 'Post-Workout / Meal Replacer',
  },
  {
    id: 'supp_leucine',
    name: 'L-Leucine',
    category: 'Anabolic Muscle Trigger',
    description: 'Key amino acid that directly triggers mTOR signaling for muscle growth and nitrogen retention.',
    icon: 'supp_leucine',
    iconType: 'vector',
    active: true,
    standardDosage: '3g – 5g',
    timing: 'With lower-protein meals or Pre/Post workout',
  },
  {
    id: 'supp_l_carnitine',
    name: 'L-Carnitine',
    category: 'Metabolic & Fatty Acid Transport',
    description: 'Transports long-chain fatty acids into cellular mitochondria for energy production.',
    icon: 'supp_l_carnitine',
    iconType: 'vector',
    active: true,
    standardDosage: '1000mg – 2000mg',
    timing: 'Morning / Pre-Activity',
  },
  {
    id: 'supp_omega3_epa_dha',
    name: 'Omega-3 Fatty Acids (EPA & DHA)',
    category: 'Joint & Cardiovascular Health',
    description: 'Anti-inflammatory essential fatty acids supporting joint lubrication, brain and heart function.',
    icon: 'supp_omega3_epa_dha',
    iconType: 'vector',
    active: true,
    standardDosage: '1000mg – 2000mg total EPA/DHA',
    timing: 'With Lunch / Dinner',
    adminNotes: 'EPA prescribed for Non-Veg clients; Algal DHA prescribed for Vegetarian/Vegan clients.',
  },
  {
    id: 'supp_magnesium_glycinate',
    name: 'Magnesium Glycinate',
    category: 'Sleep & Muscle Relaxation',
    description: 'Highly absorbable chelated magnesium that relaxes nerves, prevents cramps and improves deep sleep.',
    icon: 'supp_magnesium_glycinate',
    iconType: 'vector',
    active: true,
    standardDosage: '200mg – 400mg elemental magnesium',
    timing: '30–60 mins Before Bed',
  },
  {
    id: 'supp_probiotics',
    name: 'Multi-Strain Probiotics',
    category: 'Gut Microbiome Health',
    description: 'Live beneficial bacteria strains to restore healthy gut microbiome, relieve bloating and constipation.',
    icon: 'supp_probiotics',
    iconType: 'vector',
    active: true,
    standardDosage: '10 – 30 Billion CFU',
    timing: 'Morning on empty stomach or before bed',
  },
  {
    id: 'supp_antioxidant_complex',
    name: 'Antioxidant Defense (ALA, CoQ10, Vit C, Vit E)',
    category: 'Cellular Immunity & Defense',
    description: 'Synergistic antioxidant complex that neutralizes oxidative stress and strengthens immune resilience.',
    icon: 'supp_antioxidant_complex',
    iconType: 'vector',
    active: true,
    standardDosage: 'Alpha Lipoic Acid 300mg, CoQ10 100mg, Vitamin C 500mg, Vitamin E 200IU',
    timing: 'With Morning / Afternoon meal',
  },
];

// --- 3. CONFIGURABLE RECOMMENDATION RULES DATABASE ---
export const DEFAULT_RECOMMENDATION_RULES: RecommendationRule[] = [
  // High Intensity / Performance Rules
  {
    id: 'rule_perf_energy_kick',
    goalIdOrName: 'Energy Focus / Alert / Extra Kick for Workout',
    categoryContext: 'HIGH INTENSITY / PERFORMANCE',
    recommendationName: 'Caffeine Anhydrous',
    recommendationType: 'SUPPLEMENT',
    category: 'Performance',
    description: 'Potent central nervous system stimulant to maximize alertness, focus, and drive during heavy workouts.',
    dosageOrProtocol: '100–200mg',
    timing: '20–30 mins before training',
  },
  {
    id: 'rule_perf_vascularity_pump',
    goalIdOrName: 'Vascularity / Improved Performance / Muscle Pump',
    categoryContext: 'HIGH INTENSITY / PERFORMANCE',
    recommendationName: 'L-Citrulline / Citrulline Malate',
    recommendationType: 'SUPPLEMENT',
    category: 'Vascularity & Blood Flow',
    description: 'Boosts plasma L-arginine and nitric oxide production, expanding blood vessels for enhanced muscle pump.',
    dosageOrProtocol: '6–8g',
    timing: '30–45 mins pre-workout',
  },
  {
    id: 'rule_perf_endurance_fatigue',
    goalIdOrName: 'Improve Endurance / Delay Fatigue',
    categoryContext: 'HIGH INTENSITY / PERFORMANCE',
    recommendationName: 'Beta-Alanine',
    recommendationType: 'SUPPLEMENT',
    category: 'Endurance & Lactic Acid Buffer',
    description: 'Increases muscle carnosine concentration, buffering hydrogen ions and delaying fatigue in high-rep sets.',
    dosageOrProtocol: '3.2–6.4g daily',
    timing: 'Pre-workout or split through day',
  },
  {
    id: 'rule_perf_meal_replacer',
    goalIdOrName: 'Meal Replacer',
    categoryContext: 'HIGH INTENSITY / PERFORMANCE',
    recommendationName: 'Whey Protein Isolate + Coconut Oil / Cream',
    recommendationType: 'NUTRITION STRATEGY',
    category: 'Nutrition Strategy',
    description: 'Rapid, nutrient-dense liquid meal formulation supplying complete essential amino acids and clean medium-chain triglycerides.',
    dosageOrProtocol: '1 scoop Whey Isolate + 1 tbsp Virgin Coconut Oil/Cream',
    timing: 'As prescribed when skipping whole meal',
  },
  {
    id: 'rule_perf_insufficient_protein',
    goalIdOrName: 'Insufficient Protein Intake',
    categoryContext: 'HIGH INTENSITY / PERFORMANCE',
    recommendationName: 'L-Leucine & Whey Protein Isolate',
    recommendationType: 'SUPPLEMENT',
    category: 'Protein Synthesis',
    description: 'Maximizes muscle protein synthesis (MPS) trigger threshold to ensure muscle preservation.',
    dosageOrProtocol: '3g Leucine or 1 scoop Whey Isolate',
    timing: 'With main meals or post-workout',
  },
  {
    id: 'rule_perf_fat_loss',
    goalIdOrName: 'Fat Loss',
    categoryContext: 'ALL',
    recommendationName: 'Fat-Protein Diet Strategy',
    recommendationType: 'DIET STRATEGY',
    category: 'Diet Strategy',
    description: 'Structured high-satiety macronutrient ratio prioritizing clean dietary proteins and healthy lipids to stabilize insulin.',
    dosageOrProtocol: 'Prescribed in customized meal plan',
  },
  {
    id: 'rule_perf_muscle_gain',
    goalIdOrName: 'Muscle Gain',
    categoryContext: 'HIGH INTENSITY / PERFORMANCE',
    recommendationName: 'FAT, PROTEIN DIET',
    recommendationType: 'DIET STRATEGY',
    category: 'Diet Strategy',
    description: 'Targeted fat and protein metabolic calibration prioritizing adequate essential fatty acids and protein for optimal muscle protein synthesis.',
    dosageOrProtocol: 'Prescribed in customized meal plan',
  },
  {
    id: 'rule_perf_poor_immunity',
    goalIdOrName: 'Poor Immunity',
    categoryContext: 'ALL',
    recommendationName: 'Antioxidant Complex (ALA, CoQ10, Vit C, Vit E)',
    recommendationType: 'SUPPLEMENT',
    category: 'Cellular Immunity',
    description: 'Neutralizes free radical damage from high stress/training load and reinforces cellular membrane defenses.',
    dosageOrProtocol: '1 capsule daily',
    timing: 'With breakfast',
  },
  {
    id: 'rule_perf_busy_lifestyle',
    goalIdOrName: 'Busy Lifestyle / Skips Meals Often',
    categoryContext: 'ALL',
    recommendationName: 'Whey Protein Isolate + Coconut Oil / Cream',
    recommendationType: 'NUTRITION STRATEGY',
    category: 'Nutrition Strategy',
    description: 'Convenient nutrient-dense baseline ensuring adequate macro distribution despite heavy travel or work schedules.',
    dosageOrProtocol: '1 serving as prescribed',
  },
  {
    id: 'rule_perf_joint_pain_nonveg',
    goalIdOrName: 'Joint Pain',
    categoryContext: 'ALL',
    conditionDietPreference: 'NON-VEGETARIAN',
    recommendationName: 'Omega-3 Fish Oil (High EPA)',
    recommendationType: 'SUPPLEMENT',
    category: 'Joint & Inflammation',
    description: 'High-potency EPA marine omega-3 fatty acids for natural joint lubrication and anti-inflammatory cellular pathways.',
    dosageOrProtocol: '1000–2000mg EPA',
    timing: 'With lunch or dinner',
  },
  {
    id: 'rule_perf_joint_pain_veg',
    goalIdOrName: 'Joint Pain',
    categoryContext: 'ALL',
    conditionDietPreference: 'VEGETARIAN',
    recommendationName: 'Algal Omega-3 (High DHA / Veg EPA)',
    recommendationType: 'SUPPLEMENT',
    category: 'Joint & Inflammation',
    description: '100% vegetarian micro-algae extracted omega-3 providing essential anti-inflammatory fatty acids for cartilage health.',
    dosageOrProtocol: '500–1000mg Algal DHA/EPA',
    timing: 'With lunch or dinner',
  },
  {
    id: 'rule_perf_better_sleep',
    goalIdOrName: 'Better Sleep',
    categoryContext: 'ALL',
    recommendationName: 'Magnesium Glycinate',
    recommendationType: 'SUPPLEMENT',
    category: 'Sleep & Nervous System',
    description: 'Chelated magnesium supporting GABA neurotransmission, physical muscular relaxation, and deep restorative sleep.',
    dosageOrProtocol: '200–400mg',
    timing: '30–60 mins before bed',
  },
  {
    id: 'rule_perf_bone_health',
    goalIdOrName: 'Bone Health Support',
    categoryContext: 'ALL',
    recommendationName: 'Calcium Citrate Malate + Vitamin K2 MK-7',
    recommendationType: 'SUPPLEMENT',
    category: 'Bone Health & Density',
    description: 'High-bioavailability calcium combined with Vitamin K2 MK-7 to guide calcium deposition directly into bone matrix.',
    dosageOrProtocol: '500mg CCM + 55mcg K2 MK-7',
    timing: 'With meals',
  },
  {
    id: 'rule_perf_muscle_cramps_gut',
    goalIdOrName: 'Reduce Muscle Cramps',
    categoryContext: 'ALL',
    recommendationName: 'Magnesium Glycinate + Multi-Strain Probiotics',
    recommendationType: 'SUPPLEMENT',
    category: 'Electrolytes & Gut Health',
    description: 'Relieves neuromuscular hyper-excitability while restoring intestinal microflora for smooth gut transit.',
    dosageOrProtocol: 'Magnesium 250mg + Probiotics 10 Billion CFU',
    timing: 'Evening with water',
  },

  // Beginner / Sedentary / Lightly Active Rules
  {
    id: 'rule_beg_low_energy',
    goalIdOrName: 'Low Energy',
    categoryContext: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    recommendationName: 'L-Carnitine Metabolic Fuel',
    recommendationType: 'SUPPLEMENT',
    category: 'Metabolism & Energy',
    description: 'Assists cellular mitochondria in converting stored fatty acids into clean energy, reducing daytime sluggishness.',
    dosageOrProtocol: '1000–1500mg',
    timing: 'Morning or 30 mins before daily walk',
  },
  {
    id: 'rule_beg_constipation',
    goalIdOrName: 'Experience of Constipation and Flatulence',
    categoryContext: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    recommendationName: 'Multi-Strain Probiotics + Hydration Protocol',
    recommendationType: 'SUPPLEMENT',
    category: 'Gut Health & Motility',
    description: 'Targeted friendly bacteria strains paired with structured water intake to normalize bowel frequency and relieve gas.',
    dosageOrProtocol: '1 capsule on empty stomach + 3L water/day',
    timing: 'Morning',
  },
  {
    id: 'rule_beg_improve_stamina',
    goalIdOrName: 'Improve Stamina',
    categoryContext: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    recommendationName: 'Fat-Protein Nutrition Strategy',
    recommendationType: 'DIET STRATEGY',
    category: 'Diet Strategy',
    description: 'Stabilizes baseline blood glucose, preventing post-meal crashes and building progressive physical endurance.',
    dosageOrProtocol: 'Prescribed in customized meal plan',
  },
  {
    id: 'rule_beg_heal_metabolically',
    goalIdOrName: 'Heal Metabolically',
    categoryContext: 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE',
    recommendationName: 'Metabolic Reset Diet Strategy',
    recommendationType: 'DIET STRATEGY',
    category: 'Diet Strategy',
    description: 'Clinical whole-food nutrition framework focused on reducing chronic systemic inflammation and restoring insulin signaling.',
    dosageOrProtocol: 'Prescribed in customized meal plan',
  },
];

// Local storage cache keys for dynamic admin customizations
const STORAGE_KEY_GOALS = 'she_nourishes_dynamic_goals_v2';
const STORAGE_KEY_SUPPLEMENTS = 'she_nourishes_dynamic_supplements_v2';
const STORAGE_KEY_RULES = 'she_nourishes_dynamic_rules_v2';

/**
 * Retrieve all goals (combines default database with admin customizations)
 */
export function getAllGoalDefinitions(): GoalDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOALS);
    if (!raw) return DEFAULT_GOALS_DATABASE;
    return JSON.parse(raw) as GoalDefinition[];
  } catch {
    return DEFAULT_GOALS_DATABASE;
  }
}

/**
 * Save or update a goal definition
 */
export function saveGoalDefinition(goal: GoalDefinition): void {
  const current = getAllGoalDefinitions();
  const existingIdx = current.findIndex((g) => g.id === goal.id);
  if (existingIdx >= 0) {
    current[existingIdx] = goal;
  } else {
    current.push(goal);
  }
  localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(current));
}

/**
 * Retrieve all supplement entities
 */
export function getAllSupplementEntities(): SupplementEntity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPPLEMENTS);
    if (!raw) return DEFAULT_SUPPLEMENTS_DATABASE;
    return JSON.parse(raw) as SupplementEntity[];
  } catch {
    return DEFAULT_SUPPLEMENTS_DATABASE;
  }
}

/**
 * Save or update a supplement entity
 */
export function saveSupplementEntity(supplement: SupplementEntity): void {
  const current = getAllSupplementEntities();
  const existingIdx = current.findIndex((s) => s.id === supplement.id);
  if (existingIdx >= 0) {
    current[existingIdx] = supplement;
  } else {
    current.push(supplement);
  }
  localStorage.setItem(STORAGE_KEY_SUPPLEMENTS, JSON.stringify(current));
}

/**
 * Retrieve all recommendation rules
 */
export function getAllRecommendationRules(): RecommendationRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RULES);
    if (!raw) return DEFAULT_RECOMMENDATION_RULES;
    return JSON.parse(raw) as RecommendationRule[];
  } catch {
    return DEFAULT_RECOMMENDATION_RULES;
  }
}

/**
 * Save or update a recommendation rule
 */
export function saveRecommendationRule(rule: RecommendationRule): void {
  const current = getAllRecommendationRules();
  const existingIdx = current.findIndex((r) => r.id === rule.id);
  if (existingIdx >= 0) {
    current[existingIdx] = rule;
  } else {
    current.push(rule);
  }
  localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(current));
}

/**
 * Normalizes goal string for robust matching across slight variations.
 */
function normalizeGoalName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Evaluates selected goals against configurable rules and returns merged, deduplicated recommendations.
 * 
 * Strict Rule: If multiple goals trigger the same recommendation (e.g. Magnesium Glycinate),
 * it is displayed ONCE with merged "Recommended for: Goal A • Goal B".
 */
export function evaluateGoalRecommendations(
  selectedGoalNames: string[],
  customGoals: CustomGoalItem[] = [],
  activityLevel = '',
  dietType = ''
): GeneratedRecommendation[] {
  const rules = getAllRecommendationRules();
  const isVegetarian = dietType.toUpperCase().includes('VEGETARIAN') || dietType.toUpperCase().includes('VEGAN');
  const isHighIntensity = activityLevel === 'Active at Gym' || activityLevel === "Extremely Active Player's" || activityLevel === 'Moderately Active' || activityLevel === 'Extremely Active';

  // Map to collect and deduplicate recommendations by name
  const recommendationMap = new Map<string, GeneratedRecommendation>();

  for (const selectedGoal of selectedGoalNames) {
    const normSelected = normalizeGoalName(selectedGoal);

    // Find all matching rules for this goal
    const matchingRules = rules.filter((rule) => {
      const normRuleGoal = normalizeGoalName(rule.goalIdOrName);
      const isGoalMatch = normSelected === normRuleGoal || normSelected.includes(normRuleGoal) || normRuleGoal.includes(normSelected);

      if (!isGoalMatch) return false;

      // Check context
      if (rule.categoryContext === 'HIGH INTENSITY / PERFORMANCE' && !isHighIntensity) {
        // Still allow if user explicitly picked a high-intensity goal
      }

      // Check dietary preference (e.g. Vegetarian vs Non-Veg Omega-3)
      if (rule.conditionDietPreference === 'VEGETARIAN' && !isVegetarian) return false;
      if (rule.conditionDietPreference === 'NON-VEGETARIAN' && isVegetarian) return false;

      return true;
    });

    for (const rule of matchingRules) {
      const key = rule.recommendationName.trim();
      const existing = recommendationMap.get(key);

      if (existing) {
        if (!existing.triggeredByGoals.includes(selectedGoal)) {
          existing.triggeredByGoals.push(selectedGoal);
        }
      } else {
        recommendationMap.set(key, {
          id: 'rec_' + normalizeGoalName(rule.recommendationName),
          name: rule.recommendationName,
          type: rule.recommendationType,
          category: rule.category,
          description: rule.description,
          triggeredByGoals: [selectedGoal],
          dosageOrProtocol: rule.dosageOrProtocol,
          timing: rule.timing,
          notes: rule.notes,
          isAdminApproved: true,
        });
      }
    }
  }

  // Handle Custom Goals
  if (customGoals.length > 0) {
    for (const custom of customGoals) {
      // Custom goals do NOT automatically invent supplement prescriptions
      // They are recorded and added as an Admin-Reviewable strategy note
      const customKey = `Custom Goal Protocol: ${custom.name}`;
      if (!recommendationMap.has(customKey)) {
        recommendationMap.set(customKey, {
          id: 'rec_custom_' + custom.id,
          name: `Personalized Strategy: ${custom.name}`,
          type: 'NUTRITION STRATEGY',
          category: 'Personalized Custom Goal',
          description: `Goal Description: "${custom.description}". ${custom.additionalDetails ? `Details: ${custom.additionalDetails}` : ''}`,
          triggeredByGoals: [custom.name],
          dosageOrProtocol: 'Pending Senior Clinical Nutritionist Formulation',
          notes: 'Requires Nutritionist 1-on-1 Consultation Review',
          isAdminApproved: false,
        });
      }
    }
  }

  // User Directive: With L-Leucine, remove Whey Protein
  const hasLeucine = Array.from(recommendationMap.values()).some((r) => 
    r.name.toLowerCase().includes('leucine') || r.description.toLowerCase().includes('leucine')
  );
  if (hasLeucine) {
    for (const key of Array.from(recommendationMap.keys())) {
      if (key.toLowerCase().includes('whey')) {
        recommendationMap.delete(key);
      }
    }
  }

  return Array.from(recommendationMap.values());
}
