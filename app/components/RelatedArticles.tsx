// app/components/RelatedArticles.tsx
import Link from "next/link";

type RelatedArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage?: any;
  publishedAt: string | null;
};

function absolutizeStrapiUrl(maybeRelativeUrl: string | null | undefined) {
  if (!maybeRelativeUrl) return null;
  if (maybeRelativeUrl.startsWith("http")) return maybeRelativeUrl;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  return base ? `${base}${maybeRelativeUrl}` : maybeRelativeUrl;
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;
  if (Array.isArray(media)) return pickMediaUrl(media[0]);
  
  if (typeof media.url === "string") return absolutizeStrapiUrl(media.url);
  
  const v4 = media?.data?.attributes?.url;
  if (typeof v4 === "string") return absolutizeStrapiUrl(v4);
  
  const v4arr = media?.data?.[0]?.attributes?.url;
  if (typeof v4arr === "string") return absolutizeStrapiUrl(v4arr);
  
  return null;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-zinc-800">
      <h2 className="text-2xl font-black tracking-tight mb-8">Related</h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => {
          const coverUrl = pickMediaUrl(article.coverImage);
          
          return (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group"
            >
              <article className="h-full rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden transition hover:border-zinc-700">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={article.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2 text-xs text-zinc-500">
                    {formatDate(article.publishedAt)}
                  </div>

                  <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}