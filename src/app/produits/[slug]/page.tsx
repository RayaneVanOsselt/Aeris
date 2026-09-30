import Link from "next/link";
import { notFound } from "next/navigation";
import { frameColors, getProduct, meshes, openings, productOptions, products } from "@/lib/catalog";
import { reviews, showPlaceholders } from "@/lib/business";
import { faq } from "@/lib/faq";
import { formatLeadTime, formatMm, formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { pageMetadata, productJsonLd } from "@/lib/seo";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductShowcase } from "@/components/product/ProductShowcase";
import { QuickEstimate } from "@/components/product/QuickEstimate";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { ViewTracker } from "@/components/product/ViewTracker";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { ClaimLabel, isClaimVisible } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} sur mesure — dès ${formatPrice(startingPrice(product))}`,
    description: `${product.lead} Fabriquée à vos dimensions, prix en temps réel dans le configurateur.`,
    path: `/produits/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const from = startingPrice(product);
  const related = products.filter((p) => p.id !== product.id && p.openings.some((o) => product.openings.includes(o))).slice(0, 3);
  const productFaq = [
    ...(faq.find((c) => c.id === "mesures")?.items.slice(0, 2) ?? []),
    ...(faq.find((c) => c.id === "installation")?.items.slice(0, 2) ?? []),
    ...(faq.find((c) => c.id === "garantie")?.items.slice(0, 1) ?? []),
  ];
  const specs: Array<[string, string]> = [
    ["Type d'ouverture", product.openings.map((o) => openings[o].plural).join(", ")],
    ["Profilé", "Aluminium"],
    ["Pose", product.installation],
    ["Dimensions", `${formatMm(product.limits.width[0])} à ${formatMm(product.limits.width[1])} de large · jusqu'à ${formatMm(product.limits.height[1])} de haut`],
    ["Toiles", meshes.map((m) => m.name).join(", ")],
    ["Coloris", frameColors.map((c) => c.name).join(", ")],
    ["Options", productOptions.map((o) => o.name).join(", ")],
    ["Fabrication", formatLeadTime(product.leadTimeDays)],
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ViewTracker product={product.id} />

      <section className="container-site pb-[var(--section-y)] pt-8">
        <Breadcrumb
          items={[
            { name: "Moustiquaires", href: "/moustiquaires" },
            { name: product.name, href: `/produits/${product.slug}` },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <ProductShowcase product={product} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="t-caption text-ink-3">
              {product.openings.map((o) => openings[o].plural).join(" · ")}
              {product.badge && <span className="ml-3 rounded-full bg-sand-soft px-2.5 py-1 text-sand-deep">{product.badge}</span>}
            </p>
            <h1 className="t-h1 mt-4 text-ink">{product.name}</h1>
            <p className="t-lead mt-5 text-ink-2">{product.lead}</p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="t-caption text-ink-3">dès</span>
              <span className="t-num text-4xl font-light text-ink">{formatPrice(from)}</span>
              <span className="text-sm text-ink-3">TTC</span>
            </div>
            <p className="t-small mt-1 text-ink-3">Prix de départ aux plus petites dimensions. Votre prix exact dépend de vos mesures.</p>

            <ul className="mt-8 space-y-3">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-ink-2">
                  <Icon name="check" size={20} className="shrink-0 text-sky" />
                  {h}
                </li>
              ))}
            </ul>

            <div id="estimation" className="mt-8">
              <QuickEstimate product={product} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ButtonLink href={`/devis?modele=${product.id}`} variant="secondary">
                Demander un devis
              </ButtonLink>
              <ButtonLink href="/guide-des-mesures" variant="ghost" icon="ruler">
                Comment mesurer
              </ButtonLink>
            </div>

            <ul className="mt-8 divide-y divide-line border-y border-line text-sm">
              {(["madeToMeasure", "checkedBeforeProduction", "warranty", "directPayment"] as const)
                .filter(isClaimVisible)
                .map((c) => (
                  <li key={c} className="flex items-center gap-3 py-3.5 text-ink-2">
                    <Icon name={c === "warranty" ? "shield" : c === "directPayment" ? "lock" : c === "madeToMeasure" ? "ruler" : "eye"} size={18} className="text-ink" />
                    <ClaimLabel id={c} />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-[var(--section-y)]">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="En détail" title={<>Pensée pour <span className="accent text-sand-deep">votre quotidien.</span></>} />
            <Reveal className="mt-8 text-ink-2">
              <p>{product.description}</p>
              <h3 className="t-h4 mt-10 text-ink">Idéale pour</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.idealFor.map((i) => (
                  <li key={i} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-2">
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <h3 className="t-caption mb-2 text-ink-3">Caractéristiques</h3>
            <dl className="divide-y divide-line border-y border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-sm text-ink-3">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="py-[var(--section-y)]">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions" title="Avant de commander." />
            <Reveal className="mt-8">
              <Link href="/faq" className="inline-flex items-center gap-2 text-ink underline-offset-4 hover:underline">
                Toutes les questions <Icon name="arrowRight" size={16} />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={productFaq} />
            {reviews.filter((r) => r.productSlug === product.slug).length === 0 && showPlaceholders && (
              <Placeholder title="Avis clients sur ce modèle" icon="star" className="mt-10">
                Les avis authentiques de vos clients s&apos;afficheront ici (tableau <code>reviews</code> dans src/lib/business.ts, avec <code>productSlug</code>).
              </Placeholder>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow="Vous hésitez encore ?" title="Les modèles voisins." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <StickyBuyBar label={product.name} price={`dès ${formatPrice(from)}`} href={`/configurateur?modele=${product.id}`} watchId="estimation" />
    </>
  );
}
