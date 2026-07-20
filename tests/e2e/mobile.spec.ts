import { expect, test } from "@playwright/test";
import { cards, ui } from "./helpers";

/** Runs only under the `mobile` project (Pixel 5, 393px wide). */

test("the mobile menu opens and closes", async ({ page }) => {
  await page.goto("/hy");
  const dict = ui("hy");

  const toggle = page.getByRole("button", { name: dict.nav.toggleMenu });
  const menu = page.getByRole("navigation", { name: dict.nav.mobileLabel });

  await expect(menu).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: dict.nav.history, exact: true })).toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
});

test("the mobile menu navigates and closes itself", async ({ page }) => {
  await page.goto("/hy");
  const dict = ui("hy");

  await page.getByRole("button", { name: dict.nav.toggleMenu }).click();
  await page
    .getByRole("navigation", { name: dict.nav.mobileLabel })
    .getByRole("link", { name: dict.nav.writers, exact: true })
    .click();

  await expect(page).toHaveURL(/\/hy\/writers$/);
  await expect(page.getByRole("navigation", { name: dict.nav.mobileLabel })).toBeHidden();
});

test("the language selector works on a small screen", async ({ page }) => {
  await page.goto("/hy/history");
  const dict = ui("hy");

  await page.getByRole("button", { name: dict.nav.toggleMenu }).click();

  const menu = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  const toEnglish = menu.getByRole("link", {
    name: dict.header.switchToLanguage.replace("{language}", "English"),
  });

  await expect(toEnglish).toBeVisible();
  await toEnglish.click();

  await expect(page).toHaveURL(/\/en\/history$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the current language is marked in the mobile selector", async ({ page }) => {
  await page.goto("/hyw");
  const dict = ui("hyw");

  await page.getByRole("button", { name: dict.nav.toggleMenu }).click();

  const current = page
    .getByRole("navigation", { name: dict.nav.mobileLabel })
    .getByRole("link", {
      name: dict.header.currentLanguage.replace("{language}", "Արեւմտահայերէն"),
    });

  await expect(current).toHaveAttribute("aria-current", "true");
});

test("header search works on a small screen", async ({ page }) => {
  await page.goto("/hy");
  const dict = ui("hy");

  await page.getByRole("button", { name: dict.header.searchButtonLabel }).click();
  const field = page.getByRole("searchbox", { name: dict.header.searchInputLabel });
  await expect(field).toBeVisible();

  await field.fill("Թումանյան");
  await field.press("Enter");

  await expect(page).toHaveURL(/\/hy\/search\?q=/);
  await expect(
    page.getByRole("main").getByRole("heading", { name: dict.search.groupWriters, level: 2 }),
  ).toBeVisible();
});

test("listing controls stay usable and do not overflow horizontally", async ({ page }) => {
  await page.goto("/hy/history");

  await page
    .getByRole("searchbox", { name: ui("hy").listing.history.searchLabel })
    .fill("Ուրարտու");
  expect(await cards(page).count()).toBeGreaterThan(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("the unavailable-translation page fits a small screen", async ({ page }) => {
  await page.goto("/hyw/history/kingdom-of-urartu");

  await expect(
    page.getByRole("heading", { name: ui("hyw").unavailable.heading, level: 1 }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
