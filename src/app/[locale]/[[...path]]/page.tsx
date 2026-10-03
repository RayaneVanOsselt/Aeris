import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { allTargets, pathFor, resolvePath } from "@/i18n/routes";
import { setRequestLocale } from "@/i18n/server";
import { renderRoute, routeMetadata } from "@/views";

/**
 * Toutes les pages de chaque langue passent par ici : l'adresse traduite
 * (/nl/horren, /en/products/custom-plus…) est convertie en page du site
 * grâce au plan des adresses (src/i18n/routes.ts), puis rendue par sa vue.
 */
type Params = { locale: string; path?: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return locales.flatMap((locale) => allTargets().map((target) => ({ locale, path: pathFor(locale, target).split("/").slice(2) })));
}

async function resolve(params: Promise<Params>) {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) return null;
  const target = resolvePath(locale, path.map(decodeURIComponent));
  return target ? { locale, target } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await resolve(params);
  return resolved ? routeMetadata(resolved.locale, resolved.target) : {};
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  setRequestLocale(resolved.locale);
  return renderRoute(resolved.target);
}
