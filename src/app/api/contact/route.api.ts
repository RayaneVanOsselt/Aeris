import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { contactSubmission } from "@/lib/submissions";
import { guard, jsonError } from "@/lib/server/http";
import { deliver } from "@/lib/server/mailer";

export async function POST(req: Request) {
  const result = await guard(req, contactSchema, { key: "contact", limit: 5, windowMs: 60_000 });
  if ("response" in result) return result.response;
  try {
    await deliver(contactSubmission(result.data));
  } catch (err) {
    console.error("[aeris] contact non transmis", err);
    return jsonError(502, "contactFailed");
  }
  return NextResponse.json({ ok: true });
}
