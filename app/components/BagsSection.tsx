import type { Article } from "@/app/lib/strapi";
import PumpfunSection from "@/app/components/PumpfunSection";

export default function BagsSection({ articles }: { articles: Article[] }) {
  return (
    <PumpfunSection
      label="BAGS"
      kicker="BAGS"
      seeAllHref="/news?category=bags"
      categorySlug="bags"
      bg="#D8F7FF"
      takeItems={4}
    />
  );
}
