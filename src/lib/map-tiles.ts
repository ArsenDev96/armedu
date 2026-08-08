/**
 * The basemap under the Visit map — the one place a tile provider is named.
 *
 * ## Why this file exists
 *
 * Leaflet is the renderer and stays the renderer. What sits *underneath* the
 * markers is a different decision entirely, and a replaceable one: the tiles are
 * a third-party service with its own terms, its own coverage of Armenia and its
 * own attribution requirement. Before this module the URL and the attribution
 * were two string literals inside `VisitMap`, which meant swapping provider
 * would have been an edit to component logic — the sort of edit that quietly
 * leaves the old provider's copyright line behind.
 *
 * So: one shape, one resolver, and a component that renders whatever it is
 * handed. Not a provider framework — there is exactly one basemap, and adapters,
 * registries and plugin points for a set of size one are architecture for its
 * own sake. The bar this clears is only that changing provider is a change to
 * configuration rather than to code.
 *
 * ## What is *not* decided here
 *
 * The production basemap vendor. That choice depends on current terms, pricing,
 * Armenia coverage, attribution obligations and expected traffic, and none of
 * those belong in a source file. The default below is a development fallback and
 * is documented as one — see `DEVELOPMENT_FALLBACK`.
 */

export type MapTileConfig = {
  /** Leaflet URL template. Must contain the `{z}`, `{x}` and `{y}` placeholders. */
  url: string;
  /** Rendered by Leaflet's attribution control. Never empty — see `resolveMapTileConfig`. */
  attribution: string;
  /** Highest zoom the provider serves. */
  maxZoom?: number;
};

/**
 * The development default: the public OpenStreetMap tile endpoint.
 *
 * This is an external community service run by the OpenStreetMap Foundation,
 * not infrastructure Armat operates or has an agreement with. It is here so a
 * fresh checkout has a working map with no configuration and no account, and it
 * should be replaced by a configured provider before meaningful production
 * traffic. Nothing about its availability or its limits is asserted here,
 * because nothing about them is Armat's to assert.
 */
const DEVELOPMENT_FALLBACK: MapTileConfig = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 17,
};

/** Leaflet substitutes these; a template missing any of them produces 404s. */
const REQUIRED_PLACEHOLDERS = ["{z}", "{x}", "{y}"] as const;

const trimmed = (value: string | undefined) => (value ?? "").trim();

/**
 * Turn raw environment strings into a usable config, or into `null`.
 *
 * `null` is the *predictable failure*. The alternatives were both worse than no
 * map at all:
 *
 * - falling back to the development provider when a production URL is malformed
 *   would serve OpenStreetMap tiles while the operator believes their own
 *   provider is live, and would only surface as a bill or a block much later;
 * - keeping the previous provider's attribution when the URL changes would put
 *   the wrong copyright line under someone else's tiles, which is the one
 *   failure mode a licence actually punishes.
 *
 * Hence the rules: URL and attribution are configured together or not at all,
 * the template must contain the placeholders Leaflet substitutes, and the
 * attribution must be non-empty. A `null` here means the caller renders no tile
 * layer and says so — the server-rendered list of places is unaffected either
 * way, which is why refusing is safe.
 *
 * Exported separately from the resolved value so it can be tested directly
 * rather than through `process.env`.
 */
export function resolveMapTileConfig(env: {
  url?: string;
  attribution?: string;
  maxZoom?: string;
}): MapTileConfig | null {
  const url = trimmed(env.url);
  const attribution = trimmed(env.attribution);

  // Nothing configured: the documented development fallback.
  if (!url && !attribution) return DEVELOPMENT_FALLBACK;

  // Half-configured is a mistake, not a default.
  if (!url || !attribution) return null;

  if (!REQUIRED_PLACEHOLDERS.every((token) => url.includes(token))) return null;

  const maxZoom = Number(trimmed(env.maxZoom) || DEVELOPMENT_FALLBACK.maxZoom);
  if (!Number.isInteger(maxZoom) || maxZoom < 1 || maxZoom > 22) return null;

  return { url, attribution, maxZoom };
}

/**
 * The configuration this build runs with.
 *
 * All three variables are `NEXT_PUBLIC_` and all three are meant to be public:
 * a tile URL is visible in every network request the browser makes, and an
 * attribution line is visible on the map by design. If a provider ever requires
 * a browser token it goes in the URL here and is public in exactly the same
 * way — a browser-visible tile token is not a secret, and the private half of
 * this repository's environment (`SMTP_*`, see `.env.example`) must stay
 * unprefixed. No provider token is configured today.
 *
 * Read as full literals because Next inlines `process.env.NEXT_PUBLIC_*` by
 * textual substitution at build time; a computed lookup would resolve to
 * `undefined` in the browser.
 */
export const MAP_TILES: MapTileConfig | null = resolveMapTileConfig({
  url: process.env.NEXT_PUBLIC_MAP_TILE_URL,
  attribution: process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION,
  maxZoom: process.env.NEXT_PUBLIC_MAP_TILE_MAX_ZOOM,
});
