import { intlLocale, type Locale } from "./config";

type Vars = Record<string, string | number>;

/** Remplace les {variables} d'un texte du dictionnaire. */
export function fmt(template: string, vars: Vars = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export type Formatters = {
  price: (value: number) => string;
  number: (value: number) => string;
  mm: (value: number) => string;
  area: (m2: number) => string;
  date: (iso: string) => string;
  /** Choisit la forme singulier/pluriel selon les règles de la langue, puis insère {count} */
  plural: (count: number, forms: { one: string; other: string }, vars?: Vars) => string;
  /** Liste lisible : « a, b ou c » */
  list: (items: string[], type?: "conjunction" | "disjunction") => string;
};

const cache = new Map<Locale, Formatters>();

/** Formats de nombres, prix, dates et pluriels propres à chaque langue. */
export function formatters(locale: Locale): Formatters {
  const cached = cache.get(locale);
  if (cached) return cached;
  const tag = intlLocale[locale];
  const eur = new Intl.NumberFormat(tag, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat(tag);
  const area = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 });
  const rules = new Intl.PluralRules(tag);
  const dates = new Intl.DateTimeFormat(tag, { day: "numeric", month: "long", year: "numeric" });
  const lists = {
    conjunction: new Intl.ListFormat(tag, { type: "conjunction" }),
    disjunction: new Intl.ListFormat(tag, { type: "disjunction" }),
  };
  const f: Formatters = {
    price: (value) => eur.format(value),
    number: (value) => num.format(value),
    mm: (value) => `${num.format(value)} mm`,
    area: (m2) => `${area.format(m2)} m²`,
    date: (iso) => dates.format(new Date(iso)),
    plural: (count, forms, vars = {}) => fmt(rules.select(count) === "one" ? forms.one : forms.other, { count: num.format(count), ...vars }),
    list: (items, type = "conjunction") => lists[type].format(items),
  };
  cache.set(locale, f);
  return f;
}
