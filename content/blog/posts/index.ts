/**
 * Registry of per-slug blog post detail entries. Add a new post body by
 * dropping `<slug>.ts` in this folder, importing it here, and adding the
 * slug → entry mapping to `blogPostDetails`. The dynamic route at
 * /blog/[slug] uses `getBlogPostDetail()` to resolve content.
 *
 * Detail entries are OPTIONAL — posts without one still render the hero
 * and metadata using the feed record. The body falls back to a "being
 * finalised" placeholder until a detail file lands.
 */
import { kyrgyzstanNetsupportRatDetail } from './kyrgyzstan-justice-ministry-netsupport-rat-fake-pdfs';
import { roningloaderDragonBreathDetail } from './roningloader-fake-chrome-teams-gh0st-rat';
import { landfallSamsungZeroDayDetail } from './landfall-spyware-samsung-galaxy-zero-day';
import { cloudflareRoutingFailureDetail } from './cloudflare-routing-failure-worldwide-outage';
import { landfallTrustedDevicesDetail } from './landfall-spyware-trusted-devices-system-wide-threat';
import { aiBrowserPromptInjectionDetail } from './ai-browser-indirect-prompt-injection';
import type { BlogPostDetail } from './types';

const blogPostDetails: Record<string, BlogPostDetail> = {
  [kyrgyzstanNetsupportRatDetail.slug]: kyrgyzstanNetsupportRatDetail,
  [roningloaderDragonBreathDetail.slug]: roningloaderDragonBreathDetail,
  [landfallSamsungZeroDayDetail.slug]: landfallSamsungZeroDayDetail,
  [cloudflareRoutingFailureDetail.slug]: cloudflareRoutingFailureDetail,
  [landfallTrustedDevicesDetail.slug]: landfallTrustedDevicesDetail,
  [aiBrowserPromptInjectionDetail.slug]: aiBrowserPromptInjectionDetail,
  // Add more posts here as their bodies land.
};

export function getBlogPostDetail(slug: string): BlogPostDetail | null {
  return blogPostDetails[slug] ?? null;
}

export type { BlogPostDetail, BlogBodyBlock } from './types';
