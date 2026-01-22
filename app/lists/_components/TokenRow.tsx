// app/lists/_components/TokenRow.tsx
import TokenPosterCard, { TokenPoster } from "./TokenPosterCard";

export default function TokenRow({ tokens }: { tokens: TokenPoster[] }) {
  if (!tokens?.length) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tokens.map((t) => (
        <div key={t.symbol} className="w-[190px] shrink-0">
          <TokenPosterCard token={t} />
        </div>
      ))}
    </div>
  );
}
