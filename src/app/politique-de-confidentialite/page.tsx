import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Politique de confidentialité", description: "Comment Aéris traite vos données personnelles (RGPD).", path: "/politique-de-confidentialite" });

export default function Page() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      path="/politique-de-confidentialite"
      intro="Quelles données nous collectons, pourquoi, et quels sont vos droits (RGPD)."
      sections={[
        { title: "Responsable du traitement", todo: "Identité et coordonnées du responsable du traitement (et du DPO le cas échéant)." },
        {
          title: "Données collectées",
          facts: [
            "Commande : prénom, nom, e-mail, téléphone, adresse de livraison, remarques, configuration des produits.",
            "Devis et contact : nom, e-mail, téléphone (facultatif), code postal (facultatif), message.",
            "Assistant en ligne : les questions posées, sans identification, utilisées uniquement pour produire la réponse.",
            "Aucune donnée bancaire n'est collectée par le site.",
          ],
        },
        {
          title: "Finalités et bases légales",
          facts: ["Traitement des commandes (exécution du contrat).", "Réponse aux demandes de devis et de contact (mesures précontractuelles / consentement exprimé dans le formulaire)."],
          todo: "Vérifier et compléter les bases légales, ajouter les éventuelles autres finalités.",
        },
        {
          title: "Destinataires et sous-traitants",
          facts: [
            "Les formulaires sont transmis par e-mail via le service Formspree (sous-traitant).",
            "Si un webhook CRM est configuré, une copie de la demande lui est transmise.",
            "Si l'assistant IA est connecté à un fournisseur (Anthropic ou OpenAI), les questions posées lui sont transmises pour générer la réponse.",
          ],
          todo: "Lister les sous-traitants effectivement utilisés, leurs garanties et les transferts hors UE éventuels.",
        },
        {
          title: "Stockage dans votre navigateur",
          facts: [
            "Le panier et l'historique de vos commandes sur cet appareil sont conservés dans le stockage local de votre navigateur (strictement nécessaire au fonctionnement).",
            "Vous pouvez les effacer à tout moment en vidant les données du site dans votre navigateur.",
          ],
        },
        { title: "Durées de conservation", todo: "Durée de conservation par catégorie de données (commandes, obligations comptables, demandes de contact)." },
        {
          title: "Vos droits",
          facts: ["Droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité.", "Droit d'introduire une réclamation auprès de l'Autorité de protection des données (APD)."],
          todo: "Adresse à laquelle exercer ces droits.",
        },
      ]}
    />
  );
}
