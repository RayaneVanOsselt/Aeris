/**
 * Catalogue Aéris — modèles, toiles, coloris, options.
 * Prix, délais et limites repris À L'IDENTIQUE de l'ancien configurateur :
 * ils doivent être validés par l'entreprise (voir rapport).
 */

export type Opening = "fenetre" | "porte" | "baie";

export type ProductId =
  | "fenetre"
  | "fixe"
  | "enroulable"
  | "plissee"
  | "battante"
  | "coulissante"
  | "magnetique"
  | "sur-mesure-plus";

/** Forme d'illustration utilisée par <ProductVisual /> */
export type VisualKind = "frame" | "fixed" | "roller" | "pleated" | "hinged" | "sliding" | "magnetic" | "custom";

export type Product = {
  id: ProductId;
  slug: string;
  name: string;
  shortName: string;
  openings: Opening[];
  visual: VisualKind;
  tagline: string;
  lead: string;
  description: string;
  idealFor: string[];
  highlights: string[];
  installation: string;
  /** Tarification (ancien configurateur) */
  pricing: { base: number; perM2: number };
  /** Délai de fabrication en jours ouvrés (ancien configurateur) */
  leadTimeDays: [number, number];
  /** Limites de dimensions en mm (ancien configurateur, identiques pour tous les modèles) */
  limits: { width: [number, number]; height: [number, number] };
  /** Plages habituelles : sert uniquement à AVERTIR d'une saisie suspecte, jamais à bloquer */
  typical: { width: [number, number]; height: [number, number] };
  defaultSize: { width: number; height: number };
  badge?: string;
};

const LIMITS = { width: [200, 2400], height: [200, 2600] } as { width: [number, number]; height: [number, number] };
const WINDOW_TYPICAL = { width: [300, 1800], height: [300, 2000] } as { width: [number, number]; height: [number, number] };
const DOOR_TYPICAL = { width: [600, 1400], height: [1800, 2600] } as { width: [number, number]; height: [number, number] };
const BAY_TYPICAL = { width: [1000, 2400], height: [1800, 2600] } as { width: [number, number]; height: [number, number] };

export const products: Product[] = [
  {
    id: "fenetre",
    slug: "moustiquaire-fenetre",
    name: "Moustiquaire fenêtre",
    shortName: "Fenêtre",
    openings: ["fenetre"],
    visual: "frame",
    tagline: "Cadre alu fin, pose sans perçage.",
    lead: "Notre modèle de référence : un cadre aluminium fin qui se pose sans perçage sur la plupart des fenêtres.",
    description:
      "La moustiquaire fenêtre associe un profilé aluminium discret à une toile haute visibilité. Pensée pour se faire oublier une fois posée, elle protège sans assombrir la pièce. Fixation par clips, sans perçage, et démontable pour le nettoyage.",
    idealFor: ["Chambres et pièces de vie", "Fenêtres ouvertes régulièrement", "Locataires : pose sans perçage"],
    highlights: ["Pose par clips, sans perçage", "Démontable pour l'entretien", "Profilé aluminium discret"],
    installation: "Fixation par clips, sans perçage.",
    pricing: { base: 69, perM2: 48 },
    leadTimeDays: [10, 15],
    limits: LIMITS,
    typical: WINDOW_TYPICAL,
    defaultSize: { width: 800, height: 1200 },
    badge: "Le plus choisi",
  },
  {
    id: "fixe",
    slug: "cadre-fixe",
    name: "Cadre fixe",
    shortName: "Cadre fixe",
    openings: ["fenetre"],
    visual: "fixed",
    tagline: "La solution permanente la plus économique.",
    lead: "Un cadre sur mesure tendu d'une toile résistante, idéal pour les fenêtres que l'on ouvre rarement.",
    description:
      "Le cadre fixe est la solution la plus simple et la plus abordable : un cadre sur mesure tendu d'une toile résistante. Robuste et discret, il convient parfaitement aux fenêtres peu manipulées, caves, greniers ou pièces techniques.",
    idealFor: ["Fenêtres rarement ouvertes", "Caves, greniers, buanderies", "Petit budget"],
    highlights: ["Le prix le plus doux de la gamme", "Construction simple et robuste", "Délai de fabrication court"],
    installation: "Cadre fixe posé sur l'ouverture.",
    pricing: { base: 59, perM2: 42 },
    leadTimeDays: [7, 12],
    limits: LIMITS,
    typical: WINDOW_TYPICAL,
    defaultSize: { width: 800, height: 1000 },
  },
  {
    id: "enroulable",
    slug: "porte-enroulable",
    name: "Porte enroulable",
    shortName: "Enroulable",
    openings: ["porte"],
    visual: "roller",
    tagline: "La toile s'enroule toute seule dans son coffre.",
    lead: "Rappel automatique de la toile dans un coffre compact : parfaite pour un passage quotidien.",
    description:
      "La porte enroulable enroule automatiquement sa toile dans un coffre compact. Idéale pour les portes très utilisées, elle reste discrète et ne gêne jamais le passage.",
    idealFor: ["Portes d'entrée et de jardin", "Passages fréquents", "Intérieurs épurés : la toile disparaît"],
    highlights: ["Rappel automatique de la toile", "Coffre compact", "Passage libre une fois enroulée"],
    installation: "Coffre et coulisses fixés sur le cadre de porte.",
    pricing: { base: 149, perM2: 62 },
    leadTimeDays: [12, 18],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 900, height: 2100 },
  },
  {
    id: "plissee",
    slug: "moustiquaire-plissee",
    name: "Moustiquaire plissée",
    shortName: "Plissée",
    openings: ["porte", "baie"],
    visual: "pleated",
    tagline: "Repli en accordéon, rail bas praticable.",
    lead: "Toile plissée en accordéon, fluide et silencieuse : notre modèle le plus raffiné pour portes-fenêtres et baies.",
    description:
      "La moustiquaire plissée se replie en accordéon le long d'un rail bas praticable. Élégante et silencieuse, c'est notre modèle le plus premium pour les portes-fenêtres et les baies vitrées.",
    idealFor: ["Portes-fenêtres", "Baies vitrées", "Passage fréquent sans seuil gênant"],
    highlights: ["Repli en accordéon", "Rail bas praticable", "Manœuvre douce et silencieuse"],
    installation: "Rail haut et rail bas praticable fixés dans l'ouverture.",
    pricing: { base: 189, perM2: 78 },
    leadTimeDays: [14, 21],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 1000, height: 2150 },
    badge: "Premium",
  },
  {
    id: "battante",
    slug: "porte-battante",
    name: "Porte battante",
    shortName: "Battante",
    openings: ["porte"],
    visual: "hinged",
    tagline: "S'ouvre comme une porte, se referme seule.",
    lead: "Ouverture pivotante avec fermeture aimantée : elle se referme seule derrière vous.",
    description:
      "La porte battante s'ouvre comme une vraie porte et se referme grâce à ses aimants. Cadre robuste, charnières réglables : idéale pour les accès jardin et terrasse.",
    idealFor: ["Accès jardin et terrasse", "Allers-retours fréquents", "Foyers avec enfants"],
    highlights: ["Fermeture aimantée", "Charnières réglables", "Cadre robuste"],
    installation: "Cadre fixé sur le dormant, porte sur charnières réglables.",
    pricing: { base: 159, perM2: 58 },
    leadTimeDays: [12, 18],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 900, height: 2100 },
  },
  {
    id: "coulissante",
    slug: "baie-coulissante",
    name: "Baie coulissante",
    shortName: "Coulissante",
    openings: ["baie"],
    visual: "sliding",
    tagline: "Pour les grandes largeurs, glissement silencieux.",
    lead: "Conçue pour les grandes ouvertures : elle suit votre baie vitrée sur un rail dédié.",
    description:
      "La moustiquaire coulissante suit votre baie vitrée sur un rail dédié. Pensée pour les grandes ouvertures, elle glisse sans effort et accompagne un usage intensif.",
    idealFor: ["Baies vitrées coulissantes", "Grandes largeurs", "Usage intensif en été"],
    highlights: ["Rail dédié", "Glissement silencieux", "Grandes largeurs"],
    installation: "Rails haut et bas fixés sur le cadre de la baie.",
    pricing: { base: 199, perM2: 66 },
    leadTimeDays: [14, 21],
    limits: LIMITS,
    typical: BAY_TYPICAL,
    defaultSize: { width: 1800, height: 2150 },
    badge: "Nouveau",
  },
  {
    id: "magnetique",
    slug: "rideau-magnetique",
    name: "Rideau magnétique",
    shortName: "Magnétique",
    openings: ["porte"],
    visual: "magnetic",
    tagline: "Installation express, sans outils.",
    lead: "Deux pans qui se referment d'eux-mêmes après votre passage : la solution d'appoint la plus accessible.",
    description:
      "Le rideau magnétique se fixe en quelques minutes, sans outils. Ses deux pans se referment automatiquement après votre passage grâce à une fermeture aimantée centrale.",
    idealFor: ["Solution temporaire ou saisonnière", "Locations", "Petit budget"],
    highlights: ["Sans outils", "Fermeture aimantée centrale", "Mains libres au passage"],
    installation: "Installation sans outils.",
    pricing: { base: 39, perM2: 30 },
    leadTimeDays: [5, 9],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 900, height: 2100 },
  },
  {
    id: "sur-mesure-plus",
    slug: "sur-mesure-plus",
    name: "Sur mesure +",
    shortName: "Sur mesure +",
    openings: ["fenetre", "porte", "baie"],
    visual: "custom",
    tagline: "Configurations spéciales et très grandes dimensions.",
    lead: "Pour les cas particuliers : très grandes dimensions, formes atypiques, coloris RAL spécifiques.",
    description:
      "Notre service Sur mesure + prend en charge les cas particuliers : très grandes dimensions, formes atypiques, coloris RAL spécifiques et contraintes de pose. Chaque projet fait l'objet d'une étude personnalisée.",
    idealFor: ["Ouvertures hors normes", "Formes atypiques", "Projets d'architecte"],
    highlights: ["Étude personnalisée", "Coloris RAL", "Contraintes de pose particulières"],
    installation: "Définie avec vous lors de l'étude.",
    pricing: { base: 229, perM2: 88 },
    leadTimeDays: [18, 25],
    limits: LIMITS,
    typical: BAY_TYPICAL,
    defaultSize: { width: 1600, height: 2200 },
  },
];

export type Mesh = { id: string; name: string; multiplier: number; description: string; density: number; strand: number };

/** Toiles (ancien configurateur). `density`/`strand` servent uniquement au rendu visuel de la trame. */
export const meshes: Mesh[] = [
  { id: "fibre", name: "Fibre de verre", multiplier: 1, description: "La toile standard : légère, discrète et polyvalente.", density: 9, strand: 0.9 },
  { id: "alu", name: "Aluminium", multiplier: 1.35, description: "Une toile métallique plus rigide, pour une tenue durable.", density: 10, strand: 1.1 },
  { id: "pollen", name: "Anti-pollen", multiplier: 1.55, description: "Une maille plus fine, pensée pour limiter le passage des pollens.", density: 16, strand: 0.8 },
  { id: "pet", name: "Anti-griffe (Pet)", multiplier: 1.8, description: "Une toile renforcée, conçue pour les foyers avec chats et chiens.", density: 7, strand: 1.8 },
  { id: "solaire", name: "Solaire occultante", multiplier: 1.65, description: "Une toile plus dense qui filtre aussi une partie de la lumière.", density: 13, strand: 1.5 },
];

export type FrameColor = { id: string; name: string; hex: string; surcharge: number };

export const frameColors: FrameColor[] = [
  { id: "blanc", name: "Blanc", hex: "#EDEAE3", surcharge: 0 },
  { id: "anthracite", name: "Anthracite", hex: "#383C42", surcharge: 0 },
  { id: "brun", name: "Brun", hex: "#5A4632", surcharge: 0 },
  { id: "sable", name: "Sable", hex: "#C9B896", surcharge: 0 },
  { id: "noir", name: "Noir mat", hex: "#1C1C1E", surcharge: 0 },
  { id: "ral", name: "RAL sur mesure", hex: "#7A8FB0", surcharge: 25 },
];

export type ProductOption = { id: string; name: string; price: number; description: string };

export const productOptions: ProductOption[] = [
  { id: "poignee", name: "Poignée premium", price: 19, description: "Une prise en main plus confortable au quotidien." },
  { id: "brosse", name: "Brosse anti-poussière", price: 12, description: "Joint brosse qui ferme les interstices." },
  { id: "fixation", name: "Kit de fixation sans perçage", price: 24, description: "Pour poser sans abîmer vos menuiseries." },
  { id: "renfort", name: "Cadre renforcé", price: 35, description: "Profilé plus robuste pour les grandes dimensions." },
];

export const openings: Record<Opening, { label: string; plural: string; description: string }> = {
  fenetre: { label: "Fenêtre", plural: "Fenêtres", description: "Battantes, oscillo-battantes, fenêtres de toit…" },
  porte: { label: "Porte", plural: "Portes", description: "Portes d'entrée, de jardin, portes-fenêtres" },
  baie: { label: "Baie vitrée", plural: "Baies vitrées", description: "Baies coulissantes et grandes ouvertures" },
};

export type Category = { slug: string; name: string; title: string; intro: string; openings: Opening[] };

export const categories: Category[] = [
  {
    slug: "fenetres",
    name: "Fenêtres",
    title: "Moustiquaires pour fenêtres",
    intro:
      "Cadre à clips sans perçage ou cadre fixe économique : des moustiquaires fabriquées à vos dimensions pour dormir fenêtre ouverte.",
    openings: ["fenetre"],
  },
  {
    slug: "portes-et-baies",
    name: "Portes & baies",
    title: "Moustiquaires pour portes et baies vitrées",
    intro:
      "Enroulable, plissée, battante, coulissante ou magnétique : la bonne solution selon votre passage, votre seuil et la largeur de l'ouverture.",
    openings: ["porte", "baie"],
  },
];

export function getProduct(idOrSlug: string): Product | undefined {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsForOpenings(list: Opening[]): Product[] {
  return products.filter((p) => p.openings.some((o) => list.includes(o)));
}

export function getMesh(id: string): Mesh | undefined {
  return meshes.find((m) => m.id === id);
}

export function getColor(id: string): FrameColor | undefined {
  return frameColors.find((c) => c.id === id);
}

export function getOption(id: string): ProductOption | undefined {
  return productOptions.find((o) => o.id === id);
}
