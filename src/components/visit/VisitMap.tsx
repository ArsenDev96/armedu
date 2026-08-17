"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ALL_FILTER_ID, type Filter } from "@/data/types";
import { ArrowLink, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { MAP_TILES } from "@/lib/map-tiles";
import { IMAGE_SIZES } from "@/lib/media";
import type { VisitMapPoint } from "@/lib/visit-map";

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
  // Leaflet's `Map` is imported under an alias, so this `Map` is the global one.
  const markersRef = useRef<Map<string, Marker>>(new Map());

  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(ALL_FILTER_ID);
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

  const visible = points.filter(
    (point) => filter === ALL_FILTER_ID || point.placeTypeId === filter,
  );
  const active = points.find((point) => point.slug === selected);

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
        Set the view *before* adding markers.

        `Map.addLayer` defers `onAdd` through `whenReady` until the map has a
        centre and a zoom. A map created with no view is not ready, so markers
        added first have no `_icon` yet and `getElement()` returns `null` — which
        silently skipped every accessible attribute below and left seven pins
        that were visible, unnamed and unreachable. Ordering is the fix.

        Marker-derived bounds rather than a hardcoded Armenia box: the viewport
        is a presentation concern, and a fixed national extent would quietly make
        an editorial decision — how the archive frames culturally Armenian sites
        beyond the present border — here, in a component, the day the first such
        place ships.
      */
      map.fitBounds(
        L.latLngBounds(points.map((point) => [point.lat, point.lon] as [number, number])),
        { padding: [32, 32], maxZoom: 11 },
      );

      /**
       * Make a pin a control.
       *
       * Leaflet gives the icon `tabindex="0"` for us; this is the rest — the
       * part that makes it a button with a name rather than a decorative div.
       * The place type is in the accessible name, so the glyph and its colour
       * are never the only carriers of what kind of place a marker is.
       *
       * Re-run on every `add`, not once at creation: filtering removes and
       * re-adds markers, and `_initIcon` builds a *fresh* element each time. Set
       * once, these attributes would survive until the first filter click and
       * then quietly disappear.
       */
      const decorate = (marker: Marker, point: VisitMapPoint) => {
        const element = marker.getElement();
        if (!element) return;
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", `${point.title} — ${labelFor(point.placeTypeId)}`);
        element.setAttribute("data-slug", point.slug);
        element.setAttribute("data-place-type", point.placeTypeId);
      };

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
        marker.on("add", () => decorate(marker, point));

        marker.addTo(map);
        decorate(marker, point);

        markersRef.current.set(point.slug, marker);
      }

      mapRef.current = map;
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
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
      setTilesFailed(false);
    };
    // `points` is server-rendered data and stable for the life of the page, and
    // `config` is inlined at build time, so neither ever changes at runtime.
  }, [points, config]);

  /* Filtering hides markers; it never rebuilds the map. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    for (const point of points) {
      const marker = markersRef.current.get(point.slug);
      if (!marker) continue;
      const shown = filter === ALL_FILTER_ID || point.placeTypeId === filter;
      if (shown) marker.addTo(map);
      else marker.remove();
    }
  }, [filter, points, ready]);

  /* Selection: restyle the pins and bring the chosen one into view. */
  useEffect(() => {
    if (!ready) return;

    for (const point of points) {
      const marker = markersRef.current.get(point.slug);
      const element = marker?.getElement();
      if (!element) continue;
      const isActive = point.slug === selected;
      element.innerHTML = pinSvg(point.placeTypeId, isActive);
      element.setAttribute("aria-pressed", String(isActive));
      element.style.zIndex = isActive ? "1000" : "";
    }

    const point = points.find((entry) => entry.slug === selected);
    if (point) mapRef.current?.panTo([point.lat, point.lon], { animate: true });
    // `filter` is a dependency because filtering re-adds markers with fresh
    // elements and default pins — without it, the selected pin silently loses
    // its active styling the first time a reader narrows and widens the map.
  }, [selected, points, ready, filter]);

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
