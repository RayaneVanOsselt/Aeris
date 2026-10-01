"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import { fmt, formatters, type Formatters } from "./format";
import type { ClientMessages } from "./messages";
import { hrefFor, type Href } from "./routes";

export type I18n = { locale: Locale; m: ClientMessages; href: Href; f: Formatters; t: typeof fmt };

const I18nContext = createContext<I18n | null>(null);

/** Rend la langue et ses textes disponibles pour les composants interactifs. */
export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: ClientMessages; children: ReactNode }) {
  const value = useMemo<I18n>(() => ({ locale, m: messages, href: hrefFor(locale), f: formatters(locale), t: fmt }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n doit être utilisé sous <I18nProvider>");
  return value;
}
