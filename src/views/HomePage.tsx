import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { homeFaq } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MeshExplorer } from "@/components/home/MeshExplorer";
import { Problem } from "@/components/home/Problem";
import { Proof } from "@/components/home/Proof";
import { Solutions } from "@/components/home/Solutions";
import { TrustBar } from "@/components/home/TrustBar";
import { WhyAeris } from "@/components/home/WhyAeris";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const homeMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "home" }, description: messages[locale].meta.description });

export function HomePage() {
  const { m, href, locale } = getI18n();
  const h = m.homePage;
  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />

      <section id="solutions" className="section-y">
        <div className="container-site">
          <SectionHeading eyebrow={h.solutions.eyebrow} title={<Rich text={h.solutions.title} />} intro={h.solutions.intro} />
          <div className="mt-12">
            <Solutions />
          </div>
        </div>
      </section>

      <WhyAeris />

      <section className="section-y border-y border-line bg-surface">
        <div className="container-site">
          <SectionHeading eyebrow={h.mesh.eyebrow} title={<Rich text={h.mesh.title} />} intro={h.mesh.intro} />
          <div className="mt-16">
            <MeshExplorer />
          </div>
        </div>
      </section>

      <section id="comment-ca-marche" className="section-y">
        <div className="container-site">
          <SectionHeading eyebrow={h.how.eyebrow} title={<Rich text={h.how.title} />} />
          <div className="mt-14 lg:mt-20">
            <HowItWorks />
          </div>
        </div>
      </section>

      <Proof />

      <section className="section-y">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={h.faq.eyebrow} title={h.faq.title} />
            <Reveal className="mt-8">
              <Link href={href("faq")} className="inline-flex items-center gap-2 text-ink underline-offset-4 hover:underline">
                {m.common.allQuestions} <Icon name="arrowRight" size={16} />
              </Link>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8">
            <Accordion items={homeFaq(locale)} />
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
