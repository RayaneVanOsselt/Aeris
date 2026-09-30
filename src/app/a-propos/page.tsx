import { showPlaceholders } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ClaimLabel, isClaimVisible } from "@/components/ui/Claim";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "À propos d'Aéris",
  description: "Aéris conçoit des moustiquaires sur mesure pour vivre fenêtres ouvertes, sans compromis sur l'esthétique. Notre philosophie, notre méthode et nos engagements.",
  path: "/a-propos",
});

const method = [
  { n: "01", title: "Vous mesurez", text: "Avec notre guide, en quelques minutes. En cas de doute, une photo suffit pour que nous vous aidions." },
  { n: "02", title: "Vous configurez", text: "Modèle, toile, coloris, options : chaque choix est expliqué, et le prix s'affiche immédiatement." },
  { n: "03", title: "Nous vérifions", text: "Chaque configuration est relue avant fabrication. Une incohérence ? Nous vous contactons." },
  { n: "04", title: "Nous fabriquons", text: "À vos dimensions exactes, puis nous vous livrons avec la notice de pose." },
];

const values: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: "ruler", title: "Le sur-mesure, vraiment", text: "Pas de taille standard qu'il faudrait recouper ou caler : votre ouverture, vos dimensions." },
  { icon: "eye", title: "La transparence", text: "Un prix affiché avant toute demande, des engagements vérifiables, aucun faux avis ni fausse promotion." },
  { icon: "wind", title: "La discrétion", text: "Une moustiquaire réussie est celle qu'on oublie : profilés fins, coloris assortis, toile haute visibilité." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "À propos", href: "/a-propos" }]}
        eyebrow="À propos"
        title={
          <>
            L&apos;air frais, <span className="accent text-sand-deep">sans compromis.</span>
          </>
        }
        intro="Une moustiquaire ne devrait jamais vous obliger à choisir entre l'air frais et la beauté de votre intérieur. C'est l'idée qui guide Aéris."
      />

      <section className="py-[var(--section-y)]">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-light leading-snug tracking-[-0.025em] text-ink">
              Les moustiquaires standard ferment mal, vieillissent vite et défigurent les fenêtres. Nous avons choisi l&apos;inverse&nbsp;:{" "}
              <span className="text-ink-3">mesurer chaque ouverture, choisir des matériaux durables et soigner la finition comme une menuiserie.</span>
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
          <SectionHeading eyebrow="Notre méthode" title="Quatre étapes, aucune surprise." />
          <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-4">
            {method.map((m, i) => (
              <Reveal as="li" key={m.n} delay={i * 80} className="bg-surface p-7">
                <p className="t-num text-sm text-sky">{m.n}</p>
                <h3 className="t-h4 mt-4 text-ink">{m.title}</h3>
                <p className="mt-2 text-ink-2">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow="Nos valeurs" title="Ce qui guide chaque moustiquaire." />
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="rounded-[var(--radius-xl)] border border-line bg-surface p-7">
                <Icon name={v.icon} size={24} className="text-ink" />
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
