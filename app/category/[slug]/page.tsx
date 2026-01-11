// app/category/[slug]/page.tsx
import Link from "next/link";
import BottomNav from "@/app/components/BottomNav";
import MobileMenu from "@/app/components/MobileMenu";

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

  // Direct / custom shapes
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);

  // Strapi v4: { data: { attributes: { url } } }
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);

  // Strapi v4 array: { data: [{ attributes: { url } }] }
  const v4arr = media?.data?.[0]?.attributes?.url;
  if (typeof v4arr === "string") return absolutizeStrapiUrl(v4arr);

  // Some v5 setups: { data: { url } }
  const v5 = media?.data?.url;
  if (typeof v5 === "string") return absolutizeStrapiUrl(v5);

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
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

/**
 * Normalize Strapi entity -> Category
 * Supports:
 * - v4/v5: { id, attributes: { ... } }
 * - v5 (your API): { id, name, slug, ... } (flat)
 */
function normalizeCategory(item: any): Category | null {
  if (!item) return null;
  const attrs = item.attributes ?? item;

  if (!attrs?.slug || !attrs?.name) return null;

  return {
    id: item.id ?? attrs.id ?? 0,
    documentId: item.documentId ?? attrs.documentId,
    name: attrs.name,
    slug: attrs.slug,
    description: attrs.description ?? null,
  };
}

/**
 * Normalize Strapi entity -> Article
 * Supports v4/v5 entity envelope + flat objects.
 */
function normalizeArticle(item: any): Article | null {
  if (!item) return null;
  const attrs = item.attributes ?? item;

  if (!attrs?.slug || !attrs?.title) return null;

  const cat = attrs?.category?.data
    ? normalizeCategory(attrs.category.data)
    : normalizeCategory(attrs.category);

  return {
    id: item.id ?? attrs.id ?? 0,
    documentId: item.documentId ?? attrs.documentId,
    title: attrs.title,
    slug: attrs.slug,
    excerpt: attrs.excerpt ?? null,
    publishedAt: attrs.publishedAt ?? null,
    coverImage: attrs.coverImage ?? null,
    category: cat,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  // In dev, no-store avoids “ghost” caching while you iterate
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

async function fetchCategoryData(baseUrl: string, categorySlug: string) {
  const s = encodeURIComponent(categorySlug);

  // Category (by slug)
  const categoryUrl =
    `${baseUrl}/api/categories?filters[slug][$eq]=${s}` +
    `&pagination[pageSize]=1`;

  // Articles in this category
  const articlesUrl =
    `${baseUrl}/api/articles?sort=publishedAt:desc` +
    `&filters[category][slug][$eq]=${s}` +
    `&populate[coverImage]=true&populate[category]=true` +
    `&pagination[pageSize]=50`;

  // All categories for nav
  const categoriesUrl =
    `${baseUrl}/api/categories?sort=name:asc&pagination[pageSize]=50`;

  const [categoryJson, articlesJson, categoriesJson] = await Promise.all([
    fetchJson<any>(categoryUrl),
    fetchJson<any>(articlesUrl),
    fetchJson<any>(categoriesUrl),
  ]);

  const category = normalizeCategory(categoryJson?.data?.[0]);

  const articles = (articlesJson?.data ?? [])
    .map(normalizeArticle)
    .filter(Boolean) as Article[];

  const categories = (categoriesJson?.data ?? [])
    .map(normalizeCategory)
    .filter(Boolean) as Category[];

  return { category, articles, categories };
}

// ✅ Next 16.1 / Turbopack fix: params can be a Promise
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-zinc-400">Missing NEXT_PUBLIC_STRAPI_URL.</p>
        </div>
      </main>
    );
  }

  let category: Category | null = null;
  let articles: Article[] = [];
  let categories: Category[] = [];

  try {
    const data = await fetchCategoryData(baseUrl, slug);
    category = data.category;
    articles = data.articles;
    categories = data.categories;
  } catch (e: any) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold">Error</h1>
          <p className="mt-2 text-zinc-400">Failed to load category data.</p>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold">Category Not Found</h1>
          <p className="mt-2 text-zinc-400">The category you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const featured = articles.slice(0, 1)[0] ?? null;
  const grid = articles.slice(1);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Subtle glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="relative flex h-16 items-center border-b border-zinc-800">
            {/* Left */}
            <div className="flex flex-1 items-center gap-3">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
                ← Home
              </Link>
            </div>

            {/* Center (LOGO) */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="flex items-center justify-center">
                <img
                  src="/logo-fullport.png"
                  alt="FullPort"
                  className="h-7 sm:h-8 md:h-9 object-contain drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
                  draggable={false}
                />
              </Link>
            </div>

            {/* Right */}
            <div className="flex flex-1 items-center justify-end gap-2">
              <Link
                href="/login"
                className="rounded-full bg-zinc-100 px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-white transition"
              >
                Log in
              </Link>
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Category Header */}
      <div className="relative border-b border-zinc-800 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              Category
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-xl text-zinc-400 max-w-3xl">{category.description}</p>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
            <span>{articles.length} articles</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8 py-8">
        {/* Featured Article */}
        {featured && (
          <section className="mb-12">
            <Link href={`/news/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                  {firstCoverUrl(featured) ? (
                    <img
                      src={firstCoverUrl(featured)!}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-400">
                      Featured
                    </span>
                    <span className="text-sm text-zinc-500">{formatDate(featured.publishedAt)}</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4 group-hover:text-cyan-400 transition">
                    {featured.title}
                  </h2>

                  {featured.excerpt && (
                    <p className="text-lg text-zinc-400 leading-relaxed mb-4">{featured.excerpt}</p>
                  )}

                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-400">
                    Read article
                    <span className="transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Articles Grid */}
        {grid.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold mb-6">All {category.name}</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {grid.map((article) => {
                const coverUrl = firstCoverUrl(article);

                return (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group">
                    <article className="h-full rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden transition hover:border-zinc-700">
                      {/* Image */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={article.title}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="mb-2 text-xs text-zinc-500">{formatDate(article.publishedAt)}</div>

                        <h3 className="text-lg font-extrabold leading-tight mb-2 line-clamp-3 group-hover:text-cyan-400 transition">
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {articles.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl text-zinc-400">No articles found in this category yet.</p>
            <Link href="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
              ← Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* Bottom nav only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
