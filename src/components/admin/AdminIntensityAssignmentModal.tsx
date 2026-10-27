import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  X, 
  CheckCircle2, 
  Activity,
  Flame,
  Dumbbell,
  ShieldAlert
} from 'lucide-react';
import { 
  getClientIntensityConfig, 
  saveClientIntensityConfig 
} from '../../services/workoutIntensityService';
import type { 
  ClientWorkoutIntensityConfig, 
  WorkoutIntensityTier 
} from '../../types/longTermSupport';

interface AdminIntensityAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export const AdminIntensityAssignmentModal: React.FC<AdminIntensityAssignmentModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
}) => {
  const [selectedTier, setSelectedTier] = useState<WorkoutIntensityTier>('Beginner');
  const [planStartDate, setPlanStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bufferDays, setBufferDays] = useState<number>(3);
  const [coachNotes, setCoachNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (clientId) {
      getClientIntensityConfig(clientId).then((c) => {
        setSelectedTier(c.intensityLevel);
        setPlanStartDate(c.planStartDate);
        setBufferDays(c.testBufferDays ?? 3);
        setCoachNotes(c.notes || '');
      });
    }
  }, [clientId]);

  if (!isOpen) return null;

  // Compute active workout start date
  const computeActiveStartDate = (baseDateStr: string, buffer: number) => {
    try {
      const d = new Date(baseDateStr);
      d.setDate(d.getDate() + buffer);
      return d.toISOString().split('T')[0];
    } catch {
      return baseDateStr;
    }
  };

  const activeWorkoutStartDate = computeActiveStartDate(planStartDate, bufferDays);

  const getTierDetails = (tier: WorkoutIntensityTier) => {
    switch (tier) {
      case 'Beginner':
        return { multiplier: 1.5 as const, dailyMins: 30, goalMins: 1800, desc: 'Sedentary to Light activity. 30 mins/day. 1800 min 3-month target.' };
      case 'Intermediate':
        return { multiplier: 2.0 as const, dailyMins: 45, goalMins: 2700, desc: 'Moderate regular activity. 45 mins/day. 2700 min 3-month target.' };
      case 'Advanced':
        return { multiplier: 2.5 as const, dailyMins: 60, goalMins: 3000, desc: 'High activity (6 days/week). 50-60 mins/day. 3000 min 3-month target.' };
    }
  };

  const currentDetails = getTierDetails(selectedTier);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated: ClientWorkoutIntensityConfig = {
        clientId,
        clientName,
        intensityLevel: selectedTier,
        intensityMultiplier: currentDetails.multiplier,
        dailyMinutesTarget: currentDetails.dailyMins,
        threeMonthMinuteGoal: currentDetails.goalMins,
        planStartDate,
        testBufferDays: bufferDays,
        activeWorkoutStartDate,
        assignedAt: Date.now(),
        assignedBy: 'Sneha Dey (Lead Nutritionist & Coach)',
        notes: coachNotes.trim() || undefined,
      };

      await saveClientIntensityConfig(updated);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1200);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          backgroundColor: '#FFFDF9',
          borderRadius: '20px',
          border: '2px solid #0A1C44',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(232, 202, 86, 0.2)',
                color: '#E8CA56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ADMIN WORKOUT CALIBRATION
              </span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Intensity Level & Plan Start Date
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {showSuccess && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#ECFDF5', border: '1.5px solid #10B981', display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontSize: '13px', fontWeight: 700 }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>Intensity & Start Date successfully assigned and synced to {clientName}'s app!</span>
            </div>
          )}

          {/* Assessment guidance card */}
          <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC', display: 'flex', gap: '10px' }}>
            <ShieldAlert size={18} color="#0A1C44" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.4 }}>
              <strong>Clinical Assessment Rule:</strong> Assign intensity based on client's PAR-Q cardiovascular readiness, chronic joint health, and daily occupation. New clients receive diagnostic buffer days for blood tests prior to physical load.
            </div>
          </div>

          {/* 3 Intensity Tiers Selection Grid */}
          <div>
            <label className="form-label" style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
              Assign Workout Intensity Tier
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { tier: 'Beginner' as const, label: 'Beginner (1.5x)', mins: '30m / day', goal: '1,800 mins', icon: Activity, color: '#059669', bg: '#ECFDF5' },
                { tier: 'Intermediate' as const, label: 'Intermediate (2.0x)', mins: '45m / day', goal: '2,700 mins', icon: Flame, color: '#D97706', bg: '#FFFBEB' },
                { tier: 'Advanced' as const, label: 'Advanced (2.5x)', mins: '60m / 6 days', goal: '3,000 mins', icon: Dumbbell, color: '#DC2626', bg: '#FEF2F2' },
              ].map(t => {
                const isSelected = selectedTier === t.tier;
                const IconComponent = t.icon;
                return (
                  <div
                    key={t.tier}
                    onClick={() => setSelectedTier(t.tier)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? t.bg : '#FFFFFF',
                      border: `2px solid ${isSelected ? t.color : '#E2E8F0'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: isSelected ? '#FFFFFF' : t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color, marginBottom: '6px' }}>
                      <IconComponent size={18} />
                    </div>
                    <strong style={{ fontSize: '12px', color: '#1E293B' }}>{t.label}</strong>
                    <span style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>{t.mins}</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: t.color, marginTop: '4px' }}>
                      Goal: {t.goal}
                    </span>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: '11px', color: '#64748B', margin: '6px 0 0', fontStyle: 'italic' }}>
              {currentDetails.desc}
            </p>
          </div>

          {/* Start Date & Test Buffer Days */}
          <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
              ★ Start Date & Diagnostic Test Buffer
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>
                  Enrolled Plan Start Date
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={planStartDate}
                    onChange={(e) => setPlanStartDate(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>
                  Test Buffer Days (+? day for tests)
                </label>
                <select
                  value={bufferDays}
                  onChange={(e) => setBufferDays(parseInt(e.target.value, 10))}
                  className="form-select"
                  style={{ fontSize: '12px', padding: '6px 8px' }}
                >
                  <option value={0}>0 Days (Immediate Start)</option>
                  <option value={2}>+2 Days (Fast-Track Blood Test)</option>
                  <option value={3}>+3 Days (Standard Diagnostic Buffer)</option>
                  <option value={5}>+5 Days (Comprehensive Lab Window)</option>
                  <option value={7}>+7 Days (Full Clinical Review)</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#EEF4E8', border: '1px solid #B8D4A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11.5px', color: '#2B4214' }}>
                Active Workout Kickoff Date:
              </div>
              <strong style={{ fontSize: '13px', color: '#38571A' }}>
                {activeWorkoutStartDate} ({bufferDays} days test buffer)
              </strong>
            </div>
          </div>

          {/* Gamification Incentive Badge Note */}
          <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#FAF5FF', border: '1px solid #E9D5FF', display: 'flex', gap: '10px' }}>
            <Zap size={18} color="#9333EA" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B21A8' }}>
                Automatic 3-Month Gamification Incentive
              </div>
              <p style={{ fontSize: '11px', color: '#7E22CE', margin: '2px 0 0', lineHeight: 1.4 }}>
                If {clientName} completes <strong>600–900 minutes</strong> in 3 months, system unlocks:
                <br />
                • Intensity Tier Upgrade from Medium to Higher
                <br />
                • FREE specialized 4-day/week program (pulse & endurance focus)
              </p>
            </div>
          </div>

          {/* Coach Notes */}
          <div>
            <label className="form-label" style={{ fontSize: '11px' }}>Coach Prescription & Custom Guidance</label>
            <textarea
              rows={2}
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              placeholder="e.g. Focus on form over speed during the first 2 weeks. Maintain resistance bands on warm-ups."
              className="form-input"
              style={{ fontSize: '11.5px' }}
            />
          </div>

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#FAF8F0',
            borderTop: '1px solid #ECEAE0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            style={{ fontSize: '12px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
            style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CheckCircle2 size={14} />
            <span>{isSaving ? 'Saving...' : 'Save & Publish to Client App'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
