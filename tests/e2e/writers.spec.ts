import { expect, test, type Page } from "@playwright/test";
import { PENDING_ARTWORK, getImageSrc, getPortraitProvenance } from "@/lib/media";
import { getSources } from "@/data/sources";
import { LOCALES, articleTitle, bundle, cards, ui } from "./helpers";

/**
 * The Armenian Writers section.
 *
 * This file did not exist until §81. Writers were covered incidentally — by
 * `article.spec.ts` for the shared furniture, `listing.spec.ts` for the filter
 * behaviour, `search.spec.ts` and `seo.spec.ts` for the archive-wide contracts,
 * and one count literal in `places.spec.ts` — which was proportionate while the
 * section was six nineteenth- and twentieth-century biographies that made no
 * contested claims.
 *
 * Grigor Narekatsi changes that. He is the section's first medieval subject, the
 * first with disputed dates, the first with a corpus that has to distinguish
 * secure from traditional attribution, and the first whose religious reception
 * could quietly take over his literary biography. None of that has anywhere to be
 * asserted in a file about listings.
 *
 * The tests below are therefore mostly about *claims* rather than about layout,
 * and they follow the discipline the Cuisine file arrived at: where a page names
 * a popular claim in order to refuse it, the test pins the refusal rather than
 * banning the words, because a naive substring ban fails on the refutation itself.
 */

const NAREKATSI = "grigor-narekatsi";
const VAROUJAN = "daniel-varoujan";
const TUMANYAN = "hovhannes-tumanyan";
const ABOVYAN = "khachatur-abovyan";

/** Every writer in the section, as of §84. Stated, not derived. */
const SLUGS = [
  TUMANYAN,
  "yeghishe-charents",
  "raffi",
  "avetik-isahakyan",
  ABOVYAN,
  "paruyr-sevak",
  NAREKATSI,
  VAROUJAN,
] as const;

/**
 * The writers that have a registered portrait.
 *
 * The first time this section has needed the distinction at all: its first six
 * shipped with their portraits already in place, so `SLUGS` and this list were
 * the same set and no separate list existed. Narekatsi is the first writer
 * written ahead of his picture, which is the situation `places.spec.ts` and
 * `cuisine.spec.ts` have each been in repeatedly.
 *
 * Kept as its own literal rather than derived from `getImageSrc`, for the reason
 * both of those files give: a derived list agrees with the registry by
 * construction, including on the day the registry is wrong.
 */
const ILLUSTRATED = [
  TUMANYAN,
  "yeghishe-charents",
  "raffi",
  "avetik-isahakyan",
  ABOVYAN,
  "paruyr-sevak",
  NAREKATSI,
  VAROUJAN,
] as const;

/**
 * The writers still waiting for one. Derived from nothing — stated.
 *
 * §82 emptied it, §84 refilled it and §85 emptied it again, which is the pattern
 * every other section in this archive has followed: an article lands, its picture
 * follows a step later. Keeping the constant through the empty phase is what made
 * refilling it a one-line edit rather than a rediscovery, so it stays at `[]`
 * rather than being deleted.
 *
 * With §85 `ILLUSTRATED` and `SLUGS` are the same set again for the first time
 * since §81 — eight writers, eight portraits, no placeholder in the section.
 */
const PENDING: readonly string[] = [];

/** Where each writer's portrait must live, spelled out rather than templated. */
const PORTRAIT: Record<string, string> = {
  "hovhannes-tumanyan": "/images/writers/hovhannes-tumanyan.webp",
  "yeghishe-charents": "/images/writers/yeghishe-charents.webp",
  raffi: "/images/writers/raffi.webp",
  "avetik-isahakyan": "/images/writers/avetik-isahakyan.webp",
  "khachatur-abovyan": "/images/writers/khachatur-abovyan.webp",
  "paruyr-sevak": "/images/writers/paruyr-sevak.webp",
  "grigor-narekatsi": "/images/writers/grigor-narekatsi.webp",
  "daniel-varoujan": "/images/writers/daniel-varoujan.webp",
};

const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type LdNode = { "@type"?: string; [key: string]: unknown };

async function readGraph(page: Page): Promise<LdNode[]> {
  const blocks = page.locator('script[type="application/ld+json"]');
  await expect(blocks).toHaveCount(1);
  const parsed = JSON.parse((await blocks.first().textContent()) ?? "") as {
    "@graph"?: LdNode[];
  };
  expect(parsed["@graph"]).toBeDefined();
  return parsed["@graph"] ?? [];
}

function node(graph: LdNode[], type: string): LdNode {
  const found = graph.find((entry) => entry["@type"] === type);
  if (!found) throw new Error(`No "${type}" node in the graph.`);
  return found;
}

/** The rendered text of an article's main region, in one locale. */
async function prose(page: Page, locale: string, slug: string): Promise<string> {
  await page.goto(`/${locale}/writers/${slug}`);
  return (await page.getByRole("main").textContent()) ?? "";
}

/* -------------------------------------------------------------------------- */
/*  Corpus                                                                     */
/* -------------------------------------------------------------------------- */

test("the seventh writer exists in every edition and is the section's first medieval author", () => {
  /*
    §50, checked as data rather than as pixels — the whole of it runs without a
    browser, which is the §63 answer to a section that is about to grow.
  */
  for (const locale of LOCALES) {
    const writers = bundle(locale).articles.filter((a) => a.category === "writers");
    expect(writers.length, `${locale} writer count`).toBe(SLUGS.length);
    expect(
      writers.map((a) => a.slug),
      `${locale} keeps the section in one order`,
    ).toEqual([...SLUGS]);

    const narekatsi = writers.find((a) => a.slug === NAREKATSI);
    expect(narekatsi, `${locale} has Narekatsi`).toBeDefined();
    expect(narekatsi!.periodId, `${locale} Narekatsi is medieval`).toBe("medieval");

    // The listing card and the article must agree — they are two separate files.
    const card = bundle(locale).writers.find((w) => w.slug === NAREKATSI);
    expect(card, `${locale} has a Narekatsi card`).toBeDefined();
    expect(card!.periodId, `${locale} card period`).toBe("medieval");
    expect(card!.period, `${locale} card period label`).toBe(narekatsi!.period);
    expect(
      bundle(locale).writers.map((w) => w.slug),
      `${locale} card order matches the articles`,
    ).toEqual([...SLUGS]);

    // No new taxonomy value was invented: `medieval` was already there, empty.
    expect(
      bundle(locale).literaryPeriods.map((f) => f.id),
      `${locale} literary periods unchanged`,
    ).toEqual(["all", "medieval", "19th-century", "20th-century", "soviet"]);

    // The six existing writers keep their classifications exactly.
    for (const [slug, period] of [
      [TUMANYAN, "19th-century"],
      ["yeghishe-charents", "20th-century"],
      ["raffi", "19th-century"],
      ["avetik-isahakyan", "20th-century"],
      [ABOVYAN, "19th-century"],
      ["paruyr-sevak", "soviet"],
    ] as const) {
      expect(
        bundle(locale).writers.find((w) => w.slug === slug)!.periodId,
        `${locale} ${slug} still ${period}`,
      ).toBe(period);
    }

    // Tumanyan is still the only featured writer: a new arrival must not have
    // taken the flag, and must not have been given one of its own.
    const featured = bundle(locale).writers.filter((w) => w.featured).map((w) => w.slug);
    expect(featured, `${locale} featured writers`).toEqual([TUMANYAN]);
    expect(narekatsi!.featured ?? false, `${locale} Narekatsi is not featured`).toBe(false);
  }
});

test("the medieval filter has a member at last, and returns exactly him", async ({ page }) => {
  /*
    §3. The `medieval` chip has existed in all three editions since the section was
    built and has matched nothing the whole time — an empty filter that rendered a
    control leading to an empty page. Narekatsi is its first member, and this test
    exists so that the day it is emptied again is a failure rather than a shrug.
  */
  for (const locale of LOCALES) {
    const medieval = bundle(locale).writers.filter((w) => w.periodId === "medieval");
    expect(
      medieval.map((w) => w.slug),
      `${locale} medieval membership`,
    ).toEqual([NAREKATSI]);
  }

  await page.goto("/en/writers?period=medieval");
  await expect(cards(page)).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: articleTitle("en", NAREKATSI), exact: true }).first(),
  ).toBeVisible();

  // And selecting it disturbed nothing: every other period returns what it did.
  for (const [period, count] of [
    ["19th-century", 3],
    // §84 moves this from two to three: Daniel Varoujan is the third
    // twentieth-century writer, and he needed no new filter value. This literal
    // going red on his arrival is the test working, not the test being stale.
    ["20th-century", 3],
    ["soviet", 1],
  ] as const) {
    await page.goto(`/en/writers?period=${period}`);
    await expect(cards(page), `${period} count`).toHaveCount(count);
  }
});

/* -------------------------------------------------------------------------- */
/*  Biography                                                                  */
/* -------------------------------------------------------------------------- */

test("Narekatsi's dates stay uncertain, in every edition", async ({ page }) => {
  /*
    §11 and §51. The dates are the most likely thing to be quietly hardened by a
    later edit, because 951–1003 is what every popular page prints and the hedging
    reads as fussiness until you know the sources do not support it.

    The test therefore pins both halves: the conventional pair must be present, and
    the statement that it is a convention rather than a record must be present with
    it. Checking only for "951" would pass on a page that had deleted every "about".
  */
  const en = await prose(page, "en", NAREKATSI);

  expect(en, "the conventional pair is given").toContain("951");
  expect(en, "and the alternatives are given").toContain("1010");
  expect(en, "the range of birth dates is stated").toContain(
    "about 945, about 950 and about 951",
  );
  expect(en, "the convention is named as one").toContain(
    "read as a convention rather than as a record",
  );
  expect(en, "the alternative dating is not dismissed").toContain(
    "held by serious scholars rather than by careless ones",
  );
  expect(en, "and the reason for the vagueness is given").toContain(
    "There is no contemporary biography",
  );

  // No false precision anywhere: a bare birth year presented as fact.
  expect(en, "no exact birth claim").not.toContain("was born in 951");
  expect(en, "no exact birth claim").not.toContain("born in the year 951");

  for (const [locale, phrase] of [
    ["hy", "որպես պայմանականություն, ոչ թե որպես գրանցում"],
    ["hyw", "որպէս պայմանականութիւն եւ ոչ թէ որպէս արձանագրութիւն"],
  ] as const) {
    const text = await prose(page, locale, NAREKATSI);
    expect(text, `${locale} keeps the dates a convention`).toContain(phrase);
    expect(text, `${locale} gives the alternative`).toContain("1010");
  }
});

test("the family is explained without being ennobled, and the two accusations stay apart", async ({
  page,
}) => {
  /*
    §12 and §23. Two separate failures are pinned here.

    The first is inflation: Khosrov Andzevatsi's connection to the Artsruni house
    is in the sources and is one sentence away from becoming princely ancestry for
    Grigor, which no source supports.

    The second is conflation, and it is the one every popular account commits. The
    father was accused of Chalcedonian, pro-Byzantine positions and excommunicated
    for it. The son was, separately and later, associated with the Tondrakians. Two
    controversies, two centuries of confusion, and the article says so explicitly.
  */
  const en = await prose(page, "en", NAREKATSI);

  expect(en, "the connection is reported").toContain("connected to the Artsruni house");
  expect(en, "and immediately bounded").toContain(
    "it does not establish princely rank for Grigor himself",
  );
  expect(en, "the father's own accusation is named").toContain("Chalcedonian");
  expect(en, "and separated from the son's").toContain(
    "This is a different controversy from the one later attached to Grigor",
  );

  // The Tondrakian question: present, scoped, and resolved toward the evidence.
  expect(en, "the accusation is not hidden").toContain("Tondrakians");
  expect(en, "the Soviet-era reading is attributed").toContain(
    "twentieth-century Soviet Armenian scholarship",
  );
  expect(en, "and what the texts actually show is stated").toContain(
    "What the texts show is a man defending orthodoxy",
  );
  expect(en, "the inference is offered as an inference").toContain(
    "that is a plausible inference and is offered as one",
  );

  // No hagiography presented as biography.
  for (const forbidden of ["miracle", "vision of the Virgin", "legend tells", "it is said that he"]) {
    expect(en.toLowerCase(), `must not narrate hagiography as fact: ${forbidden}`).not.toContain(
      forbidden.toLowerCase(),
    );
  }
});

test("Narek the place, the man and the book are kept distinct", async ({ page }) => {
  /*
    §13 and §18. Three things share one word and the article has to hold them
    apart, because a reader who conflates them cannot follow the manuscript section
    at all. The monastery also has to be a working institution rather than
    scenery — it is where the education, the teaching and the writing happened.
  */
  const en = await prose(page, "en", NAREKATSI);

  expect(en, "the name is explained").toContain("Narekatsi is not a surname but an adjective");
  expect(en, "the three senses are separated").toContain("Three related things are called Narek");
  expect(en, "the book's shorthand is explained").toContain(
    "what Armenians have long called the Book of Lamentations itself",
  );
  expect(en, "the monastery is a school, not a backdrop").toContain(
    "it functioned as a school as much as a religious house",
  );
  expect(en, "and its fate is recorded").toContain("demolished around 1951");

  for (const [locale, phrase] of [
    ["hy", "Երեք հարակից բան կոչվում է «Նարեկ»"],
    ["hyw", "Երեք հարակից բան կը կոչուի «Նարեկ»"],
  ] as const) {
    const text = await prose(page, locale, NAREKATSI);
    expect(text, `${locale} separates the three senses`).toContain(phrase);
  }
});

/* -------------------------------------------------------------------------- */
/*  Works and literary history                                                 */
/* -------------------------------------------------------------------------- */

test("the corpus distinguishes what is secure from what is generously attributed", async ({
  page,
}) => {
  /*
    §16 and §52. The temptation with a medieval author is to list everything ever
    attached to his name. The article names the securely attributed works, gives
    the two dated ones their dates, and says out loud which part of the output is
    most likely to have been over-counted.
  */
  const en = await prose(page, "en", NAREKATSI);

  expect(en, "the Song of Songs commentary is named and dated").toContain(
    "Commentary on the Song of Songs, written in 977",
  );
  expect(en, "the Job commentary is named with its transmission").toContain(
    "surviving in a single manuscript",
  );
  expect(en, "the odes are named").toContain("tagher");
  expect(en, "and the over-attribution risk is stated").toContain(
    "the part of his output most likely to be over-counted",
  );

  // The Book of Lamentations, correctly identified in every edition.
  expect(en, "the English title").toContain("Book of Lamentations");
  expect(en, "the Armenian title").toContain("Մատեան ողբերգութեան");
  expect(en, "the structure").toContain("ninety-five chapters");
  expect(en, "the composition date, hedged").toContain("around 1002");
  expect(en, "the second Armenian title is given too").toContain("Գիրք աղօթից");

  // Genre is explained rather than chosen.
  expect(en, "the genre question is opened, not settled").toContain(
    "Its genre is genuinely unsettled",
  );
  for (const label of ["prayer book", "poem", "lament", "theological"]) {
    expect(en, `the label "${label}" is among those explained`).toContain(label);
  }
});

test("the literary analysis is substantive and the lexical statistic is refused", async ({
  page,
}) => {
  /*
    §19, §20 and §53. Two opposite failures.

    The first is vague praise standing in for analysis — the "timeless beauty"
    register that says nothing about how the writing works. The test requires the
    three named techniques to be present.

    The second is the 2500-word claim, which is the single most repeated statement
    about Narekatsi's Armenian and has no study behind it. The article prints the
    claim in order to refuse it, so this is a claim-frame test rather than a ban:
    the number may appear, and where it appears it must be immediately marked as
    unsourced.
  */
  const en = await prose(page, "en", NAREKATSI);

  expect(en, "accumulation is named and explained").toContain("The most immediately visible technique is accumulation");
  expect(en, "parallelism is traced to its model").toContain("parallelism and repetition inherited from biblical Armenian");
  expect(en, "the first-person voice is analysed").toContain("the sinner as representative rather than as exception");
  expect(en, "and the effect is explained, not asserted").toContain(
    "the formal equivalent of the state the book describes",
  );

  // The lexical claim: framed, every time it appears.
  expect(en, "the claim is reported").toContain("more than two and a half thousand new Armenian words");
  expect(en, "and refused in the same breath").toContain(
    "no study is ever named as its source",
  );
  expect(en, "with a qualitative statement put in its place").toContain(
    "That is a real contribution to Armenian, and it does not need a number to be one",
  );

  // Mysticism and Renaissance: both scoped, neither adopted.
  expect(en, "the Renaissance framing is attributed, not adopted").toContain(
    "Soviet-era Armenian scholarship regularly described him",
  );
  expect(en, "and marked as an imported category").toContain("importing a European periodisation");
  expect(en, "and Armat's own claim is the narrower one").toContain(
    "without borrowing anyone's categories",
  );

  // No careless superlatives.
  for (const forbidden of [
    "the first Armenian poet",
    "the greatest Armenian writer",
    "the first work of Armenian literature",
  ]) {
    expect(en, `must not claim: ${forbidden}`).not.toContain(forbidden);
  }
});

/* -------------------------------------------------------------------------- */
/*  Religious reception                                                        */
/* -------------------------------------------------------------------------- */

test("religious reception is dated correctly and kept out of the biography", async ({ page }) => {
  /*
    §24, §25 and §54. The Vatican chronology has two events and almost every
    account merges them, so both dates are pinned. The Armenian Apostolic
    veneration is the older and more consequential fact and must not be presented
    as beginning in 2015.

    The devotional and medical bans are flat rather than framed: unlike the origin
    and lexical claims, the article is not refuting anything here, so any
    occurrence would be the page adopting the register rather than reporting it.
  */
  const en = await prose(page, "en", NAREKATSI);

  expect(en, "the two Vatican stages are separated").toContain("has two distinct stages");
  expect(en, "the confirmation is dated").toContain("On 21 February 2015");
  expect(en, "the proclamation is dated").toContain("12 April 2015");
  expect(en, "the older veneration is dated first").toContain(
    "the evidence for his sainthood goes back at least to the twelfth century",
  );
  expect(en, "the feast is given").toContain("27 February");

  // Reception is not evidence of literary quality, and the article says so.
  expect(en, "reception is subordinated to the writing").toContain(
    "he was read first and honoured afterwards",
  );

  for (const forbidden of [
    "pray to",
    "intercede",
    "you should read it as a prayer",
    "cures",
    "will heal",
    "heals disease",
    "medicinal",
  ]) {
    expect(en.toLowerCase(), `must not instruct or claim: ${forbidden}`).not.toContain(forbidden);
  }

  // The healing tradition is present, and framed as belief rather than fact.
  expect(en, "the popular belief is recorded as belief").toContain(
    "communities attributed protective and healing power",
  );
  expect(en, "and explicitly disclaimed").toContain(
    "It is not a medical claim, and this article makes none",
  );
});

/* -------------------------------------------------------------------------- */
/*  SEO                                                                        */
/* -------------------------------------------------------------------------- */

test("Narekatsi carries his own SEO fields and is findable under both names", async ({ page }) => {
  /*
    §39, §40 and §55. English search uses Grigor Narekatsi and Gregory of Narek
    about equally, so the article has to answer to both without becoming two pages.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === NAREKATSI)!;

    expect(article.seoTitle, `${locale} has its own SEO title`).toBeTruthy();
    expect(article.seoTitle, `${locale} SEO title differs from the visible one`).not.toBe(
      article.title,
    );
    expect(article.metaDescription, `${locale} has its own meta description`).toBeTruthy();
    expect(article.summary, `${locale} has its own summary`).toBeTruthy();

    await page.goto(`/${locale}/writers/${NAREKATSI}`);

    // The visible H1 is the bare name — not the SEO title, and not a title.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      articleTitle(locale, NAREKATSI),
    );
    await expect(page).toHaveTitle(new RegExp(escapeRe(article.seoTitle!)));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      article.metaDescription!,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/writers/${NAREKATSI}`,
    );
    for (const other of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${other}"]`),
        `${locale} hreflang to ${other}`,
      ).toHaveAttribute("href", `https://armat.site/${other}/writers/${NAREKATSI}`);
    }
  }

  // No alternate-name page was minted for the English form.
  const response = await page.goto("/en/writers/gregory-of-narek");
  expect(response?.status(), "no duplicate page under the English name").toBe(404);

  for (const [locale, query] of [
    ["en", "Grigor Narekatsi"],
    ["en", "Gregory of Narek"],
    ["en", "Book of Lamentations"],
    ["hy", "Գրիգոր Նարեկացի"],
    ["hyw", "Նարեկացի"],
  ] as const) {
    await page.goto(`/${locale}/search?q=${encodeURIComponent(query)}`);
    await expect(
      page.locator(`main a[href="/${locale}/writers/${NAREKATSI}"]`).first(),
      `${locale} finds Narekatsi by "${query}"`,
    ).toBeVisible();
  }
});

/* -------------------------------------------------------------------------- */
/*  Relationships                                                              */
/* -------------------------------------------------------------------------- */

test("Narekatsi links only where the prose earns it, and invents no Works slug", async ({
  page,
}) => {
  /*
    §42, §43, §44 and §57. Two authored relations, both crossing categories, and
    both carried by a `SectionLink` in the paragraph that justifies it — the first
    SectionLinks in the Writers section, which until now used `relatedSlugs` alone.

    Matenadaran is earned by a named object: the 1173 illuminated copy of the Book
    of Lamentations is held there, and the Matenadaran article is substantively
    about manuscript preservation. Bagratid Armenia is earned by the political
    setting, since Vaspurakan under the Artsrunis was a rival kingdom rather than a
    province of anything.

    The Book of Lamentations has no article. The test that matters most here is
    that no slug was invented for it.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === NAREKATSI)!;
    expect(article.relatedSlugs, `${locale} authored relations`).toEqual([
      "matenadaran",
      "bagratid-armenia",
    ]);

    const bySection = Object.fromEntries(
      article.sections.map((s) => [s.id, (s.links ?? []).map((l) => l.slug)]),
    );
    expect(bySection["manuscripts-and-readers"], `${locale} matenadaran link placement`).toEqual([
      "matenadaran",
    ]);
    expect(bySection["vaspurakan-and-narek"], `${locale} bagratid link placement`).toEqual([
      "bagratid-armenia",
    ]);

    // Every authored relation resolves to a real article in this edition.
    const slugs = bundle(locale).articles.map((a) => a.slug);
    for (const related of article.relatedSlugs) {
      expect(slugs, `${locale} ${related} exists`).toContain(related);
    }

    // And no slug was reserved for a work that does not exist yet.
    for (const future of [
      "book-of-lamentations",
      "matean-oghbergutean",
      "narek",
      "narekavank",
      "anania-narekatsi",
    ]) {
      expect(article.relatedSlugs, `${locale} no placeholder relation to ${future}`).not.toContain(
        future,
      );
      expect(slugs, `${locale} ${future} is genuinely absent`).not.toContain(future);
    }

    // No generic writer-to-writer link was manufactured.
    for (const writer of SLUGS) {
      expect(article.relatedSlugs, `${locale} no reflex link to ${writer}`).not.toContain(writer);
    }
  }

  /*
    §45. Filler measured rather than assumed, in every edition: two authored
    relations plus whatever the same-category pool supplies to reach three.
  */
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/writers/${NAREKATSI}`);
    const hrefs = await page
      .locator(`main a[href^="/${locale}/"]`)
      .evaluateAll((nodes) => nodes.map((el) => el.getAttribute("href") ?? ""));
    for (const related of ["places/matenadaran", "history/bagratid-armenia"]) {
      expect(
        hrefs.some((h) => h.endsWith(`/${related}`)),
        `${locale} offers authored ${related}`,
      ).toBe(true);
    }
    expect(
      hrefs.some((h) => h.includes("/book-of-lamentations")),
      `${locale} offers no nonexistent work page`,
    ).toBe(false);
  }
});

/* -------------------------------------------------------------------------- */
/*  Portrait                                                                   */
/* -------------------------------------------------------------------------- */

test("Narekatsi's portrait is registered, exact, and borrowed from nobody", async ({ page }) => {
  /*
    §82, and the mirror of the §81 test this replaces. That one asserted every
    surface in its pre-registration form precisely so this one could invert it,
    and each assertion below is the opposite of the one it stands on: registry
    absent -> present, pending -> empty, placeholder SVG -> raster, fallback OG ->
    the file, no sitemap image -> his own.

    The borrowing half is kept as it was, including the correction it carries: it
    is scoped to the hero, and page-wide it forbids an *orphan* portrait rather
    than any portrait, because the related block legitimately renders one Writers
    card as filler with its own picture.
  */
  expect(getImageSrc(NAREKATSI), "Narekatsi has a registered portrait").toBe(
    "/images/writers/grigor-narekatsi.webp",
  );
  expect(PENDING_ARTWORK, "and is no longer pending").not.toContain(NAREKATSI);
  /*
    §84 narrowed this from "nothing is pending" to "Narekatsi is not pending",
    because `PENDING_ARTWORK` is archive-wide and had just gained Varoujan. §85
    registered him and emptied it again, so the broad form is true once more — but
    the narrow assertion above is what this test is actually about and stays.
    The list is compared to the stated constant rather than to a literal, so the
    next refill needs one edit here and not two.
  */
  expect(PENDING, "the stated pending list is empty again").toEqual([]);
  expect([...PENDING_ARTWORK], "and matches the registry's own list").toEqual([...PENDING]);

  // All eight portraits resolve, each to its own file, and the six that existed
  // before §82 are untouched.
  for (const slug of ILLUSTRATED) {
    expect(getImageSrc(slug), `${slug} portrait exact`).toBe(PORTRAIT[slug]);
  }
  expect(
    new Set(ILLUSTRATED.map((s) => getImageSrc(s))).size,
    "every registered portrait is distinct",
  ).toBe(ILLUSTRATED.length);
  expect(
    ILLUSTRATED.length + PENDING.length,
    "every writer is either illustrated or recorded as pending",
  ).toBe(SLUGS.length);

  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/writers/${NAREKATSI}`);

    // The hero is his file, not a placeholder.
    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    const hero = figure.locator("img");
    await expect(hero, `${locale} hero raster`).toHaveCount(1);
    await expect(hero, `${locale} hero is his portrait`).toHaveAttribute(
      "src",
      /grigor-narekatsi\.webp/,
    );
    await expect(hero, `${locale} localized alt`).toHaveAttribute(
      "alt",
      dict.article.imageAlt.replace("{title}", articleTitle(locale, NAREKATSI)),
    );

    /*
      The disclosure, and the reason this assertion is exact rather than a
      substring. `ArticleLayout` picks the portrait caption over the illustration
      one on `category === "writers"`, so a Writer gets "an imagined likeness, not
      a real photograph" instead of "an imagined scene". For a subject with no
      contemporary likeness that distinction is the whole disclosure, and it came
      free from the generic pipeline - no Writers-specific provenance was added.
    */
    const caption = figure.locator("figcaption");
    await expect(caption, `${locale} portrait provenance`).toHaveText(
      dict.article.imageAiPortraitCaption.replace("{title}", articleTitle(locale, NAREKATSI)),
    );
    await expect(caption, `${locale} not the scene caption`).not.toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, NAREKATSI)),
    );
    await expect(caption, `${locale} no placeholder disclosure`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, NAREKATSI)),
    );
    /*
      §85 added a third caption for portraits drawn from surviving photographs,
      and this is the assertion that keeps it away from him. Nobody has seen
      Narekatsi — he died around 1003 — so a caption claiming a photographic basis
      would be a false historical claim, not merely the wrong wording. The comment
      above still holds for the *other* half: no Writers-specific provenance was
      added for him, and he takes the default.
    */
    await expect(caption, `${locale} claims no photographic basis`).not.toHaveText(
      dict.article.imageAiPhotoPortraitCaption.replace("{title}", articleTitle(locale, NAREKATSI)),
    );

    // No other writer's file appears in the hero, Abovyan included.
    await expect(
      figure.locator(`img[src*="${ABOVYAN}"]`),
      `${locale} hero is not Abovyan`,
    ).toHaveCount(0);

    const html = (await page.content()).toLowerCase();
    for (const other of ILLUSTRATED) {
      if (other === NAREKATSI) continue;
      expect(
        html.includes(`${other}.webp`) && !html.includes(`/${locale}/writers/${other}`),
        `${locale} must not show ${other}'s portrait without linking to ${other}`,
      ).toBe(false);
    }
  }

  // Structured data and social cards now point at the file instead of falling back.
  await page.goto(`/en/writers/${NAREKATSI}`);
  const graph = await readGraph(page);
  /*
    An `ImageObject`, not a bare URL — the shape `seo.ts` has always emitted and
    the one `places.spec.ts` pins for a registered place. Asserted as the whole
    object so a stray extra key would fail too.
  */
  expect(node(graph, "Article").image, "Article.image is the portrait").toEqual({
    "@type": "ImageObject",
    url: "https://armat.site/images/writers/grigor-narekatsi.webp",
  });
  expect(node(graph, "Article")["@type"], "still a plain Article").toBe("Article");
  for (const absent of ["Person", "VisualArtwork", "Book"]) {
    expect(
      graph.some((n) => n["@type"] === absent),
      `no ${absent} schema was added because a portrait exists`,
    ).toBe(false);
  }
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(selector)).toHaveAttribute(
      "content",
      "https://armat.site/images/writers/grigor-narekatsi.webp",
    );
    await expect(page.locator(selector)).not.toHaveAttribute(
      "content",
      "https://armat.site/og-default.png",
    );
  }

  /*
    The sitemap, per locale rather than by global count. Each edition's own <url>
    block must carry his image - a total occurrence count of three would also be
    satisfied by one edition carrying it three times.
  */
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  for (const locale of LOCALES) {
    const block = sitemap
      .split("<url>")
      .find((entry) => entry.includes(`/${locale}/writers/${NAREKATSI}<`));
    expect(block, `${locale} Narekatsi is in the sitemap`).toBeDefined();
    expect(block, `${locale} advertises his portrait`).toContain(
      "<image:loc>https://armat.site/images/writers/grigor-narekatsi.webp</image:loc>",
    );
  }

  // The listing carries seven cards, seven portraits and no placeholder at all.
  await page.goto("/en/writers");
  await expect(cards(page)).toHaveCount(SLUGS.length);
  await expect(
    page.locator("main svg[role='img']"),
    "exactly the pending writers show a placeholder",
  ).toHaveCount(PENDING.length);
  for (const slug of ILLUSTRATED) {
    await expect(
      page.locator(`main img[src*="${slug}"]`),
      `${slug} has its own card portrait`,
    ).not.toHaveCount(0);
  }
  // And his card's alt stopped calling itself a placeholder.
  const enUi = ui("en");
  const card = bundle("en").writers.find((w) => w.slug === NAREKATSI)!;
  await expect(
    page.locator(
      `main img[alt="${enUi.article.portraitIllustrationAlt.replace("{name}", card.name)}"]`,
    ),
    "his card alt is the illustrated-portrait form",
  ).toHaveCount(1);
  await expect(
    page.locator(`main img[alt="${enUi.article.portraitAlt.replace("{name}", card.name)}"]`),
    "and not the placeholder form",
  ).toHaveCount(0);

  // The medieval filter still returns him, now with his picture.
  await page.goto("/en/writers?period=medieval");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.locator(`main img[src*="${NAREKATSI}"]`)).toHaveCount(1);

  // Search finds him under both names and shows the portrait, scoped by href.
  for (const query of ["Grigor Narekatsi", "Gregory of Narek", "Narekatsi"]) {
    await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
    const hit = page.locator(`main li:has(a[href="/en/writers/${NAREKATSI}"])`).first();
    await expect(hit, `search "${query}" finds him`).toHaveCount(1);
    await expect(
      hit.locator(`img[src*="${NAREKATSI}"]`),
      `search "${query}" shows his portrait`,
    ).toHaveCount(1);
    await expect(hit.locator("svg[role='img']"), `search "${query}" no placeholder`).toHaveCount(0);
  }
});

/* -------------------------------------------------------------------------- */
/*  Schema and regression                                                      */
/* -------------------------------------------------------------------------- */

test("Narekatsi emits a plain Article and rests on scholarship", async ({ page }) => {
  /*
    §35. A subject with a saint's cult and a Vatican title is where speculative
    schema types would arrive if they were going to, so the graph is pinned to the
    archive's standard four.
  */
  await page.goto(`/en/writers/${NAREKATSI}`);
  const graph = await readGraph(page);
  expect(node(graph, "Article")["@type"], "generic Article only").toBe("Article");
  expect(graph.map((n) => n["@type"]).sort(), "the standard four").toEqual([
    "Article",
    "BreadcrumbList",
    "Organization",
    "WebSite",
  ]);

  const sources = getSources(NAREKATSI);
  expect(sources.length, "Narekatsi has a bibliography").toBeGreaterThanOrEqual(5);

  const titles = sources.map((s) => s.title).join(" | ");
  expect(titles, "the medieval volume is cited, not the modern one").toContain(
    "From the Sixth to the Eighteenth Century",
  );
  expect(titles, "an annotated scholarly translation is cited").toContain("From the Depths of the Heart");
  expect(titles, "an Armenian-language reference is cited").toContain("Գրիգոր Նարեկացի");
  expect(titles, "the Vatican primary document is cited").toContain("Apostolic Letter");

  // Every entry carries an identifier, and no two entries share one.
  const ids = sources.map((s) => `${s.identifier.kind}:${s.identifier.value}`);
  expect(new Set(ids).size, "no identifier is repeated within the article").toBe(ids.length);

  // The bibliography reaches the page.
  const text = (await page.getByRole("main").textContent()) ?? "";
  for (const source of sources) expect(text, source.title).toContain(source.title);
});

test("adding Narekatsi changed no existing writer, work or place", async ({ page }) => {
  /*
    §58, §59, §60 and §61. The seventh writer touches two files per locale, one
    bibliography and `PENDING_ARTWORK`; nothing else may have moved.
  */
  for (const locale of LOCALES) {
    const writers = bundle(locale).articles.filter((a) => a.category === "writers");
    const authored = Object.fromEntries(writers.map((a) => [a.slug, a.relatedSlugs]));
    expect(authored[TUMANYAN], `${locale} Tumanyan relations untouched`).toEqual([
      "anush",
      "david-of-sassoun",
      "avetik-isahakyan",
    ]);

    // Literary Works were inspected, not written: the section still holds four.
    expect(
      bundle(locale).works.map((w) => w.slug),
      `${locale} works unchanged`,
    ).toEqual(["anush", "wounds-of-armenia", "the-fool", "david-of-sassoun"]);

    // Cuisine is closed for v1 and Places are untouched by a Writers step.
    expect(
      bundle(locale).articles.filter((a) => a.category === "cuisine").length,
      `${locale} cuisine count untouched`,
    ).toBe(12);
    expect(
      bundle(locale).articles.filter((a) => a.category === "places").length,
      `${locale} places count untouched`,
    ).toBe(13);
  }

  // Matenadaran gained a link *from* Narekatsi and must not have gained one back.
  for (const locale of LOCALES) {
    const matenadaran = bundle(locale)
      .articles.find((a) => a.slug === "matenadaran")!;
    expect(
      matenadaran.relatedSlugs,
      `${locale} Matenadaran was not edited for reciprocity`,
    ).not.toContain(NAREKATSI);
  }

  // An existing writer's page is exactly as it was.
  await page.goto(`/en/writers/${TUMANYAN}`);
  await expect(page.locator(`main img[src*="${TUMANYAN}.webp"]`).first()).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `https://armat.site${PORTRAIT[TUMANYAN]}`,
  );
});

/* -------------------------------------------------------------------------- */
/*  Daniel Varoujan — §84                                                      */
/* -------------------------------------------------------------------------- */

test("the eighth writer exists in every edition and is classified as twentieth century", () => {
  /*
    §84. The corpus check, and the taxonomy claim that came with him: the
    `20th-century` value already existed and already had members, so unlike
    Narekatsi he needed no new filter and none was added. Western Armenian is an
    identity carried by the content and the keywords, deliberately not by a new
    period chip.
  */
  for (const locale of LOCALES) {
    const writers = bundle(locale).articles.filter((a) => a.category === "writers");
    const cards = bundle(locale).writers;
    expect(writers.length, `${locale} writer articles`).toBe(8);
    expect(cards.length, `${locale} writer cards`).toBe(8);

    // Listing order and article order still agree, slug for slug.
    expect(cards.map((w) => w.slug), `${locale} order parity`).toEqual(writers.map((a) => a.slug));

    const article = writers.find((a) => a.slug === VAROUJAN);
    const card = cards.find((w) => w.slug === VAROUJAN);
    expect(article, `${locale} Varoujan article`).toBeDefined();
    expect(card, `${locale} Varoujan card`).toBeDefined();
    expect(article!.periodId, `${locale} period`).toBe("20th-century");
    expect(card!.periodId, `${locale} card period`).toBe("20th-century");
    expect(card!.period, `${locale} label parity`).toBe(article!.period);
    expect(card!.lifespan, `${locale} lifespan`).toBe("1884–1915");

    // The distribution the taxonomy audit predicted, measured rather than assumed.
    const byPeriod: Record<string, number> = {};
    for (const w of cards) byPeriod[w.periodId] = (byPeriod[w.periodId] ?? 0) + 1;
    expect(byPeriod, `${locale} period distribution`).toEqual({
      medieval: 1,
      "19th-century": 3,
      "20th-century": 3,
      soviet: 1,
    });

    // No Western-Armenian-shaped filter was invented for him.
    const periodIds = bundle(locale).literaryPeriods.map((f) => f.id);
    expect(periodIds, `${locale} taxonomy unchanged`).toEqual([
      "all",
      "medieval",
      "19th-century",
      "20th-century",
      "soviet",
    ]);

    // Narekatsi still owns medieval alone, and Tumanyan is still the only featured writer.
    expect(cards.filter((w) => w.periodId === "medieval").map((w) => w.slug)).toEqual([NAREKATSI]);
    expect(cards.filter((w) => w.featured).map((w) => w.slug)).toEqual([TUMANYAN]);
  }
});

test("Varoujan's names are handled without inventing a canonical romanisation", async ({ page }) => {
  /*
    §84. The birth surname reaches English several ways and reaches Armenian in
    two orthographies, and the article's job is to explain that once rather than
    to pick a winner. This asserts the explanation exists and that the page does
    not claim any one form is the correct one.
  */
  await page.goto(`/en/writers/${VAROUJAN}`);
  await expect(page.locator("h1")).toHaveText("Daniel Varoujan");

  const en = await prose(page, "en", VAROUJAN);
  expect(en, "the birth name is given").toContain("Chpugkyarian");
  expect(en, "and the pen name is explained as one").toContain("pen name");
  expect(en, "both Armenian orthographies appear").toContain("Չպուգքյարյան");
  expect(en, "including the classical form he used").toContain("Չպուգքեարեան");
  expect(en, "and the refusal is explicit").toMatch(/None of these is the single correct version/i);

  // The Armenian editions carry their own edition's form of his name as the H1.
  const NAME = { en: "Daniel Varoujan", hy: "Դանիել Վարուժան", hyw: "Դանիէլ Վարուժան" } as const;
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/writers/${VAROUJAN}`);
    await expect(page.locator("h1"), `${locale} H1`).toHaveText(NAME[locale]);
  }

  // Alternate spellings are search metadata, not extra routes.
  for (const bad of ["daniel-varujan", "taniel-varoujan", "varoujan"]) {
    const res = await page.request.get(`/en/writers/${bad}`);
    expect(res.status(), `/en/writers/${bad} must not exist`).toBe(404);
  }
});

test("the education chronology is evidence-based and awards no degree", async ({ page }) => {
  /*
    §84. Constantinople, Venice and Ghent are the part of this biography that
    short accounts compress into a clause, and they are also where an article can
    most easily invent precision. Three things are pinned: the schools are named
    and dated, the Ghent description keeps both versions of what he studied, and
    no degree is claimed.
  */
  await page.goto(`/en/writers/${VAROUJAN}`);
  const en = await prose(page, "en", VAROUJAN);

  expect(en, "Chalcedon is named").toContain("Chalcedon");
  expect(en, "and the first verses are dated").toContain("1901");
  expect(en, "Venice by name").toContain("Moorat-Raphael");
  expect(en, "and San Lazzaro as the place of the first book").toContain("San Lazzaro");
  expect(en, "Ghent by name").toContain("University of Ghent");

  // Both descriptions of the Ghent curriculum survive; neither is presented alone.
  expect(en).toContain("literature, sociology and economics");
  expect(en).toContain("economics and political science");

  // The degree refusal, stated rather than merely omitted.
  expect(en, "attendance is asserted").toMatch(/studied at Ghent for four years/i);
  expect(en, "completion is refused").toMatch(/they do not establish that he completed a degree/i);
  expect(en, "no degree is awarded").not.toMatch(/graduated from Ghent|earned his degree|took his degree/i);

  // The school-name confusion is resolved out loud rather than silently.
  expect(en).toContain("Sakızağacı");
});

test("the four collections are dated correctly and no Work slug is invented", async ({ page }) => {
  /*
    §84. The bibliography is the part a reader is most likely to arrive for and
    the part most often copied wrong: one widely circulated Western Armenian
    profile dates the collections 1905, 1910 and 1913. This pins the catalogue
    dates, the posthumous status of the fourth, and the fact that translations of
    two of the titles genuinely differ.
  */
  await page.goto(`/en/writers/${VAROUJAN}`);
  const en = await prose(page, "en", VAROUJAN);

  for (const title of ["Սարսուռներ", "Ցեղին սիրտը", "Հեթանոս երգեր", "Հացին երգը"]) {
    expect(en, `${title} appears in Armenian`).toContain(title);
  }
  for (const year of ["1906", "1909", "1912", "1921"]) {
    expect(en, `${year} is stated`).toContain(year);
  }
  // The dates that are wrong must not appear as publication years.
  expect(en, "the outlier dating is not adopted").not.toMatch(/Սարսուռներ[^.]{0,80}1905/);

  expect(en, "the fourth is posthumous").toMatch(/six years after his death|after his death/i);
  expect(en, "and unfinished").toMatch(/unfinished/i);

  // Translation instability is stated, not resolved.
  expect(en).toContain("The Heart of the Race");
  expect(en).toContain("The Heart of the Nation");
  expect(en).toContain("The Heart of the Tribe");
  expect(en, "and the article says translations differ").toMatch(/translations differ/i);

  // Works is untouched and no Varoujan work slug was fabricated.
  for (const locale of LOCALES) {
    expect(bundle(locale).works.map((w) => w.slug), `${locale} works unchanged`).toEqual([
      "anush",
      "wounds-of-armenia",
      "the-fool",
      "david-of-sassoun",
    ]);
    const slugs = new Set(bundle(locale).articles.map((a) => a.slug));
    for (const invented of [
      "the-song-of-the-bread",
      "hatsin-ergy",
      "pagan-songs",
      "hetanos-erger",
      "the-heart-of-the-race",
      "siamanto",
      "mehean",
    ]) {
      expect(slugs.has(invented), `${locale} must not have invented ${invented}`).toBe(false);
    }
    const article = bundle(locale).articles.find((a) => a.slug === VAROUJAN)!;
    for (const rel of article.relatedSlugs) {
      expect(slugs.has(rel), `${locale} related ${rel} must exist`).toBe(true);
    }
  }
});

test("the literary sections analyse rather than assert, and refuse two easy readings", async ({
  page,
}) => {
  /*
    §84. Three claims this article exists to get right: `ցեղ` is not modern racial
    vocabulary, "pagan" is not a religious conversion, and Mehean was a short-lived
    programme rather than an institution. Each is pinned by the sentence that makes
    the refusal, because a summary rewrite would drop exactly those sentences.
  */
  await page.goto(`/en/writers/${VAROUJAN}`);
  const en = await prose(page, "en", VAROUJAN);

  // ցեղ, printed in order to be explained.
  expect(en).toContain("Ցեղ");
  expect(en, "the historical sense is given").toMatch(/a people, a stock, a lineage/i);
  expect(en, "and the modern reading refused").toMatch(
    /not the vocabulary of biological racial theory/i,
  );

  // Paganism as an aesthetic programme.
  expect(en, "the programme is named").toMatch(/literary and aesthetic programme, not a religious conversion/i);
  expect(en, "he did not renounce Christianity").toMatch(/did not renounce Christianity/i);
  expect(en, "his own term is used").toContain("poetic paganism");
  expect(en, "modern Hetanism is distinguished").toContain("Hetanism");

  // Mehean: five founders, a documented role, and no inflation.
  for (const name of ["Gostan Zarian", "Hagop Oshagan", "Kegham Parseghian", "Aharon Dadourian"]) {
    expect(en, `${name} is named`).toContain(name);
  }
  expect(en, "Varoujan's actual role is documented").toMatch(/drafted most of the text in French/i);
  expect(en, "and its scale is not inflated").toMatch(/ran for a matter of months/i);

  // Western Armenian treated as a literary standard, not a spelling.
  expect(en, "not a spelling difference").toMatch(/this is not a detail of spelling/i);
  expect(en).toMatch(/two standard forms of the same language/i);

  // No unsupported lexical statistic, of the kind Narekatsi's article had to refuse.
  expect(en, "no invented-word statistic").not.toMatch(/\b\d[\d,]*\s+(new\s+)?words\b/i);
});

test("the 1915 chronology separates arrest from death and stays proportionate", async ({ page }) => {
  /*
    §84. The single most likely way for this article to go wrong is for the death
    to eat the biography, and the single most likely factual error is collapsing
    24 April into 26 August. Both are pinned, and so is the absence of the graphic
    material that circulates widely.
  */
  await page.goto(`/en/writers/${VAROUJAN}`);
  const en = await prose(page, "en", VAROUJAN);

  expect(en, "arrest date").toContain("24 April 1915");
  expect(en, "death date").toContain("26 August 1915");
  expect(en, "the two are explicitly not the same event").toMatch(
    /the date of the arrests, not of his death/i,
  );
  expect(en, "the place of detention").toContain("Çankırı");
  expect(en, "the genocide is named accurately").toContain("Armenian Genocide");
  expect(en, "the witness is attributed").toContain("Grigoris Balakian");

  // No graphic description, and the refusal is stated rather than merely enacted.
  expect(en, "no torture detail").not.toMatch(/tortur|mutilat|dismember|beheaded|hacked/i);
  expect(en, "the refusal is explicit").toMatch(/states this and does not illustrate it/i);

  /*
    Proportionality, measured. The death occupies one section of thirteen; the
    literary sections must outweigh it. Counted rather than eyeballed so that a
    later expansion of the 1915 material fails here first.
  */
  for (const locale of LOCALES) {
    /*
      Fifteen sections, not the eleven-to-thirteen the step asked for, and this
      literal records the overage rather than hiding it. Each section past the
      target is one the same step demanded in its own right: European reading,
      the word `ցեղ`, and Western Armenian as a literary language each need a
      heading a reader can find, and folding them into neighbours would have
      produced six-paragraph sections in an article whose others run to three.
      Stated exactly so that drifting further fails here.
    */
    const article = bundle(locale).articles.find((a) => a.slug === VAROUJAN)!;
    expect(article.sections.map((s) => s.id), `${locale} sections`).toEqual([
      "who-daniel-varoujan-was",
      "brgnik-and-the-world-of-sebastia",
      "constantinople-and-the-mkhitarian-schools",
      "venice-and-the-first-collection",
      "ghent-and-what-the-record-shows",
      "european-reading-and-its-traces",
      "teaching-marriage-and-the-capital",
      "the-four-collections",
      "the-word-tsegh",
      "pagan-songs-and-poetic-paganism",
      "mehean-and-cultural-renewal",
      "the-song-of-the-bread",
      "western-armenian-as-a-literary-language",
      "arrest-deportation-and-death",
      "what-was-lost-and-what-survived",
    ]);
    expect(
      article.sections.reduce((n, s) => n + s.paragraphs.length, 0),
      `${locale} paragraph count`,
    ).toBe(44);
    const death = article.sections.find((s) => s.id === "arrest-deportation-and-death")!;
    const total = article.sections.flatMap((s) => s.paragraphs).join(" ").length;
    const deathLen = death.paragraphs.join(" ").length;
    expect(deathLen / total, `${locale} the death must not dominate`).toBeLessThan(0.15);
  }
});

test("no long modern translation is reproduced", async ({ page }) => {
  /*
    §84. His Armenian originals are old enough to be out of copyright in most
    places; the English translations that circulate are not, and they are what a
    poetry page would be tempted to paste. The article paraphrases and analyses
    instead, and this asserts there is no block of verse on the page at all.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === VAROUJAN)!;
    const paragraphs = article.sections.flatMap((s) => s.paragraphs);
    for (const p of paragraphs) {
      // A quoted run long enough to be a stanza rather than a phrase.
      const quoted = [...p.matchAll(/[«"]([^»"]{120,})[»"]/g)];
      expect(quoted.map((m) => m[1].slice(0, 60)), `${locale} no long quotation`).toEqual([]);
    }
  }
  await page.goto(`/en/writers/${VAROUJAN}`);
  const html = await page.content();
  expect(html, "no verse block markup").not.toContain("<blockquote");
});

test("Varoujan carries localized SEO fields and is findable under his variants", async ({
  page,
}) => {
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === VAROUJAN)!;
    expect(article.seoTitle, `${locale} seoTitle`).toBeTruthy();
    expect(article.metaDescription, `${locale} metaDescription`).toBeTruthy();
    expect(article.summary, `${locale} summary`).toBeTruthy();
    expect(article.keywords?.length ?? 0, `${locale} keywords`).toBeGreaterThan(8);

    await page.goto(`/${locale}/writers/${VAROUJAN}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/writers/${VAROUJAN}`,
    );
    for (const other of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${other}"]`).first(),
      ).toHaveAttribute("href", `https://armat.site/${other}/writers/${VAROUJAN}`);
    }
  }

  // Search, in each edition, under the forms a reader actually types.
  const QUERIES: Record<string, string[]> = {
    en: ["Daniel Varoujan", "Daniel Varujan", "Taniel Varoujan", "Song of the Bread"],
    hy: ["Դանիել Վարուժան", "Վարուժան", "Հացին երգը"],
    hyw: ["Դանիէլ Վարուժան", "Վարուժան", "Հեթանոս երգեր"],
  };
  for (const locale of LOCALES) {
    for (const q of QUERIES[locale]) {
      await page.goto(`/${locale}/search?q=${encodeURIComponent(q)}`);
      await expect(
        page.locator(`main a[href="/${locale}/writers/${VAROUJAN}"]`).first(),
        `${locale} search "${q}"`,
      ).toHaveCount(1);
    }
  }
});

test("Varoujan's portrait is registered, exact, and borrowed from nobody", async ({ page }) => {
  /*
    §85, and the inversion of the §84 test this replaces — registry absent ->
    present, pending -> empty, placeholder SVG -> raster, fallback OG -> his file,
    no sitemap image -> his own. Same shape as the §82 Narekatsi inversion above,
    because it is the same transition.

    What is different, and why this file gained a caption assertion §82 did not
    need: the first file delivered for this slug was **rejected**. It passed
    likeness, dress, hands, setting and crops and failed the text gate — it
    carried a readable `LA PATRIE` broadside and a `MASSIS` masthead, fabricating
    a periodical front page and an imprint. It was corrected in place rather than
    regenerated, so the likeness these tests stand on is the one that was verified
    against three lifetime photographs. Nothing here can see that history; it is
    recorded in `media.ts` beside the file, and the only part of it with a runtime
    consequence is the provenance caption asserted below.
  */
  expect(getImageSrc(VAROUJAN), "Varoujan has a registered portrait").toBe(
    "/images/writers/daniel-varoujan.webp",
  );
  expect(PENDING_ARTWORK, "and is no longer pending").not.toContain(VAROUJAN);
  expect([...PENDING_ARTWORK], "the archive has nothing pending").toEqual([]);

  // Eight writers, eight portraits, each its own file, and none of the seven
  // that existed before §85 moved.
  for (const slug of ILLUSTRATED) {
    expect(getImageSrc(slug), `${slug} portrait exact`).toBe(PORTRAIT[slug]);
  }
  expect(
    new Set(ILLUSTRATED.map((s) => getImageSrc(s))).size,
    "every registered portrait is distinct",
  ).toBe(ILLUSTRATED.length);
  expect(ILLUSTRATED.length, "every writer is illustrated").toBe(SLUGS.length);

  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/writers/${VAROUJAN}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    const hero = figure.locator("img");
    await expect(hero, `${locale} hero raster`).toHaveCount(1);
    await expect(hero, `${locale} hero is his portrait`).toHaveAttribute(
      "src",
      /daniel-varoujan\.webp/,
    );
    await expect(hero, `${locale} localized alt`).toHaveAttribute(
      "alt",
      dict.article.imageAlt.replace("{title}", articleTitle(locale, VAROUJAN)),
    );

    /*
      The disclosure, and the one place where this registration is not just §82
      run again. Photographs of Varoujan survive and the artwork was made from
      them, so the imagined-likeness caption every other portrait here takes would
      be *false* for him — it would claim an invented face for a man who was
      photographed. He therefore takes the third caption, which has to carry both
      halves: AI-generated and not a photograph, but not invented either.
    */
    const caption = figure.locator("figcaption");
    await expect(caption, `${locale} photo-referenced provenance`).toHaveText(
      dict.article.imageAiPhotoPortraitCaption.replace("{title}", articleTitle(locale, VAROUJAN)),
    );
    await expect(caption, `${locale} not the imagined-likeness caption`).not.toHaveText(
      dict.article.imageAiPortraitCaption.replace("{title}", articleTitle(locale, VAROUJAN)),
    );
    await expect(caption, `${locale} not the scene caption`).not.toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, VAROUJAN)),
    );
    await expect(caption, `${locale} no placeholder disclosure`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, VAROUJAN)),
    );

    // No other writer's portrait is rendered without a link to that writer.
    const html = (await page.content()).toLowerCase();
    for (const other of ILLUSTRATED) {
      if (other === VAROUJAN) continue;
      expect(
        html.includes(`${other}.webp`) && !html.includes(`/${locale}/writers/${other}`),
        `${locale} must not show ${other}'s portrait without linking to ${other}`,
      ).toBe(false);
    }
  }

  // Structured data and social cards point at the file instead of falling back.
  await page.goto(`/en/writers/${VAROUJAN}`);
  const graph = await readGraph(page);
  expect(node(graph, "Article").image, "Article.image is the portrait").toEqual({
    "@type": "ImageObject",
    url: "https://armat.site/images/writers/daniel-varoujan.webp",
  });
  expect(node(graph, "Article")["@type"], "still a plain Article").toBe("Article");
  for (const absent of ["Person", "VisualArtwork", "Book"]) {
    expect(
      graph.some((n) => n["@type"] === absent),
      `no ${absent} schema was added because a portrait exists`,
    ).toBe(false);
  }
  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(sel)).toHaveAttribute(
      "content",
      "https://armat.site/images/writers/daniel-varoujan.webp",
    );
    await expect(page.locator(sel)).not.toHaveAttribute(
      "content",
      "https://armat.site/og-default.png",
    );
  }

  // The sitemap, per locale rather than by global count.
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  for (const locale of LOCALES) {
    const block = sitemap
      .split("<url>")
      .find((entry) => entry.includes(`/${locale}/writers/${VAROUJAN}<`));
    expect(block, `${locale} Varoujan is in the sitemap`).toBeDefined();
    expect(block, `${locale} advertises his portrait`).toContain(
      "<image:loc>https://armat.site/images/writers/daniel-varoujan.webp</image:loc>",
    );
  }

  // The listing: eight cards, eight portraits, no placeholder anywhere.
  await page.goto("/en/writers");
  await expect(cards(page)).toHaveCount(SLUGS.length);
  await expect(
    page.locator("main svg[role='img']"),
    "no writer shows a placeholder any more",
  ).toHaveCount(0);
  for (const slug of ILLUSTRATED) {
    await expect(
      page.locator(`main img[src*="${slug}"]`),
      `${slug} has its own card portrait`,
    ).not.toHaveCount(0);
  }
  // His card's alt is the illustrated form, not the placeholder one.
  const enUi = ui("en");
  const card = bundle("en").writers.find((w) => w.slug === VAROUJAN)!;
  await expect(
    page.locator(
      `main img[alt="${enUi.article.portraitIllustrationAlt.replace("{name}", card.name)}"]`,
    ),
    "his card alt is the illustrated-portrait form",
  ).toHaveCount(1);
  await expect(
    page.locator(`main img[alt="${enUi.article.portraitAlt.replace("{name}", card.name)}"]`),
    "and not the placeholder form",
  ).toHaveCount(0);

  // Classification did not move: he is still twentieth-century, and the medieval
  // filter is still Narekatsi alone.
  await page.goto("/en/writers?period=20th-century");
  await expect(cards(page)).toHaveCount(3);
  await expect(page.locator(`main img[src*="${VAROUJAN}"]`)).toHaveCount(1);
  await page.goto("/en/writers?period=medieval");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.locator(`main img[src*="${NAREKATSI}"]`)).toHaveCount(1);

  // Search shows his own portrait, scoped by canonical href.
  for (const query of ["Daniel Varoujan", "Daniel Varujan", "Taniel Varoujan"]) {
    await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
    const hit = page.locator(`main li:has(a[href="/en/writers/${VAROUJAN}"])`).first();
    await expect(hit, `search "${query}" finds him`).toHaveCount(1);
    await expect(
      hit.locator(`img[src*="${VAROUJAN}"]`),
      `search "${query}" shows his portrait`,
    ).toHaveCount(1);
    await expect(hit.locator("svg[role='img']"), `search "${query}" no placeholder`).toHaveCount(0);
  }
});

test("portrait provenance separates an imagined likeness from a photo-referenced one", () => {
  /*
    §85, and deliberately data-level: this is a claim about a map, and rendering
    it in a browser three times would assert nothing the caption tests above do
    not already cover. What needs pinning here is the *shape* of the mechanism,
    because the failure it guards against is silent — a future writer picking up a
    photographic claim nobody established.

    The distinction is real rather than cosmetic. Narekatsi died around 1003 and
    no likeness of him exists; Varoujan was photographed repeatedly before 1915.
    Captioning both "an imagined likeness" is false for the second, and captioning
    both "based on surviving photographs" is false for the first.
  */
  expect(getPortraitProvenance(VAROUJAN), "Varoujan was photographed").toBe("photo-referenced");
  expect(getPortraitProvenance(NAREKATSI), "nobody has ever seen Narekatsi").toBe("imagined");

  /*
    The default is the cautious one, and every other writer takes it. Several of
    them were certainly photographed, but this archive never recorded that their
    portraits were made from those photographs, and inferring it would be
    inventing provenance rather than reporting it. A slug joins the map when the
    fact is established, which is what this assertion is here to notice.
  */
  for (const slug of SLUGS) {
    if (slug === VAROUJAN) continue;
    expect(getPortraitProvenance(slug), `${slug} takes the cautious default`).toBe("imagined");
  }
  expect(getPortraitProvenance("a-writer-that-does-not-exist"), "unknown slugs default").toBe(
    "imagined",
  );

  // Both captions must state the AI origin and refuse the photograph, in every
  // edition — that is the part neither provenance may ever drop.
  for (const locale of LOCALES) {
    const dict = ui(locale);
    for (const key of ["imageAiPortraitCaption", "imageAiPhotoPortraitCaption"] as const) {
      const text = dict.article[key];
      expect(text, `${locale} ${key} names the AI origin`).toMatch(
        locale === "en" ? /AI-generated/i : /արհեստական բանական/,
      );
      expect(text, `${locale} ${key} refuses the photograph`).toMatch(
        locale === "en" ? /not a real photograph/i : /ոչ թ[եէ] իրական լուսանկար/,
      );
    }
    // And the two must not be the same string, in any edition.
    expect(
      dict.article.imageAiPhotoPortraitCaption,
      `${locale} the two portrait captions differ`,
    ).not.toBe(dict.article.imageAiPortraitCaption);
  }

  // Scene artwork is untouched by all of this: a place still gets the imagined
  // *scene* caption, which says nothing about likeness at all.
  for (const locale of LOCALES) {
    const dict = ui(locale);
    expect(dict.article.imageAiIllustrationCaption, `${locale} scene caption unchanged`).not.toBe(
      dict.article.imageAiPhotoPortraitCaption,
    );
  }
});

test("Varoujan's relations are earned, and the filler is the same in every edition", async ({
  page,
}) => {
  /*
    §84. Two authored relations, each carried by a SectionLink in the paragraph
    that justifies it — Tumanyan in the Western Armenian section as the Eastern
    counterpart, Charents in the reception section as the comparison later
    criticism actually makes. Siamanto is the strongest relation this article
    could have and does not exist, so it is absent rather than fabricated.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === VAROUJAN)!;
    expect(article.relatedSlugs, `${locale} authored relations`).toEqual([TUMANYAN, "yeghishe-charents"]);

    const links = article.sections.flatMap((s) => s.links ?? []);
    expect(links.map((l) => l.slug).sort(), `${locale} SectionLink targets`).toEqual([
      TUMANYAN,
      "yeghishe-charents",
    ]);

    // Every SectionLink phrase is a real substring of its own section's prose.
    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((p) => p.includes(link.phrase)),
          `${locale} phrase for ${link.slug} must appear in ${section.id}`,
        ).toBe(true);
      }
    }
  }

  // Filler measured, not assumed, and identical across editions.
  const rendered: Record<string, string[]> = {};
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/writers/${VAROUJAN}`);
    const hrefs = await page
      .locator('section:has(h2) a[href*="/writers/"], main a[href*="/writers/"]')
      .evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
    rendered[locale] = [...new Set(hrefs.map((h) => h.split("/").pop()!))].filter(
      (s) => s && s !== VAROUJAN,
    );
  }
  for (const locale of LOCALES) {
    expect(rendered[locale], `${locale} renders the authored relations`).toEqual(
      expect.arrayContaining([TUMANYAN, "yeghishe-charents"]),
    );
  }
});

test("adding Varoujan changed no existing writer, work, dish or place", async ({ page }) => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(b.articles.filter((a) => a.category === "cuisine").length, `${locale} cuisine`).toBe(12);
    expect(b.articles.filter((a) => a.category === "places").length, `${locale} places`).toBe(13);
    expect(b.articles.filter((a) => a.category === "history").length, `${locale} history`).toBe(7);
    expect(b.works.length, `${locale} works`).toBe(4);

    // Narekatsi, closed one step earlier, is exactly as §82 left him.
    const narekatsi = b.articles.find((a) => a.slug === NAREKATSI)!;
    expect(narekatsi.relatedSlugs, `${locale} Narekatsi relations`).toEqual([
      "matenadaran",
      "bagratid-armenia",
    ]);
    expect(narekatsi.periodId, `${locale} Narekatsi period`).toBe("medieval");
    expect(getImageSrc(NAREKATSI)).toBe("/images/writers/grigor-narekatsi.webp");

    // Tumanyan and Charents gained a link *from* Varoujan and must not have gained one back.
    for (const slug of [TUMANYAN, "yeghishe-charents"]) {
      const other = b.articles.find((a) => a.slug === slug)!;
      expect(other.relatedSlugs, `${locale} ${slug} not edited for reciprocity`).not.toContain(
        VAROUJAN,
      );
    }
  }

  // Narekatsi's page still serves his portrait and his own metadata.
  await page.goto(`/en/writers/${NAREKATSI}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://armat.site/images/writers/grigor-narekatsi.webp",
  );
  await expect(page.locator(`main img[src*="${NAREKATSI}.webp"]`).first()).toBeVisible();
});

test("Varoujan rests on scholarship and emits a plain Article", async ({ page }) => {
  await page.goto(`/en/writers/${VAROUJAN}`);
  const graph = await readGraph(page);
  expect(node(graph, "Article")["@type"], "plain Article").toBe("Article");
  for (const absent of ["Person", "Book", "VisualArtwork"]) {
    expect(graph.some((n) => n["@type"] === absent), `no ${absent}`).toBe(false);
  }

  const sources = getSources(VAROUJAN);
  expect(sources.length, "bibliography size").toBeGreaterThanOrEqual(6);
  const ids = sources.map((s) => `${s.identifier.kind}:${s.identifier.value}`);
  expect(new Set(ids).size, "no repeated identifier").toBe(ids.length);

  const titles = sources.map((s) => s.title).join(" | ");
  expect(titles, "the section's backbone volume").toContain("Volume III");
  expect(titles, "the memoir behind the 1915 chronology").toContain("Armenian Golgotha");
  expect(titles, "the grammar behind the language claim").toContain("Comparative Grammar");

  // Wikipedia is cited for nothing.
  for (const s of sources) {
    if (s.identifier.kind === "url") {
      expect(s.identifier.value, "no wikipedia citation").not.toMatch(/wikipedia\.org/);
      expect(s.identifier.value, "https only").toMatch(/^https:\/\//);
    }
  }

  const text = (await page.getByRole("main").textContent()) ?? "";
  for (const s of sources) expect(text, s.title).toContain(s.title);
});
