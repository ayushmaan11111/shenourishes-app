import React, { useState } from 'react';
import { X, Check, Plus, Trash2, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import {
  getClientActiveDietChart,
  publishClientDietChart,
  calculateMealTotals,
  calculateChartTotals,
  CLINICAL_TEMPLATES_CATALOG,
} from '../../services/clinicalDietTemplates';
import { CLINICAL_SUPPLEMENTS_CATALOG } from '../../services/clinicalSupplementsCatalog';
import { INDIAN_FOOD_CATALOG } from '../../data/indianFoodCatalog';
import type { ClinicalDietChart, ClinicalMealBlock, ClinicalFoodRow } from '../../types/clinicalChart';

interface ClinicalDietChartEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
}

export const ClinicalDietChartEditorModal: React.FC<ClinicalDietChartEditorModalProps> = ({
  isOpen,
  onClose,
  clientId = 'default',
  clientName = 'Client',
  clientEmail,
}) => {
  const [chart, setChart] = useState<ClinicalDietChart>(() => getClientActiveDietChart(clientId));
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const totals = calculateChartTotals(chart);

  // Load a pre-set template from the /Sedentary clinical catalog
  const handleLoadTemplate = (templateId: string) => {
    const found = CLINICAL_TEMPLATES_CATALOG.find((t) => t.id === templateId);
    if (found) {
      setChart({
        ...found.chart,
        clientId,
        publishedAt: Date.now(),
      });
    }
  };

  // Meal Block Handlers
  const handleUpdatePreMealSupplement = (mealIndex: number, text: string) => {
    const updatedMeals = [...chart.meals];
    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], preMealSupplement: text };
    setChart({ ...chart, meals: updatedMeals });
  };

  const handleUpdatePostMealSupplement = (mealIndex: number, text: string) => {
    const updatedMeals = [...chart.meals];
    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], postMealSupplement: text };
    setChart({ ...chart, meals: updatedMeals });
  };

  // Food Item Handlers
  const handleAddFoodRow = (mealIndex: number) => {
    const updatedMeals = [...chart.meals];
    const currentFoods = updatedMeals[mealIndex].foods || [];
    const newFood: ClinicalFoodRow = {
      id: 'food_' + Math.random().toString(36).substring(2, 9),
      rowNumber: currentFoods.length + 1,
      foodName: '',
      quantity: '',
      proteinGrams: 0,
      fatGrams: 0,
      carbsGrams: 0,
      calories: 0,
    };
    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], foods: [...currentFoods, newFood] };
    setChart({ ...chart, meals: updatedMeals });
  };

  const handleUpdateFoodRow = (mealIndex: number, foodIndex: number, field: keyof ClinicalFoodRow, value: any) => {
    const updatedMeals = [...chart.meals];
    const foods = [...updatedMeals[mealIndex].foods];
    foods[foodIndex] = { ...foods[foodIndex], [field]: value };
    
    // Auto-calculate row calories if macros change
    if (field === 'proteinGrams' || field === 'fatGrams' || field === 'carbsGrams') {
      const p = field === 'proteinGrams' ? Number(value) : foods[foodIndex].proteinGrams || 0;
      const f = field === 'fatGrams' ? Number(value) : foods[foodIndex].fatGrams || 0;
      const c = field === 'carbsGrams' ? Number(value) : foods[foodIndex].carbsGrams || 0;
      foods[foodIndex].calories = Math.round(p * 4 + f * 9 + c * 4);
    }

    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], foods };
    setChart({ ...chart, meals: updatedMeals });
  };

  const handleDeleteFoodRow = (mealIndex: number, foodIndex: number) => {
    const updatedMeals = [...chart.meals];
    const foods = updatedMeals[mealIndex].foods.filter((_: ClinicalFoodRow, idx: number) => idx !== foodIndex);
    // Re-index row numbers
    const reindexed = foods.map((f: ClinicalFoodRow, i: number) => ({ ...f, rowNumber: i + 1 }));
    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], foods: reindexed };
    setChart({ ...chart, meals: updatedMeals });
  };

  const handleAddMealBlock = () => {
    const newMealNumber = chart.meals.length + 1;
    const newMeal: ClinicalMealBlock = {
      mealNumber: newMealNumber,
      mealName: `MEAL ${newMealNumber}`,
      foods: [
        {
          id: 'food_' + Math.random().toString(36).substring(2, 9),
          rowNumber: 1,
          foodName: '',
          quantity: '',
          proteinGrams: 0,
          fatGrams: 0,
          carbsGrams: 0,
          calories: 0,
        },
      ],
      isCompleted: false,
    };
    setChart({ ...chart, meals: [...chart.meals, newMeal] });
  };

  const handlePublish = () => {
    publishClientDietChart(chart, clientEmail, clientName);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 24, 18, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '12px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '1.5px solid #242820',
        }}
      >
        {/* Top Control Toolbar */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#F8F6EF',
            borderBottom: '1px solid #D9D8CC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#66734A', fontWeight: 700, textTransform: 'uppercase' }}>
              <ShieldCheck size={14} />
              <span>Nutritionist Prescription Desk • Client: {clientName}</span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#242820', margin: 0 }}>
              Clinical Diet Chart Editor & Publisher
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Load Template Preset Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} color="#4F5C38" />
              <select
                onChange={(e) => handleLoadTemplate(e.target.value)}
                defaultValue=""
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFDF8',
                  border: '1.5px solid #66734A',
                  color: '#4F5C38',
                  cursor: 'pointer',
                }}
              >
                <option value="" disabled>Load Preset Template...</option>
                {CLINICAL_TEMPLATES_CATALOG.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{ padding: '6px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Clinical Sheet Scrollable Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#FDFCF9' }}>
          <div style={{ border: '2px solid #0B1E48', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
            {/* 1. Header Banner (Deep Navy) */}
            <div style={{ backgroundColor: '#0A1C44', color: '#FFFFFF', textAlign: 'center', padding: '12px 14px' }}>
              <input
                type="text"
                value={chart.title}
                onChange={(e) => setChart({ ...chart, title: e.target.value })}
                placeholder="FAT, PROTEIN DIET"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              />
              <input
                type="text"
                value={chart.dietTypeTag}
                onChange={(e) => setChart({ ...chart, dietTypeTag: e.target.value })}
                placeholder="( ADDED OF LACTO-OVO-POLLO-VEG )"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#E8CA56',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              />
            </div>

            {/* 2. Subheaders (Yellow & Light Blue) */}
            <div style={{ backgroundColor: '#FCF8D8', color: '#1B2430', padding: '6px 12px', fontSize: '12px', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid #E2DEC0', letterSpacing: '0.04em' }}>
              PRE MEAL SUPPLEMENTS:
            </div>
            <div style={{ backgroundColor: '#E3ECFB', color: '#1B2430', padding: '6px 12px', fontSize: '12px', fontWeight: 800, textAlign: 'center', borderBottom: '2px solid #0B1E48', letterSpacing: '0.04em' }}>
              PRE MEAL MICRONUTRIENTS SUPPORT:
            </div>

            {/* 3. Meal Blocks Matrix */}
            {chart.meals.map((meal: ClinicalMealBlock, mealIdx: number) => {
              const mealTotals = calculateMealTotals(meal.foods);

              return (
                <div key={meal.mealNumber} style={{ borderBottom: '3px solid #0B1E48' }}>
                  {/* Meal Header Green Pill */}
                  <div style={{ padding: '8px 12px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'inline-block', backgroundColor: '#38571A', color: '#FFFFFF', fontWeight: 900, fontSize: '13px', padding: '4px 14px', borderRadius: '4px 14px 4px 4px', textTransform: 'uppercase' }}>
                      {meal.mealName || `MEAL ${meal.mealNumber}`}
                    </div>
                    <span style={{ fontSize: '12px', color: '#66734A', fontWeight: 600 }}>
                      Timing: {meal.scheduledTiming || 'Flexible'}
                    </span>
                  </div>

                  {/* Pre-Meal Callout (Pink/Light Blue) */}
                  <div style={{ backgroundColor: '#FFF0F5', padding: '6px 12px', borderTop: '1px solid #F0D5DF', borderBottom: '1px solid #F0D5DF', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '11px', color: '#1A202C', whiteSpace: 'nowrap' }}>PRE-MEAL:</span>
                    <input
                      type="text"
                      value={meal.preMealSupplement || ''}
                      onChange={(e) => handleUpdatePreMealSupplement(mealIdx, e.target.value)}
                      placeholder="e.g. Acetyl L-Carnitine 1.5 g or Beta-Alanine 6 g..."
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0A1C44',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                      }}
                    />
                    <select
                      onChange={(e) => {
                        const supp = CLINICAL_SUPPLEMENTS_CATALOG.find((s) => s.id === e.target.value);
                        if (supp) {
                          handleUpdatePreMealSupplement(mealIdx, `${supp.name}: ${supp.dosageAndTime} [${supp.bestBioavailableForm}]`);
                        }
                        e.target.value = '';
                      }}
                      style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', border: '1px solid #C4A5B3', backgroundColor: '#FFFFFF', fontWeight: 600, color: '#0A1C44' }}
                    >
                      <option value="">+ Inject Clinical Supplement...</option>
                      {CLINICAL_SUPPLEMENTS_CATALOG.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  {/* Tabular Food Items Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF6D9', borderBottom: '1px solid #DDD7AE' }}>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, color: '#242820', width: '30px' }}>#</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, color: '#242820' }}>FOOD ITEMS / RECIPES.</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, color: '#242820', width: '160px' }}>QUANTITY</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 800, color: '#242820', width: '90px' }}>PROTEIN (gms)</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 800, color: '#242820', width: '80px' }}>FAT (gms)</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 800, color: '#242820', width: '80px' }}>CARBS (gms)</th>
                          <th style={{ padding: '6px 4px', textAlign: 'center', width: '36px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {meal.foods.map((food: ClinicalFoodRow, foodIdx: number) => (
                          <tr key={food.id} style={{ borderBottom: '1px solid #ECEAE0' }}>
                            <td style={{ padding: '4px 8px', fontWeight: 700, color: '#242820' }}>{food.rowNumber}</td>
                            <td style={{ padding: '4px 6px' }}>
                              <input
                                type="text"
                                value={food.foodName}
                                onChange={(e) => handleUpdateFoodRow(mealIdx, foodIdx, 'foodName', e.target.value)}
                                placeholder="e.g. Rolled Oats, Egg Whites, Paneer..."
                                style={{ width: '100%', padding: '4px 6px', fontSize: '12px', border: '1px solid #E2DEC9', borderRadius: '4px' }}
                              />
                            </td>
                            <td style={{ padding: '4px 6px' }}>
                              <input
                                type="text"
                                value={food.quantity}
                                onChange={(e) => handleUpdateFoodRow(mealIdx, foodIdx, 'quantity', e.target.value)}
                                placeholder="e.g. 50g, 2 rotis..."
                                style={{ width: '100%', padding: '4px 6px', fontSize: '12px', border: '1px solid #E2DEC9', borderRadius: '4px' }}
                              />
                            </td>
                            <td style={{ padding: '4px 6px' }}>
                              <input
                                type="number"
                                step="0.5"
                                value={food.proteinGrams || ''}
                                onChange={(e) => handleUpdateFoodRow(mealIdx, foodIdx, 'proteinGrams', Number(e.target.value))}
                                style={{ width: '100%', textAlign: 'center', padding: '4px 2px', fontSize: '12px', border: '1px solid #E2DEC9', borderRadius: '4px' }}
                              />
                            </td>
                            <td style={{ padding: '4px 6px' }}>
                              <input
                                type="number"
                                step="0.5"
                                value={food.fatGrams || ''}
                                onChange={(e) => handleUpdateFoodRow(mealIdx, foodIdx, 'fatGrams', Number(e.target.value))}
                                style={{ width: '100%', textAlign: 'center', padding: '4px 2px', fontSize: '12px', border: '1px solid #E2DEC9', borderRadius: '4px' }}
                              />
                            </td>
                            <td style={{ padding: '4px 6px' }}>
                              <input
                                type="number"
                                step="0.5"
                                value={food.carbsGrams || ''}
                                onChange={(e) => handleUpdateFoodRow(mealIdx, foodIdx, 'carbsGrams', Number(e.target.value))}
                                style={{ width: '100%', textAlign: 'center', padding: '4px 2px', fontSize: '12px', border: '1px solid #E2DEC9', borderRadius: '4px' }}
                              />
                            </td>
                            <td style={{ padding: '4px 2px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteFoodRow(mealIdx, foodIdx)}
                                style={{ color: '#C85A48', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Food Row & Indian Food Catalog Quick-Add */}
                  <div style={{ padding: '6px 10px', backgroundColor: '#FAF8F0', borderBottom: '1px solid #ECEAE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleAddFoodRow(mealIdx)}
                      style={{ fontSize: '11px', fontWeight: 700, color: '#4F5C38', background: 'none', border: '1px solid #D9D8CC', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={12} />
                      <span>Add Blank Food Row</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 600 }}>Quick Add from Catalog:</span>
                      <select
                        onChange={(e) => {
                          const foodId = e.target.value;
                          if (!foodId) return;
                          const found = INDIAN_FOOD_CATALOG.find((f) => f.id === foodId);
                          if (found) {
                            const updatedMeals = [...chart.meals];
                            const currentFoods = updatedMeals[mealIdx].foods || [];
                            const newFood: ClinicalFoodRow = {
                              id: 'food_' + Math.random().toString(36).substring(2, 9),
                              rowNumber: currentFoods.length + 1,
                              foodName: `${found.name} (${found.dietType})`,
                              quantity: found.servingSize,
                              proteinGrams: found.proteinGrams,
                              fatGrams: found.fatGrams,
                              carbsGrams: found.carbsGrams,
                              calories: found.calories,
                            };
                            updatedMeals[mealIdx] = { ...updatedMeals[mealIdx], foods: [...currentFoods, newFood] };
                            setChart({ ...chart, meals: updatedMeals });
                          }
                          e.target.value = '';
                        }}
                        style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: '1.5px solid #0B1E48', backgroundColor: '#FFFFFF', fontWeight: 700, color: '#0A1C44' }}
                      >
                        <option value="">🍛 Select 180+ Indian Dishes...</option>
                        <optgroup label="🥬 100% Veg Breakfast">
                          {INDIAN_FOOD_CATALOG.filter((f) => f.dietType === 'Veg' && f.category === 'Breakfast').map((f) => (
                            <option key={f.id} value={f.id}>{f.name} (P:{f.proteinGrams}g, {f.calories}kcal)</option>
                          ))}
                        </optgroup>
                        <optgroup label="🍗 Non-Veg Breakfast">
                          {INDIAN_FOOD_CATALOG.filter((f) => f.dietType === 'Non-Veg' && f.category === 'Breakfast').map((f) => (
                            <option key={f.id} value={f.id}>{f.name} (P:{f.proteinGrams}g, {f.calories}kcal)</option>
                          ))}
                        </optgroup>
                        <optgroup label="🍛 Lunch (Veg & Non-Veg)">
                          {INDIAN_FOOD_CATALOG.filter((f) => f.category === 'Lunch').map((f) => (
                            <option key={f.id} value={f.id}>{f.name} [{f.dietType}] (P:{f.proteinGrams}g, {f.calories}kcal)</option>
                          ))}
                        </optgroup>
                        <optgroup label="🌙 Dinner (Veg & Non-Veg)">
                          {INDIAN_FOOD_CATALOG.filter((f) => f.category === 'Dinner').map((f) => (
                            <option key={f.id} value={f.id}>{f.name} [{f.dietType}] (P:{f.proteinGrams}g, {f.calories}kcal)</option>
                          ))}
                        </optgroup>
                        <optgroup label="🍿 Healthy Indian Snacks">
                          {INDIAN_FOOD_CATALOG.filter((f) => f.category === 'Snacks').map((f) => (
                            <option key={f.id} value={f.id}>{f.name} [{f.dietType}] (P:{f.proteinGrams}g, {f.calories}kcal)</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Subtotal Pink Bar */}
                  <div style={{ backgroundColor: '#FDE4ED', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#1A202C', borderBottom: '1px solid #F3CAD9' }}>
                    <span>CALORIE PER MEAL: <strong style={{ color: '#A82855' }}>{mealTotals.calories} kcal</strong></span>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span>PROTEIN: {mealTotals.protein}g</span>
                      <span>FAT: {mealTotals.fat}g</span>
                      <span>CARBS: {mealTotals.carbs}g</span>
                    </div>
                  </div>

                  {/* Subtotal Blue Bar */}
                  <div style={{ backgroundColor: '#DBE7FC', padding: '5px 12px', fontSize: '12px', fontWeight: 800, color: '#103070', borderBottom: '1px solid #C4D7FA' }}>
                    TOTAL CALORIE PER MEAL: {mealTotals.calories} kcal
                  </div>

                  {/* Post-Meal Performance Supplement Yellow Bar */}
                  <div style={{ backgroundColor: '#FCF8D8', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '11px', color: '#1B2430', whiteSpace: 'nowrap' }}>
                      POST MEAL SUPPLEMENT:
                    </span>
                    <input
                      type="text"
                      value={meal.postMealSupplement || ''}
                      onChange={(e) => handleUpdatePostMealSupplement(mealIdx, e.target.value)}
                      placeholder="e.g. CALCIUM CITRATE MALATE 500 mg + VITAMIN K2 MK7 + VITAMIN D3 or OMEGA-3..."
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0A1C44',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                      }}
                    />
                    <select
                      onChange={(e) => {
                        const supp = CLINICAL_SUPPLEMENTS_CATALOG.find((s) => s.id === e.target.value);
                        if (supp) {
                          handleUpdatePostMealSupplement(mealIdx, `${supp.name}: ${supp.dosageAndTime} [${supp.bestBioavailableForm}]`);
                        }
                        e.target.value = '';
                      }}
                      style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', border: '1px solid #D6CE9A', backgroundColor: '#FFFFFF', fontWeight: 600, color: '#0A1C44' }}
                    >
                      <option value="">+ Inject Clinical Supplement...</option>
                      {CLINICAL_SUPPLEMENTS_CATALOG.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}

            {/* 4. Bottom Summary Footer (Yellow Blocks) */}
            <div style={{ backgroundColor: '#FAF6D9', borderTop: '2px solid #0B1E48', padding: '12px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '380px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#1A202C' }}>
                  <span>TOTAL DAILY CALORIE :</span>
                  <span>{totals.totalCalories} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#1A202C' }}>
                  <span>TOTAL MEAL PLAN CALORIE :</span>
                  <span style={{ color: '#0A1C44' }}>{totals.totalCalories} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#1A202C' }}>
                  <span>RECOMMENDED CALORIE :</span>
                  <span>{chart.recommendedCalorieTarget || 1750} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#66734A', marginTop: '4px' }}>
                  <span>Macros: {totals.totalProtein}g Protein • {totals.totalFat}g Fat • {totals.totalCarbs}g Carbs</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleAddMealBlock}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFDF8',
                border: '1.5px dashed #4F5C38',
                color: '#4F5C38',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={14} />
              <span>+ Add Meal Slot</span>
            </button>
          </div>
        </div>

        {/* Bottom Publish Controls */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#FFFDF8',
            borderTop: '1px solid #D9D8CC',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor: '#EBE9DC',
              color: '#242820',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isSaved ? (
              <>
                <Check size={16} />
                <span>Published to Client!</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Publish Clinical Diet Chart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
