import Link from "next/link";
import { getColor, type Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { ProductVisual } from "./ProductVisual";

/** Carte produit : illustration fidèle, promesse en une ligne, prix « dès » honnête. */
export function ProductCard({ product, className, headingLevel: H = "h3" }: { product: Product; className?: string; headingLevel?: "h2" | "h3" }) {
  const anthracite = getColor("anthracite")!;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface transition-[border-color,box-shadow,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-paper-2">
        <div aria-hidden className="blueprint-grid absolute inset-0 opacity-0 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-100" />
        <ProductVisual
          kind={product.visual}
          color={anthracite.hex}
          width={product.defaultSize.width}
          height={product.defaultSize.height}
          title={product.name}
          className="absolute inset-0 m-auto h-[80%] w-[80%] transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="t-caption absolute left-4 top-4 rounded-full bg-surface px-3 py-1 text-ink shadow-[var(--shadow-xs)]">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <H className="t-h4 text-ink">
          <Link href={`/produits/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </H>
        <p className="t-small mt-1.5 flex-1 text-ink-3">{product.tagline}</p>
        <div className="mt-5 flex items-end justify-between">
          <p>
            <span className="t-caption block text-ink-3">dès</span>
            <span className="t-num text-xl text-ink">{formatPrice(startingPrice(product))}</span>
          </p>
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-[background-color,color,border-color] duration-[var(--dur-base)] group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
          >
            <Icon name="arrowUpRight" size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}
