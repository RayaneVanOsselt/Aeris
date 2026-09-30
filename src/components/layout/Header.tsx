"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, products, productsForOpenings } from "@/lib/catalog";
import { useCartCount } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { primaryNav } from "@/lib/site";
import { ProductVisual } from "@/components/product/ProductVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
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

  useEffect(() => {
    setMegaOpen(false);
    setMenuOpen(false);
  }, [pathname]);

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#contenu"
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-ink px-4 py-2 text-sm text-paper transition-transform focus:translate-y-0"
      >
        Aller au contenu
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
          <div className="container-site flex h-[var(--header-h)] items-center gap-6">
            <Link href="/" aria-label="Aéris — accueil" className="shrink-0 rounded-md">
              <Logo />
            </Link>

            <nav aria-label="Navigation principale" className="ml-6 hidden items-center gap-1 lg:flex">
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={openMega}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.9375rem] transition-colors",
                  megaOpen || pathname.startsWith("/moustiquaires") || pathname.startsWith("/produits")
                    ? "bg-paper-2 text-ink"
                    : "text-ink-2 hover:text-ink",
                )}
              >
                Moustiquaires
                <Icon
                  name="chevronDown"
                  size={16}
                  className={cn("transition-transform duration-[var(--dur-base)]", megaOpen && "rotate-180")}
                />
              </button>
              {primaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={scheduleClose}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] transition-colors",
                    isActive(link.href) ? "bg-paper-2 text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/panier"
                aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
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
              <ButtonLink href="/configurateur" size="sm" arrow className="hidden sm:inline-flex">
                Configurer
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Ouvrir le menu"
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
            <div className="container-site grid grid-cols-12 gap-10 py-10">
              {categories.map((cat) => (
                <div key={cat.slug} className={cat.slug === "fenetres" ? "col-span-3" : "col-span-5"}>
                  <Link href={`/moustiquaires/${cat.slug}`} className="t-caption mb-4 inline-flex items-center gap-2 text-ink-3 hover:text-ink">
                    Pour {cat.name.toLowerCase()} <Icon name="arrowRight" size={14} />
                  </Link>
                  <ul className={cn("grid gap-1", cat.slug !== "fenetres" && "grid-cols-2")}>
                    {productsForOpenings(cat.openings)
                      .filter((p) => p.id !== "sur-mesure-plus")
                      .map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/produits/${p.slug}`}
                            tabIndex={megaOpen ? 0 : -1}
                            className="group flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors hover:bg-surface"
                          >
                            <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-paper-2 transition-colors group-hover:bg-sand-soft">
                              <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} className="h-11 w-11" title={p.name} />
                            </span>
                            <span>
                              <span className="block text-[0.9375rem] text-ink">{p.name}</span>
                              <span className="t-small block text-ink-3">dès {formatPrice(startingPrice(p))}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-4 flex flex-col gap-3">
                <Link
                  href="/moustiquaires#aide-au-choix"
                  tabIndex={megaOpen ? 0 : -1}
                  className="group relative flex-1 overflow-hidden rounded-[var(--radius-lg)] bg-night p-6 text-on-night"
                >
                  <span className="mesh-texture-night absolute inset-0" aria-hidden />
                  <span className="relative">
                    <span className="t-caption text-on-night-2">Aide au choix</span>
                    <span className="mt-3 block text-xl font-light leading-snug tracking-[-0.02em]">
                      Pas sûr du modèle&nbsp;? <span className="accent text-sand">Trois questions</span> suffisent.
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-on-night">
                      Trouver mon modèle <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/produits/sur-mesure-plus" tabIndex={megaOpen ? 0 : -1} className="rounded-[var(--radius-md)] border border-line p-4 text-sm transition-colors hover:border-ink">
                    <span className="block text-ink">{products.find((p) => p.id === "sur-mesure-plus")?.name}</span>
                    <span className="t-small text-ink-3">Projets hors normes</span>
                  </Link>
                  <Link href="/#comment-ca-marche" tabIndex={megaOpen ? 0 : -1} className="rounded-[var(--radius-md)] border border-line p-4 text-sm transition-colors hover:border-ink">
                    <span className="block text-ink">Comment ça marche</span>
                    <span className="t-small text-ink-3">De la mesure à la pose</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
