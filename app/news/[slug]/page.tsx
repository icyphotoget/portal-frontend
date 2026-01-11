"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StrapiBlocks from "@/app/components/StrapiBlocks";
import Comments from "@/app/components/Comments";

type Article = {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  publishedAt: string | null;
  coverImage?: any;
};

type ParamsLike = { slug: string } | Promise<{ slug: string }>;

function absolutizeStrapiUrl(maybeRelativeUrl: string | null | undefined) {
  if (!maybeRelativeUrl) return null;
  if (maybeRelativeUrl.startsWith("http")) return maybeRelativeUrl;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  return base ? `${base}${maybeRelativeUrl}` : maybeRelativeUrl;
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);
  const v4arr = media?.data?.[0]?.attributes?.url;
  if (typeof v4arr === "string") return absolutizeStrapiUrl(v4arr);
  return null;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function NewsSlugPage({ params }: { params: ParamsLike }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.resolve(params)
      .then((p) => alive && setSlug(p.slug))
      .catch((e) =>
        alive && setError(`Could not read route params: ${String(e?.message ?? e)}`)
      );
    return () => {
      alive = false;
    };
  }, [params]);

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
      `&populate=coverImage` +
      `&pagination[pageSize]=1`;

    let alive = true;
    setError(null);
    setArticle(null);

    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
        return r.json();
      })
      .then((json) => alive && setArticle((json.data?.[0] ?? null) as Article | null))
      .catch((e) => alive && setError(String(e?.message ?? e)));

    return () => {
      alive = false;
    };
  }, [slug]);

  const coverUrl = useMemo(() => {
    if (!article) return null;
    const c = (article as any).coverImage;
    if (Array.isArray(c)) return pickMediaUrl(c[0]);
    return pickMediaUrl(c);
  }, [article]);

  const date = formatDate(article?.publishedAt ?? null);
  const readTime = article?.content ? estimateReadTime(JSON.stringify(article.content)) : "";

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.15),transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-10">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition">
            <span>←</span> Back to News
          </Link>

          <div className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl p-8">
            <h1 className="text-2xl font-bold">Unable to load article</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Please try again in a moment.
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-zinc-950/60 p-4 text-xs text-zinc-300">
              {error}
            </pre>
          </div>
        </div>
      </main>
    );
  }

  if (!slug || !article) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.15),transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-zinc-800/70" />
            <div className="h-10 w-3/4 rounded bg-zinc-800/70" />
            <div className="h-4 w-1/2 rounded bg-zinc-800/60" />
            <div className="aspect-[16/9] w-full rounded-2xl bg-zinc-800/60" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Enhanced background with grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_75%_15%,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-zinc-800/60 backdrop-blur-xl bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition" />
                <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-lg font-black text-white">F</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">FullPort</span>
            </Link>

            <Link
              href="/news"
              className="rounded-xl px-5 py-2 text-sm font-medium text-zinc-200 border border-zinc-800/60 bg-zinc-900/40 backdrop-blur hover:bg-zinc-900/60 hover:border-zinc-700 transition"
            >
              All News
            </Link>
          </div>
        </div>
      </nav>

      {/* Article Container */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pb-24 pt-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-emerald-400 transition"
          >
            <span>←</span>
            <span>Back to News</span>
          </Link>
        </div>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            {/* Meta info */}
            <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
              {date && <time>{date}</time>}
              {date && readTime && <span>·</span>}
              {readTime && <span>{readTime}</span>}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-zinc-300/90 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Cover Image - Full bleed with rounded corners */}
          <div className="relative -mx-4 sm:mx-0 mb-12">
            <div className="overflow-hidden sm:rounded-2xl border-y sm:border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl">
              {coverUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="relative aspect-[16/9]">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl p-6 sm:p-8 lg:p-10">
              {Array.isArray(article.content) ? (
                <StrapiBlocks blocks={article.content} />
              ) : (
                <p className="text-zinc-400">No content available.</p>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-zinc-800/60">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-zinc-400">
                Share this article
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg border border-zinc-800/60 bg-zinc-900/40 backdrop-blur text-sm font-medium text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700 hover:text-white transition">
                  Twitter
                </button>
                <button className="px-4 py-2 rounded-lg border border-zinc-800/60 bg-zinc-900/40 backdrop-blur text-sm font-medium text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700 hover:text-white transition">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12">
          <Comments slug={slug} />
        </div>

        {/* Back to News CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-sm shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] transition-all"
          >
            <span>←</span>
            <span>Back to All News</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-zinc-800/60 backdrop-blur-sm bg-zinc-950/40 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-xs font-black text-white">F</span>
              </div>
              <span>© {new Date().getFullYear()} FullPort</span>
            </div>
            <Link href="/news" className="text-zinc-400 hover:text-emerald-400 transition font-medium">
              More news →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}