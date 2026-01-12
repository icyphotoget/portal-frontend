// app/terms/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function TermsPage() {
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
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
          Terms of Use
        </h1>

        <div className="text-sm text-zinc-400 mb-10">Last updated: Jan 2026</div>

        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            These Terms of Use govern your access to and use of <span className="font-bold italic">FullPort</span>.
            By using the site, you agree to these terms.
          </p>
          <p className="text-white/90">
            If you do not agree, please do not use the site. For privacy details, see{" "}
            <Link href="/privacy-notice" className="text-cyan-400 hover:text-cyan-300 underline transition">
              Privacy Notice
            </Link>
            .
          </p>
        </div>

        <Section title="1) Who we are">
          <p className="text-white/90">
            FullPort is a digital publication focused on cryptocurrency news, culture, and on-chain stories.
          </p>
        </Section>

        <Section title="2) Content and information">
          <ul className="space-y-3 text-lg">
            <Bullet>
              Content is provided for informational purposes only and does not constitute financial, investment, legal,
              or tax advice.
            </Bullet>
            <Bullet>
              Crypto assets are volatile. You are responsible for your own decisions and risk management.
            </Bullet>
            <Bullet>
              We may update or correct content at any time without notice.
            </Bullet>
          </ul>
        </Section>

        <Section title="3) User conduct">
          <ul className="space-y-3 text-lg">
            <Bullet>No harassment, hate, threats, or illegal content.</Bullet>
            <Bullet>No spam, scams, phishing, impersonation, or attempts to manipulate others.</Bullet>
            <Bullet>No interfering with site security, availability, or access controls.</Bullet>
            <Bullet>
              If you submit content (tips/messages), don’t include private info you don’t have the right to share.
            </Bullet>
          </ul>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/85 leading-relaxed">
              We may remove content or restrict access if we believe conduct violates these terms or harms the community.
            </p>
          </div>
        </Section>

        <Section title="4) Intellectual property">
          <p className="text-white/90 text-lg leading-relaxed">
            All site content (text, design, graphics, logos) is owned by FullPort or its licensors and is protected by
            intellectual property laws. You may not reproduce, distribute, or create derivative works without permission,
            except as allowed by law (e.g. fair use).
          </p>
        </Section>

        <Section title="5) Third-party links">
          <p className="text-white/90 text-lg leading-relaxed">
            We may link to third-party sites. We don’t control them and are not responsible for their content, policies,
            or practices.
          </p>
        </Section>

        <Section title="6) Disclaimers">
          <ul className="space-y-3 text-lg">
            <Bullet>The site is provided “as is” without warranties of any kind.</Bullet>
            <Bullet>We do not guarantee accuracy, availability, or uninterrupted access.</Bullet>
            <Bullet>To the fullest extent permitted by law, we disclaim liability for losses arising from use of the site.</Bullet>
          </ul>
        </Section>

        <Section title="7) Changes to these terms">
          <p className="text-white/90 text-lg leading-relaxed">
            We may update these terms. Continued use after changes means you accept the updated terms.
          </p>
        </Section>

        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Contact</h3>
          <p className="text-zinc-400 mb-6">Questions about these Terms? Reach out.</p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/community-guidelines"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition"
            >
              Community Guidelines
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
