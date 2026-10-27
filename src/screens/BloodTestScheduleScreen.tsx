import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  ArrowLeft, 
  Upload 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getBloodTestSchedule, 
  saveBloodTestSchedule, 
  generateBloodTestScheduleForPlan, 
  STANDARD_PACKAGE_BIOMARKERS 
} from '../services/counsellingService';
import type { BloodTestPlanSchedule, ScheduledBloodTestItem } from '../types/counselling';

interface BloodTestScheduleScreenProps {
  onBack?: () => void;
  isAdminMode?: boolean;
  clientId?: string;
  clientName?: string;
}

export const BloodTestScheduleScreen: React.FC<BloodTestScheduleScreenProps> = ({
  onBack,
  isAdminMode = false,
  clientId: propClientId,
  clientName: propClientName,
}) => {
  const { user, customerRecord } = useAuth();
  const clientId = propClientId || user?.uid || customerRecord?.uid || 'default_user';
  const clientName = propClientName || customerRecord?.personalDetails?.fullName || 'Client';

  const [schedule, setSchedule] = useState<BloodTestPlanSchedule>(() => generateBloodTestScheduleForPlan(3));
  const [selectedPlanMonths, setSelectedPlanMonths] = useState<1 | 2 | 3 | 6 | 9 | 12>(3);
  const [selectedTestToEdit, setSelectedTestToEdit] = useState<ScheduledBloodTestItem | null>(null);
  const [showConfirmationAlert, setShowConfirmationAlert] = useState<boolean>(false);

  // Admin report upload fields
  const [uploadReportUrl, setUploadReportUrl] = useState<string>('');
  const [uploadReportFileName, setUploadReportFileName] = useState<string>('Clinical_Biomarker_Report_Panel.pdf');
  const [doctorRemarks, setDoctorRemarks] = useState<string>('Optimal fasting glucose. Recommended Vitamin D3 60,000 IU weekly protocol.');

  useEffect(() => {
    async function load() {
      const data = await getBloodTestSchedule(clientId);
      setSchedule(data);
      setSelectedPlanMonths(data.planDurationMonths || 3);
    }
    load();
  }, [clientId]);

  const handlePlanDurationChange = (months: 1 | 2 | 3 | 6 | 9 | 12) => {
    setSelectedPlanMonths(months);
    const newSchedule = generateBloodTestScheduleForPlan(months);
    setSchedule(newSchedule);
    saveBloodTestSchedule(clientId, newSchedule);
    setShowConfirmationAlert(true);
    setTimeout(() => setShowConfirmationAlert(false), 4000);
  };

  const handleUpdateTestSlot = (testId: string, newDate: string, newSlot: string) => {
    const updatedTests = schedule.tests.map((t) => {
      if (t.id === testId) {
        return { ...t, scheduledDate: newDate, timeSlot: newSlot };
      }
      return t;
    });
    const updated = { ...schedule, tests: updatedTests };
    setSchedule(updated);
    saveBloodTestSchedule(clientId, updated);
  };

  const handleAdminUploadReport = (testId: string) => {
    const updatedTests = schedule.tests.map((t) => {
      if (t.id === testId) {
        return {
          ...t,
          status: 'Report Uploaded' as const,
          reportUrl: uploadReportUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          reportFileName: uploadReportFileName || 'Clinical_Lab_Report.pdf',
          reportUploadedAt: Date.now(),
          doctorRemarks,
        };
      }
      return t;
    });

    const updated = { ...schedule, tests: updatedTests };
    setSchedule(updated);
    saveBloodTestSchedule(clientId, updated);
    setSelectedTestToEdit(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8F6EF', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 14px', backgroundColor: '#0A1C44', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CLINICAL DIAGNOSTIC TRACKER
              </span>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Blood Test Automation & Lab Reports
              </h1>
              <span style={{ fontSize: '11px', color: '#93C5FD' }}>
                Client: {clientName}
              </span>
            </div>
          </div>

          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontWeight: 800 }}>
            {selectedPlanMonths}-Month Schedule Active
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Confirmation Notification Banner */}
        {showConfirmationAlert && (
          <div className="animate-fade-in" style={{ padding: '12px 14px', backgroundColor: '#EEF4E8', borderRadius: '8px', border: '1.5px solid #B8D4A8', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#38571A" />
            <div style={{ fontSize: '12px', color: '#2B4214' }}>
              <strong>Schedule Updated:</strong> Automated recurring test dates dispatched via email to customer & admin.
            </div>
          </div>
        )}

        {/* Included Standard Biomarkers Banner */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#0A1C44', color: '#FFFFFF', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '13px', color: '#E8CA56', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🧪 5 Included Clinical Biomarkers
            </strong>
            <span style={{ fontSize: '11px', color: '#FFFFFF', opacity: 0.8 }}>100% Covered in Package</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {STANDARD_PACKAGE_BIOMARKERS.map((bm) => (
              <span key={bm} style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.12)', fontSize: '11.5px', fontWeight: 600 }}>
                • {bm}
              </span>
            ))}
          </div>
        </div>

        {/* Plan Duration Selector (1 Month, 3 Months, 6 Months) */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid #D9D8CC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#242820', margin: 0 }}>
                Select Package Testing Timeline
              </h3>
              <p style={{ fontSize: '11.5px', color: '#6B7063', margin: '2px 0 0' }}>
                Recurring tests automatically calibrated across your transformation milestone dates.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            {[
              { months: 1 as const, label: '1-Month Plan', desc: '1 Test (Baseline)' },
              { months: 2 as const, label: '2-Month Plan', desc: '1 Test (Baseline)' },
              { months: 3 as const, label: '3-Month Plan', desc: '2 Tests (1st & 3rd Mo)' },
              { months: 6 as const, label: '6-Month Plan', desc: '3 Tests (1st, 3rd & 6th Mo)' },
              { months: 9 as const, label: '9-Month Plan', desc: '4 Tests (1st, 3rd, 6th & 9th Mo)' },
              { months: 12 as const, label: '12-Month Plan', desc: '5 Tests (1st, 3rd, 6th, 9th & 12th Mo)' },
            ].map((p) => (
              <button
                key={p.months}
                type="button"
                onClick={() => handlePlanDurationChange(p.months)}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  backgroundColor: selectedPlanMonths === p.months ? '#0A1C44' : '#FAF8F0',
                  color: selectedPlanMonths === p.months ? '#FFFFFF' : '#242820',
                  border: `1.5px solid ${selectedPlanMonths === p.months ? '#0A1C44' : '#D9D8CC'}`,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <strong style={{ fontSize: '12px' }}>{p.label}</strong>
                <div style={{ fontSize: '10.5px', opacity: 0.8, marginTop: '2px' }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Blood Tests Milestone Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#242820', margin: 0 }}>
            Scheduled Diagnostic Milestones ({schedule.tests.length} Total)
          </h3>

          {schedule.tests.map((test) => (
            <div
              key={test.id}
              className="wellness-card"
              style={{
                padding: '16px',
                backgroundColor: '#FFFFFF',
                border: `1.5px solid ${test.status === 'Report Uploaded' ? '#38571A' : '#D9D8CC'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EEF4E8', color: '#38571A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                    {test.scheduledMonthNumber}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#242820', margin: 0 }}>
                      {test.testPhase}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#6B7063' }}>{test.collectionType}</span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 800,
                    backgroundColor: test.status === 'Report Uploaded' ? '#EEF4E8' : '#FAF6D9',
                    color: test.status === 'Report Uploaded' ? '#38571A' : '#6B5418',
                  }}
                >
                  {test.status === 'Report Uploaded' ? '✓ Report Ready' : '⏳ Fasting Test Scheduled'}
                </span>
              </div>

              {/* Slot Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#FAF8F0', borderRadius: '6px' }}>
                  <span style={{ color: '#6B7063', fontSize: '10.5px' }}>Collection Date:</span>
                  <input
                    type="date"
                    value={test.scheduledDate}
                    onChange={(e) => handleUpdateTestSlot(test.id, e.target.value, test.timeSlot)}
                    style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, border: '1px solid #D9D8CC', borderRadius: '4px', padding: '2px 4px', marginTop: '2px', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div style={{ padding: '8px', backgroundColor: '#FAF8F0', borderRadius: '6px' }}>
                  <span style={{ color: '#6B7063', fontSize: '10.5px' }}>Fasting Window:</span>
                  <select
                    value={test.timeSlot}
                    onChange={(e) => handleUpdateTestSlot(test.id, test.scheduledDate, e.target.value)}
                    style={{ display: 'block', width: '100%', fontSize: '11px', fontWeight: 700, border: '1px solid #D9D8CC', borderRadius: '4px', padding: '3px 4px', marginTop: '2px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="07:00 AM – 08:30 AM (Fasting)">07:00 AM – 08:30 AM (Fasting)</option>
                    <option value="07:30 AM – 09:30 AM (Fasting)">07:30 AM – 09:30 AM (Fasting)</option>
                    <option value="08:30 AM – 10:30 AM (Fasting)">08:30 AM – 10:30 AM (Fasting)</option>
                  </select>
                </div>
              </div>

              {/* Lab Report PDF Download / View Section if Uploaded */}
              {test.status === 'Report Uploaded' && (
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F8FCF5', border: '1px solid #B8D4A8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={16} color="#38571A" />
                      <strong style={{ fontSize: '12.5px', color: '#38571A' }}>{test.reportFileName || 'Diagnostic_Lab_Report.pdf'}</strong>
                    </div>
                    <a
                      href={test.reportUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', backgroundColor: '#38571A', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}
                    >
                      <Download size={13} />
                      <span>View PDF</span>
                    </a>
                  </div>
                  {test.doctorRemarks && (
                    <div style={{ fontSize: '11.5px', color: '#2B4214', marginTop: '4px' }}>
                      <strong>Doctor Remarks:</strong> {test.doctorRemarks}
                    </div>
                  )}
                </div>
              )}

              {/* Admin Panel Upload Button */}
              {isAdminMode && (
                <div style={{ borderTop: '1px solid #ECEAE0', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedTestToEdit(test)}
                    className="btn-outline"
                    style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Upload size={12} />
                    <span>Upload / Attach Scanned PDF Report</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal for Admin Uploading Scanned Report PDF */}
        {selectedTestToEdit && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFDF8', borderRadius: '12px', padding: '18px', border: '1px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  Upload Lab Report PDF ({selectedTestToEdit.testPhase})
                </h3>
                <button type="button" onClick={() => setSelectedTestToEdit(null)} style={{ background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}>✕</button>
              </div>

              <div className="form-group">
                <label className="form-label">Report File Name</label>
                <input
                  type="text"
                  value={uploadReportFileName}
                  onChange={(e) => setUploadReportFileName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">PDF File Link / Cloud URL</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://..."
                  value={uploadReportUrl}
                  onChange={(e) => setUploadReportUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor / Nutritionist Remarks</label>
                <textarea
                  rows={3}
                  value={doctorRemarks}
                  onChange={(e) => setDoctorRemarks(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setSelectedTestToEdit(null)} className="btn-outline">Cancel</button>
                <button type="button" onClick={() => handleAdminUploadReport(selectedTestToEdit.id)} className="btn-primary">Save & Publish to Client</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
