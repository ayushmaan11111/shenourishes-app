import React from 'react';
import { Activity, FileText } from 'lucide-react';
import { SingleCardSelect, MultiCardSelect } from '../../components/common/CardSelect';
import type { BloodTestAssessment, BloodTestStatus } from '../../types/customer';

interface StepBloodTestProps {
  data: BloodTestAssessment;
  onChange: (data: BloodTestAssessment) => void;
  errors: Record<string, string>;
}

const REPORT_STATUS_OPTIONS: { value: BloodTestStatus; label: string; description: string }[] = [
  {
    value: 'Yes, I have recent reports (Last 3–6 months)',
    label: 'Yes, recent reports (Last 3–6 months)',
    description: 'I have up-to-date blood work ready for clinical review',
  },
  {
    value: 'Yes, but older than 6 months',
    label: 'Yes, but older than 6 months',
    description: 'I have past blood test records for historical reference',
  },
  {
    value: 'No, but willing to take a test',
    label: 'No, but interested in taking a test',
    description: 'I would like guidance on recommended metabolic blood panels',
  },
  {
    value: 'Not at this time',
    label: 'Not at this time',
    description: 'I prefer to focus solely on diet, lifestyle, and habits for now',
  },
];

const BIOMARKERS_OPTIONS = [
  { 
    value: 'Blood sugar fasting test', 
    label: 'Blood sugar fasting test', 
    description: 'Evaluates fasting glucose and insulin sensitivity baseline' 
  },
  { 
    value: 'Vitamin D3 test', 
    label: 'Vitamin D3 test', 
    description: 'Assesses bone density, immune strength & metabolic vitality' 
  },
  { 
    value: 'Vitamin B12 test', 
    label: 'Vitamin B12 test', 
    description: 'Measures nervous system health, red blood cell synthesis & energy' 
  },
  { 
    value: 'Lipoprotein cholesterol test', 
    label: 'Lipoprotein cholesterol test', 
    description: 'Full lipid profile covering LDL, HDL, VLDL and triglycerides' 
  },
];

export const StepBloodTest: React.FC<StepBloodTestProps> = ({ data, onChange, errors }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: '#FDF0EE',
            color: '#C85A48',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          <Activity size={13} color="#C85A48" />
          <span>Clinical Biomarkers</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Blood Test & Biomarkers
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Recent blood test results help our clinical team pinpoint micro-nutrient deficiencies, hormone imbalances, and metabolic baselines.
        </p>
      </div>

      {/* Report Status */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Do you have recent blood test reports? <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={REPORT_STATUS_OPTIONS}
          value={data.reportStatus}
          onChange={(val) => onChange({ ...data, reportStatus: val })}
        />
        {errors.reportStatus && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.reportStatus}
          </span>
        )}
      </div>

      {/* Biomarkers Checked / Relevant */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Which tests or markers have you checked previously?
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Select all that apply</span>
        </label>
        <MultiCardSelect
          options={BIOMARKERS_OPTIONS}
          values={data.biomarkersChecked || []}
          noneOptionValue="None / Unsure"
          onChange={(vals) => onChange({ ...data, biomarkersChecked: vals })}
        />
      </div>

      {/* Known Abnormalities Notes */}
      <div className="form-group">
        <label className="form-label">
          Known Deficiencies, Abnormalities, or Doctor Remarks
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Optional</span>
        </label>
        <textarea
          rows={3}
          value={data.knownAbnormalitiesNotes || ''}
          onChange={(e) => onChange({ ...data, knownAbnormalitiesNotes: e.target.value })}
          placeholder="e.g. low Vitamin D (14 ng/mL), elevated TSH, high uric acid, low ferritin..."
          className="form-textarea"
        />
      </div>

      {/* Clinical note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          borderRadius: '12px',
          backgroundColor: '#FAF8F0',
          border: '1px solid #D9D8CC',
          fontSize: '12px',
          color: '#6B7063',
          lineHeight: 1.4,
        }}
      >
        <FileText size={18} color="#66734A" style={{ flexShrink: 0 }} />
        <span>You will be able to share or upload your digital PDF blood reports directly with your nutritionist during your 1-on-1 consultation.</span>
      </div>
    </div>
  );
};
