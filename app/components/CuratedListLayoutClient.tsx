"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CuratedListItem } from "@/app/lib/strapiCurated";

type SortMode = "rank" | "name" | "rating";

function pill(active: boolean) {
  return [
    "rounded-md border px-3 py-1.5 text-xs font-medium transition",
    active
      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-300"
      : "border-zinc-700/50 bg-zinc-900/50 text-zinc-400 hover:border-yellow-500/30 hover:text-yellow-200",
  ].join(" ");
}

function badgePill() {
  return "rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-zinc-200 backdrop-blur-sm ring-1 ring-white/10";
}

function metaBadge(meta: string) {
  const base = badgePill();
  if (meta === "ai") return `${base} text-cyan-200`;
  if (meta === "meme") return `${base} text-fuchsia-200`;
  return `${base} text-zinc-200`;
}

function launchpadBadge(lp: string) {
  const base = badgePill();
  if (lp === "pumpfun") return `${base} text-emerald-200`;
  if (lp === "letsbonk") return `${base} text-orange-200`;
  if (lp === "bags") return `${base} text-indigo-200`;
  return `${base} text-zinc-200`;
}

function RatingCorner({
  avg,
  count,
}: {
  avg?: number | null;
  count?: number | null;
}) {
  const a = typeof avg === "number" ? avg : null;
  const c = typeof count === "number" ? count : 0;

  // If you don’t have rating fields on token yet, this will just show "—"
  const label = a == null || c <= 0 ? "—" : a.toFixed(1);

  return (
    <div
      className={[
        "absolute bottom-2 right-2 z-10",
        "rounded-md bg-black/80 px-2 py-1",
        "backdrop-blur-sm ring-1 ring-yellow-500/25",
        "flex items-center gap-1.5",
        "shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
      ].join(" ")}
      aria-label="Community rating"
      title={a == null || c <= 0 ? "No ratings yet" : `${label} (${c})`}
    >
      <span className="text-yellow-300">★</span>
      <span className="text-xs font-semibold text-white">{label}</span>
      {c > 0 ? <span className="text-[10px] text-zinc-400">({c})</span> : null}
    </div>
  );
}

export default function CuratedListLayoutClient({
  items,
}: {
  items: CuratedListItem[];
}) {
  const [q, setQ] = useState("");
  const [meta, setMeta] = useState<"all" | "meme" | "ai" | "other">("all");
  const [launchpad, setLaunchpad] = useState<
    "all" | "pumpfun" | "letsbonk" | "bags" | "other"
  >("all");
  const [sort, setSort] = useState<SortMode>("rank");

  const filtered = useMemo(() => {
    const base = items.filter((it) => {
      const text = `${it.token.name} ${it.token.symbol}`.toLowerCase();
      const okQ = !q.trim() || text.includes(q.trim().toLowerCase());
      const okMeta = meta === "all" || (it.token.meta ?? "other") === meta;
      const okLp =
        launchpad === "all" || (it.token.launchpad ?? "other") === launchpad;
      return okQ && okMeta && okLp;
    });

    const sorted = [...base].sort((a, b) => {
      if (sort === "rank") return (a.rank ?? 999) - (b.rank ?? 999);
      if (sort === "name")
        return (a.token.name ?? "").localeCompare(b.token.name ?? "");

      // rating sort (desc). If missing fields, fall back to -1.
      const ar =
        typeof (a.token as any).ratingAvg === "number"
          ? (a.token as any).ratingAvg
          : -1;
      const br =
        typeof (b.token as any).ratingAvg === "number"
          ? (b.token as any).ratingAvg
          : -1;
      return br - ar;
    });

    return sorted;
  }, [items, q, meta, launchpad, sort]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Filters */}
      <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 lg:sticky lg:top-24 lg:h-fit">
        <div className="text-sm font-semibold text-white">Filters</div>

        <div className="mt-3">
          <div className="text-xs text-zinc-400">Search</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="FartCoin, FART..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/10"
          />
        </div>

        <div className="mt-5">
          <div className="text-xs text-zinc-400">Meta</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", "meme", "ai", "other"] as const).map((m) => (
              <button
                key={m}
                className={pill(meta === m)}
                onClick={() => setMeta(m)}
                type="button"
              >
                {m === "all" ? "All" : m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs text-zinc-400">Launchpad</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", "pumpfun", "letsbonk", "bags", "other"] as const).map(
              (lp) => (
                <button
                  key={lp}
                  className={pill(launchpad === lp)}
                  onClick={() => setLaunchpad(lp)}
                  type="button"
                >
                  {lp === "all"
                    ? "All"
                    : lp === "pumpfun"
                      ? "Pump.fun"
                      : lp === "letsbonk"
                        ? "LetsBonk"
                        : lp.toUpperCase()}
                </button>
              )
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs text-zinc-400">Sort</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className={pill(sort === "rank")}
              onClick={() => setSort("rank")}
              type="button"
            >
              Rank
            </button>
            <button
              className={pill(sort === "rating")}
              onClick={() => setSort("rating")}
              type="button"
            >
              Rating
            </button>
            <button
              className={pill(sort === "name")}
              onClick={() => setSort("name")}
              type="button"
            >
              Name
            </button>
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Showing <span className="text-zinc-200">{filtered.length}</span> of{" "}
          <span className="text-zinc-200">{items.length}</span>
        </div>
      </aside>

      {/* Tokenpedia-style grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((it) => {
          const t = it.token as any; // in case rating fields are not typed yet
          const ratingAvg = t.ratingAvg ?? null;
          const ratingCount = t.ratingCount ?? null;

          return (
            <Link
              key={it.id}
              href={`/tokens/${encodeURIComponent(
                (it.token.symbol ?? "").toLowerCase()
              )}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/25 transition hover:border-yellow-500/25 hover:bg-zinc-900/40"
            >
              {/* “Poster” area */}
              <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900/60">
                {it.token.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.token.logoUrl}
                    alt={it.token.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-5xl font-bold text-zinc-700">
                      {(it.token.symbol ?? "?").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* rank pill */}
                <div className="absolute left-2 top-2 z-10 rounded-md bg-black/70 px-2 py-1 text-[11px] text-zinc-200 backdrop-blur-sm ring-1 ring-white/10">
                  #{it.rank ?? "—"}
                </div>

                {/* badges bottom-left */}
                <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1">
                  <span className={launchpadBadge(it.token.launchpad ?? "other")}>
                    {it.token.launchpad ?? "other"}
                  </span>
                  <span className={metaBadge(it.token.meta ?? "other")}>
                    {it.token.meta ?? "other"}
                  </span>
                </div>

                {/* ⭐ rating bottom-right (bigger + visible) */}
                <RatingCorner avg={ratingAvg} count={ratingCount} />

                {/* subtle vignette */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.55))]" />
              </div>

              {/* info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-white group-hover:text-yellow-200">
                      {it.token.name}{" "}
                      <span className="text-zinc-500">
                        ({it.token.symbol})
                      </span>
                    </div>
                  </div>
                </div>

                {it.token.descriptionShort ? (
                  <div className="mt-2 line-clamp-2 text-sm text-zinc-400">
                    {it.token.descriptionShort}
                  </div>
                ) : null}

                {it.note ? (
                  <div className="mt-3 rounded-xl border border-zinc-800 bg-black/25 p-3 text-sm text-zinc-200">
                    {it.note}
                  </div>
                ) : null}

                <div className="mt-3 text-xs text-zinc-500 group-hover:text-zinc-400">
                  Open token →
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
