import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { Reveal } from "@/components/ui/Reveal";

/** Intro : une seule phrase, qui s'éclaire mot à mot pendant le défilement. */
export function Manifesto() {
  const { m } = getI18n();
  const ma = m.homePage.manifesto;
  return (
    <section id="intro" className="scroll-mt-0 py-[clamp(7rem,16vw,15rem)]">
      <div className="container-site">
        <p className="t-h1 max-w-[22ch] text-ink lg:ml-[8.33%]">
          <Rich text={ma.text} words="scroll" />
        </p>
        <Reveal className="mt-12 flex items-center gap-4 lg:ml-[8.33%]">
          <span aria-hidden className="h-px w-12 bg-sand" />
          <span className="t-caption text-ink-3">{ma.signature}</span>
        </Reveal>
      </div>
    </section>
  );
}
