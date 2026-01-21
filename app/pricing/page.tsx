// app/pricing/page.tsx
import Link from "next/link";
import TopNav, { Category } from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";

import { fetchHomeData } from "@/app/lib/strapi";
import { getViewer } from "@/app/lib/auth";

function PriceCard({
  title,
  subtitle,
  price,
  priceNote,
  bullets,
  highlight = false,
  badgeText,
  ctas,
}: {
  title: string;
  subtitle: string;
  price: string;
  priceNote?: string;
  bullets: string[];
  highlight?: boolean;
  badgeText?: string;
  ctas?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "relative rounded-2xl border p-6",
        highlight
          ? "border-cyan-300/30 bg-zinc-900/40 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_20px_80px_rgba(0,0,0,0.6)]"
          : "border-zinc-800 bg-zinc-900/20",
      ].join(" ")}
    >
      {badgeText ? (
        <div className="absolute -top-3 left-6">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-cyan-200">
            {badgeText}
          </span>
        </div>
      ) : null}

      <div className="text-2xl font-black">{title}</div>
      <div className="mt-2 text-zinc-300">{subtitle}</div>

      <div className="mt-5 flex items-end gap-2">
        <div className="text-4xl font-black">{price}</div>
        {priceNote ? <div className="pb-1 text-sm text-zinc-500">{priceNote}</div> : null}
      </div>

      <div className="mt-6 text-sm text-zinc-300">
        Includes:
        <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-400">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      {ctas ? <div className="mt-6">{ctas}</div> : null}
    </div>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black hover:opacity-90"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-extrabold text-white hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export default async function PricingPage() {
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

  const viewer = await getViewer();

  const proCtas = viewer.isPro ? (
    <div className="grid gap-3">
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-extrabold text-emerald-200">
        You’re Pro ✅
      </div>
      <PrimaryButton href="/lists">Browse premium lists</PrimaryButton>
    </div>
  ) : !viewer.isLoggedIn ? (
    <div className="grid gap-3">
      <PrimaryButton href="/login">Sign in to continue</PrimaryButton>
      <div className="text-xs text-white/50">
        Sign in first so we can unlock access automatically after payment.
      </div>
    </div>
  ) : (
    <div className="grid gap-3">
      {/* Card payments later (Stripe, LemonSqueezy, Paddle, etc.) */}
      <PrimaryButton href="/checkout/card">Pay with card</PrimaryButton>

      {/* Crypto checkout (NOWPayments) */}
      <SecondaryButton href="/checkout/crypto">Pay with crypto</SecondaryButton>

      <div className="text-xs text-white/50">
        Crypto supports stablecoins (USDT/USDC) + major networks.
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white flex min-h-[100dvh] flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      <TopNav categories={categories} />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight">Premium Picks</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Curated lists, rankings, and context — built for fast cycles.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <PriceCard
            title="Free"
            subtitle="News + public lists."
            price="$0"
            bullets={[
              "News posts",
              "Public curated lists",
              "Basic navigation & categories",
            ]}
            ctas={
              <div className="grid gap-3">
                <PrimaryButton href="/news">Read news</PrimaryButton>
                <SecondaryButton href="/lists">Browse lists</SecondaryButton>
              </div>
            }
          />

          <PriceCard
            title="Pro Monthly"
            subtitle="Full access. Cancel anytime."
            price="$19"
            priceNote="/ month"
            bullets={[
              "Premium curated lists",
              "Deeper notes per pick",
              "Pro-only list updates",
              "Members-only drops (as added)",
            ]}
            ctas={proCtas}
          />

          <PriceCard
            title="Pro (3 Months)"
            subtitle="Best value for the cycle."
            price="$49"
            priceNote="/ 3 months"
            bullets={[
              "Everything in Pro Monthly",
              "Best value plan",
              "Stay positioned longer",
            ]}
            highlight
            badgeText="Most popular"
            ctas={proCtas}
          />
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 text-sm text-zinc-300">
          <div className="font-semibold text-white">Access</div>
          <p className="mt-2 text-zinc-400">
            Once you upgrade, premium lists unlock automatically on your account.
          </p>
        </div>
      </div>

      <Footer />
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
