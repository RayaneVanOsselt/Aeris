import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { createReference, describeLine } from "@/lib/order";
import { computePrice } from "@/lib/pricing";
import { checkDimensions, hasBlockingIssue } from "@/lib/validation";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";
import { orderSchema } from "@/lib/server/schemas";

export async function POST(req: Request) {
  const result = await guard(req, orderSchema, { key: "order", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  const { customer, items, paymentMethod } = result.data;

  // Revalidation métier côté serveur : dimensions et prix recalculés, jamais repris du navigateur
  for (const item of items) {
    const product = getProduct(item.productId)!;
    if (hasBlockingIssue(checkDimensions(product, item.width, item.height))) {
      return jsonError(422, `Les dimensions de « ${product.name} » ne sont pas valides. Modifiez-les dans votre panier.`);
    }
  }
  const total = items.reduce((sum, item) => sum + computePrice(item).total, 0);
  const reference = createReference();

  try {
    await deliver(
      "order",
      `Nouvelle commande ${reference} — ${formatPrice(total)}`,
      {
        reference,
        client: `${customer.firstName} ${customer.lastName}`,
        telephone: customer.phone,
        adresse: `${customer.street}, ${customer.postalCode} ${customer.city}, ${customer.country}`,
        remarques: customer.notes ?? "",
        articles: items.map((i, n) => `${n + 1}. ${describeLine(i)}`).join("\n"),
        total_ttc: formatPrice(total),
        paiement_choisi: paymentMethod,
        statut: "En attente de paiement",
      },
      customer.email,
    );
  } catch (err) {
    console.error("[aeris] commande non transmise", err);
    return jsonError(502, "Votre commande n'a pas pu être transmise. Rien n'a été débité : réessayez dans un instant ou contactez-nous.");
  }

  return NextResponse.json({ ok: true, reference, total, summary: items.map(describeLine) });
}
