import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";
import { contactSchema } from "@/lib/server/schemas";

export async function POST(req: Request) {
  const result = await guard(req, contactSchema, { key: "contact", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  const c = result.data;
  try {
    await deliver(
      "contact",
      `Contact — ${c.subject} — ${c.firstName} ${c.lastName}`,
      { sujet: c.subject, nom: `${c.firstName} ${c.lastName}`, telephone: c.phone ?? "", reference_commande: c.orderRef ?? "", message: c.message },
      c.email,
    );
  } catch (err) {
    console.error("[aeris] contact non transmis", err);
    return jsonError(502, "Votre message n'a pas pu être envoyé. Réessayez dans un instant.");
  }
  return NextResponse.json({ ok: true });
}
