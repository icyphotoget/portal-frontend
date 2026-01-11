// app/components/MostPopularCard.tsx

import Link from "next/link";
import type { Article } from "@/app/lib/strapi";
import { formatDate, getArticleCategory } from "@/app/lib/strapi";

export default function MostPopularCard({ articles }: { articles: Article[] }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-purple-600/95 to-fuchsia-700/95 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-white">Most Popular</h2>
        <Link href="/news" className="text-sm text-white/80 hover:text-white transition">
          More →
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {articles.map((article, idx) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group flex items-start gap-4 border-b border-white/15 pb-4 last:border-0 no-underline !text-white"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-extrabold text-white">
              {idx + 1}
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-extrabold text-white transition group-hover:opacity-90 leading-snug">
                {article.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
                <span className="font-bold uppercase tracking-wide">
                  {getArticleCategory(article)?.name ?? "News"}
                </span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
