import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { htmlLang, isLocale, locales, ogLocale } from "@/i18n/config";
import { clientMessages, messages } from "@/i18n/messages";
import { I18nProvider } from "@/i18n/provider";
import { setRequestLocale } from "@/i18n/server";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { fontVariables } from "../fonts";

type Params = { locale: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const meta = messages[locale].meta;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.defaultTitle, template: meta.titleTemplate },
    description: meta.description,
    applicationName: "Aéris",
    openGraph: { type: "website", locale: ogLocale[locale], siteName: "Aéris" },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f4ee",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body className="min-h-dvh">
        <I18nProvider locale={locale} messages={clientMessages(locale)}>
          <Header />
          <main id="contenu" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ChatLauncher />
          <CookieConsent />
        </I18nProvider>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd(locale)} />
      </body>
    </html>
  );
}
