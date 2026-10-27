import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Activity, 
  TestTube, 
  Gift, 
  TrendingUp, 
  Zap, 
  Search, 
  Calendar, 
  FileText, 
  Flame, 
  Dumbbell,
  ShieldCheck,
  Film
} from 'lucide-react';
import type { CustomerRecord } from '../../types/customer';

interface AllClientDataSectionProps {
  clients: CustomerRecord[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onOpenWorkoutPlanModal?: () => void;
  onOpenBloodTestModal?: () => void;
  onOpenPhotoScannerModal?: () => void;
  onOpenIntensityModal?: () => void;
  onOpenBodyTransformationModal?: () => void;
  onOpenTransformationVideoModal?: () => void;
}

export const AllClientDataSection: React.FC<AllClientDataSectionProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenWorkoutPlanModal,
  onOpenBloodTestModal,
  onOpenPhotoScannerModal,
  onOpenIntensityModal,
  onOpenBodyTransformationModal,
  onOpenTransformationVideoModal,
}) => {
  const [activeMainBox, setActiveMainBox] = useState<'long_term' | 'counselling'>('long_term');
  const [activeSubSection, setActiveSubSection] = useState<
    'basic' | 'activity' | 'blood' | 'gifts' | 'performance' | 'intensity'
  >('basic');
  const [searchQuery, setSearchQuery] = useState('');

  // Gift delivery status tracker state (persisted per client in local state)
  const [giftDeliveryStatus, setGiftDeliveryStatus] = useState<Record<string, 'Allocated' | 'Dispatched' | 'Delivered'>>({
    default: 'Delivered',
  });

  const selectedClient = clients.find((c) => c.uid === selectedClientId) || clients[0];

  const filteredClients = clients.filter((c) => 
    (c.personalDetails?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.personalDetails?.emailAddress || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="all-client-data-section"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '2px solid #0A1C44',
        boxShadow: '0 8px 30px rgba(10, 28, 68, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Banner Header */}
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: '#0A1C44',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          borderBottom: '3px solid #E8CA56',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#E8CA56',
              color: '#0A1C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#E8CA56', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SECTION 9 • MASTER CLINICAL DOSSIER
              </span>
              <span style={{ fontSize: '10px', backgroundColor: '#1E356A', padding: '2px 8px', borderRadius: '4px', color: '#FFF' }}>
                {clients.length} Registered Patients
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 0', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              All Client Data Box
            </h2>
          </div>
        </div>

        {/* 2 Main Box Selector Buttons: Box A (Long-Term) & Box B (1-on-1 Counselling) */}
        <div style={{ display: 'flex', backgroundColor: '#1E356A', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setActiveMainBox('long_term')}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeMainBox === 'long_term' ? '#059669' : 'transparent',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Heart size={16} />
            <span>Box A: Long-Term Support Client Data</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainBox('counselling')}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeMainBox === 'counselling' ? '#BE185D' : 'transparent',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Users size={16} />
            <span>Box B: One-on-One Counseling Client Data</span>
          </button>
        </div>
      </div>

      {/* Client Quick Search & Switcher Bar */}
      <div
        style={{
          padding: '12px 24px',
          backgroundColor: '#F8F6EF',
          borderBottom: '1px solid #EBE5D8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44' }}>Select Client:</span>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '650px', paddingBottom: '2px' }}>
            {filteredClients.slice(0, 8).map((c) => {
              const isSelected = c.uid === selectedClient?.uid;
              return (
                <button
                  key={c.uid}
                  type="button"
                  onClick={() => onSelectClient(c.uid)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 800 : 600,
                    border: isSelected ? '1.5px solid #0A1C44' : '1px solid #D9D8CC',
                    backgroundColor: isSelected ? '#0A1C44' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#242820',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.personalDetails?.fullName || 'Client'}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search records by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px 6px 30px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          BOX A: LONG-TERM SUPPORT CLIENT DATA (WITH 6 SUBSECTIONS)
         ========================================================================= */}
      {activeMainBox === 'long_term' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Subsections Navigation Pill Bar */}
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#FFFFFF',
              borderBottom: '1.5px solid #E2E8F0',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'basic', label: '1. Basic Client Information', icon: <FileText size={15} /> },
              { id: 'activity', label: '2. Physical Activity', icon: <Activity size={15} /> },
              { id: 'blood', label: '3. Blood Reports', icon: <TestTube size={15} /> },
              { id: 'gifts', label: '4. Gift Vouchers', icon: <Gift size={15} /> },
              { id: 'performance', label: '5. Performance Tracking', icon: <TrendingUp size={15} /> },
              { id: 'intensity', label: '6. Intensity Change', icon: <Zap size={15} /> },
            ].map((tab) => {
              const isActive = activeSubSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubSection(tab.id as any)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: isActive ? '#059669' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subsections Content Area */}
          <div style={{ padding: '24px', backgroundColor: '#FAF9F5', minHeight: '340px' }}>
            {selectedClient ? (
              <div>
                {/* SUBSECTION 1: BASIC CLIENT INFORMATION */}
                {activeSubSection === 'basic' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                      {/* Client Details Card */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1.5px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <Users size={17} color="#059669" />
                          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Client Personal Details</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                          <div><span style={{ color: '#64748B' }}>Full Name:</span> <strong>{selectedClient.personalDetails?.fullName}</strong></div>
                          <div><span style={{ color: '#64748B' }}>Gender & Age:</span> <strong>{selectedClient.personalDetails?.gender || 'Female'} • {selectedClient.personalDetails?.age || 30} yrs</strong></div>
                          <div><span style={{ color: '#64748B' }}>Height & Weight:</span> <strong>{selectedClient.personalDetails?.height} cm • {selectedClient.personalDetails?.weight} kg</strong></div>
                          <div><span style={{ color: '#64748B' }}>Contact Phone:</span> <strong>{selectedClient.personalDetails?.mobileNumber || '+91 98765 00000'}</strong></div>
                          <div><span style={{ color: '#64748B' }}>Email Address:</span> <strong>{selectedClient.personalDetails?.emailAddress}</strong></div>
                          <div><span style={{ color: '#64748B' }}>Address / City:</span> <strong>{selectedClient.personalDetails?.address || 'Mumbai, Maharashtra, India'}</strong></div>
                        </div>
                      </div>

                      {/* Registration Information Card */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1.5px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <Calendar size={17} color="#059669" />
                          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Registration Information</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                          <div><span style={{ color: '#64748B' }}>Registration UID:</span> <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{selectedClient.uid}</code></div>
                          <div><span style={{ color: '#64748B' }}>Enrolled Date:</span> <strong>{new Date(typeof selectedClient.metadata?.createdAt === 'number' ? selectedClient.metadata.createdAt : Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
                          <div><span style={{ color: '#64748B' }}>Intake Status:</span> <span style={{ color: '#059669', fontWeight: 800, backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>✓ Onboarding Complete</span></div>
                          <div><span style={{ color: '#64748B' }}>Clinical Intake Step:</span> <strong>Step 11 (Verified)</strong></div>
                          <div><span style={{ color: '#64748B' }}>Account Security:</span> <strong>Verified Medical Record</strong></div>
                        </div>
                      </div>

                      {/* Package Information Card */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1.5px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <ShieldCheck size={17} color="#059669" />
                          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Package Information</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                          <div><span style={{ color: '#64748B' }}>Program:</span> <strong>Long-Term Metabolic & Hormone Reset</strong></div>
                          <div><span style={{ color: '#64748B' }}>Duration Tier:</span> <strong style={{ color: '#059669' }}>6-Month Premium Support</strong></div>
                          <div><span style={{ color: '#64748B' }}>Lead Practitioner:</span> <strong>Sneha Dey (Clinical Nutritionist)</strong></div>
                          <div><span style={{ color: '#64748B' }}>Follow-up Schedule:</span> <strong>Twice-Weekly Consultations + Daily App Log</strong></div>
                          <div><span style={{ color: '#64748B' }}>Package Status:</span> <strong style={{ color: '#16A34A' }}>Active & Enrolled</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBSECTION 2: PHYSICAL ACTIVITY */}
                {activeSubSection === 'activity' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Client Physical Activity Records</h4>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Daily exercise routines, video instruction coverage, and workout compliance.</p>
                      </div>
                      {onOpenWorkoutPlanModal && (
                        <button
                          type="button"
                          onClick={onOpenWorkoutPlanModal}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#0A1C44',
                            color: '#E8CA56',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Dumbbell size={14} />
                          <span>Assign / Edit Workout Routine</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Current Activity Tier</span>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', marginTop: '4px' }}>
                          {selectedClient.physicalActivity?.currentActivityLevel || 'Moderately Active'}
                        </div>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                          Intensity: {selectedClient.physicalActivity?.calculatedIntensity || 2.0}x Multiplier
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Target Training Frequency</span>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', marginTop: '4px' }}>
                          {selectedClient.physicalActivity?.realisticExerciseDaysPerWeek || '4 – 5 Days / Week'}
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          Duration: {selectedClient.physicalActivity?.usualWorkoutDuration || '45 – 60 min'}
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Preferred Exercise Modalities</span>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0A1C44', marginTop: '4px' }}>
                          {(selectedClient.physicalActivity?.preferredExerciseTypes || ['Strength Training', 'Brisk Walking']).join(', ')}
                        </div>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                          Goal Trait: {selectedClient.physicalActivity?.activityTrait || 'Hormonal Fat Loss'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBSECTION 3: BLOOD REPORTS */}
                {activeSubSection === 'blood' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Client Blood Test & Diagnostic Reports</h4>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Multi-month diagnostic schedule, lipid panels, and uploaded laboratory files.</p>
                      </div>
                      {onOpenBloodTestModal && (
                        <button
                          type="button"
                          onClick={onOpenBloodTestModal}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#059669',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <TestTube size={14} />
                          <span>View Laboratory Panel & Lipid Details</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44' }}>Phase 1: Baseline Blood Panel</span>
                          <span style={{ fontSize: '10px', backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Completed</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                          Tests: Fasting Glucose, HbA1c, Complete Lipid Profile, Thyroid T3/T4/TSH, Vitamin D3, Serum Ferritin.
                        </p>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44' }}>Phase 2: Mid-Term Follow-up</span>
                          <span style={{ fontSize: '10px', backgroundColor: '#FEF3C7', color: '#B45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Scheduled (M3)</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                          Tests: Lipid response evaluation, Fasting Insulin, Liver function enzymes.
                        </p>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44' }}>Phase 3: Final Outcome Marker</span>
                          <span style={{ fontSize: '10px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Scheduled (M6)</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                          Tests: Complete transformation audit & hormonal normalization biomarkers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBSECTION 4: GIFT VOUCHERS */}
                {activeSubSection === 'gifts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Client Welcome Kit & Gift Voucher Registry</h4>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Track gift hamper allocations, merchandise fulfillment, and delivery confirmation.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                      {[
                        { id: 'gift_shaker', name: 'She Nourishes Premium Shaker Bottle', category: 'Hydration', tracking: 'SN-EXP-9081' },
                        { id: 'gift_locker', name: 'Gym Key Locker Security Tag', category: 'Accessory', tracking: 'SN-EXP-9082' },
                        { id: 'gift_keychain', name: 'Signature Brass Wellness Keychain', category: 'Token', tracking: 'SN-EXP-9083' },
                        { id: 'gift_bands', name: '5-Color Elastic Resistance Band Loop Set', category: 'Equipment', tracking: 'SN-EXP-9084' },
                      ].map((item) => {
                        const status = giftDeliveryStatus[item.id] || 'Delivered';
                        return (
                          <div
                            key={item.id}
                            style={{
                              backgroundColor: '#FFFFFF',
                              padding: '16px',
                              borderRadius: '14px',
                              border: '1.5px solid #E2E8F0',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <strong style={{ fontSize: '13.5px', color: '#0A1C44' }}>{item.name}</strong>
                                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Category: {item.category} • Tracking: {item.tracking}</div>
                              </div>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  backgroundColor: status === 'Delivered' ? '#ECFDF5' : status === 'Dispatched' ? '#EFF6FF' : '#FEF3C7',
                                  color: status === 'Delivered' ? '#059669' : status === 'Dispatched' ? '#1D4ED8' : '#B45309',
                                }}
                              >
                                {status}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                              {(['Allocated', 'Dispatched', 'Delivered'] as const).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setGiftDeliveryStatus({ ...giftDeliveryStatus, [item.id]: s })}
                                  style={{
                                    flex: 1,
                                    padding: '5px',
                                    borderRadius: '6px',
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    border: status === s ? '1px solid #0A1C44' : '1px solid #CBD5E1',
                                    backgroundColor: status === s ? '#0A1C44' : '#F8FAFC',
                                    color: status === s ? '#FFFFFF' : '#475569',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SUBSECTION 5: PERFORMANCE TRACKING */}
                {activeSubSection === 'performance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Client Performance Tracking & Body Transformation</h4>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Comprehensive 3, 6, 9 & 12 Month Transformation Plan, Body Fat % Changes & Photos.</p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {onOpenBodyTransformationModal && (
                          <button
                            type="button"
                            onClick={onOpenBodyTransformationModal}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              backgroundColor: '#0A1C44',
                              color: '#E8CA56',
                              border: '1.5px solid #E8CA56',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Flame size={15} color="#E8CA56" />
                            <span>Open 3/6/9/12 Mo Transformation Planner</span>
                          </button>
                        )}

                        {onOpenTransformationVideoModal && (
                          <button
                            type="button"
                            onClick={onOpenTransformationVideoModal}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              backgroundColor: '#BE185D',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(190, 24, 93, 0.25)',
                            }}
                          >
                            <Film size={15} />
                            <span>AI Transformation Video (8–10s)</span>
                          </button>
                        )}

                        {onOpenPhotoScannerModal && (
                          <button
                            type="button"
                            onClick={onOpenPhotoScannerModal}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              backgroundColor: '#F8FAFC',
                              color: '#0A1C44',
                              border: '1px solid #CBD5E1',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <span>📷 Photos</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Performance Metrics Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Starting Body Fat</span>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#BE185D', marginTop: '2px' }}>
                          {selectedClient.personalDetails?.bodyFatPercentage ?? 28}%
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Target: 20 – 22%</span>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Current Weight</span>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1C44', marginTop: '2px' }}>
                          {selectedClient.personalDetails?.weight || 64} kg
                        </div>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>-3.5 kg since baseline</span>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Nutrition Adherence</span>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A', marginTop: '2px' }}>
                          91%
                        </div>
                        <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>Consistent log streak</span>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Workout Completion</span>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB', marginTop: '2px' }}>
                          87%
                        </div>
                        <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>4.2 workouts/wk</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBSECTION 6: INTENSITY CHANGE */}
                {activeSubSection === 'intensity' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>Client Intensity Change History</h4>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Log current training intensity, previous level, date of modification, and progression milestones.</p>
                      </div>

                      {onOpenIntensityModal && (
                        <button
                          type="button"
                          onClick={onOpenIntensityModal}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#9333EA',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Zap size={14} />
                          <span>Change Intensity Level</span>
                        </button>
                      )}
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '18px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: '#F3E8FF', padding: '12px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
                          <span style={{ fontSize: '11px', color: '#7E22CE', fontWeight: 700 }}>CURRENT INTENSITY LEVEL</span>
                          <div style={{ fontSize: '17px', fontWeight: 900, color: '#581C87', marginTop: '2px' }}>
                            {selectedClient.physicalActivity?.currentActivityLevel || 'Moderately Active'} (2.0x)
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>PREVIOUS INTENSITY</span>
                          <div style={{ fontSize: '17px', fontWeight: 900, color: '#334155', marginTop: '2px' }}>
                            Sedentary (1.5x)
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>LAST UPDATED DATE</span>
                          <div style={{ fontSize: '17px', fontWeight: 900, color: '#0A1C44', marginTop: '2px' }}>
                            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A1C44', display: 'block', marginBottom: '8px' }}>
                          Intensity Progression Log
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FAF5FF', borderRadius: '6px' }}>
                            <span><strong>Upgraded:</strong> Sedentary (1.5x) ➔ Moderately Active (2.0x)</span>
                            <span style={{ color: '#7E22CE', fontWeight: 700 }}>Week 4 Milestone</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                            <span><strong>Initial Intake:</strong> Assigned Sedentary Baseline (1.5x)</span>
                            <span style={{ color: '#64748B', fontWeight: 600 }}>Enrollment Day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                Please select a client above to view records.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          BOX B: ONE-ON-ONE COUNSELING CLIENT DATA
         ========================================================================= */}
      {activeMainBox === 'counselling' && (
        <div style={{ padding: '24px', backgroundColor: '#FAF9F5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                Box B: One-on-One Counseling Client Data
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0' }}>
                Manage individual counseling records, appointment sessions, clinical notes, and long-term transition offers.
              </p>
            </div>
            <span style={{ fontSize: '11px', backgroundColor: '#FDF2F8', color: '#BE185D', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
              Individual Protocol Registry
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
            {filteredClients.map((client) => (
              <div
                key={client.uid}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: client.uid === selectedClientId ? '2px solid #BE185D' : '1.5px solid #E2E8F0',
                  padding: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px', color: '#0A1C44' }}>{client.personalDetails?.fullName}</strong>
                  <span style={{ fontSize: '10.5px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    1-on-1 Session Active
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#475569' }}>
                  <div>Email: {client.personalDetails?.emailAddress}</div>
                  <div>Phone: {client.personalDetails?.mobileNumber || '+91 98765 00000'}</div>
                  <div>Primary Goal: {(client.goalAssessment?.primaryGoals || ['Metabolic Balance']).join(', ')}</div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Next: Follow-up Call</span>
                  <button
                    type="button"
                    onClick={() => onSelectClient(client.uid)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#BE185D',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
