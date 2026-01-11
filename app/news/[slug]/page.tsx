// app/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import ArticleViewClient from "./ArticleViewClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function fetchArticle(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl) return null;

  const res = await fetch(
    `${baseUrl}/api/articles?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate=coverImage&populate=category&pagination[pageSize]=1`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.data?.[0] ?? null;
}

export default async function NewsSlugPage({ params }: PageProps) {
  // 🔑 KLJUČNA LINIJA
  const { slug } = await params;

  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  return <ArticleViewClient article={article} />;
}
