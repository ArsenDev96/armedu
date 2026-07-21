"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_FILTER_ID } from "@/data/types";

/**
 * Keeps a listing's search term and selected filter in the URL.
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
 */
export function useListingParams(filterKey: string) {
  const pathname = usePathname();

  const [query, setQueryState] = useState("");
  const [filterId, setFilterState] = useState(ALL_FILTER_ID);

  /** What we last wrote ourselves — anything else came from Back/Forward. */
  const written = useRef({ q: "", f: ALL_FILTER_ID });

  useEffect(() => {
    /** Adopt whatever the address bar says: on mount, and on Back/Forward. */
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      const f = params.get(filterKey) ?? ALL_FILTER_ID;
      if (written.current.q !== q) {
        written.current.q = q;
        setQueryState(q);
      }
      if (written.current.f !== f) {
        written.current.f = f;
        setFilterState(f);
      }
    };

    sync();
    // `pushState`/`replaceState` do not fire popstate, so this only ever hears
    // the reader's own Back and Forward, never our own writes.
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [filterKey]);

  const write = useCallback(
    (nextQuery: string, nextFilter: string, mode: "push" | "replace") => {
      const params = new URLSearchParams();
      const trimmed = nextQuery.trim();
      if (trimmed) params.set("q", trimmed);
      if (nextFilter && nextFilter !== ALL_FILTER_ID) params.set(filterKey, nextFilter);

      const search = params.toString();
      written.current = { q: trimmed, f: nextFilter || ALL_FILTER_ID };

      const url = search ? `${pathname}?${search}` : pathname;
      if (mode === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [filterKey, pathname],
  );

  const setQuery = useCallback(
    (next: string) => {
      setQueryState(next);
      write(next, filterId, "replace");
    },
    [filterId, write],
  );

  const setFilterId = useCallback(
    (next: string) => {
      setFilterState(next);
      write(query, next, "push");
    },
    [query, write],
  );

  const clearAll = useCallback(() => {
    setQueryState("");
    setFilterState(ALL_FILTER_ID);
    write("", ALL_FILTER_ID, "push");
  }, [write]);

  const isFiltered = Boolean(query.trim()) || filterId !== ALL_FILTER_ID;

  return { query, setQuery, filterId, setFilterId, clearAll, isFiltered };
}
