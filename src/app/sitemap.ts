import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/moustiquaires", 0.9, "weekly"),
    ...categories.map((c) => page(`/moustiquaires/${c.slug}`, 0.85)),
    ...products.map((p) => page(`/produits/${p.slug}`, 0.8)),
    page("/configurateur", 0.9),
    page("/guide-des-mesures", 0.7),
    page("/devis", 0.6),
    page("/faq", 0.6),
    page("/a-propos", 0.5),
    page("/contact", 0.5),
    page("/mentions-legales", 0.1, "yearly"),
    page("/conditions-generales-de-vente", 0.1, "yearly"),
    page("/politique-de-confidentialite", 0.1, "yearly"),
    page("/politique-cookies", 0.1, "yearly"),
  ];
}
