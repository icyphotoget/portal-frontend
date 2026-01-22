// app/lists/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";

import { fetchHomeData } from "@/app/lib/strapi";
import { fetchCuratedLists } from "@/app/lib/strapiCurated";
import { getViewer } from "@/app/lib/auth";

import ListHero from "@/app/lists/_components/ListHero";
import SectionNav from "@/app/lists/_components/SectionNav";
import ListSection from "@/app/lists/_components/ListSection";
import TokenCarousel from "@/app/lists/_components/TokenCarousel";
import TokenGrid from "@/app/lists/_components/TokenGrid";
import CatalystsTimeline from "@/app/lists/_components/CatalystsTimeline";
import XEmbedGrid from "@/app/lists/_components/XEmbedGrid";
import SimilarLists from "@/app/lists/_components/SimilarLists";
import ReviewsBlock from "@/app/lists/_components/ReviewsBlock";

export type TokenItem = {
  id?: string | number;
  name?: string | null;
  symbol: string;
  logoUrl?: string | null;
  thesis?: string | null;
  tags?: string[];
  status?: "Top Pick" | "Trending" | "Watch" | "Avoid" | "New" | string;
  score?: number | null;
};

export type CatalystItem = {
  title: string;
  date?: string | null; // ISO
  tokenSymbol?: string | null;
  note?: string | null;
};

export type CuratedListDetail = {
  id: string | number;
  title: string;
  slug: string;
  description?: string | null;

  isPremium?: boolean | null;

  chain?: string | null;
  category?: string | null;
  riskLevel?: "Low" | "Medium" | "High" | string | null;
  updatedAt?: string | null;

  score?: number | null; // “Signal Score” (IMDB-style)
  tagline?: string | null;

  tokens?: TokenItem[];
  topPicks?: TokenItem[];
  trending?: TokenItem[];

  catalysts?: CatalystItem[];
  media?: { url: string; label?: string | null }[];

  similarLists?: { title: string; slug: string; isPremium?: boolean | null }[];
};

function coerceTokens(raw: any): TokenItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((t) => {
        const symbol = (t?.symbol ?? t?.ticker ?? t?.token ?? "").toString().trim();
        if (!symbol) return null;
        return {
          id: t?.id ?? symbol,
          name: t?.name ?? null,
          symbol,
          logoUrl: t?.logoUrl ?? t?.logo ?? t?.image ?? null,
          thesis: t?.thesis ?? t?.note ?? t?.description ?? null,
          tags: Array.isArray(t?.tags) ? t.tags : [],
          status: t?.status ?? null,
          score: typeof t?.score === "number" ? t.score : null,
        } as TokenItem;
      })
      .filter(Boolean) as TokenItem[];
  }
  return [];
}

function deriveSections(tokens: TokenItem[]) {
  const topPicks = tokens.filter((t) => (t.status || "").toLowerCase().includes("top"));
  const trending = tokens.filter((t) => (t.status || "").toLowerCase().includes("trend"));
  const rest = tokens.filter((t) => !topPicks.includes(t) && !trending.includes(t));

  return {
    topPicks: topPicks.length ? topPicks : tokens.slice(0, 8),
    trending: trending.length ? trending : tokens.slice(0, 12),
    all: rest.length ? rest : tokens,
  };
}

export default async function ListDetailPage({ params }: { params: { slug: string } }) {
  const baseUrl =
    process.env.STRAPI_URL ??
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    "http://localhost:1337";

  let categories: Category[] = [];
  try {
    const home = await fetchHomeData(baseUrl);
    categories = home.categories ?? [];
  } catch {
    categories = [];
  }

  const viewer = await getViewer();
  const lists = (await fetchCuratedLists(baseUrl)) as any[];

  const found = lists.find((l) => String(l.slug) === String(params.slug));
  if (!found) return notFound();

  // Build a robust "detail" object from whatever you have now.
  const detail: CuratedListDetail = {
    id: found.id,
    title: found.title,
    slug: found.slug,
    description: found.description ?? null,
    isPremium: Boolean(found.isPremium),

    chain: found.chain ?? null,
    category: found.category ?? null,
    riskLevel: found.riskLevel ?? null,
    updatedAt: found.updatedAt ?? null,

    score: typeof found.score === "number" ? found.score : 8.1, // nice default
    tagline: found.tagline ?? found.subtitle ?? null,

    tokens: coerceTokens(found.tokens ?? found.items ?? found.coins),
    catalysts: Array.isArray(found.catalysts) ? found.catalysts : [],
    media: Array.isArray(found.media) ? found.media : [],
    similarLists: Array.isArray(found.similarLists) ? found.similarLists : [],
  };

  const locked = Boolean(detail.isPremium) && !viewer.isPro;
  const sections = deriveSections(detail.tokens ?? []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-56 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-yellow-400/5 blur-[160px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-cyan-400/6 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-8">
        <div className="mb-4">
          <Link href="/lists" className="text-sm text-zinc-400 hover:text-zinc-200">
            ← Back to lists
          </Link>
        </div>

        <ListHero list={detail} locked={locked} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px,1fr]">
          <div className="hidden lg:block">
            <SectionNav
              items={[
                { id: "overview", label: "Overview" },
                { id: "top-picks", label: "Top Picks" },
                { id: "trending", label: "Trending" },
                { id: "catalysts", label: "Catalysts" },
                { id: "media", label: "Lore / Media" },
                { id: "similar", label: "More like this" },
                { id: "reviews", label: "Reviews" },
              ]}
            />
          </div>

          <div className="space-y-10">
            <ListSection id="overview" title="Overview" subtitle="What this collection is about">
              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5">
                <p className="text-zinc-300 leading-relaxed">
                  {detail.description ?? "This list is a curated token hub with sections, picks and context."}
                </p>

                {locked ? (
                  <div className="mt-4 rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-4">
                    <div className="font-semibold text-yellow-200">Premium collection</div>
                    <p className="mt-1 text-sm text-zinc-300">
                      Unlock Pro to see full picks, catalysts and deeper notes.
                    </p>
                    <div className="mt-3">
                      <Link
                        href="/pricing"
                        className="inline-flex rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                      >
                        Unlock Pro
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </ListSection>

            <ListSection id="top-picks" title="Top Picks" subtitle="Top-billed cast (the ones to watch)">
              <TokenCarousel tokens={sections.topPicks} locked={locked} />
            </ListSection>

            <ListSection id="trending" title="Trending Now" subtitle="What’s moving right now">
              <TokenGrid tokens={sections.trending} locked={locked} />
            </ListSection>

            <ListSection id="catalysts" title="Catalysts" subtitle="Potential events that can move price / attention">
              <CatalystsTimeline catalysts={detail.catalysts ?? []} locked={locked} />
            </ListSection>

            <ListSection id="media" title="Lore / Media" subtitle="Context + embeds (IMDB ‘Media’ vibe)">
              <XEmbedGrid
                embeds={(detail.media ?? []).map((m) => m.url).filter(Boolean)}
                locked={locked}
              />
            </ListSection>

            <ListSection id="similar" title="More like this" subtitle="If you like this list, you’ll like these">
              <SimilarLists lists={detail.similarLists ?? []} />
            </ListSection>

            <ListSection id="reviews" title="Reviews" subtitle="Social proof + comments (great premium hook)">
              <ReviewsBlock locked={locked} />
            </ListSection>
          </div>
        </div>
      </div>

      <Footer />
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
