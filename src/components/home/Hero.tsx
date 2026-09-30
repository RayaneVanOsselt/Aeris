import { ButtonLink } from "@/components/ui/Button";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";
import { Ruler } from "@/components/ui/Ruler";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_75%_40%,#000_20%,transparent_75%)]"
      />
      <div className="container-site relative grid items-center gap-12 pb-10 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-20">
        <div className="lg:col-span-7">
          <p className="t-caption animate-fade-up mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1.5 pl-2 pr-3.5 text-ink-2 backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-[pulse-ring_2s_var(--ease-out)_infinite] rounded-full bg-sky" />
              <span className="relative size-2 rounded-full bg-sky" />
            </span>
            Moustiquaires sur mesure · Fenêtres, portes, baies
          </p>
          <h1 className="t-display animate-fade-up text-ink" style={{ "--delay": "80ms" } as React.CSSProperties}>
            Fenêtres ouvertes,
            <br />
            <span className="accent text-sand-deep">insectes dehors.</span>
          </h1>
          <p className="t-lead animate-fade-up mt-8 max-w-xl text-ink-2" style={{ "--delay": "160ms" } as React.CSSProperties}>
            Des moustiquaires fabriquées au millimètre pour chacune de vos ouvertures. Discrètes, faciles à vivre — et votre prix exact
            s&apos;affiche pendant que vous configurez.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--delay": "240ms" } as React.CSSProperties}>
            <ButtonLink href="/configurateur" size="lg" arrow>
              Configurer ma moustiquaire
            </ButtonLink>
            <ButtonLink href="/moustiquaires#aide-au-choix" size="lg" variant="secondary">
              Trouver le bon modèle
            </ButtonLink>
          </div>
          <ul
            className="animate-fade-up mt-10 grid gap-x-8 gap-y-3 text-[0.9375rem] text-ink-2 sm:grid-cols-3"
            style={{ "--delay": "320ms" } as React.CSSProperties}
          >
            <li className="flex items-center gap-2.5">
              <Icon name="check" size={18} className="shrink-0 text-sky" />
              Prix immédiat, sans inscription
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="ruler" size={18} className="shrink-0 text-sky" />
              <ClaimLabel id="checkedBeforeProduction" />
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="lock" size={18} className="shrink-0 text-sky" />
              Revolut ou virement
            </li>
          </ul>
        </div>

        <div className="animate-fade-up relative lg:col-span-5" style={{ "--delay": "200ms" } as React.CSSProperties}>
          <HeroVisual />
        </div>
      </div>
      <Ruler className="container-site" />
    </section>
  );
}
