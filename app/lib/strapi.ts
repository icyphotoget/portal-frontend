// app/lib/strapi.ts
import type { Category } from "@/app/components/TopNav";

export type StrapiMedia = any;

export type Article = {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage?: StrapiMedia;
  category?: Category | null;

  // ✅ Editors Pick fields (NEW)
  editorsPick?: boolean | null;
  editorsPickRank?: number | null;
};

export function absolutizeStrapiUrl(maybeRelativeUrl: string | null | undefined) {
  if (!maybeRelativeUrl) return null;
  if (maybeRelativeUrl.startsWith("http")) return maybeRelativeUrl;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  return base ? `${base}${maybeRelativeUrl}` : maybeRelativeUrl;
}

export function pickMediaUrl(media: any): string | null {
  if (!media) return null;

  // Strapi v5 style: { url: "/uploads/..." }
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);

  // Strapi v4: { data: { attributes: { url } } }
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);

  // Sometimes: { data: [{ attributes: { url } }] }
  const v4arr = media?.data?.[0]?.attributes?.url;
  if (typeof v4arr === "string") return absolutizeStrapiUrl(v4arr);

  return null;
}

export function firstCoverUrl(article: any): string | null {
  const c = article?.coverImage;
  if (Array.isArray(c)) return pickMediaUrl(c[0]);
  return pickMediaUrl(c);
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

/** Normalizira Strapi relation (v4/v5) u Category ili null */
export function getArticleCategory(a: any): Category | null {
  if (!a) return null;

  // already normalized: category is an object with name/slug
  const direct = a?.category;
  if (direct?.name && direct?.slug) return direct as Category;

  // v4/v5 relation: { data: { id, attributes: { name, slug, ... } } }
  const rel = a?.category?.data;
  const attrs = rel?.attributes;
  if (attrs?.name && attrs?.slug) {
    return { id: rel?.id ?? 0, ...attrs } as Category;
  }

  return null;
}

/** Helper: izvuci attributes iz Strapi entity-a (v4/v5) */
function entityAttrs<T = any>(entity: any): { id: number; attributes: T } | null {
  if (!entity) return null;

  // v4/v5: { id, attributes }
  if (typeof entity?.id === "number" && entity?.attributes && typeof entity.attributes === "object") {
    return { id: entity.id, attributes: entity.attributes as T };
  }

  // sometimes already "flattened"
  if (typeof entity?.id === "number") {
    const { id, ...rest } = entity;
    return { id, attributes: rest as T };
  }

  return null;
}

function normalizeCategoryEntity(entity: any): Category | null {
  const parsed = entityAttrs<any>(entity);
  if (!parsed) return null;
  const { id, attributes } = parsed;
  if (!attributes?.name || !attributes?.slug) return null;
  return { id, ...attributes } as Category;
}

function normalizeArticleEntity(entity: any): Article | null {
  const parsed = entityAttrs<any>(entity);
  if (!parsed) return null;

  const { id, attributes } = parsed;

  const title = attributes?.title ?? "";
  const slug = attributes?.slug ?? "";
  if (!title || !slug) return null;

  const category = getArticleCategory(attributes);
  const coverImage = attributes?.coverImage ?? null;

  return {
    id,
    documentId: attributes?.documentId,
    title,
    slug,
    excerpt: attributes?.excerpt ?? null,
    publishedAt: attributes?.publishedAt ?? null,
    coverImage,
    category,

    // ✅ NEW fields from Strapi
    editorsPick: attributes?.editorsPick ?? false,
    editorsPickRank: attributes?.editorsPickRank ?? null,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchHomeData(baseUrl: string) {
  const articlesUrl =
    `${baseUrl}/api/articles?sort=publishedAt:desc` +
    `&populate=coverImage&populate=category` +
    `&pagination[pageSize]=50`;

  const categoriesUrl = `${baseUrl}/api/categories?sort=name:asc&pagination[pageSize]=50`;

  const [articlesJson, categoriesJson] = await Promise.all([
    fetchJson<{ data: any[] }>(articlesUrl),
    fetchJson<{ data: any[] }>(categoriesUrl),
  ]);

  const articles = (articlesJson.data ?? []).map(normalizeArticleEntity).filter(Boolean) as Article[];
  const categories = (categoriesJson.data ?? []).map(normalizeCategoryEntity).filter(Boolean) as Category[];

  return { articles, categories };
}
