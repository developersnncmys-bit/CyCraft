'use client';
import { Cloud, Cpu, Wifi, Link2, Search, ShieldCheck } from 'lucide-react';

const ICONS = {
  cloud: Cloud,
  cpu: Cpu,
  wifi: Wifi,
  'link-2': Link2,
  search: Search,
  'shield-check': ShieldCheck,
} as const;

type IconKey = keyof typeof ICONS;

interface SpecializationCardProps {
  title: string;
  icon: IconKey;
  index: number;
  x: number; // pixel offset from center
  y: number;
}

export function SpecializationCard({ title, icon, index, x, y }: SpecializationCardProps) {
  const Icon = ICONS[icon];

  return (
    <div
      className={`spec-card-el spec-card-${index}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        width: '136px',
        minHeight: '78px',
        padding: '0.65rem 0.7rem',
        background: 'var(--color-carbon)',
        border: '1px solid rgba(168, 240, 255, 0.1)',
        textAlign: 'center',
        zIndex: 3,
        cursor: 'default',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(168,240,255,0.4)';
        el.style.boxShadow = '0 0 30px rgba(168,240,255,0.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(168,240,255,0.1)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Refracted beam line from center — decorative */}
      <div
        className={`spec-beam-${index}`}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: Math.sqrt(x * x + y * y) - 40 + 'px',
          background:
            'linear-gradient(to bottom, var(--color-beam), transparent)',
          opacity: 0.4,
          transformOrigin: 'top center',
          transform: `rotate(${Math.atan2(y, x) * (180 / Math.PI) + 90}deg) translate(-50%, 0)`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <Icon
        size={18}
        color="var(--color-beam)"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.04em',
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
    </div>
  );
}
