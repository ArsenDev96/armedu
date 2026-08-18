# Armat — Project State Report

**Last updated:** 2026-08-05
**Repo:** `d:\armedu` · branch `seo`
**Status:** Armenian-first multilingual site, complete in three editions and **live in
production at [armat.site](https://armat.site)** (Vercel). Crawlable and indexable today.

> **Renamed to Armat (July 2026).** The project was formerly **ArmEdu**; the visible brand,
> metadata, structured data, editorial bylines, docs and the domain
> (`armat.site`) now use **Armat**. Occurrences of "ArmEdu" that remain in §8 below are
> **historical audit records** — they quote the literal strings as they were at the time of
> that pass — and are left unchanged on purpose. The `d:\armedu` path above is a local
> filesystem path, outside repository content.

---

## 1. What this project is

An informational, education-oriented website about Armenian history, writers, literary
works and cultural heritage. Target audience: students, teachers, parents, and Armenians
in the diaspora.

The platform is now **Armenian-first**: Eastern Armenian is the default and complete
edition, Western Armenian is a complete second edition, and English is third.

Scope is deliberately content-only. No accounts, login, quizzes, comments, payments,
dashboards, admin pages, or CMS.

**Deployment status (verified 4 August 2026).** The site is **live** at `https://armat.site`,
served by Vercel. This corrects the previous statement in this document that the project was
"finished on localhost only — no deployment, CI/CD or Search Console", which was true when it
was written and had not been revised after the deploy. What is verified from outside:

| Check | Result |
|---|---|
| `https://armat.site/hy/history` | `200`, fully prerendered HTML |
| `https://armat.site/` | `307` → `/hy` (deliberate; see `next.config.ts`) |
| `robots.txt` | `User-Agent: * / Allow: /`, declares the sitemap |
| `sitemap.xml` | served, 30 URLs per edition incl. all 4 categories and 23 articles |
| Canonicals, hreflang (`hy`/`hyw`/`en`/`x-default`), OG, JSON-LD | present on the article pages spot-checked |
| GA4 `G-BQ1HWH334Y` | firing in production |
| Search Console | **unconfirmed — needs checking by the owner.** No `google-site-verification` meta tag is emitted, but that proves nothing: a domain property is verified through DNS and leaves no trace in the HTML. Confirm whether the property already exists before creating one. |

There is still no CI/CD and no automated deploy pipeline in the repo.

The one exception to "no server" is `POST /api/contact`, added July 2026 for the contact
form. It exists because SMTP credentials cannot live in the browser; every *page* is still
statically prerendered.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js **16.2.10** (App Router, Turbopack) |
| Language | TypeScript 5.9, strict mode |
| UI | React 19.2 |
| Styling | Tailwind CSS **v4**, tokens in `src/app/globals.css` |
| Content | Local, statically typed TypeScript — **no CMS** |
| Newsletter | Supabase — **email collection only** |
| Contact form | `POST /api/contact` — SMTP via nodemailer, with a Supabase copy |
| Analytics | Google Analytics 4 (`G-BQ1HWH334Y`) via `next/script` — **production builds only** |
| Testing | Playwright end-to-end suite (desktop + mobile projects; current totals in §3) |
| Tooling | `tsx` for the content validation script |
| Dev port | 3002 |

---

## 3. Verification status (all run and passing)

Current as of 5 August 2026. The figures below had been left at their January values
(68 entries, 79 pages, 93 tests) long after the cuisine category, the Western Armenian
completion and the SEO batch changed all three.

```
npm install              → OK
npm run typecheck        → PASS (0 errors)
npm run validate:content → PASS (129 entries across 3 locales; no pending-artwork note)
npm run build            → PASS (138 pages prerendered; `/api/contact` dynamic)
npm run test:e2e         → PASS (263 passed, 5 skipped, no --workers flag; see §30)
```

Re-run in full at §51 (Gyumri), §52 (Gyumri artwork) and §53 (Visit curation). The figures above had
been left at their August values (105 entries, 111 pages, 173 tests) through the Visit journey, the
map and four more Places. All ten Places are illustrated and `PENDING_ARTWORK` is empty. §53 added
one test and moved no content, so only the test count changed.

`validate:content` now also checks: every registered image exists on disk; every article
has a bibliography entry; every citation carries a valid ISBN, DOI, URL or archival
reference; the three editions state the same numbers as each other; **no filter matches
zero articles**; the two history filter axes are both populated; `chronoOrder` is complete
and gapless per category; the shared taxonomy ids agree across editions; and every
contextual prose link names a phrase that exists and a slug that resolves (§21).

A separate responsive/accessibility audit ran 112 checks across 4 widths
(375/768/1024/1440) × 28 page states × 3 locales: no horizontal overflow, no duplicate
element ids, no missing alt text, no unlabelled inputs, no heading-level jumps, no dead
links, no unnamed buttons, no unsubstituted `{placeholder}` tokens.

---

## 4. Locale routing

| Locale | Edition | Coverage |
|---|---|---|
| `hy` | Հայերեն (Eastern Armenian) | **Default.** Complete — 23/23 articles |
| `hyw` | Արեւմտահայերէն (Western Armenian) | Complete — 23/23 articles (see §15: not natively reviewed) |
| `en` | English | Complete — 23/23 articles |

All three editions are complete. The "9/17" figure this table carried until August 2026
described the state before the Western Armenian completion pass (§15) and before the cuisine
category (§17); `DECLARED_UNAVAILABLE` in `scripts/validate-content.ts` is empty for every
category in every locale, so the untranslated-article page is currently unreachable by any
route. The mechanism is kept because it is still the right home for a future gap.

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

102 pages, every one statically prerendered.

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

**23 articles per edition, in all three editions** — 7 history, 6 writer biographies,
4 literary works, 6 cuisine — plus homepage, four category listings, timeline, filters and
About/Contact/Privacy. 69 article pages in total.

The seven history articles, in chronological order (`chronoOrder`, §21):

| # | Slug | `periodId` | `topicTypeId` |
|---|---|---|---|
| 1 | `kingdom-of-urartu` | `ancient` | `state` |
| 2 | `tigran-the-great` | `ancient` | `person` |
| 3 | `adoption-of-christianity` | `ancient` | `event` |
| 4 | `mesrop-mashtots-armenian-alphabet` | `ancient` | `person` |
| 5 | `battle-of-avarayr` | `marzpanate` | `battle` |
| 6 | `bagratid-armenia` | `medieval` | `state` |
| 7 | `first-republic-of-armenia` | `modern` | `state` |

**Western Armenian (`hyw`)** — complete since July 2026 (§15) and reviewed through multiple
AI-assisted Western Armenian editorial passes; it has **not** been reviewed by a native
Western Armenian editor. That caveat is about quality, not coverage. This section previously
listed 9 translated articles and 8 "intentionally not
translated"; both lists were superseded by §15 and are gone.

**English (`en`)** — complete, under `/en`. No longer the reference text for accuracy: the
July 2026 audit corrected it more heavily than either Armenian edition, and on two points
(Nalbandian's given name, the Wounds of Armenia interval) the Armenian was right and the
English was wrong.

Slugs are shared and Latin across all editions; filter and category ids are shared. Only
labels and prose are translated.

---

## 7. Imagery

All 23 articles now render real artwork from `public/images/{history,writers,works,cuisine}/`.
`src/lib/media.ts` maps **slug → file** in one place (two filenames deliberately differ
from their slug, which is why it is an explicit map and not a path convention), and
`src/components/ui/ContentPhoto.tsx` renders `next/image` when a slug has artwork and the
generated `PlaceholderImage` when it does not — so both branches fill the same box and no
layout changed.

Wired into: article hero (21:9, `priority`), history/writer/work cards, homepage compact
cards, the three featured blocks, and search thumbnails. The writer artwork is landscape
with the figure left of centre, so the narrow portrait crops use a shared focal point
(`PORTRAIT_FOCUS`) instead of centring and cutting the face.

The pictures are **AI-generated illustrations, not historical photographs**, and the site
now says so outright (see §14). The provenance is recorded once in `ARTWORK_PROVENANCE`
(`lib/media.ts`), and the article caption states it in each locale: a place or a work gets
an imagined *illustration* caption, a writer gets an imagined *portrait* one — "not a real
photograph", because photographs of the writers exist. Writer alt text is "illustrated
portrait". What is still not recorded is a per-image licence or tool credit — see limitation 5.

`validate:content` now fails if a registered file is missing from `public/`, or if a
registry key matches no article slug in any edition.

---

## 8. Historical content audit — July 2026

> **Historical record.** Counts and coverage statements in this section describe the
> repository at the time of the audit. §§3–7 are the current source of truth.

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

## 9. Historical project review — July 2026

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

## 10. Search, filtering, newsletter, contact form

- Search runs in the browser against **the active locale's bundle only**. An Armenian
  query never reaches English text.
- Listing search and filters combine with AND; state lives in the URL
  (`/hy/history?q=Ուրարտու&period=ancient`) via the native History API, so typing costs
  no server request and pages stay static. Back/Forward work.
- `/<locale>/search` groups results as History / Writers / Literary Works, all localized.
- Switching language carries the current path **and query string** across.
- The newsletter writes `{ email, source, locale }` where `locale` is the active route
  locale (`hy` | `hyw` | `en`), enforced by a `check` constraint in the SQL.
- **Subscription copy (July 2026)** is framed around *hearing about new content first*, not
  around a periodical: the homepage section carries `home.newsletterHeading` plus a new
  `home.newsletterDescription`, the shared submit button reads "Join Armat"
  (`newsletter.button`), and the inline note is "No spam. Only meaningful updates from
  Armat." (`newsletter.noteInline`). All three editions carry the equivalent wording; the
  Supabase insert, validation and status states are unchanged.

### Contact form (July 2026)

A name / email / message form sits on `/[locale]/contact`, above the "why people write to
us" cards (`ContactForm.tsx`, copy under `ui.contactForm`). It posts to `/api/contact` —
the project's only server route — rather than talking to a service from the browser,
because the SMTP password must never be in the client bundle. `SMTP_*` and `CONTACT_*`
carry no `NEXT_PUBLIC_` prefix, which is what enforces that.

The route does two independent things and needs only one to succeed:

1. **emails** the message over SMTP (nodemailer) to `CONTACT_TO_EMAIL`;
2. **files a copy** in Supabase `contact_messages` (`docs/supabase-contact.sql`), tagged
   with whether the email went out (`emailed`).

The copy is the point: if the mail server is down or files the message as spam, it is
still recoverable from the dashboard. If both fail, the reader is told so — a success
message for an undelivered message is the one unacceptable outcome, matching the
newsletter's "no silent fallback" rule. Abuse controls: a honeypot field, an in-memory
rate limit of 5 submissions per IP per 10 minutes, and length caps enforced both in the
route and as SQL `check` constraints.

The reader's address is set as `Reply-To`, never as the envelope sender — sending as them
would fail SPF and land the whole message in spam.

`contactForm.emailLabel` is deliberately "Your email address", not "Email address": the
newsletter form is on the same page and two identical labels are ambiguous to a screen
reader. For the same reason the newsletter specs now match labels with `exact: true`.

**The privacy policy was updated in all three editions** to say the contact form's name,
address and message are stored and emailed — it previously claimed the newsletter address
was the only personal data collected, which this change made untrue.

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
3. **Western Armenian native-language review remains pending.** Coverage is now 23/23;
   the former 8-of-17 gap is retained here only as audit history (§16).
4. **`Պարույր Սեւակ` is spelled with `եւ` in 15 places** in the Armenian edition, where
   reformed orthography would give `Սևակ`. It is a proper name, so the choice is
   editorial rather than mechanical; logged as review item 8 in the glossary.
5. **The artwork's AI origin is now stated, but a per-image licence/credit still is not.**
   The captions say plainly that the pictures are AI-generated illustrations, not
   photographs, and that a writer's portrait is an invented likeness (§14). What remains
   open: the repo records *that* the images are AI-generated but not *which tool or model*
   produced each one, nor under what licence, and it is still an open decision whether the
   six writers should carry a documented historical photograph instead of an illustration.
   The `ARTWORK_PROVENANCE` record and the per-article `image: { src, alt, credit }` slot
   are where a tool credit or a real, credited photograph would go — a declared `image`
   overrides both the registry file and the AI caption.
6. **The localized 404 renders outside the locale layout.** Next.js resolves `notFound()`
   to the *root* `app/not-found.tsx`, not to one nested under `[locale]`, so the 404 page
   has no header or footer. It is still correctly localized (the language is recovered
   from the pathname) and styled.
7. **The Western Armenian orthography check is narrow by design.** It flags only the
   unambiguous Eastern markers (`և`, `ություն`). The Eastern participle `-ված` cannot be
   told apart by spelling from correct Western forms like `սորված`, so checking it would
   flag correct Armenian and train editors to ignore the validator.
8. **Real identity set** — the domain is **`armat.site`**, centralised in
   `src/data/site.ts`; every canonical, OG, hreflang, sitemap and JSON-LD URL derives from
   it. The site is **live at that origin** as of August 2026, so every one of those URLs now
   resolves; nothing structural blocks indexing.
   **No email address is published anywhere** (July 2026): the `contactEmail` field, the
   `mailto:` button on the contact page and the `email` node in the `Organization`
   structured data were all removed. The contact form is the only route in, and where its
   messages land is a server-side setting (`CONTACT_TO_EMAIL`, falling back to `SMTP_USER`).
9. **No social profiles**, so those blocks are hidden rather than populated.
10. **No CI/CD pipeline, and Search Console status unconfirmed.** The *deployment* half of
   this limitation is gone: the site is live on Vercel at `armat.site` (§1). What remains is
   that there is no automated build/deploy pipeline in the repo, and that nobody has
   confirmed whether a Search Console property exists for the domain — it may already be
   verified through DNS, which leaves no trace in the served HTML. **Confirm before creating
   one.** Google Analytics is live (§20).
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
4. **Decide how the artwork is credited.** *Partly done (§14):* the captions now say
   "AI-generated" outright and distinguish a writer's invented likeness from a scene.
   What is left to decide: whether to record the specific tool/model that produced them
   (the `ARTWORK_PROVENANCE` record is ready for it), and whether the six writers should
   carry a documented historical photograph instead of an illustration.
5. **Content expansion** — how many articles per category constitutes "launchable"?
6. **Newsletter operations** — who reads the Supabase table, and what gets sent, per
   language segment?

---

## 13. Historical SEO and structured-data audit — July 2026

> **Historical record.** The unavailable-route examples below were valid during this pass.
> Today `DECLARED_UNAVAILABLE` is empty, so no unavailable article route is reachable.

A technical SEO pass, built on the same rule the content work follows: **structured data
describes what a reader can already see, it never introduces a claim of its own.**
Everything is derived from the rendered content bundle, per-locale, with no cross-locale
fallback — an Armenian page emits Armenian strings and declares its own `inLanguage`.

**What was added**

- `src/lib/seo.ts` — Schema.org JSON-LD builders: `organizationLd` (a plain
  `Organization`, deliberately not `EducationalOrganization` — Armat publishes, it does
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
- **Icons.** `src/app/icon.png` (favicon, burgundy `#7b2c37` / gold `#b5852f`, from the Logo
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
- A future route declared in `DECLARED_UNAVAILABLE` must emit **zero** JSON-LD,
  `robots=noindex`, and no hreflang alternates. The former examples
  `/hyw/history/kingdom-of-urartu` and `/hyw/writers/raffi` are now published routes; rearm
  this verification with the next deliberately unavailable slug.
- The hreflang guard holds: `/hy/writers/raffi` (translated in hy + en, not hyw) advertises
  `hy`, `en` and `x-default→hy`, and **no** `hyw`. Fully translated articles advertise all three.

**One defect found and fixed.** `src/app/apple-icon.png` was **inert** — Next 16's
`apple-icon` file convention accepts only `.png/.jpg/.jpeg` (Apple touch icons do not render
SVG), so the file produced no route and no `apple-touch-icon` link. It was rasterised from
its own mark to a 180×180 `src/app/apple-icon.png` (via the bundled `sharp`; solid burgundy,
no rounded corners, since iOS applies its own mask) and the SVG removed. The build now emits
`/apple-icon.png` and the `apple-touch-icon` link on every page. (`icon.png` was always fine —
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

**Origin resolved.** `src/data/site.ts` now names the real domain **`armat.site`**, so every
canonical, OG URL, hreflang, sitemap entry and JSON-LD `@id` points at a host that will exist
once the site is deployed. The structured data, alternates and sitemap were always correct in
shape; they now also carry the right origin — and as of August 2026 that origin is live, so
they are being served rather than merely being correct. The one operational item still open
is confirming Search Console (§1).

---

## 14. Historical keywords and transliterations audit — July 2026

Added an authored `keywords` field. The honest framing, recorded here so nobody
re-litigates it later: **`<meta name="keywords">` has been ignored by Google since 2009 and
by Bing too, and adding it changes no ranking.** The field was built anyway because it earns
its place through a different consumer, and it is wired to three at once so it cannot decay
into decoration:

1. **The on-site search haystack** — where it works *today*, and the actual reason it exists.
   A reader who types `sasna tsrer`, `verk hayastani` or `khente` in Latin letters was
   previously matched by nothing at all in the Armenian editions, because no field in the
   content model carried a romanised form. Verified in the built HTML: `/hy/search`'s index
   now contains `sasna tsrer david of sassoun sasuntsi davit`.
2. **`schema.org` `keywords` + `alternateName`** on the `Article` node — the one channel
   search engines *do* read. `alternateName` is the load-bearing half: it tells a knowledge
   graph that `Sasna Tsrer` and `Սասնա ծռեր` denote one entity.
3. **The meta tag** — emitted, costs nothing, expected to do nothing.

**Where it lives**

- `ArticleSummary.keywords?: string[]` in `src/data/types.ts` — optional, per article, and
  documented as *names for this subject*, never topics the article does not cover. 43 articles
  populated (17 hy, 17 en, 9 hyw), each carrying its own transliterations plus the native
  spelling of the other script.
- `ui.site.keywords` and `ui.listing.{history,writers,works}.keywords` — required in the
  `UiDictionary`, so a missing translation is a build error. Note Next **replaces** rather
  than merges `keywords` down the layout tree, so a page that overrides the site-level set
  must be self-sufficient; the listing sets are written that way.
- Wired into `generateMetadata` in the root layout, the three listings and `ArticleRoute`;
  into `articleLd` in `src/lib/seo.ts`; and into both haystack builders in `src/lib/search.ts`.

**Western Armenian transliterations use Western romanisation**, which is the whole point of
having a separate edition: `Dikran the Great`, `Mesrob Mashdots`, `Sasna Dzerer`,
`Barouyr Sevag`, `Yeghishe Tcharents`. The dominant Eastern spelling is listed alongside
where a reader plausibly types either.

**Validation.** `scripts/validate-content.ts` gained `validateKeywordList` plus an
article-level check: non-empty, no blank entries, no case-insensitive duplicates. This was
not optional housekeeping — `flattenKeys` walks objects and strings only, so **arrays are
invisible to every existing dictionary check, including key parity**. Without the explicit
check a keyword list could vanish from an edition silently.

One rule is deliberately *not* enforced: the "untranslated English" leak detector must never
be extended to `keywords`. Latin script in an Armenian edition is the intended content there.

---

## 15. Historical SEO hardening pass — July 2026

The foundation (canonicals, hreflang + `x-default`, per-locale sitemap with
alternates, JSON-LD graphs, `noindex` on search and untranslated pages) predates
this pass and was left as it was. What was added, all derived from content the
reader already sees — the project's structured-data rule:

- **Entity markup.** Writer articles now carry `about: Person` (name, role,
  birth/death years parsed only from a clean `YYYY–YYYY` lifespan — a qualified
  span emits nothing) and work articles `about: CreativeWork` (title, genre,
  and an `author` Person **only** when a writer of exactly that name exists in
  the same edition, so «Անանուն, բանաւոր աւանդութիւն» is never typed as a
  person). History articles get no `about`: the content model records no entity
  for an era, and inventing one is the line `seo.ts` does not cross.
- **`timeRequired`** on every Article node, from the same `estimateReadingTime`
  the visible "min read" figure uses, so the two cannot disagree.
- **Self-contained graphs.** Article/listing/plain pages previously pointed
  `isPartOf` at a `WebSite` `@id` defined only on the home page; each graph now
  carries a compact `WebSite` node, and the home page still carries the full
  one with the search action.
- **Sitemap images** (`<image:loc>`) on every article entry that ships
  artwork — no fallback to the site card, which is branding, not an image of
  the subject.
- **`og:locale:alternate`** on all pages, deduplicated (hy and hyw share
  `hy_AM`, and a page never lists its own locale), and **`article:tag`** from
  the same authored `keywords` list.

**Test consequences of §15 and the contact fix.** Eleven e2e tests went stale:

- Five used `/hyw/history/kingdom-of-urartu` as the untranslated page; with hyw
  complete no URL renders that state. They self-skip via `hasArticle()` with a
  rearm note — point them at the next `DECLARED_UNAVAILABLE` entry and they
  reactivate.
- Three contact-form tests asserted the honeypot under its old `website` name
  (renamed `reference_id` — password managers fill URL-ish fields, off-screen
  or not, and were tripping the bot rejection for real readers).
- Two hyw listing counts (history 4→7, writers 3→6) and one search test whose
  "term absent from hyw" was the Urartu title. Its replacement is the one class
  of term full coverage cannot erode: Eastern orthography (`թագավորություն`),
  which `easternOrthographyMarker` forbids in hyw prose.

Suite after this pass: **88 passed, 5 skipped (documented), 0 failed.** The
"78/78" in §14 predates §15.

**Not done here (deployment, not code):** Search Console / Bing verification
tags, and any decision about an RSS feed or web manifest — none blocks
indexing.

---

## 16. Western Armenian coverage — COMPLETE, pending native review

The declared `hyw` gaps are closed. **All 8 articles are translated; `DECLARED_UNAVAILABLE`
is now empty for every category.** Content count is 81 entries (was 68 at the start of this
work, 70 at the previous checkpoint). `typecheck`, `validate:content` and `build` all pass.

Note that `DECLARED_UNAVAILABLE` is kept in the file with empty arrays rather than deleted:
the mechanism (and the "not translated" page it drives) is still the right home for any
future `hyw` gap, and an empty declaration is the honest statement that there is none.

**⚠️ These translations are machine-produced and have NOT been reviewed by a native Western
Armenian speaker.** They are written as Western Armenian rather than find-and-replaced from
the Eastern edition — classical orthography (`-ութիւն`, `-ուած`, spelled-out `եւ`),
Western verb morphology (`կը գտնուի`, `ցոյց կու տայ`, `կ՚արտասանուի`), Western vocabulary
(`մատենադարան`, `կոթիք`, `սելճուքեան`, `ԵՈՒՆԵՍՔՕ`) and Western proper-noun forms
(`Յովհաննէս`, `Պաղտատ`, `Սուրբ Սոփիա`, `Բագրատունեաց`). **A native-speaker pass is required
before launch.** Note the existing `easternOrthographyMarker` guard only catches `և` and
`ություն` — it will not catch bad Western Armenian, only find-and-replace Eastern Armenian.

**Done (8)**
- history: `kingdom-of-urartu` — Ուրարտուի թագաւորութիւնը
- history: `bagratid-armenia` — Բագրատունեաց Հայաստանը եւ Անի քաղաքը
- history: `first-republic-of-armenia` — Հայաստանի Առաջին Հանրապետութիւնը
- writers: `raffi` — Րաֆֆի (Յակոբ Մելիք-Յակոբեան)
- writers: `avetik-isahakyan` — Աւետիք Իսահակեան
- writers: `khachatur-abovyan` — Խաչատուր Աբովեան
- works: `wounds-of-armenia` — Վէրք Հայաստանի
- works: `the-fool` — Խենթը

**Per-article checklist** (what each one needed):
1. Translate the `Article` into `src/data/locales/hyw/articles/<category>.ts`, keeping the
   canonical `slug`/`href`/`imageSeed` and adding a Western-transliteration `keywords` array.
2. Writers and works additionally need a matching entry in `src/data/locales/hyw/writers.ts`
   (`Writer`) or `hyw/works.ts` (`LiteraryWork`) — the article alone is not enough, and
   `buildSearchIndex` joins them by slug. Done for all six writers and all four works.
3. Remove the slug from `DECLARED_UNAVAILABLE` in `scripts/validate-content.ts`, or validation
   fails with "declared unavailable but a translation exists".
4. Check `relatedSlugs` — the validator rejects a link to an article not published in this
   locale.
5. Re-run `validate:content`, `typecheck`, `build`.

**`relatedSlugs` now match the hy edition exactly.** While `hyw` was partial, seven articles
carried substitute links pointing at whatever was published (`bagratid-armenia` → `tigran-the-great`
in place of `first-republic-of-armenia`, and similar in `tigran-the-great`, `mesrop-mashtots-armenian-alphabet`,
`adoption-of-christianity`, `battle-of-avarayr`, `anush` and `hovhannes-tumanyan`). All of
those have been restored to the hy edition's choices now that every target exists, so there
is no longer any locale-specific related-link divergence to track.

One number to watch when translating: the validator's `numbers` check compares digits
against the hy edition per field, so a Western `19-րդ դարու` where hy wrote `XIX դարի`
fails. Spell the ordinal out (`Տասնիններորդ դարու`) inside `keyFacts`/`importantDates`;
the article-level `period` field is not compared and keeps the edition's `19-րդ դար` form.

---

## 17. Artwork provenance and honest captions — July 2026

The 17 illustrations are AI-generated. That was true before but said nowhere; §11.5 flagged
it as the sharpest honesty gap, because a student on Թումանյան's page sees an *invented
likeness* of a real man for whom real photographs exist. This pass records the fact and
states it to the reader — no image, layout or media-mapping change.

**Centralized provenance.** `ARTWORK_PROVENANCE` in `src/lib/media.ts` records, in one
place beside the file registry, that every shipped image is AI-generated and offered as no
kind of document. `isGeneratedArtwork(article)` is the predicate the caption reads: true
only when an article renders the shared registry artwork rather than a content-declared,
credited `image`. A future real photograph set via `image: { src, alt, credit }` is
therefore *not* labelled AI — the honesty runs both ways.

**Localized captions.** The vague `imageIllustrationCaption` ("An artistic depiction") is
gone, replaced by two required `UiDictionary` fields so all three editions must supply the
wording (a compile error otherwise — the no-silent-fallback rule, §5):

- `imageAiIllustrationCaption` — a place or a work: "AI-generated illustration … an imagined
  scene, not a historical image."
- `imageAiPortraitCaption` — a writer: "AI-generated portrait of {name} … an imagined
  likeness, not a real photograph."

`ArticleLayout` picks the portrait form for `category === "writers"` and the illustration
form otherwise. All six writer pages now carry the portrait caption; the other eleven carry
the illustration one. Verified in the built HTML across all three locales and all three
categories.

**Test.** `article.spec.ts` gained a caption test that reads the expected string from the
dictionary (so wording changes do not break it) and asserts the writer page shows the
portrait form and a history page the illustration form. Suite is now **78/78**.

**Left open (still limitation 5).** The repo records *that* the images are AI-generated but
not *which* tool/model or under what licence, and whether the six writers should instead
carry a documented historical photograph remains a content decision. `ARTWORK_PROVENANCE`
and the per-article `image` slot are where either would go.

**Armenian wording — needs a native editor.** The two new Armenian strings each (hy + hyw)
follow the archive's established orthography and the existing `{name}-ի` genitive pattern,
but like the rest of the translations (§11.2) they are a model's work and should be checked:
in particular the hyphen-before-genitive on a proper name (`Սևակ-ի`) and the choice of
`երևակայված պատկեր` for "imagined likeness".

## 18. Western Armenian language review — July 2026

A conservative editorial pass was run over the entire `hyw` edition (all 9 locale files,
~3,000 lines) against `docs/translation-glossary.md`. ~45 corrections were applied directly
to the files: Eastern Armenian vocabulary under classical spelling (`րոպէ`→`վայրկեան`,
`լանդշաֆթ`→`բնաշխարհ`, `հէնց`→`նոյնինքն`, `արտերկիր`→`արտասահման`, `հասանելի`→`մատչելի`,
`ամենա-`→`ամէնէն`), negative-concord fixes (`ոչինչ չղրկուեցաւ`, `կարելի չէ բացառել`),
Western morphology (`հանդէս կու գան`), English calques ("takes place", "went wrong",
"soon after"), classical orthography (`պոեմ`→`պոէմ`, `ինք զինք`→`ինքզինք`), proper-name
forms (`Վասիլ Ա.`→`Բարսեղ Ա.`, `Պլուտարքոս`→`Պղուտարքոս`, `Բաղդատ`→`Պաղտատ` in hyw),
established titles (`Գիրք ճամբու`→`Գիրք ճանապարհի`, `Մարդն ափի մէջ`→`Մարդը ափի մէջ`,
`Մէկ կաթիլ մեղրը`→glossary form `Կաթիլ մը մեղր`, `Գրոց-բրոց`→`Գրոց ու բրոց`), and byline
unification (`խմբագրական խումբ`→`կազմ`). No facts, dates, numbers, slugs or citations were
changed. A list of flagged-but-unchanged judgement calls is in the review report delivered
in-chat (2026-07-27). This was an AI editorial pass, not the required native-speaker review;
§15's warning still stands, though the most mechanical Eastern-isms are now gone.

---

## 19. Historical source-provenance and hostile-material screen — July 2026

**Standing editorial rule (set by the site owner, 2026-07-31):** no anti-Armenian material
is to be used or cited anywhere in the content or the bibliography. This covers
genocide-denial literature, state-sponsored denialist publications, and polemics whose
purpose is to discredit Armenian history rather than study it. `validate:content` **cannot**
enforce this — a hostile source can carry a valid ISBN and a clean WorldCat record and pass
every existing check — so it stays a human judgement at the point of writing. It matters most
for any future article touching 1915, Nagorno-Karabakh or contested territorial history.

**Bibliography screen — clean.** All 31 unique works in `src/data/sources.ts` (42 citations
across 17 slugs) were reviewed for provenance: all are mainstream Armenian-studies
scholarship, with no denialist or state-sponsored hostile material. Deliberately **retained**
as legitimate scholarship, despite superficially looking like removal candidates: Garsoïan
(conversion dated c. 314 rather than 301) and Thomson's introductions to Agathangelos and
Eḷishē (Eḷishē described as a partisan source). Both are standard critical editions and the
only usable sources for those articles.

**Historical content screen — clean, one wording fix applied.** At that time, all 17 articles
× 3 locales (51 records)
plus listing cards and static pages were read. The genocide is named plainly in every
edition (`The Armenian Genocide` / `Հայոց ցեղասպանությունը` / `Հայոց ցեղասպանութիւնը`); no
euphemism, false symmetry or denialist framing anywhere. Six occurrences of the phrase
"events of 1915" — the standard denialist formula, and the only such vocabulary on the site —
were replaced with a direct naming of the genocide, in `{en,hy,hyw}/writers.ts` (Sevak
listing card) and `{en,hy,hyw}/articles/writers.ts` (Sevak article body). The now-redundant
second mention in the same body paragraph was shortened to "four decades later". No facts,
dates, slugs or citations changed. `typecheck` and `validate:content` both pass.

**Also deliberately retained** as marks of a credible educational site rather than a
promotional one: the even-handed treatment of Vasak of Syunik (both positions given, framed
as a genuine dilemma), the 301-vs-314 and 287-vs-298 dating debates, the Movses Khorenatsi
fifth-vs-eighth-century dispute, the assessment of Tigran's empire as administratively
shallow, the questioned 100,000 population figure for Ani, and the note that Yeghishe's
Avarayr troop numbers are almost certainly inflated.

---

## 20. Armenian Cuisine — a fourth category (July 2026)

A fourth content category, **`cuisine`**, was added alongside history, writers and works:
`/{hy,hyw,en}/cuisine` and `/<locale>/cuisine/[slug]`, with six dishes — **lavash, dolma,
khorovats, harissa, gata, ghapama** — published in all three editions. **100 pages**
prerendered (was 79); `validate:content` now reports **99 entries** (was 68).

### Architecture — extended, not forked

The category rides the existing machinery. `CategoryId` gained a fourth member, so the
sitemap, `hreflang`/`x-default`, coverage checking, keyword validation and
`DECLARED_UNAVAILABLE` picked it up with no new code. Three things were genuinely new:

1. **`dishType` / `dishTypeId` on `ArticleSummary`** — deliberately *not* folded into
   `period`/`periodId`. Those name an era; a dish has none, and filing "Bread" under a field
   called `period` would make the model state something untrue to save two lines. The two
   pairs are mutually exclusive and the validator enforces it.
2. **`CuisineDetails` on `Article`** — the at-a-glance panel (ingredients, preparation,
   occasions, regions, serving). It is *not* a recipe: `preparation` is one paragraph, and
   the JSON-LD deliberately emits **no `Recipe` node**, because `Recipe` promises
   `recipeInstructions` a reader can cook from and these pages decline to be that.
3. **`cuisineTypes: Filter[]`** per locale — `bread`, `main`, `meat`, `ceremonial`,
   `dessert`. No region or century filter: both would have to assign a single origin to
   dishes whose origins are shared or unsettled.

`HistoryListingItem`/`toHistoryListingItems` were renamed to `ArticleListingItem`/
`toArticleListingItems`, since one projection now serves two article-backed listings.
`relatedFigures` is rendered only when non-empty (and drops out of the table of contents
with it) — a dish has no biography attached to it, and an empty heading reads as a section
the archive failed to fill.

### Editorial stance

Nothing states that a dish is exclusively Armenian, because for these six no source says
that. The bibliography records this on its face: **dolma's UNESCO file was submitted by
Azerbaijan** (2017, no. 01188) and is cited as such, and **lavash carries two inscriptions**
— Armenia's (2014, no. 00985) and a five-state one (2016, no. 01181). Ghapama is dated
from the other end: every *Cucurbita* squash is a New World plant, so the dish in its
present form cannot be ancient, and the article says so rather than repeating the claim
that it is.

Sources are weighted to cultural-heritage bodies and academic publishers (UNESCO,
Smithsonian Folklife Festival, Brill, I.B. Tauris, Indiana UP, Reaktion, OUP, a
*Food, Culture & Society* article by Susan Paul Pattie on madagh); the two cookbooks
(Uvezian, Petrosian & Underwood) are cited only for preparation practice and folklore,
never for a date or an origin.

### Images

All six dishes ship artwork in `public/images/cuisine/`, registered in `IMAGES`
(`src/lib/media.ts`) like every other slug, so they render in the article hero, the listing
cards, the search thumbnails and the sitemap's image entries. They inherit
`ARTWORK_PROVENANCE` — AI-generated editorial illustrations, and the hero caption says so
outright in each edition (§14), taking the *illustration* form rather than the *portrait*
one, since a dish is a scene and not a likeness of a real person.

One file arrived as `lavalsh.webp` and was **renamed** to match its slug rather than mapped
around: the other five match exactly, and a typo in the registry would read as a deliberate
exception the next time someone edits that file. The two genuine exceptions
(`first-republic-armenia`, `mesrop-mashtots`) remain the only ones.

`src/lib/media.ts` also gained `PENDING_ARTWORK`, now empty. It is kept rather than deleted
because it ends the state it was written for — a slug silently rendering the placeholder
with nothing in the repo saying whether that is a decision or an oversight. The validator
checks its entries name real articles and are not already in `IMAGES`.

**Still outstanding:** there is no `category-cuisine.png`, so the homepage category card is
the one cuisine surface still rendering the generated `PlaceholderImage` — next to three
photographed cards. The other three sections use purpose-made banner images at a different
crop, so an article illustration was not substituted; the `image` field on the cuisine
`Category` is the one line to fill when a banner exists.

### Two layout regressions the fourth section caused, and their fixes

**The header nav stopped fitting.** Six sections in Armenian need 767px of horizontal nav,
and the row only offers `viewport − 449` once the logo and the right-hand controls have
taken their share — so below 1280px every label broke mid-phrase ("Հայոց / պատմություն").
The nav now appears at **`xl` rather than `lg`**, with `gap-5` (`2xl:gap-6`) and
`whitespace-nowrap` on the labels; 1024–1280 gets the drawer instead. That is a real
trade — a menu tap for a band of desktop widths — taken because a header that looks broken
is worse. `tests/e2e/header.spec.ts` asserts the fit at 1280/1440/1600 in all three
editions and the drawer takeover at 1024/1152, so the next long label fails a test rather
than a layout.

**The cuisine category card had no photograph**, and the generated `PlaceholderImage`
fallback was the wrong thing to show: at the 35% opacity the banner fades its photograph to,
it renders as an almost-white smear beside three photographed cards and reads as an image
that failed to load. `CategoryCard` now skips the photo layer entirely when a section has no
image and carries a **wash in that section's own medallion colour** over the same geometry —
visibly a design rather than an absence. `MEDALLIONS` gained a `wash` per section.

The cuisine banner (`/category-armmeal.webp`) arrived shortly afterwards and is now
registered on the category in all three editions, so all four cards carry photography and
no section shows the wash today. The wash path is kept for the next section that ships
ahead of its artwork. The file is named for the meal it depicts rather than for the
section id, unlike the other three banners; it was left as delivered.

### Content review pass

A full read of the eighteen articles against their cited sources, after the section
shipped. Every bibliography identifier resolved, and the UNESCO element numbers, the
Smithsonian ghapama account, the Pattie *madagh* article and the Armenian National
Institute memorial record all support what is written about them. Three claims did not
survive and were corrected in all three editions:

- **"seven states"** in the lavash significance block. Armenia's 2014 inscription plus the
  2016 five-country one is **six**, not seven.
- **The Musaler memorial** was described as built by descendants of the Musa Dagh villagers
  and attributed to the Armenian National Institute. ANI's record says something narrower —
  architects Rafael Israelian and Ara Harutyunyan, opened 1976, above a village that took
  the mountain's name in 1972 — so the paragraph now reports that and drops the descendants
  claim, which no cited source carried.
- **The ghapama song** was said to have been *recorded* by System of a Down. The cited
  Smithsonian page names the band in connection with the dish but does not say that; the
  sentence now reports what the source actually does. The documented populariser of
  "Hey Jan Ghapama" is Harout Pamboukjian, which no citable source in the bibliography
  covers — see §"Still needing a human".

Language defects found and fixed are listed in `docs/translation-glossary.md`; the
substantive one was seven Western Armenian clauses missing their negative verb.

### Verification

`typecheck` and `validate:content` pass; `build` prerenders 100 pages; the Playwright suite
is **131 tests, 126 passing and 5 self-skipping** (the pre-existing untranslated-page tests,
which have no URL to run against while every edition is complete), stable across three
consecutive full runs.

**36 tests added, none removed or weakened:** `tests/e2e/cuisine.spec.ts` (28),
`tests/e2e/header.spec.ts` (6), two mobile tests, and a cuisine leg on the per-locale
navigation loop. One existing test was **split, not softened**: the "former brand" guard ran
twenty-one cold dev-server compilations inside a single 30s budget and began timing out once
the suite grew; it is now one test per edition with the same paths and the same two
assertions each, plus `/cuisine/lavash` added to its path list.

## 21. Eastern Armenian edition review — August 2026

A full read of `src/data/locales/hy/` — 3,844 lines across the six locale files and the four
article files — checking the Armenian itself and the factual claims behind it.

**Facts held up.** Dates, regnal years, lifespans and publication years were checked one by
one across the six history articles, six writer biographies and four literary-work articles.
The internally-derived numbers are consistent (Avarayr 451 → Nvarsak 484 is stated as
"thirty-three years"; Tigran born c. 140 BC and dead at c. 85; Abovyan's manuscript waiting
"seventeen years"), and the hedges are in the right places — the Erebuni/Yerevan etymology,
the 301-vs-314 conversion date, the Movses Khorenatsi dating dispute, the Sevak car crash,
and Ani's "hundred thousand" population are all presented as contested rather than settled.
Three claims that looked risky were verified against sources rather than left: Tigranian's
*Anush* did enter the Yerevan Opera in **1935** (the theatre itself opened in 1933 with
Spendiarian's *Almast*), the **1931** silent film and the **1983** film-opera both exist.

**Three things disagreed with themselves.** All are the same failure — the same fact typed
in two files:

- `first-republic-of-armenia` carried the eyebrow «Ժամանակակից Հայաստան» while the filter
  chip and the footer both said «Նոր ժամանակների Հայաստան». A reader clicking the chip
  landed on a card that appeared to name a different era, and «Ժամանակակից» also collided
  with the literary period of the same name.
- Isahakyan's 1897 collection was «Երգեր **և** վերքեր» on the listing card and
  «Երգեր **ու** վերքեր» — the published title — five times in the article.
- Sevak's 1963 collection was «Մարդ**ը** ափի մեջ» on the card and «Մարդ**ն** ափի մեջ» in
  the article. The card was right; the published title is «Մարդը ափի մեջ».

**Three Armenian-language corrections.** «ուսումն սկսելիս» → «ուսումը սկսելիս» (the
definite article takes -ը before a consonant); «Ժամանակակից հռոմեացի հեղինակներ», a literal
rendering of "Contemporary Roman writers" that in Armenian reads as *present-day* Roman
writers, → «Այդ ժամանակի…»; and «իմպրովիզացվեր», wrong register for a school audience, →
«տեղում, բանավոր թարգմանվեր».

Punctuation and script were clean: no Latin `?`/`!` in Armenian prose, no mixed-script words,
no stray Latin full stops outside the «թ.»/«թթ.» abbreviations.

### The chip-and-card rule, now enforced

`validate:content` gained a check that a card's period/dish-type label must equal the filter
label carrying the same id, for the three listings that actually filter on that vocabulary —
history articles, cuisine articles, writers. Works articles are deliberately exempt and the
code says why: the works listing filters on genre, so their `period` is free prose
("1890-ական թվականներ") that says more than a chip can.

It caught **seven more instances in the two editions that were not under review**:

- `hyw` named the battles filter «Ճակատամարտ**ներ**» against the article's «Ճակատամարտ**եր**».
  The article was right — a compound whose final component is a monosyllabic word («մարտ»)
  keeps the `-եր` plural — so the **chip** was fixed, not the prose.
- `en` had six writer cards in title case ("19th Century", "Soviet Era") against
  sentence-case chips. The chips were brought to title case, matching both the cards and the
  `historyPeriods` list beside them.

`typecheck`, `validate:content` (99 entries), `build` (102 pages) and the Playwright suite
(126 passed, 5 skipped) all pass. No test was changed to accommodate any of this.

---

## 22. Google Analytics — August 2026

The one deliberate exception to the "no analytics" constraint, added at the user's
request. GA4 property `G-BQ1HWH334Y`.

`src/components/analytics/GoogleAnalytics.tsx` renders the two halves of the gtag
snippet through `next/script` and is mounted at the end of `<body>` in the locale
layout, so it is present on all 102 pages of all three editions. No dependency was
added — `@next/third-parties` would have installed a package to wrap `next/script`,
which is already in the framework.

Three decisions worth keeping:

- **The measurement ID is a constant in the component, not an env variable.** It is
  site identity like the domain in `src/data/site.ts`, not a secret, and it is baked
  into the client bundle either way. `.env.example` stays untouched.
- **Nothing renders outside a production build** (`NODE_ENV !== "production"` returns
  null). `npm run dev` and the Playwright suite therefore send no hits and the property
  stays clean. To check the tag by hand, `npm run build && npm run start` — `next start`
  sets NODE_ENV=production, so the tag loads. Verified: the prerendered
  `.next/server/app/hy.html` contains both the loader `src` and the `gtag-init` config.
- **`afterInteractive`, not `beforeInteractive` or `lazyOnload`.** The first would delay
  hydration behind an analytics script; the last drops the hits of readers who leave
  quickly, who are exactly the readers analytics exists to count. The inline half must
  also be a `<Script>` rather than a raw `<script>` — React does not execute inline
  scripts it renders on the client, so a plain tag would work on first load and silently
  stop after any client-side navigation.

### The privacy policy had to change with it

The policy said, in all three editions, that the site "runs no analytics and no tracking
of any kind" and "sets no cookies". Shipping GA would have made both statements false, so
the **Analytics** and **Cookies** sections were rewritten in `hy`, `hyw` and `en`: what GA
records (pages, language edition, approximate location from IP, device and browser), that
it does not identify the reader and is never joined to a newsletter address or contact
message, that GA sets its own cookies carrying a random identifier, and that blocking
cookies or enabling Do Not Track disables it with no loss of function. `lastUpdated` moved
to 3 August 2026 in all three.

The **Supabase** disclosure inside those sections was preserved word for word — it was
already correct and is unrelated to this change.

---

## 23. SEO batch 1 — History taxonomy, navigation and content fields (August 2026)

The first controlled batch out of a full SEO and content audit of the History section. The
audit compared all seven Armenian-language history articles against what actually ranks for
the same topics; the findings that became code are below. Deliberately **not** in this batch:
new articles, period hub pages, maps, Wikidata entities, named human authorship, FAQ content
or FAQ schema, and any hreflang change.

Three corrections to the audit's own recommendations were applied before implementing, and
are recorded because they would otherwise be re-proposed:

- **FAQ structured data was dropped from the plan entirely.** Google stopped showing FAQ rich
  results on 7 May 2026. FAQ *content* may still be worth writing for readers; `FAQPage`
  markup is not, and no FAQ field was added.
- **The Search Console hreflang / International Targeting report is deprecated**, so it cannot
  be used to answer the `hyw` question below.
- **Competitor word counts are not targets.** Length is not a ranking factor, and the two
  articles revised here gained sections because a specific intent was unserved
  («պատճառները», the four names of Urartu, the fall), not to reach a number.

### The taxonomy defect

`periodId` carried two taxonomies at once — four eras (`ancient`, `kingdoms`, `medieval`,
`modern`) and two content types (`people`, `battles`) — on a field that holds one value. Two
concrete consequences:

- **«Կարևոր դեմքեր» (`people`) matched no article at all.** The pill shipped on
  `/hy/history`, `/hyw/history` and `/en/history` and always rendered the empty-results page
  on a listing with seven articles behind it.
- **The Battle of Avarayr was invisible chronologically.** Filed under `battles`, a 451 event
  appeared under no century, and Tigran the Great sat under `kingdoms` rather than under
  «Հին Հայաստան».

Now two independent axes, both in the URL and combining with search as AND:

- `?period=` — `ancient` (4) · `marzpanate` (1) · `medieval` (1) · `modern` (1)
- `?type=` — `state` (3) · `person` (2) · `event` (1) · `battle` (1)

`kingdoms` was removed too: it named no era. The era ids that survive keep their old values,
so `/hy/history?period=ancient` and `?period=medieval` still resolve exactly as before.

**Only the type *id* is authored on an article.** Its label lives once in
`historyTopicTypes`, unlike `period`/`periodId` and `dishType`/`dishTypeId`, which each keep
a second copy of the label on every article and each need a validator rule to catch the drift.

### The rule that was missing, and what it found

`validateFilterCoverage` fails the build when any filter matches zero content, across every
listing. Nothing in the type system could catch the old `people` pill — it was a valid string
in a valid list — so it had to be counted.

It immediately found **two more dead filters that the audit had not spotted**, both in
`literaryPeriods` on the writers listing:

- **`contemporary` («Ժամանակակից») matched nothing in any edition** and was removed from all
  three.
- `medieval` («Միջնադար») matched no *writer* but does match the `david-of-sassoun` works
  article. `literaryPeriods` is one vocabulary serving two content types, so the check counts
  both and the filter stays.

### Navigation

- **Previous/next is chronological.** A new `chronoOrder` sorts a copy of the category, so the
  listing, the featured fallback and the `ItemList` in the listing's structured data keep the
  authored order. Before this, «Տիգրան Մեծ» offered «Ուրարտուի թագավորությունը» as its *next*
  article. A category opts in as a whole: the validator requires `chronoOrder` on all of a
  category's articles or none, unique and gapless.
- **`RelatedArticles` fillers are confined to the article's own category.** An authored
  `relatedSlugs` entry may still cross categories deliberately; a filler has made no editorial
  judgement, and one deleted slug was all it took for a history article to recommend a recipe.
  If the same-category pool cannot reach three, fewer than three are shown.
- **`first-republic-of-armenia` linked out of its own section**, two of three related slugs
  being writer biographies. Now `bagratid-armenia`, `battle-of-avarayr`, `yeghishe-charents` —
  Charents stays and earns it as the poet of that generation. Fixed in all three editions, and
  `relatedSlugs` is now checked for cross-edition agreement, because it is navigation rather
  than prose.

### Three optional article fields

| Field | Falls back to | Why it exists |
|---|---|---|
| `seoTitle?` | `title` | `title` is the H1 and stays what the reader sees. A `<title>` is read in a results row with no page around it: «Քրիստոնեության ընդունումը» needs to say *in Armenia* and *301* there. **Not** used for `og:title` or the JSON-LD `headline` — a share card and a knowledge graph want the clean human headline. |
| `metaDescription?` | `excerpt` | `excerpt` is authored for a card beside an image and several run past 170 characters, which a results page truncates mid-clause. |
| `summary?` | — | A visible `<section id="summary">` above the key facts, first in the table of contents. Not a second intro: the intro sets a scene, the summary states the outcome. The commonest way these subjects are searched is a request for exactly this («համառոտ»), and the archive answered it only by making the reader read the whole article. |

The validator rejects an override that merely restates what it overrides, and bounds each:
`seoTitle` at most 52 characters (60 minus the `" | Armat"` the layout appends),
`metaDescription` 70–165, `summary` 40–140 words.

### Contextual prose links

Prose stays plain typed strings; there is no markup language in the content model and this
does not introduce one. A section declares, out of band, that one phrase in its own paragraphs
links to one article (`ArticleSection.links`), and `SectionProse` links the **first**
occurrence and nothing else.

Rejected alternatives, so they are not re-proposed: markup inside the strings would make every
translator hand-edit HTML; a site-wide keyword map would link the same word on every page it
appears, including pages where the link is wrong and including inside quotations.

`validate:content` enforces every precondition the renderer relies on — the phrase must occur
in *that* section, the slug must resolve **in that same edition**, never to the article's own
slug, phrases of at least 6 characters (a substring match cannot tell an Armenian word from a
word fragment, so the safeguard is the length of what may be declared), at most 3 links per
section, at most 6 per article, and no target linked from two sections. **A link to an article
that has not been written yet fails the build rather than shipping as a 404.**

Backfilled: three links, all in the two revised articles.

| From | Phrase | To |
|---|---|---|
| `adoption-of-christianity` § building-a-church | Մեսրոպ Մաշտոցի | `mesrop-mashtots-armenian-alphabet` |
| `adoption-of-christianity` § distinct-tradition | Ավարայրում | `battle-of-avarayr` |
| `kingdom-of-urartu` § fall | Տիգրան Մեծի | `tigran-the-great` |

Urartu got one link and not five for a reason worth recording: every other subject its prose
names — Erebuni, Menua, Argishti I, Teishebaini, Musasir, Movses Khorenatsi — is a page the
archive has not written. The constraint is the mechanism working, and it names the next
articles to write.

### Historical first phase: the two revised articles (`hy` only)

**`adoption-of-christianity`.** H1 is now «Քրիստոնեության ընդունումը Հայաստանում (301 թ.)» —
the old «Քրիստոնեության ընդունումը» could have been any country's conversion. Gained a
`summary`, a `seoTitle`, a `metaDescription`, and a new **«Ընդունման պատճառները»** section:
external (Sasanian Zoroastrianism as state ideology from 224), internal (communities already
present via the Syrian and Cappadocian trade routes), economic (temple estates and their
revenues transferring to the new church), and an explicit fourth paragraph saying the sources
do **not** let these be weighted against each other or separated from personal conviction —
Agathangelos writes a healing miracle, and the political reading is a later inference. Every
element restates something the article already stated across other sections and is covered by
the existing bibliography (Agathangelos/Thomson; Garsoïan). No new factual claim was added.
The 301-versus-314 discussion is untouched.

**`kingdom-of-urartu`.** H1 is now «Ուրարտու՝ Վանի թագավորությունը». The Armenian
historiographic name for this state — the title Armenian Wikipedia itself uses — appeared
nowhere on the page except an invisible `keywords` array, while «Արարատյան» occurred only
inside «Արարատյան **դաշտ**», the plain and not the kingdom. Gained a `summary`, a `seoTitle`,
a `metaDescription`, and two sections:

- **«Ուրարտու, Բիայնիլի, Վան, Արարատ՝ մեկ պետության չորս անուն»** — the Assyrian exonym, the
  kings' own Biainili, the Nairi designation already quoted in the article from Sarduri I's
  inscription, and the biblical Ararat form. It closes by stating plainly that Urartian is
  Hurrian-related and **not** an ancestor of Armenian, and that the Armenian names are
  geographic and historiographic rather than linguistic — the commonest error on this topic.
  No claim about ethnic or linguistic continuity was strengthened.
- **«Թագավորության անկումը»** — previously one clause at the tail of another paragraph, which
  is now trimmed. Says outright that this is the worst-documented part of the kingdom's
  history: no Urartian text records the end, and Assyria — the source that observed Urartu
  from outside — itself fell in 612. Names the pressures usually cited (Median expansion,
  nomadic incursions), the burnt destruction layer at Teishebaini/Karmir Blur, the competing
  "collapse of a centralised fortress-and-redistribution system" reading, and that the
  evidence does not settle conquest versus collapse.

This was the initial `hy`-only phase. The `hyw` and `en` adaptations of both articles are now
complete, including their metadata, summaries, added sections and contextual links.
`AWAITING_TRANSLATION` was emptied after that adaptation and Stage 1 closed. The same mechanism
is now used for SEO batch 2 (§24), while shared ids, `chronoOrder`, `relatedSlugs` and filter
vocabularies continue to agree across all three editions.

### Still open

- **`hreflang="hyw"` needs its own investigation.** Google's hreflang documentation specifies
  ISO 639-1 language codes and `hyw` is ISO 639-3, so the annotation may be ignored — which
  would leave `/hy` and `/hyw` as two closely related Armenian editions with no declared
  relationship. **Nothing was changed:** `<html lang="hyw">` is valid BCP 47 and stays,
  `/hyw` is not deindexed, and `hyw` was not replaced with `hy`. The deprecated Search Console
  International Targeting report cannot answer this, so it needs a different method.
- Deferred from the audit's priority list on purpose, as future improvements that must not
  delay title, content, internal-linking, taxonomy and indexing work: `og:site_name` (missing
  site-wide, because Next replaces rather than merges `openGraph`), schema `about`/`sameAs`
  entities on history articles, named human authorship, and splitting `datePublished` from
  `dateModified`.

---

## 24. SEO batch 2 — complete in all editions (August 2026)

Eastern Armenian drafts were revised for `bagratid-armenia`,
`first-republic-of-armenia` and `battle-of-avarayr`. Each now has a dedicated SEO title,
meta description and 80–120-word summary. The work adds only demonstrated educational intent:
Ani's role as capital and the kingdom's decline; the May battles, Sardarapat and the First
Republic's fall; and Avarayr's causes, consequences and strengthened Nvarsak treatment.

The approved changes are adapted into `hyw` and `en`, and `AWAITING_TRANSLATION` is empty again.
All three editions share the same dates, section ids, link targets, chronology and related
articles. URLs, canonicals, hreflang behavior, two-axis History taxonomy and navigation are
unchanged.

The Avarayr troop figures remain a human-review item. They are attributed to Eghishe and
described as uncertain rather than established fact, in line with the existing Thomson
bibliography entry.

---

## 25. Navigation and footer pass — August 2026

A review of the header and footer found thirteen issues. All are fixed; the notable ones
are recorded here because several are decisions, not repairs.

### The nav bar came back to `lg`

The horizontal nav had been held at `xl` (1280px) on purpose: measured in Armenian, six
items at their full names ran **808px** against the **767px** the row had left at 1280px,
so every label broke mid-phrase («Հայոց / պատմություն»). The fix at the time was to give
1024–1280px to the drawer — which handed every ordinary laptop a hamburger to avoid a
wrapping label.

The width came out of the labels instead:

- **"Home" left the bar.** The logo beside it is already a link home. It stays in the
  drawer, where the drawer is the whole map of the site and there is no logo to lean on.
- **The four sections use bare nouns in the bar** — `nav.historyShort` etc. — because the
  logo directly overhead already says whose history this is. The qualified names
  («Հայոց պատմություն») are unchanged and still used by breadcrumbs, the drawer and the
  footer, where they stand alone.
- **The logo tagline hides between `lg` and `xl`**, via `Logo`'s new `placement` prop. It
  was already hidden on phones; that band is where the row is tightest.

Measured after: 520px of nav in a row with **175px to spare at 1024px** in the widest
edition. `header.spec.ts` now asserts one-line fit at 1024/1152/1280/1440 across all three
editions and a five-item bar, so putting "Home" back or lengthening a label fails a test.

### The drawer is a real overlay

It was an in-flow block with every section pre-expanded — a flat ~35-link scroll — that
let the page scroll behind it and never returned focus. It now locks the body (with
scrollbar compensation), scrolls itself, traps Tab, hands focus back to the toggle on
Escape, and opens with its sections **collapsed**.

**The scrim needed care.** `backdrop-blur` on the header sets a `backdrop-filter`, which
makes the header a containing block for `position: fixed` descendants — so a `fixed
inset-0` scrim inside it resolves to the header's own 64px strip and dims nothing. It is
`absolute top-full h-dvh` instead, and a test measures the covered area rather than
trusting the declaration.

### Other header fixes

- Escape and outside-clicks now reach the **search panel**, which was previously
  dismissable only by finding its button again; focus returns to that button.
- A dropdown opened by **clicking** its chevron no longer closes when the pointer wanders
  off; hover-opened ones close after a 140ms grace period, which stops the menu shutting
  mid-reach when the cursor cuts the corner.
- The **language pill is visible at every width** (was `sm` and up). On a trilingual site
  it is the one control worth the space.
- Submenus carry `aria-controls`/`id`.

### Footer

- **Three bands** — masthead + signup, four link columns, small print — replacing a
  six-column row that left each column ~160px. Armenian does not fit in 160px:
  «Նոր ժամանակների Հայաստան» broke across three lines. Columns are now ~280px and no
  label wraps past two lines at 1024px.
- **Every href appears exactly once.** `/works` had sat in both Explore and Resources and
  `/writers` three times — 27 links covering 23 destinations. `/sitemap.xml` is gone: raw
  XML behind a human label, and crawlers find it via `robots.txt` regardless.
- **The newsletter is in the footer**, where the reader who has just finished an article
  is finally offered it. `NewsletterForm` gained a `tone` prop; `source: "footer"`
  already existed in `NewsletterSource`.
- **Language links preserve the reader's page.** They always went to `/{code}` while the
  identical header control kept the path. Both now share one client component,
  `LanguageSwitcher`, in three layouts. Its `useSearchParams` boundary falls back to the
  full switcher minus the query string, so every locale link is still in the prerendered
  HTML with the right path — all routes remain SSG.
- **The copyright year is computed**, not the literal `2026` that would have gone quietly
  wrong on all thirteen routes in January.

Footer group headings stay `<h2>`: each `<nav>` already carries the group title as its
accessible name, and the outline cost is not worth a regression.

---

## 26. Cuisine listing search — occasions were missing from the haystack (August 2026)

A cuisine article's at-a-glance panel answers three questions — what is in it, where it is
made, when it is eaten — and the cuisine listing's search box offers all three: «Որոնել
ուտեստներ, բաղադրիչներ և առիթներ…», "Search dishes, ingredients and occasions…".

Only two of the three were searchable. `toArticleListingItems` in `src/lib/search.ts` fed
`cuisine.ingredients` and `cuisine.regions` into its haystack and omitted
`cuisine.occasions`, while `buildSearchIndex` — the global `/search` index, forty lines
below in the same file — carried all three. So the two search boxes disagreed about the
same content:

```
/en/cuisine  search "Christmas"  → no results
/en/search   search "Christmas"  → ghapama
```

Every occasion string was affected — 17 per edition, all three editions — because the
field was absent rather than mis-joined. "Church feast" (gata), "commemorative" (dolma)
and "Christmas" (ghapama) all returned an empty grid on the category page.

The fix is the one missing line. Nothing else changed: no schema, no locale content, no
translations, no UI, no placeholder text, and no new search logic — `occasions` is a
`string[]`, which is what the existing `haystack()` helper already flattens and normalizes
for `ingredients` and `regions`.

**Why it survived.** `cuisine.spec.ts` covered the ingredient path (`korkot` → harissa)
and stopped there, so the one field with no test was the one field with no code. The
regression test added beside it searches `Christmas` and asserts ghapama is the only card
left — and asserts the card does *not* contain the word. That last assertion is the point:
"Christmas" is in no dish title and no card excerpt, so a card that matches without
displaying the term can only have matched on `occasions`. It is also in ghapama's section
prose, which the listing deliberately leaves out of the client payload, so no other field
can satisfy the query there.

The test was confirmed to fail against the pre-fix code with exactly the reported symptom
(0 cards) before being accepted.

The two unused exports below it, `getCuisineListingItems` and `getHistoryListingItems`,
were left alone — both are dead today, and removing them is not this change's business.

---

## 27. Cuisine SEO fields — complete in all three editions (August 2026)

Cuisine was the one category the August 2026 SEO batches did not reach. All six dishes
carried a `title` and an `excerpt` and nothing else, so every dish page fell back to those
two for its `<title>` and its meta description, and none had the standalone `summary`
block that History gained in §23.

All six now have dedicated `seoTitle`, `metaDescription` and `summary` in `hy`, `hyw` and
`en` — **18 article-locale entries**, none left to fall back.

### What each field targets

Each `seoTitle` names the dish and the one thing a searcher is most likely to be after:
the tonir and the two UNESCO inscriptions for lavash; the shared-origin question for
dolma; the fire and the occasion for khorovats; wheat, meat and Musaler for harissa —
which also distinguishes it from the unrelated North African pepper paste of the same
name; khoriz for gata; and for ghapama the whole baked pumpkin. `metaDescription` runs
121–156 characters and `summary` 40–140 words, the envelope the validator enforces and
the History entries already sit in.

### What the fields do not say

The editorial rules of §20 governed every line. No dish is described as exclusively
Armenian, because no source says so for any of these six: lavash's summary states that
the same bread name carries two inscriptions and that each records a practice rather than
ownership; dolma's records that the 2017 inscription was submitted by Azerbaijan and
documents a practice, not an origin; harissa's gives the tenth-century Baghdadi record and
the related dishes made across the Middle East. Ghapama's states the botanical limit —
every *Cucurbita* is a New World plant — rather than calling the dish ancient.

Nothing promises a recipe. `summary` describes what a dish is, when it is eaten and what
it means, never quantities or steps, which is the same line `preparation` holds in
`CuisineDetails` and the reason **no `Recipe` structured data was added** (the standing
argument is in `lib/seo.ts`: `Recipe` promises `recipeIngredient` and
`recipeInstructions` a reader can cook from, and these pages decline to be that).

### What did not change

Article bodies, titles, slugs, excerpts, sources, key facts, dates, keywords, related
articles, `CuisineDetails`, the schema, components, routes and the search implementation
are all untouched. Verified on the built output for `/en`, `/hy`, `/hyw` `cuisine/lavash`
and `/en/cuisine/ghapama`: canonical URLs, the four `hreflang` alternates including
`x-default`, and the JSON-LD graph (`Organization`, `WebSite`, `Article`,
`BreadcrumbList`, four citations, no `about`, no `Recipe`) are unchanged. `og:title` and
the JSON-LD `headline` still carry the plain `title`, not `seoTitle` — the distinction
`ArticleRoute.tsx` documents.

### Verification

`typecheck` PASS · `validate:content` PASS (99 entries) · `build` PASS (102 pages) ·
`test:e2e` PASS (146 passed, 5 skipped).

One test was added, which is why the count moved from 145. Nothing in the suite asserted
that `seoTitle` and `metaDescription` reach the document head *in any category* — the
existing `article.spec.ts` summary test covers only the visible block. The new test walks
all six dishes in all three editions, asserts the `<title>` and description come from the
new fields and are not the values they override, and asserts the H1 is still the plain
title so `seoTitle` cannot leak into the headline.

The Western Armenian wording follows the terminology already reviewed in the `hyw` dish
articles (`կերակուր`, `լեցոն`, `կորկոտ`, `գառնուկ`, `արջառ`, `որթատունկի տերեւ`,
`ԵՈՒՆԵՍՔՕ`, `Պաղտատ`, `Ազրպէյճան`) rather than converting the Eastern Armenian text. It
remains subject to the native review §16 records as outstanding for the edition as a whole.

No deployment was performed.

---

## 28. Places — category foundation and first article (August 2026)

Places is the fifth category. This change adds the infrastructure and **one** article;
everything a travel section would eventually need is deliberately absent.

**Product decisions, taken and implemented as given:** id `places`; labels `Places` /
`Վայրեր` / `Վայրեր`; `/[locale]/places` and `/[locale]/places/[slug]`; no `/visit` prefix;
current coordinates only; relationships through the existing `relatedSlugs` and
`SectionLink`; no `PlaceDetails` in v1.

### What was added

- `CategoryId` and `CATEGORY_IDS` gain `places`, appended after cuisine.
- `ArticleSummary.placeTypeId?: string` — **id only**. It follows `topicTypeId`, not
  `dishType`/`dishTypeId`: the translated label lives once in the locale's `placeTypes`
  list, so there is no second copy to drift and no validator rule to write. A place card
  therefore shows no qualifier chip rather than a raw id.
- `LocaleContent.placeTypes: Filter[]`, shipped with **two** entries — `all` and
  `monastery`. `museum`, `nature`, `historical` and `settlement` are not written ahead of
  the articles that would earn them, because `validateFilterCoverage` fails the build on a
  pill that matches nothing.
- `src/data/geo.ts` — a coordinate registry keyed by slug, modelled on `IMAGES` in
  `lib/media.ts` for the same reason: a coordinate is a property of the place, not of an
  edition, and three copies is three chances to typo a digit. `PlacePoint` carries
  `precision: "site" | "settlement" | "area"` from the first entry, so a lake's centroid
  can never later be mistaken for a doorway. Nothing renders it yet.
- Routes, `PlacesListing` (single `type` axis on `placeTypeId`), and the category card,
  navigation, footer, search-group, search-result and article-card registrations.

### Two defects this work surfaced

**The search-group list was a cast, not a checked value.** `SearchPageResults` built its
groups from a literal `["history","writers","works","cuisine"] as CategoryId[]`, so a new
category would have been indexed, findable from its own listing, and silently missing from
`/search`. It now maps `CATEGORY_IDS`.

**`toArticleListingItems` builds its projection field by field**, and every field on
`ArticleSummary` is optional — so omitting `placeTypeId` compiled cleanly and left the
places listing rendering its filter pills and matching nothing. The e2e filter test caught
it; the field is now in the projection with a note explaining why the compiler cannot.

### The first article

`khor-virap`, in all three editions, with `placeTypeId: "monastery"` and `featured: true`
(the listing reads the flag, never a hard-coded slug). Six sections, six key facts, three
dates, five facts, two related figures, a `SectionLink` into `adoption-of-christianity`,
and `relatedSlugs: ["adoption-of-christianity", "tigran-the-great"]` — both genuine: the
first is what the site's tradition leads to, the second is the article that already
discusses Artashat, the capital the monastery's hill belonged to.

It is written as a place article, not a listing: no hours, prices, transport or
restaurants. Where the story is tradition it says so and names the text it comes from,
because Agathangelos was written well over a century after the events it describes. Mount
Ararat is described as a geographic fact of the view, including that it lies across the
present border, and nothing further is claimed.

**Sources (4).** Agathangelos/Thomson and Garsoian are reused verbatim from
`adoption-of-christianity` — the same two texts carry the same claim, and citing a
different pair would imply a second body of evidence that does not exist. Two are new to
the repository: Hewsen's *Armenia: A Historical Atlas* (geography and Artashat) and
Maranci's *The Art of Armenia* (building history). Both new ISBNs were flagged for
confirmation here and were confirmed in §29; the 1662 date was audited there and did not
survive.

### No image, on purpose — reversed in §30

> **This section is a historical record of the August 2026 decision. It no longer
> describes the repository.** §30 registered a copy of the homepage hero as this article's
> artwork by making the missing claim explicitly rather than working around it, and
> `PENDING_ARTWORK` is empty again. The reasoning below is kept because it is why the
> registration had to state the provenance out loud; read it with §30.

`public/hero-ararat.png` shows this monastery and was assessed for reuse. It was rejected:
everything in `IMAGES` inherits `ARTWORK_PROVENANCE`, which asserts the file is
AI-generated, and that has never been established for the homepage hero — it sits outside
`public/images/` with the category banners and carries no provenance of its own.
Registering it would assert something unrecorded, which is the failure §17 exists to
prevent. It is also a 1.4 MB PNG against a registry of 110–160 KB WebP, and it would have
become the homepage hero, the category card, the article hero, the Open Graph image and the
sitemap image simultaneously. The slug is declared in `PENDING_ARTWORK` instead;
`ArticleLayout` already renders the generated placeholder with `imagePlaceholderCaption`,
and `isGeneratedArtwork` stays false so nothing is captioned AI-generated without cause.
`validate:content` prints the debt on every run.

### Layout

The header bar goes from five items to six and still fits on one line at 1024/1152/1280/
1440 in all three editions — `Վայրեր` is short enough, which is why the label mattered. The
homepage category row goes from four cards to five, laid out three-then-two over a
twelve-column track rather than five narrow columns or a four-column row with one card
stranded.

### Out of scope, and still out

No `PlaceDetails`, `regionId`, regions, `nearbyPlaceSlugs`, `relatedDishSlugs`, visit
duration, seasons, accessibility, transport, hours, prices, venues, restaurants, routes,
map components or place-specific JSON-LD. The article emits the generic `Article` +
`BreadcrumbList` graph, and a test asserts that `Place`, `TouristAttraction` and
`LocalBusiness` are **not** present.

**Ani and places outside the current Republic of Armenia are deferred**, pending an
editorial decision on how the archive frames culturally Armenian sites beyond the present
border. That decision should be taken before the second batch, not settled implicitly by a
coordinate.

### Verification

`typecheck` PASS · `validate:content` PASS (102 entries) · `build` PASS (108 pages) ·
`test:e2e` PASS (161 passed, 5 skipped).

`places.spec.ts` adds 15 tests: listing and article in all three editions, no English
fallback, the filter and its URL state, the featured flag, header and footer links, the
five-card homepage row, the search group, the browse link, SEO fields, canonical and
hreflang, the JSON-LD types with the tourism-type exclusions, the sitemap, and a guard that
the four existing listings still render the counts they did.

**One pre-existing flake, now more likely.** The "no English leak" test in
`cuisine.spec.ts` walks 18 pages in a single test and aborted twice under two parallel
workers against the dev server, at two different lines, passing alone each time. The full
suite run with `--workers=1` is green at 161/161. Places did not change that test's
subject; it added routes for the dev server to compile on demand. **Split in §29.**

### Open items

- **Western Armenian wording is pending native review** — the whole `hyw` article, the
  `placeTypes` labels and the Places UI strings. This adds to the queue §16 already records
  for the edition as a whole. Terminology was taken from the reviewed `hyw` articles rather
  than converted from Eastern Armenian (`Ք.Ա.`, `մօտ`, classical orthography, the
  `կը`/`կ՚` verb forms, `մը`/`մըն`), but proper nouns are the hardest part and
  `Ռոպերթ Հիւսըն`, `Քրիստինա Մարանչի` and `Ագաթանգեղոս` should be checked.
- ~~**Khor Virap has no article artwork.**~~ **Closed in §30** — a copy of the homepage
  hero is registered under `"khor-virap"` and `PENDING_ARTWORK` is empty. This bullet said
  "Still true; see §29" until then.

The coordinate and citation items recorded here were resolved in §29 and are not repeated.

No deployment was performed.

---

## 29. Places — hardening the foundation (August 2026)

§28 shipped the Places category with three things left open and one test known to be
fragile. This section closes them. No article, filter, route or feature was added.

### The coordinate

`khor-virap` is now `39.8784, 44.5762`, `precision: "site"` — the OpenStreetMap position
`39.87836, 44.57615` rounded to four decimal places. The previous entry, `39.8783,
44.5772`, was about 90 metres east of the enclosure.

The provenance comment in `geo.ts` now states the four things a later editor needs: the
point is the monastery *complex* (the walled enclosure with Surb Astvatsatsin and the
chapel over the pit, not a car park or the nearest village), the source is OpenStreetMap
or a gazetteer derived from it, the rounding is deliberate rather than sloppy, and
`precision: "site"` means a specific built complex. Four places is about 11 metres —
finer than anything here needs, and coarse enough not to imply a survey nobody did. It is
rounded on the way *in*, so nothing downstream can reintroduce digits the source never
had.

The §28 open item asking an editor to check the value is removed: it has been checked.

### The two ISBNs

Confirmed against the publishers and left exactly as they were:

- Hewsen, *Armenia: A Historical Atlas* — 9780226332284, University of Chicago Press.
- Maranci, *The Art of Armenia: An Introduction* — 9780190269005, Oxford University Press.

Both records already carried those identifiers, publishers and years, so nothing in
`sources.ts` changed. Given §17, "the entry was already right" is a result worth recording
rather than a non-event.

### The 1662 date — audited, and it did not survive

**Result: not directly supported by any of the article's four registered sources, so the
claim is now "seventeenth century" in all three editions.**

The four sources are Agathangelos/Thomson, Garsoïan, Hewsen and Maranci. The first two are
about the fourth century and cannot speak to a seventeenth-century church. Hewsen is a
historical atlas of the Armenian lands, cited for the position of Artashat. That leaves
Maranci's survey, which does cover the period — but no page of it was in hand stating
`1662` for this church, and "a survey that covers the century" is not the same claim as "a
source that gives the year".

What the general web carries is a tourism and encyclopedia consensus with no footnote
behind it — and, tellingly, it does not agree with itself: several accounts say the church
was *begun* in 1662 and finished later in the century, which makes the flat sentence "built
in 1662" wrong even on its own sources' terms. Under the rule in the header of
`sources.ts`, an unfootnoted snippet is not evidence.

So the exact year is gone, and the *whole* claim moved together — there is no field left
saying 1662 while another says the century:

| field | before | after (en) |
| --- | --- | --- |
| `summary` | "dates from 1662" | "is a seventeenth-century building" |
| `keyFacts` | "Surb Astvatsatsin …, 1662" | "…, seventeenth century" |
| `sections.the-monastery` | "built in 1662" | "built in the seventeenth century" |
| `importantDates[2].year` | "1662" | "Seventeenth century" |
| `interestingFacts` | "was built in 1662" | "is a seventeenth-century building" |

`significance` already said "seventeenth-century" in all three editions and is unchanged —
which is the tell that the year was never load-bearing.

Armenian follows each edition's own prose rather than a Roman numeral: `hy` uses
`տասնյոթերորդ դար`, matching the `տասնյոթերորդ դարի` already in its `significance`, and
`hyw` uses `տասնեօթներորդ դար`. Neither spelling introduces Arabic digits, which matters:
`validateCrossLocaleNumbers` compares digit runs across editions, and a `hyw` reading
`17-րդ դար` would have failed against `Seventeenth century`.

Nothing else moved. The article still names Maranci for the *kind* of building — compact,
domed, ornament at the drum and doorway — which is what a survey of the period can actually
support.

### Places validation — the rules the first version shipped without

`validate:content` gains a Places block. As everywhere else in this script there is no
warning tier: each of these exits 1.

**Classification.** A `places` article must declare a non-empty `placeTypeId`; it must
match an id in that locale's `placeTypes`; and it must not be `all`, which is the
"no filter applied" option rather than a kind of site. An article in any other category
must *not* declare one. `placeTypes` now goes through `validateFilters` like every other
list, and through `validateFilterCoverage` — which is what makes "one filter per article
that earns it" a build rule instead of a habit. No translated place-type label was added
to any article: the id still travels alone.

**The coordinate registry.** `PLACE_COORDINATES` is a `Record<string, PlacePoint>`, so
TypeScript happily accepts a key for an article that does not exist, a place with no key,
and a latitude of 900. Now: every canonical (`hy`) places slug must have an entry, every
entry must name a real places article, `lat`/`lon` must be finite, latitude within ±90,
longitude within ±180, and `0, 0` is rejected outright — a valid pair in the Gulf of Guinea
and exactly what an unfilled coordinate looks like. `precision` is re-checked at runtime
even though the union already forbids anything else, because this script reads the registry
as data and a cast upstream would walk straight past the type.

Two rules were considered and deliberately left out, both recorded in the function's
comment so they are not "forgotten" and re-proposed:

- **No Armenia-shaped bounding box.** The archive has not decided how it frames culturally
  Armenian sites beyond the present border (§28 defers Ani for exactly this reason). A
  hardcoded national box would settle that question by failing the build on the first
  article that tested it.
- **No duplicate-coordinate check.** Two sites can legitimately round to the same four
  places — a chapel inside a monastery wall, a church and its bell tower. That belongs in a
  warning tier this script does not have, and as an error it would be an obstruction.

**Locale parity.** `placeTypeId` joins `periodId`, `topicTypeId`, `dishTypeId`, `href`,
`category` and `relatedSlugs` in `validateCrossLocaleTaxonomy`. A place is the same kind of
site in every language; without this the Armenian reader could find Khor Virap under
monasteries and the English reader under nothing at all, with three valid files and no
error. Slug existence across editions was already covered by `validateCoverage` (`hy` is
canonical, `en` must be complete, and any `hyw` gap must be declared), and the numerals by
`validateCrossLocaleNumbers`.

**These were proved by breaking the data on purpose**, not by reading the code: a run with
`0, 0`, a registry key pointing at `lavash`, `lat: 91`, `lon: 200` and a mismatched
`placeTypeId` produced seven errors and exit 1 — the coordinate rules, the filter-coverage
rule, the unknown-id rule and the cross-locale parity rule each firing by name. The data was
then restored and the run is clean again.

### The Cuisine flake — split, not suppressed

The "no English leak" test walked eighteen article pages inside one 30-second budget. It
was the longest test in the suite by a wide margin and aborted intermittently under the
normal two workers, at a *different dish* each time — the signature of a timeout, not a
defect.

It is now three tests, one per edition, generated from the same `LOCALES` loop the rest of
the file uses. Every assertion is unchanged and every dish in every edition is still
visited: six navigations per test instead of eighteen, and the three run concurrently.
Worst observed run time dropped to 11.6s. Nothing was skipped, marked slow, given a longer
timeout, or pinned to one worker, and the suite grew by two tests (161 → 163).

### Still open

- ~~**Khor Virap has no article artwork.**~~ **Closed in §30.** This bullet recorded that
  the slug stayed in `PENDING_ARTWORK` and that `validate:content` still printed
  `note: 1 slug(s) render generated artwork: khor-virap`. Neither is true now. A
  *dedicated* image is still separate work — what ships is a copy of the homepage hero.
- **Western Armenian is still pending native review** — the `hyw` article, the `placeTypes`
  labels and the Places UI strings, now including `տասնեօթներորդ դար`. The transliterated
  proper nouns (`Ռոպերթ Հիւսըն`, `Քրիստինա Մարանչի`, `Ագաթանգեղոս`, `Նինա Կարսոյեան`) and
  `Սուրբ Գէորգ` remain the weakest part.
- **A page reference for the building history.** The audit above closes the exact-year
  question, but a page in Maranci pinning the church to its century would let the article
  cite rather than merely describe. `Source` has a `note` field that could carry it.

### Verification

`typecheck` PASS · `validate:content` PASS (102 entries; the artwork note still prints) ·
`build` PASS (108 pages, all six Places routes prerendered).

`npx playwright test` was run **twice at the repository's normal two workers** — 163 passed,
5 skipped, 0 failed, in 4.4 and 4.1 minutes. `places.spec.ts` 15/15 on its own; the three
split Cuisine leak tests 3/3 on their own. The built English page contains no `1662` and
eleven mentions of the century.

No deployment was performed.

---

## 30. Khor Virap artwork — the hero, copied and declared (August 2026)

The last open item from §28, carried unchanged through §29, is closed. `khor-virap` now
renders registered artwork on every surface. No article, route, component or feature was
added, and nothing about the homepage changed.

### What shipped is a copy, not a new picture

`public/images/places/khor-virap.png` is **byte-for-byte identical to
`public/hero-ararat.png`** — the homepage hero. Same 1355×793 8-bit truecolour PNG, same
1,471,530 bytes, same SHA-256 `2d7420356bbe4188…3391a47c`. It is a copy placed in the
registry's own directory, not a reference across to the hero's path and not a new
illustration. Anyone reading this section should not expect to find a second picture of
Khor Virap in the repo; there is one picture, stored twice.

**The homepage is unchanged.** `public/hero-ararat.png` was not modified, renamed,
optimised, cropped or deleted, and `src/components/sections/Hero.tsx` still points at
`/hero-ararat.png` directly rather than going through `getImageSrc`. Neither file was
touched by this pass beyond the copy being created.

### The provenance claim §28 would not make, made explicitly

§28 assessed exactly this reuse and rejected it, for a reason worth restating: everything
in `IMAGES` inherits `ARTWORK_PROVENANCE`, which asserts the file is AI-generated, and that
had never been recorded anywhere for the homepage hero. Registering it would have asserted
something unrecorded — the failure §17 exists to prevent.

This pass does not work around that objection; it answers it. **The hero is hereby declared
Armat-generated editorial artwork**, on the same terms as every other file in the registry,
and the declaration is written into the `// Places` block of `src/lib/media.ts` beside the
entry it licenses. The provenance is now stated for both copies rather than for neither,
which is the actual improvement — the previous state left the homepage hero's origin
unrecorded too, and merely declined to inherit from it.

The consequence follows automatically: `isGeneratedArtwork` returns true for the slug, so
the article's hero is captioned **"AI-generated illustration"** like every other registry
image. Nothing about `ARTWORK_PROVENANCE` itself was altered.

### `PENDING_ARTWORK` is empty again — until §31

`PENDING_ARTWORK` is back to `[]`. `validate:content` no longer prints
`note: 1 slug(s) render generated artwork: khor-virap` — the debt line §28 introduced and
§29 confirmed is gone because the debt is paid. The list is kept rather than deleted, for
the reason its own doc comment gives: the alternative is a slug silently rendering the
placeholder with nothing in the repo saying whether that is a decision or an oversight.

> **The list did not stay empty, and then it did again.** §31 added Etchmiadzin Cathedral,
> for which no artwork existed, so `PENDING_ARTWORK` held `etchmiadzin-cathedral` and the
> note printed against that slug. §32 registered that artwork and emptied the list again.
> Khor Virap's own artwork was unaffected throughout. The mechanism being kept rather than
> deleted is what made both changes one-liners — and the round trip is the case it was
> designed for.

### Two live consequences, recorded rather than rediscovered

1. **The same picture is now the homepage hero and one article's cover.** A reader
   arriving at the homepage and clicking through to Khor Virap sees it twice. That is the
   accepted cost of closing the item with the material on hand.
2. **It is the heaviest image on the site** — a 1.4 MB PNG against a registry of
   110–160 KB WebP — and it now serves as the article hero, the listing featured block, the
   listing card, the search thumbnail, the Open Graph and Twitter image and the sitemap
   image. Replacing it with a lighter, place-specific WebP is **a one-line change**: every
   consumer already asks `getImageSrc`, so swapping the value on the `"khor-virap"` key
   reaches all six surfaces at once. That is the intended follow-up.

### Tests

`tests/e2e/places.spec.ts` goes from 15 to 20 tests. The five additions cover the surfaces
the registration actually changed: the article hero plus its AI-illustration caption; the
listing's featured block and card; the search thumbnail; the OG, Twitter and JSON-LD image;
and the sitemap image entry.

**One surface is not exercised, and is not faked.** No page currently renders Khor Virap in
a *related-articles* block. `getRelatedArticles` is one-directional through `relatedSlugs`,
and no article lists `khor-virap` among its own, so the block has nothing to render it
from. The component that block uses is `ArticleCard` — the same component the listing-card
test covers — so the image lookup through it is proven; the related-articles surface itself
is not. Adding a `relatedSlugs` entry to some other article purely to manufacture coverage
was considered and deliberately not done: it would change editorial content to satisfy a
test.

### Verification

`typecheck` PASS · `validate:content` PASS (102 entries, no pending-artwork note) ·
`build` PASS (108 pages, all six Places routes prerendered).

`npx playwright test`, no `--workers` flag — **168 passed, 5 skipped, 0 failed** in 1.8
minutes, up from the 163/5 recorded in §29 by exactly the five new tests. `places.spec.ts`
20/20 on its own.

**Correction to a figure §29 and §3 both carried.** Those sections describe the suite as
running "at the repository's normal two workers". There is no such repository setting:
`playwright.config.ts` sets `fullyParallel: true` and never sets `workers`, so Playwright
uses its default of half the logical cores. The two-worker figure was a property of the
machine those runs happened on. This run reported `Running 173 tests using 6 workers` on a
12-core machine. The worker count is therefore not reproducible across machines and should
not be quoted as if it were a repo invariant — the reproducible facts are the 173 declared,
168 passed and 5 skipped. That the suite passes at six-way parallelism is stronger evidence
than the earlier two-worker runs, which matters for the Cuisine leak tests §29 split
rather than suppressed.

One false failure is worth recording so it is not diagnosed twice. `playwright.config.ts`
sets `reuseExistingServer: true`, so a stale dev server left on port 3002 by an earlier
session gets adopted by the runner and serves a hard Next 404 for
`/{locale}/places/khor-virap` while the listing loads normally. Kill the listener before a
full run:

```powershell
Get-NetTCPConnection -LocalPort 3002 -State Listen -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Files changed

`public/images/places/khor-virap.png` (added, a copy) · `src/lib/media.ts` (the `// Places`
block, the emptied `PENDING_ARTWORK`, and the registry doc comment noting the extension is
not a convention either) · `tests/e2e/places.spec.ts` (+5 tests) · this document.

### Still open

- **A dedicated Khor Virap image.** The item §28 opened is closed in the sense that the
  slug has artwork; it is not closed in the sense that the artwork is *of nothing else*.
  A place-specific WebP would fix both the duplication and the weight in one line.
- **Related-articles coverage** for this slug, if and when an article legitimately links to
  it.
- The `hyw` native review from §28 and §29 is untouched by this pass and still stands.

No deployment was performed.

---

## 31. Places — Etchmiadzin Cathedral, the second place (August 2026)

Places had one article through §28, §29 and §30. It now has two. `etchmiadzin-cathedral`
is complete in all three editions, uses the existing Places infrastructure unchanged, and
ships **without artwork on purpose**. No new place type, no new filter, no new component,
no schema change.

### Why this article, and what it is not

Etchmiadzin is the natural second place because it is the other half of a subject the
archive already covers. §28's Khor Virap article is about where the conversion narrative is
*remembered*; this one is about where the church that followed was *administered*. Both
rest on the same two texts, and the same editorial rule governs both: where a story is
tradition, the wording says so and names the text it comes from.

It is deliberately not a visitor guide. No opening hours, ticket prices, service times,
transport directions or restaurant recommendations — the §28 rule, unchanged. `PlaceDetails`
was not added, no region or accessibility field was introduced, and no map functionality
exists.

### Terminology was inherited, not invented

The spellings were taken from what the repository already ships rather than chosen fresh,
which is the whole point of checking first:

| Concept | `en` | `hy` | `hyw` |
|---|---|---|---|
| The place | Etchmiadzin | Էջմիածին | Էջմիածին |
| The town | Vagharshapat | Վաղարշապատ | Վաղարշապատ |
| The office | Catholicos | Կաթողիկոս | Կաթողիկոս |
| The saint | Gregory the Illuminator | Գրիգոր Լուսավորիչ | Գրիգոր Լուսաւորիչ |
| The name's meaning | the Only Begotten descended | Միածնի իջնելը | Միածինին իջնելը |
| UNESCO | UNESCO | ՅՈՒՆԵՍԿՕ | ԵՈՒՆԵՍՔՕ |

**No second English spelling was introduced.** The archive uses `Etchmiadzin` in ten places
in `history.ts` and three in `writers.ts`, and this article uses it throughout. `Echmiatsin`
appears exactly once in the repository — inside the UNESCO citation, because that is the
official property name and a citation is quoted, not corrected. The source's `note` says so
explicitly so a later editor does not "fix" it.

Note the two editions genuinely differ on UNESCO: `hy` writes `ՅՈՒՆԵՍԿՕ`, `hyw` writes
`ԵՈՒՆԵՍՔՕ`. Both were already in the repository, and each edition keeps its own.

### The article

Eight sections, the same ids in all three editions: `where-it-is`, `the-conversion`,
`the-vision`, `what-survives`, `the-mother-see`, `the-complex`, `manuscripts-and-learning`,
`before-you-see-it`. Six `keyFacts`, eight `importantDates`, five `interestingFacts`, three
`relatedFigures` — identical cardinalities across editions, enforced by the validator's
cross-locale taxonomy and number checks.

### The distinction the article is built around

The central claim is that **the present cathedral is not a fourth-century building**, and
the article separates four kinds of statement rather than blending them:

1. **Early Christian tradition.** Gregory the Illuminator founds the cathedral after the
   conversion; Christ descends and strikes the ground with a golden hammer to mark the
   site, which is what the name records. This is Agathangelos — a fifth-century narrative
   written well over a century after the events, and the article says so in the section
   that tells it.
2. **Later historical reconstruction.** The conversion's traditional date of 301 is not
   treated as fixed; Garsoïan's arguments for c. 314 are named, exactly as `khor-virap` and
   `adoption-of-christianity` already do. The cathedral's own foundation date is described
   as *looser still*, because it depends on the same narrative source and is not
   independently documented.
3. **Surviving architectural fabric.** The decisive event is the rebuilding of **483** under
   Vahan Mamikonian, reported by Ghazar Parpetsi, which gave the church its cruciform,
   four-piered domed plan — the core of the building today. The article notes the timing
   follows directly on the Treaty of Nvarsak of 484.
4. **Later additions and modern use.** Stone dome in the seventeenth century; west belfry
   1653–1658; smaller bell turrets 1682; eastern sacristy 1868; restoration continuing into
   recent decades.

The summary sentence in the article is deliberately blunt: *"The cathedral is old, and it is
not old in one piece."*

**One thing was deliberately left vague.** Sources disagree on *which* walls of the earliest
building survive — English Wikipedia says the northern and eastern, a Grokipedia-derived
page says the south and west. Neither is a source this archive would cite, and the two
cannot both be right, so the article says only that excavation has identified remains of an
earlier building beneath and within the present fabric. No compass direction is asserted.

Also avoided: the widely repeated claim that this is "the oldest cathedral in the world".
It is a contested superlative that depends entirely on how "cathedral" is defined, and §28's
rule against unsupported superlatives covers it.

### Sources

Seven, all verified. Five are works the repository had already audited and registered, cited
again on purpose — the same reasoning `sources.ts` gives for Khor Virap, that citing a
different work for the same claim would imply a second body of evidence that does not exist.

| Source | Identifier | Cited for | Status |
|---|---|---|---|
| Agathangelos, trans. Thomson, *History of the Armenians* | ISBN 9780873953238 | the vision and the name | already registered |
| Garsoïan, *Studies on the Formation of Christian Armenia* | ISBN 9781409403661 | dating, tradition-as-tradition | already registered |
| Maranci, *The Art of Armenia: An Introduction* | ISBN 9780190269005 | building history | already registered |
| Hovannisian (ed.), *The Armenian People…* Vol. I | ISBN 9781403966360 | institutional history | already registered |
| Hewsen, *Armenia: A Historical Atlas* | ISBN 9780226332284 | Vagharshapat's position and standing | already registered |
| UNESCO World Heritage List no. 1011 | `whc.unesco.org/en/list/1011/` | the inscription | already registered |
| Mother See of Holy Etchmiadzin, official site | `armenianchurch.org/en/mother-see` | **present-day institution only** | **new, fetched and verified** |

The only new registration is the Mother See's own site. Its `note` restricts it explicitly:
an institution is a reliable source on its own organisation and an interested one on its own
antiquity, so it carries the Catholicos, the seminary and the museums, and carries nothing
historical. Nothing was fabricated: no invented title, author, date, ISBN, URL or page
reference.

### Coordinate

One entry in `src/data/geo.ts`, locale-independent, in the existing provenance style:

```ts
"etchmiadzin-cathedral": { lat: 40.1618, lon: 44.2911, precision: "site" },
```

Verified against **OpenStreetMap way 133909119** (`Էջմիածնի Մայր Տաճար`,
`amenity=place_of_worship`), which gives `40.1618404, 44.2911157`; rounded to four places on
the way in, as the file requires. Wikipedia's infobox agrees at 40°09′43″N 44°17′28″E.

**The point is the cathedral, not the town.** OSM puts the centre of Vagharshapat near
40.1703, 44.2888 — close enough that a lazy coordinate would look plausible. A test asserts
the recorded latitude is more than 0.005° from the town centre, because the validator
deliberately has no bounding box and no way to catch a plausible-but-wrong point.

### Related content

`relatedSlugs: ["adoption-of-christianity", "khor-virap", "battle-of-avarayr"]`, identical in
all three editions. Three contextual `SectionLink`s, each in a different section and each on
a phrase that actually occurs in that section's prose:

- `the-conversion` → `adoption-of-christianity`
- `the-vision` → `khor-virap`
- `what-survives` → `battle-of-avarayr`, on the Treaty of Nvarsak

The third is the one worth defending. It is not padding: the article argues the 483
rebuilding follows directly on the settlement that ended the revolt against Sasanian rule,
and Vahan Mamikonian is a `relatedFigure` here for that reason. The relationship is carried
by the prose, which is the standard §28 set.

**No existing article was edited to add a backlink.** History and Khor Virap content is
untouched, so nothing yet links *to* `etchmiadzin-cathedral` — the same one-directional gap
§30 recorded for Khor Virap, now applying to both places.

### Artwork — pending, and honestly so — ✅ RESOLVED IN §32

> **This section is a historical record. The artwork has since landed.** §32 registered
> `public/images/places/etchmiadzin-cathedral.webp`, a 1586×992 WebP that depicts the
> cathedral, and `PENDING_ARTWORK` is empty again. The reasoning below is kept because it
> is *why* nothing was stretched to fit in the meantime — the placeholder was the correct
> state, not a gap left by accident.

**No artwork ships with this article.** Both candidate files in `public/` were examined and
both were rejected:

- `hero-ararat.png` — the Khor Virap hill under Ararat. A different building thirty
  kilometres away. §30 explicitly forbids reusing it here, and reusing it would caption one
  monastery with another.
- `images/history/adoption-of-christianity.webp` — the baptism scene. A generic Armenian
  church stands in the background, but the focal subject is the two figures, and the church
  is not Etchmiadzin. This is exactly the "generic Christianity illustration" case.

So `etchmiadzin-cathedral` is declared in `PENDING_ARTWORK` with the reasoning recorded
beside it, `ArticleLayout` renders the generated placeholder, `isGeneratedArtwork` stays
false, and nothing is captioned AI-generated without cause. `validate:content` prints
`note: 1 slug(s) render generated artwork: etchmiadzin-cathedral` on every run. **No image
was generated, copied, renamed or fabricated.**

This reverses §30's "`PENDING_ARTWORK` is empty again" — that section's own note now says so.
Khor Virap's artwork is unchanged.

### Filters and listing

`placeTypes` is untouched: still `all` and `monastery`, exactly two pills. Both places are
`placeTypeId: "monastery"`, so the Monastery filter returns both rather than narrowing — and
that is now a real assertion rather than a tautology.

The listing implementation was **not modified**. It already read
`articles.find((article) => article.featured)` with no hardcoded slug, so Khor Virap remains
the featured article purely because it is the one carrying `featured: true`. With a second
article present this stopped being trivially true — the listing falls back to the *first*
article when nothing is flagged — so a test now asserts exactly one place carries the flag.

### Tests

`places.spec.ts` goes from 20 to 24 tests. Existing tests were extended rather than
duplicated: the per-locale loop now opens both articles, the card counts moved from 1 to 2,
the SEO/canonical/hreflang test loops over both slugs, the sitemap test covers all six
article URLs, and the JSON-LD test now checks both articles emit `Article` and
`BreadcrumbList` and **no** `Place`, `TouristAttraction`, `LocalBusiness` or `Church`.

Four are new, and three of them exist because the second article has *no* artwork — which
turns the artwork code path into a real branch for the first time:

1. **The placeholder state.** The pending article renders an inline `<svg role="img">`, no
   raster `<img>`, and is *not* captioned "AI-generated illustration". The failure guarded
   against is not a missing picture — that is the declared state — but a page claiming one.
2. **Open Graph does not inherit.** The pending article's `og:image` and `twitter:image` must
   not be Khor Virap's file. Inheriting a sibling's art would be invisible on the page and
   wrong in every share preview.
3. **Global search** finds the second place under the Places group.
4. **The coordinate registry** holds one `site`-precision point per place, no fifth decimal,
   and the cathedral point is measurably distinct from the town centre.

The SEO test also gained an assertion the suite was missing: **the H1 renders `title`, not
`seoTitle`**. Nothing else in the file would have caught that swap.

### Western Armenian — written, not converted

The `hyw` article was written in Western Armenian rather than transliterated from Eastern:
classical orthography throughout (`-ութիւն`, `-ուած`, spelled-out `եւ`), Western verb forms
(`կը`/`կ՚`, `մը`/`մըն`, `կու տայ`, `կրցաւ`), and Western institutional vocabulary. The
validator enforces the orthography mechanically — `և` and `ություն` fail the build — but it
cannot check grammar or register, so the following are flagged for native review:

- **The whole article**, as with every `hyw` text since §16.
- **Proper names**, the weakest part as always: `Ղազար Փարպեցի`, `Վահան Մամիկոնեան`,
  `Զուարթնոց`, `Գէորգեան ճեմարան`, `Սուրբ Հռիփսիմէ`, `Սուրբ Գայանէ`, `Շողակաթ`, `Դուին`,
  `Արմաւիր`, and the already-flagged `Ռոպերթ Հիւսըն`, `Քրիստինա Մարանչի`, `Նինա Կարսոյեան`,
  `Ագաթանգեղոս`, `Ռ. Վ. Թոմսըն`.
- **Religious and institutional register** specifically: `Մայր Աթոռ Սուրբ Էջմիածին`,
  `Ամենայն Հայոց Կաթողիկոս`, `միւռոնի օրհնութիւն`, `ձեռնադրութիւն`, `աւանդատուն`,
  `հոգեւորականութիւն`. Western Armenian ecclesiastical usage has its own conventions and a
  diaspora reader will notice a wrong one immediately.
- **`ԵՈՒՆԵՍՔՕ`**, kept from `history.ts` rather than harmonised with the `hy` `ՅՈՒՆԵՍԿՕ`.
  Worth confirming that the existing form is the one Western Armenian readers expect.

### Verification

| Command | Result |
|---|---|
| `npm run typecheck` | PASS, 0 errors |
| `npm run validate:content` | PASS — **105 entries** (was 102), with `note: 1 slug(s) render generated artwork: etchmiadzin-cathedral` |
| `npx playwright test --project=desktop places.spec.ts` | **24/24** |
| `npx playwright test` | **172 passed, 5 skipped, 0 failed** |
| `npm run build` | PASS — **111 pages** (was 108), all nine Places routes prerendered |

The three new pages are `{hy,hyw,en}/places/etchmiadzin-cathedral`. Checked directly in the
prerendered HTML: canonical is `https://armat.site/en/places/etchmiadzin-cathedral`, all
three `hreflang` alternates plus `x-default` are present, and the sitemap carries the slug
fifteen times (three URLs, each with four alternate links).

Cross-locale parity is machine-checked rather than asserted: `validateCrossLocaleNumbers`
compares the multiset of every two-or-more-digit number per field across editions, so `301`,
`314`, `483`, `484`, `1441`, `1653`, `1658`, `1682`, `1868`, `1874`, `1929`, `1939`, `2000`
and the `relatedFigures` lifespans all had to match exactly in three languages. Centuries are
spelled out as words in every edition, which keeps them out of that check by design.

### Still open

- **Artwork for Etchmiadzin Cathedral.** The one real debt this section adds. A
  place-specific WebP would clear the `PENDING_ARTWORK` note and give the article a hero, a
  card, a search thumbnail and an OG image in one line, because every consumer goes through
  `getImageSrc`.
- **Western Armenian native review**, per the list above. This adds to the queue from §16,
  §28 and §29.
- **A dedicated Khor Virap image**, unchanged from §30 — its artwork is still a copy of the
  homepage hero.
- **Nothing links *to* either place yet.** `getRelatedArticles` is one-directional and no
  History article lists a place among its `relatedSlugs`. Adding those backlinks is a
  content decision for a later pass and was deliberately out of scope here.

Khor Virap's content, artwork and tests are unchanged, the homepage is unchanged, and
`.claude/settings.json` was not touched.

No deployment was performed.

---

## 32. Etchmiadzin Cathedral artwork — the pending entry, cleared (August 2026)

The one real debt §31 opened is paid. `public/images/places/etchmiadzin-cathedral.webp` now
exists, is registered in `IMAGES`, and the slug is out of `PENDING_ARTWORK`. Nothing else
changed: no image was generated, edited, cropped, resized, recoloured, renamed or replaced,
and no layout component, provenance rule or existing artwork was touched.

### The asset

| Property | Value |
|---|---|
| Path | `public/images/places/etchmiadzin-cathedral.webp` |
| Format | WebP, `RIFF`/`WEBP` container, lossy `VP8 ` chunk (sync `9D 01 2A`) |
| Dimensions | **1586 × 992** (aspect 1.599) |
| Size | **248,346 bytes (242.5 KB)** |
| SHA-256 | `0c59237291cbf76a754cca95a20370a3962d8798cc9be397b954fee082338a5e` |

**It is the right building.** The illustration shows the west belfry with its open arcaded
rotunda standing in front of the church, the central conical dome on a decorated drum, the
smaller bell turrets over the arms, and the precinct wall and gatehouse behind — which is
the cathedral §31 describes, not a generic Armenian church. That distinction is the entire
reason §31 refused the two files already in the repository.

**It fits the layouts without any special handling**, and the evidence is stronger than a
judgement call: it is *exactly* 1586×992, the same pixel dimensions as every other WebP in
the registry — `lavash.webp`, `adoption-of-christianity.webp`, `anush.webp`, `raffi.webp`
all measure the same. The composition is landscape with the subject centred and headroom
above, so the hero, the featured block, the card and the 128–160 px search thumbnail all
crop from the centre without needing the `PORTRAIT_FOCUS` bias the writer artwork uses.

**No issue to report.** The file size sits mid-range: the registry's WebP files run from
85 KB (`raffi.webp`) to 481 KB (`wounds-of-armenia.webp`), so 242.5 KB is unremarkable.

That measurement corrected a claim this document and `media.ts` had both been carrying. §30
described the registry as "110–160 KB WebP", which was only ever true of the cuisine folder;
the works illustrations are 384–481 KB. The comment in `media.ts` now says 85 KB to 481 KB.
Khor Virap's 1.4 MB PNG is still the heaviest image on the site by a wide margin, and it is
still the only entry that is not 1586×992 — both points survive the correction, which is why
the paragraph making them was kept rather than deleted.

### Registration

One line in the existing `IMAGES` map, in the `// Places` block, beside Khor Virap:

```ts
"khor-virap": "/images/places/khor-virap.png",
"etchmiadzin-cathedral": "/images/places/etchmiadzin-cathedral.webp",
```

No Etchmiadzin-specific loading path was introduced. Every surface reaches the file through
the same `getImageSrc` lookup every other article uses, which is why the one line lit up all
six at once: article hero, listing featured block, listing card, search thumbnail, Open Graph
and Twitter tags, and the sitemap image entry.

Provenance follows the existing convention rather than a new one. The file is in `IMAGES`,
so it inherits `ARTWORK_PROVENANCE` — an AI-generated editorial illustration, not a
photograph — `isGeneratedArtwork` returns true, and the hero is captioned
"AI-generated illustration" through `imageAiIllustrationCaption`, the same mechanism and the
same wording branch Khor Virap and the cuisine artwork use. Nothing about
`ARTWORK_PROVENANCE` itself was altered.

**Khor Virap's entry was not modified.** It still maps to `/images/places/khor-virap.png`.

### Pending-artwork status

`PENDING_ARTWORK` is `[]` again, and the explanatory block §31 put inside it is deleted
along with the entry — it described a state that no longer exists. The list itself is kept,
for the reason its doc comment has always given.

`validate:content` no longer prints
`note: 1 slug(s) render generated artwork: etchmiadzin-cathedral`. The article no longer
renders `PlaceholderImage` in its hero.

One thing worth recording so it is not mistaken for a leftover: the article's HTML still
contains three `<svg role="img">` elements. They are the `relatedFigures` portrait
placeholders for Gregory the Illuminator, Trdat III and Vahan Mamikonian — a different
feature with no artwork of its own, and Khor Virap's page has the same for its two figures.
The *hero* placeholder is gone, which is what was asserted.

### Verified from the prerendered output

Checked directly in `.next/server/app/{en,hy,hyw}/places/etchmiadzin-cathedral.html` — all
three editions resolve the same registered file:

| Check | `en` | `hy` | `hyw` |
|---|---|---|---|
| Hero renders `etchmiadzin-cathedral.webp` | ✓ | ✓ | ✓ |
| `og:image` → `https://armat.site/images/places/etchmiadzin-cathedral.webp` | ✓ | ✓ | ✓ |
| `twitter:image` → same absolute URL | ✓ | ✓ | ✓ |
| Canonical unchanged (`/{locale}/places/etchmiadzin-cathedral`) | ✓ | ✓ | ✓ |
| Three `hreflang` alternates plus `x-default`, unchanged | ✓ | ✓ | ✓ |

JSON-LD is unchanged in shape: the `@graph` is still `Organization, WebSite, Article,
BreadcrumbList`, and `Article.image` is now
`{"@type":"ImageObject","url":"https://armat.site/images/places/etchmiadzin-cathedral.webp"}`.
No `Place`, `TouristAttraction`, `Church` or `LocalBusiness` node was introduced — all four
were checked explicitly and all four are absent.

The sitemap carries the image once per locale route, three entries in total, matching Khor
Virap's pattern.

### Tests

`places.spec.ts` goes from 24 to 25. The work was mostly *inversion* rather than addition,
because four existing tests asserted the absence of this artwork and would have kept passing
against a broken registration only by being wrong.

Restructured rather than duplicated: an `ARTWORK` map now holds the expected path per slug,
and the hero, social-tag, JSON-LD, sitemap and search-thumbnail tests all loop over both
places. A third place is covered by adding one line to that map.

- **Inverted.** "a place with no artwork renders the placeholder and claims no provenance"
  and "a pending place falls back to the site card for Open Graph" both described the old
  state and are gone. The hero test now asserts the opposite for both slugs: the registered
  file renders, no `svg[role="img"]` remains in the hero, and the AI-illustration caption is
  present.
- **Listing.** Previously asserted that *every* image was Khor Virap's — true only while the
  second article had none. It now asserts both files appear, that nothing outside `ARTWORK`
  leaked in, and that no card falls back to the placeholder.
- **New — pending-artwork integrity.** `PENDING_ARTWORK` is empty, and no slug is both
  registered and pending. An entry left behind after its file landed would keep a real cover
  off the page silently.
- **New — no unrelated artwork changed.** Pins Khor Virap's PNG, checks every other entry is
  still a WebP under its own category directory, and asserts only the two places live under
  `/images/places/`.
- **New — the homepage.** `/hy` still renders `hero-ararat.png` and does not pick up the new
  places artwork.

Two of these failed on their first run, and both were faults in the new tests rather than in
the product. They are recorded because each encodes something about this repository that was
not obvious:

1. The search-thumbnail test took the first image on `/en/search?q=Etchmiadzin` and got
   `adoption-of-christianity.webp`. That is correct behaviour — the history article
   legitimately ranks above the place — so the test now scopes to the result card containing
   a link to `/en/places/etchmiadzin-cathedral`.
2. The registry test asserted every file is named after its slug. **That is not a convention
   here**: `mesrop-mashtots-armenian-alphabet` maps to `mesrop-mashtots.webp` and
   `first-republic-of-armenia` to `first-republic-armenia.webp`, both long-standing and both
   correct. The assertion was removed and a comment records why, so it is not reintroduced.

### Verification

| Command | Result |
|---|---|
| `npm run typecheck` | PASS, 0 errors |
| `npm run validate:content` | PASS — 105 entries, **no pending-artwork note** |
| `npx playwright test --project=desktop places.spec.ts` | **25/25** |
| `npx playwright test` | **173 passed, 5 skipped, 0 failed** |
| `npm run build` | PASS — 111 pages, all nine Places routes prerendered |

Page and entry counts are unchanged from §31, as expected: registering artwork adds no route
and no content entry.

**A second false failure, worth recording beside §30's stale-server one.** The first full
run of the suite in this pass collapsed — 7 passed, 166 failed, 7.8 minutes — with the
WebServer log carrying 513 copies of
`SyntaxError: Unexpected non-whitespace character after JSON at position 1344`. Nothing was
wrong with the code: `next build` and `next dev` share the `.next` directory, the full suite
was started immediately after `npm run build`, and the dev server read a cache the build had
just rewritten underneath it. The tell is the shape of the failure — a genuine regression
from a one-line registry change cannot break the newsletter form, the contact form and the
mobile drawer at once.

The fix is to delete `.next` and re-run, after which the suite passed 173/5 in 1.4 minutes.
The ordering rule that avoids it: **run the Playwright suite before `npm run build`, or clear
`.next` between them.** Both failure modes now on record — a stale dev server adopted through
`reuseExistingServer` (§30) and a build-clobbered cache (here) — produce mass failures that
look nothing like the change under test.

### Preserved, and checked rather than assumed

`public/hero-ararat.png` and `public/images/places/khor-virap.png` both still hash to
`2d7420356bbe4188…3391a47c` at 1,471,530 bytes — the value §30 recorded, unchanged. `git
status` shows the only additions under `public/` to be the new WebP itself. The homepage,
`Hero.tsx`, the History, Writers, Works and Cuisine artwork, `ARTWORK_PROVENANCE` and the
image layout components were not modified. `.claude/settings.json` was not touched in this
pass.

### Still open

- **A dedicated Khor Virap image.** Now the only place still using borrowed artwork, and the
  contrast is sharper than it was: one place has a purpose-made 242 KB WebP of its own
  subject, the other has a 1.4 MB PNG copied from the homepage hero. Same one-line fix.
- **Western Armenian native review**, unchanged from §31.
- **Nothing links *to* either place yet** — `getRelatedArticles` remains one-directional.

No deployment was performed.

---

## 33. Places — Erebuni Fortress, and the first new place type (August 2026)

Places goes from two articles to three, and from two filter pills to three.
`erebuni-fortress` is complete in `hy`, `hyw` and `en`, is the first article under the new
`historical` type, and ships **without artwork on purpose**. No new component, no new field,
no schema change: `PlaceDetails`, `regionId` and category-specific relationship fields were
all considered and none was added.

### Why this article

The first two places are both monasteries and both rest on the same fifth-century narrative
source. Erebuni is deliberately the opposite case on every axis: it predates that tradition
by a millennium, it is not a religious building, it is a ruin rather than a working
institution, and its central document is a contemporary inscription rather than a later
account. That is what makes it the article that earns a second filter — and what makes it
the section's clearest exercise in separating kinds of evidence.

It also closes a loop the archive already opened. §23's `kingdom-of-urartu` article names
Erebuni four times and hands Yerevan its foundation date in passing; this is the page that
was implied by those sentences.

### The new filter

`placeTypes` becomes three entries in every edition, ids shared and only labels translated:

| Id | `en` | `hy` | `hyw` |
|---|---|---|---|
| `all` | All places | Բոլոր վայրերը | Բոլոր վայրերը |
| `monastery` | Monasteries and churches | Վանքեր և եկեղեցիներ | Վանքեր եւ եկեղեցիներ |
| `historical` | Historical sites | Պատմական վայրեր | Պատմական վայրեր |

`museum`, `nature` and `settlement` were **not** added. The discipline §28 set — a type id
arrives in the same change as the first article that uses it, never ahead of one — is
enforced by `validateFilterCoverage`, which fails the build on a pill matching no content.
The three files' header comments were updated to say three entries rather than two, so the
comment does not drift from the list beneath it.

The counts this produces, asserted in tests: **All → 3, Monastery → 2 (Khor Virap,
Etchmiadzin), Historical → 1 (Erebuni only)**. The Monastery pill genuinely narrows for the
first time. Khor Virap remains the sole `featured: true` place, and the listing
implementation was not touched — no slug is hardcoded anywhere in the filtering path.

### The article

Eight sections, the same ids in all three editions: `where-it-is`,
`argishti-and-the-inscription`, `erebuni-and-urartu`, `inside-the-citadel`, `excavations`,
`after-urartu`, `the-name-and-the-city`, `before-you-see-it`. Paragraph counts per section
are `3,3,3,4,3,3,3,3` in all three; six `keyFacts`, six `importantDates`, five
`interestingFacts`, two `relatedFigures`, two `significance` paragraphs — identical
cardinalities, checked before the validator ever ran.

### The four kinds of claim, kept apart

This is the article's organising idea and it is stated outright in its final section. Four
different sorts of statement are made about Erebuni and they are not equally firm:

1. **What the inscription records.** A basalt block in Urartian cuneiform states that
   Argishti, son of Menua, built the fortress by the greatness of the god Khaldi, proclaimed
   it *Erebuni* for the might of the land of Biainili and to hold enemy lands in awe, and
   that the ground was waste before. The foundation texts also record six thousand six
   hundred warriors settled there from two conquered lands. This is the only category
   written down by people who were present.
2. **What archaeology interprets.** That one range of rooms is a palace and another a
   temple; the storage economy read off the magazine capacity; the identification of the
   *susi* tower-temple. The article says in as many words that the room names are a reading
   built from plan, contents and comparison, not a label the Urartians left.
3. **What linguistics reconstructs.** Yerevan ← Erebuni is the standard derivation and is
   accepted in Armenian scholarship, but it is a reconstruction rather than a documented
   succession of spellings, and scholars have disagreed about the Urartian word's own
   meaning. The article's formulation — "the name of the city is generally derived from
   Erebuni" — is deliberately the safe one.
4. **What the modern city does with it.** Yerevan's 2750th anniversary in 1968, the
   museum-reserve opened for that anniversary, the district, the festival. Symbolism dated
   to the twentieth century, resting on a genuinely ancient object.

**Three popular claims were deliberately not made.** That Yerevan is "older than Rome" as an
unqualified boast (it appears in §23 attributed to the city's own reckoning, and is not
repeated here as the archive's voice); that the hill has been continuously inhabited into
the modern city — the article says plainly that nobody has lived on Arin Berd for a very
long time; and any single dramatic cause for Erebuni's decline. Livius reports an earthquake
under Rusa II, the excavation literature reports a shift of administrative weight to
Teishebaini; the article says the evidence supports the shift better than it supports one
cause.

### Dates, and one that is *not* on the stone

The most important accuracy decision in this step: **782 BC is not written on the
inscription.** It comes from placing the foundation inside Argishti I's reign, which is
itself dated by synchronism with Assyrian records. Every edition says so explicitly, in the
summary, in a section and in an `interestingFact`. The year is kept because it is directly
supported — Zimansky's handbook for the chronology, the museum-reserve for the institutional
use of it, and the internal check that Yerevan's 2750th anniversary fell in 1968 — but it is
presented as a scholarly reconstruction rather than a reading.

Everything else is deliberately broad. Later phases, the decline and the end of the kingdom
are given as **Eighth / Seventh / Sixth century BC** rather than years. The only exact modern
dates are **1950** (excavation begins; the museum-reserve and multiple independent sources
agree) and **1968** (the museum opens, the 2750th anniversary).

**Dating conventions follow the existing project convention per edition, not the task
wording.** `en` uses `BC` because that is what `history.ts` and the two existing place
articles use throughout — `BCE` appears nowhere in this repository and introducing it in one
article would be the mixing §4 warns against. `hy` uses `մ.թ.ա. 782 թ.`, `hyw` uses
`782 Ք.Ա.` in `importantDates` and `Ք.Ա. 782` in prose, both inherited from
`kingdom-of-urartu`. Centuries are Roman in the Armenian editions (`Մ.թ.ա. VIII դար`,
`Ք.Ա. VIII դար`) and spelled out in English, which keeps them out of the number check by
design.

`6600` is written as words — *six thousand six hundred*, *վեց հազար վեց հարյուր*,
*վեց հազար վեց հարիւր* — matching the house style ("roughly five hundred years") and, not
incidentally, keeping a thousands-separator disagreement out of `validateCrossLocaleNumbers`.

Cross-locale number parity was verified field by field before running the validator. The
sets are identical in all three editions: `intro` {782}, `summary` {782}, `seoTitle` {782},
`metaDescription` {} , `keyFacts` {782, 1968}, `importantDates` {782, 1950, 1968, 2750},
`sections` {782, 1950, 1968, 2750}, `interestingFacts` {782, 1968, 2750},
`relatedFigures` {786, 764, 810}.

### Sources

Six, all verified. Four are works the repository had already registered for
`kingdom-of-urartu`, reused verbatim on purpose — the fortress and the kingdom rest on one
body of evidence, and a parallel set of citations would imply corroboration that does not
exist.

| Source | Identifier | Cited for | Status |
|---|---|---|---|
| Salvini, *Corpus dei testi urartei* | ISBN 9788878900257 | what the inscription says, and that it carries no year | already registered |
| Zimansky, *Ancient Ararat: A Handbook of Urartian Studies* | ISBN 9780882060910 | Urartian chronology; the reconstruction behind 782 BC | already registered |
| Piotrovsky, *The Ancient Civilization of Urartu* | `search.worldcat.org/title/22421` | Teishebaini at Karmir Blur | already registered |
| Kroll, Gruber, Hellwag, Roaf & Zimansky (eds.), *Biainili-Urartu*, Acta Iranica 51 | ISBN 9789042924383 | fortress system, citadel building types, end of the kingdom | **new, verified against the Peeters catalogue** |
| Deschamps, *Erebuni in the context of Urartean fortresses in the Ararat plain* | DOI 10.1016/j.quaint.2015.08.056 | excavation history since 2008; what the archaeology does and does not establish | **new, verified via Crossref** |
| Erebuni Historical and Archaeological Museum-Reserve | `erebuni-museum.mus.am/en/` | the institution, its holdings, the date it uses | **new, fetched and verified** |

The two new bibliographic records were checked before being written: the Peeters catalogue
confirms *Biainili-Urartu* (Acta Iranica 51, Leuven 2012, ISBN 9789042924383) and Crossref
confirms Deschamps, *Quaternary International* 395 (2016), 208–215. `erebuni.am` does not
resolve; the museum-reserve's page on the Armenian state museum portal does, and that is what
is registered. **No page references are cited, and nothing was invented** — no title, author,
publisher, year, ISBN, DOI or URL. The institutional source's `note` restricts it to what an
institution is reliable about, exactly as §31's Mother See entry does.

Screened against the §19 rule: no denialist or hostile material, and no source was accepted
on the strength of a well-formed identifier alone.

### Coordinate

One locale-independent entry in `src/data/geo.ts`, in the existing provenance style:

```ts
"erebuni-fortress": { lat: 40.1403, lon: 44.5381, precision: "site" },
```

Verified against **OpenStreetMap way 445380061** (`Էրեբունու ամրոց`,
`historic=archaeological_site`), which gives `40.1403049, 44.5381466`; rounded to four places
on the way in, as the file requires. Wikipedia's infobox agrees at 40°08′26″N 44°32′17″E.

**The point is the excavated citadel on Arin Berd**, and this slug had more convincing wrong
answers available than either previous entry: the museum-reserve at the foot of the hill, the
Erebuni city district, central Yerevan, and — the worst of them — Erebuni airport, which is
several kilometres west-south-west and would still drop a pin on a plausible part of the
city. Tests assert the recorded point is more than 0.03° from the airport's longitude and
more than 0.02° from central Yerevan's latitude, because the validator deliberately has no
bounding box and cannot catch a plausible-but-wrong point.

### Related content

`relatedSlugs: ["kingdom-of-urartu"]`, identical in all three editions, and one contextual
`SectionLink` in `erebuni-and-urartu` on a phrase that occurs in that section's prose
(`kingdom of Urartu, centred on Tushpa by Lake Van` /
`Ուրարտուի թագավորությունը, որի կենտրոնը Տուշպան էր Վանա լճի ափին` /
`Ուրարտուի թագաւորութիւնը, որուն կեդրոնը Տուշպան էր Վանայ լիճին եզերքը`).

Nothing else was added. Khor Virap and Etchmiadzin are related to each other and to the
conversion; Erebuni is not substantively related to either beyond both being places, and
padding `relatedSlugs` to make the block look fuller would be exactly the kind of
unsupported claim §28 forbids.

**`kingdom-of-urartu` was not edited to add a backlink.** The one-directional gap recorded in
§31 now applies to three places instead of two.

### Artwork — pending, and honestly so — ✅ RESOLVED IN §34

> **This section is a historical record. The artwork has since landed.** §34 registered
> `public/images/places/erebuni-fortress.webp`, a 1586×992 WebP that depicts the excavated
> citadel on Arin Berd, and `PENDING_ARTWORK` is empty again. The reasoning below is kept
> because it is *why* nothing was stretched to fit in the meantime — the placeholder was the
> correct state, not a gap left by accident.

**No artwork ships with this article.** `public/` was inspected and holds exactly one
candidate: `images/history/kingdom-of-urartu.webp`, the illustration made for the §23 history
article. It was opened and rejected. It depicts an imagined Urartian fortress-city — a
generic citadel under a snow-capped peak — not the excavated hilltop at Arin Berd, and using
it here would put a made-up skyline under a caption naming a specific archaeological site.
That is precisely the "generic illustration for a related topic" case §31 rejected for
Etchmiadzin.

So `erebuni-fortress` is declared in `PENDING_ARTWORK` with the reasoning recorded beside it,
`ArticleLayout` renders the generated placeholder, `isGeneratedArtwork` stays false, and the
caption reads *placeholder* rather than *AI-generated illustration*. `validate:content` prints
`note: 1 slug(s) render generated artwork: erebuni-fortress` on every run. **No image was
generated, copied, renamed or fabricated in this step**, and no existing file under `public/`
was touched.

### SEO

Dedicated `seoTitle`, `metaDescription` and `summary` in all three editions; the H1 continues
to render `title`. Lengths clear the validator's budgets with room: `seoTitle` 42/39/38
characters against a 52 limit, `metaDescription` 154/155/148 against 70–165, `summary`
128/96/98 words against 40–140.

| Edition | `title` | `seoTitle` |
|---|---|---|
| `en` | Erebuni Fortress | Erebuni Fortress: Urartian Yerevan, 782 BC |
| `hy` | Էրեբունի ամրոց | Էրեբունի՝ մ.թ.ա. 782 թ. ամրոցը Երևանում |
| `hyw` | Էրեբունի բերդ | Էրեբունի՝ Ք.Ա. 782-ի բերդը Երեւանի մէջ |

Structured data is the existing generic `Article` + `BreadcrumbList` graph. **No `Place`,
`TouristAttraction`, `ArchaeologicalSite`, `LandmarksOrHistoricalBuildings`, `LocalBusiness`
or `Church` node is emitted**, and the test now checks all six names — Erebuni is where the
temptation would be strongest, since it has a coordinate in the registry and is a named
archaeological site.

### Tests

`places.spec.ts` goes from 25 to 29 tests. Existing tests were extended rather than
duplicated: card counts moved from 2 to 3, the per-locale loop opens all three articles, the
SEO/canonical/hreflang test covers nine routes, the sitemap test covers nine article URLs,
and the fallback test adds `Erebuni Fortress` to the English-leakage list.

The structural change worth noting is the split of `PLACES` into `PLACES` (all three) and
`ILLUSTRATED` (the two with covers). Artwork assertions run over `ILLUSTRATED`; asserting
provenance for a slug that has none would be asserting a fiction. Moving Erebuni's cover in
later is moving one slug between two lists.

Four tests are new:

1. **The historical filter returns Erebuni and nothing else**, and clearing it returns all
   three. `validate:content` catches a filter matching nothing; only a rendered listing
   catches a filter matching the *wrong* article.
2. **The filter vocabulary is exactly `all, monastery, historical` in every edition**, labels
   filled and never equal to the raw id, plus the assertion that exactly one article carries
   `placeTypeId: "historical"`.
3. **The article hero falls back to the placeholder while the artwork is pending** — inline
   `<svg role="img">`, no raster `<img>`, and the *placeholder* caption rather than the
   AI-illustration one. The guarded failure is not a missing picture, which is the declared
   state, but a page claiming one.
4. **Global search finds the third place under the Places group.** Scoped by href rather than
   by title, because "Erebuni" legitimately also matches the Urartu history article.

Three existing tests gained assertions specific to this step: the listing must render exactly
one placeholder and must not serve `kingdom-of-urartu.webp` to any card; the registry test
pins Etchmiadzin's WebP by name and re-asserts the Urartu illustration is still filed under
history; and the coordinate test pins Erebuni away from the airport and the city centre.

### Western Armenian — written, not converted

The `hyw` article was written in Western Armenian: classical orthography throughout
(`-ութիւն`, `-ուած`, spelled-out `եւ`), Western verb forms (`կը`/`կ՚`, `մը`/`մըն`,
`կու տայ`, `կ՚արձանագրէ`), and Western vocabulary choices (`բերդ` rather than `ամրոց`,
`մթերանոց` rather than `պահեստ`, `կեդրոն`, `պրոնզ`, `պազալթ`), each inherited from the
existing `hyw` Urartu article rather than invented here. The validator enforces orthography
mechanically — `և` and `ություն` fail the build — but cannot check grammar or register, so
the following are flagged for native review:

- **The whole article**, as with every `hyw` text since §16.
- **Proper names**: `Էրեբունի`, `Արին բերդ`, `Արգիշտի Ա.`, `Մենուա`, `Ուրարտու`, `Բիայնիլի`,
  `Խալդի`, `Տուշպա`, `Արգիշտիխինիլի`, `Թէյշեբաինի`, `Կարմիր բլուր`, `Երեւան`, and the two
  modern scholars newly transliterated here — `Միրյօ Սալվինի` and `Կոնստանտին Յովհաննիսեան`.
  These last two are the weakest points in the file.
- **Archaeological and Urartological terminology** specifically: `միջնաբերդ`, `բերդ`,
  `սեպագիր արձանագրութիւն`, `պեղում`, `հնագէտ`, `որմնանկար`, `մթերանոց`, `սիւնազարդ դահլիճ`,
  `աշտարականման տաճար` and the transliterated `«սուսի»`. Western Armenian archaeological
  register is not well represented in the repository and a diaspora reader will notice a
  wrong choice immediately.
- **`աքեմենեան`** and **`սատրապութիւն`**, both new to the `hyw` edition.

### Verification

Run in the order §32 established, to avoid the `.next` race: port 3002 checked clear,
typecheck, validator, the places spec, the full suite, then the build.

| Command | Result |
|---|---|
| `npm run typecheck` | PASS, 0 errors |
| `npm run validate:content` | PASS — **108 entries** (was 105), with `note: 1 slug(s) render generated artwork: erebuni-fortress` |
| `npx playwright test --project=desktop places.spec.ts` | **29/29** |
| `npx playwright test` | **177 passed, 5 skipped, 0 failed** |
| `npm run build` | PASS — **114 pages** (was 111), all twelve Places routes prerendered |

The three new pages are `{hy,hyw,en}/places/erebuni-fortress`. No stale-server or
build-clobbered-cache failure occurred in this pass; the ordering rule held.

### Preserved, and checked rather than assumed

`public/images/places/khor-virap.png` still hashes to `2d7420356bbe4188…3391a47c`, the value
§30 recorded, and is still byte-identical to `public/hero-ararat.png`.
`public/images/places/etchmiadzin-cathedral.webp` is unchanged. `git status` shows **no
additions or modifications under `public/` at all** — the eleven changed files are the nine
under `src/`, one spec under `tests/`, and this document. The homepage, `Hero.tsx`,
`ARTWORK_PROVENANCE`, the
listing and article components, the History/Writers/Works/Cuisine content and the Khor Virap
and Etchmiadzin articles were not modified. `.claude/settings.json` was not touched.

### Still open

- ~~**Artwork for Erebuni Fortress.**~~ ✅ **Cleared in §34.** A place-specific WebP of the
  citadel on Arin Berd landed and was registered; it lit up the hero, card, search thumbnail,
  OG image, JSON-LD image and sitemap entry in one line, exactly as predicted.
- **A dedicated Khor Virap image**, unchanged from §32.
- **Western Armenian native review**, per the list above. This adds to the queue from §16,
  §28, §29 and §31.
- **Nothing links *to* any place yet.** `getRelatedArticles` is one-directional and no
  History article lists a place among its `relatedSlugs` — including `kingdom-of-urartu`,
  which this step deliberately did not edit.
- **The remaining place types.** `museum`, `nature` and `settlement` still wait for their
  first articles, and will arrive with them.

No deployment was performed.

---

## 34. Erebuni Fortress artwork — the pending entry, cleared (August 2026)

The one real debt §33 opened is paid, and this is the second time the Places section has run
the same play. `public/images/places/erebuni-fortress.webp` now exists, is registered in
`IMAGES`, and the slug is out of `PENDING_ARTWORK`. Nothing else changed: no image was
generated, edited, cropped, resized, recoloured, renamed, optimised or replaced, and no
layout component, provenance rule, article, coordinate, filter or existing artwork entry was
touched.

### The asset, verified rather than assumed

The file was opened and inspected, not trusted on its filename.

| Property | Value |
|---|---|
| Path | `public/images/places/erebuni-fortress.webp` |
| Format | Valid RIFF/WebP — `RIFF` … `WEBP`, chunks `VP8X` (10 B), `ICCP` (456 B), `VP8 ` (759,718 B) |
| Dimensions | **1586 × 992** (read from the `VP8X` canvas fields, not from a filename or a caption) |
| File size | **760,220 bytes** (742 KB) |
| SHA-256 | `3b31e9dbb7672e48bfbfb3407b37c7353330555f929b9fb9f405b07a3b1aa26f` |
| Alpha / animation | Neither — flags byte `0x20`, ICC only |

**Subject.** An excavated hilltop citadel seen from above: restored stone-and-mudbrick wall
lines at foundation level laying out a legible plan of rooms, ranges and a central courtyard,
with a modern city spreading across the middle distance on one side, dry hills on the other,
and small human figures for scale. This is Erebuni on Arin Berd as the article describes it,
not a generic Urartian citadel — the modern city below is what makes it site-specific, and it
is precisely the picture `kingdom-of-urartu.webp` is not. The §33 article's own line — *"a
site at foundation level, not a standing fortress: the interest is in the plan, the setting
and the view"* — reads as a caption for it.

**Crop suitability.** The card uses `aspect-[16/9]` (`aspect-[4/3]` in the compact variant)
and the hero steps `4/3 → 3/2 → 16/9`, all with `object-cover object-center`. The source is
≈16/10, so a 16/9 crop trims sky at the top and roadway at the bottom, and a 4/3 crop trims
the outer city edge and the right-hand hillside. The citadel occupies the centre and
centre-right and survives every one of those crops intact. No focal-point override was
needed; `PORTRAIT_FOCUS` remains writers-only.

**Two observations, neither a defect and neither acted on.** At 742 KB this is the heaviest
WebP in the registry by a wide margin — the next largest is `david-of-sassoun.webp` at 428 KB
and the median is around 150 KB — though it is still half the weight of Khor Virap's 1.4 MB
PNG. And it is the only file in the registry carrying an embedded ICC profile; every other
WebP has none. Both are recorded in the `IMAGES` comment so the next editor does not
rediscover them, and **neither was "fixed"**: the instruction not to optimise the asset is
the same rule §30 and §32 followed, and a re-encode would change the hash this document
records.

### Media registry

One line, in the existing map, reached through the existing `getImageSrc`:

```ts
"erebuni-fortress": "/images/places/erebuni-fortress.webp",
```

No Erebuni-specific loading path exists. Every consumer already asks `getImageSrc` or
`getArticleImageSrc`, so this single entry reached the listing card, the article hero, the
search-result thumbnail, related-article cards, `og:image`, `twitter:image`, the Article
JSON-LD `image` and the sitemap image entries without any of those call sites being edited.

The `IMAGES` comment was extended to note that Erebuni is 1586×992 like the rest — so the
older "the only entry here that is not 1586×992" line still refers to Khor Virap alone — and
to record the size and ICC observations above.

### Provenance

Unchanged, and inherited rather than restated. `ARTWORK_PROVENANCE` was not modified and no
per-image provenance was introduced. The article declares no `image: { src, alt, credit }`, so
`isGeneratedArtwork("erebuni-fortress")` is now `true` and `ArticleLayout` takes the
AI-illustration branch — the same branch Cuisine and the other two places use, and not the
portrait branch, because a place is a scene rather than a likeness.

Checked directly in the prerendered HTML rather than only through the test: the figcaption on
`/en/places/erebuni-fortress` reads *"AI-generated illustration for Erebuni Fortress — an
imagined scene."* and the placeholder caption is gone. `<header>` contains no
`svg[role="img"]`; the two remaining `role="img"` elements on the page are the `relatedFigures`
portrait placeholders for Argishti I and Menua in `<main>`, which is their normal state and
was not changed.

### Pending-artwork removal

`PENDING_ARTWORK` is `[]` again — the file was verified and registered first, then the entry
removed, in that order. `validate:content` no longer prints
`note: 1 slug(s) render generated artwork: erebuni-fortress`, and no other slug took its
place: every article in the archive now resolves to a registered file.

§33's artwork section is marked ✅ RESOLVED IN §34 with a blockquote at its head, and its
"Still open" entry is struck through, so no contradictory current-state statement is left
behind. The reasoning for the original refusal is deliberately preserved: rejecting
`kingdom-of-urartu.webp` was the correct call, and the record of *why* is what stops the same
shortcut being taken next time.

### Verified surfaces

| Surface | Evidence |
|---|---|
| Places listing card | Listing test: all three registered files present, no `svg[role="img"]` anywhere in `<main>` |
| Article hero, all three editions | Hero test now loops `LOCALES × ILLUSTRATED` — nine page loads |
| Search result card | Scoped to the `<li>` containing `a[href="/en/places/erebuni-fortress"]`, never `.first()` |
| Related-article cards | Same `ArticleCard` component as the listing; one lookup covers both |
| `og:image` | `https://armat.site/images/places/erebuni-fortress.webp` — read out of the built HTML |
| `twitter:image` | same absolute URL |
| Article JSON-LD | `Article.image` = `{ "@type": "ImageObject", url: …/erebuni-fortress.webp }` |
| Sitemap | All three locale URLs carry the image; confirmed by calling `sitemap()` directly |

The JSON-LD node census on the built page is `WebSite`, `Organization`, `Article`,
`BreadcrumbList`, `ListItem`, `Person`, `Book`, `CreativeWork`, `ImageObject` — **no `Place`,
`TouristAttraction`, `ArchaeologicalSite`, `LandmarksOrHistoricalBuildings` or
`LocalBusiness`**. The only JSON-LD change in this pass is the generic `Article.image`
resolving to a real file instead of nothing.

### Tests

`places.spec.ts` stays at **29 tests**: one was retired and one added, and the rest were
extended rather than duplicated.

- `EREBUNI` moved into `ILLUSTRATED` and gained its `ARTWORK` entry. The `PLACES` /
  `ILLUSTRATED` split from §33 was **kept** even though the two lists now have the same
  members: the section has been in the split state twice, and each time the fix was to move
  one slug between two lines. A comment says so, so it is not "simplified" away.
- **Retired:** the §33 placeholder-branch test. It asserted the opposite of the current
  state and could not simply be inverted.
- **Added:** a registry/pending mutual-exclusion test, checked across the whole repository in
  both directions rather than only for places. `validate:content` catches a pending slug that
  already has a file; nothing caught the reverse.
- **Extended:** the hero test now runs every edition, not just `hy`, and additionally asserts
  the caption is *not* the placeholder wording — the failure mode where a picture renders
  without its disclosure. The search-thumbnail test gained the Erebuni query, scoped by href
  because "Erebuni" legitimately also matches the Urartu history article and ranks it higher.
  The listing test went from "one honest placeholder" to none. The registry test now pins
  **all twenty-three non-places entries by exact path in a single object comparison**, which
  is the only assertion that would catch a History or Cuisine path being retyped in passing.
  The homepage test now checks it picks up neither places file.

### Verification

Run in the prescribed order. Port 3002 was confirmed clear first, and `.next` **was** removed
before Playwright — the previous pass ended with `npm run build`, which is exactly the
build-clobbered-cache setup §32 documented.

| Command | Result |
|---|---|
| `npm run typecheck` | PASS, 0 errors |
| `npm run validate:content` | PASS — 108 entries, **no pending-artwork note** |
| `npx playwright test --project=desktop places.spec.ts` | **29/29** |
| `npx playwright test` | **177 passed, 5 skipped, 0 failed** |
| `npm run build` | PASS — 114 pages, all twelve Places routes prerendered |

Page and entry counts are unchanged from §33, as expected: registering artwork adds no route
and no content entry.

**A third false-failure shape, and it is worth adding to the list.** The first full-suite run
after clearing `.next` reported 41 failed / 136 passed in 8.2 minutes; a second run on the
same code gave 1 failed / 176 passed in 5.9 minutes; a third, once the dev server was warm,
gave 177/5/0 in 5.0 minutes. Nothing changed between them. The cause is not the §30 stale
server or the §32 clobbered cache but the plainest version of the same family: **three
parallel workers hitting a dev server that is compiling every route on demand for the first
time**, against a 30-second per-test budget. The last straggler was
`brand.spec.ts › [hy] no page … still shows the former brand`, which visits eight routes in
one test and whose own comment already predicts this; it passes in 40 s when run alone.

The rule that follows: after wiping `.next`, the first suite run is a warm-up, not a result.
Three failure modes now on record — stale adopted server (§30), build-clobbered cache (§32)
and cold-compile contention (here) — and all three produce mass reds that look nothing like
the change under test.

### Preserved, and checked rather than assumed

| File | SHA-256 | Status |
|---|---|---|
| `public/hero-ararat.png` | `2d7420356bbe4188…3391a47c` | unchanged, still §30's value |
| `public/images/places/khor-virap.png` | `2d7420356bbe4188…3391a47c` | unchanged, still byte-identical to the hero |
| `public/images/places/etchmiadzin-cathedral.webp` | `0c59237291cbf76a…82338a5e` | unchanged |
| `public/images/places/erebuni-fortress.webp` | `3b31e9dbb7672e48…3b1aa26f` | the new file, as delivered |

`git status` shows exactly three entries: `src/lib/media.ts` and `tests/e2e/places.spec.ts`
modified, and the new WebP untracked. The Erebuni article content, `src/data/geo.ts`, the
`placeTypes` filters, `sources.ts`, navigation, listing behaviour, `relatedSlugs`, every
layout component, all SEO wording and the JSON-LD builders were not modified. History,
Writers, Works and Cuisine artwork is untouched and now pinned entry-by-entry in a test.
`.claude/settings.json` was not touched.

### Still open

- **A dedicated Khor Virap image.** Now the only place still using borrowed artwork, and the
  contrast is sharper again: two places have purpose-made WebPs of their own subjects, the
  third has a 1.4 MB PNG copied from the homepage hero and shown twice on a reader's first
  visit. Same one-line fix.
- **Western Armenian native review**, unchanged from §33.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional.
- **The remaining place types**, unchanged from §33.

No deployment was performed.

---

## 35. Places — the Matenadaran, and the `museum` filter (August 2026)

Places goes from three articles to four and from three filter pills to four. `matenadaran` is
complete in `hy`, `hyw` and `en`, is the sole article under the new `museum` type, and ships
**without artwork on purpose**. No new component, no new field, no schema change: `PlaceDetails`,
`regionId`, venue fields, opening hours, ticket prices, transport and map UI were all
considered and none was added.

### Why this article

The section's first three places are a monastery, a cathedral and a ruin. The Matenadaran is
the first that is primarily an *institution* — a working research body with staff, a
programme and an administrative history — and that is what earns it both the new filter and a
different shape of article. It is also the page the archive has been implying since §23: the
alphabet article names the Matenadaran three times and hands it the whole legacy of Armenian
manuscript culture in a sentence.

### The new filter

`placeTypes` becomes four entries in every edition, ids shared and only labels translated:

| Id | `en` | `hy` | `hyw` |
|---|---|---|---|
| `all` | All places | Բոլոր վայրերը | Բոլոր վայրերը |
| `monastery` | Monasteries and churches | Վանքեր և եկեղեցիներ | Վանքեր եւ եկեղեցիներ |
| `historical` | Historical sites | Պատմական վայրեր | Պատմական վայրեր |
| `museum` | Museums | Թանգարաններ | Թանգարաններ |

`nature` and `settlement` were **not** added — the §28 discipline, enforced by
`validateFilterCoverage`, that a type id arrives with the first article that uses it. The
three files' header comments were updated to say four entries rather than three.

Counts after this change, asserted in tests: **All → 4, Monastery → 2 (Khor Virap,
Etchmiadzin), Historical → 1 (Erebuni), Museum → 1 (Matenadaran)**. Khor Virap remains the
only `featured: true` place and the filtering path still hardcodes no slug.

### Terminology was inherited, not invented

Checked against the repository before a line was written, exactly as §31 did for Etchmiadzin:

| Concept | `en` | `hy` | `hyw` |
|---|---|---|---|
| The institution | Matenadaran | Մատենադարան | Մատենադարան |
| The formal name | Mesrop Mashtots Institute of Ancient Manuscripts | Մեսրոպ Մաշտոցի անվան հին ձեռագրերի ինստիտուտ | Մեսրոպ Մաշտոցի անուան հին ձեռագիրներու հիմնարկ |
| Manuscript | manuscript | ձեռագիր | ձեռագիր |
| Scriptorium | scriptorium | գրչատուն | գրչատուն |
| Illuminated | illuminated manuscript | մանրանկարազարդ ձեռագիր | ծաղկուած ձեռագիր |
| Scribe / illuminator | scribe / illuminator | գրիչ / ծաղկող | գրիչ / ծաղկող |
| Colophon | colophon (*hishatakaran*) | հիշատակարան | յիշատակարան |
| Parchment | parchment | մագաղաթ | մագաղաթ |
| UNESCO | UNESCO | ՅՈՒՆԵՍԿՕ | ԵՈՒՆԵՍՔՕ |

Every one of those Armenian forms already existed in `history.ts` or `places.ts`. The two
editions keep their own UNESCO spellings, as §31 recorded. No second English spelling of the
institution was introduced: `Matenadaran` appears in History, in the Etchmiadzin article and
now here, and the formal name is used only where it is genuinely the formal name.

### The article

Ten sections, the same ids in all three editions: `where-it-is`, `what-it-is`, `the-name`,
`before-the-institution`, `how-the-collection-moved`, `the-building-and-the-institute`,
`what-it-holds`, `inside-the-manuscripts`, `research-and-conservation`, `before-you-see-it`.
Paragraphs per section `3,3,3,3,3,4,3,4,3,3`; six `keyFacts`, eleven `importantDates`, five
`interestingFacts`, two `relatedFigures`, two `significance` paragraphs — identical
cardinalities, checked before the validator ran.

### Historical and institutional chronology — the point of the article

The central problem with this subject is that six separate events are routinely reported as
one "founded in" date, and different sources pick a different one. The article separates them
and says so outright:

1. **Manuscript culture.** From the fifth century: Mashtots's alphabet, the translation
   movement, and monastic scriptoria that copied, bound and stored books for a thousand years.
2. **The collection.** The Etchmiadzin library, growing from the restoration of the
   Catholicosate there in **1441**, catalogued repeatedly in the modern period — an inventory
   of **1828** recording a few hundred manuscripts, past four thousand by **1913**.
3. **Displacement and rescue.** Evacuated to Moscow **1915–1922**; manuscripts brought out of
   Vaspurakan, Mush and Erzurum during the Armenian Genocide.
4. **Nationalisation.** By decree in December **1920**. *Ownership changed; location did not.*
5. **Transfer.** The physical move to Yerevan in **1939** — just under ten thousand Armenian
   manuscripts and several hundred in other languages. Nineteen years after the decree.
6. **The building.** Mark Grigoryan's design, begun **1945**, halted for years, finished in
   the second half of the **1950s**.
7. **The institute.** Reorganised as a scientific research institute in **1959**, moving into
   that building — the start of the modern Matenadaran in institutional terms.
8. **The name.** Given Mashtots's name in **1962**, years after it was already an institute.
9. **Recognition.** UNESCO Memory of the World Register, **1997**.
10. **Expansion.** A large new research and storage building behind the original, **2011**.

**One disagreement was left open rather than resolved.** Sources differ on the building's
completion year — the institute's own history implies 1959, other accounts give 1957/58 — so
the article says "finished in the second half of the 1950s" and dates only what is agreed:
1945 for the start and 1959 for the move-in and reorganisation. That is the §4 rule applied
rather than a gap.

**The article states in as many words that the present building is not medieval**, and
explains that its basalt, arcading and carved figures are a deliberate mid-century quotation
of Armenian church architecture. A visitor reading the facade as an old building has read it
exactly as the architect intended and exactly wrongly.

### Collection size — described, not pinned

Three reliable sources give three figures, and the article says why rather than choosing one:
UNESCO's register entry, made in **1997**, describes about **seventeen thousand** manuscripts;
the institution's own account gives roughly **twenty thousand**; totals that count fragments
and scrolls separately run higher again; and archival documents are counted in a different
series entirely, in the hundreds of thousands. None is wrong — they count different things at
different dates. All of these are spelled out as words in every edition, which keeps them out
of the cross-locale number check by design and avoids the archive committing to a number that
will be stale within a year. The §23 history article's "more than seventeen thousand" remains
true against all of them and was not edited.

Also avoided, per §5 of the brief: opening hours, ticket prices, exhibition schedules,
transport, queues, any claim that everything is displayed, and any unsupported "largest in the
world" superlative. The article says instead that it is *one of the largest collections of
Armenian manuscripts anywhere* and that no visit sees more than a fraction of it.

### Sources

Six, all verified before registration. Two are already-registered works cited again on
purpose; four are new.

| Source | Identifier | Cited for | Status |
|---|---|---|---|
| Matenadaran, *Historical Review* | `matenadaran.am/en/matenadaran/research-institute/historical-review/` | the institutional chronology only | **new, fetched and verified** |
| UNESCO Memory of the World, *Mashtots Matenadaran ancient manuscripts collection* | `unesco.org/en/memory-world/mashtots-matenadaran-ancient-manuscripts-collection` | the 1997 inscription and its figure | **new, fetched and verified** |
| Mathews & Wieck (eds.), *Treasures in Heaven: Armenian Illuminated Manuscripts* | ISBN 9780691037516 | illumination, scripts, bindings, pigments | **new, verified** |
| Sanjian, *Colophons of Armenian Manuscripts, 1301–1480* | ISBN 9780674142855 | colophons as a historical source | **new, verified** |
| Maranci, *The Art of Armenia: An Introduction* | ISBN 9780190269005 | manuscript art in the wider development of Armenian art | already registered |
| Terian (trans.), *The Life of Mashtots' by His Disciple Koriwn* | ISBN 9780192847416 | the fifth-century starting point the name refers to | already registered |

Each new record was checked rather than assumed: both URLs were fetched and their content read
(the institute's history page supplies every institutional date used; the UNESCO page supplies
the title, year and figure quoted). The Morgan/Princeton co-publication and the Harvard
Armenian Texts and Studies volume were confirmed against catalogue listings. **No page
references are cited and nothing was invented.**

Two deliberate omissions. The Encyclopaedia Iranica entry on the Matenadaran library would
have been a good scholarly addition, but the site returned 403 and its publication details
could not be confirmed first-hand, so it was not registered. And the tourism pages that
dominate a search for this subject were not used at all: several give a single confident
"founded in" date and they disagree with one another, because each has picked a different one
of the ten events above. Screened against the §19 rule: no denialist or hostile material.

### Coordinate

One locale-independent entry in `src/data/geo.ts`, in the existing provenance style:

```ts
matenadaran: { lat: 40.1925, lon: 44.5222, precision: "site" },
```

Verified against **OpenStreetMap relation 20960090** (`Երևանի Մատենադարան`, `tourism=museum`,
53 Mesrop Mashtots Avenue), which gives `40.1924614, 44.5222091`; rounded to four places on
the way in. Wikipedia's infobox agrees to within about a hundred metres at 40°11′31″N
44°31′16″E.

**The point is the building and its precinct**, not the statue of Mashtots on the terrace in
front of it, not the Cascade complex a few hundred metres west, and not Mashtots Avenue, which
runs the length of central Yerevan. This is the tightest cluster of plausible wrong answers of
any entry so far — the Cascade and the city centre are inside the same square kilometre — so
tests assert the point is more than 0.005° from the Cascade's longitude and more than 0.01°
from central Yerevan's latitude.

### Related content

`relatedSlugs: ["mesrop-mashtots-armenian-alphabet", "etchmiadzin-cathedral",
"adoption-of-christianity"]`, identical in all three editions, and two contextual
`SectionLink`s, each on a phrase that occurs in its own section's prose:

- `the-name` → `mesrop-mashtots-armenian-alphabet`, on the sentence explaining whose name the
  institute carries. This is the required link.
- `how-the-collection-moved` → `etchmiadzin-cathedral`, on "the manuscript library of
  Etchmiadzin".

None of the three is padding, and each is argued in the article rather than asserted in the
list: the alphabet is the script every object in the building is written in; Etchmiadzin is
where the collection physically was until 1939, which that article already states from its own
side; and the conversion is what created the monastic scriptoria the collection came out of.
Writers and Works were evaluated and none was added — no writer's archive is a subject of this
article, and a link on the strength of "both are about books" is exactly the padding §8 warns
against.

**No existing History, Writers or Works article was edited to add a backlink.** The
one-directional gap now applies to four places.

### Artwork — pending, and honestly so — ✅ RESOLVED IN §36

> **Superseded.** `public/images/places/matenadaran.webp` landed and was registered in §36.
> The article now renders its own cover in all three editions, `isGeneratedArtwork` is true,
> the caption reads *AI-generated illustration*, and `PENDING_ARTWORK` is empty again. The
> reasoning below is kept because the shortcut it rejects is the kind that gets taken twice —
> the Mashtots portrait is still the wrong picture for this article, and still sitting in the
> repository. The validator line quoted at the end of this section no longer prints at all,
> and its wording was corrected in §36 besides.

**No artwork ships with this article.** Every asset in `public/` was looked at, not reasoned
about. The only candidate anywhere near the subject is `history/mesrop-mashtots.webp`, and it
was opened and rejected: it is a portrait of Mashtots at a writing desk in a medieval monastic
setting, with a church and mountains behind him. The institute carries his name, which is
precisely what makes that image the wrong one — it would caption a fifth-century scene as a
twentieth-century basalt building on a Yerevan avenue, and the confusion between those two ages
is the single thing this article was written to prevent. A generic manuscript illustration, a
writer portrait and another Yerevan image were all ruled out by the same reasoning.

So `matenadaran` is declared in `PENDING_ARTWORK` with that reasoning recorded beside it,
`ArticleLayout` renders the generated placeholder, `isGeneratedArtwork` stays false, and the
caption reads *placeholder* rather than *AI-generated illustration*. `validate:content` prints
`note: 1 slug(s) render generated artwork: matenadaran` on every run. **No image was generated,
copied, renamed, cropped or fabricated**, and nothing under `public/` was touched.

Checked in the built page: `og:image` and `twitter:image` fall back to `/og-default.png`, and
`Article.image` is **absent entirely** rather than nominating the site card — see the test note
below, because that distinction cost a failed assertion to learn.

### SEO

Dedicated `seoTitle`, `metaDescription` and `summary` in all three editions; the H1 continues
to render `title`. Lengths clear the validator's budgets: `seoTitle` 44/40/45 characters
against a 52 limit, `metaDescription` 152/134/136 against 70–165, `summary` 111/86/82 words
against 40–140.

| Edition | `title` | `seoTitle` |
|---|---|---|
| `en` | Matenadaran | Matenadaran: Armenian Manuscripts in Yerevan |
| `hy` | Մատենադարան | Մատենադարան՝ հայկական ձեռագրերը Երևանում |
| `hyw` | Մատենադարան | Մատենադարան՝ հայկական ձեռագիրները Երեւանի մէջ |

The English wording targets the real search intents — *Armenian manuscript museum in Yerevan*,
*what is the Matenadaran* — through the article's own vocabulary rather than by stuffing the
institution's formal name into every field. Structured data is the existing generic `Article` +
`BreadcrumbList` graph; the built page's node census is `WebSite`, `Organization`, `Article`,
`BreadcrumbList`, `ListItem`, `Person`, `Book`, `CreativeWork`, `ImageObject` (the
organisation logo), with **no `Museum`, `Place`, `TouristAttraction`, `ArchiveOrganization`,
`ArchaeologicalSite` or `LocalBusiness`**.

Cross-locale number parity was verified field by field before running the validator; the sets
are identical in all three editions:

| Field | Numbers |
|---|---|
| `intro` | 1959 |
| `summary` | 1920, 1939, 1959, 1962 |
| `seoTitle`, `metaDescription` | — |
| `keyFacts` | 1959, 1962, 1997 |
| `importantDates` | 1441, 1828, 1913, 1915, 1920, 1922, 1939, 1945, 1950, 1959, 1962, 1997, 2011 |
| `sections` | the above plus 1301, 1480, 1994 |
| `interestingFacts` | 1920, 1939, 1962, 1997 |
| `relatedFigures` | 361, 440, 1900, 1978 |

### Tests

`places.spec.ts` goes from 29 to **32 tests**. Existing tests were extended rather than
duplicated: card counts moved from 3 to 4, the per-locale loop opens all four articles, the
SEO/canonical/hreflang test covers twelve routes, the sitemap test covers twelve article URLs,
and the English-leakage list gained `Matenadaran`.

Restored from §33 and generalised: **the placeholder-branch test**, which now runs in all
three editions and asserts both that the placeholder caption is used *and* that the
AI-illustration caption is not.

New:

1. **Each single-article filter returns exactly its own article.** Replaces §33's
   historical-only test and covers both narrow pills in one loop, asserting each excludes
   every other place. With two one-article filters side by side, the pair could otherwise be
   crossed over without either count changing.
2. **The filter vocabulary is exactly the four ids in every edition**, plus per-type
   membership: `historical` → Erebuni, `museum` → Matenadaran, `monastery` → the two churches.
3. **The pending place's metadata borrows no other article's artwork** — `og:image` and
   `twitter:image` are the site default, no sibling's file appears in any meta tag or in the
   structured data, and the hero renders no `<img>`.
4. **Global search finds the fourth place under the Places group**, scoped by href because
   "Matenadaran" also matches the alphabet article, which names it.

Extended: the listing test now expects exactly one placeholder and forbids both
`kingdom-of-urartu` and `mesrop-mashtots` from standing in for a place; the sitemap image test
now also asserts the pending place contributes **no** `image:loc` at all; the coordinate test
pins the Matenadaran away from the Cascade and the city centre.

**Two of the new assertions failed first and both were faults in the test, not the product.**
They are recorded because each encodes something true about the repository:

1. The metadata test expected `Article.image` to fall back to `/og-default.png`. It does not:
   `articleLd` omits the property entirely when there is no artwork. That is the more honest
   behaviour — an `og:image` is a link-preview card and the site default belongs there, while
   `Article.image` is a claim that a picture *depicts this article* — and the test now asserts
   the distinction instead of flattening it.
2. The same test first searched the whole document for sibling artwork paths and found
   Etchmiadzin's. Correct behaviour: this article lists Etchmiadzin in `relatedSlugs`, so that
   place's cover legitimately appears on a related-article card lower down the page. Borrowing
   is only a fault when the borrowed file is presented as *this* article's own, so the check is
   now scoped to the head metadata, the structured data and the hero.

### Western Armenian — written, not converted

The `hyw` article was written in Western Armenian: classical orthography throughout
(`-ութիւն`, `-ուած`, spelled-out `եւ`), Western verb forms (`կը`/`կ՚`, `մը`/`մըն`, `կու տայ`,
`կ՚արձանագրէ`, `չելան`), and Western vocabulary inherited from the existing `hyw` alphabet
article rather than invented here (`ձեռագիրներ`, `գրչատուն`, `ծաղկուած ձեռագիր`, `մագաղաթ`,
`հաւաքածոյ`, `դիւանական փաստաթուղթեր`). The validator enforces orthography mechanically — `և`
and `ություն` fail the build — but cannot check grammar or register, so the following are
flagged for native review:

- **The whole article**, as with every `hyw` text since §16.
- **Institutional terminology**, the weakest part here and new to the edition:
  `գիտահետազօտական հիմնարկ`, `պահոց`, `արխիւ`, `ցուցակագրում`, `վերականգնում`, `թուայնացում`,
  `լաբորատորիա`, `ընթերցասրահ`, and the formal name
  `Մեսրոպ Մաշտոցի անուան հին ձեռագիրներու հիմնարկ`. Whether `հիմնարկ` or `հիմնարկութիւն` is
  the form a diaspora reader expects for a research institute is the single question most
  worth asking.
- **Manuscript vocabulary**: `յիշատակարան`, `գրիչ`, `ծաղկող`, `մանրանկարչութիւն`,
  `լուսանցազարդ`, `խորան`, `կազմ`, `ներկանիւթ`, `դրոշմազարդ`.
- **Proper names and transliterations**: `Մարկ Գրիգորեան`, `Աւետիս Սանճեան`, `Մորկանի
  գրադարան`, `Մոսկուա`, `Կարին` (used for Erzurum, per Western Armenian usage, where `hy` has
  `Էրզրում` — a deliberate divergence worth confirming), and `Կենտրոն թաղամաս` for the Yerevan
  district.
- **`ԵՈՒՆԵՍՔՕ`** and **«Աշխարհի Յիշողութիւն»**, the Western form of the UNESCO programme name,
  which appears here for the first time.

### Verification

Run in the prescribed order. Port 3002 was confirmed clear, and `.next` was removed first
because the previous pass ended with `npm run build` — the §32 clobbered-cache setup.

| Command | Result |
|---|---|
| `npm run typecheck` | PASS, 0 errors |
| `npm run validate:content` | PASS — **111 entries** (was 108), with `note: 1 slug(s) render generated artwork: matenadaran` |
| `npx playwright test --project=desktop places.spec.ts` | **32/32** (after the two test fixes above) |
| `npx playwright test` | **180 passed, 5 skipped, 0 failed** |
| `npm run build` | PASS — **117 pages** (was 114), all twelve Places routes prerendered |

**No cold-compile rerun was needed this time.** The full suite passed on its first attempt
because the places spec had already warmed the dev server; the §34 note about the first run
after wiping `.next` being a warm-up still stands, but it did not bite here. The one failing
run in this pass was a genuine deterministic failure in two new assertions, fixed in the tests
rather than reported as a cache issue.

Checked directly in the prerendered HTML: `<title>` is the `seoTitle`, the H1 is the plain
`Matenadaran`, the canonical is `https://armat.site/en/places/matenadaran`, and all three
`hreflang` alternates plus `x-default` are present. `sitemap()` returns the three locale URLs
with no image entries.

### Preserved, and checked rather than assumed

| File | SHA-256 | Status |
|---|---|---|
| `public/hero-ararat.png` | `2d7420356bbe4188…3391a47c` | unchanged, still §30's value |
| `public/images/places/khor-virap.png` | `2d7420356bbe4188…3391a47c` | unchanged, still byte-identical to the hero |
| `public/images/places/etchmiadzin-cathedral.webp` | `0c59237291cbf76a…82338a5e` | unchanged |
| `public/images/places/erebuni-fortress.webp` | `3b31e9dbb7672e48…3b1aa26f` | unchanged, still §34's value |
| `public/images/history/mesrop-mashtots.webp` | `0803f6c68d36db9e…67a3100c` | unchanged — the file that was inspected and rejected |

`git status` shows **no additions or modifications under `public/` at all** — the eleven
changed files are the nine under `src/`, one spec under `tests/`, and this document. The Khor
Virap, Etchmiadzin and Erebuni articles, their coordinates, `IMAGES`, `ARTWORK_PROVENANCE`,
navigation, listing behaviour, every layout component, all existing SEO wording and the JSON-LD
builders were not modified. The homepage still renders `/hero-ararat.png` and picks up no
places artwork. `.claude/settings.json` was not touched.

### Still open

- ~~**Artwork for the Matenadaran.** The one real debt this section adds, and the third time
  the section has carried one. A place-specific WebP of the building on Mashtots Avenue would
  clear the note and light up the hero, card, search thumbnail, OG image and sitemap entry in
  one line.~~ — **resolved in §36.** The file landed and was registered; it was one line, and
  it did light up all six surfaces.
- **A dedicated Khor Virap image**, unchanged from §34.
- **Western Armenian native review**, per the list above. This adds to the queue from §16,
  §28, §29, §31 and §33.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional, and
  `mesrop-mashtots-armenian-alphabet` in particular now has an obvious counterpart it does not
  point at.
- **The remaining place types.** `nature` and `settlement` still wait for their first articles.

No deployment was performed.

---

## 36. Matenadaran artwork — the pending entry, cleared (August 2026)

`public/images/places/matenadaran.webp` arrived. It was verified, inspected and registered in
`IMAGES`, and the slug is out of `PENDING_ARTWORK`. Nothing else changed: no image was
generated, edited, cropped, resized, recoloured, renamed or optimised, no article content
moved, and no new loading path was introduced. Three files changed — `src/lib/media.ts`,
`scripts/validate-content.ts` and `tests/e2e/places.spec.ts` — plus the new asset and this
document.

This is the third time the section has cleared a pending entry (§32 Etchmiadzin, §34 Erebuni,
§36 Matenadaran) and the third time the whole change was a one-line registration reaching six
surfaces at once.

### The asset, verified rather than assumed

The container was parsed rather than trusted to its extension.

| Property | Value |
|---|---|
| Path | `public/images/places/matenadaran.webp` |
| Magic | `RIFF` … `WEBP`, RIFF size field 718 086 = file length − 8 (consistent) |
| Chunks | `VP8X(10)` `ICCP(456)` `VP8 (717592)` — extended container, lossy VP8 |
| Flags | `0x20` — ICC profile present; no alpha, no EXIF, no XMP, not animated |
| Dimensions | **1586 × 992** (from the VP8X canvas fields) |
| Aspect | 1.5988 : 1, i.e. 16:10 |
| File size | **718 094 bytes (701.3 KB)** |
| SHA-256 | `832689e8d9ae0781183c1b598b7529cfcbe6bcdb8007293ec6d68ba8fcbc995c` |

Identical in shape to `erebuni-fortress.webp`: same canvas, same lossy VP8, same embedded ICC
profile. At 701 KB it is the second-heaviest file in the registry behind Erebuni's 742 KB, so
the two most recent places are now the two heaviest images on the site after Khor Virap's PNG.
Not a fault, and not a reason to touch either file — but the note in `media.ts` about Erebuni
being "the only entry carrying an ICC profile" was corrected to *the first*, and the trend is
worth watching if Places keeps growing.

**The image was opened and looked at, not inferred from its filename.** It is unmistakably the
Matenadaran and nothing else: the frontal, symmetrical composition; the flat-topped basalt
block set above the city; the deep recessed arch over the entrance with its filled tympanum
grille; the paired engaged arcading either side; the six carved scholar figures standing in
their bays along the terrace; the seated statue of Mashtots with a pupil at the foot of the
steps, against the inscribed stele; the monumental staircase in three flights; the hillside
behind and the Yerevan blocks falling away to the right. Every element the article's own prose
names — "an arcaded front, carved figures of scholars and writers along the facade, and a
seated statue of Mashtots with a pupil at the foot of the steps" — is present in the picture.
It is not a generic church, not a monastery, not a fantasy library and not another museum.

**One honest discrepancy, reported and not fixed.** The façade is rendered in a pale warm grey
rather than the dark grey-black basalt of the real building — which the article describes as
"dark basalt" three separate times, in the section on the building, in the significance block
and in Mark Grigoryan's relatedFigure entry. The massing, the staircase, the elevated entrance,
the arcading and the statuary are all right; the stone reads several shades too light. **The
file was not modified, recoloured or replaced.** It is registered exactly as delivered, and the
discrepancy is recorded under "Still open" below rather than silently accepted or silently
corrected.

**Crops.** The subject is dead-centre and bilaterally symmetric, which is the easiest possible
case for `object-cover object-center`:

| Slot | Container | What the crop takes |
|---|---|---|
| Listing card | `16/9` | image is narrower, so ~5 % of height off top and bottom — sky and foreground plaza, nothing structural |
| Compact card / hero at mobile | `4/3` | image is wider, so ~8 % of width off each side — the outer trees; the building is untouched |
| Hero at `sm` | `3/2` | ~3 % off each side |
| Hero at `lg` | `16/9` | as the card |

No crop reaches the building block, the staircase or the statue in any slot.

### Media registry

One line, in the places group of the existing map:

```ts
matenadaran: "/images/places/matenadaran.webp",
```

Reached through `getImageSrc` and `getArticleImageSrc` like every other entry. **No
Matenadaran-specific loading mechanism was introduced**, no component was changed, and no
consumer was touched — which is the whole point of the registry, and why this registration
lit up the listing card, the article hero in three editions, the global-search thumbnail, the
related-article card, the Open Graph and Twitter tags, the generic `Article.image` and three
sitemap image entries without a single other edit.

### Provenance

`isGeneratedArtwork({ slug: "matenadaran" })` is now `true` — the slug is in `IMAGES` and the
article declares no content `image`, which is exactly the condition that function tests. So
`ArticleLayout` takes the illustration branch: the hero renders the raster file, the inline
placeholder `<svg role="img">` is gone, and the caption reads the locale's
`imageAiIllustrationCaption` rather than `imagePlaceholderCaption`. A place is a scene, not a
likeness, so it takes the illustration wording and not the portrait one the writers use.

`ARTWORK_PROVENANCE` is **unchanged** — still `{ source: "ai-generated", documentary: false }`
covering the whole registry. **No per-image provenance system was introduced**, and no other
slug's provenance behaviour was touched.

### Pending-artwork removal

`PENDING_ARTWORK` is `[]` again. The order was deliberate: the file was verified and registered
first, then the entry was removed — never the other way round, which would have left a window
where the archive claimed a picture it did not have.

The reasoning that put `matenadaran` on the list is kept in the comment rather than deleted
with the entry. The rejected shortcut — pointing this article at `history/mesrop-mashtots.webp`
because the institute carries Mashtots's name — is the kind that gets taken twice, and the
portrait is still sitting in the repository. §35's artwork section is headed
✅ RESOLVED IN §36 and its "Still open" entry is struck through, so no contradictory
current-state statement is left behind.

With this, **every article in the archive ships its own cover.** `PENDING_ARTWORK` has now
filled and emptied three times; the empty state is the normal end state, not a signal that the
list can go.

### Validator message — corrected wording, unchanged behaviour

The note in `validateImages` said:

```text
note: N slug(s) render generated artwork: …
```

It lists the slugs with **no** file — and "render generated artwork" is precisely what the
*registered* slugs do, since everything in `IMAGES` is AI-generated and captioned so. Read
literally the line reported the opposite of the set it was counting. It now reads:

```text
note: N slug(s) have no artwork and render the generated placeholder: …
```

**Only the sentence changed.** The set it describes, the condition that computes it and every
`report.check` in the function are untouched — no validation behaviour was altered. As it
happens the line no longer prints at all, because `missing` is now empty; it was corrected
anyway, since a message that is wrong is worse when it fires rarely.

### Verified surfaces

Checked in the built page and the running server, not assumed from the registry:

| Surface | Value |
|---|---|
| Places listing card | `/images/places/matenadaran.webp` via `ArticleCard` |
| Article hero, `hy` / `hyw` / `en` | the file, with the AI-illustration caption in each edition |
| Placeholder SVG in the hero | **absent** in all three editions |
| Placeholder caption | **absent** in all three editions |
| Global search | the card linking to `/en/places/matenadaran` carries the thumbnail |
| Related-article card | renders it wherever Matenadaran appears |
| `og:image` | `https://armat.site/images/places/matenadaran.webp` |
| `twitter:image` | `https://armat.site/images/places/matenadaran.webp` |
| `Article.image` | `{ "@type": "ImageObject", url: "https://armat.site/images/places/matenadaran.webp" }` |
| Sitemap | 3 image entries, one per locale route |
| Listing placeholders | **zero** — `main svg[role='img']` count is 0 |

JSON-LD node census on the built page: `Organization, ImageObject, WebSite, Article,
CreativeWork, Book, Person, BreadcrumbList, ListItem`. `Museum`, `Place`, `TouristAttraction`,
`ArchiveOrganization` and `LocalBusiness` are each explicitly absent. **The only structured-data
consequence of this step is the existing generic `Article.image` resolving to the registered
file** — no builder was modified.

### Tests

`tests/e2e/places.spec.ts` stays at **32 tests**; this was a state change, not new surface area,
so existing tests were extended rather than duplicated.

`MATENADARAN` moved from being excluded to being included in `ILLUSTRATED`, and gained its
`ARTWORK` entry. That one move is what carries the registration through the hero-and-provenance
loop, the OG/Twitter/JSON-LD loop and the sitemap-image loop, all of which already iterate
`ILLUSTRATED` — the two-list split kept deliberately since §31 did its job for the third time.

Rewritten rather than deleted, because an assertion with no subject left is still worth
inverting:

- *"the article hero falls back to the placeholder while the artwork is pending"* →
  **"no place renders the artwork placeholder any more"**, now looping `LOCALES × PLACES` and
  asserting zero placeholder SVGs, exactly one hero `<img>`, and that no caption still says
  *placeholder*.
- *"the pending place's metadata borrows no other article's artwork"* → **"the newest place's
  metadata borrows no other article's artwork"**. Kept because the failure it guards survives
  registration: the article's `relatedSlugs` include Etchmiadzin and the institute carries the
  name of the history article illustrated by the Mashtots portrait. What changed is the
  expected value — the site default gives way to the real cover, and `Article.image` goes from
  absent to present. The assertion is still scoped to `head meta[content]`, the JSON-LD text
  and `header figure img`, because Etchmiadzin's cover legitimately appears lower down the page
  on a related card.
- *"the pending list names the place without artwork, and only that one"* → **"nothing in the
  section is still waiting for artwork"**, asserting `PENDING_ARTWORK` is `[]` and that every
  place resolves through the registry. This is the stale-entry half of the invariant — a file
  registered with its pending entry left behind — which no other test covers.
- *"…and one honest placeholder"* → **"…and no placeholder at all"**, with the listing's
  placeholder count asserted at **0** and a new exact-count check that the listing carries
  `PLACES.length + 1` images (four cards plus the featured block's repeat).
- The sitemap block that asserted Matenadaran's three url entries contained **no** `image:loc`
  now asserts each contains its own file.
- The search-thumbnail loop gained Matenadaran, scoped by `a[href="/en/places/matenadaran"]`
  rather than `.first()` — the query also matches the History article on the alphabet, which
  names the institute in its legacy section and can legitimately rank above the place.
- *"no unrelated article artwork changed"* pins `matenadaran` by name alongside the other three
  places, and still compares all 23 non-places entries in one object equality — the only check
  that would catch a History, Writers, Works or Cuisine path retyped in passing.
- The homepage test forbids `matenadaran` alongside `etchmiadzin` and `erebuni`.

### Verification

Run in the prescribed order. Port 3002 was confirmed clear and `.next` was removed first,
because the previous pass ended with `npm run build`.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed (previous pass ended with a build) |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — 111 entries across 3 locales, and **no pending note at all**, because nothing is pending |
| 5 | `npx playwright test --project=desktop places.spec.ts` | **32 passed** |
| 6 | `npx playwright test` | **180 passed, 5 skipped, 0 failed** |
| 7 | `npm run build` | **PASS** — 117 prerendered routes, unchanged (registering artwork adds no route) |

**Every run passed first time.** No rerun was needed, nothing was retried, and no failure is
being attributed to a cache. The build was not run concurrently with Playwright's dev server.

The three documented false-failure modes (§30 stale adopted dev server, §32 build-clobbered
`.next`, §34 cold-compile contention) did not occur; step 2 is what keeps the second of them
away, and the places spec at step 5 warms the routes the full suite then reuses.

### Preserved, and checked rather than assumed

| File | SHA-256 | Status |
|---|---|---|
| `public/hero-ararat.png` | `2d7420356bbe4188…3391a47c` | unchanged, still §30's value |
| `public/images/places/khor-virap.png` | `2d7420356bbe4188…3391a47c` | unchanged, still byte-identical to the hero |
| `public/images/places/etchmiadzin-cathedral.webp` | `0c59237291cbf76a…82338a5e` | unchanged, still §32's value |
| `public/images/places/erebuni-fortress.webp` | `3b31e9dbb7672e48…3b1aa26f` | unchanged, still §34's value |
| `public/images/history/mesrop-mashtots.webp` | `0803f6c68d36db9e…67a3100c` | unchanged — the file inspected and rejected in §35, and still the wrong picture for this article |
| `public/images/places/matenadaran.webp` | `832689e8d9ae0781…fcbc995c` | **new**, byte-identical to the delivered file |

`git status` shows exactly three modified files and one addition under `public/` — the new
asset itself. The Matenadaran article content, its chronology, its sources, its coordinate, its
`placeTypeId`, the filter vocabulary, its `relatedSlugs`, navigation, listing logic, all SEO
wording, every layout component and the JSON-LD builders were **not modified**. Khor Virap,
Etchmiadzin and Erebuni keep their registrations and their files. The homepage still renders
`/hero-ararat.png` through `Hero.tsx` directly and picks up no places artwork.
`.claude/settings.json` was not touched.

### Still open

- **The façade colour.** The delivered artwork renders the Matenadaran in pale grey where the
  building — and this archive's own prose, three times over — describes dark basalt. Reported
  rather than corrected, because the rule for delivered assets is that they are registered as
  delivered. A revised file would be another one-line change.
- **A dedicated Khor Virap image**, unchanged since §32. It is still the homepage hero copied
  into the places directory, still a 1.4 MB PNG, and still the only entry not 1586 × 992.
- **File weight in Places.** Erebuni at 742 KB and Matenadaran at 701 KB are the two heaviest
  WebPs in the registry by a wide margin, both carrying ICC profiles. Nothing is being optimised
  here — noted so a future decision about it is made deliberately.
- **Western Armenian native review**, per §35's list. The queue from §16, §28, §29, §31, §33
  and §35 is unchanged by this step.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional.
- **The remaining place types.** `nature` and `settlement` still wait for their first articles.

No deployment was performed.

---

## 37. Places — Lake Sevan, and the `nature` filter (August 2026)

The fifth place, and the first that is not a building. `lake-sevan` is authored in all three
editions, `placeTypes` gains `nature`, and the section is back in the split state: the article
ships ahead of its artwork, so `PENDING_ARTWORK` is non-empty for the fourth time (§31, §33,
§35, §37).

Being a lake rather than a monument is what made this step different from the four before it.
Three things that had been safe to assume across every previous place stopped being true at
once: that a place has a single point, that its physical figures are constants, and that its
defining fact is something built. The lake's surface elevation is a *managed* number — it was
lowered about nineteen metres on purpose and argued part of the way back — and an article that
stated one area and one depth as fixed would be repeating the specific error the bibliography
note warns about.

### The inflowing rivers, resolved rather than guessed

The four Wikidata Q-ids carried over from the previous pass were resolved before any prose was
written, because "the principal rivers flowing into Sevan" is exactly the sentence that gets
filled in from memory and is wrong.

| Q-id | English | Armenian | `flows into` |
|---|---|---|---|
| Q4068821 | Argichi | Արգիճի | Q181932 |
| Q4103724 | Vardenis | Վարդենիս | Q181932 |
| Q4282693 | Martuni | Մարտունի | Q181932 |
| Q4071815 | Astkhadzor | Աստղաձոր | Q181932 |

Two things had to be corrected on the way, and both are worth recording because both would
have shipped as confident errors.

**Q181932 is Lake Sevan, not the Arax.** The first pass over these entities reported `P403` as
the Arax for three of the four and as Lake Sevan for the fourth — impossible, since one Q-id is
one entity. Fetching Q181932 directly settled it: it is the lake, so all four are direct
inflows and none of them needed the hedge that a chain through the Hrazdan to the Arax would
have required.

**The Armenian labels were being mangled in transit.** Two successive fetches of the same API
disagreed on single characters — `Աստխաձոր` against `Աստղաձոր`, and `Արգիճի` against `Արգիչի` —
which is a summarisation artefact, not a source disagreement. Since these spellings go into the
`hy` and `hyw` prose, the raw JSON was fetched to disk and the labels read out as codepoints:
`Արգիճի` carries U+0573 (ճ) and `Աստղաձոր` carries U+0572 (ղ). The first fetch was right about
one and the second about the other. **Non-Latin strings are not read through a summariser
again.**

All four are named in `how-the-water-moves` as *among* the inflows. They are not claimed to be
the largest or a complete set: the Masrik and the Gavaraget are usually cited as the biggest,
and nothing in the registered bibliography establishes a ranking.

### A planned date that did not survive verification

The numeral inventory carried into this step listed **1963** for the end of the drawdown. It
was not published, because the sources contradict it and each other:

| Source | What it says |
|---|---|
| SIL / limnology chronology | "the lake level was finally stabilized at **-18m in 1962**" |
| sevan-park.am (registered source) | "In **1964** a project began" (Arpa–Sevan), completed 1981 |
| Secondary accounts | Arpa–Sevan construction began March **1963** |

1963 is the start of a tunnel that two sources date differently and that the registered source
dates to 1964. 1962 is the halting of the drawdown, which is both better attested and the more
meaningful event — it is the moment the policy reversed. **1962 was substituted for 1963** in
`importantDates` and in `what-the-lowering-did`, and the disputed tunnel start-year is simply
not stated anywhere in the article. Sevan National Park's founding was verified independently
and kept: **14 March 1978**, decree N 125 of the Council of Ministers of the Armenian SSR.

### Structure and the numeral inventory

Ten sections, paragraphs 3, 3, 3, 4, 4, 3, 4, 4, 4, 3; six `keyFacts`, ten `importantDates`,
five `interestingFacts`, two `relatedFigures`, two `SectionLink`s. Identical in all three
editions.

`validateCrossLocaleNumbers` compares the multiset of `\d{2,}` matches **per field group**, so
the inventory was planned per group rather than per article and held to exactly:

| Field group | Numbers |
|---|---|
| `intro` | 1916, 1900 |
| `summary` | 1900, 1916, 1933, 1981 |
| `keyFacts` | 1900, 28, 1978, 1993 |
| `importantDates` | 874, 1910, 1933, 1949, 1962, 1978, 1981, 1993, 2001, 2004 |
| `sections` | 874, 1900, 1910, 1916, 1933, 1949, 1962, 1981, 1994, 2001, 2004 |
| `interestingFacts` | 874, 1910, 1900, 28 |
| `seoTitle`, `metaDescription`, `relatedFigures` | none |

Two consequences of that regex are worth writing down. **`1,916` would extract as `916`**, so
the two elevations are written without a thousands separator — the only measurements in the
article given as numerals, per the plan; everything else (nineteen metres, eighty metres, fifty
metres, twenty-eight rivers in prose) is spelled as words in house style. And `28` appears as a
numeral **only** in `keyFacts` and `interestingFacts`, which is why `how-the-water-moves` opens
with "Twenty-eight rivers" spelled out — a numeral there would have been an extra token in the
`sections` group and failed the cross-edition check in two locales at once.

`relatedFigures` lifespans are descriptive — "ninth century", "late nineteenth to early
twentieth century" — because neither Princess Mariam nor Soukias Manasserian has verifiable
dates. That also keeps the group numeral-free, so it cannot drift.

`sevanavank` is **not** in `relatedSlugs`: it does not exist as a slug, and the validator
rejects a link to an unpublished article. `relatedSlugs` is `["kingdom-of-urartu",
"bagratid-armenia"]`, the two that exist in all three editions, and the same two carry the
`SectionLink`s — Urartu from `people-and-the-lake`, the Bagratids from
`what-stands-on-the-shore`.

### Parity checking before validating

`scratchpad/check.ts` was written to print section shape and the per-group numeral multiset for
one slug across the three editions as a table. `validate:content` already enforces both, but it
enforces them over the whole archive and reports a wall of failures; this prints the two things
that actually drift while an article is being written in three languages one after another. It
was run after `en`, after `hy` and after `hyw`, and each edition was correct on the first run of
the validator as a result.

### Tests

`tests/e2e/places.spec.ts` grew from 32 to 36 tests. `PLACES` is now five slugs; `ILLUSTRATED`
stays at four, and the split between those two lists is what most of the new work turns on.

- `SEVAN` added, with `PLACES` at five and `ILLUSTRATED` unchanged.
- Card counts 4 → 5 on the listing, the filter test and the clear-filter assertion.
- The filter vocabulary is now exactly `all, monastery, historical, museum, nature`, and
  `under("nature")` is exactly `[SEVAN]`; each edition's `nature` label must be translated
  rather than the raw id.
- `nature` joins the single-article filter loop beside `historical` and `museum` — three
  one-article pills that could be crossed over without any count changing.
- **The placeholder branch has a subject again.** The §36 test asserting that *no* place renders
  the placeholder was rescoped to `ILLUSTRATED`, and a new test asserts the positive case: Lake
  Sevan renders the inline `<svg>`, renders no `<img>`, and is captioned as a placeholder in all
  three editions.
- A new test forbids `bagratid-armenia`, `kingdom-of-urartu`, `hero-ararat` and `matenadaran`
  from the pending article's head, structured data and hero — the four files actually considered
  and rejected — and asserts `Article.image` is **absent** rather than defaulted.
- The listing asserts **exactly one** generated `<svg>`, not zero and not two, and
  `ILLUSTRATED.length + 1` images.
- Search: a fifth findability test, plus one asserting the pending article's result card renders
  the placeholder thumbnail and no `<img>`.
- The sitemap asserts Sevan's three url blocks contain **no** `image:loc` — the state this block
  asserted for the Matenadaran before §36.
- `PENDING_ARTWORK` is asserted to equal `[SEVAN]` exactly, in both directions, and
  `getImageSrc(SEVAN)` to be `undefined`.
- The coordinate test now expects `precision` to be `"area"` for Sevan and `"site"` for the
  other four, and pins the point against the three plausible wrong answers on the shore: Sevan
  town, Sevanavank and the resort strip.
- The homepage test forbids `lake-sevan` alongside the other three fragments.

### Two deterministic failures, and their fixes

Both were mine, both were real, and neither was a flake.

**1. `npm run typecheck` failed.** `ARTWORK[slug]` was still being indexed with a `PLACES` slug
in the Matenadaran borrowing test, and `PLACES` now contains `lake-sevan`, which has no
`ARTWORK` entry:

```
tests/e2e/places.spec.ts(642,68): error TS7053: Property 'lake-sevan' does not exist on type …
```

Fixed by drawing that list from `ILLUSTRATED` instead — only a file that exists can be borrowed,
so this is the correct list as well as the one that compiles.

**2. `places.spec.ts` failed on the first run**, one test of 36, with a 30 s timeout:

```
Error: locator.getAttribute: Test timeout of 30000ms exceeded.
  - waiting for locator('header figure img')
```

The new borrowing test read the hero as `header figure img`, copying the illustrated tests. On
the pending article there *is* no `<img>` — that is the whole point of it — so the locator waited
out the timeout instead of returning nothing. Fixed by reading the figure's subtree with
`innerHTML()`, which covers both branches and still catches a borrowed file inside it.

### Verification

Run in the prescribed order. Port 3002 was confirmed clear and `.next` was removed first,
because the previous pass ended with `npm run build`.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed (previous pass ended with a build) |
| 3 | `npm run typecheck` | **FAIL then PASS** — TS7053 above, fixed, 0 errors |
| 4 | `npm run validate:content` | **PASS** — 114 entries across 3 locales, with the pending note naming `lake-sevan` |
| 5 | `npx playwright test tests/e2e/places.spec.ts` | **FAIL then PASS** — 35/36 then **36 passed** |
| 6 | `npx playwright test` | **184 passed, 5 skipped, 0 failed** |
| 7 | `npm run build` | **PASS** — 120 prerendered routes, up 3 (one `lake-sevan` per edition) |

Port 3002 was confirmed clear a second time between steps 6 and 7. **The build was not run
concurrently with Playwright's dev server.** The three documented false-failure modes (§30 stale
adopted dev server, §32 build-clobbered `.next`, §34 cold-compile contention) did not occur;
neither failure above is being attributed to a cache, and both were fixed in the source rather
than retried.

The 15 place pages (5 places × 3 editions) were confirmed on disk, including
`.next/server/app/{hy,hyw,en}/places/lake-sevan.html`.

### Files changed

Four source files — the three `articles/places.ts` editions and `tests/e2e/places.spec.ts` —
plus this document. `src/data/geo.ts`, `src/data/sources.ts`, `src/lib/media.ts` and the three
`places.ts` filter lists were written in the preparatory half of this step and are unchanged
since. No asset was added, and no image was generated, edited or renamed.

Two files remain under `scratchpad/`: `check.ts`, the parity checker described above, and
`sevan-rivers.json`, the raw Wikidata response the river labels were read out of. Neither is
imported by anything the site builds.

> **Corrected in §38.** This paragraph called them *untracked*. They were not: `scratchpad/` is
> not in `.gitignore`, and both were committed with the rest of this step. Both were deleted in
> §38 — see “Scratchpad files” there for why.

`.claude/settings.json` shows as modified. It was **not** hand-edited: the entries added during
this step are permission allow-rules appended by the harness as permissions were granted —
three `WebFetch` domains (`sevan-park.am`, `rsis.ramsar.org`, `limnology.org`) and two Bash
patterns. It was already modified before this step began.

### Still open

- **The Matenadaran façade colour**, unchanged from §36 and **still open**. The delivered
  artwork renders the building in pale grey where the building — and this archive's prose, three
  times over — describes dark basalt. Reported rather than corrected, because a delivered asset
  is registered as delivered. A revised file would be a one-line change.
- ~~**Lake Sevan has no artwork.**~~ **RESOLVED in §38.** `public/images/places/lake-sevan.webp`
  arrived, was verified and inspected, and is registered. `PENDING_ARTWORK` is empty. The
  reasoning recorded here — that the tempting substitute was a *mood* rather than a wrong
  monument, and that `bagratid-armenia.webp`, `kingdom-of-urartu.webp` and `hero-ararat.png` were
  each rejected on sight — is now carried by a test that forbids those three files by name in the
  article's own head, structured data and hero.
- **A dedicated Khor Virap image**, unchanged since §32.
- **File weight in Places.** Erebuni at 742 KB and Matenadaran at 701 KB, both with ICC profiles.
- **Western Armenian native review.** The Lake Sevan `hyw` article is unreviewed machine-written
  Western Armenian and joins the queue from §16, §28, §29, §31, §33 and §35.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional.
- **The remaining place types.** `nature` is now earned; **`settlement`** still waits for its
  first article.
- **The lake's own figures.** Area, depth and volume are stated in words and hedged on purpose,
  because they are functions of a water level that has moved within living memory. Any future
  edit that pins them to single numbers should read the `sources.ts` note first.

No deployment was performed.

---

## 38. Lake Sevan artwork — the pending entry, cleared (August 2026)

`public/images/places/lake-sevan.webp` arrived. It was verified, inspected and registered in
`IMAGES`, and the slug is out of `PENDING_ARTWORK`. Nothing else changed: no image was
generated, edited, cropped, resized, recoloured, renamed or optimised, no article content
moved, and no new loading path was introduced. Two source files changed — `src/lib/media.ts`
and `tests/e2e/places.spec.ts` — plus two deleted scratchpad files and this document.

This is the fourth time the section has cleared a pending entry (§32 Etchmiadzin, §34 Erebuni,
§36 Matenadaran, §38 Lake Sevan) and the fourth time the whole change was a one-line
registration reaching six surfaces at once. `PENDING_ARTWORK` is empty again, and with five of
five places illustrated the placeholder branch has no subject in this section once more.

Unlike the previous three, `scripts/validate-content.ts` was **not** touched. The corrected
wording introduced in §36 — *"have no artwork and render the generated placeholder"* — is
unchanged, and so is its logic. It simply prints nothing now, because the set it counts is
empty: every one of the 28 article slugs across the three editions has a registered file.

### The asset, verified rather than assumed

The container was parsed rather than trusted to its extension.

| Property | Value |
|---|---|
| Path | `public/images/places/lake-sevan.webp` |
| Magic | `RIFF` … `WEBP`, RIFF size field 180 258 = file length − 8 (consistent) |
| Chunks | `VP8 (180246)` — **simple** container, lossy VP8, no `VP8X`, no `ICCP`, no `ALPH`, no `EXIF` |
| Frame | keyframe, VP8 version 0, start code `9d 01 2a`, no horizontal or vertical scaling bits |
| Dimensions | **1586 × 992** (1.599, ≈16:10) |
| Colour | sRGB, no alpha channel |
| File size | **180 266 bytes (176.0 KB)** |
| SHA-256 | `66b4c12c6e205d9786769cae980a4875a90cbb79ebbf4baa2d8dcee4cbd2e604` |

Two notes worth keeping, because both reverse things §34 and §36 recorded.

**It is the lightest file under `/images/places/`,** not the heaviest. At 176 KB it comes in
below Etchmiadzin (242 KB) and far below the Matenadaran (701 KB) and Erebuni (742 KB), so the
"the two heaviest files in the registry are the two most recent" observation from §36 is no
longer true of the most recent one. File weight in Places stays open as a watch item, but this
entry did not add to it.

**It carries no ICC profile.** Erebuni and the Matenadaran are extended-container files with an
embedded profile; this one is a plain `RIFF/VP8` like Etchmiadzin. The ICC note in
`src/lib/media.ts` therefore still describes exactly two files, not three.

Dimensions match the other three registry WebPs exactly. Khor Virap remains the only entry that
is not 1586 × 992 and the only PNG.

### Visual inspection, and the crops it had to survive

The file was opened and looked at, not reasoned about from its filename, and then looked at
again through each centre crop the project actually applies.

What it depicts: a high, open body of water seen from a rocky slope, running back to bare
ochre-and-blue ridges under broken cloud. The shores are treeless steppe — grass, scrub,
rock — with no forest rim, no sand, no surf and no horizon-to-horizon ocean line. A pale gravel
terrace curves across the foreground with shallow ponds and reed beds stranded behind it. That
terrace is the single most Sevan-specific thing in the frame: it is the drawdown shoreline this
article is largely about, and it is what separates the picture from a generic mountain lake.

Checked against each rejection criterion:

| Criterion | Finding |
|---|---|
| Lake unmistakably the main subject | Yes — water occupies roughly half the frame and all of the middle distance |
| Geographically plausible high-altitude Armenian lake | Yes — treeless highland steppe, arid ridges, hazy blue ranges, no tree line above the shore |
| Not a tropical lagoon | No palms, no turquoise shallows over white sand, no reef colour |
| Not an ocean coastline | No breaking surf, no dunes, no open horizon — the far shore is continuous |
| Not a generic forest lake | No conifer or broadleaf rim anywhere on either shore |
| Not an artificial reservoir | No dam, no spillway, no drowned-timber margin, no concrete |
| Architecture secondary | A monastery on a far headland at roughly 130 × 60 px of 1586 × 992 — about **0.5 %** of the frame, silhouetted, no detail readable beyond a conical drum |
| No resorts, hotels, beaches, boats or development dominating | One open fishing boat with two figures, two figures on the shore, a line of gulls. Nothing built anywhere except the distant monastery |

The headland reads as Sevanavank on the Sevan peninsula, which is correct rather than
convenient — but it is a detail in the picture, not its subject, which is exactly the balance
§37 asked for. The article is about the lake; the monastery is where it happens to be.

**Crop suitability.** Every slot the project uses is a centre crop with `object-cover` and
`object-center` (`PORTRAIT_FOCUS` is writers-only and does not apply here). Each was rendered
from the source and inspected:

| Slot | Component | Crop of 1586 × 992 | Result |
|---|---|---|---|
| Compact card (homepage) | `ArticleCard variant="compact"`, `aspect-[4/3]` | 1323 × 992, 132 px trimmed per side | Lake fills the frame, headland and boat both retained |
| Standard listing card | `ArticleCard`, `aspect-[16/9]` | 1586 × 892, 50 px trimmed top and bottom | Best of the five — loses only sky and a little foreground grass |
| Mobile article hero | `ArticleLayout`, `aspect-[4/3]` | as compact | Same as compact; nothing important leaves the frame |
| Tablet article hero | `ArticleLayout`, `sm:aspect-[3/2]` | 1488 × 992, 49 px per side | Everything retained |
| Desktop article hero | `ArticleLayout`, `lg:aspect-[16/9]` | as listing card | Everything retained |
| Search thumbnail | `SearchResultCard`, `w-32`/`lg:w-40` at card height (≈128 × 170) | 747 × 992 | The hardest crop, and it still holds: water, far ridges and the headland all survive the narrow portrait |

No visual or technical concern was found that would justify touching the file, and it was not
touched. The one thing worth recording rather than rediscovering: the headland is small enough
that at search-thumbnail size the monastery is a few pixels. That is the right trade — a crop
tight enough to make the building legible would have made the picture a picture of a monastery.

### Media registry

One line, in the places block of `IMAGES`:

```ts
"lake-sevan": "/images/places/lake-sevan.webp",
```

Reached through the existing `getImageSrc` and `getArticleImageSrc` only. No Lake Sevan-specific
image-loading path was introduced, no component was changed, and no call site was added — every
consumer already asks the registry.

The surrounding comment was extended with what was checked before registering, and with the two
reversals above so the ICC and file-weight notes stay accurate.

### Provenance

Unchanged mechanism, entirely inherited:

- `isGeneratedArtwork({ slug: "lake-sevan" })` returns `true`, because the slug is now in
  `IMAGES` and the article declares no `image` of its own.
- The normal AI-generated illustration disclosure appears. The lake takes the illustration
  wording, not the portrait wording, like every non-writers article. Confirmed in the built HTML
  of all three editions:
  - `en` — "AI-generated illustration for Lake Sevan — an imagined scene."
  - `hy` — «Արհեստական բանականությամբ ստեղծված նկարազարդում «Սևանա լիճ» հոդվածի համար — երևակայված պատկեր է։»
  - `hyw` — «Արհեստական բանականութեամբ ստեղծուած պատկերազարդում՝ Սեւանայ լիճ — երեւակայուած պատկեր է։»
- The placeholder disclosure is gone, and the hero renders `<img>` rather than the generated
  inline `<svg>`.
- `ARTWORK_PROVENANCE` is **unchanged** — same object, same two fields, one provenance for the
  whole registry.
- No per-image provenance system was introduced, and no other image's provenance behaviour
  changed.

The two `<svg role="img">` elements still present on the article page are the `relatedFigures`
portrait placeholders for Princess Mariam and Soukias Manasserian, which is correct: neither has
a picture and neither is claimed to.

### Pending-artwork removal

`"lake-sevan"` was removed from `PENDING_ARTWORK`, which is now empty for the fourth time. The
list itself stays, with its comment rewritten to record what was rejected on the way out — the
Matenadaran's Mashtots portrait from §35, and Ani, Lake Van country and `hero-ararat.png` from
§37. It emptying is the normal end state, not a signal it can go.

Consequences, each checked rather than assumed:

- `validate:content` no longer names Lake Sevan. It no longer prints the "no artwork" note at
  all, because the set is empty.
- The Places listing contains **zero** artwork placeholders — asserted as a count, not as an
  absence of one slug.
- All three locale pages use the final WebP.

### Verified surfaces

Every one from the built output, not inferred from the registry:

| Surface | Evidence |
|---|---|
| Places listing card | `main img` sources on `/en/places` contain `lake-sevan.webp`; six images for five places plus the featured repeat; zero `svg[role="img"]` |
| Article hero | `header figure img` in `hy`, `hyw` and `en`, with no `svg[role="img"]` in the figure |
| Global search card | The result card filtered by `a[href="/en/places/lake-sevan"]` carries the thumbnail — scoped by href, not taken as the first result |
| Related-article cards | The same `ArticleCard` component as the listing, covered by the same lookup |
| Open Graph | `og:image` = `https://armat.site/images/places/lake-sevan.webp` in all three editions |
| Twitter | `twitter:image` = the same absolute URL in all three editions |
| `Article.image` JSON-LD | `{"@type":"ImageObject","url":"https://armat.site/images/places/lake-sevan.webp"}`, present where §37 asserted it absent |
| Sitemap | Exactly three `image:loc` entries, one per locale route, each inside its own `<url>` block |

No new JSON-LD type appeared. The graph is still `Article` + `BreadcrumbList`, and the test
forbidding `Place`, `TouristAttraction`, `LocalBusiness`, `Church`, `ArchaeologicalSite` and
`LandmarksOrHistoricalBuildings` still passes over all five places. Nothing lake-specific was
introduced either — no `LakeBodyOfWater`, no `NaturalFeature`. The only structured-data
consequence of this step is the generic `Article.image` resolving to the registered file.

### Scratchpad files

`scratchpad/check.ts` and `scratchpad/sevan-rivers.json` were **deleted** (`git rm`, not
committed).

The §37 note calling them untracked was wrong and is corrected there: `scratchpad/` is not in
`.gitignore` and both were committed with that step. So the question was not whether to leave
untracked files lying around but whether the repository *deliberately tracks and documents*
reusable scratchpad research. It does not:

- There is no `scratchpad/README`, no `.gitignore` entry, no `package.json` script and nothing in
  `docs/` describing a convention. The repository's documented home for reusable tooling is
  `scripts/`, invoked through an npm script — that is where `validate-content.ts` lives.
- The only other file there, `RESUME-PROMPT.md`, is a one-off hand-off note from the July `hyw`
  translation work. One stale artefact is not a convention, and it is left alone.
- `sevan-rivers.json` is raw Wikidata API output. It is exactly the "temporary raw API output"
  that should not sit in the project without a stated purpose, and its purpose was served the
  moment the four labels were read out as codepoints and written into the prose. The *finding* —
  which codepoint each label carries, and that Q181932 is the lake — is recorded in §37 and does
  not depend on the file.
- `check.ts` is the closer call: it is genuinely slug-generic and would work for the next
  three-edition article. But it duplicates checks `validate:content` already performs, it was
  written during and for this task, and its value is the technique, which §37 describes. If the
  next multi-locale article wants it, it belongs in `scripts/` with an npm script and a test —
  not readmitted to a directory with no convention behind it.

Neither file was imported by anything the site builds, so nothing referenced them.
`.claude/settings.json` was not modified.

### Tests

`tests/e2e/places.spec.ts` stays at **36 tests**; no test was dropped, and the two that asserted
the pending state were inverted rather than deleted.

- `SEVAN` moved from the pending case into `ILLUSTRATED`, which is now all five places, and
  `ARTWORK` gained `"lake-sevan": "/images/places/lake-sevan.webp"`. Every artwork assertion runs
  off that one map.
- `ILLUSTRATED` is deliberately **not** collapsed into `PLACES` now that the two coincide. They
  have coincided three times before and split again every time, and the placeholder assertions
  read this list to decide what may render an `<svg>`.
- *"the pending place renders the generated placeholder and says so"* → *"the newest place
  renders its own file and is captioned as an illustration"*: `<img>` present with the right
  file, `<svg>` absent, illustration caption present, placeholder caption absent, in `hy`, `hyw`
  and `en`.
- *"the pending place borrows no other article's artwork"* → *"the newest place borrows no other
  article's artwork"*, kept across the registration exactly as the Matenadaran's was. It still
  forbids `bagratid-armenia`, `kingdom-of-urartu`, `hero-ararat` and `matenadaran` by name in the
  article's own head, structured data and hero, and now asserts `Article.image` **is** the
  registered cover where §37 asserted it absent. That is the "not replaced by a previously
  rejected landscape or monastery asset" requirement.
- The listing test flipped from *exactly one* generated `<svg>` to **zero**, and its
  borrowed-file list grew to name `bagratid-armenia` and `hero-ararat` alongside
  `kingdom-of-urartu` and `mesrop-mashtots`.
- The search-thumbnail loop gained `[SEVAN, "Sevan"]`, scoped to the card that links to
  `/en/places/lake-sevan` rather than to the first result — "Sevan" also matches the Urartu
  article and Paruyr Sevak.
- *"the pending place is findable in search and shows the placeholder thumbnail"* → *"the newest
  place's search card carries its own thumbnail and no placeholder"*. Kept separate from the loop
  above on purpose: `SearchResultCard` calls `getImageSrc` directly while the hero goes through
  `getArticleImageSrc`, so one can be right while the other is not.
- The sitemap test's per-block assertion now covers `MATENADARAN` **and** `SEVAN`: three `<url>`
  blocks each, each containing its own `image:loc`. The whole-document count alone would pass if
  all three entries landed on one route.
- *"the pending list names exactly the one place"* → *"no place is waiting for artwork, and every
  one resolves to its own file"*: `PENDING_ARTWORK` is asserted `toEqual([])`, and every slug in
  `PLACES` resolves through the registry to its own file. The mutual-exclusion test over the
  whole repository is unchanged and still passes.
- `no unrelated article artwork changed` pins `registry[SEVAN]` by name alongside the other four,
  and its exact-object assertion over History, Writers, Works and Cuisine is untouched — it would
  fail on any path in those four categories being retyped in passing. Khor Virap is still the
  PNG, and Etchmiadzin, Erebuni and the Matenadaran still their own WebPs.
- The homepage test is unchanged and still forbids `lake-sevan` among the fragments that must not
  appear on `/hy`.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed (§37 ended with a build) |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — 114 entries across 3 locales, and **no** "no artwork" note |
| 5 | `npx playwright test --project=desktop places.spec.ts` | **PASS** — 36 passed |
| 6 | `npx playwright test` | **PASS** — 184 passed, 5 skipped, 0 failed |
| 7 | `npm run build` | **PASS** — 120 prerendered routes, compiled in 10.5 s |

Port 3002 was confirmed clear a second time between steps 6 and 7.

**No failures occurred, and nothing was retried.** Unlike §37, which had two deterministic
failures to fix, every step passed on its first run. The build in step 7 was invoked twice — the
second time only to capture the summary lines the first invocation's tail had scrolled past. It
was the same build against the same sources, it also passed, and no code changed between them.
The three documented false-failure modes (§30 stale adopted dev server, §32 build-clobbered
`.next`, §34 cold-compile contention) did not occur.

The 15 place pages (5 places × 3 editions) were confirmed on disk, including
`.next/server/app/{hy,hyw,en}/places/lake-sevan.html`, each carrying the WebP in its `og:image`,
`twitter:image` and `Article.image`.

### Preserved, and checked rather than assumed

Nothing outside the registry, the pending list and the places test file was touched.

- **Lake Sevan article prose** — the three `articles/places.ts` editions are unchanged since §37.
  River names, the Wikidata conclusions, every numerical value, the environmental chronology, the
  registered sources, the coordinate, `precision: "area"`, `placeTypeId: "nature"`, the filters,
  `relatedSlugs`, navigation, listing logic and SEO wording are all as they were.
- **Existing artwork files** — all five files under `public/images/places/` are unmodified;
  `git status` shows no change to any asset. Khor Virap keeps its PNG, and Etchmiadzin, Erebuni
  and the Matenadaran keep their WebPs.
- **The homepage** — `Hero.tsx` still points at `/hero-ararat.png` directly, the file is
  unchanged, and it is still absent from `IMAGES`. The homepage renders no place card and picks
  up no places artwork.
- **Layout components and JSON-LD builders** — `ContentPhoto`, `ArticleLayout`, `ArticleCard`,
  `SearchResultCard`, `seo.ts` and `sitemap.ts` are untouched. The registry entry reached all
  eight surfaces through code that already existed.
- **`scripts/validate-content.ts`** — not touched at all. The §36 wording *"have no artwork and
  render the generated placeholder"* stands, and so does its logic.

### Still open

- **The Matenadaran façade colour — still open.** The delivered artwork renders the building in
  pale grey where the building, and this archive's prose three times over, describes dark basalt.
  Registering `matenadaran.webp` in §36 did not resolve this and neither does anything in §38:
  having artwork and having *correct* artwork are different claims, and only the first is
  settled. Reported rather than corrected, because a delivered asset is registered as delivered.
  A revised file would be a one-line change. The note recording it in `src/lib/media.ts` is
  unchanged.
- **A dedicated Khor Virap image**, unchanged since §32. It remains the only 1355 × 793 entry, the
  only PNG, and at 1.4 MB the heaviest file in the registry by a factor of two.
- **File weight in Places.** Erebuni at 742 KB and the Matenadaran at 701 KB, both with ICC
  profiles. Lake Sevan at 176 KB did not add to this and is evidence the ceiling is not inherent.
- **Western Armenian native review.** The Lake Sevan `hyw` article remains unreviewed
  machine-written Western Armenian, in the queue from §16, §28, §29, §31, §33, §35 and §37. The
  artwork step did not touch its prose and does not change its status.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional.
- **The remaining place type.** `settlement` still waits for its first article.
- **The lake's own figures.** Area, depth and volume stay stated in words and hedged on purpose,
  because they are functions of a water level that has moved within living memory.

No deployment was performed.

---

## 39. Places — Garni Temple, the sixth place and the second `historical` site (August 2026)

`garni-temple` is published in all three editions. It is the sixth Places article, the second
under the `historical` filter, and the first time a place type has held more than one article —
which changed the shape of several tests rather than only their counts.

No new place type, filter, schema, component, map feature or visitor-information model was
introduced. The filter vocabulary is unchanged at five ids, and nothing in the filtering
implementation mentions Garni or any other slug.

Seven source files changed: the three `articles/places.ts` editions, `src/data/geo.ts`,
`src/data/sources.ts`, `src/lib/media.ts` and `tests/e2e/places.spec.ts`, plus this document.
No asset was added, and no existing article was edited to create a backlink.

### Counts after this step

| | |
|---|---|
| All places | **6** |
| Monasteries and churches | 2 (Khor Virap, Etchmiadzin) |
| Historical sites | **2** (Erebuni, Garni) |
| Museums | 1 (Matenadaran) |
| Nature | 1 (Lake Sevan) |
| Featured | Khor Virap, still the only one |
| Content entries | 117 across 3 locales, up from 114 |
| Prerendered routes | 123, up 3 |

### Terminology, taken from the repository rather than chosen

The existing corpus was searched before a word was written, and every form below was already in
use here. Nothing competing was introduced.

| | `en` | `hy` | `hyw` |
|---|---|---|---|
| Garni | Garni | Գառնի | Գառնի |
| Geghard | Geghard | Գեղարդ | Գեղարդ |
| The king of the conversion | Trdat III (`Tiridates III` as a keyword) | Տրդատ Գ | Տրդատ Գ. |
| Basalt | basalt | բազալտ | պազալթ |
| Pagan | pagan | հեթանոսական | հեթանոսական |
| Hellenistic | Hellenistic | հելլենիստական | հելլենիստական |
| Roman Empire | Roman Empire | Հռոմեական կայսրություն | Հռոմէական կայսրութիւն |
| Parthia | Parthia | Պարթևստան | Պարթեւստան |
| World Heritage | UNESCO | ՅՈՒՆԵՍԿՕ | ԵՈՒՆԵՍՔՕ |

The first-century king therefore takes **Trdat I** in English with `Tiridates I` as a keyword,
which is exactly the pattern the conversion article already uses for Trdat III. `Միհր` and
`Ազատ գետ` follow the standard Armenian forms; neither appeared in the repository before.

Two names are new to the archive and are flagged rather than assumed: the mosaic figures and the
modern scholars are transliterated into Armenian for the first time here.

### Structure

Ten sections, paragraphs 3, 3, 4, 3, 5, 4, 4, 3, 4, 3 — thirty-six in all, identical in the three
editions. Six `keyFacts`, eleven `importantDates`, five `interestingFacts`, two `relatedFigures`,
three `SectionLink`s.

| Section | Covers |
|---|---|
| `where-it-is` | Where Garni is; the gorge, the Symphony of Stones, Geghard, and the World Heritage distinction |
| `the-promontory` | The Azat gorge promontory, the wall, the strategic position, Tacitus |
| `the-building` | The peristyle: columns, order, podium, cella, basalt, iron clamps, and why it is not transplanted Rome |
| `first-century-armenia` | Arsacid Armenia between Rome and Parthia; Trdat I, Nero, the craftsmen |
| `the-inscription` | The Greek text, what it actually says, the two regnal-year counts, and the 2022 revision |
| `temple-or-tomb` | Mihr, the evidentiary gap, Wilkinson, Russell, Maranci |
| `the-wider-complex` | Palace, bath, hypocaust, mosaic and its Greek line |
| `after-christianity` | 301, Khorenatsi's passage, Surb Sion, the baptistery hypothesis, why it survived |
| `earthquake-and-reconstruction` | 1679, the stripped clamps, Marr, Buniatian, Arakelyan, Sahinian's anastylosis |
| `before-you-see-it` | What a visitor should understand first |

The numeral inventory was planned per validator field group and held to exactly, in all three
editions: `intro` 77; `summary` 63, 77, 1679, 1975; `metaDescription` 77, 1679; `keyFacts` 63,
77, 1679, 1975; `importantDates` 63, 66, 77, 301, 1679, 1909, 1945, 1949, 1969, 1975, 2025;
`sections` those plus 175, 1911, 1930, 1968, 1982, 2022; `interestingFacts` 63, 77, 1679, 1975;
`seoTitle` and `relatedFigures` none. Everything else — twenty-four columns, three metres, fifteen
shades, forty per cent, one third, two thirds, the eleventh regnal year — is spelled as words in
house style, which is also what keeps the groups from drifting.

`relatedFigures` lifespans are descriptive ("first century AD", "twentieth century") for the same
reason Lake Sevan's are: this is an article about chronological uncertainty, and putting a
contested regnal span in a sidebar would undercut it.

English dating follows the existing convention — `782 BC` as a suffix, `AD 66` as a prefix — with
`մ.թ.` / `մ.թ.ա.` in `hy` and `Ք.Ե.` / `Ք.Ա.` in `hyw`.

### The inscription and the date, treated as an evidence problem

This is the part the article was written around, and the conventional sentence "the temple was
built in AD 77" is not in it in any edition.

**What the text says.** A Greek inscription found at Garni in 1945 records that Helios Tiridates
the Great of Greater Armenia, having subdued this city as its lord, founded for his sister the
queen this impregnable fortress, for the safety of his kingdom, in his eleventh regnal year.

**Three things follow, and all three are in the article.** The text names a *fortress*, not a
temple. `Helios` sits in it where a Hellenistic ruler's epithet sits — a royal title, not a
theonym. And it was found at the cemetery, not in the building it is normally attached to.

**Where AD 77 comes from.** The eleventh regnal year counted from Trdat I's coronation by Nero in
66 gives 77; counted from his earlier installation by Vologases it gives about 63. Both counts
are in the literature. AD 77 is the number everyone repeats because Armenian scholarship has
generally preferred the coronation as the starting point. So 77 survived the audit — as a
**regnal-year calculation on a fortress inscription**, which is what the article says it is, and
what `keyFacts` says too: *"AD 77, or AD 63 on the other reckoning of that year"*.

**And the ground moved during this step.** Bresson and Fagan (2022) argue that the Tiridates of
the inscription is not Trdat I but Trdat the Great — the king of the conversion — which would move
the text to the early fourth century and detach it from the first century entirely. That is a live
argument rather than a conclusion, and it is recorded as one. It was found late, after the section
was drafted; a paragraph was added to `the-inscription` in all three editions rather than left out
because the draft was tidier without it.

### Temple function and deity, treated the same way

The article does **not** call Garni a temple of Mihr. It says the identification is traditional,
that it is not baseless — solar cult is well attested in pre-Christian Armenia and Mihr is a real
figure in it — and then that nothing found at Garni names Mihr or any other god, and that the
chain runs from a royal epithet to a theonym to a dedication.

The minority reading is given properly: Wilkinson (1982) argued for a monumental tomb of about
AD 175 from comparison with the funerary architecture of western Asia Minor, nearby graves and
sarcophagus fragments; Russell endorsed it; Maranci's survey gives the building an unclear
function and raises a funerary reading. The article declines to adjudicate and says so.

Four kinds of claim are separated explicitly in the closing section — a document, arithmetic on a
document, an association, and an argument from comparative architecture — which is the same
discipline the Erebuni article applies to its own foundation year, and the reason those two
articles are linked.

Armenian pre-Christian religion is described only as far as the sources go: solar cult attested,
Mihr real and important, one temple of Mihr known beyond doubt elsewhere. No modern reconstruction
of a pantheon was used.

### Architecture, and what is actually standing

Stated where supported: peripteral plan, twenty-four Ionic columns (six by eight), entablature and
pediment, a podium about three metres high with a single steep flight, a small cella, local
grey-blue basalt laid dry with iron clamps set in lead.

Two things the article insists on. The order is Ionic but handled with a freedom generally read as
provincial workmanship in a Roman idiom rather than a copy of a model — so it is **not** described
as a transplanted Roman temple, and the stone, quarry, setting and surrounding fortress are named
as the local context. And the clamps are introduced here because they matter twice: they are why
the building is Roman in technique, and why it fell as completely as it did once they had been
stripped out for metal.

**The reconstruction is stated plainly and early — in the `excerpt`, the `intro`, the `summary`,
`keyFacts` and twice more in the body.** By Sahinian's own published account roughly a third of
the standing building is ancient material and two thirds is new stone from a local quarry; only
about forty per cent of the column shafts survived at all and only two survived whole; the new
pieces were left unornamented so the join stays visible. The article notes that this figure is the
restorer's own self-report. Nothing in any edition implies the colonnade survived from antiquity.

### Earthquake and reconstruction chronology

| | |
|---|---|
| Earthquake | **4 June 1679** in the Armenian tradition, **14 June** in the Gregorian reckoning of the modern re-analysis — a ten-day Julian offset. Epicentre near the Garni gorge. Equivalent magnitude about 6.7, epicentral intensity X (Mercalli–Cancani–Sieberg). Recorded by the contemporary chronicler Zakaria Kanakertsi. |
| Clearance | **1909–1911**, Nikolai Marr with Yakov Smirnov and the architect Konstantin Romanov. Later specialists judged it clearance and cataloguing rather than excavation; never published. |
| Partial re-erection | **Early 1930s**, Nikoghayos Buniatian; taken down again as mistaken. |
| Systematic excavation | **From 1949**, Babken Arakelyan, with Alexander Sahinian on the classical building. |
| Anastylosis | Approved **1968**, begun **1969**, colonnade standing again by **1975**. |

Both earthquake dates are given in the article rather than one being silently preferred. The
magnitude and intensity are written as words to keep the numeral inventory clean.

### Fortress, bath and mosaic

The wall and towers closing the neck of the promontory, the palace ranges, and the third-century
bath with its hypocaust are all described, and the article states outright that Garni is a
fortified royal site with a classical building in it rather than a temple with some walls nearby.

The mosaic is treated carefully. It is described as a marine scene in local stone of about fifteen
natural shades with figures labelled in Greek — Thetis, Glaukos, Eros among them — and the article
says the sources differ about which pair occupies the centre, naming Ocean and Thalassa as the
pair most often given. Thalassa, Tethys and Thetis are three different figures and are routinely
confused in popular accounts, which is why the central pair is hedged rather than asserted.

The Greek line is quoted as **μηδὲν λαβόντες ἠργασάμεθα** — not the ΟΥΔΕΝ variant that circulates,
for which no source could be found — and translated. Its *meaning* is left open: the "unpaid
craftsmen" reading is the popular one, but the sense reads equally as a boast, and the article
says so. Nothing was reconstructed or invented, and the bath does not displace the temple as the
subject.

### After the conversion

Handled as the thinly-evidenced question it is. Movses Khorenatsi records a cool retreat built
within the fortress for Khosrovidukht, sister of Trdat III — a reference to a building in the
enclosure, not to this one — and the step from there to "the temple became a summer house" is
named as a modern inference. The round church of Surb Sion west of the temple is dated **seventh
to tenth century**, a range, not the single early date usually quoted. The baptistery argument
from an inscription inside the cella is given as one study's hypothesis. The article states
plainly that no source explains why this building alone was left standing, and notes that the tomb
hypothesis offers the simplest answer while flagging that as an argument from consequence.

### Sources

Ten entries, every one verified for author, title, publisher, year and identifier during this
step. Three corrections were forced along the way, and each is worth recording because each would
have shipped as a confident error.

**The Wilkinson citation that circulates does not exist.** "The Temple of Garni: A Reexamination",
attributed to the *Journal of Ancient Near Eastern Religions*, is untraceable — and JANER did not
begin publication until 2001. The real article is **R. D. Wilkinson, "A Fresh Look at the Ionic
Building at Garni", *Revue des Études Arméniennes* NS 16 (1982), 221–244**, confirmed independently
from Russell's own footnote and from the bibliography entry. It is print-only with no DOI, so the
identifier is a catalogue search, and the note says the article was not consulted directly.

**Russell does not say "baseless".** That is a paraphrase. What he writes is that nothing supports
the temple identification save the inscription, and that one cannot be certain the inscription
refers to the building. The article now says that instead. The note also records that he is not
wholly consistent — elsewhere in the same book he refers in passing to a temple built by Trdat I
at Garni — because citing him as a clean anti-temple authority would be tidier than accurate.

**The mosaic phrase is ΜΗΔΕΝ, not ΟΥΔΕΝ.** No source was found for the second form.

| Source | Identifier | Cited for |
|---|---|---|
| Wilkinson, "A Fresh Look at the Ionic Building at Garni", REArm NS 16 | catalogue URL (print-only) | The tomb hypothesis at its source |
| Russell, *Zoroastrianism in Armenia*, Harvard Iranian Series 5 | ISBN 9780674968509 | The Mihr identification and its evidentiary gap |
| Bresson & Fagan, VDI 82(3) | DOI 10.31857/s032103910017253-1 | The 2022 re-attribution of the inscription |
| Guidoboni, Haroutiunian & Karakhanian, *J. Seismology* 7(3) | DOI 10.1023/A:1024561622879 | The 1679 earthquake |
| Magarditchian, REArm 37 | DOI 10.2143/REA.37.0.3237123 | The baptistery hypothesis |
| Maranci, *The Art of Armenia* | ISBN 9780190269005 | "Unclear function"; a funerary reading |
| Tacitus, *Annals* 4–6, 11–12, Loeb 312 | ISBN 9780674993457 | Gorneas as a stronghold |
| Hovannisian (ed.), *The Armenian People* I | ISBN 9781403966360 | The first-century political frame |
| Hewsen, *Armenia: A Historical Atlas* | ISBN 9780226332284 | Valley geography; Surb Sion's date range |
| UNESCO tentative list 6808 | whc.unesco.org URL | The tentative-list status |
| Livius.org (Jona Lendering) | livius.org URL | Inscription text, bath, mosaic |

The two existing Armat sources are reused only where they genuinely support the claim: Hovannisian
for the Roman–Parthian settlement, Hewsen for the valley and the church's dating. Neither is cited
for anything about the building. Livius is a scholarly reference site rather than peer-reviewed
work, and its note says so; where it advances the mausoleum reading it is reporting Wilkinson and
Russell, who are cited on their own account. **No tourism site is the authority for dating, deity
identification, inscription interpretation or reconstruction history.** No page reference was
invented; where a claim rests on a source not read directly, the note says so.

One conflict was preserved rather than resolved: the article carries both earthquake dates, both
regnal-year counts, both readings of the building's function, and a range rather than a year for
Surb Sion.

### Coordinate

```ts
"garni-temple": { lat: 40.1123, lon: 44.7302, precision: "site" },
```

| | |
|---|---|
| Source entity | OpenStreetMap **way 108255791** — `historic=archaeological_site`, `archaeological_site=roman_temple`, `building=temple`, `name=Գառնիի հեթանոսական տաճար`, `wikidata=Q684072` |
| Raw | 40.1123415, 44.7302188 (footprint centre) |
| Rounded | 40.1123, 44.7302 |
| Represents | The temple building itself, inside the walled complex |

The rounding was **checked rather than assumed**, which is new for this file: four decimal places
is about eleven metres and the temple footprint is roughly 23 × 18 m, so a point-in-polygon test
was run — the rounded value falls inside both the temple polygon and the surrounding fortress
enclosure (OSM way 215286758, `Գառնիի ամրոց`). Wikipedia's infobox agrees to about ten metres.
Wikidata Q684072 carries its own point but only to three decimal places, about 110 m out, so the
OSM element was preferred — for precision, not disagreement.

Excluded by name and distance in `geo.ts` and pinned in the test: Garni village centre (~660 m),
the gorge and the Symphony of Stones basalt columns (~0.9–1.1 km), the nearest hotel (~280 m), and
Geghard (~8 km up the valley).

### Related content

`relatedSlugs`: `adoption-of-christianity`, `tigran-the-great`, `erebuni-fortress` — all existing
slugs, all published in all three editions.

Three `SectionLink`s, each in a different section and each on a phrase that was already in the
prose:

- `the-building` → `tigran-the-great`, on "a kingdom that had been inside the Hellenistic world for centuries"
- `the-inscription` → `erebuni-fortress`, on the distinction between a record and a reconstruction
- `after-christianity` → `adoption-of-christianity`, on the conversion in 301

`geghard` was **not** invented. It has no article, and a link to it would have failed validation —
which is the mechanism working as intended. No existing article was modified to create a backlink,
so `getRelatedArticles` remains one-directional.

### Artwork — pending

Every asset in `public/` was opened rather than reasoned about from its filename. Nothing depicts
the temple at Garni, so `garni-temple` was added to `PENDING_ARTWORK` and the article renders the
generated placeholder honestly.

Two near misses were rejected on sight, and the second is the instructive one:
`history/adoption-of-christianity.webp` is a baptism before a medieval domed church among
khachkars — the right kingdom five centuries too late, and a building of exactly the kind Garni is
not. `history/tigran-the-great.webp` **has classical columns in it**, which is precisely the trap:
they are pilasters on a palace terrace behind a royal portrait, above a Hellenistic city and
Ararat. It would pass a glance as "Armenian antiquity with columns".

`erebuni-fortress.webp` is excluded on principle rather than resemblance: it is the other
`historical` place, and lending one archaeological site's cover to another is the substitution this
list exists to prevent. All three are named in a test that forbids them from Garni's own head,
structured data and hero. No artwork was generated or fabricated.

### Western Armenian — unreviewed, and flagged

The whole `hyw` article is machine-written Western Armenian and joins the review queue from §16,
§28, §29, §31, §33, §35 and §37. The `easternOrthographyMarker` guard only catches `և` and
`ություն`, and it passes — which says nothing about whether the prose is good Western Armenian.

Flagged specifically for a native reviewer, because each is a first use in this repository:

- **Ruler and personal names** — `Տրդատ Ա.`, `Վաղարշ Ա.`, `Ներոն`, `Տիրիդատէս`, `Խոսրովիդուխտ`, `Զաքարիա Քանաքեռցի`, `Մովսէս Խորենացի`.
- **Modern scholars, transliterated here for the first time** — `Ռ. Տ. Ուիլքինսըն`, `Ճէյմս Ռ. Ռասըլ`, `Քրիստինա Մարանչի`, `Ալէն Պրեսոն`, `Էլիզապէթ Ֆէյկըն`, `Էմանուէլա Կուիտոպոնի`, `Ռուբէն Յարութիւնեան`, `Ալեքսանդր Կարախանեան`, `Նիկողայոս Մառ`, `Բաբկէն Առաքելեան`, `Ալեքսանդր Սահինեան`.
- **Religious terminology** — `հեթանոսական`, `նախաքրիստոնէական`, `Միհր`, `Միթրա`, `արեգակնային պաշտամունք`, `զոհասեղան`, `մկրտարան`, `սրբավայր`.
- **Classical-architecture terminology** — `պերիպտերոս`, `սիւնաշար`, `իոնական կարգ`, `խոյակ`, `պատուանդան`, `ցելլա`, `ճակտոն`, `անթապլէմանթ`, `հիպոկաւսթ`, `պազալթ`.
- **Archaeological terminology** — `պեղում`, `անասթիլոզ`, `վերականգնում`, `սարկոֆագ`, `արձանագրութիւն`, `ամրոց`, `պարիսպ`, `խճանկար`, `բաղնիք`.

`անասթիլոզ` and `անթապլէմանթ` are the two least certain: both are technical loans with no
established Western Armenian form in this repository, and a reviewer may prefer a description to a
transliteration.

### Tests

`tests/e2e/places.spec.ts` grew from 36 to **41** tests.

- `GARNI` added; `PLACES` is six slugs, `ILLUSTRATED` stays at five. The split state returns for
  the fifth time.
- Listing counts 5 → 6 throughout; the English-title fallback test gains "Garni Temple".
- **`historical` left the single-article filter loop** and got a test of its own asserting the pair
  — both present, everything else absent, count exactly two. While it held one article, "the filter
  works" and "the filter shows Erebuni" were the same statement; they are not any more.
- `under("historical")` is now `[EREBUNI, GARNI]` sorted, and a new assertion pins the whole
  distribution: `{historical: 2, monastery: 2, museum: 1, nature: 1}` over six places and five
  pills. That is what makes a new place type invented for a temple fail here.
- Monastery stays at 2, museum at 1, nature at 1, all asserted.
- The placeholder branch has a subject again: Garni renders the inline `<svg>`, no `<img>`, and the
  placeholder caption in all three editions; a companion test forbids `erebuni-fortress`,
  `adoption-of-christianity`, `tigran-the-great`, `kingdom-of-urartu` and `hero-ararat` from its
  head, structured data and hero, asserts `Article.image` is **absent**, and asserts `og:image` and
  `twitter:image` fall back to `og-default` rather than to a sibling's file.
- The listing's placeholder count inverted again, 0 → 1 — the third inversion in three steps, which
  is the argument for pinning the count rather than asserting "none" or "at least one".
- Sitemap: Garni's three url blocks must contain **no** `image:loc`.
- Search: a sixth findability test under the Places group, and a thumbnail test asserting the
  generated `<svg>` and no `<img>`. Both scoped to the card whose href is `/en/places/garni-temple`
  — "Garni" also matches the ghapama article, which names the villages around Geghard and Garni.
- `PENDING_ARTWORK` is asserted to equal `[GARNI]` exactly, in both directions.
- The coordinate test expects `precision: "site"` and pins the point against the village centre,
  the basalt columns and Geghard by distance.
- The homepage test forbids `garni` alongside the other four fragments.
- The existing SEO, JSON-LD, canonical/hreflang and sitemap-URL tests loop `PLACES`, so all six are
  covered by them without further change — including that the H1 is `title` and not `seoTitle`, and
  that no `Place`, `TouristAttraction`, `LocalBusiness`, `Church`, `ArchaeologicalSite` or
  `LandmarksOrHistoricalBuildings` type is emitted.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed (§38 ended with a build) |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — 117 entries across 3 locales, pending note naming `garni-temple` |
| 5 | `npx playwright test --project=desktop places.spec.ts` | **PASS** — 41 passed |
| 6 | `npx playwright test` | **PASS** — 189 passed, 5 skipped, 0 failed |
| 7 | `npm run build` | **PASS** — 123 prerendered routes, up 3 |

Port 3002 was checked again between steps 6 and 7: no listener, only a TIME_WAIT socket draining
from Playwright's dev server, which is a closing connection rather than a held port.

**One deterministic failure occurred and was fixed in the source, not retried.** While inserting
the bibliography, a double-quoted title inside a double-quoted `note` string was not escaped, which
broke `src/data/sources.ts`:

```
src/data/sources.ts(966,401): error TS1005: ',' expected.
esbuild: ERROR: Expected "}" but found "The"
```

Both `typecheck` and `validate:content` failed on it. Fixed by using single quotes for the nested
title. Nothing was retried in the hope of a different result, and none of the three documented
false-failure modes (§30 stale adopted dev server, §32 build-clobbered `.next`, §34 cold-compile
contention) occurred.

The 18 place pages (6 places × 3 editions) were confirmed on disk, including
`.next/server/app/{hy,hyw,en}/places/garni-temple.html`. Each carries `og:image` and
`twitter:image` pointing at `og-default.png`, an `Article` node with **no** `image` property, and
the graph `Organization + WebSite + Article + BreadcrumbList`. The sitemap carries three
`garni-temple` url blocks and no `image:loc` for any of them.

### Preserved

The five existing Places articles are untouched: no prose, coordinate, `placeTypeId`, `featured`
flag, `relatedSlugs` or source entry of theirs changed. All five registered image paths are
unchanged and every asset in `public/` is byte-identical — `git status` shows no change under
`public/`. Khor Virap is still the only featured place and still the only PNG. The homepage still
points at `/hero-ararat.png` directly. `ARTWORK_PROVENANCE`, `getImageSrc`, `getArticleImageSrc`,
`isGeneratedArtwork`, the JSON-LD builders, the listing components and `scripts/validate-content.ts`
are all unchanged.

The deleted §38 scratchpad files were not reintroduced. `.claude/settings.json` was not modified.

### Still open

- **The Matenadaran façade colour — still open**, unchanged from §36 and §38. The delivered
  artwork renders the building in pale grey where the building, and this archive's prose three
  times over, describes dark basalt. Having artwork and having *correct* artwork remain different
  claims.
- ~~**Garni has no artwork.**~~ **RESOLVED in §40.** `public/images/places/garni-temple.webp`
  arrived, was verified and inspected, and is registered. `PENDING_ARTWORK` is empty. The trap
  recorded here — a picture with columns in it, which any classical portico would pass a glance as
  — is now carried by a test that forbids `tigran-the-great`, `adoption-of-christianity` and
  `erebuni-fortress` by name in the article's own head, structured data and hero. One colour
  reservation about the delivered file is recorded in §40 and left open.
- **A dedicated Khor Virap image — still open**, unchanged since §32. It remains the only
  1355 × 793 entry, the only PNG, and at 1.4 MB the heaviest file in the registry by a factor of
  two; its weight is a live performance question, not only an editorial one.
- **File weight in Places.** Erebuni at 742 KB and the Matenadaran at 701 KB, both carrying ICC
  profiles. Together with Khor Virap this is one media-optimisation pass rather than three separate
  problems, and it has not been done.
- **Western Armenian native review — still open**, and now larger by one article. The Garni `hyw`
  text joins the queue from §16, §28, §29, §31, §33, §35 and §37, with the five terminology groups
  listed above flagged specifically.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional, and this
  step deliberately did not change that.
- **The remaining place type.** `settlement` still waits for its first article. `historical` is the
  first type to hold two.
- **Which Tiridates.** Bresson and Fagan's re-attribution is recent and unsettled. If it is taken
  up, the dating section and `importantDates` will need revisiting — and the article is written so
  that would be an edit rather than a rewrite.
- **Wilkinson not read directly.** No copy of REArm NS 16 is online; the argument is taken from
  Russell's endorsement and from summaries, and the source note says so.

No deployment was performed.

---

## 40. Garni Temple artwork — the pending entry, cleared (August 2026)

`public/images/places/garni-temple.webp` arrived. It was verified, inspected and registered in
`IMAGES`, and the slug is out of `PENDING_ARTWORK`. Nothing else changed: no image was generated,
edited, cropped, resized, recoloured, renamed or optimised, no article content moved, and no new
loading path was introduced. Two source files changed — `src/lib/media.ts` and
`tests/e2e/places.spec.ts` — plus the new asset and this document.

This is the fifth time the section has cleared a pending entry (§32 Etchmiadzin, §34 Erebuni, §36
Matenadaran, §38 Lake Sevan, §40 Garni) and the fifth time the whole change was a one-line
registration reaching six surfaces at once. `PENDING_ARTWORK` is empty again, and with six of six
places illustrated the placeholder branch has no subject in this section once more.

`scripts/validate-content.ts` was **not** touched. The §36 wording — *"have no artwork and render
the generated placeholder"* — is unchanged, and so is its logic. It prints nothing now because the
set it counts is empty: every one of the 29 article slugs across the three editions has a
registered file.

### The asset, verified rather than assumed

The container was parsed rather than trusted to its extension.

| Property | Value |
|---|---|
| Path | `public/images/places/garni-temple.webp` |
| Magic | `RIFF` … `WEBP`, RIFF size field 122 584 = file length − 8 (consistent) |
| Chunks | `VP8 (122572)` — **simple** container, lossy VP8, no `VP8X`, no `ICCP`, no `ALPH`, no `EXIF` |
| Frame | keyframe, VP8 version 0, start code `9d 01 2a`, no horizontal or vertical scaling bits |
| Dimensions | **1448 × 1086** (1.333, exactly 4:3) |
| Colour | sRGB, no alpha channel, no embedded ICC profile |
| File size | **122 592 bytes (119.7 KB)** |
| SHA-256 | `f0d6e4fd59eddd04ef531b7b1ce2d3f513b75e72eafb7ffe7485802e7a136518` |

Two facts about this file break patterns the registry had settled into, and both are recorded in
`media.ts` beside the entry rather than left to be rediscovered.

**It is the first WebP here that is not 1586 × 992.** Etchmiadzin, Erebuni, the Matenadaran and
Lake Sevan are all 1586 × 992, a 16:10 frame; this is 1448 × 1086, a 4:3 one. Until now Khor
Virap's 1355 × 793 PNG was the only entry with different dimensions. That is not a fault — the
registry has never required a size — but it changes what the shared centre crops trim, which is
covered below.

**It is the lightest file under `/images/places/` at 119.7 KB**, taking that note away from Lake
Sevan (176 KB) after a single step. Container-wise it matches Etchmiadzin and Lake Sevan: a plain
`RIFF/VP8` with no extended chunks, so the ICC note in `media.ts` still describes exactly two
files — Erebuni and the Matenadaran.

### Visual inspection

The file was opened and looked at, then examined at magnification on the pediment, the capitals,
the frieze bands, the stair and the podium.

**It is unmistakably Garni.** A small peripteral building on a high podium: a hexastyle front of
six columns with the receding flank colonnade behind it, an entablature and pediment above, and a
single steep stair on the entrance front, standing on a rock shelf with treeless ochre ridges
falling away behind. The proportions are Garni's — compact, tall-columned, high-podiumed — and not
the Parthenon's wide octastyle mass, and not a generic Greek temple on level ground.

Checked feature by feature:

| Feature | Finding |
|---|---|
| Podium | Present and correctly high, with moulded base and cornice courses and flanking cheek walls |
| Stair approach | Present, single steep flight on the entrance front |
| Colonnade | Hexastyle front, receding flank row behind — a peripteral plan reads clearly |
| Capitals | **Ionic**, with paired volutes and an egg-and-dart echinus. Not Doric, not Corinthian |
| Pediment | Present, with a raking cornice, a dentil course and an acroterion-like block at the apex |
| Tympanum | **Plain ashlar** — which is correct for Garni, and matters below |
| Frieze | Vegetal scrollwork over a dentil band. No figures, no narrative scene |
| Setting | Treeless arid ridges falling away on the left, a rock shelf underfoot — a plausible Azat-gorge promontory |

**Nothing in the frame asserts a dedication.** There is no cult image, no altar, no statue, no
solar disc or emblem, no Greek or Armenian lettering anywhere, and no date. The tympanum is blank
and the frieze is ornament rather than iconography. That mattered more here than for any previous
entry in this map: the article's central argument is that the building's dedication is *not*
established, and a picture with a sun-god in the pediment would have contradicted the prose it
sits above.

**The stone is not marble.** Sampled against the scene, lit faces sit at luminance 108–128 with
the sky at 223, and shadowed shafts and podium blocks at 47–48. It reads as a rough, dark, coursed
volcanic stone.

### The one reservation, reported rather than corrected

The stone is **warmer than Garni's basalt actually is**. Measured means:

| Region | RGB | Luminance | R−B |
|---|---|---|---|
| Column shaft, lit | 144, 117, 88 | 121 | +56 |
| Column shaft, shadow | 59, 46, 34 | 48 | +25 |
| Entablature | 140, 103, 66 | 108 | +74 |
| Pediment field | 163, 123, 81 | 128 | +82 |
| Podium block | 57, 46, 34 | 47 | +23 |
| Hillside (reference) | 151, 126, 103 | 130 | +48 |
| Sky (reference) | 239, 220, 202 | 223 | +37 |

Real Garni is a grey-**blue** basalt, which would give a negative or near-zero R−B. Everything
here is positive, and the building is warmer than the hillside behind it (+56 to +82 against +48),
so the warmth is not only the golden-hour light lying over the whole scene — some of it is in the
stone. The shadowed faces are the closest to right: dark grey-brown at luminance 47, which reads
convincingly as volcanic rock.

So: **not white marble, not close to it, but ochre-warm where the real building is cool grey-blue.**
This is the same *kind* of finding as the Matenadaran façade colour recorded in §36, and it is
handled the same way — reported here, not corrected, because a delivered asset is registered as
delivered. It is listed as open below. It is a weaker reservation than the Matenadaran's: that one
contradicts the article's own prose about dark basalt three times over, whereas this article does
not describe the stone's hue in a way the picture contradicts.

A second, smaller fidelity note, recorded once so it is not rediscovered as a fault: the rendered
stair reads as a broader flight of many shallow risers, where Garni's is famously a short flight of
very high ones. Not visible at card size, and not corrected.

### Crop suitability

Every slot is a centre crop with `object-cover` and `object-center`; `PORTRAIT_FOCUS` is
writers-only and does not apply. Each was rendered from the source and inspected. The 4:3 source
makes this file behave differently from the four before it, which is the whole reason this section
is longer than usual.

| Slot | Component | Crop of 1448 × 1086 | Result |
|---|---|---|---|
| Compact card (homepage) | `ArticleCard variant="compact"`, `aspect-[4/3]` | **1448 × 1086 — no crop at all** | The whole frame. The one slot a 4:3 source fits exactly |
| Mobile article hero | `ArticleLayout`, `aspect-[4/3]` | **no crop** | As above |
| Tablet article hero | `ArticleLayout`, `sm:aspect-[3/2]` | 1448 × 965, 61 px trimmed top and bottom | Everything retained; strictly looser than the 16:9 below |
| Standard listing card | `ArticleCard`, `aspect-[16/9]` | 1448 × 815, **136 px trimmed top and bottom** | Pediment apex survives, with little headroom to spare |
| Desktop article hero | `ArticleLayout`, `lg:aspect-[16/9]` | as listing card | As above |
| Search thumbnail | `SearchResultCard`, `w-32`/`lg:w-40` at card height (≈128 × 170) | 818 × 1086, 315 px trimmed each side | Holds well: pediment, front colonnade, capitals, stair and podium all present; the rear flank columns are clipped |

The number worth carrying forward is **136**. A 1586 × 992 file loses 50 px top and bottom to the
16:9 slots; this one loses 136. The pediment apex sits close enough to the top edge that it was
checked rather than assumed — it is retained, but a future 4:3 delivery with less headroom would
lose it, and nothing in the code would say so. **No crop logic was added and none is needed.**

### Media registry

One line, in the places block of `IMAGES`:

```ts
"garni-temple": "/images/places/garni-temple.webp",
```

Reached through the existing `getImageSrc` and `getArticleImageSrc` only. No Garni-specific media
logic, no special crop logic, no new image field, no new provenance infrastructure, no component
change and no new call site — every consumer already asks the registry.

### Provenance

Unchanged mechanism, entirely inherited:

- `isGeneratedArtwork({ slug: "garni-temple" })` returns `true`, because the slug is now in
  `IMAGES` and the article declares no `image` of its own.
- The AI-generated **illustration** disclosure appears — the same branch cuisine and the other
  places use, not the portrait one. Confirmed in the built HTML of all three editions:
  - `en` — "AI-generated illustration for Garni Temple — an imagined scene."
  - `hy` — «Արհեստական բանականությամբ ստեղծված նկարազարդում «Գառնիի տաճար» հոդվածի համար — երևակայված պատկեր է։»
  - `hyw` — «Արհեստական բանականութեամբ ստեղծուած պատկերազարդում՝ Գառնիի տաճար — երեւակայուած պատկեր է։»
- The placeholder disclosure is gone, and the hero renders `<img>` rather than the generated
  inline `<svg>`.
- `ARTWORK_PROVENANCE` is **unchanged** — same object, same two fields, one provenance for the
  whole registry.
- No per-image provenance mechanism was introduced, and no other article's provenance behaviour
  changed.

### Pending-artwork removal

`"garni-temple"` was removed from `PENDING_ARTWORK`, which is now empty for the fifth time. The
list itself stays, with its comment rewritten to record what was rejected on the way out. Garni is
the third rejection worth keeping, after the Matenadaran's Mashtots portrait and Lake Sevan's three
near misses, and it is the sharpest of them: the trap was **a picture with columns in it**.
`tigran-the-great.webp` has classical pilasters on a palace terrace behind a royal portrait and
would have passed a glance as "Armenian antiquity with columns" while captioning a
first-century-BC king's capital as a peripteral building on a gorge rim two centuries later.
`adoption-of-christianity.webp` is a baptism before a medieval domed church. `erebuni-fortress.webp`
was excluded on principle: it is the other `historical` place.

Consequences, each checked rather than assumed:

- `validate:content` no longer names Garni, and prints no "no artwork" note at all.
- The Places listing contains **zero** artwork placeholders — asserted as a count.
- All three locale pages use the final WebP.
- No historical-site image leaks into Garni: a test forbids all three rejected files by name from
  its head, structured data and hero.

### Verified surfaces

Every one read from the built output, not inferred from the registry:

| Surface | Evidence |
|---|---|
| Places listing card | `main img` sources on `/en/places` contain `garni-temple.webp`; seven images for six places plus the featured repeat; zero `svg[role="img"]` |
| Article hero | `header figure img` in `hy`, `hyw` and `en`, with no `svg[role="img"]` in the figure |
| Global search card | The result card filtered by `a[href="/en/places/garni-temple"]` carries the thumbnail — scoped by href, not taken as the first result, because "Garni" also matches the ghapama article |
| Related-article cards | The same `ArticleCard` component as the listing, covered by the same lookup |
| Open Graph | `og:image` = `https://armat.site/images/places/garni-temple.webp` in all three editions |
| Twitter | `twitter:image` = the same absolute URL in all three editions |
| `Article.image` JSON-LD | `{"@type":"ImageObject","url":"https://armat.site/images/places/garni-temple.webp"}`, present where §39 asserted it absent |
| Sitemap | Exactly three `image:loc` entries, one per locale route, each inside its own `<url>` block |

The JSON-LD graph is unchanged in shape: `Organization + WebSite + Article + BreadcrumbList` in
all three editions. No `Place`, `TouristAttraction`, `ArchaeologicalSite`,
`LandmarksOrHistoricalBuildings`, `Temple` or `LocalBusiness` type appeared. The only
structured-data consequence of this step is the generic `Article.image` resolving to the
registered file.

### Tests

`tests/e2e/places.spec.ts` stays at **41** tests. No test was added or dropped; the ones that
asserted the pending state were inverted.

- `GARNI` moved into `ILLUSTRATED`, which is now all six places, and `ARTWORK` gained
  `"garni-temple": "/images/places/garni-temple.webp"`.
- **`ILLUSTRATED` is deliberately not collapsed into `PLACES`** even though they coincide again.
  They have coincided four times before and split again every time, and the placeholder assertions
  read this list to decide what may render an `<svg>`. Its comment says so explicitly.
- *"the pending place renders the generated placeholder and says so"* → *"the newest place renders
  its own file and is captioned as an illustration"*: `<img>` present with the right file, `<svg>`
  absent, illustration caption present, placeholder caption absent, in all three editions.
- *"the pending place borrows no other article's artwork"* → *"the newest place borrows…"*, kept
  across the registration exactly as the Matenadaran's and Lake Sevan's were. It still forbids
  `erebuni-fortress`, `adoption-of-christianity`, `tigran-the-great`, `kingdom-of-urartu` and
  `hero-ararat` by name, and now asserts `Article.image` **is** the registered cover and that
  `og:image`/`twitter:image` are the cover rather than `og-default`, where §39 asserted the
  opposite of all three.
- The listing flipped from *exactly one* generated `<svg>` to **zero** — the fourth inversion of
  that count in four steps (§37 one, §38 zero, §39 one, §40 zero), which is the argument for
  pinning it rather than asserting "none" or "at least one".
- The search-thumbnail loop gained `[GARNI, "Garni"]`, scoped by href.
- *"the pending place is findable in search and shows the placeholder thumbnail"* → *"the newest
  place's search card carries its own thumbnail and no placeholder"*. Kept separate from the loop
  because `SearchResultCard` calls `getImageSrc` directly while the hero goes through
  `getArticleImageSrc`, so one can be right while the other is not.
- The sitemap's per-block assertion now covers `MATENADARAN`, `SEVAN` **and** `GARNI`: three
  `<url>` blocks each, each carrying its own `image:loc`. The Garni no-`image:loc` block from §39
  was removed as now false.
- *"the pending list names exactly the one place"* → *"no place is waiting for artwork, and every
  one resolves to its own file"*: `PENDING_ARTWORK` asserted `toEqual([])`, and every slug in
  `PLACES` resolves through the registry to its own file.
- `no unrelated article artwork changed` pins `registry[GARNI]` by name alongside the other five,
  and its exact-object assertion over History, Writers, Works and Cuisine is untouched — that is
  what would fail on any path in those four categories being retyped in passing.
- Two tests were **renamed** rather than rewritten, because "the newest place" now means Garni:
  the Lake Sevan hero, borrowing and search-card tests are now named for Lake Sevan, and the
  Matenadaran metadata test for the Matenadaran.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear (no listener) |
| 2 | remove `.next` | removed (§39 ended with a build) |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — 117 entries across 3 locales, and **no** "no artwork" note |
| 5 | `npx playwright test --project=desktop places.spec.ts` | **FAIL then PASS** — see below, then 41 passed |
| 6 | `npx playwright test` | **1 failed then PASS** — see below, then 189 passed, 5 skipped |
| 7 | `npm run build` | **PASS** — 123 prerendered routes, compiled in 9.6 s |

Port 3002 was confirmed to have no listener again between steps 6 and 7.

**Failure 1 — mine, deterministic, fixed in the source.** Playwright refused to collect the spec
at all:

```
Error: duplicate test title "the newest place's search card carries its own thumbnail and no
placeholder", first declared in places.spec.ts:991
```

Renaming the Garni search-card test to "the newest place's…" collided with the Lake Sevan test that
had carried that title since §38. Fixed by renaming the Lake Sevan one to "Lake Sevan's search card
carries its own thumbnail and no placeholder", which is what it has actually been about since Garni
arrived. A duplicate-title scan was then run over the whole file: none remain.

**Failure 2 — not mine, and not deterministic.** The first full run had one failure in a spec this
step does not touch:

```
[desktop] › tests/e2e/cuisine.spec.ts:351 › the cuisine dropdown only offers pages inside this edition
  at cuisine.spec.ts:360
```

Line 360 is `expect(nav.getByRole("link", { name: dict.nav.allCuisineArticles })).toBeVisible()` —
the dropdown had not opened. The cause is the hydration window `tests/e2e/helpers.ts` documents:
the header is server-rendered, so its buttons are clickable a moment before React attaches the
handler, and a click landing in that window is silently dropped. `openHeaderPanel` exists to retry
through exactly that, and **this test does not use it** — it calls `.click()` directly on line 355.
`.next` had been removed at step 2, so the dev server was compiling routes on demand under
parallel load, which widens that window.

It passed in isolation (1 passed) and passed on a full re-run with **no code changes between
runs**, 189 passed. It is recorded here rather than fixed: it is a latent flake in a spec outside
this step's scope, involving no image, no place and no registry, and silently editing another spec
during an artwork registration is the wrong trade. It is listed as open below.

The 18 place pages (6 places × 3 editions) were confirmed on disk, including
`.next/server/app/{hy,hyw,en}/places/garni-temple.html`, each carrying the WebP in `og:image`,
`twitter:image` and `Article.image`, and each rendering an `<img>` in the header figure.

### Preserved

Nothing outside the registry, the pending list and the places test file was touched.

- **The Garni article is unchanged in all three editions.** No prose, no inscription treatment, no
  AD 77 discussion, no Bresson/Fagan caveat, no Wilkinson caveat, no temple-function or Mihr
  wording, no architectural interpretation, no earthquake chronology, no reconstruction discussion,
  no source, no coordinate, no `relatedSlugs`, no `SectionLink`, no SEO field, no `placeTypeId`,
  and no filter behaviour. `git diff` shows no change to any `articles/places.ts`, to `geo.ts` or
  to `sources.ts` in this step.
- **Existing artwork files** — all six files under `public/images/places/` are unmodified; the only
  change under `public/` is the new file itself. Khor Virap keeps its PNG (still byte-identical to
  `hero-ararat.png`), and Etchmiadzin, Erebuni, the Matenadaran and Lake Sevan keep their WebPs.
- **The homepage** — `Hero.tsx` still points at `/hero-ararat.png` directly, the file is unchanged,
  and it is still absent from `IMAGES`.
- **Layout components and JSON-LD builders** — `ContentPhoto`, `ArticleLayout`, `ArticleCard`,
  `SearchResultCard`, `seo.ts` and `sitemap.ts` are untouched.
- **`scripts/validate-content.ts`** — not touched at all.
- `.claude/settings.json` was not modified, and the scratchpad files deleted in §38 were not
  reintroduced.

### Still open

- **The Matenadaran façade colour — still open**, unchanged from §36, §38 and §39. Pale grey where
  the building and this archive's prose describe dark basalt.
- **The Garni stone colour — new, and open.** Ochre-warm where the real basalt is grey-blue, with
  the measurements above. Weaker than the Matenadaran case because this article does not describe
  the hue in a way the picture contradicts, but recorded for the same reason: a delivered asset is
  registered as delivered.
- **A dedicated Khor Virap image — still open**, unchanged since §32. The only 1355 × 793 entry,
  the only PNG, and at 1.4 MB the heaviest file in the registry by a factor of two. Its weight is a
  live performance question, not only an editorial one.
- **File weight in Places — still open.** Erebuni at 742 KB and the Matenadaran at 701 KB, both
  carrying ICC profiles. With Khor Virap this remains one media-optimisation pass rather than three
  problems. Garni at 120 KB did not add to it and is further evidence the ceiling is not inherent.
- **Dimension drift in the registry — new, and minor.** `garni-temple.webp` is the first WebP here
  that is not 1586 × 992. Nothing requires uniformity, but the 16:9 crops now trim 136 px from this
  file against 50 px from the others, and a future 4:3 delivery with less headroom would lose the
  top of its subject with nothing in the code to say so.
- **Western Armenian native review — still open**, unchanged. The Garni `hyw` article and its five
  flagged terminology groups remain in the queue from §16, §28, §29, §31, §33, §35, §37 and §39.
  This step did not touch its prose.
- **The Bresson and Fagan attribution — still open and unsettled.** Whether the inscription names
  Trdat I or Trdat the Great remains a live argument, unaffected by the artwork.
- **Wilkinson not read directly — still open.** No copy of REArm NS 16 is online; the argument is
  taken from Russell's endorsement and from summaries, and the source note says so.
- **Nothing links *to* any place yet** — `getRelatedArticles` remains one-directional.
- **A latent hydration flake in `cuisine.spec.ts` — new.** Line 355 clicks the nav submenu button
  directly instead of routing through `openHeaderPanel`, so it can lose the click to the
  pre-hydration window on a cold server. It failed once here and passed on re-run and in isolation.
  Left unfixed as out of scope for an artwork step; the fix is one call swapped for the helper.
- **The remaining place type.** `settlement` still waits for its first article.

No deployment was performed.

---

## 41. Places — Geghard Monastery, the seventh place and the third monastery (August 2026)

Geghard is the **seventh Places article** and the third under the `monastery` filter, which is the
first time that pill has held more than two. It is also the first place in the section whose
`relatedSlugs` points at **another place**.

It shipped **ahead of its artwork**. `PENDING_ARTWORK` filled for the sixth time (§31, §33, §35,
§37, §39, §41) one step after §40 emptied it for the fifth, which is the whole argument for the
`ILLUSTRATED`/`PLACES` split in `places.spec.ts` surviving the two lists briefly coinciding.

The English article, the sources, the chronology, the coordinate, the taxonomy plumbing, the
artwork decision and the heraldry research landed in the previous step. **This step wrote the two
Armenian editions**, audited all three for superseded research, checked structural and numerical
parity, verified the bibliography's identifiers against the live registries, extended the test file
and ran the suite.

### Files changed

Four, plus this document.

| File | Change |
|---|---|
| `src/data/locales/hy/articles/places.ts` | +245 — the Eastern Armenian edition |
| `src/data/locales/hyw/articles/places.ts` | +245 — the Western Armenian edition |
| `tests/e2e/places.spec.ts` | +82 — one new test (see below) |
| `scratchpad/check.ts` | new — the per-slug parity harness, restored |

**Not touched:** `src/data/locales/en/articles/places.ts`, `src/data/geo.ts`, `src/data/sources.ts`,
`src/lib/media.ts`, `scripts/validate-content.ts`, anything under `public/`, and
`.claude/settings.json`. The last of those is worth a sentence: the permission layer appended six
allowlist entries to it during this session as a side effect of running `curl` and `node -e`, and
the file was restored with `git checkout` before anything else. Its diff is empty.

### Final filter counts

Seven places over five pills. The vocabulary is unchanged — no place type was invented for a
rock-cut monastery — and the only movement is `monastery` going from two to three.

| Pill | Count | Articles |
|---|---|---|
| All | 7 | — |
| `monastery` | **3** | Khor Virap, Etchmiadzin Cathedral, **Geghard** |
| `historical` | 2 | Erebuni Fortress, Garni Temple |
| `museum` | 1 | Matenadaran |
| `nature` | 1 | Lake Sevan |

### Final article structure — identical in `hy`, `hyw` and `en`

Ten sections, paragraphs **3, 3, 4, 4, 4, 5, 4, 4, 4, 3** — **38** in all. Six `keyFacts`, thirteen
`importantDates`, five `interestingFacts`, two `significance` paragraphs, two `relatedFigures`,
three `relatedSlugs`, three `SectionLink`s.

| Section | Covers |
|---|---|
| `where-it-is` | The side gorge above the Azat, Goght, the approach, and the Garni pairing |
| `the-cliffs` | The volcanic rock, the spring, and why "cave monastery" gets the history backwards |
| `ayrivank` | The earlier name, the Gregory tradition, Draskhanakerttsi c. 923, the six-hundred-year gap |
| `tradition-and-evidence` | The chapel outside the walls; where the dated record actually begins |
| `the-katoghike-and-gavit` | The 1215 masonry church, the Zakarid patrons, the gavit as a building type |
| `cut-from-the-rock` | What rock-cut means precisely; Galdzak; the stalactite vault; the acoustics |
| `the-proshyans` | The Khaghbakian house, the acquisition, the 1283/1288 works, and the carving |
| `khachkars-and-books` | Inscriptions, khachkars, Mkhitar, the colophons, and two corrections |
| `the-spear-and-the-name` | The name change, the relic tradition, its documented career as an object |
| `before-you-see-it` | UNESCO criterion (ii), the three things to carry through the gate, and the fourth |

The three `SectionLink`s: `where-it-is` to `garni-temple`, `ayrivank` to
`adoption-of-christianity`, `the-spear-and-the-name` to `etchmiadzin-cathedral`.

### Early tradition versus the surviving medieval complex

This is the distinction the article is built around, and it is roughly a thousand years wide.

Under its earlier name **Ayrivank**, the monastery of the cave, tradition takes the foundation back
to Gregory the Illuminator in the generation of the kingdom's conversion. The article reports that
as a tradition and says why: no inscription, no excavated fourth-century layer, no contemporary
text placing Gregory here. What the tradition does carry — a cave, a spring, a hermitage — is a
plausible shape for an early Armenian monastic site and an entirely different claim from the
survival of fourth-century architecture.

The first firm documentary footing is Yovhannes Draskhanakerttsi taking refuge at Ayrivank during
the Arab raids of about 923. Between Gregory and that notice lies six hundred years with nothing in
it that can be pointed at. Everything a visitor can actually see was built three hundred years
after Draskhanakerttsi.

### Chronology

Unusually well dated, because the dates are cut into the buildings themselves. Thirteen entries:
about 923 (Draskhanakerttsi); 1164 (the cross-stone outside the walls, the oldest dated object on
the site); 1177 and 1181 (the chapel's wall inscriptions, the second recording the Catholicos of
the Aghvans donating relics); 1200 (the water-supply inscription naming Zakare and Ivane, and
sometimes wrongly attributed to the Proshyans, who were not yet there); 1215 (the Katoghike, by its
south-portal inscription); 1225 (the chapels on the gavit's north-east corner); before 1250 (the
first rock-cut church, with Galdzak named as architect); 1283 and 1288 (the Proshyan church and the
upper carved chamber); 1291 (Mkhitar's inscription); 1655 (Tavernier sees the relic); 2000 (World
Heritage).

Two cautions are in the article because a reader will meet them: UNESCO's two documents place the
oldest chapel on opposite sides of the complex, and the later of the two gives its earliest
inscriptions as 1177/1181 where the survey it rests on records the older 1164 cross-stone.

### Rock-cut architecture

`rock-cut` is treated as a precise description rather than a loose one. The chambers were excavated
inward and downward from the cliff face, worked from the top, so what remains is not a lined cave
but a room whose walls, columns, vaults and dome are one continuous piece of the mountain — no
joints, because no blocks. The article then refuses the binary: parts of Geghard are built (the
Katoghike, the gavit, the wall, the ruined seventeenth-century ranges), parts are carved outright,
and parts are both (the chapel with a masonry front and a hollowed back; cells that are recesses
closed with a built wall). The masonry church came **first**; the great carved halls were added to
it.

The technical argument is overhead: domes on squinches and, in one case, a stalactite vault, which
in masonry is a problem solved with cut blocks and here had to be arrived at by removal from a
single mass with no way to correct a mistake. The famous acoustics are stated as a **consequence,
not a design** — no medieval source describes the rooms as built for sound.

### Proshyan patronage, the corrected floruit, and the acquisition

The carved rooms belong to a change of ownership: the Khaghbakian house, renamed Proshyan after
Prosh son of Vasak, a vassal of the Zakarids under Mongol overlordship and by mid-century the
effective lord of the district.

**Prosh's dates are a floruit, not a lifespan.** `relatedFigures.lifespan` reads `active 1223–1284`
/ `գործուն 1223–1284` / `գործօն 1223–1284`, and each edition explains why: 1223 is an attestation
and cannot be a birth year, because his father was already commanding in 1216; the death date
circulates as 1283, 1284 or 1285 with nothing to settle it; and the article therefore declines to
invent a biological lifespan. He is a **sub-vassal and lord of Vayots Dzor**, explicitly **not**
commander of the Zakarid army — the supreme office was the amirspasalar and no Khaghbakian held it.

**The acquisition** is dated conservatively and identically in all three editions: *in the decade
before Avag's death in 1250* — `1250 թվականից առաջ ընկած տասնամյակում` (`hy`), `1250 թուականէն
առաջ ինկած տասնամեակին` (`hyw`). A purchase is reported as what is *usually said* and then
unpicked: one survey reads it out of a later inscription, the ICOMOS evaluation does not mention a
purchase at all, and no text documenting a sale has been published in a form a reader can check.
The competing year 1215 is named as a conflation with the church's own dated inscription, traced to
the impossible c. 1214 entry in the 1973 survey that the same volume contradicts on its own pages —
an error reprinted as recently as 2023.

### Donabédian, and why the carving is not called a coat of arms

No edition labels the relief unqualifiedly. Each carries, in this order: the description (an
animal's head holding a ring, two facing lions attached to it, an eagle with a smaller animal
below); the attribution of the heraldic reading to Garegin Hovsepian, and the fact that specialists
have passed it on with *probably* attached every time; that published descriptions disagree about
which animal is uppermost and even which chamber the relief is in; **Donabédian's objection** —
that motifs of this type recur on monuments built for unrelated families, which he argues excludes
reading them as dynastic emblems at all, that a lion and an ox appear on the Zakarid church in this
very courtyard, and that he prefers an **apotropaic** reading; that medieval Greater Armenia left
neither seals nor coins, so the regulated armorial system that did exist in Cilicia cannot simply
be assumed here; that no study devoted to this relief has ever been published; and that the motto
often quoted alongside it has no medieval source of any kind.

Donabédian is presented as a **scholarly interpretation supported by his argument** — "has
objected", "which he argues", "he prefers" — and not as a settled verdict. The heraldic reading is
not deleted; it is attributed and qualified.

### The Holy Lance

Treated as institutional history, not as an artefact claim. The name Geghard is short for
Geghardavank, the monastery of the spear, and displaced Ayrivank at some point in the thirteenth
century; the often-repeated "first recorded in a document of 1250" is unpicked, because no source
identifies the document and the survey the claim traces to says only that the change probably
happened around then.

The tradition that the monastery held the spear of the Crucifixion, brought by the Apostle
Thaddeus, is attested from the twelfth century — a hymn of 1159 is the earliest reference — and is
therefore a tradition of that date, not a record of the first century. The scholar who compiled the
standard survey of the monastery's own documents wrote flatly that Thaddeus never reached Armenia,
and noted two rival spearheads circulating in the medieval Middle East.

What **is** documented is the object's later career: Prosh commissioned a reliquary in 1268; the
surviving case is a 1687 replacement copying his inscription; Tavernier saw and drew the relic here
in 1655; it is now at Etchmiadzin, though the Armenian Church's own institutions give different
centuries for the move and the online date of 1766 traces to nothing. No scientific examination has
ever been published, and the claim that foreign specialists confirmed its authenticity corresponds
to no study in any database.

### Manuscripts and the cultural-centre claim

Deliberately understated, because the usual account overstates it. The firm evidence is Mkhitar of
Ayrivank, placed at this monastery by the standard bibliography of Armenian literature and recorded
here by an inscription of 1291; a visitor in 1387 found his writings still there; and colophons put
copying at Ayrivank in 1444 and repeatedly down to 1476, with one scribe named across a dozen of
those years.

Two corrections are carried in every edition. The claim that Geghard held a **library** rests on no
cited source, and the monastery has no known curriculum, faculty or named graduates — it is not in
the class of Gladzor or Tatev and is not described as though it were. And **Simeon of Ayrivank**,
routinely named alongside Mkhitar as a thirteenth-century historian, was not: the surviving notices
put him around the turn of the fifteenth century and describe him as a teacher and a pupil of
Grigor Tatevatsi. That error is UNESCO's own and has been copied outward from there.

### UNESCO status

Geghard and the upper Azat valley were inscribed in 2000 as property no. 960 under **criterion (ii)
alone**. Armenia proposed criteria (i), (ii) and (vi); the two concerning unique artistic
achievement and religious significance were **not adopted**, so they are rejected nominations
rather than UNESCO findings. The inscription is about architecture, and the article says so.
**Garni is not part of the property** — the commonest thing people get wrong about the two sites at
once, and the reason `where-it-is` draws the distinction explicitly.

### Parity

`scratchpad/check.ts` was **restored**. §37 recorded it as the harness that prints section shape and
the per-group numeral multiset for one slug across the three editions; it was among the scratchpad
files deleted in §38, so it did not exist in the tree. It was rewritten against the current
`validateCrossLocaleNumbers` — the same `/\d{2,}/g` rule and the same nine field groups — and made
tolerant of a missing edition, which is the state it is most useful in. It was run after `en` alone,
after `hy`, and after `hyw`.

Structural parity, all sixteen fields it compares, agree exactly across `hy`, `hyw` and `en`: slug,
category, `placeTypeId`, `featured`, section ids, section order, paragraphs per section, total
paragraphs, `keyFacts`, `importantDates`, `interestingFacts`, `significance`, `relatedFigures`,
`relatedSlugs`, `SectionLink` count and `SectionLink` targets.

The structure recorded in the brief for this step — 10 sections, 3/3/4/4/4/5/4/4/4/3, 38 paragraphs,
6/13/5/2/3 — was **derived from the final English source rather than assumed**, and it still held,
so it was adopted rather than overridden.

### The numeral inventory, per validator field group

Held to exactly, in all three editions:

| Group | Numerals |
|---|---|
| `intro` | 1164 |
| `summary` | 1215, 1283, 2000 |
| `seoTitle` | none |
| `metaDescription` | none |
| `keyFacts` | 960, 1215, 1283, 2000 |
| `importantDates` | 923, 1164, 1177, 1181, 1200, 1215, 1225, 1250, 1283, 1288, 1291, 1655, 2000 |
| `sections` | 923, 1159, 1164, 1177, 1181, 1200, 1210, 1212, 1215 x2, 1225, 1250 x3, 1268, 1283, 1288, 1291, 1387, 1444, 1476, 1655, 1687, 1766, 2000 |
| `interestingFacts` | 1164 |
| `relatedFigures` | 1223, 1284 |

Four disciplines made that reachable and are worth keeping.

**No `1240s`.** The brief warned that the phrase would inject a stray `1240` into whichever group it
landed in. It is used in no edition; the acquisition is phrased against Avag's death, which puts
1250 in the groups that already hold it. The string `1240` occurs nowhere in any edition.

**Centuries are words, not digits, in every edition.** English writes "the twelfth century";
Armenian writes `տասներկուերորդ դար` / `տասներկուերորդ դարու`, not the Roman `XII դար` that the `hy`
house style uses for centuries elsewhere. That is a deliberate local departure — Roman numerals are
letters and would have been numeral-safe too, but the English spells them out and matching it kept
the three editions reading the same way. Recorded so it is not "corrected" later without checking
what it protects. Likewise spelled out: forty years, six hundred years, three hundred years, a
thousand years, half, and the ordinals in `before-you-see-it`.

**No thousands separators anywhere**, and no year written with punctuation inside it. `960` is
written bare after `թիվ` / `թիւ`, so it extracts as one group in all three.

**`301` was deliberately not added.** `ayrivank` places the Gregory tradition "in the generation of
the kingdom's adoption of Christianity" without a year, and the Armenian editions say the same. A
year there would have been correct history and a numeral the English group does not have.

`relatedFigures.description` is **not** in any checked group — only `lifespan` is — but the seven
numerals in Prosh's description and the three in Mkhitar's were matched across the editions anyway,
because the alternative is three descriptions that quietly say different things about the same
disputed dates.

### Western Armenian review pass

The mechanical scan over the `hyw` block found **zero** occurrences of `և`, **zero** of `ություն`,
zero Eastern `-ված` participles, zero untranslated English (the only Latin in the block is the
`Armat` byline, the `Geghard Monastery` keyword — romanised on purpose, per the keywords rule — and
the `(ii)` criterion), and zero Eastern syntax copied from `hy`: no `նրա`/`նրան`/`նրանք`, no Eastern
locative `-ում`, no `որը`, no ` մեջ`. Every apparent hit was a substring of a correct Western word
(`ընդհանրապէս`, `նոյնացում`, `բոլորը`, `ձորը`).

The mechanical pass is not what caught the real problems. **Two terminology errors were found by
reading the sensitive-term census and were corrected**, and both would have passed every automated
check in the repository:

1. **`կաթողիկէ` used for "dome".** Nine occurrences across four sections, `significance` and
   `interestingFacts`. `Կաթողիկէ` is the *proper name of the main church at Geghard*; the Western
   Armenian for a dome is `գմբէթ`, which is what the rest of the `hyw` edition already uses. Every
   sentence about the domes, the domes on squinches and the seamless vault was naming the church
   instead. Corrected to `գմբէթ` / `գմբէթաւոր` / `գմբէթներով`; the four surviving `Կաթողիկէն` are
   the church and are correct.
2. **`մատենադարան` used for "library".** Two occurrences. Defensible as Western vocabulary in the
   abstract, but the `hyw` edition already uses `գրադարան` throughout `places.ts`, and
   `Մատենադարան` is the title of another article in this very section. Corrected to `գրադարան`,
   which also makes the two Armenian editions agree.

The sensitive terminology was then counted term by term against `hy`. The two editions carry the
same inventory at the same frequencies, differing only in orthography:

| Term | `hy` | `hyw` |
|---|---|---|
| Geghard / Geghardavank | Գեղարդ (39), Գեղարդավանք (2) | same counts |
| Ayrivank | Այրիվանք (10) | Այրիվանք (10) |
| Gregory the Illuminator | Գրիգոր Լուսավորչի / -ին | Գրիգոր Լուսաւորիչի (3) |
| Prosh / Proshyan | Պռոշ (19), Պռոշյան (9) | Պռոշ (19), Պռոշեան (9) |
| Zakarid | Զաքարյան (6), Զաքարե (5) | Զաքարեան (6), Զաքարէ (5) |
| gavit | գավիթ (6) | գաւիթ (6) |
| rock-cut | ժայռափոր (10) | ժայռափոր (10) |
| tomb chamber | դամբարան (2) | դամբարան (2) |
| khachkar | խաչքար (6) | խաչքար (6) |
| inscription | արձանագրություն (22) | արձանագրութիւն (19) |
| relic / spear | գեղարդ (10), մասունք (7) | գեղարդ (10), մասունք (7) |
| dome | գմբեթ (8) | գմբէթ (8) |
| Katoghike | Կաթողիկե (4) | Կաթողիկէ (4) |
| apotropaic | չարխափան՝ չարիք վանող (1) | չարխափան՝ չարիք վանող (1) |
| heraldry | զինանշան (3) | զինանշան (3) |

`վիմափոր` is used **nowhere**: `ժայռափոր` is the term in both editions, consistently, and mixing
the two synonyms inside one article would read as a distinction that is not being drawn.

**The whole Western Armenian article remains flagged for native review**, mechanical validation
notwithstanding. The specific items are listed below.

### Sources

The bibliography was registered in the previous step and **was not touched here**. It is twelve
entries, all of which the article rests on, and no claim in any edition reaches outside them. What
this step did was verify that every identifier resolves and identifies the intended work.

| Identifier | Resolves | Identifies |
|---|---|---|
| `archive.org/details/daa-06-geghard-1973` | 200 | *Documents of Armenian Architecture* 6, Geghard, 1973 |
| `whc.unesco.org/en/list/960/` | 200 | World Heritage list entry 960 |
| `whc.unesco.org/archive/advisory_body_evaluation/960.pdf` | 200 | ICOMOS advisory evaluation, no. 960 |
| doi `10.1093/gao/9781884446054.article.t031172` | 302 to OUP auth | "Geghard Monastery", **Patrick Donabédian**, Oxford Art Online, 2003 |
| doi `10.30687/978-88-6969-469-1/005` | 200 | "Armenia – Georgia – Islam…", **Patrick Donabédian**, *Eurasiatica*, Ca' Foscari, 2020 |
| doi `10.4159/harvard.9780674432635` | 202 | *Colophons of Armenian Manuscripts, 1301–1480*, Harvard UP, 1969 |
| doi `10.1017/S001781600001748X` | 200 | Michael E. Stone, *Harvard Theological Review*, 1976, 289–300 |
| isbn `9782700400274` | OpenLibrary | Der Nersessian, *L'art arménien*, Arts et métiers graphiques, 1977 |
| isbn `9782916716572` | OpenLibrary | *Horomos Monastery: Art and History*, ed. Vardanyan, 2015 |
| isbn `9781403966360` | OpenLibrary | Hovannisian, *The Armenian People…* — **see below** |
| `operaipogea.it/…CARPICECI…Hypo2023…pdf` | 200 | Carpiceci et al., Hypogea 2023, 251–260 |

Each DOI was resolved through **Crossref content negotiation** rather than by following the link,
so the title, author, publisher and year in the registry were compared against the registrar's own
metadata. All four match exactly, including both Donabédian entries. The UNESCO list page returns
403 to a bare `curl` and 200 to a browser user-agent; that is a bot block, not a dead link, and the
sibling PDF on the same host returns 200 either way.

**The late Donabédian source is present and correct.** `10.30687/978-88-6969-469-1/005` is open
access, resolves to the intended chapter, and its note in `sources.ts` states exactly what the
article uses it for: the objection to the dynastic-emblem reading, the apotropaic preference
following Eastmond and Blessing, and the identification of Matevosyan (2002) as the standard modern
statement of the heraldic view.

**One finding, reported rather than changed.** ISBN `9781403966360` is catalogued by OpenLibrary as
the **two-volume set** ("Armenian People From Ancient to Modern Times, 2 Volume Set", 896 pp.,
Palgrave Macmillan, 2004), where the registry titles it *Volume I: The Dynastic Periods*. The work
is right and the chapter cited — Bedrosian, on the Seljuk and Mongol periods — is in volume I, so
nothing in any article is wrong; the identifier is simply the set's rather than the volume's. It is
**not** newly added for Geghard: three other articles have used it since before this step, so
changing it means editing four bibliography entries in a step scoped to two article files. Recorded
as open below.

**No page numbers were invented.** The two entries that name page ranges — Stone 289–300, Carpiceci
251–260 — both had them confirmed by the registrar or by the PDF itself. Hovsepian's 1928
*Khaghbakeank' kam Prosheank'* remains **deliberately unregistered**: no digitised copy could be
consulted, and a page reference for it would have been fiction. It is named inside the Der
Nersessian note as the origin of the heraldic identification instead.

The notes distinguish the four categories the archive requires: **directly read** (the 1973 survey,
both UNESCO documents, the 2020 Donabédian, the 2023 congress paper); **print-only, not read
directly** (Der Nersessian 1977, Thomson 1995, Sanjian 1969, Vardanyan 2015, Hovannisian 2004, each
cited for a specific attested claim); **institutional** (the two UNESCO documents, cited for the
designation and explicitly *not* as authorities on chronology or scholarship); and
**paywalled/secondary** (the Grove Art entry, whose note says outright "Paywalled and not read
directly").

### Coordinate

Unchanged, and **not** touched for stylistic consistency. `geghard-monastery` has exactly one entry
in `PLACE_COORDINATES`:

```ts
"geghard-monastery": { lat: 40.1404, lon: 44.8184, precision: "site" },
```

It is the centroid of OSM way 405284197 (`Գեղարդի վանք`, `ref:whc=960`, `wikidata=Q499285`) — the
walled enclosure itself, the courtyard, with the gavit some ten metres off and the Katoghike
twenty. Six independent candidate points span twenty-one metres and all six fall inside the
enclosure polygon, as does the rounded value stored here. It is **not** the car park (80 m, outside
the wall), **not** the souvenir stalls (50 m, also outside), **not** Goght (2.8 km), **not** Geghard
village (2.4 km), **not** Garni (8.1 km down the valley) and **not** the upper Azat valley taken as
an area. The likeliest wrong answer is a gazetteer record rather than a landmark: Wikidata
Q17155656 carries the property's official name *and* its World Heritage id, and points at Geghard
village. `places.spec.ts` pins the value, the `site` precision, the four-decimal rounding, and a
minimum distance from Garni.

### Related content

`relatedSlugs` is `["garni-temple", "adoption-of-christianity", "etchmiadzin-cathedral"]`, in that
order, in all three editions — the taxonomy check compares it as a joined string, so the order is
part of the contract.

- **`garni-temple`** is the first place-to-place relationship in the section. It is earned rather
  than itinerary-driven: `where-it-is` discusses the shared Azat valley explicitly, links to Garni
  in prose from that section, and draws the distinction the two sites are most often confused on —
  the World Heritage property is named for Geghard and the upper valley, and Garni is not in it.
- **`adoption-of-christianity`** was checked rather than assumed. `ayrivank` carries the Gregory
  tradition, links to it from the phrase about the generation of the kingdom's conversion, and then
  spends three paragraphs on why the tradition is not evidence. It genuinely supports the link.
- **`etchmiadzin-cathedral`** is where the spear relic is now, and is linked from
  `the-spear-and-the-name`.

**Garni was not modified to point back**, and the absence is pinned in a test so it stays a recorded
decision rather than something a later reader repairs by reflex. The one-directional architecture in
`getRelatedArticles` is unchanged.

### Artwork — pending, and honestly so

`PENDING_ARTWORK` is `["geghard-monastery"]`. Nothing under `public/` changed and `src/lib/media.ts`
was not touched.

All thirty-six files under `public/` were opened in the previous step rather than read off their
filenames, and none shows chambers hollowed out of a cliff. There is no near miss to record — what
there is instead is a list of substitutions that were *available and refused*, each of which would
have looked like a considered decision rather than a mistake:

- `garni-temple.webp` — eight kilometres down the same valley, linked from this article's own prose,
  and a pre-Christian classical peristyle roughly twelve centuries older than the monastery;
- `khor-virap.png` and `etchmiadzin-cathedral.webp` — the other two entries under the `monastery`
  pill, which is precisely what disqualifies them;
- `history/adoption-of-christianity.webp` — a free-standing domed church in a valley, the
  generic-monastery trap;
- `history/bagratid-armenia.webp` — a river gorge, which is the Lake Sevan mood substitution in
  another landscape.

All five are named in a `places.spec.ts` test. The article renders the generated placeholder and is
captioned as one in all three editions; `Article.image` is **absent** rather than nominating the
site card; `og:image` and `twitter:image` fall back to `/og-default.png`, which is honest for a
link-preview card and is not the same claim; and Geghard's three sitemap `<url>` blocks carry no
`image:loc` at all while still being present.

### Tests

`places.spec.ts` went from **46 to 47** desktop tests. The file had already been extended for
Geghard in the previous step; the fourteen checks required of this one were audited against it and
thirteen were already covered. The fourteenth was not, and is the new test.

**`the six places that existed before Geghard are untouched by it`.** Everything else in the file is
about Geghard or about the section as a whole — the filter counts moved, `PENDING_ARTWORK` filled,
the artwork assertions inverted — and none of it would notice a *sibling* losing a `relatedSlug`,
changing its `placeTypeId`, gaining a section or picking up `featured` in the same edit. Appending
an article to the end of three files is exactly the change where a stray keystroke lands in the
entry above it. The test pins, for each of the six and in all three editions: `category`, `href`,
`placeTypeId`, `featured`, the exact `relatedSlugs` array, and the absence of a reciprocal Geghard
link. Section shape — ids, paragraphs per section, and the four counted blocks — is pinned as
**cross-edition agreement** rather than as literal numbers, so a future revision of one of these six
does not require retyping a constant in a test, but revising one edition and forgetting the others
still fails.

Already covered, and re-verified: all three Geghard routes load with an H1 from `title` and no
`noindex`; `monastery` returns exactly Khor Virap, Etchmiadzin and Geghard; `historical` exactly
Erebuni and Garni; `museum` exactly the Matenadaran; `nature` exactly Lake Sevan; Khor Virap is the
only `featured` place; `seoTitle`/`metaDescription` drive the head while `title` drives the H1;
canonical, three `hreflang` alternates and `x-default` pointing at `/hy/…`; a search for "Geghard"
returns a card linking to the Places route under the Places group heading; the sitemap carries all
three locale routes; the coordinate registry holds one checked point per place; Geghard's
`relatedSlugs` resolve in every edition; and the full set of placeholder, `Article.image`,
OG/Twitter and sitemap-image assertions for a slug with no artwork.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear (no listener) |
| 2 | remove `.next` | removed — 567 MB, §40 ended with a build |
| 3 | `npx tsx scratchpad/check.ts geghard-monastery` | **PASS** — 0 differing rows across 3 editions |
| 4 | `npm run typecheck` | **PASS** — 0 errors |
| 5 | `npm run validate:content` | **PASS** — **120 entries** across 3 locales, with the expected pending-artwork note naming `geghard-monastery` |
| 6 | `npx playwright test --project=desktop places.spec.ts` | **PASS** — 47 passed |
| 7 | `npx playwright test` | **PASS** — 195 passed, 5 skipped |
| 8 | `npm run build` | **PASS** — **126** prerendered routes, compiled in 3.2 s |

**Every failure encountered, reported.** There was one, and it was mine and deterministic.
`places.spec.ts` failed on the new test's first execution — 1 failed, 46 passed — because the
expected `relatedSlugs` for `erebuni-fortress` and `matenadaran` had been written from memory rather
than read from the bundle. Both were wrong in the same direction: extra plausible targets that do
not exist. Corrected against the actual `hy` data; the re-run was 47 passed. Everything else — the
harness, `typecheck`, `validate:content`, the full suite and the build — passed on first execution.

**The Cuisine hydration flake did not appear.** §40 recorded
`cuisine.spec.ts:351 › the cuisine dropdown only offers pages inside this edition` failing once on a
cold server, because line 355 clicks the nav submenu button directly instead of routing through
`openHeaderPanel`, and `.next` had been removed so routes were compiling on demand under parallel
load. The same pre-hydration condition applied here — `.next` was removed at step 2 — and the full
run passed first time. No Cuisine code was touched, and the latent flake is carried forward unfixed.

All 21 place pages (7 places x 3 editions) prerendered, including all three Geghard routes.

### Preserved

- **The English article is byte-identical.** `git diff` shows no change to
  `src/data/locales/en/articles/places.ts`.
- **The six existing Places articles are unchanged** in all three editions — now asserted rather
  than only claimed.
- **`geo.ts`, `sources.ts`, `media.ts` and `scripts/validate-content.ts` were not touched.**
- **Nothing under `public/` changed.**
- **`.claude/settings.json` is unchanged** — the permission layer's automatic additions were
  reverted.
- No deployment was performed, and no deployment configuration was touched.

### Western Armenian items requiring native review

The whole `hyw` article is in the queue, as every `hyw` article has been since §16. These are the
specific judgement calls made while writing it, so a reviewer can change any of them in one pass.
None is a known error.

1. **`Պատրիք Տօնապետեան`** for Patrick Donabédian. The Western reflex of the surname is
   `Տօնապետեան`; `hy` uses `Դոնաբեդյան`. A diaspora editor may prefer a French-facing
   transliteration for a scholar who publishes in French.
2. **`Տաւերնիէ`** for Tavernier (`Տավերնիե` in `hy`). Western transliterations of French names vary.
3. **`չարխափան՝ չարիք վանող`** for *apotropaic*. `չարխափան` is the established word; the gloss was
   added because the term is rare in general prose. A reviewer may want it dropped, or `պահպանիչ`.
4. **`զինանշան` / `զինանշանային համակարգ`** for *coat of arms* / *armorial system*. Correct, but the
   article's whole argument is that the object may not be a coat of arms, and a reviewer should
   check that the qualifying verbs carry that weight in Western Armenian.
5. **`ժայռափոր`** throughout, never `վիմափոր`. Both are current; the choice is consistent.
6. **`գաւիթ`** left untranslated and explained in the prose, as the English does.
7. **`գեղարդ`** as a common noun in running prose, with the name reserved for the monastery.
8. **`Իվանէ` / `Զաքարէ`** for the Zakarid brothers, and `Աւագ`, `Շահնշահ`, `Պապաք`, `Ռուզուքան`,
   `Գալձակ` for the rest. None had a settled Western form in the repository before this article.
9. **`Աղուանից կաթողիկոս`** for the Catholicos of the Aghvans.
10. **`Յիշատակարան`** for a manuscript colophon, and **`գրադարան`** rather than `մատենադարան` for a
    library — the second was changed during this pass, for the reason given above.
11. **`ձայնականութիւն`** for acoustics, and **`խորիսխ`** for the honeycomb of a stalactite vault.
12. **Centuries spelled out** (`տասներկուերորդ դար`) rather than Roman, against the `hy` house style
    recorded in the glossary. Deliberate, for the numeral reason above.
13. **`Գեղարդի վանք`** as the title in both Armenian editions rather than `Գեղարդավանք` — the
    compound is used in the prose, where the article explains the name.

### Still open

Carried forward unchanged. Nothing in this list was fixed here.

- **The Matenadaran façade colour — still open**, unchanged from §36, §38, §39 and §40. Pale grey
  where the building and this archive's prose describe dark basalt.
- **The Garni stone warmth — still open**, unchanged from §40. Ochre-warm where the basalt is
  grey-blue.
- **The Garni 4:3 image dimension — still open.** `garni-temple.webp` is 1448 x 1086 against the
  1586 x 992 of the other WebPs, so the 16:9 crops trim 136 px from it against 50 px from the rest.
- **A dedicated Khor Virap image — still open** since §32. The only PNG, 1355 x 793, 1.4 MB, and
  still byte-identical to `hero-ararat.png`.
- **Erebuni and Matenadaran image weight — still open.** 742 KB and 701 KB, both carrying ICC
  profiles.
- **Global media optimisation — still open**, and unaffected by a step that added no assets. With
  Khor Virap this remains one pass rather than several separate problems.
- **The Cuisine hydration flake — still open.** `cuisine.spec.ts:355` clicks the nav submenu button
  directly instead of using `openHeaderPanel`. It did not reproduce here. The fix is one call
  swapped for the helper, and it belongs to a step that owns that spec.
- **One-directional related articles — still open.** `getRelatedArticles` links one way, and
  Geghard's link to Garni is deliberately not reciprocated.
- **Western Armenian native review — still open**, and now longer by one article and thirteen
  terminology items. The queue runs from §16 through §28, §29, §31, §33, §35, §37, §39 and §41.
- **The Bresson and Fagan Garni attribution — still open and unsettled.** Whether the Garni
  inscription names Trdat I or Trdat the Great remains a live argument.
- **Wilkinson's Garni source not read directly — still open.** No copy of REArm NS 16 is online; the
  Garni article takes the argument from Russell's endorsement and from summaries, and says so.
- **The Hovannisian ISBN — new, minor, and deliberately not fixed here.** `9781403966360` catalogues
  the two-volume set where four bibliography entries title it *Volume I*. The work and the cited
  chapter are right; the identifier is the set's. Fixing it edits four entries across four articles.
- ~~**Geghard artwork — new, and open by design.** `PENDING_ARTWORK` is `["geghard-monastery"]` and
  the article ships the honest placeholder until a dedicated image exists.~~ — **resolved in §42.**
  `geghard-monastery.webp` landed and was registered; it was one line, and it did light up all six
  surfaces. `PENDING_ARTWORK` is empty again.
- **The remaining place type.** `settlement` still waits for its first article.

No deployment was performed.

---

## 42. Geghard Monastery artwork — the pending entry, cleared (August 2026)

`public/images/places/geghard-monastery.webp` arrived. It was opened, verified, inspected and
registered in `IMAGES`, and the slug is out of `PENDING_ARTWORK`. Nothing else changed: no image was
generated, edited, cropped, resized, recoloured, renamed, optimised or replaced, no article content
moved, and no new loading path was introduced. Two source files changed — `src/lib/media.ts` and
`tests/e2e/places.spec.ts` — plus the new asset and this document.

This is the sixth time the section has cleared a pending entry (§32 Etchmiadzin, §34 Erebuni, §36
Matenadaran, §38 Lake Sevan, §40 Garni, §42 Geghard) and the sixth time the whole change was a
one-line registration reaching six surfaces at once. `PENDING_ARTWORK` is empty again, and with
seven of seven places illustrated the placeholder branch has no subject in this section once more.

`scripts/validate-content.ts` was **not** touched. The §36 wording — *"have no artwork and render
the generated placeholder"* — is unchanged, and so is its logic. It prints nothing now because the
set it counts is empty: every one of the 30 article slugs across the three editions has a registered
file. No bug was found in it, so nothing in it was changed.

### The asset, verified rather than assumed

The container was parsed rather than trusted to its extension, and the file was opened rather than
read off its filename.

| Property | Value |
|---|---|
| Path | `public/images/places/geghard-monastery.webp` |
| Exists | yes |
| Format | WebP, lossy VP8 |
| Container | `RIFF` / `WEBP` / a single `VP8 ` chunk of 277,266 bytes |
| `VP8X` extended header | none |
| ICC profile | none |
| Alpha | none |
| Animation | none |
| Dimensions | **1586 x 992** (16:10, 1.599) |
| File size | **277,286 bytes** (270.8 KiB) |
| RIFF size field | 277,278 — consistent with the actual length minus 8 |
| SHA-256 | `3264dd61243e9cc9a8c612a10d82a426ccc490950ee10437528e324ba1789821` |

It returns to the shape of the four WebPs before Garni: 1586 x 992, so the "not 1586 x 992" note in
`media.ts` is again about Khor Virap's PNG and Garni alone. Container-wise it matches Etchmiadzin,
Lake Sevan and Garni — a plain single-chunk `RIFF/VP8`, so the ICC note stays about Erebuni and the
Matenadaran. At 271 KB it sits mid-registry: heavier than Garni (120 KB) and Lake Sevan (176 KB),
far lighter than Erebuni (742 KB) and the Matenadaran (701 KB). Registered exactly as delivered.

### Visual inspection

The image was opened and looked at, and every claim below is from the frame rather than from the
filename.

- **Geghard is unmistakably the subject.** An elevated view into the upper Azat gorge: the walled
  complex on its terrace, the katoghike's conical umbrella dome over a drum, the gavit against it to
  the west, secondary roofs, the perimeter wall and gate range, and the wooded gorge sides above.
- **The monastery is visually integrated with the cliffs.** The complex is set directly against the
  rock face rather than in front of it, and a large rock mass intrudes into the enclosure on the
  right so that masonry and living rock abut with no gap. The built and the hollowed-out read as one
  fabric, which is the article's subject.
- **Rock-cut architecture is apparent.** Chambers open in the cliff face immediately behind and
  above the courtyard — several dark mouths in the rock, plus a further opening in the intruding
  outcrop on the right.
- **Not a look-alike.** Not Khor Virap (no Ararat, no plain, no hill chapel); not Etchmiadzin (no
  cathedral forecourt, no city); not Garni (no peristyle, no Ionic order, no podium, no gorge-rim
  promontory); not Petra (grey basalt masonry and grey-brown andesite cliff, not a carved sandstone
  façade); not Cappadocia (no tuff cones, no fairy chimneys); and not a generic cave monastery — the
  umbrella dome, the gavit and the fortified enclosure are specifically Armenian and specifically
  this complex.
- **The main church and gavit remain recognisable** at every crop tested, below.
- **Nothing dates the buildings.** The frame carries no inscription, no lettering, no plaque and no
  narrative scene, so it makes no claim that the surviving fabric is fourth-century, and the
  early-tradition versus thirteenth-century-complex distinction the prose draws is neither supported
  nor contradicted by it.
- **No prohibited content.** No giant spear, no relic, no heraldic shield, no supernatural event, no
  invented inscription, and no unsupported religious claim.

**One concern, reported and not corrected.** This file is *photographic* in register — a
documentary-looking aerial view, with visitors visible in the courtyard — where every other file in
the registry is a rendered illustration (`garni-temple.webp` was opened side by side to confirm the
contrast is real). It inherits `ARTWORK_PROVENANCE` like the rest and is captioned *AI-generated
illustration — an imagined scene*, which is the more cautious of the two possible claims and is
therefore safe to ship. But it is the first entry where that caption is worth re-confirming against
the source rather than assuming: if the file is in fact a photograph, the caption is wrong in the
opposite direction from the failure §17 was written to prevent, and the image would need a credit
rather than a provenance line. The file was **not** altered, renamed or replaced, and the note is
recorded in `media.ts` beside the entry as well as here.

### Crop suitability

Every slot is a centre crop (`object-cover object-center`), so the crops were computed from the real
class names and rendered from the actual file rather than reasoned about. A 1586 x 992 source loses
very little in all of them.

| Slot | Class | Trim | Result |
|---|---|---|---|
| Compact card | `aspect-[4/3]` | 132 px each side, full height | dome, gavit, cliff chambers and courtyard all held |
| Listing card | `aspect-[16/9]` | 50 px top and bottom | dome finial cross clears the top edge comfortably |
| Mobile hero | `aspect-[4/3]` | as compact card | same |
| Tablet hero | `sm:aspect-[3/2]` | 49 px each side | between the two above; nothing lost |
| Desktop hero | `lg:aspect-[16/9]` | 50 px top and bottom | as listing card |
| Search thumbnail | `w-32` / `lg:w-40`, card-height column (~3:4) | 421 px each side | the tightest crop, and it still holds the dome, the gavit, the cave mouths and the courtyard |

The 3:4 search thumbnail is the tightest and was checked explicitly, because it is the one crop
where a subject placed off-centre would be lost. The complex sits centre-right in the frame and
survives it. **No crop logic was added and none is needed.**

### The registration

One line, in the existing Places block of `IMAGES`:

```ts
"geghard-monastery": "/images/places/geghard-monastery.webp",
```

Nothing else. No Geghard-specific media logic, no custom crop logic, no new image fields, no new
provenance infrastructure, and no component changes. Every consumer already asks `getImageSrc` or
`getArticleImageSrc`, so the single entry reached the Places listing, the article hero, the global
search result, the related-article cards, Open Graph, Twitter, the generic `Article.image` and the
sitemap image entries at once — verified below rather than assumed.

### Provenance

Handled entirely by the existing Armat-generated editorial-artwork mechanism.

`isGeneratedArtwork({ slug: "geghard-monastery", image: undefined })` now returns **`true`**: the
article declares no `image`, and `getImageSrc` resolves, which is the whole of the condition. That
flip is what swaps the caption branch in `ArticleLayout`, and the effect was verified on the
rendered page in all three editions:

- the normal AI-generated illustration disclosure appears (`imageAiIllustrationCaption` — the scene
  wording, not the portrait wording, because a monastery is a scene and not a likeness);
- the placeholder disclosure is gone (`imagePlaceholderCaption`, the "Replace with licensed imagery
  before launch" string, is asserted absent);
- the hero placeholder SVG is gone — `header figure svg[role='img']` is zero and `header figure img`
  is one.

`ARTWORK_PROVENANCE` is **unchanged** — not edited, not extended, not read from a new place. No
per-image provenance system was introduced. No other article's provenance behaviour changed: the
captions are driven by registry membership alone, and no other slug's membership moved.

### Pending-artwork removal

`geghard-monastery` was removed from `PENDING_ARTWORK` **after** the file had been opened, verified
and registered, not before. `PENDING_ARTWORK` is now `[]`.

The list itself stays, with its rejected-substitute reasoning intact. It has now filled six times
and emptied six times, and §41 is the standing proof that emptying is not a signal it can be deleted
— the sixth place had barely settled before the seventh refilled it. The five refused substitutions
recorded for Geghard (`garni-temple.webp`, `khor-virap.png`, `etchmiadzin-cathedral.webp`,
`history/adoption-of-christianity.webp`, `history/bagratid-armenia.webp`) are kept, and so are the
tests naming them, because the failure they guard against — a cover repointed at a plausible
neighbour later — outlives the file landing.

`validate:content` no longer reports Geghard as lacking artwork. The note is conditional on a
non-empty set and now prints nothing at all; the run is a clean **120 entries across 3 locales**.

### Listing, article, search and metadata — verified

| Surface | Verified |
|---|---|
| Places listing card | uses `/images/places/geghard-monastery.webp`; listing placeholder count is **0** |
| Article hero | the WebP in `en`, `hy` and `hyw`; no placeholder SVG; AI-illustration caption present, placeholder caption absent |
| Global search | the card whose link is `/en/places/geghard-monastery` carries the WebP, no `<svg>`, and none of Garni's, Khor Virap's or Etchmiadzin's files |
| Related article cards | the shared `ArticleCard` renders the same registered file |
| `og:image` | `https://armat.site/images/places/geghard-monastery.webp` — no longer `/og-default.png` |
| `twitter:image` | the same absolute URL — no longer `/og-default.png` |
| `Article.image` | `{ "@type": "ImageObject", url: "https://armat.site/images/places/geghard-monastery.webp" }` — the property is now present where §41 asserted its absence |
| Sitemap | all three locale routes carry an `image:loc` for the WebP, checked block by block |

**Structured data is otherwise untouched.** The only JSON-LD consequence is the existing generic
`Article.image` now resolving. No `Place`, `TouristAttraction`, `Monastery`, `Church`,
`LandmarksOrHistoricalBuildings` or `LocalBusiness` node was added, and the existing test asserting
the graph carries `Article` and `BreadcrumbList` and no tourism types still passes for all seven
places.

**No leakage.** Geghard uses none of Khor Virap's, Etchmiadzin's, Garni's or
`adoption-of-christianity`'s artwork, and no generic fallback, in its head, its structured data, its
hero, its search card or its sitemap blocks.

### Editorial work preserved

This was an artwork-registration step only. Nothing in the English, Eastern Armenian or Western
Armenian prose was touched; `git diff` shows no change to any `articles/places.ts` from this step.
The early-tradition versus medieval-complex distinction, the Proshyan acquisition wording, the Prosh
floruit, the Donabédian heraldry discussion, the Holy Lance treatment, the manuscript and school
claims, the UNESCO wording, the sources, the coordinate, `relatedSlugs`, the SectionLinks, the SEO
fields, `placeTypeId` and the filter counts are all unchanged — and `placeTypeId`, `featured` and
`relatedSlugs` are now *pinned as literals in a test* for Geghard as well as for the other six, so
an artwork step that edited them would fail rather than pass quietly.

### Tests

`places.spec.ts` stays at **47** desktop tests. §42 added no test and removed none; it inverted the
three Geghard-specific ones and widened the shared datasets, which is the same shape §32, §34, §36,
§38 and §40 took.

**The datasets.** `GEGHARD` moved into `ILLUSTRATED`, which is now all seven, and gained its entry
in `ARTWORK`. `PLACES` and `ILLUSTRATED` are **kept as separate concepts** even though they contain
the same slugs again — the sixth time they have coincided, and the last five times the next place
split them within one step. The comment arguing against collapsing them is kept and updated.

**Inverted, each in all three editions.** `Geghard renders its own file and is captioned as an
illustration` (was: renders the generated placeholder) now asserts one `<img>` with the right file,
zero `<svg>`, the AI-illustration caption present and the placeholder caption absent.
`Geghard's search card carries its own thumbnail and no placeholder` (was: renders the placeholder)
now asserts the thumbnail is the WebP and adds a borrowed-file check, scoped to the one result card
whose link is `/en/places/geghard-monastery`. `Geghard borrows no other article's artwork, and
declares the one it has` (was: *claims no image it does not have*) keeps its five-file borrowed
guard verbatim and inverts the tail: `og:image` and `twitter:image` are the Geghard WebP and must
not contain `og-default`, and `Article.image` is present and equal to it.

**Widened.** The listing placeholder count went `1` to `0` — an assertion that has now inverted six
times, which is the argument for pinning the number rather than asserting "none by inspection". The
search-thumbnail loop gained `[GEGHARD, "Geghard"]`. The sitemap per-block loop gained `GEGHARD`,
and Geghard's own block assertion flipped from *must emit no `image:loc`* to *must emit one, and
must not name a neighbour's file*. `PENDING_ARTWORK` is asserted `toEqual([])` — the whole array, so
a stale entry left behind fails as loudly as a slug quietly added. The registry test pins
`registry[GEGHARD]` by name alongside the other six, and the homepage test gained `geghard` to its
list of fragments that must not appear on `/hy`. The registry/pending mutual-exclusion test needed
no change and still passes in both directions.

**Retained unchanged, and still passing:** Khor Virap keeps its PNG; Etchmiadzin, Erebuni, the
Matenadaran, Lake Sevan and Garni keep their WebPs; the homepage stays on `/hero-ararat.png`; and
the History, Writers, Works and Cuisine paths are pinned as one literal object that a stray
keystroke in the flat registry would break.

One test was renamed. `the six places that existed before Geghard are untouched by it` became
`every place's editorial fields are pinned, and Geghard's are unchanged by its artwork`, because its
loop runs over `ILLUSTRATED` and now covers seven. The title had become false; the assertions are a
superset of what it did before.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear (no listener) |
| 2 | remove `.next` | removed — §41 ended with a build |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — **120 entries** across 3 locales, and **no pending-artwork note**, the set it counts now being empty |
| 5 | `npx playwright test --project=desktop places.spec.ts` | **PASS** — 47 passed |
| 6 | `npx playwright test` | **FAIL on first execution — 2 failed, 193 passed, 5 skipped.** Fixed and re-run: **195 passed, 5 skipped** |
| 7 | `npm run build` | **PASS** — **126** prerendered routes, all three Geghard routes among them |

**Every failure encountered, reported.** There was one, it was mine, and it was deterministic rather
than a flake.

`npx playwright test` failed with two `page.goto: Test timeout of 30000ms exceeded` errors. The two
tests were identified rather than guessed — `places.spec.ts each article hero renders its own
registered artwork and names the AI provenance` and `places.spec.ts no illustrated place renders the
artwork placeholder`. They are the only two that loop `LOCALES x ILLUSTRATED`, so moving Geghard
into `ILLUSTRATED` took each from eighteen navigations to twenty-one, against a dev server compiling
routes on demand with the rest of the suite competing for it. Both had passed at 24.6 s in the
places-only run at step 5 and passed again at 9.6 s when re-run alone, which is what identifies the
cause as the global 30 s timeout rather than a broken assertion.

**It was not retried away.** `retries` is `0` in `playwright.config.ts` and was left at `0`; the
config's global timeout was not raised for everyone. The fix is `test.slow()` on those two tests,
with a comment recording why — the honest statement that a twenty-one-navigation test is slow,
rather than shrinking its coverage or re-running until it passed. The full suite then passed first
time.

**The Cuisine hydration flake did not appear.** The pre-hydration condition documented in §40 and
§41 applied here too — `.next` was removed at step 2, so routes compiled on demand under parallel
load — and `cuisine.spec.ts` passed in both full runs, including the one where the two places tests
timed out. No Cuisine code was touched, and the latent flake is carried forward unfixed.

### A second pass over the same step, and the hole it found

The work above was committed as `7302b1d` ("step19") and the whole chain was then re-run against the
committed tree. Everything held — the asset hashes to the same SHA-256, the registry entry and the
empty `PENDING_ARTWORK` are as recorded, and steps 3, 4, 6 and 7 passed unchanged.

Re-auditing the twenty-one required assertions one at a time did find a real hole, in the one place
the first pass had been satisfied with an indirect proof. *"The Geghard listing card uses its own
WebP"* was covered only at page level: the file appears among the listing's `img` sources, no
unexpected file appears, the source count is exact, and no placeholder remains. All four of those
still hold **if two cards swap covers** — Geghard's card showing Garni's picture while Garni's shows
Geghard's — which is precisely the borrowed-neighbour failure this section guards hardest, the two
sitting eight kilometres apart in the same valley and linked from Geghard's own prose. A listing
where every card carries a plausible picture looks finished.

So the listing test gained a per-card loop that pins each place's card to its own file by the card's
own href. The file's test count is unchanged at 47; one existing test got stricter.

**That addition failed on its first execution, deterministically, and the failure was mine.**
`1 failed, 46 passed` — `expect(locator).toHaveCount(1)` received `0`, for `khor-virap` and so for
every slug after it. The locator had been written as `getByRole("listitem")`, copied from the search
assertions, but `ArticleCard` renders `<Card as="article">`: on a listing the cards are the `article`
role, and `listitem` is the *search page's* shape. The repository already has the right helper —
`cards()` in `tests/e2e/helpers.ts`, documented as *"Cards are the only `article` role inside a
results grid"* — so the fix was to use it rather than to invent a selector. Re-run: **47 passed.**

Worth keeping rather than rediscovering: Khor Virap appears twice on that page, as the featured
place and as a card, but `FeaturedItem` is not a card. That is why the per-card count is one and not
two, while the whole-page source count above it is `ILLUSTRATED.length + 1`.

The production build was also re-read rather than trusted: `.next/server/app/sitemap.xml.body`
contains exactly **three** `geghard-monastery.webp` occurrences, one per locale route, which
confirms requirement 9 against the built artefact and not only against the dev server.

### Scratchpad

`scratchpad/check.ts` was restored in §41 as a reusable cross-locale parity harness. It was **not
deleted, moved or modified** here — this was an artwork-only step and the file is not part of it.

One correction to the record: it was untracked when this section was first written, and commit
`7302b1d` has since taken it into version control. The debt is therefore no longer "an untracked
harness" but "a tracked harness in the wrong directory" — a slightly stronger reason to move it,
since it now ships with the repository. If it is genuinely reusable it belongs in `scripts/` with
the other tooling; that migration is a step that owns the scripts directory, not this one.

`.claude/settings.json` is **unchanged** — the permission layer added two entries automatically
during this session and they were reverted, as in §41.

### Preserved

- **No existing artwork changed.** Nothing under `public/` was generated, edited, cropped, resized,
  recoloured, renamed, optimised or replaced. The only change to the directory is the new file, and
  its bytes are as delivered — the SHA-256 above was taken from the file as registered.
- **All three locale editions of the Geghard article are byte-identical** to what §41 left.
- **`geo.ts`, `sources.ts`, `ui.ts`, `seo.ts`, `sitemap.ts`, every component and
  `scripts/validate-content.ts` were not touched.**
- **No deployment was performed**, and no deployment configuration was touched.

### Still open

Carried forward unchanged. Nothing in this list was fixed here.

- **The Matenadaran façade colour — still open**, unchanged from §36 and every step since. Pale grey
  where the building and this archive's prose describe dark basalt.
- **The Garni stone warmth — still open**, unchanged from §40. Ochre-warm where the basalt is
  grey-blue.
- **The Garni 4:3 image dimension — still open.** `garni-temple.webp` is 1448 x 1086 against the
  1586 x 992 of the other WebPs, `geghard-monastery.webp` now included.
- **A dedicated Khor Virap image — still open** since §32. The only PNG, 1355 x 793, 1.4 MB, and
  still byte-identical to `hero-ararat.png`.
- **Erebuni and Matenadaran image weight — still open.** 742 KB and 701 KB, both carrying ICC
  profiles. The new file carries none and does not add to this.
- **Global media optimisation — still open.** Unaffected by a step that added one 271 KB file.
- **The Cuisine hydration flake — still open.** `cuisine.spec.ts:355` clicks the nav submenu button
  directly instead of using `openHeaderPanel`. It did not reproduce here. The fix belongs to a step
  that owns that spec.
- **One-directional related articles — still open.** `getRelatedArticles` links one way, and
  Geghard's link to Garni is deliberately not reciprocated.
- **Western Armenian native review — still open**, and unchanged by this step, which added no prose.
  The queue runs from §16 through §28, §29, §31, §33, §35, §37, §39 and §41.
- **The Bresson and Fagan Garni attribution — still open and unsettled.**
- **Wilkinson's Garni source not read directly — still open.** No copy of REArm NS 16 is online.
- **The Hovannisian ISBN — still open.** `9781403966360` catalogues the two-volume set where four
  bibliography entries title it *Volume I*.
- **`scratchpad/check.ts` location — carried forward, and deliberately not fixed here.** Now tracked
  as of `7302b1d`, which strengthens rather than settles the case for moving it. A reusable
  harness living in an untracked scratchpad directory. It should migrate to `scripts/` if it is to
  be kept, and be deleted if it is not; either way that decision belongs to a step that owns the
  tooling.
- **The photographic register of `geghard-monastery.webp` — new.** Recorded above and in `media.ts`:
  the file looks documentary where the rest of the registry looks drawn, and the blanket
  AI-generated caption is worth re-confirming against the source. Reported, not corrected, and the
  file was not altered.
- **The remaining place type.** `settlement` still waits for its first article.

No deployment was performed.

---

## 43. Visit Armenia — the second journey (August 2026)

The archive now has two entry points. `/history`, `/places`, `/writers`, `/works` and `/cuisine`
answer *what is this?*; `/[locale]/visit` answers *what would I go and see?* and then hands the
reader straight back to those listings.

It is a **curation layer, not a section**. It owns no article, no image, no coordinate and no prose
about any subject. Every card on it is resolved from the article registry at render time, which is
why the page's own configuration is three arrays of slugs and nothing else. No article was added, no
map was added, and nothing was deployed.

### Route

`/[locale]/visit` → `/hy/visit`, `/hyw/visit`, `/en/visit`. One new page file,
`src/app/[locale]/visit/page.tsx`.

Nothing was created under it. `/visit/places`, `/visit/food`, `/visit/map` and `/visit/guides` do
**not** exist, and `dynamicParams = false` on the locale layout makes that a 404 rather than merely
an unlinked path — asserted for seven such paths. The canonical routes are unchanged: a place still
has exactly one URL, under `/places`.

Prerendered routes went from **126 to 129** — three, which is the whole of the change.

### Navigation — the decision, and why

The header was inspected before anything was added, and it could **not** simply take a seventh bar
item. Two facts decided it:

- `Header.tsx` documents a measured width budget: six items in Armenian run 520px of the row at
  1024px, with roughly 175px spare. That is why `Home` was removed from the bar and why four
  sections use short labels.
- `header.spec.ts` pins `toBe(6)` on the bar at four widths, and asserts no label wraps and no
  horizontal overflow in all three editions at 1024px.

So Visit is **not** a seventh nav item. `NavItem` gained a `journey?: boolean` flag; the header
filters it out of `barNav` and renders it separately as a **filled pill in the right-hand action
cluster**, beside search and the edition switch. That is the smallest change that satisfies the
brief: existing category access is untouched, the journey is visually distinct as an *action* rather
than another thing to browse, there is no header redesign and no mega-menu.

Below `lg` the pill is absent and the **drawer** carries the journey as its second entry, directly
after Home — the two journeys at the top, then the six sections. The drawer maps the whole `nav`
array, so it picked the item up without special-casing. The **footer** lists it once, in Explore,
under the existing "every href appears exactly once" rule.

**A regression was introduced here and caught by the existing tests.** The first implementation put
the full label «Այցելել Հայաստան» in the pill and pushed the 1024px Armenian header **49px past the
viewport** — precisely the budget `Header.tsx` warns about. The fix is the mechanism the repository
already had for this: `ui.nav.visitShort` («Այցելել» / "Visit"), fed through `NavItem.shortLabel`,
plus slightly tighter pill padding below `xl`. The drawer and footer still show the full name, where
there is room and no logo beside them to supply the country.

### Page structure

Hero (compact: breadcrumb, one H1, one paragraph, **no image**) → Places to discover → Explore by
type → Armenian food to try → Learn before you visit.

The sections are deliberately not interchangeable: `paper` / `tinted` / `paper` / `surface` tones,
three-up default cards for places against four-up compact cards for dishes and context, link chips
rather than cards for the type controls, and `ArrowLink` CTAs on the first two sections against a
`ButtonLink` on the last — the one action that leads out of the journey and back into the archive.

No hero image. The homepage hero is the homepage's, and `/hero-ararat.png` is not a generic tourism
asset; the page takes its visual weight from the cards.

### Curated slugs

```ts
VISIT_FEATURED_PLACES = garni-temple, geghard-monastery, lake-sevan,
                        khor-virap, matenadaran, erebuni-fortress
VISIT_FEATURED_DISHES = lavash, dolma, khorovats, gata
VISIT_LEARN_ARTICLES  = adoption-of-christianity, kingdom-of-urartu,
                        mesrop-mashtots-armenian-alphabet, tigran-the-great
```

**Places — six of seven.** Chosen for spread rather than rank: all four place types are represented,
and the two types with a second article contribute one each. **Etchmiadzin is the deliberate
omission** — it is the third `monastery` and would have made half the row one type. It stays one
click away behind the all-places link, which is the difference between a curated row and a copy of
the listing. A test asserts its absence, so the omission is a decision rather than a slip.

**Dishes — four kinds, not the first four.** `bread`, `main`, `meat`, `dessert` — four distinct
`dishTypeId` values, asserted as a set so the row cannot silently become `slice(0, 4)`. Taking the
array's own order would have given lavash, dolma, khorovats and harissa: the same spread minus the
sweet, with `ceremonial` doubled once ghapama is counted. `ceremonial` is the one kind not shown,
and it is the kind with two articles — both reachable through the cuisine CTA.

**Context — four, each already earned.** The rule applied, and now enforced by a test: a learn slug
must appear in the `relatedSlugs` of at least one featured place. All four do —
`adoption-of-christianity` (Khor Virap, Geghard, Garni), `kingdom-of-urartu` (Erebuni, Lake Sevan),
`mesrop-mashtots-armenian-alphabet` (the Matenadaran) and `tigran-the-great` (Khor Virap, Garni).
Nothing was added to reach four. `bagratid-armenia` (Lake Sevan) is the only other slug that would
qualify today.

### Data architecture

No parallel Visit database. The page reads `getArticlesByCategory`, `toArticleSummary`,
`getPlaceTypes`, `getUi`, `getPages`, `localePath` and `getStaticAlternates` — all existing helpers.
The only Visit-specific data is the three slug arrays above.

Page copy went into `StaticPagesContent.visit`, beside `about`/`contact`/`privacy`, because it is
page copy rather than interface chrome and because `pageLd` reads `{ title, metaDescription }` off
that shape directly. It holds headings, a lead and four CTA labels — **no titles, excerpts, images
or routes**, so nothing on this page can contradict the article it points at. The nav labels
(`nav.visit`, `nav.visitShort`) went into `UiDictionary`, exactly as `nav.about` does.

`scripts/validate-content.ts` gained a `visit` branch in `validateStaticPages`, in the existing
idiom: title and metaDescription present, lead present, every field non-empty, and — the one check
specific to this page — **the heading must differ from the SEO title**. `/visit` is the only static
page whose H1 is deliberately not its `title`, and authoring them the same way is invisible on the
rendered page.

### Media

No new artwork, no Visit-specific image, no hardcoded path. Every card resolves through
`getArticleImageSrc` / `getImageSrc`, so the fourteen images on the page are the same files
`/places`, `/cuisine` and `/history` serve. `PENDING_ARTWORK` is empty and asserted empty from this
page's own spec, because curating a pending slug would render a perfectly finished-looking
placeholder card. No placeholder `<svg>` appears in any edition.

### Explore by type — the decision

The place-type filter **does** have a URL representation: `useListingParams` writes `?type=<id>` with
`history.pushState` and adopts it from `window.location.search` on mount. It deliberately avoids
`useSearchParams`/`router.replace`, which would have bailed the page out to client rendering.

So the four controls are **real links** to `/[locale]/places?type=<id>` — semantic, keyboard- and
middle-click-usable, and honest about what they do. The caveat, recorded rather than papered over:
the filter is adopted **after hydration**, so the server-rendered HTML at that URL is the unfiltered
grid. These are therefore not crawlable filtered pages, and **`/places/monasteries` and
`/places/museums` were not created** — that is a routing change this step was told not to invent.

The labels come from `getPlaceTypes(locale)`, the same list the listing filters by, with `all`
dropped. **No second taxonomy and no new place type**; a test pins the four ids against the bundle
so a renamed pill cannot drift.

### Localization

Complete in `hy`, `hyw` and `en`. Taxonomy labels are reused rather than re-translated — the type
chips read `placeTypes`, so "Monasteries and churches" / «Վանքեր և եկեղեցիներ» / «Վանքեր եւ
եկեղեցիներ» are the listing's own strings.

Western Armenian uses classical orthography throughout: `եւ` not `և`, `-ութիւն` not `-ություն`,
`կը`/`կ՚` verb forms, `մը`, `-ներու` genitives, `հոն`, `ուրկէ`. The `hyw` half of
`validateDictionaries` enforces the first two on UI keys; the page copy in `pages.ts` is outside that
check, so it was written to the same rule by hand.

**All newly authored Western Armenian Visit copy is flagged for native review** — see the list below.
No existing article translation was touched.

### SEO

| | |
|---|---|
| Title (en) | `Visit Armenia: Places, Nature & Food` |
| Description (en) | `Discover places to visit in Armenia, from historic monasteries and ancient sites to Lake Sevan, museums and traditional Armenian food.` |
| H1 | `Visit Armenia` — the short heading, never the SEO title |
| Canonical | `https://armat.site/{locale}/visit` |
| hreflang | `hy`, `hyw`, `en`, each pointing at its own `/visit` |
| x-default | `/hy/visit`, per the existing `withXDefault` convention |
| Sitemap | `"/visit"` added to `STATIC_PATHS`; three URLs, verified in the built `sitemap.xml.body` |

No `keywords` array. The search-intent guidance shaped the title and description wording; a keywords
override would also have sat outside `validateKeywordList`, which only loops `CATEGORY_IDS`.

### Structured data

`pageLd` — the primitive about/contact/privacy already use. The page emits exactly one JSON-LD
script containing **Organization + WebSite + WebPage + BreadcrumbList**, and nothing else.

- **Organization** and **WebSite** because every non-home graph in this repository re-declares them;
  the layout emits no global graph.
- **BreadcrumbList** from the same crumb array the visible `<Breadcrumbs>` renders, so the two cannot
  drift. It ends on the current page with no `item`, as Schema.org expects.

**No `TouristDestination`, `Trip`, `TouristTrip`, `TouristAttraction`, `ItemList`, `Place` or
`LocalBusiness`.** A discovery page is exactly where those look plausible, and none of them describes
what a reader can see here: this is an index of articles, not a description of a destination. The
test collects every `@type` in the graph structurally and asserts the exact set. Article JSON-LD is
untouched.

### Accessibility and responsive

One H1 per page, asserted. Heading levels never skip — checked by reading every `h1/h2/h3` in `main`
and asserting no jump greater than one. Card links carry the article title as their accessible name;
alt text comes from the article data through `ContentPhoto`. The type controls are `<a>` elements in
a `<ul>`, not click-handling `<div>`s. The header pill is a `Link` with `aria-current="page"` on
`/visit`, and a test asserts it is the *only* current item in the header — `isActive` is a prefix
match, so a route sharing a prefix with a category would light the wrong item silently.

Verified at **360, 768 and 1440px in all three editions**, asserting `scrollWidth <= clientWidth`.

**One real overflow was found and fixed at source.** At 360px the `hy` learn CTA rendered a 350px
button — `ButtonLink` is `whitespace-nowrap`, and the label «Ուսումնասիրել Հայաստանի պատմությունը»
was a sentence rather than a button label. It had also drifted from the requested "Learn about
Armenia". Both Armenian labels were shortened to «Ուսումնասիրել Հայաստանը» and «Ծանօթանալ
Հայաստանին»; the shared primitive was **not** modified and no per-locale width was introduced.
(`cn()` is a plain join, not `tailwind-merge`, so a className override would not reliably have won —
worth knowing before anyone tries that route.)

### Tests

New file `tests/e2e/visit.spec.ts` — **23 desktop tests**, covering all twenty-eight required
checks. The suite went from 195 to **218** passing.

The three curated slug arrays are **copied into the spec rather than imported from the page**.
Importing them would make the test agree with whatever the page currently says; writing them out is
what makes a change to the curation a decision someone has to take twice.

Beyond the required list, three tests are worth naming:

- **`every learn card links to a history article that genuinely relates to a featured place`** — the
  editorial guard. Every learn slug must appear in some featured place's `relatedSlugs`, which is
  what stops a fourth card being added because a row of three looked thin.
- **`the visit hub sells nothing`** — the line this page must not cross, pinned as text rather than
  as intent: no "book", "hotel", "tour package", "price", "opening hours", "restaurant", "where to
  eat". An educational hub becomes a travel portal one well-meaning section at a time.
- **`no map library or map surface is introduced`** — checked in both directions: nothing map-shaped
  in the rendered page (`.leaflet-container`, `.mapboxgl-map`, `.maplibregl-map`, `.ol-viewport`,
  `.gm-style`, `canvas`, `[data-map]`), and nothing map-shaped in `package.json`.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed — §42 ended with a build |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — 120 entries across 3 locales |
| 5 | `npx playwright test --project=desktop visit.spec.ts` | **FAILED twice before passing** — see below. Final: **23 passed** |
| 6 | `npx playwright test --project=desktop places.spec.ts` | **PASS** — 47 passed |
| 7 | `npx playwright test --project=desktop cuisine.spec.ts` | **PASS** — 33 passed |
| 8 | `npx playwright test` | **FAILED twice before passing** — see below. Final: **218 passed, 5 skipped** |
| 9 | `npm run build` | **PASS** — **129** prerendered routes, compiled in 4.0s |

**Every deterministic failure, and its fix.** There were four, all mine.

1. **`hy` overflowed 360px by 10px** (step 5). Diagnosed rather than guessed: a throwaway spec
   measured every element's bounding box against `clientWidth` and named the offender — the learn
   CTA at 350px wide. Fixed by shortening the two Armenian CTA labels, as described above. The
   diagnostic spec was deleted afterwards.
2. **The structured-data test failed on its own naive check** (step 5). It searched the serialized
   JSON for the substring `"Place"`, which matches this page's own SEO title, *Visit Armenia:
   Places, Nature & Food*. The graph was correct the whole time. Rewritten to collect every `@type`
   structurally — including nested `ImageObject` and `ListItem` — and assert the exact set. A test
   that fails on correct output is a bug in the test, and this one would have been "fixed" next time
   by weakening the assertion.
3. **The header overflowed 1024px by 49px in Armenian** (step 8), failing
   `header.spec.ts:49` and `:81`. A genuine regression from the journey pill, caught by tests that
   already existed. Fixed with `ui.nav.visitShort` through `NavItem.shortLabel` — the mechanism the
   repository already had — not by relaxing the assertion. Two Visit tests were then re-scoped to
   the header's short label, since both had silently been resolving to the footer link.
4. **`places.spec.ts` "the place article uses its own SEO fields…" timed out** at 30s (step 8),
   passing in 6.1s alone. It is the third `LOCALES × PLACES` test — twenty-one navigations — and §43
   added a whole new spec file competing for the same dev server. Declared `test.slow()`, matching
   the two §42 marked for the identical reason. `retries` stays `0` and the global timeout was not
   raised.

**One non-deterministic failure, investigated rather than dismissed.** The first execution of
`visit.spec.ts` after `.next` was removed failed `no artwork placeholder appears anywhere on the
visit hub`, alongside a dev-server `SyntaxError: Unexpected end of JSON input`. It did not reproduce
in five targeted repeats, a fresh cold run with `.next` deleted, or any subsequent full run — the
same cold-compile signature as the documented Cuisine flake. It was **not** retried away: the exact
image count is still asserted, and the test now waits for the last curated card before counting, so
the count describes a finished page rather than a mid-compile one. A genuinely missing image still
fails.

**The Cuisine hydration flake did not appear.** `cuisine.spec.ts` passed standalone (33) and in every
full run, including the two that failed for other reasons. No Cuisine code was touched.

### Existing content — regression check

- **No article changed, in any edition.** `git diff` shows no change under
  `src/data/locales/*/articles/`.
- **No Place was touched**: content, coordinates, source lists, SEO fields and artwork are all
  unchanged for khor-virap, etchmiadzin-cathedral, erebuni-fortress, matenadaran, lake-sevan,
  garni-temple and geghard-monastery. `places.spec.ts` still passes all 47.
- **`ARTWORK_PROVENANCE`, the media registry, article JSON-LD, the Places taxonomy, the coordinate
  registry and the source registry are unchanged.** `geo.ts` is not imported by the Visit page.
- Listing counts hold: places 7, cuisine 6, history 7 — asserted from the new spec as well as the old.
- The homepage still renders `/hero-ararat.png` and picks up no Visit artwork.

Files changed: `src/app/[locale]/visit/page.tsx` (new), `tests/e2e/visit.spec.ts` (new),
`src/data/types.ts`, `src/data/ui.ts`, `src/data/locales/{en,hy,hyw}/pages.ts`,
`src/data/locales/{en,hy,hyw}/ui.ts`, `src/lib/navigation.ts`,
`src/components/layout/Header.tsx`, `src/app/sitemap.ts`, `scripts/validate-content.ts`,
`tests/e2e/places.spec.ts` (one `test.slow()`), and this document.

`.claude/settings.json` is **unchanged**.

### Western Armenian items requiring native review

All Visit-page `hyw` copy is newly authored and none of it has been read by a native editor. The
specific judgement calls:

1. **«Այցելել Հայաստան»** as the journey name, and **«Այցելել»** alone in the header. A reviewer may
   prefer «Այցելութիւն Հայաստան» for the full form.
2. **«Ծանօթանալ Հայաստանին»** for "Learn about Armenia" — chosen partly for length, since the button
   must fit 360px. «Ուսումնասիրել» was the first choice and was too long.
3. **«Ծանօթացէ՛ք»** as the imperative opening both the lead and the meta description.
4. **«Խորապատկեր»** for the "Context" eyebrow. «Ենթահող» and «Նախապատմութիւն» were considered.
5. **«Վայրեր՝ ծանօթանալու համար»** for "Places to discover", against the Eastern
   «Վայրեր՝ բացահայտելու համար».
6. **«կերակուր»** throughout rather than Eastern «ուտեստ», matching the existing `hyw` `cuisineTypes`.
7. **«ձեռագիրներու հաւաքածոյ»** for "a manuscript collection".
8. **«կիրարկուած»** for "applied" (of a filter), and **«զտիչ»** kept from the existing listing copy.
9. **«ամէնէն ճանչցուած»** for "best known".
10. **«Սեղանին շուրջ»** for the food eyebrow, "At the table".

### Still open

Carried forward unchanged. Nothing in this list was fixed here.

- **The Matenadaran façade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions** — 1448 × 1086 against 1586 × 992 elsewhere. Now visible in one
  more place: Garni is the first card on the Visit hub.
- **The Geghard photographic register** — documentary-looking where the rest of the registry is
  drawn, still captioned AI-generated. Recorded in §42.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`. The Visit hub now serves it too, which adds weight to a second page.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB, both on the Visit hub as well.
- **Global media optimisation** — unaffected by a step that added no assets, and marginally more
  worth doing now that fourteen registry images appear on one page.
- **The Cuisine hydration flake** — `cuisine.spec.ts:355` clicks the nav submenu button directly
  instead of using `openHeaderPanel`. It did not reproduce here.
- **One-directional `relatedSlugs`** — `getRelatedArticles` links one way. The Visit hub reads
  `relatedSlugs` in a test to prove the learn cards are earned, which makes the one-directionality
  slightly more load-bearing than before, but does not change it.
- **Western Armenian native review** — now longer by the Visit page and ten terminology items.
- **The Bresson and Fagan Garni attribution**, unsettled.
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN** — set-level identifier on four volume-level entries.
- **`scratchpad/check.ts` living outside `scripts/`** — tracked as of `7302b1d`, still in the wrong
  directory.
- **The weak homepage hero-path test** — `img[src*="hero-ararat"]` matches a substring, so a switch
  to `hero-ararat.webp` would still pass. Unresolved, and deliberately not touched here.
- **The remaining place type** — `settlement` still waits for its first article.

### Deliberately not built

Recorded so the next step does not have to rediscover the boundary: no map of any kind and no map
dependency; no `/visit/places`, `/visit/food`, `/visit/map` or `/visit/guides`; no
`/places/monasteries`-style filtered routes; no hotels, bookings, tours, restaurants, prices,
opening hours, affiliate links or packages; no new article; no new design system, mega-menu or
carousel; and no Visit-specific artwork.

No deployment was performed.

---

## 44. The first interactive map — Visit Armenia (August 2026)

`/[locale]/visit` now carries a geographic index of the seven Places. It answers one question —
*where are the places I can already read about on Armat?* — and deliberately answers no others.
No article was added, no route was added, nothing was deployed.

`src/data/geo.ts` has said *"Nothing renders these yet"* since §28. It renders them now, and the
registry needed no change to make that true.

### Library — Leaflet 1.9.4

No map library existed. The choice was between MapLibre GL JS and Leaflet, and it was not close for
these requirements.

**Leaflet, for one decisive reason and three supporting ones.** The decisive one is accessibility:
Leaflet draws markers as **real DOM elements**, so a marker can be a `<div role="button">` with an
accessible name, reachable by Tab, activated by Enter, and assertable in Playwright. MapLibre renders
into a WebGL canvas, where a marker is pixels unless you opt into DOM markers anyway — and §12 of
the brief says outright not to rely on canvas marker interaction. Choosing Leaflet meant the
accessible path and the tested path are the *same* path, rather than a fallback bolted beside one.

Supporting: it is **41.7 KB gzipped** against MapLibre's ~200 KB+, and the brief asked for the
lighter option; raster tiles need no vector style document to host; and there is no API key, no
proprietary service and no paid tier anywhere in the setup.

**`react-leaflet` was deliberately not added.** It is a second dependency, coupled to React's
release cycle, and it would have bought nothing here: the component needs custom accessible markers
and imperative control of selection, which is exactly the layer react-leaflet abstracts away.
Leaflet is driven directly from one `useEffect`.

| | |
|---|---|
| Package | `leaflet` |
| Version installed | **1.9.4** (`^1.9.4`) |
| Types | `@types/leaflet` **1.9.22**, devDependency |
| CSS import required | **Yes** — `leaflet/dist/leaflet.css`, imported by the component |
| Client bundle | **145.0 KB raw / 41.7 KB gzipped**, in its own chunk |
| CSS | 10.3 KB raw / 2.6 KB gzipped |
| External requests | **Yes** — map tiles only (see below) |
| API key | **No** |

The Tailwind v4 Preflight hazard was checked rather than assumed: Preflight's `img { max-width: 100% }`
breaks tile rendering, and `leaflet.css` ships `max-width: none !important` for the tile, marker and
shadow panes (lines 46–57), so the library wins regardless of import order. No override was needed.

### Tile source, and what it does and does not promise

Tiles come from **`https://tile.openstreetmap.org/{z}/{x}/{y}.png`** — the standard raster tile
service operated by the **OpenStreetMap Foundation**. Attribution is rendered in the map corner, as
the licence requires.

Stated plainly, because the brief asked for honesty rather than reassurance:

- **A tile request is a third-party request.** It necessarily discloses the reader's IP address and
  User-Agent to the OSMF's servers, together with the tile coordinates — which is approximately
  *which part of Armenia the reader is looking at*.
- **This document does not claim the OSMF collects nothing.** What they log and retain is governed by
  their own privacy policy and was **not verified here**. No claim either way is being made on their
  behalf.
- **There is no unlimited-free guarantee, and none is implied.** The OSM Tile Usage Policy is aimed
  at modest use, requires attribution and a valid identifying User-Agent, and explicitly reserves the
  right to throttle or block. It is not a production CDN and must not be treated as one. Self-hosting
  or a paid provider is the correct answer before meaningful traffic, and is recorded as open below.

**What was done to keep it conservative:**

- **The map is not loaded on page load.** Leaflet is `import()`ed from inside an
  `IntersectionObserver`, so both the library chunk and the first tile request happen only when a
  reader actually scrolls to the section. A reader who never reaches it makes **no** third-party
  request at all. This is a privacy decision first and a performance one second.
- `maxZoom: 17`, so no request goes deeper than the article content justifies.
- **No analytics on marker clicks**, none added anywhere in this step.
- **No geolocation**, ever — see below.
- Nothing about the reader, the article, or the site's own data is sent anywhere. The only outbound
  values are tile coordinates.
- A test enumerates **every** third-party host the page contacts and fails on anything that is not
  `openstreetmap.org`, so a second external dependency cannot arrive unnoticed.

There is no CSP in this repository to amend, and no middleware — both were checked.

### Data derivation

New module `src/lib/visit-map.ts`, exporting `VisitMapPoint` and `getVisitMapPoints(locale)`.

| Field | Derived from |
|---|---|
| `slug` | the article |
| `lat`, `lon`, `precision` | `PLACE_COORDINATES` via the previously-unused `getPlacePoint` |
| `placeTypeId` | the article |
| `title`, `summary` | the **localized** article (`title`, `excerpt`) |
| `href` | `localePath(locale, article.href)` |
| `imageSrc` | `getArticleImageSrc` — the media registry |

**Nothing is authored.** No title, summary, coordinate, image path or type label is written in the
map component or in any map config. `Article` was not modified, and no map-specific content database
exists. A test walks every field of every point back to the registry it came from, in all three
editions, which is what makes that claim checkable rather than aspirational.

The **inclusion rule is a derivation, not an allow-list**: `places articles ∩ PLACE_COORDINATES`.
There is deliberately no second seven-slug array — it would be a third place to remember when the
eighth place ships, and the two would disagree in silence.

A Place with no coordinate is **excluded by an explicit documented rule**, not rendered at `0,0` and
not thrown on. The reasoning is written into the module: `validate:content` already fails on any
Places article missing from the registry and rejects `0, 0` by name as the placeholder pair, and a
test asserts the map returns one point per Places article — so a silently shortened map fails, while
a render-time throw would merely move a data failure into an unrelated production build.

### The seven places, and `area` vs `site`

All seven: khor-virap, etchmiadzin-cathedral, erebuni-fortress, matenadaran, lake-sevan,
garni-temple, geghard-monastery.

Worth noting: the map shows **all seven**, while the curated row above it shows six. That divergence
is the intent, not a bug — the row is an editorial pick, the map is coverage, and Etchmiadzin being
on the map while not being in the row is exactly the difference between the two questions they
answer. (This forced a genuine correction to a §43 test; see below.)

`precision` travels with every point rather than being discarded at the boundary. Lake Sevan is the
one `area` entry — a centroid of an L-shaped lake, not a place anyone stands — and it appears as one
marker for the lake article, as specified. **No polygons were added.** The distinction is asserted
per slug, so a future `area` place cannot quietly inherit `site` semantics.

### Markers

One shared pin for all seven, differentiated by a small glyph drawn inside it, keyed on the existing
`placeTypeId`: a dome for `monastery`, a column for `historical`, an open book for `museum`, two
waves for `nature`. Inline SVG paths — **no emoji**, no seven bespoke icons, and no second taxonomy.

**Colour is never the only channel.** Every marker's accessible name is `"{title} — {type label}"`,
and the list below the map repeats the type as text beside every place. A type with no glyph falls
back to the bare pin rather than to a wrong one, which is what should happen the day a sixth type
arrives. There are no permanent text labels on the map.

### Selection

Clicking or pressing Enter on a marker selects that place. The panel shows the registered image, the
localized title, the article excerpt, the place-type label from `placeTypes`, and a link reading
*"Learn about this place"* pointing at the canonical, locale-correct route.

It shows **no** opening hours, prices, distance, travel time, directions, reviews, ratings or live
conditions — pinned as absent by test.

Selection is **ephemeral UI state**. There is no `?place=` parameter and no router involvement:
§21 asked for none, and adding one would have meant history entries for hovering over a map.

### Desktop and mobile

Desktop is **map plus a side panel** in a `lg:grid-cols-[minmax(0,1fr)_21rem]` grid — the panel sits
beside the map rather than over it, so nothing is obscured and there is no split-pane application.
Below `lg` the same grid stacks: map first, selected-place panel directly beneath it. No bottom
sheet, since the project has no such pattern.

Verified at **360, 390, 768 and 1440px in all three editions**, with the map actually mounted before
measuring — an unmounted container is an empty div and would have proved nothing. No horizontal
overflow at any width. Filter chips are ≥32px tall and the map is ≥200px tall on a 360px phone,
both asserted.

`scrollWheelZoom` is **off**. A map that swallows the wheel in the middle of a long editorial page is
the single most complained-about map behaviour; the zoom buttons and pinch-zoom remain.

### Accessibility and progressive enhancement

The map is an **enhancement**, and the page is complete without it.

`VisitMap` is a client component, so React still server-renders it: the section heading, the
explanatory copy, the accessible list of all seven places, their type labels and their article links
are all in the prerendered HTML **before Leaflet exists**. This is tested the only way that means
anything — with `javaScriptEnabled: false`, asserting no `.leaflet-container` and all seven article
links present.

The list is links, not buttons, for exactly that reason: buttons would have needed JavaScript to do
anything. A keyboard or screen-reader reader can discover every mapped place, read its type, and
reach its canonical URL **without touching the map at all**.

The map itself is `role="region"` with an accessible name rather than `role="application"`, so
Leaflet's own keyboard handling stays available without the map ever having to be the only way in.
It is not a keyboard trap. Markers are focusable (`tabindex="0"`, from Leaflet), carry
`role="button"`, a name including the place type, and `aria-pressed` for the selected state. The
detail panel is a **single** `aria-live="polite"` region — enough that a selection is noticed, not so
much that panning narrates itself.

### Localization

Eight new copy fields in `pages.visit`, complete in `hy`, `hyw` and `en`: eyebrow, title,
description, map region label, list heading, empty-state prompt, CTA and filter group label.

**No place-type translation was duplicated.** The map's filter and its labels read
`getPlaceTypes(locale)` — the listing's own `placeTypes`, `all` included — so "Monasteries and
churches" exists once. `validateStaticPages` already loops every field of the `visit` block, so the
new fields inherited non-empty validation without the validator changing shape.

Western Armenian uses classical orthography throughout (`եւ`, `-ութիւն`, `կը`/`կ՚`, `-ներու`,
imperatives in `-էք`). **All of it is newly authored and flagged for native review**, listed below.

### Map and type-filter integration

The map has a lightweight local filter over the same four types plus All, reusing `placeTypes` ids
and labels. Selecting a type hides non-matching markers **and** the corresponding list entries, so
the map and its accessible equivalent always agree. A selection hidden by a filter is cleared rather
than left as a stale card.

**The existing "Explore by type" links are untouched** — still four real links to
`/places?type=<id>`, asserted by test. The map filter is an addition to this page, never a
replacement for the route into the listing, and there are no "map types".

### SEO and structured data — unchanged

No new route. No `/visit/map`, no per-place map route; three paths asserted 404. The canonical URL
is still `/[locale]/visit` and the sitemap is unchanged.

**Structured data is byte-for-byte the same shape as §43**: Organization + WebSite + WebPage +
BreadcrumbList, one script, asserted as an exact set. **No `GeoCoordinates`, `Place`,
`TouristAttraction`, `Map` or `TouristDestination` was added.** The map has seven coordinates and
that is precisely not a reason to publish them as schema — the page describes articles, not
destinations. Article JSON-LD was not touched.

### Tests

New file `tests/e2e/visit-map.spec.ts` — **18 desktop tests**, covering all twenty-eight required
checks. The suite went from 218 to **236**.

Split deliberately in two. The **derived data** is asserted directly against `getVisitMapPoints` in
all three editions, because that is where a wrong map actually comes from — a coordinate from the
wrong registry, a hardcoded title, a slug that is not a Place. Those run in milliseconds and do not
depend on tiles loading. The **rendered map** is asserted through the DOM, which Leaflet makes
possible: no pixel geometry is tested anywhere, and no accessibility assertion was weakened because
the library made it inconvenient.

Three worth naming beyond the required list:

- **`the accessible list is server-rendered…`** runs with JavaScript disabled. It is the only test
  that can actually prove the progressive-enhancement claim.
- **`the map asks for no location, plots no route and sells nothing`** instruments
  `navigator.geolocation` in an init script and asserts the call count is zero. A control can be
  renamed; a call cannot be disguised.
- **`the map talks to the tile host and nothing else`** enumerates every third-party hostname the
  page contacts and fails on anything but `openstreetmap.org`.

**One §43 test was superseded rather than deleted.** `no map library or map surface is introduced`
became `exactly one map library is present, and nothing beyond it`: Leaflet is now expected, and
Mapbox, MapLibre, OpenLayers, Google Maps, geocoders, routers and Turf are still pinned as absent.
Deleting it would have been the easy move and would have removed the only thing standing between one
deliberate dependency and four accidental ones.

### Verification

Run in the prescribed order. Playwright and the production build were **not** run concurrently.

| Step | Command | Result |
|---|---|---|
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed — §43 ended with a build |
| 3 | `npm run typecheck` | **PASS** — 0 errors |
| 4 | `npm run validate:content` | **PASS** — 120 entries across 3 locales |
| 5 | `playwright --project=desktop visit-map.spec.ts` | **FAILED twice before passing** — see below. Final: **18 passed** |
| 6 | `playwright --project=desktop places.spec.ts` | **PASS** — 47 passed |
| 7 | `playwright --project=desktop visit.spec.ts` | **FAILED once before passing** — see below. Final: **23 passed** |
| 8 | `playwright --project=desktop cuisine.spec.ts` | **PASS** — 33 passed |
| 9 | `npx playwright test` | **PASS** — **236 passed, 5 skipped** |
| 10 | `npm run build` | **PASS** — **129** prerendered routes, compiled in 4.3s |

**Every deterministic failure, and its fix.** There were three rounds, all mine.

1. **Five map tests failed: markers never appeared.** The tests called `page.goto` and clicked
   markers without scrolling, and the map is mounted by an `IntersectionObserver`. The lazy mount is
   a deliberate feature, so the tests were wrong, not the component: an `openMap()` helper now
   scrolls to the section and waits for `.leaflet-container` — exercising the real reader path
   rather than working around it. Also applied to the responsive test, which had been measuring
   overflow against an *unmounted* container and therefore proving nothing.

2. **Six map tests still failed: `[data-slug]` was absent — and this one was a real product bug, not
   a test bug.** Diagnosed rather than guessed: a throwaway spec dumped the map's DOM and reported
   `container: true, markerPane: 7, tiles: 12, dataSlug: 0`. Seven pins were on the map and none of
   them carried a single accessible attribute.

   The cause is an ordering trap in Leaflet's API. `Map.addLayer` defers `onAdd` through `whenReady`
   until the map has a centre and a zoom. The map was created with no view and `fitBounds` was called
   *after* the marker loop, so at `addTo()` time every marker's `_icon` was still `null`,
   `getElement()` returned `null`, and the `if (element)` guard skipped `role`, `aria-label`,
   `data-slug` and `data-place-type` **silently**. The visible result was a map that looked perfect
   and was unusable with a keyboard or a screen reader.

   Fixed twice over: `fitBounds` now runs *before* markers are added, and the attributes are applied
   from a `marker.on("add")` handler as well as inline — because filtering removes and re-adds
   markers, and `_initIcon` builds a **fresh element** each time, so attributes set once would have
   survived until the first filter click and then vanished. That second failure had not been reached
   by any test yet; it was found by reading the fix rather than by waiting for it. The same review
   added `filter` to the selection effect's dependencies, so a selected pin does not lose its active
   styling when a reader narrows and widens the map.

3. **Two `visit.spec.ts` tests failed.** `the chosen library renders` did not scroll, same lazy-mount
   reason. `Etchmiadzin stays behind the all-places link` asserted that Etchmiadzin appears nowhere
   in `main` — which was correct in §43 and is wrong now, because the map lists every place with a
   coordinate and that is its job. Re-scoped to the curated **cards**, which is the narrower thing
   the test was always about; the §43 image-count assertion was likewise scoped from `main img` to
   `main article img`, since Leaflet's tiles are `<img>` elements and an unscoped count now measures
   the tile grid.

**No failure was retried away, and no assertion was loosened to accommodate the library.**

**The Cuisine hydration flake did not appear.** `cuisine.spec.ts` passed standalone (33) and in the
full run.

### Bundle and build

129 prerendered routes — **unchanged from §43**, because the map added no route. `/visit` and every
other page remain statically generated; nothing was converted to a client component beyond the map
itself, and no `dynamic`/`revalidate` export was introduced.

Leaflet occupies **its own chunk**: 145.0 KB raw / **41.7 KB gzipped**, plus 10.3 KB / 2.6 KB of CSS.
Because it is reached through `import()` inside the observer, that chunk is **not** part of `/visit`'s
initial payload and is fetched only when a reader scrolls to the map.

### Existing content — regression check

- **No Places article, coordinate, source, media path, artwork, `placeTypeId` or curated slug array
  was modified.** `src/data/geo.ts` is unchanged — the map consumes it and nothing more.
- `places.spec.ts` passes all 47, including the coordinate-registry test that pins every point and
  the Garni/Geghard separation.
- Cuisine content untouched; `cuisine.spec.ts` passes all 33.
- Article structured-data builders untouched; `/visit`'s graph is unchanged.
- `.claude/settings.json` unchanged.

Files changed: `src/lib/visit-map.ts` (new), `src/components/visit/VisitMap.tsx` (new),
`tests/e2e/visit-map.spec.ts` (new), `src/app/[locale]/visit/page.tsx`, `src/data/types.ts`,
`src/data/locales/{en,hy,hyw}/pages.ts`, `tests/e2e/visit.spec.ts`, `package.json`,
`package-lock.json`, and this document.

### Western Armenian items requiring native review

All map copy is newly authored and unreviewed by a native editor:

1. **«Քարտէս»** for *map*, and **«քարտէսին վրայ»** for "on the map".
2. **«Դիտել Հայաստանը քարտէսին վրայ»** for "Explore Armenia on the map" — `Դիտել` (view) rather than
   `Ուսումնասիրել` (study), which felt too heavy for a map heading.
3. **«նշան»** for *marker*. `նշիչ` was used in the Eastern copy; a reviewer may prefer one in both.
4. **«Ընտրեցէ՛ք … տեսնելու համար»** as the empty-state instruction.
5. **«Ծանօթանալ այս վայրին»** for "Learn about this place", matching the `learnCta` register set in §43.
6. **«Ցուցադրել վայրերը ըստ տեսակի»** for the filter group label.
7. **«Armat-ի ներկայացուցած վայրերուն քարտէսը»** as the map's accessible name — a genitive plural
   construction a reviewer should check reads naturally when announced aloud.

### Still open

Carried forward unchanged. Nothing in this list was fixed here.

- **The tile provider — new, and the most important item on this list.** `tile.openstreetmap.org` is
  governed by a usage policy written for modest traffic and carries no availability guarantee. Before
  this site has real traffic the base layer should move to a self-hosted or paid provider. The
  privacy consequence above travels with that decision.
- **The Matenadaran façade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions** — now visible in the map's detail panel as well.
- **The Geghard photographic register**, recorded in §42.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`, and now reachable from a third surface.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts:355`. Did not reproduce here.
- **One-directional `relatedSlugs`.**
- **Western Armenian native review** — longer by the map copy and seven terminology items.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` living outside `scripts/`.**
- **The weak homepage hero-path assertion** — still a substring match.
- **`settlement`** — declared in the `precision` union and used by no entry; still waits for its
  first article.

### Deliberately not built

No geolocation of any kind — no "use my location", "near me", distance-from-me, current position or
permission prompt; asserted by instrumenting the API. No routes, directions, itineraries, travel
times or lines drawn between places, not even between Garni and Geghard, which are eight kilometres
apart and editorially linked. No food markers — a dish is not a point on the ground, and no food
coordinate was invented. No History, Writers or Works markers — only Places qualify. No polygons for
Lake Sevan. No `?place=` URL state. No second map library, geocoder or routing library. No new
route, and no map-specific structured data.

No deployment was performed.

## 45. Hardening the basemap — one configuration, no vendor (August 2026)

§44 shipped the map with its tile provider written into the component:

```ts
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
```

Two string literals, seven lines into a `useEffect`. That is fine for development and for the low
volume this site has today, and it is the wrong shape to keep: it makes the choice of basemap a
property of Leaflet setup code rather than a property of the deployment, and the §44 debt list
already said the provider must change before real traffic.

This step changes nothing a reader can see. It moves one decision out of a component.

### What was actually wrong with two string literals

Not "hardcoding is bad". The specific failure they set up:

The URL and the attribution have to change **together**. A tile licence is a licence to serve those
tiles *with that credit line*, and the credit line is the only thing on the map that says whose
pictures these are. Two literals seven lines apart, in a file that also contains marker glyphs,
`IntersectionObserver` wiring and three effects, is an arrangement in which someone swaps the URL
and does not swap the line beneath it. The result is one provider's tiles under another provider's
copyright — which is the one failure in this area that has a counterparty who cares.

The second problem is smaller and more ordinary: with the provider named in the component, "we are
moving off the public OSM endpoint" is a code change, a review, and a rebuild reasoned about by
whoever is comfortable editing Leaflet initialisation. It should be an environment variable.

### `src/lib/map-tiles.ts`

One shape, one resolver, one exported value.

```ts
export type MapTileConfig = {
  url: string;          // Leaflet template; must contain {z}, {x}, {y}
  attribution: string;  // rendered by Leaflet's attribution control
  maxZoom?: number;
};
```

Deliberately **not** a provider framework. There are no adapters, no registry, no plugin interface
and no `TileProvider` base class, because there is exactly one basemap and abstractions sized for a
set of one are architecture for its own sake. The bar this file has to clear is narrow and it clears
it: changing provider is a change to configuration, not to code.

`VisitMap` now reads `MAP_TILES` and renders whatever it is handed:

```ts
const tiles = L.tileLayer(config.url, {
  maxZoom: config.maxZoom,
  attribution: config.attribution,
});
```

A test reads the component's source and asserts it contains no URL template, no absolute URL of any
kind, no `&copy;`, and not the word *openstreetmap* in any case. That is the guarantee in one
assertion: **no provider is named in the map component**, so a swap cannot leave half of one behind.

### Environment variables

Three, all optional, following the convention `.env.example` already documents:

| Variable | Meaning |
| --- | --- |
| `NEXT_PUBLIC_MAP_TILE_URL` | Leaflet URL template; must contain `{z}`, `{x}`, `{y}` |
| `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION` | Credit line rendered on the map; HTML allowed |
| `NEXT_PUBLIC_MAP_TILE_MAX_ZOOM` | Highest zoom the provider serves; defaults to `17` |

`maxZoom` is configurable rather than fixed because it is a **property of the provider**, not a
design choice. A provider serving to z14 with `maxZoom: 17` compiled in produces a screen of missing
tiles at the two zoom levels a reader is most likely to use — which is precisely the "malformed tile
requests after a provider swap" failure this step exists to prevent.

All three carry `NEXT_PUBLIC_` and all three are meant to be public. A tile URL appears in every
request the browser makes and the attribution is printed on the map by design; neither is a secret
and neither can be made one. **If a provider ever requires a browser token it goes in the URL and is
public in exactly the same way** — a browser-visible tile token is not a credential, it is a rate-
limiting handle. That distinction is stated in `.env.example` next to the existing warning that the
`SMTP_*` block must never take the prefix, because the two rules are the same rule read in opposite
directions. **No provider token is configured today.**

### Missing configuration fails; it does not improvise

`resolveMapTileConfig` returns `MapTileConfig | null`. The rules:

- **Nothing configured** → the documented development fallback. A fresh checkout has a working map
  with no account and no setup, which is how it worked before and should keep working.
- **URL without attribution, or attribution without URL** → `null`.
- **A template missing `{z}`, `{x}` or `{y}`** → `null`.
- **`maxZoom` not an integer in 1–22** → `null`.

`null` is the *predictable failure* the step asked for, and the two obvious alternatives are both
worse than no map:

- falling back to the OSM endpoint when a production URL is malformed would serve one provider's
  tiles while the operator believes their own are live, and would surface as a block or a bill weeks
  later rather than as a broken map now;
- retaining the previous attribution when the URL changes is the licence violation described above,
  wearing the costume of resilience.

Refusing is safe here in a way it would not be elsewhere on the site, because the thing a reader
came for — seven places, their types, their article links — is server-rendered markup that does not
depend on the basemap at all.

`resolveMapTileConfig` is exported separately from `MAP_TILES` so all of this is tested directly,
without `process.env` and without a browser.

### The development fallback, described accurately

`tile.openstreetmap.org` remains the default and is documented in three places — the module, the
`.env.example` block and the README — as *an external community service run by the OpenStreetMap
Foundation, not infrastructure this project operates or has an agreement with*, to be replaced before
meaningful production traffic.

What none of those three say: unlimited, guaranteed, free forever, SLA, or Armat's production tile
provider. No claim is made about what the Foundation logs, what it permits, or how much of it is
available, because none of that is this repository's to assert and §44 already refused to assert it.

### Attribution

Now provider-driven and structurally unable to go missing:

- it comes from the same object as the URL, so the two cannot be changed independently;
- `resolveMapTileConfig` refuses a configuration with an empty attribution, so a tile layer can never
  be constructed without one;
- `attributionControl: true` stays on and Leaflet's control is untouched;
- a test asserts the control exists, is visible, and contains the configured text with markup
  stripped — derived from `MAP_TILES`, so it keeps holding after a provider change.

### Tile failure

The Visit page has to survive a basemap that does not arrive, and it does — but the mechanism is
worth stating precisely, because "handle offline" is where honest UI usually goes wrong.

Two distinct cases, one message:

1. **`MAP_TILES === null`** — a refused configuration, known before mount. Leaflet is never imported,
   no tile is requested, and the map surface is not rendered at all. An empty bordered box announcing
   itself as a map is worse than a sentence saying there isn't one.
2. **`tilesFailed`** — the runtime case. The map is mounted and the markers are on it and selectable;
   only the pictures underneath them failed. The surface stays.

Detection is `tileload` / `tileerror` on the layer, and the condition is *errors have occurred and
nothing has loaded*. That is a direct observation of this layer, not an inference about the reader's
connection: a `tileload` clears the flag, so a transient error that resolves does not leave a false
notice behind. There is no retry system, no `navigator.onLine`, and no diagnosis of why. The copy
says the map could not be loaded and points at the list — the two things that are actually known.

`mapUnavailable` was added to `StaticPagesContent.visit` and written in all three editions, so it
inherits the non-empty check `validateStaticPages` already runs over every field of that block.

A test blocks the configured tile host at the network layer and asserts: the notice appears with the
edition's own wording, all seven article links still resolve, marker selection still works, and the
rest of `/visit` still renders. **The accessible list is the fallback**; the notice only explains it.

### Lazy loading — unchanged, and now pinned by its consequence

The `IntersectionObserver` and the `await import("leaflet")` are exactly as §44 left them. Leaflet is
still its own chunk — **145.0 KB raw / 41.7 KB gzipped, byte-for-byte what §44 measured** — and is
still absent from `/visit`'s initial payload.

The new test does not look for chunk filenames, which are a build detail that changes with the
bundler. It asserts the thing worth guaranteeing: load `/visit`, wait for the network to settle, and
**no request has been made to the tile host at all**, while `[data-visit-map]` is present and
`.leaflet-container` is not. Then scroll, and tiles arrive. A refactor to a plain top-level import
would keep every other map test green and fail this one.

A second, cheaper test reads the component source for a static `import … from "leaflet"` and checks
that neither the Visit page nor the locale layout mentions the library at all.

### Network and privacy

The §44 host-enumeration test named `openstreetmap.org` as the only legal host. That was correct
while the URL was a literal and wrong the moment the basemap became configuration — so it was
**generalized rather than deleted or loosened**. The expectation is now computed from `MAP_TILES`:

```ts
const tileHost = MAP_TILES.url.replace(/^https?:\/\//, "").split("/")[0].replace(/^\{[^}]+\}\./, "");
```

Any third-party request to anything other than the configured provider still fails the test. Nothing
was widened to a wildcard, and no external domain was allow-listed. The test also scans the permitted
host's own request paths for `nominatim`, `geocod`, `/search`, `/route`, `/direction` and
`/autocomplete` — geocoding, place search and routing are all things a tile vendor will happily also
sell, and all things this map has decided not to have.

Unchanged and re-asserted: no geolocation, no analytics on marker interaction, no telemetry, no live
data, and nothing about the reader or the archive sent to the provider.

### `@next/env`, and why it is now declared

The tests compare what the browser rendered against the configuration resolved from `process.env` —
but `next dev` reads `.env.local` and the Playwright runner does not. Configure a provider locally
and the two halves disagree, producing a confusing false failure. `playwright.config.ts` now calls
`loadEnvConfig(process.cwd())`, Next's own helper, so both processes read the same files.

An audit of environment conventions caught that `@next/env` resolved **only as a transitive
dependency of `next`** — working today, breaking under a stricter installer or a `next` major bump.
It is now a `devDependency` pinned to the exact `next` version (`16.2.10`) rather than a caret range,
because the two must move together.

The same audit found `README.md` still claiming *"Only the newsletter form needs configuration"* —
already untrue when the SMTP block landed, and more untrue now. Corrected to name all three optional
configurations.

### Tests

`visit-map.spec.ts` **18 → 24**; suite **236 → 242**. Six added, one rewritten:

1. `resolveMapTileConfig` in isolation — fallback, half-configured, malformed template, out-of-range
   zoom, and the whitespace-only shape a freshly copied `.env.example` produces.
2. No provider named anywhere in `VisitMap.tsx` — no template, no absolute URL, no `&copy;`, no
   *openstreetmap*, and `MAP_TILES` present.
3. The rendered tile URLs match the configured template with `{z}/{x}/{y}` filled, and the
   attribution control carries the configured text.
4. No tile requested before the map is scrolled to; tiles once it is.
5. Leaflet imported dynamically in the component and nowhere upstream.
6. The tile host blocked at the network layer — notice, seven links, marker selection, rest of page.
7. **Rewritten:** the host-enumeration test, generalized as described above.

What was deliberately *not* tested: chunk filenames, the number of tile requests, tile image bytes,
and the internal shape of Leaflet's attribution DOM. Pinning those would make a provider change
expensive to carry out, which is the opposite of this step's purpose.

### Commands and results

| # | Command | Result |
| --- | --- | --- |
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed (§44 ended on a build) |
| 3 | `npm run typecheck` | **PASS** |
| 4 | `npm run validate:content` | **PASS** — 120 entries across 3 locales |
| 5 | `visit-map.spec.ts` | **PASS** — 24 |
| 6 | `visit.spec.ts` | **PASS** — 23 |
| 7 | `places.spec.ts` | **PASS** — 47 |
| 8 | `npx playwright test` | **PASS** — 242 passed, 5 skipped |
| 9 | `npm run build` | **PASS** — 129 routes |

**Zero deterministic failures.** Every step passed on its first run; nothing was retried and no
assertion was adjusted after the fact. Playwright and the build were not run concurrently.

The dev server printed `SyntaxError: Unexpected end of JSON input` for `/hyw/visit` once during the
`visit.spec.ts` run — the §43 development-server noise, which failed nothing then and failed nothing
here.

### Bundle and build

129 prerendered routes, **unchanged**. `/[locale]/visit` is still `●` — statically prerendered —
because `NEXT_PUBLIC_*` variables are substituted textually at build time and no environment-
dependent logic entered the page. Nothing became a client component that was not one already.

The Leaflet chunk is **145.0 KB raw / 41.7 KB gzipped** and its CSS **10.3 KB / 2.6 KB**, identical
to §44. The resolved tile URL is inlined into the existing 13.9 KB `VisitMap` client chunk; the
configuration module adds no chunk of its own and no measurable weight.

### Map UX and data — unchanged

Nothing a reader can see changed except a notice that only appears when the basemap does not.

Unchanged: the seven mapped places; `getVisitMapPoints` and every field it derives; `src/data/geo.ts`
and every coordinate in it; Lake Sevan's `area` precision; the marker pin and its four type glyphs;
marker selection and the detail panel; the map-local type filter; the accessible list; the
"Explore by type" links into `/places`; marker-derived bounds; the responsive layout; and all article
links. `src/lib/visit-map.ts` was not touched.

Files changed: `src/lib/map-tiles.ts` (new), `src/components/visit/VisitMap.tsx`,
`src/app/[locale]/visit/page.tsx`, `src/data/types.ts`, `src/data/locales/{en,hy,hyw}/pages.ts`,
`tests/e2e/visit-map.spec.ts`, `playwright.config.ts`, `.env.example`, `README.md`, `package.json`,
`package-lock.json`, and this document. `.claude/settings.json` was modified by the permission layer
and reverted, as in §42.

### Western Armenian items requiring native review

The seven items from §44 stand, plus one:

8. **«Քարտէսը չկրցաւ բեռնուիլ։ Անոր բոլոր վայրերը թուարկուած են վարը։»** for the basemap-unavailable
   notice — the passive `չկրցաւ բեռնուիլ` and `վարը` for "below" both want a reviewer's eye.

### Still open

Carried forward. Nothing else on this list was fixed here.

- **The production tile provider — still open, and deliberately so.** This step made the provider
  replaceable; it did not choose one. Mapbox, MapTiler, Stadia, Thunderforest, Jawg, Google and
  self-hosting were all left uninstalled and unnamed in code, because the choice depends on current
  terms, pricing, Armenia coverage, attribution obligations and expected traffic — a comparison to
  make against the market on the day it is made, not against a source file. Until then the public OSM
  endpoint is the documented development default and the privacy consequences recorded in §44 stand.
- **No self-hosted tile infrastructure**, and none started: no OSM import pipeline, PostGIS,
  TileServer GL, Martin, Tegola, PMTiles, planet extract or Armenia `.pbf` processing.
- **The Matenadaran façade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions.**
- **The Geghard photographic register**, recorded in §42.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts:355`. Did not reproduce here.
- **One-directional `relatedSlugs`.**
- **Western Armenian native review** — now eight terminology items.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` living outside `scripts/`.**
- **The weak homepage hero-path assertion** — still a substring match.
- **`settlement`** — declared in the `precision` union and used by no entry.
- **No central environment module** — surfaced by the audit, not introduced here. `SMTP_*` is read
  independently in `lib/contact.ts` and `api/contact/route.ts`, and the Supabase pair in
  `lib/supabase/client.ts` and the same route. `map-tiles.ts` is currently the only one that
  separates parsing from reading. Not worth a refactor on its own; worth doing when the next
  configuration arrives.

### Deliberately not built

No new map features. No new Places. No second map library, geocoder, router or map SDK — Leaflet
remains the renderer and the only one. No commercial provider signed up for, hardcoded or
credentialed. No tile server, no tile pipeline. No routes, directions, geolocation, restaurants,
hotels, tours or live data. No analytics on tile or marker activity. No retry, backoff or offline
detection. No map-specific structured data. No new route. The Visit page was not converted to a
client component and did not lose static prerendering.

No deployment was performed.

## 46. Stadia Maps — the basemap decision §45 deliberately left open (August 2026)

§45 made the tile provider replaceable and refused to pick one, on the grounds that the choice
depends on terms and coverage that belong in a decision, not a source file. This is that decision.

**Provider selected after external pricing/terms review on 2026-08-08.**

No code changed. That is the result worth recording: `resolveMapTileConfig`, `MapTileConfig`,
`MAP_TILES` and `VisitMap.tsx` are byte-identical to §45, and the entire provider switch is three
environment variables. The abstraction was built one section ago to make exactly this cheap, and it
was.

### Why Stadia

Ordered by weight, with price last on purpose:

1. **Standard raster tiles.** Leaflet 1.9.4 renders raster XYZ tiles and nothing else. Every vector-
   first provider would have forced a renderer change, and §44 chose Leaflet specifically because its
   markers are real DOM elements with real accessible names. Trading that for a prettier basemap
   would have been trading an accessibility guarantee for decoration.
2. **Domain-based authentication.** Stadia validates the `Origin` and `Referer` headers browsers
   already send, so a public static site needs **no API key in the browser**. This is the decisive
   operational property: every keyed provider would have put a credential in a `NEXT_PUBLIC_`
   variable, which is a credential printed in every visitor's network log.
3. **Drop-in with the existing configuration.** Their documented Leaflet template is an XYZ URL the
   §45 resolver accepted unmodified, verified before anything was written.
4. **Replaceable.** Choosing Stadia costs nothing structurally — it is named in `.env.example` and in
   this document, and nowhere in the code.

Price was reviewed and is deliberately **not recorded here**: pricing changes, a number in a
repository ages badly, and none of the four reasons above depend on it.

### The style: `alidade_smooth`

Stadia positions this style for "maps that use a lot of markers or overlays", with a muted palette
and fewer points of interest. That is precisely this map's problem: seven burgundy pins must be the
most important thing on screen, and a basemap that competes with them is a worse basemap however
handsome it is.

Rejected, with reasons: `osm_bright` is light but deliberately colourful and POI-dense, and would
compete with the markers; `stamen_toner_lite` is restrained but stark monochrome, a design statement
the archive's paper-and-ink palette does not want; `outdoors` and `stamen_terrain` are terrain
styles; `alidade_satellite` is imagery; `alidade_smooth_dark` and the toner dark variants are dark
themes. Every one of those was excluded by the brief before taste entered.

### The configuration

```
NEXT_PUBLIC_MAP_TILE_URL=https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png
NEXT_PUBLIC_MAP_TILE_ATTRIBUTION='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
NEXT_PUBLIC_MAP_TILE_MAX_ZOOM=20
```

`{r}` is Leaflet's retina placeholder — `@2x` on HiDPI screens, empty elsewhere. It is substituted
unconditionally by `TileLayer.getTileUrl` in Leaflet 1.9.4 (verified in the installed source, not
assumed), so it needs no `detectRetina` option. Both forms were probed live and both returned
`200 image/png`. Note this placeholder is Leaflet-specific: a future renderer change means hardcoding
`@2x` or dropping it.

**`maxZoom` is 20, not the 17 inherited from the OSM fallback.** Stadia documents zoom 20 for this
style, and §45 made this value configurable precisely because it is a property of the provider. It is
also what stops the UI zooming into tiles that do not exist: Leaflet derives the map's maximum zoom
from its layers, so the layer's ceiling is the map's ceiling.

The attribution is copied **verbatim** from Stadia's attribution page rather than paraphrased. These
tiles are Stadia's rendering of OpenMapTiles' schema over OpenStreetMap's data and all three parties
are named in the requirement; the links are preserved because preserving them is part of it.

One documentation inconsistency, resolved deliberately: Stadia's Leaflet tutorial prints a comma
after the Stadia Maps link, their attribution page does not. The **attribution page** is the one that
states the requirement, so its form is the one shipped.

### Authentication: nothing in the browser

Production authenticates by **registered domain**. There is no API key in source, in `.env*`, in a
`NEXT_PUBLIC_` variable, in a query string, in JavaScript, or in this repository's documentation, and
no authentication code was added to `VisitMap.tsx` — none is possible, since the mechanism is headers
the browser sends by itself.

Authorizing the domain is an **account-side operation outside this repository**, and nothing here
attempts to perform it programmatically. See the checklist below.

Local development needs no account: Stadia serves `localhost` and `127.0.0.1` without a key, under
documented strict rate limits. So `npm run dev` and the Playwright suite use the **same tile URL as
production** — which is why the network assertions in this section are measured against Stadia rather
than quietly against the old fallback. Sustained local HTTP 429s are the signal to obtain an account
key for server-side use, never to paste one into a public variable.

### The OpenStreetMap fallback is build-time only

Unchanged from §45 and now load-bearing in a second way. `resolveMapTileConfig` returns the OSM
endpoint **only when no provider is configured at all** — a fresh checkout with no environment. It is
not a runtime safety net.

**Failed Stadia tiles do not fall back to OpenStreetMap.** This is deliberate and the tests pin it: a
silent runtime provider switch would hide a production configuration failure behind a map that looks
fine, and would send readers to a third party nobody chose that day. When tiles fail the map says so
and stops, and the server-rendered list of seven places — which never depended on tiles — carries the
page.

`.env.local` is git-ignored, so **the production build must set these three variables in its own
environment**. A deployment that does not will build against the OSM fallback and look like it works.

### Privacy and network behaviour

Stated as what the implementation proves, and no further.

A visitor **who scrolls to the map** makes tile requests to Stadia Maps. A visitor who does not,
makes none: Leaflet is `import()`ed inside an `IntersectionObserver`, and a test asserts zero requests
to the tile host before the section is reached.

Those requests necessarily disclose the reader's IP address, User-Agent, the tile coordinates —
roughly *which part of Armenia is on screen* — and, because domain authentication works by reading
them, the `Origin` and `Referer` headers, which identify the page the map is embedded in. That is
inherent to the chosen authentication method, not incidental to it.

What the implementation itself establishes:

- **no Armat user identifier is sent intentionally** — none is added to any tile request;
- **no email, account or newsletter data reaches the tile provider**;
- **no geolocation is requested**, asserted by instrumenting `navigator.geolocation` and checking the
  call count is zero;
- **no marker analytics, telemetry or event beacons** were added;
- **only basemap tile requests** are required, and a test enumerates every third-party request and
  fails on any host that is not the configured one.

Deliberately **not** claimed: that Stadia receives no IP address, stores nothing, that the integration
is anonymous, or that any regulatory posture means no data is processed. None of that is Armat's to
assert, and §44 and §45 both declined to assert the equivalent about the previous provider.

No user-facing privacy notice was added in this step. The site's existing privacy architecture did not
require one for this change; whether the privacy page should name the basemap provider is a content
decision, and it is recorded below as open rather than answered here.

### Tests

`visit-map.spec.ts` **24 → 26**; suite **242 → 244**.

- **The committed production basemap** — reads `.env.example`, resolves it, and asserts it is not the
  fallback, is `tiles.stadiamaps.com` over TLS, is a valid XYZ template, carries no credential
  parameter, has `maxZoom` 20, and credits all three parties with their links intact. This is the one
  test that names the provider **on purpose**: it pins a *decision*, and it reads the committed file
  so a developer's `.env.local` cannot make it pass.
- **Credential-leak guard** — inspects *parsed query-parameter names* (`api_key`, `apikey`,
  `access_token`, `token`, `key`, `auth`, `signature`) on the configured URL and on every live map
  request, and asserts no authentication code exists in `map-tiles.ts` or `VisitMap.tsx`. Names, not
  substrings: a style slug or path containing "key" must not trip it, because a test that fails on
  `monkey` is a test someone deletes rather than fixes.
- **Extended source purity** — `VisitMap.tsx` is checked for `stadia` and `openmaptiles` by name as
  well as `openstreetmap`. The generic "no absolute URL" rule is easy to satisfy by accident; the real
  names are their own assertion.

Everything else was already provider-neutral by construction and needed no edit — including the host
enumeration, which derives the single legal host from `MAP_TILES`. **No allow-list containing both
`openstreetmap.org` and `stadiamaps.com` was created**, which is the shape that would have quietly
permitted the old provider forever.

### Commands and results

| # | Command | Result |
| --- | --- | --- |
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed |
| 3 | `npm run typecheck` | **PASS** |
| 4 | `npm run validate:content` | **PASS** — 120 entries across 3 locales |
| 5 | `visit-map.spec.ts` | **PASS** — 26 |
| 6 | `visit.spec.ts` | **PASS** — 23 |
| 7 | `places.spec.ts` | **PASS** — 47 |
| 8 | `npx playwright test` | **PASS** — 244 passed, 5 skipped |
| 9 | `npm run build` | **PASS** — 129 routes |

**Zero deterministic failures.** Every step passed first time. Playwright and the build were not run
concurrently. No rate limiting was observed against Stadia's localhost allowance during a full suite
run; the assertion that no basemap-unavailable notice appears passed, which is the check that would
have caught a 429.

### Build and bundle

129 prerendered routes, unchanged. `/[locale]/visit` remains statically prerendered. The Leaflet chunk
is **145.0 KB raw / 41.7 KB gzipped** and its CSS **10.3 KB / 2.6 KB** — identical to §44 and §45,
because a provider change is a string change. The `VisitMap` client chunk grew **13.9 KB → 14.1 KB**:
the Stadia URL and the longer attribution, inlined at build time. **No dependency was added** —
`package.json` is untouched, and Leaflet 1.9.4 remains the only renderer.

The OSM fallback literal still ships inside that chunk (~120 bytes) because the resolver references
it. Harmless, and the honest description: the fallback is compiled in, merely unreachable when the
three variables are set.

### Existing map behaviour — unchanged

Seven mapped Places; `getVisitMapPoints`; `PLACE_COORDINATES`; marker-derived bounds; marker glyphs;
type filters; marker selection; the selected-place panel; article images; the accessible Place list;
responsive layout; the Visit curation; Explore-by-type links; Lake Sevan's `area` precision. None
touched. This was a provider-configuration step and the diff shows it: no `.tsx` and no `.ts` under
`src/` changed at all.

Files changed: `.env.example`, `README.md`, `tests/e2e/visit-map.spec.ts`, and this document.
`.env.local` was updated locally with the same three public values so development and the test suite
run against the production basemap; it is git-ignored and contains no map secret. `.claude/settings.json`
was modified by the permission layer and reverted, as in §42 and §45.

### Production account checklist — NOT performed

None of the following was carried out during this task. All of it is operational, requires dashboard
access, and must happen before production traffic:

1. Create or configure the Stadia Maps account and property.
2. Confirm the selected plan permits Armat's intended usage.
3. Add `armat.site` to domain authentication.
4. Add any **actually used** canonical production hostname — `www.armat.site` only if it genuinely
   serves the site. No other domain was invented here.
5. Set the three public map environment variables in the production build environment (`.env.local`
   is git-ignored and will not be present).
6. Open `/en/visit` in production.
7. Scroll to the map.
8. Confirm tiles return successfully.
9. Confirm the attribution is visible.
10. Confirm browser tile URLs contain no API key.
11. Confirm the accessible Place list still works.

Until step 3 is done, production tile requests will fail domain authentication — and by design the map
will say so rather than silently serving OpenStreetMap.

### Still open

Carried forward unchanged; nothing on this list was fixed here.

- **Raster label language, new.** Raster tiles have their labels baked in. Stadia's documented rule
  renders non-Latin place names bilingually — a romanized or English name plus the local name — and
  their label-language tutorial applies to **vector** styles only. So an Armenian-language archive
  cannot force Armenian-only or English-only labels without changing renderer, which §44 and this
  section both declined to do. Worth a visual check against Armenia at the zooms readers actually use,
  and worth revisiting if it reads badly in the `hy` and `hyw` editions.
- **Whether the privacy page should name the basemap provider** — a content decision, unanswered.
- **The self-hosting question** is no longer urgent but is not closed: Stadia removes the OSM usage-
  policy problem, not the general dependency on a third party for tiles.
- **The Matenadaran façade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions.**
- **The Geghard photographic register**, recorded in §42.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts:355`. Did not reproduce here.
- **One-directional `relatedSlugs`.**
- **Western Armenian native review** — eight terminology items, unchanged from §45.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` living outside `scripts/`.**
- **The weak homepage hero-path assertion.**
- **`settlement`** — declared in the `precision` union and used by no entry.
- **No central environment module**, recorded in §45.

### Deliberately not built

No new map features, no new Places, no change to map data or UX. No Stadia SDK, MapLibre, React
Leaflet or map-provider helper package — `package.json` gained nothing. No geocoding, routing,
directions, search, geolocation or analytics. No API key anywhere. No automatic runtime fallback from
Stadia to OpenStreetMap. No provider-specific types, classes or adapters: there is no
`StadiaTileConfig`, no `StadiaProvider`, no `StadiaAdapter`, and `MapTileConfig` /
`resolveMapTileConfig` / `MAP_TILES` keep their provider-neutral names. No pricing in source,
`.env.example`, tests or README. No user-facing privacy notice. No domain registered programmatically.

No deployment was performed.

## 47. Tatev — the eighth place, and the archive reaches the south (August 2026)

Seven places, and all of them within about half a degree of latitude: Etchmiadzin, Erebuni, the
Matenadaran and Khor Virap around Yerevan and the Ararat plain, Garni and Geghard in one valley east
of it, Lake Sevan to the north-east. The map §44 built was an accurate picture of the archive and a
misleading picture of Armenia.

Tatev is the correction. It sits in Syunik, in the far south, on a basalt shelf above the Vorotan
gorge — and it earns the place on its own merits rather than as geography: it was the episcopal seat
of its province, the home of the best-known school in medieval Armenia, and it has something almost
no other Armenian monument has, which is a founder who wrote the start date on the wall in the first
person.

### Taxonomy

| Filter | Before | After |
| --- | --- | --- |
| All | 7 | **8** |
| Monastery | 3 | **4** |
| Historical | 2 | 2 |
| Museum | 1 | 1 |
| Nature | 1 | 1 |

`placeTypeId: "monastery"`, `featured: false`. **Khor Virap remains the only featured place**, which a
test asserts by reading the flag rather than the slug. No new place type: a fourth monastery is a
fourth monastery, and inventing `medieval-school` or `cliff-monastery` to make Tatev feel distinct
would have been the listing telling a story the taxonomy does not support.

### Structure

Ten sections, `3/3/4/4/4/5/4/4/4/3` paragraphs, 38 in total — the same cadence as Geghard, with
`keyFacts 6 · importantDates 13 · interestingFacts 5 · significance 2 · relatedFigures 2 ·
relatedSlugs 3 · section links 3`. The sections are: where it is; the gorge; what stood here before;
building Saints Paul and Peter; the rest of the complex; the Gavazan; the school called a university;
Vorotnetsi and Tatevatsi; damage, loss and rebuilding; what to understand before seeing it.

The twelve suggested topics collapsed to ten because two pairs genuinely belong together: the site's
early religious history is inseparable from the question of what is documented about it, and
manuscript culture is inseparable from the two men who ran the school.

### The evidence model

The article distinguishes four things throughout, and the distinction is the article:

- **Tradition.** A church of Sts Nerses and Sahak on the rock before the surviving one, and the name
  derived from the apostle Eustathius — the latter attested by Vardan Arewelts'i in the thirteenth
  century, so a *medieval* belief rather than a modern invention, which is worth saying precisely
  because it is still not evidence.
- **Documentation.** The 839 land deed under Bishop Dawit'; the 895 foundation inscription; the 848
  church of St Gregory; the 1043 gavit inscription; the 1286 tomb.
- **Eyewitness.** Tovma Metsopetsi's colophon of 29 November 1406, written at Tatev, describing the
  earthquake shaking the church, the bell tower and the Gavazan.
- **Surviving fabric.** Which is mostly not medieval, and the article says so plainly.

Orbelian is the spine of all of it, and the single most useful thing he does is disclaim his own
evidence: he could not discover who the first bishop was, and writes that of the oldest of them he
knows nothing, since there are no memorials. **The primary source for Tatev's early history states
that its early history is undocumented.** That sentence is the article's starting point, and it is
stronger than any confident date could have been.

### 895 and 906, resolved

The brief asked what those years actually refer to, and they refer to two different kinds of thing.

**895 is documentary.** Orbelian transcribes the inscription: *in the year 344 of the Armenian Era, at
Easter, which fell on the fourth of Navasard, I, Lord Yovhannes, who succeeded Lord Saghomon as
bishop of Syunik, began the construction of this church.* Brosset computes the day as 20 April 895.

**906 is arithmetic.** Orbelian says the work was finished in eleven years; Brosset added them in a
footnote reading *En 906*. There is no inscription bearing 906, and **Orbelian gives the consecration
no year at all** — he describes the eight-day ceremony and its guests without dating it. Sources that
call 906 the consecration year have inferred it.

So the article gives 895 as a foundation date and 906 as an approximate completion, marks the second
as computed in both the timeline and the interesting-facts list, and never turns the span into a
single event. The two translations also diverge on the clause — Bedrosian reads "after eleven years",
Brosset "in 11 years" — and the note in `sources.ts` records that, because it is the difference
between eleven years of building and eleven years of waiting.

### The Gavazan

This was the section most at risk of repeating something confident and wrong, and it is written as
four graded claims.

**Attested, and not in doubt:** the column moves. A traveller's account of 1858 names it *Gavazan* and
says it shakes when touched; Brosset in 1864 confirms it still moved when leant on. It responded to
the 1406 earthquake, by an eyewitness in the building, and to the 1931 one.

**Recorded by the primary source:** Bishop Yovhannes erected it in the name of the Holy Trinity, south
of the church, of small and large stones, to thirty cubits. That is all Orbelian says. He does not
mention it moving, and he does not mention it measuring anything. The article notes that thirty
cubits is considerably more than the eight metres measured today and that nobody has explained the
gap.

**Modern interpretation, presented as such:** the column rocks on a hinged joint at its base like a
pendulum, per a 2004 seismological paper, which also says it *could serve* to record seismic
oscillations and credits that idea to an architectural historian writing in 1962. The article states
this as a twentieth-century reading of an observed property, offered tentatively — **not** as the
column's documented purpose.

**Excluded:** the earthquake-detector and medieval-seismograph framings as established fact; the
warning-of-approaching-cavalry story; and the astronomical-alignment material, which is fringe.

One detail carries more weight than its length. Brosset records that **Hermann Abich — the founding
geologist of the Caucasus, and a writer on Caucasus earthquakes — examined the column and could not
explain the mechanism.** A nineteenth-century earthquake geologist stood in front of it and offered no
seismological interpretation at all. That is the quiet fact that decides how confidently the
seismograph claim can be stated, and it is in the article.

### The University of Tatev

The label is universal and the specialists avoid it. La Porta titles his study *l'École monastique de
Tat'ev*; Gornandt writes of a *monastic school*. The article uses the familiar name, explains why
scholars prefer the other, and describes what actually existed: no charter, no faculties, no degree —
but the **vardapet system**, fourteen ranks conferred after specialised study, examination before a
panel and a thesis, which **Grigor Tatevatsi codified himself and the Armenian Church still uses**.
That is a licence to teach, belonging to a church rather than a university.

**The student numbers are the correction most worth making.** Tatev is routinely said to have had five
hundred or a thousand students. Both figures are Orbelian's, and neither describes the school: five
hundred is his count of the **clergy about 906**, and the thousand his description of the **eleventh-
century community** — roughly three centuries before the school arrived. No invented curriculum,
department list or enrolment appears in the article.

### The two figures

**Hovhan Vorotnetsi** (about 1315 – 1386 or 1388) and **Grigor Tatevatsi** (about 1346 – 1409) are the
two `relatedFigures`. The teaching line — Esayi Nchetsi at Gladzor, then Vorotnetsi, then Tatevatsi
for twenty-eight years — is well attested and is stated.

**Vorotnetsi is not called the founder of the University of Tatev**, and the reason is chronology
rather than pedantry: he died in 1386 or 1388, the school settled at Tatev about 1390, and his own
teaching was done at Gladzor, Vorotnavank and Aprakunis. He was dead before it arrived. The article
says he led and reorganised the higher monastic school of Syunik in the generation after Gladzor, and
that it moved to Tatev under his successor — and the `relatedFigures` entry states the common claim
and why the dates do not support it.

Neither man has an article of his own, and **none was created to satisfy a relationship**.
`relatedFigures` is free text by design, so both are recorded there.

Two claims about Tatevatsi were deliberately left out. His birth and death years vary across four
printed variants, so the lifespan is given as approximate rather than falsely precise. And the widely
repeated line that he was the last saint canonised before 2015 is **contradicted by the Armenian
Church's own spokesman**, who names an eighteenth-century figure; the article says he is venerated as
a saint with a feast in Lent and stops there.

### Sources

Ten entries, at the section's house standard. Orbelian in Bedrosian's English and Brosset's French as
the primary spine; Karakhanian and Abgaryan 2004 as the load-bearing modern source for the Gavazan
and the 1931 damage; Ambraseys 2004 for the 1139 date; La Porta 2007 for the terminological point;
Gornandt 2023 and Krikorian 1984 for Tatevatsi; Melkonyan and colleagues 2017 for the excavations;
UNESCO's Tentative List entry; and Guinness for the one cable-car fact.

**Three identifier problems were caught before shipping, and two of them were mine.**

1. I wrote a DOI for the Ambraseys paper from memory. It resolved — to *Raised marine terraces in the
   Northern Calabrian Arc*, an unrelated paper on Italian geology. Verified through Crossref and
   replaced with `10.4401/ag-3303`. **A DOI resolving is not evidence it is the right DOI**, and this
   is the second time in this project that checking metadata rather than status codes has caught
   something.
2. I supplied an ISBN for the *Divan hay vimagrutyan* epigraphic corpus that I could not verify. The
   source was **removed** rather than shipped with an invented identifier. It remains the authority a
   reader should go to next for any inscription-derived date, and the article reaches those
   inscriptions at one remove through Orbelian and Brosset, which the notes say.
3. UNESCO refuses automated requests, so the Tentative List entry's **reference number could not be
   confirmed a second time**. Its title, submission date and tentative status were corroborated
   independently; the reference number was read once, so the claim was **removed from all three
   editions** rather than asserted. It survives only inside the citation URL, where a reader can see
   it fail if it is wrong.

The remaining DOIs were checked by resolving them and reading back the title and authors.

### UNESCO status

**Tatev is not a World Heritage Site.** It has been on Armenia's Tentative List since 25 August 1995,
together with the hermitage of Tatevi Anapat and the adjacent Vorotan valley, and Armenia announced a
nomination in 2025 — which the article states as a different thing from inscription. Armenia's three
inscribed properties are Haghpat and Sanahin, Echmiatsin and Zvartnots, and Geghard with the Upper
Azat Valley; the last of those is named in the article's closing section precisely so the contrast is
explicit.

### Damage and restoration

The article distinguishes documented destruction, attributed damage, restoration and modern
reconstruction, and corrects three things that circulate widely.

- **The 1138/1139 dome collapse is primary-attested** — Orbelian reports it and names the Ganja
  earthquake as the cause. Ambraseys dates that event to 30 September 1139. The article notes that
  Ganja is about 145 km away, which is far enough that the report is worth flagging rather than
  repeating flat.
- **The "ten thousand manuscripts burned by the Seljuks at Tatev" is a triple distortion.** Orbelian
  describes more than ten thousand **items** — vessels and relics as well as books — at **Baghaberd**,
  not Tatev, **scattered** rather than burned. His own date converts to 1160 where 1170 is usually
  printed. All four corrections are in the article.
- **The dome was rebuilt in the Soviet campaign, not by the modern Tatev Revival** — designed 1981,
  completed 1988, against a programme that began in 2008.

And the closing section states the thing a visitor most needs: **every dome and every roof on the site
is a twentieth- or twenty-first-century reconstruction**, the belfry is an unfinished stump, and the
medieval fabric survives largely at wall level. The Gavazan is the one substantially un-rebuilt
monument, which is part of why it attracts the legends it does.

### Wings of Tatev

Three sentences inside the gorge section, and nothing more: it opened in 2010, it crosses from
Halidzor, and at 5,752 metres it holds the record for the longest non-stop double-track aerial
tramway. Stated explicitly as modern access infrastructure that is not part of the monastery. **No
fares, no hours, no booking, no superlatives.**

### The coordinate

```ts
"tatev-monastery": { lat: 39.3794, lon: 46.2501, precision: "site" },
```

| Source | Entity | Raw |
| --- | --- | --- |
| OpenStreetMap | node 505725848, `Տաթևի վանք`, in Tatev, Syunik | 39.3794315, 46.2501314 |
| Wikidata | Q554947 (P625) | 39.379366, 46.250031 |

The two agree to **about nine metres**, inside the four-decimal rounding this file stores, so no
adjudication was needed. The point is the monastic complex.

Deliberately not the Wings of Tatev tramway — OSM way 109650729 resolves to 39.3989804, 46.2735973 at
Shinuhayr, **about 3 km north-east**, and it is what a search for the site's best-known modern feature
returns. Nor Halidzor, nor Tatev village centre, nor the gorge, nor Tatevi Anapat, which shares the
Tentative List entry and is a genuinely different monument. `site` rather than `area` despite the
setting: the gorge is context, the enclosure is the subject.

**No existing coordinate was modified.**

### The map integrated itself

`src/lib/visit-map.ts` was **not touched**, and neither was `VisitMap.tsx`, `map-tiles.ts`, the Stadia
configuration or the Visit page. The map derives from `places ∩ PLACE_COORDINATES`, so writing the
article and recording the coordinate was the entire integration: **7 → 8 markers, no map-specific
slug added anywhere.** That is the property §44 was built for and this is the first time it has been
exercised.

### The bounds adapted — and two pairs of pins now overlap

The derived bounds hold all eight markers, which a new test asserts by checking every marker's box
lies inside the map container's box rather than by eyeballing a screenshot.

But adapting has a visible cost, and it is recorded rather than hidden. Tatev is about a degree of
latitude south of everything else, so `fitBounds` zooms out by roughly **3.6x** — and at that scale
two pairs of markers overlap at the initial view:

```
erebuni-fortress / matenadaran     25 x 26 px
garni-temple / geghard-monastery   12 x 31 px
```

Both pairs are 6–8 km apart on the ground, and both were comfortably separated before the eighth
point existed. This was **measured, not assumed** — the pin positions were read out of the rendered
DOM.

It is not fixed here, deliberately: fixing it means changing the marker-derived bounds, which this
step is explicitly forbidden to touch, and the accessible list below the map already carries all eight
places as text regardless of what the pins do. A reader can also still reach either pin by clicking
its exposed part or zooming in. **It is carried forward as open debt**, and the honest options when it
is addressed are marker clustering, a small collision offset, or a higher `maxZoom` on the initial
fit — all of them map-architecture changes.

The one thing it did change is a test. `every place can be selected and shows its own image` now
drives the **keyboard** path — focus, Enter — because a mouse click aimed at an element's centre
cannot reach a pin whose centre is behind another. That is a real supported interaction, already
asserted elsewhere in the file, and it is not a weakening: `force: true` was the alternative and was
rejected, since it would have asserted that a click dispatched at a covered element works, which is
not something any reader does.

### Related content

`["geghard-monastery", "matenadaran", "bagratid-armenia"]`, identical and in the same order in all
three editions.

Geghard because the connection was asserted by this archive **before this article existed** — the
Geghard article says its own school "is not in the class of Gladzor or Tatev", which is the sentence
the eighth place was always pointing at. The Matenadaran because the article genuinely discusses
manuscript production and Tatevatsi's own illumination, not because both involve books. And
`bagratid-armenia` because King Smbat attended the consecration and the section links to it on that
phrase.

**No geographically-near tourist places** were added, and there is no itinerary relationship of any
kind.

### Artwork

**Pending.** `public/images/places/` holds seven files and none is Tatev, so the article ships with the
generated placeholder, no `image` block, and no `image:loc` in the sitemap. `PENDING_ARTWORK` names
it for the seventh time, with the rejected substitutes recorded: Geghard and Etchmiadzin, because
neither picture has a gorge, a plateau or a fortified enclosure and telling a reader Tatev looks like
a cave monastery is the most misleading thing this article could do; Khor Virap, whose Ararat plain is
the visual opposite; and `bagratid-armenia`, which offers a gorge with no monastery in it.

The note also records the part of a future commission most likely to go wrong: **the Gavazan is a
slender free-standing octagonal column with a khachkar on top, south of the church — not a khachkar on
a plinth, and not attached to a wall.**

### Localization and parity

All three editions were written in one change, English first, then Eastern Armenian, then Western
Armenian, with `scratchpad/check.ts` run after each. The final run reports **0 differing rows across 3
editions** — identical section ids, identical paragraph counts, identical `relatedSlugs` order, and
identical numeral multisets in every one of the nine validator field groups.

Established terminology was reused rather than reinvented, because the repo already had most of it:
`Տաթև` / `Տաթեւ`, `Գրիգոր Տաթևացի` / `Գրիգոր Տաթեւացի`, `Սյունիք` / `Սիւնիք`, `Որոտան`, `գավիթ` /
`գաւիթ`, `համալսարան`, `գրչատուն`. **Three terms had no precedent and are coined here**: Hovhan
Vorotnetsi (`Հովհան Որոտնեցի` / `Յովհան Որոտնեցի`), the Gavazan (`Գավազան` / `Գաւազան`), and
Poghos-Petros for the principal church.

### Western Armenian items requiring native review

The whole edition is flagged, and these eleven items in particular:

1. **«Տաթեւ»** and its genitive **«Տաթեւի»** — inherited from the Geghard article, so consistent, but
   never reviewed.
2. **«Սիւնիք»** for Syunik, as used in the existing history articles.
3. **«Գաւազան»** for the column, coined here.
4. **«Յովհան Որոտնեցի»** — the initial `Յ-` follows Western practice; a reviewer should confirm.
5. **«Պողոս-Պետրոս»** as the church's short name, and **«Սուրբ Առաքելոց»** as its medieval alternative.
6. **«վարդապետական աստիճաններ»** for the fourteen vardapet ranks.
7. **«սխոլաստիք»** for scholastic, against a possible «դպրութենական».
8. **«ձիթհան»** for the oil press.
9. **«ծխնիաւոր յօդ»** for the hinged joint at the column's base — a technical phrase with no
   precedent in the repo.
10. **«ԵՈՒՆԵՍՔՕ»**, following the Geghard article rather than the Eastern «ՅՈՒՆԵՍԿՕ».
11. **«Պրոսսէ»** for Brosset and **«Ապիխ»** for Abich — transliterations of two European surnames.

### Commands and results

| # | Command | Result |
| --- | --- | --- |
| 1 | port 3002 | clear |
| 2 | remove `.next` | removed |
| 3 | `npx tsx scratchpad/check.ts tatev-monastery` | **PASS** — 0 differing rows across 3 editions |
| 4 | `npm run typecheck` | **PASS** |
| 5 | `npm run validate:content` | **PASS** — 123 entries across 3 locales |
| 6 | `places.spec.ts` | failed 5, fixed, then **49 passed** |
| 7 | `visit-map.spec.ts` + `visit.spec.ts` | failed 6, then 2, then **50 passed** |
| 8 | `npx playwright test` | **PASS** — 247 passed |
| 9 | `npm run build` | **PASS** — **132 routes** |

Playwright and the build were not run concurrently.

**Every failure, and what it was:**

*Content validation, one round.* The Eastern Armenian `metaDescription` came out at 167 characters
against the 165 ceiling. Trimmed one word.

*`places.spec.ts`, five failures, all genuine consequences of an eighth place and all fixed rather
than suppressed:*

1. The monastery filter asserted three cards; it is four.
2. The pinned `byType` map asserted `monastery: 3`.
3. The listing asserted zero placeholders; there is now exactly one. **Rewritten as
   `PLACES.length - ILLUSTRATED.length`** so the next place to ship ahead of its picture does not need
   a literal edited by hand.
4. `PENDING_ARTWORK` was asserted equal to `[]`. Rewritten to derive the expected contents from the
   same two lists, for the same reason.
5. `must not link to Geghard` — Tatev does, deliberately. **Narrowed rather than deleted**: every
   other place must still not link to Geghard, so the one-directional architecture is still pinned,
   and the exception is documented at the assertion.

The `EXPECTED` map in the same file was also re-keyed from `ILLUSTRATED` to `PLACES`. The two lists
were identical when it was written so either compiled; they are not identical now, and type, featured
flag and related slugs have nothing to do with whether a picture exists. Keying on the artwork list
would have silently exempted the newest article from the strictest test in the file.

*`visit.spec.ts` and `visit-map.spec.ts`, six failures, then two:*

6. A `TypeError` — `getImageSrc(...)!.split(...)` on a place with no image. Split into two branches:
   an illustrated place must show its own file, an unillustrated one must show **none**, which is a
   stronger claim than skipping the check.
7. `nothing may be curated while its artwork is pending` asserted `PENDING_ARTWORK` was globally
   empty. That was free when it was written and is wrong now: Tatev is pending and deliberately **not**
   curated. Narrowed to the curated slugs, which is what the assertion was always about.
8. Four further failures in that run — a scroll timeout, `/hy/history`, an edition-switch heading and
   `/en/places/garni-temple` — did **not** recur once the two above were fixed. They were downstream
   of the same timed-out run rather than independent, and nothing was changed to make them pass.
9. `/en/places` card count, 7 → 8. Edited as a literal on purpose: this assertion exists to prove a
   curated row does not change what the listings contain, so it should need a deliberate update when
   the section genuinely grows.
10. The marker-click timeout, which turned out to be the pin overlap described above.

### Existing content — regression check

- **No existing article, coordinate, source, media path, artwork, `placeTypeId` or curated slug array
  was modified.** The Visit hub's six-place row is unchanged, per §26: the curated row is selective
  and the map is comprehensive, and Tatev landing on one but not the other is the distinction working.
- `src/lib/visit-map.ts`, `src/components/visit/VisitMap.tsx`, `src/lib/map-tiles.ts`, `.env.example`
  and the Visit page are all byte-identical. The eighth marker required **zero provider changes** and
  zero map-architecture changes.
- Structured data is unchanged: Tatev emits the generic Article schema like every other place, and no
  tourism type was added.
- The full suite is green at 247, including the Stadia configuration, credential-leak and lazy-loading
  tests from §45 and §46.
- `.claude/settings.json` was modified by the permission layer and reverted.

Files changed: `src/data/locales/{en,hy,hyw}/articles/places.ts`, `src/data/geo.ts`,
`src/data/sources.ts`, `src/lib/media.ts`, `tests/e2e/places.spec.ts`, `tests/e2e/visit-map.spec.ts`,
`tests/e2e/visit.spec.ts`, and this document.

### Still open

Carried forward. Nothing on this list was fixed here.

- **Marker overlap at the initial map extent — new.** Erebuni/Matenadaran and Garni/Geghard overlap by
  25 and 12 pixels now that the bounds stretch to Syunik. Fixing it means clustering, a collision
  offset, or a higher `maxZoom` on the initial fit; all three are map-architecture changes this step
  could not make.
- ~~**Tatev artwork** — pending, with the rejected substitutes and the Gavazan's shape recorded above.~~ — **resolved in §48.**
- **The production tile provider** — Stadia is configured; the domain authorisation remains an
  operational step outside this repository.
- **The Matenadaran façade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions.**
- **The Geghard photographic register**, recorded in §42.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts:355`. Did not reproduce here.
- **One-directional `relatedSlugs`** — now with one documented exception, Tatev to Geghard.
- **Western Armenian native review** — nineteen terminology items across the archive, eleven of them
  added here.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` living outside `scripts/`** — used three times in this step and more useful
  than ever, which strengthens rather than weakens the case for moving it.
- **The weak homepage hero-path assertion.**
- **`settlement`** — declared in the `precision` union and still used by no entry. Tatev village would
  have been the first, and it is not what this coordinate records.
- **No central environment module**, recorded in §45.
- **Khalpakhchian 1962 not read directly** — new. The article's Gavazan section attributes the
  seismic-recording interpretation to it at one remove, through Karakhanian and Abgaryan 2004. Anyone
  strengthening that section should read the original article.

### Deliberately not built

No new place type. No new articles for Vorotnetsi or Tatevatsi to satisfy a relationship. No changes
to map architecture, data derivation, markers, bounds, filters, selection, the accessible list, the
provider configuration or the Visit curation. No routes, directions, geolocation, restaurants, hotels,
tours or live travel information. No cable-car fares, hours or booking. No invented student counts,
departments, degree structures or curricula. No UNESCO inscription claimed. No fabricated identifier
or page number — and two that had crept in were caught and removed.

No deployment was performed.

## 48. Tatev artwork — the pending entry, cleared for the seventh time (August 2026)

§47 shipped the eighth place with no picture and wrote down exactly what a picture would have to
show: a walled complex on a plateau above a gorge, with none of the substitutes on hand carrying all
three. `tatev-monastery.webp` carries all three in one frame. This registers it.

Nothing about the article changed. The prose, the 895/906 distinction, the Gavazan section, the
University wording, the two figures, the sources, the coordinate, the related slugs, the section
links, the SEO fields, the taxonomy and the Western Armenian edition are all byte-identical — verified
rather than asserted, since the three `articles/places.ts` files contain no `image:` field at all and
the artwork reaches the page entirely through `getArticleImageSrc`.

### The asset

| | |
| --- | --- |
| Path | `public/images/places/tatev-monastery.webp` |
| Dimensions | **1586 x 992** (aspect 1.5988, about 16:10) |
| Size | **271,306 bytes** — 264.9 KB |
| SHA-256 | `d2db046faf7aa3beb01a6f27ea3d2bae1ba1c06a6772e174e6c5fdee184bf673` |
| Container | `RIFF` / `WEBP`, size field 271,298 = file length minus 8, consistent |
| Chunks | a single `VP8 ` chunk of 271,286 bytes |
| Encoding | simple lossy, keyframe, version 0 |
| Colour | sRGB, 3 channels |
| Alpha / ICC / EXIF / XMP / animation | **none** — there is no `VP8X` chunk, so no extended header exists to carry them |

Read out of the container by hand and confirmed independently through `sharp`, which agrees on every
field. The extension was not trusted: the RIFF magic, the `WEBP` fourcc, the internal size field and
the chunk walk were all checked.

**1586 x 992 is the house dimension**, matching Etchmiadzin, Erebuni, the Matenadaran, Lake Sevan and
Geghard exactly. Garni remains the odd one at 1448 x 1086 and Khor Virap the only PNG. At 265 KB it
sits in the middle of the range — comfortably under Erebuni's 742 KB and the Matenadaran's 701 KB, and
close to Geghard's 271 KB.

That closeness to Geghard prompted a check worth recording: **all eight files were hashed and are
byte-distinct.** Two monastery covers of near-identical weight is exactly the coincidence that would
hide a duplicated file, and it is not one.

### Visual inspection

The image was opened and looked at, not inferred from its filename.

An elevated three-quarter view of a walled monastery standing on a rock shelf at a cliff edge, with a
deep gorge falling away to the right and a river visible far below. Every required element is present:

- **Principal church recognisable** — the dominant building, centre-right, with a cross on its finial.
- **Armenian conical dome and drum plausible** — a polygonal umbrella roof on a tall drum pierced with
  narrow windows. The correct type, not a Byzantine hemisphere or a Georgian cone.
- **Enclosure visible** — a continuous curtain wall wraps the whole plateau and runs along the
  precipice, which is the fortified-monastery reading the article's prose depends on.
- **Dense and accumulated** — a second smaller domed church and a tower behind, a porch with an arched
  portal in front, ancillary ranges either side, courtyard structures. Not one isolated church.
- **Plateau and gorge relationship obvious** — the wall sits directly on the cliff, and the drop is the
  right-hand third of the frame.
- **Plausibly Syunik** — steep scrub-and-rock mountainsides, basalt outcrops, a river gorge.

And every excluded treatment is genuinely absent: **no Geghard-style rock-cut or cave architecture**
(all masonry, nothing cut into a cliff), **no Khor Virap / Ararat plain composition** (no flat plain,
no snow cone), **no Garni Ionic temple** (no colonnade), **no Etchmiadzin urban cathedral** (no city,
no formal precinct).

On unsupported claims, which was the sharper risk given this article's subject matter: **no Gavazan
seismograph imagery, no motion or vibration graphics, no instrument iconography; no cable car; no
UNESCO mark; no classroom scene; no miraculous event; no invented inscription or date; no tourism
infrastructure.** A few small monastic figures walk in the courtyard and that is the extent of the
human presence.

One detail is worth naming because §47 predicted it would be the hard part. A slender free-standing
pillar with a carved top stands in the courtyard south-east of the church, which is where the Gavazan
belongs and what it looks like — a column, not a khachkar on a plinth and not attached to a wall. It
is depicted as an ordinary stone monument with no suggestion of movement or measurement, which is
precisely the restraint the article's most evidence-sensitive section required.

**One concern, reported and not acted on: the photographic register.** This reads as a drone
photograph rather than an illustration — the same concern recorded for Geghard in §42 and still open
there. The provenance mechanism is unchanged and still declares the file AI-generated, which is
accurate; the concern is that a reader may not perceive it as such. `ARTWORK_PROVENANCE` was not
touched, no per-image metadata was introduced, and this stays on the debt list rather than being
solved by a change nobody asked for.

### Crops

Evaluated against the ratios the code actually uses, read out of the components rather than assumed —
`ArticleLayout` is `4:3 / sm:3:2 / lg:16:9`, `ArticleCard` is `4:3` compact and `16:9` default, and
the map's detail panel is `16:9`. The search thumbnail has no declared ratio at all: it is a
fixed-width column, `w-32` rising to `lg:w-40`, with `h-full`. **It was measured live** at
**160 x 223, ratio 0.719**, with shorter cards giving 160 x 200 and 0.801.

| Surface | Ratio | Result | Trim |
| --- | --- | --- | --- |
| Compact card | 4:3 | good | 263 px of width, 16.6% |
| Mobile hero | 4:3 | good | as above |
| Tablet hero | 3:2 | good | 98 px of width, 6.2% |
| Listing card | 16:9 | **best** | 100 px of height, 10.1% |
| Desktop hero | 16:9 | **best** | as above |
| Search thumbnail | 0.719 | good | **873 px of width, 55.0%** |

Real crops were generated with `sharp` at each ratio and looked at, not reasoned about.

**16:9 is the strongest**: the 50 px trimmed from top and bottom is sky and foreground rock, and the
dome, its cross, the full enclosure, the cliff face and the gorge with its river all survive intact.

**4:3 loses 16.6% of the width** and still keeps the gorge on the right — the element most at risk from
a horizontal trim, and the one whose loss would have made the image indistinguishable from any other
hilltop monastery.

**The search thumbnail is the surprise.** Cropping a 1.6 landscape to 0.72 portrait discards 55% of the
width, and the result is *better* for identification than the full frame: the dome fills the centre,
the second church and tower sit to its left, the enclosure runs across the bottom and the cliff face
below it is unmistakable. The gorge's far wall survives at the top right; only the river is lost. A
reader scanning search results still sees Tatev.

**No `object-position` rule was added, and none is needed.** The default centre crop works at all six
ratios, so no Tatev-specific crop logic, no new component and no custom routing entered the codebase.

### Registration

One line in the Places block of `IMAGES`:

```ts
"tatev-monastery": "/images/places/tatev-monastery.webp",
```

Verified through the existing pipeline and nothing else:

- `getImageSrc("tatev-monastery")` -> `/images/places/tatev-monastery.webp`
- `isGeneratedArtwork({ slug: "tatev-monastery" })` -> **`true`**
- registered Places covers: **8**
- `ARTWORK_PROVENANCE` -> `{ source: "ai-generated", documentary: false }`, **unmodified**
- `IMAGES` and `PENDING_ARTWORK` are **mutually exclusive** — no slug in both

No Tatev-specific image logic, no new image field, no per-image provenance, no new component, no
custom routing. The article files still carry no `image` block, which is the point: the registry is
the single place a cover is declared.

### Pending artwork

`PENDING_ARTWORK` is **empty**, for the seventh time — after §32 (Etchmiadzin), §34 (Erebuni), §36
(Matenadaran), §38 (Lake Sevan), §40 (Garni), §42 (Geghard) and now §48 (Tatev).

The list stays in place while empty, as it has each previous time, and §47's rejection notes were kept
rather than deleted: the four substitutes refused there were refused because none carried the plateau,
the enclosure and the gorge together, and recording that the delivered file does carry all three is
what makes the refusal legible later. `validate:content` no longer prints its placeholder note, and
the count of entries it validates is unchanged at 123 — this step added no content.

### Verification on the rendered pages

- **Article hero**, all three editions: Tatev's own WebP renders, the generated `<svg role="img">` is
  gone, the caption is the **AI-illustration** wording and explicitly **not** the placeholder wording.
  The two strings differ by a single dictionary key and both look plausible, which is why both
  directions are asserted.
- **Places listing**: zero placeholders. The assertion is `PLACES.length - ILLUSTRATED.length`, written
  as a derivation in §47, so it moved from 1 to 0 without being edited.
- **Per-card ownership**: the stricter Geghard-era assertion still runs card by card over all eight
  places, matching each card's own `href` to its own file. A count alone would pass if two neighbours
  swapped covers; this would not.
- **Open Graph, Twitter and `Article.image`**: all three now carry Tatev's WebP, through the existing
  `ILLUSTRATED` loop that covers every registered place.
- **Sitemap**: `image:loc` entries for all three locale routes, each naming `tatev-monastery.webp`.
  §47 asserted the opposite — that an unillustrated place advertises no image — and that assertion is
  inverted here rather than deleted.
- **Global search**: Tatev's result card renders its own file, scoped by Tatev's canonical href rather
  than by result position.
- **Borrowing**: Geghard, Etchmiadzin, Khor Virap and Garni are each named and asserted absent from
  Tatev's head metadata and hero. Kept across the registration, because the failure it guards against —
  a cover repointed at a plausible neighbour later — outlives the file landing.

### Map

`src/lib/visit-map.ts`, `src/components/visit/VisitMap.tsx` and `src/lib/map-tiles.ts` are **unchanged**,
as is the Visit page.

The map still holds exactly **8** places, derived from `places ∩ PLACE_COORDINATES` with no allow-list
anywhere. Tatev's marker still resolves Tatev's article, every other marker keeps its own image, and
the bounds are unchanged — registration touched an image path, not a coordinate.

The selected-panel assertion inverted **by itself**, which is the part worth recording. §47 wrote it as
a branch on the registry — a registered place must show its own file, an unregistered one must show
none — rather than as a hardcoded list. Registering the file moved Tatev from the second branch to the
first with no test edit, and the branch is still there for the ninth place.

**Marker overlap is unchanged and remains open.** Erebuni/Matenadaran and Garni/Geghard still overlap
by 25 and 12 pixels at the initial extent; this step deliberately did not address it, and the
keyboard-driven selection loop §47 introduced for that reason is still how the exhaustive test
selects markers.

### Visit curation

**Unchanged.** The curated row is still the same six places, and Tatev is still not among them.
Registering artwork does not make a place curated — the row is an editorial selection and the map is
coverage, which is the distinction §43 established and §26 of the previous step preserved.

The one assertion that had to be scoped in §47 — curated slugs must not be pending — still passes, and
now passes trivially, since nothing is pending at all.

### Structured data

Unchanged in shape. Tatev emits the same generic Article schema every other place does, and the only
consequence of registration is that the existing `Article.image` field now has a value. **No `Place`,
`Monastery`, `TouristAttraction`, `GeoCoordinates` or `LandmarksOrHistoricalBuildings` type was
added**, and the graph is otherwise identical.

### Tests

`ILLUSTRATED` gains Tatev and becomes eight; `ARTWORK` gains
`"tatev-monastery": "/images/places/tatev-monastery.webp"`.

**`PLACES` and `ILLUSTRATED` are kept as separate constants** even though they now hold the same eight
slugs. They have coincided six times before and split again every single time, and each of those
splits was one slug moving between two lines. Collapsing them while they happen to match would mean
rebuilding the distinction under pressure the next time a place ships ahead of its picture — which the
file's own history says will happen.

Two Tatev-specific tests were **inverted rather than deleted**: the placeholder test became a
registered-artwork test, and the sitemap half of the borrowing test flipped from asserting no
`image:loc` to asserting one per locale naming Tatev's own file. Both directions have been true at
different times, and the inversion is the record of which one is true now.

Several §47 assertions needed **no edit at all**, because they were written as derivations rather than
literals: the placeholder count, the `PENDING_ARTWORK` contents, the listing image count
(`ILLUSTRATED.length + 1`) and the map's selected-panel branch. That was the intent when they were
written and it paid off one step later.

### Commands and results

| # | Command | Result |
| --- | --- | --- |
| 1 | port 3002 | clear (after the incident below) |
| 2 | remove `.next` | removed |
| 3 | `npm run typecheck` | **PASS** |
| 4 | `npm run validate:content` | **PASS** — 123 entries, placeholder note gone |
| 5 | `places.spec.ts` (desktop) | **PASS** — 49 |
| 6 | `visit-map.spec.ts` (desktop) | **PASS** — 27 |
| 7 | `visit.spec.ts` (desktop) | **PASS** — 23 |
| 8 | `npx playwright test` | **PASS** — 247 passed, 5 skipped |
| 9 | `npm run build` | **PASS** — 132 routes |

**Zero product failures.** Every test passed on its first run against the registered artwork; nothing
was retried away and no assertion was loosened.

**Two process failures, both mine, both worth recording:**

1. **I deleted `.next` while a dev server was running on it.** Turbopack's cache went with it, the
   server stayed listening on 3002 while returning 500, and Playwright then reported
   `Process from config.webServer was not able to start`. The fix was to kill the stale process and let
   Playwright start a clean one. The verification order says to remove `.next` — it does not say to do
   it underneath a live server, and that is the step I got wrong.
2. **Two full-suite runs overlapped** and interleaved their output into one log, producing a nonsense
   summary of "26 passed". No test result was trusted from that run; the suite was re-run cleanly once,
   which is the 247/5 recorded above.

Playwright and the production build were not run concurrently.

### Existing artwork — regression check

- **No existing image file was modified, renamed, moved, re-encoded or re-registered.** All seven prior
  covers keep their exact paths, and the per-card ownership test proves each still belongs to its own
  article.
- No article content changed anywhere in the archive: the three `articles/places.ts` files, `geo.ts`
  and `sources.ts` carry only their §47 edits, which are still uncommitted from the previous step and
  untouched by this one.
- `ARTWORK_PROVENANCE`, `IMAGE_SIZES` and `PORTRAIT_FOCUS` unchanged; `getImageSrc`,
  `getArticleImageSrc` and `isGeneratedArtwork` unchanged.
- Leaflet, the Stadia configuration, the tile environment variables, attribution, the network and
  privacy tests, lazy loading, marker glyphs, map-local filters, marker selection and the accessible
  fallback are all untouched. No geolocation, routing, geocoding or API addition.
- `.claude/settings.json` unchanged.

Files changed: `src/lib/media.ts`, `tests/e2e/places.spec.ts`, and this document. Added:
`public/images/places/tatev-monastery.webp`.

### Still open

Carried forward unchanged. Nothing on this list was fixed here.

- **Map marker overlap** — Erebuni/Matenadaran at 25 px and Garni/Geghard at 12 px, at the initial
  extent. Explicitly out of scope for an artwork step, and still the reason the exhaustive marker test
  drives the keyboard.
- **Khalpakhchian 1962 not read directly** — the load-bearing citation for the entire Gavazan
  seismograph tradition, still cited at one remove through Karakhanian and Abgaryan 2004.
- **The photographic register** — now recorded for Tatev as well as Geghard. Two of the eight Places
  covers read as photographs rather than illustrations.
- **The Matenadaran facade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions** — still the only WebP that is not 1586 x 992.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB. Tatev at 265 KB does not move this.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts`. Did not reproduce here.
- **One-directional `relatedSlugs`**, with the documented Tatev-to-Geghard exception.
- **Western Armenian native review** — nineteen terminology items.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` living outside `scripts/`.**
- **The weak homepage hero-path assertion.**
- **`settlement`** — declared in the `precision` union and used by no entry.
- **No central environment module.**
- **Production Stadia dashboard and domain authorisation** — operational, outside this repository.
- **Raster label-language limitation** — Stadia raster tiles bake in bilingual labels.
- **Privacy-page provider disclosure** — undecided.

### Deliberately not built

The image was not generated, edited, cropped, resized, recoloured, renamed, optimised or replaced. No
`object-position` rule, no Tatev-specific image logic, no new image field, no per-image provenance, no
new component, no custom routing. No article content, coordinate, source or translation touched. No
map architecture, provider configuration or curation change. No new structured-data type. The marker
overlap was left alone.

No deployment was performed.

## 49. Dilijan National Park — the ninth place, and the archive reaches the north (August 2026)

§47 took the map south to Syunik. This one takes it north, and it does something the previous eight
did not: it adds a place that is not a building. Every Place in this archive so far has been a
structure or a lake — something with an address. Dilijan National Park is a legal designation over
33,765 hectares of forested mountain, and almost every difficulty in writing it came from that one
fact.

It also corrects a picture the archive was quietly painting. Khor Virap, Garni, Etchmiadzin, Erebuni,
the Matenadaran, Sevan, Tatev — dry ground, bare ridges, a mountain on the horizon. That is the
Armenia of the photographs and it is most of the country, but it is not all of it, and an archive
that only ever showed it would be making a claim about the Armenian Highland that is false. The
north-east faces the moist air off the Caucasus and grows closed broadleaf forest. The last section
of the article is about exactly that, and it is why the article exists rather than being a park
description.

### Taxonomy

| Filter | Before | After |
| --- | --- | --- |
| All | 8 | **9** |
| Monastery | 4 | 4 |
| Historical | 2 | 2 |
| Museum | 1 | 1 |
| Nature | 1 | **2** |

`placeTypeId: "nature"`, `featured: false`. **Khor Virap remains the only featured place.** No new
place type was invented: `national-park`, `protected-area` and `forest` were all available and all
rejected, because `nature` already means "the place is a landscape rather than a building" and a
taxonomy with one member per article is not a taxonomy. This is the first time a `places` filter has
gone from one member to two, which matters more than it sounds — a single-member filter cannot fail
in the ways a multi-member one can, and the listing tests had to stop treating `nature` as the
special case it had been since §37.

### Structure

Eleven sections, `3/3/4/3/4/3/4/3/4/4/3` paragraphs, **38 in total** — the same paragraph count as
Tatev in one more section, with `keyFacts 6 · importantDates 8 · interestingFacts 5 · significance 2
· relatedFigures 0 · relatedSlugs 1 · section links 1`. The sections are: where the park is; the
ridges, the valleys and the height of it; from reserve to national park; how large it is and what the
figure measures; the forest; the plants and what the counts are evidence of; the animals; rivers,
lakes and springs; the monastic landscape; what the forest has been through; why Dilijan does not
look like the rest of Armenia.

**`relatedFigures` is empty, for the first time in a Places article.** That is a finding, not an
omission. Tatev has Orbelian, Vorotnetsi and Tatevatsi; Garni has Tiridates; the Matenadaran has
Mashtots. A forest has no biography attached to it, and inventing one — Soviet-era resort composers,
the monasteries' founders — would have been the article borrowing significance from people who
belong in other articles. The field is empty because the honest answer is empty.

### The chronology, which is where the published numbers go wrong

The single most important thing the article establishes is that **1958 and 2002 are two different
legal acts, not one event described twice.**

- **1958** — the Dilijan **state reserve**, established by **decree P-341 of the Council of Ministers
  of the Armenian SSR**, on ground that had until then been worked as the Dilijan and Kuybishev
  forest enterprises. It is one of Armenia's first three specially protected areas, alongside Khosrov
  Forest and Shikahogh, and all three were created for forest.
- **21 February 2002** — **Dilijan National Park**, established by **decree 165 of the Government of
  the Republic of Armenia**, as a state non-commercial organisation on the basis of that reserve.

A Soviet *zapovednik* is a stricter designation than a national park: it exists to be kept intact and
studied, not visited. Forty-four years separate the two acts. A source that dates "the park" to 1958
is describing the reserve; a source that dates it to 2002 is describing the park; and a figure
quoted from one period does not describe the other. Almost every confused number published about
Dilijan comes from collapsing the two, which is why the article spends a whole section on it before
it gets anywhere near the area.

**The Akhnabad yew grove is a third thing and is kept out of both.** Twenty-five hectares of relict
*Taxus baccata* on the Tsaghkot spur of the Miapor range near Aghavnavank, at 1,400 to 1,700 metres,
protected in its own right on 13 September 1958 — a **sanctuary**, administered by the Dilijan park
organisation but never part of the park's own area. The same administration also manages a juniper
sparse-forest sanctuary of 1,807 hectares over in Gegharkunik. **Managed by is not inside**, and the
article says so twice because the yew is in nearly every description of this forest and is the
easiest 25 hectares in Armenia to add to the wrong total.

### The area, and what the figure measures

| Figure | Source | What it says it measures |
| --- | --- | --- |
| **33,765 ha** + **8,167 ha** buffer | the park administration, via NABU | the land held by the national park as an organisation, buffer stated separately |
| 240 km² | Wikipedia, Wikidata (Q1984244) | **unstated** — no boundary, no date |

The article uses the administration's figure, and the reason given is not that it is larger but that
**it is the only one that says what it counts.** The 240 km² figure is about two thirds of it, is
close to the order usually quoted for the Soviet-era reserve, and carries neither a boundary nor a
date on either surface that publishes it. The article's verdict is deliberately unexciting: it is a
different measurement of something, unattributed.

There is independent corroboration from an unexpected direction. Computing the area of the OSM
outline during the coordinate work (below) put it at **about 352 km²** — the order of the
administration's 337.65 km², not of the 240. That is recorded in `geo.ts` because it is the reason a
mapped boundary was preferred to a gazetteer point in the first place.

The rule the section states is the transferable part: *the park is not the reserve, not the buffer
zone, not the forest enterprise it was made from, not the municipality, and not the tourist region
that shares its name.* Any of those could be measured; each gives a different answer; a figure with
no boundary attached is not a fact about the place.

### The forest

Roughly half the park is under trees and the trees are **98.85 per cent broadleaved against 1.15 per
cent coniferous** — a 2019 satellite classification from Morin et al., not an impression. That single
number does most of the section's work: describing Dilijan as oak, beech and hornbeam is not
shorthand, it is very nearly the complete account.

The three dominants are *Fagus orientalis* on the moist shaded slopes, *Carpinus betulus* and
*Carpinus orientalis* through the middle ground and dry edges, and oak on the hard positions —
*Quercus macranthera* high and cold, plus the eastern Caucasian oak that older Armenian literature
calls *Quercus iberica* and recent treatments fold into *Quercus petraea* as a subspecies. **That
disagreement is flagged as a taxonomic revision, not a dispute about which tree grows there**, which
is the kind of distinction that otherwise reads as two sources contradicting each other.

The conifers are handled as the exception the park was partly created to keep, and the yew is
explicitly a relict of an older, wetter climate rather than a feature of the current forest — which
is also why the artwork brief below forbids a pine-and-fir picture. A coniferous cover image would
state the opposite of the article beneath it.

### Biodiversity — the counts, and what they are evidence of

The park's flora is quoted everywhere as **902 vascular plant species**, 881 of them flowering, with
about 40 rare, 29 in Armenia's Red Book and **four in the Red Data Book of the USSR**.

That last clause is the section's whole point, and it is usually reprinted without anyone noticing
what it says. **A count whose rarity criteria include a Soviet red list is a count assembled before
1991.** The number may still be broadly right — a flora does not turn over in a generation — but it
is a survey result from a particular period restated ever since as a standing fact, and the article
refuses to treat it as evidence about the park's plants today. The dating comes from the figure's own
wording rather than from any external claim about it, which is what makes it usable.

The vertebrate figures get the same treatment for the same reason. **~150 birds and 40+ mammals**
appear in almost every description, always without a date, a surveyor or a method. The article calls
them plausible **orders of magnitude for a forested protected area of this size in the Caucasus** and
says they are worth exactly that much. No species total is presented as a measurement anywhere in the
article.

Two things are stated with confidence because they have documentation behind them:

- **The Caucasian red deer**, *Cervus elaphus maral* — widespread in the nineteenth century, locally
  extinct in the 1950s, critically endangered in Armenia's Red Book. Reintroduction begun 2013 by the
  environment ministry with WWF Armenia; a fenced enclosure of about 10 hectares of forest near Parz
  Lake; founder animals from Iran in 2018 and the first calf born that year; later releases into the
  park itself stated **without a headcount, because the published numbers differ between accounts.**
- **A caddisfly new to science**, *Wormaldia dilijanica*, described in 2026 from one tributary of the
  Aghstev, from specimens taken during a short survey in May 2025. This is cited for one purpose: a
  protected area where a brief visit to a single stream yields an undescribed species is not a place
  whose species lists should be read as complete. It is the evidential basis for the caution applied
  to every count above.

### The cultural landscape, and the enclave pattern

| Monument | Relative to the mapped boundary |
| --- | --- |
| Haghartsin | inside, well within the forest in a northern side valley |
| Jukhtak Vank | inside, on the slopes above Dilijan town |
| Matosavank | inside, likewise |
| Aghavnavank | inside, in the east near the village and the yew grove |
| **Goshavank** | **~280 m outside**, in the Gosh village enclave, park forest on every side |

The boundary is drawn **around** the inhabited ground rather than over it. The town of Dilijan sits
inside the outline and outside the protected land; so does the village of Gosh. That is why a visitor
can stand in the town centre and be outside the park, and it is why Goshavank — which the park
administration's own descriptions list among its monuments — falls just beyond the line as OSM maps
it.

**The article states the geography instead of choosing a side.** Both claims are defensible and they
answer different questions: the administration is describing what it presents and interprets, the
outline is describing where the protection legally sits. The ~280 m is a measurement taken against
the OSM outline during the coordinate work; the article prose says only "a few hundred metres", which
is the right precision for a community-maintained boundary.

The enclave pattern is then used to explain three other things at once: why the area figure excludes
the town, why grazing and building pressure arrive from *inside* the outline rather than from beyond
it, and why a monastery can be in the middle of the park and outside it simultaneously.

**What the section deliberately does not do is tell these monasteries' histories.** Haghartsin and
Goshavank are major medieval foundations with their own chronologies, inscriptions and disputes, and
each deserves its own article rather than a paragraph borrowed from a park's. They appear here as
buildings in a forest. Neither is in `relatedSlugs`, because neither has an article and
`validate:content` fails the build on a slug that does not resolve — which is the mechanism that
stops a plausible-looking future slug from shipping as a dead recommendation.

### Conservation — the best-documented thing about the place

The strongest source in the bibliography is **Morin et al. 2021** (*Remote Sensing* 13(15), 2942,
doi:10.3390/rs13152942), produced for UNDP Armenia — **the first remote-sensing assessment of any
specially protected area in Armenia**, mapping forest density and land cover at eight dates from 1991
to 2019 from Landsat and Sentinel-2, calibrated against high-resolution photography.

| Period | Forest lost | Degraded |
| --- | --- | --- |
| 1991–1995 | 253 ha | 384 ha |
| 1995–2000 | — | 363 ha |
| **2002–2005** | **none measured** | **22 ha** |
| 2015–2019 | 45 ha (against **104 ha regenerating**) | — |

The curve breaks immediately after the national park was declared, and the authors attribute that
directly to the protective measures the new status brought. This is the rarest thing in the article:
a legal act and a measured curve that turn at the same date. It is also why the significance block
argues the park's value in terms of *evidence about what protection does* rather than in terms of
scenery.

**The authors' own caveat is repeated rather than buried.** They attributed every degraded patch to
human causes unless they could prove otherwise, had no field data on storms or disease, and state
plainly that their anthropogenic figure is therefore **very likely an overestimate**. The article
carries that sentence because a source that limits its own findings is more useful quoted with the
limit than without it.

Visitor pressure is handled by a second, narrower study: **Arzumanyan et al.**, *Journal of
Ecotourism* 22(4) (doi:10.1080/14724049.2022.2100894), which used **terrestrial molluscs** — land
snails, sedentary and quick to respond to trampling — as bioindicators, comparing heavily visited
plots against controls inside this park. Significantly lower diversity, richness and abundance where
visitor intensity was high; the gap widest in autumn; **all five rare species among the thirty-one
detected occurred only in the low-traffic plots.** It is cited for exactly what it measured and
explicitly not as a general warning about tourism — a narrow, dated finding about one animal group in
one park is worth more than a generalisation, and is presented as such.

### Sources

**Nine**, under `dilijan-national-park`, and the shape of the bibliography is itself an argument: two
peer-reviewed papers with DOIs carrying the load, an administration source for the chronology and
area, a ministry register for the sanctuary distinction, a mapped outline for the geography, a funder
page for the deer programme, and the two general-reference surfaces cited **as carriers of the
figures the article examines, not as authorities for them.**

1. NABU Armenia — `Dilijan National Park — "Dilijan" National Park SNCO`. The administration's own
   description, republished by the conservation organisation that works with it, cited that way
   because the ministry's own national-parks page has moved and no longer resolves.
2. Ministry of Environment — *State sanctuaries of the Republic of Armenia*. The Akhnabad and juniper
   sanctuary facts.
3. Morin et al. 2021, *Remote Sensing* — doi:10.3390/rs13152942.
4. Arzumanyan et al., *Journal of Ecotourism* — doi:10.1080/14724049.2022.2100894.
5. Ibrahimi et al. 2026, *Ecologica Montenegrina* — doi:10.37828/em.2026.94.2. The caddisfly.
6. Caucasus Nature Fund — the red deer reintroduction.
7. OpenStreetMap relation 7594000 — cited as a community-maintained representation and **explicitly
   not as the legal boundary.**
8. Wikipedia — *Dilijan National Park*.
9. Wikidata — Q1984244.

**A source title had to be disambiguated, and the reason turned out to be mechanical as well as
editorial.** The NABU entry and the Wikipedia entry were both plainly titled "Dilijan National Park".
`ArticleLayout` keys the rendered bibliography by `source.title`, so the two collided as React keys
the first time this article rendered. The NABU entry was retitled to name the SNCO — which is how the
Lake Sevan bibliography already disambiguates its administrator, so it is a precedent rather than an
invention. Two identically titled citations one above the other are worth avoiding on their own
account; the duplicate key is the second reason. **The key's fragility is recorded as debt below
rather than fixed in a content step**, and a new test now fails on any article whose bibliography
lists two sources under one title, so the next collision is caught before it renders.

### The coordinate

`{ lat: 40.7417, lon: 44.9312, precision: "area" }` — the second `area` entry after Lake Sevan, and
**the first point in the registry that had to be computed rather than looked up.** No gazetteer holds
a point for this park that is both defensible and near the middle of it.

The method, recorded in `geo.ts` at length: OSM relation 7594000 (`Դիլիջան ազգային պարկ`,
`boundary=protected_area`, `protect_class=2`, `wikidata=Q1984244`), four outer rings stitched, the
**area-weighted polygon centroid** computed on an equirectangular projection about the polygon's own
mean latitude, giving 40.741695, 44.931181. The rounded value was then **ray-cast back against the
polygon and falls inside it** — checked rather than assumed, as it was for Garni and Geghard.

Two independent cross-checks, both consistent: the outline's bounding-box centre (40.73670, 44.94545)
is 1.3 km away and also inside; Wikidata's P625 (40.65639, 45.02139) is inside too but about 12 km
south-east, out in the Getik ground. The Wikidata point corroborates the region and is a fair
illustration of why this entry is `area` and why the gazetteer point was not adopted.

**One coincidence is written down before anyone can mistake it for a copy.** OSM's own label point for
the *town* of Dilijan is 40.7417126, 44.8722210 — which rounds to **the same latitude 40.7417** as the
computed centroid. The longitudes differ by 0.059°, about **5.0 km**, and the town is **outside** the
park polygon. Anyone auditing `geo.ts` will notice the matching latitude before anything else, so the
comment states plainly that the two points were derived independently and are five kilometres apart.
Also named as deliberately rejected: the administration's office in the town, Haghartsin (7.5 km
north-west), Goshavank (5.7 km south-east and outside the boundary), Parz Lake (2.6 km north-east),
the Akhnabad grove, and any trailhead, hotel or road junction on the approach.

### The map integrated itself

**Nothing in `visit-map.ts` or `VisitMap.tsx` was touched.** The map is derived from
`places ∩ PLACE_COORDINATES`, so the ninth place appeared on it by existing — which is the property
§47 predicted in a comment ("a ninth will too") and this step confirms. Marker count 8 → 9, the
`nature` filter pill now yields two markers instead of one, and Dilijan is now the archive's
**northernmost** point as Tatev is its southernmost.

### Bounds and overlap — measured, and unchanged

The bounds test was widened to loop **360 / 390 / 768 / 1440** rather than assert at one width, and a
new test measures **every one of the 36 marker pairs** and asserts the overlapping set is a subset of
the two known pairs. It is a subset assertion rather than a pixel threshold on purpose: whether the
known pairs still overlap and by how much is a measurement to report, not a number to pin, since a
font or icon change would break a threshold while meaning nothing.

Measured at 1440 × 900, `/en/visit`:

```
erebuni-fortress / matenadaran     25 x 26 px
garni-temple / geghard-monastery   12 x 31 px
```

**Identical to §47, to the pixel.** Neither pair got better and neither got worse, and **no third
pair overlaps** — extending the extent north introduced no new collision. §47 recorded the same
`25 x 26` and `12 x 31`, so the horizontal figures quoted in that section's debt list (25 px and
12 px) are unchanged.

That the numbers did not move at all means the fit did not zoom out when the northern edge rose: at
1440 the extent is evidently constrained by the east–west span (Etchmiadzin to Tatev, about 1.96° of
longitude) rather than by latitude, so Dilijan's 0.35° of new northern reach fitted inside the
vertical room already there. **That explanation is an inference from the identical measurements, not
something this step instrumented** — the measurement is the finding; the cause is offered as the
likely reading and was not verified, because doing so would mean touching map internals this step is
forbidden to touch.

**The overlap was not fixed.** It remains open debt, out of scope for a content step for the same
reason as in §47, and the exhaustive marker-selection test still drives the keyboard rather than the
mouse.

### Artwork — pending, for the eighth time

`PENDING_ARTWORK` filled again with `"dilijan-national-park"`, the eighth time the list has filled and
the second time a place has been written ahead of its picture without any near-miss candidate at all.
No image file was added; none exists in `public/` for this slug; the generated placeholder renders,
and `validate:content` names the slug in its note.

All thirty-six existing files were **opened rather than read off their filenames**. Nothing in the
repository shows closed broadleaf mountain forest, because nothing else in the archive is set in it.
Four substitutions were available and each is recorded as refused, because each would have been easy
to justify:

- **`places/lake-sevan.webp`** — the other `nature` article, same filter pill. It is open water under
  treeless highland ridges, which is the exact landscape this article spends a section distinguishing
  itself from. Lending it would illustrate the contrast with a picture of the wrong side of it. This
  is the §37 Lake Sevan *mood* substitution running in reverse, and it is the sharpest refusal here.
- **`places/geghard-monastery.webp`** — the only file in the registry with real trees in frame, which
  is what makes it dangerous. Scrub and scattered stands on a Kotayk gorge wall, not closed forest,
  and the subject is a rock-cut monastery in another province. A wooded slope is not a forest.
- **`places/tatev-monastery.webp`** — a plateau above a Syunik gorge.
- **`khor-virap.png`** — still byte-identical to `hero-ararat.png`; a mountain over an irrigated
  plain. Both are the Armenia of the photographs, which is the thing this article is about not being.

All four are named in a `places.spec.ts` test, on the same principle as the Lake Sevan three, the
Garni three and the Geghard five. **The commission brief is recorded now so it is not reconstructed
later:** closed broadleaf forest — beech, hornbeam and oak, *not* conifers — running up both sides of
a valley to a ridge, in leaf, with no monastery, no lake as the subject, no snow peak on the horizon
and no classical or medieval building in frame.

### Localization and parity

All three editions written: `en`, `hy`, `hyw`. The parity harness
(`npx tsx scratchpad/check.ts dilijan-national-park`) reports **0 differing rows across 3 editions**
— field counts, section ids, paragraph counts, link targets, `relatedSlugs`, and the numeral multiset
per validator field group all identical. The numerals check is the load-bearing one for an article
this dense in figures: 1958, 2002, 33 765, 8 167, 902, 240, 253, 384, 363, 22, 104, 45, P-341, 165 and
the rest appear in the same multiset in all three.

**Western Armenian is flagged for native review**, as every `hyw` article since §16 has been. The
terminology this one adds to that queue is the protected-area and forestry vocabulary — reserve
versus national park versus sanctuary, and the tree names — which has no precedent in the archive
because no previous article needed it.

### Tests changed

`tests/e2e/places.spec.ts` (+470 lines), `tests/e2e/visit-map.spec.ts` (+186),
`tests/e2e/visit.spec.ts` (+51).

- `PLACES` 8 → 9 with a `DILIJAN` const; every count assertion 8 → 9; `byType` `nature` 1 → 2.
- **`nature` moved out of the single-article loop** into its own Lake Sevan + Dilijan pair test — the
  filter is no longer a special case and can no longer pass by accident.
- English-title fallback list gained Tatev and Dilijan.
- New search test, English and both Armenian editions by «Դիլիջան».
- New Dilijan placeholder-artwork test, and a **borrows-nothing** test asserting the four refused
  substitutes appear in no meta tag, JSON-LD block, hero or sitemap image for this slug.
- Coordinate assertions: the park centroid against the town, Parz Lake, Haghartsin, Goshavank and the
  Wikidata point; plus a northernmost/southernmost check (Dilijan north, Tatev south).
- **New: "no place is recorded as a settlement"** — the `settlement` precision value is declared in
  the union and used by nothing, and this pins that.
- **New: "no article's bibliography lists two sources under one title"** — imports `getSourceRegistry`
  from `@/data/sources` and runs over the whole registry, not just this article. This is the guard
  against the React key collision described above.
- Pending-artwork test renamed to "exactly one place is waiting for artwork".
- `visit-map.spec.ts`: `PLACES` gains the slug; **`AREA_PLACE` became `AREA_PLACES`** (Sevan +
  Dilijan) with a set assertion; the bounds test loops four widths; the new all-pairs overlap test.
- `visit.spec.ts`: `NOT_CURATED` (etchmiadzin, tatev, dilijan) asserted absent from the curated row;
  the curated row pinned at 6; `/en/places` count 8 → 9. **Visit curation was not touched** — the
  ninth place does not appear in the curated row, and the test now proves that rather than assuming
  it.

### Commands run, and results

| # | Command | Result |
| --- | --- | --- |
| 1 | `npm run typecheck` | **PASS** — no `tsc` output |
| 2 | `npm run validate:content` | **PASS** — 126 entries, placeholder note names `dilijan-national-park` |
| 3 | `npx tsx scratchpad/check.ts dilijan-national-park` | **PASS** — 0 differing rows across hy, hyw, en |
| 4 | port 3002 / dev server | clear — no listener on 3000–3010, checked **before** `.next` was removed |
| 5 | remove `.next` | removed |
| 6 | `visit-map.spec.ts` (desktop) | **PASS** — 28 |
| 7 | `visit.spec.ts` (desktop) | **PASS** — 23 |
| 8 | `places.spec.ts` (desktop) | **PASS** — 55 |
| 9 | `npx playwright test` | **PASS** — 254 passed, 5 skipped |
| 10 | `npm run build` | **PASS** — 135 routes, no warnings |

**Zero failures.** Nothing was retried, and no assertion was loosened to make anything pass.

Four notes on the output, none of them faults:

1. **The 5 skips are pre-existing and expected** — the untranslated-article tests in `locale.spec.ts`,
   `seo.spec.ts` and `mobile.spec.ts`. Every article exists in all three editions, so there is no
   untranslated page for them to exercise. Unchanged from previous steps.
2. **The build emitted no React duplicate-key warning**, which is the confirmation that the source
   retitling actually fixed the collision rather than merely moving it.
3. **All three Dilijan routes prerendered** — `/en/`, `/hy/` and `/hyw/places/dilijan-national-park`
   are in `prerender-manifest.json`. Checked there rather than in the build's route list, which
   truncates with `[+N more paths]`.
4. **The `[newsletter] insert failed` console noise in the suite log is a passing test**, not an
   error: it comes from "missing Supabase configuration is reported, not faked", which asserts exactly
   that failure is surfaced rather than faked.

**Playwright and the production build were never run concurrently**, and no two full-suite runs
overlapped — the §48 process failure did not recur. `.next` was removed only after the port was
confirmed clear, which is the other §48 failure and it did not recur either.

### Existing Visit and map behaviour — regression check

- **No map architecture change.** Leaflet, the Stadia configuration, tile environment variables,
  attribution, the network and privacy tests, lazy loading, marker glyphs, map-local filters, marker
  selection and the accessible fallback are all untouched. `visit-map.ts` and `VisitMap.tsx` were not
  edited — the ninth marker is derived, and the diffstat proves it.
- **No routing, geolocation, geocoding or API addition.**
- **Visit curation unchanged** — the curated places row is still the same 6, still pinned by a test,
  and the ninth place is asserted absent from it.
- **No existing artwork file was modified, renamed, moved, re-encoded or re-registered.** All eight
  prior covers keep their paths; `ARTWORK_PROVENANCE`, `IMAGE_SIZES` and `PORTRAIT_FOCUS` are
  unchanged, as are `getImageSrc`, `getArticleImageSrc` and `isGeneratedArtwork`.
- **No existing article's content changed.** The only edit outside the appended Dilijan blocks is the
  NABU source title, which is a new entry, and the `getSourceRegistry` export, which is additive.
- **No new structured-data type**; the place emits the same generic `Article` schema and no tourism
  types, still asserted.
- `.claude/settings.json` unchanged.

Files changed: `src/data/locales/{en,hy,hyw}/articles/places.ts`, `src/data/sources.ts`,
`src/data/geo.ts`, `src/lib/media.ts`, `tests/e2e/places.spec.ts`, `tests/e2e/visit-map.spec.ts`,
`tests/e2e/visit.spec.ts`, `scratchpad/dilcheck.ts`, and this document. No image file added.

### Still open

Carried forward, plus one new entry. Nothing on this list was fixed here.

- **NEW — `ArticleLayout` keys the bibliography by `source.title`.** Two same-titled works cited by
  one article collide as React keys. **Worked around in content, not fixed**: the NABU source was
  retitled to disambiguate, and a new test now fails on any article whose bibliography lists two
  sources under one title. The rendering code is unchanged and the next article to cite two works of
  the same name will hit the same wall — the proper fix is keying by index or by identifier, which is
  a component change and not a content step's business.
- **Map marker overlap** — Erebuni/Matenadaran at 25 x 26 px and Garni/Geghard at 12 x 31 px at the
  initial extent, **re-measured this step and unchanged**. Still the reason the exhaustive marker test
  drives the keyboard.
- **Khalpakhchian 1962 not read directly** — still cited at one remove through Karakhanian and
  Abgaryan 2004.
- **The photographic register** — two of the eight existing Places covers read as photographs rather
  than illustrations.
- **The Matenadaran facade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions** — still the only WebP that is not 1586 x 992.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts`. Did not reproduce here.
- **One-directional `relatedSlugs`** — Dilijan points at Lake Sevan and Lake Sevan does not point
  back, with the documented Tatev-to-Geghard exception still the only one.
- **Western Armenian native review** — nineteen terminology items, plus this article's protected-area
  and forestry vocabulary.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` living outside `scripts/`** — and now `scratchpad/dilcheck.ts` beside it.
- **The weak homepage hero-path assertion.**
- **`settlement`** — declared in the `precision` union and used by no entry. Now pinned by a test that
  asserts no place uses it, which documents the gap rather than closing it.
- **No central environment module.**
- **Production Stadia dashboard and domain authorisation** — operational, outside this repository.
- **Raster label-language limitation** — Stadia raster tiles bake in bilingual labels.
- **Privacy-page provider disclosure** — undecided.

### Deliberately not built

No image was generated, sourced, edited or substituted. No new place type, no new filter, no new
content field, no new component, no custom routing, no new structured-data type. No map architecture,
provider configuration, tile change, geolocation, routing or curation change. Haghartsin and Goshavank
were not given articles and were not added to `relatedSlugs` as future slugs. The marker overlap was
left alone. The `ArticleLayout` bibliography key was left alone.

No deployment was performed.

## 50. Dilijan artwork — the pending entry, cleared for the eighth time (August 2026)

`public/images/places/dilijan-national-park.webp` landed. One line entered `IMAGES`, one line left
`PENDING_ARTWORK`, and the list is empty for the eighth time. Every consumer already asks
`getImageSrc`, so that pair of lines lit up the hero in three editions, the listing card, the featured
surfaces, the search thumbnail, the Open Graph and Twitter tags, the JSON-LD `Article.image` and three
sitemap `image:loc` entries at once. No component changed.

### The file, opened rather than assumed

| Property | Value |
| --- | --- |
| Path | `public/images/places/dilijan-national-park.webp` |
| Dimensions | **1586 × 992** (16:10) |
| Bytes | **255,030** (249 KB) |
| SHA-256 | `9dc7a49c1855e5a97e67e4414a63c340331640ef1620851fd2a1d156704d3120` |
| MD5 | `df3b1f49e4d616a6be96facbb2f6d672` |
| Container | `RIFF`/`WEBP`, **one `VP8 ` chunk** at offset 12, size 255,010 |
| Keyframe sync | `9D 01 2A` — a valid lossy VP8 keyframe |
| RIFF size field | 255,022 = file length − 8, consistent |
| Colour | sRGB, 3 channels, 8-bit |
| Alpha / ICC / EXIF / XMP / IPTC | **none of them** — there is no `VP8X`, so none can be present |
| Orientation | none |

**Format was determined from the bytes, not the extension.** The RIFF chunk table was walked by hand
and then checked a second time against `sharp`'s metadata; the two agree on every field. The parser
was also run over the five existing WebPs as a control, and it correctly reported Garni's 1448×1086
and Erebuni's `VP8X`+`ICCP` chunks — which is how the "no ICC here" claim above is known to be a
finding rather than a parser that cannot see ICC profiles.

This is the **plainest container in the registry**: a bare `RIFF/VP8` with no extension chunk at all,
like Etchmiadzin, Lake Sevan, Garni, Geghard and Tatev. At 249 KB it is the fourth lightest of the
nine, between Etchmiadzin (242 KB) and Tatev (265 KB). It is 1586×992 again, so the "not 1586×992"
note in `media.ts` still refers to Khor Virap's PNG and Garni alone. **The file was registered exactly
as delivered — not generated, edited, cropped, resized, recoloured, renamed, optimised or replaced**,
which has been the rule since §30.

### What is actually in the frame

A broadleaf valley seen from a rocky overlook. Both walls are closed canopy to the ridgeline, a stream
runs the valley floor, limestone outcrops break through the trees on the right bank, and forested
ridges recede into humid haze under overcast sky.

Checked against the §49 commission point by point:

- **Broadleaf dominates.** The foreground branch is unmistakably broadleaf — lobed and serrated leaves
  — and the canopy across both slopes is rounded and closed. This was the one thing the file had to get
  right, because the article's own distinguishing fact is that barely one per cent of the park's forest
  is coniferous.
- **No conifer anywhere.** No spruce, fir or pine silhouette in the frame. A pine-and-fir picture would
  have stated the opposite of the article beneath it.
- **Beech/oak/hornbeam is visually plausible** — mixed mesophilous broadleaf canopy of exactly the kind
  the forest section describes, with no species contradicted by the frame.
- **Forest rises over slopes and ridges**, and the **mountain-valley structure is legible**: two walls,
  a floor, a watercourse, and receding ridges giving real depth.
- **Greener and more humid than central or southern Armenia.** Overcast, hazy, saturated — which is the
  whole argument of the article's last section.
- **Forest is the focal subject.** There is no building of any kind in the frame.

And the things it must *not* read as, each checked rather than assumed: **not Lake Sevan** (no open
water, no treeless ridges); **not Dilijan town** (no settlement, no roofs, no road); **not alpine**
(rounded mid-mountain relief, no bare rock summits, no conifer belt, no snow); **not Scandinavian
conifer forest** (no needle-leaf at all); **not Tatev or Syunik** (no plateau, no basalt shelf, no
gorge rim); **not Geghard, Khor Virap or any monastery cover** (no monument, no cliff-cut chamber, no
mountain-over-plain). No unsupported scene dominates either: no wildlife, no red deer, no logging, no
protest, no Parz Lake recreation, no hotel or resort, no zipline, no hiking group, no monastery.

**Two concerns are reported rather than corrected**, and neither changed the file:

1. **It is photographic in register**, like Geghard (§42) and Tatev (§48), where most of this map is
   rendered illustration. It inherits `ARTWORK_PROVENANCE` and is captioned AI-generated, which is the
   more cautious of the two claims. This is the third entry for which that caption is worth
   re-confirming against the source rather than assuming, and it joins the existing debt item.
2. **Nothing in the frame identifies Armenia specifically.** There is no landmark — and there cannot
   be one, because the subject is a forest rather than a monument. The same frame could be the
   Carpathians or the Balkans. This is a limit of the genre, not a fault in the file: the caption and
   the article carry the geography, and the alternative would have been putting a building in the
   frame of an article about there not being one. Recorded so it is not rediscovered as a surprise.

### Crops — the real ones, measured

Geometry computed for `object-cover` with the default `object-center`, against the actual project
slots, and each crop rendered and looked at rather than reasoned about:

| Slot | Ratio | Result | Trim |
| --- | --- | --- | --- |
| Compact card, mobile hero | 4:3 | 1323 × 992 | 263 px left/right (132 each, 16.6%) |
| Tablet hero (`sm:`) | 3:2 | 1488 × 992 | 98 px left/right (49 each, 6.2%) |
| Listing card, desktop hero, map card | 16:9 | 1586 × 892 | 100 px top/bottom (50 each, 10.1%) |
| Category / featured | 16:10 | 1586 × 991 | 1 px — effectively the whole image |
| Search thumbnail (square bound) | 1:1 | 992 × 992 | 594 px left/right (297 each, 37.5%) |

**Every crop holds.** Broadleaf canopy still dominates in all of them; the valley and ridges stay
legible in all of them; and none turns the image into generic trees without geographic depth. The
16:10 source ratio is why: it is close enough to 16:9 that the widest slot trims only sky and
foreground, and tall enough that the 4:3 slot keeps the full vertical composition and loses only side
margin. The 16:9 crop is arguably the best of the set, tightening onto the valley.

The **search thumbnail is the tightest crop in the project** — a fixed 128 px column (160 px at `lg:`)
running the full height of the result card, so it takes a near-square slice from the centre of a 16:10
landscape. That is the one that had to be checked rather than assumed, and it survives: at 1:1 the
frame still carries the foreground branch, both forested walls, the stream and the receding ridges. It
reads as forested mountain landscape at thumbnail size.

**No custom `object-position` was added and none is needed.** The default centre crop is correct for
this file, which is the outcome to prefer — a Dilijan-specific crop rule would have been the kind of
special case §30 onward has avoided. `PORTRAIT_FOCUS` stays what it is: the writers' rule, untouched.

### Registration and provenance

One line in `IMAGES`, one line out of `PENDING_ARTWORK`. **The only two non-comment changes in
`media.ts`** — verified against the diff rather than asserted:

```
+  "dilijan-national-park": "/images/places/dilijan-national-park.webp",
-  "dilijan-national-park",
```

Everything else in that file's diff is prose. `ARTWORK_PROVENANCE`, `IMAGE_SIZES`, `PORTRAIT_FOCUS`,
`getImageSrc`, `getArticleImageSrc` and `isGeneratedArtwork` are **unchanged**. No Dilijan-specific
image logic, no new image field, no new provenance infrastructure, no special card component, no
custom image routing.

Probed directly rather than inferred from the rendered page:

```
getImageSrc("dilijan-national-park")     -> /images/places/dilijan-national-park.webp
getArticleImageSrc(article)              -> /images/places/dilijan-national-park.webp
isGeneratedArtwork(article)              -> true
PENDING_ARTWORK                          -> []
ARTWORK_PROVENANCE                       -> { source: "ai-generated", documentary: false }
registry total 32, places 9, registered-and-pending: none
isGeneratedArtwork(with credited image)  -> false
```

That last line matters: a real credited photograph would still override both the registry file and the
AI caption. Registration did not close that door.

The disclosure was verified in **all three editions** on the rendered page: the AI-generated
illustration caption appears, the placeholder caption is gone, the inline placeholder `<svg>` is gone,
and the registered file renders.

### Pending-artwork state

`PENDING_ARTWORK` is **empty**, for the eighth time — emptied after each of the eight times it has
filled: §31→§32, §33→§34, §35→§36, §37→§38, §39→§40, §41→§42, §47→§48, §49→§50.

`validate:content` **no longer prints the Dilijan missing-artwork note**, and still reports 126
entries. The Places listing renders **zero** placeholders. Dilijan borrows nothing: not Lake Sevan,
not Geghard, not Tatev, not Khor Virap.

**The §49 rejected-substitute reasoning was kept, not deleted.** All four refusals stay in `media.ts`
as history, on the same principle as the Lake Sevan three, the Garni three and the Geghard five: the
failure they guard against is the cover being repointed at a plausible neighbour later, and that
outlives the file landing. Lake Sevan is a *likelier* accident now than it was while this slug had no
file at all.

### Tests

`ILLUSTRATED` gained the slug and `ARTWORK` gained the path. **`PLACES`, `ILLUSTRATED` and `ARTWORK`
remain three separate declarations** even though `PLACES` and `ILLUSTRATED` now both hold all nine.
That is deliberate and §49 is the proof rather than the argument: §48 recorded the case for keeping
them apart while they matched, and the very next place split them again one step later. Every previous
coincidence (§32, §34, §36, §38, §40, §42, §48) was ended by the place after it. They also answer
different questions — `PLACES` decides what must exist, `ILLUSTRATED` decides what may render an
`<svg>` — and the `satisfies Record<(typeof ILLUSTRATED)[number], string>` clause on `ARTWORK` is what
makes a mismatch between the two a **compile** error rather than a runtime one.

Inverted, not deleted:

- `Dilijan renders the generated placeholder and says so` → **`Dilijan renders its own file and is
  captioned as an illustration`**, all three editions: own `<img>`, no `<svg>`, AI caption present,
  placeholder caption absent, `getImageSrc` resolves, slug not pending.
- `Dilijan borrows no other article's artwork, and advertises none of its own` → **`…and advertises
  its own`**. The borrowing refusals are kept in full; the metadata half inverts — `Article.image` now
  names Dilijan's file, `og:image` and `twitter:image` stop falling back to `og-default`, and the
  three sitemap blocks carry `image:loc` instead of none.
- `exactly one place is waiting for artwork` → **`no place is waiting for artwork, and every one
  resolves to its own file`**. It needed no new literal: the expected array is derived from
  `PLACES` minus `ILLUSTRATED`, so it emptied on its own.
- The listing placeholder count is derived the same way and fell to zero without an edit. That
  assertion has now inverted ten times (§37 one, §38 zero, §39 one, §40 zero, §41 one, §42 zero, §47
  one, §48 zero, §49 one, §50 zero), which is the whole argument for pinning an exact count.

Added: **`Dilijan's search card carries its own thumbnail and no placeholder`** — scoped by the
canonical `/en/places/dilijan-national-park` href rather than by result position, because "Dilijan" has
rivals in this archive (the park article names the town throughout, and Lake Sevan's article names the
ridge between them). It also asserts the four refused files are absent from that card. Tatev and
Dilijan were added to the per-place search-thumbnail loop, which had stopped at Geghard.

**Per-card image ownership is preserved for all nine**, unchanged in form: the listing test still
matches each place's own href to its own exact file, one card at a time. It was not replaced by an
image-count assertion — **two swapped covers must still fail**, which a count would not catch.

`visit-map.spec.ts` changed by one comment. The selected-card assertion is derived from `getImageSrc`
and needed no edit: it now takes the `registered` branch for all nine and asserts Dilijan's own file.
The `else` branch — an unillustrated place must show *no* image — was **kept**, because it has been
needed twice already (§47, §49) and deleting it would only have to be undone by the tenth place.

### Commands run, and results

| # | Command | Result |
| --- | --- | --- |
| 1 | port 3002 / dev server | clear — no listener on 3000–3010, checked **before** `.next` was removed |
| 2 | remove `.next` | removed |
| 3 | `npm run typecheck` | **PASS** |
| 4 | `npm run validate:content` | **PASS** — 126 entries, **placeholder note gone** |
| 5 | `places.spec.ts` (desktop) | **PASS** — 56 |
| 6 | `visit-map.spec.ts` (desktop) | **PASS** — 28 |
| 7 | `visit.spec.ts` (desktop) | **PASS** — 23 |
| 8 | `npx playwright test` (run 1) | **1 FAILED** — 254 passed, 1 failed, 5 skipped |
| 9 | `listing.spec.ts` (desktop, isolated) | **PASS** — 17 |
| 10 | `npx playwright test` (run 2) | **1 FAILED** — 254 passed, 1 failed, 5 skipped |
| 11 | `brand.spec.ts` (desktop, isolated) | **PASS** — 8 |
| 12 | `npm run build` | **PASS** — 135 routes, no warnings |
| 13 | `npx playwright test` (run 3, fresh server) | **PASS** — 255 passed, 5 skipped |

**Two full-suite runs failed, and both failures are recorded here rather than smoothed over.**

1. **Run 1** — `listing.spec.ts › the writers listing filters within its own edition`. Expected 6
   writer cards, received 0. The saved page snapshot shows the **Next.js dev overlay**, not the
   listing: `Runtime SyntaxError: Unexpected end of JSON input` at `JSON.parse`, 15 frames of which 14
   are ignore-listed framework frames.
2. **Run 2** — `brand.spec.ts › [hy] no page … still shows the former brand`. `/hy/about` returned
   **500** where 200 was expected.

Neither is in Places, artwork, media or the map. Both were re-run in isolation and **both passed**
(17/17 and 8/8). Run 3, against a freshly started dev server, passed the **entire suite**.

The reading, stated as a diagnosis rather than a dismissal: these are **dev-server transients** —
`playwright.config.ts` runs `npm run dev` (Turbopack) with `fullyParallel: true`, eleven workers and
`retries: 0`, and both failures landed on cold routes immediately after `.next` had been deleted or
overwritten by a production build. A truncated `JSON.parse` inside Next's own runtime and a 500 on an
unrelated static route are the shape of a compile race, not of a registry change. The production build
compiles and prerenders all 135 routes cleanly, and every spec passes alone.

**Honest caveat.** This step added one test and three page loads to each of two `LOCALES × ILLUSTRATED`
loops (24 → 27 navigations), so it did put marginally more load on that dev server. That could make an
existing race fire more often. It is not a product defect and nothing in the shipped application
changed to cause it, but the timing is worth writing down rather than leaving for someone else to
notice. It joins the existing flake debt.

Playwright and the production build were never run concurrently, and no two full-suite runs overlapped.
`.next` was removed only after port 3002 was confirmed clear — the §48 failure mode did not recur.

### Map integration — verified, not modified

`src/lib/visit-map.ts`, `src/components/visit/VisitMap.tsx` and `src/lib/map-tiles.ts` are
**unchanged**, confirmed against the diff.

- The map still carries **exactly 9 Places**, derived from `places ∩ PLACE_COORDINATES`.
- **No map-specific slug list exists** — nothing was added to admit or illustrate the ninth marker.
- The selected Dilijan card now shows `/images/places/dilijan-national-park.webp` and links to the
  localized article.
- Lake Sevan keeps its own image; all other eight markers keep theirs; no panel shows a neighbour's.
- Dilijan is still `precision: "area"`, and the two area centroids are still asserted as a pair.
- Bounds behaviour unchanged at all four widths.

**Marker overlap re-measured only because the existing §49 test already measures it**, and not fixed:

```
erebuni-fortress / matenadaran     25 x 26 px
garni-temple / geghard-monastery   12 x 31 px
```

Identical to §47 and §49, to the pixel. No third pair overlaps. Registering artwork does not move
markers, and this confirms it rather than assuming it.

### Visit curation — unchanged

**Dilijan was not added to the six curated Visit cards**, and having artwork is not a reason to add it.
The curated row is still the same 6, still pinned by a test, with Etchmiadzin, Tatev and Dilijan
asserted absent from it. `curated Visit row ≠ complete map coverage` is preserved deliberately:
Dilijan is on the map and in `/places`, and curation stays an editorial choice rather than a
consequence of a file landing.

### Metadata transition

| Surface | Before (§49) | After (§50) |
| --- | --- | --- |
| Hero | placeholder `<svg>` | Dilijan WebP |
| `Article.image` | absent | Dilijan WebP |
| `og:image` | `og-default` fallback | Dilijan WebP |
| `twitter:image` | `og-default` fallback | Dilijan WebP |
| Sitemap `image:loc` | none on all three routes | Dilijan WebP on all three |

**The JSON-LD graph shape did not change.** Still the generic `Article` node; registration added an
`image` property to it and nothing else. A test now asserts that no `Place`, `TouristAttraction`,
`NationalPark` or `GeoCoordinates` node appeared — a park is the most tempting article in this archive
to over-describe with tourism types, so the absence is pinned rather than trusted.

### Article content — untouched

No Dilijan content was modified. The three `articles/places.ts` files, `sources.ts` and `geo.ts` are
**unchanged**, confirmed against the diff: the protected-area chronology, the 1958/2002 distinction,
the area discussion, the Akhnabad sanctuary distinction, forest composition, the biodiversity caution,
the red deer, *Wormaldia dilijanica*, the cultural-landscape wording, the Goshavank boundary nuance,
the conservation studies, the sources, the coordinate, `relatedSlugs`, the SectionLink, the SEO fields,
the taxonomy, the translations and the numerical parity all stand exactly as §49 left them.

Files changed: `src/lib/media.ts`, `tests/e2e/places.spec.ts`, `tests/e2e/visit-map.spec.ts`, and this
document. Added: `public/images/places/dilijan-national-park.webp`.

### Still open

Carried forward unchanged. Nothing on this list was fixed here.

- **`ArticleLayout` keys the bibliography by `source.title`** — unchanged from §49. Two same-titled
  works cited by one article collide as React keys; worked around in content, guarded by a test, not
  fixed in the component.
- **Map marker overlap** — Erebuni/Matenadaran at 25 x 26 px and Garni/Geghard at 12 x 31 px,
  re-measured this step and unchanged. Still the reason the exhaustive marker test drives the keyboard.
- **The photographic register** — now three of the nine Places covers (Geghard, Tatev, Dilijan) read
  as photographs rather than illustrations, all captioned AI-generated.
- **Dilijan carries no Armenian landmark — new, and inherent.** The frame could be any temperate
  broadleaf mountain forest. Reported in §50, not corrected; the caption and article carry the
  geography.
- **Dev-server suite flakiness — new.** Two unrelated specs failed once each across three full runs on
  a cold Turbopack dev server under eleven parallel workers, and both passed in isolation. Joins the
  Cuisine hydration flake as harness debt rather than product debt.
- **Khalpakhchian 1962 not read directly.**
- **The Matenadaran facade colour**, unchanged since §36.
- **The Garni stone warmth**, unchanged since §40.
- **The Garni 4:3 artwork dimensions** — still the only WebP that is not 1586 x 992.
- **A dedicated Khor Virap image** — still the only PNG, still 1.4 MB, still byte-identical to
  `hero-ararat.png`.
- **Erebuni and Matenadaran artwork weight** — 742 KB and 701 KB. Dilijan at 249 KB does not move this.
- **Global media optimisation.**
- **The Cuisine hydration flake** — `cuisine.spec.ts`. Did not reproduce here.
- **One-directional `relatedSlugs`**, with the documented Tatev-to-Geghard exception.
- **Western Armenian native review** — nineteen terminology items, plus §49's protected-area and
  forestry vocabulary.
- **The Bresson and Fagan Garni attribution.**
- **Wilkinson's Garni source not read directly.**
- **The Hovannisian ISBN.**
- **`scratchpad/check.ts` and `scratchpad/dilcheck.ts` living outside `scripts/`.**
- **The weak homepage hero-path assertion.**
- **`settlement`** — declared in the `precision` union and used by no entry.
- **No central environment module.**
- **Production Stadia dashboard and domain authorisation** — operational, outside this repository.
- **Raster label-language limitation** — Stadia raster tiles bake in bilingual labels.
- **Privacy-page provider disclosure** — undecided.

### Deliberately not built

The image was not generated, edited, cropped, resized, recoloured, renamed, optimised or replaced. No
`object-position` rule, no Dilijan-specific image logic, no new image field, no per-image provenance,
no new component, no custom routing. No article content, coordinate, source or translation touched. No
map architecture, provider configuration or curation change. No new structured-data type. The marker
overlap was left alone, and so were the bibliography React key, `scratchpad/check.ts`,
`scratchpad/dilcheck.ts`, media optimisation, the provider infrastructure, the Stadia settings,
Leaflet, the map labels and the privacy-page wording. `.claude/settings.json` was not modified.

No deployment was performed.

---

## 51. Gyumri — the tenth place, the first settlement, and a whole city (August 2026)

Gyumri is Place #10 and the first article in this archive whose subject is an **inhabited city**
rather than a building, an enclosure, a museum, an archaeological site, a lake or a protected
landscape. It spends the `settlement` taxonomy, which had been declared twice over and used by
nothing since §30.

### Taxonomy

| Pill | Before | After |
| --- | --- | --- |
| All places | 9 | **10** |
| Monasteries and churches | 4 | 4 |
| Historical sites | 2 | 2 |
| Museums | 1 | 1 |
| Nature | 2 | 2 |
| **Settlement** | **absent** | **1 — Gyumri, and only Gyumri** |

`placeTypeId: "settlement"`, `featured: false`, no `chronoOrder` (Places declares it on none). **Khor
Virap remains the only featured Place**, now asserted in all three editions rather than only in `en`.
No new place type was invented: `city`, `town`, `urban` and `cultural-city` are each named in
`places.spec.ts` as pills that must not appear.

### Files changed

| File | Change |
| --- | --- |
| `src/data/locales/{en,hy,hyw}/articles/places.ts` | The article, three editions, 12 sections each |
| `src/data/locales/{en,hy,hyw}/places.ts` | `settlement` filter pill + rewritten header comment |
| `src/data/geo.ts` | One coordinate, `precision: "settlement"` |
| `src/data/sources.ts` | Nine-source bibliography under `gyumri` |
| `src/lib/media.ts` | `"gyumri"` into `PENDING_ARTWORK`, with the rejection record |
| `src/components/visit/VisitMap.tsx` | One `TYPE_GLYPH` entry — the only component edit |
| `tests/e2e/places.spec.ts` | Counts, filters, search, artwork, coordinate, settlement inversion |
| `tests/e2e/visit-map.spec.ts` | Tenth marker, `settlement` precision, marker test |
| `tests/e2e/visit.spec.ts` | Fifth type link, `NOT_CURATED`, listing count |

### Article structure

12 sections: `where-it-is`, `the-names`, `before-the-city`, `the-russian-century`, `the-stone`,
`the-historic-core`, `blacksmithing`, `buildings`, `the-earthquake`, `reconstruction`, `counting`,
`what-it-is-called`. 6 key facts, 13 dated entries, 6 interesting facts, 0 related figures, 3
contextual prose links, 3 `relatedSlugs`.

### Name chronology, as separate acts

| Name | From | The act |
| --- | --- | --- |
| Kumayri | — | The old name; Gyumri is taken to be the same word worn down by use |
| Alexandropol | **1837** | Renaming on Nicholas I's visit, after Empress Alexandra Feodorovna |
| — | **1840** | **City status** and district centre — a *separate* act, three years later |
| Leninakan | **1924** | Soviet renaming, the year Lenin died |
| Kumayri | **1990** | The Soviet name dropped, before independence |
| Gyumri | **1992** | The present name, after independence |

The 1837/1840 merge is the commonest error in writing about this city and the article separates them
explicitly. **Alexandropol** is the project's prose convention; `Alexandrapol` is carried in
`keywords` only, and named in the article as a transliteration difference rather than another place.

### Early-history evidence

Four claims are kept apart rather than merged: archaeological occupation, a textual reference to a
place of this name, continuous settlement, and the existence of a city. What the article states is
that occupation reaches into prehistory (unremarkable for a watered highland plain), that **Kumayri is
named in Armenian narrative sources from the early medieval period** in connection with the risings
against Arab rule, and that the place was still village-scale in the early nineteenth century. It
says explicitly that claims tying the name to an Urartian royal inscription are **inferences from
campaign accounts naming other places in the district**, not the same kind of evidence. **No "Gyumri
is X thousand years old" claim is made anywhere.**

### Nineteenth-century urban transformation

Four causes, each physical or social rather than celebratory or political: the migration from Kars and
Erzurum after the war of **1828–1829**; the fortress ordered in **1834**; the surveyor's grid that is
still the plan of the old town; and the railway — Tiflis to Alexandropol **1899**, on to Kars the same
year, the Yerevan branch by **1902**. The garrison is treated as an economic fact (a permanent market
for bread, leather, iron, cloth, cartage and building work) rather than as politics. Alexandropol as
the largest city of Russian-ruled Eastern Armenia, larger than Yerevan, is stated as the outcome.

### Architecture and material culture

Tuff is explained as consolidated volcanic ash before "black tuff" is used, and the article states
plainly that **not every historic building is black** — red and reddish tuff are in the local
repertoire and the contrast is deliberate. The coherence is attributed to method rather than colour:
load-bearing cut stone, one or two storeys, street-line frontage, interior courts, hand-cut surrounds
and cornices, and forged iron as part of the architecture rather than applied to it. The phrase
**"freedom within the grid"** comes from Ivanov's ISPRS study.

### The historic core, and the monument counts

The Kumayri reserve was declared in **1980** under the Armenian SSR to stop demolition of the low-rise
old town, covers on the order of a **fifth of the city's area**, and was transferred to **municipal**
ownership in **1998** — which is why it is administered by the community rather than by the national
museum-reserve service, and why it is often missing from national heritage listings.

Circulating counts run from about a thousand to eighteen hundred and are printed with no statement of
what is counted, inside which boundary, on what date. The article refuses all of them and quotes
instead the **State List of immovable historical and cultural monuments of Shirak Marz**, approved by
Government Decision **N 1270-N of 9 September 2004**, whose Gyumri section runs to **roughly a
thousand numbered entries** — the one figure with a boundary and a date attached.

### Blacksmithing and UNESCO

**Inscribed:** *Tradition of blacksmithing in Gyumri*, Representative List of the Intangible Cultural
Heritage of Humanity, **2023**, element **01967**, on Armenia's nomination. The article states in as
many words that **Gyumri is not a World Heritage Site and no part of it is a World Heritage
property**, and a test asserts that no sentence in any edition pairs the city's name with World
Heritage wording without a negation.

Two further UNESCO checks were run rather than assumed: Gyumri **is** a member of the UNESCO Global
Network of Learning Cities (joined **2016**) — a lifelong-learning municipal network, not a heritage
designation — and Gyumri is **not** a UNESCO Creative City. No Armenian city is currently in the
Creative Cities Network.

### Earthquake and reconstruction

**7 December 1988**, epicentre near Spitak, moment magnitude about **6.8**, surface break of the order
of **13 km**. The city's name at the time was **Leninakan**, stated explicitly for readers who know
the disaster under that name. The damage is explained through engineering rather than imagery:
multi-storey precast-concrete blocks failing **at their connections**, and soft sediment under the
city amplifying ground motion in the period range that mattered to buildings of that height — which is
also why the low-rise stone core stood.

**No graphic description of casualties or injuries, no disaster imagery, and no precise Gyumri death
toll.** The article says regional figures are wide-range estimates, that figures attributed to the
city are quoted without saying what they measure, and that this archive assigns none because it found
no authoritative source defining one.

Reconstruction is written honestly as unfinished: several thousand apartments before the USSR ceased
to exist, the *domik* temporary shelters still inhabited decades later, phased clearance continuing
into this century, and the Church of the Holy Saviour reconsecrated in **December 2024** after roughly
thirty years of restoration — used as the marker for when the earthquake stopped being an active
condition of the city. It stops short of contemporary policy criticism.

### Population and current-data policy

| Census | Count |
| --- | --- |
| 2001 | 150 917 |
| 2011 | 121 976 |
| **October 2022** | **112 301** |

Written as **`112 301`, spaced rather than comma-grouped**, because a comma splits the numeral for the
parity harness. A dedicated section explains that Armenia's census reports a **permanent (de jure)**
and a **current (de facto)** population which differed nationally by about a quarter of a million in
2022, and that the annual inter-census estimates are a different series again. A test asserts that
every passage stating the figure states **2022** in the same passage.

**Source date recorded here as required:** the population figures are from Armstat, *The Main Results
of RA Census 2022*, enumerated **13–22 October 2022**.

**Source caveat, recorded rather than hidden.** Armstat's settlement-level tables are distributed as
PDF and 7z-compressed Excel and could not be opened directly in this environment. The publication
itself was reached and confirmed at `armstat.am/en/?nid=82&id=2623`, and 112 301 is consistently
reported from it. This joins the existing "source caveats" debt.

### Coordinate provenance

| Field | Value |
| --- | --- |
| Slug | `gyumri` |
| Stored | **40.7852, 43.8416** |
| Precision | **`settlement`** — the first use of that union member |
| Source entity | OpenStreetMap **node 130037434** (`Գյումրի`, `place=city`, `capital=4`, `wikidata=Q199500`) |
| Raw | 40.7852085, 43.8416095 |
| Meaning | The city's conventional centre — not a building, not a natural centroid |

**Cross-checks, both independent and both corroborating at city scale:** GeoNames **616635** at
40.7930545, 43.8463497 (about 1.0 km NNE); Wikidata **Q199500** at 40°47′N 43°50′E = 40.78333,
43.83333 (about 0.7 km WSW, and only to whole arc-minutes, which is coarser than this registry's
rounding). Three points inside a kilometre of each other in a city roughly seven kilometres across.

**Rejected, and each named in `geo.ts` and in a test:** the Black Fortress; Vartanants Square (the
closest wrong answer at some hundreds of metres, and the one that would never have looked wrong); the
railway station; Shirak airport; the municipality building; the cathedral of Yot Verk; any tourist
information point; and the Kumayri reserve, which is a real legal boundary but is the historic core
rather than the city. No existing coordinate was modified.

### Map integration

**9 → 10 automatically.** `getVisitMapPoints` is `places ∩ PLACE_COORDINATES`; `src/lib/visit-map.ts`
and `src/lib/map-tiles.ts` were **not touched**, and there is no Gyumri allow-list anywhere. Gyumri is
now the **northernmost and westernmost** marker — north of Dilijan and about 0.7° west of
Etchmiadzin, which had been the western edge for ten steps — so the derived bounds now span a box that
is wider as well as taller. Nothing was retuned.

### Settlement marker

The one component edit in this step. `TYPE_GLYPH` had no `settlement` entry, because the taxonomy had
never had a rendered member, so the marker fell back to the bare pin. **One line was added**: two
blocks on a ground line, in the same shared pin as every other type. No skyline, no coat of arms, no
city-specific icon, no new map taxonomy, no colour channel. The accessible name already carried the
localized type through `labelFor`, and a test now pins that for `settlement` in all three editions.

### Bounds and overlap measurements

All ten markers inside the container at **360, 390, 768 and 1440 px**. Overlaps re-measured at 1440 px
with the wider extent:

| Pair | §50 | §51 |
| --- | --- | --- |
| Erebuni Fortress / Matenadaran | 25 × 26 px | **25 × 26 px** |
| Garni Temple / Geghard Monastery | 12 × 31 px | **12 × 31 px** |

**No new overlapping pair.** The two known pairs are unchanged — the westward stretch widened the box
without changing the fitted zoom enough to move them. Carried forward as debt, not fixed: the eventual
answer is clustering, spiderfying or zoom-aware displacement, and none of that belongs in a content
step. No pixel-distance rule was added.

### Related content

`["avetik-isahakyan", "anush", "first-republic-of-armenia"]` — each earned by a named passage, and
each a relationship the corpus already asserted from the other side. Isahakyan's article says he was
born in Alexandropol; the Anush article says the opera premiered there in 1912; the history article
covers the capture of the city in 1920 and the treaty that carries its name. **Deliberately not
added:** Dilijan (both northern), Lake Sevan (both destinations), any monastery (tours combine them).
No non-existent slugs — Amenaprkich, Yot Verk, the Black Fortress and the Kumayri reserve are named in
the prose and are not articles.

### Artwork

**`PENDING_ARTWORK` refills for the ninth time.** Every file under `public/` was opened rather than
read off its filename; none shows a nineteenth-century tuff city on a grid. Five substitutions are
recorded as refused in `media.ts` and named in a test — most sharply
`history/bagratid-armenia.webp`, which *is* a stone city with domed churches and is Ani: a ruined
medieval capital on a plateau above a gorge, in the country west of the present border. Also refused:
`writers/avetik-isahakyan.webp` (a portrait, not a place), `khor-virap.png`, `tatev-monastery.webp`
and `erebuni-fortress.webp`. Refused in advance: the Black Fortress alone, any earthquake imagery, and
a generic Caucasian street. No artwork was generated in this step.

### Localisation and parity

Three genuine editions. House forms confirmed against the existing corpus rather than transliterated
afresh: **Գյումրի** in `hy` and **Կիւմրի** in `hyw` (the form the writers and works articles have used
since they were written, and the Western Armenian Wikipedia form), with Կումայրի, Ալեքսանդրապոլ,
Լենինական and Շիրակ shared. `ՅՈՒՆԵՍԿՕ` and the Representative List wording follow the cuisine
articles.

**Numeral parity: identical multisets in all three editions across every validator field group**, on
the first harness run. Verified with `scratchpad/dilcheck.ts gyumri`.

**The whole `hyw` edition is flagged for native review**, joining the existing backlog. New
terminology this step: դարբնութիւն, երկաթագործութիւն, հրաբխային տուֆ, արգելոց-թանգարան, երկրաշարժ,
վերակառուցում, համքարութիւն, մարդահամար, բնակֆոնտ, տոմիկ.

### Structured data

Unchanged. The generic `Article` model only. **No** `City`, `Place`, `AdministrativeArea`,
`TouristDestination`, `GeoCoordinates` or `LocalBusiness` JSON-LD was introduced — the settlement
coordinate exists for Armat's map, not as an instruction to change schema.

### Tests

`places.spec.ts` — listing 9→10 in the locale loop and every filter reset; `settlement` added to the
single-article filter loop beside `museum`; the vocabulary test moved to six ids with `city`, `town`,
`urban` and `cultural-city` named as forbidden; `under("settlement")` pinned to Gyumri alone; the
distribution table gained `settlement: 1`; a tenth-place search test covering *Gyumri*,
*Alexandropol* and both Armenian names; three new artwork-absence tests (hero placeholder in three
editions, no borrowed picture in the article's own surfaces or JSON-LD, no thumbnail in search); a
sitemap assertion that Gyumri's three URL blocks carry **no** `image:loc`; `PENDING_ARTWORK` re-pinned
as non-empty; the coordinate precision check made three-way; the extremes reworked for the new north
and west; and a content test that the article does not read as a travel guide and dates its census
figure.

**`no place is recorded as a settlement` was inverted, not deleted.** It is now `exactly one place is
a settlement, and it is Gyumri`, asserting one settlement coordinate, one settlement-typed article per
edition, the stored coordinate, and the rejected monument alternatives.

`visit-map.spec.ts` — tenth marker; `SETTLEMENT_PLACES`; three-way precision with both memberships
pinned as sets; a new generic-marker test; the overlap test renamed for the westward stretch.
`visit.spec.ts` — `settlement` in `PLACE_TYPES`, `gyumri` in `NOT_CURATED`, listing count 9→10.

### Visit regression

Curated row **unchanged at six**. Gyumri is on the map, in `/places`, and **not** curated — recorded
as a deliberate exclusion in `NOT_CURATED` rather than an oversight, with the reasoning that a curated
card is a picture card and this place has no picture yet. `/visit` route architecture untouched. A
Visit-curation review is deferred to its own step, after the artwork lands.

### Commands run, in order

```
netstat :3002            -> clear
rm -rf .next             -> after confirming no dev server
tsx scratchpad/dilcheck.ts gyumri  -> three editions, identical numeral multisets
npm run typecheck        -> PASS (0 errors)
npm run validate:content -> PASS (129 entries across 3 locales; 1 pending-artwork note: gyumri)
npx playwright test tests/e2e/places.spec.ts        -> 1 failed, 63 passed  (see below)
npx playwright test tests/e2e/visit-map.spec.ts     -> 29 passed
npx playwright test places.spec.ts visit.spec.ts    -> 1 failed, 84 passed (see below)
npx playwright test tests/e2e/visit.spec.ts         -> 23 passed
npx playwright test                                 -> 262 passed, 5 skipped, 0 failed
npm run build                                       -> PASS (138 pages prerendered)
```

### Every failure, recorded

Two failures occurred and both were real test defects, fixed rather than worked around.

1. **`the settlement article dates its population and keeps UNESCO wording exact`** — a first draft of
   the UNESCO guard used a hardcoded phrase table and flagged the `hy` sentence
   «քաղաքը Համաշխարհային ժառանգության օբյեկտ չէ» — *the city is **not** a World Heritage property* —
   which is the article correctly making the distinction. The phrase-table version was removed and
   replaced with a sentence-level check that requires a negation, so the article's own denial passes
   and a bare claim fails. No product assertion was weakened.
2. **`every canonical route the journey links into still works`** — `visit.spec.ts` pins the `/places`
   listing count as a deliberately hand-edited literal. It was 9 and is now 10.

The known Turbopack `Unexpected end of JSON input` / cold-route 500 signature **did not appear** in
this step. The full suite produced one clean run with no retries and no flakes.

### Technical debt

Carried forward unchanged: bibliography React key by `source.title`; marker overlap (measured above);
dev-server/Turbopack full-suite flake; the photographic register; media optimisation; the Khor Virap
PNG; the Matenadaran facade colour and Garni stone warmth; Garni's 4:3 artwork; one-directional
`relatedSlugs` with the Tatev-to-Geghard exception; the Western Armenian review backlog, now including
this article; source caveats, now including the Armstat settlement table; `scratchpad/check.ts` and
`scratchpad/dilcheck.ts` outside `scripts/`; the weak homepage hero-path assertion; no central
environment module; the production Stadia dashboard and domain authorisation; the raster
label-language limitation; the privacy-page tile-provider disclosure.

**Removed:** ~~`settlement` — declared in the `precision` union and used by no entry.~~ Spent by this
step, in both places it was declared.

### Deliberately not built

No new place type. No `City` or tourism JSON-LD. No Gyumri-specific map logic, allow-list, viewport or
icon. No change to `visit-map.ts`, `map-tiles.ts`, Stadia, tile environment variables, Leaflet, lazy
loading, attribution, network privacy, geolocation, routing or geocoding. No marker clustering or
overlap fix. No Visit curation change. No artwork generated. No existing coordinate modified. No
restaurant, hotel, tour, direction, booking or live-travel content of any kind.
`.claude/settings.json` was not modified.

No deployment was performed.

---

## 52. Gyumri artwork — the pending entry, cleared for the ninth time (August 2026)

`public/images/places/gyumri.webp` landed. One line entered `IMAGES`, one line left
`PENDING_ARTWORK`, and the list is empty for the ninth time. Every consumer already asks
`getImageSrc`, so that pair of lines lit up the hero in three editions, the listing card, the search
thumbnail, the map's selected card, the Open Graph and Twitter tags, the JSON-LD `Article.image` and
three sitemap `image:loc` entries at once. **No component changed.**

This is the **first urban street artwork in the registry** — every previous entry is a monument, a
landscape or a building in isolation — so the verification below is different in kind from the eight
before it, particularly the text audit and the narrow-crop check.

### The file, opened rather than assumed

| Property | Value |
| --- | --- |
| Path | `public/images/places/gyumri.webp` |
| Dimensions | **1584 × 993** — a *third* distinct size in the registry |
| Bytes | **542,872** (530 KB) |
| SHA-256 | `11f593161584a5579094562f3b20faaa59f96bca333853ac7b18ee3bcdfdf72e` |
| MD5 | `7c05da0747f6ccb20ceccf6f812ead4e` |
| Container | `RIFF`/`WEBP` with **three chunks**: `VP8X` (10 B) + `ICCP` (456 B) + `VP8 ` (542,370 B) |
| VP8X flag byte | `0x20` — ICC **set**; alpha, EXIF, XMP and animation all **clear** |
| Encoding | **Lossy**, one VP8 keyframe, sync `9D 01 2A`, frame 1584 × 993 |
| RIFF size field | 542,864 = file length − 8, consistent |
| Colour | sRGB, 3 channels, 8-bit |
| ICC | **present** — 456-byte `mntr`/`RGB `/`XYZ ` monitor profile |
| Alpha / EXIF / XMP / IPTC | **none** — the VP8X flags forbid them |
| Orientation | none |

**Format was determined from the bytes, not the extension.** The RIFF chunk table was walked by hand
and then checked against `sharp`; the two agree on every field. The parser was run over all nine
existing Places assets as a control and correctly reported Erebuni's and the Matenadaran's ICC
profiles and the six plain `RIFF/VP8` files with none — which is how "ICC is present here" is known
to be a finding rather than a parser that always says yes.

**Two structural firsts, both recorded rather than corrected.** The dimensions are **1584 × 993**,
so the "not 1586 × 992" note in `media.ts` no longer refers to Khor Virap's PNG and Garni alone. The
aspect is effectively unchanged (1.595 against 1.599), so no crop moves; the file is two pixels
narrower and one taller than the house size. At **530 KB** it is the **third heaviest** file in the
registry, behind Erebuni (742 KB) and the Matenadaran (701 KB) and well above the 122–277 KB of the
six mid-weight WebPs — a consequence of a dense street scene with fine masonry detail rather than of
the file being unoptimised. It does not change the standing media-optimisation debt.

**The file was registered exactly as delivered — not generated, edited, cropped, resized,
recoloured, renamed, optimised or replaced**, which has been the rule since §30.

### What is actually in the frame

A wet paved square with a street receding to a vanishing point. Down the left runs a long terrace of
**two-storey Alexandropol-era façades**: dark grey-black tuff with **reddish-brown tuff** surrounds,
pilasters, rustication and cornices; hand-carved window and door frames; wrought-iron balconies; all
of it on the street line, exactly as the article describes. On the right stands a church in **black
tuff with red-orange geometric inlay** — crosses, roundels and arcading on a faceted drum under a
conical roof. Between them a white horse and a traditional phaeton with its driver, a row of street
lamps, spruces, pedestrians in winter coats and a few parked cars in the middle distance, under flat
overcast light.

**It reads as a living city, not a monument portrait.** The left half is entirely secular urban
fabric, multiple buildings establish a street rather than one isolated subject, and the perspective
carries genuine urban depth to a vanishing point rather than flattening into a façade study. The
palette is muted and cold — appropriate restrained Shirak atmosphere, with no tourism-poster
saturation.

**Confirmed it does not read primarily as** the Black Fortress, a monastery, a cathedral cover,
Erebuni or Yerevan, a generic Russian imperial city, or a generic European old town. The black-and-red
tuff, the carved surrounds and the low two-storey street line are Gyumri's own register and no other
Armenian city's.

**Confirmed absent:** no disaster scene, no ruined city, no rubble, no earthquake imagery, no Soviet
propaganda, no flags, no invented historical event, no modern high-rise, and no traffic-dominated
composition. Cars are present but parked, small and in the middle distance.

### Two concerns, reported and not corrected

**Photographic register — the strongest instance so far.** Like Geghard (§42), Tatev (§48) and
Dilijan (§50), this file is photographic rather than illustrative, and it is **the most photographic
entry in the registry**: it reads as a documentary street photograph, including a legible, detailed
face on the carriage driver. It inherits `ARTWORK_PROVENANCE` and is captioned AI-generated, which
remains the more cautious of the two claims — and matters more here than anywhere before it, because
an undisclosed cover of this kind would read as a photograph of a real street and a real person.
Joins the existing photographic-register debt.

**The narrow search thumbnail.** Measured below; it survives but is weakened. Recorded, not fixed.

### Text and signage audit

Run in detail because this is the first artwork with a street in it. Every storefront, sign, plaque,
banner, street sign, wall inscription, vehicle plate and poster was inspected at up to 12× on
extracted crops.

**No lettering anywhere.** The ground-floor openings along the left terrace are unsigned; there are no
shopfront names, no banners, no street signs, no wall inscriptions and no posters. The church's
red-tuff ornament is geometric — crosses, roundels, arcading — not epigraphic. The carriage carries no
lettering. **No prominent gibberish pseudo-Armenian, Russian or English text exists in the frame.**

Two tiny unreadable marks survive and are reported rather than edited away:

| Mark | Size in source | At 8–12× |
| --- | --- | --- |
| White A-frame pavement notice by the left terrace | ~20 × 30 px | Colour smears with a red-brown band; **no letterforms** |
| One car number plate, middle distance | ~20 × 8 px | A blue EU-style tab and a grey smear; **no legible characters** |

The car's grille badge is a generic oval crest, not a legible marque. **The image was not retouched.**

### Crop suitability against the live surfaces

Source 1584 × 993 (1.595). Default `object-cover`, centred, no `object-position`.

| Surface | Ratio | Crop | Trimmed | Verdict |
| --- | --- | --- | --- | --- |
| Listing card, desktop hero, map selected card | 16:9 | 1584 × 891 | 10.3 % vertical | **Best of the set.** Loses sky and foreground paving only; terrace, depth, church, carriage and square all intact |
| Compact card, mobile hero | 4:3 | 1324 × 993 | 16.4 % horizontal | **Very good.** Loses the far-left façade edge and the right lamp cluster; street depth and tuff fully preserved |
| Tablet hero | 3:2 | 1490 × 993 | 5.9 % horizontal | Effectively the full frame |
| Search thumbnail (`w-32`/`lg:w-40`, card height) | ~128 × 170 portrait | 748 × 993 | **52.8 % horizontal** | **Weakened but usable** — see below |

**The search thumbnail is the one finding.** It is the tightest live crop by a wide margin and keeps
the centre band: the spruce, the horse and carriage, the wet square and part of the church, while
losing almost all of the left terrace. It does **not** collapse into "one random doorway" — a
horse-drawn carriage on a wet square below a black-and-red tuff church is recognisably Gyumri, and the
carriages on Vartanants Square are a genuine fixture of the city. But at that ratio the picture reads
as *carriage and church* rather than *historic street*, which is the article's actual subject. Two
mitigations are worth recording: the thumbnail is `hidden … sm:block`, so it does not render on small
screens at all, and it displays at 128–160 px where the loss of terrace detail matters less than the
ratio suggests.

**No major building becomes unintentionally dominant in any crop.** The church occupies the right
third at 16:9 and 4:3 and never becomes the subject; only the portrait thumbnail brings it forward,
and even there the carriage holds the foreground.

**No `object-position` was introduced.** The default centre crop is degraded at one surface, not
genuinely unusable, and this registry has no per-image focus mechanism for scenes — `PORTRAIT_FOCUS`
exists for writer portraits and is deliberately not generalised.

### Files changed

| File | Change |
| --- | --- |
| `src/lib/media.ts` | `gyumri` into `IMAGES` with the verification record; `"gyumri"` out of `PENDING_ARTWORK`, refusals preserved |
| `tests/e2e/places.spec.ts` | Gyumri into `ILLUSTRATED` and `ARTWORK`; three absence tests inverted to presence; sitemap block inverted; counts and comments |
| `tests/e2e/visit-map.spec.ts` | Selected-card assertion for Gyumri's own file; `else`-branch comment |
| `PROJECT_STATE.md` | This section |

**No article content, coordinate, source, translation, taxonomy, map library, provider configuration
or curation was touched.** `public/images/places/gyumri.webp` itself is unmodified.

### Media-registry entry

```ts
gyumri: "/images/places/gyumri.webp",
```

One line, in the existing Places block of `IMAGES`. No settlement-specific media logic, no
Gyumri-specific card logic, no new image field, no new provenance infrastructure, no special routing
and no duplicate configuration.

### Provenance behaviour

`isGeneratedArtwork` was read rather than assumed. Its current signature is
`(article: Pick<ArticleSummary, "slug" | "image">) => boolean`, and its body is
`!article.image && getImageSrc(article.slug) !== undefined`. Tested directly against the Gyumri
article in every edition:

```
PENDING_ARTWORK      : []
getImageSrc(gyumri)  : /images/places/gyumri.webp
en   | isGeneratedArtwork: true | getArticleImageSrc: /images/places/gyumri.webp | article.image: undefined
hy   | isGeneratedArtwork: true | getArticleImageSrc: /images/places/gyumri.webp | article.image: undefined
hyw  | isGeneratedArtwork: true | getArticleImageSrc: /images/places/gyumri.webp | article.image: undefined
```

On the rendered pages: the AI-generated illustration disclosure appears, the placeholder disclosure
disappears, and the placeholder `<svg role="img">` disappears — asserted in all three editions.
**`ARTWORK_PROVENANCE` is unchanged**, and provenance was not redesigned.

### Pending-artwork removal

`"gyumri"` removed from `PENDING_ARTWORK`, which is now empty. **The rejected-substitute notes from
§51 are preserved in full** — `bagratid-armenia.webp` (Ani, the only other stone city in the
repository), `avetik-isahakyan.webp` (a portrait, not a place), `khor-virap.png`,
`tatev-monastery.webp`, `erebuni-fortress.webp`, plus the advance refusals of the Black Fortress
alone, earthquake imagery and a generic Caucasian street — on the same principle as the Lake Sevan
three, the Garni three, the Geghard five and the Dilijan four: the failure they guard against is the
cover being repointed at a plausible neighbour later, and that outlives the file landing.

`validate:content` no longer reports Gyumri as pending; the pending-artwork note has disappeared from
its output entirely.

### Listing, article and search verification

* Gyumri's listing card renders `/images/places/gyumri.webp`.
* `/en/places/gyumri`, `/hy/places/gyumri` and `/hyw/places/gyumri` heroes all render it.
* Placeholder `<svg role="img">` absent in all three; placeholder disclosure absent in all three;
  AI-generated illustration disclosure present in all three.
* The global search card for Gyumri renders its own WebP, scoped by the canonical
  `a[href="/en/places/gyumri"]` rather than by position — necessary because "Gyumri" legitimately
  matches Isahakyan's and Anush's articles.
* `IMAGES` and `PENDING_ARTWORK` are mutually exclusive in both directions, checked repository-wide.
* The Places listing renders **zero** placeholder covers, and exactly `ILLUSTRATED.length + 1` images
  — ten cards plus the featured block's repeat of Khor Virap.
* Gyumri borrows nothing: none of the other nine Places files, and none of
  `bagratid-armenia.webp`, `avetik-isahakyan.webp`, `anush.webp` or `first-republic-armenia.webp`
  appears in its hero, meta tags or structured data.

### Per-card artwork ownership

The per-card ownership test loops `ILLUSTRATED`, which now holds all ten, and asserts **exact href →
exact artwork** for every one: `khor-virap`, `etchmiadzin-cathedral`, `erebuni-fortress`,
`matenadaran`, `lake-sevan`, `garni-temple`, `geghard-monastery`, `tatev-monastery`,
`dilijan-national-park`, `gyumri`. It is not an image count — a swapped pair of covers fails it, which
is the borrowed-neighbour failure the section guards hardest.

### Social metadata, JSON-LD and sitemap

| Surface | Before (§51) | After (§52) |
| --- | --- | --- |
| Hero | placeholder `<svg>` | `gyumri.webp` |
| `og:image` | absent | `https://armat.site/images/places/gyumri.webp` |
| `twitter:image` | absent | `https://armat.site/images/places/gyumri.webp` |
| `Article.image` | absent | `{ "@type": "ImageObject", url: "https://armat.site/images/places/gyumri.webp" }` |
| Sitemap `image:loc` | none in any of the three URL blocks | one in **each** of the three |

The sitemap is checked **block by block per locale route**, not by a global count of three — three
appearances anywhere would still pass if all three landed on one route. Each Gyumri block was also
checked to contain none of `bagratid-armenia`, `avetik-isahakyan`, `erebuni-fortress` or `anush`.

**The JSON-LD graph shape is unchanged.** The `@graph` still carries a generic `Article` node; the
only structured-data change is that node gaining `image`. No `City`, `AdministrativeArea`,
`TouristDestination`, `GeoCoordinates` or `LocalBusiness` type was introduced, and a test now asserts
their absence on this article by name — the settlement coordinate exists for Armat's map, not as an
instruction to change schema.

### Map selected-card transition

`src/lib/visit-map.ts`, `src/lib/map-tiles.ts` and `VisitMap.tsx` were **not modified**. The generic
`settlement` glyph added in §51 is unchanged.

Verified: the map still holds exactly **10** Places; Gyumri's marker still carries
`data-place-type="settlement"`; its accessible name is still `title — localized settlement label` in
all three editions; selecting it now shows **Gyumri's own WebP** where §51 asserted no image at all;
the selected card links to `/en/places/gyumri`; the panel shows no placeholder and none of Ani,
Erebuni or Dilijan; all nine other selected cards keep their existing images; no allow-list exists;
the coordinate is unchanged at 40.7852, 43.8416; and the marker-derived bounds are unchanged. Marker
overlap was not addressed in this step.

### Settlement and taxonomy regression

Unchanged and re-asserted: All 10 · Monastery 4 · Historical 2 · Museum 1 · Nature 2 ·
**Settlement 1**, containing exactly Gyumri. `precision: "settlement"` is still held by exactly one
coordinate. Khor Virap is still the only featured Place, in all three editions. No place type was
added.

### Visit-curation regression

**Curated row unchanged at six.** Gyumri is on `/places`, on the map, and still absent from the
curated row — it remains in `NOT_CURATED` alongside Etchmiadzin, Tatev and Dilijan. Now that it is
illustrated, the reasoning recorded in §51 (a curated card is a picture card) no longer blocks
curation, so the deferred **Visit-curation review is now unblocked** and belongs in its own step. It
was deliberately not taken here.

### Tests changed

`places.spec.ts` — `GYUMRI` moved into `ILLUSTRATED` and added to `ARTWORK`; **`PLACES`,
`ILLUSTRATED` and `ARTWORK` kept as three separate declarations** even though the first two now
coincide again, for the eighth time and on the same reasoning §48 and §50 recorded and §51 vindicated
one step later. The three §51 absence tests were **inverted, not deleted**: the placeholder test
became `Gyumri renders its own file and is captioned as an illustration`, the borrowed-artwork test
gained the positive `Article.image`, `og:image` and `twitter:image` assertions, and the search test
became `Gyumri's search card carries its own thumbnail and no placeholder`. The sitemap block
assertion flipped from "no `image:loc`" to "its own `image:loc`"; Gyumri joined the per-route sitemap
loop and the per-query search-thumbnail loop; `PENDING_ARTWORK` is pinned empty again; the listing
placeholder count is back to zero.

`visit-map.spec.ts` — the settlement-marker test gained the selected-card assertions; the
`else`-branch comment records that the unillustrated branch has now been needed three times and will
be needed again.

**The generic illustrated/unillustrated branching is intact everywhere** for Place #11.

### Commands run, in order

```
inspect asset (hand-walked chunk table + sharp cross-check, 9-file control run)
visual + text audit on extracted crops (no asset modified)
crop measurement at 16:9, 4:3, 3:2 and the search-thumbnail ratio
netstat :3002            -> clear
rm -rf .next             -> after confirming no dev server
npm run typecheck        -> PASS (0 errors)
npm run validate:content -> PASS (129 entries across 3 locales; no pending-artwork note)
npx playwright test tests/e2e/places.spec.ts    -> 1 failed, 61 passed (see below)
npx playwright test tests/e2e/places.spec.ts    -> 62 passed (after fix)
npx playwright test tests/e2e/visit-map.spec.ts -> 29 passed
npx playwright test tests/e2e/visit.spec.ts     -> 23 passed
npx playwright test                             -> 262 passed, 5 skipped, 0 failed
npm run build                                   -> PASS (138 pages prerendered)
```

### Every failure, recorded

One failure, and it was a test defect rather than a product one.

**`Gyumri borrows no other article's artwork, and advertises its own`** — the new `Article.image`
assertion was written against the wrong JSON-LD shape. It assumed a flat object with a top-level
`image`; the page actually emits `{"@graph": [...]}` with an `Article` node whose `image` is
`{"@type":"ImageObject","url":…}`, which is what the existing `the artwork reaches Open Graph,
Twitter and the article's structured data` test already reads correctly. `String(image)` therefore
compared against `"undefined"`. Fixed by reading the graph the same way the existing test does. **No
product assertion was weakened**, and the failure was in the new test only — the pre-existing
structured-data test passed throughout.

The known Turbopack `Unexpected end of JSON input` / cold-route 500 signature **did not appear** in
this step. The full suite produced one clean run with no retries and no flakes.

### Technical debt

Carried forward unchanged, and none opportunistically fixed: bibliography React key by
`source.title`; marker overlap (Erebuni/Matenadaran 25 × 26 px, Garni/Geghard 12 × 31 px);
Turbopack/cold-route full-suite flake; the Cuisine hydration flake; the photographic register, now
with Gyumri as its strongest instance and its first legible face; the Matenadaran façade colour; the
Garni stone warmth; the Garni 4:3 dimensions; the Khor Virap PNG at 1.4 MB; Erebuni and Matenadaran
artwork weight, now joined by Gyumri at 530 KB as the third heaviest; global media optimisation;
one-directional `relatedSlugs` with the Tatev-to-Geghard exception; the Western Armenian review
backlog; the Bresson and Fagan Garni attribution; Wilkinson's Garni source not read directly; the
Hovannisian ISBN; the Armstat Gyumri settlement-table caveat; `scratchpad/check.ts` and
`scratchpad/dilcheck.ts` outside `scripts/`; the weak homepage hero-path assertion; no central
environment module; the production Stadia dashboard and domain authorisation; the raster
label-language limitation; the privacy-page tile-provider disclosure.

**New this step, recorded not fixed:** the Gyumri narrow-thumbnail crop, and Gyumri's 1584 × 993
dimensions as a third distinct size in the registry.

### Deliberately not built

The image was not generated, edited, cropped, resized, recoloured, renamed, optimised or replaced. No
`object-position` rule, no Gyumri-specific image logic, no settlement-specific media logic, no new
image field, no per-image provenance, no new component and no custom routing. No article content,
coordinate, source, taxonomy or translation touched. No map architecture, marker glyph, provider
configuration, tile URL, attribution, environment variable, lazy loading, geolocation, routing,
geocoding, privacy behaviour or map filter taxonomy changed. No Visit curation change. No new
structured-data type. Leaflet and Stadia untouched. The marker overlap was left alone.
`.claude/settings.json` was not modified.

No deployment was performed.

## 53. Visit curation — the row re-cut once the section reached ten (August 2026)

The first step in nine that changed **no article, no coordinate, no source, no artwork and no
component**. It edits one six-element array of slugs, the comment that justifies it, and the tests
that pin it. Everything a reader sees change on `/visit` is resolved from data that was already
there.

§52 ended by noting that the reasoning which had kept Gyumri out of the curated row — a curated card
is a picture card — no longer applied. This is the step that acts on it, and the review it triggered
turned out to be about far more than Gyumri.

### The row before this step

Read from `src/app/[locale]/visit/page.tsx` rather than from this file, because a curation is exactly
the kind of thing PROJECT_STATE can describe correctly and still be out of date about:

```
garni-temple  geghard-monastery  lake-sevan  khor-virap  matenadaran  erebuni-fortress
```

Six of a seven-article section when it was written, and the seventh — Etchmiadzin — was excluded on
a stated rule: it would have been the row's third monastery.

### What the audit found

The row was a fair curation of the section it was written for and a poor one of the section that now
exists.

| Card | Type | Where | Distance from Yerevan |
|---|---|---|---|
| erebuni-fortress | historical | Yerevan | in the city |
| matenadaran | museum | Yerevan | in the city |
| garni-temple | historical | Kotayk | ~28 km |
| geghard-monastery | monastery | Kotayk | ~36 km |
| khor-virap | monastery | Ararat plain | ~30 km |
| lake-sevan | nature | Gegharkunik | ~60 km |

**Five of six inside about forty kilometres of the capital**, and two pairs that nearly duplicate each
other: Erebuni and the Matenadaran are both in Yerevan, and Garni and Geghard are eight kilometres
apart in the same valley — the two articles that link to each other more than to anything else.

Type spread was monastery 2, historical 2, museum 1, nature 1, settlement 0.

Syunik, Tavush and Shirak — the three provinces the section spent §47, §49 and §51 acquiring — had no
card at all. The row was, without intending to be, a picture of the area around Yerevan.

### The row after this step

```
khor-virap  gyumri  lake-sevan  garni-temple  dilijan-national-park  tatev-monastery
```

**In:** `gyumri`, `dilijan-national-park`, `tatev-monastery`.
**Out:** `geghard-monastery`, `erebuni-fortress`, `matenadaran`.

A three-card turnover, which is half the row, and it is the corpus that changed rather than the
taste: the three articles added since the row was last cut are the three that fill the gaps the audit
found.

| Card | Type | Where | Picture |
|---|---|---|---|
| khor-virap | monastery | Ararat plain | warm monastery under Ararat |
| gyumri | settlement | Shirak (NW) | grey winter street, carriage |
| lake-sevan | nature | Gegharkunik (E) | open blue water |
| garni-temple | historical | Kotayk (C) | classical colonnade |
| dilijan-national-park | nature | Tavush (NE) | dense green forest |
| tatev-monastery | monastery | Syunik (S) | grey complex on a cliff |

Six provinces, no two cards in the same one. Type spread is monastery 2, nature 2, settlement 1,
historical 1, museum 0.

### Why each place is in

- **khor-virap** — kept despite being the most predictable card here. It is the most recognisable view
  in the country and the origin of the Christian story the section keeps returning to. A first
  impression that omits it is one trying to prove a point.
- **gyumri** — the whole argument for re-cutting. The only `settlement`, the only card whose subject
  is somewhere people *live* rather than somewhere people visit, and the northwest. A row of
  monuments with no inhabited place in it describes a country that does not exist.
- **lake-sevan** — the natural feature Armenia is defined by, and the only large water in the archive.
- **garni-temple** — the entire pre-Christian layer, carried alone now. Without it the row starts in
  the fourth century, which is false, and Erebuni's removal is what made this card load-bearing.
- **dilijan-national-park** — the northeast, and the only landscape in the registry that is green and
  closed rather than open and dry. It is the card that looks least like the Armenia of the
  photographs, which is exactly its editorial value.
- **tatev-monastery** — the south, and a monastery that resembles the other monastery in category
  only. Syunik had no card at all before this step.

### Why each removal, and what it cost

Written as costs rather than as justifications, because all three are real.

- **geghard-monastery** — the cheapest removal and the first one made. Armat loses a World Heritage
  property and the only rock-cut architecture in the section. It went because it is eight kilometres
  from Garni in the same valley and would have been the row's third monastery, which is the rule that
  kept Etchmiadzin out in the first place and it applies unchanged.
- **erebuni-fortress** — the deep-antiquity card. Armat loses Urartu, the eighth century BC and the
  founding of Yerevan from the row. Garni now carries "Armenia is older than its churches" alone,
  which it can do, but it does it from the first century rather than the eighth BC.
- **matenadaran** — **the removal this step is least comfortable with.** Armat loses the only `museum`
  in the section, the only card about written culture, and the only remaining card in the capital,
  where nearly every reader of this page actually is. It went because §3's five buckets name
  "historic monuments" and do not name "museum", and between the Matenadaran and Garni only one of
  them answers that. The row now has no museum and no card in Yerevan. Both are one click behind the
  all-places CTA; both are recorded here and in the page comment so the next curator argues with the
  decision rather than rediscovering it.

Etchmiadzin remains uncurated on its original reasoning, and is now one of four places on the map
that are not in the row.

### The Learn row, and the invariant this step broke

The strongest argument *against* this curation, recorded because it is a genuine cost and not an
oversight.

"Learn before you visit" offers four history articles, and `visit/page.tsx` carried a rule: every one
of them is declared in the `relatedSlugs` of at least one **curated** place. That is what stops a
fourth card being added because a row of three looked thin.

Three of the four still clear it — `adoption-of-christianity` and `tigran-the-great` through Khor
Virap and Garni, `kingdom-of-urartu` through Lake Sevan. **`mesrop-mashtots-armenian-alphabet` does
not.** Its only carrier anywhere in the section is the Matenadaran, which this step removed from the
row while leaving it in the section, on the map, in search and in the listing.

Three ways out were available and two were refused:

- re-curate the Matenadaran to satisfy the rule — letting a comment about a different section pick
  the Places row;
- drop the alphabet card — changing "Learn before you visit", which this step was told not to touch
  and had no editorial reason to;
- record it.

So: the Learn array is **unchanged**, the rule is restated as "declared by at least one Places
article" — which is still true, and still rejects a history article with no place connection at all —
and the test now asserts the exception explicitly rather than widening until it stops noticing. The
real cost stands: a reader now meets the alphabet card without having just seen the building that
holds the manuscripts.

### Visual rhythm, and why the order is what it is

The order is editorial and survives every grid the page uses. Measured at 360, 390, 768 and 1440 in
all three editions — twelve renders, six cards each, zero horizontal overflow everywhere:

| Width | Grid | Row shape |
|---|---|---|
| 360 | 1 column | 1,1,1,1,1,1 |
| 390 | 1 column | 1,1,1,1,1,1 |
| 768 | 2 columns | 2,2,2 |
| 1440 | 3 columns | 3,3 |

Six divides evenly into one, two and three, so there is no orphaned final row at any width. Card
images are 16:9 at every width (320×179, 340×190, 389×218) — which is Gyumri's best crop and the
reason the §52 narrow-thumbnail concern does not reach this page.

At three columns the rows read monastery / city / lake and temple / forest / monastery: the two
monasteries land in opposite corners, the two landscapes never touch, and no column pairs two cards
of the same kind. At two columns the pairs are city-beside-monastery, temple-beside-lake and
monastery-beside-forest. In a single column no two adjacent cards are the same kind of picture.

**One visual observation, reported not fixed.** Khor Virap and Garni are both warm golden-hour
images, and at three columns they sit one above the other in the left column. They are different
subjects — a domed monastery on a plain against a colonnade on a promontory — and the sequence has no
better position for either without breaking the monastery separation that matters more. Recorded as
an observation rather than a defect.

Card-height variance within a single column reaches 68 px in `hy` at 360 and 23 px elsewhere, which
is excerpt length and not a layout fault; rows stretch to equal height at every multi-column width.

### Tests

`tests/e2e/visit.spec.ts` only. `places.spec.ts` and `visit-map.spec.ts` have no curation coupling,
which was checked rather than assumed.

- `FEATURED_PLACES` rewritten to the new six **in order** — still copied from the page rather than
  imported, so the decision has to be made twice.
- `NOT_CURATED` now names Geghard, Erebuni and the Matenadaran beside Etchmiadzin, and does a job it
  was not doing before: three of its four entries are *removals*, so the failure it catches is one of
  them drifting back in and taking the row to seven. The comment names the Matenadaran as the one to
  watch.
- The Learn guard **split into two assertions** rather than loosened — three slugs must be declared by
  a curated place, and the alphabet must be declared by an *uncurated* one that is specifically the
  Matenadaran. It fails in both directions.
- One new test, `the curated row has the editorial shape §53 chose, and the map still has everything`:
  no duplicate slug; every curated slug is a real Places article; the settlement is curated and it is
  Gyumri; at least one nature; at most two monasteries; all ten places still on the page's own
  server-rendered map list with correct hrefs; and the three removals checked *as removals* — off the
  row, still pinned, still routed.

Deliberately not written: latitude thresholds, region quotas, or any test that re-derives the
selection. The six-slug array is the strongest statement of the decision; a test that recomputed it
would be re-running the judgement instead of protecting it.

### Verification

In the mandated order, on a cleared port and a removed `.next`:

- `npm run typecheck` → PASS, 0 errors.
- `npm run validate:content` → PASS, 129 entries across 3 locales. Unchanged, as it must be: no
  content moved.
- `npx playwright test tests/e2e/visit.spec.ts` → 23 passed, 1 failed. The failure was
  `each section CTA resolves, in every edition`, a 90 s timeout navigating to `/en/cuisine` with a
  Turbopack `ChunkLoadError` in the log. Re-run alone: **passed in 23.1 s**. Known flake, untouched
  route.
- `npx playwright test tests/e2e/places.spec.ts` → 60 passed, 2 failed: the `hy` and `hyw`
  `places listing and the article both load` tests, timing out at 30 s on cold Armenian article
  routes. Re-run alone: **both passed, 24.7 s each** — warm, just inside a budget they exceed cold.
  Known flake.
- `npx playwright test tests/e2e/visit-map.spec.ts` → **29 passed**, no failures.
- `npx playwright test` → **262 passed, 5 skipped, 1 failed** of 268. The failure was
  `the current language is marked in the mobile selector`, preceded by a Turbopack
  `Uncaught SyntaxError: Unexpected token '.'` chunk corruption in the dev server. Re-run alone:
  **passed in 3.3 s**. Known flake, and mobile header nav is untouched by this step.
- `npm run build` → PASS, **138 pages** prerendered — identical to §52, which is the check that no
  route was added or removed.

**Two environment failures worth recording separately,** because they are not test flakes. The first
`places.spec.ts` run died with a V8 `FATAL ERROR: Committing semi space failed` at a 69 MB heap, and
a second attempt reproduced it; `powershell` then failed to start the CLR with HRESULT 80004005. The
machine had 2.2 GB of 16 GB free. No orphaned `node` processes were found — the crashed runs had
cleaned up — and both suites ran normally once memory recovered to 3.7 GB. This is host memory
pressure, not a regression, and it is the reason two `places.spec.ts` attempts appear in this record.

### Confirmations

- **Map remains ten.** `getVisitMapPoints` is still `places articles ∩ PLACE_COORDINATES` and was not
  touched. All ten appear in the server-rendered `[data-map-list]`, now asserted on `/visit` itself.
- **`/places` remains ten.** The hand-edited listing count in `visit.spec.ts` is unchanged at 10.
- **Nothing left the archive.** The three removals keep their articles, coordinates, artwork,
  map pins, search entries, sitemap URLs and canonical routes. A card leaving the row cannot take an
  article with it, and that is now a test.
- **No article content changed.** No coordinate, `relatedSlugs`, `placeTypeId`, `featured`, SEO field,
  artwork file, media-registry entry or source list. Khor Virap is still the only `featured: true`
  place, and `featured` remains a different system from this row.
- **No Western Armenian copy written.** No Visit UI label changed, so `hyw` needed no edit and got
  none.

### Technical debt

All carried forward unfixed: the bibliography React-key issue; the Erebuni/Matenadaran 25 × 26 px and
Garni/Geghard 12 × 31 px marker overlaps; the Turbopack suite flake, which produced three separate
failures in this step and was re-confirmed as a flake three times; the photographic-register concern
across Geghard, Tatev, Dilijan and Gyumri; the image-size and weight inconsistencies including
Gyumri's 1584 × 993 third size; media optimisation; the Cuisine hydration issue; one-directional
relationships; the pending Western Armenian native review; the source caveats including the Armstat
Gyumri settlement tables; `scratchpad/check.ts` and `scratchpad/dilcheck.ts` outside `scripts/`; the
weak homepage hero-path assertion; no central environment module; the production Stadia dashboard and
domain authorisation; the raster label-language limitation; the privacy-page tile-provider
disclosure. The Gyumri narrow search-thumbnail crop is explicitly out of scope here and unchanged.

**New this step, recorded not fixed:** the row has no museum card and no card in Yerevan; the Learn
row's alphabet card no longer has a curated place behind it; Khor Virap and Garni share a warm palette
in the same desktop column; and Next reports Gyumri's image as the `/visit` LCP element without
`loading="eager"`, which is a pre-existing property of whichever card sits high in the row rather
than anything Gyumri introduced.

### Deliberately not built

No new article, no new place type, no change to Places taxonomy, coordinates, artwork, sources or
article content. No change to the hero, "Explore by type", the map section, the Cuisine selection,
"Learn before you visit", Visit SEO, navigation or structured data. The row stayed at six — no
seventh card, no carousel, no pagination, no "show more". The curation is still a locale-independent
slug array resolving titles, excerpts, images, types and reading times through the article and media
systems; nothing was duplicated into it. No Leaflet, Stadia, provider, tile, geolocation or routing
change. `.claude/settings.json` was not modified.

No deployment was performed.

## 54. Armenian-language review of the two new categories (August 2026)

A requested review of all Places and Cuisine content in both Armenian editions, for language
quality and for anything that could read as anti-Armenian framing. No structural, taxonomy, test or
code change; four small text corrections.

### Framing audit — clean

Every sensitive passage was read in context in all editions: the Genocide references (Matenadaran
manuscript rescue, Musa Dagh harissa commemoration) use «Հայոց ցեղասպանութիւն/ցեղասպանություն»
plainly and cite Kevorkian; Ararat is located «սահմանից այն կողմ՝ ներկայիս Թուրքիայում» as fact;
Alexandropol 1920 names «թուրք ազգայնական ուժեր»; the 1828–29 resettlement, the UNESCO
lavash/dolma double inscriptions and the Turkic dolma etymology are stated with the established
inscription-is-not-ownership framing; the Gyumri earthquake keeps its one-paragraph human-dimension
rule with no casualty figure asserted. No denialist sourcing, no hostile framing, no
Artsakh/Karabakh content exists to audit. hyw consistently uses Ազրպէյճան/Թուրքիոյ and Կիւմրի (43/0
vs Գիւմրի), hy uses Ադրբեջան/Գյումրի — each edition internally consistent.

### Corrections applied (validate:content + typecheck PASS after)

- hy dolma intro: «նույն բային ծագող» → «նույն բայից ծագող» (case error; hyw already had բայէն).
- hy harissa ×6 + en keyword ×1: «քորքոտ» → «կորկոտ» — dictionary form, already used by hyw and
  matched by the en romanization *korkot*; cross-edition inconsistency removed.
- hy lavash/dolma ×4: «հմր NNNNN» → «թիվ NNNNN» (nonstandard abbreviation; hyw uses թիւ). Digits
  untouched — numeral parity unaffected.
- Khor Virap, both editions: the calque «՝ շատ քիչ բանով միջև/միջեւ» → hy «՝ արանքում շատ քիչ
  բանով», hyw «՝ մէջտեղը շատ քիչ բանով»։

### Flagged for native Western Armenian review, not changed

- «հէնց» ~19× in hyw places articles — an Eastern-marked particle; per-sentence replacement
  (ճիշդ/նոյնինքն/restructure) is a native-reviewer call. Joins the standing hyw review debt.
- Letter-numeral centuries in hyw Gyumri («Ի դարը», «ԺԹ դարու») written without the abbreviating
  dot — a convention choice to confirm.
- hyw uses Կարին for the Genocide-era manuscript rescue but Էրզրում in the 1828–29 imperial context
  — plausibly deliberate; confirm.

### Explicitly NOT errors (checked and kept)

The hyw pattern «ոչինչ/ոչ մէկ + unnegated verb» (~15 sentences) is correct Western Armenian single
negation, as in Classical Armenian; hy consistently uses Eastern double negation. Both are right;
neither was touched. Recorded so a later pass does not 'fix' one branch into the other.

No deployment was performed. `.claude/settings.json` untouched.

## 55. Western Armenian review of the two new categories (August 2026)

A follow-up to §54, requested specifically for the hyw edition. The hyw Places file was read in
full (all ten articles) and the hyw Cuisine file in full (all six), on top of mechanical sweeps.

### Mechanical sweeps — all clean

Zero Eastern «և» anywhere; zero reformed spellings (թվական, -ություն, հարյուր, որպես, վրա, միջև,
նաև, ինչպես, որտեղ, այնտեղ, կարող է, պետք է all absent in Eastern form); zero Eastern locatives
(-ում); every «-ում է/են» hit is a noun + copula (վերականգնում է, պնդում է, յիշատակում է…); the
five «արդեն» hits are all «Վարդենիս»; «Կիւմրի» 43/0 against «Գիւմրի»; the WA elision rule (կ՚
before vowels, կը before consonants) holds across all 443 uses with exactly one violation, fixed
below; zero «կը + vowel-initial verb» omissions (all apparent hits were nouns in -կ + article -ը).

### The near-miss worth recording

The hyw pattern «ոչինչ/ոչ մէկ + unnegated verb» (~15 sentences) was checked and confirmed as
correct Western Armenian single negation (Classical Armenian model), against hy's Eastern double
negation. Both editions are right; neither was touched. Recorded in §54 and re-confirmed here.

### Corrections applied (validate:content PASS, typecheck PASS, the two Gyumri wording tests PASS)

- «կ՚ղրկուէին» → «կը ղրկուէին» (Dilijan, §49 translation) — elided form before a consonant, the
  single violation of an otherwise perfect convention.
- «ՅՈՒՆԵՍԿՕ» → «ԵՈՒՆԵՍՔՕ» ×5, all in the Gyumri article (§51 translation) — the rest of hyw uses
  the Western form 33×, so Gyumri had silently imported the Eastern house form. Tests pin the
  element number 01967 and the heritage phrase, not the acronym, so nothing else moved.

### Flagged for native review, unchanged (joins the standing hyw debt)

- «հէնց» ~19× in hyw Places only (zero in cuisine/history/writers/works) — Eastern-marked
  particle; replacements (ճիշդ / նոյնինքն / restructure) are per-sentence native calls.
- Letter-numeral centuries in the Gyumri article («Ի դարը», «ԺԹ դարու») written without the
  abbreviating dot — a convention to confirm, not an error.
- Author-string drift, site-wide and parallel in hy: «Armat-ի խմբագրական խումբ» (7 places),
  «Արմատ խմբագրական խումբ» (Sevan, Dilijan, Gyumri), «Armat-ի խմբագրական կազմ» (hyw cuisine and
  most other hyw categories). Three variants of one credit line; unifying is an editorial
  branding decision touching all three editions, not a translation fix.
- hyw uses «Կարին» for the Genocide-era manuscript rescue and «Էրզրում» in the 1828–29 imperial
  context — read as deliberate register, worth a native confirmation.

### Framing

Nothing anti-Armenian anywhere in hyw: «Հայոց Ցեղասպանութիւն» named plainly, Musa Dagh reverent,
Ararat located factually, 1920 forces named «թուրք ազգայնական ուժեր», UNESCO double-inscription
framing intact, earthquake one-paragraph rule intact, no Artsakh/Karabakh content exists.

No deployment was performed. `.claude/settings.json` untouched.

## 56. English review of the two new categories (August 2026)

Following §54 (hy) and §55 (hyw), the same review was run on the English edition of the two
new categories: all 10 Places articles (`src/data/locales/en/articles/places.ts`, 2180 lines)
and all 6 Cuisine articles (`src/data/locales/en/articles/cuisine.ts`, 824 lines) were read in
full, plus mechanical sweeps.

### Mechanical sweeps — all clean

- No doubled words (the the / of of / etc.), no double spaces inside prose.
- No US spellings. The register is consistently British: -ise verbs (organised, nationalised,
  standardised, digitisation), metres/kilometres, aubergine/courgette, yoghurt, "per cent"
  (×4, zero "percent"), "First World War", artefact, hyphenated compass points
  (north-east etc., zero closed forms). The only grep hits were false positives
  (literature, cemetery, honorific).
- No curly quotes; apostrophes in scholarly transliterations (Siwnik', Dawit', Arewelts'i)
  are deliberate and consistent.
- Diacritics consistent: Ibn Sayyār al-Warrāq ×2; "harīsa" (macron) reserved for the
  medieval Baghdadi dish vs "harissa" for the Armenian dish — a deliberate, consistent split.
- UNESCO identifiers all present and matching the wording tests: lavash no. 00985, dolma
  no. 01188, blacksmithing element 01967, Etchmiadzin list no. 1011, Geghard no. 960.

### One fix applied

- `en/articles/places.ts` Lake Sevan, how-the-water-moves section: **«joins the Araxes» →
  «joins the Araks»**. The river was spelled "Araks" twice in Khor Virap (the earlier
  article) and "Araxes" once in Lake Sevan — the only transliteration drift in the English
  edition, and exactly the kind the Gyumri article itself legislates against
  ("this archive uses Alexandropol throughout"). No test pins either form; no digits
  involved, so numeral parity is unaffected.

Verification: `npm run validate:content` PASS (129 entries across 3 locales);
`npm run typecheck` PASS.

### Deliberate non-issues (checked, left alone)

- "Alexandrapol" in the Gyumri keywords array is intentional SEO capture of the variant
  spelling the article itself discusses.
- Khorovats summary says "a dish of their own" where the section says "a dish of its own" —
  both idiomatic English with different antecedents; not an error.
- Citing Priscilla Mary Işın (Ottoman culinary history) in the dolma article is a food-history
  source, not hostile material; the framing around it explicitly refuses ownership claims
  in both directions.

### Framing audit — clean

Nothing anti-Armenian and nothing over-claiming: the Armenian Genocide is named plainly
(Matenadaran rescue narrative, Musa Dagh/harissa with Kévorkian cited); Ararat is located
factually ("across the border, in present-day Turkey") while its cultural weight is stated;
Gyumri 1920 uses "Turkish nationalist forces"; the dolma article states the Azerbaijani
UNESCO nomination as fact and reads it as "a practice, not an origin" — the same
double-inscription framing as lavash; Erebuni's deportation clause is framed as evidence
about the Urartian state; the Gyumri earthquake keeps the one-paragraph human-dimension
rule. No Artsakh/Karabakh content exists in either file.

No deployment was performed. `.claude/settings.json` untouched.
