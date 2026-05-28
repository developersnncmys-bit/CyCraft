# CyCraft — Blocking Assets & Open Items

## BLOCKING ASSETS (client must provide)

### Videos
- [x] `public/videos/hero-bg.mp4` — PROVIDED but **50 MB (over 8 MB spec limit)**. Must compress before deploy:
  ```
  ffmpeg -i hero-bg.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:1080" -an hero-bg-opt.mp4
  ```
- [ ] `public/videos/hero-bg.webm` — WebM fallback still needed
- [ ] `public/videos/hero-poster.jpg` — extract a poster frame:
  ```
  ffmpeg -i hero-bg.mp4 -ss 00:00:01 -vframes 1 hero-poster.jpg
  ```
- [x] `public/videos/campus-tour.mp4` — using same source video (50 MB, same compression warning applies)
- [ ] `public/videos/campus-tour-poster.jpg`

### Images
- [ ] `public/images/og-image.jpg` — 1200x630 social card
- [ ] `public/images/partners/seciq.svg` — monochrome white version
- [ ] `public/images/partners/ibm.svg`
- [ ] `public/images/partners/cisco.svg`
- [ ] `public/images/partners/google.svg`
- [ ] `public/images/partners/hp.svg`
- [ ] `public/images/partners/mcafee.svg`
- [ ] `public/images/partners/vodafone.svg`

### Brand
- [ ] `public/favicon/favicon.ico`
- [ ] `public/favicon/icon-192.png`
- [ ] `public/favicon/icon-512.png`
- [ ] `public/favicon/apple-touch-icon.png`
- [ ] CyCraft primary logo SVG (white, for Navbar and Footer)

## MILESTONES COMPLETED

- [x] M1 — Foundation (design system, core components, GSAP + Lenis, Navbar, ScrollProgress)
- [x] M2 — Act I (Hero section, Achievements section)

## MILESTONES PENDING

- [ ] M3 — Act II (Pillars, Philosophy, Program Overview)
- [ ] M4 — Act III (Tracks, Research Wing, Projects, Specializations)
- [ ] M5 — Act IV (Certifications, Curriculum, Learning Evolution, Battlegrounds)
- [ ] M6 — Act V (Comparison, Hiring Tournaments, Placements, Campus)
- [ ] M7 — Act VI (Admission, Eligibility, Partners, CTA, Apply Modal)
- [ ] M8 — Polish (cross-browser, mobile, Lighthouse, a11y, SEO)
- [ ] M9 — Handoff (QA, README, deploy)

## OPEN QUESTIONS

- Does the client have a GSAP Club license? If yes: swap split-type for SplitText,
  Lenis for ScrollSmoother.
- Confirm APPLY_FORM_WEBHOOK_URL endpoint for /api/apply route.
- Confirm NEXT_PUBLIC_GA_ID if analytics tracking is needed.
- Hero video: client to confirm autoplay acceptable on desktop (muted, so browser will allow it).
