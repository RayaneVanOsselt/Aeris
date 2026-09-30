import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
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

/** Anciennes pages statiques (.html) → nouvelles routes, pour conserver le référencement. */
const legacyProductSlugs: Record<string, string> = {
  fenetre: "moustiquaire-fenetre",
  fixe: "cadre-fixe",
  enroul: "porte-enroulable",
  plissee: "moustiquaire-plissee",
  porte: "porte-battante",
  couliss: "baie-coulissante",
  magnet: "rideau-magnetique",
  mesure: "sur-mesure-plus",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    const simple: Array<[string, string]> = [
      ["/index.html", "/"],
      ["/produits.html", "/moustiquaires"],
      ["/configurateur.html", "/configurateur"],
      ["/savoir-faire.html", "/a-propos"],
      ["/faq.html", "/faq"],
      ["/contact.html", "/contact"],
      ["/panier.html", "/panier"],
      ["/commande.html", "/commande"],
      ["/paiement.html", "/mes-commandes"],
      ["/orders.html", "/mes-commandes"],
      ["/login.html", "/mes-commandes"],
      ["/register.html", "/mes-commandes"],
      ["/profile.html", "/mes-commandes"],
      ["/account.html", "/mes-commandes"],
      ["/forgot-password.html", "/mes-commandes"],
    ];
    const products = Object.entries(legacyProductSlugs).map(([key, slug]) => ({
      source: "/produit.html",
      has: [{ type: "query" as const, key: "p", value: key }],
      destination: `/produits/${slug}`,
      permanent: true,
    }));
    return [
      ...products,
      { source: "/produit.html", destination: "/moustiquaires", permanent: true },
      ...simple.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

export default nextConfig;
