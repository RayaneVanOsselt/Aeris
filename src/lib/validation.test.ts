import { describe, expect, it } from "vitest";
import { formatters } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { getProduct } from "./catalog";
import { checkDimension, checkDimensions, describeIssue, hasBlockingIssue } from "./validation";

const window = getProduct("fenetre")!;
const door = getProduct("enroulable")!;

describe("checkDimension", () => {
  it("accepte une valeur dans les limites", () => {
    expect(checkDimension(window, "width", 800)).toEqual([]);
  });
  it("refuse une valeur manquante", () => {
    expect(checkDimension(window, "width", null)[0]?.level).toBe("error");
  });
  it("détecte une saisie probable en centimètres et propose la conversion", () => {
    const [issue] = checkDimension(window, "width", 80);
    expect(issue?.level).toBe("error");
    expect(issue?.code).toBe("centimeters");
    expect(issue?.fix?.value).toBe(800);
  });
  it("détecte une saisie en mètres", () => {
    const [issue] = checkDimension(window, "height", 1.2);
    expect(issue?.code).toBe("meters");
    expect(issue?.fix?.value).toBe(1200);
  });
  it("refuse au-delà du maximum", () => {
    const [issue] = checkDimension(window, "width", 3000);
    expect(issue?.level).toBe("error");
    expect(issue?.code).toBe("max");
    expect(issue?.value).toBe(2400);
  });
  it("avertit (sans bloquer) d'une hauteur inhabituelle pour une porte", () => {
    const issues = checkDimension(door, "height", 900);
    expect(issues[0]?.level).toBe("warning");
    expect(hasBlockingIssue(issues)).toBe(false);
  });
});

describe("checkDimensions", () => {
  it("signale des proportions suspectes (largeur/hauteur inversées)", () => {
    const issues = checkDimensions(window, 2400, 400);
    expect(issues.some((i) => i.code === "ratio")).toBe(true);
  });
});

describe("describeIssue", () => {
  const [tooWide] = checkDimension(window, "width", 3000);
  const [inCm] = checkDimension(window, "width", 80);

  it("rédige le message en français, avec le renvoi vers Sur mesure +", () => {
    const { message } = describeIssue(tooWide!, messages.fr, formatters("fr"));
    expect(message).toMatch(/2\s400 mm/);
    expect(message).toContain("Sur mesure +");
  });
  it("rédige le même message dans chaque langue, avec les formats de nombre locaux", () => {
    expect(describeIssue(tooWide!, messages.nl, formatters("nl")).message).toContain("2.400");
    expect(describeIssue(tooWide!, messages.en, formatters("en")).message).toContain("2,400");
  });
  it("propose la correction en un clic", () => {
    expect(describeIssue(inCm!, messages.fr, formatters("fr")).fixLabel).toBe("Utiliser 800 mm");
  });
});
