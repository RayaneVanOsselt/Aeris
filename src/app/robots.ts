import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { pathFor, privateRoutes } from "@/i18n/routes";
import { basePath } from "@/lib/deploy";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = locales.flatMap((l) => privateRoutes.map((key) => `${basePath}${pathFor(l, { key })}`));
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [`${basePath}/api/`, ...privatePaths] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
