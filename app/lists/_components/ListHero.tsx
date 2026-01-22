// app/lists/_components/ListHero.tsx
import Link from "next/link";
import { Badge } from "./ui";

type CuratedListDetail = {
  title: string;
  tagline?: string | null;
  description?: string | null;
  isPremium?: boolean | null;
  chain?: string | null;
  category?: string | null;
  riskLevel?: string | null;
  updatedAt?: string | null;
  score?: number | null;
};

function formatScore(n?: number | null) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toFixed(1);
}

export default function ListHero({ list, locked }: { list: CuratedListDetail; locked: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.10),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.10),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.85))]" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {list.isPremium ? <Badge tone="gold">PREMIUM</Badge> : <Badge>FREE</Badge>}
              {locked ? <Badge>🔒 LOCKED</Badge> : null}
              {list.chain ? <Badge tone="cyan">{list.chain}</Badge> : null}
              {list.category ? <Badge>{list.category}</Badge> : null}
              {list.riskLevel ? <Badge tone={String(list.riskLevel).toLowerCase().includes("high") ? "danger" : "neutral"}>
                Risk: {list.riskLevel}
              </Badge> : null}
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">{list.title}</h1>

            <p className="mt-3 max-w-2xl text-zinc-300">
              {list.tagline ?? list.description ?? "A curated token hub with sections, picks and context."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="#top-picks"
                className="inline-flex rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                Jump to Top Picks
              </a>

              {locked ? (
                <Link
                  href="/pricing"
                  className="inline-flex rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-100 hover:bg-yellow-500/15"
                >
                  Unlock Pro
                </Link>
              ) : null}
            </div>
          </div>

          {/* IMDB-style score */}
          <div className="shrink-0 rounded-2xl border border-zinc-800/60 bg-black/20 p-4">
            <div className="text-xs text-zinc-400">Signal Score</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-4xl font-bold text-white">{formatScore(list.score)}</div>
              <div className="pb-1 text-sm text-zinc-400">/ 10</div>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              Based on momentum, narrative fit, and curated notes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
