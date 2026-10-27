import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Download, 
  Calendar, 
  Users, 
  MapPin, 
  Target, 
  Phone, 
  Mail, 
  MessageCircle, 
  Trash2, 
  RefreshCw,
  PackageCheck
} from 'lucide-react';
import { 
  getLongTermLeads, 
  addOrUpdateLongTermLead, 
  deleteLongTermLead, 
  type LongTermSupportLead, 
  type PackageDurationOption,
  PACKAGE_PRICING_MAP
} from '../../services/longTermDataBookService';

interface LongTermLeadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LongTermLeadDataModal: React.FC<LongTermLeadDataModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [leads, setLeads] = useState<LongTermSupportLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [packageFilter, setPackageFilter] = useState<string>('All Packages');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  // Add Lead Modal state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');
  const [formAge, setFormAge] = useState<number>(28);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formPackage, setFormPackage] = useState<PackageDurationOption>('3 Months');
  const [formLocation, setFormLocation] = useState<string>('Blue Tokai Cafe / In-Person');
  const [formGoal, setFormGoal] = useState<string>('Muscle Gain & Fat Loss');
  const [formContactNo, setFormContactNo] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getLongTermLeads();
      setLeads(data);
    } catch (e) {
      console.error('Error loading long term leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        l.name.toLowerCase().includes(q) ||
        l.contactNo.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.goal.toLowerCase().includes(q) ||
        l.locationOfMeeting.toLowerCase().includes(q);

      const matchPackage =
        packageFilter === 'All Packages' || l.decidedPackageOption === packageFilter;

      const matchStatus =
        statusFilter === 'All Status' || l.status === statusFilter;

      return matchSearch && matchPackage && matchStatus;
    });
  }, [leads, searchQuery, packageFilter, statusFilter]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter client full name');
      return;
    }
    const newLead: LongTermSupportLead = {
      id: `lt_lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formName.trim(),
      age: Number(formAge) || 28,
      date: formDate,
      decidedPackageOption: formPackage,
      locationOfMeeting: formLocation.trim() || 'Clinic / Coffee Shop In-Person',
      goal: formGoal.trim() || 'Muscle Gain & Metabolic Health',
      contactNo: formContactNo.trim() || '+91 98765 43210',
      email: formEmail.trim() || 'client@example.com',
      status: 'New Lead',
      dailyReminderActive: true,
      reminderDispatchMode: 'auto',
      createdAt: Date.now(),
    };

    const updated = await addOrUpdateLongTermLead(newLead);
    setLeads(updated);
    setShowAddForm(false);
    setFormName('');
    setFormContactNo('');
    setFormEmail('');
    setToastMessage(`✅ Lead "${newLead.name}" added successfully!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove lead: ${name}?`)) return;
    const updated = await deleteLongTermLead(id);
    setLeads(updated);
    setToastMessage(`🗑️ Removed lead "${name}"`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Date', 'Decided Package', 'Location of Meeting', 'Goal', 'Contact No', 'Email', 'Status'];
    const rows = filteredLeads.map(l => [
      `"${l.id}"`,
      `"${l.name}"`,
      l.age,
      `"${l.date}"`,
      `"${l.decidedPackageOption}"`,
      `"${l.locationOfMeeting}"`,
      `"${l.goal}"`,
      `"${l.contactNo}"`,
      `"${l.email}"`,
      `"${l.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Long_Term_Leads_${new Date().toISOString().split('T')[0]}.csv`);
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
          maxWidth: '1080px',
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
              <Users size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                  Long-Term Support Lead Data Box
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
                  Live Realtime Sync
                </span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '2px 0 0 0' }}>
                Basic Details • Name, Age & Date • Decided Package (1–12 Mo) • Location of Meeting • Goal • Contact No
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

        {/* Action / Notification Toast */}
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

        {/* Toolbar: Search, Filters, Add Button, Export */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Left: Search & Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '320px' }}>
              <Search
                size={14}
                color="#64748B"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by name, contact, goal..."
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

            {/* Package Filter */}
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
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
              <option value="All Packages">All Packages</option>
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
              <option value="New Lead">New Lead</option>
              <option value="Follow-up Pending">Follow-up Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Converted to Sold">Converted to Sold</option>
            </select>
          </div>

          {/* Right: Actions */}
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
              onClick={() => setShowAddForm(true)}
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
              <span>Add Long-Term Lead</span>
            </button>
          </div>
        </div>

        {/* Content Area: Table List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>
              Loading Long-Term Leads from Firebase Realtime Database...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              <Users size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>No Long-Term Leads Found</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                Click "+ Add Long-Term Lead" to register a new client.
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#064E3B', backgroundColor: '#F0FDF4' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Client Name & Age</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Date</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Decided Package Option</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Location of Meeting</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Client Goal</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Contact No & Actions</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const cleanPhone = lead.contactNo.replace(/\D/g, '');
                    return (
                      <tr
                        key={lead.id}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        {/* Name & Age */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>
                            {lead.name}
                          </div>
                          <div style={{ color: '#64748B', fontSize: '11px' }}>
                            Age: <span style={{ fontWeight: 700, color: '#064E3B' }}>{lead.age} yrs</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
                            <Calendar size={13} color="#059669" />
                            <span>{lead.date}</span>
                          </div>
                        </td>

                        {/* Decided Package Option */}
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              backgroundColor: '#ECFDF5',
                              border: '1px solid #A7F3D0',
                              color: '#065F46',
                              fontSize: '11.5px',
                              fontWeight: 800,
                            }}
                          >
                            <PackageCheck size={12} color="#059669" />
                            <span>{lead.decidedPackageOption}</span>
                          </span>
                          <div style={{ fontSize: '10px', color: '#059669', marginTop: '2px', fontWeight: 700 }}>
                            ₹{PACKAGE_PRICING_MAP[lead.decidedPackageOption]?.totalFee.toLocaleString('en-IN') || '51,199'} Total
                          </div>
                        </td>

                        {/* Location of Meeting */}
                        <td style={{ padding: '12px', maxWidth: '170px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155' }}>
                            <MapPin size={13} color="#D97706" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '11.5px' }}>{lead.locationOfMeeting}</span>
                          </div>
                        </td>

                        {/* Goal */}
                        <td style={{ padding: '12px', maxWidth: '180px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1E293B', fontWeight: 600 }}>
                            <Target size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                            <span>{lead.goal}</span>
                          </div>
                        </td>

                        {/* Contact No & Communication actions */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                            {lead.contactNo}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}, this is Sneha Dey following up on your ${lead.decidedPackageOption} long-term transformation inquiry!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '3px 7px',
                                borderRadius: '4px',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                fontSize: '10.5px',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={10} />
                              <span>WP</span>
                            </a>

                            {/* Call */}
                            <a
                              href={`tel:${cleanPhone}`}
                              style={{
                                padding: '3px 7px',
                                borderRadius: '4px',
                                backgroundColor: '#E2E8F0',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                              title="Direct Phone Call"
                            >
                              <Phone size={10} />
                              <span>Call</span>
                            </a>

                            {/* SMS */}
                            <a
                              href={`sms:${cleanPhone}?body=${encodeURIComponent(`Hi ${lead.name}, Sneha Dey here regarding your She Nourishes health package consultation.`)}`}
                              style={{
                                padding: '3px 7px',
                                borderRadius: '4px',
                                backgroundColor: '#EFF6FF',
                                color: '#1E40AF',
                                textDecoration: 'none',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                              title="Send SMS"
                            >
                              <Mail size={10} />
                              <span>SMS</span>
                            </a>
                          </div>
                        </td>

                        {/* Remove Action */}
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Delete Lead"
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
            Showing <span style={{ color: '#064E3B', fontWeight: 800 }}>{filteredLeads.length}</span> of {leads.length} Leads
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

      {/* SUB-MODAL: Add New Long-Term Lead Form */}
      {showAddForm && (
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
              maxWidth: '520px',
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
                Register New Long-Term Support Lead
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Sen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Decided Package Option
                </label>
                <select
                  value={formPackage}
                  onChange={(e) => setFormPackage(e.target.value as PackageDurationOption)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                >
                  <option value="1 Month">1 Month (₹25,000 Total)</option>
                  <option value="2 Months">2 Months (₹35,599 Total)</option>
                  <option value="3 Months">3 Months (₹51,199 Total)</option>
                  <option value="6 Months">6 Months (₹91,999 Total)</option>
                  <option value="9 Months">9 Months (₹1,32,000 Total)</option>
                  <option value="12 Months">12 Months (₹1,65,000 Total)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Location of Meeting
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blue Tokai Coffee Roasters / South Delhi Clinic"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Transformation Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muscle Gain, Gut & Thyroid Balance"
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Contact No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formContactNo}
                    onChange={(e) => setFormContactNo(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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
                  Save to Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
