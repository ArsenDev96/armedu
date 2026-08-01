import { expect, test } from "@playwright/test";
import { LOCALES, ui } from "./helpers";

/**
 * Header fit.
 *
 * Six sections in Armenian is the widest the horizontal nav has ever had to be,
 * and it is wide enough that the row stopped fitting: below 1280px the labels
 * broke mid-phrase ("Հայոց / պատմություն") on every item at once. The nav now
 * appears at `xl` and the labels carry `whitespace-nowrap`, which turns that
 * failure from a silent one into two loud ones — a hidden nav, or a page that
 * scrolls sideways. Both are asserted here, so the next long label fails a test
 * instead of a layout.
 */

const WIDE = [1280, 1440, 1600];
const NARROW = [1024, 1152];

/** A wrapped inline element occupies more than one client rect. */
async function navLinkLineCounts(page: import("@playwright/test").Page, label: string) {
  return page.evaluate((name) => {
    const nav = document.querySelector<HTMLElement>(`nav[aria-label="${name}"]`);
    return [...(nav?.querySelectorAll("ul > li > span > a") ?? [])].map(
      (link) => link.getClientRects().length,
    );
  }, label);
}

const overflow = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

for (const width of WIDE) {
  test(`[${width}px] the horizontal nav fits on one line and does not overflow`, async ({
    page,
  }) => {
    // Armenian is the longest of the three editions; if it fits, they all do.
    const dict = ui("hy");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/hy");

    const nav = page.getByRole("navigation", { name: dict.nav.mainLabel });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: dict.nav.cuisine, exact: true })).toBeVisible();

    const lines = await navLinkLineCounts(page, dict.nav.mainLabel);
    expect(lines.length).toBe(6);
    expect(lines, "a nav label wrapped onto a second line").toEqual(lines.map(() => 1));

    expect(await overflow(page), "the page scrolls sideways").toBeLessThanOrEqual(1);
  });
}

for (const width of NARROW) {
  test(`[${width}px] the drawer takes over rather than squeezing the nav`, async ({ page }) => {
    const dict = ui("hy");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/hy");

    await expect(page.getByRole("navigation", { name: dict.nav.mainLabel })).toBeHidden();
    await expect(page.getByRole("button", { name: dict.nav.toggleMenu })).toBeVisible();
    expect(await overflow(page)).toBeLessThanOrEqual(1);
  });
}

test("every edition's header fits at the breakpoint where the nav appears", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}`);

    await expect(page.getByRole("navigation", { name: dict.nav.mainLabel })).toBeVisible();
    const lines = await navLinkLineCounts(page, dict.nav.mainLabel);
    expect(lines, `${locale} nav wrapped`).toEqual(lines.map(() => 1));
    expect(await overflow(page), `${locale} overflows`).toBeLessThanOrEqual(1);
  }
});
