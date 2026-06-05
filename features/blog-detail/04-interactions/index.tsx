'use client';
/* Blog Detail Interactions — views, likes, and comments.
 *
 * Frontend-only for now: state is React-local, so views/likes/comments do
 * NOT persist across reloads or visitors. The component is structured so
 * the value bindings (viewCount, likeCount, comments) can be swapped for
 * a fetch/SWR hook against a real backend without changing the markup.
 */
import { useState } from 'react';

interface BlogDetailInteractionsProps {
  /** Unique key for the post — will be the storage key when a backend
   *  lands. Currently unused but accepted so the call site is final. */
  slug: string;
}

interface LocalComment {
  id: number;
  author: string;
  body: string;
  createdAt: number;
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function formatTimeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function BlogDetailInteractions({ slug: _slug }: BlogDetailInteractionsProps) {
  // Local-only state. Replace with API hooks once backend is wired up.
  const [viewCount] = useState(18);
  const [likeCount, setLikeCount] = useState(1);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [draft, setDraft] = useState('');

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: 'Anonymous', body, createdAt: Date.now() },
    ]);
    setDraft('');
  };

  return (
    <section
      id="bd-interactions"
      aria-label="Post interactions"
      style={{
        position: 'relative',
        background: 'transparent',
        paddingTop: 'clamp(2rem, 4vh, 3rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            maxWidth: '760px',
            marginInline: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* ── Title row: Interactions + view/like counters ─────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                lineHeight: 1.18,
                margin: 0,
              }}
            >
              Interactions
            </h2>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.2rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
                aria-label={`${viewCount} views`}
              >
                <EyeIcon /> {viewCount}
              </span>
              <button
                type="button"
                onClick={handleLike}
                aria-pressed={liked}
                aria-label={liked ? 'Unlike post' : 'Like post'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: liked ? 'var(--color-red-team)' : 'var(--color-text-tertiary)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  transition: 'color 0.2s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!liked) (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-red-team)';
                }}
                onMouseLeave={(e) => {
                  if (!liked) (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-tertiary)';
                }}
              >
                <HeartIcon filled={liked} /> {likeCount}
              </button>
            </div>
          </div>

          {/* ── Comments header ──────────────────────────────────────── */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--color-text-primary)',
            }}
          >
            <span style={{ color: 'var(--color-text-secondary)' }}>
              <CommentIcon />
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.1rem, 1.55vw, 1.3rem)',
                fontWeight: 700,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Comments ({comments.length})
            </h3>
          </div>

          {/* ── Comment list ─────────────────────────────────────────── */}
          {comments.length > 0 && (
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {comments.map((c) => (
                <li
                  key={c.id}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(13,16,20,0.55)',
                    border: '1px solid rgba(168,240,255,0.14)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span style={{ color: 'var(--color-beam)' }}>{c.author}</span>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>
                      {formatTimeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {c.body}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* ── Comment form ─────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Anonymous
            </span>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              aria-label="Comment body"
              style={{
                width: '100%',
                resize: 'vertical',
                minHeight: '110px',
                padding: '0.85rem 1rem',
                background: 'rgba(13,16,20,0.55)',
                border: '1px solid rgba(168,240,255,0.18)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                lineHeight: 1.6,
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-beam)';
                e.currentTarget.style.boxShadow = '0 0 0 1px var(--color-beam)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,240,255,0.18)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={!draft.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.25rem',
                  background: draft.trim() ? 'var(--color-red-team)' : 'rgba(255,61,90,0.35)',
                  color: '#fff',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: draft.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (draft.trim()) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 24px rgba(255,61,90,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                <SendIcon /> Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
