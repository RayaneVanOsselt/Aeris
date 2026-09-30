"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { getProduct, products } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { payment } from "@/lib/business";
import { cn } from "@/lib/cn";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Icon } from "@/components/ui/Icon";

const minLead = Math.min(...products.map((p) => p.leadTimeDays[0]));
const maxLead = Math.max(...products.map((p) => p.leadTimeDays[1]));

const steps: Array<{ title: string; text: string; visual: ReactNode }> = [
  {
    title: "Choisissez votre modèle",
    text: "Selon votre ouverture et votre usage. Un doute ? L'aide au choix ou notre assistant vous oriente en quelques secondes.",
    visual: <ModelsVisual />,
  },
  {
    title: "Mesurez votre ouverture",
    text: "Largeur et hauteur, en millimètres. Notre guide illustré vous montre où mesurer selon le modèle.",
    visual: <MeasureVisual />,
  },
  {
    title: "Configurez, voyez le prix",
    text: "Toile, coloris, options : le prix TTC se met à jour à chaque choix. Vous pouvez aussi nous envoyer votre configuration pour un devis.",
    visual: <PriceVisual />,
  },
  {
    title: "Commandez sans créer de compte",
    text: `Vos coordonnées, puis le paiement par ${payment.methods.join(" ou ")}. La fabrication démarre à réception du paiement.`,
    visual: <PayVisual />,
  },
  {
    title: "Recevez, posez, respirez",
    text: `Fabrication en ${minLead} à ${maxLead} jours ouvrés selon le modèle. Date de livraison confirmée par e-mail, notice de pose fournie.`,
    visual: <DeliveryVisual />,
  },
];

/** Défilement narratif : le visuel reste fixe, les étapes défilent (desktop). */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+3rem)]">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-[var(--shadow-md)]">
            <div aria-hidden className="blueprint-grid absolute inset-0" />
            {steps.map((s, i) => (
              <div
                key={s.title}
                aria-hidden={active !== i}
                className={cn(
                  "absolute inset-0 flex items-center justify-center p-10 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
                  active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                {s.visual}
              </div>
            ))}
            <div className="absolute inset-x-6 bottom-6 flex gap-1.5" aria-hidden>
              {steps.map((s, i) => (
                <span key={s.title} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full rounded-full bg-sky transition-[width] duration-[var(--dur-slower)] ease-[var(--ease-out)]"
                    style={{ width: i <= active ? "100%" : "0%" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ol className="relative">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className="relative border-l border-line py-8 pl-8 lg:flex lg:min-h-[52vh] lg:flex-col lg:justify-center lg:py-0 lg:pl-12"
          >
            <span
              aria-hidden
              className={cn(
                "absolute -left-px top-8 w-px bg-sky transition-[height] duration-[var(--dur-slower)] ease-[var(--ease-out)] lg:top-1/2 lg:-translate-y-1/2",
                active === i ? "h-24" : "h-0",
              )}
            />
            <p className={cn("t-num text-sm transition-colors", active === i ? "text-sky" : "text-ink-3")}>0{i + 1}</p>
            <h3 className={cn("t-h3 mt-3 transition-colors duration-[var(--dur-base)]", active === i ? "text-ink" : "text-ink-2 lg:text-ink-3")}>
              {s.title}
            </h3>
            <p className="mt-3 max-w-md text-ink-2">{s.text}</p>
            <div className="mt-8 flex aspect-[5/4] items-center justify-center rounded-[var(--radius-lg)] border border-line bg-surface p-6 lg:hidden">
              {s.visual}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ModelsVisual() {
  const picks = products.filter((p) => ["fenetre", "plissee", "enroulable"].includes(p.id));
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3">
      {picks.map((p, i) => (
        <div
          key={p.id}
          className={cn(
            "flex flex-col items-center gap-3 rounded-[var(--radius-md)] border bg-surface p-3 text-center",
            i === 0 ? "border-ink shadow-[var(--shadow-md)]" : "border-line",
          )}
        >
          <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} className="h-24 w-full" title={p.name} />
          <span className="text-xs text-ink">{p.shortName}</span>
          {i === 0 && <Icon name="check" size={16} className="text-sky" />}
        </div>
      ))}
    </div>
  );
}

function MeasureVisual() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      {[
        ["Largeur", "1 240"],
        ["Hauteur", "1 480"],
      ].map(([label, value]) => (
        <div key={label} className="rounded-[var(--radius-md)] border border-line bg-surface p-4 shadow-[var(--shadow-xs)]">
          <p className="text-xs text-ink-3">{label}</p>
          <p className="t-num mt-1 text-3xl font-light text-ink">
            {value} <span className="text-base text-ink-3">mm</span>
          </p>
        </div>
      ))}
      <p className="flex items-center gap-2 text-xs text-ink-3">
        <Icon name="info" size={14} className="text-sky" />
        Mesurez en trois points, notez la plus petite valeur.
      </p>
    </div>
  );
}

function PriceVisual() {
  const product = getProduct("fenetre")!;
  const price = computePrice({ productId: product.id, width: 1240, height: 1480, meshId: "fibre", colorId: "anthracite", optionIds: [], quantity: 1 });
  const [min, max] = product.leadTimeDays;
  return (
    <div className="w-full max-w-sm rounded-[var(--radius-lg)] bg-night p-6 text-on-night shadow-[var(--shadow-lg)]">
      <p className="t-caption text-on-night-2">Prix estimé TTC</p>
      <p className="t-num mt-2 text-5xl font-light">{formatPrice(price.total)}</p>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line-night pt-4 text-xs">
        {[
          ["Toile", "Fibre"],
          ["Coloris", "Anthracite"],
          ["Délai", `${min}–${max} j`],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-on-night-2">{k}</p>
            <p className="mt-0.5">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayVisual() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      {payment.methods.map((m, i) => (
        <div key={m} className={cn("flex items-center gap-4 rounded-[var(--radius-md)] border bg-surface p-4", i === 0 ? "border-ink" : "border-line")}>
          <span className={cn("flex size-10 items-center justify-center rounded-full", i === 0 ? "bg-ink text-paper" : "bg-paper-2 text-ink")}>
            <Icon name={i === 0 ? "sparkle" : "home"} size={18} />
          </span>
          <span className="flex-1 text-sm text-ink">{m}</span>
          <span className={cn("size-4 rounded-full border", i === 0 ? "border-[5px] border-ink" : "border-line-strong")} />
        </div>
      ))}
      <p className="flex items-center gap-2 text-xs text-ink-3">
        <Icon name="lock" size={14} className="text-sky" />
        Vos données bancaires ne passent pas par ce site.
      </p>
    </div>
  );
}

function DeliveryVisual() {
  const stages = ["Paiement reçu", "Fabrication", "Expédition", "Chez vous"];
  return (
    <div className="w-full max-w-sm">
      <ol className="relative space-y-5 border-l border-line pl-6">
        {stages.map((s, i) => (
          <li key={s} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] top-0.5 flex size-4 items-center justify-center rounded-full border-2",
                i < 3 ? "border-sky bg-sky" : "border-line-strong bg-surface",
              )}
            >
              {i < 3 && <Icon name="check" size={10} strokeWidth={3} className="text-white" />}
            </span>
            <p className="text-sm text-ink">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
