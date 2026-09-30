import { getColor, getProduct } from "@/lib/catalog";
import { ProductVisual } from "./ProductVisual";

/** Trio de modèles en perspective : aperçu visuel de la gamme dans les en-têtes. */
export function ProductTrio({ ids, colorId = "anthracite" }: { ids: [string, string, string]; colorId?: string }) {
  const color = getColor(colorId)!;
  return (
    <div className="relative flex h-64 items-end justify-center gap-4 rounded-[var(--radius-xl)] border border-line bg-gradient-to-b from-surface to-paper-2 px-8 pb-8 pt-6">
      <div aria-hidden className="blueprint-grid absolute inset-0 rounded-[var(--radius-xl)]" />
      {ids.map((id, i) => {
        const p = getProduct(id)!;
        return (
          <div key={id} className="relative flex h-full flex-1 flex-col items-center justify-end gap-3">
            <ProductVisual kind={p.visual} color={color.hex} width={p.defaultSize.width} height={p.defaultSize.height} className={i === 1 ? "h-[88%] w-full" : "h-[70%] w-full"} title={p.name} />
            <span className="t-caption text-ink-3">{p.shortName}</span>
          </div>
        );
      })}
    </div>
  );
}
