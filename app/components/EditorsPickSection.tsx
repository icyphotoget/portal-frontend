// app/components/EditorsPickSection.tsx
import Link from "next/link";
import type { Article } from "@/app/lib/strapi";
import { firstCoverUrl, formatDate, getArticleCategory } from "@/app/lib/strapi";

export default function EditorsPickSection({
  label = "EDITOR'S PICK",
  seeAllHref = "/news",
  articles,
  takeItems = 4,

  // option A: Editors Pick as a category (e.g. "editors-pick")
  categorySlug,

  // option B: manual flag in Strapi (recommended)
  // add boolean field: editorsPick
  useEditorsPickFlag = false,
}: {
  label?: string;
  seeAllHref?: string;
  articles: Article[];
  takeItems?: number;

  categorySlug?: string; // e.g. "editors-pick"
  useEditorsPickFlag?: boolean; // true => filters by (a as any).editorsPick === true
}) {
  function buildHref(a: Article) {
    return `/news/${a.slug}`;
  }

  function pickAuthor(a: any): string {
    return a?.author?.name ?? a?.author ?? a?.byline ?? "FULLPORT";
  }

  // 1) Filter candidates
  const picksRaw = (articles ?? []).filter((a) => {
    if (useEditorsPickFlag) return (a as any)?.editorsPick === true;

    if (categorySlug) {
      const cat = getArticleCategory(a);
      return cat?.slug === categorySlug;
    }

    // if neither flag nor category is provided, show nothing (by design)
    return false;
  });

  // 2) Sort by rank ASC (1,2,3...), fallback to newest publishedAt
  const picks = picksRaw
    .slice()
    .sort((a: any, b: any) => {
      const ra = typeof a?.editorsPickRank === "number" ? a.editorsPickRank : 999999;
      const rb = typeof b?.editorsPickRank === "number" ? b.editorsPickRank : 999999;

      if (ra !== rb) return ra - rb;

      const ta = a?.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b?.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return tb - ta;
    });

  if (!picks.length) return null;

  // 3) Featured + list
  const hero = picks[0];

  const featured = {
    title: hero.title,
    href: buildHref(hero),
    author: pickAuthor(hero),
    date: hero.publishedAt ? formatDate(hero.publishedAt) : "",
    imageUrl: firstCoverUrl(hero) ?? "https://picsum.photos/1200/800",
    imageAlt: hero.title,
    rank: (hero as any)?.editorsPickRank as number | undefined,
  };

  const items = picks.slice(1, 1 + takeItems).map((a: any) => ({
    id: a.id,
    title: a.title,
    href: buildHref(a),
    author: pickAuthor(a),
    date: a.publishedAt ? formatDate(a.publishedAt) : "",
    rank: typeof a?.editorsPickRank === "number" ? a.editorsPickRank : undefined,
  }));

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-fuchsia-400" />
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-200">
            {label}
          </span>
        </div>

        <Link
          href={seeAllHref}
          className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-400 hover:text-cyan-300 transition"
        >
          See all
        </Link>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Featured */}
        <Link href={featured.href} className="group block">
          <article className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.imageUrl}
                alt={featured.imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="p-5">
              <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-extrabold uppercase tracking-wider text-zinc-200">
                  Editor’s Pick
                </span>

                {typeof featured.rank === "number" ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-extrabold uppercase tracking-wider text-zinc-200">
                    #{featured.rank}
                  </span>
                ) : null}

                <span className="text-zinc-500">{featured.date}</span>
              </div>

              <h3 className="text-2xl font-extrabold leading-tight text-white group-hover:text-cyan-400 transition">
                {featured.title}
              </h3>

              <div className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                {featured.author}
              </div>
            </div>
          </article>
        </Link>

        {/* List */}
        <div className="rounded-2xl border border-zinc-800 bg-black/30">
          <div className="px-5 py-4 border-b border-zinc-800">
            <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-300">
              More picks
            </div>
          </div>

          <ul className="divide-y divide-zinc-800">
            {items.map((it) => (
              <li key={String(it.id)}>
                <Link href={it.href} className="block p-5 hover:bg-white/5 transition">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-zinc-500">{it.date}</div>
                    {typeof it.rank === "number" ? (
                      <div className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                        #{it.rank}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-1 text-base font-extrabold leading-snug text-white hover:text-cyan-400 transition">
                    {it.title}
                  </div>

                  <div className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {it.author}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
