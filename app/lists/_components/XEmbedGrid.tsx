// app/lists/_components/XEmbedGrid.tsx
"use client";

import Script from "next/script";

function isXUrl(u: string) {
  return /twitter\.com|x\.com/i.test(u);
}

export default function XEmbedGrid({ embeds, locked }: { embeds: string[]; locked: boolean }) {
  const urls = (embeds ?? []).filter(Boolean).filter(isXUrl);
  const visible = locked ? urls.slice(0, 1) : urls.slice(0, 6);

  if (!urls.length) {
    return (
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5 text-sm text-zinc-400">
        No media yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((url) => (
          <div key={url} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4">
            <blockquote className="twitter-tweet">
              <a href={url}>{url}</a>
            </blockquote>
          </div>
        ))}
      </div>

      {locked && urls.length > 1 ? (
        <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/5 p-4 text-sm text-zinc-300">
          Showing 1/{urls.length}. Unlock Pro to see full media section.
        </div>
      ) : null}
    </div>
  );
}
