"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { getColor, getMesh, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";
import { MeshCloseUp } from "./MeshCloseUp";

const frame = getColor("anthracite")!.hex;
const fibre = getMesh("fibre")!;
const pet = getMesh("pet")!;

/**
 * Une illustration par heure (le film n'apparaît qu'en ouverture) : la fenêtre,
 * la toile standard de près, la porte plissée, la toile anti-griffe de près.
 */
function Scene({ index }: { index: number }) {
  if (index === 1 || index === 3) {
    const mesh = index === 1 ? fibre : pet;
    return <MeshCloseUp cell={Math.round(90 / mesh.density)} strand={mesh.strand} />;
  }
  const product = getProduct(index === 0 ? "fenetre" : "plissee")!;
  return (
    <span className="relative block size-full bg-sand-soft">
      <span aria-hidden className="blueprint-grid absolute inset-0 opacity-60" />
      <ProductVisual
        kind={product.visual}
        color={frame}
        width={product.defaultSize.width}
        height={product.defaultSize.height}
        className="absolute inset-0 m-auto size-full p-[14%] pt-[22%]"
      />
    </span>
  );
}

/**
 * Récit au défilement : une journée d'été, fenêtres ouvertes. Sur grand écran,
 * la fenêtre en arche reste fixe et change d'illustration au fil des heures ;
 * sur mobile, chaque heure a sa propre illustration, dans le fil de lecture.
 */
export function DayStory({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { m } = useI18n();
  const s = m.home.story;
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

  return (
    <section aria-labelledby="story-title" className="mx-2 rounded-[var(--radius-2xl)] bg-night text-on-night sm:mx-3 lg:rounded-[56px]">
      <div className="container-site py-[var(--section-y)]">
        <Reveal className="max-w-4xl">
          <p className="t-caption flex items-center gap-3 text-on-night-2">
            <span aria-hidden className="h-px w-8 bg-sand" />
            {eyebrow}
          </p>
          <h2 id="story-title" className="t-h1 mt-6">
            <Rich text={title} words="rise" accentClassName="accent text-sand" />
          </h2>
        </Reveal>

        <div className="mt-16 lg:mt-8 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2.5rem)] pb-10">
              <div role="img" aria-label={s.media[active]} className="relative aspect-[4/5] h-[min(72svh,46rem)] max-w-full overflow-hidden rounded-arch bg-night-2">
                {s.steps.map((step, i) => (
                  <div
                    key={step.time}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform] duration-[var(--dur-slower)] ease-[var(--ease-out)]",
                      i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                    )}
                  >
                    <Scene index={i} />
                  </div>
                ))}
              </div>
              <ol aria-hidden className="mt-6 flex max-w-[calc(min(72svh,46rem)*0.8)] gap-3">
                {s.steps.map((step, i) => (
                  <li key={step.time} className="flex-1">
                    <span className="block h-px overflow-hidden bg-line-night">
                      <span
                        className={cn(
                          "block h-full origin-left bg-sand transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out)]",
                          i <= active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </span>
                    <span className={cn("t-num mt-3 block text-sm transition-colors duration-[var(--dur-slow)]", i === active ? "text-on-night" : "text-on-night-2")}>
                      {step.time}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ol className="lg:col-span-5 lg:col-start-8">
            {s.steps.map((step, i) => (
              <li
                key={step.time}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className="border-t border-line-night py-12 first:border-t-0 first:pt-0 lg:flex lg:min-h-[80svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
              >
                <div role="img" aria-label={s.media[i]} className="relative mb-10 aspect-[4/5] max-h-[70svh] w-full overflow-hidden rounded-arch bg-night-2 lg:hidden">
                  <Scene index={i} />
                </div>
                <Reveal>
                  <p
                    className={cn(
                      "t-num font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-light leading-none tracking-[-0.04em] transition-colors duration-[var(--dur-slower)]",
                      i === active ? "lg:text-sand" : "lg:text-on-night-2/50",
                      "text-sand",
                    )}
                  >
                    {step.time}
                  </p>
                  <h3 className="t-h3 mt-6">{step.title}</h3>
                  <p className="t-lead mt-4 max-w-md text-on-night-2">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
