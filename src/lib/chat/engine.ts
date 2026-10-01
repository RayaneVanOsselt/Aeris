import type { Locale } from "@/i18n/config";
import { fmt, formatters } from "@/i18n/format";
import type { ClientMessages } from "@/i18n/messages";
import { hrefFor } from "@/i18n/routes";
import type { FaqCategory } from "@/i18n/faq/types";
import { claims, company, payment } from "../business";
import { frameColors, getProduct, meshes, products, type Product } from "../catalog";
import { computePrice, startingPrice } from "../pricing";
import { checkDimensions, describeIssue, hasBlockingIssue } from "../validation";
import { chatLangs } from "./lang";
import type { ChatAction, ChatMessage, ChatReply } from "./types";

/** Ce dont l'assistant a besoin pour répondre dans une langue : textes du site et FAQ. */
export type ChatContext = {
  locale: Locale;
  m: Pick<ClientMessages, "catalog" | "common" | "claims" | "shipping" | "payment" | "dimensions">;
  faq: FaqCategory[];
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9x ]/g, " ");

const has = (text: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}`).test(text));

/** Repère des dimensions dans une phrase : « 80x120 cm », « 1000 x 2150 », « 1,2 m sur 2 m », « 1,2 m by 2 m ». */
export function parseDimensions(raw: string): { width: number; height: number } | null {
  const text = raw.toLowerCase().replace(/,/g, ".");
  const m = text.match(/(\d+(?:\.\d+)?)\s*(mm|cm|m)?\s*(?:x|×|\*|sur|par|op|bij|by)\s*(\d+(?:\.\d+)?)\s*(mm|cm|m)?/);
  if (!m) return null;
  const unit = m[4] ?? m[2];
  const toMm = (v: number) => {
    if (unit === "m" || (!unit && v < 10)) return Math.round(v * 1000);
    if (unit === "cm" || (!unit && v < 300)) return Math.round(v * 10);
    return Math.round(v);
  };
  return { width: toMm(Number(m[1])), height: toMm(Number(m[3])) };
}

/** Première lettre en minuscule (description insérée après « : ») */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * Moteur de réponse local : déterministe, basé uniquement sur les données du site.
 * Utilisé seul (sans clé IA) ou pour proposer des actions à côté d'une réponse LLM.
 */
export function answer(messages: ChatMessage[], { locale, m, faq }: ChatContext): ChatReply {
  const lang = chatLangs[locale];
  const { keywords: k, replies: r } = lang;
  const href = hrefFor(locale);
  const f = formatters(locale);
  const name = (p: Product) => m.catalog.products[p.id].name;
  const reply = (text: string, actions: ChatAction[] = [], suggestions: string[] = []): ChatReply => ({ reply: text, actions, suggestions, mode: "local" });
  const page = (key: keyof typeof lang.pages): ChatAction => ({
    type: "link",
    label: lang.pages[key],
    href: key === "finder" ? `${href("catalog")}#aide-au-choix` : href(key),
  });
  const productLink = (p: Product): ChatAction => ({ type: "link", label: name(p), href: href("product", p.id) });
  const callback: ChatAction = { type: "quote", label: r.callback };
  const findProduct = (text: string) => products.find((p) => lang.products[p.id].some((alias) => text.includes(alias)));

  const last = [...messages].reverse().find((msg) => msg.role === "user")?.content ?? "";
  const text = norm(last);
  const context = norm(messages.filter((msg) => msg.role === "user").map((msg) => msg.content).join(" "));
  const dims = parseDimensions(last);
  // « prix fenêtre 80x120 » : la fenêtre (hors porte-fenêtre) désigne notre modèle fenêtre
  const windowByDefault = dims && has(text, k.window) && !has(text, k.frenchDoor) ? getProduct("fenetre") : undefined;
  const product = findProduct(text) ?? windowByDefault ?? (has(text, k.priceQuestion) ? findProduct(context) : undefined);

  if (has(text, k.greeting) && text.split(" ").filter(Boolean).length <= 4) {
    return reply(r.greeting, [], r.greetingSuggestions);
  }

  if (has(text, k.human)) {
    return reply(r.human, [callback, page("quote")]);
  }

  // Estimation chiffrée si un modèle et des dimensions sont donnés
  if (dims && product) {
    const issues = checkDimensions(product, dims.width, dims.height);
    if (hasBlockingIssue(issues)) {
      const issue = issues.find((i) => i.level === "error")!;
      return reply(`${name(product)} — ${describeIssue(issue, m, f).message}`, [
        { type: "link", label: r.checkInConfigurator, href: `${href("configurator")}?modele=${product.id}` },
        page("guide"),
      ]);
    }
    const price = computePrice({ productId: product.id, width: dims.width, height: dims.height, meshId: "fibre", colorId: "blanc", optionIds: [], quantity: 1 });
    return reply(
      fmt(r.estimate, {
        product: lang.productPhrases[product.id],
        width: f.mm(dims.width),
        height: f.mm(dims.height),
        price: f.price(price.total),
        lead: fmt(m.common.leadTime, { min: product.leadTimeDays[0], max: product.leadTimeDays[1] }),
      }),
      [{ type: "link", label: r.configureWithSizes, href: `${href("configurator")}?modele=${product.id}&largeur=${dims.width}&hauteur=${dims.height}` }],
    );
  }

  if (dims && !product) {
    return reply(
      fmt(r.sizesNoProduct, { width: f.mm(dims.width), height: f.mm(dims.height) }),
      [],
      r.sizesSuggestions.map((s) => `${s} ${dims.width}x${dims.height} mm`),
    );
  }

  if (product) {
    const pt = m.catalog.products[product.id];
    return reply(
      fmt(r.product, {
        name: pt.name,
        lead: pt.lead,
        ideal: pt.idealFor.join(m.common.listSeparator).toLowerCase(),
        price: f.price(startingPrice(product)),
        leadTime: fmt(m.common.leadTime, { min: product.leadTimeDays[0], max: product.leadTimeDays[1] }),
      }),
      [
        { type: "link", label: fmt(r.configureProduct, { name: pt.shortName }), href: `${href("configurator")}?modele=${product.id}` },
        { type: "link", label: r.seeProduct, href: href("product", product.id) },
      ],
      [fmt(r.productSuggestions[0] ?? "", { short: pt.shortName.toLowerCase() }), ...r.productSuggestions.slice(1)],
    );
  }

  if (has(text, k.frenchDoor)) {
    const pleated = getProduct("plissee")!;
    return reply(r.frenchDoor, [
      { type: "link", label: fmt(r.configureProduct, { name: m.catalog.products.plissee.shortName }), href: `${href("configurator")}?modele=plissee` },
      { type: "link", label: r.seeProduct, href: href("product", pleated.id) },
      productLink(getProduct("coulissante")!),
    ]);
  }
  if (has(text, k.window)) {
    return reply(r.window, [productLink(getProduct("fenetre")!), productLink(getProduct("fixe")!)], r.windowSuggestions);
  }
  if (has(text, k.bay)) {
    return reply(r.bay, [productLink(getProduct("coulissante")!), productLink(getProduct("plissee")!)]);
  }
  if (has(text, k.door)) {
    return reply(r.door, [page("finder"), { type: "link", label: r.doorModels, href: href("category", "portes-et-baies") }], r.doorSuggestions);
  }

  if (has(text, k.measure)) {
    return reply(r.measure, [page("guide"), page("configurator")]);
  }

  if (has(text, k.price)) {
    return reply(
      fmt(r.price, { min: f.price(Math.min(...products.map(startingPrice))), max: f.price(300) }),
      [page("configurator")],
      r.priceSuggestions,
    );
  }

  if (has(text, k.payment)) {
    const methods = f.list(
      payment.methods.map((method) => `**${m.payment.methods[method]}**`),
      "disjunction",
    );
    return reply(fmt(r.payment, { methods }));
  }

  // Zone de livraison non confirmée par l'entreprise : on ne s'avance pas
  if (has(text, k.delivery) && has(text, k.abroad) && company.deliveryAreaToConfirm) {
    return reply(lang.fallback, [page("contact"), callback]);
  }

  if (has(text, k.leadTime)) {
    const min = Math.min(...products.map((p) => p.leadTimeDays[0]));
    const max = Math.max(...products.map((p) => p.leadTimeDays[1]));
    return reply(fmt(r.leadTime, { min, max, shipping: m.shipping.detail }), [page("configurator")]);
  }

  if (has(text, k.warranty)) {
    if (!claims.warranty.toConfirm) return reply(`${m.claims.warranty.label} : ${m.claims.warranty.detail}`, [page("faq")]);
    return reply(lang.fallback, [page("contact")]);
  }

  if (has(text, [...k.pollen, ...k.pets, ...k.sun, ...k.mesh])) {
    const meshId = has(text, k.pollen) ? "pollen" : has(text, k.pets) ? "pet" : has(text, k.sun) ? "solaire" : null;
    if (meshId) {
      const mesh = m.catalog.meshes[meshId];
      return reply(fmt(r.meshAdvice, { name: mesh.name, description: lowerFirst(mesh.description) }), [
        { type: "link", label: r.configure, href: `${href("configurator")}?toile=${meshId}` },
      ]);
    }
    return reply(fmt(r.meshes, { list: meshes.map((x) => m.catalog.meshes[x.id].name).join(m.common.listSeparator) }), [page("configurator")]);
  }

  if (has(text, k.color)) {
    return reply(
      fmt(r.colors, {
        list: frameColors.map((c) => m.catalog.colors[c.id]).join(m.common.listSeparator),
        surcharge: f.price(frameColors.find((c) => c.id === "ral")!.surcharge),
      }),
      [page("configurator")],
    );
  }

  if (has(text, k.orderTracking)) {
    return reply(r.orders, [page("orders"), page("contact")]);
  }

  const match = faqMatch(text, faq);
  if (match) return reply(match.a, [page("faq")]);

  return reply(lang.fallback, [page("contact"), callback]);
}

function faqMatch(text: string, faq: FaqCategory[]): { q: string; a: string } | null {
  const tokens = new Set(text.split(/\s+/).filter((t) => t.length > 3));
  let best: { score: number; item: { q: string; a: string } } | null = null;
  for (const item of faq.flatMap((c) => c.items)) {
    const qTokens = norm(item.q).split(/\s+/).filter((t) => t.length > 3);
    const score = qTokens.filter((t) => tokens.has(t)).length / Math.max(3, qTokens.length);
    if (!best || score > best.score) best = { score, item };
  }
  return best && best.score >= 0.5 ? best.item : null;
}
