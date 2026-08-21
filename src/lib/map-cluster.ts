/**
 * Screen-space grouping for the Visit map's markers.
 *
 * ## The problem this exists for
 *
 * The map frames itself from the markers it holds — `fitBounds` over
 * `PLACE_COORDINATES`, never a hardcoded Armenia box — which is the right
 * decision and has one consequence: *adding a place anywhere can change the
 * scale everywhere.* §64 is the demonstration. Haghpat sits further north than
 * anything else in the registry, it overlaps nothing, and adding it still took
 * desktop from two overlapping marker pairs to fourteen, because the fitted box
 * grew into Lori, the zoom dropped a level, and the Ararat–Kotayk group
 * collapsed into itself. Two markers ended up with their centres covered by a
 * neighbour, so a pointer aimed at Garni selected Geghard.
 *
 * The fix has to be generic for the same reason the bug was: no list of slugs,
 * no "Yerevan group", no nudged coordinates. What collides is *pixels*, and what
 * pixels a coordinate occupies depends on a zoom level nobody authored. So the
 * grouping is computed from projected positions, every time the view changes,
 * and knows nothing about Armenia, provinces or place types.
 *
 * ## Why this file is pure
 *
 * Nothing here touches Leaflet, the DOM or React. It takes points in container
 * pixels and returns groups in container pixels. That is what makes the
 * degenerate cases — two places at the same coordinate, a place inside another
 * place's complex — testable without a browser and without inventing a fake
 * fourteenth Place to provoke them. The component owns projection and rendering;
 * this owns the arithmetic.
 */

/** A marker's projected position, in container pixels. */
export interface ClusterInput {
  slug: string;
  /** Container-pixel position of the marker's visual centre. */
  x: number;
  y: number;
}

/** One rendered thing: either a lone marker (`slugs.length === 1`) or a group. */
export interface ClusterGroup {
  /** Member slugs, in registry order. */
  slugs: string[];
  /** Centroid of the members, in container pixels. */
  x: number;
  y: number;
  /**
   * Stable identity, independent of input order and of the map view.
   *
   * Used as the `data-cluster` attribute and as the record of which group a
   * reader has expanded. Sorted, so the same four places produce the same key
   * however they were enumerated, and space-separated so that a group can be
   * addressed by any one member with an exact `~=` word match rather than by a
   * substring guess that would go wrong the day two slugs share a stem. No slug
   * is named here, in code or in prose — a test reads this file to check that.
   */
  key: string;
}

/**
 * Half-extents of a marker's hit area, in pixels.
 *
 * The pin icon is 28×38 with its anchor on the coordinate at the bottom tip, so
 * its visual centre sits 19 px above the anchor and its box reaches 14 px to
 * either side. A marker's centre is therefore covered by a neighbour exactly
 * when the two centres are within 14 px horizontally *and* 19 px vertically —
 * which is the failure §64 measured, and the thing the separation below has to
 * make impossible.
 */
export const MARKER_HALF_WIDTH = 14;
export const MARKER_HALF_HEIGHT = 19;

/**
 * How close two centres may be before they are grouped.
 *
 * Comfortably larger than the coverage half-extents above, and deliberately
 * rectangular rather than circular: pins are taller than they are wide, so a
 * radius that separated them horizontally would either group vertically distinct
 * pins needlessly or leave overlapping ones alone.
 *
 * The margin is what turns "probably fine" into a guarantee. Any pair that
 * survives grouping is at least 24 px apart horizontally *or* 30 px apart
 * vertically; both exceed 14 and 19, so no surviving marker can cover another's
 * centre. The cluster glyph is larger than a pin (34 px square, half-extent 17)
 * and the same argument still holds, which is why one threshold covers
 * marker–marker, marker–cluster and cluster–cluster alike.
 */
export const GROUP_X = 24;
export const GROUP_Y = 30;

interface Node {
  slugs: string[];
  x: number;
  y: number;
}

function merge(nodes: Node[]): Node[] {
  const groups: Node[] = [];

  for (const node of nodes) {
    /*
      Leader grouping, not chaining. A node joins the first existing group whose
      *current centroid* it is close to; if none is, it starts one. Single-link
      chaining would let a line of pins 25 px apart become one group of thirteen
      spanning the whole map, which is a worse map than the overlap it fixed.
    */
    const host = groups.find(
      (group) => Math.abs(group.x - node.x) < GROUP_X && Math.abs(group.y - node.y) < GROUP_Y,
    );

    if (!host) {
      groups.push({ slugs: [...node.slugs], x: node.x, y: node.y });
      continue;
    }

    // Weighted mean, so the centroid is the centroid of the original markers
    // rather than of the intermediate groups they were merged through.
    const total = host.slugs.length + node.slugs.length;
    host.x = (host.x * host.slugs.length + node.x * node.slugs.length) / total;
    host.y = (host.y * host.slugs.length + node.y * node.slugs.length) / total;
    host.slugs.push(...node.slugs);
  }

  return groups;
}

/**
 * Group projected markers until no two rendered things can cover each other.
 *
 * Run to a fixpoint rather than in a single pass. One pass leaves a real hole:
 * merging moves a group's centre to its centroid, and a centroid can drift into
 * range of a marker that was outside the threshold when the pass began — so a
 * cluster glyph could end up sitting on top of a lone pin, which is the same bug
 * in a new costume. Repeating until the count stops falling closes it, and it
 * terminates because every iteration either merges something or stops.
 *
 * The input is sorted first, so membership does not depend on how the caller
 * enumerated the registry — which matters because the registry's order is
 * editorial and this is not.
 */
export function clusterByScreenDistance(points: ClusterInput[]): ClusterGroup[] {
  const order = new Map(points.map((point, index) => [point.slug, index]));

  // Top-to-bottom, then left-to-right, then by slug: a total order over any
  // input, including points that share a position exactly.
  const sorted = [...points].sort(
    (a, b) => a.y - b.y || a.x - b.x || a.slug.localeCompare(b.slug),
  );

  let nodes: Node[] = sorted.map((point) => ({ slugs: [point.slug], x: point.x, y: point.y }));

  for (let pass = 0; pass < points.length; pass += 1) {
    const merged = merge(nodes);
    if (merged.length === nodes.length) break;
    nodes = merged;
  }

  return nodes.map((node) => ({
    // Members come back in registry order, so an expanded group reads in the
    // same order as the list under the map.
    slugs: [...node.slugs].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0)),
    x: node.x,
    y: node.y,
    key: [...node.slugs].sort().join(" "),
  }));
}

/**
 * Where to draw the members of a group that zooming cannot separate.
 *
 * The last resort, and it should almost never be reached: activating a group
 * zooms toward it, and two places kilometres apart come apart long before the
 * basemap runs out of zoom. What this is for is the case that has no zoom answer
 * at all — two Places at effectively one coordinate, which is what a chapel
 * inside a monastery's walls or a museum inside a fortress would be. The §64
 * registry contains no such pair; the arithmetic is here so that the day one
 * ships is not the day the map silently loses a marker.
 *
 * Offsets are in **pixels and applied to the icon anchor**, never to the
 * coordinate. That is the difference between this and the naive fix the brief
 * ruled out: a nudged coordinate is a lie that persists at every zoom, whereas
 * an anchor offset is recomputed from scratch on the next view change and
 * discarded when the group is no longer expanded. `getLatLng()` stays true
 * throughout, so the pin still marks the ground it marks.
 */
export function spreadOffsets(count: number): Array<{ dx: number; dy: number }> {
  if (count <= 1) return [{ dx: 0, dy: 0 }];

  // Wide enough that the ring's own members clear the thresholds above: the
  // chord between neighbours on a circle of radius r is 2·r·sin(π/n).
  const radius = Math.max(34, Math.ceil((GROUP_Y * count) / (2 * Math.PI)) + 18);

  return Array.from({ length: count }, (_, index) => {
    // Start at the top and go clockwise, so the first member — first in registry
    // order, and the one focus moves to — is where a reader looks first.
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    return {
      dx: Math.round(radius * Math.cos(angle) * 10) / 10,
      dy: Math.round(radius * Math.sin(angle) * 10) / 10,
    };
  });
}
