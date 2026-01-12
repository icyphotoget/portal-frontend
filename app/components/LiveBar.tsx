// app/components/LiveBar.tsx
"use client";

import Link from "next/link";

export type LiveBarItem = {
  text: string;
  href?: string; // npr. /news/slug ili vanjski link
  label?: string; // npr. "LIVE", "BREAKING"
};

export default function LiveBar({
  item,
  title = "FULLPORT LIVE",
}: {
  item: LiveBarItem | null;
  title?: string;
}) {
  if (!item?.text) return null;

  const label = item.label ?? "LIVE";
  const content = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 px-4 py-3 backdrop-blur">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white/90">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          {label}
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            {title}
          </div>
          <div className="truncate text-sm font-semibold text-white/90 group-hover:text-white">
            {item.text}
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-bold text-zinc-300">
          See
        </div>
      </div>
    </div>
  );

  if (item.href) {
    const isExternal = item.href.startsWith("http");
    if (isExternal) {
      return (
        <a href={item.href} target="_blank" rel="noreferrer" className="block">
          {content}
        </a>
      );
    }
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
