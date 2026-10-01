"use client";

import { useState } from "react";
import type { ErrorCode, SubmitCode } from "@/i18n/messages";
import { useI18n } from "@/i18n/provider";
import type { ProductId } from "./catalog";
import { sendForm, type ApiJson, type Endpoint } from "./transport";

type Status = "idle" | "loading" | "success" | "error";
type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string; fields?: Record<string, string> };

/**
 * Envoi d'un formulaire avec des messages d'erreur compréhensibles
 * (réseau, validation, surcharge), dans la langue de la page —
 * jamais d'erreur technique brute.
 */
export function useSubmit<T = unknown>(endpoint: Endpoint) {
  const { m, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [fields, setFields] = useState<Record<string, string>>({});

  const describe = (json: ApiJson) => {
    const code: SubmitCode = json.code && json.code in m.submit ? json.code : "generic";
    if (code === "dimensionsInvalid") {
      const product = m.catalog.products[json.params?.product as ProductId]?.name ?? "";
      return t(m.submit.dimensionsInvalid, { product });
    }
    return m.submit[code];
  };
  const translateFields = (raw: Record<string, string> = {}) =>
    Object.fromEntries(Object.entries(raw).map(([field, code]) => [field, m.errors[code as ErrorCode] ?? m.errors.invalid]));

  async function submit(body: unknown): Promise<ApiResult<T>> {
    setStatus("loading");
    setMessage("");
    setFields({});
    let result: Awaited<ReturnType<typeof sendForm>>;
    try {
      result = await sendForm(endpoint, body);
    } catch {
      setStatus("error");
      setMessage(m.submit.network);
      return { ok: false, message: m.submit.network };
    }
    const { status: code, json } = result;
    if (code < 200 || code >= 300 || !json.ok) {
      const msg = describe(json);
      const translated = translateFields(json.fields);
      setStatus("error");
      setMessage(msg);
      setFields(translated);
      return { ok: false, message: msg, fields: translated };
    }
    setStatus("success");
    return { ok: true, data: json as unknown as T };
  }

  return { submit, status, message, fields, setFields, reset: () => setStatus("idle") };
}
