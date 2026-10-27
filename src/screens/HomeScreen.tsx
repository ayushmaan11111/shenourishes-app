import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ChevronRight, 
  FileText, 
  Home as HomeIcon,
  Apple, 
  TrendingUp, 
  User as UserIcon,
  HeartHandshake, 
  Calendar as CalendarIcon,
  Flame,
  Dumbbell,
  Users,
  Utensils,
  Bell,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CounsellingPackageScreen } from './CounsellingPackageScreen';
import { BloodTestScheduleScreen } from './BloodTestScheduleScreen';
import { ParQHealthScreen } from './ParQHealthScreen';
import { GiftVouchersScreen } from './GiftVouchersScreen';
import { DailyEatingHabitsScreen } from './DailyEatingHabitsScreen';
import { LongTermSupportScreen } from './LongTermSupportScreen';
import { ClientPackageCoreHubModal } from '../components/common/ClientPackageCoreHubModal';
import { checkPackageExpiryAlert } from '../services/clientTrackingService';
import { ClientWorkoutIntensityCard } from '../components/workout/ClientWorkoutIntensityCard';
import { ClientBloodTestStatusCard } from '../components/workout/ClientBloodTestStatusCard';
import { getDayExerciseProgress, getTodayDateKey } from '../services/workoutPlanService';
import { getClientActiveDietChart } from '../services/clinicalDietTemplates';
import { getDailyLog } from '../services/dailyTrackingService';

interface HomeScreenProps {
  onNavigateToProfile: () => void;
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

// Circular SVG Progress Component for Goal Card and Overview Mini Rings
const CircularProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  trackColor?: string;
  textColor?: string;
  label?: string;
  subLabel?: string;
}> = ({
  percentage,
  size = 66,
  strokeWidth = 6.5,
  strokeColor = '#34D399',
  trackColor = 'rgba(255, 255, 255, 0.16)',
  textColor = '#FFFFFF',
  label,
  subLabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size < 50 ? '11px' : '15px',
            fontWeight: 800,
            color: textColor,
          }}
        >
          {percentage}%
        </div>
      </div>
      {label && (
        <div style={{ marginTop: '7px', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
          {label}
        </div>
      )}
      {subLabel && (
        <div style={{ fontSize: '9.5px', color: '#A7C5B0', marginTop: '1px' }}>
          {subLabel}
        </div>
      )}
    </div>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToProfile,
  onNavigateTab,
}) => {
  const { customerRecord } = useAuth();
  const [activeSubScreen, setActiveSubScreen] = useState<'none' | 'counselling' | 'blood-tests' | 'parq' | 'vouchers' | 'eating-habits' | 'long-term-support'>('none');
  const [showCoreHubModal, setShowCoreHubModal] = useState<boolean>(false);
  const [coreHubInitialTab, setCoreHubInitialTab] = useState<'tests' | 'gifts' | 'sessions'>('sessions');

  if (activeSubScreen === 'counselling') {
    return <CounsellingPackageScreen onBack={() => setActiveSubScreen('none')} onNavigateTab={(tab) => onNavigateTab(tab as any)} />;
  }
  if (activeSubScreen === 'blood-tests') {
    return <BloodTestScheduleScreen onBack={() => setActiveSubScreen('none')} />;
  }
  if (activeSubScreen === 'parq') {
    return <ParQHealthScreen onBack={() => setActiveSubScreen('none')} />;
  }
  if (activeSubScreen === 'vouchers') {
    return <GiftVouchersScreen onBack={() => setActiveSubScreen('none')} />;
  }
  if (activeSubScreen === 'eating-habits') {
    return <DailyEatingHabitsScreen onBack={() => setActiveSubScreen('none')} />;
  }
  if (activeSubScreen === 'long-term-support') {
    return <LongTermSupportScreen onBack={() => setActiveSubScreen('none')} />;
  }

  // Determine user's name
  const fullName = customerRecord?.personalDetails?.fullName || 'Sneha De';
  const firstName = fullName.split(' ')[0] || 'Sneha';

  // Extract primary goal & diet preference
  const primaryGoals = customerRecord?.goalAssessment?.primaryGoals || [];
  const mainGoal = primaryGoals.length > 0 ? primaryGoals[0] : 'Muscle Fat Loss';
  const dietType = customerRecord?.dietaryNutrition?.dietType || 'NON-VEGETARIAN';

  // Dynamic date header (e.g., Aug 25 or today's date formatted)
  const todayFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());

  // Package Expiry check (7 days alert)
  const endDateStr = (customerRecord as any)?.planDetails?.endDate || new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
  const expiryCheck = checkPackageExpiryAlert(endDateStr);

  const clientId = customerRecord?.uid || 'default';

  // Live dynamic progress states
  const [activityPct, setActivityPct] = useState<number>(() => {
    return getDayExerciseProgress(clientId).percentage || 0;
  });
  const [foodPct, setFoodPct] = useState<number>(() => {
    const log = getDailyLog(clientId, getTodayDateKey());
    return Math.min(100, Math.round(((log.foodLogs?.length || 0) / 4) * 100));
  });
  const [dietPlanPct, setDietPlanPct] = useState<number>(() => {
    const chart = getClientActiveDietChart(clientId);
    const completed = chart.meals.filter((m) => m.isCompleted).length;
    return chart.meals.length > 0 ? Math.round((completed / chart.meals.length) * 100) : 0;
  });

  const refreshProgressMetrics = () => {
    // 1. Daily Activity percentage
    const prog = getDayExerciseProgress(clientId);
    setActivityPct(prog.percentage || 0);

    // 2. Food Intake status percentage
    const log = getDailyLog(clientId, getTodayDateKey());
    const foodItemsCount = log.foodLogs?.length || 0;
    // Normalized to 4 meals or logged items target
    const fPct = Math.min(100, Math.round((foodItemsCount / 4) * 100));
    setFoodPct(fPct > 0 ? fPct : 0);

    // 3. Diet Plan Adherence percentage
    const chart = getClientActiveDietChart(clientId);
    const completed = chart.meals.filter((m) => m.isCompleted).length;
    const total = chart.meals.length;
    const dPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    setDietPlanPct(dPct);
  };

  useEffect(() => {
    refreshProgressMetrics();

    const handleActivity = () => refreshProgressMetrics();
    const handleDiet = () => refreshProgressMetrics();

    window.addEventListener('daily_activity_progress_updated', handleActivity);
    window.addEventListener('client_workout_plan_updated', handleActivity);
    window.addEventListener('diet_chart_updated', handleDiet);

    return () => {
      window.removeEventListener('daily_activity_progress_updated', handleActivity);
      window.removeEventListener('client_workout_plan_updated', handleActivity);
      window.removeEventListener('diet_chart_updated', handleDiet);
    };
  }, [clientId]);

  const openCoreHub = (tab: 'tests' | 'gifts' | 'sessions') => {
    setCoreHubInitialTab(tab);
    setShowCoreHubModal(true);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F6EF',
        minHeight: '100%',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Top App Header with Greeting matching Figma / Client mockup */}
      <div
        style={{
          padding: '18px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8F6EF',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div>
          <h2
            className="font-serif"
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#1A201A',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Good morning, {firstName}
          </h2>
          <p style={{ fontSize: '13px', color: '#687265', margin: '3px 0 0' }}>
            Let's make today a healthier one.
          </p>
        </div>

        {/* Profile Avatar circle */}
        <button
          type="button"
          onClick={onNavigateToProfile}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            padding: 0,
            border: '2px solid #556B2F',
            backgroundColor: '#EEF4E8',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(85, 107, 47, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="View Profile"
        >
          <img
            src="/images/sneha_avatar.png"
            alt={fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </button>
      </div>

      {/* Main Scrollable Feed */}
      <div style={{ flex: 1, padding: '12px 18px 28px', overflowY: 'auto' }}>

        {/* 7-Day Package Expiry Alert Banner */}
        {expiryCheck.isExpiringIn7Days && (
          <div
            style={{
              marginBottom: '16px',
              padding: '14px 16px',
              backgroundColor: '#FEF3C7',
              border: '1.5px solid #F59E0B',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FDE68A',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                  7-Day Package Expiry Reminder
                </div>
                <p style={{ fontSize: '12.5px', color: '#78350F', margin: '4px 0 8px', lineHeight: 1.45 }}>
                  Hi {firstName}, your current package will be ending in 7 days. Would you like to continue with your nutrition and follow-up services?
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveSubScreen('long-term-support')}
                    style={{
                      padding: '5px 12px',
                      backgroundColor: '#B45309',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Renew / Extend Plan
                  </button>
                  <a
                    href="https://wa.me/917980862086?text=Hi%20Sneha%2C%20I%20would%20like%20to%20extend%20my%20nutrition%20and%20follow-up%20package."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '5px 12px',
                      backgroundColor: '#FFFFFF',
                      color: '#047857',
                      border: '1px solid #10B981',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HERO CARD: "YOUR CURRENT GOAL" (Exact dark forest green 100% matching WhatsApp Image 2026-09-24 at 16.56.17.jpeg) */}
        <div
          style={{
            backgroundColor: '#0F3822',
            backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(52, 211, 153, 0.15), transparent 70%)',
            color: '#FFFFFF',
            borderRadius: '22px',
            padding: '20px 18px 22px',
            marginBottom: '22px',
            boxShadow: '0 12px 28px rgba(15, 56, 34, 0.28)',
          }}
        >
          {/* Header row: YOUR CURRENT GOAL + DIET PILL */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#8CAE96',
              }}
            >
              YOUR CURRENT GOAL
            </span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              {dietType.toUpperCase()}
            </span>
          </div>

          {/* Goal title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '2px solid #5EEAD4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5EEAD4' }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              {mainGoal}
            </span>
          </div>

          {/* 3 Circular Rings in a Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <CircularProgress
              percentage={activityPct}
              size={68}
              strokeWidth={6.5}
              strokeColor="#34D399"
              label="Daily Activity"
              subLabel="Goal Achieved"
            />
            <CircularProgress
              percentage={foodPct}
              size={68}
              strokeWidth={6.5}
              strokeColor="#FB923C"
              label="Food Intake"
              subLabel="Goal Achieved"
            />
            <CircularProgress
              percentage={dietPlanPct}
              size={68}
              strokeWidth={6.5}
              strokeColor="#38BDF8"
              label="Diet Plan"
              subLabel="Goal Achieved"
            />
          </div>
        </div>

        {/* SECTION: TODAY'S OVERVIEW (Exact 7 cards in 2 rows matching WhatsApp Image 2026-09-24 at 16.56.17.jpeg) */}
        <div style={{ marginBottom: '22px' }}>
          {/* Section title & Calendar date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A201A', margin: 0, letterSpacing: '-0.2px' }}>
              Today's Overview
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#576352', fontWeight: 600 }}>
              <CalendarIcon size={14} />
              <span>{todayFormatted}</span>
            </div>
          </div>

          {/* Row 1: 3 Cards (Daily Activity, Food Intake Status, Diet Plan View Meals) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
            {/* Card 1: Daily Activity */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab('activity')}
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                borderRadius: '16px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '100px',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#DBEAFE',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Activity size={17} />
                </div>
                {/* Mini ring */}
                <CircularProgress percentage={activityPct} size={38} strokeWidth={4} strokeColor="#3B82F6" trackColor="#BFDBFE" textColor="#1E3A8A" />
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#1E3A8A', lineHeight: 1.25 }}>
                Daily Activity →
              </div>
            </div>

            {/* Card 2: Food Intake Status */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab('nutrition')}
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '16px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '100px',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Apple size={17} />
                </div>
                {/* Mini ring */}
                <CircularProgress percentage={foodPct} size={38} strokeWidth={4} strokeColor="#F97316" trackColor="#FED7AA" textColor="#9A3412" />
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#14532D', lineHeight: 1.25 }}>
                Food Intake Status →
              </div>
            </div>

            {/* Card 3: Diet Plan View Meals */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab('nutrition')}
              style={{
                backgroundColor: '#FEFCE8',
                border: '1px solid #FEF08A',
                borderRadius: '16px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '100px',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF08A',
                    color: '#CA8A04',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Utensils size={17} />
                </div>
                {/* Mini ring */}
                <CircularProgress percentage={dietPlanPct} size={38} strokeWidth={4} strokeColor="#0EA5E9" trackColor="#BAE6FD" textColor="#0369A1" />
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#713F12', lineHeight: 1.25 }}>
                Diet Plan View Meals →
              </div>
            </div>
          </div>

          {/* Row 2: 4 Cards (Activity Workout, Follow-up Sessions, Exercise Plan, Daily Progress) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {/* Card 4: Activity Workout */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab('activity')}
              style={{
                backgroundColor: '#FFF1F2',
                border: '1px solid #FFE4E6',
                borderRadius: '14px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '85px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FFE4E6',
                  color: '#E11D48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame size={15} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#881337', lineHeight: 1.2, marginTop: '8px' }}>
                Activity Workout →
              </div>
            </div>

            {/* Card 5: Follow-up Sessions View Sessions */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => openCoreHub('sessions')}
              style={{
                backgroundColor: '#F5F3FF',
                border: '1.5px solid #DDD6FE',
                borderRadius: '14px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '85px',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={15} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#4C1D95', lineHeight: 1.2, marginTop: '8px' }}>
                Follow-up Sessions View Sessions →
              </div>
            </div>

            {/* Card 6: Exercise Plan Track Exercise */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab('activity')}
              style={{
                backgroundColor: '#FFF7ED',
                border: '1px solid #FFEDD5',
                borderRadius: '14px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '85px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FFEDD5',
                  color: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Dumbbell size={15} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7C2D12', lineHeight: 1.2, marginTop: '8px' }}>
                Exercise Plan Track Exercise →
              </div>
            </div>

            {/* Card 7: Daily Progress View Stats */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab('progress')}
              style={{
                backgroundColor: '#F0FDFA',
                border: '1px solid #CCFBF1',
                borderRadius: '14px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '85px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#CCFBF1',
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={15} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#134E4A', lineHeight: 1.2, marginTop: '8px' }}>
                Daily Progress View Stats →
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: WORKOUT INTENSITY & DAILY VIDEO SYSTEM */}
        <ClientWorkoutIntensityCard
          clientId={customerRecord?.uid || 'default'}
          clientName={fullName}
          onNavigateToActivity={() => onNavigateTab('activity')}
        />

        {/* SECTION: BLOOD TEST STATUS & LAB REPORT BOX */}
        <ClientBloodTestStatusCard
          clientId={customerRecord?.uid || 'default'}
          clientName={fullName}
          onOpenFullSchedule={() => setActiveSubScreen('blood-tests')}
        />

        {/* SECTION: CLINICAL PROTOCOLS & SERVICES (Exact matching WhatsApp Image 2026-09-24 at 16.56.17.jpeg) */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A201A', margin: 0, letterSpacing: '-0.2px' }}>
              Clinical Protocols & Services
            </h3>
            <span style={{ fontSize: '12px', color: '#687265', fontWeight: 500 }}>
              2 Services Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {/* Card 1: 1-on-1 Counselling (Opens CounsellingPackageScreen with Tests, Gift Vouchers, Sessions) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveSubScreen('counselling')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0B192C',
                  color: '#F6E05E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeartHandshake size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  1-on-1 Counselling
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                  Video / Coffee Shop Slot →
                </div>
              </div>
            </div>

            {/* Card 2: Long-Term Support */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveSubScreen('long-term-support')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0B192C',
                  color: '#F6E05E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  Long-Term Support
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                  Ongoing Guidance →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment summary banner */}
        <div
          onClick={onNavigateToProfile}
          style={{
            backgroundColor: '#FAF8F0',
            border: '1px solid #D9D8CC',
            borderRadius: '16px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#EEF4E8',
                color: '#556B2F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#242820' }}>
                Nutrition & Lifestyle Assessment
              </div>
              <div style={{ fontSize: '11px', color: '#6B7063' }}>
                11 of 11 steps completed • Tap to review
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="#6B7063" />
        </div>

      </div>

      {/* Core Hub Modal (Sessions, Tests, Gifts) */}
      <ClientPackageCoreHubModal
        isOpen={showCoreHubModal}
        onClose={() => setShowCoreHubModal(false)}
        clientId={customerRecord?.uid || 'default'}
        clientName={fullName}
        initialTab={coreHubInitialTab}
        isAdmin={false}
      />

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          onClick={() => onNavigateTab('home')}
          className="nav-item is-active"
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('nutrition')}
          className="nav-item"
        >
          <Apple size={20} />
          <span>Nutrition</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('activity')}
          className="nav-item"
        >
          <Activity size={20} />
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('progress')}
          className="nav-item"
        >
          <TrendingUp size={20} />
          <span>Progress</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="nav-item"
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
