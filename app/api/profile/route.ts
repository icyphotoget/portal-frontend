import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const nickname = String(body?.nickname ?? "").trim();

  if (nickname.length < 3 || nickname.length > 20) {
    return NextResponse.json({ error: "Nickname must be 3–20 characters." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
    return NextResponse.json({ error: "Only letters, numbers, and underscore allowed." }, { status: 400 });
  }

  // upsert own profile row
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, nickname }, { onConflict: "id" });

  if (error) {
    // likely unique violation on nickname
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
