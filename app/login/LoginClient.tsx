"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function LoginClient() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const router = useRouter();
  const sp = useSearchParams();

  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState(false);

  // optional redirect after login: /login?next=/news/some-article
  const nextUrl = sp.get("next") || "/";

  // Redirect if already logged in
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!alive) return;
      if (error) return;
      if (data.user) router.replace(nextUrl);
    });
    return () => {
      alive = false;
    };
  }, [supabase, router, nextUrl]);

  async function loginWith(provider: "google" | "twitter") {
    setMessage("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setMessage(error.message);
    } finally {
      setBusy(false);
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
            <Link href="/" className="text-sm text-zinc-300 hover:text-white transition">
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
              Sign in to save your profile and join discussions.
            </p>

            <div className="mt-6 space-y-3">
              {/* Google */}
              <button
                onClick={() => loginWith("google")}
                disabled={busy}
                className="group w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950
                           transition hover:bg-white hover:scale-[1.01] active:scale-[0.99]
                           disabled:opacity-60 disabled:hover:scale-100"
              >
                {busy ? "Redirecting…" : "Continue with Google"}
              </button>

           
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-200">
                {message}
              </div>
            ) : null}

            <p className="mt-6 text-xs text-zinc-500">
              By signing in you agree to follow our community guidelines.
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} FullPort
          </div>
        </div>
      </div>
    </main>
  );
}
