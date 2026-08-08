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
 * that assumed a place is a built complex had to be revisited for it, and one
 * genuinely differs: its coordinate carries `precision: "area"` rather than
 * `"site"`, because a lake has no single point.
 *
 * It shipped ahead of its artwork in §37 like Etchmiadzin (§31), Erebuni (§33) and
 * the Matenadaran (§35) before it; §38 registered `lake-sevan.webp`, so every
 * place in the section has a cover again and `PENDING_ARTWORK` is empty.
 */
const SEVAN = "lake-sevan";

/**
 * The sixth place, and the second under the `historical` filter.
 *
 * Its arrival was the first time a place type gained a *second* article, which
 * changed the shape of several assertions below rather than only their counts:
 * `historical` left the single-article filter loop, and `under("historical")` is a
 * pair whose order must not matter.
 *
 * Like Etchmiadzin (§31), Erebuni (§33), the Matenadaran (§35) and Lake Sevan
 * (§37) before it, it shipped ahead of its artwork in §39; §40 registered
 * `garni-temple.webp`, so every place in the section has a cover again and
 * `PENDING_ARTWORK` is empty.
 */
const GARNI = "garni-temple";

/**
 * The seventh place, and the third under the `monastery` filter.
 *
 * It split `PLACES` from `ILLUSTRATED` for the sixth time in §41, and §42 closed
 * that split again by registering `geghard-monastery.webp`. Like Etchmiadzin (§31),
 * Erebuni (§33), the Matenadaran (§35), Lake Sevan (§37) and Garni (§39) before it,
 * it shipped ahead of its artwork and rendered the generated placeholder; every
 * placeholder assertion §41 wrote for it is inverted below.
 *
 * It is also the first place whose `relatedSlugs` points at another place: Garni
 * sits eight kilometres down the same valley, which is why the two are linked
 * editorially and why neither may borrow the other's picture — a guard that
 * survives the registration rather than being retired by it.
 */
const GEGHARD = "geghard-monastery";

/** All seven places, for the assertions that must hold of every article in the section. */
const PLACES = [SLUG, ETCHMIADZIN, EREBUNI, MATENADARAN, SEVAN, GARNI, GEGHARD] as const;

/**
 * The places whose artwork has actually landed — all seven, as of §42.
 *
 * Kept as its own list rather than folded into `PLACES` because the section has
 * been in the split state six times now (§31, §33, §35, §37, §39, §41) and left it
 * six times (§32, §34, §36, §38, §40, §42), and on every one of those occasions the
 * change was to move one slug between these two lines. Artwork assertions run over
 * this one: claiming provenance for a slug that has no file would be asserting a
 * fiction, and the place written ahead of its picture needs this list to already
 * exist rather than to be reconstructed under pressure.
 *
 * The two lists coincide again. That is not a reason to collapse them — the last
 * five times they coincided (§32, §34, §36, §38, §40) the next place split them
 * again within one step, and §41 was the most recent proof: the placeholder
 * assertions below read this list to decide what may render an `<svg>`, and that
 * distinction would have had to be rebuilt from scratch had the list been deleted
 * while it looked redundant.
 */
const ILLUSTRATED = [SLUG, ETCHMIADZIN, EREBUNI, MATENADARAN, SEVAN, GARNI, GEGHARD] as const;

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
 * PNG copied from the homepage hero (§30), while the other six are WebPs
 * (§32, §34, §36, §38, §40, §42). Their dimensions are not uniform either —
 * `garni-temple.webp` is 1448×1086 against the 1586×992 of the four before it and
 * of `geghard-monastery.webp` after it, which changes what the shared centre crops
 * trim but not what this map holds.
 */
const ARTWORK = {
  [SLUG]: "/images/places/khor-virap.png",
  [ETCHMIADZIN]: "/images/places/etchmiadzin-cathedral.webp",
  [EREBUNI]: "/images/places/erebuni-fortress.webp",
  [MATENADARAN]: "/images/places/matenadaran.webp",
  [SEVAN]: "/images/places/lake-sevan.webp",
  [GARNI]: "/images/places/garni-temple.webp",
  [GEGHARD]: "/images/places/geghard-monastery.webp",
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
    await expect(cards(page)).toHaveCount(7);

    // All seven places open in this edition, under their own titles. The loop is
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
    "Garni Temple",
    "Geghard Monastery",
  ]) {
    await expect(page.getByText(english, { exact: true })).toHaveCount(0);
  }
  for (const slug of PLACES) {
    await expect(page.getByRole("link", { name: articleTitle("hy", slug) }).first()).toBeVisible();
  }
});

test("the places listing filters by kind of site, and keeps it in the URL", async ({ page }) => {
  await page.goto("/en/places");
  await expect(cards(page)).toHaveCount(7);

  await page.getByRole("button", { name: placeTypeLabel("en", "monastery") }).click();

  // Three of the seven places are monasteries and churches, so the filter genuinely
  // narrows. With seven articles and five pills, a filter that quietly matched
  // everything would no longer look like a plausible count. The count held at two
  // across §39, because Garni is `historical` and a temple is not a monastery; §41
  // is the first time it has moved, and Geghard is the article that moved it.
  await expect(cards(page)).toHaveCount(3);
  for (const slug of [SLUG, ETCHMIADZIN, GEGHARD]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
    ).toBeVisible();
  }
  for (const slug of [EREBUNI, MATENADARAN, SEVAN, GARNI]) {
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
    The two remaining narrow types, and the failure worth catching: a filter id
    added to the vocabulary but attached to no article — or attached to the wrong
    one — is a pill that returns the empty state or somebody else's article.
    `validate:content` fails on the first of those; only a rendered listing
    catches the second, and with two one-article filters side by side they could
    also be crossed over without a single count changing.

    `historical` left this loop in §39. It was a one-article pill from §33 to §38;
    Garni is the second article under it, and it is asserted as a pair in the test
    below rather than being quietly dropped from coverage.
  */
  for (const [type, slug] of [
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

    // Clearing returns all seven, so the pill filters rather than replaces the set.
    await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
    await expect(cards(page), type).toHaveCount(7);
  }
});

test("the historical filter returns exactly Erebuni and Garni", async ({ page }) => {
  /*
    The first place type to hold more than one article, and a genuinely different
    assertion from the loop above rather than a copy of it.

    While `historical` was a one-article pill, "the filter works" and "the filter
    shows Erebuni" were the same statement. They are not any more: a filter that
    silently matched everything, one that dropped the older article when the newer
    one arrived, and one that returned only the newest would all still render a
    plausible listing. Pinning the pair — both present, everything else absent, and
    the count exactly two — separates those cases.
  */
  await page.goto("/en/places");
  await page.getByRole("button", { name: placeTypeLabel("en", "historical") }).click();

  await expect(cards(page)).toHaveCount(2);
  for (const slug of [EREBUNI, GARNI]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
      slug,
    ).toBeVisible();
  }
  for (const other of PLACES.filter((entry) => entry !== EREBUNI && entry !== GARNI)) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", other) }),
      `historical must not show ${other}`,
    ).toHaveCount(0);
  }
  await expect(page).toHaveURL(/[?&]type=historical/);

  await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
  await expect(cards(page)).toHaveCount(7);
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

  // Each type matches exactly the articles that earned it. The vocabulary is
  // unchanged in §41 — five ids, exactly as before — and the only movement is that
  // `monastery` now holds three slugs instead of two. Asserting the whole sorted
  // array rather than membership is what makes a seventh place filed under the wrong
  // pill fail here rather than merely look odd on the listing.
  const under = (type: string) =>
    bundle("hy")
      .articles.filter((entry) => entry.category === "places" && entry.placeTypeId === type)
      .map((entry) => entry.slug)
      .sort();

  expect(under("historical")).toEqual([EREBUNI, GARNI].sort());
  expect(under("museum")).toEqual([MATENADARAN]);
  expect(under("nature")).toEqual([SEVAN]);
  expect(under("monastery")).toEqual([ETCHMIADZIN, GEGHARD, SLUG].sort());

  // And no new place type was invented for a rock-cut monastery. The count of ids
  // is pinned above; this pins the shape of the section against it — seven places
  // over five pills, with one pill holding three and one holding two.
  const byType = new Map<string, number>();
  for (const entry of bundle("hy").articles.filter((a) => a.category === "places")) {
    byType.set(entry.placeTypeId!, (byType.get(entry.placeTypeId!) ?? 0) + 1);
  }
  expect(Object.fromEntries([...byType].sort())).toEqual({
    historical: 2,
    monastery: 3,
    museum: 1,
    nature: 1,
  });

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

test("the sixth place is findable under the places group too", async ({ page }) => {
  /*
    Scoped by href like the three above. "Garni" has a rival of its own: the gata
    article names the villages around Geghard and Garni among the places the large
    decorated discs are sold, and a cuisine hit can legitimately rank above a
    place. The group heading is what matters — a sixth place must appear under
    Places, not merely somewhere on the results page.

    (The rival was named as the ghapama article here and in two comments below
    until §41. It is `gata` — `en/articles/cuisine.ts:630`. Corrected while adding
    the Geghard test, because that test depends on the same collision from the
    other side and a comment pointing at the wrong article is worse than none.)
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Garni");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${GARNI}"]`).first()).toBeVisible();
});

test("the seventh place is findable under the places group too", async ({ page }) => {
  /*
    Scoped by href like the five above, and this query has the most crowded field
    of any of them. "Geghard" already appears in three other articles' prose before
    this one existed: the gata article names the villages around Geghard and Garni,
    and the Garni article names the monastery twice — once for the valley and once
    for the World Heritage distinction. A cuisine or a neighbouring-place hit may
    legitimately rank above it.

    So the assertion is not "Geghard is the first result". It is that a card linking
    to this article's own Places route appears, and that the Places group heading is
    on the page — which is what `category: "places"` is supposed to guarantee and
    what would silently not happen if the article were filed anywhere else.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Geghard");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${GEGHARD}"]`).first()).toBeVisible();
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
  All seven places ship a cover, and each registration is a single `IMAGES` entry
  that has to light up six surfaces — hero, featured block, card, search
  thumbnail, social tags, sitemap — every one reached through `getImageSrc`, and
  every one silent if the registration is wrong.

  The caption is the assertion that matters most. `isGeneratedArtwork` flips to
  true the moment a slug enters the registry, and that is what makes the page
  state "AI-generated" rather than "placeholder". A registration that rendered
  the picture without the disclosure would look completely correct.

  These run over `ILLUSTRATED`, which is currently all seven places. The placeholder
  branch therefore has no subject again and is asserted as an absence — the seventh
  time this file has switched between the two states, and the reason `ILLUSTRATED`
  survives as a separate list rather than collapsing into `PLACES`.
*/

test("each article hero renders its own registered artwork and names the AI provenance", async ({
  page,
}) => {
  /*
    Declared slow rather than trimmed. This test and the one below it are the two
    that navigate `LOCALES × ILLUSTRATED`, so §42 took each from eighteen page loads
    to twenty-one — against a dev server that compiles routes on demand, with the
    rest of the suite competing for it. Both cleared the 30s global timeout when the
    places file ran alone and exceeded it in the full run, which is a cost of the
    loop's size and not a flake: the honest fix is to say the test is slow, not to
    shrink its coverage or re-run it until it passes.
  */
  test.slow();

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
  // Slow for the same reason as the test above: twenty-one navigations as of §42.
  test.slow();

  /*
    The other half of the caption logic, asserted as an absence — and covering all
    seven places again now that `ILLUSTRATED` and `PLACES` coincide.

    It stays scoped to `ILLUSTRATED` rather than being repointed at `PLACES`: the
    two lists have coincided five times before and split again every time, and this
    assertion is only ever true of slugs that have a file. None of them may fall
    back to the generated `<svg>`, and none may still be captioned as a picture
    that was never made.

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

test("Lake Sevan renders its own file and is captioned as an illustration", async ({
  page,
}) => {
  /*
    Lake Sevan's registration, asserted on its own rather than only inside the
    `ILLUSTRATED` loop, because it is the transition §38 performed and the failure
    modes either side of it are specific.

    Between §37 and §38 this test asserted the opposite: the inline generated
    `<svg>`, no raster file, and the placeholder caption. Every one of those has to
    invert, in all three editions — a registration that reached the picture but not
    the caption would leave the page apologising for a missing image that is
    sitting right there above the apology.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${SEVAN}`);

    await expect(page.locator("header figure img"), `${locale} ${SEVAN}`).toHaveCount(1);
    await expect(page.locator("header figure img"), `${locale} ${SEVAN}`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[SEVAN]),
    );
    await expect(page.locator("header figure svg[role='img']"), `${locale} ${SEVAN}`).toHaveCount(
      0,
    );

    // A lake is a scene, not a likeness, so it takes the illustration wording —
    // and must no longer take the placeholder wording it carried in §37.
    await expect(page.locator("header figcaption"), `${locale} ${SEVAN}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, SEVAN)),
    );
    await expect(page.locator("header figcaption"), `${locale} ${SEVAN}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, SEVAN)),
    );
  }
});

test("Lake Sevan borrows no other article's artwork anywhere on its page", async ({
  page,
}) => {
  /*
    Kept across the registration for the same reason the Matenadaran test was: the
    failure it guards against survives the file landing. The named files are the
    three that were actually considered and rejected when the article was written,
    plus the Matenadaran, which is the nearest neighbour in the registry — Ani has
    no lake in it, the Urartu illustration is Lake Van country, and `hero-ararat`
    is a mountain over a plain. Any of them appearing here now would mean the
    registration had been repointed at a near miss, which is exactly the substitution
    §37 refused to make.

    Scoped to the surfaces that speak for *this* article — the head and the hero —
    rather than the whole document: a related-article card lower down legitimately
    carries a sibling's cover.
  */
  await page.goto(`/en/places/${SEVAN}`);

  const metaValues = await page.locator("head meta[content]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("content") ?? ""),
  );
  const ld = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  /*
    The figure's own markup, not `img[src]`.

    This hero renders an `<img>` now, so reading its `src` would work — but the
    subtree covers both branches, cannot deadlock if the slug ever goes back to the
    placeholder, and still catches a borrowed file appearing anywhere inside the
    figure rather than only in the one attribute.
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
    `Article.image` is a claim that a picture depicts this article, which is why
    `articleLd` omitted the property entirely while the slug had no file rather
    than nominating the generic site card — an `og:image` is a link-preview card
    and the default belongs there, but the two are not the same claim. Now that a
    real cover exists, the property is present and is that cover.
  */
  const own = `https://armat.site${ARTWORK[SEVAN]}`;
  const graph = (JSON.parse(ld) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  expect(article?.image, "the registered artwork should now be declared").toEqual({
    "@type": "ImageObject",
    url: own,
  });
});

test("the newest place renders its own file and is captioned as an illustration", async ({
  page,
}) => {
  /*
    Garni's registration, asserted on its own rather than only inside the
    `ILLUSTRATED` loop, because it is the transition §40 performed and the failure
    modes either side of it are specific.

    Between §39 and §40 this test asserted the opposite: the inline generated
    `<svg>`, no raster file, and the placeholder caption. Every one of those has to
    invert, in all three editions — a registration that reached the picture but not
    the caption would leave the page apologising for a missing image that is
    sitting right there above the apology.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${GARNI}`);

    await expect(page.locator("header figure img"), `${locale} ${GARNI}`).toHaveCount(1);
    await expect(page.locator("header figure img"), `${locale} ${GARNI}`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[GARNI]),
    );
    await expect(page.locator("header figure svg[role='img']"), `${locale} ${GARNI}`).toHaveCount(
      0,
    );

    // A temple is a scene, not a likeness, so it takes the illustration wording —
    // and must no longer take the placeholder wording it carried in §39.
    await expect(page.locator("header figcaption"), `${locale} ${GARNI}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, GARNI)),
    );
    await expect(page.locator("header figcaption"), `${locale} ${GARNI}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, GARNI)),
    );
  }
});

test("the newest place borrows no other article's artwork anywhere on its page", async ({
  page,
}) => {
  /*
    Kept across the registration for the same reason the Matenadaran and Lake Sevan
    tests were: the failure it guards against survives the file landing. The named
    files are the ones actually considered and rejected when the article was
    written — `adoption-of-christianity` is a baptism before a medieval domed
    church, `tigran-the-great` has classical pilasters behind a royal portrait, and
    `erebuni-fortress` is the other `historical` place, the one whose cover it
    would be easiest to lend. Any of them appearing here now would mean the
    registration had been repointed at a near miss, which is exactly the
    substitution §39 refused to make.

    Scoped to the surfaces that speak for *this* article — the head and the hero —
    rather than the whole document: a related-article card lower down legitimately
    carries a sibling's cover, and Erebuni is in this article's `relatedSlugs`.
  */
  await page.goto(`/en/places/${GARNI}`);

  const metaValues = await page.locator("head meta[content]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("content") ?? ""),
  );
  const ld = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  /*
    The figure's own markup, not `img[src]`.

    This hero renders an `<img>` now, so reading its `src` would work — but the
    subtree covers both branches, cannot deadlock if the slug ever goes back to the
    placeholder (§37 learned that the expensive way), and still catches a borrowed
    file appearing anywhere inside the figure rather than only in the one attribute.
  */
  const hero = await page.locator("header figure").innerHTML();

  for (const borrowed of [
    "erebuni-fortress",
    "adoption-of-christianity",
    "tigran-the-great",
    "kingdom-of-urartu",
    "hero-ararat",
  ]) {
    for (const [surface, haystack] of [
      ["meta", metaValues.join(" ")],
      ["structured data", ld],
      ["hero", hero],
    ] as const) {
      expect(
        haystack.includes(borrowed),
        `${borrowed} must not appear in ${GARNI}'s ${surface}`,
      ).toBe(false);
    }
  }

  /*
    `Article.image` is a claim that a picture depicts this article, which is why
    `articleLd` omitted the property entirely while the slug had no file rather
    than nominating the generic site card — an `og:image` is a link-preview card
    and the default belongs there, but the two are not the same claim. Now that a
    real cover exists, the property is present and is that cover.
  */
  const own = `https://armat.site${ARTWORK[GARNI]}`;
  const graph = (JSON.parse(ld) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  expect(article?.image, "the registered artwork should now be declared").toEqual({
    "@type": "ImageObject",
    url: own,
  });

  // And the social tags carry the article's own file rather than the site default
  // they fell back to in §39.
  for (const meta of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(meta), `${GARNI} ${meta}`).toHaveAttribute("content", own);
    await expect(page.locator(meta), `${GARNI} ${meta}`).not.toHaveAttribute(
      "content",
      /og-default/,
    );
  }
});

test("the Matenadaran's metadata borrows no other article's artwork", async ({ page }) => {
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

  // Drawn from `ILLUSTRATED` rather than `PLACES` on principle: only a file that
  // exists can be borrowed. The two lists coincide again as of §42, and this stays
  // pointed at `ILLUSTRATED` so it keeps meaning the same thing the next time a
  // place ships ahead of its picture.
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

test("the listing renders each registered place's own artwork, and no placeholder", async ({
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
  // the other six are cards. The failure this catches is the one-line
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
  // The named files are the ones actually considered and rejected as stand-ins:
  // the Urartu illustration and the Mashtots portrait for the Matenadaran (§35),
  // Ani, Urartu and the homepage hero for Lake Sevan (§37), the conversion scene
  // and the Tigran portrait for Garni (§39), and for Geghard (§41) the conversion
  // scene again, Ani's river gorge, and — the sharpest of them — Garni itself,
  // eight kilometres down the same valley and linked from Geghard's own prose. A
  // listing that looks uniform because one card borrowed a plausible image is the
  // failure, and the borrowed file being a *neighbouring place* is the version of
  // it that would look most convincing.
  for (const borrowed of [
    "kingdom-of-urartu",
    "mesrop-mashtots",
    "bagratid-armenia",
    "hero-ararat",
    "adoption-of-christianity",
    "tigran-the-great",
  ]) {
    expect(
      sources.some((src) => src.includes(borrowed)),
      `${borrowed} must not stand in for a place`,
    ).toBe(false);
  }

  /*
    Zero placeholders, which is what §42 inverted again.

    This assertion has now inverted six times (§37 one, §38 zero, §39 one, §40
    zero, §41 one, §42 zero), which is the whole argument for pinning the count
    rather than asserting "at least one" or "none by inspection". Zero is the
    strong reading of "every place has its own cover": one would be a place that
    had quietly lost its registration, and neither state shows on the rendered
    page — a placeholder card looks perfectly finished — so the count is the only
    thing that says so.
  */
  await expect(page.locator("main svg[role='img']")).toHaveCount(0);
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
    [SEVAN, "Sevan"],
    [GARNI, "Garni"],
    [GEGHARD, "Geghard"],
  ] as const) {
    await page.goto(`/en/search?q=${query}`);

    // Scoped to this place's own result card, not `.first()`. Every query here
    // has a rival in History: "Etchmiadzin" matches the article on the conversion,
    // "Erebuni" the one on Urartu, "Matenadaran" the one on the alphabet, which
    // names the institute in its legacy section, "Sevan" both the Urartu article,
    // whose prose names the lake, and the writer Paruyr Sevak, "Garni" the
    // gata article, which names the villages around Geghard and Garni, and
    // "Geghard" that same gata article. Any of
    // them may legitimately rank above the place — taking the first thumbnail on
    // the page would assert against that article's artwork instead, and would have
    // passed before these registrations existed.
    const card = page
      .getByRole("main")
      .getByRole("listitem")
      .filter({ has: page.locator(`a[href="/en/places/${slug}"]`) });

    await expect(card, slug).toHaveCount(1);
    await expect(card.locator("img"), slug).toHaveAttribute("src", fileIn(ARTWORK[slug]));
  }
});

test("Lake Sevan's search card carries its own thumbnail and no placeholder", async ({
  page,
}) => {
  /*
    The inverse of what this test asserted in §37, where the card had to render the
    generated `<svg>` and no `<img>` at all.

    Deliberately not folded into the loop above even though it is now the same
    shape: the loop proves the thumbnail is the *right* file, and this proves the
    placeholder is gone from the card as well as from the hero. Registration
    reaches those two through different components — `SearchResultCard` calls
    `getImageSrc` directly while the hero goes through `getArticleImageSrc` — so
    one can be right while the other is not.

    "Sevan" is a query with rivals (the Urartu article names the lake, and Paruyr
    Sevak's name matches too), so the card is located by its own href rather than
    taken as the first result.
  */
  await page.goto("/en/search?q=Sevan");

  const card = page
    .getByRole("main")
    .getByRole("listitem")
    .filter({ has: page.locator(`a[href="/en/places/${SEVAN}"]`) });

  await expect(card, SEVAN).toHaveCount(1);
  await expect(card.locator("svg[role='img']"), SEVAN).toHaveCount(0);
  await expect(card.locator("img"), SEVAN).toHaveCount(1);
  await expect(card.locator("img"), SEVAN).toHaveAttribute("src", fileIn(ARTWORK[SEVAN]));
});

test("the newest place's search card carries its own thumbnail and no placeholder", async ({
  page,
}) => {
  /*
    The inverse of what this test asserted in §39, where the card had to render the
    generated `<svg>` and no `<img>` at all.

    Deliberately not folded into the loop above even though it is now the same
    shape: the loop proves the thumbnail is the *right* file, and this proves the
    placeholder is gone from the card as well as from the hero. Registration reaches
    those two through different components — `SearchResultCard` calls `getImageSrc`
    directly while the hero goes through `getArticleImageSrc` — so one can be right
    while the other is not.

    "Garni" is a query with a rival — the gata article names the villages around
    Geghard and Garni — so the card is located by its own href rather than taken as
    the first result.
  */
  await page.goto("/en/search?q=Garni");

  const card = page
    .getByRole("main")
    .getByRole("listitem")
    .filter({ has: page.locator(`a[href="/en/places/${GARNI}"]`) });

  await expect(card, GARNI).toHaveCount(1);
  await expect(card.locator("svg[role='img']"), GARNI).toHaveCount(0);
  await expect(card.locator("img"), GARNI).toHaveCount(1);
  await expect(card.locator("img"), GARNI).toHaveAttribute("src", fileIn(ARTWORK[GARNI]));
});

test("Geghard renders its own file and is captioned as an illustration", async ({ page }) => {
  /*
    Geghard's registration, asserted on its own rather than only inside the
    `ILLUSTRATED` loop, because it is the transition §42 performed and the failure
    modes either side of it are specific.

    Between §41 and §42 this test asserted the exact opposite: the inline generated
    `<svg>`, no raster file, and the placeholder wording. Every one of those has to
    invert, and each fails differently. The hero must render the `<img>` and no
    `<svg>`, or the registration never reached the page. The caption must be the
    AI-illustration wording and not the placeholder wording, or the page is
    apologising for a missing image that is sitting right there above the apology —
    `isGeneratedArtwork` is what flips that branch, and it flips on registry
    membership alone. And it must hold in all three editions, because the caption is
    read from each locale's own dictionary.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${GEGHARD}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), locale).toHaveCount(0);
    await expect(figure.locator("img"), locale).toHaveCount(1);
    await expect(figure.locator("img"), locale).toHaveAttribute("src", fileIn(ARTWORK[GEGHARD]));

    // A monastery in a gorge is a scene, not a likeness, so it takes the
    // illustration wording — and must no longer take the placeholder wording it
    // carried in §41.
    await expect(figure.locator("figcaption"), locale).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, GEGHARD)),
    );
    await expect(figure.locator("figcaption"), locale).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, GEGHARD)),
    );
  }
});

test("Geghard borrows no other article's artwork, and declares the one it has", async ({
  page,
}) => {
  /*
    The same guard the Matenadaran, Lake Sevan and Garni tests carry, with a sharper
    list of candidates than any of them had — and kept across the §42 registration
    for the same reason theirs were: a cover can be repointed at a plausible
    neighbour long after the right file has landed, and nothing on the rendered page
    would show it.

    `garni-temple` is the dangerous one and it is dangerous precisely because the
    relationship is real: it is eight kilometres down the same valley, this article
    links to it in prose, and it sits directly above Geghard in `geo.ts`. A
    registration repointed at it would look like a considered decision rather than a
    mistake. `khor-virap` and `etchmiadzin-cathedral` are the other two entries
    under the `monastery` pill — a listing where all three monasteries share a mood
    is the failure. `adoption-of-christianity` is a domed church in a valley, which
    is the generic-monastery trap, and `bagratid-armenia` is a river gorge, which is
    the Lake Sevan mood trap in another landscape.

    Scoped to the surfaces that speak for *this* article — the head and the hero —
    because the related-articles block below legitimately carries Garni's and
    Etchmiadzin's covers. That is the point of the scoping, not a loophole in it:
    those two are this article's own `relatedSlugs`, so their files must appear
    further down the page and must not appear in the head or the figure.
  */
  await page.goto(`/en/places/${GEGHARD}`);

  const metaValues = await page.locator("head meta[content]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("content") ?? ""),
  );
  const ld = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  const hero = await page.locator("header figure").innerHTML();

  for (const borrowed of [
    "garni-temple",
    "khor-virap",
    "etchmiadzin-cathedral",
    "adoption-of-christianity",
    "bagratid-armenia",
    "hero-ararat",
  ]) {
    for (const [surface, haystack] of [
      ["meta", metaValues.join(" ")],
      ["structured data", ld],
      ["hero", hero],
    ] as const) {
      expect(
        haystack.includes(borrowed),
        `${borrowed} must not appear in ${GEGHARD}'s ${surface}`,
      ).toBe(false);
    }
  }

  /*
    Both fallbacks are gone, and they were two different claims before they went.

    In §41 `og:image` fell back to the generic `/og-default.png` — a link-preview
    card, where a branded default is better than a bare link — while `Article.image`
    was omitted entirely, because that property asserts a picture *depicts* this
    article and no such picture existed. §42 supplies one, so all three now name the
    same file. Asserting the site card's absence alongside them is what catches a
    registration that reached the page but not the head.
  */
  const own = `https://armat.site${ARTWORK[GEGHARD]}`;
  const og = await page.locator('head meta[property="og:image"]').getAttribute("content");
  const twitter = await page.locator('head meta[name="twitter:image"]').getAttribute("content");
  expect(og, "og:image should now be Geghard's own artwork").toBe(own);
  expect(twitter, "twitter:image should now be Geghard's own artwork").toBe(own);
  for (const value of [og, twitter]) {
    expect(value, "the site card must no longer stand in").not.toContain("og-default");
  }

  const graph = (JSON.parse(ld) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  expect(article?.image, "the registered artwork should now be declared").toEqual({
    "@type": "ImageObject",
    url: own,
  });
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

test("Geghard's search card carries its own thumbnail and no placeholder", async ({ page }) => {
  /*
    The inverse of what this test asserted in §41, where the card had to render the
    generated `<svg>` and no `<img>` at all.

    The card half of the same invariant, and not folded into the hero test above
    because registration reaches the two through different components:
    `SearchResultCard` calls `getImageSrc` directly while the hero goes through
    `getArticleImageSrc`. One can be right while the other is not, which is the
    whole reason this pair of tests has been written six times.

    Located by its own href rather than taken as the first result, because
    "Geghard" is a query with rivals in other categories — the gata article names
    the villages around Geghard and Garni — so the assertions below are scoped to
    the one card whose link is the Geghard Places route.
  */
  await page.goto("/en/search?q=Geghard");

  const card = page
    .getByRole("main")
    .getByRole("listitem")
    .filter({ has: page.locator(`a[href="/en/places/${GEGHARD}"]`) });

  await expect(card, GEGHARD).toHaveCount(1);
  await expect(card.locator("svg[role='img']"), GEGHARD).toHaveCount(0);
  await expect(card.locator("img"), GEGHARD).toHaveCount(1);
  await expect(card.locator("img"), GEGHARD).toHaveAttribute("src", fileIn(ARTWORK[GEGHARD]));

  // And not a neighbour's picture in the one card that speaks for Geghard. The
  // three named here are the substitutions §41 refused: Garni is eight kilometres
  // down the same valley and linked from this article's own prose, and Khor Virap
  // and Etchmiadzin are the other two entries under the `monastery` pill.
  for (const borrowed of ["garni-temple", "khor-virap", "etchmiadzin-cathedral"]) {
    await expect(card.locator(`img[src*="${borrowed}"]`), borrowed).toHaveCount(0);
  }
});

test("the sitemap carries every place's illustration for image search", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const slug of ILLUSTRATED) {
    // One image entry per locale route, so three per place.
    const url = `https://armat.site${ARTWORK[slug]}`;
    expect(xml.split(url).length - 1, `${slug} image entries`).toBe(LOCALES.length);
  }

  /*
    And each locale route carries its *own* file, checked block by block rather
    than only by whole-document count.

    The three slugs that have left `PENDING_ARTWORK` most recently are pinned this
    way. The count above would still pass if all three of a slug's `image:loc`
    entries landed on one route and none on the others, and Geghard is the case that
    matters now: §41 asserted its three url blocks contained no `image:loc` at all,
    so this is the exact inversion, and an image crawler handed a 404 or another
    article's picture is a failure nothing on the rendered page would show.
  */
  for (const slug of [SEVAN, GARNI, GEGHARD] as const) {
    const blocks = xml.split("<url>").filter((block) => block.includes(`/places/${slug}<`));
    expect(blocks, `${slug} url blocks`).toHaveLength(LOCALES.length);
    for (const block of blocks) {
      expect(block, `${slug} sitemap image`).toContain(`https://armat.site${ARTWORK[slug]}`);
    }
  }

  /*
    And Geghard's three routes carry that file and no other article's.

    `sitemap.ts` adds the image key only when `getArticleImageSrc` returns
    something, so §41 asserted the absence to prove the condition was real rather
    than incidental; §42 asserts the presence for the same reason. The failure it
    catches now is an image crawler being handed — far likelier than a 404 — a
    neighbouring monastery's picture indexed under Geghard's URL, which nothing on
    the rendered page would reveal.
  */
  const geghardBlocks = xml.split("<url>").filter((block) => block.includes(`/places/${GEGHARD}<`));
  expect(geghardBlocks, `${GEGHARD} url blocks`).toHaveLength(LOCALES.length);
  for (const block of geghardBlocks) {
    expect(block, `${GEGHARD} must emit an image:loc`).toContain("image:loc");
    for (const borrowed of [
      "garni-temple",
      "khor-virap",
      "etchmiadzin-cathedral",
      "adoption-of-christianity",
    ]) {
      expect(block, `${borrowed} must not be indexed under ${GEGHARD}`).not.toContain(borrowed);
    }
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
test("no place is waiting for artwork, and every one resolves to its own file", () => {
  /*
    Empty, and empty exactly — the state §42 restored for the sixth time.

    Asserting the whole array rather than `not.toContain(GEGHARD)` is deliberate: it
    fails on a stale entry left behind after a file lands, which is the half of the
    invariant no other test covers and the one §42 had to satisfy, and it equally
    fails on a slug quietly added here to silence the placeholder assertions above.

    `toEqual` on the array rather than a length check, so the failure message names
    whatever is actually in there.
  */
  expect(PENDING_ARTWORK).toEqual([]);
  expect(getImageSrc(GEGHARD), "Geghard's artwork must now resolve").toBe(ARTWORK[GEGHARD]);

  for (const slug of ILLUSTRATED) {
    expect(getImageSrc(slug), `${slug} should resolve through the registry`).toBe(ARTWORK[slug]);
    expect(PENDING_ARTWORK, `${slug} is registered and must not also be pending`).not.toContain(
      slug,
    );
  }
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

  // Etchmiadzin keeps its WebP, and Erebuni, the Matenadaran, Lake Sevan, Garni and
  // Geghard each get their own rather than borrowing one. All seven are pinned by
  // name rather than only by shape: the tempting shortcut in §33, again in §35,
  // again in §37, again in §39 and again in §41 was to point the article with no
  // picture at a file that already existed, and this is the assertion that would
  // have caught it.
  expect(registry["etchmiadzin-cathedral"]).toBe("/images/places/etchmiadzin-cathedral.webp");
  expect(registry[EREBUNI]).toBe("/images/places/erebuni-fortress.webp");
  expect(registry[MATENADARAN]).toBe("/images/places/matenadaran.webp");
  expect(registry[SEVAN]).toBe("/images/places/lake-sevan.webp");
  expect(registry[GARNI]).toBe("/images/places/garni-temple.webp");
  expect(registry[GEGHARD]).toBe("/images/places/geghard-monastery.webp");

  // Only the seven *illustrated* places live under /images/places/, so registering
  // a cover cannot have repointed an article from another category — and the
  // Urartu illustration is still filed under history, where it belongs, rather
  // than having been moved to stand in for a temple.
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
  for (const fragment of [
    "etchmiadzin",
    "erebuni",
    "matenadaran",
    "lake-sevan",
    "garni",
    "geghard",
  ]) {
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
test("Geghard points at Garni, the first place-to-place relationship in the section", () => {
  /*
    Until §41 every `relatedSlugs` in this section pointed out of it, into History.
    Geghard is the first place that names another place, and it does so for a reason
    that is on the ground rather than on an itinerary: the two sit in the same valley,
    eight kilometres apart, and this article's geography section links to that one.

    Asserted in all three editions because `relatedSlugs` is locale-invariant by
    construction — `validate:content` compares it across editions as a joined string —
    so an edition that quietly dropped a target would be a real divergence rather
    than a translation choice.

    The relationship is deliberately one-directional. Garni is not modified to point
    back, because reciprocal relationships are separate architectural work and this
    repository has no mechanism for them. Pinning the absence here is what keeps it a
    recorded decision rather than something a later reader repairs by reflex.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === GEGHARD);
    expect(article, `${locale} geghard`).toBeDefined();
    expect(article!.relatedSlugs, `${locale} relatedSlugs`).toContain(GARNI);

    // Every target resolves in this edition, which is what stops a plausible-looking
    // slug that was never written from shipping as a dead recommendation.
    const published = new Set(bundle(locale).articles.map((entry) => entry.slug));
    for (const target of article!.relatedSlugs) {
      expect(published.has(target), `${locale} relatedSlugs -> ${target}`).toBe(true);
      expect(target, `${locale} must not self-reference`).not.toBe(GEGHARD);
    }
  }

  // And the reverse link is absent on purpose, not by oversight.
  expect(
    bundle("hy").articles.find((entry) => entry.slug === GARNI)!.relatedSlugs,
    "Garni is deliberately not modified to point back at Geghard",
  ).not.toContain(GEGHARD);
});

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

  /*
    Geghard, not Garni — the pair that makes this test earn its keep.

    They are eight kilometres apart in the same valley, this article links to that
    one, and a coordinate copied from the neighbour would put a pin on a real
    Armenian monument in the right gorge. Nothing else in this file would notice.
    The other near-misses are closer still and are excluded in `geo.ts`: the
    village of Goght, the car park and souvenir row outside the gate, and the
    upper Azat valley taken as a whole.
  */
  const geghard = registry[GEGHARD];
  const garni = registry[GARNI];
  expect(
    Math.hypot(geghard.lat - garni.lat, geghard.lon - garni.lon),
    "the point should be Geghard, not Garni eight kilometres down the valley",
  ).toBeGreaterThan(0.03);

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

  /*
    The temple footprint above the Azat gorge, from OSM way 108255791.

    Garni's plausible wrong answers are unusually close, which is what makes this
    worth pinning by distance rather than by value alone: the village centre is
    about 660 m north-east, the gorge and the basalt columns known as the Symphony
    of Stones are roughly a kilometre east, the nearest hotel is under 300 m away,
    and Geghard — the neighbour that actually carries the World Heritage
    inscription — is eight kilometres up the valley. A degree of latitude here is
    about 111 km, so the thresholds below are metres expressed in degrees.
  */
  const temple = registry[GARNI];
  expect(temple.lat).toBeCloseTo(40.1123, 4);
  expect(temple.lon).toBeCloseTo(44.7302, 4);
  // Not the village centre (about 40.1175, 44.7341): roughly 660 m away, which is
  // far too small a gap to catch by eye and easily large enough to assert.
  expect(
    Math.hypot(temple.lat - 40.1175, temple.lon - 44.7341),
    "the point should be the temple, not Garni village centre",
  ).toBeGreaterThan(0.004);
  // Not Geghard (about 40.1404, 44.8184), the monastery eight kilometres upstream.
  expect(
    Math.abs(temple.lon - 44.8184),
    "the point should be the temple, not Geghard",
  ).toBeGreaterThan(0.05);
  // Not the Symphony of Stones viewpoint (about 40.1143, 44.7401) in the gorge.
  expect(
    Math.abs(temple.lon - 44.7401),
    "the point should be the temple, not the basalt columns in the gorge",
  ).toBeGreaterThan(0.005);
});

/* -------------------------------------------------------------------------- */
/*  Existing categories are unaffected                                         */
/* -------------------------------------------------------------------------- */

test("every place's editorial fields are pinned, and Geghard's are unchanged by its artwork", () => {
  /*
    The seventh article was a pure addition, and registering its picture in §42 was
    a pure registry change. This is the assertion that says both.

    Everything else in this file is about Geghard's artwork or about the section as
    a whole: the filter counts moved in §41, `PENDING_ARTWORK` filled and emptied,
    the artwork assertions inverted twice. None of them would notice an article
    losing a `relatedSlug`, changing its `placeTypeId`, gaining a section, or
    picking up the `featured` flag in the same edit — and §42 is exactly the kind of
    change where that would go unremarked, since a one-line registry entry is
    supposed to touch no prose at all. Geghard is inside the loop as of §42 for that
    reason: its `placeTypeId`, `featured` flag and `relatedSlugs` are now pinned as
    literals too, so an artwork step that edited its editorial fields would fail here.

    Identity and navigation fields are pinned as literals, because those are shared
    across editions and are what a mistake here would move. Section shape is pinned
    as *cross-edition agreement* rather than as literal counts: an editor who
    revises one of these seven articles should not have to come back and retype a
    number in a test, but they must never revise one edition and forget the others.
  */
  const EXPECTED = {
    [SLUG]: { type: "monastery", featured: true, related: ["adoption-of-christianity", "tigran-the-great"] },
    [ETCHMIADZIN]: {
      type: "monastery",
      featured: false,
      related: ["adoption-of-christianity", "khor-virap", "battle-of-avarayr"],
    },
    [EREBUNI]: { type: "historical", featured: false, related: ["kingdom-of-urartu"] },
    [MATENADARAN]: {
      type: "museum",
      featured: false,
      related: [
        "mesrop-mashtots-armenian-alphabet",
        "etchmiadzin-cathedral",
        "adoption-of-christianity",
      ],
    },
    [SEVAN]: { type: "nature", featured: false, related: ["kingdom-of-urartu", "bagratid-armenia"] },
    [GARNI]: {
      type: "historical",
      featured: false,
      related: ["adoption-of-christianity", "tigran-the-great", "erebuni-fortress"],
    },
    [GEGHARD]: {
      type: "monastery",
      featured: false,
      related: ["garni-temple", "adoption-of-christianity", "etchmiadzin-cathedral"],
    },
  } as const satisfies Record<(typeof ILLUSTRATED)[number], unknown>;

  for (const slug of ILLUSTRATED) {
    const expected = EXPECTED[slug];
    const shapes: string[] = [];

    for (const locale of LOCALES) {
      const article = bundle(locale).articles.find((entry) => entry.slug === slug);
      expect(article, `${locale} ${slug}`).toBeDefined();

      expect(article!.category, `${locale} ${slug} category`).toBe("places");
      expect(article!.href, `${locale} ${slug} href`).toBe(`/places/${slug}`);
      expect(article!.placeTypeId, `${locale} ${slug} placeTypeId`).toBe(expected.type);
      expect(Boolean(article!.featured), `${locale} ${slug} featured`).toBe(expected.featured);
      expect(article!.relatedSlugs, `${locale} ${slug} relatedSlugs`).toEqual(expected.related);

      // Geghard is the seventh place and points *out* at Garni; none of the other
      // six was given a reciprocal link, which is the one-directional architecture
      // this repository has deliberately not changed. Geghard is now inside this
      // loop too, where the same assertion reads as "no self-reference" — both
      // readings are things that must hold, and §42 changed neither.
      expect(article!.relatedSlugs, `${locale} ${slug} must not link to Geghard`).not.toContain(
        GEGHARD,
      );

      shapes.push(
        [
          article!.sections.map((section) => section.id).join(","),
          article!.sections.map((section) => section.paragraphs.length).join(","),
          article!.keyFacts.length,
          article!.importantDates.length,
          article!.interestingFacts.length,
          article!.relatedFigures.length,
        ].join(" | "),
      );
    }

    // Same article in three languages, so the same shape in three languages.
    expect(new Set(shapes).size, `${slug} shape differs between editions: ${shapes.join(" /// ")}`).toBe(
      1,
    );
  }
});

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
