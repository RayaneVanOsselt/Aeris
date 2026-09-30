import { PageHeader } from "@/components/layout/PageHeader";
import { FormAlert } from "@/components/ui/Field";

export type LegalSection = { title: string; facts?: string[]; todo?: string };

/**
 * Gabarit des pages légales. Les « faits » décrivent le fonctionnement réel
 * du site ; les mentions « À compléter » doivent être rédigées ou validées
 * par un professionnel du droit. Aucun texte juridique n'est inventé.
 */
export function LegalPage({ title, path, intro, sections }: { title: string; path: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHeader crumbs={[{ name: title, href: path }]} eyebrow="Informations légales" title={title} intro={intro} />
      <section className="container-site grid grid-cols-1 gap-12 pb-[var(--section-y)] pt-12 lg:grid-cols-12">
        <nav aria-label="Sommaire" className="lg:col-span-3">
          <ol className="t-small space-y-2 text-ink-2 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#s${i + 1}`} className="link-underline hover:text-ink">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-3xl space-y-12 lg:col-span-9">
          <FormAlert tone="info">
            Document en préparation : la structure et les informations techniques sont en place. Le texte juridique définitif doit être fourni ou validé par un professionnel avant la mise en ligne.
          </FormAlert>
          {sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`} className="scroll-mt-28">
              <h2 className="t-h3 text-ink">
                {i + 1}. {s.title}
              </h2>
              {s.facts && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-2 marker:text-ink-3">
                  {s.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
              {s.todo && (
                <p className="mt-4 rounded-[var(--radius-md)] border border-dashed border-line-strong bg-paper-2/50 p-4 text-sm text-ink-3">
                  <span className="t-caption mr-2 rounded-full bg-warning-soft px-2 py-0.5 text-warning">À compléter</span>
                  {s.todo}
                </p>
              )}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
