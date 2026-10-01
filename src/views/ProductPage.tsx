import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { faqItems } from "@/i18n/faq";
import { fmt } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductShowcase } from "@/components/product/ProductShowcase";
import { QuickEstimate } from "@/components/product/QuickEstimate";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { ViewTracker } from "@/components/product/ViewTracker";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isClaimVisible, reviews, showPlaceholders } from "@/lib/business";
import { frameColors, getProduct, meshes, productOptions, products, type ProductId } from "@/lib/catalog";
import { startingPrice } from "@/lib/pricing";
import { ogImagePath, pageMetadata, productJsonLd, startingPriceLabel } from "@/lib/seo";

export const productMeta = (locale: Locale, id: ProductId) => {
  const product = getProduct(id)!;
  const meta = messages[locale].meta.product;
  const text = messages[locale].catalog.products[id];
  return pageMetadata({
    locale,
    target: { key: "product", id },
    title: fmt(meta.title, { name: text.name, price: startingPriceLabel(product, locale) }),
    description: fmt(meta.description, { lead: text.lead }),
    image: ogImagePath(locale, id),
  });
};

export function ProductPage({ id }: { id: ProductId }) {
  const { m, href, f, t, locale } = getI18n();
  const product = getProduct(id)!;
  const text = m.catalog.products[id];
  const p = m.pages.product;
  const from = startingPrice(product);
  const related = products.filter((x) => x.id !== product.id && x.openings.some((o) => product.openings.includes(o))).slice(0, 3);
  const productFaq = [...faqItems(locale, "mesures").slice(0, 2), ...faqItems(locale, "installation").slice(0, 2), ...faqItems(locale, "garantie").slice(0, 1)];
  const openingsLabel = product.openings.map((o) => m.catalog.openings[o].plural).join(m.common.listSeparator);
  const specs: Array<[string, string]> = [
    [p.specOpening, openingsLabel],
    [p.specProfile, m.catalog.profile],
    [p.specInstallation, text.installation],
    [p.specDimensions, t(p.specDimensionsValue, { minWidth: f.mm(product.limits.width[0]), maxWidth: f.mm(product.limits.width[1]), maxHeight: f.mm(product.limits.height[1]) })],
    [p.specMeshes, meshes.map((x) => m.catalog.meshes[x.id].name).join(m.common.listSeparator)],
    [p.specColors, frameColors.map((c) => m.catalog.colors[c.id]).join(m.common.listSeparator)],
    [p.specOptions, productOptions.map((o) => m.catalog.options[o.id].name).join(m.common.listSeparator)],
    [m.common.manufacturing, t(m.common.leadTime, { min: product.leadTimeDays[0], max: product.leadTimeDays[1] })],
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product, locale)} />
      <ViewTracker product={product.id} />

      <section className="container-site pb-[var(--section-y)] pt-8">
        <Breadcrumb
          items={[
            { name: m.pages.catalog.crumb, href: href("catalog") },
            { name: text.name, href: href("product", id) },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <ProductShowcase product={product} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="t-caption text-ink-3">
              {product.openings.map((o) => m.catalog.openings[o].plural).join(" · ")}
              {text.badge && <span className="ml-3 rounded-full bg-sand-soft px-2.5 py-1 text-sand-deep">{text.badge}</span>}
            </p>
            <h1 className="t-h1 mt-4 text-ink">{text.name}</h1>
            <p className="t-lead mt-5 text-ink-2">{text.lead}</p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="t-caption text-ink-3">{m.common.from}</span>
              <span className="t-num text-4xl font-light text-ink">{f.price(from)}</span>
              <span className="text-sm text-ink-3">{m.common.inclTax}</span>
            </div>
            <p className="t-small mt-1 text-ink-3">{p.startingNote}</p>

            <ul className="mt-8 space-y-3">
              {text.highlights.map((h) => (
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
              <ButtonLink href={`${href("quote")}?modele=${product.id}`} variant="secondary">
                {m.common.requestQuote}
              </ButtonLink>
              <ButtonLink href={href("guide")} variant="ghost" icon="ruler">
                {p.howToMeasure}
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
        <div className="container-site grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={p.detailEyebrow} title={<Rich text={p.detailTitle} />} />
            <Reveal className="mt-8 text-ink-2">
              <p>{text.description}</p>
              <h3 className="t-h4 mt-10 text-ink">{p.idealFor}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {text.idealFor.map((i) => (
                  <li key={i} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-2">
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <h3 className="t-caption mb-2 text-ink-3">{p.specs}</h3>
            <dl className="divide-y divide-line border-y border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-sm text-ink-3">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="py-[var(--section-y)]">
        <div className="container-site grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={p.questionsEyebrow} title={p.questionsTitle} />
            <Reveal className="mt-8">
              <Link href={href("faq")} className="inline-flex items-center gap-2 text-ink underline-offset-4 hover:underline">
                {m.common.allQuestions} <Icon name="arrowRight" size={16} />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={productFaq} />
            {reviews.filter((r) => r.productId === product.id).length === 0 && showPlaceholders && (
              <Placeholder title="Avis clients sur ce modèle" icon="star" className="mt-10">
                Les avis authentiques de vos clients s&apos;afficheront ici (tableau <code>reviews</code> dans src/lib/business.ts, avec <code>productId</code>).
              </Placeholder>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.relatedEyebrow} title={p.relatedTitle} />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
          </div>
        </div>
      </section>

      <StickyBuyBar label={text.name} price={t(m.common.fromPrice, { price: f.price(from) })} href={`${href("configurator")}?modele=${product.id}`} watchId="estimation" />
    </>
  );
}
