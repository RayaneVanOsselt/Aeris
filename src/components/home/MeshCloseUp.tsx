import { cn } from "@/lib/cn";

/**
 * Toile vue de près : la trame devant la lumière du jour. Dessinée en CSS
 * (aucune image à charger) ; `cell` règle la maille, `strand` l'épaisseur du fil.
 */
export function MeshCloseUp({ cell = 11, strand = 1.2, className }: { cell?: number; strand?: number; className?: string }) {
  const thread = "rgb(22 30 44 / 0.7)";
  return (
    <span
      aria-hidden
      className={cn("block size-full", className)}
      style={{
        backgroundColor: "#e3ebf5",
        backgroundImage: [
          "radial-gradient(ellipse at 30% 25%, rgb(255 255 255 / 0.85), transparent 60%)",
          "linear-gradient(160deg, transparent 55%, rgb(238 228 211 / 0.9))",
          `linear-gradient(to right, ${thread} ${strand}px, transparent ${strand}px)`,
          `linear-gradient(to bottom, ${thread} ${strand}px, transparent ${strand}px)`,
        ].join(", "),
        backgroundSize: `100% 100%, 100% 100%, ${cell}px ${cell}px, ${cell}px ${cell}px`,
      }}
    />
  );
}
