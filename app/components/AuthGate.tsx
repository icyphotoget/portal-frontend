// app/components/AuthGate.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

type ViewState =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "authed"; email: string | null };

export default function AuthGate() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const email = data.session?.user?.email ?? null;
      setState(email ? { status: "authed", email } : { status: "anon" });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null;
      setState(email ? { status: "authed", email } : { status: "anon" });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    // state updates via listener
  }

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span className="h-8 w-24 animate-pulse rounded-xl bg-zinc-900/60" />
      </div>
    );
  }

  if (state.status === "anon") {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white transition"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden max-w-[220px] truncate rounded-xl border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-xs text-zinc-300 sm:block">
        {state.email ?? "Signed in"}
      </div>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
      >
        Log out
      </button>
    </div>
  );
}
