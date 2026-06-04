'use client';
/* Gallery Events — pinned cinematic walk through 9 event cards.
 *
 * Each card uses a placeholder gradient (no real images — swap once the
 * Admin Panel ships media uploads per PRD §3.9). Gradients cycle through
 * a 5-tone palette so adjacent cards never share a tint.
 *
 * 400% pin. Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.78  9 cards cascade in over ~6% each
 *   0.85–1.00  Camera dollies in 4%
 *
 * Mobile: standard scroll-trigger entry per card.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  galleryEventsContent,
  galleryCardTones,
  type GalleryEvent,
} from '@/content/gallery/events';

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

function EventCard({
  event,
  toneIndex,
}: {
  event: GalleryEvent;
  toneIndex: number;
}) {
  const tone = galleryCardTones[toneIndex % galleryCardTones.length];
  // Pull the first letter of each significant word for the placeholder
  // glyph — gives each card a distinct "watermark" without an image.
  const glyph = event.title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <article
      className="gallery-event-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(13,16,20,0.4)',
        border: '1px solid rgba(168,240,255,0.1)',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        willChange: 'transform, opacity',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${tone.accent}`;
        el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5), 0 0 24px ${tone.accent}33`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(168,240,255,0.1)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Image area — gradient placeholder + category chip + photo count */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          background: tone.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: `1px solid rgba(168,240,255,0.08)`,
        }}
      >
        {/* Decorative glyph in the centre */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: tone.accent,
            opacity: 0.18,
            textShadow: `0 0 28px ${tone.accent}`,
            userSelect: 'none',
          }}
        >
          {glyph}
        </span>

        {/* Concentric ring overlay — adds depth without an image */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '70%',
            aspectRatio: '1 / 1',
            border: `1px solid ${tone.accent}33`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '110%',
            aspectRatio: '1 / 1',
            border: `1px solid ${tone.accent}1F`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Category chip */}
        <span
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            padding: '0.3rem 0.7rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: tone.accent,
            border: `1px solid ${tone.accent}55`,
            background: 'rgba(13,16,20,0.7)',
            textTransform: 'uppercase',
          }}
        >
          {event.category}
        </span>

        {/* Photo count badge */}
        <span
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            right: '0.85rem',
            padding: '0.3rem 0.7rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--color-text-primary)',
            background: 'rgba(13,16,20,0.7)',
            border: '1px solid rgba(168,240,255,0.18)',
          }}
        >
          {event.photoCount} {event.photoCount === 1 ? 'photo' : 'photos'}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          {event.title}
        </h3>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {event.venue}
        </div>
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <span>{formatDate(event.date)}</span>
        </div>
      </div>
    </article>
  );
}

export default function GalleryEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.gallery-event-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.gallery-events-badge',
            '.gallery-events-heading',
            '.gallery-events-desc',
            '.gallery-event-card',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.gallery-events-badge, .gallery-events-heading, .gallery-events-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        cards.forEach((c) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 36, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: c, start: 'top 85%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      // Desktop pinned ────────────────────────────────────────────────────
      gsap.set(['.gallery-events-badge', '.gallery-events-desc'], { opacity: 0, y: 20 });
      gsap.set('.gallery-events-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.gallery-events-camera', { scale: 1, transformOrigin: 'center center' });
      gsap.set(cards, { opacity: 0, y: 36, scale: 0.92 });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.galleryEvents,
        scrub: 1,
        enabled: true,
      });

      tl.to('.gallery-events-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.gallery-events-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.gallery-events-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);

      // 9 cards over 0.22 → 0.78 (~0.062 each)
      const CARD_START = 0.22;
      const CARD_GAP = 0.062;
      cards.forEach((c, i) => {
        tl.to(
          c,
          { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: 'power3.out' },
          CARD_START + i * CARD_GAP,
        );
      });

      tl.to(
        '.gallery-events-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="gallery-events"
      aria-label={galleryEventsContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .gallery-events-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .gallery-events-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .gallery-events-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="gallery-events-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(5rem, 10vh, 8rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)' }}
        >
          <div className="gallery-events-badge" style={{ display: 'inline-block' }}>
            <Badge label={galleryEventsContent.badge} />
          </div>
          <h2
            className="gallery-events-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
            }}
          >
            {galleryEventsContent.heading}
          </h2>
          <p
            className="gallery-events-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {galleryEventsContent.description}
          </p>
        </div>

        <div className="section-container gallery-events-grid">
          {galleryEventsContent.events.map((event, i) => (
            <EventCard key={event.id} event={event} toneIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
