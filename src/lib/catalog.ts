/**
 * Catalogue Aéris — modèles, toiles, coloris, options (données techniques).
 * Prix, délais et limites repris À L'IDENTIQUE de l'ancien configurateur :
 * ils doivent être validés par l'entreprise (voir rapport).
 * Les textes (noms, descriptions…) sont dans les dictionnaires : src/i18n/messages.
 */

export type Opening = "fenetre" | "porte" | "baie";

export type ProductId = "fenetre" | "fixe" | "enroulable" | "plissee" | "battante" | "coulissante" | "magnetique" | "sur-mesure-plus";
export type MeshId = "fibre" | "alu" | "pollen" | "pet" | "solaire";
export type ColorId = "blanc" | "anthracite" | "brun" | "sable" | "noir" | "ral";
export type OptionId = "poignee" | "brosse" | "fixation" | "renfort";
export type CategoryId = "fenetres" | "portes-et-baies";

/** Forme d'illustration utilisée par <ProductVisual /> */
export type VisualKind = "frame" | "fixed" | "roller" | "pleated" | "hinged" | "sliding" | "magnetic" | "custom";

export type Product = {
  id: ProductId;
  openings: Opening[];
  visual: VisualKind;
  /** Tarification (ancien configurateur) */
  pricing: { base: number; perM2: number };
  /** Délai de fabrication en jours ouvrés (ancien configurateur) */
  leadTimeDays: [number, number];
  /** Limites de dimensions en mm (ancien configurateur, identiques pour tous les modèles) */
  limits: { width: [number, number]; height: [number, number] };
  /** Plages habituelles : sert uniquement à AVERTIR d'une saisie suspecte, jamais à bloquer */
  typical: { width: [number, number]; height: [number, number] };
  defaultSize: { width: number; height: number };
};

const LIMITS = { width: [200, 2400], height: [200, 2600] } as { width: [number, number]; height: [number, number] };
const WINDOW_TYPICAL = { width: [300, 1800], height: [300, 2000] } as { width: [number, number]; height: [number, number] };
const DOOR_TYPICAL = { width: [600, 1400], height: [1800, 2600] } as { width: [number, number]; height: [number, number] };
const BAY_TYPICAL = { width: [1000, 2400], height: [1800, 2600] } as { width: [number, number]; height: [number, number] };

export const products: Product[] = [
  {
    id: "fenetre",
    openings: ["fenetre"],
    visual: "frame",
    pricing: { base: 69, perM2: 48 },
    leadTimeDays: [10, 15],
    limits: LIMITS,
    typical: WINDOW_TYPICAL,
    defaultSize: { width: 800, height: 1200 },
  },
  {
    id: "fixe",
    openings: ["fenetre"],
    visual: "fixed",
    pricing: { base: 59, perM2: 42 },
    leadTimeDays: [7, 12],
    limits: LIMITS,
    typical: WINDOW_TYPICAL,
    defaultSize: { width: 800, height: 1000 },
  },
  {
    id: "enroulable",
    openings: ["porte"],
    visual: "roller",
    pricing: { base: 149, perM2: 62 },
    leadTimeDays: [12, 18],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 900, height: 2100 },
  },
  {
    id: "plissee",
    openings: ["porte", "baie"],
    visual: "pleated",
    pricing: { base: 189, perM2: 78 },
    leadTimeDays: [14, 21],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 1000, height: 2150 },
  },
  {
    id: "battante",
    openings: ["porte"],
    visual: "hinged",
    pricing: { base: 159, perM2: 58 },
    leadTimeDays: [12, 18],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 900, height: 2100 },
  },
  {
    id: "coulissante",
    openings: ["baie"],
    visual: "sliding",
    pricing: { base: 199, perM2: 66 },
    leadTimeDays: [14, 21],
    limits: LIMITS,
    typical: BAY_TYPICAL,
    defaultSize: { width: 1800, height: 2150 },
  },
  {
    id: "magnetique",
    openings: ["porte"],
    visual: "magnetic",
    pricing: { base: 39, perM2: 30 },
    leadTimeDays: [5, 9],
    limits: LIMITS,
    typical: DOOR_TYPICAL,
    defaultSize: { width: 900, height: 2100 },
  },
  {
    id: "sur-mesure-plus",
    openings: ["fenetre", "porte", "baie"],
    visual: "custom",
    pricing: { base: 229, perM2: 88 },
    leadTimeDays: [18, 25],
    limits: LIMITS,
    typical: BAY_TYPICAL,
    defaultSize: { width: 1600, height: 2200 },
  },
];

export type Mesh = { id: MeshId; multiplier: number; density: number; strand: number };

/** Toiles (ancien configurateur). `density`/`strand` servent uniquement au rendu visuel de la trame. */
export const meshes: Mesh[] = [
  { id: "fibre", multiplier: 1, density: 9, strand: 0.9 },
  { id: "alu", multiplier: 1.35, density: 10, strand: 1.1 },
  { id: "pollen", multiplier: 1.55, density: 16, strand: 0.8 },
  { id: "pet", multiplier: 1.8, density: 7, strand: 1.8 },
  { id: "solaire", multiplier: 1.65, density: 13, strand: 1.5 },
];

export type FrameColor = { id: ColorId; hex: string; surcharge: number };

export const frameColors: FrameColor[] = [
  { id: "blanc", hex: "#EDEAE3", surcharge: 0 },
  { id: "anthracite", hex: "#383C42", surcharge: 0 },
  { id: "brun", hex: "#5A4632", surcharge: 0 },
  { id: "sable", hex: "#C9B896", surcharge: 0 },
  { id: "noir", hex: "#1C1C1E", surcharge: 0 },
  { id: "ral", hex: "#7A8FB0", surcharge: 25 },
];

export type ProductOption = { id: OptionId; price: number };

export const productOptions: ProductOption[] = [
  { id: "poignee", price: 19 },
  { id: "brosse", price: 12 },
  { id: "fixation", price: 24 },
  { id: "renfort", price: 35 },
];

export type Category = { id: CategoryId; openings: Opening[] };

export const categories: Category[] = [
  { id: "fenetres", openings: ["fenetre"] },
  { id: "portes-et-baies", openings: ["porte", "baie"] },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
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
