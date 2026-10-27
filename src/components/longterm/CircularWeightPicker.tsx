import React, { useRef, useState } from 'react';
import { Scale, Minus, Plus } from 'lucide-react';

interface CircularWeightPickerProps {
  value: number; // in kg (e.g. 65.5)
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  subtitle?: string;
}

export const CircularWeightPicker: React.FC<CircularWeightPickerProps> = ({
  value,
  onChange,
  min = 35,
  max = 160,
  label = 'Body Weight',
  subtitle = 'Drag dial or tap controls to adjust',
}) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Map value to angle (-135deg to +135deg = 270deg total sweep)
  const sweepAngle = 270;
  const startAngle = -135;
  const normalizedFraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const currentAngle = startAngle + normalizedFraction * sweepAngle;

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    let angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI + 90; // 0deg at top

    if (angleDeg < -180) angleDeg += 360;
    if (angleDeg > 180) angleDeg -= 360;

    // Constrain to [-135, 135]
    const clamped = Math.max(startAngle, Math.min(startAngle + sweepAngle, angleDeg));
    const fraction = (clamped - startAngle) / sweepAngle;
    const computedWeight = Math.round((min + fraction * (max - min)) * 2) / 2; // 0.5 kg precision
    onChange(computedWeight);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Step adjusters
  const increment = (delta: number) => {
    const next = Math.max(min, Math.min(max, Math.round((value + delta) * 2) / 2));
    onChange(next);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #0A1C44',
        boxShadow: '0 4px 16px rgba(10, 28, 68, 0.08)',
        userSelect: 'none',
      }}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#66734A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Scale size={14} />
          <span>{label}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#6B7063', marginTop: '2px' }}>{subtitle}</div>
      </div>

      {/* Circular Rotating Scale Dial */}
      <div
        ref={dialRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          backgroundColor: '#FAF8F0',
          border: '8px solid #0A1C44',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(10, 28, 68, 0.15)',
          touchAction: 'none',
        }}
      >
        {/* Outer Circular Scale Ticks */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 25 }).map((_, i) => {
            const tickAngle = startAngle + (i / 24) * sweepAngle;
            const rad = (tickAngle - 90) * (Math.PI / 180);
            const r1 = 82;
            const r2 = i % 4 === 0 ? 68 : 74;
            const x1 = 100 + r1 * Math.cos(rad);
            const y1 = 100 + r1 * Math.sin(rad);
            const x2 = 100 + r2 * Math.cos(rad);
            const y2 = 100 + r2 * Math.sin(rad);
            const isMajor = i % 4 === 0;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? '#0A1C44' : '#66734A'}
                strokeWidth={isMajor ? 2.5 : 1.5}
                opacity={isMajor ? 0.9 : 0.4}
              />
            );
          })}
        </svg>

        {/* Needle Indicator */}
        <div
          style={{
            position: 'absolute',
            width: '4px',
            height: '80px',
            backgroundColor: '#C85A48',
            borderRadius: '2px',
            top: '25px',
            left: 'calc(50% - 2px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${currentAngle}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            boxShadow: '0 2px 6px rgba(200, 90, 72, 0.5)',
            pointerEvents: 'none',
          }}
        />

        {/* Center Digital Display Hub */}
        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            border: '2px solid #E8CA56',
          }}
        >
          <span style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
            {value.toFixed(1)}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#E8CA56', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            KG
          </span>
        </div>
      </div>

      {/* Quick Fine-Tuning Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => increment(-1)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: '#FAF8F0',
            border: '1.5px solid #D9D8CC',
            color: '#0A1C44',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Minus size={14} /> 1 kg
        </button>

        <button
          type="button"
          onClick={() => increment(-0.5)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: '#FAF8F0',
            border: '1.5px solid #D9D8CC',
            color: '#0A1C44',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          -0.5
        </button>

        <button
          type="button"
          onClick={() => increment(0.5)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: '#FAF8F0',
            border: '1.5px solid #D9D8CC',
            color: '#0A1C44',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          +0.5
        </button>

        <button
          type="button"
          onClick={() => increment(1)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: '#FAF8F0',
            border: '1.5px solid #D9D8CC',
            color: '#0A1C44',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Plus size={14} /> 1 kg
        </button>
      </div>
    </div>
  );
};
