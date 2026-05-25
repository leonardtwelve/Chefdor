import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chefdor Cakes — Carnet de pâtisserie",
    template: "%s · Chefdor Cakes",
  },
  description:
    "Un carnet de recettes de pâtisserie, écrit à la main, photographié avec soin.",
  applicationName: "Chefdor Cakes",
  authors: [{ name: "Chefdor Cakes" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Chefdor Cakes",
    title: "Chefdor Cakes — Carnet de pâtisserie",
    description:
      "Un carnet de recettes de pâtisserie, écrit à la main, photographié avec soin.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chefdor Cakes",
    description: "Un carnet de recettes de pâtisserie.",
  },
  // Cadeau privé : on demande aux moteurs de ne pas indexer.
  // À retirer le jour où le site devient public.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
