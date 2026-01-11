import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function TopNav({ categories }: { categories: Category[] }) {
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

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo-fullport.png"
                alt="FullPort"
                className="h-5 w-auto"
              />
            </Link>
          </div>

          {/* Right – ONLY menu */}
          <div className="flex flex-1 items-center justify-end">
            <MobileMenu categories={categories} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 py-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-2 text-xs font-bold uppercase tracking-wide text-black"
          >
            Top Stories
          </Link>

          <Link
            href="/news?tab=following"
            className="inline-flex items-center rounded-full border border-zinc-700 px-5 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-zinc-900 transition"
          >
            Following
          </Link>

          {categories.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="inline-flex items-center rounded-full border border-zinc-700 px-5 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-zinc-900 transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
