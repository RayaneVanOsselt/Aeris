import Link from "next/link";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { payment } from "@/lib/business";
import { products } from "@/lib/catalog";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const minLead = Math.min(...products.map((p) => p.leadTimeDays[0]));
const maxLead = Math.max(...products.map((p) => p.leadTimeDays[1]));

/** Comment ça marche : quatre gestes, une ligne qui se trace de l'un à l'autre. */
export function Process() {
  const { m, href, f, t } = getI18n();
  const p = m.homePage.process;
  const methods = f.list(
    payment.methods.map((x) => m.payment.methods[x]),
    "disjunction",
  );
  return (
    <section id="comment-ca-marche" aria-labelledby="process-title" className="scroll-mt-8 bg-paper-2/60 py-[var(--section-y)]">
      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="t-caption flex items-center gap-3 text-ink-3">
              <span aria-hidden className="h-px w-8 bg-sand" />
              {p.eyebrow}
            </p>
            <h2 id="process-title" className="t-h1 mt-6 text-ink">
              <Rich text={p.title} words="rise" />
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link href={href("guide")} className="link-underline inline-flex items-center gap-2 pb-0.5 text-ink">
              <Icon name="ruler" size={18} /> {p.guide}
            </Link>
          </Reveal>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {p.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 110} className="group relative border-t border-line-strong pb-12 pt-8 lg:pb-0">
              <span
                aria-hidden
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform delay-[calc(var(--reveal-delay)+300ms)] duration-[var(--dur-cinematic)] ease-[var(--ease-out)] group-data-[visible=true]:scale-x-100"
              />
              <span className="t-num block font-serif text-[clamp(3rem,5vw,4.5rem)] font-light leading-none tracking-[-0.04em] text-sand-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t-h3 mt-8 text-ink">{step.title}</h3>
              <p className="mt-3 max-w-xs text-ink-2">{t(step.text, { methods, min: minLead, max: maxLead })}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
