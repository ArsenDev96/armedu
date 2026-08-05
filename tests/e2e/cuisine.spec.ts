import { expect, test, type Page } from "@playwright/test";
import { LOCALES, articleTitle, bundle, cards, ui } from "./helpers";

/**
 * The Armenian Cuisine section.
 *
 * The category was added after the archive's three original sections, so these
 * tests are mostly about *parity*: cuisine has to behave like history and works
 * everywhere a reader or a crawler meets a category — navigation, listing,
 * filters, search grouping, breadcrumbs, hreflang, structured data, sitemap —
 * rather than being a page that merely exists.
 *
 * The one thing they check that the other sections' tests cannot is the absence
 * of a translation gap: all six dishes are published in all three editions, so
 * no cuisine URL may ever render the "not available in this language" page.
 */

const SLUGS = ["lavash", "dolma", "khorovats", "harissa", "gata", "ghapama"] as const;

const dishTypeLabel = (locale: "hy" | "hyw" | "en", id: string) => {
  const filter = bundle(locale).cuisineTypes.find((entry) => entry.id === id);
  if (!filter) throw new Error(`No "${id}" cuisine type in "${locale}".`);
  return filter.label;
};

type LdNode = { "@type"?: string; [key: string]: unknown };

async function readGraph(page: Page): Promise<LdNode[]> {
  const blocks = page.locator('script[type="application/ld+json"]');
  await expect(blocks).toHaveCount(1);
  const parsed = JSON.parse((await blocks.first().textContent()) ?? "") as {
    "@graph"?: LdNode[];
  };
  expect(parsed["@graph"]).toBeDefined();
  return parsed["@graph"] ?? [];
}

function node(graph: LdNode[], type: string): LdNode {
  const found = graph.find((entry) => entry["@type"] === type);
  if (!found) throw new Error(`No "${type}" node in the graph.`);
  return found;
}

/* -------------------------------------------------------------------------- */
/*  Listing                                                                    */
/* -------------------------------------------------------------------------- */

for (const locale of LOCALES) {
  test(`[${locale}] the cuisine listing renders every dish in its own language`, async ({
    page,
  }) => {
    const dict = ui(locale);
    await page.goto(`/${locale}/cuisine`);

    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      page.getByRole("heading", { name: dict.listing.cuisine.title, level: 1 }),
    ).toBeVisible();

    // One card per dish, and each card carries this edition's own title.
    await expect(cards(page)).toHaveCount(SLUGS.length);
    for (const slug of SLUGS) {
      await expect(
        page.getByRole("link", { name: articleTitle(locale, slug), exact: true }).first(),
      ).toBeVisible();
    }
  });
}

test("the cuisine listing filters by kind of dish, and keeps it in the URL", async ({ page }) => {
  await page.goto("/hy/cuisine");
  const all = await cards(page).count();

  await page.getByRole("button", { name: dishTypeLabel("hy", "ceremonial") }).click();

  // Harissa and ghapama are the two ceremonial dishes.
  await expect(cards(page)).toHaveCount(2);
  expect(all).toBeGreaterThan(2);
  await expect(page).toHaveURL(/[?&]type=ceremonial/);

  // The filter key is `type`, like the works listing — not `period`.
  await expect(page).not.toHaveURL(/period=/);
});

test("a cuisine query parameter restores the listing state", async ({ page }) => {
  await page.goto("/en/cuisine?type=bread");

  await expect(page.getByRole("button", { name: dishTypeLabel("en", "bread") })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Lavash");
});

test("cuisine listing search narrows on an ingredient, not only a title", async ({ page }) => {
  await page.goto("/en/cuisine");
  const all = await cards(page).count();

  // "korkot" appears in no dish title — it is in harissa's ingredient list, and
  // reaching it is the whole reason the cuisine detail block feeds the haystack.
  await page
    .getByRole("searchbox", { name: ui("en").listing.cuisine.searchLabel })
    .fill("korkot");

  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Harissa");
  expect(all).toBe(SLUGS.length);
});

test("cuisine listing search narrows on an occasion", async ({ page }) => {
  /*
    The listing haystack carried `cuisine.ingredients` and `cuisine.regions` but
    not `cuisine.occasions`, while the global index carried all three. So this
    exact query returned nothing here and returned ghapama on `/search` — from a
    box whose placeholder offers "dishes, ingredients and occasions".

    "Christmas" is the right probe because of where it does *not* appear: it is
    in no dish title and no card excerpt, so the assertion below that the card
    never shows the word is what proves the match came from the occasions list
    rather than from the text on screen. It is also in ghapama's section prose,
    which the listing deliberately leaves out of the payload — so `occasions` is
    the only field that can satisfy it here.
  */
  await page.goto("/en/cuisine");
  const all = await cards(page).count();

  await page
    .getByRole("searchbox", { name: ui("en").listing.cuisine.searchLabel })
    .fill("Christmas");

  const result = cards(page);
  await expect(result).toHaveCount(1);
  await expect(result.first()).toContainText(articleTitle("en", "ghapama"));

  // The matched term is nowhere in what the card renders.
  await expect(result.first()).not.toContainText("Christmas");

  // And the other five dishes are gone, not merely reordered.
  for (const slug of SLUGS.filter((entry) => entry !== "ghapama")) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug), exact: true }),
    ).toHaveCount(0);
  }
  expect(all).toBe(SLUGS.length);
});

/* -------------------------------------------------------------------------- */
/*  Articles                                                                   */
/* -------------------------------------------------------------------------- */

test("a cuisine article renders the shared furniture plus its dish panel", async ({ page }) => {
  const dict = ui("hy");
  await page.goto("/hy/cuisine/lavash");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    articleTitle("hy", "lavash"),
  );
  await expect(
    page.getByRole("navigation", { name: dict.article.tableOfContents }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: dict.article.sources, exact: true }),
  ).toBeVisible();
  await expect(page.getByText(dict.article.updated).first()).toBeVisible();

  // The cuisine-only panel, and every one of its labels.
  await expect(
    page.getByRole("heading", { name: dict.article.cuisine.detailsHeading }),
  ).toBeVisible();
  for (const label of [
    dict.article.cuisine.ingredients,
    dict.article.cuisine.preparation,
    dict.article.cuisine.occasions,
    dict.article.cuisine.regions,
    dict.article.cuisine.serving,
  ]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }

  // A dish has no biography attached to it, so the figures block is absent
  // rather than rendered empty — including in the table of contents.
  await expect(
    page.getByRole("heading", { name: dict.article.relatedFigures, exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("#related-figures")).toHaveCount(0);
});

test("a dish hero renders its own artwork and names the AI provenance", async ({ page }) => {
  const dict = ui("hy");
  await page.goto("/hy/cuisine/khorovats");

  // The registered file, not the generated placeholder.
  await expect(page.locator("header figure img")).toHaveAttribute(
    "src",
    /khorovats\.webp/,
  );
  // A dish is a scene, not a likeness, so it takes the illustration caption —
  // and it must say "AI-generated" outright, as every other section's does.
  await expect(page.locator("header figcaption")).toHaveText(
    dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle("hy", "khorovats")),
  );
});

test("the sitemap lists each dish's illustration for image search", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const slug of SLUGS) {
    expect(xml, slug).toContain(`https://armat.site/images/cuisine/${slug}.webp`);
  }
});

test("the related-figures block still renders where an article has figures", async ({ page }) => {
  // Guards the conditional above: making it conditional must not remove it from
  // the categories that legitimately use it.
  await page.goto("/hy/history/tigran-the-great");
  await expect(
    page.getByRole("heading", { name: ui("hy").article.relatedFigures, exact: true }),
  ).toBeVisible();
});

test("the cuisine breadcrumb returns to the localized listing", async ({ page }) => {
  const dict = ui("hy");
  await page.goto("/hy/cuisine/gata");

  await page
    .getByRole("navigation", { name: dict.nav.breadcrumbLabel })
    .getByRole("link", { name: dict.listing.cuisine.title })
    .click();

  await expect(page).toHaveURL(/\/hy\/cuisine$/);
});

test("cuisine related links stay inside the section and the edition", async ({ page }) => {
  await page.goto("/hyw/cuisine/harissa");

  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>("main a[href^='/']")].map(
      (a) => a.getAttribute("href") ?? "",
    ),
  );

  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.every((href) => href.startsWith("/hyw") || href === "/sitemap.xml")).toBe(true);
});

/* -------------------------------------------------------------------------- */
/*  No untranslated fallback                                                   */
/* -------------------------------------------------------------------------- */

test("every dish is published in every edition — no unavailable page, no English leak", async ({
  page,
}) => {
  for (const locale of LOCALES) {
    const dict = ui(locale);

    for (const slug of SLUGS) {
      const response = await page.goto(`/${locale}/cuisine/${slug}`);
      expect(response?.status(), `${locale}/${slug}`).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        articleTitle(locale, slug),
      );
      await expect(
        page.getByRole("heading", { name: dict.unavailable.heading, level: 1 }),
      ).toHaveCount(0);
      // The article is indexable: the unavailable branch is what emits noindex.
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    }
  }
});

test("the Armenian editions never fall back to the English dish titles", async ({ page }) => {
  await page.goto("/hy/cuisine");
  // "Khorovats" is the English title; the Armenian card must carry Խորոված.
  await expect(page.getByText("Khorovats", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: articleTitle("hy", "khorovats") })).toBeVisible();
});

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

for (const locale of LOCALES) {
  test(`[${locale}] the main navigation reaches the cuisine section`, async ({ page }) => {
    const dict = ui(locale);
    await page.goto(`/${locale}`);

    await page
      .getByRole("navigation", { name: dict.nav.mainLabel })
      .getByRole("link", { name: dict.nav.cuisineShort, exact: true })
      .click();

    await expect(page).toHaveURL(new RegExp(`/${locale}/cuisine$`));
    await expect(
      page.getByRole("heading", { name: dict.listing.cuisine.title, level: 1 }),
    ).toBeVisible();
  });
}

test("the homepage category row offers cuisine alongside the other three", async ({ page }) => {
  const dict = ui("hy");
  await page.goto("/hy");

  const categories = page.locator("#categories");
  await expect(categories.getByRole("article")).toHaveCount(5);
  await expect(
    categories.getByRole("link", { name: dict.listing.cuisine.title }),
  ).toBeVisible();

  // Cuisine shipped without a banner and wore a colour wash until one arrived.
  // Places is now in the same position: five cards, four banners, and the fifth
  // carrying its section colour instead. The count is pinned so that a section
  // quietly losing its banner fails here rather than only looking wrong — and so
  // that Places gaining one is a deliberate change to this number.
  await expect(categories.locator("article img")).toHaveCount(4);
  await expect(categories.locator("article").nth(3).locator("img")).toHaveAttribute(
    "src",
    /category-armmeal\.webp/,
  );
});

test("the homepage cuisine row shows four dishes from this edition", async ({ page }) => {
  const dict = ui("hyw");
  await page.goto("/hyw");

  const row = page.locator("#cuisine");
  await expect(row.getByRole("heading", { name: dict.home.cuisineHeading })).toBeVisible();
  await expect(row.getByRole("article")).toHaveCount(4);

  // Every link in the row stays inside this edition's cuisine section — the
  // row is built from the locale bundle, so a leak here means a locale leak.
  const hrefs = await row
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.every((href) => href.startsWith("/hyw/cuisine"))).toBe(true);
});

test("the cuisine dropdown only offers pages inside this edition", async ({ page }) => {
  const dict = ui("hyw");
  await page.goto("/hyw");

  await page
    .getByRole("button", { name: dict.nav.submenuLabel.replace("{item}", dict.nav.cuisine) })
    .click();

  const nav = page.getByRole("navigation", { name: dict.nav.mainLabel });
  await expect(nav.getByRole("link", { name: dict.nav.allCuisineArticles })).toBeVisible();

  const hrefs = await nav
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(hrefs.filter((href) => href.startsWith("/")).every((href) => href.startsWith("/hyw"))).toBe(
    true,
  );
});

test("the footer explore column links to the cuisine listing", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: ui("en").nav.cuisine, exact: true }),
  ).toHaveAttribute("href", "/en/cuisine");
});

/* -------------------------------------------------------------------------- */
/*  Search                                                                     */
/* -------------------------------------------------------------------------- */

test("global search groups cuisine results under their own heading", async ({ page }) => {
  const dict = ui("hy");
  await page.goto(`/hy/search?q=${encodeURIComponent("լավաշ")}`);

  await expect(
    page.getByRole("main").getByRole("heading", { name: dict.search.groupCuisine, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: articleTitle("hy", "lavash") }),
  ).toBeVisible();
});

test("a Latin transliteration finds the Armenian dish article", async ({ page }) => {
  // The keyword list exists for exactly this: "ghapama" appears in no Armenian
  // field of the article except its authored transliterations.
  await page.goto("/hy/search?q=ghapama");

  await expect(
    page.getByRole("main").getByRole("heading", { name: ui("hy").search.groupCuisine, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: articleTitle("hy", "ghapama") }),
  ).toBeVisible();
});

test("the empty search page offers cuisine as a place to start", async ({ page }) => {
  await page.goto("/en/search");
  await expect(
    page.getByRole("link", { name: ui("en").search.browseCuisine }),
  ).toHaveAttribute("href", "/en/cuisine");
});

/* -------------------------------------------------------------------------- */
/*  SEO: hreflang, structured data, sitemap                                    */
/* -------------------------------------------------------------------------- */

test("every dish's metadata comes from its own SEO fields, in every edition", async ({ page }) => {
  /*
    Cuisine was the one category the August 2026 SEO batch skipped, so all six
    dishes fell back to `title` and `excerpt` for their `<title>` and their
    description. Nothing else in the suite asserts that `seoTitle` and
    `metaDescription` reach the head at all, in any category.

    The H1 assertion is the other half of it: `seoTitle` is written to be read
    in a results list with no page around it, and it must not replace the
    headline a reader sees. `articleMetadata` keeps them apart deliberately —
    see the note on `og:title` in `ArticleRoute.tsx`.
  */
  for (const locale of LOCALES) {
    for (const slug of SLUGS) {
      const article = bundle(locale).articles.find((entry) => entry.slug === slug);
      if (!article) throw new Error(`No "${slug}" in the "${locale}" bundle.`);
      const { seoTitle, metaDescription, title } = article;

      expect(seoTitle, `${locale}/${slug} has no seoTitle`).toBeTruthy();
      expect(metaDescription, `${locale}/${slug} has no metaDescription`).toBeTruthy();
      // A fallback would make these identical to the fields they override.
      expect(seoTitle).not.toBe(title);
      expect(metaDescription).not.toBe(article.excerpt);

      await page.goto(`/${locale}/cuisine/${slug}`);

      await expect(page).toHaveTitle(`${seoTitle} | ${ui(locale).site.name}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        metaDescription!,
      );

      // The visible headline stays the plain title, and the summary is rendered.
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator("#summary")).toBeVisible();
    }
  }
});

test("a cuisine article advertises all three editions and an x-default", async ({ page }) => {
  await page.goto("/hy/cuisine/dolma");

  for (const locale of LOCALES) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveCount(1);
  }
  const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
  await expect(xDefault).toHaveCount(1);
  await expect(xDefault).toHaveAttribute("href", /\/hy\/cuisine\/dolma$/);
});

test("the cuisine listing advertises an x-default in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine`);
    const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(xDefault).toHaveCount(1);
    await expect(xDefault).toHaveAttribute("href", /\/hy\/cuisine$/);
  }
});

test("the cuisine listing emits a CollectionPage whose count matches the cards", async ({
  page,
}) => {
  await page.goto("/hy/cuisine");

  const graph = await readGraph(page);
  const collection = node(graph, "CollectionPage");
  const list = collection.mainEntity as { numberOfItems?: number; itemListElement?: unknown[] };

  expect(list.numberOfItems).toBe(await cards(page).count());
  expect(list.itemListElement).toHaveLength(SLUGS.length);
});

test("a cuisine article emits an Article node, its citations and a breadcrumb trail", async ({
  page,
}) => {
  await page.goto("/en/cuisine/harissa");

  const graph = await readGraph(page);
  const article = node(graph, "Article");

  expect(article.headline).toBe("Harissa");
  expect(article.inLanguage).toBe("en");
  expect(article.articleSection).toBe("Armenian Cuisine");
  // The bibliography reaches the graph; an article with no citations would be
  // the signature of the fabricated-source problem the archive was audited for.
  expect(Array.isArray(article.citation)).toBe(true);
  expect((article.citation as unknown[]).length).toBeGreaterThan(0);

  // Deliberately not a Recipe: these pages are cultural articles and must not
  // claim to carry instructions a reader can cook from.
  expect(graph.map((entry) => entry["@type"])).not.toContain("Recipe");

  const crumbs = node(graph, "BreadcrumbList").itemListElement as {
    position: number;
    name: string;
    item?: string;
  }[];
  crumbs.forEach((crumb, index) => expect(crumb.position).toBe(index + 1));
  expect(crumbs.at(-1)?.name).toBe("Harissa");
  expect(crumbs.at(-1)?.item).toBeUndefined();
});

test("the sitemap carries every cuisine page in every edition", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const locale of LOCALES) {
    expect(xml, `${locale} listing`).toContain(`/${locale}/cuisine</loc>`);
    for (const slug of SLUGS) {
      expect(xml, `${locale}/${slug}`).toContain(`/${locale}/cuisine/${slug}</loc>`);
    }
  }

  // And each entry advertises the translations that exist.
  expect(xml).toContain('hreflang="hyw" href="https://armat.site/hyw/cuisine/lavash"');
  expect(xml).toContain('hreflang="x-default" href="https://armat.site/hy/cuisine/lavash"');
});
