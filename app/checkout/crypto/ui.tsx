"use client";

import { useState } from "react";

type Plan = "pro_monthly" | "pro_3months";

const PLANS: { id: Plan; title: string; priceUsd: number; note: string }[] = [
  { id: "pro_monthly", title: "Pro Monthly", priceUsd: 19, note: "$19 / month" },
  { id: "pro_3months", title: "Pro (3 months)", priceUsd: 49, note: "$49 / 3 months" },
];

export default function CryptoCheckoutClient() {
  const [plan, setPlan] = useState<Plan>("pro_3months");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function start() {
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/nowpayments/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to create invoice");

      const invoiceUrl = json?.invoice_url || json?.invoiceUrl || json?.invoice?.invoice_url;
      if (!invoiceUrl) throw new Error("Missing invoice_url in response");

      window.location.href = invoiceUrl;
    } catch (e: any) {
      setErr(String(e?.message ?? e));
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-extrabold uppercase tracking-wider text-white/60">Plan</div>

        <div className="mt-4 space-y-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={[
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                plan === p.id
                  ? "border-cyan-300/40 bg-cyan-300/10"
                  : "border-white/10 bg-black/20 hover:bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-black">{p.title}</div>
                <div className="text-sm font-extrabold text-white/80">{p.note}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={start}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating invoice…" : "Continue"}
        </button>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

        <div className="mt-4 text-xs text-white/50">
          Tip: USDT / USDC is easiest for users. (They can still pay with other coins on invoice.)
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-extrabold uppercase tracking-wider text-white/60">How it works</div>
        <ol className="mt-4 space-y-2 text-sm text-white/75">
          <li>1) We generate an invoice (QR + payment details).</li>
          <li>2) You pay from your wallet.</li>
          <li>3) We receive confirmation via IPN webhook and unlock Pro.</li>
        </ol>
      </div>
    </div>
  );
}
