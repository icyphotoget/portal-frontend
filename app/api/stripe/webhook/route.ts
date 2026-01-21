import Stripe from "stripe";
import { NextResponse } from "next/server";

// TODO: replace with your real "unlock pro" function
async function grantProAccess(opts: { userId?: string; email?: string; plan?: string }) {
  // Example:
  // - update your DB: users.isPro = true
  // - set expiresAt based on plan (monthly vs 3m)
  // - store payment record
  console.log("Grant Pro:", opts);
}

export const runtime = "nodejs";

// ✅ Fix: don't hardcode apiVersion (your Stripe types expect 2025-12-15.clover)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = (session.metadata?.userId || "").trim() || undefined;
    const email =
      (session.metadata?.email || "").trim() ||
      (typeof session.customer_details?.email === "string" ? session.customer_details.email : undefined);

    const plan = session.metadata?.plan;

    await grantProAccess({ userId, email, plan });
  }

  return NextResponse.json({ received: true });
}
