import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowLeft, Save, Loader2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveParQAssessment, getParQAssessment } from '../services/counsellingService';
import type { ParQHealthAssessment } from '../types/counselling';

interface ParQHealthScreenProps {
  onBack?: () => void;
  clientId?: string;
  clientName?: string;
  isAdminMode?: boolean;
}

const CHRONIC_CONDITIONS = [
  'PCOS / PCOD',
  'Thyroid Imbalance (Hypo / Hyper)',
  'Insulin Resistance / Pre-Diabetes',
  'Type 2 Diabetes',
  'Hypertension (High BP)',
  'Fatty Liver (Grade 1/2)',
  'Acid Reflux / GERD',
  'Chronic Constipation / IBS',
  'None',
];

const DEFAULT_PARQ_STATE: ParQHealthAssessment = {
  hasHeartCondition: false,
  hasChestPainWithActivity: false,
  hasChestPainWithoutActivity: false,
  hasDizzinessOrLossOfConsciousness: false,
  hasBoneOrJointProblem: false,
  hasHighBloodPressureOrMedication: false,
  hasOtherReasonNotToExercise: false,
  chronicConditions: ['None'],
  otherConditionsNotes: '',
  signedAgreement: true,
  signedAt: Date.now(),
};

export const ParQHealthScreen: React.FC<ParQHealthScreenProps> = ({ 
  onBack,
  clientId: propClientId,
  clientName: propClientName,
  isAdminMode = false,
}) => {
  const { user, customerRecord } = useAuth();
  
  // Use explicit prop clientId if provided (from Admin panel), otherwise fallback to logged in user
  const effectiveClientId = propClientId || user?.uid || customerRecord?.uid || 'default_user';
  const effectiveClientName = propClientName || customerRecord?.personalDetails?.fullName || 'Sneha De';

  const [parq, setParq] = useState<ParQHealthAssessment>(DEFAULT_PARQ_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load client-specific PAR-Q on mount or when client changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getParQAssessment(effectiveClientId)
      .then((savedParq) => {
        if (!isMounted) return;
        if (savedParq) {
          setParq({
            ...DEFAULT_PARQ_STATE,
            ...savedParq,
            chronicConditions: Array.isArray(savedParq.chronicConditions) && savedParq.chronicConditions.length > 0 
              ? savedParq.chronicConditions 
              : ['None'],
          });
        } else {
          setParq({
            ...DEFAULT_PARQ_STATE,
            signedAt: Date.now(),
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load PAR-Q assessment:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveClientId]);

  const toggleCondition = (cond: string) => {
    if (cond === 'None') {
      setParq({ ...parq, chronicConditions: ['None'] });
      return;
    }

    const filtered = (parq.chronicConditions || []).filter((c) => c !== 'None');
    if (filtered.includes(cond)) {
      const remaining = filtered.filter((c) => c !== cond);
      setParq({ ...parq, chronicConditions: remaining.length === 0 ? ['None'] : remaining });
    } else {
      setParq({ ...parq, chronicConditions: [...filtered, cond] });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveParQAssessment(effectiveClientId, parq);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (e) {
      console.error('Error saving PAR-Q:', e);
    } finally {
      setIsSaving(false);
    }
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SAFETY & READINESS AUDIT
                </span>
                {isAdminMode && (
                  <span style={{ fontSize: '9.5px', backgroundColor: '#DC2626', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    ADMIN MODE
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
                PAR-Q & Health Conditions Form
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={12} />
                <span>Client: <strong>{effectiveClientName}</strong></span>
              </p>
            </div>
          </div>

          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontWeight: 800 }}>
            Clinical Safety
          </span>
        </div>
      </div>

      {/* Main Form Content */}
      <div style={{ flex: 1, padding: '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: '#0A1C44' }} />
            <p style={{ fontSize: '13px', fontWeight: 600 }}>Loading saved PAR-Q record for {effectiveClientName}...</p>
          </div>
        ) : (
          <>
            {isSaved && (
              <div className="animate-fade-in" style={{ padding: '12px', backgroundColor: '#EEF4E8', borderRadius: '8px', border: '1.5px solid #B8D4A8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#38571A" />
                <span style={{ fontSize: '12px', color: '#2B4214', fontWeight: 700 }}>
                  PAR-Q Health Record Saved & Synced for {effectiveClientName}!
                </span>
              </div>
            )}

            {/* Client Context Banner */}
            <div style={{ padding: '10px 14px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                Managing Record for: <strong>{effectiveClientName}</strong>
              </div>
              <span style={{ fontSize: '10.5px', color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                ID: {effectiveClientId.slice(0, 10)}...
              </span>
            </div>

            {/* PAR-Q Diagnostic Questions */}
            <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#242820', margin: '0 0 12px' }}>
                Physical Activity Readiness Checklist (PAR-Q)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'hasHeartCondition', label: '1. Has your doctor ever said you have a heart condition?' },
                  { key: 'hasChestPainWithActivity', label: '2. Do you feel pain in your chest when performing physical activity?' },
                  { key: 'hasChestPainWithoutActivity', label: '3. In the past month, have you had chest pain when not physically active?' },
                  { key: 'hasDizzinessOrLossOfConsciousness', label: '4. Do you ever lose balance because of dizziness or lose consciousness?' },
                  { key: 'hasBoneOrJointProblem', label: '5. Do you have a bone or joint problem that could worsen with exercise?' },
                  { key: 'hasHighBloodPressureOrMedication', label: '6. Are you taking prescription medications for blood pressure or heart conditions?' },
                  { key: 'hasOtherReasonNotToExercise', label: '7. Do you know of any other reason why you should not do physical activity?' },
                ].map((q) => (
                  <label
                    key={q.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: (parq as any)[q.key] ? '#FDF0EE' : '#FAF8F0',
                      border: `1px solid ${(parq as any)[q.key] ? '#F5C6CB' : '#ECEAE0'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#242820',
                    }}
                  >
                    <span style={{ flex: 1, paddingRight: '8px' }}>{q.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean((parq as any)[q.key])}
                      onChange={(e) => setParq({ ...parq, [q.key]: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C85A48', cursor: 'pointer' }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Chronic Conditions Tags */}
            <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#242820', margin: '0 0 10px' }}>
                Select Any Known Chronic / Metabolic Conditions
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                {CHRONIC_CONDITIONS.map((cond) => {
                  const isSelected = (parq.chronicConditions || []).includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#EEF4E8' : '#FAF8F0',
                        border: `1.5px solid ${isSelected ? '#38571A' : '#D9D8CC'}`,
                        fontSize: '11.5px',
                        fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? '#242820' : '#6B7063',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '} {cond}
                    </button>
                  );
                })}
              </div>

              <div className="form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Other Medical History / Doctor Notes</label>
                <input
                  type="text"
                  placeholder="e.g. History of knee meniscus surgery in 2024..."
                  value={parq.otherConditionsNotes || ''}
                  onChange={(e) => setParq({ ...parq, otherConditionsNotes: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Safety Agreement */}
            <div style={{ padding: '14px', backgroundColor: '#FAF6D9', borderRadius: '10px', border: '1px solid #E8DEB2' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={parq.signedAgreement}
                  onChange={(e) => setParq({ ...parq, signedAgreement: e.target.checked })}
                  style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#0A1C44' }}
                />
                <span style={{ fontSize: '12px', color: '#5D4037', lineHeight: 1.45 }}>
                  I certify that I have answered these questions accurately to the best of my knowledge and grant She Nourishes clinicians permission to customize physical protocols accordingly.
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13.5px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: isSaving ? 'wait' : 'pointer' }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving to Firebase & Database...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save & Update PAR-Q Record for {effectiveClientName}</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
