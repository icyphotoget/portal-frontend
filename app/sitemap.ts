import type { MetadataRoute } from "next";

type Article = {
  slug: string;
  updatedAt?: string;
};

function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return "https://www.fullportlabs.com"; // nikad localhost u prod
  return url.replace(/\/+$/, ""); // ukloni trailing /
}

async function fetchAllArticleSlugs(): Promise<Article[]> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl) return [];

  const url =
    `${baseUrl}/api/articles?fields[0]=slug&fields[1]=updatedAt&pagination[pageSize]=1000`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json();

    return (
      json.data?.map((a: any) => ({
        slug: a?.attributes?.slug ?? a?.slug, // fallback ako ti je custom shape
        updatedAt: a?.attributes?.updatedAt ?? a?.updatedAt,
      }))
      .filter((x: Article) => typeof x.slug === "string" && x.slug.length > 0) ?? []
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const articles = await fetchAllArticleSlugs();

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now },
    { url: `${siteUrl}/news`, lastModified: now },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/news/${encodeURIComponent(article.slug)}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
  }));

  return [...staticRoutes, ...articleRoutes];
}
