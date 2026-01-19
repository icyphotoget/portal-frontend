// app/components/BaseSection.tsx
import Link from "next/link";
import type { Article } from "@/app/lib/strapi";
import { firstCoverUrl, formatDate, getArticleCategory } from "@/app/lib/strapi";

export default function BaseSection({
  label = "BASE",
  kicker = "BASE",
  seeAllHref = "/news?category=base",
  bg = "#CFE8FF", // soft blue card
  categorySlug = "base",
  articles,
  takeItems = 4,
}: {
  label?: string;
  kicker?: string;
  seeAllHref?: string;
  bg?: string;

  categorySlug?: string;
  articles: Article[];
  takeItems?: number;
}) {
  function buildHref(a: Article) {
    return `/news/${a.slug}`;
  }

  function pickAuthor(a: any): string | undefined {
    return a?.author?.name ?? a?.author ?? a?.byline ?? undefined;
  }

  const sectionArticles = (articles ?? []).filter((a) => {
    const cat = getArticleCategory(a);
    return cat?.slug === categorySlug;
  });

  if (!sectionArticles.length) return null;

  const hero = sectionArticles[0];

  const featured = {
    title: hero.title,
    href: buildHref(hero),
    author: pickAuthor(hero),
    date: hero.publishedAt ? formatDate(hero.publishedAt) : undefined,
    imageUrl: firstCoverUrl(hero),
    imageAlt: hero.title,
  };

  const items = sectionArticles.slice(1, 1 + takeItems).map((a) => ({
    id: a.id,
    title: a.title,
    href: buildHref(a),
    author: pickAuthor(a),
    date: a.publishedAt ? formatDate(a.publishedAt) : undefined,
  }));

  return (
    <div className="relative">
      <div className="relative mx-auto max-w-[1100px] pr-14 sm:pr-16 lg:pr-20">
        {/* Vertical label (outside the card) - RIGHT SIDE */}
        <div className="pointer-events-none absolute right-0 top-0 h-full">
          <div className="sticky top-28">
            <div className="relative">
              <div className="absolute -inset-y-7 -inset-x-4 rounded-2xl bg-black/35 blur-xl" />
              <div
                className={[
                  "relative select-none",
                  "font-black tracking-tight",
                  "text-[64px] sm:text-[84px] lg:text-[110px]",
                  "leading-none",
                  "[writing-mode:vertical-rl]",
                  "drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]",
                ].join(" ")}
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {label}
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <section className="relative overflow-hidden rounded-[22px] text-black" style={{ background: bg }}>
          {/* Retro paper/grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)," +
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10" />

          {/* top row */}
          <div className="relative flex items-center justify-between px-5 sm:px-6 lg:px-8 pt-5">
            <div className="flex items-center gap-3">
              <span className="h-5 w-[3px] rounded-full bg-black/80" />
              <span className="text-xs font-extrabold uppercase tracking-[0.22em]">{kicker}</span>
            </div>

            <Link
              href={seeAllHref}
              className="text-xs font-extrabold uppercase tracking-[0.22em] underline underline-offset-4 hover:opacity-80"
            >
              See all
            </Link>
          </div>

          <div className="relative px-5 sm:px-6 lg:px-8 pb-6 pt-4">
            <Link href={featured.href} className="block">
              <h2 className="max-w-[920px] text-[30px] sm:text-[40px] lg:text-[50px] font-black leading-[1.08] tracking-tight hover:opacity-90">
                {featured.title}
              </h2>
            </Link>

            {(featured.author || featured.date) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] opacity-80">
                {featured.author ? <span>{featured.author}</span> : null}
                {featured.author && featured.date ? <span>•</span> : null}
                {featured.date ? <span>{featured.date}</span> : null}
              </div>
            )}

            {featured.imageUrl ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.imageUrl}
                  alt={featured.imageAlt ?? featured.title}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}

            {items?.length ? (
              <div className="mt-5 divide-y divide-black/15">
                {items.map((it) => (
                  <Link key={String(it.id)} href={it.href} className="group block py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-black/80" />
                      <div className="min-w-0">
                        <div className="text-[18px] sm:text-[20px] font-black leading-snug tracking-tight group-hover:opacity-90">
                          {it.title}
                        </div>

                        {(it.author || it.date) && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] opacity-75">
                            {it.author ? <span>{it.author}</span> : null}
                            {it.author && it.date ? <span>•</span> : null}
                            {it.date ? <span>{it.date}</span> : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
