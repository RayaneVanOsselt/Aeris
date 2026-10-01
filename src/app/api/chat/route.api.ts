import { NextResponse } from "next/server";
import { faqs } from "@/i18n/faq";
import { messages as dictionaries } from "@/i18n/messages";
import { answer } from "@/lib/chat/engine";
import { askLlm, llmProvider } from "@/lib/chat/llm";
import type { ChatReply } from "@/lib/chat/types";
import { guard } from "@/lib/server/http";
import { chatSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const result = await guard(req, chatSchema, { key: "chat", limit: 20, windowMs: 60_000 });
  if ("response" in result) return result.response;
  const { messages } = result.data;
  const locale = result.data.locale ?? "fr";

  // Le moteur local fournit toujours les actions (liens sûrs) et un calcul de prix fiable
  const local = answer(messages, { locale, m: dictionaries[locale], faq: faqs[locale] });
  const provider = llmProvider();
  if (!provider) return NextResponse.json({ ok: true, ...local } satisfies ChatReply & { ok: true });

  try {
    const computed = local.actions.some((a) => a.type === "link" && a.href.includes("largeur=")) ? local.reply : undefined;
    const text = await askLlm(provider, locale, messages, computed);
    return NextResponse.json({ ok: true, reply: text, actions: local.actions, suggestions: local.suggestions, mode: "llm" } satisfies ChatReply & { ok: true });
  } catch (err) {
    // IA indisponible : on répond quand même, avec le moteur local
    console.error("[aeris] assistant IA indisponible, repli local", err);
    return NextResponse.json({ ok: true, ...local });
  }
}
