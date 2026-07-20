"use client";

import { usePathname, useSearchParams } from "next/navigation";
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
 */
export function useListingParams(filterKey: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlFilter = searchParams.get(filterKey) ?? ALL_FILTER_ID;

  const [query, setQueryState] = useState(urlQuery);
  const [filterId, setFilterState] = useState(urlFilter);

  /** What we last wrote ourselves — anything else came from Back/Forward. */
  const written = useRef({ q: urlQuery, f: urlFilter });

  useEffect(() => {
    if (written.current.q !== urlQuery) {
      written.current.q = urlQuery;
      setQueryState(urlQuery);
    }
    if (written.current.f !== urlFilter) {
      written.current.f = urlFilter;
      setFilterState(urlFilter);
    }
  }, [urlQuery, urlFilter]);

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
