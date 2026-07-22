# ArmEdu — Project State Report

**Last updated:** 2026-07-22
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
| Testing | Playwright, 77 tests (desktop + mobile projects) |
| Tooling | `tsx` for the content validation script |
| Dev port | 3002 |

---

## 3. Verification status (all run and passing)

```
npm install              → OK
npm run typecheck        → PASS (0 errors)
npm run validate:content → PASS (68 entries across 3 locales)
npm run build            → PASS (79 pages, all statically prerendered)
npm run test:e2e         → PASS (77/77)
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

**Follow-up pass on the six writer articles (22 July 2026).** A re-read of
`locales/*/articles/writers.ts` found seven more items, all fixed in every edition that
carries the article:

- **Sevak entered Yerevan State University in 1940, not 1939** (he left school in 1940 and
  graduated in 1945; the article's own graduation date implies a five-year course).
- *Anush*'s timeline entry still read "**Writes** the first version" under 1892, which the
  audit had already corrected to 1890 in the prose and in `works.ts`. The entry and the
  bullet now say written 1890, printed 1892, revised 1901–1902.
- Isahakyan's twenty-five unbroken years abroad — he returned to Soviet Armenia in 1926,
  stayed four years, and went back to Paris in 1930 before settling in 1936.
- Raffi "began publishing in the 1850s and 1860s", contradicting the article's own 1860
  debut date (the one the audit had corrected).
- Spelling: `Echmiadzin` → `Etchmiadzin` (the archive's form), `Russo Persian` →
  `Russo-Persian`, `Sayat Nova` → `Sayat-Nova` (four places, one already hyphenated).

Note what this implies about the safeguard: the cross-edition check compares the three
editions against *each other*, so an error present in all three — as 1939 was — passes.
It catches divergence, not shared mistakes.

**Western Armenian language pass over the whole `hyw/` locale (22 July 2026).** All nine
files reviewed. Orthography was already sound — zero `և`, zero `-ություն`, zero Eastern
`-յան` — so the errors were lexical and syntactic. Four were systematic:

1. **Negative concord** (11 sites, `pages.ts` / `ui.ts` / `articles/history.ts`). Armenian
   negates the verb as well as the pronoun; the edition had `ոչ մէկ X կը հաւաքէ`, which
   states the opposite of what it means. The `hy` edition had it right (`որևէ … չի
   օգտագործում`), which is what confirmed the intent. Now `որեւէ X չի հաւաքեր`.
2. **`ամենէն` → `ամէնէն`** (18 sites). `articles/history.ts` used the non-classical form
   throughout while every other file in the locale used `ամէնէն`.
3. **`author` field** — `articles/history.ts` said `ArmEdu խմբագրական խումբ`, the other two
   article files `ArmEdu-ի խմբագրական կազմ`. Normalised.
4. **`lifespan` format** — three conventions in one locale (`1875-էն 1957`, `1869-1923`,
   `1869–1923`). Normalised to the en dash.

Also fixed: `ArmEduի` missing its hyphen (2), a missing imperative `՛`, `հետեւցնել`
(deduce) for "trace to", `բարի գալուստ են` calqued from "are welcome", intransitive
`վիճաբանիլ` given a direct object, `Սկսի՛լ` (շեշտ on an infinitive), `դասաւորուած`
(arranged) where the bullet beside it said `ձեւաւորուած` (designed), `լիամեթրաժ` (Russian
calque), `զրուցագիրներու` (writers) for oral reciters, and a bare `Մոսկուա` after a static
verb.

**Left for a native editor**, all judgment calls rather than errors: the `ը`→`ն` sweep
before `եւ` specifically; `Կաթիլ մը մեղր` vs `Մէկ կաթիլ մեղրը` and `Գիրք ճամբու` vs `Գիրք
ճանապարհի` (same work, two titles across files); `պոէմ` vs `քերթուած` used
interchangeably; two dangling-participle calques opening `articles/works.ts`; and
`ոչ-ցանկալի նամակ` for spam.

**Eastern Armenian pass over the whole `hy/` locale (22 July 2026).** All nine files
reviewed. `hy` is the strongest of the three editions: orthography is uniformly reformed,
negative concord is correct almost everywhere, and it independently corroborated eight of
the `hyw` fixes above (`կոլաժ`, `կոչ էր անում`, `Նրան պահեցին Երևանում`, `ստիպված է եղել`,
`Որոշ ժամանակակիցներ`, `աշխարհայացք`, `էպիգրամներ`, `զրույցասաց`). Note `ձգել`: correct in
`hy` (to stretch), which is exactly why it was wrong in `hyw`, where it means *to abandon*.

Systematic fixes:

1. **`Սեւակ` → `Սևակ`** (15 sites). This closes the open item in §12.2. It was not a
   pending decision but a mixed state — `ui.ts` already used the reformed `Սևակ`, and
   `articles/writers.ts` used both. `hyw` correctly keeps `Սեւակ` (classical orthography).
2. **`author` field** — 4 of 17 entries said `ArmEdu խմբագրական խումբ` without the `-ի`.
3. **`lifespan`** — 27 values normalised to the en dash.
4. **Era abbreviation** — `history.ts` used `Ք.ա.`/`Ք.հ.`, the article files `մ.թ.ա.` (48×).

Individual errors: "Մինչ նա" (*while he*) for "before him", contradicting the parallel
"Նրանից հետո" in the next sentence; `երկու մարդիկ` (numerals take the singular); "հայ
արքաները կառավարեցին" where it was Tigran alone; "ևս մեկ տասնամյակ" against the same
article's "ևս տասնմեկ տարի" for 66–55 BC; `երկրորդել` (*to second a motion*) for "split in
two"; "նրա պատրաստած գիտնականները" for the students he trained; `դասավորված` (arranged)
where the adjacent bullet says `Նախագծված`; a doubled "անց … հետո" that also dropped
Sahak's death; a plural verb on a singular subject; one negative-concord slip
(`թողել էր … ոչ մի`); `ոչնչացվել էր` for `ոչնչացվեց`; `մինչև` with a finite verb; and
`հասցնել` (*to deliver*) for tracing a claim to a book.

Also: the `unavailable` UI string claimed the **Armenian** edition is being completed
article by article. `hy` is complete (17/17) and the About page says Western Armenian is
the one in progress — rewritten.

**Left for a decision:** `articles/writers.ts` numbers all 32 of its section headings
("1. Վաղ տարիները…"). No other file in any of the three editions does. Either strip them
or apply the convention across the archive.

### English edition (`locales/en/`) — full pass

All nine files re-read. `en` is factually the soundest of the three and carries no
orthographic burden, so the findings are concentrated in consistency and in three facts
the cross-edition validator could not see because they were wrong in every edition.

*Facts fixed:*

- "for roughly fourteen years **Armenian kings** governed" Antioch — it was Tigran alone,
  and the surrounding clauses are singular. (Corrected in `hy` during the previous pass;
  `en` and `hyw` still carried it.)
- The same Tigran article said "for roughly **two decades** an Armenian king ruled
  Antioch" in §significance against "roughly **fourteen years**" in §expansion, 83–69 BC.
  Wrong in all three editions; fixed in all three.
- Bagratid intro: "ending more than **two centuries** without an Armenian monarchy", and
  the related-figure note "crowned in 885 after two centuries without an Armenian
  monarchy". The monarchy was abolished in 428 — 457 years, and this file's own Avarayr
  article states the 428 date. The "two centuries" figure belongs to Arab *administration*
  (7th c. → 885), which the article states correctly elsewhere. Corrected to four
  centuries in `en` and `hy`.
- `importantDates` gave a flat "83 BC — … founds Tigranocerta" while §tigranocerta says
  the sources do not fix the date. Softened in all three editions.
- Abovyan "the two men reached the summit" of Ararat — Parrot's party was six.
- `Mushkan Nusalavurt` → `Niusalavurt`, matching `hy`.

*Contradiction fixed:* the Sevak article said the village "was renamed in his honour" in
one paragraph and "renamed … after the title of his most famous poem" in another. The
rename to Zangakatun predates the 1959 poem, so both causal claims are dropped in favour
of the undisputed fact that the name and the title are the same word.

*`ui.ts`:* `unavailable.body` in the **English** dictionary told the reader "The Western
Armenian edition is being built article by article" — copied from `hyw` and never
adapted. The same class of bug as the `hy` one above; all three now name their own
edition.

*Consistency (English-only, no counterpart in the Armenian editions):*

- `lifespan` used three conventions at once — `1869-1923` (works, 12), `1875 to 1957`
  (writers + history, 30), `189–160 BC` (3). Normalised to the en dash, matching `hy`
  and `en/writers.ts`. Ten other four-digit year ranges normalised with them.
- Six spelled-out compound numerals were unhyphenated (`fifty four`, `eighty second`,
  `thirty eight`, `forty seven` ×2, `fifty three`), plus `self reliance`, `self defence`,
  `single handedly`, `pre revolutionary`, `full length` and two attributive `first hand`.
- Ten attributive century phrases missing their hyphen (`the eighteenth century
  troubadour`). The five remaining unhyphenated instances are noun uses and correct.
- **Heading case.** Five of the six history articles used Title Case ("The Land and Its
  People"); the Tigran article and all ten writers/works articles used sentence case.
  27 headings normalised to sentence case, the majority convention. Section `id`s — and
  therefore anchors and the table of contents — are untouched.

British spelling is already uniform across the edition; no American forms were found.

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

**Known and deferred** — real, but none of them misleads a reader: ~~no `og:locale` on any
page~~ (fixed in the SEO pass, §13); the 404 has no `lang` and hydrates to a different language than it prerenders; the
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

---

## 13. SEO and structured data — July 2026

A technical SEO pass, built on the same rule the content work follows: **structured data
describes what a reader can already see, it never introduces a claim of its own.**
Everything is derived from the rendered content bundle, per-locale, with no cross-locale
fallback — an Armenian page emits Armenian strings and declares its own `inLanguage`.

**What was added**

- `src/lib/seo.ts` — Schema.org JSON-LD builders: `organizationLd` (a plain
  `Organization`, deliberately not `EducationalOrganization` — ArmEdu publishes, it does
  not teach or award), `websiteLd` (`WebSite` + a `SearchAction` pointing at the edition's
  own `/search`), `articleLd` (`Article` + `citation[]` derived from `sources.ts`),
  `listingLd` (`CollectionPage` + `ItemList` of URLs only), `pageLd` (`WebPage`), a shared
  `BreadcrumbList` built from the same crumb array the visible `<Breadcrumbs>` renders, and
  `socialImage()`. Each builder returns a single `@graph` so a page carries one script.
- `src/components/seo/JsonLd.tsx` — renders the graph in a `<script type="application/ld+json">`,
  escaping `<` to `<` so a string in the content cannot close the tag early. Payload is
  server-built from the bundle, never from user input.
- **JSON-LD wired into** the home page (`WebSite`), the three listings (`CollectionPage`),
  about/contact/privacy (`WebPage`) and translated articles (`Article`). The
  untranslated-article branch of `ArticleRoute` deliberately emits **none** — it is not an
  article, and saying so is the exact claim its `noindex` denies.
- **Per-page Open Graph / Twitter.** Articles use their own artwork via `socialImage()` and
  gained `og:type=article`, `og:published_time`/`og:modified_time`, `og:section`, `authors`
  and a `summary_large_image` twitter card. Listings and static pages carry the site card.
  `og:locale` is now emitted from the root layout (this closes a deferred item in §9).
- `src/lib/i18n.ts` — `getStaticAlternates` and `getContentAlternates` now append
  `x-default`, pointing at the **default** locale (not `/`, which is a redirect). Guarded:
  an article the default edition has not translated has no default to offer, so it claims
  no `x-default` rather than pointing one at a `noindex` page.
- `src/app/sitemap.ts` — static pages and listings gained a derived `lastModified`
  (`withLastModified`): a listing is as fresh as its newest article, the home page as fresh
  as the newest article anywhere; about/contact/privacy get none rather than an invented date.
- **Icons.** `src/app/icon.svg` (favicon, burgundy `#7b2c37` / gold `#b5852f`, from the Logo
  mark). See the apple-icon note below.

**Verification (built HTML in `.next/server/app/**`, plus the e2e suite)**

- Exactly one valid JSON-LD graph per page; graph shapes confirmed:
  home `Organization+WebSite`, listings `Organization+CollectionPage+BreadcrumbList`,
  static `Organization+WebPage+BreadcrumbList`, articles `Organization+Article+BreadcrumbList`.
- `BreadcrumbList` positions are 1-based and contiguous; the final crumb (the current page)
  carries no `item`, as Schema.org expects.
- The `ItemList` on each listing states exactly the number of cards the page renders.
- Articles carry their citations (3/2/2 on the pages checked), image, `datePublished` and
  `dateModified`.
- The untranslated page (`/hyw/history/kingdom-of-urartu`, `/hyw/writers/raffi`) emits **zero**
  JSON-LD, `robots=noindex`, and advertises **no** hreflang alternates at all.
- The hreflang guard holds: `/hy/writers/raffi` (translated in hy + en, not hyw) advertises
  `hy`, `en` and `x-default→hy`, and **no** `hyw`. Fully translated articles advertise all three.

**One defect found and fixed.** `src/app/apple-icon.svg` was **inert** — Next 16's
`apple-icon` file convention accepts only `.png/.jpg/.jpeg` (Apple touch icons do not render
SVG), so the file produced no route and no `apple-touch-icon` link. It was rasterised from
its own mark to a 180×180 `src/app/apple-icon.png` (via the bundled `sharp`; solid burgundy,
no rounded corners, since iOS applies its own mask) and the SVG removed. The build now emits
`/apple-icon.png` and the `apple-touch-icon` link on every page. (`icon.svg` was always fine —
the `icon` convention *does* accept SVG.)

**Tests.** `tests/e2e/seo.spec.ts` (6 tests) locks the invariants the rest of the suite could
not see: at most one JSON-LD block per page and it parses; the home `SearchAction` targets the
right edition; the `ItemList` count matches the visible cards; the breadcrumb trail is
well-formed; the untranslated page carries no graph; and `x-default` is present on every
indexable edition and absent where the default cannot serve the page. The hreflang guards and
`noindex` were already covered in `locale.spec.ts`. Suite is now **77/77**.

**Deliberately not done, left as decisions**

- **Web app manifest (PWA).** Skipped on purpose: it is a PWA concern rather than SEO, and
  without 192/512 PNG icons it would be half-done. The former blocker is now cheap to remove —
  `sharp` is available and just generated the apple icon, so the manifest icons could be
  produced the same way. Still a product decision, not an SEO one.
- **Per-locale RSS/Atom feed.** Considered and **recommended deferred**: the archive is a
  slow-changing encyclopaedia (the sitemap marks articles `changeFrequency: yearly`), so a
  feed has little to carry and few subscribers to serve. Revisit if a regularly-updated
  section (news, blog) is ever added.

**Blocker, not fixable here — the single most important line before anything can be indexed.**
`src/data/site.ts` still uses the placeholder `armedu.example.org` (RFC 2606, cannot collide
with a real host). Every canonical, OG URL, hreflang and sitemap entry therefore points at a
host that does not exist. The structured data, alternates and sitemap are all correct *in
shape*; they simply name the wrong origin until a real domain replaces that one constant.
This follows from the localhost-only project constraint (§11, limitation 8).
