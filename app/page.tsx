// app/page.tsx

import BottomNav from "@/app/components/BottomNav";
import TopNav, { Category } from "@/app/components/TopNav";

import HeroCard from "@/app/components/HeroCard";
import TopStoriesList from "@/app/components/TopStoriesList";
import MostPopularCard from "@/app/components/MostPopularCard";
import LatestFeed from "@/app/components/LatestFeed";
import HowToSection from "@/app/components/HowToSection";

import {
  fetchHomeData,
  firstCoverUrl,
  type Article,
} from "@/app/lib/strapi";

function pickHowToCategory(categories: Category[]) {
  const needles = ["how to", "how-to", "howto", "kako", "guide", "guides", "tutorial"];
  const found = categories.find((c) => {
    const n = (c?.name ?? "").toLowerCase().trim();
    return needles.some((k) => n.includes(k));
  });
  return found ?? null;
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
  const topStories = articles.slice(1, 6);
  const latest = articles.slice(6);

  const mostPopular = latest.slice(0, 6);
  const latestFeed = latest.slice(6);

  // ✅ HOW TO section logic (no slug needed)
  const howToCat = pickHowToCategory(categories);

  const howToCandidates = howToCat
    ? articles.filter((a) => {
        const c = (a as any)?.category;
        if (!c) return false;

        // Works with your current Article typing: category?: Category | null
        if (typeof c === "object" && "id" in c) return (c as Category).id === howToCat.id;

        // If Strapi v4 relation shape slips in sometimes
        const relId = (c as any)?.data?.id;
        return relId === howToCat.id;
      })
    : [];

  // fallback: take some of the newest ones if no how-to category exists
  const howToArticles = (howToCandidates.length ? howToCandidates : articles.slice(0, 6)).slice(0, 5);

  const howToFeatured = howToArticles[0] ?? hero ?? null;
  const howToList = howToArticles.slice(1);

  const howToImage =
    (howToFeatured ? firstCoverUrl(howToFeatured) : null) ??
    (hero ? firstCoverUrl(hero) : null) ??
    "https://picsum.photos/1200/800";

  const howToSeeAllHref = howToCat?.slug ? `/category/${howToCat.slug}` : "/news";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Subtle glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* Top nav */}
      <TopNav categories={categories} activeTab="top" />

      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8 py-8">
        {/* HERO */}
        {hero ? <HeroCard hero={hero} /> : null}

        {/* ✅ HOW TO (Verge-style) */}
        {howToFeatured ? (
          <section className="mb-12">
            <HowToSection
              label="HOW TO?"
              seeAllHref={howToSeeAllHref}
              featured={{
                title: howToFeatured.title,
                href: `/news/${howToFeatured.slug}`,
                author: "FULLPORT",
                date: howToFeatured.publishedAt
                  ? new Date(howToFeatured.publishedAt)
                      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      .toUpperCase()
                  : "",
                imageUrl: howToImage,
                imageAlt: howToFeatured.title,
              }}
              items={howToList.map((a) => ({
                id: a.id,
                title: a.title,
                href: `/news/${a.slug}`,
                author: "FULLPORT",
                date: a.publishedAt
                  ? new Date(a.publishedAt)
                      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      .toUpperCase()
                  : "",
                comments: undefined,
              }))}
            />
          </section>
        ) : null}

        {/* Top Stories + Most Popular */}
        <section className="mb-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <TopStoriesList articles={topStories} />
          <MostPopularCard articles={mostPopular} />
        </section>

        {/* Latest */}
        <LatestFeed articles={latestFeed} />
      </div>

      {/* Bottom nav only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
