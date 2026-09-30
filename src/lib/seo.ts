import type { Metadata } from "next";
import { company } from "./business";
import type { Product } from "./catalog";
import { startingPrice } from "./pricing";
import { siteUrl } from "./site";

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Métadonnées cohérentes : titre, description, canonical, Open Graph, Twitter. */
export function pageMetadata({ title, description, path, noindex = false }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "fr_BE", siteName: company.name },
    twitter: { card: "summary_large_image", title, description },
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

export function websiteJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", name: company.name, url: siteUrl, inLanguage: "fr-BE" };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.href) })),
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: company.name },
    category: "Moustiquaire sur mesure",
    url: absoluteUrl(`/produits/${product.slug}`),
    image: absoluteUrl(`/produits/${product.slug}/opengraph-image`),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: startingPrice(product),
      availability: "https://schema.org/MadeToOrder",
      url: absoluteUrl(`/produits/${product.slug}`),
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
