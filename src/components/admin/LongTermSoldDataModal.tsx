import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Download, 
  Award, 
  Clock, 
  Phone, 
  Mail, 
  MessageCircle, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  Send,
  CreditCard,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { 
  getLongTermSoldClients, 
  addOrUpdateLongTermSoldClient, 
  deleteLongTermSoldClient, 
  dispatchClientCommunication,
  type LongTermSoldClient, 
  type PackageDurationOption,
  PACKAGE_PRICING_MAP
} from '../../services/longTermDataBookService';

interface LongTermSoldDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LongTermSoldDataModal: React.FC<LongTermSoldDataModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [soldClients, setSoldClients] = useState<LongTermSoldClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [durationFilter, setDurationFilter] = useState<string>('All Durations');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  // Add Sold Client modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');
  const [formAge, setFormAge] = useState<number>(30);
  const [formStartDate, setFormStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formPackage, setFormPackage] = useState<PackageDurationOption>('3 Months');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('Clinic In-Person');
  const [formGoal, setFormGoal] = useState<string>('Muscle Gain & Body Recomposition');
  const [toastMessage, setToastMessage] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getLongTermSoldClients();
      setSoldClients(data);
    } catch (e) {
      console.error('Error loading sold clients:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const filteredClients = useMemo(() => {
    return soldClients.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(q) ||
        c.contactNo.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.goal || '').toLowerCase().includes(q);

      const matchDuration =
        durationFilter === 'All Durations' || c.packageTaken === durationFilter;

      const matchStatus =
        statusFilter === 'All Status' || c.status === statusFilter;

      return matchSearch && matchDuration && matchStatus;
    });
  }, [soldClients, searchQuery, durationFilter, statusFilter]);

  // Aggregate Metrics: Total Per-Month Data Calculation
  const totalActiveClients = soldClients.filter(c => c.status !== 'Completed').length;
  const totalMonthlyRunRate = soldClients
    .filter(c => c.status !== 'Completed')
    .reduce((sum, c) => sum + (c.perMonthFee || 0), 0);
  const totalProgramValue = soldClients.reduce((sum, c) => sum + (c.totalPackageFee || 0), 0);
  const endingSoonCount = soldClients.filter(c => c.status === 'Ending Soon').length;

  const handleCreateSoldClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter client full name');
      return;
    }

    const pricing = PACKAGE_PRICING_MAP[formPackage];
    const months = pricing.months;
    const totalFee = pricing.totalFee;
    const perMonthFee = Math.round(totalFee / months);

    // Calculate End Date
    const startObj = new Date(formStartDate);
    const endObj = new Date(startObj);
    endObj.setMonth(startObj.getMonth() + months);
    const endDateStr = endObj.toISOString().split('T')[0];

    const diffDays = Math.ceil((endObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const status: LongTermSoldClient['status'] = diffDays < 0 ? 'Completed' : diffDays <= 14 ? 'Ending Soon' : 'Active';

    const newClient: LongTermSoldClient = {
      id: `lt_sold_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formName.trim(),
      age: formAge,
      startDate: formStartDate,
      endDate: endDateStr,
      packageTaken: formPackage,
      packageDurationMonths: months,
      totalPackageFee: totalFee,
      perMonthFee: perMonthFee,
      contactNo: formPhone.trim() || '+91 98765 43210',
      email: formEmail.trim() || 'client@example.com',
      locationOfMeeting: formLocation.trim(),
      goal: formGoal.trim(),
      status: status,
      daysRemaining: diffDays,
      validityAlertSent: true,
    };

    const updated = await addOrUpdateLongTermSoldClient(newClient);
    setSoldClients(updated);
    setShowAddModal(false);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setToastMessage(`🎉 Sold Client "${newClient.name}" saved with ${newClient.packageTaken} (₹${perMonthFee.toLocaleString('en-IN')}/mo)!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove sold record for: ${name}?`)) return;
    const updated = await deleteLongTermSoldClient(id);
    setSoldClients(updated);
    setToastMessage(`🗑️ Removed sold client "${name}"`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dispatch Multi-Channel Communication
  const handleSendMessage = async (client: LongTermSoldClient, channel: 'whatsapp' | 'sms' | 'email') => {
    const isEnding = client.daysRemaining <= 14;
    const subject = isEnding
      ? 'Long-Term Health Transformation: Upcoming Validity & Renewal Review'
      : 'Long-Term Support Program: Active Milestone & Clinical Progress';

    const message = isEnding
      ? `Hi ${client.name}, your ${client.packageTaken} transformation program with Sneha Dey reaches its completion on ${client.endDate} (${client.daysRemaining} days remaining). Let's schedule your milestone biometric assessment and review your renewal options to lock in your long-term results!`
      : `Hi ${client.name}, this is Sneha Dey checking in on your active ${client.packageTaken} health journey. Your validity is active until ${client.endDate}. How are your energy, adherence, and nutrition feeling this week?`;

    await dispatchClientCommunication({
      clientName: client.name,
      phone: client.contactNo,
      email: client.email,
      channel,
      subject,
      message,
    });

    setToastMessage(`Dispatched follow-up to ${client.name} via ${channel.toUpperCase()}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Auto Start Date & Validity alert trigger
  const handleSendValidityAlert = async (client: LongTermSoldClient) => {
    const isStart = Math.abs(Date.now() - new Date(client.startDate).getTime()) < 5 * 86400000;
    const message = isStart
      ? `Hi ${client.name}, welcome to your She Nourishes ${client.packageTaken} Transformation Protocol starting ${client.startDate}! Your clinical diagnostics vouchers and personalized exercise charts are prepared. Let's begin your transformative journey!`
      : `Hi ${client.name}, your ${client.packageTaken} program validity reminder: Active from ${client.startDate} to ${client.endDate} (${client.daysRemaining} days remaining). Reply here for any recipe or meal adjustments.`;

    await dispatchClientCommunication({
      clientName: client.name,
      phone: client.contactNo,
      email: client.email,
      channel: 'whatsapp',
      subject: 'Program Start & Validity Confirmation',
      message,
    });

    // Mark validity alert sent
    const updated = await addOrUpdateLongTermSoldClient({ ...client, validityAlertSent: true });
    setSoldClients(updated);
    setToastMessage(`✅ Sent validity message to ${client.name}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Start Date', 'End Date', 'Package Taken', 'Months', 'Total Fee (INR)', 'Per Month Fee (INR)', 'Days Remaining', 'Status', 'Contact No', 'Email'];
    const rows = filteredClients.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.startDate}"`,
      `"${c.endDate}"`,
      `"${c.packageTaken}"`,
      c.packageDurationMonths,
      c.totalPackageFee,
      c.perMonthFee,
      c.daysRemaining,
      `"${c.status}"`,
      `"${c.contactNo}"`,
      `"${c.email}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Long_Term_Sold_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          maxWidth: '1140px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(6, 78, 59, 0.35)',
        }}
      >
        {/* Modal Header */}
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
              <FileCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                  Long-Term Sold Data Box
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
                  Live Enrolled Packages
                </span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '2px 0 0 0' }}>
                Start & End Dates • Auto Validity Tracker • Multi-Channel (SMS, WP, Email) • Total Per-Month Data Calculation
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
              title="Reload from Firebase"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              padding: '8px 18px',
              backgroundColor: '#ECFDF5',
              borderBottom: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOTAL PER-MONTH DATA CALCULATION & FINANCIAL RUN-RATE SUMMARY CARDS      */}
        {/* ========================================================================= */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#F0FDF4',
            borderBottom: '1.5px solid #BBF7D0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Metric 1: Monthly Run-rate */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #A7F3D0',
              borderRadius: '12px',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(6, 78, 59, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                Total Per-Month Calculation
              </span>
              <TrendingUp size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#064E3B', marginTop: '4px' }}>
              ₹{totalMonthlyRunRate.toLocaleString('en-IN')}
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}> / month</span>
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
              Aggregate active monthly client commitment
            </div>
          </div>

          {/* Metric 2: Active Packages */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #A7F3D0',
              borderRadius: '12px',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(6, 78, 59, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                Active Enrolled Clients
              </span>
              <Award size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#064E3B', marginTop: '4px' }}>
              {totalActiveClients}
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}> Active Protocols</span>
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
              1, 2, 3, 6, 9 & 12 Month Subscriptions
            </div>
          </div>

          {/* Metric 3: Total Program Value */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #A7F3D0',
              borderRadius: '12px',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(6, 78, 59, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                Total Booked Value
              </span>
              <CreditCard size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#064E3B', marginTop: '4px' }}>
              ₹{totalProgramValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
              Cumulative gross enrolled package revenue
            </div>
          </div>

          {/* Metric 4: Ending Soon Alerts */}
          <div
            style={{
              backgroundColor: endingSoonCount > 0 ? '#FEF3C7' : '#FFFFFF',
              border: endingSoonCount > 0 ? '1.5px solid #F59E0B' : '1.5px solid #A7F3D0',
              borderRadius: '12px',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: endingSoonCount > 0 ? '#B45309' : '#047857', textTransform: 'uppercase' }}>
                Validity Alerts
              </span>
              <Clock size={16} color={endingSoonCount > 0 ? '#D97706' : '#059669'} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: endingSoonCount > 0 ? '#92400E' : '#064E3B', marginTop: '4px' }}>
              {endingSoonCount}
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}> Expirying Soon</span>
            </div>
            <div style={{ fontSize: '10px', color: endingSoonCount > 0 ? '#92400E' : '#6B7280', marginTop: '2px' }}>
              Requires renewal message dispatch
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Add Sold Client, Export */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '300px' }}>
              <Search
                size={14}
                color="#64748B"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search sold client name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Duration Filter */}
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="All Durations">All Durations</option>
              <option value="1 Month">1 Month</option>
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="9 Months">9 Months</option>
              <option value="12 Months">12 Months</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Ending Soon">Ending Soon (≤14d)</option>
              <option value="Completed">Completed / Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
              }}
            >
              <Plus size={14} />
              <span>Add Sold Client</span>
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>
              Loading Long-Term Sold records...
            </div>
          ) : filteredClients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              <FileCheck size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>No Sold Clients Found</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                Add new sold transformation contracts using the button above.
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#064E3B', backgroundColor: '#F0FDF4' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Client Name & Package</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Start & End Date (Validity Box)</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Per-Month Data Calculation</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Contact No (SMS, WP, Email)</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center' }}>Validity Action</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const isEndingSoon = client.status === 'Ending Soon';
                    const isCompleted = client.status === 'Completed';

                    return (
                      <tr
                        key={client.id}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          backgroundColor: isEndingSoon ? '#FFFBEB' : 'transparent',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        {/* Name & Package */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>
                            {client.name}
                          </div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '3px', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '11px', fontWeight: 800 }}>
                            <Award size={11} color="#059669" />
                            <span>{client.packageTaken} ({client.packageDurationMonths} Mo)</span>
                          </div>
                        </td>

                        {/* Start & End Date Box with Validity Status */}
                        <td style={{ padding: '12px' }}>
                          <div
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: isEndingSoon ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                            }}
                          >
                            <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontWeight: 700, color: '#064E3B' }}>Start:</span> {client.startDate}
                            </div>
                            <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontWeight: 700, color: '#B45309' }}>End:</span> {client.endDate}
                            </div>
                            <div style={{ marginTop: '2px' }}>
                              {isCompleted ? (
                                <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                                  Completed / Expired
                                </span>
                              ) : isEndingSoon ? (
                                <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <AlertTriangle size={10} />
                                  <span>{client.daysRemaining} Days Left</span>
                                </span>
                              ) : (
                                <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                                  Active ({client.daysRemaining}d left)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Per-Month Data Calculation */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 900, color: '#064E3B', fontSize: '13.5px' }}>
                            ₹{client.perMonthFee.toLocaleString('en-IN')}
                            <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}> / month</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            Total: <strong style={{ color: '#0F172A' }}>₹{client.totalPackageFee.toLocaleString('en-IN')}</strong> ({client.packageDurationMonths} mos)
                          </div>
                        </td>

                        {/* Contact No with SMS, WP, Email */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                            {client.contactNo}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {/* WhatsApp button */}
                            <button
                              type="button"
                              onClick={() => handleSendMessage(client, 'whatsapp')}
                              style={{
                                padding: '3px 7px',
                                borderRadius: '4px',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                              title="Send WhatsApp Follow-up"
                            >
                              <MessageCircle size={10} />
                              <span>WP</span>
                            </button>

                            {/* SMS button */}
                            <button
                              type="button"
                              onClick={() => handleSendMessage(client, 'sms')}
                              style={{
                                padding: '3px 7px',
                                borderRadius: '4px',
                                backgroundColor: '#EFF6FF',
                                color: '#1E40AF',
                                border: '1px solid #BFDBFE',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                              title="Send SMS"
                            >
                              <Phone size={10} />
                              <span>SMS</span>
                            </button>

                            {/* Email button */}
                            <button
                              type="button"
                              onClick={() => handleSendMessage(client, 'email')}
                              style={{
                                padding: '3px 7px',
                                borderRadius: '4px',
                                backgroundColor: '#EEF2FF',
                                color: '#4338CA',
                                border: '1px solid #C7D2FE',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                              title="Send Resend Email"
                            >
                              <Mail size={10} />
                              <span>Email</span>
                            </button>
                          </div>
                        </td>

                        {/* Validity Action: Auto Start Date & Validity Message Reaches */}
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleSendValidityAlert(client)}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              backgroundColor: isEndingSoon ? '#FEF3C7' : '#ECFDF5',
                              border: isEndingSoon ? '1px solid #F59E0B' : '1px solid #A7F3D0',
                              color: isEndingSoon ? '#92400E' : '#065F46',
                              fontSize: '10.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Dispatch Automated Validity Notice"
                          >
                            <Send size={11} />
                            <span>{isEndingSoon ? 'Renewal Notice' : 'Validity Alert'}</span>
                          </button>
                        </td>

                        {/* Remove Action */}
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteClient(client.id, client.name)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Delete Sold Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
            Active Sold Records: <strong style={{ color: '#064E3B' }}>{filteredClients.length}</strong> | Total Per-Month Run-Rate: <strong style={{ color: '#064E3B' }}>₹{totalMonthlyRunRate.toLocaleString('en-IN')}/mo</strong>
          </div>
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
            Close Data Box
          </button>
        </div>
      </div>

      {/* SUB-MODAL: Add New Sold Client */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 10001,
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
              maxWidth: '540px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div
              style={{
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 900, margin: 0 }}>
                Enroll New Long-Term Sold Client
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSoldClient} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Roy"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="90"
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Program Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Package Duration (1–12 Mo)
                  </label>
                  <select
                    value={formPackage}
                    onChange={(e) => setFormPackage(e.target.value as PackageDurationOption)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                  >
                    <option value="1 Month">1 Month (₹25,000 Total • ₹25,000/mo)</option>
                    <option value="2 Months">2 Months (₹35,599 Total • ₹17,800/mo)</option>
                    <option value="3 Months">3 Months (₹51,199 Total • ₹17,066/mo)</option>
                    <option value="6 Months">6 Months (₹91,999 Total • ₹15,333/mo)</option>
                    <option value="9 Months">9 Months (₹1,32,000 Total • ₹14,666/mo)</option>
                    <option value="12 Months">12 Months (₹1,65,000 Total • ₹13,750/mo)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Contact No (Mobile) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Consultation Location & Meeting Mode
                </label>
                <input
                  type="text"
                  placeholder="e.g. In-Person Nutrition Clinic / Coffee Shop"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Target Health Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muscle Recomposition, Gut & Thyroid Balance"
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '7px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#064E3B',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save Enrolled Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
