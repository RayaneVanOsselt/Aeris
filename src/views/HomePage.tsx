import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { homeFaq } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { Collection } from "@/components/home/Collection";
import { Craft } from "@/components/home/Craft";
import { FinalCta } from "@/components/home/FinalCta";
import { HeroFilm } from "@/components/home/HeroFilm";
import { HomeStickyCta } from "@/components/home/HomeStickyCta";
import { Meshes } from "@/components/home/Meshes";
import { Process } from "@/components/home/Process";
import { Proof } from "@/components/home/Proof";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";

export const homeMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "home" }, description: messages[locale].meta.description });

/**
 * Accueil, dans l'ordre des questions d'un client : le film (envie) → nos
 * engagements (confiance) → quel modèle pour mon ouverture → comment ça
 * marche → le prix au millimètre (essai) → quelle toile pour mon besoin →
 * la preuve « 1 mm » → les questions → l'appel final.
 */
export function HomePage() {
  const { m, href, locale } = getI18n();
  const h = m.homePage;
  return (
    <>
      <HeroFilm />
      <TrustStrip />
      <Collection copy={h.collection} />
      <Process />
      <Craft />
      <Meshes copy={h.meshes} />
      <Proof />

      <section aria-labelledby="faq-title" className="pb-[var(--section-y)]">
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
          <Reveal delay={100} className="lg:col-span-7">
            <Accordion items={homeFaq(locale)} />
          </Reveal>
        </div>
      </section>

      <FinalCta />
      <HomeStickyCta />
    </>
  );
}
