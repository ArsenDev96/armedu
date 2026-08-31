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
const SHNORHALI = "nerses-shnorhali";
const TUMANYAN = "hovhannes-tumanyan";
const ABOVYAN = "khachatur-abovyan";
const SIAMANTO = "siamanto";

/** Every writer in the section, as of §88. Stated, not derived. */
const SLUGS = [
  TUMANYAN,
  "yeghishe-charents",
  "raffi",
  "avetik-isahakyan",
  ABOVYAN,
  "paruyr-sevak",
  NAREKATSI,
  VAROUJAN,
  SHNORHALI,
  SIAMANTO,
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
  SHNORHALI,
  SIAMANTO,
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
 * §85 made `ILLUSTRATED` and `SLUGS` the same set again for the first time since
 * §81. §86 separated them once more for Writer #9, and §87 closed it: Nerses
 * Shnorhali's portrait was verified and registered, so the section was nine
 * writers, nine portraits and no placeholder — the first time Writers had been
 * complete since it was six.
 *
 * §88 separates them again for Writer #10. Siamanto's biography shipped without
 * his portrait, deliberately: the artwork is a separate step and the article is
 * not held back for it. Keeping the constant through the empty phase is what made
 * this a one-line edit, which is the whole reason it was never deleted.
 *
 * One thing about this entry is unlike every previous one. Siamanto was
 * photographed — a lifetime photograph of him at his desk in Boston survives — so
 * when the file lands he takes `photo-referenced` rather than the cautious
 * default, and `PORTRAIT_PROVENANCE` gains an entry. The test below asserts the
 * *absence* of that entry today, because adding it before there is a picture to
 * describe would be recording provenance for artwork nobody has made.
 *
 * §89 registered that portrait, so the list is empty for the twelfth time and the
 * section is complete for the first time at ten. The provenance entry the note
 * above anticipated now exists: he took `photo-referenced`, not the default, and
 * the assertion below points the opposite way from the one it replaced.
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
  "nerses-shnorhali": "/images/writers/nerses-shnorhali.webp",
  siamanto: "/images/writers/siamanto.webp",
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

test("the medieval filter has members, and returns exactly them", async ({ page }) => {
  /*
    §3. The `medieval` chip has existed in all three editions since the section was
    built and matched nothing the whole time — an empty filter that rendered a
    control leading to an empty page. Narekatsi was its first member, and this test
    exists so that the day it is emptied again is a failure rather than a shrug.

    §86 gives it a second, Nerses Shnorhali, which is the first time this filter
    has had to distinguish between two members rather than merely have one. The
    membership is asserted as an ordered list for that reason: a chip that returned
    the right count with the wrong writer would have passed the old form.
  */
  for (const locale of LOCALES) {
    const medieval = bundle(locale).writers.filter((w) => w.periodId === "medieval");
    expect(
      medieval.map((w) => w.slug),
      `${locale} medieval membership`,
    ).toEqual([NAREKATSI, SHNORHALI]);
  }

  await page.goto("/en/writers?period=medieval");
  await expect(cards(page)).toHaveCount(2);
  for (const slug of [NAREKATSI, SHNORHALI]) {
    await expect(
      page.getByRole("link", { name: articleTitle("en", slug), exact: true }).first(),
      `medieval filter shows ${slug}`,
    ).toBeVisible();
  }

  // And selecting it disturbed nothing: every other period returns what it did.
  for (const [period, count] of [
    ["19th-century", 3],
    // §84 moves this from two to three: Daniel Varoujan is the third
    // twentieth-century writer, and §88 moves it to four with Siamanto. Neither
    // needed a new filter value. This literal going red on each arrival is the
    // test working, not the test being stale.
    ["20th-century", 4],
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
    next refill needs one edit here and not two — which is exactly what §88 was,
    when Siamanto refilled it. The narrow assertion above is the one this test is
    about and is unaffected by that.
  */
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

  // The medieval filter still returns him with his picture. §86 gave it a second
  // member, so the count moves from one to two and his own card is asserted
  // directly rather than by being the only thing there.
  await page.goto("/en/writers?period=medieval");
  await expect(cards(page)).toHaveCount(2);
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
    // Stated against the section's own list rather than a literal: §86 added a
    // ninth writer and this assertion is about parity, not about the number.
    expect(writers.length, `${locale} writer articles`).toBe(SLUGS.length);
    expect(cards.length, `${locale} writer cards`).toBe(SLUGS.length);

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
      // §86 moves medieval from one to two with Nerses Shnorhali, who needed no
      // new filter value either. Same reasoning as the 20th-century line below.
      medieval: 2,
      "19th-century": 3,
      // §88 moves this from three to four with Siamanto, who reused the value
      // Varoujan had already reused. Measured, so it goes red on each arrival.
      "20th-century": 4,
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

    // Medieval is Narekatsi and, since §86, Shnorhali — in that order, which is
    // listing order rather than chronology. Tumanyan is still the only featured writer.
    expect(cards.filter((w) => w.periodId === "medieval").map((w) => w.slug)).toEqual([
      NAREKATSI,
      SHNORHALI,
    ]);
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
  /*
    §86 refills the list with Shnorhali, so this narrows the same way the §82
    Narekatsi assertion did when Varoujan arrived: from "nothing is pending" to
    the thing this test is about — Varoujan is not on it, and what is on it is
    not his file.
  */
  expect([...PENDING_ARTWORK], "the pending list is empty again").toEqual([...PENDING]);

  // Eight writers, eight portraits, each its own file, and none of the seven
  // that existed before §85 moved.
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
    "exactly the pending writers show a placeholder",
  ).toHaveCount(PENDING.length);
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
  // filter is still Narekatsi alone. The count moved from three to four at §88
  // because Siamanto joined the same period — Varoujan's own membership, which is
  // what this test is about, is asserted by the image locator on the next line.
  await page.goto("/en/writers?period=20th-century");
  await expect(cards(page)).toHaveCount(4);
  await expect(page.locator(`main img[src*="${VAROUJAN}"]`)).toHaveCount(1);
  // §86 gave medieval a second member, so this moves from one to two; Narekatsi's
  // own card is still asserted directly.
  await page.goto("/en/writers?period=medieval");
  await expect(cards(page)).toHaveCount(2);
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
    The default is the cautious one, and every writer outside the map takes it.
    Several of them were certainly photographed, but this archive never recorded
    that their portraits were made from those photographs, and inferring it would
    be inventing provenance rather than reporting it. A slug joins the map when the
    fact is established, which is what this assertion is here to notice.

    §89 made this a set rather than the single-slug exception §85 wrote, because
    Siamanto is the second writer whose artwork was made from identified
    photographs. Stated as its own literal so that adding a third is one edit and
    an *unearned* promotion still goes red here — which is the whole point of the
    loop, and would be lost if the exception list were derived from the map.
  */
  const PHOTO_REFERENCED: readonly string[] = [VAROUJAN, SIAMANTO];
  for (const slug of SLUGS) {
    if (PHOTO_REFERENCED.includes(slug)) continue;
    expect(getPortraitProvenance(slug), `${slug} takes the cautious default`).toBe("imagined");
  }
  for (const slug of PHOTO_REFERENCED) {
    expect(
      getPortraitProvenance(slug),
      `${slug}'s portrait was made from surviving photographs`,
    ).toBe("photo-referenced");
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
    criticism actually makes. §84 noted that Siamanto was the strongest relation
    this article could have and did not exist, so it was absent rather than
    fabricated. §88 wrote him, and this article was still not touched: the relation
    is authored from Siamanto to Varoujan, where the evidence sits — Varoujan's own
    1913 notice of `Կարմիր լուրեր բարեկամէս` — and is not mirrored back for
    symmetry. So the expected list below is unchanged, and that is the assertion.
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

/* -------------------------------------------------------------------------- */
/*  Writer #9 — Nerses Shnorhali                                               */
/* -------------------------------------------------------------------------- */

test("the ninth writer exists in every edition and is the section's second medieval author", () => {
  /*
    §86. Structural parity first, and the taxonomy claim that matters: `medieval`
    goes from one member to two and no new filter value was created for a
    twelfth-century Cilician churchman, which is the outcome the step's audit
    predicted and the thing most likely to have been done wrong.
  */
  for (const locale of LOCALES) {
    const b = bundle(locale);
    const writers = b.articles.filter((a) => a.category === "writers");
    const cardList = b.writers;

    expect(writers.length, `${locale} article count`).toBe(SLUGS.length);
    expect(cardList.length, `${locale} card count`).toBe(SLUGS.length);
    expect(
      cardList.map((w) => w.slug),
      `${locale} order parity`,
    ).toEqual(writers.map((a) => a.slug));

    const article = writers.find((a) => a.slug === SHNORHALI);
    const card = cardList.find((w) => w.slug === SHNORHALI);
    expect(article, `${locale} Shnorhali article`).toBeDefined();
    expect(card, `${locale} Shnorhali card`).toBeDefined();
    expect(article!.periodId, `${locale} period`).toBe("medieval");
    expect(card!.periodId, `${locale} card period`).toBe("medieval");
    expect(card!.period, `${locale} label parity`).toBe(article!.period);

    // No `cilician`, `church`, `theologian` or `12th-century` value was invented.
    expect(
      b.literaryPeriods.map((f) => f.id),
      `${locale} taxonomy unchanged`,
    ).toEqual(["all", "medieval", "19th-century", "20th-century", "soviet"]);

    // The eight writers who were here before him are untouched.
    for (const slug of ILLUSTRATED) {
      expect(writers.some((a) => a.slug === slug), `${locale} ${slug} still present`).toBe(true);
    }
  }
});

test("Shnorhali's identity is literary, and his names are not collapsed into one", async ({
  page,
}) => {
  /*
    §86. The English SERP for this subject is dominated by saint biographies,
    prayer pages and ecumenical history, and the risk the step named is that the
    archive produces a ninth version of that. These assertions pin the opposite:
    the visible headline is the plain personal name, the epithet is explained
    rather than guessed at, and the aliases live in metadata instead of spawning
    routes.
  */
  await page.goto(`/en/writers/${SHNORHALI}`);
  await expect(page.locator("h1")).toHaveText("Nerses Shnorhali");

  const en = await prose(page, "en", SHNORHALI);

  // The epithet is explained, and its origin is left open rather than invented.
  expect(en, "explains what Shnorhali means").toMatch(/full of grace|the Graceful/i);
  expect(en, "does not settle why the epithet attached").toMatch(/not settled|does not decide/i);

  // The birth name is reported as unknown — the fact popular summaries drop.
  expect(en, "birth name unknown").toMatch(/birth name is not known|birth name is unknown/i);

  // Aliases are present as context, and none of them is a second page.
  for (const alias of ["Nerses IV", "Nerses Klayetsi", "Nerses of Lambron"]) {
    expect(en, `mentions ${alias}`).toContain(alias);
  }
  // The disambiguation from his near-namesake is explicit rather than implied.
  expect(en, "distinguishes Nerses of Lambron").toMatch(/not be confused|is not Nerses of Lambron/i);

  for (const bad of ["/en/writers/nerses-the-graceful", "/en/writers/nerses-iv"]) {
    const res = await page.request.get(bad);
    expect(res.status(), `${bad} must not be a second route`).toBe(404);
  }
});

test("Shnorhali's literary and historical claims stay inside the evidence", async ({ page }) => {
  /*
    §86, and the test that carries most of this step's editorial work. Four
    popular claims about this subject are wrong or unprovable, and each is pinned
    by its refusal rather than by banning words — the discipline this file adopted
    at §16, because a naive substring ban fails on the refutation itself.
  */
  const en = await prose(page, "en", SHNORHALI);

  // 1. He did not invent Armenian rhyme. The article says so.
  expect(en, "refuses the invented-rhyme claim").toMatch(
    /rhyme in Armenian verse is older than he is/i,
  );
  expect(en, "names the claim it is refusing").toMatch(/introducing rhyme|inventing Armenian/i);
  // What replaces it is the concrete technical fact.
  expect(en, "the monorhyme is described concretely").toMatch(
    /every line ends on the same syllable|single rhyme is sustained/i,
  );

  // 2. No hymn or work count is asserted.
  expect(en, "refuses a corpus count").toMatch(/No total is given/i);
  expect(en, "explains why a count is impossible").toMatch(/fourteenth century/i);

  // 3. Cilicia was a principality in his lifetime, not a kingdom. The article
  //    names the wrong version in order to correct it, so the assertion is on the
  //    correction and not on the absence of the phrase.
  expect(en, "states the principality").toMatch(/principality under the Rubenid house/i);
  expect(en, "dates the kingdom after his death").toMatch(/1198/);
  expect(en, "corrects the kingdom claim").toMatch(/a state that did not yet exist/i);

  // 4. Ecumenism is handled as an anachronism risk rather than adopted.
  expect(en, "flags the modern term").toMatch(/pioneer of ecumenism/i);
  expect(en, "bounds it historically").toMatch(/twentieth-century movement|its own terms/i);

  // Language: nuanced, not the flat Middle Armenian claim.
  expect(en, "major works are grabar").toMatch(/Classical Armenian, grabar|literary works are grabar/i);
  expect(en, "names the transition").toContain("Middle Armenian");
  expect(en, "refuses the flat formulation").toMatch(/is not adopted here/i);

  // Chronology and geography.
  expect(en, "death date exact").toContain("13 August 1173");
  expect(en, "birth year hedged").toMatch(/about 1102/);
  expect(en, "birth year uncertainty stated").toMatch(/1100|1101/);
  expect(en, "Hromkla named").toContain("Hromkla");
  expect(en, "the see was already at Hromkla").toMatch(/brother established it there|inherited a seat/i);
  expect(en, "catholicos chronology").toMatch(/1166/);

  // Works are attributed with their Armenian titles.
  for (const work of ["Ողբ Եդեսիոյ", "Յիսուս Որդի", "Հաւատով խոստովանիմ", "Առաւօտ լուսոյ"]) {
    expect(en, `names ${work}`).toContain(work);
  }
  // Attribution honesty for the doubtful part of the corpus.
  expect(en, "riddles flagged as attributed").toMatch(/attributed rather than counted as certain/i);

  // No devotional instruction anywhere.
  expect(en, "no devotional instruction").not.toMatch(/you should pray|recite this prayer daily/i);
  // And no UNESCO claim, which nothing in the research supported.
  expect(en, "no UNESCO claim").not.toContain("UNESCO");

  // The article is literary first: the works sections outweigh the church office.
  const b = bundle("en");
  const article = b.articles.find((a) => a.slug === SHNORHALI)!;
  const ids = article.sections.map((s) => s.id);
  for (const id of [
    "the-range-of-his-writing",
    "a-thousand-lines-in-one-rhyme",
    "the-lament-on-edessa",
    "jesus-the-son",
    "prayers-and-hymns",
    "the-language-he-wrote-in",
  ]) {
    expect(ids, `literary section ${id} exists`).toContain(id);
  }
  const literary = article.sections
    .filter((s) => !["from-priest-to-catholicos", "letters-and-the-byzantine-negotiations"].includes(s.id))
    .reduce((n, s) => n + s.paragraphs.length, 0);
  const total = article.sections.reduce((n, s) => n + s.paragraphs.length, 0);
  expect(literary / total, "most of the article is not church office").toBeGreaterThan(0.7);
});

test("Shnorhali's portrait is registered, imagined, and borrowed from nobody", async ({
  page,
}) => {
  /*
    §87, and the mirror of the §86 test it replaces. That one asserted every
    surface in its pre-registration form so this one could invert it, and each
    assertion below is the opposite of the one it stood on: registry absent ->
    present, pending -> empty, placeholder SVG -> raster, fallback OG -> his file,
    no sitemap image -> his own. Same shape as the §82 and §85 inversions above,
    because it is the same transition for the third time.

    What this one adds is the provenance half run the *other* way. §85 registered
    a face drawn from photographs and had to add a map entry to say so. Shnorhali
    died in 1173, no likeness of him survives, and the delivered artwork is a
    plausible invented face — which is exactly the situation where an editor is
    tempted to promote it. So the absence of a `PORTRAIT_PROVENANCE` entry is
    asserted here as a decision, not left as a default nobody is watching, and the
    caption is checked to be the imagined one in all three editions.
  */
  expect(getImageSrc(SHNORHALI), "Shnorhali has a registered portrait").toBe(
    "/images/writers/nerses-shnorhali.webp",
  );
  expect(PENDING_ARTWORK, "and is no longer pending").not.toContain(SHNORHALI);
  /*
    §82 asserted this list was empty, §84 refilled it, §85 emptied it, §86 refilled
    it with Shnorhali, §87 emptied it again. §88 refills it with Siamanto, so the
    broad "nothing is pending" form is false once more and has gone; the narrow
    assertion above — that *Shnorhali* is not pending — is what this test is about
    and it still holds. Compared to the stated constant rather than to a literal,
    which is why the refill was one edit.
  */
  expect([...PENDING_ARTWORK], "and matches the registry's own list").toEqual([...PENDING]);

  // Nine registered portraits, each its own file, and none of the eight that
  // existed before §87 moved. §88 added a tenth writer without a tenth portrait,
  // so this is no longer the whole section — which the arithmetic below states.
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
  /*
    §87 asserted here that every writer was illustrated. §88 made that false by
    adding Writer #10 ahead of his picture, and the honest replacement is not a
    weaker version of the same claim but the specific one: exactly one writer is
    pending, and he is the new one. Nothing that was illustrated became pending.
  */
  /*
    §89 registered Siamanto's portrait, so the specific claim §88 substituted here
    is spent and the broad one is true again — and this time it is stronger than
    any version of it before, because the section is complete at ten rather than at
    six or nine. Stated both ways round: nothing is pending, and the writer who was
    pending is now illustrated.
  */
  expect([...PENDING], "nothing is pending").toEqual([]);
  expect(ILLUSTRATED, "the writer who was pending is now illustrated").toContain(SIAMANTO);

  /*
    The provenance decision, at the data level, where it is cheap. He must take
    the cautious default and must *not* be listed — a future editor adding him
    "for completeness" would silently turn an invented face into a documented one,
    and this is the assertion that refuses it.
  */
  expect(getPortraitProvenance(SHNORHALI), "no likeness of him survives").toBe("imagined");
  expect(getPortraitProvenance(NAREKATSI), "Narekatsi unchanged").toBe("imagined");
  expect(getPortraitProvenance(VAROUJAN), "Varoujan unchanged").toBe("photo-referenced");

  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/writers/${SHNORHALI}`);

    const figure = page.locator("header figure");
    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    const hero = figure.locator("img");
    await expect(hero, `${locale} hero raster`).toHaveCount(1);
    await expect(hero, `${locale} hero is his portrait`).toHaveAttribute(
      "src",
      /nerses-shnorhali\.webp/,
    );
    await expect(hero, `${locale} localized alt`).toHaveAttribute(
      "alt",
      dict.article.imageAlt.replace("{title}", articleTitle(locale, SHNORHALI)),
    );

    /*
      The caption is the imagined one, exactly. Asserted as an equality rather
      than as a substring: the two AI captions differ by a clause, and a
      `toContain` on the shared opening would pass on either.
    */
    const caption = figure.locator("figcaption");
    await expect(caption, `${locale} imagined provenance`).toHaveText(
      dict.article.imageAiPortraitCaption.replace("{title}", articleTitle(locale, SHNORHALI)),
    );
    // And is explicitly not the photo-referenced one, which would claim surviving
    // photographs of a twelfth-century writer.
    await expect(caption, `${locale} claims no photographs`).not.toHaveText(
      dict.article.imageAiPhotoPortraitCaption.replace("{title}", articleTitle(locale, SHNORHALI)),
    );
    await expect(caption, `${locale} not the scene caption`).not.toHaveText(
      dict.article.imageAiIllustrationCaption.replace("{title}", articleTitle(locale, SHNORHALI)),
    );
    await expect(caption, `${locale} no placeholder disclosure`).not.toHaveText(
      dict.article.imagePlaceholderCaption.replace("{title}", articleTitle(locale, SHNORHALI)),
    );

    // No other writer's portrait is rendered without a link to that writer.
    const html = (await page.content()).toLowerCase();
    for (const other of ILLUSTRATED) {
      if (other === SHNORHALI) continue;
      expect(
        html.includes(`${other}.webp`) && !html.includes(`/${locale}/writers/${other}`),
        `${locale} must not show ${other}'s portrait without linking to ${other}`,
      ).toBe(false);
    }
  }

  // Metadata points at his file rather than falling back.
  await page.goto(`/en/writers/${SHNORHALI}`);
  const graph = await readGraph(page);
  const image = node(graph, "Article").image as { "@type": string; url: string } | undefined;
  expect(image, "Article.image is present").toBeDefined();
  expect(image!["@type"], "and is an ImageObject").toBe("ImageObject");
  expect(image!.url, "pointing at his own portrait").toBe(
    "https://armat.site/images/writers/nerses-shnorhali.webp",
  );
  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(sel), `${sel} is his portrait`).toHaveAttribute(
      "content",
      "https://armat.site/images/writers/nerses-shnorhali.webp",
    );
  }

  /*
    The sitemap is checked per locale block rather than by counting occurrences
    archive-wide: a global count passes when three images land on one URL.
  */
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  for (const locale of LOCALES) {
    const block = sitemap
      .split("<url>")
      .find((entry) => entry.includes(`/${locale}/writers/${SHNORHALI}<`));
    expect(block, `${locale} Shnorhali is in the sitemap`).toBeDefined();
    expect(block, `${locale} advertises his own image`).toContain(
      "<image:loc>https://armat.site/images/writers/nerses-shnorhali.webp</image:loc>",
    );
  }

  // The listing shows every writer, with a placeholder for exactly the pending
  // ones. §87 could assert zero placeholders; §88 has one, and pinning it to
  // `PENDING.length` is what keeps this line honest through the next refill.
  await page.goto("/en/writers");
  await expect(cards(page)).toHaveCount(SLUGS.length);
  await expect(page.locator("main svg[role='img']")).toHaveCount(PENDING.length);
});

test("Shnorhali carries localized SEO fields and is findable under his variants", async ({
  page,
}) => {
  /*
    §86. He is the third writer built on the SEO architecture §81 introduced, and
    the aliases are the point: an English reader looking for Nerses the Graceful
    and an Armenian reader looking for Ներսես Շնորհալի must both land on the one
    page, without a second route existing for either.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SHNORHALI)!;
    expect(article.seoTitle, `${locale} seoTitle`).toBeTruthy();
    expect(article.metaDescription, `${locale} metaDescription`).toBeTruthy();
    expect(article.summary, `${locale} summary`).toBeTruthy();
    expect(article.metaDescription!.length, `${locale} metaDescription length`).toBeLessThanOrEqual(165);
    // The visible headline is never the SEO one.
    expect(article.seoTitle, `${locale} seoTitle differs from H1`).not.toBe(article.title);
    expect(article.keywords?.length ?? 0, `${locale} keywords`).toBeGreaterThan(8);

    await page.goto(`/${locale}/writers/${SHNORHALI}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://armat.site/${locale}/writers/${SHNORHALI}`,
    );
    for (const other of LOCALES) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${other}"]`).first(),
      ).toHaveAttribute("href", `https://armat.site/${other}/writers/${SHNORHALI}`);
    }
  }

  const QUERIES: Record<string, string[]> = {
    en: ["Nerses Shnorhali", "Nerses the Graceful", "Shnorhali"],
    hy: ["Ներսես Շնորհալի", "Շնորհալի"],
    hyw: ["Ներսէս Շնորհալի", "Շնորհալի"],
  };
  for (const locale of LOCALES) {
    for (const q of QUERIES[locale]) {
      await page.goto(`/${locale}/search?q=${encodeURIComponent(q)}`);
      await expect(
        page.locator(`main a[href="/${locale}/writers/${SHNORHALI}"]`).first(),
        `${locale} search "${q}"`,
      ).toHaveCount(1);
    }
  }
});

test("Shnorhali's one relation is earned, and invents no Work slug", async ({ page }) => {
  /*
    §86. One authored relation, not three. Narekatsi is earned because the article
    makes a specific literary-historical claim about him that a reader would want
    to follow — and the SectionLink phrase sits inside the paragraph that makes it.
    The Matenadaran was considered and refused: no named Shnorhali manuscript was
    established by this step's research, and a relation on the general ground that
    he is medieval would be exactly the reflex §39 warned against.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SHNORHALI)!;
    expect(article.relatedSlugs, `${locale} one authored relation`).toEqual([NAREKATSI]);

    const links = article.sections.flatMap((s) => s.links ?? []);
    expect(links.map((l) => l.slug), `${locale} SectionLink targets`).toEqual([NAREKATSI]);

    // Every SectionLink phrase is a real substring of its own section's prose.
    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((p) => p.includes(link.phrase)),
          `${locale} phrase for ${link.slug} must appear in ${section.id}`,
        ).toBe(true);
      }
    }

    // No Work slug was invented for any of his texts.
    const workSlugs = new Set(bundle(locale).works.map((w) => w.slug));
    for (const invented of [
      "lament-on-edessa",
      "jesus-the-son",
      "havatov-khostovanim",
      "aravot-luso",
      "the-song-of-the-bread",
      "book-of-lamentations",
    ]) {
      expect(workSlugs.has(invented), `${locale} ${invented} must not exist`).toBe(false);
      expect(article.relatedSlugs, `${locale} no relation to ${invented}`).not.toContain(invented);
    }
    expect(bundle(locale).works.length, `${locale} Works untouched`).toBe(4);
  }

  // Narekatsi was not edited for reciprocity.
  for (const locale of LOCALES) {
    const narekatsi = bundle(locale).articles.find((a) => a.slug === NAREKATSI)!;
    expect(narekatsi.relatedSlugs, `${locale} Narekatsi relations unchanged`).toEqual([
      "matenadaran",
      "bagratid-armenia",
    ]);
  }

  // Filler measured rather than assumed, and identical across editions.
  const rendered: Record<string, string[]> = {};
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/writers/${SHNORHALI}`);
    const hrefs = await page
      .locator('main a[href*="/writers/"]')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""));
    rendered[locale] = [...new Set(hrefs.map((h) => h.split("/").pop()!))].filter(
      (s) => s && s !== SHNORHALI,
    );
  }
  for (const locale of LOCALES) {
    expect(rendered[locale], `${locale} renders the authored relation`).toContain(NAREKATSI);
  }
});

test("adding Shnorhali changed no existing writer, work, dish or place", async ({ page }) => {
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(b.articles.filter((a) => a.category === "cuisine").length, `${locale} cuisine`).toBe(12);
    expect(b.articles.filter((a) => a.category === "places").length, `${locale} places`).toBe(13);
    expect(b.articles.filter((a) => a.category === "history").length, `${locale} history`).toBe(7);
    expect(b.works.length, `${locale} works`).toBe(4);

    // Varoujan, closed one step earlier, is exactly as §85 left him.
    const varoujan = b.articles.find((a) => a.slug === VAROUJAN)!;
    expect(varoujan.relatedSlugs, `${locale} Varoujan relations`).toEqual([
      TUMANYAN,
      "yeghishe-charents",
    ]);
    expect(varoujan.periodId, `${locale} Varoujan period`).toBe("20th-century");
    expect(getImageSrc(VAROUJAN)).toBe("/images/writers/daniel-varoujan.webp");
  }

  // Varoujan still serves his own portrait and his photo-referenced caption.
  await page.goto(`/en/writers/${VAROUJAN}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://armat.site/images/writers/daniel-varoujan.webp",
  );
  await expect(page.locator("header figure figcaption")).toHaveText(
    ui("en").article.imageAiPhotoPortraitCaption.replace(
      "{title}",
      articleTitle("en", VAROUJAN),
    ),
  );
});

/* -------------------------------------------------------------------------- */
/*  Writer #10 — Siamanto                                                      */
/* -------------------------------------------------------------------------- */

test("the tenth writer exists in every edition and reuses the existing taxonomy", () => {
  /*
    §88. The corpus checks for a new arrival, run as data. Two things this asserts
    that a count alone would not: that the card and the article agree on the
    period in every edition — they live in different files — and that no new
    filter id was invented for him. `20th-century` already existed and already had
    members; a tenth writer must not arrive with a taxonomy of his own.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SIAMANTO);
    expect(article, `${locale} has Siamanto`).toBeDefined();
    expect(article!.periodId, `${locale} Siamanto is twentieth-century`).toBe("20th-century");

    const card = bundle(locale).writers.find((w) => w.slug === SIAMANTO);
    expect(card, `${locale} has a Siamanto card`).toBeDefined();
    expect(card!.periodId, `${locale} card period`).toBe("20th-century");
    expect(card!.period, `${locale} card and article agree on the label`).toBe(article!.period);
    expect(card!.featured ?? false, `${locale} Siamanto is not featured`).toBe(false);

    expect(
      bundle(locale).literaryPeriods.map((f) => f.id),
      `${locale} literary periods unchanged`,
    ).toEqual(["all", "medieval", "19th-century", "20th-century", "soviet"]);

    // Tumanyan is still the section's only featured entity.
    expect(
      bundle(locale).writers.filter((w) => w.featured).map((w) => w.slug),
      `${locale} featured writers`,
    ).toEqual([TUMANYAN]);
  }
});

test("Siamanto's contested facts are stated with their evidence, not smoothed over", async ({
  page,
}) => {
  /*
    §88. This subject's reference literature disagrees with itself, and the four
    disagreements below are the reason the article was worth writing rather than
    linking to. Each is pinned by the sentence that does the work, because a
    summary rewrite would drop exactly those sentences and leave a page that reads
    like every other one.

    Following the discipline this file arrived at with Narekatsi: where the page
    names a claim in order to refuse it, the test pins the refusal. A substring ban
    on "Sorbonne" or on "1875" would fail on the refutation itself.
  */
  const en = await prose(page, "en", SIAMANTO);

  // 1. The birth date. Three are in print; the article names all three and says
  //    why it takes one, rather than picking silently.
  expect(en, "the majority date").toContain("15 August 1878");
  expect(en, "the database date is named, not deleted").toContain("1 January 1878");
  expect(en, "and the third, from the translation's jacket").toContain("1875");
  expect(en, "with the reason the first one wins").toContain(
    "A date that explains a name is evidence of a different order",
  );

  // 2. The Sorbonne. The inflation is named and refused; no degree is claimed.
  expect(en, "the actual status").toContain("free listener");
  expect(en, "in the words the French universities use").toContain("auditeur libre");
  expect(en, "the refusal is explicit").toContain("He did not take a degree there");
  expect(en, "and it is the reference works that inflated it").toContain(
    "have quietly converted this into an education at the University of Paris",
  );

  // 3. The free-verse claim, which is the one most often over-translated.
  expect(en, "the Armenian formula is quoted, not paraphrased").toContain("gave form to");
  expect(en, "and the upgrade is refused in as many words").toContain(
    "That is not the same as inventing it",
  );
  expect(en, "no first-ever claim is made").toContain(
    "not that he was the first Armenian ever to write one",
  );

  // 4. The pen name: the specific etymology, and the corroboration that makes it
  //    better than the vaguer English version.
  expect(en, "the folk-poem origin").toContain("Sia-Mandon");
  expect(en, "corroborated by the sister's matching name").toContain("Khechezare");
  // The one part of the naming story the record does not support is flagged.
  expect(en, "and the chronological problem is not hidden").toContain(
    "no biography of him records a teaching post at Akn",
  );
});

test("the geography, the labels and the 1915 chronology are precise", async ({ page }) => {
  /*
    §88. Four failures this article is built to avoid, each of which is the
    commonest version of its mistake elsewhere: filing Akn in the wrong province,
    flattening him into a symbolist, collapsing the arrest into the death, and
    sending him to Varoujan's prison.
  */
  const en = await prose(page, "en", SIAMANTO);

  // Akn's Ottoman unit, stated, with the usual error refused by name.
  expect(en, "the kaza").toContain("kaza");
  expect(en, "the vilayet").toContain("vilayet of Mamuret-ül-Aziz");
  expect(en, "and the error it is usually given as").toContain(
    "It was not in the province of Sivas",
  );
  // Western Armenia is used as a cultural term and said to be one.
  expect(en, "the cultural-geography caveat is kept").toContain(
    "names a cultural and demographic geography rather than an Ottoman administrative unit",
  );

  // The movement labels are compound and sourced, not a single borrowed word.
  expect(en, "the label English uses is named").toContain("labelled a symbolist in English");
  expect(en, "and refused as too simple").toContain("that is too simple");
  expect(en, "the placement Armenian criticism actually makes").toContain("neo-romanticism");

  // Arrest and death are separated, and the separation is stated as the point.
  expect(en, "the arrest date").toContain("24 April 1915");
  expect(en, "the death month").toContain("August 1915");
  expect(en, "the two are explicitly not the same event").toContain(
    "It is the date of the arrests and not the date of his death",
  );
  // No precise death date is manufactured.
  expect(en, "the record's limit is stated").toContain(
    "no survivor's account fixes the day for him individually",
  );
  expect(en, "and sources that supply one are named as doing so").toContain(
    "Sources that give him a precise date are supplying one",
  );

  // Ayaş, not Chankiri — the distinction that decides why the two deaths are
  // documented so unequally.
  expect(en, "his prison").toContain("Siamanto was sent to Ayaş");
  expect(en, "and Varoujan's").toContain("Daniel Varoujan was sent to Chankiri");
});

test("the article is a literary biography and does not illustrate the atrocities", async ({
  page,
}) => {
  /*
    §88. The standing rule from §84's Varoujan article, applied to the subject it
    is hardest for: a poet whose best-known book is about a massacre, written in
    the year of it. The book has to be described — its form is the whole point —
    without reproducing what it describes.

    Asserted as a ratio rather than as a word ban, because the words are
    unavoidable in a page that has to say what the book is about. What is checked
    is that the literary material dominates and that the refusal is explicit.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SIAMANTO)!;
    const ids = article.sections.map((s) => s.id);

    // The 1915 material is one section out of a long article, and it is not first.
    expect(ids, `${locale} has the arrest section`).toContain("arrest-ayas-and-death");
    expect(ids.indexOf("arrest-ayas-and-death"), `${locale} the death is not the opening`).
      toBeGreaterThan(8);
    expect(ids.length, `${locale} the article is a full biography`).toBeGreaterThanOrEqual(15);
    // The last word is the work, not the killing.
    expect(ids[ids.length - 1], `${locale} closes on the legacy`).toBe("what-survived");

    // Sections whose subject is the writing rather than the dying.
    for (const id of [
      "the-collections",
      "free-verse-and-the-line",
      "western-armenian",
      "romanticism-symbolism-and-narekatsi",
    ]) {
      expect(ids, `${locale} keeps the literary section ${id}`).toContain(id);
    }
  }

  const en = await prose(page, "en", SIAMANTO);
  expect(en, "the refusal is stated for the book").toContain(
    "Armat does not reproduce those scenes",
  );
  expect(en, "and for the killings").toContain("Armat does not describe the killings");
  expect(en, "with the reason").toContain("this is a biography of a poet");
  // The book is still described as a book: form, structure and method.
  expect(en, "its form").toContain("the poems are letters");
  expect(en, "its structure").toContain("twelve pieces in all");
  expect(en, "and its technique").toContain("refusal is a deliberate technique");
});

test("Siamanto's relations are earned, and no Work slug was invented for him", async ({
  page,
}) => {
  /*
    §88. Three authored relations, each carried by a SectionLink in the paragraph
    that justifies it: Varoujan on the evidence of his own 1913 notice, Narekatsi
    on the comparison Armenian criticism actually makes, and Mashtots because the
    subject of `Սուրբ Մեսրոպ` is the man who made the alphabet.

    The Varoujan direction is the point of this test. It is authored one way only.
  */
  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SIAMANTO)!;
    expect(article.relatedSlugs, `${locale} authored relations`).toEqual([
      VAROUJAN,
      NAREKATSI,
      "mesrop-mashtots-armenian-alphabet",
    ]);

    const links = article.sections.flatMap((s) => s.links ?? []);
    expect(links.map((l) => l.slug).sort(), `${locale} SectionLink targets`).toEqual([
      VAROUJAN,
      NAREKATSI,
      "mesrop-mashtots-armenian-alphabet",
    ].sort());

    // Every SectionLink phrase is a real substring of its own section's prose.
    for (const section of article.sections) {
      for (const link of section.links ?? []) {
        expect(
          section.paragraphs.some((p) => p.includes(link.phrase)),
          `${locale} phrase for ${link.slug} must appear in ${section.id}`,
        ).toBe(true);
      }
    }

    // Works is untouched, and none of his books became a Work slug.
    expect(bundle(locale).works.map((w) => w.slug), `${locale} works unchanged`).toEqual([
      "anush",
      "wounds-of-armenia",
      "the-fool",
      "david-of-sassoun",
    ]);
    const slugs = new Set(bundle(locale).articles.map((a) => a.slug));
    for (const invented of [
      "karmir-lurer-barekames",
      "bloody-news-from-my-friend",
      "hayordiner",
      "surb-mesrop",
      "hayreni-hraver",
      "dyutsaznoren",
    ]) {
      expect(slugs.has(invented), `${locale} must not have invented ${invented}`).toBe(false);
    }
    for (const rel of article.relatedSlugs) {
      expect(slugs.has(rel), `${locale} related ${rel} must exist`).toBe(true);
    }
  }

  // The evidence for the Varoujan relation is in the prose, not just in the link.
  const en = await prose(page, "en", SIAMANTO);
  expect(en, "the attributable sentence").toContain("gifted song of crime");
  expect(en, "with where it was printed").toContain("Գրական ասուլիսներ");
  expect(en, "and the reciprocity is refused in as many words").toContain(
    "not mirrored back for symmetry",
  );
});

test("Siamanto's name forms are carried per edition and reach the search haystack", async ({
  page,
}) => {
  /*
    §88. The orthography split is the substantive part. `Սիամանթօ` is the classical
    and Western form and `Սիամանթո` the Eastern one, and an edition that printed
    the wrong one would be spelling its own subject the way the other edition's
    readers do. Both must nonetheless be findable from either, which is what the
    keyword list is for.
  */
  expect(bundle("hyw").writers.find((w) => w.slug === SIAMANTO)!.name, "hyw uses the classical form")
    .toBe("Սիամանթօ");
  expect(bundle("hy").writers.find((w) => w.slug === SIAMANTO)!.name, "hy uses the Eastern form")
    .toBe("Սիամանթո");
  expect(bundle("en").writers.find((w) => w.slug === SIAMANTO)!.name, "en romanises").toBe(
    "Siamanto",
  );

  for (const locale of LOCALES) {
    const article = bundle(locale).articles.find((a) => a.slug === SIAMANTO)!;
    expect(article.seoTitle, `${locale} seoTitle`).toBeTruthy();
    expect(article.metaDescription, `${locale} metaDescription`).toBeTruthy();
    expect(article.summary, `${locale} summary`).toBeTruthy();
    expect(article.metaDescription!.length, `${locale} metaDescription length`)
      .toBeLessThanOrEqual(165);

    const keywords = article.keywords ?? [];
    // Both orthographies and the birth name, in every edition, because a reader
    // types what they know rather than what the edition prefers.
    for (const form of ["Սիամանթօ", "Սիամանթո", "Siamanto"]) {
      expect(keywords, `${locale} carries the ${form} form`).toContain(form);
    }
    expect(
      keywords.some((k) => k.includes("Yarjanian")),
      `${locale} carries the birth surname romanised`,
    ).toBe(true);
    expect(
      keywords.some((k) => k.includes("Եարճանեան") || k.includes("Յարճանյան")),
      `${locale} carries the birth surname in Armenian`,
    ).toBe(true);
  }

  // One route, reachable in every edition, and the page is his.
  for (const locale of LOCALES) {
    await page.goto(`/${locale}/writers/${SIAMANTO}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      articleTitle(locale, SIAMANTO),
    );
  }
});

test("Siamanto's portrait is registered as photo-referenced, and the section is complete", async ({
  page,
}) => {
  /*
    §89, replacing the §88 test that asserted the absence of everything below. That
    test existed to make shipping the artwork without revisiting the provenance
    fail, and this is it being revisited: he takes `photo-referenced` rather than
    the default, on the strength of two identified lifetime photographs recorded
    beside the map entry.

    Both directions of the §86/§88 rule are now asserted side by side in one place,
    which is the point of keeping them together. Shnorhali is kept *out* of the map
    because nothing of his face survives and a convincing painting is not evidence.
    Siamanto is put *into* it because photographs of him do survive and the artwork
    was made from them. The type follows what survives of the subject, never how
    convincing the picture looks — and the default stays `imagined` for anyone
    nobody has established a basis for.
  */
  expect(getImageSrc(SIAMANTO), "his own portrait file is registered").toBe(
    "/images/writers/siamanto.webp",
  );
  expect([...PENDING_ARTWORK], "and he is no longer pending").not.toContain(SIAMANTO);
  expect([...PENDING_ARTWORK], "nothing anywhere is pending").toEqual([]);

  // He is in the map, and everyone else's classification is exactly as §88 left it.
  expect(getPortraitProvenance(SIAMANTO), "photographs of him survive").toBe("photo-referenced");
  expect(getPortraitProvenance(VAROUJAN), "Varoujan photo-referenced").toBe("photo-referenced");
  expect(getPortraitProvenance(SHNORHALI), "Shnorhali imagined").toBe("imagined");
  expect(getPortraitProvenance(NAREKATSI), "Narekatsi imagined").toBe("imagined");
  expect(getPortraitProvenance("no-such-writer"), "the default is still the cautious one").toBe(
    "imagined",
  );

  // Ten writers, ten portraits, ten distinct files, no placeholder anywhere.
  expect(ILLUSTRATED.length, "every writer is illustrated").toBe(SLUGS.length);
  expect(
    new Set(SLUGS.map((s) => getImageSrc(s))).size,
    "and no two writers share a file",
  ).toBe(SLUGS.length);

  // The hero is his own raster with the photo-referenced caption — not a
  // placeholder, and not the imagined-likeness caption Narekatsi and Shnorhali get.
  for (const locale of LOCALES) {
    const dict = ui(locale);
    await page.goto(`/${locale}/writers/${SIAMANTO}`);
    const figure = page.locator("header figure");

    await expect(figure.locator("svg[role='img']"), `${locale} no placeholder`).toHaveCount(0);
    const img = figure.locator("img");
    await expect(img, `${locale} one raster hero`).toHaveCount(1);
    expect(
      decodeURIComponent((await img.getAttribute("src")) ?? ""),
      `${locale} hero is his own file`,
    ).toContain("/images/writers/siamanto.webp");
    expect(await img.getAttribute("alt"), `${locale} localized hero alt`).toBe(
      dict.article.imageAlt.replace("{title}", articleTitle(locale, SIAMANTO)),
    );

    await expect(figure.locator("figcaption"), `${locale} photo-referenced caption`).toHaveText(
      dict.article.imageAiPhotoPortraitCaption.replace("{title}", articleTitle(locale, SIAMANTO)),
    );
    expect(
      await figure.locator("figcaption").textContent(),
      `${locale} must not carry the imagined-likeness caption`,
    ).not.toBe(
      dict.article.imageAiPortraitCaption.replace("{title}", articleTitle(locale, SIAMANTO)),
    );

    // And still no borrowed face: another writer's file may only appear on his page
    // if the page also links to that writer.
    const html = (await page.content()).toLowerCase();
    for (const other of ILLUSTRATED) {
      if (other === SIAMANTO) continue;
      expect(
        html.includes(`${other}.webp`) && !html.includes(`/${locale}/writers/${other}`),
        `${locale} must not show ${other}'s portrait without linking to ${other}`,
      ).toBe(false);
    }
  }
});

test("Siamanto's portrait reaches the listing, search, metadata and sitemap", async ({ page }) => {
  /*
    §89. The other half of registration: the file being in `IMAGES` is worth
    nothing if the four places that read it still serve a fallback. Each is
    asserted against the exact path rather than against "some image", and the
    sitemap per locale block rather than by an archive-wide count, because a global
    count passes when all three images land on one URL.
  */
  const FILE = "/images/writers/siamanto.webp";
  const ABS = `https://armat.site${FILE}`;

  // Listing: ten cards, ten portraits, no placeholder, and his card is his file.
  await page.goto("/en/writers");
  await expect(cards(page)).toHaveCount(SLUGS.length);
  await expect(page.locator("main svg[role='img']"), "no placeholder remains").toHaveCount(0);
  await expect(
    page.locator(`main img[src*="${SIAMANTO}"]`),
    "his card carries his own portrait",
  ).toHaveCount(1);

  // The period filter §88 moved to four still holds, and he is in it with his face.
  await page.goto("/en/writers?period=20th-century");
  await expect(cards(page), "four twentieth-century writers").toHaveCount(4);
  await expect(page.locator(`main img[src*="${SIAMANTO}"]`)).toHaveCount(1);

  // Tumanyan is still the only featured writer — registering a portrait must not
  // promote anyone.
  for (const locale of LOCALES) {
    const featured = bundle(locale).writers.filter((w) => w.featured);
    expect(featured.map((w) => w.slug), `${locale} sole featured writer`).toEqual([TUMANYAN]);
  }

  // Search: his own portrait, under every name form, scoped by canonical href.
  for (const query of ["Siamanto", "Atom Yarjanian", "Սիամանթո", "Սիամանթօ", "Ատոմ Եարճանեան"]) {
    await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
    const hit = page.locator(`main li:has(a[href="/en/writers/${SIAMANTO}"])`).first();
    await expect(hit, `search "${query}" finds him`).toHaveCount(1);
    await expect(
      hit.locator(`img[src*="${SIAMANTO}"]`),
      `search "${query}" shows his portrait`,
    ).toHaveCount(1);
    await expect(hit.locator("svg[role='img']"), `search "${query}" no placeholder`).toHaveCount(0);
  }

  // Metadata: the generic `Article` schema gains an ImageObject, and OG and
  // Twitter stop falling back. No `Person` or `VisualArtwork` node was added.
  await page.goto(`/en/writers/${SIAMANTO}`);
  const graph = await readGraph(page);
  const image = node(graph, "Article").image as { "@type": string; url: string } | undefined;
  expect(image, "Article.image is present").toBeDefined();
  expect(image!["@type"], "and is an ImageObject").toBe("ImageObject");
  expect(image!.url, "pointing at his own portrait").toBe(ABS);
  for (const absent of ["Person", "VisualArtwork", "Book"]) {
    expect(
      graph.some((n) => n["@type"] === absent),
      `no ${absent} node was added in this step`,
    ).toBe(false);
  }
  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(sel), `${sel} is his portrait`).toHaveAttribute("content", ABS);
  }

  // Sitemap: his own `<url>` block in each edition carries his own image.
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  for (const locale of LOCALES) {
    const block = sitemap
      .split("<url>")
      .find((entry) => entry.includes(`/${locale}/writers/${SIAMANTO}<`));
    expect(block, `${locale} Siamanto is in the sitemap`).toBeDefined();
    expect(block, `${locale} advertises his own image`).toContain(`<image:loc>${ABS}</image:loc>`);
  }
});

test("Siamanto carries a real bibliography, and the hard claims are cited", () => {
  /*
    §88. The `Source` type makes an invented book fail at authoring time, which is
    what this section's bibliographies rest on. What that cannot check is whether
    the sources are the ones the article's contested claims actually need, so the
    four load-bearing ones are named here.
  */
  const sources = getSources(SIAMANTO);
  expect(sources.length, "he has a bibliography").toBeGreaterThanOrEqual(5);
  for (const source of sources) {
    expect(source.identifier.value.trim().length, `${source.title} carries an identifier`)
      .toBeGreaterThan(0);
  }

  const titles = sources.map((s) => s.title).join(" | ");
  // The literary-history backbone this section's modern writers share.
  expect(titles, "Hacikyan").toContain("The Heritage of Armenian Literature");
  // The free-verse claim is not left resting on an encyclopedia formula alone.
  expect(titles, "the metrical study").toContain("Metrical Relations");
  expect(
    sources.some((s) => s.identifier.kind === "doi"),
    "and it is cited by DOI",
  ).toBe(true);
  // The Ayaş/Chankiri distinction has a source of its own.
  expect(titles, "the Ayash prisoners").toContain("Ayash Prisoners");
  // The Varoujan relation is anchored to the 1913 volume, as an archival reference.
  expect(titles, "the 1913 volume").toContain("Գրական ասուլիսներ");
  expect(
    sources.some((s) => s.identifier.kind === "archive"),
    "recorded as an archival reference rather than a URL",
  ).toBe(true);
});

test("adding Siamanto changed no existing writer, work, dish, place or history article", async ({
  page,
}) => {
  /*
    §88. The regression sweep every new arrival gets. The Writers half is the part
    that matters here: nine existing biographies, three settled provenances and one
    featured entity, none of which a tenth writer had any reason to touch.
  */
  for (const locale of LOCALES) {
    const b = bundle(locale);
    expect(b.articles.filter((a) => a.category === "cuisine").length, `${locale} cuisine`).toBe(12);
    expect(b.articles.filter((a) => a.category === "places").length, `${locale} places`).toBe(13);
    expect(b.articles.filter((a) => a.category === "history").length, `${locale} history`).toBe(7);
    expect(b.works.length, `${locale} works`).toBe(4);
    expect(b.articles.filter((a) => a.category === "writers").length, `${locale} writers`).toBe(10);

    // Varoujan is exactly as §85 left him — relations included, and in particular
    // no reciprocal Siamanto link was added to make the pair symmetrical.
    const varoujan = b.articles.find((a) => a.slug === VAROUJAN)!;
    expect(varoujan.relatedSlugs, `${locale} Varoujan relations`).toEqual([
      TUMANYAN,
      "yeghishe-charents",
    ]);
    expect(
      varoujan.sections.flatMap((s) => s.links ?? []).map((l) => l.slug).sort(),
      `${locale} Varoujan links`,
    ).toEqual([TUMANYAN, "yeghishe-charents"]);

    // Shnorhali, closed one step earlier, is untouched too.
    const shnorhali = b.articles.find((a) => a.slug === SHNORHALI)!;
    expect(shnorhali.relatedSlugs, `${locale} Shnorhali relations`).toEqual([NAREKATSI]);

    // The nine existing portraits still resolve to their own files.
    for (const slug of ILLUSTRATED) {
      expect(getImageSrc(slug), `${slug} portrait unchanged`).toBe(PORTRAIT[slug]);
    }
  }

  // Varoujan still serves his own portrait and his photo-referenced caption.
  await page.goto(`/en/writers/${VAROUJAN}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://armat.site/images/writers/daniel-varoujan.webp",
  );
  await expect(page.locator("header figure figcaption")).toHaveText(
    ui("en").article.imageAiPhotoPortraitCaption.replace("{title}", articleTitle("en", VAROUJAN)),
  );
});
