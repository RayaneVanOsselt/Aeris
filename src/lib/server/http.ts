import { NextResponse } from "next/server";
import type { z } from "zod";
import type { SubmitCode } from "@/i18n/messages";
import { fieldErrors } from "@/lib/schemas";
import { rateLimit } from "./rate-limit";

const MAX_BODY = 32_000;

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

/** Réponse d'erreur : un code (traduit par le navigateur dans la langue du visiteur), jamais de texte. */
export function jsonError(status: number, code: SubmitCode, extra?: { fields?: Record<string, string>; params?: Record<string, string> }) {
  return NextResponse.json({ ok: false, code, ...extra }, { status });
}

/**
 * Garde commune aux routes POST : même origine, JSON, taille, débit, schéma.
 * Retourne les données validées ou une réponse d'erreur compréhensible.
 */
export async function guard<T extends z.ZodType>(
  req: Request,
  schema: T,
  opts: { key: string; limit: number; windowMs: number },
): Promise<{ data: z.infer<T> } | { response: NextResponse }> {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return { response: jsonError(403, "forbidden") };
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return { response: jsonError(415, "unsupported") };
  }
  const limited = rateLimit(`${opts.key}:${clientIp(req)}`, opts.limit, opts.windowMs);
  if (!limited.ok) {
    const res = jsonError(429, "rateLimited");
    res.headers.set("Retry-After", String(limited.retryAfter));
    return { response: res };
  }
  const text = await req.text();
  if (text.length > MAX_BODY) return { response: jsonError(413, "tooLarge") };
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { response: jsonError(400, "badRequest") };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error.issues);
    // Champ piège rempli : on répond comme un succès sans rien traiter (les robots n'apprennent rien)
    if (fields.website !== undefined) return { response: NextResponse.json({ ok: true }) };
    return { response: jsonError(422, "fieldsInvalid", { fields }) };
  }
  return { data: parsed.data };
}
