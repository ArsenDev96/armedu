import { expect, test } from "@playwright/test";
import { articleTitle, bundle, ui } from "./helpers";

test("an Armenian history article opens with its editorial furniture", async ({ page }) => {
  await page.goto("/hy/history/tigran-the-great");
  const dict = ui("hy");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    articleTitle("hy", "tigran-the-great"),
  );
  await expect(page.getByText(dict.article.updated).first()).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: dict.article.tableOfContents }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: dict.article.sources, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: dict.article.backToCategory.replace("{category}", dict.listing.history.title),
    }),
  ).toBeVisible();
});

test("a writer page and a work page open in the primary edition", async ({ page }) => {
  await page.goto("/hy/writers/yeghishe-charents");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    articleTitle("hy", "yeghishe-charents"),
  );

  await page.goto("/hy/works/anush");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    articleTitle("hy", "anush"),
  );
});

test("reading time is shown and localized", async ({ page }) => {
  await page.goto("/hy/history/tigran-the-great");

  // "{minutes} min read" with the number filled in — the literal token must be gone.
  const pattern = ui("hy").article.readingTime.replace("{minutes}", "\\d+");
  await expect(page.getByText(new RegExp(pattern)).first()).toBeVisible();
  await expect(page.getByText("{minutes}")).toHaveCount(0);
});

test("previous and next navigation stays inside the locale and category", async ({ page }) => {
  await page.goto("/hy/history/kingdom-of-urartu");
  const dict = ui("hy");

  const next = page.getByRole("link", { name: new RegExp(`^${dict.article.next}`) }).first();
  await expect(next).toBeVisible();
  await next.click();

  await expect(page).toHaveURL(/\/hy\/history\/[a-z-]+$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hy");
});

test("the first article in a category has no previous link", async ({ page }) => {
  // Tigran the Great is authored first in the history collection.
  await page.goto("/hy/history/tigran-the-great");
  const dict = ui("hy");

  await expect(
    page.getByRole("link", { name: new RegExp(`^${dict.article.previous}`) }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: new RegExp(`^${dict.article.next}`) }).first(),
  ).toBeVisible();
});

test("related links stay inside the locale", async ({ page }) => {
  await page.goto("/hy/history/tigran-the-great");

  const hrefs = await page
    .getByRole("link")
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => /^\/(hy|hyw|en)\//.test(href)),
    );

  expect(hrefs.length).toBeGreaterThan(0);
  // Only the language switcher may point elsewhere; it lives in the header.
  const inMain = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>("main a[href^='/']")].map(
      (a) => a.getAttribute("href") ?? "",
    ),
  );
  expect(inMain.every((href) => href.startsWith("/hy"))).toBe(true);
});

test("Western Armenian related content never points at an untranslated page", async ({ page }) => {
  await page.goto("/hyw/writers/hovhannes-tumanyan");

  const translated = new Set(bundle("hyw").articles.map((article) => article.slug));

  const slugs = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>("main a[href^='/hyw/']")]
      .map((a) => (a.getAttribute("href") ?? "").split("/").pop() ?? "")
      .filter(Boolean),
  );

  const articleSlugs = slugs.filter((slug) =>
    ["history", "writers", "works"].every((section) => slug !== section),
  );
  for (const slug of articleSlugs) {
    if (["search", "about", "contact", "privacy", "hyw"].includes(slug)) continue;
    expect(translated.has(slug) || slug === "hyw").toBe(true);
  }
});

test("the copy-link control is available and reports back, localized", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/hy/history/tigran-the-great");
  const dict = ui("hy");

  const button = page.getByRole("button", { name: new RegExp(dict.article.copyLink) });
  await expect(button).toBeVisible();

  await button.click();
  await expect(page.getByRole("button", { name: new RegExp(dict.article.copied) })).toBeVisible();

  // The copied URL carries the locale prefix.
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("/hy/history/tigran-the-great");
});

test("the breadcrumb returns to the localized category listing", async ({ page }) => {
  await page.goto("/hy/works/anush");
  const dict = ui("hy");

  await page
    .getByRole("navigation", { name: dict.nav.breadcrumbLabel })
    .getByRole("link", { name: dict.listing.works.title })
    .click();

  await expect(page).toHaveURL(/\/hy\/works$/);
});

test("English article pages still work end to end", async ({ page }) => {
  await page.goto("/en/history/tigran-the-great");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tigran the Great");
  await expect(
    page.getByRole("link", { name: "Back to Armenian History" }),
  ).toBeVisible();
  await expect(page.getByText(/min read/).first()).toBeVisible();
});

test("an unknown slug shows a 404", async ({ page }) => {
  const response = await page.goto("/hy/history/not-a-real-article");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: ui("hy").notFound.title })).toBeVisible();
});
