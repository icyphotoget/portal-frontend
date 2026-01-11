// app/page.tsx
import Link from "next/link";
import BottomNav from "@/app/components/BottomNav";
import TopNav, { Category } from "@/app/components/TopNav";

type StrapiMedia = any;

type Article = {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage?: StrapiMedia;
  category?: Category | null;
};

function absolutizeStrapiUrl(maybeRelativeUrl: string | null | undefined) {
  if (!maybeRelativeUrl) return null;
  if (maybeRelativeUrl.startsWith("http")) return maybeRelativeUrl;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  return base ? `${base}${maybeRelativeUrl}` : maybeRelativeUrl;
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;

  // Strapi v5
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);

  // Strapi v4: { data: { attributes: { url } } }
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);

  // Sometimes: { data: [{ attributes: { url } }] }
  const v4arr = media?.data?.[0]?.attributes?.url;
  if (typeof v4arr === "string") return absolutizeStrapiUrl(v4arr);

  return null;
}

function firstCoverUrl(article: any): string | null {
  const c = article?.coverImage;
  if (Array.isArray(c)) return pickMediaUrl(c[0]);
  return pickMediaUrl(c);
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function getArticleCategory(a: any): Category | null {
  if (a?.category && typeof a.category === "object") return a.category as Category;

  const v4 = a?.category?.data?.attributes;
  if (v4?.name && v4?.slug) return { id: a.category.data.id ?? 0, ...v4 } as Category;

  return null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function fetchHomeData(baseUrl: string) {
  const articlesUrl =
    `${baseUrl}/api/articles?sort=publishedAt:desc` +
    `&populate=coverImage&populate=category` +
    `&pagination[pageSize]=50`;

  const categoriesUrl = `${baseUrl}/api/categories?sort=name:asc&pagination[pageSize]=50`;

  const [articlesJson, categoriesJson] = await Promise.all([
    fetchJson<{ data: Article[] }>(articlesUrl),
    fetchJson<{ data: Category[] }>(categoriesUrl),
  ]);

  return {
    articles: (articlesJson.data ?? []).filter(Boolean),
    categories: (categoriesJson.data ?? []).filter(Boolean),
  };
}

function CategoryBadge({ cat }: { cat: Category | null }) {
  const label = cat?.name ?? "News";
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
      {label}
    </span>
  );
}

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-zinc-400">
            Missing{" "}
            <code className="rounded bg-zinc-900 px-1">
              NEXT_PUBLIC_STRAPI_URL
            </code>
            .
          </p>
        </div>
      </main>
    );
  }

  let articles: Article[] = [];
  let categories: Category[] = [];

  try {
    const data = await fetchHomeData(baseUrl);
    articles = data.articles;
    categories = data.categories;
  } catch (e: any) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold">FullPort</h1>
          <p className="mt-2 text-zinc-400">Failed to load data.</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-zinc-900/60 p-4 text-xs text-zinc-200">
            {String(e?.message ?? e)}
          </pre>
        </div>
      </main>
    );
  }

  const hero = articles[0] ?? null;
  const topStories = articles.slice(1, 6);
  const latest = articles.slice(6);

  const heroCover = hero ? firstCoverUrl(hero) : null;
  const heroCat = hero ? getArticleCategory(hero) : null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Subtle glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* ✅ Extracted TopNav */}
      <TopNav categories={categories} activeTab="top" />

      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8 py-8">
        {/* ✅ HERO */}
        {hero ? (
          <section className="mb-10">
            <Link
              href={`/news/${hero.slug}`}
              className="group block no-underline !text-zinc-50"
            >
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden">
                  {heroCover ? (
                    <img
                      src={heroCover}
                      alt={hero.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-900 to-black" />
                  )}

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

                  {/* top meta */}
                  <div className="absolute left-0 right-0 top-0 p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <CategoryBadge cat={heroCat} />
                      <span className="text-xs text-white/75">
                        {formatDate(hero.publishedAt)}
                      </span>
                    </div>
                  </div>

                  {/* bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:bg-black/45 sm:p-6 sm:backdrop-blur-xl">
                      <h1
                        className={[
                          "font-extrabold leading-[1.05] tracking-[-0.02em]",
                          "text-[1.65rem] sm:text-[2.2rem] lg:text-[2.8rem]",
                          "text-zinc-50 transition group-hover:opacity-90",
                          "line-clamp-2 sm:line-clamp-3",
                        ].join(" ")}
                        style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85)" }}
                      >
                        {hero.title}
                      </h1>

                      {hero.excerpt ? (
                        <p className="mt-2 text-sm sm:text-base text-zinc-200/85 leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {hero.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/90">
                        Open story
                        <span className="translate-x-0 transition group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {/* Top Stories + Most Popular */}
        <section className="mb-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Top Stories */}
          <div>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-xl font-extrabold text-zinc-100">Top Stories</h2>
              <Link href="/news" className="text-sm text-zinc-300 hover:text-white transition">
                View all →
              </Link>
            </div>

            <div className="space-y-6">
              {topStories.map((article, idx) => {
                const cat = getArticleCategory(article);
                const coverUrl = firstCoverUrl(article);

                return (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group flex gap-4 border-b border-zinc-800 pb-6 last:border-0 no-underline !text-zinc-50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg font-extrabold text-cyan-300">
                      {idx + 1}
                    </div>

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={article.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-extrabold leading-tight mb-2 text-zinc-50 transition group-hover:opacity-90 line-clamp-3">
                        {article.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wide text-zinc-200/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                          {cat?.name ?? "News"}
                        </span>
                        <span className="text-zinc-500">{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Most Popular */}
          <div>
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-purple-600/95 to-fuchsia-700/95 p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-white">Most Popular</h2>
                <Link href="/news" className="text-sm text-white/80 hover:text-white transition">
                  More →
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {latest.slice(0, 6).map((article, idx) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group flex items-start gap-4 border-b border-white/15 pb-4 last:border-0 no-underline !text-white"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-extrabold text-white">
                      {idx + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-lg font-extrabold text-white transition group-hover:opacity-90 leading-snug">
                        {article.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
                        <span className="font-bold uppercase tracking-wide">
                          {getArticleCategory(article)?.name ?? "News"}
                        </span>
                        <span>•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Latest feed */}
        {latest.slice(6).length ? (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-xl font-extrabold">Latest</h2>
              <Link href="/news" className="text-sm text-zinc-300 hover:text-white transition">
                View all →
              </Link>
            </div>

            <div className="space-y-8">
              {latest.slice(6).map((article) => {
                const cat = getArticleCategory(article);
                const coverUrl = firstCoverUrl(article);

                return (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group block border-t border-zinc-800 pt-8 first:border-0 first:pt-0 no-underline !text-zinc-50"
                  >
                    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                      <div>
                        {cat ? (
                          <div className="mb-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
                              {cat.name}
                            </span>
                          </div>
                        ) : null}

                        <h3 className="text-2xl font-extrabold leading-tight mb-3 text-zinc-50 transition group-hover:opacity-90 line-clamp-3">
                          {article.title}
                        </h3>

                        {article.excerpt ? (
                          <p className="text-zinc-400 leading-relaxed mb-3 line-clamp-3">
                            {article.excerpt}
                          </p>
                        ) : null}

                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={article.title}
                            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      {/* Bottom nav only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
