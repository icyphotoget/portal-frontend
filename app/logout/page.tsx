"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      await fetch("/auth/signout", { method: "POST" });
      window.location.href = "/";
    })();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white grid place-items-center">
      <div className="text-zinc-400">Logging out…</div>
    </main>
  );
}
