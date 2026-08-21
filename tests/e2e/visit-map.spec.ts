import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getPlaceCoordinateRegistry } from "@/data/geo";
import { ALL_FILTER_ID } from "@/data/types";
import {
  clusterByScreenDistance,
  type ClusterInput,
  MARKER_HALF_HEIGHT,
  MARKER_HALF_WIDTH,
  spreadOffsets,
} from "@/lib/map-cluster";
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

  /*
    §59. The twelfth marker, and the second `settlement`.

    Jermuk is on this map for the same reason as everything above it: it is a Places
    article with a coordinate, and nothing in `visit-map.ts`, `map-tiles.ts`,
    `VisitMap.tsx` or the map's data path was touched to admit it. The map went 11 to
    12 by an article and a registry entry existing, which is the property this list
    tests. There is no allow-list to add it to and no new marker type: it is
    `settlement`, so it draws the glyph §51 added for Gyumri and §59 did not touch.

    It is the second addition in a row that stretches the extent in *no* direction.
    Tatev pulled the box south, Dilijan north, Gyumri north-west; Amberd sat inside
    all three edges and Jermuk sits inside them too — south of Lake Sevan, west of
    Tatev, north of Khor Virap's latitude only by a little, and nowhere near a
    boundary. The bounds are marker-derived, so a twelfth marker inside the existing
    box must leave the framing untouched.

    It is also the most isolated point on this map: its nearest neighbour is Lake
    Sevan, 67 km away, against the six and eight kilometres that produce the two
    known overlapping pairs. A new collision involving it is close to impossible,
    which is a prediction the overlap measurement below either confirms or refutes
    rather than an assumption it is allowed to make.
  */
  "jermuk",
  /*
    §64. Haghpat is the thirteenth marker and the first since §51 to move a derived
    bound: it is the northernmost point in the registry, so the box the map frames
    grows northward rather than gaining another pin inside the existing frame.

    It is also the fifth `monastery`, which is the largest that glyph group has been.
    No new glyph was added and none was needed.
  */
  "haghpat-monastery",
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
const SETTLEMENT_PLACES = ["gyumri", "jermuk"] as const;

/**
 * The five `monastery` markers, as of §64.
 *
 * Pinned as a list rather than counted, for the same reason `SETTLEMENT_PLACES` is:
 * the glyph is shared, so a marker rendered with the wrong type would still draw and
 * still be clickable, and only the membership shows it.
 */
const MONASTERY_PLACES = [
  "khor-virap",
  "etchmiadzin-cathedral",
  "geghard-monastery",
  "tatev-monastery",
  "haghpat-monastery",
] as const;

const NOT_MAPPED = {
  cuisine: ["lavash", "dolma", "khorovats", "gata", "harissa", "ghapama", "spas"],
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
  // Either kind of thing counts as the map having drawn — §65 means the first
  // element on it may be a group rather than a place.
  await expect(page.locator("[data-slug], [data-cluster]").first()).toBeVisible();
}

/**
 * Bring one place's own marker onto the map, the way a reader reaches it — §65.
 *
 * Before §65 every place had a marker from the first frame, six of them piled on
 * top of each other, and two could not be clicked at all. Now the map draws seven
 * markers and two groups at the initial extent, and the six places inside those
 * groups are reached by opening the group they are in. That is the interaction
 * this helper performs and that most of the tests below depend on: it is not a
 * convenience, it *is* the behaviour under test, which is why it asserts at every
 * step rather than polling until something appears.
 *
 * Both activation paths are exercised, because they are separate guarantees. A
 * pointer click is what §64 broke; `focus()` + Enter is what kept the map usable
 * while it was broken, and neither is allowed to regress.
 *
 * The loop is bounded. A group that opens into a smaller group is expected — one
 * zoom step does not always separate five places — but a group that never opens
 * is the failure this whole step exists to prevent, so it must end in an
 * assertion rather than in a timeout.
 */
async function reveal(
  page: import("@playwright/test").Page,
  slug: string,
  how: "pointer" | "keyboard" = "pointer",
) {
  const marker = page.locator(`[data-slug="${slug}"]`);

  for (let step = 0; step < 5; step += 1) {
    if ((await marker.count()) === 1) return marker;

    // Exactly one group, addressed by membership rather than by position: the
    // key is the sorted member slugs, space-separated, so `~=` is an exact
    // word match and not a substring guess.
    const group = page.locator(`[data-cluster~="${slug}"]`);
    await expect(group, `${slug} is drawn either as itself or inside one group`).toHaveCount(1);

    if (how === "pointer") {
      await group.click();
    } else {
      await group.focus();
      await group.press("Enter");
    }

    // The group opened. Asserting its disappearance is what makes the loop
    // meaningful — without it a click that did nothing would just spin.
    await expect(group, `activating a group must open it`).toHaveCount(0);
  }

  await expect(marker, `${slug} is reachable in at most five activations`).toHaveCount(1);
  return marker;
}

/**
 * Everything the map currently draws, and whether any of it covers anything else.
 *
 * Hit-tested with `elementFromPoint` at each element's own centre, which is the
 * measurement §64 used to prove the regression and therefore the one that has to
 * prove it closed. Restricted to elements whose centre is inside the map's own
 * box: a marker scrolled out of the container after a zoom is not covered, it is
 * simply elsewhere, and `elementFromPoint` cannot tell the difference.
 */
const surveyMap = () => {
  const box = document.querySelector(".leaflet-container")!.getBoundingClientRect();
  const drawn = [...document.querySelectorAll("[data-slug][data-place-type], [data-cluster]")];

  const centre = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  };

  return {
    markers: drawn
      .filter((element) => element.hasAttribute("data-slug"))
      .map((element) => element.getAttribute("data-slug")!)
      .sort(),
    clusters: drawn
      .filter((element) => element.hasAttribute("data-cluster"))
      .map((element) => ({
        key: element.getAttribute("data-cluster")!,
        count: Number(element.getAttribute("data-cluster-count")),
        label: element.getAttribute("aria-label"),
        slugs: element.getAttribute("data-cluster")!.split(" "),
      })),
    covered: drawn
      .filter((element) => {
        const { x, y } = centre(element);
        return x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
      })
      .map((element) => {
        const { x, y } = centre(element);
        const hit = document.elementFromPoint(x, y)?.closest("[data-slug], [data-cluster]");
        const id = element.getAttribute("data-slug") ?? element.getAttribute("data-cluster");
        const owner = hit?.getAttribute("data-slug") ?? hit?.getAttribute("data-cluster") ?? null;
        return owner === id ? null : `${id} <- ${owner}`;
      })
      .filter((entry): entry is string => entry !== null),
  };
};

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

    §59 is the second of those in a row. Jermuk is well inside the same box — Tatev
    is both further south and further east, Gyumri further north and west — so the
    framing is again unchanged and the claim is again about visibility rather than
    extent. Two consecutive additions that move no edge is the state this test was
    written to be able to distinguish from an addition that quietly retunes one.

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

  expect(getVisitMapPoints("en").length, "the thirteenth place is on the map").toBe(PLACES.length);

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

    /*
      §65 changes what "every marker" means without weakening the claim.

      Six of the thirteen places are now inside a group at the initial extent, so
      iterating slugs would assert that a thing which deliberately is not drawn is
      drawn. What the derived bounds must still guarantee is the same as it always
      was — nothing the map draws falls outside the frame it fitted — so the loop
      runs over what is actually on the map, and a separate assertion, in the
      overlap test below, keeps every place accounted for exactly once.
    */
    const drawn = page.locator("[data-slug][data-place-type], [data-cluster]");
    const count = await drawn.count();
    expect(count, `the map draws something at ${width}px`).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const element = drawn.nth(index);
      const id =
        (await element.getAttribute("data-slug")) ?? (await element.getAttribute("data-cluster"));
      const box = await element.boundingBox();
      expect(box, `${id} is rendered at ${width}px`).not.toBeNull();
      expect(box!.x, `${id} left of the map at ${width}px`).toBeGreaterThanOrEqual(
        container!.x - 1,
      );
      expect(box!.y, `${id} above the map at ${width}px`).toBeGreaterThanOrEqual(container!.y - 1);
      expect(box!.x + box!.width, `${id} right of the map at ${width}px`).toBeLessThanOrEqual(
        container!.x + container!.width + 1,
      );
      expect(box!.y + box!.height, `${id} below the map at ${width}px`).toBeLessThanOrEqual(
        container!.y + container!.height + 1,
      );
    }
  }
});

/**
 * The pairs that used to overlap, kept as the record of what was fixed — §65.
 *
 * §47 found the first two, when Tatev zoomed the map out to hold a marker a degree
 * further south. The §62 audit measured fourteen at 360, 390 and 768 px and
 * established that the standing two-pair figure had only ever described 1440. §64
 * then made the two numbers one: Haghpat pushed the northern edge of the fitted box
 * into Lori, the zoom dropped a level, and the central group collapsed identically
 * at every width. None of the fourteen involved Haghpat; it moved an extreme rather
 * than joining a crowd.
 *
 * Two of those fourteen were not merely untidy. `elementFromPoint` at the centre of
 * Garni's marker returned Geghard, and at the centre of Erebuni's returned the
 * Matenadaran, so a pointer aimed at the middle of either landed on a different
 * place — which is why the exhaustive selection tests below had to drive the
 * keyboard instead of the mouse from §47 onward.
 *
 * §65 fixes it generically, and this list stays as the thing the fix is measured
 * against: every pair here is now either separated or drawn as one group, and the
 * tests below assert the *consequence* — that nothing covers anything, and that all
 * thirteen places are independently reachable by pointer and by keyboard.
 */
const OVERLAPPED_BEFORE_CLUSTERING = [
  ["amberd-fortress", "etchmiadzin-cathedral"],
  ["amberd-fortress", "matenadaran"],
  ["erebuni-fortress", "etchmiadzin-cathedral"],
  ["erebuni-fortress", "garni-temple"],
  ["erebuni-fortress", "geghard-monastery"],
  ["erebuni-fortress", "khor-virap"],
  ["erebuni-fortress", "matenadaran"],
  ["etchmiadzin-cathedral", "khor-virap"],
  ["etchmiadzin-cathedral", "matenadaran"],
  ["garni-temple", "geghard-monastery"],
  ["garni-temple", "khor-virap"],
  ["garni-temple", "matenadaran"],
  ["geghard-monastery", "khor-virap"],
  ["geghard-monastery", "matenadaran"],
] as const;

/** The two whose centres were actually covered, and therefore unclickable. */
const UNCLICKABLE_BEFORE_CLUSTERING = ["erebuni-fortress", "garni-temple"] as const;

test("nothing the map draws covers anything else, at every width", async ({ page }) => {
  /*
    The direct inversion of the §64 test this replaces, and the reason §65 exists.

    That test asserted which two marker centres were covered. This one asserts that
    none is — hit-tested the same way, at the same four widths, over *everything the
    map draws* rather than over markers alone. Including the group glyphs matters:
    the cheap way to make an overlap count go to zero is to draw something new on
    top of the pile, and this would catch that.

    The counts are reported rather than pinned, deliberately. How many groups a
    given width produces is a function of the container, the pin size and the
    coordinates, and pinning it would turn an icon change into a red suite. What is
    pinned is the property that matters to a reader: every place is accounted for
    exactly once, and nothing is hidden behind anything.
  */
  test.slow();

  expect(getVisitMapPoints("en").length, "thirteen places on the map").toBe(PLACES.length);

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/visit");
    await openMap(page);

    const state = await page.evaluate(surveyMap);
    const biggest = Math.max(0, ...state.clusters.map((cluster) => cluster.count));
    console.log(
      `  ${width}px — ${state.markers.length} markers, ${state.clusters.length} groups, largest ${biggest}: ` +
        state.clusters.map((cluster) => `${cluster.count} [${cluster.key}]`).join(", "),
    );

    // Nothing covered. This is the assertion §64's counterpart could not make.
    expect(state.covered, `nothing is covered at ${width}px`).toEqual([]);

    /*
      Every place is drawn exactly once, as itself or inside exactly one group.
      A place that fell out of the map entirely would otherwise satisfy the
      assertion above perfectly.
    */
    const accounted = [
      ...state.markers,
      ...state.clusters.flatMap((cluster) => cluster.slugs),
    ].sort();
    expect(accounted, `all thirteen places are drawn at ${width}px`).toEqual([...PLACES].sort());
    expect(new Set(accounted).size, `no place is drawn twice at ${width}px`).toBe(PLACES.length);

    // A group of one would be a group glyph standing in for a single place, which
    // hides a name behind a number for no reason.
    for (const cluster of state.clusters) {
      expect(cluster.count, `${cluster.key} is a real group`).toBeGreaterThan(1);
      expect(cluster.count, `${cluster.key} counts its members`).toBe(cluster.slugs.length);
    }

    /*
      And the specific pairs §64 recorded are gone as *pairs of drawn markers*:
      either they are in one group now, or they are far enough apart to draw. Both
      are acceptable outcomes; both being visible and overlapping is not.
    */
    for (const [a, b] of OVERLAPPED_BEFORE_CLUSTERING) {
      if (!state.markers.includes(a) || !state.markers.includes(b)) continue;
      const boxes = await Promise.all(
        [a, b].map((slug) => page.locator(`[data-slug="${slug}"]`).boundingBox()),
      );
      const [first, second] = boxes;
      if (!first || !second) continue;
      const dx = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
      const dy =
        Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);
      expect(
        dx > 0 && dy > 0,
        `${a} and ${b} are both drawn at ${width}px and still overlap`,
      ).toBe(false);
    }
  }
});

test("the four places that collided are each independently pointer-selectable", async ({
  page,
}) => {
  /*
    The regression, closed at the level a reader experiences it — §65.

    §64's test proved that a pointer aimed at the middle of Garni's marker hit
    Geghard, and at the middle of Erebuni's hit the Matenadaran. Deleting that test
    would have left the fix unmeasured, so it is transformed rather than removed:
    the same four places, the same pointer, and the full sequence a reader performs
    — open the group, activate the exact place, read its card.

    Each place starts from a fresh view on purpose. Opening a group zooms into it,
    so a loop that stayed on one page would be testing thirteen progressively
    different maps, and the state that has to work is the one a reader arrives in.

    Both directions of each formerly-covering pair are exercised, because "Garni is
    selectable" and "Garni is selectable *and shows Garni*" are different claims and
    only the second one failed in §64.
  */
  test.slow();

  const copy = bundle("en").pages.visit;
  const collided = [
    ...UNCLICKABLE_BEFORE_CLUSTERING,
    "geghard-monastery",
    "matenadaran",
  ] as const;

  for (const slug of collided) {
    await page.goto("/en/visit");
    await openMap(page);

    const marker = await reveal(page, slug, "pointer");
    await marker.click();

    const panel = mapSection(page).locator("[aria-live='polite']");
    const article = bundle("en").articles.find((entry) => entry.slug === slug)!;
    await expect(panel, slug).toContainText(article.title);

    // Not the neighbour that used to swallow the click.
    for (const other of collided) {
      if (other === slug) continue;
      const neighbour = bundle("en").articles.find((entry) => entry.slug === other)!;
      await expect(panel, `${slug} must not show ${other}`).not.toContainText(neighbour.title);
    }

    await expect(
      panel.getByRole("link", { name: copy.mapCta, exact: true }),
      slug,
    ).toHaveAttribute("href", `/en/places/${slug}`);
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
    "the town centres",
  ).toEqual([...SETTLEMENT_PLACES].sort());
});

test("the five monastery markers share one glyph, and Haghpat took no new one", async ({
  page,
}) => {
  /*
    §64. `monastery` is now the largest type on the map, and this is the assertion
    that keeps that from being invisible.

    §51 added one `TYPE_GLYPH` entry because `settlement` had never had a rendered
    member. §64 adds no component code at all: `monastery` has had a glyph since the
    map was built, Haghpat is its fifth article, and its marker must be
    indistinguishable from the other four except in position and name. There is
    nothing Haghpat-specific to assert, which is the point.

    Membership is pinned rather than counted because the failure that matters is a
    marker rendered with the wrong type — it would still draw, still be clickable and
    still look right.
  */
  await page.goto("/en/visit");
  await openMap(page);

  /*
    Narrowed to monasteries first — §65.

    Two of the five sit inside a group at the unfiltered extent, so counting
    `data-place-type="monastery"` markers on the whole map would count three.
    Filtering is not a workaround for that: it is the cheaper of the two ways to
    put all five on the map at once, and it makes this test say something extra
    that is worth saying — the groups recompute from the filtered set, so five
    monasteries spread far enough apart to draw individually where thirteen
    places did not.
  */
  await mapSection(page).locator('[data-map-filter="monastery"]').click();

  const markers = page.locator('[data-slug][data-place-type="monastery"]');
  await expect(markers).toHaveCount(MONASTERY_PLACES.length);
  await expect(page.locator("[data-cluster]"), "five monasteries need no group").toHaveCount(0);

  const slugs = await markers.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-slug") ?? ""),
  );
  expect(slugs.sort(), "the five monasteries").toEqual([...MONASTERY_PLACES].sort());

  // Selecting Haghpat opens Haghpat and shows no image — the `else` branch again,
  // and the four names checked here are the four covers a borrowed file would most
  // plausibly come from, because every one of them is a walled stone complex.
  const panel = mapSection(page).locator("[aria-live='polite']");
  const haghpat = page.locator('[data-slug="haghpat-monastery"]');
  await haghpat.click();
  await expect(panel).toContainText(
    bundle("en").articles.find((a) => a.slug === "haghpat-monastery")!.title,
  );
  /*
    §66 inverts the §64 assertion here. The panel showed no image while Haghpat was
    pending; it now shows Haghpat's own file, and the four refusals stay exactly as
    they were — this is a map card, and the four covers listed below are the ones a
    borrowed file would most plausibly come from, because every one of them is a
    walled stone complex seen from above.
  */
  await expect(panel.locator("img"), "its own artwork").toHaveCount(1);
  await expect(panel.locator("img")).toHaveAttribute("src", /haghpat-monastery\.webp/);
  for (const borrowed of [
    "tatev-monastery",
    "geghard-monastery",
    "khor-virap",
    "etchmiadzin-cathedral",
  ]) {
    await expect(
      panel.locator(`img[src*="${borrowed}"]`),
      `${borrowed} must not illustrate the Haghpat panel`,
    ).toHaveCount(0);
  }
  await expect(
    panel.getByRole("link", { name: bundle("en").pages.visit.mapCta, exact: true }),
  ).toHaveAttribute("href", "/en/places/haghpat-monastery");
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

    §59 is the step that proves it: Jermuk is the second `settlement` and it took no
    component change at all. Both markers are asserted below, and the count is the
    assertion that matters — a glyph added for one article and then special-cased for
    the next would still pass a test that looked only at Gyumri.
  */
  await page.goto("/en/visit");
  await openMap(page);

  const marker = page.locator('[data-slug="gyumri"]');
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveAttribute("data-place-type", "settlement");

  // Both settlements exist and share the one type attribute — §59.
  await expect(page.locator('[data-slug][data-place-type="settlement"]')).toHaveCount(2);
  await expect(page.locator('[data-slug="jermuk"]')).toHaveAttribute(
    "data-place-type",
    "settlement",
  );

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

  /*
    §65: Amberd shares a group with Etchmiadzin at the initial extent, so it is
    reached the way a reader reaches it. The claim is unchanged — the marker that
    comes out of that group carries the shared `historical` type and nothing of
    its own.
  */
  const marker = await reveal(page, "amberd-fortress");
  await expect(marker).toHaveAttribute("data-place-type", "historical");

  // All three `historical` markers exist and share the one type attribute, once
  // the filter has put them all on the map at once.
  await mapSection(page).locator('[data-map-filter="historical"]').click();
  for (const slug of ["erebuni-fortress", "garni-temple", "amberd-fortress"]) {
    await reveal(page, slug);
  }
  await expect(page.locator('[data-slug][data-place-type="historical"]')).toHaveCount(3);
  await mapSection(page).locator(`[data-map-filter="${ALL_FILTER_ID}"]`).click();

  /*
    §58. Selecting it now shows Amberd's own file — the inversion of §57, where the
    selected card correctly showed no image at all, and the branch §52 predicted
    Place #11 would exercise in both directions. It is asserted here, beside the
    marker identity, because the panel is the one surface where the `historical`
    marker and the `historical` artwork meet.

    A selected card that quietly borrowed a neighbour's cover would look completely
    finished, which is why the four below are still checked by name: Erebuni is the
    other archaeological `historical` place, Garni the third, and Tatev and Ani are
    the two closest refused substitutes `PENDING_ARTWORK` records. Registration is
    when that failure becomes possible rather than when it stops mattering.
  */
  const panel = mapSection(page).locator("[aria-live='polite']");
  await marker.focus();
  await marker.press("Enter");
  await expect(panel).toContainText(
    bundle("en").articles.find((a) => a.slug === "amberd-fortress")!.title,
  );
  await expect(panel.locator("img")).toHaveAttribute("src", /amberd-fortress\.webp/);
  await expect(panel.locator("svg[role='img']"), "no placeholder in the panel").toHaveCount(0);
  for (const borrowed of [
    "erebuni-fortress",
    "tatev-monastery",
    "garni-temple",
    "bagratid-armenia",
  ]) {
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

    // §65: opened out of its group first, in every edition — the grouping is not
    // locale-dependent, and a marker that came out of one had better be named.
    await expect(await reveal(page, "amberd-fortress"), locale).toHaveAttribute(
      "aria-label",
      `${point.title} — ${typeLabel}`,
    );
  }
});

test("the second settlement marker took no new glyph, and shows its own image", async ({
  page,
}) => {
  /*
    §59's counterpart to the §51 settlement-marker test, and deliberately the
    *opposite* claim — the same shape §57 used for the third `historical` place.

    §51 added one `TYPE_GLYPH` entry because `settlement` had never had a rendered
    member, and that test pins the edit as generic. §59 adds no component code at
    all: `settlement` has had a glyph since §51, Jermuk is the second article under
    it, and the marker must be indistinguishable from Gyumri's except in position and
    name. There is nothing Jermuk-specific to assert, which is the point.
  */
  await page.goto("/en/visit");
  await openMap(page);

  const marker = page.locator('[data-slug="jermuk"]');
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveAttribute("data-place-type", "settlement");

  /*
    Selecting it opens Jermuk and now shows its own file — §60 inverting the `else`
    branch §59 asserted here, and the twelfth selected card to carry artwork.

    A selected card that quietly borrowed a neighbour's cover would look completely
    finished, which is why the four below are still checked by name: Gyumri is the
    other `settlement` and the only urban image in the registry, Dilijan is the other
    town with a spa history, and Tatev and Lake Sevan are the gorge and the highland
    water that `PENDING_ARTWORK` recorded as refused.

    They mattered most between §60 and §61, when Jermuk's own cover was off-subject by
    decision and repointing this slug at one of them would have read as a correction
    rather than a regression. §61 replaced that file with an aerial view of the town,
    so the pressure is gone — and Gyumri is now the sharper name of the four rather
    than the softer one, because the two `settlement` covers are both urban and could
    be swapped without either card looking wrong.
  */
  const panel = mapSection(page).locator("[aria-live='polite']");
  await marker.focus();
  await marker.press("Enter");
  await expect(panel).toContainText(
    bundle("en").articles.find((a) => a.slug === "jermuk")!.title,
  );
  await expect(panel.locator("img"), "its own artwork").toHaveAttribute(
    "src",
    /jermuk\.webp/,
  );
  for (const borrowed of ["gyumri", "dilijan-national-park", "tatev-monastery", "lake-sevan"]) {
    await expect(
      panel.locator(`img[src*="${borrowed}"]`),
      `${borrowed} must not illustrate the Jermuk panel`,
    ).toHaveCount(0);
  }
  await expect(
    panel.getByRole("link", { name: bundle("en").pages.visit.mapCta, exact: true }),
  ).toHaveAttribute("href", "/en/places/jermuk");

  // And the accessible name is the localized title and the localized type, in every
  // edition — shape and colour are never the only channel.
  for (const locale of ["en", "hy", "hyw"] as const) {
    await page.goto(`/${locale}/visit`);
    await openMap(page);

    const point = getVisitMapPoints(locale).find((entry) => entry.slug === "jermuk")!;
    const typeLabel = bundle(locale).placeTypes.find((filter) => filter.id === "settlement")!.label;

    await expect(page.locator('[data-slug="jermuk"]'), locale).toHaveAttribute(
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

  /*
    §65: every place still has to be a named control, but six of them have to be
    revealed first. `reveal` is the reader's own path, so what this now asserts is
    slightly stronger than before — a marker that only exists after its group is
    opened must come out of that group fully formed, with its name, its type and
    its keyboard affordance intact, and not as a bare div the grouping code
    forgot to decorate.
  */
  for (const slug of PLACES) {
    const marker = await reveal(page, slug);
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

  // And with everything opened out, the map is showing all thirteen and no group.
  await expect(page.locator("[data-slug][data-place-type]")).toHaveCount(PLACES.length);
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

    /*
      Back on the pointer in §65, which is the point of §65.

      §47 moved this loop to the keyboard because the two pins overlapped; §64
      recorded that Geghard was actually covering the centre of Garni's marker and
      the Matenadaran was covering Erebuni's, so the mouse path was not merely
      awkward but wrong. Both are now inside one group at the initial extent, and
      opening it is what a reader does. Restoring the mouse here is the strongest
      statement this file can make that the regression is closed — if grouping ever
      stops separating this pair, this test goes red at the click rather than
      silently passing on a path readers do not take.
    */
    const marker = await reveal(page, chosen, "pointer");
    await marker.click();

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

test("every place can be selected with a pointer and shows its own image", async ({ page }) => {
  /*
    §65 gives this test a fresh map for each place, and that is not a workaround.

    Opening a group zooms into it. After two or three places the map is looking at
    one valley, the rest of the country is outside the container, and a click aimed
    at a marker that is positioned off the visible map lands on the page behind it
    — which is what happened on the first run of this version, in exactly those
    words. Reloading between places is not avoidance of that: the state every
    reader actually arrives in is the fitted extent, so testing thirteen
    resolutions *from* that state is the more faithful loop as well as the one that
    passes.

    It costs thirteen page loads, which is why the timeout is raised here rather
    than in the config. Raising it is not hiding a failure — nothing here retries,
    nothing is forced, and every one of the thirteen resolutions asserts its own
    result.
  */
  test.setTimeout(180_000);

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
    /*
      §65 restores the mouse here, and the long note above is now history rather
      than current practice: the overlap it describes is gone, and the places that
      were unreachable by pointer are reached by opening the group they are drawn
      in. `reveal` performs that opening and asserts it worked, so a group that
      refused to open fails here as loudly as a covered marker did.
    */
    await page.goto("/en/visit");
    await openMap(page);

    const marker = await reveal(page, slug, "pointer");
    await marker.click();

    const article = bundle("en").articles.find((entry) => entry.slug === slug)!;
    await expect(panel, slug).toContainText(article.title);

    /*
      §58: every place has a picture again, Amberd included, so the first branch is
      the one that runs for all eleven.

      The split is kept rather than collapsed into the `registered` branch, and the
      record now runs four for four: §47 needed the `else` for Tatev, §49 for
      Dilijan, §51 for Gyumri, §57 for Amberd, and each time the step before had it
      and was told it could be deleted. The `else` is the stronger of the two claims
      — an unillustrated place must show *no* image in this panel, which is what
      catches a neighbour's cover leaking in to fill the gap — and Place #12 will
      need it.
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
/*  Density grouping — §65                                                     */
/* -------------------------------------------------------------------------- */

test("the grouping is arithmetic over pixels, and knows nothing about Armenia", () => {
  /*
    The whole of §65's decision-making, tested without a browser.

    This is the reason the algorithm is a pure module rather than a closure inside
    `VisitMap`: the cases that must not go wrong are the ones the real registry
    cannot produce. Thirteen Armenian coordinates cannot express two places at the
    same point, and inventing a fourteenth Place to provoke one would be putting a
    fixture in the content registry to satisfy a test.
  */

  // A place inside another place's walls: same pixel, twice. Neither is dropped,
  // and the group carries both.
  const identical = clusterByScreenDistance([
    { slug: "outer", x: 200, y: 120 },
    { slug: "inner", x: 200, y: 120 },
    { slug: "far", x: 600, y: 400 },
  ]);
  expect(identical.map((group) => group.slugs.sort().join(" ")).sort()).toEqual([
    "far",
    "inner outer",
  ]);

  /*
    Order independence. The registry's order is editorial — section order in the
    articles file — and the map must not inherit it. Two enumerations of the same
    points produce the same groups.
  */
  const points = [
    { slug: "a", x: 100, y: 100 },
    { slug: "b", x: 112, y: 108 },
    { slug: "c", x: 400, y: 100 },
    { slug: "d", x: 405, y: 118 },
  ];
  const forward = clusterByScreenDistance(points).map((group) => group.key).sort();
  const backward = clusterByScreenDistance([...points].reverse())
    .map((group) => group.key)
    .sort();
  expect(forward).toEqual(backward);
  expect(forward).toEqual(["a b", "c d"]);

  /*
    The guarantee the whole step rests on: whatever comes out, no two results can
    cover each other. A pin is 28x38 with its centre 19 px above its anchor, so one
    centre is covered by another exactly when the two are within 14 px across and
    19 px down. Every surviving pair must clear that.
  */
  const spread: ClusterInput[] = [];
  for (let i = 0; i < 40; i += 1) {
    // A deterministic scatter, dense in one corner and sparse elsewhere, which is
    // the shape of the real problem: one crowded region and a long tail.
    spread.push({ slug: `p${i}`, x: (i * 37) % 320, y: (i * 53) % 240 });
  }
  const groups = clusterByScreenDistance(spread);
  for (let i = 0; i < groups.length; i += 1) {
    for (let j = i + 1; j < groups.length; j += 1) {
      const covered =
        Math.abs(groups[i].x - groups[j].x) <= MARKER_HALF_WIDTH &&
        Math.abs(groups[i].y - groups[j].y) <= MARKER_HALF_HEIGHT;
      expect(covered, `${groups[i].key} and ${groups[j].key} would cover each other`).toBe(false);
    }
  }

  // Nothing is lost and nothing is duplicated, however dense the input.
  expect(groups.flatMap((group) => group.slugs).sort()).toEqual(
    spread.map((point) => point.slug).sort(),
  );

  /*
    And the last resort separates too. `spreadOffsets` is what runs when zooming
    cannot help — two places at one coordinate — and it is dead code in the current
    registry, which is precisely why it is asserted here instead of being assumed
    to work on the day it first runs.
  */
  for (let count = 2; count <= PLACES.length; count += 1) {
    const offsets = spreadOffsets(count);
    expect(offsets, `${count} offsets`).toHaveLength(count);
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        const covered =
          Math.abs(offsets[i].dx - offsets[j].dx) <= MARKER_HALF_WIDTH &&
          Math.abs(offsets[i].dy - offsets[j].dy) <= MARKER_HALF_HEIGHT;
        expect(covered, `spread of ${count}: ${i} and ${j} still cover`).toBe(false);
      }
    }
  }
});

test("no place, province or coordinate is named in the grouping code", () => {
  /*
    §64's regression was caused by a generic rule meeting a new extreme, and the
    tempting fix was a specific one — a Yerevan group, a nudged coordinate, a
    hand-tuned zoom for thirteen places. This is the test that refuses all of them,
    and it reads the source rather than the behaviour because that is where the
    shortcut would be visible on the day it is written.
  */
  const cluster = readFileSync("src/lib/map-cluster.ts", "utf8");
  const component = readFileSync("src/components/visit/VisitMap.tsx", "utf8");

  for (const slug of PLACES) {
    expect(cluster, `${slug} must not be named in the grouping`).not.toContain(`"${slug}"`);
    expect(component, `${slug} must not be named in the map component`).not.toContain(
      `"${slug}"`,
    );
  }

  /*
    And no province standing in for a slug. Checked against the code with its
    comments removed, because the comments in both files *explain* §64 and have to
    be able to say "Haghpat", "Lori" and "the Ararat–Kotayk cluster" to do it. What
    must not exist is a line of logic that knows any of those words.
  */
  const code = (source: string) => source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  for (const word of ["Yerevan", "Kotayk", "Ararat", "Armenia", "Lori", "Haghpat"]) {
    expect(code(component), `${word} must not appear in map component code`).not.toContain(word);
    expect(code(cluster), `${word} must not appear in grouping code`).not.toContain(word);
  }

  /*
    And no hardcoded viewport. The bounds stay derived from the markers, which is
    the decision §64 proved costly and §65 keeps anyway: the alternative is a fixed
    national box, and choosing one is an editorial claim about where Armenian sites
    are, made inside a component.
  */
  expect(component, "the extent is still fitted to the markers").toContain("fitBounds");
  expect(component, "no hardcoded centre").not.toMatch(/setView\(\s*\[/);
  expect(cluster, "the grouping never touches coordinates").not.toContain("lat");
});

test("the map groups what it cannot draw apart, and says how many", async ({ page }) => {
  /*
    §65's positive claim, stated where a reader would see it: at the extent the map
    fits to, some places are drawn as a group, and the group says how many places
    it stands for.

    The counts are read from the DOM and checked against the group's own membership
    rather than pinned to a number, for the reason given in the overlap test — how
    many groups a width produces is a function of geometry, and pinning it would
    make an icon change a failure. What is pinned is that a group is a real control
    with a real name: `role="button"`, keyboard-reachable, and labelled in words
    rather than as a bare numeral.
  */
  await page.goto("/en/visit");
  await openMap(page);

  const groups = page.locator("[data-cluster]");
  await expect(groups, "the dense centre is grouped at the fitted extent").not.toHaveCount(0);

  const count = await groups.count();
  for (let index = 0; index < count; index += 1) {
    const group = groups.nth(index);
    const key = (await group.getAttribute("data-cluster"))!;
    const members = key.split(" ");

    await expect(group, key).toHaveAttribute("role", "button");
    await expect(group, key).toHaveAttribute("tabindex", "0");
    await expect(group, key).toHaveAttribute("data-cluster-count", String(members.length));

    // "4 places", not "4". A screen reader must not be handed a bare quantity.
    const label = (await group.getAttribute("aria-label"))!;
    expect(label, `${key} is labelled in words`).toBe(
      bundle("en").pages.visit.mapClusterLabel.replace("{count}", String(members.length)),
    );
    expect(label.trim(), `${key} is not just a number`).not.toMatch(/^\d+$/);

    // Every member is a real Place, and none of them is drawn twice.
    for (const slug of members) {
      expect(PLACES, `${slug} is a Place`).toContain(slug);
      await expect(page.locator(`[data-slug="${slug}"]`), `${slug} is inside ${key}`).toHaveCount(
        0,
      );
    }

    // A group is navigation, not content: selecting one must not produce a card.
    expect(label, `${key} must not read as an article`).not.toContain(
      bundle("en").pages.visit.mapCta,
    );
  }
});

test("a group opens from the keyboard and hands focus to what it revealed", async ({ page }) => {
  /*
    The accessibility half of §65, and the reason it is not the clustering library.

    `leaflet.markercluster` contains no `role`, no `aria-` and no `tabindex` in its
    entire source, and on Enter it returns focus to the map container — which is
    precisely the focus loss this test forbids. The group here is a labelled button
    that answers Enter and Space, and when it opens it moves focus to the first
    place it revealed, so a keyboard reader is left on something rather than on
    `<body>`.
  */
  const panel = mapSection(page).locator("[aria-live='polite']");

  for (const key of ["Enter", " "] as const) {
    await page.goto("/en/visit");
    await openMap(page);

    const group = page.locator("[data-cluster]").first();
    const members = (await group.getAttribute("data-cluster"))!.split(" ");

    await group.focus();
    await expect(group, "the group takes focus").toBeFocused();
    await group.press(key);
    await expect(group, `${key} opens the group`).toHaveCount(0);

    /*
      Focus landed on something inside the map, and specifically on a place that
      was in the group — not on the body, not on the container, not nowhere.
    */
    const landed = await page.evaluate(() => ({
      slug: document.activeElement?.getAttribute("data-slug") ?? null,
      cluster: document.activeElement?.getAttribute("data-cluster") ?? null,
      tag: document.activeElement?.tagName ?? null,
    }));
    expect(landed.tag, `focus survived ${key}`).not.toBe("BODY");
    const settled = landed.slug ?? landed.cluster?.split(" ")[0] ?? null;
    expect(members, `focus landed inside the group after ${key}`).toContain(settled);

    // And Enter on the revealed place selects it — the group is a way through.
    if (landed.slug) {
      await page.locator(`[data-slug="${landed.slug}"]`).press("Enter");
      const article = bundle("en").articles.find((entry) => entry.slug === landed.slug)!;
      await expect(panel, landed.slug).toContainText(article.title);
    }
  }
});

test("every place can be selected from the keyboard, group or no group", async ({ page }) => {
  /*
    The §64 escape route, kept as a guarantee rather than as a workaround.

    While the pointer path was broken, keyboard activation was the only way to
    reach Garni and Erebuni, and the exhaustive selection test drove it for that
    reason. §65 fixes the pointer and this test keeps the keyboard, because "still
    works" is a claim that only survives if something checks it: the whole of the
    grouping — the group button, the expansion, the focus handoff and the marker
    that comes out — has to be operable without a mouse for all thirteen.
  */
  test.setTimeout(180_000);

  const panel = mapSection(page).locator("[aria-live='polite']");

  for (const slug of PLACES) {
    await page.goto("/en/visit");
    await openMap(page);

    const marker = await reveal(page, slug, "keyboard");
    await marker.focus();
    await expect(marker, slug).toBeFocused();
    await marker.press("Enter");

    const article = bundle("en").articles.find((entry) => entry.slug === slug)!;
    await expect(panel, slug).toContainText(article.title);
    await expect(
      panel.getByRole("link", { name: bundle("en").pages.visit.mapCta, exact: true }),
      slug,
    ).toHaveAttribute("href", `/en/places/${slug}`);
  }
});

test("filtering regroups from the visible markers, and leaves nothing stale", async ({ page }) => {
  /*
    A group must count what the reader can see, and nothing else — §65.

    The failure this guards against is specific and easy to write: groups computed
    once at mount, then left alone while the filter hides markers underneath them.
    The map would show "4 places" over a filtered view containing one, and the
    number would be a lie about a set the reader had explicitly narrowed.

    The other half is the return path. Narrowing and widening again must restore
    exactly the opening state, with no group left behind from the intermediate
    view — which is what `expanded` being cleared on every filter change is for.
  */
  await page.goto("/en/visit");
  await openMap(page);

  const opening = await page.evaluate(surveyMap);
  expect(opening.clusters.length, "the unfiltered map groups something").toBeGreaterThan(0);

  for (const type of bundle("en").placeTypes) {
    if (type.id === ALL_FILTER_ID) continue;

    await mapSection(page).locator(`[data-map-filter="${type.id}"]`).click();

    const expected = getVisitMapPoints("en")
      .filter((point) => point.placeTypeId === type.id)
      .map((point) => point.slug)
      .sort();

    await expect(
      page.locator("[data-map-list] li"),
      `${type.id}: the list narrows too`,
    ).toHaveCount(expected.length);

    const state = await page.evaluate(surveyMap);

    // Every place of this type is drawn exactly once, and nothing else is.
    const accounted = [
      ...state.markers,
      ...state.clusters.flatMap((cluster) => cluster.slugs),
    ].sort();
    expect(accounted, `${type.id}: exactly this type is drawn`).toEqual(expected);

    // No group counts a marker the filter has hidden.
    for (const cluster of state.clusters) {
      expect(cluster.count, `${type.id}: ${cluster.key} counts its members`).toBe(
        cluster.slugs.length,
      );
      for (const slug of cluster.slugs) {
        expect(expected, `${type.id}: ${slug} is hidden but counted in ${cluster.key}`).toContain(
          slug,
        );
      }
    }

    // And nothing is covered in the narrowed view either.
    expect(state.covered, `${type.id}: nothing covered`).toEqual([]);
  }

  await mapSection(page).locator(`[data-map-filter="${ALL_FILTER_ID}"]`).click();
  await expect(page.locator("[data-map-list] li")).toHaveCount(PLACES.length);

  const restored = await page.evaluate(surveyMap);
  expect(restored.markers, "returning to All restores the same markers").toEqual(opening.markers);
  expect(
    restored.clusters.map((cluster) => cluster.key).sort(),
    "returning to All restores the same groups, and adds no stale one",
  ).toEqual(opening.clusters.map((cluster) => cluster.key).sort());
});

test("the group label is a real string in every edition, and names no place", () => {
  /*
    Static, because a string's existence in three editions is a data invariant and
    dragging three browsers through it would prove nothing extra.

    The last clause is the one worth having. A group label is *spatial* — it means
    "these are close together on this screen at this zoom", which is not a fact
    about Armenia — so it must not name a city, a province or a region, in any
    edition. That is the difference between a map that scales and a map that has to
    be re-captioned every time a Place is added.
  */
  for (const locale of LOCALES) {
    const template = bundle(locale).pages.visit.mapClusterLabel;

    expect(template, `${locale} has a group label`).toBeTruthy();
    expect(template, `${locale} interpolates the count`).toContain("{count}");

    // A number and a word, not a bare number.
    const rendered = template.replace("{count}", "4");
    expect(rendered, `${locale}: "${rendered}" is more than a numeral`).not.toMatch(/^\s*\d+\s*$/);
    expect(rendered.length, `${locale}: "${rendered}" carries a noun`).toBeGreaterThan(3);

    for (const place of getVisitMapPoints(locale)) {
      expect(template, `${locale} must not name ${place.slug}`).not.toContain(place.title);
    }
    for (const word of ["Yerevan", "Երևան", "Երեւան", "Kotayk", "Կոտայք", "Lori", "Լոռի"]) {
      expect(template, `${locale} must not name ${word}`).not.toContain(word);
    }
  }

  // The two Armenian editions were written separately; neither is the English one.
  expect(bundle("hy").pages.visit.mapClusterLabel).not.toBe(
    bundle("en").pages.visit.mapClusterLabel,
  );
  expect(bundle("hyw").pages.visit.mapClusterLabel).not.toBe(
    bundle("en").pages.visit.mapClusterLabel,
  );
});

test("groups are localized on the rendered map, not only in the dictionary", async ({ page }) => {
  /*
    One browser assertion per edition, and no more: the interaction is tested
    exhaustively in English above, and repeating it three times would triple the
    slowest tests in this file to prove a string lookup. What has to be seen in a
    browser is that the label the component renders is this edition's, which is the
    failure a dictionary test cannot catch — a hardcoded English fallback would
    pass every static check in the file above.
  */
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/visit`);
    await openMap(page);

    const group = page.locator("[data-cluster]").first();
    const members = (await group.getAttribute("data-cluster"))!.split(" ");

    await expect(group, locale).toHaveAttribute(
      "aria-label",
      bundle(locale).pages.visit.mapClusterLabel.replace("{count}", String(members.length)),
    );

    if (locale !== "en") {
      await expect(group, `${locale} must not fall back to English`).not.toHaveAttribute(
        "aria-label",
        bundle("en").pages.visit.mapClusterLabel.replace("{count}", String(members.length)),
      );
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
  // §65: Garni is inside a group at the initial extent, so it is opened first.
  // What this test is about is that neither opening a group nor selecting a place
  // asks for a location — the new interaction is covered by the same claim.
  const garni = await reveal(page, "garni-temple", "pointer");
  await garni.click();

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
