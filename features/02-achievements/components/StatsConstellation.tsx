'use client';
import { StatWaypoint } from './StatWaypoint';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import type { achievementsContent } from '@/content/achievements';

type Stat = (typeof achievementsContent.stats)[number];
interface StatsConstellationProps { stats: readonly Stat[] }

export function StatsConstellation({ stats }: StatsConstellationProps) {
  const isTablet = useMediaQuery('(min-width: 640px)');

  return (
    <div
      style={{
        position: 'relative', zIndex: 3,
        marginTop: 'clamp(3rem, 7vh, 5rem)',
        paddingInline: 'var(--section-padding)',
        paddingBottom: 'clamp(4rem, 8vh, 6rem)',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'grid',
          /* 4-col on tablet+, 2-col on mobile */
          gridTemplateColumns: isTablet ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          gap: 0,
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              position: 'relative',
              textAlign: 'center',
              padding: 'clamp(1.25rem, 3vw, 2rem) 1rem',
              borderLeft: i % (isTablet ? 4 : 2) !== 0 ? '1px solid rgba(168,240,255,0.08)' : 'none',
              borderBottom: !isTablet && i < 2 ? '1px solid rgba(168,240,255,0.08)' : 'none',
            }}
          >
            <StatWaypoint value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
