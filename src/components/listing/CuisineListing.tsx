"use client";

import { useMemo, type ReactNode } from "react";
import { ALL_FILTER_ID, type Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EmptyResults } from "@/components/sections/EmptyResults";
import { ListingControls } from "@/components/sections/ListingControls";
import { SectionHeading } from "@/components/ui/primitives";
import { filterItems, type ArticleListingItem } from "@/lib/search";
import { useListingParams } from "@/lib/useListingParams";

/** Module-level so the array identity is stable across renders. */
const FILTER_KEYS = ["type"] as const;

/**
 * The cuisine listing.
 *
 * Structurally the history listing: the same controls, the same cards, the same
 * URL-held state. It differs in one field — the filter pills select a kind of
 * dish (`dishTypeId`) rather than an era — and in the URL key, `type`, which is
 * what the works listing already uses for a classification that is not a period.
 */
export function CuisineListing({
  items,
  filters,
  ui,
  children,
}: {
  items: ArticleListingItem[];
  filters: Filter[];
  ui: UiDictionary;
  /** Server-rendered editorial block shown between the controls and the grid. */
  children?: ReactNode;
}) {
  // Renamed on destructuring: `filters` is already this component's prop,
  // which is the filter *vocabulary*, not the reader's current selection.
  const { query, setQuery, filters: selection, setFilter, clearAll, isFiltered } =
    useListingParams(FILTER_KEYS);

  const selected = selection.type ?? ALL_FILTER_ID;

  const results = useMemo(
    () => filterItems(items, query, [{ selected, keyOf: (item) => item.dishTypeId }]),
    [items, query, selected],
  );

  return (
    <>
      <ListingControls
        ui={ui}
        groups={[
          {
            paramKey: "type",
            heading: ui.listing.filtersHeading,
            filters,
            selected,
            onSelect: (id) => setFilter("type", id),
          },
        ]}
        searchLabel={ui.listing.cuisine.searchLabel}
        placeholder={ui.listing.cuisine.searchPlaceholder}
        query={query}
        onQueryChange={setQuery}
        onClear={clearAll}
        resultCount={results.length}
        resultNoun="articles"
        isFiltered={isFiltered}
      />

      {children}

      <div className="mt-14 md:mt-16">
        <SectionHeading
          eyebrow={ui.listing.cuisine.allEyebrow}
          title={ui.listing.cuisine.allTitle}
          description={ui.listing.cuisine.allDescription}
        />
        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} ui={ui} />
            ))}
          </div>
        ) : (
          <EmptyResults ui={ui} query={query} onClear={clearAll} />
        )}
      </div>
    </>
  );
}
