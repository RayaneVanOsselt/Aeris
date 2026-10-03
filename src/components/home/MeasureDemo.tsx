"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { frameColors, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { computePrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Icon } from "@/components/ui/Icon";

const swatches = frameColors.filter((c) => c.id !== "ral");

/** Démonstration : l'utilisateur éprouve le « sur mesure » en bougeant deux curseurs. */
export function MeasureDemo() {
  const { m, href, f, t } = useI18n();
  const product = getProduct("fenetre")!;
  const [w, setW] = useState(1100);
  const [h, setH] = useState(1350);
  const [colorId, setColorId] = useState("anthracite");
  const id = useId();
  const color = swatches.find((c) => c.id === colorId)!;
  const colorName = m.catalog.colors[color.id];
  const price = computePrice({ productId: product.id, width: w, height: h, meshId: "fibre", colorId, optionIds: [], quantity: 1 });
  const configureHref = `${href("configurator")}?modele=${product.id}&largeur=${w}&hauteur=${h}&coloris=${colorId}`;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-[300px] overflow-hidden rounded-[var(--radius-xl)] bg-paper-2 md:min-h-[380px]">
        <div aria-hidden className="blueprint-grid absolute inset-0" />
        <ProductVisual
          kind={product.visual}
          color={color.hex}
          width={w}
          height={h}
          dimensions
          title={t(m.home.measureDemo.preview, { width: f.number(w), height: f.number(h), color: colorName })}
          className="absolute inset-0 h-full w-full p-4"
        />
      </div>
      <div className="flex flex-col">
        {[
          { key: "w", label: m.common.width, value: w, set: setW, min: 400, max: 2000 },
          { key: "h", label: m.common.height, value: h, set: setH, min: 400, max: 2400 },
        ].map((s) => (
          <div key={s.key} className="mb-5">
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${id}-${s.key}`} className="text-sm text-ink-2">
                {s.label}
              </label>
              <output htmlFor={`${id}-${s.key}`} className="t-num text-lg text-ink">
                {f.number(s.value)} <span className="text-sm text-ink-3">{m.common.mm}</span>
              </output>
            </div>
            <input
              id={`${id}-${s.key}`}
              type="range"
              min={s.min}
              max={s.max}
              step={10}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-sky)]"
            />
          </div>
        ))}
        <fieldset>
          <legend className="text-sm text-ink-2">{t(m.home.measureDemo.colorLegend, { color: colorName })}</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {swatches.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === colorId}
                aria-label={m.catalog.colors[c.id]}
                title={m.catalog.colors[c.id]}
                onClick={() => setColorId(c.id)}
                className={cn(
                  "size-8 rounded-full border border-line-strong ring-offset-2 ring-offset-surface transition-shadow",
                  c.id === colorId && "ring-2 ring-sky",
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </fieldset>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
          <p>
            <span className="t-caption block text-ink-3">{m.common.priceStandardMesh}</span>
            <span className="t-num font-serif text-4xl font-light tracking-[-0.03em] text-ink" aria-live="polite">
              {f.price(price.total)}
            </span>
          </p>
          <Link href={configureHref} className="inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
            {m.common.continue} <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
