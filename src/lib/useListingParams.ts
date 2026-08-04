"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_FILTER_ID } from "@/data/types";

/**
 * Keeps a listing's search term and selected filters in the URL.
 *
 * The URL is written with the native History API rather than `router.replace`,
 * which App Router supports and which — unlike a router navigation — never asks
 * the server for a fresh RSC payload. Typing therefore costs nothing but a
 * re-render, and the page stays statically generated.
 *
 * Typing uses `replaceState` so a search does not bury the previous page under
 * one history entry per keystroke; choosing a filter uses `pushState`, so Back
 * steps through the filters a reader actually chose.
 *
 * The URL is read in an effect, never during render, and this is the whole
 * point. `useSearchParams()` during render forces React to bail the enclosing
 * Suspense boundary out to client-side rendering, and the prerendered HTML for
 * these three pages then contained no cards, no links and no filters at all —
 * only a grey placeholder. Reading `window.location` after mount costs a
 * filtered arrival one extra paint, and buys every reader and every crawler a
 * complete page without JavaScript.
 *
 * `filterKeys` is a list rather than a single key because the history listing
 * has two independent axes (`?period=…&type=…`). Listings with one axis pass a
 * one-element list and behave exactly as before, including the URLs they write:
 * a key at `all` is omitted, so an unfiltered listing is still the bare path.
 */
export function useListingParams(filterKeys: readonly string[]) {
  const pathname = usePathname();

  // Callers pass a literal (`["period", "type"]`), so the array identity changes
  // on every render while its contents never do. Keying the memo on the joined
  // contents is what keeps the effect below from re-subscribing every render.
  const signature = filterKeys.join(",");
  const keys = useMemo(() => signature.split(","), [signature]);

  const allCleared = useCallback(
    () => Object.fromEntries(keys.map((key) => [key, ALL_FILTER_ID])),
    [keys],
  );

  const [query, setQueryState] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string>>(allCleared);

  /** What we last wrote ourselves — anything else came from Back/Forward. */
  const written = useRef<{ q: string; f: Record<string, string> }>({
    q: "",
    f: allCleared(),
  });

  useEffect(() => {
    /** Adopt whatever the address bar says: on mount, and on Back/Forward. */
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      if (written.current.q !== q) {
        written.current.q = q;
        setQueryState(q);
      }

      const next: Record<string, string> = {};
      let changed = false;
      for (const key of keys) {
        next[key] = params.get(key) ?? ALL_FILTER_ID;
        if (written.current.f[key] !== next[key]) changed = true;
      }
      if (changed) {
        written.current.f = next;
        setFiltersState(next);
      }
    };

    sync();
    // `pushState`/`replaceState` do not fire popstate, so this only ever hears
    // the reader's own Back and Forward, never our own writes.
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [keys]);

  const write = useCallback(
    (nextQuery: string, nextFilters: Record<string, string>, mode: "push" | "replace") => {
      const params = new URLSearchParams();
      const trimmed = nextQuery.trim();
      if (trimmed) params.set("q", trimmed);
      for (const key of keys) {
        const value = nextFilters[key];
        if (value && value !== ALL_FILTER_ID) params.set(key, value);
      }

      const search = params.toString();
      written.current = { q: trimmed, f: { ...nextFilters } };

      const url = search ? `${pathname}?${search}` : pathname;
      if (mode === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [keys, pathname],
  );

  const setQuery = useCallback(
    (next: string) => {
      setQueryState(next);
      write(next, filters, "replace");
    },
    [filters, write],
  );

  const setFilter = useCallback(
    (key: string, next: string) => {
      const merged = { ...filters, [key]: next || ALL_FILTER_ID };
      setFiltersState(merged);
      write(query, merged, "push");
    },
    [filters, query, write],
  );

  const clearAll = useCallback(() => {
    const cleared = allCleared();
    setQueryState("");
    setFiltersState(cleared);
    write("", cleared, "push");
  }, [allCleared, write]);

  const isFiltered =
    Boolean(query.trim()) || keys.some((key) => (filters[key] ?? ALL_FILTER_ID) !== ALL_FILTER_ID);

  return { query, setQuery, filters, setFilter, clearAll, isFiltered };
}
