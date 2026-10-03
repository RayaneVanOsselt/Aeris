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
import { LanguageMenu } from "./LanguageMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { m, href, f, t, locale } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Au-dessus d'un média plein écran (film de l'accueil) : en-tête transparent, texte clair
  const trim = (p: string) => p.replace(/\/+$/, "");
  const [overMedia, setOverMedia] = useState(() => trim(pathname) === trim(href("home")));
  const [megaOpen, setMegaOpen] = useState(false);
  // Contenu du méga-menu monté seulement après la première ouverture (DOM initial plus léger)
  const [megaMounted, setMegaMounted] = useState(false);
  if (megaOpen && !megaMounted) setMegaMounted(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartCount();
  const [bump, setBump] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const megaRef = useRef<HTMLDivElement>(null);

  // En-tête qui évolue : plein et transparent en haut de page, îlot compact
  // dès qu'on défile ; masqué en descendant, il revient en remontant.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 320 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
      const media = document.querySelector("[data-header-overlay]");
      setOverMedia(!!media && media.getBoundingClientRect().bottom > 72);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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
  const light = overMedia && !megaOpen;
  const island = scrolled;
  const tone = {
    link: light ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-ink",
    current: light ? "bg-white/12 text-white" : "bg-paper-2 text-ink",
    icon: light ? "text-white hover:bg-white/10" : "text-ink hover:bg-paper-2",
  };

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
          "sticky top-0 z-50 h-[var(--header-h)] transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)]",
          hidden && !megaOpen && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          ref={megaRef}
          onMouseLeave={scheduleClose}
          className={cn(
            "relative mx-auto max-w-[1440px] transition-[padding] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
            island && "px-2 pt-2 sm:px-4 sm:pt-3",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1.5 border transition-[height,padding,background-color,border-color,box-shadow,border-radius,color] duration-[var(--dur-slow)] ease-[var(--ease-out)] sm:gap-2 lg:gap-4 xl:gap-6",
              island ? "h-[60px] rounded-full pl-4 pr-1.5 sm:pl-6 sm:pr-2" : "h-[var(--header-h)] rounded-none px-[var(--gutter)]",
              light ? "text-white" : "text-ink",
              island
                ? light
                  ? "border-white/15 bg-night/35 backdrop-blur-xl"
                  : "border-line bg-paper/85 shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150"
                : megaOpen
                  ? "border-transparent border-b-line bg-paper"
                  : "border-transparent bg-transparent",
            )}
          >
            <Link href={href("home")} aria-label={m.nav.home} className="mr-auto shrink-0 rounded-md lg:mr-0">
              <Logo tone={light ? "light" : "ink"} />
            </Link>

            <nav aria-label={m.nav.main} className="ml-2 mr-auto hidden items-center gap-0.5 lg:flex xl:ml-6 xl:gap-1">
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={openMega}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.9375rem] transition-colors xl:px-4",
                  screensActive ? tone.current : tone.link,
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
                    isActive(href(key)) ? tone.current : tone.link,
                  )}
                >
                  {m.nav.links[key]}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcher tone={light ? "light" : "ink"} className="hidden lg:block" />
              <LanguageMenu tone={light ? "light" : "ink"} className="lg:hidden" />
              <Link
                href={href("cart")}
                aria-label={f.plural(count, m.nav.cart)}
                className={cn("relative inline-flex size-11 items-center justify-center rounded-full transition-colors", tone.icon)}
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
              <ButtonLink
                href={href("configurator")}
                size="sm"
                variant={light ? "light" : "primary"}
                arrow
                className="max-[379px]:hidden max-sm:px-4 max-sm:[&>svg]:hidden"
              >
                {m.nav.configure}
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={m.nav.openMenu}
                aria-haspopup="dialog"
                className={cn("inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden", tone.icon)}
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
              "absolute inset-x-4 top-[calc(100%+0.5rem)] hidden overflow-hidden rounded-[var(--radius-xl)] border border-line bg-paper/95 text-ink shadow-[var(--shadow-lg)] backdrop-blur-xl lg:block",
              "origin-top transition-[opacity,transform,visibility] duration-[var(--dur-base)] ease-[var(--ease-out)]",
              megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
            )}
          >
            {megaMounted && (
            <div className="grid grid-cols-12 gap-10 p-8 xl:p-10">
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
