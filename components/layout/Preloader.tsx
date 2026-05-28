'use client';
/* Preloader — "First Light" boot sequence
 * Horizontal beam streaks across the viewport, CYCRAFT title fades in
 * through the beam, then SECURING SESSION reveals letter-by-letter. */
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/register';

const STATUS_LABEL = 'SECURING SESSION';

export function Preloader() {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const beamRef     = useRef<HTMLDivElement>(null);
  const beamCoreRef = useRef<HTMLDivElement>(null);
  const sparkRef    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const statusRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          onComplete() { wrap.style.display = 'none'; },
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
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
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.1rem',
          padding: '0 2rem',
          marginTop: '3rem', /* sit clearly below the beam line */
        }}
      >
        {/* CYCRAFT — display title */}
        <div
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
            fontWeight: 500,
            letterSpacing: '0.16em',
            lineHeight: 1,
            display: 'flex',
            color: '#a6b4bc',
            textShadow: '0 0 18px rgba(168,200,210,0.12)',
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
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--color-beam-glow)',
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            opacity: 0.85,
            display: 'flex',
            paddingLeft: '0.55em', /* compensate for trailing letter-spacing */
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
