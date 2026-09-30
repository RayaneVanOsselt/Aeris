import { NextResponse } from "next/server";
import { describeLine } from "@/lib/order";
import { guard } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";
import { quoteSchema } from "@/lib/server/schemas";
import { jsonError } from "@/lib/server/http";

export async function POST(req: Request) {
  const result = await guard(req, quoteSchema, { key: "quote", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  const q = result.data;

  let configuration = "";
  if (q.configuration) {
    try {
      configuration = describeLine(q.configuration);
    } catch {
      configuration = "Configuration jointe invalide";
    }
  }

  try {
    await deliver(
      "quote",
      `Demande de devis — ${q.name}`,
      {
        type: "Demande de devis",
        origine: q.source,
        nom: q.name,
        telephone: q.phone ?? "",
        code_postal: q.postalCode ?? "",
        nombre_ouvertures: q.openings ?? "",
        configuration,
        message: q.message,
      },
      q.email,
    );
  } catch (err) {
    console.error("[aeris] devis non transmis", err);
    return jsonError(502, "Votre demande n'a pas pu être envoyée. Réessayez dans un instant.");
  }
  return NextResponse.json({ ok: true });
}
