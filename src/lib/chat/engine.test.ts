import { describe, expect, it } from "vitest";
import { answer, parseDimensions } from "./engine";
import { FALLBACK } from "./types";

const ask = (content: string) => answer([{ role: "user", content }]);

describe("parseDimensions", () => {
  it("comprend les millimètres, centimètres et mètres", () => {
    expect(parseDimensions("1000 x 2150")).toEqual({ width: 1000, height: 2150 });
    expect(parseDimensions("80x120 cm")).toEqual({ width: 800, height: 1200 });
    expect(parseDimensions("1,2 m sur 2 m")).toEqual({ width: 1200, height: 2000 });
  });
});

describe("assistant local", () => {
  it("calcule un prix exact à partir du catalogue", () => {
    const r = ask("Combien coûte une plissée 1000x2150 mm ?");
    expect(r.reply).toContain("357");
    expect(r.actions[0]).toMatchObject({ type: "link", href: "/configurateur?modele=plissee&largeur=1000&hauteur=2150" });
  });
  it("oriente vers le bon modèle pour une porte-fenêtre", () => {
    expect(ask("Que me conseillez-vous pour ma porte-fenêtre ?").reply).toContain("plissée");
  });
  it("n'annonce que les moyens de paiement réels", () => {
    const r = ask("Je peux payer par carte ou PayPal ?");
    expect(r.reply).toContain("Revolut");
    expect(r.reply).not.toContain("PayPal**");
  });
  it("n'invente pas une garantie non confirmée", () => {
    expect(ask("Quelle est la garantie ?").reply).toBe(FALLBACK);
  });
  it("répond honnêtement quand il ne sait pas", () => {
    const r = ask("Avez-vous un showroom à Tokyo ?");
    expect(r.reply).toBe(FALLBACK);
    expect(r.actions.some((a) => a.type === "quote")).toBe(true);
  });
  it("refuse une estimation hors limites", () => {
    expect(ask("prix plissée 5000x2000 mm").reply).toContain("Maximum");
  });
});

describe("zones de livraison", () => {
  it("ne confirme pas une zone de livraison non validée", () => {
    expect(ask("Vous livrez au Japon ?").reply).toBe(FALLBACK);
  });
});
