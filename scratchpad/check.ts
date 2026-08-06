/**
 * Structural + numeral parity check for one slug across the three editions.
 *
 * `validate:content` already enforces both of these, but it enforces them over
 * the whole archive and reports them as a wall of failures. This prints the two
 * things that actually drift while an article is being written in three
 * languages one after another — the shape of the sections and the multiset of
 * numbers per validator field group — as a table, so a mismatch is visible
 * before the validator is run rather than after.
 *
 *   npx tsx scratchpad/check.ts lake-sevan
 */
import { getLocaleBundle } from "../src/data";
import { SUPPORTED_LOCALES, type Locale, type Article } from "../src/data/types";

const slug = process.argv[2] ?? "lake-sevan";

// Same regex and the same field grouping as `validateCrossLocaleNumbers`.
const numbersIn = (text: string): string[] => (text.match(/\d{2,}/g) ?? []).sort();

function fieldsOf(article: Article): Map<string, string[]> {
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

function shapeOf(article: Article): Record<string, string> {
  return {
    sections: String(article.sections.length),
    sectionIds: article.sections.map((s) => s.id).join(","),
    paragraphs: article.sections.map((s) => s.paragraphs.length).join(","),
    keyFacts: String(article.keyFacts.length),
    importantDates: String(article.importantDates.length),
    importantYears: article.importantDates.map((d) => d.year).join(","),
    interestingFacts: String(article.interestingFacts.length),
    relatedFigures: String(article.relatedFigures.length),
    relatedSlugs: article.relatedSlugs.join(","),
    links: article.sections
      .flatMap((s) => (s.links ?? []).map((l) => `${s.id}->${l.slug}`))
      .join(","),
    placeTypeId: String(article.placeTypeId),
  };
}

const found = new Map<Locale, Article>();
for (const locale of SUPPORTED_LOCALES) {
  const article = getLocaleBundle(locale).articles.find((a) => a.slug === slug);
  if (article) found.set(locale, article);
  else console.log(`  ${locale}: NOT PRESENT`);
}

if (found.size === 0) {
  console.log(`No edition of "${slug}" found.`);
  process.exit(1);
}

let failures = 0;
const locales = [...found.keys()];
const base = locales[0];
const baseArticle = found.get(base)!;

console.log(`\n"${slug}" — editions present: ${locales.join(", ")}  (baseline: ${base})\n`);

console.log("shape");
const baseShape = shapeOf(baseArticle);
for (const key of Object.keys(baseShape)) {
  const row = locales.map((l) => shapeOf(found.get(l)!)[key]);
  const same = row.every((v) => v === row[0]);
  if (!same) failures++;
  console.log(`  ${same ? "ok  " : "FAIL"} ${key.padEnd(17)} ${row.join("  |  ")}`);
}

console.log("\nnumbers");
const baseFields = fieldsOf(baseArticle);
for (const [field] of baseFields) {
  const row = locales.map((l) => fieldsOf(found.get(l)!).get(field)!.join(" "));
  const same = row.every((v) => v === row[0]);
  if (!same) failures++;
  console.log(`  ${same ? "ok  " : "FAIL"} ${field.padEnd(17)} ${row.map((v) => v || "-").join("  |  ")}`);
}

// The link phrases have to occur in their own section's prose, per edition. The
// validator checks this too; it is here because a translated phrase is the thing
// most likely to stop matching the paragraph it was copied from.
console.log("\nlink phrases");
for (const locale of locales) {
  for (const section of found.get(locale)!.sections) {
    for (const link of section.links ?? []) {
      const ok = section.paragraphs.join("\n").includes(link.phrase);
      if (!ok) failures++;
      console.log(
        `  ${ok ? "ok  " : "FAIL"} ${locale} ${section.id} -> ${link.slug}: "${link.phrase.slice(0, 44)}"`,
      );
    }
  }
}

console.log(failures === 0 ? "\nparity ok\n" : `\n${failures} mismatch(es)\n`);
process.exit(failures === 0 ? 0 : 1);
