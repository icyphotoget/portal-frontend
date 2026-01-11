// app/components/TopNav.tsx

import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function TopNav({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="relative flex h-16 items-center border-b border-zinc-800">
          {/* Left */}
          <div className="flex flex-1 items-center">
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

          {/* Right */}
          <div className="flex flex-1 items-center justify-end">
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </nav>
  );
}
