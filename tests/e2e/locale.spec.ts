import { expect, test } from "@playwright/test";
import { LOCALES, articleTitle, hasArticle, openLanguageMenu, ui } from "./helpers";

test("/ redirects to the default Armenian edition", async ({ page }) => {
  const response = await page.goto("/");

  await expect(page).toHaveURL(/\/hy$/);
  expect(response?.status()).toBe(200);
});

for (const locale of LOCALES) {
  test(`/${locale} loads its homepage in the right language`, async ({ page }) => {
    await page.goto(`/${locale}`);

    const dictionary = ui(locale);

    // The document language is the real signal for assistive tech and crawlers.
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: dictionary.nav.mainLabel }),
    ).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(dictionary.site.tagline.slice(0, 12)));
  });
}

test("an unsupported locale segment returns 404", async ({ page }) => {
  // Russian was deliberately dropped from the MVP.
  const response = await page.goto("/ru");
  expect(response?.status()).toBe(404);

  const other = await page.goto("/not-a-locale");
  expect(other?.status()).toBe(404);
});

test("the desktop language selector switches edition and keeps the page", async ({ page }) => {
  await page.goto("/hy/history");

  await openLanguageMenu(page, "hy");
  await page.getByRole("link", { name: ui("hy").header.switchToLanguage.replace("{language}", "English") }).click();

  await expect(page).toHaveURL(/\/en\/history$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: ui("en").listing.history.title, level: 1 }),
  ).toBeVisible();
});

test("the language selector uses real links, not buttons", async ({ page }) => {
  await page.goto("/hy");
  await openLanguageMenu(page, "hy");

  // Middle-clickable, openable in a new tab, crawlable.
  const link = page.getByRole("link", {
    name: ui("hy").header.switchToLanguage.replace("{language}", "English"),
  });
  await expect(link).toHaveAttribute("href", "/en");
  await expect(link).toHaveAttribute("hreflang", "en");
});

test("switching language preserves the article slug when translated", async ({ page }) => {
  const slug = "tigran-the-great";
  await page.goto(`/hy/history/${slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(articleTitle("hy", slug));

  await openLanguageMenu(page, "hy");
  await page
    .getByRole("link", {
      name: ui("hy").header.switchToLanguage.replace("{language}", "Արեւմտահայերէն"),
    })
    .click();

  await expect(page).toHaveURL(new RegExp(`/hyw/history/${slug}$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText(articleTitle("hyw", slug));
});

test("switching to an untranslated article shows the unavailable state, not English", async ({
  page,
}) => {
  const slug = "kingdom-of-urartu";
  expect(hasArticle("hyw", slug)).toBe(false);

  await page.goto(`/hyw/history/${slug}`);

  await expect(
    page.getByRole("heading", { name: ui("hyw").unavailable.heading, level: 1 }),
  ).toBeVisible();

  // The page offers the editions that do exist…
  await expect(page.getByRole("link", { name: new RegExp(articleTitle("hy", slug)) })).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(articleTitle("en", slug)) })).toBeVisible();

  // …and never renders the English article body itself.
  await expect(page.getByText("Kingdom of Urartu", { exact: true })).toHaveCount(0);
});

test("an untranslated article is not advertised as a translation", async ({ page }) => {
  await page.goto("/hyw/history/kingdom-of-urartu");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );

  // The Armenian edition of the same article must not offer a hyw alternate.
  await page.goto("/hy/history/kingdom-of-urartu");
  await expect(page.locator('link[rel="alternate"][hreflang="hyw"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
});

test("a fully translated article advertises all three editions", async ({ page }) => {
  await page.goto("/hy/history/tigran-the-great");

  for (const locale of LOCALES) {
    await expect(
      page.locator(`link[rel="alternate"][hreflang="${locale}"]`),
    ).toHaveCount(1);
  }
});

test("switching language on a search page carries the query across", async ({ page }) => {
  await page.goto("/hy/search?q=Մաշտոց");

  await openLanguageMenu(page, "hy");
  await page
    .getByRole("link", {
      name: ui("hy").header.switchToLanguage.replace("{language}", "Արեւմտահայերէն"),
    })
    .click();

  await expect(page).toHaveURL(/\/hyw\/search\?q=/);
  await expect(page).toHaveURL(/%D5%84%D5%A1%D5%B7%D5%BF%D5%B8%D6%81/);
});

test("no page links out of its own edition", async ({ page }) => {
  await page.goto("/hyw/history/tigran-the-github".replace("-github", "-great"));

  // Every in-app link stays under /hyw, except the deliberate language switcher
  // and the shared sitemap.
  const stray = await page.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll<HTMLAnchorElement>("main a[href^='/']").forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/hyw") || href === "/sitemap.xml") return;
      bad.push(href);
    });
    return bad;
  });

  expect(stray).toEqual([]);
});
