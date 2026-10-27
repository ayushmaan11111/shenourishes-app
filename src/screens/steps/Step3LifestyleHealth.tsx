import React from 'react';
import { MultiCardSelect, SingleCardSelect } from '../../components/common/CardSelect';
import type {
  LifestyleHealth,
  SleepDuration,
  SleepQuality,
  StressLevel,
  AnxietyLevel,
  DailySittingDuration,
  DigestiveIssue,
} from '../../types/customer';

interface StepLifestyleHealthProps {
  data: LifestyleHealth;
  onChange: (data: LifestyleHealth) => void;
  errors: Record<string, string>;
}

const SLEEP_DURATIONS: { value: SleepDuration; label: string }[] = [
  { value: 'Less than 4 hours', label: 'Less than 4 hours' },
  { value: '4 – 6 hours', label: '4 – 6 hours' },
  { value: '6 – 8 hours', label: '6 – 8 hours' },
  { value: '8 – 10 hours', label: '8 – 10 hours' },
  { value: '10 – 12 hours', label: '10 – 12 hours' },
  { value: 'More than 12 hours', label: 'More than 12 hours' },
];

const SLEEP_QUALITIES: { value: SleepQuality; label: string; description: string }[] = [
  { value: 'Poor', label: 'Poor', description: 'Frequent awakenings, wake up fatigued' },
  { value: 'Average', label: 'Average', description: 'Occasional awakenings, moderate rest' },
  { value: 'Good', label: 'Good', description: 'Mostly uninterrupted, wake up refreshed' },
  { value: 'Excellent', label: 'Excellent', description: 'Deep, unbroken restorative sleep' },
];

const STRESS_LEVELS: { value: StressLevel; label: string; description: string }[] = [
  { value: 'Low', label: 'Low', description: 'Calm, well-managed daily routines' },
  { value: 'Moderate', label: 'Moderate', description: 'Occasional work or family pressure' },
  { value: 'High', label: 'High', description: 'Frequent tension, difficult to relax' },
  { value: 'Extremely High', label: 'Extremely High', description: 'Constant chronic stress & exhaustion' },
];

const ANXIETY_LEVELS: { value: AnxietyLevel; label: string; description: string }[] = [
  { 
    value: 'Very Low', 
    label: '🟢 Very Low', 
    description: 'I feel calm and relaxed; I rarely overthink or worry about things.' 
  },
  { 
    value: 'Mild', 
    label: '🟡 Mild', 
    description: 'I sometimes overthink or worry about challenges, but I can easily manage it.' 
  },
  { 
    value: 'Moderate', 
    label: '🟠 Moderate', 
    description: 'I frequently overthink, feel worried about challenges, or find it difficult to switch off my thoughts.' 
  },
  { 
    value: 'High', 
    label: '🔴 High', 
    description: 'I often feel fearful, overwhelmed, restless, or unable to control my worrying and overthinking.' 
  },
];

const SITTING_DURATIONS: { value: DailySittingDuration; label: string }[] = [
  { value: 'Less than 2 hours', label: 'Less than 2 hours' },
  { value: '2 – 4 hours', label: '2 – 4 hours' },
  { value: '4 – 6 hours', label: '4 – 6 hours' },
  { value: '6 – 8 hours', label: '6 – 8 hours' },
  { value: 'More than 8 hours', label: 'More than 8 hours (Desk-bound)' },
];

const DIGESTIVE_ISSUES: { value: DigestiveIssue; label: string }[] = [
  { value: 'None', label: 'None / Normal Digestion' },
  { value: 'Bloating', label: 'Bloating & Heaviness' },
  { value: 'Constipation', label: 'Constipation' },
  { value: 'Acidity', label: 'Acidity & Reflux' },
  { value: 'Gas', label: 'Gas & Flatulence' },
  { value: 'Diarrhea', label: 'Frequent Diarrhea' },
  { value: 'Other', label: 'Other Digestive Issue' },
];

export const Step3LifestyleHealth: React.FC<StepLifestyleHealthProps> = ({ data, onChange, errors }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Lifestyle & Health Assessment
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Understanding your circadian rhythms, anxiety, and digestive balance helps us create a sustainable plan.
        </p>
      </div>

      {/* Wake-up Time & Sleeping Time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="wakeUpTime">
            Daily Wake-up Time
          </label>
          <input
            id="wakeUpTime"
            type="text"
            placeholder="e.g. 06:30 AM"
            value={data.wakeUpTime || ''}
            onChange={(e) => onChange({ ...data, wakeUpTime: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sleepTime">
            Daily Bedtime / Sleep Time
          </label>
          <input
            id="sleepTime"
            type="text"
            placeholder="e.g. 10:30 PM"
            value={data.sleepTime || ''}
            onChange={(e) => onChange({ ...data, sleepTime: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      {/* Sleep Duration */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Average Sleep Duration <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={SLEEP_DURATIONS}
          value={data.sleepDuration}
          onChange={(val) => onChange({ ...data, sleepDuration: val })}
        />
        {errors.sleepDuration && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.sleepDuration}
          </span>
        )}
      </div>

      {/* Sleep Quality */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Sleep Quality <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={SLEEP_QUALITIES}
          value={data.sleepQuality}
          onChange={(val) => onChange({ ...data, sleepQuality: val })}
        />
        {errors.sleepQuality && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.sleepQuality}
          </span>
        )}
      </div>

      {/* Stress Level */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          General Stress Level <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={STRESS_LEVELS}
          value={data.stressLevel}
          onChange={(val) => onChange({ ...data, stressLevel: val })}
        />
        {errors.stressLevel && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.stressLevel}
          </span>
        )}
      </div>

      {/* Anxiety Level (NEW) */}
      <div>
        <label className="form-label" style={{ marginBottom: '4px' }}>
          Anxiety Level — How do you generally feel during the day? <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <p style={{ fontSize: '12px', color: '#6B7063', marginBottom: '8px' }}>
          Helps calibrate hormone-supportive nutrients and calming routine protocols.
        </p>
        <SingleCardSelect
          options={ANXIETY_LEVELS}
          value={data.anxietyLevel}
          onChange={(val) => onChange({ ...data, anxietyLevel: val })}
        />
        {errors.anxietyLevel && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.anxietyLevel}
          </span>
        )}
      </div>

      {/* Daily Caffeinated Beverages (Assessment Q2) */}
      <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '13.5px', fontWeight: 800, color: '#78350F', margin: 0 }}>
              Daily Caffeinated Beverages (Tea, Coffee, Energy Drinks)
            </label>
            <p style={{ fontSize: '11px', color: '#92400E', margin: '2px 0 0' }}>
              Used to evaluate caffeine tolerance and determine suitability for pre-workout aids.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#78350F', backgroundColor: '#FDE68A', padding: '2px 8px', borderRadius: '6px' }}>
            {data.caffeinatedBeveragesPerDay || 1} Cups / Day
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((cnt) => {
            const isSelected = (data.caffeinatedBeveragesPerDay || 1) === cnt;
            return (
              <button
                key={cnt}
                type="button"
                onClick={() => onChange({ ...data, caffeinatedBeveragesPerDay: cnt })}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #92400E' : '1px solid #FDE68A',
                  backgroundColor: isSelected ? '#F59E0B' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#78350F',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {cnt === 5 ? '5+ Cups' : `${cnt} ${cnt === 1 ? 'Cup' : 'Cups'}`}
              </button>
            );
          })}
        </div>

        {(data.caffeinatedBeveragesPerDay || 1) >= 2 && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#B45309', fontWeight: 600 }}>
            💡 Note: If you take 2 or more cups, our clinical guideline advises moderate caffeine reduction to support nervous system and sleep quality.
          </div>
        )}
      </div>

      {/* Muscle Pain & Soreness Assessment (Q8 & User Request) */}
      <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #0A1C44', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
              Do you have or frequently experience muscle pain or soreness?
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>
              Helps evaluate neuromuscular tension, physical recovery rate, and electrolyte status.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => onChange({ ...data, hasMusclePain: true, openToMagnesium: true })}
              style={{
                fontSize: '12px',
                padding: '4px 14px',
                borderRadius: '9999px',
                backgroundColor: data.hasMusclePain ? '#0A1C44' : '#E2E8F0',
                color: data.hasMusclePain ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, hasMusclePain: false, openToMagnesium: false, musclePainArea: '' })}
              style={{
                fontSize: '12px',
                padding: '4px 14px',
                borderRadius: '9999px',
                backgroundColor: !data.hasMusclePain ? '#0A1C44' : '#E2E8F0',
                color: !data.hasMusclePain ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        </div>

        {data.hasMusclePain && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Where do you feel the most muscle pain?
              </label>
              <input
                type="text"
                value={data.musclePainArea || ''}
                onChange={(e) => onChange({ ...data, musclePainArea: e.target.value })}
                placeholder="e.g. Lower back, neck/shoulders, legs, workout soreness..."
                className="form-input"
                style={{ fontSize: '12px', padding: '6px 10px' }}
              />
            </div>

            {/* Magnesium Recommendation Banner */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '22px' }}>🌙</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '13px', color: '#166534' }}>
                    Suggested Support: Magnesium Glycinate (200 mg)
                  </strong>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                    Post-Dinner / Bedtime
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#14532D', margin: '4px 0 8px', lineHeight: 1.35 }}>
                  Chelated Magnesium Glycinate acts directly on neuromuscular receptors to alleviate muscle tightness, reduce cramps, and promote deep restorative REM sleep.
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: '#15803D', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={data.openToMagnesium ?? true}
                    onChange={(e) => onChange({ ...data, openToMagnesium: e.target.checked })}
                  />
                  <span>Include Magnesium Glycinate (200 mg) in my recommended supplement protocol</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Sitting Duration */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Daily Sitting Duration (Sedentary Hours)
        </label>
        <SingleCardSelect
          options={SITTING_DURATIONS}
          value={data.dailySittingDuration}
          onChange={(val) => onChange({ ...data, dailySittingDuration: val })}
        />
      </div>

      {/* Digestive Issues */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Digestive Issues
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Select all that apply</span>
        </label>
        <MultiCardSelect
          options={DIGESTIVE_ISSUES}
          values={data.digestiveIssues || []}
          noneOptionValue="None"
          onChange={(vals) => onChange({ ...data, digestiveIssues: vals })}
        />
        {data.digestiveIssues?.includes('Other') && (
          <div className="form-group" style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={data.otherDigestiveIssue || ''}
              onChange={(e) => onChange({ ...data, otherDigestiveIssue: e.target.value })}
              placeholder="Please describe other digestive concern"
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Other Lifestyle Factors */}
      <div className="form-group">
        <label className="form-label">
          Other Lifestyle, Medical or Energy Factors
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Optional</span>
        </label>
        <textarea
          rows={3}
          value={data.otherLifestyleFactors || ''}
          onChange={(e) => onChange({ ...data, otherLifestyleFactors: e.target.value })}
          placeholder="e.g. shift work, frequent flights, PCOS, thyroid imbalances, chronic fatigue..."
          className="form-textarea"
        />
      </div>
    </div>
  );
};
