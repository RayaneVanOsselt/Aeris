import { Fraunces, Geist, Geist_Mono } from "next/font/google";

// Polices auto-hébergées par next/font : aucune requête vers Google (RGPD) et pas de décalage de mise en page.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
// Polices secondaires non préchargées : elles ne retardent pas l'affichage du contenu principal
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

export const fontVariables = `${geist.variable} ${geistMono.variable} ${fraunces.variable}`;
