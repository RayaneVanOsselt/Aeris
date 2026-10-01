"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { products, type Opening } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";

const tabs: Opening[] = ["fenetre", "porte", "baie"];

/** Solutions par type d'ouverture : on part de ce que le client connaît (son ouverture), pas du jargon produit. */
export function Solutions() {
  const { m, href } = useI18n();
  const so = m.home.solutions;
  const [active, setActive] = useState<Opening>("fenetre");
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const list = products.filter((p) => p.openings.includes(active) && p.id !== "sur-mesure-plus");

  const onKey = (e: KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(tabs[next]!);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={so.tabs} className="inline-flex rounded-full border border-line bg-surface p-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`tab-${t}`}
            aria-selected={active === t}
            aria-controls={`panel-${t}`}
            tabIndex={active === t ? 0 : -1}
            onClick={() => setActive(t)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "relative h-11 rounded-full px-5 text-[0.9375rem] transition-colors duration-[var(--dur-base)] sm:px-6",
              active === t ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
            )}
          >
            {m.catalog.openings[t].plural}
          </button>
        ))}
      </div>
      <p className="t-small mt-4 text-ink-3" aria-live="polite">
        {m.catalog.openings[active].description}
      </p>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        key={active}
        className="scroll-row -mx-[var(--gutter)] mt-10 flex gap-4 overflow-x-auto px-[var(--gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]"
      >
        {list.map((p, i) => (
          <div key={p.id} className="animate-fade-up w-[78%] shrink-0 snap-start sm:w-auto" style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}>
            <ProductCard product={p} className="h-full" />
          </div>
        ))}
        <Link
          href={href("product", "sur-mesure-plus")}
          className="animate-fade-up group relative flex min-h-64 w-[78%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] bg-night p-6 text-on-night sm:w-auto"
          style={{ "--delay": `${list.length * 70}ms` } as React.CSSProperties}
        >
          <span aria-hidden className="mesh-texture-night absolute inset-0" />
          <span className="relative t-caption text-on-night-2">{so.customEyebrow}</span>
          <span className="relative">
            <span className="block text-2xl font-light leading-tight tracking-[-0.03em]">
              <Rich text={so.customTitle} accentClassName="accent text-sand" />
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm">
              {so.customCta} <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
