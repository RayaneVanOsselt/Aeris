# AUDIT — Phase 0 · Aéris, moustiquaires sur mesure

| | |
| --- | --- |
| Date | 1er octobre 2026 |
| Site audité | https://rayanevanosselt.github.io/Aeris/ (version en ligne) |
| Code source audité | branche locale `sources-nextjs`, commit `5b556d9` |
| Branche de travail | `claude/refonte-premium-moustiquaires-461d87` |
| Statut | **En attente de votre validation.** Aucune modification du site n'a été faite. |

---

## 0. Synthèse

Le socle technique est sain. Next.js 16, TypeScript strict, aucune vulnérabilité connue, 30 tests au vert, Lighthouse à 99-100 sur 6 des 7 pages mesurées et 100 en accessibilité partout. La refonte précédente a aussi retiré les faux avis et les faux chiffres. Le site n'est pas pour autant prêt à vendre, et il n'est pas encore « premium ».

**Quatre points bloquants**, à traiter avant tout travail de design :

1. **Le code source n'existe que sur cet ordinateur.** La branche `sources-nextjs` n'a jamais été envoyée sur GitHub. `main` ne contient que le site compilé et minifié. Si le disque est perdu, tout le code source l'est aussi.
2. **Le site prend des commandes sans base légale.** Les CGV, les mentions légales et la politique de confidentialité affichent « À compléter » en production. Aucune identité d'entreprise n'est publiée (raison sociale, BCE/TVA, adresse, e-mail, téléphone). Les frais de livraison ne sont pas connus au moment de la commande.
3. **Rien n'est contrôlé côté serveur en production.** Sur GitHub Pages, la validation et le calcul du prix se font dans le navigateur, puis la commande part par e-mail via Formspree. Le total reçu par e-mail peut donc être falsifié. Aucune commande n'est enregistrée ailleurs que dans votre boîte mail.
4. **Le paiement ne convient pas au marché belge.** Seuls Revolut et le virement sont proposés : ni Bancontact, ni carte, ni Apple Pay. Le site affirme aussi que « les instructions de paiement vous ont été envoyées par e-mail », alors qu'aucun e-mail n'est envoyé au client par le code.

**Ce qui manque pour atteindre le niveau premium visé** : aucune photo réelle (0 image sur tout le site, uniquement des illustrations SVG), aucun avis, aucun moyen de contact direct (ni téléphone, ni e-mail, ni WhatsApp), aucune mesure d'audience, et donc aucun point de départ pour mesurer la hausse de conversion. Il manque aussi la version néerlandaise, un service de pose (à préciser), des pages locales et un blog.

---

## 1. Contexte détecté (complète les `[…]` du cahier des charges)

| Champ du cahier | Valeur détectée dans le code / le site | Source | À confirmer |
| --- | --- | --- | --- |
| Marque | **Aéris** | `src/lib/business.ts` | — |
| Activité | Vente en ligne avec configurateur et prix immédiat, plus devis. **Aucun service de pose** mentionné : le client pose lui-même, avec la notice. | site | ❓ Proposez-vous la pose ? |
| Types | 8 modèles : fenêtre à clips, cadre fixe, porte enroulable, plissée, porte battante, baie coulissante, rideau magnétique, « Sur mesure + » | `catalog.ts` | ❓ Gamme réelle et fournisseurs |
| Zone | Belgique (fr-BE, TVA 21 %, IBAN belge). Livraison « Belgique et UE » annoncée par l'ancien site, **masquée** car non confirmée. | `business.ts` | ❓ |
| Langues | **FR uniquement** | `layout.tsx` (`lang="fr-BE"`) | ❓ NL ? EN ? |
| Stack | Next.js 16.3.8 (App Router), React 19.3, TypeScript 6, Tailwind CSS 4, Zod 4, Vitest 5 | `package.json` | — |
| Hébergement | GitHub Pages, sous-dossier `/Aeris`, sans nom de domaine propre | README, en-têtes HTTP | ❓ Domaine acheté ? |
| Charte | Design system « Plan & Lumière » : papier `#F6F4EE`, encre bleu nuit `#0A1631`, sable `#C8A57A`/`#7C5D3A`, azur `#3563E9`, polices Geist, Geist Mono et Fraunces italique | `globals.css` | ❓ Logo définitif ? |
| Paiement | Revolut (lien `revolut.me` personnel) et virement SEPA. Aucun prestataire de paiement en ligne. | `business.ts` | ❓ Compte professionnel ? |
| Concurrents | Non fournis : analyse rapide faite sur les acteurs visibles en Belgique (§ 10) | — | ❓ Vos URLs |

---

## 2. Cartographie

### 2.1 Dépôt et branches

| Branche | Contenu | Sur GitHub ? |
| --- | --- | --- |
| `main` | **Site compilé uniquement** (HTML, CSS, JS minifiés, `_next/`). Servi tel quel par GitHub Pages en mode « Deploy from a branch ». | ✅ |
| `sources-nextjs` | **Code source complet** (137 fichiers, environ 9 800 lignes), y compris la documentation de la refonte précédente (`docs/RAPPORT-REFONTE.md`) | ❌ **local uniquement** |
| `claude/aeris-moustiquaire-redesign-0935ee` | Ancienne branche de travail, déjà fusionnée (PR n° 4) | ✅ |
| `claude/refonte-premium-moustiquaires-461d87` | Branche de ce chantier, basée sur `main` (le site compilé) | ❌ local |

**Constats**
- Le flux de mise en ligne est manuel : compiler sur `sources-nextjs`, puis remplacer le contenu de `main` à la main (README de `main`). Le workflow GitHub Actions existe dans les sources, mais a été retiré de `main`. Son réglage (« Source : GitHub Actions ») est d'ailleurs incompatible avec le mode actuel (« Deploy from a branch »).
- Les fichiers de `main` sont publics : `README.md` est servi à l'adresse `…/Aeris/README.md`. Un document interne fusionné dans `main` (y compris cet audit) serait **publié**.
- Le dossier `.claude/settings.local.json` contient l'historique des autorisations de sessions précédentes. Il est ignoré par git, rien à signaler.

### 2.2 Dépendances

| Paquet | Version | Dernière | Remarque |
| --- | --- | --- | --- |
| next | 16.3.8 | 16.3.8 | à jour |
| react / react-dom | 19.3.0 | 19.3.0 | à jour |
| zod | 4.6.5 | — | à jour |
| tailwindcss | 4.3.3 | — | à jour |
| typescript | 6.0.3 | **7.0.2** | majeure disponible, sans urgence |
| eslint | 9.39.5 | **10.11.0** | majeure disponible, sans urgence |
| @types/node | 22.20.4 | 26.6.3 | aligné sur Node 22, cohérent |

`npm audit` : **0 vulnérabilité**. Seulement 4 dépendances d'exécution : c'est un très bon point.

### 2.3 Architecture du code source

```
src/
├── app/                 23 routes (pages + 5 routes API « .api.ts » actives seulement avec un serveur)
├── components/          46 composants : layout, home, product, configurator, cart, checkout, forms, chat, consent, ui
└── lib/                 logique métier : catalogue, prix, validation, schémas Zod, panier, commandes,
                         analytics, SEO, assistant (moteur local + LLM optionnel), envoi des formulaires
```

Deux cibles de compilation partagent le même code :
- **« server »** (Vercel/Node) : routes API, recalcul serveur des prix, limite de débit, contrôle d'origine, en-têtes de sécurité, CSP, redirections 301. **Prête, mais jamais déployée.**
- **« github-pages »** (export statique) : sans serveur. Les formulaires partent directement du navigateur vers Formspree. **C'est la version en ligne.**

### 2.4 Qualité du code

| Contrôle | Résultat |
| --- | --- |
| `npm run lint` (ESLint, règles Next/React/a11y) | ✅ 0 erreur, 0 avertissement |
| `npm run typecheck` (TS strict) | ✅ |
| `npm test` (Vitest) | ✅ 30/30 : prix, validation des dimensions, URL du configurateur, assistant |
| Tests end-to-end (Playwright) | ❌ absents |
| Tests d'accessibilité automatisés (axe) | ❌ absents |
| Formateur (Prettier) | ❌ non configuré |
| `CLAUDE.md`, `CHANGELOG` | ❌ absents |

Le code est lisible, bien commenté et nommé de façon cohérente. La logique métier est séparée de l'affichage (`lib/`). Aucun code mort n'a été repéré.

---

## 3. Inventaire des fonctionnalités

Légende : ✅ OK · ⚠️ fragile · ❌ cassé ou absent

| Fonctionnalité | Où | État | Commentaire |
| --- | --- | --- | --- |
| Accueil | `/` | ✅ | Hero, réassurance, problème, solutions par ouverture, toiles, « comment ça marche », FAQ, CTA final |
| Catalogue | `/moustiquaires` | ⚠️ | Filtre **uniquement par ouverture**, 3 tris, état vide. Manquent les filtres pièce, couleur, budget et animaux. |
| Pages catégories | `/moustiquaires/fenetres`, `/portes-et-baies` | ✅ | |
| Fiche produit (×8) | `/produits/[slug]` | ⚠️ | Visuel SVG interactif, estimation rapide, caractéristiques, FAQ, barre d'achat collante. **Aucune photo, vidéo, notice PDF, avis, contenu du colis ni niveau de difficulté de pose.** |
| Configurateur 5 étapes | `/configurateur` | ✅/⚠️ | Très bon : détection cm/m, alertes de proportions, aperçu en direct, prix animé, état dans l'URL (lien partageable). Fragile : les limites de dimensions sont **identiques pour les 8 modèles** (200–2 400 × 200–2 600 mm), sans contrainte de fabrication réelle. |
| Aide au choix | `/moustiquaires#aide-au-choix` | ⚠️ | 3 questions. Le cahier en demande 4 à 6, avec une explication. |
| Comparatif | `/moustiquaires#comparer` | ✅ | |
| Panier | tiroir + `/panier` | ✅ | `localStorage`, prix recalculés à l'affichage, modification dans le configurateur |
| Commande | `/commande` | ⚠️ | Fonctionne, mais : validation **dans le navigateur seulement** en production, **frais de livraison inconnus**, commande transmise par e-mail Formspree et **non enregistrée** |
| Confirmation et paiement | `/commande/confirmation` | ⚠️ | Instructions Revolut/IBAN avec copie en un clic, signalement du paiement. **Affirme qu'un e-mail a été envoyé au client : rien dans le code ne l'envoie.** |
| Mes commandes | `/mes-commandes` | ⚠️ | Historique limité à l'appareil (`localStorage`) : vide sur un autre téléphone ou navigateur |
| Devis | `/devis` | ✅ | Configuration jointe automatiquement, envoi Formspree |
| Contact | `/contact` | ⚠️ | Formulaire OK, mais **aucune coordonnée** : ni téléphone, ni e-mail, ni adresse |
| Guide des mesures | `/guide-des-mesures` | ⚠️ | Méthode en 5 étapes et 3 erreurs fréquentes. Pas de consignes par type de fenêtre, de vidéo, de PDF ni de HowTo. |
| À propos | `/a-propos` | ⚠️ | Texte de valeurs, sans histoire, équipe, atelier ni photos |
| FAQ | `/faq` | ✅ | Recherche + données structurées FAQPage |
| Assistant | bulle en bas à droite | ✅ | Moteur local : calcule un prix exact, ne promet rien d'invérifiable. Pas d'IA externe en version statique. |
| Bandeau cookies | global | ✅ | Aucun traceur, donc simple bandeau « Compris ». Mode « Accepter / Refuser / Personnaliser » prêt si GA est activé. |
| Pages légales (×4) | `/mentions-legales`, `/cgv`… | ❌ | **Squelettes « À compléter » visibles en production** |
| Redirections des anciennes URL `.html` | racine | ✅/⚠️ | Pages de redirection (meta refresh + `noindex`), pas de vraies 301 : GitHub Pages ne le permet pas |
| Page 404 | `/404` | ✅ | |
| Mesure d'audience | — | ❌ | Code prêt, **aucun identifiant configuré** : rien n'est mesuré |
| Pose / rendez-vous, réalisations, blog, espace pro, pages locales, NL | — | ❌ | Absents |

---

## 4. Audit UX et conversion

### 4.1 Parcours d'achat actuel

`Accueil → (aide au choix) → configurateur 5 étapes → panier → commande (coordonnées + choix Revolut/virement) → confirmation → paiement hors site → « J'ai payé »`

### 4.2 Points de friction, par ordre d'impact estimé

| # | Friction | Effet probable |
| --- | --- | --- |
| U1 | **Aucune photo réelle.** Pour un produit qu'on installe chez soi, le visiteur ne voit jamais le rendu dans une vraie maison, ni la matière. | Perte de confiance, impression de site « maquette ». Le premium passe d'abord par l'image. |
| U2 | **Pages légales vides, aucune identité d'entreprise ni coordonnée** | Frein majeur au paiement : « qui est derrière ce site ? » |
| U3 | **Paiement Revolut ou virement uniquement**, hors du site | Le client doit quitter le parcours. Bancontact est le réflexe en Belgique. Abandon probable à la dernière étape. |
| U4 | **Frais de livraison inconnus** avant la commande (« confirmés par e-mail ») | Incertitude sur le prix final, à l'endroit le plus sensible du parcours |
| U5 | **Aucun avis, aucune réalisation** | Pas de preuve sociale près des points de décision |
| U6 | **Prix « dès » trompeurs pour les portes.** Ils sont calculés à 200 × 200 mm. Exemple : plissée « dès 192 € », mais 357 € pour une porte-fenêtre de 1 000 × 2 150 mm. | Mauvaise surprise dans le configurateur, puis perte de confiance |
| U7 | Hero mobile : les boutons d'action apparaissent après une animation. À l'arrivée, l'écran est vide sous le texte (capture à 375 px). | Premier écran moins efficace |
| U8 | Aucun contact immédiat (téléphone, WhatsApp) ni barre d'action mobile (devis, appel, WhatsApp) | Le cahier l'exige. Clientèle 30-65 ans souvent rassurée par un appel. |
| U9 | Aide au choix limitée à 3 questions, sans explication détaillée de la recommandation | |
| U10 | Pas de version NL | Une large partie du marché belge n'est pas adressée |
| U11 | Historique des commandes limité à l'appareil, sans e-mail de confirmation | Anxiété après l'achat, demandes au SAV |

### 4.3 Clarté de l'offre

Bon point : la promesse (« sur mesure, prix immédiat ») est claire, et le vocabulaire est concret et sans superlatifs creux. Point faible : les **engagements différenciants** (garantie, fabrication européenne, vérification avant fabrication, délai de réponse) sont **masqués**, faute de confirmation. Il reste peu de preuves concrètes à mettre en avant. Le positionnement « premium » ne s'appuie aujourd'hui sur rien de démontrable.

---

## 5. Audit technique et performance

### 5.1 Lighthouse (v12, site en ligne, 1er octobre 2026)

Conditions : mobile = Moto G simulé en 4G lente ; desktop = préréglage desktop.

| Page | Perf. | Access. | Bonnes prat. | SEO | LCP | CLS | TBT | Poids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accueil (mobile, cache CDN froid) | **90** | 100 | 100 | 100 | **3,0 s** | 0 | 60 ms | 382 Ko |
| Accueil (mobile, cache chaud) | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms | 382 Ko |
| Catalogue (mobile) | 100 | 100 | 100 | 100 | 1,7 s | 0 | 0 ms | 369 Ko |
| Fiche produit plissée (mobile) | 99 | 100 | 100 | 100 | 2,1 s | 0,001 | 0 ms | 379 Ko |
| Configurateur (mobile) | 99 | 100 | 100 | 100 | 2,1 s | 0,004 | 0 ms | 283 Ko |
| Guide des mesures (mobile) | 100 | 100 | 100 | 100 | 1,1 s | 0,028 | 0 ms | 356 Ko |
| Devis (mobile) | 100 | 100 | 100 | 100 | 1,1 s | 0,003 | 0 ms | 358 Ko |
| Panier (mobile) | 100 | 100 | 100 | 63* | 1,5 s | 0,004 | 0 ms | 284 Ko |
| Accueil (desktop) | 100 | 100 | 100 | 100 | 0,3 s | 0 | 0 ms | 412 Ko |
| Fiche produit (desktop) | 100 | 100 | 100 | 100 | 0,3 s | 0 | 0 ms | 420 Ko |

\* Volontaire : le panier est en `noindex`.

Aucune donnée terrain (CrUX) n'est disponible : le trafic est trop faible. INP ne se mesure pas en laboratoire. Le TBT, quasi nul, indique un risque faible.

### 5.2 Comparaison avec les budgets du cahier

| Budget | Mesuré | Verdict |
| --- | --- | --- |
| LCP < 2,5 s | 1,1 à 2,1 s, mais **3,0 s sur l'accueil quand le cache CDN est froid** | ⚠️ |
| CLS < 0,1 | ≤ 0,028 | ✅ |
| INP < 200 ms | TBT ≈ 0, non mesuré sur le terrain | ✅ probable |
| Accueil < 1 Mo | 382 Ko | ✅, mais **sans aucune photo**. Les photos feront grimper ce poids : il faudra AVIF/WebP + srcset. |
| JS initial < 150 Ko compressé | **≈ 200 Ko gzip** (11 fichiers sur l'accueil) | ❌ |

### 5.3 Causes identifiées

- **LCP de l'accueil** : l'élément LCP est le paragraphe d'introduction du hero. 69 % de son temps vient d'un retard de rendu dû aux animations d'entrée (`animate-rise`, délai de 160 ms et opacité 0 au départ), le reste du TTFB.
- **Cache** : GitHub Pages impose `max-age=600` (10 minutes) à tous les fichiers, même aux fichiers versionnés de `_next/static`. Économie estimée par Lighthouse : 298 Ko par visite répétée. Impossible à régler sur GitHub Pages.
- **JS** : 27 Ko de JS inutilisé et 14 Ko de JS « legacy » (polyfills). Le méga-menu, le tiroir panier, l'assistant et le bandeau cookies sont chargés globalement.
- **DOM** : environ 1 170 nœuds sur l'accueil. Principale cause : les SVG décoratifs (règles graduées, 67 SVG).
- **Polices** : 14 fichiers woff2 générés (Geist, Geist Mono et Fraunces en sous-ensembles), dont une seule préchargée. C'est correct, mais trois familles, c'est une de plus que ce que demande le cahier.
- **Compression** : gzip par le CDN GitHub (pas de Brotli).

---

## 6. Audit SEO

### Ce qui est en place ✅
Un `<title>` et une meta description uniques par page, un seul H1 par page, une hiérarchie Hn logique, des canonical absolus, Open Graph et Twitter, des images de partage générées, `sitemap.xml`. JSON-LD : Organization, WebSite, BreadcrumbList, Product/Offer (`MadeToOrder`), FAQPage. Aucun AggregateRating, faute d'avis : c'est correct.

### Problèmes

| # | Problème | Gravité |
| --- | --- | --- |
| S1 | **Pas de nom de domaine propre** : `rayanevanosselt.github.io/Aeris`. Aucune autorité de marque. Toute l'autorité acquise sera perdue au changement de domaine, sauf redirections. | Critique |
| S2 | **`robots.txt` inopérant** : il est servi sous `/Aeris/robots.txt`. Les moteurs ne lisent que la racine du domaine, et `rayanevanosselt.github.io/robots.txt` renvoie 404. Les `Disallow` ne s'appliquent donc pas et le sitemap n'est pas déclaré. | Important |
| S3 | **Pages légales indexables avec du contenu « À compléter »** | Important |
| S4 | **Aucune image** : pas de trafic Google Images, pas de `alt` porteurs de sens, pas d'image produit réelle dans le JSON-LD (c'est l'image de partage générée) | Important |
| S5 | Aucune page locale (villes, zones de pose), aucun blog, aucune version NL ni `hreflang` | Important (potentiel de trafic) |
| S6 | Redirections des anciennes URL en meta refresh, pas en 301 (limite de GitHub Pages) | Amélioration |
| S7 | `Offer.price` = prix au format minimum. Un `AggregateOffer` avec `lowPrice`, ou un prix « format standard », serait plus juste (voir U6). | Amélioration |
| S8 | Titre « À propos d'Aéris · Aéris » : la marque est répétée | Amélioration |
| S9 | `lastmod` du sitemap = date de compilation pour toutes les pages, et non la date réelle de modification | Amélioration |
| S10 | Le guide de mesure n'a pas de HowTo. À noter : Google n'affiche plus de résultat enrichi HowTo depuis 2023. Le balisage reste valide, mais son bénéfice est faible. | Information |

Non vérifié : l'état d'indexation réel. Il faut un accès à Google Search Console.

---

## 7. Audit sécurité

### Version en ligne (GitHub Pages)

| Contrôle | État |
| --- | --- |
| HTTPS / HSTS | ✅ (GitHub, `max-age=31556952`) |
| Content-Security-Policy | ❌ absente (impossible sur GitHub Pages) |
| X-Content-Type-Options, Referrer-Policy, Permissions-Policy, protection anti-iframe | ❌ absents |
| Validation des formulaires | ⚠️ **navigateur uniquement** (schémas Zod). Contournable. |
| Intégrité des prix | ❌ Le total de commande est calculé dans le navigateur, puis envoyé tel quel à Formspree. Une requête forgée produit un e-mail de commande avec un montant arbitraire. |
| Limitation de débit | ⚠️ seulement celle de Formspree |
| Anti-spam | ⚠️ champ piège (honeypot) seulement |
| Secrets dans le code | ✅ aucun. Les identifiants Formspree sont publics par nature. |
| Dépendances | ✅ 0 vulnérabilité |
| Stockage navigateur | ✅ panier et historique sans donnée personnelle |
| Messages d'erreur | ✅ compréhensibles, sans détail technique |

### Version serveur (prête mais non déployée)
CSP stricte, en-têtes complets, recalcul des prix côté serveur, contrôle d'origine (403), limite de débit **en mémoire** (insuffisante avec plusieurs instances), routes testées. C'est une bonne base, mais **elle ne protège rien tant qu'elle n'est pas en ligne**.

### Autres risques
- **Continuité** : code source sur un seul poste (§ 2.1).
- **Paiement** : l'IBAN et un lien `revolut.me` **personnel** sont publiés. Ce ne sont pas des secrets, mais il faut vérifier que l'encaissement d'une activité commerciale sur ce compte est conforme aux conditions de Revolut et à votre statut (personne physique ou société).
- **Commandes** : aucune base de données. Les commandes n'existent que dans les e-mails Formspree, sans historique fiable, sans export et sans suivi des statuts.

---

## 8. Audit accessibilité

| Point | État |
| --- | --- |
| Lighthouse Accessibilité | ✅ 100 sur les 9 mesures |
| Contrastes des couleurs (calculés) | ✅ `ink-3` sur papier 5,17:1 · `ink-3` sur papier-2 4,64:1 · azur sur papier 4,64:1 · sable foncé sur papier 5,48:1 · `on-night-2` sur nuit 8,59:1. Le sable clair `#C8A57A` (2,09:1 sur papier) ne sert qu'à des icônes et à du texte sur fond nuit : à surveiller dans le futur design system. |
| Lien « Aller au contenu » | ✅ |
| Focus visibles, cibles ≥ 44 px | ✅ (boutons de 44 à 48 px) |
| Formulaires : libellés, erreurs liées aux champs, focus sur la première erreur | ✅ |
| Configurateur : focus sur le titre à chaque étape, prix en `aria-live` | ✅ |
| `prefers-reduced-motion` | ✅ |
| Onglets (Solutions, moyens de paiement) : `role="tab"` **sans navigation aux flèches** ni `aria-controls` | ⚠️ motif ARIA incomplet |
| Test au lecteur d'écran (VoiceOver, NVDA) | ⏳ non réalisé dans cette phase |
| Tests axe automatisés en CI | ❌ absents |

---

## 9. Conformité légale et RGPD (Belgique)

> Les références juridiques ci-dessous servent à orienter le travail. Elles **doivent être validées par un juriste** : je ne suis pas en mesure de donner un avis juridique.

| # | Point | État |
| --- | --- | --- |
| L1 | Identification du vendeur sur le site : dénomination, adresse, e-mail, n° BCE et TVA (Code de droit économique, livre XII) | ❌ absente |
| L2 | Information précontractuelle : prix total, **frais de livraison compris**, avant la commande (CDE, livre VI) | ❌ frais de livraison inconnus |
| L3 | CGV opposables, acceptées par une case à cocher | ❌ la case existe, mais les CGV sont vides |
| L4 | Exception au droit de rétractation pour les biens « confectionnés selon les spécifications du consommateur » | ⚠️ mentionnée à la commande, non rédigée. À vérifier modèle par modèle : le rideau magnétique est-il vraiment fabriqué sur mesure ? |
| L5 | Politique de confidentialité : responsable, finalités, durées de conservation, droits, sous-traitants (Formspree, aux États-Unis, et GitHub) | ❌ squelette |
| L6 | Consentement aux cookies | ✅ aucun traceur, donc conforme aujourd'hui. À refaire dès qu'on ajoute GA4, Meta ou Google Ads. |
| L7 | Plan de marquage | ⚠️ 11 événements codés, avec des noms différents de ceux du cahier (`view_product` au lieu de `view_item`, etc.). Aucun outil branché : **pas de point de départ pour les KPI**. |
| L8 | Garantie légale de conformité (2 ans), médiation consommateurs | ❌ non rédigées |

---

## 10. Analyse concurrentielle rapide

Aucune URL n'a été fournie. Cette analyse porte sur les acteurs qui ressortent des recherches « moustiquaire sur mesure Belgique ». **Elle est à compléter avec vos propres concurrents.**

| Acteur | Ce qu'il fait bien | Faiblesse à exploiter |
| --- | --- | --- |
| **Hubo** (marque CanDo) | Configurateur en ligne, retrait en magasin, notoriété | Grande surface de bricolage : conseil générique, offre noyée dans le catalogue, design utilitaire |
| **Gamma** (marque Bruynzeel) | Sur mesure livré prêt à poser, promotions fréquentes, livraison gratuite sur certains modèles | Expérience de catalogue de masse, peu d'accompagnement à la mesure, aucune personnalisation esthétique |
| **Brico** (CanDo) | Large gamme standard et télescopique, prix bas | Produits surtout standard « à recouper » : l'inverse du premium |
| **Bobex** | Mise en relation avec des poseurs locaux (devis) | Intermédiaire : pas de prix immédiat, pas de marque, délais variables |
| **Renson** (fabricant belge, gamme Fixscreen) | Référence haut de gamme, image architecturale | Vente par revendeurs : pas de prix en ligne, parcours long |

**Positionnement possible pour Aéris** : allier la précision et l'esthétique d'un fabricant premium (type Renson) avec la simplicité d'achat en ligne (prix immédiat, configurateur) d'une grande surface, et ajouter un **accompagnement humain** que ni l'un ni l'autre n'offre (vérification des mesures, conseil, pose éventuelle). Ce positionnement n'est crédible qu'avec des preuves réelles (photos, avis, garantie écrite, identité de l'entreprise).

Sources consultées : [Hubo — moustiquaires sur mesure](https://www.hubo.be/fr/services/services-en-magasins/fenetres-et-portes-moustiquaires-sur-mesure/), [Gamma — moustiquaires sur mesure](https://www.gamma.be/fr/moustiquaires-de-porte-et-moustiquaire-de-fenetre-sur-mesure), [Gamma — plissée Bruynzeel S500](https://www.gamma.be/fr/assortiment/moustiquaire-plissee-pour-fenetre-bruynzeel-s500-123x155-cm-blanc/p/B357246), [Brico — CanDo](https://www.brico.be/fr/menuiserie/moustiquaires/moustiquaires-fenetre/moustiquaires-integrees-pour-fenetre/moustiquaire-telescopique-fenetre-standard-cando-100x140cm-anthracite/10201802), [Bobex — moustiquaires](https://www.bobex.be/fr-be/moustiquaires/), [GBD Magazine — Renson Fixscreen](https://gbdmagazine.com/fixscreen-minimal/).

---

## 11. Plan d'action priorisé

Impact : ●●● fort · ●● moyen · ● faible. Effort : S (< 1 j) · M (1–3 j) · L (> 3 j).

### 🔴 Critique : avant toute nouvelle mise en avant du site

| # | Action | Impact | Effort | Dépend de vous |
| --- | --- | --- | --- | --- |
| C1 | **Sauvegarder le code source sur GitHub** (pousser `sources-nextjs`) et baser la branche de refonte dessus | ●●● | S | Accord pour pousser |
| C2 | **Choisir et mettre en place un hébergement avec serveur** (voir D1) : validation et prix côté serveur, en-têtes de sécurité, CSP, webhooks de paiement | ●●● | M | Choix + compte |
| C3 | **Identité légale et coordonnées** affichées partout (pied de page, contact, mentions) | ●●● | S | Données entreprise |
| C4 | **CGV, mentions légales, confidentialité, cookies, retours, garantie** rédigées et validées | ●●● | M | Juriste / textes |
| C5 | **Frais de livraison** calculés et affichés avant la commande | ●●● | S | Grille tarifaire |
| C6 | **Paiement en ligne** (voir D2) : Bancontact, carte, Apple Pay, avec webhooks signés. Virement conservé en option. | ●●● | M | Compte prestataire |
| C7 | **Enregistrement des commandes et des devis** (base de données UE) et **e-mails de confirmation au client** | ●●● | M | Choix (D3) |
| C8 | Retirer la phrase « instructions envoyées par e-mail » tant que l'e-mail n'existe pas (correctif immédiat possible) | ●● | S | — |

### 🟠 Important : la refonte premium proprement dite (phases 1 à 3)

| # | Action | Impact | Effort |
| --- | --- | --- | --- |
| I1 | **Photos réelles** (situation, matière, avant/après) + pipeline AVIF/WebP, srcset, préchargement de l'image du hero | ●●● | M (+ séance photo) |
| I2 | **Avis authentiques** (Google Business Profile ou Trustpilot) + bloc d'avis près des CTA + AggregateRating | ●●● | S–M |
| I3 | **Règles de fabrication par modèle** : limites min/max réelles, contraintes, prix « dès » sur un format réaliste (corrige U6) | ●●● | S |
| I4 | Barre d'action mobile collante (devis, appel, WhatsApp), header allégé, méga-menu revu | ●● | S |
| I5 | Fiche produit complète : galerie zoomable, vidéo, notice PDF, contenu du colis, difficulté de pose, avis, compléments | ●●● | M |
| I6 | Aide au choix en 4 à 6 questions avec explication + comparatif enrichi | ●● | M |
| I7 | Guide de mesure par type de fenêtre, illustrations techniques, PDF téléchargeable, vidéo | ●●● | M |
| I8 | **Mesure d'audience avec consentement** (GA4, Meta + CAPI, Google Ads) et plan de marquage aligné sur le cahier (`TRACKING.md`), pour poser un point de départ **avant** la refonte visuelle | ●●● | M |
| I9 | Nom de domaine propre + Search Console + redirections 301 depuis GitHub Pages | ●●● | S |
| I10 | Version **NL** (et EN ?) avec `hreflang` | ●●● | L |
| I11 | Page « Pose et service » + prise de rendez-vous, **si vous posez** | ●● | M |
| I12 | Catalogue : filtres pièce, couleur, budget, animaux | ●● | M |
| I13 | Performance : animations du hero sans effet sur le LCP, JS initial < 150 Ko (chargement différé de l'assistant, du méga-menu et du tiroir), 2 familles de polices au lieu de 3 | ●● | M |
| I14 | Tests Playwright des parcours clés + axe en CI + Prettier | ●● | M |

### 🟢 Amélioration

| # | Action | Impact | Effort |
| --- | --- | --- | --- |
| A1 | Réalisations filtrables, À propos (histoire, équipe, atelier) | ●● | M |
| A2 | Blog : 10 articles à intention d'achat ; pages locales par zone (contenu réellement spécifique) | ●● | L |
| A3 | Capture d'e-mail avec une vraie contrepartie (guide PDF), relance de panier ou de devis abandonné (avec consentement) | ●● | M |
| A4 | Bandeau saisonnier activable sans redéploiement ; structure pour tests A/B du hero et des CTA | ● | M |
| A5 | Espace pro (menuisiers, gestionnaires), si pertinent | ● | L |
| A6 | Onglets ARIA complets (flèches), `AggregateOffer`, titres dédoublonnés, `lastmod` réels | ● | S |
| A7 | `CLAUDE.md`, `CHANGELOG`, README mis à jour, mises à jour majeures TS 7 / ESLint 10 | ● | S |

---

## 12. Décisions techniques à prendre

### D1 — Hébergement

| Option | Pour | Contre |
| --- | --- | --- |
| A. Rester sur GitHub Pages | Gratuit, déjà en place | Pas de serveur : pas de CSP, pas de validation serveur, **pas de webhooks de paiement**, pas de Conversions API, cache de 10 min, `robots.txt` inopérant. **Incompatible avec les §§ 10, 11 et 12 du cahier.** |
| **B. Vercel (recommandé)** | Hébergeur natif de Next.js. Le code est **déjà prêt** (routes API, en-têtes, redirections 301). Région UE disponible. Déploiement automatique à chaque push. | Payant pour un usage commercial (formule Pro, tarif à vérifier) |
| C. Netlify / Cloudflare | Coût potentiellement plus bas | Adaptateur Next.js requis, réglages à reprendre, risque de différences de comportement |

**Recommandation : B.** C'est le moins de travail et le moins de risque, et cela débloque immédiatement la sécurité, le paiement et le suivi publicitaire.

### D2 — Paiement en ligne

| Option | Pour | Contre |
| --- | --- | --- |
| **A. Mollie (recommandé)** | Entreprise néerlandaise très implantée au Benelux, **Bancontact natif**, carte, Apple Pay, PayPal, virement. Interface et support en FR/NL. | Commission par transaction (à comparer) |
| B. Stripe | Excellente API, Bancontact disponible | Moins tourné vers le Benelux, support surtout en anglais |
| C. Statu quo (Revolut/virement) | Aucun frais | Frein majeur, aucun rapprochement automatique |

**Recommandation : A**, avec le virement conservé en option. Dans tous les cas, aucune donnée bancaire ne transite par le site (page hébergée par le prestataire et webhooks signés).

### D3 — Stockage des commandes, devis et e-mails

**Recommandation** : base PostgreSQL hébergée dans l'UE (Neon ou Supabase), plus un service d'e-mails transactionnels européen (Brevo, par exemple) pour les confirmations client et les relances. Formspree peut être retiré une fois la bascule faite. *Alternative* : une plateforme e-commerce complète (Shopify…). Je la déconseille ici, car le prix au m² et le configurateur s'y intègrent mal et une réécriture serait nécessaire.

### D4 — Organisation git

**Recommandation** : (1) pousser `sources-nextjs` sur GitHub ; (2) recréer la branche de refonte à partir de `sources-nextjs` (elle part aujourd'hui du site compilé) ; (3) une fois sur Vercel, `main` redevient la branche de **code source** et le site compilé disparaît du dépôt. Conséquence : **cet AUDIT.md doit vivre dans `docs/` de la branche source, et ne jamais être fusionné dans le `main` actuel, qui est public.**

---

## 13. Questions à trancher avant la phase 1

**Entreprise et légal**
1. Raison sociale, forme juridique, n° BCE et TVA, adresse, e-mail, téléphone, horaires ?
2. Le compte Revolut et l'IBAN sont-ils des comptes professionnels au nom de la société ?
3. Avez-vous un juriste ou un modèle de CGV ? Quels modèles sont réellement fabriqués sur mesure (exception au droit de rétractation) ?

**Offre**
4. Proposez-vous la **pose** ? Si oui : zones, tarifs, déroulé, délais.
5. Qui fabrique, et où ? (Pour décider si « fabrication européenne » peut être affiché.)
6. Garantie réelle (durée, périmètre) ? Délai de réponse réel ?
7. **Règles de prix et contraintes de fabrication par modèle** : limites min/max réelles, sens d'ouverture, types de maille disponibles par modèle, options compatibles, arrondis, tarifs dégressifs. Les prix actuels viennent de l'ancien site : sont-ils toujours valables ?
8. **Livraison** : zones (Belgique seulement ? UE ?), frais, transporteur, délais.

**Marché**
9. Langues : FR seul, FR + NL, FR + NL + EN ?
10. Clientèle professionnelle à cibler maintenant, ou plus tard ?
11. URLs de vos concurrents de référence ?

**Contenus**
12. Disposez-vous de photos réelles (produits posés, détails, atelier) ? Sinon, une séance photo est-elle envisageable ?
13. Avez-vous déjà des avis clients (Google, e-mails) ?
14. Logo définitif ? Gardons-nous l'identité « Plan & Lumière », ou repartons-nous de zéro en phase 2 ?

**Budget et accès**
15. Budget mensuel acceptable pour les services (hébergement, paiement, e-mails, base de données) ?
16. Nom de domaine déjà acheté ? Accès Google Search Console, Google Business Profile ?

---

## 14. Limites de cet audit

- Lighthouse est une mesure de laboratoire. L'accueil a varié de 90 à 99 entre deux passages (cache CDN). Aucune donnée terrain n'est disponible.
- Aucun test sur un iPhone ou un Android réels, ni au lecteur d'écran : à faire en phase de recette.
- Configuration du compte Formspree non vérifiable (réponse automatique au client, filtres anti-spam).
- Indexation réelle non vérifiée (Search Console requise).
- Analyse concurrentielle volontairement rapide, faute d'URLs fournies.

---

## 15. Résumé de la phase 0

**Fait** : cartographie du dépôt et des branches ; contrôles qualité (lint, types, tests, `npm audit`) ; 10 mesures Lighthouse sur le site en ligne ; revue du code (prix, validation, formulaires, paiement, consentement, SEO, accessibilité) ; contrôle des en-têtes HTTP ; calcul des contrastes ; vérification visuelle sur mobile ; analyse concurrentielle rapide ; plan d'action priorisé.

**Reste à faire** : votre validation de ce plan, vos réponses aux questions du § 13, puis la phase 1 (`STRATEGIE.md`).

**Risques**
- Perte du code source tant que `sources-nextjs` n'est pas sauvegardée sur GitHub.
- Risque juridique et de confiance tant que le site prend des commandes sans CGV ni identité légale.
- Commandes falsifiables et non archivées tant que l'on reste sur un hébergement statique.
- Sans mesure d'audience installée **avant** la refonte, il sera impossible de prouver la hausse de conversion demandée.
