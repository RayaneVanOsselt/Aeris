import { basePath } from "./deploy";

/** Adresse d'un média de public/media (le préfixe du site statique n'est pas ajouté automatiquement). */
export const mediaUrl = (file: string) => `${basePath}/media/${file}`;

/**
 * Faut-il s'en tenir aux images fixes ? Oui si l'utilisateur demande moins
 * d'animations ou active l'économiseur de données : la vidéo n'est alors
 * jamais téléchargée.
 */
export function prefersStill(): boolean {
  if (typeof window === "undefined") return true;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
