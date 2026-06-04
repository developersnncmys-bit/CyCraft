'use client';
/* Blog Subscribe — pinned cinematic CTA (mobile = scroll-trigger).
 *
 * Beats (0–1):
 *   0.00–0.05  Badge
 *   0.05–0.22  Heading words
 *   0.22–0.32  Subhead
 *   0.32–0.55  Input + CTA ignite
 *   0.55–0.75  Terminal lines type in
 *   0.85–1.00  Camera scale 1 → 0.96
 *
 * The form posts to /api/subscribe. That endpoint doesn't exist yet —
 * client will wire it up when the newsletter provider is chosen. We
 * progressive-enhance: if JS catches the submit, we show an inline thanks
 * state without round-tripping.
 */
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { blogSubscribeContent } from '@/content/blog/subscribe';

const PIN_END = (PIN_DURATIONS as Record<string, string>).blogSubscribe ?? '+=200%';

export default function BlogSubscribe() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.blog-sub-bg',
            '.blog-sub-glow',
            '.blog-sub-camera',
            '.blog-sub-badge',
            '.blog-sub-heading-word',
            '.blog-sub-sub',
            '.blog-sub-form',
            '.blog-sub-terminal',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo(
          '.blog-sub-badge',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.blog-sub-heading-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.04,
            delay: 0.15,
            scrollTrigger: trigger,
          },
        );
        gsap.fromTo(
          '.blog-sub-sub',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.45, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.blog-sub-form',
          { opacity: 0, y: 16, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.6,
            scrollTrigger: trigger,
          },
        );
        gsap.fromTo(
          '.blog-sub-terminal',
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.9,
            scrollTrigger: trigger,
          },
        );
        return;
      }

      gsap.set('.blog-sub-badge', { opacity: 0, y: 14 });
      gsap.set('.blog-sub-heading-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.blog-sub-sub', { opacity: 0, y: 18 });
      gsap.set('.blog-sub-form', { opacity: 0, y: 24, scale: 0.94 });
      gsap.set('.blog-sub-terminal', { opacity: 0, y: 8 });
      gsap.set('.blog-sub-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_END,
        scrub: 1,
        enabled: true,
      });

      tl.to('.blog-sub-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.blog-sub-heading-word',
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.18,
            stagger: 0.035,
            ease: 'power3.out',
          },
          0.05,
        )
        .to('.blog-sub-sub', { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.22)
        .to(
          '.blog-sub-form',
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'back.out(1.4)' },
          0.32,
        )
        .to(
          '.blog-sub-terminal',
          { opacity: 1, y: 0, duration: 0.1, stagger: 0.04, ease: 'power2.out' },
          0.55,
        );

      tl.to('.blog-sub-bg', { yPercent: -4, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.blog-sub-glow',
        { yPercent: -18, scale: 1.3, opacity: 0.55, duration: 1, ease: 'none' },
        0,
      );

      tl.to('.blog-sub-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const prefixWords = blogSubscribeContent.headingPrefix.split(/\s+/);
  const accentWords = blogSubscribeContent.headingAccent.split(/\s+/);

  return (
    <section
      ref={sectionRef}
      id="blog-subscribe"
      aria-label="Subscribe to the blog newsletter"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="blog-sub-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(4rem, 8vh, 6rem)',
          paddingBottom: 'clamp(4rem, 8vh, 6rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          className="blog-sub-bg"
          style={{
            position: 'absolute',
            inset: '-8%',
            zIndex: 1,
            background:
              'radial-gradient(ellipse at center, rgba(168,240,255,0.08), transparent 65%)',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        <div
          aria-hidden="true"
          className="blog-sub-glow"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '960px',
            height: '640px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.14) 0%, rgba(168,240,255,0.04) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 6,
            width: '100%',
            maxWidth: '760px',
            textAlign: 'center',
          }}
        >
          <div className="blog-sub-badge" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <Badge label={blogSubscribeContent.badge} />
          </div>

          <h2
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.3em',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0 0 1.25rem',
              lineHeight: 1.06,
            }}
          >
            {prefixWords.map((word, i) => (
              <span
                key={`p-${i}`}
                className="blog-sub-heading-word"
                style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              >
                {word}
              </span>
            ))}
            {accentWords.map((word, i) => (
              <span
                key={`a-${i}`}
                className="blog-sub-heading-word"
                style={{
                  display: 'inline-block',
                  color: 'var(--color-beam)',
                  textShadow: '0 0 28px var(--color-beam-glow)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
          </h2>

          <p
            className="blog-sub-sub"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              margin: '0 auto 2.25rem',
              maxWidth: '560px',
            }}
          >
            {blogSubscribeContent.subhead}
          </p>

          <form
            className="blog-sub-form"
            action="/api/subscribe"
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim().length === 0) return;
              setSubmitted(true);
            }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              maxWidth: '520px',
              margin: '0 auto',
              willChange: 'transform, opacity',
            }}
          >
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={blogSubscribeContent.emailPlaceholder}
              aria-label="Email address"
              disabled={submitted}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '1rem 1.25rem',
                background: 'rgba(13,16,20,0.7)',
                border: '1px solid rgba(168,240,255,0.2)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.04em',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-beam)';
                e.currentTarget.style.background = 'rgba(13,16,20,0.9)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,240,255,0.2)';
                e.currentTarget.style.background = 'rgba(13,16,20,0.7)';
              }}
            />
            <button
              type="submit"
              disabled={submitted}
              style={{
                padding: '1rem 2rem',
                background: submitted ? 'transparent' : 'var(--color-beam)',
                color: submitted ? 'var(--color-beam)' : 'var(--color-void)',
                border: '1px solid var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: submitted ? 'default' : 'pointer',
                boxShadow: submitted ? 'none' : '0 0 24px rgba(168,240,255,0.32)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                if (submitted) return;
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 0 36px rgba(168,240,255,0.5)';
              }}
              onMouseLeave={(e) => {
                if (submitted) return;
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 24px rgba(168,240,255,0.32)';
              }}
            >
              {submitted ? "You're in" : blogSubscribeContent.cta}
            </button>
          </form>

          <div
            aria-hidden="true"
            style={{
              marginTop: '2.5rem',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '0.25rem',
              border: '1px solid rgba(168,240,255,0.12)',
              background: 'rgba(13,16,20,0.6)',
              backdropFilter: 'blur(6px)',
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-terminal)',
              letterSpacing: '0.04em',
              textAlign: 'left',
            }}
          >
            {blogSubscribeContent.terminalLines.map((line) => (
              <span key={line} className="blog-sub-terminal">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
