import type { ProductId } from "@/lib/catalog";

/**
 * Pack de langue de l'assistant local : mots-clés reconnus (sans accents,
 * en minuscules) et réponses. Les faits (prix, délais, modèles) viennent
 * toujours du catalogue : seules les phrases changent d'une langue à l'autre.
 */
export type ChatLang = {
  fallback: string;
  keywords: {
    greeting: string[];
    human: string[];
    priceQuestion: string[];
    window: string[];
    frenchDoor: string[];
    bay: string[];
    door: string[];
    measure: string[];
    price: string[];
    payment: string[];
    delivery: string[];
    abroad: string[];
    leadTime: string[];
    warranty: string[];
    pollen: string[];
    pets: string[];
    sun: string[];
    mesh: string[];
    color: string[];
    orderTracking: string[];
  };
  /** Mots qui désignent chaque modèle */
  products: Record<ProductId, string[]>;
  /** Nom du modèle précédé de l'article indéfini, en minuscules (« une moustiquaire plissée ») */
  productPhrases: Record<ProductId, string>;
  /** Libellés des liens vers les pages du site */
  pages: { configurator: string; guide: string; catalog: string; finder: string; faq: string; contact: string; quote: string; orders: string };
  replies: {
    greeting: string;
    greetingSuggestions: string[];
    human: string;
    callback: string;
    checkInConfigurator: string;
    estimate: string;
    configureWithSizes: string;
    sizesNoProduct: string;
    sizesSuggestions: string[];
    product: string;
    productSuggestions: string[];
    configureProduct: string;
    seeProduct: string;
    frenchDoor: string;
    window: string;
    windowSuggestions: string[];
    bay: string;
    door: string;
    doorSuggestions: string[];
    doorModels: string;
    measure: string;
    price: string;
    priceSuggestions: string[];
    payment: string;
    leadTime: string;
    meshAdvice: string;
    meshes: string;
    configure: string;
    colors: string;
    orders: string;
  };
};
