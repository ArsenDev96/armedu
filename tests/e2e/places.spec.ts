import { expect, test } from "@playwright/test";
import { getPlaceCoordinateRegistry } from "@/data/geo";
import { PENDING_ARTWORK, getImageRegistry, getImageSrc } from "@/lib/media";
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

/**
 * The second place. It shipped without artwork and rendered the generated
 * placeholder; its own illustration has since landed and is registered.
 */
const ETCHMIADZIN = "etchmiadzin-cathedral";

/**
 * The third place, and the first under the `historical` filter.
 *
 * It shipped ahead of its artwork in §33 and rendered the generated placeholder;
 * §34 registered `erebuni-fortress.webp`, so it now has a cover like the other
 * two and `PENDING_ARTWORK` is empty again.
 */
const EREBUNI = "erebuni-fortress";

/**
 * The fourth place, and the first under the `museum` filter.
 *
 * Like Etchmiadzin (§31) and Erebuni (§33) before it, it shipped ahead of its
 * artwork and rendered the generated placeholder; §36 registered
 * `matenadaran.webp`, so every place in the section now has a cover and
 * `PENDING_ARTWORK` is empty again.
 */
const MATENADARAN = "matenadaran";

/**
 * The fifth place, and the first under the `nature` filter.
 *
 * It is also the first place that is not a building. Every assertion in this file
 * that assumed a place is a built complex has to be revisited for it, and two
 * genuinely differ: its coordinate carries `precision: "area"` rather than
 * `"site"`, because a lake has no single point, and it ships ahead of its artwork
 * like Etchmiadzin (§31), Erebuni (§33) and the Matenadaran (§35) did before it.
 *
 * So `PENDING_ARTWORK` is non-empty for the fourth time, and the tests below are
 * back in the split state the comment on `ILLUSTRATED` describes.
 */
const SEVAN = "lake-sevan";

/** All five places, for the assertions that must hold of every article in the section. */
const PLACES = [SLUG, ETCHMIADZIN, EREBUNI, MATENADARAN, SEVAN] as const;

/**
 * The places whose artwork has actually landed — currently four of the five.
 *
 * Kept as its own list rather than folded into `PLACES` because the section has
 * been in the split state four times now (§31, §33, §35, §37) and left it three
 * times (§32, §34, §36), and on every one of those occasions the change was
 * to move one slug between these two lines. Artwork assertions run over this one:
 * claiming provenance for a slug that has no file would be asserting a fiction,
 * and the next place written ahead of its picture needs this list to already
 * exist rather than to be reconstructed under pressure.
 *
 * Lake Sevan is deliberately absent: no asset in `public/` depicts it, and the
 * reasoning for rejecting the near misses is recorded on `PENDING_ARTWORK`.
 */
const ILLUSTRATED = [SLUG, ETCHMIADZIN, EREBUNI, MATENADARAN] as const;

/**
 * The registered file per slug — the single source of truth for every artwork
 * assertion below.
 *
 * One entry drives six surfaces (hero, featured block, card, search thumbnail,
 * social tags, sitemap), all reached through `getImageSrc`, and all silent if the
 * registration is wrong. Writing the expected path once here is what stops a test
 * from being updated to match a regression.
 *
 * The extensions differ on purpose and are not a typo: Khor Virap's cover is a
 * PNG copied from the homepage hero (§30), while the other three are 1586×992
 * WebPs like the rest of the registry (§32, §34, §36).
 */
const ARTWORK = {
  [SLUG]: "/images/places/khor-virap.png",
  [ETCHMIADZIN]: "/images/places/etchmiadzin-cathedral.webp",
  [EREBUNI]: "/images/places/erebuni-fortress.webp",
  [MATENADARAN]: "/images/places/matenadaran.webp",
} as const satisfies Record<(typeof ILLUSTRATED)[number], string>;

/**
 * Matches a registered file inside a rendered `src`.
 *
 * Next's optimizer rewrites `src` into `/_next/image?url=%2Fimages%2F…`, so the
 * full path is percent-encoded and the bare filename is what survives intact.
 * The dot is escaped because `.webp` would otherwise match `Xwebp`.
 */
const fileIn = (path: string) => new RegExp(path.split("/").pop()!.replace(".", "\\."));

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
    await expect(cards(page)).toHaveCount(5);

    // All five places open in this edition, under their own titles. The loop is
    // what catches an article authored in `hy` and forgotten in the other two —
    // the listing would still render, with one card short and no error anywhere.
    for (const slug of PLACES) {
      const article = await page.goto(`/${locale}/places/${slug}`);
      expect(article?.status(), `${locale}/places/${slug}`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        articleTitle(locale, slug),
      );

      // Published, not "not translated in this language", and indexable.
      await expect(
        page.getByRole("heading", { name: dict.unavailable.heading, level: 1 }),
      ).toHaveCount(0);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    }
  });
}

test("the Armenian editions never fall back to the English place title", async ({ page }) => {
  await page.goto("/hy/places");
  for (const english of [
    "Khor Virap",
    "Etchmiadzin Cathedral",
    "Erebuni Fortress",
    "Matenadaran",
    "Lake Sevan",
  ]) {
    await expect(page.getByText(english, { exact: true })).toHaveCount(0);
  }
  for (const slug of PLACES) {
    await expect(page.getByRole("link", { name: articleTitle("hy", slug) }).first()).toBeVisible();
  }
});

test("the places listing filters by kind of site, and keeps it in the URL", async ({ page }) => {
  await page.goto("/en/places");
  await expect(cards(page)).toHaveCount(5);

  await page.getByRole("button", { name: placeTypeLabel("en", "monastery") }).click();

  // Two of the five places are monasteries and churches, so the filter genuinely
  // narrows. With five articles and five pills, a filter that quietly matched
  // everything would no longer look like a plausible count.
  await expect(cards(page)).toHaveCount(2);
  for (const slug of [SLUG, ETCHMIADZIN]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
    ).toBeVisible();
  }
  for (const slug of [EREBUNI, MATENADARAN, SEVAN]) {
    await expect(page.getByRole("link", { name: articleTitle("en", slug) })).toHaveCount(0);
  }
  await expect(page).toHaveURL(/[?&]type=monastery/);
  // The filter key is `type`, like cuisine and works — not `period`.
  await expect(page).not.toHaveURL(/period=/);

  // And the query parameter restores the state on a cold load.
  await page.goto("/en/places?type=monastery");
  await expect(
    page.getByRole("button", { name: placeTypeLabel("en", "monastery") }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("each single-article filter returns exactly its own article", async ({ page }) => {
  /*
    The three narrow types, and the failure worth catching: a filter id added to
    the vocabulary but attached to no article — or attached to the wrong one — is a
    pill that returns the empty state or somebody else's article.
    `validate:content` fails on the first of those; only a rendered listing
    catches the second, and with three one-article filters side by side any pair
    could also be crossed over without a single count changing.
  */
  for (const [type, slug] of [
    ["historical", EREBUNI],
    ["museum", MATENADARAN],
    ["nature", SEVAN],
  ] as const) {
    await page.goto("/en/places");
    await page.getByRole("button", { name: placeTypeLabel("en", type) }).click();

    await expect(cards(page), type).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
      type,
    ).toBeVisible();
    for (const other of PLACES.filter((entry) => entry !== slug)) {
      await expect(
        page.getByRole("link", { name: articleTitle("en", other) }),
        `${type} must not show ${other}`,
      ).toHaveCount(0);
    }
    await expect(page).toHaveURL(new RegExp(`[?&]type=${type}`));

    // Clearing returns all five, so the pill filters rather than replaces the set.
    await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
    await expect(cards(page), type).toHaveCount(5);
  }
});

test("the filter vocabulary is exactly the five ids, in every edition", () => {
  /*
    Ids are shared across editions and only the labels are translated. A locale
    that added, dropped or renamed one would still compile and still render, and
    the reader of that edition would simply be filtering a different taxonomy.
  */
  for (const locale of LOCALES) {
    expect(
      bundle(locale).placeTypes.map((filter) => filter.id),
      `${locale} placeTypes`,
    ).toEqual(["all", "monastery", "historical", "museum", "nature"]);
    // Every label is filled and none is the raw id leaking through.
    for (const filter of bundle(locale).placeTypes) {
      expect(filter.label.trim().length, `${locale} ${filter.id} label`).toBeGreaterThan(0);
      expect(filter.label, `${locale} ${filter.id} label`).not.toBe(filter.id);
    }
  }

  // Each narrow type matches exactly the article that earned it, and the two
  // monasteries are still the only articles under `monastery`.
  const under = (type: string) =>
    bundle("hy")
      .articles.filter((entry) => entry.category === "places" && entry.placeTypeId === type)
      .map((entry) => entry.slug)
      .sort();

  expect(under("historical")).toEqual([EREBUNI]);
  expect(under("museum")).toEqual([MATENADARAN]);
  expect(under("nature")).toEqual([SEVAN]);
  expect(under("monastery")).toEqual([ETCHMIADZIN, SLUG].sort());

  // `nature` rather than `landscape`, and the id travels untranslated. The label
  // is the only part that differs per edition, so a locale that localised the id
  // would drop its own article out of the pill without failing anything else.
  for (const locale of LOCALES) {
    const nature = bundle(locale).placeTypes.find((filter) => filter.id === "nature");
    expect(nature, `${locale} nature filter`).toBeDefined();
    expect(nature!.label, `${locale} nature label`).not.toBe("nature");
  }
});

test("the featured block comes from the flag, not a hard-coded slug", async ({ page }) => {
  const dict = ui("en");
  await page.goto("/en/places");

  await expect(page.getByText(dict.listing.places.featuredEyebrow)).toBeVisible();
  // `.first()` is the featured block's own link; the card below repeats the label.
  await expect(
    page.getByRole("link", { name: dict.listing.places.readArticle }).first(),
  ).toHaveAttribute("href", `/en/places/${SLUG}`);

  // The article carries the flag the listing reads. With a second place in the
  // section this is no longer trivially true: the listing takes the *first*
  // article when nothing is flagged, so exactly one flag is what keeps the
  // featured block deliberate rather than incidental.
  const flagged = bundle("en")
    .articles.filter((entry) => entry.category === "places" && entry.featured)
    .map((entry) => entry.slug);
  expect(flagged, "exactly one place should carry featured: true").toEqual([SLUG]);
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

test("the second place is findable under the places group too", async ({ page }) => {
  const dict = ui("en");
  await page.goto("/en/search?q=Etchmiadzin");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.getByRole("link", { name: articleTitle("en", ETCHMIADZIN) }).first()).toBeVisible();
});

test("the third place is findable under the places group too", async ({ page }) => {
  /*
    "Erebuni" also matches the history article on Urartu, which mentions the
    fortress and legitimately ranks alongside it. The assertion is therefore that
    the *place* appears under the places heading, not that it is the only hit —
    the failure this catches is an article indexed under its category label but
    missing from the grouped results.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Erebuni");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${EREBUNI}"]`).first()).toBeVisible();
});

test("the fourth place is findable under the places group too", async ({ page }) => {
  /*
    Scoped by href for the same reason as Erebuni: "Matenadaran" also matches the
    history article on the alphabet, which names it in its own legacy section and
    can legitimately rank above the place.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Matenadaran");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${MATENADARAN}"]`).first()).toBeVisible();
});

test("the fifth place is findable under the places group too", async ({ page }) => {
  /*
    Scoped by href like the three above, and for a sharper reason than any of
    them: "Sevan" appears in the Urartu article's own prose, and the lake is also
    named in this article's siblings. The group heading is what matters here —
    a `nature` article is the first place that is not a building, and the search
    grouping keys on category rather than on what the subject is.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Sevan");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${SEVAN}"]`).first()).toBeVisible();
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
  Four of the five places ship a cover, and each registration is a single `IMAGES`
  entry that has to light up six surfaces — hero, featured block, card, search
  thumbnail, social tags, sitemap — every one reached through `getImageSrc`, and
  every one silent if the registration is wrong.

  The caption is the assertion that matters most. `isGeneratedArtwork` flips to
  true the moment a slug enters the registry, and that is what makes the page
  state "AI-generated" rather than "placeholder". A registration that rendered
  the picture without the disclosure would look completely correct.

  These run over `ILLUSTRATED`, which is currently four of the five places. The
  placeholder branch is asserted below as a real case again, not as an absence:
  Lake Sevan is the subject it lost in §36 and regained in §37.
*/

test("each article hero renders its own registered artwork and names the AI provenance", async ({
  page,
}) => {
  /*
    Every edition, not just `hy`. The hero, the placeholder branch and the caption
    are all locale-independent code reading a locale-dependent dictionary, so a
    registration that reached one edition and not the others is the failure this
    loop exists to make impossible — and §34 is the first pass where a file
    landed after the article had already shipped in all three.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);

    for (const slug of ILLUSTRATED) {
      await page.goto(`/${locale}/places/${slug}`);

      // Next's optimizer rewrites `src` into `/_next/image?url=…`, so the encoded
      // original is what identifies the file.
      const hero = page.locator("header figure img");
      await expect(hero, `${locale} ${slug}`).toHaveAttribute("src", fileIn(ARTWORK[slug]));

      // The placeholder must be gone: a registered slug renders a raster file, not
      // the inline `<svg role="img">` the generated artwork uses.
      await expect(
        page.locator("header figure svg[role='img']"),
        `${locale} ${slug}`,
      ).toHaveCount(0);

      // A place is a scene, not a likeness, so it takes the illustration wording —
      // the same branch the cuisine artwork uses, and not the portrait one. And it
      // must not be the placeholder wording, which would be the tell that a file
      // rendered without its disclosure.
      await expect(page.locator("header figcaption"), `${locale} ${slug}`).toHaveText(
        dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, slug)),
      );
      await expect(page.locator("header figcaption"), `${locale} ${slug}`).not.toHaveText(
        dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, slug)),
      );
    }
  }
});

test("no illustrated place renders the artwork placeholder", async ({ page }) => {
  /*
    The other half of the caption logic, asserted as an absence — and scoped to
    `ILLUSTRATED` again now that the section is back in the split state.

    Between §36 and §37 this ran over `PLACES`, because every place had a file.
    Lake Sevan does not, so running it over `PLACES` would now assert that the
    pending article renders a picture it was deliberately not given. The subject
    is the four that *are* registered: none of them may fall back to the generated
    `<svg>`, and none may still be captioned as a picture that was never made.

    Every edition, because the branch reads a locale dictionary: a registration
    that reached `en` and not `hyw` would leave one edition apologising for a
    missing image that is sitting right there in the other two.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);

    for (const slug of ILLUSTRATED) {
      await page.goto(`/${locale}/places/${slug}`);

      await expect(page.locator("header figure svg[role='img']"), `${locale} ${slug}`).toHaveCount(
        0,
      );
      await expect(page.locator("header figure img"), `${locale} ${slug}`).toHaveCount(1);
      await expect(page.locator("header figcaption"), `${locale} ${slug}`).not.toHaveText(
        dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, slug)),
      );
    }
  }
});

test("the pending place renders the generated placeholder and says so", async ({ page }) => {
  /*
    The positive half of the same branch, which had no subject at all while
    `PENDING_ARTWORK` was empty.

    This is the assertion that makes shipping an article ahead of its picture a
    declared state rather than an oversight: Lake Sevan must render the inline
    generated `<svg>`, must render no raster file, and must be captioned as a
    placeholder — in all three editions, because the caption comes from a locale
    dictionary and a missing key would silently render the wrong sentence.

    The failure this exists to catch is the tempting fix rather than a regression:
    pointing the slug at `kingdom-of-urartu.webp` or `hero-ararat.png` would make
    the page look finished and would caption a different lake, or a mountain, as
    this article's own.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${SEVAN}`);

    await expect(page.locator("header figure svg[role='img']"), `${locale} ${SEVAN}`).toHaveCount(
      1,
    );
    await expect(page.locator("header figure img"), `${locale} ${SEVAN}`).toHaveCount(0);
    await expect(page.locator("header figcaption"), `${locale} ${SEVAN}`).toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, SEVAN)),
    );
    // And not the AI-illustration wording, which would claim a picture exists.
    await expect(page.locator("header figcaption"), `${locale} ${SEVAN}`).not.toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, SEVAN)),
    );
  }
});

test("the pending place borrows no other article's artwork anywhere on its page", async ({
  page,
}) => {
  /*
    Scoped to the surfaces that speak for *this* article — the head and the hero —
    rather than the whole document, for the same reason the Matenadaran test is:
    a related-article card lower down legitimately carries a sibling's cover.

    The named files are the three that were actually considered and rejected when
    the article was written, which is what makes this a regression test rather
    than a guess: Ani has no lake in it, the Urartu illustration is Lake Van
    country, and `hero-ararat` is a mountain over a plain.
  */
  await page.goto(`/en/places/${SEVAN}`);

  const metaValues = await page.locator("head meta[content]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("content") ?? ""),
  );
  const ld = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  /*
    The figure's own markup, not `img[src]`.

    Reading the `src` of `header figure img` is what the illustrated tests do, and
    it deadlocks here: this hero renders the generated `<svg>` and there is no
    `<img>` to read, so the locator waits out the timeout instead of returning
    nothing. Taking the subtree covers both branches and would still catch a
    borrowed file appearing inside it.
  */
  const hero = await page.locator("header figure").innerHTML();

  for (const borrowed of ["bagratid-armenia", "kingdom-of-urartu", "hero-ararat", "matenadaran"]) {
    for (const [surface, haystack] of [
      ["meta", metaValues.join(" ")],
      ["structured data", ld],
      ["hero", hero],
    ] as const) {
      expect(haystack.includes(borrowed), `${borrowed} must not appear in ${SEVAN}'s ${surface}`).toBe(
        false,
      );
    }
  }

  /*
    `Article.image` is a claim that a picture depicts this article, so with no file
    registered the property must be absent entirely rather than nominating the
    generic site card. `og:image` is a link-preview slot and the default belongs
    there — the two are different claims, and this is the distinction the
    Matenadaran test recorded on the way out of its own pending state.
  */
  const graph = (JSON.parse(ld) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  expect(article?.image, "no image may be claimed while the artwork is pending").toBeUndefined();
});

test("the newest place's metadata borrows no other article's artwork", async ({ page }) => {
  /*
    Matenadaran kept this test when its picture landed, because the failure it
    guards against survives registration: the article's `relatedSlugs` include
    Etchmiadzin, and the institute carries the name of the history article
    illustrated by the Mashtots portrait. Either file appearing *as this article's
    own* would be invisible on the page and wrong in every share preview and in
    the structured data. What changed is the expected value — the site default
    gives way to the real cover.
  */
  await page.goto(`/en/places/${MATENADARAN}`);

  const own = `https://armat.site${ARTWORK[MATENADARAN]}`;
  for (const meta of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(meta)).toHaveAttribute("content", own);
  }

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "") as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  /*
    `Article.image` is a claim that a picture *depicts this article*, which is why
    `articleLd` omitted the property entirely while the slug had no file rather
    than nominating the generic site card — an `og:image` is a link-preview card
    and the default belongs there, but the two are not the same claim. Now that a
    real cover exists, the property is present and is that cover.
  */
  expect(article?.image, "the registered artwork should now be declared").toEqual({
    "@type": "ImageObject",
    url: own,
  });

  /*
    And no sibling's file in this article's own surfaces — not in a meta tag, not
    in the structured data, and not in the hero.

    Scoped to those rather than to the whole document on purpose: Etchmiadzin's
    cover legitimately appears *lower down the page* on a related-article card,
    which is what a first, broader version of this assertion wrongly failed on.
    Borrowing is only a fault when the borrowed file is presented as this
    article's own.
  */
  const metaValues = await page
    .locator("head meta[content]")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? ""));
  const surfaces = [...metaValues, raw ?? ""].join(" ");

  // Drawn from `ILLUSTRATED`, not `PLACES`: only a file that exists can be
  // borrowed, and Lake Sevan has none to lend.
  const borrowable = [
    ...ILLUSTRATED.filter((slug) => slug !== MATENADARAN).map((slug) => ARTWORK[slug]),
    "/images/history/mesrop-mashtots.webp",
  ];
  for (const fragment of borrowable) {
    expect(
      surfaces.includes(fragment),
      `${fragment} must not appear in ${MATENADARAN}'s own metadata`,
    ).toBe(false);
  }
  await expect(page.locator("header figure img")).toHaveAttribute(
    "src",
    fileIn(ARTWORK[MATENADARAN]),
  );
});

test("the listing renders each registered place's own artwork, and one placeholder", async ({
  page,
}) => {
  await page.goto("/en/places");

  // `ArticleCard` is the shared component — the same one a related-articles
  // block renders — so this covers both surfaces through one lookup.
  const images = page.locator("main img");
  await expect(images).not.toHaveCount(0);

  const sources = (
    await images.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("src") ?? ""))
  ).map(decodeURIComponent);

  // Every registered file appears: Khor Virap is the featured block *and* a card,
  // the other three are cards. The failure this catches is the one-line
  // registration reaching some surfaces and not others.
  for (const slug of ILLUSTRATED) {
    expect(
      sources.some((src) => src.includes(ARTWORK[slug])),
      `${slug} artwork missing from the listing; got ${sources.join(", ")}`,
    ).toBe(true);
  }

  // Nothing else leaked in — a stray og-default or a wrong file fails here. In
  // particular no history illustration must have been pressed into service as a
  // stand-in for a place whose own picture has not arrived.
  const allowed = Object.values(ARTWORK) as string[];
  expect(
    sources.every((src) => allowed.some((path) => src.includes(path))),
    `unexpected image on the places listing; got ${sources.join(", ")}`,
  ).toBe(true);
  for (const borrowed of ["kingdom-of-urartu", "mesrop-mashtots"]) {
    expect(
      sources.some((src) => src.includes(borrowed)),
      `${borrowed} must not stand in for a place`,
    ).toBe(false);
  }

  /*
    Exactly one placeholder, not zero and not two.

    This assertion inverted in §37. While every place had a file the listing could
    contain no generated `<svg>` at all; Lake Sevan has none, so precisely one card
    must take that branch. Pinning the count rather than asserting "at least one"
    is what catches the two failures either side of it: a second place quietly
    losing its registration, and Sevan being handed a borrowed file to make the
    listing look uniform.
  */
  await expect(page.locator("main svg[role='img']")).toHaveCount(1);
  expect(
    sources,
    "one image per illustrated place, plus the featured block's repeat",
  ).toHaveLength(ILLUSTRATED.length + 1);
});

test("a place's search thumbnail renders the artwork", async ({ page }) => {
  for (const [slug, query] of [
    [SLUG, "Khor%20Virap"],
    [ETCHMIADZIN, "Etchmiadzin"],
    [EREBUNI, "Erebuni"],
    [MATENADARAN, "Matenadaran"],
  ] as const) {
    await page.goto(`/en/search?q=${query}`);

    // Scoped to this place's own result card, not `.first()`. Every query here
    // has a rival in History: "Etchmiadzin" matches the article on the conversion,
    // "Erebuni" the one on Urartu, and "Matenadaran" the one on the alphabet,
    // which names the institute in its legacy section. Any of them may legitimately
    // rank above the place — taking the first thumbnail on the page would assert
    // against that article's artwork instead, and would have passed before these
    // registrations existed.
    const card = page
      .getByRole("main")
      .getByRole("listitem")
      .filter({ has: page.locator(`a[href="/en/places/${slug}"]`) });

    await expect(card, slug).toHaveCount(1);
    await expect(card.locator("img"), slug).toHaveAttribute("src", fileIn(ARTWORK[slug]));
  }
});

test("the pending place is findable in search and shows the placeholder thumbnail", async ({
  page,
}) => {
  /*
    Two things at once, because they fail independently: a place with no artwork
    must still be indexed and reachable, and its card must render the generated
    thumbnail rather than nothing or somebody else's picture.

    "Sevan" is a query with a rival — the Urartu article names the lake — so the
    card is located by its own href rather than taken as the first result.
  */
  await page.goto("/en/search?q=Sevan");

  const card = page
    .getByRole("main")
    .getByRole("listitem")
    .filter({ has: page.locator(`a[href="/en/places/${SEVAN}"]`) });

  await expect(card, SEVAN).toHaveCount(1);
  await expect(card.locator("svg[role='img']"), SEVAN).toHaveCount(1);
  await expect(card.locator("img"), SEVAN).toHaveCount(0);
});

test("the artwork reaches Open Graph, Twitter and the article's structured data", async ({
  page,
}) => {
  for (const slug of ILLUSTRATED) {
    await page.goto(`/en/places/${slug}`);

    // Absolute, because several scrapers do not resolve relative image URLs.
    const expected = `https://armat.site${ARTWORK[slug]}`;
    await expect(page.locator('meta[property="og:image"]'), slug).toHaveAttribute(
      "content",
      expected,
    );
    await expect(page.locator('meta[name="twitter:image"]'), slug).toHaveAttribute(
      "content",
      expected,
    );
    // Not the generic site card, and not the *other* place's file — inheriting a
    // sibling's art would be invisible on the page and wrong in every preview.
    for (const meta of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      await expect(page.locator(meta), `${slug} ${meta}`).not.toHaveAttribute(
        "content",
        /og-default/,
      );
    }

    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const graph = (JSON.parse(raw ?? "") as { "@graph": Record<string, unknown>[] })["@graph"];
    const article = graph.find((entry) => entry["@type"] === "Article");
    expect(article?.image, slug).toEqual({ "@type": "ImageObject", url: expected });
  }
});

test("the sitemap carries every place's illustration for image search", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const slug of ILLUSTRATED) {
    // One image entry per locale route, so three per place.
    const url = `https://armat.site${ARTWORK[slug]}`;
    expect(xml.split(url).length - 1, `${slug} image entries`).toBe(LOCALES.length);
  }

  // The inverse of what this block asserted while Matenadaran was pending: its
  // three url entries carried no `image:loc` at all, and now each must carry its
  // own. A sitemap that advertised the wrong file would 404 for an image crawler
  // or credit the picture to another article.
  const blocks = xml.split("<url>").filter((block) => block.includes(`/places/${MATENADARAN}<`));
  expect(blocks, `${MATENADARAN} url blocks`).toHaveLength(LOCALES.length);
  for (const block of blocks) {
    expect(block, `${MATENADARAN} sitemap image`).toContain(
      `https://armat.site${ARTWORK[MATENADARAN]}`,
    );
  }

  /*
    And the pending place is the state this block asserted for the Matenadaran
    before §36: its three url entries must be present and must carry no
    `image:loc` at all.

    Advertising an image for a slug that has no file is the specific failure —
    an image crawler would fetch a 404, or worse, be handed another article's
    picture and credit it to this one.
  */
  const pending = xml.split("<url>").filter((block) => block.includes(`/places/${SEVAN}<`));
  expect(pending, `${SEVAN} url blocks`).toHaveLength(LOCALES.length);
  for (const block of pending) {
    expect(block, `${SEVAN} must advertise no sitemap image`).not.toContain("image:loc");
  }
});

/*
  `PENDING_ARTWORK` names exactly the gap, and this asserts it stays honest in
  both directions.

  The list is the repository's record of a deliberate absence. An entry left
  behind after its file landed would keep a real cover out of the page; a slug
  missing from both `IMAGES` and this list would render the placeholder with
  nothing saying whether that was a decision. Both are silent failures, and the
  section currently contains neither.
*/
test("the pending list names exactly the one place that is waiting for artwork", () => {
  /*
    Exactly `[SEVAN]`, in both directions.

    Asserting the whole array rather than `toContain` is deliberate: it fails on a
    stale entry left behind after a file lands — the half of the invariant no
    other test covers — as well as on a slug quietly added here to silence the
    placeholder assertions above.
  */
  expect(PENDING_ARTWORK).toEqual([SEVAN]);

  for (const slug of ILLUSTRATED) {
    expect(getImageSrc(slug), `${slug} should resolve through the registry`).toBe(ARTWORK[slug]);
    expect(PENDING_ARTWORK, `${slug} is registered and must not also be pending`).not.toContain(
      slug,
    );
  }

  // And the pending one resolves to nothing at all, which is what makes every
  // consumer fall through to the generated artwork.
  expect(getImageSrc(SEVAN), `${SEVAN} must have no registered file`).toBeUndefined();
});

test("the registry and the pending list are mutually exclusive", () => {
  /*
    The invariant behind both states, checked across the whole repository rather
    than only for places. `validate:content` fails on a pending slug that already
    has a file; nothing checked the other direction, and nothing checked it for
    the categories this section does not touch.
  */
  const registry = getImageRegistry();

  for (const slug of PENDING_ARTWORK) {
    expect(registry[slug], `${slug} is pending and must have no registered file`).toBeUndefined();
  }
  for (const slug of Object.keys(registry)) {
    expect(PENDING_ARTWORK, `${slug} is registered and must not be pending`).not.toContain(slug);
  }
});

/*
  Registering a place must not disturb anything else in `IMAGES`.

  The registry is one flat map, and the edit that added a key is exactly the kind
  that quietly retypes a neighbouring value. This pins every other entry.
*/
test("no unrelated article artwork changed", () => {
  const registry = getImageRegistry();

  // Khor Virap keeps its PNG — the copy of the homepage hero from §30, not a WebP.
  expect(registry["khor-virap"]).toBe("/images/places/khor-virap.png");

  // The other four categories are pinned entry by entry. Registering a place is
  // a one-line change in a flat map shared by every category, so "nothing else
  // moved" is worth asserting rather than assuming — and this is the only check
  // that would catch a History, Writers, Works or Cuisine path being retyped in
  // passing. In particular `mesrop-mashtots.webp` must still belong to the
  // alphabet article and to nothing else.
  expect(
    Object.fromEntries(
      Object.entries(registry).filter(([, path]) => !path.startsWith("/images/places/")),
    ),
  ).toEqual({
    "kingdom-of-urartu": "/images/history/kingdom-of-urartu.webp",
    "tigran-the-great": "/images/history/tigran-the-great.webp",
    "mesrop-mashtots-armenian-alphabet": "/images/history/mesrop-mashtots.webp",
    "adoption-of-christianity": "/images/history/adoption-of-christianity.webp",
    "battle-of-avarayr": "/images/history/battle-of-avarayr.webp",
    "bagratid-armenia": "/images/history/bagratid-armenia.webp",
    "first-republic-of-armenia": "/images/history/first-republic-armenia.webp",
    "hovhannes-tumanyan": "/images/writers/hovhannes-tumanyan.webp",
    "yeghishe-charents": "/images/writers/yeghishe-charents.webp",
    raffi: "/images/writers/raffi.webp",
    "avetik-isahakyan": "/images/writers/avetik-isahakyan.webp",
    "khachatur-abovyan": "/images/writers/khachatur-abovyan.webp",
    "paruyr-sevak": "/images/writers/paruyr-sevak.webp",
    anush: "/images/works/anush.webp",
    "david-of-sassoun": "/images/works/david-of-sassoun.webp",
    "wounds-of-armenia": "/images/works/wounds-of-armenia.webp",
    "the-fool": "/images/works/the-fool.webp",
    lavash: "/images/cuisine/lavash.webp",
    dolma: "/images/cuisine/dolma.webp",
    khorovats: "/images/cuisine/khorovats.webp",
    harissa: "/images/cuisine/harissa.webp",
    gata: "/images/cuisine/gata.webp",
    ghapama: "/images/cuisine/ghapama.webp",
  });

  // Every other entry is still a WebP in one of the category directories, and
  // nothing but Khor Virap is a PNG.
  //
  // Deliberately not asserted: that a filename matches its slug. It is not a
  // convention here — `mesrop-mashtots-armenian-alphabet` maps to
  // `mesrop-mashtots.webp` and `first-republic-of-armenia` to
  // `first-republic-armenia.webp`, both long-standing and both correct.
  for (const [slug, path] of Object.entries(registry)) {
    if (slug === "khor-virap") continue;
    expect(path, `${slug} should be a WebP under /images/`).toMatch(
      /^\/images\/(history|writers|works|cuisine|places)\/[a-z0-9-]+\.webp$/,
    );
  }

  // Etchmiadzin keeps its WebP, and Erebuni and Matenadaran each get their own
  // rather than borrowing one. All four are pinned by name rather than only by
  // shape: the tempting shortcut in §33 and again in §35 was to point the article
  // with no picture at a file that already existed, and this is the assertion that
  // would have caught it.
  expect(registry["etchmiadzin-cathedral"]).toBe("/images/places/etchmiadzin-cathedral.webp");
  expect(registry[EREBUNI]).toBe("/images/places/erebuni-fortress.webp");
  expect(registry[MATENADARAN]).toBe("/images/places/matenadaran.webp");

  // Only the four *illustrated* places live under /images/places/, so registering
  // a cover cannot have repointed an article from another category — and the
  // Urartu illustration is still filed under history, where it belongs. Lake
  // Sevan is absent by design: comparing against `ILLUSTRATED` rather than
  // `PLACES` is what makes this fail if it is ever given a borrowed file.
  const inPlaces = Object.entries(registry)
    .filter(([, path]) => path.startsWith("/images/places/"))
    .map(([slug]) => slug)
    .sort();
  expect(inPlaces).toEqual([...ILLUSTRATED].sort());

  // And the homepage hero is not in the registry at all: `Hero.tsx` points at
  // `/hero-ararat.png` directly, which is what keeps the homepage independent of
  // this map.
  expect(Object.values(registry)).not.toContain("/hero-ararat.png");
});

test("the homepage still renders its own hero, untouched by the places registry", async ({
  page,
}) => {
  await page.goto("/hy");
  await expect(page.locator('img[src*="hero-ararat"]').first()).toBeVisible();
  // The homepage must not pick up any places artwork. `Hero.tsx` points at
  // `/hero-ararat.png` directly and the homepage renders no place card, so a hit
  // here would mean a registration had leaked into a surface it never described.
  for (const fragment of ["etchmiadzin", "erebuni", "matenadaran", "lake-sevan"]) {
    await expect(page.locator(`img[src*="${fragment}"]`), fragment).toHaveCount(0);
  }
});

/* -------------------------------------------------------------------------- */
/*  SEO                                                                        */
/* -------------------------------------------------------------------------- */

test("the place article uses its own SEO fields and advertises every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    for (const slug of PLACES) {
      const article = bundle(locale).articles.find((entry) => entry.slug === slug);
      if (!article) throw new Error(`No "${slug}" in the "${locale}" bundle.`);

      await page.goto(`/${locale}/places/${slug}`);

      // Metadata from `seoTitle`/`metaDescription`, not from title/excerpt.
      expect(article.seoTitle, `${locale} ${slug} seoTitle`).toBeTruthy();
      expect(article.metaDescription, `${locale} ${slug} metaDescription`).toBeTruthy();
      await expect(page).toHaveTitle(`${article.seoTitle} | ${ui(locale).site.name}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        article.metaDescription!,
      );

      // The visible heading stays on `title`. `seoTitle` is longer and written for
      // a results page; rendering it as the H1 is the easy mistake here, and it
      // would be invisible to every other assertion in this file.
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(article.title);
      expect(article.seoTitle, `${locale} ${slug} seoTitle should differ from title`).not.toBe(
        article.title,
      );

      // Canonical, and one alternate per edition plus x-default.
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://armat.site/${locale}/places/${slug}`,
      );
      for (const other of LOCALES) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${other}"]`)).toHaveCount(1);
      }
      const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
      await expect(xDefault).toHaveCount(1);
      await expect(xDefault).toHaveAttribute("href", new RegExp(`/hy/places/${slug}$`));
    }
  }
});

test("a place emits the generic Article schema and no tourism types", async ({ page }) => {
  for (const slug of PLACES) {
    await page.goto(`/en/places/${slug}`);

    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const graph = (JSON.parse(raw ?? "") as { "@graph": { "@type"?: string }[] })["@graph"];
    const types = graph.map((entry) => entry["@type"]);

    expect(types, slug).toContain("Article");
    expect(types, slug).toContain("BreadcrumbList");
    // v1 deliberately ships no place-specific structured data: the page does not
    // carry the properties `Place`, `TouristAttraction` or `LocalBusiness` promise.
    // Etchmiadzin and Erebuni are where that would be most tempting — both have a
    // coordinate in the registry, one has a UNESCO inscription and the other is a
    // named archaeological site — so both are checked.
    for (const forbidden of [
      "Place",
      "TouristAttraction",
      "LocalBusiness",
      "Church",
      "ArchaeologicalSite",
      "LandmarksOrHistoricalBuildings",
    ]) {
      expect(types, `${forbidden} must not be emitted for ${slug}`).not.toContain(forbidden);
    }
  }
});

test("the sitemap carries every places URL in every edition", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const locale of LOCALES) {
    expect(xml, `${locale} listing`).toContain(`https://armat.site/${locale}/places</loc>`);
    for (const slug of PLACES) {
      expect(xml, `${locale} ${slug}`).toContain(
        `https://armat.site/${locale}/places/${slug}</loc>`,
      );
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  Coordinates                                                                */
/* -------------------------------------------------------------------------- */

/*
  `validate:content` already range-checks this registry and fails on a place with
  no entry. What it deliberately does not check — the file says so — is whether a
  point is the *right* point: there is no bounding box, and no duplicate check.

  This is the assertion those rules leave out. A coordinate typed one digit wrong
  still validates, and nothing renders these yet, so a mistake here would sit
  unnoticed until the first map. Pinning each point to the place it names is
  cheap now and archaeology later.
*/
test("the coordinate registry holds one checked point per place", () => {
  const registry = getPlaceCoordinateRegistry();
  const slugs = bundle("hy")
    .articles.filter((entry) => entry.category === "places")
    .map((entry) => entry.slug);

  expect(slugs.slice().sort()).toEqual(PLACES.slice().sort());
  expect(Object.keys(registry).sort()).toEqual(slugs.slice().sort());

  for (const slug of PLACES) {
    const point = registry[slug];
    expect(point, slug).toBeDefined();
    /*
      `site` for a built complex, `area` for one that has no single point.

      Until §37 every entry was a building and this line read `toBe("site")`. A
      lake is the first entry that would have had to lie to pass it: any point in
      a body of water that size is arbitrary, and declaring one at `site`
      precision would claim an accuracy the coordinate does not have. The
      distinction is asserted per slug rather than relaxed for all of them.
    */
    expect(point.precision, slug).toBe(slug === SEVAN ? "area" : "site");
    // Rounded on the way in, so no entry may carry a fifth decimal place.
    for (const value of [point.lat, point.lon]) {
      expect(Math.round(value * 10_000) / 10_000, `${slug} ${value} is not 4dp`).toBe(value);
    }
  }

  // The cathedral, not the middle of Vagharshapat. OSM puts the town centre near
  // 40.1703, 44.2888 and the Mother Cathedral at 40.1618, 44.2911 — close enough
  // that a lazy coordinate would look plausible, far enough that this catches it.
  const cathedral = registry[ETCHMIADZIN];
  expect(cathedral.lat).toBeCloseTo(40.1618, 4);
  expect(cathedral.lon).toBeCloseTo(44.2911, 4);
  expect(
    Math.abs(cathedral.lat - 40.1703),
    "the point should be the cathedral, not the town centre",
  ).toBeGreaterThan(0.005);

  /*
    The citadel on Arin Berd, from OSM way 445380061. Erebuni is the entry with
    the most convincing wrong answers available: the museum-reserve at the foot of
    the hill, the city district of the same name, and — the worst of them —
    Erebuni airport, which is several kilometres away and would still put a pin in
    a plausible-looking part of Yerevan. Each is excluded by distance below.
  */
  const fortress = registry[EREBUNI];
  expect(fortress.lat).toBeCloseTo(40.1403, 4);
  expect(fortress.lon).toBeCloseTo(44.5381, 4);
  // Not the airport (about 40.147, 44.465) and not central Yerevan (about
  // 40.1776, 44.5126). Degrees, so a tenth here is many kilometres.
  expect(
    Math.abs(fortress.lon - 44.465),
    "the point should be the fortress, not Erebuni airport",
  ).toBeGreaterThan(0.03);
  expect(
    Math.abs(fortress.lat - 40.1776),
    "the point should be the fortress, not central Yerevan",
  ).toBeGreaterThan(0.02);

  /*
    The Matenadaran building at the head of Mashtots Avenue, from OSM relation
    20960090. Its plausible wrong answers are all close by, which is the problem:
    the Cascade complex is about 44.5152 and central Yerevan about 40.1776,
    44.5126, both inside the same square kilometre of city.
  */
  const institute = registry[MATENADARAN];
  expect(institute.lat).toBeCloseTo(40.1925, 4);
  expect(institute.lon).toBeCloseTo(44.5222, 4);
  expect(
    Math.abs(institute.lon - 44.5152),
    "the point should be the Matenadaran, not the Cascade",
  ).toBeGreaterThan(0.005);
  expect(
    Math.abs(institute.lat - 40.1776),
    "the point should be the Matenadaran, not central Yerevan",
  ).toBeGreaterThan(0.01);

  /*
    Open water in the middle of the lake, from OSM relation 36956.

    Sevan's plausible wrong answers are all on the shore and all more findable
    than the lake itself, which is exactly why they are excluded by name here:
    Sevan town (about 40.5485, 44.9572) is what a gazetteer lookup for "Sevan"
    returns first, Sevanavank (about 40.5640, 45.0108) is the photograph everyone
    has seen, and the resort strip sits between them. All three are at the
    north-western tip; the registered point is well south-east of them, in water.
  */
  const lake = registry[SEVAN];
  expect(lake.lat).toBeCloseTo(40.3925, 4);
  expect(lake.lon).toBeCloseTo(45.3461, 4);
  expect(
    Math.abs(lake.lon - 44.9572),
    "the point should be the lake, not Sevan town",
  ).toBeGreaterThan(0.2);
  expect(
    Math.abs(lake.lon - 45.0108),
    "the point should be the lake, not Sevanavank",
  ).toBeGreaterThan(0.2);
  // And south-east of the whole north-western shore, rather than merely offset
  // along it — a point that drifted onto the resort strip would still be close in
  // longitude to one of the two above.
  expect(lake.lat, "the point should be south of the north-western tip").toBeLessThan(40.5);
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
