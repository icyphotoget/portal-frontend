// app/lib/strapiCurated.ts

export type Token = {
  id: number;
  name: string;
  symbol: string;
  mint?: string | null;
  chain: "solana";
  launchpad: "pumpfun" | "letsbonk" | "bags" | "other";
  meta: "meme" | "ai" | "other";
  descriptionShort?: string | null;
  website?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  logoUrl?: string | null;
};

export type CuratedListItem = {
  id: number;
  rank: number;
  note?: string | null;
  token: Token;
};

export type CuratedList = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  isPremium?: boolean; // ✅ NEW
  items: CuratedListItem[];
};

function mediaUrl(baseUrl: string, maybeUrl?: string | null) {
  if (!maybeUrl) return null;
  if (maybeUrl.startsWith("http")) return maybeUrl;
  return `${baseUrl}${maybeUrl}`;
}

// supports Strapi v4 classic (attributes/data) + flat shapes
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

export async function fetchCuratedLists(
  baseUrl: string
): Promise<Pick<CuratedList, "id" | "title" | "slug" | "isPremium">[]> {
  const url =
    `${baseUrl}/api/curated-lists` +
    `?fields[0]=title&fields[1]=slug&fields[2]=isPremium` +
    `&pagination[pageSize]=200` +
    `&sort[0]=publishedAt:desc`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`fetchCuratedLists failed: ${res.status} ${await safeReadText(res)}`);

  const json = await res.json();

  return (json?.data ?? []).map((d: any) => {
    const a = unwrap<any>(d);
    return {
      id: d?.id ?? a?.id ?? 0,
      title: a?.title ?? "",
      slug: a?.slug ?? "",
      isPremium: Boolean(a?.isPremium),
    };
  });
}

export async function fetchCuratedListBySlug(
  baseUrl: string,
  slug: string
): Promise<CuratedList | null> {
  const url =
    `${baseUrl}/api/curated-lists` +
    `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate[items][populate][token][populate]=logo` +
    `&sort[0]=items.rank:asc`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error(`fetchCuratedListBySlug failed: ${res.status} ${await safeReadText(res)}`);

  const json = await res.json();
  const d = json?.data?.[0];
  if (!d) return null;

  const a = unwrap<any>(d);

  const rawItems: any[] = a?.items?.data ?? a?.items ?? [];

  const items: CuratedListItem[] = (rawItems ?? []).map((it: any) => {
    const ita = unwrap<any>(it);

    const tokenRel = ita?.token?.data ?? ita?.token ?? null;
    const ta = unwrap<any>(tokenRel ?? {});
    const logo = ta?.logo?.data?.attributes?.url ?? ta?.logo?.url ?? null;

    const token: Token = {
      id: tokenRel?.id ?? ta?.id ?? 0,
      name: ta?.name ?? "",
      symbol: ta?.symbol ?? "",
      mint: ta?.mint ?? null,
      chain: (ta?.chain ?? "solana") as "solana",
      launchpad: (ta?.launchpad ?? "other") as Token["launchpad"],
      meta: (ta?.meta ?? "other") as Token["meta"],
      descriptionShort: ta?.descriptionShort ?? null,
      website: ta?.website ?? null,
      twitter: ta?.twitter ?? null,
      telegram: ta?.telegram ?? null,
      logoUrl: mediaUrl(baseUrl, logo),
    };

    return {
      id: it?.id ?? ita?.id ?? 0,
      rank: ita?.rank ?? 100,
      note: ita?.note ?? null,
      token,
    };
  });

  return {
    id: d?.id ?? a?.id ?? 0,
    title: a?.title ?? "",
    slug: a?.slug ?? slug,
    description: a?.description ?? null,
    isPremium: Boolean(a?.isPremium), // ✅ NEW
    items,
  };
}
