import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { LOCALE_META } from "@/data/types";
import { PENDING_ARTWORK, getImageSrc } from "@/lib/media";
import { LOCALES, bundle, cards, ui } from "./helpers";

/**
 * The Visit journey — the archive's second entry point.
 *
 * `/visit` owns no content. Every card on it is resolved from the article
 * registry at render time, so the failures worth testing are not "is the copy
 * right?" but "did the curation resolve to the *right article*, with its *own*
 * picture, on a route that still exists?". A page that silently dropped a card,
 * or pointed one at a neighbour's image, or minted a `/visit/<slug>` duplicate
 * of a canonical route, would look completely finished.
 *
 * The three arrays below are copied from `visit/page.tsx` on purpose rather than
 * imported from it. Importing them would make the test agree with whatever the
 * page currently says; writing them out is what makes a change to the curation
 * a decision someone has to take twice.
 */

const FEATURED_PLACES = [
  "garni-temple",
  "geghard-monastery",
  "lake-sevan",
  "khor-virap",
  "matenadaran",
  "erebuni-fortress",
] as const;

const FEATURED_DISHES = ["lavash", "dolma", "khorovats", "gata"] as const;

const LEARN_ARTICLES = [
  "adoption-of-christianity",
  "kingdom-of-urartu",
  "mesrop-mashtots-armenian-alphabet",
  "tigran-the-great",
] as const;

/** The four place types the journey offers, minus `all`. Ids, not labels. */
const PLACE_TYPES = ["monastery", "historical", "museum", "nature"] as const;

/** Etchmiadzin is the deliberate omission — reachable only through the CTA. */
const NOT_FEATURED = "etchmiadzin-cathedral";

/**
 * The places that exist, are on the map, and are deliberately *not* in the row.
 *
 * Etchmiadzin above was the first, and it stood alone while the row held six of
 * seven. It no longer does: Tatev (§47) and Dilijan (§49) both shipped straight
 * into the map without being curated, so the gap between "on the map" and "in
 * the row" is now three articles wide rather than one.
 *
 * That gap is the invariant, not an oversight to be closed. The map answers
 * *where can I already read about something* and grows with the section; the row
 * is an editorial selection and grows when someone decides it should. Naming the
 * excluded slugs explicitly is what keeps a later step from quietly appending the
 * newest place to the row because the number looked untidy.
 */
const NOT_CURATED = [NOT_FEATURED, "tatev-monastery", "dilijan-national-park"] as const;

const ORIGIN = "https://armat.site";

/**
 * Matches a registered file inside a rendered `src`. Next's optimizer rewrites
 * `src` into `/_next/image?url=%2Fimages%2F…`, so the bare filename is what
 * survives intact. The dot is escaped because `.webp` would match `Xwebp`.
 */
const fileIn = (path: string) => new RegExp(path.split("/").pop()!.replace(".", "\\."));

const visitCopy = (locale: (typeof LOCALES)[number]) => bundle(locale).pages.visit;

/* -------------------------------------------------------------------------- */
/*  The page renders, in every edition                                         */
/* -------------------------------------------------------------------------- */

for (const locale of LOCALES) {
  test(`[${locale}] the visit hub renders with one localized H1`, async ({ page }) => {
    const copy = visitCopy(locale);

    const response = await page.goto(`/${locale}/visit`);
    expect(response?.status(), `${locale}/visit`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", LOCALE_META[locale].htmlLang);

    // Exactly one H1, and it is the short heading rather than the SEO title.
    // Rendering the title as the H1 is the easy mistake here and would be
    // invisible to every other assertion in this file.
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(copy.heading);
    expect(copy.heading, `${locale} heading should differ from the SEO title`).not.toBe(copy.title);

    // Not the "not translated in this language" page, and indexable.
    await expect(
      page.getByRole("heading", { name: ui(locale).unavailable.heading, level: 1 }),
    ).toHaveCount(0);
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);

    // Heading hierarchy: every section heading is an h2, so there is no h3
    // orphaned above an h2 and no second h1 hiding in a card.
    const levels = await page
      .locator("main h1, main h2, main h3")
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));
    expect(levels[0], "the first heading in main is the H1").toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1], `heading jump at index ${i}: ${levels.join(",")}`).toBeLessThanOrEqual(1);
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  SEO                                                                        */
/* -------------------------------------------------------------------------- */

test("the visit hub carries its own metadata in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    const copy = visitCopy(locale);
    await page.goto(`/${locale}/visit`);

    // Dedicated title and description, not the site defaults and not the H1.
    await expect(page).toHaveTitle(`${copy.title} | ${ui(locale).site.name}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      copy.metaDescription,
    );

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${ORIGIN}/${locale}/visit`,
    );

    // One alternate per edition, each pointing at that edition's own /visit.
    for (const other of LOCALES) {
      const alternate = page.locator(
        `link[rel="alternate"][hreflang="${LOCALE_META[other].htmlLang}"]`,
      );
      await expect(alternate, `${locale} -> ${other}`).toHaveCount(1);
      await expect(alternate, `${locale} -> ${other}`).toHaveAttribute(
        "href",
        `${ORIGIN}/${other}/visit`,
      );
    }

    // x-default is the default edition's copy, per the project convention —
    // pointed at /hy/visit rather than at `/`, which is a redirect.
    const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(xDefault).toHaveCount(1);
    await expect(xDefault).toHaveAttribute("href", `${ORIGIN}/hy/visit`);
  }
});

/* -------------------------------------------------------------------------- */
/*  Structured data                                                            */
/* -------------------------------------------------------------------------- */

test("the visit hub emits the established page graph and no speculative tourism types", async ({
  page,
}) => {
  /*
    `/visit` uses `pageLd`, the same primitive about/contact/privacy use, so the
    graph is Organization + WebSite + WebPage + BreadcrumbList and nothing else.

    The negative half is the point. A discovery page is exactly where
    `TouristDestination`, `TouristTrip`, `Place` or a hand-rolled `ItemList`
    would look plausible, and none of them describes anything a reader can see
    here: this page is an index of articles, not a description of a destination.
  */
  await page.goto("/en/visit");

  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts, "one graph per page").toHaveCount(1);

  const raw = (await scripts.first().textContent()) ?? "";
  const graph = (JSON.parse(raw) as { "@graph": Record<string, unknown>[] })["@graph"];
  const types = graph.map((node) => node["@type"]);

  expect(types).toEqual(["Organization", "WebSite", "WebPage", "BreadcrumbList"]);

  /*
    Every `@type` anywhere in the graph, nested nodes included — `ImageObject`
    and `ListItem` live one level down, and a speculative type would most likely
    arrive the same way.

    Collected structurally rather than by searching the serialized JSON: the
    page's own SEO title is "Visit Armenia: Places, Nature & Food", so a
    substring test for "Place" matches the title and fails on a page that is
    perfectly correct. Types are the thing being asserted, so types are what is
    read.
  */
  const collectTypes = (node: unknown, into: Set<string>): Set<string> => {
    if (Array.isArray(node)) for (const child of node) collectTypes(child, into);
    else if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if (key === "@type" && typeof value === "string") into.add(value);
        else collectTypes(value, into);
      }
    }
    return into;
  };
  const allTypes = collectTypes(graph, new Set<string>());
  expect([...allTypes].sort()).toEqual([
    "BreadcrumbList",
    "ImageObject",
    "ListItem",
    "Organization",
    "WebPage",
    "WebSite",
  ]);

  for (const speculative of [
    "TouristDestination",
    "TouristTrip",
    "TouristAttraction",
    "Trip",
    "ItemList",
    "Place",
    "LocalBusiness",
    "LandmarksOrHistoricalBuildings",
    "Monastery",
    "Church",
  ]) {
    expect(allTypes.has(speculative), `${speculative} must not be emitted`).toBe(false);
  }

  // The breadcrumb ends on the current page and carries no `item`, which is how
  // Schema.org expects the trail to end.
  const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList") as {
    itemListElement: { name: string; item?: string }[];
  };
  expect(crumbs.itemListElement).toHaveLength(2);
  expect(crumbs.itemListElement.at(-1)?.name).toBe(visitCopy("en").heading);
  expect(crumbs.itemListElement.at(-1)?.item).toBeUndefined();
});

/* -------------------------------------------------------------------------- */
/*  Curation: the cards resolve to real articles, with their own pictures       */
/* -------------------------------------------------------------------------- */

test("every featured place card links to its canonical route and shows its own artwork", async ({
  page,
}) => {
  await page.goto("/en/visit");

  for (const slug of FEATURED_PLACES) {
    const card = cards(page).filter({ has: page.locator(`a[href="/en/places/${slug}"]`) });
    await expect(card, slug).toHaveCount(1);

    const own = getImageSrc(slug);
    expect(own, `${slug} must have registered artwork`).toBeDefined();
    await expect(card.locator("img"), `${slug} artwork`).toHaveAttribute("src", fileIn(own!));

    /*
      And not a neighbour's file. The places section spent seven steps refusing
      exactly this substitution — Garni for Geghard, one monastery for another —
      and a curated row is where a borrowed picture would look most deliberate.
    */
    for (const other of FEATURED_PLACES) {
      if (other === slug) continue;
      const borrowed = getImageSrc(other)!.split("/").pop()!;
      await expect(card.locator(`img[src*="${borrowed}"]`), `${slug} must not use ${other}`).toHaveCount(0);
    }
  }

  /*
    Six, not seven: the row is a curation, not a copy of the listing.

    Scoped to cards rather than to the whole of `main`, which is what §43 could
    assert and §44 cannot. The map added in §44 lists *every* place with a
    coordinate — that is its job, it answers "where can I already read about
    something?" — so Etchmiadzin now legitimately appears further down the page.
    What must stay true is the narrower thing this test was always about: it has
    no card in the curated row.
  */
  await expect(
    cards(page).filter({ has: page.locator(`a[href="/en/places/${NOT_FEATURED}"]`) }),
    "Etchmiadzin stays behind the all-places link",
  ).toHaveCount(0);

  /*
    And the same for every other uncurated place, which is the assertion §49
    actually needs.

    The row held six of seven when this test was written, so "Etchmiadzin is
    absent" and "the row is a curation" were nearly the same statement. With nine
    places and six cards they are not: the failure worth catching now is a newly
    written place being appended to the row on the way past, and only Etchmiadzin
    was ever named. Dilijan is the ninth place, it is on the map, and it must not
    be here.
  */
  for (const slug of NOT_CURATED) {
    await expect(
      cards(page).filter({ has: page.locator(`a[href="/en/places/${slug}"]`) }),
      `${slug} is on the map but not in the curated row`,
    ).toHaveCount(0);
  }

  // The row itself is still exactly six cards, which is the other half of the
  // same statement: nothing was added and nothing was quietly dropped.
  await expect(
    cards(page).filter({ has: page.locator('a[href^="/en/places/"]') }),
    "the curated places row stays at six",
  ).toHaveCount(FEATURED_PLACES.length);
});

test("every dish card links to its canonical route and shows its own artwork", async ({ page }) => {
  await page.goto("/en/visit");

  for (const slug of FEATURED_DISHES) {
    const card = cards(page).filter({ has: page.locator(`a[href="/en/cuisine/${slug}"]`) });
    await expect(card, slug).toHaveCount(1);

    const own = getImageSrc(slug);
    expect(own, `${slug} must have registered artwork`).toBeDefined();
    await expect(card.locator("img"), `${slug} artwork`).toHaveAttribute("src", fileIn(own!));
  }

  /*
    Four different kinds of food, which is the whole reason this is a curated
    list and not `slice(0, 4)`. Taking the array's own order would have produced
    lavash, dolma, khorovats and harissa — the same spread minus the sweet, with
    `ceremonial` doubled once ghapama is counted.
  */
  const dishTypes = FEATURED_DISHES.map(
    (slug) => bundle("en").articles.find((article) => article.slug === slug)!.dishTypeId,
  );
  expect(new Set(dishTypes).size, `dish types should all differ: ${dishTypes.join(", ")}`).toBe(
    FEATURED_DISHES.length,
  );
});

test("every learn card links to a history article that genuinely relates to a featured place", async ({
  page,
}) => {
  await page.goto("/en/visit");

  for (const slug of LEARN_ARTICLES) {
    const card = cards(page).filter({ has: page.locator(`a[href="/en/history/${slug}"]`) });
    await expect(card, slug).toHaveCount(1);

    const own = getImageSrc(slug);
    expect(own, `${slug} must have registered artwork`).toBeDefined();
    await expect(card.locator("img"), `${slug} artwork`).toHaveAttribute("src", fileIn(own!));
  }

  /*
    The editorial guard, and the reason this test is worth more than a link
    check: a "learn before you visit" card is only honest if the connection was
    already declared in the content. Every learn slug must appear in the
    `relatedSlugs` of at least one featured place — which is what stops a fourth
    card being added because a row of three looked thin.
  */
  const articles = bundle("en").articles;
  const declared = new Set(
    FEATURED_PLACES.flatMap(
      (slug) => articles.find((article) => article.slug === slug)?.relatedSlugs ?? [],
    ),
  );
  for (const slug of LEARN_ARTICLES) {
    expect(
      declared.has(slug),
      `${slug} is offered as context but no featured place relates to it`,
    ).toBe(true);
  }
});

test("the curated cards resolve in the Armenian editions too", async ({ page }) => {
  /*
    The curation is slug-based and locale-independent, and the failure it guards
    against is an edition where a slug silently resolves to nothing and the card
    is dropped without a trace — a shorter row and no error anywhere.
  */
  for (const locale of ["hy", "hyw"] as const) {
    await page.goto(`/${locale}/visit`);

    for (const [category, slugs] of [
      ["places", FEATURED_PLACES],
      ["cuisine", FEATURED_DISHES],
      ["history", LEARN_ARTICLES],
    ] as const) {
      for (const slug of slugs) {
        await expect(
          page.locator(`main a[href="/${locale}/${category}/${slug}"]`).first(),
          `${locale} ${slug}`,
        ).toBeVisible();
      }
    }
  }
});

test("no artwork placeholder appears anywhere on the visit hub", async ({ page }) => {
  /*
    Every curated slug is registered, so the generated `<svg role="img">` must
    not appear. `PENDING_ARTWORK` being empty is asserted alongside it: the two
    fail differently, and a page that curated a pending slug would render a
    perfectly finished-looking placeholder card.
  */
  /*
    §47 narrowed this from "nothing is pending anywhere" to "nothing *curated* is
    pending", which is what the assertion was always about.

    `PENDING_ARTWORK` was empty when this was written, so the global form was free
    and read as equivalent. It is not equivalent: Tatev is an eighth place with no
    picture, and it is deliberately *not* in the curated row — §26 keeps the row at
    six and the map comprehensive. The global assertion would now fail on a state
    this page is entirely correct about, which would have made it a test that
    punishes the archive for growing.

    What must never happen is a curated card rendering a placeholder, because that
    card looks perfectly finished. That is exactly what this now checks.
  */
  for (const slug of [...FEATURED_PLACES, ...FEATURED_DISHES, ...LEARN_ARTICLES]) {
    expect(PENDING_ARTWORK, `${slug} is curated and must not be pending`).not.toContain(slug);
  }

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/visit`);

    /*
      Settle before counting. An exact count is the right assertion here — one
      image per curated card and not one more — but it is also the assertion
      most easily read mid-compile on a cold dev server, where the last section
      has not painted yet and the count is briefly short. Waiting on the final
      curated card makes the count describe a finished page; it does not weaken
      what is being asserted, and a genuinely missing image still fails.
    */
    await expect(
      page.locator(`main a[href="/${locale}/history/${LEARN_ARTICLES.at(-1)}"]`).first(),
      `${locale} last curated card`,
    ).toBeVisible();

    await expect(page.locator("main svg[role='img']"), locale).toHaveCount(0);
    /*
      Scoped to the cards, not to `main`.

      §44 put a map on this page and its tiles are `<img>` elements, so an
      unscoped count now measures the tile grid — a number that depends on
      viewport size and network timing. `ArticleCard` renders `<Card
      as="article">`, so `article img` is exactly the curated cards and nothing
      else; the assertion still says "one image per curated card and not one
      more", which is what it was always for.
    */
    await expect(page.locator("main article img"), locale).toHaveCount(
      FEATURED_PLACES.length + FEATURED_DISHES.length + LEARN_ARTICLES.length,
    );
  }
});

/* -------------------------------------------------------------------------- */
/*  Explore by type, and the calls to action                                   */
/* -------------------------------------------------------------------------- */

test("the type controls are real links into the places listing, using the existing taxonomy", async ({
  page,
}) => {
  await page.goto("/en/visit");

  /*
    Semantic links, not click-handling divs: the filter state has a URL
    representation (`useListingParams` adopts `?type=` from
    `window.location.search` on mount), so a link is both correct and the only
    thing that works with a keyboard, middle-click or a crawler.

    No second taxonomy is introduced — the labels come from `getPlaceTypes`, the
    same list the listing filters by, so a renamed pill cannot drift.
  */
  const types = bundle("en").placeTypes.filter((type) => type.id !== "all");
  expect(types.map((type) => type.id)).toEqual([...PLACE_TYPES]);

  for (const type of types) {
    const link = page.getByRole("link", { name: type.label, exact: true });
    await expect(link, type.id).toHaveCount(1);
    await expect(link, type.id).toHaveAttribute("href", `/en/places?type=${type.id}`);
  }

  // And the routes those links point at are real, not invented sub-paths.
  for (const type of types) {
    const response = await page.goto(`/en/places?type=${type.id}`);
    expect(response?.status(), `/en/places?type=${type.id}`).toBe(200);
  }
});

test("each section CTA resolves, in every edition", async ({ page }) => {
  test.slow();

  for (const locale of LOCALES) {
    const copy = visitCopy(locale);
    await page.goto(`/${locale}/visit`);

    for (const [label, target] of [
      [copy.placesCta, `/${locale}/places`],
      [copy.foodCta, `/${locale}/cuisine`],
      [copy.learnCta, `/${locale}/history`],
    ] as const) {
      const cta = page.getByRole("link", { name: label, exact: true });
      await expect(cta, `${locale} ${label}`).toHaveCount(1);
      await expect(cta, `${locale} ${label}`).toHaveAttribute("href", target);

      const response = await page.goto(target);
      expect(response?.status(), target).toBe(200);
      await page.goto(`/${locale}/visit`);
    }
  }
});

test("no link on the visit hub leaves its own edition", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/visit`);

    const hrefs = await page
      .locator('main a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href") ?? ""));

    expect(hrefs.length, `${locale} should link somewhere`).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(
        href === "/sitemap.xml" || href.startsWith(`/${locale}/`) || href === `/${locale}`,
        `${locale}: "${href}" leaves the edition`,
      ).toBe(true);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

test("the header exposes Visit as a journey without disturbing the six sections", async ({
  page,
}) => {
  const dict = ui("en");
  await page.goto("/en");

  /*
    The journey is reachable from the bar, and it is not one of the six items in
    the nav list — which is what keeps the horizontal nav within its width
    budget and what makes Visit read as an action rather than a category.

    The header shows `visitShort`, not `visit`. That is not cosmetic: the full
    Armenian label pushed the 1024px bar 49px past the viewport, which is the
    same trade `historyShort` and its siblings already make. Asserted here by the
    short label, and by the full one in the footer below, so a change that
    collapsed the two would fail rather than silently reintroduce the overflow.
  */
  const journey = page.getByRole("banner").getByRole("link", { name: dict.nav.visitShort, exact: true });
  await expect(journey).toHaveCount(1);
  await expect(journey).toHaveAttribute("href", "/en/visit");

  const footerLink = page
    .getByRole("contentinfo")
    .getByRole("link", { name: dict.nav.visit, exact: true });
  await expect(footerLink, "the footer has room for the full name").toHaveCount(1);
  await expect(footerLink).toHaveAttribute("href", "/en/visit");

  const barItems = page.locator(`nav[aria-label="${dict.nav.mainLabel}"] ul > li > span > a`);
  await expect(barItems, "the bar still carries six sections").toHaveCount(6);
  const barLabels = await barItems.evaluateAll((nodes) =>
    nodes.map((node) => node.textContent?.trim() ?? ""),
  );
  expect(barLabels, "Visit is not one of the six").not.toContain(dict.nav.visit);

  // Every existing category is still reachable from the bar.
  for (const label of [
    dict.nav.historyShort,
    dict.nav.writersShort,
    dict.nav.worksShort,
    dict.nav.cuisineShort,
    dict.nav.places,
    dict.nav.about,
  ]) {
    expect(barLabels.some((text) => text.startsWith(label)), `${label} still on the bar`).toBe(true);
  }
});

test("the drawer carries Visit at small widths", async ({ page }) => {
  const dict = ui("en");
  await page.setViewportSize({ width: 390, height: 780 });
  await page.goto("/en");

  const menu = page.getByRole("navigation", { name: dict.nav.mobileLabel });
  const toggle = page.getByRole("button", { name: dict.nav.toggleMenu });

  // The header is clickable before hydration, so the open is retried — the same
  // shape `openHeaderPanel` uses in the helpers.
  await expect(async () => {
    await toggle.click();
    await expect(menu).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  const link = menu.getByRole("link", { name: dict.nav.visit, exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/en\/visit$/);
});

test("standing on the visit hub marks no other section as current", async ({ page }) => {
  const dict = ui("en");
  await page.goto("/en/visit");

  // The journey itself is current. Scoped to the header and to `visitShort`,
  // because the footer carries the full label and no `aria-current` — the
  // footer is a site map, not a statement about where the reader is.
  const journey = page
    .getByRole("banner")
    .getByRole("link", { name: dict.nav.visitShort, exact: true });
  await expect(journey).toHaveAttribute("aria-current", "page");

  // …and nothing else is. `isActive` is a prefix match, so a route sharing a
  // prefix with a category would light the wrong item and nothing would show it.
  const current = await page
    .locator("header a[aria-current='page']")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href") ?? ""));
  expect(current, "only the journey may be current").toEqual(["/en/visit"]);
});

test("switching edition on the visit hub stays on the visit hub", async ({ page }) => {
  for (const [from, to] of [
    ["en", "hy"],
    ["hy", "hyw"],
    ["hyw", "en"],
  ] as const) {
    await page.goto(`/${from}/visit`);

    const switcher = page
      .getByRole("contentinfo")
      .locator(`a[hreflang="${LOCALE_META[to].htmlLang}"]`)
      .first();
    await expect(switcher, `${from} -> ${to}`).toHaveAttribute("href", `/${to}/visit`);

    await switcher.click();
    await expect(page).toHaveURL(new RegExp(`/${to}/visit$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(visitCopy(to).heading);
  }
});

/* -------------------------------------------------------------------------- */
/*  Architecture: what must NOT exist                                          */
/* -------------------------------------------------------------------------- */

test("the journey mints no duplicate routes under /visit", async ({ page }) => {
  /*
    The single most damaging thing this page could do is give a place two URLs.
    `/visit` links into the canonical routes and owns nothing, so every one of
    these must 404 — and `dynamicParams = false` on the locale layout is what
    makes that true rather than merely unlinked.
  */
  for (const path of [
    "/en/visit/places/khor-virap",
    "/en/visit/places",
    "/en/visit/cuisine/lavash",
    "/en/visit/cuisine",
    "/en/visit/food",
    "/en/visit/map",
    "/en/visit/guides",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), `${path} must not exist`).toBe(404);
  }
});

test("exactly one map library is present, and nothing beyond it", async ({ page }) => {
  /*
    §43 pinned this page as map-free — no library, no container, no coordinate in
    the markup — because map work was a later step and the failure mode was a
    dependency landing "just to try it" and never leaving.

    §44 is that later step, so the pin is *superseded rather than deleted*, and
    what it protects is narrowed rather than dropped. One map library is now
    expected; the rest of the list still is not, and neither is a second one.
    Deleting this test would have been the easy move and would have removed the
    only thing standing between one deliberate dependency and four accidental
    ones.
  */
  await page.goto("/en/visit");

  // The map mounts on scroll, not on load — Leaflet and its tile requests are
  // deferred until a reader reaches the section. See `VisitMap`.
  await page.locator("[data-visit-map]").scrollIntoViewIfNeeded();
  await expect(page.locator(".leaflet-container"), "the chosen library renders").toHaveCount(1);

  for (const selector of [".mapboxgl-map", ".maplibregl-map", ".ol-viewport", ".gm-style"]) {
    await expect(page.locator(selector), `${selector} must not render`).toHaveCount(0);
  }

  const manifest = readFileSync("package.json", "utf8").toLowerCase();
  expect(manifest, "leaflet is the one map dependency").toContain("leaflet");
  for (const dependency of [
    "mapbox",
    "maplibre",
    "openlayers",
    "google-map",
    "geojson",
    "geocod",
    "routing",
    "turf",
  ]) {
    expect(manifest, `${dependency} must not be a dependency`).not.toContain(dependency);
  }
});

test("the visit hub sells nothing", async ({ page }) => {
  /*
    The line this page must not cross, pinned as text rather than as intent.
    An educational discovery hub becomes a travel portal one well-meaning
    section at a time, and the first one always looks helpful.
  */
  await page.goto("/en/visit");
  const text = ((await page.locator("main").textContent()) ?? "").toLowerCase();

  for (const commercial of [
    "book now",
    "booking",
    "hotel",
    "tour package",
    "price",
    "opening hours",
    "restaurant",
    "where to eat",
  ]) {
    expect(text, `"${commercial}" does not belong on this page`).not.toContain(commercial);
  }
});

/* -------------------------------------------------------------------------- */
/*  Responsive                                                                 */
/* -------------------------------------------------------------------------- */

test("the visit hub fits every width, in every edition", async ({ page }) => {
  test.slow();

  /*
    Mobile, tablet and desktop. The Armenian editions are the ones at risk:
    their titles and CTA labels run considerably longer than the English, and a
    curated page is mostly headings and buttons.
  */
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });

    for (const locale of LOCALES) {
      await page.goto(`/${locale}/visit`);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${locale} at ${width}px overflows horizontally`).toBeLessThanOrEqual(0);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  The sections it curates from are untouched                                 */
/* -------------------------------------------------------------------------- */

test("every canonical route the journey links into still works", async ({ page }) => {
  test.slow();

  for (const slug of FEATURED_PLACES) {
    const response = await page.goto(`/en/places/${slug}`);
    expect(response?.status(), `/en/places/${slug}`).toBe(200);
  }
  for (const slug of FEATURED_DISHES) {
    const response = await page.goto(`/en/cuisine/${slug}`);
    expect(response?.status(), `/en/cuisine/${slug}`).toBe(200);
  }
  for (const slug of LEARN_ARTICLES) {
    const response = await page.goto(`/en/history/${slug}`);
    expect(response?.status(), `/en/history/${slug}`).toBe(200);
  }

  /*
    The listings themselves, and their counts, which a curation must not touch.

    Places moves 7 → 8 in §47 and 8 → 9 in §49. The number is edited rather than
    derived on purpose: the point of this assertion is that adding a *curated row*
    to `/visit` does not change what the section listings contain, so it has to be
    a figure someone updates deliberately when the section genuinely grows.
  */
  for (const [path, count] of [
    ["/en/places", 9],
    ["/en/cuisine", 6],
    ["/en/history", 7],
  ] as const) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(cards(page), `${path} card count`).toHaveCount(count);
  }
});

test("the sitemap carries the visit hub in every edition", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  for (const locale of LOCALES) {
    expect(xml, `${locale} visit url`).toContain(`${ORIGIN}/${locale}/visit<`);
  }

  // And no `/visit/<something>` URL was invented alongside it.
  expect(xml.match(/\/visit\/[a-z]/), "no route may exist under /visit").toBeNull();
});
