import { describe, expect, it } from "vitest";
import { initialState, isStepValid, parseParams, reducer, toConfiguration, toParams } from "./configurator";

describe("parseParams / toParams", () => {
  it("lit un lien partagé et le reproduit", () => {
    const state = parseParams(new URLSearchParams("modele=plissee&largeur=1000&hauteur=2150&toile=pet&coloris=ral&ral=7016&options=brosse&qte=2"));
    expect(state.productId).toBe("plissee");
    expect(state.step).toBe(1);
    expect(toParams(state)).toBe("modele=plissee&largeur=1000&hauteur=2150&toile=pet&coloris=ral&ral=7016&options=brosse&qte=2");
  });
  it("ignore les valeurs inconnues ou malveillantes", () => {
    const state = parseParams(new URLSearchParams("modele=<script>&toile=xyz&options=hack,brosse&qte=999&largeur=abc"));
    expect(state.productId).toBeNull();
    expect(state.meshId).toBe("fibre");
    expect(state.optionIds).toEqual(["brosse"]);
    expect(state.quantity).toBe(1);
    expect(state.width).toBe("");
  });
});

describe("reducer", () => {
  it("empêche de sauter une étape incomplète", () => {
    const s = reducer(initialState, { type: "goto", step: 3 });
    expect(s.step).toBe(0);
  });
  it("pré-remplit les dimensions habituelles du modèle choisi", () => {
    const s = reducer(initialState, { type: "selectProduct", productId: "enroulable" });
    expect(s.width).toBe("900");
    expect(s.height).toBe("2100");
  });
});

describe("toConfiguration", () => {
  it("refuse des dimensions hors limites", () => {
    const s = { ...reducer(initialState, { type: "selectProduct", productId: "fenetre" }), width: "5000" };
    expect(toConfiguration(s)).toBeNull();
    expect(isStepValid(s, 1)).toBe(false);
  });
  it("exige un code RAL à 4 chiffres s'il est saisi", () => {
    const s = { ...reducer(initialState, { type: "selectProduct", productId: "fenetre" }), colorId: "ral", ralCode: "70A6" };
    expect(isStepValid(s, 2)).toBe(false);
  });
  it("produit une configuration complète", () => {
    const s = reducer(initialState, { type: "selectProduct", productId: "fenetre" });
    expect(toConfiguration(s)).toMatchObject({ productId: "fenetre", width: 800, height: 1200, quantity: 1 });
  });
});
