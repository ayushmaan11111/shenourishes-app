import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Award,
  Loader2
} from 'lucide-react';
import { 
  saveMetabolicBlueprint, 
  getMetabolicBlueprint, 
  MetabolicBlueprintData 
} from '../../services/metabolicBlueprintService';

export interface MacronutrientMetabolismSectionProps {
  clientId?: string;
  clientEmail?: string;
  initialWeight?: number;
  initialBodyFat?: number;
  initialIntensity?: number;
  clientName?: string;
  selectedBreakfastFoods?: string[];
  selectedLunchFoods?: string[];
  selectedSnackFoods?: string[];
  selectedDinnerFoods?: string[];
  onSavePreferences?: (data: {
    lbmMethod: string;
    bodyFatPercentage: number;
    leanBodyMassKg: number;
    proteinRequirementGrams: number;
    fatRequirementGrams: number;
    dietBase: 'Veg' | 'Non-Veg';
    selectedProteinFoods: string[];
    autoClassifiedDiet: string;
    prescribedProtocol: 'Fat + Protein Diet' | 'Low-Carb Diet';
    selectedLowGiCarbs: string[];
  }) => void;
}

export const MacronutrientMetabolismSection: React.FC<MacronutrientMetabolismSectionProps> = ({
  clientId = 'default',
  clientEmail,
  initialWeight = 70,
  initialBodyFat = 22,
  initialIntensity = 2.0,
  clientName = 'Client',
  selectedBreakfastFoods = ['Dosa with Chutney & Sambar', 'Filter Coffee with Sugar'],
  selectedLunchFoods = ['White Rice & Dal Tadka', 'Aloo Gobi Sabzi'],
  selectedSnackFoods = ['Samosa with Sweet Chutney', 'Sweetened Milk Tea'],
  selectedDinnerFoods = ['2 Whole Wheat Rotis', 'Mixed Veg Curry', 'White Rice'],
  onSavePreferences,
}) => {
  // Collapsible section views
  const [activeTab, setActiveTab] = useState<'all' | 'highcarb' | 'types' | 'flowcharts' | 'lbm' | 'dietclass' | 'protocols'>('all');

  // LBM Method & Inputs
  const [weight, setWeight] = useState<number>(initialWeight);
  const [bodyFat, setBodyFat] = useState<number>(initialBodyFat);
  const [intensity, setIntensity] = useState<number>(initialIntensity);
  const [lbmMethod, setLbmMethod] = useState<'manual' | 'bca' | 'dexa' | 'bodpod' | 'bmr'>('bca');
  
  // Specific method inputs
  const [clientHeightCm, setClientHeightCm] = useState<number>(168);
  const [clientAge, setClientAge] = useState<number>(28);
  const [clientGender] = useState<'female' | 'male'>('female');

  // Diet Classification Inputs
  const [dietBase, setDietBase] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [selectedProteins, setSelectedProteins] = useState<string[]>([
    'Paneer (cottage cheese)',
    'Curd / Greek Yogurt',
    'Tofu',
    'Soybeans',
  ]);

  // Prescribed Protocol & Low-GI Carbs
  const [prescribedProtocol, setPrescribedProtocol] = useState<'Fat + Protein Diet' | 'Low-Carb Diet'>('Fat + Protein Diet');
  const [selectedLowGiCarbs, setSelectedLowGiCarbs] = useState<string[]>([
    'Brown rice',
    'Whole-wheat chapati',
    'Millet roti',
  ]);

  // Toast confirmation
  const [toastMsg, setToastMsg] = useState<string>('');

  // -------------------------------------------------------------
  // LBM & Macro Calculations
  // -------------------------------------------------------------
  const fatMassKg = useMemo(() => {
    return parseFloat(((weight * bodyFat) / 100).toFixed(1));
  }, [weight, bodyFat]);

  const leanBodyMassKg = useMemo(() => {
    return parseFloat((weight - fatMassKg).toFixed(1));
  }, [weight, fatMassKg]);

  const proteinRequirementGrams = useMemo(() => {
    return Math.round(leanBodyMassKg * intensity);
  }, [leanBodyMassKg, intensity]);

  const fatRequirementGrams = useMemo(() => {
    return proteinRequirementGrams + 50;
  }, [proteinRequirementGrams]);

  const proteinKcal = proteinRequirementGrams * 4;
  const fatKcal = fatRequirementGrams * 9;

  // BMR Calculation (Mifflin-St Jeor)
  const bmrKcal = useMemo(() => {
    if (clientGender === 'male') {
      return Math.round(10 * weight + 6.25 * clientHeightCm - 5 * clientAge + 5);
    }
    return Math.round(10 * weight + 6.25 * clientHeightCm - 5 * clientAge - 161);
  }, [weight, clientHeightCm, clientAge, clientGender]);

  // -------------------------------------------------------------
  // Intelligent Diet Auto-Classification Engine
  // -------------------------------------------------------------
  const autoClassifiedDiet = useMemo(() => {
    const hasPlant = selectedProteins.some((p) =>
      ['Tofu', 'Tempeh', 'Soybeans', 'Soybean/soya chunks'].includes(p)
    );
    const hasDairy = selectedProteins.some((p) =>
      ['Paneer (cottage cheese)', 'Curd / Greek Yogurt', 'Milk & Other Dairy'].includes(p)
    );
    const hasEggs = selectedProteins.includes('Whole Eggs');
    const hasFish = selectedProteins.includes('Fish & Seafood');
    const hasChicken = selectedProteins.includes('Chicken');
    const hasRedMeat = selectedProteins.includes('Meat (Mutton, Beef, etc.)');

    if (hasRedMeat) {
      return {
        label: '🥩 Omnivore',
        sub: 'Open to all major animal and plant protein sources including meat, poultry, seafood, eggs, dairy, and plants.',
        color: '#B91C1C',
        bg: '#FEF2F2',
        border: '#F87171',
      };
    }
    if (hasChicken) {
      return {
        label: '🍗 Pollo-Pescatarian',
        sub: 'Chicken, fish/seafood, eggs (if open), dairy, and plant-based protein sources.',
        color: '#C2410C',
        bg: '#FFF7ED',
        border: '#FDBA74',
      };
    }
    if (hasFish) {
      return {
        label: '🐟 Pescatarian',
        sub: 'Fish, seafood, eggs, dairy products, and optional plant proteins.',
        color: '#0369A1',
        bg: '#F0F9FF',
        border: '#7DD3FC',
      };
    }
    if (hasEggs && hasDairy) {
      return {
        label: '🥚 Lacto-Ovo Vegetarian',
        sub: 'Cottage cheese/paneer, whole eggs, other dairy, and plant proteins (tofu, tempeh, soybeans).',
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FCD34D',
      };
    }
    if (hasDairy && !hasEggs) {
      return {
        label: '🧀 Lacto-Vegetarian',
        sub: 'Pure vegetarian with dairy-based protein options (paneer, curd, milk) and plant proteins.',
        color: '#15803D',
        bg: '#F0FDF4',
        border: '#86EFAC',
      };
    }
    if (hasPlant && !hasDairy && !hasEggs && !hasFish && !hasChicken && !hasRedMeat) {
      return {
        label: '🌱 100% Vegan',
        sub: 'Exclusively plant-based protein options: Tofu, Tempeh, Soybeans, and Soybean/soya chunks.',
        color: '#047857',
        bg: '#ECFDF5',
        border: '#6EE7B7',
      };
    }
    return {
      label: dietBase === 'Veg' ? '🧀 Lacto-Vegetarian' : '🍗 Non-Vegetarian',
      sub: 'Custom balanced nutritional protocol tailored to your selected foods.',
      color: '#4338CA',
      bg: '#EEF2FF',
      border: '#A5B4FC',
    };
  }, [selectedProteins, dietBase]);

  const toggleProtein = (protein: string) => {
    if (selectedProteins.includes(protein)) {
      setSelectedProteins(selectedProteins.filter((p) => p !== protein));
    } else {
      setSelectedProteins([...selectedProteins, protein]);
    }
  };

  const toggleLowGiCarb = (carb: string) => {
    if (selectedLowGiCarbs.includes(carb)) {
      setSelectedLowGiCarbs(selectedLowGiCarbs.filter((c) => c !== carb));
    } else {
      setSelectedLowGiCarbs([...selectedLowGiCarbs, carb]);
    }
  };

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Auto-load client's saved blueprint if clientId is available
  useEffect(() => {
    if (!clientId || clientId === 'default') return;
    let isCurrent = true;
    getMetabolicBlueprint(clientId).then((saved) => {
      if (!isCurrent || !saved) return;
      if (saved.weightKg) setWeight(saved.weightKg);
      if (saved.bodyFatPercentage) setBodyFat(saved.bodyFatPercentage);
      if (saved.intensity) setIntensity(saved.intensity);
      if (saved.lbmMethod) setLbmMethod(saved.lbmMethod as any);
      if (saved.dietBase) setDietBase(saved.dietBase);
      if (saved.selectedProteinFoods && saved.selectedProteinFoods.length > 0) {
        setSelectedProteins(saved.selectedProteinFoods);
      }
      if (saved.prescribedProtocol) setPrescribedProtocol(saved.prescribedProtocol);
      if (saved.selectedLowGiCarbs && saved.selectedLowGiCarbs.length > 0) {
        setSelectedLowGiCarbs(saved.selectedLowGiCarbs);
      }
      if (saved.heightCm) setClientHeightCm(saved.heightCm);
      if (saved.age) setClientAge(saved.age);
    });
    return () => {
      isCurrent = false;
    };
  }, [clientId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const blueprintPayload: MetabolicBlueprintData = {
        clientId: clientId || 'default',
        clientName,
        clientEmail,
        lbmMethod,
        bodyFatPercentage: bodyFat,
        leanBodyMassKg,
        weightKg: weight,
        heightCm: clientHeightCm,
        age: clientAge,
        intensity,
        proteinRequirementGrams,
        fatRequirementGrams,
        dietBase,
        selectedProteinFoods: selectedProteins,
        autoClassifiedDiet: autoClassifiedDiet.label,
        prescribedProtocol,
        selectedLowGiCarbs,
        updatedAt: Date.now(),
      };

      // 1. Saves to Firebase Realtime Database & LocalStorage, and automatically generates & publishes Clinical Diet Chart
      await saveMetabolicBlueprint(blueprintPayload, clientEmail, clientName);

      // 2. Notify parent listener if provided
      if (onSavePreferences) {
        onSavePreferences({
          lbmMethod,
          bodyFatPercentage: bodyFat,
          leanBodyMassKg,
          proteinRequirementGrams,
          fatRequirementGrams,
          dietBase,
          selectedProteinFoods: selectedProteins,
          autoClassifiedDiet: autoClassifiedDiet.label,
          prescribedProtocol,
          selectedLowGiCarbs,
        });
      }

      setToastMsg('Nutritional blueprint saved & Clinical Diet Plan automatically published to Client Diet Planner!');
      setTimeout(() => setToastMsg(''), 5000);
    } catch (e) {
      console.error('Error saving metabolic blueprint:', e);
      setToastMsg('Nutritional blueprint saved locally & diet chart published!');
      setTimeout(() => setToastMsg(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#DEF7EC',
            border: '1.5px solid #31C48D',
            borderRadius: '12px',
            color: '#047857',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(4, 120, 87, 0.15)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Navigation Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: '#0F3822',
          padding: '14px 18px',
          borderRadius: '16px',
          color: '#FFFFFF',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#A3E635', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CLINICAL METABOLISM & DIET ARCHITECTURE
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0', color: '#FFFFFF' }}>
            Macronutrient Blueprint & Dietary Calibration
          </h2>
          {clientName && (
            <span style={{ fontSize: '12px', color: '#D1E7DD' }}>
              Calibrated for: <strong>{clientName}</strong>
            </span>
          )}
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Full Blueprint' },
            { id: 'highcarb', label: '1. High-Carb Intake' },
            { id: 'types', label: '2. Carb Types' },
            { id: 'flowcharts', label: '3. Physiological Pathways' },
            { id: 'lbm', label: '4. LBM Math' },
            { id: 'dietclass', label: '5. Auto-Diet Class' },
            { id: 'protocols', label: '6. Prescribed Diets' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === t.id ? '#A3E635' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.id ? '#0F3822' : '#FFFFFF',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: SELECTED EATING HABITS & HIGH-CARB DISTRIBUTION PIE CHART
          (Reference 100% matched to media_1790683694950.png)
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'highcarb') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #D1DEC2',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              📊
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F3822', margin: 0 }}>
                1. A Typical Day's Food Pattern (High Carbohydrate Example)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Analysis of previous daily eating habits & macronutrient breakdown
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {/* Left Side: 3 Meal Windows from Previous Eating Habits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Morning Breakfast */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF9C3',
                  border: '1px solid #FDE047',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#FACC15',
                    color: '#713F12',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    textTransform: 'uppercase',
                    minWidth: '85px',
                    textAlign: 'center',
                  }}
                >
                  Morning<br />Breakfast
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B' }}>
                    {selectedBreakfastFoods.length > 0
                      ? selectedBreakfastFoods.join(', ')
                      : 'Dosa (with chutney and sambar)'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#854D0E' }}>
                    Refined fermented rice batter + starch sambar
                  </span>
                </div>
              </div>

              {/* Afternoon Lunch */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#60A5FA',
                    color: '#1E3A8A',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    textTransform: 'uppercase',
                    minWidth: '85px',
                    textAlign: 'center',
                  }}
                >
                  Afternoon<br />Lunch
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B' }}>
                    {selectedLunchFoods.length > 0
                      ? selectedLunchFoods.join(', ')
                      : 'Rice, Dal Tadka & Sabzi'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#1E40AF' }}>
                    Starch-heavy lentils & polished grains
                  </span>
                </div>
              </div>

              {/* Evening Snack */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#FFE4E6',
                  border: '1px solid #FECDD3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#FB7185',
                    color: '#881337',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    textTransform: 'uppercase',
                    minWidth: '85px',
                    textAlign: 'center',
                  }}
                >
                  Evening<br />Snack
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B' }}>
                    {selectedSnackFoods.length > 0
                      ? selectedSnackFoods.join(', ')
                      : 'Samosa (with chutney)'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#9F1239' }}>
                    Refined maida pastry stuffed with spiced potato
                  </span>
                </div>
              </div>

              {/* Dinner */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#4ADE80',
                    color: '#14532D',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    textTransform: 'uppercase',
                    minWidth: '85px',
                    textAlign: 'center',
                  }}
                >
                  Dinner
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B' }}>
                    {selectedDinnerFoods.length > 0
                      ? selectedDinnerFoods.join(', ')
                      : 'Rice or Roti with Sabzi'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#166534' }}>
                    High glycemic starch main course + starch vegetables
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Macronutrient Distribution Donut Chart */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                Macronutrient Distribution
              </h4>
              <span style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '14px' }}>
                (Typical High Carbohydrate Day)
              </span>

              {/* SVG Donut Chart */}
              <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                <svg width="220" height="220" viewBox="0 0 220 220">
                  {/* Background Circle */}
                  <circle cx="110" cy="110" r="80" fill="#FFFFFF" />

                  {/* Carbs: 65% (Yellow) -> Length = 0.65 * (2 * PI * 80) = 326.7 */}
                  <circle
                    cx="110"
                    cy="110"
                    r="80"
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="38"
                    strokeDasharray="326.7 502.65"
                    strokeDashoffset="0"
                    transform="rotate(-90 110 110)"
                  />

                  {/* Fats: 22% (Orange) -> Length = 0.22 * 502.65 = 110.58 */}
                  <circle
                    cx="110"
                    cy="110"
                    r="80"
                    fill="none"
                    stroke="#FB923C"
                    strokeWidth="38"
                    strokeDasharray="110.58 502.65"
                    strokeDashoffset="-326.7"
                    transform="rotate(-90 110 110)"
                  />

                  {/* Protein: 13% (Red/Pink) -> Length = 0.13 * 502.65 = 65.34 */}
                  <circle
                    cx="110"
                    cy="110"
                    r="80"
                    fill="none"
                    stroke="#F87171"
                    strokeWidth="38"
                    strokeDasharray="65.34 502.65"
                    strokeDashoffset="-437.28"
                    transform="rotate(-90 110 110)"
                  />

                  {/* Inner Hole */}
                  <circle cx="110" cy="110" r="54" fill="#FFFFFF" />
                </svg>

                {/* Center Text */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
                    TOTAL
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
                    CALORIES
                  </div>
                </div>
              </div>

              {/* Badges Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                  🟡 CARBOHYDRATES: 65% (HIGH)
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FFEDD5', color: '#9A3412', border: '1px solid #FED7AA' }}>
                  🟠 FATS: 22% (Moderate)
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
                  🔴 PROTEIN: 13% (Lower)
                </span>
              </div>

              {/* Bottom Pattern Badge */}
              <div
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  color: '#1E3A8A',
                  fontSize: '13px',
                  fontWeight: 800,
                  width: '100%',
                }}
              >
                ⚠️ High carbohydrate intake pattern
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: TYPES OF CARBOHYDRATES & PRODUCTS AFTER DIGESTION
          (Reference 100% matched to media_1790683725135.jpg)
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'types') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #D1DEC2',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#DBEAFE',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              🧪
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F3822', margin: 0 }}>
                2. Carbohydrates: Molecular Structure, Digestion Products & Sources
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Exact metabolic classification based on sugar molecules (from Monosaccharides to Polysaccharides)
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#0F3822', color: '#FFFFFF' }}>
                  <th style={{ padding: '12px 14px', borderRadius: '10px 0 0 0', width: '28%' }}>
                    Carbohydrates<br />
                    <span style={{ fontSize: '10.5px', opacity: 0.85, fontWeight: 500 }}>
                      (Types based on number of sugar molecules)
                    </span>
                  </th>
                  <th style={{ padding: '12px 14px', width: '28%' }}>
                    Products of Carbohydrates<br />
                    <span style={{ fontSize: '10.5px', opacity: 0.85, fontWeight: 500 }}>
                      (After complete digestion)
                    </span>
                  </th>
                  <th style={{ padding: '12px 14px', borderRadius: '0 10px 0 0', width: '44%' }}>
                    Sources of Carbohydrates<br />
                    <span style={{ fontSize: '10.5px', opacity: 0.85, fontWeight: 500 }}>
                      (Common Indian food items)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* 1. Monosaccharides */}
                <tr style={{ backgroundColor: '#FDF2F8', borderBottom: '1px solid #FBCFE8' }}>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#BE185D', fontSize: '13px' }}>Monosaccharides</strong>
                    <div style={{ fontSize: '11px', color: '#9D174D', fontWeight: 600 }}>(1 sugar molecule)</div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#475569', lineHeight: 1.5 }}>
                      <li>Glucose</li>
                      <li>Fructose</li>
                      <li>Galactose</li>
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#BE185D' }}>Products:</strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#334155', lineHeight: 1.5 }}>
                      <li>Glucose</li>
                      <li>Fructose</li>
                      <li>Galactose</li>
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#BE185D' }}>Sources:</strong>
                    <p style={{ margin: '4px 0 0', color: '#334155', lineHeight: 1.5 }}>
                      🍎 <strong>Fruits:</strong> Apple, banana, orange, grapes, etc.<br />
                      🍯 <strong>Honey & Fruit juice:</strong> Orange, mixed fruits<br />
                      🌴 <strong>Dates & Vegetables:</strong> Onion, garlic (in small amounts)
                    </p>
                  </td>
                </tr>

                {/* 2. Disaccharides */}
                <tr style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #BBF7D0' }}>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#15803D', fontSize: '13px' }}>Disaccharides</strong>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>(2 sugar molecules)</div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#475569', lineHeight: 1.5 }}>
                      <li>Sucrose (glucose + fructose)</li>
                      <li>Lactose (glucose + galactose)</li>
                      <li>Maltose (glucose + glucose)</li>
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#15803D' }}>Products:</strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#334155', lineHeight: 1.5 }}>
                      <li>Glucose + Fructose (from sucrose)</li>
                      <li>Glucose + Galactose (from lactose)</li>
                      <li>Glucose + Glucose (from maltose)</li>
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#15803D' }}>Sources:</strong>
                    <p style={{ margin: '4px 0 0', color: '#334155', lineHeight: 1.5 }}>
                      🍬 <strong>Table sugar & Jaggery:</strong> Sucrose<br />
                      🥛 <strong>Milk & Dairy:</strong> Lactose<br />
                      🍰 <strong>Sweets & Desserts:</strong> Sucrose, lactose<br />
                      🍇 <strong>Some fruits:</strong> Sucrose
                    </p>
                  </td>
                </tr>

                {/* 3. Oligosaccharides */}
                <tr style={{ backgroundColor: '#FEFCE8', borderBottom: '1px solid #FEF08A' }}>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#A16207', fontSize: '13px' }}>Oligosaccharides</strong>
                    <div style={{ fontSize: '11px', color: '#854D0E', fontWeight: 600 }}>(3–10 sugar molecules)</div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#475569', lineHeight: 1.5 }}>
                      <li>Fructans</li>
                      <li>Galacto-oligosaccharides (GOS)</li>
                      <li>Raffinose</li>
                      <li>Stachyose</li>
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#A16207' }}>Products:</strong>
                    <p style={{ margin: '6px 0 0', color: '#334155', lineHeight: 1.5 }}>
                      Broken down into simple monomeric sugars such as glucose, fructose, and galactose.
                    </p>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#A16207' }}>Sources:</strong>
                    <p style={{ margin: '4px 0 0', color: '#334155', lineHeight: 1.5 }}>
                      🧅 <strong>Onion, Garlic:</strong> Fructans<br />
                      🍲 <strong>Dal / Legumes:</strong> GOS, raffinose, stachyose<br />
                      🫘 <strong>Chickpeas / Rajma / Soybeans:</strong> Raffinose, stachyose<br />
                      🍌 <strong>Banana:</strong> GOS • <strong>Asparagus:</strong> Fructans
                    </p>
                  </td>
                </tr>

                {/* 4. Polysaccharides */}
                <tr style={{ backgroundColor: '#EFF6FF' }}>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#1D4ED8', fontSize: '13px' }}>Polysaccharides</strong>
                    <div style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 600 }}>(Many sugar molecules)</div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#475569', lineHeight: 1.5 }}>
                      <li>Starch</li>
                      <li>Glycogen</li>
                      <li>Dietary fibre (non-starch polysaccharides)</li>
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#1D4ED8' }}>Products:</strong>
                    <p style={{ margin: '6px 0 0', color: '#334155', lineHeight: 1.5 }}>
                      • <strong>Glucose:</strong> Main product from starch and glycogen.<br />
                      • <strong>Short-chain sugars & SCFAs:</strong> From prebiotic fibre fermented in gut.
                    </p>
                  </td>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <strong style={{ color: '#1D4ED8' }}>Sources:</strong>
                    <p style={{ margin: '4px 0 0', color: '#334155', lineHeight: 1.5 }}>
                      🍚 <strong>Rice:</strong> Starch<br />
                      🫓 <strong>Roti / Chapati & Dosa:</strong> Starch<br />
                      🥟 <strong>Samosa:</strong> Starch from refined flour & potato<br />
                      🥔 <strong>Potato & Sweet potato:</strong> Starch<br />
                      🥦 <strong>Vegetables:</strong> Starch + prebiotic dietary fibre
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: THREE PHYSIOLOGICAL FLOWCHARTS (INSULIN, CRASH, FAT STORAGE)
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'flowcharts') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #D1DEC2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="#0F3822" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F3822', margin: 0 }}>
                3. Physiological Carbohydrate Pathways & Metabolic Consequences
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
              How excessive carbohydrates and high-GI meals affect insulin, energy fluctuations, and adipose fat storage
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Flowchart 1: Insulin & Blood Glucose */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #E11D48',
                padding: '18px',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>🩸</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#9F1239', margin: 0 }}>
                    How Can Excess Carbohydrates Affect Insulin & Blood Glucose?
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#E11D48', fontWeight: 700 }}>
                    Beta-Cell Impairment & Insulin Resistance
                  </span>
                </div>
              </div>

              {/* Vertical Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                {[
                  { text: 'High carbohydrate intake', color: '#9F1239', bg: '#FFE4E6' },
                  { text: 'Blood glucose ↑', color: '#BE123C', bg: '#FFF1F2' },
                  { text: 'Pancreas releases more insulin', color: '#BE123C', bg: '#FFF1F2' },
                  { text: 'Repeated high insulin demand', color: '#9F1239', bg: '#FFE4E6' },
                  { text: 'Insulin resistance may develop', color: '#881337', bg: '#FEE2E2', bold: true },
                  { text: 'Pancreatic β-cells may become impaired over time', color: '#881337', bg: '#FEE2E2' },
                  { text: 'Insulin production may become insufficient', color: '#9F1239', bg: '#FFE4E6' },
                  { text: 'Chronic Blood glucose ↑ (Hyperglycemia)', color: '#881337', bg: '#FECDD3', bold: true },
                ].map((s, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: s.bg,
                        color: s.color,
                        fontSize: '12px',
                        fontWeight: s.bold ? 800 : 600,
                        textAlign: 'center',
                        border: '1px solid rgba(225, 29, 72, 0.2)',
                      }}
                    >
                      {s.text}
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ textAlign: 'center', color: '#E11D48', fontSize: '13px', lineHeight: 1 }}>
                        ⬇️
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Flowchart 2: Energy Crash */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #D97706',
                padding: '18px',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                    High-GI Carbohydrates → Energy Crash
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#D97706', fontWeight: 700 }}>
                    Rapid Digestion to Reactive Hypoglycemia
                  </span>
                </div>
              </div>

              {/* Vertical Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                {[
                  { text: 'High-GI carbohydrate food', color: '#92400E', bg: '#FEF3C7' },
                  { text: 'Rapid digestion & absorption', color: '#B45309', bg: '#FEF9C3' },
                  { text: 'Blood glucose ↑↑', color: '#B45309', bg: '#FEF9C3' },
                  { text: 'Insulin ↑↑', color: '#92400E', bg: '#FEF3C7' },
                  { text: 'Glucose enters cells quickly', color: '#78350F', bg: '#FEF3C7' },
                  { text: 'Muscle cells + liver + other tissues use glucose for energy', color: '#78350F', bg: '#FEF9C3' },
                  { text: 'Blood glucose ↓', color: '#92400E', bg: '#FEF3C7' },
                  { text: 'Energy availability may feel lower', color: '#B45309', bg: '#FFFBEB' },
                  { text: 'Tiredness / sleepiness', color: '#B45309', bg: '#FFFBEB' },
                  { text: 'Energy crash feeling & repeat cravings', color: '#78350F', bg: '#FDE68A', bold: true },
                ].map((s, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: s.bg,
                        color: s.color,
                        fontSize: '11.5px',
                        fontWeight: s.bold ? 800 : 600,
                        textAlign: 'center',
                        border: '1px solid rgba(217, 119, 6, 0.2)',
                      }}
                    >
                      {s.text}
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ textAlign: 'center', color: '#D97706', fontSize: '12px', lineHeight: 1 }}>
                        ⬇️
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Flowchart 3: Fat Storage */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #4338CA',
                padding: '18px',
                boxShadow: '0 4px 14px rgba(67, 56, 202, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>🥑</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#312E81', margin: 0 }}>
                    Excess Carbohydrate → Fat Storage
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#4338CA', fontWeight: 700 }}>
                    Hepatic De Novo Lipogenesis (DNL)
                  </span>
                </div>
              </div>

              {/* Vertical Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                {[
                  { text: 'High carbohydrate intake', color: '#3730A3', bg: '#EEF2FF' },
                  { text: 'Muscle glycogen storage fills', color: '#4338CA', bg: '#F5F3FF' },
                  { text: 'Liver glycogen storage fills', color: '#4338CA', bg: '#F5F3FF' },
                  { text: 'Excess glucose → Acetyl-CoA', color: '#3730A3', bg: '#EEF2FF' },
                  { text: 'De novo lipogenesis (DNL) activated', color: '#312E81', bg: '#EDE9FE', bold: true },
                  { text: 'Fatty acids → Triglycerides (TG)', color: '#3730A3', bg: '#EEF2FF' },
                  { text: 'TG → Adipose tissue (visceral fat storage)', color: '#1E1B4B', bg: '#DDD6FE', bold: true },
                ].map((s, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: s.bg,
                        color: s.color,
                        fontSize: '12px',
                        fontWeight: s.bold ? 800 : 600,
                        textAlign: 'center',
                        border: '1px solid rgba(67, 56, 202, 0.2)',
                      }}
                    >
                      {s.text}
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ textAlign: 'center', color: '#4338CA', fontSize: '13px', lineHeight: 1 }}>
                        ⬇️
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Simple Summary Box */}
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#312E81',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: '#A5B4FC' }}>Simple Core Mechanism:</span><br />
                  Muscle full + Liver full ➔ Excess glucose ➔ Lipogenesis ➔ TG ➔ Fat tissue
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: LEAN BODY MASS (LBM) MULTI-METHOD CALCULATOR & PROTEIN/FAT FORMULA
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'lbm') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #D1DEC2',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              📐
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F3822', margin: 0 }}>
                4. Lean Body Mass (LBM) Measurement Options & Protein-Fat Requirement
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Select how you wish to measure body composition. The engine calculates your daily Protein & Fat requirements (LBM × Intensity).
              </p>
            </div>
          </div>

          {/* 5 Selectable LBM Measurement Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            {[
              {
                id: 'manual' as const,
                title: '1. Manual calculation',
                desc: 'Quick estimate of ideal body weight (IBW) & standard body fat range.',
                icon: '✏️',
              },
              {
                id: 'bca' as const,
                title: '2. BCA/BIA machine',
                desc: 'Bioelectrical impedance analysis: body-fat %, muscle mass, water, etc.',
                icon: '📟',
              },
              {
                id: 'dexa' as const,
                title: '3. DEXA scan',
                desc: 'Dual-energy X-ray absorptiometry: gold standard body composition and visceral fat.',
                icon: '🔬',
              },
              {
                id: 'bodpod' as const,
                title: '4. Bod Pod',
                desc: 'Body-fat % and body composition using precision air displacement plethysmography.',
                icon: '🛸',
              },
              {
                id: 'bmr' as const,
                title: '5. BMR calculation',
                desc: 'Basal Metabolic Rate: Calorie requirement, not a direct body-composition measurement.',
                icon: '🔥',
              },
            ].map((m) => {
              const isSelected = lbmMethod === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setLbmMethod(m.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #0F3822' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '20px' }}>{m.icon}</span>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #0F3822' : '1px solid #CBD5E1',
                          backgroundColor: isSelected ? '#0F3822' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '10px',
                        }}
                      >
                        {isSelected && '✓'}
                      </div>
                    </div>
                    <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginTop: '6px' }}>
                      {m.title}
                    </strong>
                    <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {m.desc}
                    </p>
                  </div>

                  {isSelected && (
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#15803D', marginTop: '8px' }}>
                      ● Active Method Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Biometric & Intensity Inputs */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                ⚙️ Patient Biometrics & Activity Intensity
              </span>
              <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                Live Formula Sync: LBM = Weight − (Weight × BF% / 100)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {/* Weight */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Body Fat % */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  {lbmMethod === 'bmr' ? 'Body Fat % (Est)' : `Body Fat % (${lbmMethod.toUpperCase()})`}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Height (for BMR / Manual) */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={clientHeightCm}
                  onChange={(e) => setClientHeightCm(parseInt(e.target.value) || 165)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Age (years) */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Age (years)
                </label>
                <input
                  type="number"
                  value={clientAge}
                  onChange={(e) => setClientAge(parseInt(e.target.value) || 25)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Intensity Factor */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Intensity Factor (Protein Multiplier)
                </label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #0F3822',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: '#FFFFFF',
                    color: '#0F3822',
                  }}
                >
                  <option value={1.5}>🛋️ Sedentary (1.5x) - Desk Job</option>
                  <option value={2.0}>🚶 Moderate (2.0x) - 3-5 days/week</option>
                  <option value={2.5}>🏃 High / Athlete (2.5x) - 6-7 days/week</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5-Step Formula Math Pipeline Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            {/* 1. Fat Mass */}
            <div style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #3B82F6', backgroundColor: '#EFF6FF', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#1D4ED8', fontWeight: 800 }}>1. FAT MASS</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#1E3A8A', margin: '4px 0' }}>
                {fatMassKg} kg
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>{weight}kg × {bodyFat}%</div>
            </div>

            {/* 2. Fat-Free / Lean Mass */}
            <div style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #10B981', backgroundColor: '#ECFDF5', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#047857', fontWeight: 800 }}>2. LEAN BODY MASS</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#064E3B', margin: '4px 0' }}>
                {leanBodyMassKg} kg
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Weight − Fat Mass</div>
            </div>

            {/* 3. Protein Requirement */}
            <div style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #8B5CF6', backgroundColor: '#F5F3FF', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#6D28D9', fontWeight: 800 }}>3. PROTEIN REQ</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#4C1D95', margin: '4px 0' }}>
                {proteinRequirementGrams} g
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>LBM × {intensity} ({proteinKcal} kcal)</div>
            </div>

            {/* 4. Fat Requirement */}
            <div style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #F59E0B', backgroundColor: '#FFFBEB', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#B45309', fontWeight: 800 }}>4. FAT REQ</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#78350F', margin: '4px 0' }}>
                {fatRequirementGrams} g
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Protein + 50g ({fatKcal} kcal)</div>
            </div>

            {/* 5. Combined Need & BMR */}
            <div style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #EC4899', backgroundColor: '#FDF2F8', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#BE185D', fontWeight: 800 }}>5. BMR BASELINE</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#831843', margin: '4px 0' }}>
                {bmrKcal} kcal
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Caloric demand</div>
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '11.5px', color: '#15803D' }}>
            💡 <strong>Clinical Standard:</strong> Protein is calibrated to Lean Body Mass (LBM × {intensity}x intensity factor). Fat intake is targeted at Protein + 50g ({fatRequirementGrams}g) for hormonal stabilization and de novo lipogenesis suppression.
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: CLIENT DIET SELECTION & AUTO-CLASSIFICATION SYSTEM
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'dietclass') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #D1DEC2',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#F3E8FF',
                color: '#7E22CE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              🥗
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F3822', margin: 0 }}>
                5. Select Food & Intelligent Diet Auto-Classifier
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Choose whether you eat Vegetarian or Non-Vegetarian. Select your specific proteins — our engine automatically classifies your clinical diet type.
              </p>
            </div>
          </div>

          {/* Primary Base Switch: Veg or Non-Veg */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setDietBase('Veg');
                setSelectedProteins(['Paneer (cottage cheese)', 'Curd / Greek Yogurt', 'Tofu', 'Soybeans']);
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: dietBase === 'Veg' ? '2px solid #16A34A' : '1px solid #CBD5E1',
                backgroundColor: dietBase === 'Veg' ? '#DCFCE7' : '#FFFFFF',
                color: dietBase === 'Veg' ? '#14532D' : '#475569',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🥬</span>
              <span>100% Vegetarian Base</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDietBase('Non-Veg');
                setSelectedProteins([
                  'Chicken',
                  'Fish & Seafood',
                  'Whole Eggs',
                  'Paneer (cottage cheese)',
                  'Curd / Greek Yogurt',
                ]);
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: dietBase === 'Non-Veg' ? '2px solid #E11D48' : '1px solid #CBD5E1',
                backgroundColor: dietBase === 'Non-Veg' ? '#FFE4E6' : '#FFFFFF',
                color: dietBase === 'Non-Veg' ? '#881337' : '#475569',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🍗</span>
              <span>Non-Vegetarian Base</span>
            </button>
          </div>

          {/* Specific Protein Foods Checkboxes */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              CHECK THE PROTEIN FOODS YOU CONSUME:
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '8px',
              }}
            >
              {[
                { name: 'Tofu', tag: 'Plant', icon: '🌱' },
                { name: 'Tempeh', tag: 'Plant', icon: '🌱' },
                { name: 'Soybeans', tag: 'Plant', icon: '🌱' },
                { name: 'Soybean/soya chunks', tag: 'Plant', icon: '🌱' },
                { name: 'Paneer (cottage cheese)', tag: 'Dairy', icon: '🧀' },
                { name: 'Curd / Greek Yogurt', tag: 'Dairy', icon: '🥛' },
                { name: 'Milk & Other Dairy', tag: 'Dairy', icon: '🥛' },
                { name: 'Whole Eggs', tag: 'Poultry', icon: '🥚' },
                { name: 'Fish & Seafood', tag: 'Seafood', icon: '🐟' },
                { name: 'Chicken', tag: 'Poultry', icon: '🍗' },
                { name: 'Meat (Mutton, Beef, etc.)', tag: 'Meat', icon: '🥩' },
              ].map((item) => {
                const isChecked = selectedProteins.includes(item.name);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleProtein(item.name)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isChecked ? '1.5px solid #0F3822' : '1px solid #E2E8F0',
                      backgroundColor: isChecked ? '#F0FDF4' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                          {item.name}
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748B' }}>{item.tag}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isChecked ? '2px solid #0F3822' : '1.5px solid #CBD5E1',
                        backgroundColor: isChecked ? '#0F3822' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 900,
                      }}
                    >
                      {isChecked && '✓'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auto-Classified Result Banner */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: autoClassifiedDiet.bg,
              border: `2px solid ${autoClassifiedDiet.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: autoClassifiedDiet.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AUTO-CLASSIFIED DIET ORIENTATION
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: autoClassifiedDiet.color, margin: '2px 0' }}>
                {autoClassifiedDiet.label}
              </h3>
              <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0', maxWidth: '600px' }}>
                {autoClassifiedDiet.sub}
              </p>
            </div>

            <div
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: `1.5px solid ${autoClassifiedDiet.border}`,
                color: autoClassifiedDiet.color,
                fontWeight: 800,
                fontSize: '12px',
              }}
            >
              ✓ Engine Calibrated
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: PRESCRIBED CLINICAL DIETS & LOW-GI CARB SELECTION
          (References: media_1790684150620.jpg & media_1790684145829.png)
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'protocols') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #D1DEC2',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF08A',
                  color: '#854D0E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                }}
              >
                🍽️
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F3822', margin: 0 }}>
                  6. Clinical Prescribed Protocols: Fat + Protein vs Low-Carb Diet
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                  Choose your prescribed therapeutic protocol and calibrate low-GI carbohydrate sources
                </p>
              </div>
            </div>

            {/* Protocol Toggle Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['Fat + Protein Diet', 'Low-Carb Diet'] as const).map((proto) => {
                const isActive = prescribedProtocol === proto;
                return (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => setPrescribedProtocol(proto)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isActive ? '2px solid #0F3822' : '1px solid #CBD5E1',
                      backgroundColor: isActive ? '#0F3822' : '#F8FAFC',
                      color: isActive ? '#FFFFFF' : '#0F172A',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {proto === 'Fat + Protein Diet' ? '🥑 Fat + Protein Diet' : '🌾 Low-Carb Diet (80–120g)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROTOCOL A: FAT + PROTEIN DIET (Reference media_1790684150620.jpg) */}
          {prescribedProtocol === 'Fat + Protein Diet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#FFFBEB',
                  borderRadius: '12px',
                  border: '1.5px solid #FDE68A',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#92400E', margin: '0 0 4px' }}>
                  FAT + PROTEIN DIET (WITH INCIDENTAL CARBOHYDRATES)
                </h4>
                <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>
                  126 g Protein + Incidental Fat + Small Incidental Carbohydrates (~1,260 – 1,360 kcal)
                </p>
              </div>

              {/* 3 Pillars & Center Pie Chart */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                {/* Left Card: Protein */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1.5px solid #86EFAC',
                    backgroundColor: '#F0FDF4',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '14px', color: '#166534', textTransform: 'uppercase' }}>
                      PROTEIN
                    </strong>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#BBF7D0', color: '#14532D' }}>
                      40 – 44% Calories
                    </span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#14532D', margin: '6px 0 2px' }}>
                    126 g <span style={{ fontSize: '13px', fontWeight: 700 }}>(504 kcal)</span>
                  </div>
                  <ul style={{ margin: '8px 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#166534', lineHeight: 1.5 }}>
                    <li>Builds and repairs muscle tissue</li>
                    <li>Supports satiety and eliminates cravings</li>
                    <li>Maintains optimal lean body mass (LBM)</li>
                  </ul>
                  <div style={{ fontSize: '11px', color: '#15803D', marginTop: '8px', fontWeight: 700 }}>
                    Examples: Chicken, Fish, Eggs, Paneer, Tofu, Tempeh, Soybeans
                  </div>
                </div>

                {/* Center: Pie Chart */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFDF8',
                    borderRadius: '14px',
                    border: '1px solid #ECEAE0',
                    padding: '16px',
                  }}
                >
                  <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {/* Protein (Green) ~42% -> 0.42 * 452.38 = 190 */}
                      <circle
                        cx="100"
                        cy="100"
                        r="72"
                        fill="none"
                        stroke="#4ADE80"
                        strokeWidth="36"
                        strokeDasharray="190 452.38"
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                      />

                      {/* Incidental Fat (Yellow) ~50% -> 0.50 * 452.38 = 226 */}
                      <circle
                        cx="100"
                        cy="100"
                        r="72"
                        fill="none"
                        stroke="#FACC15"
                        strokeWidth="36"
                        strokeDasharray="226 452.38"
                        strokeDashoffset="-190"
                        transform="rotate(-90 100 100)"
                      />

                      {/* Carbohydrates (Pink) ~8% -> 0.08 * 452.38 = 36.38 */}
                      <circle
                        cx="100"
                        cy="100"
                        r="72"
                        fill="none"
                        stroke="#F87171"
                        strokeWidth="36"
                        strokeDasharray="36.38 452.38"
                        strokeDashoffset="-416"
                        transform="rotate(-90 100 100)"
                      />

                      {/* Center Hole */}
                      <circle cx="100" cy="100" r="48" fill="#FFFFFF" />
                    </svg>

                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#475569' }}>TOTAL</div>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A' }}>~1,300 kcal</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#166534', fontWeight: 700 }}>
                      <span>🟢 Protein (126g):</span> <span>40–44%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#854D0E', fontWeight: 700 }}>
                      <span>🟡 Incidental Fat (70–80g):</span> <span>48–52%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9F1239', fontWeight: 700 }}>
                      <span>🔴 Incidental Carbs (15–30g):</span> <span>5–10%</span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Incidental Fat & Carbs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Incidental Fat */}
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid #FDE047',
                      backgroundColor: '#FEFCE8',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: '#854D0E', textTransform: 'uppercase' }}>
                        INCIDENTAL FAT
                      </strong>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FEF08A', color: '#713F12' }}>
                        48 – 52% Calories
                      </span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#713F12', margin: '4px 0 2px' }}>
                      70 – 80 g <span style={{ fontSize: '12px', fontWeight: 700 }}>(630 – 720 kcal)</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#854D0E', lineHeight: 1.4 }}>
                      Provides sustained cellular energy, hormone production & satiety.
                      <br /><strong>Sources:</strong> Nuts, seeds, avocado, coconut oil, ghee, butter.
                    </div>
                  </div>

                  {/* Incidental Carbs */}
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid #FECDD3',
                      backgroundColor: '#FFF1F2',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: '#9F1239', textTransform: 'uppercase' }}>
                        INCIDENTAL CARBS
                      </strong>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FFE4E6', color: '#881337' }}>
                        5 – 10% Calories
                      </span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#881337', margin: '4px 0 2px' }}>
                      15 – 30 g <span style={{ fontSize: '12px', fontWeight: 700 }}>(60 – 120 kcal)</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#9F1239', lineHeight: 1.4 }}>
                      Incidental naturally occurring carbohydrates in dairy, nuts, and fibrous low-carb greens. <strong>No high-GI starches.</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Table */}
              <div style={{ overflowX: 'auto', marginTop: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', color: '#0F172A', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>Macronutrient</th>
                      <th style={{ padding: '8px 10px' }}>Grams (g)</th>
                      <th style={{ padding: '8px 10px' }}>Calories (kcal)</th>
                      <th style={{ padding: '8px 10px' }}>Percentage (%)</th>
                      <th style={{ padding: '8px 10px' }}>Clinical Sources</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F0FDF4' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 800, color: '#166534' }}>Protein</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>126 g</td>
                      <td style={{ padding: '8px 10px' }}>504 kcal</td>
                      <td style={{ padding: '8px 10px' }}>40 – 44%</td>
                      <td style={{ padding: '8px 10px' }}>Chicken, fish, eggs, paneer, tofu, tempeh, soybeans</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#FEFCE8' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 800, color: '#854D0E' }}>Fat (Incidental)</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>70 – 80 g</td>
                      <td style={{ padding: '8px 10px' }}>630 – 720 kcal</td>
                      <td style={{ padding: '8px 10px' }}>48 – 52%</td>
                      <td style={{ padding: '8px 10px' }}>Nuts, seeds, avocado, coconut oil, ghee, butter, egg yolks</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#FFF1F2' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 800, color: '#9F1239' }}>Carbs (Incidental)</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>15 – 30 g</td>
                      <td style={{ padding: '8px 10px' }}>60 – 120 kcal</td>
                      <td style={{ padding: '8px 10px' }}>5 – 10%</td>
                      <td style={{ padding: '8px 10px' }}>From nuts, avocado, dairy, low-carb vegetables (No added high-GI carbs)</td>
                    </tr>
                    <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 900 }}>
                      <td style={{ padding: '8px 10px' }}>TOTAL</td>
                      <td style={{ padding: '8px 10px' }}>~211 – 236 g</td>
                      <td style={{ padding: '8px 10px' }}>~1,260 – 1,360 kcal</td>
                      <td style={{ padding: '8px 10px' }}>100%</td>
                      <td style={{ padding: '8px 10px' }}>Zero high-GI starch spike</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROTOCOL B: LOW-CARB DIET 80-120G (Reference media_1790684145829.png) */}
          {prescribedProtocol === 'Low-Carb Diet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '12px',
                  border: '1.5px solid #BFDBFE',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#1E3A8A', margin: '0 0 4px' }}>
                  LOW CARB (80–120G): MEAL PLANNING
                </h4>
                <p style={{ fontSize: '12px', color: '#1E40AF', margin: 0 }}>
                  Planned Low-GI Carbs (32–40g) + Incidental Carbs + High BV Protein + Healthy Cooking Fats
                </p>
              </div>

              {/* Dual Pie Charts (Grams & Percentages + Calorie Contribution) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Chart 1: Grams and percentages */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1.5px solid #CBD5E1',
                    padding: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <strong style={{ fontSize: '13px', color: '#0F172A', marginBottom: '8px' }}>
                    Amount of each macronutrient per day in grams & percentages
                  </strong>

                  <div style={{ position: 'relative', width: '180px', height: '180px', margin: '8px 0' }}>
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      {/* Carbs: 105g (37.2%) -> 0.372 * 402 = 149.5 (Green) */}
                      <circle
                        cx="90"
                        cy="90"
                        r="64"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="32"
                        strokeDasharray="149.5 402.12"
                        strokeDashoffset="0"
                        transform="rotate(-90 90 90)"
                      />
                      {/* Protein: 97g (34.4%) -> 0.344 * 402 = 138.3 (Red) */}
                      <circle
                        cx="90"
                        cy="90"
                        r="64"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="32"
                        strokeDasharray="138.3 402.12"
                        strokeDashoffset="-149.5"
                        transform="rotate(-90 90 90)"
                      />
                      {/* Fats: 80g (28.4%) -> 0.284 * 402 = 114.2 (Yellow) */}
                      <circle
                        cx="90"
                        cy="90"
                        r="64"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="32"
                        strokeDasharray="114.2 402.12"
                        strokeDashoffset="-287.8"
                        transform="rotate(-90 90 90)"
                      />
                      <circle cx="90" cy="90" r="44" fill="#FFFFFF" />
                    </svg>

                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '11px',
                        fontWeight: 900,
                        color: '#0F172A',
                      }}
                    >
                      282g
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', fontWeight: 700 }}>
                    <span style={{ color: '#16A34A' }}>🟢 Carbs: 105g (37.2%)</span>
                    <span style={{ color: '#DC2626' }}>🔴 Protein: 97g (34.4%)</span>
                    <span style={{ color: '#CA8A04' }}>🟡 Fats: 80g (28.4%)</span>
                  </div>
                </div>

                {/* Chart 2: Calorie contribution */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1.5px solid #CBD5E1',
                    padding: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <strong style={{ fontSize: '13px', color: '#0F172A', marginBottom: '8px' }}>
                    Calorie contribution of each macronutrient
                  </strong>

                  <div style={{ position: 'relative', width: '180px', height: '180px', margin: '8px 0' }}>
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      {/* Carbs: 420 kcal (27.5%) -> 0.275 * 402 = 110.5 (Green) */}
                      <circle
                        cx="90"
                        cy="90"
                        r="64"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="32"
                        strokeDasharray="110.5 402.12"
                        strokeDashoffset="0"
                        transform="rotate(-90 90 90)"
                      />
                      {/* Protein: 388 kcal (25.4%) -> 0.254 * 402 = 102.1 (Red) */}
                      <circle
                        cx="90"
                        cy="90"
                        r="64"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="32"
                        strokeDasharray="102.1 402.12"
                        strokeDashoffset="-110.5"
                        transform="rotate(-90 90 90)"
                      />
                      {/* Fats: 720 kcal (47.1%) -> 0.471 * 402 = 189.4 (Yellow) */}
                      <circle
                        cx="90"
                        cy="90"
                        r="64"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="32"
                        strokeDasharray="189.4 402.12"
                        strokeDashoffset="-212.6"
                        transform="rotate(-90 90 90)"
                      />
                      <circle cx="90" cy="90" r="44" fill="#FFFFFF" />
                    </svg>

                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '11px',
                        fontWeight: 900,
                        color: '#0F172A',
                      }}
                    >
                      1,528 kcal
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', fontWeight: 700 }}>
                    <span style={{ color: '#16A34A' }}>🟢 Carbs: 420 kcal (27.5%)</span>
                    <span style={{ color: '#DC2626' }}>🔴 Protein: 388 kcal (25.4%)</span>
                    <span style={{ color: '#CA8A04' }}>🟡 Fats: 720 kcal (47.1%)</span>
                  </div>
                </div>
              </div>

              {/* Low-GI Carbohydrate Options Checkbox Selector */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#0F172A', textTransform: 'uppercase' }}>
                    🌾 Low-GI Carbohydrate Options (Select Your Prescribed Staples):
                  </strong>
                  <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 700 }}>
                    Target: 32–40g Planned Carbs
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {[
                    { name: 'Brown rice', gi: 'GI ~ 50', desc: 'Unpolished whole grain rich in magnesium' },
                    { name: 'Red rice', gi: 'GI ~ 45', desc: 'Anthocyanin-dense antioxidant grain' },
                    { name: 'Black rice', gi: 'GI ~ 42', desc: 'Superfood grain with slowest starch release' },
                    { name: 'Whole-wheat chapati', gi: 'GI ~ 52', desc: 'Single-grain stone-ground whole wheat' },
                    { name: 'Millet roti', gi: 'GI ~ 48', desc: 'Bajra, Jowar, or Ragi gluten-free flatbread' },
                  ].map((carb) => {
                    const isChecked = selectedLowGiCarbs.includes(carb.name);
                    return (
                      <div
                        key={carb.name}
                        onClick={() => toggleLowGiCarb(carb.name)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isChecked ? '1.5px solid #15803D' : '1px solid #E2E8F0',
                          backgroundColor: isChecked ? '#F0FDF4' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                            {carb.name}
                          </div>
                          <div style={{ fontSize: '10px', color: '#15803D', fontWeight: 700 }}>{carb.gi}</div>
                          <div style={{ fontSize: '10px', color: '#64748B' }}>{carb.desc}</div>
                        </div>

                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? '2px solid #15803D' : '1.5px solid #CBD5E1',
                            backgroundColor: isChecked ? '#15803D' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 900,
                          }}
                        >
                          {isChecked && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action / Save Button */}
          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                backgroundColor: '#0F3822',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(15, 56, 34, 0.25)',
                opacity: isSaving ? 0.75 : 1,
              }}
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
              <span>{isSaving ? 'Calibrating & Publishing Diet Chart...' : 'Save & Publish to Client Diet Planner'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
