"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/data/types";
import { LOCALES } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Logo } from "@/components/layout/Logo";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import type { NavItem } from "@/lib/navigation";

export interface HeaderProps {
  locale: Locale;
  /** Built on the server from the locale bundle — see `lib/navigation`. */
  nav: NavItem[];
  ui: UiDictionary;
}

/** How long a dropdown survives the pointer leaving it, in ms. */
const HOVER_CLOSE_DELAY = 140;

export function Header({ locale, nav, ui }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  /** True when the open dropdown was opened deliberately, not by hovering. */
  const [navPinned, setNavPinned] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [query, setQuery] = useState("");

  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submenuId = useId();

  const closeDropdowns = useCallback(() => {
    setOpenNav(null);
    setNavPinned(false);
    setLocaleOpen(false);
  }, []);

  /** Closes the drawer and hands focus back to the control that opened it. */
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }, []);

  // A navigation closes everything. No focus is moved back here — the reader
  // has left for another page, and yanking focus to a header button on arrival
  // would drop them above the content they asked for.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenSection(null);
    closeDropdowns();
  }, [pathname, closeDropdowns]);

  useEffect(() => () => clearTimer(closeTimer), []);

  // Escape closes whatever is open, innermost first. The search panel used to
  // be exempt from both this and the outside-click below, so it was the one
  // thing on the header a reader could only dismiss by finding its button again.
  useEffect(() => {
    if (!openNav && !localeOpen && !menuOpen && !searchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openNav || localeOpen) closeDropdowns();
      else if (menuOpen) closeMenu();
      else if (searchOpen) closeSearch();
    };

    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return;
      closeDropdowns();
      setSearchOpen(false);
      setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [openNav, localeOpen, menuOpen, searchOpen, closeDropdowns, closeMenu, closeSearch]);

  // The drawer is a modal overlay, so the page behind it must not scroll. The
  // padding compensates for the scrollbar the lock removes, which is what stops
  // the whole layout jumping sideways as the menu opens on a desktop browser.
  useEffect(() => {
    if (!menuOpen) return;

    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, [menuOpen]);

  // Focus enters the panel when it opens and is kept inside it while it is:
  // an open drawer covers the page, so tabbing through the links behind it
  // would send focus somewhere the reader cannot see.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = drawerRef.current;
    if (!panel) return;

    panel.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const target = event.target as Node;
      // Focus sitting on the panel itself counts as "before the first item".
      if (event.shiftKey && (target === panel || target === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && target === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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

  const hoverOpen = (href: string) => {
    clearTimer(closeTimer);
    setOpenNav(href);
  };

  // A dropdown opened by hovering closes when the pointer leaves, but only
  // after a beat — without the delay, cutting the corner between the trigger
  // and the panel below it shut the menu mid-reach. One opened by clicking the
  // chevron stays put: it was asked for, so it waits to be dismissed.
  const hoverClose = () => {
    if (navPinned) return;
    clearTimer(closeTimer);
    closeTimer.current = setTimeout(() => setOpenNav(null), HOVER_CLOSE_DELAY);
  };

  const current = LOCALES.find((entry) => entry.code === locale) ?? LOCALES[0];
  /*
    The bar stays at six items. A journey is not a seventh section — see
    `NavItem.journey` and the width note below — so it is filtered out here and
    rendered as an action beside the search and edition controls instead. The
    drawer maps the whole `nav` array and picks it up without special-casing.
  */
  const barNav = nav.filter((item) => !item.drawerOnly && !item.journey);
  const journey = nav.find((item) => item.journey);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md"
    >
      {/*
        The drawer's backdrop is a child of this header, so the bar has to claim
        a layer above it explicitly — otherwise the scrim paints over the very
        controls that close it.
      */}
      <div className="relative z-10 container-page bg-surface/95">
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5"
            aria-label={ui.site.homeLinkLabel}
          >
            <Logo ui={ui} priority />
          </Link>

          {/*
            The horizontal nav appears at `lg`, and only fits there because of
            two decisions above it.

            Measured in Armenian — the widest of the three editions — six items
            at their full names ran 808px against the 767px the row had left at
            1280px, so the labels broke mid-phrase ("Հայոց / պատմություն") and
            the nav had to be held back to `xl`. Handing every 1024–1280px
            laptop a hamburger to fix a wrapping label was the wrong trade.

            So the width came out of the labels instead. "Home" is gone from the
            bar because the logo beside it already goes home (it stays in the
            drawer, where there is room and no logo to lean on), and the four
            sections use their bare nouns — «Պատմություն» rather than «Հայոց
            պատմություն» — since the logo directly overhead says whose history
            this is. That is 808px down to 520px, and it fits at 1024px with
            room to spare. `header.spec.ts` measures all three editions at the
            breakpoint, so the next long label fails a test, not a layout.
          */}
          <nav aria-label={ui.nav.mainLabel} className="hidden lg:block">
            <ul className="flex items-center gap-4 xl:gap-6">
              {barNav.map((item) => {
                const active = isActive(item.href);
                const open = openNav === item.href;
                const panelId = `${submenuId}-${item.href}`;

                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.children && hoverOpen(item.href)}
                    onMouseLeave={() => item.children && hoverClose()}
                  >
                    <span className="flex items-center gap-1">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative py-5 text-sm font-medium whitespace-nowrap transition",
                          active ? "text-burgundy" : "text-ink-2 hover:text-burgundy",
                        )}
                      >
                        {item.shortLabel ?? item.label}
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
                          onClick={() => {
                            clearTimer(closeTimer);
                            const next = open && navPinned ? null : item.href;
                            setOpenNav(next);
                            setNavPinned(Boolean(next));
                          }}
                          aria-expanded={open}
                          aria-controls={panelId}
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
                      <ul
                        id={panelId}
                        className="absolute top-full left-0 z-10 w-72 rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow-card-hover)]"
                      >
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/*
              The Visit journey, rendered as an action rather than a nav item.

              It is a filled pill next to the icon buttons, so it reads as
              something to do rather than as a seventh place to browse — the
              distinction the whole two-journey split exists to make. It appears
              at `lg` alongside the horizontal nav and is absent below it, where
              the drawer already carries it as its second entry; adding a fourth
              control to a 360px bar would have cost more than it gave.
            */}
            {journey ? (
              <Link
                href={journey.href}
                aria-current={isActive(journey.href) ? "page" : undefined}
                className="hidden rounded-full bg-burgundy px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap text-white shadow-[0_10px_24px_-14px_rgba(123,44,55,0.9)] transition hover:bg-burgundy-dark lg:inline-flex xl:px-4 xl:py-2"
              >
                {journey.shortLabel ?? journey.label}
              </Link>
            ) : null}

            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              aria-label={ui.header.searchButtonLabel}
              className="grid h-9 w-9 place-items-center rounded-full bg-paper-2 text-ink-2 transition hover:bg-line hover:text-ink"
            >
              <SearchIcon className="h-4 w-4" />
            </button>

            {/*
              Visible at every width. On a trilingual site the edition switch is
              the one control worth the space, and hiding it below 640px meant a
              reader who landed on the wrong one had to work out that it lived
              behind the hamburger.
            */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocaleOpen((open) => !open)}
                aria-expanded={localeOpen}
                aria-label={ui.header.selectLanguage}
                className="flex items-center gap-1.5 rounded-full border border-gold/60 px-3 py-1.5 text-xs font-semibold text-ink-2 transition hover:border-gold hover:bg-gold-soft sm:px-3.5"
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
              ref={menuButtonRef}
              type="button"
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
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
        <>
          {/*
            Positioned against this header, not the viewport. `backdrop-blur` on
            the bar sets a `backdrop-filter`, which makes the header a containing
            block for `position: fixed` descendants — so a `fixed inset-0` scrim
            here resolves to the header's own 64px strip and dims nothing. Hung
            off `top-full` at viewport height instead, which is the same surface
            while the body behind it is locked.
          */}
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="absolute inset-x-0 top-full z-0 h-dvh bg-ink/25 lg:hidden"
          />

          {/*
            An overlay rather than a block that pushes the page down, so the
            drawer scrolls on its own while the body stays locked behind it.
          */}
          <nav
            id="mobile-menu"
            ref={drawerRef}
            tabIndex={-1}
            aria-label={ui.nav.mobileLabel}
            className="absolute inset-x-0 top-full z-20 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-surface shadow-[var(--shadow-card-hover)] outline-none md:max-h-[calc(100dvh-4.5rem)] lg:hidden"
          >
            <ul className="container-page flex flex-col py-2">
              {nav.map((item) => {
                const expanded = openSection === item.href;
                const sectionId = `${submenuId}-drawer-${item.href}`;

                return (
                  <li key={item.href}>
                    {/*
                      Sections start collapsed. Expanded, the drawer was a flat
                      35-link scroll — every category's five articles at once —
                      which buried the six destinations most readers wanted.
                    */}
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "flex-1 rounded-xl px-3 py-3 text-base font-medium transition",
                          isActive(item.href) ? "text-burgundy" : "text-ink-2 hover:bg-paper-2",
                        )}
                      >
                        {item.label}
                      </Link>

                      {item.children ? (
                        <button
                          type="button"
                          onClick={() => setOpenSection(expanded ? null : item.href)}
                          aria-expanded={expanded}
                          aria-controls={sectionId}
                          aria-label={ui.nav.submenuLabel.replace("{item}", item.label)}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-3 transition hover:bg-paper-2 hover:text-burgundy"
                        >
                          <ChevronDownIcon
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expanded && "rotate-180",
                            )}
                          />
                        </button>
                      ) : null}
                    </div>

                    {item.children && expanded ? (
                      <ul id={sectionId} className="mb-1 ml-3 border-l border-line pl-3">
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
                );
              })}

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
        </>
      ) : null}
    </header>
  );
}

function clearTimer(ref: React.RefObject<ReturnType<typeof setTimeout> | null>) {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
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
