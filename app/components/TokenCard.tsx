// app/components/TokenCard.tsx
import Link from "next/link";

type Props = {
  rank: number;
  name: string;
  symbol: string;
  launchpad: "pumpfun" | "letsbonk" | "bags" | "other";
  meta: "meme" | "ai" | "other";
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  note?: string | null;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-200">
      {children}
    </span>
  );
}

function prettyLaunchpad(v: Props["launchpad"]) {
  if (v === "pumpfun") return "PUMPFUN";
  if (v === "letsbonk") return "LETSBONK";
  if (v === "bags") return "BAGS";
  return "OTHER";
}

function prettyMeta(v: Props["meta"]) {
  if (v === "meme") return "MEME";
  if (v === "ai") return "AI";
  return "OTHER";
}

export default function TokenCard(p: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.logoUrl ? <img src={p.logoUrl} alt={p.symbol} className="h-full w-full object-cover" /> : <span className="text-xs text-zinc-500">{p.symbol?.[0]}</span>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">#{p.rank}</span>
                <h3 className="truncate text-sm font-semibold text-white">
                  {p.name} <span className="text-zinc-400">({p.symbol})</span>
                </h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{prettyLaunchpad(p.launchpad)}</Badge>
                <Badge>{prettyMeta(p.meta)}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {p.website ? (
                <a className="text-xs text-zinc-400 hover:text-white" href={p.website} target="_blank" rel="noreferrer">
                  Web
                </a>
              ) : null}
              {p.twitter ? (
                <a className="text-xs text-zinc-400 hover:text-white" href={p.twitter} target="_blank" rel="noreferrer">
                  X
                </a>
              ) : null}
              {p.telegram ? (
                <a className="text-xs text-zinc-400 hover:text-white" href={p.telegram} target="_blank" rel="noreferrer">
                  TG
                </a>
              ) : null}
            </div>
          </div>

          {p.description ? <p className="mt-3 line-clamp-2 text-sm text-zinc-300">{p.description}</p> : null}
          {p.note ? <p className="mt-2 text-xs text-zinc-500">Note: {p.note}</p> : null}

          {/* optional: link na token detail page */}
          {/* <Link href={`/token/${p.symbol.toLowerCase()}`} className="mt-3 inline-block text-xs text-cyan-300 hover:text-cyan-200">View</Link> */}
        </div>
      </div>
    </div>
  );
}
