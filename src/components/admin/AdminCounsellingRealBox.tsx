import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Bell, 
  ChevronRight, 
  X, 
  Mail, 
  MessageCircle, 
  Phone, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  Target, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  getRealCounsellingRows, 
  recordClientMessageSent, 
  createRealCustomerInFirebase,
  type CounsellingClientRow 
} from '../../services/adminRealDataService';
import { sendClinicalFollowUpEmail } from '../../services/resendEmailService';

export interface AdminCounsellingRealBoxProps {
  isExternalOpen?: boolean;
  onCloseExternal?: () => void;
  hideTriggerCard?: boolean;
}

export const AdminCounsellingRealBox: React.FC<AdminCounsellingRealBoxProps> = ({
  isExternalOpen = false,
  onCloseExternal,
  hideTriggerCard = false,
}) => {
  const [clients, setClients] = useState<CounsellingClientRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<CounsellingClientRow | null>(null);
  
  // Message composing state
  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccessToast, setSentSuccessToast] = useState<string>('');

  // Add new client state
  const [isAddingClient, setIsAddingClient] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newMobile, setNewMobile] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newGoals, setNewGoals] = useState<string>('Muscle Gain, Fat Loss');
  const [newMeetingPoint, setNewMeetingPoint] = useState<string>('Blue Tokai Coffee Roasters');

  const loadData = async () => {
    setLoading(true);
    try {
      const rows = await getRealCounsellingRows();
      setClients(rows);
    } catch (e) {
      console.error('Error loading real counselling clients:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overdueCount = clients.filter((c) => c.needsReminder).length;

  const handleSelectClient = (c: CounsellingClientRow) => {
    setSelectedClient(c);
    setMessageText(
      `Hi ${c.name}, this is Sneha Dey following up on our 1-on-1 counselling session regarding your goals in ${c.goals}. Let me know how your meal routine and energy levels are feeling today!`
    );
  };

  const handleSendMessage = async (channel: 'whatsapp' | 'email' | 'sms') => {
    if (!selectedClient) return;
    setIsSending(true);

    const text = messageText.trim() || `Hi ${selectedClient.name}, Sneha Dey here following up on your 1-on-1 nutrition plan.`;
    const cleanPhone = selectedClient.phone.replace(/\D/g, '');

    try {
      if (channel === 'whatsapp') {
        const encoded = encodeURIComponent(text);
        const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
      } else if (channel === 'email') {
        if (!selectedClient.email || selectedClient.email === 'No email') {
          alert(`No email on file for ${selectedClient.name}. Please select WhatsApp or SMS.`);
          setIsSending(false);
          return;
        }
        await sendClinicalFollowUpEmail({
          clientName: selectedClient.name,
          clientEmail: selectedClient.email,
          category: 'Weekly Counselling',
          subject: '1-on-1 Clinical Nutrition Follow-Up',
          message: text,
        });
      } else if (channel === 'sms') {
        const encoded = encodeURIComponent(text);
        window.open(`sms:${cleanPhone}?body=${encoded}`, '_self');
      }

      // Record message timestamp in Firebase Realtime Database
      await recordClientMessageSent(selectedClient.id, selectedClient.name, channel, text, 'counselling');

      setSentSuccessToast(`✅ Message sent to ${selectedClient.name} via ${channel.toUpperCase()}!`);
      setTimeout(() => setSentSuccessToast(''), 4000);

      // Reload real data to update reminder badge
      await loadData();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Error dispatching message. Please try WhatsApp directly.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newMobile.trim()) {
      alert('Please provide full name and mobile number.');
      return;
    }

    try {
      await createRealCustomerInFirebase({
        fullName: newFullName,
        mobile: newMobile,
        email: newEmail,
        goals: newGoals.split(',').map((g) => g.trim()),
        meetingPoint: newMeetingPoint,
      });

      setNewFullName('');
      setNewMobile('');
      setNewEmail('');
      setIsAddingClient(false);
      await loadData();
      alert('Real client added to Firebase Realtime Database successfully!');
    } catch (err) {
      console.error('Error adding client to Firebase:', err);
      alert('Failed to save client to Firebase.');
    }
  };

  const isOpen = isModalOpen || isExternalOpen;
  const handleCloseModal = () => {
    setIsModalOpen(false);
    onCloseExternal?.();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* COMPACT DASHBOARD BOX (150x150px - 180x180px, CLICKING OPENS WORKSPACE)  */}
      {/* ========================================================================= */}
      {!hideTriggerCard && (
      <div
        className="wellness-card animate-fade-in"
        onClick={() => setIsModalOpen(true)}
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #0A1C44',
          borderRadius: '14px',
          padding: '12px',
          boxShadow: '0 4px 14px rgba(10, 28, 68, 0.08)',
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
        title="Click to open 1-on-1 Counselling Clients Interface"
      >
        <div>
          {/* Top row: Icon & Overdue Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#0A1C44',
                color: '#E8CA56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(10, 28, 68, 0.2)',
              }}
            >
              <HeartHandshake size={17} />
            </div>

            {/* Notification Badge with count like 1, 2, 3... */}
            {overdueCount > 0 ? (
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
                title={`${overdueCount} clients haven't received a message in > 2-3 days`}
              >
                <Bell size={10} />
                <span>{overdueCount}</span>
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

          <h4 style={{ fontSize: '12.5px', fontWeight: 900, color: '#0A1C44', margin: '4px 0 2px', lineHeight: 1.25 }}>
            1-on-1 Counselling 💬
          </h4>
          <p style={{ fontSize: '10px', color: '#6B7280', margin: 0, lineHeight: 1.3 }}>
            Goals • Meet • Contacts
          </p>
        </div>

        {/* Bottom stats & click cue */}
        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0A1C44' }}>
            {clients.length} Clients
          </span>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0A1C44', display: 'flex', alignItems: 'center', gap: '1px' }}>
            <span>Open</span>
            <ChevronRight size={11} />
          </span>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* INTERFACE INSIDE BOX 1 (MODAL WORKSPACE)                                  */}
      {/* ========================================================================= */}
      {isOpen && (
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
                backgroundColor: '#0A1C44',
                color: '#FFFFFF',
                padding: '16px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#E8CA56', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>1-on-1 Counselling Clients & Messaging Hub</span>
                    <span style={{ fontSize: '10px', backgroundColor: '#E8CA56', color: '#0A1C44', padding: '2px 7px', borderRadius: '10px', fontWeight: 900 }}>
                      Real Firebase Data Only
                    </span>
                  </h3>
                  <span style={{ fontSize: '11px', opacity: 0.85 }}>
                    Names • Goals • Where They Met • Contact Info • Multi-Channel Messaging
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={loadData}
                  style={{ background: 'none', border: 'none', color: '#E8CA56', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}
                  title="Reload from Firebase"
                >
                  <RefreshCw size={13} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Notification Alert Banner if clients need follow up */}
            {overdueCount > 0 && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  borderBottom: '1px solid #FEE2E2',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#991B1B',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <span>
                    Reminder: <strong>{overdueCount} client{overdueCount > 1 ? 's have' : ' has'} not received a message in more than 2-3 days!</strong>
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#B91C1C' }}>
                  Select client below to dispatch WhatsApp, Email, or SMS
                </span>
              </div>
            )}

            {/* Modal Body */}
            <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1, backgroundColor: '#F9FAFB' }}>
              
              {/* Action Buttons: Add Client */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937' }}>
                  Enrolled 1-on-1 Counselling Clients ({clients.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingClient(!isAddingClient)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>{isAddingClient ? 'Cancel' : '+ Add Real Client to Firebase'}</span>
                </button>
              </div>

              {/* Add Client Inline Form */}
              {isAddingClient && (
                <form
                  onSubmit={handleCreateClient}
                  className="animate-fade-in"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #0A1C44',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', margin: '0 0 10px' }}>
                    Add Real Client into Firebase Realtime Database
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#374151' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        placeholder="e.g. Meenakshi Sundaram"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#374151' }}>Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={newMobile}
                        onChange={(e) => setNewMobile(e.target.value)}
                        placeholder="+91 98765 00000"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#374151' }}>Email Address</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="client@gmail.com"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#374151' }}>Goals</label>
                      <input
                        type="text"
                        value={newGoals}
                        onChange={(e) => setNewGoals(e.target.value)}
                        placeholder="Muscle Gain, Better Sleep"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#374151' }}>Where Did They Meet (Meeting Point)</label>
                      <input
                        type="text"
                        value={newMeetingPoint}
                        onChange={(e) => setNewMeetingPoint(e.target.value)}
                        placeholder="Blue Tokai Coffee Roasters"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '11.5px' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '7px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Save Client to Realtime Database
                  </button>
                </form>
              )}

              {/* Toast Message */}
              {sentSuccessToast && (
                <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
                  {sentSuccessToast}
                </div>
              )}

              {/* Clients List */}
              {loading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>
                  Loading real client data from Firebase Realtime Database...
                </div>
              ) : clients.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937' }}>No real client records in Firebase yet.</div>
                  <p style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '4px' }}>
                    Click "+ Add Real Client to Firebase" above or complete onboarding in the user app.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {clients.map((c) => {
                    const isSelected = selectedClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #0A1C44' : c.needsReminder ? '1.5px solid #FCA5A5' : '1px solid #E5E7EB',
                          padding: '14px 16px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        {/* Top row: Name, Overdue Badge & Quick Select */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                                {c.name}
                              </span>
                              {c.needsReminder ? (
                                <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <AlertTriangle size={10} />
                                  <span>{c.daysSinceLastMessage != null ? `${c.daysSinceLastMessage} days ago (Overdue)` : 'No message yet (Overdue)'}</span>
                                </span>
                              ) : (
                                <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <CheckCircle2 size={10} />
                                  <span>Contacted {c.daysSinceLastMessage === 0 ? 'today' : `${c.daysSinceLastMessage}d ago`}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectClient(c)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? '#0A1C44' : '#F3F4F6',
                              color: isSelected ? '#E8CA56' : '#1F2937',
                              fontSize: '11px',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✓ Selected to Message' : 'Compose Message →'}
                          </button>
                        </div>

                        {/* Middle info grid: Goals, Where did they meet, Contact info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '11.5px' }}>
                          {/* 1. Goals */}
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Target size={11} color="#0A1C44" />
                              <span>GOALS</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.goals}
                            </div>
                          </div>

                          {/* 2. Where did they meet */}
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} color="#0A1C44" />
                              <span>WHERE DID THEY MEET</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              {c.meetingPoint}
                            </div>
                          </div>

                          {/* 3. Contact Info */}
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={11} color="#0A1C44" />
                              <span>CONTACT INFO</span>
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
                              📞 {c.phone} • ✉️ {c.email}
                            </div>
                          </div>
                        </div>

                        {/* Inline Dispatcher if Selected */}
                        {isSelected && (
                          <div style={{ marginTop: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#1F2937', display: 'block', marginBottom: '4px' }}>
                              Message for {c.name}:
                            </label>
                            <textarea
                              rows={2}
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB',
                                fontSize: '11.5px',
                                lineHeight: 1.4,
                                marginBottom: '8px',
                              }}
                            />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#4B5563' }}>Send Via:</span>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage('whatsapp')}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: '#059669',
                                  color: '#FFFFFF',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <MessageCircle size={13} />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage('email')}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: '#2563EB',
                                  color: '#FFFFFF',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <Mail size={13} />
                                <span>Email (Resend)</span>
                              </button>
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage('sms')}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: '#7C3AED',
                                  color: '#FFFFFF',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
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

            {/* Modal Footer */}
            <div style={{ padding: '12px 22px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#0A1C44',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close Interface
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
