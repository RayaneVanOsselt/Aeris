import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { MyOrders } from "@/components/checkout/MyOrders";

export const metadata = pageMetadata({ title: "Mes commandes", description: "Retrouvez vos commandes Aéris passées depuis cet appareil.", path: "/mes-commandes", noindex: true });

export default function MyOrdersPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Mes commandes", href: "/mes-commandes" }]}
        title="Mes commandes"
        intro="Les commandes passées depuis cet appareil, avec leurs instructions de paiement. Pas de compte, pas de mot de passe : votre référence suffit."
      />
      <section className="container-site pb-[var(--section-y)] pt-10">
        <MyOrders />
      </section>
    </>
  );
}
