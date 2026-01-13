import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nickname, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({ user: { id: user.id, email: user.email }, profile });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  let nickname = String(body?.nickname ?? "").trim();

  nickname = nickname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, nickname }, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
