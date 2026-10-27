import React, { useState } from 'react';
import { 
  Send, 
  Dumbbell, 
  FileText, 
  Camera, 
  Zap, 
  ShieldCheck
} from 'lucide-react';
import type { CustomerRecord } from '../../types/customer';
import { getLongTermAgreementConfig } from '../../data/agreementsData';

interface AdminPlanDetailsBoxProps {
  client: CustomerRecord;
  onOpenPhotoScanner: () => void;
  onOpenIntensityModal: () => void;
  onOpenAgreementModal: () => void;
  onOpenPriorBloodTestModal: () => void;
  onOpenLifestyleSupplementModal?: () => void;
}

export const AdminPlanDetailsBox: React.FC<AdminPlanDetailsBoxProps> = ({
  client,
  onOpenPhotoScanner,
  onOpenIntensityModal,
  onOpenAgreementModal,
  onOpenPriorBloodTestModal,
  onOpenLifestyleSupplementModal,
}) => {
  const clientName = client.personalDetails?.fullName || 'Client';
  const clientPhone = client.personalDetails?.mobileNumber || '9903711773';
  const primaryGoal = client.goalAssessment?.primaryGoals?.[0] || 'Muscle Fat Loss';

  // Selected package duration (default 3 months)
  const durationMonths = 3;
  const agreementCfg = getLongTermAgreementConfig(durationMonths);
  const formattedPrice = `₹${agreementCfg.fixedPriceInr.toLocaleString('en-IN')}`;

  const [dataSentNotice, setDataSentNotice] = useState(false);

  const handleSendData = () => {
    const summaryText = encodeURIComponent(
      `*SHE NOURISHES — CLIENT PLAN ENROLLMENT DETAILS*\n` +
      `Client: ${clientName}\n` +
      `Primary Goal: ${primaryGoal}\n` +
      `Package: ${durationMonths}-Month Transformation (${agreementCfg.badgeTitle})\n` +
      `Fixed Package Fee: ${formattedPrice} (Fixed & Non-Refundable)\n` +
      `Follow-up Sessions: 21 Sessions\n` +
      `Blood Diagnostic Tests: 2 Comprehensive Panels (Baseline & Month 3)\n` +
      `Gifts Included: Gym Bag\n` +
      `Terms: Non-transferable • No 100% guarantee results disclaimer\n\n` +
      `Access your live plan in the She Nourishes Mobile App: https://she-nourishes.web.app`
    );

    window.open(`https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${summaryText}`, '_blank');
    setDataSentNotice(true);
    setTimeout(() => setDataSentNotice(false), 4000);
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #0A1C44',
        padding: '18px',
        boxShadow: '0 4px 14px rgba(10, 28, 68, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#0A1C44',
              color: '#E8CA56',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: '#B45309', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ADMIN CONTROL CENTER
              </span>
              <span style={{ fontSize: '10px', color: '#15803D', fontWeight: 800, backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px' }}>
                ● Active Plan Verified
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
              Plan Details & Direct Client Transmission
            </h3>
          </div>
        </div>

        {/* Action: Send Data */}
        <button
          type="button"
          onClick={handleSendData}
          className="btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#059669',
          }}
        >
          <Send size={13} />
          <span>Send Data to Client</span>
        </button>
      </div>

      {dataSentNotice && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#ECFDF5', border: '1.5px solid #10B981', color: '#065F46', fontSize: '12px', fontWeight: 700 }}>
          ✓ Plan details dispatched to client! Live Firebase link delivered.
        </div>
      )}

      {/* Plan Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        <div style={{ padding: '10px 12px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>ENROLLED PACKAGE</span>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', marginTop: '2px' }}>
            {durationMonths} Months ({agreementCfg.badgeTitle})
          </div>
          <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>Fixed: {formattedPrice}</div>
        </div>

        <div style={{ padding: '10px 12px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>GYM GOAL & TARGET</span>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
            🎯 {primaryGoal}
          </div>
          <div style={{ fontSize: '10.5px', color: '#475569' }}>Target: 12-Week Milestones</div>
        </div>

        <div style={{ padding: '10px 12px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>BLOOD TESTS INCLUDED</span>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', marginTop: '2px' }}>
            2 Tests (Baseline & Month 3)
          </div>
          <div style={{ fontSize: '10.5px', color: '#2563EB', fontWeight: 700 }}>+ Dedicated Lipid Profile</div>
        </div>
      </div>

      {/* Gym Goal Box & Scanner Shortcut */}
      <div style={{ padding: '12px 14px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1.5px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dumbbell size={18} color="#16A34A" />
          <div>
            <strong style={{ fontSize: '12.5px', color: '#14532D' }}>
              Gym Goal: {primaryGoal} • Body Composition Scanner Active
            </strong>
            <p style={{ fontSize: '11px', color: '#166534', margin: '2px 0 0' }}>
              Track client physical adaptations with front, side, and back visual photo uploads.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPhotoScanner}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            fontSize: '11.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Camera size={13} />
          <span>Upload / Photo Scanner</span>
        </button>
      </div>

      {/* Quick Launch Actions Row */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onOpenAgreementModal}
          className="btn-outline"
          style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}
        >
          <ShieldCheck size={13} color="#0A1C44" />
          <span>Agreement Collection & Verification</span>
        </button>

        <button
          type="button"
          onClick={onOpenIntensityModal}
          className="btn-outline"
          style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}
        >
          <Zap size={13} color="#D97706" />
          <span>Assign Workout Intensity & Start Date</span>
        </button>

        <button
          type="button"
          onClick={onOpenPriorBloodTestModal}
          className="btn-outline"
          style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}
        >
          <FileText size={13} color="#2563EB" />
          <span>Attach Prior Blood Test (Lipid Profile)</span>
        </button>

        {onOpenLifestyleSupplementModal && (
          <button
            type="button"
            onClick={onOpenLifestyleSupplementModal}
            className="btn-outline"
            style={{
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderColor: '#059669',
              color: '#065F46',
              backgroundColor: '#ECFDF5',
              fontWeight: 700,
            }}
          >
            <Zap size={13} color="#059669" />
            <span>Lifestyle Supplement Assessment (1.5 / 2.0 / 2.5)</span>
          </button>
        )}
      </div>
    </div>
  );
};
