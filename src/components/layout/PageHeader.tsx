import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Ruler } from "@/components/ui/Ruler";

/** En-tête des pages intérieures : fil d'Ariane, titre léger, chapeau, grille de plan. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_80%_20%,#000_10%,transparent_70%)]"
      />
      <div className="container-site relative pb-12 pt-8 md:pb-16 md:pt-12">
        <Breadcrumb items={crumbs} />
        <div className="mt-10 max-w-3xl md:mt-14">
          {eyebrow && (
            <p className="t-caption animate-fade-up mb-5 inline-flex items-center gap-2 text-ink-3">
              <span aria-hidden className="h-px w-6 bg-sand" />
              {eyebrow}
            </p>
          )}
          <h1 className="t-h1 animate-fade-up text-ink" style={{ "--delay": "60ms" } as React.CSSProperties}>
            {title}
          </h1>
          {intro && (
            <p className="t-lead animate-fade-up mt-6 max-w-2xl text-ink-2" style={{ "--delay": "120ms" } as React.CSSProperties}>
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
      <Ruler className="container-site" />
    </header>
  );
}
