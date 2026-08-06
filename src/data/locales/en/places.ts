import type { Filter } from "@/data/types";

/**
 * Site-type filters for the places listing.
 *
 * Four entries, because there are four articles. A filter list is a promise
 * that every pill leads somewhere, and `validateFilterCoverage` fails the build
 * over a pill that matches nothing — so `nature` and `settlement` are not
 * written here in advance of the articles that would earn them. Each arrives in
 * the same change as its first article: `historical` with Erebuni Fortress,
 * `museum` with the Matenadaran.
 *
 * Ids are shared across the three editions, as with every other filter list;
 * only the labels are translated.
 */
export const placeTypes: Filter[] = [
  { id: "all", label: "All places" },
  { id: "monastery", label: "Monasteries and churches" },
  { id: "historical", label: "Historical sites" },
  { id: "museum", label: "Museums" },
];
