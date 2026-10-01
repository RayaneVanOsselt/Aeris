import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { MeasureGuideVisual } from "@/components/product/MeasureGuideVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { showPlaceholders } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";

export const guideMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "guide" }, ...messages[locale].meta.guide });

const mistakeIcons: IconName[] = ["ruler", "layers", "eye"];

export function GuidePage() {
  const { m, href } = getI18n();
  const p = m.pages.guide;
  return (
    <>
      <PageHeader crumbs={[{ name: p.crumb, href: href("guide") }]} eyebrow={p.eyebrow} title={<Rich text={p.title} />} intro={p.intro} />

      <section className="container-site grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <MeasureGuideVisual className="w-full" label={p.visualLabel} />
            <p className="t-small mt-4 text-center text-ink-3">{p.visualCaption}</p>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {p.steps.map((s, i) => (
            <Reveal as="li" key={s.title} className="relative border-l border-line pb-12 pl-10 last:pb-0">
              <span className="t-num absolute -left-4 top-0 flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">{i + 1}</span>
              <h2 className="t-h3 text-ink">{s.title}</h2>
              <p className="mt-3 max-w-xl text-ink-2">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.mistakesEyebrow} title={p.mistakesTitle} />
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {p.mistakes.map((mistake, i) => (
              <Reveal key={mistake.title} delay={i * 80} className="rounded-[var(--radius-xl)] border border-line bg-paper p-7">
                <Icon name={mistakeIcons[i] ?? "info"} size={24} className="text-sky" />
                <h3 className="t-h4 mt-5 text-ink">{mistake.title}</h3>
                <p className="mt-2 text-ink-2">{mistake.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 rounded-[var(--radius-xl)] border border-line bg-paper-2/60 p-7 text-ink-2">
            <p className="flex gap-3">
              <Icon name="info" size={20} className="mt-0.5 shrink-0 text-sky" />
              {p.mountingNote}
            </p>
          </Reveal>
          {showPlaceholders && (
            <Placeholder title="Règles de mesure détaillées par modèle" icon="ruler" className="mt-4">
              Ajoutez ici les consignes précises de l&apos;atelier (marges éventuelles, mesure en tableau ou en applique par modèle). Elles ne sont pas inventées tant qu&apos;elles ne sont pas fournies.
            </Placeholder>
          )}
        </div>
      </section>

      <section className="container-site py-[var(--section-y)] text-center">
        <h2 className="t-h2 text-ink">{p.ctaTitle}</h2>
        <p className="t-lead mx-auto mt-4 max-w-xl text-ink-2">{p.ctaText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={href("configurator")} size="lg" arrow>
            {p.openConfigurator}
          </ButtonLink>
          <ButtonLink href={href("contact")} size="lg" variant="secondary">
            {p.sendPhoto}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
