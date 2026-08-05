"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LOCALES, type Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { cn } from "@/lib/cn";

/**
 * Language switcher — one implementation for the header dropdown, the mobile
 * drawer and the footer bar.
 *
 * Real `<Link>`s, not buttons: switching edition is a navigation, so it should
 * be middle-clickable, openable in a new tab, and crawlable.
 *
 * Every layout carries the reader across at the same place they were. The
 * footer used to be the exception — it sent every language link to `/{code}`,
 * so a reader four screens into an article who wanted it in English landed on
 * the homepage instead, while the identical control in the header would have
 * kept them on the page.
 */
export type LanguageSwitcherLayout = "stacked" | "inline" | "bar";

export interface LanguageSwitcherProps {
  locale: Locale;
  ui: UiDictionary;
  layout?: LanguageSwitcherLayout;
}

export function LanguageSwitcher({ locale, ui, layout = "stacked" }: LanguageSwitcherProps) {
  /*
    `useSearchParams` opts its subtree out of static rendering unless a boundary
    catches it, and the fallback is what ends up in the prerendered HTML. So the
    fallback is the full switcher minus the query string rather than `null`:
    every locale link is in the static markup with the right path — which is
    what a crawler reads and what a reader with slow hydration clicks — and the
    query string is grafted on once the client takes over.
  */
  return (
    <Suspense fallback={<LocaleLinks locale={locale} ui={ui} layout={layout} suffix="" />}>
      <LocaleLinksWithQuery locale={locale} ui={ui} layout={layout} />
    </Suspense>
  );
}

function LocaleLinksWithQuery({ locale, ui, layout }: LanguageSwitcherProps) {
  const search = useSearchParams().toString();
  return (
    <LocaleLinks locale={locale} ui={ui} layout={layout} suffix={search ? `?${search}` : ""} />
  );
}

function LocaleLinks({
  locale,
  ui,
  layout = "stacked",
  suffix,
}: LanguageSwitcherProps & { suffix: string }) {
  const pathname = usePathname();

  // Everything after the locale segment, e.g. "/history/tigran-the-great".
  const rest = pathname.replace(/^\/[^/]+/, "") || "";

  return (
    <ul
      className={cn(
        layout === "stacked" && "flex flex-col",
        layout === "inline" && "flex flex-wrap gap-2",
        layout === "bar" && "flex flex-wrap items-center gap-x-4 gap-y-2",
      )}
    >
      {LOCALES.map((entry) => {
        const active = entry.code === locale;
        const href = `/${entry.code}${rest}${suffix}`;

        const className = cn(
          "block transition",
          layout === "stacked" && "rounded-lg px-3 py-2 text-sm",
          layout === "inline" && "rounded-full border px-3 py-1.5 text-xs font-semibold",
          layout === "bar" && "text-sm",
          active
            ? {
                stacked: "bg-burgundy-soft font-semibold text-burgundy",
                inline: "border-burgundy bg-burgundy text-white",
                bar: "font-semibold text-white",
              }[layout]
            : {
                stacked: "text-ink-2 hover:bg-paper-2",
                inline: "border-line text-ink-3 hover:border-burgundy hover:text-burgundy",
                bar: "hover:text-white",
              }[layout],
        );

        return (
          <li key={entry.code}>
            <Link
              href={href}
              hrefLang={entry.htmlLang}
              lang={entry.htmlLang}
              aria-current={active ? "true" : undefined}
              aria-label={
                active
                  ? ui.header.currentLanguage.replace("{language}", entry.label)
                  : ui.header.switchToLanguage.replace("{language}", entry.label)
              }
              className={className}
            >
              {entry.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
