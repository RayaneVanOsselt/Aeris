import { frameColors, getProduct, meshes, productOptions } from "./catalog";
import type { Configuration } from "./pricing";
import { checkDimensions, hasBlockingIssue } from "./validation";

/** Modèle, dimensions, toile & coloris, options, récapitulatif (libellés : messages.configurator.steps) */
export const STEP_COUNT = 5;
export type StepIndex = 0 | 1 | 2 | 3 | 4;

export type ConfiguratorState = {
  step: StepIndex;
  maxStep: StepIndex;
  productId: string | null;
  width: string;
  height: string;
  meshId: string;
  colorId: string;
  ralCode: string;
  optionIds: string[];
  quantity: number;
  label: string;
};

export const initialState: ConfiguratorState = {
  step: 0,
  maxStep: 0,
  productId: null,
  width: "",
  height: "",
  meshId: "fibre",
  colorId: "blanc",
  ralCode: "",
  optionIds: [],
  quantity: 1,
  label: "",
};

const RAL_PATTERN = /^\d{4}$/;
export const isValidRal = (code: string) => code === "" || RAL_PATTERN.test(code.trim());

export function parseNumber(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Lit l'état depuis l'URL (lien partagé, fiche produit, aide au choix). Toute valeur inconnue est ignorée. */
export function parseParams(params: URLSearchParams): ConfiguratorState {
  const state = { ...initialState };
  const product = getProduct(params.get("modele") ?? "");
  if (product) {
    state.productId = product.id;
    state.width = String(product.defaultSize.width);
    state.height = String(product.defaultSize.height);
    state.step = 1;
    state.maxStep = 1;
  }
  const w = params.get("largeur");
  const h = params.get("hauteur");
  if (w && /^\d{2,5}$/.test(w)) state.width = w;
  if (h && /^\d{2,5}$/.test(h)) state.height = h;
  const mesh = params.get("toile");
  if (mesh && meshes.some((m) => m.id === mesh)) state.meshId = mesh;
  const color = params.get("coloris");
  if (color && frameColors.some((c) => c.id === color)) state.colorId = color;
  const ral = params.get("ral");
  if (ral && RAL_PATTERN.test(ral)) state.ralCode = ral;
  const opts = params.get("options");
  if (opts) state.optionIds = opts.split(",").filter((o) => productOptions.some((p) => p.id === o));
  const qty = Number(params.get("qte"));
  if (Number.isInteger(qty) && qty >= 1 && qty <= 20) state.quantity = qty;
  return state;
}

export function toParams(state: ConfiguratorState): string {
  const p = new URLSearchParams();
  if (state.productId) p.set("modele", state.productId);
  if (state.width) p.set("largeur", state.width);
  if (state.height) p.set("hauteur", state.height);
  if (state.meshId !== initialState.meshId) p.set("toile", state.meshId);
  if (state.colorId !== initialState.colorId) p.set("coloris", state.colorId);
  if (state.colorId === "ral" && state.ralCode) p.set("ral", state.ralCode);
  if (state.optionIds.length) p.set("options", state.optionIds.join(","));
  if (state.quantity !== 1) p.set("qte", String(state.quantity));
  return p.toString();
}

/** Configuration complète et valide, ou null. */
export function toConfiguration(state: ConfiguratorState): Configuration | null {
  const product = state.productId ? getProduct(state.productId) : undefined;
  const width = parseNumber(state.width);
  const height = parseNumber(state.height);
  if (!product || width === null || height === null) return null;
  if (hasBlockingIssue(checkDimensions(product, width, height))) return null;
  if (state.colorId === "ral" && !isValidRal(state.ralCode)) return null;
  return {
    productId: product.id,
    width: Math.round(width),
    height: Math.round(height),
    meshId: state.meshId,
    colorId: state.colorId,
    ralCode: state.colorId === "ral" && state.ralCode ? state.ralCode.trim() : undefined,
    optionIds: state.optionIds,
    quantity: state.quantity,
    label: state.label.trim() || undefined,
  };
}

/** Une étape est-elle complète (autorise « Continuer ») ? */
export function isStepValid(state: ConfiguratorState, step: StepIndex): boolean {
  switch (step) {
    case 0:
      return !!state.productId;
    case 1: {
      const product = state.productId ? getProduct(state.productId) : undefined;
      if (!product) return false;
      return !hasBlockingIssue(checkDimensions(product, parseNumber(state.width), parseNumber(state.height)));
    }
    case 2:
      return state.colorId !== "ral" || isValidRal(state.ralCode);
    case 3:
      return state.quantity >= 1 && state.quantity <= 20;
    default:
      return toConfiguration(state) !== null;
  }
}

export type Action =
  | { type: "set"; patch: Partial<ConfiguratorState> }
  | { type: "selectProduct"; productId: string }
  | { type: "toggleOption"; id: string }
  | { type: "goto"; step: StepIndex };

export function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch };
    case "selectProduct": {
      const product = getProduct(action.productId);
      if (!product) return state;
      const keepDims = state.productId !== null && state.width !== "" && state.height !== "";
      return {
        ...state,
        productId: product.id,
        width: keepDims ? state.width : String(product.defaultSize.width),
        height: keepDims ? state.height : String(product.defaultSize.height),
      };
    }
    case "toggleOption":
      return {
        ...state,
        optionIds: state.optionIds.includes(action.id) ? state.optionIds.filter((o) => o !== action.id) : [...state.optionIds, action.id],
      };
    case "goto": {
      // On ne saute jamais une étape incomplète
      for (let s = 0; s < action.step; s++) if (!isStepValid(state, s as StepIndex)) return { ...state, step: s as StepIndex };
      return { ...state, step: action.step, maxStep: Math.max(state.maxStep, action.step) as StepIndex };
    }
  }
}
