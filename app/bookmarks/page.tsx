"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { strapiFetch } from "@/app/lib/strapiClient";
import { useAuth } from "@/app/providers/AuthProvider";

type Bookmark = {
  id: number;
  article?: {
    title: string;
    slug: string;
    excerpt?: string | null;
    publishedAt?: string | null;
  };
};

export default function BookmarksPage() {
  const { user, ready } = useAuth();
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) return;

    setLoading(true);
    strapiFetch<{ data: Bookmark[] }>("/api/bookmarks/me", { auth: true })
      .then((d) => setItems(d.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [ready, user]);

  if (!ready) return null;

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="mt-3 text-zinc-400">Login to see your saved articles.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Bookmarks</h1>

        {loading ? (
          <p className="mt-4 text-zinc-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-zinc-400">No bookmarks yet.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((b) => (
              <Link
                key={b.id}
                href={b.article?.slug ? `/news/${b.article.slug}` : "#"}
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="text-lg font-bold">{b.article?.title ?? "Untitled"}</div>
                {b.article?.excerpt && <div className="mt-2 text-sm text-zinc-400">{b.article.excerpt}</div>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
