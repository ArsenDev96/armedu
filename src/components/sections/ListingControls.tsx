"use client";

import { useState } from "react";
import type { Filter } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Search field and filter pills for listing pages. Presentation only in the
 * MVP: the filters highlight a selection but do not yet narrow the content.
 */
export function ListingControls({
  filters,
  searchLabel,
  placeholder,
}: {
  filters: Filter[];
  searchLabel: string;
  placeholder: string;
}) {
  const [active, setActive] = useState(filters[0]?.id ?? "all");

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 md:p-6">
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="listing-search" className="sr-only">
          {searchLabel}
        </label>
        <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3">
          <span aria-hidden="true" className="text-ink-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="listing-search"
            type="search"
            name="q"
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
        </div>
      </form>

      <div className="mt-5">
        <h2 className="sr-only">Filters</h2>
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <li key={filter.id}>
              <button
                type="button"
                onClick={() => setActive(filter.id)}
                aria-pressed={active === filter.id}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  active === filter.id
                    ? "border-burgundy bg-burgundy text-white"
                    : "border-line text-ink-2 hover:border-line-strong hover:text-ink",
                )}
              >
                {filter.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
