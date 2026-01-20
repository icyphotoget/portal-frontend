"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StrapiBlocks from "@/app/components/StrapiBlocks";
import Comments from "@/app/components/Comments";
import RelatedArticles from "@/app/components/RelatedArticles";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

type Article = {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  publishedAt: string | null;
  coverImage?: any;
  category?: any;
  videoUrl?: string | null; // ✅ NEW FIELD
  videoCaption?: string | null; // optional
};

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

  if (media && typeof media === "object") {
    if (typeof media.url === "string") {
      const best = pickBestUrlFromAttributes(media);
      return best ?? absolutizeStrapiUrl(media.url);
    }
  }

  const v4attrs = media?.data?.attributes;
  const v4best = pickBestUrlFromAttributes(v4attrs);
  if (v4best) return v4best;

  const v4arrAttrs = media?.data?.[0]?.attributes;
  const v4arrBest = pickBestUrlFromAttributes(v4arrAttrs);
  if (v4arrBest) return v4arrBest;

  return null;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    })
  );
}

function getArticleCategory(a: any) {
  if (!a) return null;

  const direct = a?.category;
  if (direct?.name && direct?.slug) return direct;

  const rel = a?.category?.data;
  const attrs = rel?.attributes;
  if (attrs?.name && attrs?.slug) return { id: rel?.id ?? 0, ...attrs };

  return null;
}

function flattenArticleEntity(entity: any): Article | null {
  if (!entity) return null;

  if (typeof entity?.id === "number" && entity?.title && entity?.slug)
    return entity as Article;

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
    videoUrl: attrs?.videoUrl ?? null, // ✅ ADDED
    videoCaption: attrs?.videoCaption ?? null, // optional
  };
}

// =====================
// ✅ TWEET EMBED HELPERS
// =====================

function getTweetId(url: string) {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? null;
}

function TweetEmbed({ url }: { url: string }) {
  const id = getTweetId(url);
  if (!id) return null;

  return (
    <div className="my-8">
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        <iframe
          src={`https://platform.twitter.com/embed/Tweet.html?id=${id}`}
          width="100%"
          height="560"
          style={{ border: 0 }}
          scrolling="no"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// =====================
// MAIN COMPONENT
// =====================

export default function NewsSlugClient({ slug }: { slug: string }) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  const [userId, setUserId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bmLoading, setBmLoading] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) =>
      setUserId(data.user?.id ?? null)
    );
  }, [supabase]);

  // Fetch main article
  useEffect(() => {
    if (!slug) return;

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (!baseUrl) {
      setError("Missing NEXT_PUBLIC_STRAPI_URL");
      return;
    }

    const url =
      `${baseUrl}/api/articles?` +
      `filters[slug][$eq]=${encodeURIComponent(slug)}` +
      `&populate[coverImage]=true&populate[category]=true` +
      `&pagination[pageSize]=1`;

    let alive = true;
    setError(null);
    setArticle(null);

    fetch(url, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
        return r.json();
      })
      .then((json) => {
        if (!alive) return;

        const entity = json?.data?.[0] ?? null;
        const flat = flattenArticleEntity(entity);

        if (!flat || !flat.slug) {
          setArticle(null);
          setError("Article not found (no data from Strapi).");
          return;
        }

        setArticle(flat);
      })
      .catch((e) => alive && setError(String(e?.message ?? e)));

    return () => {
      alive = false;
    };
  }, [slug]);

  const category = article ? getArticleCategory(article) : null;

  const coverUrl = useMemo(() => {
    if (!article) return null;
    return pickMediaUrl((article as any).coverImage);
  }, [article]);

  const authorName = "FullPort Staff";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const authorBio =
    "Covering crypto news, memecoins, and on-chain stories.";

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back
          </Link>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8">
            <h1 className="text-2xl font-bold">Unable to load article</h1>
            <p className="mt-2 text-sm text-zinc-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!slug || !article) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-zinc-800" />
            <div className="h-10 w-3/4 rounded bg-zinc-800" />
            <div className="h-64 w-full rounded-xl bg-zinc-900/60" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 pt-8 pb-24">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-zinc-400 leading-relaxed mb-6 font-medium">
            {article.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {coverUrl ? (
          <div className="my-8 -mx-4 sm:-mx-6">
            <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
              <img
                src={coverUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        ) : null}

        {/* ✅ EMBEDDED X VIDEO (NEW) */}
        {article.videoUrl ? (
          <>
            <TweetEmbed url={article.videoUrl} />
            {article.videoCaption && (
              <p className="text-sm text-zinc-500 -mt-4 mb-6">
                {article.videoCaption}
              </p>
            )}
          </>
        ) : null}

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none mt-8">
          {Array.isArray(article.content) ? (
            <StrapiBlocks blocks={article.content} />
          ) : (
            <p className="text-zinc-400">No content available.</p>
          )}
        </article>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />

        {/* Comments */}
        <div id="comments" className="mt-16">
          <Comments slug={slug} />
        </div>
      </div>
    </main>
  );
}
