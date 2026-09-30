import { getColor, getMesh, getOption, getProduct, type Product } from "./catalog";
import { payment } from "./business";

export type Configuration = {
  productId: string;
  width: number; // mm
  height: number; // mm
  meshId: string;
  colorId: string;
  ralCode?: string;
  optionIds: string[];
  quantity: number;
  label?: string;
};

export type PriceBreakdown = {
  base: number;
  surface: number;
  colorSurcharge: number;
  options: number;
  unit: number;
  total: number;
  vat: number;
  areaM2: number;
};

/**
 * Formule de l'ancien configurateur, conservée à l'identique :
 * prix = base + surface(m²) × prix/m² × coefficient toile + supplément RAL + options.
 * Le serveur recalcule toujours le prix : aucun prix envoyé par le navigateur n'est cru.
 */
export function computePrice(config: Configuration): PriceBreakdown {
  const product = getProduct(config.productId);
  const mesh = getMesh(config.meshId);
  const color = getColor(config.colorId);
  if (!product || !mesh || !color) throw new Error("Configuration inconnue");

  const areaM2 = (config.width / 1000) * (config.height / 1000);
  const surface = areaM2 * product.pricing.perM2 * mesh.multiplier;
  const options = config.optionIds.reduce((sum, id) => sum + (getOption(id)?.price ?? 0), 0);
  const unit = Math.round(product.pricing.base + surface + color.surcharge + options);
  const quantity = Math.max(1, Math.floor(config.quantity));
  const total = unit * quantity;

  return {
    base: product.pricing.base,
    surface: Math.round(surface),
    colorSurcharge: color.surcharge,
    options,
    unit,
    total,
    vat: Math.round(total - total / (1 + payment.vatRate)),
    areaM2,
  };
}

/** Prix « dès » honnête : plus petites dimensions autorisées, toile et coloris standard. */
export function startingPrice(product: Product): number {
  return computePrice({
    productId: product.id,
    width: product.limits.width[0],
    height: product.limits.height[0],
    meshId: "fibre",
    colorId: "blanc",
    optionIds: [],
    quantity: 1,
  }).unit;
}
