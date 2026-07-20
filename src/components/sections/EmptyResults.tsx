import type { UiDictionary } from "@/data/ui";
import { t } from "@/lib/i18n";

/**
 * Shown when a search or filter combination matches nothing. Deliberately plain:
 * the same paper card as the rest of the site, no illustration, no mascot.
 */
export function EmptyResults({
  ui,
  query,
  onClear,
}: {
  ui: UiDictionary;
  query?: string;
  onClear: () => void;
}) {
  const trimmed = query?.trim();

  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center md:py-16">
      <h3 className="text-xl text-ink sm:text-2xl">{ui.empty.heading}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-3">
        {trimmed ? t(ui.empty.bodyWithQuery, { query: trimmed }) : ui.empty.bodyNoQuery}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-dark"
      >
        {ui.empty.clearLabel}
      </button>
    </div>
  );
}
