// app/components/CuratedGridClient.tsx
"use client";

import { useMemo, useState } from "react";
import TokenCard from "@/app/components/TokenCard";
import type { CuratedListItem } from "@/app/lib/strapiCurated";

type Launchpad = "pumpfun" | "letsbonk" | "bags" | "other";
type Meta = "meme" | "ai" | "other";

function SegButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-zinc-600 bg-zinc-200/10 text-white"
          : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white hover:border-zinc-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function CuratedGridClient({ items }: { items: CuratedListItem[] }) {
  const [launchpad, setLaunchpad] = useState<Launchpad | "all">("all");
  const [meta, setMeta] = useState<Meta | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return items
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .filter((it) => {
        const t = it.token;

        if (launchpad !== "all" && t.launchpad !== launchpad) return false;
        if (meta !== "all" && t.meta !== meta) return false;

        if (!needle) return true;

        const hay = `${t.name} ${t.symbol} ${t.mint ?? ""} ${t.descriptionShort ?? ""}`.toLowerCase();
        return hay.includes(needle);
      });
  }, [items, launchpad, meta, q]);

  const counts = useMemo(() => {
    const base = items ?? [];
    const countLaunchpad = (k: Launchpad) => base.filter((x) => x.token.launchpad === k).length;
    const countMeta = (k: Meta) => base.filter((x) => x.token.meta === k).length;

    return {
      total: base.length,
      pumpfun: countLaunchpad("pumpfun"),
      letsbonk: countLaunchpad("letsbonk"),
      bags: countLaunchpad("bags"),
      otherLaunchpad: countLaunchpad("other"),
      meme: countMeta("meme"),
      ai: countMeta("ai"),
      otherMeta: countMeta("other"),
    };
  }, [items]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-zinc-400">Launchpad</div>
            <div className="flex flex-wrap gap-2">
              <SegButton active={launchpad === "all"} onClick={() => setLaunchpad("all")}>
                All ({counts.total})
              </SegButton>
              <SegButton active={launchpad === "pumpfun"} onClick={() => setLaunchpad("pumpfun")}>
                PUMPFUN ({counts.pumpfun})
              </SegButton>
              <SegButton active={launchpad === "letsbonk"} onClick={() => setLaunchpad("letsbonk")}>
                LETSBONK ({counts.letsbonk})
              </SegButton>
              <SegButton active={launchpad === "bags"} onClick={() => setLaunchpad("bags")}>
                BAGS ({counts.bags})
              </SegButton>
              <SegButton active={launchpad === "other"} onClick={() => setLaunchpad("other")}>
                OTHER ({counts.otherLaunchpad})
              </SegButton>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs text-zinc-400">Meta</div>
            <div className="flex flex-wrap gap-2">
              <SegButton active={meta === "all"} onClick={() => setMeta("all")}>
                All ({counts.total})
              </SegButton>
              <SegButton active={meta === "meme"} onClick={() => setMeta("meme")}>
                MEME ({counts.meme})
              </SegButton>
              <SegButton active={meta === "ai"} onClick={() => setMeta("ai")}>
                AI ({counts.ai})
              </SegButton>
              <SegButton active={meta === "other"} onClick={() => setMeta("other")}>
                OTHER ({counts.otherMeta})
              </SegButton>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:w-[340px]">
            <div className="text-xs text-zinc-400">Search</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, symbol, mint..."
              className="h-10 w-full rounded-xl border border-zinc-800 bg-black/60 px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>
            Showing <span className="text-zinc-200">{filtered.length}</span> items
          </span>
          <button
            type="button"
            onClick={() => {
              setLaunchpad("all");
              setMeta("all");
              setQ("");
            }}
            className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-zinc-300 hover:border-zinc-700 hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <TokenCard
              key={it.id}
              rank={it.rank}
              name={it.token.name}
              symbol={it.token.symbol}
              launchpad={it.token.launchpad}
              meta={it.token.meta}
              description={it.token.descriptionShort}
              logoUrl={it.token.logoUrl}
              website={it.token.website}
              twitter={it.token.twitter}
              telegram={it.token.telegram}
              note={it.note}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-10 text-center text-sm text-zinc-400">
          No matches for current filters.
        </div>
      )}
    </div>
  );
}
