import type { Locale } from "../config";
import { en } from "./en";
import { fr, type Messages } from "./fr";
import { nl } from "./nl";

export type { ErrorCode, Messages, SubmitCode } from "./fr";

export const messages: Record<Locale, Messages> = { fr, nl, en };

/** Textes réservés au rendu serveur : ils ne sont jamais envoyés au navigateur. */
type ServerOnly = "meta" | "footer" | "compare" | "homePage" | "pages" | "legal";
export type ClientMessages = Omit<Messages, ServerOnly>;

/** Sous-ensemble du dictionnaire transmis aux composants interactifs. */
export function clientMessages(locale: Locale): ClientMessages {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { meta, footer, compare, homePage, pages, legal, ...client } = messages[locale];
  return client;
}
