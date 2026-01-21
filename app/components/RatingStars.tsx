"use client";

import { useEffect, useMemo, useState } from "react";

type Summary = { avg: number | null; count: number };

export default function RatingStars({ symbol }: { symbol: string }) {
  const [summary, setSummary] = useState<Summary>({ avg: null, count: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const normalized = useMemo(() => symbol.trim().toUpperCase(), [symbol]);

  async function loadSummary() {
    const res = await fetch(`/api/ratings/summary?symbol=${encodeURIComponent(normalized)}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const json = await res.json();
    setSummary({ avg: json.avg, count: json.count });
  }

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized]);

  async function submit(value: number) {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: normalized, value }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(json?.error || "Could not submit rating");
        return;
      }

      setMsg("Thanks! ✅");
      await loadSummary();
    } finally {
      setLoading(false);
      setHover(null);
    }
  }

  const displayAvg = summary.avg == null ? "—" : summary.avg.toFixed(2);

  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-zinc-400">Community rating</div>
          <div className="mt-1 text-lg font-semibold">
            {displayAvg} <span className="text-zinc-400 text-sm">({summary.count} votes)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((v) => {
              const active = (hover ?? 0) >= v || (hover == null && (summary.avg ?? 0) >= v);
              return (
                <button
                  key={v}
                  type="button"
                  disabled={loading}
                  onMouseEnter={() => setHover(v)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => submit(v)}
                  className={[
                    "h-10 w-10 rounded-xl border text-lg transition",
                    "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700",
                    active ? "text-yellow-300" : "text-zinc-500",
                    loading ? "opacity-60 cursor-not-allowed" : "",
                  ].join(" ")}
                  aria-label={`Rate ${v} out of 5`}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {msg ? <div className="mt-3 text-sm text-zinc-400">{msg}</div> : null}
      <div className="mt-2 text-xs text-zinc-500">
        Limit: 1 rating per token per IP every 6h.
      </div>
    </div>
  );
}
