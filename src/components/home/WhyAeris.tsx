import { frameColors } from "@/lib/catalog";
import { ClaimLabel, isClaimVisible } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MeasureDemo } from "./MeasureDemo";

/** Différenciation en bento : chaque carte prouve un bénéfice au lieu de l'affirmer. */
export function WhyAeris() {
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeading
          eyebrow="Pourquoi Aéris"
          title={
            <>
              Une moustiquaire qu&apos;on <span className="accent text-sand-deep">oublie</span> d&apos;avoir posée.
            </>
          }
          intro="Parce qu'elle est faite pour votre ouverture — pas pour une taille standard qu'il faudrait recouper, caler ou supporter."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 lg:mt-20">
          <Reveal className="rounded-[var(--radius-xl)] border border-line bg-surface p-5 sm:p-8 md:col-span-6 lg:col-span-4 lg:row-span-2">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="t-caption text-sky">Essayez</p>
                <h3 className="t-h3 mt-2 text-ink">Au millimètre près</h3>
                <p className="mt-2 max-w-md text-ink-2">Déplacez les curseurs : la moustiquaire et son prix s&apos;ajustent à vos dimensions.</p>
              </div>
            </div>
            <MeasureDemo />
          </Reveal>

          <Reveal delay={80} className="flex flex-col rounded-[var(--radius-xl)] border border-line bg-surface p-7 md:col-span-3 lg:col-span-2">
            <Icon name="palette" size={24} className="text-ink" />
            <h3 className="t-h4 mt-5 text-ink">Assortie à vos menuiseries</h3>
            <p className="mt-2 text-ink-2">Cinq coloris de série et le RAL de votre choix.</p>
            <ul className="mt-auto flex pt-6" aria-label="Coloris disponibles">
              {frameColors.map((c, i) => (
                <li
                  key={c.id}
                  title={c.name}
                  className="-ml-2 size-10 rounded-full border-2 border-surface first:ml-0"
                  style={{
                    background: c.id === "ral" ? "conic-gradient(#c8a57a,#3563e9,#1f7a55,#b42318,#c8a57a)" : c.hex,
                    zIndex: frameColors.length - i,
                  }}
                >
                  <span className="sr-only">{c.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140} className="flex flex-col rounded-[var(--radius-xl)] bg-night p-7 text-on-night md:col-span-3 lg:col-span-2">
            <Icon name="eye" size={24} className="text-sand" />
            <h3 className="t-h4 mt-5">Prix clair, tout de suite</h3>
            <p className="mt-2 text-on-night-2">
              Le prix TTC s&apos;affiche à chaque choix. Pas d&apos;inscription, pas de rappel commercial, pas de surprise.
            </p>
          </Reveal>

          {isClaimVisible("checkedBeforeProduction") && (
            <Reveal delay={60} className="rounded-[var(--radius-xl)] border border-line bg-surface p-7 md:col-span-2">
              <Icon name="ruler" size={24} className="text-ink" />
              <h3 className="t-h4 mt-5 text-ink">
                <ClaimLabel id="checkedBeforeProduction" />
              </h3>
              <p className="mt-2 text-ink-2">Une incohérence dans vos mesures&nbsp;? Nous vous contactons avant de fabriquer quoi que ce soit.</p>
            </Reveal>
          )}
          {isClaimVisible("europeanMade") && (
            <Reveal delay={120} className="rounded-[var(--radius-xl)] border border-line bg-surface p-7 md:col-span-2">
              <Icon name="europe" size={24} className="text-ink" />
              <h3 className="t-h4 mt-5 text-ink">
                <ClaimLabel id="europeanMade" />
              </h3>
              <p className="mt-2 text-ink-2">
                <ClaimLabel id="europeanMade" field="detail" />
              </p>
            </Reveal>
          )}
          {isClaimVisible("warranty") && (
            <Reveal delay={180} className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-sand-soft p-7 md:col-span-2">
              <p aria-hidden className="absolute -right-2 -top-6 text-[8rem] font-extralight leading-none tracking-[-0.06em] text-sand/40">
                5
              </p>
              <Icon name="shield" size={24} className="relative text-ink" />
              <h3 className="t-h4 relative mt-5 text-ink">
                <ClaimLabel id="warranty" />
              </h3>
              <p className="relative mt-2 text-ink-2">
                <ClaimLabel id="warranty" field="detail" />
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
