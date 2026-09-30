"use client";

import { useId, useState } from "react";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatLeadTime, formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { checkDimensions, hasBlockingIssue } from "@/lib/validation";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Estimation immédiate sur la fiche produit : le prix réel en deux saisies, puis le configurateur pré-rempli. */
export function QuickEstimate({ product }: { product: Product }) {
  const id = useId();
  const [w, setW] = useState<string>(String(product.defaultSize.width));
  const [h, setH] = useState<string>(String(product.defaultSize.height));
  const width = w === "" ? null : Number(w.replace(",", "."));
  const height = h === "" ? null : Number(h.replace(",", "."));
  const issues = checkDimensions(product, width, height);
  const blocked = hasBlockingIssue(issues);
  const price = !blocked && width && height ? computePrice({ productId: product.id, width, height, meshId: "fibre", colorId: "anthracite", optionIds: [], quantity: 1 }) : null;

  const fields = [
    { key: "width" as const, label: "Largeur", value: w, set: setW },
    { key: "height" as const, label: "Hauteur", value: h, set: setH },
  ];

  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6">
      <p className="flex items-center gap-2 text-sm text-ink">
        <Icon name="ruler" size={18} className="text-sky" /> Estimez votre prix
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {fields.map((f) => {
          const issue = issues.find((i) => i.field === f.key);
          return (
            <div key={f.key}>
              <label htmlFor={`${id}-${f.key}`} className="text-xs text-ink-3">
                {f.label}
              </label>
              <div
                className={cn(
                  "mt-1 flex items-baseline rounded-[var(--radius-md)] border bg-paper px-3 transition-colors focus-within:border-sky",
                  issue?.level === "error" ? "border-danger" : "border-line",
                )}
              >
                <input
                  id={`${id}-${f.key}`}
                  inputMode="numeric"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value.replace(/[^\d.,]/g, ""))}
                  aria-invalid={issue?.level === "error"}
                  aria-describedby={issue ? `${id}-${f.key}-msg` : undefined}
                  className="t-num h-12 w-full min-w-0 bg-transparent text-lg text-ink outline-none"
                />
                <span className="text-sm text-ink-3">mm</span>
              </div>
            </div>
          );
        })}
      </div>
      {issues.map((issue) => (
        <p
          key={issue.field + issue.message}
          id={`${id}-${issue.field}-msg`}
          className={cn("mt-3 flex gap-2 text-sm", issue.level === "error" ? "text-danger" : "text-warning")}
          role={issue.level === "error" ? "alert" : undefined}
        >
          <Icon name={issue.level === "error" ? "alert" : "info"} size={16} className="mt-0.5 shrink-0" />
          <span>
            {issue.message}
            {issue.fix && (
              <button
                type="button"
                onClick={() => (issue.field === "width" ? setW : setH)(String(issue.fix!.value))}
                className="ml-1.5 underline underline-offset-2"
              >
                {issue.fix.label}
              </button>
            )}
          </span>
        </p>
      ))}
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="text-xs text-ink-3">Prix TTC, toile standard</p>
          <p className="t-num text-3xl font-light text-ink" aria-live="polite">
            {price ? formatPrice(price.total) : "—"}
          </p>
          <p className="t-small text-ink-3">Fabrication : {formatLeadTime(product.leadTimeDays)}</p>
        </div>
      </div>
      <ButtonLink
        href={`/configurateur?modele=${product.id}${!blocked && width && height ? `&largeur=${Math.round(width)}&hauteur=${Math.round(height)}` : ""}`}
        size="lg"
        block
        arrow
        className="mt-5"
      >
        Configurer avec ces mesures
      </ButtonLink>
    </div>
  );
}
