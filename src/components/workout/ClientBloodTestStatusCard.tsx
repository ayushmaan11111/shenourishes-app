import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  ChevronRight, 
  Download, 
  HeartPulse 
} from 'lucide-react';
import { getClientTrackingRecord, type ClientTrackingRecord } from '../../services/clientTrackingService';

interface ClientBloodTestStatusCardProps {
  clientId: string;
  clientName: string;
  onOpenFullSchedule: () => void;
}

export const ClientBloodTestStatusCard: React.FC<ClientBloodTestStatusCardProps> = ({
  clientId,
  clientName,
  onOpenFullSchedule,
}) => {
  const [tracking, setTracking] = useState<ClientTrackingRecord | null>(null);

  const loadData = async () => {
    try {
      const rec = await getClientTrackingRecord(clientId, clientName);
      setTracking(rec);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('blood_schedule_updated', loadData);
    window.addEventListener('prior_blood_test_added', loadData);
    return () => {
      window.removeEventListener('blood_schedule_updated', loadData);
      window.removeEventListener('prior_blood_test_added', loadData);
    };
  }, [clientId, clientName]);

  const tests = tracking?.healthTests || [];
  const completedCount = tests.filter(t => t.status === 'Test Completed ✓' || t.status === 'Report Submitted ✓' || t.status === 'Report Reviewed ✓').length;
  const lipidTest = tests.find(t => t.category === 'Complete Lipid Profile') || tests[1];
  const nextUpcoming = tests.find(t => t.status === 'Pending') || tests[0];

  return (
    <div
      style={{
        marginBottom: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #D9E2EC',
        padding: '18px 16px',
        boxShadow: '0 4px 14px rgba(10, 28, 68, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TestTube size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
              Blood Test Status & Reports
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Quarterly Monitoring (Every 3 Months)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFullSchedule}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563EB',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span>Schedule</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Overview Status Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>MILESTONES</div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', marginTop: '2px' }}>
            {completedCount} of {tests.length || 3} Done
          </div>
        </div>

        <div style={{ padding: '8px 10px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '10px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>LIPID PROFILE</div>
          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>
            {lipidTest?.status === 'Report Submitted ✓' ? 'Report Ready ✓' : 'Fasting Sample'}
          </div>
        </div>

        <div style={{ padding: '8px 10px', backgroundColor: '#FEF3C7', borderRadius: '10px', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>NEXT TEST</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
            {nextUpcoming ? nextUpcoming.scheduledPhase.slice(0, 7) : 'Active'}
          </div>
        </div>
      </div>

      {/* Lipid Profile Spotlight Box */}
      {lipidTest && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#F8FCF5',
            borderRadius: '12px',
            border: '1px solid #B8D4A8',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse size={16} color="#38571A" />
              <strong style={{ fontSize: '12px', color: '#2B4214' }}>
                Lipid Profile Panel (Separate Cardiovascular Testing)
              </strong>
            </div>
            <span style={{ fontSize: '10.5px', color: '#38571A', fontWeight: 800, backgroundColor: '#E2F0D9', padding: '2px 6px', borderRadius: '4px' }}>
              {lipidTest.status}
            </span>
          </div>

          {lipidTest.lipidDetails ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '11px', textAlign: 'center' }}>
              <div style={{ padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>Total</span>
                <strong>{lipidTest.lipidDetails.totalCholesterol || 182} mg/dL</strong>
              </div>
              <div style={{ padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>HDL (Good)</span>
                <strong style={{ color: '#16A34A' }}>{lipidTest.lipidDetails.hdl || 56} mg/dL</strong>
              </div>
              <div style={{ padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>LDL (Bad)</span>
                <strong>{lipidTest.lipidDetails.ldl || 98} mg/dL</strong>
              </div>
              <div style={{ padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>Triglycerides</span>
                <strong>{lipidTest.lipidDetails.triglycerides || 110} mg/dL</strong>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#4A6B32' }}>
              Home sample collection covering Total Cholesterol, Triglycerides, HDL, LDL & VLDL.
            </div>
          )}

          {lipidTest.reportUrl && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
              <a
                href={lipidTest.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#38571A',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Download size={12} />
                <span>View Lab Report (PDF)</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
