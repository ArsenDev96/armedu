"use client";

import { useMemo, type ReactNode } from "react";
import type { Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EmptyResults } from "@/components/sections/EmptyResults";
import { ListingControls } from "@/components/sections/ListingControls";
import { SectionHeading } from "@/components/ui/primitives";
import { filterItems, type HistoryListingItem } from "@/lib/search";
import { useListingParams } from "@/lib/useListingParams";

export function HistoryListing({
  items,
  filters,
  ui,
  children,
}: {
  items: HistoryListingItem[];
  filters: Filter[];
  ui: UiDictionary;
  /** Server-rendered editorial block shown between the controls and the grid. */
  children?: ReactNode;
}) {
  const { query, setQuery, filterId, setFilterId, clearAll, isFiltered } =
    useListingParams("period");

  const results = useMemo(
    () => filterItems(items, query, filterId, (item) => item.periodId),
    [items, query, filterId],
  );

  return (
    <>
      <ListingControls
        ui={ui}
        filters={filters}
        searchLabel={ui.listing.history.searchLabel}
        placeholder={ui.listing.history.searchPlaceholder}
        query={query}
        onQueryChange={setQuery}
        activeFilter={filterId}
        onFilterChange={setFilterId}
        onClear={clearAll}
        resultCount={results.length}
        resultNoun="articles"
        isFiltered={isFiltered}
      />

      {children}

      <div className="mt-14 md:mt-16">
        <SectionHeading
          eyebrow={ui.listing.history.allEyebrow}
          title={ui.listing.history.allTitle}
          description={ui.listing.history.allDescription}
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
