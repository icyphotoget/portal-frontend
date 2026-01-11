"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [msg, setMsg] = useState<string>("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      setMsg(error ? error.message : "Check your email for the login link.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "Logged in.");
  }

  async function signUp(e: React.MouseEvent) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "Account created. Now log in.");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-zinc-400">Login to comment on articles.</p>

        <div className="mt-6 flex gap-2">
          <button
            className={`rounded-xl border px-3 py-2 text-sm ${
              mode === "magic" ? "border-zinc-700 bg-zinc-900" : "border-zinc-800 bg-zinc-950"
            }`}
            onClick={() => setMode("magic")}
          >
            Magic link
          </button>
          <button
            className={`rounded-xl border px-3 py-2 text-sm ${
              mode === "password" ? "border-zinc-700 bg-zinc-900" : "border-zinc-800 bg-zinc-950"
            }`}
            onClick={() => setMode("password")}
          >
            Password
          </button>
        </div>

        <form onSubmit={signIn} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode === "password" ? (
            <input
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : null}

          <button className="w-full rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950">
            Log in
          </button>

          {mode === "password" ? (
            <button
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200"
              onClick={signUp}
            >
              Create account
            </button>
          ) : null}

          {msg ? <div className="text-sm text-zinc-300">{msg}</div> : null}
        </form>
      </div>
    </main>
  );
}
