'use client';

import { gsap, ScrollTrigger } from './register';

/**
 * Pin durations per section, in scroll-end syntax.
 * Source of truth: CINEMA_SPEC.md Section 2.2.
 */
export const PIN_DURATIONS = {
  // btech pins, roughly halved from the original CINEMA_SPEC values to cut the
  // long static "hold" tails that made the scroll feel stuck between sections.
  // The three camera-pan sections (researchWing, curriculum, learningEvolution)
  // are trimmed less so their pan doesn't outrun the scroll.
  hero: '+=150%',
  achievements: '+=130%',
  pillars: '+=180%',
  philosophy: '+=110%',
  programOverview: '+=130%',
  tracks: '+=200%',
  researchWing: '+=300%',
  projects: '+=160%',
  specializations: '+=160%',
  certifications: '+=100%',
  curriculum: '+=380%',
  learningEvolution: '+=190%',
  battlegrounds: '+=110%',
  comparison: '+=160%',
  hiringTournaments: '+=160%',
  placements: '+=130%',
  campus: '+=110%',
  admission: '+=110%',
  eligibility: '+=100%',
  partners: '+=110%',
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
  /** When true (default), the section's `*-camera-el` wrapper is hidden the
   *  instant the pin releases (and restored on scroll-back) so its composed,
   *  absolutely-positioned content can't ghost/replay over later sections.
   *  Doing it on the pin boundary (not as a scrubbed fade) avoids the blank
   *  scroll gap the old fade left. Set false for resting sections that must
   *  stay visible after their pin (e.g. the final CTA). */
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
  // Resolve the section's camera wrapper lazily so the ref survives refreshes.
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
      scrub: enabled ? scrub : false,
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
