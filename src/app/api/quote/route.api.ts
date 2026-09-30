import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/schemas";
import { quoteSubmission } from "@/lib/submissions";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";

export async function POST(req: Request) {
  const result = await guard(req, quoteSchema, { key: "quote", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  try {
    await deliver(quoteSubmission(result.data));
  } catch (err) {
    console.error("[aeris] devis non transmis", err);
    return jsonError(502, "Votre demande n'a pas pu être envoyée. Réessayez dans un instant.");
  }
  return NextResponse.json({ ok: true });
}
