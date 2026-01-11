"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState(false);

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

  async function loginWithGoogle() {
    setMessage("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function loginWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email for the login link.");
      }
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
            <Link href="/" className="text-sm text-zinc-300 hover:text-white">
              FullPort
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900"
            >
              Home
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6 shadow-[0_0_120px_rgba(255,255,255,0.06)] backdrop-blur">
            <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Log in to comment on articles and join the discussion.
            </p>

            {/* Google */}
            <button
              onClick={loginWithGoogle}
              disabled={busy}
              className="mt-6 w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950
                         hover:bg-white disabled:opacity-60"
            >
              {busy ? "Redirecting…" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-zinc-500">or</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* Email login */}
            <form onSubmit={loginWithEmail} className="space-y-3">
              <label className="block text-xs text-zinc-400">
                Log in with email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none
                           focus:border-zinc-700"
              />
              <button
                disabled={busy}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200
                           hover:bg-zinc-900 disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send login link"}
              </button>
            </form>

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
