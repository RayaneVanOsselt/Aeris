import { getI18n } from "@/i18n/server";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { isClaimVisible, reviews, showPlaceholders, type ClaimKey } from "@/lib/business";

/** Engagements dans l'ordre d'importance. Les non confirmés n'apparaissent qu'en mode préparation. */
const commitments: ClaimKey[] = ["madeToMeasure", "instantPrice", "directPayment", "humanSupport", "checkedBeforeProduction", "europeanMade", "warranty"];

/**
 * La preuve en un chiffre : 1 mm, la précision de la saisie (engagement
 * confirmé « sur mesure, au millimètre »). Puis les engagements, sans
 * astérisque. Les avis clients n'apparaissent que s'ils sont authentiques.
 */
export function Proof() {
  const { m, t } = getI18n();
  const p = m.homePage.proof;
  const visible = commitments.filter(isClaimVisible);

  return (
    <section aria-labelledby="proof-title" className="overflow-x-clip pb-[var(--section-y)] pt-[calc(var(--section-y)*0.5)]">
      <div className="container-site grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="t-caption flex items-center gap-3 text-ink-3">
              <span aria-hidden className="h-px w-8 bg-sand" />
              {p.eyebrow}
            </p>
            <h2 id="proof-title" className="mt-4 flex items-start font-serif font-light leading-[0.8] tracking-[-0.06em] text-ink">
              <span className="text-[clamp(11rem,34vw,26rem)] [font-variation-settings:'opsz'_144]">{p.figure}</span>
              <span className="accent mt-[0.18em] text-[clamp(3rem,9vw,7rem)] text-sand-deep">{p.unit}</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="t-h3 mt-8 max-w-[30ch] text-ink-2">{p.statement}</p>
          </Reveal>
        </div>

        <Reveal delay={160} className="lg:col-span-5">
          <div className="media-reveal relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-arch bg-paper-2 lg:max-w-none">
            <div className="sd-parallax absolute inset-0">
              <LazyVideo name="clip-mesh" focus="55%" />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container-site mt-24 lg:mt-32">
        <Reveal>
          <h3 className="t-caption text-ink-3">{p.commitments}</h3>
        </Reveal>
        <ul className="mt-8 grid grid-cols-1 border-t border-line md:grid-cols-2 lg:grid-cols-4">
          {visible.map((id, i) => (
            <Reveal as="li" key={id} delay={i * 70} className="border-b border-line py-7 md:pr-8 lg:border-b-0 lg:py-2 lg:pt-8 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8">
              <ClaimLabel id={id} className="t-h4 block text-ink" />
              <ClaimLabel id={id} field="detail" className="t-small mt-2 block text-ink-3" />
            </Reveal>
          ))}
        </ul>
      </div>

      {(reviews.length > 0 || showPlaceholders) && (
        <div className="container-site mt-24 lg:mt-32">
          <Reveal>
            <h3 className="t-h2 text-ink">{p.reviewsTitle}</h3>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
            {reviews.length > 0
              ? reviews.slice(0, 3).map((r, i) => (
                  <Reveal as="figure" key={`${r.author}-${r.date}`} delay={i * 80} className="border-t border-line pt-8">
                    <div className="flex gap-0.5 text-sand-deep" role="img" aria-label={t(p.rating, { rating: r.rating })}>
                      {Array.from({ length: 5 }, (_, s) => (
                        <Icon key={s} name="star" size={15} className={s < r.rating ? "fill-current" : "opacity-30"} />
                      ))}
                    </div>
                    <blockquote className="mt-6 font-serif text-[1.375rem] font-light leading-snug text-ink">{t(m.common.quoted, { text: r.text })}</blockquote>
                    <figcaption className="t-small mt-6 text-ink-3">
                      {r.author}
                      {r.city ? `, ${r.city}` : ""} · {t(p.source, { source: r.source })}
                    </figcaption>
                  </Reveal>
                ))
              : (
                  [
                    ["Avis clients vérifiés", "Connectez vos avis Google ou Trustpilot, ou ajoutez-les dans src/lib/business.ts (tableau reviews). Aucun avis n'est inventé."],
                    ["Photos de réalisations", "Photos réelles de moustiquaires posées chez vos clients. Le film d'accueil est une mise en scène : il ne remplace pas vos réalisations."],
                    ["Chiffres vérifiables", "Nombre de moustiquaires livrées, note moyenne… uniquement si vous pouvez les justifier."],
                  ] as const
                ).map(([title, text]) => (
                  <Placeholder key={title} title={title} icon="star">
                    {text}
                  </Placeholder>
                ))}
          </div>
        </div>
      )}
    </section>
  );
}
