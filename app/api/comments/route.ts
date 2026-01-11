import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id")
    .eq("article_slug", slug)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  const content = body?.content as string | undefined;

  if (!slug || !content) return NextResponse.json({ error: "Missing slug/content" }, { status: 400 });

  const trimmed = content.trim();
  if (trimmed.length < 1 || trimmed.length > 2000)
    return NextResponse.json({ error: "Invalid content length" }, { status: 400 });

  const { error } = await supabase.from("comments").insert({
    article_slug: slug,
    user_id: user.id,
    content: trimmed,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
