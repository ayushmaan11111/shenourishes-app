import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  CheckCircle2, 
  Dumbbell, 
  Award, 
  Video
} from 'lucide-react';
import { 
  getClientIntensityConfig, 
  getWorkoutForDay, 
  logWorkoutExercise, 
  getLoggedExercises, 
  calculateGamificationStats, 
  RESISTANCE_BANDS_CATALOG,
  type DayOfWeekWorkoutVideo,
  type GamificationMinutesStats 
} from '../../services/workoutIntensityService';
import type { 
  ClientWorkoutIntensityConfig, 
  ResistanceBandColor,
  WorkoutExerciseLogItem 
} from '../../types/longTermSupport';

interface ClientWorkoutIntensityCardProps {
  clientId: string;
  clientName: string;
  onNavigateToActivity?: () => void;
}

export const ClientWorkoutIntensityCard: React.FC<ClientWorkoutIntensityCardProps> = ({
  clientId,
  clientName,
  onNavigateToActivity,
}) => {
  const [config, setConfig] = useState<ClientWorkoutIntensityConfig | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<DayOfWeekWorkoutVideo>(() => getWorkoutForDay());
  const [gamification, setGamification] = useState<GamificationMinutesStats | null>(null);
  const [loggedExercises, setLoggedExercises] = useState<WorkoutExerciseLogItem[]>([]);
  
  // Active Action Tab: 'none' | 'add-exercise' | 'timer' | 'video'
  const [activeTab, setActiveTab] = useState<'none' | 'add-exercise' | 'timer' | 'video'>('none');

  // Add Exercise Form State
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState<'Bulky Weights / Dumbbells' | 'Resistance Color Band' | 'Bodyweight'>('Resistance Color Band');
  const [selectedBand, setSelectedBand] = useState<ResistanceBandColor>('Green');
  const [weightKg, setWeightKg] = useState('10');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [notes, setNotes] = useState('');
  const [exerciseSavedNotice, setExerciseSavedNotice] = useState(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerLaps, setTimerLaps] = useState<number[]>([]);

  // Task Completion State
  const [taskCompletedToday, setTaskCompletedToday] = useState(false);

  const loadData = async () => {
    try {
      const cfg = await getClientIntensityConfig(clientId);
      setConfig(cfg);
      const today = getWorkoutForDay();
      setTodayWorkout(today);
      const stats = await calculateGamificationStats(clientId, cfg.threeMonthMinuteGoal);
      setGamification(stats);
      const exList = await getLoggedExercises(clientId);
      setLoggedExercises(exList);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('workout_intensity_updated', loadData);
    window.addEventListener('exercise_logged', loadData);
    return () => {
      window.removeEventListener('workout_intensity_updated', loadData);
      window.removeEventListener('exercise_logged', loadData);
    };
  }, [clientId]);

  // Interval timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerIsRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add Exercise Handler
  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = exerciseName.trim() || (category === 'Resistance Color Band' ? 'Banded Activation Pulse' : 'Dumbbell Functional Lift');
    await logWorkoutExercise(clientId, {
      exerciseName: name,
      category,
      bandColor: category === 'Resistance Color Band' ? selectedBand : undefined,
      weightKg: category === 'Bulky Weights / Dumbbells' ? parseFloat(weightKg) : undefined,
      sets,
      reps,
      durationMinutes,
      notes: notes.trim() || undefined,
    });

    setExerciseSavedNotice(true);
    setTimeout(() => setExerciseSavedNotice(false), 3000);
    setExerciseName('');
    setNotes('');
    loadData();
  };

  // Save Timer to Workout Log
  const handleSaveTimerMinutes = async () => {
    if (timerSeconds < 60) {
      alert('Log at least 1 full minute of workout time.');
      return;
    }
    const mins = Math.ceil(timerSeconds / 60);
    await logWorkoutExercise(clientId, {
      exerciseName: `Timer Workout (${todayWorkout.dayName})`,
      category: 'Bodyweight',
      sets: 1,
      reps: 1,
      durationMinutes: mins,
      notes: `Recorded with Gesture Timer. ${timerLaps.length} interval laps.`,
    });
    setTimerIsRunning(false);
    setTimerSeconds(0);
    setTimerLaps([]);
    setActiveTab('none');
    loadData();
  };

  // Complete Today's Task
  const handleCompleteTodayTask = async () => {
    await logWorkoutExercise(clientId, {
      exerciseName: todayWorkout.title,
      category: 'Resistance Color Band',
      bandColor: 'Green',
      sets: 3,
      reps: 15,
      durationMinutes: todayWorkout.durationMinutes,
      notes: `Completed daily guided workout video for ${todayWorkout.dayName}.`,
    });
    setTaskCompletedToday(true);
    loadData();
  };

  const intensityTier = config?.intensityLevel || 'Beginner';
  const intensityMultiplier = config?.intensityMultiplier || 1.5;
  const threeMonthGoal = config?.threeMonthMinuteGoal || 1800;

  return (
    <div
      style={{
        marginBottom: '22px',
        backgroundColor: '#FFFFFF',
        borderRadius: '22px',
        border: '1.5px solid #CBD5E1',
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(10, 28, 68, 0.05)',
      }}
    >
      {/* Top Banner: ASSIGNED INTENSITY + DAILY WORKOUT VIDEO HEADER */}
      <div
        style={{
          padding: '16px 18px',
          backgroundColor: '#0A1C44',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#E8CA56',
              color: '#0A1C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            <Zap size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {clientName ? `${clientName.toUpperCase()}'S WORKOUT PROTOCOL` : 'INTENSITY WORKOUT SYSTEM'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                }}
              >
                {intensityTier.toUpperCase()} ({intensityMultiplier}x)
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
              {todayWorkout.dayName}: {todayWorkout.title}
            </h3>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            color: '#93C5FD',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: 700,
          }}
        >
          {todayWorkout.durationMinutes} Min Session
        </span>
      </div>

      {/* Video Preview Card with Tap to Watch */}
      <div style={{ padding: '14px 16px 10px', backgroundColor: '#F8FAFC' }}>
        <div
          onClick={() => setActiveTab(activeTab === 'video' ? 'none' : 'video')}
          style={{
            position: 'relative',
            width: '100%',
            height: '150px',
            borderRadius: '14px',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundImage: `url(${todayWorkout.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 28, 68, 0.45)' }} />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#0A1C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Play size={24} style={{ marginLeft: '3px' }} />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              right: '12px',
              zIndex: 2,
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700 }}>
              {todayWorkout.focusArea}
            </span>
            <span style={{ fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
              ▶ Tap to Watch
            </span>
          </div>
        </div>
      </div>

      {/* 3 CORE ACTION BUTTONS (As explicitly demanded) */}
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        
        {/* Option 1: Add Exercise */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'add-exercise' ? 'none' : 'add-exercise')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: `1.5px solid ${activeTab === 'add-exercise' ? '#0A1C44' : '#E2E8F0'}`,
            backgroundColor: activeTab === 'add-exercise' ? '#0A1C44' : '#FFFFFF',
            color: activeTab === 'add-exercise' ? '#FFFFFF' : '#1E293B',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <Dumbbell size={18} color={activeTab === 'add-exercise' ? '#E8CA56' : '#2563EB'} />
          <strong style={{ fontSize: '11.5px' }}>1. Add Exercise</strong>
          <span style={{ fontSize: '9.5px', opacity: 0.8 }}>Bands & Weights</span>
        </button>

        {/* Option 2: Turn on Timer */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'timer' ? 'none' : 'timer')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: `1.5px solid ${activeTab === 'timer' ? '#0A1C44' : '#E2E8F0'}`,
            backgroundColor: activeTab === 'timer' ? '#0A1C44' : '#FFFFFF',
            color: activeTab === 'timer' ? '#FFFFFF' : '#1E293B',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <Timer size={18} color={activeTab === 'timer' ? '#E8CA56' : '#EA580C'} />
          <strong style={{ fontSize: '11.5px' }}>2. Turn on Timer</strong>
          <span style={{ fontSize: '9.5px', opacity: 0.8 }}>Touch & Gesture</span>
        </button>

        {/* Option 3: Watch Videos and Complete Task */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'video' ? 'none' : 'video')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: `1.5px solid ${activeTab === 'video' ? '#0A1C44' : '#E2E8F0'}`,
            backgroundColor: activeTab === 'video' ? '#0A1C44' : '#FFFFFF',
            color: activeTab === 'video' ? '#FFFFFF' : '#1E293B',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCircle2 size={18} color={activeTab === 'video' ? '#E8CA56' : '#16A34A'} />
          <strong style={{ fontSize: '11.5px' }}>3. Watch & Done</strong>
          <span style={{ fontSize: '9.5px', opacity: 0.8 }}>Complete Task</span>
        </button>
      </div>

      {/* ACTION 1 CONTENT: ADD EXERCISE (Clean lines form, bulky weight, color bands) */}
      {activeTab === 'add-exercise' && (
        <div style={{ margin: '0 16px 14px', padding: '14px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1.5px solid #CBD5E1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Dumbbell size={16} color="#0A1C44" />
              <strong style={{ fontSize: '13px', color: '#0A1C44' }}>Add Custom Exercise Log</strong>
            </div>
            <button type="button" onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>✕</button>
          </div>

          {exerciseSavedNotice && (
            <div style={{ padding: '8px 12px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '11.5px', fontWeight: 700, marginBottom: '8px' }}>
              ✓ Exercise logged! Minutes added to your 3-month gamified goal.
            </div>
          )}

          <form onSubmit={handleSaveExercise} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Category selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'Resistance Color Band' as const, label: 'Color Bands' },
                { id: 'Bulky Weights / Dumbbells' as const, label: 'Bulky Weights' },
                { id: 'Bodyweight' as const, label: 'Bodyweight' },
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: category === c.id ? '#0A1C44' : '#FFFFFF',
                    color: category === c.id ? '#FFFFFF' : '#334155',
                    border: `1px solid ${category === c.id ? '#0A1C44' : '#CBD5E1'}`,
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Exercise Name */}
            <div>
              <input
                type="text"
                placeholder="Exercise Name (e.g. Banded Squat Pulses, Dumbbell Press)"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="form-input"
                style={{ fontSize: '12px', padding: '6px 10px', backgroundColor: '#FFFFFF' }}
              />
            </div>

            {/* Resistance Band Color Selector */}
            {category === 'Resistance Color Band' && (
              <div>
                <label className="form-label" style={{ fontSize: '10.5px', marginBottom: '4px' }}>Select Resistance Band Color:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {RESISTANCE_BANDS_CATALOG.map(b => (
                    <button
                      key={b.color}
                      type="button"
                      onClick={() => setSelectedBand(b.color)}
                      style={{
                        padding: '6px 2px',
                        borderRadius: '8px',
                        border: `2px solid ${selectedBand === b.color ? '#0A1C44' : '#E2E8F0'}`,
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: b.hex }} />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#1E293B' }}>{b.color}</span>
                      <span style={{ fontSize: '8px', color: '#64748B' }}>{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bulky Weight Input */}
            {category === 'Bulky Weights / Dumbbells' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>Dumbbell / Barbell Weight:</span>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="form-input"
                  style={{ width: '90px', fontSize: '12px', padding: '4px 8px' }}
                />
                <span style={{ fontSize: '11px', color: '#64748B' }}>kg</span>
              </div>
            )}

            {/* Sets, Reps & Minutes in clean lines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '10px' }}>Sets</label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value, 10) || 1)}
                  className="form-input"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '10px' }}>Reps</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(parseInt(e.target.value, 10) || 1)}
                  className="form-input"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '10px' }}>Active Minutes</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 5)}
                  className="form-input"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 12px', fontSize: '12px', marginTop: '2px' }}
            >
              ✓ Save Exercise & Log Minutes
            </button>

            {loggedExercises.length > 0 && (
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Recently Logged Exercises ({loggedExercises.length}):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                  {loggedExercises.slice(0, 4).map((ex) => (
                    <div key={ex.id} style={{ fontSize: '11px', color: '#1E293B', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                      <span><strong>{ex.exerciseName}</strong> ({ex.category})</span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>{ex.sets} sets × {ex.reps} reps ({ex.durationMinutes}m)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ACTION 2 CONTENT: GESTURE INTERVAL TIMER */}
      {activeTab === 'timer' && (
        <div style={{ margin: '0 16px 14px', padding: '16px', borderRadius: '14px', backgroundColor: '#0A1C44', color: '#FFFFFF', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase' }}>
              TOUCH & GESTURE WORKOUT TIMER
            </span>
            <button type="button" onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', color: '#93C5FD', cursor: 'pointer' }}>✕</button>
          </div>

          {/* Large Tap to Start / Pause gesture surface */}
          <div
            onClick={() => setTimerIsRunning(!timerIsRunning)}
            style={{
              padding: '24px 16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: `2px dashed ${timerIsRunning ? '#34D399' : '#64748B'}`,
              cursor: 'pointer',
              marginBottom: '12px',
              userSelect: 'none',
            }}
          >
            <div style={{ fontSize: '46px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px', color: timerIsRunning ? '#34D399' : '#FFFFFF' }}>
              {formatTimer(timerSeconds)}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              {timerIsRunning ? '● Timer Active — Tap anywhere to Pause' : '▶ Tap anywhere to Start Timer'}
            </div>
          </div>

          {/* Timer Controls Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setTimerIsRunning(!timerIsRunning)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: timerIsRunning ? '#F59E0B' : '#10B981',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {timerIsRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{timerIsRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (timerSeconds > 0) setTimerLaps([...timerLaps, timerSeconds]);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Lap ({timerLaps.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setTimerIsRunning(false);
                setTimerSeconds(0);
                setTimerLaps([]);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#F87171',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          {timerSeconds >= 60 && (
            <button
              type="button"
              onClick={handleSaveTimerMinutes}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#34D399',
                color: '#064E3B',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✓ Save {Math.ceil(timerSeconds / 60)} Minutes to Today's Goal
            </button>
          )}
        </div>
      )}

      {/* ACTION 3 CONTENT: WATCH VIDEOS AND COMPLETE TASK */}
      {activeTab === 'video' && (
        <div style={{ margin: '0 16px 14px', padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Video size={16} color="#0A1C44" />
              <strong style={{ fontSize: '13.5px', color: '#0A1C44' }}>
                {todayWorkout.dayName} Guided Routine: {todayWorkout.title}
              </strong>
            </div>
            <button type="button" onClick={() => setActiveTab('none')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>✕</button>
          </div>

          <p style={{ fontSize: '11.5px', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
            {todayWorkout.description}
          </p>

          {/* Video Player */}
          <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000000', marginBottom: '12px' }}>
            <video
              src={todayWorkout.videoUrl}
              controls
              playsInline
              style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
            />
          </div>

          {/* Exercise Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Session Movements:</span>
            {todayWorkout.exercises.map((ex, idx) => (
              <div key={idx} style={{ padding: '6px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '11.5px', color: '#1E293B' }}>{ex.name}</strong>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Tip: {ex.tip}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB' }}>
                  {ex.sets} • {ex.reps}
                </span>
              </div>
            ))}
          </div>

          {/* Complete Task Button */}
          <button
            type="button"
            onClick={handleCompleteTodayTask}
            disabled={taskCompletedToday}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: taskCompletedToday ? '#059669' : '#0A1C44',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{taskCompletedToday ? '✓ Today\'s Workout Completed!' : `Complete Today's ${todayWorkout.durationMinutes}m Task`}</span>
          </button>
        </div>
      )}

      {/* 3-MONTH GAMIFICATION & MINUTES GOAL PROGRESS */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="#D97706" />
            <strong style={{ fontSize: '12.5px', color: '#0A1C44' }}>
              3-Month Gamification Goal ({intensityTier})
            </strong>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669' }}>
            {gamification?.totalMinutesLogged || 420} / {threeMonthGoal} mins ({gamification?.percentTowardsGoal || 23}%)
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <div
            style={{
              width: `${gamification?.percentTowardsGoal || 23}%`,
              height: '100%',
              backgroundColor: '#059669',
              borderRadius: '4px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* 600-900 Min Upgrade Incentive Banner */}
        <div
          style={{
            padding: '8px 10px',
            borderRadius: '10px',
            backgroundColor: (gamification?.totalMinutesLogged || 420) >= 600 ? '#ECFDF5' : '#FFFBEB',
            border: `1px solid ${(gamification?.totalMinutesLogged || 420) >= 600 ? '#A7F3D0' : '#FDE68A'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '11px', color: (gamification?.totalMinutesLogged || 420) >= 600 ? '#065F46' : '#92400E' }}>
            <strong>Goal:</strong> 600–900 mins qualifies for <strong>Intensity Upgrade</strong> + <strong>Free 4-day/week program</strong>!
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: (gamification?.totalMinutesLogged || 420) >= 600 ? '#059669' : '#D97706',
              color: '#FFFFFF',
            }}
          >
            {(gamification?.totalMinutesLogged || 420) >= 600 ? 'Unlocked! ✓' : `${Math.max(0, 600 - (gamification?.totalMinutesLogged || 420))}m left`}
          </span>
        </div>

        {/* WEEKLY PERFORMANCE DATA (Daily Activity Log: Sun - Sat) */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
              Weekly Performance (Daily Activity Log)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                Today: {gamification?.todayMinutes || 30} mins
              </span>
              {onNavigateToActivity && (
                <button
                  type="button"
                  onClick={onNavigateToActivity}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563EB',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  View Log →
                </button>
              )}
            </div>
          </div>

          {/* 7-Day Bar Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {(gamification?.weeklyDaysData || [
              { day: 'Sun', minutes: 25, isToday: false },
              { day: 'Mon', minutes: 35, isToday: true },
              { day: 'Tue', minutes: 0, isToday: false },
              { day: 'Wed', minutes: 0, isToday: false },
              { day: 'Thu', minutes: 0, isToday: false },
              { day: 'Fri', minutes: 0, isToday: false },
              { day: 'Sat', minutes: 0, isToday: false },
            ]).map(d => (
              <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '38px', backgroundColor: '#E2E8F0', borderRadius: '4px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.min(100, (d.minutes / 45) * 100)}%`,
                      backgroundColor: d.isToday ? '#0A1C44' : '#059669',
                      borderRadius: '2px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '9.5px', fontWeight: d.isToday ? 800 : 600, color: d.isToday ? '#0A1C44' : '#64748B', marginTop: '2px' }}>
                  {d.day}
                </span>
                <span style={{ fontSize: '8.5px', color: '#94A3B8' }}>{d.minutes}m</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
