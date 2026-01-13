"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Profile = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
};

type Bookmark = {
  id: number;
  article_id: number;
  article_slug: string;
  article_title: string;
  article_cover_url: string | null;
  created_at: string;
};

function normalizeNick(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, "_");
}

export default function ProfileClient({
  user,
  profile,
  bookmarks: initialBookmarks,
}: {
  user: { id: string; email?: string | null };
  profile: Profile | null;
  bookmarks: Bookmark[];
}) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(profile);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const displayName = useMemo(() => {
    const nick = currentProfile?.nickname?.trim();
    return (nick && nick.length > 0 ? nick : user?.email) || "User";
  }, [currentProfile?.nickname, user?.email]);

  async function saveNickname() {
    setSaving(true);
    setMsg(null);

    const normalized = nickname ? normalizeNick(nickname) : "";
    setNickname(normalized);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: normalized }),
    });

    const json = await res.json().catch(() => null);
    setSaving(false);

    if (!res.ok) {
      setMsg(json?.error ?? "Failed to save.");
      return;
    }

    // ✅ update UI instantly
    if (json?.profile) setCurrentProfile(json.profile);

    setMsg("Saved ✅");

    // ✅ tell MenuAuthHeader to refresh (menu will update nickname/avatar)
    localStorage.setItem("fp_profile_updated", String(Date.now()));
  }

  async function uploadAvatar(file: File) {
    setSaving(true);
    setMsg(null);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/avatar", { method: "POST", body: fd });
    const json = await res.json().catch(() => null);
    setSaving(false);

    if (!res.ok) {
      setMsg(json?.error ?? "Upload failed.");
      return;
    }

    const url = json?.avatar_url ?? null;
    setAvatarUrl(url);

    // ✅ keep profile state in sync
    setCurrentProfile((p) =>
      p ? { ...p, avatar_url: url } : { id: user.id, nickname: nickname || null, avatar_url: url }
    );

    setMsg("Avatar updated ✅");

    // ✅ tell MenuAuthHeader to refresh
    localStorage.setItem("fp_profile_updated", String(Date.now()));
  }

  async function removeBookmark(article_id: number) {
    const prev = bookmarks;
    setBookmarks((xs) => xs.filter((b) => b.article_id !== article_id));

    const res = await fetch(`/api/bookmarks?article_id=${article_id}`, { method: "DELETE" });
    if (!res.ok) {
      setBookmarks(prev);
      setMsg("Failed to remove bookmark.");
      return;
    }
    setMsg("Removed ✅");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Home
          </Link>
          <Link
            href="/logout"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold hover:bg-white/10"
          >
            Log out
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-black/30">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-white/60 font-black">
                  {String(displayName).slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold">Your profile</h1>
              <p className="mt-1 text-zinc-400 truncate">
                Signed in as {user?.email} {currentProfile?.nickname ? `• ${currentProfile.nickname}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <label className="text-sm text-zinc-300">Nickname</label>
            <div className="flex gap-3">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. fullportmax"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/25"
              />
              <button
                onClick={saveNickname}
                disabled={saving}
                className="rounded-xl bg-white px-5 py-3 font-extrabold text-black disabled:opacity-60"
              >
                Save
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Tip: 3–20 chars, letters/numbers/underscore. (spaces become _)
            </p>

            <label className="mt-6 text-sm text-zinc-300">Avatar</label>
            <input
              type="file"
              accept="image/*"
              disabled={saving}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAvatar(f);
              }}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-black hover:file:bg-zinc-200"
            />

            {msg ? <div className="mt-2 text-sm text-zinc-200">{msg}</div> : null}
          </div>
        </div>

        {/* BOOKMARKS */}
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold">Bookmarks</h2>
          <p className="mt-1 text-zinc-400">Saved posts will appear here.</p>

          <div className="mt-6 grid gap-3">
            {bookmarks.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">
                No bookmarks yet.
              </div>
            ) : (
              bookmarks.slice(0, 20).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="min-w-0">
                    <Link href={`/news/${b.article_slug}`} className="font-extrabold hover:underline">
                      {b.article_title}
                    </Link>
                    <div className="mt-1 text-xs text-zinc-500">
                      Saved: {new Date(b.created_at).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => removeBookmark(b.article_id)}
                    className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold hover:bg-white/10"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {bookmarks.length > 20 ? (
            <div className="mt-4 text-sm text-zinc-500">Showing latest 20.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
