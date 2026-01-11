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
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);
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
  return `${minutes} min`;
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

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-zinc-400">Missing <code>NEXT_PUBLIC_STRAPI_URL</code>.</p>
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
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold">FullPort</h1>
          <p className="mt-2 text-zinc-400">Failed to load data.</p>
        </div>
      </main>
    );
  }

  const hero = articles[0];
  const featuredRaw = articles.slice(1, 4);
  const latest = articles.slice(4, 16);

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

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Glassmorphic ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_75%_15%,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-zinc-800/60 backdrop-blur-xl bg-zinc-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

            <div className="flex items-center gap-3">
              <Link href="/news" className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition">
                Explore
              </Link>
              <Link href="/news?tab=trending" className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition">
                Trending
              </Link>
              <Link href="/login" className="ml-2 px-5 py-2 rounded-xl bg-white text-zinc-950 text-sm font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] transition">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-300 mb-6 shadow-lg shadow-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live Updates
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Crypto News
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                At Light Speed
              </span>
            </h1>
            
            <p className="text-lg text-zinc-300/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Real-time crypto narratives, memecoin launches, and on-chain alpha. Stay ahead of the market with instant insights.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/news" className="group relative px-8 py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] transition-all">
                Start Reading
              </Link>
              <Link href="/news?tab=trending" className="px-8 py-3.5 rounded-xl border border-zinc-700/60 bg-zinc-800/40 text-zinc-200 font-semibold text-sm backdrop-blur hover:bg-zinc-800/60 hover:border-zinc-600 transition">
                What's Trending
              </Link>
            </div>
          </div>

          {/* Hero Card - Glass style */}
          {hero && (
            <Link href={`/news/${hero.slug}`} className="group block relative">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl shadow-2xl hover:border-zinc-700 transition-all duration-300">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                    {firstCoverUrl(hero) ? (
                      <img
                        src={firstCoverUrl(hero)!}
                        alt={hero.title}
                        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent lg:bg-gradient-to-r" />
                  </div>

                  {/* Content */}
                  <div className="relative p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {getArticleCategory(hero) && (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                          {getArticleCategory(hero)!.name}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">{formatDate(hero.publishedAt)}</span>
                      <span className="text-xs text-zinc-600">·</span>
                      <span className="text-xs text-zinc-400">{estimateReadTime(hero.excerpt ?? hero.title)}</span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 group-hover:text-emerald-400 transition leading-tight">
                      {hero.title}
                    </h2>

                    {hero.excerpt && (
                      <p className="text-zinc-300/90 text-base leading-relaxed mb-6 line-clamp-3">
                        {hero.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      Read Full Story
                      <span className="transition group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Categories Bar - Glass style */}
      {categories.length > 0 && (
        <section className="relative py-8 border-y border-zinc-800/60 backdrop-blur-sm bg-zinc-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm font-semibold text-zinc-400 shrink-0">Topics:</span>
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="shrink-0 px-4 py-2 rounded-full border border-zinc-700/60 bg-zinc-900/40 text-sm font-medium text-zinc-300 backdrop-blur hover:bg-zinc-800/60 hover:border-zinc-600 hover:text-white transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Stories - Glass style */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Stories</h2>
            <Link href="/news" className="group flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white transition">
              View All
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredRaw.map((a) => {
              const coverUrl = firstCoverUrl(a);
              const cat = getArticleCategory(a);

              return (
                <Link
                  key={a.id}
                  href={`/news/${a.slug}`}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl hover:bg-zinc-900/40 hover:border-zinc-700 transition-all duration-300 shadow-xl">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={a.title}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                      
                      {cat && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1.5 rounded-lg bg-zinc-950/80 backdrop-blur-sm border border-zinc-700/50 text-xs font-semibold text-white">
                            {cat.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                        <span>{formatDate(a.publishedAt)}</span>
                        <span>·</span>
                        <span>{estimateReadTime(a.excerpt ?? a.title)}</span>
                      </div>

                      <h3 className="text-lg font-bold leading-snug mb-2 line-clamp-2 group-hover:text-emerald-400 transition">
                        {a.title}
                      </h3>

                      {a.excerpt && (
                        <p className="text-sm text-zinc-300/90 line-clamp-2 leading-relaxed">
                          {a.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Grid - Glass style */}
      <section className="relative py-20 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest Updates</h2>
            <Link href="/news" className="group flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white transition">
              View All
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((a) => {
              const coverUrl = firstCoverUrl(a);
              const cat = getArticleCategory(a);

              return (
                <Link
                  key={a.id}
                  href={`/news/${a.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl hover:bg-zinc-900/40 hover:border-zinc-700 transition-all duration-300">
                    {/* Compact Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={a.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
                      )}
                    </div>

                    <div className="p-4">
                      {cat && (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                          {cat.name}
                        </span>
                      )}

                      <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-emerald-400 transition">
                        {a.title}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-2">
                        <span>{formatDate(a.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA - Glass style */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xl p-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_70%)]" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Never Miss a Beat
              </h2>
              <p className="text-lg text-zinc-300/90 mb-8 leading-relaxed">
                Get the hottest crypto stories delivered straight to your inbox. Join thousands of traders staying ahead.
              </p>
              
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition"
                />
                <button className="px-8 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-sm shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Glass style */}
      <footer className="relative border-t border-zinc-800/60 backdrop-blur-sm bg-zinc-950/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-base font-black text-white">F</span>
                </div>
                <span className="text-lg font-bold tracking-tight">FullPort</span>
              </Link>
              <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
                Your real-time source for crypto news, market narratives, and on-chain intelligence.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">Platform</h3>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                <Link href="/news" className="hover:text-white transition">Explore</Link>
                <Link href="/news?tab=trending" className="hover:text-white transition">Trending</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">Account</h3>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                <Link href="/login" className="hover:text-white transition">Sign In</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} FullPort. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <BottomNav />
    </main>
  );
}