/**
 * Per-slug structure and numeral-parity harness.
 *
 * `validate:content` already enforces both of the things this prints — the shared
 * taxonomy and the cross-edition numeral multisets — but it enforces them over the
 * whole archive and reports a wall of failures at the end of a run. This prints the
 * two things that actually drift while one article is being written in three
 * languages one after another, for one slug, as a table:
 *
 *   - the structural shape (sections, paragraphs per section, the counted blocks,
 *     the SectionLink targets);
 *   - the numeral multiset per *validator field group*, using the exact same
 *     extraction rule `validateCrossLocaleNumbers` uses (`/\d{2,}/g`).
 *
 * It is deliberately tolerant of a missing edition, because that is the state it is
 * most useful in: run it after `en`, again after `hy`, and again after `hyw`.
 *
 *   npx tsx scratchpad/check.ts geghard-monastery
 */

import { getLocaleBundle } from "../src/data";
import { SUPPORTED_LOCALES, type Article, type Locale } from "../src/data/types";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: npx tsx scratchpad/check.ts <slug>");
  process.exit(2);
}

/** Exactly the rule in `validateCrossLocaleNumbers`. */
const numbersIn = (text: string): string[] => (text.match(/\d{2,}/g) ?? []).sort();

/** Exactly the field groups in `validateCrossLocaleNumbers`. */
function groups(article: Article): Map<string, string[]> {
  return new Map<string, string[]>([
    ["intro", numbersIn(article.intro)],
    ["summary", numbersIn(article.summary ?? "")],
    ["seoTitle", numbersIn(article.seoTitle ?? "")],
    ["metaDescription", numbersIn(article.metaDescription ?? "")],
    ["keyFacts", article.keyFacts.flatMap((f) => numbersIn(f.value)).sort()],
    [
      "importantDates",
      article.importantDates.flatMap((d) => numbersIn(`${d.year} ${d.event}`)).sort(),
    ],
    ["sections", article.sections.flatMap((s) => s.paragraphs.flatMap(numbersIn)).sort()],
    ["interestingFacts", article.interestingFacts.flatMap(numbersIn).sort()],
    ["relatedFigures", article.relatedFigures.flatMap((f) => numbersIn(f.lifespan)).sort()],
  ]);
}

/** Everything the three editions must agree on structurally. */
function shape(article: Article) {
  return {
    slug: article.slug,
    category: article.category,
    placeTypeId: article.placeTypeId ?? "(none)",
    featured: String(article.featured ?? false),
    sections: String(article.sections.length),
    sectionIds: article.sections.map((s) => s.id).join(","),
    paragraphs: article.sections.map((s) => s.paragraphs.length).join(","),
    paragraphsTotal: String(article.sections.reduce((n, s) => n + s.paragraphs.length, 0)),
    keyFacts: String(article.keyFacts.length),
    importantDates: String(article.importantDates.length),
    interestingFacts: String(article.interestingFacts.length),
    significance: String(article.significance.paragraphs.length),
    relatedFigures: String(article.relatedFigures.length),
    relatedSlugs: article.relatedSlugs.join(","),
    links: String(article.sections.reduce((n, s) => n + (s.links?.length ?? 0), 0)),
    linkTargets: article.sections
      .flatMap((s) => (s.links ?? []).map((l) => `${s.id}->${l.slug}`))
      .join(","),
  };
}

const found = new Map<Locale, Article>();
for (const locale of SUPPORTED_LOCALES) {
  const article = getLocaleBundle(locale).articles.find((entry) => entry.slug === slug);
  if (article) found.set(locale, article);
  else console.log(`  ! "${slug}" is not published in "${locale}"`);
}
if (found.size === 0) process.exit(1);

const locales = [...found.keys()];
const pad = (value: string, width: number) => value.padEnd(width);

function table(title: string, rows: [string, string[]][]): number {
  console.log(`\n${title}`);
  const labelWidth = Math.max(...rows.map(([label]) => label.length), 6);
  const widths = locales.map((locale, i) =>
    Math.max(locale.length, ...rows.map(([, values]) => values[i]?.length ?? 0)),
  );
  console.log(
    `  ${pad("field", labelWidth)}  ${locales.map((l, i) => pad(l, widths[i])).join("  ")}`,
  );
  console.log(`  ${"-".repeat(labelWidth)}  ${widths.map((w) => "-".repeat(w)).join("  ")}`);

  let mismatches = 0;
  for (const [label, values] of rows) {
    const agree = values.every((value) => value === values[0]);
    if (!agree) mismatches++;
    console.log(
      `  ${pad(label, labelWidth)}  ${values.map((v, i) => pad(v, widths[i])).join("  ")}` +
        (agree ? "" : "   <-- DIFFERS"),
    );
  }
  return mismatches;
}

const shapes = locales.map((locale) => shape(found.get(locale)!));
const structural = table(
  `Structure — ${slug}`,
  Object.keys(shapes[0]).map((key) => [
    key,
    shapes.map((entry) => entry[key as keyof typeof entry]),
  ]) as [string, string[]][],
);

const numeric = table(
  `Numerals by validator field group — ${slug}`,
  [...groups(found.get(locales[0])!).keys()].map((group) => [
    group,
    locales.map((locale) => {
      const values = groups(found.get(locale)!).get(group) ?? [];
      return values.length ? values.join(" ") : "(none)";
    }),
  ]),
);

// Only the editions actually present can be compared, so say how many there were.
const total = structural + numeric;
console.log(
  `\n${total === 0 ? "OK" : "FAIL"} — ${total} differing row(s) across ${locales.length} edition(s): ${locales.join(", ")}` +
    (locales.length < SUPPORTED_LOCALES.length ? " (incomplete — some editions missing)" : ""),
);
process.exit(total === 0 ? 0 : 1);
