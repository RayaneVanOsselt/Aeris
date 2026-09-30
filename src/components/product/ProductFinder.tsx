"use client";

import { useState } from "react";
import { getMesh, getProduct, openings } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { finderNeeds, finderUsages, type FinderNeed, type FinderOpening } from "@/lib/finder";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductVisual } from "./ProductVisual";

const openingChoices: Array<{ id: FinderOpening; label: string; hint: string }> = [
  { id: "fenetre", label: openings.fenetre.label, hint: openings.fenetre.description },
  { id: "porte", label: openings.porte.label, hint: openings.porte.description },
  { id: "baie", label: openings.baie.label, hint: openings.baie.description },
  { id: "special", label: "Hors normes", hint: "Très grande ou de forme spéciale" },
];

/** Aide au choix en 3 questions — réduit l'hésitation avant le configurateur. */
export function ProductFinder() {
  const [opening, setOpening] = useState<FinderOpening | null>(null);
  const [usage, setUsage] = useState<string | null>(null);
  const [need, setNeed] = useState<FinderNeed | null>(null);

  const step = !opening ? 0 : !usage ? 1 : !need ? 2 : 3;
  const usageChoice = opening ? finderUsages[opening].find((u) => u.id === usage) : undefined;
  const product = usageChoice ? getProduct(usageChoice.product) : undefined;
  const mesh = getMesh(finderNeeds.find((n) => n.id === need)?.mesh ?? "fibre");

  const reset = () => {
    setOpening(null);
    setUsage(null);
    setNeed(null);
  };

  const Choice = ({ selected, onClick, label, hint }: { selected: boolean; onClick: () => void; label: string; hint?: string }) => (
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

  const questions = ["Quelle ouverture ?", "Comment l'utilisez-vous ?", "Un besoin particulier ?"];

  return (
    <div className="grid grid-cols-1 gap-8 rounded-[var(--radius-xl)] border border-line bg-paper-2/60 p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-10">
      <div>
        <div className="flex items-center gap-2" aria-hidden>
          {questions.map((q, i) => (
            <span key={q} className={cn("h-1 flex-1 rounded-full transition-colors duration-[var(--dur-slow)]", i < step ? "bg-sky" : i === step ? "bg-ink" : "bg-line")} />
          ))}
        </div>
        <p className="t-caption mt-6 text-ink-3" aria-live="polite">
          {step < 3 ? `Question ${step + 1} sur 3` : "Notre recommandation"}
        </p>

        {step < 3 ? (
          <div key={step} className="animate-fade-up">
            <h3 className="t-h3 mt-2 text-ink">{questions[step]}</h3>
            <div className="mt-6 grid gap-2.5">
              {step === 0 &&
                openingChoices.map((o) => (
                  <Choice
                    key={o.id}
                    selected={opening === o.id}
                    label={o.label}
                    hint={o.hint}
                    onClick={() => {
                      setOpening(o.id);
                      if (finderUsages[o.id].length === 1) setUsage(finderUsages[o.id][0]!.id);
                    }}
                  />
                ))}
              {step === 1 &&
                opening &&
                finderUsages[opening].map((u) => <Choice key={u.id} selected={usage === u.id} label={u.label} hint={u.hint} onClick={() => setUsage(u.id)} />)}
              {step === 2 &&
                finderNeeds.map((n) => (
                  <Choice
                    key={n.id}
                    selected={need === n.id}
                    label={n.label}
                    onClick={() => {
                      setNeed(n.id);
                      track("finder_completed", { product: usageChoice?.product ?? "", need: n.id });
                    }}
                  />
                ))}
            </div>
            {step > 0 && (
              <button type="button" onClick={step === 1 ? reset : () => setUsage(null)} className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={16} /> Retour
              </button>
            )}
          </div>
        ) : (
          product &&
          mesh && (
            <div className="animate-fade-up">
              <h3 className="t-h3 mt-2 text-ink">{product.name}</h3>
              <p className="mt-3 text-ink-2">{product.lead}</p>
              <ul className="mt-5 space-y-2 text-[0.9375rem] text-ink-2">
                <li className="flex gap-2.5">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-sky" />
                  Toile conseillée : <strong className="font-medium text-ink">{mesh.name}</strong>
                </li>
                <li className="flex gap-2.5">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-sky" />
                  Dès {formatPrice(startingPrice(product))} TTC, prix exact selon vos dimensions
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/configurateur?modele=${product.id}&toile=${mesh.id}`} arrow>
                  Configurer ce modèle
                </ButtonLink>
                <ButtonLink href={`/produits/${product.slug}`} variant="secondary">
                  Voir la fiche
                </ButtonLink>
              </div>
              <button type="button" onClick={reset} className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={16} /> Recommencer
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
            title={product.name}
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
