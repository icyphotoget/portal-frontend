// app/api/bookmarks/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id,article_id,article_slug,article_title,article_cover_url,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const article_id = Number(body?.article_id);
  const article_slug = String(body?.article_slug ?? "");
  const article_title = String(body?.article_title ?? "");
  const article_cover_url = body?.article_cover_url ? String(body.article_cover_url) : null;

  if (!article_id || !article_slug || !article_title) {
    return NextResponse.json({ error: "Missing article fields" }, { status: 400 });
  }

  const { error } = await supabase.from("bookmarks").upsert(
    {
      user_id: user.id,
      article_id,
      article_slug,
      article_title,
      article_cover_url,
    },
    { onConflict: "user_id,article_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const article_id = Number(searchParams.get("article_id"));

  if (!article_id) {
    return NextResponse.json({ error: "Missing article_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("article_id", article_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
