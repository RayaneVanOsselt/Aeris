import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { allTargets, alternatesFor, privateRoutes, type RouteTarget } from "@/i18n/routes";
import { isStaticSite } from "@/lib/deploy";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const priority = (t: RouteTarget) =>
  t.key === "home" ? 1 : t.key === "catalog" || t.key === "configurator" ? 0.9 : t.key === "category" ? 0.85 : t.key === "product" ? 0.8 : t.key === "guide" ? 0.7 : ["quote", "faq"].includes(t.key) ? 0.6 : ["about", "contact"].includes(t.key) ? 0.5 : 0.1;

const isLegal = (t: RouteTarget) => ["legalNotice", "terms", "privacy", "cookies"].includes(t.key);

/** Chaque page dans chaque langue, avec ses équivalents (hreflang) : les moteurs relient les trois versions. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // GitHub Pages sert chaque page dans un dossier : URL avec « / » final
  const url = (path: string) => `${siteUrl}${path}${isStaticSite ? "/" : ""}`;
  return allTargets()
    .filter((t) => !(privateRoutes as string[]).includes(t.key))
    .flatMap((target) => {
      const paths = alternatesFor(target);
      const languages = Object.fromEntries(locales.map((l) => [l, url(paths[l])]));
      return locales.map((locale) => ({
        url: url(paths[locale]),
        lastModified: now,
        changeFrequency: target.key === "home" || target.key === "catalog" ? ("weekly" as const) : isLegal(target) ? ("yearly" as const) : ("monthly" as const),
        priority: priority(target),
        alternates: { languages },
      }));
    });
}
