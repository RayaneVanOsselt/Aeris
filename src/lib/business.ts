/**
 * ─────────────────────────────────────────────────────────────
 *  Informations business d'Aéris — SOURCE UNIQUE DE VÉRITÉ
 * ─────────────────────────────────────────────────────────────
 *  Tout le site (pages, SEO, assistant IA) lit ces valeurs.
 *  Règle : on n'invente rien. Une valeur `null` = information
 *  inconnue → le site affiche un emplacement « À compléter »
 *  (si NEXT_PUBLIC_SHOW_PLACEHOLDERS=true) ou masque l'élément.
 *
 *  Les engagements marqués `toConfirm: true` proviennent de
 *  l'ancien site : ils doivent être validés par l'entreprise
 *  avant la mise en ligne publique.
 * ─────────────────────────────────────────────────────────────
 */

export type Claim = {
  /** Texte court affiché (badge, liste de réassurance) */
  label: string;
  /** Détail affiché en complément */
  detail: string;
  /** Provient de l'ancien site, non vérifié : à confirmer */
  toConfirm: boolean;
};

export const company = {
  name: "Aéris",
  legalName: null as string | null, // ex. « Aéris SRL » — à compléter
  tagline: "Moustiquaires sur mesure",
  vatNumber: null as string | null, // n° BCE / TVA — à compléter
  email: null as string | null, // l'ancien site affichait une adresse d'exemple
  phone: null as string | null, // l'ancien site affichait un numéro fictif
  address: null as null | { street: string; postalCode: string; city: string; country: string },
  openingHours: null as string | null,
  /** Délai de réponse annoncé sur l'ancien site (page contact) */
  responseTime: { label: "Réponse sous 24 h ouvrées", toConfirm: true },
  socials: [] as Array<{ label: string; href: string }>,
  /** Zones de livraison annoncées sur l'ancien site (FAQ) */
  deliveryArea: { label: "Belgique et Union européenne", toConfirm: true },
  foundedYear: null as number | null,
} as const;

/** Engagements affichés dans la barre de réassurance et près des CTA. */
export const claims = {
  madeToMeasure: {
    label: "Sur mesure, au millimètre",
    detail: "Chaque moustiquaire est fabriquée à partir de vos dimensions exactes.",
    toConfirm: false,
  },
  checkedBeforeProduction: {
    label: "Vérifiée avant fabrication",
    detail: "Nous relisons chaque configuration avant de lancer la fabrication.",
    toConfirm: true,
  },
  europeanMade: {
    label: "Fabrication européenne",
    detail: "Profilés aluminium et toiles techniques fabriqués en Europe.",
    toConfirm: true,
  },
  warranty: {
    label: "Garantie 5 ans",
    detail: "Pièces et mécanismes garantis 5 ans en utilisation normale.",
    toConfirm: true,
  },
  directPayment: {
    label: "Paiement direct",
    detail: "Revolut ou virement SEPA : vos données bancaires ne transitent jamais par ce site.",
    toConfirm: false,
  },
  humanSupport: {
    label: "Une équipe qui répond",
    detail: "Une question sur vos mesures ? Nous vous répondons personnellement.",
    toConfirm: false,
  },
} satisfies Record<string, Claim>;

export type ClaimKey = keyof typeof claims;

/** Moyens de paiement RÉELLEMENT proposés (page paiement de l'ancien site). */
export const payment = {
  methods: ["Revolut", "Virement SEPA"] as const,
  revolut: {
    url: "https://revolut.me/rvanosselt0808",
    label: "Revolut",
  },
  bankTransfer: {
    beneficiary: "AÉRIS",
    iban: "BE96 3771 4947 3805",
  },
  /** La fabrication démarre à réception du paiement (ancien site). */
  productionStartsOnPayment: true,
  vatRate: 0.21,
} as const;

/** Livraison : l'ancien site était contradictoire (« gratuite » vs « selon adresse »). */
export const shipping = {
  label: "Confirmée avec votre commande",
  detail: "Les frais et la date de livraison vous sont confirmés par e-mail avant fabrication.",
  toConfirm: true,
} as const;

/** Preuve sociale : vide tant qu'aucun avis authentique n'est disponible. */
export type Review = {
  author: string;
  city?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string; // ISO
  source: string; // ex. « Google »
  productSlug?: string;
};
export const reviews: Review[] = [];

/** Réalisations clients (photos réelles). Vide pour l'instant. */
export type Realisation = { title: string; city?: string; productSlug: string; image: string; alt: string };
export const realisations: Realisation[] = [];

export const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false";
