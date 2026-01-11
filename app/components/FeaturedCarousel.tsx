"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type FeaturedItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  coverUrl: string | null;
  category: { name: string; slug: string } | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function estimateReadTime(text: string) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function FeaturedCarousel({
  items,
  intervalMs = 5200,
}: {
  items: FeaturedItem[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  const safeItems = useMemo(() => items.filter(Boolean), [items]);

  useEffect(() => {
    if (!safeItems.length) return;

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % safeItems.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [safeItems.length, intervalMs]);

  if (!safeItems.length) return null;

  const a = safeItems[active];
  const meta = [formatDate(a.publishedAt), estimateReadTime(a.excerpt || a.title)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="relative">
      <Link
        href={`/news/${a.slug}`}
        className={[
          "group block overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/20",
          // ✅ bitno: spriječi globalni <a> stil da oboji sve u cyan
          "no-underline !text-zinc-50",
        ].join(" ")}
      >
        <div className="relative aspect-[16/10] bg-zinc-900">
          {a.coverUrl ? (
            <img
              src={a.coverUrl}
              alt={a.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
              <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-white/6 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            </>
          )}

          {/* ✅ jači readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/35 to-transparent" />

          {/* category pill */}
          {a.category ? (
            <div className="absolute left-4 top-4">
              <span className="rounded-full border border-zinc-800 bg-zinc-950/65 px-3 py-1 text-xs text-zinc-100 backdrop-blur">
                {a.category.name}
              </span>
            </div>
          ) : null}

          {/* bottom blur panel */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="rounded-[1.6rem] border border-white/10 bg-zinc-950/55 p-4 sm:p-5 backdrop-blur-xl">
              <div className="text-[11px] !text-zinc-200/75">{meta}</div>

              {/* ✅ kontrolirana veličina + shadow za čitljivost */}
              <div
                className={[
                  "mt-1 line-clamp-3 font-semibold leading-tight tracking-[-0.01em]",
                  "text-[1.05rem] sm:text-[1.35rem] lg:text-[1.55rem]",
                  "!text-zinc-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]",
                ].join(" ")}
              >
                {a.title}
              </div>

              {a.excerpt ? (
                <p className="mt-2 line-clamp-2 text-sm !text-zinc-200/75">
                  {a.excerpt}
                </p>
              ) : null}

              <div className="mt-3 text-sm !text-zinc-100/90">
                Open{" "}
                <span className="inline-block translate-x-0 transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* dots */}
      {safeItems.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {safeItems.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                i === active ? "bg-zinc-100" : "bg-zinc-700 hover:bg-zinc-600",
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
