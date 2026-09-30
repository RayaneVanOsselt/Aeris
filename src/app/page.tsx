import Link from "next/link";
import { homeFaq } from "@/lib/faq";
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />

      <section id="solutions" className="section-y">
        <div className="container-site">
          <SectionHeading
            eyebrow="Nos solutions"
            title={
              <>
                Une moustiquaire pour <span className="accent text-sand-deep">chaque</span> ouverture.
              </>
            }
            intro="Commencez par ce que vous connaissez : votre ouverture. Nous vous montrons les modèles qui lui conviennent."
          />
          <div className="mt-12">
            <Solutions />
          </div>
        </div>
      </section>

      <WhyAeris />

      <section className="section-y border-y border-line bg-surface">
        <div className="container-site">
          <SectionHeading
            eyebrow="La toile, à la loupe"
            title={
              <>
                Vous voyez dehors. <span className="accent text-sand-deep">Pas la moustiquaire.</span>
              </>
            }
            intro="Cinq toiles pour cinq besoins : standard, robuste, anti-pollen, anti-griffe ou solaire. Survolez-les pour comparer leur trame."
          />
          <div className="mt-16">
            <MeshExplorer />
          </div>
        </div>
      </section>

      <section id="comment-ca-marche" className="section-y">
        <div className="container-site">
          <SectionHeading
            eyebrow="Comment ça marche"
            title={
              <>
                De la mesure à la pose, <span className="accent text-sand-deep">sans détour.</span>
              </>
            }
          />
          <div className="mt-14 lg:mt-20">
            <HowItWorks />
          </div>
        </div>
      </section>

      <Proof />

      <section className="section-y">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions fréquentes" title="Les réponses, avant même de demander." />
            <Reveal className="mt-8">
              <Link href="/faq" className="inline-flex items-center gap-2 text-ink underline-offset-4 hover:underline">
                Toutes les questions <Icon name="arrowRight" size={16} />
              </Link>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8">
            <Accordion items={homeFaq.map((i) => ({ q: i.q, a: i.a }))} />
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
