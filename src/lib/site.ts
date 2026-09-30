export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages" ? "https://rayanevanosselt.github.io/Aeris" : undefined) ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export type NavLink = { href: string; label: string };

export const primaryNav: NavLink[] = [
  { href: "/guide-des-mesures", label: "Guide des mesures" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Moustiquaires",
    links: [
      { href: "/moustiquaires/fenetres", label: "Pour fenêtres" },
      { href: "/moustiquaires/portes-et-baies", label: "Pour portes & baies" },
      { href: "/moustiquaires", label: "Tous les modèles" },
      { href: "/moustiquaires#comparer", label: "Comparer les modèles" },
      { href: "/configurateur", label: "Configurateur" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/guide-des-mesures", label: "Guide des mesures" },
      { href: "/faq", label: "Questions fréquentes" },
      { href: "/devis", label: "Demander un devis" },
      { href: "/mes-commandes", label: "Suivre ma commande" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Aéris",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/#comment-ca-marche", label: "Comment ça marche" },
    ],
  },
  {
    title: "Informations légales",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/conditions-generales-de-vente", label: "Conditions générales de vente" },
      { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
      { href: "/politique-cookies", label: "Politique cookies" },
    ],
  },
];
