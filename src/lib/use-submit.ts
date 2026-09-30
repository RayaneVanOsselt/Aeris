"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";
type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string; fields?: Record<string, string> };

/**
 * Envoi JSON vers nos API avec des messages d'erreur compréhensibles
 * (réseau, validation, surcharge) — jamais d'erreur technique brute.
 */
export function useSubmit<T = unknown>(url: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [fields, setFields] = useState<Record<string, string>>({});

  async function submit(body: unknown): Promise<ApiResult<T>> {
    setStatus("loading");
    setMessage("");
    setFields({});
    let res: Response;
    try {
      res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } catch {
      const msg = "Connexion impossible. Vérifiez votre connexion internet puis réessayez.";
      setStatus("error");
      setMessage(msg);
      return { ok: false, message: msg };
    }
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fields?: Record<string, string> } & T;
    if (!res.ok || !json.ok) {
      const msg = json.message ?? "Une erreur est survenue. Réessayez dans un instant.";
      setStatus("error");
      setMessage(msg);
      setFields(json.fields ?? {});
      return { ok: false, message: msg, fields: json.fields };
    }
    setStatus("success");
    return { ok: true, data: json };
  }

  return { submit, status, message, fields, setFields, reset: () => setStatus("idle") };
}
