import { isLocale, locales } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { getProduct, products } from "@/lib/catalog";
import { renderOg } from "@/lib/og";
import { startingPriceLabel } from "@/lib/seo";

/**
 * Images de partage (Open Graph), générées au build : une par langue
 * (fr.png) et une par modèle et par langue (nl-plissee.png).
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => [{ file: `${locale}.png` }, ...products.map((p) => ({ file: `${locale}-${p.id}.png` }))]);
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const [locale, ...rest] = file.replace(/\.png$/, "").split("-");
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const meta = messages[locale].meta;
  const product = rest.length ? getProduct(rest.join("-")) : undefined;
  if (!product) return renderOg({ eyebrow: meta.ogEyebrow, title: meta.ogTitle, subtitle: meta.ogSubtitle });
  const text = messages[locale].catalog.products[product.id];
  return renderOg({
    eyebrow: meta.productOgEyebrow,
    title: text.name,
    subtitle: fmt(meta.productOgSubtitle, { tagline: text.tagline, price: startingPriceLabel(product, locale) }),
  });
}
