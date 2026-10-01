import "./globals.css";

/**
 * Layout racine volontairement neutre : chaque langue (app/[locale]/layout.tsx),
 * la page de choix de langue (app/page.tsx) et la page 404 globale
 * (app/not-found.tsx) rendent leur propre <html lang="…">.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
