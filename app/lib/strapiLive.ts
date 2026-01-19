// app/lib/strapiLive.ts
import type { LiveBarItem } from "@/app/components/LiveBar";

function unwrap<T = any>(obj: any): T {
  return (obj?.attributes ?? obj) as T;
}

async function safeReadText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function fetchLiveTickerItems(baseUrl: string, take = 6): Promise<LiveBarItem[]> {
  const url =
    `${baseUrl}/api/live-tickers?` +
    `filters[isActive][$eq]=true&` +
    // if expiresAt exists, you can filter it later (Strapi query is a bit verbose)
    `sort[0]=priority:asc&sort[1]=publishedAt:desc&` +
    `pagination[pageSize]=${take}&` +
    `fields[0]=text&fields[1]=label&fields[2]=href`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // not fatal; just show nothing
    console.warn("fetchLiveTickerItems failed:", res.status, await safeReadText(res));
    return [];
  }

  const json = await res.json();
  const data = json?.data ?? [];

  return (data as any[])
    .map((entity) => {
      const a = unwrap<any>(entity);
      const text = (a?.text as string | undefined)?.trim();
      if (!text) return null;

      const label = (a?.label as string | undefined)?.trim() || "LIVE";
      const href = (a?.href as string | undefined)?.trim() || undefined;

      return { text, label, href } as LiveBarItem;
    })
    .filter(Boolean) as LiveBarItem[];
}
