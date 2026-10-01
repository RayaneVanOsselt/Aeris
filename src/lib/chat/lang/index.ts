import type { Locale } from "@/i18n/config";
import { en } from "./en";
import { fr } from "./fr";
import { nl } from "./nl";
import type { ChatLang } from "./types";

export const chatLangs: Record<Locale, ChatLang> = { fr, nl, en };
