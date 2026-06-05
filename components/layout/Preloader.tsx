'use client';
/* Preloader — "First Light" boot sequence
 * Horizontal beam streaks across the viewport, CYCRAFT title fades in
 * through the beam, then SECURING SESSION reveals letter-by-letter.
 *
 * Played-once latch: the boot sequence fires when the JS bundle is
 * freshly loaded (real page reload / first visit), not on client-side
 * navigations. A module-level flag survives across navigations (App
 * Router keeps the module evaluated) but resets on hard reload (module
 * is re-evaluated). That's exactly the desired behaviour.
 */
import { memo, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap/register';

const STATUS_LABEL = 'SECURING SESSION';

let hasPlayed = false;

function PreloaderImpl() {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const beamRef     = useRef<HTMLDivElement>(null);
  const beamCoreRef = useRef<HTMLDivElement>(null);
  const sparkRef    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const statusRef   = useRef<HTMLDivElement>(null);
  // `done` drives the wrapper's display via React. We can't poke
  // `wrap.style.display = 'none'` imperatively and trust it to stick —
  // any reconciliation of the layout would re-apply the style prop
  // and bring the wrapper back. Using state means React owns the
  // hidden bit and the prop matches it on every reconciliation.
  const [done, setDone] = useState(hasPlayed);

  useEffect(() => {
    if (hasPlayed) return;

    const wrap   = wrapRef.current;
    const beam   = beamRef.current;
    const core   = beamCoreRef.current;
    const spark  = sparkRef.current;
    const title  = titleRef.current;
    const status = statusRef.current;
    if (!wrap || !beam || !core || !spark || !title || !status) return;

    const titleLetters  = title.querySelectorAll<HTMLSpanElement>('[data-l]');
    const statusLetters = status.querySelectorAll<HTMLSpanElement>('[data-l]');

    // Initial states — set instantly before timeline plays
    gsap.set(beam,   { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(core,   { opacity: 0 });
    gsap.set(spark,  { opacity: 0, x: 0 });
    gsap.set(titleLetters,  { opacity: 0, y: 14 });
    gsap.set(statusLetters, { opacity: 0, y: 6 });

    const tl = gsap.timeline({ delay: 0.15 });

    // 1) Spark streaks left → right (GPU transform), beam scales in behind it
    tl.to(spark, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
      .fromTo(
        spark,
        { x: 0 },
        {
          x: () => spark.parentElement?.offsetWidth ?? window.innerWidth,
          duration: 1.1,
          ease: 'power3.inOut',
        },
        0
      )
      .to(beam, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to(spark, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.0)

      // 2) Central glow ignites (opacity only — avoids re-rasterizing the blur)
      .to(core, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.85)

      // 3) CYCRAFT letters resolve through the beam (transform + opacity only)
      .to(
        titleLetters,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.05,
        },
        1.0
      )

      // 4) Status caption — letter-by-letter
      .to(
        statusLetters,
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.04 },
        1.6
      )

      // 5) Hold, then exit
      .to({}, { duration: 0.35 })
      .to(
        [title, status],
        { opacity: 0, y: -8, duration: 0.5, ease: 'power2.in' },
        '>'
      )
      .to(core, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .to(beam, { scaleX: 0, duration: 0.5, ease: 'power3.in' }, '<0.05')
      .to(
        wrap,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete() {
            // Latch first so any racing re-mount immediately short-circuits,
            // then flip the React-owned `done` flag to hide the wrapper.
            hasPlayed = true;
            setDone(true);
          },
        },
        '>-0.1'
      );

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-label="Loading CyCraft"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--color-void)',
        // React-owned hide so reconciliation can't bring the preloader
        // back after the first play.
        display: done ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Mobile preloader — tighten letter-spacing on narrow viewports
           so 'SECURING SESSION' doesn't overflow with its 0.55em tracking.
           At 390px (iPhone 12 Pro) the original tracking pushed the
           caption past the screen edges and broke the centered layout. */
        @media (max-width: 480px) {
          .preloader-title {
            letter-spacing: 0.1em !important;
            font-size: clamp(1.5rem, 7vw, 2.25rem) !important;
          }
          .preloader-status {
            letter-spacing: 0.3em !important;
            font-size: 0.62rem !important;
            padding-left: 0.3em !important;
          }
          .preloader-stack {
            padding: 0 1rem !important;
            margin-top: 2rem !important;
          }
        }
      `}</style>
      {/* Vignette — pulls focus toward the beam */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(77,217,255,0.06) 0%, transparent 45%), radial-gradient(ellipse at center, transparent 40%, var(--color-void) 95%)',
          pointerEvents: 'none',
        }}
      />

      {/* Beam track — rotated wrapper; GSAP animates children without touching rotation */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '4px',
          transform: 'translateY(-2px) rotate(-1.2deg)',
          pointerEvents: 'none',
        }}
      >
        {/* Beam line — horizontal glowing ray */}
        <div
          ref={beamRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            marginTop: '-0.5px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(77,217,255,0.4) 25%, rgba(168,240,255,0.95) 50%, rgba(77,217,255,0.4) 75%, transparent 100%)',
            boxShadow:
              '0 0 8px rgba(77,217,255,0.6), 0 0 24px rgba(77,217,255,0.35)',
            transform: 'scaleX(0)',
            transformOrigin: '0% 50%',
            willChange: 'transform',
          }}
        />

        {/* Streaking spark — rides along the beam during ignition */}
        <div
          ref={sparkRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '0%',
            width: '140px',
            height: '4px',
            marginTop: '-2px',
            marginLeft: '-70px',
            background:
              'radial-gradient(ellipse 50% 50% at center, var(--color-beam-core) 0%, var(--color-beam) 35%, transparent 75%)',
            boxShadow:
              '0 0 20px var(--color-beam-core), 0 0 40px var(--color-beam-glow)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />
      </div>

      {/* Central core glow — soft halo where the beam meets the title */}
      <div
        ref={beamCoreRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '55vw',
          maxWidth: '820px',
          height: '260px',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(ellipse 50% 50% at center, rgba(77,217,255,0.18) 0%, rgba(77,217,255,0.06) 35%, transparent 72%)',
          filter: 'blur(10px)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Center content stack */}
      <div
        className="preloader-stack"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.1rem',
          padding: '0 2rem',
          marginTop: '3rem', /* sit clearly below the beam line */
          maxWidth: '100%',
          minWidth: 0,
        }}
      >
        {/* CYCRAFT — display title */}
        <div
          ref={titleRef}
          className="preloader-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
            fontWeight: 500,
            letterSpacing: '0.16em',
            lineHeight: 1,
            display: 'flex',
            color: '#a6b4bc',
            textShadow: '0 0 18px rgba(168,200,210,0.12)',
            minWidth: 0,
          }}
        >
          {'CYCRAFT'.split('').map((ch, i) => (
            <span
              key={i}
              data-l
              style={{
                display: 'inline-block',
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* SECURING SESSION — caption */}
        <div
          ref={statusRef}
          className="preloader-status"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--color-beam-glow)',
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            opacity: 0.85,
            display: 'flex',
            paddingLeft: '0.55em', /* compensate for trailing letter-spacing */
            minWidth: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {STATUS_LABEL.split('').map((ch, i) => (
            <span
              key={i}
              data-l
              style={{
                display: 'inline-block',
                width: ch === ' ' ? '0.4em' : 'auto',
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// memo() so any incidental re-render of the parent (e.g. a sibling client
// component updating during navigation) does not propagate through to the
// Preloader and re-apply its style prop. The Preloader takes no props,
// so memo is effectively a "never re-render after first paint" guard.
export const Preloader = memo(PreloaderImpl);
