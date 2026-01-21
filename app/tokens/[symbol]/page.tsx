import Link from "next/link";
import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";
import RatingStars from "@/app/components/RatingStars";

import { fetchHomeData } from "@/app/lib/strapi";
import { fetchTokenBySymbol } from "@/app/lib/strapiTokens";

function prettyLink(label: string, href: string) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/40"
    >
      {label}
    </Link>
  );
}

export default async function TokenPage(props: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await props.params;
  const symbol = decodeURIComponent(rawSymbol).trim().toUpperCase();

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

  const token = await fetchTokenBySymbol(baseUrl, symbol);

  if (!token) {
    return (
      <main className="min-h-screen bg-black text-white">
        <TopNav categories={categories} />
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8 py-10">
          <h1 className="text-2xl font-bold">Token not found</h1>
          <p className="mt-2 text-zinc-400">No token with symbol: {symbol}</p>
        </div>
        <Footer />
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex min-h-[100dvh] flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
          <div className="flex items-center gap-4">
            {token.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={token.logoUrl}
                alt={token.name}
                className="h-14 w-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-zinc-800/60" />
            )}

            <div>
              <h1 className="text-3xl font-bold">
                {token.name} <span className="text-zinc-400">({token.symbol})</span>
              </h1>
              <div className="mt-1 text-sm text-zinc-400">
                {token.launchpad} • {token.meta} • {token.chain}
              </div>
            </div>
          </div>

          {token.descriptionShort ? (
            <div className="mt-5 max-w-3xl text-zinc-200">{token.descriptionShort}</div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {token.website ? prettyLink("Website", token.website) : null}
            {token.twitter ? prettyLink("Twitter", token.twitter) : null}
            {token.telegram ? prettyLink("Telegram", token.telegram) : null}
            {token.mint ? (
              <div className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-2 text-xs text-zinc-300">
                Mint: <span className="text-zinc-100">{token.mint}</span>
              </div>
            ) : null}
          </div>

          {/* Ratings */}
          <RatingStars symbol={token.symbol} />
        </div>
      </div>

      <Footer />
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
