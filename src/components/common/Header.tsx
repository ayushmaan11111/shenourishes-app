import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  stepCurrent?: number;
  stepTotal?: number;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBrand?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  stepCurrent,
  stepTotal = 8,
  onBack,
  rightAction,
  showBrand = false,
}) => {
  return (
    <header className="top-nav-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
            aria-label="Go back"
          >
            <ArrowLeft size={20} color="#242820" />
          </button>
        )}

        {showBrand && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: '#66734A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFDF8',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <span className="font-serif" style={{ fontSize: '16px', fontWeight: 600, color: '#242820' }}>
                She Nourishes
              </span>
            </div>
          </div>
        )}

        {!showBrand && title && (
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#242820' }}>{title}</h1>
            {subtitle && <p style={{ fontSize: '12px', color: '#6B7063' }}>{subtitle}</p>}
          </div>
        )}
      </div>

      <div>
        {stepCurrent !== undefined && stepTotal !== undefined ? (
          <div className="badge-olive">
            Step {stepCurrent} of {stepTotal}
          </div>
        ) : (
          rightAction
        )}
      </div>
    </header>
  );
};
