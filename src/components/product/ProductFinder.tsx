"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { track } from "@/lib/analytics";
import { getMesh, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { finderNeeds, finderUsages, type FinderNeed, type FinderOpening, type FinderUsageId } from "@/lib/finder";
import { startingPrice } from "@/lib/pricing";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductVisual } from "./ProductVisual";

const openingIds: FinderOpening[] = ["fenetre", "porte", "baie", "special"];

function Choice({ selected, onClick, label, hint }: { selected: boolean; onClick: () => void; label: string; hint?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] border p-4 text-left transition-[border-color,background-color] duration-[var(--dur-base)]",
        selected ? "border-ink bg-surface" : "border-line bg-surface/60 hover:border-ink-3 hover:bg-surface",
      )}
    >
      <span>
        <span className="block text-ink">{label}</span>
        {hint && <span className="t-small block text-ink-3">{hint}</span>}
      </span>
      <Icon name="arrowRight" size={18} className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/** Aide au choix en 3 questions — réduit l'hésitation avant le configurateur. */
export function ProductFinder() {
  const { m, href, f, t } = useI18n();
  const fm = m.finder;
  const [opening, setOpening] = useState<FinderOpening | null>(null);
  const [usage, setUsage] = useState<FinderUsageId | null>(null);
  const [need, setNeed] = useState<FinderNeed | null>(null);

  const step = !opening ? 0 : !usage ? 1 : !need ? 2 : 3;
  const usageChoice = opening ? finderUsages[opening].find((u) => u.id === usage) : undefined;
  const product = usageChoice ? getProduct(usageChoice.product) : undefined;
  const mesh = getMesh(finderNeeds.find((n) => n.id === need)?.mesh ?? "fibre");
  const openingChoice = (id: FinderOpening) => (id === "special" ? fm.special : { label: m.catalog.openings[id].label, hint: m.catalog.openings[id].description });

  const reset = () => {
    setOpening(null);
    setUsage(null);
    setNeed(null);
  };

  return (
    <div className="grid grid-cols-1 gap-8 rounded-[var(--radius-xl)] border border-line bg-paper-2/60 p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-10">
      <div>
        <div className="flex items-center gap-2" aria-hidden>
          {fm.questions.map((q, i) => (
            <span key={q} className={cn("h-1 flex-1 rounded-full transition-colors duration-[var(--dur-slow)]", i < step ? "bg-sky" : i === step ? "bg-ink" : "bg-line")} />
          ))}
        </div>
        <p className="t-caption mt-6 text-ink-3" aria-live="polite">
          {step < 3 ? t(fm.questionOf, { step: step + 1 }) : fm.recommendation}
        </p>

        {step < 3 ? (
          <div key={step} className="animate-fade-up">
            <h3 className="t-h3 mt-2 text-ink">{fm.questions[step]}</h3>
            <div className="mt-6 grid gap-2.5">
              {step === 0 &&
                openingIds.map((id) => (
                  <Choice
                    key={id}
                    selected={opening === id}
                    {...openingChoice(id)}
                    onClick={() => {
                      setOpening(id);
                      if (finderUsages[id].length === 1) setUsage(finderUsages[id][0]!.id);
                    }}
                  />
                ))}
              {step === 1 && opening && finderUsages[opening].map((u) => <Choice key={u.id} selected={usage === u.id} {...fm.usages[u.id]} onClick={() => setUsage(u.id)} />)}
              {step === 2 &&
                finderNeeds.map((n) => (
                  <Choice
                    key={n.id}
                    selected={need === n.id}
                    label={fm.needs[n.id]}
                    onClick={() => {
                      setNeed(n.id);
                      track("finder_completed", { product: usageChoice?.product ?? "", need: n.id });
                    }}
                  />
                ))}
            </div>
            {step > 0 && (
              <button type="button" onClick={step === 1 ? reset : () => setUsage(null)} className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={16} /> {m.common.back}
              </button>
            )}
          </div>
        ) : (
          product &&
          mesh && (
            <div className="animate-fade-up">
              <h3 className="t-h3 mt-2 text-ink">{m.catalog.products[product.id].name}</h3>
              <p className="mt-3 text-ink-2">{m.catalog.products[product.id].lead}</p>
              <ul className="mt-5 space-y-2 text-[0.9375rem] text-ink-2">
                <li className="flex gap-2.5">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-sky" />
                  <span>
                    <Rich text={t(fm.meshAdvice, { mesh: m.catalog.meshes[mesh.id].name })} strongClassName="font-medium text-ink" />
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-sky" />
                  {t(fm.priceFrom, { price: f.price(startingPrice(product)) })}
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`${href("configurator")}?modele=${product.id}&toile=${mesh.id}`} arrow>
                  {fm.configureThis}
                </ButtonLink>
                <ButtonLink href={href("product", product.id)} variant="secondary">
                  {m.common.seeProduct}
                </ButtonLink>
              </div>
              <button type="button" onClick={reset} className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={16} /> {fm.restart}
              </button>
            </div>
          )
        )}
      </div>

      <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
        <div aria-hidden className="blueprint-grid absolute inset-0" />
        {product ? (
          <ProductVisual
            key={product.id}
            kind={product.visual}
            color="#383C42"
            width={product.defaultSize.width}
            height={product.defaultSize.height}
            meshDensity={mesh?.density}
            meshStrand={mesh?.strand}
            animated
            title={m.catalog.products[product.id].name}
            className="relative h-72 w-full p-6"
          />
        ) : (
          <div className="relative grid grid-cols-3 gap-4 p-8 opacity-60" aria-hidden>
            {(["frame", "pleated", "roller"] as const).map((k) => (
              <ProductVisual key={k} kind={k} width={900} height={1500} className="h-32 w-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
