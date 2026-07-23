import { expect, test } from "@playwright/test";
import { articleTitle, openHeaderSearch, ui } from "./helpers";

test("the header search navigates to the localized search route", async ({ page }) => {
  await page.goto("/hy");

  const field = await openHeaderSearch(page, "hy");
  await field.fill("Մաշտոց");
  await field.press("Enter");

  await expect(page).toHaveURL(/\/hy\/search\?q=/);
  await expect(
    page.getByRole("main").getByRole("heading", { name: ui("hy").search.groupHistory, level: 2 }),
  ).toBeVisible();
});

test("the header search ignores an empty query", async ({ page }) => {
  await page.goto("/hy");

  const field = await openHeaderSearch(page, "hy");
  await field.fill("   ");
  await field.press("Enter");

  await expect(page).toHaveURL(/\/hy$/);
});

test("Armenian global search returns Armenian results only", async ({ page }) => {
  await page.goto("/hy/search?q=Մաշտոց");

  await expect(
    page.getByRole("heading", { name: articleTitle("hy", "mesrop-mashtots-armenian-alphabet") }),
  ).toBeVisible();

  // The English title of the same article must not appear in the Armenian edition.
  await expect(
    page.getByText("Mesrop Mashtots and the Armenian Alphabet", { exact: true }),
  ).toHaveCount(0);
});

test("Western Armenian global search searches its own subset", async ({ page }) => {
  await page.goto("/hyw/search?q=Մաշտոց");

  await expect(
    page.getByRole("main").getByRole("heading", { name: ui("hyw").search.groupHistory, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: articleTitle("hyw", "mesrop-mashtots-armenian-alphabet") }),
  ).toBeVisible();
});

test("a term only in the Armenian edition finds nothing in Western Armenian", async ({ page }) => {
  // Since hyw reached full coverage the two editions carry the same articles,
  // so the guaranteed-absent term is no longer a missing title but a spelling:
  // the validator forbids the Eastern suffix `ություն` anywhere in Western
  // Armenian prose (`easternOrthographyMarker`), so the Eastern spelling of
  // "kingdom" — which hits the hy Urartu article — can never hit here.
  await page.goto(`/hyw/search?q=${encodeURIComponent("թագավորություն")}`);

  await expect(
    page.getByRole("heading", { name: ui("hyw").search.noResultsHeading }),
  ).toBeVisible();
});

test("English global search still works and groups by type", async ({ page }) => {
  await page.goto("/en/search?q=mashtots");

  await expect(
    page.getByRole("main").getByRole("heading", { name: ui("en").search.groupHistory, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mesrop Mashtots and the Armenian Alphabet" }),
  ).toBeVisible();
});

test("global search links land in the same edition", async ({ page }) => {
  await page.goto("/hy/search?q=Թումանյան");

  await page
    .getByRole("link", { name: articleTitle("hy", "hovhannes-tumanyan") })
    .first()
    .click();

  await expect(page).toHaveURL(/\/hy\/writers\/hovhannes-tumanyan$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hy");
});

test("the localized no-results state appears and clears", async ({ page }) => {
  await page.goto("/hy/search?q=զզզզզչկա");

  await expect(
    page.getByRole("heading", { name: ui("hy").search.noResultsHeading }),
  ).toBeVisible();

  await page.getByRole("button", { name: ui("hy").search.noResultsClear }).click();

  await expect(
    page.getByRole("heading", { name: ui("hy").search.noQueryHeading }),
  ).toBeVisible();
});

test("the search page with no query invites a search, in each language", async ({ page }) => {
  for (const locale of ["hy", "hyw", "en"] as const) {
    await page.goto(`/${locale}/search`);
    await expect(
      page.getByRole("heading", { name: ui(locale).search.noQueryHeading }),
    ).toBeVisible();
  }
});
