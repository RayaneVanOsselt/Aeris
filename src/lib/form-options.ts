/**
 * Valeurs des listes de choix des formulaires. Ce sont aussi les valeurs
 * transmises à l'équipe (en français) ; les libellés affichés sont traduits
 * dans messages.checkout.countries, messages.forms.contact.subjects, etc.
 * Module volontairement léger : importé par les formulaires sans charger Zod.
 */
export const countries = ["Belgique", "France", "Luxembourg", "Pays-Bas", "Allemagne", "Autre pays de l'UE"] as const;
export const contactSubjects = ["Question sur un produit", "Aide pour mes mesures", "Suivi de commande", "Service après-vente", "Autre"] as const;
export const openingCounts = ["1", "2 à 3", "4 à 6", "7 ou plus"] as const;
