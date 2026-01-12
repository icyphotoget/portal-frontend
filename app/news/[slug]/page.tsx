"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StrapiBlocks from "@/app/components/StrapiBlocks";
import Comments from "@/app/components/Comments";
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
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" })
  );
}

function getArticleCategory(a: any) {
  if (a?.category && typeof a.category === "object") return a.category;
  const v4 = a?.category?.data?.attributes;
  if (v4?.name && v4?.slug) return { id: a.category.data.id ?? 0, ...v4 };
  return null;
}

export default function NewsSlugPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? null;
  const supabase = useMemo(() => createSupabaseBrowser(), []);


  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  // supabase user + bookmark + comment count
  const [userId, setUserId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bmLoading, setBmLoading] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  // get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

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
      `&populate=coverImage&populate=category` +
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
        const item = (json.data?.[0] ?? null) as Article | null;
        setArticle(item);
        if (!item) setError("Article not found (no data from Strapi).");
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

  // Author (temporary)
  const authorName = "FullPort Staff";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const authorBio = "Covering crypto news, memecoins, and on-chain stories.";

  // Check bookmark state
  useEffect(() => {
    if (!userId || !slug) {
      setBookmarked(false);
      return;
    }

    let alive = true;

    (async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("article_slug", slug)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        console.error("bookmark check error:", error);
        setBookmarked(false);
        return;
      }

      setBookmarked(!!data);
    })();

    return () => {
      alive = false;
    };
  }, [userId, slug]);

  // Load comment count (real)
  async function loadCommentCount() {
    if (!slug) return;
    const { count, error } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("article_slug", slug);

    if (error) {
      console.error("comment count error:", error);
      setCommentCount(null);
      return;
    }

    setCommentCount(count ?? 0);
  }

  useEffect(() => {
    loadCommentCount();

    if (!slug) return;

    // realtime update count when comments change
    const channel = supabase
      .channel(`comment-count:${slug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `article_slug=eq.${slug}` },
        () => loadCommentCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function onShare() {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const title = article?.title ?? "FullPort";
      const text = article?.excerpt ?? "";

      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      try {
        const url = window.location.href;
        prompt("Copy this link:", url);
      } catch {}
    }
  }

  async function toggleBookmark() {
    if (!slug) return;

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setBmLoading(true);
    try {
      if (bookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("article_slug", slug);

        if (error) throw error;
        setBookmarked(false);
      } else {
        const { error } = await supabase.from("bookmarks").insert({
          user_id: userId,
          article_slug: slug,
          article_title: article?.title ?? null,
        });

        if (error) throw error;
        setBookmarked(true);
      }
    } catch (e) {
      console.error("toggle bookmark error:", e);
    } finally {
      setBmLoading(false);
    }
  }

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
        {/* Category */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-purple-400 hover:text-purple-300 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {category.name}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-4">{article.title}</h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-zinc-400 leading-relaxed mb-6 font-medium">{article.excerpt}</p>
        )}

        {/* Author + Date */}
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sm">by</span>
            <span className="text-sm font-bold text-purple-400">{authorName}</span>
          </div>

          <div className="text-sm text-zinc-500">{formatDate(article.publishedAt)}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 py-6 border-b border-zinc-800">
          {/* Share */}
          <button
            onClick={onShare}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition"
            aria-label="Share"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            disabled={bmLoading}
            className={[
              "flex items-center justify-center w-10 h-10 rounded-lg border transition",
              bmLoading ? "opacity-60 cursor-not-allowed" : "",
              bookmarked ? "border-purple-500/60 bg-purple-500/10" : "border-zinc-700 hover:bg-zinc-900",
            ].join(" ")}
            aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill={bookmarked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          {/* Comments */}
          <div className="ml-auto">
            <Link
              href="#comments"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>

              <span className="font-bold">{commentCount ?? "—"}</span>
              <span className="text-zinc-400">Comments</span>
            </Link>
          </div>
        </div>

        {/* Cover */}
        {coverUrl ? (
          <div className="my-8 -mx-4 sm:-mx-6">
            <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
              <img
                src={coverUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  console.error("Cover image failed to load:", coverUrl);
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        ) : (
          <div className="my-8 -mx-4 sm:-mx-6">
            <div className="relative aspect-[16/9] bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-500">
              No cover image
            </div>
          </div>
        )}

        {/* Author card */}
        <div className="flex items-start gap-4 py-6 border-b border-zinc-800">
          <div className="relative h-12 w-12 shrink-0">
            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              {authorInitial}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-base font-bold text-purple-400 mb-1">{authorName}</div>
            <p className="text-sm text-zinc-400 leading-relaxed">{authorBio}</p>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none mt-8">
          <div className="text-zinc-200 leading-relaxed">
            {Array.isArray(article.content) ? <StrapiBlocks blocks={article.content} /> : <p className="text-zinc-400">No content available.</p>}
          </div>
        </article>

        {/* Comments */}
        <div id="comments" className="mt-16">
          <Comments slug={slug} />
        </div>
      </div>
    </main>
  );
}
