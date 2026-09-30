import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata = pageMetadata({ title: "Commande confirmée", description: "Instructions de paiement de votre commande Aéris.", path: "/commande/confirmation", noindex: true });

export default function ConfirmationPage() {
  return (
    <section className="container-site py-12 pb-[var(--section-y)] md:py-16">
      <Suspense fallback={<div className="skeleton h-96 rounded-[var(--radius-xl)]" />}>
        <OrderConfirmation />
      </Suspense>
    </section>
  );
}
