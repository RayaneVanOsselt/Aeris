import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { pageMetadata } from "@/lib/seo";

export const confirmationMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "confirmation" }, ...messages[locale].meta.confirmation, noindex: true });

export function ConfirmationPage() {
  return (
    <section className="container-site py-12 pb-[var(--section-y)] md:py-16">
      <Suspense fallback={<div className="skeleton h-96 rounded-[var(--radius-xl)]" />}>
        <OrderConfirmation />
      </Suspense>
    </section>
  );
}
