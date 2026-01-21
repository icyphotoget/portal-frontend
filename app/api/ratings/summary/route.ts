import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();

  if (!symbol) {
    return NextResponse.json({ avg: null, count: 0 });
  }

  // 1️⃣ get token id
  const tokenRes = await fetch(
    `${STRAPI_URL}/api/tokens?filters[symbol][$eq]=${symbol}&fields[0]=id`,
    { cache: "no-store" }
  );

  const tokenJson = await tokenRes.json();
  const tokenId = tokenJson?.data?.[0]?.id;

  if (!tokenId) {
    return NextResponse.json({ avg: null, count: 0 });
  }

  // 2️⃣ get ratings (NO attributes!)
  const ratingsRes = await fetch(
    `${STRAPI_URL}/api/ratings?filters[token][id][$eq]=${tokenId}&fields[0]=value&pagination[pageSize]=500`,
    { cache: "no-store" }
  );

  const ratingsJson = await ratingsRes.json();

  const values = ratingsJson.data.map((r: any) => r.value);

  if (!values.length) {
    return NextResponse.json({ avg: null, count: 0 });
  }

  const avg =
    values.reduce((a: number, b: number) => a + b, 0) / values.length;

  return NextResponse.json({
    avg: Number(avg.toFixed(2)),
    count: values.length,
  });
}
