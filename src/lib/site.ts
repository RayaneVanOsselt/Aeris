import type { StaticRoute } from "@/i18n/routes";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages" ? "https://rayanevanosselt.github.io/Aeris" : undefined) ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/** Liens de la navigation principale (libellés : messages.nav.links). */
export const primaryNav = ["guide", "about", "faq", "contact"] as const satisfies readonly StaticRoute[];
