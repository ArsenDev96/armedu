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
const FILTER_KEYS = ["period", "type"] as const;

/**
 * Two independent filter axes, both held in the URL: `?period=` for the era and
 * `?type=` for the kind of subject. They combine with the search term as AND.
 *
 * `?period=` keeps its key and its era ids (`ancient`, `medieval`, `modern`), so
 * links and bookmarks written before the taxonomy split still resolve. Only
 * `kingdoms`, `people` and `battles` are gone — `people` never matched an
 * article, and the other two moved to the type axis.
 */
export function HistoryListing({
  items,
  periods,
  topicTypes,
  ui,
  children,
}: {
  items: ArticleListingItem[];
  periods: Filter[];
  topicTypes: Filter[];
  ui: UiDictionary;
  /** Server-rendered editorial block shown between the controls and the grid. */
  children?: ReactNode;
}) {
  const { query, setQuery, filters, setFilter, clearAll, isFiltered } = useListingParams(
    FILTER_KEYS,
  );

  const period = filters.period ?? ALL_FILTER_ID;
  const topicType = filters.type ?? ALL_FILTER_ID;

  const results = useMemo(
    () =>
      filterItems(items, query, [
        { selected: period, keyOf: (item) => item.periodId },
        { selected: topicType, keyOf: (item) => item.topicTypeId },
      ]),
    [items, query, period, topicType],
  );

  return (
    <>
      <ListingControls
        ui={ui}
        groups={[
          {
            paramKey: "period",
            heading: ui.listing.history.periodFilterHeading,
            filters: periods,
            selected: period,
            onSelect: (id) => setFilter("period", id),
          },
          {
            paramKey: "type",
            heading: ui.listing.history.topicTypeFilterHeading,
            filters: topicTypes,
            selected: topicType,
            onSelect: (id) => setFilter("type", id),
          },
        ]}
        searchLabel={ui.listing.history.searchLabel}
        placeholder={ui.listing.history.searchPlaceholder}
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
