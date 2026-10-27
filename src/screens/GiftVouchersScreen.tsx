import React, { useState } from 'react';
import { Gift, CheckCircle2, ArrowLeft, Copy, Check } from 'lucide-react';
import { DEFAULT_VOUCHERS } from '../services/counsellingService';
import { StepGiftOption } from './steps/StepGiftOption';
import type { GiftVoucherItem } from '../types/counselling';

interface GiftVouchersScreenProps {
  onBack?: () => void;
}

export const GiftVouchersScreen: React.FC<GiftVouchersScreenProps> = ({ onBack }) => {
  const [vouchers, setVouchers] = useState<GiftVoucherItem[]>(DEFAULT_VOUCHERS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimedAlert, setClaimedAlert] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaim = (voucherId: string, title: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isClaimed: true, claimedAt: Date.now() } : v))
    );
    setClaimedAlert(title);
    setTimeout(() => setClaimedAlert(null), 4000);
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
                CLIENT PERKS & REWARDS
              </span>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Gift Vouchers & Bonus Perks
              </h1>
            </div>
          </div>

          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#FAF6D9', color: '#6B5418', fontWeight: 800 }}>
            {vouchers.filter((v) => v.isClaimed).length} / {vouchers.length} Claimed
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {claimedAlert && (
          <div className="animate-fade-in" style={{ padding: '12px 14px', backgroundColor: '#EEF4E8', borderRadius: '8px', border: '1.5px solid #B8D4A8', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#38571A" />
            <div style={{ fontSize: '12px', color: '#2B4214' }}>
              <strong>Perk Unlocked:</strong> '{claimedAlert}' has been credited to your client profile and emailed to your nutritionist!
            </div>
          </div>
        )}

        <div style={{ marginBottom: '8px' }}>
          <StepGiftOption
            selectedGiftId="gift_bottle"
            onSelectGift={(id) => {
              console.log('Selected gift:', id);
            }}
          />
        </div>

        {/* Vouchers List */}
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="wellness-card"
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              border: `1.5px solid ${voucher.isCompulsoryWelcome ? '#E8CA56' : '#D9D8CC'}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Compulsory Badge */}
            {voucher.isCompulsoryWelcome && (
              <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#E8CA56', color: '#0A1C44', fontSize: '10px', fontWeight: 900, padding: '3px 10px', borderBottomLeftRadius: '8px', textTransform: 'uppercase' }}>
                ★ Compulsory Included
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: voucher.isCompulsoryWelcome ? '#FAF6D9' : '#EEF4E8', color: voucher.isCompulsoryWelcome ? '#6B5418' : '#38571A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={20} />
              </div>
              <div style={{ flex: 1, paddingRight: voucher.isCompulsoryWelcome ? '60px' : '0' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#242820', margin: '0 0 3px' }}>
                  {voucher.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#6B7063', margin: 0, lineHeight: 1.4 }}>
                  {voucher.description}
                </p>
              </div>
            </div>

            {/* Voucher Code & Value Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FAF8F0', border: '1px dashed #D9D8CC' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#6B7063' }}>VOUCHER CODE:</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', letterSpacing: '0.05em' }}>
                  {voucher.code}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38571A' }}>
                  {voucher.discountOrPerkValue}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(voucher.code)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #D9D8CC', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                >
                  {copiedCode === voucher.code ? <Check size={12} color="#38571A" /> : <Copy size={12} />}
                  <span>{copiedCode === voucher.code ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#6B7063', borderTop: '1px solid #ECEAE0', paddingTop: '8px' }}>
              <span>{voucher.validUntil} • {voucher.planApplicable}</span>

              {voucher.isClaimed ? (
                <span style={{ fontWeight: 800, color: '#38571A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} />
                  <span>Unlocked & Active</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClaim(voucher.id, voucher.title)}
                  className="btn-primary"
                  style={{ padding: '5px 12px', fontSize: '11.5px' }}
                >
                  Claim & Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
