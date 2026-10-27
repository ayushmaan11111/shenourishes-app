import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bell, 
  ChevronRight, 
  X, 
  Mail, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  MapPin, 
  Target, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Award
} from 'lucide-react';
import { 
  getRealLongTermDataRows, 
  getRealLongTermPlanRows, 
  recordClientMessageSent, 
  type LongTermDataClientRow, 
  type LongTermPlanClientRow 
} from '../../services/adminRealDataService';
import { sendClinicalFollowUpEmail } from '../../services/resendEmailService';

export const AdminLongTermRealBoxes: React.FC = () => {
  // Data states
  const [dataClients, setDataClients] = useState<LongTermDataClientRow[]>([]);
  const [planClients, setPlanClients] = useState<LongTermPlanClientRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [openModalType, setOpenModalType] = useState<'none' | 'data' | 'plan'>('none');

  // Selected client & messaging
  const [selectedDataClient, setSelectedDataClient] = useState<LongTermDataClientRow | null>(null);
  const [selectedPlanClient, setSelectedPlanClient] = useState<LongTermPlanClientRow | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentToast, setSentToast] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [dRows, pRows] = await Promise.all([
        getRealLongTermDataRows(),
        getRealLongTermPlanRows(),
      ]);
      setDataClients(dRows);
      setPlanClients(pRows);
    } catch (e) {
      console.error('Error loading real long-term clients:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dataOverdueCount = dataClients.filter((c) => c.needsReminder).length;
  const planOverdueCount = planClients.filter((c) => c.needsReminder).length;

  const handleSelectDataClient = (c: LongTermDataClientRow) => {
    setSelectedDataClient(c);
    setMessageText(
      `Hi ${c.name}, Sneha Dey here reviewing your long-term biometric progress (${c.biometricData}) and muscle gain targets. Let's make sure your meals and supplement stack are fully dialed in!`
    );
  };

  const handleSelectPlanClient = (c: LongTermPlanClientRow) => {
    setSelectedPlanClient(c);
    setMessageText(
      `Hi ${c.name}, this is Sneha Dey following up on your ${c.planTaken} for ${c.goalSelected}. How is your consistency and progress this week?`
    );
  };

  const handleSendMessage = async (
    targetClient: { id: string; name: string; phone: string; email: string },
    channel: 'whatsapp' | 'email' | 'sms'
  ) => {
    setIsSending(true);
    const text = messageText.trim() || `Hi ${targetClient.name}, Sneha Dey here following up on your long-term health transformation.`;
    const cleanPhone = targetClient.phone.replace(/\D/g, '');

    try {
      if (channel === 'whatsapp') {
        const encoded = encodeURIComponent(text);
        const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
      } else if (channel === 'email') {
        if (!targetClient.email || targetClient.email === 'No email') {
          alert(`No email on file for ${targetClient.name}. Please select WhatsApp or SMS.`);
          setIsSending(false);
          return;
        }
        await sendClinicalFollowUpEmail({
          clientName: targetClient.name,
          clientEmail: targetClient.email,
          category: 'Long-Term Support',
          subject: 'Long-Term Transformation Protocol Follow-Up',
          message: text,
        });
      } else if (channel === 'sms') {
        const encoded = encodeURIComponent(text);
        window.open(`sms:${cleanPhone}?body=${encoded}`, '_self');
      }

      // Record message timestamp in Firebase Realtime Database
      await recordClientMessageSent(targetClient.id, targetClient.name, channel, text, 'long_term');

      setSentToast(`✅ Message sent to ${targetClient.name} via ${channel.toUpperCase()}!`);
      setTimeout(() => setSentToast(''), 4000);

      await loadData();
    } catch (err) {
      console.error('Error dispatching message:', err);
      alert('Error sending message. Please use WhatsApp directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 2 SEPARATE BOXES FOR LONG-TERM SUPPORT (DASHBOARD CARDS)                   */}
      {/* ========================================================================= */}
      {/* 2 COMPACT BOXES FOR LONG-TERM SUPPORT (150x150px - 180x180px)              */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* ========================================================================= */}
        {/* SUB-BOX A: LONG-TERM SUPPORT - DATA BOX (BIOMETRICS & MUSCLE GAIN)        */}
        {/* ========================================================================= */}
        <div
          className="wellness-card animate-fade-in"
          onClick={() => setOpenModalType('data')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #38571A',
            borderRadius: '14px',
            padding: '12px',
            boxShadow: '0 4px 14px rgba(56, 87, 26, 0.08)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            position: 'relative',
            width: '175px',
            height: '175px',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
          title="Click to open Long-Term Support Data Box"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EEF4E8',
                  color: '#38571A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(56, 87, 26, 0.15)',
                }}
              >
                <Sparkles size={17} />
              </div>

              {/* REMINDER BADGE */}
              {dataOverdueCount > 0 ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 900,
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    boxShadow: '0 1px 4px rgba(239, 68, 68, 0.3)',
                  }}
                  title={`${dataOverdueCount} clients haven't received a message in > 2-3 days`}
                >
                  <Bell size={10} />
                  <span>{dataOverdueCount}</span>
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    backgroundColor: '#DEF7EC',
                    color: '#03543F',
                  }}
                >
                  <CheckCircle2 size={10} color="#059669" />
                </span>
              )}
            </div>

            <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#1B3B22', margin: '4px 0 2px', lineHeight: 1.25 }}>
              Long-Term: Data Box 🌱
            </h4>
            <p style={{ fontSize: '10px', color: '#4F5C38', margin: 0, lineHeight: 1.3 }}>
              Muscle Gain • Data • Contacts
            </p>
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#38571A' }}>
              {dataClients.length} Clients
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#38571A', display: 'flex', alignItems: 'center', gap: '1px' }}>
              <span>Open</span>
              <ChevronRight size={11} />
            </span>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* SUB-BOX B: LONG-TERM SUPPORT - COUNSELLING PLAN TAKEN                      */}
        {/* ========================================================================= */}
        <div
          className="wellness-card animate-fade-in"
          onClick={() => setOpenModalType('plan')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #D97706',
            borderRadius: '14px',
            padding: '12px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            position: 'relative',
            width: '175px',
            height: '175px',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
          title="Click to open Counselling Plan Taken Box"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.15)',
                }}
              >
                <Award size={17} />
              </div>

              {/* REMINDER BADGE */}
              {planOverdueCount > 0 ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 900,
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    boxShadow: '0 1px 4px rgba(239, 68, 68, 0.3)',
                  }}
                  title={`${planOverdueCount} clients haven't received a message in > 2-3 days`}
                >
                  <Bell size={10} />
                  <span>{planOverdueCount}</span>
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    backgroundColor: '#DEF7EC',
                    color: '#03543F',
                  }}
                >
                  <CheckCircle2 size={10} color="#059669" />
                </span>
              )}
            </div>

            <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#78350F', margin: '4px 0 2px', lineHeight: 1.25 }}>
              Plan Taken 🏆
            </h4>
            <p style={{ fontSize: '10px', color: '#92400E', margin: 0, lineHeight: 1.3 }}>
              Plan • Muscle Gain • Contacts
            </p>
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#92400E' }}>
              {planClients.length} Plans
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', display: 'flex', alignItems: 'center', gap: '1px' }}>
              <span>Open</span>
              <ChevronRight size={11} />
            </span>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* MODAL FOR SUB-BOX A: DATA BOX INTERFACE                                   */}
      {/* ========================================================================= */}
      {openModalType === 'data' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#38571A',
                color: '#FFFFFF',
                padding: '16px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Long-Term Support: Data Box</span>
                    <span style={{ fontSize: '10px', backgroundColor: '#FFFFFF', color: '#38571A', padding: '2px 7px', borderRadius: '10px', fontWeight: 900 }}>
                      Real Firebase Data Only
                    </span>
                  </h3>
                  <span style={{ fontSize: '11px', opacity: 0.85 }}>
                    Name • Data & Biometrics • Muscle Gain • Meeting Point • Contacts • Follow-Up
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={loadData}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}
                  title="Reload from Firebase"
                >
                  <RefreshCw size={13} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpenModalType('none')}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Overdue Banner */}
            {dataOverdueCount > 0 && (
              <div style={{ backgroundColor: '#FEF2F2', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#991B1B', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #FEE2E2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <span>Reminder: <strong>{dataOverdueCount} client{dataOverdueCount > 1 ? 's haven’t' : ' hasn’t'} received a message in more than 2-3 days!</strong></span>
                </div>
                <span style={{ fontSize: '11px' }}>Compose follow-up message below</span>
              </div>
            )}

            {/* Modal Body */}
            <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1, backgroundColor: '#F9FAFB' }}>
              {sentToast && (
                <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
                  {sentToast}
                </div>
              )}

              {loading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>
                  Loading real data from Firebase Realtime Database...
                </div>
              ) : dataClients.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937' }}>No real client records found in Firebase yet.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dataClients.map((c) => {
                    const isSelected = selectedDataClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #38571A' : c.needsReminder ? '1.5px solid #FCA5A5' : '1px solid #E5E7EB',
                          padding: '14px 16px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                              {c.name}
                            </span>
                            {c.needsReminder ? (
                              <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <AlertTriangle size={10} />
                                <span>{c.daysSinceLastMessage != null ? `${c.daysSinceLastMessage}d ago (Overdue)` : 'No message yet (Overdue)'}</span>
                              </span>
                            ) : (
                              <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <CheckCircle2 size={10} />
                                <span>Messaged {c.daysSinceLastMessage === 0 ? 'today' : `${c.daysSinceLastMessage}d ago`}</span>
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectDataClient(c)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? '#38571A' : '#F3F4F6',
                              color: isSelected ? '#FFFFFF' : '#1F2937',
                              fontSize: '11px',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✓ Selected' : 'Message Client →'}
                          </button>
                        </div>

                        {/* Middle info grid: Data, Muscle Gain, Meeting Point, Contact info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '11.5px' }}>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Activity size={11} color="#38571A" />
                              <span>DATA / BIOMETRICS</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.biometricData}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Target size={11} color="#38571A" />
                              <span>MUSCLE GAIN / GOALS</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.muscleGain}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} color="#38571A" />
                              <span>MEETING POINT</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.meetingPoint}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={11} color="#38571A" />
                              <span>CONTACT INFO</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              📞 {c.phone} • ✉️ {c.email}
                            </div>
                          </div>
                        </div>

                        {/* Inline Dispatcher */}
                        {isSelected && (
                          <div style={{ marginTop: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#1F2937', display: 'block', marginBottom: '4px' }}>
                              Message for {c.name}:
                            </label>
                            <textarea
                              rows={2}
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px', marginBottom: '8px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#4B5563' }}>Send Via:</span>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(c, 'whatsapp')}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <MessageCircle size={13} />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(c, 'email')}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Mail size={13} />
                                <span>Email (Resend)</span>
                              </button>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(c, 'sms')}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#7C3AED', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Phone size={13} />
                                <span>SMS</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ padding: '12px 22px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setOpenModalType('none')}
                style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#38571A', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Close Data Box
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL FOR SUB-BOX B: COUNSELLING PLAN TAKEN INTERFACE                     */}
      {/* ========================================================================= */}
      {openModalType === 'plan' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#78350F',
                color: '#FFFFFF',
                padding: '16px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Long-Term Support: Counselling Plan Taken</span>
                    <span style={{ fontSize: '10px', backgroundColor: '#FEF3C7', color: '#78350F', padding: '2px 7px', borderRadius: '10px', fontWeight: 900 }}>
                      Real Firebase Data Only
                    </span>
                  </h3>
                  <span style={{ fontSize: '11px', opacity: 0.85 }}>
                    Plan Taken • Muscle Gain / Goals Selected • Contact Info • Messaging
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={loadData}
                  style={{ background: 'none', border: 'none', color: '#FEF3C7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}
                  title="Reload from Firebase"
                >
                  <RefreshCw size={13} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpenModalType('none')}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Overdue Banner */}
            {planOverdueCount > 0 && (
              <div style={{ backgroundColor: '#FEF2F2', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#991B1B', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #FEE2E2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <span>Reminder: <strong>{planOverdueCount} client{planOverdueCount > 1 ? 's haven’t' : ' hasn’t'} received a message in more than 2-3 days!</strong></span>
                </div>
                <span style={{ fontSize: '11px' }}>Send plan progress update below</span>
              </div>
            )}

            {/* Modal Body */}
            <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1, backgroundColor: '#F9FAFB' }}>
              {sentToast && (
                <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
                  {sentToast}
                </div>
              )}

              {loading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>
                  Loading real data from Firebase Realtime Database...
                </div>
              ) : planClients.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937' }}>No real client plans in Firebase yet.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {planClients.map((c) => {
                    const isSelected = selectedPlanClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #78350F' : c.needsReminder ? '1.5px solid #FCA5A5' : '1px solid #E5E7EB',
                          padding: '14px 16px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                              {c.name}
                            </span>
                            {c.needsReminder ? (
                              <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <AlertTriangle size={10} />
                                <span>{c.daysSinceLastMessage != null ? `${c.daysSinceLastMessage}d ago (Overdue)` : 'No message yet (Overdue)'}</span>
                              </span>
                            ) : (
                              <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <CheckCircle2 size={10} />
                                <span>Messaged {c.daysSinceLastMessage === 0 ? 'today' : `${c.daysSinceLastMessage}d ago`}</span>
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectPlanClient(c)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? '#78350F' : '#F3F4F6',
                              color: isSelected ? '#FFFFFF' : '#1F2937',
                              fontSize: '11px',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✓ Selected' : 'Message Client →'}
                          </button>
                        </div>

                        {/* Middle info grid: Plan Taken, Goals Selected, Contact info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', backgroundColor: '#FDF8F6', padding: '10px 12px', borderRadius: '8px', fontSize: '11.5px' }}>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#78350F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Award size={11} color="#78350F" />
                              <span>COUNSELLING PLAN TAKEN</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.planTaken}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#78350F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Target size={11} color="#78350F" />
                              <span>GOAL SELECTED / MUSCLE GAIN</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.goalSelected}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#78350F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={11} color="#78350F" />
                              <span>CONTACT INFO</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              📞 {c.phone} • ✉️ {c.email}
                            </div>
                          </div>
                        </div>

                        {/* Inline Dispatcher */}
                        {isSelected && (
                          <div style={{ marginTop: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#1F2937', display: 'block', marginBottom: '4px' }}>
                              Message for {c.name}:
                            </label>
                            <textarea
                              rows={2}
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px', marginBottom: '8px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#4B5563' }}>Send Via:</span>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(c, 'whatsapp')}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <MessageCircle size={13} />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(c, 'email')}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Mail size={13} />
                                <span>Email (Resend)</span>
                              </button>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(c, 'sms')}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#7C3AED', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Phone size={13} />
                                <span>SMS</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ padding: '12px 22px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setOpenModalType('none')}
                style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#78350F', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Close Plan Box
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
