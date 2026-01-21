// app/lists/page.tsx

import Link from "next/link";
import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";

import { fetchHomeData } from "@/app/lib/strapi";
import { fetchCuratedLists } from "@/app/lib/strapiCurated";
import { getViewer } from "@/app/lib/auth";

const ENABLE_PRICING = process.env.NEXT_PUBLIC_ENABLE_PRICING === "true";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-800 bg-black/20 px-2 py-0.5 text-[11px] text-zinc-200">
      {children}
    </span>
  );
}

export default async function ListsIndexPage() {
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
  const lists = await fetchCuratedLists(baseUrl);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Curated Lists</h1>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Hand-picked token lists.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lists.map((l) => {
            const locked = Boolean(l.isPremium) && !viewer.isPro;

            return (
              <Link
                key={l.id}
                href={`/lists/${encodeURIComponent(l.slug)}`}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-xl font-semibold text-white">
                      {l.title}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {l.isPremium ? <Badge>PREMIUM</Badge> : <Badge>FREE</Badge>}
                    {locked ? <Badge>🔒 LOCKED</Badge> : null}
                  </div>
                </div>

                <div className="mt-4 text-sm text-zinc-400 group-hover:text-zinc-300">
                  Open list →
                </div>
              </Link>
            );
          })}
        </section>

        {/* 🔒 Pricing Upsell (FEATURE-FLAGGED) */}
        {ENABLE_PRICING && !viewer.isPro ? (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="text-lg font-semibold">Want premium lists?</div>
            <p className="mt-2 text-sm text-zinc-400">
              Unlock Pro to view premium picks.
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
