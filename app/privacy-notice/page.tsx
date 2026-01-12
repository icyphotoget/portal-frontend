// app/privacy-notice/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function PrivacyNoticePage() {
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
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
          Privacy Notice
        </h1>

        <div className="text-sm text-zinc-400 mb-10">
          Last updated: Jan 2026
        </div>

        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            This Privacy Notice explains how <span className="font-bold italic">FullPort</span> (“we”, “us”, “our”)
            collects, uses, and shares information when you use our website and services.
          </p>
          <p className="text-white/90">
            If you have questions, contact us at{" "}
            <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline transition">
              our contact page
            </Link>
            .
          </p>
        </div>

        {/* What we collect */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Information We Collect</h2>

          <div className="space-y-4">
            <Card
              title="Information you provide"
              body="For example: messages you send via Contact/Tip pages, login details (if applicable), and any content you submit."
            />
            <Card
              title="Usage data"
              body="Pages viewed, approximate location (derived from IP), device/browser info, and interactions. We use this mainly to improve performance and content."
            />
            <Card
              title="Cookies and similar technologies"
              body="We use necessary cookies to run the site and optional analytics cookies (only if you consent) to understand traffic trends."
            />
          </div>
        </section>

        {/* How we use it */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">How We Use Information</h2>
          <ul className="space-y-3 text-lg">
            <Bullet>Operate and secure the website, including fraud/spam prevention.</Bullet>
            <Bullet>Improve content, UX, and performance.</Bullet>
            <Bullet>Respond to messages and support requests.</Bullet>
            <Bullet>Measure traffic and site usage (only with analytics consent).</Bullet>
          </ul>
        </section>

        {/* Sharing */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">How We Share Information</h2>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/85 leading-relaxed">
              We don’t sell your personal data. We may share information with service providers that help us run the site
              (hosting, analytics, security) and when required by law.
            </p>

            <div className="mt-4 space-y-2 text-white/80">
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  Hosting/Infrastructure (e.g. Vercel) to deliver the site.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  Analytics (Vercel Analytics) — only if you opt in via cookie consent.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  Legal compliance or to protect rights, safety, and security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Your choices */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Your Choices</h2>

          <ul className="space-y-3 text-lg">
            <Bullet>
              Manage cookies anytime via{" "}
              <Link href="/cookie-policy" className="text-cyan-400 hover:text-cyan-300 underline transition">
                Cookie Policy
              </Link>{" "}
              or the “Manage Privacy Settings” link in the footer.
            </Bullet>
            <Bullet>
              You can request access, correction, or deletion of personal information where applicable.
            </Bullet>
          </ul>
        </section>

        {/* Data retention */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Data Retention</h2>
          <p className="text-white/90 text-lg leading-relaxed">
            We keep information only as long as necessary for the purposes described above, unless a longer retention
            period is required by law.
          </p>
        </section>

        {/* Contact CTA */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Questions?</h3>
          <p className="text-zinc-400 mb-6">
            If you have privacy questions or requests, contact us.
          </p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/cookie-policy"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
        <div>
          <h3 className="text-xl font-black">{title}</h3>
          <p className="mt-2 text-white/80 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
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
