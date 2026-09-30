import { describe, expect, it } from "vitest";
import { getProduct } from "./catalog";
import { checkDimension, checkDimensions, hasBlockingIssue } from "./validation";

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
    expect(issue?.fix?.value).toBe(800);
  });
  it("détecte une saisie en mètres", () => {
    const [issue] = checkDimension(window, "height", 1.2);
    expect(issue?.fix?.value).toBe(1200);
  });
  it("refuse au-delà du maximum et oriente vers Sur mesure +", () => {
    const [issue] = checkDimension(window, "width", 3000);
    expect(issue?.level).toBe("error");
    expect(issue?.message).toContain("Sur mesure +");
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
    expect(issues.some((i) => i.message.includes("inversé"))).toBe(true);
  });
});
