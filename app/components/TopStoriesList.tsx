// app/components/TopStoriesList.tsx

import Link from "next/link";
import type { Article } from "@/app/lib/strapi";
import { firstCoverUrl, formatDate, getArticleCategory } from "@/app/lib/strapi";

export default function TopStoriesList({ articles }: { articles: Article[] }) {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-extrabold text-zinc-100">Top Stories</h2>
        <Link href="/news" className="text-sm text-zinc-300 hover:text-white transition">
          View all →
        </Link>
      </div>

      <div className="space-y-6">
        {articles.map((article, idx) => {
          const cat = getArticleCategory(article);
          const coverUrl = firstCoverUrl(article);

          return (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex gap-4 border-b border-zinc-800 pb-6 last:border-0 no-underline !text-zinc-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg font-extrabold text-cyan-300">
                {idx + 1}
              </div>

              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-extrabold leading-tight mb-2 text-zinc-50 transition group-hover:opacity-90 line-clamp-3">
                  {article.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wide text-zinc-200/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                    {cat?.name ?? "News"}
                  </span>
                  <span className="text-zinc-500">{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
