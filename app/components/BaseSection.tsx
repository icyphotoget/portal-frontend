import type { Article } from "@/app/lib/strapi";
import PumpfunSection from "@/app/components/PumpfunSection";

export default function BaseSection({ articles }: { articles: Article[] }) {
  return (
    <PumpfunSection
      label="BASE"
      kicker="BASE"
      seeAllHref="/news?category=base"
      categorySlug="base"
      bg="#E8E2FF"
      takeItems={4}
    />
  );
}
