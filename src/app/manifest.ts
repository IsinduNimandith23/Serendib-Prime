import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Serendib Prime",
    short_name: "Serendib Prime",
    description:
      "Premium ready-to-eat Sri Lankan tinned seafood, delivered islandwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ee",
    theme_color: "#fbf6ee",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
