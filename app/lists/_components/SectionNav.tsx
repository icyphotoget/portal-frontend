// app/lists/_components/SectionNav.tsx
import { cn } from "./ui";

export default function SectionNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <div className="sticky top-[88px] rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-3">
      <div className="px-2 py-2 text-xs font-semibold text-zinc-400">SECTIONS</div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={cn(
              "rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            )}
          >
            {it.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
