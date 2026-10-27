import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);

  return (
    <div className="app-viewport-wrapper">
      {/* Desktop Helper Toolbar */}
      <div 
        style={{ 
          display: 'none', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          maxWidth: '440px', 
          marginBottom: '10px',
          padding: '0 8px'
        }}
        className="desktop-toolbar"
      >
        <span style={{ fontSize: '12px', color: '#6B7063', fontWeight: 500 }}>
          She Nourishes • Mobile Preview
        </span>
        <button
          type="button"
          onClick={() => setIsFrameEnabled(!isFrameEnabled)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#4F5C38',
            background: '#F1EEDF',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid #D9D8CC'
          }}
        >
          {isFrameEnabled ? <Smartphone size={13} /> : <Monitor size={13} />}
          <span>{isFrameEnabled ? 'Mobile Frame' : 'Full Width'}</span>
        </button>
      </div>

      <div className={isFrameEnabled ? 'mobile-frame-container' : 'mobile-frame-container full-width'}>
        <div className="mobile-content-area">
          {children}
        </div>
      </div>
    </div>
  );
};
