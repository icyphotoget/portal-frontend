// app/auth/signout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.auth.signOut();
  if (error) {
    // still redirect, but at least you won't be stuck
    console.error("SignOut error:", error.message);
  }

  const url = new URL("/", request.url);
  const res = NextResponse.redirect(url, { status: 303 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
