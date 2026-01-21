import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getViewer } from "@/app/lib/auth";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

type Body = { plan: "pro_monthly" | "pro_3m" };

function getPriceId(plan: Body["plan"]) {
  if (plan === "pro_monthly") return process.env.STRIPE_PRICE_PRO_MONTHLY!;
  if (plan === "pro_3m") return process.env.STRIPE_PRICE_PRO_3M!;
  throw new Error("Invalid plan");
}

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer.isLoggedIn) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { plan } = (await req.json()) as Body;
  const priceId = getPriceId(plan);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment", // one-time payment
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/pricing`,
    // Link Stripe payment to your user
    client_reference_id: String(viewer.userId ?? viewer.email ?? "viewer"),
    metadata: {
      plan,
      userId: String(viewer.userId ?? ""),
      email: viewer.email ?? "",
    },
  });

  return NextResponse.json({ url: session.url });
}
