import React, { useState, useEffect } from 'react';
import { 
  X, 
  FlaskConical, 
  Gift, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ExternalLink, 
  AlertCircle,
  Pin,
  Check
} from 'lucide-react';
import { 
  getClientTrackingRecord, 
  saveClientTrackingRecord, 
  type ClientTrackingRecord, 
  type HealthTestStatus,
  type GiftDeliveryStatus
} from '../../services/clientTrackingService';

interface ClientPackageCoreHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName?: string;
  initialTab?: 'tests' | 'gifts' | 'sessions';
  isAdmin?: boolean;
}

export const ClientPackageCoreHubModal: React.FC<ClientPackageCoreHubModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName = 'Sneha De',
  initialTab = 'sessions',
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'gifts' | 'sessions'>(initialTab);
  const [record, setRecord] = useState<ClientTrackingRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [successToast, setSuccessToast] = useState<string>('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getClientTrackingRecord(clientId, clientName).then((rec) => {
        setRecord(rec);
        setIsLoading(false);
      });
    }
  }, [isOpen, clientId, clientName]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  if (!isOpen) return null;

  // Handler: Update test status
  const handleUpdateTestStatus = async (testId: string, newStatus: HealthTestStatus) => {
    if (!record) return;
    const updatedTests = record.healthTests.map((t) => 
      t.id === testId ? { ...t, status: newStatus, reviewedAt: newStatus === 'Report Reviewed ✓' ? Date.now() : t.reviewedAt } : t
    );
    const updatedRec = { ...record, healthTests: updatedTests };
    setRecord(updatedRec);
    await saveClientTrackingRecord(updatedRec);
    showToast(`Test status updated to: ${newStatus}`);
  };

  // Handler: Update gift status
  const handleUpdateGiftStatus = async (giftId: string, newStatus: GiftDeliveryStatus) => {
    if (!record) return;
    const updatedGifts = record.gifts.map((g) =>
      g.id === giftId ? { 
        ...g, 
        status: newStatus, 
        clientConfirmedAt: newStatus === 'Client Confirmed ✓' ? Date.now() : g.clientConfirmedAt 
      } : g
    );
    const updatedRec = { ...record, gifts: updatedGifts };
    setRecord(updatedRec);
    await saveClientTrackingRecord(updatedRec);
    showToast(`Gift status updated to: ${newStatus}`);
  };

  // Handler: Toggle session completion
  const handleToggleSessionComplete = async (sessionNumber: number) => {
    if (!record) return;
    const updatedSessions = record.sessions.map((s) => {
      if (s.sessionNumber === sessionNumber) {
        const isComp = s.status === 'Completed ✓';
        return {
          ...s,
          status: isComp ? ('Upcoming' as const) : ('Completed ✓' as const),
          completedAt: isComp ? undefined : Date.now(),
          whatsappEvidence: isComp ? undefined : `Completed & verified on ${new Date().toLocaleDateString('en-GB')}`
        };
      }
      return s;
    });
    const updatedRec = { ...record, sessions: updatedSessions };
    setRecord(updatedRec);
    await saveClientTrackingRecord(updatedRec);
    showToast(`Session ${sessionNumber} status updated!`);
  };

  // Handler: Pin session
  const handleTogglePinSession = async (sessionNumber: number) => {
    if (!record) return;
    const updatedSessions = record.sessions.map((s) => 
      s.sessionNumber === sessionNumber ? { ...s, isPinnedByClient: !s.isPinnedByClient } : s
    );
    const updatedRec = { ...record, sessions: updatedSessions };
    setRecord(updatedRec);
    await saveClientTrackingRecord(updatedRec);
    showToast(`Session ${sessionNumber} pinned!`);
  };

  const completedSessionsCount = record?.sessions.filter(s => s.status === 'Completed ✓').length || 0;
  const totalSessionsCount = record?.sessions.length || 6;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FAF8F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: activeTab === 'tests' ? '#DEF7EC' : activeTab === 'gifts' ? '#FEF3C7' : '#EDE9FE',
                color: activeTab === 'tests' ? '#047857' : activeTab === 'gifts' ? '#B45309' : '#6D28D9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeTab === 'tests' && <FlaskConical size={20} />}
              {activeTab === 'gifts' && <Gift size={20} />}
              {activeTab === 'sessions' && <Calendar size={20} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1E293B' }}>
                {activeTab === 'tests' && 'Tests & Biomarker Tracking'}
                {activeTab === 'gifts' && 'Gift Delivery Tracker'}
                {activeTab === 'sessions' && 'Follow-Up Sessions Box'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                {record?.clientName || clientName} • {record?.packageDurationMonths || 1} Month Package
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            padding: '6px 12px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'sessions' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'sessions' ? '#6D28D9' : '#64748B',
              fontWeight: activeTab === 'sessions' ? 700 : 500,
              fontSize: '12.5px',
              boxShadow: activeTab === 'sessions' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Calendar size={14} />
            <span>Sessions ({completedSessionsCount}/{totalSessionsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'tests' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'tests' ? '#047857' : '#64748B',
              fontWeight: activeTab === 'tests' ? 700 : 500,
              fontSize: '12.5px',
              boxShadow: activeTab === 'tests' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <FlaskConical size={14} />
            <span>Tests ({record?.healthTests.length || 3})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gifts')}
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'gifts' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'gifts' ? '#B45309' : '#64748B',
              fontWeight: activeTab === 'gifts' ? 700 : 500,
              fontSize: '12.5px',
              boxShadow: activeTab === 'gifts' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Gift size={14} />
            <span>Gifts ({record?.gifts.length || 1})</span>
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div
            style={{
              margin: '8px 16px 0',
              padding: '8px 12px',
              backgroundColor: '#DEF7EC',
              color: '#047857',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={14} />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <Clock size={28} className="animate-spin" style={{ margin: '0 auto 8px', color: '#94A3B8' }} />
              <p style={{ fontSize: '13px' }}>Loading client records from sync...</p>
            </div>
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: SESSIONS TRACKER                                                    */}
              {/* ========================================================================= */}
              {activeTab === 'sessions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Summary bar */}
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#FAF5FF',
                      border: '1px solid #E9D5FF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#581C87' }}>
                        {completedSessionsCount} of {totalSessionsCount} Follow-Ups Completed
                      </div>
                      <div style={{ fontSize: '11px', color: '#7E22CE', marginTop: '2px' }}>
                        All sessions scheduled according to your transformation agreement
                      </div>
                    </div>
                    <a
                      href="https://wa.me/917980862086?text=Hi%20Sneha%2C%20I%20would%20like%20to%20discuss%20my%20follow-up%20session."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 10px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp Session</span>
                    </a>
                  </div>

                  {/* Sessions List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {record?.sessions.map((sess) => {
                      const isCompleted = sess.status === 'Completed ✓';
                      return (
                        <div
                          key={sess.sessionNumber}
                          style={{
                            border: sess.isPinnedByClient ? '1.5px solid #8B5CF6' : '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            backgroundColor: isCompleted ? '#F8FAFC' : sess.isPinnedByClient ? '#FAF8FF' : '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  backgroundColor: isCompleted ? '#DEF7EC' : '#EDE9FE',
                                  color: isCompleted ? '#047857' : '#6D28D9',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                }}
                              >
                                Session {sess.sessionNumber}
                              </span>
                              {sess.isPinnedByClient && (
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    color: '#7C3AED',
                                    fontWeight: 700,
                                    backgroundColor: '#F3E8FF',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                  }}
                                >
                                  <Pin size={10} /> Pinned
                                </span>
                              )}
                            </div>

                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                backgroundColor: isCompleted ? '#DEF7EC' : sess.status === 'Scheduled' ? '#DBEAFE' : '#F1F5F9',
                                color: isCompleted ? '#047857' : sess.status === 'Scheduled' ? '#1D4ED8' : '#64748B',
                              }}
                            >
                              {sess.status}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                            <span>📅 {sess.scheduledDate}</span>
                            <span>⏰ {sess.timeSlot}</span>
                          </div>

                          {sess.interactionRecord && (
                            <div
                              style={{
                                fontSize: '11.5px',
                                color: '#334155',
                                backgroundColor: '#F8FAFC',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                marginBottom: '6px',
                                borderLeft: '3px solid #6366F1',
                              }}
                            >
                              <strong>Record:</strong> {sess.interactionRecord}
                            </div>
                          )}

                          {sess.whatsappEvidence && (
                            <div style={{ fontSize: '11px', color: '#059669', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} />
                              <span>{sess.whatsappEvidence}</span>
                            </div>
                          )}

                          {/* Action row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                            <button
                              type="button"
                              onClick={() => handleTogglePinSession(sess.sessionNumber)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: sess.isPinnedByClient ? '#7C3AED' : '#94A3B8',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: 0,
                              }}
                            >
                              <Pin size={12} />
                              <span>{sess.isPinnedByClient ? 'Unpin' : 'Pin Session'}</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <a
                                href={`https://wa.me/917980862086?text=Hi%20Sneha%2C%20regarding%20Session%20${sess.sessionNumber}%20on%20${sess.scheduledDate}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: '#059669',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                              >
                                <span>WhatsApp</span>
                                <ExternalLink size={10} />
                              </a>

                              {/* Admin or Client Mark Completed */}
                              <button
                                type="button"
                                onClick={() => handleToggleSessionComplete(sess.sessionNumber)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  backgroundColor: isCompleted ? '#F1F5F9' : '#059669',
                                  color: isCompleted ? '#64748B' : '#FFFFFF',
                                }}
                              >
                                {isCompleted ? 'Mark Pending' : 'Mark Completed ✓'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: TESTS & BIOMARKER TRACKING                                          */}
              {/* ========================================================================= */}
              {activeTab === 'tests' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Info notice */}
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#065F46' }}>
                      Diagnostic Biomarkers & Clinical Schedule
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#047857', marginTop: '2px' }}>
                      Track baseline, mid-plan, and completion reports with doctor verification.
                    </div>
                  </div>

                  {/* Tests List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {record?.healthTests.map((t) => {
                      const getStatusColor = (st: HealthTestStatus) => {
                        switch (st) {
                          case 'Test Completed ✓': return { bg: '#DBEAFE', text: '#1D4ED8' };
                          case 'Report Submitted ✓': return { bg: '#EDE9FE', text: '#6D28D9' };
                          case 'Report Reviewed ✓': return { bg: '#DEF7EC', text: '#047857' };
                          default: return { bg: '#FEF3C7', text: '#B45309' };
                        }
                      };
                      const colors = getStatusColor(t.status);

                      return (
                        <div
                          key={t.id}
                          style={{
                            border: '1px solid #E2E8F0',
                            borderRadius: '14px',
                            padding: '14px',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                                {t.testName}
                              </h4>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>
                                Phase: {t.scheduledPhase}
                              </span>
                            </div>

                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                backgroundColor: colors.bg,
                                color: colors.text,
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t.status}
                            </span>
                          </div>

                          {t.reportNotes && (
                            <div
                              style={{
                                fontSize: '11.5px',
                                color: '#334155',
                                backgroundColor: '#F8FAFC',
                                padding: '8px 10px',
                                borderRadius: '8px',
                                marginBottom: '10px',
                                borderLeft: '3px solid #10B981',
                              }}
                            >
                              <strong>Notes:</strong> {t.reportNotes}
                            </div>
                          )}

                          {/* Status Progression Buttons */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                            {(['Pending', 'Test Completed ✓', 'Report Submitted ✓', 'Report Reviewed ✓'] as HealthTestStatus[]).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleUpdateTestStatus(t.id, st)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: t.status === st ? '1.5px solid #059669' : '1px solid #E2E8F0',
                                  backgroundColor: t.status === st ? '#DEF7EC' : '#FFFFFF',
                                  color: t.status === st ? '#047857' : '#64748B',
                                  fontSize: '10.5px',
                                  fontWeight: t.status === st ? 700 : 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 6-Month testing schedule note */}
                  <div style={{ padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={13} color="#059669" />
                      <span>Scheduled Reminders</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748B' }}>
                      Automated testing reminders are dispatched 7 days prior to each scheduled test date via WhatsApp and Email.
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: GIFT DELIVERY TRACKER                                               */}
              {/* ========================================================================= */}
              {activeTab === 'gifts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Delivery banner */}
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>
                      Gift Voucher & Merchandise Delivery
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#B45309', marginTop: '2px' }}>
                      Complimentary wellness perks included in your selected transformation plan.
                    </div>
                  </div>

                  {/* Gifts List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {record?.gifts.map((g) => {
                      const isConfirmed = g.status === 'Client Confirmed ✓';
                      return (
                        <div
                          key={g.id}
                          style={{
                            border: isConfirmed ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                            borderRadius: '14px',
                            padding: '14px',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  backgroundColor: '#FEF3C7',
                                  color: '#B45309',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Gift size={16} />
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                                {g.giftName}
                              </span>
                            </div>

                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                backgroundColor: isConfirmed ? '#DEF7EC' : g.status === 'Dispatched' ? '#DBEAFE' : '#FEF3C7',
                                color: isConfirmed ? '#047857' : g.status === 'Dispatched' ? '#1D4ED8' : '#B45309',
                              }}
                            >
                              {g.status}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748B', marginBottom: '10px' }}>
                            <span>📦 Tracking: <strong>{g.trackingNumber || 'Pending Courier'}</strong></span>
                            <span>🚚 Est: {g.deliveryDate || 'Processing'}</span>
                          </div>

                          {/* 3-Step Visual Tracker */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                                ✓
                              </div>
                              <span style={{ fontSize: '10px', color: '#047857', fontWeight: 600 }}>Selected</span>
                            </div>

                            <div style={{ flex: 1, height: '2px', backgroundColor: g.status !== 'Selected' ? '#059669' : '#E2E8F0', margin: '0 6px 14px' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: g.status !== 'Selected' ? '#059669' : '#E2E8F0', color: g.status !== 'Selected' ? '#FFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                                {g.status !== 'Selected' ? '✓' : '2'}
                              </div>
                              <span style={{ fontSize: '10px', color: g.status !== 'Selected' ? '#047857' : '#94A3B8', fontWeight: 600 }}>Delivered</span>
                            </div>

                            <div style={{ flex: 1, height: '2px', backgroundColor: isConfirmed ? '#059669' : '#E2E8F0', margin: '0 6px 14px' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: isConfirmed ? '#059669' : '#E2E8F0', color: isConfirmed ? '#FFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                                {isConfirmed ? '✓' : '3'}
                              </div>
                              <span style={{ fontSize: '10px', color: isConfirmed ? '#047857' : '#94A3B8', fontWeight: 600 }}>Confirmed</span>
                            </div>
                          </div>

                          {/* Client Confirmation Button */}
                          <div style={{ paddingTop: '8px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateGiftStatus(g.id, isConfirmed ? 'Dispatched' : 'Client Confirmed ✓')}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: isConfirmed ? '#F1F5F9' : '#059669',
                                color: isConfirmed ? '#64748B' : '#FFFFFF',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <CheckCircle2 size={13} />
                              <span>{isConfirmed ? 'Undo Confirmation' : 'Confirm Delivery Received ✓'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FAF8F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            She Nourishes • Clinical Tracking Synchronized
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: '#475569',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
