"use client";

import { useId, useState } from "react";
import { useI18n } from "@/i18n/provider";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { computePrice } from "@/lib/pricing";
import { checkDimensions, describeIssue, hasBlockingIssue } from "@/lib/validation";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Estimation immédiate sur la fiche produit : le prix réel en deux saisies, puis le configurateur pré-rempli. */
export function QuickEstimate({ product }: { product: Product }) {
  const { m, href, f, t } = useI18n();
  const id = useId();
  const [w, setW] = useState<string>(String(product.defaultSize.width));
  const [h, setH] = useState<string>(String(product.defaultSize.height));
  const width = w === "" ? null : Number(w.replace(",", "."));
  const height = h === "" ? null : Number(h.replace(",", "."));
  const issues = checkDimensions(product, width, height);
  const blocked = hasBlockingIssue(issues);
  const price = !blocked && width && height ? computePrice({ productId: product.id, width, height, meshId: "fibre", colorId: "anthracite", optionIds: [], quantity: 1 }) : null;

  const fields = [
    { key: "width" as const, label: m.common.width, value: w, set: setW },
    { key: "height" as const, label: m.common.height, value: h, set: setH },
  ];

  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6">
      <p className="flex items-center gap-2 text-sm text-ink">
        <Icon name="ruler" size={18} className="text-sky" /> {m.product.estimateTitle}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {fields.map((field) => {
          const issue = issues.find((i) => i.field === field.key);
          return (
            <div key={field.key}>
              <label htmlFor={`${id}-${field.key}`} className="text-xs text-ink-3">
                {field.label}
              </label>
              <div
                className={cn(
                  "mt-1 flex items-baseline rounded-[var(--radius-md)] border bg-paper px-3 transition-colors focus-within:border-sky",
                  issue?.level === "error" ? "border-danger" : "border-line",
                )}
              >
                <input
                  id={`${id}-${field.key}`}
                  inputMode="numeric"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value.replace(/[^\d.,]/g, ""))}
                  aria-invalid={issue?.level === "error"}
                  aria-describedby={issue ? `${id}-${field.key}-msg` : undefined}
                  className="t-num h-12 w-full min-w-0 bg-transparent text-lg text-ink outline-none"
                />
                <span className="text-sm text-ink-3">{m.common.mm}</span>
              </div>
            </div>
          );
        })}
      </div>
      {issues.map((issue) => {
        const { message, fixLabel } = describeIssue(issue, m, f);
        return (
          <p
            key={issue.field + issue.code}
            id={`${id}-${issue.field}-msg`}
            className={cn("mt-3 flex gap-2 text-sm", issue.level === "error" ? "text-danger" : "text-warning")}
            role={issue.level === "error" ? "alert" : undefined}
          >
            <Icon name={issue.level === "error" ? "alert" : "info"} size={16} className="mt-0.5 shrink-0" />
            <span>
              {message}
              {issue.fix && (
                <button type="button" onClick={() => (issue.field === "width" ? setW : setH)(String(issue.fix!.value))} className="ml-1.5 underline underline-offset-2">
                  {fixLabel}
                </button>
              )}
            </span>
          </p>
        );
      })}
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="text-xs text-ink-3">{m.common.priceStandardMesh}</p>
          <p className="t-num text-3xl font-light text-ink" aria-live="polite">
            {price ? f.price(price.total) : "—"}
          </p>
          <p className="t-small text-ink-3">{t(m.common.manufacturingLead, { lead: t(m.common.leadTime, { min: product.leadTimeDays[0], max: product.leadTimeDays[1] }) })}</p>
        </div>
      </div>
      <ButtonLink
        href={`${href("configurator")}?modele=${product.id}${!blocked && width && height ? `&largeur=${Math.round(width)}&hauteur=${Math.round(height)}` : ""}`}
        size="lg"
        block
        arrow
        className="mt-5"
      >
        {m.product.configureWithSizes}
      </ButtonLink>
    </div>
  );
}
