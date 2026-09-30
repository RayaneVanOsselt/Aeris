import type { Product } from "./catalog";
import { formatNumber } from "./format";

export type DimensionField = "width" | "height";
export type DimensionIssue = {
  level: "error" | "warning";
  field: DimensionField;
  message: string;
  /** Correction proposée en un clic (ex. conversion cm → mm) */
  fix?: { value: number; label: string };
};

const labels: Record<DimensionField, string> = { width: "largeur", height: "hauteur" };

/**
 * Contrôle d'une dimension saisie. Les limites viennent du catalogue.
 * Les « plages habituelles » ne servent qu'à avertir, jamais à bloquer.
 */
export function checkDimension(product: Product, field: DimensionField, raw: number | null | undefined): DimensionIssue[] {
  const [min, max] = product.limits[field];
  if (raw === null || raw === undefined || Number.isNaN(raw)) {
    return [{ level: "error", field, message: `Indiquez la ${labels[field]} en millimètres.` }];
  }
  if (!Number.isFinite(raw) || raw <= 0) {
    return [{ level: "error", field, message: `La ${labels[field]} doit être un nombre positif, en millimètres.` }];
  }
  const value = Math.round(raw);
  if (value < min) {
    // Saisie probable en centimètres ou en mètres
    if (value * 10 >= min && value * 10 <= max) {
      return [
        {
          level: "error",
          field,
          message: `${formatNumber(value)} mm, c'est très petit. Vouliez-vous dire ${formatNumber(value)} cm ?`,
          fix: { value: value * 10, label: `Utiliser ${formatNumber(value * 10)} mm` },
        },
      ];
    }
    if (raw < 10 && raw * 1000 >= min && raw * 1000 <= max) {
      return [
        {
          level: "error",
          field,
          message: `Vous avez saisi des mètres ? Le configurateur attend des millimètres.`,
          fix: { value: Math.round(raw * 1000), label: `Utiliser ${formatNumber(Math.round(raw * 1000))} mm` },
        },
      ];
    }
    return [{ level: "error", field, message: `Minimum ${formatNumber(min)} mm pour ce modèle.` }];
  }
  if (value > max) {
    return [
      {
        level: "error",
        field,
        message: `Maximum ${formatNumber(max)} mm pour ce modèle. Au-delà, notre service Sur mesure + étudie votre projet.`,
      },
    ];
  }
  const [tMin, tMax] = product.typical[field];
  if (value < tMin || value > tMax) {
    return [
      {
        level: "warning",
        field,
        message: `${labels[field][0]!.toUpperCase()}${labels[field].slice(1)} inhabituelle pour ce type d'ouverture : vérifiez votre mesure. Nous la contrôlerons aussi avant fabrication.`,
      },
    ];
  }
  return [];
}

export function checkDimensions(product: Product, width: number | null, height: number | null): DimensionIssue[] {
  const issues = [...checkDimension(product, "width", width), ...checkDimension(product, "height", height)];
  if (!issues.some((i) => i.level === "error") && width && height) {
    const ratio = width / height;
    if (ratio > 4 || ratio < 1 / 6) {
      issues.push({
        level: "warning",
        field: ratio > 4 ? "width" : "height",
        message: "Les proportions sont inhabituelles : avez-vous inversé largeur et hauteur ?",
      });
    }
  }
  return issues;
}

export const hasBlockingIssue = (issues: DimensionIssue[]) => issues.some((i) => i.level === "error");
