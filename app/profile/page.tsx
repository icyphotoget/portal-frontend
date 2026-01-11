import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileClient from "./profileClient";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-300 hover:text-white">← Home</Link>
          <form action="/auth/signout" method="post">
            <button className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm hover:bg-zinc-900/55 transition">
              Log out
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/20 p-6">
          <h1 className="text-3xl font-semibold tracking-tight">Your profile</h1>
          <p className="mt-2 text-zinc-300">
            Signed in as <span className="text-zinc-100">{user.email ?? "OAuth user"}</span>
          </p>

          <div className="mt-6">
            <ProfileClient initialNickname={profile?.nickname ?? ""} />
          </div>
        </div>
      </div>
    </main>
  );
}
