// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AuthProvider } from "@/app/providers/AuthProvider";
import AnalyticsLoader from "@/app/components/AnalyticsLoader";
import CookieBanner from "@/app/components/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://fullportlabs.com"),

  title: {
    default: "FullPort",
    template: "%s | FullPort",
  },

  description: "Breaking crypto headlines, memecoins, and on-chain stories.",

  keywords: [
    "crypto",
    "bitcoin",
    "ethereum",
    "blockchain",
    "web3",
    "altcoins",
    "crypto news",
    "memecoins",
    "on-chain",
  ],

  authors: [{ name: "FullPort" }],
  creator: "FullPort",
  publisher: "FullPort",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fullportlabs.com",
    siteName: "FullPort",
    title: "FullPort",
    description: "Breaking crypto headlines, memecoins, and on-chain stories.",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "FullPort — Crypto News & Insights",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FullPort",
    description: "Breaking crypto headlines, memecoins, and on-chain stories.",
    images: ["/og-home.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>

        {/* ✅ Vercel Analytics only after consent.analytics === true */}
        <AnalyticsLoader />

        {/* ✅ Cookie banner + manage settings */}
        <CookieBanner />
      </body>
    </html>
  );
}
