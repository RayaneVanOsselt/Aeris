import { getColor, getMesh, getOption, getProduct } from "./catalog";
import { formatMm, formatPrice } from "./format";
import { computePrice, type Configuration } from "./pricing";

/** Description lisible d'une configuration (e-mails, récapitulatifs, historique). */
export function describeConfig(config: Configuration): string {
  const product = getProduct(config.productId);
  const mesh = getMesh(config.meshId);
  const color = getColor(config.colorId);
  const options = config.optionIds.map((o) => getOption(o)?.name).filter(Boolean);
  return [
    product?.name ?? config.productId,
    `${formatMm(config.width)} × ${formatMm(config.height)}`,
    `toile ${mesh?.name ?? config.meshId}`,
    `coloris ${color?.name ?? config.colorId}${config.ralCode ? ` ${config.ralCode}` : ""}`,
    options.length ? `options : ${options.join(", ")}` : null,
    config.label ? `repère « ${config.label} »` : null,
    `× ${config.quantity}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function describeLine(config: Configuration): string {
  return `${describeConfig(config)} = ${formatPrice(computePrice(config).total)}`;
}

/** Référence de commande lisible et non devinable : AER-AAMMJJ-XXXX */
export function createReference(now = new Date()): string {
  const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `AER-${date}-${suffix}`;
}

/** Historique local (appareil du client) : référence, montant, statut. Aucune donnée personnelle. */
export type LocalOrder = { reference: string; total: number; createdAt: string; summary: string[]; paymentMethod: string; status: "pending" | "notified" };
