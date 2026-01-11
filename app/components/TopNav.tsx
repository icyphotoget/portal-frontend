import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";

export type Category = {
  id: number;
  name: string;
  slug: string;
};

function Chip({
  children,
  href,
  active,
}: {
  children: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition shrink-0",
        active
          ? "bg-cyan-400 text-black"
          : "border border-zinc-700 text-white hover:bg-zinc-900",
      ].join(" ")}
    >
      {children}
    </Link>
  );
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
        {/* Top row */}
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

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <img
                src="/logo-fullport.png"
                alt="FullPort"
                className="h-5 w-auto select-none"
              />
            </Link>
          </div>

          {/* Right – menu only */}
          <div className="flex flex-1 items-center justify-end">
            <MobileMenu categories={categories} />
          </div>
        </div>

        {/* Tabs / chips */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto">
          <Chip href="/" active={activeTab === "top"}>
            Top Stories
          </Chip>

          <Chip href="/news?tab=following" active={activeTab === "following"}>
            Following
          </Chip>

          {categories.slice(0, 3).map((c) => (
            <Chip key={c.id} href={`/category/${c.slug}`}>
              {c.name}
            </Chip>
          ))}
        </div>
      </div>
    </nav>
  );
}
