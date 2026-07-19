"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, site } from "@/data/site";
import { LOCALES } from "@/data/types";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [activeLocale, setActiveLocale] = useState("en");
  const navRef = useRef<HTMLDivElement>(null);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const currentLocale = LOCALES.find((locale) => locale.code === activeLocale) ?? LOCALES[1];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="container-page" ref={navRef}>
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
            <Logo />
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {mainNav.map((item) => {
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
                          aria-label={`${item.label} submenu`}
                          className="text-ink-3 transition hover:text-burgundy"
                        >
                          <ChevronDownIcon
                            className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
                          />
                        </button>
                      ) : null}
                    </span>

                    {item.children && open ? (
                      <ul className="absolute top-full left-0 z-10 w-64 rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow-card-hover)]">
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
              aria-label="Search articles"
              className="grid h-9 w-9 place-items-center rounded-full bg-paper-2 text-ink-2 transition hover:bg-line hover:text-ink"
            >
              <SearchIcon className="h-4 w-4" />
            </button>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setLocaleOpen((open) => !open)}
                aria-expanded={localeOpen}
                aria-label="Select language"
                className="flex items-center gap-1.5 rounded-full border border-gold/60 px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition hover:border-gold hover:bg-gold-soft"
              >
                {currentLocale.short}
                <ChevronDownIcon
                  className={cn("h-3 w-3 transition-transform", localeOpen && "rotate-180")}
                />
              </button>

              {localeOpen ? (
                <ul
                  role="group"
                  aria-label="Language"
                  className="absolute top-full right-0 z-10 mt-2 w-40 rounded-xl border border-line bg-surface p-1.5 shadow-[var(--shadow-card-hover)]"
                >
                  {LOCALES.map((locale) => (
                    <li key={locale.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLocale(locale.code);
                          setLocaleOpen(false);
                        }}
                        aria-pressed={activeLocale === locale.code}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                          activeLocale === locale.code
                            ? "bg-burgundy-soft font-semibold text-burgundy"
                            : "text-ink-2 hover:bg-paper-2",
                        )}
                      >
                        {locale.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
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
              onSubmit={(event) => event.preventDefault()}
              className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5"
            >
              <span className="text-ink-3" aria-hidden="true">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                type="search"
                name="q"
                placeholder="Search articles, writers, works…"
                aria-label="Search articles, writers and works"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
              />
            </form>
          </div>
        ) : null}
      </div>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-line bg-surface lg:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {mainNav.map((item) => (
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
            <li className="mt-2 flex gap-2 border-t border-line px-3 py-3 sm:hidden">
              {LOCALES.map((locale) => (
                <button
                  key={locale.code}
                  type="button"
                  onClick={() => setActiveLocale(locale.code)}
                  aria-pressed={activeLocale === locale.code}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    activeLocale === locale.code
                      ? "border-burgundy bg-burgundy text-white"
                      : "border-line text-ink-3",
                  )}
                >
                  {locale.label}
                </button>
              ))}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
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
