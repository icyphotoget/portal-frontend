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

  // Strapi v5: media.url
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);

  // Strapi v4: media.data.attributes.url
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);

  // Sometimes array
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

export default function NewsSlugPage({ params }: { params: ParamsLike }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resolve params (supports Promise-like params)
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

  // Fetch article
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

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link href="/news" className="text-sm text-zinc-300 hover:text-white">
            ← Back to News
          </Link>

          <div className="mt-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6">
            <h1 className="text-2xl font-semibold">Unable to load article</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Please try again in a moment.
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-zinc-950/60 p-4 text-xs text-zinc-200">
              {error}
            </pre>
          </div>
        </div>
      </main>
    );
  }

  if (!slug) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-3xl px-4 py-10 text-zinc-300">
          Loading…
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="animate-pulse rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="h-4 w-28 rounded bg-zinc-800/70" />
            <div className="mt-4 h-10 w-3/4 rounded bg-zinc-800/70" />
            <div className="mt-3 h-4 w-2/3 rounded bg-zinc-800/60" />
            <div className="mt-6 aspect-[16/9] w-full rounded-2xl bg-zinc-800/60" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-300 hover:text-white">
            FullPort
          </Link>

          <Link
            href="/news"
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
          >
            News
          </Link>
        </div>

        {/* Back */}
        <div className="mt-6">
          <Link href="/news" className="text-sm text-zinc-300 hover:text-white">
            ← Back to News
          </Link>
        </div>

        {/* Header */}
        <header className="mt-6">
          {date ? <div className="text-xs text-zinc-400">{date}</div> : null}

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {article.title}
          </h1>

          {article.excerpt ? (
            <p className="mt-3 text-base text-zinc-300">{article.excerpt}</p>
          ) : null}
        </header>

        {/* Cover */}
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/20">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={article.title}
              className="h-auto w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="relative aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/6 blur-3xl" />
              <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            </div>
          )}
        </div>

        {/* Content */}
        <article className="mt-8">
          {Array.isArray(article.content) ? (
            <StrapiBlocks blocks={article.content} />
          ) : (
            <p className="text-zinc-300">No content.</p>
          )}
        </article>

        {/* Comments */}
        <Comments slug={slug} />

        {/* Footer */}
        <footer className="mt-14 border-t border-zinc-800 pt-8 text-sm text-zinc-500">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} FullPort</span>
            <Link href="/news" className="text-zinc-300 hover:text-white">
              More news →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
