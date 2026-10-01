"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { productPathPrefix } from "@/i18n/routes";
import { categories, productsForOpenings } from "@/lib/catalog";
import { useCartCount } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { startingPrice } from "@/lib/pricing";
import { primaryNav } from "@/lib/site";
import { ProductVisual } from "@/components/product/ProductVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { m, href, f, t, locale } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  // Contenu du méga-menu monté seulement après la première ouverture (DOM initial plus léger)
  const [megaMounted, setMegaMounted] = useState(false);
  if (megaOpen && !megaMounted) setMegaMounted(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartCount();
  const [bump, setBump] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const megaRef = useRef<HTMLDivElement>(null);

  // Masqué en descendant, réapparaît en remontant : plus d'espace pour le contenu
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        setHidden(y > 320 && y > last + 4);
        if (y < last - 4) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pastille du panier : petit rebond quand un article est ajouté (retour visuel)
  useEffect(() => {
    const onAdd = () => {
      setBump(true);
      window.setTimeout(() => setBump(false), 600);
    };
    window.addEventListener("aeris:cart-added", onAdd);
    return () => window.removeEventListener("aeris:cart-added", onAdd);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const screensActive = megaOpen || isActive(href("catalog")) || pathname.startsWith(productPathPrefix(locale));

  return (
    <>
      <a
        href="#contenu"
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-ink px-4 py-2 text-sm text-paper transition-transform focus:translate-y-0"
      >
        {m.common.skipToContent}
      </a>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
          "border-b",
          scrolled || megaOpen ? "border-line bg-paper/90 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-paper",
          hidden && !megaOpen && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div ref={megaRef} onMouseLeave={scheduleClose}>
          <div className="container-site flex h-[var(--header-h)] items-center gap-4 xl:gap-6">
            <Link href={href("home")} aria-label={m.nav.home} className="shrink-0 rounded-md">
              <Logo />
            </Link>

            <nav aria-label={m.nav.main} className="ml-2 hidden items-center gap-0.5 lg:flex xl:ml-6 xl:gap-1">
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={openMega}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.9375rem] transition-colors xl:px-4",
                  screensActive ? "bg-paper-2 text-ink" : "text-ink-2 hover:text-ink",
                )}
              >
                {m.nav.screens}
                <Icon
                  name="chevronDown"
                  size={16}
                  className={cn("transition-transform duration-[var(--dur-base)]", megaOpen && "rotate-180")}
                />
              </button>
              {primaryNav.map((key) => (
                <Link
                  key={key}
                  href={href(key)}
                  onMouseEnter={scheduleClose}
                  aria-current={isActive(href(key)) ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center whitespace-nowrap rounded-full px-3 text-[0.9375rem] transition-colors xl:px-4",
                    isActive(href(key)) ? "bg-paper-2 text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {m.nav.links[key]}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <LanguageSwitcher className="hidden lg:block" />
              <Link
                href={href("cart")}
                aria-label={f.plural(count, m.nav.cart)}
                className="relative inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2"
              >
                <Icon name="bag" size={21} />
                {count > 0 && (
                  <span
                    className={cn(
                      "t-num absolute right-1 top-1 flex min-w-[18px] items-center justify-center rounded-full bg-sky px-1 text-[10.5px] font-medium leading-[18px] text-white transition-transform duration-300",
                      bump && "scale-125",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
              <ButtonLink href={href("configurator")} size="sm" arrow className="max-[359px]:hidden">
                {m.nav.configure}
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={m.nav.openMenu}
                aria-haspopup="dialog"
                className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2 lg:hidden"
              >
                <Icon name="menu" size={22} />
              </button>
            </div>
          </div>

          {/* Méga-menu */}
          <div
            id="mega-menu"
            onMouseEnter={openMega}
            className={cn(
              "absolute inset-x-0 top-full hidden border-b border-line bg-paper/95 backdrop-blur-xl lg:block",
              "origin-top transition-[opacity,transform,visibility] duration-[var(--dur-base)] ease-[var(--ease-out)]",
              megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
            )}
          >
            {megaMounted && (
            <div className="container-site grid grid-cols-12 gap-10 py-10">
              {categories.map((cat) => (
                <div key={cat.id} className={cat.id === "fenetres" ? "col-span-3" : "col-span-5"}>
                  <Link href={href("category", cat.id)} className="t-caption mb-4 inline-flex items-center gap-2 text-ink-3 hover:text-ink">
                    {m.catalog.categories[cat.id].forLabel} <Icon name="arrowRight" size={14} />
                  </Link>
                  <ul className={cn("grid gap-1", cat.id !== "fenetres" && "grid-cols-2")}>
                    {productsForOpenings(cat.openings)
                      .filter((p) => p.id !== "sur-mesure-plus")
                      .map((p) => (
                        <li key={p.id}>
                          <Link
                            href={href("product", p.id)}
                            tabIndex={megaOpen ? 0 : -1}
                            className="group flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors hover:bg-surface"
                          >
                            <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-paper-2 transition-colors group-hover:bg-sand-soft">
                              <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} className="h-11 w-11" title={m.catalog.products[p.id].name} />
                            </span>
                            <span>
                              <span className="block text-[0.9375rem] text-ink">{m.catalog.products[p.id].name}</span>
                              <span className="t-small block text-ink-3">{t(m.common.fromPrice, { price: f.price(startingPrice(p)) })}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-4 flex flex-col gap-3">
                <Link
                  href={`${href("catalog")}#aide-au-choix`}
                  tabIndex={megaOpen ? 0 : -1}
                  className="group relative flex-1 overflow-hidden rounded-[var(--radius-lg)] bg-night p-6 text-on-night"
                >
                  <span className="mesh-texture-night absolute inset-0" aria-hidden />
                  <span className="relative">
                    <span className="t-caption text-on-night-2">{m.nav.mega.finderEyebrow}</span>
                    <span className="mt-3 block text-xl font-light leading-snug tracking-[-0.02em]">
                      <Rich text={m.nav.mega.finderTitle} accentClassName="accent text-sand" />
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-on-night">
                      {m.nav.mega.finderCta} <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href={href("product", "sur-mesure-plus")} tabIndex={megaOpen ? 0 : -1} className="rounded-[var(--radius-md)] border border-line p-4 text-sm transition-colors hover:border-ink">
                    <span className="block text-ink">{m.catalog.products["sur-mesure-plus"].name}</span>
                    <span className="t-small text-ink-3">{m.nav.mega.customHint}</span>
                  </Link>
                  <Link href={`${href("home")}#comment-ca-marche`} tabIndex={megaOpen ? 0 : -1} className="rounded-[var(--radius-md)] border border-line p-4 text-sm transition-colors hover:border-ink">
                    <span className="block text-ink">{m.nav.mega.howTitle}</span>
                    <span className="t-small text-ink-3">{m.nav.mega.howHint}</span>
                  </Link>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
