/**
 * Acheminement des demandes (commande, devis, contact, paiement signalé).
 * - log       : écrit dans la console serveur, n'envoie rien (défaut hors production)
 * - formspree : transfère vers Formspree (défaut en production)
 * Un webhook CRM optionnel reçoit une copie de chaque demande.
 */
type Kind = "order" | "quote" | "contact" | "payment";

const transport = process.env.MAIL_TRANSPORT ?? (process.env.NODE_ENV === "production" ? "formspree" : "log");

const formIds: Record<Kind, string> = {
  order: process.env.FORMSPREE_ORDER_ID ?? "xykqgqyj",
  payment: process.env.FORMSPREE_ORDER_ID ?? "xykqgqyj",
  quote: process.env.FORMSPREE_CONTACT_ID ?? "mgojwjvp",
  contact: process.env.FORMSPREE_CONTACT_ID ?? "mgojwjvp",
};

export class DeliveryError extends Error {}

export async function deliver(kind: Kind, subject: string, fields: Record<string, string>, replyTo?: string) {
  const payload = { _subject: subject, ...(replyTo ? { email: replyTo, _replyto: replyTo } : {}), ...fields };

  if (transport === "formspree") {
    const res = await fetch(`https://formspree.io/f/${formIds[kind]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => null);
    if (!res || !res.ok) throw new DeliveryError(`Formspree a refusé l'envoi (${res?.status ?? "réseau"})`);
  } else {
    console.info(`[aeris:${kind}] ${subject}\n${JSON.stringify(payload, null, 2)}`);
  }

  const webhook = process.env.CRM_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, fields, createdAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(5_000),
    }).catch((err) => console.error("[aeris] webhook CRM indisponible", err));
  }
}
