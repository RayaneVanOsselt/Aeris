import { useId } from "react";
import type { VisualKind } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

type Props = {
  kind: VisualKind;
  /** Couleur du profilé */
  color?: string;
  /** Dimensions réelles (mm) : pilotent les proportions du dessin */
  width?: number;
  height?: number;
  /** Densité de la trame (fils par 10 px) et épaisseur du fil */
  meshDensity?: number;
  meshStrand?: number;
  /** Affiche les cotes (lignes de dimension façon plan d'architecte) */
  dimensions?: boolean;
  reinforced?: boolean;
  className?: string;
  title?: string;
  /** Animation d'entrée (toile qui se déroule, cotes qui se dessinent) */
  animated?: boolean;
};

const MAX = 300;
const PAD = 44;

/** Luminance approximative pour choisir un contour lisible sur fond clair. */
function isLight(hex: string) {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
  return (0.299 * (r ?? 0) + 0.587 * (g ?? 0) + 0.114 * (b ?? 0)) / 255 > 0.7;
}

/**
 * Illustration technique d'un modèle Aéris, proportionnelle aux dimensions.
 * Remplace les photos d'ambiance génériques : elle montre toujours le bon
 * produit, dans le bon coloris, et sert d'aperçu dans le configurateur.
 */
export function ProductVisual({
  kind,
  color = "#383C42",
  width = 1000,
  height = 1300,
  meshDensity = 9,
  meshStrand = 0.9,
  dimensions = false,
  reinforced = false,
  className,
  title,
  animated = false,
}: Props) {
  const uid = useId().replace(/[:«»]/g, "");
  const ratio = width / height;
  const W = Math.max(96, ratio >= 1 ? MAX : MAX * ratio);
  const H = Math.max(96, ratio >= 1 ? MAX / ratio : MAX);
  const x = PAD;
  const y = PAD * 0.6;
  const vbW = W + PAD * 2;
  const vbH = H + PAD * 1.9;
  const f = reinforced ? 12 : 9; // épaisseur du profilé
  const stroke = isLight(color) ? "rgb(10 22 49 / 0.28)" : "rgb(10 22 49 / 0.55)";
  const spacing = Math.max(2.2, 30 / meshDensity);
  const inner = { x: x + f, y: y + f, w: W - f * 2, h: H - f * 2 };

  const meshFill = `url(#mesh-${uid})`;
  const lightFill = `url(#light-${uid})`;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={className}
      role="img"
      aria-label={title ?? "Illustration du modèle"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`light-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#dfe8f8" />
          <stop offset="0.55" stopColor="#eef0f0" />
          <stop offset="1" stopColor="#f4ebdc" />
        </linearGradient>
        <pattern id={`mesh-${uid}`} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <path
            d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
            fill="none"
            stroke="rgb(10 22 49 / 0.32)"
            strokeWidth={meshStrand * 0.45}
          />
        </pattern>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} />
        </clipPath>
      </defs>

      {/* Ombre portée douce */}
      <rect x={x + 6} y={y + 10} width={W} height={H} rx="3" fill="rgb(10 22 49 / 0.07)" />

      {kind === "custom" ? (
        <CustomShape x={x} y={y} W={W} H={H} f={f} color={color} stroke={stroke} light={lightFill} mesh={meshFill} uid={uid} />
      ) : (
        <>
          {/* Profilé */}
          <rect x={x} y={y} width={W} height={H} rx="3" fill={color} stroke={stroke} strokeWidth="1" />
          {/* Ce que l'on voit à travers : lumière du jour */}
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={lightFill} />
          <g clipPath={`url(#clip-${uid})`}>
            <g
              style={
                animated
                  ? { transformOrigin: `0 ${inner.y}px`, animation: "unroll 1.4s var(--ease-out) 0.3s both" }
                  : undefined
              }
            >
              <KindDetails kind={kind} inner={inner} color={color} stroke={stroke} mesh={meshFill} />
            </g>
            <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={`url(#sheen-${uid})`} />
          </g>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill="none" stroke={stroke} strokeWidth="0.75" />
          <KindHardware kind={kind} x={x} y={y} W={W} H={H} f={f} color={color} stroke={stroke} />
        </>
      )}

      {dimensions && <Dimensions x={x} y={y} W={W} H={H} width={width} height={height} animated={animated} />}
    </svg>
  );
}

type Box = { x: number; y: number; w: number; h: number };

function KindDetails({ kind, inner, color, stroke, mesh }: { kind: VisualKind; inner: Box; color: string; stroke: string; mesh: string }) {
  const { x, y, w, h } = inner;
  switch (kind) {
    case "pleated": {
      // Toile plissée : repli en accordéon, pack de plis à gauche, barre de manœuvre au 2/3
      const bar = x + w * 0.66;
      const folds = Math.max(8, Math.round((bar - x) / 7));
      const step = (bar - x) / folds;
      return (
        <>
          <rect x={x} y={y} width={bar - x} height={h} fill={mesh} />
          {Array.from({ length: folds }, (_, i) => (
            <rect key={i} x={x + i * step} y={y} width={step / 2} height={h} fill="rgb(10 22 49 / 0.05)" />
          ))}
          <rect x={bar - 3} y={y} width="6" height={h} fill={color} stroke={stroke} strokeWidth="0.75" />
        </>
      );
    }
    case "sliding": {
      const half = w / 2;
      return (
        <>
          <rect x={x + half - 4} y={y} width={half + 4} height={h} fill={mesh} />
          <rect x={x + half - 6} y={y} width="6" height={h} fill={color} stroke={stroke} strokeWidth="0.75" />
          <rect x={x + half + w * 0.18} y={y + h * 0.48} width="3" height={h * 0.08} rx="1.5" fill={stroke} />
        </>
      );
    }
    case "magnetic": {
      const mid = x + w / 2;
      return (
        <>
          <rect x={x} y={y} width={w} height={h} fill={mesh} />
          <path d={`M ${mid} ${y} V ${y + h}`} stroke="rgb(10 22 49 / 0.35)" strokeWidth="1.2" strokeDasharray="1 7" />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx={mid} cy={y + ((i + 1) * h) / 8} r="2.2" fill={color} stroke={stroke} strokeWidth="0.6" />
          ))}
        </>
      );
    }
    case "hinged":
      return (
        <>
          <rect x={x} y={y} width={w} height={h} fill={mesh} />
          <rect x={x} y={y + h * 0.5 - 4} width={w} height="8" fill={color} stroke={stroke} strokeWidth="0.75" />
        </>
      );
    default:
      return <rect x={x} y={y} width={w} height={h} fill={mesh} />;
  }
}

function KindHardware({
  kind,
  x,
  y,
  W,
  H,
  f,
  color,
  stroke,
}: {
  kind: VisualKind;
  x: number;
  y: number;
  W: number;
  H: number;
  f: number;
  color: string;
  stroke: string;
}) {
  switch (kind) {
    case "frame":
      // Clips de fixation + tirettes
      return (
        <g fill={color} stroke={stroke} strokeWidth="0.75">
          {[0.18, 0.82].map((p) => (
            <rect key={`t${p}`} x={x + W * p - 7} y={y - 5} width="14" height="6" rx="1.5" />
          ))}
          {[0.18, 0.82].map((p) => (
            <rect key={`b${p}`} x={x + W * p - 9} y={y + H - 2} width="18" height="7" rx="2" />
          ))}
        </g>
      );
    case "fixed":
      return (
        <g stroke={stroke} strokeWidth="0.75">
          <path d={`M ${x} ${y} L ${x + f} ${y + f} M ${x + W} ${y} L ${x + W - f} ${y + f} M ${x} ${y + H} L ${x + f} ${y + H - f} M ${x + W} ${y + H} L ${x + W - f} ${y + H - f}`} />
        </g>
      );
    case "roller":
      // Coffre haut + barre de manœuvre basse
      return (
        <g fill={color} stroke={stroke} strokeWidth="0.75">
          <rect x={x - 4} y={y - 6} width={W + 8} height={f + 14} rx="4" />
          <rect x={x + f} y={y + H - f - 8} width={W - f * 2} height="8" />
          <rect x={x + W / 2 - 14} y={y + H - f - 5} width="28" height="3" rx="1.5" fill={stroke} stroke="none" />
        </g>
      );
    case "pleated":
    case "sliding":
      return (
        <g fill={color} stroke={stroke} strokeWidth="0.75">
          <rect x={x - 3} y={y - 4} width={W + 6} height="8" rx="2" />
          <rect x={x - 3} y={y + H - 3} width={W + 6} height="5" rx="1.5" />
        </g>
      );
    case "hinged":
      return (
        <g fill={color} stroke={stroke} strokeWidth="0.75">
          {[0.14, 0.5, 0.86].map((p) => (
            <rect key={p} x={x - 4} y={y + H * p - 9} width="6" height="18" rx="1.5" />
          ))}
          <rect x={x + W - f - 2} y={y + H * 0.46} width="4" height={H * 0.08} rx="2" fill={stroke} stroke="none" />
        </g>
      );
    case "magnetic":
      return (
        <g fill={color} stroke={stroke} strokeWidth="0.75">
          <rect x={x - 3} y={y - 3} width={W + 6} height={f + 4} rx="2" />
        </g>
      );
    default:
      return null;
  }
}

function CustomShape({
  x,
  y,
  W,
  H,
  f,
  color,
  stroke,
  light,
  mesh,
  uid,
}: {
  x: number;
  y: number;
  W: number;
  H: number;
  f: number;
  color: string;
  stroke: string;
  light: string;
  mesh: string;
  uid: string;
}) {
  // Forme atypique : fenêtre cintrée (arc en plein cintre)
  const r = Math.min(W / 2, H * 0.4);
  const outer = `M ${x} ${y + H} V ${y + r} A ${r} ${r * 0.9} 0 0 1 ${x + W} ${y + r} V ${y + H} Z`;
  const ri = r - f;
  const inner = `M ${x + f} ${y + H - f} V ${y + r} A ${ri} ${ri * 0.9} 0 0 1 ${x + W - f} ${y + r} V ${y + H - f} Z`;
  return (
    <>
      <path d={outer} fill={color} stroke={stroke} strokeWidth="1" />
      <path d={inner} fill={light} />
      <clipPath id={`arch-${uid}`}>
        <path d={inner} />
      </clipPath>
      <rect x={x} y={y} width={W} height={H} fill={mesh} clipPath={`url(#arch-${uid})`} />
      <path d={inner} fill="none" stroke={stroke} strokeWidth="0.75" />
      <path d={`M ${x + W / 2} ${y + f + 2} V ${y + H - f}`} stroke={color} strokeWidth="4" />
    </>
  );
}

function Dimensions({ x, y, W, H, width, height, animated }: { x: number; y: number; W: number; H: number; width: number; height: number; animated: boolean }) {
  const sky = "#3563e9";
  const by = y + H + 22;
  const rx = x - 22;
  const drawStyle = (len: number, delay: number) =>
    animated
      ? ({ strokeDasharray: len, "--len": len, animation: `draw 1.1s var(--ease-out) ${delay}s both` } as React.CSSProperties)
      : undefined;
  return (
    <g fontFamily="var(--font-mono)" fontSize="10" fill={sky}>
      {/* Largeur */}
      <g stroke={sky} strokeWidth="0.8">
        <path d={`M ${x} ${y + H + 8} V ${by + 5} M ${x + W} ${y + H + 8} V ${by + 5}`} opacity="0.5" />
        <path d={`M ${x} ${by} H ${x + W}`} style={drawStyle(W, 0.6)} />
        <path d={`M ${x - 3} ${by + 3} L ${x + 3} ${by - 3} M ${x + W - 3} ${by + 3} L ${x + W + 3} ${by - 3}`} strokeWidth="1.2" />
      </g>
      <rect x={x + W / 2 - 34} y={by - 8} width="68" height="16" rx="3" fill="#f6f4ee" />
      <text x={x + W / 2} y={by + 3.5} textAnchor="middle" letterSpacing="0.3">
        {formatNumber(width)} mm
      </text>
      {/* Hauteur */}
      <g stroke={sky} strokeWidth="0.8">
        <path d={`M ${x - 8} ${y} H ${rx - 5} M ${x - 8} ${y + H} H ${rx - 5}`} opacity="0.5" />
        <path d={`M ${rx} ${y} V ${y + H}`} style={drawStyle(H, 0.8)} />
        <path d={`M ${rx - 3} ${y + 3} L ${rx + 3} ${y - 3} M ${rx - 3} ${y + H + 3} L ${rx + 3} ${y + H - 3}`} strokeWidth="1.2" />
      </g>
      <g transform={`translate(${rx} ${y + H / 2}) rotate(-90)`}>
        <rect x="-34" y="-8" width="68" height="16" rx="3" fill="#f6f4ee" />
        <text x="0" y="3.5" textAnchor="middle" letterSpacing="0.3">
          {formatNumber(height)} mm
        </text>
      </g>
    </g>
  );
}
