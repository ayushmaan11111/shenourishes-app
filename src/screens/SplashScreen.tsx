import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // If already seen in this session, finish immediately
    const seen = sessionStorage.getItem('she_nourishes_splash_seen');
    if (seen) {
      onFinish();
      return;
    }

    sessionStorage.setItem('she_nourishes_splash_seen', 'true');
    const t1 = setTimeout(() => setOpacity(1), 50);
    const t2 = setTimeout(() => {
      setOpacity(0);
      setTimeout(onFinish, 250);
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#F8F6EF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        opacity,
        transition: 'opacity 0.4s ease-in-out',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '24px',
          backgroundColor: '#66734A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFDF8',
          boxShadow: '0 12px 30px rgba(102, 115, 74, 0.28)',
          marginBottom: '28px',
        }}
      >
        <Sparkles size={38} strokeWidth={1.8} />
      </div>

      <h1
        className="font-serif"
        style={{
          fontSize: '34px',
          fontWeight: 600,
          color: '#242820',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        She Nourishes
      </h1>

      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#66734A',
          textAlign: 'center',
        }}
      >
        Nutrition • Lifestyle • Wellness
      </p>
    </div>
  );
};
