// app/news/[slug]/ArticleViewClient.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import StrapiBlocks from "@/app/components/StrapiBlocks";
import Comments from "@/app/components/Comments";

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

type Article = {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  publishedAt: string | null;
  updatedAt?: string | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  // Čistije (bez timezoneName) da ne izgleda čudno po browserima
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${date}, ${time}`;
}

export default function ArticleViewClient({
  slug,
  article,
  category,
  coverUrl,
  authorName,
  authorBio,
}: {
  slug: string;
  article: Article;
  category: Category | null;
  coverUrl: string | null;
  authorName: string;
  authorBio: string;
}) {
  const initials = useMemo(() => {
    const ch = (authorName || "F").trim()[0] || "F";
    return ch.toUpperCase();
  }, [authorName]);

  const blocks = Array.isArray((article as any).content) ? ((article as any).content as any[]) : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 pt-8 pb-24">
        {/* Top breadcrumb/back */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/news" className="text-sm text-zinc-400 hover:text-white transition">
            ← Back to News
          </Link>

          {category ? (
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-300 hover:text-purple-200"
            >
              {category.name}
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-400">
              News
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt ? (
          <p className="text-xl text-zinc-400 leading-relaxed mb-6 font-medium">
            {article.excerpt}
          </p>
        ) : null}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">by</span>
            <span className="text-sm font-bold text-purple-300">{authorName}</span>
          </div>

          <div className="text-sm text-zinc-500">{formatDate(article.publishedAt)}</div>
        </div>

        {/* Action buttons (client-only) */}
        <div className="flex items-center gap-3 py-6 border-b border-zinc-800">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition"
            aria-label="Share"
            onClick={() => {
              const url = typeof window !== "undefined" ? window.location.href : "";
              if (navigator.share) navigator.share({ title: article.title, url }).catch(() => {});
              else navigator.clipboard?.writeText(url).catch(() => {});
            }}
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

          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition"
            aria-label="Bookmark"
            onClick={() => {
              // Placeholder (lokalno)
              alert("Bookmark saved (demo).");
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

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
              <span className="font-bold">Comments</span>
            </Link>
          </div>
        </div>

        {/* Cover */}
        {coverUrl ? (
          <div className="my-8 -mx-4 sm:-mx-6">
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ) : null}

        {/* Author card */}
        <div className="flex items-start gap-4 py-6 border-b border-zinc-800">
          <div className="h-12 w-12 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>

          <div className="flex-1">
            <div className="text-base font-bold text-purple-300 mb-1">{authorName}</div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {category?.description || authorBio}
            </p>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none mt-8">
          <div className="text-zinc-200 leading-relaxed">
            {blocks ? (
              <StrapiBlocks blocks={blocks} />
            ) : (
              <p className="text-zinc-400">No content available.</p>
            )}
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
