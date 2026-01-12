// app/cookie-policy/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function CookiePolicyPage() {
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

            {/* Right (only hamburger/menu) */}
            <div className="flex flex-1 items-center justify-end">
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[680px] px-4 sm:px-6 py-16">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
          Cookie Policy
        </h1>

        <div className="text-sm text-zinc-400 mb-10">Last updated: Jan 2026</div>

        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            This Cookie Policy explains what cookies are, how FullPort uses them, and how you can control them.
            For more details about personal data, see our{" "}
            <Link href="/privacy-notice" className="text-cyan-400 hover:text-cyan-300 underline transition">
              Privacy Notice
            </Link>
            .
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">What Are Cookies?</h2>
          <p className="text-white/90 text-lg leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help the site function,
            remember preferences, and (if you allow) measure usage.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Cookies We Use</h2>

          <div className="space-y-4">
            <CookieCard
              title="Necessary cookies"
              desc="These are required for core functionality like security and basic site operations. They can’t be disabled."
              chips={["Required"]}
            />
            <CookieCard
              title="Preferences cookies"
              desc="These remember choices such as UI settings. Optional."
              chips={["Optional"]}
            />
            <CookieCard
              title="Analytics cookies (Vercel Analytics)"
              desc="If you consent, we use analytics to understand traffic and improve performance."
              chips={["Optional", "Consent-based"]}
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">How To Manage Cookies</h2>

          <ul className="space-y-3 text-lg">
            <Bullet>Use the “Manage Privacy Settings” link in the footer to change consent anytime.</Bullet>
            <Bullet>You can also clear cookies in your browser settings.</Bullet>
          </ul>
        </section>

        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Need help?</h3>
          <p className="text-zinc-400 mb-6">Questions about cookies or privacy? Reach out.</p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy-notice"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition"
            >
              Privacy Notice
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function CookieCard({
  title,
  desc,
  chips,
}: {
  title: string;
  desc: string;
  chips: string[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black">{title}</h3>
          <p className="mt-2 text-white/80 leading-relaxed">{desc}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-200"
            >
              {c}
            </span>
          ))}
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
