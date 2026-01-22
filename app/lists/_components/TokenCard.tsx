// app/lists/_components/TokenCard.tsx
import { Badge, cn } from "./ui";

type TokenItem = {
  name?: string | null;
  symbol: string;
  logoUrl?: string | null;
  thesis?: string | null;
  tags?: string[];
  status?: string;
  score?: number | null;
};

function initials(symbol: string) {
  const s = symbol.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return s.slice(0, 4) || "TOK";
}

export default function TokenCard({ token, locked }: { token: TokenItem; locked: boolean }) {
  const status = (token.status ?? "").toString();
  const isTop = status.toLowerCase().includes("top");
  const isTrend = status.toLowerCase().includes("trend");
  const isAvoid = status.toLowerCase().includes("avoid");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4",
        "hover:border-yellow-500/20 hover:bg-zinc-900/35"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-black/20">
            {token.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={token.logoUrl} alt={token.symbol} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-300">
                {initials(token.symbol)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate font-semibold text-white">${token.symbol}</div>
              {isTop ? <Badge tone="gold">Top Pick</Badge> : null}
              {isTrend ? <Badge tone="cyan">Trending</Badge> : null}
              {isAvoid ? <Badge tone="danger">Avoid</Badge> : null}
            </div>
            {token.name ? <div className="truncate text-xs text-zinc-400">{token.name}</div> : null}
          </div>
        </div>

        {typeof token.score === "number" ? (
          <div className="shrink-0 rounded-xl border border-zinc-800/60 bg-black/20 px-2 py-1 text-xs text-zinc-300">
            {token.score.toFixed(1)}
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-sm text-zinc-300">
        {locked ? (
          <span className="text-zinc-500">Unlock Pro to see notes.</span>
        ) : (
          <span className="line-clamp-2">{token.thesis ?? "No note yet."}</span>
        )}
      </div>

      {token.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {token.tags.slice(0, 4).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
