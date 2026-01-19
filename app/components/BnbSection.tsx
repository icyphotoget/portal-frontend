import type { Article } from "@/app/lib/strapi";
import PumpfunSection from "@/app/components/PumpfunSection";

export default function BnbSection({ articles }: { articles: Article[] }) {
  return (
    <PumpfunSection
      label="BNB"
      kicker="BNB CHAIN"
      seeAllHref="/news?category=bnb"
      categorySlug="bnb"
      bg="#FFF1D6"
      takeItems={4}
    />
  );
}
