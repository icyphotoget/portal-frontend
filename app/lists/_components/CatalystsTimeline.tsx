// app/lists/_components/CatalystsTimeline.tsx
import { Badge } from "./ui";

type CatalystItem = {
  title: string;
  date?: string | null;
  tokenSymbol?: string | null;
  note?: string | null;
};

function niceDate(iso?: string | null) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return null;
  }
}

export default function CatalystsTimeline({
  catalysts,
  locked,
}: {
  catalysts: CatalystItem[];
  locked: boolean;
}) {
  if (!catalysts?.length) {
    return (
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5 text-sm text-zinc-400">
        No catalysts added yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-2">
      <ul className="divide-y divide-zinc-800/60">
        {catalysts.slice(0, locked ? 3 : 20).map((c, idx) => (
          <li key={`${c.title}-${idx}`} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-semibold text-white">{c.title}</div>
              {c.tokenSymbol ? <Badge tone="cyan">${c.tokenSymbol}</Badge> : null}
              {niceDate(c.date) ? <Badge>{niceDate(c.date)}</Badge> : null}
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              {locked ? <span className="text-zinc-500">Unlock Pro to see notes.</span> : (c.note ?? "—")}
            </div>
          </li>
        ))}
      </ul>

      {locked && catalysts.length > 3 ? (
        <div className="p-4 text-sm text-zinc-400">
          Showing 3/{catalysts.length}. Unlock Pro to see full timeline.
        </div>
      ) : null}
    </div>
  );
}
