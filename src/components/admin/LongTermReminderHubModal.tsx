import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  Users
} from 'lucide-react';
import { 
  getLongTermLeads, 
  getLongTermSoldClients, 
  dispatchClientCommunication,
  SCRIPTED_DAILY_TEMPLATES,
  type LongTermSupportLead, 
  type LongTermSoldClient
} from '../../services/longTermDataBookService';

interface LongTermReminderHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'leads' | 'ending_soon' | 'validity';
}

export const LongTermReminderHubModal: React.FC<LongTermReminderHubModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'leads',
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'ending_soon' | 'validity'>(defaultTab);
  const [leads, setLeads] = useState<LongTermSupportLead[]>([]);
  const [soldClients, setSoldClients] = useState<LongTermSoldClient[]>([]);

  // Global Auto-Switch mode for Daily Lead Reminders
  // Can be 'auto' | 'manual' | 'scripted'
  const [dispatchMode, setDispatchMode] = useState<'auto' | 'manual' | 'scripted'>('scripted');
  const [selectedScriptDay, setSelectedScriptDay] = useState<number>(1);
  const [customManualMessage, setCustomManualMessage] = useState<string>(
    'Hi {name}, this is Sneha Dey following up on your long-term transformation goals in {goal}. How are your energy levels and meals feeling today?'
  );
  const [toastMessage, setToastMessage] = useState<string>('');

  const loadData = async () => {
    try {
      const [lData, sData] = await Promise.all([
        getLongTermLeads(),
        getLongTermSoldClients(),
      ]);
      setLeads(lData);
      setSoldClients(sData);
    } catch (e) {
      console.error('Error loading reminder data:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      loadData();
    }
  }, [isOpen, defaultTab]);

  // Clients with packages ending in <= 14 days or expired
  const endingSoonClients = soldClients.filter(c => c.daysRemaining <= 14);

  // Get current active script template
  const activeScript = SCRIPTED_DAILY_TEMPLATES.find(s => s.day === selectedScriptDay) || SCRIPTED_DAILY_TEMPLATES[0];

  const formatLeadMessage = (lead: LongTermSupportLead) => {
    let raw = '';
    if (dispatchMode === 'scripted') {
      raw = activeScript.message;
    } else if (dispatchMode === 'manual') {
      raw = customManualMessage;
    } else {
      raw = `Hi {name}, your daily long-term nutrition reminder for {goal} is active! Sneha Dey here ensuring your {package} protocol is on schedule.`;
    }
    return raw
      .replace(/{name}/g, lead.name)
      .replace(/{goal}/g, lead.goal)
      .replace(/{package}/g, lead.decidedPackageOption);
  };

  const handleSendLeadReminder = async (lead: LongTermSupportLead, channel: 'whatsapp' | 'sms' | 'email') => {
    const text = formatLeadMessage(lead);
    await dispatchClientCommunication({
      clientName: lead.name,
      phone: lead.contactNo,
      email: lead.email,
      channel,
      subject: `Daily Transformation Follow-Up: ${lead.goal}`,
      message: text,
    });
    setToastMessage(`Dispatched daily reminder to ${lead.name} via ${channel.toUpperCase()}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSendEndingSoonReminder = async (client: LongTermSoldClient, channel: 'whatsapp' | 'sms' | 'email') => {
    const text = `Hi ${client.name}, your ${client.packageTaken} transformation validity ends on ${client.endDate} (${client.daysRemaining} days remaining). We have reserved your loyalty renewal slot with updated customized diet and workout charts. Reply here to lock in your extended protocol!`;
    await dispatchClientCommunication({
      clientName: client.name,
      phone: client.contactNo,
      email: client.email,
      channel,
      subject: `Package Validity Notice: ${client.daysRemaining} Days Left`,
      message: text,
    });
    setToastMessage(`Renewal reminder dispatched to ${client.name} via ${channel.toUpperCase()}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSendValidityMilestoneAlert = async (client: LongTermSoldClient) => {
    const text = `Hi ${client.name}, program validity check-in from Sneha Dey: Active from ${client.startDate} to ${client.endDate} (${client.daysRemaining} days left). Keep up your daily nutritional logging!`;
    await dispatchClientCommunication({
      clientName: client.name,
      phone: client.contactNo,
      email: client.email,
      channel: 'whatsapp',
      subject: 'Long-Term Program Validity Milestone',
      message: text,
    });
    setToastMessage(`Validity alert sent to ${client.name}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
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
          borderRadius: '18px',
          maxWidth: '1080px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(6, 78, 59, 0.35)',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#064E3B',
            color: '#FFFFFF',
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#6EE7B7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                  Long-Term 3-in-1 Reminders & Validity Hub
                </h3>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 900,
                    backgroundColor: '#10B981',
                    color: '#064E3B',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  Automated Engine
                </span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '2px 0 0 0' }}>
                1. Daily Lead Reminders • 2. Package Ending Soon Reminders • 3. Auto Start Date & Validity Tracker
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={loadData}
              style={{
                background: 'none',
                border: 'none',
                color: '#A7F3D0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: 700,
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              padding: '8px 18px',
              backgroundColor: '#ECFDF5',
              borderBottom: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* 3 Nav Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F0FDF4',
            borderBottom: '2px solid #BBF7D0',
            padding: '4px 20px 0',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'leads' ? '3px solid #064E3B' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'leads' ? '#064E3B' : '#64748B',
              fontSize: '13px',
              fontWeight: activeTab === 'leads' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={15} />
            <span>1. Daily Lead Reminders</span>
            <span
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '10px',
                fontWeight: 800,
              }}
            >
              {leads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ending_soon')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'ending_soon' ? '3px solid #D97706' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'ending_soon' ? '#B45309' : '#64748B',
              fontSize: '13px',
              fontWeight: activeTab === 'ending_soon' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Clock size={15} />
            <span>2. Package Ending Soon Msg</span>
            {endingSoonClients.length > 0 && (
              <span
                style={{
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                {endingSoonClients.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('validity')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'validity' ? '3px solid #059669' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'validity' ? '#065F46' : '#64748B',
              fontSize: '13px',
              fontWeight: activeTab === 'validity' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Calendar size={15} />
            <span>3. Auto Start Date & Validity</span>
            <span
              style={{
                backgroundColor: '#059669',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '10px',
                fontWeight: 800,
              }}
            >
              {soldClients.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px' }}>
          {/* ========================================================================= */}
          {/* TAB 1: DAILY LEAD REMINDERS CONNECTED WITH LONG TERM LEADS                */}
          {/* ========================================================================= */}
          {activeTab === 'leads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Dispatch Mode Switcher Bar */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders size={16} color="#064E3B" />
                    <span>Auto Message Switch & Dispatch Mode:</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Choose automated daily schedule, manual custom dispatch, or auto-scripted sequence
                  </div>
                </div>

                {/* Switch Controls */}
                <div style={{ display: 'flex', backgroundColor: '#E2E8F0', padding: '3px', borderRadius: '10px', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('auto')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: dispatchMode === 'auto' ? '#064E3B' : 'transparent',
                      color: dispatchMode === 'auto' ? '#FFFFFF' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Auto Switch (Daily)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('scripted')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: dispatchMode === 'scripted' ? '#064E3B' : 'transparent',
                      color: dispatchMode === 'scripted' ? '#FFFFFF' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Auto Scripted
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('manual')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: dispatchMode === 'manual' ? '#064E3B' : 'transparent',
                      color: dispatchMode === 'manual' ? '#FFFFFF' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* If Auto Scripted is selected, show script day selector */}
              {dispatchMode === 'scripted' && (
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1.5px solid #A7F3D0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#065F46' }}>
                      Auto-Script Sequence Day:
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {SCRIPTED_DAILY_TEMPLATES.map((tmpl) => (
                        <button
                          key={tmpl.day}
                          type="button"
                          onClick={() => setSelectedScriptDay(tmpl.day)}
                          style={{
                            padding: '4px 9px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: selectedScriptDay === tmpl.day ? '#064E3B' : '#DEF7EC',
                            color: selectedScriptDay === tmpl.day ? '#FFFFFF' : '#047857',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          Day {tmpl.day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#064E3B', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                    <strong>{activeScript.title}:</strong> {activeScript.message}
                  </div>
                </div>
              )}

              {/* If Manual is selected, show textarea */}
              {dispatchMode === 'manual' && (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                  }}
                >
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Custom Manual Script (Variables: {'{name}'}, {'{goal}'}, {'{package}'}):
                  </label>
                  <textarea
                    rows={2}
                    value={customManualMessage}
                    onChange={(e) => setCustomManualMessage(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              )}

              {/* Connected Leads List Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#064E3B' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Lead Name & Age</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Goal & Decided Package</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Email ID & Phone</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Preview Formatted Message</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800 }}>Daily Send</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const formattedMsg = formatLeadMessage(lead);

                      return (
                        <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{lead.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Age: {lead.age} yrs</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700, color: '#064E3B' }}>{lead.goal}</div>
                            <div style={{ fontSize: '10.5px', color: '#64748B' }}>{lead.decidedPackageOption}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: '11px', color: '#1E293B', fontWeight: 600 }}>{lead.email}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{lead.contactNo}</div>
                          </td>
                          <td style={{ padding: '10px 12px', maxWidth: '280px' }}>
                            <div style={{ fontSize: '11px', color: '#334155', backgroundColor: '#F8FAFC', padding: '6px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                              {formattedMsg}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => handleSendLeadReminder(lead, 'whatsapp')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '5px',
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                }}
                                title="Send WhatsApp"
                              >
                                WP
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendLeadReminder(lead, 'email')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '5px',
                                  backgroundColor: '#EEF2FF',
                                  color: '#4338CA',
                                  border: '1px solid #C7D2FE',
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                                title="Send Email"
                              >
                                Email
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendLeadReminder(lead, 'sms')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '5px',
                                  backgroundColor: '#EFF6FF',
                                  color: '#1E40AF',
                                  border: '1px solid #BFDBFE',
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                                title="Send SMS"
                              >
                                SMS
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PACKAGE ENDING SOON MSG LEAD REMINDER BOX                          */}
          {/* ========================================================================= */}
          {activeTab === 'ending_soon' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: '#FEF3C7',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Clock size={24} color="#B45309" />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#92400E' }}>
                    Package Ending Soon Follow-Up Dispatch
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#B45309' }}>
                    Clients within 14 days of package completion. Send pre-configured renewal offers to maintain momentum.
                  </div>
                </div>
              </div>

              {endingSoonClients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#064E3B' }}>All Packages Healthy</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    No client subscriptions are currently within 14 days of expiry.
                  </div>
                </div>
              ) : (
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FFFBEB', borderBottom: '2px solid #FDE68A', color: '#92400E' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Client</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Package & End Date</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Validity Countdown</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Contact No</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800 }}>Renewal Dispatch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endingSoonClients.map((client) => (
                        <tr key={client.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{client.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{client.email}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700, color: '#B45309' }}>{client.packageTaken}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Expires: {client.endDate}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 8px',
                                borderRadius: '8px',
                                backgroundColor: '#FEF3C7',
                                color: '#92400E',
                                fontWeight: 800,
                                fontSize: '11px',
                              }}
                            >
                              <AlertTriangle size={11} color="#D97706" />
                              <span>{client.daysRemaining <= 0 ? 'Expired' : `${client.daysRemaining} Days Left`}</span>
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700 }}>{client.contactNo}</div>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => handleSendEndingSoonReminder(client, 'whatsapp')}
                                style={{
                                  padding: '4px 9px',
                                  borderRadius: '5px',
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                }}
                              >
                                WP Offer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendEndingSoonReminder(client, 'email')}
                                style={{
                                  padding: '4px 9px',
                                  borderRadius: '5px',
                                  backgroundColor: '#EEF2FF',
                                  color: '#4338CA',
                                  border: '1px solid #C7D2FE',
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Email
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: AUTO START DATE & VALIDITY BOX                                     */}
          {/* ========================================================================= */}
          {activeTab === 'validity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Calendar size={24} color="#059669" />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#065F46' }}>
                    Auto Start Date & Validity Tracker
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#047857' }}>
                    Automatically monitors start and end dates. Reaches clients with welcome protocol and milestone confirmations.
                  </div>
                </div>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F0FDF4', borderBottom: '2px solid #BBF7D0', color: '#064E3B' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Enrolled Client</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Start Date</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>End Date</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800 }}>Validity Status</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800 }}>Validity Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soldClients.map((client) => (
                      <tr key={client.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{client.name}</div>
                          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{client.packageTaken}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, color: '#064E3B' }}>{client.startDate}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, color: '#B45309' }}>{client.endDate}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '8px',
                              backgroundColor: client.status === 'Ending Soon' ? '#FEF3C7' : '#DCFCE7',
                              color: client.status === 'Ending Soon' ? '#92400E' : '#166534',
                              fontWeight: 800,
                              fontSize: '11px',
                            }}
                          >
                            {client.status} ({client.daysRemaining}d)
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleSendValidityMilestoneAlert(client)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#064E3B',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Send size={11} />
                            <span>Send Validity Alert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#064E3B',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close Reminder Hub
          </button>
        </div>
      </div>
    </div>
  );
};
