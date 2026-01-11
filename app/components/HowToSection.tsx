// app/components/HowToSection.tsx
import Link from "next/link";

export type HowToFeatured = {
  title: string;
  href: string;
  author?: string;
  date?: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type HowToItem = {
  id: number | string;
  title: string;
  href: string;
  author?: string;
  date?: string;
  comments?: number;
};

export default function HowToSection({
  label = "HOW TO?",
  seeAllHref = "/news",
  featured,
  items,
}: {
  label?: string;
  seeAllHref?: string;
  featured: HowToFeatured;
  items: HowToItem[];
}) {
  return (
    <div className="relative">
      {/* Wrapper that creates the left gutter space for vertical text */}
      <div className="relative mx-auto max-w-[1100px] pl-14 sm:pl-16 lg:pl-20">
        {/* Vertical label (outside the pink card) */}
        <div className="pointer-events-none absolute left-0 top-0 h-full">
          <div className="sticky top-28">
            <div
              className={[
                "select-none",
                "text-white/90",
                "font-black tracking-tight",
                "text-[64px] sm:text-[84px] lg:text-[110px]",
                "leading-none",
                "[writing-mode:vertical-rl]",
                "rotate-180",
              ].join(" ")}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Pink card (smaller + cleaner) */}
        <section className="relative overflow-hidden rounded-[22px] bg-[#f1b6d1] text-black">
          {/* top row */}
          <div className="flex items-center justify-between px-5 sm:px-6 lg:px-8 pt-5">
            <div className="flex items-center gap-3">
              <span className="h-5 w-[3px] rounded-full bg-[#5b2bff]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.22em]">
                {label}
              </span>
            </div>

            <Link
              href={seeAllHref}
              className="text-xs font-extrabold uppercase tracking-[0.22em] underline underline-offset-4 hover:opacity-80"
            >
              See all
            </Link>
          </div>

          {/* content */}
          <div className="px-5 sm:px-6 lg:px-8 pb-6 pt-4">
            {/* Featured title */}
            <Link href={featured.href} className="block">
              <h2 className="max-w-[920px] text-[30px] sm:text-[40px] lg:text-[50px] font-black leading-[1.08] tracking-tight hover:opacity-90">
                {featured.title}
              </h2>
            </Link>

            {/* meta */}
            {(featured.author || featured.date) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] opacity-80">
                {featured.author ? <span>{featured.author}</span> : null}
                {featured.author && featured.date ? <span>•</span> : null}
                {featured.date ? <span>{featured.date}</span> : null}
              </div>
            )}

            {/* image */}
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

            {/* list */}
            {items?.length ? (
              <div className="mt-5 divide-y divide-black/15">
                {items.map((it) => (
                  <Link
                    key={String(it.id)}
                    href={it.href}
                    className="group block py-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#5b2bff]" />
                      <div className="min-w-0">
                        <div className="text-[18px] sm:text-[20px] font-black leading-snug tracking-tight group-hover:opacity-90">
                          {it.title}
                        </div>

                        {(it.author || it.date || typeof it.comments === "number") && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] opacity-75">
                            {it.author ? <span>{it.author}</span> : null}
                            {it.author && it.date ? <span>•</span> : null}
                            {it.date ? <span>{it.date}</span> : null}
                            {typeof it.comments === "number" ? (
                              <>
                                <span>•</span>
                                <span>{it.comments}</span>
                              </>
                            ) : null}
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
