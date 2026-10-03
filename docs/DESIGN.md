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
| Durées | `--dur-fast 180ms` · `--dur-base 340ms` · `--dur-slow 700ms` · `--dur-slower 1100ms` · `--dur-cinematic 1600ms` | Interface rapide, révélations lentes |
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
| Parallaxe douce | `.sd-parallax` | Défilement |
| Média qui se dévoile | `.media-reveal` | Bloc parent visible |
| Bouton : libellé qui roule, flèche qui glisse | `Button` / `ButtonLink` | Survol |
| En-tête qui devient un îlot | `Header` | Défilement (transparent sur le film, îlot compact ensuite) |

Les effets pilotés par le défilement sont une **amélioration progressive** (`@supports`) : sans
support, le contenu est simplement là. Avec « réduire les animations » : aucune animation, aucune
vidéo téléchargée (affiches fixes), tout le texte visible. Sans JavaScript : contenus visibles
(`<noscript>` dans `src/app/[locale]/layout.tsx`).

## Accueil : un récit

`HeroFilm` (film plein écran) → `Manifesto` (une phrase) → `Craft` (le sur-mesure à essayer,
chiffres lus dans le catalogue) → `DayStory` (une journée fenêtres ouvertes, arche fixe qui change
de scène) → `Collection` (index éditorial des 8 modèles, aperçu en arche) → `Proof` (« 1 mm » :
engagement confirmé « sur mesure, au millimètre » + engagements sans astérisque) → `Process`
(4 gestes) → FAQ → `FinalCta` (maison éclairée le soir). Sur mobile : `HomeStickyCta`.

Aucun chiffre, avis ou label inventé : les chiffres viennent de `src/lib/catalog.ts`, les
engagements de `src/lib/business.ts` (les non confirmés restent masqués en ligne), les avis
n'apparaissent que si le tableau `reviews` est rempli.

## Vidéo

- Source : `assets/video/aeris-film-master.mp4` (1920×1080, 22 s, 51 Mo — **non publiée**).
- Publiés dans `public/media/` :

| Fichier | Rôle | Poids |
| --- | --- | --- |
| `film-1600.mp4` | Film d'accueil, écrans larges | 3,7 Mo |
| `film-portrait.mp4` | Film d'accueil, téléphone en portrait (recadrage centré 9:16) | 1,7 Mo |
| `film-poster(.webp/.jpg)`, `film-poster-portrait.webp` | Affiches (affichées immédiatement) | 10–40 Ko |
| `clip-morning/mesh/door/cat/house(.mp4/.webp)` | Extraits pour le récit, la preuve et l'appel final | 0,3–0,8 Mo |

- Chargement : affiche d'abord ; vidéo du film lancée 1,2 s après le chargement de la page
  (fin de l'ouverture en arche) ; extraits chargés seulement à l'approche de l'écran et quand ils
  doivent jouer ; tout est mis en pause hors écran ; bouton pause/lecture (WCAG 2.2.2).
- Muettes, en boucle, `playsInline`, sans son (piste audio retirée).
- **Le film est une mise en scène générée** : il ne montre ni de vrais clients ni des
  réalisations Aéris et ne doit pas être présenté comme tel.

Ré-encoder après un nouveau montage (ffmpeg) :

```bash
ffmpeg -y -i master.mp4 -an -vf "scale=1600:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart public/media/film-1600.mp4
ffmpeg -y -i master.mp4 -an -vf "crop=608:1080:656:0,scale=540:960:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 27 -movflags +faststart public/media/film-portrait.mp4
ffmpeg -y -ss 0.3 -i master.mp4 -frames:v 1 -vf "scale=1600:-2:flags=lanczos" -c:v libwebp -quality 72 public/media/film-poster.webp
# un extrait : début (s), durée (s), image d'affiche (s)
ffmpeg -y -ss 4.2 -t 5.4 -i master.mp4 -an -vf "scale=1280:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 28 -movflags +faststart public/media/clip-mesh.mp4
ffmpeg -y -ss 5.6 -i master.mp4 -frames:v 1 -vf "scale=1280:-2:flags=lanczos" -c:v libwebp -quality 74 public/media/clip-mesh.webp
```

## Audit visuel final (build GitHub Pages, serveur compressé)

| Page | Mobile perf. | Desktop perf. | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- | --- | --- |
| Accueil FR | 90 | 100 | 100 | 100 | 100 |
| Accueil NL / EN | — | 100 | 100 | — | — |
| Produit (plissée) | 91 | 100 | 100 | 100 | 100 |

CLS 0 et TBT ≈ 0 partout. Largeurs vérifiées dans le navigateur : 360 (EN), 375 (FR), 390 (NL),
430 (FR), 768 (NL), 1024 (EN), 1280 (FR/EN) et 1440 px (FR) — aucun débordement horizontal,
aucune erreur console. « Réduire les animations » vérifié par lecture du CSS (non émulable ici).
