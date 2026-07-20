import type { Page } from "@playwright/test";
import { getLocaleBundle } from "@/data";
import { SUPPORTED_LOCALES, type Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";

/**
 * Tests read their selectors from the same dictionaries the app renders.
 *
 * Hard-coding Armenian strings in the specs would mean every wording fix breaks
 * a test for no reason — and worse, a test could keep passing against a string
 * nobody ships any more. Importing the bundle keeps the two in lockstep.
 */
export function ui(locale: Locale): UiDictionary {
  return getLocaleBundle(locale).ui;
}

export function bundle(locale: Locale) {
  return getLocaleBundle(locale);
}

export const LOCALES = SUPPORTED_LOCALES;

/** Article title in a given edition, for text assertions. */
export function articleTitle(locale: Locale, slug: string): string {
  const article = getLocaleBundle(locale).articles.find((entry) => entry.slug === slug);
  if (!article) throw new Error(`No "${slug}" article in the "${locale}" bundle.`);
  return article.title;
}

/** True when an article is published in that edition. */
export function hasArticle(locale: Locale, slug: string): boolean {
  return getLocaleBundle(locale).articles.some((entry) => entry.slug === slug);
}

/** Cards are the only `article` role inside a results grid. */
export function cards(page: Page) {
  return page.getByRole("article");
}

/** Opens the desktop language menu and returns the link for a target locale. */
export async function openLanguageMenu(page: Page, from: Locale) {
  await page.getByRole("button", { name: ui(from).header.selectLanguage }).click();
}
