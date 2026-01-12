// app/about/page.tsx
import Link from "next/link";
import MobileMenu from "@/app/components/MobileMenu";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  // You can fetch categories from your API if needed for the mobile menu
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
        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">
          About FullPort
        </h1>

        {/* Intro Paragraph */}
        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            <span className="font-bold italic">FullPort</span> is about cryptocurrency and how it shapes our financial
            future. Founded in 2025, we offer our audience everything from breaking news to reviews to award-winning
            features and investigations, on our site, in video, and in podcasts.
          </p>

          <p className="text-white/90">
            Our original editorial insight was that cryptocurrency had migrated from the far fringes of the culture to
            the absolute center as blockchain technology created a new generation of digital investors. Now, we live in
            a dazzling world of decentralized finance that has ushered in revolutions in trading, payments, and digital
            ownership. The future is arriving faster than ever.
          </p>

          <p className="text-white/90">
            Got a tip for us?{" "}
            <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline transition">
              Here's how to send it securely
            </Link>
            .
          </p>
        </div>

        {/* Leadership Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">FullPort team</h2>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl p-6">
            <p className="text-white/90 leading-relaxed">
              FullPort is built by a small, independent team of editors, analysts, and builders. We focus on speed,
              signal over noise, and practical coverage of on-chain markets.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Editorial", desc: "News, features, investigations, and standards." },
                { title: "Research", desc: "On-chain data, market notes, and deep dives." },
                { title: "Product", desc: "Site experience, performance, and reliability." },
                { title: "Community", desc: "Tips, feedback, and reader support." },
              ].map((x) => (
                <div key={x.title} className="rounded-2xl border border-zinc-800 bg-black/20 p-4">
                  <div className="text-sm font-extrabold tracking-tight text-white">{x.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{x.desc}</div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-zinc-400">
              Want to reach the team?{" "}
              <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline transition">
                Contact us here
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Coverage Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">What we cover</h2>

          <div className="space-y-4">
            {[
              { title: "Breaking news", bullets: ["Major market moves", "Protocol updates", "Security incidents"] },
              { title: "On-chain & memecoins", bullets: ["Trends & rotations", "Launches & tokenomics", "Risk signals"] },
              { title: "How-to guides", bullets: ["Wallet safety", "DeFi basics", "Best practices"] },
              { title: "Features", bullets: ["Interviews", "Long reads", "Investigations (when warranted)"] },
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
              We label opinion vs. reporting, correct mistakes fast, and prioritize sources you can verify. If something
              looks off, we want to hear about it.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-black hover:bg-zinc-200 transition"
              >
                Send feedback
              </Link>
              <Link
                href="/tip-us"
                className="inline-flex items-center rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-zinc-800 transition"
              >
                Send a tip
              </Link>
            </div>
          </div>
        </section>

        {/* Crypto Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Crypto</h2>

          <ul className="space-y-3 text-lg">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Deputy Editor, DeFi:{" "}
                <Link href="/author/alex-morgan" className="text-white hover:text-cyan-400 underline transition">
                  Alex Morgan
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Senior News Editor:{" "}
                <Link href="/author/emily-rodriguez" className="text-white hover:text-cyan-400 underline transition">
                  Emily Rodriguez
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Senior Editors:{" "}
                <Link href="/author/tom-wilson" className="text-white hover:text-cyan-400 underline transition">
                  Tom Wilson
                </Link>
                ,{" "}
                <Link href="/author/lisa-anderson" className="text-white hover:text-cyan-400 underline transition">
                  Lisa Anderson
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Deputy Editor, Markets:{" "}
                <Link href="/author/chris-taylor" className="text-white hover:text-cyan-400 underline transition">
                  Chris Taylor
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                News Editor:{" "}
                <Link href="/author/maria-garcia" className="text-white hover:text-cyan-400 underline transition">
                  Maria Garcia
                </Link>
              </span>
            </li>
          </ul>
        </section>

        {/* Memecoins Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Memecoins</h2>

          <ul className="space-y-3 text-lg">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Deputy Editor:{" "}
                <Link href="/author/kevin-park" className="text-white hover:text-cyan-400 underline transition">
                  Kevin Park
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Senior Editor:{" "}
                <Link href="/author/jessica-brown" className="text-white hover:text-cyan-400 underline transition">
                  Jessica Brown
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                News Editor:{" "}
                <Link href="/author/ryan-davis" className="text-white hover:text-cyan-400 underline transition">
                  Ryan Davis
                </Link>
              </span>
            </li>
          </ul>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-6">Features</h2>

          <ul className="space-y-3 text-lg">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Deputy Editor:{" "}
                <Link href="/author/nicole-white" className="text-white hover:text-cyan-400 underline transition">
                  Nicole White
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Senior Editor:{" "}
                <Link href="/author/mark-thompson" className="text-white hover:text-cyan-400 underline transition">
                  Mark Thompson
                </Link>
              </span>
            </li>
          </ul>
        </section>

        {/* Contact CTA */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
          <h3 className="text-2xl font-black mb-4">Get in Touch</h3>
          <p className="text-zinc-400 mb-6">Have questions, tips, or feedback? We'd love to hear from you.</p>
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

      {/* Footer */}
      <Footer />
    </main>
  );
}
