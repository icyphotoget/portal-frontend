// app/lists/_components/ListPosterCard.tsx
import Link from "next/link";
import { Badge, cn } from "./ui";

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

function ListCover({ title, premium }: { title: string; premium: boolean }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.06),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.06),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.80))]" />
      </div>

      <div className="relative flex h-full flex-col justify-end p-4">
        <div className="text-xs text-zinc-400">
          {premium ? "Premium collection" : "Public collection"}
        </div>
        <div className="mt-1 line-clamp-2 text-lg font-semibold text-white">{title}</div>
      </div>
    </div>
  );
}

export default function ListPosterCard({ list, locked }: { list: CuratedListLite; locked: boolean }) {
  return (
    <Link
      href={`/lists/${encodeURIComponent(list.slug)}`}
      className={cn(
        "group rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 transition",
        "hover:border-yellow-500/20 hover:bg-zinc-900/35"
      )}
    >
      <ListCover title={list.title} premium={Boolean(list.isPremium)} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-white group-hover:text-yellow-200">
            {list.title}
          </div>
          {list.description ? (
            <div className="mt-1 line-clamp-2 text-sm text-zinc-400">{list.description}</div>
          ) : (
            <div className="mt-1 text-sm text-zinc-500">Open list →</div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {list.isPremium ? <Badge tone="gold">PREMIUM</Badge> : <Badge>FREE</Badge>}
          {locked ? <Badge>🔒 LOCKED</Badge> : null}
        </div>
      </div>

      <div className="mt-3 text-sm text-zinc-400 group-hover:text-zinc-300">Open list →</div>
    </Link>
  );
}
