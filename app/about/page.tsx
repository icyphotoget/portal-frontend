// app/about/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  const categories = [
    { id: 1, name: "PumpFun", slug: "pumpfun" },
    { id: 2, name: "BonkFun", slug: "bonkfun" },
    { id: 3, name: "Memecoins", slug: "memecoins" },
    { id: 4, name: "How To", slug: "how-to" },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Subtle glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="relative flex h-16 items-center border-b border-zinc-800">
            <div className="flex flex-1 items-center gap-3">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
                ← Home
              </Link>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-fullport.png"
                  alt="FullPort"
                  className="h-7 sm:h-8 md:h-9 object-contain drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
                  draggable={false}
                />
              </Link>
            </div>

            <div className="flex flex-1 items-center justify-end">
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[680px] px-4 sm:px-6 py-16">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">
          About FullPort
        </h1>

        {/* Intro */}
        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            <span className="font-bold italic">FullPort</span> is an independent, crypto-native publication focused on
            on-chain markets, memecoin rotations, and real-time narratives shaping digital assets.
          </p>

          <p className="text-white/90">
            We’re built for traders, builders, and CT-native readers who value speed, context, and data-backed insight.
            Our goal is simple: highlight what matters, when it matters.
          </p>

          <p className="text-white/90">
            Got a tip or correction?{" "}
            <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline transition">
              Reach out here
            </Link>
            .
          </p>
        </div>

        {/* Team */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">FullPort Labs staff</h2>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/90 leading-relaxed">
              FullPort is built by a small, crypto-native team of editors, analysts, and engineers operating under the
              FullPort Labs banner, with a focus on high-signal coverage and transparent editorial standards.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Editorial (CT-native)",
                  desc: "Breaking moves, narratives, and fast context — clearly separating reporting from opinion.",
                },
                {
                  title: "On-chain & Research",
                  desc: "Wallet flows, liquidity, supply dynamics, and market structure analysis.",
                },
                {
                  title: "Product & Engineering",
                  desc: "Performance, UX, and reliability — fast pages and clean reads.",
                },
                {
                  title: "Community & Tips",
                  desc: "Reader feedback, corrections, and secure communication.",
                },
              ].map((x) => (
                <div key={x.title} className="rounded-2xl border border-zinc-800 bg-black/20 p-4">
                  <div className="text-sm font-extrabold tracking-tight text-white">{x.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">What we cover</h2>

          <div className="space-y-4">
            {[
              {
                title: "Market moves",
                bullets: ["Price & volume spikes", "Listings & delistings", "Catalysts and fallout"],
              },
              {
                title: "Memecoins",
                bullets: ["Launches & rotations", "Liquidity behavior", "Rug & risk signals"],
              },
              {
                title: "On-chain analysis",
                bullets: ["Whale activity", "Supply changes", "DEX pool dynamics"],
              },
              {
                title: "How-to & safety",
                bullets: ["Wallet hygiene", "Scam avoidance", "Operational security basics"],
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6"
              >
                <h3 className="text-xl font-black">{s.title}</h3>
                <ul className="mt-3 space-y-2 text-white/85">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 text-cyan-400">•</span>
                      <span className="text-sm sm:text-base">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial note */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Editorial note</h2>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/90 leading-relaxed">
              We aim to be accurate first, fast second. We link primary sources when possible, label uncertainty, and
              update stories as new information emerges.
            </p>

            <p className="mt-6 text-xs text-zinc-500">
              Not financial advice. Do your own research.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Get in Touch</h3>
          <p className="text-zinc-400 mb-6">
            Tips, feedback, corrections, or partnerships — reach us here.
          </p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/tip-us"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition"
            >
              Send a Tip
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
