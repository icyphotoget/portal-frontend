// app/page.tsx

import BottomNav from "@/app/components/BottomNav";
import TopNav, { Category } from "@/app/components/TopNav";

import HeroCard from "@/app/components/HeroCard";
import TopStoriesList from "@/app/components/TopStoriesList";
import MostPopularCard from "@/app/components/MostPopularCard";
import LatestFeed from "@/app/components/LatestFeed";
import HowToSection from "@/app/components/HowToSection";

import PumpfunSection from "@/app/components/PumpfunSection";
import BonkfunSection from "@/app/components/BonkfunSection";

import { fetchHomeData, firstCoverUrl, type Article } from "@/app/lib/strapi";

function pickCategory(categories: Category[], needles: string[]) {
  const found = categories.find((c) => {
    const n = (c?.name ?? "").toLowerCase().trim();
    return needles.some((k) => n.includes(k));
  });
  return found ?? null;
}

function articleMatchesCategory(a: Article, cat: Category) {
  const c: any = (a as any)?.category;
  if (!c) return false;

  // current shape: category?: Category | null
  if (typeof c === "object" && "id" in c) return (c as Category).id === cat.id;

  // sometimes strapi v4 relation shape
  const relId = c?.data?.id;
  return relId === cat.id;
}

function formatShortDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function buildBucket(params: {
  categories: Category[];
  allArticles: Article[];
  heroFallback?: Article | null;
  needles: string[];
}) {
  const { categories, allArticles, heroFallback, needles } = params;

  const cat = pickCategory(categories, needles);
  const candidates = cat ? allArticles.filter((a) => articleMatchesCategory(a, cat)) : [];
  const chosen = (candidates.length ? candidates : allArticles.slice(0, 12)).slice(0, 6);

  const featured = chosen[0] ?? heroFallback ?? null;
  const list = chosen.slice(1, 5);

  const imageUrl =
    (featured ? firstCoverUrl(featured) : null) ??
    (heroFallback ? firstCoverUrl(heroFallback) : null) ??
    "https://picsum.photos/1200/800";

  const seeAllHref = cat?.slug ? `/category/${cat.slug}` : "/news";

  return { featured, list, imageUrl, seeAllHref };
}

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-zinc-400">
            Missing{" "}
            <code className="rounded bg-zinc-900 px-1">NEXT_PUBLIC_STRAPI_URL</code>.
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

  // Feed groups
  const topStories = articles.slice(1, 6);
  const latest = articles.slice(6);

  const mostPopular = latest.slice(0, 6);
  const latestFeed = latest.slice(6);

  // 1) Pumpfun bucket
  const pumpfun = buildBucket({
    categories,
    allArticles: articles,
    heroFallback: hero,
    needles: ["pumpfun", "pump.fun", "pump fun", "memecoin", "memecoins", "launchpad"],
  });

  // 2) Bonkfun bucket (✅ replaces TECH)
  const bonkfun = buildBucket({
    categories,
    allArticles: articles,
    heroFallback: hero,
    needles: ["bonkfun", "bonk fun", "bonk", "memecoin", "memecoins"],
  });

  // 3) HowTo bucket
  const howto = buildBucket({
    categories,
    allArticles: articles,
    heroFallback: hero,
    needles: ["how to", "how-to", "howto", "kako", "guide", "guides", "tutorial"],
  });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Subtle glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* Top nav */}
      <TopNav categories={categories} />

      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8 py-8">
        {/* 1) HERO */}
        {hero ? <HeroCard hero={hero} /> : null}

        {/* 2) PUMPFUN */}
        {pumpfun.featured ? (
          <section className="mb-12">
            <PumpfunSection
              label="PUMPFUN"
              seeAllHref={pumpfun.seeAllHref}
              featured={{
                title: pumpfun.featured.title,
                href: `/news/${pumpfun.featured.slug}`,
                author: "FULLPORT",
                date: formatShortDate(pumpfun.featured.publishedAt),
                imageUrl: pumpfun.imageUrl,
                imageAlt: pumpfun.featured.title,
              }}
              items={pumpfun.list.map((a) => ({
                id: a.id,
                title: a.title,
                href: `/news/${a.slug}`,
                author: "FULLPORT",
                date: formatShortDate(a.publishedAt),
              }))}
            />
          </section>
        ) : null}

        {/* 3) TOP STORIES + MOST POPULAR */}
        <section className="mb-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <TopStoriesList articles={topStories} />
          <MostPopularCard articles={mostPopular} />
        </section>

        {/* 4) BONKFUN (✅ replaces TECH section) */}
        {bonkfun.featured ? (
          <section className="mb-12">
            <BonkfunSection
              label="BONKFUN"
              seeAllHref={bonkfun.seeAllHref}
              featured={{
                title: bonkfun.featured.title,
                href: `/news/${bonkfun.featured.slug}`,
                author: "FULLPORT",
                date: formatShortDate(bonkfun.featured.publishedAt),
                imageUrl: bonkfun.imageUrl,
                imageAlt: bonkfun.featured.title,
              }}
              items={bonkfun.list.map((a) => ({
                id: a.id,
                title: a.title,
                href: `/news/${a.slug}`,
                author: "FULLPORT",
                date: formatShortDate(a.publishedAt),
              }))}
            />
          </section>
        ) : null}

        {/* 5) HOW TO */}
        {howto.featured ? (
          <section className="mb-12">
            <HowToSection
              label="HOW TO?"
              seeAllHref={howto.seeAllHref}
              featured={{
                title: howto.featured.title,
                href: `/news/${howto.featured.slug}`,
                author: "FULLPORT",
                date: formatShortDate(howto.featured.publishedAt),
                imageUrl: howto.imageUrl,
                imageAlt: howto.featured.title,
              }}
              items={howto.list.map((a) => ({
                id: a.id,
                title: a.title,
                href: `/news/${a.slug}`,
                author: "FULLPORT",
                date: formatShortDate(a.publishedAt),
                comments: undefined,
              }))}
            />
          </section>
        ) : null}

        {/* 6) LATEST (everything else) */}
        <LatestFeed articles={latestFeed} />
      </div>

      {/* Bottom nav only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
