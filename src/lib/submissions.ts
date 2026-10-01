import type { Locale } from "@/i18n/config";
import { formatters } from "@/i18n/format";
import { fr } from "@/i18n/messages/fr";
import { getProduct, type ProductId } from "./catalog";
import { createReference, describeLine } from "./order";
import { computePrice } from "./pricing";
import type { ContactInput, OrderInput, PaymentNoticeInput, QuoteInput } from "./schemas";
import { checkDimensions, hasBlockingIssue } from "./validation";

/**
 * Préparation des envois (commande, devis, contact, paiement signalé).
 * Partagée entre les routes API (hébergement Vercel) et l'envoi direct
 * depuis le navigateur (version statique GitHub Pages).
 * Les e-mails reçus par l'équipe sont toujours en français ; la langue
 * du client y est indiquée pour lui répondre dans sa langue.
 */
export type SubmissionKind = "order" | "quote" | "contact" | "payment";
export type Submission = { kind: SubmissionKind; subject: string; fields: Record<string, string>; replyTo?: string };

const f = formatters("fr");
const languageNames: Record<Locale, string> = { fr: "français", nl: "néerlandais", en: "anglais" };
const language = (locale?: Locale) => languageNames[locale ?? "fr"];

/** Contrôle métier des articles : dimensions valides pour chaque modèle. */
export function orderItemsError(items: OrderInput["items"]): { code: "dimensionsInvalid"; product: ProductId } | null {
  for (const item of items) {
    const product = getProduct(item.productId)!;
    if (hasBlockingIssue(checkDimensions(product, item.width, item.height))) return { code: "dimensionsInvalid", product: product.id };
  }
  return null;
}

export function orderSubmission(input: OrderInput) {
  const { customer, items, paymentMethod } = input;
  const total = items.reduce((sum, item) => sum + computePrice(item).total, 0);
  const reference = createReference();
  const submission: Submission = {
    kind: "order",
    subject: `Nouvelle commande ${reference} — ${f.price(total)}`,
    fields: {
      reference,
      client: `${customer.firstName} ${customer.lastName}`,
      langue: language(input.locale),
      telephone: customer.phone,
      adresse: `${customer.street}, ${customer.postalCode} ${customer.city}, ${customer.country}`,
      remarques: customer.notes ?? "",
      articles: items.map((item, n) => `${n + 1}. ${describeLine(item, fr, f)}`).join("\n"),
      total_ttc: f.price(total),
      paiement_choisi: paymentMethod,
      statut: "En attente de paiement",
    },
    replyTo: customer.email,
  };
  return { reference, total, submission };
}

export function quoteSubmission(q: QuoteInput): Submission {
  let configuration = "";
  if (q.configuration) {
    try {
      configuration = describeLine(q.configuration, fr, f);
    } catch {
      configuration = "Configuration jointe invalide";
    }
  }
  return {
    kind: "quote",
    subject: `Demande de devis — ${q.name}`,
    fields: {
      type: "Demande de devis",
      origine: q.source,
      nom: q.name,
      langue: language(q.locale),
      telephone: q.phone ?? "",
      code_postal: q.postalCode ?? "",
      nombre_ouvertures: q.openings ?? "",
      configuration,
      message: q.message,
    },
    replyTo: q.email,
  };
}

export function contactSubmission(c: ContactInput): Submission {
  return {
    kind: "contact",
    subject: `Contact — ${c.subject} — ${c.firstName} ${c.lastName}`,
    fields: {
      sujet: c.subject,
      nom: `${c.firstName} ${c.lastName}`,
      langue: language(c.locale),
      telephone: c.phone ?? "",
      reference_commande: c.orderRef ?? "",
      message: c.message,
    },
    replyTo: c.email,
  };
}

export function paymentSubmission(p: PaymentNoticeInput): Submission {
  return {
    kind: "payment",
    subject: `Paiement signalé — ${p.reference}`,
    fields: { reference: p.reference, methode: p.method, langue: language(p.locale), statut: "Paiement signalé par le client, à vérifier" },
  };
}

/** Identifiants Formspree (publics par nature : ils figuraient déjà dans l'ancien site). */
export const formspreeIds: Record<SubmissionKind, string> = {
  order: process.env.NEXT_PUBLIC_FORMSPREE_ORDER_ID ?? "xykqgqyj",
  payment: process.env.NEXT_PUBLIC_FORMSPREE_ORDER_ID ?? "xykqgqyj",
  quote: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID ?? "mgojwjvp",
  contact: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID ?? "mgojwjvp",
};

export function formspreePayload(s: Submission, honeypot?: string) {
  return { _subject: s.subject, ...(s.replyTo ? { email: s.replyTo, _replyto: s.replyTo } : {}), ...(honeypot ? { _gotcha: honeypot } : {}), ...s.fields };
}
