"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

export function CopyField({ label, value, copyValue, mono = true }: { label: string; value: string; copyValue?: string; mono?: boolean }) {
  const { m, t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sélection manuelle possible */
    }
  };
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-line bg-paper px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-3">{label}</p>
        <p className={cn("truncate text-ink select-all", mono && "t-num")}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={t(m.confirmation.copyLabel, { label })}
        className={cn(
          "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
          copied ? "border-success bg-success text-white" : "border-line text-ink-2 hover:border-ink hover:text-ink",
        )}
      >
        <Icon name={copied ? "check" : "copy"} size={14} />
        <span aria-live="polite">{copied ? m.confirmation.copied : m.confirmation.copy}</span>
      </button>
    </div>
  );
}
