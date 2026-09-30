"use client";

import { useMemo, useState } from "react";
import type { FaqCategory } from "@/lib/faq";
import { cn } from "@/lib/cn";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** FAQ avec recherche instantanée (insensible aux accents) et navigation par catégorie. */
export function FaqExplorer({ categories }: { categories: FaqCategory[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const q = normalize(query.trim());

  const filtered = useMemo(
    () =>
      categories
        .filter((c) => active === "all" || c.id === active)
        .map((c) => ({ ...c, items: q ? c.items.filter((i) => normalize(`${i.q} ${i.a}`).includes(q)) : c.items }))
        .filter((c) => c.items.length > 0),
    [categories, active, q],
  );
  const count = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <label className="relative block">
            <span className="sr-only">Rechercher une question</span>
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-ink outline-none focus:border-sky"
            />
          </label>
          <nav aria-label="Catégories" className="scroll-row -mx-[var(--gutter)] mt-5 flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
            {[{ id: "all", title: "Toutes les questions" }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={active === c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "h-10 shrink-0 rounded-full px-4 text-left text-sm transition-colors lg:rounded-[var(--radius-md)]",
                  active === c.id ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2 hover:text-ink",
                )}
              >
                {c.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <div className="lg:col-span-9">
        <p className="t-small mb-6 text-ink-3" aria-live="polite">
          {count} question{count > 1 ? "s" : ""}
          {q ? ` pour « ${query.trim()} »` : ""}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-10 text-center text-ink-2">
            Aucune réponse trouvée. Essayez un autre mot, ou posez la question à notre assistant (en bas à droite).
          </div>
        ) : (
          <div className="space-y-14">
            {filtered.map((c) => (
              <section key={c.id} aria-labelledby={`faq-${c.id}`}>
                <h2 id={`faq-${c.id}`} className="t-caption mb-2 text-ink-3">
                  {c.title}
                </h2>
                <Accordion items={c.items} />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
