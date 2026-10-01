import type { Metadata } from "next";
import { htmlLang, locales, ogLocale, type Locale } from "@/i18n/config";
import { formatters } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { alternatesFor, pathFor, type RouteTarget } from "@/i18n/routes";
import { company } from "./business";
import type { Product } from "./catalog";
import { startingPrice } from "./pricing";
import { siteUrl } from "./site";

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Codes hreflang : la langue suffit (le site vise la Belgique, mais aussi les voisins francophones et néerlandophones). */
const hreflang: Record<Locale, string> = { fr: "fr", nl: "nl", en: "en" };

/** Image de partage d'une langue (et éventuellement d'un modèle), générée au build. */
export const ogImagePath = (locale: Locale, productId?: string) => `/og/${productId ? `${locale}-${productId}` : locale}.png`;

/** Les versions linguistiques d'une page, pour les balises hreflang (et x-default : la page de choix de langue). */
export function languageAlternates(target: RouteTarget): Record<string, string> {
  const paths = alternatesFor(target);
  return { ...Object.fromEntries(locales.map((l) => [hreflang[l], paths[l]])), "x-default": "/" };
}

/** Métadonnées cohérentes : titre, description, canonical, hreflang, Open Graph, Twitter. */
export function pageMetadata({
  locale,
  target,
  title,
  description,
  noindex = false,
  image,
}: {
  locale: Locale;
  target: RouteTarget;
  title?: string;
  description: string;
  noindex?: boolean;
  image?: string;
}): Metadata {
  const path = pathFor(locale, target);
  const ogTitle = title ?? messages[locale].meta.defaultTitle;
  const images = [{ url: image ?? ogImagePath(locale), width: 1200, height: 630 }];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, languages: languageAlternates(target) },
    openGraph: { title: ogTitle, description, url: path, type: "website", locale: ogLocale[locale], siteName: company.name, images },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map((i) => i.url) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName ?? company.name,
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
    ...(company.email ? { email: company.email } : {}),
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: company.address.street,
            postalCode: company.address.postalCode,
            addressLocality: company.address.city,
            addressCountry: company.address.country,
          },
        }
      : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  return { "@context": "https://schema.org", "@type": "WebSite", name: company.name, url: absoluteUrl(pathFor(locale, { key: "home" })), inLanguage: htmlLang[locale] };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.href) })),
  };
}

export function productJsonLd(product: Product, locale: Locale) {
  const text = messages[locale].catalog.products[product.id];
  const url = absoluteUrl(pathFor(locale, { key: "product", id: product.id }));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: text.name,
    description: text.description,
    brand: { "@type": "Brand", name: company.name },
    category: messages[locale].meta.productOgEyebrow,
    url,
    image: absoluteUrl(ogImagePath(locale, product.id)),
    inLanguage: htmlLang[locale],
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: startingPrice(product),
      availability: "https://schema.org/MadeToOrder",
      url,
      seller: { "@type": "Organization", name: company.name },
    },
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

/** Prix « dès » formaté pour une langue (titres et images de partage). */
export const startingPriceLabel = (product: Product, locale: Locale) => formatters(locale).price(startingPrice(product));
