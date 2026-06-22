'use client';
/* Learning Partners — Act V, slotted between Comparison (14) and
 * Hiring Tournaments (15). Mirrors the SectionWrapper + film-camera +
 * useFilmReveal pattern used across other btech sections so the pin/
 * scrub cinema continues uninterrupted.
 *
 * Renders four partner tiles in a 2×2 grid (1-col on phones). When a
 * partner's `logo` file exists at /public<logo>, the <Image> shows;
 * otherwise an inline error handler hides the broken image and the
 * text fallback (institute short name) takes its place — so dropping
 * real PNGs into /public/images/learning-partners/ later requires
 * no code changes.
 */
import Image from 'next/image';
import { useRef, useState } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { learningPartnersContent } from '@/content/learning-partners';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function LearningPartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=160%' });

  return (
    <SectionWrapper ref={sectionRef} id="learning-partners" act={5}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(168,240,255,0.12), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(140,80,255,0.05), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.02) 6px, rgba(168,240,255,0.02) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera lp-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(4rem, 7vh, 5.5rem)',
            paddingBottom: 'clamp(3rem, 6vh, 5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
        {/* Header */}
        <div
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}
        >
          <div className="film-fade lp-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
            <Badge label={learningPartnersContent.badge} />
          </div>
          <h2
            className="film-fade lp-heading-el"
            data-at="0.10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1rem 0 0.75rem',
              lineHeight: 1.1,
            }}
          >
            {learningPartnersContent.heading}
          </h2>
          <p
            className="film-fade lp-desc-el"
            data-at="0.15"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            {learningPartnersContent.description}
          </p>
        </div>

        {/* Partner grid */}
        <div
          className="section-container film-fade lp-grid-el"
          data-at="0.25"
          data-dur="0.20"
        >
          <style>{`
            .lp-grid {
              list-style: none;
              padding: 0;
              margin: 0 auto;
              max-width: 980px;
              display: grid;
              gap: clamp(0.85rem, 1.6vw, 1.25rem);
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            @media (max-width: 900px) {
              .lp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            @media (max-width: 480px) {
              .lp-grid { grid-template-columns: 1fr; }
            }
          `}</style>
          <ul className="lp-grid" role="list" aria-label="Learning partners">
            {learningPartnersContent.partners.map((partner) => (
              <PartnerTile key={partner.id} partner={partner} />
            ))}
          </ul>
        </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

interface PartnerTileProps {
  partner: {
    readonly id: string;
    readonly name: string;
    readonly fullName: string;
    readonly logo?: string;
  };
}

function PartnerTile({ partner }: PartnerTileProps) {
  // When the logo file doesn't exist, Next/Image fires onError and we
  // swap to the text fallback. Keeps both modes (logo present /
  // logo missing) working without code changes.
  const [logoBroken, setLogoBroken] = useState(false);
  const showLogo = Boolean(partner.logo) && !logoBroken;

  return (
    <li
      role="listitem"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: 'clamp(1rem, 1.5vw, 1.25rem)',
        background: 'rgba(13,16,20,0.65)',
        border: '1px solid rgba(168,240,255,0.18)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* HUD corner brackets — matches operator-profile / course-detail aesthetic */}
      <LpCornerBracket position="tl" />
      <LpCornerBracket position="tr" />
      <LpCornerBracket position="bl" />
      <LpCornerBracket position="br" />

      {/* Light logo pane — academic crests are designed for paper, so they
          stay on a near-white surface; the surrounding dark tile carries
          the page's cinematic chrome. */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(110px, 14vh, 140px)',
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid rgba(168,240,255,0.10)',
        }}
      >
        {showLogo ? (
          <Image
            src={partner.logo!}
            alt={partner.fullName}
            fill
            sizes="(max-width: 600px) 80vw, 220px"
            style={{ objectFit: 'contain', padding: '0.85rem 1rem' }}
            onError={() => setLogoBroken(true)}
          />
        ) : (
          <span
            aria-label={partner.fullName}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.05rem, 2vw, 1.4rem)',
              fontWeight: 700,
              color: 'var(--color-void)',
              letterSpacing: '0.02em',
              textAlign: 'center',
              padding: '0.5rem',
            }}
          >
            {partner.name}
          </span>
        )}
      </div>

      {/* Mono caps label — matches the page's HUD label treatment */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-beam)',
          textAlign: 'center',
        }}
      >
        {partner.name}
      </span>
    </li>
  );
}

function LpCornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const SIZE = 12;
  const off = -1;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    borderColor: 'var(--color-beam)',
    borderStyle: 'solid',
    pointerEvents: 'none',
  };
  if (position === 'tl') {
    return <span aria-hidden="true" style={{ ...base, top: off, left: off, borderWidth: '2px 0 0 2px' }} />;
  }
  if (position === 'tr') {
    return <span aria-hidden="true" style={{ ...base, top: off, right: off, borderWidth: '2px 2px 0 0' }} />;
  }
  if (position === 'bl') {
    return <span aria-hidden="true" style={{ ...base, bottom: off, left: off, borderWidth: '0 0 2px 2px' }} />;
  }
  return <span aria-hidden="true" style={{ ...base, bottom: off, right: off, borderWidth: '0 2px 2px 0' }} />;
}
