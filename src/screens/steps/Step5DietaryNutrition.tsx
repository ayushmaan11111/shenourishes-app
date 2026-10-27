import React from 'react';
import { MacronutrientEducationDiagram } from '../../components/nutrition/MacronutrientEducationDiagram';
import { SingleCardSelect } from '../../components/common/CardSelect';
import { publishClientDietChart } from '../../services/clinicalDietTemplates';
import { resolveCustomizedDietChart } from '../../services/customizedMealPlans';
import { Check, Sparkles } from 'lucide-react';
import type {
  DietaryNutrition,
  DietType,
  DailyWaterIntake,
  DailyMeals,
  EatingOutFrequency,
  SmokingStatus,
  AlcoholStatus,
  AlcoholDrinksPerWeek,
} from '../../types/customer';

interface Step5Props {
  data: DietaryNutrition;
  onChange: (data: DietaryNutrition) => void;
  errors: Record<string, string>;
}

const MEAL_COUNT_OPTIONS = [
  {
    count: 3,
    title: '3 Meals / Day',
    subtitle: 'Morning • Lunch • Night (Dry Meals)',
    badge: '3 Macro Blocks',
    icon: '🍽️',
  },
  {
    count: 4,
    title: '4 Meals / Day',
    subtitle: 'Morning • Mid-Day • Post-Workout • Dinner',
    badge: 'Optimal Hypertrophy',
    icon: '⚡',
  },
  {
    count: 5,
    title: '5 Meals / Day',
    subtitle: '5 Timed Recovery & Protein Blocks',
    badge: 'Frequent Fuel',
    icon: '🔥',
  },
];

const FOOD_CATEGORY_OPTIONS = [
  {
    id: 'dairy',
    title: 'Dairy Products',
    icon: '🥛',
    examples: 'Paneer, Milk, Full Fat Greek Yogurt, Pure Butter, Ghee',
    category: 'DAIRY',
  },
  {
    id: 'eggs',
    title: 'Eggs',
    icon: '🥚',
    examples: 'Whole Boiled Eggs, Egg Bhurji, Mushroom Baked Egg Salad',
    category: 'EGGS',
  },
  {
    id: 'chicken',
    title: 'Chicken & Poultry',
    icon: '🍗',
    examples: 'Chicken Breast, Chicken Hariyali Kebab, Grilled Tikka',
    category: 'POULTRY',
  },
  {
    id: 'fish',
    title: 'Fish & Seafood',
    icon: '🐟',
    examples: 'Bhetki Fillet, Rohu, Pomfret Tikka, Prawns (Chingri Pepper Roast)',
    category: 'SEAFOOD',
  },
  {
    id: 'vegan',
    title: 'Vegan & Plant-Based',
    icon: '🌱',
    examples: 'Organic Tofu, Tempeh, Millets, Quinoa, Coconut Milk, Chia & Flax Seeds',
    category: 'VEGAN',
  },
  {
    id: 'whey',
    title: 'Whey Protein Isolate',
    icon: '🥤',
    examples: 'Blackberry, Strawberry, Kiwi & Chocolate Isolate Shakes with Coconut Oil',
    category: 'WHEY_PROTEIN',
  },
];

export const PREVIOUS_ORIENTATION_OPTIONS = [
  { value: 'Vegetarian (Pure Veg)', label: 'Vegetarian (Lacto-Veg)', icon: '🥦', description: 'Traditional plant-based & dairy foods' },
  { value: 'Eggetarian', label: 'Eggetarian', icon: '🥚', description: 'Vegetarian plus eggs' },
  { value: 'Non-Vegetarian', label: 'Non-Vegetarian', icon: '🍗', description: 'Regular poultry, meat & seafood' },
  { value: 'Pescatarian', label: 'Pescatarian', icon: '🐟', description: 'Fish & seafood with vegetarian base' },
  { value: 'Vegan', label: 'Vegan', icon: '🌱', description: '100% plant-based, no animal or dairy' },
  { value: 'Mixed Traditional Indian', label: 'Mixed Traditional Indian', icon: '🍲', description: 'Roti, dal, rice, home-cooked curry' },
];

export const NEW_ORIENTATION_PROTEIN_OPTIONS = [
  { id: 'beef', name: 'Beef', label: 'Beef', desc: 'Lean steak, sirloin & cuts', icon: '🥩' },
  { id: 'pork', name: 'Pork', label: 'Pork', desc: 'Lean pork loin & tenderloin', icon: '🥓' },
  { id: 'tofu', name: 'Tofu & Soy', label: 'Tofu & Soy', desc: 'Organic firm tofu, tempeh, edamame', icon: '🧈' },
  { id: 'chicken', name: 'Chicken & Poultry', label: 'Chicken', desc: 'Lean chicken breast, kebabs, thali', icon: '🍗' },
  { id: 'fish', name: 'Fish & Seafood', label: 'Fish & Seafood', desc: 'Salmon, Rohu, Pomfret, Prawns', icon: '🐟' },
  { id: 'mutton', name: 'Mutton & Lamb', label: 'Mutton & Lamb', desc: 'Nutrient-rich red meat & curry', icon: '🍖' },
  { id: 'dairy', name: 'Dairy & Paneer', label: 'Dairy & Paneer', desc: 'Full-fat paneer, Greek yogurt, ghee', icon: '🥛' },
  { id: 'eggs', name: 'Whole Eggs', label: 'Eggs', desc: 'Boiled, poached, egg bhurji, omelette', icon: '🥚' },
  { id: 'whey', name: 'Whey Protein Isolate', label: 'Whey Protein', desc: 'Fast post-workout muscle recovery', icon: '🥤' },
  { id: 'vegan_plant', name: 'Plant-Based Legumes', label: 'Plant-Based Legumes', desc: 'Sprouts, lentils, quinoa, chia seeds', icon: '🌱' },
];

const DIET_TYPES: { value: DietType; label: string; description: string }[] = [
  { value: 'VEGETARIAN', label: 'Vegetarian', description: 'Plant-based foods plus dairy products' },
  { value: 'EGGETARIAN', label: 'Eggetarian', description: 'Vegetarian plus eggs' },
  { value: 'NON-VEGETARIAN', label: 'Non-Vegetarian', description: 'Includes poultry, meat, fish, and dairy' },
  { value: 'VEGAN', label: 'Vegan', description: '100% plant-based, no animal products or dairy' },
  { value: 'OTHER', label: 'Other', description: 'Jain, Pescatarian, Keto, Halal, etc.' },
];

const WATER_INTAKES: { value: DailyWaterIntake; label: string }[] = [
  { value: 'LESS THAN 1 L', label: 'Less than 1 Liter' },
  { value: '1 – 2 L', label: '1 – 2 Liters' },
  { value: '2 – 3 L', label: '2 – 3 Liters (Optimal)' },
  { value: 'MORE THAN 3 L', label: 'More than 3 Liters' },
];

const EATING_OUT: { value: EatingOutFrequency; label: string }[] = [
  { value: 'NEVER', label: 'Never (100% home cooked)' },
  { value: '1 – 2 TIMES PER WEEK', label: '1 – 2 times per week' },
  { value: '3 – 4 TIMES PER WEEK', label: '3 – 4 times per week' },
  { value: '5+ TIMES PER WEEK', label: '5+ times per week (Frequent)' },
];

const HABIT_STATUSES = [
  { value: 'NEVER', label: 'Never' },
  { value: 'IN THE PAST', label: 'In the past' },
  { value: 'CURRENTLY', label: 'Currently' },
];

const ALCOHOL_AMOUNTS: { value: AlcoholDrinksPerWeek; label: string }[] = [
  { value: '1 – 2 DRINKS', label: '1 – 2 drinks per week' },
  { value: '3 – 5 DRINKS', label: '3 – 5 drinks per week' },
  { value: '6 – 10 DRINKS', label: '6 – 10 drinks per week' },
  { value: 'MORE THAN 10 DRINKS', label: 'More than 10 drinks per week' },
];

export const Step5DietaryNutrition: React.FC<Step5Props> = ({ data, onChange, errors }) => {
  const selectedMealsCount = data.mealsCount || 4;
  const selectedCategories = data.selectedFoodCategories || ['Dairy Products', 'Eggs', 'Whey Protein Isolate'];

  const handleSelectMealsCount = (count: 3 | 4 | 5) => {
    const dailyMealsMapped: DailyMeals = count === 3 ? '3 MEALS' : count === 4 ? '4 MEALS' : '5+ MEALS';
    const updated = {
      ...data,
      mealsCount: count,
      dailyMeals: dailyMealsMapped,
    };
    onChange(updated);

    // Auto-generate customized diet chart
    const autoChart = resolveCustomizedDietChart(count, selectedCategories, 'default');
    publishClientDietChart(autoChart);
  };

  const handleToggleFoodCategory = (title: string) => {
    const nextCategories = selectedCategories.includes(title)
      ? selectedCategories.filter((c) => c !== title)
      : [...selectedCategories, title];

    let resolvedArchetype = 'Lacto-Ovo-Veg Whey';
    const hasChicken = nextCategories.some((c) => c.includes('Chicken'));
    const hasFish = nextCategories.some((c) => c.includes('Fish'));
    const hasEggs = nextCategories.some((c) => c.includes('Egg'));
    const isVegan = nextCategories.some((c) => c.includes('Vegan'));

    if (hasChicken && hasFish) resolvedArchetype = 'Pollo-Pescatarian Whey';
    else if (hasChicken) resolvedArchetype = 'Pollo-Pescatarian Whey';
    else if (hasFish) resolvedArchetype = 'Pescatarian Whey';
    else if (hasEggs) resolvedArchetype = 'Lacto-Ovo-Veg Whey';
    else if (isVegan) resolvedArchetype = 'Vegan Protein';
    else resolvedArchetype = 'Lacto-Vegetarian';

    const updated = {
      ...data,
      selectedFoodCategories: nextCategories,
      dietArchetype: resolvedArchetype,
    };
    onChange(updated);

    // Auto-generate customized diet chart
    const autoChart = resolveCustomizedDietChart(selectedMealsCount, nextCategories, 'default');
    publishClientDietChart(autoChart);
  };

  const selectedPreviousOrientation = data.previousFoodOrientation || 'Vegetarian (Pure Veg)';
  const selectedPreferredProteins = data.preferredProteins || ['Chicken', 'Fish & Seafood', 'Dairy & Paneer', 'Eggs'];

  const handleSelectPreviousOrientation = (orientation: string) => {
    onChange({
      ...data,
      previousFoodOrientation: orientation,
    });
  };

  const handleTogglePreferredProtein = (proteinName: string) => {
    const next = selectedPreferredProteins.includes(proteinName)
      ? selectedPreferredProteins.filter((p) => p !== proteinName)
      : [...selectedPreferredProteins, proteinName];

    let inferredDiet: DietType = data.dietType || 'NON-VEGETARIAN';
    if (next.some((p) => ['Beef', 'Pork', 'Chicken', 'Fish & Seafood', 'Mutton & Lamb'].includes(p))) {
      inferredDiet = 'NON-VEGETARIAN';
    } else if (next.includes('Eggs')) {
      inferredDiet = 'EGGETARIAN';
    } else if (next.some((p) => ['Tofu & Soy', 'Plant-Based Legumes'].includes(p)) && !next.includes('Dairy & Paneer')) {
      inferredDiet = 'VEGAN';
    } else if (next.includes('Dairy & Paneer')) {
      inferredDiet = 'VEGETARIAN';
    }

    onChange({
      ...data,
      preferredProteins: next,
      newFoodOrientation: next.join(', '),
      dietType: inferredDiet,
    });
  };

  // Determine current resolved archetype label
  const currentArchetype = data.dietArchetype || 'Pollo-Pescatarian Whey Protocol';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#242820', marginBottom: '4px' }}>
          Meal Frequency & Food Selection
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Select your daily meal frequency and preferred foods. Your clinical diet chart is auto-customized by the app.
        </p>
      </div>

      {/* 1. How Many Meals Do You Take (3, 4, 5) */}
      <div className="wellness-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', border: '2px solid #0A1C44', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '2px', fontSize: '14.5px', fontWeight: 800, color: '#0A1C44' }}>
              1. How many meals do you take per day? <span style={{ color: '#C85A48' }}>*</span>
            </label>
            <p style={{ fontSize: '11.5px', color: '#66734A', margin: 0 }}>
              Auto-calibrates your recipe cards & macro distributions
            </p>
          </div>
          <span style={{ fontSize: '11px', color: '#0A1C44', fontWeight: 800, backgroundColor: '#E8CA56', padding: '2px 8px', borderRadius: '4px' }}>
            {selectedMealsCount} Meals Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {MEAL_COUNT_OPTIONS.map((opt) => {
            const isSelected = selectedMealsCount === opt.count;
            return (
              <div
                key={opt.count}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectMealsCount(opt.count as 3 | 4 | 5)}
                className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
                style={{
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px',
                  backgroundColor: isSelected ? '#0A1C44' : '#FFFDF8',
                  color: isSelected ? '#FFFFFF' : '#242820',
                  borderColor: isSelected ? '#0A1C44' : '#D9D8CC',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  boxShadow: isSelected ? '0 4px 14px rgba(10, 28, 68, 0.25)' : 'none',
                }}
              >
                <span style={{ fontSize: '24px' }}>{opt.icon}</span>
                <strong style={{ fontSize: '13px', fontWeight: 800 }}>{opt.title}</strong>
                <span style={{ fontSize: '10px', opacity: isSelected ? 0.85 : 0.7 }}>{opt.subtitle}</span>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#E8CA56' : '#EEF4E8',
                    color: isSelected ? '#0A1C44' : '#38571A',
                    marginTop: '2px',
                  }}
                >
                  {opt.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Dietary Orientation Evolution: Previous Orientation vs What You Want to Eat Now */}
      <div className="wellness-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', border: '2px solid #0A1C44', borderRadius: '12px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10.5px', color: '#B45309', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DIETARY TRANSITION & ORIENTATION
            </span>
            <span style={{ fontSize: '10px', color: '#15803D', fontWeight: 800, backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px' }}>
              ● Personalized Macro Engine
            </span>
          </div>
          <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0A1C44', margin: '3px 0 0' }}>
            2. Previous Dietary Orientation vs. What You Want to Eat Now
          </h3>
          <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>
            Tell us what you ate in the past and which proteins/foods you want to include now (e.g. Beef, Pork, Tofu, Poultry, Fish).
          </p>
        </div>

        {/* Part A: Previous Orientation */}
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A1C44', marginBottom: '6px' }}>
            A. What was your previous dietary lifestyle / food orientation?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {PREVIOUS_ORIENTATION_OPTIONS.map((opt) => {
              const isSelected = selectedPreviousOrientation === opt.value;
              return (
                <div
                  key={opt.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectPreviousOrientation(opt.value)}
                  className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #0A1C44' : '1px solid #D9D8CC',
                    backgroundColor: isSelected ? '#FAF8F0' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44' }}>{opt.label}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{opt.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part B: What You Want to Eat Now */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A1C44', margin: 0 }}>
              B. What do you want to eat or transition to now? (Select all that apply)
            </label>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
              {selectedPreferredProteins.length} selected
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
            {NEW_ORIENTATION_PROTEIN_OPTIONS.map((prot) => {
              const isSelected = selectedPreferredProteins.includes(prot.name);
              return (
                <div
                  key={prot.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTogglePreferredProtein(prot.name)}
                  className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #059669' : '1px solid #D9D8CC',
                    backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{prot.icon}</span>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: isSelected ? '#065F46' : '#1E293B' }}>
                        {prot.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{prot.desc}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: isSelected ? '1.5px solid #059669' : '1.5px solid #CBD5E1',
                      backgroundColor: isSelected ? '#059669' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Select Preferred Foods (Dairy, Eggs, Chicken, Fish, Vegan, Whey) */}
      <div className="wellness-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', border: '1.5px solid #66734A', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '2px', fontSize: '14.5px', fontWeight: 800, color: '#242820' }}>
              3. Select Foods You Eat & Enjoy <span style={{ color: '#C85A48' }}>*</span>
            </label>
            <p style={{ fontSize: '11.5px', color: '#66734A', margin: 0 }}>
              Select all options that apply to customize your meals
            </p>
          </div>
          <span style={{ fontSize: '11px', color: '#38571A', fontWeight: 700 }}>
            {selectedCategories.length} selected
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {FOOD_CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategories.includes(cat.title);
            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => handleToggleFoodCategory(cat.title)}
                className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  backgroundColor: isSelected ? '#FAF8F0' : '#FFFDF8',
                  borderColor: isSelected ? '#66734A' : '#D9D8CC',
                  cursor: 'pointer',
                  borderRadius: '10px',
                }}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '13px', color: '#242820' }}>{cat.title}</strong>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isSelected ? '1.5px solid #66734A' : '1.5px solid #CCCCCC',
                        backgroundColor: isSelected ? '#66734A' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#6B7063', margin: '4px 0 0', lineHeight: 1.3 }}>
                    {cat.examples}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Resolved Archetype Banner */}
        <div
          style={{
            marginTop: '14px',
            padding: '12px 14px',
            backgroundColor: '#EEF4E8',
            borderRadius: '8px',
            border: '1.5px solid #B8D4A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#38571A" />
            <div>
              <span style={{ fontSize: '10px', color: '#66734A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Auto-Customized Protocol Assigned
              </span>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#2B4214' }}>
                {currentArchetype} ({selectedMealsCount} Meals / Day)
              </div>
            </div>
          </div>
          <span style={{ fontSize: '10.5px', color: '#38571A', fontWeight: 700, backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #66734A' }}>
            ✓ Ready in App
          </span>
        </div>
      </div>

      {/* 3. Diet Type */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Dietary Baseline Tag <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={DIET_TYPES}
          value={data.dietType}
          onChange={(val) => onChange({ ...data, dietType: val })}
        />
        {errors.dietType && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.dietType}
          </span>
        )}

        {data.dietType === 'OTHER' && (
          <div className="form-group" style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={data.otherDietType || ''}
              onChange={(e) => onChange({ ...data, otherDietType: e.target.value })}
              placeholder="e.g. Jain, Pescatarian, Keto, Halal, etc."
              className={`form-input ${errors.otherDietType ? 'has-error' : ''}`}
            />
            {errors.otherDietType && (
              <span className="form-error-text">{errors.otherDietType}</span>
            )}
          </div>
        )}

        {/* Macronutrient Education & Carbohydrate Metabolism Diagram */}
        {data.dietType && (
          <MacronutrientEducationDiagram dietType={data.dietType} />
        )}
      </div>

      {/* Allergies / Intolerances */}
      <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FAF8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
              Food Allergies or Intolerances?
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7063' }}>e.g. Dairy, gluten, nuts, soy, shellfish</p>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => onChange({ ...data, hasFoodAllergies: false, foodAllergiesOrIntolerances: '' })}
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: !data.hasFoodAllergies ? '#66734A' : '#E6E2CF',
                color: !data.hasFoodAllergies ? '#FFFDF8' : '#6B7063',
                fontWeight: 600,
              }}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, hasFoodAllergies: true })}
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: data.hasFoodAllergies ? '#66734A' : '#E6E2CF',
                color: data.hasFoodAllergies ? '#FFFDF8' : '#6B7063',
                fontWeight: 600,
              }}
            >
              Yes
            </button>
          </div>
        </div>

        {data.hasFoodAllergies && (
          <div className="form-group" style={{ marginTop: '10px', marginBottom: 0 }}>
            <input
              type="text"
              value={data.foodAllergiesOrIntolerances || ''}
              onChange={(e) => onChange({ ...data, foodAllergiesOrIntolerances: e.target.value })}
              placeholder="List specific allergies (e.g. Peanuts, Lactose intolerant)"
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Water Intake */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Daily Water Intake <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={WATER_INTAKES}
          value={data.dailyWaterIntake}
          onChange={(val) => onChange({ ...data, dailyWaterIntake: val })}
        />
        {errors.dailyWaterIntake && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.dailyWaterIntake}
          </span>
        )}
      </div>

      {/* Eating Out Frequency */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Eating Out / Ordering Food Frequency
        </label>
        <SingleCardSelect
          options={EATING_OUT}
          value={data.eatingOutFrequency}
          onChange={(val) => onChange({ ...data, eatingOutFrequency: val })}
        />
      </div>

      {/* Smoking */}
      <div className="wellness-card" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820', marginBottom: '10px' }}>
          Smoking Habits
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
          {HABIT_STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange({ ...data, smokingStatus: item.value as SmokingStatus })}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'center',
                backgroundColor: data.smokingStatus === item.value ? '#66734A' : '#F1EEDF',
                color: data.smokingStatus === item.value ? '#FFFDF8' : '#242820',
                fontWeight: 500,
                border: '1px solid #D9D8CC',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        {data.smokingStatus && data.smokingStatus !== 'NEVER' && (
          <input
            type="text"
            value={data.smokingQuantityPerDay || ''}
            onChange={(e) => onChange({ ...data, smokingQuantityPerDay: e.target.value })}
            placeholder="Quantity per day (e.g. 2 cigarettes/day)"
            className="form-input"
            style={{ fontSize: '13px', padding: '8px 12px' }}
          />
        )}
      </div>

      {/* Alcohol Consumption */}
      <div className="wellness-card" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820', marginBottom: '10px' }}>
          Alcohol Consumption
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
          {HABIT_STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange({ ...data, alcoholStatus: item.value as AlcoholStatus })}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'center',
                backgroundColor: data.alcoholStatus === item.value ? '#66734A' : '#F1EEDF',
                color: data.alcoholStatus === item.value ? '#FFFDF8' : '#242820',
                fontWeight: 500,
                border: '1px solid #D9D8CC',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {data.alcoholStatus && data.alcoholStatus !== 'NEVER' && (
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '12px', color: '#6B7063', display: 'block', marginBottom: '6px' }}>
              Average Drinks per Week
            </label>
            <SingleCardSelect
              options={ALCOHOL_AMOUNTS}
              value={data.alcoholDrinksPerWeek || ''}
              onChange={(val) => onChange({ ...data, alcoholDrinksPerWeek: val })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
