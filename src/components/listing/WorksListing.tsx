"use client";

import { useMemo, type ReactNode } from "react";
import type { Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { WorkCard } from "@/components/cards/WorkCard";
import { EmptyResults } from "@/components/sections/EmptyResults";
import { ListingControls } from "@/components/sections/ListingControls";
import { SectionHeading } from "@/components/ui/primitives";
import { filterItems, type WorkListingItem } from "@/lib/search";
import { useListingParams } from "@/lib/useListingParams";

export function WorksListing({
  items,
  filters,
  ui,
  children,
}: {
  items: WorkListingItem[];
  filters: Filter[];
  ui: UiDictionary;
  /** Server-rendered editorial block shown between the controls and the grid. */
  children?: ReactNode;
}) {
  // Works are filtered by genre — the one structured axis the work model
  // already has. `type` keeps the query parameter readable: /works?type=poetry
  const { query, setQuery, filterId, setFilterId, clearAll, isFiltered } =
    useListingParams("type");

  const results = useMemo(
    () => filterItems(items, query, filterId, (item) => item.genreId),
    [items, query, filterId],
  );

  return (
    <>
      <ListingControls
        ui={ui}
        filters={filters}
        searchLabel={ui.listing.works.searchLabel}
        placeholder={ui.listing.works.searchPlaceholder}
        query={query}
        onQueryChange={setQuery}
        activeFilter={filterId}
        onFilterChange={setFilterId}
        onClear={clearAll}
        resultCount={results.length}
        resultNoun="works"
        isFiltered={isFiltered}
      />

      {children}

      <div className="mt-14 md:mt-16">
        <SectionHeading
          eyebrow={ui.listing.works.allEyebrow}
          title={ui.listing.works.allTitle}
          description={ui.listing.works.allDescription}
        />
        {results.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {results.map((work) => (
              <WorkCard key={work.slug} work={work} href={work.href} ui={ui} />
            ))}
          </div>
        ) : (
          <EmptyResults ui={ui} query={query} onClear={clearAll} />
        )}
      </div>
    </>
  );
}
