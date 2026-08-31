import { expect, test } from "@playwright/test";
import { getPlaceCoordinateRegistry } from "@/data/geo";
import { getSourceRegistry } from "@/data/sources";
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

/**
 * The eighth place, the fourth monastery, and the first anywhere in this archive
 * south of Lake Sevan — §47.
 *
 * It splits `PLACES` from `ILLUSTRATED` for the seventh time. Like Etchmiadzin
 * (§31), Erebuni (§33), the Matenadaran (§35), Lake Sevan (§37), Garni (§39) and
 * Geghard (§41) before it, it ships ahead of its artwork and renders the generated
 * placeholder — so every placeholder assertion below names it, and every artwork
 * assertion excludes it.
 *
 * It is also the point that stretches the map. The seven markers before it sat
 * between Etchmiadzin and Lake Sevan; Tatev is most of a degree of latitude south
 * of all of them. The bounds are derived from the markers rather than hardcoded,
 * so nothing had to be retuned — which is exactly the thing worth asserting.
 */
const TATEV = "tatev-monastery";

/**
 * The ninth place, the second under the `nature` filter, and the northernmost
 * article anywhere in this archive — §49.
 *
 * It does to `nature` what Garni did to `historical` in §39: the pill stops being
 * a one-article filter, which changes the shape of the assertions below rather
 * than only their counts. `nature` leaves the single-article loop and is pinned as
 * a pair whose order must not matter.
 *
 * It split `PLACES` from `ILLUSTRATED` for the eighth time in §49, and §50 closed
 * that split: like Etchmiadzin (§31→§32), Erebuni (§33→§34), the Matenadaran
 * (§35→§36), Lake Sevan (§37→§38), Garni (§39→§40), Geghard (§41→§42) and Tatev
 * (§47→§48) before it, it shipped ahead of its artwork and rendered the generated
 * placeholder; every placeholder assertion §49 wrote for it is inverted below.
 *
 * It is also the other end of the stretch Tatev began. Tatev pulled the map most
 * of a degree south of everything else; Dilijan is a third of a degree north of
 * Etchmiadzin, which was the northernmost marker for eight steps. Nothing was
 * retuned for either, which is the thing worth asserting.
 */
const DILIJAN = "dilijan-national-park";

/**
 * The tenth place, the first `settlement` anywhere in this archive, and the only
 * Place whose subject is a whole inhabited city — §51.
 *
 * It is the article that finally spends the `settlement` id. That id existed twice
 * over before this step and was used by nothing: as a `precision` value in
 * `geo.ts`, and as the worked example in `places.ts` of a filter pill that must not
 * be written before the article that earns it. Both are now in use, and the test
 * that asserted no place was a settlement is inverted below rather than deleted.
 *
 * It split `PLACES` from `ILLUSTRATED` for the ninth time in §51, and §52 closed
 * that split: like Etchmiadzin (§31→§32), Erebuni (§33→§34), the Matenadaran
 * (§35→§36), Lake Sevan (§37→§38), Garni (§39→§40), Geghard (§41→§42), Tatev
 * (§47→§48) and Dilijan (§49→§50) before it, it shipped ahead of its artwork and
 * rendered the generated placeholder; every placeholder assertion §51 wrote for it
 * is inverted below.
 *
 * `gyumri.webp` is also the first *urban street* artwork in the registry, and the
 * first entry that is neither 1586×992 nor Garni's 1448×1086 — it is 1584×993, the
 * same aspect to within a rounding error and a third distinct size.
 *
 * It is also the marker that stretches the map west. Dilijan was the northernmost
 * point for one step; Gyumri is north of it *and* most of a degree west of every
 * other marker, so the bounds now span a genuinely different box. Nothing was
 * retuned for it, which is the property worth asserting.
 */
const GYUMRI = "gyumri";

/**
 * The eleventh place, the third under the `historical` filter, and the first
 * article anywhere in this archive set in Aragatsotn — §57.
 *
 * It does to `historical` what §41 did to `monastery` and §49 to `nature`: the pill
 * stops being a pair and becomes a trio, which changes the shape of the assertion
 * below rather than only its count. Erebuni, Garni and Amberd have nothing in
 * common except that none of them is a monastery, a museum, a landscape or a town
 * — which is exactly the breadth §33 chose that id for, and the reason no
 * `fortress`, `castle`, `military` or `archaeological` pill was invented for this
 * article.
 *
 * It split `PLACES` from `ILLUSTRATED` for the tenth time in §57, and §58 closed
 * the gap. Like Etchmiadzin (§31), Erebuni (§33), the Matenadaran (§35), Lake Sevan
 * (§37), Garni (§39), Geghard (§41), Tatev (§47), Dilijan (§49) and Gyumri (§51)
 * before it, it shipped ahead of its artwork and rendered the generated
 * placeholder; every placeholder assertion §57 wrote for it is inverted below, and
 * the borrowing assertions are kept rather than deleted, because a cover can be
 * repointed at a plausible neighbour long after the file lands.
 *
 * It is the first marker in ten steps that stretches the map in *no* direction.
 * Tatev pulled it south, Dilijan north, Gyumri north-west; Amberd sits inside the
 * box all three already made — north of Etchmiadzin, east of Gyumri, and nowhere
 * near an edge. That is worth asserting for the same reason the stretches were:
 * marker-derived bounds must be unchanged by a point that changes no extreme.
 */
const AMBERD = "amberd-fortress";

/**
 * The twelfth place, the **second** `settlement`, and the first article anywhere in
 * this archive set in Vayots Dzor — §59.
 *
 * It does to `settlement` what §39 did to `historical` and §49 to `nature`: turns a
 * one-article pill into a pair, which is the transition the filter loop above was
 * kept in place for. Gyumri and Jermuk have almost nothing in common beyond being
 * inhabited — a nineteenth-century imperial city of a hundred thousand on an open
 * plain, and a twentieth-century spa town of a few thousand on a highland plateau —
 * and that spread is the argument for the breadth of the id, and the reason no
 * `spa`, `resort`, `town` or `health-resort` pill was invented for this article.
 *
 * It split `PLACES` from `ILLUSTRATED` for the eleventh time in §59, exactly as §52
 * and §58 each predicted the next Place would, and §60 closed the gap again — the
 * eleventh time the two lists have rejoined. Between §59 and §60 it shipped ahead of
 * its artwork and rendered the generated placeholder; every placeholder assertion §59
 * wrote for it is inverted below.
 *
 * §60 registered a file that did **not** match the article — the Jermuk waterfall,
 * with no built fabric in it — by explicit decision and against the commission in
 * `media.ts`, which had refused a waterfall-only cover in advance. **§61 replaced it**
 * at the same path with an aerial view of the town itself: the settlement on both
 * rims of the Arpa gorge, mid-century public architecture in parkland, a colonnaded
 * mineral-water pavilion, and no waterfall as the subject. That debt is closed.
 *
 * The episode left one lesson in this file, and it is why the paragraph above is kept
 * rather than deleted. **The swap changed nothing any test could see.** `PLACES`,
 * `ILLUSTRATED` and `ARTWORK` were already correct, the path never moved, and the
 * whole suite passed identically before and after — a rejected cover and its
 * replacement are indistinguishable to assertions written about filenames. What these
 * tests can settle is ownership: that this article's own file reaches every surface
 * and that no neighbour's file ever does. Whether the picture is the *right* picture
 * is settled by looking at it, and the record of having looked lives in `media.ts` and
 * PROJECT_STATE.md, keyed by SHA-256.
 *
 * Like Amberd it stretches the map in no direction: Tatev is still the southernmost
 * and easternmost marker and Gyumri still the northernmost and westernmost, so the
 * marker-derived bounds are unchanged by it. Its nearest neighbour in the coordinate
 * registry is Lake Sevan, 67 km away, which is why it introduces no new overlap.
 */
const JERMUK = "jermuk";

/**
 * Haghpat Monastery — §64, Place #13, and the first article in the archive about
 * anywhere in Lori.
 *
 * It closes the one completely unrepresented province the §62 audit found. That
 * matters more than a marker count: Lori holds Haghpat and Sanahin, one of
 * Armenia's three World Heritage properties, and three articles in this section
 * already tell readers that Armenia has three while covering only two of them.
 *
 * It is the fifth `monastery`, which is the largest the pill has ever been and the
 * reason the artwork refusals in `media.ts` name all four of the others. It is
 * also the northernmost point in the coordinate registry — the first place since
 * §51 to move a derived map bound rather than sit inside the existing frame.
 *
 * It splits `PLACES` from `ILLUSTRATED` for the twelfth time. It ships ahead of its
 * artwork and renders the generated placeholder, so every placeholder assertion
 * below names it and every artwork assertion excludes it.
 *
 * The two failures this article is most exposed to are both about conflation, and
 * both are asserted below rather than trusted. Its World Heritage property contains
 * Sanahin as well, so any sentence claiming the site alone is inscribed is wrong —
 * except for the four years between 1996 and 2000, when it actually was. And its
 * foundation date is genuinely disputed between two UNESCO-family documents and the
 * specialist survey, so a single confident "founded in" would be a fabrication.
 */
const HAGHPAT = "haghpat-monastery";

/** All twelve places, for the assertions that must hold of every article in the section. */
const PLACES = [
  SLUG,
  ETCHMIADZIN,
  EREBUNI,
  MATENADARAN,
  SEVAN,
  GARNI,
  GEGHARD,
  TATEV,
  DILIJAN,
  GYUMRI,
  AMBERD,
  JERMUK,
  HAGHPAT,
] as const;

/**
 * The places whose artwork has actually landed — all twelve, as of §60.
 *
 * Kept as its own list rather than folded into `PLACES` because the section has
 * been in the split state eleven times now (§31, §33, §35, §37, §39, §41, §47, §49,
 * §51, §57, §59) and left it ten times (§32, §34, §36, §38, §40, §42, §48, §50, §52,
 * §58), and on every one of those occasions the change was to move one slug between
 * these two lines. Artwork assertions run over this one: claiming provenance for a
 * slug that has no file would be asserting a fiction, and the place written ahead
 * of its picture needs this list to already exist rather than to be reconstructed
 * under pressure.
 *
 * **The two lists coincide again, for the eleventh time.** They have now been apart
 * eleven times and rejoined eleven times, and on every previous occasion the
 * coincidence was ended by the place written after it — ten for ten before §59, which
 * ended §58's. That is the whole argument against collapsing the two declarations
 * into one: Place #13 will separate them again, and the split state needs this list
 * to already exist rather than to be reconstructed under pressure.
 *
 * The placeholder assertions below read this list to decide what may render an
 * `<svg>`; `PLACES` decides what must exist at all. Those are different questions
 * even when the answers match, and they match now — which is exactly when the
 * temptation to merge them appears, and exactly why they stay apart.
 */
const ILLUSTRATED = [
  SLUG,
  ETCHMIADZIN,
  EREBUNI,
  MATENADARAN,
  SEVAN,
  GARNI,
  GEGHARD,
  TATEV,
  DILIJAN,
  GYUMRI,
  AMBERD,
  JERMUK,
  HAGHPAT,
] as const;

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
 * PNG copied from the homepage hero (§30), while the other twelve are WebPs — and
 * the map is thirteen entries against thirteen places, for the twelfth time
 * (§32, §34, §36, §38, §40, §42, §48, §50, §52, §58, §60, §66). Their dimensions are
 * not uniform either — `garni-temple.webp` is 1448×1086 and `gyumri.webp` is
 * 1584×993 against the 1586×992 of the ten others, which changes what the shared
 * centre crops trim but not what this map holds. `haghpat-monastery.webp` is
 * 1586×992 and adds no new drift.
 *
 * §66 is the first time this map has covered every Place at once. That is precisely
 * when it becomes tempting to derive it from `getImageSrc` instead of writing it
 * out, and precisely when doing so would destroy its only purpose: a derived map
 * agrees with the registry by construction, including when the registry is wrong.
 *
 * The `satisfies` clause is the part that earns its keep: it is what makes the two
 * lists above disagree at compile time rather than at runtime. Add a slug to
 * `ILLUSTRATED` without a file here and `tsc` fails; that is the whole reason
 * `ILLUSTRATED` and `ARTWORK` are separate declarations rather than one.
 */
const ARTWORK = {
  [SLUG]: "/images/places/khor-virap.png",
  [ETCHMIADZIN]: "/images/places/etchmiadzin-cathedral.webp",
  [EREBUNI]: "/images/places/erebuni-fortress.webp",
  [MATENADARAN]: "/images/places/matenadaran.webp",
  [SEVAN]: "/images/places/lake-sevan.webp",
  [GARNI]: "/images/places/garni-temple.webp",
  [GEGHARD]: "/images/places/geghard-monastery.webp",
  [TATEV]: "/images/places/tatev-monastery.webp",
  [DILIJAN]: "/images/places/dilijan-national-park.webp",
  [GYUMRI]: "/images/places/gyumri.webp",
  [AMBERD]: "/images/places/amberd-fortress.webp",
  [JERMUK]: "/images/places/jermuk.webp",
  [HAGHPAT]: "/images/places/haghpat-monastery.webp",
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
    await expect(cards(page)).toHaveCount(13);

    // All twelve places open in this edition, under their own titles. The loop is
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
    "Tatev Monastery",
    "Dilijan National Park",
    "Amberd Fortress",
  ]) {
    await expect(page.getByText(english, { exact: true })).toHaveCount(0);
  }
  for (const slug of PLACES) {
    await expect(page.getByRole("link", { name: articleTitle("hy", slug) }).first()).toBeVisible();
  }
});

test("the places listing filters by kind of site, and keeps it in the URL", async ({ page }) => {
  await page.goto("/en/places");
  await expect(cards(page)).toHaveCount(13);

  await page.getByRole("button", { name: placeTypeLabel("en", "monastery") }).click();

  // Five of the thirteen places are monasteries and churches, so the filter
  // genuinely narrows. The count held at two across §39, because Garni is
  // `historical` and a temple is not a monastery; §41 moved it to three with
  // Geghard, and §47 to four with Tatev. §51 and §59 each added a place and left
  // this count alone, which is the thing worth checking: a city and a spa town are
  // not monasteries however many churches their articles name. §57 was the sharper
  // version — Amberd's article names a church, describes it at length and calls it
  // by its dedication, and Amberd is not a monastery either.
  //
  // §64 moves it to five, which is the largest this pill has ever been and the
  // reason the artwork refusals in `media.ts` name all four of the others.
  await expect(cards(page)).toHaveCount(5);
  for (const slug of [SLUG, ETCHMIADZIN, GEGHARD, TATEV, HAGHPAT]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
    ).toBeVisible();
  }
  for (const slug of [EREBUNI, MATENADARAN, SEVAN, GARNI, GYUMRI, AMBERD, JERMUK]) {
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

    `nature` left it in §49 on the same terms, and for the same reason: Dilijan is
    the second article under that pill. §51 was the case the loop was kept for: a new
    type arriving alone. `settlement` joined `museum` here on its first day, which
    was exactly the state `historical` and `nature` were in before their second
    article — and §59 takes it out again, because Jermuk is that second article and
    the pill is asserted as a pair in its own test below.

    That leaves `museum` alone in this loop for the third time, which is the whole
    reason it is a loop: the Matenadaran has been the only member of its pill since
    §35 and every other one-article pill has eventually left. Inlining it now would
    mean rebuilding the loop for Place #13.
  */
  for (const [type, slug] of [["museum", MATENADARAN]] as const) {
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

    // Clearing returns all thirteen, so the pill filters rather than replaces the set.
    await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
    await expect(cards(page), type).toHaveCount(13);
  }
});

test("the historical filter returns exactly Erebuni, Garni and Amberd", async ({ page }) => {
  /*
    The first place type to hold more than one article, and a genuinely different
    assertion from the loop above rather than a copy of it.

    While `historical` was a one-article pill, "the filter works" and "the filter
    shows Erebuni" were the same statement. They are not any more: a filter that
    silently matched everything, one that dropped the older article when the newer
    one arrived, and one that returned only the newest would all still render a
    plausible listing. Pinning the set — all present, everything else absent, and the
    count exact — separates those cases.

    §57 makes it three, and the trio is the argument for the breadth of this pill
    rather than a strain on it. An Urartian citadel at foundation level, a classical
    peristyle on a gorge rim and a ruined medieval fortress on a mountain have
    nothing in common except that none of them is a monastery, a museum, a landscape
    or a town. A `fortress`, `castle`, `military` or `archaeological` pill would have
    split them into ones and twos and made the taxonomy describe the archive's
    writing order rather than the country.
  */
  const HISTORICAL = [EREBUNI, GARNI, AMBERD] as readonly string[];

  await page.goto("/en/places");
  await page.getByRole("button", { name: placeTypeLabel("en", "historical") }).click();

  await expect(cards(page)).toHaveCount(HISTORICAL.length);
  for (const slug of HISTORICAL) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
      slug,
    ).toBeVisible();
  }
  for (const other of PLACES.filter((entry) => !HISTORICAL.includes(entry))) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", other) }),
      `historical must not show ${other}`,
    ).toHaveCount(0);
  }
  await expect(page).toHaveURL(/[?&]type=historical/);

  await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
  await expect(cards(page)).toHaveCount(13);
});

test("the nature filter returns exactly Lake Sevan and Dilijan National Park", async ({ page }) => {
  /*
    The §49 counterpart to the `historical` pair above, and it earns its own test
    for a reason the count alone does not show: these two articles are not the same
    kind of subject at all. Lake Sevan is a body of water at 1900 metres with a
    treeless shore; Dilijan is closed broadleaf forest in the north-east, and its
    own prose spends a section arguing that the two landscapes have almost nothing
    in common. `nature` is the pill that has to hold both, which is exactly the
    breadth §37 chose that id for over `landscape`.

    A filter that silently matched everything, one that dropped Sevan when Dilijan
    arrived, and one that returned only the newest would all render a plausible
    two-or-more listing. Pinning the pair, the exact count, and the absence of the
    other seven separates those cases.
  */
  await page.goto("/en/places");
  await page.getByRole("button", { name: placeTypeLabel("en", "nature") }).click();

  await expect(cards(page)).toHaveCount(2);
  for (const slug of [SEVAN, DILIJAN]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
      slug,
    ).toBeVisible();
  }
  for (const other of PLACES.filter((entry) => entry !== SEVAN && entry !== DILIJAN)) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", other) }),
      `nature must not show ${other}`,
    ).toHaveCount(0);
  }
  await expect(page).toHaveURL(/[?&]type=nature/);

  await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
  await expect(cards(page)).toHaveCount(13);
});

test("the settlement filter returns exactly Gyumri and Jermuk", async ({ page }) => {
  /*
    §59, and the §39/§49 move performed a third time: a one-article pill becomes a
    pair, and the assertion changes shape rather than only its count.

    The pair is the argument for the id. Gyumri is a nineteenth-century imperial city
    of a hundred thousand people on an open plain in the north-west; Jermuk is a
    twentieth-century spa town of a few thousand on a highland plateau in the
    south-east. Nothing about them is alike except that people live in both, which is
    exactly the breadth §51 chose `settlement` for and the reason no `spa`, `resort`,
    `town` or `health-resort` pill was invented for the second one.

    Asserted as a set rather than a count: two cards is also what a filter that
    returned Gyumri twice would produce, and every other place is named as absent so
    a pill that quietly widened would fail here rather than in a count somewhere else.
  */
  const SETTLEMENTS = [GYUMRI, JERMUK] as readonly string[];

  await page.goto("/en/places");
  await page.getByRole("button", { name: placeTypeLabel("en", "settlement") }).click();

  await expect(cards(page)).toHaveCount(SETTLEMENTS.length);
  for (const slug of SETTLEMENTS) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug) }).first(),
      slug,
    ).toBeVisible();
  }
  for (const other of PLACES.filter((entry) => !SETTLEMENTS.includes(entry))) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", other) }),
      `settlement must not show ${other}`,
    ).toHaveCount(0);
  }
  await expect(page).toHaveURL(/[?&]type=settlement/);

  await page.getByRole("button", { name: placeTypeLabel("en", "all") }).click();
  await expect(cards(page)).toHaveCount(13);
});

test("the filter vocabulary is exactly the six ids, in every edition", () => {
  /*
    Ids are shared across editions and only the labels are translated. A locale
    that added, dropped or renamed one would still compile and still render, and
    the reader of that edition would simply be filtering a different taxonomy.
  */
  for (const locale of LOCALES) {
    expect(
      bundle(locale).placeTypes.map((filter) => filter.id),
      `${locale} placeTypes`,
    ).toEqual(["all", "monastery", "historical", "museum", "nature", "settlement"]);
    // Every label is filled and none is the raw id leaking through.
    for (const filter of bundle(locale).placeTypes) {
      expect(filter.label.trim().length, `${locale} ${filter.id} label`).toBeGreaterThan(0);
      expect(filter.label, `${locale} ${filter.id} label`).not.toBe(filter.id);
    }
  }

  /*
    And no place type was invented for a city, which is the §51 version of the
    temptation this assertion has resisted since §41.

    `city`, `town`, `urban` and `cultural-city` are all reasonable words for what
    Gyumri is, and every one of them would have been a new pill for one article
    alongside a `settlement` id that already existed and had been reserved for
    exactly this. They are named here rather than merely excluded by the array
    above, because a negative assertion that names the specific wrong answer is the
    one that survives someone editing the list of ids.

    `forest`, `national-park` and `protected-area` are kept from §49 on the same
    principle. `settlement` has left this list — it is a real pill now, asserted in
    the array above and given its article below — and it is the one entry here that
    was ever meant to.

    §59 adds four more of its own, and they are the same temptation in a different
    dress: `spa`, `resort`, `town` and `health-resort` are all reasonable words for
    what Jermuk is, every one of them would have been a new pill for one article, and
    `settlement` already existed and already had a member. A second article under an
    existing id is the outcome a taxonomy is for.

    §57 adds four more, and they are the sharpest yet because Amberd is the first
    place whose *own subject noun* is not in the vocabulary. `fortress`, `castle`,
    `military` and `archaeological` are all reasonable words for what Amberd is, and
    two of them are what the article itself calls it; every one would have been a new
    pill splitting three articles that already share a working id. `historical` holds
    Erebuni, Garni and Amberd, and the fact that it takes a citadel, a temple and a
    fortress without strain is the evidence that it was the right breadth.
  */
  for (const locale of LOCALES) {
    const ids = bundle(locale).placeTypes.map((filter) => filter.id);
    for (const invented of [
      "forest",
      "national-park",
      "protected-area",
      "city",
      "town",
      "urban",
      "cultural-city",
      "fortress",
      "castle",
      "military",
      "archaeological",
      "spa",
      "resort",
      "health-resort",
      "mineral-water",
      "sanatorium",
    ]) {
      expect(ids, `${locale} must not gain a "${invented}" pill`).not.toContain(invented);
    }
  }

  // Each type matches exactly the articles that earned it. §51 adds one id and one
  // article under it, and moves nothing else. Asserting the whole sorted array
  // rather than membership is what makes a tenth place filed under the wrong pill
  // fail here rather than merely look odd on the listing.
  const under = (type: string) =>
    bundle("hy")
      .articles.filter((entry) => entry.category === "places" && entry.placeTypeId === type)
      .map((entry) => entry.slug)
      .sort();

  expect(under("historical")).toEqual([EREBUNI, GARNI, AMBERD].sort());
  expect(under("museum")).toEqual([MATENADARAN]);
  expect(under("nature")).toEqual([SEVAN, DILIJAN].sort());
  expect(under("monastery")).toEqual([ETCHMIADZIN, GEGHARD, SLUG, TATEV, HAGHPAT].sort());
  // §51 gave `settlement` its first member and §59 its second, which is what makes
  // this the third pill to stop being a singleton.
  expect(under("settlement")).toEqual([GYUMRI, JERMUK].sort());

  // The whole distribution, pinned against the id count above — thirteen places over
  // six pills, with one holding five, one holding three, two holding two and one
  // holding one. §64 moves exactly one number and introduces no id, which is what
  // the audit at twelve places concluded should keep happening until about twenty.
  const byType = new Map<string, number>();
  for (const entry of bundle("hy").articles.filter((a) => a.category === "places")) {
    byType.set(entry.placeTypeId!, (byType.get(entry.placeTypeId!) ?? 0) + 1);
  }
  expect(Object.fromEntries([...byType].sort())).toEqual({
    historical: 3,
    monastery: 5,
    museum: 1,
    nature: 2,
    settlement: 2,
  });
  expect(
    [...byType.values()].reduce((a, b) => a + b, 0),
    "every place carries a type, so the parts sum to the whole",
  ).toBe(PLACES.length);

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
  // Checked in every edition as of §51, not only in `en`. `featured` is authored
  // per locale, so a tenth article that picked up the flag in one edition would
  // move that edition's featured block and nothing else — the kind of divergence a
  // single-locale assertion cannot see.
  for (const locale of LOCALES) {
    const flagged = bundle(locale)
      .articles.filter((entry) => entry.category === "places" && entry.featured)
      .map((entry) => entry.slug);
    expect(flagged, `${locale}: exactly one place should carry featured: true`).toEqual([SLUG]);
  }
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

test("the ninth place is findable under the places group too", async ({ page }) => {
  /*
    Scoped by href like the six above, and this query has a rival of a kind none of
    them had: "Dilijan" matches the *town* as well as the park, and the town appears
    by name throughout this article's own prose and in its `keywords`. §51 is when
    that mattered: the archive now has a settlement article, so the assertion below
    is the one that had to survive one being added — and it does, because it claims
    a card linking to this article rather than a ranking.

    So the claim is the narrow one: a card linking to this article's own Places
    route appears, and the Places group heading is on the page. That is what
    `category: "places"` guarantees and what would silently not happen if a park
    article were filed anywhere else.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Dilijan");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${DILIJAN}"]`).first()).toBeVisible();

  /*
    And the Armenian editions find it under their own group heading too, by the
    Armenian name. The search haystack is built per edition, and a `keywords` list
    that carried only Latin forms would leave the article findable in English and
    invisible to a reader typing «Դիլիջան».
  */
  for (const locale of ["hy", "hyw"] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent("Դիլիջան")}`);
    const localized = page.getByRole("main");
    await expect(
      localized.getByRole("heading", { name: ui(locale).search.groupPlaces, level: 2 }),
      locale,
    ).toBeVisible();
    await expect(
      localized.locator(`a[href="/${locale}/places/${DILIJAN}"]`).first(),
      locale,
    ).toBeVisible();
  }
});

test("the tenth place is findable under the places group too", async ({ page }) => {
  /*
    §51, and this query has the crowded field: "Gyumri" already appears in three
    other articles' prose before this one existed — Isahakyan's biography names it
    twice, the Anush article names it as the modern name of Alexandropol, and both
    carry it in their own key facts. A writer or a work may legitimately rank above
    the city.

    So the claim is the narrow one, as it has been since §41: a card linking to this
    article's own Places route appears, and the Places group heading is on the page.
    That is what `category: "places"` guarantees and what would silently not happen
    if a settlement article were filed anywhere else — which is the live risk here,
    because this is the first article in the section whose subject is not a
    monument.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Gyumri");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${GYUMRI}"]`).first()).toBeVisible();

  /*
    And under the older name, which is the query this article is most likely to be
    searched by and the reason `keywords` carries it. "Alexandropol" appears in the
    history, writers and works sections too; the assertion is again that the Places
    card exists, not that it comes first.
  */
  await page.goto("/en/search?q=Alexandropol");
  await expect(
    page.getByRole("main").locator(`a[href="/en/places/${GYUMRI}"]`).first(),
  ).toBeVisible();

  /*
    And the Armenian editions find it under their own group heading by their own
    name for the city — which are two different names. The Eastern edition writes
    «Գյումրի» and the Western writes «Կիւմրի», the house forms this repository has
    used since the writers section, so a single Latin `keywords` list would leave
    the article findable in English and invisible to a reader typing either.
  */
  for (const [locale, query] of [
    ["hy", "Գյումրի"],
    ["hyw", "Կիւմրի"],
  ] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    const localized = page.getByRole("main");
    await expect(
      localized.getByRole("heading", { name: ui(locale).search.groupPlaces, level: 2 }),
      locale,
    ).toBeVisible();
    await expect(
      localized.locator(`a[href="/${locale}/places/${GYUMRI}"]`).first(),
      locale,
    ).toBeVisible();
  }
});

test("the eleventh place is findable under the places group too", async ({ page }) => {
  /*
    §57. The query here is uncrowded in one direction and dangerous in another:
    "Amberd" appears nowhere else in this archive, so the Places card should be
    unambiguous — but the word is also the name of a river, a village on the Ararat
    plain and a summit on the same massif, all of which `geo.ts` names as excluded
    coordinates. None of those is an article, so what this asserts is the narrow
    claim the section has made since §41: a card linking to this article's own
    Places route appears, and the Places group heading is on the page.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Amberd");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${AMBERD}"]`).first()).toBeVisible();

  /*
    And under the church's name, which is the other thing a reader arrives by and
    the reason `keywords` carries it in all three editions. Vahramashen has no
    article of its own — it is a component of this one — so a reader typing it must
    land here or nowhere.
  */
  await page.goto("/en/search?q=Vahramashen");
  await expect(
    page.getByRole("main").locator(`a[href="/en/places/${AMBERD}"]`).first(),
  ).toBeVisible();

  /*
    And the Armenian editions find it under their own group heading by the Armenian
    name, which is the same word in both editions — «Ամբերդ» carries no reformed
    spelling to differ over. The Western edition's own `keywords` differ from the
    Eastern in the church's name (Վահրամաշէն against Վահրամաշեն), which is why the
    query used here is the one form both share.
  */
  for (const locale of ["hy", "hyw"] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent("Ամբերդ")}`);
    const localized = page.getByRole("main");
    await expect(
      localized.getByRole("heading", { name: ui(locale).search.groupPlaces, level: 2 }),
      locale,
    ).toBeVisible();
    await expect(
      localized.locator(`a[href="/${locale}/places/${AMBERD}"]`).first(),
      locale,
    ).toBeVisible();
  }
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
  All nine places ship a cover, and each registration is a single `IMAGES` entry
  that has to light up six surfaces — hero, featured block, card, search
  thumbnail, social tags, sitemap — every one reached through `getImageSrc`, and
  every one silent if the registration is wrong.

  The caption is the assertion that matters most. `isGeneratedArtwork` flips to
  true the moment a slug enters the registry, and that is what makes the page
  state "AI-generated" rather than "placeholder". A registration that rendered
  the picture without the disclosure would look completely correct.

  These run over `ILLUSTRATED`, which as of §60 is all twelve places again. The
  placeholder branch therefore has no subject left in this section, which is the
  eleventh time this file has switched between the two states, and the reason
  `ILLUSTRATED` survives as a separate list rather than collapsing into `PLACES` —
  Place #13 will give it one back.
*/

test("each article hero renders its own registered artwork and names the AI provenance", async ({
  page,
}) => {
  /*
    Declared slow rather than trimmed. This test and the one below it are the two
    that navigate `LOCALES × ILLUSTRATED`, so §42 took each from eighteen page loads
    to twenty-one, §48 to twenty-four, §50 to twenty-seven, §52 to thirty, §58 to
    thirty-three and §60 to thirty-six — against a dev server
    that compiles routes on demand, with the rest of the suite competing for it.
    Both cleared the 30s global timeout when the places file ran alone and exceeded
    it in the full run, which is a cost of the loop's size and not a flake: the
    honest fix is to say the test is slow, not to shrink its coverage or re-run it
    until it passes.
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
  // Slow for the same reason as the test above: thirty-six navigations as of §60.
  test.slow();

  /*
    The other half of the caption logic, asserted as an absence — and covering the
    twelve illustrated places, which as of §60 is all of them again.

    It stays scoped to `ILLUSTRATED` rather than being repointed at `PLACES`: the
    two lists have coincided ten times and split again every time, and this
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

test("Dilijan renders its own file and is captioned as an illustration", async ({ page }) => {
  /*
    §50 inverts every assertion §49 wrote here, in all three editions.

    Between §49 and §50 this test asserted the opposite: the inline generated
    `<svg>`, no raster file, and the placeholder caption. All four have to flip
    together, and they fail in different directions with only one of them visible.
    A registration that reached the picture but not the caption would leave the page
    apologising for a missing image sitting right above the apology; one that
    reached the caption but not the picture would claim provenance for artwork that
    is not on the page. `isGeneratedArtwork` flips on registry membership alone,
    which is what makes the caption the half that actually goes wrong.

    Every edition, because the caption is read from each locale's own dictionary —
    the failure §34 caught the first time was exactly one edition being out of step.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${DILIJAN}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("img"), `${locale} ${DILIJAN}`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[DILIJAN]),
    );
    await expect(figure.locator("svg[role='img']"), `${locale} ${DILIJAN}`).toHaveCount(0);

    await expect(figure.locator("figcaption"), `${locale} ${DILIJAN}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, DILIJAN)),
    );
    await expect(figure.locator("figcaption"), `${locale} ${DILIJAN}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, DILIJAN)),
    );
  }

  expect(getImageSrc(DILIJAN), "Dilijan must now resolve to its own file").toBe(ARTWORK[DILIJAN]);
  expect(PENDING_ARTWORK, "and must no longer be pending").not.toContain(DILIJAN);
});

test("Dilijan borrows no other article's artwork, and advertises its own", async ({
  page,
}) => {
  /*
    The four substitutions §49 refused, asserted absent from the surfaces that speak
    for this article — the head, the structured data and the hero.

    §50 keeps every refusal and inverts only the second half. The borrowing test is
    the part that outlives registration: a cover can be repointed at a plausible
    neighbour at any time, and Lake Sevan is a likelier accident now than it was
    while this slug had no file at all.

    `lake-sevan` is the dangerous one, and it is dangerous because the relationship
    is real: it is the other `nature` article, it sits under the same filter pill,
    and it is this article's only `relatedSlugs` entry. It is also open water under
    treeless ridges, which is the landscape a whole section of this article
    distinguishes itself from — so borrowing it would illustrate the contrast with a
    picture of the wrong side of it.

    `geghard-monastery` is the only file in the registry with real trees in frame,
    which makes it the plausible near miss; `tatev-monastery` and `hero-ararat` are
    the Armenia of the photographs, which is the thing this article is about not
    being. `bagratid-armenia` is named too, as the gorge-without-a-forest trap that
    §37 and §41 both had to refuse.

    Scoped to the head and the hero rather than the whole document, on the same
    principle as the Lake Sevan, Garni and Geghard versions: Lake Sevan's cover
    legitimately appears further down the page on the related-articles card.
  */
  await page.goto(`/en/places/${DILIJAN}`);

  const metaValues = await page.locator("head meta[content]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("content") ?? ""),
  );
  const ld = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  const hero = await page.locator("header figure").innerHTML();

  for (const borrowed of [
    "lake-sevan",
    "geghard-monastery",
    "tatev-monastery",
    "bagratid-armenia",
    "hero-ararat",
    "khor-virap",
  ]) {
    for (const [surface, haystack] of [
      ["meta", metaValues.join(" ")],
      ["structured data", ld],
      ["hero", hero],
    ] as const) {
      expect(
        haystack.includes(borrowed),
        `${borrowed} must not appear in ${DILIJAN}'s ${surface}`,
      ).toBe(false);
    }
  }

  /*
    `Article.image` is a claim that a picture depicts this article. Between §49 and
    §50 it had to be *absent*, because no such picture existed and filling it with
    the generic site card would have been a false claim. Now a picture does depict
    this article, so the property must be present and must name Dilijan's own file —
    and `og:image` and `twitter:image` must have stopped falling back to the branded
    default they correctly carried while the slug had no artwork. Those were three
    different claims before registration and they collapse into one now, which is
    exactly why they are still asserted separately.

    The JSON-LD graph shape is unchanged: still an `Article` node, still no `Place`,
    `TouristAttraction`, `NationalPark` or `GeoCoordinates`. Registration adds an
    `image` property to an existing node and nothing else — asserted below rather
    than assumed, because a park is the single most tempting article in this archive
    to over-describe with tourism types.
  */
  const graph = (JSON.parse(ld) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  expect(JSON.stringify(article?.image), "the Article image must be Dilijan's own file").toContain(
    "dilijan-national-park",
  );

  for (const type of ["Place", "TouristAttraction", "NationalPark", "GeoCoordinates"]) {
    expect(
      graph.some((entry) => entry["@type"] === type),
      `registering artwork must not introduce a ${type} node`,
    ).toBe(false);
  }

  for (const meta of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(meta), `${DILIJAN} ${meta}`).toHaveAttribute(
      "content",
      fileIn(ARTWORK[DILIJAN]),
    );
    await expect(page.locator(meta), `${DILIJAN} ${meta} must not fall back`).not.toHaveAttribute(
      "content",
      /og-default/,
    );
  }

  /*
    And the sitemap now advertises this slug's own image on all three locale routes.
    Between §49 and §50 the assertion was that it advertised none: an `image:loc`
    naming a file that does not exist is worse than none at all, and a borrowed one
    would index a neighbour's picture under Dilijan's URL — which nothing on the
    rendered page would reveal. This is the inversion Tatev's did between §47 and
    §48, and the Lake Sevan exclusion is kept on both sides of it.
  */
  const sitemap = await page.goto("/sitemap.xml");
  const xml = (await sitemap!.text()).replace(/\s+/g, " ");

  for (const locale of LOCALES) {
    const block = xml.match(
      new RegExp(`<url>(?:(?!</url>).)*/${locale}/places/${DILIJAN}(?:(?!</url>).)*</url>`),
    );
    expect(block, `${locale} Dilijan sitemap entry`).not.toBeNull();
    expect(block![0], `${locale} must advertise its own image`).toContain(
      "dilijan-national-park.webp",
    );
    expect(block![0], `${locale} must not borrow Lake Sevan's file`).not.toContain("lake-sevan");
  }
});

test("Tatev renders its own file and is captioned as an illustration", async ({ page }) => {
  /*
    §48 inverts every assertion §47 wrote here, in all three editions.

    Between §47 and §48 this test asserted the opposite: the inline generated
    `<svg>`, no raster file, and the placeholder caption. All four have to flip
    together. A registration that reached the picture but not the caption would
    leave the page apologising for a missing image sitting right above the
    apology; one that reached the caption but not the picture would claim
    provenance for artwork that never rendered.

    The caption is the half that actually goes wrong, because the two strings
    differ by a single dictionary key and both look plausible on the page.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${TATEV}`);

    await expect(page.locator("header figure img"), `${locale} ${TATEV}`).toHaveCount(1);
    await expect(page.locator("header figure img"), `${locale} ${TATEV}`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[TATEV]),
    );
    await expect(page.locator("header figure svg[role='img']"), `${locale} ${TATEV}`).toHaveCount(
      0,
    );

    await expect(page.locator("header figcaption"), `${locale} ${TATEV}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, TATEV)),
    );
    await expect(page.locator("header figcaption"), `${locale} ${TATEV}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, TATEV)),
    );
  }
});

test("Tatev borrows no neighbouring monastery's artwork, and now advertises its own", async ({
  page,
}) => {
  /*
    The substitution this article was most at risk of, and the guard is kept across
    the registration rather than retired by it — the failure it catches (the cover
    being repointed at a plausible neighbour later) outlives the file landing.

    Geghard and Etchmiadzin are the other monasteries with registered covers, and
    either would look entirely plausible at a glance on a page about a fourth one.
    Garni is named too: it is the nearest neighbour in the registry by file, and
    §47's rejection notes name all of them.

    Scoped to the head and the hero, like the Lake Sevan and Garni versions: a
    related-article card lower down legitimately carries a sibling's cover, and
    Geghard is a genuine `relatedSlugs` entry here.
  */
  const forbidden = [ARTWORK[GEGHARD], ARTWORK[ETCHMIADZIN], ARTWORK[SLUG], ARTWORK[GARNI]];

  await page.goto(`/en/places/${TATEV}`);

  for (const path of forbidden) {
    const file = path.split("/").pop()!;
    await expect(page.locator(`head meta[content*="${file}"]`), file).toHaveCount(0);
    await expect(page.locator(`header figure img[src*="${file}"]`), file).toHaveCount(0);
  }

  /*
    And the sitemap now carries an image for Tatev in all three locale routes,
    where §47 asserted it carried none. This is the assertion that inverts: an
    `image:loc` naming a file that does not exist is worse than none at all, and
    a missing one after registration means image search never sees the artwork.
  */
  const sitemap = await page.goto("/sitemap.xml");
  const xml = (await sitemap!.text()).replace(/\s+/g, " ");

  for (const locale of LOCALES) {
    const block = xml.match(
      new RegExp(`<url>(?:(?!</url>).)*/${locale}/places/${TATEV}(?:(?!</url>).)*</url>`),
    );
    expect(block, `${locale} Tatev sitemap entry`).not.toBeNull();
    expect(block![0], `${locale} image:loc`).toContain("image:loc");
    expect(block![0], `${locale} names Tatev's own file`).toContain("tatev-monastery.webp");
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
  // and the other eleven are cards — twelve files across thirteen images as of §64,
  // with the thirteenth place carrying no file to look for.
  // The failure this catches is the one-line registration reaching some surfaces and
  // not others.
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
    Zero placeholders, which is what §66 inverted again.

    This assertion has now inverted seventeen times (§37 one, §38 zero, §39 one, §40
    zero, §41 one, §42 zero, §47 one, §48 zero, §49 one, §50 zero, §51 one, §52
    zero, §57 one, §58 zero, §59 one, §60 zero, §64 one, §66 zero), which is the
    whole argument for pinning the count rather than asserting "at least one" or
    "none by inspection". The exact number is the only thing that distinguishes the
    intended state from a place that had quietly lost its registration, because
    neither shows on the rendered page. A placeholder card looks perfectly finished,
    and so does a listing with one missing cover among thirteen.

    §66 is the first time every Place has had a cover at once, so the expression
    below evaluates to zero for the first time in the section's history. It is left
    derived rather than replaced with a literal `0`: the derivation is what will make
    Place #14 correct on the day it ships without its picture.

    Derived from the two lists rather than typed as a literal, so the next place to
    ship ahead of its artwork does not need this number edited by hand.
  */
  await expect(page.locator("main svg[role='img']")).toHaveCount(
    PLACES.length - ILLUSTRATED.length,
  );
  expect(
    sources,
    "one image per illustrated place, plus the featured block's repeat",
  ).toHaveLength(ILLUSTRATED.length + 1);

  /*
    And each card carries its *own* file, checked card by card rather than only
    across the page.

    Everything above is a set assertion: the right files are all present, nothing
    else leaked in, the count is exact, no placeholder remains. All four still hold
    if two cards *swap* covers — Geghard showing Garni's picture while Garni shows
    Geghard's — and that is precisely the borrowed-neighbour failure this section
    guards hardest, because the two sit eight kilometres apart in the same valley
    and are linked from Geghard's own prose. Nothing on the rendered page would
    reveal it; a listing where every card has a plausible picture looks finished.
  */
  for (const slug of ILLUSTRATED) {
    /*
      `cards()` is the `article` role, which is what `ArticleCard` renders — not
      `listitem`, which is the search page's shape. Khor Virap is the featured
      place and so appears twice on this page, but `FeaturedItem` is not a card,
      which is why the count below is one rather than two and why the whole-page
      `sources` length above is `ILLUSTRATED.length + 1`.
    */
    const card = cards(page).filter({ has: page.locator(`a[href="/en/places/${slug}"]`) });

    await expect(card, slug).toHaveCount(1);
    await expect(card.locator("img"), `${slug} card artwork`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[slug]),
    );
  }
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
    [TATEV, "Tatev"],
    [DILIJAN, "Dilijan"],
    // §52. The tenth, and the only query in this list whose top result is not
    // certain to be the place — "Gyumri" is in Isahakyan's and Anush's prose and
    // key facts — which is why the assertion below is scoped by canonical href.
    [GYUMRI, "Gyumri"],
  ] as const) {
    await page.goto(`/en/search?q=${query}`);

    // Scoped to this place's own result card, not `.first()`. Every query here
    // has a rival in History: "Etchmiadzin" matches the article on the conversion,
    // "Erebuni" the one on Urartu, "Matenadaran" the one on the alphabet, which
    // names the institute in its legacy section, "Sevan" both the Urartu article,
    // whose prose names the lake, and the writer Paruyr Sevak, "Garni" the
    // gata article, which names the villages around Geghard and Garni,
    // "Geghard" that same gata article, "Tatev" the Bagratid article, and
    // "Dilijan" both the park article's own prose about the town and Lake Sevan's
    // article, which names the ridge between the two parks. Any of
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

test("Dilijan's search card carries its own thumbnail and no placeholder", async ({ page }) => {
  /*
    The inverse of what §49 asserted, where this card had to render the generated
    `<svg>` and no `<img>` at all.

    The card half of the same invariant, written for the eighth time and still not
    folded into the hero test, because registration reaches the two through
    different components: `SearchResultCard` calls `getImageSrc` directly while the
    hero goes through `getArticleImageSrc`. One can be right while the other is not.

    Located by its own href rather than by result position, as the brief for every
    one of these requires: "Dilijan" is a query with rivals in this archive, since
    the park article names the town throughout and Lake Sevan's article names the
    ridge between them.
  */
  await page.goto("/en/search?q=Dilijan");

  const card = page
    .getByRole("main")
    .getByRole("listitem")
    .filter({ has: page.locator(`a[href="/en/places/${DILIJAN}"]`) });

  await expect(card, DILIJAN).toHaveCount(1);
  await expect(card.locator("svg[role='img']"), DILIJAN).toHaveCount(0);
  await expect(card.locator("img"), DILIJAN).toHaveCount(1);
  await expect(card.locator("img"), DILIJAN).toHaveAttribute("src", fileIn(ARTWORK[DILIJAN]));

  // And not a neighbour's picture in the one card that speaks for Dilijan. These
  // four are the substitutions §49 refused, and `lake-sevan` is the dangerous one:
  // the other `nature` article, the same filter pill, and this article's only
  // `relatedSlugs` entry.
  for (const borrowed of [
    "lake-sevan",
    "geghard-monastery",
    "tatev-monastery",
    "khor-virap",
  ]) {
    await expect(card.locator(`img[src*="${borrowed}"]`), borrowed).toHaveCount(0);
  }
});

test("Gyumri renders its own file and is captioned as an illustration", async ({ page }) => {
  /*
    §52 inverts every assertion §51 wrote here, in all three editions.

    Between §51 and §52 this test asserted the opposite: the inline generated
    `<svg role="img">` was the hero, there was no raster `<img>` at all, and the
    caption was the *placeholder* wording. Registering one line in `IMAGES` flips
    every one of those, and this is the test that says so rather than assuming it.

    The caption is the assertion that matters most and the reason this is not
    redundant with the loop over `ILLUSTRATED` above. `isGeneratedArtwork` returns
    true the moment a slug enters the registry with no `article.image`, and that is
    what makes the page say "AI-generated illustration" instead of "placeholder". A
    registration that rendered the picture without the disclosure would look
    completely correct, and for this file it matters more than for any before it:
    the artwork is photographic in register, so an undisclosed cover would read as a
    photograph of a real street.
  */
  const en = ui("en");
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${GYUMRI}`);

    await expect(page.locator("header figure img"), locale).toHaveAttribute(
      "src",
      fileIn(ARTWORK[GYUMRI]),
    );
    await expect(page.locator("header figure svg[role='img']"), locale).toHaveCount(0);
    await expect(page.locator("header figcaption"), locale).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, GYUMRI)),
    );
    await expect(page.locator("header figcaption"), locale).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, GYUMRI)),
    );
  }

  // A city is a scene, not a likeness, so it takes the illustration wording rather
  // than the portrait branch — asserted once explicitly because this is the first
  // Place with people in the frame, and a face is exactly what would tempt the
  // portrait caption.
  expect(en.article.imageAiIllustrationCaption).not.toBe(en.article.imagePlaceholderCaption);
});

test("Gyumri borrows no other article's artwork, and advertises its own", async ({ page }) => {
  /*
    The substitution guard, kept across the registration rather than retired by it —
    the same principle as the Lake Sevan three, the Garni three and the Geghard
    five. The failure it now catches is the cover being repointed at a plausible
    neighbour later, which outlives the file landing.

    For a city the plausible wrong picture is sharper than for anything before it,
    because this repository owns exactly one other image of a stone city and it is
    the wrong one. `history/bagratid-armenia.webp` is Ani: a dense townscape with
    domed churches, walls and a gorge, and a capital abandoned since the eighteenth
    century. It would pass a glance under a Gyumri headline and would caption a ruin
    as a living city — the conflation this article's early-history section exists to
    prevent. `writers/avetik-isahakyan.webp` is the biographical trap: Isahakyan was
    born here and the article names him, but a portrait is not a place.

    Scoped to this article's own surfaces — hero, meta tags, structured data — and
    not to the whole document, because the related-articles block at the foot of the
    page legitimately renders Isahakyan's and Anush's covers. Borrowing is only a
    fault when the borrowed file is presented as *this* article's own.
  */
  await page.goto(`/en/places/${GYUMRI}`);

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const metaValues = await page
    .locator("head meta[content]")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? ""));
  const surfaces = [...metaValues, raw ?? ""].join(" ");

  for (const borrowed of [
    ...ILLUSTRATED.filter((slug) => slug !== GYUMRI).map((slug) => ARTWORK[slug]),
    "/images/history/bagratid-armenia.webp",
    "/images/writers/avetik-isahakyan.webp",
    "/images/works/anush.webp",
    "/images/history/first-republic-armenia.webp",
  ]) {
    expect(
      surfaces.includes(borrowed),
      `${borrowed} must not appear in ${GYUMRI}'s own metadata`,
    ).toBe(false);
  }

  /*
    And the positive half — §51 asserted `Article.image` was *absent*, so this is
    the exact inversion. The generic `Article` graph is unchanged: the picture
    arrives as `image` and nothing else moves, which is what keeps a settlement from
    quietly acquiring a `City` or `TouristDestination` type.
  */
  expect(raw, "Gyumri emits JSON-LD").toBeTruthy();
  const graph = (JSON.parse(raw!) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the graph still carries a generic Article node").toBeDefined();
  expect(article!.image, "Article.image is Gyumri's own file").toEqual({
    "@type": "ImageObject",
    url: `https://armat.site${ARTWORK[GYUMRI]}`,
  });
  /*
    And the graph gained an image and nothing else. Registering a picture for a
    *settlement* is the moment someone would be tempted to describe the subject
    properly in structured data, and none of these types belongs to this archive's
    model — the coordinate exists for Armat's map, not as an instruction to change
    schema.
  */
  for (const speculative of [
    "City",
    "AdministrativeArea",
    "TouristDestination",
    "GeoCoordinates",
    "LocalBusiness",
  ]) {
    expect(raw, `${speculative} must not be introduced`).not.toContain(`"${speculative}"`);
  }

  // The social surfaces carry it too. §51 asserted these were absent; a hero that
  // renders while `og:image` still points nowhere is invisible from the page.
  for (const property of ["og:image", "twitter:image"]) {
    const content = await page
      .locator(`head meta[property="${property}"], head meta[name="${property}"]`)
      .first()
      .getAttribute("content");
    expect(content, property).toContain(ARTWORK[GYUMRI]);
  }

  await expect(page.locator("header figure img")).toHaveAttribute("src", fileIn(ARTWORK[GYUMRI]));
});

test("Gyumri's search card carries its own thumbnail and no placeholder", async ({ page }) => {
  await page.goto("/en/search?q=Gyumri");

  const card = page
    .getByRole("main")
    .locator("li")
    .filter({ has: page.locator(`a[href="/en/places/${GYUMRI}"]`) })
    .first();
  await expect(card).toBeVisible();

  // Its own file, inside its own card — scoped by the canonical href rather than by
  // position, because the query legitimately returns writers and works hits too.
  await expect(card.locator("img")).toHaveAttribute("src", fileIn(ARTWORK[GYUMRI]));
  await expect(card.locator("svg[role='img']"), "no placeholder in the card").toHaveCount(0);

  for (const slug of ILLUSTRATED) {
    if (slug === GYUMRI) continue;
    const inside = await card.locator(`img[src*="${encodeURIComponent(ARTWORK[slug])}"]`).count();
    expect(inside, `${slug} must not illustrate the ${GYUMRI} card`).toBe(0);
  }
  const insideAni = await card.locator('img[src*="bagratid-armenia"]').count();
  expect(insideAni, "Ani must not stand in for Gyumri in search").toBe(0);
});

test("Amberd renders its own file and is captioned as an illustration", async ({ page }) => {
  /*
    §58 inverts every assertion §57 wrote here, in all three editions.

    Between §57 and §58 this test asserted the opposite: the inline generated
    `<svg>`, no raster file, and the placeholder caption. All four have to flip
    together, and they fail in different directions with only one of them visible.
    A registration that reached the picture but not the caption would leave the page
    apologising for a missing image sitting right above the apology; one that
    reached the caption but not the picture would claim provenance for artwork that
    is not on the page. `isGeneratedArtwork` flips on registry membership alone,
    which is what makes the caption the half that actually goes wrong.

    Every edition, because the caption is read from each locale's own dictionary —
    the divergence §34 caught the first time was exactly one edition being out of
    step, and nothing about registration is locale-aware.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${AMBERD}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("img"), `${locale} ${AMBERD}`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[AMBERD]),
    );
    await expect(figure.locator("svg[role='img']"), `${locale} ${AMBERD}`).toHaveCount(0);

    await expect(figure.locator("figcaption"), `${locale} ${AMBERD}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, AMBERD)),
    );
    await expect(figure.locator("figcaption"), `${locale} ${AMBERD}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, AMBERD)),
    );
  }

  expect(getImageSrc(AMBERD), "Amberd must now resolve to its own file").toBe(ARTWORK[AMBERD]);
  expect(PENDING_ARTWORK, "and must no longer be pending").not.toContain(AMBERD);
});

test("Amberd borrows no other article's artwork, and advertises its own", async ({ page }) => {
  /*
    The half of §57 that outlives registration, and the one the caption assertion
    above cannot make: a placeholder is visible, a *borrowed* cover is not — it looks
    finished. §58 keeps every refusal and inverts only the second half.

    The five named below are the substitutions recorded as refused in
    `PENDING_ARTWORK`, and the first two are the closest near misses that list has
    ever had to turn down. `tatev-monastery` is a walled enclosure on a promontory
    above a gorge, seen from the air, which is a fair description of Amberd's setting
    and of nothing else in the frame; `bagratid-armenia` is Ani, a walled medieval
    city above a river gorge, in the right kingdom and the right century, and it is
    already the refused substitute of record for Gyumri. Both would pass more than a
    glance under this headline, and both are likelier accidents now that this slug
    has a file to be repointed away from than they were while it had none.
  */
  await page.goto(`/en/places/${AMBERD}`);

  /*
    Scoped to the hero, the head and the structured data rather than to every image
    on the page, and the reason is a real piece of existing behaviour rather than a
    weakening.

    `getRelatedArticles` fills a short related row from the article's own category:
    Amberd authors one related slug — `bagratid-armenia`, the only relationship its
    prose earns — so the row is completed with two Places cards, and each of those
    legitimately carries its own cover under its own headline and its own link. That
    is the filler doing its job, and it is the same behaviour Dilijan has had since
    §49. A page-global assertion that `bagratid-armenia` appears nowhere would fail
    on correct output, which is exactly what it did when it was first written.

    What must never happen is a neighbouring place's file appearing where *this*
    article's own picture goes. That is the hero, the social tags, the structured
    data and the sitemap — the four surfaces `getImageSrc` reaches — and all four are
    checked here and below.
  */
  const metaValues = await page
    .locator("head meta[content]")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? ""));
  const raw = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
  const hero = await page.locator("header figure").innerHTML();

  for (const borrowed of [
    "tatev-monastery",
    "bagratid-armenia",
    "erebuni-fortress",
    "geghard-monastery",
    "garni-temple",
    "hero-ararat",
    "khor-virap",
  ]) {
    for (const [surface, haystack] of [
      ["meta", metaValues.join(" ")],
      ["structured data", raw],
      ["hero", hero],
    ] as const) {
      expect(
        haystack.includes(borrowed),
        `${borrowed} must not appear in ${AMBERD}'s ${surface}`,
      ).toBe(false);
    }
  }

  /*
    `Article.image` is a claim that a picture depicts this article. Between §57 and
    §58 it had to be *absent*, because no such picture existed and filling it with
    the generic site card would have been a false claim. Now a picture does depict
    this article, so the property must be present and must name Amberd's own file —
    and `og:image` and `twitter:image` must have stopped falling back to the branded
    default they correctly carried while the slug had no artwork. Those were three
    different claims before registration and they collapse into one now, which is
    exactly why they are still asserted separately.

    The JSON-LD graph shape is unchanged: still an `Article` node, still no `Place`,
    `TouristAttraction`, `Castle`, `Fortress`, `LandmarksOrHistoricalBuildings` or
    `GeoCoordinates`. Registration adds an `image` property to an existing node and
    nothing else — asserted below rather than assumed, because a fortress with a
    stored coordinate is the single most tempting article in this archive to
    over-describe with tourism types.
  */
  const graph = (JSON.parse(raw) as { "@graph": Record<string, unknown>[] })["@graph"];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "the Article node itself must still be emitted").toBeDefined();
  expect(JSON.stringify(article?.image), "the Article image must be Amberd's own file").toContain(
    "amberd-fortress",
  );

  for (const type of [
    "Place",
    "TouristAttraction",
    "Castle",
    "Fortress",
    "LandmarksOrHistoricalBuildings",
    "GeoCoordinates",
  ]) {
    expect(
      graph.some((entry) => entry["@type"] === type),
      `registering artwork must not introduce a ${type} node`,
    ).toBe(false);
  }

  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(property), `${AMBERD} ${property}`).toHaveAttribute(
      "content",
      fileIn(ARTWORK[AMBERD]),
    );
    await expect(
      page.locator(property),
      `${AMBERD} ${property} must not fall back`,
    ).not.toHaveAttribute("content", /og-default/);
  }

  await expect(page.locator("header figure img")).toHaveAttribute("src", fileIn(ARTWORK[AMBERD]));
});

test("Amberd's search card carries its own thumbnail and no placeholder", async ({ page }) => {
  await page.goto("/en/search?q=Amberd");

  /*
    §58. The search thumbnail is the tightest live crop on the site — the rendered
    box measures 160×200 CSS px, an 0.801 ratio — so the shared centre crop trims
    49.9 per cent of this file's width and drops the Vahramashen church entirely,
    keeping the towers, the spur and the massif. That is recorded against the
    `IMAGES` entry as degraded rather than unusable and no `object-position` was
    added; what is asserted here is ownership, which is the half that can silently
    regress.
  */
  const card = page
    .getByRole("main")
    .locator("li")
    .filter({ has: page.locator(`a[href="/en/places/${AMBERD}"]`) })
    .first();
  await expect(card).toBeVisible();

  // Its own file, inside its own card — scoped by the canonical href rather than by
  // position, because the query legitimately returns other hits too.
  await expect(card.locator("img")).toHaveAttribute("src", fileIn(ARTWORK[AMBERD]));
  await expect(card.locator("svg[role='img']"), "no placeholder in the card").toHaveCount(0);

  for (const slug of ILLUSTRATED) {
    if (slug === AMBERD) continue;
    const inside = await card.locator(`img[src*="${encodeURIComponent(ARTWORK[slug])}"]`).count();
    expect(inside, `${slug} must not illustrate the ${AMBERD} card`).toBe(0);
  }
  const insideAni = await card.locator('img[src*="bagratid-armenia"]').count();
  expect(insideAni, "Ani must not stand in for Amberd in search").toBe(0);
});

test("the twelfth place is findable under the places group too", async ({ page }) => {
  /*
    §59. This query is uncrowded in one direction and dangerous in another: nothing
    else in the archive is called Jermuk, but the word is an ordinary Armenian common
    noun for a warm spring, so an Armenian search for it is a search for a word as
    much as for a place.

    The claim is the narrow one this test has made since §41: a card linking to this
    article's own Places route appears, and the Places group heading is on the page.
    That is what `category: "places"` guarantees and what would silently not happen
    if a spa town were filed under `nature` — the live risk here, because the article
    is about water.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Jermuk");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${JERMUK}"]`).first()).toBeVisible();

  // And under the queries the `keywords` list exists to serve: the older name of the
  // settlement, and the province it is in. Neither appears in the article's title.
  for (const query of ["Istisu", "Vayots Dzor"]) {
    await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.getByRole("main").locator(`a[href="/en/places/${JERMUK}"]`).first(),
      query,
    ).toBeVisible();
  }

  // And both Armenian editions find it under their own group heading. The name is
  // spelled identically in the two orthographies, which is unusual here and is why
  // the assertion is that each edition finds *its own* route rather than that the
  // query differs.
  for (const locale of ["hy", "hyw"] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent("Ջերմուկ")}`);
    const localized = page.getByRole("main");
    await expect(
      localized.getByRole("heading", { name: ui(locale).search.groupPlaces, level: 2 }),
      locale,
    ).toBeVisible();
    await expect(
      localized.locator(`a[href="/${locale}/places/${JERMUK}"]`).first(),
      locale,
    ).toBeVisible();
  }
});

test("Jermuk renders its own file and is captioned as an illustration", async ({ page }) => {
  /*
    §60 inverts every assertion §59 wrote here, in all three editions.

    Between §59 and §60 this test asserted the opposite: the inline generated `<svg>`,
    no raster file, and the placeholder caption. All four have to flip together, and
    they fail in different directions with only one of them visible. A registration
    that reached the picture but not the caption would leave the page apologising for
    a missing image sitting right above the apology; one that reached the caption but
    not the picture would claim provenance for artwork that is not on the page.
    `isGeneratedArtwork` flips on registry membership alone, which is what makes the
    caption the half that actually goes wrong.

    The caption is also the one claim this registration can still make honestly. The
    file is an AI-generated Armat editorial illustration and is captioned as exactly
    that; whether it depicts the right subject is a question the disclosure does not
    answer and this test does not pretend to.

    Every edition, because the caption is read from each locale's own dictionary —
    the failure §34 caught the first time was exactly one edition being out of step.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${JERMUK}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("img"), `${locale} ${JERMUK}`).toHaveAttribute(
      "src",
      fileIn(ARTWORK[JERMUK]),
    );
    await expect(figure.locator("svg[role='img']"), `${locale} ${JERMUK}`).toHaveCount(0);

    await expect(figure.locator("figcaption"), `${locale} ${JERMUK}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, JERMUK)),
    );
    await expect(figure.locator("figcaption"), `${locale} ${JERMUK}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, JERMUK)),
    );
  }

  expect(getImageSrc(JERMUK), "Jermuk must now resolve to its own file").toBe(ARTWORK[JERMUK]);
  expect(PENDING_ARTWORK, "and must no longer be pending").not.toContain(JERMUK);
});

test("Jermuk borrows no other article's artwork, and advertises its own", async ({
  page,
}) => {
  /*
    The stronger half of §59, kept and inverted in §60: a placeholder is visible, a
    *borrowed* cover is not — it looks finished.

    This is the assertion that outlives registration, and it matters more here than
    anywhere else in the section. Jermuk's own cover is off-subject by decision, so
    the standing temptation is not a typo but an *improvement* — repointing this slug
    at `dilijan-national-park` (the other Armenian spa town) or `gyumri` (the other
    settlement) would look like someone fixing the mismatch, and would be a silent
    substitution of one article's picture for another's. Every name below is still
    refused, and now for a second reason.

    `gyumri` is the sharpest name below and the reason this test is written at all:
    after this step the two files would sit under the same filter pill, and the only
    urban image in the registry is the other settlement's. `dilijan-national-park` is
    the closest conceptual near miss — the other Armenian town with a spa history —
    and `tatev-monastery` is the gorge in the south that a search returns first. All
    are recorded as refused in `PENDING_ARTWORK`.

    Scoped to the hero and the metadata rather than to every image on the page, for
    the reason §58 wrote into this file: `getRelatedArticles` fills a short related
    row from the article's own category, so other places' covers legitimately appear
    further down under their own headlines. What must never happen is a neighbour's
    file appearing where *this* article's own picture would go — the hero, the social
    tags, the structured data and the sitemap, which are the four surfaces
    `getImageSrc` reaches.
  */
  await page.goto(`/en/places/${JERMUK}`);

  await expect(page.locator("header figure img"), "its own hero raster").toHaveAttribute(
    "src",
    fileIn(ARTWORK[JERMUK]),
  );
  await expect(page.locator("header figure svg[role='img']"), "no placeholder").toHaveCount(0);

  const heroSources = (
    await page
      .locator("header img")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("src") ?? ""))
  ).map(decodeURIComponent);

  for (const borrowed of [
    ...Object.values(ARTWORK).filter((path) => path !== ARTWORK[JERMUK]),
    "/hero-ararat.png",
  ]) {
    expect(
      heroSources.some((src) => src.includes(borrowed)),
      `${borrowed} must not illustrate ${JERMUK}`,
    ).toBe(false);
  }

  /*
    And the structured data now carries its own `image` rather than none.
    `articleLd` only emits the property when a file resolves, so its absence was the
    §59 state and its presence is the §60 one — and a *neighbour's* path appearing
    here is the failure neither state would reveal on the rendered page.
  */
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(raw, "Jermuk emits JSON-LD").toBeTruthy();
  const graph = (JSON.parse(raw ?? "") as { "@graph": { "@type"?: string; image?: unknown }[] })[
    "@graph"
  ];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "an Article node").toBeDefined();
  expect(JSON.stringify(article!.image), "Article.image is Jermuk's own file").toContain(
    ARTWORK[JERMUK],
  );

  /*
    And no schema type was invented for a spa town, which is the §59 version of a
    temptation this file has resisted since §41 and which is sharper here than
    anywhere before it. A settlement with a coordinate, a mineral-water product and a
    history of medical treatment is the single most inviting article in this archive
    to describe with `MedicalBusiness`, `HealthAndBeautyBusiness` or
    `TouristDestination`. None of them belongs to this archive's model: the
    coordinate exists for Armat's map, and the subject is an article about a place.
  */
  for (const speculative of [
    "City",
    "Place",
    "TouristDestination",
    "TouristAttraction",
    "HealthAndBeautyBusiness",
    "MedicalBusiness",
    "GeoCoordinates",
    "LocalBusiness",
    "Product",
  ]) {
    expect(raw, `${speculative} must not be introduced`).not.toContain(`"${speculative}"`);
  }

  // The social tags now carry the file rather than the site default — the exact
  // inversion of §59, and the surface where a borrowed cover travels furthest,
  // because a share preview is cached by the receiving platform.
  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(property).first().getAttribute("content");
    expect(content, property).toContain(ARTWORK[JERMUK]);
    expect(content, `${property} must not fall back`).not.toContain("og-default");
  }
});

test("Jermuk's search card carries its own thumbnail and no placeholder", async ({ page }) => {
  await page.goto("/en/search?q=Jermuk");

  /*
    §60. The search thumbnail is the tightest live crop on the site — the rendered box
    measures 160×200 CSS px, an 0.801 ratio — so the shared centre crop trims 49.9 per
    cent of this file's width. For this particular file that is the *best* of the four
    live crops rather than the worst: the composition is centred and vertically deep,
    so the narrow column keeps the whole cascade, both gorge walls and the treeline. No
    `object-position` was added and there is no crop debt recorded against it.

    What is asserted here is ownership, which is the half that can silently regress.
  */
  const card = page
    .getByRole("main")
    .locator("li")
    .filter({ has: page.locator(`a[href="/en/places/${JERMUK}"]`) })
    .first();
  await expect(card).toBeVisible();

  // Its own file, inside its own card — scoped by the canonical href rather than by
  // position, because the query legitimately returns other hits too.
  await expect(card.locator("img")).toHaveAttribute("src", fileIn(ARTWORK[JERMUK]));
  await expect(card.locator("svg[role='img']"), "no placeholder in the card").toHaveCount(0);

  for (const slug of ILLUSTRATED) {
    if (slug === JERMUK) continue;
    const inside = await card.locator(`img[src*="${encodeURIComponent(ARTWORK[slug])}"]`).count();
    expect(inside, `${slug} must not illustrate the ${JERMUK} card`).toBe(0);
  }
});

test("Jermuk describes historical spa practice and prescribes nothing", async ({ page }) => {
  /*
    §59's editorial guard, and the one this article most needs.

    Jermuk's waters have been sold for three-quarters of a century, and the marketing
    vocabulary — cures, treats, heals, prevents — is the same vocabulary the Soviet
    balneological literature used. An article that slipped into the present tense
    would be giving medical advice under an encyclopedia's byline, and nothing about
    the rendered page would announce it.

    Asserted over the *editorial* surfaces in every edition rather than by reading
    the prose in one: the SEO fields and the summary are where a claim would do the
    most damage, because they are what a search result shows. The prose itself is
    checked for the specific present-tense constructions the brief named.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === JERMUK)!;
    const seo = [
      article.seoTitle ?? "",
      article.metaDescription ?? "",
      article.summary ?? "",
      article.excerpt,
    ]
      .join(" ")
      .toLowerCase();

    for (const claim of ["cure", "cures", "heals", "treats", "բուժում է", "կը բուժէ", "դարմանում"]) {
      expect(seo, `${locale} SEO fields must make no therapeutic claim: ${claim}`).not.toContain(
        claim,
      );
    }
  }

  /*
    And the English body says in as many words that it is describing a historical
    practice and giving no advice. Pinned as a positive assertion rather than only as
    an absence, because the disclaimer is the thing a later edit would quietly drop
    while leaving the surrounding paragraph intact.
  */
  await page.goto(`/en/places/${JERMUK}`);
  const main = page.getByRole("main");
  await expect(main).toContainText("historical practice");
  await expect(main).toContainText("offers no health advice");
  await expect(main).toContainText("was promoted, and prescribed");
});

test("Jermuk dates its population figures and never states a bare one", async ({ page }) => {
  /*
    §59. Every population number in this article is a census figure with a year and a
    label attached, and the labels matter more here than in any previous place: the
    same census gives the town 3936 permanent residents and 3569 present ones, and
    the community 5694. Three official numbers for one name, and a bare "population:
    5694" would be wrong about the town while being right about something.

    Asserted in every edition, because a number is the one thing that survives
    translation unchanged and is therefore the one thing that can be corrected in one
    edition and forgotten in the other two — which `validate:content` already checks
    as a multiset and this checks as a *pairing* with its year.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === JERMUK)!;
    const populationFact = article.keyFacts.find((fact) => /3936/.test(fact.value));
    expect(populationFact, `${locale} states the town's population as a key fact`).toBeDefined();
    expect(populationFact!.value, `${locale} dates it`).toMatch(/2022/);

    // And the community figure is never given as the town's, in any field.
    const everything = [
      article.summary ?? "",
      article.intro,
      ...article.keyFacts.map((fact) => fact.value),
    ].join(" ");
    expect(everything, `${locale} must not put 5694 where the town's figure belongs`).not.toMatch(
      /5694/,
    );
  }

  // On the page, the census year and both of the town's figures appear together.
  await page.goto(`/en/places/${JERMUK}`);
  const main = page.getByRole("main");
  await expect(main).toContainText("3936");
  await expect(main).toContainText("3569");
  await expect(main).toContainText("5694");
  await expect(main).toContainText("census of October 2022");
});

test("Jermuk keeps the bottled water separate from the settlement", async ({ page }) => {
  /*
    §59. The name on the bottle is better known than the town, and the failure this
    guards against is an article about a settlement quietly becoming a company
    history — or worse, a product page. The brief for this step named that risk twice.

    Two things are asserted. The article says in its own prose that the brand and the
    settlement are different subjects and that not every spring feeds the bottled
    product; and the SEO surfaces, which are where a product page would announce
    itself, sell nothing.
  */
  await page.goto(`/en/places/${JERMUK}`);
  const main = page.getByRole("main");
  await expect(main).toContainText("Not every spring in the field feeds the bottled product");
  await expect(main).toContainText("commercial story rather than a settlement's story");

  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === JERMUK)!;
    const seo = [article.seoTitle ?? "", article.metaDescription ?? "", article.excerpt]
      .join(" ")
      .toLowerCase();
    for (const commercial of ["buy", "order", "shop", "price", "delivery", "գնել", "պատուէր"]) {
      expect(seo, `${locale} sells nothing: ${commercial}`).not.toContain(commercial);
    }
  }
});

test("the sitemap carries every place's illustration for image search", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  /*
    §60. Jermuk's three routes now each carry its own `image:loc` — the exact
    inversion of what §59 asserted here, when the three blocks had to contain none.

    `sitemap.ts` adds the image key only when `getArticleImageSrc` returns something,
    so §59 asserting the absence proved that condition was real rather than
    incidental, and §60 asserts the presence for the same reason. Checked route by
    route rather than by whole-document count: three appearances anywhere would still
    pass if all three landed on one route and none on the others, and an image
    crawler handed another place's picture under Jermuk's URL is a failure nothing on
    the rendered page would reveal.
  */
  const jermukBlocks = xml.split("<url>").filter((block) => block.includes(`/places/${JERMUK}<`));
  expect(jermukBlocks, `${JERMUK} url blocks`).toHaveLength(LOCALES.length);
  for (const block of jermukBlocks) {
    expect(block, `${JERMUK} must emit an image:loc`).toContain("image:loc");
    expect(block, `${JERMUK} sitemap image`).toContain(`https://armat.site${ARTWORK[JERMUK]}`);
    for (const borrowed of ["gyumri", "dilijan-national-park", "lake-sevan", "tatev-monastery"]) {
      expect(block, `${borrowed} must not be indexed under ${JERMUK}`).not.toContain(borrowed);
    }
  }

  /*
    §58. Amberd's three routes now each carry its own `image:loc` — the exact
    inversion of what §57 asserted here, when the three blocks had to contain none.

    `sitemap.ts` adds the image key only when `getArticleImageSrc` returns something,
    so §57 asserting the absence proved that condition was real rather than
    incidental, and §58 asserts the presence for the same reason. Checked route by
    route rather than by whole-document count: three appearances anywhere would still
    pass if all three landed on one route and none on the others, and an image
    crawler handed a 404 — or, far likelier, a neighbouring place's picture indexed
    under Amberd's URL — is a failure nothing on the rendered page would reveal.
  */
  const amberdBlocks = xml.split("<url>").filter((block) => block.includes(`/places/${AMBERD}<`));
  expect(amberdBlocks, `${AMBERD} url blocks`).toHaveLength(LOCALES.length);
  for (const block of amberdBlocks) {
    expect(block, `${AMBERD} must emit an image:loc`).toContain("image:loc");
    expect(block, `${AMBERD} sitemap image`).toContain(`https://armat.site${ARTWORK[AMBERD]}`);
    for (const borrowed of [
      "tatev-monastery",
      "bagratid-armenia",
      "erebuni-fortress",
      "garni-temple",
    ]) {
      expect(block, `${borrowed} must not be indexed under ${AMBERD}`).not.toContain(borrowed);
    }
  }

  for (const slug of ILLUSTRATED) {
    // One image entry per locale route, so three per place.
    const url = `https://armat.site${ARTWORK[slug]}`;
    expect(xml.split(url).length - 1, `${slug} image entries`).toBe(LOCALES.length);
  }

  /*
    And each locale route carries its *own* file, checked block by block rather
    than only by whole-document count.

    The slugs that have left `PENDING_ARTWORK` most recently are pinned this way.
    The count above would still pass if all three of a slug's `image:loc` entries
    landed on one route and none on the others, and Dilijan is the case that matters
    now: §49 asserted its three url blocks contained no `image:loc` at all, so this
    is the exact inversion, and an image crawler handed a 404 or another article's
    picture is a failure nothing on the rendered page would show.
  */
  for (const slug of [SEVAN, GARNI, GEGHARD, TATEV, DILIJAN, GYUMRI] as const) {
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

  /*
    And Gyumri's three routes now each carry its own `image:loc` — §52's exact
    inversion of what §51 asserted here, when the three blocks had to contain none.

    `sitemap.ts` adds the image key only when `getArticleImageSrc` returns
    something, so §51 asserting the absence proved that condition was real rather
    than incidental, and §52 asserts the presence for the same reason. Checked block
    by block rather than by whole-document count: three appearances anywhere would
    still pass if all three landed on one route and none on the others, and an image
    crawler handed a 404 or a neighbouring article's picture is a failure nothing on
    the rendered page would show.
  */
  const gyumriBlocks = xml.split("<url>").filter((block) => block.includes(`/places/${GYUMRI}<`));
  expect(gyumriBlocks, `${GYUMRI} url blocks`).toHaveLength(LOCALES.length);
  for (const block of gyumriBlocks) {
    expect(block, `${GYUMRI} must emit an image:loc`).toContain("image:loc");
    expect(block, `${GYUMRI} sitemap image`).toContain(`https://armat.site${ARTWORK[GYUMRI]}`);
    for (const borrowed of ["bagratid-armenia", "avetik-isahakyan", "erebuni-fortress", "anush"]) {
      expect(block, `${borrowed} must not be indexed under ${GYUMRI}`).not.toContain(borrowed);
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
  section currently contains neither: the list is empty and all twelve places
  resolve, which is the state §60 restored.
*/
test("no place is waiting for artwork, and all thirteen resolve", () => {
  /*
    One slug — the state §64 restores for the twelfth time, and the exact inversion
    of what §60 asserted here when the list was empty.

    Asserting the whole array rather than a length check is deliberate: it fails on a
    stale entry left behind after a file lands, which is the half of the invariant no
    other test covers, and it equally fails on a slug quietly added here to silence
    the placeholder assertions above.

    `toEqual` on the array rather than a length check, so the failure message names
    whatever is actually in there. Derived from the two lists for the same reason
    the placeholder count above is: the place that ships ahead of its picture should
    change one line of data, not a literal in a test. That derivation is why this
    test needed no new literal in either direction — `PLACES` minus `ILLUSTRATED` is
    the expected array on its own, empty or not, and §60 is the eighth time it has
    been right without being edited.
  */
  /*
    Scoped to Places from §67, and the rescoping is a correction rather than a
    relaxation.

    `PENDING_ARTWORK` is archive-wide, not per-section. While every pending slug
    happened to be a Place the distinction cost nothing, so this compared the whole
    list against this section's shortfall — and §67 put `spas` on it, at which point
    the comparison started asserting something about Cuisine that this file has no
    business asserting. The claim that was always meant is the one below: no *Place*
    is waiting for a picture.
  */
  expect(
    [...PENDING_ARTWORK].filter((slug) => PLACES.includes(slug as never)).sort(),
  ).toEqual(
    PLACES.filter((slug) => !ILLUSTRATED.includes(slug as never))
      .map(String)
      .sort(),
  );
  expect(getImageSrc(DILIJAN), "Dilijan's artwork must still resolve").toBe(ARTWORK[DILIJAN]);
  expect(getImageSrc(GYUMRI), "Gyumri's artwork must still resolve").toBe(ARTWORK[GYUMRI]);
  expect(getImageSrc(AMBERD), "Amberd's artwork must still resolve").toBe(ARTWORK[AMBERD]);
  expect(getImageSrc(JERMUK), "Jermuk's artwork must now resolve").toBe(ARTWORK[JERMUK]);
  expect(getImageSrc(HAGHPAT), "Haghpat's artwork must now resolve").toBe(ARTWORK[HAGHPAT]);

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

  §69 is the first time this test failed, and it failed correctly. Registering
  `spas.webp` — a Cuisine cover, added by a step that touched no Place at all — is
  precisely the "something outside this section moved" event the snapshot exists to
  report. §71 did the same thing again with `jingalov-hats.webp`. Each time the
  expected object below gains one line and nothing else changes: every other value
  is byte-identical, which is the actual claim being carried forward.

  Updating the literal is the maintenance this shape asks for, not a relaxation of
  it. Deriving it from the registry instead would make it agree by construction and
  it would never fail again — including on the day a path is genuinely retyped.
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
    // §82 adds Narekatsi, and it is the first time this snapshot has gone red on a
    // *Writers* registration rather than a Cuisine one. Same treatment: extended
    // by one line, every other value byte-identical.
    "grigor-narekatsi": "/images/writers/grigor-narekatsi.webp",
    // §85 adds Varoujan, the second Writers registration to turn this snapshot
    // red and the first anywhere in the archive whose file was *replaced* before
    // it was registered — a first delivery was refused for readable generated
    // lettering and corrected in place. None of that is visible from here, which
    // is the point: the path is what this snapshot pins, and the path is new.
    // Extended by one line, every other value byte-identical.
    "daniel-varoujan": "/images/writers/daniel-varoujan.webp",
    // §87 adds Shnorhali, the third Writers registration to turn this snapshot
    // red and the one that closes the section: nine writers, nine portraits, and
    // `PENDING_ARTWORK` empty archive-wide for the first time since §85. He takes
    // the imagined-likeness default and is deliberately absent from
    // `PORTRAIT_PROVENANCE`, which this snapshot cannot see and `writers.spec.ts`
    // asserts. Extended by one line, every other value byte-identical.
    "nerses-shnorhali": "/images/writers/nerses-shnorhali.webp",
    // §89 adds Siamanto, the fourth Writers registration to turn this snapshot red
    // and the one that closes the section at ten: every writer in the archive now
    // has a portrait and `PENDING_ARTWORK` is empty again. He is the second slug in
    // `PORTRAIT_PROVENANCE`, taking `photo-referenced` on the strength of two
    // identified lifetime photographs — which this snapshot cannot see and
    // `writers.spec.ts` asserts. Extended by one line, every other value
    // byte-identical.
    siamanto: "/images/writers/siamanto.webp",
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
    spas: "/images/cuisine/spas.webp",
    "jingalov-hats": "/images/cuisine/jingalov-hats.webp",
    // §73 adds khash. This snapshot went red on the registration, which is what it
    // is for — a Cuisine cover landing is exactly the kind of change that should
    // not reach the Places half of the registry unnoticed. Added, not relaxed.
    khash: "/images/cuisine/khash.webp",
    // §75 adds matsun, on the same terms and for the fourth time in this section.
    matsun: "/images/cuisine/matsun.webp",
    // §78 adds basturma, the fifth. This snapshot has now gone red on every single
    // Cuisine registration and been extended rather than loosened each time, which
    // is the whole argument for spelling the registry out here instead of deriving
    // it: a derived list would agree with `IMAGES` on the day `IMAGES` is wrong.
    basturma: "/images/cuisine/basturma.webp",
    manti: "/images/cuisine/manti.webp",
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
    "tatev",
    "dilijan",
  ]) {
    await expect(page.locator(`img[src*="${fragment}"]`), fragment).toHaveCount(0);
  }
});

/* -------------------------------------------------------------------------- */
/*  SEO                                                                        */
/* -------------------------------------------------------------------------- */

test("the place article uses its own SEO fields and advertises every edition", async ({ page }) => {
  /*
    The third `LOCALES × PLACES` test to be declared slow, after the two in §42.
    Twenty-one navigations against a dev server that compiles routes on demand,
    and §43 added a whole new spec file competing for it — enough to push this
    one past the 30s global timeout in the full run while it still finishes in
    six seconds alone. The loop's size is the cost; saying so is the fix.
  */
  test.slow();

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

      §49 makes it two: a protected landscape of 33,765 hectares has no more of a
      single point than a lake does. The test is deliberately written as a set
      membership rather than as `slug === SEVAN || slug === DILIJAN`, so a third
      `area` place has to be added to a named list rather than to a boolean.

      §51 spends the third member of the union, which had been declared and unused
      since §30: Gyumri is a `settlement`. A city has neither a single built point
      nor a natural centroid — it has a conventional centre a gazetteer agrees on —
      and that is precisely the distinction the three-value union exists to carry.
      Written as two named lists rather than as a chain of `slug === …` comparisons,
      so a second town or a third centroid has to be added to a list.
    */
    const AREA = [SEVAN, DILIJAN] as readonly string[];
    const SETTLEMENT = [GYUMRI, JERMUK] as readonly string[];
    const expected = AREA.includes(slug) ? "area" : SETTLEMENT.includes(slug) ? "settlement" : "site";
    expect(point.precision, slug).toBe(expected);
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

  /*
    The park centroid, computed from the mapped protected-area outline rather than
    looked up — see `geo.ts` for the derivation and the cross-checks.

    Dilijan's wrong answers are unusually numerous and unusually findable, because
    almost everything named "Dilijan" is the town rather than the park. Each is
    excluded by distance below, and the thresholds are metres expressed in degrees:
    a degree of latitude here is about 111 km, and a degree of longitude about 84.
  */
  const park = registry[DILIJAN];
  expect(park.lat).toBeCloseTo(40.7417, 4);
  expect(park.lon).toBeCloseTo(44.9312, 4);

  /*
    Not Dilijan town centre, and this is the assertion the whole entry exists for.

    OSM's label point for the town is 40.7417126, 44.8722210, which rounds to the
    *same latitude* as the centroid — so a reader auditing the registry sees
    40.7417 twice and reasonably suspects a copy. The longitudes differ by 0.059°,
    about 5 km, and the town sits outside the park polygon entirely. Asserted on
    the full distance rather than on latitude alone precisely because latitude
    alone would pass a coordinate that really had been copied.
  */
  expect(
    Math.hypot(park.lat - 40.7417126, park.lon - 44.8722210),
    "the point should be the park centroid, not Dilijan town centre",
  ).toBeGreaterThan(0.03);

  // Not Parz Lake (about 40.7512, 44.9597), which is the park's most photographed
  // feature and only 2.6 km away — by far the closest of the wrong answers.
  expect(
    Math.hypot(park.lat - 40.7512, park.lon - 44.9597),
    "the point should be the park, not Parz Lake",
  ).toBeGreaterThan(0.02);

  // Not Haghartsin (about 40.8019, 44.8907) and not Goshavank (about 40.7298,
  // 44.9974) — the two monasteries a search for this park returns ahead of it, and
  // the two `geo.ts` names as excluded.
  expect(
    Math.hypot(park.lat - 40.8019, park.lon - 44.8907),
    "the point should be the park, not Haghartsin",
  ).toBeGreaterThan(0.05);
  expect(
    Math.hypot(park.lat - 40.7298, park.lon - 44.9974),
    "the point should be the park, not Goshavank",
  ).toBeGreaterThan(0.05);

  // And not the Wikidata point (40.65639, 45.02139), which is inside the park but
  // some twelve kilometres from its centre. It is the value a gazetteer lookup
  // returns, so adopting it would have looked like diligence.
  expect(
    Math.hypot(park.lat - 40.65639, park.lon - 45.02139),
    "the point should be the computed centroid, not the Wikidata gazetteer point",
  ).toBeGreaterThan(0.08);

  /*
    The castle on its spur above the Amberd and Arkashen gorges, from OSM relation
    15757106 — §57.

    Amberd is the entry with the largest number of *real* wrong answers carrying the
    same name, which is why each is excluded by distance rather than by inspection:
    a river, a village on the plain, a summit on the same massif, and the church two
    hundred metres away. A degree of latitude here is about 111 km and a degree of
    longitude about 85, so the thresholds below are metres expressed in degrees.
  */
  const amberd = registry[AMBERD];
  expect(amberd.lat).toBeCloseTo(40.3885, 4);
  expect(amberd.lon).toBeCloseTo(44.2263, 4);

  /*
    Not Vahramashen church (about 40.3877, 44.2285), 205 m east-south-east. This is
    the assertion the whole entry exists for: the church is the photographed
    building, it is the one with a date on it, and the article spends a section
    arguing that it is a component of the complex rather than the complex. A
    coordinate that drifted onto it would put a pin on a real Amberd monument and
    nothing else in this file would notice.
  */
  expect(
    Math.hypot(amberd.lat - 40.3877490, amberd.lon - 44.2285125),
    "the point should be the fortress, not Vahramashen church",
  ).toBeGreaterThan(0.002);

  /*
    Not the Amberd *river* (OSM relation 16475076, label point about 40.3866,
    44.2257), which is 0.2 km away and is what a gazetteer lookup for the bare word
    returns. The closest wrong answer in the whole registry, and a watercourse
    rather than a monument.
  */
  expect(
    Math.hypot(amberd.lat - 40.386620, amberd.lon - 44.225738),
    "the point should be the fortress, not the Amberd river",
  ).toBeGreaterThan(0.0015);

  // Not the peak named Amberd on the same massif (about 40.4512, 44.1754), 8 km
  // north-west, and not Amberd village on the Ararat plain (about 40.2422,
  // 44.2696), 17 km south-east in a different province.
  expect(
    Math.hypot(amberd.lat - 40.451179, amberd.lon - 44.175394),
    "the point should be the fortress, not the summit of the same name",
  ).toBeGreaterThan(0.05);
  expect(
    Math.hypot(amberd.lat - 40.242160, amberd.lon - 44.269644),
    "the point should be the fortress, not Amberd village in Armavir",
  ).toBeGreaterThan(0.1);

  // And not Byurakan (about 40.3387, 44.2689), the village every description gives
  // the fortress a bearing from.
  expect(
    Math.hypot(amberd.lat - 40.338713, amberd.lon - 44.268865),
    "the point should be the fortress, not Byurakan",
  ).toBeGreaterThan(0.05);

  /*
    The extremes of the registry, which are what stretch the map. Asserted here
    rather than only in the map spec because they are properties of the
    coordinates, not of Leaflet — and they are the reason the bounds tests over
    four viewport widths exist at all.

    §51 moved two of the three. Dilijan was the northernmost point for one step and
    Gyumri is north of it; Gyumri is also most of a degree west of every other
    marker, which was a genuinely new direction for this map. Tatev is still the
    southernmost, as it has been since §47.

    §57 moves none of them, and that is the property worth asserting rather than
    passing over. Amberd is the first place in four steps that does not stretch the
    box: it sits north of Etchmiadzin, east of Gyumri and well inside every edge, so
    the map's derived bounds must be identical before and after it. A test that only
    said "Gyumri is northernmost" would pass on a coordinate typed one degree wrong
    in the direction of an existing extreme; asserting that Amberd is at no extreme
    is the half that catches it.
  */
  const lats = PLACES.map((slug) => registry[slug].lat);
  const lons = PLACES.map((slug) => registry[slug].lon);
  /*
    §64 moves an extreme for the first time since §51. Haghpat is in Lori, further
    north than Gyumri, so the northern edge of the derived box is now the monastery
    rather than the city — the other three corners are unchanged. Recording which
    edge moved and which did not is the whole value of pinning all four.
  */
  expect(Math.max(...lats), "Haghpat is now the northernmost place").toBe(registry[HAGHPAT].lat);
  expect(Math.min(...lats), "Tatev is still the southernmost place").toBe(registry[TATEV].lat);
  expect(Math.min(...lons), "Gyumri is still the westernmost place").toBe(registry[GYUMRI].lon);
  expect(Math.max(...lons), "Tatev is still the easternmost place").toBe(registry[TATEV].lon);
  // Dilijan is no longer the northernmost, but it must still be north of everything
  // that is not Gyumri or Haghpat — a check that the §49 point was not disturbed by
  // §51, and now not by §64 either. The exclusion list grows as the north fills in;
  // what it protects is that Dilijan's own latitude never quietly drifts.
  expect(
    Math.max(
      ...PLACES.filter((slug) => slug !== GYUMRI && slug !== HAGHPAT).map(
        (slug) => registry[slug].lat,
      ),
    ),
    "Dilijan is still the northernmost of the others",
  ).toBe(park.lat);

  // §57: Amberd is at no extreme, in any direction, so the derived bounds are the
  // same box before and after it.
  expect(Math.max(...lats), "Amberd is not the northernmost place").not.toBe(amberd.lat);
  expect(Math.min(...lats), "Amberd is not the southernmost place").not.toBe(amberd.lat);
  expect(Math.min(...lons), "Amberd is not the westernmost place").not.toBe(amberd.lon);
  expect(Math.max(...lons), "Amberd is not the easternmost place").not.toBe(amberd.lon);

  /*
    The town of Jermuk, from OSM node 210212587 — §59.

    A `settlement` point, so the question it answers is not "where is the building"
    but "where does a gazetteer put this town", and the wrong answers here are of a
    different kind from Amberd's. Nothing else carries the name, so the traps are all
    *features inside or beside the town* that a search surfaces before the settlement
    itself: a waterfall, a municipal office, a spring, a reservoir. A degree of
    latitude here is about 111 km and a degree of longitude about 85.
  */
  const jermuk = registry[JERMUK];
  expect(jermuk.lat).toBeCloseTo(39.8388, 4);
  expect(jermuk.lon).toBeCloseTo(45.6713, 4);

  /*
    Not the Jermuk waterfall (OSM node 1970452502, about 39.8367, 45.6682), 353 m
    south-west. This is the assertion the entry exists for: the waterfall is the
    photographed thing, it is what an image search for "Jermuk" returns, and the
    article treats it as a feature of the gorge rather than as the settlement. A
    coordinate that drifted onto it would drop a pin on a real Jermuk landmark and
    nothing else in this file would notice.
  */
  expect(
    Math.hypot(jermuk.lat - 39.8366998, jermuk.lon - 45.6681832),
    "the point should be the town, not the waterfall",
  ).toBeGreaterThan(0.002);

  // Not the town hall (OSM node 10875092608, about 39.8369, 45.6666), 453 m west,
  // which would pin the administration rather than the settlement.
  expect(
    Math.hypot(jermuk.lat - 39.8368858, jermuk.lon - 45.666588),
    "the point should be the town, not the municipal office",
  ).toBeGreaterThan(0.003);

  /*
    And not either half of the confusion the article's first section exists to
    separate: Kechut village (about 39.8048, 45.6701) and the Kechut reservoir (about
    39.8015, 45.6595) are both inside the *Jermuk community* and neither is the town.
    Both are several kilometres south, which is a long way in a settlement two
    kilometres across.
  */
  expect(
    Math.hypot(jermuk.lat - 39.804847, jermuk.lon - 45.6701486),
    "the point should be the town, not Kechut village",
  ).toBeGreaterThan(0.02);
  expect(
    Math.hypot(jermuk.lat - 39.80153, jermuk.lon - 45.6594959),
    "the point should be the town, not the Kechut reservoir",
  ).toBeGreaterThan(0.02);

  // Not the mapped hot spring 3.8 km away (about 39.8173, 45.6364). One spring is
  // not a settlement, and this registry's question is where the town is.
  expect(
    Math.hypot(jermuk.lat - 39.81728, jermuk.lon - 45.63644),
    "the point should be the town, not a single spring",
  ).toBeGreaterThan(0.02);

  // And not the Wikidata point (39.85, 45.683333), 1.6 km north-east and carried at
  // two decimal places of latitude — coarser than this registry's own rounding,
  // which is why the OSM node was preferred rather than adjudicated against.
  expect(
    Math.hypot(jermuk.lat - 39.85, jermuk.lon - 45.683333),
    "the point should be the OSM settlement node, not the coarse gazetteer point",
  ).toBeGreaterThan(0.01);

  // §59: Jermuk is at no extreme either, so the derived bounds are again the same
  // box before and after — two additions in a row that change no edge.
  expect(Math.max(...lats), "Jermuk is not the northernmost place").not.toBe(jermuk.lat);
  expect(Math.min(...lats), "Jermuk is not the southernmost place").not.toBe(jermuk.lat);
  expect(Math.min(...lons), "Jermuk is not the westernmost place").not.toBe(jermuk.lon);
  expect(Math.max(...lons), "Jermuk is not the easternmost place").not.toBe(jermuk.lon);

  /*
    The monastic complex at Haghpat, from OSM way 186536991 — §64.

    Two independent registers agree closely: the OSM way tagged `amenity=monastery`
    computes to 41.093720 / 44.711774, and Wikidata Q2423898 gives 41.093716 /
    44.712073 for the same subject, about 25 m away. Rounding to four decimals moves
    the stored point roughly 3 m.

    `site`, because the subject is one walled complex a couple of hundred metres
    across. It is deliberately **not** the World Heritage property, which is serial
    and includes Sanahin four kilometres away: no single coordinate can represent
    two monasteries, and this registry stores the subject of the article rather than
    the subject of the designation.
  */
  const haghpat = registry[HAGHPAT];
  expect(haghpat, "Haghpat has a coordinate").toBeDefined();
  expect(haghpat.precision, "the complex is a site").toBe("site");
  expect(Math.hypot(haghpat.lat - 41.09372, haghpat.lon - 44.711774)).toBeLessThan(0.001);

  /*
    Not the village. This is the sharpest miss in the whole registry: Haghpat village
    adjoins the monastery, carries the same name, and sits about 101 m away, so a
    gazetteer lookup for "Haghpat" returns the settlement rather than the monument.
    The tolerance below is tight for exactly that reason.
  */
  expect(
    Math.hypot(haghpat.lat - 41.094419, haghpat.lon - 44.711056),
    "the point should be the monastery, not Haghpat village",
  ).toBeGreaterThan(0.0005);

  // Not Kayanberd, the fortress of 1233 built to watch the approaches and discussed
  // in this article, about 1.1 km west.
  expect(
    Math.hypot(haghpat.lat - 41.095124, haghpat.lon - 44.698809),
    "the point should be the monastery, not Kayanberd",
  ).toBeGreaterThan(0.008);

  // And emphatically not Sanahin, 3.9 km away, which shares this monastery's World
  // Heritage inscription and is the one substitution a reader could not catch.
  expect(
    Math.hypot(haghpat.lat - 41.087146, haghpat.lon - 44.666269),
    "the point should be Haghpat, not Sanahin",
  ).toBeGreaterThan(0.02);

  /*
    §64 is the first addition since §51 to move a derived bound: Haghpat is the
    northernmost place in the registry, so the map's framing grows northward rather
    than gaining a pin inside the existing box. Asserted, because §57 and §59 both
    asserted the opposite and a reader of this file should see which is which.
  */
  expect(Math.max(...lats), "Haghpat is the northernmost place").toBe(haghpat.lat);
  expect(Math.min(...lats), "Haghpat is not the southernmost place").not.toBe(haghpat.lat);
  expect(Math.min(...lons), "Haghpat is not the westernmost place").not.toBe(haghpat.lon);
  expect(Math.max(...lons), "Haghpat is not the easternmost place").not.toBe(haghpat.lon);
});

test("the thirteenth place is findable, and Lori is on the map at last", async ({ page }) => {
  /*
    §64. The queries that matter for this article are the province and the property,
    not only the name — Lori is the gap this article closes, and a reader who arrives
    from "World Heritage" should land here rather than nowhere.
  */
  const dict = ui("en");
  await page.goto("/en/search?q=Haghpat");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: dict.search.groupPlaces, level: 2 })).toBeVisible();
  await expect(main.locator(`a[href="/en/places/${HAGHPAT}"]`).first()).toBeVisible();

  for (const query of ["Lori", "Debed", "Surb Nshan"]) {
    await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.getByRole("main").locator(`a[href="/en/places/${HAGHPAT}"]`).first(),
      query,
    ).toBeVisible();
  }

  for (const locale of ["hy", "hyw"] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent("Հաղպատ")}`);
    await expect(
      page.getByRole("main").locator(`a[href="/${locale}/places/${HAGHPAT}"]`).first(),
      locale,
    ).toBeVisible();
  }
});

test("Haghpat renders its own artwork and says it is generated, in every edition", async ({
  page,
}) => {
  /*
    §66 inverts every assertion §64 wrote here, for the thirteenth time in this
    section — and this registration carries a risk none of the previous twelve did.

    The file is photographic. A reader skimming a page whose hero looks like a drone
    photograph of a real monastery is being shown something that makes a stronger
    claim than a painting does, and it is not a photograph: it is generated. So the
    caption assertion below matters more here than anywhere else in this file, and it
    is the AI-generated wording that is required — not merely "not a placeholder".

    All four states have to flip together: the inline `<svg>` gone, a raster present,
    the caption switched from placeholder wording to the AI disclosure, and the slug
    out of `PENDING_ARTWORK`. A registration that flipped three of the four would
    look finished on the page and lie in one of them.
  */
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/places/${HAGHPAT}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} ${HAGHPAT}`).toHaveCount(0);

    const hero = figure.locator("img");
    await expect(hero, `${locale} ${HAGHPAT}`).toHaveCount(1);
    await expect(hero, `${locale} ${HAGHPAT}`).toHaveAttribute("src", fileIn(ARTWORK[HAGHPAT]));
    await expect(hero, `${locale} ${HAGHPAT} alt`).toHaveAttribute(
      "alt",
      dict.article.imageAlt.replace("{title}", articleTitle(locale, HAGHPAT)),
    );

    // The AI disclosure, in this edition's own words — never the placeholder line.
    await expect(figure.locator("figcaption"), `${locale} ${HAGHPAT}`).toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, HAGHPAT)),
    );
    await expect(figure.locator("figcaption"), `${locale} ${HAGHPAT}`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, HAGHPAT)),
    );
  }

  expect(getImageSrc(HAGHPAT), "Haghpat has a registered file").toBe(ARTWORK[HAGHPAT]);
  expect(PENDING_ARTWORK, "and is no longer pending").not.toContain(HAGHPAT);
  expect(
    PENDING_ARTWORK.filter((slug) => PLACES.includes(slug as never)),
    "no place in this section is pending any more",
  ).toEqual([]);
});

test("Haghpat borrows no other monastery's artwork, on the page or in its metadata", async ({
  page,
}) => {
  /*
    The stronger half of §64, and the hardest borrowing case the section has had.

    `monastery` now holds five articles and four of them have covers. Every one of
    those four is a walled stone complex photographed from the air, and
    `tatev-monastery` in particular is a walled grey-stone complex on a promontory
    above a gorge — a description that fits Haghpat's shape exactly and Haghpat's
    identity not at all. A borrowed cover here would look completely finished.

    Scoped to the hero and the metadata rather than page-globally, because
    `getRelatedArticles` legitimately renders Geghard's and Tatev's covers further
    down: this article authors links to both.
  */
  await page.goto(`/en/places/${HAGHPAT}`);

  await expect(page.locator("header figure img"), "its own hero raster").toHaveCount(1);
  await expect(page.locator("header figure svg[role='img']"), "no placeholder").toHaveCount(0);

  const heroSources = (
    await page
      .locator("header img")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("src") ?? ""))
  ).map(decodeURIComponent);

  /*
    §66 keeps this exhaustive rather than replacing it with "the hero is Haghpat's
    file". Both claims are needed and they fail differently: the positive one
    catches an empty hero, and this one catches a hero that carries *two* files, or
    the right file beside a neighbour's. `monastery` holds five articles and four of
    the other covers are walled stone complexes seen from above, which is exactly
    the substitution a positive-only assertion would pass.
  */
  expect(
    heroSources.some((src) => src.includes("haghpat-monastery.webp")),
    "the hero is Haghpat's own file",
  ).toBe(true);

  for (const [slug, borrowed] of Object.entries(ARTWORK)) {
    if (slug === HAGHPAT) continue;
    expect(
      heroSources.some((src) => src.includes(borrowed)),
      `${borrowed} must not illustrate ${HAGHPAT}`,
    ).toBe(false);
  }
  expect(
    heroSources.some((src) => src.includes("/hero-ararat.png")),
    `the homepage hero must not illustrate ${HAGHPAT}`,
  ).toBe(false);

  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = (JSON.parse(raw ?? "") as { "@graph": { "@type"?: string; image?: unknown }[] })[
    "@graph"
  ];
  const article = graph.find((entry) => entry["@type"] === "Article");
  expect(article, "an Article node").toBeDefined();
  expect(
    JSON.stringify(article!.image),
    "Article.image is Haghpat's own file, not absent and not a neighbour's",
  ).toContain("haghpat-monastery.webp");

  // No schema type was invented for a World Heritage monastery, which is the §64
  // version of a temptation this file has resisted since §41.
  for (const speculative of [
    "Place",
    "TouristAttraction",
    "TouristDestination",
    "LandmarksOrHistoricalBuildings",
    "Church",
    "PlaceOfWorship",
    "Monastery",
    "GeoCoordinates",
    "LocalBusiness",
  ]) {
    expect(raw, `${speculative} must not be introduced`).not.toContain(`"${speculative}"`);
  }

  /*
    The transition §64 recorded as pending: both social tags fall back to
    `/og-default.png` while a slug has no artwork, and must carry the registered
    file once it does. Asserted as *not* the default as well as *is* the file,
    because a tag that carried both would satisfy a `toContain` alone.
  */
  for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(property).first().getAttribute("content");
    expect(content, property).toContain("haghpat-monastery.webp");
    expect(content, `${property} no longer falls back`).not.toContain("/og-default.png");
  }
});

test("Haghpat states the World Heritage property accurately, and never claims it alone", async ({
  page,
}) => {
  /*
    §64, and the single most likely factual error in this article.

    The property is serial: it contains Sanahin as well, and the correct name since
    2000 is "Monasteries of Haghpat and Sanahin". The tempting shorthand — that
    Haghpat is a World Heritage Site — is wrong now and was *right* between 1996 and
    2000, which is exactly the kind of staged history that gets flattened. The
    article has to hold both halves at once, and this asserts that it does.
  */
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/places/${HAGHPAT}`);
    const body = (await page.locator("main").innerText()).replace(/\s+/g, " ");

    // Both stages are present, in every edition.
    expect(body, `${locale} names the 1996 inscription`).toContain("1996");
    expect(body, `${locale} names the 2000 extension`).toContain("2000");
    // And Sanahin is named, so the property is never presented as this site alone.
    expect(body.toLowerCase(), `${locale} names Sanahin`).toMatch(/sanahin|սանահին/i);
  }

  // The English edition is checked for the wording itself rather than only the
  // numbers: the combined property has to be stated, not implied.
  await page.goto(`/en/places/${HAGHPAT}`);
  const en = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  expect(en, "the combined property is named").toContain("Monasteries of Haghpat and Sanahin");
  expect(en, "and the criteria are described rather than asserted as a slogan").toMatch(
    /criteri/i,
  );
});

test("Haghpat keeps its disputed dates disputed", async ({ page }) => {
  /*
    §64. Three of this article's dates are genuinely contested between the specialist
    survey and the UNESCO documentation — the start of Surb Nshan, the century of the
    gavit, and the date and the name of the book room. A later edit that "tidied" any
    of them into a single confident figure would be a fabrication that reads as an
    improvement, which is why the disagreement is pinned rather than the values.
  */
  await page.goto(`/en/places/${HAGHPAT}`);
  const body = (await page.locator("main").innerText()).replace(/\s+/g, " ");

  // Both candidate start dates survive, and so does the completion date that is firm.
  for (const year of ["966", "976", "991"]) {
    expect(body, `${year} must still appear`).toContain(year);
  }
  // Both candidate centuries for the gavit survive.
  expect(body, "the survey's fourteenth-century dating of the gavit").toContain("1310");

  // And the article says outright that it is not choosing.
  expect(body.toLowerCase(), "the disagreement is stated, not resolved").toMatch(
    /does not choose|disagree|not settled|unsettled/,
  );
});

test("Haghpat is an educational article, not a visit guide", async ({ page }) => {
  /*
    §64. The standing restraint, checked for this article because a World Heritage
    monastery is the single most likely subject in the section to attract opening
    hours and a suggested itinerary.
  */
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/places/${HAGHPAT}`);
    const body = (await page.locator("main").innerText()).toLowerCase();
    for (const forbidden of [
      "opening hours",
      "ticket",
      "entrance fee",
      "book your",
      "best time to visit",
      "how to get there",
      "tour operator",
      "dress code",
    ]) {
      expect(body, `${locale} must not read as a guide: ${forbidden}`).not.toContain(forbidden);
    }
  }
});

test("one work carries one identifier across the whole bibliography", () => {
  /*
    §63, and the companion to the test below rather than a duplicate of it.

    That one is scoped *within* one article, because two identically titled
    citations only collide as React keys in a single rendered list. This one is
    scoped across the registry, because the failure it catches is invisible inside
    any single article: the same book entered twice, by two different steps, under
    two different identifiers.

    That is what the §62 audit found. Sanjian's *Colophons of Armenian Manuscripts*
    was registered under `isbn:9780674142855` in the Matenadaran and
    `doi:10.4159/harvard.9780674432635` in Geghard, the two titles differing only
    by an en dash against a hyphen. Both identifiers are real and both resolve to
    the same 1969 Harvard volume, so nothing false was asserted and every existing
    check passed — the bibliography simply cited one book two ways.

    The convention this pins is the one the registry already follows everywhere
    else: a shared source repeats as an identical `Source` object in each article's
    array — same author, title, publisher, year and identifier — and varies only in
    `note`. Hewsen's atlas is the model, identical across seven articles.

    `validate:content` now enforces this statically, which is where it belongs and
    is the cheaper of the two. This is kept as well because it is the assertion a
    reader of this file is looking for when they add a source that already exists.
  */
  const registry = getSourceRegistry();

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[‐-―−]/g, "-")
      .replace(/[.,:;]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const identifiersByWork = new Map<string, Map<string, string[]>>();
  for (const [slug, sources] of Object.entries(registry)) {
    for (const source of sources) {
      const work = `${normalize(source.author ?? "")} | ${normalize(source.title)}`;
      const key = `${source.identifier.kind}:${source.identifier.value}`;
      const ids = identifiersByWork.get(work) ?? new Map<string, string[]>();
      ids.set(key, [...(ids.get(key) ?? []), slug]);
      identifiersByWork.set(work, ids);
    }
  }

  for (const [work, ids] of identifiersByWork) {
    expect(
      [...ids.keys()],
      `${work.split(" | ")[1]} is registered under ${ids.size} identifiers`,
    ).toHaveLength(1);
  }
});

test("the Sanjian colophons volume is one record, cited by two articles", () => {
  /*
    §63 pins the specific reconciliation, because the general check above would
    also pass if the duplicate were resolved by deleting one article's citation
    instead of by making the two agree. Both articles genuinely use the work and
    both must keep it.

    The claims each supports are different and both survive: the Matenadaran cites
    it for what a hishatakaran records, Geghard for the documentary evidence that
    manuscripts were actually copied there — Ayrivank indexed at 1444, 1447, 1452,
    1459 and 1476. That is why the notes differ and the bibliographic fields do
    not.
  */
  const registry = getSourceRegistry();
  const copies = Object.entries(registry).flatMap(([slug, sources]) =>
    sources.filter((source) => /colophons of armenian manuscripts/i.test(source.title)).map((source) => ({ slug, source })),
  );

  expect(copies.map((c) => c.slug).sort(), "cited by exactly these two articles").toEqual([
    "geghard-monastery",
    "matenadaran",
  ]);

  for (const { slug, source } of copies) {
    expect(source.author, slug).toBe("Avedis K. Sanjian");
    expect(source.title, slug).toBe(
      "Colophons of Armenian Manuscripts, 1301–1480: A Source for Middle Eastern History",
    );
    expect(source.publisher, slug).toBe("Harvard University Press, Harvard Armenian Texts and Studies 2");
    expect(source.year, slug).toBe("1969");
    expect(source.identifier, slug).toEqual({ kind: "isbn", value: "9780674142855" });
    // The DOI is not lost — it is recorded in the note, which is the only field
    // the schema leaves free and the only one that may differ between copies.
    expect(source.note, slug).toContain("10.4159/harvard.9780674432635");
  }

  // And the two notes still say different things, because they support different
  // claims. Collapsing them would be the other way to get this wrong.
  expect(copies[0].source.note).not.toBe(copies[1].source.note);
});

test("Lake Sevan and Jermuk point at each other, and nothing else gained a link", () => {
  /*
    §63. The one reciprocal relationship the §62 audit judged earned, added in
    both directions and in all three editions.

    The basis is prose that already existed on both sides before this step. Lake
    Sevan's "Bringing the water back" section describes the Arpa-Sevan tunnel
    driven under the Vardenis range, in operation 1981; Jermuk's gorge section
    describes Kechut, immediately below the town, as the intake of that same
    tunnel and carries the only SectionLink in the article. Two articles already
    describing the same structure from opposite ends is what an earned
    relationship looks like, and it was the only pair in the section that met it.

    `lake-sevan -> dilijan-national-park` was evaluated at the same time and
    **refused**. Dilijan links to Sevan legitimately — its own prose has the
    Areguni range falling towards the lake — but Lake Sevan's article names the
    Areguni only once, in a list of the three ranges that close the basin, and
    never mentions Dilijan, the national park or the forest at all. A shared
    boundary named in passing is not a relationship, and adding it would have made
    this a reciprocity policy rather than an editorial judgement.

    The second assertion is the one that keeps this step honest: every other
    article's `relatedSlugs` is unchanged, so this is two edges and not a sweep.
  */
  const EXPECTED_RELATIONS: Record<string, readonly string[]> = {
    [SLUG]: ["adoption-of-christianity", "tigran-the-great"],
    [ETCHMIADZIN]: ["adoption-of-christianity", "khor-virap", "battle-of-avarayr"],
    [EREBUNI]: ["kingdom-of-urartu"],
    [MATENADARAN]: ["mesrop-mashtots-armenian-alphabet", "etchmiadzin-cathedral", "adoption-of-christianity"],
    [SEVAN]: ["kingdom-of-urartu", "bagratid-armenia", "jermuk"],
    [GARNI]: ["adoption-of-christianity", "tigran-the-great", "erebuni-fortress"],
    [GEGHARD]: ["garni-temple", "adoption-of-christianity", "etchmiadzin-cathedral"],
    [TATEV]: ["geghard-monastery", "matenadaran", "bagratid-armenia"],
    [DILIJAN]: ["lake-sevan"],
    [GYUMRI]: ["avetik-isahakyan", "anush", "first-republic-of-armenia"],
    [AMBERD]: ["bagratid-armenia"],
    [JERMUK]: ["lake-sevan"],
  };

  for (const locale of LOCALES) {
    const articles = bundle(locale).articles;
    for (const [slug, expected] of Object.entries(EXPECTED_RELATIONS)) {
      const article = articles.find((candidate) => candidate.slug === slug);
      expect(article, `${locale} ${slug}`).toBeDefined();
      // Order is asserted, not just membership: the authored order is the render
      // order, and a reciprocal edge appended in one edition and prepended in
      // another would be a silent divergence.
      expect(article!.relatedSlugs, `${locale} ${slug}`).toEqual(expected);
    }
  }

  // Dilijan's link to Sevan stays one-way, which is the refusal above stated as
  // an assertion rather than only as a comment.
  for (const locale of LOCALES) {
    const sevan = bundle(locale).articles.find((a) => a.slug === SEVAN)!;
    expect(sevan.relatedSlugs, `${locale} must not gain Dilijan`).not.toContain(DILIJAN);
  }
});

test("no article's bibliography lists two sources under one title", () => {
  /*
    A regression found by rendering rather than by reading, and worth pinning
    across the whole archive rather than only for this section.

    `ArticleLayout` renders the bibliography with `key={source.title}`, so two
    citations sharing a title collide as React keys — which is how §49 discovered
    that its own NABU page and its own Wikipedia entry were both plainly titled
    "Dilijan National Park". React logs a console warning and may drop or duplicate
    a list item; nothing about the rendered page announces which. Two identically
    titled citations one above the other are a reader-facing problem in their own
    right, and the fix was to disambiguate the title rather than to change the key,
    because a content step does not touch the component.

    Scoped per article, not globally: the same work legitimately appears in several
    bibliographies — Hewsen is cited five times over — and only a collision *within
    one rendered list* is a fault.
  */
  const registry = getSourceRegistry();

  for (const [slug, sources] of Object.entries(registry)) {
    const titles = sources.map((source) => source.title);
    expect(
      new Set(titles).size,
      `${slug} lists ${titles.length} sources under ${new Set(titles).size} distinct titles`,
    ).toBe(titles.length);
  }
});

test("exactly two places are settlements, and they are Gyumri and Jermuk", () => {
  /*
    The §49 assertion, inverted rather than deleted — which is the point.

    Through §50 this test said the opposite: `settlement` was a legal value in the
    `precision` union used by no entry, and no Places article was filed under a
    `settlement` type because no such type existed. Both halves were documented
    technical debt carried since §30, and Dilijan was the article where filing one
    would have been *tempting* and wrong: the town runs through that article's
    prose, the boundary is drawn around it, and a `settlement` coordinate would have
    compiled, validated and dropped a plausible pin on a town the article is not
    about.

    §51 is the article that earns it, and the debt is spent rather than deleted. So
    the two halves are asserted positively and exclusively: the coordinates carrying
    `settlement` precision and the articles carrying the `settlement` type are the
    same set, in all three editions. Deleting this test would have removed the guard
    that the id stays deliberate.

    §59 makes the set a pair, and the pairing is the sharper version of the same
    guard: a `settlement` coordinate and a `settlement` type could now be given to
    two different places without either count changing. Both halves are therefore
    asserted as the same sorted array rather than as a length.
  */
  const registry = getPlaceCoordinateRegistry();

  const EXPECTED_SETTLEMENTS = [GYUMRI, JERMUK].sort();

  const settlements = Object.entries(registry)
    .filter(([, point]) => point.precision === "settlement")
    .map(([slug]) => slug)
    .sort();
  expect(settlements, "the settlement coordinates").toEqual(EXPECTED_SETTLEMENTS);

  for (const locale of LOCALES) {
    const filed = bundle(locale)
      .articles.filter((a) => a.category === "places" && a.placeTypeId === "settlement")
      .map((a) => a.slug)
      .sort();
    expect(filed, `${locale}: the places filed as settlements`).toEqual(EXPECTED_SETTLEMENTS);
  }

  /*
    And the point is the city, not a monument inside it. Every one of these is a
    real, findable Gyumri coordinate that a search would surface ahead of the
    settlement point, and every one is excluded by name in `geo.ts`. The Black
    Fortress is the sharpest: it is on the high ground above the town, it is what
    "Gyumri" returns in image search, and the article deliberately keeps it in its
    own paragraph as a Russian military work rather than as the city.
  */
  const city = registry[GYUMRI];
  expect(city.lat).toBeCloseTo(40.7852, 4);
  expect(city.lon).toBeCloseTo(43.8416, 4);
  /*
    Approximate positions, and the margins differ a great deal: the fortress and the
    airport are kilometres off, while Vartanants Square is only some hundreds of
    metres away — which is exactly why it is the wrong answer that would never have
    looked wrong. A square is a square; the point stored here is the city.
  */
  for (const [name, lat, lon] of [
    ["the Black Fortress", 40.7972, 43.8206],
    ["Vartanants Square", 40.7889, 43.8475],
    ["Shirak airport", 40.7504, 43.8593],
  ] as const) {
    expect(
      Math.hypot(city.lat - lat, city.lon - lon),
      `the point should be the city, not ${name}`,
    ).toBeGreaterThan(0.004);
  }

  /*
    And it is not simply a copy of either cross-check. GeoNames 616635 puts Gyumri
    at 40.7930545, 43.8463497 and Wikidata Q199500 at 40.78333, 43.83333; both were
    read, both corroborate at city scale, and neither was adopted. Asserting the
    difference is what shows the stored value came from the OSM settlement node
    rather than from whichever gazetteer was open at the time.
  */
  expect(city.lat).not.toBeCloseTo(40.7931, 4);
  expect(city.lon).not.toBeCloseTo(43.8333, 4);
});

test("the settlement article stays educational and dates its statistics", () => {
  /*
    §51's editorial guards, in one test and deliberately narrow.

    A city is the one subject in this archive that a search engine, a reader and a
    future editor will all try to turn into a destination page, and the failure is
    not a crash: it is an article that still validates while becoming "things to do
    in Gyumri". The SEO surfaces are where that drift starts, so they are what is
    checked.

    The population half is the other decay this article is exposed to. A bare figure
    reads as a permanent property of a place and would still be sitting there a
    decade after it stopped being true, so wherever the number appears it appears
    with the year of the count that produced it. Checked in every edition, because
    the numeral-parity harness would pass three editions that all state the figure
    and only one of which dates it.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === GYUMRI);
    expect(article, `${locale} ${GYUMRI}`).toBeDefined();

    const seoSurfaces = [
      article!.title,
      article!.seoTitle ?? "",
      article!.metaDescription ?? "",
      article!.excerpt,
    ]
      .join(" ")
      .toLowerCase();

    // English travel-guide vocabulary, checked in every edition: these are the
    // queries a future Travel Guide may target, and this article must not compete
    // for them. The Armenian editions carry Latin keywords too, so the check is
    // meaningful in all three.
    for (const phrase of ["things to do", "where to stay", "restaurants", "hotels", "itinerary"]) {
      expect(seoSurfaces, `${locale}: "${phrase}" belongs to a Travel Guide`).not.toContain(phrase);
    }

    // And the headline is the city's name, not one of the labels the closing
    // section exists to explain.
    expect(article!.title.length, `${locale} title is the city's name`).toBeLessThan(20);

    /*
      Every passage stating the census figure states its year in the same passage.
      `112 301` is spaced rather than comma-grouped on purpose — a comma splits the
      numeral for the parity harness — so the whole spaced form is what is matched.
    */
    const passages = [
      article!.intro,
      article!.summary ?? "",
      article!.excerpt,
      article!.metaDescription ?? "",
      ...article!.keyFacts.map((fact) => fact.value),
      ...article!.sections.flatMap((section) => section.paragraphs),
      ...article!.importantDates.map((entry) => `${entry.year} ${entry.event}`),
      ...article!.interestingFacts,
    ];
    const withFigure = passages.filter((text) => text.includes("112 301"));
    expect(withFigure.length, `${locale} states the census figure`).toBeGreaterThan(0);
    for (const text of withFigure) {
      expect(text, `${locale}: the census figure must carry its year`).toContain("2022");
    }

    // The UNESCO element is named by its file number wherever it is discussed, which
    // is what keeps "UNESCO" from becoming a loose adjective for the city.
    expect(passages.join(" "), `${locale} names the inscribed element`).toContain("01967");
  }
});

test("no edition says the city itself is a World Heritage property", async ({ page }) => {
  /*
    The §51 distinction, asserted against the rendered page rather than the data.

    An element on the Representative List of the Intangible Cultural Heritage of
    Humanity is not a World Heritage property, and a city with a UNESCO-recognised
    craft is exactly where the two collapse into each other. Checked on the page
    because that is where a reader meets it, and in every edition because a
    qualifying clause is the first thing a translation drops.

    Written as a proximity check rather than a phrase table: what must never appear
    is the city's own name and the World Heritage wording in the same sentence.
  */
  const heritage: Record<string, string> = {
    en: "World Heritage",
    hy: "Համաշխարհային ժառանգության",
    hyw: "Համաշխարհային ժառանգութեան",
  };

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/places/${GYUMRI}`);
    const prose = (await page.getByRole("main").innerText()).replace(/\s+/g, " ");
    const title = articleTitle(locale, GYUMRI);

    for (const sentence of prose.split(/(?<=[.。։])\s+/)) {
      if (!sentence.includes(heritage[locale])) continue;
      // A sentence may mention World Heritage — the article says plainly that the
      // city is *not* one — but it must also carry a negation. The bare pairing is
      // the failure.
      const asserts = sentence.includes(title) && !/not|չէ|ոչ/.test(sentence);
      expect(asserts, `${locale}: "${sentence}" reads as a World Heritage claim`).toBe(false);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  Existing categories are unaffected                                         */
/* -------------------------------------------------------------------------- */

test("every place's editorial fields are pinned, including the twelfth", () => {
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
    // §63 appended `jermuk`, the section's first reciprocal edge — Sevan and
    // Jermuk describe the two ends of the Arpa-Sevan tunnel.
    [SEVAN]: {
      type: "nature",
      featured: false,
      related: ["kingdom-of-urartu", "bagratid-armenia", "jermuk"],
    },
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
    [TATEV]: {
      type: "monastery",
      featured: false,
      related: ["geghard-monastery", "matenadaran", "bagratid-armenia"],
    },
    /*
      §49. One related slug, and it is the only relationship the prose earns.

      Dilijan's `ridges-and-rivers` section links to Lake Sevan because the Areguni
      range is the watershed between the two — the article's own argument is that
      the two protected landscapes are neighbours across a ridge and ecologically
      opposite. Nothing else in the archive is about Tavush, forests or the
      north-east, so nothing else was added.

      Deliberately *not* here: Haghartsin and Goshavank. Both are named in the
      article's prose and neither has an article, and `validate:content` would fail
      the build on a slug that does not resolve — which is the mechanism that keeps
      a plausible-looking future slug from shipping as a dead recommendation.
    */
    [DILIJAN]: { type: "nature", featured: false, related: ["lake-sevan"] },
    /*
      §51. The first `settlement`, and three related slugs — the most any place in
      this section carries, and each one earned by a named passage rather than by
      subject-matter adjacency.

      `avetik-isahakyan` and `anush` are both linked contextually from the closing
      section, which names Isahakyan as born and raised here and the 1912 première
      of Tigranian's opera in this city; the writers and works articles already
      say the same thing from their own side, so the relationship existed in the
      corpus before this article did. `first-republic-of-armenia` is earned by the
      1920 paragraph — the capture of the city, the treaty that carries its name,
      and the university that opened here before moving to Yerevan.

      Deliberately *not* here, and each is the kind of link that would look
      reasonable and mean nothing: Dilijan, on the grounds that both are northern
      towns; Lake Sevan, on the grounds that both are destinations; any monastery,
      on the grounds that tours combine them. None of those relationships is
      asserted anywhere in this article's prose.

      Also deliberately absent: slugs for Amenaprkich, Yot Verk, the Black Fortress
      and the Kumayri reserve. All four are named in the article and none is an
      article, and `validate:content` fails the build on a slug that does not
      resolve — which is the mechanism that keeps a plausible-looking future slug
      from shipping as a dead recommendation.
    */
    [GYUMRI]: {
      type: "settlement",
      featured: false,
      related: ["avetik-isahakyan", "anush", "first-republic-of-armenia"],
    },
    /*
      §57. One related slug, and it is the only relationship this article's prose
      earns.

      `pahlavuni-amberd` links to `bagratid-armenia` because the Pahlavunis rose
      with that kingdom, held the office of sparapet at its court, and the fortress
      is a Bagratid-era stronghold; the article's military section then hangs on the
      annexation of Ani in 1045 and the fall of the city in 1064, both of which that
      article covers. The link is contextual and one-directional, like every other
      in this section.

      Deliberately *not* here, and each is the kind of link that would look
      reasonable and mean nothing: Erebuni and Garni, on the grounds that all three
      share the `historical` pill — the archive does not link articles because a
      filter groups them; Gyumri, on the grounds that both are north-west of Yerevan
      — proximity is not a relationship; Tatev or Geghard, on the grounds that a tour
      would combine them.

      Also deliberately absent: slugs for Vahramashen, Mount Aragats, Ani, Marmashen
      and the Kamsarakans. All five are named in the article and none is an article,
      and `validate:content` fails the build on a slug that does not resolve — which
      is the mechanism that keeps a plausible-looking future slug from shipping as a
      dead recommendation.
    */
    [AMBERD]: { type: "historical", featured: false, related: ["bagratid-armenia"] },
    /*
      §59. One related slug, and it is the only relationship this article's prose
      earns.

      `the-arpa-the-gorge-and-the-waterfall` links to `lake-sevan` because the
      Kechut reservoir immediately below Jermuk is the *intake* of the Arpa–Sevan
      tunnel: a whole paragraph of this article is about water leaving the upper Arpa
      basin altogether and travelling under the Vardenis range into the lake, and the
      Lake Sevan article has carried the other end of that tunnel since §37. The
      relationship exists in the corpus in both directions and is asserted here in
      one, like every other link in this section.

      Deliberately *not* here, and each is the kind of link that would look
      reasonable and mean nothing: Gyumri, on the grounds that both are filed as
      `settlement` — the archive does not link articles because a filter groups them,
      and this step's brief named that trap by name; Tatev, on the grounds that both
      are in the south; Dilijan, on the grounds that both towns have a history as
      spas, which is a resemblance between two subjects rather than a passage in
      either article.

      Also deliberately absent: slugs for Vayots Dzor, the Arpa, Amulsar, Kechut and
      Stepanos Orbelian. All five are named in the article and none is an article,
      and `validate:content` fails the build on a slug that does not resolve — which
      is the mechanism that keeps a plausible-looking future slug from shipping as a
      dead recommendation.
    */
    [JERMUK]: { type: "settlement", featured: false, related: ["lake-sevan"] },
    // §64. Three authored relations, which is the most any place has carried since
    // §51 and is deliberate: the audit at twelve places found five articles taking
    // generic filler, and the fix for a *new* article is to earn its own row rather
    // than to change the fallback.
    [HAGHPAT]: {
      type: "monastery",
      featured: false,
      related: ["bagratid-armenia", "geghard-monastery", "tatev-monastery"],
    },
    /*
      Keyed on `PLACES` rather than `ILLUSTRATED` from §47 onward.

      The two lists were identical when this map was written, so either would have
      compiled; they are not identical now, and the distinction matters. What this
      test pins — type, featured flag and related slugs — has nothing to do with
      whether a picture exists, so a place written ahead of its artwork must still
      be covered. Keying on the artwork list would have silently exempted exactly
      the article most likely to be edited next.
    */
  } as const satisfies Record<(typeof PLACES)[number], unknown>;

  for (const slug of PLACES) {
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

      // No article points at itself, in any edition. This half held before §47 and
      // still holds.
      expect(article!.relatedSlugs, `${locale} ${slug} must not link to itself`).not.toContain(
        slug,
      );

      /*
        Geghard points *out* at Garni, and through §42 nothing pointed back at
        Geghard — the one-directional architecture this repository has deliberately
        not changed.

        §47 is the first deliberate exception, and it is narrowed rather than
        dropped. Tatev links to Geghard because the Geghard article already names
        Tatev — "not in the class of Gladzor or Tatev" — so the connection is one
        the archive asserted before this article existed.

        §64 is the second, and it is earned on different ground: Haghpat links to
        Geghard through the World Heritage chronology, which its own conservation
        section has to set out anyway. Armenia has three properties, Haghpat and
        Sanahin were the first inscribed and Geghard the second, and the two articles
        describe the same list from opposite ends. It is emphatically *not* licensed
        by both being monasteries — that is the reasoning this guard exists to
        refuse, and every place other than these two must still not link to Geghard.
      */
      if (slug !== TATEV && slug !== HAGHPAT) {
        expect(article!.relatedSlugs, `${locale} ${slug} must not link to Geghard`).not.toContain(
          GEGHARD,
        );
      }

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

test("Amberd claims no international designation it does not have", async ({ page }) => {
  /*
    §57's heritage-precision guard, and the exact counterpart of the §51 test above
    it for Gyumri — with one difference that makes it a stronger claim rather than a
    copy.

    Gyumri really does have a UNESCO relationship (an intangible-heritage element),
    so that test polices a *distinction*. Amberd has none at all: it is not a World
    Heritage property, it is not on Armenia's tentative list, and it was shortlisted
    for Europa Nostra's 7 Most Endangered programme in 2024 and not selected. Every
    one of those is a claim that circulates about the site in the opposite form, and
    the last is the one a good deal of the press got wrong.

    Checked on the rendered page, because that is where a reader meets it, and in
    every edition because a qualifying clause is the first thing a translation drops.
  */
  const heritage: Record<string, string> = {
    en: "World Heritage",
    hy: "Համաշխարհային ժառանգության",
    hyw: "Համաշխարհային ժառանգութեան",
  };
  const negation: Record<string, RegExp> = {
    en: /\bnot\b|\bneither\b|\bnone\b|does not/,
    hy: /չ|ոչ/,
    hyw: /չ|ոչ/,
  };

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/places/${AMBERD}`);
    const prose = (await page.getByRole("main").innerText()).replace(/\s+/g, " ");
    const title = articleTitle(locale, AMBERD);

    for (const sentence of prose.split(/(?<=[.。։])\s+/)) {
      if (!sentence.includes(heritage[locale])) continue;
      // A sentence may mention World Heritage — the article says plainly that
      // Amberd is not one — but it must carry a negation alongside the name.
      const asserts = sentence.includes(title) && !negation[locale].test(sentence);
      expect(asserts, `${locale}: "${sentence}" reads as a World Heritage claim`).toBe(false);
    }
  }

  /*
    And the shortlist is never stated as a selection, in any editorial field of any
    edition. This is a data assertion rather than a rendered one because the phrase
    would be just as wrong in a meta description as in a paragraph, and the SEO
    fields are where a summary gets compressed until the qualification falls out.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((entry) => entry.slug === AMBERD)!;
    const fields = [
      article.title,
      article.seoTitle ?? "",
      article.metaDescription ?? "",
      article.excerpt,
      article.summary ?? "",
      article.intro,
      ...article.keyFacts.map((fact) => fact.value),
      ...article.sections.flatMap((section) => section.paragraphs),
      ...article.importantDates.map((entry) => entry.event),
      ...article.interestingFacts,
      ...article.significance.paragraphs,
    ];

    // The site's own status is stated somewhere, and it is the national one.
    const all = fields.join(" ");
    expect(all, `${locale} names the shortlist`).toMatch(/2024/);
    expect(all, `${locale} names the reserve`).toMatch(/45\.07/);

    // And no field claims UNESCO for this site in any edition.
    for (const field of fields) {
      expect(field, `${locale}: UNESCO must not be claimed for Amberd`).not.toMatch(
        /UNESCO|ՅՈՒՆԵՍԿՕ|ՅՈՒՆԵՍԿՈ|ԵՈՒՆԵՍՔՕ/,
      );
    }
  }
});

test("the four existing category listings still load and still count what they did", async ({
  page,
}) => {
  const dict = ui("en");
  const expected: [string, number, string][] = [
    ["history", 7, dict.listing.history.title],
    // §81 moves Writers 6 → 7 with Grigor Narekatsi, §84 moves it 7 → 8 with
    // Daniel Varoujan, §86 moves it 8 → 9 with Nerses Shnorhali and §88 moves it
    // 9 → 10 with Siamanto. Edited rather than derived on purpose: this test exists
    // to notice when another section grows, and it has now done so four times,
    // going red first on each.
    ["writers", 10, dict.listing.writers.title],
    ["works", 4, dict.listing.works.title],
    // §67 moves Cuisine 6 → 7 with Spas, §70 moves it 7 → 8 with jingalov hats,
    // §72 moves it 8 → 9 with khash, §74 moves it 9 → 10 with matsun, §77 moves it
    // 10 → 11 with basturma and §79 moves it 11 → 12 with manti. Edited rather than
    // derived on purpose: this test's whole job is to notice when another section's
    // count changes, and it has now done so six times, going red first on every one
    // of them.
    ["cuisine", 12, dict.listing.cuisine.title],
  ];

  for (const [path, count, heading] of expected) {
    const response = await page.goto(`/en/${path}`);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    await expect(cards(page), `${path} card count`).toHaveCount(count);
  }
});
