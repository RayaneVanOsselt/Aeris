"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";

/** Barre d'action mobile : apparaît quand le CTA principal sort de l'écran. */
export function StickyBuyBar({ label, price, href, watchId }: { label: string; price: string; href: string; watchId: string }) {
  const { m } = useI18n();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e!.isIntersecting && e!.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, [watchId]);

  useEffect(() => {
    document.documentElement.style.setProperty("--sticky-bar", visible ? "76px" : "0px");
    return () => document.documentElement.style.setProperty("--sticky-bar", "0px");
  }, [visible]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="container-site flex h-[76px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">{label}</p>
          <p className="t-num text-ink-2">{price}</p>
        </div>
        <ButtonLink href={href} tabIndex={visible ? 0 : -1} arrow>
          {m.nav.configure}
        </ButtonLink>
      </div>
    </div>
  );
}
