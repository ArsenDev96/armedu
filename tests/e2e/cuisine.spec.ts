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

/** Every dish in the section, as of §68. */
const SLUGS = ["lavash", "dolma", "khorovats", "harissa", "gata", "ghapama", SPAS] as const;

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
 * §69 closed the gap: `spas.webp` is registered and the two lists name the same
 * seven slugs again. The declaration stays, and stays separate. It is worth more
 * now than it was while it differed, because every assertion below that says "each
 * illustrated dish" keeps meaning that when the eighth dish ships ahead of its
 * picture, with no edit here.
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
] as const;

/** Where each dish's cover must live, spelled out rather than templated. */
const ARTWORK: Record<string, string> = {
  lavash: "/images/cuisine/lavash.webp",
  dolma: "/images/cuisine/dolma.webp",
  khorovats: "/images/cuisine/khorovats.webp",
  harissa: "/images/cuisine/harissa.webp",
  gata: "/images/cuisine/gata.webp",
  ghapama: "/images/cuisine/ghapama.webp",
  spas: "/images/cuisine/spas.webp",
};

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
      `${locale} taxonomy unchanged`,
    ).toEqual(["all", "bread", "main", "meat", "ceremonial", "dessert"]);
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

test("registering spas turned no dish's cover into another dish's", async ({ page }) => {
  /*
    The whole-section ownership claim, which is the one a single new key in a flat
    map can break without touching any file but `media.ts`. Each of the seven heroes
    must carry its own cover and none of the other six.

    English only: the artwork registry is not localized, and the per-edition claim is
    made for spas by the test above.
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

test("the cuisine listing shows no placeholders at all", async ({ page }) => {
  /*
    Derived from the two lists rather than typed as a literal, so the next dish to
    ship ahead of its picture needs no edit here. It evaluated to one for the only
    time in this section's history, between §68 and §69; it is back to zero, and the
    expression that says so is unchanged.
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
