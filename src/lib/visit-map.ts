import { getPlacePoint, type PlacePoint } from "@/data/geo";
import type { Locale } from "@/data/types";
import { getArticlesByCategory } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { getArticleImageSrc } from "@/lib/media";

/**
 * The map's view of a Place — derived, never authored.
 *
 * Every field here already exists somewhere else and is read from there: the
 * slug, type, title and summary from the article, the position from
 * `PLACE_COORDINATES`, the route from `localePath`, the picture from the media
 * registry. Nothing on this shape is a second copy of anything, which is the
 * rule that keeps a map from quietly becoming a third content database with its
 * own stale titles.
 *
 * `precision` travels with the point deliberately. It is the difference between
 * "the pin is the building" and "the pin is the middle of a lake", and a
 * renderer that drops the same pin on both asserts an accuracy Lake Sevan's
 * coordinate does not have. See the note on `PlacePoint` in `data/geo.ts`.
 */
export interface VisitMapPoint {
  slug: string;
  lat: number;
  lon: number;
  precision: PlacePoint["precision"];
  placeTypeId: string;
  title: string;
  summary: string;
  href: string;
  imageSrc?: string;
}

/**
 * Every Place article in this edition that has a coordinate, in section order.
 *
 * The set is **derived** — `places articles ∩ PLACE_COORDINATES` — rather than a
 * second seven-slug allow-list. A curated list would be a third place to
 * remember when the eighth place ships, and the two would disagree silently.
 *
 * The exclusion rule for a Place with no coordinate is *exclude, explicitly*,
 * not "render at 0,0" and not "throw". It is written this way because the
 * invariant is already enforced upstream and enforced harder than a render-time
 * throw could be:
 *
 * - `validate:content` fails on any Places article missing from
 *   `PLACE_COORDINATES`, and rejects `0, 0` by name as the placeholder pair;
 * - a test asserts this function returns one point per Places article, so a
 *   silently shortened map fails rather than merely looking sparse.
 *
 * Throwing here would move that failure from a validation run into a production
 * build of an unrelated page, and would still be a worse signal than the two
 * checks above. What must never happen — a place appearing at a made-up
 * position — cannot happen either way.
 *
 * A Place with no `placeTypeId` is excluded on the same terms: the marker and
 * the filter both key off it, and a marker with no kind is not a marker this map
 * knows how to draw. `validateFilterCoverage` is the upstream gate there.
 */
export function getVisitMapPoints(locale: Locale): VisitMapPoint[] {
  const points: VisitMapPoint[] = [];

  for (const article of getArticlesByCategory(locale, "places")) {
    const point = getPlacePoint(article.slug);
    if (!point || !article.placeTypeId) continue;

    points.push({
      slug: article.slug,
      lat: point.lat,
      lon: point.lon,
      precision: point.precision,
      placeTypeId: article.placeTypeId,
      title: article.title,
      summary: article.excerpt,
      href: localePath(locale, article.href),
      imageSrc: getArticleImageSrc(article),
    });
  }

  return points;
}
