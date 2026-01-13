// app/profile/page.tsx
import Link from "next/link";
import ProfileClient from "./profileClient";
import { createSupabaseServer } from "@/app/lib/supabase/server";

type ProfileRow = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
};

type BookmarkRow = {
  id: number;
  user_id: string;
  article_id: number | null;
  article_slug: string;
  article_title: string;
  article_cover_url?: string | null; // ako nemaš ovu kolonu u DB, ostavi ovako (ne koristimo je)
  created_at: string;
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();

  // 1) Auth user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  // Ako nema usera (ili error), pokaži login ekran
  if (userErr || !user) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Home
          </Link>

          <h1 className="mt-8 text-3xl font-extrabold">Profile</h1>
          <p className="mt-2 text-zinc-400">Please log in first.</p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-2.5 font-bold text-black"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  // 2) Profile row
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id,nickname,avatar_url")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileErr) {
    console.error("Profile error:", profileErr);
  }

  // 3) Bookmarks
  const { data: bookmarkRows, error: bmErr } = await supabase
    .from("bookmarks")
    .select("id,user_id,article_id,article_slug,article_title,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<BookmarkRow[]>();

  if (bmErr) {
    console.error("Bookmarks error:", bmErr.message, bmErr);
  }

  const bookmarks = (bookmarkRows ?? []) as any[];

  return (
    <ProfileClient
      user={{ id: user.id, email: user.email }}
      profile={(profile ?? null) as any}
      bookmarks={bookmarks}
    />
  );
}
