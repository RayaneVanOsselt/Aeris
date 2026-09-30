import { NextResponse } from "next/server";
import type { z } from "zod";
import { rateLimit } from "./rate-limit";

const MAX_BODY = 32_000;

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export function jsonError(status: number, message: string, fields?: Record<string, string>) {
  return NextResponse.json({ ok: false, message, fields }, { status });
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
    return { response: jsonError(403, "Requête refusée.") };
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return { response: jsonError(415, "Format de requête non pris en charge.") };
  }
  const limited = rateLimit(`${opts.key}:${clientIp(req)}`, opts.limit, opts.windowMs);
  if (!limited.ok) {
    const res = jsonError(429, "Trop de demandes en peu de temps. Merci de patienter une minute avant de réessayer.");
    res.headers.set("Retry-After", String(limited.retryAfter));
    return { response: res };
  }
  const text = await req.text();
  if (text.length > MAX_BODY) return { response: jsonError(413, "Message trop volumineux.") };
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { response: jsonError(400, "Requête invalide.") };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fields[path]) fields[path] = issue.message;
    }
    // Champ piège rempli : on répond comme un succès sans rien traiter (les robots n'apprennent rien)
    if (fields.website !== undefined) return { response: NextResponse.json({ ok: true }) };
    return { response: jsonError(422, "Certains champs sont à corriger.", fields) };
  }
  return { data: parsed.data };
}
