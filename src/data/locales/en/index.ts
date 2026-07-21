import type { LocaleContent } from "@/data/types";
import { ui } from "./ui";
import { pages } from "./pages";
import { categories, historyPeriods, timeline } from "./history";
import { literaryPeriods, writers } from "./writers";
import { workGenres, works } from "./works";
import { historyArticles } from "./articles/history";
import { writerArticles } from "./articles/writers";
import { workArticles } from "./articles/works";

export const en: LocaleContent = {
  ui,
  pages,
  categories,
  timeline,
  historyPeriods,
  literaryPeriods,
  workGenres,
  writers,
  works,
  articles: [...historyArticles, ...writerArticles, ...workArticles],
};
