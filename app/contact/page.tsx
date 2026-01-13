// app/contact/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";
import CopyEmailButton from "@/app/components/CopyEmailButton";

export default function ContactPage() {
  const categories = [
    { id: 1, name: "PumpFun", slug: "pumpfun" },
    { id: 2, name: "BonkFun", slug: "bonkfun" },
    { id: 3, name: "Memecoins", slug: "memecoins" },
    { id: 4, name: "How To", slug: "how-to" },
  ];

  const email = "contact@fullportlabs.com";

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
            <div className="flex flex-1 items-center justify-end">
              <MobileMenu categories={categories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-[680px] px-4 sm:px-6 py-16">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">Contact</h1>

        <div className="space-y-6 text-lg leading-relaxed mb-10">
          <p className="text-white/90">
            For general questions, corrections, partnerships, or press inquiries, email us at:
          </p>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <div className="text-sm text-zinc-400 mb-2">Email</div>

            <a
              href={`mailto:${email}`}
              className="text-2xl sm:text-3xl font-black tracking-tight text-cyan-300 hover:text-cyan-200 underline transition break-all"
            >
              {email}
            </a>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-black hover:bg-zinc-200 transition"
              >
                Email us
              </a>

              <CopyEmailButton email={email} />
            </div>

            <p className="mt-4 text-sm text-zinc-400">
              For urgent security issues, include <span className="text-white/90 font-semibold">“SECURITY”</span> in the
              subject line.
            </p>
          </div>
        </div>

        {/* What to include */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">What to include</h2>

          <div className="space-y-4">
            {[
              {
                title: "Corrections",
                bullets: ["Link to the story", "What needs updating", "Source or proof if available"],
              },
              {
                title: "Tips / leads",
                bullets: ["What happened", "Token / chain / contract address (if relevant)", "Timing, links, screenshots"],
              },
              {
                title: "Partnerships / press",
                bullets: ["What you’re proposing", "Budget / timeline", "Links and details"],
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

        {/* Quick links */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Quick links</h3>
          <p className="text-zinc-400 mb-6">Looking for something else?</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              About
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
