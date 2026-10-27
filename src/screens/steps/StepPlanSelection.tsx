import React from 'react';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';
import type { PlanSelection } from '../../types/customer';

interface StepPlanSelectionProps {
  data?: PlanSelection;
  onChange: (data: PlanSelection) => void;
  errors: Record<string, string>;
}

export const SHE_NOURISHES_PLANS: PlanSelection[] = [
  {
    planId: 'plan_1m_kickstart',
    planName: '1-Month Reset & Kickstarter',
    duration: '1 Month (4 Weeks)',
    tagline: 'Initial metabolic reset and nutritional baseline establishment',
    features: [
      'Tailored Clinical Nutrition Plan',
      'Weekly 1-on-1 Nutritionist Follow-up',
      'Continuous In-App Messaging Support',
      'Personalized Hydration & Habit Milestones',
    ],
    isPopular: false,
  },
  {
    planId: 'plan_3m_transform',
    planName: '3-Month Comprehensive Transformation',
    duration: '3 Months (12 Weeks)',
    tagline: 'Our most popular plan for sustainable fat loss and metabolic healing',
    features: [
      'Full Body Recomposition & Hormonal Balance',
      'Weekly Diet Fine-Tuning & Metric Calibration',
      'Dedicated Senior Clinical Nutritionist',
      'Advanced Supplement Stack Formulation',
      'Lifestyle & Sleep Optimization Guidance',
    ],
    isPopular: true,
  },
  {
    planId: 'plan_6m_immersion',
    planName: '6-Month Lifestyle & Mastery Immersion',
    duration: '6 Months (24 Weeks)',
    tagline: 'Complete lifestyle remodeling and long-term health preservation',
    features: [
      'Long-Term Cellular & Metabolic Repair',
      'Bi-Weekly Comprehensive Body Metric Audits',
      'Priority Clinical Consultation Booking',
      'Lifelong Maintenance Blueprint & Re-entry Strategy',
    ],
    isPopular: false,
  },
];

export const StepPlanSelection: React.FC<StepPlanSelectionProps> = ({ data, onChange, errors }) => {
  const selectedPlanId = data?.planId || 'plan_3m_transform';

  const handleSelect = (plan: PlanSelection) => {
    onChange(plan);
  };

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
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          <Sparkles size={13} color="#66734A" />
          <span>Personalized Program</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Select Your Wellness Plan
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Choose the duration and depth of nutritionist support that matches your ambition.
        </p>
      </div>

      {errors.planSelection && (
        <div style={{ color: '#C85A48', fontSize: '13px' }}>
          {errors.planSelection}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {SHE_NOURISHES_PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.planId;
          return (
            <div
              key={plan.planId}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(plan)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(plan);
                }
              }}
              className={`wellness-card ${isSelected ? 'is-selected' : ''}`}
              style={{
                border: isSelected ? '2px solid #66734A' : '1px solid #D9D8CC',
                backgroundColor: isSelected ? '#F6F8F0' : '#FFFDF8',
                boxShadow: isSelected ? '0 6px 20px rgba(102, 115, 74, 0.16)' : '0 2px 8px rgba(79, 92, 56, 0.05)',
                cursor: 'pointer',
                position: 'relative',
                padding: '18px',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {plan.isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    backgroundColor: '#66734A',
                    color: '#FFFDF8',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(102, 115, 74, 0.3)',
                  }}
                >
                  RECOMMENDED
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820' }}>
                    {plan.planName}
                  </h3>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#66734A',
                      display: 'inline-block',
                      marginTop: '2px',
                    }}
                  >
                    {plan.duration}
                  </span>
                </div>

                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#66734A' : '#D9D8CC'}`,
                    backgroundColor: isSelected ? '#66734A' : '#FFFDF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFDF8',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#6B7063', marginBottom: '14px', lineHeight: 1.4 }}>
                {plan.tagline}
              </p>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {plan.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#242820' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#EEF4E8',
                        color: '#66734A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: '#FAF8F0',
          border: '1px solid #D9D8CC',
          fontSize: '12px',
          color: '#6B7063',
        }}
      >
        <ShieldCheck size={16} color="#66734A" style={{ flexShrink: 0 }} />
        <span>You will finalize your consultation schedule and payment during clinical onboarding.</span>
      </div>
    </div>
  );
};
