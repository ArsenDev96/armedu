import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article/ArticleLayout";
import { getArticle, getArticlesByCategory, getRelatedArticles } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticlesByCategory("history").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("history", slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: article.href },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: article.href,
      publishedTime: article.updated,
      authors: [article.author],
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: article.title }],
    },
  };
}

export default async function HistoryArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle("history", slug);
  if (!article) notFound();

  return (
    <ArticleLayout
      article={article}
      related={getRelatedArticles(article)}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Armenian History", href: "/history" },
        { label: article.title },
      ]}
    />
  );
}
