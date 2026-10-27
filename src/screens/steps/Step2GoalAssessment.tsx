import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Sparkles, Target, Check } from 'lucide-react';
import { SingleCardSelect, MultiCardSelect } from '../../components/common/CardSelect';
import { getAllGoalDefinitions } from '../../services/recommendationEngine';
import { renderGoalVectorIcon, IconCustomGoal } from '../../components/icons/GoalVectorIcons';
import type {
  GoalAssessment,
  GoalTimeline,
  GoalImportance,
  FitnessChallenge,
  NutritionistSupport,
  ActivityLevel,
} from '../../types/customer';
import type { CustomGoalItem, GoalDefinition } from '../../types/recommendations';

interface StepGoalAssessmentProps {
  data: GoalAssessment;
  onChange: (data: GoalAssessment) => void;
  errors: Record<string, string>;
  activityLevel?: ActivityLevel | '';
}

const TIMELINES: { value: GoalTimeline; label: string }[] = [
  { value: 'Less than 1 month', label: 'Less than 1 month' },
  { value: '1 – 3 months', label: '1 – 3 months' },
  { value: '3 – 6 months', label: '3 – 6 months' },
  { value: '6 – 12 months', label: '6 – 12 months' },
  { value: 'More than 1 year', label: 'More than 1 year' },
];

const IMPORTANCE_LEVELS: { value: GoalImportance; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'High', label: 'High' },
  { value: 'Very High', label: 'Very High' },
];

const CHALLENGES: { value: FitnessChallenge; label: string }[] = [
  { value: 'Motivation & Support', label: 'Motivation & Support' },
  { value: 'Discipline & Habits', label: 'Discipline & Habits' },
  { value: 'Training', label: 'Training & Consistency' },
  { value: 'Nutrition', label: 'Nutrition & Cravings' },
  { value: 'Work / Travel', label: 'Work Schedule & Travel' },
  { value: 'Other', label: 'Other' },
];

const SUPPORT_OPTIONS: { value: NutritionistSupport; label: string }[] = [
  { value: 'Personalized Diet Plan', label: 'Personalized Diet Plan' },
  { value: 'Meal Planning Guidance', label: 'Meal Planning Guidance' },
  { value: 'Nutritional Education', label: 'Nutritional Education' },
  { value: 'Weight Management Support', label: 'Weight Management Support' },
  { value: 'Habit Building', label: 'Habit Building & Routine' },
  { value: 'Accountability & Follow-ups', label: 'Accountability & Follow-ups' },
  { value: 'Lifestyle & Wellness Advice', label: 'Lifestyle & Wellness Advice' },
  { value: 'Supplement Guidance', label: 'Supplement Guidance' },
  { value: 'Other', label: 'Other' },
];

export const Step2GoalAssessment: React.FC<StepGoalAssessmentProps> = ({ 
  data, 
  onChange, 
  errors,
  activityLevel = 'Sedentary'
}) => {
  // Load dynamic database-driven goals
  const allDefinitions = useMemo(() => getAllGoalDefinitions().filter((g) => g.isActive), []);

  const isHighIntensity = activityLevel === 'Active at Gym' || 
                          activityLevel === "Extremely Active Player's" || 
                          activityLevel === 'Moderately Active' || 
                          activityLevel === 'Extremely Active';

  // Sort prioritized category first, then remaining
  const dynamicGoals = useMemo(() => {
    const primaryCategory = isHighIntensity ? 'MODERATE ACTIVITY / PERFORMANCE' : 'BEGINNER — SEDENTARY & LIGHTLY ACTIVE';
    
    return [...allDefinitions].sort((a, b) => {
      if (a.category === primaryCategory && b.category !== primaryCategory) return -1;
      if (a.category !== primaryCategory && b.category === primaryCategory) return 1;
      return a.priority - b.priority;
    });
  }, [allDefinitions, isHighIntensity]);

  // Custom Goal form state
  const [showCustomGoalForm, setShowCustomGoalForm] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customDetails, setCustomDetails] = useState<string>('');
  const [customFormError, setCustomFormError] = useState<string>('');

  const selectedPrimary = data.primaryGoals || [];

  const handleToggleGoal = (goalName: string) => {
    let updated: string[];
    if (selectedPrimary.includes(goalName)) {
      updated = selectedPrimary.filter((g) => g !== goalName);
    } else {
      updated = [...selectedPrimary, goalName];
    }
    onChange({ ...data, primaryGoals: updated });
  };

  const handleAddCustomGoal = () => {
    if (!customName.trim()) {
      setCustomFormError('Please enter a custom goal name');
      return;
    }
    if (!customDesc.trim()) {
      setCustomFormError('Please describe your custom goal');
      return;
    }

    const newCustomGoal: CustomGoalItem = {
      id: 'custom_' + Math.random().toString(36).substring(2, 9),
      name: customName.trim(),
      description: customDesc.trim(),
      additionalDetails: customDetails.trim() || undefined,
      createdAt: Date.now(),
    };

    const currentCustoms = data.customGoals || [];
    onChange({
      ...data,
      customGoals: [...currentCustoms, newCustomGoal],
      primaryGoals: selectedPrimary.includes(newCustomGoal.name) ? selectedPrimary : [...selectedPrimary, newCustomGoal.name],
    });

    setCustomName('');
    setCustomDesc('');
    setCustomDetails('');
    setCustomFormError('');
    setShowCustomGoalForm(false);
  };

  const handleRemoveCustomGoal = (id: string, name: string) => {
    const updatedCustoms = (data.customGoals || []).filter((g) => g.id !== id);
    const updatedPrimary = selectedPrimary.filter((g) => g !== name);
    onChange({
      ...data,
      customGoals: updatedCustoms,
      primaryGoals: updatedPrimary,
    });
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
            letterSpacing: '0.04em',
            marginBottom: '8px',
          }}
        >
          <Target size={13} color="#66734A" />
          <span>{isHighIntensity ? 'High-Performance Calibration' : 'Metabolic & Baseline Calibration'}</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Goals & Target Vision
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Select the health, performance, and body targets that reflect your ambition. Every goal triggers dedicated clinical protocols.
        </p>
      </div>

      {/* Purpose-Built Vector Icon Goal Selection Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            Select Key Goals <span style={{ color: '#C85A48' }}>*</span>
          </label>
          <span style={{ fontSize: '12px', color: '#66734A', fontWeight: 600 }}>
            {selectedPrimary.length} selected
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dynamicGoals.map((goal: GoalDefinition, index: number) => {
            const isSelected = selectedPrimary.includes(goal.name);
            const numberDisplay = index + 1;

            return (
              <div
                key={goal.id}
                role="button"
                tabIndex={0}
                onClick={() => handleToggleGoal(goal.name)}
                className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  backgroundColor: isSelected ? '#FAF8F0' : '#FFFDF8',
                  borderColor: isSelected ? '#66734A' : '#D9D8CC',
                  boxShadow: isSelected ? '0 4px 12px rgba(79, 92, 56, 0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                }}
              >
                {/* 1. Purpose-Built Semantic Vector Icon */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderGoalVectorIcon(goal.icon || goal.name, 48)}
                </div>

                {/* 2. Goal Details & Number */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isSelected ? '#66734A' : '#8A9568',
                        fontFamily: 'monospace',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? '#EEF4E8' : '#F4F2E8',
                      }}
                    >
                      #{numberDisplay}
                    </span>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: '#242820', margin: 0 }}>
                      {goal.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7063', margin: 0, lineHeight: 1.4 }}>
                    {goal.description}
                  </p>
                </div>

                {/* 3. Gold Selection Indicator / Checkbox */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '7px',
                    border: isSelected ? '2px solid #66734A' : '2px solid #D9D8CC',
                    backgroundColor: isSelected ? '#66734A' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected && <Check size={16} color="#FFFDF8" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Goals Bucket Container (Moved Down) */}
        {selectedPrimary.length > 0 && (
          <div
            className="wellness-card animate-fade-in"
            style={{
              padding: '14px 16px',
              backgroundColor: '#EEF4E8',
              border: '2px solid #66734A',
              marginTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(79, 92, 56, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="#38571A" />
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#38571A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Selected Goals Bucket ({selectedPrimary.length})
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#4F5C38', fontWeight: 700, backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #66734A' }}>
                ✓ Protocol Active
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedPrimary.map((name) => (
                <div
                  key={name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #66734A',
                    color: '#242820',
                    fontSize: '12px',
                    fontWeight: 700,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleGoal(name);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#C85A48',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 900,
                      fontSize: '14px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.primaryGoals && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.primaryGoals}
          </span>
        )}
      </div>

      {/* Custom Goals List (if added) */}
      {data.customGoals && data.customGoals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="form-label" style={{ marginBottom: '2px' }}>
            Your Custom Goals
          </label>
          {data.customGoals.map((cg) => (
            <div
              key={cg.id}
              className="wellness-card"
              style={{
                padding: '14px',
                backgroundColor: '#FAF8F0',
                border: '1.5px solid #66734A',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <IconCustomGoal size={48} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '14px', color: '#242820' }}>{cg.name}</strong>
                  <span style={{ fontSize: '10px', backgroundColor: '#EEF4E8', color: '#4F5C38', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    Custom Goal
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B7063', marginTop: '2px' }}>{cg.description}</p>
                {cg.additionalDetails && (
                  <p style={{ fontSize: '11px', color: '#8A9568', marginTop: '2px', fontStyle: 'italic' }}>
                    Notes: {cg.additionalDetails}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCustomGoal(cg.id, cg.name)}
                style={{ padding: '6px', color: '#C85A48', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                aria-label="Remove custom goal"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* + Add Custom Goal Button & Form */}
      <div>
        {!showCustomGoalForm ? (
          <button
            type="button"
            onClick={() => setShowCustomGoalForm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: '#FFFDF8',
              border: '1.5px dashed #66734A',
              color: '#4F5C38',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Plus size={16} />
            <span>+ Add Custom Goal</span>
          </button>
        ) : (
          <div
            className="wellness-card animate-fade-in"
            style={{
              padding: '18px',
              backgroundColor: '#FFFDF8',
              border: '1.5px solid #66734A',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#66734A" />
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#242820' }}>Create Custom Goal</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCustomGoalForm(false);
                  setCustomFormError('');
                }}
                style={{ fontSize: '12px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">
                Custom Goal Name <span style={{ color: '#C85A48' }}>*</span>
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Marathon Recovery, Football Agility..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Describe Your Goal <span style={{ color: '#C85A48' }}>*</span>
              </label>
              <textarea
                rows={2}
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="e.g. I want to improve recovery between heavy training sessions and prevent hamstring cramps."
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Additional Details <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Optional</span>
              </label>
              <input
                type="text"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="e.g. Playing matches every Saturday morning"
                className="form-input"
              />
            </div>

            {customFormError && (
              <span className="form-error-text">{customFormError}</span>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleAddCustomGoal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#66734A',
                  color: '#FFFDF8',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Custom Goal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Target Timeline */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Target Timeline <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={TIMELINES}
          value={data.goalTimeline}
          onChange={(val) => onChange({ ...data, goalTimeline: val })}
        />
        {errors.goalTimeline && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.goalTimeline}
          </span>
        )}
      </div>

      {/* Goal Importance */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Importance of this Goal <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={IMPORTANCE_LEVELS}
          value={data.goalImportance}
          onChange={(val) => onChange({ ...data, goalImportance: val })}
        />
        {errors.goalImportance && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.goalImportance}
          </span>
        )}
      </div>

      {/* Biggest Challenges */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Biggest Challenges
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Select all that apply</span>
        </label>
        <MultiCardSelect
          options={CHALLENGES}
          values={data.biggestFitnessChallenges || []}
          onChange={(vals) => onChange({ ...data, biggestFitnessChallenges: vals })}
        />
      </div>

      {/* Nutritionist Support Expectations */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Nutritionist Support Expectations
        </label>
        <MultiCardSelect
          options={SUPPORT_OPTIONS}
          values={data.nutritionistSupportExpectations || []}
          onChange={(vals) => onChange({ ...data, nutritionistSupportExpectations: vals })}
        />
      </div>
    </div>
  );
};
