// app/lists/[slug]/premium-gate-client.tsx
"use client";

import { useEffect, useState } from "react";
import PaywallCard from "@/app/components/PaywallCard";
import { getIsLoggedIn } from "@/app/lib/auth";

export default function PremiumGateClient({
  isPremium,
  listTitle,
  children,
}: {
  isPremium: boolean;
  listTitle: string;
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(!isPremium);
  const [loading, setLoading] = useState(isPremium);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!isPremium) return;
      const ok = await getIsLoggedIn();
      if (!mounted) return;
      setAllowed(ok);
      setLoading(false);
    }

    run();
    return () => {
      mounted = false;
    };
  }, [isPremium]);

  if (!isPremium) return <>{children}</>;

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
        Checking access…
      </div>
    );
  }

  if (!allowed) {
    return (
      <PaywallCard
        title={listTitle}
        subtitle="This is a premium list. Log in to unlock (MVP), pricing flow next."
      />
    );
  }

  return <>{children}</>;
}
