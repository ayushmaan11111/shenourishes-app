import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Utensils, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import { getAllCustomerRecords } from '../../services/customerService';
import { sendClinicalFollowUpEmail } from '../../services/resendEmailService';
import { getChatMessages, sendChatMessage, type ChatMessage } from '../../services/chatService';
import { getClientActiveDietChart, calculateChartTotals } from '../../services/clinicalDietTemplates';
import { 
  dispatchAdminFollowUpNote 
} from '../../services/adminFollowUpService';
import type { CustomerRecord } from '../../types/customer';
import type { ClinicalDietChart } from '../../types/clinicalChart';

interface TodaysOverviewFollowUpBoxesProps {
  isAdmin?: boolean;
  clientId?: string;
  clientName?: string;
  hideLongTermMessageBox?: boolean;
  onOpenCounselling?: () => void;
  onOpenLongTerm?: () => void;
  onOpenDietChart?: () => void;
}

export const TodaysOverviewFollowUpBoxes: React.FC<TodaysOverviewFollowUpBoxesProps> = ({
  isAdmin = false,
  clientId = 'default',
  clientName = 'Valued Member',
  hideLongTermMessageBox = true,
  onOpenCounselling,
  onOpenLongTerm,
  onOpenDietChart,
}) => {
  const [clients, setClients] = useState<CustomerRecord[]>([]);
  const [activeChart, setActiveChart] = useState<ClinicalDietChart | null>(null);

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Admin Weekly Counselling Dispatch Box State
  const [counsellingClientIndex, setCounsellingClientIndex] = useState<number>(0);
  const [counsellingTemplate, setCounsellingTemplate] = useState<string>('progress');
  const [counsellingMessage, setCounsellingMessage] = useState<string>('');
  const [counsellingChannel, setCounsellingChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [counsellingSending, setCounsellingSending] = useState<boolean>(false);
  const [counsellingSentToast, setCounsellingSentToast] = useState<string>('');
  const [lastCounsellingSentTime, setLastCounsellingSentTime] = useState<string>('');

  // Admin Long-Term Support Dispatch Box State
  const [longTermClientIndex, setLongTermClientIndex] = useState<number>(0);
  const [longTermTemplate, setLongTermTemplate] = useState<string>('milestone');
  const [longTermMessage, setLongTermMessage] = useState<string>('');
  const [longTermChannel, setLongTermChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [longTermSending, setLongTermSending] = useState<boolean>(false);
  const [longTermSentToast, setLongTermSentToast] = useState<string>('');
  const [lastLongTermSentTime, setLastLongTermSentTime] = useState<string>('');

  useEffect(() => {
    getAllCustomerRecords().then((records) => {
      if (records && records.length > 0) {
        setClients(records);
        const chart = getClientActiveDietChart(records[0].uid || clientId);
        setActiveChart(chart);
      } else {
        const chart = getClientActiveDietChart(clientId);
        setActiveChart(chart);
      }
    });

    getChatMessages().then(setChatMessages);
  }, [clientId]);

  const activeCounsellingClient = clients[counsellingClientIndex] || clients[0];
  const activeLongTermClient = clients[longTermClientIndex] || clients[0];

  const getClientName = (client?: CustomerRecord) => 
    client?.personalDetails?.fullName || 'Client';

  const getClientPhone = (client?: CustomerRecord) => 
    client?.personalDetails?.mobileNumber || '';

  const getClientEmail = (client?: CustomerRecord) => 
    client?.personalDetails?.emailAddress || '';

  // Update Counselling Message template for Admin
  useEffect(() => {
    const name = getClientName(activeCounsellingClient);
    if (counsellingTemplate === 'progress') {
      setCounsellingMessage(
        `Hi ${name}, this is Sneha Dey following up on your weekly 1-on-1 counselling session. How is your energy and meal adherence going this week? Please reply with any meal or recipe questions so we can adjust!`
      );
    } else if (counsellingTemplate === 'slot') {
      setCounsellingMessage(
        `Hi ${name}, your upcoming weekly 1-on-1 video consultation slot is ready for scheduling. Please let me know your preferred day and time so we can lock it in.`
      );
    } else if (counsellingTemplate === 'weighin') {
      setCounsellingMessage(
        `Hi ${name}, it is time for our weekly progress check! Please log your morning fasting weight and let me know how your digestion has been over the past 7 days.`
      );
    }
  }, [counsellingClientIndex, counsellingTemplate, clients]);

  // Update Long-Term Message template for Admin
  useEffect(() => {
    const name = getClientName(activeLongTermClient);
    if (longTermTemplate === 'milestone') {
      setLongTermMessage(
        `Hi ${name}, congratulations on your ongoing long-term transformation journey with She Nourishes! Let's review your monthly biometric progress and ensure your targets stay optimized.`
      );
    } else if (longTermTemplate === 'supplements') {
      setLongTermMessage(
        `Hi ${name}, Sneha Dey has updated your clinical nutrition protocol, supplement timing stack, and recipe guide in your app portal. Please review your personalized charts!`
      );
    } else if (longTermTemplate === 'renewal') {
      setLongTermMessage(
        `Hi ${name}, your long-term transformation package is approaching its next milestone window. Continue your clinical care and keep your momentum going with our extended renewal protocol.`
      );
    }
  }, [longTermClientIndex, longTermTemplate, clients]);

  // Handle live chat sending
  const handleSendChatMessage = async (customText?: string) => {
    const text = (customText || chatInputText).trim();
    if (!text) return;

    setIsSendingChat(true);
    const sender = isAdmin ? 'admin' : 'user';
    const senderName = isAdmin ? 'Sneha Dey (Counselor)' : (clientName || 'You');

    try {
      const updated = await sendChatMessage(sender, senderName, text);
      setChatMessages(updated);
      setChatInputText('');
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Admin sends Counselling follow up
  const handleSendCounsellingFollowUp = async () => {
    const client = activeCounsellingClient;
    const name = getClientName(client);
    const phone = getClientPhone(client).replace(/\D/g, '');
    const email = getClientEmail(client);

    setCounsellingSending(true);

    try {
      if (counsellingChannel === 'whatsapp') {
        const encoded = encodeURIComponent(counsellingMessage);
        const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
      } else if (counsellingChannel === 'email') {
        if (!email) {
          alert(`No email address on file for ${name}. Please choose WhatsApp or enter an email.`);
          setCounsellingSending(false);
          return;
        }
        await sendClinicalFollowUpEmail({
          clientName: name,
          clientEmail: email,
          category: 'Weekly Counselling',
          subject: 'Weekly Nutrition & Progress Check-In',
          message: counsellingMessage,
        });
      } else if (counsellingChannel === 'sms') {
        const encoded = encodeURIComponent(counsellingMessage);
        window.open(`sms:${phone}?body=${encoded}`, '_self');
      }

      // Record in Admin Follow-up Service so it shows in the client's notification badge box!
      await dispatchAdminFollowUpNote({
        clientId: client?.uid || 'default',
        clientName: name,
        category: 'counselling',
        channel: counsellingChannel,
        subject: 'Weekly Nutrition & Progress Check-In',
        message: counsellingMessage,
        senderName: 'Sneha Dey (Lead Nutritionist)',
      });

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastCounsellingSentTime(`Sent at ${now}`);
      setCounsellingSentToast(`✅ Follow-up dispatched to ${name} via ${counsellingChannel.toUpperCase()}!`);
      setTimeout(() => setCounsellingSentToast(''), 4000);
    } catch (e) {
      console.error('Error sending counselling follow-up:', e);
      alert('Error sending message. Please try again or use WhatsApp directly.');
    } finally {
      setCounsellingSending(false);
    }
  };

  // Admin sends Long-Term follow up
  const handleSendLongTermFollowUp = async () => {
    const client = activeLongTermClient;
    const name = getClientName(client);
    const phone = getClientPhone(client).replace(/\D/g, '');
    const email = getClientEmail(client);

    setLongTermSending(true);

    try {
      if (longTermChannel === 'whatsapp') {
        const encoded = encodeURIComponent(longTermMessage);
        const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
      } else if (longTermChannel === 'email') {
        if (!email) {
          alert(`No email address on file for ${name}. Please choose WhatsApp or enter an email.`);
          setLongTermSending(false);
          return;
        }
        await sendClinicalFollowUpEmail({
          clientName: name,
          clientEmail: email,
          category: 'Long-Term Support',
          subject: 'Long-Term Health Transformation Follow-Up',
          message: longTermMessage,
        });
      } else if (longTermChannel === 'sms') {
        const encoded = encodeURIComponent(longTermMessage);
        window.open(`sms:${phone}?body=${encoded}`, '_self');
      }

      // Record in Admin Follow-up Service so it shows in the client's notification badge box!
      await dispatchAdminFollowUpNote({
        clientId: client?.uid || 'default',
        clientName: name,
        category: 'long_term',
        channel: longTermChannel,
        subject: 'Long-Term Health Transformation Follow-Up',
        message: longTermMessage,
        senderName: 'Sneha Dey (Lead Nutritionist)',
      });

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastLongTermSentTime(`Sent at ${now}`);
      setLongTermSentToast(`✅ Follow-up dispatched to ${name} via ${longTermChannel.toUpperCase()}!`);
      setTimeout(() => setLongTermSentToast(''), 4000);
    } catch (e) {
      console.error('Error sending long-term follow-up:', e);
      alert('Error sending message. Please try again or use WhatsApp directly.');
    } finally {
      setLongTermSending(false);
    }
  };

  const chartTotals = activeChart ? calculateChartTotals(activeChart) : { totalCalories: 1650, totalProtein: 110, totalFat: 50, totalCarbs: 140 };

  // =========================================================================
  // RENDER: USER PANEL VIEW (TODAY'S OVERVIEW)
  // Per user instruction: HIDE THE WEEKLY COUNSELLING, LONG TERM SUPPORT PROTOCOL, AND 1-ON-1 COUNSELLING CHAT FROM USER PANEL
  // =========================================================================
  if (!isAdmin) {
    return null;
  }

  // =========================================================================
  // RENDER: ADMIN PANEL VIEW (FULL DISPATCH SUITE WITH CLIENTS & CONTROLS)
  // =========================================================================
  return (
    <div style={{ marginBottom: '22px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', boxShadow: '0 0 6px #10B981' }} />
            <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#1B3B22', margin: 0, letterSpacing: '-0.3px' }}>
              Today's Overview & Follow-up Messaging Hub
            </h3>
          </div>
          <span style={{ fontSize: '11.5px', color: '#6B7063' }}>
            Admin Multi-Channel Client Follow-up, 1-on-1 Clinical Chat & Prescribed Nutrition Charts
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#0A1C44', fontWeight: 800, backgroundColor: '#E8CA56', padding: '3px 9px', borderRadius: '6px' }}>
            Admin Dispatch Active
          </span>
        </div>
      </div>

      {/* 4 Responsive Boxes Grid for Admin */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>

        {/* ========================================================================= */}
        {/* BOX A: 1-ON-1 CLINICAL CHAT (LIVE CONSULTATION CONVERSATION)               */}
        {/* ========================================================================= */}
        <div
          className="wellness-card animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #059669',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '380px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#DEF7EC', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#065F46', margin: 0 }}>
                    1-on-1 Clinical Chat 💬
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#047857', fontWeight: 600 }}>
                    Consultation with Sneha Dey
                  </span>
                </div>
              </div>

              <a
                href="https://wa.me/917980862086"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#047857',
                  backgroundColor: '#DEF7EC',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>WhatsApp</span>
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Message Thread Window */}
            <div
              ref={chatScrollRef}
              style={{
                height: '190px',
                overflowY: 'auto',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '6px',
              }}
            >
              {chatMessages.map((msg) => {
                const isMe = msg.sender === 'admin';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      backgroundColor: isMe ? '#059669' : '#FFFFFF',
                      color: isMe ? '#FFFFFF' : '#1F2937',
                      padding: '7px 10px',
                      borderRadius: isMe ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      fontSize: '11.5px',
                      lineHeight: 1.35,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: isMe ? 'none' : '1px solid #E5E7EB',
                    }}
                  >
                    <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.8, marginBottom: '2px' }}>
                      {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {msg.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Composer */}
          <div style={{ marginTop: '10px' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              style={{ display: 'flex', gap: '6px' }}
            >
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Reply to client as Sneha Dey..."
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '11.5px',
                }}
              />
              <button
                type="submit"
                disabled={isSendingChat}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: isSendingChat ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* BOX B: TODAY'S DIET CHART (PRESCRIBED MEAL PLAN & MACROS)                 */}
        {/* ========================================================================= */}
        <div
          className="wellness-card animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #38571A',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(56, 87, 26, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '380px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#EEF4E8', color: '#38571A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Utensils size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1B3B22', margin: 0 }}>
                    Today's Diet Chart 🥗
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#4F5C38', fontWeight: 600 }}>
                    Active Prescribed Protocol & Macros
                  </span>
                </div>
              </div>

              {onOpenDietChart && (
                <button
                  type="button"
                  onClick={onOpenDietChart}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#38571A',
                    backgroundColor: '#EEF4E8',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>Full Chart</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            {/* Macro Highlights Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#FEF3C7', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E' }}>CALORIES</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#78350F' }}>
                  {chartTotals.totalCalories}
                </div>
              </div>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#DEF7EC', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#03543F' }}>PROTEIN</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#046C4E' }}>
                  {chartTotals.totalProtein}g
                </div>
              </div>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#EFF6FF', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#1E40AF' }}>FATS</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#1D4ED8' }}>
                  {chartTotals.totalFat}g
                </div>
              </div>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#F3F4F6', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#374151' }}>CARBS</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#111827' }}>
                  {chartTotals.totalCarbs}g
                </div>
              </div>
            </div>

            {/* Meal Items Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {(activeChart?.meals || []).slice(0, 4).map((meal, idx) => (
                <div
                  key={meal.mealName || idx}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#F8F6EF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#1B3B22' }}>
                      {meal.mealName}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#6B7063' }}>
                      {meal.foods?.map(f => f.foodName).slice(0, 2).join(', ') || 'Custom prescribed items'}
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#38571A', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>
                    {meal.foods?.reduce((acc, f) => acc + (f.calories || 0), 0) || 350} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={onOpenDietChart}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: '#38571A',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(56, 87, 26, 0.2)',
              }}
            >
              <span>Open & Customize Meal Plan</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* BOX C: WEEKLY COUNSELLING FOLLOW-UP (ADMIN MESSAGING DISPATCH)            */}
        {/* ========================================================================= */}
        <div
          className="wellness-card animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #0A1C44',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(10, 28, 68, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '380px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#0A1C44', color: '#E8CA56', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartHandshake size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                    Weekly Counselling Follow-up 💬
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#6B7280', fontWeight: 600 }}>
                    1-on-1 Consultation Outreach
                  </span>
                </div>
              </div>

              {onOpenCounselling && (
                <button
                  type="button"
                  onClick={onOpenCounselling}
                  style={{ fontSize: '11px', fontWeight: 800, color: '#0A1C44', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Manage →
                </button>
              )}
            </div>

            {/* Target Client Dropdown */}
            <div style={{ marginTop: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Target Client:</span>
                <span style={{ color: '#6B7280' }}>{getClientPhone(activeCounsellingClient) || 'No phone'}</span>
              </label>
              <select
                value={counsellingClientIndex}
                onChange={(e) => setCounsellingClientIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                }}
              >
                {clients.map((c, i) => (
                  <option key={c.uid || i} value={i}>
                    {c.personalDetails?.fullName || `Client ${i + 1}`} ({c.personalDetails?.mobileNumber || c.personalDetails?.emailAddress || 'Registered Client'})
                  </option>
                ))}
                {clients.length === 0 && <option value={0}>Demo Client (Sneha Dey Clinic)</option>}
              </select>
            </div>

            {/* Quick Template Buttons */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setCounsellingTemplate('progress')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: counsellingTemplate === 'progress' ? '1.5px solid #0A1C44' : '1px solid #E5E7EB',
                    backgroundColor: counsellingTemplate === 'progress' ? '#0A1C44' : '#F3F4F6',
                    color: counsellingTemplate === 'progress' ? '#E8CA56' : '#374151',
                  }}
                >
                  🥗 Diet & Energy Check
                </button>
                <button
                  type="button"
                  onClick={() => setCounsellingTemplate('slot')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: counsellingTemplate === 'slot' ? '1.5px solid #0A1C44' : '1px solid #E5E7EB',
                    backgroundColor: counsellingTemplate === 'slot' ? '#0A1C44' : '#F3F4F6',
                    color: counsellingTemplate === 'slot' ? '#E8CA56' : '#374151',
                  }}
                >
                  📅 Slot Booking
                </button>
                <button
                  type="button"
                  onClick={() => setCounsellingTemplate('weighin')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: counsellingTemplate === 'weighin' ? '1.5px solid #0A1C44' : '1px solid #E5E7EB',
                    backgroundColor: counsellingTemplate === 'weighin' ? '#0A1C44' : '#F3F4F6',
                    color: counsellingTemplate === 'weighin' ? '#E8CA56' : '#374151',
                  }}
                >
                  ⚖️ Weekly Weigh-in
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div style={{ marginTop: '8px' }}>
              <textarea
                rows={3}
                value={counsellingMessage}
                onChange={(e) => setCounsellingMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 9px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '11px',
                  lineHeight: 1.4,
                  color: '#1F2937',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Channel Buttons */}
            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#4B5563' }}>Send Via:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setCounsellingChannel('whatsapp')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: counsellingChannel === 'whatsapp' ? '1.5px solid #059669' : '1px solid #D1D5DB',
                    backgroundColor: counsellingChannel === 'whatsapp' ? '#DEF7EC' : '#FFFFFF',
                    color: counsellingChannel === 'whatsapp' ? '#03543F' : '#4B5563',
                  }}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setCounsellingChannel('email')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: counsellingChannel === 'email' ? '1.5px solid #2563EB' : '1px solid #D1D5DB',
                    backgroundColor: counsellingChannel === 'email' ? '#EFF6FF' : '#FFFFFF',
                    color: counsellingChannel === 'email' ? '#1E40AF' : '#4B5563',
                  }}
                >
                  Email (Resend)
                </button>
                <button
                  type="button"
                  onClick={() => setCounsellingChannel('sms')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: counsellingChannel === 'sms' ? '1.5px solid #7C3AED' : '1px solid #D1D5DB',
                    backgroundColor: counsellingChannel === 'sms' ? '#F5F3FF' : '#FFFFFF',
                    color: counsellingChannel === 'sms' ? '#5B21B6' : '#4B5563',
                  }}
                >
                  SMS
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '8px' }}>
            {counsellingSentToast && (
              <div style={{ padding: '6px 8px', backgroundColor: '#DEF7EC', borderRadius: '4px', color: '#03543F', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                {counsellingSentToast}
              </div>
            )}
            {lastCounsellingSentTime && (
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px', textAlign: 'right', fontWeight: 600 }}>
                {lastCounsellingSentTime}
              </div>
            )}
            <button
              type="button"
              onClick={handleSendCounsellingFollowUp}
              disabled={counsellingSending}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#0A1C44',
                color: '#E8CA56',
                fontSize: '11.5px',
                fontWeight: 800,
                border: 'none',
                cursor: counsellingSending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Send size={13} />
              <span>{counsellingSending ? 'Sending...' : 'Dispatch Follow-up Message'}</span>
            </button>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* BOX D: LONG-TERM SUPPORT FOLLOW-UP (ADMIN PROTOCOL DISPATCH)               */}
        {/* ========================================================================= */}
        {!hideLongTermMessageBox && (
        <div
          className="wellness-card animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #38571A',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(56, 87, 26, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '380px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#EEF4E8', color: '#38571A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1B3B22', margin: 0 }}>
                    Long-Term Support Follow-up 🌱
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#4F5C38', fontWeight: 600 }}>
                    1–12 Month Protocol Milestones
                  </span>
                </div>
              </div>

              {onOpenLongTerm && (
                <button
                  type="button"
                  onClick={onOpenLongTerm}
                  style={{ fontSize: '11px', fontWeight: 800, color: '#38571A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Manage →
                </button>
              )}
            </div>

            {/* Target Client Dropdown */}
            <div style={{ marginTop: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Target Client:</span>
                <span style={{ color: '#6B7280' }}>{getClientPhone(activeLongTermClient) || 'No phone'}</span>
              </label>
              <select
                value={longTermClientIndex}
                onChange={(e) => setLongTermClientIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                }}
              >
                {clients.map((c, i) => (
                  <option key={c.uid || i} value={i}>
                    {c.personalDetails?.fullName || `Client ${i + 1}`} ({c.personalDetails?.mobileNumber || c.personalDetails?.emailAddress || 'Registered Client'})
                  </option>
                ))}
                {clients.length === 0 && <option value={0}>Demo Client (Sneha Dey Clinic)</option>}
              </select>
            </div>

            {/* Quick Template Buttons */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setLongTermTemplate('milestone')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: longTermTemplate === 'milestone' ? '1.5px solid #38571A' : '1px solid #E5E7EB',
                    backgroundColor: longTermTemplate === 'milestone' ? '#38571A' : '#F3F4F6',
                    color: longTermTemplate === 'milestone' ? '#FFFFFF' : '#374151',
                  }}
                >
                  🏆 Milestone Check
                </button>
                <button
                  type="button"
                  onClick={() => setLongTermTemplate('supplements')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: longTermTemplate === 'supplements' ? '1.5px solid #38571A' : '1px solid #E5E7EB',
                    backgroundColor: longTermTemplate === 'supplements' ? '#38571A' : '#F3F4F6',
                    color: longTermTemplate === 'supplements' ? '#FFFFFF' : '#374151',
                  }}
                >
                  💊 Supplements Stack
                </button>
                <button
                  type="button"
                  onClick={() => setLongTermTemplate('renewal')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: longTermTemplate === 'renewal' ? '1.5px solid #38571A' : '1px solid #E5E7EB',
                    backgroundColor: longTermTemplate === 'renewal' ? '#38571A' : '#F3F4F6',
                    color: longTermTemplate === 'renewal' ? '#FFFFFF' : '#374151',
                  }}
                >
                  🔄 Renewal
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div style={{ marginTop: '8px' }}>
              <textarea
                rows={3}
                value={longTermMessage}
                onChange={(e) => setLongTermMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 9px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '11px',
                  lineHeight: 1.4,
                  color: '#1F2937',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Channel Buttons */}
            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#4B5563' }}>Send Via:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setLongTermChannel('whatsapp')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: longTermChannel === 'whatsapp' ? '1.5px solid #059669' : '1px solid #D1D5DB',
                    backgroundColor: longTermChannel === 'whatsapp' ? '#DEF7EC' : '#FFFFFF',
                    color: longTermChannel === 'whatsapp' ? '#03543F' : '#4B5563',
                  }}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setLongTermChannel('email')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: longTermChannel === 'email' ? '1.5px solid #2563EB' : '1px solid #D1D5DB',
                    backgroundColor: longTermChannel === 'email' ? '#EFF6FF' : '#FFFFFF',
                    color: longTermChannel === 'email' ? '#1E40AF' : '#4B5563',
                  }}
                >
                  Email (Resend)
                </button>
                <button
                  type="button"
                  onClick={() => setLongTermChannel('sms')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: longTermChannel === 'sms' ? '1.5px solid #7C3AED' : '1px solid #D1D5DB',
                    backgroundColor: longTermChannel === 'sms' ? '#F5F3FF' : '#FFFFFF',
                    color: longTermChannel === 'sms' ? '#5B21B6' : '#4B5563',
                  }}
                >
                  SMS
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '8px' }}>
            {longTermSentToast && (
              <div style={{ padding: '6px 8px', backgroundColor: '#DEF7EC', borderRadius: '4px', color: '#03543F', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                {longTermSentToast}
              </div>
            )}
            {lastLongTermSentTime && (
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px', textAlign: 'right', fontWeight: 600 }}>
                {lastLongTermSentTime}
              </div>
            )}
            <button
              type="button"
              onClick={handleSendLongTermFollowUp}
              disabled={longTermSending}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#38571A',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 800,
                border: 'none',
                cursor: longTermSending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Send size={13} />
              <span>{longTermSending ? 'Sending...' : 'Dispatch Protocol Follow-up'}</span>
            </button>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};
