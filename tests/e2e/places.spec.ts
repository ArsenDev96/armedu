import { expect, test } from "@playwright/test";
import { LOCALES, articleTitle, bundle, cards, ui } from "./helpers";

/**
 * The Places section — foundation step.
 *
 * Places is the fifth category, and the point of these tests is *integration*
 * rather than coverage of one article: a new `CategoryId` has to land in every
 * place a reader or a crawler meets a category, and several of those places are
 * hand-maintained lists that compile perfectly well when a category is missing
 * from them.
 *
 * The search-grouping assertion is the sharpest of them. Until this change the
 * group list on the search page was a literal cast, so a new category would be
 * indexed, findable from a listing, and absent from `/search` — a failure with
 * no compile error and no visible symptom except the one thing not being there.
 */

const SLUG = "khor-virap";

const placeTypeLabel = (locale: "hy" | "hyw" | "en", id: string) => {
  const filter = bundle(locale).placeTypes.find((entry) => entry.id === id);
  if (!filter) throw new Error(`No "${id}" place type in "${locale}".`);
  return filter.label;
};

/* -------------------------------------------------------------------------- */
/*  Listing and article, in every edition                                      */
/* -------------------------------------------------------------------------- */

for (const locale of LOCALES) {
  test(`[${locale}] the places listing and the article both load in this edition`, async ({
    page,
  }) => {
    const dict = ui(locale);

    const listing = await page.goto(`/${locale}/places`);
    expect(listing?.status(), `${locale}/places`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      page.getByRole("heading", { name: dict.listing.places.title, level: 1 }),
    ).toBeVisible();
    await expect(cards(page)).toHaveCount(1);

    const article = await page.goto(`/${locale}/places/${SLUG}`);
    expect(article?.status(), `${locale}/places/${SLUG}`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      articleTitle(locale, SLUG),
    );

    // Published, not "not translated in this language", and indexable.
    await expect(
      page.getByRole("heading", { name: dict.unavailable.heading, level: 1 }),
    ).toHaveCount(0);
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  });
}

test("the Armenian editions never fall back to the English place title", async ({ page }) => {
  await page.goto("/hy/places");
  await expect(page.getByText("Khor Virap", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: articleTitle("hy", SLUG) }).first()).toBeVisible();
});

test("the places listing filters by kind of site, and keeps it in the URL", async ({ page }) => {
  await page.goto("/en/places");
  await expect(cards(page)).toHaveCount(1);

  await page.getByRole("button", { name: placeTypeLabel("en", "monastery") }).click();

  await expect(cards(page)).toHaveCount(1);
  await expect(page).toHaveURL(/[?&]type=monastery/);
  // The filter key is `type`, like cuisine and works — not `period`.
  await expect(page).not.toHaveURL(/period=/);

  // And the query parameter restores the state on a cold load.
  await page.goto("/en/places?type=monastery");
  await expect(
    page.getByRole("button", { name: placeTypeLabel("en", "monastery") }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("the featured block comes from the flag, not a hard-coded slug", async ({ page }) => {
  const dict = ui("en");
  await page.goto("/en/places");

  await expect(page.getByText(dict.listing.places.featuredEyebrow)).toBeVisible();
  // `.first()` is the featured block's own link; the card below repeats the label.
  await expect(
    page.getByRole("link", { name: dict.listing.places.readArticle }).first(),
  ).toHaveAttribute("href", `/en/places/${SLUG}`);

  // The article carries the flag the listing reads.
  const article = bundle("en").articles.find((entry) => entry.slug === SLUG);
  expect(article?.featured, "khor-virap should be the flagged entry").toBe(true);
});

/* -------------------------------------------------------------------------- */
/*  Registration across the application                                        */
/* -------------------------------------------------------------------------- */

test("the header navigation reaches the places section", async ({ page }) => {
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}`);

    await page
      .getByRole("navigation", { name: dict.nav.mainLabel })
      .getByRole("link", { name: dict.nav.places, exact: true })
      .click();

    await expect(page).toHaveURL(new RegExp(`/${locale}/places$`));
    await expect(
      page.getByRole("heading", { name: dict.listing.places.title, level: 1 }),
    ).toBeVisible();
  }
});

test("the footer explore column links to the places listing", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: ui("en").nav.places, exact: true }),
  ).toHaveAttribute("href", "/en/places");
});

test("the homepage category row now carries five sections including places", async ({ page }) => {
  await page.goto("/hy");

  // The card shows the `categories` entry's own title, which is the short nav
  // label rather than the listing's page heading.
  const card = bundle("hy").categories.find((entry) => entry.id === "places");
  if (!card) throw new Error('No "places" category card in the "hy" bundle.');

  const categories = page.locator("#categories");
  await expect(categories.getByRole("article")).toHaveCount(5);
  await expect(categories.getByRole("link", { name: card.title }).first()).toBeVisible();

  // Five cards over a twelve-column track: three, then two. Nothing may be left
  // stranded in an empty column, and the row must not push the page sideways.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("a place appears under its own group in global search", async ({ page }) => {
  /*
    The group list on the search page used to be a literal cast rather than a
    checked value, so a fifth category would have been indexed and searchable
    everywhere except here. This is that regression.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Khor%20Virap");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.getByRole("link", { name: articleTitle("en", SLUG) }).first()).toBeVisible();
});

test("the empty search page offers places as a place to start", async ({ page }) => {
  await page.goto("/en/search");
  await expect(
    page.getByRole("link", { name: ui("en").search.browsePlaces }),
  ).toHaveAttribute("href", "/en/places");
});

/* -------------------------------------------------------------------------- */
/*  Artwork                                                                    */
/* -------------------------------------------------------------------------- */

/*
  Khor Virap shipped without a cover and rendered the generated placeholder. The
  file now exists at `/images/places/khor-virap.png` and is registered in
  `IMAGES`, which is a single entry that has to light up six different surfaces —
  every one of them reached through `getImageSrc`, and every one of them silent
  if the registration is wrong.

  The caption is the assertion that matters most. `isGeneratedArtwork` flips to
  true the moment a slug enters the registry, and that is what makes the page
  state "AI-generated" rather than "placeholder". A registration that rendered
  the picture without the disclosure would look completely correct.
*/

test("the article hero renders the registered artwork and names the AI provenance", async ({
  page,
}) => {
  const dict = ui("hy");
  await page.goto("/hy/places/khor-virap");

  // Next's optimizer rewrites `src` into `/_next/image?url=…`, so the encoded
  // original is what identifies the file.
  const hero = page.locator("header figure img");
  await expect(hero).toHaveAttribute("src", /khor-virap\.png/);

  // A place is a scene, not a likeness, so it takes the illustration wording —
  // the same branch the cuisine artwork uses, and not the portrait one.
  await expect(page.locator("header figcaption")).toHaveText(
    dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle("hy", "khor-virap")),
  );
});

test("the listing's featured block and card both render the artwork", async ({ page }) => {
  await page.goto("/en/places");

  // `ArticleCard` is the shared component — the same one a related-articles
  // block renders — so this covers both surfaces through one lookup.
  const images = page.locator("main img");
  await expect(images).not.toHaveCount(0);

  const sources = await images.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("src") ?? ""),
  );
  expect(
    sources.every((src) => /khor-virap\.png/.test(decodeURIComponent(src))),
    `every image on the places listing should be the registered artwork, got ${sources.join(", ")}`,
  ).toBe(true);
});

test("a place's search thumbnail renders the artwork", async ({ page }) => {
  await page.goto("/en/search?q=Khor%20Virap");

  const thumb = page.getByRole("main").locator("img").first();
  await expect(thumb).toHaveAttribute("src", /khor-virap\.png/);
});

test("the artwork reaches Open Graph, Twitter and the article's structured data", async ({
  page,
}) => {
  await page.goto("/en/places/khor-virap");

  // Absolute, because several scrapers do not resolve relative image URLs.
  const expected = "https://armat.site/images/places/khor-virap.png";
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", expected);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", expected);
  // Not the generic site card any more.
  await expect(page.locator('meta[property="og:image"]')).not.toHaveAttribute(
    "content",
    /og-default/,
  );

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "") as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article?.image).toEqual({ "@type": "ImageObject", url: expected });
});

test("the sitemap carries the place's illustration for image search", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("https://armat.site/images/places/khor-virap.png");
});

/* -------------------------------------------------------------------------- */
/*  SEO                                                                        */
/* -------------------------------------------------------------------------- */

test("the place article uses its own SEO fields and advertises every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === SLUG);
    if (!article) throw new Error(`No "${SLUG}" in the "${locale}" bundle.`);

    await page.goto(`/${locale}/places/${SLUG}`);

    // Metadata from `seoTitle`/`metaDescription`, not from title/excerpt.
    expect(article.seoTitle, `${locale} seoTitle`).toBeTruthy();
    expect(article.metaDescription, `${locale} metaDescription`).toBeTruthy();
    await expect(page).toHaveTitle(`${article.seoTitle} | ${ui(locale).site.name}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      article.metaDescription!,
    );

    // Canonical, and one alternate per edition plus x-default.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/places/${SLUG}`,
    );
    for (const other of LOCALES) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${other}"]`)).toHaveCount(1);
    }
    const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(xDefault).toHaveCount(1);
    await expect(xDefault).toHaveAttribute("href", new RegExp(`/hy/places/${SLUG}$`));
  }
});

test("a place emits the generic Article schema and no tourism types", async ({ page }) => {
  await page.goto("/en/places/khor-virap");

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "") as { "@graph": { "@type"?: string }[] })["@graph"];
  const types = graph.map((entry) => entry["@type"]);

  expect(types).toContain("Article");
  expect(types).toContain("BreadcrumbList");
  // v1 deliberately ships no place-specific structured data: the page does not
  // carry the properties `Place`, `TouristAttraction` or `LocalBusiness` promise.
  for (const forbidden of ["Place", "TouristAttraction", "LocalBusiness"]) {
    expect(types, `${forbidden} must not be emitted yet`).not.toContain(forbidden);
  }
});

test("the sitemap carries every places URL in every edition", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const locale of LOCALES) {
    expect(xml, `${locale} listing`).toContain(`https://armat.site/${locale}/places</loc>`);
    expect(xml, `${locale} article`).toContain(
      `https://armat.site/${locale}/places/${SLUG}</loc>`,
    );
  }
});

/* -------------------------------------------------------------------------- */
/*  Existing categories are unaffected                                         */
/* -------------------------------------------------------------------------- */

test("the four existing category listings still load and still count what they did", async ({
  page,
}) => {
  const dict = ui("en");
  const expected: [string, number, string][] = [
    ["history", 7, dict.listing.history.title],
    ["writers", 6, dict.listing.writers.title],
    ["works", 4, dict.listing.works.title],
    ["cuisine", 6, dict.listing.cuisine.title],
  ];

  for (const [path, count, heading] of expected) {
    const response = await page.goto(`/en/${path}`);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    await expect(cards(page), `${path} card count`).toHaveCount(count);
  }
});
