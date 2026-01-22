// app/lists/_components/ui.ts
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "cyan" | "danger";
}) {
  const cls =
    tone === "gold"
      ? "border-yellow-500/35 bg-yellow-500/10 text-yellow-200"
      : tone === "cyan"
      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
      : tone === "danger"
      ? "border-red-500/35 bg-red-500/10 text-red-200"
      : "border-zinc-800 bg-black/20 text-zinc-200";

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] leading-none", cls)}>
      {children}
    </span>
  );
}
