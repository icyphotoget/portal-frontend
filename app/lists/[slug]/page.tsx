import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";

import { fetchHomeData } from "@/app/lib/strapi";
import { fetchCuratedListBySlug } from "@/app/lib/strapiCurated";
import CuratedListLayoutClient from "@/app/components/CuratedListLayoutClient";

import PaywallCard from "@/app/components/PaywallCard";
import { getViewer } from "@/app/lib/auth";

export default async function CuratedListPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const baseUrl =
    process.env.STRAPI_URL ??
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    "http://localhost:1337";

  let categories: Category[] = [];
  try {
    const home = await fetchHomeData(baseUrl);
    categories = home.categories ?? [];
  } catch {
    categories = [];
  }

  const list = await fetchCuratedListBySlug(baseUrl, slug);

  if (!list) {
    return (
      <main className="min-h-screen bg-black text-white">
        <TopNav categories={categories} />
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8 py-10">
          <h1 className="text-2xl font-bold">List not found</h1>
          <p className="mt-2 text-zinc-400">No curated list with slug: {slug}</p>
        </div>
        <Footer />
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    );
  }

  // ✅ PAYWALL CHECK
  const viewer = await getViewer();
  const isLocked = Boolean(list.isPremium) && !viewer.isPro;

  if (isLocked) {
    return (
      <main className="min-h-screen bg-black text-white flex min-h-[100dvh] flex-col">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
          <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
        </div>

        <TopNav categories={categories} />

        <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{list.title}</h1>
            <p className="mt-2 text-zinc-400">This list is premium.</p>
          </div>

          <div className="max-w-2xl">
            <PaywallCard
              title="Locked 🔒"
              subtitle={
                viewer.isLoggedIn
                  ? "You’re signed in, but you don’t have Pro access yet. Upgrade to unlock premium picks."
                  : "Sign in + upgrade to unlock premium picks."
              }
              ctaLabel="See pricing"
              ctaHref="/pricing"
              showLoginHint={!viewer.isLoggedIn}
            />
          </div>
        </div>

        <Footer />
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    );
  }

  // ✅ UNLOCKED RENDER
  return (
    <main className="min-h-screen bg-black text-white flex min-h-[100dvh] flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{list.title}</h1>
          {list.description ? (
            <div className="mt-3 max-w-3xl whitespace-pre-wrap text-zinc-300">
              {list.description}
            </div>
          ) : null}
        </div>

        <CuratedListLayoutClient items={list.items} />
      </div>

      <Footer />
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
