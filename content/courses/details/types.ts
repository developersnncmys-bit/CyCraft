/**
 * Per-slug detail content for the dynamic course page at
 * /courses/<slug>. The catalogue (content/courses/catalog.ts) supplies
 * the base record — title, level, duration, price, short description —
 * for every course; this file holds the long-form fields that only the
 * detail page needs.
 *
 * Detail content is OPTIONAL. If a slug exists in the catalogue but no
 * detail entry is registered, the page still renders the hero + enquiry
 * form using catalogue data alone. As each course's screenshot lands,
 * drop a new file in this folder and register it in `index.ts`.
 */
export interface CourseDetail {
  /** Must match the slug in content/courses/catalog.ts. */
  slug: string;
  /** Long-form paragraph rendered under the title in the hero. The short
   *  description on the catalogue card is intentionally separate so the
   *  card stays scannable while the detail page expands. */
  longDescription: string;
  /** Course Syllabus — rendered as a checked bullet list, left column
   *  on desktop alongside the sticky enquiry form. */
  syllabus: readonly string[];
  /** Prerequisites — rendered on the left of the "what you need / what
   *  you'll be able to do" block. */
  prerequisites: readonly string[];
  /** Learning Outcomes — rendered on the right of the same block. */
  outcomes: readonly string[];
}
