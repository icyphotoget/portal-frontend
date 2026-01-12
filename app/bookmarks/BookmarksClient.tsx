"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

type Bookmark = {
  id: number;
  article_slug: string;
  article_title: string | null;
  created_at: string;
};

export default function BookmarksClient() {
  const { user, loading } = useAuth();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [items, setItems] = useState<Bookmark[]>([]);
  const [listLoading, setListLoading] = useState(false);

  async function load(uid: string) {
    setListLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("id,article_slug,article_title,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) console.error("load bookmarks error:", error);
    setItems((data ?? []) as Bookmark[]);
    setListLoading(false);
  }

  useEffect(() => {
    if (loading) return;
    if (!user?.id) return;
    load(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-extrabold">Bookmarks</h1>
        <p className="mt-3 text-white/70">Please login to view bookmarks.</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Bookmarks</h1>
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          Home
        </Link>
      </div>

      <div className="mt-6">
        {listLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            No bookmarks yet.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((b) => (
              <Link
                key={b.id}
                href={`/news/${b.article_slug}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="text-base font-bold">{b.article_title ?? b.article_slug}</div>
                <div className="mt-1 text-xs text-white/50">
                  {new Date(b.created_at).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
