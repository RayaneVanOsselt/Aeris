import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { ButtonLink } from "@/components/ui/Button";
import { Ruler } from "@/components/ui/Ruler";

export default function NotFound() {
  const { m, href } = getI18n();
  const t = m.pages.notFound;
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
      <div className="container-site relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="t-num text-sm text-sky">{t.eyebrow}</p>
        <h1 className="t-h1 mt-5 max-w-2xl text-ink">
          <Rich text={t.title} />
        </h1>
        <p className="t-lead mt-5 max-w-lg text-ink-2">{t.text}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={href("home")} arrow>
            {m.common.backHome}
          </ButtonLink>
          <ButtonLink href={href("catalog")} variant="secondary">
            {t.catalog}
          </ButtonLink>
        </div>
      </div>
      <Ruler className="container-site" />
    </section>
  );
}
