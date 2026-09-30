import { describe, expect, it } from "vitest";
import { getProduct, products } from "./catalog";
import { computePrice, startingPrice } from "./pricing";

const base = { productId: "fenetre", width: 1000, height: 1000, meshId: "fibre", colorId: "blanc", optionIds: [] as string[], quantity: 1 };

describe("computePrice (formule de l'ancien configurateur)", () => {
  it("calcule base + surface × prix/m² × coefficient toile", () => {
    // 69 + 1 m² × 48 × 1 = 117
    expect(computePrice(base).unit).toBe(117);
  });
  it("applique le coefficient de la toile", () => {
    // 69 + 1 × 48 × 1,35 = 133,8 → 134
    expect(computePrice({ ...base, meshId: "alu" }).unit).toBe(134);
  });
  it("ajoute le supplément RAL et les options", () => {
    // 117 + 25 (RAL) + 19 + 12 = 173
    expect(computePrice({ ...base, colorId: "ral", optionIds: ["poignee", "brosse"] }).unit).toBe(173);
  });
  it("multiplie par la quantité et calcule la TVA incluse (21 %)", () => {
    const p = computePrice({ ...base, quantity: 3 });
    expect(p.total).toBe(351);
    expect(p.vat).toBe(61);
  });
  it("refuse une configuration inconnue", () => {
    expect(() => computePrice({ ...base, productId: "inconnu" })).toThrow();
  });
});

describe("startingPrice", () => {
  it("correspond au prix des plus petites dimensions en toile standard", () => {
    const fenetre = getProduct("fenetre")!;
    expect(startingPrice(fenetre)).toBe(computePrice({ ...base, width: 200, height: 200 }).unit);
  });
  it("est défini pour chaque modèle", () => {
    for (const p of products) expect(startingPrice(p)).toBeGreaterThan(0);
  });
});
