# Design system « L'air, cadré »

Aéris vend de l'air et de la lumière, cadrés au millimètre. Le design part de là :
la **fenêtre** (arches, cadres qui s'ouvrent), une **serif éditoriale** en très grand,
le **lin** et le **bleu nuit**, un mouvement **lent et fluide**.

Remplace le design system « Plan & Lumière » (voir `RAPPORT-REFONTE.md`). Tous les jetons
sont dans `src/app/globals.css` ; les polices dans `src/app/fonts.ts`.

## Jetons

| Famille | Valeurs | Usage |
| --- | --- | --- |
| Fonds | `paper #f3efe7` (lin) · `paper-2 #e8e2d6` · `surface #fbf9f4` · `night #0d1a2e` · `night-2 #18273f` | Lin par défaut, bleu nuit pour les temps forts (récit, pied de page, voile du film) |
| Texte | `ink #0d1a2e` · `ink-2 #364154` · `ink-3 #5c6575` · `on-night #f1eee7` · `on-night-2 #aeb5c2` | Contrastes AA vérifiés (Lighthouse accessibilité 100 en FR/NL/EN) |
| Accents | `sand #c9a97e` · `sand-soft #eee4d3` · `sand-deep #7a5a36` · `sky #3e5b7e` (ardoise) | À petite dose : mots d'accent, chiffres, repères. `sand` clair seulement sur fond nuit |
| Rayons | 10 / 14 / 22 / 32 / 44 px, pilule, `rounded-arch` | L'arche (`999px 999px 72px 72px`) est la forme signature des médias |
| Courbes | `--ease-out: cubic-bezier(0.16,1,0.3,1)` · `--ease-in-out: cubic-bezier(0.76,0,0.24,1)` | Une seule famille de courbes pour tout le site |
| Durées | `--dur-fast 180ms` · `--dur-base 340ms` · `--dur-slow 500ms` · `--dur-slower 750ms` · `--dur-cinematic 1000ms` | Interface rapide, révélations courtes : le contenu est là sans attendre |
| Espacement | `--gutter clamp(18px,4.4vw,56px)` · `--section-y clamp(96px,13vw,200px)` · conteneur 1440 px | Grandes respirations entre les sections |

## Typographie (2 familles)

- **Fraunces** (serif variable, axe de taille optique) : `t-display`, `t-h1`, `t-h2`, `t-h3`,
  l'italique `accent` des mots mis en valeur, les grands chiffres.
- **Geist** (sans-serif) : texte, interface, `t-lead`, `t-small`, `t-caption` (capitales espacées),
  `t-num` (chiffres tabulaires).
- Auto-hébergées par `next/font` (aucune requête vers Google). L'axe « SOFT » de Fraunces n'est
  pas chargé : −120 Ko de polices pour un effet presque invisible.

## Mouvement

| Effet | Classe / composant | Déclenchement |
| --- | --- | --- |
| Bloc qui apparaît | `Reveal` → `.reveal` | Entrée dans l'écran (IntersectionObserver unique) |
| Titre mot à mot derrière un masque | `<Rich words="rise">` → `.rt-word` | Bloc parent visible, ou au chargement avec `.rt-load` |
| Mot qui s'éclaire en lisant | `<Rich words="scroll">` → `.sd-word` | Défilement (CSS `animation-timeline: view()`) |
| Ouverture du film en arche | `.hero-veil` | Chargement (transformations uniquement) |
| Film qui se referme en cadre | `.sd-hero-frame`, `.sd-hero-copy` | Défilement de la page |
| Arche qui s'ouvre en grand | `.sd-window` | Entrée de l'appel final dans l'écran |
| Bouton : libellé qui roule, flèche qui glisse | `Button` / `ButtonLink` | Survol |
| En-tête qui devient un îlot | `Header` | Défilement (transparent sur le film, îlot compact ensuite) |

Les effets pilotés par le défilement sont une **amélioration progressive** (`@supports`) : sans
support, le contenu est simplement là. Avec « réduire les animations » : aucune animation, tout
le texte visible ; le film démarre quand même (choix de l'entreprise) et reste maîtrisable par
les boutons pause et son. Sans JavaScript : contenus visibles
(`<noscript>` dans `src/app/[locale]/layout.tsx`).

## Accueil : dans l'ordre des questions d'un client

1. `HeroFilm` — le film avec sa bande-son (envie).
2. `TrustStrip` — les engagements confirmés, juste sous le film (confiance).
3. `Collection` — « quel modèle pour mon ouverture ? » : onglets Fenêtres / Portes / Baies
   vitrées, index éditorial + aperçu en arche (ruban sur mobile).
4. `Process` — comment ça marche, en 4 gestes, avec le guide des mesures.
5. `Craft` — le prix au millimètre, à essayer avec les curseurs.
6. `Meshes` — « quelle toile pour mon besoin ? » : les 5 toiles du catalogue, loupe en arche,
   supplément réel (coefficient sur le prix au m²), lien vers le configurateur avec la toile
   présélectionnée (`?toile=`).
7. `Proof` — « 1 mm » sur une règle graduée (engagement confirmé « sur mesure, au millimètre »).
8. FAQ, puis `FinalCta` (arche bleu nuit qui s'ouvre en grand). Sur mobile : `HomeStickyCta`.

Aucun chiffre, avis ou label inventé : les chiffres viennent de `src/lib/catalog.ts`, les
engagements de `src/lib/business.ts` (les non confirmés restent masqués en ligne), les avis
n'apparaissent que si le tableau `reviews` est rempli.

## Vidéo

- Source : `assets/video/aeris-film-master.mp4` (1920×1080, 22 s, 51 Mo — **non publiée**).
- Publiés dans `public/media/` :

| Fichier | Rôle | Poids |
| --- | --- | --- |
| `film-1600.mp4` | Film d'accueil avec son, écrans larges | 3,2 Mo |
| `film-portrait.mp4` | Film d'accueil avec son, téléphone en portrait (recadrage centré 9:16) | 1,4 Mo |
| `film-poster(.webp/.jpg)`, `film-poster-portrait.webp` | Affiches (affichées immédiatement) | 10–40 Ko |

- **Une seule apparition** (choix de l'entreprise) : le film n'est utilisé qu'en ouverture de
  l'accueil. Les autres sections utilisent les illustrations des modèles et la toile dessinée.
- Chargement : affiche d'abord, vidéo lancée dès que la page est prête, fondu à la première
  image ; pause hors écran.
- **Son** : bande-son d'origine, niveau normalisé (loudnorm −18 LUFS, AAC 96 kb/s). Les
  navigateurs (Safari iPhone, Chrome Android, Chrome/Edge/Firefox ordinateur) **interdisent le son
  automatique** avant une action de la personne. Le site tente la lecture avec le son ; si elle
  est refusée, le film démarre en silencieux et le bouton « Activer le son » reste visible
  (un toucher suffit). Si même la lecture silencieuse est refusée (iPhone en mode économie
  d'énergie), un bouton « Lire le film » apparaît.
- Boutons pause/lecture et son (WCAG 1.4.2 et 2.2.2) ; en boucle, `playsInline`.
- **Le film est une mise en scène générée** : il ne montre ni de vrais clients ni des
  réalisations Aéris et ne doit pas être présenté comme tel.

Ré-encoder après un nouveau montage (ffmpeg) :

```bash
ffmpeg -y -i master.mp4 -vf "scale=1600:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 29 -profile:v high -af "loudnorm=I=-18:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 96k -ac 2 -movflags +faststart public/media/film-1600.mp4
ffmpeg -y -i master.mp4 -vf "crop=608:1080:656:0,scale=540:960:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 30 -profile:v high -af "loudnorm=I=-18:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 96k -ac 2 -movflags +faststart public/media/film-portrait.mp4
ffmpeg -y -ss 0.3 -i master.mp4 -frames:v 1 -vf "scale=1600:-2:flags=lanczos" -c:v libwebp -quality 72 public/media/film-poster.webp
```

## Audit visuel final (build GitHub Pages, serveur compressé)

| Page | Mobile perf. | Desktop perf. | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- | --- | --- |
| Accueil FR / EN | 91 | 100 | 100 | 100 | 100 |
| Produit (plissée) | 91 | 100 | 100 | 100 | 100 |

Accueil mobile : indice de vitesse (Speed Index) 1,2 s, contre 5,7 s pour la version en ligne
précédente (ouverture raccourcie, révélations plus rapides) ; page allégée de 1 430 à 920
éléments. CLS 0 et TBT ≈ 0 partout. Largeurs vérifiées dans le navigateur : 360 (EN), 375 (FR), 390 (NL),
430 (FR), 768 (NL), 1024 (EN), 1280 (FR/EN) et 1440 px (FR) — aucun débordement horizontal,
aucune erreur console. « Réduire les animations » vérifié par lecture du CSS (non émulable ici).
