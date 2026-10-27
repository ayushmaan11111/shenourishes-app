import React, { useMemo, useState } from 'react';
import { Sparkles, ShieldCheck, Info, Pill, Apple, BookOpen, Clock, X } from 'lucide-react';
import { evaluateGoalRecommendations } from '../../services/recommendationEngine';
import { renderSupplementVectorIcon } from '../../components/icons/SupplementVectorIcons';
import type { GeneratedRecommendation, RecommendationType } from '../../types/recommendations';
import type { CustomerRecord } from '../../types/customer';

interface StepRecommendedSupportProps {
  formData: CustomerRecord;
  onUpdateRecommendations: (recommendations: GeneratedRecommendation[]) => void;
}

export const StepRecommendedSupport: React.FC<StepRecommendedSupportProps> = ({
  formData,
  onUpdateRecommendations,
}) => {
  const selectedGoals = formData.goalAssessment.primaryGoals || [];
  const customGoals = formData.goalAssessment.customGoals || [];
  const activityLevel = formData.physicalActivity?.currentActivityLevel || '';
  const dietType = formData.dietaryNutrition?.dietType || '';

  // Generate deduplicated, dynamic recommendations based on database rules
  const recommendations = useMemo(() => {
    return evaluateGoalRecommendations(selectedGoals, customGoals, activityLevel, dietType);
  }, [selectedGoals, customGoals, activityLevel, dietType]);

  // Safely sync generated recommendations to parent state
  React.useEffect(() => {
    onUpdateRecommendations(recommendations);
  }, [recommendations, onUpdateRecommendations]);

  const [activeModalRec, setActiveModalRec] = useState<GeneratedRecommendation | null>(null);

  const getTypeBadgeStyle = (type: RecommendationType) => {
    switch (type) {
      case 'SUPPLEMENT':
        return { bg: '#EEF4E8', color: '#4F5C38', label: 'Supplement', icon: Pill };
      case 'DIET STRATEGY':
        return { bg: '#FDF0EE', color: '#C85A48', label: 'Diet Strategy', icon: Apple };
      case 'NUTRITION STRATEGY':
        return { bg: '#FAF4E4', color: '#997328', label: 'Nutrition Strategy', icon: Apple };
      case 'LIFESTYLE':
      case 'HYDRATION':
        return { bg: '#EBF4F6', color: '#2B6A78', label: 'Lifestyle Protocol', icon: BookOpen };
      default:
        return { bg: '#FAF8F0', color: '#6B7063', label: 'Clinical Strategy', icon: Sparkles };
    }
  };

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
            backgroundColor: '#EEF4E8',
            color: '#4F5C38',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          <Sparkles size={13} color="#66734A" />
          <span>Clinical Protocol Engine</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#242820', marginBottom: '4px' }}>
          RECOMMENDED SUPPORT
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Based on the goals selected, here are the recommended nutrition and supplement options.
        </p>
      </div>

      {/* Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          borderRadius: '14px',
          backgroundColor: '#FAF8F0',
          border: '1px solid #D9D8CC',
          fontSize: '12px',
          color: '#6B7063',
          lineHeight: 1.4,
        }}
      >
        <ShieldCheck size={18} color="#66734A" style={{ flexShrink: 0 }} />
        <span>
          These recommendations represent our evidence-based clinical baselines. Your assigned nutritionist will review and finalize your custom dosages during your 1-on-1 consultation.
        </span>
      </div>

      {/* Recommendations Card List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {recommendations.map((rec, index) => {
          const typeBadge = getTypeBadgeStyle(rec.type);
          const IconComp = typeBadge.icon;
          const numberDisplay = String(index + 1).padStart(2, '0');

          return (
            <div
              key={rec.id}
              className="wellness-card"
              style={{
                padding: '18px',
                backgroundColor: '#FFFDF8',
                border: '1px solid #D9D8CC',
                boxShadow: '0 2px 8px rgba(79, 92, 56, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Dedicated Supplement/Strategy Vector Illustration */}
                  <div style={{ flexShrink: 0 }}>
                    {renderSupplementVectorIcon(rec.name, 48)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#4F5C38',
                          fontFamily: 'monospace',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#F3EFE0',
                        }}
                      >
                        #{numberDisplay}
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#242820', margin: 0 }}>
                        {rec.name}
                      </h3>
                    </div>
                    <span style={{ fontSize: '11px', color: '#8A9568', fontWeight: 500 }}>
                      {rec.category}
                    </span>
                  </div>
                </div>

                {/* Type Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: typeBadge.bg,
                    color: typeBadge.color,
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={11} />
                  <span>{typeBadge.label}</span>
                </div>
              </div>

              {/* Recommended For Section */}
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#F8F6EF' }}>
                <div style={{ fontSize: '11px', color: '#6B7063', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '3px' }}>
                  Recommended For
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#242820' }}>
                  {rec.triggeredByGoals.join(' • ')}
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#6B7063', lineHeight: 1.45, margin: 0 }}>
                {rec.description}
              </p>

              {/* Action / View Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #F1EEDF' }}>
                {rec.timing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6B7063' }}>
                    <Clock size={12} color="#66734A" />
                    <span>{rec.timing}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalRec(rec)}
                  style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#66734A',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Info size={13} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {activeModalRec && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(36, 40, 32, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '420px', backgroundColor: '#FFFDF8', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {renderSupplementVectorIcon(activeModalRec.name, 44)}
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#66734A', textTransform: 'uppercase' }}>
                    {activeModalRec.type}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', marginTop: '2px', margin: 0 }}>
                    {activeModalRec.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalRec(null)}
                style={{ padding: '4px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
              <div>
                <strong style={{ color: '#242820' }}>Target Goals:</strong>
                <p style={{ color: '#6B7063', fontSize: '12px', marginTop: '2px', margin: 0 }}>
                  {activeModalRec.triggeredByGoals.join(', ')}
                </p>
              </div>

              <div>
                <strong style={{ color: '#242820' }}>Clinical Rationale:</strong>
                <p style={{ color: '#6B7063', fontSize: '12px', marginTop: '2px', lineHeight: 1.4, margin: 0 }}>
                  {activeModalRec.description}
                </p>
              </div>

              {activeModalRec.dosageOrProtocol && (
                <div>
                  <strong style={{ color: '#242820' }}>Standard Dosage / Protocol:</strong>
                  <p style={{ color: '#6B7063', fontSize: '12px', marginTop: '2px', margin: 0 }}>
                    {activeModalRec.dosageOrProtocol}
                  </p>
                </div>
              )}

              {activeModalRec.timing && (
                <div>
                  <strong style={{ color: '#242820' }}>Recommended Timing:</strong>
                  <p style={{ color: '#6B7063', fontSize: '12px', marginTop: '2px', margin: 0 }}>
                    {activeModalRec.timing}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setActiveModalRec(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
