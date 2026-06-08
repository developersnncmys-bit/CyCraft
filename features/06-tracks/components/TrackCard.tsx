'use client';
import { Target, Cloud, Bug, Cpu } from 'lucide-react';

const ICONS = { target: Target, cloud: Cloud, bug: Bug, cpu: Cpu } as const;
type IconKey = keyof typeof ICONS;

interface TrackCardProps {
  title: string;
  description: string;
  icon: IconKey;
  team: 'red' | 'blue';
  index: number;
}

const TEAM_COLORS = {
  red: {
    border: 'rgba(255, 61, 90, 0.2)',
    accent: 'var(--color-red-team)',
    glow: 'rgba(255, 61, 90, 0.06)',
    hoverBorder: 'rgba(255, 61, 90, 0.5)',
  },
  blue: {
    border: 'rgba(61, 168, 255, 0.2)',
    accent: 'var(--color-blue-team)',
    glow: 'rgba(61, 168, 255, 0.06)',
    hoverBorder: 'rgba(61, 168, 255, 0.5)',
  },
};

export function TrackCard({ title, description, icon, team, index }: TrackCardProps) {
  const Icon = ICONS[icon];
  const colors = TEAM_COLORS[team];

  return (
    <div
      className={`track-card-el track-card-${index}`}
      data-team={team}
      style={{
        padding: 'clamp(1rem, 1.8vw, 1.4rem)',
        border: `1px solid ${colors.border}`,
        background: `radial-gradient(ellipse at top, ${colors.glow}, transparent 70%), var(--color-carbon)`,
        willChange: 'transform, opacity',
        cursor: 'default',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = colors.hoverBorder;
        el.style.boxShadow = `0 0 40px ${colors.glow}`;
        el.style.transform = 'translateY(-8px) translateZ(20px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = colors.border;
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
      }}
    >
      {/* Team indicator top line */}
      <div
        aria-hidden="true"
        style={{
          height: '2px',
          background: `linear-gradient(to right, ${colors.accent}, transparent)`,
          marginBottom: '0.85rem',
          opacity: 0.6,
        }}
      />

      <Icon
        size={20}
        color={colors.accent}
        strokeWidth={1.5}
        aria-hidden="true"
        style={{ marginBottom: '0.6rem' }}
      />

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '0.45rem',
          lineHeight: 1.2,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.45,
          margin: 0,
        }}
      >
        {description}
      </p>

      {/* Team badge */}
      <div
        style={{
          marginTop: '0.85rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: colors.accent,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        {team === 'red' ? '// RED_TEAM' : '// BLUE_TEAM'}
      </div>
    </div>
  );
}
