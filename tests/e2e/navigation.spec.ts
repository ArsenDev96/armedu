import { expect, test } from "@playwright/test";
import { LOCALE_META, type Locale } from "@/data/types";
import { LOCALES, ui } from "./helpers";

test("the Armenian homepage loads with its main landmarks", async ({ page }) => {
  await page.goto("/hy");
  const dict = ui("hy");

  await expect(page).toHaveTitle(/Armat/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: dict.nav.mainLabel })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

for (const locale of LOCALES) {
  test(`[${locale}] desktop navigation opens each main section`, async ({ page }) => {
    const dict = ui(locale);
    const nav = () => page.getByRole("navigation", { name: dict.nav.mainLabel });

    await page.goto(`/${locale}`);

    // The bar carries the short labels; the full ones are what breadcrumbs,
    // the drawer and the footer show.
    await nav().getByRole("link", { name: dict.nav.historyShort, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/history$`));
    await expect(
      page.getByRole("heading", { name: dict.listing.history.title, level: 1 }),
    ).toBeVisible();

    await nav().getByRole("link", { name: dict.nav.writersShort, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/writers$`));

    await nav().getByRole("link", { name: dict.nav.worksShort, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/works$`));

    await nav().getByRole("link", { name: dict.nav.cuisineShort, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/cuisine$`));
  });
}

test("the header dropdown only offers pages that exist in this edition", async ({ page }) => {
  await page.goto("/hyw");
  const dict = ui("hyw");

  await page
    .getByRole("button", {
      name: dict.nav.submenuLabel.replace("{item}", dict.nav.writers),
    })
    .click();

  const hrefs = await page
    .getByRole("navigation", { name: dict.nav.mainLabel })
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

  // Every dropdown entry stays inside the Western Armenian edition.
  expect(hrefs.filter((href) => href.startsWith("/")).every((href) => href.startsWith("/hyw"))).toBe(
    true,
  );
});

test("the footer language bar links to every edition and marks the current one", async ({
  page,
}) => {
  await page.goto("/hy");
  const dict = ui("hy");

  const footer = page.getByRole("contentinfo");
  const switcher = (locale: Locale) =>
    footer.getByRole("link", {
      name: dict.header.switchToLanguage.replace("{language}", LOCALE_META[locale].label),
    });

  await expect(switcher("en")).toHaveAttribute("href", "/en");
  await expect(switcher("hyw")).toHaveAttribute("href", "/hyw");

  // The edition being read is a link too — the same control in the header
  // always was — but it is the one carrying `aria-current`.
  await expect(
    footer.getByRole("link", {
      name: dict.header.currentLanguage.replace("{language}", LOCALE_META.hy.label),
    }),
  ).toHaveAttribute("aria-current", "true");
});

test("the footer keeps the reader on their page when they switch edition", async ({ page }) => {
  // The footer used to send every language link to the homepage while the
  // identical header control preserved the path.
  await page.goto("/hy/history/tigran-the-great");
  const dict = ui("hy");

  await page
    .getByRole("contentinfo")
    .getByRole("link", {
      name: dict.header.switchToLanguage.replace("{language}", LOCALE_META.en.label),
    })
    .click();

  await expect(page).toHaveURL(/\/en\/history\/tigran-the-great$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("no page links to a bare fragment", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}`);
    expect(await page.locator('a[href="#"], a[href=""]').count()).toBe(0);
  }
});

test("the localized 404 page is shown for an unknown path", async ({ page }) => {
  const response = await page.goto("/hy/history/definitely-not-here");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: ui("hy").notFound.title })).toBeVisible();
  await expect(page.getByRole("link", { name: ui("hy").notFound.backHome })).toBeVisible();
});

test("supporting pages exist in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    for (const path of ["about", "contact", "privacy"]) {
      const response = await page.goto(`/${locale}/${path}`);
      expect(response?.status(), `${locale}/${path}`).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    }
  }
});
