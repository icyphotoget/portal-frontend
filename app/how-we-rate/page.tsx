// app/how-we-rate/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function HowWeRatePage() {
  const categories = [
    { id: 1, name: "PumpFun", slug: "pumpfun" },
    { id: 2, name: "BonkFun", slug: "bonkfun" },
    { id: 3, name: "Memecoins", slug: "memecoins" },
    { id: 4, name: "How To", slug: "how-to" },
  ];

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
              <Link href="/" className="text-sm text-zinc-400 hover:text-white">
                ← Home
              </Link>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                {/* eslint-disable-next-line */}
                <img src="/logo-fullport.png" className="h-8" />
              </Link>
            </div>
            <div className="flex flex-1 justify-end">
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[720px] px-4 py-16">
        <h1 className="text-5xl font-black mb-8">How We Rate & Review Products</h1>

        <p className="text-lg text-white/90 mb-10">
          FullPort reviews crypto tools, platforms, and services with a focus on real-world usability,
          on-chain relevance, and risk awareness. We don’t sell ratings.
        </p>

        <section className="space-y-6">
          {[
            {
              title: "Our review principles",
              bullets: [
                "Hands-on testing where possible",
                "Crypto-native use cases first",
                "Clear separation of facts vs opinion",
              ],
            },
            {
              title: "What we evaluate",
              bullets: [
                "Security & custody model",
                "Fees, spreads, and execution",
                "UX, reliability, and transparency",
                "On-chain integrations",
              ],
            },
            {
              title: "Scoring",
              bullets: [
                "Scores reflect relative strengths within a category",
                "No product is ranked ‘perfect’",
                "Ratings may change as products evolve",
              ],
            },
            {
              title: "Affiliate & partnerships",
              bullets: [
                "Some links may be affiliate links",
                "Affiliates do not affect rankings",
                "Sponsored content is clearly labeled",
              ],
            },
            {
              title: "What we don’t do",
              bullets: [
                "Pay-for-play reviews",
                "Guaranteed coverage for partners",
                "Investment recommendations",
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

        <p className="mt-12 text-sm text-zinc-400">
          Reviews are for informational purposes only and do not constitute financial advice.
        </p>
      </div>

      <Footer />
    </main>
  );
}
