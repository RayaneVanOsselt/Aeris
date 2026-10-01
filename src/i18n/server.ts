import { cache } from "react";
import { defaultLocale, type Locale } from "./config";
import { fmt, formatters, type Formatters } from "./format";
import { messages, type Messages } from "./messages";
import { hrefFor, type Href } from "./routes";

/**
 * Langue de la page en cours de rendu, côté serveur.
 * Fixée par le layout et la page de chaque langue (setRequestLocale),
 * puis lue par n'importe quel composant serveur (getI18n) sans la
 * transmettre de composant en composant.
 */
const requestStore = cache(() => ({ locale: defaultLocale as Locale }));

export function setRequestLocale(locale: Locale) {
  requestStore().locale = locale;
}

export type ServerI18n = { locale: Locale; m: Messages; href: Href; f: Formatters; t: typeof fmt };

export function i18nFor(locale: Locale): ServerI18n {
  return { locale, m: messages[locale], href: hrefFor(locale), f: formatters(locale), t: fmt };
}

export function getI18n(): ServerI18n {
  return i18nFor(requestStore().locale);
}
