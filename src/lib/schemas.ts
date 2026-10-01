import { z } from "zod";
import { locales } from "@/i18n/config";
import type { ErrorCode } from "@/i18n/messages";
import { frameColors, meshes, productOptions, products } from "@/lib/catalog";
import { payment } from "@/lib/business";
import { contactSubjects, countries, openingCounts } from "@/lib/form-options";

/**
 * Schémas de validation (navigateur ET serveur). Les messages d'erreur
 * sont des codes (messages.errors) : chaque langue les traduit à l'affichage.
 */
const code = (c: ErrorCode) => ({ error: c });

/** Nettoie une chaîne : supprime les caractères de contrôle, espaces superflus. */
const clean = (max: number, error: ErrorCode = "required") =>
  z
    .string(code(error))
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, code("invalid")));

const required = (max: number, error: ErrorCode) => clean(max, error).pipe(z.string().min(1, code(error)));

export const configurationSchema = z.object({
  productId: z.enum(products.map((p) => p.id) as [string, ...string[]]),
  width: z.number().int().min(1).max(10000),
  height: z.number().int().min(1).max(10000),
  meshId: z.enum(meshes.map((m) => m.id) as [string, ...string[]]),
  colorId: z.enum(frameColors.map((c) => c.id) as [string, ...string[]]),
  ralCode: z.string().regex(/^\d{4}$/).optional(),
  optionIds: z.array(z.enum(productOptions.map((o) => o.id) as [string, ...string[]])).max(productOptions.length),
  quantity: z.number().int().min(1).max(20),
  label: clean(40).optional(),
});

const email = clean(160, "emailRequired").pipe(z.email(code("email")));
const phone = clean(30, "phoneRequired").pipe(z.string().regex(/^[+0-9 ().-]{6,30}$/, code("phone")));
/** Champ piège anti-robots : doit rester vide */
const honeypot = z.string().max(0).optional();
/** Langue du visiteur : l'équipe sait dans quelle langue répondre */
const locale = z.enum(locales).optional();

export const orderSchema = z.object({
  customer: z.object({
    firstName: required(80, "firstName"),
    lastName: required(80, "lastName"),
    email,
    phone,
    street: required(160, "street"),
    postalCode: clean(12, "postalCode").pipe(z.string().regex(/^[A-Za-z0-9 -]{3,12}$/, code("postalCode"))),
    city: required(80, "city"),
    country: z.enum(countries),
    notes: clean(1000).optional(),
  }),
  items: z.array(configurationSchema).min(1, code("cartEmpty")).max(30),
  paymentMethod: z.enum(payment.methods),
  acceptTerms: z.literal(true, code("terms")),
  locale,
  website: honeypot,
});

export const quoteSchema = z.object({
  name: required(120, "name"),
  email,
  phone: phone.optional().or(z.literal("")),
  postalCode: clean(12).optional(),
  openings: z.enum(openingCounts).optional(),
  message: clean(3000).pipe(z.string().min(10, code("projectShort"))),
  configuration: configurationSchema.optional(),
  source: z.enum(["devis", "configurateur", "chatbot", "produit"]),
  consent: z.literal(true, code("consent")),
  locale,
  website: honeypot,
});

export const contactSchema = z.object({
  firstName: required(80, "firstName"),
  lastName: required(80, "lastName"),
  email,
  phone: phone.optional().or(z.literal("")),
  subject: z.enum(contactSubjects),
  orderRef: clean(30).optional(),
  message: clean(3000).pipe(z.string().min(10, code("messageShort"))),
  consent: z.literal(true, code("consent")),
  locale,
  website: honeypot,
});

export const paymentNoticeSchema = z.object({
  reference: clean(30, "reference").pipe(z.string().regex(/^AER-\d{6}-[A-Z0-9]{4}$/, code("reference"))),
  method: z.enum(payment.methods),
  locale,
});

export const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: clean(1200).pipe(z.string().min(1)) }))
    .min(1)
    .max(20),
  page: clean(120).optional(),
  locale,
});

export type OrderInput = z.infer<typeof orderSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PaymentNoticeInput = z.infer<typeof paymentNoticeSchema>;

/** Erreurs de validation → { champ: code } (le premier problème de chaque champ). */
export function fieldErrors(issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of issues) fields[issue.path.map(String).join(".")] ??= issue.message;
  return fields;
}
