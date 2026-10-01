"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { meshes } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";

const icons: Record<string, IconName> = { fibre: "wind", alu: "layers", pollen: "sparkle", pet: "paw", solaire: "sun" };

/** Démonstration produit : la trame de chaque toile, vue à la loupe. */
export function MeshExplorer() {
  const { m, t } = useI18n();
  const me = m.home.meshExplorer;
  const [activeId, setActiveId] = useState("fibre");
  const mesh = meshes.find((m) => m.id === activeId)!;
  const size = Math.max(4, 48 / mesh.density);
  const strand = mesh.strand * 1.1;
  const tint = mesh.id === "solaire" ? "rgb(10 22 49 / 0.18)" : "transparent";

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-b from-[#cfe0f5] via-[#e8efe6] to-[#d6e4c8]" />
        <div aria-hidden className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#f7f2e4,transparent_60%)] opacity-80" />
        <div
          key={mesh.id}
          aria-hidden
          className="absolute inset-0 rounded-full transition-[background-size] duration-[var(--dur-slower)] ease-[var(--ease-out)] animate-[fade-up_var(--dur-slow)_var(--ease-out)]"
          style={{
            backgroundColor: tint,
            backgroundImage: `linear-gradient(to right, rgb(22 30 44 / 0.78) ${strand}px, transparent ${strand}px), linear-gradient(to bottom, rgb(22 30 44 / 0.78) ${strand}px, transparent ${strand}px)`,
            backgroundSize: `${size}px ${size}px`,
          }}
        />
        <div aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_0_0_10px_var(--color-surface),inset_0_0_0_11px_var(--color-line-strong),0_30px_80px_rgb(10_22_49/0.18)]" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-line bg-surface px-4 py-2 shadow-[var(--shadow-sm)]">
          <p className="t-caption whitespace-nowrap text-ink-2">{t(me.closeUp, { mesh: m.catalog.meshes[mesh.id].name })}</p>
        </div>
      </div>

      <div>
        <ul className="divide-y divide-line border-y border-line" role="list">
          {meshes.map((x) => {
            const active = x.id === activeId;
            return (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveId(x.id)}
                  onMouseEnter={() => setActiveId(x.id)}
                  className="group flex w-full items-start gap-4 py-5 text-left"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-[var(--dur-base)]",
                      active ? "border-ink bg-ink text-paper" : "border-line text-ink-2 group-hover:border-ink",
                    )}
                  >
                    <Icon name={icons[x.id] ?? "wind"} size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className={cn("t-h4", active ? "text-ink" : "text-ink-2")}>{m.catalog.meshes[x.id].name}</span>
                      <span className="t-num text-sm text-ink-3">
                        {x.multiplier === 1 ? me.standard : t(me.surcharge, { percent: Math.round((x.multiplier - 1) * 100) })}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
                        active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="mt-1.5 block text-ink-2">{m.catalog.meshes[x.id].description}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
