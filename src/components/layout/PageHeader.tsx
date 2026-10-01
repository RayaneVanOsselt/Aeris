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
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** Visuel facultatif à droite du titre (grand écran) */
  aside?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_80%_20%,#000_10%,transparent_70%)]"
      />
      <div className="container-site relative pb-12 pt-8 md:pb-16 md:pt-12">
        <Breadcrumb items={crumbs} />
        <div className="mt-10 grid grid-cols-1 items-end gap-10 md:mt-14 lg:grid-cols-12">
          <div className="max-w-3xl lg:col-span-7">
            {eyebrow && (
              <p className="t-caption animate-fade-up mb-5 inline-flex items-center gap-2 text-ink-3">
                <span aria-hidden className="h-px w-6 bg-sand" />
                {eyebrow}
              </p>
            )}
            <h1 className="t-h1 animate-rise text-ink" style={{ "--delay": "60ms" } as React.CSSProperties}>
              {title}
            </h1>
            {intro && (
              <p className="t-lead animate-rise mt-6 max-w-2xl text-ink-2" style={{ "--delay": "120ms" } as React.CSSProperties}>
                {intro}
              </p>
            )}
          </div>
          {aside && (
            <div className="animate-fade-up hidden lg:col-span-5 lg:block" style={{ "--delay": "180ms" } as React.CSSProperties}>
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>
      <Ruler className="container-site" />
    </header>
  );
}
