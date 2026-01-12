// app/community-guidelines/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function CommunityGuidelinesPage() {
  // same approach as /about (static categories for MobileMenu)
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
            {/* Left */}
            <div className="flex flex-1 items-center gap-3">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
                ← Home
              </Link>
            </div>

            {/* Center (LOGO) */}
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

            {/* Right */}
            <div className="flex flex-1 items-center justify-end gap-2">
              <Link
                href="/login"
                className="rounded-full bg-zinc-100 px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-white transition"
              >
                Log in
              </Link>
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[680px] px-4 sm:px-6 py-16">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
          Community Guidelines
        </h1>

        {/* Intro */}
        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            FullPort is a place for crypto-native discussion — fast, opinionated, and grounded in facts.
            These guidelines help keep conversations useful, safe, and worth reading.
          </p>

          <p className="text-white/90">
            By commenting, submitting tips, or participating in community features, you agree to follow
            these standards. We may remove content or restrict access when needed to protect the community.
          </p>
        </div>

        {/* Core Rules */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">The Basics</h2>

          <div className="space-y-4">
            {[
              {
                title: "Be respectful",
                body:
                  "Attack ideas, not people. No harassment, threats, or hate. Don’t dogpile or bait others into conflict.",
              },
              {
                title: "No scams or manipulation",
                body:
                  "No phishing, impersonation, fake giveaways, or attempts to mislead users. No coordinated shilling, brigading, or market manipulation schemes.",
              },
              {
                title: "Keep it on-topic",
                body:
                  "Stay relevant to the discussion. Low-effort spam, repetitive links, and unrelated promotion will be removed.",
              },
              {
                title: "No illegal content",
                body:
                  "Don’t share instructions for wrongdoing or content that facilitates illegal activity. Respect local laws and platform policies.",
              },
              {
                title: "Protect privacy",
                body:
                  "Do not post private personal info (doxxing) — addresses, phone numbers, private messages, or non-public identities. If it’s not yours to share, don’t.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                  <div>
                    <h3 className="text-xl font-black">{item.title}</h3>
                    <p className="mt-2 text-white/80 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Standards */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Content Standards</h2>

          <ul className="space-y-3 text-lg">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-white/90">
                <span className="font-bold">No hate or harassment:</span> slurs, dehumanization, threats,
                or targeted harassment are removed immediately.
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-white/90">
                <span className="font-bold">No spam:</span> repeated promos, referral links, “join my group”
                posts, or copy-paste replies.
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-white/90">
                <span className="font-bold">No misinformation campaigns:</span> you can be wrong — but don’t
                fabricate “proof”, screenshots, or quotes to mislead.
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-white/90">
                <span className="font-bold">No explicit content:</span> pornographic content or sexually explicit
                material is not allowed.
              </span>
            </li>
          </ul>
        </section>

        {/* Financial Disclaimer */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Financial Safety</h2>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/85 leading-relaxed">
              FullPort is not a broker or financial advisor. Community posts can be biased or wrong.
              Always do your own research, verify sources, and manage risk.
            </p>

            <div className="mt-4 space-y-2 text-white/80">
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  If you’re promoting a token or project, disclose your position (bags, team role, paid promo).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  Don’t post “guaranteed profits”, fake screenshots, or pressure tactics (“ape now or regret”).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enforcement */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Enforcement</h2>

          <div className="text-lg leading-relaxed space-y-4 text-white/90">
            <p>
              We may remove content, limit visibility, lock threads, or restrict accounts depending on severity.
              Repeat or severe violations can lead to permanent bans.
            </p>
            <p>
              We also reserve the right to take action against behavior that undermines the community even if it
              isn’t listed word-for-word above (e.g. coordinated harassment or scam attempts).
            </p>
          </div>
        </section>

        {/* Report / Contact */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Report an Issue</h3>
          <p className="text-zinc-400 mb-6">
            See spam, scams, impersonation, or harassment? Send us details and links — we’ll review.
          </p>
          <div className="flex flex-wrap gap-3">
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

          <div className="mt-6 text-xs text-zinc-500 leading-relaxed">
            Last updated: Jan 2026 (update this text whenever you change the policy).
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
