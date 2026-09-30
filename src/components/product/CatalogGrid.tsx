"use client";

import { useMemo, useState } from "react";
import { openings, type Opening, type Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { startingPrice } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "./ProductCard";

type Sort = "reco" | "prix" | "delai";
const sorts: Record<Sort, string> = { reco: "Recommandés", prix: "Prix croissant", delai: "Délai le plus court" };

/** Grille filtrable : filtres en puces (pas de colonne latérale lourde), tri et état vide. */
export function CatalogGrid({ items, filters = ["fenetre", "porte", "baie"] }: { items: Product[]; filters?: Opening[] }) {
  const [filter, setFilter] = useState<Opening | "all">("all");
  const [sort, setSort] = useState<Sort>("reco");

  const list = useMemo(() => {
    const filtered = filter === "all" ? items : items.filter((p) => p.openings.includes(filter));
    const sorted = [...filtered];
    if (sort === "prix") sorted.sort((a, b) => startingPrice(a) - startingPrice(b));
    if (sort === "delai") sorted.sort((a, b) => a.leadTimeDays[1] - b.leadTimeDays[1]);
    return sorted;
  }, [items, filter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        {filters.length > 1 ? (
          <div role="group" aria-label="Filtrer par ouverture" className="scroll-row -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
            {(["all", ...filters] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-10 shrink-0 rounded-full border px-4 text-sm transition-colors",
                  filter === f ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink",
                )}
              >
                {f === "all" ? "Tous" : openings[f].plural}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <p className="t-small text-ink-3" aria-live="polite">
            {list.length} modèle{list.length > 1 ? "s" : ""}
          </p>
          <label className="relative">
            <span className="sr-only">Trier</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm text-ink hover:border-ink-3"
            >
              {Object.entries(sorts).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-line-strong p-12 text-center text-ink-2">
          Aucun modèle ne correspond.
          <button type="button" onClick={() => setFilter("all")} className="ml-2 text-ink underline underline-offset-4">
            Voir tous les modèles
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ "--delay": `${i * 50}ms` } as React.CSSProperties}>
              <ProductCard product={p} className="h-full" headingLevel="h2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
