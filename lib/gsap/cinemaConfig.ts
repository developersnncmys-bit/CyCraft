'use client';

import { gsap, ScrollTrigger } from './register';

/**
 * Pin durations per section, in scroll-end syntax.
 * Source of truth: CINEMA_SPEC.md Section 2.2.
 */
export const PIN_DURATIONS = {
  // btech pins, sized so each releases shortly after its content animation
  // finishes — long static "hold" tails were the main cause of the stuck/blank/
  // delayed scroll feel. Camera-pan sections keep their length so the pan tracks
  // scroll ~1:1: researchWing (recently restructured), learningEvolution (~1:1);
  // curriculum is trimmed because its pan was sluggishly slow.
  hero: '+=150%',
  achievements: '+=100%',
  pillars: '+=150%',
  philosophy: '+=70%',
  programOverview: '+=90%',
  tracks: '+=90%',
  researchWing: '+=300%',
  projects: '+=95%',
  specializations: '+=75%',
  certifications: '+=50%',
  curriculum: '+=220%',
  learningEvolution: '+=190%',
  battlegrounds: '+=55%',
  comparison: '+=60%',
  hiringTournaments: '+=65%',
  placements: '+=70%',
  campus: '+=65%',
  admission: '+=75%',
  eligibility: '+=40%',
  partners: '+=65%',
  finalCta: '+=160%',
  /* ── Home page cinematic pins ─────────────────────────────────────────
     Total pin scroll across the home: ~28 viewports. With Lenis smooth
     scroll, this gives a deliberate 8–10 minute "cinematic" experience
     while still accommodating fast-scroll users. */
  homeHero:             '+=250%',
  homeAboutPreview:     '+=200%',
  homeFeaturedPrograms: '+=250%',
  homeWhyChoose:        '+=250%',
  homeStats:            '+=300%',
  homeCtfChallenge:     '+=250%',
  homeResearch:         '+=250%',
  homeTestimonials:     '+=200%',
  homePartners:         '+=150%',
  homeFinalCta:         '+=250%',
  /* ── About page cinematic pins ──────────────────────────────────────────
     Total ~28 viewports for an 8–10 minute deliberate experience that
     mirrors the home/btech cadence. Timeline is intentionally the longest
     scrub since it walks through six years of history. */
  aboutHero:        '+=200%',
  aboutStats:       '+=300%',
  aboutMission:     '+=250%',
  aboutValues:      '+=350%',
  aboutApproach:    '+=300%',
  aboutLeadership:  '+=250%',
  aboutTeam:        '+=250%',
  aboutMilestones:  '+=250%',
  aboutTimeline:    '+=450%',
  aboutFinalCta:    '+=200%',
  /* ── Contact page cinematic pins ────────────────────────────────────────
     Total ~17.5 viewports across 5 sections — paces out to ~8-10 min of
     deliberate scroll. The form section is also pinned (per design call)
     even though it's interactive; users re-enter the pin window if they
     scroll back up to fill it out. */
  contactHero:      '+=350%',
  contactForm:      '+=350%',
  contactInquiries: '+=350%',
  contactMap:       '+=400%',
  contactSocials:   '+=300%',
} as const;

export type PinnedSectionKey = keyof typeof PIN_DURATIONS;

export interface PinnedTimelineOptions {
  trigger: Element | string;
  end?: string;
  scrub?: number | boolean;
  enabled?: boolean;
  onUpdate?: (self: ScrollTrigger) => void;
  onEnter?: (self: ScrollTrigger) => void;
  onLeave?: (self: ScrollTrigger) => void;
  /** Recompute function-based GSAP values on each ScrollTrigger refresh.
   *  Required for camera-pan sections whose pan distance depends on
   *  dynamically-measured content height. */
  invalidateOnRefresh?: boolean;
  /** Opt-in: hide the section's `*-camera-el` wrapper the instant the pin
   *  releases (restored on scroll-back). Off by default — hiding leaves the
   *  post-pin scroll tail blank, which reads as a "pause" between sections.
   *  Only enable for a section whose absolutely-positioned content visibly
   *  re-shows ("repeats") during its tail AND where a brief dark cut is
   *  preferable to that repeat. Only matches btech `-camera-el` wrappers. */
  hideCameraOnLeave?: boolean;
}

/**
 * Factory for a pin-and-scrub section timeline.
 * Used by per-section cinematic hooks (added in Phase 2+).
 * Pass `enabled: false` from useIsDesktop to disable pinning on mobile.
 */
export function makePinnedTimeline({
  trigger,
  end = '+=300%',
  scrub = 1,
  enabled = true,
  onUpdate,
  onEnter,
  onLeave,
  invalidateOnRefresh = false,
  hideCameraOnLeave = true,
}: PinnedTimelineOptions) {
  // Resolve the section's absolutely-positioned camera wrapper lazily so the
  // ref survives ScrollTrigger refreshes. Only btech sections use `-camera-el`.
  const getCamera = (): HTMLElement | null => {
    if (!enabled || !hideCameraOnLeave) return null;
    const el = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
    return el?.querySelector<HTMLElement>('[class*="-camera-el"]') ?? null;
  };
  const showCamera = () => {
    const cam = getCamera();
    if (cam) gsap.set(cam, { opacity: 1 });
  };

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top top',
      end,
      pin: enabled,
      pinSpacing: enabled,
      // Scale the scrub down (×0.4 → the usual 1 becomes 0.4) so pinned
      // animations track the wheel tightly instead of lagging ~1s behind —
      // snappier while still smoothed.
      scrub: enabled ? (typeof scrub === 'number' ? scrub * 0.4 : scrub) : false,
      // anticipatePin guards against a fast-native-scroll pin flash, but Lenis
      // already smooths scroll velocity — leaving it on makes content jump-then-
      // settle as each section engages its pin, glitching the section handoff.
      anticipatePin: 0,
      invalidateOnRefresh,
      onUpdate,
      onEnter: (self) => {
        showCamera();
        onEnter?.(self);
      },
      onEnterBack: showCamera,
      onLeave: (self) => {
        const cam = getCamera();
        if (cam) gsap.set(cam, { opacity: 0 });
        onLeave?.(self);
      },
    },
  });
}
