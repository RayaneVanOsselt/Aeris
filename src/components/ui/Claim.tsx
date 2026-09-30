import { claims, showPlaceholders, type ClaimKey } from "@/lib/business";
import { cn } from "@/lib/cn";

/**
 * Affiche un engagement commercial. Si l'engagement n'est pas encore
 * confirmé par l'entreprise : repère discret en mode préparation,
 * masqué en production (on n'affiche jamais une promesse non validée).
 */
export function isClaimVisible(key: ClaimKey) {
  return !claims[key].toConfirm || showPlaceholders;
}

export function ClaimLabel({ id, field = "label", className }: { id: ClaimKey; field?: "label" | "detail"; className?: string }) {
  const claim = claims[id];
  if (!isClaimVisible(id)) return null;
  return (
    <span className={className}>
      {claim[field]}
      {claim.toConfirm && showPlaceholders && field === "label" && (
        <sup
          title="Engagement repris de l'ancien site — à confirmer avant publication"
          className={cn("ml-0.5 cursor-help font-mono text-[0.6em] text-sand-deep")}
        >
          ◆
        </sup>
      )}
    </span>
  );
}
