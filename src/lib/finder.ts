import type { MeshId, Opening, ProductId } from "./catalog";

/**
 * Aide au choix : règles dérivées UNIQUEMENT des descriptions produits
 * existantes (usage, type d'ouverture, pose). Modifiable ici.
 * Les libellés de chaque réponse sont dans messages.finder.
 */
export type FinderOpening = Opening | "special";
export type FinderNeed = "aucun" | "animaux" | "pollen" | "soleil";
export type FinderUsageId = "souvent" | "rarement" | "quotidien" | "jardin" | "porte-fenetre" | "temporaire" | "coulissante" | "plissee" | "hors-normes";

export const finderUsages: Record<FinderOpening, Array<{ id: FinderUsageId; product: ProductId }>> = {
  fenetre: [
    { id: "souvent", product: "fenetre" },
    { id: "rarement", product: "fixe" },
  ],
  porte: [
    { id: "quotidien", product: "enroulable" },
    { id: "jardin", product: "battante" },
    { id: "porte-fenetre", product: "plissee" },
    { id: "temporaire", product: "magnetique" },
  ],
  baie: [
    { id: "coulissante", product: "coulissante" },
    { id: "plissee", product: "plissee" },
  ],
  special: [{ id: "hors-normes", product: "sur-mesure-plus" }],
};

export const finderNeeds: Array<{ id: FinderNeed; mesh: MeshId }> = [
  { id: "aucun", mesh: "fibre" },
  { id: "animaux", mesh: "pet" },
  { id: "pollen", mesh: "pollen" },
  { id: "soleil", mesh: "solaire" },
];
