import { showPlaceholders } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { MeasureGuideVisual } from "@/components/product/MeasureGuideVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "Guide des mesures : bien mesurer sa moustiquaire",
  description: "Comment mesurer une fenêtre, une porte ou une baie pour une moustiquaire sur mesure : méthode en 3 points, erreurs à éviter et conseils.",
  path: "/guide-des-mesures",
});

const steps = [
  { title: "Préparez-vous", text: "Un mètre ruban métallique, de quoi noter, et c'est tout. Travaillez toujours en millimètres : 1 m = 1 000 mm." },
  { title: "Mesurez la largeur en trois points", text: "En haut (A), au milieu (B) et en bas (C) de l'ouverture. Les murs ne sont jamais parfaitement droits : notez les trois valeurs." },
  { title: "Mesurez la hauteur en trois points", text: "À gauche (D), au centre (E) et à droite (F). Là encore, notez chaque valeur." },
  { title: "Retenez la plus petite valeur", text: "C'est elle qui garantit que la moustiquaire entre sans forcer. En cas d'écart important entre deux mesures, signalez-le dans vos remarques." },
  { title: "Repérez les obstacles", text: "Poignées, volet roulant, appui de fenêtre, seuil de porte : notez-les. Ils peuvent influencer le choix du modèle ou la pose." },
];

const mistakes: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: "ruler", title: "Centimètres au lieu de millimètres", text: "80 cm = 800 mm. Le configurateur détecte cette erreur et vous propose la conversion." },
  { icon: "layers", title: "Largeur et hauteur inversées", text: "La largeur se mesure de gauche à droite. Le configurateur vous alerte si les proportions semblent inversées." },
  { icon: "eye", title: "Mesurer le vitrage", text: "Mesurez l'ouverture (le cadre), pas la vitre : la différence peut atteindre plusieurs centimètres." },
];

export default function MeasureGuidePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Guide des mesures", href: "/guide-des-mesures" }]}
        eyebrow="Guide des mesures"
        title={
          <>
            Bien mesurer, <span className="accent text-sand-deep">en cinq minutes.</span>
          </>
        }
        intro="Une moustiquaire sur mesure commence par une bonne mesure. La méthode est simple — et nous vérifions chaque configuration avant fabrication."
      />

      <section className="container-site grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <MeasureGuideVisual className="w-full" />
            <p className="t-small mt-4 text-center text-ink-3">Largeurs A, B, C · Hauteurs D, E, F</p>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {steps.map((s, i) => (
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
          <SectionHeading eyebrow="À éviter" title="Les trois erreurs les plus fréquentes." />
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {mistakes.map((m, i) => (
              <Reveal key={m.title} delay={i * 80} className="rounded-[var(--radius-xl)] border border-line bg-paper p-7">
                <Icon name={m.icon} size={24} className="text-sky" />
                <h3 className="t-h4 mt-5 text-ink">{m.title}</h3>
                <p className="mt-2 text-ink-2">{m.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 rounded-[var(--radius-xl)] border border-line bg-paper-2/60 p-7 text-ink-2">
            <p className="flex gap-3">
              <Icon name="info" size={20} className="mt-0.5 shrink-0 text-sky" />
              Selon le modèle, la moustiquaire se pose dans l&apos;embrasure de l&apos;ouverture ou sur son cadre. Si vous hésitez, indiquez-le en remarque ou envoyez-nous une photo : nous vous
              recontactons avant de fabriquer.
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
        <h2 className="t-h2 text-ink">Vos mesures sont prêtes&nbsp;?</h2>
        <p className="t-lead mx-auto mt-4 max-w-xl text-ink-2">Saisissez-les dans le configurateur : le prix s&apos;affiche immédiatement.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/configurateur" size="lg" arrow>
            Ouvrir le configurateur
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            Envoyer une photo
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
