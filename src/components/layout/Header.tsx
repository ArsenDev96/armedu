"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/types";
import { LOCALES } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import type { NavItem } from "@/lib/navigation";

export interface HeaderProps {
  locale: Locale;
  /** Built on the server from the locale bundle — see `lib/navigation`. */
  nav: NavItem[];
  ui: UiDictionary;
}

export function Header(props: HeaderProps) {
  // `useSearchParams` in the switcher needs a boundary; the rest of the header
  // is static markup, so only the switcher waits on it.
  return (
    <Suspense fallback={null}>
      <HeaderInner {...props} />
    </Suspense>
  );
}

function HeaderInner({ locale, nav, ui }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenNav(null);
    setLocaleOpen(false);
  }, [pathname]);

  // Close any open dropdown on outside click or Escape.
  useEffect(() => {
    if (!openNav && !localeOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenNav(null);
        setLocaleOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenNav(null);
        setLocaleOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openNav, localeOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const isActive = (href: string) => {
    const home = `/${locale}`;
    return href === home ? pathname === home : pathname.startsWith(href);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  const current = LOCALES.find((entry) => entry.code === locale) ?? LOCALES[0];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="container-page" ref={navRef}>
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5"
            aria-label={ui.site.homeLinkLabel}
          >
            <Logo ui={ui} />
          </Link>

          <nav aria-label={ui.nav.mainLabel} className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {nav.map((item) => {
                const active = isActive(item.href);
                const open = openNav === item.href;

                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.children && setOpenNav(item.href)}
                    onMouseLeave={() => item.children && setOpenNav(null)}
                  >
                    <span className="flex items-center gap-1">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative py-5 text-sm font-medium transition",
                          active ? "text-burgundy" : "text-ink-2 hover:text-burgundy",
                        )}
                      >
                        {item.label}
                        {active ? (
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-4 h-0.5 rounded-full bg-burgundy"
                          />
                        ) : null}
                      </Link>

                      {item.children ? (
                        <button
                          type="button"
                          onClick={() => setOpenNav(open ? null : item.href)}
                          aria-expanded={open}
                          aria-label={ui.nav.submenuLabel.replace("{item}", item.label)}
                          className="text-ink-3 transition hover:text-burgundy"
                        >
                          <ChevronDownIcon
                            className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
                          />
                        </button>
                      ) : null}
                    </span>

                    {item.children && open ? (
                      <ul className="absolute top-full left-0 z-10 w-72 rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow-card-hover)]">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-paper-2 hover:text-burgundy"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              aria-label={ui.header.searchButtonLabel}
              className="grid h-9 w-9 place-items-center rounded-full bg-paper-2 text-ink-2 transition hover:bg-line hover:text-ink"
            >
              <SearchIcon className="h-4 w-4" />
            </button>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setLocaleOpen((open) => !open)}
                aria-expanded={localeOpen}
                aria-label={ui.header.selectLanguage}
                className="flex items-center gap-1.5 rounded-full border border-gold/60 px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition hover:border-gold hover:bg-gold-soft"
              >
                {current.short}
                <ChevronDownIcon
                  className={cn("h-3 w-3 transition-transform", localeOpen && "rotate-180")}
                />
              </button>

              {localeOpen ? (
                <div className="absolute top-full right-0 z-10 mt-2 w-52 rounded-xl border border-line bg-surface p-1.5 shadow-[var(--shadow-card-hover)]">
                  <LanguageSwitcher locale={locale} ui={ui} />
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={ui.nav.toggleMenu}
              className="rounded-full p-2.5 text-ink-2 transition hover:bg-paper-2 hover:text-ink lg:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div id="header-search" className="pb-4">
            <form
              role="search"
              action={`/${locale}/search`}
              onSubmit={submitSearch}
              className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 focus-within:border-burgundy"
            >
              <span className="text-ink-3" aria-hidden="true">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                ref={searchInputRef}
                type="search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui.header.searchPlaceholder}
                aria-label={ui.header.searchInputLabel}
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-burgundy px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-burgundy-dark"
              >
                {ui.header.searchSubmit}
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label={ui.nav.mobileLabel} className="border-t border-line bg-surface lg:hidden">
          <ul className="container-page flex flex-col py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3 py-3 text-base font-medium transition",
                    isActive(item.href) ? "text-burgundy" : "text-ink-2 hover:bg-paper-2",
                  )}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mb-1 ml-3 border-l border-line pl-3">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-3 transition hover:text-burgundy"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li className="mt-2 border-t border-line px-3 py-3">
              <h2 className="text-[0.6875rem] font-semibold tracking-[0.16em] text-ink-3 uppercase">
                {ui.header.languageHeading}
              </h2>
              <div className="mt-2.5">
                <LanguageSwitcher locale={locale} ui={ui} layout="inline" />
              </div>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

/**
 * Language switcher.
 *
 * Real `<Link>`s, not buttons: switching language is a navigation, so it should
 * be middle-clickable, openable in a new tab, and crawlable. The current path
 * and its query string are carried across, so a reader comparing a search or a
 * filtered listing in two languages keeps their place.
 */
function LanguageSwitcher({
  locale,
  ui,
  layout = "stacked",
}: {
  locale: Locale;
  ui: UiDictionary;
  layout?: "stacked" | "inline";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Everything after the locale segment, e.g. "/history/tigran-the-great".
  const rest = pathname.replace(/^\/[^/]+/, "") || "";
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";

  return (
    <ul className={cn(layout === "inline" ? "flex flex-wrap gap-2" : "flex flex-col")}>
      {LOCALES.map((entry) => {
        const active = entry.code === locale;
        const href = `/${entry.code}${rest}${suffix}`;

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
              className={cn(
                "block transition",
                layout === "inline"
                  ? "rounded-full border px-3 py-1.5 text-xs font-semibold"
                  : "rounded-lg px-3 py-2 text-sm",
                active
                  ? layout === "inline"
                    ? "border-burgundy bg-burgundy text-white"
                    : "bg-burgundy-soft font-semibold text-burgundy"
                  : layout === "inline"
                    ? "border-line text-ink-3 hover:border-burgundy hover:text-burgundy"
                    : "text-ink-2 hover:bg-paper-2",
              )}
            >
              {entry.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
