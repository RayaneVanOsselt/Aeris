import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const cartMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "cart" }, ...messages[locale].meta.cart, noindex: true });

export function CartPage() {
  const { m, href } = getI18n();
  const p = m.pages.cart;
  return (
    <>
      <PageHeader crumbs={[{ name: p.crumb, href: href("cart") }]} title={p.title} intro={p.intro} />
      <section className="container-site pb-[var(--section-y)] pt-10">
        <CartView />
      </section>
    </>
  );
}
