// app/components/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/news", label: "News", icon: "≋" },
  { href: "/sitemap.xml", label: "Map", icon: "⌁" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
      <div
        className="mx-4 w-full max-w-md rounded-[1.8rem] border border-zinc-800 bg-zinc-950/70
                   px-2 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur"
      >
        <div className="grid grid-cols-3 gap-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={[
                "flex items-center justify-center gap-2 rounded-[1.2rem] px-3 py-2 text-sm transition",
                isActive(n.href)
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-200 hover:bg-zinc-900/60",
              ].join(" ")}
            >
              <span className="text-base">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
