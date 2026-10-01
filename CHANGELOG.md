# Journal des modifications

## Non publié

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
- Les adresses françaises sont désormais préfixées par `/fr` ; les anciennes redirigent
  (308 sur hébergement serveur, page de redirection sur GitHub Pages).
- Les formulaires et l'API renvoient des codes d'erreur, traduits dans la langue du visiteur.
- Les e-mails envoyés à l'équipe indiquent la langue du client.
- Le titre de la page « À propos » ne répète plus la marque.

### Corrigé
- La confirmation de commande et « Mes commandes » n'affirment plus qu'un e-mail
  d'instructions a été envoyé au client (aucun e-mail n'est envoyé par le site).
