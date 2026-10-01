import { describe, expect, it } from "vitest";
import { messages } from "@/i18n/messages";
import { contactSchema, fieldErrors, orderSchema } from "./schemas";

describe("schémas de formulaires", () => {
  it("renvoient des codes d'erreur traduisibles, jamais du texte", () => {
    const parsed = contactSchema.safeParse({ firstName: "", lastName: "", email: "x", subject: "Autre", message: "court", consent: false });
    expect(parsed.success).toBe(false);
    const fields = fieldErrors(parsed.error!.issues);
    expect(fields).toMatchObject({ firstName: "firstName", lastName: "lastName", email: "email", message: "messageShort", consent: "consent" });
    for (const code of Object.values(fields)) expect(Object.keys(messages.nl.errors)).toContain(code);
  });
  it("acceptent la langue du visiteur et refusent une langue inconnue", () => {
    const base = {
      customer: { firstName: "A", lastName: "B", email: "a@b.be", phone: "+32 470 00 00 00", street: "Rue 1", postalCode: "1000", city: "Bruxelles", country: "Belgique" },
      items: [{ productId: "fenetre", width: 800, height: 1200, meshId: "fibre", colorId: "blanc", optionIds: [], quantity: 1 }],
      paymentMethod: "Revolut",
      acceptTerms: true,
    };
    expect(orderSchema.safeParse({ ...base, locale: "nl" }).success).toBe(true);
    expect(orderSchema.safeParse({ ...base, locale: "de" }).success).toBe(false);
  });
});
