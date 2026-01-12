// app/components/TopNav.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function TopNav({ categories }: { categories: Category[] }) {
  return (
    <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="relative flex h-16 items-center border-b border-zinc-800">
          
          {/* LEFT → GLOW LOGO */}
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              aria-label="Home"
              className="
                relative flex h-9 w-9 items-center justify-center
                rounded-full
                bg-zinc-950
                ring-1 ring-purple-400/40
                shadow-[0_0_20px_rgba(168,85,247,0.45)]
                hover:shadow-[0_0_28px_rgba(168,85,247,0.65)]
                transition
              "
            >
              <img
                src="/logo-fp.png"
                alt="FullPort"
                className="h-5 w-5 select-none"
              />
            </Link>
          </div>

          {/* CENTER → FULLPORT LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center" aria-label="FullPort">
              <img
                src="/logo-fullport.png"
                alt="FullPort"
                className="h-5 w-auto select-none"
              />
            </Link>
          </div>

          {/* RIGHT → MENU */}
          <div className="flex flex-1 items-center justify-end">
            <MobileMenu categories={categories} />
          </div>

        </div>
      </div>
    </nav>
  );
}
