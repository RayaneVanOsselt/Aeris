"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { getColor, products } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { startingPrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

type Copy = { eyebrow: string; title: string; intro: string; all: string; finder: string };

const frame = getColor("anthracite")!.hex;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * La collection comme un index éditorial, pas une grille de cartes : une ligne
 * par modèle, l'aperçu en arche suit le survol (grand écran). Sur mobile, un
 * ruban de fenêtres à faire défiler du pouce.
 */
export function Collection({ copy }: { copy: Copy }) {
  const { m, href, f, t } = useI18n();
  const [active, setActive] = useState(0);
  const current = products[active]!;
  const total = products.length;
  const name = (i: number) => m.catalog.products[products[i]!.id].name;

  return (
    <section id="collection" aria-labelledby="collection-title" className="scroll-mt-8 py-[var(--section-y)]">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="t-caption flex items-center gap-3 text-ink-3">
              <span aria-hidden className="h-px w-8 bg-sand" />
              {copy.eyebrow}
            </p>
            <h2 id="collection-title" className="t-h1 mt-6 text-ink">
              <Rich text={copy.title} words="rise" />
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="text-ink-2">{copy.intro}</p>
            <p className="mt-5">
              <Link href={`${href("catalog")}#aide-au-choix`} className="link-underline inline-flex items-center gap-2 pb-0.5 text-ink">
                {copy.finder} <Icon name="arrowRight" size={16} />
              </Link>
            </p>
          </Reveal>
        </div>

        {/* Grand écran : index + aperçu */}
        <div className="mt-20 hidden lg:grid lg:grid-cols-12 lg:gap-10">
          <ol className="col-span-7 border-b border-line">
            {products.map((p, i) => {
              const text = m.catalog.products[p.id];
              const on = i === active;
              return (
                <li key={p.id} className="border-t border-line">
                  <Link
                    href={href("product", p.id)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[3.25rem_1fr_auto_auto] items-center gap-6 py-7 outline-offset-4"
                  >
                    <span className={cn("t-num text-sm transition-colors duration-[var(--dur-base)]", on ? "text-sand-deep" : "text-ink-3")}>{pad(i + 1)}</span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "t-h3 block transition-[transform,color] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
                          on ? "translate-x-2 text-ink" : "text-ink-2",
                        )}
                      >
                        {text.name}
                      </span>
                      <span className="t-small mt-1.5 block truncate text-ink-3">{text.tagline}</span>
                    </span>
                    <span className="t-small whitespace-nowrap text-ink-3">{t(m.common.fromPrice, { price: f.price(startingPrice(p)) })}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full border transition-[background-color,color,border-color] duration-[var(--dur-base)]",
                        on ? "border-ink bg-ink text-paper" : "border-line text-ink",
                      )}
                    >
                      <Icon name="arrowUpRight" size={18} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="col-span-5">
            <div className="sticky top-[calc(var(--header-h)+2rem)] mx-auto max-w-[calc(min(68svh,44rem)*0.8)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-arch bg-sand-soft">
                <div aria-hidden className="blueprint-grid absolute inset-0 opacity-60" />
                {products.map((p, i) => (
                  <div
                    key={p.id}
                    aria-hidden={i !== active}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center p-[12%] pt-[18%] transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
                      i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    )}
                  >
                    <ProductVisual
                      kind={p.visual}
                      color={frame}
                      width={p.defaultSize.width}
                      height={p.defaultSize.height}
                      title={t(m.home.collection.preview, { name: name(i) })}
                      className="size-full"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-6 flex items-baseline justify-between gap-4" aria-live="polite">
                <span className="t-h4 text-ink">{name(active)}</span>
                <span className="t-num t-small text-ink-3">{t(m.home.collection.index, { n: pad(active + 1), total: pad(total) })}</span>
              </p>
              <p className="t-small mt-1 text-ink-3">{m.catalog.products[current.id].lead}</p>
            </div>
          </div>
        </div>

        {/* Mobile et tablette : ruban de fenêtres */}
        <ul className="scroll-row -mx-[var(--gutter)] mt-14 flex gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden">
          {products.map((p, i) => {
            const text = m.catalog.products[p.id];
            return (
              <li key={p.id} className="w-[72%] max-w-[20rem] shrink-0 snap-start sm:w-[44%]">
                <Link href={href("product", p.id)} className="group block">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-arch bg-sand-soft">
                    <span aria-hidden className="blueprint-grid absolute inset-0 opacity-60" />
                    <ProductVisual
                      kind={p.visual}
                      color={frame}
                      width={p.defaultSize.width}
                      height={p.defaultSize.height}
                      title={text.name}
                      className="absolute inset-0 m-auto size-[78%] translate-y-[6%]"
                    />
                  </span>
                  <span className="mt-5 flex items-baseline gap-3">
                    <span className="t-num t-small text-ink-3">{pad(i + 1)}</span>
                    <span className="t-h3 text-ink">{text.name}</span>
                  </span>
                  <span className="t-small mt-1.5 block text-ink-3">{text.tagline}</span>
                  <span className="t-small mt-3 block text-ink">{t(m.common.fromPrice, { price: f.price(startingPrice(p)) })}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-14 flex justify-start lg:mt-16">
          <Link
            href={href("catalog")}
            className="group inline-flex h-14 items-center gap-3 rounded-full border border-line-strong pl-7 pr-2 text-ink transition-colors duration-[var(--dur-base)] hover:border-ink"
          >
            {copy.all}
            <span className="flex size-10 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:translate-x-1">
              <Icon name="arrowRight" size={17} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
