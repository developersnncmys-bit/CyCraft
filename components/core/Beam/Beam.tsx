import { cn } from '@/lib/utils/cn';
import styles from './Beam.module.css';
import {
  type BeamVariant,
  type BeamIntensity,
  type BeamGeometry,
  BEAM_COLORS,
  INTENSITY_OPACITY,
  INTENSITY_BLUR,
} from './beamConfig';

interface BeamProps {
  variant?: BeamVariant;
  intensity?: BeamIntensity;
  geometry?: BeamGeometry;
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Beam({
  variant = 'cyan',
  intensity = 2,
  geometry = 'ray',
  pulse = false,
  className,
  style,
}: BeamProps) {
  const { color, glow } = BEAM_COLORS[variant];

  if (variant === 'split') {
    return (
      <>
        <div
          aria-hidden="true"
          className={cn(
            styles.beam,
            styles[`geometry-${geometry}`],
            styles['split-red'],
            pulse && styles.pulse,
            className,
          )}
          style={{
            opacity: INTENSITY_OPACITY[intensity],
            '--beam-blur': `${INTENSITY_BLUR[intensity]}px`,
            ...style,
          } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className={cn(
            styles.beam,
            styles[`geometry-${geometry}`],
            styles['split-blue'],
            pulse && styles.pulse,
            className,
          )}
          style={{
            opacity: INTENSITY_OPACITY[intensity],
            '--beam-blur': `${INTENSITY_BLUR[intensity]}px`,
            ...style,
          } as React.CSSProperties}
        />
      </>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        styles.beam,
        styles[`geometry-${geometry}`],
        pulse && styles.pulse,
        className,
      )}
      style={{
        '--beam-color': color,
        '--beam-glow': glow,
        '--beam-blur': `${INTENSITY_BLUR[intensity]}px`,
        opacity: INTENSITY_OPACITY[intensity],
        ...style,
      } as React.CSSProperties}
    />
  );
}
