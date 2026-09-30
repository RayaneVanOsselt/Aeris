import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = pageMetadata({ title: "Commande", description: "Finalisez votre commande de moustiquaires sur mesure.", path: "/commande", noindex: true });

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Panier", href: "/panier" },
          { name: "Commande", href: "/commande" },
        ]}
        title="Finaliser la commande"
        intro="Trois informations et c'est terminé. Aucun compte à créer, aucune donnée bancaire demandée ici."
      />
      <section className="container-site pb-[var(--section-y)] pt-10">
        <CheckoutForm />
      </section>
    </>
  );
}
