import type { Filter } from "@/data/types";

/**
 * Site-type filters for the places listing.
 *
 * Two entries, because there is one article. A filter list is a promise that
 * every pill leads somewhere, and `validateFilterCoverage` fails the build over
 * a pill that matches nothing — so `museum`, `nature`, `historical` and
 * `settlement` are not written here in advance of the articles that would earn
 * them. Each arrives in the same change as its first article.
 *
 * Ids are shared across the three editions, as with every other filter list;
 * only the labels are translated.
 */
export const placeTypes: Filter[] = [
  { id: "all", label: "All places" },
  { id: "monastery", label: "Monasteries and churches" },
];
