import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Coffee, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Send,
  ImageIcon,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOneOnOneAgreementConfig } from '../data/agreementsData';
import { 
  POPULAR_COFFEE_SHOPS, 
  saveCounsellingRecord, 
  getCounsellingRecord 
} from '../services/counsellingService';
import { sendCounsellingBookingEmails } from '../services/resendEmailService';
import { ProteinFatRequirementFormulaView } from '../components/admin/ProteinFatRequirementFormulaView';
import type { 
  FullCounsellingSessionRecord, 
  MeetingMode, 
  PersonalCounsellingInfo, 
  CounsellingLifestyle, 
  AdminClinicalAssessment, 
  CurrentLifeChallenges, 
  LifestyleSupportOvercome 
} from '../types/counselling';

interface CounsellingPackageScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: string) => void;
}

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM – 10:00 AM',
  '11:00 AM – 12:00 PM',
  '02:00 PM – 03:00 PM',
  '04:30 PM – 05:30 PM',
  '07:00 PM – 08:00 PM',
];

const COUNSELLING_GOALS_OPTIONS = [
  { id: 'goal_healthy_eating', label: 'Building Healthy Eating Habits', icon: '🥗' },
  { id: 'goal_fat_reduction', label: 'Reducing Body Fat & Inches', icon: '🔥' },
  { id: 'goal_stamina', label: 'Improve Daily Stamina & Vitality', icon: '⚡' },
  { id: 'goal_muscle_tone', label: 'Build Muscle & Lean Tone', icon: '💪' },
  { id: 'goal_flexibility', label: 'Flexibility & Joint Mobility', icon: '🧘' },
  { id: 'goal_manage_stress', label: 'Manage Stress & Emotional Eating', icon: '🧠' },
  { id: 'goal_daily_activity', label: 'Managing Daily Activity Routine', icon: '🏃' },
  { id: 'goal_consistency', label: 'Building Long-Term Consistency', icon: '🎯' },
];

export const CounsellingPackageScreen: React.FC<CounsellingPackageScreenProps> = ({ onBack }) => {
  const { user, customerRecord } = useAuth();
  const clientId = user?.uid || 'default_user';

  const [activeSection, setActiveSection] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Section 1: Booking State
  const [meetingMode, setMeetingMode] = useState<MeetingMode>('Video Call');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(AVAILABLE_TIME_SLOTS[1]);
  const [coffeeShopLocation, setCoffeeShopLocation] = useState<string>(POPULAR_COFFEE_SHOPS[0].name);
  const [customLocationDetails, setCustomLocationDetails] = useState<string>('');
  const [agreementAccepted, setAgreementAccepted] = useState<boolean>(true);
  const [showAgreementPosterModal, setShowAgreementPosterModal] = useState<boolean>(false);

  const oneOnOneAgreement = getOneOnOneAgreementConfig(1699);

  // Section 2: Personal Info
  const [personalInfo, setPersonalInfo] = useState<PersonalCounsellingInfo>({
    fullName: customerRecord?.personalDetails?.fullName || '',
    age: customerRecord?.personalDetails?.age || 28,
    gender: customerRecord?.personalDetails?.gender || 'Female',
    occupation: 'Software Engineer / Consultant',
    sittingHabit: 'Desk-bound (8+ hrs)',
    email: customerRecord?.personalDetails?.emailAddress || user?.email || '',
    dietaryOrientation: 'Vegetarian',
    location: customerRecord?.personalDetails?.address || 'Bengaluru, India',
  });

  // Section 3: Lifestyle (4 Questions)
  const [lifestyle, setLifestyle] = useState<CounsellingLifestyle>({
    currentWeightKg: customerRecord?.personalDetails?.weight || 68,
    targetWeightKg: (customerRecord?.personalDetails?.weight || 68) - 6,
    wakeUpTime: customerRecord?.lifestyleHealth?.wakeUpTime || '06:30 AM',
    sleepingTime: customerRecord?.lifestyleHealth?.sleepTime || '10:30 PM',
  });

  // Section 4: Goals (Client Controls)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Building Healthy Eating Habits',
    'Reducing Body Fat & Inches',
    'Improve Daily Stamina & Vitality',
    'Building Long-Term Consistency',
  ]);

  // Section 5: Clinical Review (Admin Controlled / Assessment)
  const [adminAssessment, setAdminAssessment] = useState<AdminClinicalAssessment>({
    sleepQuality: (customerRecord?.lifestyleHealth?.sleepQuality as any) || 'Average',
    generalStress: (customerRecord?.lifestyleHealth?.stressLevel as any) || 'Moderate',
    anxietyLevels: (customerRecord?.lifestyleHealth?.anxietyLevel as any) || 'Moderate',
    clinicalNotes: 'Initial consultation will focus on glycemic stabilization and evening routine optimization.',
  });

  // Section 6: Current Challenges (Admin Selected Psychological / Lifestyle Audit)
  const [challenges, setChallenges] = useState<CurrentLifeChallenges>({
    relationshipStressAnswer: 'Work-life balance pressure and demanding professional deadlines.',
    familyResponsibilitiesAnswer: 'Managing family meals while staying aligned with personal nutritional goals.',
    isFeelingIsolated: false,
    isFeelingLowConfidence: true,
    isOftenFeelingLowMotivation: true,
    isLackingMotivationForSelfCare: false,
    isAvoidanceOfSocialGatherings: false,
    isLosingInterestInActivities: false,
    stressOverwhelmSituations: 'Late evening work calls, skipping scheduled meals, and irregular bedtime hours.',
  });

  // Section 7: Support to Overcome Lifestyle Challenges
  const [supportPlan, setSupportPlan] = useState<LifestyleSupportOvercome>({
    personalizedActionPlan: 'Weekly milestone reviews, 1-on-1 strategy sessions, personalized meal prep blueprints, and daily WhatsApp accountability check-ins.',
    habitReminders: [
      'Morning Hydration Reminder (7:00 AM)',
      'Mid-Morning Healthy Snack / Fuel (11:00 AM)',
      'Pre-Dinner Wind Down & Sleep Hygiene Protocol (9:30 PM)',
    ],
    practicalTipsSleepStress: [
      'Digital detox 45 mins before bedtime to optimize melatonin release',
      'Box breathing (4-4-4-4) before high-intensity meetings to lower cortisol',
      'Pairing carbohydrates with high biological value protein to prevent insulin crashes',
    ],
    doubtsAndAnswers: [
      { question: 'What if I miss a scheduled meal?', answer: 'Do not double up portions. Carry our suggested clinical snack or transition cleanly into the next scheduled meal window.' },
      { question: 'Can I reschedule my 1-on-1 session?', answer: 'Yes, sessions can be rescheduled up to 12 hours in advance via the app.' },
    ],
  });

  // Load existing session record if available
  useEffect(() => {
    async function loadRecord() {
      const existing = await getCounsellingRecord(clientId);
      if (existing) {
        if (existing.booking) {
          setMeetingMode(existing.booking.meetingMode || 'Video Call');
          setSelectedDate(existing.booking.selectedDate || selectedDate);
          setSelectedTimeSlot(existing.booking.selectedTimeSlot || AVAILABLE_TIME_SLOTS[1]);
          setCoffeeShopLocation(existing.booking.coffeeShopLocation || POPULAR_COFFEE_SHOPS[0].name);
        }
        if (existing.personalInfo) setPersonalInfo(existing.personalInfo);
        if (existing.lifestyle) setLifestyle(existing.lifestyle);
        if (existing.goals) setSelectedGoals(existing.goals.selectedGoals || selectedGoals);
        if (existing.adminAssessment) setAdminAssessment(existing.adminAssessment);
        if (existing.challenges) setChallenges(existing.challenges);
        if (existing.supportPlan) setSupportPlan(existing.supportPlan);
      }
    }
    loadRecord();
  }, [clientId]);

  const handleToggleGoal = (goalLabel: string) => {
    if (selectedGoals.includes(goalLabel)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalLabel));
    } else {
      setSelectedGoals([...selectedGoals, goalLabel]);
    }
  };

  const handleSaveAndConfirm = async () => {
    setIsSaving(true);
    const startDate = selectedDate;
    const endDateObj = new Date(startDate);
    endDateObj.setMonth(endDateObj.getMonth() + 3); // 3-month comprehensive package window
    const endDate = endDateObj.toISOString().split('T')[0];

    const fullRecord: FullCounsellingSessionRecord = {
      id: 'counsel_' + Date.now(),
      clientId,
      booking: {
        id: 'book_' + Date.now(),
        clientId,
        clientName: personalInfo.fullName || 'Client',
        clientEmail: personalInfo.email,
        clientMobile: customerRecord?.personalDetails?.mobileNumber || '+91 98765 00000',
        meetingMode,
        selectedDate,
        selectedTimeSlot,
        coffeeShopLocation: meetingMode === 'Coffee Shop (In-Person)' ? coffeeShopLocation : undefined,
        customLocationDetails: customLocationDetails || undefined,
        agreementAccepted,
        agreementSignedAt: Date.now(),
        startDate,
        endDate,
        confirmationEmailSent: true,
        status: 'Confirmed',
      },
      personalInfo,
      lifestyle,
      goals: { selectedGoals },
      adminAssessment,
      challenges,
      supportPlan,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveCounsellingRecord(clientId, fullRecord);

    // Dispatch Resend email confirmation to Client & Admin
    sendCounsellingBookingEmails(fullRecord).catch((err) => {
      console.warn('Could not dispatch counselling booking email:', err);
    });

    setIsSaving(false);
    setBookingSuccess(true);
  };

  if (bookingSuccess) {
    return (
      <div style={{ padding: '24px 18px', backgroundColor: '#F8F6EF', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EEF4E8', color: '#38571A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <CheckCircle2 size={36} />
        </div>
        <span style={{ fontSize: '11px', color: '#38571A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Session Confirmed & Scheduled
        </span>
        <h1 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, color: '#0A1C44', margin: '4px 0 10px' }}>
          Your 1-on-1 Counselling Session is Booked!
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7063', maxWidth: '400px', lineHeight: 1.5, marginBottom: '20px' }}>
          A calendar invite and clinical confirmation email with your start date (<strong>{selectedDate}</strong>) and meeting link/location details have been sent to <strong>{personalInfo.email}</strong>.
        </p>

        {/* Meeting Details Card */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #0A1C44', width: '100%', maxWidth: '400px', textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44' }}>MEETING MODE:</span>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A' }}>
              {meetingMode}
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#242820', fontWeight: 700 }}>
            📅 {selectedDate} • {selectedTimeSlot}
          </div>
          {meetingMode === 'Coffee Shop (In-Person)' && (
            <div style={{ fontSize: '12px', color: '#6B7063', marginTop: '4px' }}>
              📍 <strong>{coffeeShopLocation}</strong> {customLocationDetails ? `(${customLocationDetails})` : ''}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setBookingSuccess(false);
            if (onBack) onBack();
          }}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '360px', padding: '12px', fontSize: '13.5px' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8F6EF', minHeight: '100%' }}>
      {/* Top Header */}
      <div style={{ padding: '16px 18px 12px', backgroundColor: '#0A1C44', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CLINICAL COUNSELLING PROGRAM
              </span>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                1-on-1 Consultation & Intake Protocol
              </h1>
            </div>
          </div>

          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#E8CA56', color: '#0A1C44', fontWeight: 800 }}>
            Section {activeSection} of 7
          </span>
        </div>

        {/* Section Navigation Tabs (Horizontal Scrollable) */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 1, label: '1. Booking' },
            { id: 2, label: '2. Personal' },
            { id: 3, label: '3. Lifestyle' },
            { id: 4, label: '4. Goals' },
            { id: 5, label: '5. Sleep & Stress' },
            { id: 6, label: '6. Challenges' },
            { id: 7, label: '7. Support Plan' },
            { id: 8, label: '8. 📐 Formula Engine' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                border: 'none',
                backgroundColor: activeSection === sec.id ? '#E8CA56' : 'rgba(255,255,255,0.12)',
                color: activeSection === sec.id ? '#0A1C44' : '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* =========================================================================
            SECTION 1: MEETING SLOT, LOCATION & AGREEMENT
           ========================================================================= */}
        {activeSection === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', margin: '0 0 4px' }}>
                Schedule Your 1-on-1 Consultation
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Select your preferred meeting format, date, and timing slot.
              </p>
            </div>

            {/* Meeting Mode Toggle */}
            <div className="form-group">
              <label className="form-label">Select Meeting Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setMeetingMode('Video Call')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: meetingMode === 'Video Call' ? '#0A1C44' : '#FFFFFF',
                    color: meetingMode === 'Video Call' ? '#FFFFFF' : '#242820',
                    border: `1.5px solid ${meetingMode === 'Video Call' ? '#0A1C44' : '#D9D8CC'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                  }}
                >
                  <Video size={22} color={meetingMode === 'Video Call' ? '#E8CA56' : '#66734A'} />
                  <strong style={{ fontSize: '13px' }}>Video Call</strong>
                  <span style={{ fontSize: '10.5px', opacity: 0.8 }}>Google Meet / Zoom (Remote)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingMode('Coffee Shop (In-Person)')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: meetingMode === 'Coffee Shop (In-Person)' ? '#0A1C44' : '#FFFFFF',
                    color: meetingMode === 'Coffee Shop (In-Person)' ? '#FFFFFF' : '#242820',
                    border: `1.5px solid ${meetingMode === 'Coffee Shop (In-Person)' ? '#0A1C44' : '#D9D8CC'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                  }}
                >
                  <Coffee size={22} color={meetingMode === 'Coffee Shop (In-Person)' ? '#E8CA56' : '#66734A'} />
                  <strong style={{ fontSize: '13px' }}>Coffee Shop</strong>
                  <span style={{ fontSize: '10.5px', opacity: 0.8 }}>In-Person Clinical Session</span>
                </button>
              </div>
            </div>

            {/* Coffee Shop Location Selector (If In-Person) */}
            {meetingMode === 'Coffee Shop (In-Person)' && (
              <div className="wellness-card" style={{ padding: '14px', backgroundColor: '#FAF8F0', border: '1.5px solid #D9D8CC' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  Select or Suggest Coffee Shop Location
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                  {POPULAR_COFFEE_SHOPS.map((shop) => (
                    <button
                      key={shop.id}
                      type="button"
                      onClick={() => setCoffeeShopLocation(shop.name)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: coffeeShopLocation === shop.name ? '#EEF4E8' : '#FFFFFF',
                        border: `1.5px solid ${coffeeShopLocation === shop.name ? '#38571A' : '#ECEAE0'}`,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '12.5px', color: '#242820' }}>{shop.name}</strong>
                        <div style={{ fontSize: '11px', color: '#6B7063' }}>{shop.address}</div>
                      </div>
                      {coffeeShopLocation === shop.name && <CheckCircle2 size={16} color="#38571A" />}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or enter custom coffee shop / cafe address..."
                  value={customLocationDetails}
                  onChange={(e) => setCustomLocationDetails(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '12px' }}
                />
              </div>
            )}

            {/* Date & Time Slot Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Consultation Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="form-select"
                >
                  {AVAILABLE_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Official One-on-One Counseling Agreement */}
            <div style={{
              marginTop: '8px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #C5A059',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}>
              {/* Agreement Header */}
              <div style={{
                background: 'linear-gradient(135deg, #1C2D1F 0%, #2D4A2F 100%)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #C5A059'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#E8C882" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                      COUNSELING AGREEMENT
                    </h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#D1E0D3' }}>
                      One-on-One Clinical Lifestyle & Nutrition Guidance
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAgreementPosterModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="View original scanned agreement document"
                >
                  <ImageIcon size={14} color="#E8C882" />
                  <span>View Official Certificate Poster</span>
                </button>
              </div>

              {/* Agreement Clauses (6 exact statements) */}
              <div style={{ padding: '16px', backgroundColor: '#FDFBF7' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {oneOnOneAgreement.points.map((clause, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#38571A',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 700,
                        marginTop: '1px'
                      }}>
                        {idx + 1}
                      </span>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#2C3E2D', lineHeight: 1.5, fontWeight: 500 }}>
                        {clause}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Agreement Checkbox Confirmation */}
                <div style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  backgroundColor: '#EFF7ED',
                  border: '1px solid #B7D9B1',
                  borderRadius: '8px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreementAccepted}
                      onChange={(e) => setAgreementAccepted(e.target.checked)}
                      style={{ marginTop: '2px', width: '17px', height: '17px', accentColor: '#38571A' }}
                    />
                    <span style={{ fontSize: '12px', color: '#1B3B1A', fontWeight: 600, lineHeight: 1.45 }}>
                      I CONFIRM THAT I HAVE READ, UNDERSTOOD AND VOLUNTARILY AGREE TO ALL THE ABOVE STATEMENTS.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: PERSONAL INFO
           ========================================================================= */}
        {activeSection === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', margin: '0 0 4px' }}>
                Section 2: Personal Profile & Occupational Habits
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Clinical baseline, workplace ergonomics, and dietary orientation.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  value={personalInfo.age || ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, age: parseInt(e.target.value, 10) || null })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value as any })}
                  className="form-select"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input
                type="text"
                value={personalInfo.occupation}
                onChange={(e) => setPersonalInfo({ ...personalInfo, occupation: e.target.value })}
                placeholder="e.g. Architect, Software Engineer, Teacher..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sitting Habits / Daily Posture</label>
              <select
                value={personalInfo.sittingHabit}
                onChange={(e) => setPersonalInfo({ ...personalInfo, sittingHabit: e.target.value as any })}
                className="form-select"
              >
                <option value="Desk-bound (8+ hrs)">Desk-bound (8+ hours daily)</option>
                <option value="Moderate Sitting (4-6 hrs)">Moderate Sitting (4–6 hours daily)</option>
                <option value="Active on Feet">Active on Feet / Regular Walking</option>
                <option value="Mixed Routine">Mixed Routine / Travel heavy</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Dietary Orientation</label>
                <select
                  value={personalInfo.dietaryOrientation}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dietaryOrientation: e.target.value as any })}
                  className="form-select"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain Vegetarian</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / Location</label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: LIFESTYLE (4 KEY QUESTIONS)
           ========================================================================= */}
        {activeSection === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', margin: '0 0 4px' }}>
                Section 3: Lifestyle & Circadian Rhythm
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                4 key metrics: Weight, Target Weight, Wake-up, and Sleep times.
              </p>
            </div>

            {/* Current Weight & Interactive Target Weight Slider */}
            <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">1. Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={lifestyle.currentWeightKg}
                    onChange={(e) => setLifestyle({ ...lifestyle, currentWeightKg: parseFloat(e.target.value) || 60 })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">2. Target Weight (kg)</label>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#38571A', marginTop: '4px' }}>
                    {lifestyle.targetWeightKg} kg
                  </div>
                </div>
              </div>

              {/* Target Weight Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7063', marginBottom: '4px' }}>
                  <span>45 kg</span>
                  <span>Target Weight Scroll / Slider</span>
                  <span>120 kg</span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={120}
                  step={0.5}
                  value={lifestyle.targetWeightKg}
                  onChange={(e) => setLifestyle({ ...lifestyle, targetWeightKg: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: '#0A1C44' }}
                />
              </div>
            </div>

            {/* Wake-up Time & Sleeping Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">3. Wake-Up Time</label>
                <input
                  type="text"
                  value={lifestyle.wakeUpTime}
                  onChange={(e) => setLifestyle({ ...lifestyle, wakeUpTime: e.target.value })}
                  placeholder="e.g. 06:30 AM"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">4. Sleeping Time / Bedtime</label>
                <input
                  type="text"
                  value={lifestyle.sleepingTime}
                  onChange={(e) => setLifestyle({ ...lifestyle, sleepingTime: e.target.value })}
                  placeholder="e.g. 10:30 PM"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: GOALS TO ACHIEVE (CLIENT CONTROLS)
           ========================================================================= */}
        {activeSection === 4 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', margin: '0 0 4px' }}>
                Section 4: Goals to Achieve (Client Selection)
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Select all the primary health & fitness goals you want to prioritize.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              {COUNSELLING_GOALS_OPTIONS.map((g) => {
                const isSelected = selectedGoals.includes(g.label);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleToggleGoal(g.label)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#EEF4E8' : '#FFFFFF',
                      border: `1.5px solid ${isSelected ? '#38571A' : '#D9D8CC'}`,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{g.icon}</span>
                    <strong style={{ fontSize: '12px', color: isSelected ? '#242820' : '#4B5244' }}>
                      {g.label}
                    </strong>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: SLEEP & STRESS (ADMIN CONTROLLED / EVALUATION)
           ========================================================================= */}
        {activeSection === 5 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '10px 14px', backgroundColor: '#E3ECFB', borderRadius: '8px', border: '1px solid #BBDEFB' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                🔒 Admin & Clinical Review Controlled Section
              </span>
              <p style={{ fontSize: '11.5px', color: '#1B3A6B', margin: '2px 0 0' }}>
                Calibrated by clinical nutritionist during live session.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Sleep Quality</label>
              <select
                value={adminAssessment.sleepQuality}
                onChange={(e) => setAdminAssessment({ ...adminAssessment, sleepQuality: e.target.value as any })}
                className="form-select"
              >
                <option value="Poor">Poor (Frequent awakenings, daytime fatigue)</option>
                <option value="Average">Average (Moderate rest)</option>
                <option value="Good">Good (Restorative sleep)</option>
                <option value="Excellent">Excellent (Deep unbroken REM sleep)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">General Stress Level</label>
              <select
                value={adminAssessment.generalStress}
                onChange={(e) => setAdminAssessment({ ...adminAssessment, generalStress: e.target.value as any })}
                className="form-select"
              >
                <option value="Low">Low (Calm, balanced routine)</option>
                <option value="Moderate">Moderate (Occasional work pressure)</option>
                <option value="High">High (Frequent physical/mental tension)</option>
                <option value="Extremely High">Extremely High (Chronic burnout)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Anxiety Levels</label>
              <select
                value={adminAssessment.anxietyLevels}
                onChange={(e) => setAdminAssessment({ ...adminAssessment, anxietyLevels: e.target.value as any })}
                className="form-select"
              >
                <option value="Low">Low (Rarely worried)</option>
                <option value="Moderate">Moderate (Manageable overthinking)</option>
                <option value="High">High (Frequent restlessness / overwhelm)</option>
              </select>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 6: CURRENT CHALLENGES (PSYCHOLOGICAL & LIFE AUDIT)
           ========================================================================= */}
        {activeSection === 6 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '10px 14px', backgroundColor: '#FDEEE9', borderRadius: '8px', border: '1px solid #F6B8A7' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C85A48', textTransform: 'uppercase' }}>
                Section 6: Current Challenges Audit
              </span>
              <p style={{ fontSize: '11.5px', color: '#8F2610', margin: '2px 0 0' }}>
                Deep-dive clinical audit of personal, family, and emotional stressors.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">1. Relationship Stress: What’s the biggest challenge affecting your personal life right now?</label>
              <textarea
                rows={2}
                value={challenges.relationshipStressAnswer}
                onChange={(e) => setChallenges({ ...challenges, relationshipStressAnswer: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">2. Family Responsibilities: Are relationships or family relations affecting your ability to focus on yourself?</label>
              <textarea
                rows={2}
                value={challenges.familyResponsibilitiesAnswer}
                onChange={(e) => setChallenges({ ...challenges, familyResponsibilitiesAnswer: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Quick Diagnostic Yes/No Checkboxes */}
            <div className="wellness-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ fontSize: '12.5px', color: '#242820' }}>Personal Wellness & Emotional State:</strong>
              
              {[
                { key: 'isFeelingIsolated', label: 'Are you feeling isolated?' },
                { key: 'isFeelingLowConfidence', label: 'Are you feeling low confidence?' },
                { key: 'isOftenFeelingLowMotivation', label: 'Do you often feel low motivation?' },
                { key: 'isLackingMotivationForSelfCare', label: 'Do you feel lacking motivation for self-care?' },
                { key: 'isAvoidanceOfSocialGatherings', label: 'Avoidance of social gatherings?' },
                { key: 'isLosingInterestInActivities', label: 'Losing interest in activities which you previously enjoyed?' },
              ].map((item) => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5244', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={(challenges as any)[item.key]}
                    onChange={(e) => setChallenges({ ...challenges, [item.key]: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#C85A48' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">What are the situations causing you to feel stressed, overwhelmed, and emotionally drained?</label>
              <textarea
                rows={2}
                value={challenges.stressOverwhelmSituations}
                onChange={(e) => setChallenges({ ...challenges, stressOverwhelmSituations: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 7: SUPPORT TO OVERCOME LIFESTYLE CHALLENGES
           ========================================================================= */}
        {activeSection === 7 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', margin: '0 0 4px' }}>
                Section 7: Clinical Action Plan & Support Protocol
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7063', margin: 0 }}>
                Personalized action steps, daily habit reminders, and practical sleep/stress tools.
              </p>
            </div>

            {/* Personalized Action Plan */}
            <div className="wellness-card" style={{ padding: '14px', backgroundColor: '#EEF4E8', border: '1.5px solid #B8D4A8' }}>
              <strong style={{ fontSize: '13px', color: '#38571A' }}>🎯 Personalized Action Plan</strong>
              <p style={{ fontSize: '12px', color: '#2B4214', margin: '6px 0 0', lineHeight: 1.5 }}>
                {supportPlan.personalizedActionPlan}
              </p>
            </div>

            {/* Habit Reminders List */}
            <div className="wellness-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
              <strong style={{ fontSize: '13px', color: '#242820' }}>⏰ Habit Reminders to Keep You on Track</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {supportPlan.habitReminders.map((h, i) => (
                  <div key={i} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: '#FAF8F0', fontSize: '12px', color: '#4F5C38', fontWeight: 600 }}>
                    • {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Tips for Sleep & Stress */}
            <div className="wellness-card" style={{ padding: '14px', backgroundColor: '#FAF6D9', border: '1px solid #E8DEB2' }}>
              <strong style={{ fontSize: '13px', color: '#7D6608' }}>💡 Practical Tips for Sleep & Stress</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {supportPlan.practicalTipsSleepStress.map((t, i) => (
                  <div key={i} style={{ fontSize: '11.5px', color: '#5D4037', lineHeight: 1.4 }}>
                    • {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A for Doubts */}
            <div className="wellness-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
              <strong style={{ fontSize: '13px', color: '#0A1C44' }}>❓ Frequently Asked Questions & Clinical Doubts</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {supportPlan.doubtsAndAnswers.map((qa, i) => (
                  <div key={i} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#F8F6EF' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#242820' }}>Q: {qa.question}</div>
                    <div style={{ fontSize: '11.5px', color: '#66734A', marginTop: '3px' }}>A: {qa.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 8: CLINICAL FORMULA ENGINE & MACRONUTRIENT BASICS
           ========================================================================= */}
        {activeSection === 8 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <ProteinFatRequirementFormulaView
              initialWeight={lifestyle.currentWeightKg || 70}
              initialBodyFat={20}
              initialIntensity={2.0}
              clientName={personalInfo.fullName || 'Patient'}
              isEditable={true}
            />
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div
        style={{
          padding: '14px 18px calc(14px + env(safe-area-inset-bottom, 12px))',
          backgroundColor: '#FFFDF8',
          borderTop: '1px solid #D9D8CC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (activeSection > 1) {
              setActiveSection((prev) => prev - 1);
            } else if (onBack) {
              onBack();
            }
          }}
          className="btn-outline"
        >
          {activeSection === 1 ? 'Exit' : 'Previous'}
        </button>

        {activeSection < 7 ? (
          <button
            type="button"
            onClick={() => setActiveSection((prev) => prev + 1)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px', justifyContent: 'center' }}
          >
            <span>Next Section</span>
            <ArrowRight size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSaveAndConfirm}
            disabled={isSaving}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#38571A', borderColor: '#38571A', minWidth: '180px', justifyContent: 'center' }}
          >
            <Send size={15} />
            <span>{isSaving ? 'Confirming...' : 'Confirm & Book Session'}</span>
          </button>
        )}
      </div>

      {/* Official Agreement Certificate Poster Modal */}
      {showAgreementPosterModal && (
        <div 
          onClick={() => setShowAgreementPosterModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '92vh',
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              backgroundColor: '#1C2D1F',
              borderBottom: '2px solid #C5A059'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#E8C882', letterSpacing: '0.5px' }}>
                COUNSELING AGREEMENT - OFFICIAL CERTIFICATE
              </span>
              <button
                type="button"
                onClick={() => setShowAgreementPosterModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '8px', overflowY: 'auto', maxHeight: 'calc(92vh - 56px)', display: 'flex', justifyContent: 'center', backgroundColor: '#111' }}>
              <img 
                src={oneOnOneAgreement.imagePath} 
                alt="One on One Counseling Agreement Certificate" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '82vh',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  border: '1px solid #C5A059'
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
