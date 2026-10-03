"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

// Le panneau n'est chargé qu'à la première ouverture : zéro coût sur le chargement des pages
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

export function ChatLauncher() {
  const { m } = useI18n();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setLoaded(true);
      setOpen(true);
    };
    window.addEventListener("aeris:open-chat", onOpen);
    return () => window.removeEventListener("aeris:open-chat", onOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
          track("chatbot_opened");
        }}
        onMouseEnter={() => setLoaded(true)}
        aria-expanded={open}
        className={cn(
          "fixed right-4 z-40 flex h-14 items-center gap-2.5 rounded-full bg-ink pl-4 pr-4 text-paper shadow-[0_8px_30px_rgb(10_22_49/0.3)] transition-[transform,opacity,bottom] duration-[var(--dur-slow)] ease-[var(--ease-out)] hover:-translate-y-0.5 sm:pr-5 lg:right-6",
          "bottom-[calc(1rem+var(--sticky-bar,0px)+env(safe-area-inset-bottom))] lg:bottom-6",
          open ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100",
        )}
      >
        <span className="relative flex size-6 items-center justify-center">
          <Icon name="chat" size={22} />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-ink bg-sand" />
        </span>
        {/* Nom accessible = texte visible (+ précision), conforme au critère « étiquette dans le nom » */}
        <span className="hidden text-sm sm:inline">{m.chat.question}</span>
        <span className="sr-only">{m.chat.open}</span>
      </button>
      {loaded && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
