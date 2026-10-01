import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Ruler } from "@/components/ui/Ruler";

export function FinalCta() {
  const { m, href } = getI18n();
  const c = m.homePage.finalCta;
  return (
    <section className="px-[var(--gutter)] pb-[var(--section-y)]">
      <Reveal className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[var(--radius-xl)] bg-night px-6 py-16 text-on-night sm:px-12 md:py-24">
        <div aria-hidden className="mesh-texture-night absolute inset-0" />
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-sky/20 blur-[100px]" />
        <div aria-hidden className="absolute -bottom-32 left-10 size-96 rounded-full bg-sand/15 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="t-caption text-on-night-2">{c.eyebrow}</p>
          <h2 className="t-h1 mt-5">
            <Rich text={c.title} accentClassName="accent text-sand" />
          </h2>
          <p className="t-lead mx-auto mt-6 max-w-xl text-on-night-2">{c.text}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={href("configurator")} size="lg" variant="light" arrow>
              {m.common.configureMine}
            </ButtonLink>
            <ButtonLink href={href("quote")} size="lg" variant="outline-light">
              {m.common.requestQuote}
            </ButtonLink>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-on-night-2">
            <Icon name="chat" size={16} className="text-sand" />
            {c.assistant}
          </p>
        </div>
        <Ruler tone="night" className="absolute inset-x-0 bottom-0 opacity-60" />
      </Reveal>
    </section>
  );
}
