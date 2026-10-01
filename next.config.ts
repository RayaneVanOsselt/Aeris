import type { NextConfig } from "next";
import { allTargets, pathFor, productSlugs } from "./src/i18n/routes";

const isDev = process.env.NODE_ENV !== "production";
/** Version statique pour GitHub Pages : pas de serveur, donc ni API, ni en-têtes, ni redirections. */
const isStaticSite = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const hasAnalytics = Boolean(process.env.NEXT_PUBLIC_GA_ID);

/**
 * Content-Security-Policy : tout est servi depuis notre domaine
 * (polices auto-hébergées via next/font, aucune image distante).
 * Google Analytics n'est autorisé que si un identifiant est configuré,
 * et il n'est de toute façon chargé qu'après consentement.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${hasAnalytics ? " https://www.googletagmanager.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${hasAnalytics ? " https://www.google-analytics.com https://www.googletagmanager.com" : ""}`,
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}${hasAnalytics ? " https://*.google-analytics.com https://*.analytics.google.com" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** Identifiants de l'ancien site (produit.html?p=…) → modèles actuels. */
const legacyProductIds: Record<string, keyof typeof productSlugs> = {
  fenetre: "fenetre",
  fixe: "fixe",
  enroul: "enroulable",
  plissee: "plissee",
  porte: "battante",
  couliss: "coulissante",
  magnet: "magnetique",
  mesure: "sur-mesure-plus",
};

/**
 * Redirections permanentes (301), pour conserver le référencement :
 * - adresses françaises sans préfixe de langue (/moustiquaires…) → /fr/… ;
 * - anciennes pages .html du premier site → pages françaises équivalentes.
 */
function legacyRedirects() {
  const fr = (target: Parameters<typeof pathFor>[1]) => pathFor("fr", target);
  const unprefixed = allTargets()
    .filter((t) => t.key !== "home")
    .map((t) => ({ source: fr(t).replace(/^\/fr/, ""), destination: fr(t), permanent: true }));
  const html: Array<[string, string]> = [
    ["/index.html", fr({ key: "home" })],
    ["/produits.html", fr({ key: "catalog" })],
    ["/configurateur.html", fr({ key: "configurator" })],
    ["/savoir-faire.html", fr({ key: "about" })],
    ["/faq.html", fr({ key: "faq" })],
    ["/contact.html", fr({ key: "contact" })],
    ["/panier.html", fr({ key: "cart" })],
    ["/commande.html", fr({ key: "checkout" })],
    ...["paiement", "orders", "login", "register", "profile", "account", "forgot-password"].map((p): [string, string] => [`/${p}.html`, fr({ key: "orders" })]),
  ];
  const products = Object.entries(legacyProductIds).map(([key, id]) => ({
    source: "/produit.html",
    has: [{ type: "query" as const, key: "p", value: key }],
    destination: fr({ key: "product", id }),
    permanent: true,
  }));
  return [
    ...products,
    { source: "/produit.html", destination: fr({ key: "catalog" }), permanent: true },
    ...html.map(([source, destination]) => ({ source, destination, permanent: true })),
    ...unprefixed,
  ];
}

const serverConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Les routes API sont nommées route.api.ts : actives uniquement sur un hébergement avec serveur
  pageExtensions: ["tsx", "ts", "api.ts"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects();
  },
};

const staticConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  pageExtensions: ["tsx", "ts"],
  images: { unoptimized: true },
};

const nextConfig = isStaticSite ? staticConfig : serverConfig;

export default nextConfig;
