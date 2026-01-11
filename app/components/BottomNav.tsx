"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

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
        "group flex flex-1 items-center justify-center rounded-2xl px-3 py-3 text-sm",
        "transition-all duration-200",
        active
          ? "bg-zinc-100 text-zinc-950 shadow-[0_10px_30px_rgba(255,255,255,0.06)]"
          : "text-zinc-200 hover:bg-zinc-900/40 hover:text-zinc-100",
        "hover:-translate-y-[1px] hover:scale-[1.01]",
        "border border-transparent",
        active ? "border-zinc-200/20" : "hover:border-zinc-800",
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
  const isProfile = pathname.startsWith("/profile");
  const isLogin = pathname.startsWith("/login");

  const [authed, setAuthed] = useState<boolean>(false);

  // show Profile -> /profile if logged in, otherwise /login
  useEffect(() => {
    const supabase = createSupabaseBrowser();

    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setAuthed(!!data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setAuthed(!!session);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const profileHref = useMemo(() => (authed ? "/profile" : "/login"), [authed]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/55 p-2 backdrop-blur-xl">
          <div className="flex gap-2">
            <Item href="/" label="Home" active={isHome} />
            <Item href="/news" label="News" active={isNews} />
            <Item
              href={profileHref}
              label="Profile"
              active={authed ? isProfile : isLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
