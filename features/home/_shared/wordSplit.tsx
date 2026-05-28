import type { CSSProperties } from 'react';

/**
 * Split a string into per-word <span data-word> elements. Used by GSAP
 * scrub timelines to animate each word independently (opacity, y, blur).
 *
 * Each word is `display: inline-block` so transforms don't disrupt line flow.
 */
export function WordSplit({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const words = text.split(/(\s+)/);
  return (
    <span className={className} style={style}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        return (
          <span
            key={i}
            data-word
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity, filter',
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
