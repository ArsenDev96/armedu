import type { LocaleContent } from "@/data/types";
import { categories, historyPeriods, timeline } from "./history";
import { literaryPeriods, writers } from "./writers";
import { works } from "./works";
import { tigranTheGreat } from "./articles/tigran-the-great";
import { historyArticles } from "./articles/history";
import { writerArticles } from "./articles/writers";
import { workArticles } from "./articles/works";

export const en: LocaleContent = {
  categories,
  timeline,
  historyPeriods,
  literaryPeriods,
  writers,
  works,
  articles: [tigranTheGreat, ...historyArticles, ...writerArticles, ...workArticles],
};
