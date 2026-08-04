"use client";

import { useMemo, type ReactNode } from "react";
import { ALL_FILTER_ID, type Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { WriterCard } from "@/components/cards/WriterCard";
import { EmptyResults } from "@/components/sections/EmptyResults";
import { ListingControls } from "@/components/sections/ListingControls";
import { SectionHeading } from "@/components/ui/primitives";
import { filterItems, type WriterListingItem } from "@/lib/search";
import { useListingParams } from "@/lib/useListingParams";

/** Module-level so the array identity is stable across renders. */
const FILTER_KEYS = ["period"] as const;

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
  // Renamed on destructuring: `filters` is already this component's prop,
  // which is the filter *vocabulary*, not the reader's current selection.
  const { query, setQuery, filters: selection, setFilter, clearAll, isFiltered } =
    useListingParams(FILTER_KEYS);

  const selected = selection.period ?? ALL_FILTER_ID;

  const results = useMemo(
    () => filterItems(items, query, [{ selected, keyOf: (item) => item.periodId }]),
    [items, query, selected],
  );

  return (
    <>
      <ListingControls
        ui={ui}
        groups={[
          {
            paramKey: "period",
            heading: ui.listing.filtersHeading,
            filters,
            selected,
            onSelect: (id) => setFilter("period", id),
          },
        ]}
        searchLabel={ui.listing.writers.searchLabel}
        placeholder={ui.listing.writers.searchPlaceholder}
        query={query}
        onQueryChange={setQuery}
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
