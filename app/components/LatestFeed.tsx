// app/components/LatestFeed.tsx

import Link from "next/link";
import type { Article } from "@/app/lib/strapi";
import { firstCoverUrl, formatDate, getArticleCategory } from "@/app/lib/strapi";

export default function LatestFeed({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-extrabold">Latest</h2>
        <Link href="/news" className="text-sm text-zinc-300 hover:text-white transition">
          View all →
        </Link>
      </div>

      <div className="space-y-8">
        {articles.map((article) => {
          const cat = getArticleCategory(article);
          const coverUrl = firstCoverUrl(article);

          return (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block border-t border-zinc-800 pt-8 first:border-0 first:pt-0 no-underline !text-zinc-50"
            >
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div>
                  {cat ? (
                    <div className="mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
                        {cat.name}
                      </span>
                    </div>
                  ) : null}

                  <h3 className="text-2xl font-extrabold leading-tight mb-3 text-zinc-50 transition group-hover:opacity-90 line-clamp-3">
                    {article.title}
                  </h3>

                  {article.excerpt ? (
                    <p className="text-zinc-400 leading-relaxed mb-3 line-clamp-3">
                      {article.excerpt}
                    </p>
                  ) : null}

                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl}
                      alt={article.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
