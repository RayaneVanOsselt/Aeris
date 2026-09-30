import { NextResponse } from "next/server";
import { answer } from "@/lib/chat/engine";
import { askLlm, llmProvider } from "@/lib/chat/llm";
import type { ChatReply } from "@/lib/chat/types";
import { guard } from "@/lib/server/http";
import { chatSchema } from "@/lib/server/schemas";

export async function POST(req: Request) {
  const result = await guard(req, chatSchema, { key: "chat", limit: 20, windowMs: 60_000 });
  if ("response" in result) return result.response;
  const { messages } = result.data;

  // Le moteur local fournit toujours les actions (liens sûrs) et un calcul de prix fiable
  const local = answer(messages);
  const provider = llmProvider();
  if (!provider) return NextResponse.json({ ok: true, ...local } satisfies ChatReply & { ok: true });

  try {
    const computed = local.reply.includes("TTC") && local.actions.some((a) => a.type === "link" && a.href.includes("largeur=")) ? local.reply : undefined;
    const text = await askLlm(provider, messages, computed);
    return NextResponse.json({ ok: true, reply: text, actions: local.actions, suggestions: local.suggestions, mode: "llm" } satisfies ChatReply & { ok: true });
  } catch (err) {
    // IA indisponible : on répond quand même, avec le moteur local
    console.error("[aeris] assistant IA indisponible, repli local", err);
    return NextResponse.json({ ok: true, ...local });
  }
}
