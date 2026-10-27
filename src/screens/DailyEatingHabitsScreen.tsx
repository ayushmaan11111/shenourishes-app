import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDIAN_FOOD_CATALOG, IndianFoodItem } from '../data/indianFoodCatalog';
import { MacronutrientEducationDiagram } from '../components/nutrition/MacronutrientEducationDiagram';
import { getDailyLog, addFoodLog, removeFoodLog } from '../services/dailyTrackingService';

interface DailyEatingHabitsScreenProps {
  onBack?: () => void;
}

export const DailyEatingHabitsScreen: React.FC<DailyEatingHabitsScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const clientId = user?.uid || 'default_user';

  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [selectedMealCategory, setSelectedMealCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [dailyLog, setDailyLog] = useState(() => getDailyLog(clientId));
  const [showCatalogSelector, setShowCatalogSelector] = useState(false);

  useEffect(() => {
    setDailyLog(getDailyLog(clientId));
  }, [clientId]);

  // Group logged foods by meal type
  const breakfastFoods = dailyLog.foodLogs.filter((f) => f.mealType === 'Breakfast');
  const lunchFoods = dailyLog.foodLogs.filter((f) => f.mealType === 'Lunch');
  const snackFoods = dailyLog.foodLogs.filter((f) => f.mealType === 'Snack' || f.mealType === 'Evening');
  const dinnerFoods = dailyLog.foodLogs.filter((f) => f.mealType === 'Dinner');

  // Exact Formula Calculations
  // Total Protein (g), Total Fat (g), Total Carbs (g)
  let totalProteinGrams = 0;
  let totalFatGrams = 0;
  let totalCarbsGrams = 0;
  let totalCaloriesKcal = 0;

  dailyLog.foodLogs.forEach((f) => {
    const p = f.proteinGrams || 0;
    const calories = f.calories || 0;
    // Estimate standard macro split if not individually saved
    const estimatedFat = Math.round((calories * 0.25) / 9);
    const estimatedCarbs = Math.max(0, Math.round((calories - p * 4 - estimatedFat * 9) / 4));

    totalProteinGrams += p;
    totalFatGrams += estimatedFat;
    totalCarbsGrams += estimatedCarbs;
    totalCaloriesKcal += calories;
  });

  const proteinKcal = totalProteinGrams * 4;
  const fatKcal = totalFatGrams * 9;
  const carbsKcal = totalCarbsGrams * 4;

  const handleAddCatalogItem = (food: IndianFoodItem) => {
    const updated = addFoodLog(clientId, {
      foodName: `${food.name} (${food.dietType})`,
      mealType: selectedMealCategory === 'Snacks' ? 'Snack' : selectedMealCategory,
      quantity: food.servingSize,
      calories: food.calories,
      proteinGrams: food.proteinGrams,
    });
    setDailyLog(updated);
    setShowCatalogSelector(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = removeFoodLog(clientId, id);
    setDailyLog(updated);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8F6EF', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 14px', backgroundColor: '#0A1C44', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 30 }}>
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
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DAILY 4-MEAL INTAKE & FORMULA CALCULATOR
              </span>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Current Eating Habits & Calorie Resources
              </h1>
            </div>
          </div>

          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontWeight: 800 }}>
            {dailyLog.foodLogs.length} Items Logged Today
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Real-time Macro & Calorie Formula Summary Bar */}
        <div
          className="wellness-card"
          style={{
            padding: '16px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 6px 18px rgba(10, 28, 68, 0.18)',
            border: '1.5px solid #E8CA56',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={18} color="#E8CA56" />
              <strong style={{ fontSize: '13px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Daily Calorie & Macro Resources Math
              </strong>
            </div>
            <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#E8CA56', color: '#0A1C44', fontWeight: 800 }}>
              Live Formula Sync
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {/* Total Energy */}
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '10px', color: '#E8CA56', fontWeight: 700 }}>TOTAL ENERGY</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                {totalCaloriesKcal} <span style={{ fontSize: '11px', fontWeight: 600 }}>kcal</span>
              </div>
              <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>Sum of 4 Meals</div>
            </div>

            {/* Protein */}
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '10px', color: '#A3E635', fontWeight: 700 }}>PROTEIN (1g = 4 kcal)</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                {totalProteinGrams}g <span style={{ fontSize: '11px', fontWeight: 600 }}>({proteinKcal} kcal)</span>
              </div>
              <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>Builds Muscle & Tissue</div>
            </div>

            {/* Fat */}
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '10px', color: '#FB923C', fontWeight: 700 }}>FAT (1g = 9 kcal)</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                {totalFatGrams}g <span style={{ fontSize: '11px', fontWeight: 600 }}>({fatKcal} kcal)</span>
              </div>
              <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>Long-Term Energy & Organs</div>
            </div>

            {/* Carbs */}
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 700 }}>CARBS (1g = 4 kcal)</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                {totalCarbsGrams}g <span style={{ fontSize: '11px', fontWeight: 600 }}>({carbsKcal} kcal)</span>
              </div>
              <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>Primary Energy Source</div>
            </div>
          </div>
        </div>

        {/* 4 Meals Intake Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#242820', margin: 0 }}>
              4 Daily Meal Windows (Refreshes Daily)
            </h3>
          </div>

          {[
            { category: 'Breakfast' as const, title: 'Meal 1: Breakfast', icon: '☀️', foods: breakfastFoods },
            { category: 'Lunch' as const, title: 'Meal 2: Lunch', icon: '🍲', foods: lunchFoods },
            { category: 'Snacks' as const, title: 'Meal 3: Evening Snack', icon: '🍿', foods: snackFoods },
            { category: 'Dinner' as const, title: 'Meal 4: Dinner', icon: '🌙', foods: dinnerFoods },
          ].map((meal) => (
            <div
              key={meal.category}
              className="wellness-card"
              style={{
                padding: '14px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #D9D8CC',
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{meal.icon}</span>
                  <strong style={{ fontSize: '13.5px', color: '#0A1C44' }}>{meal.title}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMealCategory(meal.category);
                    setShowCatalogSelector(true);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#FAF6D9',
                    color: '#6B5418',
                    border: '1px solid #E8DEB2',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={12} />
                  <span>Log Dish</span>
                </button>
              </div>

              {/* Logged Foods List for this Meal */}
              {meal.foods.length === 0 ? (
                <div style={{ fontSize: '11.5px', color: '#8A9568', fontStyle: 'italic', padding: '4px 0' }}>
                  No food logged for this meal window yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {meal.foods.map((food) => (
                    <div
                      key={food.id}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#FAF8F0',
                        border: '1px solid #ECEAE0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '12px', color: '#242820' }}>{food.foodName}</strong>
                        <div style={{ fontSize: '10.5px', color: '#6B7063' }}>
                          {food.quantity ? `${food.quantity} • ` : ''}
                          <strong style={{ color: '#38571A' }}>{food.proteinGrams || 0}g Protein</strong> • {food.calories || 0} kcal
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(food.id)}
                        style={{ padding: '4px', color: '#C85A48', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Embedded Carbohydrate Storage & Metabolism Flowchart Diagram */}
        <MacronutrientEducationDiagram dietType="VEGETARIAN" />

        {/* Modal for Quick Dish Selection from 180+ Indian Food Catalog */}
        {showCatalogSelector && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: '580px', maxHeight: '85vh', backgroundColor: '#FFFDF8', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                    Select Food for {selectedMealCategory}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#6B7063' }}>180+ Verified Indian Nutrition Catalog</span>
                </div>
                <button type="button" onClick={() => setShowCatalogSelector(false)} style={{ background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>✕</button>
              </div>

              {/* Diet Filter */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['All', 'Veg', 'Non-Veg'] as const).map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setDietFilter(diet)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      backgroundColor: dietFilter === diet ? '#0A1C44' : '#F1EEDF',
                      color: dietFilter === diet ? '#FFFFFF' : '#4F5C38',
                      cursor: 'pointer',
                    }}
                  >
                    {diet === 'Veg' ? '🥬 100% Veg' : diet === 'Non-Veg' ? '🍗 Non-Veg' : 'All Dishes'}
                  </button>
                ))}
              </div>

              {/* Catalog Dishes Grid */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', maxHeight: '55vh' }}>
                {INDIAN_FOOD_CATALOG
                  .filter((f) => {
                    if (dietFilter !== 'All' && f.dietType !== dietFilter) return false;
                    if (selectedMealCategory === 'Snacks') return f.category === 'Snacks';
                    return f.category === selectedMealCategory || f.category === 'Lunch' || f.category === 'Dinner';
                  })
                  .map((food) => (
                    <div
                      key={food.id}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${food.dietType === 'Veg' ? '#B8D4A8' : '#F5C6CB'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 4px', borderRadius: '3px', backgroundColor: food.dietType === 'Veg' ? '#EEF4E8' : '#FDF0EE', color: food.dietType === 'Veg' ? '#38571A' : '#C85A48' }}>
                            {food.dietType}
                          </span>
                          <span style={{ fontSize: '10px', color: '#6B7063' }}>{food.servingSize}</span>
                        </div>
                        <strong style={{ fontSize: '12px', color: '#242820', marginTop: '4px', display: 'block' }}>{food.name}</strong>
                        <div style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '2px' }}>
                          P: <strong style={{ color: '#38571A' }}>{food.proteinGrams}g</strong> • F: {food.fatGrams}g • C: {food.carbsGrams}g • <strong style={{ color: '#0A1C44' }}>{food.calories} kcal</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddCatalogItem(food)}
                        className="btn-primary"
                        style={{ padding: '4px 8px', fontSize: '11px', marginTop: '8px', width: '100%' }}
                      >
                        + Select Dish
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
