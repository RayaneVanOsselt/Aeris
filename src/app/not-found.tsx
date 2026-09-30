import { ButtonLink } from "@/components/ui/Button";
import { Ruler } from "@/components/ui/Ruler";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
      <div className="container-site relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="t-num text-sm text-sky">Erreur 404</p>
        <h1 className="t-h1 mt-5 max-w-2xl text-ink">
          Cette page n&apos;est pas <span className="accent text-sand-deep">à nos mesures.</span>
        </h1>
        <p className="t-lead mt-5 max-w-lg text-ink-2">Le lien est peut-être ancien ou la page a été déplacée. Voici de quoi retrouver votre chemin.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" arrow>
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink href="/moustiquaires" variant="secondary">
            Voir les moustiquaires
          </ButtonLink>
        </div>
      </div>
      <Ruler className="container-site" />
    </section>
  );
}
