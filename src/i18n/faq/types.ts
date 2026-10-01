export type FaqItem = { q: string; a: string; home?: boolean };
export type FaqCategoryId = "produits" | "mesures" | "commande" | "livraison" | "installation" | "garantie";
export type FaqCategory = { id: FaqCategoryId; title: string; items: FaqItem[] };
