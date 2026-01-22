// app/lib/strapiTokens.ts
import type { Token } from "@/app/lib/strapiCurated";

function unwrap<T = any>(obj: any): T {
  return (obj?.attributes ?? obj) as T;
}

function mediaUrl(baseUrl: string, maybeUrl?: string | null) {
  if (!maybeUrl) return null;
  if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) return maybeUrl;
  return `${baseUrl}${maybeUrl}`;
}

async function safeReadText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function normalizeWebsite(url?: string | null) {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `https://${u}`;
}

function normalizeTwitter(urlOrHandle?: string | null) {
  if (!urlOrHandle) return null;
  const v = urlOrHandle.trim();
  if (!v) return null;

  // već je URL
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  // handle: "@name" ili "name"
  const handle = v.replace(/^@/, "");
  return `https://x.com/${handle}`;
}

function normalizeTelegram(urlOrHandle?: string | null) {
  if (!urlOrHandle) return null;
  const v = urlOrHandle.trim();
  if (!v) return null;

  // već je URL
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  // handle: "@name" ili "name"
  const handle = v.replace(/^@/, "");
  return `https://t.me/${handle}`;
}

export async function fetchTokenBySymbol(baseUrl: string, symbol: string): Promise<Token | null> {
  const sym = symbol.trim().toUpperCase();

  // IMPORTANT: Strapi v4/v5 populate syntax
  // - ovdje samo logo (upload media field) -> radi stabilno
  const url =
    `${baseUrl}/api/tokens` +
    `?filters[symbol][$eq]=${encodeURIComponent(sym)}` +
    `&populate=logo`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`fetchTokenBySymbol failed: ${res.status} ${await safeReadText(res)}`);
  }

  const json = await res.json();
  const d = json?.data?.[0];
  if (!d) return null;

  const a = unwrap<any>(d);

  // Strapi media može doći kao:
  // a.logo.data.attributes.url  (najčešće)
  // ili već flattenano (ovisno o pluginovima)
  const logo =
    a?.logo?.data?.attributes?.url ??
    a?.logo?.url ??
    null;

  return {
    id: d?.id ?? a?.id ?? 0,
    name: a?.name ?? "",
    symbol: a?.symbol ?? sym,
    mint: a?.mint ?? null,
    chain: (a?.chain ?? "solana") as "solana",
    launchpad: (a?.launchpad ?? "other") as Token["launchpad"],
    meta: (a?.meta ?? "other") as Token["meta"],
    descriptionShort: a?.descriptionShort ?? null,

    // ✅ normalize linkove da rade i kad upišeš samo handle ili domenu
    website: normalizeWebsite(a?.website ?? null),
    twitter: normalizeTwitter(a?.twitter ?? null),
    telegram: normalizeTelegram(a?.telegram ?? null),

    logoUrl: mediaUrl(baseUrl, logo),
  };
}
