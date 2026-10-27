import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Target,
  ChevronRight, 
  FileText, 
  Home as HomeIcon,
  Apple,
  TrendingUp,
  User as UserIcon,
  HeartHandshake, 
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CounsellingPackageScreen } from './CounsellingPackageScreen';
import { BloodTestScheduleScreen } from './BloodTestScheduleScreen';
import { ParQHealthScreen } from './ParQHealthScreen';
import { GiftVouchersScreen } from './GiftVouchersScreen';
import { DailyEatingHabitsScreen } from './DailyEatingHabitsScreen';
import { LongTermSupportScreen } from './LongTermSupportScreen';
import { TodaysOverviewFollowUpBoxes } from '../components/common/TodaysOverviewFollowUpBoxes';

interface HomeScreenProps {
  onNavigateToProfile: () => void;
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToProfile,
  onNavigateTab,
}) => {
  const { customerRecord } = useAuth();
  const [activeSubScreen, setActiveSubScreen] = useState<'none' | 'counselling' | 'blood-tests' | 'parq' | 'vouchers' | 'eating-habits' | 'long-term-support'>('none');

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

  // Determine user's first name
  const fullName = customerRecord?.personalDetails?.fullName || 'Valued Member';
  const firstName = fullName.split(' ')[0] || 'Friend';

  // Extract primary goals
  const primaryGoals = customerRecord?.goalAssessment?.primaryGoals || [];
  const mainGoal = primaryGoals.length > 0 ? primaryGoals[0] : 'Wellness Transformation';
  const extraGoalsCount = primaryGoals.length > 1 ? primaryGoals.length - 1 : 0;

  // Dietary preference label
  const dietType = customerRecord?.dietaryNutrition?.dietType || 'Personalized';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F6EF',
        minHeight: '100%',
      }}
    >

      {/* Top App Header */}
      <div
        style={{
          padding: '16px 20px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #D9D8CC',
          backgroundColor: '#F8F6EF',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              backgroundColor: '#66734A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFDF8',
              boxShadow: '0 4px 12px rgba(102, 115, 74, 0.25)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <span className="font-serif" style={{ fontSize: '18px', fontWeight: 600, color: '#242820' }}>
              She Nourishes
            </span>
          </div>
        </div>

        {/* Profile / Avatar Button */}
        <button
          type="button"
          onClick={onNavigateToProfile}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#F1EEDF',
            border: '2px solid #66734A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4F5C38',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
          aria-label="View Profile"
        >
          {firstName.charAt(0).toUpperCase()}
        </button>
      </div>

      {/* Main Scrollable Feed */}
      <div style={{ flex: 1, padding: '20px 18px 28px', overflowY: 'auto' }}>
        {/* Dynamic Greeting */}
        <div style={{ marginBottom: '22px' }}>
          <h2
            className="font-serif"
            style={{
              fontSize: '25px',
              fontWeight: 600,
              color: '#242820',
              lineHeight: 1.25,
            }}
          >
            Good morning, {firstName}
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7063', marginTop: '4px' }}>
            Let's make today a healthier one.
          </p>
        </div>

        {/* Dynamic "MY GOALS" Card */}
        <div
          className="wellness-card"
          style={{
            backgroundColor: '#4F5C38',
            color: '#FFFDF8',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(79, 92, 56, 0.22)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#D9D8CC',
              }}
            >
              Your Current Goal
            </span>
            <span
              style={{
                backgroundColor: 'rgba(255, 253, 248, 0.15)',
                padding: '3px 9px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 500,
                color: '#FFFDF8',
              }}
            >
              {dietType}
            </span>
          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={22} color="#F1EEDF" />
            <span>{mainGoal}</span>
            {extraGoalsCount > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 400, opacity: 0.85 }}>
                +{extraGoalsCount} more
              </span>
            )}
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 253, 248, 0.2)', margin: '10px 0' }} />

          <p style={{ fontSize: '12px', color: '#F1EEDF', opacity: 0.9 }}>
            Your personalized journey starts here. Your clinical nutrition assessment is complete and saved.
          </p>
        </div>

        {/* Today's Overview Section: Compact Reminders, Hydration & Clinical Notes */}
        <TodaysOverviewFollowUpBoxes
          isAdmin={false}
          clientId={customerRecord?.uid || 'default'}
          clientName={customerRecord?.personalDetails?.fullName || 'Valued Member'}
          onOpenCounselling={() => setActiveSubScreen('counselling')}
          onOpenLongTerm={() => setActiveSubScreen('long-term-support')}
          onOpenDietChart={() => onNavigateTab('nutrition')}
        />

        {/* Clinical Services (1-on-1 Counselling & Long-Term Support) */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
              Consultation & Perks
            </h3>
            <span style={{ fontSize: '11px', color: '#0A1C44', fontWeight: 700, backgroundColor: '#E8CA56', padding: '2px 8px', borderRadius: '4px' }}>
              VIP Support
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {/* 1-on-1 Counselling Sessions */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveSubScreen('counselling')}
              className="selectable-card"
              style={{ padding: '14px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', border: '1.5px solid #0A1C44', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#0A1C44',
                  color: '#E8CA56',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeartHandshake size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44' }}>1-on-1 Counselling</div>
                <div style={{ fontSize: '11px', color: '#66734A', fontWeight: 600 }}>Video / Slot →</div>
              </div>
            </div>

            {/* Long-Term Support Box */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveSubScreen('long-term-support')}
              className="selectable-card"
              style={{ padding: '14px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', border: '1.5px solid #0A1C44', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#0A1C44',
                  color: '#E8CA56',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44' }}>Long-Term Support</div>
                <div style={{ fontSize: '11px', color: '#66734A', fontWeight: 600 }}>10-Step Program →</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment summary banner */}
        <div
          onClick={onNavigateToProfile}
          className="wellness-card"
          style={{
            marginTop: '20px',
            backgroundColor: '#FAF8F0',
            border: '1px solid #D9D8CC',
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
                color: '#66734A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#242820' }}>
                Nutrition & Lifestyle Assessment
              </div>
              <div style={{ fontSize: '11px', color: '#6B7063' }}>
                11 of 11 steps completed • Tap to review or edit
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="#6B7063" />
        </div>
      </div>

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
