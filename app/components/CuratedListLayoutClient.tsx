"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CuratedListItem } from "@/app/lib/strapiCurated";

type SortMode = "rank" | "name";

function pill(active: boolean) {
  return [
    "rounded-full border px-3 py-1 text-xs transition",
    active
      ? "border-zinc-600 bg-zinc-900 text-white"
      : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700",
  ].join(" ");
}

function badgeBase() {
  return "rounded-full border border-zinc-800 bg-black/20 px-2 py-0.5 text-[11px] text-zinc-200";
}

function metaBadge(meta: string) {
  if (meta === "ai") return `${badgeBase()} border-cyan-500/30 text-cyan-200`;
  if (meta === "meme") return `${badgeBase()} border-fuchsia-500/30 text-fuchsia-200`;
  return `${badgeBase()}`;
}

function launchpadBadge(lp: string) {
  if (lp === "pumpfun") return `${badgeBase()} border-emerald-500/30 text-emerald-200`;
  if (lp === "letsbonk") return `${badgeBase()} border-orange-500/30 text-orange-200`;
  if (lp === "bags") return `${badgeBase()} border-indigo-500/30 text-indigo-200`;
  return `${badgeBase()}`;
}

export default function CuratedListLayoutClient({ items }: { items: CuratedListItem[] }) {
  const [q, setQ] = useState("");
  const [meta, setMeta] = useState<"all" | "meme" | "ai" | "other">("all");
  const [launchpad, setLaunchpad] = useState<"all" | "pumpfun" | "letsbonk" | "bags" | "other">("all");
  const [sort, setSort] = useState<SortMode>("rank");

  const filtered = useMemo(() => {
    const base = items.filter((it) => {
      const text = `${it.token.name} ${it.token.symbol}`.toLowerCase();
      const okQ = !q.trim() || text.includes(q.trim().toLowerCase());
      const okMeta = meta === "all" || it.token.meta === meta;
      const okLp = launchpad === "all" || it.token.launchpad === launchpad;
      return okQ && okMeta && okLp;
    });

    const sorted = [...base].sort((a, b) => {
      if (sort === "rank") return (a.rank ?? 999) - (b.rank ?? 999);
      return (a.token.name ?? "").localeCompare(b.token.name ?? "");
    });

    return sorted;
  }, [items, q, meta, launchpad, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 lg:sticky lg:top-24 lg:h-fit">
        <div className="text-sm font-semibold text-white">Filters</div>

        <div className="mt-3">
          <div className="text-xs text-zinc-400">Search</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="FartCoin, FART..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-zinc-600"
          />
        </div>

        <div className="mt-5">
          <div className="text-xs text-zinc-400">Meta</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", "meme", "ai", "other"] as const).map((m) => (
              <button key={m} className={pill(meta === m)} onClick={() => setMeta(m)}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs text-zinc-400">Launchpad</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", "pumpfun", "letsbonk", "bags", "other"] as const).map((lp) => (
              <button key={lp} className={pill(launchpad === lp)} onClick={() => setLaunchpad(lp)}>
                {lp.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs text-zinc-400">Sort</div>
          <div className="mt-2 flex gap-2">
            <button className={pill(sort === "rank")} onClick={() => setSort("rank")}>
              RANK
            </button>
            <button className={pill(sort === "name")} onClick={() => setSort("name")}>
              NAME
            </button>
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Showing <span className="text-zinc-300">{filtered.length}</span> of{" "}
          <span className="text-zinc-300">{items.length}</span>
        </div>
      </aside>

      {/* Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((it) => (
          <Link
            key={it.id}
            href={`/tokens/${encodeURIComponent(it.token.symbol.toLowerCase())}`}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold text-zinc-300">#{it.rank}</div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={launchpadBadge(it.token.launchpad)}>{it.token.launchpad}</span>
                <span className={metaBadge(it.token.meta)}>{it.token.meta}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              {it.token.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.token.logoUrl}
                  alt={it.token.name}
                  className="h-10 w-10 rounded-xl object-cover ring-1 ring-zinc-800"
                />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-zinc-800/60" />
              )}

              <div className="min-w-0">
                <div className="truncate text-lg font-semibold text-white">
                  {it.token.name} <span className="text-zinc-400">({it.token.symbol})</span>
                </div>
                {it.token.descriptionShort ? (
                  <div className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {it.token.descriptionShort}
                  </div>
                ) : null}
              </div>
            </div>

            {it.note ? (
              <div className="mt-3 rounded-xl border border-zinc-800 bg-black/20 p-3 text-sm text-zinc-200">
                {it.note}
              </div>
            ) : null}

            <div className="mt-3 text-xs text-zinc-500 group-hover:text-zinc-400">
              Open token →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
