import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Download, 
  Calendar, 
  Users, 
  UserPlus, 
  Bell, 
  UserCheck, 
  CheckCircle2,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { 
  getLeadRegistrations, 
  addLeadRegistration, 
  removeLeadRegistration 
} from '../../services/dataBookService';
import type { LeadRegistrationRecord } from '../../types/longTermSupport';

interface LeadRegistrationDataBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLeadForPlan?: (lead: LeadRegistrationRecord) => void;
}

export const LeadRegistrationDataBookModal: React.FC<LeadRegistrationDataBookModalProps> = ({
  isOpen,
  onClose,
  onSelectLeadForPlan,
}) => {
  const [leads, setLeads] = useState<LeadRegistrationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [interestFilter, setInterestFilter] = useState('All Interest');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const dateRangeFilter = 'Aug 1 – Aug 25, 2025';

  // Add Lead Modal Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('Airport');
  const [newInterest, setNewInterest] = useState('Muscle Gain');
  const [newStatus, setNewStatus] = useState<'New Lead' | 'Follow-up Pending' | 'Contacted' | 'Interested' | 'Not Interested'>('New Lead');
  const [newNotes, setNewNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      getLeadRegistrations().then(setLeads);
    }
  }, [isOpen]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.phone || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q);

      const matchesInterest = interestFilter === 'All Interest' || lead.interest === interestFilter;
      const matchesStatus = statusFilter === 'All Status' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'All Sources' || lead.source === sourceFilter;

      return matchesSearch && matchesInterest && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, interestFilter, statusFilter, sourceFilter]);

  // Dynamic real counts from actual user leads
  const totalCount = leads.length;
  const newThisMonthCount = leads.filter(l => l.status === 'New Lead').length;
  const followUpPendingCount = leads.filter(l => l.status === 'Follow-up Pending').length;
  const convertedClientsCount = leads.filter(l => l.status === 'Interested' || l.status === 'Contacted').length;

  const handleAddNewLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newLead: LeadRegistrationRecord = {
      id: `lead_${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      source: newSource,
      interest: newInterest,
      registrationDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      followUpReminder: 'Scheduled in Portal',
      status: newStatus,
      actionPlan: {
        counsellingPackage: false,
        longTermPackage: true,
        state: 'On Process',
      },
      notes: newNotes.trim() || 'Direct registration in Lead Data Book',
    };

    const updated = await addLeadRegistration(newLead);
    setLeads(updated);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
    setToastMessage('✅ New Real Lead Registered Successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRemoveLead = async (leadId: string, leadName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${leadName}" from the leads book?`)) {
      return;
    }
    const updated = await removeLeadRegistration(leadId);
    setLeads(updated);
    setToastMessage(`🗑️ Removed "${leadName}" from Leads Register`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Source', 'Interest', 'Registration Date', 'Follow-up', 'Status', 'Notes'];
    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.source}"`,
      `"${l.interest}"`,
      `"${l.registrationDate}"`,
      `"${l.followUpReminder}"`,
      `"${l.status}"`,
      `"${l.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `real_leads_databook_${Date.now()}.csv`);
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
        backgroundColor: 'rgba(10, 28, 68, 0.85)',
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
          maxWidth: '1240px',
          maxHeight: '94vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: '1.5px solid #0A1C44',
        }}
      >
        {/* Top Header */}
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
              <FileSpreadsheet size={22} color="#0A1C44" />
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', margin: 0 }}>
                Registration
              </h1>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                Real User Data Only
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0' }}>
              This is for my personal record data.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                padding: '8px 14px',
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
              <Download size={15} />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#0A3B22',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(10, 59, 34, 0.25)',
              }}
            >
              <Plus size={15} />
              <span>+ Add New Lead</span>
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

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {toastMessage && (
            <div style={{ padding: '12px 16px', backgroundColor: '#DEF7EC', border: '1px solid #31C48D', borderRadius: '8px', color: '#03543F', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* 4 Dynamic Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {/* Card 1: Total Leads */}
            <div style={{ padding: '16px 18px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Total Leads</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#111827' }}>{totalCount}</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Verified Real Records</div>
              </div>
            </div>

            {/* Card 2: New This Month */}
            <div style={{ padding: '16px 18px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>New This Month</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#111827' }}>{newThisMonthCount}</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>New Registrations</div>
              </div>
            </div>

            {/* Card 3: Follow-up Pending */}
            <div style={{ padding: '16px 18px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Follow-up Pending</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#111827' }}>{followUpPendingCount}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Need Follow-up</div>
              </div>
            </div>

            {/* Card 4: Converted to Clients */}
            <div style={{ padding: '16px 18px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Converted to Clients</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#111827' }}>{convertedClientsCount}</div>
                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>Interested & Contacted</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
              <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real users by name, phone or email..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '12.5px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px', backgroundColor: '#FFFFFF', color: '#374151', fontWeight: 600 }}>
                <Calendar size={13} />
                <span>{dateRangeFilter}</span>
              </div>

              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px', fontWeight: 600, color: '#374151', backgroundColor: '#FFFFFF' }}
              >
                <option value="All Interest">All Interest</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Fat Loss">Fat Loss</option>
                <option value="Clinical Nutrition & Health">Clinical Nutrition</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px', fontWeight: 600, color: '#374151', backgroundColor: '#FFFFFF' }}
              >
                <option value="All Status">All Status</option>
                <option value="New Lead">New Lead</option>
                <option value="Follow-up Pending">Follow-up Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px', fontWeight: 600, color: '#374151', backgroundColor: '#FFFFFF' }}
              >
                <option value="All Sources">All Sources</option>
                <option value="She Nourishes App Registration">App Registration</option>
                <option value="Airport">Airport</option>
                <option value="Friend Referral">Friend Referral</option>
                <option value="Gym">Gym</option>
                <option value="Mall">Mall</option>
                <option value="Instagram DM">Instagram DM</option>
                <option value="Event">Event</option>
              </select>
            </div>
          </div>

          {/* Clean Real Leads Table (Selections Removed, Add & Remove Enabled) */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 14px' }}>#</th>
                  <th style={{ padding: '12px 14px' }}>Name</th>
                  <th style={{ padding: '12px 14px' }}>Phone Number</th>
                  <th style={{ padding: '12px 14px' }}>Email ID</th>
                  <th style={{ padding: '12px 14px' }}>Where Met / Source</th>
                  <th style={{ padding: '12px 14px' }}>Interest</th>
                  <th style={{ padding: '12px 14px' }}>Registration Date</th>
                  <th style={{ padding: '12px 14px' }}>Follow-up</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', minWidth: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: '#1F2937' }}>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '48px 20px', textAlign: 'center', color: '#6B7280' }}>
                      <Users size={38} color="#9CA3AF" style={{ margin: '0 auto 10px', display: 'block' }} />
                      <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#374151' }}>No Real Leads Recorded Yet</div>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 16px' }}>
                        All registered app clients will appear here automatically. You can also add real leads manually.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '8px',
                          backgroundColor: '#0A3B22',
                          color: '#FFFFFF',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Plus size={14} />
                        <span>+ Add Real Lead</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => {
                    return (
                      <tr key={lead.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 14px', color: '#6B7280', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#111827' }}>{lead.name}</td>
                        <td style={{ padding: '12px 14px', color: '#4B5563' }}>{lead.phone}</td>
                        <td style={{ padding: '12px 14px', color: '#4B5563' }}>{lead.email}</td>
                        <td style={{ padding: '12px 14px', color: '#4B5563' }}>{lead.source}</td>
                        
                        {/* Interest Badge */}
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              backgroundColor: lead.interest.includes('Muscle') ? '#DEF7EC' : lead.interest.includes('Weight') ? '#E1EFFE' : '#FEF08A',
                              color: lead.interest.includes('Muscle') ? '#03543F' : lead.interest.includes('Weight') ? '#1E429F' : '#854D0E',
                            }}
                          >
                            {lead.interest}
                          </span>
                        </td>

                        <td style={{ padding: '12px 14px', color: '#4B5563' }}>{lead.registrationDate}</td>

                        {/* Follow-up Reminder */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#374151', fontSize: '11.5px', fontWeight: 600 }}>
                            <Bell size={13} color="#9CA3AF" />
                            <span>{lead.followUpReminder}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              backgroundColor: 
                                lead.status === 'New Lead' ? '#E1EFFE' :
                                lead.status === 'Follow-up Pending' ? '#FEE2E2' :
                                lead.status === 'Contacted' ? '#EDE9FE' :
                                lead.status === 'Interested' ? '#DEF7EC' : '#F3F4F6',
                              color: 
                                lead.status === 'New Lead' ? '#1E429F' :
                                lead.status === 'Follow-up Pending' ? '#991B1B' :
                                lead.status === 'Contacted' ? '#5B21B6' :
                                lead.status === 'Interested' ? '#03543F' : '#4B5563',
                            }}
                          >
                            {lead.status}
                          </span>
                        </td>

                        {/* Action Column with Assign Plan + Remove Button */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {onSelectLeadForPlan && (
                              <button
                                type="button"
                                onClick={() => onSelectLeadForPlan(lead)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#0A1C44',
                                  color: '#E8CA56',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                Assign Plan
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveLead(lead.id, lead.name)}
                              title="Remove Lead"
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#FEE2E2',
                                color: '#DC2626',
                                fontSize: '11px',
                                fontWeight: 700,
                                border: '1px solid #FCA5A5',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination / Count Bar */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7280' }}>
              <span>Showing {filteredLeads.length} of {totalCount} verified leads</span>
            </div>
          </div>

          {/* Bottom Reference Cards (Action Plan Guide & Calculations Removed as requested) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>

            {/* 1. COUNSELLING PACKAGE OPTIONS */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                COUNSELLING PACKAGE OPTIONS (Short-term)
              </span>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#374151' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package 1</span>
                  <strong>₹ 1,699</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package 2</span>
                  <strong>₹ 2,100</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package 3</span>
                  <strong>₹ 3,100</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package 4</span>
                  <strong>₹ 4,999</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package 5</span>
                  <strong>₹ 6,199</strong>
                </div>
              </div>
            </div>

            {/* 2. LONG-TERM PACKAGE OPTIONS */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                LONG-TERM PACKAGE OPTIONS (Nutrition Plans)
              </span>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#374151' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>1 Month Package</span>
                  <strong>₹ 25,000</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>2 Months Package</span>
                  <strong>₹ 35,599</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>3 Months Package</span>
                  <strong>₹ 51,199</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>6 Months Package</span>
                  <strong>₹ 91,999</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>9 Months Package</span>
                  <strong>₹ 1,31,999</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>1 Year Package</span>
                  <strong>₹ 1,71,999</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Add New Real Lead Modal Sub-dialog */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
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
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>
                Add New Real Lead
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewLead} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter real client name"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Where Met / Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  >
                    <option value="She Nourishes App Registration">App Registration</option>
                    <option value="Airport">Airport</option>
                    <option value="Friend Referral">Friend Referral</option>
                    <option value="Gym">Gym</option>
                    <option value="Mall">Mall</option>
                    <option value="Instagram DM">Instagram DM</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@email.com"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Primary Interest</label>
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  >
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Clinical Nutrition & Health">Clinical Nutrition</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Follow-up Pending">Follow-up Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Clinical / Intake Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Inquired about 3-month body recomposition program"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#0A3B22', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Real Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
