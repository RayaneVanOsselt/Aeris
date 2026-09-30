import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Mentions légales", description: "Mentions légales du site Aéris.", path: "/mentions-legales" });

export default function Page() {
  return (
    <LegalPage
      title="Mentions légales"
      path="/mentions-legales"
      intro="Les informations d'identification de l'entreprise qui exploite ce site."
      sections={[
        { title: "Éditeur du site", todo: "Dénomination sociale, forme juridique, adresse du siège, numéro d'entreprise (BCE), numéro de TVA, e-mail et téléphone de contact." },
        { title: "Responsable de la publication", todo: "Nom de la personne responsable du contenu du site." },
        { title: "Hébergement", facts: ["Le site est une application Next.js déployable sur Vercel ou tout hébergeur Node.js."], todo: "Nom, adresse et contact de l'hébergeur effectivement retenu." },
        { title: "Propriété intellectuelle", todo: "Conditions de réutilisation des textes, illustrations et marques du site." },
        { title: "Contact", facts: ["Un formulaire de contact est disponible sur la page Contact."] },
      ]}
    />
  );
}
