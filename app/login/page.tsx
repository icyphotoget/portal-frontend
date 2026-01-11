"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.153h7.594l5.243 6.93 6.064-6.93Zm-1.29 19.49h2.038L6.49 3.24H4.304l13.307 17.403Z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.35c-.23 1.35-1.55 3.96-5.35 3.96-3.22 0-5.85-2.66-5.85-5.94S8.78 6.16 12 6.16c1.83 0 3.06.78 3.76 1.45l2.56-2.46C16.97 3.9 14.78 2.86 12 2.86 6.9 2.86 2.76 7 2.76 12.1S6.9 21.34 12 21.34c5.52 0 9.17-3.88 9.17-9.34 0-.63-.07-1.1-.16-1.56Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const router = useRouter();

  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState<"google" | "twitter" | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      if (data.user) router.replace("/");
    });
    return () => {
      alive = false;
    };
  }, [supabase, router]);

  async function loginWith(provider: "google" | "twitter") {
    setMessage("");
    setBusy(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // MUST match your Supabase redirect config
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) setMessage(error.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[640px] w-[640px] rounded-full bg-emerald-400/10 blur-[160px]" />
        <div className="absolute -bottom-56 left-[-160px] h-[640px] w-[640px] rounded-full bg-indigo-500/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4">
        <div className="mx-auto w-full max-w-md">
          {/* Top row */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-sm text-zinc-300 hover:text-white transition">
              FullPort
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-200
                         transition hover:bg-zinc-900 hover:border-zinc-700"
            >
              Home
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur
                          shadow-[0_0_140px_rgba(255,255,255,0.06)]">
            <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Sign in to join the discussion and personalize your profile.
            </p>

            <div className="mt-6 grid gap-3">
              {/* Google */}
              <button
                onClick={() => loginWith("google")}
                disabled={busy !== null}
                className="group relative w-full overflow-hidden rounded-2xl bg-zinc-100 px-4 py-3
                           text-sm font-medium text-zinc-950 transition
                           hover:scale-[1.01] hover:bg-white
                           active:scale-[0.99]
                           disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <span className="absolute -left-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-black/10 blur-2xl" />
                  <span className="absolute -right-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-black/10 blur-2xl" />
                </span>

                <span className="relative inline-flex items-center justify-center gap-2">
                  <GoogleIcon />
                  {busy === "google" ? "Redirecting…" : "Continue with Google"}
                </span>
              </button>

              {/* X */}
              <button
                onClick={() => loginWith("twitter")}
                disabled={busy !== null}
                className="group relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3
                           text-sm font-medium text-zinc-100 transition
                           hover:scale-[1.01] hover:bg-zinc-900 hover:border-zinc-700
                           active:scale-[0.99]
                           disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <span className="absolute -left-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/8 blur-2xl" />
                  <span className="absolute -right-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/8 blur-2xl" />
                </span>

                <span className="relative inline-flex items-center justify-center gap-2">
                  <XIcon />
                  {busy === "twitter" ? "Redirecting…" : "Continue with X"}
                </span>
              </button>
            </div>

            {/* Feedback */}
            {message ? (
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-200">
                {message}
              </div>
            ) : null}

            <p className="mt-6 text-xs text-zinc-500">
              By continuing, you agree to follow our community guidelines.
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
