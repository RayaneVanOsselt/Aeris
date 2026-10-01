import type { Locale } from "@/i18n/config";
import { faqs } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const faqMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "faq" }, ...messages[locale].meta.faq });

export function FaqPage() {
  const { m, href, locale } = getI18n();
  const p = m.pages.faq;
  const categories = faqs[locale];
  return (
    <>
      <JsonLd data={faqJsonLd(categories.flatMap((c) => c.items))} />
      <PageHeader crumbs={[{ name: p.crumb, href: href("faq") }]} eyebrow={p.eyebrow} title={<Rich text={p.title} />} intro={p.intro} />
      <section className="container-site pb-[var(--section-y)] pt-12">
        <FaqExplorer categories={categories} labels={{ search: p.search, searchPlaceholder: p.searchPlaceholder, categories: p.categories, count: p.count, for: p.for, empty: p.empty }} />
      </section>
      <FinalCta />
    </>
  );
}
