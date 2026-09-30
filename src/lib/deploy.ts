/**
 * Cible de déploiement, fixée au moment du build.
 * - « server » (défaut, Vercel/Node) : routes API, IA, en-têtes de sécurité.
 * - « github-pages » : site statique ; formulaires envoyés directement à
 *   Formspree, assistant exécuté dans le navigateur (moteur local).
 */
export const isStaticSite = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
