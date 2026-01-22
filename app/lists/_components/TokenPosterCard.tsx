// app/lists/_components/TokenPosterCard.tsx
import Link from "next/link";
import { Badge, cn } from "./ui";

export type TokenPoster = {
  symbol: string;
  name?: string | null;
  logoUrl?: string | null;
  tagline?: string | null;
  chain?: string | null;
  narrative?: string | null;
  score?: number | null;
};

function initials(symbol: string) {
  const s = (symbol ?? "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  return (s.slice(0, 4) || "TOK").toUpperCase();
}

export default function TokenPosterCard({ token }: { token: TokenPoster }) {
  const sym = (token.symbol ?? "").trim();
  const href = `/tokens/${encodeURIComponent(sym)}`; // ✅ /tokens

  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-3 transition",
        "hover:border-yellow-500/20 hover:bg-zinc-900/35"
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800/60 bg-black/20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.08),rgba(0,0,0,0)_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),rgba(0,0,0,0)_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.85))]" />
        </div>

        <div className="relative flex h-full flex-col justify-between p-3">
          <div className="flex items-start justify-between gap-2">
            {token.score != null ? (
              <div className="rounded-lg border border-zinc-800/60 bg-black/30 px-2 py-1 text-xs text-zinc-200">
                {token.score.toFixed(1)}
              </div>
            ) : (
              <div />
            )}
            {token.chain ? <Badge tone="cyan">{token.chain}</Badge> : null}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl border border-zinc-800 bg-black/20">
              {token.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={token.logoUrl} alt={sym} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-300">
                  {initials(sym)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white group-hover:text-yellow-200">
                ${sym || "—"}
              </div>
              {token.name ? <div className="truncate text-xs text-zinc-400">{token.name}</div> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        {token.tagline ? (
          <div className="line-clamp-2 text-sm text-zinc-300">{token.tagline}</div>
        ) : (
          <div className="text-sm text-zinc-500">Open token →</div>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {token.narrative ? <Badge>{token.narrative}</Badge> : null}
        </div>
      </div>
    </Link>
  );
}
