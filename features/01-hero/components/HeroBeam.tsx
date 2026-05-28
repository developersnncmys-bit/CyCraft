import { Beam } from '@/components/core/Beam/Beam';

/* wrapper div is the GSAP target for the scroll-scrub "fire" animation */
export function HeroBeam() {
  return (
    <div
      className="hero-beam-el"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 'calc(50% - 1px)',
        height: '100%',
        zIndex: 4,
        // Fade the beam down so it's less distracting. Uses filter (not opacity)
        // so the GSAP opacity fade-in and the CSS pulse animation stay intact.
        filter: 'opacity(0.4)',
        willChange: 'transform, opacity',
      }}
    >
      <Beam variant="cyan" intensity={2} geometry="ray" pulse />
    </div>
  );
}
