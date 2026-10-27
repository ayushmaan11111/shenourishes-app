import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  Check, 
  Film
} from 'lucide-react';
import { 
  WORKOUT_PROGRAM_TEMPLATES, 
  AVAILABLE_VIDEOS, 
  getClientWorkoutPlan, 
  saveClientWorkoutPlan,
  findVideoForExercise,
  type ClientDailyWorkoutPlan,
  type DailyWorkoutDay,
  type PrescribedExerciseItem
} from '../../services/workoutPlanService';

interface AdminWorkoutPlanAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export const AdminWorkoutPlanAssignmentModal: React.FC<AdminWorkoutPlanAssignmentModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
}) => {
  const [, setLoading] = useState(true);
  const [plan, setPlan] = useState<ClientDailyWorkoutPlan | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Load client's plan on open
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setSavedSuccess(false);
      getClientWorkoutPlan(clientId)
        .then((data) => {
          setPlan(data);
          setSelectedDayIndex(0);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const currentDay: DailyWorkoutDay | undefined = plan?.days ? plan.days[selectedDayIndex] : undefined;

  // Apply one of the 8 pre-built templates
  const handleApplyTemplate = (templateId: string) => {
    const template = WORKOUT_PROGRAM_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const basePlan: ClientDailyWorkoutPlan = plan || {
      id: 'wp_' + (clientId || 'default'),
      clientId: clientId || 'default',
      clientName: clientName || 'Client',
      planTitle: template.name,
      programType: template.category,
      assignedAt: Date.now(),
      assignedBy: 'Sneha Dey (Clinical Admin)',
      notes: 'Manually prescribed personalized daily workout plan.',
      days: [],
    };

    const updated: ClientDailyWorkoutPlan = {
      ...basePlan,
      planTitle: template.name,
      programType: template.category,
      assignedAt: Date.now(),
      days: JSON.parse(JSON.stringify(template.days)),
    };
    setPlan(updated);
    setSelectedDayIndex(0);
  };

  // Add a new empty exercise to the current day
  const handleAddExercise = () => {
    if (!currentDay) {
      // If plan is empty, initialize with 1 day
      const newPlan: ClientDailyWorkoutPlan = plan || {
        id: 'wp_' + (clientId || 'default'),
        clientId: clientId || 'default',
        clientName: clientName || 'Client',
        planTitle: 'Custom Workout Plan',
        programType: 'Custom Routine',
        assignedAt: Date.now(),
        assignedBy: 'Sneha Dey (Clinical Admin)',
        days: [
          {
            dayId: 'day_1',
            dayName: 'Day 1 - Custom Routine',
            focusArea: 'Full Body Movement',
            isRestDay: false,
            exercises: [],
          },
        ],
      };

      const newEx: PrescribedExerciseItem = {
        id: 'ex_' + Math.random().toString(36).substring(2, 9),
        name: 'New Custom Exercise',
        target: '3 sets x 12-15 reps',
        videoFileName: '',
        videoUrl: undefined,
        youtubeUrl: 'https://www.youtube.com',
        completed: false,
      };

      newPlan.days[0].exercises.push(newEx);
      setPlan({ ...newPlan });
      setSelectedDayIndex(0);
      return;
    }

    if (!plan) return;
    const newEx: PrescribedExerciseItem = {
      id: 'ex_' + Math.random().toString(36).substring(2, 9),
      name: 'New Custom Exercise',
      target: '3 sets x 12-15 reps',
      videoFileName: '',
      videoUrl: undefined,
      youtubeUrl: 'https://www.youtube.com',
      completed: false,
    };

    const newDays = [...plan.days];
    newDays[selectedDayIndex].exercises.push(newEx);
    setPlan({ ...plan, days: newDays });
  };

  // Update a field on an exercise
  const handleUpdateExercise = (
    exIndex: number,
    field: keyof PrescribedExerciseItem,
    value: any
  ) => {
    if (!plan || !currentDay) return;
    const newDays = [...plan.days];
    const targetEx = { ...newDays[selectedDayIndex].exercises[exIndex] };

    if (field === 'name') {
      targetEx.name = value;
      // Auto-suggest video if match exists
      const matched = findVideoForExercise(value);
      if (matched) {
        targetEx.videoFileName = matched;
        targetEx.videoUrl = `/vids-work/${matched}`;
      }
    } else if (field === 'videoFileName') {
      targetEx.videoFileName = value;
      targetEx.videoUrl = value ? `/vids-work/${value}` : undefined;
    } else {
      (targetEx as any)[field] = value;
    }

    newDays[selectedDayIndex].exercises[exIndex] = targetEx;
    setPlan({ ...plan, days: newDays });
  };

  // Remove exercise from current day
  const handleRemoveExercise = (exIndex: number) => {
    if (!plan || !currentDay) return;
    const newDays = [...plan.days];
    newDays[selectedDayIndex].exercises.splice(exIndex, 1);
    setPlan({ ...plan, days: newDays });
  };

  // Save the customized workout plan
  const handleSave = async () => {
    if (!plan) return;
    await saveClientWorkoutPlan({
      ...plan,
      clientName: clientName || plan.clientName,
      assignedAt: Date.now(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '2px solid #E8CA56',
          overflow: 'hidden',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 22px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1.5px solid #E8CA56',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#E8CA56',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Clinical Workout Assignment Desk
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#93C5FD',
                    fontWeight: 700,
                  }}
                >
                  Client: {clientName || 'Selected Client'}
                </span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
                {plan?.planTitle || 'Daily Workout Protocol'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#CBD5E1',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Action Bar: Template Preset Selector + Save Button */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', whiteSpace: 'nowrap' }}>
              Select Program Preset:
            </span>
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                if (e.target.value) handleApplyTemplate(e.target.value);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0A1C44',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <option value="">-- Choose from 8 Clinical Workout Templates --</option>
              {WORKOUT_PROGRAM_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {savedSuccess && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#059669',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  backgroundColor: '#ECFDF5',
                  padding: '6px 12px',
                  borderRadius: '6px',
                }}
              >
                <Check size={16} />
                Plan Saved & Updated for User!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0A1C44',
                color: '#E8CA56',
                border: '1.5px solid #E8CA56',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Save size={16} />
              Save Plan for {clientName ? clientName.split(' ')[0] : 'Client'}
            </button>
          </div>
        </div>

        {/* Main Body: Days Sidebar + Selected Day Exercise Editor */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Days Left Sidebar */}
          <div
            style={{
              width: '260px',
              backgroundColor: '#F1F5F9',
              borderRight: '1px solid #E2E8F0',
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
                paddingLeft: '4px',
              }}
            >
              Daily Routines ({plan?.days.length || 0} Days)
            </div>

            {plan?.days.map((day, idx) => {
              const isActive = selectedDayIndex === idx;
              return (
                <div
                  key={day.dayId || idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#0A1C44' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#1E293B',
                    border: isActive ? '1.5px solid #E8CA56' : '1px solid #CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>{day.dayName}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: isActive ? '#E8CA56' : '#64748B',
                      marginTop: '2px',
                    }}
                  >
                    {day.focusArea || 'General Workout'}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: isActive ? '#93C5FD' : '#94A3B8',
                      marginTop: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {day.isRestDay ? 'Rest Day' : `${day.exercises.length} Exercises`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Exercise List Panel */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {currentDay ? (
              <>
                {/* Day Header Info */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={currentDay.dayName}
                      onChange={(e) => {
                        if (!plan) return;
                        const newDays = [...plan.days];
                        newDays[selectedDayIndex].dayName = e.target.value;
                        setPlan({ ...plan, days: newDays });
                      }}
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: '#0A1C44',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        width: '100%',
                        maxWidth: '400px',
                      }}
                    />
                    <input
                      type="text"
                      value={currentDay.focusArea}
                      onChange={(e) => {
                        if (!plan) return;
                        const newDays = [...plan.days];
                        newDays[selectedDayIndex].focusArea = e.target.value;
                        setPlan({ ...plan, days: newDays });
                      }}
                      placeholder="Focus area (e.g. Glute Medius & Quads)"
                      style={{
                        fontSize: '11.5px',
                        color: '#64748B',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        marginTop: '4px',
                        width: '100%',
                        maxWidth: '350px',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={currentDay.isRestDay}
                        onChange={(e) => {
                          if (!plan) return;
                          const newDays = [...plan.days];
                          newDays[selectedDayIndex].isRestDay = e.target.checked;
                          setPlan({ ...plan, days: newDays });
                        }}
                      />
                      Rest Day
                    </label>

                    <button
                      type="button"
                      onClick={handleAddExercise}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={14} />
                      Add Exercise
                    </button>
                  </div>
                </div>

                {/* Exercises Table / Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentDay.exercises.map((ex, exIdx) => (
                    <div
                      key={ex.id || exIdx}
                      style={{
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#0A1C44',
                              color: '#E8CA56',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {exIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) => handleUpdateExercise(exIdx, 'name', e.target.value)}
                            placeholder="Exercise name"
                            style={{
                              fontSize: '13.5px',
                              fontWeight: 800,
                              color: '#0F172A',
                              padding: '5px 8px',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              flex: 1,
                            }}
                          />
                        </div>

                        <input
                          type="text"
                          value={ex.target}
                          onChange={(e) => handleUpdateExercise(exIdx, 'target', e.target.value)}
                          placeholder="Sets / Reps / Duration"
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#065F46',
                            padding: '5px 8px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            width: '200px',
                            backgroundColor: '#F0FDF4',
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exIdx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Remove exercise"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Video and YouTube Link Row */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr',
                          gap: '10px',
                          alignItems: 'center',
                          backgroundColor: '#F8FAFC',
                          padding: '8px 12px',
                          borderRadius: '8px',
                        }}
                      >
                        {/* Video selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Film size={14} color="#0A1C44" />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>
                            Demo Video:
                          </span>
                          <select
                            value={ex.videoFileName || ''}
                            onChange={(e) => handleUpdateExercise(exIdx, 'videoFileName', e.target.value)}
                            style={{
                              flex: 1,
                              fontSize: '11px',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              color: ex.videoFileName ? '#0A1C44' : '#94A3B8',
                              fontWeight: 600,
                            }}
                          >
                            <option value="">(No video attached)</option>
                            {AVAILABLE_VIDEOS.map((v) => (
                              <option key={v} value={v}>
                                🎬 {v}
                              </option>
                            ))}
                          </select>

                          {ex.videoFileName && (
                            <button
                              type="button"
                              onClick={() => setPreviewVideoUrl(`/vids-work/${ex.videoFileName}`)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#0A1C44',
                                color: '#E8CA56',
                                border: 'none',
                                fontSize: '10.5px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Play
                            </button>
                          )}
                        </div>

                        {/* YouTube Link */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ExternalLink size={14} color="#DC2626" />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>
                            YouTube:
                          </span>
                          <input
                            type="text"
                            value={ex.youtubeUrl || ''}
                            onChange={(e) => handleUpdateExercise(exIdx, 'youtubeUrl', e.target.value)}
                            placeholder="https://youtube.com/..."
                            style={{
                              flex: 1,
                              fontSize: '11px',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              color: '#1E293B',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentDay.exercises.length === 0 && (
                    <div
                      style={{
                        padding: '30px',
                        textAlign: 'center',
                        color: '#64748B',
                        fontSize: '13px',
                      }}
                    >
                      No exercises added for this day yet. Click <strong>+ Add Exercise</strong> or apply a program template from above.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                Select a routine day from the sidebar.
              </div>
            )}
          </div>
        </div>

        {/* Video Preview Popup Modal */}
        {previewVideoUrl && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#0A1C44',
                borderRadius: '16px',
                padding: '16px',
                maxWidth: '600px',
                width: '100%',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  color: '#FFFFFF',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#E8CA56' }}>
                  Video Preview: {previewVideoUrl.replace('/vids-work/', '')}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewVideoUrl(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <video
                src={previewVideoUrl}
                controls
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  maxHeight: '400px',
                  backgroundColor: '#000000',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
