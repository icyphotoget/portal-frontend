// app/lists/_components/TokenCarousel.tsx
import TokenCard from "./TokenCard";

type TokenItem = {
  name?: string | null;
  symbol: string;
  logoUrl?: string | null;
  thesis?: string | null;
  tags?: string[];
  status?: string;
  score?: number | null;
};

export default function TokenCarousel({ tokens, locked }: { tokens: TokenItem[]; locked: boolean }) {
  if (!tokens?.length) {
    return (
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5 text-sm text-zinc-400">
        No tokens yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tokens.map((t) => (
          <div key={t.symbol} className="w-[320px] shrink-0">
            <TokenCard token={t} locked={locked} />
          </div>
        ))}
      </div>
    </div>
  );
}
