import { expect, test, type Page } from "@playwright/test";
import { PENDING_ARTWORK, getImageSrc } from "@/lib/media";
import { getSources } from "@/data/sources";
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
 * of a translation gap: every dish is published in all three editions, so no
 * cuisine URL may ever render the "not available in this language" page.
 */

const SPAS = "spas";
const JINGALOV = "jingalov-hats";
const KHASH = "khash";
const MATSUN = "matsun";

/** Every dish in the section, as of §74. */
const SLUGS = [
  "lavash",
  "dolma",
  "khorovats",
  "harissa",
  "gata",
  "ghapama",
  SPAS,
  JINGALOV,
  KHASH,
  MATSUN,
] as const;

/**
 * The dishes that have a registered cover — §68, and the first time this section
 * has needed the distinction at all.
 *
 * Cuisine shipped its first six articles with their artwork already in place, so
 * `SLUGS` and this list were the same set and no separate list existed. Spas is
 * the section's first article to ship ahead of its picture, which is exactly the
 * situation `places.spec.ts` has been in twelve times: what must *exist* and what
 * must *render a raster* stop being the same question, and a single list can only
 * answer one of them.
 *
 * §69 closed the gap, §70 opened it with `jingalov-hats`, §71 closed it, §72
 * opened it with `khash`, §73 closed it, and §74 has opened it a fourth time with
 * `matsun` — which is why the declaration was kept separate rather than collapsed
 * back into `SLUGS`. Every assertion below that says "each illustrated dish" has
 * gone on meaning that across all seven moves, and not one of them has needed an
 * edit for any of them. The note left at §73 said the tenth dish would reopen it.
 * It did, which is the second time that prediction has been written down and then
 * come true, and the reason the empty declaration is never deleted.
 *
 * Kept as its own literal rather than derived from `getImageSrc`, for the reason
 * the Places file gives: a derived list agrees with the registry by construction,
 * including on the day the registry is wrong.
 */
const ILLUSTRATED = [
  "lavash",
  "dolma",
  "khorovats",
  "harissa",
  "gata",
  "ghapama",
  SPAS,
  JINGALOV,
  KHASH,
] as const;

/** The dishes still waiting for one. Derived from nothing — stated. */
const PENDING: readonly string[] = [MATSUN];

/** Where each dish's cover must live, spelled out rather than templated. */
const ARTWORK: Record<string, string> = {
  lavash: "/images/cuisine/lavash.webp",
  dolma: "/images/cuisine/dolma.webp",
  khorovats: "/images/cuisine/khorovats.webp",
  harissa: "/images/cuisine/harissa.webp",
  gata: "/images/cuisine/gata.webp",
  ghapama: "/images/cuisine/ghapama.webp",
  spas: "/images/cuisine/spas.webp",
  "jingalov-hats": "/images/cuisine/jingalov-hats.webp",
  khash: "/images/cuisine/khash.webp",
};

const dishTypeLabel = (locale: "hy" | "hyw" | "en", id: string) => {
  const filter = bundle(locale).cuisineTypes.find((entry) => entry.id === id);
  if (!filter) throw new Error(`No "${id}" cuisine type in "${locale}".`);
  return filter.label;
};

const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

  /*
    §70. `bread` stopped being a single-article filter when jingalov hats arrived,
    which is what made this test fail — correctly, and for the same reason `main`
    changed shape at §68 when spas joined dolma.

    The count moved and the claim did not: the URL parameter restores the filter,
    and what comes back is exactly the breads. Asserting both titles rather than
    only the first is the stronger version of what was here before, because a
    filter that returned the right *number* of wrong cards would have passed the
    old assertion.
  */
  await expect(cards(page)).toHaveCount(2);
  for (const title of ["Lavash", "Jingalov Hats"]) {
    await expect(cards(page).filter({ hasText: title }), title).toHaveCount(1);
  }
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

test("the sitemap gives every dish, in every edition, its own image", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  /*
    §69 replaces a global filename count with a route-by-route claim, because the
    two are not the same test. Every cuisine cover appearing *somewhere* in the
    document was already true while spas had no artwork at all, and would stay true
    if this route advertised harissa's picture. What has to hold is narrower: the
    `<url>` block for each dish, in each edition, carries its own file and no other
    dish's.
  */
  const blocks = xml.split("<url>").slice(1);

  for (const locale of LOCALES) {
    for (const slug of ILLUSTRATED) {
      const block = blocks.find((entry) => entry.includes(`/${locale}/cuisine/${slug}</loc>`));
      expect(block, `${locale}/${slug} must have a sitemap entry`).toBeDefined();
      expect(block, `${locale}/${slug} advertises its own image`).toContain(
        `<image:loc>https://armat.site${ARTWORK[slug]}</image:loc>`,
      );

      for (const other of ILLUSTRATED) {
        if (other === slug) continue;
        expect(block, `${locale}/${slug} must not advertise ${other}`).not.toContain(
          ARTWORK[other],
        );
      }
    }

    /*
      §70. The other half of the claim, and the half that catches a wrong
      registration rather than a missing one: a dish with no artwork contributes no
      `image:loc` at all, and borrows nobody's. An entry here for a file that does
      not exist is a broken image handed straight to an image crawler.
    */
    for (const slug of PENDING) {
      const block = blocks.find((entry) => entry.includes(`/${locale}/cuisine/${slug}</loc>`));
      expect(block, `${locale}/${slug} must have a sitemap entry`).toBeDefined();
      expect(block, `${locale}/${slug} has no artwork to advertise`).not.toContain("<image:loc>");
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  Spas — Cuisine #7, §68                                                     */
/* -------------------------------------------------------------------------- */

test("the seventh dish exists in every edition and is a main dish", async ({ page }) => {
  /*
    The corpus assertions, kept as data rather than as page loads where they can be.

    Cuisine has had six articles since the section was written, and the count is
    pinned rather than derived for the reason every count in this repo is: a
    listing that quietly lost a card looks completely finished.
  */
  for (const locale of LOCALES) {
    const dishes = bundle(locale).articles.filter((a) => a.category === "cuisine");
    expect(dishes.length, `${locale} dish count`).toBe(SLUGS.length);
    expect(
      dishes.map((a) => a.slug),
      `${locale} keeps the section in one order`,
    ).toEqual([...SLUGS]);

    const spas = dishes.find((a) => a.slug === SPAS);
    expect(spas, `${locale} has spas`).toBeDefined();
    expect(spas!.dishTypeId, `${locale} type`).toBe("main");
    expect(spas!.featured ?? false, `${locale}: no cuisine article is featured`).toBe(false);
  }

  // No new dish type was invented to hold a soup — the §67 audit's constraint.
  for (const locale of LOCALES) {
    expect(
      bundle(locale).cuisineTypes.map((t) => t.id),
      // §74 appends `dairy`. Both of these went red on it, which is what a
      // spelled-out vocabulary is for: a new type cannot enter the section
      // without every test that describes the section noticing.
      `${locale} taxonomy`,
    ).toEqual(["all", "bread", "main", "meat", "ceremonial", "dessert", "dairy"]);
  }

  // And the type genuinely holds two dishes now, which is the visible half.
  await page.goto("/en/cuisine?type=main");
  await expect(cards(page)).toHaveCount(2);
  for (const slug of ["dolma", SPAS]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug), exact: true }).first(),
    ).toBeVisible();
  }
});

test("spas renders in every edition and carries its own SEO fields", async ({ page }) => {
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SPAS)!;
    await page.goto(`/${locale}/cuisine/${SPAS}`);

    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(article.title);

    // This edition's own title, never the default edition's.
    await expect(page).toHaveTitle(new RegExp(article.seoTitle!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/cuisine/${SPAS}`,
    );
    for (const alternate of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${alternate}"]`),
      ).toHaveAttribute("href", `https://armat.site/${alternate}/cuisine/${SPAS}`);
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      `https://armat.site/hy/cuisine/${SPAS}`,
    );
  }
});

test("spas is findable in search, under the cuisine group", async ({ page }) => {
  await page.goto("/en/search?q=spas");
  const result = page.getByRole("link", { name: articleTitle("en", SPAS), exact: true }).first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("href", `/en/cuisine/${SPAS}`);
});

test("spas makes no claim about antiquity, invention or health", async ({ page }) => {
  /*
    The three claim classes §67 identified as the real risk for this dish, checked
    against the rendered page in every edition rather than against the source file,
    because what a reader meets is the page.

    These are deliberately phrased as *absences*. A dish whose written record is
    thin is exactly where a confident sentence gets invented, and the Armenian
    editions are where an English review would not catch it.
  */
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${SPAS}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();

    // No invention or ownership claim, in any edition.
    for (const forbidden of [
      "invented",
      "the world's oldest",
      "oldest soup",
      "thousands of years",
      "հնագույն",
      "հազարավոր տարի",
      "հազարաւոր տարի",
      "հայերը հորինել",
      "հայերը գիւտ",
    ]) {
      expect(text, `${locale} must not claim: ${forbidden}`).not.toContain(forbidden);
    }

    // No health or nutrition claim. Matsun is described as fermented milk and
    // nothing more — the article states ingredients, never benefits.
    for (const forbidden of [
      "probiotic",
      "immune",
      "digestion",
      "superfood",
      "weight loss",
      "healthy",
      "մարսողութ",
      "օգտակար է առողջ",
      "իմունիտետ",
    ]) {
      expect(text, `${locale} must not claim: ${forbidden}`).not.toContain(forbidden);
    }

    // Not a recipe page: no quantities, no timings, no shopping framing.
    for (const forbidden of ["tablespoon", "teaspoon", "servings", "prep time", "easy recipe"]) {
      expect(text, `${locale} must not read as a recipe: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("spas keeps the two names open, and the stirring advice as custom", async ({ page }) => {
  /*
    The two evidence-sensitive treatments §67 asked for, pinned so that a later
    edit cannot quietly simplify either into the confident version.

    The naming section must not flatten to "spas, also called tanapur": the sources
    do not settle whether the two ever meant different things, and the article says
    so. And the familiar "stir in one direction" must stay marked as kitchen custom
    rather than promoted into a mechanism — the accounts that explain the chemistry
    deal in temperature, acidity, agitation and stabilisers, not direction.
  */
  await page.goto(`/en/cuisine/${SPAS}`);
  const text = (await page.getByRole("main").textContent()) ?? "";

  expect(text, "the names are not asserted as settled synonyms").toContain(
    "is not something the available sources settle",
  );
  expect(text, "the age of the word is separated from the age of the dish").toContain(
    "What the age of the words does not establish is the age of the soup",
  );
  expect(text, "the stirring advice is marked as custom").toContain(
    "kitchen custom rather than a mechanism",
  );

  // The chemistry is stated as the reason, which is what makes the custom claim
  // safe to make: the article explains what does matter before saying what does not.
  expect(text, "the actual mechanism is given").toContain("once the milk has turned acidic");
});

test("spas introduces matsun without becoming the matsun article", async ({ page }) => {
  /*
    §67 wanted matsun established here and deliberately left with material for its
    own future article. Both halves are checkable: the base has to be explained,
    and the article has to say out loud that the wider account belongs elsewhere.
  */
  await page.goto(`/en/cuisine/${SPAS}`);
  const text = (await page.getByRole("main").textContent()) ?? "";

  expect(text, "matsun is defined").toContain("milk fermented by bacteria");
  expect(text, "the article defers the rest").toContain("belongs to an article of its own");

  // And no slug was invented for the article that does not exist yet.
  const hrefs = await page
    .getByRole("main")
    .locator("a")
    .evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href") ?? ""));
  expect(hrefs.some((h) => h.includes("/matsun")), "no link to a nonexistent matsun page").toBe(
    false,
  );
});

test("spas owns its artwork in every edition, and borrows nobody else's", async ({ page }) => {
  /*
    §69 inverts the §68 test rather than deleting it. Every assertion that pinned
    the pending state has a mirror here, so the transition is checked in both
    directions: the raster present where the placeholder was, the AI caption where
    the placeholder caption was, the slug out of `PENDING_ARTWORK` where it was in,
    and the real file where the fallback OG image was.

    A registration that flipped some of these and not others — a registry key with
    no rendered image, or a rendered image still captioned as a placeholder — is
    exactly the half-done state this shape catches.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/cuisine/${SPAS}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    await expect(figure.locator("img"), `${locale} raster`).toHaveCount(1);
    await expect(figure.locator("img"), `${locale} exact file`).toHaveAttribute(
      "src",
      /spas\.webp/,
    );

    // A dish is a scene rather than a likeness, so it takes the illustration
    // caption — and it must say "AI-generated" outright, as the other six do.
    await expect(figure.locator("figcaption"), locale).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, SPAS)),
    );
    await expect(figure.locator("figcaption"), `${locale} not the placeholder line`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, SPAS)),
    );
  }

  expect(getImageSrc(SPAS), "registered file").toBe(ARTWORK[SPAS]);
  expect(PENDING_ARTWORK, "no longer pending").not.toContain(SPAS);

  /*
    And it still borrows nothing. Harissa is named first because it is the real
    risk: the §68 refusal note records that its cover is also a pale grain dish in a
    clay bowl with lavash beside it, which is a description a careless substitution
    would pass. Scoped to the hero and the metadata, since related links legitimately
    render harissa's and lavash's covers further down the page.
  */
  await page.goto(`/en/cuisine/${SPAS}`);
  const heroSources = await page
    .locator("header img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  expect(
    heroSources.some((src) => src.includes(ARTWORK[SPAS])),
    "the hero is spas's own file",
  ).toBe(true);
  for (const other of ILLUSTRATED) {
    if (other === SPAS) continue;
    expect(
      heroSources.some((src) => src.includes(`/cuisine/${other}.webp`)),
      `${other} must not illustrate spas`,
    ).toBe(false);
  }

  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(property).first().getAttribute("content");
    expect(content, property).toContain(ARTWORK[SPAS]);
    expect(content, `${property} is no longer the fallback`).not.toContain("/og-default.png");
  }

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "") as { "@graph": LdNode[] })["@graph"];
  expect(JSON.stringify(node(graph, "Article").image), "Article.image").toContain(ARTWORK[SPAS]);
});

test("no dish's cover is another dish's, across the whole section", async ({ page }) => {
  /*
    The whole-section ownership claim, which is the one a single new key in a flat
    map can break without touching any file but `media.ts`. Each hero must carry its
    own cover and none of the others.

    Written for seven dishes at §69 and covering eight since §71, with no edit: it
    iterates `ILLUSTRATED`, so every registration this section makes is checked
    against every cover it already had.

    English only: the artwork registry is not localized, and the per-edition claim is
    made for the newest dish by the test above.
  */
  for (const slug of ILLUSTRATED) {
    await page.goto(`/en/cuisine/${slug}`);

    const sources = await page
      .locator("header img")
      .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));

    expect(sources.some((src) => src.includes(ARTWORK[slug])), `${slug} shows its own`).toBe(true);
    for (const other of ILLUSTRATED) {
      if (other === slug) continue;
      expect(
        sources.some((src) => src.includes(ARTWORK[other])),
        `${slug} must not show ${other}`,
      ).toBe(false);
    }
  }
});

test("the spas search result carries its own thumbnail", async ({ page }) => {
  /*
    Scoped by canonical href rather than by title, because a search page renders many
    covers and the failure worth catching is this row showing a neighbour's.
  */
  await page.goto("/en/search?q=spas");

  const row = page.locator("li").filter({ has: page.locator(`a[href="/en/cuisine/${SPAS}"]`) });
  await expect(row).toHaveCount(1);

  const sources = await row
    .locator("img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  expect(sources.some((src) => src.includes(ARTWORK[SPAS])), "spas thumbnail").toBe(true);
  expect(
    sources.some((src) => src.includes("/cuisine/harissa.webp")),
    "not harissa's",
  ).toBe(false);
});

test("spas gained a picture and no recipe markup with it", async ({ page }) => {
  /*
    §69's one structured-data guard. Registering artwork is the moment a food page
    most looks like it wants a `Recipe` node — a photograph of a finished dish is
    what that markup is built around — and this archive's cuisine pages are cultural
    articles that carry no instructions a reader could cook from.
  */
  await page.goto(`/en/cuisine/${SPAS}`);
  const graph = await readGraph(page);
  const types = graph.map((entry) => entry["@type"]);

  expect(types).toContain("Article");
  for (const forbidden of [
    "Recipe",
    "HowTo",
    "NutritionInformation",
    "MenuItem",
    "FoodEstablishment",
  ]) {
    expect(types, `${forbidden} must not appear`).not.toContain(forbidden);
  }

  const raw = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  for (const key of ["recipeIngredient", "recipeInstructions", "cookTime", "nutrition"]) {
    expect(raw, `${key} must not appear`).not.toContain(key);
  }
});

test("the cuisine listing shows exactly one placeholder", async ({ page }) => {
  /*
    Derived from the two lists rather than typed as a literal, and this is the
    seventh value the same expression has produced without being edited: 0, 1, 0, 1,
    0, 1, 0, and 1 again now that matsun is waiting. A literal would have been wrong
    seven times over, and the test name is the only part that has ever changed.
  */
  await page.goto("/en/cuisine");
  await expect(cards(page)).toHaveCount(SLUGS.length);
  await expect(page.locator("main svg[role='img']")).toHaveCount(
    SLUGS.length - ILLUSTRATED.length,
  );

  for (const slug of ILLUSTRATED) {
    await expect(
      page.locator(`main img[src*="${slug}"]`),
      `${slug} still has its own card artwork`,
    ).not.toHaveCount(0);
  }
});

test("spas cites what it rests on, and not the section's default book", async ({ page }) => {
  /*
    §67 recorded that Petrosian & Underwood appears in five of the six existing
    Cuisine articles and asked for it not to be reused by reflex. This pins the
    decision so a later edit has to argue with it rather than drift back.

    The positive half matters more than the negative one: the two claims this
    article actually turns on — the chemistry of heating acidic dairy, and the
    sense-range of the word — must each have a source behind them.
  */
  const sources = getSources(SPAS);
  expect(sources.length, "spas has a bibliography").toBeGreaterThanOrEqual(4);

  const titles = sources.map((s) => s.title).join(" | ");
  expect(titles, "the chemistry is sourced").toContain("On Food and Cooking");
  expect(titles, "the lexicography is sourced").toContain("Nor baṛgirkʻ haykazean lezui");
  expect(titles, "the regional context comes from outside Armenian scholarship").toContain(
    "ĀŠPAZĪ",
  );
  expect(titles, "the section's default book is not reused here").not.toContain(
    "Fact, Fiction & Folklore",
  );

  // Every entry carries an identifier, and no two entries share one.
  const ids = sources.map((s) => `${s.identifier.kind}:${s.identifier.value}`);
  expect(new Set(ids).size, "no identifier is repeated within the article").toBe(ids.length);

  // The bibliography reaches the page.
  await page.goto(`/en/cuisine/${SPAS}`);
  const text = (await page.getByRole("main").textContent()) ?? "";
  for (const source of sources) expect(text, source.title).toContain(source.title);
});

test("spas links only where the prose earns it", async ({ page }) => {
  /*
    Two authored relations, both carried by a `SectionLink` in the paragraph that
    justifies them — and those are the first `SectionLink`s anywhere in this
    section, which until §68 had none at all.

    Two rather than three is deliberate. `getRelatedArticles` fills a short list
    from the same category in registry order, so a third slot is filled for us; the
    §67 audit asked for strong authored links over filler suppression, and what the
    filler actually is gets recorded rather than papered over.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SPAS)!;
    expect(article.relatedSlugs, `${locale} relations`).toEqual(["harissa", "lavash"]);

    const links = article.sections.flatMap((s) => (s.links ?? []).map((l) => l.slug));
    expect(links.sort(), `${locale} prose links`).toEqual(["harissa", "lavash"]);

    // Every link phrase is a real substring of a paragraph in its own section.
    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((p) => p.includes(link.phrase)),
          `${locale}: "${link.phrase}" must appear in ${section.id}`,
        ).toBe(true);
      }
    }
  }

  // And the rendered links go to this edition's own pages.
  await page.goto(`/hy/cuisine/${SPAS}`);
  for (const target of ["harissa", "lavash"]) {
    await expect(
      page.getByRole("main").locator(`a[href="/hy/cuisine/${target}"]`).first(),
      target,
    ).toBeVisible();
  }
});

/* -------------------------------------------------------------------------- */
/*  Jingalov hats — Cuisine #8, §70                                            */
/* -------------------------------------------------------------------------- */

test("the eighth dish exists in every edition and is the section's second bread", async ({
  page,
}) => {
  for (const locale of LOCALES) {
    const dishes = bundle(locale).articles.filter((a) => a.category === "cuisine");
    expect(dishes.length, `${locale} dish count`).toBe(SLUGS.length);
    expect(
      dishes.map((a) => a.slug),
      `${locale} keeps the section in one order`,
    ).toEqual([...SLUGS]);

    const dish = dishes.find((a) => a.slug === JINGALOV);
    expect(dish, `${locale} has jingalov hats`).toBeDefined();
    expect(dish!.dishTypeId, `${locale} type`).toBe("bread");
    expect(dish!.featured ?? false, `${locale}: no cuisine article is featured`).toBe(false);

    // No new type was invented to hold a regional filled bread, which is the
    // constraint §70 set and the easiest one to break by accident.
    expect(
      bundle(locale).cuisineTypes.map((t) => t.id),
      // §74 appends `dairy`. Both of these went red on it, which is what a
      // spelled-out vocabulary is for: a new type cannot enter the section
      // without every test that describes the section noticing.
      `${locale} taxonomy`,
    ).toEqual(["all", "bread", "main", "meat", "ceremonial", "dessert", "dairy"]);

    // The whole type distribution, not only the type that moved.
    const byType = dishes.reduce<Record<string, number>>((acc, a) => {
      acc[a.dishTypeId!] = (acc[a.dishTypeId!] ?? 0) + 1;
      return acc;
    }, {});
    // §72 moved meat from one to two; §74 adds the dairy type with matsun in it.
    // Written out in full rather than asserting only the type that moved, which is
    // why each addition has had to come through here rather than past it.
    expect(byType, `${locale} distribution`).toEqual({
      bread: 2,
      main: 2,
      meat: 2,
      ceremonial: 2,
      dessert: 1,
      dairy: 1,
    });
  }

  // And the filter genuinely returns two breads now, which is the visible half.
  await page.goto("/en/cuisine?type=bread");
  await expect(cards(page)).toHaveCount(2);
  for (const slug of ["lavash", JINGALOV]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug), exact: true }).first(),
    ).toBeVisible();
  }
});

test("jingalov hats renders in every edition and carries its own SEO fields", async ({ page }) => {
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === JINGALOV)!;
    await page.goto(`/${locale}/cuisine/${JINGALOV}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(article.title);
    await expect(page).toHaveTitle(new RegExp(article.seoTitle ?? article.title));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/cuisine/${JINGALOV}`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      article.metaDescription!,
    );

    for (const other of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${other}"]`),
        `${locale} advertises ${other}`,
      ).toHaveAttribute("href", `https://armat.site/${other}/cuisine/${JINGALOV}`);
    }
  }
});

test("jingalov hats is findable in search, under the cuisine group", async ({ page }) => {
  /*
    §70 asked that the article be reachable through the forms a reader would
    actually type, which for this dish means several transliterations and the
    region's name. Each is checked as a query rather than asserted against the
    keyword array, because a keyword nothing searches for is not findability.
  */
  for (const query of ["jingalov hats", "zhingyalov", "zhengyalov", "Artsakh"]) {
    await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.locator(`a[href="/en/cuisine/${JINGALOV}"]`).first(),
      `"${query}" must reach the article`,
    ).toBeVisible();
  }

  // And in Armenian, under the edition's own spelling of the name.
  await page.goto(`/hy/search?q=${encodeURIComponent("ժենգյալով")}`);
  await expect(page.locator(`a[href="/hy/cuisine/${JINGALOV}"]`).first()).toBeVisible();
});

test("jingalov hats claims no invention, no antiquity and no health benefit", async ({ page }) => {
  /*
    The claim classes §70 named, checked against the rendered page in every edition
    rather than against the source file, because what a reader meets is the page.

    Phrased as absences on purpose. A dish with a thin written record and a strong
    emotional charge is exactly where a confident sentence gets invented, and the
    Armenian editions are where an English review would not catch it.
  */
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${JINGALOV}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();

    // No origin competition and no invention claim.
    for (const forbidden of [
      "invented",
      "the world's oldest",
      "oldest bread",
      "thousands of years",
      "since antiquity",
      "հնագույն",
      "հազարավոր տարի",
      "հազարաւոր տարի",
      "հորինել",
      "հնարել",
    ]) {
      expect(text, `${locale} must not claim: ${forbidden}`).not.toContain(forbidden);
    }

    // No nutrition or wellness framing, which a dish made almost entirely of
    // greens attracts more strongly than anything else in this section.
    for (const forbidden of [
      "superfood",
      "detox",
      "vitamin",
      "immune",
      "antioxidant",
      "weight loss",
      "medicinal",
      "healthy",
      "վիտամին",
      "իմունիտետ",
      "բուժիչ",
      "օգտակար է առողջ",
    ]) {
      expect(text, `${locale} must not claim: ${forbidden}`).not.toContain(forbidden);
    }

    // Not a recipe page.
    for (const forbidden of [
      "tablespoon",
      "teaspoon",
      "servings",
      "prep time",
      "easy recipe",
      "ճաշի գդալ",
      "թեյի գդալ",
    ]) {
      expect(text, `${locale} must not read as a recipe: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("jingalov hats treats the number of greens as a range, not a rule", async ({ page }) => {
  /*
    §70 called this the article's biggest folklore trap, and it is the one claim the
    sources genuinely disagree about — twenty-six, seventeen, ten to twenty. The
    article is required to attribute the figures rather than to adopt one.
  */
  const article = bundle("en").articles.find((a) => a.slug === JINGALOV)!;
  const text = article.sections.flatMap((s) => s.paragraphs).join(" ");

  // The numbers appear, attributed to who said them.
  expect(text).toContain("Ara Zada");
  expect(text).toContain("twenty-six");
  expect(text).toContain("ten to twenty");

  // And the article says outright that they do not agree, and why.
  expect(text.toLowerCase()).toContain("do not agree");
  expect(text).toContain("cannot have a fixed count");

  // What must never appear: a canonical count, in any edition.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${JINGALOV}`);
    const rendered = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of [
      "exactly twenty",
      "must contain",
      "authentic recipe calls for",
      "պարտադիր պետք է պարունակի",
      "ճշգրիտ քսան",
    ]) {
      expect(rendered, `${locale} must not fix the count: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("the Artsakh context is substantive, dated, and does not take over the article", async ({
  page,
}) => {
  /*
    Two failures are possible here and they pull in opposite directions: erasing the
    regional context, or letting the article become a political chronology with a
    recipe attached. This pins both edges at once.
  */
  const article = bundle("en").articles.find((a) => a.slug === JINGALOV)!;
  const paragraphs = article.sections.flatMap((s) => s.paragraphs);

  // Substantive: the region is named and distinguished from the other name for it.
  const all = paragraphs.join(" ");
  expect(all).toContain("Artsakh");
  expect(all).toContain("Nagorno-Karabakh");
  expect(all, "the two names are held apart rather than merged").toContain("not interchangeable");
  expect(all).toContain("Syunik");

  // Bounded: the two sections that carry the regional and displacement material
  // are a minority of the article, not the bulk of it.
  const regional = article.sections.filter((s) =>
    ["a-food-of-artsakh", "a-food-away-from-its-place"].includes(s.id),
  );
  expect(regional.length, "both sections exist").toBe(2);
  const regionalWords = regional.flatMap((s) => s.paragraphs).join(" ").split(/\s+/).length;
  const totalWords = all.split(/\s+/).length;
  expect(regionalWords / totalWords, "regional material stays a minority").toBeLessThan(0.35);

  // Dated: every present-condition statement carries a year.
  const displacement = article.sections.find((s) => s.id === "a-food-away-from-its-place")!;
  expect(displacement.paragraphs[0]).toContain("2023");
  expect(displacement.paragraphs.join(" ")).toContain("2025");

  // And the article does not adjudicate the region's status.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${JINGALOV}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of [
      "illegally occupied",
      "rightful territory",
      "belongs to armenia",
      "belongs to azerbaijan",
      "must be returned",
    ]) {
      expect(text, `${locale} must not adjudicate: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("jingalov hats separates what is recorded from what is inferred", async ({ page }) => {
  /*
    §70's historical-evidence rule. The article is allowed to say the dish is older
    than its first mention — every source says so — but it has to mark that as
    inference and refuse to date it.
  */
  await page.goto(`/en/cuisine/${JINGALOV}`);
  const text = (await page.getByRole("main").textContent()) ?? "";

  expect(text, "the record is dated").toContain("nineteenth century");
  expect(text, "and named as a moment of recording").toContain(
    "a moment of recording rather than of invention",
  );
  expect(text, "the limit is stated outright").toContain(
    "how much older is not something the available evidence establishes",
  );
  expect(text, "and antiquity is refused by name").toContain("No source consulted here places it");

  // The institutional dates, which are the part that can be dated.
  expect(text).toContain("2013");
  expect(text).toContain("2015");
});

test("jingalov hats describes wild-plant knowledge without teaching it", async ({ page }) => {
  /*
    The line §70 drew: the gathering knowledge is the article's best cultural
    material and the worst thing it could turn into. The article has to name the
    refusal rather than merely happen not to give instructions.
  */
  const article = bundle("en").articles.find((a) => a.slug === JINGALOV)!;
  const section = article.sections.find((s) => s.id === "knowing-what-to-pick")!;
  const text = section.paragraphs.join(" ");

  expect(text).toContain("Ruzanna Tsaturian");
  expect(text, "the refusal is explicit").toContain("It does not try to convey it");
  expect(text).toContain("is not something to learn from a page about food");

  // And nothing anywhere reads as identification guidance.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${JINGALOV}`);
    const rendered = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of ["how to identify", "look for leaves", "safe to forage", "you can pick"]) {
      expect(rendered, `${locale} must not instruct: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("jingalov hats is cooked on a griddle, and says so against lavash", async ({ page }) => {
  /*
    §70 warned specifically against assuming the tonir because lavash uses one. The
    article has to get the method right and has to use the contrast rather than
    smooth it over — which is also what earns the only link it authors.
  */
  const article = bundle("en").articles.find((a) => a.slug === JINGALOV)!;
  const section = article.sections.find((s) => s.id === "the-griddle-and-the-tonir")!;
  const text = section.paragraphs.join(" ");

  expect(text).toContain("saj");
  expect(text, "the tonir is mentioned as an alternative, not the method").toContain(
    "The plate is the characteristic method",
  );
  expect(text, "and the two are explicitly not merged").toContain("should not be run together");
  expect(text, "the lavash technique is stated, not assumed").toContain("inner wall of a tonir");
  expect(text, "and neither is called a version of the other").toContain(
    "Neither is a version of the other",
  );
});

test("jingalov hats links only where the prose earns it", async ({ page }) => {
  /*
    One authored relation, not three. The lavash link is carried by the paragraph
    that compares the two techniques; nothing else in the article does comparable
    work, and §70 was explicit that a relation to spas should not be manufactured
    out of both being everyday foods.

    The consequence is recorded rather than papered over: `getRelatedArticles` fills
    the remaining slots from the same category in registry order, so this article
    renders two filler links it did not author.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === JINGALOV)!;
    expect(article.relatedSlugs, `${locale} relations`).toEqual(["lavash"]);

    const links = article.sections.flatMap((s) => (s.links ?? []).map((l) => l.slug));
    expect(links, `${locale} prose links`).toEqual(["lavash"]);

    // Every link phrase is a real substring of a paragraph in its own section.
    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((para) => para.includes(link.phrase)),
          `${locale}: "${link.phrase}" must appear in ${section.id}`,
        ).toBe(true);
      }
    }

    // No cross-category link was manufactured. The archive has no Artsakh article
    // in another section, and §70 asked for that to stay a recorded gap rather than
    // be patched with a weak Armenia-wide link.
    const cuisineSlugs = new Set(
      bundle(locale).articles.filter((a) => a.category === "cuisine").map((a) => a.slug),
    );
    for (const slug of [...article.relatedSlugs, ...links]) {
      expect(cuisineSlugs.has(slug), `${locale}: ${slug} is inside cuisine`).toBe(true);
    }
  }

  await page.goto(`/hy/cuisine/${JINGALOV}`);
  await expect(
    page.getByRole("main").locator(`a[href="/hy/cuisine/lavash"]`).first(),
  ).toBeVisible();
});

test("jingalov hats owns its artwork in every edition, and borrows nobody else's", async ({
  page,
}) => {
  /*
    §71 inverts the §70 test rather than deleting it, the way §69 inverted §68's.
    Every assertion that pinned the pending state has a mirror here, so the
    transition is checked in both directions: the raster where the placeholder was,
    the AI caption where the placeholder caption was, out of `PENDING_ARTWORK` where
    it was in, and the real file where the fallback OG image was.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/cuisine/${JINGALOV}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    await expect(figure.locator("img"), `${locale} raster`).toHaveCount(1);
    await expect(figure.locator("img"), `${locale} exact file`).toHaveAttribute(
      "src",
      /jingalov-hats\.webp/,
    );

    await expect(figure.locator("figcaption"), locale).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, JINGALOV)),
    );
    await expect(figure.locator("figcaption"), `${locale} not the placeholder line`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, JINGALOV)),
    );
  }

  expect(getImageSrc(JINGALOV), "registered file").toBe(ARTWORK[JINGALOV]);
  expect(PENDING_ARTWORK, "no longer pending").not.toContain(JINGALOV);

  /*
    And it still borrows nothing. Lavash is named first because it is the real risk:
    it is the other thin wheat bread in the section and its cover is a stack of pale
    sheets, which is a description a careless substitution would pass. Scoped to the
    hero and the metadata, since the related block legitimately renders lavash's
    cover further down the page.
  */
  await page.goto(`/en/cuisine/${JINGALOV}`);
  const heroSources = await page
    .locator("header img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  expect(
    heroSources.some((src) => src.includes(ARTWORK[JINGALOV])),
    "the hero is its own file",
  ).toBe(true);
  for (const other of ILLUSTRATED) {
    if (other === JINGALOV) continue;
    expect(
      heroSources.some((src) => src.includes(`/cuisine/${other}.webp`)),
      `${other} must not illustrate jingalov hats`,
    ).toBe(false);
  }

  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(property).first().getAttribute("content");
    expect(content, property).toContain(ARTWORK[JINGALOV]);
    expect(content, `${property} is no longer the fallback`).not.toContain("/og-default.png");
  }

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "") as { "@graph": LdNode[] })["@graph"];
  expect(JSON.stringify(node(graph, "Article").image), "Article.image").toContain(
    ARTWORK[JINGALOV],
  );
});

test("the jingalov hats search result carries its own thumbnail", async ({ page }) => {
  /*
    Scoped by canonical href rather than by title, because a search page renders many
    covers and the failure worth catching is this row showing a neighbour's — and the
    neighbour that matters is lavash.
  */
  await page.goto("/en/search?q=jingalov");

  const row = page
    .locator("li")
    .filter({ has: page.locator(`a[href="/en/cuisine/${JINGALOV}"]`) });
  await expect(row).toHaveCount(1);

  const sources = await row
    .locator("img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  expect(sources.some((src) => src.includes(ARTWORK[JINGALOV])), "own thumbnail").toBe(true);
  expect(sources.some((src) => src.includes("/cuisine/lavash.webp")), "not lavash's").toBe(false);
});

test("jingalov hats emits a plain Article and no recipe markup", async ({ page }) => {
  await page.goto(`/en/cuisine/${JINGALOV}`);
  const graph = await readGraph(page);
  const types = graph.map((entry) => entry["@type"]);

  expect(types).toContain("Article");
  for (const forbidden of [
    "Recipe",
    "HowTo",
    "NutritionInformation",
    "MenuItem",
    "FoodEstablishment",
  ]) {
    expect(types, `${forbidden} must not appear`).not.toContain(forbidden);
  }

  const raw = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  for (const key of ["recipeIngredient", "recipeInstructions", "cookTime", "nutrition"]) {
    expect(raw, `${key} must not appear`).not.toContain(key);
  }
});

test("jingalov hats rests on regional sources, not on the section's default book", async ({
  page,
}) => {
  /*
    §70 asked twice about source hygiene: that Petrosian and Underwood not become
    six of eight by reflex, and that no historical or ethnographic claim be carried
    by a recipe site or a travel page. Both are pinned here.
  */
  const sources = getSources(JINGALOV);
  expect(sources.length, "the article cites what it rests on").toBeGreaterThanOrEqual(4);

  const titles = sources.map((s) => `${s.author ?? ""} ${s.title}`).join(" | ");
  expect(titles, "no reflexive reuse of the section's default book").not.toContain("Petrosian");
  expect(titles, "the ethnography is present").toContain("Karabakh");
  expect(titles, "and the institutional record is present").toContain("Zhengyalov Hats Festival");

  // Every identifier resolves and none is reused for a different work.
  const seen = new Map<string, string>();
  for (const source of sources) {
    expect(source.identifier, `${source.title} has an identifier`).toBeDefined();
    const key = `${source.identifier.kind}:${source.identifier.value}`;
    const previous = seen.get(key);
    if (previous) expect(previous, `${key} names one work`).toBe(source.title);
    seen.set(key, source.title);
  }

  // No recipe blog, travel site or restaurant page carries anything here.
  for (const source of sources) {
    if (source.identifier.kind !== "url") continue;
    for (const forbidden of ["recipe", "blogspot", "tripadvisor", "pinterest", "allrecipes"]) {
      expect(
        source.identifier.value.toLowerCase(),
        `${source.title} must not be a ${forbidden} source`,
      ).not.toContain(forbidden);
    }
  }

  // And the bibliography reaches the rendered page.
  await page.goto(`/en/cuisine/${JINGALOV}`);
  const graph = await readGraph(page);
  expect((node(graph, "Article").citation as unknown[]).length).toBe(sources.length);
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

/*
  One test per edition, not one test for all three.

  The assertions are unchanged and every dish in every edition is still visited;
  what changed is that eighteen sequential navigations no longer sit inside a
  single 30-second budget. Against the dev server, which compiles a route the
  first time it is asked for, that one test was the longest in the suite by a
  wide margin and aborted intermittently under the normal two workers — at a
  different dish each time, which is the signature of a timeout rather than a
  defect. Three tests of six navigations each also run concurrently, so the
  split is faster as well as steadier.
*/
for (const locale of LOCALES) {
  test(`[${locale}] every dish is published in this edition — no unavailable page, no English leak`, async ({
    page,
  }) => {
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
  });
}

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
    §74 marks this slow rather than retrying or loosening it. The test navigates
    every dish in every edition, so its cost grows linearly with the section: at
    six dishes that was eighteen page loads, at ten it is thirty. Measured alone
    against a warm server it takes about sixteen seconds, inside the thirty-second
    budget; under two workers on a cold Turbopack cache it exceeded it twice. The
    budget is tripled and not one assertion is weakened, because this is not a
    flaky test — it is a genuinely long one that got longer because the archive
    grew.
  */
  test.slow();

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

/* -------------------------------------------------------------------------- */
/*  §72 — Khash, the ninth dish                                                */
/* -------------------------------------------------------------------------- */

test("the ninth dish exists in every edition and is the section's second meat dish", async ({
  page,
}) => {
  for (const locale of LOCALES) {
    const dishes = bundle(locale).articles.filter((a) => a.category === "cuisine");
    expect(dishes.length, `${locale} dish count`).toBe(SLUGS.length);
    expect(
      dishes.map((a) => a.slug),
      `${locale} keeps the section in one order`,
    ).toEqual([...SLUGS]);

    const dish = dishes.find((a) => a.slug === KHASH);
    expect(dish, `${locale} has khash`).toBeDefined();
    expect(dish!.dishTypeId, `${locale} type`).toBe("meat");
    expect(dish!.featured ?? false, `${locale}: no cuisine article is featured`).toBe(false);
    expect(dish!.title, `${locale} title is the dish, not a description`).not.toContain(" ");

    // No new type was invented to hold a broth, which is the easiest constraint
    // in §72 to break by accident: khash is not obviously a "meat dish" in the
    // way khorovats is, and inventing "soup" or "broth" would have been the
    // natural mistake.
    expect(
      bundle(locale).cuisineTypes.map((t) => t.id),
      `${locale} taxonomy`,
    ).toEqual(["all", "bread", "main", "meat", "ceremonial", "dessert", "dairy"]);
  }

  // And the filter genuinely returns two meat dishes now, each named.
  await page.goto("/en/cuisine?type=meat");
  await expect(cards(page)).toHaveCount(2);
  for (const slug of ["khorovats", KHASH]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug), exact: true }).first(),
    ).toBeVisible();
  }
});

test("khash renders in every edition and carries its own SEO fields", async ({ page }) => {
  /*
    §72 is the first article in this archive written after a live search pass, so
    the metadata is checked as metadata rather than only as text: a title that
    survives truncation, a description inside the window a results page shows, a
    canonical that points at the edition being read, and hreflang covering all
    three.
  */
  for (const locale of LOCALES) {
    const response = await page.goto(`/${locale}/cuisine/${KHASH}`);
    expect(response?.status(), `${locale} status`).toBe(200);

    const article = bundle(locale).articles.find((a) => a.slug === KHASH)!;

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(article.title);

    // The visible title stays the entity. The SEO title is allowed to explain.
    expect(article.seoTitle, `${locale} has an seoTitle`).toBeTruthy();
    expect(article.seoTitle, `${locale} seoTitle differs from the title`).not.toBe(article.title);
    expect(
      article.seoTitle!.length,
      `${locale} seoTitle fits the budget with " | Armat" appended`,
    ).toBeLessThanOrEqual(52);
    await expect(page).toHaveTitle(new RegExp(`^${escapeRe(article.seoTitle!)}`));

    expect(article.metaDescription, `${locale} has a metaDescription`).toBeTruthy();
    expect(article.metaDescription!.length, `${locale} description length`).toBeGreaterThanOrEqual(
      70,
    );
    expect(article.metaDescription!.length, `${locale} description length`).toBeLessThanOrEqual(165);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      article.metaDescription!,
    );

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/${locale}/cuisine/${KHASH}$`),
    );
    for (const alternate of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${alternate}"]`),
        `${locale} declares ${alternate}`,
      ).toHaveCount(1);
    }
  }
});

test("khash is reachable by the queries people actually type", async ({ page }) => {
  /*
    The search half of §72. Each of these is a query group the SERP research
    identified, and each is checked against the running search rather than against
    the keyword array — a keyword nobody's query reaches is decoration.
  */
  const queries: [string, string][] = [
    ["en", "khash"],
    ["en", "armenian khash"],
    ["en", "winter morning"],
    ["en", "khashlama"],
    ["hy", "խաշ"],
    ["hyw", "խաշ"],
  ];

  for (const [locale, query] of queries) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.locator(`a[href="/${locale}/cuisine/${KHASH}"]`).first(),
      `${locale} "${query}" reaches khash`,
    ).toBeVisible();
  }

  // And it is grouped as cuisine rather than loose in the results.
  await page.goto("/en/search?q=khash");
  await expect(
    page.getByRole("main").getByRole("heading", { name: ui("en").search.groupCuisine, level: 2 }),
  ).toBeVisible();
});

test("khash targets explanatory intent without keyword stuffing", async ({ page }) => {
  /*
    The other half of the SEO decision, and the one that is easy to fail while
    passing everything above: metadata can target "what is khash" honestly, or it
    can repeat "Armenian khash" until the prose stops reading like prose. This
    test bounds the repetition rather than trusting it.
  */
  const written = bundle("en").articles.find((a) => a.slug === KHASH)!;
  const prose = [
    written.excerpt,
    written.summary ?? "",
    written.intro,
    ...written.sections.flatMap((section) => section.paragraphs),
  ]
    .join(" ")
    .toLowerCase();

  /*
    Measured on the prose rather than on the rendered `main`, deliberately. The
    page also renders the keyword chips, and counting those would measure the
    keyword list — which is allowed to name the disambiguated form once — instead
    of measuring whether the writing repeats it.
  */
  expect(
    prose.split("armenian khash").length - 1,
    "no stuffing of the disambiguated form",
  ).toBeLessThanOrEqual(2);

  await page.goto(`/en/cuisine/${KHASH}`);
  const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
  for (const forbidden of [
    "best armenian khash",
    "authentic armenian khash",
    "traditional armenian khash",
    "ultimate",
    "must try",
    "you won't believe",
  ]) {
    expect(text, `must not advertise: ${forbidden}`).not.toContain(forbidden);
  }

  // The visible title is the entity in every edition, never the SEO sentence.
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === KHASH)!;
    expect(article.title.split(/\s+/).length, `${locale} title is one word`).toBe(1);
  }
});

test("khash separates popular claims from what the sources support", async ({ page }) => {
  /*
    §72's central editorial requirement, and the reason the article exists. The
    search results repeat four claims — medieval origin, poor-man's food, the
    letter-r rule, hangover cure — and the article is required to carry each one as
    the kind of claim it actually is. Checked per edition, because the Armenian
    ones are where an English review would not catch a slip.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === KHASH)!;
    const section = (id: string) => article.sections.find((s) => s.id === id)!.paragraphs.join(" ");

    // The medieval attribution is reported and marked as unverified, in the same
    // section, rather than stated.
    const record = section("what-the-record-can-say");
    expect(record, `${locale} names the medieval authorities`).toContain(
      { en: "Heratsi", hy: "Հերաց", hyw: "Հերաց" }[locale],
    );
    for (const marker of {
      en: ["reported here as a claim", "None of those texts was consulted"],
      hy: ["որպես պնդում", "ոչ մեկն այստեղ չի ուսումնասիրվել"],
      hyw: ["իբրեւ պնդում", "ոչ մէկը հոս ուսումնասիրուած է"],
    }[locale]) {
      expect(record, `${locale} marks the medieval claim: ${marker}`).toContain(marker);
    }

    // The class history is attributed to the people who disagree about it,
    // rather than told as history.
    const klass = section("the-story-about-poor-peoples-food");
    for (const name of { en: ["Mamulyan", "Antinyan"], hy: ["Մամուլ", "Անտին"], hyw: ["Մամուլ", "Անտին"] }[
      locale
    ]) {
      expect(klass, `${locale} attributes the class account`).toContain(name);
    }

    // The letter-r rule is contextualized, not adopted.
    const months = section("the-months-with-an-r");
    for (const marker of {
      en: ["cannot be old", "not followed strictly"],
      hy: ["հին լինել չի կարող", "խստորեն չի պահպանվում"],
      hyw: ["հին ըլլալ չի կրնար", "խստօրէն չի պահպանուիր"],
    }[locale]) {
      expect(months, `${locale} contextualizes the rule: ${marker}`).toContain(marker);
    }

    // The hangover reputation is classified rather than repeated.
    const hangover = section("the-hangover-reputation");
    for (const marker of {
      en: ["popular belief", "rather than a medical conclusion", "makes no claim"],
      hy: ["ժողովրդական հավատալիք", "ոչ թե բժշկական եզրակացություն", "պնդում չի անում"],
      hyw: ["ժողովրդական հաւատալիք", "ոչ թէ բժշկական եզրակացութիւն", "պնդում չ՚ըներ"],
    }[locale]) {
      expect(hangover, `${locale} classifies the hangover claim: ${marker}`).toContain(marker);
    }
  }

  // And nothing anywhere states the claims flatly.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${KHASH}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of [
      "invented",
      "the oldest armenian dish",
      "since antiquity",
      "thousands of years",
      "unchanged since",
      "cures a hangover",
      "khash cures",
      "khash treats",
      "detox",
      "superfood",
      "antioxidant",
      "boosts",
      "good for the joints",
      "հնագույն ուտեստ",
      "հազարավոր տարի",
      "հազարաւոր տարի",
      "խաշը բուժում է",
      "խաշը կը բուժէ",
    ]) {
      expect(text, `${locale} must not state: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("khash mentions alcohol as custom and never as advice", async ({ page }) => {
  /*
    §22 allows one thing and forbids a list. The allowance is a brief record of a
    documented adult custom; the forbidden list is recommendation, quantity,
    pairing, and the framing that makes drinking a condition of authenticity. The
    bound on mentions is the part that matters: a food article can pass every
    forbidden-phrase check and still be about vodka.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === KHASH)!;
    const body = article.sections.flatMap((s) => s.paragraphs).join(" ").toLowerCase();

    const words = { en: ["vodka", "spirit", "alcohol"], hy: ["օղի"], hyw: ["օղի"] }[locale];
    const mentions = words.reduce((total, w) => total + (body.split(w).length - 1), 0);
    expect(mentions, `${locale} keeps alcohol brief`).toBeGreaterThan(0);
    expect(mentions, `${locale} keeps alcohol brief`).toBeLessThanOrEqual(3);

    // And where it is mentioned, it is disclaimed in the same breath.
    for (const marker of {
      en: ["neither required by the dish nor recommended here"],
      hy: ["ո՛չ ուտեստի կողմից է պահանջվում"],
      hyw: ["ո՛չ կերակուրին կողմէ կը պահանջուի"],
    }[locale]) {
      expect(body.includes(marker.toLowerCase()), `${locale} disclaims: ${marker}`).toBe(true);
    }

    await page.goto(`/${locale}/cuisine/${KHASH}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of [
      "should drink",
      "pairs well",
      "goes well with",
      "shots of",
      "a glass of vodka with",
      "must be drunk",
      "hair of the dog",
      "պետք է խմել",
      "պէտք է խմել",
    ]) {
      expect(text, `${locale} must not advise: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("khash explains preparation without becoming a recipe", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${KHASH}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of [
      "tablespoon",
      "teaspoon",
      "servings",
      "prep time",
      "cook time",
      "easy recipe",
      "step 1",
      "degrees",
      "°c",
      "ճաշի գդալ",
      "թեյի գդալ",
      "բաժին՝",
    ]) {
      expect(text, `${locale} must not read as a recipe: ${forbidden}`).not.toContain(forbidden);
    }

    // No numeric quantity or duration anywhere in the prose. The article states
    // ranges in words on purpose, so a digit here means a recipe crept in.
    const article = bundle(locale).articles.find((a) => a.slug === KHASH)!;
    const prose = article.sections.flatMap((s) => s.paragraphs).join(" ");
    const digits = prose.match(/\d+/g) ?? [];
    expect(digits.sort(), `${locale} prose carries only the two dates`).toEqual(["1184", "2019"]);
  }

  // And the structure is not recipe-first: the article opens on what the thing
  // is, and no section is a set of instructions.
  const article = bundle("en").articles.find((a) => a.slug === KHASH)!;
  expect(article.sections[0].id).toBe("what-khash-is");
  for (const section of article.sections) {
    expect(section.id, "no how-to section").not.toContain("how-to");
    expect(section.id, "no recipe section").not.toContain("recipe");
  }
});

test("khash keeps its regional relatives without competing over them", async ({ page }) => {
  /*
    Handled the way spas handled the yogurt soups: name the family, refuse the
    ownership question. The positive assertion matters as much as the negative
    one — an article that simply omitted the neighbours would also pass a list of
    forbidden phrases.
  */
  const article = bundle("en").articles.find((a) => a.slug === KHASH)!;
  const relatives = article.sections.find((s) => s.id === "a-dish-with-relatives")!.paragraphs.join(" ");

  for (const neighbour of ["Georgia", "Azerbaijan", "Iran", "Turkey"]) {
    expect(relatives, `names ${neighbour}`).toContain(neighbour);
  }
  expect(relatives).toContain("does not require deciding who had it first");
  expect(relatives).toContain("evidence about the food rather than about influence");

  // Khashlama is distinguished rather than merged, in every edition.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${KHASH}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    expect(text, `${locale} names khashlama`).toContain(
      { en: "khashlama", hy: "խաշլամա", hyw: "խաշլամա" }[locale],
    );
    for (const forbidden of [
      "armenians invented",
      "stole",
      "copied from",
      "the original khash belongs",
      "is really an armenian",
    ]) {
      expect(text, `${locale} must not compete: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("khash rests on scholarship, and no tourism page carries its history", async ({ page }) => {
  /*
    §33 and §34 in one test. The SERP research surfaced a great deal, and almost
    all of it was tourism copy repeating the same four claims; the rule is that
    such a page may describe today's visible practice and may not carry chronology,
    origin, etymology or medical claims. The cleanest way to enforce that is to
    keep those pages out of the bibliography entirely, and then check it.
  */
  const sources = getSources(KHASH);
  expect(sources.length, "khash has a bibliography").toBeGreaterThanOrEqual(5);
  for (const source of sources) {
    expect(source.identifier?.value, `${source.title} carries an identifier`).toBeTruthy();
  }

  const values = sources.map((s) => String(s.identifier?.value ?? "").toLowerCase()).join(" ");
  for (const host of [
    "armenia.travel",
    "tasteatlas",
    "travelfoodatlas",
    "thearmeniankitchen",
    "armeniatraveltips",
    "gyumri.am",
    "khash.org",
    "allthatcooking",
    "desidakaar",
    "phoenixtour",
    "gatapandok",
    "willflyforfood",
    "absolutearmenia",
  ]) {
    expect(values, `no tourism or recipe source: ${host}`).not.toContain(host);
  }

  // Two peer-reviewed identifiers, which is what lets the article make the
  // comparative and the gendered claims at all.
  const dois = sources.filter((s) => s.identifier?.kind === "doi");
  expect(dois.length, "at least two DOI-identified works").toBeGreaterThanOrEqual(2);

  // And the section's default book did not become six of nine by default.
  expect(
    sources.some((s) => (s.author ?? "").includes("Petrosian")),
    "Petrosian & Underwood stays out, as §35 asks",
  ).toBe(false);

  // The bibliography renders.
  await page.goto(`/en/cuisine/${KHASH}`);
  await expect(page.getByText("Identities", { exact: false }).first()).toBeVisible();
});

test("khash links only where the prose earns it", async ({ page }) => {
  /*
    Three authored links, each in a different section, each earned by a sentence
    that would be worse without it. The cross-category one is the point: §70
    recorded that Cuisine had no genuine link out of the section, and Gyumri is
    the first that a source actually supplies rather than one manufactured to
    close the gap.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === KHASH)!;
    expect(article.relatedSlugs, `${locale} authored relations`).toEqual(["lavash", "harissa"]);

    const links = article.sections.flatMap((s) => (s.links ?? []).map((l) => [s.id, l.slug]));
    expect(links, `${locale} link placement`).toEqual([
      ["the-bowl-you-finish-yourself", "lavash"],
      ["never-eaten-alone", "gyumri"],
      ["what-the-record-can-say", "harissa"],
    ]);

    // Every phrase is a real substring of its own section, which is what the
    // renderer needs and what a translated edition breaks first.
    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((p) => p.includes(link.phrase)),
          `${locale} "${link.phrase}" appears in ${section.id}`,
        ).toBe(true);
      }
    }
  }

  // The cross-category link renders and leaves the section without leaving the
  // edition.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${KHASH}`);
    await expect(
      page.locator(`main a[href="/${locale}/places/gyumri"]`).first(),
      `${locale} reaches Gyumri`,
    ).toBeVisible();
    await expect(page.locator(`main a[href="/${locale}/cuisine/lavash"]`).first()).toBeVisible();
  }
});

test("khash owns its artwork in every edition, and borrows nobody else's", async ({ page }) => {
  /*
    §73 inverts the §72 test rather than deleting it, the way §69 inverted §68's and
    §71 inverted §70's. Every assertion that pinned the pending state has a mirror
    here, so the transition is checked in both directions: the raster where the
    placeholder was, the AI caption where the placeholder caption was, out of
    `PENDING_ARTWORK` where it was in, and the real file where the fallback OG image
    was.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/cuisine/${KHASH}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    await expect(figure.locator("img"), `${locale} raster`).toHaveCount(1);
    await expect(figure.locator("img"), `${locale} exact file`).toHaveAttribute(
      "src",
      /khash\.webp/,
    );
    await expect(figure.locator("img"), `${locale} localized alt`).toHaveAttribute(
      "alt",
      new RegExp(articleTitle(locale, KHASH)),
    );

    await expect(figure.locator("figcaption"), locale).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, KHASH)),
    );
    await expect(figure.locator("figcaption"), `${locale} not the placeholder line`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, KHASH)),
    );
  }

  expect(getImageSrc(KHASH), "registered file").toBe(ARTWORK[KHASH]);
  expect(PENDING_ARTWORK, "no longer pending").not.toContain(KHASH);
  /*
    §73 also asserted here that the archive-wide pending list was empty. §74 made
    that false by adding matsun, and the assertion has moved rather than been
    dropped: the pending test for whichever dish is currently waiting owns the
    archive-wide state, because that is the test that has to change anyway. Khash's
    test keeps the half that is about khash.
  */

  /*
    And it still borrows nothing. Spas, harissa and khorovats are the three §44
    named as the real risks — the other pale bowl, the other slow-cooked bowl, and
    the other meat dish — but the loop covers all eight, because the substitution
    that actually happens is never the one that was anticipated. Scoped to the hero
    and the metadata, since the related block legitimately renders lavash's and
    harissa's covers further down the page.
  */
  await page.goto(`/en/cuisine/${KHASH}`);
  const heroSources = await page
    .locator("header img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  expect(
    heroSources.some((src) => src.includes(ARTWORK[KHASH])),
    "the hero is its own file",
  ).toBe(true);
  for (const other of ILLUSTRATED) {
    if (other === KHASH) continue;
    expect(
      heroSources.some((src) => src.includes(`/cuisine/${other}.webp`)),
      `${other} must not illustrate khash`,
    ).toBe(false);
  }

  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(property).first().getAttribute("content");
    expect(content, property).toContain(ARTWORK[KHASH]);
    expect(content, `${property} is no longer the fallback`).not.toContain("/og-default.png");
  }
});

test("the khash search result carries its own thumbnail", async ({ page }) => {
  /*
    Scoped by canonical href rather than by title, because a search page renders
    many covers and the failure worth catching is this row showing a neighbour's.
    The neighbours that matter are spas and harissa: at thumbnail size those are the
    two a careless substitution would survive.
  */
  await page.goto("/en/search?q=khash");

  const row = page.locator("li").filter({ has: page.locator(`a[href="/en/cuisine/${KHASH}"]`) });
  await expect(row).toHaveCount(1);

  const sources = await row
    .locator("img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  expect(sources.some((src) => src.includes(ARTWORK[KHASH])), "own thumbnail").toBe(true);
  for (const other of ["spas", "harissa", "khorovats"]) {
    expect(sources.some((src) => src.includes(`/cuisine/${other}.webp`)), `not ${other}'s`).toBe(
      false,
    );
  }
});

test("khash gained a picture and no recipe markup with it", async ({ page, request }) => {
  await page.goto(`/en/cuisine/${KHASH}`);
  const graph = await readGraph(page);

  expect(
    graph.map((entry) => entry["@type"]),
    "the graph is the archive's usual four",
  ).toEqual(["Organization", "WebSite", "Article", "BreadcrumbList"]);

  const article = node(graph, "Article");
  expect(JSON.stringify(article.image), "Article.image is the registered file").toContain(
    ARTWORK[KHASH],
  );

  const serialized = JSON.stringify(graph);
  for (const forbidden of [
    "Recipe",
    "HowTo",
    "NutritionInformation",
    "MenuItem",
    "FoodEstablishment",
    "recipeIngredient",
    "recipeInstructions",
    "cookTime",
    "prepTime",
  ]) {
    expect(serialized, `no ${forbidden} in the graph`).not.toContain(forbidden);
  }

  /*
    The sitemap, checked route by route rather than by a global filename count. A
    count passes while three locales all point at one edition's image; this fails
    unless each edition's own entry carries khash's own file and nobody else's.
  */
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const locale of LOCALES) {
    const url = `/${locale}/cuisine/${KHASH}<`;
    const start = xml.indexOf(url);
    expect(start, `${locale} khash is in the sitemap`).toBeGreaterThan(-1);
    const block = xml.slice(start, xml.indexOf("</url>", start));

    const images = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
    expect(images.length, `${locale} khash has exactly one image`).toBe(1);
    expect(images[0], `${locale} khash image`).toContain(ARTWORK[KHASH]);
    for (const other of ILLUSTRATED) {
      if (other === KHASH) continue;
      expect(images[0], `${locale} must not carry ${other}`).not.toContain(
        `/cuisine/${other}.webp`,
      );
    }
  }
});

test("adding khash changed no existing dish's relations or artwork", async ({ page }) => {
  /*
    §72 appends to the registry, and the registry order is what `getRelatedArticles`
    walks when it fills a short `relatedSlugs`. Appending should be invisible to the
    eight articles already there, and "should be" is not a check.
  */
  for (const locale of LOCALES) {
    const dishes = bundle(locale).articles.filter((a) => a.category === "cuisine");
    const authored = Object.fromEntries(dishes.map((a) => [a.slug, a.relatedSlugs]));
    expect(authored[SPAS], `${locale} spas relations untouched`).toEqual(["harissa", "lavash"]);
    expect(authored[JINGALOV], `${locale} jingalov relations untouched`).toEqual(["lavash"]);
    expect(authored.lavash, `${locale} lavash relations untouched`).toEqual([
      "khorovats",
      "dolma",
      "harissa",
    ]);
  }

  // Spas keeps the dolma filler §71 was told not to alter, and jingalov keeps
  // both of its own. Read off the rendered page, not off the function.
  for (const [slug, expected] of [
    [SPAS, ["harissa", "lavash", "dolma"]],
    [JINGALOV, ["lavash", "dolma", "khorovats"]],
    [KHASH, ["lavash", "harissa", "dolma"]],
  ] as const) {
    await page.goto(`/en/cuisine/${slug}`);
    const hrefs = await page
      .locator('main a[href^="/en/cuisine/"]')
      .evaluateAll((nodes) => nodes.map((el) => el.getAttribute("href") ?? ""));
    for (const related of expected) {
      expect(
        hrefs.some((href) => href.endsWith(`/cuisine/${related}`)),
        `${slug} still offers ${related}`,
      ).toBe(true);
    }
  }

  // And the eight existing covers are exactly where they were.
  for (const slug of ILLUSTRATED) {
    expect(getImageSrc(slug), `${slug} artwork unchanged`).toBe(ARTWORK[slug]);
  }
});

/* -------------------------------------------------------------------------- */
/*  §74 — Matsun, the tenth dish, and the dairy type                           */
/* -------------------------------------------------------------------------- */

test("the dairy type is an ordinary cuisine filter, with exactly one article", async ({ page }) => {
  /*
    §74 adds the first new dish type since the section was built, and the thing
    worth checking is that it is *ordinary* — that it went in through the same
    door as the other five and needed no special case anywhere. Hence the shape of
    this test: the vocabulary, then the label in every edition, then the URL, then
    the rendered result.
  */
  for (const locale of LOCALES) {
    const types = bundle(locale).cuisineTypes;

    // Appended, not inserted: no existing id moved, and none was renamed.
    expect(
      types.map((t) => t.id),
      `${locale} filter ids`,
    ).toEqual(["all", "bread", "main", "meat", "ceremonial", "dessert", "dairy"]);

    // The label is translated rather than left in English, which is the failure
    // that would otherwise reach a reader unnoticed in two of three editions.
    const dairy = types.find((t) => t.id === "dairy")!;
    expect(dairy.label.trim().length, `${locale} dairy label is filled`).toBeGreaterThan(0);
    if (locale !== "en") {
      expect(dairy.label, `${locale} dairy label is not the English one`).not.toBe("Dairy");
    }

    // Exactly one article carries it, and it is matsun. An empty filter would
    // render a permanently blank listing state, which is what `validate:content`
    // forbids and what this asserts from the other side.
    const dairyArticles = bundle(locale)
      .articles.filter((a) => a.category === "cuisine" && a.dishTypeId === "dairy")
      .map((a) => a.slug);
    expect(dairyArticles, `${locale} dairy membership`).toEqual([MATSUN]);
  }

  // The URL behaves like every other type filter — same key, same round trip.
  await page.goto("/en/cuisine?type=dairy");
  await expect(cards(page)).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: articleTitle("en", MATSUN), exact: true }).first(),
  ).toBeVisible();

  // And selecting it did not disturb the others: each existing filter still
  // returns exactly what it returned before matsun existed.
  for (const [type, count] of [
    ["bread", 2],
    ["main", 2],
    ["meat", 2],
    ["ceremonial", 2],
    ["dessert", 1],
  ] as const) {
    await page.goto(`/en/cuisine?type=${type}`);
    await expect(cards(page), `${type} count`).toHaveCount(count);
  }
});

test("the tenth dish exists in every edition and is the section's only dairy food", async ({
  page,
}) => {
  for (const locale of LOCALES) {
    const dishes = bundle(locale).articles.filter((a) => a.category === "cuisine");
    expect(dishes.length, `${locale} dish count`).toBe(SLUGS.length);
    expect(
      dishes.map((a) => a.slug),
      `${locale} keeps the section in one order`,
    ).toEqual([...SLUGS]);

    const dish = dishes.find((a) => a.slug === MATSUN);
    expect(dish, `${locale} has matsun`).toBeDefined();
    expect(dish!.dishTypeId, `${locale} type`).toBe("dairy");
    expect(dish!.featured ?? false, `${locale}: no cuisine article is featured`).toBe(false);

    // Not filed under an existing type to avoid touching the taxonomy, which is
    // the shortcut §74 exists to refuse: spas contains matsun and stays `main`,
    // because spas is a soup and matsun is not.
    expect(
      dishes.find((a) => a.slug === SPAS)!.dishTypeId,
      `${locale} spas is untouched`,
    ).toBe("main");
  }

  // No dish changed type when the vocabulary grew.
  for (const [slug, type] of [
    ["lavash", "bread"],
    ["dolma", "main"],
    ["khorovats", "meat"],
    ["harissa", "ceremonial"],
    ["gata", "dessert"],
    ["ghapama", "ceremonial"],
    [SPAS, "main"],
    [JINGALOV, "bread"],
    [KHASH, "meat"],
    [MATSUN, "dairy"],
  ] as const) {
    expect(
      bundle("en").articles.find((a) => a.slug === slug)!.dishTypeId,
      `${slug} type`,
    ).toBe(type);
  }

  await page.goto("/en/cuisine");
  await expect(cards(page)).toHaveCount(10);
});

test("matsun renders in every edition and carries its own SEO fields", async ({ page }) => {
  for (const locale of LOCALES) {
    const response = await page.goto(`/${locale}/cuisine/${MATSUN}`);
    expect(response?.status(), `${locale} status`).toBe(200);

    const article = bundle(locale).articles.find((a) => a.slug === MATSUN)!;

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(article.title);
    expect(article.title.split(/\s+/).length, `${locale} title is one word`).toBe(1);

    expect(article.seoTitle, `${locale} has an seoTitle`).toBeTruthy();
    expect(article.seoTitle, `${locale} seoTitle differs from the title`).not.toBe(article.title);
    expect(article.seoTitle!.length, `${locale} seoTitle budget`).toBeLessThanOrEqual(52);
    await expect(page).toHaveTitle(new RegExp(`^${escapeRe(article.seoTitle!)}`));

    expect(article.metaDescription!.length, `${locale} description`).toBeGreaterThanOrEqual(70);
    expect(article.metaDescription!.length, `${locale} description`).toBeLessThanOrEqual(165);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      article.metaDescription!,
    );

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/${locale}/cuisine/${MATSUN}$`),
    );
    for (const alternate of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${alternate}"]`),
        `${locale} declares ${alternate}`,
      ).toHaveCount(1);
    }
  }
});

test("matsun is reachable by the queries people actually type", async ({ page }) => {
  const queries: [string, string][] = [
    ["en", "matsun"],
    ["en", "matzoon"],
    ["en", "armenian yogurt"],
    ["en", "fermented milk"],
    ["en", "chortan"],
    ["hy", "մածուն"],
    ["hyw", "մածուն"],
  ];

  for (const [locale, query] of queries) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.locator(`a[href="/${locale}/cuisine/${MATSUN}"]`).first(),
      `${locale} "${query}" reaches matsun`,
    ).toBeVisible();
  }

  await page.goto("/en/search?q=matsun");
  await expect(
    page.getByRole("main").getByRole("heading", { name: ui("en").search.groupCuisine, level: 2 }),
  ).toBeVisible();
});

test("matsun separates the record from the claims made about it", async ({ page }) => {
  /*
    §74's central editorial requirement. The SERP for this topic carries an
    eleventh-century chronology, an invention claim, a UNESCO upgrade and a wall of
    probiotic marketing. The article is required to carry each as the kind of claim
    it actually is, and the negative half of this test is the important half.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === MATSUN)!;
    const section = (id: string) => article.sections.find((s) => s.id === id)!.paragraphs.join(" ");

    // The eleventh-century claim is followed to its source and scoped, in the
    // same section, rather than repeated or silently dropped.
    const record = section("what-the-record-actually-says");
    expect(record, `${locale} names the figure`).toContain(
      { en: "Grigor Magistros", hy: "Մագիստրոս", hyw: "Մագիստրոս" }[locale],
    );
    for (const marker of {
      en: ["is an etymology", "It is not a tale"],
      hy: ["տալիս է ստուգաբանություն", "Դա պատմություն չէ"],
      hyw: ["կու տայ ստուգաբանութիւն", "Ատիկա պատմութիւն չէ"],
    }[locale]) {
      expect(record, `${locale} scopes the medieval claim: ${marker}`).toContain(marker);
    }

    // The heritage listing is national, and the article says which one it is not.
    const heritage = section("named-on-a-national-list");
    for (const marker of {
      en: ["not the UNESCO Representative List", "the only food is lavash"],
      hy: ["ՅՈՒՆԵՍԿՕ-ի ներկայացուցչական ցանկը չէ", "միակ ուտելիքը լավաշն է"],
      hyw: ["ԻՒՆԵՍՔՕ-ի ներկայացուցչական ցանկը չէ", "միակ ուտելիքը լաւաշն է"],
    }[locale]) {
      expect(heritage, `${locale} distinguishes the lists: ${marker}`).toContain(marker);
    }

    // Matsoni is handled as one food under two names, not as a contest.
    const matsoni = section("matsun-and-matsoni");
    for (const marker of {
      en: ["the food is the same food", "takes no position"],
      hy: ["մթերքը նույն մթերքն է", "դիրքորոշում չի ընդունում"],
      hyw: ["մթերքը նոյն մթերքն է", "դիրքորոշում չ՚որդեգրեր"],
    }[locale]) {
      expect(matsoni, `${locale} refuses the contest: ${marker}`).toContain(marker);
    }
  }

  /*
    Two scopes, because one substring sweep cannot tell an assertion from a
    refutation. The article's body has to *name* the claims it takes apart — it
    says in terms that statements about matsun being thousands of years old are
    unsupported — so a flat ban on that phrase goes red on the sentence doing the
    work. The distinction drawn here is where an unqualified claim could actually
    reach a reader as a claim.

    `headline` is the SERP- and card-facing text: excerpt, summary, intro, key
    facts, interesting facts, dates. Nothing there has room to qualify anything,
    so an antiquity or invention claim appearing there is always a claim.

    `everything` adds the sections and the significance block, and carries only the
    health and marketing vocabulary — which has no legitimate use anywhere on this
    page, refutation included, because the article's position is that the question
    is out of scope rather than that the answer is no.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === MATSUN)!;

    const headline = [
      article.excerpt,
      article.summary ?? "",
      article.intro,
      ...article.keyFacts.map((f) => `${f.label} ${f.value}`),
      ...article.interestingFacts,
      ...article.importantDates.map((d) => d.event),
    ]
      .join(" ")
      .toLowerCase();

    const everything = [
      headline,
      ...article.sections.flatMap((sec) => sec.paragraphs),
      ...article.significance.paragraphs,
    ]
      .join(" ")
      .toLowerCase();

    // The page must address the listing at all — an article that simply avoided
    // the word would pass every negative assertion below while telling the reader
    // nothing.
    expect(
      everything.includes("unesco") ||
        everything.includes("յունեսկօ") ||
        everything.includes("իւնեսքօ"),
      `${locale} addresses the UNESCO distinction`,
    ).toBe(true);

    /*
      Phrased as claims that can only ever be false, not as a ban on the word. An
      earlier draft forbade "on the unesco list" outright and went red on the
      article's own correct sentence — that of Armenia's inscriptions on the UNESCO
      list, the only food is lavash. An article that draws the distinction properly
      has to name the list it is distinguishing itself from, so the assertion has to
      be about what is predicated of matsun.
    */
    for (const forbidden of [
      "matsun is unesco",
      "matsun is a unesco",
      "matsun is on the unesco",
      "unesco inscribed matsun",
      "matsun was inscribed",
      "matsun is inscribed",
      "մածունը յունեսկօ",
      "մածունը իւնեսքօ",
    ]) {
      expect(everything, `${locale} must not upgrade the listing: ${forbidden}`).not.toContain(
        forbidden,
      );
    }

    // Antiquity and invention: banned where they could only be assertions.
    for (const forbidden of [
      "invented",
      "the world's oldest",
      "oldest fermented",
      "oldest cultured",
      "thousands of years",
      "since antiquity",
      "հազարավոր տարի",
      "հազարաւոր տարի",
      "հնագույն",
      "հնագոյն",
    ]) {
      expect(headline, `${locale} must not claim in its headline text: ${forbidden}`).not.toContain(
        forbidden,
      );
    }

    // Health and marketing: banned everywhere, including in refutation, because
    // the article's position is that the question is out of scope.
    for (const forbidden of [
      "probiotic benefit",
      "boosts immunity",
      "improves digestion",
      "gut health",
      "detox",
      "superfood",
      "weight loss",
      "strains of probiotics",
      "good for you",
      "իմունիտետ",
      "մարսողությունը բարելավում",
    ]) {
      expect(everything, `${locale} must not claim: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("matsun explains fermentation without teaching it", async ({ page }) => {
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === MATSUN)!;
    const prose = article.sections.flatMap((s) => s.paragraphs).join(" ");

    // The science is present and named.
    const science = article.sections.find((s) => s.id === "milk-turned-by-bacteria")!.paragraphs.join(" ");
    expect(science, `${locale} names the bacteria`).toContain("Lactobacillus");
    expect(science, `${locale} names the protein`).toMatch(/casein|կազեին|քազէին/);

    // No numeric quantity, duration or temperature anywhere in the prose. The
    // article states process without schedule on purpose, so a stray digit here
    // means a recipe crept in.
    /*
      The three dates, with 2015 twice: the microbiology survey is introduced in the
      fermentation section and referred back to in the matsoni section. Asserted as
      the exact multiset rather than as a set, because that is also what
      `validateCrossLocaleNumbers` compares — a numeral appearing twice in one
      edition and once in another is precisely the translation defect worth catching.
    */
    const digits = (prose.match(/\d+/g) ?? []).sort();
    expect(digits, `${locale} prose carries only the dates`).toEqual([
      "1929",
      "2012",
      "2015",
      "2015",
    ]);

    await page.goto(`/${locale}/cuisine/${MATSUN}`);
    const text = ((await page.getByRole("main").textContent()) ?? "").toLowerCase();
    for (const forbidden of [
      "tablespoon",
      "teaspoon",
      "servings",
      "prep time",
      "incubate for",
      "degrees",
      "°c",
      "litres",
      "ferment for",
      "ճաշի գդալ",
      "թեյի գդալ",
    ]) {
      expect(text, `${locale} must not read as a recipe: ${forbidden}`).not.toContain(forbidden);
    }
  }

  // Not recipe-first: the article opens on what the thing is, and no section is a
  // set of instructions.
  const article = bundle("en").articles.find((a) => a.slug === MATSUN)!;
  expect(article.sections[0].id).toBe("what-matsun-is");
  for (const section of article.sections) {
    expect(section.id, "no how-to section").not.toContain("how-to");
    expect(section.id, "no recipe section").not.toContain("recipe");
  }
});

test("matsun earns its link to spas and manufactures nothing else", async ({ page }) => {
  /*
    §16 predicted the spas relation and §39 warned against padding it out. One
    authored relation it is: the bread relationship is real but thin, and a second
    link resting on a single clause in a single source would be manufactured.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === MATSUN)!;
    expect(article.relatedSlugs, `${locale} authored relations`).toEqual(["spas"]);

    const links = article.sections.flatMap((s) => (s.links ?? []).map((l) => [s.id, l.slug]));
    expect(links, `${locale} link placement`).toEqual([["what-matsun-becomes", "spas"]]);

    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((para) => para.includes(link.phrase)),
          `${locale} "${link.phrase}" appears in ${section.id}`,
        ).toBe(true);
      }
    }

    // Tan is described and deliberately not linked, because no such article
    // exists. A relatedSlug pointing at nothing is the failure being prevented.
    expect(article.relatedSlugs, `${locale} no phantom tan relation`).not.toContain("tan");
  }

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/cuisine/${MATSUN}`);
    await expect(page.locator(`main a[href="/${locale}/cuisine/spas"]`).first()).toBeVisible();
  }
});

test("matsun rests on scholarship, and no product page carries its history", async ({ page }) => {
  const sources = getSources(MATSUN);
  expect(sources.length, "matsun has a bibliography").toBeGreaterThanOrEqual(5);
  for (const source of sources) {
    expect(source.identifier?.value, `${source.title} carries an identifier`).toBeTruthy();
  }

  const values = sources.map((s) => String(s.identifier?.value ?? "").toLowerCase()).join(" ");
  for (const host of [
    "gatapandok",
    "mynarum",
    "tnakan",
    "yogurtathome",
    "beetsandbones",
    "figaroshakes",
    "nourishedkitchen",
    "advantour",
    "willflyforfood",
    "phoenixtour",
  ]) {
    expect(values, `no commercial or recipe source: ${host}`).not.toContain(host);
  }

  // The peer-reviewed microbiology is present by DOI, and Ačaṙyan is present at
  // last — the work two earlier steps had to record as unreachable.
  expect(
    sources.some((s) => s.identifier?.kind === "doi"),
    "a DOI-identified study",
  ).toBe(true);
  expect(
    sources.some((s) => String(s.identifier?.value).includes("archive.org/details/Hrarm")),
    "Acharian's dictionary, consulted directly",
  ).toBe(true);

  expect(
    sources.some((s) => (s.author ?? "").includes("Petrosian")),
    "Petrosian & Underwood stays out, as §38 asks",
  ).toBe(false);

  await page.goto(`/en/cuisine/${MATSUN}`);
  await expect(page.getByText("Food Microbiology", { exact: false }).first()).toBeVisible();
});

test("matsun has no artwork, says so, and borrows nobody else's", async ({ page }) => {
  /*
    The pending-artwork state, in the shape this section has now needed four
    times. Spas is named in the borrowing check first because it is the real risk
    here: spas is *made of* matsun, so a substitution would feel nearly right.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/cuisine/${MATSUN}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} placeholder`).toHaveCount(1);
    await expect(figure.locator("img"), `${locale} no raster`).toHaveCount(0);
    await expect(figure.locator("figcaption"), locale).toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, MATSUN)),
    );
    await expect(figure.locator("figcaption"), `${locale} not the AI caption`).not.toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, MATSUN)),
    );
  }

  expect(getImageSrc(MATSUN), "no registered file").toBeUndefined();
  expect(PENDING_ARTWORK, "declared pending rather than silently bare").toContain(MATSUN);
  expect([...PENDING_ARTWORK], "and it is the only one").toEqual([MATSUN]);

  await page.goto(`/en/cuisine/${MATSUN}`);
  const heroSources = await page
    .locator("header img")
    .evaluateAll((nodes) => nodes.map((el) => decodeURIComponent(el.getAttribute("src") ?? "")));
  for (const other of ILLUSTRATED) {
    expect(
      heroSources.some((src) => src.includes(`/cuisine/${other}.webp`)),
      `${other} must not illustrate matsun`,
    ).toBe(false);
  }

  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(property).first().getAttribute("content");
    expect(content, property).toContain("/og-default.png");
  }

  const graph = await readGraph(page);
  expect(node(graph, "Article").image, "no Article.image while pending").toBeUndefined();
  const serialized = JSON.stringify(graph);
  for (const forbidden of [
    "Recipe",
    "HowTo",
    "NutritionInformation",
    "MenuItem",
    "FoodEstablishment",
    "recipeIngredient",
    "recipeInstructions",
  ]) {
    expect(serialized, `no ${forbidden} in the graph`).not.toContain(forbidden);
  }
});

test("adding matsun changed no existing dish's relations, type or artwork", async ({ page }) => {
  for (const locale of LOCALES) {
    const dishes = bundle(locale).articles.filter((a) => a.category === "cuisine");
    const authored = Object.fromEntries(dishes.map((a) => [a.slug, a.relatedSlugs]));
    expect(authored[SPAS], `${locale} spas relations untouched`).toEqual(["harissa", "lavash"]);
    expect(authored[KHASH], `${locale} khash relations untouched`).toEqual(["lavash", "harissa"]);
    expect(authored[JINGALOV], `${locale} jingalov relations untouched`).toEqual(["lavash"]);
  }

  // Spas keeps the dolma filler §71 and §73 were each told not to alter, khash
  // keeps its own, and matsun takes what the registry order gives it. Read off
  // the rendered page rather than off the function.
  for (const [slug, expected] of [
    [SPAS, ["harissa", "lavash", "dolma"]],
    [KHASH, ["lavash", "harissa", "dolma"]],
    [MATSUN, ["spas", "lavash", "dolma"]],
  ] as const) {
    await page.goto(`/en/cuisine/${slug}`);
    const hrefs = await page
      .locator('main a[href^="/en/cuisine/"]')
      .evaluateAll((nodes) => nodes.map((el) => el.getAttribute("href") ?? ""));
    for (const related of expected) {
      expect(
        hrefs.some((href) => href.endsWith(`/cuisine/${related}`)),
        `${slug} still offers ${related}`,
      ).toBe(true);
    }
  }

  // And the nine existing covers are exactly where they were.
  for (const slug of ILLUSTRATED) {
    expect(getImageSrc(slug), `${slug} artwork unchanged`).toBe(ARTWORK[slug]);
  }
});
