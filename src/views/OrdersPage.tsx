import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { MyOrders } from "@/components/checkout/MyOrders";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const ordersMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "orders" }, ...messages[locale].meta.orders, noindex: true });

export function OrdersPage() {
  const { m, href } = getI18n();
  const p = m.pages.orders;
  return (
    <>
      <PageHeader crumbs={[{ name: p.crumb, href: href("orders") }]} title={p.title} intro={p.intro} />
      <section className="container-site pb-[var(--section-y)] pt-10">
        <MyOrders />
      </section>
    </>
  );
}
