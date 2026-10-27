import React, { useState } from 'react';

interface ProteinFatRequirementFormulaViewProps {
  initialWeight?: number;
  initialBodyFat?: number;
  initialIntensity?: number;
  clientName?: string;
  isEditable?: boolean;
}

export const ProteinFatRequirementFormulaView: React.FC<ProteinFatRequirementFormulaViewProps> = ({
  initialWeight = 70,
  initialBodyFat = 20,
  initialIntensity = 2.0,
  clientName = 'Client',
  isEditable = true,
}) => {
  const [weight, setWeight] = useState<number>(initialWeight);
  const [bodyFat, setBodyFat] = useState<number>(initialBodyFat);
  const [intensityFactor, setIntensityFactor] = useState<number>(initialIntensity);

  // Exact Formula Calculations from Reference Image
  // 1. Fat Mass (kg) = Body Weight * Body Fat % / 100
  const fatMassKg = parseFloat(((weight * bodyFat) / 100).toFixed(1));

  // 2. Fat-Free Mass (kg) = Body Weight - Fat Mass
  const fatFreeMassKg = parseFloat((weight - fatMassKg).toFixed(1));

  // 3. Total Protein Requirement (g) = Fat-Free Mass * Intensity Factor
  const totalProteinRequirementGrams = Math.round(fatFreeMassKg * intensityFactor);

  // 4. Fat Requirement (g) = Total Protein Requirement + 50 g
  const fatRequirementGrams = totalProteinRequirementGrams + 50;

  // 5. Total Protein + Fat Need (g) = Total Protein Requirement + 50 g Fat
  const totalProteinFatNeedGrams = fatRequirementGrams;

  // Energy conversions
  const proteinKcal = totalProteinRequirementGrams * 4;
  const fatKcal = fatRequirementGrams * 9;
  const combinedKcal = proteinKcal + fatKcal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#FFFDF8' }}>
      
      {/* =========================================================================
          PART 1: PROTEIN & FAT REQUIREMENT FORMULA (FROM USER IMAGE 1)
         ========================================================================= */}
      <div
        className="wellness-card"
        style={{
          padding: '18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '2px solid #0A1C44',
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
        }}
      >
        {/* Main Banner Header */}
        <div
          style={{
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CLINICAL METABOLIC FORMULA ENGINE
          </span>
          <h2 style={{ fontSize: '19px', fontWeight: 900, color: '#FFFFFF', margin: '2px 0 0', letterSpacing: '0.02em' }}>
            PROTEIN & FAT REQUIREMENT FORMULA
          </h2>
          {clientName && (
            <span style={{ fontSize: '11.5px', color: '#C8D6EC', marginTop: '2px', display: 'inline-block' }}>
              Patient Protocol Calibration: <strong>{clientName}</strong>
            </span>
          )}
        </div>

        {/* 5-Step Visual Flowchart Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          {/* Step 1: Fat Mass */}
          <div
            style={{
              padding: '10px 8px',
              borderRadius: '10px',
              border: '1.5px solid #2B6CB0',
              backgroundColor: '#EBF8FF',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2B6CB0', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                1
              </div>
              <strong style={{ fontSize: '11.5px', color: '#2B6CB0', textTransform: 'uppercase' }}>FAT MASS</strong>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>⚖️</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568' }}>Body Weight × Body Fat %</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#2B6CB0', marginTop: '2px' }}>
                = {fatMassKg} kg
              </div>
            </div>
          </div>

          {/* Step 2: Fat-Free Mass */}
          <div
            style={{
              padding: '10px 8px',
              borderRadius: '10px',
              border: '1.5px solid #2F855A',
              backgroundColor: '#F0FFF4',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2F855A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </div>
              <strong style={{ fontSize: '11.5px', color: '#2F855A', textTransform: 'uppercase' }}>FAT-FREE MASS</strong>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>🧍</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568' }}>Body Weight − Fat Mass</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#2F855A', marginTop: '2px' }}>
                = {fatFreeMassKg} kg
              </div>
            </div>
          </div>

          {/* Step 3: Total Protein Requirement */}
          <div
            style={{
              padding: '10px 8px',
              borderRadius: '10px',
              border: '1.5px solid #6B46C1',
              backgroundColor: '#FAF5FF',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#6B46C1', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                3
              </div>
              <strong style={{ fontSize: '11.5px', color: '#6B46C1', textTransform: 'uppercase' }}>TOTAL PROTEIN REQUIREMENT</strong>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>💪</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568' }}>Fat-Free Mass × Intensity</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#6B46C1', marginTop: '2px' }}>
                = {totalProteinRequirementGrams} g
              </div>
            </div>
          </div>

          {/* Step 4: Fat Requirement */}
          <div
            style={{
              padding: '10px 8px',
              borderRadius: '10px',
              border: '1.5px solid #DD6B20',
              backgroundColor: '#FFFAF0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DD6B20', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                4
              </div>
              <strong style={{ fontSize: '11.5px', color: '#DD6B20', textTransform: 'uppercase' }}>FAT REQUIREMENT</strong>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>💧</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568' }}>Total Protein + 50 g</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#DD6B20', marginTop: '2px' }}>
                = {fatRequirementGrams} g
              </div>
            </div>
          </div>

          {/* Step 5: Total Protein + Fat Need */}
          <div
            style={{
              padding: '10px 8px',
              borderRadius: '10px',
              border: '1.5px solid #E53E3E',
              backgroundColor: '#FFF5F5',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E53E3E', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                5
              </div>
              <strong style={{ fontSize: '11.5px', color: '#E53E3E', textTransform: 'uppercase' }}>TOTAL PROTEIN + FAT NEED</strong>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>🥑🥩</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568' }}>Total Protein + 50 g Fat</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#E53E3E', marginTop: '2px' }}>
                = {totalProteinFatNeedGrams} g
              </div>
            </div>
          </div>
        </div>

        {/* Live Patient Calibration Controls (If Editable) */}
        {isEditable && (
          <div
            style={{
              padding: '14px',
              backgroundColor: '#FAF8F0',
              borderRadius: '10px',
              border: '1px solid #E2DCC8',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong style={{ fontSize: '12.5px', color: '#242820', textTransform: 'uppercase' }}>
                ⚙️ Live Patient Biometric Inputs
              </strong>
              <span style={{ fontSize: '11px', color: '#38571A', fontWeight: 700 }}>
                Live Math Auto-Recalculates
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Body Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ fontSize: '12px', padding: '6px 8px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Body Fat %</label>
                <input
                  type="number"
                  step="0.5"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ fontSize: '12px', padding: '6px 8px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Intensity Level</label>
                <select
                  value={intensityFactor}
                  onChange={(e) => setIntensityFactor(parseFloat(e.target.value))}
                  className="form-select"
                  style={{ fontSize: '12px', padding: '6px 8px' }}
                >
                  <option value={1.5}>Sedentary (1.5x) - Little/No Exercise</option>
                  <option value={2.0}>Moderate (2.0x) - 3-5 days/week</option>
                  <option value={2.5}>High (2.5x) - Hard 6-7 days/week</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Formula Summary & Intensity Factor Guide Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          {/* Intensity Factor Table */}
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '1px solid #DEE2E6' }}>
            <strong style={{ fontSize: '12px', color: '#0A1C44', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Intensity Factor Guide
            </strong>
            <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse', marginTop: '8px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0A1C44', color: '#FFFFFF', textAlign: 'left' }}>
                  <th style={{ padding: '4px 8px', borderRadius: '4px 0 0 0' }}>INTENSITY</th>
                  <th style={{ padding: '4px 8px' }}>DESCRIPTION</th>
                  <th style={{ padding: '4px 8px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>FACTOR</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: intensityFactor === 1.5 ? '#EBF8FF' : '#FFFFFF', borderBottom: '1px solid #ECEAE0' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#2B6CB0' }}>🛋️ Sedentary</td>
                  <td style={{ padding: '6px 8px', color: '#4A5568' }}>Little / No Exercise</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 900, color: '#0A1C44' }}>1.5</td>
                </tr>
                <tr style={{ backgroundColor: intensityFactor === 2.0 ? '#F0FFF4' : '#FFFFFF', borderBottom: '1px solid #ECEAE0' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#2F855A' }}>🚶 Moderate</td>
                  <td style={{ padding: '6px 8px', color: '#4A5568' }}>Moderate Exercise (3–5 days/wk)</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 900, color: '#0A1C44' }}>2.0</td>
                </tr>
                <tr style={{ backgroundColor: intensityFactor === 2.5 ? '#FFF5F5' : '#FFFFFF' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#E53E3E' }}>🏃 High</td>
                  <td style={{ padding: '6px 8px', color: '#4A5568' }}>Hard / Intense Exercise (6–7 days/wk)</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 900, color: '#0A1C44' }}>2.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Example / Live Step Calculation */}
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FEF9E7', border: '1.5px solid #F9E79F' }}>
            <strong style={{ fontSize: '12px', color: '#7D6608', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Formula Math Breakdown
            </strong>
            <div style={{ fontSize: '11px', color: '#5D4037', marginTop: '6px', lineHeight: 1.6 }}>
              <div>• <strong>Fat Mass:</strong> {weight} kg × {bodyFat}% ÷ 100 = <strong>{fatMassKg} kg</strong></div>
              <div>• <strong>Fat-Free Mass:</strong> {weight} kg − {fatMassKg} kg = <strong>{fatFreeMassKg} kg</strong></div>
              <div>• <strong>Total Protein Req:</strong> {fatFreeMassKg} kg × {intensityFactor} = <strong>{totalProteinRequirementGrams} g</strong> ({proteinKcal} kcal)</div>
              <div>• <strong>Fat Requirement:</strong> {totalProteinRequirementGrams} g + 50 g = <strong>{fatRequirementGrams} g</strong> ({fatKcal} kcal)</div>
              <div>• <strong>Combined Daily Need:</strong> Total Protein Requirement + 50 g Fat = <strong>{totalProteinFatNeedGrams} g</strong> ({combinedKcal} kcal)</div>
            </div>
          </div>
        </div>

        {/* Clinical Note Callout */}
        <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#EBF8FF', border: '1px solid #BEE3F8', fontSize: '11px', color: '#2B6CB0' }}>
          💡 <strong>NOTE:</strong> Fat Requirement is always Total Protein Requirement + 50 g Fat. Adjust intensity factor based on patient's weekly training regimen.
        </div>
      </div>

      {/* =========================================================================
          PART 2: MACRONUTRIENTS – THE BASICS (FROM USER IMAGE 2)
         ========================================================================= */}
      <div
        className="wellness-card"
        style={{
          padding: '18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #D9D8CC',
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0A1C44', margin: 0, letterSpacing: '0.02em' }}>
            MACRONUTRIENTS – THE BASICS
          </h3>
          <div style={{ display: 'inline-flex', gap: '6px', marginTop: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2F855A' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DD6B20' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2B6CB0' }}></span>
          </div>
        </div>

        {/* 3 Large Pillars (Green, Orange, Blue) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          
          {/* Column 1: PROTEIN */}
          <div
            style={{
              borderRadius: '12px',
              border: '2px solid #38A169',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', backgroundColor: '#38A169', color: '#FFFFFF', textAlign: 'center', padding: '8px', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em' }}>
              PROTEIN
            </div>
            <div style={{ padding: '20px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '74px', height: '74px', borderRadius: '50%', border: '2.5px solid #38A169', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', backgroundColor: '#F0FFF4' }}>
                💪
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#22543D', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                BUILDS MUSCLES
              </h4>
            </div>
            <div style={{ width: '100%', padding: '6px 10px', backgroundColor: '#F0FFF4', borderTop: '1px solid #C6F6D5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#22543D' }}>
              <span>PROTEIN</span> ➔ <span>BUILDS MUSCLES</span>
            </div>
          </div>

          {/* Column 2: FAT */}
          <div
            style={{
              borderRadius: '12px',
              border: '2px solid #DD6B20',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', backgroundColor: '#DD6B20', color: '#FFFFFF', textAlign: 'center', padding: '8px', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em' }}>
              FAT
            </div>
            <div style={{ padding: '20px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '74px', height: '74px', borderRadius: '50%', border: '2.5px solid #DD6B20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', backgroundColor: '#FFFAF0' }}>
                💧
              </div>
              <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#7B341E', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.3 }}>
                SATURATED FATS FOR METABOLISM
              </h4>
            </div>
            <div style={{ width: '100%', padding: '6px 10px', backgroundColor: '#FFFAF0', borderTop: '1px solid #FEEBC8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#7B341E' }}>
              <span>FAT</span> ➔ <span>SATURATED FATS FOR METABOLISM</span>
            </div>
          </div>

          {/* Column 3: CARBOHYDRATES */}
          <div
            style={{
              borderRadius: '12px',
              border: '2px solid #3182CE',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', backgroundColor: '#3182CE', color: '#FFFFFF', textAlign: 'center', padding: '8px', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em' }}>
              CARBOHYDRATES
            </div>
            <div style={{ padding: '20px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '74px', height: '74px', borderRadius: '50%', border: '2.5px solid #3182CE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', backgroundColor: '#EBF8FF' }}>
                ⚡
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#2A4365', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                SOURCE OF ENERGY
              </h4>
            </div>
            <div style={{ width: '100%', padding: '6px 10px', backgroundColor: '#EBF8FF', borderTop: '1px solid #BEE3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#2A4365' }}>
              <span>CARBS</span> ➔ <span>SOURCE OF ENERGY</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
