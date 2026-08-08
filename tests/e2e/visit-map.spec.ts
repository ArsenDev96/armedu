import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getPlaceCoordinateRegistry } from "@/data/geo";
import { MAP_TILES, resolveMapTileConfig } from "@/lib/map-tiles";
import { getImageSrc } from "@/lib/media";
import { getVisitMapPoints } from "@/lib/visit-map";
import { LOCALES, bundle } from "./helpers";

/**
 * The Visit hub's map — §44.
 *
 * Two kinds of assertion, deliberately separated.
 *
 * The **derived data** is tested directly against `getVisitMapPoints`, because
 * that is where a wrong map actually comes from: a coordinate read from the
 * wrong registry, a title hardcoded instead of localized, a slug that is not a
 * Place. Those are exact, fast and independent of whether tiles ever load.
 *
 * The **rendered map** is tested through the DOM. Leaflet was chosen partly so
 * this is possible: its markers are real elements with real accessible names,
 * not pixels in a WebGL canvas, so marker selection can be asserted rather than
 * approximated. Nothing here tests pixel geometry, and nothing here weakens an
 * accessibility assertion because the library made it inconvenient.
 *
 * The negative half matters as much as the positive one. A map is where
 * geolocation, routing, distances and restaurant pins arrive one reasonable-
 * looking commit at a time, so each is pinned as absent.
 */

const PLACES = [
  "khor-virap",
  "etchmiadzin-cathedral",
  "erebuni-fortress",
  "matenadaran",
  "lake-sevan",
  "garni-temple",
  "geghard-monastery",
] as const;

/** Lake Sevan is the only `area` point — a centroid, not a place anyone stands. */
const AREA_PLACE = "lake-sevan";

const NOT_MAPPED = {
  cuisine: ["lavash", "dolma", "khorovats", "gata", "harissa", "ghapama"],
  history: ["tigran-the-great", "mesrop-mashtots-armenian-alphabet", "adoption-of-christianity"],
  writers: ["hovhannes-tumanyan", "yeghishe-charents"],
  works: ["anush", "david-of-sassoun"],
} as const;

const mapSection = (page: import("@playwright/test").Page) => page.locator("[data-visit-map]");

/**
 * Scroll to the map and wait for it to exist.
 *
 * The map is not mounted on load. Leaflet is `import()`ed from inside an
 * `IntersectionObserver`, so both the library chunk and the third-party tile
 * requests only happen once a reader actually reaches the section — which is the
 * behaviour being tested here as much as it is a precondition for testing it.
 *
 * Waiting on `.leaflet-container` rather than on a timeout: the map is ready
 * when Leaflet says it is, and the markers are attached in the same tick.
 */
async function openMap(page: import("@playwright/test").Page) {
  await mapSection(page).scrollIntoViewIfNeeded();
  await expect(page.locator(".leaflet-container")).toHaveCount(1);
  await expect(page.locator("[data-slug]").first()).toBeVisible();
}

/* -------------------------------------------------------------------------- */
/*  The configured basemap — §45                                              */
/* -------------------------------------------------------------------------- */

/**
 * Everything below is derived from `MAP_TILES`, never from a provider name.
 *
 * §44 hardcoded `openstreetmap.org` as the one legal host. That was correct
 * while the URL was a literal in the component and wrong the moment the basemap
 * became configuration: the guarantee worth pinning is *only the configured
 * provider is contacted*, not *this particular company is contacted*. So the
 * expectations are computed from the same config the app renders from — which
 * also means these tests keep working, unchanged, on the day the provider
 * changes, and keep failing on the day an unplanned host appears.
 *
 * `playwright.config.ts` calls `loadEnvConfig`, so this process and the dev
 * server resolve the configuration from the same files.
 */

/** The registrable host, with any `{s}`-style rotation segment removed. */
const tileHost = MAP_TILES
  ? MAP_TILES.url
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/^\{[^}]+\}\./, "")
  : null;

const isTileHost = (hostname: string) =>
  tileHost !== null && (hostname === tileHost || hostname.endsWith(`.${tileHost}`));

/** The configured template as a matcher for the URLs the browser really asks for. */
const tileUrlPattern = new RegExp(
  "^" +
    (MAP_TILES?.url ?? "")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\\{[zxy]\\\}/g, "\\d+")
      .replace(/\\\{s\\\}/g, "[a-z0-9]+")
      .replace(/\\\{r\\\}/g, "(@2x)?"),
);

/** The attribution as the reader sees it: markup stripped, entity resolved. */
const attributionText = (MAP_TILES?.attribution ?? "")
  .replace(/<[^>]*>/g, "")
  .replace(/&copy;/g, "©")
  .replace(/\s+/g, " ")
  .trim();

test("the basemap is resolved from configuration, and half-configured is refused", () => {
  /*
    The resolver in isolation, because this is the layer that decides what a
    misconfiguration does — and the answer has to be *refuse*, not *improvise*.

    Falling back to the development provider when a production URL is malformed
    would serve someone else's tiles while the operator believes their own are
    live. Keeping the old attribution when the URL changes would print the wrong
    copyright line under those tiles, which is the failure a licence punishes.
    Both look like resilience and are neither.
  */
  const good = { url: "https://tiles.example.org/{z}/{x}/{y}.png", attribution: "© Example" };

  // Nothing configured is the documented development fallback, not a failure.
  expect(resolveMapTileConfig({}), "an unconfigured checkout still has a map").not.toBeNull();
  // Which is the shape a freshly copied `.env.example` produces.
  expect(resolveMapTileConfig({ url: "  ", attribution: " " })).toEqual(resolveMapTileConfig({}));

  expect(resolveMapTileConfig(good)).toEqual({ ...good, maxZoom: 17 });
  expect(resolveMapTileConfig({ ...good, maxZoom: "12" })?.maxZoom).toBe(12);

  // Configured together or not at all.
  expect(resolveMapTileConfig({ url: good.url }), "url without attribution").toBeNull();
  expect(resolveMapTileConfig({ attribution: good.attribution }), "attribution alone").toBeNull();

  // A template Leaflet cannot fill is a stream of 404s, not a map.
  for (const url of ["https://tiles.example.org/{z}/{x}.png", "https://tiles.example.org/a.png"]) {
    expect(resolveMapTileConfig({ ...good, url }), url).toBeNull();
  }

  for (const maxZoom of ["0", "23", "abc", "12.5"]) {
    expect(resolveMapTileConfig({ ...good, maxZoom }), `maxZoom=${maxZoom}`).toBeNull();
  }
});

test("no tile provider is named anywhere inside the map component", () => {
  /*
    The point of §45 in one assertion: swapping provider must be a configuration
    change, not an edit to Leaflet setup code. A URL template or a copyright
    line living here is exactly how a provider swap leaves the old company's
    name printed under the new company's tiles.
  */
  const source = readFileSync("src/components/visit/VisitMap.tsx", "utf8");

  expect(source, "no URL template").not.toMatch(/\{[zxy]\}/);
  expect(source, "no absolute URL of any kind").not.toMatch(/https?:\/\//);
  expect(source, "no copyright entity").not.toContain("&copy;");
  expect(source.toLowerCase(), "no provider by name").not.toContain("openstreetmap");

  // And it does read the configuration rather than defaulting on its own.
  expect(source, "the component consumes the config").toContain("MAP_TILES");
});

test("the rendered basemap and its attribution both come from the configuration", async ({
  page,
}) => {
  expect(MAP_TILES, "this build has a usable basemap").not.toBeNull();

  await page.goto("/en/visit");
  await openMap(page);

  // The URLs the browser actually asks for are the configured template, filled.
  await expect(page.locator(".leaflet-tile").first()).toHaveAttribute("src", tileUrlPattern);

  // The attribution control is present, visible, and carries the configured
  // text — it cannot quietly disappear when the URL changes, because a config
  // with an empty attribution is refused before a layer is ever created.
  const attribution = page.locator(".leaflet-control-attribution");
  await expect(attribution).toHaveCount(1);
  await expect(attribution).toBeVisible();
  await expect(attribution).toContainText(attributionText);

  // Nothing is wrong, so nothing says anything is.
  await expect(page.locator("[data-map-unavailable]")).toHaveCount(0);
});

test("no tile is requested until the reader reaches the map", async ({ page }) => {
  /*
    The lazy mount, tested by its consequence rather than by chunk names: a
    reader who never scrolls this far makes no third-party request at all. That
    is the privacy half of the IntersectionObserver, and it is the half a
    well-meaning refactor to a plain top-level import would silently remove.
  */
  const tiles: string[] = [];
  page.on("request", (request) => {
    if (isTileHost(new URL(request.url()).hostname)) tiles.push(request.url());
  });

  await page.goto("/en/visit");
  await page.waitForLoadState("networkidle");

  await expect(mapSection(page), "the section is server-rendered").toHaveCount(1);
  await expect(page.locator(".leaflet-container"), "the map is not mounted").toHaveCount(0);
  expect(tiles, "no tile request before the section is reached").toEqual([]);

  await openMap(page);
  await expect
    .poll(() => tiles.length, { message: "tiles arrive once the section does" })
    .toBeGreaterThan(0);
});

test("Leaflet is never imported eagerly", () => {
  const component = readFileSync("src/components/visit/VisitMap.tsx", "utf8");

  // A static value import here would put the library in the page's first
  // payload and undo the test above. Types and the stylesheet are erased or
  // extracted at build time and do not.
  expect(component, "the library is imported dynamically").toContain('await import("leaflet")');
  expect(component, "and never statically").not.toMatch(
    /^import\s+(?!type\b)[^;]*from "leaflet";/m,
  );

  // Nor anywhere upstream of the component.
  for (const file of ["src/app/[locale]/visit/page.tsx", "src/app/[locale]/layout.tsx"]) {
    expect(readFileSync(file, "utf8"), file).not.toContain('"leaflet"');
  }
});

test("the map section stays usable when the tile provider is unreachable", async ({ page }) => {
  /*
    Not a retry system and not offline detection — the map either drew or it did
    not, and the reader is told which. What matters is that the seven article
    links, the marker selection and the rest of the page survive a basemap that
    never arrives, because the markers are DOM and the list is server HTML.
  */
  const copy = bundle("en").pages.visit;

  await page.route(
    (url) => isTileHost(url.hostname),
    (route) => route.abort(),
  );

  await page.goto("/en/visit");
  await openMap(page);

  const notice = page.locator("[data-map-unavailable]");
  await expect(notice).toBeVisible();
  await expect(notice, "localized, and only says what is known").toHaveText(copy.mapUnavailable);

  // Every place is still reachable at its own canonical route.
  for (const slug of PLACES) {
    await expect(page.locator(`[data-map-list-item="${slug}"]`), slug).toHaveAttribute(
      "href",
      `/en/places/${slug}`,
    );
  }

  // And selection still works with nothing underneath the pins.
  const article = bundle("en").articles.find((entry) => entry.slug === "khor-virap")!;
  await page.locator('[data-slug="khor-virap"]').click();
  await expect(mapSection(page).locator("[aria-live='polite']")).toContainText(article.title);

  // The rest of the journey is untouched by a failed basemap.
  await expect(page.getByRole("heading", { name: copy.foodTitle, level: 2 })).toBeVisible();
});

/* -------------------------------------------------------------------------- */
/*  Derived data                                                              */
/* -------------------------------------------------------------------------- */

test("the map model is derived from the article and coordinate registries", () => {
  const registry = getPlaceCoordinateRegistry();

  for (const locale of LOCALES) {
    const points = getVisitMapPoints(locale);

    // Exactly the Places articles — derived, not a second allow-list. This is
    // also the check that makes the "exclude a place with no coordinate" rule
    // non-silent: a dropped place shortens this and fails here.
    expect(points.map((point) => point.slug).sort(), locale).toEqual([...PLACES].sort());

    const articles = bundle(locale).articles;

    for (const point of points) {
      const article = articles.find((entry) => entry.slug === point.slug);
      expect(article, `${locale} ${point.slug}`).toBeDefined();

      // Every field traced back to the thing it was derived from.
      expect(point.title, `${locale} ${point.slug} title`).toBe(article!.title);
      expect(point.summary, `${locale} ${point.slug} summary`).toBe(article!.excerpt);
      expect(point.placeTypeId, `${locale} ${point.slug} type`).toBe(article!.placeTypeId);
      expect(point.href, `${locale} ${point.slug} href`).toBe(`/${locale}${article!.href}`);
      expect(point.imageSrc, `${locale} ${point.slug} image`).toBe(getImageSrc(point.slug));

      const coordinate = registry[point.slug];
      expect(coordinate, `${locale} ${point.slug} coordinate`).toBeDefined();
      expect(point.lat, `${locale} ${point.slug} lat`).toBe(coordinate.lat);
      expect(point.lon, `${locale} ${point.slug} lon`).toBe(coordinate.lon);
      expect(point.precision, `${locale} ${point.slug} precision`).toBe(coordinate.precision);

      // Null Island — the placeholder pair, rejected here as well as in
      // `validate:content`, because this is the value a broken derivation
      // produces and a map would plot it in the Gulf of Guinea without complaint.
      expect(point.lat === 0 && point.lon === 0, `${locale} ${point.slug} is 0,0`).toBe(false);
    }
  }
});

test("precision travels with the point, and Lake Sevan stays an area", () => {
  const points = getVisitMapPoints("en");

  for (const point of points) {
    expect(point.precision, point.slug).toBe(point.slug === AREA_PLACE ? "area" : "site");
  }
});

test("the map titles are localized, not the default edition's", () => {
  /*
    The failure this catches is a map that reads its labels from one bundle and
    is rendered in another — which looks entirely correct in `en` and shows
    English names on the Armenian page.
  */
  const en = getVisitMapPoints("en");
  const hy = getVisitMapPoints("hy");
  const hyw = getVisitMapPoints("hyw");

  for (const point of en) {
    const armenian = hy.find((entry) => entry.slug === point.slug)!;
    const western = hyw.find((entry) => entry.slug === point.slug)!;
    expect(armenian.title, `${point.slug} hy`).not.toBe(point.title);
    expect(western.title, `${point.slug} hyw`).not.toBe(point.title);
    // Coordinates are locale-invariant by construction and must not differ.
    expect(armenian.lat).toBe(point.lat);
    expect(western.lon).toBe(point.lon);
  }
});

test("only Places are mapped — no dish, person, work or event becomes a marker", () => {
  const slugs = new Set(getVisitMapPoints("en").map((point) => point.slug));

  for (const [category, entries] of Object.entries(NOT_MAPPED)) {
    for (const slug of entries) {
      expect(slugs.has(slug), `${slug} (${category}) must not be a marker`).toBe(false);
    }
  }

  // And every mapped slug really is a Places article in the bundle.
  for (const slug of slugs) {
    const article = bundle("en").articles.find((entry) => entry.slug === slug);
    expect(article?.category, slug).toBe("places");
  }
});

/* -------------------------------------------------------------------------- */
/*  Rendering, in every edition                                               */
/* -------------------------------------------------------------------------- */

for (const locale of LOCALES) {
  test(`[${locale}] the visit hub renders the map section and its seven places`, async ({
    page,
  }) => {
    const copy = bundle(locale).pages.visit;
    await page.goto(`/${locale}/visit`);

    await expect(page.getByRole("heading", { name: copy.mapTitle, level: 2 })).toBeVisible();
    await expect(mapSection(page)).toHaveCount(1);

    // The non-map list carries all seven, with a locale-correct link each.
    const list = mapSection(page).locator("[data-map-list] li");
    await expect(list).toHaveCount(PLACES.length);

    for (const slug of PLACES) {
      const link = mapSection(page).locator(`[data-map-list-item="${slug}"]`);
      await expect(link, `${locale} ${slug}`).toHaveCount(1);
      await expect(link, `${locale} ${slug}`).toHaveAttribute("href", `/${locale}/places/${slug}`);
    }
  });
}

test("the accessible list is server-rendered, so the places survive without JavaScript", async ({
  browser,
}) => {
  /*
    The progressive-enhancement guarantee, tested the only way that means
    anything: with JavaScript switched off. Leaflet cannot run, so there is no
    map — and all seven places, their names, their types and their article links
    must still be on the page.
  */
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/en/visit");

  await expect(page.locator(".leaflet-container"), "no map without JS").toHaveCount(0);

  for (const slug of PLACES) {
    const link = page.locator(`[data-map-list-item="${slug}"]`);
    await expect(link, slug).toHaveCount(1);
    await expect(link, slug).toHaveAttribute("href", `/en/places/${slug}`);
  }

  // The heading and the explanation are server copy too, not something the map
  // draws once it loads.
  const copy = bundle("en").pages.visit;
  await expect(page.getByRole("heading", { name: copy.mapTitle, level: 2 })).toBeVisible();
  await expect(page.getByText(copy.mapDescription)).toBeVisible();

  await context.close();
});

test("every marker is a real, named control carrying its own type", async ({ page }) => {
  await page.goto("/en/visit");
  await openMap(page);

  const types = bundle("en").placeTypes;
  const markers = page.locator("[data-slug]");
  await expect(markers).toHaveCount(PLACES.length);

  for (const slug of PLACES) {
    const marker = page.locator(`[data-slug="${slug}"]`);
    await expect(marker, slug).toHaveCount(1);
    await expect(marker, slug).toHaveAttribute("role", "button");

    // The type is in the accessible name, so shape and colour are never the
    // only carrier of what kind of place this is.
    const article = bundle("en").articles.find((entry) => entry.slug === slug)!;
    const label = types.find((type) => type.id === article.placeTypeId)!.label;
    await expect(marker, slug).toHaveAttribute("aria-label", `${article.title} — ${label}`);

    // Focusable without a mouse: Leaflet's own keyboard support, kept on.
    await expect(marker, slug).toHaveAttribute("tabindex", "0");
  }
});

/* -------------------------------------------------------------------------- */
/*  Selection                                                                 */
/* -------------------------------------------------------------------------- */

test("selecting a marker reveals that place, and never a neighbour's", async ({ page }) => {
  const copy = bundle("en").pages.visit;
  await page.goto("/en/visit");
  await openMap(page);

  const panel = mapSection(page).locator("[aria-live='polite']");
  await expect(panel).toContainText(copy.mapSelectPrompt);

  /*
    Garni and Geghard, in both directions.

    They are eight kilometres apart in the same valley, they link to each other,
    and they sit next to each other in the registry — so a selection handler off
    by one index, or a marker bound to the wrong slug, produces a card that looks
    entirely plausible. This is the pair that catches it.
  */
  for (const [chosen, mustNotShow] of [
    ["garni-temple", "geghard-monastery"],
    ["geghard-monastery", "garni-temple"],
  ] as const) {
    const article = bundle("en").articles.find((entry) => entry.slug === chosen)!;
    const other = bundle("en").articles.find((entry) => entry.slug === mustNotShow)!;

    await page.locator(`[data-slug="${chosen}"]`).click();

    await expect(panel, chosen).toContainText(article.title);
    await expect(panel, `${chosen} must not show ${mustNotShow}`).not.toContainText(other.title);

    // The card links to the chosen place's own canonical route, locale intact.
    const cta = panel.getByRole("link", { name: copy.mapCta, exact: true });
    await expect(cta, chosen).toHaveAttribute("href", `/en/places/${chosen}`);

    // And shows its own registered artwork, not the neighbour's.
    const own = getImageSrc(chosen)!.split("/").pop()!;
    const neighbour = getImageSrc(mustNotShow)!.split("/").pop()!;
    await expect(panel.locator("img"), chosen).toHaveAttribute(
      "src",
      new RegExp(own.replace(".", "\\.")),
    );
    await expect(
      panel.locator(`img[src*="${neighbour}"]`),
      `${chosen} must not borrow ${mustNotShow}`,
    ).toHaveCount(0);
  }
});

test("every place can be selected and shows its own image", async ({ page }) => {
  test.slow();
  await page.goto("/en/visit");
  await openMap(page);

  const panel = mapSection(page).locator("[aria-live='polite']");

  for (const slug of PLACES) {
    await page.locator(`[data-slug="${slug}"]`).click();

    const article = bundle("en").articles.find((entry) => entry.slug === slug)!;
    await expect(panel, slug).toContainText(article.title);

    const own = getImageSrc(slug)!.split("/").pop()!;
    await expect(panel.locator("img"), `${slug} artwork`).toHaveAttribute(
      "src",
      new RegExp(own.replace(".", "\\.")),
    );

    // No other place's file in the panel at the same time.
    for (const other of PLACES) {
      if (other === slug) continue;
      const borrowed = getImageSrc(other)!.split("/").pop()!;
      await expect(
        panel.locator(`img[src*="${borrowed}"]`),
        `${slug} must not show ${other}`,
      ).toHaveCount(0);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  Type filter                                                               */
/* -------------------------------------------------------------------------- */

test("the map filter reuses the listing taxonomy and leaves the /places links alone", async ({
  page,
}) => {
  await page.goto("/en/visit");
  await openMap(page);

  const types = bundle("en").placeTypes;

  // Same ids and same labels as the listing — a view control, not a taxonomy.
  for (const type of types) {
    const button = mapSection(page).locator(`[data-map-filter="${type.id}"]`);
    await expect(button, type.id).toHaveCount(1);
    await expect(button, type.id).toHaveText(type.label);
  }

  // Narrowing to monasteries leaves the three monasteries on the map and in the
  // list, and removes the rest from both — the two must agree.
  await mapSection(page).locator('[data-map-filter="monastery"]').click();

  const monasteries = bundle("en")
    .articles.filter((entry) => entry.category === "places" && entry.placeTypeId === "monastery")
    .map((entry) => entry.slug);
  expect(monasteries.length, "the fixture should have more than one monastery").toBeGreaterThan(1);

  await expect(mapSection(page).locator("[data-map-list] li")).toHaveCount(monasteries.length);
  await expect(mapSection(page).locator('[data-slug][data-place-type="nature"]')).toHaveCount(0);
  for (const slug of monasteries) {
    await expect(mapSection(page).locator(`[data-map-list-item="${slug}"]`), slug).toHaveCount(1);
  }

  // Back to all.
  await mapSection(page).locator('[data-map-filter="all"]').click();
  await expect(mapSection(page).locator("[data-map-list] li")).toHaveCount(PLACES.length);

  /*
    And the existing "Explore by type" section is untouched: still four links to
    `/places?type=`, not replaced by map-only controls. The map filter is an
    addition to this page, not a substitute for the route into the listing.
  */
  for (const id of ["monastery", "historical", "museum", "nature"]) {
    await expect(
      page.locator(`main a[href="/en/places?type=${id}"]`),
      `${id} listing link`,
    ).toHaveCount(1);
  }
});

/* -------------------------------------------------------------------------- */
/*  What must not exist                                                       */
/* -------------------------------------------------------------------------- */

test("the map asks for no location, plots no route and sells nothing", async ({ page }) => {
  /*
    Geolocation is pinned by instrumenting the API rather than by looking for a
    button: a control could be renamed, but a call to `navigator.geolocation`
    cannot be disguised. The counter is installed before any script runs.
  */
  await page.addInitScript(() => {
    const w = window as unknown as { __geo: number };
    w.__geo = 0;
    const bump = () => {
      w.__geo += 1;
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition = bump as never;
      navigator.geolocation.watchPosition = (() => {
        bump();
        return 0;
      }) as never;
    }
  });

  await page.goto("/en/visit");
  await openMap(page);
  await page.locator('[data-slug="garni-temple"]').click();

  expect(
    await page.evaluate(() => (window as unknown as { __geo: number }).__geo),
    "geolocation must never be called",
  ).toBe(0);

  // No locate control, no routing surface, no drawn line between places.
  for (const selector of [
    ".leaflet-control-locate",
    ".leaflet-routing-container",
    "[data-locate]",
    "[data-route]",
    ".leaflet-overlay-pane path",
    ".leaflet-overlay-pane polyline",
  ]) {
    await expect(page.locator(selector), `${selector} must not exist`).toHaveCount(0);
  }

  const text = ((await page.locator("main").textContent()) ?? "").toLowerCase();
  for (const banned of [
    "my location",
    "near me",
    "directions",
    "travel time",
    "distance",
    "km away",
    "opening hours",
    "book now",
  ]) {
    expect(text, `"${banned}" does not belong on this map`).not.toContain(banned);
  }
});

test("the map talks to the configured tile host and nothing else", async ({ page }) => {
  /*
    Every third-party request the page makes, enumerated rather than assumed.

    §44 wrote the provider's domain into this assertion. §45 makes the provider
    configurable, so the expectation is derived from `MAP_TILES` instead — the
    guarantee that is actually worth holding is "only the basemap this build was
    configured with", not "this one company". Nothing here is loosened to a
    wildcard: an unconfigured host still fails, it is simply no longer named.
  */
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/en/visit");
  await openMap(page);
  await page.locator('[data-slug="lake-sevan"]').click();
  await page.waitForTimeout(1_500);

  const external = requests.filter((url) => {
    const { hostname } = new URL(url);
    return hostname !== "localhost" && hostname !== "127.0.0.1";
  });

  for (const url of external) {
    expect(isTileHost(new URL(url).hostname), `unexpected third-party host: ${url}`).toBe(true);
  }

  /*
    And nothing that looks like a lookup service, even on the permitted host —
    geocoding, place search and routing are all things a tile provider will
    happily also sell you, and all things this map has decided not to have.
  */
  for (const banned of ["nominatim", "geocod", "/search", "/route", "/direction", "/autocomplete"]) {
    expect(
      external.filter((url) => url.toLowerCase().includes(banned)),
      `${banned} requests must not exist`,
    ).toEqual([]);
  }
});

test("the map adds no route to the site", async ({ page }) => {
  for (const path of ["/en/visit/map", "/en/map", "/en/visit/places/garni-temple"]) {
    const response = await page.goto(path);
    expect(response?.status(), `${path} must not exist`).toBe(404);
  }
});

/* -------------------------------------------------------------------------- */
/*  Responsive                                                                */
/* -------------------------------------------------------------------------- */

test("the map section fits every width, in every edition", async ({ page }) => {
  test.slow();

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });

    for (const locale of LOCALES) {
      await page.goto(`/${locale}/visit`);
      // Measure with the map actually mounted — an unmounted container is an
      // empty div and would prove nothing about the widest thing on the page.
      await openMap(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${locale} at ${width}px overflows horizontally`).toBeLessThanOrEqual(0);
    }
  }
});

test("the map container is a reasonable size on a phone and the filters are tappable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/en/visit");
  await openMap(page);

  const container = mapSection(page).locator("[role='region']");
  const box = await container.boundingBox();
  expect(box, "the map has a box").not.toBeNull();
  expect(box!.width, "fits the viewport").toBeLessThanOrEqual(360);
  expect(box!.height, "tall enough to read").toBeGreaterThan(200);

  // Touch targets: the filter chips are the smallest controls in this section.
  const chip = mapSection(page).locator('[data-map-filter="monastery"]');
  const chipBox = await chip.boundingBox();
  expect(chipBox!.height, "filter chip height").toBeGreaterThanOrEqual(32);
});

/* -------------------------------------------------------------------------- */
/*  Dependency                                                                */
/* -------------------------------------------------------------------------- */

test("one map dependency, pinned by name", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  expect(Object.keys(manifest.dependencies)).toContain("leaflet");
  expect(Object.keys(manifest.devDependencies)).toContain("@types/leaflet");

  // No second map, no geocoder, no router — the three things that arrive next.
  const all = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies }).join(" ");
  for (const forbidden of ["maplibre", "mapbox", "openlayers", "geocod", "routing", "turf"]) {
    expect(all, `${forbidden} must not be installed`).not.toContain(forbidden);
  }
});
