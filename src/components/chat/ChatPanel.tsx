"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useI18n } from "@/i18n/provider";
import { track } from "@/lib/analytics";
import type { ChatAction, ChatMessage, ChatReply } from "@/lib/chat/types";
import { cn } from "@/lib/cn";
import { isStaticSite } from "@/lib/deploy";
import { useSubmit } from "@/lib/use-submit";
import { Button, IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Entry = ChatMessage & { id: string; actions?: ChatAction[]; error?: boolean };

/** Conversation conservée par langue : changer de langue repart d'un accueil dans la bonne langue. */
const storageKey = (locale: string) => `aeris_chat_v1_${locale}`;

/** Rendu sûr : gras (**texte**) et retours à la ligne, aucun HTML injecté. */
function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  text.split(/(\*\*[^*]+\*\*)/g).forEach((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) parts.push(<strong key={i} className="font-medium text-ink">{chunk.slice(2, -2)}</strong>);
    else
      chunk.split("\n").forEach((line, j, arr) => {
        parts.push(<span key={`${i}-${j}`}>{line}</span>);
        if (j < arr.length - 1) parts.push(<br key={`${i}-${j}-br`} />);
      });
  });
  return <>{parts}</>;
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { m, href, locale } = useI18n();
  const c = m.chat;
  const STORAGE = storageKey(locale);
  const welcome: Entry = { id: "welcome", role: "assistant", content: c.welcome };
  const [entries, setEntries] = useState<Entry[]>([welcome]);
  const [suggestions, setSuggestions] = useState<string[]>(c.starters);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  // Conversation conservée pendant la navigation (session uniquement)
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE) ?? "null") as Entry[] | null;
      if (Array.isArray(saved) && saved.length) setEntries(saved);
    } catch {
      /* stockage indisponible */
    }
  }, [STORAGE]);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify(entries.slice(-30)));
    } catch {
      /* stockage indisponible */
    }
  }, [entries, STORAGE]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, pending, quoteOpen]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 1200);
    if (!content || pending) return;
    const userEntry: Entry = { id: crypto.randomUUID(), role: "user", content };
    const history = [...entries.filter((e) => !e.error && e.id !== "welcome"), userEntry];
    setEntries((e) => [...e, userEntry]);
    setInput("");
    setSuggestions([]);
    setPending(true);
    track("chatbot_question", { page: pathname });
    try {
      const messages = history.map(({ role, content }) => ({ role, content }));
      let data: ChatReply & { ok?: boolean; code?: string };
      if (isStaticSite) {
        // Version statique : le moteur local répond dans le navigateur (mêmes données, aucune IA externe)
        const [{ answer }, { faqs }] = await Promise.all([import("@/lib/chat/engine"), import("@/i18n/faq")]);
        await new Promise((r) => setTimeout(r, 350));
        data = { ok: true, ...answer(messages, { locale, m, faq: faqs[locale] }) };
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, page: pathname, locale }),
        });
        data = (await res.json()) as ChatReply & { ok?: boolean; code?: string };
        if (!res.ok) throw new Error(data.code ?? "failed");
      }
      if (!data.ok) throw new Error(data.code ?? "failed");
      setEntries((e) => [...e, { id: crypto.randomUUID(), role: "assistant", content: data.reply, actions: data.actions }]);
      setSuggestions(data.suggestions ?? []);
    } catch (err) {
      setEntries((e) => [
        ...e,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          error: true,
          content: err instanceof Error && err.message === "rateLimited" ? m.submit.rateLimited : c.unavailable,
          actions: [{ type: "link", label: c.contactTeam, href: href("contact") }],
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const lastUser = [...entries].reverse().find((e) => e.role === "user")?.content ?? "";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={c.title}
      hidden={!open}
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden bg-paper shadow-[var(--shadow-lg)]",
        "inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100dvh-7rem))] sm:w-[400px] sm:rounded-[var(--radius-xl)] sm:border sm:border-line",
        "animate-[fade-up_var(--dur-slow)_var(--ease-out)]",
      )}
    >
      <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
        <span className="relative flex size-10 items-center justify-center rounded-full bg-ink text-paper">
          <Icon name="sparkle" size={18} />
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface bg-success" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.9375rem] text-ink">{c.title}</p>
          <p className="text-xs text-ink-3">{c.subtitle}</p>
        </div>
        <IconButton icon="close" label={c.closeLabel} onClick={onClose} />
      </header>

      <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {entries.map((e) => (
          <div key={e.id} className={cn("flex flex-col", e.role === "user" ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[88%] rounded-[18px] px-4 py-3 text-[0.9375rem] leading-relaxed",
                e.role === "user" ? "rounded-br-md bg-ink text-paper" : "rounded-bl-md border border-line bg-surface text-ink-2",
                e.error && "border-danger/30 bg-danger-soft text-danger",
              )}
            >
              <RichText text={e.content} />
            </div>
            {e.actions && e.actions.length > 0 && (
              <div className="mt-2 flex max-w-[92%] flex-wrap gap-2">
                {e.actions.map((a) =>
                  a.type === "link" ? (
                    <Link
                      key={a.href + a.label}
                      href={a.href}
                      onClick={() => window.innerWidth < 640 && onClose()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 py-2 text-sm text-ink transition-colors hover:border-ink"
                    >
                      {a.label} <Icon name="arrowRight" size={14} />
                    </Link>
                  ) : (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => setQuoteOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm text-paper"
                    >
                      <Icon name="mail" size={14} /> {a.label}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {pending && (
          <div className="flex w-fit items-center gap-1 rounded-[18px] rounded-bl-md border border-line bg-surface px-4 py-4" aria-label={c.typing}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-ink-3 animate-[dot_1.2s_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        {quoteOpen && <ChatQuoteForm context={lastUser} onDone={() => setQuoteOpen(false)} />}
      </div>

      {suggestions.length > 0 && !pending && (
        <div className="scroll-row flex gap-2 overflow-x-auto px-4 pb-3">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => void send(s)} className="shrink-0 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-line bg-surface px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="flex items-end gap-2 rounded-[var(--radius-lg)] border border-line bg-paper px-3 py-2 focus-within:border-sky">
          <label htmlFor="chat-input" className="sr-only">
            {c.inputLabel}
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={1200}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={c.placeholder}
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[0.9375rem] text-ink outline-none placeholder:text-ink-3"
          />
          <button
            type="submit"
            disabled={!input.trim() || pending}
            aria-label={m.common.send}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-30"
          >
            <Icon name="send" size={16} />
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] leading-snug text-ink-3">
          {c.disclaimer}
        </p>
      </form>
    </div>
  );
}

function ChatQuoteForm({ context, onDone }: { context: string; onDone: () => void }) {
  const { m, t, locale } = useI18n();
  const c = m.chat;
  const { submit, status, message, fields } = useSubmit("quote");
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await submit({
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      message: String(f.get("message") ?? ""),
      source: "chatbot",
      consent: f.get("consent") === "on",
      locale,
    });
    if (res.ok) track("quote_requested", { source: "chatbot" });
  };
  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-success/30 bg-success-soft p-4 text-sm text-success" role="status">
        {c.quoteSent}
        <button type="button" onClick={onDone} className="ml-2 underline">
          {m.common.close}
        </button>
      </div>
    );
  }
  const input = "h-11 w-full rounded-[var(--radius-md)] border border-line bg-paper px-3 text-sm text-ink outline-none focus:border-sky";
  return (
    <form onSubmit={onSubmit} className="space-y-2.5 rounded-[var(--radius-lg)] border border-line bg-surface p-4" noValidate>
      <p className="text-sm text-ink">{c.callbackTitle}</p>
      <input name="name" required placeholder={c.name} aria-label={c.name} autoComplete="name" className={input} />
      {fields.name && <p className="text-xs text-danger">{fields.name}</p>}
      <input name="email" type="email" required placeholder={c.email} aria-label={c.email} autoComplete="email" className={input} />
      {fields.email && <p className="text-xs text-danger">{fields.email}</p>}
      <input name="phone" type="tel" placeholder={c.phoneOptional} aria-label={c.phone} autoComplete="tel" className={input} />
      <textarea
        name="message"
        required
        defaultValue={context ? t(c.myQuestion, { question: context }) : ""}
        aria-label={c.project}
        className="min-h-20 w-full rounded-[var(--radius-md)] border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-sky"
      />
      {fields.message && <p className="text-xs text-danger">{fields.message}</p>}
      <label className="flex items-start gap-2 text-xs text-ink-2">
        <input type="checkbox" name="consent" className="mt-0.5 accent-[var(--color-ink)]" />
        {c.consent}
      </label>
      {fields.consent && <p className="text-xs text-danger">{fields.consent}</p>}
      {status === "error" && !Object.keys(fields).length && <p className="text-xs text-danger">{message}</p>}
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={status === "loading"}>
          {status === "loading" ? m.common.sending : m.common.send}
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone}>
          {m.common.cancel}
        </Button>
      </div>
    </form>
  );
}
