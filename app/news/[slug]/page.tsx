// app/news/[slug]/page.tsx
import type { Metadata } from "next";
import NewsSlugClient from "./NewsSlugClient";

const SITE_URL = "https://www.fullportlabs.com";

function absolutizeStrapiUrl(maybeRelativeUrl: string | null | undefined) {
  if (!maybeRelativeUrl) return null;
  if (maybeRelativeUrl.startsWith("http")) return maybeRelativeUrl;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  return base ? `${base}${maybeRelativeUrl}` : maybeRelativeUrl;
}

function pickBestUrlFromAttributes(attrs: any): string | null {
  if (!attrs) return null;
  const formats = attrs.formats;
  const tryKeys = ["large", "medium", "small", "thumbnail"];
  if (formats && typeof formats === "object") {
    for (const k of tryKeys) {
      const u = formats?.[k]?.url;
      if (typeof u === "string") return absolutizeStrapiUrl(u);
    }
  }
  const direct = attrs.url;
  if (typeof direct === "string") return absolutizeStrapiUrl(direct);
  return null;
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;
  if (Array.isArray(media)) return pickMediaUrl(media[0]);

  if (media && typeof media === "object" && typeof media.url === "string") {
    const best = pickBestUrlFromAttributes(media);
    return best ?? absolutizeStrapiUrl(media.url);
  }

  const v4attrs = media?.data?.attributes;
  const v4best = pickBestUrlFromAttributes(v4attrs);
  if (v4best) return v4best;

  const v4arrAttrs = media?.data?.[0]?.attributes;
  const v4arrBest = pickBestUrlFromAttributes(v4arrAttrs);
  if (v4arrBest) return v4arrBest;

  return null;
}

function flattenArticleEntity(entity: any) {
  if (!entity) return null;
  if (typeof entity?.id === "number" && entity?.title && entity?.slug) return entity;

  const id = entity?.id;
  const attrs = entity?.attributes;
  if (typeof id !== "number" || !attrs) return null;

  return {
    id,
    documentId: attrs?.documentId,
    title: attrs?.title ?? "",
    slug: attrs?.slug ?? "",
    excerpt: attrs?.excerpt ?? null,
    content: attrs?.content ?? null,
    publishedAt: attrs?.publishedAt ?? null,
    coverImage: attrs?.coverImage ?? null,
    category: attrs?.category ?? null,
  };
}

async function fetchArticleForMeta(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl) return null;

  const url =
    `${baseUrl}/api/articles?` +
    `filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate[coverImage]=true&populate[category]=true` +
    `&pagination[pageSize]=1`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = await res.json();
  const entity = json?.data?.[0] ?? null;
  return flattenArticleEntity(entity);
}

// ✅ Next 15: params can be a Promise
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const a = await fetchArticleForMeta(slug);

  const title = a?.title ? `${a.title} | FullPort` : "FullPort";
  const description = a?.excerpt ?? "Breaking crypto headlines, memecoins, and on-chain stories.";

  const coverUrl = a ? pickMediaUrl(a.coverImage) : null;
  const ogImage = coverUrl ?? `${SITE_URL}/og-home.jpg`;

  const canonical = `${SITE_URL}/news/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      type: "article",
      url: canonical,
      siteName: "FullPort",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: a?.title ?? "FullPort",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function NewsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <NewsSlugClient slug={slug} />;
}
