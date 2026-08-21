import type { Filter } from "@/data/types";

/**
 * Site-type filters for the places listing.
 *
 * A filter list is a promise that every pill leads somewhere, and
 * `validateFilterCoverage` fails the build over a pill that matches nothing — so
 * each id arrives in the same change as its first article: `historical` with
 * Erebuni Fortress, `museum` with the Matenadaran, `nature` with Lake Sevan, and
 * `settlement` with Gyumri.
 *
 * `settlement` is the one that waited longest. It was named in this comment for
 * five steps as the example of a pill that must not be written in advance of the
 * article that would earn it, and it was named again in `geo.ts` as a `precision`
 * value nothing used. Gyumri is that article: a whole inhabited city rather than
 * a building, an enclosure or a landscape. The pill and the coordinate precision
 * now mean the same thing and are both in use.
 *
 * `nature` rather than `landscape`: the articles under it are about a lake and a
 * forest as physical and ecological systems, and a pill named for scenery would
 * set the wrong expectation for the mountains, rivers and gorges that will
 * follow them.
 *
 * Ids are shared across the three editions, as with every other filter list;
 * only the labels are translated.
 */
export const placeTypes: Filter[] = [
  { id: "all", label: "All places" },
  { id: "monastery", label: "Monasteries and churches" },
  { id: "historical", label: "Historical sites" },
  { id: "museum", label: "Museums" },
  { id: "nature", label: "Nature" },
  { id: "settlement", label: "Towns and cities" },
];
