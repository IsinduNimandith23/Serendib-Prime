import type { Metadata, Viewport } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://serendibprime.lk"),
  title: {
    default: "Serendib Prime - Premium Sri Lankan Tinned Seafood, Ready in Minutes",
    template: "%s · Serendib Prime",
  },
  description:
    "Premium ready-to-eat Sri Lankan tinned seafood. Dried sprats tempered and curried the island way - bold, authentic flavour sealed fresh, ready in minutes. Islandwide delivery.",
  keywords: [
    "Sri Lankan food",
    "tinned fish",
    "canned fish",
    "tempered sprats",
    "dried sprats curry",
    "haal messo",
    "ready to eat",
    "Serendib Prime",
  ],
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Serendib Prime",
    title: "Serendib Prime - Premium Sri Lankan Tinned Seafood",
    description:
      "Ready-to-eat Sri Lankan tinned sprats - tempered & curried, sealed fresh. Ready in minutes.",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${karla.variable}`}>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
