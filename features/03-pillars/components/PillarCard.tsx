'use client';
import { ShieldCheck, Cpu, Swords } from 'lucide-react';

const ICONS = {
  'shield-check': ShieldCheck,
  cpu: Cpu,
  swords: Swords,
} as const;

type IconKey = keyof typeof ICONS;

interface PillarCardProps {
  title: string;
  description: string;
  icon: IconKey;
  team: 'neutral' | 'split';
  isCenter?: boolean;
}

export function PillarCard({ title, description, icon, isCenter = false }: PillarCardProps) {
  const Icon = ICONS[icon];

  return (
    <div
      className={`pillar-card-el${isCenter ? ' pillar-card-center' : ''}`}
      style={{
        position: 'relative',
        padding: 'clamp(1rem, 1.8vw, 1.4rem)',
        border: '1px solid rgba(168, 240, 255, 0.1)',
        background: isCenter
          ? 'linear-gradient(135deg, rgba(168,240,255,0.06), rgba(168,240,255,0.02))'
          : 'rgba(13, 16, 20, 0.6)',
        backdropFilter: 'blur(4px)',
        opacity: 0,
        willChange: 'transform, opacity',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168, 240, 255, 0.3)';
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 0 30px rgba(168, 240, 255, 0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168, 240, 255, 0.1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Top beam rail endpoint glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--color-beam), transparent)',
          opacity: 0.5,
        }}
      />

      <div style={{ marginBottom: '0.6rem' }}>
        <Icon
          size={20}
          color="var(--color-beam)"
          strokeWidth={1.5}
          style={{ opacity: 0.9 }}
          aria-hidden="true"
        />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '0.45rem',
          lineHeight: 1.2,
          overflowWrap: 'break-word',
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
    </div>
  );
}
