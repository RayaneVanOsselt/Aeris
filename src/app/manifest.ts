import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aéris — Moustiquaires sur mesure",
    short_name: "Aéris",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ee",
    theme_color: "#0a1631",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
