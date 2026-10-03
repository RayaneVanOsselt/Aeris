import { Fraunces, Geist } from "next/font/google";

/*
 * Deux familles, auto-hébergées par next/font (aucune requête vers Google, RGPD) :
 * - Fraunces : serif éditoriale des titres (variable : taille optique) ;
 * - Geist : sans-serif fonctionnelle (texte, interface, chiffres).
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const fontVariables = `${fraunces.variable} ${geist.variable}`;
