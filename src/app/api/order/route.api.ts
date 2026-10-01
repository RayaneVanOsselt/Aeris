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
  if (itemsError) return jsonError(422, itemsError.code, { params: { product: itemsError.product } });
  const { reference, total, submission } = orderSubmission(result.data);

  try {
    await deliver(submission);
  } catch (err) {
    console.error("[aeris] commande non transmise", err);
    return jsonError(502, "orderFailed");
  }
  return NextResponse.json({ ok: true, reference, total });
}
