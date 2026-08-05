import { expect, test } from "@playwright/test";
import { LOCALES, ui } from "./helpers";

/**
 * Header fit.
 *
 * The horizontal nav used to be held back to `xl`. Six items at their full
 * names measured 808px in Armenian against the 767px the row had left at
 * 1280px, so every label broke mid-phrase ("Հայոց / պատմություն") and the only
 * way to stop it was to hand every 1024–1280px laptop a hamburger.
 *
 * The width came out of the labels instead — see the note above the nav in
 * `Header.tsx` — and the bar now appears at `lg` with ~175px to spare in the
 * widest edition. These tests hold that: the nav must sit on one line at
 * 1024px in all three editions and must not push the page sideways. Put "Home"
 * back or lengthen a label and this fails rather than the layout.
 */

const WIDE = [1024, 1152, 1280, 1440];
const NARROW = [768, 900];

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

/** Clicks a header toggle until hydration catches it — see `helpers.ts`. */
async function open(
  toggle: ReturnType<import("@playwright/test").Page["getByRole"]>,
  panel: ReturnType<import("@playwright/test").Page["getByRole"]>,
) {
  await expect(async () => {
    await toggle.click();
    await expect(panel).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

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
    await expect(nav.getByRole("link", { name: dict.nav.cuisineShort, exact: true })).toBeVisible();

    const lines = await navLinkLineCounts(page, dict.nav.mainLabel);
    expect(lines.length, "the bar carries five sections, without Home").toBe(5);
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
  await page.setViewportSize({ width: 1024, height: 900 });

  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}`);

    await expect(page.getByRole("navigation", { name: dict.nav.mainLabel })).toBeVisible();
    const lines = await navLinkLineCounts(page, dict.nav.mainLabel);
    expect(lines, `${locale} nav wrapped`).toEqual(lines.map(() => 1));
    expect(await overflow(page), `${locale} overflows`).toBeLessThanOrEqual(1);
  }
});

test("Home is off the bar but still in the drawer", async ({ page }) => {
  const dict = ui("hy");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/hy");

  // The logo beside it is already a link home, so the bar does not repeat it.
  await expect(
    page
      .getByRole("navigation", { name: dict.nav.mainLabel })
      .getByRole("link", { name: dict.nav.home, exact: true }),
  ).toHaveCount(0);

  await page.setViewportSize({ width: 768, height: 900 });
  const drawer = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  await open(page.getByRole("button", { name: dict.nav.toggleMenu }), drawer);

  // On a small screen the drawer is the whole map of the site, so it keeps Home.
  await expect(drawer.getByRole("link", { name: dict.nav.home, exact: true })).toBeVisible();
});

test("the drawer opens with its sections collapsed", async ({ page }) => {
  // Expanded, the drawer was a flat ~35-link scroll: every category's five
  // articles at once, burying the destinations most readers actually wanted.
  const dict = ui("hy");
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/hy");

  const drawer = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  await open(page.getByRole("button", { name: dict.nav.toggleMenu }), drawer);

  const allHistory = drawer.getByRole("link", { name: dict.nav.allHistoryArticles });
  await expect(allHistory).toBeHidden();

  await drawer
    .getByRole("button", { name: dict.nav.submenuLabel.replace("{item}", dict.nav.history) })
    .click();
  await expect(allHistory).toBeVisible();
});

test("the drawer locks the page behind it and returns focus when dismissed", async ({ page }) => {
  const dict = ui("hy");
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/hy");

  const toggle = page.getByRole("button", { name: dict.nav.toggleMenu });
  const drawer = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  await open(toggle, drawer);

  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("the drawer's scrim covers the page and dismisses on a tap", async ({ page }) => {
  /*
    The scrim is a child of the header, and the header carries `backdrop-blur`.
    A `backdrop-filter` makes its element a containing block for `position:
    fixed` descendants, so a `fixed inset-0` scrim resolves against the 64px
    header rather than the viewport and silently dims nothing at all. This
    measures the covered area rather than trusting the declaration.
  */
  const dict = ui("hy");
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/hy");

  const drawer = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  await open(page.getByRole("button", { name: dict.nav.toggleMenu }), drawer);

  const covered = await page.evaluate(() => {
    const scrim = document.querySelector<HTMLElement>("header > div[aria-hidden='true']");
    if (!scrim) return null;
    const box = scrim.getBoundingClientRect();
    return { height: Math.round(box.height), width: Math.round(box.width) };
  });

  expect(covered, "no scrim was rendered").not.toBeNull();
  expect(covered!.width).toBe(768);
  expect(covered!.height, "the scrim collapsed to the header strip").toBeGreaterThan(700);

  // A tap on it closes the drawer, like any modal backdrop.
  await page.mouse.click(740, 860);
  await expect(drawer).toBeHidden();
});

test("Escape closes the search panel and gives focus back to its button", async ({ page }) => {
  // Escape and outside-clicks used to reach the dropdowns only, so search was
  // the one panel a reader could dismiss only by finding its button again.
  const dict = ui("hy");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/hy");

  const button = page.getByRole("button", { name: dict.header.searchButtonLabel });
  const field = page.getByRole("searchbox", { name: dict.header.searchInputLabel });
  await open(button, field);

  await page.keyboard.press("Escape");

  await expect(field).toBeHidden();
  await expect(button).toBeFocused();
});

test("a dropdown opened by its chevron survives the pointer leaving it", async ({ page }) => {
  const dict = ui("hy");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/hy");

  const chevron = page.getByRole("button", {
    name: dict.nav.submenuLabel.replace("{item}", dict.nav.history),
  });
  const panel = page
    .getByRole("navigation", { name: dict.nav.mainLabel })
    .getByRole("link", { name: dict.nav.allHistoryArticles });

  await open(chevron, panel);

  // A hover-opened menu closes when the pointer leaves. One that was clicked
  // was asked for, so it waits to be dismissed.
  await page.mouse.move(5, 500);
  await expect(panel).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});
