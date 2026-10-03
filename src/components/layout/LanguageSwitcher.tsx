"use client";

import { usePathname } from "next/navigation";
import { LOCALE_STORAGE_KEY, languageNames, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { alternatesFor, resolvePath, splitPath } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import { basePath, isStaticSite } from "@/lib/deploy";

/**
 * Sélecteur de langue : mène à LA MÊME page dans l'autre langue (adresse
 * traduite), en conservant les paramètres (configuration en cours…).
 * Le choix est mémorisé pour la page d'accueil racine.
 */
export function LanguageSwitcher({
  className,
  tone = "ink",
  variant = "codes",
  size = "sm",
}: {
  className?: string;
  tone?: "ink" | "light";
  variant?: "codes" | "names";
  /** md : cible tactile de 44 px (barre mobile) */
  size?: "sm" | "md";
}) {
  const { locale, m, t } = useI18n();
  const pathname = usePathname();
  const { segments } = splitPath(pathname);
  const target = resolvePath(locale, segments) ?? { key: "home" as const };
  const paths = alternatesFor(target);
  // Lien classique (rechargement complet) : la langue change aussi pour <html lang>
  const url = (l: Locale) => `${basePath}${paths[l]}${isStaticSite ? "/" : ""}`;

  const go = (l: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* stockage indisponible : le lien suffit */
    }
  };

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
                onClick={(e) => {
                  go(l);
                  // Conserver la configuration en cours (paramètres de l'adresse)
                  if (!current) e.currentTarget.search = window.location.search;
                }}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-2 text-sm transition-colors",
                  size === "md" ? "h-11 min-w-11" : "h-9 min-w-9",
                  variant === "codes" && "t-num uppercase",
                  tone === "light"
                    ? current
                      ? "bg-white/10 text-on-night"
                      : "text-on-night-2 hover:text-on-night"
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
