import type { Locale } from "@/i18n/config";
import { faqItems } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { CompareTable } from "@/components/product/CompareTable";
import { ProductFinder } from "@/components/product/ProductFinder";
import { ProductTrio } from "@/components/product/ProductTrio";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategory, productsForOpenings, type CategoryId } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const categoryMeta = (locale: Locale, id: CategoryId) => {
  const text = messages[locale].catalog.categories[id];
  return pageMetadata({ locale, target: { key: "category", id }, title: text.title, description: text.intro });
};

export function CategoryPage({ id }: { id: CategoryId }) {
  const { m, href, locale } = getI18n();
  const category = getCategory(id)!;
  const text = m.catalog.categories[id];
  const p = m.pages.category;
  const items = productsForOpenings(category.openings);

  return (
    <>
      <PageHeader
        crumbs={[
          { name: m.pages.catalog.crumb, href: href("catalog") },
          { name: text.name, href: href("category", id) },
        ]}
        eyebrow={text.forLabel}
        title={text.title}
        intro={text.intro}
        aside={<ProductTrio ids={id === "fenetres" ? ["fixe", "fenetre", "sur-mesure-plus"] : ["enroulable", "plissee", "battante"]} />}
      />
      <section className="pb-[var(--section-y)] pt-10">
        <div className="container-site">
          <CatalogGrid items={items} filters={category.openings} />
        </div>
      </section>
      <section className="border-t border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.compareEyebrow} title={p.compareTitle} />
          <div className="mt-12">
            <CompareTable ids={items.map((product) => product.id)} />
          </div>
        </div>
      </section>
      <section className="py-[var(--section-y)]">
        <div className="container-site">
          <ProductFinder />
          <div className="mt-[var(--section-y)] grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow={p.questionsEyebrow} title={p.questionsTitle} />
            </div>
            <div className="lg:col-span-8">
              <Accordion items={faqItems(locale, "produits").slice(0, 3)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
