"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Mobile : une fois le film passé, l'action principale reste à portée de
 * pouce (à gauche du bouton de l'assistant). Elle s'efface à l'approche de
 * l'appel final, qui propose déjà la même action.
 */
export function HomeStickyCta() {
  const { m, href } = useI18n();
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-header-overlay]");
    const end = document.getElementById("final-cta");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === end) setNearEnd(e.isIntersecting);
      }
    });
    if (hero) io.observe(hero);
    if (end) io.observe(end);
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !nearEnd;
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-[calc(1rem+3.5rem+0.75rem)] z-40 transition-[transform,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)] sm:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <ButtonLink href={href("configurator")} size="lg" arrow block tabIndex={visible ? 0 : -1} className="shadow-[var(--shadow-lg)] ring-1 ring-white/15">
        {m.nav.configure}
      </ButtonLink>
    </div>
  );
}
