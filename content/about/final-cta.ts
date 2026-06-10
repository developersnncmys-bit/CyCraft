/**
 * Content (v1.3) — Section 8 "Call to Action": Let's Build the Future
 * Together. Spec is explicit: single CTA button (Contact Us Today → contact
 * form). The previous two-button layout has been dropped; `secondary` is
 * removed from the content shape so any JSX that still references it will
 * fail loudly at type-check time rather than silently render a stale button.
 */
export const aboutFinalCtaContent = {
  heading: "Let's Build the Future Together",
  /** Highlight phrase is rendered in red — must be a substring of `heading`. */
  highlight: 'Build the Future',
  description:
    "Partner with CyCraft to create impactful learning experiences and prepare students for tomorrow's opportunities.",
  primary: { label: 'CONTACT US TODAY', href: '/contact' },
} as const;
