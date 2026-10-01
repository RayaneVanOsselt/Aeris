import type { Formatters } from "@/i18n/format";
import { fmt } from "@/i18n/format";
import type { ClientMessages } from "@/i18n/messages";
import type { Product } from "./catalog";

export type DimensionField = "width" | "height";
export type DimensionIssueCode = "missing" | "notPositive" | "centimeters" | "meters" | "min" | "max" | "unusual" | "ratio";
export type DimensionIssue = {
  level: "error" | "warning";
  field: DimensionField;
  code: DimensionIssueCode;
  /** Valeur saisie (mm) ou limite concernée, selon le code */
  value?: number;
  /** Correction proposée en un clic (ex. conversion cm → mm) */
  fix?: { value: number };
};

/**
 * Contrôle d'une dimension saisie. Les limites viennent du catalogue.
 * Les « plages habituelles » ne servent qu'à avertir, jamais à bloquer.
 * Le texte affiché dépend de la langue : voir describeIssue().
 */
export function checkDimension(product: Product, field: DimensionField, raw: number | null | undefined): DimensionIssue[] {
  const [min, max] = product.limits[field];
  if (raw === null || raw === undefined || Number.isNaN(raw)) return [{ level: "error", field, code: "missing" }];
  if (!Number.isFinite(raw) || raw <= 0) return [{ level: "error", field, code: "notPositive" }];
  const value = Math.round(raw);
  if (value < min) {
    // Saisie probable en centimètres ou en mètres
    if (value * 10 >= min && value * 10 <= max) return [{ level: "error", field, code: "centimeters", value, fix: { value: value * 10 } }];
    if (raw < 10 && raw * 1000 >= min && raw * 1000 <= max) return [{ level: "error", field, code: "meters", fix: { value: Math.round(raw * 1000) } }];
    return [{ level: "error", field, code: "min", value: min }];
  }
  if (value > max) return [{ level: "error", field, code: "max", value: max }];
  const [tMin, tMax] = product.typical[field];
  if (value < tMin || value > tMax) return [{ level: "warning", field, code: "unusual" }];
  return [];
}

export function checkDimensions(product: Product, width: number | null, height: number | null): DimensionIssue[] {
  const issues = [...checkDimension(product, "width", width), ...checkDimension(product, "height", height)];
  if (!issues.some((i) => i.level === "error") && width && height) {
    const ratio = width / height;
    if (ratio > 4 || ratio < 1 / 6) issues.push({ level: "warning", field: ratio > 4 ? "width" : "height", code: "ratio" });
  }
  return issues;
}

export const hasBlockingIssue = (issues: DimensionIssue[]) => issues.some((i) => i.level === "error");

/** Message lisible d'un problème de dimension, dans la langue de la page. */
export function describeIssue(issue: DimensionIssue, m: Pick<ClientMessages, "dimensions">, f: Formatters): { message: string; fixLabel?: string } {
  const d = m.dimensions;
  const field = d.field[issue.field];
  const value = f.number(issue.value ?? 0);
  const message = {
    missing: fmt(d.missing, { field }),
    notPositive: fmt(d.notPositive, { field }),
    centimeters: fmt(d.centimeters, { value }),
    meters: d.meters,
    min: fmt(d.min, { min: value }),
    max: fmt(d.max, { max: value }),
    unusual: d.unusual[issue.field],
    ratio: d.ratio,
  }[issue.code];
  return { message, fixLabel: issue.fix ? fmt(d.useValue, { value: f.number(issue.fix.value) }) : undefined };
}
