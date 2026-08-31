import { expect, test } from "@playwright/test";
import { articleTitle, bundle, cards, ui } from "./helpers";

/**
 * Listing search and filtering, exercised in the primary edition (hy) and
 * re-checked in English so the pre-existing behaviour is provably intact.
 */

const HY = () => ui("hy");
const periodLabel = (locale: "hy" | "hyw" | "en", id: string) => {
  const filter = bundle(locale).historyPeriods.find((entry) => entry.id === id);
  if (!filter) throw new Error(`No "${id}" history period in "${locale}".`);
  return filter.label;
};
const topicTypeLabel = (locale: "hy" | "hyw" | "en", id: string) => {
  const filter = bundle(locale).historyTopicTypes.find((entry) => entry.id === id);
  if (!filter) throw new Error(`No "${id}" history topic type in "${locale}".`);
  return filter.label;
};

test("Armenian listing search narrows results while typing", async ({ page }) => {
  await page.goto("/hy/history");

  const before = await cards(page).count();
  expect(before).toBeGreaterThan(1);

  await page.getByRole("searchbox", { name: HY().listing.history.searchLabel }).fill("Ուրարտու");

  const after = await cards(page).count();
  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThan(before);
  await expect(cards(page).first()).toContainText(articleTitle("hy", "kingdom-of-urartu"));
});

test("Armenian search is case-insensitive and trims whitespace", async ({ page }) => {
  await page.goto("/hy/history");

  const field = page.getByRole("searchbox", { name: HY().listing.history.searchLabel });
  await field.fill("Ուրարտու");
  const exact = await cards(page).count();

  await field.fill("   ուրարտու   ");
  await expect(cards(page)).toHaveCount(exact);
});

test("Armenian period filters narrow the listing", async ({ page }) => {
  await page.goto("/hy/history");
  const all = await cards(page).count();

  await page.getByRole("button", { name: periodLabel("hy", "ancient") }).click();

  const filtered = await cards(page).count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(all);
  await expect(page).toHaveURL(/[?&]period=ancient/);
});

test("every history filter on both axes matches at least one article", async ({ page }) => {
  // The rule this locks is the one that was missing: «Կարևոր դեմքեր» shipped for
  // months on a listing with seven articles and always rendered the empty state.
  // `validate:content` now fails the build for a dead filter; this checks the
  // rendered page agrees, on both axes, in every edition.
  for (const locale of ["hy", "hyw", "en"] as const) {
    await page.goto(`/${locale}/history`);
    const dict = ui(locale);

    for (const filter of bundle(locale).historyPeriods) {
      await page.getByRole("button", { name: filter.label, exact: true }).click();
      expect(await cards(page).count(), `${locale} period "${filter.id}"`).toBeGreaterThan(0);
    }
    await page.getByRole("button", { name: dict.listing.clearAllFilters }).click();

    for (const filter of bundle(locale).historyTopicTypes) {
      await page.getByRole("button", { name: filter.label, exact: true }).click();
      expect(await cards(page).count(), `${locale} type "${filter.id}"`).toBeGreaterThan(0);
    }
  }
});

test("the two history axes are independent and combine as AND", async ({ page }) => {
  await page.goto("/hy/history");
  const all = await cards(page).count();

  // Avarayr is the only `marzpanate` article and the only `battle`. Selecting the
  // era used to be impossible for it at all: it was filed under a content type.
  await page.getByRole("button", { name: periodLabel("hy", "marzpanate"), exact: true }).click();
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText(articleTitle("hy", "battle-of-avarayr"));

  await page.getByRole("button", { name: topicTypeLabel("hy", "battle"), exact: true }).click();
  await expect(page).toHaveURL(/[?&]period=marzpanate/);
  await expect(page).toHaveURL(/[?&]type=battle/);
  await expect(cards(page)).toHaveCount(1);

  // A contradictory pair matches nothing, which is what proves the two axes are
  // being applied together rather than one overwriting the other.
  await page.getByRole("button", { name: topicTypeLabel("hy", "person"), exact: true }).click();
  await expect(page.getByRole("heading", { name: HY().empty.heading })).toBeVisible();

  await page.getByRole("button", { name: HY().listing.clearAllFilters }).click();
  await expect(cards(page)).toHaveCount(all);
  await expect(page).toHaveURL(/\/hy\/history$/);
});

test("the type axis round-trips through the URL", async ({ page }) => {
  await page.goto("/hy/history?type=person");

  await expect(
    page.getByRole("button", { name: topicTypeLabel("hy", "person"), exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  // Tigran and Mashtots.
  await expect(cards(page)).toHaveCount(2);
});

test("Tigran is reachable under the ancient era, not a kingdoms bucket", async ({ page }) => {
  // He carried `periodId: "kingdoms"` — a label that named no era — so he was
  // absent from «Հին Հայաստան» despite being a first-century-BC king.
  await page.goto("/hy/history?period=ancient");

  const titles = await cards(page).allInnerTexts();
  expect(titles.join(" ")).toContain(articleTitle("hy", "tigran-the-great"));
  await expect(cards(page)).toHaveCount(4);
});

test("Armenian search and filters combine with AND behaviour", async ({ page }) => {
  await page.goto("/hy/history");

  await page.getByRole("searchbox", { name: HY().listing.history.searchLabel }).fill("Ուրարտու");
  const searchOnly = await cards(page).count();
  expect(searchOnly).toBeGreaterThan(0);

  // Urartu is "ancient", so a different period must exclude it entirely.
  await page.getByRole("button", { name: periodLabel("hy", "modern") }).click();
  await expect(page.getByRole("heading", { name: HY().empty.heading })).toBeVisible();
  await expect(page).toHaveURL(/q=/);
  await expect(page).toHaveURL(/period=modern/);

  // Its own period brings it back.
  await page.getByRole("button", { name: periodLabel("hy", "ancient") }).click();
  await expect(cards(page)).toHaveCount(searchOnly);
});

test("clearing controls restores every Armenian result", async ({ page }) => {
  await page.goto("/hy/history");
  const all = await cards(page).count();

  await page.getByRole("searchbox", { name: HY().listing.history.searchLabel }).fill("Ուրարտու");
  await page.getByRole("button", { name: periodLabel("hy", "ancient") }).click();
  expect(await cards(page).count()).toBeLessThan(all);

  await page.getByRole("button", { name: HY().listing.clearAllFilters }).click();

  await expect(cards(page)).toHaveCount(all);
  await expect(page).toHaveURL(/\/hy\/history$/);
});

test("the localized empty state clears the search", async ({ page }) => {
  await page.goto("/hy/history");
  const all = await cards(page).count();

  await page
    .getByRole("searchbox", { name: HY().listing.history.searchLabel })
    .fill("զզզզզ-չկա");

  await expect(page.getByRole("heading", { name: HY().empty.heading })).toBeVisible();
  await page.getByRole("button", { name: HY().empty.clearLabel }).click();

  await expect(cards(page)).toHaveCount(all);
});

test("query parameters restore listing state under a localized route", async ({ page }) => {
  await page.goto("/hy/history?q=Ուրարտու&period=ancient");

  await expect(
    page.getByRole("searchbox", { name: HY().listing.history.searchLabel }),
  ).toHaveValue("Ուրարտու");
  await expect(page.getByRole("button", { name: periodLabel("hy", "ancient") })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(cards(page).first()).toContainText(articleTitle("hy", "kingdom-of-urartu"));
});

test("browser back and forward restore the previous filter", async ({ page }) => {
  await page.goto("/hy/history");

  await page.getByRole("button", { name: periodLabel("hy", "ancient") }).click();
  await expect(page).toHaveURL(/period=ancient/);

  await page.getByRole("button", { name: periodLabel("hy", "medieval") }).click();
  await expect(page).toHaveURL(/period=medieval/);

  await page.goBack();
  await expect(page).toHaveURL(/period=ancient/);
  await expect(page.getByRole("button", { name: periodLabel("hy", "ancient") })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.goForward();
  await expect(page).toHaveURL(/period=medieval/);
  await expect(page.getByRole("button", { name: periodLabel("hy", "medieval") })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("Western Armenian listing search works over its own subset", async ({ page }) => {
  await page.goto("/hyw/history");

  const all = await cards(page).count();
  // Western Armenian reached full coverage in July 2026: every canonical
  // history article is translated.
  expect(all).toBe(7);

  await page
    .getByRole("searchbox", { name: ui("hyw").listing.history.searchLabel })
    .fill("Մաշտոց");

  const after = await cards(page).count();
  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThan(all);
});

test("English listing search still works exactly as before", async ({ page }) => {
  await page.goto("/en/history");
  const all = await cards(page).count();

  await page.getByRole("searchbox", { name: ui("en").listing.history.searchLabel }).fill("urartu");

  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Urartu");
  expect(all).toBeGreaterThan(1);
});

test("English query parameters still restore listing state", async ({ page }) => {
  await page.goto("/en/history?q=armenia&period=modern");

  await expect(
    page.getByRole("searchbox", { name: ui("en").listing.history.searchLabel }),
  ).toHaveValue("armenia");
  await expect(page.getByRole("button", { name: periodLabel("en", "modern") })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("the writers listing filters within its own edition", async ({ page }) => {
  await page.goto("/hyw/writers");

  // All ten biographies are translated: six since July 2026, Grigor Narekatsi
  // since §81, Daniel Varoujan since §84, Nerses Shnorhali since §86 and Siamanto
  // since §88. Edited rather than derived on purpose — this file's job is to
  // notice when a section's published count changes underneath it, and Western
  // Armenian is the edition where a new writer is most likely to be left behind.
  await expect(cards(page)).toHaveCount(10);

  await page
    .getByRole("searchbox", { name: ui("hyw").listing.writers.searchLabel })
    .fill("Թումանեան");

  await expect(cards(page)).toHaveCount(1);
});

test("the works listing filters by genre under a localized route", async ({ page }) => {
  await page.goto("/hy/works?type=novel");

  const novels = bundle("hy").workGenres.find((genre) => genre.id === "novel");
  await expect(page.getByRole("button", { name: novels!.label })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(cards(page)).toHaveCount(2);
});
