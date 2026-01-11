"use client";

import { useState } from "react";

function normalizeNickname(v: string) {
  // allow letters/numbers/_ and 3-20 chars
  const trimmed = v.trim();
  return trimmed;
}

export default function ProfileClient({ initialNickname }: { initialNickname: string }) {
  const [nickname, setNickname] = useState(initialNickname);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setMsg(null);
    const value = normalizeNickname(nickname);

    if (value.length < 3 || value.length > 20) {
      setMsg("Nickname must be 3–20 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setMsg("Use only letters, numbers, and underscore.");
      return;
    }

    setSaving(true);
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: value }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to save nickname.");
      setMsg("Saved.");
    } catch (e: any) {
      setMsg(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="text-sm text-zinc-400">Nickname</div>

      <div className="mt-2 flex gap-2">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g. fullportmax"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
        />
        <button
          onClick={save}
          disabled={saving}
          className="shrink-0 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950 hover:bg-white disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {msg ? <div className="mt-3 text-sm text-zinc-300">{msg}</div> : null}

      <div className="mt-3 text-xs text-zinc-500">
        Tip: keep it short. You can use letters, numbers, and underscores.
      </div>
    </div>
  );
}
