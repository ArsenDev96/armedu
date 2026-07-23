# Armat — Armenian educational content platform

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
- Supabase, used for two things only: newsletter email collection and a copy of each
  contact-form message
- nodemailer, used only by `/api/contact` to send contact messages over SMTP

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
  sources.ts            The bibliography, keyed by slug — shared by all editions
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

## Imagery

`src/lib/media.ts` maps each content slug to its file under `public/images/`. One registry
serves all three editions, since slugs are shared and only the alt text and caption are
localized. `ContentPhoto` renders `next/image` when a slug has artwork and falls back to
the generated `PlaceholderImage` when it does not, so content added ahead of its picture
still renders a complete card.

To add artwork: drop the file in `public/images/<category>/` and add one line to the
registry. `npm run validate:content` fails if the file is missing or the key matches no
article slug.

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

## Contact form (SMTP)

The contact form on `/[locale]/contact` posts to `/api/contact`, the only server route in
the project. It exists so the SMTP password stays on the server: none of these variables
carry a `NEXT_PUBLIC_` prefix, and none of them may be given one.

| Variable | Notes |
| --- | --- |
| `SMTP_HOST` | Your mail provider's outgoing server |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (implicit TLS) |
| `SMTP_SECURE` | `true` only for port 465 |
| `SMTP_USER` / `SMTP_PASSWORD` | Use an app password where the provider offers one |
| `CONTACT_FROM_EMAIL` | Defaults to `SMTP_USER`; must be an address you may send as |
| `CONTACT_TO_EMAIL` | Where messages arrive; defaults to the published contact address |

Run [`docs/supabase-contact.sql`](docs/supabase-contact.sql) once in the Supabase SQL
editor. The route emails the message *and* files a copy in `contact_messages`, so nothing
is lost if the mail server rejects or silently drops it. If both fail, the reader is told
the message did not go through — never a fake success.

Abuse controls: a honeypot field, 5 submissions per IP per 10 minutes (in-memory, per
process), and length limits enforced in the route and again as SQL constraints.

## Adding content

Add an object to the relevant file under `src/data/locales/<locale>/articles/`. Every
article conforms to the `Article` interface in `src/data/types.ts`, so the page layout,
table of contents, key facts, dates, related figures and sources all render
automatically. New slugs are picked up by `generateStaticParams` and the sitemap.

Then add the article's bibliography to `src/data/sources.ts`, keyed by the same slug.

`npm run validate:content` enforces the rules that types cannot: unique slugs,
resolvable cross-references within a locale, filter ids that exist, declared translation
gaps, Western Armenian orthography, and that every article has at least one source.

## Sources

The bibliography lives in [`src/data/sources.ts`](src/data/sources.ts), keyed by article
slug and **shared by all three editions** — a citation is language-neutral, and keeping
three copies of it is what let the first version rot unnoticed.

Every citation must carry an identifier: an ISBN, a DOI, a stable URL, or an archival
reference for record groups that are not publications. This is not bureaucracy. An audit
in July 2026 found that 18 of the 48 original citations named books that **do not exist** —
plausible titles attached to real publishers, each linked to a publisher homepage that
always resolved and so always looked convincing. A fabricated work cannot supply an ISBN,
so the requirement fails at the moment the citation is written rather than in front of a
student who trusted it. `validate:content` enforces it.

## Known limitations

- **The prose has been fact-checked once, in July 2026, and needed real corrections.**
  Around twenty factual errors were found and fixed, including an inverted Plutarch
  quotation, a wrong protagonist and wrong ending in the summary of Raffi's *The Fool*,
  and several wrong publication years. The articles were originally drafted from memory
  rather than from the works now cited; treat any uncited specific — a number, a plot
  detail, a cause of death — as unverified until someone checks it against the source.

- **Western Armenian is a partial edition by design.** Eight articles are not translated
  yet and are declared in `DECLARED_UNAVAILABLE` in `scripts/validate-content.ts`; the
  site shows an explicit unavailable page for them.
- **Translations need a native-speaker pass.** Items known to be contested are listed at
  the end of [`docs/translation-glossary.md`](docs/translation-glossary.md).
- **The article artwork has no recorded provenance.** All 17 articles render real
  pictures from `public/images/`, captioned as illustrations rather than as historical
  photographs, but nothing records who made them or under what licence. Per-image credit
  has a defined slot: the optional `image: { src, alt, credit }` field on `Article`
  overrides the registry and renders a credit line.
- **Social profile links are omitted entirely** until real profiles exist — see
  `socialLinks` in `src/data/site.ts`.
- **The public domain and contact address are placeholders**, centralised at the top of
  `src/data/site.ts`.
- **No deployment, CI, analytics or Search Console** — excluded by project constraint.
