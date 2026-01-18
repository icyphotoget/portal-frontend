import Link from "next/link";
import type { Category } from "@/app/components/TopNav";
import type { Article } from "@/app/lib/strapi";
import { firstCoverUrl, formatDate, getArticleCategory } from "@/app/lib/strapi";

function CategoryPill({ cat }: { cat: Category | null }) {
  const label = cat?.name ?? "News";
  return (
    <span className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white ring-1 ring-white/10 backdrop-blur">
      {label}
    </span>
  );
}

function PlayButton() {
  return (
    <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-black shadow-lg ring-1 ring-black/10">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 translate-x-[1px]"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7-11-7z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Verge-like underline highlight
 */
function HighlightTitle({ title }: { title: string }) {
  return (
    <span className="relative inline">
      <span
        className={[
          "absolute left-0 right-0",
          "bottom-[0.08em] sm:bottom-[0.10em]",
          "h-[0.28em] sm:h-[0.30em]",
          "bg-violet-600/90",
          "-z-10",
        ].join(" ")}
      />
      {title}
    </span>
  );
}

export default function HeroCard({ hero }: { hero: Article }) {
  const cover = firstCoverUrl(hero);
  const cat = getArticleCategory(hero);

  const author = "FULLPORT";
  const date = formatDate(hero.publishedAt);

  return (
    <section className="mb-10">
      <Link href={`/news/${hero.slug}`} className="group block no-underline">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          {/* Media */}
          <div className="relative min-h-[360px] sm:min-h-[520px] lg:min-h-[620px]">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={hero.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
            )}

            {/* Bottom fade */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5" />

            {/* Top-left meta */}
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6 flex items-center gap-3">
              <CategoryPill cat={cat} />
              {date ? (
                <span className="text-xs font-bold uppercase tracking-wide text-white/70">
                  {date}
                </span>
              ) : null}
            </div>

            {/* Play button */}
            <PlayButton />

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-6 sm:pb-7 lg:px-8 lg:pb-8">
              <div className="max-w-[980px]">
                <h1
                  className={[
                    "text-white font-black tracking-tight",
                    "text-[2.1rem] leading-[1.03]",
                    "sm:text-[3.0rem] sm:leading-[1.02]",
                    "lg:text-[3.6rem]",
                    "drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]",
                    "group-hover:opacity-95 transition",
                  ].join(" ")}
                >
                  <HighlightTitle title={hero.title} />
                </h1>

                {hero.excerpt ? (
                  <p className="mt-3 max-w-[760px] text-sm sm:text-base text-white/85 leading-relaxed">
                    {hero.excerpt}
                  </p>
                ) : null}

                {/* Meta row — CLEAN (NO COMMENTS) */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
                  <span className="text-cyan-300">{author}</span>
                  {date ? <span>{date}</span> : null}
                </div>
              </div>
            </div>

            {/* Tiny bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        </div>
      </Link>
    </section>
  );
}
