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
 *  avant la mise en ligne publique. Leurs textes, dans chaque
 *  langue, sont dans src/i18n/messages (clé « claims »).
 * ─────────────────────────────────────────────────────────────
 */
import type { ProductId } from "./catalog";

/** Mode préparation (repères ◆, emplacements « À compléter ») : uniquement si activé explicitement. */
export const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";

export const company = {
  name: "Aéris",
  legalName: null as string | null, // ex. « Aéris SRL » — à compléter
  vatNumber: null as string | null, // n° BCE / TVA — à compléter
  email: null as string | null, // l'ancien site affichait une adresse d'exemple
  phone: null as string | null, // l'ancien site affichait un numéro fictif
  address: null as null | { street: string; postalCode: string; city: string; country: string },
  openingHours: null as string | null,
  /** Délai de réponse annoncé sur l'ancien site (page contact) : à confirmer */
  responseTimeToConfirm: true,
  /** Zones de livraison annoncées sur l'ancien site (FAQ) : à confirmer */
  deliveryAreaToConfirm: true,
  socials: [] as Array<{ label: string; href: string }>,
  foundedYear: null as number | null,
} as const;

export type ClaimKey = "madeToMeasure" | "checkedBeforeProduction" | "europeanMade" | "warranty" | "directPayment" | "instantPrice" | "humanSupport";

/** Engagements affichés dans la barre de réassurance et près des CTA. */
export const claims: Record<ClaimKey, { toConfirm: boolean }> = {
  madeToMeasure: { toConfirm: false },
  checkedBeforeProduction: { toConfirm: true },
  europeanMade: { toConfirm: true },
  warranty: { toConfirm: true },
  directPayment: { toConfirm: false },
  instantPrice: { toConfirm: false },
  humanSupport: { toConfirm: false },
};

/**
 * Un engagement non confirmé n'est jamais affiché en production ;
 * en mode préparation, il apparaît avec un repère ◆.
 */
export function isClaimVisible(key: ClaimKey) {
  return !claims[key].toConfirm || showPlaceholders;
}

/** Moyens de paiement RÉELLEMENT proposés (page paiement de l'ancien site). */
export const payment = {
  methods: ["Revolut", "Virement SEPA"] as const,
  revolut: {
    url: "https://revolut.me/rvanosselt0808",
  },
  bankTransfer: {
    beneficiary: "AÉRIS",
    iban: "BE96 3771 4947 3805",
  },
  /** La fabrication démarre à réception du paiement (ancien site). */
  productionStartsOnPayment: true,
  vatRate: 0.21,
} as const;

export type PaymentMethod = (typeof payment.methods)[number];

/** Livraison : l'ancien site était contradictoire (« gratuite » vs « selon adresse »). */
export const shipping = {
  toConfirm: true,
} as const;

/** Preuve sociale : vide tant qu'aucun avis authentique n'est disponible. */
export type Review = {
  author: string;
  city?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Avis cité dans sa langue d'origine */
  text: string;
  date: string; // ISO
  source: string; // ex. « Google »
  productId?: ProductId;
};
export const reviews: Review[] = [];

/** Réalisations clients (photos réelles). Vide pour l'instant. */
export type Realisation = { title: string; city?: string; productId: ProductId; image: string; alt: string };
export const realisations: Realisation[] = [];
