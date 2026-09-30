"use client";

import { useState } from "react";
import { sendForm, type Endpoint } from "./transport";

type Status = "idle" | "loading" | "success" | "error";
type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string; fields?: Record<string, string> };

/**
 * Envoi d'un formulaire avec des messages d'erreur compréhensibles
 * (réseau, validation, surcharge) — jamais d'erreur technique brute.
 */
export function useSubmit<T = unknown>(endpoint: Endpoint) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [fields, setFields] = useState<Record<string, string>>({});

  async function submit(body: unknown): Promise<ApiResult<T>> {
    setStatus("loading");
    setMessage("");
    setFields({});
    let result: Awaited<ReturnType<typeof sendForm>>;
    try {
      result = await sendForm(endpoint, body);
    } catch {
      const msg = "Connexion impossible. Vérifiez votre connexion internet puis réessayez.";
      setStatus("error");
      setMessage(msg);
      return { ok: false, message: msg };
    }
    const { status: code, json } = result;
    if (code < 200 || code >= 300 || !json.ok) {
      const msg = json.message ?? "Une erreur est survenue. Réessayez dans un instant.";
      setStatus("error");
      setMessage(msg);
      setFields(json.fields ?? {});
      return { ok: false, message: msg, fields: json.fields };
    }
    setStatus("success");
    return { ok: true, data: json as unknown as T };
  }

  return { submit, status, message, fields, setFields, reset: () => setStatus("idle") };
}
