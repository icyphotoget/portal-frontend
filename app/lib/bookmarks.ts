import { supabase } from "@/app/lib/supabase"; // prilagodi path gdje ti je supabase client

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function api(path: string, init?: RequestInit) {
  if (!STRAPI) throw new Error("Missing NEXT_PUBLIC_STRAPI_URL");
  const token = await getAccessToken();
  if (!token) throw new Error("Not logged in (no Supabase session)");

  const res = await fetch(`${STRAPI}/api${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getBookmarkStatus(articleId: number) {
  return api(`/bookmarks/status?articleId=${articleId}`);
}

export async function toggleBookmark(articleId: number) {
  return api(`/bookmarks/toggle`, {
    method: "POST",
    body: JSON.stringify({ articleId }),
  });
}

export async function getMyBookmarks() {
  return api(`/bookmarks/me`);
}
