// app/ethics/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function EthicsPage() {
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

            {/* Right (only hamburger/menu) */}
            <div className="flex flex-1 items-center justify-end">
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[680px] px-4 sm:px-6 py-16">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">Ethics Statement</h1>

        <div className="text-sm text-zinc-400 mb-10">Last updated: Jan 2026</div>

        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            FullPort’s mission is to publish accurate, independent, and useful crypto journalism. This page explains
            how we approach corrections, conflicts of interest, sources, and transparency.
          </p>
        </div>

        <Section title="Independence & Conflicts of Interest">
          <ul className="space-y-3 text-lg">
            <Bullet>We aim to separate editorial decision-making from business interests.</Bullet>
            <Bullet>
              If we cover a project where an author has a material interest, we disclose it clearly in the article.
            </Bullet>
            <Bullet>Paid promotions, sponsored content, or affiliate relationships (if used) must be labeled.</Bullet>
          </ul>
        </Section>

        <Section title="Accuracy, Sources & Verification">
          <ul className="space-y-3 text-lg">
            <Bullet>We verify claims with primary sources where possible (docs, on-chain data, direct statements).</Bullet>
            <Bullet>We attribute data and quotes to sources and avoid misleading framing.</Bullet>
            <Bullet>For breaking news, we may publish with limited info and update as facts are confirmed.</Bullet>
          </ul>
        </Section>

        <Section title="Corrections Policy">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/85 leading-relaxed">
              If we make a material error, we correct it as quickly as possible and note what changed. To request a
              correction, contact us with the article link and supporting evidence.
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
              >
                Request a correction
              </Link>
              <Link
                href="/tip-us"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition"
              >
                Send a tip
              </Link>
            </div>
          </div>
        </Section>

        <Section title="Anonymous Sources & Tips">
          <ul className="space-y-3 text-lg">
            <Bullet>We may use anonymous sources when information is in the public interest and can be verified.</Bullet>
            <Bullet>We evaluate credibility, motivations, and corroboration before publishing.</Bullet>
            <Bullet>
              We avoid publishing private personal data and follow our{" "}
              <Link href="/community-guidelines" className="text-cyan-400 hover:text-cyan-300 underline transition">
                Community Guidelines
              </Link>
              .
            </Bullet>
          </ul>
        </Section>

        <Section title="Market Manipulation & Shilling">
          <ul className="space-y-3 text-lg">
            <Bullet>We do not publish “guaranteed profit” claims or coordinated pump narratives.</Bullet>
            <Bullet>We avoid language intended to pressure readers (“ape now”, “easy 10x”).</Bullet>
            <Bullet>When covering memecoins, we try to describe risk clearly and avoid hype as a substitute for facts.</Bullet>
          </ul>
        </Section>

        <Section title="Feedback">
          <p className="text-white/90 text-lg leading-relaxed">
            We welcome feedback about our coverage and standards. Use the contact page to reach the team.
          </p>
        </Section>

        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Get in touch</h3>
          <p className="text-zinc-400 mb-6">Questions about ethics, conflicts, or corrections? Message us.</p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition"
            >
              About FullPort
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-black tracking-tight mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-2">
      <span className="text-cyan-400">•</span>
      <span className="text-white/90">{children}</span>
    </li>
  );
}
