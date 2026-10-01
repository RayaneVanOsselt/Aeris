"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/provider";
import type { Opening, Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { startingPrice } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "./ProductCard";

type Sort = "reco" | "prix" | "delai";

/** Grille filtrable : filtres en puces (pas de colonne latérale lourde), tri et état vide. */
export function CatalogGrid({ items, filters = ["fenetre", "porte", "baie"] }: { items: Product[]; filters?: Opening[] }) {
  const { m, f } = useI18n();
  const g = m.catalogGrid;
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
          <div role="group" aria-label={g.filterLabel} className="scroll-row -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
            {(["all", ...filters] as const).map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={filter === o}
                onClick={() => setFilter(o)}
                className={cn(
                  "h-10 shrink-0 rounded-full border px-4 text-sm transition-colors",
                  filter === o ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink",
                )}
              >
                {o === "all" ? g.all : m.catalog.openings[o].plural}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <p className="t-small text-ink-3" aria-live="polite">
            {f.plural(list.length, g.count)}
          </p>
          <label className="relative">
            <span className="sr-only">{g.sort}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm text-ink hover:border-ink-3"
            >
              {(Object.keys(g.sorts) as Sort[]).map((k) => (
                <option key={k} value={k}>
                  {g.sorts[k]}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-line-strong p-12 text-center text-ink-2">
          {g.empty}
          <button type="button" onClick={() => setFilter("all")} className="ml-2 text-ink underline underline-offset-4">
            {g.showAll}
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
