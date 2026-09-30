/**
 * FAQ — reprise de l'ancien site, corrigée pour rester cohérente
 * (moyens de paiement réels : Revolut et virement SEPA ; plus de
 * comptes clients). Contenu à relire et valider par l'entreprise.
 */
export type FaqItem = { q: string; a: string; home?: boolean };
export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const faq: FaqCategory[] = [
  {
    id: "produits",
    title: "Choisir son modèle",
    items: [
      {
        q: "Quelle moustiquaire choisir pour mon ouverture ?",
        a: "Pour une fenêtre ouverte régulièrement, la moustiquaire fenêtre à clips est la plus polyvalente ; pour une fenêtre rarement ouverte, le cadre fixe est le plus économique. Pour une porte de passage quotidien : enroulable ou battante. Pour une porte-fenêtre ou une baie : plissée ou coulissante. Notre aide au choix vous guide en trois questions.",
        home: true,
      },
      {
        q: "Quelles toiles proposez-vous ?",
        a: "Fibre de verre (standard), aluminium, anti-pollen, anti-griffe (Pet) pour les foyers avec animaux, et solaire occultante. Le choix se fait dans le configurateur, avec l'impact sur le prix affiché immédiatement.",
      },
      {
        q: "Puis-je choisir un coloris RAL spécifique ?",
        a: "Oui. En plus des coloris standards (blanc, anthracite, brun, sable, noir mat), l'option « RAL sur mesure » permet d'assortir la moustiquaire à vos menuiseries.",
      },
      {
        q: "Gérez-vous les formes spéciales ou les très grandes dimensions ?",
        a: "Oui, via notre service Sur mesure + : très grandes dimensions, formes atypiques (cintres, trapèzes) et contraintes de pose particulières font l'objet d'une étude personnalisée.",
      },
    ],
  },
  {
    id: "mesures",
    title: "Mesures",
    items: [
      {
        q: "Comment prendre mes mesures ?",
        a: "Mesurez la largeur et la hauteur de l'ouverture en millimètres, en plusieurs points. Notre guide des mesures détaille chaque cas. En cas de doute, envoyez-nous une photo : nous vérifions chaque configuration avant fabrication.",
        home: true,
      },
      {
        q: "Quelles sont les dimensions minimales et maximales ?",
        a: "Le configurateur accepte de 200 à 2 400 mm de largeur et de 200 à 2 600 mm de hauteur. Au-delà, notre service Sur mesure + étudie votre projet.",
      },
      {
        q: "Et si je me suis trompé dans les mesures ?",
        a: "Contactez-nous au plus vite : tant que la fabrication n'a pas démarré, nous pouvons corriger les dimensions.",
      },
    ],
  },
  {
    id: "commande",
    title: "Commande & paiement",
    items: [
      {
        q: "Comment passer commande ?",
        a: "Configurez votre moustiquaire, ajoutez-la au panier, puis renseignez vos coordonnées. Vous recevez ensuite les instructions de paiement. Aucun compte n'est nécessaire.",
      },
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Revolut et virement bancaire SEPA. Vos données bancaires ne transitent jamais par notre site. La fabrication démarre dès réception du paiement.",
        home: true,
      },
      {
        q: "Proposez-vous des devis ?",
        a: "Oui. Depuis le configurateur ou la page devis, envoyez-nous votre projet : nous revenons vers vous avec une proposition, sans engagement.",
      },
      {
        q: "Puis-je modifier ma commande ?",
        a: "Tant que la fabrication n'a pas démarré, contactez-nous avec votre référence de commande : nous ajustons dimensions ou finitions si possible.",
      },
      {
        q: "Y a-t-il un minimum de commande ?",
        a: "Non, vous pouvez commander une seule moustiquaire.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Délais & livraison",
    items: [
      {
        q: "Quels sont les délais ?",
        a: "Le délai de fabrication dépend du modèle et s'affiche dans le configurateur (de 5 à 25 jours ouvrés selon le modèle). La date de livraison vous est confirmée par e-mail.",
        home: true,
      },
      {
        q: "Où livrez-vous ?",
        a: "En Belgique et dans l'Union européenne. Les frais et la date de livraison vous sont confirmés avant fabrication.",
      },
      {
        q: "Que faire si mon colis est endommagé ?",
        a: "Émettez des réserves auprès du transporteur et contactez-nous rapidement avec des photos : nous trouvons une solution.",
      },
    ],
  },
  {
    id: "installation",
    title: "Installation & entretien",
    items: [
      {
        q: "L'installation est-elle difficile ?",
        a: "Non. Chaque moustiquaire est livrée avec sa notice. La moustiquaire fenêtre se pose par clips, sans perçage, et le rideau magnétique s'installe sans outils.",
        home: true,
      },
      {
        q: "Proposez-vous la pose à domicile ?",
        a: "Sur certaines zones. Indiquez-le dans votre demande de devis pour connaître la disponibilité près de chez vous.",
      },
      {
        q: "Comment entretenir la toile ?",
        a: "Une éponge humide suffit. Les modèles à cadre sont démontables pour un entretien complet ou un rangement l'hiver.",
      },
    ],
  },
  {
    id: "garantie",
    title: "Garantie & retours",
    items: [
      {
        q: "Quelle est la garantie ?",
        a: "Les pièces et mécanismes sont garantis 5 ans dans des conditions normales d'utilisation. Les dommages accidentels et l'usure liée à un mauvais entretien ne sont pas couverts.",
        home: true,
      },
      {
        q: "Puis-je retourner une moustiquaire sur mesure ?",
        a: "Les produits fabriqués sur mesure ne bénéficient pas du droit de rétractation standard, sauf défaut. C'est pourquoi nous vérifions chaque configuration avant fabrication.",
      },
      {
        q: "Que se passe-t-il en cas d'erreur de notre part ?",
        a: "Si la moustiquaire ne correspond pas à votre commande validée, nous la refabriquons à nos frais.",
      },
    ],
  },
];

export const homeFaq = faq.flatMap((c) => c.items).filter((i) => i.home);
