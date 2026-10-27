import React, { useState } from 'react';
import { 
  Apple, 
  Activity, 
  TrendingUp, 
  Home as HomeIcon, 
  User as UserIcon,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ClientDailyWorkoutPlanView } from '../components/workout/ClientDailyWorkoutPlanView';
import { ClientWorkoutIntensityCard } from '../components/workout/ClientWorkoutIntensityCard';

interface ActivityScreenProps {
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ onNavigateTab }) => {
  const { user, customerRecord } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'daily-plan' | 'intensity-timer'>('daily-plan');

  const clientId = user?.uid || customerRecord?.uid || 'default';
  const clientName = customerRecord?.personalDetails?.fullName || 'Client';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F6EF',
        minHeight: '100%',
        paddingBottom: '80px',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#66734A',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Movement & Performance
            </span>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#1A201A',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              Activity & Exercise
            </h1>
          </div>
        </div>

        {/* Sub-tab Switcher Pill */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F1EEDF',
            borderRadius: '9999px',
            padding: '3px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveSubTab('daily-plan')}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeSubTab === 'daily-plan' ? '#0A1C44' : 'transparent',
              color: activeSubTab === 'daily-plan' ? '#E8CA56' : '#64748B',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Daily Workout Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('intensity-timer')}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeSubTab === 'intensity-timer' ? '#0A1C44' : 'transparent',
              color: activeSubTab === 'intensity-timer' ? '#E8CA56' : '#64748B',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Intensity & Timer
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '16px 20px', flex: 1 }}>
        {activeSubTab === 'daily-plan' ? (
          <ClientDailyWorkoutPlanView
            clientId={clientId}
            clientName={clientName}
            onNavigateTab={onNavigateTab}
          />
        ) : (
          <ClientWorkoutIntensityCard
            clientId={clientId}
            clientName={clientName}
            onNavigateToActivity={() => setActiveSubTab('daily-plan')}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          onClick={() => onNavigateTab('home')}
          className="nav-item"
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
          className="nav-item is-active"
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
