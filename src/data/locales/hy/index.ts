import type { LocaleContent } from "@/data/types";
import { ui } from "./ui";
import { pages } from "./pages";
import { categories, historyPeriods, timeline } from "./history";
import { literaryPeriods, writers } from "./writers";
import { workGenres, works } from "./works";
import { cuisineTypes } from "./cuisine";
import { historyArticles } from "./articles/history";
import { writerArticles } from "./articles/writers";
import { workArticles } from "./articles/works";
import { cuisineArticles } from "./articles/cuisine";

export const hy: LocaleContent = {
  ui,
  pages,
  categories,
  timeline,
  historyPeriods,
  literaryPeriods,
  workGenres,
  cuisineTypes,
  writers,
  works,
  articles: [...historyArticles, ...writerArticles, ...workArticles, ...cuisineArticles],
};
