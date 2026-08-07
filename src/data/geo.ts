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
 * Each value is taken from OpenStreetMap, or from a gazetteer derived from it,
 * and names the built complex itself rather than a car park, a village centre or
 * a nearby road junction.
 *
 * **The rounding is deliberate.** Four decimal places is about 11 metres, which
 * is finer than anything here needs and coarse enough not to imply a survey that
 * was never done. A gazetteer position carried out to five or six places would
 * assert a precision the source does not have; it is rounded on the way in, not
 * on the way out, so nothing downstream can reintroduce the false digits.
 *
 * The repository has no structured mechanism for citing a coordinate the way
 * `sources.ts` cites a claim, and this file is deliberately not inventing one
 * for a single entry. The provenance of each value is the comment beside it.
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
   * - `site`       — a specific built complex: a church, an enclosure, a
   *                  fortress. The point is the thing itself, not the place it
   *                  is near.
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
  // The monastery complex — the walled enclosure with Surb Astvatsatsin and the
  // chapel over the pit — on its hill above the Ararat plain, Ararat Province.
  // OpenStreetMap places it at 39.87836, 44.57615; rounded to four places here.
  "khor-virap": { lat: 39.8784, lon: 44.5762, precision: "site" },

  // The Mother Cathedral itself, inside the walled precinct of the Mother See at
  // Vagharshapat, Armavir Province — not the centre of the town, which lies a few
  // hundred metres north. OpenStreetMap way 133909119 (`Էջմիածնի Մայր Տաճար`,
  // amenity=place_of_worship) gives 40.1618404, 44.2911157; rounded to four places
  // here. Wikipedia's infobox agrees at 40°09′43″N 44°17′28″E.
  "etchmiadzin-cathedral": { lat: 40.1618, lon: 44.2911, precision: "site" },

  // The excavated Urartian citadel on the hill of Arin Berd, at the south-eastern
  // edge of Yerevan — not the Erebuni Museum-Reserve at the foot of the hill, not
  // the Erebuni administrative district, and not Erebuni airport, which lies some
  // seven kilometres west-south-west and would look entirely plausible on a map.
  // OpenStreetMap way 445380061 (`Էրեբունու ամրոց`, historic=archaeological_site)
  // gives 40.1403049, 44.5381466; rounded to four places here. Wikipedia's infobox
  // agrees at 40°08′26″N 44°32′17″E.
  "erebuni-fortress": { lat: 40.1403, lon: 44.5381, precision: "site" },

  // The Matenadaran building and its precinct at the head of Mesrop Mashtots
  // Avenue — not the statue of Mashtots on the terrace in front of it, not the
  // Cascade complex a few hundred metres west, and not the avenue as a whole,
  // which runs the length of central Yerevan. OpenStreetMap relation 20960090
  // (`Երևանի Մատենադարան`, tourism=museum, 53 Mesrop Mashtots Avenue) gives
  // 40.1924614, 44.5222091; rounded to four places here. Wikipedia's infobox
  // agrees to within about a hundred metres at 40°11′31″N 44°31′16″E.
  matenadaran: { lat: 40.1925, lon: 44.5222, precision: "site" },

  // The first `area` entry, and the reason that value exists in the union at all.
  // A point on Lake Sevan is a centroid, not a place anyone stands: the lake is
  // L-shaped, with the small north-western arm bent away from the large
  // south-eastern one, so "the centre" is a convention rather than a fact.
  //
  // OpenStreetMap relation 36956 (`Սևանա լիճ`, natural=water, water=lake) gives
  // 40.3925199, 45.3460867; rounded to four places here. The point was checked to
  // be *in the water* rather than merely near it — an Overpass `is_in` query at
  // the rounded value returns the lake polygon itself, together with Sevan
  // National Park. Wikidata Q181932 puts its own point at 40.3106, 45.3492, some
  // nine kilometres south and also inside the lake, which is corroboration of the
  // area and a fair illustration of why this entry is not `site`.
  //
  // Deliberately not any of these: Sevan town at 40.5485, 44.9572; Sevanavank at
  // 40.5640, 45.0108; the resort strip along the north-western shore. All three
  // sit in the far corner of the lake, twenty-odd kilometres from the water this
  // point marks, and all three are what a search for "Lake Sevan" tends to return.
  "lake-sevan": { lat: 40.3925, lon: 45.3461, precision: "area" },

  // The classical building itself, on the promontory above the Azat gorge at
  // Garni, Kotayk Province. OpenStreetMap way 108255791 (`Գառնիի հեթանոսական
  // տաճար`, historic=archaeological_site, archaeological_site=roman_temple,
  // building=temple, wikidata=Q684072) gives a footprint whose centre is
  // 40.1123415, 44.7302188; rounded to four places here. Wikipedia's infobox
  // agrees to about ten metres at 40°06′44.7″N 44°43′49.0″E.
  //
  // `site` rather than `area`, and the rounding was checked rather than assumed:
  // the temple footprint is roughly 23 by 18 metres, and the rounded point still
  // falls inside both that polygon and the surrounding fortress enclosure
  // (OSM way 215286758, `Գառնիի ամրոց`). Four decimal places is about eleven
  // metres, which is inside a building this size — the one case in this file
  // where that had to be verified rather than reasoned about.
  //
  // Deliberately not any of these, all of which a search for "Garni" returns
  // ahead of the monument: Garni village centre, some 660 m north-east; the
  // Garni gorge, whose nominal point in Wikidata is the same as the village's,
  // about 1 km away; the basalt columns known as the Symphony of Stones, 0.9–1.1
  // km east; the nearest hotel, 280 m north; and Geghard, 8 km up the valley.
  //
  // Wikidata Q684072 carries its own point at 40.112, 44.729, but only to three
  // decimal places — about 110 m out, and coarser than this registry's rounding.
  // The OSM element was preferred for that reason, not for disagreement.
  "garni-temple": { lat: 40.1123, lon: 44.7302, precision: "site" },
};

/** The recorded position for a place slug, or `undefined` when none is held. */
export function getPlacePoint(slug: string): PlacePoint | undefined {
  return PLACE_COORDINATES[slug];
}

/** The whole registry, for the validation script. */
export function getPlaceCoordinateRegistry(): Readonly<Record<string, PlacePoint>> {
  return PLACE_COORDINATES;
}
