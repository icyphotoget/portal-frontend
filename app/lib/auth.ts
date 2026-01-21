// app/lib/auth.ts
import { createSupabaseServer } from "@/app/lib/supabase/server";

export type Viewer = {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  isPro: boolean;
  proUntil: string | null;
};

export async function getViewer(): Promise<Viewer> {
  const supabase = await createSupabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  if (!user) {
    return {
      isLoggedIn: false,
      userId: null,
      email: null,
      isPro: false,
      proUntil: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro, pro_until")
    .eq("id", user.id)
    .maybeSingle();

  const proUntil = profile?.pro_until ?? null;
  const isProByDate = proUntil
    ? new Date(proUntil).getTime() > Date.now()
    : false;

  return {
    isLoggedIn: true,
    userId: user.id,
    email: user.email ?? null,
    isPro: Boolean(profile?.is_pro) && isProByDate,
    proUntil,
  };
}

/**
 * ✅ Helper za client / premium gate
 * koristi se u premium-gate-client.tsx
 */
export async function getIsLoggedIn(): Promise<boolean> {
  const viewer = await getViewer();
  return viewer.isLoggedIn;
}
