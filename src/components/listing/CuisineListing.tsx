"use client";

import { useMemo, type ReactNode } from "react";
import type { Filter } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EmptyResults } from "@/components/sections/EmptyResults";
import { ListingControls } from "@/components/sections/ListingControls";
import { SectionHeading } from "@/components/ui/primitives";
import { filterItems, type ArticleListingItem } from "@/lib/search";
import { useListingParams } from "@/lib/useListingParams";

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
  const { query, setQuery, filterId, setFilterId, clearAll, isFiltered } =
    useListingParams("type");

  const results = useMemo(
    () => filterItems(items, query, filterId, (item) => item.dishTypeId),
    [items, query, filterId],
  );

  return (
    <>
      <ListingControls
        ui={ui}
        filters={filters}
        searchLabel={ui.listing.cuisine.searchLabel}
        placeholder={ui.listing.cuisine.searchPlaceholder}
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
