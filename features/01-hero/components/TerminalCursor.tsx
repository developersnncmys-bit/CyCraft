/* hero-cursor-el — outer wrapper is the GSAP target (opacity, scale, scaleX).
 * Inner div carries the CSS blink so GSAP's scrubbed opacity doesn't fight it. */
export function TerminalCursor() {
  return (
    <div
      className="hero-cursor-el"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '3px',
        height: '26px',
        marginLeft: '-1px',
        marginTop: '-13px',
        transformOrigin: 'center',
        zIndex: 10,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--color-beam-core)',
          animation: 'cursor-blink 1s step-end infinite',
        }}
      />
    </div>
  );
}
