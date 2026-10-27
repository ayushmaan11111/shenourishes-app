import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  TestTube, 
  Gift, 
  Pill, 
  Utensils, 
  Scale, 
  Layers, 
  CreditCard, 
  Check, 
  Plus,
  ExternalLink,
  Image as ImageIcon,
  X,
  ChefHat,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getLongTermSupportRecord, 
  saveLongTermSupportRecord, 
  signLongTermSupportAgreement,
  DEFAULT_PACKAGES 
} from '../services/longTermSupportService';
import { CircularWeightPicker } from '../components/longterm/CircularWeightPicker';
import { LipogenesisEducationalDiagram } from '../components/longterm/LipogenesisEducationalDiagram';
import { MacronutrientMetabolismSection } from '../components/nutrition/MacronutrientMetabolismSection';
import { publishClientDietChart, resolveCustomizedDietChart } from '../services/clinicalDietTemplates';
import { getLongTermAgreementConfig } from '../data/agreementsData';
import type { 
  LongTermSupportSessionRecord, 
  LongTermSelectedRecipe,
  ParQQuestionItem 
} from '../types/longTermSupport';

interface LongTermSupportScreenProps {
  onBack?: () => void;
}

const STEPS_NAV = [
  { step: 1, label: 'Package', icon: CreditCard },
  { step: 2, label: 'Agreement', icon: ShieldCheck },
  { step: 3, label: 'PAR-Q', icon: CheckCircle2 },
  { step: 4, label: 'Blood Tests', icon: TestTube },
  { step: 5, label: 'Gift Hamper', icon: Gift },
  { step: 6, label: 'Goals & Supplements', icon: Target },
  { step: 7, label: 'Eating Habits & DNL', icon: Utensils },
  { step: 8, label: 'Biometrics & Formula', icon: Scale },
  { step: 9, label: 'Dietary Option', icon: Layers },
  { step: 10, label: 'Recipes & Customizer', icon: ChefHat },
];

const GIFT_HAMPERS = [
  {
    id: 'gift_shaker_scale',
    title: 'Clinical Shaker + Digital Portion Scale',
    description: 'BPA-free leakproof shaker with stainless wire whisk & ultra-precise 1g digital kitchen scale.',
    badge: 'Most Popular Starter',
  },
  {
    id: 'gift_starter_fats',
    title: 'Cold-Pressed Coconut Oil & A2 Ghee Starter Pack',
    description: '500ml cold-pressed virgin coconut oil + 500ml pure Vedic Bilona A2 Desi Cow Ghee.',
    badge: 'Clinical Fat Stack',
  },
  {
    id: 'gift_nutritionist_call',
    title: '1-on-1 Senior Clinical Consultation',
    description: '60-minute deep-dive biometric & blood report review with our Senior Clinical Nutritionist.',
    badge: 'VIP Strategy',
  },
  {
    id: 'gift_resistance_bands',
    title: 'Triple-Resistance Bands & Mobility Guide',
    description: 'Set of 3 fabric non-slip resistance bands with clinical mobility & glute activation manual.',
    badge: 'Fitness Booster',
  },
];

const GOAL_OPTIONS = [
  'Fat Loss & Metabolic Reset',
  'Lean Muscle Hypertrophy & Gain',
  'Energy Focus & Mental Clarity',
  'Vascularity & Muscle Pump',
  'Improve Endurance & Delay Fatigue',
  'Joint Pain & Mobility Repair',
  'Better Sleep & Nervous Relaxation',
  'Gut Health & Anti-Bloating (Probiotics)',
  'Bone Health & Skeletal Density',
  'Cellular Immunity & Antioxidant Defense',
];

// EXACT 23 PAR-Q QUESTIONS EXTRACTED FROM CLINICAL PAR-Q FORM
export const PARQ_FORM_QUESTIONS: ParQQuestionItem[] = [
  // SECTION A: MEDICAL HISTORY
  {
    id: 1,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have High Blood Pressure (Hypertension)?',
  },
  {
    id: 2,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Heart Disease (including heart attack, congestive failure, angina, etc.)?',
  },
  {
    id: 3,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Diabetes?',
  },
  {
    id: 4,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Obesity (BMI 30 or above)?',
  },
  {
    id: 5,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Have you had a Stroke?',
  },
  {
    id: 6,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Thyroid Disorder?',
  },
  {
    id: 7,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Sleep Apnea?',
  },
  {
    id: 8,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Asthma?',
  },
  {
    id: 9,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have Cancer or are you currently undergoing any cancer treatment?',
  },
  {
    id: 10,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have any Periodontal Disease (bleeding gums, dental cavities, dentures)?',
  },
  {
    id: 11,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you have any GI problems (heartburn, bloating, gas, diarrhea, vomiting, constipation)?',
  },
  {
    id: 12,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Are you currently on any medications, either prescription or non-prescription, on a regular basis?',
  },
  {
    id: 13,
    section: 'SECTION A: MEDICAL HISTORY',
    question: 'Do you take any dietary supplements (vitamins, minerals, ayurvedic supplements)?',
  },

  // SECTION B: PHYSICAL ACTIVITY READINESS
  {
    id: 14,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Has your doctor ever said that you have a heart condition (had a stroke, heart attack, or heart surgery) and / or that you should only do physical activity recommended by a doctor?',
  },
  {
    id: 15,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Do you feel pain in your chest when you do physical activity?',
  },
  {
    id: 16,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'In the past month, have you had chest pain when you were not doing physical activity?',
  },
  {
    id: 17,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Do you lose your balance because of dizziness or do you ever lose consciousness?',
  },
  {
    id: 18,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Have you ever been told by a doctor that you have bone, joint, or muscle problems that could be made worse by physical activity?',
  },
  {
    id: 19,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Do you have a diagnosed illness that could be made worse by physical activity?',
  },
  {
    id: 20,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Are you pregnant now or have given birth within the last 6 months?',
  },
  {
    id: 21,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Have you had a recent surgery?',
  },
  {
    id: 22,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Do you take any prescription medication for diabetes / hypertension or any other medical illness?',
    hasDetailsInput: true,
    detailsPrompt: 'If yes, please mention the name of the medication, dosage, frequency and purpose:',
  },
  {
    id: 23,
    section: 'SECTION B: PHYSICAL ACTIVITY READINESS',
    question: 'Do you take any dietary supplements (vitamins, minerals, ayurvedic supplements)?',
    hasDetailsInput: true,
    detailsPrompt: 'If yes, please mention the names:',
  },
];

// PREVIOUS FOOD OPTIONS (With cropped plate image, title, macros and '+' add button)
const PREVIOUS_BREAKFAST_FOODS = [
  { name: 'Poha (1 bowl)', carbs: 45, protein: 8, fat: 12, calories: 320, type: 'Veg', image: '/images/food-items/veg_bf_1.jpg' },
  { name: 'Aloo Paratha (1 paratha with butter)', carbs: 46, protein: 9, fat: 14, calories: 346, type: 'Veg', image: '/images/food-items/veg_bf_2.jpg' },
  { name: 'Upma (1 bowl)', carbs: 36, protein: 7, fat: 10, calories: 262, type: 'Veg', image: '/images/food-items/veg_bf_3.jpg' },
  { name: 'Masala Dosa (1 dosa + sambar)', carbs: 50, protein: 8, fat: 14, calories: 358, type: 'Veg', image: '/images/food-items/veg_bf_4.jpg' },
  { name: 'Idli + Sambar (2 idlis + bowl sambar)', carbs: 41, protein: 11, fat: 2, calories: 226, type: 'Veg', image: '/images/food-items/veg_bf_5.jpg' },
  { name: 'Paneer Paratha (1 paratha)', carbs: 42, protein: 14, fat: 15, calories: 359, type: 'Veg', image: '/images/food-items/veg_bf_6.jpg' },
  { name: 'Chole Kulche (1 kulcha + chole)', carbs: 58, protein: 13, fat: 16, calories: 428, type: 'Veg', image: '/images/food-items/veg_bf_7.jpg' },
  { name: 'Besan Cheela (2 cheela)', carbs: 35, protein: 11, fat: 6, calories: 238, type: 'Veg', image: '/images/food-items/veg_bf_8.jpg' },
  { name: 'Moong Dal Cheela (2 cheela)', carbs: 28, protein: 13, fat: 5, calories: 209, type: 'Veg', image: '/images/food-items/veg_bf_9.jpg' },
  { name: 'Sabudana Khichdi (1 bowl)', carbs: 45, protein: 4, fat: 12, calories: 304, type: 'Veg', image: '/images/food-items/veg_bf_10.jpg' },
  { name: 'Anda Bhurji + Pav (3 eggs + 2 pav)', carbs: 32, protein: 18, fat: 22, calories: 398, type: 'Non-Veg', image: '/images/food-items/nonveg_bf_1.jpg' },
  { name: 'Masala Omelette + Toast (2 eggs)', carbs: 28, protein: 20, fat: 18, calories: 354, type: 'Non-Veg', image: '/images/food-items/nonveg_bf_2.jpg' },
  { name: 'Boiled Eggs (2) + Fruit', carbs: 15, protein: 13, fat: 10, calories: 202, type: 'Non-Veg', image: '/images/food-items/nonveg_bf_3.jpg' },
  { name: 'Chicken Keema + Paratha', carbs: 36, protein: 22, fat: 24, calories: 448, type: 'Non-Veg', image: '/images/food-items/nonveg_bf_4.jpg' },
  { name: 'Egg & Chicken Roll', carbs: 30, protein: 22, fat: 16, calories: 352, type: 'Non-Veg', image: '/images/food-items/nonveg_bf_5.jpg' },
];

const PREVIOUS_LUNCH_FOODS = [
  { name: 'Dal Tadka + Jeera Rice', carbs: 74, protein: 18, fat: 12, calories: 476, type: 'Veg', image: '/images/food-items/lunch_1.jpg' },
  { name: 'Rajma + Brown Rice', carbs: 76, protein: 18, fat: 12, calories: 484, type: 'Veg', image: '/images/food-items/lunch_2.jpg' },
  { name: 'Chole + White Rice', carbs: 72, protein: 16, fat: 10, calories: 442, type: 'Veg', image: '/images/food-items/lunch_3.jpg' },
  { name: 'Palak Paneer + Roti (2 rotis)', carbs: 62, protein: 20, fat: 16, calories: 472, type: 'Veg', image: '/images/food-items/lunch_4.jpg' },
  { name: 'Matar Paneer + Roti (2 rotis)', carbs: 64, protein: 18, fat: 14, calories: 454, type: 'Veg', image: '/images/food-items/lunch_5.jpg' },
  { name: 'Kadhi + Rice', carbs: 68, protein: 14, fat: 12, calories: 436, type: 'Veg', image: '/images/food-items/lunch_6.jpg' },
  { name: 'Veg Pulao + Raita', carbs: 80, protein: 14, fat: 10, calories: 466, type: 'Veg', image: '/images/food-items/lunch_7.jpg' },
  { name: 'Masoor Dal + Rice', carbs: 66, protein: 18, fat: 10, calories: 426, type: 'Veg', image: '/images/food-items/lunch_8.jpg' },
  { name: 'Chicken Curry + Rice', carbs: 70, protein: 28, fat: 16, calories: 536, type: 'Non-Veg', image: '/images/food-items/lunch_9.jpg' },
  { name: 'Egg Curry + Roti (2 rotis)', carbs: 50, protein: 20, fat: 14, calories: 406, type: 'Non-Veg', image: '/images/food-items/lunch_10.jpg' },
  { name: 'Fish Curry + Rice', carbs: 68, protein: 24, fat: 14, calories: 494, type: 'Non-Veg', image: '/images/food-items/lunch_11.jpg' },
  { name: 'Prawn Curry + Rice', carbs: 66, protein: 28, fat: 14, calories: 502, type: 'Non-Veg', image: '/images/food-items/lunch_12.jpg' },
  { name: 'Chicken Biryani + Raita', carbs: 84, protein: 26, fat: 14, calories: 566, type: 'Non-Veg', image: '/images/food-items/lunch_13.jpg' },
  { name: 'Mutton Curry + Rice', carbs: 70, protein: 30, fat: 18, calories: 562, type: 'Non-Veg', image: '/images/food-items/lunch_14.jpg' },
];

const PREVIOUS_SNACK_FOODS = [
  { name: 'Samosa (2 pcs with chutney)', carbs: 40, protein: 6, fat: 16, calories: 310, type: 'Veg', image: '/images/food-items/snack_1.jpg' },
  { name: 'Kachori (1 pc)', carbs: 45, protein: 8, fat: 20, calories: 370, type: 'Veg', image: '/images/food-items/snack_2.jpg' },
  { name: 'Aloo Tikki (1 pc)', carbs: 30, protein: 4, fat: 10, calories: 220, type: 'Veg', image: '/images/food-items/snack_3.jpg' },
  { name: 'Paneer Pakora (4 pcs)', carbs: 18, protein: 8, fat: 12, calories: 200, type: 'Veg', image: '/images/food-items/snack_4.jpg' },
  { name: 'Makhana (Roasted) (1 cup)', carbs: 20, protein: 4, fat: 6, calories: 150, type: 'Veg', image: '/images/food-items/snack_5.jpg' },
  { name: 'Sprouts Bhel (1 cup)', carbs: 24, protein: 8, fat: 4, calories: 160, type: 'Veg', image: '/images/food-items/snack_6.jpg' },
  { name: 'Bhel Puri (1 cup)', carbs: 32, protein: 5, fat: 6, calories: 210, type: 'Veg', image: '/images/food-items/snack_7.jpg' },
  { name: 'Pani Puri (6 pcs)', carbs: 32, protein: 4, fat: 4, calories: 180, type: 'Veg', image: '/images/food-items/snack_8.jpg' },
  { name: 'Sabudana Vada (2 pcs)', carbs: 30, protein: 4, fat: 10, calories: 220, type: 'Veg', image: '/images/food-items/snack_9.jpg' },
  { name: 'Masala Peanut (1 cup)', carbs: 10, protein: 10, fat: 12, calories: 190, type: 'Veg', image: '/images/food-items/snack_10.jpg' },
  { name: 'Chai + Biscuits (2-3 pcs)', carbs: 26, protein: 3, fat: 8, calories: 185, type: 'Veg', image: '/images/food-items/snack_11.jpg' },
  { name: 'Chicken Burger (1 pc)', carbs: 40, protein: 18, fat: 16, calories: 410, type: 'Non-Veg', image: '/images/food-items/snack_12.jpg' },
];

const PREVIOUS_DINNER_FOODS = [
  { name: 'Paneer Butter Masala + Naan', carbs: 90, protein: 22, fat: 18, calories: 610, type: 'Veg', image: '/images/food-items/veg_din_1.jpg' },
  { name: 'Dal Tadka + Jeera Rice', carbs: 100, protein: 20, fat: 10, calories: 570, type: 'Veg', image: '/images/food-items/veg_din_2.jpg' },
  { name: 'Chole + Bhature (2 pcs)', carbs: 120, protein: 18, fat: 22, calories: 750, type: 'Veg', image: '/images/food-items/veg_din_3.jpg' },
  { name: 'Palak Paneer + Jeera Rice', carbs: 88, protein: 20, fat: 16, calories: 576, type: 'Veg', image: '/images/food-items/veg_din_4.jpg' },
  { name: 'Mix Veg Curry + Roti (2)', carbs: 80, protein: 14, fat: 10, calories: 466, type: 'Veg', image: '/images/food-items/veg_din_5.jpg' },
  { name: 'Veg Biryani + Raita', carbs: 110, protein: 20, fat: 12, calories: 628, type: 'Veg', image: '/images/food-items/veg_din_6.jpg' },
  { name: 'Paneer Bhurji + Roti', carbs: 28, protein: 18, fat: 14, calories: 310, type: 'Veg', image: '/images/food-items/veg_din_7.jpg' },
  { name: 'Chicken Curry + White Rice', carbs: 92, protein: 28, fat: 18, calories: 642, type: 'Non-Veg', image: '/images/food-items/nonveg_din_1.jpg' },
  { name: 'Chicken Biryani + Raita', carbs: 110, protein: 28, fat: 18, calories: 714, type: 'Non-Veg', image: '/images/food-items/nonveg_din_2.jpg' },
  { name: 'Egg Curry + White Rice', carbs: 90, protein: 22, fat: 16, calories: 592, type: 'Non-Veg', image: '/images/food-items/nonveg_din_3.jpg' },
  { name: 'Mutton Curry + Rice', carbs: 92, protein: 30, fat: 20, calories: 668, type: 'Non-Veg', image: '/images/food-items/nonveg_din_4.jpg' },
  { name: 'Tandoori Chicken + Naan', carbs: 86, protein: 28, fat: 14, calories: 582, type: 'Non-Veg', image: '/images/food-items/nonveg_din_5.jpg' },
  { name: 'Fish Curry + Rice', carbs: 90, protein: 24, fat: 14, calories: 582, type: 'Non-Veg', image: '/images/food-items/nonveg_din_6.jpg' },
];

// CLINICAL RECIPES CATALOG
const CLINICAL_RECIPES_CATALOG: LongTermSelectedRecipe[] = [
  // 🧀 PANEER & DAIRY
  {
    id: 'rec_paneer_bhurji_ghee',
    title: 'Scrambled Paneer Bhurji in Pure Vedic A2 Ghee',
    category: 'Paneer',
    cookingFat: 'Pure Desi A2 Ghee (1.5 tbsp)',
    proteinGrams: 28,
    fatGrams: 24,
    carbsGrams: 4,
    calories: 340,
    instructions: 'Crumbled low-moisture cottage cheese sautéed in pure Bilona A2 Ghee with cumin, onion, tomatoes, and freshly cracked black pepper.',
  },
  {
    id: 'rec_paneer_tikka_coconut',
    title: 'Low-Moisture Paneer Tikka in Cold-Pressed Coconut Oil',
    category: 'Paneer',
    cookingFat: 'Extra Virgin Coconut Oil (1 tbsp)',
    proteinGrams: 26,
    fatGrams: 20,
    carbsGrams: 3,
    calories: 295,
    instructions: '150g paneer cubes marinated in hung curd, Kashmiri mirch, and roasted in cold-pressed virgin coconut oil.',
  },
  {
    id: 'rec_palak_paneer_butter',
    title: 'Creamy Spinach Palak Paneer in Grass-Fed Butter',
    category: 'Paneer',
    cookingFat: 'Grass-Fed Butter (1 tbsp)',
    proteinGrams: 24,
    fatGrams: 22,
    carbsGrams: 5,
    calories: 315,
    instructions: 'Fresh blanched spinach puree simmered with cottage cheese cubes and folded in golden grass-fed butter.',
  },
  {
    id: 'rec_greek_yogurt_walnuts',
    title: 'Probiotic Greek Yogurt with Walnuts & Chia Seeds',
    category: 'Paneer',
    cookingFat: 'Cold-Pressed Walnut Oil & Chia (1 tbsp)',
    proteinGrams: 20,
    fatGrams: 16,
    carbsGrams: 6,
    calories: 250,
    instructions: 'Thick strained unsweetened curd topped with activated walnuts and rich in prebiotic gut cultures.',
  },

  // 🍗 CHICKEN & POULTRY
  {
    id: 'rec_chicken_garlic_coconut',
    title: 'Garlic Herb Chicken Breast in Cold-Pressed Coconut Oil',
    category: 'Chicken',
    cookingFat: 'Extra Virgin Coconut Oil (1 tbsp)',
    proteinGrams: 38,
    fatGrams: 14,
    carbsGrams: 1,
    calories: 285,
    instructions: '150g tender boneless chicken breast pan-seared in MCT-rich coconut oil with crushed garlic and fresh rosemary.',
  },
  {
    id: 'rec_chicken_keema_ghee',
    title: 'Chicken Keema Bowl with Desi Ghee & Bell Peppers',
    category: 'Chicken',
    cookingFat: 'Pure Desi A2 Ghee (1 tbsp)',
    proteinGrams: 34,
    fatGrams: 18,
    carbsGrams: 3,
    calories: 310,
    instructions: 'Coarsely minced chicken sautéed in aromatic desi ghee with bell peppers, ginger, and cumin.',
  },
  {
    id: 'rec_tandoori_chicken_butter',
    title: 'Oven-Roasted Tandoori Chicken with Grass-Fed Butter Glaze',
    category: 'Chicken',
    cookingFat: 'Grass-Fed Butter (1 tbsp)',
    proteinGrams: 36,
    fatGrams: 16,
    carbsGrams: 2,
    calories: 295,
    instructions: 'Chicken drumsticks and breast roasted with tandoori spices and brushed with warm grass-fed butter.',
  },

  // 🐟 FISH & SEAFOOD
  {
    id: 'rec_fish_fillet_ghee',
    title: 'Pan-Seared Fresh Fish Fillet in Pure Vedic Ghee',
    category: 'Fish',
    cookingFat: 'Pure Desi A2 Ghee (1 tbsp)',
    proteinGrams: 32,
    fatGrams: 16,
    carbsGrams: 1,
    calories: 275,
    instructions: 'Fresh Rohu / Salmon / Bhetki fillet seasoned with turmeric, Himalayan pink salt, and crisp-seared in A2 ghee.',
  },
  {
    id: 'rec_prawn_pepper_coconut',
    title: 'Prawn (Chingri) Pepper Roast in Virgin Coconut Oil',
    category: 'Fish',
    cookingFat: 'Extra Virgin Coconut Oil (1 tbsp)',
    proteinGrams: 36,
    fatGrams: 14,
    carbsGrams: 1,
    calories: 275,
    instructions: '150g sweet prawns sautéed with crushed black pepper, fresh curry leaves, and fragrant coconut oil.',
  },

  // 🥚 WHOLE EGGS
  {
    id: 'rec_3egg_omelette_butter',
    title: '3-Egg Masala Omelette in Grass-Fed Golden Butter',
    category: 'Eggs',
    cookingFat: 'Grass-Fed Butter (1 tbsp)',
    proteinGrams: 22,
    fatGrams: 24,
    carbsGrams: 2,
    calories: 310,
    instructions: '3 whole free-range eggs whisked with finely chopped onions, cilantro, and green chilies, cooked golden in butter.',
  },
  {
    id: 'rec_egg_bhurji_ghee',
    title: 'Scrambled Anda Bhurji in Pure Vedic A2 Ghee',
    category: 'Eggs',
    cookingFat: 'Pure Desi A2 Ghee (1 tbsp)',
    proteinGrams: 20,
    fatGrams: 22,
    carbsGrams: 3,
    calories: 290,
    instructions: 'Fluffy scrambled eggs prepared with turmeric, tomatoes, and warm ghee.',
  },

  // 🥛 WHEY ISOLATE & CLINICAL SHAKES
  {
    id: 'rec_whey_coconut_kiwi',
    title: 'Whey Protein Isolate with Cold-Pressed Coconut Oil & Sliced Kiwi',
    category: 'Whey',
    cookingFat: 'Extra Virgin Coconut Oil (1 tbsp)',
    proteinGrams: 27,
    fatGrams: 14,
    carbsGrams: 10,
    calories: 275,
    instructions: '1 scoop 90% whey isolate shaken in cold water with 1 tbsp coconut oil for instant MCT ketone synthesis, paired with fresh kiwi slices.',
  },
  {
    id: 'rec_whey_berry_chia',
    title: 'Whey Protein Berry Chia Bowl in Coconut Milk',
    category: 'Whey',
    cookingFat: 'Cold-Pressed Coconut Milk & Chia (1 tbsp)',
    proteinGrams: 28,
    fatGrams: 12,
    carbsGrams: 8,
    calories: 250,
    instructions: 'High biological protein blended with chia fiber, coconut milk, and antioxidant-rich blackberries.',
  },

  // 🌱 VEGAN & PLANT PROTEIN
  {
    id: 'rec_tofu_broccoli_coconut',
    title: 'Organic Soya Tofu & Crunchy Broccoli Sauté in Coconut Oil',
    category: 'Vegan',
    cookingFat: 'Extra Virgin Coconut Oil (1 tbsp)',
    proteinGrams: 24,
    fatGrams: 16,
    carbsGrams: 6,
    calories: 265,
    instructions: '150g firm non-GMO tofu sautéed with fresh broccoli, zucchini, and virgin coconut oil.',
  },
  {
    id: 'rec_tempeh_cutlets_olive',
    title: 'Marinated Fermented Tempeh Cutlets in Cold-Pressed Olive Oil',
    category: 'Vegan',
    cookingFat: 'Cold-Pressed Olive Oil (1 tbsp)',
    proteinGrams: 28,
    fatGrams: 14,
    carbsGrams: 5,
    calories: 260,
    instructions: 'Fermented soy tempeh steaks seasoned with smoked paprika and seared in extra virgin olive oil.',
  },
];

const COOKING_FATS_OPTIONS = [
  { id: 'fat_coconut', name: 'Extra Virgin Coconut Oil', desc: 'Pure MCTs for instant ketone fuel' },
  { id: 'fat_ghee', name: 'Pure Desi A2 Ghee', desc: 'Rich in butyric acid for gut lining & joints' },
  { id: 'fat_butter', name: 'Grass-fed Butter', desc: 'Natural fat-soluble vitamins A, D, K2' },
  { id: 'fat_olive', name: 'Cold-Pressed Olive Oil', desc: 'High oleic acid for cardiovascular health' },
  { id: 'fat_nut_butter', name: 'Almond & Walnut Butter', desc: 'Polyphenols & slow-digesting clean fats' },
];

const PROTEIN_OPTIONS = [
  { id: 'prot_whey', name: 'Whey Protein Isolate', type: 'Fast Absorption MPS' },
  { id: 'prot_paneer', name: 'Low-Moisture Paneer / Cottage Cheese', type: 'Slow Casein Protein' },
  { id: 'prot_eggs', name: 'Whole Free-Range Eggs', type: 'Complete Bioavailable Amino Stack' },
  { id: 'prot_chicken', name: 'Grilled Chicken Breast', type: 'Lean Pollo Protein' },
  { id: 'prot_fish', name: 'Fresh Fish Fillet (Rohu / Bhetki / Salmon)', type: 'Omega-3 Rich Protein' },
  { id: 'prot_tofu', name: 'Organic Soya Tofu', type: 'Plant-Based High Isoflavone' },
  { id: 'prot_curd', name: 'Set Curd / Greek Yogurt', type: 'Probiotic Rich Casein' },
];

const CARBS_OPTIONS = [
  { id: 'carb_oats', name: 'Rolled Oats & Chia Seeds', desc: 'Beta-glucan prebiotic fiber' },
  { id: 'carb_greens', name: 'Cruciferous Greens & Broccoli', desc: 'High micronutrient density' },
  { id: 'carb_berries', name: 'Strawberries & Blackberries', desc: 'Low glycemic polyphenols' },
  { id: 'carb_rice', name: 'Brown Rice / Multigrain Phulka', desc: 'Controlled complex carbohydrates' },
];

export const LongTermSupportScreen: React.FC<LongTermSupportScreenProps> = ({
  onBack,
}) => {
  const { user, customerRecord } = useAuth();
  const clientId = user?.uid || 'default_user';
  const clientName = customerRecord?.personalDetails?.fullName || 'Valued Member';
  const clientEmail = customerRecord?.personalDetails?.emailAddress || user?.email || '';

  const [record, setRecord] = useState<LongTermSupportSessionRecord | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string>('');

  // Image modal viewer for food charts and package posters
  const [chartModalUrl, setChartModalUrl] = useState<string | null>(null);
  const [chartModalTitle, setChartModalTitle] = useState<string>('');

  // Recipe category filter in Step 10
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState<string>('All');

  // Load record on mount
  useEffect(() => {
    let isMounted = true;
    getLongTermSupportRecord(clientId).then((res) => {
      if (isMounted) {
        setRecord(res);
        setActiveStep(res.currentStep || 1);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const currentRec = record;

  // Formula Calculations for Step 8
  const calculatedMacros = useMemo(() => {
    if (!currentRec) return { lbm: 46, protein: 92, fat: 55, carbs: 140, calories: 1420 };
    const weight = currentRec.biometrics.currentWeightKg || 65;
    const fatPct = currentRec.biometrics.fatPercentage || 28;
    const intensity = currentRec.biometrics.intensityLevel || 'Moderately Active';

    const lbm = Math.round(weight * (1 - fatPct / 100) * 10) / 10;

    let proteinMultiplier = 1.8;
    let fatMultiplier = 1.0;

    if (intensity === 'Active at Gym') {
      proteinMultiplier = 2.2;
      fatMultiplier = 1.1;
    } else if (intensity === 'Extremely Active') {
      proteinMultiplier = 2.4;
      fatMultiplier = 1.2;
    } else if (intensity === 'Sedentary') {
      proteinMultiplier = 1.6;
      fatMultiplier = 0.9;
    }

    const proteinGrams = Math.round(lbm * proteinMultiplier);
    const fatGrams = Math.round(lbm * fatMultiplier);
    const proteinKcal = proteinGrams * 4;
    const fatKcal = fatGrams * 9;
    const baseCalories = proteinKcal + fatKcal;
    const carbsGrams = Math.round((baseCalories * 0.35) / 4);
    const totalCalories = proteinKcal + fatKcal + (carbsGrams * 4);

    return {
      lbm,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams,
      calories: totalCalories,
    };
  }, [currentRec?.biometrics.currentWeightKg, currentRec?.biometrics.fatPercentage, currentRec?.biometrics.intensityLevel]);

  // Previous Foods Total Calculations for Step 7
  const previousFoodTotals = useMemo(() => {
    if (!currentRec) return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    const habits = currentRec.eatingHabits;
    const allSelectedNames = [
      ...(habits.selectedBreakfastFoods || []),
      ...(habits.selectedLunchFoods || []),
      ...(habits.selectedSnackFoods || []),
      ...(habits.selectedDinnerFoods || []),
    ];

    let totalCal = 0;
    let totalCarb = 0;
    let totalProt = 0;
    let totalFat = 0;

    const allCatalog = [
      ...PREVIOUS_BREAKFAST_FOODS,
      ...PREVIOUS_LUNCH_FOODS,
      ...PREVIOUS_SNACK_FOODS,
      ...PREVIOUS_DINNER_FOODS,
    ];

    allSelectedNames.forEach((name) => {
      const match = allCatalog.find((item) => item.name === name);
      if (match) {
        totalCal += match.calories;
        totalCarb += match.carbs;
        totalProt += match.protein;
        totalFat += match.fat;
      }
    });

    return {
      calories: totalCal,
      carbs: totalCarb,
      protein: totalProt,
      fat: totalFat,
    };
  }, [currentRec?.eatingHabits]);

  const handleUpdateRecord = async (updated: LongTermSupportSessionRecord) => {
    setRecord(updated);
    await saveLongTermSupportRecord(updated);
  };

  const handleNextStep = async () => {
    if (!currentRec) return;
    const nextStep = Math.min(10, activeStep + 1);
    const updated = {
      ...currentRec,
      currentStep: nextStep,
      biometrics: {
        ...currentRec.biometrics,
        leanBodyMassKg: calculatedMacros.lbm,
        proteinGramsTarget: calculatedMacros.protein,
        fatGramsTarget: calculatedMacros.fat,
        carbsGramsTarget: calculatedMacros.carbs,
        dailyCalorieTarget: calculatedMacros.calories,
      },
    };
    await handleUpdateRecord(updated);
    setActiveStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignAgreement = async () => {
    if (!currentRec) return;
    setIsSaving(true);
    const updated = await signLongTermSupportAgreement(currentRec, clientName);
    setRecord(updated);
    setIsSaving(false);
    setSaveToast('✨ Agreement Signed! Start confirmation email sent to you & Admin.');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleToggleFoodSelection = (
    categoryKey: 'selectedBreakfastFoods' | 'selectedLunchFoods' | 'selectedSnackFoods' | 'selectedDinnerFoods',
    foodName: string
  ) => {
    if (!currentRec) return;
    const currentList = currentRec.eatingHabits[categoryKey] || [];
    const isSelected = currentList.includes(foodName);
    const nextList = isSelected ? currentList.filter((f) => f !== foodName) : [...currentList, foodName];

    const updatedHabits = {
      ...currentRec.eatingHabits,
      [categoryKey]: nextList,
      hasHighCarbHabits: true,
    };

    handleUpdateRecord({
      ...currentRec,
      eatingHabits: updatedHabits,
    });
  };

  const handleToggleRecipe = (recipe: LongTermSelectedRecipe) => {
    if (!currentRec) return;
    const prevIds = currentRec.recipePreferences.selectedRecipeIds || [];
    const prevList = currentRec.recipePreferences.selectedRecipes || [];
    const isSelected = prevIds.includes(recipe.id);

    const nextIds = isSelected ? prevIds.filter((id) => id !== recipe.id) : [...prevIds, recipe.id];
    const nextList = isSelected ? prevList.filter((r) => r.id !== recipe.id) : [...prevList, recipe];

    handleUpdateRecord({
      ...currentRec,
      recipePreferences: {
        ...currentRec.recipePreferences,
        selectedRecipeIds: nextIds,
        selectedRecipes: nextList,
      },
    });
  };

  const handleParqAnswer = (questionId: number, answer: 'YES' | 'NO') => {
    if (!currentRec) return;
    const currentAnswers = currentRec.parq.answers || {};
    const updatedAnswers = {
      ...currentAnswers,
      [questionId]: answer,
    };
    handleUpdateRecord({
      ...currentRec,
      parq: {
        ...currentRec.parq,
        answers: updatedAnswers,
      },
    });
  };

  const handleFinalizeAndPublishDiet = async () => {
    if (!currentRec) return;
    setIsSaving(true);

    const foodCategories = [
      currentRec.dietaryOrientation.dietType,
      ...currentRec.recipePreferences.proteinSources,
      ...currentRec.recipePreferences.cookingFats,
    ];
    const customizedChart = resolveCustomizedDietChart(
      currentRec.biometrics.mealsCount || 4,
      foodCategories,
      clientId
    );

    // Apply supplement preference
    if (!currentRec.goalsAndSupplements.openToSupplements) {
      customizedChart.preMealSupplementsHeader = 'WHOLE FOOD NOURISHMENT PROTOCOL:';
      customizedChart.preMealMicronutrientsHeader = 'WHOLE FOOD NUTRIENT DENSE STRATEGY:';
      customizedChart.meals = customizedChart.meals.map((m) => ({
        ...m,
        preMealSupplement: undefined,
        postMealSupplement: undefined,
      }));
    }

    publishClientDietChart(customizedChart, clientEmail, clientName);

    const finalizedRec: LongTermSupportSessionRecord = {
      ...currentRec,
      isCompleted: true,
    };
    await handleUpdateRecord(finalizedRec);

    setIsSaving(false);
    setSaveToast('🎉 Long-Term Protocol Confirmed & Diet Chart Prescribed to Your App!');
    setTimeout(() => {
      setSaveToast('');
      if (onBack) onBack();
    }, 2500);
  };

  if (!currentRec) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F6EF', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#0A1C44' }}>
          <Sparkles className="animate-spin" size={32} color="#0A1C44" />
          <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: 600 }}>Loading Long-Term Transformation Portal...</p>
        </div>
      </div>
    );
  }

  const handleStepClick = (targetStep: number) => {
    if (targetStep > 1 && !currentRec?.isPlanAssignedByAdmin) {
      setSaveToast('🔒 Please wait for Admin (Sneha Dey) to prescribe and send your specific plan before proceeding to agreement.');
      setTimeout(() => setSaveToast(''), 4500);
      return;
    }
    setActiveStep(targetStep);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8F6EF', minHeight: '100%' }}>
      {/* Top Sticky Header */}
      <div style={{ padding: '16px 18px 14px', backgroundColor: '#0A1C44', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 30, borderBottom: '2px solid #E8CA56' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <span style={{ fontSize: '10px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TRANSFORMATION PROGRAM
              </span>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Long-Term Support Portal
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: currentRec.isPlanAssignedByAdmin ? '#EEF4E8' : '#FAF6D9', color: currentRec.isPlanAssignedByAdmin ? '#38571A' : '#6B5418', fontWeight: 800 }}>
              {currentRec.isPlanAssignedByAdmin ? '⭐ Plan Prescribed' : '⏳ Awaiting Admin Plan'}
            </span>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#E8CA56', color: '#0A1C44', fontWeight: 800 }}>
              Step {activeStep} of 10
            </span>
          </div>
        </div>

        {/* Step Indicator Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {STEPS_NAV.map((s) => {
            const isDone = s.step < activeStep;
            const isCurrent = s.step === activeStep;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => handleStepClick(s.step)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: isCurrent ? '1.5px solid #E8CA56' : '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: isCurrent ? '#E8CA56' : isDone ? 'rgba(56, 87, 26, 0.4)' : 'rgba(255,255,255,0.06)',
                  color: isCurrent ? '#0A1C44' : '#FFFFFF',
                  fontSize: '10.5px',
                  fontWeight: isCurrent ? 800 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>{s.step}.</span>
                <span>{s.label}</span>
                {isDone && <Check size={11} color="#A3E635" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '18px 16px 36px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Toast Alert */}
        {saveToast && (
          <div className="animate-fade-in" style={{ padding: '12px 14px', backgroundColor: '#EEF4E8', borderRadius: '8px', border: '1.5px solid #38571A', display: 'flex', alignItems: 'center', gap: '10px', color: '#2B4214', fontSize: '12.5px', fontWeight: 700 }}>
            <CheckCircle2 size={20} color="#38571A" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: PACKAGE SELECTING (OFFICIAL LONG-TERM PRICING & POSTERS)          */}
        {/* ========================================================================= */}
        {activeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '12px 14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: '0 0 2px' }}>
                    1. Long-Term Clinical Nutrition Package
                  </h2>
                  <p style={{ fontSize: '12px', color: '#6B7063', margin: 0 }}>
                    Official clinical packages with complete follow-up days, blood diagnostics, and welcome gifts.
                  </p>
                </div>
                <span style={{ fontSize: '11px', color: '#38571A', fontWeight: 800, backgroundColor: '#EEF4E8', padding: '3px 8px', borderRadius: '4px' }}>
                  6 Clinical Durations
                </span>
              </div>
            </div>

            {/* Client Profile Details Banner: Name, Age, Occupation, Contact */}
            <div style={{ padding: '12px 14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1.5px solid #0A1C44', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>PARTICIPANT</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44' }}>{currentRec.clientName || clientName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>AGE</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>{currentRec.clientAge || 28} yrs</div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>OCCUPATION</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#047857' }}>{currentRec.clientOccupation || 'Corporate Professional'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>CONTACT NO</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>{currentRec.clientMobile || '9903711773'}</div>
                </div>
              </div>
            </div>

            {/* Admin Prescription Status Gate */}
            {!currentRec.isPlanAssignedByAdmin ? (
              <div style={{ padding: '16px 18px', backgroundColor: '#FFFBEB', borderRadius: '12px', border: '2px solid #F59E0B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} color="#D97706" />
                  <h3 style={{ fontSize: '14.5px', fontWeight: 900, color: '#92400E', margin: 0 }}>
                    🔒 Awaiting Clinical Plan Assignment from Sneha Dey (Admin)
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: '#78350F', margin: 0, lineHeight: 1.5 }}>
                  Your clinical nutritionist, Sneha Dey, is analyzing your registration data and metabolic markers. <strong>Only Admin can assign and send your specific plan</strong>. Once Sneha assigns your plan from the Admin Data Book, your package details and legal agreement will automatically unlock here.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '6px', borderTop: '1px dashed #FDE68A' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF3C7', padding: '3px 8px', borderRadius: '4px' }}>
                    ⏳ Status: Pending Admin Plan Assignment
                  </span>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Sneha,%20I%20am%20waiting%20for%20my%20prescribed%20Long-Term%20Nutrition%20Plan%20in%20the%20app."
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', fontWeight: 800, color: '#047857', backgroundColor: '#DEF7EC', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Inquire with Sneha via WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px 18px', backgroundColor: '#EEF4E8', borderRadius: '12px', border: '2px solid #38571A', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="#38571A" />
                    <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#2B4214', margin: 0 }}>
                      Official Plan Prescribed by Sneha Dey (Admin)
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFFFFF', backgroundColor: '#38571A', padding: '3px 10px', borderRadius: '6px' }}>
                    ✓ Prescribed & Dispatched
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#1B3B22', fontWeight: 700 }}>
                  Assigned Package: <strong style={{ color: '#0A1C44', fontSize: '15px' }}>{currentRec.package.name}</strong> • ₹{currentRec.package.priceInr.toLocaleString()}
                </div>

                {currentRec.adminRecommendationNote && (
                  <div style={{ fontSize: '12px', color: '#4F5C38', fontStyle: 'italic', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #B8D4A8' }}>
                    💬 <strong>Clinical Note:</strong> "{currentRec.adminRecommendationNote}"
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#0A1C44',
                      color: '#E8CA56',
                      fontSize: '12.5px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(10, 28, 68, 0.2)',
                    }}
                  >
                    <span>Accept Prescribed Plan & Review Agreement</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {DEFAULT_PACKAGES.map((pkg) => {
                const isSelected = currentRec.package.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handleUpdateRecord({ ...currentRec, package: { ...pkg, paymentLink: currentRec.package.paymentLink } })}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#FAF8F0' : '#FFFFFF',
                      border: isSelected ? '2.5px solid #0A1C44' : '1px solid #D9D8CC',
                      boxShadow: isSelected ? '0 6px 20px rgba(10, 28, 68, 0.12)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#66734A', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#F1EEDF', padding: '2px 8px', borderRadius: '4px' }}>
                            {pkg.durationMonths === 12 ? '1 YEAR COMPLETE' : `${pkg.durationMonths} MONTHS`}
                          </span>
                          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: '4px 0 2px' }}>
                            {pkg.name}
                          </h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '19px', fontWeight: 900, color: '#0A1C44' }}>₹{pkg.priceInr.toLocaleString()}</span>
                          <span style={{ fontSize: '11px', color: '#8A9568', textDecoration: 'line-through', display: 'block' }}>₹{pkg.originalPriceInr.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Follow-up Days Badge */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '8px 0 10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#EEF4E8', color: '#38571A', fontSize: '11.5px', fontWeight: 800 }}>
                        <Calendar size={13} />
                        <span>{pkg.followUpDays}</span>
                      </div>

                      {/* Blood Tests List */}
                      <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#242820' }}>
                        <strong style={{ color: '#0A1C44' }}>🩺 Diagnostics Included:</strong>
                        <ul style={{ margin: '4px 0 8px', paddingLeft: '16px', color: '#4F5C38', lineHeight: 1.4 }}>
                          {pkg.bloodTestsIncluded.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Welcome Gifts */}
                      <div style={{ fontSize: '11.5px', color: '#242820' }}>
                        <strong style={{ color: '#0A1C44' }}>🎁 Welcome Kit / Hampers:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                          {pkg.welcomeGifts.map((g, idx) => (
                            <span key={idx} style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FAF6D9', color: '#6B5418', border: '1px solid #E8DEB2' }}>
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Controls: Poster Preview & Admin Link */}
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #D9D8CC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      {pkg.posterImageUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChartModalUrl(pkg.posterImageUrl || null);
                            setChartModalTitle(`${pkg.name} - Official Poster`);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#FAF8F0',
                            border: '1px solid #D9D8CC',
                            color: '#0A1C44',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ImageIcon size={12} />
                          <span>View Plan Poster</span>
                        </button>
                      )}

                      {currentRec.package.paymentLink ? (
                        <a
                          href={currentRec.package.paymentLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            backgroundColor: '#0A1C44',
                            color: '#E8CA56',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                            textDecoration: 'none',
                          }}
                        >
                          <span>Pay & Unlock</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span style={{ fontSize: '10.5px', color: '#6B7063', fontStyle: 'italic' }}>
                          Admin link pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CLICKABLE AGREEMENT & EMAIL CONFIRMATION                          */}
        {/* ========================================================================= */}
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(() => {
              const agreementConfig = getLongTermAgreementConfig(currentRec?.package?.durationMonths || 1);
              return (
                <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #0A1C44', boxShadow: '0 4px 16px rgba(10, 28, 68, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={22} color="#0A1C44" />
                      <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                        2. Long-Term Support Agreement
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setChartModalUrl(agreementConfig.imagePath);
                        setChartModalTitle(agreementConfig.badgeTitle);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        border: '1px solid #FCD34D',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <ImageIcon size={14} />
                      <span>View Official Certificate Poster</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#4F5C38', lineHeight: 1.5, margin: '0 0 12px' }}>
                    Review and sign your official clinical commitment contract with Sneha Dey for the <strong>{currentRec?.package?.name || `${agreementConfig.durationWord} Package`}</strong>. Once accepted, you and our senior desk will receive automated start documentation via email.
                  </p>

                  {/* Certificate Styled Container */}
                  <div
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #D4AF37',
                      background: 'linear-gradient(180deg, #FFFDF8 0%, #FAF6ED 100%)',
                      padding: '16px',
                      boxShadow: 'inset 0 0 12px rgba(212, 175, 55, 0.08)',
                      margin: '12px 0',
                    }}
                  >
                    {/* Header Emblem */}
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        NUTRITION CONSULTATION
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#9A6B2F',
                          color: '#FFFFFF',
                          padding: '4px 18px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 900,
                          letterSpacing: '0.06em',
                          margin: '8px 0 6px',
                          boxShadow: '0 2px 6px rgba(154, 107, 47, 0.3)',
                        }}
                      >
                        {agreementConfig.badgeTitle}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#785D26', fontWeight: 700, fontStyle: 'italic' }}>
                        🌿 Please read each statement carefully and acknowledge your agreement. 🌿
                      </div>
                    </div>

                    {/* All 20 Points */}
                    <div
                      style={{
                        maxHeight: '340px',
                        overflowY: 'auto',
                        padding: '12px 14px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #E6DEC8',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        fontSize: '12px',
                        color: '#262626',
                        lineHeight: 1.55,
                      }}
                    >
                      {agreementConfig.points.map((pt, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span
                            style={{
                              minWidth: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: '#F7EED6',
                              color: '#9A6B2F',
                              fontSize: '11px',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '1px',
                              border: '1px solid #E8D6AC',
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span style={{ flex: 1 }}>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Date & Signature Row */}
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '10px 14px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px dashed #D4AF37',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        fontSize: '11.5px',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 800, color: '#9A6B2F' }}>DATE: </span>
                        <span style={{ color: '#111827', fontWeight: 700 }}>
                          {currentRec.agreement.startDate || new Date().toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 800, color: '#9A6B2F' }}>SIGNATURE: </span>
                        <span style={{ color: '#111827', fontWeight: 700 }}>
                          {currentRec.parq.clientSignatureName || clientName}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#785D26', fontWeight: 600 }}>
                      Thank you for trusting me with your health journey. Together, we work towards a healthier you!
                    </div>
                  </div>

                  {/* Sign Agreement Action Box */}
                  <div
                    onClick={() => {
                      if (!currentRec.agreement.isAccepted) {
                        handleSignAgreement();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      backgroundColor: currentRec.agreement.isAccepted ? '#EEF4E8' : '#FAF8F0',
                      border: currentRec.agreement.isAccepted ? '2px solid #38571A' : '1.5px solid #0A1C44',
                      cursor: 'pointer',
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: '2px solid #0A1C44',
                        backgroundColor: currentRec.agreement.isAccepted ? '#38571A' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      {currentRec.agreement.isAccepted && <Check size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44' }}>
                        {currentRec.agreement.isAccepted ? '✓ Agreement Formally Signed & Registered' : `Click to Sign & Accept Terms for ${agreementConfig.badgeTitle}`}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7063' }}>
                        {currentRec.agreement.isAccepted ? `Official confirmation email dispatched to ${currentRec.clientEmail}` : 'Triggers automated start email and unlocks PAR-Q and diagnostic protocols'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: EXACT 23-QUESTION CLINICAL PAR-Q FORM                             */}
        {/* ========================================================================= */}
        {activeStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px 16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #0A1C44' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <CheckCircle2 size={20} color="#9B2C2C" />
                <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#9B2C2C', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PAR-Q FORM
                </h2>
              </div>
              <p style={{ fontSize: '12px', color: '#4F5C38', margin: 0, lineHeight: 1.5 }}>
                Please read the following questions carefully and select <strong>YES</strong> or <strong>NO</strong> for each question. Answer all questions honestly and to the best of your ability.
              </p>
            </div>

            {/* SECTION A: MEDICAL HISTORY */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #D9D8CC', backgroundColor: '#FFFFFF' }}>
              <div style={{ padding: '10px 14px', backgroundColor: '#9B2C2C', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.05em' }}>
                  SECTION A: MEDICAL HISTORY
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, opacity: 0.9 }}>
                  Questions 1 – 13
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {PARQ_FORM_QUESTIONS.slice(0, 13).map((q) => {
                  const currentAns = (currentRec.parq.answers || {})[q.id] || 'NO';
                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        borderBottom: '1px solid #F1EEDF',
                        backgroundColor: currentAns === 'YES' ? '#FFF5F5' : '#FFFFFF',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'flex-start' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: currentAns === 'YES' ? '#C85A48' : '#0A1C44', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {q.id}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#242820', lineHeight: 1.4 }}>
                          {q.question}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleParqAnswer(q.id, 'YES')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: currentAns === 'YES' ? '2px solid #C85A48' : '1px solid #D9D8CC',
                            backgroundColor: currentAns === 'YES' ? '#C85A48' : '#FAF8F0',
                            color: currentAns === 'YES' ? '#FFFFFF' : '#4F5C38',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => handleParqAnswer(q.id, 'NO')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: currentAns === 'NO' ? '2px solid #38571A' : '1px solid #D9D8CC',
                            backgroundColor: currentAns === 'NO' ? '#38571A' : '#FAF8F0',
                            color: currentAns === 'NO' ? '#FFFFFF' : '#4F5C38',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION B: PHYSICAL ACTIVITY READINESS */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #D9D8CC', backgroundColor: '#FFFFFF' }}>
              <div style={{ padding: '10px 14px', backgroundColor: '#9B2C2C', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.05em' }}>
                  SECTION B: PHYSICAL ACTIVITY READINESS
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, opacity: 0.9 }}>
                  Questions 14 – 23
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {PARQ_FORM_QUESTIONS.slice(13).map((q) => {
                  const currentAns = (currentRec.parq.answers || {})[q.id] || 'NO';
                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid #F1EEDF',
                        backgroundColor: currentAns === 'YES' ? '#FFF5F5' : '#FFFFFF',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'flex-start' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: currentAns === 'YES' ? '#C85A48' : '#0A1C44', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {q.id}
                          </span>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#242820', lineHeight: 1.4 }}>
                            {q.question}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleParqAnswer(q.id, 'YES')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: currentAns === 'YES' ? '2px solid #C85A48' : '1px solid #D9D8CC',
                              backgroundColor: currentAns === 'YES' ? '#C85A48' : '#FAF8F0',
                              color: currentAns === 'YES' ? '#FFFFFF' : '#4F5C38',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => handleParqAnswer(q.id, 'NO')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: currentAns === 'NO' ? '2px solid #38571A' : '1px solid #D9D8CC',
                              backgroundColor: currentAns === 'NO' ? '#38571A' : '#FAF8F0',
                              color: currentAns === 'NO' ? '#FFFFFF' : '#4F5C38',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            NO
                          </button>
                        </div>
                      </div>

                      {/* Sub-inputs for Q22 and Q23 */}
                      {q.id === 22 && currentAns === 'YES' && (
                        <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#FAF8F0', borderRadius: '6px', border: '1px dashed #C85A48' }}>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#9B2C2C', display: 'block', marginBottom: '4px' }}>
                            {q.detailsPrompt}
                          </label>
                          <input
                            type="text"
                            value={currentRec.parq.q22PrescriptionDetails || ''}
                            onChange={(e) => handleUpdateRecord({ ...currentRec, parq: { ...currentRec.parq, q22PrescriptionDetails: e.target.value } })}
                            placeholder="e.g. Metformin 500mg once daily after dinner..."
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #D9D8CC', fontSize: '12px' }}
                          />
                        </div>
                      )}

                      {q.id === 23 && currentAns === 'YES' && (
                        <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#FAF8F0', borderRadius: '6px', border: '1px dashed #C85A48' }}>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#9B2C2C', display: 'block', marginBottom: '4px' }}>
                            {q.detailsPrompt}
                          </label>
                          <input
                            type="text"
                            value={currentRec.parq.q23SupplementDetails || ''}
                            onChange={(e) => handleUpdateRecord({ ...currentRec, parq: { ...currentRec.parq, q23SupplementDetails: e.target.value } })}
                            placeholder="e.g. Vitamin D3 60k weekly, Omega 3, Ashwagandha..."
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #D9D8CC', fontSize: '12px' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legal Affirmation Statement from image */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1.5px solid #0A1C44' }}>
              <p style={{ fontSize: '12px', color: '#242820', lineHeight: 1.5, margin: '0 0 10px', fontWeight: 600 }}>
                "I have answered the questions above to the best of my ability and affirm that my physical condition is good and I have no known conditions that would prevent me from participation."
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', display: 'block', marginBottom: '4px' }}>
                    CLIENT SIGNATURE NAME:
                  </label>
                  <input
                    type="text"
                    value={currentRec.parq.clientSignatureName || clientName}
                    onChange={(e) => handleUpdateRecord({ ...currentRec, parq: { ...currentRec.parq, clientSignatureName: e.target.value } })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D9D8CC', fontSize: '12px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', display: 'block', marginBottom: '4px' }}>
                    SNEHA'S NUTRITIONIST DESK:
                  </label>
                  <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#EEF4E8', border: '1px solid #B8D4A8', fontSize: '12px', fontWeight: 800, color: '#38571A' }}>
                    ✓ Sneha Dey: Human Performance Nutritionist
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: BLOOD TEST SCHEDULE & TRACKING                                    */}
        {/* ========================================================================= */}
        {activeStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <TestTube size={18} color="#6B5418" />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  4. Multi-Month Blood Diagnostics Schedule
                </h2>
              </div>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Routine diagnostic tracking across your transformation duration:
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { phase: 'Phase 1: Baseline Month 1', date: currentRec.bloodTest.baselineDate, desc: '1 Sugar Fasting Test, 1 Vitamin B12 Test, 1 D25 Hydroxyl Test, 1 Lipoprotein Profile' },
                { phase: 'Phase 2: Mid-Plan Check (Month 2)', date: currentRec.bloodTest.midTermDate, desc: '1 Sugar Fasting Test, 1 Vitamin B12 Test, 1 D25 Hydroxyl Test (Monitoring cellular adaptation)' },
                { phase: 'Phase 3: Transformation Audit & Exercise Chart', date: currentRec.bloodTest.finalDate, desc: '1 Sugar Fasting Test, 1 Vitamin B12 Test, 1 D25 Hydroxyl Test + 1 Personalized Exercise Chart provided after 3 months (manually provided)' },
              ].map((b, idx) => (
                <div key={idx} style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1.5px solid #E8CA56' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44' }}>{b.phase}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#38571A', backgroundColor: '#EEF4E8', padding: '2px 8px', borderRadius: '4px' }}>
                      📅 {b.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#4F5C38', margin: '6px 0 0' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: GIFT HAMPERS SELECTION                                            */}
        {/* ========================================================================= */}
        {activeStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Gift size={18} color="#C85A48" />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  5. Choose Your Welcome Gift Hamper
                </h2>
              </div>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Select your complimentary clinical welcome starter kit shipped directly to your door:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {GIFT_HAMPERS.map((g) => {
                const isSelected = currentRec.gift.selectedGiftId === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => handleUpdateRecord({ ...currentRec, gift: { selectedGiftId: g.id, giftTitle: g.title, selectedAt: Date.now() } })}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#FAF8F0' : '#FFFFFF',
                      border: isSelected ? '2px solid #0A1C44' : '1px solid #D9D8CC',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isSelected ? '0 4px 16px rgba(10, 28, 68, 0.1)' : 'none',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', backgroundColor: isSelected ? '#0A1C44' : '#F1EEDF', color: isSelected ? '#E8CA56' : '#4F5C38' }}>
                        {g.badge}
                      </span>
                      <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0A1C44', margin: '8px 0 4px' }}>
                        {g.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#4F5C38', lineHeight: 1.4, margin: 0 }}>
                        {g.description}
                      </p>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: isSelected ? '#38571A' : '#6B7063' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? '2px solid #38571A' : '2px solid #D9D8CC', backgroundColor: isSelected ? '#38571A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                        {isSelected && <Check size={12} />}
                      </div>
                      <span>{isSelected ? 'Selected Hamper' : 'Select This Hamper'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: GOALS & SUPPLEMENT PREFERENCE (CRITICAL TOGGLE)                    */}
        {/* ========================================================================= */}
        {activeStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: '0 0 4px' }}>
                6. Goals Selection & Supplement Preference
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Select your goals and declare your openness to clinical supplements:
              </p>
            </div>

            {/* CRITICAL QUESTION: Are you open to supplements? */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#0A1C44',
                color: '#FFFFFF',
                border: '2px solid #E8CA56',
                boxShadow: '0 6px 20px rgba(10, 28, 68, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Pill size={20} color="#E8CA56" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Are you open to using clinical supplements?
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: '#C8D6EC', lineHeight: 1.4, margin: '0 0 12px' }}>
                If <strong>YES</strong>, our Admin Desk will auto-embed pre/post meal & workout supplements into your chart. If <strong>NO</strong>, your diet chart will rely 100% on whole foods.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleUpdateRecord({ ...currentRec, goalsAndSupplements: { ...currentRec.goalsAndSupplements, openToSupplements: true } })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: currentRec.goalsAndSupplements.openToSupplements ? '2px solid #E8CA56' : '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: currentRec.goalsAndSupplements.openToSupplements ? '#E8CA56' : 'rgba(255,255,255,0.08)',
                    color: currentRec.goalsAndSupplements.openToSupplements ? '#0A1C44' : '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>YES, Include Supplements</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateRecord({ ...currentRec, goalsAndSupplements: { ...currentRec.goalsAndSupplements, openToSupplements: false } })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: !currentRec.goalsAndSupplements.openToSupplements ? '2px solid #E8CA56' : '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: !currentRec.goalsAndSupplements.openToSupplements ? '#E8CA56' : 'rgba(255,255,255,0.08)',
                    color: !currentRec.goalsAndSupplements.openToSupplements ? '#0A1C44' : '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>NO, 100% Whole Foods Only</span>
                </button>
              </div>
            </div>

            {/* Goals Multi-Selection Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {GOAL_OPTIONS.map((goal) => {
                const isSelected = currentRec.goalsAndSupplements.selectedGoals.includes(goal);
                return (
                  <div
                    key={goal}
                    onClick={() => {
                      const prev = currentRec.goalsAndSupplements.selectedGoals;
                      const next = isSelected ? prev.filter((g) => g !== goal) : [...prev, goal];
                      handleUpdateRecord({ ...currentRec, goalsAndSupplements: { ...currentRec.goalsAndSupplements, selectedGoals: next } });
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#EEF4E8' : '#FFFFFF',
                      border: isSelected ? '1.5px solid #38571A' : '1px solid #D9D8CC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? '#2B4214' : '#242820',
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: isSelected ? '2px solid #38571A' : '1.5px solid #66734A', backgroundColor: isSelected ? '#38571A' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
                      {isSelected && <Check size={12} />}
                    </div>
                    <span>{goal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: PREVIOUS EATING HABITS (IMAGE FOOD BOXES WITH '+' BUTTON)          */}
        {/* ========================================================================= */}
        {activeStep === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px 16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #0A1C44' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: '0 0 2px' }}>
                    7. Previous Eating Habits & Lipogenesis Analysis
                  </h2>
                  <p style={{ fontSize: '12px', color: '#6B7063', margin: 0 }}>
                    Click the <strong>'+ Add Food'</strong> button on foods you typically ate for each meal:
                  </p>
                </div>

                {/* Macro summary badge */}
                <div style={{ padding: '6px 12px', backgroundColor: '#FFF5F5', borderRadius: '8px', border: '1.5px solid #C85A48', textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#C85A48', textTransform: 'uppercase' }}>Est. Previous Carbohydrates</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#9B2C2C' }}>
                    {previousFoodTotals.carbs}g Carbs ({previousFoodTotals.calories} kcal)
                  </div>
                </div>
              </div>
            </div>

            {/* 1. BREAKFAST HABIT SELECTOR */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                  🍳 1. PREVIOUS BREAKFAST (CLICK '+' TO ADD)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setChartModalUrl('/images/food-charts/veg-breakfast.jpg');
                      setChartModalTitle('30 Indian Veg Breakfast Options Chart');
                    }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#EEF4E8', color: '#38571A', border: '1px solid #B8D4A8', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ImageIcon size={13} />
                    <span>Veg Chart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChartModalUrl('/images/food-charts/nonveg-breakfast.jpg');
                      setChartModalTitle('30 Indian Non-Veg Breakfast Options Chart');
                    }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FFF5F5', color: '#C85A48', border: '1px solid #FED7D7', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ImageIcon size={13} />
                    <span>Non-Veg Chart</span>
                  </button>
                </div>
              </div>

              {/* Breakfast Dishes Grid with Food Image & '+' Button */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {PREVIOUS_BREAKFAST_FOODS.map((item) => {
                  const isChecked = (currentRec.eatingHabits.selectedBreakfastFoods || []).includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleToggleFoodSelection('selectedBreakfastFoods', item.name)}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: isChecked ? '#FAF2F0' : '#FFFFFF',
                        border: isChecked ? '2px solid #C85A48' : '1px solid #D9D8CC',
                        boxShadow: isChecked ? '0 4px 14px rgba(200, 90, 72, 0.15)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        {/* Food Plate Photo */}
                        <div style={{ height: '90px', backgroundColor: '#FAF8F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              // Fallback if image path is unavailable
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div style={{ padding: '10px 10px 4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: isChecked ? '#9B2C2C' : '#0A1C44' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: item.type === 'Veg' ? '#EEF4E8' : '#FFF5F5', color: item.type === 'Veg' ? '#38571A' : '#C85A48' }}>
                              {item.type}
                            </span>
                          </div>

                          <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '4px', lineHeight: 1.4 }}>
                            Carbs: <strong style={{ color: '#C85A48' }}>{item.carbs}g</strong> • Prot: {item.protein}g • Fat: {item.fat}g ({item.calories} kcal)
                          </div>
                        </div>
                      </div>

                      {/* '+' Add Button */}
                      <div style={{ padding: '8px 10px', borderTop: '1px dashed #ECEAE0', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFoodSelection('selectedBreakfastFoods', item.name);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isChecked ? '#38571A' : '#0A1C44',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isChecked ? (
                            <>
                              <Check size={12} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add Food</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. LUNCH HABIT SELECTOR */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                  🍛 2. PREVIOUS LUNCH (CLICK '+' TO ADD)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setChartModalUrl('/images/food-charts/nonveg-lunch.jpg');
                    setChartModalTitle('30 Indian Lunch Options Chart');
                  }}
                  style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF6D9', color: '#6B5418', border: '1px solid #E8DEB2', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ImageIcon size={13} />
                  <span>View 30 Lunch Chart</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {PREVIOUS_LUNCH_FOODS.map((item) => {
                  const isChecked = (currentRec.eatingHabits.selectedLunchFoods || []).includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleToggleFoodSelection('selectedLunchFoods', item.name)}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: isChecked ? '#FAF2F0' : '#FFFFFF',
                        border: isChecked ? '2px solid #C85A48' : '1px solid #D9D8CC',
                        boxShadow: isChecked ? '0 4px 14px rgba(200, 90, 72, 0.15)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        {/* Food Plate Photo */}
                        <div style={{ height: '90px', backgroundColor: '#FAF8F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div style={{ padding: '10px 10px 4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: isChecked ? '#9B2C2C' : '#0A1C44' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: item.type === 'Veg' ? '#EEF4E8' : '#FFF5F5', color: item.type === 'Veg' ? '#38571A' : '#C85A48' }}>
                              {item.type}
                            </span>
                          </div>

                          <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '4px', lineHeight: 1.4 }}>
                            Carbs: <strong style={{ color: '#C85A48' }}>{item.carbs}g</strong> • Prot: {item.protein}g • Fat: {item.fat}g ({item.calories} kcal)
                          </div>
                        </div>
                      </div>

                      {/* '+' Add Button */}
                      <div style={{ padding: '8px 10px', borderTop: '1px dashed #ECEAE0', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFoodSelection('selectedLunchFoods', item.name);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isChecked ? '#38571A' : '#0A1C44',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isChecked ? (
                            <>
                              <Check size={12} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add Food</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. SNACKS HABIT SELECTOR */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                  🥟 3. PREVIOUS EVENING SNACKS (CLICK '+' TO ADD)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setChartModalUrl('/images/food-charts/veg-snacks.png');
                    setChartModalTitle('30 Indian Snacks Options Chart');
                  }}
                  style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#EEF4E8', color: '#38571A', border: '1px solid #B8D4A8', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ImageIcon size={13} />
                  <span>View 30 Snacks Chart</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {PREVIOUS_SNACK_FOODS.map((item) => {
                  const isChecked = (currentRec.eatingHabits.selectedSnackFoods || []).includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleToggleFoodSelection('selectedSnackFoods', item.name)}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: isChecked ? '#FAF2F0' : '#FFFFFF',
                        border: isChecked ? '2px solid #C85A48' : '1px solid #D9D8CC',
                        boxShadow: isChecked ? '0 4px 14px rgba(200, 90, 72, 0.15)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        {/* Food Plate Photo */}
                        <div style={{ height: '90px', backgroundColor: '#FAF8F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div style={{ padding: '10px 10px 4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: isChecked ? '#9B2C2C' : '#0A1C44' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: item.type === 'Veg' ? '#EEF4E8' : '#FFF5F5', color: item.type === 'Veg' ? '#38571A' : '#C85A48' }}>
                              {item.type}
                            </span>
                          </div>

                          <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '4px', lineHeight: 1.4 }}>
                            Carbs: <strong style={{ color: '#C85A48' }}>{item.carbs}g</strong> • Prot: {item.protein}g • Fat: {item.fat}g ({item.calories} kcal)
                          </div>
                        </div>
                      </div>

                      {/* '+' Add Button */}
                      <div style={{ padding: '8px 10px', borderTop: '1px dashed #ECEAE0', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFoodSelection('selectedSnackFoods', item.name);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isChecked ? '#38571A' : '#0A1C44',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isChecked ? (
                            <>
                              <Check size={12} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add Food</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. DINNER HABIT SELECTOR */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                  🍲 4. PREVIOUS DINNER (CLICK '+' TO ADD)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setChartModalUrl('/images/food-charts/veg-dinner.jpg');
                      setChartModalTitle('30 Indian Veg Dinner Options Chart');
                    }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#EEF4E8', color: '#38571A', border: '1px solid #B8D4A8', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ImageIcon size={13} />
                    <span>Veg Dinner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChartModalUrl('/images/food-charts/nonveg-dinner.png');
                      setChartModalTitle('30 Indian Non-Veg Dinner Options Chart');
                    }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FFF5F5', color: '#C85A48', border: '1px solid #FED7D7', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ImageIcon size={13} />
                    <span>Non-Veg Dinner</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {PREVIOUS_DINNER_FOODS.map((item) => {
                  const isChecked = (currentRec.eatingHabits.selectedDinnerFoods || []).includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleToggleFoodSelection('selectedDinnerFoods', item.name)}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: isChecked ? '#FAF2F0' : '#FFFFFF',
                        border: isChecked ? '2px solid #C85A48' : '1px solid #D9D8CC',
                        boxShadow: isChecked ? '0 4px 14px rgba(200, 90, 72, 0.15)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        {/* Food Plate Photo */}
                        <div style={{ height: '90px', backgroundColor: '#FAF8F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div style={{ padding: '10px 10px 4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: isChecked ? '#9B2C2C' : '#0A1C44' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: item.type === 'Veg' ? '#EEF4E8' : '#FFF5F5', color: item.type === 'Veg' ? '#38571A' : '#C85A48' }}>
                              {item.type}
                            </span>
                          </div>

                          <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '4px', lineHeight: 1.4 }}>
                            Carbs: <strong style={{ color: '#C85A48' }}>{item.carbs}g</strong> • Prot: {item.protein}g • Fat: {item.fat}g ({item.calories} kcal)
                          </div>
                        </div>
                      </div>

                      {/* '+' Add Button */}
                      <div style={{ padding: '8px 10px', borderTop: '1px dashed #ECEAE0', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFoodSelection('selectedDinnerFoods', item.name);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isChecked ? '#38571A' : '#0A1C44',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isChecked ? (
                            <>
                              <Check size={12} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add Food</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COMPREHENSIVE MACRONUTRIENT DISTRIBUTION, CARB METABOLISM & LBM SECTION */}
            <MacronutrientMetabolismSection
              clientId={currentRec.clientId}
              clientEmail={currentRec.clientEmail}
              clientName={currentRec.clientName}
              initialWeight={currentRec.biometrics.currentWeightKg}
              initialBodyFat={currentRec.biometrics.fatPercentage || 22}
              initialIntensity={
                currentRec.biometrics.intensityLevel === 'Sedentary'
                  ? 1.5
                  : currentRec.biometrics.intensityLevel === 'Moderately Active'
                  ? 2.0
                  : 2.5
              }
              selectedBreakfastFoods={currentRec.eatingHabits.selectedBreakfastFoods}
              selectedLunchFoods={currentRec.eatingHabits.selectedLunchFoods}
              selectedSnackFoods={currentRec.eatingHabits.selectedSnackFoods}
              selectedDinnerFoods={currentRec.eatingHabits.selectedDinnerFoods}
              onSavePreferences={(prefs) => {
                handleUpdateRecord({
                  ...currentRec,
                  biometrics: {
                    ...currentRec.biometrics,
                    fatPercentage: prefs.bodyFatPercentage,
                    leanBodyMassKg: prefs.leanBodyMassKg,
                    proteinGramsTarget: prefs.proteinRequirementGrams,
                    fatGramsTarget: prefs.fatRequirementGrams,
                  },
                  dietaryOrientation: {
                    dietType: prefs.autoClassifiedDiet.includes('Vegan')
                      ? 'Vegan'
                      : prefs.autoClassifiedDiet.includes('Pescatarian')
                      ? 'Pescatarian'
                      : prefs.autoClassifiedDiet.includes('Lacto-Ovo')
                      ? 'Eggetarian'
                      : prefs.dietBase === 'Non-Veg'
                      ? 'Non-Vegetarian'
                      : 'Vegetarian',
                  },
                });
              }}
            />

            {/* VISUAL LIPOGENESIS EDUCATIONAL DIAGRAM COMPONENT */}
            <LipogenesisEducationalDiagram />
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 8: BIOMETRICS, ROUND SCROLL SCALE & MACRO FORMULA                     */}
        {/* ========================================================================= */}
        {activeStep === 8 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: '0 0 4px' }}>
                8. Biometrics & Clinical Macro Calculations
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Rotate the circular dial to calibrate your body weight and view live mathematical macro breakdown:
              </p>
            </div>

            {/* Circular Rotating Weight Scale */}
            <CircularWeightPicker
              value={currentRec.biometrics.currentWeightKg}
              onChange={(val) => {
                const updatedBio = { ...currentRec.biometrics, currentWeightKg: val };
                handleUpdateRecord({ ...currentRec, biometrics: updatedBio });
              }}
              label="Current Body Weight"
              subtitle="Drag dial to set exact weight in KG"
            />

            {/* Intensity & Meals Count Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', display: 'block', marginBottom: '6px' }}>
                  ACTIVITY INTENSITY
                </label>
                <select
                  value={currentRec.biometrics.intensityLevel}
                  onChange={(e) => {
                    const updatedBio = { ...currentRec.biometrics, intensityLevel: e.target.value as any };
                    handleUpdateRecord({ ...currentRec, biometrics: updatedBio });
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid #66734A', fontSize: '12px', fontWeight: 700, color: '#4F5C38' }}
                >
                  <option value="Sedentary">Sedentary (Desk Job)</option>
                  <option value="Moderately Active">Moderately Active (Daily Movement)</option>
                  <option value="Active at Gym">Active at Gym (3-5x Heavy Training)</option>
                  <option value="Extremely Active">Extremely Active (Athletes / Players)</option>
                </select>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', display: 'block', marginBottom: '6px' }}>
                  MEALS PER DAY (3, 4, or 5)
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[3, 4, 5].map((count) => {
                    const isSelected = currentRec.biometrics.mealsCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          const updatedBio = { ...currentRec.biometrics, mealsCount: count as any };
                          handleUpdateRecord({ ...currentRec, biometrics: updatedBio });
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '6px',
                          border: isSelected ? '2px solid #0A1C44' : '1px solid #D9D8CC',
                          backgroundColor: isSelected ? '#0A1C44' : '#FAF8F0',
                          color: isSelected ? '#E8CA56' : '#242820',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        {count} Meals
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Calculated Macro Formula Breakdown */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#0A1C44',
                color: '#FFFFFF',
                border: '1.5px solid #E8CA56',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#E8CA56', textTransform: 'uppercase' }}>
                  CLINICAL FORMULA MATH
                </span>
                <span style={{ fontSize: '11px', color: '#A3E635', fontWeight: 700 }}>
                  LBM: {calculatedMacros.lbm} kg
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '10px', color: '#E8CA56' }}>CALORIES</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>{calculatedMacros.calories}</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '10px', color: '#A3E635' }}>PROTEIN</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>{calculatedMacros.protein}g</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '10px', color: '#F6AD55' }}>FAT</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>{calculatedMacros.fat}g</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '10px', color: '#63B3ED' }}>CARBS</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>{calculatedMacros.carbs}g</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 9: DIETARY OPTIONS (TICK BOXES)                                      */}
        {/* ========================================================================= */}
        {activeStep === 9 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: '0 0 4px' }}>
                9. Select Your Dietary Orientation
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Choose the foundation for your clinical recipes:
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { type: 'Vegetarian', title: '🧀 Pure Vegetarian (Lacto-Vegetarian)', desc: 'Dairy, Paneer, Curd, Ghee, Whole grains & legumes' },
                { type: 'Eggetarian', title: '🥚 Eggetarian (Lacto-Ovo-Vegetarian)', desc: 'Whole eggs, Dairy, Paneer, Healthy fats & plant proteins' },
                { type: 'Non-Vegetarian', title: '🍗 Non-Vegetarian (Pollo-Pescatarian)', desc: 'Chicken breast, Fish, Eggs, Dairy, Healthy cooking fats' },
                { type: 'Pescatarian', title: '🐟 Pescatarian (Fish & Seafood + Dairy)', desc: 'Fish fillets, Eggs, Dairy, Ghee, Olive Oil, High Omega-3' },
                { type: 'Vegan', title: '🌱 100% Vegan (Plant-Based)', desc: 'Tofu, Plant protein isolates, Coconut oil, Nuts & seeds' },
              ].map((d) => {
                const isSelected = currentRec.dietaryOrientation.dietType === d.type;
                return (
                  <div
                    key={d.type}
                    onClick={() => handleUpdateRecord({ ...currentRec, dietaryOrientation: { dietType: d.type as any } })}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#FAF8F0' : '#FFFFFF',
                      border: isSelected ? '2px solid #0A1C44' : '1px solid #D9D8CC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44' }}>{d.title}</div>
                      <div style={{ fontSize: '11.5px', color: '#4F5C38', marginTop: '2px' }}>{d.desc}</div>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: isSelected ? '2px solid #38571A' : '2px solid #D9D8CC', backgroundColor: isSelected ? '#38571A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      {isSelected && <Check size={13} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 10: RECIPE & COOKING FATS CUSTOMIZER (CHICKEN, PANEER, FISH, ETC.)    */}
        {/* ========================================================================= */}
        {activeStep === 10 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #0A1C44' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <ChefHat size={20} color="#0A1C44" />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  10. Clinical Recipe & Cooking Fats Selector
                </h2>
              </div>
              <p style={{ fontSize: '12.5px', color: '#4F5C38', margin: 0 }}>
                Select your favorite recipes for Chicken, Paneer, Fish, Whole Eggs, and Whey. Our engine will calibrate these into your personalized diet chart!
              </p>
            </div>

            {/* Selected Recipes Counter Banner */}
            <div style={{ padding: '12px 14px', backgroundColor: '#0A1C44', borderRadius: '10px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#E8CA56' }}>
                <Sparkles size={16} />
                <span>Selected Recipes: {(currentRec.recipePreferences.selectedRecipeIds || []).length} Prescribed</span>
              </div>
              <span style={{ fontSize: '11px', color: '#A3E635', fontWeight: 700 }}>
                ✓ Auto-Synced to Diet Chart Engine
              </span>
            </div>

            {/* Recipe Category Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['All', 'Paneer', 'Chicken', 'Fish', 'Eggs', 'Whey', 'Vegan'].map((cat) => {
                const isCatActive = recipeCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRecipeCategoryFilter(cat)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: isCatActive ? '1.5px solid #0A1C44' : '1px solid #D9D8CC',
                      backgroundColor: isCatActive ? '#0A1C44' : '#FFFFFF',
                      color: isCatActive ? '#E8CA56' : '#242820',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {cat === 'All' ? '🍽️ All Recipes' : cat === 'Paneer' ? '🧀 Paneer & Dairy' : cat === 'Chicken' ? '🍗 Chicken' : cat === 'Fish' ? '🐟 Fish & Seafood' : cat === 'Eggs' ? '🥚 Whole Eggs' : cat === 'Whey' ? '🥛 Whey Isolate' : '🌱 Vegan'}
                  </button>
                );
              })}
            </div>

            {/* Interactive Recipes Grid (Chicken, Paneer, Fish, Eggs, Whey, Vegan) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '12px' }}>
              {CLINICAL_RECIPES_CATALOG
                .filter((r) => recipeCategoryFilter === 'All' || r.category === recipeCategoryFilter)
                .map((recipe) => {
                  const isSelected = (currentRec.recipePreferences.selectedRecipeIds || []).includes(recipe.id);
                  return (
                    <div
                      key={recipe.id}
                      onClick={() => handleToggleRecipe(recipe)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? '#FAF8F0' : '#FFFFFF',
                        border: isSelected ? '2px solid #38571A' : '1.5px solid #D9D8CC',
                        boxShadow: isSelected ? '0 4px 16px rgba(56, 87, 26, 0.12)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A' }}>
                            {recipe.category}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44' }}>
                            {recipe.calories} kcal
                          </span>
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: '0 0 6px' }}>
                          {recipe.title}
                        </h4>

                        <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#FAF6D9', border: '1px solid #E8DEB2', fontSize: '11px', color: '#6B5418', fontWeight: 700, marginBottom: '8px' }}>
                          🥥 Fat Used: <strong>{recipe.cookingFat}</strong>
                        </div>

                        <p style={{ fontSize: '11.5px', color: '#4F5C38', margin: '0 0 10px', lineHeight: 1.45 }}>
                          {recipe.instructions}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #D9D8CC', paddingTop: '8px', marginTop: '4px' }}>
                        <div style={{ fontSize: '11px', color: '#6B7063' }}>
                          <strong style={{ color: '#38571A' }}>{recipe.proteinGrams}g Protein</strong> • {recipe.fatGrams}g Fat • {recipe.carbsGrams}g Carbs
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 800, color: isSelected ? '#38571A' : '#6B7063' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: isSelected ? '2px solid #38571A' : '1.5px solid #D9D8CC', backgroundColor: isSelected ? '#38571A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                            {isSelected && <Check size={12} />}
                          </div>
                          <span>{isSelected ? 'Prescribed' : 'Select'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 1. Healthy Cooking Fats & Oils Selector */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#66734A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🥑 HEALTHY COOKING FATS & OILS (SELECT 2 OR MORE)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '8px' }}>
                {COOKING_FATS_OPTIONS.map((fat) => {
                  const isSelected = (currentRec.recipePreferences.cookingFats || []).includes(fat.name);
                  return (
                    <button
                      key={fat.id}
                      type="button"
                      onClick={() => {
                        const prev = currentRec.recipePreferences.cookingFats || [];
                        const next = isSelected ? prev.filter((f) => f !== fat.name) : [...prev, fat.name];
                        handleUpdateRecord({ ...currentRec, recipePreferences: { ...currentRec.recipePreferences, cookingFats: next } });
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#EEF4E8' : '#FAF8F0',
                        border: isSelected ? '2px solid #38571A' : '1px solid #D9D8CC',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0A1C44' }}>{fat.name}</div>
                      <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '2px' }}>{fat.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Protein Sources */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#66734A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🍗 HIGH BIOLOGICAL VALUE PROTEIN SOURCES
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '8px' }}>
                {PROTEIN_OPTIONS.map((prot) => {
                  const isSelected = (currentRec.recipePreferences.proteinSources || []).includes(prot.name);
                  return (
                    <button
                      key={prot.id}
                      type="button"
                      onClick={() => {
                        const prev = currentRec.recipePreferences.proteinSources || [];
                        const next = isSelected ? prev.filter((p) => p !== prot.name) : [...prev, prot.name];
                        handleUpdateRecord({ ...currentRec, recipePreferences: { ...currentRec.recipePreferences, proteinSources: next } });
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#EEF4E8' : '#FAF8F0',
                        border: isSelected ? '2px solid #38571A' : '1px solid #D9D8CC',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0A1C44' }}>{prot.name}</div>
                      <div style={{ fontSize: '10.5px', color: '#4F5C38', marginTop: '2px' }}>{prot.type}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Wholesome Fiber & Complex Carbs */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D9D8CC' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#66734A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🌾 WHOLESOME FIBER & COMPLEX CARBOHYDRATES
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '8px' }}>
                {CARBS_OPTIONS.map((carb) => {
                  const isSelected = (currentRec.recipePreferences.carbSources || []).includes(carb.name);
                  return (
                    <button
                      key={carb.id}
                      type="button"
                      onClick={() => {
                        const prev = currentRec.recipePreferences.carbSources || [];
                        const next = isSelected ? prev.filter((c) => c !== carb.name) : [...prev, carb.name];
                        handleUpdateRecord({ ...currentRec, recipePreferences: { ...currentRec.recipePreferences, carbSources: next } });
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#EEF4E8' : '#FAF8F0',
                        border: isSelected ? '2px solid #38571A' : '1px solid #D9D8CC',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0A1C44' }}>{carb.name}</div>
                      <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '2px' }}>{carb.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Final Action Button */}
            <div style={{ padding: '18px', backgroundColor: '#0A1C44', borderRadius: '12px', color: '#FFFFFF', textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#E8CA56', margin: '0 0 6px' }}>
                Ready to Prescribe & Publish Diet Chart?
              </h3>
              <p style={{ fontSize: '12px', color: '#C8D6EC', margin: '0 0 14px' }}>
                This will automatically calibrate your {currentRec.biometrics.mealsCount}-meal clinical plan ({currentRec.dietaryOrientation.dietType}) with your chosen recipes and sync with your app.
              </p>
              <button
                type="button"
                onClick={handleFinalizeAndPublishDiet}
                disabled={isSaving}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#E8CA56',
                  color: '#0A1C44',
                  fontWeight: 900,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={16} />
                <span>{isSaving ? 'Publishing Diet Chart...' : 'Finalize & Publish My Diet Chart'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#FAF8F0',
                border: '1.5px solid #D9D8CC',
                color: '#0A1C44',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={16} /> Previous
            </button>
          ) : <div />}

          {activeStep < 10 && (
            <button
              type="button"
              onClick={handleNextStep}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#0A1C44',
                color: '#E8CA56',
                fontWeight: 800,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>

      {/* FULL-SCREEN IMAGE MODAL VIEWER FOR 30 INDIAN FOOD CHARTS & PACKAGE POSTERS */}
      {chartModalUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 28, 68, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '14px',
          }}
        >
          <div
            className="animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '960px',
              maxHeight: '92vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #0A1C44',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '14px 18px', backgroundColor: '#0A1C44', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} color="#E8CA56" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {chartModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setChartModalUrl(null)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Image Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#1A202C', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={chartModalUrl}
                alt={chartModalTitle}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
