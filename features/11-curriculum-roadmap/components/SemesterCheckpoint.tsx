import { SubjectChip } from './SubjectChip';
import type { curriculumContent } from '@/content/curriculum';

type Semester = (typeof curriculumContent.semesters)[number];

interface SemesterCheckpointProps {
  semester: Semester;
  isYearStart: boolean;
}

const PHASE_COLOR: Record<string, string> = {
  Foundation: 'var(--color-beam)',
  'Offensive Core': 'var(--color-red-team)',
  'Hardware & Web3': 'var(--color-blue-team)',
  'High-Orbit Ops': 'var(--color-terminal)',
};

export function SemesterCheckpoint({ semester, isYearStart }: SemesterCheckpointProps) {
  const phaseColor = PHASE_COLOR[semester.phase] ?? 'var(--color-beam)';

  return (
    <div className="semester-checkpoint-el">
      {/* Year marker (only at start of each year) */}
      {isYearStart && (
        <div
          className="year-marker-el"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.2em',
            color: phaseColor,
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          ── Year {semester.year} · {semester.phase}
        </div>
      )}

      {/* Checkpoint header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem',
        }}
      >
        {/* Glowing dot */}
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: phaseColor,
            boxShadow: `0 0 8px ${phaseColor}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-primary)',
            fontWeight: 700,
          }}
        >
          {semester.label}
        </span>
      </div>

      {/* Subject chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingLeft: '1.25rem' }}>
        {semester.subjects.map((subj) => (
          <SubjectChip key={subj} label={subj} />
        ))}
      </div>
    </div>
  );
}
