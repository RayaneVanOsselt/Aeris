# Refonte Aéris — rapport de livraison

## 1. Architecture et routes

| Route | Rôle |
| --- | --- |
| `/` | Accueil : hero animé, réassurance, problème, solutions, bento interactif, toiles, « comment ça marche », preuve sociale, FAQ, CTA |
| `/moustiquaires` | Catalogue filtrable + aide au choix + comparatif |
| `/moustiquaires/fenetres`, `/moustiquaires/portes-et-baies` | Pages catégories (SEO) |
| `/produits/[slug]` (8 fiches) | Galerie interactive, estimation instantanée, caractéristiques, FAQ, modèles voisins |
| `/configurateur` | 5 étapes, aperçu en direct, prix animé, lien partageable |
| `/panier`, `/commande`, `/commande/confirmation` | Tunnel d'achat sans compte + instructions de paiement |
| `/mes-commandes` | Historique des commandes sur l'appareil |
| `/devis`, `/contact` | Formulaires (configuration jointe automatiquement au devis) |
| `/guide-des-mesures`, `/a-propos`, `/faq` | Contenu d'aide et de confiance |
| `/mentions-legales`, `/conditions-generales-de-vente`, `/politique-de-confidentialite`, `/politique-cookies` | Structure légale à compléter |
| `/api/chat`, `/api/order`, `/api/quote`, `/api/contact`, `/api/payment-notice` | API serveur |

Les anciennes URL `.html` redirigent (301) vers les nouvelles.

## 2. Design system « Plan & Lumière »

> Remplacé par le design system « L'air, cadré » (accueil immersif autour du film de marque) :
> voir [`DESIGN.md`](DESIGN.md). Cette section décrit l'état précédent.

- **Idée** : la précision d'un plan d'architecte (cotes, grille, règle graduée) et la douceur de la lumière naturelle. Motifs signature : trame de moustiquaire, cotes en millimètres, règle.
- **Couleurs** : papier `#F6F4EE`, encre bleu nuit `#0A1631`, sable `#C8A57A` / `#7C5D3A`, azur `#3563E9` (réservé aux détails de précision : cotes, focus, progression), états succès/erreur/avertissement. Contrastes AA.
- **Typographie** : Geist (titres légers à approche serrée, texte), Geist Mono (mesures, repères), Fraunces italique (mots d'accent). Auto-hébergées (aucun appel à Google, RGPD).
- **Échelle** : Display, H1–H4, lead, body, small, caption — fluides (`clamp`).
- **Rayons** : 8 / 12 / 20 / 28 px et pilule. **Ombres** courtes et douces.
- **Boutons** : primary, secondary, ghost, text, light, outline-light, icon button ; tailles sm/md/lg ; cible tactile ≥ 44 px.
- **Mouvement** : chaque animation a une raison (révéler dans l'ordre de lecture, confirmer une action, montrer la personnalisation). `prefers-reduced-motion` respecté partout.
- Tokens : `src/app/globals.css`.

## 3. Fonctionnalités

- Configurateur : détection des saisies en cm ou en mètres avec correction en un clic, avertissement pour des dimensions inhabituelles selon l'ouverture (sans bloquer), proportions suspectes, code RAL validé, étapes non franchissables tant qu'elles sont incomplètes, état dans l'URL.
- Aide au choix en 3 questions (règles dérivées des descriptions produits existantes).
- Panier persistant, tiroir de confirmation, quantités, modification d'un article dans le configurateur.
- Commande sans compte : validation client + serveur, prix **recalculés côté serveur**, référence `AER-AAMMJJ-XXXX`, instructions Revolut/virement avec copie en un clic, signalement du paiement.
- Assistant IA : répond à partir des seules données du site ; calcule un prix exact à partir d'un modèle et de dimensions ; formulaire de rappel intégré ; phrase de repli honnête ; LLM optionnel (Anthropic ou OpenAI) côté serveur avec repli automatique sur le moteur local.
- Consentement RGPD : aucun outil de mesure chargé sans accord, « Refuser » aussi simple qu'« Accepter ».
- Analytics prêt : `view_product`, `configurator_started`, `configurator_step_completed`, `quote_requested`, `add_to_cart`, `begin_checkout`, `purchase`, `chatbot_opened`, `chatbot_question`, `contact_form_submitted`, `finder_completed` — sans donnée personnelle.

## 4. Technologies

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, Zod 4, Vitest.
Aucune bibliothèque d'animation ni de composants : animations CSS + deux petits hooks,
composants accessibles maison (`<dialog>` natif, `<details>`), icônes SVG maison.
Justification : le site statique précédent ne permettait ni API sécurisée (chatbot, commandes), ni URL propres par produit, ni composants partagés (l'en-tête était dupliqué dans 18 fichiers).

## 5. SEO

Titres et descriptions par page, canonical, Open Graph et Twitter, images de partage générées, `sitemap.xml`, `robots.txt`, données structurées Organization, WebSite, BreadcrumbList, Product/Offer (disponibilité « fabriqué sur commande »), FAQPage sur la FAQ. Aucun balisage d'avis (pas d'avis authentiques pour l'instant). Hiérarchie de titres respectée.

## 6. Performance (Lighthouse mobile, 4G simulée, build de production local)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- | --- |
| Accueil | 94 | 100 | 100 | 100 |
| Fiche produit | 94 | 100 | 100 | 100 |
| Configurateur | 94 | 100 | 100 | 100 |

LCP ≈ 3,0 s (simulé), CLS ≈ 0, TBT ≈ 10 ms. 46 pages pré-générées statiquement.

## 7. Tests réalisés

- 29 tests unitaires : formule de prix, prix « dès », validation des dimensions (cm/m, limites, plages inhabituelles, proportions), lecture/écriture de l'URL du configurateur (valeurs malveillantes ignorées), assistant (prix exact, paiement réel, refus d'inventer garantie ou zone de livraison).
- API : origine étrangère refusée (403), mauvais format (415), limite de débit (429), champ piège, dimensions hors limites refusées, prix envoyé par le navigateur ignoré, contenu HTML traité comme texte.
- Parcours complet automatisé : configurateur → panier → commande (erreurs puis succès) → confirmation et paiement.
- Captures mobile (375 px), tablette (768 px) et desktop (1440 px) ; aucun défilement horizontal.
- `npm run check` : lint, TypeScript, tests et build au vert.

## 8. Points restant à configurer

**Informations business à valider** (`src/lib/business.ts`) — repère ◆ sur le site :
garantie 5 ans, fabrication européenne, vérification avant fabrication, réponse sous 24 h, zones de livraison. Ce sont des affirmations de l'ancien site, non vérifiables.

**Supprimé car inventé dans l'ancien site** : note 4,9/5 et « +1 200 avis », témoignages avec photos de banque d'images, équipe fictive, « 12 000+ moustiquaires », adresse, e-mail et téléphone d'exemple, moyens de paiement non proposés (Stripe, PayPal, Bancontact, Apple Pay), faux système de comptes (mots de passe stockés dans le navigateur).

**À fournir** : e-mail, téléphone, adresse, horaires, n° BCE/TVA ; photos réelles (produits posés, détails, atelier, équipe) ; avis authentiques ; histoire de l'entreprise ; règles de mesure précises par modèle ; textes juridiques (mentions, CGV, confidentialité, cookies) ; confirmation des prix, délais et limites de dimensions ; frais de livraison.

**Hébergement** : GitHub Pages via GitHub Actions (réglage *Source : GitHub Actions* à activer une fois). En version statique, les formulaires partent directement vers Formspree et l'assistant utilise le moteur local ; Vercel reste possible pour la version complète (IA, routes API, en-têtes de sécurité).

**Services** : domaine personnalisé (facultatif) ; clé `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY` (facultatif) ; `NEXT_PUBLIC_GA_ID` (facultatif) ; `CRM_WEBHOOK_URL` (facultatif) ; paiement par carte (Stripe, Mollie…) si souhaité plus tard ; limite de débit partagée (Upstash/Redis) si plusieurs instances.

## 9. Lancement

```bash
npm install
cp .env.example .env.local
npm run dev          # développement
npm run build:pages  # version statique GitHub Pages (dossier out/)
npm run build        # version serveur (Vercel/Node)
npm start            # sert la version serveur
```
