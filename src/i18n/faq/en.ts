/**
 * FAQ — English (translated from fr.ts). Same categories and order.
 * To be proofread by a native speaker before publication.
 */
import type { FaqCategory } from "./types";

export const en: FaqCategory[] = [
  {
    id: "produits",
    title: "Choosing your model",
    items: [
      {
        q: "Which insect screen should I choose for my opening?",
        a: "For a window you open often, the clip-on window insect screen is the most versatile; for a window you rarely open, the fixed frame screen is the most affordable. For a door you use every day: retractable or hinged. For a French door or a patio door: pleated or sliding. Our Help me choose tool guides you in three questions.",
        home: true,
      },
      {
        q: "Which meshes do you offer?",
        a: "Fibreglass (standard), aluminium, anti-pollen, pet-resistant (Pet) for homes with animals, and solar shading. You choose in the configurator, and the effect on the price is shown immediately.",
      },
      {
        q: "Can I choose a specific RAL colour?",
        a: "Yes. As well as the standard colours (white, anthracite, brown, sand, matt black), the ‘Custom RAL’ option lets you match the screen to your windows and doors.",
      },
      {
        q: "Do you handle special shapes or very large sizes?",
        a: "Yes, through our Custom + service: very large sizes, unusual shapes (arches, trapezoids) and special fitting conditions each receive a personal study.",
      },
    ],
  },
  {
    id: "mesures",
    title: "Measuring",
    items: [
      {
        q: "How do I take my measurements?",
        a: "Measure the width and height of the opening in millimetres, at several points. Our measuring guide covers every case. If in doubt, send us a photo: we check every configuration before manufacturing.",
        home: true,
      },
      {
        q: "What are the minimum and maximum sizes?",
        a: "The configurator accepts widths from 200 to 2,400 mm and heights from 200 to 2,600 mm. Beyond that, our Custom + service will study your project.",
      },
      {
        q: "What if I got my measurements wrong?",
        a: "Contact us as soon as possible: as long as manufacturing hasn't started, we can correct the sizes.",
      },
    ],
  },
  {
    id: "commande",
    title: "Ordering & payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Configure your screen, add it to your basket, then enter your details. You will then receive the payment instructions. No account is needed.",
      },
      {
        q: "Which payment methods do you accept?",
        a: "Revolut and SEPA bank transfer. Your bank details never pass through our site. Manufacturing starts once payment is received.",
        home: true,
      },
      {
        q: "Do you provide quotes?",
        a: "Yes. Send us your project from the configurator or the quote page: we will come back to you with a no-obligation proposal.",
      },
      {
        q: "Can I change my order?",
        a: "As long as manufacturing hasn't started, contact us with your order reference: we will adjust sizes or finishes where possible.",
      },
      {
        q: "Is there a minimum order?",
        a: "No, you can order a single screen.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Lead times & delivery",
    items: [
      {
        q: "What are the lead times?",
        a: "Manufacturing time depends on the model and is shown in the configurator (5 to 25 working days depending on the model). The delivery date is confirmed to you by email.",
        home: true,
      },
      {
        q: "Where do you deliver?",
        a: "In Belgium and across the European Union. Delivery costs and date are confirmed to you before manufacturing.",
      },
      {
        q: "What if my parcel arrives damaged?",
        a: "Note your reservations with the carrier and contact us quickly with photos: we will find a solution.",
      },
    ],
  },
  {
    id: "installation",
    title: "Fitting & care",
    items: [
      {
        q: "Is fitting difficult?",
        a: "No. Every screen comes with its instructions. The window insect screen clips on without drilling, and the magnetic screen curtain goes up without tools.",
        home: true,
      },
      {
        q: "Do you offer home fitting?",
        a: "In some areas. Mention it in your quote request to find out whether it is available near you.",
      },
      {
        q: "How do I clean the mesh?",
        a: "A damp sponge is enough. The framed models can be removed for a thorough clean or for storage over winter.",
      },
    ],
  },
  {
    id: "garantie",
    title: "Warranty & returns",
    items: [
      {
        q: "What is the warranty?",
        a: "Parts and mechanisms are guaranteed for 5 years under normal conditions of use. Accidental damage and wear caused by poor maintenance are not covered.",
        home: true,
      },
      {
        q: "Can I return a made-to-measure screen?",
        a: "Made-to-measure products are not covered by the standard right of withdrawal, except in the case of a defect. That's why we check every configuration before manufacturing.",
      },
      {
        q: "What happens if we make a mistake?",
        a: "If the screen does not match your confirmed order, we will remake it at our expense.",
      },
    ],
  },
];
