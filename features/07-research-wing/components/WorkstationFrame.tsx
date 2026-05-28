'use client';
/* CSS 3D-tilted Linux workstation terminal.
 * GSAP target: .workstation-frame-el (rotateY: -15 → 0 on scroll) */
import { StreamingTerminalOutput } from './StreamingTerminalOutput';
import type { researchWingContent } from '@/content/research-wing';

interface WorkstationFrameProps {
  data: typeof researchWingContent.workstation;
  streamingLines: typeof researchWingContent.streamingLines;
}

const DOT_COLORS = ['#ff5f56', '#ffbd2e', '#27c93f'] as const;

export function WorkstationFrame({ data, streamingLines }: WorkstationFrameProps) {
  return (
    <div style={{ perspective: '1000px', width: '100%' }}>
      <div
        className="workstation-frame-el"
        style={{
          border: '1px solid rgba(0, 255, 148, 0.15)',
          background: '#0a0c0f',
          boxShadow:
            '0 0 60px rgba(0, 255, 148, 0.04), -20px 20px 60px rgba(0,0,0,0.6)',
          transform: 'rotateY(-15deg)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderBottom: '1px solid rgba(0,255,148,0.08)',
            background: 'rgba(0,255,148,0.02)',
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
              color: 'rgba(0,255,148,0.4)',
              marginLeft: '8px',
            }}
          >
            root@kali — bash — 120×40
          </span>
        </div>

        {/* Terminal body */}
        <div style={{ padding: '1rem 1.25rem', minHeight: '220px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgba(0,255,148,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            root@kali:~#
          </div>
          <StreamingTerminalOutput lines={streamingLines} />
        </div>
      </div>

      {/* Feature list beneath frame */}
      <ul
        style={{
          listStyle: 'none',
          padding: '1.25rem 0 0',
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
        aria-label={`${data.heading} features`}
      >
        {data.features.map((f) => (
          <li
            key={f}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.08em',
              paddingLeft: '1em',
              position: 'relative',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                color: 'var(--color-terminal)',
              }}
            >
              ▸
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
