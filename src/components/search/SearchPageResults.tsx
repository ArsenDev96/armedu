"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryId, Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ButtonLink, Card } from "@/components/ui/primitives";
import { SearchIcon } from "@/components/ui/icons";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { matches, normalize, type SearchResult } from "@/lib/search";
import { localePath, plural, t } from "@/lib/i18n";

/**
 * The whole search experience runs in the browser against an index handed down
 * from the server at build time — and that index is built from one locale's
 * bundle only, so an Armenian search can never surface English text. The route
 * therefore stays statically generated and typing never touches the network.
 */
export function SearchPageResults({
  index,
  ui,
  locale,
}: {
  index: SearchResult[];
  ui: UiDictionary;
  locale: Locale;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const inputId = useId();

  const [query, setQuery] = useState(urlQuery);
  const written = useRef(urlQuery);

  // Re-sync when the URL changes underneath us (a header search, Back/Forward,
  // or a language switch that carried the query across).
  useEffect(() => {
    if (written.current !== urlQuery) {
      written.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  const updateQuery = (next: string) => {
    setQuery(next);
    const trimmed = next.trim();
    written.current = trimmed;
    const url = trimmed ? `${pathname}?q=${encodeURIComponent(trimmed)}` : pathname;
    window.history.replaceState(null, "", url);
  };

  const trimmed = normalize(query);

  const groups = useMemo(() => {
    if (!trimmed) return null;
    const hits = index.filter((entry) => matches(entry.haystack, trimmed));
    const labels: Record<CategoryId, string> = {
      history: ui.search.groupHistory,
      writers: ui.search.groupWriters,
      works: ui.search.groupWorks,
    };
    return (["history", "writers", "works"] as CategoryId[]).map((type) => ({
      type,
      label: labels[type],
      results: hits.filter((hit) => hit.type === type),
    }));
  }, [index, trimmed, ui]);

  const total = groups?.reduce((sum, group) => sum + group.results.length, 0) ?? 0;

  return (
    <>
      <form role="search" onSubmit={(event) => event.preventDefault()} className="mx-auto max-w-2xl">
        <label htmlFor={inputId} className="sr-only">
          {ui.search.inputLabel}
        </label>
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-3.5 focus-within:border-burgundy">
          <span aria-hidden="true" className="text-ink-3">
            <SearchIcon className="h-[18px] w-[18px]" />
          </span>
          <input
            id={inputId}
            type="search"
            name="q"
            value={query}
            autoFocus
            onChange={(event) => updateQuery(event.target.value)}
            placeholder={ui.search.placeholder}
            className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateQuery("")}
              className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-ink-3 transition hover:text-burgundy"
            >
              {ui.search.clear}
            </button>
          ) : null}
        </div>
      </form>

      <p aria-live="polite" className="mt-5 text-center text-sm text-ink-3">
        {trimmed
          ? plural(ui.search.resultsOne, ui.search.resultsOther, total, { query: query.trim() })
          : ui.search.prompt}
      </p>

      <div className="mt-10 md:mt-12">
        {!trimmed ? (
          <NoQueryState ui={ui} locale={locale} />
        ) : total === 0 ? (
          <NoMatchesState ui={ui} query={query.trim()} onClear={() => updateQuery("")} />
        ) : (
          <div className="space-y-12">
            {groups
              ?.filter((group) => group.results.length > 0)
              .map((group) => (
                <section key={group.type} aria-labelledby={`results-${group.type}`}>
                  <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
                    <h2 id={`results-${group.type}`} className="text-xl text-ink sm:text-2xl">
                      {group.label}
                    </h2>
                    <span className="text-sm text-ink-3">
                      {plural(
                        ui.search.groupCountOne,
                        ui.search.groupCountOther,
                        group.results.length,
                      )}
                    </span>
                  </div>
                  <ul className="grid gap-5 lg:grid-cols-2">
                    {group.results.map((result) => (
                      <SearchResultCard
                        key={`${result.type}-${result.slug}`}
                        result={result}
                        ui={ui}
                      />
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

function NoQueryState({ ui, locale }: { ui: UiDictionary; locale: Locale }) {
  return (
    <Card className="px-6 py-12 text-center md:py-16">
      <h2 className="text-xl text-ink sm:text-2xl">{ui.search.noQueryHeading}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-3">
        {ui.search.noQueryBody}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href={localePath(locale, "/history")} variant="secondary">
          {ui.search.browseHistory}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/writers")} variant="secondary">
          {ui.search.browseWriters}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/works")} variant="secondary">
          {ui.search.browseWorks}
        </ButtonLink>
      </div>
    </Card>
  );
}

function NoMatchesState({
  ui,
  query,
  onClear,
}: {
  ui: UiDictionary;
  query: string;
  onClear: () => void;
}) {
  return (
    <Card className="border-dashed px-6 py-12 text-center md:py-16">
      <h2 className="text-xl text-ink sm:text-2xl">{ui.search.noResultsHeading}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-3">
        {t(ui.search.noResultsBody, { query })}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-dark"
      >
        {ui.search.noResultsClear}
      </button>
    </Card>
  );
}
