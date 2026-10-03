import type { MeshId } from "@/lib/catalog";
import { getMesh } from "@/lib/catalog";
import { cn } from "@/lib/cn";

/** Rendu de chaque toile : maille (catalogue), teinte du fil, lumière qui passe. */
const looks: Record<MeshId, { thread: string; light: string; glow: number }> = {
  fibre: { thread: "rgb(22 30 44 / 0.7)", light: "#e3ebf5", glow: 0.8 },
  alu: { thread: "rgb(112 120 132 / 0.95)", light: "#e6ebf1", glow: 0.8 },
  pollen: { thread: "rgb(22 30 44 / 0.6)", light: "#e8edf3", glow: 0.8 },
  pet: { thread: "rgb(28 30 34 / 0.85)", light: "#e1e8f1", glow: 0.8 },
  // filtre une partie de la lumière : fond plus sombre, reflet atténué
  solaire: { thread: "rgb(20 24 32 / 0.85)", light: "#97a3b2", glow: 0.3 },
};

/**
 * Toile vue de près : la trame devant la lumière du jour. Dessinée en CSS
 * (aucune image à charger), d'après la densité et l'épaisseur du catalogue.
 */
export function MeshCloseUp({ mesh = "fibre", scale = 1, className }: { mesh?: MeshId; scale?: number; className?: string }) {
  const data = getMesh(mesh)!;
  const look = looks[mesh];
  const cell = Math.max(4, Math.round((90 / data.density) * scale));
  const strand = data.strand * Math.max(0.8, scale);
  return (
    <span
      aria-hidden
      className={cn("block size-full", className)}
      style={{
        backgroundColor: look.light,
        backgroundImage: [
          `radial-gradient(ellipse at 30% 25%, rgb(255 255 255 / ${look.glow}), transparent 60%)`,
          "linear-gradient(160deg, transparent 55%, rgb(238 228 211 / 0.85))",
          `linear-gradient(to right, ${look.thread} ${strand}px, transparent ${strand}px)`,
          `linear-gradient(to bottom, ${look.thread} ${strand}px, transparent ${strand}px)`,
        ].join(", "),
        backgroundSize: `100% 100%, 100% 100%, ${cell}px ${cell}px, ${cell}px ${cell}px`,
      }}
    />
  );
}
