// app/components/LiveBar.tsx
import Link from "next/link";

export type LiveBarItem = {
  label?: string;
  text: string;
  href?: string;
};

export default function LiveBar({
  item,
  title = "FULLPORT LIVE",
}: {
  item: LiveBarItem | null;
  title?: string;
}) {
  const Wrapper = item?.href ? Link : ("div" as any);
  const wrapperProps = item?.href
    ? { href: item.href, className: "block" }
    : { className: "block" };

  return (
    <Wrapper {...wrapperProps}>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-4 w-full">
          <div className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-white/90">
              {item?.label ?? "LIVE"}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-white/40">
              {title}
            </div>

            <div className="relative overflow-hidden">
              <div className="livebar-marquee">
                <span className="livebar-marquee__inner text-base font-extrabold text-white/90">
                  {item?.text ?? "No live updates yet."}
                </span>
                <span
                  className="livebar-marquee__inner text-base font-extrabold text-white/90"
                  aria-hidden="true"
                >
                  {item?.text ?? "No live updates yet."}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/80 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/80 to-transparent" />
            </div>
          </div>

          <div className="shrink-0">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold text-white/80">
              See
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
