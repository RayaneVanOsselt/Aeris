import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { CompareTable } from "@/components/product/CompareTable";
import { ProductFinder } from "@/components/product/ProductFinder";
import { ProductTrio } from "@/components/product/ProductTrio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const catalogMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "catalog" }, ...messages[locale].meta.catalog });

export function CatalogPage() {
  const { m, href } = getI18n();
  const p = m.pages.catalog;
  return (
    <>
      <PageHeader
        crumbs={[{ name: p.crumb, href: href("catalog") }]}
        eyebrow={p.eyebrow}
        title={<Rich text={p.title} />}
        aside={<ProductTrio ids={["fenetre", "plissee", "coulissante"]} />}
        intro={p.intro}
      />

      <section className="pb-[var(--section-y)] pt-10">
        <div className="container-site">
          <CatalogGrid items={products} />
        </div>
      </section>

      <section id="aide-au-choix" className="scroll-mt-24 pb-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.finderEyebrow} title={<Rich text={p.finderTitle} />} intro={p.finderIntro} />
          <div className="mt-12">
            <ProductFinder />
          </div>
        </div>
      </section>

      <section id="comparer" className="scroll-mt-24 border-t border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.compareEyebrow} title={p.compareTitle} intro={p.compareIntro} />
          <div className="mt-12">
            <CompareTable />
          </div>
        </div>
      </section>
    </>
  );
}
