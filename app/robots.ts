import type { MetadataRoute } from "next";

function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return (url && url.startsWith("http"))
    ? url.replace(/\/+$/, "")
    : "https://www.fullportlabs.com"; // hard fallback, NIKAD localhost
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
