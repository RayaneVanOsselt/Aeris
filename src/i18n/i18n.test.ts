import { describe, expect, it } from "vitest";
import { locales } from "./config";
import { faqs } from "./faq";
import { messages } from "./messages";
import { allTargets, alternatesFor, pathFor, resolvePath, splitPath } from "./routes";

/** Toutes les chaînes d'un objet, avec leur chemin (« catalog.products.fenetre.name »). */
function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
}

const variables = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const markers = (s: string) => ({ links: (s.match(/\[[^\]]+\]/g) ?? []).length, accents: (s.match(/(?<!\*)\*[^*]+\*(?!\*)/g) ?? []).length, bold: (s.match(/\*\*[^*]+\*\*/g) ?? []).length, lines: (s.match(/\n/g) ?? []).length });

describe("dictionnaires", () => {
  const fr = new Map(strings(messages.fr));

  for (const locale of locales.filter((l) => l !== "fr")) {
    const other = new Map(strings(messages[locale]));

    it(`${locale} : mêmes clés que le français`, () => {
      expect([...other.keys()].sort()).toEqual([...fr.keys()].sort());
    });

    it(`${locale} : mêmes variables {…} et même mise en forme que le français`, () => {
      for (const [path, source] of fr) {
        const target = other.get(path) ?? "";
        expect(variables(target), path).toEqual(variables(source));
        expect(markers(target), path).toEqual(markers(source));
      }
    });

    it(`${locale} : aucun texte vide ni resté en français`, () => {
      // Noms propres, codes et mots identiques dans les trois langues
      const same =
        /^(Aéris|FAQ|Contact|Premium|IBAN|Aluminium|Revolut|mm|Menu|Configurator|Standard|Model|Options|Luxembourg|France|RAL|1|, |%s · Aéris|E-mail|Garanties|Anti-pollen|Anthracite|Confirmation|Message|Questions|.*\{.*)$|^aeris_|AER-|^\d\d:\d\d$|^Aéris — /;
      const untranslated = [...fr].filter(([path, source]) => {
        const target = other.get(path) ?? "";
        return target.trim() === "" || (target === source && !same.test(source));
      });
      expect(untranslated).toEqual([]);
    });
  }
});

describe("FAQ", () => {
  it("mêmes catégories et même nombre de questions dans chaque langue", () => {
    const shape = (l: (typeof locales)[number]) => faqs[l].map((c) => [c.id, c.items.length, c.items.filter((i) => i.home).length]);
    for (const l of locales) expect(shape(l)).toEqual(shape("fr"));
  });
});

describe("adresses traduites", () => {
  it("chaque page de chaque langue se retrouve à partir de son adresse", () => {
    for (const locale of locales) {
      for (const target of allTargets()) {
        const { locale: found, segments } = splitPath(pathFor(locale, target));
        expect(found).toBe(locale);
        expect(resolvePath(locale, segments)).toEqual(target);
      }
    }
  });
  it("deux pages ne partagent jamais la même adresse", () => {
    const paths = locales.flatMap((l) => allTargets().map((t) => pathFor(l, t)));
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("les adresses sont courtes et sûres (minuscules, chiffres, tirets)", () => {
    for (const path of locales.flatMap((l) => allTargets().map((t) => pathFor(l, t)))) expect(path).toMatch(/^\/(fr|nl|en)(\/[a-z0-9-]+)*$/);
  });
  it("les adresses françaises restent celles de la version précédente, préfixées par /fr", () => {
    expect(pathFor("fr", { key: "product", id: "plissee" })).toBe("/fr/produits/moustiquaire-plissee");
    expect(pathFor("fr", { key: "category", id: "portes-et-baies" })).toBe("/fr/moustiquaires/portes-et-baies");
  });
  it("relie la même page dans les trois langues", () => {
    expect(alternatesFor({ key: "product", id: "plissee" })).toEqual({
      fr: "/fr/produits/moustiquaire-plissee",
      nl: "/nl/producten/plissehor",
      en: "/en/products/pleated-insect-screen",
    });
  });
  it("une adresse inconnue n'est rattachée à aucune page", () => {
    expect(resolvePath("nl", ["moustiquaires"])).toBeNull();
    expect(resolvePath("en", ["products", "inconnu"])).toBeNull();
  });
});
