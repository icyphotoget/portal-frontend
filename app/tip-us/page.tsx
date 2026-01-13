// app/tip-us/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";
import CopyEmailButton from "@/app/components/CopyEmailButton";

export default function TipUsPage() {
  const categories = [
    { id: 1, name: "PumpFun", slug: "pumpfun" },
    { id: 2, name: "BonkFun", slug: "bonkfun" },
    { id: 3, name: "Memecoins", slug: "memecoins" },
    { id: 4, name: "How To", slug: "how-to" },
  ];

  const email = "tips@fullportlabs.com";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="relative flex h-16 items-center border-b border-zinc-800">
            <div className="flex flex-1">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
                ← Home
              </Link>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-fullport.png" alt="FullPort" className="h-8" />
              </Link>
            </div>
            <div className="flex flex-1 justify-end">
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[680px] px-4 sm:px-6 py-16">
        <h1 className="text-5xl sm:text-6xl font-black mb-8">Tip Us</h1>

        <p className="text-lg text-white/90 mb-8">
          Have information we should look into? We review credible tips related to markets, tokens,
          on-chain activity, security incidents, and emerging narratives.
        </p>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 mb-10">
          <div className="text-sm text-zinc-400 mb-2">Secure email</div>
          <a
            href={`mailto:${email}`}
            className="text-2xl font-black text-cyan-300 underline break-all"
          >
            {email}
          </a>

          <div className="mt-5 flex gap-3 flex-wrap">
            <a
              href={`mailto:${email}`}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black"
            >
              Send tip
            </a>
            <CopyEmailButton email={email} />
          </div>
        </div>

        <section className="space-y-4 mb-12">
          {[
            {
              title: "What makes a good tip",
              bullets: [
                "Specific details (what, when, where)",
                "Token / chain / contract address",
                "Screenshots, tx hashes, or links",
              ],
            },
            {
              title: "What we don’t accept",
              bullets: [
                "Paid promotion requests",
                "Unverifiable rumors with no data",
                "Marketing decks or mass outreach",
              ],
            },
            {
              title: "Anonymity",
              bullets: [
                "You don’t need to identify yourself",
                "We never publish private info without consent",
              ],
            },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
              <h3 className="text-xl font-black">{s.title}</h3>
              <ul className="mt-3 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <Footer />
    </main>
  );
}
