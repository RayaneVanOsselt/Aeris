/** Schéma de prise de mesures : trois largeurs (A, B, C) et trois hauteurs (D, E, F). */
export function MeasureGuideVisual({ className, label }: { className?: string; label: string }) {
  const sky = "#3563e9";
  const W = { x: 90, y: 60, w: 260, h: 320 };
  const widths = [0.12, 0.5, 0.88].map((p, i) => ({ y: W.y + W.h * p, label: "ABC"[i]! }));
  const heights = [0.12, 0.5, 0.88].map((p, i) => ({ x: W.x + W.w * p, label: "DEF"[i]! }));
  return (
    <svg viewBox="0 0 440 440" className={className} role="img" aria-label={label}>
      <rect x="40" y="20" width="360" height="400" rx="6" fill="#ece8dd" />
      <rect x={W.x - 14} y={W.y - 14} width={W.w + 28} height={W.h + 28} rx="3" fill="#fcfbf8" stroke="rgb(10 22 49/.3)" />
      <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="#e4ebf6" stroke="rgb(10 22 49/.35)" />
      <rect x={W.x - 22} y={W.y + W.h + 14} width={W.w + 44} height="10" rx="2" fill="#d9d2c3" />
      <g fontFamily="var(--font-mono)" fontSize="12" fill={sky}>
        {widths.map((l) => (
          <g key={l.label}>
            <path d={`M ${W.x + 4} ${l.y} H ${W.x + W.w - 4}`} stroke={sky} strokeWidth="1.4" strokeDasharray="5 4" />
            <path d={`M ${W.x + 4} ${l.y - 5} V ${l.y + 5} M ${W.x + W.w - 4} ${l.y - 5} V ${l.y + 5}`} stroke={sky} strokeWidth="1.4" />
            <circle cx={W.x + W.w / 2 + 50} cy={l.y} r="10" fill="#fcfbf8" stroke={sky} />
            <text x={W.x + W.w / 2 + 50} y={l.y + 4} textAnchor="middle">
              {l.label}
            </text>
          </g>
        ))}
        {heights.map((l) => (
          <g key={l.label}>
            <path d={`M ${l.x} ${W.y + 4} V ${W.y + W.h - 4}`} stroke="#7c5d3a" strokeWidth="1.4" strokeDasharray="5 4" />
            <circle cx={l.x} cy={W.y + W.h / 2 - 60} r="10" fill="#fcfbf8" stroke="#7c5d3a" />
            <text x={l.x} y={W.y + W.h / 2 - 56} textAnchor="middle" fill="#7c5d3a">
              {l.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
