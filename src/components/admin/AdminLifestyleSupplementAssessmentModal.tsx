import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles
} from 'lucide-react';
import type {
  LifestyleIntensityTier,
  LifestyleAssessmentAnswers,
  AnxietyLevelType,
  LifestyleSupplementEvaluationResult,
} from '../../types/lifestyleSupplement';
import {
  evaluateLifestyleSupplements,
  saveLifestyleAssessment,
  getLifestyleAssessment,
} from '../../services/lifestyleSupplementAssessmentService';

interface AdminLifestyleSupplementAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  clientMobile?: string;
  initialIntensity?: LifestyleIntensityTier;
}

export const AdminLifestyleSupplementAssessmentModal: React.FC<
  AdminLifestyleSupplementAssessmentModalProps
> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientMobile = '9903711773',
  initialIntensity = 'Sedentary 1.5',
}) => {
  const [selectedIntensity, setSelectedIntensity] = useState<LifestyleIntensityTier>(initialIntensity);
  const [anxietyLevel, setAnxietyLevel] = useState<AnxietyLevelType>('Low');
  const [caffeineCount, setCaffeineCount] = useState<number>(1);
  
  // Q3 Energy / Ergogenic
  const [feelsLowOnEnergy, setFeelsLowOnEnergy] = useState<boolean>(true);
  const [openToErgogenicEnergy, setOpenToErgogenicEnergy] = useState<boolean>(true);
  const [workoutTime, setWorkoutTime] = useState<'Morning' | 'Evening'>('Morning');

  // Moderate / 2.5 Strength
  const [wantsStrength, setWantsStrength] = useState<boolean>(true);
  const [openToCreatine, setOpenToCreatine] = useState<boolean>(true);

  // Vascularity / Burning
  const [feelsBurningOrVascularity, setFeelsBurningOrVascularity] = useState<boolean>(false);
  const [openToCitrulline, setOpenToCitrulline] = useState<boolean>(false);

  // Running
  const [goesRunning, setGoesRunning] = useState<boolean>(false);
  const [runningTime, setRunningTime] = useState<'Morning' | 'Evening'>('Morning');
  const [feelsRunningFatigue, setFeelsRunningFatigue] = useState<boolean>(false);
  const [openToBetaAlanine, setOpenToBetaAlanine] = useState<boolean>(false);

  // Q4 Gut Health
  const [hasConstipation, setHasConstipation] = useState<boolean>(false);
  const [openToGut, setOpenToGut] = useState<boolean>(false);

  // Q5 Bone Health
  const [openToBoneHealth, setOpenToBoneHealth] = useState<boolean>(true);
  const [doctorVitaminD, setDoctorVitaminD] = useState<string>('Dose as advised by doctor after blood test');

  // Q6 Immunity / Antioxidants
  const [poorImmunity, setPoorImmunity] = useState<boolean>(false);
  const [smokes, setSmokes] = useState<boolean>(false);
  const [drinksAlcohol, setDrinksAlcohol] = useState<boolean>(false);
  const [openToAntioxidants, setOpenToAntioxidants] = useState<boolean>(false);

  // Q7 Joint Pain / Anti-inflammatory
  const [hasJointPain, setHasJointPain] = useState<boolean>(false);
  const [wantsJointHealth, setWantsJointHealth] = useState<boolean>(false);
  const [openToOmega3, setOpenToOmega3] = useState<boolean>(false);

  // Q8 Muscle Pain & Sleep
  const [hasMusclePain, setHasMusclePain] = useState<boolean>(false);
  const [hasSleepIssues, setHasSleepIssues] = useState<boolean>(false);
  const [sleepHours, setSleepHours] = useState<string>('6 – 7 hours');
  const [openToMagnesium, setOpenToMagnesium] = useState<boolean>(false);

  // Caffeine kick
  const [wantsKick, setWantsKick] = useState<boolean>(false);
  const [openToCaffeine, setOpenToCaffeine] = useState<boolean>(false);

  const [coachNotes, setCoachNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  // Load existing answers for client
  useEffect(() => {
    if (clientId) {
      getLifestyleAssessment(clientId, initialIntensity).then((a) => {
        setSelectedIntensity(a.intensityTier || initialIntensity);
        setAnxietyLevel(a.anxietyLevel || 'Low');
        setCaffeineCount(a.caffeinatedBeveragesPerDay || 1);
        setFeelsLowOnEnergy(a.feelsLowOnEnergy ?? true);
        setOpenToErgogenicEnergy(a.openToErgogenicEnergy ?? true);
        setWorkoutTime(a.workoutTime || 'Morning');
        setWantsStrength(a.wantsIncreaseStrengthOrHeavyWeights ?? true);
        setOpenToCreatine(a.openToCreatine ?? true);
        setFeelsBurningOrVascularity(a.feelsBurningOrWantsVascularity ?? false);
        setOpenToCitrulline(a.openToCitrulline ?? false);
        setGoesRunning(a.goesRunning ?? false);
        setRunningTime(a.runningTime || 'Morning');
        setFeelsRunningFatigue(a.feelsRunningFatigue ?? false);
        setOpenToBetaAlanine(a.openToBetaAlanine ?? false);
        setHasConstipation(a.hasConstipationOrFlatulence ?? false);
        setOpenToGut(a.openToGutSupport ?? false);
        setOpenToBoneHealth(a.openToBoneHealth ?? true);
        setDoctorVitaminD(a.doctorPrescribedVitaminD || 'Dose as advised by doctor after blood test');
        setPoorImmunity(a.poorImmunityOrOftenSick ?? false);
        setSmokes(a.smokes ?? false);
        setDrinksAlcohol(a.drinksAlcohol ?? false);
        setOpenToAntioxidants(a.openToAntioxidantSupport ?? false);
        setHasJointPain(a.hasJointPain ?? false);
        setWantsJointHealth(a.wantsLongTermJointHealth ?? false);
        setOpenToOmega3(a.openToOmega3 ?? false);
        setHasMusclePain(a.hasMusclePain ?? false);
        setHasSleepIssues(a.hasSleepDifficulties ?? false);
        setSleepHours(typeof a.sleepHoursPerNight === 'string' ? a.sleepHoursPerNight : '6 – 7 hours');
        setOpenToMagnesium(a.openToMagnesium ?? false);
        setWantsKick(a.wantsWorkoutKick ?? false);
        setOpenToCaffeine(a.openToCaffeineAnhydrous ?? false);
        setCoachNotes(a.coachNotes || '');
      });
    }
  }, [clientId, initialIntensity]);

  if (!isOpen) return null;

  // Build current assessment payload
  const currentAnswers: LifestyleAssessmentAnswers = {
    intensityTier: selectedIntensity,
    anxietyLevel,
    caffeinatedBeveragesPerDay: caffeineCount,
    feelsLowOnEnergy,
    openToErgogenicEnergy,
    workoutTime,
    wantsIncreaseStrengthOrHeavyWeights: wantsStrength,
    openToCreatine,
    feelsBurningOrWantsVascularity: feelsBurningOrVascularity,
    openToCitrulline,
    goesRunning,
    runningTime,
    feelsRunningFatigue,
    openToBetaAlanine,
    hasConstipationOrFlatulence: hasConstipation,
    openToGutSupport: openToGut,
    openToBoneHealth,
    doctorPrescribedVitaminD: doctorVitaminD,
    poorImmunityOrOftenSick: poorImmunity,
    smokes,
    drinksAlcohol,
    openToAntioxidantSupport: openToAntioxidants,
    hasJointPain,
    wantsLongTermJointHealth: wantsJointHealth,
    openToOmega3,
    hasMusclePain,
    hasSleepDifficulties: hasSleepIssues,
    sleepHoursPerNight: sleepHours,
    openToMagnesium,
    wantsWorkoutKick: wantsKick,
    openToCaffeineAnhydrous: openToCaffeine,
    coachNotes,
    assessedAt: Date.now(),
    assessedBy: 'Sneha Dey (Clinical Nutritionist & Coach)',
  };

  // Evaluate in real-time
  const evaluatedResult: LifestyleSupplementEvaluationResult = evaluateLifestyleSupplements(currentAnswers);

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    try {
      await saveLifestyleAssessment(clientId, currentAnswers, clientName);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendWhatsApp = () => {
    const summaryLines = [
      `*SHE NOURISHES — LIFESTYLE SUPPLEMENT PROTOCOL*`,
      `Client: ${clientName}`,
      `Activity Tier: ${selectedIntensity}`,
      `Assessed By: Sneha Dey (Lead Nutritionist)`,
      ``,
      `*RECOMMENDED SUPPLEMENT SCHEDULE:*`,
      ...evaluatedResult.recommendations.map(
        (r, i) => `${i + 1}. *${r.name}* (${r.dosage})\n   ⏰ ${r.timing}\n   🎯 ${r.clinicalPurpose}`
      ),
      ``,
      `*IMPORTANT PROTOCOL NOTES:*`,
      `• Vitamin D: ${evaluatedResult.vitaminDNotice}`,
      ...evaluatedResult.combinationNotes.map((n) => `• ${n}`),
      evaluatedResult.caffeineWarning ? `• ⚠️ ${evaluatedResult.caffeineWarning}` : '',
      ``,
      `Access your live supplement chart in the She Nourishes App: https://she-nourishes.web.app`,
    ].filter(Boolean);

    const message = encodeURIComponent(summaryLines.join('\n'));
    window.open(`https://wa.me/${clientMobile.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '94vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(10, 28, 68, 0.25)',
          border: '1.5px solid #0A1C44',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
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
              <Zap size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#E8CA56',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  CLINICAL PROTOCOL ENGINE
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  Client: {clientName}
                </span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
                Lifestyle Assessment for Supplements
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#CBD5E1',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Intensity Tier Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            backgroundColor: '#F1F5F9',
            padding: '6px',
            gap: '6px',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          {(
            [
              { tier: 'Sedentary 1.5', label: 'Sedentary 1.5', sub: 'No Workout / Low Activity' },
              { tier: 'Beginner 1.5', label: 'Beginner 1.5', sub: 'Walks, Yoga, Occasional' },
              { tier: 'Moderate 2.0', label: 'Moderate 2.0', sub: 'Gym, Strength, Cardio' },
              { tier: 'Extremely High 2.5', label: 'Extremely High 2.5', sub: 'High Performance / Athlete' },
            ] as const
          ).map((item) => {
            const isActive = selectedIntensity === item.tier;
            return (
              <button
                key={item.tier}
                type="button"
                onClick={() => setSelectedIntensity(item.tier)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #0A1C44' : '1px solid transparent',
                  backgroundColor: isActive ? '#0A1C44' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#E8CA56' : '#0A1C44' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '10px', color: isActive ? '#94A3B8' : '#64748B', marginTop: '1px' }}>
                  {item.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Toast Notice */}
          {showSavedToast && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #10B981',
                color: '#065F46',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={18} color="#059669" />
              <span>Lifestyle Assessment saved! Supplement chart published to client profile in real time.</span>
            </div>
          )}

          {/* QUESTIONNAIRE ACCORDION / GRID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Q1 & Q2: Anxiety & Caffeine */}
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FCD34D',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#B45309',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  1
                </span>
                <strong style={{ fontSize: '13.5px', color: '#78350F' }}>
                  Anxiety Level & Daily Caffeine Intake Assessment
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '6px' }}>
                    Q1. How is your anxiety level?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {(['Low', 'Moderate', 'High', 'Very High'] as AnxietyLevelType[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setAnxietyLevel(lvl)}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '8px',
                          border: anxietyLevel === lvl ? '1.5px solid #92400E' : '1px solid #FDE68A',
                          backgroundColor: anxietyLevel === lvl ? '#F59E0B' : '#FFFFFF',
                          color: anxietyLevel === lvl ? '#FFFFFF' : '#78350F',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '6px' }}>
                    Q2. Daily caffeinated beverages (tea/coffee/energy)?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCaffeineCount(cnt)}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '8px',
                          border: caffeineCount === cnt ? '1.5px solid #92400E' : '1px solid #FDE68A',
                          backgroundColor: caffeineCount === cnt ? '#F59E0B' : '#FFFFFF',
                          color: caffeineCount === cnt ? '#FFFFFF' : '#78350F',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {cnt === 5 ? '5+' : cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {evaluatedResult.caffeineWarning && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #F87171',
                    color: '#991B1B',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>{evaluatedResult.caffeineWarning}</span>
                </div>
              )}
            </div>

            {/* Q3: Energy & Ergogenic Aids */}
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#0A1C44',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  2
                </span>
                <strong style={{ fontSize: '13.5px', color: '#0A1C44' }}>
                  Energy, Workout Fatigue & Ergogenic Support
                </strong>
              </div>

              {/* Intensity = Sedentary 1.5 or Beginner 1.5: Acetyl L-Carnitine 3g */}
              {(selectedIntensity === 'Sedentary 1.5' || selectedIntensity === 'Beginner 1.5') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                      Do you feel low on energy?
                    </span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="lowEnergy"
                        checked={feelsLowOnEnergy}
                        onChange={() => setFeelsLowOnEnergy(true)}
                      />
                      <span>Yes</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="lowEnergy"
                        checked={!feelsLowOnEnergy}
                        onChange={() => setFeelsLowOnEnergy(false)}
                      />
                      <span>No</span>
                    </label>
                  </div>

                  {feelsLowOnEnergy && (
                    <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0A1C44', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={openToErgogenicEnergy}
                          onChange={(e) => setOpenToErgogenicEnergy(e.target.checked)}
                        />
                        <span>Client is open to ergogenic support (L-Carnitine / Acetyl-L-Carnitine 3 g/day)</span>
                      </label>

                      {selectedIntensity === 'Beginner 1.5' && openToErgogenicEnergy && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px' }}>
                          <span style={{ fontWeight: 600, color: '#475569' }}>Workout Time:</span>
                          <button
                            type="button"
                            onClick={() => setWorkoutTime('Morning')}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: workoutTime === 'Morning' ? '1.5px solid #059669' : '1px solid #CBD5E1',
                              backgroundColor: workoutTime === 'Morning' ? '#ECFDF5' : '#FFFFFF',
                              color: workoutTime === 'Morning' ? '#065F46' : '#475569',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            ☀️ Morning (Empty stomach)
                          </button>
                          <button
                            type="button"
                            onClick={() => setWorkoutTime('Evening')}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: workoutTime === 'Evening' ? '1.5px solid #059669' : '1px solid #CBD5E1',
                              backgroundColor: workoutTime === 'Evening' ? '#ECFDF5' : '#FFFFFF',
                              color: workoutTime === 'Evening' ? '#065F46' : '#475569',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            🌙 Evening (Post-workout)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Intensity = Moderate 2.0 or Extremely High 2.5: Creatine, Citrulline, Beta-Alanine */}
              {(selectedIntensity === 'Moderate 2.0' || selectedIntensity === 'Extremely High 2.5') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Creatine */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '6px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0A1C44' }}>
                        Wants to increase strength/power or lift heavy weights?
                      </span>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Creatine Monohydrate 5 g — Post-workout</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={openToCreatine}
                        onChange={(e) => {
                          setOpenToCreatine(e.target.checked);
                          setWantsStrength(e.target.checked);
                        }}
                      />
                      <span>Prescribe Creatine 5g</span>
                    </label>
                  </div>

                  {/* L-Citrulline */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '6px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0A1C44' }}>
                        Burning sensation during heavy lift OR desires vascularity / visible veins?
                      </span>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>L-Citrulline 3 g — Post-workout</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={openToCitrulline}
                        onChange={(e) => {
                          setOpenToCitrulline(e.target.checked);
                          setFeelsBurningOrVascularity(e.target.checked);
                        }}
                      />
                      <span>Prescribe L-Citrulline 3g</span>
                    </label>
                  </div>

                  {/* Running & Beta-Alanine */}
                  <div style={{ padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0A1C44' }}>
                          Goes running and experiences muscle fatigue during long runs?
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Beta-Alanine 3 g (Buffers lactic acidosis)</div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={openToBetaAlanine}
                          onChange={(e) => {
                            setOpenToBetaAlanine(e.target.checked);
                            setGoesRunning(e.target.checked);
                            setFeelsRunningFatigue(e.target.checked);
                          }}
                        />
                        <span>Prescribe Beta-Alanine 3g</span>
                      </label>
                    </div>

                    {openToBetaAlanine && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', marginTop: '2px' }}>
                        <span style={{ color: '#475569' }}>Running Session:</span>
                        <button
                          type="button"
                          onClick={() => setRunningTime('Morning')}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: runningTime === 'Morning' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            backgroundColor: runningTime === 'Morning' ? '#EFF6FF' : '#FFFFFF',
                            color: runningTime === 'Morning' ? '#1D4ED8' : '#475569',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Morning (Empty stomach)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRunningTime('Evening')}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: runningTime === 'Evening' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            backgroundColor: runningTime === 'Evening' ? '#EFF6FF' : '#FFFFFF',
                            color: runningTime === 'Evening' ? '#1D4ED8' : '#475569',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Evening (Post-running)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Q4 & Q5: Gut Health & Bone Health (Doctor-Directed Vitamin D) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {/* Gut Health */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #BBF7D0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    3
                  </span>
                  <strong style={{ fontSize: '13.5px', color: '#166534' }}>Gut Health & Probiotics</strong>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#14532D', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasConstipation}
                    onChange={(e) => {
                      setHasConstipation(e.target.checked);
                      if (e.target.checked) setOpenToGut(true);
                    }}
                  />
                  <span>Experiences constipation or flatulence</span>
                </label>

                {hasConstipation && (
                  <div style={{ padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '11.5px', color: '#166534' }}>
                    <strong>Probiotic (2 g/day)</strong>: 30 minutes before lunch & 30 minutes before later snack/meal.
                  </div>
                )}
              </div>

              {/* Bone Health & Vitamin D */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    4
                  </span>
                  <strong style={{ fontSize: '13.5px', color: '#1E40AF' }}>Bone Health & Doctor-Directed Vitamin D</strong>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E3A8A', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={openToBoneHealth}
                    onChange={(e) => setOpenToBoneHealth(e.target.checked)}
                  />
                  <span>Calcium Citrate Malate (500mg) + Vitamin K2 MK-7 (200mcg)</span>
                </label>

                <div style={{ marginTop: '2px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', display: 'block', marginBottom: '2px' }}>
                    Doctor's Prescribed Vitamin D3 Dose:
                  </label>
                  <input
                    type="text"
                    value={doctorVitaminD}
                    onChange={(e) => setDoctorVitaminD(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 60,000 IU weekly as prescribed by doctor"
                    style={{ fontSize: '11.5px', padding: '4px 8px' }}
                  />
                  <span style={{ fontSize: '10px', color: '#2563EB', display: 'block', marginTop: '2px' }}>
                    ⚠️ Vitamin D dose must follow treating doctor's prescription after blood test.
                  </span>
                </div>
              </div>
            </div>

            {/* Q6, Q7, Q8: Immunity (Antioxidants), Joint Pain (Omega-3), Muscle Pain & Sleep (Magnesium) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              
              {/* Antioxidants */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#FAF5FF',
                  border: '1.5px solid #E9D5FF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      backgroundColor: '#9333EA',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10.5px',
                      fontWeight: 800,
                    }}
                  >
                    5
                  </span>
                  <strong style={{ fontSize: '13px', color: '#6B21A8' }}>Antioxidant Support</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: '#581C87' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={poorImmunity}
                      onChange={(e) => setPoorImmunity(e.target.checked)}
                    />
                    <span>Poor immunity / falls sick frequently</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={smokes}
                      onChange={(e) => setSmokes(e.target.checked)}
                    />
                    <span>Smokes cigarettes</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={drinksAlcohol}
                      onChange={(e) => setDrinksAlcohol(e.target.checked)}
                    />
                    <span>Drinks alcohol</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, marginTop: '2px' }}>
                    <input
                      type="checkbox"
                      checked={openToAntioxidants}
                      onChange={(e) => setOpenToAntioxidants(e.target.checked)}
                    />
                    <span>Open to Antioxidants (ALA + CoQ10 + C + E)</span>
                  </label>
                </div>
              </div>

              {/* Joint Pain (Omega-3) */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#FEF3C7',
                  border: '1.5px solid #FCD34D',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      backgroundColor: '#D97706',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10.5px',
                      fontWeight: 800,
                    }}
                  >
                    6
                  </span>
                  <strong style={{ fontSize: '13px', color: '#92400E' }}>Anti-inflammatory (Omega-3)</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: '#78350F' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasJointPain}
                      onChange={(e) => setHasJointPain(e.target.checked)}
                    />
                    <span>Experiences joint pain</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={wantsJointHealth}
                      onChange={(e) => setWantsJointHealth(e.target.checked)}
                    />
                    <span>Wants long-term joint health support</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, marginTop: '2px' }}>
                    <input
                      type="checkbox"
                      checked={openToOmega3}
                      onChange={(e) => setOpenToOmega3(e.target.checked)}
                    />
                    <span>Prescribe Omega-3 (EPA + DHA 900 mg)</span>
                  </label>
                </div>
              </div>

              {/* Muscle Pain & Sleep (Magnesium) */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#F1F5F9',
                  border: '1.5px solid #CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      backgroundColor: '#475569',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10.5px',
                      fontWeight: 800,
                    }}
                  >
                    7
                  </span>
                  <strong style={{ fontSize: '13px', color: '#1E293B' }}>Muscle Pain & Sleep (Magnesium)</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: '#334155' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasMusclePain}
                      onChange={(e) => setHasMusclePain(e.target.checked)}
                    />
                    <span>Experiences muscle pain or soreness</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasSleepIssues}
                      onChange={(e) => setHasSleepIssues(e.target.checked)}
                    />
                    <span>Sleep difficulties or frequent awakenings</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B' }}>Sleep duration:</span>
                    <select
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      style={{ fontSize: '11px', padding: '2px 4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="Less than 5 hours">Less than 5 hours</option>
                      <option value="5 – 6 hours">5 – 6 hours</option>
                      <option value="6 – 7 hours">6 – 7 hours</option>
                      <option value="7 – 8 hours">7 – 8 hours</option>
                      <option value="More than 8 hours">More than 8 hours</option>
                    </select>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, marginTop: '2px', color: '#059669' }}>
                    <input
                      type="checkbox"
                      checked={openToMagnesium}
                      onChange={(e) => setOpenToMagnesium(e.target.checked)}
                    />
                    <span>Prescribe Magnesium Glycinate 200mg</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* 5 CLINICAL KEY NOTES (Exact matches to images 2, 4, 6, 7, 8 in sugg/) */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#0A1C44',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#E8CA56" />
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#E8CA56' }}>
                Key Points & Clinical Rules (Where to Give • Where to Write • What to Remember)
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                <strong style={{ fontSize: '11.5px', color: '#93C5FD' }}>1. Doctor-Directed Vitamin D</strong>
                <p style={{ fontSize: '11px', color: '#E2E8F0', margin: '4px 0 0' }}>
                  Vitamin D is essential for calcium absorption. Always record: <em>"Vitamin D dose as per doctor's prescription after test."</em> Never independently determine dose.
                </p>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                <strong style={{ fontSize: '11.5px', color: '#FDE68A' }}>2. Separate Antioxidants & Omega-3</strong>
                <p style={{ fontSize: '11px', color: '#E2E8F0', margin: '4px 0 0' }}>
                  If both are taken: <strong>Antioxidant $\rightarrow$ Post-Lunch</strong>, <strong>Omega-3 $\rightarrow$ Post-Dinner</strong>. Never administer simultaneously.
                </p>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                <strong style={{ fontSize: '11.5px', color: '#86EFAC' }}>3. Ergogenic Aid Synergy</strong>
                <p style={{ fontSize: '11px', color: '#E2E8F0', margin: '4px 0 0' }}>
                  If both Beta-Alanine and L-Citrulline are selected: <strong>combine together post-workout</strong> (no separate dosing needed). Acetyl L-Carnitine: morning empty stomach or evening post-workout.
                </p>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                <strong style={{ fontSize: '11.5px', color: '#FCA5A5' }}>4. Caffeine & Anxiety Safety</strong>
                <p style={{ fontSize: '11px', color: '#E2E8F0', margin: '4px 0 0' }}>
                  If anxiety is high or caffeine intake is $\ge 2-3$ drinks/day: <strong>DO NOT suggest caffeine anhydrous</strong>. Advise caffeine reduction instead.
                </p>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                <strong style={{ fontSize: '11.5px', color: '#D8B4FE' }}>5. Magnesium for Muscle Pain & Sleep</strong>
                <p style={{ fontSize: '11px', color: '#E2E8F0', margin: '4px 0 0' }}>
                  Magnesium Glycinate (200 mg) at bedtime facilitates neuromuscular relaxation, relieves cramps/DOMS, and optimizes deep restorative sleep.
                </p>
              </div>
            </div>
          </div>

          {/* GENERATED RECOMMENDATIONS PREVIEW */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0A1C44',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                  ACTIVE GENERATED PROTOCOL
                </span>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0A1C44' }}>
                  Prescribed Supplement Schedule ({evaluatedResult.recommendations.length} Items)
                </h4>
              </div>

              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '6px' }}>
                Tier: {selectedIntensity}
              </span>
            </div>

            {evaluatedResult.recommendations.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '12.5px' }}>
                No supplements selected yet. Check the client questionnaire responses above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {evaluatedResult.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: rec.status === 'Contraindicated' ? '#FEF2F2' : '#F8FAFC',
                      border: rec.status === 'Contraindicated' ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{rec.icon || '💊'}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ fontSize: '13px', color: '#0A1C44' }}>{rec.name}</strong>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor:
                                rec.status === 'Doctor-Directed'
                                  ? '#DBEAFE'
                                  : rec.status === 'Contraindicated'
                                  ? '#FEE2E2'
                                  : '#DCFCE7',
                              color:
                                rec.status === 'Doctor-Directed'
                                  ? '#1E40AF'
                                  : rec.status === 'Contraindicated'
                                  ? '#991B1B'
                                  : '#166534',
                            }}
                          >
                            {rec.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                          {rec.clinicalPurpose}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669' }}>{rec.dosage}</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>⏰ {rec.timing}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coach Notes */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0A1C44', display: 'block', marginBottom: '4px' }}>
              Coach Assessment & Personalized Notes
            </label>
            <textarea
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              className="form-input"
              rows={2}
              placeholder="e.g. Focus on post-lunch antioxidant spacing and ensure physician confirms 25-OH Vitamin D report before titration."
              style={{ fontSize: '12px' }}
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #059669',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Send size={13} />
              <span>Send via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndSync}
              disabled={isSaving}
              className="btn-primary"
              style={{
                padding: '8px 20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0A1C44',
              }}
            >
              <CheckCircle2 size={14} color="#E8CA56" />
              <span>{isSaving ? 'Syncing...' : 'Save & Publish to Client App'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
