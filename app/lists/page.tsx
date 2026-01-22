// app/lists/page.tsx
import Link from "next/link";
import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";

import { fetchHomeData } from "@/app/lib/strapi";
import { fetchCuratedLists } from "@/app/lib/strapiCurated";
import { getViewer } from "@/app/lib/auth";

import FeaturedListCard from "@/app/lists/_components/FeaturedListCard";
import SectionHeader from "@/app/lists/_components/SectionHeader";
import ListRow from "@/app/lists/_components/ListRow";
import TokenRow from "@/app/lists/_components/TokenRow";
import DiscoverHero, { HeroItem } from "@/app/lists/_components/DiscoverHero";

import { fetchTokenFeed } from "@/app/lists/_lib/fetchTokenFeed";

const ENABLE_PRICING = process.env.NEXT_PUBLIC_ENABLE_PRICING === "true";

export type CuratedListLite = {
  id: number | string;
  title: string;
  slug: string;
  description?: string | null;
  isPremium?: boolean | null;
  chain?: string | null;
  category?: string | null;
  updatedAt?: string | null;
  tokensCount?: number | null;
};

function pickFeatured(lists: CuratedListLite[]) {
  const premium = lists.find((l) => Boolean(l.isPremium));
  return premium ?? lists[0] ?? null;
}

export default async function ListsIndexPage() {
  const baseUrl =
    process.env.STRAPI_URL ??
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    "http://localhost:1337";

  // nav categories
  let categories: Category[] = [];
  try {
    const home = await fetchHomeData(baseUrl);
    categories = home.categories ?? [];
  } catch {
    categories = [];
  }

  const viewer = await getViewer();

  // TOKENS (discover rails)
  const tokenFeed = await fetchTokenFeed(baseUrl);

  // CURATED LISTS (collections)
  const lists = (await fetchCuratedLists(baseUrl)) as CuratedListLite[];

  const featured = pickFeatured(lists);

  // IMPORTANT: do NOT duplicate featured inside premium grid
  const premiumListsAll = lists.filter((l) => Boolean(l.isPremium));
  const premiumLists =
    featured && featured.isPremium
      ? premiumListsAll.filter((l) => String(l.id) !== String(featured.id))
      : premiumListsAll;

  const freeLists = lists.filter((l) => !l.isPremium);

  // HERO items: use trending (fallback to top picks)
  const heroSource = (tokenFeed.trending?.length ? tokenFeed.trending : tokenFeed.topPicks) ?? [];
  const heroItems: HeroItem[] = heroSource.slice(0, 6).map((t) => ({
    id: t.symbol,
    title: `$${t.symbol}`,
    subtitle: t.tagline ?? t.descriptionShort ?? "",
    duration: "—",
    posterUrl: t.logoUrl ?? undefined,
    backdropUrl: t.logoUrl ?? undefined,
    href: `/tokens/${encodeURIComponent(t.symbol)}`,
    chain: t.chain ?? undefined,
    narrative: t.narrative ?? undefined,
    stats: {
      likes: Math.floor(20 + Math.random() * 300),
      saves: Math.floor(5 + Math.random() * 120),
    },
  }));

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-56 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-yellow-400/5 blur-[160px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-cyan-400/6 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Discover Tokens</h1>
          <p className="max-w-2xl text-zinc-300">
            Fast discovery: what’s trending now, what’s high-conviction, and what’s just emerging — curated.
          </p>
        </div>

        {/* HERO */}
        {heroItems.length ? (
          <div className="mb-8">
            <DiscoverHero items={heroItems} title="Up next" />
          </div>
        ) : null}

        {/* TOKEN RAILS */}
        <div className="space-y-8">
          <div>
            <SectionHeader title="Trending" subtitle="Most attention right now" />
            <div className="mt-4">
              <TokenRow tokens={tokenFeed.trending ?? []} />
            </div>
          </div>

          <div>
            <SectionHeader title="Top Picks" subtitle="High-conviction watchlist (curated)" />
            <div className="mt-4">
              <TokenRow tokens={tokenFeed.topPicks ?? []} />
            </div>
          </div>

          <div>
            <SectionHeader title="New & Notable" subtitle="Fresh launches and early momentum" />
            <div className="mt-4">
              <TokenRow tokens={tokenFeed.newNotable ?? []} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-zinc-800/60" />

        {/* CURATED COLLECTIONS */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Curated Collections</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Collections are deeper hubs: thesis, catalysts, lore, and “what to watch next”.
          </p>
        </div>

        {/* FEATURED HERO CARD */}
        {featured ? (
          <div className="mb-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-400">Featured collection</div>
                <div className="mt-1 text-2xl font-bold">One list worth opening right now</div>
                <div className="mt-1 text-sm text-zinc-400">
                  The quickest entry into “what to watch” + why.
                </div>
              </div>

              {ENABLE_PRICING && Boolean(featured.isPremium) && !viewer.isPro ? (
                <Link
                  href="/pricing"
                  className="hidden sm:inline-flex rounded-2xl border border-zinc-700 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Unlock Pro
                </Link>
              ) : null}
            </div>

            <div className="mt-4 rounded-3xl border border-zinc-800/60 bg-zinc-900/20 p-4 sm:p-5">
              <FeaturedListCard
                list={featured}
                isLocked={Boolean(featured.isPremium) && !viewer.isPro}
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {Boolean(featured.isPremium) && !viewer.isPro ? (
                  <>
                    <Link
                      href="/pricing"
                      className="inline-flex rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-200 hover:bg-yellow-400/15"
                    >
                      Unlock Full Access
                    </Link>
                    <div className="text-xs text-zinc-400">
                      Pro includes deeper notes, catalysts, risk flags, and future alerts.
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-zinc-400">Unlocked — you have full access to this collection.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* PREMIUM GRID (without featured duplication) */}
        {premiumLists.length ? (
          <div className="mb-10">
            <SectionHeader
              title="Premium Collections"
              subtitle="Deeper theses, catalysts, risk flags, and updates"
              right={
                ENABLE_PRICING && !viewer.isPro ? (
                  <Link
                    href="/pricing"
                    className="hidden sm:inline-flex rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Unlock Pro
                  </Link>
                ) : null
              }
            />
            <div className="mt-4">
              <ListRow
                lists={premiumLists}
                isLockedFn={(l) => Boolean(l.isPremium) && !viewer.isPro}
              />
            </div>
          </div>
        ) : null}

        {/* PUBLIC COLLECTIONS */}
        <div className="mb-10">
          <SectionHeader
            title="Public Collections"
            subtitle="Free lists you can open instantly"
          />
          <div className="mt-4">
            <ListRow lists={freeLists} isLockedFn={() => false} />
          </div>
        </div>

        {/* PRICING UPSELL */}
        {ENABLE_PRICING && !viewer.isPro ? (
          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="text-lg font-semibold">Want premium collections?</div>
            <p className="mt-2 text-sm text-zinc-400">
              Unlock Pro for premium collections, catalysts, risk flags, and future alerts.
            </p>
            <div className="mt-4">
              <Link
                href="/pricing"
                className="inline-flex rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                See pricing
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
