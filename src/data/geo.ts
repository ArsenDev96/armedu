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

  // The walled monastic enclosure in its side gorge above the Azat, at the head of
  // the road up from Goght, Kotayk Province. The point is the courtyard, with the
  // gavit some ten metres off and the Katoghike church twenty. OpenStreetMap way
  // 405284197 (`Գեղարդի վանք`, name:en=Geghard Monastery, amenity=monastery,
  // historic=church, denomination=armenian_apostolic, ref:whc=960, wikidata=Q499285)
  // encloses roughly 86 by 107 metres; its polygon centroid is 40.1404170,
  // 44.8183600, rounded to four places here. There is no OSM relation for the
  // complex — the only relation within 600 m is the car park — so the way is the
  // complex-level entity, and Nominatim resolves "Geghard Monastery" to that way.
  //
  // Six independent candidate points were found and they span twenty-one metres:
  // the OSM centroid above; Wikidata Q499285 at 40.140468, 44.818594 (18 m);
  // UNESCO's own N40 8 25.58 E44 49 6.69 for World Heritage property 960, which is
  // 40.140439, 44.818525 (11 m); and the Nominatim label point (8 m). All six fall
  // inside the enclosure polygon, and so does the rounded value stored here — that
  // was tested rather than assumed, as it was for Garni above.
  //
  // Deliberately not any of these, in rising order of how easy each is to reach for:
  // the souvenir stalls at 50 m and the visitor car park at 80 m, both of which sit
  // *outside* the enclosure where this point sits inside it; the viewpoint at 190 m;
  // the two restaurants on the approach at 460 and 775 m; Geghard village at 2.4 km
  // and Goght at 2.8 km; Garni, 8.1 km down the valley and the entry directly above
  // this one; the Azat reservoir, 19 km away.
  //
  // The likeliest wrong answer here is not a landmark but a gazetteer record.
  // Wikidata Q17155656 is named "Monastery of Geghard and the Upper Azat Valley"
  // and carries the World Heritage id 960 — so it is exactly what a search for the
  // property's official name returns — and its point, 40.15889, 44.79667, is
  // Geghard *village*, 2.8 km from the monastery. The monument item is Q499285.
  "geghard-monastery": { lat: 40.1404, lon: 44.8184, precision: "site" },
  // The monastic complex on its basalt shelf above the Vorotan gorge, by the village
  // of Tatev, Syunik Province — the first point in this registry south of Lake Sevan,
  // and by some distance the southernmost.
  //
  // OpenStreetMap node 505725848 (`Տաթևի վանք`, tourism=attraction, addressed to
  // Tatev, Tatev Municipality, Syunik) is at 39.3794315, 46.2501314, rounded to four
  // places here. Wikidata Q554947 (P625) independently gives 39.379366, 46.250031.
  // The two agree to about nine metres, which is inside the four-decimal rounding
  // this file stores and well inside the enclosure, so no adjudication was needed.
  //
  // Deliberately not any of these, and the first two are the traps:
  // the Wings of Tatev aerial tramway — OSM way 109650729 resolves to 39.3989804,
  // 46.2735973, which is at Shinuhayr some 3 km north-east, and it is what a search
  // for the site's best-known modern feature returns; Halidzor, the tramway's lower
  // station across the gorge; Tatev village centre, a settlement point rather than a
  // site one; the gorge itself, which is an `area` feature and not what this records;
  // Tatevi Anapat, the seventeenth-century hermitage lower in the same valley, which
  // shares the Tentative List entry with the monastery and is a genuinely different
  // monument; the road approach and its parking.
  //
  // `site` rather than `area` despite the dramatic setting: the gorge is the context,
  // the enclosure is the subject, and a reader following this point arrives at the
  // buildings rather than at the middle of a landscape.
  "tatev-monastery": { lat: 39.3794, lon: 46.2501, precision: "site" },

  // The second `area` entry, and the first point in this registry that had to be
  // *computed* rather than looked up. Dilijan National Park is a protected
  // landscape of some 33,765 hectares in Tavush, and no gazetteer holds a point
  // that is both defensible and near the middle of it.
  //
  // OpenStreetMap relation 7594000 (`Դիլիջան ազգային պարկ`, name:en=Dilijan
  // National Park, boundary=protected_area, protect_class=2, leisure=nature_reserve,
  // wikidata=Q1984244) is the outline used. Its four outer rings were stitched and
  // the area-weighted polygon centroid computed on an equirectangular projection
  // about the polygon's own mean latitude: 40.741695, 44.931181, rounded to four
  // places here. The rounded value was then tested back against the polygon by
  // ray casting and falls *inside* it — checked rather than assumed, as it was for
  // Garni and Geghard.
  //
  // Two independent cross-checks, both consistent:
  //   - the bounding-box centre of the same outline is 40.73670, 44.94545, about
  //     1.3 km away and also inside the park;
  //   - Wikidata Q1984244 (P625) gives 40.65639, 45.02139, which is inside the park
  //     too but about 12 km south-east of the centroid, in the Getik ground rather
  //     than near the middle. It corroborates the region and is a fair illustration
  //     of why this entry is `area` and why the gazetteer point was not adopted.
  //
  // The same computation puts the outline at about 352 km², which is the order of
  // the administration's 33,765 ha and not of the 240 km² that reference works and
  // Wikidata still carry. That disagreement is discussed in the article; it is
  // recorded here because it is the reason a mapped boundary was preferred to a
  // gazetteer point in the first place.
  //
  // **The latitude coincidence is not a copy.** OSM's own label point for the town
  // of Dilijan is 40.7417126, 44.8722210, which rounds to the same 40.7417 as the
  // centroid stored here. The longitudes differ by 0.059°, about 5.0 km, and the
  // town is *outside* the park polygon — the boundary is drawn around the inhabited
  // ground rather than over it. Anyone auditing this file will notice the matching
  // latitude before anything else, so it is written down: the two points were
  // derived independently and are five kilometres apart.
  //
  // Deliberately not any of these, and the first is the one every search returns:
  // Dilijan town centre, above; the park administration's office in the town;
  // Haghartsin, 7.5 km north-west of this point; Goshavank, 5.7 km south-east and
  // in fact just outside the mapped boundary at the village of Gosh; Parz Lake,
  // 2.6 km north-east, which is the park's most photographed feature and sits in
  // the same forest as the red deer enclosure; the Akhnabad yew grove, which is a
  // separate 25 ha sanctuary and not part of the park at all; any trailhead, hotel
  // or road junction on the Dilijan approach.
  "dilijan-national-park": { lat: 40.7417, lon: 44.9312, precision: "area" },

  // The first `settlement` entry, and the reason that value has been in the union
  // since the file was written. Gyumri is a living city of some hundred thousand
  // people spread over tens of square kilometres, so this point is neither a
  // building nor a centroid of a natural feature: it is the conventional position
  // a gazetteer holds for the city, and a map that drops a pin on it is marking
  // *the city*, not a place a visitor stands.
  //
  // OpenStreetMap node 130037434 (`Գյումրի`, place=city, capital=4,
  // wikidata=Q199500) is at 40.7852085, 43.8416095; rounded to four places here.
  // That node is OSM's settlement point for Gyumri — the label node the boundary
  // relation is built around — rather than any structure inside it.
  //
  // Two independent geographic representations were checked and both corroborate
  // at city scale, which is the only scale this point claims:
  //   - GeoNames 616635 (`Gyumri`, feature class P, Shirak) gives 40.7930545,
  //     43.8463497, about 1.0 km north-north-east and well inside the built-up
  //     area;
  //   - Wikidata Q199500 (P625) gives 40°47′N 43°50′E — 40.78333, 43.83333 — some
  //     0.7 km west-south-west, and carried only to whole arc-minutes, which is
  //     coarser than this registry's rounding and is why the OSM node was
  //     preferred rather than adjudicated against.
  // Three points inside a kilometre of each other, in a city roughly seven
  // kilometres across, is agreement rather than a disagreement to resolve.
  //
  // Deliberately not any of these, and the first three are what a search for
  // "Gyumri" tends to surface ahead of the settlement point itself: the Black
  // Fortress on the high ground, which is a Russian imperial military work and not
  // the city; Vartanants Square, which is visually central and is a square rather
  // than a city; the railway station, and Shirak airport some 5 km south-east,
  // both of which are transport infrastructure and would look entirely plausible
  // on a map. Also excluded: the municipality building, the cathedral of Yot Verk,
  // any tourist information point, and the Kumayri reserve — the last of which is
  // a real legal boundary but is the *historic core*, roughly a fifth of the city,
  // and pinning it would answer a different question from the one this registry
  // asks.
  //
  // `settlement` rather than `site` or `area`, and the distinction is the whole
  // reason the union has three members: a monastery enclosure has a point, a lake
  // has only a centroid, and a city has a conventional centre that is neither.
  gyumri: { lat: 40.7852, lon: 43.8416, precision: "settlement" },

  // The castle at the point of the spur, on the southern slopes of Mount Aragats
  // in Aragatsotn — the fortress itself, not the ensemble's outer edge and not
  // the church two hundred metres away.
  //
  // OpenStreetMap relation 15757106 (`Ամբերդ (Amberd Fortress)`, name:en=Amberd
  // Fortress, historic=castle, castle_type=fortress, building=castle, ruins=yes,
  // wikidata=Q457057) is a multipolygon of the castle walls whose Nominatim label
  // point is 40.3884555, 44.2262728; rounded to four places here. The rounded
  // value was tested back against the relation's own outer ring by ray casting
  // and falls *inside* it — checked rather than assumed, as it was for Garni,
  // Geghard and Dilijan. The ring is about 62 by 52 metres, so four decimal
  // places is comfortably inside the building.
  //
  // Cross-checked against Wikidata Q457057 (P625), which gives 40.3887278,
  // 44.226526 — about 32 m from the value stored here and also on the castle.
  // Two independent representations agreeing to a third of the building's width
  // is corroboration rather than a disagreement to adjudicate, and the OSM
  // element was preferred because it is a mapped footprint rather than a point.
  //
  // Deliberately not any of these, and the first two are the traps a gazetteer
  // lookup for the bare word "Amberd" actually returns:
  //   - the **Amberd river** (OSM relation 16475076), whose label point is 0.21 km
  //     from the castle — close enough to look right on a map and a watercourse
  //     rather than a monument;
  //   - **Amberd village** in Vagharshapat community, Armavir (OSM way 894495861),
  //     17 km south-east on the plain, which is a different settlement entirely;
  //   - the **peak named Amberd** on the Aragats massif (OSM node 2479027163),
  //     8.2 km north-west, which is a summit and not a monument;
  //   - **Vahramashen church** (OSM way 498609239, wikidata=Q2507423) at
  //     40.3877490, 44.2285125, 205 m east-south-east. It is the photographed
  //     building, it is the one with a date on it, and it is a component of the
  //     complex rather than the complex — the single likeliest wrong answer here;
  //   - the visitor infrastructure clustered 110–140 m north-west of the castle:
  //     the car park, the café, the toilets, the information boards and the
  //     viewpoints. All are outside the walls where this point sits inside them;
  //   - **Byurakan**, the village 6.6 km south-east that every description gives
  //     the fortress a bearing from, and **Mount Aragats** itself, which is a
  //     massif and would be an `area` point for a different subject.
  //
  // `site` rather than `area` despite the reserve around it covering 45.07
  // hectares: the reserve is the protection, the fortress is the subject, and a
  // reader following this point arrives at the castle rather than at the middle
  // of a protected boundary.
  "amberd-fortress": { lat: 40.3885, lon: 44.2263, precision: "site" },
};

/** The recorded position for a place slug, or `undefined` when none is held. */
export function getPlacePoint(slug: string): PlacePoint | undefined {
  return PLACE_COORDINATES[slug];
}

/** The whole registry, for the validation script. */
export function getPlaceCoordinateRegistry(): Readonly<Record<string, PlacePoint>> {
  return PLACE_COORDINATES;
}
