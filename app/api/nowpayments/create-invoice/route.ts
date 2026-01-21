import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

type Plan = "pro_monthly" | "pro_3months";

function planToPriceUsd(plan: Plan) {
  return plan === "pro_monthly" ? 19 : 49;
}

function planToLabel(plan: Plan) {
  return plan === "pro_monthly" ? "FullPort Pro Monthly" : "FullPort Pro (3 Months)";
}

export async function POST(req: Request) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!apiKey) return NextResponse.json({ error: "Missing NOWPAYMENTS_API_KEY" }, { status: 500 });
  if (!siteUrl) return NextResponse.json({ error: "Missing NEXT_PUBLIC_SITE_URL" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const plan = body?.plan as Plan;

  if (plan !== "pro_monthly" && plan !== "pro_3months") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // ✅ Get logged-in user server-side
  const supabase = await createSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ✅ IMPORTANT: order_id includes user.id so webhook can unlock
  const orderId = `pro_${plan}_${user.id}`;

  const successUrl = `${siteUrl}/checkout/success?order=${encodeURIComponent(orderId)}`;
  const cancelUrl = `${siteUrl}/pricing`;

  const res = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      price_amount: planToPriceUsd(plan),
      price_currency: "usd",
      order_id: orderId,
      order_description: planToLabel(plan),
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Ako ne želiš IPN URL u dashboardu, možeš i ovdje:
      // ipn_callback_url: `${siteUrl}/api/nowpayments/ipn`,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "NOWPayments invoice failed", details: json }, { status: 400 });
  }

  return NextResponse.json(json);
}
