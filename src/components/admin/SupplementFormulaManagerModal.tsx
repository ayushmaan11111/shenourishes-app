import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Edit3, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  User, 
  Search,
  Sliders,
  Layers,
  FlaskConical
} from 'lucide-react';
import { 
  getAllSupplementFormulas, 
  saveSupplementFormula, 
  getBodyCompositionFormula, 
  saveBodyCompositionFormula,
  calculateBodyCompositionAndProtein,
  evaluateSupplementFormula,
  getClientSupplementPlan,
  updateClientSupplementOverride,
  resetClientSupplementOverride,
  saveClientSupplementPlan
} from '../../services/formulaEngineService';
import type { 
  SupplementFormula, 
  BodyCompositionProteinFormula, 
  ClientSupplementPlan,
  ClientSupplementPlanItem
} from '../../types/formulaEngine';

interface SupplementFormulaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
}

export const SupplementFormulaManagerModal: React.FC<SupplementFormulaManagerModalProps> = ({
  isOpen,
  onClose,
  clientId = 'default',
  clientName = 'Client',
}) => {
  const [activeTab, setActiveTab] = useState<'body_comp' | 'formulas' | 'client_plan'>('body_comp');

  // --- TAB 1: Body Composition & Protein Formula State ---
  const [bodyCompFormula, setBodyCompFormula] = useState<BodyCompositionProteinFormula>(getBodyCompositionFormula());
  const [testWeight, setTestWeight] = useState<number>(70);
  const [testBodyFat, setTestBodyFat] = useState<number>(24);
  const [testIntensity, setTestIntensity] = useState<string>('Moderately Active');
  const [bodyCompSaved, setBodyCompSaved] = useState<boolean>(false);

  // --- TAB 2: Supplement Formulas State ---
  const [formulas, setFormulas] = useState<SupplementFormula[]>(getAllSupplementFormulas());
  const [editingFormula, setEditingFormula] = useState<SupplementFormula | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [workbenchFormulaId, setWorkbenchFormulaId] = useState<string>(formulas[0]?.id || '');
  const [formulaSavedNotice, setFormulaSavedNotice] = useState<boolean>(false);

  // --- TAB 3: Client Specific Plan & Override State ---
  const [clientPlan, setClientPlan] = useState<ClientSupplementPlan>(() => getClientSupplementPlan(clientId));
  const [editingItemOverride, setEditingItemOverride] = useState<ClientSupplementPlanItem | null>(null);
  const [overrideInputVal, setOverrideInputVal] = useState<string>('');
  const [overrideNotesVal, setOverrideNotesVal] = useState<string>('');
  const [clientPlanSaved, setClientPlanSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  // Real-time body composition test output
  const testBodyCompResult = calculateBodyCompositionAndProtein(testWeight, testBodyFat, testIntensity);

  // Selected formula for workbench
  const selectedWorkbenchFormula = formulas.find((f) => f.id === workbenchFormulaId) || formulas[0];
  const workbenchResult = selectedWorkbenchFormula ? evaluateSupplementFormula(selectedWorkbenchFormula, {
    bodyWeight: testWeight,
    fatFreeMass: testBodyCompResult.fatFreeMassKg,
    bodyFatPercent: testBodyFat,
    intensityLevel: testIntensity,
    proteinRequirement: testBodyCompResult.proteinRequirementGramsPerDay,
  }) : { calculatedAmount: 0, unit: 'g' };

  // --- Handlers ---
  const handleSaveBodyComp = (e: React.FormEvent) => {
    e.preventDefault();
    saveBodyCompositionFormula(bodyCompFormula);
    setBodyCompFormula(getBodyCompositionFormula());
    setBodyCompSaved(true);
    setTimeout(() => setBodyCompSaved(false), 1500);
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFormula) return;
    saveSupplementFormula(editingFormula, 'Admin Nutritionist');
    setFormulas(getAllSupplementFormulas());
    setEditingFormula(null);
    setFormulaSavedNotice(true);
    setTimeout(() => setFormulaSavedNotice(false), 1500);
  };

  const handleApplyClientOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemOverride) return;
    const num = parseFloat(overrideInputVal);
    if (isNaN(num)) return;
    const updated = updateClientSupplementOverride(clientId, editingItemOverride.supplementId, num, overrideNotesVal);
    setClientPlan(updated);
    setEditingItemOverride(null);
    setClientPlanSaved(true);
    setTimeout(() => setClientPlanSaved(false), 1500);
  };

  const handleResetOverride = (supplementId: string) => {
    const updated = resetClientSupplementOverride(clientId, supplementId);
    setClientPlan(updated);
  };

  const handlePublishPlan = () => {
    saveClientSupplementPlan({
      ...clientPlan,
      status: 'published',
      publishedAt: Date.now(),
    });
    setClientPlanSaved(true);
    setTimeout(() => {
      setClientPlanSaved(false);
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
        padding: '14px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          border: '1.5px solid #242820',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '14px 20px',
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
              <span>Phase 2 Clinical Formula & Calculation Engine</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', margin: 0 }}>
              Supplement Formula Engine & Client Override Desk
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ padding: '6px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '10px 20px',
            backgroundColor: '#FFFDF8',
            borderBottom: '1px solid #ECEAE0',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('body_comp')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'body_comp' ? '#0A1C44' : '#F1EEDF',
              color: activeTab === 'body_comp' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Calculator size={14} />
            <span>1. Body Comp → Protein Formula</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formulas')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'formulas' ? '#0A1C44' : '#F1EEDF',
              color: activeTab === 'formulas' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Layers size={14} />
            <span>2. Formula Manager ({formulas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('client_plan')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'client_plan' ? '#0A1C44' : '#F1EEDF',
              color: activeTab === 'client_plan' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <User size={14} />
            <span>3. Client Supplement Plan & Override ({clientName})</span>
          </button>
        </div>

        {/* Tab Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px', backgroundColor: '#FDFCF9' }}>
          
          {/* =========================================================================
              TAB 1: BODY COMPOSITION → PROTEIN REQUIREMENT FORMULA
             ========================================================================= */}
          {activeTab === 'body_comp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    Body Composition → Protein Requirement Equation System
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6B7063', margin: '2px 0 0' }}>
                    Extracted from clinical reference sheet: Fat Mass (kg) → Fat-Free Mass (kg) → Protein Requirement (g/day).
                  </p>
                </div>
                {bodyCompSaved && (
                  <span style={{ fontSize: '12px', color: '#38571A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Saved Version {bodyCompFormula.version}!
                  </span>
                )}
              </div>

              {/* Visual Formula Cards Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {/* Step 1 */}
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFDF8', border: '1.5px solid #0B1E48' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                    Step 1 • Fat Mass (kg)
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#242820', marginTop: '6px' }}>
                    Body Weight (kg) × Body Fat % ÷ 100
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7063', marginTop: '4px' }}>
                    Default Body Fat %: <strong>{bodyCompFormula.bodyFatPercentageDefault}%</strong>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFDF8', border: '1.5px solid #0B1E48' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                    Step 2 • Fat-Free Mass (kg)
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#242820', marginTop: '6px' }}>
                    Body Weight (kg) − Fat Mass (kg)
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7063', marginTop: '4px' }}>
                    Preserves metabolically active skeletal muscle tissue
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FAF6D9', border: '1.5px solid #0B1E48' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                    Step 3 • Protein (g/day)
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#A82855', marginTop: '6px' }}>
                    Fat-Free Mass × Intensity Multiplier
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7063', marginTop: '4px' }}>
                    Range: 1.5 – 2.5 g/kg FFM
                  </div>
                </div>
              </div>

              {/* Editable Multipliers Form */}
              <form onSubmit={handleSaveBodyComp} className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#242820', marginBottom: '10px' }}>
                  Configure Intensity Multipliers & Baseline Coefficients
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>
                      Sedentary / Low Intensity Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={bodyCompFormula.intensityMultipliers.sedentaryLowIntensity}
                      onChange={(e) => setBodyCompFormula({
                        ...bodyCompFormula,
                        intensityMultipliers: {
                          ...bodyCompFormula.intensityMultipliers,
                          sedentaryLowIntensity: parseFloat(e.target.value) || 1.5,
                        },
                      })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>
                      Moderate Intensity / Muscle Gain Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={bodyCompFormula.intensityMultipliers.moderateIntensityMuscleGain}
                      onChange={(e) => setBodyCompFormula({
                        ...bodyCompFormula,
                        intensityMultipliers: {
                          ...bodyCompFormula.intensityMultipliers,
                          moderateIntensityMuscleGain: parseFloat(e.target.value) || 2.0,
                        },
                      })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>
                      High Intensity Training Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={bodyCompFormula.intensityMultipliers.highIntensityTraining}
                      onChange={(e) => setBodyCompFormula({
                        ...bodyCompFormula,
                        intensityMultipliers: {
                          ...bodyCompFormula.intensityMultipliers,
                          highIntensityTraining: parseFloat(e.target.value) || 2.5,
                        },
                      })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '12px' }}>
                    <Check size={14} />
                    <span>Save & Update Formula Coefficients</span>
                  </button>
                </div>
              </form>

              {/* Interactive Calculation Sandbox / Test Workbench */}
              <div style={{ padding: '16px', backgroundColor: '#F8F6EF', borderRadius: '12px', border: '1.5px dashed #66734A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <Sliders size={16} color="#4F5C38" />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    Live Math Sandbox & Verification
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7063' }}>Test Weight (kg)</label>
                    <input
                      type="number"
                      value={testWeight}
                      onChange={(e) => setTestWeight(parseFloat(e.target.value) || 70)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7063' }}>Body Fat %</label>
                    <input
                      type="number"
                      value={testBodyFat}
                      onChange={(e) => setTestBodyFat(parseFloat(e.target.value) || 24)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7063' }}>Activity Level</label>
                    <select
                      value={testIntensity}
                      onChange={(e) => setTestIntensity(e.target.value)}
                      className="form-select"
                    >
                      <option value="Sedentary">Sedentary (1.5x FFM)</option>
                      <option value="Moderately Active">Moderately Active (2.0x FFM)</option>
                      <option value="Active at Gym">High Intensity / Gym (2.5x FFM)</option>
                    </select>
                  </div>
                </div>

                {/* Math Breakdown Result */}
                <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #D9D8CC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7063' }}>
                      Fat Mass: <strong>{testBodyCompResult.fatMassKg} kg</strong> • Fat-Free Mass (FFM): <strong>{testBodyCompResult.fatFreeMassKg} kg</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#66734A', marginTop: '2px' }}>
                      Multiplier: <strong>{testBodyCompResult.intensityMultiplier}x</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#6B7063', fontWeight: 700, textTransform: 'uppercase' }}>Target Daily Protein</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1C44' }}>
                      {testBodyCompResult.proteinRequirementGramsPerDay} <span style={{ fontSize: '13px' }}>g/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: SUPPLEMENT FORMULA MANAGER & SPREADSHEET
             ========================================================================= */}
          {activeTab === 'formulas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ position: 'relative', minWidth: '260px' }}>
                  <Search size={15} color="#6B7063" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search formulas or supplements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {formulaSavedNotice && (
                    <span style={{ fontSize: '12px', color: '#38571A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Formula Saved!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setEditingFormula({
                        id: 'form_custom_' + Math.random().toString(36).substring(2, 9),
                        supplementId: 'supp_custom_' + Math.random().toString(36).substring(2, 9),
                        supplementName: '',
                        version: 1,
                        category: 'Clinical Strategy',
                        targetUnit: 'mg',
                        formulaExpression: '100',
                        variables: { baseDose: 100 },
                        minLimit: 50,
                        maxLimit: 1000,
                        standardDosageDisplay: '',
                        frequency: 'Daily',
                        timing: 'With meals',
                        duration: 'Ongoing',
                        notes: '',
                        isActive: true,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        modifiedBy: 'Admin Nutritionist',
                      })
                    }
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    <Plus size={14} />
                    <span>+ Add Custom Formula</span>
                  </button>
                </div>
              </div>

              {/* Formula Spreadsheet Table */}
              {!editingFormula ? (
                <div style={{ border: '1px solid #0B1E48', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0A1C44', color: '#FFFFFF', textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px', fontWeight: 800 }}>SUPPLEMENT</th>
                        <th style={{ padding: '8px 10px', fontWeight: 800 }}>FORMULA EXPRESSION</th>
                        <th style={{ padding: '8px 10px', fontWeight: 800, width: '60px' }}>UNIT</th>
                        <th style={{ padding: '8px 10px', fontWeight: 800, width: '90px' }}>MIN / MAX</th>
                        <th style={{ padding: '8px 10px', fontWeight: 800, width: '130px' }}>FREQUENCY & TIMING</th>
                        <th style={{ padding: '8px 10px', fontWeight: 800, width: '70px' }}>VER</th>
                        <th style={{ padding: '8px 6px', width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formulas
                        .filter((f) => f.supplementName.toLowerCase().includes(searchQuery.toLowerCase()) || f.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((f, idx) => (
                          <tr key={f.id} style={{ borderBottom: '1px solid #ECEAE0', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F0' }}>
                            <td style={{ padding: '8px 10px' }}>
                              <strong style={{ color: '#242820', fontSize: '12px' }}>{f.supplementName}</strong>
                              <div style={{ fontSize: '10.5px', color: '#66734A' }}>{f.category}</div>
                            </td>
                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#0A1C44', fontWeight: 600 }}>
                              {f.formulaExpression}
                            </td>
                            <td style={{ padding: '8px 10px', color: '#4F5C38', fontWeight: 700 }}>{f.targetUnit}</td>
                            <td style={{ padding: '8px 10px', color: '#6B7063' }}>
                              {f.minLimit} – {f.maxLimit} {f.targetUnit}
                            </td>
                            <td style={{ padding: '8px 10px', color: '#242820' }}>
                              <div>{f.frequency}</div>
                              <div style={{ fontSize: '10.5px', color: '#8A9568' }}>{f.timing}</div>
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontWeight: 700 }}>
                                v{f.version}
                              </span>
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setEditingFormula(f)}
                                style={{ color: '#66734A', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                title="Edit Formula"
                              >
                                <Edit3 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Formula Editor Form */
                <form onSubmit={handleSaveFormula} className="wellness-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', border: '1.5px solid #0B1E48', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Edit3 size={16} color="#0A1C44" />
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#242820', margin: 0 }}>
                        Formula Editor • {editingFormula.supplementName || 'New Supplement'} (v{editingFormula.version})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingFormula(null)}
                      style={{ fontSize: '12px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Supplement Name</label>
                      <input
                        type="text"
                        required
                        value={editingFormula.supplementName}
                        onChange={(e) => setEditingFormula({ ...editingFormula, supplementName: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        required
                        value={editingFormula.category}
                        onChange={(e) => setEditingFormula({ ...editingFormula, category: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Formula Expression (JavaScript / Math Context)</label>
                    <input
                      type="text"
                      required
                      value={editingFormula.formulaExpression}
                      onChange={(e) => setEditingFormula({ ...editingFormula, formulaExpression: e.target.value })}
                      placeholder="e.g. Math.min(5, Math.max(3, bodyWeight * multiplier))"
                      className="form-input"
                      style={{ fontFamily: 'monospace', color: '#0A1C44', fontWeight: 600 }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#6B7063', marginTop: '2px' }}>
                      Available Variables: <code>bodyWeight</code>, <code>fatFreeMass</code>, <code>bodyFatPercent</code>, <code>proteinRequirement</code>, plus custom keys.
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Target Unit</label>
                      <select
                        value={editingFormula.targetUnit}
                        onChange={(e) => setEditingFormula({ ...editingFormula, targetUnit: e.target.value })}
                        className="form-select"
                      >
                        <option value="g">g (Grams)</option>
                        <option value="mg">mg (Milligrams)</option>
                        <option value="mcg">mcg (Micrograms)</option>
                        <option value="Billion CFU">Billion CFU</option>
                        <option value="serving">serving</option>
                        <option value="scoops">scoops</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Minimum Safe Limit</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={editingFormula.minLimit}
                        onChange={(e) => setEditingFormula({ ...editingFormula, minLimit: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Maximum Safe Limit</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={editingFormula.maxLimit}
                        onChange={(e) => setEditingFormula({ ...editingFormula, maxLimit: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Frequency</label>
                      <input
                        type="text"
                        value={editingFormula.frequency}
                        onChange={(e) => setEditingFormula({ ...editingFormula, frequency: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Timing</label>
                      <input
                        type="text"
                        value={editingFormula.timing}
                        onChange={(e) => setEditingFormula({ ...editingFormula, timing: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Clinical Rationale & Notes</label>
                    <textarea
                      rows={2}
                      value={editingFormula.notes || ''}
                      onChange={(e) => setEditingFormula({ ...editingFormula, notes: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setEditingFormula(null)}
                      style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#EBE9DC', border: 'none', fontWeight: 600, fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '12px' }}>
                      <Check size={14} />
                      <span>Save & Increment Version (v{editingFormula.version + 1})</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Formula Testing Workbench (Live Equation Verification) */}
              <div style={{ padding: '14px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1.5px dashed #66734A', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FlaskConical size={16} color="#4F5C38" />
                    <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#242820', margin: 0 }}>
                      Formula Testing Workbench
                    </h4>
                  </div>
                  <select
                    value={workbenchFormulaId}
                    onChange={(e) => setWorkbenchFormulaId(e.target.value)}
                    style={{ fontSize: '11.5px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FFFDF8', border: '1px solid #66734A', color: '#4F5C38' }}
                  >
                    {formulas.map((f) => (
                      <option key={f.id} value={f.id}>{f.supplementName} (v{f.version})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #D9D8CC' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7063' }}>
                      Testing on: <strong>{testWeight} kg weight</strong> • FFM: <strong>{testBodyCompResult.fatFreeMassKg} kg</strong>
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0A1C44', marginTop: '2px' }}>
                      Equation: {selectedWorkbenchFormula?.formulaExpression}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10.5px', color: '#6B7063', fontWeight: 700, textTransform: 'uppercase' }}>Calculated Output</div>
                    <div style={{ fontSize: '17px', fontWeight: 900, color: '#0A1C44' }}>
                      {workbenchResult.calculatedAmount} <span style={{ fontSize: '12px' }}>{workbenchResult.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: CLIENT SPECIFIC PLAN & OVERRIDE DESK
             ========================================================================= */}
          {activeTab === 'client_plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    Client Prescription Desk • {clientName}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6B7063' }}>
                    Final Amount = Admin Override (if active) otherwise Calculated Amount.
                  </div>
                </div>

                {clientPlanSaved && (
                  <span style={{ fontSize: '12px', color: '#38571A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Published to Client App!
                  </span>
                )}
              </div>

              {/* Client Biometric Snapshot Bar */}
              <div style={{ padding: '10px 14px', backgroundColor: '#FAF6D9', borderRadius: '8px', border: '1px solid #DDD7AE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div>
                  Weight: <strong>{clientPlan.bodyComposition?.bodyWeightKg || 68} kg</strong> • FFM: <strong>{clientPlan.bodyComposition?.fatFreeMassKg || 52} kg</strong> • Protein Target: <strong>{clientPlan.bodyComposition?.proteinRequirementGramsPerDay || 130} g/day</strong>
                </div>
                <span style={{ fontSize: '11px', color: '#38571A', fontWeight: 700, backgroundColor: '#E2EDDA', padding: '2px 8px', borderRadius: '4px' }}>
                  Live Formula Sync
                </span>
              </div>

              {/* Override Editor Sub-Modal */}
              {editingItemOverride && (
                <form onSubmit={handleApplyClientOverride} className="wellness-card animate-fade-in" style={{ padding: '14px', backgroundColor: '#FFFDF8', border: '1.5px solid #66734A', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '14px', color: '#242820' }}>
                      Override Amount for {editingItemOverride.supplementName}
                    </strong>
                    <button
                      type="button"
                      onClick={() => setEditingItemOverride(null)}
                      style={{ fontSize: '11px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7063' }}>
                        Calculated Dose: {editingItemOverride.calculatedAmount} {editingItemOverride.unit}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="Enter custom override dose"
                        value={overrideInputVal}
                        onChange={(e) => setOverrideInputVal(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7063' }}>
                        Client Override Note / Rationale
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Higher dose prescribed for marathon training"
                        value={overrideNotesVal}
                        onChange={(e) => setOverrideNotesVal(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setEditingItemOverride(null)}
                      style={{ fontSize: '12px', padding: '6px 12px', background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      Apply Override
                    </button>
                  </div>
                </form>
              )}

              {/* Client Plan Table */}
              <div style={{ border: '1px solid #0B1E48', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0A1C44', color: '#FFFFFF', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', fontWeight: 800 }}>SUPPLEMENT</th>
                      <th style={{ padding: '8px 10px', fontWeight: 800, width: '100px' }}>CALCULATED</th>
                      <th style={{ padding: '8px 10px', fontWeight: 800, width: '100px' }}>OVERRIDE</th>
                      <th style={{ padding: '8px 10px', fontWeight: 800, width: '110px' }}>FINAL DOSE</th>
                      <th style={{ padding: '8px 10px', fontWeight: 800 }}>TIMING & FREQUENCY</th>
                      <th style={{ padding: '8px 6px', width: '90px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientPlan.items.map((item, idx) => (
                      <tr key={item.supplementId} style={{ borderBottom: '1px solid #ECEAE0', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F0' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <strong style={{ color: '#242820', fontSize: '12px' }}>{item.supplementName}</strong>
                          {item.warningFlag && (
                            <div style={{ fontSize: '10px', color: '#A82855', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <AlertTriangle size={11} />
                              <span>{item.warningFlag}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px', color: '#4F5C38', fontWeight: 600 }}>
                          {item.calculatedAmount} {item.unit}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          {item.isOverrideActive ? (
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#A82855', backgroundColor: '#FDE4ED', padding: '2px 6px', borderRadius: '4px' }}>
                              {item.adminOverrideAmount} {item.unit}
                            </span>
                          ) : (
                            <span style={{ color: '#8A9568' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <strong style={{ color: item.isOverrideActive ? '#A82855' : '#0A1C44', fontSize: '12.5px' }}>
                            {item.finalAmount} {item.unit}
                          </strong>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#242820' }}>
                          <div>{item.timing}</div>
                          <div style={{ fontSize: '10.5px', color: '#6B7063' }}>{item.frequency}</div>
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemOverride(item);
                                setOverrideInputVal(String(item.finalAmount));
                                setOverrideNotesVal(item.notes || '');
                              }}
                              style={{ fontSize: '10.5px', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#F1EEDF', color: '#4F5C38', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                              title="Override value"
                            >
                              Override
                            </button>
                            {item.isOverrideActive && (
                              <button
                                type="button"
                                onClick={() => handleResetOverride(item.supplementId)}
                                style={{ color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                                title="Reset to Formula"
                              >
                                <RotateCcw size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handlePublishPlan}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={15} />
                  <span>Publish Final Plan to Client App</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
