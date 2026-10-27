import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'error' | 'loading';
  message: string;
  onRetry?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isLoading = toast.type === 'loading';

        let bg = '#FFFDF8';
        let border = '#D9D8CC';
        let color = '#242820';

        if (isError) {
          bg = '#FDF0EE';
          border = '#E69C90';
          color = '#C85A48';
        } else if (isSuccess) {
          bg = '#EEF4E8';
          border = '#B3C8A0';
          color = '#4F5C38';
        } else if (isLoading) {
          bg = '#F8F6EF';
          border = '#D9D8CC';
          color = '#66734A';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '14px',
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color,
              boxShadow: '0 8px 24px rgba(36, 40, 32, 0.12)',
              fontSize: '13px',
              fontWeight: 500,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              {isLoading && <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
              {isSuccess && <CheckCircle2 size={16} color="#718653" />}
              {isError && <AlertCircle size={16} color="#C85A48" />}
              <span>{toast.message}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {toast.onRetry && (
                <button
                  type="button"
                  onClick={toast.onRetry}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    color: '#4F5C38',
                    padding: '2px 6px',
                  }}
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                style={{
                  color: 'inherit',
                  opacity: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
