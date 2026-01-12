// app/api/search/route.ts
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim().slice(0, 80);

    if (!q) return NextResponse.json({ results: [] });

    if (!STRAPI_URL) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_STRAPI_URL" }, { status: 500 });
    }

    const qs = new URLSearchParams({
      "filters[$or][0][title][$containsi]": q,
      "filters[$or][1][excerpt][$containsi]": q,
      "pagination[pageSize]": "8",
      "sort[0]": "publishedAt:desc",
      "populate[category]": "true",
      "fields[0]": "title",
      "fields[1]": "slug",
      "fields[2]": "excerpt",
      "fields[3]": "publishedAt",
    });

    const res = await fetch(`${STRAPI_URL}/api/articles?${qs.toString()}`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Strapi error", detail: text }, { status: 500 });
    }

    const json = await res.json();
    const data = json?.data ?? [];

    const results = data.map((item: any) => {
      const src = item?.attributes ?? item ?? {};

      const category =
        src?.category?.data?.attributes?.name ??
        src?.category?.name ??
        src?.category ??
        null;

      return {
        id: item?.id ?? src?.id ?? null,
        title: src?.title ?? "",
        slug: src?.slug ?? "",
        excerpt: src?.excerpt ?? "",
        publishedAt: src?.publishedAt ?? null,
        category,
      };
    });

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Search failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
