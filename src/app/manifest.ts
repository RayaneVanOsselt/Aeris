import type { MetadataRoute } from "next";
import { basePath } from "@/lib/deploy";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aéris — Moustiquaires sur mesure",
    short_name: "Aéris",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#f3efe7",
    theme_color: "#0d1a2e",
    icons: [{ src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
