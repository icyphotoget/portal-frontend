import Link from "next/link";

export type HowToItem = {
  id: string | number;
  title: string;
  href: string;
  author?: string;
  date?: string; // npr "JAN 6"
  comments?: number;
};

export type HowToFeatured = {
  kicker?: string; // opcionalno, npr "HOW TO?"
  title: string;
  href: string;
  author?: string;
  date?: string; // npr "JAN 8"
  imageUrl: string;
  imageAlt?: string;
};

export default function HowToSection({
  label = "HOW TO?",
  seeAllHref = "/how-to",
  featured,
  items,
}: {
  label?: string;
  seeAllHref?: string;
  featured: HowToFeatured;
  items: HowToItem[];
}) {
  return (
    <section className="relative mx-auto max-w-[1440px] px-4 lg:px-8">
      <div className="relative">
        {/* Vertical label (left) */}
        <div className="pointer-events-none absolute -left-2 top-0 hidden sm:block">
          <div className="select-none text-[72px] font-black leading-none tracking-tight text-white/90">
            <span
              className="block origin-top-left -rotate-90"
              style={{ textShadow: "0 10px 40px rgba(0,0,0,0.55)" }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          className={[
            "relative overflow-hidden rounded-[28px]",
            "border border-white/10",
            "bg-[#E7A7C9]", // verge-ish pink
            "shadow-[0_30px_120px_rgba(0,0,0,0.55)]",
            "sm:ml-[84px]", // space for vertical text
          ].join(" ")}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-6 pt-6">
            <div className="flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-[#6D2DFF]" />
              <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/85">
                {label}
              </div>
            </div>

            <Link
              href={seeAllHref}
              className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/80 underline underline-offset-4 hover:text-black transition"
            >
              SEE ALL
            </Link>
          </div>

          {/* Featured */}
          <div className="px-6 pt-5">
            <Link href={featured.href} className="block group">
              <h3
                className={[
                  "max-w-[26ch]",
                  "text-[40px] sm:text-[46px] lg:text-[52px]",
                  "font-black leading-[0.95] tracking-tight",
                  "text-black",
                  "group-hover:opacity-90 transition",
                ].join(" ")}
              >
                {featured.title}
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/70">
                {featured.author ? <span>{featured.author}</span> : null}
                {featured.date ? <span>{featured.date}</span> : null}
              </div>
            </Link>
          </div>

          {/* Image */}
          <div className="px-6 pt-6">
            <Link href={featured.href} className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-black/10">
                <div className="relative aspect-[16/10] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.imageUrl}
                    alt={featured.imageAlt ?? featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </Link>
          </div>

          {/* List */}
          <div className="px-6 pb-6 pt-6">
            <div className="space-y-5">
              {items.slice(0, 4).map((it) => (
                <div key={it.id} className="border-t border-black/15 pt-5 first:border-t-0 first:pt-0">
                  <Link href={it.href} className="group block">
                    <div className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6D2DFF]" />
                      <div className="min-w-0">
                        <div className="text-[22px] font-black leading-[1.05] text-black group-hover:opacity-90 transition">
                          {it.title}
                        </div>

                        {(it.author || it.date || typeof it.comments === "number") && (
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/65">
                            {it.author ? <span>{it.author}</span> : null}
                            {it.date ? <span>{it.date}</span> : null}
                            {typeof it.comments === "number" ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="opacity-70">|</span>
                                <span className="inline-flex items-center gap-2">
                                  <span className="inline-block h-4 w-4 rounded bg-black/10" />
                                  {it.comments}
                                </span>
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Bottom accent line */}
            <div className="mt-6 h-[2px] w-full bg-[#6D2DFF]/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
