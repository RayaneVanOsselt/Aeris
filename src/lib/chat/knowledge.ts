import { claims, company, payment, shipping } from "../business";
import { frameColors, meshes, openings, productOptions, products } from "../catalog";
import { faq } from "../faq";
import { formatLeadTime, formatPrice } from "../format";
import { startingPrice } from "../pricing";

/**
 * Base de connaissances de l'assistant : UNIQUEMENT les faits du site.
 * Les engagements non confirmés par l'entreprise en sont exclus.
 */
export function knowledgeText(): string {
  const confirmedClaims = Object.values(claims).filter((c) => !c.toConfirm);
  const lines = [
    `Entreprise : ${company.name}, moustiquaires sur mesure pour fenêtres, portes et baies vitrées.`,
    "Tout est fabriqué aux dimensions exactes du client, saisies en millimètres dans le configurateur (/configurateur).",
    "",
    "MODÈLES :",
    ...products.map(
      (p) =>
        `- ${p.name} (/produits/${p.slug}) — pour : ${p.openings.map((o) => openings[o].plural.toLowerCase()).join(", ")}. ${p.lead} Idéal pour : ${p.idealFor.join(", ")}. Pose : ${p.installation} Dès ${formatPrice(startingPrice(p))} TTC. Fabrication : ${formatLeadTime(p.leadTimeDays)}. Dimensions : ${p.limits.width[0]}–${p.limits.width[1]} mm de large, ${p.limits.height[0]}–${p.limits.height[1]} mm de haut.`,
    ),
    "",
    `TOILES : ${meshes.map((m) => `${m.name} (${m.description}${m.multiplier > 1 ? ` +${Math.round((m.multiplier - 1) * 100)} % sur la part surface du prix` : " incluse"})`).join(" ; ")}.`,
    `COLORIS : ${frameColors.map((c) => (c.surcharge ? `${c.name} (+${formatPrice(c.surcharge)})` : c.name)).join(", ")}.`,
    `OPTIONS : ${productOptions.map((o) => `${o.name} (+${formatPrice(o.price)})`).join(", ")}.`,
    "PRIX : prix de base du modèle + surface (m²) × prix au m² × coefficient de la toile + options. Prix TTC, TVA 21 % incluse. Le prix exact s'affiche dans le configurateur.",
    `PAIEMENT : ${payment.methods.join(" ou ")} uniquement, après la commande. La fabrication démarre à réception du paiement. Aucune donnée bancaire n'est saisie sur le site.`,
    `LIVRAISON : ${shipping.detail}`,
    "COMMANDE : sans création de compte. Configurateur → panier → coordonnées → instructions de paiement. Une référence AER-… est attribuée.",
    "MESURES : mesurer la largeur en 3 points (haut, milieu, bas) et la hauteur en 3 points (gauche, centre, droite), retenir la plus petite valeur, en millimètres. Guide : /guide-des-mesures.",
    "DEVIS : possible via /devis, notamment pour plusieurs ouvertures, grandes dimensions, formes spéciales ou besoin de pose.",
    ...confirmedClaims.map((c) => `ENGAGEMENT : ${c.label} — ${c.detail}`),
    "",
    "FAQ :",
    ...faq.flatMap((c) => c.items.map((i) => `Q : ${i.q} R : ${i.a}`)),
  ];
  return lines.join("\n");
}

export const pages = {
  configurator: { label: "Ouvrir le configurateur", href: "/configurateur" },
  guide: { label: "Guide des mesures", href: "/guide-des-mesures" },
  catalog: { label: "Voir les modèles", href: "/moustiquaires" },
  finder: { label: "Aide au choix", href: "/moustiquaires#aide-au-choix" },
  faq: { label: "Questions fréquentes", href: "/faq" },
  contact: { label: "Contacter l'équipe", href: "/contact" },
  quote: { label: "Demander un devis", href: "/devis" },
  orders: { label: "Mes commandes", href: "/mes-commandes" },
} as const;
