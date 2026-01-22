// app/lists/_components/SimilarLists.tsx
import Link from "next/link";
import { Badge } from "./ui";

export default function SimilarLists({
  lists,
}: {
  lists: { title: string; slug: string; isPremium?: boolean | null }[];
}) {
  if (!lists?.length) {
    return (
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5 text-sm text-zinc-400">
        No similar lists yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {lists.slice(0, 6).map((l) => (
        <Link
          key={l.slug}
          href={`/lists/${encodeURIComponent(l.slug)}`}
          className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 hover:border-yellow-500/20 hover:bg-zinc-900/35"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-white">{l.title}</div>
            {l.isPremium ? <Badge tone="gold">PREMIUM</Badge> : <Badge>FREE</Badge>}
          </div>
          <div className="mt-3 text-sm text-zinc-400">Open →</div>
        </Link>
      ))}
    </div>
  );
}
