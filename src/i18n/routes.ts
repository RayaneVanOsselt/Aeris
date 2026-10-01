import type { CategoryId, ProductId } from "@/lib/catalog";
import { locales, type Locale } from "./config";

/**
 * Adresses du site, traduites dans chaque langue.
 * Une seule source : les liens, le sélecteur de langue, les balises
 * hreflang, le sitemap et les redirections en dépendent.
 * Le français garde les adresses de la version précédente (préfixées /fr).
 */
export type StaticRoute =
  | "home"
  | "catalog"
  | "configurator"
  | "guide"
  | "quote"
  | "contact"
  | "faq"
  | "about"
  | "cart"
  | "checkout"
  | "confirmation"
  | "orders"
  | "legalNotice"
  | "terms"
  | "privacy"
  | "cookies";

export type RouteTarget = { key: StaticRoute } | { key: "category"; id: CategoryId } | { key: "product"; id: ProductId };

const staticPaths: Record<StaticRoute, Record<Locale, string>> = {
  home: { fr: "", nl: "", en: "" },
  catalog: { fr: "moustiquaires", nl: "horren", en: "insect-screens" },
  configurator: { fr: "configurateur", nl: "configurator", en: "configurator" },
  guide: { fr: "guide-des-mesures", nl: "opmeten", en: "measuring-guide" },
  quote: { fr: "devis", nl: "offerte", en: "quote" },
  contact: { fr: "contact", nl: "contact", en: "contact" },
  faq: { fr: "faq", nl: "veelgestelde-vragen", en: "faq" },
  about: { fr: "a-propos", nl: "over-ons", en: "about-us" },
  cart: { fr: "panier", nl: "winkelmandje", en: "basket" },
  checkout: { fr: "commande", nl: "bestellen", en: "checkout" },
  confirmation: { fr: "commande/confirmation", nl: "bestellen/bevestiging", en: "checkout/confirmation" },
  orders: { fr: "mes-commandes", nl: "mijn-bestellingen", en: "my-orders" },
  legalNotice: { fr: "mentions-legales", nl: "juridische-informatie", en: "legal-notice" },
  terms: { fr: "conditions-generales-de-vente", nl: "algemene-voorwaarden", en: "terms-and-conditions" },
  privacy: { fr: "politique-de-confidentialite", nl: "privacybeleid", en: "privacy-policy" },
  cookies: { fr: "politique-cookies", nl: "cookiebeleid", en: "cookie-policy" },
};

const productBase: Record<Locale, string> = { fr: "produits", nl: "producten", en: "products" };

export const productSlugs: Record<ProductId, Record<Locale, string>> = {
  fenetre: { fr: "moustiquaire-fenetre", nl: "vliegenraam", en: "window-insect-screen" },
  fixe: { fr: "cadre-fixe", nl: "vast-vliegenraam", en: "fixed-frame-screen" },
  enroulable: { fr: "porte-enroulable", nl: "rolhordeur", en: "retractable-screen-door" },
  plissee: { fr: "moustiquaire-plissee", nl: "plissehor", en: "pleated-insect-screen" },
  battante: { fr: "porte-battante", nl: "draaihordeur", en: "hinged-screen-door" },
  coulissante: { fr: "baie-coulissante", nl: "schuifhor", en: "sliding-screen-door" },
  magnetique: { fr: "rideau-magnetique", nl: "magnetisch-vliegengordijn", en: "magnetic-screen-curtain" },
  "sur-mesure-plus": { fr: "sur-mesure-plus", nl: "maatwerk-plus", en: "custom-plus" },
};

export const categorySlugs: Record<CategoryId, Record<Locale, string>> = {
  fenetres: { fr: "fenetres", nl: "ramen", en: "windows" },
  "portes-et-baies": { fr: "portes-et-baies", nl: "deuren-en-schuiframen", en: "doors-and-patio-doors" },
};

/** Début des adresses des fiches produit : /fr/produits, /nl/producten… */
export const productPathPrefix = (locale: Locale) => `/${locale}/${productBase[locale]}`;

/** Pages privées (panier, commande…) : jamais indexées. */
export const privateRoutes: StaticRoute[] = ["cart", "checkout", "confirmation", "orders"];

/** Chemin relatif d'une page, sans « / » final : /fr, /nl/horren, /en/products/custom-plus */
export function pathFor(locale: Locale, target: RouteTarget): string {
  const rest =
    target.key === "product"
      ? `${productBase[locale]}/${productSlugs[target.id][locale]}`
      : target.key === "category"
        ? `${staticPaths.catalog[locale]}/${categorySlugs[target.id][locale]}`
        : staticPaths[target.key][locale];
  return rest ? `/${locale}/${rest}` : `/${locale}`;
}

export type Href = {
  (key: StaticRoute): string;
  (key: "product", id: ProductId): string;
  (key: "category", id: CategoryId): string;
};

/** Fabrique de liens liée à une langue : href("catalog"), href("product", "plissee") */
export function hrefFor(locale: Locale): Href {
  return ((key: RouteTarget["key"], id?: string) => pathFor(locale, { key, id } as RouteTarget)) as Href;
}

/** Retrouve la page correspondant à un chemin (segments après la langue), ou null. */
export function resolvePath(locale: Locale, segments: readonly string[]): RouteTarget | null {
  const path = segments.join("/");
  for (const [key, paths] of Object.entries(staticPaths) as Array<[StaticRoute, Record<Locale, string>]>) {
    if (paths[locale] === path) return { key };
  }
  const [first, second, ...extra] = segments;
  if (!second || extra.length) return null;
  if (first === productBase[locale]) {
    const id = (Object.keys(productSlugs) as ProductId[]).find((p) => productSlugs[p][locale] === second);
    return id ? { key: "product", id } : null;
  }
  if (first === staticPaths.catalog[locale]) {
    const id = (Object.keys(categorySlugs) as CategoryId[]).find((c) => categorySlugs[c][locale] === second);
    return id ? { key: "category", id } : null;
  }
  return null;
}

/** Toutes les pages du site, pour toutes les langues. */
export function allTargets(): RouteTarget[] {
  return [
    ...(Object.keys(staticPaths) as StaticRoute[]).map((key) => ({ key })),
    ...(Object.keys(categorySlugs) as CategoryId[]).map((id) => ({ key: "category" as const, id })),
    ...(Object.keys(productSlugs) as ProductId[]).map((id) => ({ key: "product" as const, id })),
  ];
}

/** La même page dans chaque langue (sélecteur de langue, hreflang, sitemap). */
export function alternatesFor(target: RouteTarget): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, pathFor(l, target)])) as Record<Locale, string>;
}

/** Retire le préfixe de langue d'un chemin : /nl/horren → { locale: "nl", segments: ["horren"] } */
export function splitPath(pathname: string): { locale: Locale | null; segments: string[] } {
  const parts = pathname.split("/").filter(Boolean);
  const [first, ...segments] = parts;
  return (locales as readonly string[]).includes(first ?? "") ? { locale: first as Locale, segments } : { locale: null, segments: parts };
}
