// Finitions de l'export statique pour GitHub Pages (exécuté après `next build`).
// 1. Images de partage : GitHub Pages déduit le type MIME de l'extension → ajout de « .png ».
// 2. Anciennes URL .html de l'ancien site → pages de redirection vers les nouvelles routes.
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

let images = 0;
for (const file of walk(OUT)) {
  if (!file.endsWith("/opengraph-image")) continue;
  renameSync(file, `${file}.png`);
  images++;
}

let pages = 0;
for (const file of walk(OUT).filter((f) => /\.(html|txt|json)$/.test(f))) {
  const src = readFileSync(file, "utf8");
  const next = src.replace(/\/opengraph-image(?=[?"\\\s<])/g, "/opengraph-image.png");
  if (next === src) continue;
  writeFileSync(file, next);
  pages++;
}

const legacy = {
  "produits.html": "moustiquaires/",
  "configurateur.html": "configurateur/",
  "savoir-faire.html": "a-propos/",
  "faq.html": "faq/",
  "contact.html": "contact/",
  "panier.html": "panier/",
  "commande.html": "commande/",
  "paiement.html": "mes-commandes/",
  "orders.html": "mes-commandes/",
  "login.html": "mes-commandes/",
  "register.html": "mes-commandes/",
  "profile.html": "mes-commandes/",
  "account.html": "mes-commandes/",
  "forgot-password.html": "mes-commandes/",
};
const productSlugs = { fenetre: "moustiquaire-fenetre", fixe: "cadre-fixe", enroul: "porte-enroulable", plissee: "moustiquaire-plissee", porte: "porte-battante", couliss: "baie-coulissante", magnet: "rideau-magnetique", mesure: "sur-mesure-plus" };
const stub = (target, script = "") =>
  `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Aéris</title><meta name="robots" content="noindex"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0; url=${target}">${script}</head><body><p><a href="${target}">Continuer vers la nouvelle page</a></p></body></html>`;
for (const [file, target] of Object.entries(legacy)) writeFileSync(join(OUT, file), stub(target));
writeFileSync(
  join(OUT, "produit.html"),
  stub("moustiquaires/", `<script>var m=${JSON.stringify(productSlugs)};var p=new URLSearchParams(location.search).get("p");if(m[p])location.replace("produits/"+m[p]+"/");</script>`),
);
writeFileSync(join(OUT, ".nojekyll"), "");

console.info(`postexport : ${images} images de partage, ${pages} fichiers mis à jour, ${Object.keys(legacy).length + 1} redirections d'anciennes URL.`);
