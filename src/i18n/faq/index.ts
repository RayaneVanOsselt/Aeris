import type { Locale } from "../config";
import { en } from "./en";
import { faq as fr } from "./fr";
import { nl } from "./nl";
import type { FaqCategory, FaqCategoryId, FaqItem } from "./types";

export type { FaqCategory, FaqCategoryId, FaqItem };

export const faqs: Record<Locale, FaqCategory[]> = { fr, nl, en };

/** Questions d'une catégorie (pages produit, catégorie, contact). */
export function faqItems(locale: Locale, id: FaqCategoryId): FaqItem[] {
  return faqs[locale].find((c) => c.id === id)?.items ?? [];
}

/** Questions mises en avant sur l'accueil. */
export function homeFaq(locale: Locale): FaqItem[] {
  return faqs[locale].flatMap((c) => c.items).filter((i) => i.home);
}
