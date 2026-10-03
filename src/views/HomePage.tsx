import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { homeFaq } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { Collection } from "@/components/home/Collection";
import { Craft } from "@/components/home/Craft";
import { DayStory } from "@/components/home/DayStory";
import { FinalCta } from "@/components/home/FinalCta";
import { HeroFilm } from "@/components/home/HeroFilm";
import { HomeStickyCta } from "@/components/home/HomeStickyCta";
import { Manifesto } from "@/components/home/Manifesto";
import { Process } from "@/components/home/Process";
import { Proof } from "@/components/home/Proof";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";

export const homeMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "home" }, description: messages[locale].meta.description });

/**
 * Accueil, construit comme un récit : le film (hero) → l'idée (manifeste) →
 * le sur-mesure (savoir-faire) → une journée fenêtres ouvertes (récit) →
 * la collection → la preuve → la méthode → les questions → l'appel final.
 */
export function HomePage() {
  const { m, href, locale } = getI18n();
  const h = m.homePage;
  return (
    <>
      <HeroFilm />
      <Manifesto />
      <Craft />
      <DayStory eyebrow={h.story.eyebrow} title={h.story.title} />
      <Collection copy={h.collection} />
      <Proof />
      <Process />

      <section aria-labelledby="faq-title" className="py-[var(--section-y)]">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <p className="t-caption flex items-center gap-3 text-ink-3">
              <span aria-hidden className="h-px w-8 bg-sand" />
              {h.faq.eyebrow}
            </p>
            <h2 id="faq-title" className="t-h2 mt-6 max-w-[14ch] text-ink">
              {h.faq.title}
            </h2>
            <Link href={href("faq")} className="link-underline mt-10 inline-flex items-center gap-2 pb-0.5 text-ink">
              {m.common.allQuestions} <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <Accordion items={homeFaq(locale)} />
          </Reveal>
        </div>
      </section>

      <FinalCta />
      <HomeStickyCta />
    </>
  );
}
