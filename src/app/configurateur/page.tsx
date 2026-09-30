import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { Configurator } from "@/components/configurator/Configurator";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = pageMetadata({
  title: "Configurateur de moustiquaire sur mesure — prix en temps réel",
  description:
    "Configurez votre moustiquaire en 5 étapes : modèle, dimensions, toile, coloris et options. Le prix TTC et le délai de fabrication s'affichent en direct.",
  path: "/configurateur",
});

export default function ConfiguratorPage() {
  return (
    <div className="container-site pb-[var(--section-y)] pt-8">
      <Breadcrumb items={[{ name: "Configurateur", href: "/configurateur" }]} />
      <h1 className="sr-only">Configurateur de moustiquaire sur mesure</h1>
      <div className="mt-8">
        <Suspense fallback={<div className="skeleton h-[600px] rounded-[var(--radius-xl)]" aria-label="Chargement du configurateur" />}>
          <Configurator />
        </Suspense>
      </div>
    </div>
  );
}
