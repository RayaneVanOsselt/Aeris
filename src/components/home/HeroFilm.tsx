import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { mediaUrl } from "@/lib/media";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVideo } from "./HeroVideo";

/**
 * Ouverture de l'accueil : le film occupe tout l'écran. Il s'ouvre depuis une
 * fenêtre en arche (forme signature), puis se referme en cadre arrondi quand
 * on descend. Pas de voile sombre : deux dégradés légers, juste ce qu'il faut
 * pour lire le texte.
 */
export function HeroFilm() {
  const { m, href } = getI18n();
  const h = m.homePage.hero;
  const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;
  return (
    <section data-header-overlay className="relative -mt-[var(--header-h)] h-[100svh] min-h-[36rem] bg-paper">
      <div className="sd-hero-frame absolute inset-0 overflow-hidden bg-night text-white will-change-transform">
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 767px) and (orientation: portrait)" srcSet={mediaUrl("film-poster-portrait.webp")} type="image/webp" />
            <source srcSet={mediaUrl("film-poster.webp")} type="image/webp" />
            <img src={mediaUrl("film-poster.jpg")} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
          </picture>
          <HeroVideo />
        </div>
        {/* Ouverture en arche : un voile bleu nuit dont la « fenêtre » s'agrandit.
            L'image reste peinte en entier dessous (affichage principal immédiat). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
          <div className="hero-veil absolute inset-0" />
        </div>

        {/* Lisibilité : haut (navigation) et bas (texte), sans assombrir l'image */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night/45 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-[linear-gradient(to_top,rgb(13_26_46/0.82)_0%,rgb(13_26_46/0.5)_38%,rgb(13_26_46/0.12)_70%,transparent_100%)]"
        />

        <div className="sd-hero-copy container-site relative flex h-full flex-col justify-end pb-[clamp(5.5rem,11vh,8.5rem)] pt-[calc(var(--header-h)+2rem)]">
          <p className="t-caption animate-fade-in flex items-center gap-3 text-white/80" style={delay(500)}>
            <span aria-hidden className="h-px w-8 bg-sand" />
            {h.eyebrow}
          </p>
          <h1 className="t-display rt-load mt-6 max-w-[14ch] text-white" style={delay(650)}>
            <Rich text={h.title} words="rise" accentClassName="accent text-sand-soft" />
          </h1>
          <div className="mt-8 flex flex-col gap-8 md:mt-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="t-lead animate-fade-up max-w-[36rem] text-white/85" style={delay(1150)}>
              {h.lead}
            </p>
            <div className="animate-fade-up flex flex-col gap-3 min-[430px]:flex-row lg:shrink-0" style={delay(1300)}>
              <ButtonLink href={href("configurator")} size="lg" variant="light" arrow>
                {m.common.configureMine}
              </ButtonLink>
              <ButtonLink href="#collection" size="lg" variant="glass">
                {h.discover}
              </ButtonLink>
            </div>
          </div>
        </div>

        <a
          href="#intro"
          className="animate-fade-in group absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 text-white/75 transition-colors hover:text-white lg:flex"
          style={delay(1700)}
        >
          <span className="t-caption">{h.scroll}</span>
          <span aria-hidden className="relative h-10 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-0 animate-[scroll-line_2.4s_var(--ease-in-out)_infinite] bg-white motion-reduce:hidden" />
          </span>
        </a>
      </div>
    </section>
  );
}
