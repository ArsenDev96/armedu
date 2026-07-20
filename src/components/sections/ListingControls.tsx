"use client";

import { useId } from "react";
import type { Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/i18n";

/** Which noun the result count uses. Filter ids stay stable; only labels translate. */
export type ResultNoun = "articles" | "writers" | "works";

/**
 * Search field and filter pills for listing pages.
 *
 * Fully controlled: the owning listing holds the state and keeps it in the URL,
 * so this component stays reusable across history, writers and works — and
 * across all three editions.
 */
export function ListingControls({
  ui,
  filters,
  searchLabel,
  placeholder,
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
  onClear,
  resultCount,
  resultNoun,
  isFiltered,
}: {
  ui: UiDictionary;
  filters: Filter[];
  searchLabel: string;
  placeholder: string;
  query: string;
  onQueryChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (id: string) => void;
  onClear: () => void;
  resultCount: number;
  resultNoun: ResultNoun;
  isFiltered: boolean;
}) {
  const searchId = useId();
  const filtersId = useId();

  const countTemplates = {
    articles: [ui.listing.countArticlesOne, ui.listing.countArticlesOther],
    writers: [ui.listing.countWritersOne, ui.listing.countWritersOther],
    works: [ui.listing.countWorksOne, ui.listing.countWorksOther],
  } as const;

  const [one, other] = countTemplates[resultNoun];
  const countText = plural(one, other, resultCount);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 md:p-6">
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={searchId} className="sr-only">
          {searchLabel}
        </label>
        <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3 focus-within:border-burgundy">
          <span aria-hidden="true" className="text-ink-3">
            <SearchIcon className="h-[18px] w-[18px]" />
          </span>
          <input
            id={searchId}
            type="search"
            name="q"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-ink-3 transition hover:text-burgundy"
            >
              {ui.listing.clearSearch}
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-5">
        <h2 id={filtersId} className="sr-only">
          {ui.listing.filtersHeading}
        </h2>
        <ul aria-labelledby={filtersId} className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <li key={filter.id}>
                <button
                  type="button"
                  onClick={() => onFilterChange(filter.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    active
                      ? "border-burgundy bg-burgundy text-white"
                      : "border-line text-ink-2 hover:border-line-strong hover:text-ink",
                  )}
                >
                  {filter.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
        <p aria-live="polite" className="text-sm text-ink-3">
          {countText} {isFiltered ? ui.listing.matchesSearch : ui.listing.available}
        </p>
        {isFiltered ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink-2 transition hover:border-burgundy hover:text-burgundy"
          >
            {ui.listing.clearAllFilters}
          </button>
        ) : null}
      </div>
    </div>
  );
}
