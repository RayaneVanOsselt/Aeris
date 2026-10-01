# Aéris — Moustiquaires sur mesure

<<<<<<< HEAD
Site e-commerce Next.js en trois langues (français, néerlandais, anglais) : catalogue,
fiches produit, configurateur avec prix en temps réel, panier, commande sans compte, devis,
contact et assistant IA. Fonctionnement multilingue : [docs/I18N.md](docs/I18N.md).
=======
Site en ligne : https://rayanevanosselt.github.io/Aeris/
>>>>>>> 2f584c8ef75544d11991ba213e5a8dda01ac4b07

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

<<<<<<< HEAD
## Commandes

| Commande            | Rôle                                                   |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Serveur de développement                               |
| `npm run build`     | Build de production (hébergement avec serveur)         |
| `npm run build:pages` | Build statique pour GitHub Pages (dossier `out/`)    |
| `npm start`         | Sert le build de production                            |
| `npm run lint`      | ESLint (règles Next.js, React, accessibilité)          |
| `npm run typecheck` | Vérification TypeScript stricte                        |
| `npm test`          | Tests unitaires (prix, validation, configurateur, IA, traductions, adresses) |
| `npm run check`     | Tout ce qui précède, dans l'ordre                      |

## Où modifier quoi

| Besoin                                          | Fichier                              |
| ----------------------------------------------- | ------------------------------------ |
| Coordonnées, engagements (à confirmer), paiement, avis | `src/lib/business.ts`         |
| Modèles, prix, toiles, coloris, options, délais | `src/lib/catalog.ts`                 |
| Textes du site (FR, NL, EN)                     | `src/i18n/messages/*.ts`             |
| Adresses des pages dans chaque langue           | `src/i18n/routes.ts`                 |
| Formule de prix                                 | `src/lib/pricing.ts`                 |
| Contrôle des dimensions                         | `src/lib/validation.ts`              |
| FAQ (FR, NL, EN)                                | `src/i18n/faq/*.ts`                  |
| Aide au choix                                   | `src/lib/finder.ts`                  |
| Réponses de l'assistant (FR, NL, EN)            | `src/lib/chat/lang/*.ts`, `engine.ts`, `llm.ts` |
| Pages (une vue par page, toutes langues)        | `src/views/*.tsx`                    |
| Couleurs, typographie, mouvement                | `src/app/globals.css`                |

Les engagements marqués `toConfirm: true` dans `business.ts` s'affichent avec un repère ◆
tant que `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`, et sont **masqués** quand il vaut `false`.
Passez-les à `toConfirm: false` une fois validés.

## Mise en production

### GitHub Pages (configuration actuelle)

Le workflow `.github/workflows/deploy-pages.yml` contrôle, compile et publie le site
à chaque push sur `main` : https://rayanevanosselt.github.io/Aeris/

À faire **une seule fois** : *Settings → Pages → Build and deployment → Source : GitHub Actions*.

Tester la version statique en local :

```bash
npm run build:pages   # génère le dossier out/ (préfixe /Aeris)
```

Différences avec un hébergement serveur : formulaires envoyés directement à Formspree
depuis le navigateur (mêmes validations), assistant limité au moteur local (pas d'IA
externe), pas d'en-têtes de sécurité personnalisés ni de limite de débit côté serveur.

### Vercel (version complète, si besoin plus tard)

1. Importez le dépôt sur Vercel (framework détecté automatiquement).
2. Déclarez les variables de `.env.example`, au minimum `NEXT_PUBLIC_SITE_URL`
   et `NEXT_PUBLIC_SHOW_PLACEHOLDERS=false`.
3. Les routes API (`src/app/api/*/route.api.ts`), l'assistant IA et les en-têtes
   de sécurité sont alors actifs.

## Ancien site

L'ancienne version statique reste consultable dans l'historique git (commit `bde59c9`) :

```bash
git show bde59c9:index.html
```
=======
puis remplacer le contenu de `main` par celui du dossier `out/` généré.
>>>>>>> 2f584c8ef75544d11991ba213e5a8dda01ac4b07
