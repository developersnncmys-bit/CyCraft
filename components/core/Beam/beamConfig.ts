export type BeamVariant = 'cyan' | 'red' | 'blue' | 'split';
export type BeamIntensity = 0 | 1 | 2 | 3;
export type BeamGeometry = 'point' | 'line' | 'ray' | 'network' | 'highway';

export const BEAM_COLORS: Record<BeamVariant, { color: string; glow: string }> = {
  cyan:  { color: 'var(--color-beam)',      glow: 'var(--color-beam-glow)' },
  red:   { color: 'var(--color-red-team)',  glow: 'var(--color-red-team-glow)' },
  blue:  { color: 'var(--color-blue-team)', glow: 'var(--color-blue-team-glow)' },
  split: { color: 'var(--color-beam)',      glow: 'var(--color-beam-glow)' },
};

export const INTENSITY_OPACITY: Record<BeamIntensity, number> = {
  0: 0,
  1: 0.4,
  2: 0.75,
  3: 1,
};

export const INTENSITY_BLUR: Record<BeamIntensity, number> = {
  0: 0,
  1: 1,
  2: 0.5,
  3: 0.25,
};
