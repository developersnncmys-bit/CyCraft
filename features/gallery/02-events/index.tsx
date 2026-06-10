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


function EventCard({
  event,
  toneIndex,
}: {
  event: GalleryEvent;
  toneIndex: number;
}) {
  const tone = galleryCardTones[toneIndex % galleryCardTones.length];

  return (
    // Per Updates v1.3 §10 the card design is intentionally minimal:
    // AI-generated image + theme title + descriptive caption. The
    // category chip, decorative glyph, ring overlay, photo-count badge,
    // and date footer of the original "album card" design were removed
    // because the brief specifies a clean gallery of themed images, not
    // an album index. Class names (.gallery-event-card) are retained so
    // the section's pinned scrub + per-card stagger animation continue
    // to find and reveal the cards unchanged.
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
      {/* Image area — AI-generated image (Updates v1.3 §10) on the
          tone-cycled gradient fallback. onError hides the broken image
          and the gradient + subtle inner shadow remain so the card never
          breaks. */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          background: tone.bg,
          overflow: 'hidden',
          borderBottom: `1px solid rgba(168,240,255,0.08)`,
        }}
      >
        {event.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>

      {/* Body — theme title + descriptive caption */}
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
            // Locked to toneIndex={0} (beam cyan) for all 6 cards so the
            // framing — tag chip border, hover border, gradient fallback —
            // is consistent across the row per Updates v1.3 §10 Dev Note
            // ("consistent in visual style ... represent CyCraft's
            // professional brand"). The per-card tone cycle that was in
            // the original design now contradicted the brief.
            <EventCard key={event.id} event={event} toneIndex={0} />
          ))}
        </div>
      </div>
    </section>
  );
}
