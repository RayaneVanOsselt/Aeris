import { notFound } from "next/navigation";
import { categories, getCategory, productsForOpenings } from "@/lib/catalog";
import { faq } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { CompareTable } from "@/components/product/CompareTable";
import { ProductFinder } from "@/components/product/ProductFinder";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Params = { categorie: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { categorie } = await params;
  const category = getCategory(categorie);
  if (!category) return {};
  return pageMetadata({ title: category.title, description: category.intro, path: `/moustiquaires/${category.slug}` });
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { categorie } = await params;
  const category = getCategory(categorie);
  if (!category) notFound();
  const items = productsForOpenings(category.openings);
  const questions = faq.find((c) => c.id === "produits")?.items.slice(0, 3) ?? [];

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Moustiquaires", href: "/moustiquaires" },
          { name: category.name, href: `/moustiquaires/${category.slug}` },
        ]}
        eyebrow={`Pour ${category.name.toLowerCase()}`}
        title={category.title}
        intro={category.intro}
      />
      <section className="pb-[var(--section-y)] pt-10">
        <div className="container-site">
          <CatalogGrid items={items} filters={category.openings} />
        </div>
      </section>
      <section className="border-t border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow="Comparer" title="Quelle différence entre ces modèles ?" />
          <div className="mt-12">
            <CompareTable ids={items.map((p) => p.id)} />
          </div>
        </div>
      </section>
      <section className="py-[var(--section-y)]">
        <div className="container-site">
          <ProductFinder />
          <div className="mt-[var(--section-y)] grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Questions" title="Bien choisir." />
            </div>
            <div className="lg:col-span-8">
              <Accordion items={questions} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
