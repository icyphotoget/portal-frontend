// app/components/TopNav.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type TopNavVariant = "default" | "category" | "article";

export default function TopNav({
  categories,
  variant = "default",
  backHref,
  backLabel,
}: {
  categories: Category[];
  variant?: TopNavVariant;

  /**
   * Optional back link (useful for article/category pages).
   * If not provided, back link won't show.
   */
  backHref?: string;
  backLabel?: string;
}) {
  const showBack = !!backHref && variant !== "default";

  return (
    <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="relative flex h-16 items-center border-b border-zinc-800">
          {/* LEFT */}
          <div className="flex flex-1 items-center gap-3">
            {/* Back link (only on article/category variants) */}
            {showBack ? (
              <Link
                href={backHref!}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                ← {backLabel ?? "Back"}
              </Link>
            ) : null}

            {/* Glow FP logo (always) */}
            <Link
              href="/"
              aria-label="Home"
              className={[
                "relative flex h-9 w-9 items-center justify-center rounded-full",
                "bg-zinc-950 ring-1 ring-purple-400/40",
                "shadow-[0_0_20px_rgba(168,85,247,0.45)]",
                "hover:shadow-[0_0_28px_rgba(168,85,247,0.65)]",
                "transition",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-fp.png"
                alt="FullPort"
                className="h-5 w-5 select-none"
                draggable={false}
              />
            </Link>
          </div>

          {/* CENTER */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center" aria-label="FullPort">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-fullport.png"
                alt="FullPort"
                className="h-5 w-auto select-none"
                draggable={false}
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {/* We keep it clean: no "Log in" button here.
               Auth/Profile stays inside MobileMenu. */}
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </nav>
  );
}
