import Link from "next/link";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export default async function AuthButton() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-zinc-100 px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-white transition"
      >
        Log in
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-white/10 transition"
    >
      Profile
    </Link>
  );
}
