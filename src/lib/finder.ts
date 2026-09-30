import type { Opening, ProductId } from "./catalog";

/**
 * Aide au choix : règles dérivées UNIQUEMENT des descriptions produits
 * existantes (usage, type d'ouverture, pose). Modifiable ici.
 */
export type FinderOpening = Opening | "special";
export type FinderNeed = "aucun" | "animaux" | "pollen" | "soleil";

export const finderUsages: Record<FinderOpening, Array<{ id: string; label: string; hint: string; product: ProductId }>> = {
  fenetre: [
    { id: "souvent", label: "Je l'ouvre souvent", hint: "Chambre, séjour, cuisine", product: "fenetre" },
    { id: "rarement", label: "Je l'ouvre rarement", hint: "Cave, grenier, buanderie", product: "fixe" },
  ],
  porte: [
    { id: "quotidien", label: "Passage quotidien, toile invisible", hint: "Elle s'enroule dans son coffre", product: "enroulable" },
    { id: "jardin", label: "Allers-retours au jardin", hint: "Elle se referme seule", product: "battante" },
    { id: "porte-fenetre", label: "Porte-fenêtre, sans seuil gênant", hint: "Repli en accordéon", product: "plissee" },
    { id: "temporaire", label: "Solution simple, sans outils", hint: "Saison, location, petit budget", product: "magnetique" },
  ],
  baie: [
    { id: "coulissante", label: "Baie coulissante, grande largeur", hint: "Elle suit votre baie sur un rail", product: "coulissante" },
    { id: "plissee", label: "Repli discret et élégant", hint: "Accordéon, rail bas praticable", product: "plissee" },
  ],
  special: [
    { id: "hors-normes", label: "Très grande, cintrée ou atypique", hint: "Étude personnalisée", product: "sur-mesure-plus" },
  ],
};

export const finderNeeds: Array<{ id: FinderNeed; label: string; mesh: string }> = [
  { id: "aucun", label: "Aucun en particulier", mesh: "fibre" },
  { id: "animaux", label: "Chat ou chien à la maison", mesh: "pet" },
  { id: "pollen", label: "Allergies au pollen", mesh: "pollen" },
  { id: "soleil", label: "Pièce très ensoleillée", mesh: "solaire" },
];
