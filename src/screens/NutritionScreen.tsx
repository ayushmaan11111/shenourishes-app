import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Apple, 
  TrendingUp, 
  Activity, 
  Home as HomeIcon, 
  User as UserIcon,
  ShieldCheck,
  Pill,
  Droplets,
  Dumbbell,
  Utensils,
  Plus,
  Trash2,
  FileSpreadsheet,
  X,
  Sparkles,
  Dna
} from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database, isFirebaseConfigured } from '../services/firebase';
import { getMetabolicBlueprint, type MetabolicBlueprintData } from '../services/metabolicBlueprintService';
import { MacronutrientMetabolismSection } from '../components/nutrition/MacronutrientMetabolismSection';
import { useAuth } from '../context/AuthContext';
import { 
  getClientActiveDietChart, 
  toggleMealFollowed, 
  calculateChartTotals,
  calculateMealTotals 
} from '../services/clinicalDietTemplates';
import { getClientSupplementPlan } from '../services/formulaEngineService';
import { 
  getDailyLog, 
  addWaterIntake, 
  addExerciseLog, 
  removeExerciseLog, 
  addFoodLog, 
  removeFoodLog 
} from '../services/dailyTrackingService';
import { IndianFoodMacroModal } from '../components/nutrition/IndianFoodMacroModal';
import { ClinicalSupplementsCatalogModal } from '../components/admin/ClinicalSupplementsCatalogModal';
import type { ClinicalDietChart } from '../types/clinicalChart';
import type { ClientSupplementPlan } from '../types/formulaEngine';
import type { ClientDailyLog } from '../types/dailyTracking';

interface NutritionScreenProps {
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

export const NutritionScreen: React.FC<NutritionScreenProps> = ({ onNavigateTab }) => {
  const { user, customerRecord } = useAuth();
  const clientId = user?.uid || 'default';

  const [chart, setChart] = useState<ClinicalDietChart>(() => getClientActiveDietChart(clientId));
  const [supplementPlan, setSupplementPlan] = useState<ClientSupplementPlan>(() => getClientSupplementPlan(clientId, customerRecord));
  const [dailyLog, setDailyLog] = useState<ClientDailyLog>(() => getDailyLog(clientId));
  const [activeTab, setActiveTab] = useState<'diet' | 'supplements' | 'activity'>('diet');
  const [showFullClinicalSheetModal, setShowFullClinicalSheetModal] = useState<boolean>(false);
  const [showIndianFoodCatalogModal, setShowIndianFoodCatalogModal] = useState<boolean>(false);
  const [showSupplementsCatalogModal, setShowSupplementsCatalogModal] = useState<boolean>(false);
  const [metabolicBlueprint, setMetabolicBlueprint] = useState<MetabolicBlueprintData | null>(null);
  const [showMetabolicModal, setShowMetabolicModal] = useState<boolean>(false);

  // Modals for Exercise & Food Logging
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('30');
  const [exerciseTime, setExerciseTime] = useState('07:30 AM');
  const [exerciseIntensity, setExerciseIntensity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [exerciseCalories, setExerciseCalories] = useState('');

  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodMealType, setFoodMealType] = useState<'Breakfast' | 'Mid-Morning' | 'Lunch' | 'Evening' | 'Dinner' | 'Snack'>('Snack');
  const [foodQuantity, setFoodQuantity] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');

  useEffect(() => {
    // 1. Initial local load
    setChart(getClientActiveDietChart(clientId));
    setSupplementPlan(getClientSupplementPlan(clientId, customerRecord));
    setDailyLog(getDailyLog(clientId));
    getMetabolicBlueprint(clientId).then((bp) => {
      if (bp) setMetabolicBlueprint(bp);
    });

    // 2. Real-time Firebase RTDB sync for Active Diet Chart and Metabolic Blueprint
    let unsubscribeDietChart: (() => void) | undefined;
    let unsubscribeBlueprint: (() => void) | undefined;

    if (isFirebaseConfigured && database && clientId) {
      try {
        const chartRef = ref(database, `clients/${clientId}/activeDietChart`);
        unsubscribeDietChart = onValue(chartRef, (snapshot) => {
          if (snapshot.exists()) {
            const remoteChart = snapshot.val() as ClinicalDietChart;
            setChart(remoteChart);
            try {
              localStorage.setItem('she_nourishes_clinical_chart_' + clientId, JSON.stringify(remoteChart));
            } catch (_) {}
          }
        });

        const bpRef = ref(database, `customers/${clientId}/metabolicBlueprint`);
        unsubscribeBlueprint = onValue(bpRef, (snapshot) => {
          if (snapshot.exists()) {
            const remoteBp = snapshot.val() as MetabolicBlueprintData;
            setMetabolicBlueprint(remoteBp);
          }
        });
      } catch (err) {
        console.warn('Firebase RTDB listener error in NutritionScreen:', err);
      }
    }

    // 3. Local/same-window update event listeners
    const handleDietUpdate = () => {
      setChart(getClientActiveDietChart(clientId));
    };
    const handleBpUpdate = () => {
      getMetabolicBlueprint(clientId).then((bp) => {
        if (bp) setMetabolicBlueprint(bp);
      });
    };
    window.addEventListener('diet_chart_updated', handleDietUpdate);
    window.addEventListener('metabolic_blueprint_updated', handleBpUpdate);

    return () => {
      if (unsubscribeDietChart) unsubscribeDietChart();
      if (unsubscribeBlueprint) unsubscribeBlueprint();
      window.removeEventListener('diet_chart_updated', handleDietUpdate);
      window.removeEventListener('metabolic_blueprint_updated', handleBpUpdate);
    };
  }, [clientId, customerRecord]);

  const totals = calculateChartTotals(chart);
  const completedMealsCount = chart.meals.filter((m) => m.isCompleted).length;
  const totalMealsCount = chart.meals.length;
  const adherencePercent = totalMealsCount > 0 ? Math.round((completedMealsCount / totalMealsCount) * 100) : 0;
  const waterPercent = Math.min(100, Math.round((dailyLog.waterIntakeMl / (dailyLog.waterGoalMl || 2500)) * 100));

  const handleToggleMeal = (mealNumber: number) => {
    const updated = toggleMealFollowed(clientId, mealNumber);
    setChart(updated);
  };

  const handleAddWater = (ml: number) => {
    const updated = addWaterIntake(clientId, ml);
    setDailyLog(updated);
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;
    const updated = addExerciseLog(clientId, {
      exerciseName: exerciseName.trim(),
      durationMinutes: parseInt(exerciseDuration, 10) || 30,
      timeOfDay: exerciseTime,
      intensity: exerciseIntensity,
      caloriesBurned: exerciseCalories ? parseInt(exerciseCalories, 10) : undefined,
    });
    setDailyLog(updated);
    setShowExerciseModal(false);
    setExerciseName('');
    setExerciseCalories('');
  };

  const handleDeleteExercise = (id: string) => {
    const updated = removeExerciseLog(clientId, id);
    setDailyLog(updated);
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    const updated = addFoodLog(clientId, {
      foodName: foodName.trim(),
      mealType: foodMealType,
      quantity: foodQuantity.trim() || undefined,
      calories: foodCalories ? parseInt(foodCalories, 10) : undefined,
      proteinGrams: foodProtein ? parseFloat(foodProtein) : undefined,
    });
    setDailyLog(updated);
    setShowFoodModal(false);
    setFoodName('');
    setFoodQuantity('');
    setFoodCalories('');
    setFoodProtein('');
  };

  const handleDeleteFood = (id: string) => {
    const updated = removeFoodLog(clientId, id);
    setDailyLog(updated);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F6EF',
        minHeight: '100%',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '16px 18px 12px',
          backgroundColor: '#FFFDF8',
          borderBottom: '1px solid #D9D8CC',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#66734A', fontWeight: 700, textTransform: 'uppercase' }}>
              <ShieldCheck size={14} />
              <span>Personalized Clinical Plan</span>
            </div>
            <h1 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#242820', margin: 0 }}>
              Nutrition & Daily Activity
            </h1>
          </div>

          {/* Adherence Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: adherencePercent === 100 ? '#EEF4E8' : '#FAF8F0',
              border: '1px solid #D9D8CC',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: adherencePercent === 100 ? '#38571A' : '#66734A' }}>
              {completedMealsCount}/{totalMealsCount} Eaten ({adherencePercent}%)
            </span>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('diet')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'diet' ? '#0A1C44' : '#F1EEDF',
              color: activeTab === 'diet' ? '#FFFDF8' : '#4F5C38',
              fontSize: '11px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Apple size={13} />
            <span>Diet Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supplements')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'supplements' ? '#0A1C44' : '#F1EEDF',
              color: activeTab === 'supplements' ? '#FFFDF8' : '#4F5C38',
              fontSize: '11px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Pill size={13} />
            <span>Supplements</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'activity' ? '#0A1C44' : '#F1EEDF',
              color: activeTab === 'activity' ? '#FFFDF8' : '#4F5C38',
              fontSize: '11px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Droplets size={13} />
            <span>Water & Activity</span>
          </button>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* =========================================================================
            TAB 1: FORMATTED CARD-BASED DIET PLAN (Clean Mobile Cards, Not Table!)
           ========================================================================= */}
        {activeTab === 'diet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Top Summary Banner with View Full Chart Button */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#0A1C44',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(10, 28, 68, 0.15)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {chart.dietTypeTag || 'CUSTOMIZED MACRO PROTOCOL'}
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0', color: '#FFFFFF' }}>
                  {chart.title}
                </h2>
                <div style={{ fontSize: '12px', color: '#C8D6EC', marginTop: '3px' }}>
                  Daily Target: <strong>{totals.totalCalories} kcal</strong> • <strong>{totals.totalProtein}g Protein</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowMetabolicModal(true)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#E8CA56',
                    color: '#0A1C44',
                    fontSize: '11px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="View your high-carb digestion flowcharts & calculate Lean Body Mass"
                >
                  <Dna size={13} />
                  <span>Metabolism & LBM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowIndianFoodCatalogModal(true)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF6D9',
                    color: '#6B5418',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid #E8DEB2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Utensils size={13} />
                  <span>Indian Food Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFullClinicalSheetModal(true)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(232, 202, 86, 0.2)',
                    color: '#E8CA56',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid #E8CA56',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FileSpreadsheet size={13} />
                  <span>View Sheet</span>
                </button>
              </div>
            </div>

            {/* Live Personalized Metabolic Profile Card */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#FAF8F0',
                border: '1.5px solid #E8CA56',
                boxShadow: '0 2px 8px rgba(232, 202, 86, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Dna size={16} color="#0A1C44" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Personalized Metabolic Profile
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMetabolicModal(true)}
                  style={{
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={11} />
                  <span>Metabolism & LBM Flowcharts</span>
                </button>
              </div>

              {metabolicBlueprint ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #D9D8CC' }}>
                      🥗 Diet: {metabolicBlueprint.autoClassifiedDiet.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', backgroundColor: '#DEF7EC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #31C48D' }}>
                      ⚡ Protocol: {metabolicBlueprint.prescribedProtocol}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #93C5FD' }}>
                      LBM: {metabolicBlueprint.leanBodyMassKg} kg ({metabolicBlueprint.bodyFatPercentage}% Fat)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '2px' }}>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Daily Protein Goal</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F3822' }}>{metabolicBlueprint.proteinRequirementGrams}g</div>
                      <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>{metabolicBlueprint.leanBodyMassKg}kg LBM × intensity</div>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Daily Fat Target</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#B45309' }}>{metabolicBlueprint.fatRequirementGrams}g</div>
                      <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Protein + 50g base</div>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Carb Strategy</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E40AF' }}>
                        {metabolicBlueprint.prescribedProtocol === 'Low-Carb Diet' ? '80–120g' : '< 30g Incidental'}
                      </div>
                      <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Low-GI only, no spike</div>
                    </div>
                  </div>

                  {metabolicBlueprint.selectedLowGiCarbs && metabolicBlueprint.selectedLowGiCarbs.length > 0 && (
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      🌾 <strong>Approved Low-GI Carb Staples:</strong> {metabolicBlueprint.selectedLowGiCarbs.join(', ')}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '11.5px', color: '#4F5C38', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Customized Clinical Diet Chart is active. Tap to view your carbohydrate digestion flowcharts & calculate Lean Body Mass.</span>
                </div>
              )}
            </div>

            {/* Formatted Meal Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chart.meals.map((meal) => {
                const mealTotals = calculateMealTotals(meal.foods);
                const isCompleted = !!meal.isCompleted;

                return (
                  <div
                    key={meal.mealNumber}
                    className="wellness-card animate-fade-in"
                    style={{
                      padding: '16px',
                      backgroundColor: isCompleted ? '#F8FCF5' : '#FFFFFF',
                      border: `1.5px solid ${isCompleted ? '#66734A' : '#D9D8CC'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {/* Meal Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            backgroundColor: isCompleted ? '#38571A' : '#0A1C44',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {meal.mealName || `MEAL ${meal.mealNumber}`}
                        </div>
                        {meal.scheduledTiming && (
                          <span style={{ fontSize: '11.5px', color: '#6B7063', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={11} />
                            <span>{meal.scheduledTiming}</span>
                          </span>
                        )}
                      </div>

                      {/* Check off button */}
                      <button
                        type="button"
                        onClick={() => handleToggleMeal(meal.mealNumber)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          backgroundColor: isCompleted ? '#EEF4E8' : '#FAF8F0',
                          color: isCompleted ? '#38571A' : '#4F5C38',
                          border: `1.5px solid ${isCompleted ? '#66734A' : '#D9D8CC'}`,
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isCompleted ? <CheckCircle2 size={15} color="#38571A" /> : <Circle size={15} color="#8A9568" />}
                        <span>{isCompleted ? 'Eaten ✓' : 'Mark as Eaten'}</span>
                      </button>
                    </div>

                    {/* Pre-Meal Supplement Badge */}
                    {meal.preMealSupplement && (
                      <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: '#FAF6D9', border: '1px solid #E8DEB2', fontSize: '11px', color: '#6B5418', fontWeight: 600 }}>
                        <strong>Pre-Meal:</strong> {meal.preMealSupplement}
                      </div>
                    )}

                    {/* Formatted Food Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {meal.foods.map((food, idx) => (
                        <div
                          key={food.id || idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 10px',
                            backgroundColor: '#FAF8F0',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: '#242820' }}>{food.foodName}</div>
                            <div style={{ fontSize: '11px', color: '#6B7063' }}>{food.quantity}</div>
                          </div>

                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#38571A', backgroundColor: '#E2EDDA', padding: '2px 6px', borderRadius: '4px' }}>
                              {food.proteinGrams}g P
                            </span>
                            <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#6B7063' }}>
                              {food.calories} kcal
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meal Macro Summary Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px dashed #D9D8CC', fontSize: '11.5px', color: '#4B5244' }}>
                      <span>Meal Total: <strong style={{ color: '#0A1C44' }}>{mealTotals.calories} kcal</strong></span>
                      <div style={{ display: 'flex', gap: '8px', fontWeight: 600 }}>
                        <span style={{ color: '#38571A' }}>P: {mealTotals.protein}g</span>
                        <span>F: {mealTotals.fat}g</span>
                        <span>C: {mealTotals.carbs}g</span>
                      </div>
                    </div>

                    {/* Post-Meal Performance Supplement Badge */}
                    {meal.postMealSupplement && (
                      <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: '#EBF4F6', border: '1px solid #CCE2E6', fontSize: '11px', color: '#1B5462', fontWeight: 600 }}>
                        <strong>Post-Meal:</strong> {meal.postMealSupplement}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SUPPLEMENT STACK (Formatted Cards with Dosing & Timings)
           ========================================================================= */}
        {activeTab === 'supplements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px 14px', backgroundColor: '#FAF6D9', borderRadius: '10px', border: '1px solid #DDD7AE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '13.5px', color: '#242820' }}>Personalized Supplement Protocol</strong>
                <div style={{ fontSize: '11px', color: '#6B7063' }}>
                  Calibrated to your {supplementPlan.bodyComposition?.bodyWeightKg || 68}kg body weight & {supplementPlan.bodyComposition?.fatFreeMassKg || 52}kg FFM
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowSupplementsCatalogModal(true)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid #E8CA56',
                    cursor: 'pointer',
                  }}
                >
                  📖 View 16 Clinical Stacks
                </button>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#38571A', color: '#FFFFFF', fontWeight: 700 }}>
                  {supplementPlan.items.length} Active Items
                </span>
              </div>
            </div>

            {/* Clinical Key Points & Timing Rules Banner (from sugg infographics) */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#0A1C44',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <strong style={{ fontSize: '12.5px', color: '#E8CA56', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Clinical Timing Rules & Guidelines
                  </strong>
                </div>
                <span style={{ fontSize: '10px', color: '#93C5FD', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  Coach Sneha's Protocol
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#93C5FD' }}>☀️ Doctor-Guided Vitamin D</div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '2px' }}>
                    Dose must be prescribed by doctor after blood test results.
                  </div>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#FDE68A' }}>⏰ Separate Antioxidant & Omega-3</div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '2px' }}>
                    Antioxidants post-lunch • Omega-3 post-dinner. Never at same time.
                  </div>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#86EFAC' }}>⚡ Ergogenic Aids Synergy</div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '2px' }}>
                    L-Citrulline + Beta-Alanine combined together post-workout.
                  </div>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#D8B4FE' }}>🌙 Magnesium at Bedtime</div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '2px' }}>
                    Magnesium Glycinate 200mg at night for muscle relaxation & sleep.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {supplementPlan.items.map((item) => (
                <div
                  key={item.supplementId}
                  className="wellness-card"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #D9D8CC',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#242820', margin: 0 }}>
                        {item.supplementName}
                      </h3>
                      <div style={{ fontSize: '11.5px', color: '#66734A', fontWeight: 600 }}>
                        {item.timing} • {item.frequency}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#0A1C44' }}>
                        {item.finalAmount} {item.unit}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p style={{ fontSize: '11.5px', color: '#6B7063', margin: '4px 0 0', lineHeight: 1.4, backgroundColor: '#FDFBF7', padding: '6px 8px', borderRadius: '6px' }}>
                      <strong>Protocol Note:</strong> {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: WATER & DAILY ACTIVITY LOGGING
           ========================================================================= */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 1. Water Intake Logger Card */}
            <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E3F2FD', color: '#1976D2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Droplets size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#242820', margin: 0 }}>Water Hydration Log</h3>
                    <span style={{ fontSize: '11px', color: '#6B7063' }}>Goal: {dailyLog.waterGoalMl} ml</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '16px', color: '#1976D2' }}>{dailyLog.waterIntakeMl} ml</strong>
                  <div style={{ fontSize: '10.5px', color: '#6B7063' }}>{waterPercent}% reached</div>
                </div>
              </div>

              {/* Water Progress Bar */}
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${waterPercent}%`, backgroundColor: '#2196F3' }} />
              </div>

              {/* Quick Add Water Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleAddWater(250)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: '#E3F2FD', color: '#1976D2', fontWeight: 700, fontSize: '11.5px', border: '1px solid #BBDEFB', cursor: 'pointer' }}
                >
                  + 250 ml (1 Glass)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddWater(500)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: '#E3F2FD', color: '#1976D2', fontWeight: 700, fontSize: '11.5px', border: '1px solid #BBDEFB', cursor: 'pointer' }}
                >
                  + 500 ml (1 Bottle)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddWater(-250)}
                  style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FAF8F0', color: '#6B7063', fontSize: '11.5px', border: '1px solid #D9D8CC', cursor: 'pointer' }}
                  title="Undo last entry"
                >
                  - 250ml
                </button>
              </div>
            </div>

            {/* 2. Exercise Activity Logger Card */}
            <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EEF4E8', color: '#38571A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#242820', margin: 0 }}>Workout & Movement Log</h3>
                    <span style={{ fontSize: '11px', color: '#6B7063' }}>{dailyLog.exercises.length} sessions logged today</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExerciseModal(true)}
                  className="btn-primary"
                  style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} />
                  <span>Log Workout</span>
                </button>
              </div>

              {/* Logged Exercises List */}
              {dailyLog.exercises.length === 0 ? (
                <div style={{ padding: '12px', backgroundColor: '#FAF8F0', borderRadius: '8px', textAlign: 'center', fontSize: '11.5px', color: '#6B7063' }}>
                  No workout logged yet today. Click "Log Workout" to record your movement!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dailyLog.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#F8FCF5',
                        borderRadius: '8px',
                        border: '1px solid #D9EAD3',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', color: '#242820' }}>{ex.exerciseName}</strong>
                        <div style={{ fontSize: '11px', color: '#66734A' }}>
                          {ex.durationMinutes} mins • {ex.timeOfDay} • {ex.intensity} Intensity
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteExercise(ex.id)}
                        style={{ color: '#C85A48', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Extra Food & Snacks Logger Card */}
            <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF3E0', color: '#E65100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#242820', margin: 0 }}>Extra Food & Snacks</h3>
                    <span style={{ fontSize: '11px', color: '#6B7063' }}>{dailyLog.foodLogs.length} items logged</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFoodModal(true)}
                  className="btn-primary"
                  style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} />
                  <span>Log Food</span>
                </button>
              </div>

              {dailyLog.foodLogs.length === 0 ? (
                <div style={{ padding: '12px', backgroundColor: '#FAF8F0', borderRadius: '8px', textAlign: 'center', fontSize: '11.5px', color: '#6B7063' }}>
                  No extra food logged. Click "Log Food" to track unprescribed snacks or fruits!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dailyLog.foodLogs.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#FFFDF8',
                        borderRadius: '8px',
                        border: '1px solid #ECEAE0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', color: '#242820' }}>{item.foodName}</strong>
                        <div style={{ fontSize: '11px', color: '#6B7063' }}>
                          {item.mealType} {item.quantity ? `• ${item.quantity}` : ''} {item.calories ? `• ${item.calories} kcal` : ''}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteFood(item.id)}
                        style={{ color: '#C85A48', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* MODAL: Log Exercise */}
      {showExerciseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 24, 18, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
          <form onSubmit={handleSaveExercise} className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '380px', backgroundColor: '#FFFDF8', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '15px', color: '#242820' }}>Log Workout Activity</strong>
              <button type="button" onClick={() => setShowExerciseModal(false)} style={{ background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Exercise / Activity Name *</label>
              <input type="text" required placeholder="e.g. Strength Training, Pilates, Brisk Walk" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} className="form-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input type="number" required value={exerciseDuration} onChange={(e) => setExerciseDuration(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Time of Day</label>
                <input type="text" value={exerciseTime} onChange={(e) => setExerciseTime(e.target.value)} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Workout Intensity</label>
              <select value={exerciseIntensity} onChange={(e) => setExerciseIntensity(e.target.value as 'Low' | 'Moderate' | 'High')} className="form-select">
                <option value="Low">Low (Light recovery)</option>
                <option value="Moderate">Moderate (Steady state)</option>
                <option value="High">High (Challenging / Gym)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button type="button" onClick={() => setShowExerciseModal(false)} style={{ padding: '6px 12px', background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }}>Save Exercise</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Log Food */}
      {showFoodModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 24, 18, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
          <form onSubmit={handleSaveFood} className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '380px', backgroundColor: '#FFFDF8', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '15px', color: '#242820' }}>Log Food / Snack</strong>
              <button type="button" onClick={() => setShowFoodModal(false)} style={{ background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Food / Recipe Name *</label>
              <input type="text" required placeholder="e.g. Handful of Almonds, Green Apple" value={foodName} onChange={(e) => setFoodName(e.target.value)} className="form-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <select value={foodMealType} onChange={(e) => setFoodMealType(e.target.value as any)} className="form-select">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Mid-Morning">Mid-Morning</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Evening">Evening</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input type="text" placeholder="e.g. 1 bowl, 30g" value={foodQuantity} onChange={(e) => setFoodQuantity(e.target.value)} className="form-input" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button type="button" onClick={() => setShowFoodModal(false)} style={{ padding: '6px 12px', background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }}>Save Food Item</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Full Official Clinical Prescription Sheet */}
      {showFullClinicalSheetModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 24, 18, 0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '12px' }}>
          <div className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', padding: 0, border: '2px solid #0B1E48' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#0A1C44', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>Official Clinical Prescription Sheet</strong>
              <button type="button" onClick={() => setShowFullClinicalSheetModal(false)} style={{ color: '#FFFDF8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Sheet Banner */}
            <div style={{ backgroundColor: '#0A1C44', color: '#FFFFFF', textAlign: 'center', padding: '14px 16px', borderBottom: '1px solid #1E356A' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' }}>
                {chart.title}
              </h2>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#E8CA56', textTransform: 'uppercase', marginTop: '2px' }}>
                {chart.dietTypeTag}
              </div>
            </div>

            {/* Food Table */}
            <div style={{ padding: '14px' }}>
              {chart.meals.map((meal) => {
                const mealTotals = calculateMealTotals(meal.foods);
                return (
                  <div key={meal.mealNumber} style={{ border: '1px solid #0B1E48', marginBottom: '14px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 12px', backgroundColor: '#F4F2E8', fontWeight: 800, fontSize: '12px', color: '#0A1C44' }}>
                      {meal.mealName} {meal.scheduledTiming ? `(${meal.scheduledTiming})` : ''}
                    </div>
                    {meal.preMealSupplement && <div style={{ backgroundColor: '#FCF8D8', padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}>PRE: {meal.preMealSupplement}</div>}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF8F0', borderBottom: '1px solid #ECEAE0' }}>
                          <th style={{ padding: '6px 8px', textAlign: 'left' }}>Food Item</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left' }}>Quantity</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center' }}>Protein</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center' }}>Fat</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center' }}>Carbs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meal.foods.map((f, i) => (
                          <tr key={f.id || i} style={{ borderBottom: '1px solid #F1EEDF' }}>
                            <td style={{ padding: '6px 8px', fontWeight: 600 }}>{f.foodName}</td>
                            <td style={{ padding: '6px 8px', color: '#6B7063' }}>{f.quantity}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center', color: '#38571A', fontWeight: 700 }}>{f.proteinGrams}g</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center', color: '#6B7063' }}>{f.fatGrams}g</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center', color: '#6B7063' }}>{f.carbsGrams}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ backgroundColor: '#FDE4ED', padding: '5px 12px', fontSize: '11px', fontWeight: 800, color: '#A82855' }}>
                      CALORIE PER MEAL: {mealTotals.calories} kcal (P: {mealTotals.protein}g • F: {mealTotals.fat}g • C: {mealTotals.carbs}g)
                    </div>
                    {meal.postMealSupplement && <div style={{ backgroundColor: '#FCF8D8', padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}>POST: {meal.postMealSupplement}</div>}
                  </div>
                );
              })}

              <div style={{ backgroundColor: '#FAF6D9', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                TOTAL DAILY TARGET: {totals.totalCalories} kcal • {totals.totalProtein}g Protein • {totals.totalFat}g Fat • {totals.totalCarbs}g Carbs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indian Food & Macro Catalog Modal */}
      <IndianFoodMacroModal
        isOpen={showIndianFoodCatalogModal}
        onClose={() => setShowIndianFoodCatalogModal(false)}
        onSelectFood={(food) => {
          const updated = addFoodLog(clientId, {
            foodName: `${food.name} (${food.dietType})`,
            mealType: food.category === 'Breakfast' ? 'Breakfast' : food.category === 'Lunch' ? 'Lunch' : food.category === 'Dinner' ? 'Dinner' : 'Snack',
            quantity: food.servingSize,
            calories: food.calories,
            proteinGrams: food.proteinGrams,
          });
          setDailyLog(updated);
          setShowIndianFoodCatalogModal(false);
        }}
      />

      {/* Suggested Supplements Catalog Reference Modal (16 Clinical Protocols) */}
      <ClinicalSupplementsCatalogModal
        isOpen={showSupplementsCatalogModal}
        onClose={() => setShowSupplementsCatalogModal(false)}
      />

      {/* Client Metabolic Science & Macro Blueprint Modal */}
      {showMetabolicModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              maxHeight: '92vh',
              backgroundColor: '#FFFDF8',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
              border: '1.5px solid #0A1C44',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: '#0A1C44',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dna size={18} color="#E8CA56" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Metabolism, High-Carb Cascades & LBM Engine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMetabolicModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto' }}>
              <MacronutrientMetabolismSection
                clientId={clientId}
                clientEmail={customerRecord?.personalDetails?.emailAddress || user?.email || undefined}
                clientName={customerRecord?.personalDetails?.fullName || 'Client'}
                initialWeight={customerRecord?.personalDetails?.weight || 70}
                initialBodyFat={customerRecord?.personalDetails?.bodyFatPercentage ?? 22}
                initialIntensity={customerRecord?.physicalActivity?.calculatedIntensity || 2.0}
                onSavePreferences={() => {
                  setChart(getClientActiveDietChart(clientId));
                  getMetabolicBlueprint(clientId).then(bp => {
                    if (bp) setMetabolicBlueprint(bp);
                  });
                }}
              />
            </div>

            <div
              style={{
                padding: '12px 18px',
                backgroundColor: '#FAF8F0',
                borderTop: '1px solid #D9D8CC',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowMetabolicModal(false)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '12.5px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          onClick={() => onNavigateTab('home')}
          className="nav-item"
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('nutrition')}
          className="nav-item is-active"
        >
          <Apple size={20} />
          <span>Nutrition</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('activity')}
          className="nav-item"
        >
          <Activity size={20} />
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('progress')}
          className="nav-item"
        >
          <TrendingUp size={20} />
          <span>Progress</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="nav-item"
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
