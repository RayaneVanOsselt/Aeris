import { getProduct, products } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ogSize, renderOg } from "@/lib/og";
import { startingPrice } from "@/lib/pricing";

export const alt = "Moustiquaire sur mesure Aéris";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return renderOg({
    eyebrow: "Moustiquaire sur mesure",
    title: product?.name ?? "Aéris",
    subtitle: product ? `${product.tagline} Dès ${formatPrice(startingPrice(product))}.` : "Moustiquaires sur mesure",
  });
}
