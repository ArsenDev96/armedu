# ArmEdu — Project State Report

**Last updated:** 2026-07-20
**Repo:** `d:\armedu` · branch `main`
**Status:** Armenian-first multilingual MVP, localhost-complete in three editions.

---

## 1. What this project is

An informational, education-oriented website about Armenian history, writers, literary
works and cultural heritage. Target audience: students, teachers, parents, and Armenians
in the diaspora.

The platform is now **Armenian-first**: Eastern Armenian is the default and complete
edition, Western Armenian is a growing second edition, English is third.

Scope is deliberately content-only. No accounts, login, quizzes, comments, payments,
dashboards, admin pages, or CMS. Finished **on localhost only** — no deployment, CI/CD,
analytics or Search Console.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js **16.2.10** (App Router, Turbopack) |
| Language | TypeScript 5.9, strict mode |
| UI | React 19.2 |
| Styling | Tailwind CSS **v4**, tokens in `src/app/globals.css` |
| Content | Local, statically typed TypeScript — **no database, no API, no CMS** |
| Newsletter | Supabase — **email collection only** |
| Testing | Playwright, 71 tests (desktop + mobile projects) |
| Tooling | `tsx` for the content validation script |
| Dev port | 3002 |

---

## 3. Verification status (all run and passing)

```
npm install              → OK
npm run typecheck        → PASS (0 errors)
npm run validate:content → PASS (68 entries across 3 locales)
npm run build            → PASS (79 pages, all statically prerendered)
npm run test:e2e         → PASS (71/71)
```

A separate responsive/accessibility audit ran 112 checks across 4 widths
(375/768/1024/1440) × 28 page states × 3 locales: no horizontal overflow, no duplicate
element ids, no missing alt text, no unlabelled inputs, no heading-level jumps, no dead
links, no unnamed buttons, no unsubstituted `{placeholder}` tokens.

---

## 4. Locale routing

| Locale | Edition | Coverage |
|---|---|---|
| `hy` | Հայերեն (Eastern Armenian) | **Default.** Complete — 17/17 articles |
| `hyw` | Արեւմտահայերէն (Western Armenian) | Complete UI, 9/17 articles |
| `en` | English | Complete — 17/17 articles |

```
/                    → 307 redirect to /hy
/<locale>            homepage
/<locale>/history    /<locale>/history/[slug]
/<locale>/writers    /<locale>/writers/[slug]
/<locale>/works      /<locale>/works/[slug]
/<locale>/search
/<locale>/about  /contact  /privacy
```

`src/app/[locale]/layout.tsx` **is** the root layout — that is what lets `<html lang>`
carry each page's real language. `/` is redirected in `next.config.ts` (no middleware).
`/ru` and any other unsupported segment return 404 via `dynamicParams = false`.

79 pages, every one statically prerendered.

---

## 5. No silent fallback

This was the central architectural requirement and it is enforced in four places:

1. **The registry has nowhere to fall back to.** `getLocaleBundle(locale)` is typed
   `Record<Locale, LocaleContent>`; a missing edition is a compile error, and there is no
   English default to return.
2. **Every content helper takes `locale` as a required first argument.** An optional
   locale is exactly how English leaks onto an Armenian page.
3. **Missing UI translations are compile errors.** Every locale must satisfy the
   `UiDictionary` interface in `src/data/ui.ts`, where all ~180 fields are required.
4. **Untranslated articles render an explicit unavailable page** that links to the
   editions that do exist. Those pages are `noindex`, and the article's `hreflang`
   alternates omit that locale — a crawler is never told a translation exists when it
   does not.

Validation additionally distinguishes a *declared* gap from a *lost* translation: a
Western Armenian article missing without an entry in `DECLARED_UNAVAILABLE` fails the
build.

---

## 6. Content inventory

**Eastern Armenian (`hy`)** — complete: 7 history articles, 6 writer biographies,
4 literary works, plus homepage, categories, timeline, filters, About/Contact/Privacy.

**Western Armenian (`hyw`)** — complete interface and page copy; 9 articles:
- History (4): Mesrop Mashtots, Tigran the Great, Adoption of Christianity, Avarayr
- Writers (3): Tumanyan, Charents, Sevak
- Works (2): Anush, David of Sassoun

**Intentionally not translated into Western Armenian (8)** — these render the localized
unavailable page: Kingdom of Urartu, Bagratid Armenia, First Republic of Armenia, Raffi,
Isahakyan, Abovyan, Wounds of Armenia, The Fool.

**English (`en`)** — unchanged and complete, now under `/en`.

Slugs are shared and Latin across all editions; filter and category ids are shared. Only
labels and prose are translated.

---

## 7. Search, filtering, newsletter

- Search runs in the browser against **the active locale's bundle only**. An Armenian
  query never reaches English text.
- Listing search and filters combine with AND; state lives in the URL
  (`/hy/history?q=Ուրարտու&period=ancient`) via the native History API, so typing costs
  no server request and pages stay static. Back/Forward work.
- `/<locale>/search` groups results as History / Writers / Literary Works, all localized.
- Switching language carries the current path **and query string** across.
- The newsletter writes `{ email, source, locale }` where `locale` is the active route
  locale (`hy` | `hyw` | `en`), enforced by a `check` constraint in the SQL.

---

## 8. Remaining limitations

1. **Translations need a native-speaker pass.** ~30 specific judgement calls are listed
   at the end of `docs/translation-glossary.md`, split by edition. None are known errors;
   all are used consistently, so each can be changed in one pass.
2. **Western Armenian is a partial edition by design** — 8 of 17 articles pending.
3. **Article imagery is still generated placeholder art.** Hero and the three category
   photographs are real and untouched. Licensed photography has a defined slot:
   `image: { src, alt, credit }` on `Article`.
4. **The localized 404 renders outside the locale layout.** Next.js resolves `notFound()`
   to the *root* `app/not-found.tsx`, not to one nested under `[locale]`, so the 404 page
   has no header or footer. It is still correctly localized (the language is recovered
   from the pathname) and styled.
5. **The Western Armenian orthography check is narrow by design.** It flags only the
   unambiguous Eastern markers (`և`, `ություն`). The Eastern participle `-ված` cannot be
   told apart by spelling from correct Western forms like `սորված`, so checking it would
   flag correct Armenian and train editors to ignore the validator.
6. **Placeholder identity** — `armedu.example.org`, centralised in `src/data/site.ts`.
7. **No social profiles**, so those blocks are hidden rather than populated.
8. **No deployment, CI, analytics or Search Console** — excluded by project constraint.
9. **`npm run lint` has been removed** (it was dead — `next lint` no longer exists in
   Next 16). No ESLint was added, per the "avoid unnecessary dependencies" constraint.

---

## 9. Suggested next-phase decisions

1. **Commission a native-speaker review** of both Armenian editions, working from the
   glossary's review list. This is the highest-value next step — the architecture is
   done; only wording judgement remains.
2. **Decide whether Western Armenian should reach parity** (8 more articles) or stay a
   curated subset. The unavailable-page mechanism makes either honest.
3. **Source real imagery** — museums/archives licensing is still the open ask.
4. **Content expansion** — how many articles per category constitutes "launchable"?
5. **Newsletter operations** — who reads the Supabase table, and what gets sent, per
   language segment?
