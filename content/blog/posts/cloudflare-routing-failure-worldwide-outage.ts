import type { BlogPostDetail } from './types';

export const cloudflareRoutingFailureDetail: BlogPostDetail = {
  slug: 'cloudflare-routing-failure-worldwide-outage',
  deck:
    "A sudden internal routing flaw in Cloudflare's global network cascaded into slow loads, broken APIs, and 5xx errors across thousands of sites — a reminder of how much of the modern web rides on shared backbone infrastructure.",
  body: [
    {
      type: 'heading',
      level: 2,
      text: 'Cloudflare Outage Causes Internet-Wide Disruptions',
    },
    {
      type: 'paragraph',
      text:
        'Cloudflare experienced a sudden routing failure inside its global network layer, leading to widespread slowdowns and service failures across the internet. Since thousands of websites rely on Cloudflare for DNS, CDN caching, API routing, and security, the issue created a ripple effect that affected platforms worldwide.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'What Caused the Issue?',
    },
    {
      type: 'paragraph',
      text:
        'Cloudflare confirmed an internal problem with their global routing system — the component that decides how traffic moves between different Cloudflare data centers. When this system became unstable, it resulted in:',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Websites loading slowly or failing to load.',
        'APIs returning timeouts and errors.',
        'Authentication systems breaking.',
        'Unexpected 5xx responses across apps.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'How Many Services Were Impacted?',
    },
    {
      type: 'paragraph',
      text:
        'The disruption affected any platform that depends on Cloudflare for:',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'DNS lookups.',
        'Content delivery (CDN).',
        'API gateway and routing.',
        'DDoS filtering.',
      ],
    },
    {
      type: 'paragraph',
      text:
        'This is why even websites not directly hosted on Cloudflare felt the impact — they relied on Cloudflare systems in the background.',
    },

    {
      type: 'heading',
      level: 2,
      text: "Cloudflare's Response",
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Identified the routing flaw inside backbone links.',
        'Rerouted global traffic to stable pathways.',
        'Restored connectivity across major data centers.',
        'Confirmed this was not caused by a cyberattack.',
      ],
    },
    {
      type: 'paragraph',
      text:
        'Cloudflare also noted that some regions may continue experiencing intermittent instability while the network stabilizes.',
    },

    {
      type: 'callout',
      tone: 'beam',
      title: 'Final Thoughts',
      text:
        "Cloudflare is one of the internet’s biggest backbone providers. When it faces a routing failure, even small glitches have massive, global consequences. Today’s outage highlights how much of the modern web relies on shared infrastructure — and how fragile that dependency can be.",
    },
  ],
  tags: ['Cloudflare', 'Outage', 'Internet', 'DNS', 'CDN', 'Network Issue'],
};
