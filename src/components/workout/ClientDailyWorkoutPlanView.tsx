import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Video, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Calendar
} from 'lucide-react';
import { 
  getClientWorkoutPlan, 
  getDayExerciseProgress,
  saveDayExerciseProgress,
  getTodayDateKey,
  type ClientDailyWorkoutPlan, 
  type DailyWorkoutDay 
} from '../../services/workoutPlanService';

interface ClientDailyWorkoutPlanViewProps {
  clientId: string;
  clientName?: string;
  onNavigateTab?: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

export const ClientDailyWorkoutPlanView: React.FC<ClientDailyWorkoutPlanViewProps> = ({
  clientId,
}) => {
  const [plan, setPlan] = useState<ClientDailyWorkoutPlan | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeVideoExId, setActiveVideoExId] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    return getDayExerciseProgress(clientId).completedExerciseIds || {};
  });

  const loadPlan = async () => {
    try {
      const data = await getClientWorkoutPlan(clientId);
      setPlan(data);

      // Load saved progress for today
      const savedProg = getDayExerciseProgress(clientId);
      if (savedProg && savedProg.completedExerciseIds) {
        setCompletedExercises(savedProg.completedExerciseIds);
      }

      if (data && data.days) {
        // Check current day of week to set smart initial day if matching
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDayName = dayNames[new Date().getDay()];
        const matchingIdx = data.days.findIndex(d => d.dayName.toLowerCase().includes(todayDayName.toLowerCase()));
        if (matchingIdx >= 0) {
          setSelectedDayIndex(matchingIdx);
        }
      }
    } catch (e) {
      console.warn('Error loading client workout plan:', e);
    }
  };

  useEffect(() => {
    loadPlan();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setPlan(e.detail);
      } else {
        loadPlan();
      }
    };

    window.addEventListener('client_workout_plan_updated', handleUpdate);
    return () => {
      window.removeEventListener('client_workout_plan_updated', handleUpdate);
    };
  }, [clientId]);

  const currentDay: DailyWorkoutDay | undefined = plan?.days[selectedDayIndex];

  // Toggle completion of exercise and persist immediately
  const handleToggleComplete = (exId: string) => {
    setCompletedExercises(prev => {
      const next = {
        ...prev,
        [exId]: !prev[exId],
      };

      // Calculate new percentage for current day
      const exList = currentDay?.exercises || [];
      const total = exList.length;
      const count = exList.filter(ex => next[ex.id]).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      // Save to persistence
      saveDayExerciseProgress({
        clientId,
        date: getTodayDateKey(),
        dayId: currentDay?.dayId,
        completedExerciseIds: next,
        percentage: pct,
        totalExercises: total,
        completedExercisesCount: count,
        updatedAt: Date.now(),
      });

      return next;
    });
  };

  const completedCount = currentDay?.exercises.filter(ex => completedExercises[ex.id]).length || 0;
  const totalCount = currentDay?.exercises.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!plan || !plan.days || plan.days.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '40px 24px',
          textAlign: 'center',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(10, 28, 68, 0.04)',
          maxWidth: '600px',
          margin: '20px auto',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#0A1C44',
            color: '#E8CA56',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(10, 28, 68, 0.15)',
          }}
        >
          <Dumbbell size={30} />
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#66734A',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '6px',
          }}
        >
          Awaiting Personalized Protocol
        </span>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
          No Daily Workout Plan Assigned Yet
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', lineHeight: 1.5, margin: 0 }}>
          Your clinical practitioner (Sneha Dey) has not manually assigned your daily exercise routines yet. Once configured in the admin panel, your customized video guides and plans will appear here immediately.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {/* Top Protocol Header */}
      <div
        style={{
          backgroundColor: '#0A1C44',
          borderRadius: '20px',
          padding: '20px',
          color: '#FFFFFF',
          border: '1.5px solid #E8CA56',
          boxShadow: '0 8px 24px rgba(10, 28, 68, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232, 202, 86, 0.2) 0%, rgba(10, 28, 68, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#E8CA56',
                color: '#0A1C44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              <Dumbbell size={22} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#E8CA56',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Personalized Daily Workout Plan
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
                {plan?.planTitle || 'Assigned Movement Protocol'}
              </h2>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#93C5FD',
            }}
          >
            <Sparkles size={12} color="#E8CA56" />
            <span>Prescribed by {plan?.assignedBy || 'Clinical Admin'}</span>
          </div>
        </div>

        {/* Progress Bar in Header */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
            <span style={{ color: '#CBD5E1', fontWeight: 600 }}>
              Session Progress ({completedCount}/{totalCount} Completed)
            </span>
            <span style={{ color: '#E8CA56', fontWeight: 800 }}>{progressPercent}%</span>
          </div>
          <div
            style={{
              height: '7px',
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: '#E8CA56',
                borderRadius: '9999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Days Tabs Horizontal Scroll */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {plan?.days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.dayId || idx}
              type="button"
              onClick={() => {
                setSelectedDayIndex(idx);
                setActiveVideoExId(null);
              }}
              style={{
                padding: '9px 14px',
                borderRadius: '12px',
                backgroundColor: isSelected ? '#0A1C44' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#334155',
                border: isSelected ? '1.5px solid #E8CA56' : '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isSelected ? '0 4px 12px rgba(10,28,68,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <Calendar size={13} color={isSelected ? '#E8CA56' : '#64748B'} />
              <span>{day.dayName.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Current Day Details Card */}
      {currentDay && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {currentDay.dayName}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0', fontWeight: 600 }}>
                Target Focus: <strong style={{ color: '#0A1C44' }}>{currentDay.focusArea || 'Full Body Integration'}</strong>
              </p>
            </div>

            {currentDay.isRestDay ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                }}
              >
                Rest & Recovery Session
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                }}
              >
                {currentDay.exercises.length} Exercises Planned
              </span>
            )}
          </div>
        </div>
      )}

      {/* Exercises List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentDay?.exercises.map((ex, index) => {
          const isDone = !!completedExercises[ex.id];
          const isVideoOpen = activeVideoExId === ex.id;
          const hasVideo = !!ex.videoFileName;

          return (
            <div
              key={ex.id || index}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: isDone ? '1.5px solid #10B981' : '1px solid #CBD5E1',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Top Row: Number, Name, Target, Completion Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {/* Toggle Done Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(ex.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle2
                      size={24}
                      color={isDone ? '#10B981' : '#CBD5E1'}
                      fill={isDone ? '#ECFDF5' : 'transparent'}
                    />
                  </button>

                  <div>
                    <h4
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 800,
                        color: isDone ? '#64748B' : '#0F172A',
                        textDecoration: isDone ? 'line-through' : 'none',
                        margin: 0,
                        textTransform: 'capitalize',
                      }}
                    >
                      {ex.name.replace(/_/g, ' ')}
                    </h4>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#059669',
                        display: 'inline-block',
                        marginTop: '2px',
                      }}
                    >
                      {ex.target}
                    </span>
                  </div>
                </div>

                {/* Video & YouTube Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Video Watch Button */}
                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={() => setActiveVideoExId(isVideoOpen ? null : ex.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: isVideoOpen ? '#0A1C44' : '#EFF6FF',
                        color: isVideoOpen ? '#E8CA56' : '#1D4ED8',
                        border: isVideoOpen ? '1.5px solid #E8CA56' : '1px solid #BFDBFE',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <Video size={13} />
                      <span>{isVideoOpen ? 'Hide Video' : 'Video Demo'}</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                      (Form Guide)
                    </span>
                  )}

                  {/* YouTube Link Button (Props Button) */}
                  <a
                    href={ex.youtubeUrl || 'https://www.youtube.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      fontSize: '11px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    title="Open exercise form guide on YouTube"
                  >
                    <ExternalLink size={12} />
                    <span>YouTube</span>
                  </a>
                </div>
              </div>

              {/* Embedded Illustrating Video Player */}
              {isVideoOpen && ex.videoFileName && (
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#000000',
                      border: '1.5px solid #0A1C44',
                      boxShadow: '0 8px 24px rgba(10, 28, 68, 0.15)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '9 / 16',
                        backgroundColor: '#000000',
                      }}
                    >
                      <video
                        key={ex.videoFileName}
                        src={`/vids-work/${ex.videoFileName}`}
                        controls
                        playsInline
                        autoPlay
                        loop
                        muted
                        controlsList="nodownload"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={(e) => {
                          const target = e.currentTarget;
                          console.error('Video error:', target.error, 'Source:', target.src);
                        }}
                      />
                    </div>
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#0A1C44',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#E8CA56', fontWeight: 700 }}>
                      Illustrating Video: {ex.videoFileName}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#93C5FD' }}>Looping HD Clip</span>
                      <a
                        href={`/vids-work/${encodeURIComponent(ex.videoFileName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#E8CA56',
                          textDecoration: 'underline',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Open Video ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          );
        })}

        {currentDay?.exercises.length === 0 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px 20px',
              textAlign: 'center',
              color: '#64748B',
              fontSize: '13px',
              border: '1px dashed #CBD5E1',
            }}
          >
            No exercises scheduled for this day yet. Your clinical admin can assign routines anytime.
          </div>
        )}
      </div>
    </div>
  );
};
