import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Bell,
  Mail,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { getLongTermReminders, saveLongTermReminders } from '../../services/dataBookService';
import { saveLongTermSupportRecord, getLongTermSupportRecord, DEFAULT_PACKAGES } from '../../services/longTermSupportService';
import type { LongTermReminderRecord } from '../../types/longTermSupport';

interface LongTermSupportDataBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClientForPlan?: (clientId: string, clientName: string) => void;
}

export const LongTermSupportDataBookModal: React.FC<LongTermSupportDataBookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reminders, setReminders] = useState<LongTermReminderRecord[]>([]);
  const [durationFilter, setDurationFilter] = useState('All Durations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [channelFilter, setChannelFilter] = useState('All Channels');

  // Plan Assignment Dialog State
  const [assigningClient, setAssigningClient] = useState<LongTermReminderRecord | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pkg_3months');
  const [customPaymentLink, setCustomPaymentLink] = useState<string>('https://pages.razorpay.com/pl_she_nourishes_3m/view');
  const [adminNote, setAdminNote] = useState<string>('Recommended based on your lean mass and metabolic profile.');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      getLongTermReminders().then(setReminders);
    }
  }, [isOpen]);

  const filteredReminders = useMemo(() => {
    return reminders.filter((r) => {
      const matchDur = durationFilter === 'All Durations' || r.packageTaken.toLowerCase().includes(durationFilter.toLowerCase());
      const matchStatus = statusFilter === 'All Status' || r.status === statusFilter;
      const matchChannel = channelFilter === 'All Channels' || r.channel === channelFilter;
      return matchDur && matchStatus && matchChannel;
    });
  }, [reminders, durationFilter, statusFilter, channelFilter]);

  const handleSendReminder = async (remId: string) => {
    const updated = reminders.map((r) => {
      if (r.id === remId) {
        return {
          ...r,
          reminderSent: 'Yes' as const,
        };
      }
      return r;
    });
    setReminders(updated);
    await saveLongTermReminders(updated);
    setToastMessage('✅ Reminder Sent to Client Successfully via ' + (reminders.find(r => r.id === remId)?.channel || 'Channel') + '!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAssignSpecificPlan = async () => {
    if (!assigningClient) return;

    const pkg = DEFAULT_PACKAGES.find((p) => p.id === selectedPlanId) || DEFAULT_PACKAGES[2];
    const clientId = assigningClient.clientId || 'default';

    // Fetch existing session or default
    const session = await getLongTermSupportRecord(clientId);

    session.package = pkg;
    session.isPlanAssignedByAdmin = true;
    session.assignedPlanId = pkg.id;
    session.assignedPlanName = pkg.name;
    session.assignedPlanPrice = pkg.priceInr;
    session.adminAssignedAt = Date.now();
    session.adminRecommendationNote = adminNote;
    if (customPaymentLink.trim()) {
      session.package.paymentLink = customPaymentLink.trim();
    }

    await saveLongTermSupportRecord(session);

    // Also update reminder status
    const updatedReminders = reminders.map((r) => {
      if (r.id === assigningClient.id) {
        return {
          ...r,
          packageTaken: pkg.name,
          status: 'Active' as const,
          notes: `Plan prescribed by Sneha: ${pkg.name}`,
        };
      }
      return r;
    });
    setReminders(updatedReminders);
    await saveLongTermReminders(updatedReminders);

    setToastMessage(`🎯 Prescribed ${pkg.name} to ${assigningClient.name}! The client can now unlock this specific plan and proceed to agreement.`);
    setAssigningClient(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Client Name', 'Phone', 'Package Taken', 'Start Date', 'End Date', 'Status', 'Days Left / Overdue', 'Reminder Date', 'Channel', 'Message', 'Sent?', 'Response', 'Next Follow-up', 'Notes'];
    const rows = filteredReminders.map((r) => [
      `"${r.name}"`,
      `"${r.phone}"`,
      `"${r.packageTaken}"`,
      `"${r.serviceStartDate}"`,
      `"${r.serviceEndDate}"`,
      `"${r.status}"`,
      `"${r.daysLeftOrOverdue}"`,
      `"${r.reminderDate}"`,
      `"${r.channel}"`,
      `"${r.messageOfferToSend}"`,
      `"${r.reminderSent}"`,
      `"${r.clientResponse}"`,
      `"${r.nextFollowUp}"`,
      `"${r.notes}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `long_term_support_databook_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 25, 15, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        padding: '12px',
      }}
    >
      <div
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '1260px',
          maxHeight: '94vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: '1.5px solid #2B4214',
        }}
      >
        {/* Top Bar Header */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#1B3B22', margin: 0, letterSpacing: '-0.01em' }}>
                LONG-TERM HEALTH SUPPORT WITH NUTRITION 🌱
              </h1>
            </div>
            <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '3px 0 0' }}>
              Track long-term counseling packages, service completion and send timely reminders & offers.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px', color: '#374151', fontWeight: 600 }}>
              <Calendar size={13} />
              <span>Aug 25, 2025</span>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                border: 'none',
                color: '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '6px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {toastMessage && (
            <div style={{ padding: '12px 16px', backgroundColor: '#DEF7EC', border: '1px solid #31C48D', borderRadius: '8px', color: '#03543F', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Section 1: PROTOCOL SERVICES (Counseling Packages Taken) */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                1
              </span>
              <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                PROTOCOL SERVICES <span style={{ color: '#6B7280', fontWeight: 600 }}>(Counseling Packages Taken)</span>
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {[
                { title: '1 Month Service', days: '30 Days', color: '#059669', bg: '#ECFDF5' },
                { title: '2 Month Service', days: '60 Days', color: '#2563EB', bg: '#EFF6FF' },
                { title: '3 Month Service', days: '90 Days', color: '#D97706', bg: '#FFFBEB' },
                { title: '6 Month Service', days: '180 Days', color: '#7C3AED', bg: '#F5F3FF' },
                { title: '9 Month Service', days: '270 Days', color: '#0D9488', bg: '#F0FDFA' },
                { title: '12 Month Service', days: '365 Days', color: '#B45309', bg: '#FEF3C7' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: `1.5px solid ${s.color}33`,
                    backgroundColor: s.bg,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '4px',
                  }}
                >
                  <Calendar size={18} color={s.color} />
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#111827' }}>{s.title}</div>
                  <div style={{ fontSize: '11px', color: s.color, fontWeight: 700 }}>{s.days}</div>
                </div>
              ))}

              {/* End Card */}
              <div
                style={{
                  padding: '12px 10px',
                  borderRadius: '10px',
                  border: '1.5px dashed #10B981',
                  backgroundColor: '#ECFDF5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Clock size={18} color="#059669" />
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46' }}>After Service End Date</div>
                <div style={{ fontSize: '10px', color: '#047857' }}>Reminder Process Starts Automatically</div>
              </div>
            </div>
          </div>

          {/* Section 2: AFTER SERVICE END DATE - AUTOMATIC REMINDER PROCESS */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </span>
              <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AFTER SERVICE END DATE – AUTOMATIC REMINDER PROCESS
              </h3>
            </div>

            {/* Visual Process Flow Diagram */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px solid #E5E7EB', overflowX: 'auto', gap: '10px' }}>
              {[
                { label: 'Reminder To Send', icon: '🔔' },
                { label: 'Message Sent', icon: '✈️' },
                { label: 'Client Response', icon: '💬' },
                { label: 'Follow-up / Offer Tracking', icon: '🔄' },
                { label: 'Continue Support', icon: '✅' },
              ].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '110px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1.5px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      {step.icon}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textAlign: 'center' }}>
                      {step.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div style={{ color: '#9CA3AF', fontWeight: 800, fontSize: '16px' }}>➔</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 6 Metric Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={22} color="#059669" />
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Total Clients</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>{reminders.length}</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Real Database Clients</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={22} color="#2563EB" />
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Active Services</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
                    {reminders.filter(r => r.status === 'Active').length}
                  </div>
                  <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>Currently Running</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={22} color="#D97706" />
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Services Completed</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
                    {reminders.filter(r => r.status === 'Completed').length}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Completed Cycles</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={22} color="#7C3AED" />
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Reminders To Send</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
                    {reminders.filter(r => r.reminderSent !== 'Yes').length}
                  </div>
                  <div style={{ fontSize: '10px', color: '#DC2626', fontWeight: 600 }}>Pending</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={22} color="#0D9488" />
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Messages Sent</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
                    {reminders.filter(r => r.reminderSent === 'Yes').length}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Dispatched</div>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={22} color="#059669" />
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Client Responses</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
                    {reminders.filter(r => r.clientResponse && r.clientResponse !== 'Pending').length}
                  </div>
                  <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>Recorded Responses</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: REMINDER MESSAGE TRACKING (Table) */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  3
                </span>
                <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  REMINDER MESSAGE TRACKING <span style={{ color: '#6B7280', fontWeight: 600 }}>(Long-Term Package Reminders)</span>
                </h3>
              </div>

              {/* Filters & Bulk Send */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '11.5px', fontWeight: 600, color: '#374151' }}
                >
                  <option value="All Durations">All Durations</option>
                  <option value="1-Month">1 Month</option>
                  <option value="2-Month">2 Month</option>
                  <option value="3-Month">3 Month</option>
                  <option value="6-Month">6 Month</option>
                  <option value="9-Month">9 Month</option>
                  <option value="1-Year">1 Year</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '11.5px', fontWeight: 600, color: '#374151' }}
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '11.5px', fontWeight: 600, color: '#374151' }}
                >
                  <option value="All Channels">All Channels</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setToastMessage('📨 Bulk reminders triggered for pending overdue clients!');
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#0A3B22',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={13} />
                  <span>Send Bulk Reminder</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563', fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>Client</th>
                    <th style={{ padding: '10px 12px' }}>Package Taken</th>
                    <th style={{ padding: '10px 12px' }}>Service Start Date</th>
                    <th style={{ padding: '10px 12px' }}>Service End Date</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Days Since End / Left</th>
                    <th style={{ padding: '10px 12px' }}>Reminder Date</th>
                    <th style={{ padding: '10px 12px' }}>Channel</th>
                    <th style={{ padding: '10px 12px', minWidth: '180px' }}>Message / Offer To Send</th>
                    <th style={{ padding: '10px 12px' }}>Reminder Sent?</th>
                    <th style={{ padding: '10px 12px' }}>Client Response</th>
                    <th style={{ padding: '10px 12px' }}>Next Follow-up</th>
                    <th style={{ padding: '10px 12px' }}>Notes</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Admin Action</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#1F2937' }}>
                  {filteredReminders.map((r) => {
                    const initials = r.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                    const isOverdue = r.daysLeftOrOverdue.includes('Overdue');

                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        {/* Client with Avatar */}
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#DEF7EC', color: '#03543F', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {initials}
                            </div>
                            <div>
                              <strong style={{ color: '#111827', fontSize: '12px' }}>{r.name}</strong>
                              <div style={{ color: '#6B7280', fontSize: '10.5px' }}>{r.phone}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#374151' }}>{r.packageTaken}</td>
                        <td style={{ padding: '10px 12px', color: '#6B7280' }}>{r.serviceStartDate}</td>
                        <td style={{ padding: '10px 12px', color: '#6B7280' }}>{r.serviceEndDate}</td>

                        {/* Status */}
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: r.status === 'Active' ? '#E1EFFE' : '#DEF7EC', color: r.status === 'Active' ? '#1E429F' : '#03543F' }}>
                            {r.status}
                          </span>
                        </td>

                        {/* Days Left / Overdue */}
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontWeight: 800, color: isOverdue ? '#DC2626' : '#059669' }}>
                            {r.daysLeftOrOverdue}
                          </span>
                        </td>

                        <td style={{ padding: '10px 12px', color: '#4B5563' }}>{r.reminderDate}</td>

                        {/* Channel with Icon */}
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                            {r.channel === 'WhatsApp' && <MessageSquare size={13} color="#059669" />}
                            {r.channel === 'Email' && <Mail size={13} color="#2563EB" />}
                            {r.channel === 'SMS' && <Smartphone size={13} color="#D97706" />}
                            <span>{r.channel}</span>
                          </div>
                        </td>

                        <td style={{ padding: '10px 12px', color: '#4B5563', fontSize: '11px' }}>{r.messageOfferToSend}</td>

                        {/* Reminder Sent? */}
                        <td style={{ padding: '10px 12px' }}>
                          {r.reminderSent === 'Yes' ? (
                            <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 700, fontSize: '10.5px' }}>
                              Yes
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendReminder(r.id)}
                              style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #10B981', backgroundColor: '#ECFDF5', color: '#047857', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Send Now
                            </button>
                          )}
                        </td>

                        {/* Client Response */}
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontWeight: 700, color: r.clientResponse === 'Interested' ? '#059669' : r.clientResponse === 'Replied' ? '#2563EB' : r.clientResponse === 'Not Interested' ? '#DC2626' : '#9CA3AF' }}>
                            {r.clientResponse}
                          </span>
                        </td>

                        <td style={{ padding: '10px 12px', color: '#4B5563' }}>{r.nextFollowUp}</td>
                        <td style={{ padding: '10px 12px', color: '#6B7280', fontSize: '10.5px' }}>{r.notes}</td>

                        {/* Admin Action: Assign Plan button */}
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setAssigningClient(r)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#0A1C44',
                              color: '#E8CA56',
                              fontSize: '11px',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Sparkles size={12} />
                            <span>Prescribe Plan</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: FOLLOW-UP BOX (From Registration Data) */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                4
              </span>
              <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                FOLLOW-UP BOX <span style={{ color: '#6B7280', fontWeight: 600 }}>(From Registration Data)</span>
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {/* Follow-ups Due Today */}
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>10</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151' }}>Follow-ups Due Today</div>
                  <div style={{ fontSize: '10.5px', color: '#6B7280' }}>Clients need follow-up</div>
                </div>
              </div>

              {/* Overdue Follow-ups */}
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #FEE2E2', backgroundColor: '#FFF5F5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#DC2626' }}>06</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#991B1B' }}>Overdue Follow-ups</div>
                  <div style={{ fontSize: '10.5px', color: '#B91C1C' }}>Need immediate action</div>
                </div>
              </div>

              {/* Waiting For Response */}
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>07</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151' }}>Waiting For Response</div>
                  <div style={{ fontSize: '10.5px', color: '#6B7280' }}>Client hasn't replied</div>
                </div>
              </div>

              {/* Follow-ups This Week */}
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>05</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151' }}>Follow-ups This Week</div>
                  <div style={{ fontSize: '10.5px', color: '#6B7280' }}>Planned follow-ups</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F3F4F6', borderRadius: '8px', fontSize: '11.5px', color: '#4B5563' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="#059669" />
              <span>All data is from client registrations. Used only for tracking & follow-up purposes.</span>
            </div>
            <span style={{ fontWeight: 600, color: '#047857' }}>✓ This data is not sold or shared.</span>
          </div>

        </div>
      </div>

      {/* Admin Specific Plan Prescription Modal */}
      {assigningClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1400,
            padding: '16px',
          }}
        >
          <div
            className="animate-scale-up"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              border: '2px solid #0A1C44',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0A1C44', margin: 0 }}>
                  Prescribe Specific Plan to Client
                </h3>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  Client: <strong>{assigningClient.name}</strong> ({assigningClient.phone})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssigningClient(null)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '10px 12px', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', fontSize: '11.5px', color: '#92400E', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>
                <strong>Clinical Exclusivity:</strong> Only the specific plan selected below will be unlocked for <strong>{assigningClient.name}</strong>. The client will only be able to view and sign the agreement for this exact plan.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Select Package to Prescribe *
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedPlanId(id);
                    const p = DEFAULT_PACKAGES.find(x => x.id === id);
                    if (p?.paymentLink) setCustomPaymentLink(p.paymentLink);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0A1C44', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF', color: '#0A1C44' }}
                >
                  {DEFAULT_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ₹{pkg.priceInr.toLocaleString('en-IN')} ({pkg.durationMonths} Month{pkg.durationMonths > 1 ? 's' : ''}, {pkg.followUpDays} Follow-ups)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Payment / Enrollment Gateway Link
                </label>
                <input
                  type="text"
                  value={customPaymentLink}
                  onChange={(e) => setCustomPaymentLink(e.target.value)}
                  placeholder="https://pages.razorpay.com/..."
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Clinical Recommendation Note from Sneha Dey
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Recommended 3-Month protocol for steady fat loss and gut rehabilitation."
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAssigningClient(null)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignSpecificPlan}
                  style={{ padding: '9px 18px', borderRadius: '8px', backgroundColor: '#0A1C44', color: '#E8CA56', border: 'none', fontSize: '12.5px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>Assign & Send Plan to Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
