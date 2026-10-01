import type { Formatters } from "@/i18n/format";
import { fmt } from "@/i18n/format";
import type { ClientMessages } from "@/i18n/messages";
import type { ColorId, MeshId, OptionId, ProductId } from "./catalog";
import { getColor, getMesh, getOption, getProduct } from "./catalog";
import { computePrice, type Configuration } from "./pricing";

type Labels = Pick<ClientMessages, "catalog" | "common">;

/** Description lisible d'une configuration (récapitulatifs, historique, e-mails), dans la langue donnée. */
export function describeConfig(config: Configuration, m: Labels, f: Formatters): string {
  const { catalog, common } = m;
  const product = getProduct(config.productId);
  const mesh = getMesh(config.meshId);
  const color = getColor(config.colorId);
  const options = config.optionIds.filter((o) => getOption(o)).map((o) => catalog.options[o as OptionId].name);
  return [
    product ? catalog.products[product.id as ProductId].name : config.productId,
    `${f.mm(config.width)} × ${f.mm(config.height)}`,
    fmt(common.describe.mesh, { name: mesh ? catalog.meshes[mesh.id as MeshId].name : config.meshId }),
    fmt(common.describe.color, { name: `${color ? catalog.colors[color.id as ColorId] : config.colorId}${config.ralCode ? ` ${config.ralCode}` : ""}` }),
    options.length ? fmt(common.describe.options, { list: options.join(common.listSeparator) }) : null,
    config.label ? fmt(common.describe.label, { text: config.label }) : null,
    `× ${config.quantity}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function describeLine(config: Configuration, m: Labels, f: Formatters): string {
  return `${describeConfig(config, m, f)} = ${f.price(computePrice(config).total)}`;
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
