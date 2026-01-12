// app/news/[slug]/layout.tsx
import TopNav from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import { fetchCategories } from "@/app/lib/strapi";

export default async function NewsSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const categories = baseUrl ? await fetchCategories(baseUrl) : [];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <TopNav categories={categories} />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
