"use client";

import "leaflet/dist/leaflet.css";
import type { LeafletKeyboardEvent, Map as LeafletMap, Marker } from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ALL_FILTER_ID, type Filter } from "@/data/types";
import { ArrowLink, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import {
  clusterByScreenDistance,
  MARKER_HALF_HEIGHT,
  spreadOffsets,
} from "@/lib/map-cluster";
import { MAP_TILES } from "@/lib/map-tiles";
import { IMAGE_SIZES } from "@/lib/media";
import type { VisitMapPoint } from "@/lib/visit-map";

type LeafletModule = typeof import("leaflet");

/**
 * The Visit hub's geographic index.
 *
 * What this is for, stated narrowly so it stays that way: *where are the places
 * I can already read about on Armat?* It is not a trip planner. There is no
 * geolocation, no routing, no directions, no distance, no travel time, no
 * itinerary and no venue data — and the map holds Places only, because a dish is
 * not a point on the ground and neither is a person.
 *
 * ## Why this is one client component and the page around it is not
 *
 * `/visit` is statically prerendered like every other page here, and it stays
 * that way: the heading, the copy, the accessible list, the seven article links
 * and the place-type labels are all rendered on the server, because a client
 * component is still server-rendered for its initial HTML. Only Leaflet is
 * client-only, and only after mount.
 *
 * So the seven destinations survive a JavaScript failure. That is the whole
 * point of the list below the map being real markup rather than something the
 * map draws: without JS the reader loses the picture and keeps the places.
 *
 * ## Why the map loads late
 *
 * Leaflet is `import()`ed inside an `IntersectionObserver`, so it is a separate
 * chunk that is fetched only when the section actually comes into view, and the
 * tile requests that come with it are never made for a reader who does not
 * scroll this far. That is a deliberate privacy choice as much as a performance
 * one — tiles are a third-party request, and the fewer readers who make one
 * without ever seeing a map, the better.
 *
 * ## Why no provider is named in this file
 *
 * The basemap is configuration, not component logic: `MAP_TILES` carries the
 * URL template, the attribution and the zoom ceiling, and this component renders
 * whatever it is handed. Naming a provider here would mean a swap had to be made
 * inside Leaflet setup code — the kind of edit that leaves the previous
 * provider's copyright line sitting under someone else's tiles. See
 * `lib/map-tiles.ts` for what is configured and what deliberately is not.
 *
 * `MAP_TILES` can be `null` when the environment is half-configured. That is a
 * refusal rather than a crash: no tile layer is created, the reader is told the
 * map is unavailable, and the list of places below is untouched — which is the
 * same guarantee that holds when JavaScript never runs at all.
 *
 * `reactStrictMode` is on, so the effect runs twice in development. The cleanup
 * calls `map.remove()` and the `cancelled` flag guards the async gap — without
 * both, Leaflet throws "Map container is already initialized".
 */

/**
 * One glyph per place type, drawn inside a shared pin.
 *
 * Shape, not colour, and not emoji. Every marker is the same pin so the map
 * reads as one system; the glyph distinguishes the kind. Colour is never the
 * only channel — the accessible name of every marker carries the type in words,
 * and the list below repeats it as text.
 *
 * Keyed by the existing `placeTypeId`. A type with no glyph falls back to the
 * bare pin rather than to a wrong one, which is what should happen the day a
 * type ships without one: a plain marker, not a museum book on a settlement.
 * That fallback held for `settlement` until the taxonomy gained its first
 * member; `settlement` now has a glyph like every other type, and the fallback
 * remains for whatever comes next.
 */
const TYPE_GLYPH: Record<string, string> = {
  // A domed church: semicircle on a base.
  monastery: "M5 11h6M8 4.5 8 6M6 11a2 2 0 0 1 4 0",
  // A column: capital, shaft, base.
  historical: "M5.5 5h5M6.5 5v6M9.5 5v6M5 11h6",
  // An open book.
  museum: "M8 5.5v6M8 5.5C7 4.6 5.8 4.6 4.5 5v6c1.3-.4 2.5-.4 3.5.5M8 5.5c1-.9 2.2-.9 3.5-.5v6c-1.3-.4-2.5-.4-3.5.5",
  // Water: two waves.
  nature: "M4.5 7.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0M4.5 10c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0",
  /*
    Two blocks on a ground line — the generic mark for a built-up place.

    Deliberately the smallest thing that reads as a settlement rather than as any
    particular one. It is not a skyline, not a coat of arms, not a tower, and not
    a picture of Gyumri: the same rule that keeps `monastery` a domed shape rather
    than Khor Virap applies here, and it has to hold before a second town ships.
    Shape, not colour, and the accessible name still carries the localized type in
    words — see `decorate` below.
  */
  settlement: "M4.5 11h7M5.5 11V7.5h3V11M8.5 11V6h2v5",
};

function pinSvg(placeTypeId: string, selected: boolean): string {
  const glyph = TYPE_GLYPH[placeTypeId];
  const fill = selected ? "var(--color-burgundy-dark)" : "var(--color-burgundy)";
  return [
    `<svg viewBox="0 0 16 22" width="28" height="38" aria-hidden="true" focusable="false">`,
    `<path d="M8 21.2C8 21.2 15 13.6 15 8A7 7 0 0 0 1 8c0 5.6 7 13.2 7 13.2Z" fill="${fill}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>`,
    glyph
      ? `<path d="${glyph}" fill="none" stroke="#fff" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>`
      : "",
    `</svg>`,
  ].join("");
}

/**
 * The glyph for a group of places that cannot be drawn apart at this zoom.
 *
 * A circle, not a pin, and that is the whole design: a reader has to be able to
 * tell at a glance that this is not one place with a number on it. Same
 * burgundy, same white keyline, one size, no shadow, no pulse, no halo and no
 * per-type variation — a group of four monasteries and a group of two mixed
 * types look identical, because what a group means is *spatial*, not editorial.
 *
 * The count is drawn as text rather than implied by size. Size would be a second
 * encoding of the same fact, unreadable at the small end and misleading at the
 * large one, and it would leave the number available only to people who can see
 * the map — the accessible name below carries it in words for everyone else.
 */
function clusterSvg(count: number): string {
  return [
    `<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true" focusable="false">`,
    `<circle cx="17" cy="17" r="15" fill="var(--color-burgundy)" stroke="#fff" stroke-width="2"/>`,
    `<text x="17" y="17.5" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="700" font-family="system-ui, sans-serif">${count}</text>`,
    `</svg>`,
  ].join("");
}

export interface VisitMapCopy {
  /** Accessible name for the map region. */
  regionLabel: string;
  /** Heading over the non-map list of the same places. */
  listTitle: string;
  /** Shown in the detail panel before anything is selected. */
  selectPrompt: string;
  /** Link out of the detail panel to the article. */
  cta: string;
  /** Group label for the type filter. */
  filterLabel: string;
  /** Shown when no basemap is configured, or when its tiles do not arrive. */
  unavailable: string;
  /**
   * Accessible name for a group marker, with a `{count}` placeholder.
   *
   * A template rather than a finished string because the number is only known
   * at the zoom the reader is looking at. It never renders for one place — a
   * group of one is drawn as the place itself — so there is no singular form to
   * carry, and no dead branch pretending there is.
   */
  clusterLabel: string;
}

export function VisitMap({
  points,
  types,
  copy,
}: {
  points: VisitMapPoint[];
  /** The listing's own `placeTypes`, `all` included. Never a second taxonomy. */
  types: Filter[];
  copy: VisitMapCopy;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  // Leaflet's `Map` is imported under an alias, so this `Map` is the global one.
  const markersRef = useRef<Map<string, Marker>>(new Map());
  /** Group markers, keyed by membership — see `ClusterGroup.key`. */
  const clustersRef = useRef<Map<string, Marker>>(new Map());
  /**
   * The icon last actually applied to each marker.
   *
   * `setIcon` destroys and rebuilds the marker's element, which throws away
   * focus. Panning re-runs the draw below on every frame's `moveend`, so
   * re-applying an identical icon would make a keyboard reader lose the marker
   * they were on the moment the map settled. Only a real change — type,
   * selection, or an expansion offset — is allowed through.
   */
  const iconRef = useRef<Map<string, string>>(new Map());
  /** Where focus must land once the draw that follows an expansion has run. */
  const focusRef = useRef<string | null>(null);
  /** Reassigned on every React render, so Leaflet's view events never go stale. */
  const drawRef = useRef<() => void>(() => {});

  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(ALL_FILTER_ID);
  /** The one group a reader has expanded in place, by `ClusterGroup.key`. */
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tilesFailed, setTilesFailed] = useState(false);

  /*
    Two different ways the basemap can be missing, one message.

    `MAP_TILES === null` is a refused configuration and is known before mount —
    there is nothing to draw markers on top of, so Leaflet is never loaded and
    the map surface is not rendered at all. `tilesFailed` is the runtime case:
    the map exists, the markers are on it and selectable, and only the pictures
    underneath them failed to arrive.
  */
  const config = MAP_TILES;
  const mapUnavailable = config === null || tilesFailed;

  const labelFor = (placeTypeId: string) =>
    types.find((type) => type.id === placeTypeId)?.label ?? placeTypeId;

  /*
    The one thing `t()` does, done here.

    `lib/i18n` is where `{token}` substitution lives and this is the only place
    on the client that needs it — but importing that module pulls the locale
    bundles, and therefore every article in all three editions, into the map's
    lazily-loaded chunk. A map that shipped the corpus to draw a number on a
    circle would undo the reason the chunk is lazy at all. One `replace` is the
    smaller wrong.
  */
  const clusterLabel = (count: number) => copy.clusterLabel.replace("{count}", String(count));

  const visible = points.filter(
    (point) => filter === ALL_FILTER_ID || point.placeTypeId === filter,
  );
  const active = points.find((point) => point.slug === selected);

  /**
   * Make a pin a control.
   *
   * Leaflet gives the icon `tabindex="0"` for us; this is the rest — the part
   * that makes it a button with a name rather than a decorative div. The place
   * type is in the accessible name, so the glyph and its colour are never the
   * only carriers of what kind of place a marker is.
   *
   * Re-applied on every draw rather than once at creation, because both
   * filtering and `setIcon` build a *fresh* element: set once, these attributes
   * would survive until the first filter click and then quietly disappear.
   */
  const decorate = (marker: Marker, point: VisitMapPoint, isActive: boolean) => {
    const element = marker.getElement();
    if (!element) return;
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `${point.title} — ${labelFor(point.placeTypeId)}`);
    element.setAttribute("aria-pressed", String(isActive));
    element.setAttribute("data-slug", point.slug);
    element.setAttribute("data-place-type", point.placeTypeId);
    element.style.zIndex = isActive ? "1000" : "";
  };

  /**
   * Open a group: zoom into it if that would separate it, otherwise spread it.
   *
   * Zoom first, because a group that comes apart on the ground should come apart
   * on the map — that is the honest picture, and it needs no special rendering
   * afterwards. `getBoundsZoom` answers the only question that matters here:
   * *is there a zoom at which these fit further apart than they do now?* If yes,
   * fit to them. If no — which for real coordinates means the basemap has run
   * out of zoom, and for two Places at one coordinate means there was never an
   * answer — the members are spread around the group's centre instead, so a
   * reader is never left clicking a group that cannot open.
   *
   * Focus is handed to the first member either way. Expanding removes the group
   * marker from the document, and a focused element that disappears drops focus
   * to `<body>`; moving it deliberately is what keeps a keyboard reader where
   * they were.
   */
  const expand = (slugs: string[]) => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const members = points.filter((point) => slugs.includes(point.slug));
    if (members.length === 0) return;

    focusRef.current = slugs[0];

    const bounds = L.latLngBounds(
      members.map((point) => [point.lat, point.lon] as [number, number]),
    );

    if (map.getBoundsZoom(bounds, false, L.point(48, 48)) > map.getZoom()) {
      setExpanded(null);
      // No `maxZoom` here on purpose: the ceiling is the tile layer's, which is
      // provider configuration, and repeating it in component logic is how the
      // two drift apart.
      map.fitBounds(bounds, { padding: [48, 48] });
      return;
    }

    setExpanded([...slugs].sort().join(" "));
  };

  /**
   * Put the current view on the map: every visible place, grouped by pixels.
   *
   * One function rather than three effects. The old component had separate
   * passes for filtering, for selection styling and for creation, each reaching
   * into the same marker elements from a different closure; adding a fourth
   * concern that can *replace* a marker with something else made that
   * untenable. This runs whenever anything the picture depends on changes —
   * the filter, the selection, an expansion, or the view itself — and is
   * idempotent, so running it twice costs nothing.
   *
   * Positions come from Leaflet's own projection at the current view, never from
   * latitude arithmetic: what overlaps is pixels, and only the map knows where
   * those are.
   */
  const draw = () => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const shown = points.filter(
      (point) => filter === ALL_FILTER_ID || point.placeTypeId === filter,
    );

    /*
      Grouped on the pin's visual *centre*, not on its anchor. The anchor is the
      tip on the ground; the box a reader points at sits 19 px above it. Coverage
      is a fact about boxes, so the arithmetic has to be about boxes too.
    */
    const groups = clusterByScreenDistance(
      shown.map((point) => {
        const projected = map.latLngToContainerPoint([point.lat, point.lon]);
        return { slug: point.slug, x: projected.x, y: projected.y - MARKER_HALF_HEIGHT };
      }),
    );

    const drawnMarkers = new Set<string>();
    const drawnClusters = new Set<string>();

    for (const group of groups) {
      /* A group of one is a place. A group the reader opened is its members. */
      if (group.slugs.length === 1 || group.key === expanded) {
        const offsets = spreadOffsets(group.slugs.length);

        group.slugs.forEach((slug, index) => {
          const point = points.find((entry) => entry.slug === slug);
          const marker = markersRef.current.get(slug);
          if (!point || !marker) return;

          const offset = offsets[index];
          const isActive = slug === selected;
          const signature = `${point.placeTypeId}|${isActive}|${offset.dx}|${offset.dy}`;

          if (!map.hasLayer(marker)) marker.addTo(map);

          if (iconRef.current.get(slug) !== signature) {
            marker.setIcon(
              L.divIcon({
                className: "armat-pin",
                html: pinSvg(point.placeTypeId, isActive),
                iconSize: [28, 38],
                // The offset moves the *drawing*, never the coordinate:
                // `getLatLng()` still answers with the ground the pin marks.
                iconAnchor: [14 - offset.dx, 38 - offset.dy],
              }),
            );
            iconRef.current.set(slug, signature);
          }

          decorate(marker, point, isActive);
          drawnMarkers.add(slug);
        });

        continue;
      }

      const anchor = map.containerPointToLatLng([group.x, group.y + MARKER_HALF_HEIGHT]);
      let cluster = clustersRef.current.get(group.key);

      if (!cluster) {
        // Membership is the key, so a marker is only ever reused for the same
        // places — which is what lets a pan move it instead of rebuilding it.
        const slugs = [...group.slugs];
        cluster = L.marker(anchor, {
          keyboard: true,
          title: clusterLabel(slugs.length),
          zIndexOffset: 400,
          icon: L.divIcon({
            className: "armat-cluster",
            html: clusterSvg(slugs.length),
            iconSize: [34, 34],
            iconAnchor: [17, 17 + MARKER_HALF_HEIGHT],
          }),
        });
        cluster.on("click", () => expand(slugs));
        cluster.on("keypress", (event: LeafletKeyboardEvent) => {
          const key = event.originalEvent.key;
          if (key === "Enter" || key === " " || key === "Spacebar") expand(slugs);
        });
        clustersRef.current.set(group.key, cluster);
      } else {
        cluster.setLatLng(anchor);
      }

      if (!map.hasLayer(cluster)) cluster.addTo(map);

      const element = cluster.getElement();
      if (element) {
        element.setAttribute("role", "button");
        // "4 places", localized. Never the bare number, which a screen reader
        // would announce as a quantity of nothing, and never the four names,
        // which would be read out again on every pass of the map.
        element.setAttribute("aria-label", clusterLabel(group.slugs.length));
        element.setAttribute("aria-expanded", "false");
        element.setAttribute("data-cluster", group.key);
        element.setAttribute("data-cluster-count", String(group.slugs.length));
      }

      drawnClusters.add(group.key);
    }

    /* Anything this pass did not draw is not on the map. */
    for (const [slug, marker] of markersRef.current) {
      if (!drawnMarkers.has(slug)) marker.remove();
    }
    for (const [key, cluster] of clustersRef.current) {
      if (drawnClusters.has(key)) continue;
      cluster.remove();
      clustersRef.current.delete(key);
    }

    /*
      The focus handoff, after the picture is settled.

      The wanted place is normally drawn by now. When it is not — because one
      zoom step split a group of five into a pair and a three, and it is in the
      three — focus goes to the group that holds it, so the next Enter carries on
      from there. Either way focus lands on something, which is the guarantee.
    */
    const wanted = focusRef.current;
    if (!wanted) return;

    const own = drawnMarkers.has(wanted) ? markersRef.current.get(wanted)?.getElement() : null;
    const host = groups.find(
      (group) => drawnClusters.has(group.key) && group.slugs.includes(wanted),
    );
    const target = own ?? (host ? clustersRef.current.get(host.key)?.getElement() : null);
    if (!target) return;

    focusRef.current = null;
    target.focus();
  };

  /* Mount Leaflet once, when the section is close to view. */
  useEffect(() => {
    const container = containerRef.current;
    // No usable basemap configuration means no Leaflet, no chunk and no tile
    // request — the notice and the list below stand in for the map.
    if (!container || !config || points.length === 0) return;

    let cancelled = false;
    let loadedTiles = 0;

    const start = async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        // Scroll belongs to the page. A map that swallows the wheel on a long
        // editorial page is the single most complained-about map behaviour;
        // the buttons and pinch-zoom remain.
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });

      /*
        The base layer, entirely from configuration.

        `attribution` is not optional and not a default: it is required by every
        tile licence worth using, and it is the reader's only signal of where the
        base layer comes from. `resolveMapTileConfig` refuses a configuration
        with an empty attribution, so a layer can never reach this line without
        one, and Leaflet's attribution control stays on.

        `tileload` / `tileerror` are the only failure signal used here, and they
        are a direct observation rather than a guess: errors with nothing loaded
        means this basemap is not rendering. It says nothing about whether the
        reader is online, because it cannot know that and neither can the notice.
      */
      const tiles = L.tileLayer(config.url, {
        maxZoom: config.maxZoom,
        attribution: config.attribution,
      });
      tiles.on("tileload", () => {
        loadedTiles += 1;
        setTilesFailed(false);
      });
      tiles.on("tileerror", () => {
        if (loadedTiles === 0) setTilesFailed(true);
      });
      tiles.addTo(map);

      /*
        Set the view *before* anything is drawn.

        `Map.addLayer` defers `onAdd` through `whenReady` until the map has a
        centre and a zoom. A map created with no view is not ready, so markers
        added first have no `_icon` yet and `getElement()` returns `null` — which
        silently skipped every accessible attribute and left seven pins that were
        visible, unnamed and unreachable. Ordering is the fix, and it matters
        more now: the draw below reads projected positions, and an unprojected
        map has none.

        Marker-derived bounds rather than a hardcoded Armenia box: the viewport
        is a presentation concern, and a fixed national extent would quietly make
        an editorial decision — how the archive frames culturally Armenian sites
        beyond the present border — here, in a component, the day the first such
        place ships. §65 keeps that decision and absorbs its cost in the grouping
        instead: the frame may move wherever the registry sends it, and what
        collides at the resulting scale is handled at the resulting scale.
      */
      map.fitBounds(
        L.latLngBounds(points.map((point) => [point.lat, point.lon] as [number, number])),
        { padding: [32, 32], maxZoom: 11 },
      );

      /*
        Markers are built here and placed by the draw, not added here.

        Creating them without a map is deliberate: which of them are on it at any
        moment is a question about the current view, and the answer changes on
        every zoom. One place decides that, below.
      */
      for (const point of points) {
        const marker = L.marker([point.lat, point.lon], {
          keyboard: true,
          title: point.title,
          icon: L.divIcon({
            className: "armat-pin",
            html: pinSvg(point.placeTypeId, false),
            iconSize: [28, 38],
            iconAnchor: [14, 38],
          }),
        });

        marker.on("click", () => setSelected(point.slug));
        marker.on("keypress", () => setSelected(point.slug));

        markersRef.current.set(point.slug, marker);
      }

      // Every view change re-groups. `moveend` and `zoomend` fire after the
      // animation, so nothing is measured mid-flight; `resize` is what makes a
      // rotated phone regroup rather than keep a portrait picture.
      map.on("moveend zoomend resize", () => drawRef.current());

      mapRef.current = map;
      leafletRef.current = L;
      setReady(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void start();
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      markersRef.current.clear();
      clustersRef.current.clear();
      iconRef.current.clear();
      focusRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setReady(false);
      setTilesFailed(false);
    };
    // `points` is server-rendered data and stable for the life of the page, and
    // `config` is inlined at build time, so neither ever changes at runtime.
  }, [points, config]);

  /*
    Keep the view function current, then run it.

    Two effects, in this order, because the first has no dependency list and the
    second does: React runs them in declaration order after every commit, so the
    version of `draw` that runs is always the one built from this render's state.
    Leaflet's own listeners reach it through the same ref.
  */
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    if (!ready) return;
    drawRef.current();
  }, [ready, filter, selected, expanded, points]);

  /* Selection brings the chosen place into view; the draw restyles its pin. */
  useEffect(() => {
    if (!ready) return;
    const point = points.find((entry) => entry.slug === selected);
    if (point) mapRef.current?.panTo([point.lat, point.lon], { animate: true });
  }, [selected, points, ready]);

  /* A narrowed map is a different picture; an expansion of the old one is not. */
  useEffect(() => {
    setExpanded(null);
  }, [filter]);

  /* A selection that the current filter hides would leave a stale card. */
  useEffect(() => {
    if (!selected) return;
    const point = points.find((entry) => entry.slug === selected);
    if (point && filter !== ALL_FILTER_ID && point.placeTypeId !== filter) setSelected(null);
  }, [filter, selected, points]);
  if (points.length === 0) return null;

  return (
    <div data-visit-map="">
      {/*
        The type filter. Same ids and same labels as the listing's own
        `placeTypes` — this is a view control over the markers already on the
        page, not a second taxonomy and not a second source of truth. The
        "Explore by type" links elsewhere on this page still go to `/places`.
      */}
      <div role="group" aria-label={copy.filterLabel} className="mb-5 flex flex-wrap gap-2">
        {types.map((type) => {
          const isActive = filter === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setFilter(type.id)}
              aria-pressed={isActive}
              data-map-filter={type.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                isActive
                  ? "border-burgundy bg-burgundy text-white"
                  : "border-line-strong bg-surface text-ink-2 hover:border-burgundy hover:text-burgundy",
              )}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-[var(--shadow-card)]">
          {/*
            The basemap notice.

            Stated as what is actually known — the map could not be loaded — and
            pointed at the list below, which is the fallback and always present.
            It claims nothing about the reader's connection, because a failed
            tile request is not evidence of one.
          */}
          {mapUnavailable ? (
            <p
              data-map-unavailable=""
              role="status"
              className="border-b border-line px-5 py-3 text-sm leading-relaxed text-ink-3"
            >
              {copy.unavailable}
            </p>
          ) : null}

          {/*
            The map itself. `region` rather than `application`: Leaflet's own
            keyboard handling stays, and the list below is the equivalent that
            does not require it — so this never has to be the only way in.

            Dropped entirely when there is no basemap configuration: an empty
            bordered box announcing itself as a map is worse than the notice
            above it. A runtime tile failure keeps it, because the markers are
            still there and still selectable.
          */}
          {config ? (
            <div
              ref={containerRef}
              role="region"
              aria-label={copy.regionLabel}
              className="h-[20rem] w-full sm:h-[24rem] lg:h-[28rem]"
            />
          ) : null}
        </div>

        {/*
          The detail panel. One polite live region, updated only when a marker is
          chosen — enough for the change to be noticed, not so much that panning
          the map narrates itself.
        */}
        <div aria-live="polite" className="lg:h-full">
        <Card className="flex h-full flex-col p-5">
          {active ? (
            <>
              {active.imageSrc ? (
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-paper-2">
                  <Image
                    src={active.imageSrc}
                    alt={active.title}
                    fill
                    sizes={IMAGE_SIZES.card}
                    className="object-cover"
                  />
                </div>
              ) : null}
              <p className="text-xs font-semibold tracking-[0.12em] text-burgundy uppercase">
                {labelFor(active.placeTypeId)}
              </p>
              <h3 className="mt-2 text-lg leading-snug text-ink">{active.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-3">{active.summary}</p>
              <ArrowLink href={active.href} className="mt-4">
                {copy.cta}
              </ArrowLink>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ink-3">{copy.selectPrompt}</p>
          )}
        </Card>
        </div>
      </div>

      {/*
        The non-map representation of exactly the same places.

        Server-rendered, so it is in the HTML whether or not Leaflet ever loads,
        and it is a list of links rather than a list of buttons for the same
        reason: a keyboard or screen-reader reader must be able to reach every
        article and see every place type without touching the map at all, and
        buttons would have needed JavaScript to do anything.
      */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold tracking-[0.12em] text-ink-3 uppercase">
          {copy.listTitle}
        </h3>
        <ul data-map-list="" className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {visible.map((point) => (
            <li key={point.slug} className="text-sm">
              <Link
                href={point.href}
                data-map-list-item={point.slug}
                className="font-medium text-ink-2 transition hover:text-burgundy"
              >
                {point.title}
              </Link>
              <span className="text-ink-3"> · {labelFor(point.placeTypeId)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
