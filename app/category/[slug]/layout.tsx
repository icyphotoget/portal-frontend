// app/category/[slug]/layout.tsx
import TopNav from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import { fetchCategories } from "@/app/lib/strapi";

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const categories = baseUrl ? await fetchCategories(baseUrl) : [];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Global navigation */}
      <TopNav categories={categories} />

      {/* Page content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
