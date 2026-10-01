import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const checkoutMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "checkout" }, ...messages[locale].meta.checkout, noindex: true });

export function CheckoutPage() {
  const { m, href } = getI18n();
  const p = m.pages.checkout;
  return (
    <>
      <PageHeader
        crumbs={[
          { name: m.pages.cart.crumb, href: href("cart") },
          { name: p.crumb, href: href("checkout") },
        ]}
        title={p.title}
        intro={p.intro}
      />
      <section className="container-site pb-[var(--section-y)] pt-10">
        <CheckoutForm />
      </section>
    </>
  );
}
