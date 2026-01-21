import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

function hmacSha512Hex(secret: string, raw: string) {
  return crypto.createHmac("sha512", secret).update(raw, "utf8").digest("hex");
}

function addDaysISO(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function parseOrder(orderId: string) {
  // expected: pro_<plan>_<userId>
  // plan is "pro_monthly" or "pro_3months"
  const parts = orderId.split("_");
  // ["pro", "pro", "monthly", "<uuid>"] OR ["pro","pro","3months","<uuid>"] depending on plan string
  // Because plan contains underscore, safer: strip "pro_" prefix then split last "_" for userId
  if (!orderId.startsWith("pro_")) return null;

  const lastUnderscore = orderId.lastIndexOf("_");
  if (lastUnderscore === -1) return null;

  const userId = orderId.slice(lastUnderscore + 1);
  const planPart = orderId.slice(3, lastUnderscore); // everything between "pro_" and "_<userId>"

  const plan = planPart as "pro_monthly" | "pro_3months";
  if (plan !== "pro_monthly" && plan !== "pro_3months") return null;

  return { plan, userId };
}

export async function POST(req: Request) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) return NextResponse.json({ error: "Missing NOWPAYMENTS_IPN_SECRET" }, { status: 500 });
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();

  // NOWPayments signature header (najčešće x-nowpayments-sig)
  const sig =
    req.headers.get("x-nowpayments-sig") ||
    req.headers.get("x-nowpayments-signature") ||
    "";

  const expected = hmacSha512Hex(secret, rawBody);
  if (!sig || sig !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  const status = String(payload?.payment_status ?? "");
  const orderId = String(payload?.order_id ?? "");

  // ✅ unlock only on final
  if (status !== "finished") {
    return NextResponse.json({ received: true });
  }

  const parsed = parseOrder(orderId);
  if (!parsed) {
    return NextResponse.json({ received: true, note: "Bad order_id format" });
  }

  const { plan, userId } = parsed;
  const days = plan === "pro_monthly" ? 31 : 93;

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_pro: true,
      pro_until: addDaysISO(days),
    })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: "Supabase update failed", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
