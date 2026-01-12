"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

function getDisplayName(user: any) {
  const meta: any = user?.user_metadata ?? {};
  return (
    meta?.full_name ||
    meta?.name ||
    meta?.username ||
    (user?.email ? String(user.email).split("@")[0] : "User")
  );
}

function initialsFrom(text: string) {
  const s = (text ?? "").trim();
  if (!s) return "U";
  const base = s.includes("@") ? s.split("@")[0] : s;
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function MenuAuthBlock({ onClose }: { onClose?: () => void }) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function sync() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    sync();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    if (busy) return;
    setBusy(true);

    // 1) client logout -> instant UI update
    await supabase.auth.signOut();

    // 2) server logout -> clear SSR cookies (best practice)
    try {
      await fetch("/auth/signout", { method: "POST" });
    } catch {}

    onClose?.();
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  // LOGGED OUT
  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Link href="/login" onClick={onClose} className="text-white/90 hover:text-white">
          Login
        </Link>
        <span className="text-white/30">/</span>
        <Link href="/signup" onClick={onClose} className="text-white/90 hover:text-white">
          Sign Up
        </Link>
      </div>
    );
  }

  // LOGGED IN
  const display = getDisplayName(user);
  const initials = initialsFrom(display);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link
        href="/profile"
        onClick={onClose}
        className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-extrabold text-black">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold text-white">{display}</div>
          {user.email ? (
            <div className="truncate text-xs text-white/50">{String(user.email)}</div>
          ) : null}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={busy}
        className="shrink-0 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white/90 hover:bg-zinc-800 disabled:opacity-60 transition"
      >
        {busy ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}
