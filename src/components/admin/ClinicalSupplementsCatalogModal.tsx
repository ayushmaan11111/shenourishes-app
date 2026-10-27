import React, { useState } from 'react';
import { X, Pill } from 'lucide-react';
import { CLINICAL_SUPPLEMENTS_CATALOG } from '../../services/clinicalSupplementsCatalog';

interface ClinicalSupplementsCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalSupplementsCatalogModal: React.FC<ClinicalSupplementsCatalogModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = [
    'ALL',
    'Bone Health',
    'Antioxidants',
    'Insulin Mimicker',
    'Anti-Inflammatory',
    'Amino Acids',
    'Ergogenic Aids',
  ];

  const filteredSupplements = selectedCategory === 'ALL'
    ? CLINICAL_SUPPLEMENTS_CATALOG
    : CLINICAL_SUPPLEMENTS_CATALOG.filter((s) => s.category === selectedCategory);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '920px',
          height: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '2px solid #0A1C44',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header Banner (Navy & Gold) */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #E8CA56',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#E8CA56',
                color: '#0A1C44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              <Pill size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                SCHOOL OF FITNESS SCIENCES • CLINICAL REFERENCE
              </span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Suggested Supplemented Stacks (16 Clinical Protocols)
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
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Pill Filters */}
        <div style={{ padding: '12px 18px', backgroundColor: '#F8F6EF', borderBottom: '1px solid #D9D8CC', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: selectedCategory === cat ? '#0A1C44' : '#FFFFFF',
                color: selectedCategory === cat ? '#E8CA56' : '#4F5C38',
                border: selectedCategory === cat ? '1.5px solid #0A1C44' : '1px solid #D9D8CC',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scrollable Supplement Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#FAF8F0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {filteredSupplements.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1.5px solid #D9D8CC',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#66734A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      #{item.srNo} • {item.category}
                    </span>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0A1C44', margin: '2px 0 0' }}>
                      {item.name}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#EEF4E8',
                      color: '#38571A',
                    }}
                  >
                    {item.timingCategory}
                  </span>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: '#FAF8F0', borderRadius: '6px', border: '1px solid #ECEAE0', fontSize: '11.5px', color: '#242820' }}>
                  <div style={{ fontWeight: 700, color: '#0A1C44' }}>Dosage & Timing:</div>
                  <div style={{ marginTop: '2px', lineHeight: 1.35 }}>{item.dosageAndTime}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7063' }}>
                  <span><strong>Form:</strong> {item.bestBioavailableForm}</span>
                </div>

                <div style={{ fontSize: '11px', color: '#4F5C38', fontStyle: 'italic', lineHeight: 1.3 }}>
                  💡 {item.clinicalPurpose}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', backgroundColor: '#FFFFFF', borderTop: '1px solid #D9D8CC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: '#6B7063' }}>
            All 16 clinical supplement stacks are accessible directly inside the Diet Chart Editor.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
