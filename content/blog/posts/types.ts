/**
 * Per-slug detail content for the dynamic blog post page at
 * /blog/<slug>. The feed (content/blog/feed.ts) supplies the base
 * record — title, excerpt, category, date, read time, author — for
 * every post; this file holds the long-form body that only the
 * detail page needs.
 *
 * Detail content is OPTIONAL. If a slug exists in the feed but no
 * detail entry is registered, the page still renders the hero +
 * metadata using feed data alone and the body shows a friendly
 * "publishing soon" placeholder.
 *
 * Bodies are authored as a typed array of content blocks rather than
 * raw HTML/markdown so each block is styled by the renderer and stays
 * aligned with the CyCraft design language (mono accents, beam dividers,
 * red/blue duality on callouts, etc.).
 */

export type BlogBodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; style: 'bullet' | 'numbered'; items: readonly string[] }
  | { type: 'quote'; text: string; attribution?: string }
  | {
      type: 'callout';
      tone: 'beam' | 'red' | 'blue' | 'terminal';
      title?: string;
      text: string;
    }
  | { type: 'code'; language?: string; code: string }
  | { type: 'divider' }
  | {
      /** Inline image rendered as a styled `<figure>` with optional
       *  caption. Path is relative to `/public/` (e.g.
       *  `/images/blog/<slug>/fig-1.jpg`). Width/height are optional
       *  hints — when both are present the Next.js Image component
       *  uses them as the intrinsic size; otherwise the image renders
       *  with `fill` inside a 16:9 frame. */
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
      width?: number;
      height?: number;
    };

export interface BlogPostDetail {
  /** Must match the slug in content/blog/feed.ts. */
  slug: string;
  /** Optional one-line summary rendered under the title as a deck. If
   *  absent the feed's excerpt is used. */
  deck?: string;
  /** Ordered list of body blocks. The renderer in
   *  features/blog-detail/02-body walks this array and emits a styled
   *  React element per block. */
  body: readonly BlogBodyBlock[];
  /** Optional short list of tags rendered under the body, mono style. */
  tags?: readonly string[];
  /** Optional source/reference links rendered at the very end. */
  sources?: ReadonlyArray<{ label: string; href: string }>;
}
