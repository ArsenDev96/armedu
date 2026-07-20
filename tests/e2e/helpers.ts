import { expect, type Page } from "@playwright/test";
import { getLocaleBundle } from "@/data";
import { LOCALE_META, SUPPORTED_LOCALES, type Locale } from "@/data/types";
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

/**
 * Opens the desktop language menu.
 *
 * Waits on the link for the edition already being read: it is the one entry
 * guaranteed to be in the menu whatever the current locale is.
 */
export async function openLanguageMenu(page: Page, from: Locale) {
  const dict = ui(from);
  const current = page.getByRole("link", {
    name: dict.header.currentLanguage.replace("{language}", LOCALE_META[from].label),
  });
  await openHeaderPanel(page, dict.header.selectLanguage, current);
}

/**
 * Clicks a header toggle and waits for what it reveals.
 *
 * The header is server-rendered, so its buttons are clickable a moment before
 * React hydrates and attaches the handler. A click landing in that window is
 * simply dropped: nothing opens, and the test waits out its timeout against
 * markup that will never change. Retrying the click until the panel actually
 * appears closes that window. Once hydrated the first attempt succeeds, so this
 * costs nothing on a warm server — it only pays off on a cold one.
 */
async function openHeaderPanel(page: Page, toggleName: string, panel: ReturnType<Page["getByRole"]>) {
  const toggle = page.getByRole("button", { name: toggleName });

  await expect(async () => {
    await toggle.click();
    await expect(panel).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

/** Opens the mobile navigation drawer and returns it. */
export async function openMobileMenu(page: Page, locale: Locale) {
  const dict = ui(locale);
  const menu = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  await openHeaderPanel(page, dict.nav.toggleMenu, menu);
  return menu;
}

/** Opens the header search field and returns it. */
export async function openHeaderSearch(page: Page, locale: Locale) {
  const dict = ui(locale);
  const field = page.getByRole("searchbox", { name: dict.header.searchInputLabel });
  await openHeaderPanel(page, dict.header.searchButtonLabel, field);
  return field;
}
