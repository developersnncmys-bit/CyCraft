'use client';

import { gsap, ScrollTrigger } from './register';

/**
 * Pin durations per section, in scroll-end syntax.
 * Source of truth: CINEMA_SPEC.md Section 2.2.
 */
export const PIN_DURATIONS = {
  // btech pins. Since the architecture moved from `unpinned` (autoplay at
  // timeScale 0.3) to fully scrub-pinned, these values now directly map to
  // scroll distance. The old short values (40–95%) flashed through under
  // scrub — they were sized for real-time autoplay, not scroll. Rescaled to
  // the 150–250% band matching home/about cadence so each section holds long
  // enough to read while the timeline scrubs against scroll. Camera-pan
  // sections (researchWing, curriculum, learningEvolution, battlegrounds)
  // keep their longer pins because their content walks through more beats.
  hero: '+=150%',
  achievements: '+=180%',
  pillars: '+=180%',
  philosophy: '+=180%',
  programOverview: '+=180%',
  tracks: '+=180%',
  researchWing: '+=300%',
  projects: '+=200%',
  specializations: '+=180%',
  certifications: '+=150%',
  curriculum: '+=320%',
  learningEvolution: '+=320%',
  battlegrounds: '+=240%',
  comparison: '+=180%',
  hiringTournaments: '+=180%',
  placements: '+=200%',
  campus: '+=150%',
  admission: '+=180%',
  eligibility: '+=120%',
  partners: '+=130%',
  // Only consumed by features/21-cta-footer (the last btech section). The
  // animations span 0 → 0.87 of the timeline, so anything over ~90% pin
  // leaves an empty dwell tail that scrolls past as "another section."
  // 80% keeps the compose window roomy (~70vh) while trimming the tail
  // to ~10vh so the page ends right after the final state lands.
  finalCta: '+=80%',
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
  /* ── Research page cinematic pins ───────────────────────────────────────
     Hero is unpinned (autoplay fade-in on load). Pinning starts at Focus
     and runs through CTA — ~14 viewports across 5 pinned acts, ~8 min of
     deliberate scroll. Focus gets the longest hold because it walks
     through 6 research tracks. */
  researchFocus:        '+=400%',
  researchStats:        '+=250%',
  researchPublications: '+=300%',
  researchPillars:      '+=250%',
  researchCta:          '+=200%',
  /* ── Courses page cinematic pins ────────────────────────────────────────
     Hero is unpinned (autoplay reveal on every load/nav). Pinning starts at
     the Catalog and runs through Guidance — ~12.5 viewports across 3
     pinned acts, ~8-10 min at deliberate pace. Catalog gets the longest
     hold because it has to walk through a dramatic stats counter plus
     21 cards arriving as a credits-style camera-pan. */
  coursesCatalog:      '+=600%',
  coursesLearningPath: '+=350%',
  coursesGuidance:     '+=300%',
  /* ── Verify page cinematic pins ─────────────────────────────────────────
     Utility page. Hero is unpinned (autoplay reveal). 4 pinned acts —
     Form, How It Works, QR, CTA. Form gets the longest hold since it walks
     the user from empty input through to a fully populated result card. */
  verifyForm:       '+=350%',
  verifyHowItWorks: '+=250%',
  verifyQr:         '+=200%',
  verifyCta:        '+=200%',
  /* ── Assessment page cinematic pins ─────────────────────────────────────
     Marketing surface for the LMS exam engine. Hero is unpinned (autoplay).
     5 pinned acts — Categories, Interface preview, Results, Leaderboard,
     CTA. Interface + Leaderboard get the longest holds because each walks
     through a multi-element composition. */
  /* ── Blog detail page cinematic pins ───────────────────────────────────
     Hero is unpinned (autoplay reveal on load — masthead + cover image).
     Body pins for ~3 viewports so the camera can pan through the full
     article content while per-block text reveals scrub in. Related sits
     after the body and pins briefly so the recommendation cards stagger
     in as a closing beat. */
  blogDetailBody:    '+=300%',
  blogDetailRelated: '+=150%',
  assessmentCategories:  '+=300%',
  assessmentInterface:   '+=350%',
  assessmentResults:     '+=300%',
  assessmentLeaderboard: '+=350%',
  assessmentCta:         '+=200%',
  /* ── Download page cinematic pins ───────────────────────────────────────
     Marketing surface for the resource library (PRD §3.6). Hero is unpinned
     autoplay. 5 pinned acts — Categories, Files (top-downloads table),
     Tools, Access tiers, CTA. Files gets the longest hold because it walks
     through a multi-row table cascade. */
  downloadCertificate: '+=250%',
  downloadCategories:  '+=300%',
  downloadFiles:       '+=350%',
  downloadTools:       '+=300%',
  downloadAccess:      '+=250%',
  downloadCta:         '+=200%',
  /* ── Blog page cinematic pins ───────────────────────────────────────────
     Hero is unpinned (autoplay reveal). Feed is intentionally free-scroll
     (PRD §3.7 — needs to behave like a normal article list). Only the
     Subscribe close is pinned, and its 7 beats (badge → heading → sub →
     form → terminal) need ~300% to breathe — the previous '+=200%' silent
     fallback (when this key was missing from PIN_DURATIONS) felt too brief. */
  blogSubscribe: '+=300%',
  /* ── Gallery page cinematic pins ────────────────────────────────────────
     Hero is unpinned (autoplay). 4 pinned acts — Events grid, Videos,
     Stats, CTA. Events grid carries the longest hold since 9 cards
     cascade in over its window. */
  galleryEvents: '+=400%',
  galleryVideos: '+=250%',
  galleryStats:  '+=250%',
  galleryCta:    '+=200%',
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
  /** Deprecated — accepted for source-compatibility, no longer changes
   *  behaviour. Every cinema section now pins. */
  unpinned?: boolean;
}

/**
 * Factory for a pin-and-scrub section timeline.
 * Used by per-section cinematic hooks across every page (btech included).
 *
 * Behaviour: pin the section at viewport top, scrub the timeline against
 * scroll for the configured `end` distance (see `PIN_DURATIONS`). The
 * `unpinned` option is accepted for source-compatibility but ignored —
 * every section now pins.
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
  // Off by default — matches the JSDoc contract. Flipping this to `true`
  // hides the camera-el opacity-0 the instant the pin releases, which
  // leaves the section's post-pin scroll tail visually empty and reads
  // as a 2-scroll "pause" before the next section enters. Opt-in only
  // for sections whose absolute content visibly repeats during the tail.
  hideCameraOnLeave = false,
  unpinned = false,
}: PinnedTimelineOptions) {
  // ── `unpinned` flag retained for backwards-compatibility ────────────────
  // The old `unpinned: true` path (play-once at slow timeScale, no pin) was
  // removed when btech moved to full scrub-pinned cinema. All sections — btech
  // included — now fall through to the pinned/scrub branch below so each
  // section locks in viewport while its timeline scrubs against scroll. The
  // flag is accepted but ignored; existing call sites compile without edits.
  void unpinned;

  // ── Pinned mode (default — all cinema sections) ─────────────────────────
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
