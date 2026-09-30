import { faq } from "@/lib/faq";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata = pageMetadata({
  title: "Questions fréquentes",
  description: "Choix du modèle, mesures, commande, paiement, délais, installation et garantie : toutes les réponses sur les moustiquaires sur mesure Aéris.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faq.flatMap((c) => c.items))} />
      <PageHeader
        crumbs={[{ name: "FAQ", href: "/faq" }]}
        eyebrow="Questions fréquentes"
        title={
          <>
            Tout savoir, <span className="accent text-sand-deep">avant et après.</span>
          </>
        }
        intro="Une réponse manque ? Notre assistant et notre équipe sont là."
      />
      <section className="container-site pb-[var(--section-y)] pt-12">
        <FaqExplorer categories={faq} />
      </section>
      <FinalCta />
    </>
  );
}
