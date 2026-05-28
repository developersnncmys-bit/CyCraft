/* Individual code window in the 3D stack.
 * Receives z-index and position offset from ProjectStack. */
interface CodeWindowProps {
  title: string;
  language: string;
  code: string;
  stackIndex: number; // 0=front 1=mid 2=back
}

const LANG_COLORS: Record<string, string> = {
  'C++': 'var(--color-red-team)',
  Python: 'var(--color-blue-team)',
  Bash: 'var(--color-terminal)',
};

const DOT_COLORS = ['#ff5f56', '#ffbd2e', '#27c93f'] as const;

// Deterministic per-token coloring for a basic syntax feel
function colorizeCode(code: string, lang: string): React.ReactNode[] {
  const keywords: Record<string, string[]> = {
    'C++': ['#include', 'BOOL', 'HANDLE', 'LPCSTR', 'HCRYPTPROV', 'return', 'void'],
    Python: ['import', 'from', 'class', 'def', 'self', 'return', 'for', 'in'],
    Bash: ['#!/bin/bash', 'local', 'echo', 'if', 'fi', 'then', 'function'],
  };
  const accent = LANG_COLORS[lang] ?? 'var(--color-beam)';
  const kws = new Set(keywords[lang] ?? []);

  return code.split('\n').map((line, i) => (
    <div key={i} style={{ minHeight: '1.4em' }}>
      {line.split(/(\s+)/).map((token, j) =>
        kws.has(token.trim()) ? (
          <span key={j} style={{ color: accent }}>
            {token}
          </span>
        ) : token.startsWith('#') || token.startsWith('//') ? (
          <span key={j} style={{ color: 'var(--color-text-disabled)', fontStyle: 'italic' }}>
            {token}
          </span>
        ) : /^".*"$|^'.*'$/.test(token.trim()) ? (
          <span key={j} style={{ color: 'var(--color-terminal-dim)' }}>
            {token}
          </span>
        ) : (
          token
        ),
      )}
    </div>
  ));
}

export function CodeWindow({ title, language, code, stackIndex }: CodeWindowProps) {
  const Z_OFFSETS = [0, -180, -360] as const;
  const X_OFFSETS = [0, 30, 60] as const;
  const Y_OFFSETS = [0, 20, 40] as const;
  const OPACITIES = [1, 0.65, 0.35] as const;

  return (
    <div
      className={`code-window-el code-window-${stackIndex}`}
      data-stack-index={stackIndex}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'var(--color-carbon)',
        border: '1px solid rgba(168, 240, 255, 0.1)',
        transform: `translateZ(${Z_OFFSETS[stackIndex]}px) translateX(${X_OFFSETS[stackIndex]}px) translateY(${Y_OFFSETS[stackIndex]}px)`,
        opacity: OPACITIES[stackIndex],
        willChange: 'transform, opacity',
        boxShadow: stackIndex === 0
          ? '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(168,240,255,0.04)'
          : 'none',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderBottom: '1px solid rgba(168,240,255,0.06)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        {DOT_COLORS.map((c) => (
          <div
            key={c}
            aria-hidden="true"
            style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }}
          />
        ))}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-disabled)',
            marginLeft: '8px',
          }}
        >
          {title}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: LANG_COLORS[language] ?? 'var(--color-beam)',
            opacity: 0.7,
          }}
        >
          {language}
        </span>
      </div>

      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: '1rem 1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
          overflow: 'hidden',
          maxHeight: '260px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        <code>{colorizeCode(code, language)}</code>
      </pre>

      {/* Cursor blink — only on front window */}
      {stackIndex === 0 && (
        <div
          aria-hidden="true"
          style={{
            padding: '0 1.25rem 0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-terminal)',
          }}
        >
          <span style={{ animation: 'cursor-blink 1s step-end infinite' }}>▊</span>
        </div>
      )}
    </div>
  );
}
