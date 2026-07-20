/**
 * Rendered in place of a listing while its client component hydrates.
 *
 * Listings read the URL through `useSearchParams`, which needs a Suspense
 * boundary for the page to stay statically generated. This is the placeholder
 * the boundary shows — the same paper card, so nothing shifts when the real
 * controls arrive.
 */
export function ListingFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-[13.5rem] rounded-2xl border border-line bg-surface md:h-[12rem]"
    />
  );
}
