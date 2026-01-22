// app/lists/_components/TokenGrid.tsx
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

export default function TokenGrid({ tokens, locked }: { tokens: TokenItem[]; locked: boolean }) {
  if (!tokens?.length) {
    return (
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5 text-sm text-zinc-400">
        Nothing here yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tokens.map((t) => (
        <TokenCard key={t.symbol} token={t} locked={locked} />
      ))}
    </div>
  );
}
