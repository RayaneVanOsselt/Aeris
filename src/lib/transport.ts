"use client";

import type { SubmitCode } from "@/i18n/messages";
import { isStaticSite } from "./deploy";

export type Endpoint = "order" | "quote" | "contact" | "payment-notice";
/** Réponse d'envoi : des codes (traduits à l'affichage), jamais de texte. */
export type ApiJson = { ok?: boolean; code?: SubmitCode; params?: Record<string, string>; fields?: Record<string, string> } & Record<string, unknown>;

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
    const fields = schemas.fieldErrors(parsed.error.issues);
    if (fields.website !== undefined) return { status: 200, json: { ok: true } };
    return { status: 422, json: { ok: false, code: "fieldsInvalid", fields } };
  }

  let submission: import("./submissions").Submission;
  let extra: ApiJson = {};
  if (endpoint === "order") {
    const data = parsed.data as import("./schemas").OrderInput;
    const itemsError = subs.orderItemsError(data.items);
    if (itemsError) return { status: 422, json: { ok: false, code: itemsError.code, params: { product: itemsError.product } } };
    const built = subs.orderSubmission(data);
    submission = built.submission;
    extra = { reference: built.reference, total: built.total };
  } else if (endpoint === "quote") submission = subs.quoteSubmission(parsed.data as import("./schemas").QuoteInput);
  else if (endpoint === "contact") submission = subs.contactSubmission(parsed.data as import("./schemas").ContactInput);
  else submission = subs.paymentSubmission(parsed.data as import("./schemas").PaymentNoticeInput);

  const res = await fetch(`https://formspree.io/f/${subs.formspreeIds[submission.kind]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(subs.formspreePayload(submission)),
  }).catch(() => null);
  if (!res) return { status: 0, json: { ok: false, code: "network" } };
  if (!res.ok) return { status: 502, json: { ok: false, code: res.status === 429 ? "rateLimited" : "failed" } };
  return { status: 200, json: { ok: true, ...extra } };
}
