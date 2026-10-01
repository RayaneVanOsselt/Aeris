"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/provider";
import { products } from "@/lib/catalog";
import { primaryNav } from "@/lib/site";
import { ProductVisual } from "@/components/product/ProductVisual";
import { ButtonLink, IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

/**
 * Menu mobile plein écran. <dialog> natif : piège du focus, fermeture
 * par Échap et arrière-plan inerte fournis par le navigateur.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { m, href } = useI18n();
  const links = [
    { href: href("catalog"), label: m.nav.allModels },
    ...primaryNav.map((key) => ({ href: href(key), label: m.nav.links[key] })),
    { href: href("quote"), label: m.common.requestQuote },
  ];
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && dialog.open) dialog.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      aria-label={m.nav.menu}
      className="sheet h-dvh w-screen bg-paper! open:animate-[fade-up_var(--dur-slow)_var(--ease-out)]"
    >
      {open && (
      <div className="flex h-full flex-col">
        <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line">
          <Link href={href("home")} onClick={onClose} aria-label={m.nav.home}>
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <IconButton icon="close" label={m.nav.closeMenu} onClick={onClose} />
          </div>
        </div>

        <nav aria-label={m.nav.mobile} className="container-site flex-1 overflow-y-auto py-6">
          <p className="t-caption mb-3 text-ink-3">{m.nav.ourScreens}</p>
          <ul className="scroll-row -mx-[var(--gutter)] mb-8 flex gap-3 overflow-x-auto px-[var(--gutter)] pb-1">
            {products.map((p) => (
              <li key={p.id} className="shrink-0 snap-start">
                <Link
                  href={href("product", p.id)}
                  onClick={onClose}
                  className="flex w-32 flex-col gap-2 rounded-[var(--radius-md)] border border-line bg-surface p-3"
                >
                  <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} className="h-20 w-full" title={m.catalog.products[p.id].name} />
                  <span className="text-sm leading-tight text-ink">{m.catalog.products[p.id].name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="divide-y divide-line border-y border-line">
            {links.map((link, i) => (
              <li key={link.href} className="animate-fade-up" style={{ "--delay": `${80 + i * 40}ms` } as React.CSSProperties}>
                <Link href={link.href} onClick={onClose} className="flex items-center justify-between py-4 text-2xl font-light tracking-[-0.03em] text-ink">
                  {link.label}
                  <Icon name="arrowRight" size={20} className="text-ink-3" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-site shrink-0 border-t border-line bg-surface py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ButtonLink href={href("configurator")} onClick={onClose} size="lg" block arrow>
            {m.common.configureMine}
          </ButtonLink>
        </div>
      </div>
      )}
    </dialog>
  );
}
