import React from 'react';
import { MultiCardSelect, SingleCardSelect } from '../../components/common/CardSelect';
import type {
  PhysicalActivity,
  PreferredExerciseType,
  ActivityLevel,
  WorkoutIntensity,
  WorkoutDuration,
  RealisticExerciseDays,
} from '../../types/customer';

interface StepPhysicalActivityProps {
  data: PhysicalActivity;
  onChange: (data: PhysicalActivity) => void;
  errors: Record<string, string>;
}

const EXERCISE_TYPES: { value: PreferredExerciseType; label: string; description?: string }[] = [
  { value: 'None / Sedentary', label: 'None / Just Starting Out', description: 'Currently not engaging in regular structured workouts' },
  { value: 'Strength Training', label: 'Strength Training', description: 'Bodyweight or resistance exercises' },
  { value: 'Weight Training', label: 'Weight Training / Gym Workouts', description: 'Dumbbells, barbells, or gym machinery' },
  { value: 'Cardio', label: 'Cardio & Aerobics', description: 'HIIT, cycling, brisk walking, treadmill' },
  { value: 'Yoga', label: 'Yoga & Mobility', description: 'Flexibility, vinyasa, restorative yoga' },
  { value: 'Pilates', label: 'Pilates / Reformer', description: 'Core stabilization & posture alignment' },
  { value: 'Jogging / Running', label: 'Jogging / Running', description: 'Outdoor or track running' },
  { value: 'Sports', label: 'Sports / Athletics', description: 'Badminton, swimming, tennis, soccer, etc.' },
  { value: 'Other', label: 'Other Active Pursuits', description: 'Martial arts, dance, hiking, etc.' },
];

const ACTIVITY_LEVELS: { 
  value: ActivityLevel; 
  label: string; 
  description: string;
  intensity: number;
  trait: string;
}[] = [
  { 
    value: 'Sedentary', 
    label: 'Sedentary (Desk Job / Little Movement)', 
    description: '1.5 Intensity • Low at energy focus',
    intensity: 1.5,
    trait: 'Low at energy'
  },
  { 
    value: 'Beginner at Gym', 
    label: 'Beginner at Gym (Lightly Active)', 
    description: '1.5 Intensity • Low at energy baseline',
    intensity: 1.5,
    trait: 'Low at energy'
  },
  { 
    value: 'Active at Gym', 
    label: 'Active at Gym (Moderately Active)', 
    description: '2.0 Intensity • Muscle gain focus',
    intensity: 2.0,
    trait: 'Muscle gain'
  },
  { 
    value: "Extremely Active Player's", 
    label: "Extremely Active Player's (High Performance / Athlete)", 
    description: '2.5 Intensity • Extra kick focus',
    intensity: 2.5,
    trait: 'Extra kick'
  },
];

const WORKOUT_INTENSITIES: { value: WorkoutIntensity; label: string; description: string }[] = [
  { value: 'Low', label: 'Low Intensity', description: 'Comfortable, conversational pace' },
  { value: 'Moderate', label: 'Moderate Intensity', description: 'Elevated heart rate & light sweat' },
  { value: 'High', label: 'High Intensity', description: 'Challenging, breathless exertion' },
];

const WORKOUT_DURATIONS: { value: WorkoutDuration; label: string }[] = [
  { value: 'Less than 30 min', label: 'Less than 30 min' },
  { value: '30 – 45 min', label: '30 – 45 min' },
  { value: '45 – 60 min', label: '45 – 60 min' },
  { value: '60 – 90 min', label: '60 – 90 min' },
  { value: 'More than 90 min', label: 'More than 90 min' },
];

const EXERCISE_DAYS: { value: RealisticExerciseDays; label: string }[] = [
  { value: '2 Days', label: '2 Days / week' },
  { value: '3 Days', label: '3 Days / week' },
  { value: '4 Days', label: '4 Days / week' },
  { value: '5 Days', label: '5 Days / week' },
  { value: '6 Days', label: '6 Days / week' },
  { value: '7 Days', label: '7 Days / week' },
];

export const Step6PhysicalActivity: React.FC<StepPhysicalActivityProps> = ({ data, onChange, errors }) => {
  const handleActivityLevelChange = (val: ActivityLevel) => {
    const selected = ACTIVITY_LEVELS.find((l) => l.value === val);
    onChange({
      ...data,
      currentActivityLevel: val,
      calculatedIntensity: selected?.intensity || 1.5,
      activityTrait: selected?.trait || 'Low at energy',
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#242820', marginBottom: '4px' }}>
          Physical Activity & Movement
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7063' }}>
          Your activity level calibrates your daily caloric burn, macro distribution, and goal suggestions.
        </p>
      </div>

      {/* Current Activity Level */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Current Activity Level <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={ACTIVITY_LEVELS}
          value={data.currentActivityLevel}
          onChange={handleActivityLevelChange}
        />
        {errors.currentActivityLevel && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.currentActivityLevel}
          </span>
        )}
      </div>

      {/* Realistic Exercise Days Per Week */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Realistic Exercise Days per Week <span style={{ color: '#C85A48' }}>*</span>
        </label>
        <SingleCardSelect
          options={EXERCISE_DAYS}
          value={data.realisticExerciseDaysPerWeek}
          onChange={(val) => onChange({ ...data, realisticExerciseDaysPerWeek: val })}
        />
        {errors.realisticExerciseDaysPerWeek && (
          <span className="form-error-text" style={{ marginTop: '6px' }}>
            {errors.realisticExerciseDaysPerWeek}
          </span>
        )}
      </div>

      {/* Preferred Exercise Types */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Types of Physical Activity & Movement
          <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 400 }}>Select all that apply</span>
        </label>
        <MultiCardSelect
          options={EXERCISE_TYPES}
          values={data.preferredExerciseTypes || []}
          noneOptionValue="None / Sedentary"
          onChange={(vals) => onChange({ ...data, preferredExerciseTypes: vals })}
        />
      </div>

      {/* Usual Workout Intensity */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Preferred / Usual Workout Intensity
        </label>
        <SingleCardSelect
          options={WORKOUT_INTENSITIES}
          value={data.usualWorkoutIntensity}
          onChange={(val) => onChange({ ...data, usualWorkoutIntensity: val })}
        />
      </div>

      {/* Usual Workout Duration */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Usual Workout Session Duration
        </label>
        <SingleCardSelect
          options={WORKOUT_DURATIONS}
          value={data.usualWorkoutDuration}
          onChange={(val) => onChange({ ...data, usualWorkoutDuration: val })}
        />
      </div>
    </div>
  );
};
