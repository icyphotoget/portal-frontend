// app/api/avatar/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }

  if (file.size > 2_000_000) {
    return NextResponse.json({ error: "Max 2MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatar_url = pub?.publicUrl ?? null;

  const { error: profError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      avatar_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (profError) {
    return NextResponse.json({ error: profError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, avatar_url });
}
