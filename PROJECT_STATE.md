# ArmEdu — Project State Report

**Last updated:** 2026-07-21
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

`validate:content` now also checks: every registered image exists on disk; every article
has a bibliography entry; every citation carries a valid ISBN, DOI, URL or archival
reference; and the three editions state the same numbers as each other.

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

**English (`en`)** — complete, under `/en`. No longer the reference text for accuracy: the
July 2026 audit corrected it more heavily than either Armenian edition, and on two points
(Nalbandian's given name, the Wounds of Armenia interval) the Armenian was right and the
English was wrong.

Slugs are shared and Latin across all editions; filter and category ids are shared. Only
labels and prose are translated.

---

## 7. Imagery

All 17 articles now render real artwork from `public/images/{history,writers,works}/`.
`src/lib/media.ts` maps **slug → file** in one place (two filenames deliberately differ
from their slug, which is why it is an explicit map and not a path convention), and
`src/components/ui/ContentPhoto.tsx` renders `next/image` when a slug has artwork and the
generated `PlaceholderImage` when it does not — so both branches fill the same box and no
layout changed.

Wired into: article hero (21:9, `priority`), history/writer/work cards, homepage compact
cards, the three featured blocks, and search thumbnails. The writer artwork is landscape
with the figure left of centre, so the narrow portrait crops use a shared focal point
(`PORTRAIT_FOCUS`) instead of centring and cutting the face.

The pictures are **illustrations, not historical photographs**, and the site says so: the
article caption uses `imageIllustrationCaption` ("An artistic depiction, not a historical
photograph"), and writer alt text switched from "portrait placeholder" to "illustrated
portrait". Provenance is not recorded anywhere — see limitation 5.

`validate:content` now fails if a registered file is missing from `public/`, or if a
registry key matches no article slug in any edition.

---

## 8. Content audit — July 2026

The whole archive was fact-checked against external sources. It found a correct skeleton
and unreliable details, because the articles were originally drafted from a language
model's memory and then given a bibliography assembled to look plausible.

**Bibliography.** 18 of 48 citations named works that do not exist; 6 more had the wrong
publisher; 12 were correct. The fabrications shared a signature — a prestigious publisher
paired with a title restating the article's own subject — and two cited the same title
under two publishers. Every `href` pointed at a publisher homepage, which always resolved
and so concealed the problem.

*Fixed:* the bibliography moved to `src/data/sources.ts`, keyed by slug and shared by all
three editions. Fabrications removed and replaced with real studies of the same subject;
publishers corrected; author, year and an ISBN/DOI/permalink added to every entry.
`validate:content` now requires an identifier — an invented work cannot supply one.

**Prose.** About twenty confirmed errors, fixed in all three editions. The worst:

- The Plutarch remark at Tigranocerta was **inverted** — it is Tigran's line about the
  Romans, not Lucullus's about the Armenians.
- *The Fool*: Vardan was described as a teacher (that is Salman), Lala as seized (she
  flees and dies of illness), and the ending as open (it closes on Vardan's vision of a
  free Armenia at her grave). The wrong protagonist was in the card excerpt too.
- Wrong years: *Land of Nairi* 1926 not 1922; Raffi's debut 1860 not 1858; *Anush*
  written 1890; Ani abandoned 1735 not "the seventeenth century"; flag readopted 1990.
- "The Eternal Love", listed twice as an Isahakyan work, does not exist.
- Self-contradictions: 38 vs 39 letters; ten vs thirteen years; Sayat-Nova placed in two
  different centuries.

**Framing.** Three contested matters were stated as settled and are now presented as
disputes: the 301 date for the conversion (the article had argued against its own title),
Abovyan's disappearance (the politically charged theories had been replaced by "an
accident"), and Sevak's death.

**The About page** claimed every article was "built from academic histories and standard
reference works". That was false and has been rewritten, with a new "Corrections"
principle stating plainly that the archive has contained mistakes.

**Two safeguards were added so this cannot recur silently.** Every citation must carry an
ISBN, DOI, stable URL or archival reference — an invented work cannot supply one, so the
next fabrication fails when it is written rather than in front of a reader. And the three
editions are now checked to state the same numbers, which catches a correction applied in
one language and forgotten in another.

**What the audit did not settle.** It verified the claims it checked; it did not
re-derive the articles from the works now cited. Any uncited specific — a number, a plot
detail, a cause of death — should still be treated as unverified. See limitation 1.

## 9. Project review — July 2026

Six parallel reviews covered Next.js correctness, accessibility, the data layer, security
and privacy, test coverage, and cross-edition content. The base held up: no secrets, no
XSS surface, correct `params` handling in all 12 routes, one `<h1>` per page with no
skipped levels, every `<nav>` named, and a no-fallback registry that is structurally
unbreakable. Four defects were serious enough to fix immediately.

**Fixed**

1. **The three listing pages shipped no content.** `useSearchParams()` during render bailed
   the Suspense boundary out to client-side rendering, so the prerendered HTML for nine
   pages held a grey placeholder and nothing else — no cards, no links, no filters. The URL
   is now read in an effect (`src/lib/useListingParams.ts`) and the boundaries are gone.
   Verified in the built HTML: 7 `<article>` elements, the search field and all 7 filter
   pills, with no bailout marker.
2. **Western Armenian listings advertised content that edition does not have** — «Վեց
   գրողներ» over three writers, «Աբովեանէն մինչեւ Սեւակ» without Abovyan, and meta
   descriptions naming four absent works. Those four strings had been translated from
   English rather than adjusted for a 9-article edition.
3. **Western Armenian told readers an article was an "8-second read"** — `վայրկեան`
   (second) where the unit is `րոպէ` (minute).
4. **Reading times contradicted themselves on 28 of 51 articles**, because the card
   rendered a stored field and the article header recomputed it. `readingTime` is no longer
   authored: `Article` omits it, and `toArticleSummary` derives it from the prose, so the
   two cannot diverge.

**Also fixed:** the privacy policy made two false statements — that nothing is shared with
third parties (Supabase receives the address and the IP; it is now named), and that the
browser stores interface preferences (the code stores nothing at all).

**Known and deferred** — real, but none of them misleads a reader: no `og:locale` on any
page; the 404 has no `lang` and hydrates to a different language than it prerenders; the
homepage timeline rail is keyboard-unreachable and the focus ring is 1.68:1 on the footer;
`formatDate("")` silently yields 1 January 1900; `hyw` dates render with Eastern month
names because `intlLocale` is `hy-AM`; the newsletter has no real test coverage and the
table accepts unconstrained public writes; `validateAlternates` and `SITEMAP_LOCALE_TAGS`
assert coverage that does not exist. Full detail in the review; these are the backlog.

## 10. Search, filtering, newsletter

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

## 11. Remaining limitations

1. **The prose was drafted from a language model's memory, not from the cited works.**
   The July 2026 audit fixed every error it found, but it checked claims rather than
   rebuilding the articles from sources. Uncited specifics remain unverified, and the
   plot summaries in particular were wrong often enough that the remaining ones deserve a
   reader who knows the texts. This is the project's largest open risk.
2. **Translations need a native-speaker pass.** ~30 specific judgement calls are listed
   at the end of `docs/translation-glossary.md`, split by edition. None are known errors;
   all are used consistently, so each can be changed in one pass.
3. **Western Armenian is a partial edition by design** — 8 of 17 articles pending.
4. **`Պարույր Սեւակ` is spelled with `եւ` in 15 places** in the Armenian edition, where
   reformed orthography would give `Սևակ`. It is a proper name, so the choice is
   editorial rather than mechanical; logged as review item 8 in the glossary.
5. **The article artwork has no recorded provenance or credit.** It is rendered and
   captioned as illustration rather than as documentary photography, which is honest, but
   nothing in the repo records who made each picture or under what licence. If these are
   AI-generated, the captions should say so explicitly — a student looking at
   Թումանյան's page is looking at an invented likeness, and real photographs of him
   exist. Per-image credits have a defined slot already: `image: { src, alt, credit }` on
   `Article` overrides the registry and renders a credit line.
6. **The localized 404 renders outside the locale layout.** Next.js resolves `notFound()`
   to the *root* `app/not-found.tsx`, not to one nested under `[locale]`, so the 404 page
   has no header or footer. It is still correctly localized (the language is recovered
   from the pathname) and styled.
7. **The Western Armenian orthography check is narrow by design.** It flags only the
   unambiguous Eastern markers (`և`, `ություն`). The Eastern participle `-ված` cannot be
   told apart by spelling from correct Western forms like `սորված`, so checking it would
   flag correct Armenian and train editors to ignore the validator.
8. **Placeholder identity** — `armedu.example.org`, centralised in `src/data/site.ts`.
9. **No social profiles**, so those blocks are hidden rather than populated.
10. **No deployment, CI, analytics or Search Console** — excluded by project constraint.
11. **`npm run lint` has been removed** (it was dead — `next lint` no longer exists in
   Next 16). No ESLint was added, per the "avoid unnecessary dependencies" constraint.

---

## 12. Suggested next-phase decisions

1. **Decide who verifies the content, and against what.** This is now the highest-value
   step, ahead of anything technical. The audit corrected what it caught, but the
   articles were never derived from the works they cite. Options range from a subject
   specialist re-reading each article against the bibliography, to narrowing the archive
   to the articles someone can actually vouch for. The platform is honest about its
   uncertainty now; it is not yet authoritative.
2. **Commission a native-speaker review** of both Armenian editions, working from the
   glossary's review list. Separate from the accuracy question above: this one is about
   wording and orthography, and includes the `Սեւակ` / `Սևակ` decision.
3. **Decide whether Western Armenian should reach parity** (8 more articles) or stay a
   curated subset. The unavailable-page mechanism makes either honest.
4. **Decide how the artwork is credited.** State where the 17 illustrations came from and
   whether the caption should name that source (or say "AI-generated" outright). For the
   six writers, decide whether a documented historical photograph should replace the
   illustration.
5. **Content expansion** — how many articles per category constitutes "launchable"?
6. **Newsletter operations** — who reads the Supabase table, and what gets sent, per
   language segment?
