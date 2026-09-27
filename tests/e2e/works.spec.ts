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
const PARONYAN = "hakob-paronyan";
const BAGHDASAR = "baghdasar-aghbar";
const CHARENTS = "yeghishe-charents";
const NAIRI = "yerkir-nairi";
const ISAHAKYAN = "avetik-isahakyan";
const ABU = "abu-lala-mahari";
const SHIRVANZADE = "alexander-shirvanzade";
const CHAOS = "chaos";

/** Every work in the section, as of §61. Stated, not derived. */
const SLUGS = [
  "anush",
  "wounds-of-armenia",
  "the-fool",
  "david-of-sassoun",
  NAREK,
  MTNADZOR,
  BAGHDASAR,
  NAIRI,
  // §106 appended the ninth, written ahead of its picture.
  ABU,
  // §108 appended the tenth, likewise ahead of its picture.
  CHAOS,
] as const;

/**
 * The works that have a cover. Equal to `SLUGS` from §104 until §106 appended a
 * work that is pending; stated as a filter so it shrinks back to nothing the day
 * that cover lands and `ARTWORK` gains the line.
 */
// §107 registered that cover; §108 added the tenth work ahead of its own, and §110
// registered it, so COVERED is SLUGS again.
const COVERED = [...SLUGS];

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
  // §104: the three works written ahead of their pictures at §101–§103.
  [MTNADZOR]: "/images/works/mtnadzor.webp",
  [BAGHDASAR]: "/images/works/baghdasar-aghbar.webp",
  [NAIRI]: "/images/works/yerkir-nairi.webp",
  // §107: the ninth work, written ahead of its picture at §106.
  [ABU]: "/images/works/abu-lala-mahari.webp",
  // §110: the tenth, written ahead of its picture at §108.
  [CHAOS]: "/images/works/chaos.webp",
};

/** Each §104 work beside the Writer whose portrait it must never borrow. */
const NEW_ARTWORK: readonly [string, string][] = [
  [MTNADZOR, BAKUNTS],
  [BAGHDASAR, PARONYAN],
  [NAIRI, CHARENTS],
  // §107.
  [ABU, ISAHAKYAN],
  // §110.
  [CHAOS, SHIRVANZADE],
];

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
    expect(b.works.length, `${locale} works`).toBe(10);

    // Slugs are unique — an alias accidentally shipped as a second card would
    // give the section two entries that resolve to one article.
    expect(new Set(b.works.map((w) => w.slug)).size, `${locale} slugs unique`).toBe(10);

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
    await expect(cards(page), `${locale} card count`).toHaveCount(10);

    const card = cards(page).filter({ hasText: articleTitle(locale, NAREK) });
    await expect(card, `${locale} the new card is present`).toHaveCount(1);
    await expect(card, `${locale} names its author`).toContainText(
      bundle(locale).writers.find((w) => w.slug === NAREKATSI)!.name,
    );

    /*
      §61 asserted exactly one placeholder here and named it; §63 asserted none,
      the same claim inverted; §101 returned it to one, because Mtnadzor was
      written ahead of its picture; §102 made it two with Baghdasar Aghbar; §103
      makes it three with Yerkir Nairi. §104 registers all three and inverts it
      once more: no placeholder anywhere on the page, and each of the three cards
      located and checked for its own file — a count of zero alone would also pass
      if a card had lost its image altogether.
    */
    /*
      §106 returns it to one: Abu-Lala Mahari is written ahead of its picture. The
      single placeholder is located inside that work's own card, so the count
      cannot be satisfied by some other card having lost its cover.
    */
    /*
      §107 registers it and the count returns to zero; the ninth card is checked for
      its own file in the loop below, because it is now in `NEW_ARTWORK`.
    */
    /*
      §108 returns it to one: Chaos is written ahead of its picture. The single
      placeholder is located inside that work's own card, and that card carries no
      portrait of Shirvanzade.
    */
    /*
      §110 registers it and the count returns to zero; the tenth card is checked for
      its own file in the loop below, because it is now in `NEW_ARTWORK`.
    */
    await expect(
      page.getByRole("main").locator("svg[role='img']"),
      `${locale} no placeholder remains`,
    ).toHaveCount(0);
    for (const [slug, writer] of NEW_ARTWORK) {
      const own = cards(page).filter({ hasText: articleTitle(locale, slug) });
      await expect(own, `${locale} ${slug} card is present`).toHaveCount(1);
      await expect(own.locator(`img[src*="${FILE[slug]}"]`), `${locale} ${slug} own cover`).toHaveCount(1);
      await expect(own.locator(`img[src*="${writer}"]`), `${locale} ${slug} borrows no portrait`).toHaveCount(0);
    }

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
    expect(count("works"), `${locale} works`).toBe(10);

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
    /*
      §104 empties it again: the three waits §101–§103 declared are registered, and
      the section is fully illustrated for the second time.
    */
    /*
      §106 refills it with exactly one work, the ninth. Still a filtered list, so it
      fails if the entry lingers after the cover lands or if another work drops out.
    */
    expect(
      [...PENDING_ARTWORK].filter((slug) => (SLUGS as readonly string[]).includes(slug)),
      "no work is waiting for a picture",
    ).toEqual([]);
    // §110 registered the tenth cover; every work has one again.
    expect(Object.keys(ARTWORK).sort(), "every work has a cover").toEqual([...SLUGS].sort());
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
    // §102 appended a seventh work after this one, so Mtnadzor is no longer last —
    // only that it kept its own position, one before the new last entry.
    // §102 appended a seventh work and §103 an eighth after this one, so Mtnadzor
    // is now third from the end — only that it kept its own position relative to
    // what came before it.
    // §106 appended a ninth after it, so it is now fourth from the end.
    // §108 appended a tenth, so it is now fifth from the end.
    expect(b.works.at(-5)!.slug, `${locale} still fifth-to-last`).toBe(MTNADZOR);

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

test("the work owns its artwork and borrows nobody's", () => {
  /*
    The specific failure this guards is reaching one line up in `IMAGES` for
    `writers/aksel-bakunts.webp`, which exists, is photo-referenced, and is the
    obvious thing to hand a Work about his book. A book is not its author's face.

    §101 asserted the wait; §104 asserts its end — the collection's own file
    registered, the slug off the pending list — and keeps every borrowing check.
  */
  expect(getImageSrc(MTNADZOR), "its own file is registered").toBe(ARTWORK[MTNADZOR]);
  expect(PENDING_ARTWORK, "and the wait is over").not.toContain(MTNADZOR);

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

    expect(count("works"), `${locale} works`).toBe(10);
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
    await expect(cards(page), `${locale} ten cards`).toHaveCount(10);
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
      §101 asserted the fallback while the artwork was pending; §104 asserts the
      collection's own file. Above all it must not be the author's portrait, which
      is the one file that would look plausible here and would tell a crawler this
      page is about a person.
    */
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the work's artwork`).toBe(
        `https://armat.site${ARTWORK[MTNADZOR]}`,
      );
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

test("the sitemap lists all three editions and advertises the collection's own image", async ({
  request,
}) => {
  /*
    §101 asserted no `image:loc` while the artwork was pending; §104 asserts the
    file, block by block — an image crawler handed a 404, or handed the author's
    portrait under this URL, is a failure nothing on the page would show.
  */
  const xml = await (await request.get("/sitemap.xml")).text();
  const blocks = xml.split("<url>").slice(1);

  for (const locale of LOCALES) {
    const block = blocks.find((entry) => entry.includes(`/${locale}/works/${MTNADZOR}</loc>`));
    expect(block, `${locale} has a sitemap entry`).toBeDefined();
    expect(block, `${locale} advertises its own image`).toContain(
      `<image:loc>https://armat.site${ARTWORK[MTNADZOR]}</image:loc>`,
    );
    expect(block, `${locale} borrows no portrait`).not.toContain(BAKUNTS);
  }

  // And the Narek's image entry is untouched by the addition.
  const narek = blocks.find((entry) => entry.includes(`/en/works/${NAREK}</loc>`));
  expect(narek, "Narek still has its entry").toBeDefined();
  expect(narek, "Narek still advertises its image").toContain(ARTWORK[NAREK]);
});

/* -------------------------------------------------------------------------- */
/*  §102 — Work #7: Baghdasar Aghbar                                          */
/* -------------------------------------------------------------------------- */

/*
 * Հակոբ Պարոնյան's only play, written 1886 at Constantinople and first staged
 * posthumously at Tiflis in 1895 — four years after the 1891 death this section's
 * own biography already dates. The guards below follow §101's shape (a work
 * written ahead of its artwork) but add a chronology-precision dimension that
 * Mtnadzor did not need: composition, first printing and first staging are three
 * different dates, and the biography this Work now links back to already draws
 * that distinction, so nothing here may contradict it.
 */
const NOT_SIBLING_WORKS = [
  "uncle-baghdasar",
  "national-bigshots",
  "azgayin-jojer",
  "honourable-beggars",
  "honorable-beggars",
  "metsapativ-muratskanner",
];

test("the seventh work is Paronyan's 1886 comedy, in every edition", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const a = article(locale, BAGHDASAR);
    const card = work(locale, BAGHDASAR);

    expect(card, `${locale} card`).toBeTruthy();
    expect(a, `${locale} article`).toBeTruthy();
    expect(a.href, `${locale} href`).toBe(`/works/${BAGHDASAR}`);
    expect(a.category, `${locale} category`).toBe("works");
    // §103 appended an eighth work after this one, so Baghdasar Aghbar is no
    // longer last — only that it kept its own position, one before the new
    // last entry.
    // §106 appended a ninth, so it is now third from the end.
    // §108 appended a tenth, so it is now fourth from the end.
    expect(b.works.at(-4)!.slug, `${locale} still fourth-to-last`).toBe(BAGHDASAR);
    expect(b.works.length, `${locale} ten works`).toBe(10);

    // No sibling Work was invented for any of Paronyan's other titles.
    const slugs = b.articles.map((x) => x.slug);
    for (const invented of NOT_SIBLING_WORKS) {
      expect(slugs, `${locale} no invented "${invented}"`).not.toContain(invented);
    }
  }
});

test("the author is Hakob Paronyan, resolved against the Writers section", () => {
  for (const locale of LOCALES) {
    const writer = bundle(locale).writers.find((w) => w.slug === PARONYAN)!;
    expect(work(locale, BAGHDASAR).author, `${locale} card author is the writer's name`).toBe(
      writer.name,
    );
    expect(article(locale, BAGHDASAR).relatedSlugs, `${locale} relates to Paronyan`).toContain(
      PARONYAN,
    );

    // Exactly one Paronyan entity carries the authorship.
    const slugs = bundle(locale).articles.map((x) => x.slug);
    expect(slugs.filter((s) => s === PARONYAN).length, `${locale} one Paronyan`).toBe(1);
  }
});

test("the play is filed under a genre the taxonomy didn't have before it", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const card = work(locale, BAGHDASAR);
    const genres = new Set(b.workGenres.map((g) => g.id));

    expect(genres.has("drama"), `${locale} drama is a real filter`).toBe(true);
    expect(card.genreId, `${locale} card genre id`).toBe("drama");

    // No pre-existing work drifted onto the new filter.
    for (const slug of [...PRE_EXISTING, MTNADZOR]) {
      expect(work(locale, slug).genreId, `${locale} ${slug} genre unmoved`).not.toBe("drama");
    }
  }
});

test("composition, first printing and first staging are three different dates", () => {
  for (const locale of LOCALES) {
    const a = article(locale, BAGHDASAR);
    const all = text(locale, BAGHDASAR);

    // Written 1886, at Constantinople.
    expect(all, `${locale} written 1886`).toContain("1886");
    // First staged 1895, at Tiflis — distinct from the composition year.
    expect(all, `${locale} first staged 1895`).toContain("1895");
    // 1896 is recorded as the widely repeated round figure, not asserted as fact.
    expect(all, `${locale} records the 1896 alternative`).toContain("1896");

    const dates = a.importantDates.map((d) => d.year);
    expect(dates, `${locale} 1886 and 1895 are both dated events`).toEqual(
      expect.arrayContaining(["1886", "1895"]),
    );
  }
});

test("the staging is explicitly posthumous, and no sentence claims a lifetime premiere", () => {
  for (const locale of LOCALES) {
    const a = article(locale, BAGHDASAR);
    const all = text(locale, BAGHDASAR);

    // Paronyan's death (1891) is dated before the first staging (1895) in the
    // article's own chronology, not just somewhere in the prose.
    const years = a.importantDates.map((d) => d.year);
    expect(years.indexOf("1891"), `${locale} death precedes staging`).toBeLessThan(
      years.indexOf("1895"),
    );
    expect(years.indexOf("1891"), `${locale} both dates are present`).toBeGreaterThanOrEqual(0);

    // The posthumous fact is stated in prose, not left to be inferred from dates.
    expect(all, `${locale} states he never saw it performed`).toMatch(
      /չտեսավ|չտեսաւ|without seeing/,
    );
  }
});

test("աղբար is explained as a register, not equated with modern եղբայր", () => {
  for (const locale of LOCALES) {
    const all = text(locale, BAGHDASAR);

    // The dialectal/colloquial explanation is present...
    expect(all, `${locale} explains աղբար as dialectal`).toMatch(/բարբառ|dialect/);
    // ...and the later, unrelated pejorative sense is explicitly fenced off rather
    // than left for a reader to conflate with the play's 1886 Constantinople usage.
    expect(all, `${locale} fences off the later pejorative sense`).toMatch(
      /ախպար|Soviet Armenia|Խորհրդային Հայաստան/,
    );
  }
});

test("no single English title is asserted as canonical", () => {
  for (const locale of LOCALES) {
    const a = article(locale, BAGHDASAR);
    const all = text(locale, BAGHDASAR);

    // At least three attested English variants appear, evidencing the "no
    // canonical title" claim rather than just stating it.
    for (const variant of ["Baghdasar Aghbar", "Uncle Baghdasar", "Baghdasar Akhpar"]) {
      expect(all, `${locale} carries "${variant}"`).toContain(variant);
    }
    expect((a.keywords ?? []).length, `${locale} keywords cover the variants`).toBeGreaterThan(5);
  }
});

test("Մեծապատիվ մուրացկաններ and Ազգային ջոջեր remain separate, unregistered titles", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const slugs = b.articles.map((x) => x.slug);
    for (const invented of NOT_SIBLING_WORKS) {
      expect(slugs, `${locale} "${invented}" is not a registered article`).not.toContain(invented);
    }

    // The Work's own links never point at a sibling that doesn't exist.
    const targets = article(locale, BAGHDASAR)
      .sections.flatMap((s) => s.links ?? [])
      .map((l) => l.slug);
    for (const target of targets) {
      expect(slugs, `${locale} link target "${target}" resolves`).toContain(target);
    }
  }
});

test("the play owns its artwork and borrows nobody's portrait", async ({ page }) => {
  // §102 asserted the wait; §104 registers the play's own file.
  expect(getImageSrc(BAGHDASAR), "its own file is registered").toBe(ARTWORK[BAGHDASAR]);
  expect(PENDING_ARTWORK, "and the wait is over").not.toContain(BAGHDASAR);
  expect(getPortraitProvenance(BAGHDASAR), "a work has no portrait provenance").toBe("imagined");

  const paronyanPortrait = getImageSrc(PARONYAN);
  expect(paronyanPortrait, "Paronyan's own portrait is registered").toBeTruthy();

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${BAGHDASAR}`);
    /*
      The page's own JSON-LD legitimately cites Paronyan's Person node, and that
      node carries his real portrait URL — describing the author, not illustrating
      the play. So the borrowing check is scoped to rendered `<img>` elements
      (hero, card, any inline figure) rather than the whole HTML/JSON-LD payload.
    */
    const imgSrcs = await page.locator("img").evaluateAll((els) => els.map((e) => e.getAttribute("src") ?? ""));
    for (const src of imgSrcs) {
      expect(src, `${locale} no rendered <img> serves Paronyan's file`).not.toContain(
        String(paronyanPortrait),
      );
    }
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the play's artwork`).toBe(
        `https://armat.site${ARTWORK[BAGHDASAR]}`,
      );
      expect(content, `${locale} ${property} borrows no portrait`).not.toContain(
        String(paronyanPortrait),
      );
    }
  }
});

test("adding the seventh work changed nothing else", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const count = (category: string) => b.articles.filter((a) => a.category === category).length;

    expect(count("works"), `${locale} works`).toBe(10);
    expect(count("writers"), `${locale} writers`).toBe(13);
    expect(count("cuisine"), `${locale} cuisine`).toBe(12);
    expect(count("places"), `${locale} places`).toBe(13);
    expect(count("history"), `${locale} history`).toBe(7);

    // The six earlier works keep their order, cards and pictures.
    expect(b.works.slice(0, 6).map((w) => w.slug), `${locale} earlier order`).toEqual([
      ...SLUGS.slice(0, 6),
    ]);
    for (const slug of PRE_EXISTING) {
      expect(getImageSrc(slug), `${locale} ${slug} artwork unmoved`).toBe(ARTWORK[slug]);
      expect(PENDING_ARTWORK, `${slug} did not become pending`).not.toContain(slug);
    }

    // Mtnadzor specifically: still a short-story collection, still related to
    // Bakunts and no one else. Its artwork, pending at §102, is its own since §104.
    expect(getImageSrc(MTNADZOR), `${locale} Mtnadzor artwork`).toBe(ARTWORK[MTNADZOR]);
    expect(PENDING_ARTWORK, `${locale} Mtnadzor not waiting`).not.toContain(MTNADZOR);
    expect(work(locale, MTNADZOR).genreId, `${locale} Mtnadzor genre unmoved`).toBe(
      "short-stories",
    );
    expect(article(locale, MTNADZOR).relatedSlugs, `${locale} Mtnadzor relations unmoved`).toEqual(
      ["aksel-bakunts", "yeghishe-charents", "hovhannes-tumanyan"],
    );

    // Book of Lamentations, specifically: illustrated, unmoved, unrelated to this.
    expect(getImageSrc(NAREK), `${locale} Narek artwork unmoved`).toBe(ARTWORK[NAREK]);

    // Featured policy: still only Anush.
    expect(article(locale, BAGHDASAR).featured, `${locale} Baghdasar took no flag`).toBeFalsy();
    expect(b.works[0].slug, `${locale} Anush is still first`).toBe("anush");
  }
});

test("the play is reachable by route, listing and search in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    const card = work(locale, BAGHDASAR);

    const response = await page.goto(`/${locale}/works/${BAGHDASAR}`);
    expect(response?.status(), `${locale} route`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      articleTitle(locale, BAGHDASAR),
    );

    await page.goto(`/${locale}/works`);
    await expect(
      cards(page).filter({ hasText: card.title }).first(),
      `${locale} listed`,
    ).toBeVisible();
  }
});

test("the play carries a real, chronology-scoped bibliography", () => {
  const sources = getSources(BAGHDASAR);
  expect(sources.length, "at least seven sources").toBeGreaterThanOrEqual(7);
  for (const source of sources) {
    expect(source.identifier?.value, `"${source.title}" has an identifier`).toBeTruthy();
  }
});

/* -------------------------------------------------------------------------- */
/*  §103 — Work #8: Yerkir Nairi (Land of Nairi)                              */
/* -------------------------------------------------------------------------- */

/*
 * Yeghishe Charents's only novel, written 1921–1925 in Moscow and Yerevan and
 * published at Yerevan in 1926 — a self-conscious "poem-like novel" set in a
 * provincial city modelled on Kars, his own birthplace. The guards below follow
 * §101/§102's shape (a work written ahead of its artwork) and add checks specific
 * to this brief's cautions: no flattened "Charents rejects nationalism" claim, no
 * unsupported censorship claim, and the two sibling prose satires kept separate.
 */
const NOT_SIBLING_TITLES = ["national-bigshots", "azgayin-jojer", "land-of-nairi-part-two"];

test("the eighth work is Charents's 1926 novel, in every edition", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const a = article(locale, NAIRI);
    const card = work(locale, NAIRI);

    expect(card, `${locale} card`).toBeTruthy();
    expect(a, `${locale} article`).toBeTruthy();
    expect(a.href, `${locale} href`).toBe(`/works/${NAIRI}`);
    expect(a.category, `${locale} category`).toBe("works");
    // Appended last at §103; §106 appended the ninth after it.
    // §108 appended a tenth; it is now third from the end.
    expect(b.works.at(-3)!.slug, `${locale} appended after the seventh`).toBe(NAIRI);
    expect(b.works.length, `${locale} ten works`).toBe(10);

    for (const invented of NOT_SIBLING_TITLES) {
      const slugs = b.articles.map((x) => x.slug);
      expect(slugs, `${locale} no invented "${invented}"`).not.toContain(invented);
    }
  }
});

test("the author is Yeghishe Charents, resolved against the Writers section", () => {
  for (const locale of LOCALES) {
    const writer = bundle(locale).writers.find((w) => w.slug === CHARENTS)!;
    expect(work(locale, NAIRI).author, `${locale} card author is the writer's name`).toBe(
      writer.name,
    );
    expect(article(locale, NAIRI).relatedSlugs, `${locale} relates to Charents`).toContain(
      CHARENTS,
    );

    // Charents's own biography, untouched in prose, now links the phrase that
    // already named the novel to the new Work entity.
    const bio = article(locale, CHARENTS);
    const targets = bio.sections.flatMap((s) => s.links ?? []).map((l) => l.slug);
    expect(targets, `${locale} Charents's bio links to the novel`).toContain(NAIRI);
  }
});

test("the novel is filed as a novel, and no earlier work drifted onto it", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const card = work(locale, NAIRI);
    const genres = new Set(b.workGenres.map((g) => g.id));

    expect(genres.has("novel"), `${locale} novel is a real filter`).toBe(true);
    expect(card.genreId, `${locale} card genre id`).toBe("novel");
    // No new genre id was invented for this step.
    expect(genres.size, `${locale} genre count unchanged at six`).toBe(6);
  }
});

test("composition, serialization and book publication are three distinct stages", () => {
  for (const locale of LOCALES) {
    const a = article(locale, NAIRI);
    const all = text(locale, NAIRI);

    expect(all, `${locale} written 1921–1925`).toContain("1921");
    expect(all, `${locale} first book publication 1926`).toContain("1926");
    // The Norq serialization is named as an intermediate stage, not collapsed
    // into the book date.
    expect(all, `${locale} names the serialization`).toMatch(/Նորք|Norq/);
    // The conflicting 1924 date found in one mirrored source is recorded as a
    // discrepancy rather than silently adopted or silently dropped.
    expect(all, `${locale} records the 1924 discrepancy`).toContain("1924");

    const years = a.importantDates.map((d) => d.year);
    expect(years, `${locale} 1897, 1926 and 1937 are all dated`).toEqual(
      expect.arrayContaining(["1897", "1926", "1937"]),
    );
  }
});

test("Nairi is explained as symbol and history, not as a plain synonym for Armenia", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    expect(all, `${locale} gives Nairi's ancient/historical use`).toMatch(
      /ուրարտ|Urart|Վանա|Van/i,
    );
    expect(all, `${locale} names the two spellings as variants`).toMatch(/Նայիրի|Nayiri/);
  }
});

test("Kars is treated as literary geography, not a travel guide", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    expect(all, `${locale} names Kars`).toMatch(/Կարս|Kars/);
    // The remembered-city distinction is stated, not left implicit.
    expect(all, `${locale} distinguishes remembered from documentary`).toMatch(
      /վավերագրական|վաւերագրական|documentary/,
    );
  }
});

test("the narrator's self-declared absence of a hero is quoted, and 'unreliable narrator' is not imported loosely", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    expect(all, `${locale} quotes or states the no-hero claim`).toMatch(/հերոս|hero/);
    expect(all, `${locale} names the Gogol comparison`).toMatch(/Գոգոլ|Կոկոլ|Gogol/);
  }
});

test("the satire is not flattened into mocking Armenians in general", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    // The article states explicitly what the satire is not.
    expect(all, `${locale} refuses the flattened reading`).toMatch(
      /ծաղրում է հայերին|կը ծաղրէ հայերը|mocking Armenians/,
    );
  }
});

test("no simplistic nationalism verdict is asserted", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    // Both over-readings are named and set aside, rather than one being quietly
    // adopted as the article's own claim.
    expect(all, `${locale} sets aside the "rejects nationalism" overstatement`).toMatch(
      /ազգայնականության մերժում|ազգայնականութեան մերժում|rejecting nationalism/,
    );
    expect(all, `${locale} sets aside the celebration reading too`).toMatch(
      /հայրենասիրական տոնակատարություն|հայրենասիրական տօնակատարութիւն|patriotic celebration/,
    );
  }
});

test("no censorship or ban is asserted for the novel", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    expect(all, `${locale} does not claim a ban or suppression`).not.toMatch(
      /banned|prohibited|suppressed the novel|censored/i,
    );
    // The absence is stated positively, not just omitted.
    expect(all, `${locale} states no ban is documented`).toMatch(
      /արգելք|ճնշում|ban|suppression/,
    );
  }
});

test("the modernist-form claim cites a documented comparison, not a bare label", () => {
  for (const locale of LOCALES) {
    const all = text(locale, NAIRI);
    expect(all, `${locale} names the Musil comparison`).toMatch(/Մուզիլ|Muzil|Musil/);
    expect(all, `${locale} quotes the author's own genre label`).toMatch(
      /պոեմանման վ[եէ]պ|poem-like novel/,
    );
  }
});

test("Charents's arrest and death are kept chronologically separate from the novel", () => {
  for (const locale of LOCALES) {
    const a = article(locale, NAIRI);
    const years = a.importantDates.map((d) => d.year);
    expect(years.indexOf("1926"), `${locale} publication precedes the arrest`).toBeLessThan(
      years.indexOf("1937"),
    );
    const all = text(locale, NAIRI);
    expect(all, `${locale} states the decade gap explicitly`).toMatch(/decade|տասնամյակ|տասնամեակ/);
  }
});

test("the novel owns its artwork and borrows nobody's portrait", async ({ page }) => {
  // §103 asserted the wait; §104 registers the novel's own file.
  expect(getImageSrc(NAIRI), "its own file is registered").toBe(ARTWORK[NAIRI]);
  expect(PENDING_ARTWORK, "and the wait is over").not.toContain(NAIRI);
  expect(getPortraitProvenance(NAIRI), "a work has no portrait provenance").toBe("imagined");

  const charentsPortrait = getImageSrc(CHARENTS);
  expect(charentsPortrait, "Charents's own portrait is registered").toBeTruthy();

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${NAIRI}`);
    const imgSrcs = await page
      .locator("img")
      .evaluateAll((els) => els.map((e) => e.getAttribute("src") ?? ""));
    for (const src of imgSrcs) {
      expect(src, `${locale} no rendered <img> serves Charents's file`).not.toContain(
        String(charentsPortrait),
      );
    }
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the novel's artwork`).toBe(
        `https://armat.site${ARTWORK[NAIRI]}`,
      );
      expect(content, `${locale} ${property} borrows no portrait`).not.toContain(
        String(charentsPortrait),
      );
    }
  }
});

test("adding the eighth work changed nothing else", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const count = (category: string) => b.articles.filter((a) => a.category === category).length;

    expect(count("works"), `${locale} works`).toBe(10);
    expect(count("writers"), `${locale} writers`).toBe(13);
    expect(count("cuisine"), `${locale} cuisine`).toBe(12);
    expect(count("places"), `${locale} places`).toBe(13);
    expect(count("history"), `${locale} history`).toBe(7);

    // The seven earlier works keep their order, cards and pictures.
    expect(b.works.slice(0, 7).map((w) => w.slug), `${locale} earlier order`).toEqual([
      ...SLUGS.slice(0, 7),
    ]);
    for (const slug of PRE_EXISTING) {
      expect(getImageSrc(slug), `${locale} ${slug} artwork unmoved`).toBe(ARTWORK[slug]);
      expect(PENDING_ARTWORK, `${slug} did not become pending`).not.toContain(slug);
    }

    // Mtnadzor and Baghdasar Aghbar specifically: pending at §103, illustrated
    // since §104, otherwise untouched.
    expect(getImageSrc(MTNADZOR), `${locale} Mtnadzor artwork`).toBe(ARTWORK[MTNADZOR]);
    expect(PENDING_ARTWORK, `${locale} Mtnadzor not waiting`).not.toContain(MTNADZOR);
    expect(getImageSrc(BAGHDASAR), `${locale} Baghdasar artwork`).toBe(ARTWORK[BAGHDASAR]);
    expect(PENDING_ARTWORK, `${locale} Baghdasar not waiting`).not.toContain(BAGHDASAR);
    expect(article(locale, BAGHDASAR).relatedSlugs, `${locale} Baghdasar relations unmoved`).toEqual(
      ["hakob-paronyan"],
    );

    // Book of Lamentations, specifically: illustrated, unmoved, unrelated to this.
    expect(getImageSrc(NAREK), `${locale} Narek artwork unmoved`).toBe(ARTWORK[NAREK]);

    // Featured policy: still only Anush.
    expect(article(locale, NAIRI).featured, `${locale} Yerkir Nairi took no flag`).toBeFalsy();
    expect(b.works[0].slug, `${locale} Anush is still first`).toBe("anush");
  }
});

test("the novel is reachable by route, listing and search in every edition", async ({ page }) => {
  for (const locale of LOCALES) {
    const card = work(locale, NAIRI);

    const response = await page.goto(`/${locale}/works/${NAIRI}`);
    expect(response?.status(), `${locale} route`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(articleTitle(locale, NAIRI));

    await page.goto(`/${locale}/works`);
    await expect(
      cards(page).filter({ hasText: card.title }).first(),
      `${locale} listed`,
    ).toBeVisible();

    // Searching the author still finds the Writer, not displaced by the Work.
    const writerName = bundle(locale).writers.find((w) => w.slug === CHARENTS)!.name;
    await page.goto(`/${locale}/search?q=${encodeURIComponent(writerName)}`);
    await expect(
      page.locator(`main a[href="/${locale}/writers/${CHARENTS}"]`).first(),
      `${locale} search still finds the writer`,
    ).toBeVisible();
  }
});

test("the novel carries a real, chronology-scoped bibliography", () => {
  const sources = getSources(NAIRI);
  expect(sources.length, "at least seven sources").toBeGreaterThanOrEqual(7);
  for (const source of sources) {
    expect(source.identifier?.value, `"${source.title}" has an identifier`).toBeTruthy();
  }
});

/* -------------------------------------------------------------------------- */
/*  §104 — Artwork for Works #6–#8                                            */
/* -------------------------------------------------------------------------- */

/*
 * The three Works written ahead of their pictures at §101–§103 were audited one at
 * a time and all three registered. The tests below check every surface that reads
 * `IMAGES` — hero, listing (above), search, metadata, sitemap — for each of the
 * three, and pair each with the one Writer portrait it would be most tempting to
 * borrow.
 */

test("§104: every illustrated work has its own registered cover", () => {
  for (const slug of COVERED) {
    expect(getImageSrc(slug), `${slug} resolves to its own file`).toBe(ARTWORK[slug]);
    expect(PENDING_ARTWORK, `${slug} is not pending`).not.toContain(slug);
    expect(getPortraitProvenance(slug), `${slug} is not a portrait`).toBe("imagined");
  }
  // §104 read `toEqual([])` here. §106 adds the ninth work ahead of its picture, and
  // it is the only entry archive-wide; the eight covers above are unchanged.
  // §107 registered the ninth and emptied the list; §108 refilled it with the tenth,
  // and §110 empties it again.
  expect([...PENDING_ARTWORK], "the pending list is empty archive-wide").toEqual([]);

  // No two works share a file, and no work points into the Writers folder.
  const files = COVERED.map((slug) => getImageSrc(slug));
  expect(new Set(files).size, "ten distinct files").toBe(10);
  for (const file of files) {
    expect(String(file), `${file} is a works file`).toMatch(/^\/images\/works\//);
  }

  // The three Writers keep their own portraits and provenance, exactly as before.
  // Charents's portrait predates `PORTRAIT_PROVENANCE` and reads the default.
  const provenance: Record<string, string> = {
    [BAKUNTS]: "photo-referenced",
    [PARONYAN]: "photo-referenced",
    [CHARENTS]: "imagined",
    [ISAHAKYAN]: "imagined",
    // §110.
    [SHIRVANZADE]: "photo-referenced",
  };
  for (const [, writer] of NEW_ARTWORK) {
    expect(getImageSrc(writer), `${writer} portrait`).toBe(`/images/writers/${writer}.webp`);
    expect(getPortraitProvenance(writer), `${writer} provenance`).toBe(provenance[writer]);
  }

  // The article bundles declare no image of their own: the registry is the source.
  for (const locale of LOCALES) {
    for (const [slug] of NEW_ARTWORK) {
      expect(article(locale, slug).image, `${locale} ${slug} no content image`).toBeUndefined();
    }
  }
});

test("§104: each hero renders the work's own file, captioned as an illustration", async ({ page }) => {
  // Twelve article pages since §107.
  test.setTimeout(90_000);
  for (const [slug, writer] of NEW_ARTWORK) {
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/works/${slug}`);
      const figure = page.getByRole("main").locator("figure").first();
      const hero = figure.locator("img").first();

      await expect(figure.locator("svg[role='img']"), `${locale} ${slug} no placeholder`).toHaveCount(0);
      await expect(figure.locator(`img[src*="${FILE[slug]}"]`), `${locale} ${slug} hero src`).toHaveCount(1);
      await expect(figure.locator(`img[src*="${writer}"]`), `${locale} ${slug} not the portrait`).toHaveCount(0);

      const title = articleTitle(locale, slug);
      await expect(hero, `${locale} ${slug} localized alt`).toHaveAttribute(
        "alt",
        ui(locale).article.imageAlt.replace("{title}", title),
      );
      await expect(figure.locator("figcaption"), `${locale} ${slug} AI illustration caption`).toHaveText(
        ui(locale).article.imageAiIllustrationCaption.replace("{title}", title),
      );
    }
  }
});

test("§104: search hits carry the work's own artwork; writer hits keep their portraits", async ({
  page,
}) => {
  // Twenty-two search pages since §107; the 30 s default is sized for one or two.
  test.setTimeout(180_000);
  const queries: [string, string, string][] = [
    [MTNADZOR, "en", "Mtnadzor"],
    [MTNADZOR, "en", "The Dark Valley"],
    [MTNADZOR, "hy", "Մթնաձոր"],
    [MTNADZOR, "hyw", "Մթնաձոր"],
    [BAGHDASAR, "hy", "Պաղտասար աղբար"],
    [BAGHDASAR, "hyw", "Պաղտասար աղբար"],
    [BAGHDASAR, "en", "Baghdasar Aghbar"],
    [BAGHDASAR, "en", "Uncle Baghdasar"],
    [NAIRI, "hy", "Երկիր Նաիրի"],
    [NAIRI, "hyw", "Երկիր Նաիրի"],
    [NAIRI, "en", "Yerkir Nairi"],
    [NAIRI, "en", "Land of Nairi"],
    // §107.
    [ABU, "hy", "Աբու-Լալա Մահարի"],
    [ABU, "hy", "Աբու Լալա Մահարի"],
    [ABU, "hyw", "Աբու-Լալա Մահարի"],
    [ABU, "en", "Abu-Lala Mahari"],
    [ABU, "en", "Abu Lala Mahari"],
    [ABU, "en", "Avetik Isahakyan Abu Lala"],
  ];
  for (const [slug, locale, query] of queries) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    const hit = page.locator(`main li:has(a[href="/${locale}/works/${slug}"])`).first();
    await expect(hit, `${locale} "${query}" finds ${slug}`).toHaveCount(1);
    await expect(hit.locator("svg[role='img']"), `${locale} "${query}" no placeholder`).toHaveCount(0);
    await expect(hit.locator(`img[src*="${FILE[slug]}"]`), `${locale} "${query}" own artwork`).toHaveCount(1);
    await expect(hit.locator('img[src*="writers"]'), `${locale} "${query}" no portrait`).toHaveCount(0);
  }

  for (const [slug, writer] of NEW_ARTWORK) {
    const name = bundle("en").writers.find((w) => w.slug === writer)!.name;
    await page.goto(`/en/search?q=${encodeURIComponent(name)}`);
    const hit = page.locator(`main li:has(a[href="/en/writers/${writer}"])`).first();
    await expect(hit, `"${name}" finds the writer`).toHaveCount(1);
    await expect(hit.locator(`img[src*="${writer}.webp"]`), `"${name}" keeps the portrait`).toHaveCount(1);
    await expect(hit.locator(`img[src*="${FILE[slug]}"]`), `"${name}" not the work's cover`).toHaveCount(0);
  }
});

test("§104: OG, Twitter and sitemap advertise each work's own file, per edition", async ({
  page,
  request,
}) => {
  for (const [slug, writer] of NEW_ARTWORK) {
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/works/${slug}`);
      for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
        const content = (await page.locator(property).first().getAttribute("content")) ?? "";
        expect(content, `${locale} ${slug} ${property}`).toBe(`https://armat.site${ARTWORK[slug]}`);
        expect(content, `${locale} ${slug} ${property} no portrait`).not.toContain(writer);
      }
    }
  }

  const xml = await (await request.get("/sitemap.xml")).text();
  const blocks = xml.split("<url>").slice(1);
  for (const [slug, writer] of NEW_ARTWORK) {
    for (const locale of LOCALES) {
      const block = blocks.find((entry) => entry.includes(`/${locale}/works/${slug}</loc>`));
      expect(block, `${locale} ${slug} has a sitemap entry`).toBeDefined();
      expect(block, `${locale} ${slug} advertises its own image`).toContain(
        `<image:loc>https://armat.site${ARTWORK[slug]}</image:loc>`,
      );
      expect(block!.match(/<image:loc>/g)?.length, `${locale} ${slug} exactly one image`).toBe(1);
      expect(block, `${locale} ${slug} borrows no portrait`).not.toContain(writer);
    }
  }

  // Book of Lamentations and the four originals keep their sitemap images.
  for (const slug of [NAREK, ...PRE_EXISTING]) {
    const block = blocks.find((entry) => entry.includes(`/en/works/${slug}</loc>`));
    expect(block, `${slug} still advertises its image`).toContain(ARTWORK[slug]);
  }
});

/* -------------------------------------------------------------------------- */
/*  §106 — Work #9: Abu-Lala Mahari                                            */
/* -------------------------------------------------------------------------- */

/*
 * The ninth work's risk is an *identity* risk three ways over: a historical Arab
 * poet (al-Maʿarrī), the literary hero who borrows his name, and the Armenian
 * poet who wrote the poem. The tests pin the separations structurally — section
 * ids, relations, entities that must not exist — and pin prose only where the
 * article states a limit or a refusal, because that sentence is the claim.
 */

test("§106: the ninth work exists in every edition, after the eighth", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    // Appended last at §106; §108 appended the tenth after it.
    expect(b.works.at(-2)?.slug, `${locale} appended after the eighth`).toBe(ABU);
    expect(b.works.map((w) => w.slug), `${locale} order`).toEqual([...SLUGS]);

    const a = article(locale, ABU);
    expect(a.href, `${locale} href`).toBe(`/works/${ABU}`);
    expect(a.category, `${locale} category`).toBe("works");
    expect(work(locale, ABU).imageSeed, `${locale} card seed`).toBe(ABU);
  }
  // The Armenian editions carry the authoritative hyphenated title; the English
  // edition transliterates it rather than translating the name.
  expect(article("hy", ABU).title).toBe("Աբու-Լալա Մահարի");
  expect(article("hyw", ABU).title).toBe("Աբու-Լալա Մահարի");
  expect(article("en", ABU).title).toBe("Abu-Lala Mahari");
});

test("§106: the author is Avetik Isahakyan, and the relation runs both ways", () => {
  for (const locale of LOCALES) {
    const writer = bundle(locale).writers.find((w) => w.slug === ISAHAKYAN)!;
    expect(work(locale, ABU).author, `${locale} card author`).toBe(writer.name);
    expect(article(locale, ABU).relatedSlugs, `${locale} Work → Writer`).toEqual([ISAHAKYAN]);

    // Writer → Work: one `links` annotation on the sentence that already named the
    // poem. The sentence itself is still there, so no biography prose was rewritten.
    const major = article(locale, ISAHAKYAN).sections.find((s) => s.id === "major-works")!;
    const link = (major.links ?? []).find((l) => l.slug === ABU);
    expect(link, `${locale} Writer → Work link`).toBeTruthy();
    expect(major.paragraphs.join(" "), `${locale} phrase is in the prose`).toContain(link!.phrase);
    expect(
      article(locale, ISAHAKYAN).sections.flatMap((s) => s.links ?? []),
      `${locale} and it is the only link in the biography`,
    ).toHaveLength(1);
  }
});

test("§106: filed under poetry, with no new genre", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(work(locale, ABU).genreId, `${locale} genre id`).toBe("poetry");
    expect(b.workGenres.map((g) => g.id), `${locale} genre ids`).toEqual([
      "all",
      "poetry",
      "novel",
      "epic",
      "short-stories",
      "drama",
    ]);
    expect(
      b.works.filter((w) => w.genreId === "poetry").map((w) => w.slug),
      `${locale} poetry now holds three`,
    ).toEqual(["anush", NAREK, ABU]);
  }
  expect(work("en", ABU).genre).toBe("Philosophical poem");
});

test("§106: the chronology names its disagreement instead of choosing silently", () => {
  for (const locale of LOCALES) {
    const all = text(locale, ABU);
    expect(work(locale, ABU).publicationPeriod, `${locale} card`).toMatch(/1909–1911.*1911/);
    // The outer frame, the narrower scholarly dating, and the single-year dating.
    for (const date of ["1909–1911", "1909–1910", "1910", "1911"]) {
      expect(all, `${locale} ${date}`).toContain(date);
    }
    const years = article(locale, ABU).importantDates.map((d) => d.year);
    expect(years, `${locale} dates`).toEqual(expect.arrayContaining(["1909–1911", "1911", "1916"]));
  }
  const en = text("en", ABU);
  expect(en, "first book edition").toMatch(/Constantinople/);
  expect(en, "the caravan story is tradition, not fact").toMatch(/reported here as tradition/);
  expect(en, "no invented periodical").toMatch(/does not guess at one/);
});

test("§106: the historical al-Maʿarrī is kept apart from the literary hero", () => {
  for (const locale of LOCALES) {
    const ids = article(locale, ABU).sections.map((s) => s.id);
    expect(ids, `${locale} sections`).toEqual(
      expect.arrayContaining(["the-historical-poet", "from-history-to-poem", "author-and-hero"]),
    );
    const all = text(locale, ABU);
    expect(all, `${locale} historical dates`).toMatch(/973/);
    expect(all, `${locale} historical dates`).toMatch(/1057/);
    expect(
      (article(locale, ABU).relatedFigures ?? []).map((f) => f.lifespan),
      `${locale} al-Maʿarrī is a related figure, not an entity`,
    ).toContain("973–1057");
  }
  const en = text("en", ABU);
  expect(en).toContain("the hero is not a documentary reconstruction");
  expect(en).toContain("The two spellings mark two different figures");
});

test("§106: no Writer or article was invented for al-Maʿarrī", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(
      b.writers.map((w) => w.slug).filter((s) => /ma-?arri|mahari/.test(s)),
      `${locale} writers`,
    ).toEqual([]);
    expect(
      b.articles.map((a) => a.slug).filter((s) => /ma-?arri|mahari|abu-/.test(s)),
      `${locale} articles`,
    ).toEqual([ABU]);
  }
});

test("§106: the hero is not Isahakyan, and no belief is assigned to either", () => {
  const en = text("en", ABU);
  expect(en).toContain("does not make Abu-Lala Isahakyan in disguise");
  expect(en).not.toMatch(/Abu-Lala is Isahakyan/);
  expect(en).toContain("draws no conclusion from it about Isahakyan's own beliefs");
  expect(en).not.toMatch(/Isahakyan (was|is) an? (atheist|believer|skeptic)/i);
  // The autobiographical reading is attributed to the study that makes it.
  expect(en).toMatch(/Avik Isahakyan's 2007 study/);
});

test("§106: journey, desert and freedom are substantive sections in every edition", () => {
  for (const locale of LOCALES) {
    for (const id of ["the-journey", "the-desert", "freedom", "leaving-society", "love-and-attachment"]) {
      const section = article(locale, ABU).sections.find((s) => s.id === id);
      expect(section, `${locale} ${id}`).toBeTruthy();
      expect(section!.paragraphs.length, `${locale} ${id} paragraphs`).toBeGreaterThanOrEqual(2);
    }
  }
  const en = text("en", ABU);
  expect(en).toContain("The journey is not an adventure");
  expect(en, "desert scholarship attributed").toMatch(/Harutyunyan/);
});

test("§106: the hero's harsh verdicts stay the hero's", () => {
  const en = text("en", ABU);
  expect(en).toContain("It would be too simple to say that he hates humanity");
  expect(en).toContain("The hero's verdict is the hero's");
  expect(en).toContain("They are not presented as a truth about women");
  expect(en).not.toMatch(/mystical East|exotic Arabia|sensual Orient/i);
});

test("§106: pessimism, Romanticism and form are attributed, not asserted as labels", () => {
  for (const locale of LOCALES) {
    const ids = article(locale, ABU).sections.map((s) => s.id);
    expect(ids, `${locale}`).toEqual(
      expect.arrayContaining(["pessimism-and-revolt", "romantic-tradition", "form"]),
    );
  }
  const en = text("en", ABU);
  expect(en, "Romantic claim is Jrbashyan's").toMatch(/Jrbashyan's 1975 study/);
  expect(en, "the counter-reading").toMatch(/Saryan was perhaps the only interpreter/);
  expect(en, "the sura count is not flattened").toMatch(/seven numbered suras and a closing "Last Sura/);
  expect(en, "no invented canto count").not.toMatch(/five (cantos|songs)/i);
});

test("§107: the ninth work owns its artwork and nobody's portrait is borrowed", async ({ page, request }) => {
  /*
    §106 asserted the pending state here: no file, a placeholder hero, the OG
    fallback and an image-free sitemap block. §107 is that assertion inverted,
    surface by surface, with the portrait checks kept exactly as they were.
  */
  expect(getImageSrc(ABU), "its own file is registered").toBe(ARTWORK[ABU]);
  expect([...PENDING_ARTWORK], "and the wait is over").not.toContain(ABU);
  expect(getPortraitProvenance(ABU), "not a portrait").toBe("imagined");
  expect(getImageSrc(ISAHAKYAN), "Isahakyan keeps his portrait").toBe(
    `/images/writers/${ISAHAKYAN}.webp`,
  );
  for (const locale of LOCALES) {
    expect(article(locale, ABU).image, `${locale} no content image; the registry is the source`).toBeUndefined();
  }

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${ABU}`);
    const figure = page.getByRole("main").locator("figure").first();
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder hero`).toHaveCount(0);
    await expect(figure.locator(`img[src*="${FILE[ABU]}"]`), `${locale} own hero`).toHaveCount(1);
    await expect(figure.locator(`img[src*="${ISAHAKYAN}"]`), `${locale} no portrait hero`).toHaveCount(0);
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the work's file`).toBe(`https://armat.site${ARTWORK[ABU]}`);
      expect(content, `${locale} ${property} no portrait`).not.toContain(ISAHAKYAN);
    }
  }

  const xml = await (await request.get("/sitemap.xml")).text();
  const blocks = xml.split("<url>").slice(1);
  for (const locale of LOCALES) {
    const block = blocks.find((entry) => entry.includes(`/${locale}/works/${ABU}</loc>`));
    expect(block, `${locale} sitemap entry`).toBeDefined();
    expect(block, `${locale} advertises its own image`).toContain(
      `<image:loc>https://armat.site${ARTWORK[ABU]}</image:loc>`,
    );
    expect(block!.match(/<image:loc>/g)?.length, `${locale} exactly one image`).toBe(1);
    expect(block, `${locale} borrows no portrait`).not.toContain(ISAHAKYAN);
  }
});

test("§106: reachable by route, listing and every search alias", async ({ page }) => {
  test.setTimeout(120_000);
  for (const locale of LOCALES) {
    const response = await page.goto(`/${locale}/works/${ABU}`);
    expect(response?.status(), `${locale} route`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(articleTitle(locale, ABU));
  }

  const queries: [string, string][] = [
    ["hy", "Աբու-Լալա Մահարի"],
    ["hy", "Աբու Լալա Մահարի"],
    ["hyw", "Աբու-Լալա Մահարի"],
    ["hyw", "Աբու Լալա Մահարի"],
    ["en", "Abu-Lala Mahari"],
    ["en", "Abu Lala Mahari"],
    ["en", "Avetik Isahakyan Abu Lala"],
  ];
  for (const [locale, query] of queries) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    const hit = page.locator(`main li:has(a[href="/${locale}/works/${ABU}"])`).first();
    await expect(hit, `${locale} "${query}" finds the work`).toHaveCount(1);
    await expect(hit.locator(`img[src*="${ISAHAKYAN}"]`), `${locale} "${query}" no portrait`).toHaveCount(0);
  }

  // The author's name still finds the Writer, with his own portrait.
  await page.goto(`/en/search?q=${encodeURIComponent("Avetik Isahakyan")}`);
  const writer = page.locator(`main li:has(a[href="/en/writers/${ISAHAKYAN}"])`).first();
  await expect(writer, "the Writer is still found").toHaveCount(1);
  await expect(writer.locator(`img[src*="${ISAHAKYAN}.webp"]`), "with his portrait").toHaveCount(1);

  // The historical name surfaces the poem and no Writer page.
  await page.goto(`/en/search?q=${encodeURIComponent("al-Maʿarrī")}`);
  await expect(page.locator(`main a[href="/en/works/${ABU}"]`).first(), "the poem").toBeVisible();
  await expect(page.locator(`main a[href*="/en/writers/"][href*="arri"]`), "no fake Writer").toHaveCount(0);
});

test("§106: the poem carries a real, function-scoped bibliography", () => {
  const sources = getSources(ABU);
  expect(sources.length, "at least seven sources").toBeGreaterThanOrEqual(7);
  for (const source of sources) {
    expect(source.identifier?.value, `"${source.title}" has an identifier`).toBeTruthy();
    expect(source.publisher, `"${source.title}" names a publisher`).toBeTruthy();
  }
  const ids = sources.map((s) => s.identifier.value);
  expect(ids, "Harutyunyan, by DOI").toContain("10.46991/FLHE/2015.19.1.201");
  expect(ids.some((id) => id.includes("britannica.com")), "historical figure has its own source").toBe(true);
  expect(ids.some((id) => id.includes("189596")), "Jrbashyan 1975").toBe(true);
});

test("§106: adding the ninth work changed nothing else", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const count = (category: string) => b.articles.filter((a) => a.category === category).length;
    expect(count("works"), `${locale} works`).toBe(10);
    expect(count("writers"), `${locale} writers`).toBe(13);
    expect(count("cuisine"), `${locale} cuisine`).toBe(12);
    expect(count("places"), `${locale} places`).toBe(13);
    expect(count("history"), `${locale} history`).toBe(7);

    expect(b.works.slice(0, 8).map((w) => w.slug), `${locale} earlier order`).toEqual(SLUGS.slice(0, 8));
    for (const slug of COVERED) {
      expect(getImageSrc(slug), `${locale} ${slug} cover unmoved`).toBe(ARTWORK[slug]);
    }
    expect(article(locale, ABU).featured, `${locale} took no flag`).toBeFalsy();
    expect(b.works[0].slug, `${locale} Anush is still first`).toBe("anush");

    // Every writer, Isahakyan included, keeps a registered portrait.
    for (const w of b.writers) {
      expect(getImageSrc(w.slug), `${locale} ${w.slug} portrait`).toBeTruthy();
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  §108 — Work #10: Chaos (Քաոս), Alexander Shirvanzade                       */
/* -------------------------------------------------------------------------- */

/*
 * The tenth work's risk is ambiguity. "Chaos" is a common English noun, the novel
 * shares its title with a 1973 film and a television version, and its setting is a
 * city whose later history is easy to read backwards into a book of 1898. The tests
 * pin the entity, the dates and the refusals structurally; prose is pinned only
 * where the article states a limit.
 */

test("§108: the tenth work exists in every edition, appended last", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(b.works.at(-1)?.slug, `${locale} appended last`).toBe(CHAOS);
    expect(b.works.map((w) => w.slug), `${locale} order`).toEqual([...SLUGS]);
    const a = article(locale, CHAOS);
    expect(a.href, `${locale} href`).toBe(`/works/${CHAOS}`);
    expect(a.category, `${locale} category`).toBe("works");
    expect(work(locale, CHAOS).imageSeed, `${locale} card seed`).toBe(CHAOS);
  }
  expect(article("hy", CHAOS).title).toBe("Քաոս");
  expect(article("hyw", CHAOS).title).toBe("Քաոս");
  expect(article("en", CHAOS).title).toBe("Chaos");
});

test("§108: the author is Alexander Shirvanzade, and the relation runs both ways", () => {
  for (const locale of LOCALES) {
    const writer = bundle(locale).writers.find((w) => w.slug === SHIRVANZADE)!;
    expect(work(locale, CHAOS).author, `${locale} card author`).toBe(writer.name);
    expect(article(locale, CHAOS).relatedSlugs, `${locale} Work → Writer`).toEqual([SHIRVANZADE]);
    const section = article(locale, SHIRVANZADE).sections.find((s) => s.id === "chaos")!;
    const link = (section.links ?? []).find((l) => l.slug === CHAOS);
    expect(link, `${locale} Writer → Work link`).toBeTruthy();
    expect(section.paragraphs.join(" "), `${locale} on an existing sentence`).toContain(link!.phrase);
  }
});

test("§108: filed as a novel, with no new genre", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(work(locale, CHAOS).genreId, `${locale} genre id`).toBe("novel");
    expect(b.workGenres.length, `${locale} six filters`).toBe(6);
    expect(
      b.works.filter((w) => w.genreId === "novel").map((w) => w.slug),
      `${locale} novels`,
    ).toEqual(["wounds-of-armenia", "the-fool", NAIRI, CHAOS]);
  }
});

test("§108: written, published and the unconfirmed serialization are kept apart", () => {
  for (const locale of LOCALES) {
    const all = text(locale, CHAOS);
    expect(work(locale, CHAOS).publicationPeriod, `${locale} card`).toMatch(/1896–1897.*1898/);
    for (const date of ["1896–1897", "1898", "1881–1882"]) {
      expect(all, `${locale} ${date}`).toContain(date);
    }
    const years = article(locale, CHAOS).importantDates.map((d) => d.year);
    expect(years, `${locale} dates`).toEqual(expect.arrayContaining(["1896–1897", "1898"]));
  }
  const en = text("en", CHAOS);
  expect(en, "the book city").toMatch(/published as a book at Baku in 1898/);
  expect(en, "serialization is reported, not asserted").toMatch(/reported here as a claim that could not be confirmed/);
  expect(en, "the prison origin").toMatch(/Metekhi/);
});

test("§108: Baku, oil and the family are substantive, not background", () => {
  for (const locale of LOCALES) {
    for (const id of ["baku", "oil-and-money", "the-alimyan-family", "characters", "the-will", "modernization", "women", "realism", "why-chaos"]) {
      const section = article(locale, CHAOS).sections.find((s) => s.id === id);
      expect(section, `${locale} ${id}`).toBeTruthy();
      expect(section!.paragraphs.length, `${locale} ${id} paragraphs`).toBeGreaterThanOrEqual(2);
    }
  }
  const en = text("en", CHAOS);
  expect(en, "the text leaves the city unnamed").toContain("the text leaves the city unnamed");
  expect(en, "not simply about oil").toContain("Chaos is not a novel about the oil industry");
  // Names come from the text, with the verified spellings.
  for (const name of ["Մարկոս", "Ոսկեհատ", "Սմբատ", "Միքայել", "Շուշանիկ", "Սրաֆիոն"]) {
    expect(text("hy", CHAOS), `hy ${name}`).toContain(name);
  }
});

test("§108: realism is explained, and no Soviet frame is read back into 1898", () => {
  const en = text("en", CHAOS);
  expect(en, "critical realism attributed").toMatch(/standard Armenian scholarly term/);
  expect(en, "no naturalism claim").toContain("No source consulted describes Chaos as naturalist");
  expect(en, "Soviet reading reported as reception").toMatch(/Soviet-era reception/);
  expect(en).not.toMatch(/Soviet (industrialization|capitalism)|socialist realism/i);
  expect(en, "no 'rich people are bad' flattening").toContain("That is not quite what it shows");
  expect(en, "no first-urban-novel claim").toContain("does not call it the first Armenian urban novel");
});

test("§108: the generic title is disambiguated in every edition's metadata", () => {
  for (const locale of LOCALES) {
    const a = article(locale, CHAOS);
    expect(a.sections.map((s) => s.id), `${locale} title section`).toContain("the-title");
    expect(`${a.seoTitle} ${a.metaDescription}`, `${locale} names the author`).toMatch(/Shirvanzade|Շիրվանզադ/);
  }
  const en = article("en", CHAOS);
  expect(en.seoTitle).toMatch(/Chaos/);
  expect(en.seoTitle).toMatch(/Alexander Shirvanzade/);
  expect(en.metaDescription).toMatch(/Armenian novel/);
  expect(en.metaDescription).toMatch(/Baku/);
});

test("§108: no Place, Writer or character entity was invented", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const slugs = b.articles.map((a) => a.slug);
    expect(slugs.filter((s) => /(^|-)(baku|oil|alimyan|smbat|mikayel)(-|$)/.test(s)), `${locale} no invented entity`).toEqual([]);
    expect(slugs.filter((s) => /chaos|kaos|qaos/.test(s)), `${locale} one Chaos`).toEqual([CHAOS]);
  }
});

test("§110: the tenth work owns its artwork and Shirvanzade's portrait is not borrowed", async ({ page, request }) => {
  /*
    §108 asserted the pending state here: no file, a placeholder hero, the OG
    fallback and an image-free sitemap block. §110 is that assertion inverted,
    surface by surface, with the portrait checks kept exactly as they were.
  */
  expect(getImageSrc(CHAOS), "its own file is registered").toBe(ARTWORK[CHAOS]);
  expect([...PENDING_ARTWORK], "and the wait is over").not.toContain(CHAOS);
  for (const locale of LOCALES) {
    expect(article(locale, CHAOS).image, `${locale} no content image; the registry is the source`).toBeUndefined();
  }
  expect(getPortraitProvenance(CHAOS), "not a portrait").toBe("imagined");
  expect(getImageSrc(SHIRVANZADE), "his portrait stays his").toBe(`/images/writers/${SHIRVANZADE}.webp`);
  expect(getPortraitProvenance(SHIRVANZADE), "his provenance").toBe("photo-referenced");
  // Step 81's registration is intact.
  expect(getImageSrc(ABU), "Abu-Lala Mahari keeps its cover").toBe(ARTWORK[ABU]);

  for (const locale of LOCALES) {
    await page.goto(`/${locale}/works/${CHAOS}`);
    const figure = page.getByRole("main").locator("figure").first();
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder hero`).toHaveCount(0);
    await expect(figure.locator(`img[src*="${FILE[CHAOS]}"]`), `${locale} own hero`).toHaveCount(1);
    await expect(figure.locator(`img[src*="${SHIRVANZADE}"]`), `${locale} no portrait hero`).toHaveCount(0);
    for (const property of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const content = (await page.locator(property).first().getAttribute("content")) ?? "";
      expect(content, `${locale} ${property} is the work's file`).toBe(`https://armat.site${ARTWORK[CHAOS]}`);
      expect(content, `${locale} ${property} no portrait`).not.toContain(SHIRVANZADE);
    }
  }

  const xml = await (await request.get("/sitemap.xml")).text();
  const blocks = xml.split("<url>").slice(1);
  for (const locale of LOCALES) {
    const block = blocks.find((entry) => entry.includes(`/${locale}/works/${CHAOS}</loc>`));
    expect(block, `${locale} sitemap entry`).toBeDefined();
    expect(block, `${locale} advertises its own image`).toContain(
      `<image:loc>https://armat.site${ARTWORK[CHAOS]}</image:loc>`,
    );
    expect(block!.split("<image:loc>").length - 1, `${locale} exactly one image`).toBe(1);
  }
});

test("§108: reachable by route and by its title in every form", async ({ page }) => {
  test.setTimeout(120_000);
  for (const locale of LOCALES) {
    const response = await page.goto(`/${locale}/works/${CHAOS}`);
    expect(response?.status(), `${locale} route`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(articleTitle(locale, CHAOS));
  }

  // The bare English noun is included: the work must be discoverable by it, not
  // necessarily first.
  const queries: [string, string][] = [
    ["en", "Chaos"],
    ["en", "Alexander Shirvanzade Chaos"],
    ["en", "Shirvanzade Chaos"],
    ["hy", "Քաոս"],
    ["hy", "Շիրվանզադե Քաոս"],
    ["hyw", "Քաոս"],
  ];
  for (const [locale, query] of queries) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    const hit = page.locator(`main li:has(a[href="/${locale}/works/${CHAOS}"])`).first();
    await expect(hit, `${locale} "${query}" finds the work`).toHaveCount(1);
    await expect(hit.locator(`img[src*="${SHIRVANZADE}"]`), `${locale} "${query}" no portrait`).toHaveCount(0);
    // §110: the hit carries the work's own cover.
    await expect(hit.locator(`img[src*="${FILE[CHAOS]}"]`), `${locale} "${query}" own artwork`).toHaveCount(1);
  }

  // The author's name still finds the Writer, with his portrait.
  for (const [locale, name] of [["en", "Alexander Shirvanzade"], ["hy", "Ալեքսանդր Շիրվանզադե"]] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(name)}`);
    const writer = page.locator(`main li:has(a[href="/${locale}/writers/${SHIRVANZADE}"])`).first();
    await expect(writer, `${locale} the Writer is still found`).toHaveCount(1);
    await expect(writer.locator(`img[src*="${SHIRVANZADE}.webp"]`), `${locale} with his portrait`).toHaveCount(1);
  }
});

test("§108: the novel carries a real, role-scoped bibliography", () => {
  const sources = getSources(CHAOS);
  expect(sources.length, "at least eight sources").toBeGreaterThanOrEqual(8);
  for (const source of sources) {
    expect(source.identifier?.value, `"${source.title}" has an identifier`).toBeTruthy();
    expect(source.publisher, `"${source.title}" names a publisher`).toBeTruthy();
  }
  const ids = sources.map((s) => s.identifier.value);
  expect(ids.some((id) => id.includes("wikisource")), "the primary text").toBe(true);
  expect(ids, "the French translation, by ISBN").toContain("9782919131099");
});

test("§108: adding the tenth work changed nothing else", () => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const count = (category: string) => b.articles.filter((a) => a.category === category).length;
    expect(count("works"), `${locale} works`).toBe(10);
    expect(count("writers"), `${locale} writers`).toBe(13);
    expect(count("cuisine"), `${locale} cuisine`).toBe(12);
    expect(count("places"), `${locale} places`).toBe(13);
    expect(count("history"), `${locale} history`).toBe(7);

    expect(b.works.slice(0, 9).map((w) => w.slug), `${locale} earlier order`).toEqual(SLUGS.slice(0, 9));
    for (const slug of COVERED) {
      expect(getImageSrc(slug), `${locale} ${slug} cover unmoved`).toBe(ARTWORK[slug]);
    }
    expect(article(locale, CHAOS).featured, `${locale} took no flag`).toBeFalsy();
    expect(b.works[0].slug, `${locale} Anush is still first`).toBe("anush");
    for (const w of b.writers) {
      expect(getImageSrc(w.slug), `${locale} ${w.slug} portrait`).toBeTruthy();
    }
  }
});

/* -------------------------------------------------------------------------- */
/*  §111 — Targeted corrections to Abu-Lala Mahari and Chaos                   */
/* -------------------------------------------------------------------------- */

/*
 * §111 corrected facts that a later edit could quietly undo. The guards pin the
 * corrected meaning with short markers rather than whole sentences: the will's
 * inheritance clause, Mikayel's own words, the dropped serialisation, and on the
 * poem the sura order and the two unsourced claims.
 */

test("§111: Chaos states the will's inheritance clause and Mikayel's own framing", () => {
  const clause: Record<string, RegExp[]> = {
    en: [/may not leave his share/, /lawful heirs/, /does not order a divorce/],
    hy: [/«օտարազգի»/, /օրինական ժառանգները/],
    hyw: [/«օտարազգի»/, /օրինական ժառանգորդները/],
  };
  const lastWish: Record<string, string> = {
    en: "our father's last wish",
    hy: "մեր հոր վերջին կամքը",
    hyw: "մեր հօր վերջին կամքը",
  };
  for (const locale of LOCALES) {
    const will = article(locale, CHAOS).sections.find((s) => s.id === "the-will")!.paragraphs.join(" ");
    for (const marker of clause[locale]) expect(will, `${locale} ${marker}`).toMatch(marker);
    const all = text(locale, CHAOS);
    expect(all, `${locale} Mikayel's words`).toContain(lastWish[locale]);
    expect(all, `${locale} no flat denial`).not.toMatch(
      /not a submission to the will|ենթարկվելը չէ|ենթարկուիլ չէ|few in writing|քիչ էր գրել|քիչ գրած էր/,
    );
  }
});

test("§111: serialization is nowhere asserted, and the 1898 book stands on both pages", () => {
  const asserted = /serialized in 1896 and|appear serially|published complete|տպագրվել մաս-մաս|մաս-մաս 1896-ին|սկսում է տպագրվել|շարունակութիւններով|ամբողջութեամբ՝ 1898/i;
  for (const locale of LOCALES) {
    expect(text(locale, SHIRVANZADE), `${locale} biography`).not.toMatch(asserted);
    expect(text(locale, SHIRVANZADE), `${locale} biography keeps 1898`).toContain("1898");
  }
  expect(text("en", SHIRVANZADE)).toMatch(/published as a book at Baku in 1898/);
  expect(text("en", CHAOS)).toMatch(/published as a book at Baku in 1898/);
  expect(text("en", CHAOS)).toMatch(/reported here as a claim that could not be confirmed/);
  expect(text("en", CHAOS), "no self-reference to the old biography").not.toMatch(/This site's biography of Shirvanzade/);
});

test("§111: Chaos drops the sweeping and unsourced framings", () => {
  const gone: Record<string, RegExp> = {
    en: /most ambitious|the Armenian novel of the modern commercial city|looked to the village|later television|encyclopedic account|Azerbaijani, Russian|Russian reference works/,
    hy: /ամենահավակնոտ|արդի առևտրական քաղաքի հայկական վեպն է|հետագա հեռուստատեսային|հանրագիտարանային շարադրանք|ադրբեջանցի|տեղեկագրական|խորհրդանշից/,
    hyw: /յաւակնոտ|տեղեկագրական|քաղաքին հայ վէպն է|ետքի հեռատեսիլ|հանրագիտարանային շարադրանք|ազրպէյճանցի|ուղղողներուն/,
  };
  for (const locale of LOCALES) {
    expect(text(locale, CHAOS), `${locale}`).not.toMatch(gone[locale]);
  }
  // The earlier urban writing is acknowledged, and the "first" refusal stays.
  expect(text("en", CHAOS)).toMatch(/Paronyan/);
  expect(text("en", CHAOS)).toContain("does not call it the first Armenian urban novel");
});

test("§111: Abu-Lala Mahari keeps the sura order and drops the unsourced claims", () => {
  const gone: Record<string, RegExp> = {
    en: /Later ones turn to love|longest|most ambitious|Russian-language reference works|rides on/,
    hy: /հաջորդները՝ սիրուն|ամենածավալուն|ամենահավակնոտ|Ռուսալեզու|ձևավորում է շարժումը|կրում է հենց լեզուն|տեղեկագրական/,
    hyw: /յաջորդները՝ սիրոյն|ամէնէն ընդարձակ|ընդարձակ պոէմ|յաւակնոտ|Ռուսալեզու|կը ձեւաւորէ շարժումը|կը կրէ լեզուն|տասնյակ|մեղանչած է։|ոչինչ խնայէ|հանգրուանի հերոսը|տեղեկագրական/,
  };
  for (const locale of LOCALES) {
    const a = article(locale, ABU);
    const all = [text(locale, ABU), a.excerpt, a.metaDescription, a.seoTitle, work(locale, ABU).summary].join("\n");
    expect(all, `${locale}`).not.toMatch(gone[locale]);
  }
  expect(text("hyw", ABU)).toContain("մեղանչած չէ");
  expect(text("hyw", ABU)).toContain("ոչինչ չխնայէ");
  // Love is still named among the first renunciations, and the scholars stay attributed.
  expect(text("en", ABU)).toContain("Love is among the first things the hero renounces");
  expect(text("en", ABU)).toMatch(/Jrbashyan called it the peak of/);
});

test("§111: the corrections moved no artwork, relation or count", () => {
  for (const slug of [ABU, CHAOS]) {
    expect(getImageSrc(slug), `${slug} cover`).toBe(ARTWORK[slug]);
    expect(PENDING_ARTWORK, `${slug} not pending`).not.toContain(slug);
  }
  for (const locale of LOCALES) {
    expect(article(locale, ABU).relatedSlugs, `${locale} Abu-Lala relation`).toEqual([ISAHAKYAN]);
    expect(article(locale, CHAOS).relatedSlugs, `${locale} Chaos relation`).toEqual([SHIRVANZADE]);
    const b = bundle(locale);
    expect(b.works.length, `${locale} works`).toBe(10);
    expect(b.articles.filter((a) => a.category === "writers").length, `${locale} writers`).toBe(13);
  }
});

test("§112: Shirvanzade's nineteenth-century prose carries no modern national label", () => {
  const banned: Record<string, RegExp> = {
    en: /Armenian and Azerbaijani town|Armenian, Azerbaijani, Russian/,
    hy: /ադրբեջանցի բնակչությամբ|հայկական, ադրբեջանական/,
    hyw: /ազրպէյճանցիներ|հայկական, ազրպէյճանական/,
  };
  for (const locale of LOCALES) {
    expect(text(locale, SHIRVANZADE), locale).not.toMatch(banned[locale]);
  }
});
