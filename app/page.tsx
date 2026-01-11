// app/page.tsx
import Link from "next/link";
import FeaturedCarousel, { FeaturedItem } from "@/app/components/FeaturedCarousel";
import BottomNav from "@/app/components/BottomNav";

type StrapiMedia = any;

type Category = {
  id: number;
  documentId?: string;
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
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
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
    `&pagination[pageSize]=24`;

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

function Chip({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs transition select-none",
        active
          ? "bg-zinc-100 text-zinc-950"
          : "border border-zinc-800 bg-zinc-900/25 text-zinc-200 hover:bg-zinc-900/45",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-zinc-300">
            Missing <code className="rounded bg-zinc-900 px-1">NEXT_PUBLIC_STRAPI_URL</code>.
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
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">FullPort</h1>
          <p className="mt-2 text-zinc-300">Failed to load homepage data.</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-zinc-900/60 p-4 text-xs text-zinc-200">
            {String(e?.message ?? e)}
          </pre>
        </div>
      </main>
    );
  }

  const featuredRaw = articles.slice(0, 6);
  const featuredItems: FeaturedItem[] = featuredRaw.map((a) => {
    const c = getArticleCategory(a);
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt ?? "",
      publishedAt: a.publishedAt,
      coverUrl: firstCoverUrl(a),
      category: c ? { name: c.name, slug: c.slug } : null,
    };
  });

  // “Latest” list like Dribbble cards
  const latest = articles.slice(6, 18);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_30%_25%,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.10),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-7">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-200 hover:text-white">
            <span className="font-semibold">FullPort</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/news"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
            >
              News
            </Link>
            <Link
              href="/login"
              className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white transition"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-7 overflow-hidden rounded-[2.2rem] border border-zinc-800 bg-zinc-900/15 p-5 sm:p-7">
          <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live market narratives
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                FullPort
              </h1>

              <p className="mt-3 text-zinc-300 text-[15px] leading-relaxed">
                Breaking crypto headlines, memecoins, and on-chain stories — curated fast.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/news"
                  className="rounded-2xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-white transition"
                >
                  Explore headlines
                </Link>
                <Link
                  href="/news?tab=trending"
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/30 px-5 py-2.5 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
                >
                  Trending now
                </Link>
              </div>

              {/* Topic pills (no search bar) */}
              {categories.length ? (
                <div className="mt-7">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <Chip active>Featured</Chip>
                    <Chip>Trending</Chip>
                    <Chip>Latest</Chip>
                    {categories.slice(0, 6).map((c) => (
                      <Link key={c.id} href={`/category/${c.slug}`} className="shrink-0">
                        <Chip>{c.name}</Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Featured carousel (Dribbble-style overlay handled inside component) */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs text-zinc-400">Featured</div>
                <Link href="/news" className="text-xs text-zinc-300 hover:text-white transition">
                  View all →
                </Link>
              </div>

              <FeaturedCarousel items={featuredItems} intervalMs={5200} />
            </div>
          </div>
        </div>

        {/* Latest (Dribbble-style cards list) */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Latest</h2>
            <Link href="/news" className="text-sm text-zinc-300 hover:text-white transition">
              View all →
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {latest.length ? (
              latest.map((a) => {
                const coverUrl = firstCoverUrl(a);
                const cat = getArticleCategory(a);
                const meta = [formatDate(a.publishedAt), estimateReadTime(a.excerpt ?? a.title)]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <Link
                    key={a.id}
                    href={`/news/${a.slug}`}
                    className="group flex items-center gap-4 rounded-[1.6rem] border border-zinc-800 bg-zinc-900/20 p-4 transition hover:bg-zinc-900/45"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-2xl bg-zinc-800/60">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={a.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {cat ? (
                          <span className="rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1 text-[11px] text-zinc-200">
                            {cat.name}
                          </span>
                        ) : null}
                        <span className="text-[11px] text-zinc-400">{meta}</span>
                      </div>

                      <div className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug">
                        {a.title}
                      </div>

                      {a.excerpt ? (
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-300/90">
                          {a.excerpt}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-sm text-zinc-300/80 transition group-hover:text-zinc-100">
                      →
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="mt-6 text-zinc-300">No published articles yet.</p>
            )}
          </div>
        </section>

        {/* Footer (no sitemap, no map) */}
        <footer className="mt-14 border-t border-zinc-800 pt-8 text-sm text-zinc-400">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-zinc-200">FullPort</div>
              <div className="mt-1">Breaking crypto narratives — fast.</div>
            </div>
            <div className="flex gap-4">
              <Link href="/news" className="hover:text-zinc-200 transition">News</Link>
              <Link href="/login" className="hover:text-zinc-200 transition">Log in</Link>
            </div>
          </div>
          <div className="mt-6 text-xs">© {new Date().getFullYear()} FullPort</div>
        </footer>
      </div>

      <BottomNav />
    </main>
  );
}
