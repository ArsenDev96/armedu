import type { ArticleSummary } from "@/data/types";
import { ArticleCard } from "@/components/cards/ArticleCard";

export function RelatedArticles({
  articles,
  title = "Related articles",
}: {
  articles: ArticleSummary[];
  title?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="border-t border-line bg-paper-2 py-14 md:py-16">
      <div className="container-page">
        <h2 id="related-heading" className="mb-8 text-2xl text-ink md:text-[1.75rem]">
          {title}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
