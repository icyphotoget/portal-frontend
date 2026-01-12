// app/page.tsx
import BottomNav from "@/app/components/BottomNav";
import TopNav from "@/app/components/TopNav";

import HeroCard from "@/app/components/HeroCard";
import TopStoriesList from "@/app/components/TopStoriesList";
import MostPopularCard from "@/app/components/MostPopularCard";
import LatestFeed from "@/app/components/LatestFeed";

import PumpfunSection from "@/app/components/PumpfunSection";
import BonkfunSection from "@/app/components/BonkfunSection";
import EditorsPickSection from "@/app/components/EditorsPickSection";
import HowToSection from "@/app/components/HowToSection";
import Footer from "@/app/components/Footer";

import { fetchHomeData, type Article } from "@/app/lib/strapi";

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-zinc-400">
            Missing <code className="rounded bg-zinc-900 px-1">NEXT_PUBLIC_STRAPI_URL</code>.
          </p>
        </div>
      </main>
    );
  }

  let articles: Article[] = [];
  let categories: any[] = [];

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

  return (
    <main className="min-h-screen bg-black text-white flex min-h-[100dvh] flex-col">
      {/* Subtle glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* Top nav */}
      <TopNav categories={categories} />

      {/* Page content */}
      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-8">
        {/* 1) HERO */}
        {hero ? <HeroCard hero={hero} /> : null}

        {/* 2) PUMPFUN (slug iz Strapi: pumpfun) */}
        <section className="mb-12">
          <PumpfunSection
            label="PUMPFUN"
            kicker="PUMP FUN"
            // preporuka: umjesto /category/... koristi filter rutu
            seeAllHref="/news?category=pumpfun"
            categorySlug="pumpfun"
            articles={articles}
            bg="#BFE7C7" // retro izblijeđena zelena + grain je već u komponenti
            takeItems={4}
          />
        </section>

        {/* 3) TOP STORIES + MOST POPULAR */}
        <section className="mb-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <TopStoriesList articles={topStories} />
          <MostPopularCard articles={mostPopular} />
        </section>

        {/* 4) BONKFUN (slug iz Strapi: bonkfun) */}
        <section className="mb-12">
          <BonkfunSection
            label="BONKFUN"
            kicker="BONK FUN"
            seeAllHref="/news?category=bonkfun"
            categorySlug="bonkfun"
            articles={articles}
            takeItems={4}
          />
        </section>

        {/* 5) EDITOR'S PICK
            ⚠️ OVO NE BI TREBALO BITI KATEGORIJA ako želiš manual pick.
            Najbolje: boolean field editorsPick u Strapi i onda filtriranje po tom.
            Ali ako ti je trenutno kategorija (npr slug "editors-pick"), stavi taj slug dolje.
        */}
        <section className="mb-12">
          <EditorsPickSection
            label="EDITOR'S PICK"
            seeAllHref="/news?editorsPick=true"
            articles={articles}
            // ako je kod tebe editors pick po kategoriji, dodaj u komponentu categorySlug pattern kao PumpfunSection
          />
        </section>

        {/* 6) HOW TO (slug iz Strapi: how-to) */}
        <section className="mb-12">
          <HowToSection
            label="HOW TO?"
            kicker="HOW TO"
            seeAllHref="/news?category=how-to"
            categorySlug="how-to"
            articles={articles}
            takeItems={4}
          />
        </section>

        {/* 7) LATEST */}
        <LatestFeed articles={latestFeed} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Bottom nav only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
