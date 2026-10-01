import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { Rich, plain } from "@/i18n/rich";
import { pathFor } from "@/i18n/routes";
import { Logo } from "@/components/layout/Logo";
import { Ruler } from "@/components/ui/Ruler";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: locales.map((l) => plain(messages[l].pages.notFound.eyebrow)).join(" · "),
  robots: { index: false },
};

/**
 * Page 404 globale (adresse inconnue, langue inconnue) : en trois langues,
 * puisqu'on ne peut pas savoir laquelle le visiteur lit.
 * Les liens sont relatifs à la racine du site (base /Aeris incluse sur GitHub Pages).
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function GlobalNotFound() {
  const fr = messages.fr.pages.notFound;
  return (
    <html lang="fr-BE" className={fontVariables}>
      <body className="min-h-dvh">
        <main className="relative overflow-hidden">
          <div aria-hidden className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
          <div className="container-site relative flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
            <a href={`${base}/`} aria-label="Aéris">
              <Logo />
            </a>
            <p className="t-num mt-12 text-sm text-sky">{fr.eyebrow}</p>
            <h1 className="t-h1 mt-5 max-w-2xl text-ink">
              <Rich text={fr.title} />
            </h1>
            <ul className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
              {locales.map((l) => (
                <li key={l} lang={l} className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 text-left">
                  <p className="t-small text-ink-2">{messages[l].pages.notFound.text}</p>
                  <a href={`${base}${pathFor(l, { key: "home" })}/`} className="mt-4 inline-flex text-sm text-ink underline underline-offset-4">
                    {messages[l].common.backHome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Ruler className="container-site" />
        </main>
      </body>
    </html>
  );
}
