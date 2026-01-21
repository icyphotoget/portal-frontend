import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN!;
const HOURS_BLOCK = 6;

/* ---------------- utils ---------------- */

function ipHash(ip: string) {
  const salt = process.env.RATING_SALT || "fallback_salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function headers() {
  return {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    "Content-Type": "application/json",
  };
}

/* -------------- helpers -------------- */

async function getTokenId(symbol: string) {
  const res = await fetch(
    `${STRAPI_URL}/api/tokens?filters[symbol][$eq]=${symbol}&fields[0]=id`,
    { headers: headers(), cache: "no-store" }
  );

  const json = await res.json();
  return json?.data?.[0]?.id ?? null;
}

/* ---------------- POST ---------------- */

export async function POST(req: Request) {
  try {
    const { symbol, value } = await req.json();
    const cleanSymbol = String(symbol).trim().toUpperCase();

    if (!cleanSymbol || value < 1 || value > 5) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const tokenId = await getTokenId(cleanSymbol);
    if (!tokenId) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const ip = getClientIp(req);
    const hashed = ipHash(ip);

    const res = await fetch(`${STRAPI_URL}/api/ratings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        data: {
          value,
          ipHash: hashed,
          token: tokenId, // ✅ RELACIJA ODMAH
        },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: "Strapi error", details: t }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
