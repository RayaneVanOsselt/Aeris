"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { LOCALE_STORAGE_KEY, languageNames, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { alternatesFor, resolvePath, splitPath } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import { basePath, isStaticSite } from "@/lib/deploy";

/**
 * Liens vers LA MÊME page dans chaque langue (adresse traduite), en conservant
 * les paramètres (configuration en cours…). Le choix est mémorisé pour la page
 * d'accueil racine. Lien classique (rechargement complet) : la langue change
 * aussi pour <html lang>.
 */
export function useLanguageLinks() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const { segments } = splitPath(pathname);
  const target = resolvePath(locale, segments) ?? { key: "home" as const };
  const paths = alternatesFor(target);
  const url = (l: Locale) => `${basePath}${paths[l]}${isStaticSite ? "/" : ""}`;
  const onSelect = (l: Locale) => (e: MouseEvent<HTMLAnchorElement>) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* stockage indisponible : le lien suffit */
    }
    if (l !== locale) e.currentTarget.search = window.location.search;
  };
  return { locale, url, onSelect };
}

/** Sélecteur de langue en ligne (codes ou noms complets). */
export function LanguageSwitcher({
  className,
  tone = "ink",
  variant = "codes",
  size = "sm",
}: {
  className?: string;
  tone?: "ink" | "light";
  variant?: "codes" | "names";
  /** md : cible tactile de 44 px */
  size?: "sm" | "md";
}) {
  const { m, t } = useI18n();
  const { locale, url, onSelect } = useLanguageLinks();

  return (
    <nav aria-label={m.language.label} className={className}>
      <ul className={cn("flex items-center", variant === "codes" ? "gap-0.5" : "gap-2")}>
        {locales.map((l) => {
          const current = l === locale;
          return (
            <li key={l}>
              <a
                href={url(l)}
                hrefLang={l}
                lang={l}
                aria-current={current ? "true" : undefined}
                title={current ? undefined : t(m.language.switchTo, { language: languageNames[l] })}
                onClick={onSelect(l)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-2 text-sm transition-colors duration-[var(--dur-base)]",
                  size === "md" ? "h-11 min-w-11" : "h-9 min-w-9",
                  variant === "codes" && "t-num uppercase",
                  tone === "light"
                    ? current
                      ? "bg-white/12 text-white"
                      : "text-white/70 hover:text-white"
                    : current
                      ? "bg-paper-2 text-ink"
                      : "text-ink-3 hover:text-ink",
                )}
              >
                {variant === "codes" ? l : languageNames[l]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
