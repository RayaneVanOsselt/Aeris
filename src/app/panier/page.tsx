import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { CartView } from "@/components/cart/CartView";

export const metadata = pageMetadata({ title: "Votre panier", description: "Vérifiez vos moustiquaires sur mesure avant de passer commande.", path: "/panier", noindex: true });

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Panier", href: "/panier" }]} title="Votre panier" intro="Vérifiez vos configurations. Vous pouvez encore modifier chaque moustiquaire." />
      <section className="container-site pb-[var(--section-y)] pt-10">
        <CartView />
      </section>
    </>
  );
}
