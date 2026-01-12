// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AuthProvider } from "@/app/providers/AuthProvider";
import AnalyticsLoader from "@/app/components/AnalyticsLoader";
import CookieBanner from "@/app/components/CookieBanner";

const SITE_URL = "https://www.fullportlabs.com"; // ⬅️ promijeni na https://fullportlabs.com ako ti je primarno bez www
const SITE_NAME = "FullPort";
const DEFAULT_TITLE = "FullPort";
const DEFAULT_DESC = "Breaking crypto headlines, memecoins, and on-chain stories.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: "%s | " + SITE_NAME,
  },

  description: DEFAULT_DESC,

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

  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [
      {
        url: "/og-home.jpg", // ⬅️ mora postojati u /public/og-home.jpg
        width: 1200,
        height: 630,
        alt: "FullPort — your daily crypto dose",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [
      {
        url: "/og-home.jpg",
        alt: "FullPort — your daily crypto dose",
      },
    ],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // ⬅️ stavi u /public/apple-touch-icon.png (180x180)
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

        {/* Vercel Analytics only after consent.analytics === true */}
        <AnalyticsLoader />

        {/* Cookie banner + manage settings */}
        <CookieBanner />
      </body>
    </html>
  );
}
