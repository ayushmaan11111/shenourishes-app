import React, { useState } from 'react';
import { ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';

interface MacronutrientEducationDiagramProps {
  dietType?: 'VEGETARIAN' | 'NON-VEGETARIAN' | 'EGGETARIAN' | 'VEGAN' | 'OTHER' | '';
}

export const MacronutrientEducationDiagram: React.FC<MacronutrientEducationDiagramProps> = ({
  dietType = 'VEGETARIAN',
}) => {
  const isNonVeg = dietType === 'NON-VEGETARIAN' || dietType === 'EGGETARIAN';
  const [activeTab, setActiveTab] = useState<'flow' | 'sources' | 'macros'>('flow');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div
      className="wellness-card animate-fade-in"
      style={{
        padding: '16px',
        backgroundColor: '#FFFDF8',
        borderRadius: '14px',
        border: `1.5px solid ${isNonVeg ? '#F0C2C8' : '#CCE2BF'}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        marginTop: '12px',
      }}
    >
      {/* Top Header with Diet Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: isNonVeg ? '#FDF0EE' : '#EEF4E8',
              color: isNonVeg ? '#C85A48' : '#38571A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            {isNonVeg ? '🍗' : '🥬'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#242820', margin: 0 }}>
                {isNonVeg ? 'Non-Veg Macronutrient & Metabolism Blueprint' : 'Vegetarian Macronutrient & Metabolism Blueprint'}
              </h3>
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  backgroundColor: isNonVeg ? '#FDF0EE' : '#EEF4E8',
                  color: isNonVeg ? '#C85A48' : '#38571A',
                }}
              >
                {isNonVeg ? 'NON-VEG PROTOCOL' : '100% VEG PROTOCOL'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#6B7063', margin: '2px 0 0' }}>
              Clinical guide on energy expenditure, glycogen storage, and fat formation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6B7063',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F4F2E8', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('flow')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                backgroundColor: activeTab === 'flow' ? '#0A1C44' : 'transparent',
                color: activeTab === 'flow' ? '#FFFFFF' : '#4F5C38',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🔄 Carbohydrate ➔ Fat Flowchart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sources')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                backgroundColor: activeTab === 'sources' ? '#0A1C44' : 'transparent',
                color: activeTab === 'sources' ? '#FFFFFF' : '#4F5C38',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isNonVeg ? '🥩 Complete Protein & Healthy Fats' : '🌱 Plant Protein & Healthy Fats'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('macros')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                backgroundColor: activeTab === 'macros' ? '#0A1C44' : 'transparent',
                color: activeTab === 'macros' ? '#FFFFFF' : '#4F5C38',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ⚖️ Macro Energy Values
            </button>
          </div>

          {/* =========================================================================
              VIEW 1: CARBOHYDRATE STORAGE & FAT FORMATION FLOWCHART (DIAGRAM)
             ========================================================================= */}
          {activeTab === 'flow' && (
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#FAF9F4',
                border: '1px solid #E6E2CF',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#C85A48', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Fat, Protein & Carbohydrates Metabolism Flow
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#0A1C44', margin: '2px 0 0' }}>
                  How Excess Carbohydrates Become Body Fat
                </h4>
              </div>

              {/* Visual Interactive Flowchart Tree */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {/* 1. High Carbohydrate Intake */}
                <div
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#E8F1FC',
                    border: '1.5px solid #A2C4EE',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🍚🍞</span>
                  <strong style={{ fontSize: '12.5px', color: '#0F3E7A' }}>HIGH CARBOHYDRATE INTAKE</strong>
                </div>

                <ArrowDown size={18} color="#0F3E7A" />

                {/* 2. Liver Glycogen Storage */}
                <div
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#FDEEE9',
                    border: '1.5px solid #F6B8A7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🫀</span>
                  <div>
                    <strong style={{ fontSize: '12.5px', color: '#8F2610' }}>LIVER</strong>
                    <div style={{ fontSize: '10.5px', color: '#B24227' }}>Stores as Glycogen (Limited Capacity)</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7063' }}>Storage Full?</div>

                {/* Branch 1: Liver Storage Full Check */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '520px' }}>
                  {/* NO Branch */}
                  <div
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#FDF0EE',
                      border: '1px solid #F5C6CB',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#C85A48', color: '#FFFFFF' }}>
                      NO
                    </span>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#721C24', marginTop: '4px' }}>
                      Stored in Liver as Glycogen
                    </div>
                  </div>

                  {/* YES Branch -> Sent to Muscles */}
                  <div
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF9E7',
                      border: '1.5px solid #F9E79F',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#28A745', color: '#FFFFFF' }}>
                      YES
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px' }}>💪</span>
                      <strong style={{ fontSize: '11.5px', color: '#7D6608' }}>SENT TO MUSCLES</strong>
                    </div>
                    <div style={{ fontSize: '10px', color: '#9A7D0A' }}>(Limited Muscle Storage)</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7063', marginTop: '2px' }}>Muscles Full?</div>

                {/* Branch 2: Muscles Full Check */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '520px' }}>
                  {/* NO Branch -> Used for Energy */}
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: '#EDE7F6',
                      border: '1px solid #D1C4E9',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#6F42C1', color: '#FFFFFF' }}>
                      NO
                    </span>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#4A148C', marginTop: '4px' }}>
                      ⚡ Used for Immediate Physical Energy
                    </div>
                  </div>

                  {/* YES Branch -> CONVERTED TO FAT */}
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: '#FFF3CD',
                      border: '2px solid #ECC94B',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(236, 201, 75, 0.25)',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#D97706', color: '#FFFFFF' }}>
                      YES
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '14px' }}>🟡</span>
                      <strong style={{ fontSize: '12px', color: '#975A16' }}>CONVERTED TO FAT</strong>
                    </div>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#B7791F' }}>
                      Stored in Adipose Fat Tissues
                    </div>
                  </div>
                </div>
              </div>

              {/* Flowchart Summary Banner */}
              <div
                style={{
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF9E7',
                  border: '1px solid #F9E79F',
                  textAlign: 'center',
                }}
              >
                <strong style={{ fontSize: '12px', color: '#7D6608', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  — SUMMARY METABOLIC LAW —
                </strong>
                <p style={{ fontSize: '11.5px', color: '#5D4037', margin: '4px 0 6px', lineHeight: 1.4 }}>
                  When carbohydrates are in excess and cannot be stored in liver or muscles, they are <strong>converted to triglycerides & fat</strong> and stored in adipose tissues.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#0A1C44' }}>
                  <span>Excess Carbs</span> ➔ <span>Liver Full</span> ➔ <span>Muscles Full</span> ➔ <span style={{ color: '#D97706', fontWeight: 900 }}>Stored as Fat</span>
                </div>
              </div>

              <div style={{ fontSize: '10.5px', color: '#6B7063', textAlign: 'center', fontStyle: 'italic' }}>
                Note: Balanced intake and regular clinical activity prevent excess fat accumulation.
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: VEG VS NON-VEG SPECIFIC FOOD SOURCES (PROTEIN & HEALTHY FATS)
             ========================================================================= */}
          {activeTab === 'sources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Protein Sources Box */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: isNonVeg ? '#FDF0EE' : '#EEF4E8',
                  border: `1.5px solid ${isNonVeg ? '#F5C6CB' : '#B8D4A8'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{isNonVeg ? '🍗' : '🌱'}</span>
                    <strong style={{ fontSize: '13px', color: isNonVeg ? '#C85A48' : '#38571A', textTransform: 'uppercase' }}>
                      {isNonVeg ? 'Complete Protein Sources (Non-Veg)' : 'Second Class Protein Sources (Plant-Based)'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: isNonVeg ? '#C85A48' : '#38571A', color: '#FFFFFF' }}>
                    {isNonVeg ? '100% Bioavailable Amino Acids' : 'Combine with grains for full spectrum'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px' }}>
                  {isNonVeg ? (
                    <>
                      {['Eggs (Whole & Whites)', 'Chicken Breast', 'Mutton (Lean)', 'Fish (Salmon/Rohu)', 'Prawns', 'Crab', 'Tuna', 'Chicken Salami'].map((item) => (
                        <div key={item} style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #F5C6CB', fontSize: '11px', fontWeight: 600, color: '#721C24' }}>
                          • {item}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {['Moong Dal', 'Masoor Dal', 'Urad Dal', 'Chana (Chickpeas)', 'Rajma (Kidney Beans)', 'Tofu (Soybean)', 'Tempeh', 'Paneer (Dairy)', 'Besan (Gram Flour)', 'Oats', 'Quinoa'].map((item) => (
                        <div key={item} style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #B8D4A8', fontSize: '11px', fontWeight: 600, color: '#2B4214' }}>
                          • {item}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Unsaturated Healthy Fat Sources Box */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#FFF8E7',
                  border: '1.5px solid #F9E79F',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🥑</span>
                    <strong style={{ fontSize: '13px', color: '#7D6608', textTransform: 'uppercase' }}>
                      Unsaturated Fat Sources (Not Ghee)
                    </strong>
                  </div>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#D97706', color: '#FFFFFF' }}>
                    Essential Healthy Fatty Acids
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px' }}>
                  {['Peanuts', 'Sesame Seeds', 'Flax Seeds', 'Chia Seeds', 'Sunflower Seeds', 'Pumpkin Seeds', 'Walnuts', 'Almonds', 'Extra Virgin Olive Oil', 'Cold-Pressed Mustard Oil'].map((item) => (
                    <div key={item} style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #F9E79F', fontSize: '11px', fontWeight: 600, color: '#7D6608' }}>
                      • {item}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '10.5px', color: '#856404', marginTop: '8px' }}>
                  💡 <strong>Clinical Tip:</strong> Provides essential omegas, protects organs, cushions joints, and enables fat-soluble vitamin (A, D, E, K) absorption.
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: EXACT MACRONUTRIENT ENERGY & USES
             ========================================================================= */}
          {activeTab === 'macros' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
              {/* Protein Card */}
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#EEF4E8', border: '1.5px solid #B8D4A8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '12.5px', color: '#38571A' }}>PROTEIN</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#38571A', color: '#FFFFFF' }}>
                    1g = 4 kcal
                  </span>
                </div>
                <ul style={{ margin: '8px 0 0', paddingLeft: '16px', fontSize: '11px', color: '#2B4214', lineHeight: 1.45 }}>
                  <li>Muscle Building & repair</li>
                  <li>Muscle Contraction</li>
                  <li>Skin & cellular repair</li>
                  <li>Enzymes & hormone production</li>
                </ul>
              </div>

              {/* Fat Card */}
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FFF3E0', border: '1.5px solid #FFE0B2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '12.5px', color: '#E65100' }}>FAT</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#E65100', color: '#FFFFFF' }}>
                    1g = 9 kcal
                  </span>
                </div>
                <ul style={{ margin: '8px 0 0', paddingLeft: '16px', fontSize: '11px', color: '#BF360C', lineHeight: 1.45 }}>
                  <li>Primary energy storage</li>
                  <li>Vitamin absorption (A, D, E, K)</li>
                  <li>Hormone production</li>
                  <li>Protects organs & insulation</li>
                </ul>
              </div>

              {/* Carbs Card */}
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#E3F2FD', border: '1.5px solid #BBDEFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '12.5px', color: '#1565C0' }}>CARBOHYDRATES</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#1565C0', color: '#FFFFFF' }}>
                    1g = 4 kcal
                  </span>
                </div>
                <ul style={{ margin: '8px 0 0', paddingLeft: '16px', fontSize: '11px', color: '#0D47A1', lineHeight: 1.45 }}>
                  <li>Primary brain & body fuel</li>
                  <li>Limited liver & muscle storage</li>
                  <li>Excess converted to Triglycerides</li>
                  <li>Stored in adipose fat tissue</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
