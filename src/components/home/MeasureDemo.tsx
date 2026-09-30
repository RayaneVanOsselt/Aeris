"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { frameColors, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Icon } from "@/components/ui/Icon";

const swatches = frameColors.filter((c) => c.id !== "ral");

/** Démonstration : l'utilisateur éprouve le « sur mesure » en bougeant deux curseurs. */
export function MeasureDemo() {
  const product = getProduct("fenetre")!;
  const [w, setW] = useState(1100);
  const [h, setH] = useState(1350);
  const [colorId, setColorId] = useState("anthracite");
  const id = useId();
  const color = swatches.find((c) => c.id === colorId)!;
  const price = computePrice({ productId: product.id, width: w, height: h, meshId: "fibre", colorId, optionIds: [], quantity: 1 });
  const href = `/configurateur?modele=${product.id}&largeur=${w}&hauteur=${h}&coloris=${colorId}`;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-[300px] rounded-[var(--radius-lg)] bg-paper-2 md:min-h-[360px]">
        <div aria-hidden className="blueprint-grid absolute inset-0 rounded-[var(--radius-lg)]" />
        <ProductVisual
          kind={product.visual}
          color={color.hex}
          width={w}
          height={h}
          dimensions
          title={`Aperçu : ${w} × ${h} mm, ${color.name}`}
          className="absolute inset-0 h-full w-full p-4"
        />
      </div>
      <div className="flex flex-col">
        {[
          { key: "w", label: "Largeur", value: w, set: setW, min: 400, max: 2000 },
          { key: "h", label: "Hauteur", value: h, set: setH, min: 400, max: 2400 },
        ].map((s) => (
          <div key={s.key} className="mb-5">
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${id}-${s.key}`} className="text-sm text-ink-2">
                {s.label}
              </label>
              <output htmlFor={`${id}-${s.key}`} className="t-num text-lg text-ink">
                {s.value.toLocaleString("fr-BE")} <span className="text-sm text-ink-3">mm</span>
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
          <legend className="text-sm text-ink-2">Coloris : {color.name}</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {swatches.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === colorId}
                aria-label={c.name}
                title={c.name}
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
            <span className="t-caption block text-ink-3">Prix TTC, toile standard</span>
            <span className="t-num text-3xl font-light text-ink" aria-live="polite">
              {formatPrice(price.total)}
            </span>
          </p>
          <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
            Continuer <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
