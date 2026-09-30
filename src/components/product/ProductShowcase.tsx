"use client";

import { useEffect, useRef, useState } from "react";
import { frameColors, getMesh, type Product } from "@/lib/catalog";
import { showPlaceholders } from "@/lib/business";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductVisual } from "./ProductVisual";

type View = "overview" | "dimensions" | "mesh";
const views: Array<{ id: View; label: string }> = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "dimensions", label: "Avec cotes" },
  { id: "mesh", label: "Trame" },
];

/** Galerie produit : vues, coloris en direct, zoom plein écran, emplacements photos réelles. */
export function ProductShowcase({ product }: { product: Product }) {
  const [view, setView] = useState<View>("overview");
  const [colorId, setColorId] = useState("anthracite");
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const color = frameColors.find((c) => c.id === colorId)!;
  const mesh = getMesh("fibre")!;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (zoom && !d.open) d.showModal();
    if (!zoom && d.open) d.close();
  }, [zoom]);

  const stage = (large: boolean) =>
    view === "mesh" ? (
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#e3ebf5",
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgb(255 255 255/.7), transparent 60%), linear-gradient(to right, rgb(22 30 44/.72) 1.2px, transparent 1.2px), linear-gradient(to bottom, rgb(22 30 44/.72) 1.2px, transparent 1.2px)",
          backgroundSize: `100% 100%, ${large ? 14 : 9}px ${large ? 14 : 9}px, ${large ? 14 : 9}px ${large ? 14 : 9}px`,
        }}
        role="img"
        aria-label={`Vue rapprochée de la toile ${mesh.name}`}
      />
    ) : (
      <ProductVisual
        key={`${view}-${colorId}`}
        kind={product.visual}
        color={color.hex}
        width={product.defaultSize.width}
        height={product.defaultSize.height}
        dimensions={view === "dimensions"}
        animated={view === "dimensions"}
        title={`${product.name}, coloris ${color.name}`}
        className="absolute inset-0 h-full w-full p-6 sm:p-10"
      />
    );

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-xl)] border border-line bg-gradient-to-b from-surface to-paper-2 sm:aspect-[5/4] lg:aspect-square">
        <div aria-hidden className="blueprint-grid absolute inset-0" />
        {stage(false)}
        <div className="absolute left-4 top-4 flex gap-1 rounded-full border border-line bg-surface/90 p-1 backdrop-blur" role="group" aria-label="Choisir la vue">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={cn("h-8 rounded-full px-3 text-xs transition-colors sm:text-sm", view === v.id ? "bg-ink text-paper" : "text-ink-2 hover:text-ink")}
            >
              {v.label}
            </button>
          ))}
        </div>
        <IconButton icon="search" label="Agrandir l'illustration" onClick={() => setZoom(true)} className="absolute bottom-4 right-4 border border-line bg-surface/90 backdrop-blur" />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm text-ink-2">
          Coloris du profilé : <span className="text-ink">{color.name}</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {frameColors.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === colorId}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColorId(c.id)}
              className={cn("size-9 rounded-full border border-line-strong ring-offset-2 ring-offset-paper transition-shadow", c.id === colorId && "ring-2 ring-sky")}
              style={{ background: c.id === "ral" ? "conic-gradient(#c8a57a,#3563e9,#1f7a55,#b42318,#c8a57a)" : c.hex }}
            />
          ))}
        </div>
      </fieldset>

      {showPlaceholders && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {["Posée, lumière du jour", "Détail du profilé", "En situation"].map((label) => (
            <div key={label} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-line-strong bg-paper/60 p-2 text-center">
              <Icon name="image" size={18} className="text-ink-3" />
              <span className="text-[11px] leading-tight text-ink-3">
                Photo réelle à venir
                <br />
                <span className="text-ink-2">{label}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      <dialog ref={dialog} onClose={() => setZoom(false)} className="sheet m-auto h-[min(92dvh,900px)] w-[min(94vw,900px)] overflow-hidden rounded-[var(--radius-xl)] bg-surface!" aria-label={`${product.name} en grand`}>
        <div className="relative h-full">
          <div aria-hidden className="blueprint-grid absolute inset-0" />
          {zoom && stage(true)}
          <IconButton icon="close" label="Fermer" onClick={() => setZoom(false)} className="absolute right-4 top-4 border border-line bg-surface" autoFocus />
        </div>
      </dialog>
    </div>
  );
}
