import { getColor, getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";
import { ButtonLink } from "@/components/ui/Button";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";
import { Ruler } from "@/components/ui/Ruler";

const demo = { productId: "fenetre", width: 1240, height: 1480, meshId: "fibre", colorId: "anthracite", optionIds: [], quantity: 1 };

export function Hero() {
  const product = getProduct(demo.productId)!;
  const color = getColor(demo.colorId)!;
  const price = computePrice(demo);

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

        <div className="relative lg:col-span-5">
          <div className="animate-fade-up relative mx-auto aspect-[4/5] max-w-[480px]" style={{ "--delay": "200ms" } as React.CSSProperties}>
            <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-xl)] border border-line bg-gradient-to-b from-surface to-paper-2 shadow-[var(--shadow-lg)]">
              <div aria-hidden className="blueprint-grid absolute inset-0 opacity-70" />
              <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-sky/10 blur-3xl" />
              <div aria-hidden className="absolute -bottom-20 -left-10 size-72 rounded-full bg-sand/25 blur-3xl" />
              <ProductVisual
                kind={product.visual}
                color={color.hex}
                width={demo.width}
                height={demo.height}
                dimensions
                animated
                title={`${product.name}, coloris ${color.name}, ${demo.width} × ${demo.height} mm`}
                className="absolute inset-0 m-auto h-[82%] w-[88%]"
              />
            </div>

            {/* Carte configuration flottante : montre que le prix est calculé en direct */}
            <div
              className="absolute -right-3 top-6 w-52 rounded-[var(--radius-lg)] border border-line bg-surface/95 p-4 shadow-[var(--shadow-md)] backdrop-blur sm:-right-10 motion-safe:animate-[float_6s_var(--ease-in-out)_infinite]"
              aria-hidden
            >
              <p className="t-caption text-ink-3">Votre configuration</p>
              <dl className="mt-3 space-y-1.5 text-[0.8125rem]">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">Modèle</dt>
                  <dd className="text-ink">{product.shortName}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-3">Coloris</dt>
                  <dd className="flex items-center gap-1.5 text-ink">
                    <span className="size-2.5 rounded-full" style={{ background: color.hex }} />
                    {color.name}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                <span className="text-[0.8125rem] text-ink-3">Prix TTC</span>
                <span className="t-num text-lg text-ink">{formatPrice(price.total)}</span>
              </div>
            </div>

            {/* Loupe sur la trame */}
            <div
              aria-hidden
              className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-full border border-line bg-surface/95 py-2 pl-2 pr-5 shadow-[var(--shadow-md)] backdrop-blur sm:-left-8 motion-safe:animate-[float_7s_var(--ease-in-out)_1s_infinite]"
            >
              <span
                className="size-12 rounded-full border border-line-strong"
                style={{
                  backgroundColor: "#e9eef6",
                  backgroundImage:
                    "linear-gradient(to right, rgb(10 22 49/.45) 1px, transparent 1px), linear-gradient(to bottom, rgb(10 22 49/.45) 1px, transparent 1px)",
                  backgroundSize: "5px 5px",
                }}
              />
              <span>
                <span className="block text-[0.8125rem] text-ink">Toile haute visibilité</span>
                <span className="t-caption text-ink-3">Vous voyez dehors</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Ruler className="container-site" />
    </section>
  );
}
