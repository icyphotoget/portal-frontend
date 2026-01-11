// app/components/AuthButton.tsx
import Link from "next/link";
import { createSupabaseServer } from "@/app/lib/supabase/server";

function initialsFrom(user: any) {
  const email: string | undefined = user?.email ?? undefined;
  const meta: any = user?.user_metadata ?? {};
  const name: string | undefined =
    meta?.full_name || meta?.name || meta?.username || undefined;

  const base = (name || email || "User").trim();
  const raw = base.includes("@") ? base.split("@")[0] : base;
  const parts = raw.split(/[.\s_-]+/).filter(Boolean);

  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function displayNameFrom(user: any) {
  const email: string | undefined = user?.email ?? undefined;
  const meta: any = user?.user_metadata ?? {};
  const name: string | undefined =
    meta?.full_name || meta?.name || meta?.username || undefined;

  if (name && typeof name === "string") return name;
  if (email && typeof email === "string") return email.split("@")[0];
  return "User";
}

export default async function AuthButton() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged out
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full bg-zinc-100 px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-white transition"
        >
          Log in
        </Link>
      </div>
    );
  }

  const initials = initialsFrom(user);
  const displayName = displayNameFrom(user);

  // Logged in
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10 transition"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-[11px] font-extrabold text-black">
          {initials}
        </div>

        <span className="hidden sm:block text-xs font-extrabold uppercase tracking-wide text-white">
          {displayName}
        </span>
      </Link>

      <Link
        href="/auth/signout"
        className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-white/10 transition"
      >
        Log out
      </Link>
    </div>
  );
}
