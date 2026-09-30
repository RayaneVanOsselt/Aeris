import { z } from "zod";
import { frameColors, meshes, productOptions, products } from "@/lib/catalog";

/** Nettoie une chaîne : supprime les caractères de contrôle, espaces superflus. */
const clean = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max));

const required = (max: number, message: string) => clean(max).pipe(z.string().min(1, message));

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

const email = clean(160).pipe(z.email("Adresse e-mail invalide"));
const phone = clean(30).pipe(z.string().regex(/^[+0-9 ().-]{6,30}$/, "Numéro de téléphone invalide"));
/** Champ piège anti-robots : doit rester vide */
const honeypot = z.string().max(0).optional();

export const orderSchema = z.object({
  customer: z.object({
    firstName: required(80, "Prénom requis"),
    lastName: required(80, "Nom requis"),
    email,
    phone,
    street: required(160, "Adresse requise"),
    postalCode: clean(12).pipe(z.string().regex(/^[A-Za-z0-9 -]{3,12}$/, "Code postal invalide")),
    city: required(80, "Ville requise"),
    country: z.enum(["Belgique", "France", "Luxembourg", "Pays-Bas", "Allemagne", "Autre pays de l'UE"]),
    notes: clean(1000).optional(),
  }),
  items: z.array(configurationSchema).min(1, "Le panier est vide").max(30),
  paymentMethod: z.enum(["Revolut", "Virement SEPA"]),
  acceptTerms: z.literal(true, { error: "Veuillez accepter les conditions générales de vente" }),
  website: honeypot,
});

export const quoteSchema = z.object({
  name: required(120, "Nom requis"),
  email,
  phone: phone.optional().or(z.literal("")),
  postalCode: clean(12).optional(),
  openings: clean(20).optional(),
  message: clean(3000).pipe(z.string().min(10, "Décrivez votre projet en quelques mots (10 caractères minimum)")),
  configuration: configurationSchema.optional(),
  source: z.enum(["devis", "configurateur", "chatbot", "produit"]),
  consent: z.literal(true, { error: "Votre accord est nécessaire pour que nous puissions vous répondre" }),
  website: honeypot,
});

export const contactSchema = z.object({
  firstName: required(80, "Prénom requis"),
  lastName: required(80, "Nom requis"),
  email,
  phone: phone.optional().or(z.literal("")),
  subject: z.enum(["Question sur un produit", "Aide pour mes mesures", "Suivi de commande", "Service après-vente", "Autre"]),
  orderRef: clean(30).optional(),
  message: clean(3000).pipe(z.string().min(10, "Message trop court (10 caractères minimum)")),
  consent: z.literal(true, { error: "Votre accord est nécessaire pour que nous puissions vous répondre" }),
  website: honeypot,
});

export const paymentNoticeSchema = z.object({
  reference: clean(30).pipe(z.string().regex(/^AER-\d{6}-[A-Z0-9]{4}$/, "Référence invalide")),
  method: z.enum(["Revolut", "Virement SEPA"]),
});

export const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: clean(1200).pipe(z.string().min(1)) }))
    .min(1)
    .max(20),
  page: clean(120).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
