import { redirect } from "next/navigation";
import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";
import { fetchHomeData } from "@/app/lib/strapi";
import { getViewer } from "@/app/lib/auth";
import CryptoCheckoutClient from "./ui";

export default async function CryptoCheckoutPage() {
  const viewer = await getViewer();
  if (!viewer.isLoggedIn) redirect("/signin");

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

  return (
    <main className="min-h-screen bg-black text-white flex min-h-[100dvh] flex-col">
      <TopNav categories={categories} />

      <div className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight">Pay with Crypto</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Choose a plan and pay via invoice (QR + wallet). Your Pro access unlocks automatically.
        </p>

        <div className="mt-8">
          <CryptoCheckoutClient />
        </div>
      </div>

      <Footer />
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
