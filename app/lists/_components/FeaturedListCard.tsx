// app/lists/_components/FeaturedListCard.tsx
import Link from "next/link";
import { Badge } from "./ui";

type CuratedListLite = {
  id: number | string;
  title: string;
  slug: string;
  description?: string | null;
  isPremium?: boolean | null;
  chain?: string | null;
  category?: string | null;
  updatedAt?: string | null;
  tokensCount?: number | null;
};

export default function FeaturedListCard({
  list,
  isLocked,
}: {
  list: CuratedListLite;
  isLocked: boolean;
}) {
  return (
    <Link
      href={`/lists/${encodeURIComponent(list.slug)}`}
      className="group block overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/20"
    >
      <div className="relative p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.10),rgba(0,0,0,0)_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.10),rgba(0,0,0,0)_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.85))]" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            {list.isPremium ? <Badge tone="gold">PREMIUM</Badge> : <Badge>FREE</Badge>}
            {isLocked ? <Badge>🔒 LOCKED</Badge> : null}
            {list.chain ? <Badge tone="cyan">{list.chain}</Badge> : null}
            {list.category ? <Badge>{list.category}</Badge> : null}
          </div>

          <div className="mt-4 text-3xl font-bold tracking-tight text-white group-hover:text-yellow-100">
            {list.title}
          </div>

          <div className="mt-3 max-w-2xl text-zinc-300">
            {list.description ?? "Open this collection to browse sections, picks, catalysts and lore."}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15">
            Open featured list →
          </div>
        </div>
      </div>
    </Link>
  );
}
