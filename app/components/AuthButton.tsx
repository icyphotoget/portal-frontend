import Link from "next/link";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export default async function AuthButton() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white transition"
      >
        Log in
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/55 transition"
    >
      Profile
    </Link>
  );
}
