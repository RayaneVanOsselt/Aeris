import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Politique cookies", description: "Cookies et stockage local utilisés par le site Aéris.", path: "/politique-cookies" });

export default function Page() {
  return (
    <LegalPage
      title="Politique cookies"
      path="/politique-cookies"
      intro="Ce que ce site enregistre dans votre navigateur, et comment gérer vos choix."
      sections={[
        {
          title: "Stockage strictement nécessaire",
          facts: [
            "aeris_cart_v2 : contenu du panier (configurations, sans donnée personnelle).",
            "aeris_orders_v1 : références et montants de vos commandes passées depuis cet appareil.",
            "aeris_consent : mémorise vos choix en matière de cookies.",
            "Ces éléments ne nécessitent pas de consentement et ne sont jamais transmis à des tiers.",
          ],
        },
        {
          title: "Mesure d'audience",
          facts: [
            "Aucun outil de mesure d'audience n'est chargé par défaut.",
            "Si un outil est configuré (Google Analytics 4), il n'est chargé qu'après votre accord explicite, révocable à tout moment via le lien « Gérer les cookies » en bas de page.",
          ],
          todo: "Mettre à jour cette section avec l'outil effectivement utilisé, ses cookies et leur durée.",
        },
        { title: "Gérer vos choix", facts: ["Le lien « Gérer les cookies » en pied de page permet de modifier votre choix à tout moment."] },
      ]}
    />
  );
}
