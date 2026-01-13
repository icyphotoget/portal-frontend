"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Profile = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
};

type ApiProfileResponse =
  | {
      user: { id: string; email?: string | null };
      profile: Profile | null;
    }
  | { error: string };

export default function MenuAuthHeader({ onClose }: { onClose?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const [email, setEmail] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const displayName = useMemo(() => {
    const n = nickname?.trim();
    if (n) return n;
    if (email) return email;
    return "Guest";
  }, [nickname, email]);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/profile", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as ApiProfileResponse | null;

      if (!res.ok || !json || "error" in json) {
        setAuthed(false);
        setEmail(null);
        setNickname(null);
        setAvatarUrl(null);
        return;
      }

      setAuthed(true);
      setEmail(json.user?.email ?? null);
      setNickname(json.profile?.nickname ?? null);
      setAvatarUrl(json.profile?.avatar_url ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // ✅ refresh when profile changes (from ProfileClient)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "fp_profile_updated") load();
    };
    window.addEventListener("storage", onStorage);

    // ✅ also refresh in same tab (storage event sometimes doesn’t fire same-tab)
    const onCustom = () => load();
    window.addEventListener("fp_profile_updated" as any, onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("fp_profile_updated" as any, onCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper: fire a same-tab event
  useEffect(() => {
    const orig = localStorage.setItem;
    localStorage.setItem = function (key: string, value: string) {
      orig.apply(this, [key, value]);
      if (key === "fp_profile_updated") {
        window.dispatchEvent(new Event("fp_profile_updated"));
      }
    };
    return () => {
      localStorage.setItem = orig;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="min-w-0">
          <div className="h-3 w-40 rounded bg-white/10" />
          <div className="mt-2 h-2 w-28 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-w-0 items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-white">Guest</div>
          <div className="text-xs text-white/55">Not signed in</div>
        </div>

        <Link
          href="/login"
          onClick={() => onClose?.()}
          className="rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-zinc-200 transition"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 w-full">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-black text-white/80">
              {String(displayName).slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold text-white">{displayName}</div>
          <div className="truncate text-xs text-white/55">{email}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          onClick={() => onClose?.()}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/85 hover:bg-white/10 transition"
        >
          Profile
        </Link>

        <Link
          href="/logout"
          onClick={() => onClose?.()}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/85 hover:bg-white/10 transition"
        >
          Log out
        </Link>
      </div>
    </div>
  );
}
