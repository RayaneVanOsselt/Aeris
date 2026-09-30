import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const night = [
  { time: "19:30", title: "On ouvre grand", text: "La maison a chauffé toute la journée : on crée un courant d'air." },
  { time: "21:45", title: "La lumière attire", text: "Les lampes s'allument, les insectes trouvent le chemin." },
  { time: "23:10", title: "On referme, on étouffe", text: "Fraîcheur ou tranquillité : le dilemme de chaque soir d'été." },
  { time: "03:00", title: "Le bourdonnement", text: "Celui qui réveille toute la maison." },
];

/** Storytelling : le problème vécu, raconté comme une nuit d'été. */
export function Problem() {
  return (
    <section className="relative overflow-hidden bg-night text-on-night section-y">
      <div aria-hidden className="mesh-texture-night absolute inset-0" />
      <div aria-hidden className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-sky/15 blur-[120px]" />
      {[
        { l: "12%", t: "22%", d: "0s" },
        { l: "78%", t: "16%", d: "1.2s" },
        { l: "64%", t: "70%", d: "2.4s" },
      ].map((b) => (
        <Icon
          key={b.l}
          name="bug"
          size={18}
          className="absolute text-on-night/25 motion-safe:animate-[drift_7s_var(--ease-in-out)_infinite]"
          style={{ left: b.l, top: b.t, animationDelay: b.d }}
        />
      ))}

      <div className="container-site relative">
        <SectionHeading
          tone="night"
          eyebrow="Le dilemme de l'été"
          title={
            <>
              On veut tout ouvrir.
              <br />
              <span className="accent text-sand">Les insectes aussi.</span>
            </>
          }
          intro="Chaleur, sommeil, lumière du soir : les meilleures heures de l'été sont aussi celles où les moustiques entrent."
        />

        <ol className="relative mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-line-night md:left-0 md:top-[7px] md:h-px md:w-full" />
          {night.map((step, i) => (
            <Reveal as="li" key={step.time} delay={i * 110} className="relative pl-10 md:pl-0 md:pt-12">
              <span aria-hidden className="absolute left-0 top-1 flex size-[15px] items-center justify-center rounded-full border border-on-night-2 bg-night md:top-0">
                <span className="size-1.5 rounded-full bg-sand" />
              </span>
              <p className="t-num text-2xl font-light text-sand">{step.time}</p>
              <h3 className="t-h4 mt-3 text-on-night">{step.title}</h3>
              <p className="mt-2 text-on-night-2">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 flex flex-col items-start gap-6 rounded-[var(--radius-xl)] border border-line-night bg-white/[0.03] p-8 backdrop-blur md:mt-24 md:flex-row md:items-center md:p-10">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-sand/15 text-sand">
            <Icon name="moon" size={24} />
          </span>
          <p className="t-h3 font-light text-on-night">
            Avec une moustiquaire à vos mesures, on n&apos;a plus à choisir&nbsp;:{" "}
            <span className="text-on-night-2">fenêtres ouvertes toute la nuit, et rien qui n&apos;entre.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
