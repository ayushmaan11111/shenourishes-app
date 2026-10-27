import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ProteinFatRequirementFormulaView } from './ProteinFatRequirementFormulaView';
import { MacronutrientMetabolismSection } from '../nutrition/MacronutrientMetabolismSection';

interface ProteinFatRequirementFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
  initialBodyFat?: number;
  initialIntensity?: number;
  clientName?: string;
  clientId?: string;
  clientEmail?: string;
  onSaved?: () => void;
}

export const ProteinFatRequirementFormulaModal: React.FC<ProteinFatRequirementFormulaModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 70,
  initialBodyFat = 20,
  initialIntensity = 2.0,
  clientName = 'Client',
  clientId,
  clientEmail,
  onSaved,
}) => {
  const [modalView, setModalView] = useState<'blueprint' | 'quick'>('blueprint');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '94vh',
          backgroundColor: '#FFFDF8',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
          border: '1.5px solid #0A1C44',
          overflow: 'hidden',
        }}
      >
        {/* Top Modal Header */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#E8CA56',
                color: '#0A1C44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              📐
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Clinical Nutrition, Metabolism & Macro Formula Engine
              </h3>
              <span style={{ fontSize: '11px', color: '#E8CA56' }}>
                Patient: <strong>{clientName}</strong> • High-Carb Patterns, LBM Math & Auto-Classification
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Switcher */}
            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setModalView('blueprint')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: modalView === 'blueprint' ? '#E8CA56' : 'transparent',
                  color: modalView === 'blueprint' ? '#0A1C44' : '#FFFFFF',
                }}
              >
                Full Metabolism Blueprint
              </button>
              <button
                type="button"
                onClick={() => setModalView('quick')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: modalView === 'quick' ? '#E8CA56' : 'transparent',
                  color: modalView === 'quick' ? '#0A1C44' : '#FFFFFF',
                }}
              >
                Quick Formula Cards
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto' }}>
          {modalView === 'blueprint' ? (
            <MacronutrientMetabolismSection
              clientId={clientId}
              clientEmail={clientEmail}
              clientName={clientName}
              initialWeight={initialWeight}
              initialBodyFat={initialBodyFat}
              initialIntensity={initialIntensity}
              onSavePreferences={() => {
                if (onSaved) onSaved();
              }}
            />
          ) : (
            <ProteinFatRequirementFormulaView
              initialWeight={initialWeight}
              initialBodyFat={initialBodyFat}
              initialIntensity={initialIntensity}
              clientName={clientName}
              isEditable={true}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#FAF8F0',
            borderTop: '1px solid #D9D8CC',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button type="button" onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '12.5px' }}>
            Done & Close Engine
          </button>
        </div>
      </div>
    </div>
  );
};
