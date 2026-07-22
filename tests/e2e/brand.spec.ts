import { expect, test } from "@playwright/test";
import { LOCALES, ui } from "./helpers";

/**
 * Brand identity — the site is "Armat" (formerly "ArmEdu").
 *
 * The name is read from the same `ui.site.name` the app renders, so a later
 * wording change cannot leave a test asserting a string nobody ships. The last
 * test is the guard the rename exists for: no page, in visible text or metadata,
 * may still carry the former brand.
 */

const BRAND = "Armat";
const FORMER = "ArmEdu";

test("the brand is Armat in every edition", () => {
  for (const locale of LOCALES) expect(ui(locale).site.name).toBe(BRAND);
});

test("the header logo and footer render the brand", async ({ page }) => {
  await page.goto("/hy");
  // The logo renders the name on its own; the footer copyright embeds it.
  await expect(page.getByText(BRAND, { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText(BRAND);
});

test("the page title and Open Graph title carry the brand", async ({ page }) => {
  await page.goto("/hy");
  await expect(page).toHaveTitle(/Armat/);
  // og:site_name is set on the root layout but Next's shallow metadata merge means
  // routes with their own `openGraph` do not re-emit it; the brand rides on og:title.
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Armat/);
});

test("JSON-LD names Armat as organization, publisher and editorial author", async ({ page }) => {
  await page.goto("/hy/history/tigran-the-great");
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "")["@graph"] ?? []) as Record<string, any>[];

  const org = graph.find((n) => n["@type"] === "Organization");
  const article = graph.find((n) => n["@type"] === "Article");
  expect(org?.name).toBe(BRAND);
  // The publisher points at the one Organization node, not a repeated inline name.
  expect(article?.publisher["@id"]).toBe(org?.["@id"]);
  // The byline is localized ("Armat-ի խմբագրական խումբ") but always carries the Latin brand.
  expect(article?.author.name).toContain(BRAND);
});

test("about and privacy name Armat in prose; contact carries it in metadata", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/about`);
    await expect(page.getByRole("main")).toContainText(BRAND);

    await page.goto(`/${locale}/privacy`);
    await expect(page.getByRole("main")).toContainText(BRAND);

    // Contact names the brand in its description rather than the visible copy.
    await page.goto(`/${locale}/contact`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      new RegExp(BRAND),
    );
  }
});

test("no page — visible or in metadata — still shows the former brand", async ({ page }) => {
  const paths = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/history/tigran-the-great",
    "/writers/hovhannes-tumanyan",
    "/works/david-of-sassoun",
  ];
  for (const locale of LOCALES) {
    for (const path of paths) {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status(), `${locale}${path}`).toBe(200);
      // page.content() is the full served HTML — head metadata, JSON-LD and body.
      expect(await page.content(), `${locale}${path}`).not.toContain(FORMER);
    }
  }
});
