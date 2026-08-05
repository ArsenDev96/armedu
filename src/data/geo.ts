/**
 * Coordinates for Places articles, keyed by article slug.
 *
 * This is a registry rather than a field on `Article`, for the same reason
 * `IMAGES` in `lib/media.ts` is one: a coordinate is a property of the place,
 * not of an edition. Storing it in three locale bundles would be three copies
 * of a locale-invariant value, three chances to typo a digit, and a validator
 * rule to catch the copies drifting apart. Slugs are Latin and shared across
 * editions by design, so one registry serves all three.
 *
 * Nothing renders these yet. They are recorded now because a coordinate is
 * cheap to capture while an article is being written and expensive to backfill
 * across three files per place afterwards — and because a wrong one is far
 * easier to spot beside the prose that describes the site than a year later.
 *
 * **Current geography only.** These are present-day positions for locating a
 * real place on a modern map. They are not historical extents, not borders, and
 * not claims about any of those.
 *
 * ## Provenance
 *
 * Values are the published position for the site as carried by the open
 * geographic gazetteers (OpenStreetMap and Wikidata), rounded to four decimal
 * places — about 11 metres, which is finer than any use here needs and coarse
 * enough not to imply a survey that was never done.
 *
 * The repository has no structured mechanism for citing a coordinate the way
 * `sources.ts` cites a claim, and this file is deliberately not inventing one
 * for a single entry. **Every value below should be checked against an
 * authoritative gazetteer by an editor before anything renders a map**; that is
 * recorded as an open item in `PROJECT_STATE.md` §28.
 */

export interface PlacePoint {
  /** Decimal degrees, north positive. */
  lat: number;
  /** Decimal degrees, east positive. */
  lon: number;
  /**
   * What the point actually means, so a consumer does not read false precision
   * into it.
   *
   * - `site`       — a building or enclosure; the point is the thing itself.
   * - `settlement` — a town or village; the point is its centre, not an address.
   * - `area`       — a lake, a valley, a range; the point is a centroid, and a
   *                  map that drops a pin on it is marking the middle of a large
   *                  feature rather than a place a visitor stands.
   *
   * Recorded from the first entry because retrofitting it means revisiting every
   * place and asking what its coordinate was ever supposed to mean.
   */
  precision: "site" | "settlement" | "area";
}

export const PLACE_COORDINATES: Record<string, PlacePoint> = {
  // The monastery enclosure on its hill above the Ararat plain, Ararat Province.
  "khor-virap": { lat: 39.8783, lon: 44.5772, precision: "site" },
};

/** The recorded position for a place slug, or `undefined` when none is held. */
export function getPlacePoint(slug: string): PlacePoint | undefined {
  return PLACE_COORDINATES[slug];
}

/** The whole registry, for the validation script. */
export function getPlaceCoordinateRegistry(): Readonly<Record<string, PlacePoint>> {
  return PLACE_COORDINATES;
}
