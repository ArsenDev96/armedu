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
  /*
    §47. Tatev is here because it is a Places article with a coordinate, and for no
    other reason — nothing in `visit-map.ts` or `VisitMap.tsx` was touched to admit
    it. That is the property this list is really testing: the map is derived from
    `places ∩ PLACE_COORDINATES`, so an eighth place appears on it by existing,
    and a ninth will too.

    It is also the first marker that meaningfully changes the extent. The other
    seven span about half a degree of latitude; Tatev is roughly a degree south of
    the northernmost of them, so a hardcoded Armenia box would have left it at the
    edge or off it. The bounds are marker-derived, which is why it did not.
  */
  "tatev-monastery",
  /*
    §49. Dilijan is here on exactly the same terms as Tatev: it is a Places
    article with a coordinate, and nothing in `visit-map.ts`, `VisitMap.tsx` or
    `map-tiles.ts` was touched to admit it. The map went 8 → 9 by an article and a
    registry entry existing, which is the property this list tests.

    Where Tatev stretched the extent south, Dilijan stretches it north — it is the
    northernmost marker on the map by about a third of a degree. The two together
    are the case for marker-derived bounds: a hardcoded Armenia box tuned before
    §47 would now be wrong at both ends.
  */
  "dilijan-national-park",
  /*
    §51. Gyumri is here on exactly the same terms as Tatev and Dilijan: it is a
    Places article with a coordinate, and nothing in `visit-map.ts`,
    `map-tiles.ts` or the map's data path was touched to admit it. The map went
    9 → 10 by an article and a registry entry existing, which is the property this
    list tests. The one component edit §51 made — a glyph for the `settlement`
    type, which had never had a rendered member — changes what a marker looks like,
    not which markers exist.

    Where Tatev stretched the extent south and Dilijan north, Gyumri stretches it
    *west*: it is north of Dilijan and most of a degree west of every other marker,
    which is a direction this map had never covered. A box tuned before §47 would
    now be wrong on three sides.
  */
  "gyumri",
  /*
    §57. Amberd is here on exactly the same terms as Tatev, Dilijan and Gyumri: it
    is a Places article with a coordinate, and nothing in `visit-map.ts`,
    `map-tiles.ts`, `VisitMap.tsx` or the map's data path was touched to admit it.
    The map went 10 to 11 by an article and a registry entry existing, which is the
    property this list tests. There is no allow-list to add it to and no new marker
    type: it is `historical`, so it draws the glyph Erebuni and Garni have drawn
    since §33.

    It is also the first addition in four steps that stretches the extent in *no*
    direction. Tatev pulled the box south, Dilijan north, Gyumri north-west; Amberd
    sits well inside all three edges — north of Etchmiadzin, east of Gyumri, and
    nowhere near a boundary. The bounds are marker-derived, so an eleventh marker
    inside the existing box must leave the framing untouched, which is a different
    claim from the three stretches before it and worth measuring rather than
    assuming.
  */
  "amberd-fortress",
] as const;

/**
 * The `area` points — centroids of large features, not places anyone stands.
 *
 * A single slug until §49, when Dilijan National Park became the second. The
 * distinction is per slug rather than per map because it is a property of the
 * coordinate: a monastery enclosure has a point and a protected landscape of
 * 33,765 hectares does not.
 */
const AREA_PLACES = ["lake-sevan", "dilijan-national-park"] as const;

/**
 * The `settlement` points — a town's conventional centre, which is neither a
 * built complex nor the middle of a natural feature.
 *
 * One slug as of §51, and the first time this member of the union has been used
 * at all. Kept as a list for the same reason `AREA_PLACES` is: a second town has
 * to be added to a named list rather than to a boolean.
 */
const SETTLEMENT_PLACES = ["gyumri"] as const;

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

  // Both the provider that was here and the provider that replaced it, named
  // explicitly — a generic "no absolute URL" rule is easy to satisfy by accident
  // and easy to weaken later, so the two real names are their own assertion.
  for (const provider of ["openstreetmap", "stadia", "openmaptiles"]) {
    expect(source.toLowerCase(), `${provider} must not be named here`).not.toContain(provider);
  }

  // And it does read the configuration rather than defaulting on its own.
  expect(source, "the component consumes the config").toContain("MAP_TILES");
});

/**
 * Query-parameter names that would mean a credential is travelling in a URL.
 *
 * Compared as *parsed parameter names*, never as substrings of the whole URL: a
 * style slug, a path segment or a benign parameter can easily contain the
 * letters "key" without carrying one, and a test that fails on `monkey` is a
 * test someone deletes rather than fixes.
 */
const CREDENTIAL_PARAMS = [
  "api_key",
  "apikey",
  "access_token",
  "token",
  "key",
  "auth",
  "signature",
];

const credentialParamsIn = (url: string) =>
  [...new URL(url).searchParams.keys()]
    .map((name) => name.toLowerCase())
    .filter((name) => CREDENTIAL_PARAMS.includes(name));

/** Parse the committed example environment, honouring quoted values. */
function envExample(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of readFileSync(".env.example", "utf8").split(/\r?\n/)) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!match) continue;
    let value = match[2].trim();
    const quoted =
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'));
    out[match[1]] = quoted ? value.slice(1, -1) : value;
  }
  return out;
}

test("the committed production basemap is Stadia, and is valid, keyless and correctly credited", () => {
  /*
    The one test that names the provider on purpose — and the distinction is
    worth being explicit about, because everything else in this file must not.

    The *network* tests assert an invariant: only the configured host is ever
    contacted, whoever that is. This test asserts a *decision*: the host Armat
    configured is Stadia, at a style and zoom that were chosen, with the credit
    line the licence requires. It is the §46 decision record in executable form,
    so a silent edit to the shipped configuration fails here rather than in
    production. Deleting it would not weaken an invariant; it would lose the
    record.

    It reads `.env.example` rather than `process.env` because that file is the
    committed configuration. A developer's `.env.local` cannot make this pass.
  */
  const env = envExample();
  const config = resolveMapTileConfig({
    url: env.NEXT_PUBLIC_MAP_TILE_URL,
    attribution: env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION,
    maxZoom: env.NEXT_PUBLIC_MAP_TILE_MAX_ZOOM,
  });

  expect(config, "the documented configuration must resolve, not fall back").not.toBeNull();
  expect(config, "and must not be the OpenStreetMap development fallback").not.toEqual(
    resolveMapTileConfig({}),
  );

  // An XYZ template the existing resolver and Leaflet both understand.
  for (const token of ["{z}", "{x}", "{y}"]) {
    expect(config!.url, `${token} placeholder`).toContain(token);
  }

  const parseable = config!.url.replace(/\{[^}]+\}/g, "0");
  expect(new URL(parseable).hostname, "the chosen provider").toBe("tiles.stadiamaps.com");
  expect(new URL(parseable).protocol, "tiles are fetched over TLS").toBe("https:");

  // Domain-based authentication: nothing to leak, because nothing is sent.
  expect(credentialParamsIn(parseable), "no credential in the shipped URL").toEqual([]);

  // The zoom ceiling is the style's documented one, not the old fallback's 17.
  expect(config!.maxZoom, "alidade_smooth is documented to zoom 20").toBe(20);

  /*
    The full credit chain, verbatim rather than paraphrased: these tiles are
    Stadia's rendering of OpenMapTiles' schema over OpenStreetMap's data, and
    all three are named in the licence requirement. The links are asserted too
    — the requirement is to preserve them, and an attribution reduced to plain
    text is a slow way to breach it.
  */
  for (const party of ["Stadia Maps", "OpenMapTiles", "OpenStreetMap"]) {
    expect(config!.attribution, `${party} must be credited`).toContain(party);
  }
  for (const href of [
    'href="https://stadiamaps.com/"',
    'href="https://openmaptiles.org/"',
    'href="https://www.openstreetmap.org/copyright"',
  ]) {
    expect(config!.attribution, `${href} must be preserved`).toContain(href);
  }
});

test("the configured basemap carries no credential, and needs no client-side auth", () => {
  /*
    This is the assertion that guards the domain-authentication decision.

    Authenticating by registered domain instead of a browser token is only worth
    anything if no token quietly reappears later "just to get staging working".
    Three places would have to be true for that to happen, so all three are
    pinned: the configured URL, the config module, and the component.
  */
  expect(MAP_TILES, "this build has a usable basemap").not.toBeNull();

  // Placeholders are not valid URL syntax; neutralise them before parsing.
  const parseable = MAP_TILES!.url.replace(/\{[^}]+\}/g, "0");
  expect(credentialParamsIn(parseable), "the configured tile URL").toEqual([]);

  // No authentication code anywhere in the map path — that is what domain
  // authentication buys, and the absence is the whole feature.
  for (const file of ["src/lib/map-tiles.ts", "src/components/visit/VisitMap.tsx"]) {
    const source = readFileSync(file, "utf8").toLowerCase();
    for (const banned of ["api_key", "apikey", "access_token", "authorization", "bearer"]) {
      expect(source, `${banned} must not appear in ${file}`).not.toContain(banned);
    }
  }
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

test("the derived bounds contain every marker, at every width", async ({ page }) => {
  /*
    §20 of the map step said the extent must adapt rather than be retuned, and §47
    was the first change that actually tested it: Tatev is far enough south that a
    fixed national box would have framed it badly or dropped it. §49 tested the
    other end of the same claim — Dilijan was the northernmost marker on the map,
    about a third of a degree above Etchmiadzin, so nine markers spanned roughly
    1.4 degrees of latitude against the half-degree the first seven did.

    §51 tested the third side. Gyumri is north of Dilijan *and* about 0.7 degrees
    west of Etchmiadzin, which was the westernmost point for ten steps, so the ten
    markers spanned a box that was wider as well as taller. Leaflet fits bounds to
    the container, so a wider box at a fixed aspect ratio zooms every marker closer
    together — which is why the overlap measurement below had to be re-run and is
    reported rather than assumed.

    §57 tests the opposite case, and it is the one the previous three could not.
    Amberd changes no extreme: it is inside the box Gyumri, Dilijan and Tatev
    already defined, so the derived bounds are the same box with one more pin in it.
    What must hold is that an eleventh marker inside the existing frame is still
    *visible* at every width — a pin that clears the box at 1440 px can fall outside
    it at 360 px — and that nothing was retuned to make room for it.

    Widened to the four viewport widths the responsive suite already uses, because
    the failure this guards against is width-dependent in a way §47's single
    measurement could not see: Leaflet fits bounds to the container, and a marker
    that clears the box at 1440 px can fall outside it at 360 px, where the map is
    a quarter as wide and the pins are the same size in pixels.

    Asserted through the rendered positions rather than by re-deriving the bounds
    in JavaScript. A marker outside the container is one a reader cannot see
    without panning, which is the real failure and the one a screenshot would not
    catch.
  */
  test.slow();

  expect(getVisitMapPoints("en").length, "the eleventh place is on the map").toBe(PLACES.length);

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/visit");
    await openMap(page);

    /*
      Leaflet positions markers absolutely inside the container, so a marker whose
      box falls outside the container's box is one the reader would have to pan to
      find. One pixel of tolerance each way, because the pin's anchor sits on the
      coordinate and its tip can land exactly on the edge.
    */
    const container = await page.locator(".leaflet-container").boundingBox();
    expect(container, `the map has a box at ${width}px`).not.toBeNull();

    for (const slug of PLACES) {
      const marker = page.locator(`[data-slug="${slug}"]`);
      await expect(marker, `${slug} at ${width}px`).toHaveCount(1);
      const box = await marker.boundingBox();
      expect(box, `${slug} is rendered at ${width}px`).not.toBeNull();
      expect(box!.x, `${slug} left of the map at ${width}px`).toBeGreaterThanOrEqual(
        container!.x - 1,
      );
      expect(box!.y, `${slug} above the map at ${width}px`).toBeGreaterThanOrEqual(
        container!.y - 1,
      );
      expect(box!.x + box!.width, `${slug} right of the map at ${width}px`).toBeLessThanOrEqual(
        container!.x + container!.width + 1,
      );
      expect(box!.y + box!.height, `${slug} below the map at ${width}px`).toBeLessThanOrEqual(
        container!.y + container!.height + 1,
      );
    }
  }
});

/**
 * The two marker pairs known to overlap at the initial extent.
 *
 * Recorded, not fixed. §47 found them when Tatev zoomed the map out to hold a
 * marker a degree further south, and both were left alone because changing the
 * marker-derived bounds was out of scope for a content step — which it still is
 * in §49. They are the reason the exhaustive selection test below drives the
 * keyboard rather than the mouse.
 *
 * Sorted pairs, so the assertion below does not depend on marker order.
 */
const KNOWN_OVERLAPS = [
  ["erebuni-fortress", "matenadaran"],
  ["garni-temple", "geghard-monastery"],
].map((pair) => pair.slice().sort().join(" / "));

test("adding a marker inside the existing box introduces no new overlap", async ({ page }) => {
  /*
    §51 stretched the extent again and in a new direction, so every pair had to be
    re-measured rather than assumed: pushing the western edge out makes Leaflet fit
    a wider box, and at a fixed container width that pulls every marker closer to
    its neighbours — the same effect §49's taller box had, on the other axis.

    §57 does not move the box at all, which changes what this test is for rather
    than making it redundant. Amberd sits inside the existing frame, so the scale is
    unchanged and the two known pairs must measure as they did; what is new is an
    eleventh pin dropped into ground that already had markers around it. Its nearest
    neighbour is Etchmiadzin, about 26 km away — four times the Erebuni-Matenadaran
    gap and three times the Garni-Geghard one — so a third overlapping pair is not
    expected. Expected is not measured, which is why this runs.

    The assertion is a *subset* one, not an exact count. Whether the two known
    pairs still overlap, and by how much, is a measurement to be reported rather
    than pinned — a pixel count would fail on a font or icon change that means
    nothing. What must not happen is a third pair silently becoming unreachable by
    mouse, because that is the failure a reader meets and no other test would see.
  */
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/visit");
  await openMap(page);

  const boxes = new Map<string, { x: number; y: number; width: number; height: number }>();
  for (const slug of PLACES) {
    const box = await page.locator(`[data-slug="${slug}"]`).boundingBox();
    expect(box, `${slug} is rendered`).not.toBeNull();
    boxes.set(slug, box!);
  }

  const overlaps: string[] = [];
  for (let i = 0; i < PLACES.length; i += 1) {
    for (let j = i + 1; j < PLACES.length; j += 1) {
      const a = boxes.get(PLACES[i])!;
      const b = boxes.get(PLACES[j])!;
      const dx = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
      const dy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
      if (dx > 0 && dy > 0) {
        const pair = [PLACES[i], PLACES[j]].slice().sort().join(" / ");
        overlaps.push(pair);
        // Reported rather than asserted: the measurement is the point, and a
        // pixel threshold here would be a test that fails on an icon change.
        console.log(`  marker overlap: ${pair} — ${Math.round(dx)} x ${Math.round(dy)} px`);
      }
    }
  }

  for (const pair of overlaps) {
    expect(
      KNOWN_OVERLAPS,
      `${pair} is a new overlap; §47 recorded only ${KNOWN_OVERLAPS.join(" and ")}`,
    ).toContain(pair);
  }
});

test("precision travels with the point, and each kind stays its own kind", () => {
  const points = getVisitMapPoints("en");

  for (const point of points) {
    const expected = (AREA_PLACES as readonly string[]).includes(point.slug)
      ? "area"
      : (SETTLEMENT_PLACES as readonly string[]).includes(point.slug)
        ? "settlement"
        : "site";
    expect(point.precision, point.slug).toBe(expected);
  }

  /*
    Asserted as a set as well as per point, which is not redundant.

    The loop above passes if a `site` place were quietly promoted to `area` *and*
    added to `AREA_PLACES` in the same edit — the two would agree with each other
    and disagree with the registry's meaning. Pinning the membership separately is
    what makes widening this list a decision rather than a way to make a test go
    green.
  */
  expect(
    points.filter((point) => point.precision === "area").map((point) => point.slug).sort(),
    "exactly two places are centroids of large features",
  ).toEqual([...AREA_PLACES].sort());
  expect(
    points.filter((point) => point.precision === "settlement").map((point) => point.slug).sort(),
    "exactly one place is a town centre",
  ).toEqual([...SETTLEMENT_PLACES].sort());
});

test("the settlement marker is generic, and its type reaches the accessible name", async ({
  page,
}) => {
  /*
    §51's only map-component change, pinned as narrowly as it was made.

    `settlement` had no glyph because the taxonomy had never had a rendered member,
    so the marker fell back to the bare pin. A glyph was added — two blocks on a
    ground line — and that is the whole edit. What this test guards is that the
    edit stayed generic: the same pin as every other type, one glyph path, and the
    localized type still carried in words rather than only in the drawing.

    There is no Gyumri-specific anything to assert, which is the point. The marker
    is selected by `data-place-type`, not by slug.
  */
  await page.goto("/en/visit");
  await openMap(page);

  const marker = page.locator('[data-slug="gyumri"]');
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveAttribute("data-place-type", "settlement");

  /*
    §52. Selecting it now shows Gyumri's own file — the inversion of §51, where the
    selected card correctly showed no image at all. Asserted here, beside the marker
    identity, because the panel is the one surface where the settlement marker and
    the settlement artwork meet, and because a selected card that silently borrowed
    a neighbour's cover would look completely finished.
  */
  const panel = mapSection(page).locator("[aria-live='polite']");
  await marker.focus();
  await marker.press("Enter");
  await expect(panel.locator("img")).toHaveAttribute("src", /gyumri\.webp/);
  await expect(panel.locator("svg[role='img']"), "no placeholder in the panel").toHaveCount(0);
  await expect(
    panel.getByRole("link", { name: bundle("en").pages.visit.mapCta, exact: true }),
  ).toHaveAttribute("href", "/en/places/gyumri");
  for (const borrowed of ["bagratid-armenia", "erebuni-fortress", "dilijan-national-park"]) {
    await expect(
      panel.locator(`img[src*="${borrowed}"]`),
      `${borrowed} must not illustrate the Gyumri panel`,
    ).toHaveCount(0);
  }

  // The accessible name is the localized title and the localized type, in every
  // edition — the guarantee that shape and colour are never the only channel.
  for (const locale of ["en", "hy", "hyw"] as const) {
    await page.goto(`/${locale}/visit`);
    await openMap(page);

    const point = getVisitMapPoints(locale).find((entry) => entry.slug === "gyumri")!;
    const typeLabel = bundle(locale).placeTypes.find((filter) => filter.id === "settlement")!.label;

    await expect(page.locator(`[data-slug="gyumri"]`), locale).toHaveAttribute(
      "aria-label",
      `${point.title} — ${typeLabel}`,
    );
  }
});

test("the historical marker took no new glyph, and its type is localized", async ({ page }) => {
  /*
    §57's counterpart to the §51 settlement-marker test, and deliberately the
    *opposite* claim.

    §51 added one `TYPE_GLYPH` entry because `settlement` had never had a rendered
    member, and that test pins the edit as generic. §57 adds no component code at
    all: `historical` has had a glyph since §33, Amberd is the third article under
    it, and the marker must be indistinguishable from Erebuni's and Garni's except
    in position and name. There is nothing Amberd-specific to assert, which is the
    point — the marker is selected by `data-place-type`, not by slug.
  */
  await page.goto("/en/visit");
  await openMap(page);

  const marker = page.locator('[data-slug="amberd-fortress"]');
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveAttribute("data-place-type", "historical");

  // All three `historical` markers exist and share the one type attribute.
  await expect(page.locator('[data-slug][data-place-type="historical"]')).toHaveCount(3);

  /*
    Selecting it opens Amberd and shows *no* image — the branch §52 said Place #11
    would need. A selected card that quietly borrowed a neighbour's cover to fill
    the gap would look completely finished, which is why the two named below are
    checked by name: Erebuni is the other archaeological `historical` place, and
    Tatev is the walled-enclosure-above-a-gorge that `PENDING_ARTWORK` records as
    the closest refused substitute.
  */
  const panel = mapSection(page).locator("[aria-live='polite']");
  await marker.focus();
  await marker.press("Enter");
  await expect(panel).toContainText(bundle("en").articles.find((a) => a.slug === "amberd-fortress")!.title);
  await expect(panel.locator("img"), "no artwork while pending").toHaveCount(0);
  for (const borrowed of ["erebuni-fortress", "tatev-monastery", "garni-temple", "bagratid-armenia"]) {
    await expect(
      panel.locator(`img[src*="${borrowed}"]`),
      `${borrowed} must not illustrate the Amberd panel`,
    ).toHaveCount(0);
  }
  await expect(
    panel.getByRole("link", { name: bundle("en").pages.visit.mapCta, exact: true }),
  ).toHaveAttribute("href", "/en/places/amberd-fortress");

  // And the accessible name is the localized title and the localized type, in every
  // edition — shape and colour are never the only channel.
  for (const locale of ["en", "hy", "hyw"] as const) {
    await page.goto(`/${locale}/visit`);
    await openMap(page);

    const point = getVisitMapPoints(locale).find((entry) => entry.slug === "amberd-fortress")!;
    const typeLabel = bundle(locale).placeTypes.find((filter) => filter.id === "historical")!.label;

    await expect(page.locator('[data-slug="amberd-fortress"]'), locale).toHaveAttribute(
      "aria-label",
      `${point.title} — ${typeLabel}`,
    );
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
  test(`[${locale}] the visit hub renders the map section and every mapped place`, async ({
    page,
  }) => {
    const copy = bundle(locale).pages.visit;
    await page.goto(`/${locale}/visit`);

    await expect(page.getByRole("heading", { name: copy.mapTitle, level: 2 })).toBeVisible();
    await expect(mapSection(page)).toHaveCount(1);

    // The non-map list carries every mapped place, with a locale-correct link each.
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

  /*
    Selected from the keyboard rather than the mouse, from §47 onward.

    Tatev is a degree of latitude south of everything else, so the derived bounds
    zoom out by roughly 3.6x to hold it — and at that scale two pairs of pins
    genuinely overlap: Erebuni with the Matenadaran (about 6 km apart) and Garni
    with Geghard (about 8 km). A reader can still reach either of an overlapping
    pair, by clicking the exposed part or by zooming in; a mouse click aimed at an
    element's centre cannot, because the centre is behind the other pin.

    So the loop drives the keyboard path, which is a real supported interaction —
    the markers are `role="button"` with `tabindex="0"` and a keypress handler,
    asserted a few tests above — and which does not depend on z-order. The
    assertion is not weakened: every place must still be selectable and must still
    show its own article. `force: true` was the alternative and was rejected, since
    it would have asserted that a click *dispatched* at a covered element works,
    which is not a thing any reader does.

    The overlap itself is recorded as a finding in §47 rather than fixed here:
    fixing it would mean changing the marker-derived bounds, which this step is
    explicitly not allowed to touch.
  */
  for (const slug of PLACES) {
    const marker = page.locator(`[data-slug="${slug}"]`);
    await marker.focus();
    await marker.press("Enter");

    const article = bundle("en").articles.find((entry) => entry.slug === slug)!;
    await expect(panel, slug).toContainText(article.title);

    /*
      §52: every place has a picture again, Gyumri included, so the first branch is
      the one that runs for all ten.

      The split is kept rather than collapsed into the `registered` branch, and the
      record now runs three for three: §47 needed the `else` for Tatev, §49 for
      Dilijan, §51 for Gyumri, and each time the step before had it and was told it
      could be deleted. The `else` is the stronger of the two claims — an
      unillustrated place must show *no* image in this panel, which is what catches
      a neighbour's cover leaking in to fill the gap — and Place #11 will need it.
    */
    const registered = getImageSrc(slug);
    if (registered) {
      const own = registered.split("/").pop()!;
      await expect(panel.locator("img"), `${slug} artwork`).toHaveAttribute(
        "src",
        new RegExp(own.replace(".", "\\.")),
      );
    } else {
      await expect(panel.locator("img"), `${slug} has no artwork to show`).toHaveCount(0);
    }

    // No other place's file in the panel at the same time.
    for (const other of PLACES) {
      if (other === slug) continue;
      const otherFile = getImageSrc(other);
      if (!otherFile) continue;
      const borrowed = otherFile.split("/").pop()!;
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

  /*
    And no credential in any of them. The provider is authenticated by its
    registered domain, so a key appearing in a live request would mean the
    integration had quietly changed shape — checked on parsed parameter names,
    not on the URL text, so a style slug containing "key" cannot trip it.
  */
  expect(external.length, "the map made requests to check").toBeGreaterThan(0);
  for (const url of external) {
    expect(credentialParamsIn(url), `credential parameter in ${new URL(url).pathname}`).toEqual([]);
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
