"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

type CommentRow = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default function Comments({ slug }: { slug: string }) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CommentRow[]>([]);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");
    const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [slug]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function submit() {
    setMsg("");
    const trimmed = content.trim();
    if (!trimmed) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, content: trimmed }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(json.error || "Failed to post comment.");
      return;
    }

    setContent("");
    await load();
  }

  return (
    <section className="mt-10 rounded-[1.8rem] border border-zinc-800 bg-zinc-900/15 p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Comments</h3>
          <p className="mt-1 text-sm text-zinc-400">
            {userId ? "You’re logged in." : "Log in to leave a comment."}
          </p>
        </div>

        {!userId ? (
          <Link
            href="/login"
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            Log in
          </Link>
        ) : null}
      </div>

      {userId ? (
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            className="min-h-[96px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none"
            placeholder="Write a comment…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-400">{msg}</div>
            <button
              onClick={submit}
              className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950"
            >
              Post
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        {loading ? (
          <div className="text-sm text-zinc-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-400">No comments yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <div className="text-xs text-zinc-500">{timeAgo(c.created_at)}</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">
                  {c.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
