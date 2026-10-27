import React from 'react';
import { 
  Sparkles, 
  Apple, 
  Activity, 
  TrendingUp, 
  Home as HomeIcon, 
  User as UserIcon 
} from 'lucide-react';

interface PlaceholderScreenProps {
  type: 'nutrition' | 'activity' | 'progress';
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ type, onNavigateTab }) => {
  const getDetails = () => {
    switch (type) {
      case 'nutrition':
        return {
          icon: <Apple size={36} color="#66734A" />,
          title: 'Nutrition & Meal Plans',
          subtitle: 'Personalized meal recommendations and micronutrient logging are arriving in Phase 2.',
        };
      case 'activity':
        return {
          icon: <Activity size={36} color="#8A9568" />,
          title: 'Activity & Exercise',
          subtitle: 'Structured workout guidance and daily movement tracking are arriving in Phase 2.',
        };
      case 'progress':
        return {
          icon: <TrendingUp size={36} color="#4F5C38" />,
          title: 'Progress & Biometrics',
          subtitle: 'Visceral waist measurements, body composition graphs, and progress analytics are arriving in Phase 2.',
        };
    }
  };

  const details = getDetails();

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
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            backgroundColor: '#F1EEDF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 4px 16px rgba(102, 115, 74, 0.12)',
          }}
        >
          {details.icon}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: '#EEF4E8',
            color: '#4F5C38',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          <Sparkles size={12} />
          <span>Phase 2 Feature</span>
        </div>

        <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#242820', marginBottom: '8px' }}>
          {details.title}
        </h2>

        <p style={{ fontSize: '13px', color: '#6B7063', maxWidth: '300px', lineHeight: 1.5, marginBottom: '24px' }}>
          {details.subtitle}
        </p>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => onNavigateTab('home')}
          style={{ maxWidth: '200px' }}
        >
          Return to Home
        </button>
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
          className={`nav-item ${type === 'nutrition' ? 'is-active' : ''}`}
        >
          <Apple size={20} />
          <span>Nutrition</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('activity')}
          className={`nav-item ${type === 'activity' ? 'is-active' : ''}`}
        >
          <Activity size={20} />
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('progress')}
          className={`nav-item ${type === 'progress' ? 'is-active' : ''}`}
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
