/**
 * Single source of truth for the external exam portal URL. The Assessment
 * page is a marketing surface — every primary action ("Start Assessment",
 * "Login to Portal", etc.) routes the user out to the LMS exam app, which
 * lives at this domain. Swap the value once the real portal is deployed;
 * every CTA on the page will pick up the new URL automatically.
 */
export const assessmentConfig = {
  examPortalUrl: 'https://exam.cycraft.in/login',
} as const;
