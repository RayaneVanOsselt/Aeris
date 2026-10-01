import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import type { RouteTarget } from "@/i18n/routes";
import { AboutPage, aboutMeta } from "./AboutPage";
import { CartPage, cartMeta } from "./CartPage";
import { CatalogPage, catalogMeta } from "./CatalogPage";
import { CategoryPage, categoryMeta } from "./CategoryPage";
import { CheckoutPage, checkoutMeta } from "./CheckoutPage";
import { ConfiguratorPage, configuratorMeta } from "./ConfiguratorPage";
import { ConfirmationPage, confirmationMeta } from "./ConfirmationPage";
import { ContactPage, contactMeta } from "./ContactPage";
import { FaqPage, faqMeta } from "./FaqPage";
import { GuidePage, guideMeta } from "./GuidePage";
import { HomePage, homeMeta } from "./HomePage";
import { LegalDocPage, legalMeta } from "./LegalDocPage";
import { OrdersPage, ordersMeta } from "./OrdersPage";
import { ProductPage, productMeta } from "./ProductPage";
import { QuotePage, quoteMeta } from "./QuotePage";

/** Page à afficher pour une adresse du site (toutes langues). */
export function renderRoute(target: RouteTarget) {
  switch (target.key) {
    case "home":
      return <HomePage />;
    case "catalog":
      return <CatalogPage />;
    case "category":
      return <CategoryPage id={target.id} />;
    case "product":
      return <ProductPage id={target.id} />;
    case "configurator":
      return <ConfiguratorPage />;
    case "guide":
      return <GuidePage />;
    case "quote":
      return <QuotePage />;
    case "contact":
      return <ContactPage />;
    case "faq":
      return <FaqPage />;
    case "about":
      return <AboutPage />;
    case "cart":
      return <CartPage />;
    case "checkout":
      return <CheckoutPage />;
    case "confirmation":
      return <ConfirmationPage />;
    case "orders":
      return <OrdersPage />;
    case "legalNotice":
    case "terms":
    case "privacy":
    case "cookies":
      return <LegalDocPage docKey={target.key} />;
  }
}

/** Métadonnées (titre, description, hreflang…) de chaque page. */
export function routeMetadata(locale: Locale, target: RouteTarget): Metadata {
  switch (target.key) {
    case "home":
      return homeMeta(locale);
    case "catalog":
      return catalogMeta(locale);
    case "category":
      return categoryMeta(locale, target.id);
    case "product":
      return productMeta(locale, target.id);
    case "configurator":
      return configuratorMeta(locale);
    case "guide":
      return guideMeta(locale);
    case "quote":
      return quoteMeta(locale);
    case "contact":
      return contactMeta(locale);
    case "faq":
      return faqMeta(locale);
    case "about":
      return aboutMeta(locale);
    case "cart":
      return cartMeta(locale);
    case "checkout":
      return checkoutMeta(locale);
    case "confirmation":
      return confirmationMeta(locale);
    case "orders":
      return ordersMeta(locale);
    case "legalNotice":
    case "terms":
    case "privacy":
    case "cookies":
      return legalMeta(locale, target.key);
  }
}
