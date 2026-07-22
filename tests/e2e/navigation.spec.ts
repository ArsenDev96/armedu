import { expect, test } from "@playwright/test";
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

    await nav().getByRole("link", { name: dict.nav.history, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/history$`));
    await expect(
      page.getByRole("heading", { name: dict.listing.history.title, level: 1 }),
    ).toBeVisible();

    await nav().getByRole("link", { name: dict.nav.writers, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/writers$`));

    await nav().getByRole("link", { name: dict.nav.works, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/works$`));
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

test("the footer language column links to every edition", async ({ page }) => {
  await page.goto("/hy");

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  await expect(footer.getByRole("link", { name: "Արեւմտահայերէն" })).toHaveAttribute(
    "href",
    "/hyw",
  );
  // The current edition is marked, not linked.
  await expect(footer.getByRole("link", { name: "Հայերեն" })).toHaveCount(0);
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
