import { basePath } from "./deploy";

/** Adresse d'un média de public/media (le préfixe du site statique n'est pas ajouté automatiquement). */
export const mediaUrl = (file: string) => `${basePath}/media/${file}`;
