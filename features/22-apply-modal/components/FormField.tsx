import type { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}

export function FormField({ label, error, children, required, hint }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: error ? 'var(--color-red-team)' : 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: 'var(--color-beam)', opacity: 0.7 }}>*</span>
        )}
      </label>

      {children}

      {error && (
        <span
          role="alert"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-red-team)',
            letterSpacing: '0.06em',
          }}
        >
          ↳ {error.message}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-disabled)', letterSpacing: '0.04em' }}>
          {hint}
        </span>
      )}
    </div>
  );
}

/* Shared input/select/textarea style — import and use directly */
export const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-primary)',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(168,240,255,0.12)',
  borderRadius: '2px',
  padding: '0.75rem 1rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  WebkitAppearance: 'none',
};

/* Inject focus glow once globally */
export const inputFocusCSS = `
  .apply-input:focus {
    border-color: rgba(168,240,255,0.45) !important;
    background: rgba(168,240,255,0.05) !important;
    box-shadow: 0 0 0 3px rgba(168,240,255,0.07);
  }
  .apply-input::placeholder { color: rgba(255,255,255,0.2); }
  .apply-input option { background: #0d1014; color: #fff; }
`;
