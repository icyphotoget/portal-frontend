// app/components/TopNav.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";

export type Category = {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string | null;
};

function Pill({
  children,
  active,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  const cls = [
    "inline-flex items-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition",
    active
      ? "bg-cyan-400 text-black"
      : "border border-zinc-700 text-white hover:bg-zinc-900",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return <span className={cls}>{children}</span>;
}

export default function TopNav({
  categories,
  activeTab = "top",
}: {
  categories: Category[];
  activeTab?: "top" | "following";
}) {
  return (
    <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="relative flex h-16 items-center border-b border-zinc-800">
          {/* Left */}
          <div className="flex flex-1 items-center gap-3">
            <Link
              href="/news"
              className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-zinc-900 transition"
            >
              News
            </Link>
          </div>

          {/* Center (Logo) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center justify-center">
              <img
                src="/logo-fullport.png"
                alt="FullPort"
                className="h-7 sm:h-8 object-contain drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </Link>
          </div>

          {/* Right */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link
              href="/login"
              className="rounded-full bg-zinc-100 px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-white transition"
            >
              Log in
            </Link>

            {/* ✅ MobileMenu is client component */}
            <MobileMenu categories={categories} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 py-4">
          <Pill active={activeTab === "top"} href="/">
            Top Stories
          </Pill>

          <Pill active={activeTab === "following"} href="/news?tab=following">
            Following
          </Pill>

          {/* Optional: show up to 3 categories as quick chips */}
          {categories.slice(0, 3).map((c) => (
            <Pill key={c.id} href={`/category/${c.slug}`}>
              {c.name}
            </Pill>
          ))}
        </div>
      </div>
    </nav>
  );
}
