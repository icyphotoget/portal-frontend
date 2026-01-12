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
              <Link
                href="/"
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                ← Home
              </Link>
            </div>

            {/* Center (LOGO) */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="flex items-center justify-center">
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
        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">
          About FullPort
        </h1>

        {/* Intro Paragraph */}
        <div className="text-lg leading-relaxed space-y-6 mb-12">
          <p className="text-white/90">
            <span className="font-bold italic">FullPort</span> is about cryptocurrency and how it shapes our financial future. Founded in 2025, we offer our audience everything from breaking news to reviews to award-winning features and investigations, on our site, in video, and in podcasts.
          </p>

          <p className="text-white/90">
            Our original editorial insight was that cryptocurrency had migrated from the far fringes of the culture to the absolute center as blockchain technology created a new generation of digital investors. Now, we live in a dazzling world of decentralized finance that has ushered in revolutions in trading, payments, and digital ownership. The future is arriving faster than ever.
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
          <h2 className="text-3xl font-black tracking-tight mb-6">FullPort Leadership</h2>
          
          <ul className="space-y-3 text-lg">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Editor-in-Chief:{" "}
                <Link href="/author/john-doe" className="text-white hover:text-cyan-400 underline transition">
                  John Doe
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Executive Editor:{" "}
                <Link href="/author/jane-smith" className="text-white hover:text-cyan-400 underline transition">
                  Jane Smith
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Editor-at-Large:{" "}
                <Link href="/author/mike-johnson" className="text-white hover:text-cyan-400 underline transition">
                  Mike Johnson
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Executive Creative Director:{" "}
                <Link href="/author/sarah-lee" className="text-white hover:text-cyan-400 underline transition">
                  Sarah Lee
                </Link>
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                Managing Editor:{" "}
                <Link href="/author/david-chen" className="text-white hover:text-cyan-400 underline transition">
                  David Chen
                </Link>
              </span>
            </li>
          </ul>
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
          <p className="text-zinc-400 mb-6">
            Have questions, tips, or feedback? We'd love to hear from you.
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

      {/* Footer */}
      <Footer />
    </main>
  );
}