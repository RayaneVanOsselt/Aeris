/**
 * Langues du site. Le français est la langue source : toute nouvelle
 * chaîne est d'abord écrite dans messages/fr.ts, puis traduite.
 */
export const locales = ["fr", "nl", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const isLocale = (value: unknown): value is Locale => typeof value === "string" && (locales as readonly string[]).includes(value);

/** Attribut lang de la page */
export const htmlLang: Record<Locale, string> = { fr: "fr-BE", nl: "nl-BE", en: "en" };

/** Formats de nombres, prix et dates (l'anglais utilise les conventions de la zone euro anglophone) */
export const intlLocale: Record<Locale, string> = { fr: "fr-BE", nl: "nl-BE", en: "en-IE" };

/** Open Graph */
export const ogLocale: Record<Locale, string> = { fr: "fr_BE", nl: "nl_BE", en: "en_GB" };

/** Nom de chaque langue dans sa propre langue (sélecteur de langue) */
export const languageNames: Record<Locale, string> = { fr: "Français", nl: "Nederlands", en: "English" };

/** Choix de langue mémorisé par le visiteur (sélecteur et page d'accueil racine) */
export const LOCALE_STORAGE_KEY = "aeris_locale";
