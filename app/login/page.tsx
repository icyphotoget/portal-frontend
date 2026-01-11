"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState<null | "google" | "twitter">(null);

  const btnBase =
    "w-full rounded-2xl px-4 py-3 text-sm font-medium transition will-change-transform " +
    "cursor-pointer select-none " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";

  // Redirect if already logged in
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      if (data.user) router.replace(next);
    });
    return () => {
      alive = false;
    };
  }, [supabase, router, next]);

  async function signIn(provider: "google" | "twitter") {
    setMessage("");
    setBusy(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // IMPORTANT: keep next so you can go back to /profile etc.
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) setMessage(error.message);
    } finally {
      // usually page redirects, but if popup blocked / error, we reset state
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-sm text-zinc-300 hover:text-white">
              FullPort
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900 transition"
            >
              Home
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6 shadow-[0_0_120px_rgba(255,255,255,0.06)] backdrop-blur">
            <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Log in to comment on articles and customize your profile.
            </p>

            {/* Google */}
            <button
              onClick={() => signIn("google")}
              disabled={!!busy}
              className={
                btnBase +
                " mt-6 bg-zinc-100 text-zinc-950 " +
                "hover:bg-white hover:-translate-y-[1px] hover:shadow-[0_14px_50px_rgba(255,255,255,0.12)] " +
                "active:translate-y-0 active:scale-[0.99]"
              }
            >
              {busy === "google" ? "Opening Google…" : "Continue with Google"}
            </button>

            {/* X (Twitter) */}
            <button
              onClick={() => signIn("twitter")}
              disabled={!!busy}
              className={
                btnBase +
                " mt-3 border border-zinc-800 bg-zinc-950 text-zinc-100 " +
                "hover:bg-zinc-900 hover:border-zinc-700 hover:-translate-y-[1px] hover:shadow-[0_14px_50px_rgba(0,0,0,0.45)] " +
                "active:translate-y-0 active:scale-[0.99]"
              }
            >
              {busy === "twitter" ? "Opening X…" : "Continue with X"}
            </button>

            {/* Feedback */}
            {message ? (
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-200">
                {message}
              </div>
            ) : null}

            <p className="mt-6 text-xs text-zinc-500">
              By logging in, you agree to follow our community guidelines.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} FullPort
          </div>
        </div>
      </div>
    </main>
  );
}
