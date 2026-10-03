"use client";

import { useEffect, useId, useRef, useState } from "react";
import { languageNames, locales } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { useLanguageLinks } from "./LanguageSwitcher";

/**
 * Sélecteur de langue compact (téléphone, tablette) : un bouton « FR » qui
 * déroule les trois langues. Toujours visible dans l'en-tête, cible de 44 px.
 */
export function LanguageMenu({ tone = "ink", className }: { tone?: "ink" | "light"; className?: string }) {
  const { m, t } = useI18n();
  const { locale, url, onSelect } = useLanguageLinks();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${m.language.label} (${languageNames[locale]})`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-11 items-center gap-1.5 rounded-full px-2.5 text-sm uppercase transition-colors duration-[var(--dur-base)]",
          tone === "light" ? "text-white hover:bg-white/10" : "text-ink hover:bg-paper-2",
        )}
      >
        <Icon name="globe" size={18} />
        <span className="t-num">{locale}</span>
      </button>
      <ul
        id={id}
        hidden={!open}
        className="absolute right-0 top-[calc(100%+0.5rem)] z-10 min-w-44 animate-[fade-up_var(--dur-base)_var(--ease-out)] rounded-[var(--radius-lg)] border border-line bg-surface p-1.5 text-ink shadow-[var(--shadow-lg)]"
      >
        {locales.map((l) => (
          <li key={l}>
            <a
              href={url(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              title={l === locale ? undefined : t(m.language.switchTo, { language: languageNames[l] })}
              onClick={onSelect(l)}
              className={cn(
                "flex h-11 items-center justify-between gap-6 rounded-[var(--radius-md)] px-3.5 text-[0.9375rem] transition-colors",
                l === locale ? "bg-paper-2" : "hover:bg-paper",
              )}
            >
              {languageNames[l]}
              <span className="t-num text-xs uppercase text-ink-3">{l}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
