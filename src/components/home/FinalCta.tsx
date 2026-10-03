import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Reveal } from "@/components/ui/Reveal";

/** Dernier plan du film : la maison éclairée le soir, fenêtres ouvertes. La fenêtre s'ouvre en grand en entrant dans l'écran. */
export function FinalCta() {
  const { m, href } = getI18n();
  const c = m.homePage.finalCta;
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="px-2 pb-2 pt-[calc(var(--section-y)*0.4)] sm:px-3 sm:pb-3">
      <div className="sd-window relative isolate flex min-h-[min(92svh,56rem)] items-end overflow-hidden rounded-[var(--radius-2xl)] bg-night text-white lg:rounded-[56px]">
        <div className="absolute inset-0 -z-10">
          <LazyVideo name="clip-house" focus="38%" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(13_26_46/0.85)_0%,rgb(13_26_46/0.45)_45%,rgb(13_26_46/0.1)_80%)]"
        />
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
