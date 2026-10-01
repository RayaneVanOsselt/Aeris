import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isClaimVisible, showPlaceholders } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";

export const aboutMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "about" }, ...messages[locale].meta.about });

const valueIcons: IconName[] = ["ruler", "eye", "wind"];

export function AboutPage() {
  const { m, href } = getI18n();
  const p = m.pages.about;
  return (
    <>
      <PageHeader crumbs={[{ name: p.crumb, href: href("about") }]} eyebrow={p.eyebrow} title={<Rich text={p.title} />} intro={p.intro} />

      <section className="py-[var(--section-y)]">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-light leading-snug tracking-[-0.025em] text-ink">
              {p.statementLead} <span className="text-ink-3">{p.statementRest}</span>
            </p>
          </Reveal>
          <div className="lg:col-span-5">
            {showPlaceholders && (
              <Placeholder title="Notre histoire" icon="edit">
                Racontez ici l&apos;origine d&apos;Aéris en quelques lignes (qui, depuis quand, pourquoi), avec une photo réelle de l&apos;équipe ou de l&apos;atelier. L&apos;ancien site contenait un récit non
                vérifié, retiré en attendant votre version.
              </Placeholder>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.methodEyebrow} title={p.methodTitle} />
          <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-4">
            {p.method.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80} className="bg-surface p-7">
                <p className="t-num text-sm text-sky">0{i + 1}</p>
                <h3 className="t-h4 mt-4 text-ink">{step.title}</h3>
                <p className="mt-2 text-ink-2">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow={p.valuesEyebrow} title={p.valuesTitle} />
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {p.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="rounded-[var(--radius-xl)] border border-line bg-surface p-7">
                <Icon name={valueIcons[i] ?? "check"} size={24} className="text-ink" />
                <h3 className="t-h4 mt-5 text-ink">{v.title}</h3>
                <p className="mt-2 text-ink-2">{v.text}</p>
              </Reveal>
            ))}
          </div>
          <ul className="mt-10 flex flex-wrap gap-3">
            {(["europeanMade", "warranty", "checkedBeforeProduction"] as const).filter(isClaimVisible).map((c) => (
              <li key={c} className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink-2">
                <ClaimLabel id={c} />
              </li>
            ))}
          </ul>
          {showPlaceholders && (
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {["Photo de l'équipe", "Photo de l'atelier / du stock", "Certifications ou partenaires (si existants)"].map((t) => (
                <Placeholder key={t} title={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
