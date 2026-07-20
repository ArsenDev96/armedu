"use client";

import { useMemo, type ReactNode } from "react";
import type { Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { WriterCard } from "@/components/cards/WriterCard";
import { EmptyResults } from "@/components/sections/EmptyResults";
import { ListingControls } from "@/components/sections/ListingControls";
import { SectionHeading } from "@/components/ui/primitives";
import { filterItems, type WriterListingItem } from "@/lib/search";
import { useListingParams } from "@/lib/useListingParams";

export function WritersListing({
  items,
  filters,
  ui,
  children,
}: {
  items: WriterListingItem[];
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
        searchLabel={ui.listing.writers.searchLabel}
        placeholder={ui.listing.writers.searchPlaceholder}
        query={query}
        onQueryChange={setQuery}
        activeFilter={filterId}
        onFilterChange={setFilterId}
        onClear={clearAll}
        resultCount={results.length}
        resultNoun="writers"
        isFiltered={isFiltered}
      />

      {children}

      <div className="mt-14 md:mt-16">
        <SectionHeading
          eyebrow={ui.listing.writers.allEyebrow}
          title={ui.listing.writers.allTitle}
          description={ui.listing.writers.allDescription}
        />
        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((writer) => (
              <WriterCard key={writer.slug} writer={writer} href={writer.href} ui={ui} />
            ))}
          </div>
        ) : (
          <EmptyResults ui={ui} query={query} onClear={clearAll} />
        )}
      </div>
    </>
  );
}
