// app/tokens/[symbol]/page.tsx
import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";
import RatingStars from "@/app/components/RatingStars";

import { fetchHomeData } from "@/app/lib/strapi";
import { fetchTokenBySymbol } from "@/app/lib/strapiTokens";

function prettyLink(label: string, href: string) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/40"
    >
      {label}
    </a>
  );
}

export default async function TokenPage(props: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await props.params; // ✅ bitno
  const symbol = decodeURIComponent(rawSymbol ?? "").trim().toUpperCase();

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

  if (!symbol) {
    return (
      <main className="min-h-screen bg-black text-white">
        <TopNav categories={categories} />
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8 py-10">
          <h1 className="text-2xl font-bold">Token not found</h1>
          <p className="mt-2 text-zinc-400">Missing token symbol in URL.</p>
        </div>
        <Footer />
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    );
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

  const coverUrl = (token as any).coverUrl as string | null | undefined;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/20">
          <div className="pointer-events-none absolute inset-0">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt={token.name} className="h-full w-full object-cover opacity-75" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.10),rgba(0,0,0,0)_55%)]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.90),rgba(0,0,0,0.15))]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.60),rgba(0,0,0,0.05))]" />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
              <div className="min-w-0">
                <div className="flex items-start gap-5">
                  <div className="hidden sm:block">
                    <div className="h-[180px] w-[130px] overflow-hidden rounded-2xl border border-zinc-800/60 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
                      {token.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={token.logoUrl} alt={token.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-300">
                          {token.symbol}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-4xl font-bold tracking-tight">
                      {token.name} <span className="text-zinc-400">({token.symbol})</span>
                    </h1>

                    <div className="mt-2 text-sm text-zinc-300">
                      {token.launchpad ? `${token.launchpad} • ` : ""}
                      {token.meta ? `${token.meta} • ` : ""}
                      {token.chain ?? ""}
                    </div>

                    {token.descriptionShort ? (
                      <div className="mt-4 max-w-3xl text-zinc-200">{token.descriptionShort}</div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {token.website ? prettyLink("Website", token.website) : null}
                      {token.twitter ? prettyLink("Twitter", token.twitter) : null}
                      {token.telegram ? prettyLink("Telegram", token.telegram) : null}
                      {token.mint ? (
                        <div className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-2 text-xs text-zinc-300">
                          Mint: <span className="text-zinc-100">{token.mint}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-black/20 p-5">
                <div className="text-xs text-zinc-400">Community Rating</div>
                <div className="mt-2">
                  <RatingStars symbol={token.symbol} />
                </div>

                <div className="mt-6 text-xs text-zinc-400">Quick stats</div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-zinc-800/60 bg-black/20 p-3">
                    <div className="text-xs text-zinc-400">Chain</div>
                    <div className="mt-1 font-semibold text-white">{token.chain ?? "—"}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800/60 bg-black/20 p-3">
                    <div className="text-xs text-zinc-400">Meta</div>
                    <div className="mt-1 font-semibold text-white">{token.meta ?? "—"}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800/60 bg-black/20 p-3">
                    <div className="text-xs text-zinc-400">Launchpad</div>
                    <div className="mt-1 font-semibold text-white">{token.launchpad ?? "—"}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800/60 bg-black/20 p-3">
                    <div className="text-xs text-zinc-400">Symbol</div>
                    <div className="mt-1 font-semibold text-white">${token.symbol}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:hidden flex items-center gap-3">
              {token.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={token.logoUrl} alt={token.name} className="h-12 w-12 rounded-2xl object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-zinc-800/60" />
              )}
              <div className="min-w-0">
                <div className="truncate font-semibold">{token.name}</div>
                <div className="text-sm text-zinc-400">${token.symbol}</div>
              </div>
            </div>
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
