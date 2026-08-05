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
npm run validate:content → PASS (105 entries across 3 locales; no pending-artwork note)
npm run build            → PASS (111 pages prerendered; `/api/contact` dynamic)
npm run test:e2e         → PASS (173 passed, 5 skipped, no --workers flag; see §30)
```

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
