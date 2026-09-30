"use client";

import { useEffect, useRef, useState } from "react";
import { getColor, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatMm, formatPrice } from "@/lib/format";
import { useAnimatedNumber, useReducedMotion } from "@/lib/hooks";
import { computePrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";

/** Trois configurations réelles, calculées avec le vrai moteur de prix. */
const presets = [
  { productId: "fenetre", width: 1240, height: 1480, colorId: "anthracite" },
  { productId: "plissee", width: 1000, height: 2150, colorId: "blanc" },
  { productId: "coulissante", width: 1800, height: 2150, colorId: "sable" },
] as const;

/**
 * Démonstration du hero : la configuration change toutes les 4,5 s pour
 * montrer, sans un mot, que tout est personnalisable et chiffré en direct.
 * Pause hors écran, onglet masqué ou « réduire les animations ».
 */
export function HeroVisual() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || !inView) return;
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % presets.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, [reduced, paused, inView]);

  const preset = presets[index]!;
  const product = getProduct(preset.productId)!;
  const color = getColor(preset.colorId)!;
  const price = computePrice({ ...preset, meshId: "fibre", optionIds: [], quantity: 1 }).total;
  const shown = useAnimatedNumber(price, 600);

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[4/5] max-w-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-xl)] border border-line bg-gradient-to-b from-surface to-paper-2 shadow-[var(--shadow-lg)]">
        <div aria-hidden className="blueprint-grid absolute inset-0 opacity-70" />
        <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-sky/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -left-10 size-72 rounded-full bg-sand/25 blur-3xl" />
        <div key={index} className="absolute inset-0 animate-[fade-up_700ms_var(--ease-out)]">
          <ProductVisual
            kind={product.visual}
            color={color.hex}
            width={preset.width}
            height={preset.height}
            dimensions
            animated
            title={`${product.name}, coloris ${color.name}, ${preset.width} × ${preset.height} mm`}
            className="absolute inset-0 m-auto h-[82%] w-[88%]"
          />
        </div>
        {/* Sélecteur discret : l'utilisateur peut parcourir lui-même les exemples */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1" role="group" aria-label="Exemples de configurations">
          {presets.map((p, i) => (
            <button
              key={p.productId}
              type="button"
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
              aria-label={`Exemple ${i + 1} : ${getProduct(p.productId)!.name}`}
              aria-pressed={i === index}
              className="flex size-6 items-center justify-center"
            >
              <span className={cn("block h-1 rounded-full transition-[width,background-color] duration-[var(--dur-slow)]", i === index ? "w-6 bg-ink" : "w-2 bg-line-strong")} />
            </button>
          ))}
        </div>
      </div>

      <div
        aria-live="polite"
        className="absolute -right-3 top-6 w-56 rounded-[var(--radius-lg)] border border-line bg-surface/95 p-4 shadow-[var(--shadow-md)] backdrop-blur sm:-right-10 motion-safe:animate-[float_6s_var(--ease-in-out)_infinite]"
      >
        <p className="t-caption text-ink-3">Exemple de configuration</p>
        <dl className="mt-3 space-y-1.5 text-[0.8125rem]">
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Modèle</dt>
            <dd className="text-ink">{product.shortName}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Mesures</dt>
            <dd className="t-num text-ink">
              {formatMm(preset.width).replace(" mm", "")} × {formatMm(preset.height)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Coloris</dt>
            <dd className="flex items-center gap-1.5 text-ink">
              <span className="size-2.5 rounded-full border border-line-strong" style={{ background: color.hex }} />
              {color.name}
            </dd>
          </div>
        </dl>
        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
          <span className="text-[0.8125rem] text-ink-3">Prix TTC</span>
          <span className="t-num text-lg text-ink">{formatPrice(shown)}</span>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-full border border-line bg-surface/95 py-2 pl-2 pr-5 shadow-[var(--shadow-md)] backdrop-blur sm:-left-8 motion-safe:animate-[float_7s_var(--ease-in-out)_1s_infinite]"
      >
        <span
          className="size-12 rounded-full border border-line-strong"
          style={{
            backgroundColor: "#e9eef6",
            backgroundImage: "linear-gradient(to right, rgb(10 22 49/.45) 1px, transparent 1px), linear-gradient(to bottom, rgb(10 22 49/.45) 1px, transparent 1px)",
            backgroundSize: "5px 5px",
          }}
        />
        <span>
          <span className="block text-[0.8125rem] text-ink">Toile haute visibilité</span>
          <span className="t-caption text-ink-3">Vous voyez dehors</span>
        </span>
      </div>
    </div>
  );
}
