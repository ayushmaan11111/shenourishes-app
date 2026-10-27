import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingWizard } from './screens/OnboardingWizard';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NutritionScreen } from './screens/NutritionScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { GoalRecommendationManagerModal } from './components/admin/GoalRecommendationManagerModal';
import { ClinicalDietChartEditorModal } from './components/admin/ClinicalDietChartEditorModal';
import { SupplementFormulaManagerModal } from './components/admin/SupplementFormulaManagerModal';
import { initializeNativeBridge } from './services/nativeBridge';
import { Loader2, ShieldCheck, Database, FileSpreadsheet, Target } from 'lucide-react';

type TabType = 'home' | 'nutrition' | 'activity' | 'progress' | 'profile';

const AppContent: React.FC = () => {
  const { user, customerRecord, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  const [onboardingFinished, setOnboardingFinished] = useState(false);
  const [isAdminPortalActive, setIsAdminPortalActive] = useState(() => 
    typeof window !== 'undefined' && window.location.hash.includes('admin')
  );

  // Admin Quick Access Modal States
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDietChartModal, setShowDietChartModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  useEffect(() => {
    // Check initial hash
    if (window.location.hash.includes('admin')) {
      setIsAdminPortalActive(true);
    }

    // Dynamic hash change listener for #admin navigation
    const handleHashChange = () => {
      if (window.location.hash.includes('admin')) {
        setIsAdminPortalActive(true);
      } else {
        setIsAdminPortalActive(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initialize Native Android & iOS capabilities
    initializeNativeBridge(() => {
      // Android hardware back button handler
      if (isAdminPortalActive) {
        setIsAdminPortalActive(false);
        window.location.hash = '';
        return true;
      }
      if (isEditingAssessment) {
        setIsEditingAssessment(false);
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false; // Exit app if on main Home
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isEditingAssessment, activeTab, isAdminPortalActive]);

  // 1. Direct Full-Screen Admin Portal (Always Accessible via #admin or toggle)
  if (isAdminPortalActive) {
    return (
      <AdminDashboardScreen
        onExitAdmin={() => {
          setIsAdminPortalActive(false);
          window.location.hash = '';
        }}
        clientId={user?.uid || 'default'}
        clientName={customerRecord?.personalDetails?.fullName || 'Client'}
      />
    );
  }

  // 2. Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 3. Initial Auth & State Loading
  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          backgroundColor: '#F8F6EF',
        }}
      >
        <Loader2 size={32} className="animate-spin" color="#66734A" />
        <span style={{ marginTop: '12px', fontSize: '13px', color: '#6B7063', fontWeight: 500 }}>
          Connecting securely...
        </span>
      </div>
    );
  }

  // 4. Unauthenticated -> Auth Screen (with direct Admin access button)
  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
        <button
          type="button"
          onClick={() => {
            window.location.hash = 'admin';
            setIsAdminPortalActive(true);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 10px',
            borderRadius: '9999px',
            backgroundColor: '#0A1C44',
            color: '#E8CA56',
            fontSize: '11px',
            fontWeight: 800,
            border: '1.5px solid #E8CA56',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
          }}
          title="Open Admin Portal"
        >
          <ShieldCheck size={13} />
          <span>Admin Portal</span>
        </button>
        <AuthScreen />
      </div>
    );
  }

  // 5. Authenticated, but onboarding is not completed -> Onboarding Wizard
  const localOnboardingCompleted = typeof window !== 'undefined' && (
    localStorage.getItem('she_nourishes_onboarding_completed_' + (user?.uid || 'guest')) === 'true' ||
    (user?.uid && localStorage.getItem('she_nourishes_onboarding_completed_' + user.uid) === 'true')
  );
  const onboardingCompleted = Boolean(customerRecord?.metadata?.onboardingCompleted) || Boolean(localOnboardingCompleted) || onboardingFinished;

  if (!onboardingCompleted && !isEditingAssessment) {
    return (
      <OnboardingWizard
        onComplete={() => {
          const uid = user?.uid || customerRecord?.uid || 'guest';
          if (typeof window !== 'undefined') {
            localStorage.setItem('she_nourishes_onboarding_completed_' + uid, 'true');
            if (user?.uid) {
              localStorage.setItem('she_nourishes_onboarding_completed_' + user.uid, 'true');
            }
          }
          setOnboardingFinished(true);
          setActiveTab('home');
        }}
      />
    );
  }

  // 6. Review / Edit Assessment from Profile
  if (isEditingAssessment) {
    return (
      <OnboardingWizard
        isEditingMode={true}
        onExitEdit={() => setIsEditingAssessment(false)}
        onComplete={() => setIsEditingAssessment(false)}
      />
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToProfile={() => setActiveTab('profile')}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'nutrition':
        return <NutritionScreen onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'activity':
        return <ActivityScreen onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'progress':
        return <ProgressScreen onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'profile':
        return (
          <ProfileScreen
            onStartEditAssessment={() => setIsEditingAssessment(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      default:
        return (
          <PlaceholderScreen
            type={activeTab as 'activity'}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      {/* Direct Admin Desk Floating Shortcut */}
      <button
        type="button"
        onClick={() => {
          window.location.hash = 'admin';
          setIsAdminPortalActive(true);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '9999px',
          backgroundColor: '#0A1C44',
          color: '#E8CA56',
          fontSize: '10.5px',
          fontWeight: 800,
          border: '1px solid #E8CA56',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          opacity: 0.85,
        }}
        title="Open Admin Portal"
      >
        <ShieldCheck size={12} />
        <span>Admin Desk</span>
      </button>

      {/* Main Screen Content */}
      {renderActiveScreen()}

      {/* Admin Quick Access Menu Modal */}
      {showAdminMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 24, 18, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
          }}
        >
          <div className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '420px', backgroundColor: '#FFFDF8', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#0A1C44" />
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#242820', margin: 0 }}>
                  Admin & Nutritionist Portal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminMenu(false)}
                style={{ padding: '4px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => { setShowAdminMenu(false); setShowFormulaModal(true); }}
                className="selectable-card"
                style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EBF4F6', color: '#2B6A78', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '13.5px', color: '#242820' }}>Supplement Formula Engine</strong>
                  <p style={{ fontSize: '11px', color: '#6B7063', margin: 0 }}>Body comp math, formulas & client overrides</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setShowAdminMenu(false); setShowDietChartModal(true); }}
                className="selectable-card"
                style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#0A1C44', color: '#FFFDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '13.5px', color: '#242820' }}>Clinical Diet Chart Editor</strong>
                  <p style={{ fontSize: '11px', color: '#6B7063', margin: 0 }}>Publish /Sedentary Excel-style meal plans</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setShowAdminMenu(false); setShowGoalModal(true); }}
                className="selectable-card"
                style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F3EFE0', color: '#4F5C38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '13.5px', color: '#242820' }}>Goal & Recommendation Rules</strong>
                  <p style={{ fontSize: '11px', color: '#6B7063', margin: 0 }}>Configure goal triggers & icon registry</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowAdminMenu(false)}
            >
              Close Portal
            </button>
          </div>
        </div>
      )}

      {/* Admin Modals */}
      <SupplementFormulaManagerModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        clientId={user?.uid || 'default'}
        clientName={customerRecord?.personalDetails?.fullName || 'Client'}
      />

      <ClinicalDietChartEditorModal
        isOpen={showDietChartModal}
        onClose={() => setShowDietChartModal(false)}
        clientId={user?.uid || 'default'}
        clientName={customerRecord?.personalDetails?.fullName || 'Client'}
      />

      <GoalRecommendationManagerModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DeviceFrame>
        <AppContent />
      </DeviceFrame>
    </AuthProvider>
  );
}

export default App;
