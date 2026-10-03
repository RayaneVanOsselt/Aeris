import type { MetadataRoute } from "next";
import { basePath } from "@/lib/deploy";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aéris — Moustiquaires sur mesure",
    short_name: "Aéris",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#f6f4ee",
    theme_color: "#0a1631",
    icons: [{ src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
