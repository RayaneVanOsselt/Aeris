import { ogSize, renderOg } from "@/lib/og";

export const alt = "Aéris — Moustiquaires sur mesure pour fenêtres, portes et baies";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Moustiquaires sur mesure", title: "Fenêtres ouvertes, insectes dehors.", subtitle: "Configurez la vôtre, prix en temps réel." });
}
