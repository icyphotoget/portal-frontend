// app/components/HeroCard.tsx

import Link from "next/link";
import type { Category } from "@/app/components/TopNav";
import type { Article } from "@/app/lib/strapi";
import { firstCoverUrl, formatDate, getArticleCategory } from "@/app/lib/strapi";

function CategoryBadge({ cat }: { cat: Category | null }) {
  const label = cat?.name ?? "News";
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
      {label}
    </span>
  );
}

export default function HeroCard({ hero }: { hero: Article }) {
  const heroCover = firstCoverUrl(hero);
  const heroCat = getArticleCategory(hero);

  return (
    <section className="mb-10">
      <Link href={`/news/${hero.slug}`} className="group block no-underline !text-zinc-50">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden">
            {heroCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroCover}
                alt={hero.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-900 to-black" />
            )}

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

            {/* top meta */}
            <div className="absolute left-0 right-0 top-0 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <CategoryBadge cat={heroCat} />
                <span className="text-xs text-white/75">{formatDate(hero.publishedAt)}</span>
              </div>
            </div>

            {/* bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:bg-black/45 sm:p-6 sm:backdrop-blur-xl">
                <h1
                  className={[
                    "font-extrabold leading-[1.05] tracking-[-0.02em]",
                    "text-[1.65rem] sm:text-[2.2rem] lg:text-[2.8rem]",
                    "text-zinc-50 transition group-hover:opacity-90",
                    "line-clamp-2 sm:line-clamp-3",
                  ].join(" ")}
                  style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85)" }}
                >
                  {hero.title}
                </h1>

                {hero.excerpt ? (
                  <p className="mt-2 text-sm sm:text-base text-zinc-200/85 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {hero.excerpt}
                  </p>
                ) : null}

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/90">
                  Open story
                  <span className="translate-x-0 transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        </div>
      </Link>
    </section>
  );
}
