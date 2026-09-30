import { realisations, reviews, showPlaceholders } from "@/lib/business";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Preuve sociale — uniquement des avis et réalisations authentiques.
 * Tant qu'il n'y en a pas, la section montre des emplacements identifiés
 * (mode préparation) ou disparaît (production).
 */
export function Proof() {
  const hasReviews = reviews.length > 0;
  const hasRealisations = realisations.length > 0;
  if (!hasReviews && !hasRealisations && !showPlaceholders) return null;

  return (
    <section className="section-y border-t border-line bg-surface">
      <div className="container-site">
        <SectionHeading eyebrow="Ils ont choisi Aéris" title="Des intérieurs qui respirent." />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {hasReviews
            ? reviews.slice(0, 3).map((r, i) => (
                <Reveal as="figure" key={`${r.author}-${r.date}`} delay={i * 80} className="flex flex-col rounded-[var(--radius-xl)] border border-line bg-paper p-7">
                  <div className="flex gap-0.5 text-sand-deep" aria-label={`${r.rating} sur 5`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Icon key={s} name="star" size={16} className={s < r.rating ? "fill-current" : "opacity-30"} />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-lg font-light leading-relaxed text-ink">« {r.text} »</blockquote>
                  <figcaption className="mt-6 text-sm text-ink-3">
                    {r.author}
                    {r.city ? `, ${r.city}` : ""} · avis {r.source}
                  </figcaption>
                </Reveal>
              ))
            : (
                [
                ["Avis clients vérifiés", "Connectez vos avis Google ou Trustpilot, ou ajoutez-les dans src/lib/business.ts (tableau reviews). Aucun avis n'est inventé."],
                ["Photos de réalisations", "Photos réelles de moustiquaires posées chez vos clients (lumière naturelle, intérieur, détail du profilé)."],
                ["Chiffres vérifiables", "Nombre de moustiquaires livrées, note moyenne… uniquement si vous pouvez les justifier."],
                ] as const
              ).map(([title, text]) => (
                <Placeholder key={title} title={title} icon="star">
                  {text}
                </Placeholder>
              ))}
        </div>
      </div>
    </section>
  );
}
