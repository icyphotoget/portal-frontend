"use client";

import { useEffect, useMemo, useState } from "react";
import LiveBar, { type LiveBarItem } from "@/app/components/LiveBar";

export default function LiveBarRotator({
  items,
  title = "FULLPORT LIVE",
  intervalMs = 6000,
}: {
  items: LiveBarItem[];
  title?: string;
  intervalMs?: number;
}) {
  const safe = useMemo(() => items.filter(Boolean), [items]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (safe.length <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % safe.length), intervalMs);
    return () => clearInterval(t);
  }, [safe.length, intervalMs]);

  return <LiveBar item={safe[i] ?? null} title={title} />;
}
