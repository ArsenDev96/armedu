import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/history", "/writers", "/works", "/about", "/contact", "/privacy"];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const articles: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${site.url}${article.href}`,
    lastModified: new Date(article.updated),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...pages, ...articles];
}
