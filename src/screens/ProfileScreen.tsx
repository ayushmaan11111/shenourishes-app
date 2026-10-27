import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  FileEdit, 
  Settings as SettingsIcon, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Target, 
  Scale, 
  Ruler,
  Home as HomeIcon,
  Apple,
  Activity,
  TrendingUp,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured, firebaseConfig } from '../services/firebase';
import { GoalRecommendationManagerModal } from '../components/admin/GoalRecommendationManagerModal';
import { ClinicalDietChartEditorModal } from '../components/admin/ClinicalDietChartEditorModal';
import { SupplementFormulaManagerModal } from '../components/admin/SupplementFormulaManagerModal';

interface ProfileScreenProps {
  onStartEditAssessment: () => void;
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onStartEditAssessment,
  onNavigateTab,
}) => {
  const { user, customerRecord, logout } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGoalManagerModal, setShowGoalManagerModal] = useState(false);
  const [showDietChartModal, setShowDietChartModal] = useState(false);
  const [showFormulaManagerModal, setShowFormulaManagerModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const personal = customerRecord?.personalDetails;
  const goals = customerRecord?.goalAssessment;
  const fullName = personal?.fullName || 'Valued Member';
  const email = user?.email || personal?.emailAddress || 'No email';
  const mobile = personal?.mobileNumber || 'Not provided';
  const primaryGoal = goals?.primaryGoals?.[0] || 'Health & Nutrition';

  const heightDisplay = personal?.height ? `${personal.height} ${personal.heightUnit || 'cm'}` : '—';
  const weightDisplay = personal?.weight ? `${personal.weight} ${personal.weightUnit || 'kg'}` : '—';

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setIsLoggingOut(true);
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

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
      {/* Profile Header */}
      <div
        style={{
          padding: '24px 20px 20px',
          backgroundColor: '#FFFDF8',
          borderBottom: '1px solid #D9D8CC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#F1EEDF',
            border: '3px solid #66734A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4F5C38',
            fontWeight: 700,
            fontSize: '28px',
            boxShadow: '0 4px 16px rgba(102, 115, 74, 0.15)',
            marginBottom: '12px',
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </div>

        <h2 className="font-serif" style={{ fontSize: '22px', fontWeight: 600, color: '#242820' }}>
          {fullName}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7063', fontSize: '13px', marginTop: '4px' }}>
          <Mail size={14} />
          <span>{email}</span>
        </div>

        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7063', fontSize: '12px', marginTop: '2px' }}>
            <Phone size={13} />
            <span>{mobile}</span>
          </div>
        )}

        {/* Quick biometric chips */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F8F6EF',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              color: '#4F5C38',
              border: '1px solid #D9D8CC',
              fontWeight: 500,
            }}
          >
            <Target size={14} />
            <span>{primaryGoal}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F8F6EF',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              color: '#4F5C38',
              border: '1px solid #D9D8CC',
              fontWeight: 500,
            }}
          >
            <Ruler size={14} />
            <span>{heightDisplay}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F8F6EF',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              color: '#4F5C38',
              border: '1px solid #D9D8CC',
              fontWeight: 500,
            }}
          >
            <Scale size={14} />
            <span>{weightDisplay}</span>
          </div>

          {customerRecord?.planSelection && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#EEF4E8',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                color: '#4F5C38',
                border: '1px solid #B3C8A0',
                fontWeight: 600,
              }}
            >
              <span>{customerRecord.planSelection.planName.split(' ')[0]} Plan</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Actions List */}
      <div style={{ flex: 1, padding: '20px 18px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Edit Assessment Button */}
          <div
            role="button"
            tabIndex={0}
            onClick={onStartEditAssessment}
            className="selectable-card"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF4E8',
                  color: '#66734A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileEdit size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
                  Review & Edit Assessment
                </div>
                <div style={{ fontSize: '12px', color: '#6B7063' }}>
                  Update your nutrition, goals, health and habits
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#6B7063" />
          </div>

          {/* Clinical Diet Chart Editor (Nutritionist / Admin) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowDietChartModal(true)}
            className="selectable-card"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#0A1C44',
                  color: '#FFFDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Apple size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
                  Clinical Diet Chart Editor
                </div>
                <div style={{ fontSize: '12px', color: '#6B7063' }}>
                  Prescribe & publish /Sedentary clinical diet charts to client
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#6B7063" />
          </div>

          {/* Supplement Formula & Calculation Engine (Admin / Clinical) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowFormulaManagerModal(true)}
            className="selectable-card"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EBF4F6',
                  color: '#2B6A78',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Database size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
                  Supplement Formula & Calculation Engine
                </div>
                <div style={{ fontSize: '12px', color: '#6B7063' }}>
                  Body composition math, editable formulas & client overrides
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#6B7063" />
          </div>

          {/* Goal & Recommendation Manager (Admin / Clinical) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowGoalManagerModal(true)}
            className="selectable-card"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#F3EFE0',
                  color: '#4F5C38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
                  Goal & Recommendation Manager
                </div>
                <div style={{ fontSize: '12px', color: '#6B7063' }}>
                  Configure goals, supplements & clinical recommendation rules
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#6B7063" />
          </div>

          {/* Account Settings */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowSettingsModal(true)}
            className="selectable-card"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#F1EEDF',
                  color: '#4F5C38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SettingsIcon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#242820' }}>
                  Settings & Architecture
                </div>
                <div style={{ fontSize: '12px', color: '#6B7063' }}>
                  Firebase connection, security & version info
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#6B7063" />
          </div>

          {/* Logout */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleLogout}
            className="selectable-card"
            style={{ padding: '16px', borderColor: '#E69C90' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FDF0EE',
                  color: '#C85A48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogOut size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#C85A48' }}>
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7063' }}>
                  Securely terminate your active session
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#C85A48" />
          </div>
        </div>

        {/* Security & Architecture Badge */}
        <div
          className="wellness-card"
          style={{
            marginTop: '24px',
            backgroundColor: '#FAF8F0',
            border: '1px solid #D9D8CC',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <ShieldCheck size={18} color="#66734A" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#242820' }}>
                Secure Firebase Architecture (Phase 1)
              </div>
              <p style={{ fontSize: '11px', color: '#6B7063', marginTop: '2px', lineHeight: 1.4 }}>
                Customer data is isolated under <code>customers/{user?.uid?.substring(0, 8)}...</code> protected with authenticated UID security rules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(36, 40, 32, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="wellness-card" style={{ width: '100%', maxWidth: '380px', backgroundColor: '#FFFDF8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Database size={20} color="#66734A" />
              <h3 style={{ fontSize: '17px', fontWeight: 600 }}>System Configuration</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBE9DC' }}>
                <span style={{ color: '#6B7063' }}>Firebase Status:</span>
                <span style={{ fontWeight: 600, color: isFirebaseConfigured ? '#718653' : '#D9A74A' }}>
                  {isFirebaseConfigured ? 'Active (Live Cloud)' : 'Demo Sandbox (Persistent)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBE9DC' }}>
                <span style={{ color: '#6B7063' }}>Customer UID:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '11px' }}>
                  {user?.uid || 'None'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBE9DC' }}>
                <span style={{ color: '#6B7063' }}>App Version:</span>
                <span style={{ fontWeight: 600 }}>Phase 1 (v1.0.0)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#6B7063' }}>Project ID:</span>
                <span style={{ fontWeight: 600 }}>{firebaseConfig.projectId || 'demo-she-nourishes'}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowSettingsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Goal & Recommendation Manager Modal (Admin / Clinical) */}
      <GoalRecommendationManagerModal
        isOpen={showGoalManagerModal}
        onClose={() => setShowGoalManagerModal(false)}
      />

      {/* Clinical Diet Chart Editor Modal (Admin / Nutritionist) */}
      <ClinicalDietChartEditorModal
        isOpen={showDietChartModal}
        onClose={() => setShowDietChartModal(false)}
        clientId={user?.uid || 'default'}
        clientName={fullName}
      />

      {/* Supplement Formula & Calculation Engine Modal (Admin / Clinical) */}
      <SupplementFormulaManagerModal
        isOpen={showFormulaManagerModal}
        onClose={() => setShowFormulaManagerModal(false)}
        clientId={user?.uid || 'default'}
        clientName={fullName}
      />

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
          className="nav-item is-active"
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
