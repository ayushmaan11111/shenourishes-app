import React from 'react';
import { SingleCardSelect } from '../../components/common/CardSelect';
import { Check } from 'lucide-react';
import type { Commitment, CommitmentLevel } from '../../types/customer';

interface Step7Props {
  data: Commitment;
  onChange: (data: Commitment) => void;
  errors: Record<string, string>;
}

const COMMITMENT_LEVELS: { value: CommitmentLevel; label: string; description: string }[] = [
  { value: '100% Committed', label: '100% Committed', description: 'Ready to dedicate full focus and follow recommendations consistently' },
  { value: 'Highly Committed', label: 'Highly Committed', description: 'Very motivated with high priority given to health and diet' },
  { value: 'Moderately Committed', label: 'Moderately Committed', description: 'Will balance with busy routine and gradual pace' },
  { value: 'Need More Motivation', label: 'Need Extra Motivation', description: 'Looking forward to accountability and encouragement' },
];

export const Step7Commitment: React.FC<Step7Props> = ({ data, onChange, errors }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Mindset & Commitment
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Your commitment level guides our pace and milestone calibration.
        </p>
      </div>

      {/* Commitment Level */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          How committed are you right now? <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={COMMITMENT_LEVELS}
          value={data.commitmentLevel}
          onChange={(val) => onChange({ ...data, commitmentLevel: val })}
        />
        {errors.commitmentLevel && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.commitmentLevel}
          </span>
        )}
      </div>

      {/* Agreement Checkbox */}
      <div
        className="wellness-card"
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          backgroundColor: '#FAF8F0',
          cursor: 'pointer',
        }}
        onClick={() => onChange({ ...data, agreesToFollowPlan: !data.agreesToFollowPlan })}
      >
        <button
          type="button"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            border: `2px solid ${data.agreesToFollowPlan ? '#66734A' : '#D9D8CC'}`,
            backgroundColor: data.agreesToFollowPlan ? '#66734A' : '#FFFDF8',
            color: '#FFFDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          {data.agreesToFollowPlan && <Check size={14} strokeWidth={3} />}
        </button>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#242820', marginBottom: '2px' }}>
            Commitment Agreement
          </h4>
          <p style={{ fontSize: '12px', color: '#6B7063', lineHeight: 1.4 }}>
            I agree to communicate transparently with my nutritionist, log meals honestly, and embrace progressive wellness habits.
          </p>
        </div>
      </div>
    </div>
  );
};
