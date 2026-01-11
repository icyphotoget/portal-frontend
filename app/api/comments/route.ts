// app/api/comments/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug")?.trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("article_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const slug = String(body?.slug ?? "").trim();
    const content = String(body?.content ?? "").trim();

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    // must be logged in (RLS should enforce too)
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        article_slug: slug,
        content,
        user_id: user.id,
      })
      .select("id, content, created_at, user_id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
