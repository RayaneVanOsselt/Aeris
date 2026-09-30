import { payment } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Conditions générales de vente", description: "Conditions générales de vente des moustiquaires sur mesure Aéris.", path: "/conditions-generales-de-vente" });

export default function Page() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      path="/conditions-generales-de-vente"
      intro="Les règles qui encadrent votre commande de moustiquaires fabriquées sur mesure."
      sections={[
        { title: "Objet et champ d'application", todo: "Parties, produits concernés, acceptation des CGV lors de la commande." },
        {
          title: "Commande",
          facts: [
            "La commande se passe en ligne, sans création de compte : configuration, panier, coordonnées, puis confirmation.",
            "Une référence de commande (format AER-AAMMJJ-XXXX) est attribuée et communiquée au client.",
          ],
          todo: "Moment de formation du contrat, confirmation par e-mail, possibilité de modification avant fabrication.",
        },
        {
          title: "Prix",
          facts: ["Les prix sont affichés en euros, toutes taxes comprises (TVA belge de 21 % incluse), et calculés selon les dimensions et options choisies."],
          todo: "Frais de livraison, validité des prix, conditions des devis.",
        },
        {
          title: "Paiement",
          facts: [`Moyens de paiement proposés : ${payment.methods.join(" et ")}.`, "La fabrication démarre à réception du paiement.", "Aucune donnée bancaire n'est saisie ni stockée sur le site."],
          todo: "Délai de paiement, conséquences d'un défaut de paiement.",
        },
        { title: "Fabrication et livraison", facts: ["Les délais de fabrication indicatifs par modèle sont affichés dans le configurateur."], todo: "Zones et frais de livraison, transfert des risques, réserves en cas de colis endommagé." },
        {
          title: "Droit de rétractation",
          todo: "Rédaction de l'exception applicable aux biens confectionnés selon les spécifications du consommateur (Code de droit économique, art. VI.53), à faire valider par un juriste.",
        },
        { title: "Garanties", todo: "Garantie légale de conformité (2 ans) et, le cas échéant, garantie commerciale (durée, périmètre, exclusions)." },
        { title: "Réclamations et litiges", todo: "Procédure de réclamation, médiation (Service de médiation pour le consommateur), droit applicable et juridiction compétente." },
      ]}
    />
  );
}
