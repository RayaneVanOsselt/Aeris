# Journal des modifications

## Non publié

### Accueil plus rapide et plus professionnel
- Le film d'accueil a désormais sa bande-son (niveau normalisé) et un bouton « Activer le son » ;
  il démarre automatiquement sur ordinateur et sur téléphone (en silencieux quand le navigateur
  interdit le son automatique, ce qui est la règle sur iPhone et Android). Il est aussi plus
  léger : 1,4 Mo sur téléphone (au lieu de 1,7) et 3,2 Mo sur ordinateur (au lieu de 3,7).
- Accueil réorganisé dans l'ordre des questions d'un client : engagements juste sous le film,
  modèles par ouverture (fenêtres, portes, baies vitrées), comment ça marche, prix au
  millimètre, choix de la toile (5 toiles avec leur supplément réel et un lien vers le
  configurateur avec la toile choisie), « 1 mm », FAQ, appel final.
- Plus rapide : ouverture et animations raccourcies (le contenu apparaît sans attendre), un seul
  dessin d'aperçu à la fois, page allégée d'un tiers d'éléments.

### Refonte immersive (design system « L'air, cadré »)
- Accueil reconstruit comme un récit qui s'ouvre sur le film de marque (une seule apparition,
  en plein écran) : film qui s'ouvre en arche puis se referme en cadre au défilement,
  manifeste, sur-mesure à essayer, « une journée fenêtres ouvertes » (arche fixe qui change
  d'illustration), collection en index éditorial, preuve « 1 mm », méthode en 4 gestes,
  appel final en arche bleu nuit.
- Nouveau design system : serif Fraunces en très grand + Geist, lin et bleu nuit, arche
  signature, courbes et durées centralisées, boutons pilule au libellé qui roule.
- En-tête transparent sur le film, puis îlot compact au défilement ; sélecteur de langue
  compact (FR/NL/EN) toujours visible sur téléphone et tablette.
- Film optimisé (`public/media` : 1,7 Mo sur téléphone, 3,7 Mo sur ordinateur), affiche
  immédiate, chargement différé, pause hors écran, bouton pause/lecture ; aucune vidéo avec
  « réduire les animations ».
- Barre « Configurer » sur mobile une fois le film passé.
- Documentation : `docs/DESIGN.md` (jetons, mouvements, vidéo, audit visuel).

### Ajouté
- Site en trois langues : français, néerlandais (Belgique) et anglais (britannique), avec des
  adresses traduites (`/fr/moustiquaires`, `/nl/horren`, `/en/insect-screens`…).
- Sélecteur de langue (en-tête, menu mobile, pied de page) : il mène à la même page dans
  l'autre langue et mémorise le choix.
- Page racine de choix de langue (redirection selon la langue du navigateur).
- Balises `hreflang`, sitemap multilingue, images de partage par langue et par modèle.
- Assistant capable de comprendre et de répondre en néerlandais et en anglais.
- Tests : complétude des traductions, variables et mise en forme, adresses, assistant multilingue.
- Documentation : `docs/I18N.md` (fonctionnement, glossaire, tableau de correspondance des adresses).

### Modifié
- Le film source « Test 1 .mp4 » est renommé `assets/video/aeris-film-master.mp4` (nom sans
  espace ; conservé comme original, non publié sur le site).
- Accueil : les sections « dilemme de l'été », « solutions par ouverture », bento « pourquoi
  Aéris », « toile à la loupe » et barre de réassurance sont remplacées par le nouveau récit
  (leurs informations sont reprises : engagements, modèles, étapes, sur-mesure).
- Le bouton de l'assistant a un nom accessible qui reprend son texte visible.
- Les adresses françaises sont désormais préfixées par `/fr` ; les anciennes redirigent
  (308 sur hébergement serveur, page de redirection sur GitHub Pages).
- Les formulaires et l'API renvoient des codes d'erreur, traduits dans la langue du visiteur.
- Les e-mails envoyés à l'équipe indiquent la langue du client.
- Le titre de la page « À propos » ne répète plus la marque.

### Corrigé
- La confirmation de commande et « Mes commandes » n'affirment plus qu'un e-mail
  d'instructions a été envoyé au client (aucun e-mail n'est envoyé par le site).
