import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingDown, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Save, 
  User
} from 'lucide-react';
import { 
  MALE_BODY_FAT_REFERENCE, 
  FEMALE_BODY_FAT_REFERENCE, 
  MALE_TIMELINE_TABLE, 
  FEMALE_TIMELINE_TABLE,
  getClientTransformationRecord,
  saveClientTransformationRecord,
  type ClientBodyTransformationRecord,
  type TransformationAssessmentQuarter
} from '../../services/bodyTransformationService';

interface BodyTransformationAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  gender?: 'Female' | 'Male';
  weightKg?: number;
  bodyFatPct?: number;
}

export const BodyTransformationAssessmentModal: React.FC<BodyTransformationAssessmentModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  gender: initialGender = 'Female',
  weightKg = 62,
  bodyFatPct = 28,
}) => {
  const [activeTab, setActiveTab] = useState<'reference' | 'timeline' | 'record'>('record');
  const [selectedGender, setSelectedGender] = useState<'Female' | 'Male'>(initialGender);
  const [record, setRecord] = useState<ClientBodyTransformationRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && clientId) {
      getClientTransformationRecord(clientId, clientName, selectedGender, weightKg, bodyFatPct).then((rec) => {
        setRecord(rec);
        setSelectedGender(rec.sex);
      });
    }
  }, [isOpen, clientId, clientName, selectedGender, weightKg, bodyFatPct]);

  if (!isOpen) return null;

  const currentReference = selectedGender === 'Male' ? MALE_BODY_FAT_REFERENCE : FEMALE_BODY_FAT_REFERENCE;
  const currentTimeline = selectedGender === 'Male' ? MALE_TIMELINE_TABLE : FEMALE_TIMELINE_TABLE;

  const handleQuarterChange = (quarter: 'month3' | 'month6' | 'month9' | 'month12', field: keyof TransformationAssessmentQuarter, value: any) => {
    if (!record) return;
    const currentQ: TransformationAssessmentQuarter = record[quarter] || {
      bodyWeightKg: record.startingBodyWeightKg,
      bodyFatPercentage: record.startingBodyFatPercentage,
      fatMassKg: record.startingFatMassKg,
      fatFreeMassKg: record.startingFatFreeMassKg,
      waistCircumferenceCm: 76,
      strengthProgress: 'Consistent progress',
      nutritionAdherence: '85%',
      trainingAdherence: '4 days/wk',
    };

    const updatedQ = { ...currentQ, [field]: value };
    // Auto-calculate fat mass & FFM if weight or body fat changed
    if (field === 'bodyWeightKg' || field === 'bodyFatPercentage') {
      const bw = field === 'bodyWeightKg' ? parseFloat(value) || 0 : updatedQ.bodyWeightKg;
      const bf = field === 'bodyFatPercentage' ? parseFloat(value) || 0 : updatedQ.bodyFatPercentage;
      const fm = parseFloat(((bw * bf) / 100).toFixed(1));
      updatedQ.fatMassKg = fm;
      updatedQ.fatFreeMassKg = parseFloat((bw - fm).toFixed(1));
    }

    setRecord({
      ...record,
      [quarter]: updatedQ,
    });
  };

  const handleSave = async () => {
    if (!record) return;
    setSaving(true);
    
    // Auto compute final review from latest assessment
    const latestQ = record.month12 || record.month9 || record.month6 || record.month3;
    if (latestQ) {
      const wtChange = parseFloat((latestQ.bodyWeightKg - record.startingBodyWeightKg).toFixed(1));
      const fmChange = parseFloat((latestQ.fatMassKg - record.startingFatMassKg).toFixed(1));
      const ffmChange = parseFloat((latestQ.fatFreeMassKg - record.startingFatFreeMassKg).toFixed(1));
      const bfChange = parseFloat((latestQ.bodyFatPercentage - record.startingBodyFatPercentage).toFixed(1));

      record.finalReview = {
        totalBodyWeightChangeKg: wtChange,
        totalFatMassChangeKg: fmChange,
        totalFatFreeMassChangeKg: ffmChange,
        changeInBodyFatPercentage: bfChange,
        strengthImprovementSummary: latestQ.strengthProgress || 'Noticeable upper & lower body strength adaptation',
        nextRecommendedPhase: latestQ.bodyFatPercentage <= (record.sex === 'Female' ? 20 : 12) 
          ? 'Metabolic Maintenance & Hypertrophy' 
          : 'Continued Fat-Protein Metabolic Deficit Phase',
      };
    }

    await saveClientTransformationRecord(record);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '92vh',
          backgroundColor: '#FFFDF9',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '2px solid #D4AF37',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #E8CA56',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#E8CA56',
                color: '#0A1C44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#E8CA56', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CLINICAL PROTOCOL & BODY COMPOSITION
                </span>
                <span style={{ fontSize: '10px', backgroundColor: '#1E356A', padding: '2px 8px', borderRadius: '4px', color: '#FFF' }}>
                  {clientName}
                </span>
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, margin: '2px 0 0', color: '#FFFFFF' }}>
                Body Fat & Transformation Assessment Tracker
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Gender Toggle */}
            <div style={{ display: 'flex', backgroundColor: '#1E356A', borderRadius: '8px', padding: '3px' }}>
              <button
                type="button"
                onClick={() => setSelectedGender('Female')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: selectedGender === 'Female' ? '#BE185D' : 'transparent',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Female (60kg Ref)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender('Male')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: selectedGender === 'Male' ? '#0066FE' : 'transparent',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Male (70kg Ref)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            padding: '10px 24px',
            backgroundColor: '#F8F6EF',
            borderBottom: '1px solid #EBE5D8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('record')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'record' ? '#0A1C44' : '#EBE5D8',
                color: activeTab === 'record' ? '#FFFFFF' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <User size={15} />
              <span>Client 3/6/9/12 Month Record</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reference')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'reference' ? '#0A1C44' : '#EBE5D8',
                color: activeTab === 'reference' ? '#FFFFFF' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Flame size={15} />
              <span>Body Fat % & Calories Reference Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'timeline' ? '#0A1C44' : '#EBE5D8',
                color: activeTab === 'timeline' ? '#FFFFFF' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <TrendingDown size={15} />
              <span>Transformation Timelines (3 to 12 Mo)</span>
            </button>
          </div>

          {activeTab === 'record' && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: saveSuccess ? '#059669' : '#0A1C44',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(10,28,68,0.2)',
              }}
            >
              {saveSuccess ? <CheckCircle2 size={15} /> : <Save size={15} />}
              <span>{saving ? 'Saving...' : saveSuccess ? 'Record Saved & Synced!' : 'Save Client Record'}</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TAB 1: CLIENT 3/6/9/12 MONTH RECORD */}
          {activeTab === 'record' && record && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Client Starting Baseline Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', backgroundColor: '#0A1C44', borderRadius: '2px' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                      Baseline Starting Biometrics & Daily Protocol Targets
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Client ID: {record.clientId}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Starting Weight</span>
                    <input
                      type="number"
                      step="0.5"
                      value={record.startingBodyWeightKg}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const fm = parseFloat(((val * record.startingBodyFatPercentage) / 100).toFixed(1));
                        setRecord({
                          ...record,
                          startingBodyWeightKg: val,
                          startingFatMassKg: fm,
                          startingFatFreeMassKg: parseFloat((val - fm).toFixed(1)),
                        });
                      }}
                      style={{ width: '100%', fontSize: '14px', fontWeight: 800, color: '#0A1C44', border: 'none', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>kg</span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Starting Body Fat</span>
                    <input
                      type="number"
                      step="0.5"
                      value={record.startingBodyFatPercentage}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const fm = parseFloat(((record.startingBodyWeightKg * val) / 100).toFixed(1));
                        setRecord({
                          ...record,
                          startingBodyFatPercentage: val,
                          startingFatMassKg: fm,
                          startingFatFreeMassKg: parseFloat((record.startingBodyWeightKg - fm).toFixed(1)),
                        });
                      }}
                      style={{ width: '100%', fontSize: '14px', fontWeight: 800, color: '#0A1C44', border: 'none', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>%</span>
                  </div>

                  <div style={{ backgroundColor: '#FEF3C7', padding: '10px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                    <span style={{ fontSize: '10.5px', color: '#92400E', display: 'block', fontWeight: 700 }}>Starting Fat Mass</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#B45309' }}>{record.startingFatMassKg} kg</span>
                  </div>

                  <div style={{ backgroundColor: '#ECFDF5', padding: '10px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                    <span style={{ fontSize: '10.5px', color: '#065F46', display: 'block', fontWeight: 700 }}>Fat-Free Mass (FFM)</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#047857' }}>{record.startingFatFreeMassKg} kg</span>
                  </div>

                  <div style={{ backgroundColor: '#EFF6FF', padding: '10px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                    <span style={{ fontSize: '10.5px', color: '#1E40AF', display: 'block', fontWeight: 600 }}>Daily Calories</span>
                    <input
                      type="number"
                      value={record.dailyCalorieTargetKcal}
                      onChange={(e) => setRecord({ ...record, dailyCalorieTargetKcal: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', fontSize: '14px', fontWeight: 800, color: '#1E3A8A', border: 'none', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '10px', color: '#93C5FD' }}>kcal</span>
                  </div>

                  <div style={{ backgroundColor: '#FDF2F8', padding: '10px', borderRadius: '8px', border: '1px solid #FBCFE8' }}>
                    <span style={{ fontSize: '10.5px', color: '#9D174D', display: 'block', fontWeight: 600 }}>Protein Target</span>
                    <input
                      type="number"
                      value={record.dailyProteinTargetGrams}
                      onChange={(e) => setRecord({ ...record, dailyProteinTargetGrams: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', fontSize: '14px', fontWeight: 800, color: '#831843', border: 'none', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '10px', color: '#F472B6' }}>g (1.6 - 2.2g/kg)</span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10.5px', color: '#475569', display: 'block', fontWeight: 600 }}>Carb Target</span>
                    <input
                      type="number"
                      value={record.dailyCarbTargetGrams}
                      onChange={(e) => setRecord({ ...record, dailyCarbTargetGrams: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', fontSize: '14px', fontWeight: 800, color: '#1E293B', border: 'none', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>g (80-120g Low-Carb)</span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10.5px', color: '#475569', display: 'block', fontWeight: 600 }}>Fat Target</span>
                    <input
                      type="number"
                      value={record.dailyFatTargetGrams}
                      onChange={(e) => setRecord({ ...record, dailyFatTargetGrams: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', fontSize: '14px', fontWeight: 800, color: '#1E293B', border: 'none', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>g (Healthy fats)</span>
                  </div>
                </div>
              </div>

              {/* 4 Quarterly Assessments (Month 3, 6, 9, 12) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {(['month3', 'month6', 'month9', 'month12'] as const).map((qKey, index) => {
                  const label = `MONTH ${(index + 1) * 3} ASSESSMENT`;
                  const qData = record[qKey] || {
                    bodyWeightKg: record.startingBodyWeightKg,
                    bodyFatPercentage: record.startingBodyFatPercentage,
                    fatMassKg: record.startingFatMassKg,
                    fatFreeMassKg: record.startingFatFreeMassKg,
                    waistCircumferenceCm: 76,
                    strengthProgress: '',
                    nutritionAdherence: '',
                    trainingAdherence: '',
                  };

                  return (
                    <div
                      key={qKey}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1.5px solid #CBD5E1',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44' }}>{label}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                          M{(index + 1) * 3}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Weight (kg)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={qData.bodyWeightKg}
                            onChange={(e) => handleQuarterChange(qKey, 'bodyWeightKg', e.target.value)}
                            style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Body Fat %</label>
                          <input
                            type="number"
                            step="0.5"
                            value={qData.bodyFatPercentage}
                            onChange={(e) => handleQuarterChange(qKey, 'bodyFatPercentage', e.target.value)}
                            style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Fat Mass</label>
                          <div style={{ padding: '6px', backgroundColor: '#FEF3C7', borderRadius: '6px', fontSize: '12px', fontWeight: 800, color: '#92400E' }}>
                            {qData.fatMassKg} kg
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>FFM</label>
                          <div style={{ padding: '6px', backgroundColor: '#ECFDF5', borderRadius: '6px', fontSize: '12px', fontWeight: 800, color: '#065F46' }}>
                            {qData.fatFreeMassKg} kg
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Waist Circumference (cm)</label>
                        <input
                          type="number"
                          value={qData.waistCircumferenceCm}
                          onChange={(e) => handleQuarterChange(qKey, 'waistCircumferenceCm', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11.5px' }}
                          placeholder="e.g. 74"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Strength Progress</label>
                        <input
                          type="text"
                          value={qData.strengthProgress}
                          onChange={(e) => handleQuarterChange(qKey, 'strengthProgress', e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px' }}
                          placeholder="e.g. Squat +10kg, 12 pushups"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Nutrition Adherence</label>
                        <input
                          type="text"
                          value={qData.nutritionAdherence}
                          onChange={(e) => handleQuarterChange(qKey, 'nutritionAdherence', e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px' }}
                          placeholder="e.g. 90% compliance"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Training Adherence</label>
                        <input
                          type="text"
                          value={qData.trainingAdherence}
                          onChange={(e) => handleQuarterChange(qKey, 'trainingAdherence', e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px' }}
                          placeholder="e.g. 4.5 sessions/wk"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FINAL TRANSFORMATION REVIEW */}
              {record.finalReview && (
                <div
                  style={{
                    backgroundColor: '#0A1C44',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    border: '2px solid #E8CA56',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={20} color="#E8CA56" />
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#E8CA56', margin: 0 }}>
                        FINAL TRANSFORMATION REVIEW & METABOLIC OUTCOME
                      </h3>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Cumulative Evolution</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Total Weight Change</span>
                      <strong style={{ fontSize: '18px', color: record.finalReview.totalBodyWeightChangeKg <= 0 ? '#4ADE80' : '#F87171' }}>
                        {record.finalReview.totalBodyWeightChangeKg > 0 ? `+${record.finalReview.totalBodyWeightChangeKg}` : record.finalReview.totalBodyWeightChangeKg} kg
                      </strong>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Total Fat Mass Change</span>
                      <strong style={{ fontSize: '18px', color: '#4ADE80' }}>
                        {record.finalReview.totalFatMassChangeKg > 0 ? `+${record.finalReview.totalFatMassChangeKg}` : record.finalReview.totalFatMassChangeKg} kg
                      </strong>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Fat-Free Mass (Muscle)</span>
                      <strong style={{ fontSize: '18px', color: '#60A5FA' }}>
                        {record.finalReview.totalFatFreeMassChangeKg > 0 ? `+${record.finalReview.totalFatFreeMassChangeKg}` : record.finalReview.totalFatFreeMassChangeKg} kg
                      </strong>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Body Fat % Shift</span>
                      <strong style={{ fontSize: '18px', color: '#FBBF24' }}>
                        {record.finalReview.changeInBodyFatPercentage > 0 ? `+${record.finalReview.changeInBodyFatPercentage}` : record.finalReview.changeInBodyFatPercentage}%
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
                    <div style={{ fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#E8CA56', fontWeight: 700 }}>Strength Improvement: </span>
                      <span style={{ color: '#F1F5F9' }}>{record.finalReview.strengthImprovementSummary}</span>
                    </div>

                    <div style={{ fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#E8CA56', fontWeight: 700 }}>Next Recommended Phase: </span>
                      <span style={{ color: '#F1F5F9' }}>{record.finalReview.nextRecommendedPhase}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BODY FAT % & CALORIES REFERENCE GRID */}
          {activeTab === 'reference' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  backgroundColor: '#0A1C44',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#E8CA56' }}>
                    {selectedGender.toUpperCase()} BODY FAT %, FAT MASS & CALORIES IN FAT MASS
                  </h3>
                  <p style={{ fontSize: '12px', color: '#CBD5E1', margin: '4px 0 0' }}>
                    For {selectedGender} on Fat–Protein Diet (Low Carb 80 – 120 g Carbs) • Fat oxidation starts Day 1, visible fat loss significant after {selectedGender === 'Female' ? '3 – 4 months' : '3 months'}.
                  </p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11.5px', color: '#94A3B8' }}>
                  <span>Formula: Fat mass (kg) = Body weight × Body fat %</span><br />
                  <span>Calories in fat = Fat mass (kg) × 9,000 kcal</span>
                </div>
              </div>

              {/* Reference Grid Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                {currentReference.map((item) => (
                  <div
                    key={item.bodyFatPercent}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 900,
                          color: item.bodyFatPercent >= 35 ? '#BE185D' : item.bodyFatPercent >= 25 ? '#D97706' : '#15803D',
                        }}
                      >
                        {item.bodyFatPercent}%
                      </span>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                        BODY FAT
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Fat Mass</span>
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{item.fatMassKg} kg</strong>
                      <span style={{ fontSize: '10px', color: '#94A3B8', marginLeft: '4px' }}>({(item.fatMassKg * 1000).toLocaleString()} g)</span>
                    </div>

                    <div style={{ backgroundColor: '#FEF2F2', padding: '8px', borderRadius: '6px', border: '1px solid #FEE2E2' }}>
                      <span style={{ fontSize: '10.5px', color: '#991B1B', display: 'block' }}>Calories in Fat Mass</span>
                      <strong style={{ fontSize: '14px', color: '#B91C1C' }}>{item.caloriesInFatMass.toLocaleString()} kcal</strong>
                    </div>

                    {item.nextLevel && (
                      <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '8px', marginTop: '4px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0A1C44', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⏱️ {item.bodyFatPercent}% ➔ {item.nextLevel}% Duration:</span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#0369A1', marginTop: '2px' }}>
                          {item.daysToNextLevel} ({item.monthsToNextLevel})
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>
                          Rate: {item.ratePerMonth}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Clinical Protocol Notes Banner (Matching Images) */}
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '14px',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#166534', margin: '0 0 6px', textTransform: 'uppercase' }}>
                    🥗 Low Carb Fat + Protein Diet (80 – 120 g Carbs/Day)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#14532D', lineHeight: 1.6 }}>
                    <li><strong>Carbohydrates:</strong> 80 – 120 g/day (20 – 25% kcal, non-starchy veg, berries, legumes).</li>
                    <li><strong>Protein:</strong> 1.6 – 2.2 g/kg body weight (25 – 30% kcal, eggs, paneer, tofu, chicken, fish, whey).</li>
                    <li><strong>Fat:</strong> Remainder of calories (40 – 50% kcal, ghee, coconut oil, butter, nuts, seeds).</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#166534', margin: '0 0 6px', textTransform: 'uppercase' }}>
                    ⚡ Key Points for Nutritionist & Trainer
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#14532D', lineHeight: 1.6 }}>
                    <li>Fat oxidation starts Day 1, but visible changes usually become significant after 3 months.</li>
                    <li>Women may need 1–2 months longer for the same fat percentage reduction due to hormonal fat metabolism.</li>
                    <li>Combine with progressive resistance training (3–4x/week) to preserve lean body mass.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSFORMATION TIMELINE (3 to 12 MONTHS) */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: '#0A1C44',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingDown size={20} color="#E8CA56" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    {selectedGender.toUpperCase()} BODY FAT TRANSFORMATION TIMELINE (3, 6, 9 & 12 MONTHS)
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: '#E8CA56', fontWeight: 700 }}>
                  Expected Progression Framework
                </span>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #CBD5E1' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0A1C44' }}>Starting Body Fat</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0A1C44' }}>After 3 Months</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0A1C44' }}>After 6 Months</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0A1C44' }}>After 9 Months</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0A1C44' }}>After 12 Months</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTimeline.map((row, idx) => (
                      <tr
                        key={row.startingBodyFat}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#BE185D' }}>{row.startingBodyFat}</td>
                        <td style={{ padding: '12px 16px', color: '#334155' }}>{row.after3Months}</td>
                        <td style={{ padding: '12px 16px', color: '#334155' }}>{row.after6Months}</td>
                        <td style={{ padding: '12px 16px', color: '#334155' }}>{row.after9Months}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#15803D' }}>{row.after12Months}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ backgroundColor: '#FEF9C3', padding: '12px 16px', borderRadius: '10px', border: '1px solid #FDE047', fontSize: '11.5px', color: '#854D0E', lineHeight: 1.5 }}>
                ⚠️ <strong>Clinical Notice:</strong> These percentages are visual reference points and realistic guidelines, not guarantees. Body transformation depends on metabolic adaptation, starting body composition, calorie deficit, protein intake, progressive training, sleep quality, and individual hormonal health.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
