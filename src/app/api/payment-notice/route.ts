import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";
import { paymentNoticeSchema } from "@/lib/server/schemas";

/** Le client signale avoir payé : l'équipe est prévenue pour vérifier la réception. */
export async function POST(req: Request) {
  const result = await guard(req, paymentNoticeSchema, { key: "payment", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  const { reference, method } = result.data;
  try {
    await deliver("payment", `Paiement signalé — ${reference}`, { reference, methode: method, statut: "Paiement signalé par le client, à vérifier" });
  } catch (err) {
    console.error("[aeris] signalement de paiement non transmis", err);
    return jsonError(502, "Le signalement n'a pas pu être envoyé. Votre paiement reste valable : nous le verrons à réception.");
  }
  return NextResponse.json({ ok: true });
}
