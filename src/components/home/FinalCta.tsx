import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Ruler } from "@/components/ui/Ruler";

/** Appel final sur fond bleu nuit (le film n'apparaît qu'en ouverture). L'arche s'ouvre en grand en entrant dans l'écran. */
export function FinalCta() {
  const { m, href } = getI18n();
  const c = m.homePage.finalCta;
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="px-2 pb-2 pt-[calc(var(--section-y)*0.4)] sm:px-3 sm:pb-3">
      <div className="sd-window relative isolate flex min-h-[min(92svh,56rem)] items-end overflow-hidden rounded-[var(--radius-2xl)] bg-night text-white lg:rounded-[56px]">
        <div aria-hidden className="mesh-texture-night absolute inset-0 -z-10" />
        <div aria-hidden className="absolute -right-32 -top-40 -z-10 size-[36rem] rounded-full bg-sky/30 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-48 left-[10%] -z-10 size-[32rem] rounded-full bg-sand/20 blur-[120px]" />
        <Ruler tone="night" className="absolute inset-x-0 top-0 -z-10 opacity-70" />
        <Reveal className="container-site pb-[clamp(3rem,8vw,6rem)] pt-40">
          <p className="t-caption flex items-center gap-3 text-white/75">
            <span aria-hidden className="h-px w-8 bg-sand" />
            {c.eyebrow}
          </p>
          <h2 id="final-cta-title" className="t-display mt-6 max-w-[16ch]">
            <Rich text={c.title} words="rise" accentClassName="accent text-sand-soft" />
          </h2>
          <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="t-lead max-w-xl text-white/85">{c.text}</p>
              <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
                <ButtonLink href={href("configurator")} size="lg" variant="light" arrow>
                  {m.common.configureMine}
                </ButtonLink>
                <ButtonLink href={href("quote")} size="lg" variant="glass">
                  {m.common.requestQuote}
                </ButtonLink>
              </div>
            </div>
            <p className="t-small inline-flex max-w-xs items-start gap-2.5 text-white/75">
              <Icon name="chat" size={18} className="mt-0.5 shrink-0 text-sand" />
              {c.assistant}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
