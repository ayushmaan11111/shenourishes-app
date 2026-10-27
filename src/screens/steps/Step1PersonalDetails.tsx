import React from 'react';
import { Sparkles } from 'lucide-react';
import type { PersonalDetails, Gender, HeightUnit, WeightUnit, WaistUnit } from '../../types/customer';
import { calculateMifflinStJeorBmr } from '../../utils/bmrCalculator';

interface Step1Props {
  data: PersonalDetails;
  onChange: (data: PersonalDetails) => void;
  errors: Record<string, string>;
}

export const Step1PersonalDetails: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  const updateField = <K extends keyof PersonalDetails>(field: K, value: PersonalDetails[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateWaist = (field: keyof PersonalDetails['waistCircumference'], value: number | null | WaistUnit) => {
    onChange({
      ...data,
      waistCircumference: {
        ...data.waistCircumference,
        [field]: value,
      },
    });
  };

  // Convert height to cm for BMR calculation if in ft/in
  let heightInCm = data.height || 165;
  if (data.heightUnit === 'ft/in' && data.height) {
    heightInCm = Math.round(data.height * 30.48);
  }

  // Convert weight to kg for BMR calculation if in lbs
  let weightInKg = data.weight || 64;
  if (data.weightUnit === 'lbs' && data.weight) {
    weightInKg = Math.round((data.weight * 0.453592) * 10) / 10;
  }

  const age = data.age || 28;
  const bodyFat = data.bodyFatPercentage ?? 24;

  const bmrResult = calculateMifflinStJeorBmr(
    weightInKg,
    heightInCm,
    age,
    data.gender || 'Female',
    bodyFat
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ marginBottom: '6px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Personal Details & Body Composition
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Tell us about yourself to calibrate your real-time BMR, Fat-Free Mass, and clinical nutrition baseline.
        </p>
      </div>

      {/* Full Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="fullName">
          Full Name <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={data.fullName || ''}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="e.g. Sarah Jenkins"
          className={`form-input ${errors.fullName ? 'has-error' : ''}`}
        />
        {errors.fullName && <span className="form-error-text">{errors.fullName}</span>}
      </div>

      {/* Age & Gender */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="age">
            Age <span style={{ color: '#C85A48' }}>*</span>
          </label>
          <input
            id="age"
            type="number"
            value={data.age !== null ? data.age : ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null;
              updateField('age', val);
            }}
            placeholder="Years"
            className={`form-input ${errors.age ? 'has-error' : ''}`}
            min={10}
            max={120}
          />
          {errors.age && <span className="form-error-text">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="gender">
            Gender <span style={{ color: '#C85A48' }}>*</span>
          </label>
          <select
            id="gender"
            value={data.gender}
            onChange={(e) => updateField('gender', e.target.value as Gender)}
            className="form-input"
            style={{ appearance: 'auto' }}
          >
            <option value="Female">Female (BMR: -161)</option>
            <option value="Male">Male (BMR: +5)</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Height with Unit */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label" htmlFor="height">
            Height <span style={{ color: '#C85A48' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['cm', 'ft/in'] as HeightUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => updateField('heightUnit', unit)}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: data.heightUnit === unit ? '#66734A' : '#F1EEDF',
                  color: data.heightUnit === unit ? '#FFFDF8' : '#6B7063',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
        <input
          id="height"
          type="number"
          step="any"
          value={data.height !== null ? data.height : ''}
          onChange={(e) => {
            const val = e.target.value ? parseFloat(e.target.value) : null;
            updateField('height', val);
          }}
          placeholder={data.heightUnit === 'cm' ? 'e.g. 165' : 'e.g. 5.5'}
          className={`form-input ${errors.height ? 'has-error' : ''}`}
        />
        {errors.height && <span className="form-error-text">{errors.height}</span>}
      </div>

      {/* Weight & Body Fat % Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Weight with Unit */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" htmlFor="weight">
              Weight <span style={{ color: '#C85A48' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['kg', 'lbs'] as WeightUnit[]).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => updateField('weightUnit', unit)}
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: data.weightUnit === unit ? '#66734A' : '#F1EEDF',
                    color: data.weightUnit === unit ? '#FFFDF8' : '#6B7063',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          <input
            id="weight"
            type="number"
            step="any"
            value={data.weight !== null ? data.weight : ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : null;
              updateField('weight', val);
            }}
            placeholder={data.weightUnit === 'kg' ? 'e.g. 64' : 'e.g. 140'}
            className={`form-input ${errors.weight ? 'has-error' : ''}`}
          />
          {errors.weight && <span className="form-error-text">{errors.weight}</span>}
        </div>

        {/* Body Fat Percentage */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" htmlFor="bodyFatPercentage">
              Body Fat %
            </label>
            <span style={{ fontSize: '11px', color: '#66734A', fontWeight: 700 }}>
              {data.bodyFatPercentage ?? 24}%
            </span>
          </div>
          <input
            id="bodyFatPercentage"
            type="number"
            step="0.5"
            min={5}
            max={60}
            value={data.bodyFatPercentage !== null && data.bodyFatPercentage !== undefined ? data.bodyFatPercentage : 24}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : 24;
              updateField('bodyFatPercentage', val);
            }}
            placeholder="e.g. 24%"
            className="form-input"
          />
        </div>
      </div>

      {/* REAL-TIME BODY COMPOSITION & BMR BREAKDOWN CARD */}
      <div
        className="wellness-card"
        style={{
          padding: '16px',
          backgroundColor: '#0A1C44',
          color: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(10, 28, 68, 0.18)',
          border: '1.5px solid #E8CA56',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#E8CA56" />
            <strong style={{ fontSize: '13.5px', color: '#FFFFFF', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              Your Metabolic & Body Composition Math
            </strong>
          </div>
          <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#E8CA56', color: '#0A1C44', fontWeight: 800 }}>
            Live Calibration
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {/* Fat-Free Mass (FFM) */}
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 700, textTransform: 'uppercase' }}>Fat-Free Mass (FFM)</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
              {bmrResult.fatFreeMassKg} <span style={{ fontSize: '12px', fontWeight: 600 }}>kg</span>
            </div>
            <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>
              Fat Mass: {bmrResult.fatMassKg} kg ({bodyFat}%)
            </div>
          </div>

          {/* BMR (Mifflin-St Jeor) */}
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 700, textTransform: 'uppercase' }}>Basal Metabolic Rate</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
              {bmrResult.bmr} <span style={{ fontSize: '12px', fontWeight: 600 }}>kcal</span>
            </div>
            <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>
              {data.gender === 'Male' ? 'Mifflin-St Jeor (+5)' : 'Mifflin-St Jeor (-161)'}
            </div>
          </div>

          {/* Daily Maintenance Calories */}
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 700, textTransform: 'uppercase' }}>Daily Maintenance</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
              {bmrResult.sedentaryCalories} <span style={{ fontSize: '12px', fontWeight: 600 }}>kcal</span>
            </div>
            <div style={{ fontSize: '10px', color: '#C8D6EC', marginTop: '2px' }}>
              Min Protein: {bmrResult.recommendedProteinGrams}g / day
            </div>
          </div>
        </div>

        <div style={{ fontSize: '10.5px', color: '#D4E2F7', marginTop: '10px', lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px' }}>
          <strong>Formula Reference:</strong> Fat-Free Mass = Weight − (Weight × Body Fat % ÷ 100) • BMR = (10 × W) + (6.25 × H) − (5 × Age) {data.gender === 'Male' ? '+ 5' : '− 161'}
        </div>
      </div>

      {/* Mobile & Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="mobileNumber">
          Mobile Number <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <input
          id="mobileNumber"
          type="tel"
          value={data.mobileNumber || ''}
          onChange={(e) => updateField('mobileNumber', e.target.value)}
          placeholder="+91 98765 43210"
          className={`form-input ${errors.mobileNumber ? 'has-error' : ''}`}
        />
        {errors.mobileNumber && <span className="form-error-text">{errors.mobileNumber}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="emailAddress">
          Email Address <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <input
          id="emailAddress"
          type="email"
          value={data.emailAddress || ''}
          onChange={(e) => updateField('emailAddress', e.target.value)}
          placeholder="name@example.com"
          className={`form-input ${errors.emailAddress ? 'has-error' : ''}`}
        />
        {errors.emailAddress && <span className="form-error-text">{errors.emailAddress}</span>}
      </div>

      {/* Address */}
      <div className="form-group">
        <label className="form-label" htmlFor="address">
          City / Location (Optional)
        </label>
        <input
          id="address"
          type="text"
          value={data.address || ''}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="City, Country"
          className="form-input"
        />
      </div>

      {/* Waist Circumference Measurements */}
      <div className="wellness-card" style={{ backgroundColor: '#FAF8F0', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
              Waist Circumference (Optional)
            </h3>
            <p style={{ fontSize: '11px', color: '#6B7063' }}>Helps monitor visceral body composition</p>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['cm', 'inches'] as WaistUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => updateWaist('waistUnit', unit)}
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  backgroundColor: (data.waistCircumference.waistUnit || 'cm') === unit ? '#66734A' : '#E6E2CF',
                  color: (data.waistCircumference.waistUnit || 'cm') === unit ? '#FFFDF8' : '#6B7063',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '11px' }} htmlFor="atNaval">
              At Naval
            </label>
            <input
              id="atNaval"
              type="number"
              step="any"
              value={data.waistCircumference.atNaval !== null ? data.waistCircumference.atNaval : ''}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                updateWaist('atNaval', val);
              }}
              placeholder="0"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '11px' }} htmlFor="aboveNaval">
              Above Naval
            </label>
            <input
              id="aboveNaval"
              type="number"
              step="any"
              value={data.waistCircumference.aboveNaval !== null ? data.waistCircumference.aboveNaval : ''}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                updateWaist('aboveNaval', val);
              }}
              placeholder="0"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '11px' }} htmlFor="belowNaval">
              Below Naval
            </label>
            <input
              id="belowNaval"
              type="number"
              step="any"
              value={data.waistCircumference.belowNaval !== null ? data.waistCircumference.belowNaval : ''}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                updateWaist('belowNaval', val);
              }}
              placeholder="0"
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
