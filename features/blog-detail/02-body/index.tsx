'use client';
/* Blog Detail Body — typed content-block renderer + natural-scroll cinema.
 *
 * The article body flows in document order — the reader scrolls at their
 * own pace. Each block reveals as it enters the viewport via its own
 * ScrollTrigger; headings get a WordSplit word-blur reveal as the text
 * reveal animation. A pinned/camera-pan approach was tried earlier but
 * destroyed reading flow: earlier sections got panned off-screen with no
 * way to scroll back to re-read them.
 *
 * Blocks: paragraph, heading (h2/h3), list (bullet/numbered), quote,
 * callout (beam/red/blue/terminal), code, image, divider.
 *
 * When no detail entry exists for the slug yet, the body falls back to
 * a "publishing soon" placeholder so the route still renders cleanly.
 */
import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { BlogBodyBlock } from '@/content/blog/posts';

interface BlogDetailBodyProps {
  body: readonly BlogBodyBlock[] | null;
  tags: readonly string[];
  sources: ReadonlyArray<{ label: string; href: string }>;
}

type CalloutTone = 'beam' | 'red' | 'blue' | 'terminal';

const calloutTokens: Record<CalloutTone, { color: string; tint: string; border: string }> = {
  beam: {
    color: 'var(--color-beam)',
    tint: 'rgba(168,240,255,0.06)',
    border: 'rgba(168,240,255,0.32)',
  },
  red: {
    color: 'var(--color-red-team)',
    tint: 'rgba(255,61,90,0.07)',
    border: 'rgba(255,61,90,0.35)',
  },
  blue: {
    color: 'var(--color-blue-team)',
    tint: 'rgba(61,168,255,0.07)',
    border: 'rgba(61,168,255,0.35)',
  },
  terminal: {
    color: 'var(--color-terminal)',
    tint: 'rgba(0,255,148,0.06)',
    border: 'rgba(0,255,148,0.32)',
  },
};

function renderBlock(block: BlogBodyBlock, idx: number) {
  const key = `${block.type}-${idx}`;

  switch (block.type) {
    case 'paragraph':
      return (
        <p
          key={key}
          className="bd-block bd-block-paragraph"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.75,
            margin: 0,
            textAlign: 'left',
          }}
        >
          <WordSplit text={block.text} />
        </p>
      );

    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : 'h3';
      const size = block.level === 2 ? 'clamp(1.4rem, 2.4vw, 2rem)' : 'clamp(1.1rem, 1.55vw, 1.3rem)';
      return (
        <div
          key={key}
          className="bd-block bd-block-heading"
          style={{
            position: 'relative',
            paddingTop: 'clamp(1rem, 2vh, 1.5rem)',
            paddingLeft: block.level === 2 ? '1.25rem' : '0',
          }}
        >
          {/* Beam-cyan accent bar on the left, only on h2 — visual rhythm
              cue between sections without competing with the headline. */}
          {block.level === 2 && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 'calc(clamp(1rem, 2vh, 1.5rem) + 0.25rem)',
                bottom: '0.25rem',
                width: '3px',
                background:
                  'linear-gradient(to bottom, var(--color-beam), var(--color-blue-team))',
                boxShadow: '0 0 12px var(--color-beam-glow)',
                borderRadius: '1px',
              }}
            />
          )}
          <Tag
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: size,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.18,
              margin: 0,
              textAlign: 'left',
            }}
          >
            <WordSplit text={block.text} />
          </Tag>
        </div>
      );
    }

    case 'list': {
      const isNumbered = block.style === 'numbered';
      const Tag = isNumbered ? 'ol' : 'ul';
      // Tailwind's preflight zeroes `list-style` globally, so the
      // browser markers never render. We draw our own via flex layout
      // — a beam-cyan ▸ glyph for bullets, a mono index for numbered.
      return (
        <Tag
          key={key}
          className="bd-block bd-block-list"
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
          }}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className="bd-block-list-item"
              style={{
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'flex-start',
                willChange: 'transform, opacity',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flex: '0 0 auto',
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  justifyContent: isNumbered ? 'flex-end' : 'center',
                  minWidth: isNumbered ? '1.85rem' : '1.1rem',
                  paddingTop: '0.05rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: isNumbered ? '0.85rem' : '0.95rem',
                  letterSpacing: isNumbered ? '0.06em' : 0,
                  color: 'var(--color-beam)',
                  textShadow: '0 0 8px rgba(168,240,255,0.45)',
                  lineHeight: 1,
                }}
              >
                {isNumbered
                  ? `${String(i + 1).padStart(2, '0')}.`
                  : '▸'}
              </span>
              <span style={{ flex: 1 }}>
                <WordSplit text={item} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }

    case 'quote':
      return (
        <blockquote
          key={key}
          className="bd-block bd-block-quote"
          style={{
            position: 'relative',
            margin: '0.5rem 0',
            padding: '1.25rem 1.5rem 1.25rem 2.5rem',
            background:
              'linear-gradient(135deg, rgba(168,240,255,0.05), rgba(61,168,255,0.025))',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 1.65vw, 1.3rem)',
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            lineHeight: 1.45,
            overflow: 'hidden',
          }}
        >
          <span
            className="bd-quote-rail"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background:
                'linear-gradient(to bottom, var(--color-beam), var(--color-blue-team))',
              boxShadow: '0 0 14px var(--color-beam-glow)',
              transformOrigin: 'top center',
              willChange: 'transform',
            }}
          />
          {/* Oversized opening quote glyph — sits behind the text */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-0.4rem',
              left: '0.7rem',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 1,
              color: 'var(--color-beam)',
              opacity: 0.18,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            &ldquo;
          </span>
          <p style={{ position: 'relative', margin: 0 }}>
            <WordSplit text={block.text} />
          </p>
          {block.attribution && (
            <footer
              style={{
                marginTop: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontStyle: 'normal',
                letterSpacing: '0.18em',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );

    case 'callout': {
      const tone = calloutTokens[block.tone];
      return (
        <aside
          key={key}
          className="bd-block bd-block-callout"
          style={{
            position: 'relative',
            padding: '1.35rem 1.5rem 1.35rem 1.75rem',
            background: 'rgba(13,16,20,0.55)',
            border: `1px solid ${tone.border}`,
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            boxShadow: `0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 28px ${tone.tint}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
            overflow: 'hidden',
          }}
        >
          <span
            className="bd-callout-rail"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background: tone.color,
              boxShadow: `0 0 14px ${tone.color}`,
              transformOrigin: 'top center',
              willChange: 'transform',
            }}
          />
          {block.title && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: tone.color,
                textTransform: 'uppercase',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: tone.color,
                  boxShadow: `0 0 8px ${tone.color}`,
                }}
              />
              {block.title}
            </span>
          )}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            <WordSplit text={block.text} />
          </p>
        </aside>
      );
    }

    case 'code':
      return (
        <pre
          key={key}
          className="bd-block bd-block-code"
          style={{
            margin: 0,
            padding: '1rem 1.25rem',
            background: 'var(--color-carbon)',
            border: '1px solid rgba(168,240,255,0.12)',
            color: 'var(--color-terminal)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: 1.6,
            overflowX: 'auto',
            whiteSpace: 'pre',
          }}
        >
          {block.language && (
            <span
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              // {block.language}
            </span>
          )}
          <code style={{ color: 'inherit', background: 'transparent' }}>
            {block.code}
          </code>
        </pre>
      );

    case 'image': {
      const hasIntrinsic = !!(block.width && block.height);
      return (
        <figure
          key={key}
          className="bd-block bd-block-image"
          style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            background: 'var(--color-carbon)',
            overflow: 'hidden',
            willChange: 'transform, opacity, filter',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: hasIntrinsic ? undefined : '16 / 9',
            }}
          >
            <Image
              src={block.src}
              alt={block.alt}
              {...(hasIntrinsic
                ? {
                    width: block.width!,
                    height: block.height!,
                    style: { width: '100%', height: 'auto', display: 'block' },
                  }
                : {
                    fill: true,
                    sizes: '(max-width: 1024px) 100vw, 760px',
                    style: { objectFit: 'cover' },
                  })}
            />
          </div>
          {/* Scan-line overlay matches feed card aesthetic */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 5px)',
            }}
          />
          {block.caption && (
            <figcaption
              style={{
                padding: '0.7rem 1rem',
                borderTop: '1px solid rgba(168,240,255,0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: 'var(--color-text-tertiary)',
                background: 'rgba(5,6,8,0.6)',
              }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'divider':
      return (
        <hr
          key={key}
          className="bd-block bd-block-divider"
          aria-hidden="true"
          style={{
            margin: '0.5rem auto',
            border: 'none',
            height: '1px',
            width: '60px',
            background:
              'linear-gradient(to right, transparent, var(--color-beam), transparent)',
            opacity: 0.6,
          }}
        />
      );
  }
}

function PlaceholderBody() {
  return (
    <div
      className="bd-block"
      style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-tertiary)',
        letterSpacing: '0.08em',
        border: '1px dashed rgba(168,240,255,0.18)',
      }}
    >
      // Full briefing publishing soon. The research wing is finalising the write-up.
    </div>
  );
}

export default function BlogDetailBody({ body, tags, sources }: BlogDetailBodyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      // Reset state — every word/block/rail at the composed final state
      // so prefers-reduced-motion readers see the article statically.
      if (reducedMotion) {
        gsap.set(
          [
            '.bd-block',
            '.bd-block-list-item',
            '.bd-quote-rail',
            '.bd-callout-rail',
            '.bd-tag',
            '.bd-source',
            '[data-word]',
          ],
          {
            opacity: 1,
            y: 0,
            x: 0,
            yPercent: 0,
            scale: 1,
            filter: 'none',
            scaleX: 1,
            scaleY: 1,
          },
        );
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: 1 });
        }
        return;
      }

      // Every reveal uses these toggleActions so the animation REPLAYS
      // each time the block enters the viewport (either scrolling down
      // or back up), and resets to its initial state when fully scrolled
      // past in either direction. That's what "every scroll triggers
      // the text reveal" means in practice.
      //   onEnter      → restart (scroll down past start)
      //   onLeave      → reset   (scroll down past end)
      //   onEnterBack  → restart (scroll up back into range)
      //   onLeaveBack  → reset   (scroll up past start)
      const replayActions = 'restart reset restart reset';

      // ── Reading progress bar — scrubs across the body section's
      //    natural scroll range so the reader can see how far they are.
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: true,
          },
        });
      }

      // ── Heading text reveal — word-blur up-slide
      //    Headline reveals are the most dramatic — bigger yPercent,
      //    longer stagger, harder blur. These are the visible "wow" beats.
      root.querySelectorAll<HTMLElement>('.bd-block-heading').forEach((heading) => {
        const words = heading.querySelectorAll<HTMLElement>('[data-word]');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0, yPercent: 80, filter: 'blur(12px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: replayActions,
            },
          },
        );
      });

      // ── Paragraph + callout + quote text — word-by-word reveal
      //    Faster stagger and lighter blur than headings so the eye keeps
      //    moving while the words swim in. This is the change from the
      //    flat-fade "boring" paragraphs.
      const proseSelectors =
        '.bd-block-paragraph, .bd-block-quote, .bd-block-callout';
      root.querySelectorAll<HTMLElement>(proseSelectors).forEach((block) => {
        const words = block.querySelectorAll<HTMLElement>('[data-word]');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0, yPercent: 35, filter: 'blur(5px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.55,
            stagger: 0.012,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 86%',
              toggleActions: replayActions,
            },
          },
        );
      });

      // ── List items — words within each item reveal, plus a small
      //    x-slide on the row so the bullet marker swings in.
      root.querySelectorAll<HTMLElement>('.bd-block-list').forEach((list) => {
        const items = list.querySelectorAll<HTMLElement>('.bd-block-list-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: list,
              start: 'top 86%',
              toggleActions: replayActions,
            },
          },
        );

        const words = list.querySelectorAll<HTMLElement>('[data-word]');
        if (words.length) {
          gsap.fromTo(
            words,
            { opacity: 0, yPercent: 30, filter: 'blur(4px)' },
            {
              opacity: 1,
              yPercent: 0,
              filter: 'blur(0px)',
              duration: 0.5,
              stagger: 0.01,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: list,
                start: 'top 86%',
                toggleActions: replayActions,
              },
            },
          );
        }
      });

      // ── Quote left-bar — scales down from top
      root.querySelectorAll<HTMLElement>('.bd-quote-rail').forEach((rail) => {
        gsap.fromTo(
          rail,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rail.parentElement ?? rail,
              start: 'top 86%',
              toggleActions: replayActions,
            },
          },
        );
      });

      // ── Callout left-bar — scales down from top
      root.querySelectorAll<HTMLElement>('.bd-callout-rail').forEach((rail) => {
        gsap.fromTo(
          rail,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rail.parentElement ?? rail,
              start: 'top 86%',
              toggleActions: replayActions,
            },
          },
        );
      });

      // ── Image blocks — scale-blur into focus
      root.querySelectorAll<HTMLElement>('.bd-block-image').forEach((fig) => {
        gsap.fromTo(
          fig,
          { scale: 1.05, filter: 'blur(10px)', opacity: 0 },
          {
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: fig,
              start: 'top 85%',
              toggleActions: replayActions,
            },
          },
        );
      });

      // ── Divider — draws from centre out
      root.querySelectorAll<HTMLElement>('.bd-block-divider').forEach((hr) => {
        gsap.fromTo(
          hr,
          { scaleX: 0, transformOrigin: 'center center' },
          {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: hr,
              start: 'top 88%',
              toggleActions: replayActions,
            },
          },
        );
      });

      // ── Tags + sources fade in at the foot of the article
      gsap.fromTo(
        '.bd-tag, .bd-source',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.bd-meta-row',
            start: 'top 90%',
            toggleActions: replayActions,
          },
        },
      );

      // useGSAP's contextSafe scope kills its own ScrollTriggers on
      // unmount — no manual cleanup needed.
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <>
      {/* Fixed reading-progress bar — sits above all content, beam-cyan */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 998,
          pointerEvents: 'none',
          background: 'rgba(168,240,255,0.08)',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            width: '100%',
            transformOrigin: 'left center',
            background:
              'linear-gradient(to right, var(--color-beam), var(--color-beam-glow))',
            boxShadow: '0 0 12px var(--color-beam-glow)',
            willChange: 'transform',
          }}
        />
      </div>

      <section
        ref={sectionRef}
        id="bd-body"
        aria-label="Article body"
        style={{
          position: 'relative',
          background: 'transparent',
          paddingTop: 'clamp(2.5rem, 5vh, 4rem)',
          paddingBottom: 'clamp(4rem, 8vh, 6rem)',
        }}
      >
        <div
          className="section-container"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.5rem, 3vw, 2rem)',
              maxWidth: '760px',
              marginInline: 'auto',
              textAlign: 'left',
            }}
          >
            {body && body.length > 0
              ? body.map((block, i) => renderBlock(block, i))
              : <PlaceholderBody />}
          </div>

          {(tags.length > 0 || sources.length > 0) && (
            <div
              className="bd-meta-row"
              style={{
                marginTop: 'clamp(2.5rem, 5vw, 3.5rem)',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                maxWidth: '760px',
                marginInline: 'auto',
                textAlign: 'left',
              }}
            >
              {tags.length > 0 && (
                <div>
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'block',
                      marginBottom: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    // Tags
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bd-tag"
                        style={{
                          padding: '0.25rem 0.6rem',
                          background: 'transparent',
                          border: '1px solid rgba(168,240,255,0.22)',
                          color: 'var(--color-text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          letterSpacing: '0.08em',
                          transition: 'border-color 0.2s, color 0.2s',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {sources.length > 0 && (
                <div>
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'block',
                      marginBottom: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    // Sources
                  </span>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    {sources.map((src) => (
                      <li key={src.href}>
                        <a
                          href={src.href}
                          className="bd-source"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--color-beam)',
                            textDecoration: 'none',
                            letterSpacing: '0.04em',
                            borderBottom: '1px solid transparent',
                            transition: 'border-color 0.2s',
                            willChange: 'opacity, transform',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor =
                              'var(--color-beam)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor =
                              'transparent';
                          }}
                        >
                          → {src.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
