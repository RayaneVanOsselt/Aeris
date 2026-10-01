import { NextResponse } from "next/server";
import { paymentNoticeSchema } from "@/lib/schemas";
import { paymentSubmission } from "@/lib/submissions";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";

/** Le client signale avoir payé : l'équipe est prévenue pour vérifier la réception. */
export async function POST(req: Request) {
  const result = await guard(req, paymentNoticeSchema, { key: "payment", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  try {
    await deliver(paymentSubmission(result.data));
  } catch (err) {
    console.error("[aeris] signalement de paiement non transmis", err);
    return jsonError(502, "paymentFailed");
  }
  return NextResponse.json({ ok: true });
}
