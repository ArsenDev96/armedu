# ArmEdu — Armenian educational content platform

An informational website about Armenian history, writers, literary works and cultural
heritage, built for students, teachers, parents and Armenians living abroad.

The platform is **Armenian-first**: Eastern Armenian is the default and the complete
edition, Western Armenian is a growing second edition, and English is the third.

The project is deliberately content-only: no accounts, no login, no quizzes, comments,
payments, dashboards or progress tracking.

## Stack

- Next.js 16 (App Router) with TypeScript strict mode
- Tailwind CSS v4 (design tokens declared in `src/app/globals.css`)
- Local, statically typed content — no database, no CMS
- Supabase, used for exactly one thing: newsletter email collection

## Getting started

```bash
npm install
npm run dev               # http://localhost:3002 → redirects to /hy
npm run build             # production build (every page is statically generated)
npm start
npm run typecheck
npm run validate:content  # multilingual content and translation checks
npm run test:e2e          # Playwright suite (starts the dev server itself)
```

The site runs fully without any environment variables. Only the newsletter form
needs configuration — see [Newsletter](#newsletter-supabase).

## Languages and routing

| Locale | Edition | Coverage |
| --- | --- | --- |
| `hy` | Հայերեն (Eastern Armenian) | **Default.** Complete — all 17 articles |
| `hyw` | Արեւմտահայերէն (Western Armenian) | Complete interface, 9 of 17 articles |
| `en` | English | Complete — all 17 articles |

Every public page lives under a locale segment:

```
/                       → redirects to /hy
/hy  /hyw  /en          homepage
/<locale>/history       /<locale>/history/[slug]
/<locale>/writers       /<locale>/writers/[slug]
/<locale>/works         /<locale>/works/[slug]
/<locale>/search
/<locale>/about  /contact  /privacy
```

`src/app/[locale]/layout.tsx` **is** the root layout — that is what lets `<html lang>`
carry the real language of each page. `/` is redirected in `next.config.ts` rather than
by middleware, and an unsupported first segment (`/ru`, `/foo`) returns 404 because the
locale segment sets `dynamicParams = false`.

### No silent fallback

There is no fallback between editions. `getLocaleBundle(locale)` has nowhere to fall
back *to*, and every content helper takes `locale` as a required first argument — an
optional locale is exactly how English leaks onto an Armenian page.

When an article exists in the project but not in the language being read, the site
renders an explicit "not translated yet" page that links to the editions that do exist.
Those pages are `noindex`, and the article's `hreflang` alternates omit that locale, so
a crawler is never told a translation exists when it does not.

Missing UI translations are **compile errors**: every locale must satisfy the
`UiDictionary` interface in `src/data/ui.ts`, where every field is required.

## Content architecture

```
src/data/
  types.ts              Locale model, content types, LocaleContent
  ui.ts                 UiDictionary — every visible interface string
  index.ts              Locale registry (no fallback)
  locales/<locale>/
    ui.ts               Interface translations
    pages.ts            About / Contact / Privacy copy
    history.ts          Categories, timeline, period filters
    writers.ts          Writer cards, literary period filters
    works.ts            Work cards, genre filters
    articles/           Full article content, grouped by section
```

Slugs are **shared and Latin across all editions** (`tigran-the-great`), as are filter
and category ids. Only labels and prose are translated. Content stores locale-free paths
(`/history/tigran-the-great`); the locale prefix is added at render time by
`localePath()`.

Terminology and orthography rules are in
[`docs/translation-glossary.md`](docs/translation-glossary.md).

## Search and filtering

All searching happens in the browser against the active locale's bundle only — no index,
no API route, no external service. An Armenian query never reaches English text.

`src/lib/search.ts` holds the shared helpers; `src/lib/useListingParams.ts` keeps each
listing's state in the URL using the native History API, so typing never triggers a
server request and the pages stay statically generated.

- Listing search and filters combine with AND behaviour.
- State is reflected in the URL: `/hy/history?q=Ուրարտու&period=ancient`,
  `/en/works?type=poetry`. Opening such a URL restores the state; Back and Forward step
  through it.
- `/<locale>/search` searches every article, biography and literary work in that edition
  and groups the results by content type.
- Switching language carries the current path and query across.

## Newsletter (Supabase)

Supabase stores newsletter email addresses and nothing else. No content, no
authentication, no search.

```bash
cp .env.example .env.local   # then fill in the two values
```

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |

Run [`docs/supabase-newsletter.sql`](docs/supabase-newsletter.sql) once in the Supabase
SQL editor to create the table and its insert-only policy. The form records the active
route locale (`hy`, `hyw` or `en`) alongside the address. Full instructions and the
security rationale are in [`docs/supabase-newsletter.md`](docs/supabase-newsletter.md).

Without those variables the form shows a development notice instead of a fake success,
and nothing crashes.

## Adding content

Add an object to the relevant file under `src/data/locales/<locale>/articles/`. Every
article conforms to the `Article` interface in `src/data/types.ts`, so the page layout,
table of contents, key facts, dates, related figures and sources all render
automatically. New slugs are picked up by `generateStaticParams` and the sitemap.

`npm run validate:content` enforces the rules that types cannot: unique slugs,
resolvable cross-references within a locale, filter ids that exist, declared translation
gaps, and Western Armenian orthography.

## Known limitations

- **Western Armenian is a partial edition by design.** Eight articles are not translated
  yet and are declared in `DECLARED_UNAVAILABLE` in `scripts/validate-content.ts`; the
  site shows an explicit unavailable page for them.
- **Translations need a native-speaker pass.** Items known to be contested are listed at
  the end of [`docs/translation-glossary.md`](docs/translation-glossary.md).
- **Article imagery is still generated placeholder art** (`PlaceholderImage`). The hero
  and the three category photographs are real. Licensed photography has a defined slot:
  the optional `image: { src, alt, credit }` field on `Article`.
- **Social profile links are omitted entirely** until real profiles exist — see
  `socialLinks` in `src/data/site.ts`.
- **The public domain and contact address are placeholders**, centralised at the top of
  `src/data/site.ts`.
- **No deployment, CI, analytics or Search Console** — excluded by project constraint.
