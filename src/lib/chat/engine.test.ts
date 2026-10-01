import { describe, expect, it } from "vitest";
import type { Locale } from "@/i18n/config";
import { faqs } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { answer, parseDimensions } from "./engine";
import { chatLangs } from "./lang";

const ask = (content: string, locale: Locale = "fr") => answer([{ role: "user", content }], { locale, m: messages[locale], faq: faqs[locale] });
const FALLBACK = chatLangs.fr.fallback;

describe("parseDimensions", () => {
  it("comprend les millimètres, centimètres et mètres", () => {
    expect(parseDimensions("1000 x 2150")).toEqual({ width: 1000, height: 2150 });
    expect(parseDimensions("80x120 cm")).toEqual({ width: 800, height: 1200 });
    expect(parseDimensions("1,2 m sur 2 m")).toEqual({ width: 1200, height: 2000 });
  });
  it("comprend « op » (néerlandais) et « by » (anglais)", () => {
    expect(parseDimensions("1,2 m op 2 m")).toEqual({ width: 1200, height: 2000 });
    expect(parseDimensions("80 by 120 cm")).toEqual({ width: 800, height: 1200 });
  });
});

describe("assistant local", () => {
  it("calcule un prix exact à partir du catalogue", () => {
    const r = ask("Combien coûte une plissée 1000x2150 mm ?");
    expect(r.reply).toContain("357");
    expect(r.actions[0]).toMatchObject({ type: "link", href: "/fr/configurateur?modele=plissee&largeur=1000&hauteur=2150" });
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

describe("estimation directe", () => {
  it("chiffre une fenêtre donnée en centimètres", () => {
    const r = ask("prix fenêtre 80x120 cm ?");
    expect(r.reply).toMatch(/800 mm × 1.200 mm/);
    expect(r.reply).toContain("TTC");
  });
});

describe("assistant en néerlandais et en anglais", () => {
  it("chiffre une plissée en néerlandais, avec un lien vers le configurateur néerlandais", () => {
    const r = ask("Hoeveel kost een plissé hor van 1000x2150 mm?", "nl");
    expect(r.reply).toContain("357");
    expect(r.reply).toContain("incl. btw");
    expect(r.actions[0]).toMatchObject({ type: "link", href: "/nl/configurator?modele=plissee&largeur=1000&hauteur=2150" });
  });
  it("chiffre une plissée en anglais", () => {
    const r = ask("How much is a pleated screen 1000 by 2150 mm?", "en");
    expect(r.reply).toContain("€357");
    expect(r.reply).toContain("incl. VAT");
    expect(r.actions[0]).toMatchObject({ href: "/en/configurator?modele=plissee&largeur=1000&hauteur=2150" });
  });
  it("salue dans la langue du visiteur", () => {
    expect(ask("Hallo", "nl").reply).toBe(chatLangs.nl.replies.greeting);
    expect(ask("Hi there", "en").reply).toBe(chatLangs.en.replies.greeting);
  });
  it("ne prend pas « hinged » pour une salutation (« hi »)", () => {
    expect(ask("hinged door price", "en").reply).not.toBe(chatLangs.en.replies.greeting);
  });
  it("n'invente pas de garantie, dans aucune langue", () => {
    expect(ask("Welke garantie geven jullie?", "nl").reply).toBe(chatLangs.nl.fallback);
    expect(ask("What is the warranty?", "en").reply).toBe(chatLangs.en.fallback);
  });
  it("n'annonce que les moyens de paiement réels", () => {
    expect(ask("Kan ik met bancontact betalen?", "nl").reply).toContain("SEPA-overschrijving");
    expect(ask("Can I pay by card?", "en").reply).toContain("SEPA bank transfer");
  });
  it("oriente une porte-fenêtre vers la plissée", () => {
    expect(ask("Wat raadt u aan voor mijn raamdeur?", "nl").reply).toContain("plissé hor");
    expect(ask("What do you recommend for my French door?", "en").reply).toContain("pleated");
  });
  it("répond à partir de la FAQ traduite", () => {
    expect(ask("Is er een minimale bestelling?", "nl").reply).toContain("één enkele hor");
    expect(ask("Is there a minimum order?", "en").reply).toContain("single screen");
  });
});
