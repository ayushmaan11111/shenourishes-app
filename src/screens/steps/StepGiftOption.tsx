import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface GiftItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  isCompulsory?: boolean;
}

export const COMPULSORY_GIFT: GiftItem = {
  id: 'gift_compulsory_bag',
  name: 'PREMIUM GYM & WELLNESS BAG',
  category: 'Compulsory Hero Gift',
  icon: '🧳',
  isCompulsory: true,
};

export const ADDON_GIFT_OPTIONS: GiftItem[] = [
  { id: 'gift_skipping_rope', name: 'SKIPPING ROPE', category: 'Fitness', icon: '🪢' },
  { id: 'gift_key_locker', name: 'KEY LOCKER', category: 'Security', icon: '🔒' },
  { id: 'gift_keychain', name: 'KEYCHAIN', category: 'Accessory', icon: '🔑' },
  { id: 'gift_bottle', name: 'BOTTLE', category: 'Hydration', icon: '🍾' },
  { id: 'gift_phone_armband', name: 'PHONE ARMBAND', category: 'Wearable', icon: '📱' },
  { id: 'gift_resistance_loop', name: 'RESISTANCE LOOP', category: 'Mobility', icon: '🎗️' },
  { id: 'gift_gripper', name: 'GRIPPER', category: 'Strength', icon: '✊' },
  { id: 'gift_foam_roller', name: 'MINI FOAM ROLLER', category: 'Recovery', icon: '🪵' },
];

interface StepGiftOptionProps {
  selectedGiftId?: string;
  onSelectGift: (giftId: string) => void;
  error?: string;
  planDurationLabel?: string;
}

export const StepGiftOption: React.FC<StepGiftOptionProps> = ({
  selectedGiftId = 'gift_bottle',
  onSelectGift,
  error,
  planDurationLabel = '1 MONTH PACKAGE',
}) => {
  const [chosenAddonId, setChosenAddonId] = useState<string>(selectedGiftId);

  const handleSelectAddon = (id: string) => {
    setChosenAddonId(id);
    onSelectGift(id);
  };

  return (
    <div
      className="space-y-6 animate-fade-in"
      style={{
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
        padding: '20px 16px',
        borderRadius: '16px',
        border: '1.5.px solid #D4AF37',
        boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
      }}
    >
      {/* Top Banner Header with Confetti & Gold Trim */}
      <div style={{ textAlign: 'center', position: 'relative', paddingBottom: '12px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '26px' }}>🎁</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em' }}>
            <span>✦</span> EXCLUSIVE CLIENT PACKAGE PERKS <span>✦</span>
          </div>
          <span style={{ fontSize: '26px' }}>🎁</span>
        </div>

        <h1
          className="font-serif"
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            margin: '2px 0 0',
            textTransform: 'uppercase',
          }}
        >
          {planDurationLabel}
        </h1>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 900,
            color: '#E8CA56',
            letterSpacing: '0.06em',
            margin: '0 0 8px',
            textTransform: 'uppercase',
          }}
        >
          WELLNESS PACKAGE
        </h2>

        <div style={{ fontSize: '11px', color: '#B3B3B3', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 10px' }}>
          — YOUR FITNESS & NUTRITION JOURNEY STARTS HERE —
        </div>

        {/* Gold Pill Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: '#1A1810',
            border: '1.5px solid #D4AF37',
            color: '#F3E5AB',
            fontSize: '11.5px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            boxShadow: '0 2px 10px rgba(212, 175, 55, 0.2)',
          }}
        >
          CHOOSE 1 COMPULSORY GIFT + 1 MORE GIFT
        </div>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#3A1010', color: '#FF8888', fontSize: '12px', border: '1px solid #772222', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* =========================================================================
          SECTION 1: COMPULSORY GIFT (HERO DUFFEL BAG CARD)
         ========================================================================= */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: '6px',
            backgroundColor: '#1E1B10',
            border: '1px solid #D4AF37',
            color: '#D4AF37',
            fontSize: '10.5px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            marginBottom: '10px',
            textTransform: 'uppercase',
          }}
        >
          COMPULSORY GIFT
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: '#141414',
            border: '1.5px solid #D4AF37',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: '48px', margin: '4px 0' }}>{COMPULSORY_GIFT.icon}</div>
          <strong style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {COMPULSORY_GIFT.name}
          </strong>

          <div
            style={{
              padding: '6px 20px',
              borderRadius: '6px',
              backgroundColor: '#D4AF37',
              color: '#000000',
              fontSize: '12px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.05em',
            }}
          >
            <span>SELECTED</span>
            <CheckCircle2 size={14} color="#000000" />
          </div>
        </div>
      </div>

      {/* Gold Plus Sign Divider */}
      <div style={{ textAlign: 'center', margin: '12px 0' }}>
        <span style={{ fontSize: '24px', fontWeight: 900, color: '#D4AF37' }}>+</span>
      </div>

      {/* =========================================================================
          SECTION 2: CHOOSE 1 MORE GIFT (8-ITEM INTERACTIVE GRID)
         ========================================================================= */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '3px 12px',
              borderRadius: '6px',
              backgroundColor: '#1E1B10',
              border: '1px solid #D4AF37',
              color: '#D4AF37',
              fontSize: '10.5px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            CHOOSE 1 MORE GIFT
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '10px',
          }}
        >
          {ADDON_GIFT_OPTIONS.map((item) => {
            const isChosen = chosenAddonId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectAddon(item.id)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  backgroundColor: isChosen ? '#1C190D' : '#121212',
                  border: `1.5px solid ${isChosen ? '#D4AF37' : '#2A2A2A'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: isChosen ? '0 0 14px rgba(212, 175, 55, 0.3)' : 'none',
                }}
              >
                <div style={{ fontSize: '32px', marginTop: '4px' }}>{item.icon}</div>

                <strong
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: isChosen ? '#F3E5AB' : '#DDDDDD',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    lineHeight: 1.3,
                  }}
                >
                  {item.name}
                </strong>

                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '5px 0',
                    borderRadius: '5px',
                    backgroundColor: isChosen ? '#D4AF37' : '#26241E',
                    color: isChosen ? '#000000' : '#D4AF37',
                    border: `1px solid ${isChosen ? '#D4AF37' : '#554411'}`,
                    fontSize: '10.5px',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  {isChosen ? (
                    <>
                      <span>SELECTED</span>
                      <CheckCircle2 size={12} />
                    </>
                  ) : (
                    <span>CHOOSE</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: BOTTOM VALUE PROPOSITION FOOTER (4 BADGES FROM REFERENCE IMAGE)
         ========================================================================= */}
      <div
        style={{
          borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          paddingTop: '14px',
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#CCCCCC' }}>
          <span style={{ fontSize: '16px' }}>🎁</span>
          <div>
            <strong style={{ color: '#D4AF37', display: 'block', fontSize: '10.5px' }}>PICK YOUR GIFTS</strong>
            <span>Build your perfect combo</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#CCCCCC' }}>
          <span style={{ fontSize: '16px' }}>🎯</span>
          <div>
            <strong style={{ color: '#D4AF37', display: 'block', fontSize: '10.5px' }}>QUALITY YOU TRUST</strong>
            <span>Premium essentials for you</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#CCCCCC' }}>
          <span style={{ fontSize: '16px' }}>🏋️</span>
          <div>
            <strong style={{ color: '#D4AF37', display: 'block', fontSize: '10.5px' }}>STAY FIT. STAY STRONG</strong>
            <span>Make every day count</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#CCCCCC' }}>
          <span style={{ fontSize: '16px' }}>⏱️</span>
          <div>
            <strong style={{ color: '#D4AF37', display: 'block', fontSize: '10.5px' }}>LIMITED TIME OFFER</strong>
            <span>Don't miss out!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
