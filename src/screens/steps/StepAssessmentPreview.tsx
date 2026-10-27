import React from 'react';
import { 
  User, 
  Moon, 
  HeartHandshake, 
  Utensils, 
  Activity, 
  Flame, 
  Sparkles, 
  FileSpreadsheet, 
  Target, 
  Pencil, 
  ShieldCheck 
} from 'lucide-react';
import type { CustomerRecord } from '../../types/customer';

interface StepAssessmentPreviewProps {
  formData: CustomerRecord;
  onEditStep: (stepNumber: number) => void;
}

export const StepAssessmentPreview: React.FC<StepAssessmentPreviewProps> = ({
  formData,
  onEditStep,
}) => {
  const {
    personalDetails,
    lifestyleHealth,
    supportExpectations,
    dietaryNutrition,
    physicalActivity,
    commitment,
    planSelection,
    bloodTest,
    goalAssessment,
  } = formData;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: '#EEF4E8',
            color: '#4F5C38',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          <ShieldCheck size={13} color="#66734A" />
          <span>Final Verification</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Assessment Summary & Preview
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Review your answers below. If you wish to change any selection, tap <strong>Edit</strong> on that section.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. Personal Details */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4E8', color: '#66734A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>1. Personal Details</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Name:</span> <strong style={{ color: '#242820' }}>{personalDetails.fullName || '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Age:</span> <strong style={{ color: '#242820' }}>{personalDetails.age ? `${personalDetails.age} yrs` : '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Gender:</span> <strong style={{ color: '#242820' }}>{personalDetails.gender}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Mobile:</span> <strong style={{ color: '#242820' }}>{personalDetails.mobileNumber || '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Height:</span> <strong style={{ color: '#242820' }}>{personalDetails.height ? `${personalDetails.height} ${personalDetails.heightUnit}` : '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Weight:</span> <strong style={{ color: '#242820' }}>{personalDetails.weight ? `${personalDetails.weight} ${personalDetails.weightUnit}` : '—'}</strong></div>
          </div>
        </div>

        {/* 2. Lifestyle & Health (including Anxiety) */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FAF7EE', color: '#8A9568', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>2. Lifestyle, Sleep & Anxiety</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Sleep:</span> <strong style={{ color: '#242820' }}>{lifestyleHealth.sleepDuration || '—'} ({lifestyleHealth.sleepQuality} quality)</strong></div>
            <div><span style={{ color: '#6B7063' }}>Stress Level:</span> <strong style={{ color: '#242820' }}>{lifestyleHealth.stressLevel || '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Anxiety Level:</span> <strong style={{ color: '#242820' }}>{lifestyleHealth.anxietyLevel || '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Digestive Concerns:</span> <strong style={{ color: '#242820' }}>{lifestyleHealth.digestiveIssues?.join(', ') || 'None'}</strong></div>
          </div>
        </div>

        {/* 3. Support & Expectations */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4E8', color: '#4F5C38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartHandshake size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>3. Support & Communication</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Preferred Contact:</span> <strong style={{ color: '#242820' }}>{supportExpectations.preferredContactMethod || '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Program Support:</span> <strong style={{ color: '#242820' }}>{supportExpectations.programSupport?.join(', ') || '—'}</strong></div>
          </div>
        </div>

        {/* 4. Dietary & Nutrition */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FAF8F0', color: '#718653', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>4. Dietary & Nutrition Habits</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Diet Type:</span> <strong style={{ color: '#242820' }}>{dietaryNutrition.dietType}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Water Intake:</span> <strong style={{ color: '#242820' }}>{dietaryNutrition.dailyWaterIntake}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Daily Meals:</span> <strong style={{ color: '#242820' }}>{dietaryNutrition.dailyMeals}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Allergies:</span> <strong style={{ color: '#242820' }}>{dietaryNutrition.hasFoodAllergies ? dietaryNutrition.foodAllergiesOrIntolerances || 'Yes' : 'None'}</strong></div>
          </div>
        </div>

        {/* 5. Physical Activity */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4E8', color: '#66734A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>5. Activity Persona & Frequency</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Activity Level:</span> <strong style={{ color: '#242820' }}>{physicalActivity.currentActivityLevel} ({physicalActivity.calculatedIntensity || 1.5} Intensity • {physicalActivity.activityTrait || 'Low at energy'})</strong></div>
            <div><span style={{ color: '#6B7063' }}>Exercise Days:</span> <strong style={{ color: '#242820' }}>{physicalActivity.realisticExerciseDaysPerWeek || '—'}</strong></div>
            <div><span style={{ color: '#6B7063' }}>Exercise Types:</span> <strong style={{ color: '#242820' }}>{physicalActivity.preferredExerciseTypes?.join(', ') || 'None / Sedentary'}</strong></div>
          </div>
        </div>

        {/* 6. Commitment */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FDF0EE', color: '#C85A48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>6. Mindset & Commitment</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(6)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Commitment Level:</span> <strong style={{ color: '#242820' }}>{commitment.commitmentLevel || '—'}</strong></div>
          </div>
        </div>

        {/* 7. Selected Plan */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8', border: '1.5px solid #66734A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#66734A', color: '#FFFDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>7. Selected Wellness Plan</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(7)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Change Plan</span>
            </button>
          </div>
          <div style={{ fontSize: '13px' }}>
            <strong style={{ color: '#242820' }}>{planSelection?.planName || '3-Month Comprehensive Transformation'}</strong>
            <div style={{ fontSize: '12px', color: '#66734A', fontWeight: 600, marginTop: '2px' }}>{planSelection?.duration || '3 Months (12 Weeks)'}</div>
          </div>
        </div>

        {/* 8. Blood Test */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FDF0EE', color: '#C85A48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>8. Blood Test & Biomarkers</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(8)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div><span style={{ color: '#6B7063' }}>Report Status:</span> <strong style={{ color: '#242820' }}>{bloodTest?.reportStatus || 'Not at this time'}</strong></div>
            {bloodTest?.biomarkersChecked && bloodTest.biomarkersChecked.length > 0 && (
              <div><span style={{ color: '#6B7063' }}>Markers Checked:</span> <strong style={{ color: '#242820' }}>{bloodTest.biomarkersChecked.join(', ')}</strong></div>
            )}
            {bloodTest?.knownAbnormalitiesNotes && (
              <div><span style={{ color: '#6B7063' }}>Remarks:</span> <em style={{ color: '#242820' }}>{bloodTest.knownAbnormalitiesNotes}</em></div>
            )}
          </div>
        </div>

        {/* 9. Welcome Gift & Bonus Perk */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FAF6D9', color: '#6B5418', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>9. Exclusive Welcome Gift</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(9)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            <strong style={{ color: '#242820' }}>
              {formData.welcomeGift?.giftTitle || 'Complimentary Senior Clinical Consultation'}
            </strong>
            <span style={{ color: '#38571A', fontSize: '11.5px', fontWeight: 600 }}>
              Active Client Bonus Perk Unlocked
            </span>
          </div>
        </div>

        {/* 10. Goals & Vision */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8', border: '1.5px solid #66734A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4E8', color: '#4F5C38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={15} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>10. Goals & Target Vision</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(10)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#6B7063' }}>Timeline:</span> <strong style={{ color: '#242820' }}>{goalAssessment.goalTimeline || '—'}</strong></div>
              <div><span style={{ color: '#6B7063' }}>Priority:</span> <strong style={{ color: '#242820' }}>{goalAssessment.goalImportance || '—'}</strong></div>
            </div>

            {/* Selected Goals Bucket Container in Preview */}
            {goalAssessment.primaryGoals && goalAssessment.primaryGoals.length > 0 && (
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#EEF4E8',
                  borderRadius: '8px',
                  border: '1px solid #66734A',
                  marginTop: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#38571A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Selected Goals Bucket ({goalAssessment.primaryGoals.length})
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#4F5C38', fontWeight: 700 }}>
                    Active Protocols Loaded
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {goalAssessment.primaryGoals.map((goalName, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #66734A',
                        color: '#242820',
                        fontSize: '11.5px',
                        fontWeight: 700,
                      }}
                    >
                      • {goalName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {goalAssessment.customGoals && goalAssessment.customGoals.length > 0 && (
              <div>
                <span style={{ color: '#6B7063' }}>Custom Goals:</span>{' '}
                <strong style={{ color: '#66734A' }}>
                  {goalAssessment.customGoals.map((c) => c.name).join(', ')}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* 11. Recommended Support */}
        {goalAssessment.generatedRecommendations && goalAssessment.generatedRecommendations.length > 0 && (
          <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8', border: '1.5px solid #D6CEB2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F3EFE0', color: '#4F5C38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={15} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>11. Recommended Nutrition & Supplements</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(11)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#66734A', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0', border: '1px solid #D9D8CC' }}
              >
                <Pencil size={12} />
                <span>Review</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {goalAssessment.generatedRecommendations.map((rec, i) => (
                <div key={rec.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', backgroundColor: '#FAF8F0' }}>
                  <div>
                    <strong style={{ color: '#242820' }}>{rec.name}</strong>
                    <div style={{ fontSize: '11px', color: '#6B7063' }}>For: {rec.triggeredByGoals.join(' • ')}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#4F5C38' }}>
                    {rec.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
