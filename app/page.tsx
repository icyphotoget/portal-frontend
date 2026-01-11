// app/page.tsx
import Link from "next/link";
import FeaturedCarousel, { FeaturedItem } from "@/app/components/FeaturedCarousel";
import BottomNav from "@/app/components/BottomNav";
import AuthGate from "@/app/components/AuthGate";

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

  // Strapi v5: media.url
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);

  // Strapi v4: { data: { attributes: { url } } }
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);

  // Sometimes: { data: [{ attributes: { url } }]}
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
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
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
    `&pagination[pageSize]=20`;

  const categoriesUrl =
    `${baseUrl}/api/categories?sort=name:asc&pagination[pageSize]=50`;

  const [articlesJson, categoriesJson] = await Promise.all([
    fetchJson<{ data: Article[] }>(articlesUrl),
    fetchJson<{ data: Category[] }>(categoriesUrl),
  ]);

  const articles = (articlesJson.data ?? []).filter(Boolean);
  const categories = (categoriesJson.data ?? []).filter(Boolean);

  return { articles, categories };
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function CategoryChip({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/category/${cat.slug}`}
      className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/25
                 px-3 py-1 text-xs text-zinc-200 transition
                 hover:bg-zinc-900/50 hover:border-zinc-700"
    >
      {cat.name}
    </Link>
  );
}

function GridCard({ a }: { a: Article }) {
  const coverUrl = firstCoverUrl(a);
  const cat = getArticleCategory(a);
  const meta = [formatDate(a.publishedAt), estimateReadTime(a.excerpt ?? a.title)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/news/${a.slug}`}
      className="group relative overflow-hidden rounded-[1.8rem] border border-zinc-800 bg-zinc-900/20
                 transition hover:bg-zinc-900/45"
    >
      <div className="relative aspect-[16/10] bg-zinc-900">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={a.title}
            className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/6 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/10 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          {cat ? (
            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-100 backdrop-blur">
              {cat.name}
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-0 p-5">
          <div className="text-[11px] text-zinc-300/80">{meta}</div>
          <div className="mt-1 line-clamp-2 text-[1.05rem] font-semibold leading-snug">
            {a.title}
          </div>
          <div className="mt-3 text-sm text-zinc-200/90">
            Open{" "}
            <span className="inline-block translate-x-0 transition group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ListItem({ a }: { a: Article }) {
  const coverUrl = firstCoverUrl(a);
  const meta = [formatDate(a.publishedAt), estimateReadTime(a.excerpt ?? a.title)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/news/${a.slug}`}
      className="group flex items-center justify-between gap-4 rounded-[1.6rem]
                 border border-zinc-800 bg-zinc-900/20 p-4 hover:bg-zinc-900/45 transition"
    >
      <div className="min-w-0">
        <div className="text-[11px] text-zinc-400">{meta}</div>
        <div className="mt-1 text-[15px] font-semibold leading-snug line-clamp-2">
          {a.title}
        </div>
      </div>

      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-zinc-800/60">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={a.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
          </>
        )}
      </div>
    </Link>
  );
}

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/6 blur-3xl" />
      <div className="absolute -bottom-52 -right-56 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
    </div>
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
  const featuredItems: FeaturedItem[] = featuredRaw.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? "",
    publishedAt: a.publishedAt,
    coverUrl: firstCoverUrl(a),
    category: (() => {
      const c = getArticleCategory(a);
      return c ? { name: c.name, slug: c.slug } : null;
    })(),
  }));

  const latest = articles.slice(6, 16);
  const topGrid = latest.slice(0, 6);
  const listItems = latest.slice(0, 8);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* top subtle background */}
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_85%_10%,rgba(34,197,94,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:pt-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-300 hover:text-zinc-100">
            <span className="font-semibold text-zinc-100">FullPort</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/news"
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
            >
              News
            </Link>
            <AuthGate />
          </div>
        </div>

        {/* Hero */}
        <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/15 p-5 lg:p-7 lg:shadow-[0_0_160px_rgba(255,255,255,0.06)]">
          <Glow />

          <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                Live market narratives
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                FullPort
              </h1>

              <p className="mt-3 text-zinc-300">
                Breaking crypto headlines, memecoins, and on-chain stories — curated fast.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/news"
                  className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white transition"
                >
                  Explore headlines
                </Link>

                <Link
                  href="/news"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
                >
                  Trending now
                </Link>
              </div>

              {/* Topics */}
              {categories.length > 0 ? (
                <div className="mt-7">
                  <div className="text-xs text-zinc-400">Topics</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.slice(0, 10).map((c) => (
                      <CategoryChip key={c.id} cat={c} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs text-zinc-400">Featured</div>
                <Link href="/news" className="text-xs text-zinc-300 hover:text-zinc-100 transition">
                  View all →
                </Link>
              </div>

              <FeaturedCarousel items={featuredItems} intervalMs={5200} />
            </div>
          </div>
        </div>

        {/* Latest */}
        <section className="mt-10">
          <SectionHeader
            title="Latest"
            subtitle="Fresh from the newsroom."
            right={
              <Link href="/news" className="text-sm text-zinc-300 hover:text-zinc-100 transition">
                View all →
              </Link>
            }
          />

          {/* Mobile list */}
          <div className="mt-5 grid gap-3 lg:hidden">
            {listItems.length ? (
              listItems.map((a) => <ListItem key={a.id} a={a} />)
            ) : (
              <p className="mt-4 text-zinc-300">No published articles yet.</p>
            )}
          </div>

          {/* Desktop grid */}
          <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-3">
            {topGrid.length ? (
              topGrid.map((a) => <GridCard key={a.id} a={a} />)
            ) : (
              <p className="mt-4 text-zinc-300">No published articles yet.</p>
            )}
          </div>
        </section>

        {/* Footer (clean) */}
        <footer className="mt-14 border-t border-zinc-800 pt-8 text-sm text-zinc-400">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-zinc-200">FullPort</div>
              <div className="mt-1">Independent crypto news & insights.</div>
            </div>
            <div className="flex gap-4">
              <Link href="/news" className="hover:text-zinc-200 transition">
                News
              </Link>
            </div>
          </div>
          <div className="mt-6 text-xs">© {new Date().getFullYear()}</div>
        </footer>
      </div>

      <BottomNav />
    </main>
  );
}
