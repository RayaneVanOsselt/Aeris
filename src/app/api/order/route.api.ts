import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schemas";
import { orderItemsError, orderSubmission } from "@/lib/submissions";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";

export async function POST(req: Request) {
  const result = await guard(req, orderSchema, { key: "order", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;

  // Revalidation métier côté serveur : dimensions contrôlées, prix recalculés (jamais repris du navigateur)
  const itemsError = orderItemsError(result.data.items);
  if (itemsError) return jsonError(422, itemsError);
  const { reference, total, summary, submission } = orderSubmission(result.data);

  try {
    await deliver(submission);
  } catch (err) {
    console.error("[aeris] commande non transmise", err);
    return jsonError(502, "Votre commande n'a pas pu être transmise. Rien n'a été débité : réessayez dans un instant ou contactez-nous.");
  }
  return NextResponse.json({ ok: true, reference, total, summary });
}
