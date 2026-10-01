import type { Locale } from "@/i18n/config";
import { fmt, formatters } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { faqs } from "@/i18n/faq";
import { hrefFor } from "@/i18n/routes";
import { claims, payment } from "../business";
import { frameColors, meshes, productOptions, products } from "../catalog";
import { startingPrice } from "../pricing";

/**
 * Base de connaissances de l'assistant IA : UNIQUEMENT les faits du site,
 * dans la langue du visiteur. Les engagements non confirmés en sont exclus.
 */
export function knowledgeText(locale: Locale): string {
  const m = messages[locale];
  const f = formatters(locale);
  const href = hrefFor(locale);
  const lead = (d: [number, number]) => fmt(m.common.leadTime, { min: d[0], max: d[1] });
  const confirmedClaims = (Object.keys(claims) as Array<keyof typeof claims>).filter((c) => !claims[c].toConfirm).map((c) => m.claims[c]);
  const lines = [
    `COMPANY: Aéris — ${m.meta.description}`,
    `CONFIGURATOR: ${href("configurator")} (sizes in millimetres)`,
    "",
    "MODELS:",
    ...products.map((p) => {
      const t = m.catalog.products[p.id];
      return `- ${t.name} (${href("product", p.id)}) — ${p.openings.map((o) => m.catalog.openings[o].plural).join(", ")}. ${t.lead} ${t.idealFor.join(", ")}. ${t.installation} ${m.common.fromCapital} ${f.price(startingPrice(p))} ${m.common.inclTax}. ${m.common.manufacturing}: ${lead(p.leadTimeDays)}. ${p.limits.width[0]}–${p.limits.width[1]} × ${p.limits.height[0]}–${p.limits.height[1]} mm.`;
    }),
    "",
    `MESHES: ${meshes.map((x) => `${m.catalog.meshes[x.id].name} (${m.catalog.meshes[x.id].description}${x.multiplier > 1 ? ` +${Math.round((x.multiplier - 1) * 100)} %` : ""})`).join("; ")}.`,
    `COLOURS: ${frameColors.map((c) => (c.surcharge ? `${m.catalog.colors[c.id]} (+${f.price(c.surcharge)})` : m.catalog.colors[c.id])).join(", ")}.`,
    `OPTIONS: ${productOptions.map((o) => `${m.catalog.options[o.id].name} (+${f.price(o.price)})`).join(", ")}.`,
    `PRICE: base price + area (m²) × price per m² × mesh coefficient + options. ${m.common.vatIncluded}.`,
    `PAYMENT: ${payment.methods.map((x) => m.payment.methods[x]).join(" / ")} only, after ordering (reference AER-…). Production starts once payment is received. No bank details are entered on the site.`,
    `DELIVERY: ${m.shipping.detail}`,
    `MEASURING GUIDE: ${href("guide")}. QUOTE: ${href("quote")}.`,
    ...confirmedClaims.map((c) => `COMMITMENT: ${c.label} — ${c.detail}`),
    "",
    "FAQ:",
    ...faqs[locale].flatMap((c) => c.items.map((i) => `Q: ${i.q} A: ${i.a}`)),
  ];
  return lines.join("\n");
}
