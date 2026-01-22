// app/lists/_components/ListRow.tsx
import ListPosterCard from "./ListPosterCard";

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

export default function ListRow({
  lists,
  isLockedFn,
}: {
  lists: CuratedListLite[];
  isLockedFn: (l: CuratedListLite) => boolean;
}) {
  if (!lists?.length) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {lists.map((l) => (
        <div key={String(l.id)} className="w-[320px] shrink-0">
          <ListPosterCard list={l} locked={isLockedFn(l)} />
        </div>
      ))}
    </div>
  );
}
