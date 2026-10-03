import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { Reveal } from "@/components/ui/Reveal";
import { frameColors, meshes, products } from "@/lib/catalog";
import { MeasureDemo } from "./MeasureDemo";

/** Le savoir-faire, prouvé plutôt qu'affirmé : on règle soi-même une moustiquaire au millimètre. */
export function Craft() {
  const { m } = getI18n();
  const c = m.homePage.craft;
  // Chiffres lus dans le catalogue : ils suivent toute évolution de l'offre
  const facts = [
    { value: products.length, label: c.facts.models },
    { value: meshes.length, label: c.facts.meshes },
    { value: frameColors.length, label: c.facts.colors },
  ];
  return (
    <section className="py-[var(--section-y)]">
      <div className="container-site grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <Reveal>
              <p className="t-caption flex items-center gap-3 text-ink-3">
                <span aria-hidden className="h-px w-8 bg-sand" />
                {c.eyebrow}
              </p>
              <h2 className="t-h1 mt-6 text-ink">
                <Rich text={c.title} words="rise" />
              </h2>
              <p className="t-lead mt-8 max-w-md text-ink-2">{c.text}</p>
            </Reveal>
            <dl className="mt-14 grid grid-cols-3 border-t border-line">
              {facts.map((fact, i) => (
                <Reveal
                  key={fact.label}
                  delay={i * 90}
                  className="flex flex-col-reverse justify-end gap-3 border-line py-6 pr-3 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-4 sm:pr-4 sm:[&:not(:first-child)]:pl-6"
                >
                  <dt className="t-small text-ink-3">{fact.label}</dt>
                  <dd className="font-serif text-[clamp(2.75rem,5vw,4.25rem)] font-light leading-none tracking-[-0.04em] text-ink">{fact.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>

        <Reveal delay={120} className="lg:col-span-7">
          <div className="rounded-[var(--radius-2xl)] border border-line bg-surface p-4 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 px-2 pt-2 sm:px-0 sm:pt-0">
              <span className="t-caption text-sky">{c.tryIt}</span>
              <span className="t-small text-ink-3">{c.demoHint}</span>
            </div>
            <MeasureDemo />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
