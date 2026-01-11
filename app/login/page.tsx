// app/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
          <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4">
            <div className="mx-auto w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur">
              <div className="h-6 w-32 animate-pulse rounded-lg bg-zinc-800/60" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded-lg bg-zinc-800/40" />
              <div className="mt-8 h-12 w-full animate-pulse rounded-2xl bg-zinc-800/50" />
              <div className="mt-3 h-12 w-full animate-pulse rounded-2xl bg-zinc-800/50" />
            </div>
          </div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
