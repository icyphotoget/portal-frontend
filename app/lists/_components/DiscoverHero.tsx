// app/lists/_components/DiscoverHero.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, cn } from "./ui";

export type HeroItem = {
  id: string;
  title: string;        // npr. "$BAGS"
  subtitle?: string;    // npr. "AI season 2 funding via royalties"
  duration?: string;    // "2:05" (fake ok)
  posterUrl?: string;   // square poster (bottom-left)
  backdropUrl?: string; // big background image
  href: string;         // gdje vodi "Open"
  chain?: string;
  narrative?: string;
  stats?: { likes?: number; saves?: number };
};

function StatPill({ label, value }: { label: string; value?: number }) {
  if (value == null) return null;
  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-800/60 bg-black/30 px-2 py-1 text-xs text-zinc-200">
      <span className="text-zinc-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function DiscoverHero({
  items,
  title = "Up next",
}: {
  items: HeroItem[];
  title?: string;
}) {
  const list = useMemo(() => items.filter(Boolean), [items]);
  const [activeId, setActiveId] = useState(list[0]?.id);

  const active = list.find((x) => x.id === activeId) ?? list[0];
  const upNext = list.filter((x) => x.id !== active?.id).slice(0, 5);

  if (!active) return null;

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr,360px]">
      {/* LEFT: hero "player" */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/20">
        {/* backdrop */}
        <div className="absolute inset-0">
          {active.backdropUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={active.backdropUrl}
              alt={active.title}
              className="h-full w-full object-cover opacity-80"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.12),rgba(0,0,0,0)_55%)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.90),rgba(0,0,0,0.10))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),rgba(0,0,0,0.05))]" />
        </div>

        {/* content */}
        <div className="relative flex min-h-[420px] flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {active.chain ? <Badge tone="cyan">{active.chain}</Badge> : null}
            {active.narrative ? <Badge>{active.narrative}</Badge> : null}
            {active.duration ? <Badge>{active.duration}</Badge> : null}
          </div>

          <div className="mt-4 flex items-end gap-5">
            {/* poster */}
            <div className="hidden sm:block">
              <div className="relative h-[160px] w-[110px] overflow-hidden rounded-2xl border border-zinc-800/60 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
                {active.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={active.posterUrl} alt={active.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-300">
                    {active.title}
                  </div>
                )}
              </div>
            </div>

            {/* play + meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="grid h-14 w-14 place-items-center rounded-full border border-yellow-500/35 bg-yellow-500/10 text-yellow-100 hover:bg-yellow-500/15"
                  onClick={() => {
                    // placeholder: kasnije tu otvori modal video / chart / token detail
                    window.open(active.href, "_self");
                  }}
                  aria-label="Open"
                >
                  ▶
                </button>

                <div className="min-w-0">
                  <div className="truncate text-3xl font-bold tracking-tight">{active.title}</div>
                  {active.subtitle ? (
                    <div className="mt-1 line-clamp-2 text-sm text-zinc-300">{active.subtitle}</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatPill label="👍" value={active.stats?.likes} />
                <StatPill label="⭐" value={active.stats?.saves} />
                <Link
                  href={active.href}
                  className="ml-1 inline-flex rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Open →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: up next */}
      <aside className="rounded-3xl border border-zinc-800/60 bg-zinc-900/20 p-4">
        <div className="mb-3 text-sm font-semibold text-yellow-200">{title}</div>

        <div className="space-y-3">
          {upNext.map((it) => {
            const activeRow = it.id === active.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setActiveId(it.id)}
                className={cn(
                  "w-full rounded-2xl border border-zinc-800/60 bg-black/20 p-3 text-left transition",
                  "hover:border-yellow-500/20 hover:bg-white/5",
                  activeRow && "border-yellow-500/25"
                )}
              >
                <div className="flex gap-3">
                  <div className="relative h-[64px] w-[44px] shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-black/20">
                    {it.posterUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.posterUrl} alt={it.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{it.title}</div>
                    {it.subtitle ? (
                      <div className="mt-1 line-clamp-2 text-xs text-zinc-400">{it.subtitle}</div>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {it.duration ? <Badge>{it.duration}</Badge> : null}
                      {it.chain ? <Badge tone="cyan">{it.chain}</Badge> : null}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <Link href="/lists" className="text-sm text-zinc-400 hover:text-zinc-200">
            Browse all →
          </Link>
        </div>
      </aside>
    </section>
  );
}
