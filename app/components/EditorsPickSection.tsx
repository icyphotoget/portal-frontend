// app/components/EditorsPickSection.tsx
import Link from "next/link";

type Featured = {
  title: string;
  href: string;
  author: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
};

type Item = {
  id: number;
  title: string;
  href: string;
  author: string;
  date: string;
};

export default function EditorsPickSection(props: {
  label: string;
  seeAllHref: string;
  featured: Featured;
  items: Item[];
}) {
  const { label, seeAllHref, featured, items } = props;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-fuchsia-400" />
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-200">
            {label}
          </span>
        </div>

        <Link
          href={seeAllHref}
          className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-400 hover:text-cyan-300 transition"
        >
          See all
        </Link>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Featured */}
        <Link href={featured.href} className="group block">
          <article className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={featured.imageUrl}
                alt={featured.imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="p-5">
              <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-extrabold uppercase tracking-wider text-zinc-200">
                  Editor’s Pick
                </span>
                <span className="text-zinc-500">{featured.date}</span>
              </div>

              <h3 className="text-2xl font-extrabold leading-tight text-white group-hover:text-cyan-400 transition">
                {featured.title}
              </h3>

              <div className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                {featured.author}
              </div>
            </div>
          </article>
        </Link>

        {/* List */}
        <div className="rounded-2xl border border-zinc-800 bg-black/30">
          <div className="px-5 py-4 border-b border-zinc-800">
            <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-300">
              More picks
            </div>
          </div>

          <ul className="divide-y divide-zinc-800">
            {items.map((it) => (
              <li key={it.id}>
                <Link href={it.href} className="block p-5 hover:bg-white/5 transition">
                  <div className="text-xs text-zinc-500">{it.date}</div>
                  <div className="mt-1 text-base font-extrabold leading-snug text-white hover:text-cyan-400 transition">
                    {it.title}
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {it.author}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
