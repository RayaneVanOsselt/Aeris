"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { meshes } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { MeshCloseUp } from "./MeshCloseUp";

type Copy = { eyebrow: string; title: string; intro: string; standard: string; surcharge: string; loupe: string; choose: string };

/**
 * Aide au choix de la toile : sur grand écran, une loupe en arche reste fixe
 * et montre la trame de la toile lue ; sur mobile, chaque toile a sa pastille.
 * Noms, descriptions et suppléments viennent du catalogue.
 */
export function Meshes({ copy }: { copy: Copy }) {
  const { m, href, t } = useI18n();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of refs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const price = (multiplier: number) =>
    multiplier === 1 ? copy.standard : t(copy.surcharge, { percent: Math.round((multiplier - 1) * 100) });
  const current = meshes[active]!;

  return (
    <section aria-labelledby="meshes-title" className="mx-2 rounded-[var(--radius-2xl)] bg-night text-on-night sm:mx-3 lg:rounded-[56px]">
      <div className="container-site py-[var(--section-y)]">
        <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-caption flex items-center gap-3 text-on-night-2">
              <span aria-hidden className="h-px w-8 bg-sand" />
              {copy.eyebrow}
            </p>
            <h2 id="meshes-title" className="t-h1 mt-6">
              <Rich text={copy.title} words="rise" accentClassName="accent text-sand" />
            </h2>
          </div>
          <p className="t-lead text-on-night-2 lg:col-span-4 lg:col-start-9">{copy.intro}</p>
        </Reveal>

        <div className="mt-14 lg:mt-8 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2.5rem)] pb-10">
              <div
                role="img"
                aria-label={t(copy.loupe, { mesh: m.catalog.meshes[current.id].name })}
                className="relative aspect-[4/5] h-[min(64svh,40rem)] max-w-full overflow-hidden rounded-arch"
              >
                {meshes.map((mesh, i) => (
                  <MeshCloseUp
                    key={mesh.id}
                    mesh={mesh.id}
                    scale={2.4}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform] duration-[var(--dur-slower)] ease-[var(--ease-out)]",
                      i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {meshes.map((mesh, i) => {
              const text = m.catalog.meshes[mesh.id];
              return (
                <li
                  key={mesh.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-index={i}
                  className="border-t border-line-night py-10 first:border-t-0 lg:flex lg:min-h-[52svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
                >
                  <Reveal className="flex gap-5 lg:block">
                    <span aria-hidden className="size-16 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 lg:hidden">
                      <MeshCloseUp mesh={mesh.id} scale={1.2} />
                    </span>
                    <div>
                      <span
                        className={cn(
                          "t-num block text-sm transition-colors duration-[var(--dur-slow)]",
                          i === active ? "lg:text-sand" : "lg:text-on-night-2",
                          "text-sand",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")} — {price(mesh.multiplier)}
                      </span>
                      <h3 className="t-h2 mt-3">{text.name}</h3>
                      <p className="t-lead mt-4 max-w-md text-on-night-2">{text.description}</p>
                      <Link
                        href={`${href("configurator")}?toile=${mesh.id}`}
                        className="link-underline mt-6 inline-flex items-center gap-2 pb-0.5 text-on-night"
                      >
                        {copy.choose} <Icon name="arrowRight" size={16} />
                      </Link>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
