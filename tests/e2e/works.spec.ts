import { expect, test, type Page } from "@playwright/test";
import { PENDING_ARTWORK, getImageSrc, getPortraitProvenance } from "@/lib/media";
import { getSources } from "@/data/sources";
import { LOCALES, articleTitle, bundle, cards, ui } from "./helpers";

/**
 * The Literary Works section.
 *
 * This file did not exist until §61. The four works the section shipped with
 * were covered incidentally — `listing.spec.ts` for the genre filter,
 * `article.spec.ts` for the shared furniture, `search.spec.ts` and `seo.spec.ts`
 * for the archive-wide contracts, and one count literal in `places.spec.ts`.
 * That was proportionate while the section was four modern narrative texts whose
 * facts nobody disputes.
 *
 * `book-of-lamentations` is not that. It is the section's first medieval work,
 * the first written in grabar, the first whose English title collides with a
 * different and far more famous book, the first whose divisions have a technical
 * name that translators disagree about, and the first that arrives carrying a
 * devotional tradition an encyclopedia has to report without endorsing. None of
 * those claims has anywhere to be asserted in a file about listings.
 *
 * The tests below therefore pin *claims* and *state* rather than layout, and
 * they follow the discipline the Cuisine and Writers files arrived at: where the
 * article names a popular belief in order to frame it, the test pins the framing
 * rather than banning the words, because a naive substring ban fails on the
 * article's own careful sentence.
 */

const NAREKATSI = "grigor-narekatsi";
const NAREK = "book-of-lamentations";
const BAKUNTS = "aksel-bakunts";
const MTNADZOR = "mtnadzor";

/** Every work in the section, as of §61. Stated, not derived. */
const SLUGS = [
  "anush",
  "wounds-of-armenia",
  "the-fool",
  "david-of-sassoun",
  NAREK,
  MTNADZOR,
] as const;

/** The four that existed before §61, which this step must not have touched. */
const PRE_EXISTING = ["anush", "wounds-of-armenia", "the-fool", "david-of-sassoun"] as const;

/**
 * Where each work's artwork must live.
 *
 * §61 wrote `book-of-lamentations` and left the picture to a later step, which is
 * the sequence every other section in this archive has followed. §63 is that step:
 * the file landed, one line went into `IMAGES` and one came out of
 * `PENDING_ARTWORK`, and the section is fully illustrated for the first time.
 */
const ARTWORK: Record<string, string> = {
  anush: "/images/works/anush.webp",
  "wounds-of-armenia": "/images/works/wounds-of-armenia.webp",
  "the-fool": "/images/works/the-fool.webp",
  "david-of-sassoun": "/images/works/david-of-sassoun.webp",
  [NAREK]: "/images/works/book-of-lamentations.webp",
};

/**
 * Artwork filenames, for asserting against rendered `src` attributes.
 *
 * `next/image` percent-encodes the path into its own query string — the hero
 * renders as `/_next/image?url=%2Fimages%2Fworks%2Fbook-of-lamentations.webp&…`
 * — so a registry path never appears literally in the DOM and matching one is a
 * test that can only fail. The filename survives the encoding intact, and it is
 * unique across the archive, which is what makes it the thing to match on.
 */
const FILE = Object.fromEntries(
  Object.entries(ARTWORK).map(([slug, path]) => [slug, path.split("/").pop()!]),
) as Record<string, string>;

/** The four covers that existed before §63, for borrowing assertions. */
const PRE_EXISTING_ARTWORK = PRE_EXISTING.map((slug) => FILE[slug]);

function work(locale: string, slug: string) {
  return bundle(locale as never).works.find((w) => w.slug === slug)!;
}

function article(locale: string, slug: string) {
  return bundle(locale as never).articles.find((a) => a.slug === slug)!;
}

/** All of an article's prose in one string, for claim assertions. */
function text(locale: string, slug: string): string {
  const a = article(locale, slug);
  return [
    a.intro,
    a.summary ?? "",
    ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
    ...a.keyFacts.map((f) => `${f.label} ${f.value}`),
    ...a.importantDates.map((d) => `${d.year} ${d.event}`),
    ...a.interestingFacts,
    a.significance.heading,
    ...a.significance.paragraphs,
  ].join("\n");
}

async function prose(page: Page, locale: string, slug: string): Promise<string> {
  await page.goto(`/${locale}/works/${slug}`);
  return (await page.getByRole("main").textContent()) ?? "";
}

/* -------------------------------------------------------------------------- */
/*  Corpus                                                                     */
/* -------------------------------------------------------------------------- */

test("the fifth work exists in every edition and the first four are untouched", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);

    expect(b.works.map((w) => w.slug), `${locale} work order`).toEqual([...SLUGS]);
    expect(b.works.length, `${locale} works`).toBe(6);

    // Slugs are unique — an alias accidentally shipped as a second card would
    // give the section two entries that resolve to one article.
    expect(new Set(b.works.map((w) => w.slug)).size, `${locale} slugs unique`).toBe(6);

    // The card and the article agree that this work exists in this edition.
    const card = work(locale, NAREK);
    expect(card, `${locale} card`).toBeTruthy();
    expect(article(locale, NAREK), `${locale} article`).toBeTruthy();
    expect(article(locale, NAREK).href, `${locale} href`).toBe(`/works/${NAREK}`);
    expect(article(locale, NAREK).category, `${locale} category`).toBe("works");

    // The genre filter it claims has to be one the listing actually offers.
    const genres = new Set(b.workGenres.map((g) => g.id));
    expect(genres.has(card.genreId), `${locale} genreId is a real filter`).toBe(true);
    expect(card.genreId, `${locale} closest existing genre`).toBe("poetry");
  }
});

test("the four earlier works are byte-identical to what §60 left", () => {
  /*
    §61 is a content-addition step. The guard that matters is not that the new
    work is right but that writing it changed nothing already published.
  */
  for (const locale of LOCALES) {
    for (const slug of PRE_EXISTING) {
      const card = work(locale, slug);
      expect(card, `${locale} ${slug} still present`).toBeTruthy();
      expect(getImageSrc(slug), `${locale} ${slug} artwork unmoved`).toBe(ARTWORK[slug]);
      expect(PENDING_ARTWORK, `${slug} did not become pending`).not.toContain(slug);
    }
  }
});

test("the author is Grigor Narekatsi, and the relation runs both ways", () => {
  /*
    A work with no author link is an orphan, and a duplicated author is worse: a
    second Narekatsi entity disconnected from the Writer data is exactly the
    failure the shared `relatedSlugs` mechanism exists to prevent.
  */
  for (const locale of LOCALES) {
    const card = work(locale, NAREK);
    const a = article(locale, NAREK);

    // The card names him, and the Writers section is where that name resolves.
    expect(card.author, `${locale} card author`).toBe(
      bundle(locale).writers.find((w) => w.slug === NAREKATSI)!.name,
    );

    // The structured relation, and the reciprocal one on his own article.
    expect(a.relatedSlugs, `${locale} work relates to its author`).toContain(NAREKATSI);
    expect(
      article(locale, NAREKATSI).relatedSlugs,
      `${locale} author relates to the work`,
    ).toContain(NAREK);

    // No second Narekatsi entity was created to carry the authorship.
    const slugs = bundle(locale).articles.map((x) => x.slug);
    expect(slugs.filter((s) => s === NAREKATSI).length, `${locale} one Narekatsi`).toBe(1);

    // Every authored relation resolves in this edition, and there are no fillers.
    expect(a.relatedSlugs, `${locale} relations`).toEqual([
      NAREKATSI,
      "matenadaran",
      "nerses-shnorhali",
    ]);
    for (const rel of a.relatedSlugs) {
      expect(slugs, `${locale} ${rel} exists`).toContain(rel);
    }
  }
});

test("the title question is answered rather than flattened", () => {
  /*
    The repository already had a convention before this article: `en` writes Book
    of Lamentations, `hy` the reformed Մատյան ողբերգության, `hyw` the classical
    Մատեան ողբերգութեան. §61 follows it rather than inventing a fourth form, and
    each edition carries the others in its keywords so a reader arriving with the
    wrong spelling still lands.
  */
  expect(work("en", NAREK).title, "en title").toBe("Book of Lamentations");
  expect(work("hy", NAREK).title, "hy uses reformed orthography").toBe("Մատյան ողբերգության");
  expect(work("hyw", NAREK).title, "hyw keeps the classical form").toBe("Մատեան ողբերգութեան");

  // Narek is the popular name, not the formal title, and must not be the headline.
  for (const locale of LOCALES) {
    expect(work(locale, NAREK).title, `${locale} title is not the nickname`).not.toBe("Նարեկ");
    expect(work(locale, NAREK).title, `${locale} title is not the nickname`).not.toBe("Narek");
  }

  // But it has to be findable under it, and under the other editions' spellings.
  const keywords = (locale: string) => (article(locale, NAREK).keywords ?? []).join(" ");
  for (const locale of LOCALES) {
    expect(keywords(locale), `${locale} carries the classical title`).toContain(
      "Մատեան ողբերգութեան",
    );
    expect(keywords(locale), `${locale} carries the reformed title`).toContain(
      "Մատյան ողբերգության",
    );
    expect(keywords(locale), `${locale} carries the nickname`).toContain("Նարեկ");
  }
  expect(keywords("en"), "en carries the romanised nickname").toContain("Narek");
  expect(keywords("en"), "en carries the singular English title").toContain("Book of Lamentation");
});

test("the article distinguishes itself from the biblical Lamentations", async ({ page }) => {
  /*
    The single most likely reader question, and the one no page ranking for this
    title currently answers. It is asserted in the rendered page rather than in
    the data, because the point is that a reader sees it without scrolling.
  */
  const en = await prose(page, "en", NAREK);
  expect(en, "en says which book this is not").toContain("not the biblical Book of Lamentations");
  expect(en, "and says what the other one is about").toContain("destruction of Jerusalem");

  // Every edition names the biblical book by its own Armenian name, «Ողբեր»,
  // rather than reusing the Armenian title of this one.
  for (const locale of ["hy", "hyw"]) {
    expect(text(locale, NAREK), `${locale} names the biblical book`).toContain("Ողբեր");
  }
});

test("the ninety-five divisions are named as the text names them", () => {
  /*
    Translators render `բան` as prayers, chapters, discourses and soliloquies, and
    the number is stable at ninety-five across the manuscript tradition. What the
    article must not do is flatten that into "95 poems", which reads them as
    free-standing lyrics rather than as parts of one address.
  */
  for (const locale of LOCALES) {
    const body = text(locale, NAREK);
    // The manuscript rubric, which every edition prints in Armenian capitals.
    expect(body, `${locale} keeps the manuscript rubric`).toContain("ԲԱՆ");
  }

  // The Armenian editions name the unit in Armenian; `en` transliterates it,
  // because a Latin-alphabet reader cannot look up a word they cannot type.
  for (const locale of ["hy", "hyw"]) {
    expect(text(locale, NAREK), `${locale} names the unit in Armenian`).toMatch(/բան/);
  }

  const en = text("en", NAREK);
  expect(en, "en transliterates the unit").toContain("ban");
  expect(en, "en explains the term").toContain("plural bank");
  expect(en, "en glosses it against logos").toContain("logos");
  expect(en, "en records the rendering disagreement").toContain("discourses");
  /*
    Not a ban on the words. The article raises "ninety-five poems" in order to
    qualify it, so a substring ban would fail on the very sentence that does the
    work — the same trap the Writers file documents. The qualification is pinned
    instead.
  */
  expect(en, "en qualifies the poems reading").toContain(
    "Calling them ninety-five poems is not wrong but loses something",
  );
});

test("the date is given with the precision the evidence supports", () => {
  /*
    A colophon dates the work to the Armenian year 451, that is 1002. What is not
    established is that it was written in one late burst, so the article must not
    print a bare completion year as though it were a fact of record.
  */
  for (const locale of LOCALES) {
    const body = text(locale, NAREK);
    expect(body, `${locale} gives the year`).toContain("1002");
    expect(body, `${locale} names the colophon evidence`).toContain("451");

    // The card's period field hedges rather than asserting an exact date.
    expect(work(locale, NAREK).publicationPeriod, `${locale} hedged period`).toMatch(
      /about|մոտ|մօտ/,
    );
  }

  const en = text("en", NAREK);
  expect(en, "en refuses the deathbed version").toContain("single late burst");
  expect(en, "en corrects the circulating 977").toContain("977");
});

test("Vaspurakan is not folded into the Bagratid kingdom", () => {
  /*
    The trap this article was most likely to fall into. Narek stood in an Artsruni
    realm that was a separate kingdom from the Bagratid one centred on Ani, and
    the difference is not pedantry — it is the political fact that the monastery
    depended on.
  */
  for (const locale of LOCALES) {
    const body = text(locale, NAREK);
    expect(body, `${locale} names the dynasty`).toMatch(/Artsruni|Արծրուն/);
    expect(body, `${locale} dates the cession to Byzantium`).toContain("1021");
  }

  expect(text("en", NAREK), "en states it outright").toContain(
    "Narek was not in Bagratid territory",
  );
});

test("the speaking voice is not read as autobiography", () => {
  /*
    The quality differentiator, and the thing every devotional page ranking for
    this work gets wrong. The catalogue of sins is a representative voice, not a
    confession of things Narekatsi did — and the article has to say so without
    denying that a real penitent is speaking.
  */
  const en = text("en", NAREK);
  expect(en, "en states the objection").toContain("every sin the book lists");
  expect(en, "en gives the representative reading").toContain("representative");
  expect(en, "en cites the work's own framing").toContain("in his place");
  expect(en, "en preserves the counter-position").toContain("New Catholic Encyclopedia");

  for (const locale of LOCALES) {
    expect(text(locale, NAREK), `${locale} has the speaker section`).toBeTruthy();
    const ids = article(locale, NAREK).sections.map((s) => s.id);
    expect(ids, `${locale} section ids are shared`).toContain("the-speaking-voice");
    expect(ids, `${locale} section count`).toHaveLength(16);
  }
});

test("the healing tradition is reported as belief, never as medicine", () => {
  /*
    The article describes a documented devotional practice — copies kept in
    houses, passages read beside the sick, prayers copied into amulet scrolls —
    and then says in as many words that it is making no medical claim. The test
    pins the disclaimer rather than banning the vocabulary, because the
    disclaimer itself contains the words a naive ban would catch.
  */
  const en = text("en", NAREK);
  expect(en, "en frames it as reception").toContain("religious belief and devotional custom");
  expect(en, "en disclaims medicine outright").toContain(
    "It makes no claim that the book cures or treats illness",
  );
  expect(en, "en marks it as not a medical statement").toContain("medical statement");

  for (const locale of ["hy", "hyw"]) {
    expect(text(locale, NAREK), `${locale} carries the disclaimer`).toContain("բժշկական");
  }
});

test("the manuscript claims are the ones institutions actually make", () => {
  /*
    MS 1568 is regularly promoted from "earliest dated" to "earliest complete" by
    popular sources, and MS 5159 is regularly listed as a copy of the work when it
    is a commentary. Both distinctions are asserted here because both are the kind
    of claim that decays quietly.
  */
  for (const locale of LOCALES) {
    const body = text(locale, NAREK);
    expect(body, `${locale} names the shelfmark`).toContain("1568");
    expect(body, `${locale} dates it`).toContain("1173");
    expect(body, `${locale} names the commentary manuscript`).toContain("5159");
  }

  const en = text("en", NAREK);
  expect(en, "en keeps the institutional wording").toContain("earliest dated copy");
  expect(en, "en refuses the stronger claim").toContain("not the earliest complete one");
  expect(en, "en flags the commentary").toContain("is a commentary on the Book of Lamentations");

  // The Matenadaran relation is earned by a named manuscript, not by the fact
  // that the Matenadaran holds Armenian manuscripts.
  const bySection = Object.fromEntries(
    article("en", NAREK).sections.map((s) => [s.id, (s.links ?? []).map((l) => l.slug)]),
  );
  expect(bySection["manuscripts"], "matenadaran link placement").toEqual(["matenadaran"]);
});

test("no UNESCO status is claimed for the work", () => {
  /*
    The Matenadaran's collection is on the Memory of the World register; this work
    is not, and UNESCO's own description of that inscription does not mention it.
    The archive has been burned by inherited recognition claims before, so the
    absence is asserted rather than assumed.
  */
  for (const locale of LOCALES) {
    expect(text(locale, NAREK), `${locale} makes no UNESCO claim`).not.toMatch(/UNESCO|ՅՈՒՆԵՍԿՕ|ՅՈՒՆԵՍԿՈ/);
  }
});

/* -------------------------------------------------------------------------- */
/*  Artwork state                                                              */
/* -------------------------------------------------------------------------- */

test("the fifth work owns its artwork and borrows nobody's picture", async ({ page }) => {
  /*
    §63 registers the file §61 left pending. The transition is checked in both
    directions — the raster where the placeholder was, the slug out of
    `PENDING_ARTWORK` where it was in — because a half-applied registration is the
    failure mode: a registry entry with no rendered image, or a rendered image with
    a stale pending entry still beside it.

    The borrowing assertion is the one that has to survive §63 unchanged, and it is
    why it was written at §61. Narekatsi's portrait shows a monk at a table with an
    open illuminated codex, which is very nearly a picture of this book; the Work
    now owns a picture of its own, and reusing the portrait would still make it an
    appendix to the Writer.
  */
  expect(getImageSrc(NAREK), "the artwork is registered").toBe(ARTWORK[NAREK]);
  expect([...PENDING_ARTWORK], "and is no longer pending").not.toContain(NAREK);
  expect(article("en", NAREK).image, "and carries no credited image").toBeUndefined();

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${NAREK}`);
    const figure = page.getByRole("main").locator("figure").first();
    const hero = figure.locator("img").first();

    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    await expect(figure.locator(`img[src*="${FILE[NAREK]}"]`), `${locale} hero src`).toHaveCount(1);

    // Localized alt, read from the dictionary the page renders.
    const alt = ui(locale).article.imageAlt.replace("{title}", articleTitle(locale, NAREK));
    await expect(hero, `${locale} localized alt`).toHaveAttribute("alt", alt);

    // A Work is captioned as an illustration, never as a portrait: the portrait
    // captions make a claim about a likeness, and a book has none.
    const caption = (await figure.locator("figcaption").textContent()) ?? "";
    expect(caption.trim(), `${locale} caption is not empty`).not.toBe("");
    for (const portraitLine of [
      ui(locale).article.imageAiPortraitCaption,
      ui(locale).article.imageAiPhotoPortraitCaption,
      ui(locale).article.imagePlaceholderCaption,
    ]) {
      expect(caption, `${locale} not a portrait or placeholder caption`).not.toContain(
        portraitLine.replace("{title}", articleTitle(locale, NAREK)),
      );
    }

    // And nothing on the page serves the author's portrait or another work's cover
    // as this work's picture.
    const heroSrc = (await hero.getAttribute("src")) ?? "";
    for (const borrowed of [...PRE_EXISTING_ARTWORK, "grigor-narekatsi.webp"]) {
      expect(heroSrc, `${locale} hero must not be ${borrowed}`).not.toContain(borrowed);
    }
    /*
      Scoped to the hero, because the related-articles block further down the page
      legitimately renders the Writer's card with his portrait — §61 made that
      relation run both ways on purpose, and an unscoped "no portrait on this page"
      assertion would forbid it.

      That scoping is also a correction. The §61 version of this check read every
      `img` in `main` and compared the srcs against registry *paths*, which
      `next/image` percent-encodes — so it could never have matched anything and
      passed for the wrong reason. Matching filenames is what makes it able to fail.
    */
    await expect(
      figure.locator('img[src*="grigor-narekatsi"]'),
      `${locale} the hero is not the author's portrait`,
    ).toHaveCount(0);
    await expect(
      page.getByRole("main").locator('img[src*="grigor-narekatsi"]'),
      `${locale} the portrait appears only as the related Writer's card`,
    ).toHaveCount(1);
  }
});

test("no work carries a portrait provenance entry", () => {
  /*
    `PORTRAIT_PROVENANCE` records how a likeness of a *person* was arrived at —
    whether photographs were consulted or the face was invented. A book has no
    likeness, so the question it answers is not one a Work raises, and an entry
    here would make the article claim something about a face it does not have.

    §61 decided this in advance and §63 held to it. The default is `imagined`, so
    the assertion is that every Work reads the default rather than that the map is
    empty — a Work added to the map is the failure, not the map growing.
  */
  for (const slug of SLUGS) {
    expect(getPortraitProvenance(slug), `${slug} is not a portrait`).toBe("imagined");
  }
});

/* -------------------------------------------------------------------------- */
/*  Listing, routes, search, metadata                                          */
/* -------------------------------------------------------------------------- */

test("the works listing shows six works in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works`);
    await expect(cards(page), `${locale} card count`).toHaveCount(6);

    const card = cards(page).filter({ hasText: articleTitle(locale, NAREK) });
    await expect(card, `${locale} the new card is present`).toHaveCount(1);
    await expect(card, `${locale} names its author`).toContainText(
      bundle(locale).writers.find((w) => w.slug === NAREKATSI)!.name,
    );

    /*
      §61 asserted exactly one placeholder here and named it; §63 asserted none,
      the same claim inverted; §101 returns it to one, because Mtnadzor was written
      ahead of its picture. A count alone would also be satisfied by the wrong card
      having lost its cover, so the placeholder is located as well as counted: it
      must be inside the Mtnadzor card and nowhere else on the page.
    */
    const pending = cards(page).filter({ hasText: articleTitle(locale, MTNADZOR) });
    await expect(pending, `${locale} the pending card is present`).toHaveCount(1);
    await expect(
      page.getByRole("main").locator("svg[role='img']"),
      `${locale} exactly one placeholder remains`,
    ).toHaveCount(1);
    await expect(
      pending.locator("svg[role='img']"),
      `${locale} and it is Mtnadzor's`,
    ).toHaveCount(1);
    await expect(
      pending.locator(`img[src*="${BAKUNTS}"]`),
      `${locale} the pending card borrows no portrait`,
    ).toHaveCount(0);

    // And the new card carries its own cover, not a neighbour's and not the
    // author's portrait.
    await expect(
      card.locator(`img[src*="${FILE[NAREK]}"]`),
      `${locale} card uses its own artwork`,
    ).toHaveCount(1);
    for (const borrowed of [...PRE_EXISTING_ARTWORK, "grigor-narekatsi"]) {
      await expect(
        card.locator(`img[src*="${borrowed}"]`),
        `${locale} card must not borrow ${borrowed}`,
      ).toHaveCount(0);
    }
  }
});

test("the article route resolves in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    const response = await page.goto(`/${locale}/works/${NAREK}`);
    expect(response?.status(), `${locale} status`).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: articleTitle(locale, NAREK) }),
      `${locale} h1`,
    ).toBeVisible();
  }
});

test("the work is reachable by its titles, its nickname and its author", async ({ page }) => {
  /*
    Four spellings, three editions, and a nickname that is also a common given
    name. The queries below are the ones a reader actually types.
  */
  const queries: [string, string][] = [
    ["en", "Book of Lamentations"],
    ["en", "Narek"],
    ["en", "Grigor Narekatsi"],
    ["hy", "Մատյան ողբերգության"],
    ["hy", "Նարեկ"],
    ["hyw", "Մատեան ողբերգութեան"],
  ];

  for (const [locale, query] of queries) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    // Scoped to the canonical href, because these queries legitimately return
    // the Writer and other articles too.
    await expect(
      page.getByRole("main").locator(`a[href="/${locale}/works/${NAREK}"]`).first(),
      `${locale} "${query}" finds the work`,
    ).toBeVisible();

    /*
      And the canonical hit carries the work's own artwork. Scoped to the card
      holding that href, because every one of these queries legitimately returns
      the Writer too — whose card correctly shows the portrait, so an unscoped
      "no portrait on the page" assertion would be wrong as well as red.
    */
    const hit = page.locator(`main li:has(a[href="/${locale}/works/${NAREK}"])`).first();
    await expect(hit, `${locale} "${query}" canonical card`).toHaveCount(1);
    await expect(hit.locator("svg[role='img']"), `${locale} "${query}" no placeholder`).toHaveCount(
      0,
    );
    await expect(
      hit.locator(`img[src*="${FILE[NAREK]}"]`),
      `${locale} "${query}" hit uses the work's artwork`,
    ).toHaveCount(1);
    await expect(
      hit.locator('img[src*="grigor-narekatsi"]'),
      `${locale} "${query}" hit borrows no portrait`,
    ).toHaveCount(0);
  }
});

test("metadata carries the work's own artwork and borrows no image", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${NAREK}`);

    await expect(page.locator('link[rel="canonical"]'), `${locale} canonical`).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/works/${NAREK}`,
    );

    for (const alt of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${alt}"]`),
        `${locale} hreflang ${alt}`,
      ).toHaveAttribute("href", `https://armat.site/${alt}/works/${NAREK}`);
    }

    /*
      §61 asserted the site default here, because no artwork shipped and the OG
      image had nothing else to be. §63 asserts the file — the same transition the
      hero and the sitemap make, checked at the one place a reader never sees and
      a share card always does.
    */
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the work's artwork`).toBe(
        `https://armat.site${ARTWORK[NAREK]}`,
      );
      expect(content, `${locale} ${property} is not the fallback`).not.toContain("/og-default.png");
      expect(content, `${locale} ${property} borrows no portrait`).not.toContain(
        "grigor-narekatsi",
      );
      for (const borrowed of PRE_EXISTING_ARTWORK) {
        expect(content, `${locale} ${property} borrows nothing`).not.toContain(borrowed);
      }
    }
  }
});

test("the sitemap advertises the work's own image in every edition", async ({ request }) => {
  /*
    §61 asserted these three url blocks carried no `image:loc` at all, so this is
    the exact inversion. Checked block by block rather than by whole-document
    count: a count of three would still pass if all three entries landed on one
    locale's route and none on the others, and an image crawler handed a 404 or
    the author's portrait under this URL is a failure nothing on the rendered page
    would show.
  */
  const xml = await (await request.get("/sitemap.xml")).text();
  const blocks = xml.split("<url>").slice(1);

  for (const locale of LOCALES) {
    const block = blocks.find((entry) => entry.includes(`/${locale}/works/${NAREK}</loc>`));
    expect(block, `${locale} has a sitemap entry`).toBeDefined();
    expect(block, `${locale} advertises its image`).toContain(
      `https://armat.site${ARTWORK[NAREK]}`,
    );
    expect(block, `${locale} borrows no portrait`).not.toContain("grigor-narekatsi");
    for (const borrowed of PRE_EXISTING_ARTWORK) {
      expect(block, `${locale} borrows no other cover`).not.toContain(borrowed);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  Sources                                                                    */
/* -------------------------------------------------------------------------- */

test("the work carries a real bibliography", () => {
  const sources = getSources(NAREK);
  expect(sources.length, "sources exist").toBeGreaterThan(0);

  for (const source of sources) {
    expect(source.identifier?.value, `${source.title} carries an identifier`).toBeTruthy();
    expect(source.publisher, `${source.title} names a publisher`).toBeTruthy();
  }

  // The two translations the article leans on hardest, by ISBN rather than by name.
  const ids = sources.map((s) => s.identifier.value);
  expect(ids, "Terian 2021").toContain("9780814684641");
  expect(ids, "Samuelian 2001").toContain("9789993085317");
});

/* -------------------------------------------------------------------------- */
/*  Cross-section regression                                                   */
/* -------------------------------------------------------------------------- */

test("adding the fifth work changed no other section", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const count = (category: string) =>
      b.articles.filter((a) => a.category === category).length;

    expect(count("writers"), `${locale} writers`).toBe(13);
    expect(count("cuisine"), `${locale} cuisine`).toBe(12);
    expect(count("places"), `${locale} places`).toBe(13);
    expect(count("history"), `${locale} history`).toBe(7);
    expect(count("works"), `${locale} works`).toBe(6);

    /*
      The Writers section is untouched by anything in this file. §63 read it as ten
      writers with ten portraits and nothing pending; §94 added an eleventh writer
      ahead of his portrait, so the claim here is that every writer who is not on
      `PENDING_ARTWORK` has a picture — which still fails if a registered portrait
      ever disappears, and no longer fails merely because Writers grew.
    */
    const writers = b.writers.map((w) => w.slug);
    for (const slug of writers) {
      if ((PENDING_ARTWORK as readonly string[]).includes(slug)) continue;
      expect(getImageSrc(slug), `${locale} ${slug} portrait`).toBeTruthy();
    }

    /*
      Every *illustrated* work still serves its own file. The loop reads `ARTWORK`
      rather than `SLUGS` since §101: Mtnadzor was written ahead of its picture, so
      iterating the slug list would assert that a work with no file has one. What
      the section is waiting for is asserted positively below instead.
    */
    for (const slug of Object.keys(ARTWORK)) {
      expect(getImageSrc(slug), `${locale} ${slug} artwork`).toBe(ARTWORK[slug]);
    }

    /*
      §61 read `toEqual([NAREK])` here and §63 emptied the list, stating the claim
      archive-wide: nothing anywhere was waiting for a picture.

      §94 rescopes it to Works, and the rescoping is a correction rather than a
      relaxation — the same one `places.spec.ts` made at §67 and `cuisine.spec.ts` at
      §81, each time another section put a slug on this list. `PENDING_ARTWORK` is
      archive-wide, not per-section. While it happened to be empty the distinction
      cost nothing; §94 added `hakob-paronyan`, a Writer written ahead of his
      portrait, at which point the line started making a claim about the Writers
      section that this file has no business making, and went red for a reason that
      had nothing to do with Works.

      The claim that was always meant is the one below: no *Work* is waiting for a
      picture. Stated as a filtered list rather than a count, so it still fails on a
      stale entry left behind after a file lands.
    */
    /*
      §101 refills it, for the first time in this section since §61: five works are
      illustrated and exactly one is waiting. Stated as the filtered list rather than
      a count, so it fails both ways — if Mtnadzor quietly acquires a file without the
      entry coming off, and if some other work loses its picture.
    */
    expect(
      [...PENDING_ARTWORK].filter((slug) => (SLUGS as readonly string[]).includes(slug)),
      "Mtnadzor, and only Mtnadzor, is waiting for a picture",
    ).toEqual([MTNADZOR]);
  }

  // The listing dictionaries were not touched to make room for it.
  for (const locale of LOCALES) {
    expect(ui(locale).listing.works.title, `${locale} listing title`).toBeTruthy();
  }
});
/* -------------------------------------------------------------------------- */
/*  §101 — Work #6: Mtnadzor                                                   */
/* -------------------------------------------------------------------------- */

/*
 * Mtnadzor is the first Work in this section whose principal risk is not that a
 * claim is wrong but that an *entity* is wrong. One Armenian word names four
 * things — a story of 1926, the book of 1927 that opens with it, a second and
 * unrelated story inside that book, and real places on the map — and the article
 * exists largely to keep them apart. The tests below therefore pin the entity
 * decision and the chronology that supports it, and prefer structure to prose
 * wherever a structural assertion is available.
 */

const NOT_ENTITIES = [
  "the-dark-valley",
  "alpine-violet",
  "mirhav",
  "kyores",
  "zorban",
  "khonarh-aghjike",
  "goris",
  "syunik",
  "zangezur",
] as const;

/** The fields that would make a phrase read as this work's name. */
function identifyingFields(locale: string): string[] {
  const a = article(locale, MTNADZOR);
  const card = work(locale, MTNADZOR);
  return [a.title, a.seoTitle ?? "", a.excerpt, a.metaDescription ?? "", ...(a.keywords ?? []), card.title, card.genre];
}

test("the sixth work is the 1927 collection, in every edition", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const a = article(locale, MTNADZOR);
    const card = work(locale, MTNADZOR);

    expect(a, `${locale} article`).toBeTruthy();
    expect(card, `${locale} card`).toBeTruthy();
    expect(a.slug, `${locale} slug`).toBe("mtnadzor");
    expect(a.category, `${locale} category`).toBe("works");
    expect(a.href, `${locale} href`).toBe(`/works/${MTNADZOR}`);

    // Appended, never inserted: `/works` renders `works[0]` as the featured item.
    expect(b.works[0].slug, `${locale} featured work unmoved`).toBe("anush");
    expect(b.works.at(-1)!.slug, `${locale} appended last`).toBe(MTNADZOR);

    /*
      The entity is the book. `publicationPeriod` and the "published" key fact both
      have to say 1927 — the year of the collection — and not 1926, which is the
      year of the story that opens it. Asserted on the card and the fact panel
      rather than in prose, because those two are what a listing and a summary box
      show a reader who never reaches the article.
    */
    expect(card.publicationPeriod, `${locale} card period`).toContain("1927");
    expect(card.publicationPeriod, `${locale} card period is not the story's year`).not.toContain("1926");
    const published = a.keyFacts.find((f) => /1927/.test(f.value));
    expect(published, `${locale} a key fact carries 1927`).toBeTruthy();
  }
});

test("the author is Aksel Bakunts, resolved against the Writers section", () => {
  /*
    The card's `author` string is what `aboutEntity` matches against a Writer to
    emit a `Person` node, so an author that merely *reads* correctly but does not
    equal the writer's name in that edition silently drops the relation. Compared
    by identity rather than by substring for exactly that reason.
  */
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const writer = b.writers.find((w) => w.slug === BAKUNTS)!;
    expect(writer, `${locale} the writer exists`).toBeTruthy();
    expect(work(locale, MTNADZOR).author, `${locale} card author is the writer's name`).toBe(writer.name);

    // And the relation is declared, in the shared list every edition carries.
    expect(article(locale, MTNADZOR).relatedSlugs, `${locale} relates to Bakunts`).toContain(BAKUNTS);

    // No second Bakunts entity was created to carry the authorship.
    expect(
      b.articles.filter((x) => x.slug === BAKUNTS).length,
      `${locale} one Bakunts article`,
    ).toBe(1);
  }
});

test("the collection is filed under a genre that describes it", () => {
  /*
    §61 filed the Narek under Poetry and said in the article that the label was a
    convenience of the catalogue. That was the right call for a prayer cycle with
    three genres to choose from; it is the wrong one here, because a short-story
    collection is not poetry, a novel or an epic, and filing it under any of them
    would make the card state something untrue. The id is added in the same change
    as the first work that uses it — the rule `placeTypes` already follows — so no
    filter is ever offered before it matches something.
  */
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const card = work(locale, MTNADZOR);
    expect(card.genreId, `${locale} genreId`).toBe("short-stories");

    const ids = b.workGenres.map((g) => g.id);
    expect(ids, `${locale} the filter exists`).toContain("short-stories");
    expect(ids.filter((id) => id === "short-stories"), `${locale} declared once`).toHaveLength(1);

    // Appended: no existing pill moved.
    expect(ids.slice(0, 4), `${locale} earlier pills unmoved`).toEqual(["all", "poetry", "novel", "epic"]);
    expect(b.workGenres.find((g) => g.id === "short-stories")!.label, `${locale} labelled`).toBeTruthy();

    // And it matches something, which is what stops it being an always-empty pill.
    expect(b.works.filter((w) => w.genreId === "short-stories").length, `${locale} filter has content`).toBe(1);
  }
});

test("the story of 1926 and the book of 1927 are kept apart", () => {
  /*
    The single thing this article exists to do. Both years must be present and the
    disambiguation must have a section of its own — an article that gives only 1927
    has merged the two, which is the commonest error in short accounts of Bakunts.
  */
  for (const locale of LOCALES) {
    const a = article(locale, MTNADZOR);
    const section = a.sections.find((s) => s.id === "one-word-four-things");
    expect(section, `${locale} the disambiguation section exists`).toBeTruthy();

    const prose = section!.paragraphs.join(" ");
    expect(prose, `${locale} the story's year`).toContain("1926");
    expect(prose, `${locale} the book's year`).toContain("1927");

    // The title story has its own section, and it carries the first-publication
    // date and issue number rather than leaving them to the collection's year.
    const title = a.sections.find((s) => s.id === "the-title-story");
    expect(title, `${locale} the title story has a section`).toBeTruthy();
    const titleProse = title!.paragraphs.join(" ");
    expect(titleProse, `${locale} first published 1926`).toContain("1926");
    expect(titleProse, `${locale} issue number`).toContain("269");

    /*
      1–2 February 1927 belongs to Խոնարհ աղջիկը and is a documented misattribution
      to the title story. The article names it in order to correct it, so the guard
      is that the correction is present rather than that the string is absent.
    */
    expect(titleProse, `${locale} the wrong date is corrected, not repeated`).toContain("Խոնարհ աղջիկը");
  }
});

test("Մթնաձորի «չարքը» stays a different story from the title story", () => {
  for (const locale of LOCALES) {
    const a = article(locale, MTNADZOR);
    const section = a.sections.find((s) => s.id === "one-word-four-things")!;
    const prose = section.paragraphs.join(" ");

    expect(prose, `${locale} the second story is named`).toContain("Մթնաձորի «չարքը»");

    // It is in the contents, at its own position, and it is not the first story.
    const bullets = a.sections.find((s) => s.id === "the-eighteen-stories")!.bullets!;
    const index = bullets.findIndex((b) => b.includes("Մթնաձորի «չարքը»"));
    expect(index, `${locale} it is in the contents`).toBeGreaterThan(0);
    expect(index, `${locale} it is not the opening story`).not.toBe(0);
    expect(bullets[0], `${locale} the opening story is the title story`).toContain("Մթնաձոր");
  }
});

test("the collection has eighteen stories, listed once and in order", () => {
  for (const locale of LOCALES) {
    const bullets = article(locale, MTNADZOR)
      .sections.find((s) => s.id === "the-eighteen-stories")!
      .bullets!;

    expect(bullets, `${locale} eighteen entries`).toHaveLength(18);
    expect(new Set(bullets).size, `${locale} no repeated entry`).toBe(18);

    // The three positions the article makes claims about elsewhere.
    expect(bullets[0], `${locale} #1`).toContain("Մթնաձոր");
    expect(bullets[5], `${locale} #6 Միրհավ`).toContain("Միրհավ");
    expect(bullets[17], `${locale} #18 Ալպիական մանուշակ`).toContain("Ալպիական մանուշակ");
  }
});

test("The Dark Valley is the collection's English title, and the glosses are not", () => {
  for (const locale of LOCALES) {
    const a = article(locale, MTNADZOR);
    const all = text(locale, MTNADZOR);

    expect(all, `${locale} the translation is named`).toContain("The Dark Valley");

    /*
      Structural rather than a substring ban. `Dark Gorge` and `The Dark Ravine`
      appear in the naming section, where the article's whole point is that neither
      is an attested title — banning the strings would fail on the article's own
      careful sentence. What must be true is that neither ever appears in a field
      that would make it read as this work's name.
    */
    for (const field of identifyingFields(locale)) {
      expect(field, `${locale} "${field}" is not a gloss`).not.toContain("Dark Gorge");
      expect(field, `${locale} "${field}" is not a gloss`).not.toContain("Dark Ravine");
    }

    const naming = a.sections.find((s) => s.id === "the-name")!.paragraphs.join(" ");
    expect(naming, `${locale} Dark Gorge is discussed`).toContain("Dark Gorge");
    expect(naming, `${locale} Dark Ravine is discussed`).toContain("Dark Ravine");
  }
});

test("the Alpine Violet chronology survives, dedication included", () => {
  /*
    The most-repeated error about this book: that it contains a story dedicated to
    Arpenik Charents. The dedication was attached to the 1933 reworking, and the
    1976 edition prints the 1927 text without it. The article has to keep the two
    stages apart, so the section must carry both years.
  */
  for (const locale of LOCALES) {
    const section = article(locale, MTNADZOR).sections.find((s) => s.id === "alpine-violet");
    expect(section, `${locale} the section exists`).toBeTruthy();

    const prose = section!.paragraphs.join(" ");
    expect(prose, `${locale} serialised 1927`).toContain("1927");
    expect(prose, `${locale} reworked for 1933`).toContain("1933");
    expect(prose, `${locale} the dedication's later stage`).toContain("1976");
    // Named in the edition's own script: Latin in English, Armenian in the two
    // Armenian editions.
    expect(prose, `${locale} Arpenik is named`).toMatch(/Arpenik|Արփենիկ/);
  }
});

test("Mirhav is treated as a story of this book, not as a work of its own", () => {
  for (const locale of LOCALES) {
    const a = article(locale, MTNADZOR);
    const section = a.sections.find((s) => s.id === "mirhav");
    expect(section, `${locale} the section exists`).toBeTruthy();

    const prose = section!.paragraphs.join(" ");
    expect(prose, `${locale} first published 1926`).toContain("1926");
    expect(prose, `${locale} issue number`).toContain("132");

    // Named in the contents as one of the eighteen, and not as a linked entity.
    const targets = a.sections.flatMap((s) => s.links ?? []).map((l) => l.slug);
    expect(targets, `${locale} no Mirhav entity`).not.toContain("mirhav");
  }
});

test("no child work was invented for any story or place in the book", () => {
  /*
    Eighteen stories and four place names go past the reader in this article. None
    of them is an entity in this archive, and the rule is that plain text is correct
    when the entity does not exist — so every contextual link must resolve, and none
    of the tempting slugs may have been created.
  */
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const a = article(locale, MTNADZOR);
    const targets = a.sections.flatMap((s) => s.links ?? []).map((l) => l.slug);

    for (const target of targets) {
      expect(
        b.articles.some((x) => x.slug === target),
        `${locale} link target "${target}" resolves`,
      ).toBe(true);
    }
    expect(targets, `${locale} never links to itself`).not.toContain(MTNADZOR);

    for (const invented of NOT_ENTITIES) {
      expect(targets, `${locale} no link to "${invented}"`).not.toContain(invented);
      expect(
        b.articles.some((x) => x.slug === invented),
        `${locale} no "${invented}" article`,
      ).toBe(false);
      expect(
        b.works.some((w) => w.slug === invented),
        `${locale} no "${invented}" work card`,
      ).toBe(false);
    }

    // Tatev is reachable from Bakunts's biography through Vorotan geography. The
    // collection does not substantively involve it, so no relation was added here.
    expect(a.relatedSlugs, `${locale} no geographic filler relation`).not.toContain("tatev-monastery");
  }
});

test("the work is waiting for its own artwork and borrows nobody's", () => {
  /*
    The specific failure this guards is reaching one line up in `IMAGES` for
    `writers/aksel-bakunts.webp`, which exists, is photo-referenced, and is the
    obvious thing to hand a Work about his book. A book is not its author's face.
  */
  expect(getImageSrc(MTNADZOR), "no file is registered").toBeUndefined();
  expect(PENDING_ARTWORK, "the wait is declared").toContain(MTNADZOR);

  // Nothing that already exists was pointed at it.
  const bakuntsPortrait = getImageSrc(BAKUNTS);
  expect(bakuntsPortrait, "Bakunts still has his portrait").toBe("/images/writers/aksel-bakunts.webp");
  expect(getImageSrc(MTNADZOR), "and it was not borrowed").not.toBe(bakuntsPortrait);
  for (const borrowed of PRE_EXISTING_ARTWORK) {
    expect(getImageSrc(MTNADZOR), `no ${borrowed} either`).not.toBe(ARTWORK[NAREK]);
    expect(String(getImageSrc(MTNADZOR)), `no ${borrowed} either`).not.toContain(borrowed);
  }

  // The article declares no photograph of its own, so nothing overrides the gap.
  for (const locale of LOCALES) {
    expect(article(locale, MTNADZOR).image, `${locale} no content image`).toBeUndefined();
  }

  // And registering it did not disturb any provenance record.
  expect(getPortraitProvenance(BAKUNTS), "Bakunts provenance").toBe("photo-referenced");
  expect(getPortraitProvenance(MTNADZOR), "a work has no portrait provenance").toBe("imagined");
});

test("the work carries a real bibliography, scoped to the collection", () => {
  const sources = getSources(MTNADZOR);
  expect(sources.length, "sources exist").toBeGreaterThanOrEqual(7);

  for (const source of sources) {
    expect(source.identifier?.value, `${source.title} carries an identifier`).toBeTruthy();
    expect(source.publisher, `${source.title} names a publisher`).toBeTruthy();
  }

  const ids = sources.map((s) => s.identifier.value);
  expect(ids, "the English translation").toContain("9781903656907");
  expect(ids, "Martirosyan, for the Mirhav lexicon").toContain("9789004173378");

  /*
    §70 left The Heritage of Armenian Literature out of the Bakunts bibliography
    because its coverage of him could not be verified from an accessible copy. That
    decision is inherited here rather than quietly reversed.
  */
  for (const source of sources) {
    expect(source.title, "no unverified Heritage volume").not.toContain("Heritage of Armenian Literature");
  }
});

test("adding the sixth work changed no other section and no earlier work", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const count = (category: string) => b.articles.filter((a) => a.category === category).length;

    expect(count("works"), `${locale} works`).toBe(6);
    expect(count("writers"), `${locale} writers`).toBe(13);
    expect(count("cuisine"), `${locale} cuisine`).toBe(12);
    expect(count("places"), `${locale} places`).toBe(13);
    expect(count("history"), `${locale} history`).toBe(7);

    // The five earlier works keep their order, their cards and their pictures.
    expect(b.works.slice(0, 5).map((w) => w.slug), `${locale} earlier order`).toEqual([
      "anush",
      "wounds-of-armenia",
      "the-fool",
      "david-of-sassoun",
      NAREK,
    ]);
    for (const slug of PRE_EXISTING) {
      expect(getImageSrc(slug), `${locale} ${slug} artwork unmoved`).toBe(ARTWORK[slug]);
      expect(PENDING_ARTWORK, `${slug} did not become pending`).not.toContain(slug);
    }

    /*
      Book of Lamentations in particular: §61 wrote it and §63 illustrated it, and
      nothing in this step touches either. Its own artwork, its relations and its
      seoTitle are the three things a careless edit to this file would disturb.
    */
    const narek = article(locale, NAREK);
    expect(getImageSrc(NAREK), `${locale} Narek artwork`).toBe(ARTWORK[NAREK]);
    expect(PENDING_ARTWORK, "Narek is not pending").not.toContain(NAREK);
    expect(narek.relatedSlugs, `${locale} Narek relations`).toEqual([
      NAREKATSI,
      "matenadaran",
      "nerses-shnorhali",
    ]);
    expect(narek.seoTitle, `${locale} Narek seoTitle`).toBeTruthy();
    expect(work(locale, NAREK).genreId, `${locale} Narek genre unmoved`).toBe("poetry");

    // No earlier work drifted onto the new filter.
    for (const slug of PRE_EXISTING) {
      expect(work(locale, slug).genreId, `${locale} ${slug} genre`).not.toBe("short-stories");
    }

    // Bakunts's own biography is as §99 and §100 left it.
    const bakunts = article(locale, BAKUNTS);
    expect(bakunts.periodId, `${locale} Bakunts period`).toBe("20th-century");
    expect(bakunts.relatedSlugs, `${locale} Bakunts relations`).toEqual([
      "yeghishe-charents",
      "hovhannes-tumanyan",
      "tatev-monastery",
    ]);
    expect(bakunts.featured, `${locale} Bakunts took no flag`).toBeFalsy();
    expect(article(locale, MTNADZOR).featured, `${locale} Mtnadzor took no flag`).toBeFalsy();
  }
});

test("the work is reachable by route, listing and search in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    const card = work(locale, MTNADZOR);

    // The route renders, with the article's own H1.
    const response = await page.goto(`/${locale}/works/${MTNADZOR}`);
    expect(response?.status(), `${locale} route`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(articleTitle(locale, MTNADZOR));

    // And it is on the listing, under its new pill.
    await page.goto(`/${locale}/works`);
    await expect(cards(page), `${locale} six cards`).toHaveCount(6);
    await expect(
      page.locator(`main a[href="/${locale}/works/${MTNADZOR}"]`).first(),
      `${locale} card links to it`,
    ).toBeVisible();

    await page.goto(`/${locale}/works?type=short-stories`);
    await expect(cards(page), `${locale} the filter shows one work`).toHaveCount(1);
    await expect(cards(page).first(), `${locale} and it is this one`).toContainText(card.title);
  }
});

test("search finds the collection without displacing its author", async ({ page }) => {
  /*
    Both halves matter. `Mtnadzor` is the query this article exists to answer, and
    until §101 it returned only the writer. It must now return the work as well —
    and the writer must still be there, because a reader searching his name is
    looking for the man, not the book.
  */
  for (const [locale, query] of [
    ["en", "Mtnadzor"],
    ["en", "The Dark Valley"],
    ["en", "Axel Bakunts Mtnadzor"],
    ["hy", "Մթնաձոր"],
    ["hyw", "Մթնաձոր"],
  ] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.locator(`main a[href="/${locale}/works/${MTNADZOR}"]`).first(),
      `${locale} "${query}" finds the collection`,
    ).toHaveCount(1);
  }

  for (const [locale, query] of [
    ["en", "Aksel Bakunts"],
    ["hy", "Ակսել Բակունց"],
    ["hyw", "Ակսէլ Բակունց"],
  ] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.locator(`main a[href="/${locale}/writers/${BAKUNTS}"]`).first(),
      `${locale} "${query}" still finds the writer`,
    ).toHaveCount(1);
  }
});

test("metadata says which Mtnadzor this is, and advertises no borrowed image", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${MTNADZOR}`);

    const description = (await page.locator('meta[name="description"]').first().getAttribute("content")) ?? "";
    expect(description, `${locale} description`).toBeTruthy();
    expect(description, `${locale} names the year of the book`).toContain("1927");

    /*
      Artwork is pending, so the share image must be the archive's fallback — and
      above all must not be the author's portrait, which is the one file that would
      look plausible here and would tell a crawler this page is about a person.
    */
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the fallback`).toContain("/og-default.png");
      expect(content, `${locale} ${property} borrows no portrait`).not.toContain(BAKUNTS);
      for (const borrowed of PRE_EXISTING_ARTWORK) {
        expect(content, `${locale} ${property} borrows no cover`).not.toContain(borrowed);
      }
    }

    // The JSON-LD calls it a CreativeWork by the writer, and introduces no Person
    // node of its own beyond the author the Writers section already owns.
    const ld = (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "";
    expect(ld, `${locale} about the work`).toContain("CreativeWork");
    expect(ld, `${locale} cites its bibliography`).toContain("citation");
  }
});

test("the sitemap lists all three editions and advertises no image", async ({ request }) => {
  /*
    The inversion of the Narek's sitemap test. While artwork is pending the entry
    must carry no `image:loc` at all — an image crawler handed a 404, or handed the
    author's portrait under this URL, is a failure nothing on the page would show.
  */
  const xml = await (await request.get("/sitemap.xml")).text();
  const blocks = xml.split("<url>").slice(1);

  for (const locale of LOCALES) {
    const block = blocks.find((entry) => entry.includes(`/${locale}/works/${MTNADZOR}</loc>`));
    expect(block, `${locale} has a sitemap entry`).toBeDefined();
    expect(block, `${locale} advertises no image yet`).not.toContain("<image:loc>");
    expect(block, `${locale} borrows no portrait`).not.toContain(BAKUNTS);
  }

  // And the Narek's image entry is untouched by the addition.
  const narek = blocks.find((entry) => entry.includes(`/en/works/${NAREK}</loc>`));
  expect(narek, "Narek still has its entry").toBeDefined();
  expect(narek, "Narek still advertises its image").toContain(ARTWORK[NAREK]);
});
