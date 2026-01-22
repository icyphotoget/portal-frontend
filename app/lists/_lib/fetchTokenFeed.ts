// app/lists/_lib/fetchTokenFeed.ts
type StrapiRail = {
  id: number;
  title?: string | null;
  kind?: string | null;
  items?: Array<{
    id?: number;
    rank?: number | null;
    taglineOverride?: string | null;
    token?: any; // može biti flat ili relation shape
  }>;
};

function unwrapEntity(obj: any) {
  // podržava: flat object, {data:{attributes}}, {attributes}
  if (!obj) return null;
  if (obj.data?.attributes) return { id: obj.data.id, ...obj.data.attributes };
  if (obj.attributes) return { id: obj.id, ...obj.attributes };
  return obj;
}

function mediaUrl(baseUrl: string, maybeUrl?: string | null) {
  if (!maybeUrl) return null;
  if (maybeUrl.startsWith("http")) return maybeUrl;
  return `${baseUrl}${maybeUrl}`;
}

async function strapiGet(baseUrl: string, path: string) {
  const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchTokenFeed(baseUrl: string) {
  const qs =
    "/api/rails?pagination[pageSize]=100" +
    "&populate[items][populate][token][populate]=logo";

  const json = await strapiGet(baseUrl, qs);
  const railsRaw = json?.data ?? [];

  const rails: StrapiRail[] = railsRaw.map((r: any) => unwrapEntity(r)).filter(Boolean);

  const byKind: Record<string, any[]> = { trending: [], top_picks: [], new_notable: [], featured: [] };

  for (const rail of rails) {
    const kind = (rail.kind ?? "").toString();
    const items = Array.isArray(rail.items) ? rail.items : [];

    const tokens = items
      .map((it) => {
        const t = unwrapEntity(it?.token);
        if (!t?.symbol) return null;

        const logo =
          t?.logo?.data?.attributes?.url ??
          t?.logo?.url ??
          null;

        return {
          id: t.id ?? t.symbol,
          symbol: String(t.symbol).toUpperCase(),
          name: t.name ?? null,
          tagline: it?.taglineOverride ?? t.descriptionShort ?? null,
          chain: t.chain ?? null,
          narrative: t.meta ?? null,
          score: null,
          logoUrl: mediaUrl(baseUrl, logo),
        };
      })
      .filter(Boolean);

    // sort po rank
    tokens.sort((a: any, b: any) => {
      const ra = items.find((x) => unwrapEntity(x?.token)?.symbol === a.symbol)?.rank ?? 9999;
      const rb = items.find((x) => unwrapEntity(x?.token)?.symbol === b.symbol)?.rank ?? 9999;
      return ra - rb;
    });

    byKind[kind] = tokens;
  }

  return {
    trending: byKind["trending"] ?? [],
    topPicks: byKind["top_picks"] ?? [],
    newNotable: byKind["new_notable"] ?? [],
    featured: byKind["featured"] ?? [],
  };
}
