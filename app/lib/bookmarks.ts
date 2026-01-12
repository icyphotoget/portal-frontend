// app/lib/bookmarks.ts
"use client";

import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export type BookmarkRow = {
  id: number;
  user_id: string;
  article_slug: string;
  article_title: string | null;
  created_at: string;
};

export async function isBookmarked(userId: string, slug: string) {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("article_slug", slug)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function addBookmark(userId: string, slug: string, title?: string | null) {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    article_slug: slug,
    article_title: title ?? null,
  });

  if (error) throw error;
}

export async function removeBookmark(userId: string, slug: string) {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("article_slug", slug);

  if (error) throw error;
}

export async function listBookmarks(userId: string) {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id,user_id,article_slug,article_title,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BookmarkRow[];
}
