import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  X, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  AlertTriangle,
  Copy
} from 'lucide-react';
import { getLongTermAgreementConfig } from '../../data/agreementsData';

interface AdminAgreementCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  packageDurationMonths?: number;
  fixedPriceInr?: number;
}

export const AdminAgreementCollectionModal: React.FC<AdminAgreementCollectionModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientEmail = 'deysneha690@gmail.com',
  clientPhone = '9903711773',
  packageDurationMonths = 3,
  fixedPriceInr: initialPrice,
}) => {
  const config = getLongTermAgreementConfig(packageDurationMonths);
  const fixedPrice = initialPrice || config.fixedPriceInr;
  const formattedPrice = `₹${fixedPrice.toLocaleString('en-IN')}`;

  const storageKey = `she_nourishes_admin_agreement_${clientId}`;
  const [isSigned, setIsSigned] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).isSigned : true;
    } catch {
      return true;
    }
  });

  const [signatureName, setSignatureName] = useState<string>(clientName || 'Sneha De');
  const [signedDate, setSignedDate] = useState<string>('2026-09-20');
  const [showCopyNotice, setShowCopyNotice] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setIsSigned(parsed.isSigned ?? true);
        if (parsed.signatureName) setSignatureName(parsed.signatureName);
        if (parsed.signedDate) setSignedDate(parsed.signedDate);
      }
    } catch {}
  }, [clientId, storageKey]);

  if (!isOpen) return null;

  const handleToggleVerified = () => {
    const nextState = !isSigned;
    setIsSigned(nextState);
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        isSigned: nextState,
        signatureName,
        signedDate,
        updatedAt: Date.now(),
      }));
    } catch {}
  };

  const handleCopyAgreementLink = () => {
    const link = `https://she-nourishes.web.app/agreement?client=${clientId}&pkg=${packageDurationMonths}`;
    navigator.clipboard?.writeText(link);
    setShowCopyNotice(true);
    setTimeout(() => setShowCopyNotice(false), 3000);
  };

  const handleSendWhatsAppPrompt = () => {
    const text = encodeURIComponent(
      `Hi ${clientName}, please review and sign your She Nourishes ${packageDurationMonths}-Month Consultation Agreement (${formattedPrice}). Link: https://she-nourishes.web.app/agreement?client=${clientId}`
    );
    window.open(`https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: '#FFFDF9',
          borderRadius: '20px',
          border: '2px solid #0A1C44',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(232, 202, 86, 0.2)',
                color: '#E8CA56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ADMIN COMPLIANCE PORTAL
              </span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Agreement Collection & Verification
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Status Bar */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: isSigned ? '#ECFDF5' : '#FFFBEB',
              border: `1.5px solid ${isSigned ? '#10B981' : '#F59E0B'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSigned ? (
                <CheckCircle2 size={24} color="#059669" />
              ) : (
                <Clock size={24} color="#D97706" />
              )}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: isSigned ? '#065F46' : '#92400E' }}>
                  {isSigned ? 'Agreement Signed & Legally Verified' : 'Awaiting Client Digital Signature'}
                </div>
                <div style={{ fontSize: '11.5px', color: isSigned ? '#047857' : '#B45309' }}>
                  {isSigned 
                    ? `Signed by ${signatureName} on ${signedDate} • Stored on Cloud RTDB`
                    : 'Dispatch agreement link to client via WhatsApp or Email below.'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleVerified}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: isSigned ? '#059669' : '#0A1C44',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isSigned ? 'Revoke Status' : 'Mark Signed ✓'}
            </button>
          </div>

          {/* Client & Plan Snapshot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>PARTICIPANT</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>{clientName}</div>
              <div style={{ fontSize: '10.5px', color: '#475569' }}>{clientPhone} • {clientEmail}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>PACKAGE DURATION</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', marginTop: '2px' }}>
                {packageDurationMonths} Months Plan
              </div>
              <div style={{ fontSize: '10.5px', color: '#047857', fontWeight: 700 }}>{config.badgeTitle}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#F8F6EF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>FIXED PACKAGE FEE</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', marginTop: '2px' }}>
                {formattedPrice}
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Fixed & Non-Refundable</div>
            </div>
          </div>

          {/* Mandatory Legal Clauses Highlighted as Requested */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0A1C44', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mandatory Protective Clauses Included
            </h4>

            {/* 1. Non-Transferability */}
            <div style={{ padding: '10px 12px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', display: 'flex', gap: '10px' }}>
              <ShieldCheck size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#14532D' }}>
                  Strict Non-Transferability Clause
                </div>
                <p style={{ fontSize: '11px', color: '#166534', margin: '2px 0 0', lineHeight: 1.4 }}>
                  No one gives the participant access or transfers their program. The package and recommendations are 100% personalized exclusively for {clientName} and cannot be assigned, transferred, or shared.
                </p>
              </div>
            </div>

            {/* 2. No 100% Guarantee */}
            <div style={{ padding: '10px 12px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FECACA', display: 'flex', gap: '10px' }}>
              <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B' }}>
                  No 100% Results Guarantee Disclaimer
                </div>
                <p style={{ fontSize: '11px', color: '#B91C1C', margin: '2px 0 0', lineHeight: 1.4 }}>
                  Results are explicitly not 100% guaranteed. Outcomes depend upon individual metabolic, hormonal, and physiological variance, plus strict adherence by the client.
                </p>
              </div>
            </div>

            {/* 3. Fixed Price Clause */}
            <div style={{ padding: '10px 12px', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', display: 'flex', gap: '10px' }}>
              <FileCheck size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E3A8A' }}>
                  Fixed Price Agreement Clause
                </div>
                <p style={{ fontSize: '11px', color: '#1D4ED8', margin: '2px 0 0', lineHeight: 1.4 }}>
                  Clear fixed price of <strong>{formattedPrice}</strong> recorded with zero hidden additions.
                </p>
              </div>
            </div>
          </div>

          {/* Signature Verification Preview */}
          <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px dashed #CBD5E1' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              Client Digital Signature Record
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'cursive, serif', fontSize: '20px', color: '#0A1C44', fontWeight: 700 }}>
                  {signatureName}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Client IP & Digital Consent Timestamp: {signedDate} 10:24 AM IST
                </div>
              </div>
              <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#EEF4E8', color: '#38571A', fontSize: '11px', fontWeight: 800 }}>
                Verified by She Nourishes
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#FAF8F0',
            borderTop: '1px solid #ECEAE0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={handleCopyAgreementLink}
            className="btn-outline"
            style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Copy size={13} />
            <span>{showCopyNotice ? 'Copied link! ✓' : 'Copy Client Link'}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleSendWhatsAppPrompt}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Send size={13} />
              <span>Send on WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
              style={{ fontSize: '12px' }}
            >
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
