/**
 * Limitation de débit en mémoire (fenêtre glissante par IP et par route).
 * Suffisant pour une instance ; en production multi-instances, remplacer
 * le stockage par Redis/Upstash (même interface).
 */
const hits = new Map<string, number[]>();
let lastSweep = Date.now();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  if (now - lastSweep > 60_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > windowMs)) hits.delete(k);
    lastSweep = now;
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0]!)) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfter: 0 };
}
