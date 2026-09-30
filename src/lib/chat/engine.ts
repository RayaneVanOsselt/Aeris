import { claims, payment, shipping } from "../business";
import { frameColors, getProduct, meshes, products, type Product } from "../catalog";
import { faq } from "../faq";
import { formatLeadTime, formatMm, formatPrice } from "../format";
import { computePrice, startingPrice } from "../pricing";
import { checkDimensions, hasBlockingIssue } from "../validation";
import { pages } from "./knowledge";
import { FALLBACK, type ChatAction, type ChatMessage, type ChatReply } from "./types";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9x ]/g, " ");

const has = (text: string, ...words: string[]) => words.some((w) => new RegExp(`\\b${w}`).test(text));

const productAliases: Record<string, string[]> = {
  fenetre: ["moustiquaire fenetre", "clips", "a clips"],
  fixe: ["cadre fixe", "fixe"],
  enroulable: ["enroulable", "enrouleur", "rouleau", "coffre"],
  plissee: ["plissee", "plisse", "accordeon"],
  battante: ["battante", "pivotante", "charniere"],
  coulissante: ["coulissante", "coulissant"],
  magnetique: ["magnetique", "rideau", "aimant"],
  "sur-mesure-plus": ["sur mesure +", "sur mesure plus", "hors norme", "cintre", "trapeze", "atypique"],
};

function findProduct(text: string): Product | undefined {
  for (const [id, aliases] of Object.entries(productAliases)) {
    if (aliases.some((a) => text.includes(a))) return getProduct(id);
  }
  return undefined;
}

/** Repère des dimensions dans une phrase : « 80x120 cm », « 1000 x 2150 », « 1,2 m sur 2 m ». */
export function parseDimensions(raw: string): { width: number; height: number } | null {
  const text = raw.toLowerCase().replace(/,/g, ".");
  const m = text.match(/(\d+(?:\.\d+)?)\s*(mm|cm|m)?\s*(?:x|×|\*|sur|par)\s*(\d+(?:\.\d+)?)\s*(mm|cm|m)?/);
  if (!m) return null;
  const unit = m[4] ?? m[2];
  const toMm = (v: number) => {
    if (unit === "m" || (!unit && v < 10)) return Math.round(v * 1000);
    if (unit === "cm" || (!unit && v < 300)) return Math.round(v * 10);
    return Math.round(v);
  };
  return { width: toMm(Number(m[1])), height: toMm(Number(m[3])) };
}

const productLinks = (p: Product): ChatAction[] => [
  { type: "link", label: `Configurer : ${p.shortName}`, href: `/configurateur?modele=${p.id}` },
  { type: "link", label: "Voir la fiche", href: `/produits/${p.slug}` },
];

function reply(text: string, actions: ChatAction[] = [], suggestions: string[] = []): ChatReply {
  return { reply: text, actions, suggestions, mode: "local" };
}

function faqMatch(text: string): { q: string; a: string } | null {
  const tokens = new Set(text.split(/\s+/).filter((t) => t.length > 3));
  let best: { score: number; item: { q: string; a: string } } | null = null;
  for (const item of faq.flatMap((c) => c.items)) {
    const qTokens = norm(item.q).split(/\s+/).filter((t) => t.length > 3);
    const score = qTokens.filter((t) => tokens.has(t)).length / Math.max(3, qTokens.length);
    if (!best || score > best.score) best = { score, item };
  }
  return best && best.score >= 0.5 ? best.item : null;
}

/**
 * Moteur de réponse local : déterministe, basé uniquement sur les données du site.
 * Utilisé seul (sans clé IA) ou pour proposer des actions à côté d'une réponse LLM.
 */
export function answer(messages: ChatMessage[]): ChatReply {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const text = norm(last);
  const context = norm(messages.filter((m) => m.role === "user").map((m) => m.content).join(" "));
  const product = findProduct(text) ?? (has(text, "combien", "prix", "tarif", "cout") ? findProduct(context) : undefined);
  const dims = parseDimensions(last);

  if (has(text, "bonjour", "salut", "hello", "bonsoir") && text.split(" ").filter(Boolean).length <= 4) {
    return reply(
      "Bonjour ! Je suis l'assistant Aéris. Je peux vous aider à choisir un modèle, comprendre les mesures ou estimer un prix. Pour quelle ouverture cherchez-vous une moustiquaire ?",
      [],
      ["Une fenêtre", "Une porte-fenêtre", "Une baie coulissante", "Comment mesurer ?"],
    );
  }

  if (has(text, "humain", "conseiller", "rappel", "rappeler", "appeler", "telephone", "devis", "quelqu un")) {
    return reply(
      "Avec plaisir. Laissez-nous vos coordonnées et quelques mots sur votre projet : un membre de l'équipe vous répond personnellement.",
      [{ type: "quote", label: "Être recontacté" }, { type: "link", ...pages.quote }],
    );
  }

  // Estimation chiffrée si un modèle et des dimensions sont donnés
  if (dims && product) {
    const issues = checkDimensions(product, dims.width, dims.height);
    if (hasBlockingIssue(issues)) {
      const issue = issues.find((i) => i.level === "error")!;
      return reply(`${product.name} — ${issue.message}`, [
        { type: "link", label: "Vérifier dans le configurateur", href: `/configurateur?modele=${product.id}` },
        { type: "link", ...pages.guide },
      ]);
    }
    const price = computePrice({ productId: product.id, width: dims.width, height: dims.height, meshId: "fibre", colorId: "blanc", optionIds: [], quantity: 1 });
    return reply(
      `Pour une ${product.name.toLowerCase()} de ${formatMm(dims.width)} × ${formatMm(dims.height)}, en toile fibre de verre et coloris standard : **${formatPrice(price.total)} TTC**. Toile, coloris et options peuvent faire varier ce prix. Fabrication : ${formatLeadTime(product.leadTimeDays)}.`,
      [{ type: "link", label: "Configurer avec ces mesures", href: `/configurateur?modele=${product.id}&largeur=${dims.width}&hauteur=${dims.height}` }],
    );
  }

  if (dims && !product) {
    return reply(
      `Bien noté : ${formatMm(dims.width)} × ${formatMm(dims.height)}. Pour quel modèle souhaitez-vous l'estimation ? Par exemple « moustiquaire fenêtre » ou « plissée ».`,
      [],
      ["Moustiquaire fenêtre", "Plissée", "Enroulable", "Baie coulissante"].map((m) => `${m} ${dims.width}x${dims.height} mm`),
    );
  }

  if (product) {
    return reply(
      `**${product.name}** — ${product.lead} Idéale pour : ${product.idealFor.join(", ").toLowerCase()}. Dès ${formatPrice(startingPrice(product))} TTC, fabrication en ${formatLeadTime(product.leadTimeDays)}.`,
      productLinks(product),
      [`Prix d'une ${product.shortName.toLowerCase()} en 1000x2000 mm ?`, "Quelle toile choisir ?"],
    );
  }

  if (has(text, "porte fenetre", "portefenetre", "porte-fenetre")) {
    const pleated = getProduct("plissee")!;
    return reply(
      "Pour une porte-fenêtre, la **moustiquaire plissée** est souvent le meilleur choix : repli en accordéon et rail bas praticable, sans seuil gênant. Si c'est une baie coulissante de grande largeur, regardez aussi la **baie coulissante**.",
      [...productLinks(pleated), { type: "link", label: "Baie coulissante", href: "/produits/baie-coulissante" }],
    );
  }
  if (has(text, "fenetre", "velux", "lucarne")) {
    return reply(
      "Pour une fenêtre, deux options : la **moustiquaire fenêtre** à clips (sans perçage, démontable) si vous l'ouvrez souvent, ou le **cadre fixe**, plus économique, pour une fenêtre rarement ouverte.",
      [
        { type: "link", label: "Moustiquaire fenêtre", href: "/produits/moustiquaire-fenetre" },
        { type: "link", label: "Cadre fixe", href: "/produits/cadre-fixe" },
      ],
      ["Comment mesurer ma fenêtre ?", "Quel prix pour 800x1200 mm ?"],
    );
  }
  if (has(text, "baie", "coulissant", "veranda")) {
    return reply(
      "Pour une baie vitrée : la **baie coulissante** suit votre baie sur un rail dédié et convient aux grandes largeurs ; la **plissée** se replie en accordéon avec un rail bas praticable.",
      [
        { type: "link", label: "Baie coulissante", href: "/produits/baie-coulissante" },
        { type: "link", label: "Moustiquaire plissée", href: "/produits/moustiquaire-plissee" },
      ],
    );
  }
  if (has(text, "porte", "entree", "jardin", "terrasse")) {
    return reply(
      "Pour une porte, cela dépend de l'usage : **enroulable** (la toile disparaît dans son coffre), **battante** (se referme seule, idéale côté jardin), **plissée** (sans seuil gênant) ou **rideau magnétique** (sans outils, solution simple).",
      [
        { type: "link", ...pages.finder },
        { type: "link", label: "Modèles pour portes", href: "/moustiquaires/portes-et-baies" },
      ],
      ["Passage très fréquent", "Solution temporaire"],
    );
  }

  if (has(text, "mesur", "dimension", "taille", "cote")) {
    return reply(
      "Mesurez l'ouverture en millimètres : la largeur en haut, au milieu et en bas, puis la hauteur à gauche, au centre et à droite. Retenez la plus petite valeur. En cas de doute, envoyez-nous une photo : chaque configuration est vérifiée avant fabrication.",
      [{ type: "link", ...pages.guide }, { type: "link", ...pages.configurator }],
    );
  }

  if (has(text, "prix", "tarif", "cout", "combien", "cher")) {
    return reply(
      `Le prix dépend du modèle, de vos dimensions, de la toile et des options. À titre indicatif : de ${formatPrice(Math.min(...products.map(startingPrice)))} (rideau magnétique, petites dimensions) à plus de ${formatPrice(300)} pour les grandes baies. Donnez-moi un modèle et des dimensions (ex. « plissée 1000x2150 mm ») et je vous calcule le prix exact.`,
      [{ type: "link", ...pages.configurator }],
      ["Moustiquaire fenêtre 800x1200 mm", "Plissée 1000x2150 mm"],
    );
  }

  if (has(text, "paie", "payer", "paiement", "virement", "revolut", "carte", "bancontact", "paypal")) {
    return reply(
      `Le paiement se fait par **${payment.methods.join("** ou **")}**, après la commande : vous recevez les instructions avec votre référence. Aucune donnée bancaire n'est saisie sur le site. La fabrication démarre à réception du paiement.`,
      [],
    );
  }

  if (has(text, "delai", "livr", "quand", "combien de temps", "expedi")) {
    const min = Math.min(...products.map((p) => p.leadTimeDays[0]));
    const max = Math.max(...products.map((p) => p.leadTimeDays[1]));
    return reply(
      `La fabrication prend de ${min} à ${max} jours ouvrés selon le modèle (le délai exact s'affiche dans le configurateur), à partir de la réception du paiement. ${shipping.detail}`,
      [{ type: "link", ...pages.configurator }],
    );
  }

  if (has(text, "garantie", "garanti")) {
    if (!claims.warranty.toConfirm) return reply(`${claims.warranty.label} : ${claims.warranty.detail}`, [{ type: "link", ...pages.faq }]);
    return reply(FALLBACK, [{ type: "link", ...pages.contact }]);
  }

  if (has(text, "pollen", "allerg", "chat", "chien", "animal", "griff", "soleil", "toile")) {
    const mesh = has(text, "pollen", "allerg") ? "pollen" : has(text, "chat", "chien", "animal", "griff") ? "pet" : has(text, "soleil") ? "solaire" : null;
    const m = meshes.find((x) => x.id === mesh);
    if (m) return reply(`Je vous conseille la toile **${m.name}** : ${m.description.charAt(0).toLowerCase()}${m.description.slice(1)} Elle se choisit à l'étape « Toile & coloris » du configurateur.`, [{ type: "link", label: "Configurer", href: `/configurateur?toile=${m.id}` }]);
    return reply(`Cinq toiles sont proposées : ${meshes.map((x) => x.name).join(", ")}. La fibre de verre est la standard ; les autres répondent à un besoin précis (robustesse, pollen, animaux, soleil).`, [{ type: "link", ...pages.configurator }]);
  }

  if (has(text, "couleur", "coloris", "ral", "blanc", "anthracite", "noir")) {
    return reply(`Coloris disponibles : ${frameColors.map((c) => c.name).join(", ")}. Le RAL sur mesure permet d'assortir la moustiquaire à vos menuiseries (supplément de ${formatPrice(frameColors.find((c) => c.id === "ral")!.surcharge)}).`, [{ type: "link", ...pages.configurator }]);
  }

  if (has(text, "suivi", "ma commande", "reference", "aer ")) {
    return reply("Vos commandes passées depuis cet appareil sont dans « Mes commandes ». Pour toute question sur une commande, contactez-nous avec votre référence AER-….", [{ type: "link", ...pages.orders }, { type: "link", ...pages.contact }]);
  }

  const match = faqMatch(text);
  if (match) return reply(match.a, [{ type: "link", ...pages.faq }]);

  return reply(FALLBACK, [{ type: "link", ...pages.contact }, { type: "quote", label: "Être recontacté" }]);
}
