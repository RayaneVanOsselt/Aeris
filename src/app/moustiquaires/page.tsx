import { products } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { CompareTable } from "@/components/product/CompareTable";
import { ProductFinder } from "@/components/product/ProductFinder";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "Toutes nos moustiquaires sur mesure",
  description:
    "Moustiquaires sur mesure pour fenêtres, portes et baies vitrées : à clips, cadre fixe, enroulable, plissée, battante, coulissante ou magnétique. Comparez et trouvez la vôtre.",
  path: "/moustiquaires",
});

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Moustiquaires", href: "/moustiquaires" }]}
        eyebrow="Le catalogue"
        title={
          <>
            Toutes nos moustiquaires, <span className="accent text-sand-deep">à vos mesures.</span>
          </>
        }
        intro="Huit solutions, toutes fabriquées sur mesure. Les prix indiqués sont des prix de départ : le prix exact s'affiche dans le configurateur selon vos dimensions."
      />

      <section className="pb-[var(--section-y)] pt-10">
        <div className="container-site">
          <CatalogGrid items={products} />
        </div>
      </section>

      <section id="aide-au-choix" className="scroll-mt-24 pb-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading
            eyebrow="Aide au choix"
            title={
              <>
                Pas sûr du modèle&nbsp;? <span className="accent text-sand-deep">Trois questions.</span>
              </>
            }
            intro="Répondez simplement : nous vous recommandons le modèle et la toile adaptés, prêts à configurer."
          />
          <div className="mt-12">
            <ProductFinder />
          </div>
        </div>
      </section>

      <section id="comparer" className="scroll-mt-24 border-t border-line bg-surface py-[var(--section-y)]">
        <div className="container-site">
          <SectionHeading eyebrow="Comparer" title="Les modèles, côte à côte." intro="Ouverture, usage, pose, délai et prix de départ." />
          <div className="mt-12">
            <CompareTable />
          </div>
        </div>
      </section>
    </>
  );
}
