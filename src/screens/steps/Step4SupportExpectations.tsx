import React from 'react';
import { MultiCardSelect, SingleCardSelect } from '../../components/common/CardSelect';
import type {
  SupportExpectations,
  ProgramSupport,
  PreferredContactMethod,
} from '../../types/customer';

interface Step4Props {
  data: SupportExpectations;
  onChange: (data: SupportExpectations) => void;
  errors: Record<string, string>;
}

const PROGRAM_SUPPORTS: { value: ProgramSupport; label: string; description: string }[] = [
  { value: 'Customized Diet Plan', label: 'Customized Diet Plan', description: 'Tailored specifically for your body and preferences' },
  { value: 'Regular Follow-ups', label: 'Regular Follow-ups', description: 'Scheduled check-ins with your nutritionist' },
  { value: 'Accountability', label: 'Accountability', description: 'Support to stay on track and maintain consistency' },
  { value: 'Workout Plan', label: 'Workout Plan', description: 'Home or gym fitness schedule' },
  { value: 'Habit Building', label: 'Habit Building', description: 'Sustainable micro-habits that stick' },
  { value: 'Weight Management', label: 'Weight Management', description: 'Continuous body composition guidance' },
  { value: 'Education / Guidance', label: 'Education & Science', description: 'Understanding nutrition science principles' },
  { value: 'Motivation', label: 'Motivation & Mindset', description: 'Encouragement and positive reinforcement' },
  { value: 'Other', label: 'Other', description: 'Custom support requirement' },
];

const CONTACT_METHODS: { value: PreferredContactMethod; label: string; description: string }[] = [
  { value: 'WhatsApp', label: 'WhatsApp', description: 'Fast, flexible direct messaging & photo check-ins' },
  { value: 'Call', label: 'Phone Call', description: 'Direct audio voice consultations' },
  { value: 'Email', label: 'Email', description: 'Structured summaries and weekly reviews' },
  { value: 'Other', label: 'Other', description: 'Alternative messaging platform' },
];

export const Step4SupportExpectations: React.FC<Step4Props> = ({ data, onChange, errors }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Support & Communication
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Tell us how you would like your nutritionist and platform to support you.
        </p>
      </div>

      {/* Program Support expectations */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          What support do you expect from this program? <span style={{ color: '#C85A48' }}>*</span>
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Select all that apply</span>
        </label>
        <MultiCardSelect
          options={PROGRAM_SUPPORTS}
          values={data.programSupport || []}
          onChange={(vals) => onChange({ ...data, programSupport: vals })}
        />
        {errors.programSupport && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.programSupport}
          </span>
        )}

        {data.programSupport?.includes('Other') && (
          <div className="form-group" style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={data.otherProgramSupport || ''}
              onChange={(e) => onChange({ ...data, otherProgramSupport: e.target.value })}
              placeholder="Please specify other expectation"
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Preferred Contact Channel <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={CONTACT_METHODS}
          value={data.preferredContactMethod}
          onChange={(val) => onChange({ ...data, preferredContactMethod: val })}
        />
        {errors.preferredContactMethod && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.preferredContactMethod}
          </span>
        )}

        {data.preferredContactMethod === 'Other' && (
          <div className="form-group" style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={data.otherContactMethod || ''}
              onChange={(e) => onChange({ ...data, otherContactMethod: e.target.value })}
              placeholder="e.g. Telegram, Signal, etc."
              className="form-input"
            />
          </div>
        )}
      </div>
    </div>
  );
};
