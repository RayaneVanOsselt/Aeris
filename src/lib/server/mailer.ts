/**
 * Acheminement des demandes (commande, devis, contact, paiement signalé).
 * - log       : écrit dans la console serveur, n'envoie rien (défaut hors production)
 * - formspree : transfère vers Formspree (défaut en production)
 * Un webhook CRM optionnel reçoit une copie de chaque demande.
 */
import { formspreeIds, formspreePayload, type Submission } from "../submissions";


const transport = process.env.MAIL_TRANSPORT ?? (process.env.NODE_ENV === "production" ? "formspree" : "log");

export class DeliveryError extends Error {}

export async function deliver(submission: Submission) {
  const { kind, subject, fields } = submission;
  const payload = formspreePayload(submission);

  if (transport === "formspree") {
    const res = await fetch(`https://formspree.io/f/${formspreeIds[kind]}`, {
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
