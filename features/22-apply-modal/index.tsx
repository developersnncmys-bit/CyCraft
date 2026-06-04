'use client';
/* Apply Modal — Act VI, Section 22 of 22 */
import { useEffect, useRef } from 'react';
import { ApplyForm } from './components/ApplyForm';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) {
      el.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      el.close();
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        dialog[data-apply]::backdrop {
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(6px);
        }
        dialog[data-apply] {
          animation: modal-in 0.25s ease both;
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <dialog
        ref={dialogRef}
        data-apply
        onClick={handleBackdropClick}
        aria-labelledby="apply-modal-title"
        style={{
          maxWidth: '640px',
          width: '92vw',
          maxHeight: '92vh',
          background: 'var(--color-carbon)',
          border: '1px solid rgba(168,240,255,0.14)',
          padding: 0,
          color: 'var(--color-text-primary)',
          position: 'fixed',
          inset: 0,
          margin: 'auto',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(168,240,255,0.04)',
          overflow: 'auto',
        }}
      >
        {/* Top beam accent */}
        <div
          aria-hidden="true"
          style={{
            height: '2px',
            background: 'linear-gradient(to right, transparent, var(--color-beam), var(--color-beam-glow), transparent)',
          }}
        />

        <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem',
            }}
          >
            <div>
              {/* Badge */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--color-beam)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  opacity: 0.8,
                }}
              >
                // ADMISSIONS 2026–27
              </div>

              <h2
                id="apply-modal-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.4rem',
                  lineHeight: 1.1,
                }}
              >
                Apply Now
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-tertiary)',
                  margin: 0,
                }}
              >
                Start your journey into the elite world of Cybersecurity.
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close apply form"
              style={{
                background: 'rgba(168,240,255,0.05)',
                border: '1px solid rgba(168,240,255,0.1)',
                color: 'var(--color-text-tertiary)',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
                flexShrink: 0,
                marginLeft: '1rem',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.3)';
                el.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.1)';
                el.style.color = 'var(--color-text-tertiary)';
              }}
            >
              ×
            </button>
          </div>

          {/* Divider */}
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'rgba(168,240,255,0.07)',
              marginBottom: '1.75rem',
            }}
          />

          <ApplyForm onClose={onClose} />
        </div>
      </dialog>
    </>
  );
}
