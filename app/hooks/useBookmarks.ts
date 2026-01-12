"use client";

import { useEffect, useState } from "react";
import { strapiFetch } from "@/app/lib/strapiClient";
import { useAuth } from "@/app/providers/AuthProvider";

export function useBookmarkStatus(articleId: number | null) {
  const { user, ready } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user || !articleId) {
      setBookmarked(false);
      return;
    }

    setLoading(true);
    strapiFetch<{ bookmarked: boolean }>(`/api/bookmarks/status?articleId=${articleId}`, { auth: true })
      .then((d) => setBookmarked(!!d.bookmarked))
      .catch(() => setBookmarked(false))
      .finally(() => setLoading(false));
  }, [ready, user, articleId]);

  async function toggle() {
    if (!user || !articleId) return { ok: false as const };

    setLoading(true);
    try {
      const res = await strapiFetch<{ bookmarked: boolean }>("/api/bookmarks/toggle", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ articleId }),
      });
      setBookmarked(res.bookmarked);
      return { ok: true as const, bookmarked: res.bookmarked };
    } catch {
      return { ok: false as const };
    } finally {
      setLoading(false);
    }
  }

  return { bookmarked, loading, toggle, canUse: !!user };
}
