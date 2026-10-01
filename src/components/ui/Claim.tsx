"use client";

import { useI18n } from "@/i18n/provider";
import { claims, isClaimVisible, showPlaceholders, type ClaimKey } from "@/lib/business";
import { cn } from "@/lib/cn";

/**
 * Affiche un engagement commercial dans la langue de la page. Si l'engagement
 * n'est pas encore confirmé par l'entreprise : repère discret en mode
 * préparation, masqué en production (on n'affiche jamais une promesse non validée).
 */
export function ClaimLabel({ id, field = "label", className }: { id: ClaimKey; field?: "label" | "detail"; className?: string }) {
  const { m } = useI18n();
  if (!isClaimVisible(id)) return null;
  return (
    <span className={className}>
      {m.claims[id][field]}
      {claims[id].toConfirm && showPlaceholders && field === "label" && (
        <sup title="Engagement repris de l'ancien site — à confirmer avant publication" className={cn("ml-0.5 cursor-help font-mono text-[0.6em] text-sand-deep")}>
          ◆
        </sup>
      )}
    </span>
  );
}
