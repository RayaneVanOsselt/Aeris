import type { Metadata, Viewport } from "next";
import { LOCALE_STORAGE_KEY, defaultLocale, languageNames, locales } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { pathFor } from "@/i18n/routes";
import { Logo } from "@/components/layout/Logo";
import { languageAlternates, ogImagePath } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: messages[defaultLocale].meta.defaultTitle,
  description: locales.map((l) => messages[l].meta.ogTitle).join(" · "),
  alternates: { canonical: "/", languages: languageAlternates({ key: "home" }) },
  openGraph: { images: [{ url: ogImagePath(defaultLocale), width: 1200, height: 630 }] },
};

export const viewport: Viewport = { themeColor: "#f6f4ee", width: "device-width", initialScale: 1 };

/**
 * Redirection immédiate vers la langue mémorisée, sinon celle du navigateur
 * (néerlandais ou anglais), sinon le français. Les liens ci-dessous restent
 * disponibles si JavaScript est désactivé. Chemins relatifs : compatibles
 * avec le sous-dossier GitHub Pages comme avec un domaine propre.
 */
const redirect = `(function(){var L=${JSON.stringify(locales)},s=null;try{s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}var l=L.indexOf(s)>=0?s:null;if(!l){var n=navigator.languages||[navigator.language||""];for(var i=0;i<n.length&&!l;i++){var c=String(n[i]).slice(0,2).toLowerCase();if(L.indexOf(c)>=0)l=c}}location.replace((l||${JSON.stringify(defaultLocale)})+"/")})();`;

export default function LanguageChooser() {
  return (
    <html lang="fr-BE" className={fontVariables}>
      <body className="min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: redirect }} />
        <main className="container-site flex min-h-dvh flex-col items-center justify-center gap-10 py-20 text-center">
          <Logo />
          <h1 className="sr-only">{messages[defaultLocale].meta.defaultTitle}</h1>
          <ul className="grid w-full max-w-md gap-3">
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={`${pathFor(l, { key: "home" }).slice(1)}/`}
                  hrefLang={l}
                  lang={l}
                  className="flex items-center justify-between rounded-[var(--radius-lg)] border border-line bg-surface px-6 py-5 text-left text-ink transition-colors hover:border-ink"
                >
                  <span>
                    <span className="block text-lg">{languageNames[l]}</span>
                    <span className="t-small text-ink-3">{messages[l].meta.languageChooser}</span>
                  </span>
                  <span aria-hidden className="t-num text-sm uppercase text-ink-3">
                    {l}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
