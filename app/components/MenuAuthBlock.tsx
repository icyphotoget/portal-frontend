// app/components/MenuAuthBlock.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

function initialsFrom(display: string) {
  const s = (display ?? "").trim();
  if (!s) return "U";
  const base = s.includes("@") ? s.split("@")[0] : s;
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function MenuAuthBlock({ onClose }: { onClose?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function sync() {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;

      if (!mounted) return;

      if (!u) {
        setEmail(null);
        setName(null);
        setLoading(false);
        return;
      }

      const meta: any = u.user_metadata ?? {};
      const displayName =
        meta?.full_name || meta?.name || meta?.username || (u.email ? u.email.split("@")[0] : "User");

      setEmail(u.email ?? null);
      setName(displayName);
      setLoading(false);
    }

    sync();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      sync();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const display = name ?? email ?? "User";
  const initials = useMemo(() => initialsFrom(display), [display]);

  if (loading) return null;

  // Logged out
  if (!email) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-zinc-200">Login / Sign Up</div>
        <Link
          href="/login"
          onClick={() => onClose?.()}
          className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-white transition"
        >
          Log in
        </Link>
      </div>
    );
  }

  // Logged in
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href="/profile"
        onClick={() => onClose?.()}
        className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-extrabold text-black">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold text-white">{display}</div>
          <div className="truncate text-xs text-zinc-400">{email}</div>
        </div>
      </Link>

      <Link
        href="/auth/signout"
        className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-white/10 transition"
      >
        Log out
      </Link>
    </div>
  );
}
