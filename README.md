# Aéris — Moustiquaires sur mesure

Site e-commerce Next.js : catalogue, fiches produit, configurateur avec prix en temps réel,
panier, commande sans compte, devis, contact et assistant IA.

## Démarrage

Prérequis : Node.js 22.12 ou plus récent.

```bash
npm install
cp .env.example .env.local   # puis ajustez les valeurs
npm run dev                  # http://localhost:3000
```

## Commandes

| Commande            | Rôle                                                   |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Serveur de développement                               |
| `npm run build`     | Build de production                                    |
| `npm start`         | Sert le build de production                            |
| `npm run lint`      | ESLint (règles Next.js, React, accessibilité)          |
| `npm run typecheck` | Vérification TypeScript stricte                        |
| `npm test`          | Tests unitaires (prix, validation, configurateur, IA)  |
| `npm run check`     | Tout ce qui précède, dans l'ordre                      |

## Où modifier quoi

| Besoin                                          | Fichier                              |
| ----------------------------------------------- | ------------------------------------ |
| Coordonnées, engagements, paiement, avis        | `src/lib/business.ts`                |
| Modèles, prix, toiles, coloris, options, délais | `src/lib/catalog.ts`                 |
| Formule de prix                                 | `src/lib/pricing.ts`                 |
| Contrôle des dimensions                         | `src/lib/validation.ts`              |
| FAQ                                             | `src/lib/faq.ts`                     |
| Aide au choix                                   | `src/lib/finder.ts`                  |
| Réponses de l'assistant                         | `src/lib/chat/engine.ts`, `llm.ts`   |
| Couleurs, typographie, mouvement                | `src/app/globals.css`                |

Les engagements marqués `toConfirm: true` dans `business.ts` s'affichent avec un repère ◆
tant que `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`, et sont **masqués** quand il vaut `false`.
Passez-les à `toConfirm: false` une fois validés.

## Mise en production (Vercel recommandé)

1. Importez le dépôt sur Vercel (framework détecté automatiquement).
2. Déclarez les variables de `.env.example` dans *Settings → Environment Variables*,
   au minimum `NEXT_PUBLIC_SITE_URL` et `NEXT_PUBLIC_SHOW_PLACEHOLDERS=false`.
3. En production, les formulaires sont transmis à Formspree (`MAIL_TRANSPORT=formspree`).

Le site ne peut plus être hébergé sur GitHub Pages : l'assistant IA et la validation des
commandes s'exécutent côté serveur pour que les clés API ne soient jamais exposées.

## Ancien site

L'ancienne version statique reste consultable dans l'historique git (commit `bde59c9`) :

```bash
git show bde59c9:index.html
```
