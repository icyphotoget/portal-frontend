"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Item({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex flex-1 items-center justify-center rounded-2xl px-3 py-3 text-sm transition",
        active ? "bg-zinc-100 text-zinc-950" : "text-zinc-200 hover:bg-zinc-900/40",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isNews = pathname.startsWith("/news");
  const isLogin = pathname.startsWith("/login");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/55 p-2 backdrop-blur-xl">
          <div className="flex gap-2">
            <Item href="/" label="Home" active={isHome} />
            <Item href="/news" label="News" active={isNews} />
            <Item href="/login" label="Profile" active={isLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
