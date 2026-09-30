import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Polices auto-hébergées par next/font : aucune requête vers Google (RGPD) et pas de décalage de mise en page.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aéris — Moustiquaires sur mesure pour fenêtres, portes et baies",
    template: "%s · Aéris",
  },
  description:
    "Moustiquaires fabriquées à vos dimensions exactes pour fenêtres, portes et baies vitrées. Configurez la vôtre et obtenez votre prix en temps réel.",
  applicationName: "Aéris",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_BE", siteName: "Aéris" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-BE" className={`${geist.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh">
        <Header />
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ChatLauncher />
        <CookieConsent />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
