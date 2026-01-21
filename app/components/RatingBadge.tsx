"use client";

import { useEffect, useMemo, useState } from "react";

type Summary = { avg: number | null; count: number };

export default function RatingBadge({ symbol }: { symbol: string }) {
  const normalized = useMemo(() => symbol.trim().toUpperCase(), [symbol]);
  const [summary, setSummary] = useState<Summary>({ avg: null, count: 0 });

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(`/api/ratings/summary?symbol=${encodeURIComponent(normalized)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      if (!alive) return;
      setSummary({ avg: json.avg, count: json.count });
    })();
    return () => {
      alive = false;
    };
  }, [normalized]);

  if (summary.avg == null || summary.count === 0) return null;

  return (
    <span className="rounded-full border border-yellow-500/30 bg-black/20 px-2 py-0.5 text-[11px] text-yellow-200">
      ★ {summary.avg.toFixed(1)} <span className="text-zinc-300">({summary.count})</span>
    </span>
  );
}
