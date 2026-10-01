// Finitions de l'export statique pour GitHub Pages (exécuté après `next build`).
// 1. Anciennes adresses françaises sans préfixe de langue (/moustiquaires/…) → /fr/… :
//    une page de redirection est générée pour chaque page française.
// 2. Anciennes URL .html du tout premier site → pages de redirection vers /fr/….
// 3. .nojekyll : indispensable pour que GitHub Pages serve le dossier _next.
// GitHub Pages ne permet pas de vraies redirections 301 : meta refresh + JavaScript
// (qui conserve les paramètres de l'adresse), page marquée noindex avec canonical.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "out";
const FR = join(OUT, "fr");

const stub = (target) =>
  `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Aéris</title><meta name="robots" content="noindex"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0; url=${target}"><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script></head><body><p><a href="${target}">Continuer vers la nouvelle page</a></p></body></html>`;

/** Dossiers de pages françaises (contenant un index.html), relatifs à out/fr */
const frPages = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) return [];
    const here = existsSync(join(full, "index.html")) ? [relative(FR, full)] : [];
    return [...here, ...frPages(full)];
  });

let pages = 0;
for (const path of frPages(FR)) {
  const dest = join(OUT, path);
  if (existsSync(join(dest, "index.html"))) continue;
  mkdirSync(dest, { recursive: true });
  const depth = path.split("/").length;
  writeFileSync(join(dest, "index.html"), stub(`${"../".repeat(depth)}fr/${path}/`));
  pages++;
}

const legacy = {
  "produits.html": "fr/moustiquaires/",
  "configurateur.html": "fr/configurateur/",
  "savoir-faire.html": "fr/a-propos/",
  "faq.html": "fr/faq/",
  "contact.html": "fr/contact/",
  "panier.html": "fr/panier/",
  "commande.html": "fr/commande/",
  "paiement.html": "fr/mes-commandes/",
  "orders.html": "fr/mes-commandes/",
  "login.html": "fr/mes-commandes/",
  "register.html": "fr/mes-commandes/",
  "profile.html": "fr/mes-commandes/",
  "account.html": "fr/mes-commandes/",
  "forgot-password.html": "fr/mes-commandes/",
};
for (const [file, target] of Object.entries(legacy)) writeFileSync(join(OUT, file), stub(target));
const productSlugs = { fenetre: "moustiquaire-fenetre", fixe: "cadre-fixe", enroul: "porte-enroulable", plissee: "moustiquaire-plissee", porte: "porte-battante", couliss: "baie-coulissante", magnet: "rideau-magnetique", mesure: "sur-mesure-plus" };
writeFileSync(
  join(OUT, "produit.html"),
  stub("fr/moustiquaires/").replace(
    "<script>",
    `<script>var m=${JSON.stringify(productSlugs)};var p=new URLSearchParams(location.search).get("p");if(m[p])location.replace("fr/produits/"+m[p]+"/");else `,
  ),
);
writeFileSync(join(OUT, ".nojekyll"), "");

console.info(`postexport : ${pages} redirections d'anciennes adresses françaises, ${Object.keys(legacy).length} anciennes pages .html.`);
