"use client";

import { isStaticSite } from "./deploy";

export type Endpoint = "order" | "quote" | "contact" | "payment-notice";
export type ApiJson = { ok?: boolean; message?: string; fields?: Record<string, string> } & Record<string, unknown>;

/**
 * Envoie un formulaire. Sur Vercel : route API du site. Sur GitHub Pages :
 * validation identique dans le navigateur, puis envoi direct à Formspree.
 */
export async function sendForm(endpoint: Endpoint, body: unknown): Promise<{ status: number; json: ApiJson }> {
  if (!isStaticSite) {
    const res = await fetch(`/api/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: res.status, json: (await res.json().catch(() => ({}))) as ApiJson };
  }
  return sendStatic(endpoint, body);
}

async function sendStatic(endpoint: Endpoint, body: unknown): Promise<{ status: number; json: ApiJson }> {
  // Chargés uniquement au moment de l'envoi : aucun poids sur l'affichage des pages
  const [schemas, subs] = await Promise.all([import("./schemas"), import("./submissions")]);
  const schema = { order: schemas.orderSchema, quote: schemas.quoteSchema, contact: schemas.contactSchema, "payment-notice": schemas.paymentNoticeSchema }[endpoint];
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[issue.path.join(".")] ??= issue.message;
    if (fields.website !== undefined) return { status: 200, json: { ok: true } };
    return { status: 422, json: { ok: false, message: "Certains champs sont à corriger.", fields } };
  }

  let submission: import("./submissions").Submission;
  let extra: ApiJson = {};
  if (endpoint === "order") {
    const data = parsed.data as import("./schemas").OrderInput;
    const itemsError = subs.orderItemsError(data.items);
    if (itemsError) return { status: 422, json: { ok: false, message: itemsError } };
    const built = subs.orderSubmission(data);
    submission = built.submission;
    extra = { reference: built.reference, total: built.total, summary: built.summary };
  } else if (endpoint === "quote") submission = subs.quoteSubmission(parsed.data as import("./schemas").QuoteInput);
  else if (endpoint === "contact") submission = subs.contactSubmission(parsed.data as import("./schemas").ContactInput);
  else submission = subs.paymentSubmission(parsed.data as import("./schemas").PaymentNoticeInput);

  const res = await fetch(`https://formspree.io/f/${subs.formspreeIds[submission.kind]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(subs.formspreePayload(submission)),
  }).catch(() => null);
  if (!res) return { status: 0, json: { ok: false, message: "Connexion impossible. Vérifiez votre connexion internet puis réessayez." } };
  if (!res.ok) {
    return {
      status: 502,
      json: {
        ok: false,
        message:
          res.status === 429
            ? "Trop de demandes en peu de temps. Merci de patienter une minute avant de réessayer."
            : "L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez-nous directement.",
      },
    };
  }
  return { status: 200, json: { ok: true, ...extra } };
}
