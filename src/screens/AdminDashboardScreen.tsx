import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  FileSpreadsheet, 
  Target, 
  ChevronRight, 
  ArrowLeft,
  Users,
  Search,
  Plus,
  RefreshCw,
  HeartHandshake,
  TestTube,
  FileCheck,
  Sparkles,
  Bell,
  Heart,
  Send,
  MessageCircle,
  Clock,
  Zap,
  Dumbbell
} from 'lucide-react';
import { AdminWorkoutPlanAssignmentModal } from '../components/admin/AdminWorkoutPlanAssignmentModal';
import { SupplementFormulaManagerModal } from '../components/admin/SupplementFormulaManagerModal';
import { ClinicalDietChartEditorModal } from '../components/admin/ClinicalDietChartEditorModal';
import { ClinicalSupplementsCatalogModal } from '../components/admin/ClinicalSupplementsCatalogModal';
import { GoalRecommendationManagerModal } from '../components/admin/GoalRecommendationManagerModal';
import { ProteinFatRequirementFormulaModal } from '../components/admin/ProteinFatRequirementFormulaModal';
import { AdminLongTermSupportModal } from '../components/admin/AdminLongTermSupportModal';
import { LeadRegistrationDataBookModal } from '../components/admin/LeadRegistrationDataBookModal';
import { LongTermSupportDataBookModal } from '../components/admin/LongTermSupportDataBookModal';
import { LongTermLeadDataModal } from '../components/admin/LongTermLeadDataModal';
import { LongTermSoldDataModal } from '../components/admin/LongTermSoldDataModal';
import { LongTermReminderHubModal } from '../components/admin/LongTermReminderHubModal';
import { getLongTermLeads, getLongTermSoldClients } from '../services/longTermDataBookService';
import { AdminCounsellingRealBox } from '../components/admin/AdminCounsellingRealBox';
import { TodaysOverviewFollowUpBoxes } from '../components/common/TodaysOverviewFollowUpBoxes';
import { PlanNotificationManagerModal } from '../components/notifications/PlanNotificationManagerModal';
import { CounsellingPackageScreen } from './CounsellingPackageScreen';
import { BloodTestScheduleScreen } from './BloodTestScheduleScreen';
import { ParQHealthScreen } from './ParQHealthScreen';
import { getClientSupplementPlan } from '../services/formulaEngineService';
import { getAllCustomerRecords, createDefaultCustomerRecord, saveFullCustomerRecord } from '../services/customerService';
import { getClientActiveDietChart } from '../services/clinicalDietTemplates';
import { getDailyLog } from '../services/dailyTrackingService';
import { calculateMifflinStJeorBmr } from '../utils/bmrCalculator';
import { getMetabolicBlueprint, type MetabolicBlueprintData } from '../services/metabolicBlueprintService';
import { AdminAgreementCollectionModal } from '../components/admin/AdminAgreementCollectionModal';
import { AdminClientPhotoScannerModal } from '../components/admin/AdminClientPhotoScannerModal';
import { AdminIntensityAssignmentModal } from '../components/admin/AdminIntensityAssignmentModal';
import { AdminPriorBloodTestModal } from '../components/admin/AdminPriorBloodTestModal';
import { AdminPlanDetailsBox } from '../components/admin/AdminPlanDetailsBox';
import { AdminLifestyleSupplementAssessmentModal } from '../components/admin/AdminLifestyleSupplementAssessmentModal';
import type { CustomerRecord, ActivityLevel } from '../types/customer';

interface AdminDashboardScreenProps {
  onExitAdmin?: () => void;
  clientId?: string;
  clientName?: string;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onExitAdmin,
  clientId: initialClientId = 'default',
}) => {
  const [clients, setClients] = useState<CustomerRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId);
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  const [clientBlueprint, setClientBlueprint] = useState<MetabolicBlueprintData | null>(null);
  const [dietChartRefreshKey, setDietChartRefreshKey] = useState<number>(0);

  // Modals state
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showDietChartModal, setShowDietChartModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [showBloodTestModal, setShowBloodTestModal] = useState(false);
  const [showParqModal, setShowParqModal] = useState(false);
  const [showProteinFatFormulaModal, setShowProteinFatFormulaModal] = useState(false);
  const [showSupplementsCatalogModal, setShowSupplementsCatalogModal] = useState(false);
  const [showLongTermSupportModal, setShowLongTermSupportModal] = useState(false);
  const [showLeadDataBookModal, setShowLeadDataBookModal] = useState(false);
  const [showLongTermDataBookModal, setShowLongTermDataBookModal] = useState(false);
  const [showPlanNotificationModal, setShowPlanNotificationModal] = useState(false);
  const [showCounsellingRealModal, setShowCounsellingRealModal] = useState(false);
  
  // Long-Term Support Databoxes & 3-in-1 Reminders Modal States
  const [showLongTermLeadDataModal, setShowLongTermLeadDataModal] = useState(false);
  const [showLongTermSoldDataModal, setShowLongTermSoldDataModal] = useState(false);
  const [showLongTermReminderHubModal, setShowLongTermReminderHubModal] = useState(false);
  const [longTermReminderDefaultTab, setLongTermReminderDefaultTab] = useState<'leads' | 'ending_soon' | 'validity'>('leads');
  const [ltLeadsCount, setLtLeadsCount] = useState(0);
  const [ltEndingSoonCount, setLtEndingSoonCount] = useState(0);
  const [ltValidityCount, setLtValidityCount] = useState(0);

  // New Admin Control Modals
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showPhotoScannerModal, setShowPhotoScannerModal] = useState(false);
  const [showIntensityModal, setShowIntensityModal] = useState(false);
  const [showPriorBloodTestModal, setShowPriorBloodTestModal] = useState(false);
  const [showLifestyleSupplementModal, setShowLifestyleSupplementModal] = useState(false);
  const [showWorkoutPlanModal, setShowWorkoutPlanModal] = useState(false);

  // New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientMobile, setNewClientMobile] = useState('');
  const [newClientWeight, setNewClientWeight] = useState('65');
  const [newClientActivity, setNewClientActivity] = useState('Moderately Active');

  // Load clients
  const loadClients = async () => {
    try {
      const records = await getAllCustomerRecords();
      setClients(records);
      if (records.length > 0 && selectedClientId === 'default') {
        setSelectedClientId(records[0].uid);
      }
    } catch (e) {
      console.warn('Error loading clients:', e);
    }
  };

  const loadLongTermCounts = async () => {
    try {
      const [lData, sData] = await Promise.all([
        getLongTermLeads(),
        getLongTermSoldClients(),
      ]);
      setLtLeadsCount(lData.length);
      setLtEndingSoonCount(sData.filter(c => c.daysRemaining <= 14).length);
      setLtValidityCount(sData.length);
    } catch (e) {
      console.warn('Error loading long term counts:', e);
    }
  };

  useEffect(() => {
    loadClients();
    loadLongTermCounts();
  }, []);

  const selectedClient = clients.find((c) => c.uid === selectedClientId) || clients[0] || null;
  const currentDietChart = selectedClient ? getClientActiveDietChart(selectedClient.uid) : null;
  const currentSupplementPlan = selectedClient ? getClientSupplementPlan(selectedClient.uid, selectedClient) : null;

  useEffect(() => {
    if (!selectedClient?.uid) return;
    let isCurrent = true;
    getMetabolicBlueprint(selectedClient.uid).then((bp) => {
      if (isCurrent) setClientBlueprint(bp);
    });
    return () => {
      isCurrent = false;
    };
  }, [selectedClient?.uid, dietChartRefreshKey]);

  useEffect(() => {
    const handleUpdate = () => {
      setDietChartRefreshKey((k) => k + 1);
    };
    window.addEventListener('metabolic_blueprint_updated', handleUpdate);
    window.addEventListener('diet_chart_updated', handleUpdate);
    return () => {
      window.removeEventListener('metabolic_blueprint_updated', handleUpdate);
      window.removeEventListener('diet_chart_updated', handleUpdate);
    };
  }, []);

  const handleCreateNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) return;

    const newUid = 'cust_' + Math.random().toString(36).substring(2, 9);
    const newRecord: CustomerRecord = {
      ...createDefaultCustomerRecord(newUid, newClientName.trim(), newClientEmail.trim(), newClientMobile.trim()),
      personalDetails: {
        fullName: newClientName.trim(),
        date: new Date().toISOString().split('T')[0],
        age: 30,
        gender: 'Female',
        mobileNumber: newClientMobile.trim(),
        emailAddress: newClientEmail.trim(),
        address: '',
        height: 162,
        heightUnit: 'cm',
        weight: parseFloat(newClientWeight) || 65,
        weightUnit: 'kg',
        waistCircumference: { atNaval: 78, aboveNaval: 74, belowNaval: 82, waistUnit: 'cm' },
      },
      physicalActivity: {
        preferredExerciseTypes: ['Strength Training'],
        currentActivityLevel: newClientActivity as ActivityLevel,
        calculatedIntensity: newClientActivity === 'Active at Gym' ? 2.5 : newClientActivity === 'Moderately Active' ? 2.0 : 1.5,
        activityTrait: 'Muscles gain',
        usualWorkoutIntensity: 'Moderate',
        usualWorkoutDuration: '45 – 60 min',
        realisticExerciseDaysPerWeek: '4 Days',
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        onboardingCompleted: true,
        currentOnboardingStep: 11,
        appVersion: '1.0.0',
      },
    };

    await saveFullCustomerRecord(newRecord);
    await loadClients();
    setSelectedClientId(newUid);
    setShowNewClientForm(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientMobile('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F2E8', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navigation Bar */}
      <header
        style={{
          backgroundColor: '#0A1C44',
          color: '#FFFFFF',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #E8CA56',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              fontWeight: 900,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SHE NOURISHES • CLINICAL COMMAND DESK
              </span>
              <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#1E356A', color: '#FFFDF8', fontWeight: 700 }}>
                ADMIN
              </span>
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Admin & Nutritionist Portal
            </h1>
          </div>
        </div>

        {/* Clean Single Row of Admin Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={loadClients}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFFDF8',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>Sync Clients</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDietChartModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            }}
          >
            <FileSpreadsheet size={14} />
            <span>Open Diet Planner</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPlanNotificationModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Bell size={14} />
            <span>Plan Notifications</span>
          </button>

          {onExitAdmin && (
            <button
              type="button"
              onClick={onExitAdmin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFDF8',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={14} />
              <span>Switch to Client App</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '1180px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* =========================================================================
            1-ON-1 COUNSELLING REAL FIREBASE MODAL WORKSPACE (HIDDEN TRIGGER CARD)
           ========================================================================= */}
        <AdminCounsellingRealBox
          isExternalOpen={showCounsellingRealModal}
          onCloseExternal={() => setShowCounsellingRealModal(false)}
          hideTriggerCard={true}
        />

        {/* =========================================================================
            SECTION 1: TODAY'S UPDATES (100% EXACT MATCH TO TARGET DESIGN)
           ========================================================================= */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '22px', backgroundColor: '#0066FE', borderRadius: '2px', flexShrink: 0 }} />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A1C44', margin: 0, letterSpacing: '-0.3px' }}>
                  Today's Updates
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0 12px', fontWeight: 500 }}>
                Follow-ups, reminders and recent activity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLeadDataBookModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 0',
              }}
            >
              <span>See all</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Icon Badges Row: Counselling & Sold Clients */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '56px', padding: '6px 0 4px' }}>
            {/* 1. Counselling Icon */}
            <div
              onClick={() => setShowCounsellingRealModal(true)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              title="1-on-1 Counselling Leads & Follow-ups"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#FFF1F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(225, 29, 72, 0.05)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <MessageCircle size={28} color="#BE185D" strokeWidth={1.8} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 5px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.35)',
                  }}
                >
                  8
                </span>
              </div>
              <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#0A1C44' }}>
                Counselling
              </span>
            </div>

            {/* 2. Sold Clients Icon */}
            <div
              onClick={() => setShowLongTermDataBookModal(true)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              title="Sold Clients Data Book"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <MessageCircle size={28} color="#16A34A" strokeWidth={1.8} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 5px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.35)',
                  }}
                >
                  3
                </span>
              </div>
              <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#0A1C44' }}>
                Sold Clients
              </span>
            </div>
          </div>

          {/* Action Banner: Send message for long term councilling suggestions */}
          <div
            onClick={() => setShowPlanNotificationModal(true)}
            style={{
              backgroundColor: '#F4F8FF',
              border: '1px solid #DCEBFF',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginTop: '4px',
              boxShadow: '0 1px 4px rgba(0, 102, 254, 0.03)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Send size={19} color="#0066FE" strokeWidth={2} style={{ transform: 'rotate(-5deg)' }} />
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>
                Send message for long term councilling suggestions
              </span>
            </div>
            <ChevronRight size={18} color="#64748B" />
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: LEADS AND SOLD DATABOX SECTIONS (100% EXACT MATCH)
           ========================================================================= */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '22px', backgroundColor: '#0066FE', borderRadius: '2px', flexShrink: 0 }} />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A1C44', margin: 0, letterSpacing: '-0.3px' }}>
                  Leads and Sold Databox Sections
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0 12px', fontWeight: 500 }}>
                View and manage your lead data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLeadDataBookModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 0',
              }}
            >
              <span>See all</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Cards Grid: 1 on 1 Counselling & 1 on 1 Sold Clients */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {/* Card 1: 1 on 1 Counselling */}
            <div
              onClick={() => setShowLeadDataBookModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '18px',
                padding: '18px',
                minHeight: '142px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              title="Open 1-on-1 Counselling Leads Data Book"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#0A1C44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(10, 28, 68, 0.2)',
                  }}
                >
                  <Heart size={22} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <ChevronRight size={18} color="#64748B" />
              </div>

              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1C44', lineHeight: 1.25 }}>
                  1 on 1
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1C44', lineHeight: 1.25 }}>
                  Counselling
                </div>
              </div>
            </div>

            {/* Card 2: 1 on 1 Sold Clients */}
            <div
              onClick={() => setShowLongTermDataBookModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '18px',
                padding: '18px',
                minHeight: '142px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              title="Open 1-on-1 Sold Clients Data Book"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#0A1C44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(10, 28, 68, 0.2)',
                  }}
                >
                  <Heart size={22} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <ChevronRight size={18} color="#64748B" />
              </div>

              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1C44', lineHeight: 1.25 }}>
                  1 on 1
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1C44', lineHeight: 1.25 }}>
                  Sold Clients
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            LONG-TERM SECTION 1: UPDATES & 3 REMINDER BOXES (EXACT MATCHING DESIGN)
           ========================================================================= */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px', marginTop: '6px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '22px', backgroundColor: '#059669', borderRadius: '2px', flexShrink: 0 }} />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#064E3B', margin: 0, letterSpacing: '-0.3px' }}>
                  Long-Term Updates & Reminders
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0 12px', fontWeight: 500 }}>
                Daily lead reminders, auto message switches & validity alerts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLongTermReminderDefaultTab('leads');
                setShowLongTermReminderHubModal(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 0',
              }}
            >
              <span>See all</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* 3 Reminder Badges / Boxes Row */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '36px', padding: '6px 0 4px', flexWrap: 'wrap' }}>
            {/* 1. Daily Lead Reminder Box (Connected with Long Term Leads) */}
            <div
              onClick={() => {
                setLongTermReminderDefaultTab('leads');
                setShowLongTermReminderHubModal(true);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              title="Daily Lead Reminders (Auto Message Switch / Manual / Scripted)"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#FFF1F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(225, 29, 72, 0.05)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <MessageCircle size={28} color="#BE185D" strokeWidth={1.8} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 5px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.35)',
                  }}
                >
                  {ltLeadsCount || 5}
                </span>
              </div>
              <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#064E3B' }}>
                Lead Reminders
              </span>
            </div>

            {/* 2. Package Ending Soon Msg Reminder Box */}
            <div
              onClick={() => {
                setLongTermReminderDefaultTab('ending_soon');
                setShowLongTermReminderHubModal(true);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              title="Package Ending Soon Msg Reminder Box"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Clock size={28} color="#D97706" strokeWidth={1.8} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 5px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.35)',
                  }}
                >
                  {ltEndingSoonCount || 2}
                </span>
              </div>
              <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#064E3B' }}>
                Ending Soon
              </span>
            </div>

            {/* 3. Auto Start Date & Validity Reminder Box */}
            <div
              onClick={() => {
                setLongTermReminderDefaultTab('validity');
                setShowLongTermReminderHubModal(true);
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              title="Auto Start Date & Validity Tracker"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Sparkles size={28} color="#16A34A" strokeWidth={1.8} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 5px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(5, 150, 105, 0.35)',
                  }}
                >
                  {ltValidityCount || 3}
                </span>
              </div>
              <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#064E3B' }}>
                Validity & Start
              </span>
            </div>
          </div>

          {/* Action Banner: Send automated validity & package renewal reminders */}
          <div
            onClick={() => {
              setLongTermReminderDefaultTab('ending_soon');
              setShowLongTermReminderHubModal(true);
            }}
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginTop: '4px',
              boxShadow: '0 1px 4px rgba(5, 150, 105, 0.03)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Send size={19} color="#059669" strokeWidth={2} style={{ transform: 'rotate(-5deg)' }} />
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#064E3B' }}>
                Send automated validity & package renewal reminders
              </span>
            </div>
            <ChevronRight size={18} color="#64748B" />
          </div>
        </section>

        {/* =========================================================================
            LONG-TERM SECTION 2: DATABOX SECTIONS (EXACT MATCH, ICONS DEEP GREEN)
           ========================================================================= */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '14px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '22px', backgroundColor: '#059669', borderRadius: '2px', flexShrink: 0 }} />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#064E3B', margin: 0, letterSpacing: '-0.3px' }}>
                  Long-Term Support Databox Sections
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0 12px', fontWeight: 500 }}>
                View and manage long-term lead data and sold clients.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLongTermLeadDataModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 0',
              }}
            >
              <span>See all</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Cards Grid: Long Term Support Leads & Long Term Sold Clients */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {/* Card 1: Long Term Support Lead Data Box */}
            <div
              onClick={() => setShowLongTermLeadDataModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #A7F3D0',
                borderRadius: '18px',
                padding: '18px',
                minHeight: '142px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(6, 78, 59, 0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              title="Open Long-Term Support Lead Data Box"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* DEEP GREEN ICON BOX AS REQUESTED */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#064E3B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                  }}
                >
                  <Heart size={22} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <ChevronRight size={18} color="#64748B" />
              </div>

              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', lineHeight: 1.25 }}>
                  Long Term Support
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', lineHeight: 1.25 }}>
                  Lead Data Box
                </div>
              </div>
            </div>

            {/* Card 2: Long Term Sold Data Box */}
            <div
              onClick={() => setShowLongTermSoldDataModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #A7F3D0',
                borderRadius: '18px',
                padding: '18px',
                minHeight: '142px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(6, 78, 59, 0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              title="Open Long-Term Sold Clients Data Box"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* DEEP GREEN ICON BOX AS REQUESTED */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#064E3B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                  }}
                >
                  <Heart size={22} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <ChevronRight size={18} color="#64748B" />
              </div>

              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', lineHeight: 1.25 }}>
                  Long Term Sold
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', lineHeight: 1.25 }}>
                  Data Box
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TODAY'S OVERVIEW: FOLLOW-UP MESSAGES HUB, CHAT & DIET CHART
           ========================================================================= */}
        <TodaysOverviewFollowUpBoxes
          isAdmin={true}
          clientId={selectedClientId}
          clientName={selectedClient?.personalDetails?.fullName || 'Client'}
          onOpenCounselling={() => setShowCounsellingModal(true)}
          onOpenLongTerm={() => setShowLongTermSupportModal(true)}
          onOpenDietChart={() => setShowDietChartModal(true)}
        />

        {/* =========================================================================
            CLIENT SELECTOR & ACTIVE PROFILE WORKSPACE
           ========================================================================= */}
        <div
          className="wellness-card animate-fade-in"
          style={{
            padding: '18px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #0B1E48',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#0A1C44" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                Client Directory & Prescription Manager
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Search input */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="#6B7063" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search client by name..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '28px', fontSize: '11.5px', padding: '5px 8px 5px 28px' }}
                />
              </div>

              {/* Add New Client Button */}
              <button
                type="button"
                onClick={() => setShowNewClientForm(true)}
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} />
                <span>Add Client</span>
              </button>
            </div>
          </div>

          {/* Client Selector Dropdown Pill Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {clients
              .filter((c) => (c.personalDetails?.fullName || '').toLowerCase().includes(clientSearchQuery.toLowerCase()))
              .map((c) => {
                const isSelected = c.uid === selectedClientId;
                const name = c.personalDetails?.fullName || 'Client';
                const weight = c.personalDetails?.weight || 65;
                const activity = c.physicalActivity?.currentActivityLevel || 'Sedentary';

                return (
                  <button
                    key={c.uid}
                    type="button"
                    onClick={() => setSelectedClientId(c.uid)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#0A1C44' : '#F4F2E8',
                      color: isSelected ? '#FFFFFF' : '#242820',
                      border: isSelected ? '1.5px solid #0A1C44' : '1px solid #D9D8CC',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      minWidth: '160px',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <strong style={{ fontSize: '13px' }}>{name}</strong>
                    <span style={{ fontSize: '10.5px', color: isSelected ? '#E8CA56' : '#66734A', marginTop: '1px' }}>
                      {weight}kg • {activity}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Admin Plan Details & Send Data Box */}
          {selectedClient && (
            <AdminPlanDetailsBox
              client={selectedClient}
              onOpenPhotoScanner={() => setShowPhotoScannerModal(true)}
              onOpenIntensityModal={() => setShowIntensityModal(true)}
              onOpenAgreementModal={() => setShowAgreementModal(true)}
              onOpenPriorBloodTestModal={() => setShowPriorBloodTestModal(true)}
              onOpenLifestyleSupplementModal={() => setShowLifestyleSupplementModal(true)}
            />
          )}

          {/* Active Client Details Card */}
          {selectedClient && (
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: '#FAF8F0',
                borderRadius: '8px',
                border: '1px solid #D9D8CC',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    {selectedClient.personalDetails?.fullName}
                  </h3>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontWeight: 700 }}>
                    Active Patient
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#6B7063', marginTop: '3px' }}>
                  Email: <strong>{selectedClient.personalDetails?.emailAddress}</strong> • Mobile: <strong>{selectedClient.personalDetails?.mobileNumber}</strong> • Weight: <strong>{selectedClient.personalDetails?.weight || 64} kg</strong>
                </div>
                
                {/* Real-time BMR & Body Comp & Schedule Summary */}
                {(() => {
                  const weight = selectedClient.personalDetails?.weight || 64;
                  let height = selectedClient.personalDetails?.height || 165;
                  if (selectedClient.personalDetails?.heightUnit === 'ft/in') {
                    height = Math.round(height * 30.48);
                  }
                  const age = selectedClient.personalDetails?.age || 28;
                  const bodyFat = selectedClient.personalDetails?.bodyFatPercentage ?? 24;
                  const gender = selectedClient.personalDetails?.gender || 'Female';
                  const activity = selectedClient.physicalActivity?.currentActivityLevel || 'Sedentary';

                  const bmrMath = calculateMifflinStJeorBmr(weight, height, age, gender, bodyFat, activity);
                  const wakeUp = selectedClient.lifestyleHealth?.wakeUpTime || '06:30 AM';
                  const sleep = selectedClient.lifestyleHealth?.sleepTime || '10:30 PM';
                  const mealsCount = selectedClient.dietaryNutrition?.mealsCount || (selectedClient.dietaryNutrition?.dailyMeals === '3 MEALS' ? 3 : selectedClient.dietaryNutrition?.dailyMeals === '5+ MEALS' ? 5 : 4);
                  const dietPattern = selectedClient.dietaryNutrition?.dietType || 'VEGETARIAN';
                  const foodCategories = (selectedClient.dietaryNutrition?.selectedFoodCategories || ['Dairy Products', 'Eggs', 'Whey Protein']).join(', ');
                  const archetype = selectedClient.dietaryNutrition?.dietArchetype || 'Pollo-Pescatarian Whey Protocol';

                  return (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#0A1C44', color: '#FFFFFF', fontWeight: 700 }}>
                          BMR: {bmrMath.bmr} kcal ({gender === 'Male' ? '+5' : '-161'})
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontWeight: 700 }}>
                          FFM: {bmrMath.fatFreeMassKg} kg (Fat Mass: {bmrMath.fatMassKg}kg • {bodyFat}%)
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#E8CA56', color: '#0A1C44', fontWeight: 800 }}>
                          🍽️ {mealsCount} Meals / Day Plan
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF6D9', color: '#6B5418', fontWeight: 700 }}>
                          ⚡ {archetype} ({dietPattern})
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1EEDF', color: '#4F5C38', fontWeight: 600 }}>
                          Schedule: ☀️ {wakeUp} ➔ 🌙 {sleep}
                        </span>
                      </div>

                      <div style={{ fontSize: '11px', color: '#2B4214', backgroundColor: '#EEF4E8', padding: '4px 8px', borderRadius: '4px', border: '1px solid #B8D4A8' }}>
                        🥗 <strong>Selected Food Preferences:</strong> {foodCategories}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ fontSize: '11.5px', color: '#4F5C38', marginTop: '6px' }}>
                  Primary Goals: <strong>{(selectedClient.goalAssessment?.primaryGoals || []).join(' • ') || 'General Wellness'}</strong>
                </div>
              </div>

              {/* Action Buttons for this Client */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowDietChartModal(true)}
                  className="btn-primary"
                  style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileSpreadsheet size={14} />
                  <span>Edit / Prescribe Diet Chart</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSupplementsCatalogModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #E8CA56',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Database size={14} />
                  <span>Suggested Supplements (16 Stacks)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCounsellingModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#FAF6D9',
                    color: '#6B5418',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #E8DEB2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <HeartHandshake size={14} />
                  <span>1-on-1 Counselling Protocol</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBloodTestModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF4E8',
                    color: '#38571A',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #B8D4A8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <TestTube size={14} />
                  <span>Blood Tests & Lab Reports</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowParqModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#FDF0EE',
                    color: '#C85A48',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #F5C6CB',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileCheck size={14} />
                  <span>PAR-Q Health Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowProteinFatFormulaModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#FAF8F0',
                    color: '#0A1C44',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1.5px solid #0A1C44',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📐 Protein & Fat Formulas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLongTermSupportModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    fontSize: '12px',
                    fontWeight: 800,
                    border: '1.5px solid #E8CA56',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={14} color="#E8CA56" />
                  <span>Long-Term Support (10 Steps)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPlanNotificationModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1.5px solid #BFDBFE',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="View and schedule automated Android & iOS plan push notifications"
                >
                  <Bell size={14} color="#2563EB" />
                  <span>📱 Plan Notifications (3-Phase)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAgreementModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1.5px solid #10B981',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="Collect and verify signed consultation agreement"
                >
                  <FileCheck size={14} color="#059669" />
                  <span>📋 Agreement Collection Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPhotoScannerModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1.5px solid #F59E0B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="Upload and scan client progress photos (Front, Side, Back)"
                >
                  <span>📷 Progress Photo Scanner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowIntensityModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#FAF5FF',
                    color: '#6B21A8',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1.5px solid #C084FC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="Assign workout intensity tier and plan start date"
                >
                  <Zap size={14} color="#9333EA" />
                  <span>⚡ Workout Intensity Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowWorkoutPlanModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    fontSize: '12px',
                    fontWeight: 800,
                    border: '1.5px solid #E8CA56',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(10,28,68,0.15)',
                  }}
                  title="Assign daily workout routines, illustrating videos, and YouTube links"
                >
                  <Dumbbell size={14} color="#E8CA56" />
                  <span>🏋️ Daily Workout Planner (Videos)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPriorBloodTestModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF4E8',
                    color: '#38571A',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1.5px solid #B8D4A8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="Attach prior blood tests and dedicated lipid profile panel"
                >
                  <TestTube size={14} color="#38571A" />
                  <span>🧪 Prior Tests & Lipid Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Prescribed Overview Snapshot for Active Client */}
          {selectedClient && currentDietChart && currentSupplementPlan && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {/* Prescribed Diet Snapshot */}
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                    Active Diet Plan
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#38571A', fontWeight: 700 }}>{currentDietChart.meals.length} Meals Prescribed</span>
                </div>
                <strong style={{ fontSize: '13px', color: '#242820' }}>{currentDietChart.title}</strong>
                <div style={{ fontSize: '11px', color: '#66734A' }}>{currentDietChart.dietTypeTag}</div>
                <div style={{ fontSize: '11px', color: '#6B7063', marginTop: '4px' }}>
                  Total Daily Target: <strong>{currentDietChart.totalMealPlanCalorie} kcal</strong>
                </div>
              </div>

              {/* Prescribed Supplement Stack Snapshot */}
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase' }}>
                    Active Supplement Protocol
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#38571A', fontWeight: 700 }}>{currentSupplementPlan.items.length} Active Items</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#242820' }}>
                  {currentSupplementPlan.items.slice(0, 3).map((item) => (
                    <span key={item.supplementId} style={{ display: 'inline-block', backgroundColor: '#F1EEDF', padding: '2px 6px', borderRadius: '4px', marginRight: '4px', marginBottom: '4px', fontSize: '10.5px', fontWeight: 600 }}>
                      {item.supplementName}: {item.finalAmount} {item.unit}
                    </span>
                  ))}
                  {currentSupplementPlan.items.length > 3 && <span style={{ fontSize: '10.5px', color: '#6B7063' }}>+{currentSupplementPlan.items.length - 3} more</span>}
                </div>
              </div>

              {/* Prescribed Metabolic Blueprint Snapshot */}
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #D9D8CC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>📐 Metabolic Blueprint</span>
                    </div>
                    {clientBlueprint ? (
                      <span style={{ fontSize: '10px', color: '#15803D', fontWeight: 800, backgroundColor: '#DEF7EC', padding: '2px 6px', borderRadius: '4px' }}>
                        ● Live Sync with Client App
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#B45309', fontWeight: 700, backgroundColor: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>
                        Pending Calibration
                      </span>
                    )}
                  </div>

                  {clientBlueprint ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0A1C44', backgroundColor: '#F1EEDF', padding: '2px 6px', borderRadius: '4px' }}>
                          {clientBlueprint.autoClassifiedDiet.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#047857', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                          {clientBlueprint.prescribedProtocol}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                        LBM: <strong>{clientBlueprint.leanBodyMassKg} kg</strong> ({clientBlueprint.bodyFatPercentage}% Body Fat) • Method: <strong>{clientBlueprint.lbmMethod.toUpperCase()}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#1E293B', marginTop: '2px' }}>
                        Targets: <strong>{clientBlueprint.proteinRequirementGrams}g Protein</strong> • <strong>{clientBlueprint.fatRequirementGrams}g Fat</strong>
                      </div>
                      {clientBlueprint.selectedLowGiCarbs && clientBlueprint.selectedLowGiCarbs.length > 0 && (
                        <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '3px' }}>
                          Low-GI Carbs: <em>{clientBlueprint.selectedLowGiCarbs.join(', ')}</em>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#6B7063', fontStyle: 'italic', margin: '4px 0' }}>
                      Calibrate patient's LBM, body fat %, and high-carb digestion to automatically publish their diet chart.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #F1EEDF' }}>
                  <button
                    type="button"
                    onClick={() => setShowProteinFatFormulaModal(true)}
                    style={{
                      width: '100%',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#0A1C44',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>📐 {clientBlueprint ? 'Re-calibrate Blueprint' : 'Calibrate Blueprint Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Real-Time Daily Activity & Intake Logs from Client App */}
          {selectedClient && (() => {
            const clientDailyLog = getDailyLog(selectedClient.uid);
            const waterPercent = Math.min(100, Math.round((clientDailyLog.waterIntakeMl / (clientDailyLog.waterGoalMl || 2500)) * 100));

            return (
              <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Patient Real-Time Activity & Intake Logs (Today)</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#66734A', fontWeight: 700 }}>
                    Live Firebase Sync Active
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {/* Water Hydration */}
                  <div style={{ padding: '10px', backgroundColor: '#E3F2FD', borderRadius: '6px', border: '1px solid #BBDEFB' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1565C0' }}>Water Hydration Logged</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0D47A1', marginTop: '2px' }}>
                      {clientDailyLog.waterIntakeMl} ml <span style={{ fontSize: '11.5px', fontWeight: 600 }}>/ {clientDailyLog.waterGoalMl} ml ({waterPercent}%)</span>
                    </div>
                  </div>

                  {/* Logged Exercises */}
                  <div style={{ padding: '10px', backgroundColor: '#E8F5E9', borderRadius: '6px', border: '1px solid #C8E6C9' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32' }}>Workouts Logged ({clientDailyLog.exercises.length})</div>
                    {clientDailyLog.exercises.length === 0 ? (
                      <div style={{ fontSize: '11.5px', color: '#558B2F', marginTop: '4px' }}>No workouts logged today</div>
                    ) : (
                      <div style={{ fontSize: '11.5px', color: '#1B5E20', marginTop: '2px' }}>
                        {clientDailyLog.exercises.map((ex) => (
                          <div key={ex.id}>• <strong>{ex.exerciseName}</strong> ({ex.durationMinutes}m • {ex.intensity})</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Logged Extra Foods */}
                  <div style={{ padding: '10px', backgroundColor: '#FFF3E0', borderRadius: '6px', border: '1px solid #FFE0B2' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#E65100' }}>Extra Meals / Foods ({clientDailyLog.foodLogs.length})</div>
                    {clientDailyLog.foodLogs.length === 0 ? (
                      <div style={{ fontSize: '11.5px', color: '#EF6C00', marginTop: '4px' }}>No extra snacks logged</div>
                    ) : (
                      <div style={{ fontSize: '11.5px', color: '#BF360C', marginTop: '2px' }}>
                        {clientDailyLog.foodLogs.map((f) => (
                          <div key={f.id}>• <strong>{f.foodName}</strong> ({f.mealType} {f.quantity ? `• ${f.quantity}` : ''})</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Prescribed Meal Adherence Breakdown */}
                {currentDietChart && (
                  <div style={{ marginTop: '4px', paddingTop: '10px', borderTop: '1px solid #ECEAE0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#242820' }}>
                        Prescribed Meal Adherence: {currentDietChart.meals.filter((m) => m.isCompleted).length} / {currentDietChart.meals.length} Meals Eaten
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: currentDietChart.meals.filter((m) => m.isCompleted).length === currentDietChart.meals.length ? '#38571A' : '#66734A' }}>
                        {Math.round((currentDietChart.meals.filter((m) => m.isCompleted).length / (currentDietChart.meals.length || 1)) * 100)}% Adherence
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {currentDietChart.meals.map((meal) => (
                        <div
                          key={meal.mealNumber}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: meal.isCompleted ? '#EEF4E8' : '#FAF8F0',
                            border: `1px solid ${meal.isCompleted ? '#B8D4A8' : '#D9D8CC'}`,
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: meal.isCompleted ? '#38571A' : '#6B7063' }}>
                            {meal.mealName || `Meal ${meal.mealNumber}`}:
                          </span>
                          <span style={{ fontWeight: 800, color: meal.isCompleted ? '#38571A' : '#8A9568' }}>
                            {meal.isCompleted ? '✓ Eaten' : '⏳ Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Modal for Creating a New Client */}
        {showNewClientForm && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 24, 18, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
            <form onSubmit={handleCreateNewClient} className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFDF8', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '16px', color: '#242820' }}>Add New Clinical Client</strong>
                <button type="button" onClick={() => setShowNewClientForm(false)} style={{ background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>×</button>
              </div>

              <div className="form-group">
                <label className="form-label">Client Full Name *</label>
                <input type="text" required value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="e.g. Maya Verma" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" required value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} placeholder="maya.verma@example.com" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" value={newClientMobile} onChange={(e) => setNewClientMobile(e.target.value)} placeholder="+91 98765 00000" className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Body Weight (kg)</label>
                  <input type="number" step="0.5" value={newClientWeight} onChange={(e) => setNewClientWeight(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  <select value={newClientActivity} onChange={(e) => setNewClientActivity(e.target.value)} className="form-select">
                    <option value="Sedentary">Sedentary (1.5x)</option>
                    <option value="Moderately Active">Moderately Active (2.0x)</option>
                    <option value="Active at Gym">High Intensity (2.5x)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowNewClientForm(false)} style={{ padding: '8px 14px', background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '12px' }}>Create & Select Client</button>
              </div>
            </form>
          </div>
        )}

        {/* Global Clinical Management Modules */}
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: '4px 0 0' }}>
          Global Clinical Tools & Engines
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          
          {/* Module 1: Supplement Formula Engine */}
          <div
            className="wellness-card"
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0B1E48',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EBF4F6', color: '#2B6A78', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    Supplement Formula Engine
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#6B7063' }}>Body comp math, formulas & client overrides</span>
                </div>
              </div>
              <ul style={{ fontSize: '12px', color: '#4B5244', margin: '0 0 16px', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li><strong>Body Composition Math</strong>: Fat Mass $\rightarrow$ FFM $\rightarrow$ Protein Requirement.</li>
                <li><strong>Formula Manager Spreadsheet</strong>: Inline editing, min/max limits & versioning.</li>
                <li><strong>Formula Testing Workbench</strong>: Test equations against live biometric inputs.</li>
                <li><strong>Client Override Desk</strong>: Manually adjust client dosages with notes.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowFormulaModal(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <span>Open Supplement Formula Engine</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Module 2: Clinical Diet Chart Editor */}
          <div
            className="wellness-card"
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0B1E48',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#0A1C44', color: '#FFFDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    Clinical Diet Chart Editor
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#6B7063' }}>/Sedentary Excel-style tabular chart publisher</span>
                </div>
              </div>
              <ul style={{ fontSize: '12px', color: '#4B5244', margin: '0 0 16px', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li><strong>7 Clinical Presets</strong>: Bone Health, Carnitine, Probiotics, Immunity, Joint Pain.</li>
                <li><strong>Exact Tabular Layout</strong>: Navy header, Pre-meal supplements, Pink/Blue subtotals.</li>
                <li><strong>Dynamic Macro Balancing</strong>: Real-time protein, fat, carb and calorie calculation.</li>
                <li><strong>1-Click Client Publishing</strong>: Instantly syncs to client's Nutrition Tab.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowDietChartModal(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <span>Open Clinical Diet Chart Editor</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Module 3: Goal & Recommendation Rule System */}
          <div
            className="wellness-card"
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0B1E48',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F3EFE0', color: '#4F5C38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                    Goal & Recommendation Rules
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#6B7063' }}>Goal mapping, vector icons & recommendation rules</span>
                </div>
              </div>
              <ul style={{ fontSize: '12px', color: '#4B5244', margin: '0 0 16px', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li><strong>Goal Registry</strong>: Manage High-Performance & Sedentary Beginner goals.</li>
                <li><strong>Vector Icon System</strong>: Purpose-built medical and fitness iconography.</li>
                <li><strong>Dynamic Rules Engine</strong>: Map goals to supplements with diet-specific branching.</li>
                <li><strong>L-Leucine & Whey Protocol</strong>: Auto-deduplication and mutual exclusion rules.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowGoalModal(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <span>Open Goal & Recommendation Manager</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </main>

      {/* Admin Modals */}
      <SupplementFormulaManagerModal
        isOpen={showFormulaModal}
        onClose={() => {
          setShowFormulaModal(false);
          loadClients();
        }}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
      />

      <ClinicalDietChartEditorModal
        isOpen={showDietChartModal}
        onClose={() => {
          setShowDietChartModal(false);
          loadClients();
        }}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
        clientEmail={selectedClient?.personalDetails?.emailAddress}
      />

      <GoalRecommendationManagerModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
      />

      {/* Plan Notifications Automation Modal (Android & iOS) */}
      <PlanNotificationManagerModal
        isOpen={showPlanNotificationModal}
        onClose={() => setShowPlanNotificationModal(false)}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
        initialPlanName="1-Month Intensive Transformation Package"
        initialDurationMonths={1}
      />

      {/* Admin 1-on-1 Counselling Intake Review Modal */}
      {showCounsellingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '820px', height: '90vh', backgroundColor: '#FFFDF8', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <CounsellingPackageScreen 
              onBack={() => setShowCounsellingModal(false)} 
              clientId={selectedClientId}
              clientName={selectedClient?.personalDetails?.fullName}
            />
          </div>
        </div>
      )}

      {/* Admin Blood Test & Scanned PDF Lab Report Manager Modal */}
      {showBloodTestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '820px', height: '90vh', backgroundColor: '#FFFDF8', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <BloodTestScheduleScreen 
              onBack={() => setShowBloodTestModal(false)} 
              isAdminMode={true} 
              clientId={selectedClientId}
              clientName={selectedClient?.personalDetails?.fullName}
            />
          </div>
        </div>
      )}

      {/* Admin PAR-Q Health Record Modal */}
      {showParqModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '720px', height: '85vh', backgroundColor: '#FFFDF8', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <ParQHealthScreen 
              onBack={() => setShowParqModal(false)} 
              clientId={selectedClientId}
              clientName={selectedClient?.personalDetails?.fullName}
              isAdminMode={true}
            />
          </div>
        </div>
      )}

      {/* Admin Protein & Fat Requirement Formula Modal */}
      <ProteinFatRequirementFormulaModal
        isOpen={showProteinFatFormulaModal}
        onClose={() => setShowProteinFatFormulaModal(false)}
        initialWeight={selectedClient?.personalDetails?.weight || 70}
        initialBodyFat={selectedClient?.personalDetails?.bodyFatPercentage ?? 20}
        initialIntensity={selectedClient?.physicalActivity?.calculatedIntensity || 2.0}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
        clientId={selectedClient?.uid || selectedClientId}
        clientEmail={selectedClient?.personalDetails?.emailAddress}
        onSaved={async () => {
          setDietChartRefreshKey((k) => k + 1);
          if (selectedClient?.uid) {
            const bp = await getMetabolicBlueprint(selectedClient.uid);
            setClientBlueprint(bp);
          }
        }}
      />

      {/* Suggested Supplemented Stacks Reference Modal (16 Clinical Stacks) */}
      <ClinicalSupplementsCatalogModal
        isOpen={showSupplementsCatalogModal}
        onClose={() => setShowSupplementsCatalogModal(false)}
      />

      {/* Admin Long-Term Support Manager Modal */}
      <AdminLongTermSupportModal
        isOpen={showLongTermSupportModal}
        onClose={() => {
          setShowLongTermSupportModal(false);
          loadClients();
        }}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
        clientEmail={selectedClient?.personalDetails?.emailAddress}
      />

      {/* Lead Registration Data Book Modal (Image 1) */}
      <LeadRegistrationDataBookModal
        isOpen={showLeadDataBookModal}
        onClose={() => setShowLeadDataBookModal(false)}
        onSelectLeadForPlan={() => {
          setShowLeadDataBookModal(false);
          setShowLongTermDataBookModal(true);
        }}
      />

      {/* Long-Term Support Data Book Modal (Image 2) */}
      <LongTermSupportDataBookModal
        isOpen={showLongTermDataBookModal}
        onClose={() => setShowLongTermDataBookModal(false)}
      />

      {/* Long-Term Support Lead Data Box Modal */}
      <LongTermLeadDataModal
        isOpen={showLongTermLeadDataModal}
        onClose={() => {
          setShowLongTermLeadDataModal(false);
          loadLongTermCounts();
        }}
      />

      {/* Long-Term Sold Data Box Modal */}
      <LongTermSoldDataModal
        isOpen={showLongTermSoldDataModal}
        onClose={() => {
          setShowLongTermSoldDataModal(false);
          loadLongTermCounts();
        }}
      />

      {/* Long-Term 3-in-1 Reminders & Validity Hub Modal */}
      <LongTermReminderHubModal
        isOpen={showLongTermReminderHubModal}
        onClose={() => {
          setShowLongTermReminderHubModal(false);
          loadLongTermCounts();
        }}
        defaultTab={longTermReminderDefaultTab}
      />

      {/* Admin Agreement Collection Modal */}
      <AdminAgreementCollectionModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
        clientEmail={selectedClient?.personalDetails?.emailAddress}
        clientPhone={selectedClient?.personalDetails?.mobileNumber}
        packageDurationMonths={3}
      />

      {/* Admin Client Progress Photo Scanner Modal */}
      <AdminClientPhotoScannerModal
        isOpen={showPhotoScannerModal}
        onClose={() => setShowPhotoScannerModal(false)}
        clients={clients}
        initialClientId={selectedClientId}
      />

      {/* Admin Intensity Assignment & Plan Start Date Modal */}
      <AdminIntensityAssignmentModal
        isOpen={showIntensityModal}
        onClose={() => setShowIntensityModal(false)}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
      />

      {/* Admin Prior Blood Tests & Separate Lipid Profile Modal */}
      <AdminPriorBloodTestModal
        isOpen={showPriorBloodTestModal}
        onClose={() => setShowPriorBloodTestModal(false)}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
      />

      {/* Admin Lifestyle Supplement Assessment Modal (1.5 / 2.0 / 2.5) */}
      <AdminLifestyleSupplementAssessmentModal
        isOpen={showLifestyleSupplementModal}
        onClose={() => setShowLifestyleSupplementModal(false)}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
        clientMobile={selectedClient?.personalDetails?.mobileNumber || '9903711773'}
        initialIntensity={
          selectedClient?.physicalActivity?.calculatedIntensity === 2.5
            ? 'Extremely High 2.5'
            : selectedClient?.physicalActivity?.calculatedIntensity === 2.0
            ? 'Moderate 2.0'
            : selectedClient?.physicalActivity?.currentActivityLevel === 'Beginner at Gym'
            ? 'Beginner 1.5'
            : 'Sedentary 1.5'
        }
      />

      {/* Admin Workout Plan Assignment Modal */}
      <AdminWorkoutPlanAssignmentModal
        isOpen={showWorkoutPlanModal}
        onClose={() => setShowWorkoutPlanModal(false)}
        clientId={selectedClientId}
        clientName={selectedClient?.personalDetails?.fullName || 'Client'}
      />
    </div>
  );
};
