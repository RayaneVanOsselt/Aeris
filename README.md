# Aéris — Moustiquaires sur mesure

Site en ligne : https://rayanevanosselt.github.io/Aeris/

Ce dépôt contient le site **prêt à l'emploi** (HTML, CSS, JavaScript), servi tel quel par
GitHub Pages : aucune installation ni compilation n'est nécessaire.

## Publication

*Settings → Pages → Build and deployment* :
**Source : Deploy from a branch** · **Branch : main** · **Dossier : / (root)**.

Le fichier `.nojekyll` est indispensable (il permet à GitHub de servir le dossier `_next`).

## Fonctionnement

- Formulaires (commande, devis, contact) : envoyés à Formspree.
- Paiement : Revolut ou virement SEPA, instructions affichées après la commande.
- Assistant : répond dans le navigateur à partir des informations du site.
- Panier et historique des commandes : conservés dans le navigateur du visiteur.

## Modifier le site

Les fichiers de ce dépôt sont générés (minifiés) : ils ne se modifient pas à la main.
Le code source se trouve dans la branche `sources-nextjs`. Pour une modification :

```bash
git checkout sources-nextjs
npm install
npm run build:pages
```

puis remplacer le contenu de `main` par celui du dossier `out/` généré.
