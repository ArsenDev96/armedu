import Link from "next/link";
import type { ArticleSummary, Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { localePath, t } from "@/lib/i18n";

/**
 * Previous/next navigation within one category **and one locale**. Either side
 * is omitted when there is nothing there, rather than rendered disabled — a
 * link that goes nowhere is the thing this project is trying to remove.
 */
export function ArticleNav({
  locale,
  ui,
  previous,
  next,
  categoryLabel,
}: {
  locale: Locale;
  ui: UiDictionary;
  previous?: ArticleSummary;
  next?: ArticleSummary;
  categoryLabel: string;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={t(ui.article.moreInCategory, { category: categoryLabel })}
      className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={localePath(locale, previous.href)}
          aria-label={t(ui.article.previousAria, {
            category: categoryLabel,
            title: previous.title,
          })}
          className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-burgundy"
        >
          <span className="text-xs font-semibold tracking-[0.14em] text-ink-3 uppercase">
            <span aria-hidden="true">← </span>
            {ui.article.previous}
          </span>
          <span className="mt-2 font-serif text-base leading-snug text-ink transition group-hover:text-burgundy">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={localePath(locale, next.href)}
          aria-label={t(ui.article.nextAria, { category: categoryLabel, title: next.title })}
          className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-burgundy sm:items-end sm:text-right"
        >
          <span className="text-xs font-semibold tracking-[0.14em] text-ink-3 uppercase">
            {ui.article.next}
            <span aria-hidden="true"> →</span>
          </span>
          <span className="mt-2 font-serif text-base leading-snug text-ink transition group-hover:text-burgundy">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
