import type { Filter } from "@/data/types";

/**
 * Site-type filters for the places listing.
 *
 * Five entries, because there are five articles. A filter list is a promise
 * that every pill leads somewhere, and `validateFilterCoverage` fails the build
 * over a pill that matches nothing — so `settlement` is not written here in
 * advance of the article that would earn it. Each id arrives in the same change
 * as its first article: `historical` with Erebuni Fortress, `museum` with the
 * Matenadaran, `nature` with Lake Sevan.
 *
 * `nature` rather than `landscape`: the article under it is about a lake as a
 * physical and ecological system, and a pill named for scenery would set the
 * wrong expectation for the mountains, rivers and gorges that will follow it.
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
];
